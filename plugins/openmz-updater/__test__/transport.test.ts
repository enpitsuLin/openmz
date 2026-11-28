import type { TestContext } from 'vitest';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { test } from 'vitest';
import { isUpdaterError } from '../src/errors.ts';
import { fetchBuffer } from '../src/transport.ts';

const require = createRequire(import.meta.url);

async function startServer(t: TestContext, server: import('node:http').Server) {
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  t.onTestFinished(() => new Promise<void>((resolve) => server.close(() => resolve())));
  return `http://127.0.0.1:${(server.address() as import('node:net').AddressInfo).port}`;
}

test('refuses HTTP redirects to file:// URLs', async (t) => {
  const origin = await startServer(
    t,
    createServer((_req, res) => {
      res.writeHead(302, { Location: 'file:///etc/hosts' }).end();
    }),
  );

  await assert.rejects(
    fetchBuffer(require, `${origin}/manifest.json`),
    (error: unknown) => isUpdaterError(error) && error.code === 'UNSAFE_REDIRECT',
  );
});

test('refuses unsupported protocols', async () => {
  await assert.rejects(
    fetchBuffer(require, 'ftp://example.com/manifest.json'),
    (error: unknown) => isUpdaterError(error) && error.code === 'UNSAFE_PROTOCOL',
  );
});

test('enforces maxBytes for both HTTP responses and local files', async (t) => {
  const origin = await startServer(
    t,
    createServer((req, res) => {
      if (req.url === '/chunked') {
        res.writeHead(200);
        res.write('12345');
        res.end('67890');
      } else {
        res.writeHead(200, { 'Content-Length': '10' });
        res.end('1234567890');
      }
    }),
  );

  await assert.rejects(
    fetchBuffer(require, `${origin}/sized`, { maxBytes: 5 }),
    (error: unknown) => isUpdaterError(error) && error.code === 'RESPONSE_TOO_LARGE',
  );
  await assert.rejects(
    fetchBuffer(require, `${origin}/chunked`, { maxBytes: 5 }),
    (error: unknown) => isUpdaterError(error) && error.code === 'RESPONSE_TOO_LARGE',
  );

  const dir = await mkdtemp(join(tmpdir(), 'openmz-transport-'));
  t.onTestFinished(() => rm(dir, { recursive: true, force: true }));
  const file = join(dir, 'big.bin');
  await writeFile(file, Buffer.alloc(16, 1));

  await assert.rejects(
    fetchBuffer(require, pathToFileURL(file).href, { maxBytes: 8 }),
    (error: unknown) => isUpdaterError(error) && error.code === 'RESPONSE_TOO_LARGE',
  );
});

test('enforces redirect limit, idle timeout, incomplete downloads, and AbortSignal', async (t) => {
  const origin = await startServer(
    t,
    createServer((req, res) => {
      if (req.url === '/loop') {
        res.writeHead(302, { Location: '/loop' }).end();
      } else if (req.url === '/slow') {
        res.writeHead(200, { 'Content-Length': '10' });
        res.write('123');
      } else if (req.url === '/truncated') {
        res.writeHead(200, { 'Content-Length': '100' });
        res.write('partial');
        res.socket?.destroy();
      } else {
        res.writeHead(404).end();
      }
    }),
  );

  await assert.rejects(
    fetchBuffer(require, `${origin}/loop`, { maxRedirects: 2 }),
    (error: unknown) => isUpdaterError(error) && error.code === 'TOO_MANY_REDIRECTS',
  );

  await assert.rejects(
    fetchBuffer(require, `${origin}/slow`, { timeoutMs: 50 }),
    (error: unknown) => isUpdaterError(error) && error.code === 'NETWORK_TIMEOUT',
  );

  await assert.rejects(
    fetchBuffer(require, `${origin}/truncated`),
    (error: unknown) => isUpdaterError(error) && error.code === 'INCOMPLETE_DOWNLOAD',
  );

  const controller = new AbortController();
  setTimeout(() => controller.abort(), 30);
  await assert.rejects(
    fetchBuffer(require, `${origin}/slow`, { signal: controller.signal }),
    (error: unknown) => isUpdaterError(error) && error.code === 'ABORTED',
  );

  await assert.rejects(
    fetchBuffer(require, `${origin}/missing`),
    (error: unknown) => isUpdaterError(error) && error.code === 'HTTP_ERROR',
  );
});
