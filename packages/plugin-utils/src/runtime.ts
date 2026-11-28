export interface RuntimeGlobals {
  Utils?: {
    RPGMAKER_NAME?: unknown;
    RPGMAKER_VERSION?: unknown;
  };
}

export interface OpenMzRuntimeOptions {
  pluginName?: string;
  minEngineVersion?: string;
  runtime?: RuntimeGlobals;
}

const REQUIRED_ENGINE_NAME = 'OPENMZ';
const DEFAULT_PLUGIN_NAME = 'This plugin';
const DEFAULT_MIN_ENGINE_VERSION = '2.0.0';

type SemverTuple = [major: number, minor: number, patch: number];

function parseVersion(version: unknown): SemverTuple | null {
  if (typeof version !== 'string') return null;
  const match = /^(\d+)\.(\d+)(?:\.(\d+))?/.exec(version.trim());
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3] ?? 0)];
}

function compareVersions(a: SemverTuple, b: SemverTuple): number {
  for (let i = 0; i < 3; i++) {
    if (a[i] > b[i]) return 1;
    if (a[i] < b[i]) return -1;
  }
  return 0;
}

function formatDetectedEngine(utils: RuntimeGlobals['Utils']): string {
  const name = typeof utils?.RPGMAKER_NAME === 'string' && utils.RPGMAKER_NAME ? utils.RPGMAKER_NAME : 'unknown';
  const version = typeof utils?.RPGMAKER_VERSION === 'string' && utils.RPGMAKER_VERSION ? utils.RPGMAKER_VERSION : '';
  return version ? `${name} ${version}` : name;
}

/**
 * Verifies that the current runtime is OpenMZ and meets the required engine version.
 */
export function assertOpenMzRuntime(options: OpenMzRuntimeOptions = {}): void {
  const {
    pluginName = DEFAULT_PLUGIN_NAME,
    minEngineVersion = DEFAULT_MIN_ENGINE_VERSION,
    runtime = globalThis as unknown as RuntimeGlobals,
  } = options;

  const utils = runtime.Utils;
  if (utils?.RPGMAKER_NAME !== REQUIRED_ENGINE_NAME) {
    throw new Error(
      `${pluginName} requires OpenMZ ${minEngineVersion} or later (detected ${formatDetectedEngine(utils)}).`,
    );
  }

  const engineVersion = parseVersion(utils.RPGMAKER_VERSION);
  const requiredEngineVersion = parseVersion(minEngineVersion);
  if (!requiredEngineVersion) {
    throw new Error(`Invalid minEngineVersion: ${minEngineVersion}`);
  }
  if (!engineVersion || compareVersions(engineVersion, requiredEngineVersion) < 0) {
    throw new Error(
      `${pluginName} requires OpenMZ ${minEngineVersion} or later (detected ${formatDetectedEngine(utils)}).`,
    );
  }
}
