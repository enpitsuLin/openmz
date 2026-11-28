import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { test } from 'vitest';
import { manifestSchema, runtimeFormat } from '@openmz-internal/release-spec';
import { createTarBuffer } from '@openmz-internal/release-spec/tar';
import { isUpdaterError } from '../../src/errors.ts';
import { parseManifest } from '../../src/manifest.ts';
import { unpackAndValidatePackage, validateArchiveEntries } from '../../src/package-validator.ts';
import { parseTarBuffer } from '../../src/tar.ts';

const require = createRequire(import.meta.url);

const validManifest = {
  schemaVersion: manifestSchema,
  name: 'OpenMZ',
  version: '1.2.3',
  format: runtimeFormat,
  pixiVersion: '8.23.0',
  archive: {
    url: 'openmz-core-1.2.3.tar.gz',
    size: 128,
    sha256: 'a'.repeat(64),
  },
};

test('parseManifest rejects malformed JSON, invalid fields, and remote file:// archive URLs', () => {
  const remoteChain = ['https://example.com/releases/manifest.json'];
  const toResult = (body: unknown, redirectChain = remoteChain) => ({
    buffer: Buffer.from(typeof body === 'string' ? body : JSON.stringify(body), 'utf8'),
    finalUrl: redirectChain.at(-1)!,
    redirectChain,
  });

  assert.throws(
    () => parseManifest(toResult('not json')),
    (error: unknown) => isUpdaterError(error) && error.code === 'INVALID_MANIFEST',
  );
  assert.throws(
    () => parseManifest(toResult({ ...validManifest, schemaVersion: 2 })),
    (error: unknown) => isUpdaterError(error) && error.code === 'INVALID_MANIFEST',
  );
  assert.throws(
    () =>
      parseManifest(
        toResult({
          ...validManifest,
          archive: { ...validManifest.archive, size: -5 },
        }),
      ),
    (error: unknown) => isUpdaterError(error) && error.code === 'INVALID_MANIFEST',
  );
  assert.throws(
    () =>
      parseManifest(
        toResult({
          ...validManifest,
          archive: { ...validManifest.archive, url: 'file:///etc/passwd' },
        }),
      ),
    (error: unknown) => isUpdaterError(error) && error.code === 'UNSAFE_PROTOCOL',
  );

  // Local file manifest is still allowed to resolve a local file archive.
  const local = parseManifest(toResult(validManifest, ['file:///tmp/release/manifest.json']));
  assert.equal(local.archive.url, 'file:///tmp/release/openmz-core-1.2.3.tar.gz');
});

test('parseTarBuffer validates checksums, framing, truncation, and entry types', () => {
  const validTar = createTarBuffer([{ relativePath: 'js/main.js', content: Buffer.from('ok') }]);

  // Corrupt checksum byte.
  const badChecksum = Buffer.from(validTar);
  badChecksum[0] ^= 0xff;
  assert.throws(
    () => parseTarBuffer(badChecksum),
    (error: unknown) => isUpdaterError(error) && error.code === 'INVALID_ARCHIVE' && /checksum/i.test(error.message),
  );

  // Truncate end-of-archive blocks.
  assert.throws(
    () => parseTarBuffer(validTar.subarray(0, validTar.length - 512)),
    (error: unknown) => isUpdaterError(error) && error.code === 'INVALID_ARCHIVE',
  );

  // Unsupported symlink entry type ('2').
  const symlinkTar = Buffer.from(validTar);
  symlinkTar[156] = '2'.charCodeAt(0);
  symlinkTar.fill(0x20, 148, 156);
  const checksum = symlinkTar.subarray(0, 512).reduce((sum, byte) => sum + byte, 0);
  symlinkTar.write(`${checksum.toString(8).padStart(6, '0')}\0 `, 148);
  assert.throws(
    () => parseTarBuffer(symlinkTar),
    (error: unknown) =>
      isUpdaterError(error) && error.code === 'INVALID_ARCHIVE' && /Unsupported tar entry type/.test(error.message),
  );
});

test('validateArchiveEntries rejects path collisions, case duplicates, and unsafe segments', () => {
  const item = (relativePath: string) => ({
    relativePath,
    content: Buffer.from('x'),
  });

  assert.throws(
    () => validateArchiveEntries([item('js/Main.js'), item('js/main.js')]),
    (error: unknown) => isUpdaterError(error) && error.code === 'DUPLICATE_ARCHIVE_PATH',
  );
  assert.throws(
    () => validateArchiveEntries([item('js/libs'), item('js/libs/pixi.js')]),
    (error: unknown) =>
      isUpdaterError(error) && error.code === 'INVALID_ARCHIVE' && /both a file and a directory/.test(error.message),
  );
  assert.throws(
    () => validateArchiveEntries([item('js/foo /bar.js')]),
    (error: unknown) => isUpdaterError(error) && error.code === 'UNSAFE_ARCHIVE_PATH',
  );
  assert.throws(
    () => validateArchiveEntries([item('js/plugins/OpenMzUpdater.js')]),
    (error: unknown) => isUpdaterError(error) && error.code === 'PROTECTED_PATH',
  );
});

test('unpackAndValidatePackage rejects corrupted gzip payloads', () => {
  const garbage = Buffer.from('not a gzip stream');
  const manifest = parseManifest({
    buffer: Buffer.from(
      JSON.stringify({
        ...validManifest,
        archive: {
          url: 'archive.tar.gz',
          size: garbage.length,
          sha256: createHash('sha256').update(garbage).digest('hex'),
        },
      }),
    ),
    finalUrl: 'file:///tmp/manifest.json',
    redirectChain: ['file:///tmp/manifest.json'],
  });

  assert.throws(
    () => unpackAndValidatePackage(require, garbage, manifest),
    (error: unknown) => isUpdaterError(error) && error.code === 'INVALID_ARCHIVE' && /decompress/i.test(error.message),
  );
});
