import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';
import { Lang, parse } from '@ast-grep/napi';
import { bundleScript, formatOutput } from './output.ts';
import { transformClasses } from './transform-classes.ts';

export interface BuildPluginOptions {
  entry: string;
  outFile: string;
  transformPrototype?: boolean;
}

export async function buildPlugin({ entry, outFile, transformPrototype = true }: BuildPluginOptions) {
  const entryPath = resolve(entry);
  const file = resolve(outFile);
  const filename = basename(file);
  const entrySource = await readFile(entryPath, 'utf8');
  const header = parse(Lang.TypeScript, entrySource)
    .root()
    .children()
    .filter((node) => node.kind() === 'comment' && node.text().startsWith('/*:'))
    .map((node) => node.text())
    .join('\n');
  const bundled = await bundleScript(entryPath);
  const body = transformPrototype ? transformClasses(bundled, filename) : bundled;
  const combined = header ? `${header}\n${body}` : body;
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, await formatOutput(file, combined));
  return file;
}
