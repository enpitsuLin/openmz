import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const src = fileURLToPath(new URL('../../src', import.meta.url));
const vendor = fileURLToPath(new URL('../../vendor', import.meta.url));
const fixtures = fileURLToPath(new URL('./fixtures', import.meta.url));

const mimeTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.ogg': 'audio/ogg',
  '.png': 'image/png',
  '.wasm': 'application/wasm',
  '.woff': 'font/woff',
};

export function pluginCompatServer() {
  return {
    name: 'plugin-compat-game-server',
    configureServer(server) {
      server.middlewares.use('/__plugin-compat__', async (request, response, next) => {
        const [, engine, path] = /^\/(stock|openmz)\/(.+)$/.exec(
          new URL(request.url, 'http://localhost').pathname,
        ) ?? [];
        if (!path) {
          response.writeHead(404).end();
          return;
        }

        const asset = decodeURIComponent(path);
        let root = src;
        if (asset === 'js/plugins.js' || asset.startsWith('js/plugins/')) {
          root = fixtures;
        } else if (engine === 'stock' && asset.startsWith('js/')) {
          root = vendor;
        }

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
          if (error.code === 'ENOENT' || error.code === 'EISDIR') {
            response.writeHead(404).end();
          } else {
            next(error);
          }
        }
      });
    },
  };
}
