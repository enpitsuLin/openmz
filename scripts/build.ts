import type { BuildRuntimeOptions } from './build-runtime.ts';
import { pathToFileURL } from 'node:url';
import { buildRuntime } from './build-runtime.ts';
import { buildPlugins } from './build-plugins.ts';

export async function build(options: BuildRuntimeOptions = {}) {
  const [runtime, plugins] = await Promise.all([
    buildRuntime(options),
    buildPlugins(),
  ]);
  return { runtime, plugins };
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const { runtime, plugins } = await build();
  console.log(
    `Built OpenMZ ${runtime.metadata.version}: ${runtime.files.length} runtime files in ${runtime.outDir}`,
  );
  for (const file of plugins) console.log(`Built plugin: ${file}`);
}
