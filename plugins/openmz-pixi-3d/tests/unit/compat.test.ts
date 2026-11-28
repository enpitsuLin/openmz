import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { bundleScript } from '@openmz-internal/build-utils';
import { describe, expect, it } from 'vitest';

describe('OpenMzPixi3D bundle preflight', () => {
  it('throws OpenMZ compatibility error before evaluating @pixi/3d internals', async () => {
    const bundled = await bundleScript(fileURLToPath(new URL('../../src/index.ts', import.meta.url)), {
      name: 'PIXI3D',
      external: ['pixi.js'],
      globals: { 'pixi.js': 'PIXI' },
    });

    const vanillaMz = vm.createContext({
      Utils: { RPGMAKER_NAME: 'MZ', RPGMAKER_VERSION: '1.8.0' },
      PIXI: { VERSION: '5.3.12' },
    });

    expect(() => vm.runInContext(bundled, vanillaMz)).toThrow(
      /OpenMzPixi3D requires OpenMZ 2\.0\.0 or later \(detected MZ 1\.8\.0\)\./,
    );
  });
});
