import type { ArchiveEntry } from '../../../shared/engine-release.ts';
interface ReleaseOptions {
  outDir?: string;
  version?: string;
  runtime?: Awaited<ReturnType<typeof buildRuntime>>;
}
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { manifestSchema } from '../../../shared/engine-release.ts';
import { formatOutput, projectRoot } from '../build/output.ts';
import { buildPlugins } from '../build/plugins.ts';
import { buildRuntime, resolveVersion } from '../build/runtime.ts';

const blockSize = 512;

export const defaultReleaseDir = join(projectRoot, 'dist/release');

function createTarHeader(name: string, size: number, type: string) {
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

export function createTarBuffer(entries: ArchiveEntry[]) {
  const chunks: Buffer[] = [];
  const append = (name: string, content: Buffer, type: string) => {
    chunks.push(createTarHeader(name, content.length, type), content);
    const padding = (blockSize - (content.length % blockSize)) % blockSize;
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

export async function buildRelease({
  outDir = defaultReleaseDir,
  version,
  runtime,
}: ReleaseOptions = {}) {
  const releaseVersion = resolveVersion(
    version ??
      runtime?.metadata.version ??
      process.env.RELEASE_TAG ??
      process.env.GITHUB_REF_NAME,
  );
  const built = runtime ?? (await buildRuntime({ version: releaseVersion }));
  if (built.metadata.version !== releaseVersion)
    throw new Error('Runtime and release versions must match.');
  const includedFiles = built.files;
  const entries = await Promise.all(
    includedFiles.map(async (relativePath) => ({
      relativePath,
      content: await readFile(join(built.outDir, relativePath)),
    })),
  );
  const archive = gzipSync(createTarBuffer(entries), { level: 9 });
  const manifest = {
    schemaVersion: manifestSchema,
    ...built.metadata,
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
    buildPlugins({ outDir }),
  ]);
  await writeFile(
    join(outDir, 'manifest.json'),
    await formatOutput(
      'manifest.json',
      `${JSON.stringify(manifest, null, 2)}\n`,
    ),
  );
  return { manifest, includedFiles };
}
