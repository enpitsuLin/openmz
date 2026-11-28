import { defineCommand } from 'citty';
import { buildPlugin, buildPlugins } from './plugins.ts';
import { buildRuntime } from './runtime.ts';

function logRuntime({ metadata, files, outDir }: Awaited<ReturnType<typeof buildRuntime>>) {
  console.log(`Built OpenMZ ${metadata.version}: ${files.length} runtime files in ${outDir}`);
}

function logPlugins(files: string[]) {
  for (const file of files) console.log(`Built plugin: ${file}`);
}

export const build = defineCommand({
  meta: {
    name: 'build',
    description: 'Build the runtime and all plugins by default',
  },
  default: 'all',
  subCommands: {
    all: defineCommand({
      meta: { hidden: true },
      async run() {
        const [runtime, plugins] = await Promise.all([buildRuntime(), buildPlugins()]);
        logRuntime(runtime);
        logPlugins(plugins);
      },
    }),
    runtime: defineCommand({
      meta: {
        name: 'runtime',
        description: 'Build the engine and runtime libraries',
      },
      async run() {
        logRuntime(await buildRuntime());
      },
    }),
    plugin: defineCommand({
      meta: { name: 'plugin', description: 'Build plugins' },
      args: {
        name: {
          type: 'positional',
          description: 'Plugin name. Omit to build all plugins.',
          required: false,
        },
      },
      async run({ args }) {
        logPlugins(args.name ? [await buildPlugin(args.name)] : await buildPlugins());
      },
    }),
  },
});
