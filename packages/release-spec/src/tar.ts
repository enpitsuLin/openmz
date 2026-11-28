import type { ArchiveEntry } from './index.ts';
import { Buffer } from 'node:buffer';

const blockSize = 512;

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
