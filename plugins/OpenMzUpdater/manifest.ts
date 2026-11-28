import type { ReleaseManifest } from '../../shared/engine-release.ts';
import type { FetchResult, ParsedManifest } from './types.ts';
import { isVersion, manifestSchema, runtimeFormat } from '../../shared/engine-release.ts';
import { createUpdaterError } from './errors.ts';

const SHA256_PATTERN = /^[\da-f]{64}$/i;
const ALLOWED_ARCHIVE_PROTOCOLS = new Set(['http:', 'https:', 'file:']);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Resolves relative asset URLs against the last URL on the original origin
 * (e.g. a GitHub release tag URL rather than a signed CDN location).
 */
function resolveAssetBaseUrl(redirectChain: string[]): URL {
  const original = new URL(redirectChain[0]);
  for (let index = redirectChain.length - 1; index >= 0; index--) {
    const candidate = new URL(redirectChain[index]);
    if (candidate.protocol === original.protocol && candidate.origin === original.origin) {
      return candidate;
    }
  }
  return original;
}

export function parseManifest({ buffer, redirectChain }: FetchResult): ParsedManifest {
  let raw: unknown;
  try {
    raw = JSON.parse(buffer.toString('utf8'));
  } catch (cause) {
    throw createUpdaterError('INVALID_MANIFEST', 'Release manifest is not valid JSON.', { cause });
  }

  if (!isRecord(raw) || raw.schemaVersion !== manifestSchema) {
    throw createUpdaterError('INVALID_MANIFEST', `Expected a schemaVersion ${manifestSchema} manifest.`);
  }

  const manifest = raw as unknown as ReleaseManifest;
  const { name, version, format, pixiVersion, archive } = manifest;
  if (name !== 'OpenMZ' || !isVersion(version) || !isVersion(pixiVersion) || format !== runtimeFormat) {
    throw createUpdaterError(
      'INVALID_MANIFEST',
      'Manifest must describe an OpenMZ prototype runtime and its PixiJS version.',
    );
  }

  if (!isRecord(archive) || typeof archive.url !== 'string' || !archive.url.trim()) {
    throw createUpdaterError('INVALID_MANIFEST', 'Manifest requires an archive URL.');
  }

  const { size, sha256 } = archive;
  if (!Number.isSafeInteger(size) || size <= 0) {
    throw createUpdaterError('INVALID_MANIFEST', 'Invalid archive size in manifest.');
  }
  if (typeof sha256 !== 'string' || !SHA256_PATTERN.test(sha256)) {
    throw createUpdaterError('INVALID_MANIFEST', 'Invalid archive SHA-256 in manifest.');
  }

  const baseUrl = resolveAssetBaseUrl(redirectChain);
  let resolvedUrl: URL;
  try {
    resolvedUrl = new URL(archive.url.trim(), baseUrl);
  } catch (cause) {
    throw createUpdaterError('INVALID_MANIFEST', `Invalid archive URL in manifest: ${archive.url}`, { cause });
  }

  if (!ALLOWED_ARCHIVE_PROTOCOLS.has(resolvedUrl.protocol)) {
    throw createUpdaterError('UNSAFE_PROTOCOL', `Unsupported archive protocol: ${resolvedUrl.protocol}`);
  }
  // Never allow a remote HTTP(S) manifest to point to a local file:// archive.
  if (baseUrl.protocol !== 'file:' && resolvedUrl.protocol === 'file:') {
    throw createUpdaterError(
      'UNSAFE_PROTOCOL',
      `Refusing local file archive URL from remote manifest: ${resolvedUrl.href}`,
    );
  }

  return {
    name,
    version,
    format,
    pixiVersion,
    archive: {
      url: resolvedUrl.href,
      size,
      sha256: sha256.toLowerCase(),
    },
  };
}
