import type { Buffer } from 'node:buffer';
import type { ArchiveEntry } from '@openmz-internal/release-spec';
import { createUpdaterError } from './errors.ts';

const TAR_BLOCK_SIZE = 512;
const NAME_START = 0;
const NAME_END = 100;
const SIZE_START = 124;
const SIZE_END = 136;
const CHECKSUM_START = 148;
const CHECKSUM_END = 156;
const TYPE_OFFSET = 156;
const MAGIC_START = 257;
const MAGIC_END = 263;
const PREFIX_START = 345;
const PREFIX_END = 500;
const CHECKSUM_SPACE = 0x20;
const REGULAR_FILE_DEFAULT_CHAR_CODE = 48; // '0'

function readText(field: Buffer): string {
  return field.toString('utf8').split('\0', 1)[0];
}

function readOctal(field: Buffer): number {
  const value = field.toString('ascii').replace(/\0.*$/, '').trim();
  if (!/^[0-7]+$/.test(value)) {
    throw createUpdaterError('INVALID_ARCHIVE', 'Invalid tar header number.');
  }
  return parseInt(value, 8);
}

function isZeroBlock(block: Buffer): boolean {
  for (let index = 0; index < block.length; index++) {
    if (block[index] !== 0) return false;
  }
  return true;
}

function computeHeaderChecksum(header: Buffer): number {
  let sum = 0;
  for (let index = 0; index < header.length; index++) {
    sum += index >= CHECKSUM_START && index < CHECKSUM_END ? CHECKSUM_SPACE : header[index];
  }
  return sum;
}

/**
 * Decodes a POSIX USTAR / GNU tar archive buffer into regular file entries.
 * Supports GNU `@LongLink` extended names and skips PAX metadata headers.
 */
export function parseTarBuffer(buffer: Buffer): ArchiveEntry[] {
  const entries: ArchiveEntry[] = [];
  let longPath: string | undefined;
  let offset = 0;

  while (offset + 2 * TAR_BLOCK_SIZE <= buffer.length) {
    const header = buffer.subarray(offset, offset + TAR_BLOCK_SIZE);
    offset += TAR_BLOCK_SIZE;

    if (isZeroBlock(header)) {
      const trailing = buffer.subarray(offset, offset + TAR_BLOCK_SIZE);
      if (longPath !== undefined || !isZeroBlock(trailing)) {
        throw createUpdaterError('INVALID_ARCHIVE', 'Invalid tar end marker.');
      }
      return entries;
    }

    const expectedChecksum = readOctal(header.subarray(CHECKSUM_START, CHECKSUM_END));
    if (computeHeaderChecksum(header) !== expectedChecksum) {
      throw createUpdaterError('INVALID_ARCHIVE', 'Invalid tar header checksum.');
    }

    const size = readOctal(header.subarray(SIZE_START, SIZE_END));
    const paddedSize = Math.ceil(size / TAR_BLOCK_SIZE) * TAR_BLOCK_SIZE;
    if (offset + paddedSize > buffer.length) {
      throw createUpdaterError('INVALID_ARCHIVE', 'Truncated tar entry.');
    }
    const content = buffer.subarray(offset, offset + size);
    offset += paddedSize;

    const type = String.fromCharCode(header[TYPE_OFFSET] || REGULAR_FILE_DEFAULT_CHAR_CODE);
    const name = readText(header.subarray(NAME_START, NAME_END));

    if (type === 'L' && (name === '././@LongLink' || name === '@LongLink')) {
      longPath = readText(content);
      continue;
    }
    if (type === 'x' || type === 'g') {
      continue;
    }
    if (type === '0') {
      const prefix =
        readText(header.subarray(MAGIC_START, MAGIC_END)) === 'ustar'
          ? readText(header.subarray(PREFIX_START, PREFIX_END))
          : '';
      const relativePath = longPath ?? (prefix ? `${prefix}/${name}` : name);
      entries.push({ relativePath, content });
    } else if (type !== '5') {
      throw createUpdaterError('INVALID_ARCHIVE', `Unsupported tar entry type for ${name}.`);
    }
    longPath = undefined;
  }

  throw createUpdaterError('INVALID_ARCHIVE', 'Missing tar end marker.');
}
