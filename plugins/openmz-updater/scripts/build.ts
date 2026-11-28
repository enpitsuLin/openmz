import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPlugin } from '@openmz-internal/build-utils';

export const pluginRoot = fileURLToPath(new URL('../', import.meta.url));
export const defaultOutFile = join(pluginRoot, 'dist/OpenMzUpdater.js');

export async function buildUpdater({ outFile = defaultOutFile }: { outFile?: string } = {}) {
  return buildPlugin({
    entry: join(pluginRoot, 'src/index.ts'),
    outFile,
  });
}

const isDirectRun = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  const file = await buildUpdater();
  console.log(`Built plugin: ${file}`);
}
