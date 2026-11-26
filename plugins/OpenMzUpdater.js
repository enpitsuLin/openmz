//=============================================================================
// OpenMZ - Core Engine Updater
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Upgrade RPG Maker MZ core engine scripts from a v2 manifest.
 * @author OpenMZ
 *
 * @param manifestUrl
 * @text Manifest URL
 * @desc URL of the v2 manifest JSON for the core engine archive.
 * @type string
 * @default
 *
 * @help OpenMzUpdater.js
 *
 * Overrides Scene_Title to prompt whether to upgrade RPG Maker MZ core engine
 * scripts using the configured manifest URL. When manifestUrl is empty, the
 * plugin does nothing.
 *
 * Manifest JSON format:
 * {
 *   "schemaVersion": 2,
 *   "name": "OpenMZ",
 *   "version": "1.0.0",
 *   "archive": { "url": "openmz-core-1.0.0.tar.gz" }
 * }
 *
 * The archive is verified against the optional size and SHA-256 in the manifest.
 * Existing files are backed up to js_backup/<timestamp>/ before replacement.
 * After a successful upgrade, this plugin is automatically disabled in js/plugins.js.
 * Runs in NW.js (RPG Maker MZ Playtest / desktop build).
 */

/*:zh
 * @target MZ
 * @plugindesc 通过 Manifest 地址下载并升级 RPG Maker MZ 核心引擎脚本。
 * @author OpenMZ
 *
 * @param manifestUrl
 * @text Manifest 地址
 * @desc 包含核心引擎压缩包地址的 v2 Manifest JSON URL。
 * @type string
 * @default
 *
 * @help OpenMzUpdater.js
 *
 * 改写 Scene_Title，进入标题画面时提示是否通过 Manifest 升级核心引擎。
 * 当 Manifest 地址为空时，插件加载后不会执行任何逻辑。
 * 确认后下载并校验单个 tar.gz 压缩包，备份原文件到 js_backup/<时间戳>/，
 * 再替换当前工程的核心脚本。升级完成后会自动关闭本插件。
 *
 * 仅在 NW.js 环境（RPG Maker MZ 编辑器测试 / 桌面端）下生效。
 */

(() => {
    "use strict";

    const MAX_REDIRECTS = 10;
    const REQUEST_TIMEOUT_MS = 30000;
    const TAR_BLOCK_SIZE = 512;
    const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(?:0|[1-9]\d*|\d*[a-z-][\da-z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-z-][\da-z-]*))*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?$/i;

    const getNodeRequire = () => {
        if (typeof window === "object" && typeof window.require === "function") {
            return window.require;
        }
        if (typeof require === "function") {
            return require;
        }
        return null;
    };

    const resolveProjectRoot = (nodeRequire) => {
        const path = nodeRequire("path");
        if (window.location.protocol === "file:") {
            const { fileURLToPath } = nodeRequire("url");
            return path.dirname(fileURLToPath(window.location.href));
        }
        if (process.mainModule && process.mainModule.filename) {
            return path.dirname(process.mainModule.filename);
        }
        return process.cwd();
    };

    const createTimestamp = (date = new Date()) => {
        const pad = (value, length = 2) => String(value).padStart(length, "0");
        return [
            date.getFullYear(),
            pad(date.getMonth() + 1),
            pad(date.getDate()),
            "-",
            pad(date.getHours()),
            pad(date.getMinutes()),
            pad(date.getSeconds()),
        ].join("");
    };

    const fetchBuffer = async (nodeRequire, targetUrl, redirects = []) => {
        const url = new URL(targetUrl);
        const finalUrl = url.href;
        if (redirects.length > MAX_REDIRECTS) {
            throw new Error(`Too many redirects: ${finalUrl}`);
        }
        const redirectChain = [...redirects, finalUrl];

        if (url.protocol === "file:") {
            const fs = nodeRequire("fs");
            const { fileURLToPath } = nodeRequire("url");
            const buffer = await new Promise((resolve, reject) => {
                fs.readFile(fileURLToPath(finalUrl), (error, bytes) => {
                    if (error) reject(error);
                    else resolve(bytes);
                });
            });
            return { buffer, finalUrl, redirectChain };
        }
        if (url.protocol !== "http:" && url.protocol !== "https:") {
            throw new Error(`Unsupported protocol "${url.protocol}": ${finalUrl}`);
        }

        const transport = nodeRequire(url.protocol === "https:" ? "https" : "http");
        const { Buffer: NodeBuffer } = nodeRequire("buffer");
        const options = {
            protocol: url.protocol,
            hostname: url.hostname.replace(/^\[|\]$/g, ""),
            port: url.port,
            path: url.pathname + url.search,
            auth: url.username || url.password
                ? `${decodeURIComponent(url.username)}:${decodeURIComponent(url.password)}`
                : undefined,
            headers: { "User-Agent": "OpenMzUpdater", "Cache-Control": "no-cache" },
        };

        let timeout;
        const result = await new Promise((resolve, reject) => {
            const request = transport.get(options, (response) => {
                const status = response.statusCode;
                response.on("error", reject);
                if (status >= 300 && status < 400 && response.headers.location) {
                    response.resume();
                    resolve(response.headers.location);
                    return;
                }
                if (status < 200 || status >= 300) {
                    response.resume();
                    reject(new Error(`HTTP ${status}: ${finalUrl}`));
                    return;
                }
                const chunks = [];
                response.on("data", (chunk) => chunks.push(chunk));
                response.on("end", () => resolve(NodeBuffer.concat(chunks)));
                response.on("aborted", () => reject(new Error(`Incomplete download: ${finalUrl}`)));
            });

            request.on("error", reject);
            timeout = setTimeout(() => {
                request.destroy(new Error(`Request timed out: ${finalUrl}`));
            }, REQUEST_TIMEOUT_MS);
        }).finally(() => clearTimeout(timeout));

        if (typeof result === "string") {
            return fetchBuffer(nodeRequire, new URL(result, finalUrl).href, redirectChain);
        }
        return { buffer: result, finalUrl, redirectChain };
    };

    const parseManifest = ({ buffer, redirectChain }) => {
        const manifest = JSON.parse(buffer.toString("utf8"));
        if (!manifest || manifest.schemaVersion !== 2) {
            throw new Error("Expected a schemaVersion 2 manifest.");
        }
        const { name, version, archive } = manifest;
        if (typeof name !== "string" || !name.trim() ||
            typeof version !== "string" || !SEMVER.test(version)) {
            throw new Error("Manifest requires a name and a semantic version.");
        }
        if (!archive || typeof archive.url !== "string" || !archive.url.trim()) {
            throw new Error("Manifest requires an archive URL.");
        }
        const { size, sha256 } = archive;
        if (size !== undefined && (!Number.isSafeInteger(size) || size <= 0)) {
            throw new Error("Invalid archive size in manifest.");
        }
        if (sha256 !== undefined && (typeof sha256 !== "string" || !/^[\da-f]{64}$/i.test(sha256))) {
            throw new Error("Invalid archive SHA-256 in manifest.");
        }

        // Resolve relative assets against the last URL on the original origin.
        const original = new URL(redirectChain[0]);
        const base = redirectChain.slice().reverse().find((location) => {
            const url = new URL(location);
            return url.origin === original.origin && url.protocol === original.protocol;
        });
        const url = new URL(archive.url.trim(), base);
        if (!["http:", "https:", "file:"].includes(url.protocol)) {
            throw new Error(`Unsupported archive protocol: ${url.protocol}`);
        }
        return { name, version, archive: { url: url.href, size, sha256 } };
    };

    const parseTarBuffer = (buffer) => {
        const readText = (field) => field.toString("utf8").split("\0", 1)[0];
        const readOctal = (field) => {
            const value = field.toString("ascii").replace(/\0.*$/, "").trim();
            if (!/^[0-7]+$/.test(value)) {
                throw new Error("Invalid tar header number.");
            }
            return parseInt(value, 8);
        };
        const entries = [];
        let longPath;
        let offset = 0;

        while (offset + 2 * TAR_BLOCK_SIZE <= buffer.length) {
            const header = buffer.subarray(offset, offset + TAR_BLOCK_SIZE);
            offset += TAR_BLOCK_SIZE;
            if (header.every((byte) => byte === 0)) {
                const end = buffer.subarray(offset, offset + TAR_BLOCK_SIZE);
                if (longPath !== undefined || !end.every((byte) => byte === 0)) {
                    throw new Error("Invalid tar end marker.");
                }
                return entries;
            }
            const checksum = header.reduce((sum, byte, index) =>
                sum + (index >= 148 && index < 156 ? 32 : byte), 0);
            if (checksum !== readOctal(header.subarray(148, 156))) {
                throw new Error("Invalid tar header checksum.");
            }

            const size = readOctal(header.subarray(124, 136));
            const nextOffset = offset + Math.ceil(size / TAR_BLOCK_SIZE) * TAR_BLOCK_SIZE;
            if (nextOffset > buffer.length) {
                throw new Error("Truncated tar entry.");
            }
            const content = buffer.subarray(offset, offset + size);
            offset = nextOffset;
            const type = header[156];
            const name = readText(header.subarray(0, 100));
            if (type === 76 && (name === "././@LongLink" || name === "@LongLink")) {
                longPath = readText(content);
                continue;
            }
            if (type === 120 || type === 103) { // PAX x / g
                continue;
            }
            if (type === 0 || type === 48) { // Regular file
                const prefix = readText(header.subarray(257, 263)) === "ustar"
                    ? readText(header.subarray(345, 500))
                    : "";
                const relativePath = longPath === undefined
                    ? (prefix ? `${prefix}/${name}` : name)
                    : longPath;
                entries.push({ relativePath, content });
            } else if (type !== 53) { // Directory
                throw new Error(`Unsupported tar entry type for ${name}.`);
            }
            longPath = undefined;
        }
        throw new Error("Missing tar end marker.");
    };

    const normalizeTargetRelativePath = (relativePath) => {
        const segments = relativePath.split("/");
        if (!relativePath.startsWith("js/") || segments.some((segment) =>
            !segment || /[\\:\0]/.test(segment) || /[. ]$/.test(segment)
        )) {
            throw new Error(`Unsafe target script path: ${relativePath}`);
        }
        if (/^js\/(plugins\.js(?:\/|$)|plugins(?:\/|$))/i.test(relativePath)) {
            throw new Error(`Refusing to overwrite protected path: ${relativePath}`);
        }
        return relativePath;
    };

    const getPathStat = (fs, targetPath, directory) => {
        let stat;
        try {
            stat = fs.lstatSync(targetPath);
        } catch (error) {
            if (error.code === "ENOENT") return undefined;
            throw error;
        }
        if (directory ? !stat.isDirectory() : !stat.isFile()) {
            throw new Error(`Unexpected filesystem entry: ${targetPath}`);
        }
        return stat;
    };

    const createUniqueBackupDir = (fs, path, projectRoot) => {
        const backupBase = path.join(projectRoot, "js_backup");
        if (!getPathStat(fs, backupBase, true)) {
            fs.mkdirSync(backupBase, { recursive: true });
        }
        const stamp = createTimestamp();
        for (let suffix = 0; ; suffix++) {
            const candidate = path.join(backupBase, suffix ? `${stamp}-${suffix}` : stamp);
            try {
                fs.mkdirSync(candidate);
                return candidate;
            } catch (error) {
                if (error.code !== "EEXIST") throw error;
            }
        }
    };

    const parsePluginsJs = (nodeRequire, source) => {
        const match = source.match(/var\s+\$plugins\s*=\s*(\[[\s\S]*\])\s*;?/);
        if (match) {
            try {
                const parsed = JSON.parse(match[1]);
                if (Array.isArray(parsed)) {
                    return parsed;
                }
            } catch {
                // Fall back to VM evaluation for hand-edited plugins.js files.
            }
        }
        const vm = nodeRequire("vm");
        const evaluated = vm.runInNewContext(`${source}\n$plugins;`, {});
        if (!Array.isArray(evaluated)) {
            throw new Error("Invalid js/plugins.js format.");
        }
        return evaluated;
    };

    const formatPluginsJs = (plugins, lineEnding = "\n") => {
        const body = plugins.map((entry) => JSON.stringify(entry)).join(`,${lineEnding}`);
        const lines = [
            "// Generated by RPG Maker.",
            "// Do not edit this file directly.",
            "var $plugins =",
            "[",
        ];
        if (body) {
            lines.push(body);
        }
        lines.push("];", "");
        return lines.join(lineEnding);
    };

    const preparePluginConfig = (nodeRequire, targetPath, pluginName) => {
        const fs = nodeRequire("fs");
        const stat = getPathStat(fs, targetPath, false);
        if (!stat) {
            throw new Error("Missing js/plugins.js.");
        }

        const source = fs.readFileSync(targetPath, "utf8");
        const plugins = parsePluginsJs(nodeRequire, source);
        const entries = plugins.filter((entry) => entry && entry.name === pluginName);
        if (!entries.length) {
            throw new Error(`Missing plugin entry in js/plugins.js: ${pluginName}`);
        }
        if (entries.every((entry) => entry.status === false)) {
            return null;
        }
        for (const entry of entries) {
            entry.status = false;
        }
        const lineEnding = source.includes("\r\n") ? "\r\n" : "\n";
        return {
            relativePath: "js/plugins.js",
            targetPath,
            content: formatPluginsJs(plugins, lineEnding),
            stat,
        };
    };

    const applyUpgrade = (fs, path, projectRoot, files, missingDirs) => {
        const backupDir = createUniqueBackupDir(fs, path, projectRoot);
        const stagedPath = path.join(backupDir, ".openmz-update");
        const createdDirs = [];
        const applied = [];

        try {
            for (const file of files) {
                if (file.stat) {
                    const backupPath = path.join(backupDir, file.relativePath);
                    fs.mkdirSync(path.dirname(backupPath), { recursive: true });
                    fs.copyFileSync(file.targetPath, backupPath);
                }
            }
            for (const directory of missingDirs) {
                fs.mkdirSync(directory);
                createdDirs.push(directory);
            }
            for (const file of files) {
                fs.writeFileSync(stagedPath, file.content, { flag: "wx" });
                if (file.stat) {
                    fs.chmodSync(stagedPath, file.stat.mode & 0o777);
                }
                // Rename makes a failed write leave the destination untouched.
                fs.renameSync(stagedPath, file.targetPath);
                applied.push(file);
            }
        } catch (error) {
            const rollbackErrors = [];
            const restore = (operation) => {
                try {
                    operation();
                } catch (rollbackError) {
                    rollbackErrors.push(rollbackError.message);
                }
            };
            for (const file of applied.reverse()) {
                restore(() => {
                    if (file.stat) {
                        if (fs.existsSync(stagedPath)) fs.unlinkSync(stagedPath);
                        fs.copyFileSync(path.join(backupDir, file.relativePath), stagedPath);
                        fs.renameSync(stagedPath, file.targetPath);
                    } else {
                        fs.unlinkSync(file.targetPath);
                    }
                });
            }
            restore(() => {
                if (fs.existsSync(stagedPath)) fs.unlinkSync(stagedPath);
            });
            for (const directory of createdDirs.reverse()) {
                restore(() => fs.rmdirSync(directory));
            }
            if (rollbackErrors.length) {
                throw new Error(`${error.message} Rollback incomplete. Backup: ${backupDir}. ${rollbackErrors.join(" | ")}`);
            }
            throw error;
        }
        return backupDir;
    };

    const upgradeCoreEngine = async ({
        manifestUrl,
        projectRoot,
        pluginName = "",
        onProgress = () => {},
        nodeRequire,
    }) => {
        const fs = nodeRequire("fs");
        const path = nodeRequire("path");

        await onProgress({ phase: "manifest" });
        const manifest = parseManifest(await fetchBuffer(nodeRequire, manifestUrl));
        const { archive } = manifest;
        const archiveName = new URL(archive.url).pathname.split("/").pop();
        await onProgress({ phase: "download", file: archiveName });
        const { buffer } = await fetchBuffer(nodeRequire, archive.url);

        await onProgress({ phase: "verify" });
        if (archive.size !== undefined && buffer.length !== archive.size) {
            throw new Error(`Archive size mismatch: expected ${archive.size}, got ${buffer.length}.`);
        }
        if (archive.sha256 !== undefined) {
            const actual = nodeRequire("crypto").createHash("sha256").update(buffer).digest("hex");
            if (actual !== archive.sha256.toLowerCase()) {
                throw new Error("Archive SHA-256 mismatch.");
            }
        }
        const downloaded = parseTarBuffer(nodeRequire("zlib").gunzipSync(buffer));
        if (!downloaded.length) {
            throw new Error("Archive contains no core files.");
        }

        const root = fs.realpathSync(projectRoot);
        const jsRoot = path.join(root, "js") + path.sep;
        const seenPaths = new Set();
        for (const item of downloaded) {
            normalizeTargetRelativePath(item.relativePath);
            const key = item.relativePath.toLowerCase();
            if (seenPaths.has(key)) {
                throw new Error(`Duplicate archive path: ${item.relativePath}`);
            }
            seenPaths.add(key);
        }

        await onProgress({ phase: "apply", total: downloaded.length });
        const missingDirs = new Set();
        const files = downloaded.map(({ relativePath, content }) => {
            const targetPath = path.resolve(root, relativePath);
            if (!targetPath.startsWith(jsRoot)) {
                throw new Error(`Target path escapes js/ directory: ${relativePath}`);
            }
            const segments = relativePath.split("/");
            let directory = "";
            for (const segment of segments.slice(0, -1)) {
                directory = directory ? `${directory}/${segment}` : segment;
                if (seenPaths.has(directory.toLowerCase())) {
                    throw new Error(`Archive path is both a file and a directory: ${directory}`);
                }
                const directoryPath = path.join(root, directory);
                if (!getPathStat(fs, directoryPath, true)) {
                    missingDirs.add(directoryPath);
                }
            }
            return { relativePath, content, targetPath, stat: getPathStat(fs, targetPath, false) };
        });
        if (pluginName) {
            const pluginConfig = preparePluginConfig(nodeRequire, path.join(root, "js", "plugins.js"), pluginName);
            if (pluginConfig) files.push(pluginConfig);
        }

        const backupDir = applyUpgrade(fs, path, root, files, missingDirs);
        if (pluginName && typeof $plugins !== "undefined" && Array.isArray($plugins)) {
            for (const entry of $plugins) {
                if (entry && entry.name === pluginName) {
                    entry.status = false;
                }
            }
        }

        return {
            name: manifest.name,
            version: manifest.version,
            updatedFiles: downloaded.map((item) => item.relativePath),
            backupRelativeDir: path.relative(root, backupDir).replace(/\\/g, "/"),
        };
    };

    if (typeof window === "undefined" && typeof module === "object" && module.exports) {
        module.exports = { fetchBuffer, parseTarBuffer, upgradeCoreEngine };
    }

    if (typeof PluginManager === "undefined" || typeof Scene_Title === "undefined") {
        return;
    }

    const scriptSrc = document.currentScript ? document.currentScript.src : "";
    const pluginName = scriptSrc
        ? decodeURIComponent(scriptSrc.split("/").pop().replace(/\.js$/i, ""))
        : "OpenMzUpdater";
    const parameters = PluginManager.parameters(pluginName);
    const configuredManifestUrl = String(parameters.manifestUrl || "").trim();

    const nodeRequire = getNodeRequire();
    if (!configuredManifestUrl || !nodeRequire || !Utils.isNwjs()) {
        return;
    }

    let promptHandledInSession = false;

    const isChineseLocale = () => {
        const locale =
            typeof $dataSystem === "object" && $dataSystem && $dataSystem.locale
                ? String($dataSystem.locale)
                : navigator.language || "";
        return locale.toLowerCase().startsWith("zh");
    };

    const getTexts = () =>
        isChineseLocale()
            ? {
                  title: "OpenMZ 核心引擎升级",
                  confirmLine1: "是否通过 Manifest 升级 RPG Maker MZ 核心引擎？",
                  confirmSource: (url) => `Manifest: ${url}`,
                  confirmBackup: "替换前会自动备份原有 js 脚本到 js_backup/ 目录。",
                  fetchingManifest: "正在获取 Manifest 清单...",
                  downloading: (file) => `正在下载核心引擎包 (${file})...`,
                  verifying: "正在校验并解包...",
                  applying: (total) => `正在备份原脚本并写入 ${total} 个文件...`,
                  doneTitle: "核心引擎升级完成",
                  doneCount: (name, version, count) =>
                      `已更新 ${count} 个核心文件 (${name}${version ? ` v${version}` : ""})`,
                  doneBackup: (dir) => `原文件已备份至: ${dir}`,
                  doneHint: "已自动关闭本插件，请重新加载以启用新的核心引擎。",
                  errorTitle: "核心引擎升级失败",
                  btnUpgrade: "确认升级",
                  btnSkip: "暂不升级",
                  btnReload: "立即重启",
                  btnRetry: "重试",
                  btnBack: "返回标题",
              }
            : {
                  title: "OpenMZ Core Engine Upgrade",
                  confirmLine1: "Upgrade RPG Maker MZ core engine via manifest?",
                  confirmSource: (url) => `Manifest: ${url}`,
                  confirmBackup: "Existing scripts will be backed up to js_backup/ first.",
                  fetchingManifest: "Fetching manifest...",
                  downloading: (file) => `Downloading core engine archive (${file})...`,
                  verifying: "Verifying and extracting the archive...",
                  applying: (total) => `Backing up and writing ${total} files...`,
                  doneTitle: "Core Engine Upgraded",
                  doneCount: (name, version, count) =>
                      `Updated ${count} files (${name}${version ? ` v${version}` : ""})`,
                  doneBackup: (dir) => `Backup saved to: ${dir}`,
                  doneHint: "Plugin disabled. Reload to launch the upgraded engine.",
                  errorTitle: "Core Engine Upgrade Failed",
                  btnUpgrade: "Upgrade",
                  btnSkip: "Cancel",
                  btnReload: "Reload Now",
                  btnRetry: "Retry",
                  btnBack: "Back to Title",
              };

    const reloadApplication = () => {
        if (typeof nw === "object" && nw.Window && typeof nw.Window.get === "function") {
            const currentWindow = nw.Window.get();
            if (currentWindow && typeof currentWindow.reloadIgnoringCache === "function") {
                currentWindow.reloadIgnoringCache();
                return;
            }
        }
        window.location.reload();
    };

    class Window_OpenMzMessage extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
            this._titleText = "";
            this._bodyLines = [];
            this._titleColor = null;
            this.openness = 0;
        }

        setMessage(titleText, bodyLines, titleColor = null) {
            this._titleText = titleText;
            this._bodyLines = bodyLines;
            this._titleColor = titleColor;
            this.refresh();
        }

        refresh() {
            this.contents.clear();
            const lineHeight = this.lineHeight();
            const maxWidth = this.innerWidth;
            let lineY = 0;

            if (this._titleText) {
                this.changeTextColor(this._titleColor || ColorManager.systemColor());
                this.drawText(this._titleText, 0, lineY, maxWidth, "center");
                this.resetTextColor();
                lineY += lineHeight;
            }

            for (const line of this._bodyLines) {
                this.drawText(String(line), 0, lineY, maxWidth, "left");
                lineY += lineHeight;
            }
        }
    }

    class Window_OpenMzConfirm extends Window_HorzCommand {
        initialize(rect) {
            this._mode = "confirm";
            super.initialize(rect);
            this.openness = 0;
            this.deactivate();
        }

        maxCols() {
            return 2;
        }

        setMode(mode) {
            this._mode = mode;
            this.refresh();
            this.select(0);
        }

        makeCommandList() {
            const texts = getTexts();
            const mode = this._mode || "confirm";
            if (mode === "done") {
                this.addCommand(texts.btnReload, "reload");
                this.addCommand(texts.btnBack, "close");
            } else if (mode === "error") {
                this.addCommand(texts.btnRetry, "upgrade");
                this.addCommand(texts.btnBack, "close");
            } else {
                this.addCommand(texts.btnUpgrade, "upgrade");
                this.addCommand(texts.btnSkip, "close");
            }
        }
    }

    const _Scene_Title_create = Scene_Title.prototype.create;
    Scene_Title.prototype.create = function() {
        _Scene_Title_create.call(this);
        this._openMzUpdaterActive = false;
        this._openMzUpgrading = false;
        if (!promptHandledInSession) {
            this.createOpenMzUpdaterWindows();
        }
    };

    const _Scene_Title_update = Scene_Title.prototype.update;
    Scene_Title.prototype.update = function() {
        if (this._openMzUpdaterActive && !Scene_Base.prototype.isBusy.call(this)) {
            if (
                this._openMzMessageWindow &&
                this._openMzMessageWindow.isClosed() &&
                !this._openMzMessageWindow.isOpening()
            ) {
                this._openMzMessageWindow.open();
            }
            if (
                !this._openMzUpgrading &&
                this._openMzConfirmWindow &&
                this._openMzConfirmWindow.isClosed() &&
                !this._openMzConfirmWindow.isOpening()
            ) {
                this._openMzConfirmWindow.open();
                this._openMzConfirmWindow.activate();
            }
        }
        _Scene_Title_update.call(this);
    };

    const _Scene_Title_isBusy = Scene_Title.prototype.isBusy;
    Scene_Title.prototype.isBusy = function() {
        const updaterClosing =
            (this._openMzMessageWindow && this._openMzMessageWindow.isClosing()) ||
            (this._openMzConfirmWindow && this._openMzConfirmWindow.isClosing());
        return (
            Boolean(this._openMzUpdaterActive || updaterClosing) ||
            _Scene_Title_isBusy.call(this)
        );
    };

    Scene_Title.prototype.createOpenMzUpdaterWindows = function() {
        this._openMzUpdaterActive = true;
        this._commandWindow.deactivate();
        this._commandWindow.close();

        const width = Math.min(640, Graphics.boxWidth - 48);
        const messageHeight = this.calcWindowHeight(5, false);
        const confirmHeight = this.calcWindowHeight(1, true);
        const totalHeight = messageHeight + confirmHeight;
        const x = Math.floor((Graphics.boxWidth - width) / 2);
        const y = Math.floor((Graphics.boxHeight - totalHeight) / 2);

        const messageRect = new Rectangle(x, y, width, messageHeight);
        const confirmRect = new Rectangle(x, y + messageHeight, width, confirmHeight);

        this._openMzMessageWindow = new Window_OpenMzMessage(messageRect);
        this._openMzConfirmWindow = new Window_OpenMzConfirm(confirmRect);
        this._openMzConfirmWindow.setHandler("upgrade", this.onOpenMzUpgradeConfirm.bind(this));
        this._openMzConfirmWindow.setHandler("reload", this.onOpenMzUpgradeReload.bind(this));
        this._openMzConfirmWindow.setHandler("close", this.onOpenMzUpgradeClose.bind(this));
        this._openMzConfirmWindow.setHandler("cancel", this.onOpenMzUpgradeClose.bind(this));

        const texts = getTexts();
        this._openMzMessageWindow.setMessage(texts.title, [
            texts.confirmLine1,
            texts.confirmSource(configuredManifestUrl),
            texts.confirmBackup,
        ]);

        this.addWindow(this._openMzMessageWindow);
        this.addWindow(this._openMzConfirmWindow);
    };

    Scene_Title.prototype.onOpenMzUpgradeConfirm = async function() {
        if (this._openMzUpgrading) {
            return;
        }
        const texts = getTexts();
        this._openMzUpgrading = true;
        this._openMzConfirmWindow.deactivate();
        this._openMzConfirmWindow.close();
        this._openMzMessageWindow.setMessage(texts.title, [texts.fetchingManifest]);

        try {
            const result = await upgradeCoreEngine({
                manifestUrl: configuredManifestUrl,
                projectRoot: resolveProjectRoot(nodeRequire),
                pluginName,
                nodeRequire,
                onProgress: async ({ phase, file, total }) => {
                    switch (phase) {
                        case "manifest":
                            this._openMzMessageWindow.setMessage(texts.title, [texts.fetchingManifest]);
                            break;
                        case "download":
                            this._openMzMessageWindow.setMessage(texts.title, [texts.downloading(file)]);
                            break;
                        case "verify":
                            this._openMzMessageWindow.setMessage(texts.title, [texts.verifying]);
                            break;
                        case "apply":
                            this._openMzMessageWindow.setMessage(texts.title, [texts.applying(total)]);
                            break;
                    }
                    if (phase === "verify" || phase === "apply") {
                        // Let the game render the status before synchronous work.
                        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
                    }
                },
            });
            promptHandledInSession = true;
            this._openMzMessageWindow.setMessage(texts.doneTitle, [
                texts.doneCount(result.name, result.version, result.updatedFiles.length),
                texts.doneBackup(result.backupRelativeDir),
                texts.doneHint,
            ]);
            this._openMzConfirmWindow.setMode("done");
        } catch (error) {
            this._openMzMessageWindow.setMessage(
                texts.errorTitle,
                [error.message || String(error)],
                ColorManager.deathColor()
            );
            this._openMzConfirmWindow.setMode("error");
        } finally {
            this._openMzUpgrading = false;
            this._openMzConfirmWindow.open();
            this._openMzConfirmWindow.activate();
        }
    };

    Scene_Title.prototype.onOpenMzUpgradeReload = function() {
        reloadApplication();
    };

    Scene_Title.prototype.onOpenMzUpgradeClose = function() {
        if (this._openMzUpgrading) {
            return;
        }
        promptHandledInSession = true;
        this._openMzUpdaterActive = false;
        this._openMzConfirmWindow.deactivate();
        this._openMzConfirmWindow.close();
        this._openMzMessageWindow.close();
        this._commandWindow.activate();
    };
})();
