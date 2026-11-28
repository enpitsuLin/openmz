import type { RuntimeMetadata } from '../../shared/engine-release.ts';
import type { InstallOptions, InstallResult, ProjectOptions, UpdateCheck } from './types.ts';
import { compareVersions, isVersion, runtimeFormat, statePath } from '../../shared/engine-release.ts';
import { createUpdaterError, isUpdaterError } from './errors.ts';
import { applyUpgradePlan, planUpgrade } from './installer.ts';
import { parseManifest } from './manifest.ts';
import { unpackAndValidatePackage } from './package-validator.ts';
import { fetchBuffer } from './transport.ts';

const MAX_MANIFEST_BYTES = 1024 * 1024; // 1 MiB
const MAX_ARCHIVE_BYTES = 256 * 1024 * 1024; // 256 MiB

export { fetchBuffer } from './transport.ts';
export { parseTarBuffer } from './tar.ts';
export type {
  DownloadProgress,
  FetchOptions,
  FetchResult,
  InstallOptions,
  InstallResult,
  NodeModules,
  NodeRequire,
  ParsedManifest,
  ProjectOptions,
  UpdateCheck,
  UpdateProgress,
  UpdaterError,
  UpdaterErrorCode,
} from './types.ts';

function resolveArchiveFilename(archiveUrl: string): string {
  const name = new URL(archiveUrl).pathname.split('/').pop();
  return name || 'openmz-runtime.tar.gz';
}

export function readInstalledVersion({ projectRoot, nodeRequire }: ProjectOptions): RuntimeMetadata | null {
  const fs = nodeRequire('fs');
  const path = nodeRequire('path');
  let rawText: string;
  try {
    rawText = fs.readFileSync(path.join(projectRoot, statePath), 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw error;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch (cause) {
    throw createUpdaterError('INVALID_INSTALLED_METADATA', 'Invalid installed OpenMZ version metadata.', { cause });
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw createUpdaterError('INVALID_INSTALLED_METADATA', 'Invalid installed OpenMZ version metadata.');
  }

  const metadata = parsed as RuntimeMetadata;
  if (metadata.name !== 'OpenMZ' || !isVersion(metadata.version) || metadata.format !== runtimeFormat) {
    throw createUpdaterError('INVALID_INSTALLED_METADATA', 'Invalid installed OpenMZ version metadata.');
  }

  return metadata;
}

export async function checkForUpdate({
  manifestUrl,
  projectRoot,
  nodeRequire,
  signal,
}: ProjectOptions & {
  manifestUrl: string;
  signal?: AbortSignal;
}): Promise<UpdateCheck> {
  const installed = readInstalledVersion({ projectRoot, nodeRequire });
  const fetched = await fetchBuffer(nodeRequire, manifestUrl, {
    maxBytes: MAX_MANIFEST_BYTES,
    signal,
  });
  const manifest = parseManifest(fetched);
  return {
    installed,
    manifest,
    available: !installed || compareVersions(manifest.version, installed.version) > 0,
  };
}

export async function installUpdate({
  update,
  projectRoot,
  nodeRequire,
  onProgress = () => {},
  onDownload = () => {},
  signal,
}: InstallOptions): Promise<InstallResult> {
  const { manifest } = update;
  const { archive } = manifest;
  const fs = nodeRequire('fs');
  const path = nodeRequire('path');
  const file = resolveArchiveFilename(archive.url);

  await onProgress({
    phase: 'download',
    file,
    loaded: 0,
    total: archive.size,
  });

  if (archive.size > MAX_ARCHIVE_BYTES) {
    throw createUpdaterError(
      'RESPONSE_TOO_LARGE',
      `Archive size (${archive.size} bytes) exceeds maximum supported size (${MAX_ARCHIVE_BYTES} bytes).`,
      { details: { size: archive.size, maxBytes: MAX_ARCHIVE_BYTES } },
    );
  }

  let buffer: import('node:buffer').Buffer;
  try {
    ({ buffer } = await fetchBuffer(nodeRequire, archive.url, {
      maxBytes: archive.size,
      signal,
      onData: (loaded, total) =>
        onDownload({
          phase: 'download',
          file,
          loaded,
          total: total || archive.size,
        }),
    }));
  } catch (error) {
    if (isUpdaterError(error) && error.code === 'RESPONSE_TOO_LARGE') {
      throw createUpdaterError(
        'ARCHIVE_SIZE_MISMATCH',
        `Archive size mismatch: expected ${archive.size} bytes, response exceeded expected size.`,
        { cause: error, details: { expected: archive.size } },
      );
    }
    throw error;
  }

  await onProgress({ phase: 'verify' });
  const { entries, metadata } = unpackAndValidatePackage(nodeRequire, buffer, manifest);

  await onProgress({ phase: 'apply', total: entries.length });
  const plan = planUpgrade(fs, path, projectRoot, entries);
  const backupDir = applyUpgradePlan(fs, path, plan);

  return {
    ...metadata,
    updatedFiles: entries.map((entry) => entry.relativePath),
    backupRelativeDir: path.relative(plan.root, backupDir).replace(/\\/g, '/'),
    requiresRestart: true,
  };
}
