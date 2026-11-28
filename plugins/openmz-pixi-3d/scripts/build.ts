import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPlugin } from '@openmz-internal/build-utils';

const pixi3dPackage = import.meta.resolve('@pixi/3d/package.json');
const meshoptDecoder = createRequire(pixi3dPackage).resolve('meshoptimizer/decoder');
const [pixi3dLicense, meshoptLicense] = await Promise.all([
  readFile(new URL('LICENSE', pixi3dPackage), 'utf8'),
  readFile(join(dirname(meshoptDecoder), 'LICENSE.md'), 'utf8'),
]);

const file = await buildPlugin({
  entry: fileURLToPath(new URL('../src/index.ts', import.meta.url)),
  outFile: fileURLToPath(new URL('../dist/OpenMzPixi3D.js', import.meta.url)),
  transformPrototype: false,
  bundleOptions: {
    name: 'PIXI3D',
    external: ['pixi.js'],
    globals: { 'pixi.js': 'PIXI' },
    banner: ['/*!', '@pixi/3d', pixi3dLicense.trim(), '', 'meshoptimizer', meshoptLicense.trim(), '*/'].join('\n'),
  },
});
console.log('Built plugin:', file);
