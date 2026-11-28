import type { NodeRequire } from '../types.ts';

export interface UpdaterEnvironment {
  readonly manifestUrl: string;
  readonly nodeRequire: NodeRequire;
  getProjectRoot(): string;
  getLocale(): string;
  reloadApp(): void;
  waitForRender(): Promise<void>;
}

export function resolvePluginName(scriptSrc?: string): string {
  if (!scriptSrc) return 'OpenMzUpdater';
  const filename = scriptSrc.split('/').pop();
  if (!filename) return 'OpenMzUpdater';
  return decodeURIComponent(filename.replace(/\.js$/i, '')) || 'OpenMzUpdater';
}

function getCurrentScriptSrc(): string {
  if (typeof document === 'undefined') return '';
  return (document.currentScript as HTMLScriptElement | null)?.src || '';
}

function resolveProjectRoot(nodeRequire: NodeRequire): string {
  const path = nodeRequire('path');
  if (typeof window !== 'undefined' && window.location?.protocol === 'file:' && window.location.href) {
    return path.dirname(nodeRequire('url').fileURLToPath(window.location.href));
  }
  if (typeof process !== 'undefined') {
    if (process.mainModule?.filename) {
      return path.dirname(process.mainModule.filename);
    }
    return process.cwd();
  }
  return '.';
}

function reloadApplication(): void {
  const app = typeof nw === 'object' && nw.Window ? nw.Window.get() : null;
  if (app?.reloadIgnoringCache) {
    app.reloadIgnoringCache();
  } else if (typeof window !== 'undefined' && window.location?.reload) {
    window.location.reload();
  }
}

function waitForNextPaintedFrame(): Promise<void> {
  return new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
}

/**
 * Detects whether the plugin is running inside an RPG Maker MZ NW.js environment
 * with a non-empty `manifestUrl` parameter. Returns `null` when inert.
 */
export function detectUpdaterEnvironment(): UpdaterEnvironment | null {
  if (
    typeof PluginManager === 'undefined' ||
    typeof Scene_Title === 'undefined' ||
    typeof Window_Base === 'undefined' ||
    typeof Window_HorzCommand === 'undefined' ||
    typeof Utils === 'undefined'
  ) {
    return null;
  }

  const pluginName = resolvePluginName(getCurrentScriptSrc());
  const manifestUrl = String(PluginManager.parameters(pluginName).manifestUrl || '').trim();
  const nodeRequire = typeof require === 'function' ? (require as unknown as NodeRequire) : null;

  if (!manifestUrl || !nodeRequire || !Utils.isNwjs()) {
    return null;
  }

  return {
    manifestUrl,
    nodeRequire,
    getProjectRoot: () => resolveProjectRoot(nodeRequire),
    getLocale: () =>
      (typeof $dataSystem !== 'undefined' && $dataSystem?.locale) ||
      (typeof navigator !== 'undefined' && navigator.language) ||
      'en',
    reloadApp: reloadApplication,
    waitForRender: waitForNextPaintedFrame,
  };
}
