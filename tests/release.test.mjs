import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { pathToFileURL } from 'node:url';
import { runInNewContext } from 'node:vm';
import { gzipSync } from 'node:zlib';
import { buildRelease, createTarBuffer } from '../scripts/build-release.mjs';
import { createManifestServer } from '../scripts/serve-manifest.mjs';

const require = createRequire(import.meta.url);
const updaterSource = await readFile(new URL('../plugins/OpenMzUpdater.js', import.meta.url), 'utf8');
const originalMain = 'original core';
const originalConfig = 'var $plugins = [{"name":"OpenMzUpdater","status":true}];\n';

function loadUpdater(globals = {}) {
  const module = { exports: {} };
  runInNewContext(updaterSource, { module, URL, setTimeout, clearTimeout, ...globals });
  return module.exports;
}

const { parseTarBuffer, fetchBuffer, upgradeCoreEngine } = loadUpdater();

async function createProject(t) {
  const root = await mkdtemp(join(tmpdir(), 'openmz-release-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const projectRoot = join(root, 'project');
  const outDir = join(root, 'release');
  await mkdir(join(projectRoot, 'js'), { recursive: true });
  await mkdir(outDir);
  await writeFile(join(projectRoot, 'js/main.js'), originalMain);
  await writeFile(join(projectRoot, 'js/plugins.js'), originalConfig);
  return { projectRoot, outDir };
}

function entry(relativePath, content = 'new core') {
  return { relativePath, content: Buffer.from(content) };
}

function makeManifest(bytes) {
  return {
    schemaVersion: 2,
    name: 'OpenMZ',
    version: '1.2.3',
    archive: {
      url: 'openmz-core-1.2.3.tar.gz',
      size: bytes.length,
      sha256: createHash('sha256').update(bytes).digest('hex'),
    },
  };
}

async function writeTestRelease(outDir, files, overrides = {}) {
  const bytes = gzipSync(createTarBuffer(files));
  const manifest = makeManifest(bytes);
  Object.assign(manifest.archive, overrides);
  await writeFile(join(outDir, manifest.archive.url), bytes);
  const manifestPath = join(outDir, 'manifest.json');
  await writeFile(manifestPath, JSON.stringify(manifest));
  return pathToFileURL(manifestPath).href;
}

async function startServer(t, server) {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  t.after(() => new Promise((resolve) => server.close(resolve)));
  return `http://127.0.0.1:${server.address().port}`;
}

function assertOriginalProject(projectRoot) {
  return Promise.all([
    readFile(join(projectRoot, 'js/main.js'), 'utf8').then((source) => assert.equal(source, originalMain)),
    readFile(join(projectRoot, 'js/plugins.js'), 'utf8').then((source) => assert.equal(source, originalConfig)),
  ]);
}

test('tar round trips sorted files, including GNU long paths', () => {
  const long = entry(`js/${'长'.repeat(40)}/library.wasm`, 'long path');
  const short = entry('js/main.js');
  const tar = createTarBuffer([long, short]);
  assert.deepEqual(tar, createTarBuffer([short, long]));
  const decoded = parseTarBuffer(tar);
  assert.equal(decoded.length, 2);
  assert.equal(decoded[0].relativePath, short.relativePath);
  assert.deepEqual(decoded[0].content, short.content);
  assert.equal(decoded[1].relativePath, long.relativePath);
  assert.deepEqual(decoded[1].content, long.content);
});

test('installs the real release over HTTP, backs up originals and disables the updater', async (t) => {
  const { projectRoot, outDir } = await createProject(t);
  const { includedFiles, manifest } = await buildRelease({ outDir, version: 'v1.2.3' });
  const origin = await startServer(t, createManifestServer({ rootDir: outDir }));
  const plugins = [{ name: 'OpenMzUpdater', status: true }];
  const phases = [];
  const updater = loadUpdater({ $plugins: plugins });
  const result = await updater.upgradeCoreEngine({
    manifestUrl: `${origin}/manifest.json`,
    projectRoot,
    pluginName: 'OpenMzUpdater',
    onProgress: ({ phase }) => phases.push(phase),
    nodeRequire: require,
  });

  assert.equal(result.version, manifest.version);
  assert.deepEqual(Array.from(result.updatedFiles), includedFiles);
  assert.equal(includedFiles.includes('js/plugins.js'), false);
  assert.deepEqual(phases, ['manifest', 'download', 'verify', 'apply']);
  for (const path of includedFiles) {
    assert.deepEqual(await readFile(join(projectRoot, path)), await readFile(new URL(`../src/${path}`, import.meta.url)));
  }
  const backup = join(projectRoot, result.backupRelativeDir);
  assert.equal(await readFile(join(backup, 'js/main.js'), 'utf8'), originalMain);
  assert.equal(await readFile(join(backup, 'js/plugins.js'), 'utf8'), originalConfig);
  assert.match(await readFile(join(projectRoot, 'js/plugins.js'), 'utf8'), /"status":false/);
  assert.equal(plugins[0].status, false);
});

test('rejects invalid archives before any project writes', async (t) => {
  const { projectRoot, outDir } = await createProject(t);
  for (const [files, overrides, message] of [
    [[entry('js/main.js')], { size: 1 }, /size mismatch/],
    [[entry('js/main.js')], { sha256: '0'.repeat(64) }, /SHA-256 mismatch/],
    [[entry('../outside.js')], {}, /Unsafe target/],
    [[entry('js/../outside.js')], {}, /Unsafe target/],
    [[entry('/js/absolute.js')], {}, /Unsafe target/],
    [[entry('js/plugins.js')], {}, /protected path/],
    [[entry('js/plugins/user.js')], {}, /protected path/],
    [[entry('js/main.js'), entry('js/main.js')], {}, /Duplicate archive path/],
    [[], {}, /no core files/],
  ]) {
    const manifestUrl = await writeTestRelease(outDir, files, overrides);
    await assert.rejects(upgradeCoreEngine({ manifestUrl, projectRoot, nodeRequire: require }), message);
    assert.equal(existsSync(join(projectRoot, 'js_backup')), false);
    await assertOriginalProject(projectRoot);
  }
});

test('locks relative assets to the tagged URL in a two-hop redirect', async (t) => {
  const { projectRoot } = await createProject(t);
  const latestPath = '/releases/latest/download/manifest.json';
  const tagBase = '/releases/download/v1.2.3/';
  const tagPath = `${tagBase}manifest.json`;
  const bytes = gzipSync(createTarBuffer([entry('js/main.js')]));
  const manifest = makeManifest(bytes);
  const assetOrigin = await startServer(t, createServer((request, response) => {
    if (request.url === '/signed/manifest') {
      response.end(JSON.stringify(manifest));
    } else {
      response.writeHead(403).end();
    }
  }));
  const visited = [];
  const origin = await startServer(t, createServer((request, response) => {
    visited.push([request.url, request.headers['user-agent'], request.headers['cache-control']]);
    if (request.url === latestPath) {
      response.writeHead(302, { Location: tagPath }).end();
    } else if (request.url === tagPath) {
      response.writeHead(302, { Location: `${assetOrigin}/signed/manifest` }).end();
    } else if (request.url === tagBase + manifest.archive.url) {
      response.end(bytes);
    } else {
      response.writeHead(404).end();
    }
  }));

  const manifestUrl = origin + latestPath;
  const fetched = await fetchBuffer(require, manifestUrl);
  assert.deepEqual(Array.from(fetched.redirectChain), [manifestUrl, origin + tagPath, `${assetOrigin}/signed/manifest`]);
  assert.equal(fetched.finalUrl, `${assetOrigin}/signed/manifest`);
  visited.length = 0;
  await upgradeCoreEngine({ manifestUrl, projectRoot, nodeRequire: require });
  assert.deepEqual(visited, [latestPath, tagPath, tagBase + manifest.archive.url].map((path) => [path, 'OpenMzUpdater', 'no-cache']));
  assert.equal(await readFile(join(projectRoot, 'js/main.js'), 'utf8'), 'new core');
});

test('rolls back when replacing plugins.js fails after core files changed', async (t) => {
  const { projectRoot, outDir } = await createProject(t);
  const manifestUrl = await writeTestRelease(outDir, [entry('js/main.js'), entry('js/nested/new.js')]);
  const plugins = [{ name: 'OpenMzUpdater', status: true }];
  const fs = require('fs');
  const pluginsPath = join(fs.realpathSync(projectRoot), 'js/plugins.js');
  const nodeRequire = (name) => name === 'fs' ? {
    ...fs,
    renameSync(source, target) {
      if (target === pluginsPath) {
        assert.equal(fs.readFileSync(join(projectRoot, 'js/main.js'), 'utf8'), 'new core');
        assert.equal(existsSync(join(projectRoot, 'js/nested/new.js')), true);
        throw new Error('Simulated plugins.js replacement failure');
      }
      fs.renameSync(source, target);
    },
  } : require(name);

  await assert.rejects(loadUpdater({ $plugins: plugins }).upgradeCoreEngine({
    manifestUrl, projectRoot, nodeRequire, pluginName: 'OpenMzUpdater',
  }), /Simulated plugins.js replacement failure/);
  await assertOriginalProject(projectRoot);
  assert.equal(existsSync(join(projectRoot, 'js/nested')), false);
  assert.equal(plugins[0].status, true);
});
