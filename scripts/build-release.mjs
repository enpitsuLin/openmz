import { createHash } from 'node:crypto';
import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const blockSize = 512;
const semver = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(?:0|[1-9]\d*|\d*[a-z-][\da-z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-z-][\da-z-]*))*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?$/i;

export const defaultReleaseDir = join(projectRoot, 'dist/release');

async function collectFiles(sourceDir, relativeDir = 'js') {
  const files = [];
  for (const entry of await readdir(join(sourceDir, relativeDir), { withFileTypes: true })) {
    const path = `${relativeDir}/${entry.name}`;
    if (entry.name.startsWith('.') || /^js\/plugins(?:\.js)?$/i.test(path)) {
      continue;
    }
    if (entry.isDirectory()) {
      files.push(...await collectFiles(sourceDir, path));
    } else if (entry.isFile()) {
      files.push(path);
    }
  }
  return files;
}

function createTarHeader(name, size, type) {
  const header = Buffer.alloc(blockSize);
  header.write(name, 0, 100);
  header.write('0000644\0', 100);
  header.write('0000000\0', 108);
  header.write('0000000\0', 116);
  header.write(`${size.toString(8).padStart(11, '0')}\0`, 124, 12);
  header.write('00000000000\0', 136);
  header.fill(0x20, 148, 156);
  header.write(type, 156);
  header.write('ustar\x0000', 257);
  const checksum = header.reduce((sum, byte) => sum + byte, 0);
  header.write(`${checksum.toString(8).padStart(6, '0')}\0 `, 148);
  return header;
}

export function createTarBuffer(entries) {
  const chunks = [];
  const append = (name, content, type) => {
    chunks.push(createTarHeader(name, content.length, type), content);
    const padding = (blockSize - content.length % blockSize) % blockSize;
    if (padding) {
      chunks.push(Buffer.alloc(padding));
    }
  };

  for (const { relativePath, content } of [...entries].sort((a, b) => {
    if (a.relativePath < b.relativePath) return -1;
    if (a.relativePath > b.relativePath) return 1;
    return 0;
  })) {
    if (Buffer.byteLength(relativePath) > 100) {
      append('././@LongLink', Buffer.from(`${relativePath}\0`), 'L');
    }
    append(relativePath, content, '0');
  }

  return Buffer.concat([...chunks, Buffer.alloc(2 * blockSize)]);
}

export async function buildRelease({ outDir = defaultReleaseDir, version } = {}) {
  const packageInfo = JSON.parse(await readFile(join(projectRoot, 'package.json'), 'utf8'));
  const releaseVersion = (version ?? process.env.RELEASE_TAG ?? process.env.GITHUB_REF_NAME ?? packageInfo.version)
    .replace(/^v/, '');
  if (!semver.test(releaseVersion)) {
    throw new Error(`Invalid release version: ${releaseVersion}`);
  }

  const sourceDir = join(projectRoot, 'src');
  const includedFiles = (await collectFiles(sourceDir)).sort();
  if (!includedFiles.length) {
    throw new Error('No core engine files found in src/js/.');
  }
  const entries = await Promise.all(includedFiles.map(async (relativePath) => ({
    relativePath,
    content: await readFile(join(sourceDir, relativePath)),
  })));
  const archive = gzipSync(createTarBuffer(entries), { level: 9 });
  const manifest = {
    schemaVersion: 2,
    name: 'OpenMZ',
    version: releaseVersion,
    publishedAt: new Date().toISOString(),
    archive: {
      url: `openmz-core-${releaseVersion}.tar.gz`,
      size: archive.length,
      sha256: createHash('sha256').update(archive).digest('hex'),
    },
  };

  await mkdir(outDir, { recursive: true });
  await Promise.all([
    writeFile(join(outDir, manifest.archive.url), archive),
    copyFile(join(projectRoot, 'plugins/OpenMzUpdater.js'), join(outDir, 'OpenMzUpdater.js')),
  ]);
  await writeFile(join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  return { manifest, includedFiles };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const index = args.indexOf('--version');
  const version = index === -1 ? undefined : args[index + 1] ?? '';
  const release = await buildRelease({ version });
  console.log(`Built ${release.manifest.archive.url} (${release.includedFiles.length} files)`);
}
