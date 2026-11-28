import type { Buffer } from 'node:buffer';
import type { ArchiveEntry, ReleaseManifest, RuntimeMetadata } from '@openmz-internal/release-spec';
import type { NodeRequire, ParsedManifest } from './types.ts';
import { coreScripts, statePath } from '@openmz-internal/release-spec';
import { createUpdaterError } from './errors.ts';
import { parseTarBuffer } from './tar.ts';

const PROTECTED_PATH_PATTERN = /^js\/plugins(?:\.js)?(?:\/|$)/i;
const UNSAFE_SEGMENT_CHAR_PATTERN = /[\\:\0]/;
const TRAILING_DOT_OR_SPACE_PATTERN = /[. ]$/;

const REQUIRED_RUNTIME_FILES = [...coreScripts.map((name) => `js/${name}`), 'js/libs/pixi.js', statePath] as const;

export interface VerifiedPackage {
  entries: ArchiveEntry[];
  metadata: RuntimeMetadata;
}

export function verifyArchiveIntegrity(
  nodeRequire: NodeRequire,
  buffer: Buffer,
  archive: ReleaseManifest['archive'],
): void {
  if (buffer.length !== archive.size) {
    throw createUpdaterError(
      'ARCHIVE_SIZE_MISMATCH',
      `Archive size mismatch: expected ${archive.size}, got ${buffer.length}.`,
      { details: { expected: archive.size, actual: buffer.length } },
    );
  }
  const actual = nodeRequire('crypto').createHash('sha256').update(buffer).digest('hex');
  if (actual !== archive.sha256.toLowerCase()) {
    throw createUpdaterError('ARCHIVE_CHECKSUM_MISMATCH', 'Archive SHA-256 mismatch.');
  }
}

/**
 * Rejects archives that would write outside `js/`, touch plugin setup,
 * contain case-insensitive duplicate paths, or have file/directory collisions.
 */
export function validateArchiveEntries(entries: ArchiveEntry[]): void {
  if (!entries.length) {
    throw createUpdaterError('INVALID_ARCHIVE', 'Archive contains no core files.');
  }

  const seen = new Set<string>();
  for (const { relativePath } of entries) {
    const segments = relativePath.split('/');
    const hasUnsafeSegment = segments.some(
      (segment) => !segment || UNSAFE_SEGMENT_CHAR_PATTERN.test(segment) || TRAILING_DOT_OR_SPACE_PATTERN.test(segment),
    );
    if (!relativePath.startsWith('js/') || hasUnsafeSegment) {
      throw createUpdaterError('UNSAFE_ARCHIVE_PATH', `Unsafe target script path: ${relativePath}`);
    }
    if (PROTECTED_PATH_PATTERN.test(relativePath)) {
      throw createUpdaterError('PROTECTED_PATH', `Refusing to overwrite protected path: ${relativePath}`);
    }

    const key = relativePath.toLowerCase();
    if (seen.has(key)) {
      throw createUpdaterError('DUPLICATE_ARCHIVE_PATH', `Duplicate archive path: ${relativePath}`);
    }
    seen.add(key);
  }

  for (const key of seen) {
    const segments = key.split('/');
    for (let depth = 2; depth < segments.length; depth++) {
      const directory = segments.slice(0, depth).join('/');
      if (seen.has(directory)) {
        throw createUpdaterError('INVALID_ARCHIVE', `Archive path is both a file and a directory: ${directory}`);
      }
    }
  }
}

function parseRuntimeMetadataEntry(entry: ArchiveEntry): RuntimeMetadata {
  let raw: unknown;
  try {
    raw = JSON.parse(entry.content.toString('utf8'));
  } catch (cause) {
    throw createUpdaterError('METADATA_MISMATCH', 'Runtime metadata in archive is not valid JSON.', { cause });
  }
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw createUpdaterError('METADATA_MISMATCH', 'Runtime metadata in archive is invalid.');
  }
  return raw as RuntimeMetadata;
}

export function unpackAndValidatePackage(
  nodeRequire: NodeRequire,
  compressedArchive: Buffer,
  manifest: ParsedManifest,
): VerifiedPackage {
  verifyArchiveIntegrity(nodeRequire, compressedArchive, manifest.archive);

  let tarBuffer: Buffer;
  try {
    tarBuffer = nodeRequire('zlib').gunzipSync(compressedArchive);
  } catch (cause) {
    throw createUpdaterError('INVALID_ARCHIVE', 'Failed to decompress runtime archive.', { cause });
  }

  const entries = parseTarBuffer(tarBuffer);
  validateArchiveEntries(entries);

  const entryByPath = new Map(entries.map((entry) => [entry.relativePath, entry]));
  for (const requiredPath of REQUIRED_RUNTIME_FILES) {
    if (!entryByPath.has(requiredPath)) {
      throw createUpdaterError('MISSING_RUNTIME_FILE', `Missing runtime file: ${requiredPath}`);
    }
  }

  const metadata = parseRuntimeMetadataEntry(entryByPath.get(statePath)!);
  if (
    metadata.name !== manifest.name ||
    metadata.version !== manifest.version ||
    metadata.pixiVersion !== manifest.pixiVersion ||
    metadata.format !== manifest.format
  ) {
    throw createUpdaterError('METADATA_MISMATCH', 'Runtime metadata does not match the manifest.');
  }

  return { entries, metadata };
}
