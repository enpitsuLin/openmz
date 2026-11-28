import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Lang, parse } from '@ast-grep/napi';
import { bundleScript, formatOutput, projectRoot } from './output.ts';
import { transformClasses } from './transform-classes.ts';

export interface BuildPluginOptions {
  outDir?: string;
}

export const pluginDir = join(projectRoot, 'dist/plugins');
const sourceDir = join(projectRoot, 'plugins');

export async function buildPlugin(name: string, { outDir = pluginDir }: BuildPluginOptions = {}) {
  const entryPath = join(sourceDir, name, 'index.ts');
  const entry = await readFile(entryPath, 'utf8');
  const header = parse(Lang.TypeScript, entry)
    .root()
    .children()
    .filter((node) => node.kind() === 'comment' && node.text().startsWith('/*:'))
    .map((node) => node.text())
    .join('\n');
  const source = await bundleScript(entryPath);
  const filename = `${name}.js`;
  const file = join(outDir, filename);
  await mkdir(outDir, { recursive: true });
  await writeFile(file, await formatOutput(file, `${header}\n${transformClasses(source, filename)}`));
  return file;
}

export async function buildPlugins(options: BuildPluginOptions = {}) {
  const directories = await readdir(sourceDir, { withFileTypes: true });
  const names = directories
    .filter((directory) => directory.isDirectory())
    .map((directory) => directory.name)
    .sort();
  return Promise.all(names.map((name) => buildPlugin(name, options)));
}
