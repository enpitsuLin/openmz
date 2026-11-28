/*:
 * @target MZ
 * @plugindesc Check for OpenMZ updates and install the prototype runtime.
 * @author OpenMZ
 *
 * @param manifestUrl
 * @text Manifest URL
 * @desc URL of an OpenMZ schemaVersion 1 release manifest.
 * @type string
 * @default
 *
 * @help OpenMzUpdater.js
 *
 * Install OpenMzUpdater.js in your project's js/plugins/ directory.
 * In NW.js, checks the configured manifest when the title scene first opens.
 * Prompts only when a newer version is available. Installation verifies the
 * archive, backs up replaced files, and rolls back on failure.
 * Installed version metadata is stored in js/openmz.json. The updater remains
 * enabled and never rewrites js/plugins.js. Restart to use an installed update.
 */
/*:zh
 * @target MZ
 * @plugindesc 检查 OpenMZ 更新并安装原型式引擎和 PixiJS 8。
 * @author OpenMZ
 *
 * @param manifestUrl
 * @text 更新清单地址
 * @desc OpenMZ schemaVersion 1 发布清单的 URL。
 * @type string
 * @default
 *
 * @help OpenMzUpdater.js
 *
 * 将 OpenMzUpdater.js 放入工程的 js/plugins/ 并启用。
 * 在 NW.js 中首次进入标题画面时检查更新，有新版本时显示版本并询问安装。
 * 安装前校验压缩包，备份被替换的文件；安装失败则回滚。
 * js/openmz.json 保存已安装版本。插件保持启用，不修改 js/plugins.js。
 * 安装完成后重启游戏生效。留空更新清单地址时不检查更新。
 */
(function () {
  // src/ui/env.ts
  function resolvePluginName(scriptSrc) {
    if (!scriptSrc) return 'OpenMzUpdater';
    const filename = scriptSrc.split('/').pop();
    if (!filename) return 'OpenMzUpdater';
    return decodeURIComponent(filename.replace(/\.js$/i, '')) || 'OpenMzUpdater';
  }
  function getCurrentScriptSrc() {
    if (typeof document === 'undefined') return '';
    return document.currentScript?.src || '';
  }
  function resolveProjectRoot(nodeRequire) {
    const path = nodeRequire('path');
    if (typeof window !== 'undefined' && window.location?.protocol === 'file:' && window.location.href)
      return path.dirname(nodeRequire('url').fileURLToPath(window.location.href));
    if (typeof process !== 'undefined') {
      if (process.mainModule?.filename) return path.dirname(process.mainModule.filename);
      return process.cwd();
    }
    return '.';
  }
  function reloadApplication() {
    const app = typeof nw === 'object' && nw.Window ? nw.Window.get() : null;
    if (app?.reloadIgnoringCache) app.reloadIgnoringCache();
    else if (typeof window !== 'undefined' && window.location?.reload) window.location.reload();
  }
  function waitForNextPaintedFrame() {
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  }
  /**
   * Detects whether the plugin is running inside an RPG Maker MZ NW.js environment
   * with a non-empty `manifestUrl` parameter. Returns `null` when inert.
   */
  function detectUpdaterEnvironment() {
    if (
      typeof PluginManager === 'undefined' ||
      typeof Scene_Title === 'undefined' ||
      typeof Window_Base === 'undefined' ||
      typeof Window_HorzCommand === 'undefined' ||
      typeof Utils === 'undefined'
    )
      return null;
    const pluginName = resolvePluginName(getCurrentScriptSrc());
    const manifestUrl = String(PluginManager.parameters(pluginName).manifestUrl || '').trim();
    const nodeRequire = typeof require === 'function' ? require : null;
    if (!manifestUrl || !nodeRequire || !Utils.isNwjs()) return null;
    return {
      manifestUrl,
      nodeRequire,
      getProjectRoot: () => resolveProjectRoot(nodeRequire),
      getLocale: () =>
        (typeof $dataSystem !== 'undefined' && $dataSystem?.locale) ||
        (typeof navigator !== 'undefined' && navigator.language) ||
        'en',
      reloadApp: reloadApplication,
      waitForRender: waitForNextPaintedFrame,
    };
  }
  const statePath = 'js/openmz.json';
  const coreScripts = [
    'main.js',
    'rmmz_core.js',
    'rmmz_managers.js',
    'rmmz_objects.js',
    'rmmz_scenes.js',
    'rmmz_sprites.js',
    'rmmz_windows.js',
  ];
  const versionPattern =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-z-][\da-z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-z-][\da-z-]*))*))?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?$/i;
  function isVersion(value) {
    return typeof value === 'string' && versionPattern.test(value);
  }
  function compareVersions(left, right) {
    const a = versionPattern.exec(left);
    const b = versionPattern.exec(right);
    if (!a || !b) throw new Error('Invalid semantic version.');
    for (let i = 1; i <= 3; i++) if (Number(a[i]) !== Number(b[i])) return Number(a[i]) > Number(b[i]) ? 1 : -1;
    if (a[4] === b[4]) return 0;
    if (!a[4] || !b[4]) return a[4] ? -1 : 1;
    const ap = a[4].split('.');
    const bp = b[4].split('.');
    for (let i = 0; i < Math.max(ap.length, bp.length); i++) {
      if (ap[i] === bp[i]) continue;
      if (ap[i] === void 0 || bp[i] === void 0) return ap[i] === void 0 ? -1 : 1;
      const an = /^\d+$/.test(ap[i]);
      if (an !== /^\d+$/.test(bp[i])) return an ? -1 : 1;
      return (an ? Number(ap[i]) > Number(bp[i]) : ap[i] > bp[i]) ? 1 : -1;
    }
    return 0;
  }
  // src/errors.ts
  /**
   * Creates a structured updater error without subclassing native `Error`,
   * ensuring consistent behavior after prototype-based class transformation.
   */
  function createUpdaterError(code, message, options) {
    const error = new Error(message, options?.cause !== void 0 ? { cause: options.cause } : void 0);
    error.name = 'UpdaterError';
    Object.defineProperty(error, 'code', {
      value: code,
      enumerable: true,
    });
    if (options?.details)
      Object.defineProperty(error, 'details', {
        value: options.details,
        enumerable: true,
      });
    return error;
  }
  function isUpdaterError(value) {
    return value instanceof Error && value.name === 'UpdaterError' && typeof value.code === 'string';
  }
  function formatErrorMessage(error) {
    if (error instanceof Error && error.message) return error.message;
    return String(error);
  }
  // src/installer.ts
  function isErrno(error, code) {
    return error?.code === code;
  }
  /** Returns lstat of a regular file, `undefined` if missing, or throws for non-regular entries. */
  function inspectTargetFile(fs, filePath) {
    let stat;
    try {
      stat = fs.lstatSync(filePath);
    } catch (error) {
      if (isErrno(error, 'ENOENT')) return void 0;
      throw error;
    }
    if (!stat.isFile()) throw createUpdaterError('UNSAFE_TARGET_PATH', `Unexpected filesystem entry: ${filePath}`);
    return stat;
  }
  /** Verifies every existing intermediate directory is a real directory (not a symlink or file). */
  function inspectIntermediateDirectories(fs, path, root, segments, checkedDirs) {
    let current = root;
    for (let index = 0; index < segments.length - 1; index++) {
      current = path.join(current, segments[index]);
      if (checkedDirs.has(current)) continue;
      try {
        if (!fs.lstatSync(current).isDirectory())
          throw createUpdaterError('UNSAFE_TARGET_PATH', `Unexpected filesystem entry: ${current}`);
        checkedDirs.add(current);
      } catch (error) {
        if (isErrno(error, 'ENOENT')) return;
        throw error;
      }
    }
  }
  function removeDirectory(fs, directory) {
    if (fs.rmSync)
      fs.rmSync(directory, {
        recursive: true,
        force: true,
      });
    else fs.rmdirSync(directory, { recursive: true });
  }
  function formatBackupTimestamp(date = /* @__PURE__ */ new Date()) {
    const pad = (value) => String(value).padStart(2, '0');
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
  }
  function createBackupDir(fs, path, root) {
    const base = path.join(root, 'js_backup', formatBackupTimestamp());
    fs.mkdirSync(path.dirname(base), { recursive: true });
    for (let suffix = 0; ; suffix++) {
      const candidate = suffix ? `${base}-${suffix}` : base;
      try {
        fs.mkdirSync(candidate);
        return candidate;
      } catch (error) {
        if (!isErrno(error, 'EEXIST')) throw error;
      }
    }
  }
  /**
   * Preflights every target path before mutating the project directory.
   * Rejects symlinked directories or non-regular target files.
   */
  function planUpgrade(fs, path, projectRoot, entries) {
    const root = fs.realpathSync(projectRoot);
    const checkedDirs = /* @__PURE__ */ new Set();
    return {
      root,
      files: entries.map(({ relativePath, content }) => {
        const segments = relativePath.split('/');
        inspectIntermediateDirectories(fs, path, root, segments, checkedDirs);
        const targetPath = path.join(root, ...segments);
        return {
          relativePath,
          content,
          targetPath,
          stat: inspectTargetFile(fs, targetPath),
        };
      }),
    };
  }
  /**
   * Applies an upgrade plan transactionally:
   * 1. Backs up all existing target files into a timestamped `js_backup/` directory.
   * 2. Writes each file to a staged temporary path, preserves original mode, and atomically renames.
   * 3. On any failure, restores backed-up files, removes newly added files and created directories.
   */
  function applyUpgradePlan(fs, path, plan) {
    const { root, files } = plan;
    const backupDir = createBackupDir(fs, path, root);
    const stagedPath = path.join(backupDir, '.openmz-update');
    const backupPathOf = (file) => path.join(backupDir, file.relativePath);
    const createdDirs = [];
    const applied = [];
    try {
      for (const file of files) {
        if (!file.stat) continue;
        const destination = backupPathOf(file);
        fs.mkdirSync(path.dirname(destination), { recursive: true });
        fs.copyFileSync(file.targetPath, destination);
      }
      for (const file of files) {
        const createdDir = fs.mkdirSync(path.dirname(file.targetPath), { recursive: true });
        if (createdDir) createdDirs.push(createdDir);
        fs.writeFileSync(stagedPath, file.content);
        if (file.stat) fs.chmodSync(stagedPath, file.stat.mode & 511);
        fs.renameSync(stagedPath, file.targetPath);
        applied.push(file);
      }
    } catch (error) {
      rollbackUpgrade(fs, backupDir, stagedPath, backupPathOf, applied, createdDirs, error);
    }
    return backupDir;
  }
  function rollbackUpgrade(fs, backupDir, stagedPath, backupPathOf, applied, createdDirs, originalError) {
    const rollbackErrors = [];
    const attempt = (operation) => {
      try {
        operation();
      } catch (rollbackError) {
        rollbackErrors.push(formatErrorMessage(rollbackError));
      }
    };
    for (let index = applied.length - 1; index >= 0; index--) {
      const file = applied[index];
      attempt(() => {
        if (file.stat) fs.copyFileSync(backupPathOf(file), file.targetPath);
        else fs.unlinkSync(file.targetPath);
      });
    }
    attempt(() => {
      if (fs.existsSync(stagedPath)) fs.unlinkSync(stagedPath);
    });
    for (let index = createdDirs.length - 1; index >= 0; index--) {
      const directory = createdDirs[index];
      attempt(() => removeDirectory(fs, directory));
    }
    if (rollbackErrors.length)
      throw createUpdaterError(
        'ROLLBACK_INCOMPLETE',
        `${formatErrorMessage(originalError)} Rollback incomplete. Backup: ${backupDir}. ${rollbackErrors.join(' | ')}`,
        {
          cause: originalError,
          details: {
            backupDir,
            rollbackErrors,
          },
        },
      );
    throw originalError;
  }
  // src/manifest.ts
  const SHA256_PATTERN = /^[\da-f]{64}$/i;
  const ALLOWED_ARCHIVE_PROTOCOLS = /* @__PURE__ */ new Set(['http:', 'https:', 'file:']);
  function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
  /**
   * Resolves relative asset URLs against the last URL on the original origin
   * (e.g. a GitHub release tag URL rather than a signed CDN location).
   */
  function resolveAssetBaseUrl(redirectChain) {
    const original = new URL(redirectChain[0]);
    for (let index = redirectChain.length - 1; index >= 0; index--) {
      const candidate = new URL(redirectChain[index]);
      if (candidate.protocol === original.protocol && candidate.origin === original.origin) return candidate;
    }
    return original;
  }
  function parseManifest({ buffer, redirectChain }) {
    let raw;
    try {
      raw = JSON.parse(buffer.toString('utf8'));
    } catch (cause) {
      throw createUpdaterError('INVALID_MANIFEST', 'Release manifest is not valid JSON.', { cause });
    }
    if (!isRecord(raw) || raw.schemaVersion !== 1)
      throw createUpdaterError('INVALID_MANIFEST', `Expected a schemaVersion 1 manifest.`);
    const { name, version, format, pixiVersion, archive } = raw;
    if (name !== 'OpenMZ' || !isVersion(version) || !isVersion(pixiVersion) || format !== 'prototype')
      throw createUpdaterError(
        'INVALID_MANIFEST',
        'Manifest must describe an OpenMZ prototype runtime and its PixiJS version.',
      );
    if (!isRecord(archive) || typeof archive.url !== 'string' || !archive.url.trim())
      throw createUpdaterError('INVALID_MANIFEST', 'Manifest requires an archive URL.');
    const { size, sha256 } = archive;
    if (!Number.isSafeInteger(size) || size <= 0)
      throw createUpdaterError('INVALID_MANIFEST', 'Invalid archive size in manifest.');
    if (typeof sha256 !== 'string' || !SHA256_PATTERN.test(sha256))
      throw createUpdaterError('INVALID_MANIFEST', 'Invalid archive SHA-256 in manifest.');
    const baseUrl = resolveAssetBaseUrl(redirectChain);
    let resolvedUrl;
    try {
      resolvedUrl = new URL(archive.url.trim(), baseUrl);
    } catch (cause) {
      throw createUpdaterError('INVALID_MANIFEST', `Invalid archive URL in manifest: ${archive.url}`, { cause });
    }
    if (!ALLOWED_ARCHIVE_PROTOCOLS.has(resolvedUrl.protocol))
      throw createUpdaterError('UNSAFE_PROTOCOL', `Unsupported archive protocol: ${resolvedUrl.protocol}`);
    if (baseUrl.protocol !== 'file:' && resolvedUrl.protocol === 'file:')
      throw createUpdaterError(
        'UNSAFE_PROTOCOL',
        `Refusing local file archive URL from remote manifest: ${resolvedUrl.href}`,
      );
    return {
      name,
      version,
      format,
      pixiVersion,
      archive: {
        url: resolvedUrl.href,
        size,
        sha256: sha256.toLowerCase(),
      },
    };
  }
  // src/tar.ts
  const TAR_BLOCK_SIZE = 512;
  const NAME_START = 0;
  const NAME_END = 100;
  const SIZE_START = 124;
  const SIZE_END = 136;
  const CHECKSUM_START = 148;
  const CHECKSUM_END = 156;
  const TYPE_OFFSET = 156;
  const MAGIC_START = 257;
  const MAGIC_END = 263;
  const PREFIX_START = 345;
  const PREFIX_END = 500;
  const CHECKSUM_SPACE = 32;
  const REGULAR_FILE_DEFAULT_CHAR_CODE = 48;
  function readText(field) {
    return field.toString('utf8').split('\0', 1)[0];
  }
  function readOctal(field) {
    const value = field.toString('ascii').replace(/\0.*$/, '').trim();
    if (!/^[0-7]+$/.test(value)) throw createUpdaterError('INVALID_ARCHIVE', 'Invalid tar header number.');
    return parseInt(value, 8);
  }
  function isZeroBlock(block) {
    for (let index = 0; index < block.length; index++) if (block[index] !== 0) return false;
    return true;
  }
  function computeHeaderChecksum(header) {
    let sum = 0;
    for (let index = 0; index < header.length; index++)
      sum += index >= CHECKSUM_START && index < CHECKSUM_END ? CHECKSUM_SPACE : header[index];
    return sum;
  }
  /**
   * Decodes a POSIX USTAR / GNU tar archive buffer into regular file entries.
   * Supports GNU `@LongLink` extended names and skips PAX metadata headers.
   */
  function parseTarBuffer(buffer) {
    const entries = [];
    let longPath;
    let offset = 0;
    while (offset + 2 * TAR_BLOCK_SIZE <= buffer.length) {
      const header = buffer.subarray(offset, offset + TAR_BLOCK_SIZE);
      offset += TAR_BLOCK_SIZE;
      if (isZeroBlock(header)) {
        const trailing = buffer.subarray(offset, offset + TAR_BLOCK_SIZE);
        if (longPath !== void 0 || !isZeroBlock(trailing))
          throw createUpdaterError('INVALID_ARCHIVE', 'Invalid tar end marker.');
        return entries;
      }
      const expectedChecksum = readOctal(header.subarray(CHECKSUM_START, CHECKSUM_END));
      if (computeHeaderChecksum(header) !== expectedChecksum)
        throw createUpdaterError('INVALID_ARCHIVE', 'Invalid tar header checksum.');
      const size = readOctal(header.subarray(SIZE_START, SIZE_END));
      const paddedSize = Math.ceil(size / TAR_BLOCK_SIZE) * TAR_BLOCK_SIZE;
      if (offset + paddedSize > buffer.length) throw createUpdaterError('INVALID_ARCHIVE', 'Truncated tar entry.');
      const content = buffer.subarray(offset, offset + size);
      offset += paddedSize;
      const type = String.fromCharCode(header[TYPE_OFFSET] || REGULAR_FILE_DEFAULT_CHAR_CODE);
      const name = readText(header.subarray(NAME_START, NAME_END));
      if (type === 'L' && (name === '././@LongLink' || name === '@LongLink')) {
        longPath = readText(content);
        continue;
      }
      if (type === 'x' || type === 'g') continue;
      if (type === '0') {
        const prefix =
          readText(header.subarray(MAGIC_START, MAGIC_END)) === 'ustar'
            ? readText(header.subarray(PREFIX_START, PREFIX_END))
            : '';
        const relativePath = longPath ?? (prefix ? `${prefix}/${name}` : name);
        entries.push({
          relativePath,
          content,
        });
      } else if (type !== '5') throw createUpdaterError('INVALID_ARCHIVE', `Unsupported tar entry type for ${name}.`);
      longPath = void 0;
    }
    throw createUpdaterError('INVALID_ARCHIVE', 'Missing tar end marker.');
  }
  // src/package-validator.ts
  const PROTECTED_PATH_PATTERN = /^js\/plugins(?:\.js)?(?:\/|$)/i;
  const UNSAFE_SEGMENT_CHAR_PATTERN = /[\\:\0]/;
  const TRAILING_DOT_OR_SPACE_PATTERN = /[. ]$/;
  const REQUIRED_RUNTIME_FILES = [...coreScripts.map((name) => `js/${name}`), 'js/libs/pixi.js', statePath];
  function verifyArchiveIntegrity(nodeRequire, buffer, archive) {
    if (buffer.length !== archive.size)
      throw createUpdaterError(
        'ARCHIVE_SIZE_MISMATCH',
        `Archive size mismatch: expected ${archive.size}, got ${buffer.length}.`,
        {
          details: {
            expected: archive.size,
            actual: buffer.length,
          },
        },
      );
    if (nodeRequire('crypto').createHash('sha256').update(buffer).digest('hex') !== archive.sha256.toLowerCase())
      throw createUpdaterError('ARCHIVE_CHECKSUM_MISMATCH', 'Archive SHA-256 mismatch.');
  }
  /**
   * Rejects archives that would write outside `js/`, touch plugin setup,
   * contain case-insensitive duplicate paths, or have file/directory collisions.
   */
  function validateArchiveEntries(entries) {
    if (!entries.length) throw createUpdaterError('INVALID_ARCHIVE', 'Archive contains no core files.');
    const seen = /* @__PURE__ */ new Set();
    for (const { relativePath } of entries) {
      const hasUnsafeSegment = relativePath
        .split('/')
        .some(
          (segment) =>
            !segment || UNSAFE_SEGMENT_CHAR_PATTERN.test(segment) || TRAILING_DOT_OR_SPACE_PATTERN.test(segment),
        );
      if (!relativePath.startsWith('js/') || hasUnsafeSegment)
        throw createUpdaterError('UNSAFE_ARCHIVE_PATH', `Unsafe target script path: ${relativePath}`);
      if (PROTECTED_PATH_PATTERN.test(relativePath))
        throw createUpdaterError('PROTECTED_PATH', `Refusing to overwrite protected path: ${relativePath}`);
      const key = relativePath.toLowerCase();
      if (seen.has(key)) throw createUpdaterError('DUPLICATE_ARCHIVE_PATH', `Duplicate archive path: ${relativePath}`);
      seen.add(key);
    }
    for (const key of seen) {
      const segments = key.split('/');
      for (let depth = 2; depth < segments.length; depth++) {
        const directory = segments.slice(0, depth).join('/');
        if (seen.has(directory))
          throw createUpdaterError('INVALID_ARCHIVE', `Archive path is both a file and a directory: ${directory}`);
      }
    }
  }
  function parseRuntimeMetadataEntry(entry) {
    let raw;
    try {
      raw = JSON.parse(entry.content.toString('utf8'));
    } catch (cause) {
      throw createUpdaterError('METADATA_MISMATCH', 'Runtime metadata in archive is not valid JSON.', { cause });
    }
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw))
      throw createUpdaterError('METADATA_MISMATCH', 'Runtime metadata in archive is invalid.');
    return raw;
  }
  function unpackAndValidatePackage(nodeRequire, compressedArchive, manifest) {
    verifyArchiveIntegrity(nodeRequire, compressedArchive, manifest.archive);
    let tarBuffer;
    try {
      tarBuffer = nodeRequire('zlib').gunzipSync(compressedArchive);
    } catch (cause) {
      throw createUpdaterError('INVALID_ARCHIVE', 'Failed to decompress runtime archive.', { cause });
    }
    const entries = parseTarBuffer(tarBuffer);
    validateArchiveEntries(entries);
    const entryByPath = new Map(entries.map((entry) => [entry.relativePath, entry]));
    for (const requiredPath of REQUIRED_RUNTIME_FILES)
      if (!entryByPath.has(requiredPath))
        throw createUpdaterError('MISSING_RUNTIME_FILE', `Missing runtime file: ${requiredPath}`);
    const metadata = parseRuntimeMetadataEntry(entryByPath.get(statePath));
    if (
      metadata.name !== manifest.name ||
      metadata.version !== manifest.version ||
      metadata.pixiVersion !== manifest.pixiVersion ||
      metadata.format !== manifest.format
    )
      throw createUpdaterError('METADATA_MISMATCH', 'Runtime metadata does not match the manifest.');
    return {
      entries,
      metadata,
    };
  }
  const DEFAULT_REQUEST_TIMEOUT_MS = 3e4;
  const HTTP_PROTOCOLS = /* @__PURE__ */ new Set(['http:', 'https:']);
  function isHttpProtocol(protocol) {
    return HTTP_PROTOCOLS.has(protocol);
  }
  function throwIfAborted(signal) {
    if (signal?.aborted) throw createUpdaterError('ABORTED', 'Request aborted.', { cause: signal.reason });
  }
  function normalizeFetchOptions(optionsOrCallback) {
    if (typeof optionsOrCallback === 'function') return { onData: optionsOrCallback };
    return optionsOrCallback ?? {};
  }
  /**
   * Single HTTP(S) GET. Resolves `{ location }` for redirects, `{ buffer }` otherwise.
   * Enforces idle timeout, optional byte limit, abort signal, and complete stream checks.
   */
  function httpGet(nodeRequire, url, options) {
    const { onData, maxBytes, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS, signal } = options;
    return new Promise((resolve, reject) => {
      throwIfAborted(signal);
      const { Buffer: NodeBuffer } = nodeRequire('buffer');
      const transport = nodeRequire(url.protocol.slice(0, -1));
      let settled = false;
      const cleanup = () => {
        signal?.removeEventListener('abort', onAbort);
      };
      const succeed = (result) => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve(result);
      };
      const fail = (error) => {
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
              createUpdaterError('INCOMPLETE_DOWNLOAD', `Incomplete download: ${url.href}`, {
                cause: error,
                details: {
                  url: url.href,
                  received,
                  contentLength,
                },
              }),
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
                details: {
                  status,
                  url: url.href,
                },
              }),
            );
            return;
          }
          if (maxBytes !== void 0 && contentLength > maxBytes) {
            const error = createUpdaterError(
              'RESPONSE_TOO_LARGE',
              `Response exceeds maximum allowed size (${maxBytes} bytes): ${url.href}`,
              {
                details: {
                  maxBytes,
                  contentLength,
                  url: url.href,
                },
              },
            );
            fail(error);
            request.destroy();
            return;
          }
          const chunks = [];
          response.on('data', (chunk) => {
            if (settled) return;
            received += chunk.length;
            if (maxBytes !== void 0 && received > maxBytes) {
              const error = createUpdaterError(
                'RESPONSE_TOO_LARGE',
                `Response exceeds maximum allowed size (${maxBytes} bytes): ${url.href}`,
                {
                  details: {
                    maxBytes,
                    received,
                    url: url.href,
                  },
                },
              );
              fail(error);
              request.destroy();
              return;
            }
            chunks.push(chunk);
            onData?.(received, contentLength);
          });
          response.on('end', () => {
            if (response.complete) succeed({ buffer: NodeBuffer.concat(chunks) });
            else
              fail(
                createUpdaterError('INCOMPLETE_DOWNLOAD', `Incomplete download: ${url.href}`, {
                  details: {
                    url: url.href,
                    received,
                    contentLength,
                  },
                }),
              );
          });
          response.on('close', () => {
            if (!settled && !response.complete)
              fail(
                createUpdaterError('INCOMPLETE_DOWNLOAD', `Incomplete download: ${url.href}`, {
                  details: {
                    url: url.href,
                    received,
                    contentLength,
                  },
                }),
              );
          });
        },
      );
      const onAbort = () => {
        const error = createUpdaterError('ABORTED', `Request aborted: ${url.href}`, { cause: signal?.reason });
        fail(error);
        request.destroy();
      };
      signal?.addEventListener('abort', onAbort, { once: true });
      request.on('error', (error) => {
        if (error.code === 'ECONNRESET') {
          fail(
            createUpdaterError('INCOMPLETE_DOWNLOAD', `Incomplete download: ${url.href}`, {
              cause: error,
              details: { url: url.href },
            }),
          );
          return;
        }
        fail(error);
      });
      request.setTimeout(timeoutMs, () => {
        const error = createUpdaterError('NETWORK_TIMEOUT', `Request timed out: ${url.href}`, {
          details: {
            timeoutMs,
            url: url.href,
          },
        });
        fail(error);
        request.destroy();
      });
    });
  }
  async function readLocalFile(nodeRequire, url, options) {
    throwIfAborted(options.signal);
    const filePath = nodeRequire('url').fileURLToPath(url.href);
    const fsPromises = nodeRequire('fs').promises;
    if (options.maxBytes !== void 0) {
      const stat = await fsPromises.stat(filePath);
      if (stat.size > options.maxBytes)
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
    const buffer = await fsPromises.readFile(filePath);
    throwIfAborted(options.signal);
    if (options.maxBytes !== void 0 && buffer.length > options.maxBytes)
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
    options.onData?.(buffer.length, buffer.length);
    return buffer;
  }
  /**
   * Reads a `file:`, `http:`, or `https:` URL, following HTTP redirects.
   * Prevents HTTP(S) responses from redirecting to `file:` or other non-HTTP schemes.
   */
  async function fetchBuffer(nodeRequire, targetUrl, optionsOrCallback) {
    const options = normalizeFetchOptions(optionsOrCallback);
    const maxRedirects = options.maxRedirects ?? 10;
    const redirectChain = [];
    let url = new URL(targetUrl);
    for (;;) {
      throwIfAborted(options.signal);
      redirectChain.push(url.href);
      if (redirectChain.length > maxRedirects + 1)
        throw createUpdaterError('TOO_MANY_REDIRECTS', `Too many redirects: ${url.href}`, {
          details: {
            maxRedirects,
            redirectChain,
          },
        });
      if (url.protocol === 'file:') {
        if (redirectChain.length > 1)
          throw createUpdaterError('UNSAFE_REDIRECT', `Refusing redirect to local file URL: ${url.href}`, {
            details: { redirectChain },
          });
        return {
          buffer: await readLocalFile(nodeRequire, url, options),
          finalUrl: url.href,
          redirectChain,
        };
      }
      if (!isHttpProtocol(url.protocol))
        throw createUpdaterError('UNSAFE_PROTOCOL', `Unsupported protocol "${url.protocol}": ${url.href}`, {
          details: {
            protocol: url.protocol,
            url: url.href,
          },
        });
      const { location, buffer } = await httpGet(nodeRequire, url, options);
      if (!location)
        return {
          buffer,
          finalUrl: url.href,
          redirectChain,
        };
      const nextUrl = new URL(location, url);
      if (!isHttpProtocol(nextUrl.protocol))
        throw createUpdaterError(
          'UNSAFE_REDIRECT',
          `Refusing redirect to unsupported protocol "${nextUrl.protocol}": ${nextUrl.href}`,
          {
            details: {
              from: url.href,
              to: nextUrl.href,
            },
          },
        );
      url = nextUrl;
    }
  }
  // src/core.ts
  const MAX_MANIFEST_BYTES = 1048576;
  const MAX_ARCHIVE_BYTES = 268435456;
  function resolveArchiveFilename(archiveUrl) {
    return new URL(archiveUrl).pathname.split('/').pop() || 'openmz-runtime.tar.gz';
  }
  function readInstalledVersion({ projectRoot, nodeRequire }) {
    const fs = nodeRequire('fs');
    const path = nodeRequire('path');
    let rawText;
    try {
      rawText = fs.readFileSync(path.join(projectRoot, statePath), 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') return null;
      throw error;
    }
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (cause) {
      throw createUpdaterError('INVALID_INSTALLED_METADATA', 'Invalid installed OpenMZ version metadata.', { cause });
    }
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed))
      throw createUpdaterError('INVALID_INSTALLED_METADATA', 'Invalid installed OpenMZ version metadata.');
    const metadata = parsed;
    if (metadata.name !== 'OpenMZ' || !isVersion(metadata.version) || metadata.format !== 'prototype')
      throw createUpdaterError('INVALID_INSTALLED_METADATA', 'Invalid installed OpenMZ version metadata.');
    return metadata;
  }
  async function checkForUpdate({ manifestUrl, projectRoot, nodeRequire, signal }) {
    const installed = readInstalledVersion({
      projectRoot,
      nodeRequire,
    });
    const manifest = parseManifest(
      await fetchBuffer(nodeRequire, manifestUrl, {
        maxBytes: MAX_MANIFEST_BYTES,
        signal,
      }),
    );
    return {
      installed,
      manifest,
      available: !installed || compareVersions(manifest.version, installed.version) > 0,
    };
  }
  async function installUpdate({
    update,
    projectRoot,
    nodeRequire,
    onProgress = () => {},
    onDownload = () => {},
    signal,
  }) {
    const { manifest } = update;
    const { archive } = manifest;
    const fs = nodeRequire('fs');
    const path = nodeRequire('path');
    const file = resolveArchiveFilename(archive.url);
    await onProgress({
      phase: 'download',
      file,
      loaded: 0,
      total: archive.size,
    });
    if (archive.size > MAX_ARCHIVE_BYTES)
      throw createUpdaterError(
        'RESPONSE_TOO_LARGE',
        `Archive size (${archive.size} bytes) exceeds maximum supported size (${MAX_ARCHIVE_BYTES} bytes).`,
        {
          details: {
            size: archive.size,
            maxBytes: MAX_ARCHIVE_BYTES,
          },
        },
      );
    let buffer;
    try {
      ({ buffer } = await fetchBuffer(nodeRequire, archive.url, {
        maxBytes: archive.size,
        signal,
        onData: (loaded, total) =>
          onDownload({
            phase: 'download',
            file,
            loaded,
            total: total || archive.size,
          }),
      }));
    } catch (error) {
      if (isUpdaterError(error) && error.code === 'RESPONSE_TOO_LARGE')
        throw createUpdaterError(
          'ARCHIVE_SIZE_MISMATCH',
          `Archive size mismatch: expected ${archive.size} bytes, response exceeded expected size.`,
          {
            cause: error,
            details: { expected: archive.size },
          },
        );
      throw error;
    }
    await onProgress({ phase: 'verify' });
    const { entries, metadata } = unpackAndValidatePackage(nodeRequire, buffer, manifest);
    await onProgress({
      phase: 'apply',
      total: entries.length,
    });
    const plan = planUpgrade(fs, path, projectRoot, entries);
    const backupDir = applyUpgradePlan(fs, path, plan);
    return {
      ...metadata,
      updatedFiles: entries.map((entry) => entry.relativePath),
      backupRelativeDir: path.relative(plan.root, backupDir).replace(/\\/g, '/'),
      requiresRestart: true,
    };
  }
  // src/ui/i18n.ts
  const UPDATER_TEXTS = {
    zh: {
      title: '更新 OpenMZ',
      version: (current, target) => `${current || 'RPG Maker MZ'} → OpenMZ ${target}`,
      backup: '原文件将备份到 js_backup/。',
      check: '正在检查更新',
      current: '当前已是最新版',
      download: (loaded, total) => `下载更新包：${Math.floor(loaded / 1024)} / ${Math.ceil(total / 1024)} KB`,
      verify: '校验并解压更新包',
      apply: '备份并安装更新',
      done: '更新完成',
      installed: (version) => `已安装 OpenMZ ${version}，重启后生效。`,
      saved: (path) => `备份：${path}`,
      error: '更新失败',
      update: '更新',
      skip: '继续游戏',
      reload: '立即重启',
      retry: '重试',
      later: '稍后重启',
    },
    en: {
      title: 'Update OpenMZ',
      version: (current, target) => `${current || 'RPG Maker MZ'} → OpenMZ ${target}`,
      backup: 'Original files will be saved in js_backup/.',
      check: 'Checking for updates',
      current: 'Already up to date',
      download: (loaded, total) => `Downloading: ${Math.floor(loaded / 1024)} / ${Math.ceil(total / 1024)} KB`,
      verify: 'Verifying and extracting',
      apply: 'Backing up and installing',
      done: 'Update installed',
      installed: (version) => `OpenMZ ${version} will be used after restarting.`,
      saved: (path) => `Backup: ${path}`,
      error: 'Update failed',
      update: 'Update',
      skip: 'Continue',
      reload: 'Restart now',
      retry: 'Retry',
      later: 'Restart later',
    },
  };
  function resolveUpdaterLocale(locale) {
    return String(locale || '')
      .toLowerCase()
      .startsWith('zh')
      ? 'zh'
      : 'en';
  }
  function getUpdaterTexts(locale) {
    return UPDATER_TEXTS[resolveUpdaterLocale(locale)];
  }
  // src/ui/presenter.ts
  const DOWNLOAD_PROGRESS_WEIGHT = 0.8;
  const VERIFY_PROGRESS = 0.8;
  const APPLY_PROGRESS = 0.9;
  function formatProgressSnapshot(event, texts) {
    if (event.phase === 'download') {
      const progress = (event.total > 0 ? Math.min(event.loaded / event.total, 1) : 0) * DOWNLOAD_PROGRESS_WEIGHT;
      const text = texts.download(event.loaded, event.total);
      return {
        text,
        progress,
        key: `${text}:${Math.floor(progress * 100)}`,
      };
    }
    if (event.phase === 'verify')
      return {
        text: texts.verify,
        progress: VERIFY_PROGRESS,
        key: `${texts.verify}:${Math.floor(VERIFY_PROGRESS * 100)}`,
      };
    return {
      text: texts.apply,
      progress: APPLY_PROGRESS,
      key: `${texts.apply}:${Math.floor(APPLY_PROGRESS * 100)}`,
    };
  }
  function createCheckingView(texts) {
    return {
      title: texts.title,
      lines: [texts.check],
    };
  }
  function createAvailableView(update, texts) {
    return {
      title: texts.title,
      lines: [texts.version(update.installed?.version, update.manifest.version), texts.backup],
      commands: [
        [texts.update, 'update'],
        [texts.skip, 'close'],
      ],
    };
  }
  function createUpToDateView(texts) {
    return {
      title: texts.title,
      lines: [texts.current],
      commands: [[texts.skip, 'close']],
    };
  }
  function createInstalledView(result, texts) {
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
  function createErrorView(error, retrySymbol, texts) {
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
  function wrapTextLine(text, maxWidth, measureText) {
    const lines = [];
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
  function wrapMessageLines(lines, maxWidth, measureText) {
    return lines.flatMap((text) =>
      String(text)
        .split(/\r?\n/)
        .flatMap((line) => wrapTextLine(line, maxWidth, measureText)),
    );
  }
  // src/ui/windows.ts
  const PROGRESS_BAR_HEIGHT = 12;
  /**
   * Lazily defines updater window subclasses after RMMZ globals are verified,
   * keeping the bundled prototype script inert outside RPG Maker MZ.
   */
  function createUpdaterWindows() {
    function Window_OpenMzMessage() {
      return Object.getPrototypeOf(Window_OpenMzMessage).apply(this, arguments);
    }

    Window_OpenMzMessage.prototype = Object.create(Window_Base.prototype, {
      constructor: { value: Window_OpenMzMessage, writable: true, configurable: true },
    });
    Object.setPrototypeOf(Window_OpenMzMessage, Window_Base);

    Window_OpenMzMessage.prototype.initialize = function (rect) {
      Reflect.get(Object.getPrototypeOf(Window_OpenMzMessage.prototype), 'initialize', this).call(this, rect);
      this.openness = 0;
    };

    Window_OpenMzMessage.prototype.setMessage = function (title, lines, progress) {
      const inset = this.itemPadding();
      const width = Math.max(1, this.innerWidth - inset * 2);
      const measure = (value) => this.textWidth(value);
      const heading = wrapTextLine(title, width, measure);
      const body = wrapMessageLines(lines, width, measure);
      const hasProgress = typeof progress === 'number';
      const height = this.fittingHeight(heading.length + body.length + (hasProgress ? 1 : 0));
      if (this.height !== height) {
        this.height = height;
        this.createContents();
      } else this.contents.clear();
      const lineHeight = this.lineHeight();
      this.changeTextColor(ColorManager.systemColor());
      heading.forEach((line, index) => this.drawText(line, inset, index * lineHeight, width, 'center'));
      this.resetTextColor();
      body.forEach((line, index) => this.drawText(line, inset, (heading.length + index) * lineHeight, width));
      if (hasProgress) this.drawProgress(progress, inset, (heading.length + body.length) * lineHeight, width);
    };

    Window_OpenMzMessage.prototype.drawProgress = function (progress, x, y, width) {
      const rate = Math.min(Math.max(progress, 0), 1);
      const labelWidth = this.textWidth('100%');
      const barWidth = Math.max(0, width - labelWidth - this.itemPadding());
      const barY = y + Math.floor((this.lineHeight() - PROGRESS_BAR_HEIGHT) / 2);
      if (barWidth > 0) {
        this.contents.fillRect(x, barY, barWidth, PROGRESS_BAR_HEIGHT, ColorManager.gaugeBackColor());
        const fillWidth = Math.max(0, Math.floor((barWidth - 2) * rate));
        if (fillWidth > 0)
          this.contents.gradientFillRect(
            x + 1,
            barY + 1,
            fillWidth,
            10,
            ColorManager.hpGaugeColor1(),
            ColorManager.hpGaugeColor2(),
          );
      }
      this.drawText(`${Math.floor(rate * 100)}%`, x + width - labelWidth, y, labelWidth, 'right');
    };

    Window_OpenMzMessage.prototype.wrapLine = function (text, width) {
      return wrapTextLine(text, width, (value) => this.textWidth(value));
    };
    function Window_OpenMzConfirm() {
      return Object.getPrototypeOf(Window_OpenMzConfirm).apply(this, arguments);
    }

    Window_OpenMzConfirm.prototype = Object.create(Window_HorzCommand.prototype, {
      constructor: { value: Window_OpenMzConfirm, writable: true, configurable: true },
    });
    Object.setPrototypeOf(Window_OpenMzConfirm, Window_HorzCommand);

    Window_OpenMzConfirm.prototype.initialize = function (rect) {
      Reflect.get(Object.getPrototypeOf(Window_OpenMzConfirm.prototype), 'initialize', this).call(this, rect);
      this.openness = 0;
      this.deactivate();
    };

    Window_OpenMzConfirm.prototype.maxCols = function () {
      return Math.max(1, Math.min(2, this._openMzCommands?.length || 1));
    };

    Window_OpenMzConfirm.prototype.setCommands = function (commands) {
      this._openMzCommands = commands;
      this.refresh();
      this.select(0);
    };

    Window_OpenMzConfirm.prototype.makeCommandList = function () {
      for (const [label, symbol] of this._openMzCommands || []) this.addCommand(label, symbol);
    };
    return {
      Window_OpenMzMessage,
      Window_OpenMzConfirm,
    };
  }
  // src/ui/scene-title.ts
  const DIALOG_MAX_WIDTH = 540;
  const DIALOG_HORIZONTAL_MARGIN = 48;
  function isSceneStillActive(scene) {
    if (typeof SceneManager === 'undefined') return false;
    if (SceneManager._scene !== scene) return false;
    if (typeof SceneManager.isSceneChanging === 'function' && SceneManager.isSceneChanging()) return false;
    return true;
  }
  function presentDialog(scene, view) {
    scene.showOpenMzMessage(view.title, view.lines, view.progress);
    if (view.commands) scene.showOpenMzCommands(view.commands);
  }
  function attachUpdaterToSceneTitle(env) {
    const { Window_OpenMzMessage, Window_OpenMzConfirm } = createUpdaterWindows();
    const title = Scene_Title.prototype;
    let hasAutoChecked = false;
    const originalCreate = title.create;
    title.create = function () {
      originalCreate.call(this);
      if (!hasAutoChecked) {
        hasAutoChecked = true;
        this.checkOpenMzUpdate();
      }
    };
    const originalIsBusy = title.isBusy;
    title.isBusy = function () {
      return (
        Boolean(this._openMzUpdaterActive) ||
        Boolean(this._openMzMessageWindow?.isClosing()) ||
        originalIsBusy.call(this)
      );
    };
    if (typeof title.terminate === 'function') {
      const originalTerminate = title.terminate;
      title.terminate = function () {
        if (this._openMzState === 'checking') this._openMzAbortController?.abort();
        originalTerminate.call(this);
      };
    }
    title.createOpenMzUpdater = function () {
      if (this._openMzMessageWindow) return;
      const width = Math.min(DIALOG_MAX_WIDTH, Graphics.boxWidth - DIALOG_HORIZONTAL_MARGIN);
      const x = Math.floor((Graphics.boxWidth - width) / 2);
      this._openMzMessageWindow = new Window_OpenMzMessage(new Rectangle(x, 0, width, this.calcWindowHeight(1, false)));
      this._openMzConfirmWindow = new Window_OpenMzConfirm(new Rectangle(x, 0, width, this.calcWindowHeight(1, true)));
      this._openMzConfirmWindow.setHandler('update', this.runOpenMzUpdate.bind(this));
      this._openMzConfirmWindow.setHandler('check', this.checkOpenMzUpdate.bind(this));
      this._openMzConfirmWindow.setHandler('reload', env.reloadApp);
      this._openMzConfirmWindow.setHandler('close', this.closeOpenMzUpdater.bind(this));
      this._openMzConfirmWindow.setHandler('cancel', this.closeOpenMzUpdater.bind(this));
      this.addWindow(this._openMzMessageWindow);
      this.addWindow(this._openMzConfirmWindow);
    };
    title.showOpenMzMessage = function (heading, lines, progress) {
      this.createOpenMzUpdater();
      this._openMzUpdaterActive = true;
      this._commandWindow?.deactivate();
      const message = this._openMzMessageWindow;
      const commands = this._openMzConfirmWindow;
      message.setMessage(heading, lines, progress);
      message.y = Math.max(0, Math.floor((Graphics.boxHeight - message.height - commands.height) / 2));
      commands.y = message.y + message.height;
      message.open();
    };
    title.showOpenMzCommands = function (commands) {
      this._openMzConfirmWindow.setCommands(commands);
      this._openMzConfirmWindow.open();
      this._openMzConfirmWindow.activate();
    };
    title.checkOpenMzUpdate = async function () {
      if (this._openMzState === 'checking' || this._openMzState === 'installing') return;
      const texts = getUpdaterTexts(env.getLocale());
      this._openMzState = 'checking';
      const controller = typeof AbortController === 'function' ? new AbortController() : void 0;
      this._openMzAbortController = controller;
      if (this._openMzConfirmWindow) {
        this._openMzConfirmWindow.deactivate();
        this._openMzConfirmWindow.close();
        presentDialog(this, createCheckingView(texts));
      }
      try {
        const update = await checkForUpdate({
          manifestUrl: env.manifestUrl,
          projectRoot: env.getProjectRoot(),
          nodeRequire: env.nodeRequire,
          signal: controller?.signal,
        });
        if (!isSceneStillActive(this)) {
          this._openMzState = 'idle';
          return;
        }
        this._openMzUpdate = update;
        if (update.available) {
          this._openMzState = 'prompt';
          presentDialog(this, createAvailableView(update, texts));
        } else if (this._openMzMessageWindow) {
          this._openMzState = 'prompt';
          presentDialog(this, createUpToDateView(texts));
        } else this._openMzState = 'idle';
      } catch (error) {
        if (!isSceneStillActive(this) || (isUpdaterError(error) && error.code === 'ABORTED')) {
          this._openMzState = 'idle';
          return;
        }
        this._openMzState = 'error';
        presentDialog(this, createErrorView(error, 'check', texts));
      } finally {
        if (this._openMzAbortController === controller) this._openMzAbortController = void 0;
      }
    };
    title.runOpenMzUpdate = async function () {
      if (this._openMzState === 'installing' || this._openMzState === 'checking' || !this._openMzUpdate) return;
      const texts = getUpdaterTexts(env.getLocale());
      let lastProgressKey = '';
      const renderProgress = (event) => {
        if (!isSceneStillActive(this)) return;
        const snapshot = formatProgressSnapshot(event, texts);
        if (snapshot.key === lastProgressKey) return;
        lastProgressKey = snapshot.key;
        this.showOpenMzMessage(texts.title, [snapshot.text], snapshot.progress);
      };
      this._openMzState = 'installing';
      this._openMzConfirmWindow?.deactivate();
      this._openMzConfirmWindow?.close();
      try {
        const result = await installUpdate({
          update: this._openMzUpdate,
          projectRoot: env.getProjectRoot(),
          nodeRequire: env.nodeRequire,
          onProgress: (event) => {
            renderProgress(event);
            return env.waitForRender();
          },
          onDownload: renderProgress,
        });
        if (!isSceneStillActive(this)) {
          this._openMzState = 'done';
          return;
        }
        this._openMzState = 'done';
        presentDialog(this, createInstalledView(result, texts));
      } catch (error) {
        if (!isSceneStillActive(this)) {
          this._openMzState = 'error';
          return;
        }
        this._openMzState = 'error';
        presentDialog(this, createErrorView(error, 'update', texts));
      }
    };
    title.closeOpenMzUpdater = function () {
      if (this._openMzState === 'installing') return;
      this._openMzState = 'idle';
      this._openMzUpdaterActive = false;
      this._openMzConfirmWindow?.deactivate();
      this._openMzConfirmWindow?.close();
      this._openMzMessageWindow?.close();
      this._commandWindow?.activate();
    };
  }
  // src/ui.ts
  function setupUpdater() {
    const env = detectUpdaterEnvironment();
    if (!env) return;
    attachUpdaterToSceneTitle(env);
  }
  // src/index.ts
  setupUpdater();
})();
