import { describe, expect, it } from 'vitest';
import { assertOpenMzRuntime } from '../../src/index.ts';

describe('assertOpenMzRuntime', () => {
  it('accepts OpenMZ 2.0.0+', () => {
    expect(() =>
      assertOpenMzRuntime({
        runtime: {
          Utils: { RPGMAKER_NAME: 'OPENMZ', RPGMAKER_VERSION: '2.0.0' },
        },
      }),
    ).not.toThrow();

    expect(() =>
      assertOpenMzRuntime({
        pluginName: 'OpenMzPixi3D',
        runtime: {
          Utils: { RPGMAKER_NAME: 'OPENMZ', RPGMAKER_VERSION: '2.1.3' },
        },
      }),
    ).not.toThrow();
  });

  it('rejects vanilla RPG Maker MZ and missing Utils', () => {
    expect(() =>
      assertOpenMzRuntime({
        pluginName: 'OpenMzPixi3D',
        runtime: {
          Utils: { RPGMAKER_NAME: 'MZ', RPGMAKER_VERSION: '1.8.0' },
        },
      }),
    ).toThrow(/OpenMzPixi3D requires OpenMZ 2\.0\.0 or later \(detected MZ 1\.8\.0\)\./);

    expect(() =>
      assertOpenMzRuntime({
        runtime: {},
      }),
    ).toThrow(/This plugin requires OpenMZ 2\.0\.0 or later \(detected unknown\)\./);
  });

  it('rejects older OpenMZ versions', () => {
    expect(() =>
      assertOpenMzRuntime({
        pluginName: 'OpenMzPixi3D',
        runtime: {
          Utils: { RPGMAKER_NAME: 'OPENMZ', RPGMAKER_VERSION: '1.9.9' },
        },
      }),
    ).toThrow(/OpenMzPixi3D requires OpenMZ 2\.0\.0 or later \(detected OPENMZ 1\.9\.9\)\./);

    expect(() =>
      assertOpenMzRuntime({
        pluginName: 'OpenMzPixi3D',
        minEngineVersion: '2.1.0',
        runtime: {
          Utils: { RPGMAKER_NAME: 'OPENMZ', RPGMAKER_VERSION: '2.0.0' },
        },
      }),
    ).toThrow(/OpenMzPixi3D requires OpenMZ 2\.1\.0 or later \(detected OPENMZ 2\.0\.0\)\./);
  });
});
