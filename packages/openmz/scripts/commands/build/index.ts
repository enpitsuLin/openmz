import { defineCommand } from 'citty';
import { buildRuntime } from './runtime.ts';

export const build = defineCommand({
  meta: {
    name: 'build',
    description: 'Build the OpenMZ engine and runtime libraries',
  },
  async run() {
    const { metadata, files, outDir } = await buildRuntime();
    console.log(`Built OpenMZ ${metadata.version}: ${files.length} runtime files in ${outDir}`);
  },
});
