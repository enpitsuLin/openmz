import { defineCommand, runMain } from 'citty';
import { build } from './commands/build/index.ts';
import { pack } from './commands/pack/index.ts';

await runMain(
  defineCommand({
    meta: { name: 'openmz', description: 'Build and package OpenMZ core runtime' },
    subCommands: { build, pack },
  }),
);
