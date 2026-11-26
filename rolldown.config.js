import { readFileSync } from 'node:fs';
import { defineConfig } from 'rolldown';

const pixiPackage = JSON.parse(
  readFileSync(new URL('./node_modules/pixi.js/package.json', import.meta.url), 'utf8'),
);

export default defineConfig({
  input: 'vendor/lib-entries/pixi.js',
  platform: 'browser',
  output: {
    banner: `/*!
 * ${pixiPackage.name} - v${pixiPackage.version}
 *
 * ${pixiPackage.name} is licensed under the ${pixiPackage.license} License.
 * http://www.opensource.org/licenses/mit-license
 */`,
    codeSplitting: false,
    format: 'iife',
    name: 'PIXI',
    file: 'src/js/libs/pixi.js',
  },
});
