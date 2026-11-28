# OpenMzUpdater

[← Back to Home](../../README_en.md) · [简体中文](./README.md) | **English**

Official updater plugin for OpenMZ that checks, downloads, verifies, and installs OpenMZ core runtime updates inside NW.js.

## Installation & Usage

1. Download `OpenMzUpdater.js` from a `plugin/openmz-updater@v*` release on [GitHub Releases](https://github.com/enpitsuLin/openmz/releases) (or build `dist/OpenMzUpdater.js` from source) and copy it into your RPG Maker MZ project's `js/plugins/` directory.
2. Enable `OpenMzUpdater` in the Plugin Manager and configure **Manifest URL**:
   - Latest release: `https://github.com/enpitsuLin/openmz/releases/latest/download/manifest.json`
   - Pinned release: `https://github.com/enpitsuLin/openmz/releases/download/<tag>/manifest.json`
3. Start a playtest from the RPG Maker MZ editor. When the title screen first opens, the plugin checks for updates in the background and prompts you to install if a newer version is available. Restart the game after installation to apply the update.

## Safety Guarantees

When the title scene first opens in NW.js, `OpenMzUpdater` fetches the configured manifest and compares its semantic version against `js/openmz.json`:

- **Non-Intrusive Checks**: Skips prompts in browser environments, when Manifest URL is empty, or when the installed version is already up to date or newer. The plugin remains enabled, never modifies `js/plugins.js`, and rejects archives containing `js/plugins/` entries.
- **Pre-Install Verification**: Validates archive byte size, SHA-256 digest, entry path safety, and in-archive version metadata before touching project files.
- **Automatic Backup & Rollback**: Backs up replaced files to `js_backup/<timestamp>/` prior to installation. Any failure automatically restores modified files and `js/openmz.json`.
- **Manual Restore**: Copy the `js/` files from the corresponding backup directory back into your project. If that update was your first migration from vanilla MZ to OpenMZ, also delete `js/openmz.json`.

## Release Manifest Schema

Release manifests use `schemaVersion: 1`, defined in [`packages/release-spec/src/index.ts`](../../packages/release-spec/src/index.ts):

| Field            | Type     | Description                                 |
| ---------------- | -------- | ------------------------------------------- |
| `schemaVersion`  | `1`      | Manifest schema version                     |
| `name`           | `string` | Always `OpenMZ`                             |
| `version`        | `string` | Engine semantic version                     |
| `format`         | `string` | Runtime format, always `prototype`          |
| `pixiVersion`    | `string` | Bundled PixiJS version                      |
| `archive.url`    | `string` | Core `tar.gz` URL (supports relative paths) |
| `archive.size`   | `number` | Archive size in bytes (required)            |
| `archive.sha256` | `string` | Archive SHA-256 checksum (required)         |

> [!TIP]
> Relative `archive.url` values are resolved against the final same-origin URL in the manifest redirect chain, supporting GitHub Releases tag redirects and CDN downloads out of the box.

## Building & Local Debugging

```sh
# Build this plugin (emits dist/OpenMzUpdater.js)
pnpm --filter ./plugins/openmz-updater build

# Pack a core release and serve locally (default: http://127.0.0.1:4173/manifest.json)
pnpm --filter openmz serve:manifest

# Custom port or reuse existing packages/openmz/dist/release/ without rebuilding
pnpm --filter openmz serve:manifest --port 8080 --no-build
```

## Directory Structure

```text
plugins/openmz-updater/
├── package.json             # Independent version, dependencies & scripts
├── scripts/build.ts         # Uses @openmz-internal/build-utils to emit dist/OpenMzUpdater.js
├── src/
│   ├── index.ts             # Plugin entry point & EN/ZH metadata headers
│   ├── core.ts              # Update orchestration
│   ├── manifest.ts          # Manifest fetching & validation
│   ├── package-validator.ts # Archive path & version checks
│   ├── installer.ts         # Backup, installation & rollback
│   ├── transport.ts         # HTTP download & redirect handling
│   ├── tar.ts               # tar.gz extraction
│   ├── errors.ts / types.ts # Error definitions & shared types
│   └── ui.ts & ui/          # Title scene UI & i18n
└── tests/
    └── unit/                # Vitest unit tests
```
