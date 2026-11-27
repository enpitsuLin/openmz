import type { RuntimeMetadata } from '../../../shared/engine-release.ts';

export interface BuildRuntimeOptions {
  outDir?: string;
  version?: string;
}
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
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
const vendorLibraryDir = join(projectRoot, 'vendor/js/libs');
const sourceLibraryDir = join(engineDir, 'libs');
const packageInfo: { version: string } = JSON.parse(
  await readFile(join(projectRoot, 'package.json'), 'utf8'),
);
const pixiInfo: { version: string; license: string } = JSON.parse(
  await readFile(
    join(projectRoot, 'node_modules/pixi.js/package.json'),
    'utf8',
  ),
);

const libraryProcessors = new Map<
  string,
  (sourcePath: string, metadata: RuntimeMetadata) => Promise<string | Buffer>
>([
  [
    'pixi.js',
    async (sourcePath, metadata) => {
      const pixi = await bundleScript(sourcePath, {
        name: 'PIXI',
        banner: `/*! PixiJS v${metadata.pixiVersion} | ${pixiInfo.license} | https://pixijs.com
 * Modified by OpenMZ v${metadata.version} | https://github.com/enpitsuLin/openmz
 * Runtime format: ${metadata.format}; modern JavaScript syntax preserved.
 * Classes converted to functions/prototypes for legacy plugin construction.
 */`,
      });
      return transformClasses(pixi, 'js/libs/pixi.js');
    },
  ],
]);

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
  const librarySources = new Map<string, string>();
  for (const directory of [vendorLibraryDir, sourceLibraryDir]) {
    for (const name of await readdir(directory)) {
      librarySources.set(`js/libs/${name}`, join(directory, name));
    }
  }
  const files = [
    ...coreScripts.map((name) => `js/${name}`),
    ...librarySources.keys(),
    statePath,
  ].sort();
  await Promise.all(
    files.map(async (path) => {
      const librarySource = librarySources.get(path);
      let content;
      if (path === statePath) {
        content = `${JSON.stringify(metadata, null, 2)}\n`;
      } else if (librarySource) {
        const processLibrary = libraryProcessors.get(basename(path));
        content = processLibrary
          ? await processLibrary(librarySource, metadata)
          : await readFile(librarySource, path.endsWith('.js') ? 'utf8' : null);
      } else {
        const sourcePath = join(
          engineDir,
          path.slice(3).replace(/\.js$/, '.ts'),
        );
        let source = emitEngineSource(await readFile(sourcePath, 'utf8'));
        if (path === 'js/rmmz_core.js')
          source = restorePixiInitializers(source);
        if (path.startsWith('js/rmmz_'))
          source = transformClasses(source, path);
        content = source;
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
