import type { TestContext } from 'vitest';
import type { ArchiveEntry, ReleaseManifest, RuntimeMetadata } from '@openmz-internal/release-spec';
import type { InstallOptions } from '../src/core.ts';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { runInNewContext, Script } from 'node:vm';
import { gzipSync } from 'node:zlib';
import { Lang, parse as parseAst } from '@ast-grep/napi';
import {
  compareVersions,
  coreScripts,
  isVersion,
  manifestSchema,
  runtimeFormat,
  statePath,
} from '@openmz-internal/release-spec';
import { createTarBuffer } from '@openmz-internal/release-spec/tar';
import { buildRuntime } from 'openmz/build';
import { buildRelease } from 'openmz/pack';
import { createManifestServer } from 'openmz/serve-manifest';
import { afterAll, beforeAll, test } from 'vitest';
import { buildUpdater } from '../scripts/build.ts';
import { checkForUpdate, fetchBuffer, installUpdate, parseTarBuffer } from '../src/core.ts';

const require = createRequire(import.meta.url);
const originalMain = 'original core';
const originalConfig = 'var $plugins = [{"name":"OpenMzUpdater","status":true}];\n';
const metadata: RuntimeMetadata = {
  name: 'OpenMZ',
  version: '1.2.3',
  format: runtimeFormat,
  pixiVersion: '8.23.0',
};
const workspace = await mkdtemp(join(tmpdir(), 'openmz-release-build-'));
let runtime: Awaited<ReturnType<typeof buildRuntime>>;
let release: Awaited<ReturnType<typeof buildRelease>>;
let updaterSource: string;
beforeAll(async () => {
  runtime = await buildRuntime({
    outDir: join(workspace, 'runtime'),
    version: metadata.version,
  });
  release = await buildRelease({ outDir: join(workspace, 'release'), runtime });
  const updaterFile = await buildUpdater({ outFile: join(workspace, 'plugins/OpenMzUpdater.js') });
  updaterSource = await readFile(updaterFile, 'utf8');
});
afterAll(() => rm(workspace, { recursive: true, force: true }));

async function createProject(t: TestContext) {
  const root = await mkdtemp(join(tmpdir(), 'openmz-update-'));
  t.onTestFinished(() => rm(root, { recursive: true, force: true }));
  const projectRoot = join(root, 'project');
  const outDir = join(root, 'release');
  await mkdir(join(projectRoot, 'js'), { recursive: true });
  await mkdir(outDir);
  await writeFile(join(projectRoot, 'js/main.js'), originalMain);
  await writeFile(join(projectRoot, 'js/plugins.js'), originalConfig);
  return { projectRoot, outDir };
}
function entry(relativePath: string, content: string = 'new core') {
  return { relativePath, content: Buffer.from(content) };
}
function runtimeEntries() {
  return [
    ...coreScripts.map((name) => entry(`js/${name}`)),
    entry('js/libs/pixi.js'),
    entry(statePath, JSON.stringify(metadata)),
  ];
}
function makeManifest(bytes: Buffer): ReleaseManifest {
  return {
    schemaVersion: manifestSchema,
    ...metadata,
    archive: {
      url: 'openmz-core-1.2.3.tar.gz',
      size: bytes.length,
      sha256: createHash('sha256').update(bytes).digest('hex'),
    },
  };
}
async function writeTestRelease(
  outDir: string,
  files: ArchiveEntry[] = runtimeEntries(),
  overrides: Partial<ReleaseManifest['archive']> = {},
) {
  const bytes = gzipSync(createTarBuffer(files));
  const manifest = makeManifest(bytes);
  Object.assign(manifest.archive, overrides);
  await writeFile(join(outDir, manifest.archive.url), bytes);
  const manifestPath = join(outDir, 'manifest.json');
  await writeFile(manifestPath, JSON.stringify(manifest));
  return pathToFileURL(manifestPath).href;
}
async function startServer(t: TestContext, server: import('node:http').Server) {
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  t.onTestFinished(() => new Promise<void>((resolve) => server.close(() => resolve())));
  return `http://127.0.0.1:${(server.address() as import('node:net').AddressInfo).port}`;
}
async function install(manifestUrl: string, projectRoot: string, options: Partial<InstallOptions> = {}) {
  const update = await checkForUpdate({
    manifestUrl,
    projectRoot,
    nodeRequire: require,
  });
  return installUpdate({
    update,
    projectRoot,
    nodeRequire: require,
    ...options,
  });
}
async function assertOriginalProject(projectRoot: string) {
  assert.equal(await readFile(join(projectRoot, 'js/main.js'), 'utf8'), originalMain);
  assert.equal(await readFile(join(projectRoot, 'js/plugins.js'), 'utf8'), originalConfig);
}

test('compares release and prerelease versions without reinstalling equal build metadata', () => {
  assert.equal(compareVersions('1.2.3-rc.10', '1.2.3-rc.2'), 1);
  assert.equal(compareVersions('1.2.3', '1.2.3-rc.10'), 1);
  assert.equal(compareVersions('1.2.3-alpha', '1.2.3-1'), 1);
  assert.equal(compareVersions('1.2.3+build.2', '1.2.3+build.1'), 0);
  assert.equal(compareVersions('1.2.3', '2.0.0'), -1);
  assert.equal(isVersion('1.2.3-01'), false);
});

test('tar round trips sorted files, including GNU long paths', () => {
  const long = entry(`js/${'长'.repeat(40)}/library.wasm`, 'long path');
  const short = entry('js/main.js');
  const tar = createTarBuffer([long, short]);
  assert.deepEqual(tar, createTarBuffer([short, long]));
  const decoded = parseTarBuffer(tar);
  assert.equal(decoded.length, 2);
  assert.equal(decoded[0].relativePath, short.relativePath);
  assert.deepEqual(decoded[1].content, long.content);
});

test('installs the built runtime over HTTP, records its version and leaves plugins enabled', async (t) => {
  const { projectRoot } = await createProject(t);
  const origin = await startServer(t, createManifestServer({ rootDir: join(workspace, 'release') }));
  const phases: string[] = [];
  const downloads: [number, number][] = [];
  const update = await checkForUpdate({
    manifestUrl: `${origin}/manifest.json`,
    projectRoot,
    nodeRequire: require,
  });
  assert.equal(update.available, true);
  assert.equal(update.installed, null);
  const result = await installUpdate({
    update,
    projectRoot,
    nodeRequire: require,
    onProgress: ({ phase }) => phases.push(phase),
    onDownload: ({ loaded, total }) => downloads.push([loaded, total]),
  });
  assert.equal(result.version, release.manifest.version);
  assert.equal(result.requiresRestart, true);
  assert.deepEqual(downloads.at(-1), [release.manifest.archive.size, release.manifest.archive.size]);
  assert.deepEqual(result.updatedFiles, release.includedFiles);
  assert.deepEqual(phases, ['download', 'verify', 'apply']);
  for (const path of release.includedFiles) {
    assert.deepEqual(await readFile(join(projectRoot, path)), await readFile(join(runtime.outDir, path)));
  }
  const backup = join(projectRoot, result.backupRelativeDir);
  assert.equal(await readFile(join(backup, 'js/main.js'), 'utf8'), originalMain);
  assert.equal(await readFile(join(projectRoot, 'js/plugins.js'), 'utf8'), originalConfig);
  const next = await checkForUpdate({
    manifestUrl: `${origin}/manifest.json`,
    projectRoot,
    nodeRequire: require,
  });
  assert.equal(next.available, false);
  assert.equal(next.installed!.version, release.manifest.version);
});

test('keeps a newer installation when the configured manifest points to an older release', async (t) => {
  const { projectRoot, outDir } = await createProject(t);
  await writeFile(join(projectRoot, statePath), JSON.stringify({ ...metadata, version: '2.0.0' }));
  const manifestUrl = await writeTestRelease(outDir);
  const update = await checkForUpdate({
    manifestUrl,
    projectRoot,
    nodeRequire: require,
  });
  assert.equal(update.available, false);
  await assertOriginalProject(projectRoot);
});

test('rejects damaged, protected and incomplete packages before writing project files', async (t) => {
  const { projectRoot, outDir } = await createProject(t);
  for (const [files, overrides, message] of [
    [runtimeEntries(), { size: 1 }, /size mismatch/],
    [runtimeEntries(), { sha256: '0'.repeat(64) }, /SHA-256 mismatch/],
    [runtimeEntries(), { sha256: undefined }, /Invalid archive SHA-256/],
    [[entry('../outside.js')], {}, /Unsafe target/],
    [[entry('js/../outside.js')], {}, /Unsafe target/],
    [[entry('js/plugins.js')], {}, /protected path/],
    [[entry('js/plugins/user.js')], {}, /protected path/],
    [[entry('js/main.js'), entry('js/main.js')], {}, /Duplicate archive path/],
    [[], {}, /no core files/],
    [[entry('js/main.js')], {}, /Missing runtime file/],
    [
      runtimeEntries().map((file) =>
        file.relativePath === statePath ? entry(statePath, JSON.stringify({ ...metadata, version: '9.0.0' })) : file,
      ),
      {},
      /metadata does not match/,
    ],
  ] as [ArchiveEntry[], Partial<ReleaseManifest['archive']>, RegExp][]) {
    const manifestUrl = await writeTestRelease(outDir, files, overrides);
    await assert.rejects(install(manifestUrl, projectRoot), message);
    assert.equal(existsSync(join(projectRoot, 'js_backup')), false);
    await assertOriginalProject(projectRoot);
  }
});

test('resolves relative release assets against the tagged URL across a CDN redirect', async (t) => {
  const { projectRoot } = await createProject(t);
  const latestPath = '/releases/latest/download/manifest.json';
  const tagBase = '/releases/download/v1.2.3/';
  const tagPath = `${tagBase}manifest.json`;
  const bytes = gzipSync(createTarBuffer(runtimeEntries()));
  const manifest = makeManifest(bytes);
  const assetOrigin = await startServer(
    t,
    createServer((request, response) => {
      if (request.url === '/signed/manifest') response.end(JSON.stringify(manifest));
      else response.writeHead(403).end();
    }),
  );
  const visited: (string | undefined)[] = [];
  const origin = await startServer(
    t,
    createServer((request, response) => {
      visited.push(request.url);
      if (request.url === latestPath) response.writeHead(302, { Location: tagPath }).end();
      else if (request.url === tagPath) response.writeHead(302, { Location: `${assetOrigin}/signed/manifest` }).end();
      else if (request.url === tagBase + manifest.archive.url) response.end(bytes);
      else response.writeHead(404).end();
    }),
  );
  const manifestUrl = origin + latestPath;
  const fetched = await fetchBuffer(require, manifestUrl);
  assert.deepEqual(fetched.redirectChain, [manifestUrl, origin + tagPath, `${assetOrigin}/signed/manifest`]);
  visited.length = 0;
  await install(manifestUrl, projectRoot);
  assert.deepEqual(visited, [latestPath, tagPath, tagBase + manifest.archive.url]);
});

test('rolls back core files and version metadata if the final replacement fails', async (t) => {
  const { projectRoot, outDir } = await createProject(t);
  const installed = JSON.stringify({ ...metadata, version: '1.0.0' });
  await writeFile(join(projectRoot, statePath), installed);
  const manifestUrl = await writeTestRelease(outDir, [...runtimeEntries(), entry('js/nested/new.js')]);
  const fs = require('fs');
  const failingPath = join(fs.realpathSync(projectRoot), 'js/rmmz_windows.js');
  const nodeRequire = (name: string) =>
    name === 'fs'
      ? {
          ...fs,
          renameSync(source: import('node:fs').PathLike, target: import('node:fs').PathLike) {
            if (target === failingPath) {
              assert.equal(fs.readFileSync(join(projectRoot, 'js/main.js'), 'utf8'), 'new core');
              throw new Error('Simulated runtime replacement failure');
            }
            fs.renameSync(source, target);
          },
        }
      : require(name);
  await assert.rejects(install(manifestUrl, projectRoot, { nodeRequire }), /Simulated runtime replacement failure/);
  await assertOriginalProject(projectRoot);
  assert.equal(await readFile(join(projectRoot, statePath), 'utf8'), installed);
  assert.equal(existsSync(join(projectRoot, 'js/nested')), false);
  assert.equal(existsSync(join(projectRoot, 'js/libs')), false);
});

test('title integration shows the checked target version and ignores a scene already left', async (t) => {
  const { projectRoot, outDir } = await createProject(t);
  const manifestUrl = await writeTestRelease(outDir);
  class Title {
    declare showOpenMzMessage: (title: string, lines: string[]) => void;
    declare showOpenMzCommands: () => void;
    declare checkOpenMzUpdate: () => Promise<void>;
    create() {}
    isBusy() {
      return false;
    }
  }
  const manager: { _scene?: unknown } = {};
  runInNewContext(updaterSource, {
    require,
    URL,
    setTimeout,
    clearTimeout,
    PluginManager: { parameters: () => ({ manifestUrl }) },
    Scene_Title: Title,
    SceneManager: manager,
    Window_Base: function () {},
    Window_HorzCommand: function () {},
    Utils: { isNwjs: () => true },
    document: { currentScript: { src: 'file:///js/plugins/OpenMzUpdater.js' } },
    window: {
      location: {
        protocol: 'file:',
        href: pathToFileURL(join(projectRoot, 'index.html')).href,
      },
    },
    $dataSystem: { locale: 'zh_CN' },
  });
  const scene = new Title();
  manager._scene = scene;
  const messages: [string, string[]][] = [];
  scene.showOpenMzMessage = (title, lines) => messages.push([title, lines]);
  scene.showOpenMzCommands = function () {};
  await scene.checkOpenMzUpdate();
  assert.match(messages[0][1][0], /1\.2\.3/);
  messages.length = 0;
  manager._scene = {};
  await scene.checkOpenMzUpdate();
  assert.deepEqual(messages, []);
});

test('builds a standalone prototype updater that is inert outside RPG Maker', () => {
  assert.match(updaterSource, /@param manifestUrl/);
  assert(updaterSource.includes('/*:zh'));
  new Script(updaterSource, { filename: 'OpenMzUpdater.js' });
  const root = parseAst(Lang.JavaScript, updaterSource).root();
  assert.equal(
    root.findAll({
      rule: { any: [{ kind: 'class_declaration' }, { kind: 'class' }] },
    }).length,
    0,
  );
  const strictDirectives = root.findAll({ rule: { kind: 'expression_statement' } }).filter((statement) => {
    const text = statement
      .children()
      .find((node) => node.kind() === 'string')
      ?.text();
    return text === '"use strict"' || text === "'use strict'";
  });
  assert.equal(strictDirectives.length, 0);
  assert.doesNotThrow(() => runInNewContext(updaterSource, {}));
});
