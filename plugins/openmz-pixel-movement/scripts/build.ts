import { fileURLToPath } from 'node:url';
import { buildPlugin } from '@openmz-internal/build-utils';

const file = await buildPlugin({
  entry: fileURLToPath(new URL('../src/index.ts', import.meta.url)),
  outFile: fileURLToPath(new URL('../dist/PixelMovement.js', import.meta.url)),
  transformPrototype: false,
});
console.log('Built plugin:', file);
