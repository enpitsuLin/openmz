import { fileURLToPath } from 'node:url';
import { buildPlugin } from '@openmz-internal/build-utils';

const file = await buildPlugin({
  entry: fileURLToPath(new URL('../src/index.ts', import.meta.url)),
  outFile: fileURLToPath(new URL('../dist/Hd2d.js', import.meta.url)),
  transformPrototype: false,
  bundleOptions: {
    external: ['pixi.js', '@pixi/3d', '@pixi/3d/extras'],
    globals: { 'pixi.js': 'PIXI', '@pixi/3d': 'PIXI3D', '@pixi/3d/extras': 'PIXI3D.extras' },
  },
});
console.log('Built plugin:', file);
