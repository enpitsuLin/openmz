import type { OutputChunk, OutputOptions } from 'rolldown';
import type { RuntimeMetadata } from '../shared/engine-release.ts';

export interface BuildOptions {
  outDir?: string;
  version?: string;
}
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { rolldown } from 'rolldown';
import {
  coreScripts,
  isVersion,
  runtimeFormat,
  statePath,
} from '../shared/engine-release.ts';
import { emitEngineSource } from './emit-engine.ts';
import {
  restorePixiInitializers,
  transformClasses,
} from './transform-classes.ts';

export const projectRoot = fileURLToPath(new URL('../', import.meta.url));
export const runtimeDir = join(projectRoot, 'dist/runtime');
export const pluginDir = join(projectRoot, 'dist/plugins');
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

async function bundleScript(input: string, output: OutputOptions = {}) {
  const bundle = await rolldown({
    input: join(projectRoot, input),
    platform: 'browser',
  });
  try {
    const result = await bundle.generate({
      format: 'iife',
      codeSplitting: false,
      strict: false,
      ...output,
    });
    return (result.output[0] as OutputChunk).code;
  } finally {
    await bundle.close();
  }
}

export async function buildRuntime({
  outDir = runtimeDir,
  version,
}: BuildOptions = {}) {
  const metadata: RuntimeMetadata = {
    name: 'OpenMZ',
    version: resolveVersion(version),
    format: runtimeFormat,
    pixiVersion: pixiInfo.version,
  };
  const pixi = await bundleScript('src/lib/pixi.js', {
    name: 'PIXI',
    banner: `/*! PixiJS v${pixiInfo.version} | ${pixiInfo.license} | https://pixijs.com */`,
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
      const target = join(outDir, path);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, content);
    }),
  );
  return { outDir, files, metadata };
}

export async function buildUpdater({
  outDir = pluginDir,
}: Pick<BuildOptions, 'outDir'> = {}) {
  const entry = await readFile(
    join(projectRoot, 'plugins/OpenMzUpdater.ts'),
    'utf8',
  );
  const header = entry.slice(0, entry.indexOf('import '));
  const source = await bundleScript('plugins/OpenMzUpdater.ts');
  const file = join(outDir, 'OpenMzUpdater.js');
  await mkdir(outDir, { recursive: true });
  await writeFile(file, header + transformClasses(source, 'OpenMzUpdater.js'));
  return file;
}

export async function build(options: BuildOptions = {}) {
  const runtime = await buildRuntime(options);
  const updater = await buildUpdater();
  return { runtime, updater };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const { runtime, updater } = await build();
  console.log(
    `Built OpenMZ ${runtime.metadata.version}: ${runtime.files.length} runtime files in ${runtime.outDir}`,
  );
  console.log(`Built updater: ${updater}`);
}
