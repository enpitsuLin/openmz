import type { UpdaterError, UpdaterErrorCode } from './types.ts';

export interface UpdaterErrorOptions {
  cause?: unknown;
  details?: Readonly<Record<string, unknown>>;
}

/**
 * Creates a structured updater error without subclassing native `Error`,
 * ensuring consistent behavior after prototype-based class transformation.
 */
export function createUpdaterError(
  code: UpdaterErrorCode,
  message: string,
  options?: UpdaterErrorOptions,
): UpdaterError {
  const error = new Error(
    message,
    options?.cause !== undefined ? { cause: options.cause } : undefined,
  );
  error.name = 'UpdaterError';
  Object.defineProperty(error, 'code', {
    value: code,
    enumerable: true,
  });
  if (options?.details) {
    Object.defineProperty(error, 'details', {
      value: options.details,
      enumerable: true,
    });
  }
  return error as UpdaterError;
}

export function isUpdaterError(value: unknown): value is UpdaterError {
  return (
    value instanceof Error &&
    value.name === 'UpdaterError' &&
    typeof (value as Partial<UpdaterError>).code === 'string'
  );
}

export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return String(error);
}
