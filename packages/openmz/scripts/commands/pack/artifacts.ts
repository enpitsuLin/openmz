import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { formatOutput } from '@openmz-internal/build-utils';
import { manifestSchema } from '@openmz-internal/release-spec';
import { createTarBuffer } from '@openmz-internal/release-spec/tar';
import { buildRuntime, packageRoot, resolveVersion } from '../build/runtime.ts';

export interface ReleaseOptions {
  outDir?: string;
  version?: string;
  runtime?: Awaited<ReturnType<typeof buildRuntime>>;
}

export const defaultReleaseDir = join(packageRoot, 'dist/release');

export async function buildRelease({ outDir = defaultReleaseDir, version, runtime }: ReleaseOptions = {}) {
  const releaseVersion = resolveVersion(
    version ?? runtime?.metadata.version ?? process.env.RELEASE_TAG ?? process.env.GITHUB_REF_NAME,
  );
  const built = runtime ?? (await buildRuntime({ version: releaseVersion }));
  if (built.metadata.version !== releaseVersion) throw new Error('Runtime and release versions must match.');
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
    writeFile(
      join(outDir, 'manifest.json'),
      await formatOutput('manifest.json', `${JSON.stringify(manifest, null, 2)}\n`),
    ),
  ]);
  return { manifest, includedFiles };
}
