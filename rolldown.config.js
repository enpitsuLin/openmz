import pixiPackage from 'pixi.js/package.json' with { type: 'json' };
import { defineConfig } from 'rolldown';

export default defineConfig({
  input: 'vendor/lib-entries/pixi.js',
  platform: 'browser',
  output: {
    banner: () => `/*!
 * ${pixiPackage.name} - v${pixiPackage.version}
 * Compiled ${new Date().toUTCString().replace('GMT', 'UTC')}
 *
 * ${pixiPackage.name} is licensed under the ${pixiPackage.license} License.
 * http://www.opensource.org/licenses/mit-license
 */`,
    footer: 'PIXI.useDeprecated();',
    format: 'iife',
    name: 'PIXI',
    file: 'src/js/libs/pixi.js',
  },
});
