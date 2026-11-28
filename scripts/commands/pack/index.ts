import { defineCommand } from 'citty';
import { buildRelease } from './artifacts.ts';

export const pack = defineCommand({
  meta: {
    name: 'pack',
    description: 'Build the release archive, manifest, and plugins',
  },
  args: {
    version: { type: 'string', description: 'Override the release version' },
  },
  async run({ args }) {
    const release = await buildRelease({ version: args.version });
    console.log(`Built ${release.manifest.archive.url} (${release.includedFiles.length} files)`);
  },
});
