import { compareVersions, coreScripts, isVersion, manifestSchema, runtimeFormat, statePath } from '../../shared/engine-release.js';

const MAX_REDIRECTS = 10;
const REQUEST_TIMEOUT_MS = 30000;
const TAR_BLOCK_SIZE = 512;

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
export const fetchBuffer = async (nodeRequire, targetUrl, onData) => {
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
    if (!manifest || manifest.schemaVersion !== manifestSchema) {
        throw new Error(`Expected a schemaVersion ${manifestSchema} manifest.`);
    }
    const { name, version, format, pixiVersion, archive } = manifest;
    if (name !== 'OpenMZ' || !isVersion(version) || !isVersion(pixiVersion) || format !== runtimeFormat) {
        throw new Error('Manifest must describe an OpenMZ ES5 prototype runtime and its PixiJS version.');
    }
    if (!archive || typeof archive.url !== "string" || !archive.url.trim()) {
        throw new Error("Manifest requires an archive URL.");
    }
    const { size, sha256 } = archive;
    if (!Number.isSafeInteger(size) || size <= 0) {
        throw new Error("Invalid archive size in manifest.");
    }
    if (typeof sha256 !== 'string' || !/^[\da-f]{64}$/i.test(sha256)) {
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
    return { name, version, format, pixiVersion, archive: { url: url.href, size, sha256 } };
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

export const parseTarBuffer = (buffer) => {
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

export function readInstalledVersion({ projectRoot, nodeRequire }) {
    const fs = nodeRequire('fs');
    const path = nodeRequire('path');
    let metadata;
    try {
        metadata = JSON.parse(fs.readFileSync(path.join(projectRoot, statePath), 'utf8'));
    } catch (error) {
        if (error.code === 'ENOENT') return null;
        throw error;
    }
    if (metadata.name !== 'OpenMZ' || !isVersion(metadata.version) || metadata.format !== runtimeFormat) {
        throw new Error('Invalid installed OpenMZ version metadata.');
    }
    return metadata;
}

export async function checkForUpdate({ manifestUrl, projectRoot, nodeRequire }) {
    const installed = readInstalledVersion({ projectRoot, nodeRequire });
    const manifest = parseManifest(await fetchBuffer(nodeRequire, manifestUrl));
    return {
        installed,
        manifest,
        available: !installed || compareVersions(manifest.version, installed.version) > 0,
    };
}

export async function installUpdate({
    update,
    projectRoot,
    nodeRequire,
    onProgress = () => {},
    onDownload = () => {},
}) {
    const { manifest } = update;
    const fs = nodeRequire('fs');
    const path = nodeRequire('path');
    const { archive } = manifest;
    const file = new URL(archive.url).pathname.split('/').pop();
    await onProgress({ phase: 'download', file, loaded: 0, total: archive.size });
    const { buffer } = await fetchBuffer(nodeRequire, archive.url, (loaded, total) =>
        onDownload({ phase: 'download', file, loaded, total: total || archive.size }));
    await onProgress({ phase: 'verify' });
    verifyArchive(nodeRequire, buffer, archive);
    const entries = parseTarBuffer(nodeRequire('zlib').gunzipSync(buffer));
    validateEntries(entries);
    const required = [...coreScripts.map(name => `js/${name}`), 'js/libs/pixi.js', statePath];
    for (const name of required) {
        if (!entries.some(entry => entry.relativePath === name)) {
            throw new Error(`Missing runtime file: ${name}`);
        }
    }
    const metadata = JSON.parse(entries.find(entry => entry.relativePath === statePath).content.toString('utf8'));
    if (metadata.name !== manifest.name || metadata.version !== manifest.version
        || metadata.pixiVersion !== manifest.pixiVersion || metadata.format !== manifest.format) {
        throw new Error('Runtime metadata does not match the manifest.');
    }
    await onProgress({ phase: 'apply', total: entries.length });
    const root = fs.realpathSync(projectRoot);
    const files = entries.map(({ relativePath, content }) => {
        const targetPath = path.join(root, ...relativePath.split('/'));
        return { relativePath, content, targetPath, stat: getFileStat(fs, targetPath) };
    });
    const backupDir = applyUpgrade(fs, path, root, files);
    return {
        ...metadata,
        updatedFiles: entries.map(entry => entry.relativePath),
        backupRelativeDir: path.relative(root, backupDir).replace(/\\/g, '/'),
        requiresRestart: true,
    };
}

