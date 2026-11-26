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

    //-------------------------------------------------------------------------
    // Network
    //-------------------------------------------------------------------------

    /**
     * Single HTTP(S) GET. Resolves `{ location }` for redirects, `{ buffer }` otherwise.
     * `onData(received, total)` reports body progress; total is 0 when unknown.
     */
    const httpGet = (nodeRequire, url, onData) => new Promise((resolve, reject) => {
        const { Buffer: NodeBuffer } = nodeRequire("buffer");
        const headers = { "User-Agent": "OpenMzUpdater", "Cache-Control": "no-cache" };
        const request = nodeRequire(url.protocol.slice(0, -1)).get(url.href, { headers }, (response) => {
            const { statusCode: status, headers: { location } } = response;
            if (status >= 300 && status < 400 && location) {
                response.resume();
                resolve({ location });
                return;
            }
            if (status < 200 || status >= 300) {
                response.resume();
                reject(new Error(`HTTP ${status}: ${url.href}`));
                return;
            }
            const total = Number(response.headers["content-length"]) || 0;
            const chunks = [];
            let received = 0;
            response.on("data", (chunk) => {
                chunks.push(chunk);
                received += chunk.length;
                if (onData) onData(received, total);
            });
            response.on("error", reject);
            response.on("end", () => response.complete
                ? resolve({ buffer: NodeBuffer.concat(chunks) })
                : reject(new Error(`Incomplete download: ${url.href}`)));
        });
        request.on("error", reject);
        request.setTimeout(REQUEST_TIMEOUT_MS, () => {
            request.destroy(new Error(`Request timed out: ${url.href}`));
        });
    });

    /** Reads a file:/http:/https: URL, following redirects. */
    const fetchBuffer = async (nodeRequire, targetUrl, onData) => {
        const redirectChain = [];
        let url = new URL(targetUrl);
        for (;;) {
            redirectChain.push(url.href);
            if (redirectChain.length > MAX_REDIRECTS + 1) {
                throw new Error(`Too many redirects: ${url.href}`);
            }
            if (url.protocol === "file:") {
                const filePath = nodeRequire("url").fileURLToPath(url.href);
                const buffer = await nodeRequire("fs").promises.readFile(filePath);
                if (onData) onData(buffer.length, buffer.length);
                return { buffer, finalUrl: url.href, redirectChain };
            }
            if (url.protocol !== "http:" && url.protocol !== "https:") {
                throw new Error(`Unsupported protocol "${url.protocol}": ${url.href}`);
            }
            const { location, buffer } = await httpGet(nodeRequire, url, onData);
            if (!location) {
                return { buffer, finalUrl: url.href, redirectChain };
            }
            url = new URL(location, url);
        }
    };

    //-------------------------------------------------------------------------
    // Manifest & archive
    //-------------------------------------------------------------------------

    const parseManifest = ({ buffer, redirectChain }) => {
        const manifest = JSON.parse(buffer.toString("utf8"));
        if (!manifest || manifest.schemaVersion !== 2) {
            throw new Error("Expected a schemaVersion 2 manifest.");
        }
        const { name, version, archive } = manifest;
        if (typeof name !== "string" || !name.trim() || typeof version !== "string" || !SEMVER.test(version)) {
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

        // Resolve relative assets against the last URL on the original origin,
        // e.g. a GitHub release tag rather than a signed CDN location.
        const original = new URL(redirectChain[0]);
        const base = redirectChain.filter((location) => {
            const url = new URL(location);
            return url.protocol === original.protocol && url.origin === original.origin;
        }).pop();
        const url = new URL(archive.url.trim(), base);
        if (!["http:", "https:", "file:"].includes(url.protocol)) {
            throw new Error(`Unsupported archive protocol: ${url.protocol}`);
        }
        return { name, version, archive: { url: url.href, size, sha256 } };
    };

    const verifyArchive = (nodeRequire, buffer, { size, sha256 }) => {
        if (size !== undefined && buffer.length !== size) {
            throw new Error(`Archive size mismatch: expected ${size}, got ${buffer.length}.`);
        }
        if (sha256 !== undefined) {
            const actual = nodeRequire("crypto").createHash("sha256").update(buffer).digest("hex");
            if (actual !== sha256.toLowerCase()) {
                throw new Error("Archive SHA-256 mismatch.");
            }
        }
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
        const isZero = (block) => block.every((byte) => byte === 0);
        const entries = [];
        let longPath;
        let offset = 0;

        while (offset + 2 * TAR_BLOCK_SIZE <= buffer.length) {
            const header = buffer.subarray(offset, offset + TAR_BLOCK_SIZE);
            offset += TAR_BLOCK_SIZE;
            if (isZero(header)) {
                if (longPath !== undefined || !isZero(buffer.subarray(offset, offset + TAR_BLOCK_SIZE))) {
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
            const content = buffer.subarray(offset, offset + size);
            offset += Math.ceil(size / TAR_BLOCK_SIZE) * TAR_BLOCK_SIZE;
            if (offset > buffer.length) {
                throw new Error("Truncated tar entry.");
            }
            const type = String.fromCharCode(header[156] || 48);
            const name = readText(header.subarray(0, 100));
            if (type === "L" && (name === "././@LongLink" || name === "@LongLink")) {
                longPath = readText(content);
                continue;
            }
            if (type === "x" || type === "g") { // PAX headers
                continue;
            }
            if (type === "0") {
                const prefix = readText(header.subarray(257, 263)) === "ustar"
                    ? readText(header.subarray(345, 500))
                    : "";
                const relativePath = longPath ?? (prefix ? `${prefix}/${name}` : name);
                entries.push({ relativePath, content });
            } else if (type !== "5") { // Directory
                throw new Error(`Unsupported tar entry type for ${name}.`);
            }
            longPath = undefined;
        }
        throw new Error("Missing tar end marker.");
    };

    /** Rejects archives that would write outside js/ or touch the plugin setup. */
    const validateEntries = (entries) => {
        if (!entries.length) {
            throw new Error("Archive contains no core files.");
        }
        const seen = new Set();
        for (const { relativePath } of entries) {
            if (!relativePath.startsWith("js/") || relativePath.split("/").some((segment) =>
                !segment || /[\\:\0]/.test(segment) || /[. ]$/.test(segment))) {
                throw new Error(`Unsafe target script path: ${relativePath}`);
            }
            if (/^js\/plugins(?:\.js)?(?:\/|$)/i.test(relativePath)) {
                throw new Error(`Refusing to overwrite protected path: ${relativePath}`);
            }
            const key = relativePath.toLowerCase();
            if (seen.has(key)) {
                throw new Error(`Duplicate archive path: ${relativePath}`);
            }
            seen.add(key);
        }
        for (const key of seen) {
            const segments = key.split("/");
            for (let i = 2; i < segments.length; i++) {
                const directory = segments.slice(0, i).join("/");
                if (seen.has(directory)) {
                    throw new Error(`Archive path is both a file and a directory: ${directory}`);
                }
            }
        }
    };

    //-------------------------------------------------------------------------
    // Filesystem
    //-------------------------------------------------------------------------

    /** Returns the lstat of a regular file, undefined if missing, throws otherwise. */
    const getFileStat = (fs, filePath) => {
        let stat;
        try {
            stat = fs.lstatSync(filePath);
        } catch (error) {
            if (error.code === "ENOENT") return undefined;
            throw error;
        }
        if (!stat.isFile()) {
            throw new Error(`Unexpected filesystem entry: ${filePath}`);
        }
        return stat;
    };

    const removeDirectory = (fs, directory) => fs.rmSync
        ? fs.rmSync(directory, { recursive: true, force: true })
        : fs.rmdirSync(directory, { recursive: true });

    const createTimestamp = (date = new Date()) => {
        const pad = (value) => String(value).padStart(2, "0");
        return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-` +
            `${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
    };

    const createBackupDir = (fs, path, root) => {
        const base = path.join(root, "js_backup", createTimestamp());
        fs.mkdirSync(path.dirname(base), { recursive: true });
        for (let suffix = 0; ; suffix++) {
            const candidate = suffix ? `${base}-${suffix}` : base;
            try {
                fs.mkdirSync(candidate);
                return candidate;
            } catch (error) {
                if (error.code !== "EEXIST") throw error;
            }
        }
    };

    /** Builds the js/plugins.js replacement that disables this plugin, or null if already disabled. */
    const preparePluginConfig = (fs, nodeRequire, targetPath, pluginName) => {
        const stat = getFileStat(fs, targetPath);
        if (!stat) {
            throw new Error("Missing js/plugins.js.");
        }
        const source = fs.readFileSync(targetPath, "utf8");
        const plugins = nodeRequire("vm").runInNewContext(`${source}\n$plugins;`, {});
        if (!Array.isArray(plugins)) {
            throw new Error("Invalid js/plugins.js format.");
        }
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
        const eol = source.includes("\r\n") ? "\r\n" : "\n";
        const content = [
            "// Generated by RPG Maker.",
            "// Do not edit this file directly.",
            "var $plugins =",
            "[",
            plugins.map((entry) => JSON.stringify(entry)).join(`,${eol}`),
            "];",
            "",
        ].join(eol);
        return { relativePath: "js/plugins.js", targetPath, content, stat };
    };

    /** Backs up, then replaces every file; rolls everything back on failure. */
    const applyUpgrade = (fs, path, root, files) => {
        const backupDir = createBackupDir(fs, path, root);
        const stagedPath = path.join(backupDir, ".openmz-update");
        const backupPathOf = (file) => path.join(backupDir, file.relativePath);
        const createdDirs = [];
        const applied = [];

        try {
            for (const file of files.filter((item) => item.stat)) {
                fs.mkdirSync(path.dirname(backupPathOf(file)), { recursive: true });
                fs.copyFileSync(file.targetPath, backupPathOf(file));
            }
            for (const file of files) {
                const createdDir = fs.mkdirSync(path.dirname(file.targetPath), { recursive: true });
                if (createdDir) createdDirs.push(createdDir);
                fs.writeFileSync(stagedPath, file.content);
                if (file.stat) fs.chmodSync(stagedPath, file.stat.mode & 0o777);
                // Rename makes a failed write leave the destination untouched.
                fs.renameSync(stagedPath, file.targetPath);
                applied.push(file);
            }
        } catch (error) {
            const rollbackErrors = [];
            const attempt = (operation) => {
                try {
                    operation();
                } catch (rollbackError) {
                    rollbackErrors.push(rollbackError.message);
                }
            };
            for (const file of applied.reverse()) {
                attempt(() => file.stat
                    ? fs.copyFileSync(backupPathOf(file), file.targetPath)
                    : fs.unlinkSync(file.targetPath));
            }
            attempt(() => fs.existsSync(stagedPath) && fs.unlinkSync(stagedPath));
            for (const directory of createdDirs.reverse()) {
                attempt(() => removeDirectory(fs, directory));
            }
            if (rollbackErrors.length) {
                throw new Error(`${error.message} Rollback incomplete. Backup: ${backupDir}. ${rollbackErrors.join(" | ")}`);
            }
            throw error;
        }
        return backupDir;
    };

    //-------------------------------------------------------------------------
    // Upgrade pipeline
    //-------------------------------------------------------------------------

    const upgradeCoreEngine = async ({
        manifestUrl,
        projectRoot,
        pluginName = "",
        onProgress = () => {},
        onDownload = () => {},
        nodeRequire,
    }) => {
        const fs = nodeRequire("fs");
        const path = nodeRequire("path");

        await onProgress({ phase: "manifest" });
        const manifest = parseManifest(await fetchBuffer(nodeRequire, manifestUrl));
        const { archive } = manifest;

        const file = new URL(archive.url).pathname.split("/").pop();
        await onProgress({ phase: "download", file, loaded: 0, total: archive.size || 0 });
        const { buffer } = await fetchBuffer(nodeRequire, archive.url, (loaded, total) =>
            onDownload({ phase: "download", file, loaded, total: total || archive.size || 0 }));

        await onProgress({ phase: "verify" });
        verifyArchive(nodeRequire, buffer, archive);
        const entries = parseTarBuffer(nodeRequire("zlib").gunzipSync(buffer));
        validateEntries(entries);

        await onProgress({ phase: "apply", total: entries.length });
        const root = fs.realpathSync(projectRoot);
        const files = entries.map(({ relativePath, content }) => {
            const targetPath = path.join(root, ...relativePath.split("/"));
            return { relativePath, content, targetPath, stat: getFileStat(fs, targetPath) };
        });
        if (pluginName) {
            // Written last so a failure here rolls back the core files too.
            const pluginConfig = preparePluginConfig(fs, nodeRequire, path.join(root, "js", "plugins.js"), pluginName);
            if (pluginConfig) files.push(pluginConfig);
        }
        const backupDir = applyUpgrade(fs, path, root, files);

        if (pluginName && typeof $plugins !== "undefined" && Array.isArray($plugins)) {
            for (const entry of $plugins) {
                if (entry && entry.name === pluginName) entry.status = false;
            }
        }
        return {
            name: manifest.name,
            version: manifest.version,
            updatedFiles: entries.map((entry) => entry.relativePath),
            backupRelativeDir: path.relative(root, backupDir).replace(/\\/g, "/"),
        };
    };

    if (typeof window === "undefined" && typeof module === "object" && module.exports) {
        module.exports = { fetchBuffer, parseTarBuffer, upgradeCoreEngine };
    }

    //-------------------------------------------------------------------------
    // Title scene integration
    //-------------------------------------------------------------------------

    if (typeof PluginManager === "undefined" || typeof Scene_Title === "undefined") {
        return;
    }

    const scriptSrc = document.currentScript ? document.currentScript.src : "";
    const pluginName = scriptSrc
        ? decodeURIComponent(scriptSrc.split("/").pop().replace(/\.js$/i, ""))
        : "OpenMzUpdater";
    const manifestUrl = String(PluginManager.parameters(pluginName).manifestUrl || "").trim();
    const nodeRequire = typeof require === "function" ? require : null;
    if (!manifestUrl || !nodeRequire || !Utils.isNwjs()) {
        return;
    }

    // Share of the overall progress bar covered by each phase: [start, end].
    const PROGRESS_RANGES = {
        manifest: [0, 0.05],
        download: [0.05, 0.85],
        verify: [0.85, 0.9],
        apply: [0.9, 1],
    };

    const formatBytes = (bytes) => bytes >= 1048576
        ? `${(bytes / 1048576).toFixed(1)} MB`
        : `${Math.ceil(bytes / 1024)} KB`;

    const formatProgressSize = (loaded, total) =>
        total ? `${formatBytes(loaded)} / ${formatBytes(total)}` : formatBytes(loaded);

    const TEXTS = {
        zh: {
            title: "升级 OpenMZ 核心引擎",
            confirmAction: "将下载新版并替换工程的核心脚本。",
            confirmBackup: "原脚本将备份到 js_backup/。",
            confirmSource: (source) => `来源：${source}`,
            confirmVersion: (version) => `目标版本：${version}`,
            latestRelease: "最新版",
            progress: {
                manifest: () => "读取更新清单",
                download: ({ file, loaded, total }) => `下载更新包：${file}\n${formatProgressSize(loaded, total)}`,
                verify: () => "校验并解压更新包",
                apply: ({ total }) => `备份原脚本并替换 ${total} 个文件`,
            },
            doneTitle: "升级完成",
            doneCount: (name, version, count) => `已更新至 ${name} v${version}（${count} 个文件）`,
            doneBackup: (dir) => `原脚本备份至：${dir}`,
            doneHint: "升级插件已自动关闭，重启后启用新版引擎。",
            errorTitle: "升级失败",
            btnUpgrade: "确认升级",
            btnSkip: "暂不升级",
            btnReload: "立即重启",
            btnRetry: "重试",
            btnBack: "返回标题",
        },
        en: {
            title: "Upgrade the OpenMZ engine",
            confirmAction: "The upgrade will replace this project's core scripts.",
            confirmBackup: "Original scripts will be backed up to js_backup/.",
            confirmSource: (source) => `Source: ${source}`,
            confirmVersion: (version) => `Target version: ${version}`,
            latestRelease: "Latest release",
            progress: {
                manifest: () => "Reading update manifest",
                download: ({ file, loaded, total }) => `Downloading update: ${file}\n${formatProgressSize(loaded, total)}`,
                verify: () => "Verifying and extracting the update",
                apply: ({ total }) => `Backing up and replacing ${total} files`,
            },
            doneTitle: "Upgrade complete",
            doneCount: (name, version, count) => `Updated to ${name} v${version} (${count} files)`,
            doneBackup: (dir) => `Original scripts backed up to: ${dir}`,
            doneHint: "The updater is disabled. Restart to use the new engine.",
            errorTitle: "Upgrade failed",
            btnUpgrade: "Upgrade",
            btnSkip: "Skip",
            btnReload: "Restart now",
            btnRetry: "Retry",
            btnBack: "Back to title",
        },
    };

    const getTexts = () => {
        const locale = ($dataSystem && $dataSystem.locale) || navigator.language || "";
        return String(locale).toLowerCase().startsWith("zh") ? TEXTS.zh : TEXTS.en;
    };

    /** Shows the manifest URL, plus the release tag when it is a GitHub release asset. */
    const getSourceLines = (texts) => {
        const lines = [texts.confirmSource(manifestUrl)];
        try {
            const url = new URL(manifestUrl);
            const release = url.hostname === "github.com" &&
                url.pathname.match(/^\/[^/]+\/[^/]+\/releases\/(?:download\/([^/]+)|latest\/download)\//);
            if (release) {
                lines.push(texts.confirmVersion(release[1] ? decodeURIComponent(release[1]) : texts.latestRelease));
            }
        } catch {
            // Keep the configured address visible even if it cannot be parsed.
        }
        return lines;
    };

    const resolveProjectRoot = () => {
        const path = nodeRequire("path");
        if (window.location.protocol === "file:") {
            return path.dirname(nodeRequire("url").fileURLToPath(window.location.href));
        }
        return process.mainModule ? path.dirname(process.mainModule.filename) : process.cwd();
    };

    const reloadApplication = () => {
        const nwWindow = typeof nw === "object" && nw.Window ? nw.Window.get() : null;
        if (nwWindow && typeof nwWindow.reloadIgnoringCache === "function") {
            nwWindow.reloadIgnoringCache();
        } else {
            window.location.reload();
        }
    };

    // Let the game render the status text before synchronous work blocks it.
    const waitForRender = () => new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)));

    class Window_OpenMzMessage extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
            this.openness = 0;
        }

        /** @param {number} [progress] 0..1; draws a progress bar below the body when given. */
        setMessage(titleText, bodyLines, titleColor = ColorManager.systemColor(), progress) {
            const inset = this.itemPadding();
            const width = this.innerWidth - inset * 2;
            const title = this.wrapLine(titleText, width);
            const body = bodyLines.flatMap((text) =>
                String(text).split(/\r?\n/).flatMap((line) => this.wrapLine(line, width)));
            const hasProgress = typeof progress === "number";
            const height = this.fittingHeight(title.length + body.length + (hasProgress ? 1 : 0));
            if (this.height !== height) {
                this.height = height;
                this.createContents();
            } else {
                this.contents.clear();
            }

            const lineHeight = this.lineHeight();
            this.changeTextColor(titleColor);
            title.forEach((line, index) => this.drawText(line, inset, index * lineHeight, width, "center"));
            this.resetTextColor();
            body.forEach((line, index) =>
                this.drawText(line, inset, (title.length + index) * lineHeight, width, "left"));
            if (hasProgress) {
                this.drawProgress(progress, inset, (title.length + body.length) * lineHeight, width);
            }
        }

        drawProgress(progress, x, y, width) {
            const rate = Math.min(Math.max(progress, 0), 1);
            const labelWidth = this.textWidth("100%");
            const barWidth = width - labelWidth - this.itemPadding();
            const barHeight = 12;
            const barY = y + Math.floor((this.lineHeight() - barHeight) / 2);
            this.contents.fillRect(x, barY, barWidth, barHeight, ColorManager.gaugeBackColor());
            this.contents.gradientFillRect(
                x + 1, barY + 1, Math.floor((barWidth - 2) * rate), barHeight - 2,
                ColorManager.hpGaugeColor1(), ColorManager.hpGaugeColor2()
            );
            this.drawText(`${Math.floor(rate * 100)}%`, x + width - labelWidth, y, labelWidth, "right");
        }

        wrapLine(text, width) {
            const lines = [];
            let line = "";
            for (const token of text.match(/(?:[^/\s]+\/*|\/+)\s*/g) || []) {
                const word = token.trimEnd();
                if (line && this.textWidth(line + word) > width) {
                    lines.push(line.trimEnd());
                    line = "";
                }
                if (this.textWidth(word) <= width) {
                    line += token;
                    continue;
                }
                // Split words without spaces, such as Chinese text and file paths.
                for (const character of word) {
                    if (line && this.textWidth(line + character) > width) {
                        lines.push(line);
                        line = "";
                    }
                    line += character;
                }
                line += token.slice(word.length);
            }
            lines.push(line.trimEnd());
            return lines;
        }
    }

    class Window_OpenMzConfirm extends Window_HorzCommand {
        initialize(rect) {
            super.initialize(rect);
            this.openness = 0;
            this.deactivate();
        }

        maxCols() {
            return 2;
        }

        /** @param {Array<[string, string]>} commands `[label, symbol]` pairs. */
        setCommands(commands) {
            this._openMzCommands = commands;
            this.refresh();
            this.select(0);
        }

        makeCommandList() {
            for (const [label, symbol] of this._openMzCommands || []) {
                this.addCommand(label, symbol);
            }
        }
    }

    let promptHandled = false;

    const _Scene_Title_create = Scene_Title.prototype.create;
    Scene_Title.prototype.create = function() {
        _Scene_Title_create.call(this);
        if (!promptHandled) {
            this.createOpenMzUpdater();
        }
    };

    // Keep the title command window hidden while the updater is visible.
    const _Scene_Title_isBusy = Scene_Title.prototype.isBusy;
    Scene_Title.prototype.isBusy = function() {
        return Boolean(this._openMzUpdaterActive) ||
            Boolean(this._openMzMessageWindow && this._openMzMessageWindow.isClosing()) ||
            _Scene_Title_isBusy.call(this);
    };

    Scene_Title.prototype.createOpenMzUpdater = function() {
        const texts = getTexts();
        const width = Math.min(540, Graphics.boxWidth - 48);
        const x = Math.floor((Graphics.boxWidth - width) / 2);
        const close = this.closeOpenMzUpdater.bind(this);

        this._openMzUpdaterActive = true;
        this._commandWindow.deactivate();
        this._openMzMessageWindow = new Window_OpenMzMessage(new Rectangle(x, 0, width, this.calcWindowHeight(1, false)));
        this._openMzConfirmWindow = new Window_OpenMzConfirm(new Rectangle(x, 0, width, this.calcWindowHeight(1, true)));
        this._openMzConfirmWindow.setHandler("upgrade", this.runOpenMzUpgrade.bind(this));
        this._openMzConfirmWindow.setHandler("reload", reloadApplication);
        this._openMzConfirmWindow.setHandler("close", close);
        this._openMzConfirmWindow.setHandler("cancel", close);
        this.addWindow(this._openMzMessageWindow);
        this.addWindow(this._openMzConfirmWindow);

        this.showOpenMzMessage(texts.title, [texts.confirmAction, ...getSourceLines(texts), texts.confirmBackup]);
        this.showOpenMzCommands([[texts.btnUpgrade, "upgrade"], [texts.btnSkip, "close"]]);
        this._openMzMessageWindow.open();
    };

    Scene_Title.prototype.showOpenMzMessage = function(title, lines, color, progress) {
        const messageWindow = this._openMzMessageWindow;
        const confirmWindow = this._openMzConfirmWindow;
        messageWindow.setMessage(title, lines, color, progress);
        messageWindow.y = Math.floor((Graphics.boxHeight - messageWindow.height - confirmWindow.height) / 2);
        confirmWindow.y = messageWindow.y + messageWindow.height;
    };

    Scene_Title.prototype.showOpenMzCommands = function(commands) {
        this._openMzConfirmWindow.setCommands(commands);
        this._openMzConfirmWindow.open();
        this._openMzConfirmWindow.activate();
    };

    Scene_Title.prototype.runOpenMzUpgrade = async function() {
        const texts = getTexts();
        let lastRendered = "";
        const showProgress = (event) => {
            const [start, end] = PROGRESS_RANGES[event.phase];
            const rate = event.total ? Math.min(event.loaded / event.total, 1) : 0;
            const text = texts.progress[event.phase](event);
            const progress = start + (end - start) * rate;
            // Data chunks arrive far more often than the visible text changes.
            const key = `${text}|${Math.floor(progress * 100)}`;
            if (key !== lastRendered) {
                lastRendered = key;
                this.showOpenMzMessage(texts.title, [text], undefined, progress);
            }
        };
        this._openMzConfirmWindow.deactivate();
        this._openMzConfirmWindow.close();
        try {
            const result = await upgradeCoreEngine({
                manifestUrl,
                projectRoot: resolveProjectRoot(),
                pluginName,
                nodeRequire,
                onProgress: (event) => {
                    showProgress(event);
                    return waitForRender();
                },
                onDownload: showProgress,
            });
            promptHandled = true;
            this.showOpenMzMessage(texts.doneTitle, [
                texts.doneCount(result.name, result.version, result.updatedFiles.length),
                texts.doneBackup(result.backupRelativeDir),
                texts.doneHint,
            ]);
            this.showOpenMzCommands([[texts.btnReload, "reload"], [texts.btnBack, "close"]]);
        } catch (error) {
            this.showOpenMzMessage(texts.errorTitle, [error.message || String(error)], ColorManager.deathColor());
            this.showOpenMzCommands([[texts.btnRetry, "upgrade"], [texts.btnBack, "close"]]);
        }
    };

    Scene_Title.prototype.closeOpenMzUpdater = function() {
        promptHandled = true;
        this._openMzUpdaterActive = false;
        this._openMzConfirmWindow.deactivate();
        this._openMzConfirmWindow.close();
        this._openMzMessageWindow.close();
        this._commandWindow.activate();
    };
})();
