import type { Buffer } from 'node:buffer';
import type {
  DownloadCallback,
  FetchOptions,
  FetchResult,
  NodeRequire,
} from './types.ts';
import { createUpdaterError } from './errors.ts';

export const DEFAULT_MAX_REDIRECTS = 10;
export const DEFAULT_REQUEST_TIMEOUT_MS = 30_000;

type HttpResult =
  | { location: string; buffer?: never }
  | { buffer: Buffer; location?: never };

const HTTP_PROTOCOLS = new Set(['http:', 'https:']);

function isHttpProtocol(protocol: string): protocol is 'http:' | 'https:' {
  return HTTP_PROTOCOLS.has(protocol);
}

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) {
    throw createUpdaterError('ABORTED', 'Request aborted.', {
      cause: signal.reason,
    });
  }
}

function normalizeFetchOptions(
  optionsOrCallback?: DownloadCallback | FetchOptions,
): FetchOptions {
  if (typeof optionsOrCallback === 'function') {
    return { onData: optionsOrCallback };
  }
  return optionsOrCallback ?? {};
}

/**
 * Single HTTP(S) GET. Resolves `{ location }` for redirects, `{ buffer }` otherwise.
 * Enforces idle timeout, optional byte limit, abort signal, and complete stream checks.
 */
function httpGet(
  nodeRequire: NodeRequire,
  url: URL,
  options: Pick<FetchOptions, 'onData' | 'maxBytes' | 'timeoutMs' | 'signal'>,
): Promise<HttpResult> {
  const {
    onData,
    maxBytes,
    timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS,
    signal,
  } = options;

  return new Promise<HttpResult>((resolve, reject) => {
    throwIfAborted(signal);

    const { Buffer: NodeBuffer } = nodeRequire('buffer');
    const transport = nodeRequire(
      url.protocol.slice(0, -1) as 'http' | 'https',
    );
    let settled = false;

    const cleanup = () => {
      signal?.removeEventListener('abort', onAbort);
    };
    const succeed = (result: HttpResult) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(result);
    };
    const fail = (error: unknown) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(error);
    };

    const request = transport.get(
      url.href,
      {
        headers: {
          'User-Agent': 'OpenMzUpdater',
          'Cache-Control': 'no-cache',
        },
      },
      (response) => {
        const status = response.statusCode ?? 0;
        const { location } = response.headers;
        const contentLength = Number(response.headers['content-length']) || 0;
        let received = 0;

        response.on('error', (error) => {
          fail(
            createUpdaterError(
              'INCOMPLETE_DOWNLOAD',
              `Incomplete download: ${url.href}`,
              {
                cause: error,
                details: { url: url.href, received, contentLength },
              },
            ),
          );
        });

        if (status >= 300 && status < 400 && location) {
          response.resume();
          succeed({ location });
          return;
        }
        if (status < 200 || status >= 300) {
          response.resume();
          fail(
            createUpdaterError('HTTP_ERROR', `HTTP ${status}: ${url.href}`, {
              details: { status, url: url.href },
            }),
          );
          return;
        }

        if (maxBytes !== undefined && contentLength > maxBytes) {
          const error = createUpdaterError(
            'RESPONSE_TOO_LARGE',
            `Response exceeds maximum allowed size (${maxBytes} bytes): ${url.href}`,
            { details: { maxBytes, contentLength, url: url.href } },
          );
          fail(error);
          request.destroy();
          return;
        }

        const chunks: Buffer[] = [];

        response.on('data', (chunk: Buffer) => {
          if (settled) return;
          received += chunk.length;
          if (maxBytes !== undefined && received > maxBytes) {
            const error = createUpdaterError(
              'RESPONSE_TOO_LARGE',
              `Response exceeds maximum allowed size (${maxBytes} bytes): ${url.href}`,
              { details: { maxBytes, received, url: url.href } },
            );
            fail(error);
            request.destroy();
            return;
          }
          chunks.push(chunk);
          onData?.(received, contentLength);
        });

        response.on('end', () => {
          if (response.complete) {
            succeed({ buffer: NodeBuffer.concat(chunks) });
          } else {
            fail(
              createUpdaterError(
                'INCOMPLETE_DOWNLOAD',
                `Incomplete download: ${url.href}`,
                { details: { url: url.href, received, contentLength } },
              ),
            );
          }
        });
        response.on('close', () => {
          if (!settled && !response.complete) {
            fail(
              createUpdaterError(
                'INCOMPLETE_DOWNLOAD',
                `Incomplete download: ${url.href}`,
                { details: { url: url.href, received, contentLength } },
              ),
            );
          }
        });
      },
    );

    const onAbort = () => {
      const error = createUpdaterError(
        'ABORTED',
        `Request aborted: ${url.href}`,
        {
          cause: signal?.reason,
        },
      );
      fail(error);
      request.destroy();
    };
    signal?.addEventListener('abort', onAbort, { once: true });

    request.on('error', (error) => {
      if ((error as NodeJS.ErrnoException).code === 'ECONNRESET') {
        fail(
          createUpdaterError(
            'INCOMPLETE_DOWNLOAD',
            `Incomplete download: ${url.href}`,
            { cause: error, details: { url: url.href } },
          ),
        );
        return;
      }
      fail(error);
    });
    request.setTimeout(timeoutMs, () => {
      const error = createUpdaterError(
        'NETWORK_TIMEOUT',
        `Request timed out: ${url.href}`,
        { details: { timeoutMs, url: url.href } },
      );
      fail(error);
      request.destroy();
    });
  });
}

async function readLocalFile(
  nodeRequire: NodeRequire,
  url: URL,
  options: Pick<FetchOptions, 'onData' | 'maxBytes' | 'signal'>,
): Promise<Buffer> {
  throwIfAborted(options.signal);
  const filePath = nodeRequire('url').fileURLToPath(url.href);
  const fsPromises = nodeRequire('fs').promises;
  if (options.maxBytes !== undefined) {
    const stat = await fsPromises.stat(filePath);
    if (stat.size > options.maxBytes) {
      throw createUpdaterError(
        'RESPONSE_TOO_LARGE',
        `Response exceeds maximum allowed size (${options.maxBytes} bytes): ${url.href}`,
        {
          details: {
            maxBytes: options.maxBytes,
            size: stat.size,
            url: url.href,
          },
        },
      );
    }
  }
  const buffer = await fsPromises.readFile(filePath);
  throwIfAborted(options.signal);
  if (options.maxBytes !== undefined && buffer.length > options.maxBytes) {
    throw createUpdaterError(
      'RESPONSE_TOO_LARGE',
      `Response exceeds maximum allowed size (${options.maxBytes} bytes): ${url.href}`,
      {
        details: {
          maxBytes: options.maxBytes,
          size: buffer.length,
          url: url.href,
        },
      },
    );
  }
  options.onData?.(buffer.length, buffer.length);
  return buffer;
}

/**
 * Reads a `file:`, `http:`, or `https:` URL, following HTTP redirects.
 * Prevents HTTP(S) responses from redirecting to `file:` or other non-HTTP schemes.
 */
export async function fetchBuffer(
  nodeRequire: NodeRequire,
  targetUrl: string,
  optionsOrCallback?: DownloadCallback | FetchOptions,
): Promise<FetchResult> {
  const options = normalizeFetchOptions(optionsOrCallback);
  const maxRedirects = options.maxRedirects ?? DEFAULT_MAX_REDIRECTS;
  const redirectChain: string[] = [];
  let url = new URL(targetUrl);

  for (;;) {
    throwIfAborted(options.signal);
    redirectChain.push(url.href);
    if (redirectChain.length > maxRedirects + 1) {
      throw createUpdaterError(
        'TOO_MANY_REDIRECTS',
        `Too many redirects: ${url.href}`,
        { details: { maxRedirects, redirectChain } },
      );
    }

    if (url.protocol === 'file:') {
      if (redirectChain.length > 1) {
        throw createUpdaterError(
          'UNSAFE_REDIRECT',
          `Refusing redirect to local file URL: ${url.href}`,
          { details: { redirectChain } },
        );
      }
      const buffer = await readLocalFile(nodeRequire, url, options);
      return { buffer, finalUrl: url.href, redirectChain };
    }

    if (!isHttpProtocol(url.protocol)) {
      throw createUpdaterError(
        'UNSAFE_PROTOCOL',
        `Unsupported protocol "${url.protocol}": ${url.href}`,
        { details: { protocol: url.protocol, url: url.href } },
      );
    }

    const { location, buffer } = await httpGet(nodeRequire, url, options);
    if (!location) {
      return { buffer: buffer!, finalUrl: url.href, redirectChain };
    }

    const nextUrl = new URL(location, url);
    if (!isHttpProtocol(nextUrl.protocol)) {
      throw createUpdaterError(
        'UNSAFE_REDIRECT',
        `Refusing redirect to unsupported protocol "${nextUrl.protocol}": ${nextUrl.href}`,
        { details: { from: url.href, to: nextUrl.href } },
      );
    }
    url = nextUrl;
  }
}
