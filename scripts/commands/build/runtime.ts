import type { RuntimeMetadata } from '../../../shared/engine-release.ts';

export interface BuildRuntimeOptions {
  outDir?: string;
  version?: string;
}
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import {
  coreScripts,
  isVersion,
  runtimeFormat,
  statePath,
} from '../../../shared/engine-release.ts';
import { emitEngineSource } from './emit-engine.ts';
import { bundleScript, formatOutput, projectRoot } from './output.ts';
import {
  restorePixiInitializers,
  transformClasses,
} from './transform-classes.ts';

export const runtimeDir = join(projectRoot, 'dist/runtime');
const engineDir = join(projectRoot, 'src');
const libraryDir = join(projectRoot, 'vendor/libs');
const packageInfo: { version: string } = JSON.parse(
  await readFile(join(projectRoot, 'package.json'), 'utf8'),
);
const pixiInfo: { version: string; license: string } = JSON.parse(
  await readFile(
    join(projectRoot, 'node_modules/pixi.js/package.json'),
    'utf8',
  ),
);

export function resolveVersion(version: string = packageInfo.version) {
  const value = version.replace(/^v/, '');
  if (!isVersion(value)) throw new Error(`Invalid release version: ${version}`);
  return value;
}

export async function buildRuntime({
  outDir = runtimeDir,
  version,
}: BuildRuntimeOptions = {}) {
  const metadata: RuntimeMetadata = {
    name: 'OpenMZ',
    version: resolveVersion(version),
    format: runtimeFormat,
    pixiVersion: pixiInfo.version,
  };
  const pixi = await bundleScript('src/lib/pixi.js', {
    name: 'PIXI',
    banner: `/*! PixiJS v${pixiInfo.version} | ${pixiInfo.license} | https://pixijs.com
 * Modified by OpenMZ v${metadata.version} | https://github.com/enpitsuLin/openmz
 * Runtime format: ${metadata.format}; modern JavaScript syntax preserved.
 * Classes converted to functions/prototypes for legacy plugin construction.
 */`,
  });
  const libraries = (await readdir(libraryDir)).sort();
  const files = [
    ...coreScripts.map((name) => `js/${name}`),
    'js/libs/pixi.js',
    ...libraries.map((name) => `js/libs/${name}`),
    statePath,
  ].sort();
  await Promise.all(
    files.map(async (path) => {
      let content;
      if (path === statePath) {
        content = `${JSON.stringify(metadata, null, 2)}\n`;
      } else if (path === 'js/libs/pixi.js') {
        content = transformClasses(pixi, path);
      } else {
        const engine = !path.startsWith('js/libs/');
        const sourcePath = engine
          ? join(engineDir, path.slice(3).replace(/\.js$/, '.ts'))
          : join(libraryDir, path.slice('js/libs/'.length));
        const bytes = await readFile(sourcePath);
        if (path.endsWith('.js')) {
          let source = engine
            ? emitEngineSource(bytes.toString('utf8'))
            : bytes.toString('utf8');
          if (path === 'js/rmmz_core.js')
            source = restorePixiInitializers(source);
          if (path.startsWith('js/rmmz_'))
            source = transformClasses(source, path);
          content = source;
        } else {
          content = bytes;
        }
      }
      if (typeof content === 'string') {
        content = await formatOutput(path, content);
      }
      const target = join(outDir, path);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, content);
    }),
  );
  return { outDir, files, metadata };
}
