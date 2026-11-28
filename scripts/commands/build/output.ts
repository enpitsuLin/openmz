import type { OutputChunk, OutputOptions } from 'rolldown';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rolldown } from 'rolldown';
import { format } from 'oxfmt';
import formatOptions from '../../../.oxfmtrc.json' with { type: 'json' };

export const projectRoot = fileURLToPath(new URL('../../../', import.meta.url));
export const outputFormatOptions = { ...formatOptions, printWidth: 120 };

export async function bundleScript(input: string, output: OutputOptions = {}) {
  const bundle = await rolldown({
    input: resolve(projectRoot, input),
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

export async function formatOutput(filename: string, source: string) {
  const { code, errors } = await format(filename, source, outputFormatOptions);
  if (errors.length) {
    throw new Error(`Failed to format ${filename}: ${errors.map((error) => error.message).join('; ')}`);
  }
  return code;
}
