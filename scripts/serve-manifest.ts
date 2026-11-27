import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildRelease, defaultReleaseDir } from './commands/pack/artifacts.ts';

const mimeTypes: Record<string, string> = {
  '.gz': 'application/gzip',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.tgz': 'application/gzip',
  '.wasm': 'application/wasm',
};

export function createManifestServer({
  rootDir = defaultReleaseDir,
  host = '127.0.0.1',
  port = 4173,
}: { rootDir?: string; host?: string; port?: number } = {}) {
  const normalizedRoot = resolve(rootDir);

  return createServer(async (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Cache-Control', 'no-store');

    if (request.method === 'OPTIONS') {
      response.writeHead(204).end();
      return;
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405).end('Method Not Allowed');
      return;
    }

    const pathname = decodeURIComponent(
      new URL(request.url || '/', `http://${host}:${port}`).pathname,
    );
    const relativePath = pathname.replace(/^\/+/, '');
    if (!relativePath) {
      response.writeHead(404).end('Not Found');
      return;
    }

    const filePath = resolve(normalizedRoot, relativePath);
    if (!filePath.startsWith(`${normalizedRoot}${sep}`)) {
      response.writeHead(403).end('Forbidden');
      return;
    }

    try {
      const bytes = await readFile(filePath);
      const contentType =
        mimeTypes[extname(filePath)] || 'application/octet-stream';
      response.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': bytes.length,
      });
      response.end(request.method === 'HEAD' ? undefined : bytes);
    } catch (error) {
      const status =
        (error as NodeJS.ErrnoException).code === 'ENOENT' ||
        (error as NodeJS.ErrnoException).code === 'EISDIR'
          ? 404
          : 500;
      response
        .writeHead(status)
        .end(status === 404 ? 'Not Found' : (error as Error).message);
    }
  });
}

function parsePortArg(argv: string[]) {
  const flagIndex = argv.indexOf('--port');
  if (flagIndex !== -1 && argv[flagIndex + 1]) {
    const parsed = Number.parseInt(argv[flagIndex + 1], 10);
    if (Number.isInteger(parsed) && parsed > 0) {
      return parsed;
    }
  }
  const envPort = Number.parseInt(process.env.PORT || '', 10);
  return Number.isInteger(envPort) && envPort > 0 ? envPort : 4173;
}

const isDirectRun =
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  const args = process.argv.slice(2);
  const host = process.env.HOST || '127.0.0.1';
  const port = parsePortArg(args);

  if (!args.includes('--no-build')) {
    const built = await buildRelease({ outDir: defaultReleaseDir });
    console.log(
      `Prepared release v${built.manifest.version} (${built.includedFiles.length} files, ${built.manifest.archive.size} bytes)`,
    );
  }

  const server = createManifestServer({
    rootDir: defaultReleaseDir,
    host,
    port,
  });
  server.listen(port, host, () => {
    console.log(
      `OpenMZ manifest server listening at http://${host}:${port}/manifest.json`,
    );
  });
}
