import type { InstallResult, UpdateCheck, UpdateProgress } from '../types.ts';
import type { UpdaterTexts } from './i18n.ts';
import { formatErrorMessage } from '../errors.ts';

export type UpdaterCommandSymbol = 'update' | 'check' | 'reload' | 'close';
export type UpdaterCommand = [label: string, symbol: UpdaterCommandSymbol];

export interface DialogView {
  title: string;
  lines: string[];
  progress?: number;
  commands?: UpdaterCommand[];
}

export interface ProgressSnapshot {
  text: string;
  progress: number;
  key: string;
}

const DOWNLOAD_PROGRESS_WEIGHT = 0.8;
const VERIFY_PROGRESS = 0.8;
const APPLY_PROGRESS = 0.9;

export function formatProgressSnapshot(event: UpdateProgress, texts: UpdaterTexts): ProgressSnapshot {
  if (event.phase === 'download') {
    const ratio = event.total > 0 ? Math.min(event.loaded / event.total, 1) : 0;
    const progress = ratio * DOWNLOAD_PROGRESS_WEIGHT;
    const text = texts.download(event.loaded, event.total);
    return {
      text,
      progress,
      key: `${text}:${Math.floor(progress * 100)}`,
    };
  }
  if (event.phase === 'verify') {
    return {
      text: texts.verify,
      progress: VERIFY_PROGRESS,
      key: `${texts.verify}:${Math.floor(VERIFY_PROGRESS * 100)}`,
    };
  }
  return {
    text: texts.apply,
    progress: APPLY_PROGRESS,
    key: `${texts.apply}:${Math.floor(APPLY_PROGRESS * 100)}`,
  };
}

export function createCheckingView(texts: UpdaterTexts): DialogView {
  return {
    title: texts.title,
    lines: [texts.check],
  };
}

export function createAvailableView(update: UpdateCheck, texts: UpdaterTexts): DialogView {
  return {
    title: texts.title,
    lines: [texts.version(update.installed?.version, update.manifest.version), texts.backup],
    commands: [
      [texts.update, 'update'],
      [texts.skip, 'close'],
    ],
  };
}

export function createUpToDateView(texts: UpdaterTexts): DialogView {
  return {
    title: texts.title,
    lines: [texts.current],
    commands: [[texts.skip, 'close']],
  };
}

export function createInstalledView(result: InstallResult, texts: UpdaterTexts): DialogView {
  return {
    title: texts.done,
    lines: [texts.installed(result.version), texts.saved(result.backupRelativeDir)],
    progress: 1,
    commands: [
      [texts.reload, 'reload'],
      [texts.later, 'close'],
    ],
  };
}

export function createErrorView(
  error: unknown,
  retrySymbol: Extract<UpdaterCommandSymbol, 'check' | 'update'>,
  texts: UpdaterTexts,
): DialogView {
  return {
    title: texts.error,
    lines: [formatErrorMessage(error)],
    commands: [
      [texts.retry, retrySymbol],
      [texts.skip, 'close'],
    ],
  };
}

/**
 * Wraps a single line of text to fit within `maxWidth`, breaking at whitespace
 * and path separators first and falling back to character-level wrapping.
 */
export function wrapTextLine(text: string, maxWidth: number, measureText: (value: string) => number): string[] {
  const lines: string[] = [];
  let line = '';
  const tokens = text.match(/(?:[^/\s]+\/*|\/+)\s*/g) || [];

  for (const token of tokens) {
    const word = token.trimEnd();
    if (line && measureText(line + word) > maxWidth) {
      lines.push(line.trimEnd());
      line = '';
    }
    if (measureText(word) <= maxWidth) {
      line += token;
      continue;
    }
    for (const character of word) {
      if (line && measureText(line + character) > maxWidth) {
        lines.push(line);
        line = '';
      }
      line += character;
    }
    line += token.slice(word.length);
  }

  lines.push(line.trimEnd());
  return lines;
}

export function wrapMessageLines(lines: string[], maxWidth: number, measureText: (value: string) => number): string[] {
  return lines.flatMap((text) =>
    String(text)
      .split(/\r?\n/)
      .flatMap((line) => wrapTextLine(line, maxWidth, measureText)),
  );
}
