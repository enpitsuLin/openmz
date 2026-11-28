import type { Plugin } from 'vitest/config';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildRuntime, runtimeDir } from '../../scripts/commands/build/runtime.ts';

const vendor = fileURLToPath(new URL('../../../../vendor', import.meta.url));
const fixtures = fileURLToPath(new URL('./fixtures', import.meta.url));
const mimeTypes: Record<string, string> = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.ogg': 'audio/ogg',
  '.png': 'image/png',
  '.wasm': 'application/wasm',
  '.woff': 'font/woff',
};

export function pluginCompatServer(): Plugin {
  return {
    name: 'plugin-compat-game-server',
    async configureServer(server) {
      await buildRuntime();
      server.middlewares.use('/__plugin-compat__', async (request, response, next) => {
        const [, engine, path] =
          /^\/(stock|openmz)\/(.+)$/.exec(new URL(request.url!, 'http://localhost').pathname) ?? [];
        if (!path) {
          response.writeHead(404).end();
          return;
        }
        let asset;
        try {
          asset = decodeURIComponent(path);
        } catch {
          response.writeHead(400).end('Bad Request');
          return;
        }
        let root = fixtures;
        if (asset.startsWith('js/') && asset !== 'js/plugins.js' && !asset.startsWith('js/plugins/'))
          root = engine === 'stock' ? vendor : runtimeDir;
        const file = resolve(root, asset);
        if (!file.startsWith(root + sep)) {
          response.writeHead(404).end();
          return;
        }
        try {
          const bytes = await readFile(file);
          response.setHeader('Content-Type', mimeTypes[extname(file)] ?? 'application/octet-stream');
          response.end(bytes);
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code === 'ENOENT' || (error as NodeJS.ErrnoException).code === 'EISDIR')
            response.writeHead(404).end();
          else next(error);
        }
      });
    },
  };
}
