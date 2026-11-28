# OpenMZ

RPG Maker MZ core engine maintained with TypeScript `class` syntax and PixiJS 8, compiled to a prototype-based JavaScript runtime compatible with existing plugins and project data.

[![Release](https://img.shields.io/github/v/release/enpitsuLin/openmz?include_prereleases&label=Release)](https://github.com/enpitsuLin/openmz/releases)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D24-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PixiJS](https://img.shields.io/badge/PixiJS-8.x-E72264)](https://pixijs.com/)
[![License](https://img.shields.io/github/license/enpitsuLin/openmz)](./LICENSE)

[简体中文](./README.md) | **English**

---

## Highlights

- **Modern TypeScript Source**: Core engine authored with TypeScript `class` declarations and full database, save, event, and host type definitions.
- **PixiJS 8 Rendering Core**: Bundles PixiJS 8 from npm into a prototype-based global `PIXI`.
- **Legacy Plugin Compatibility**: Transforms classes into flat constructor functions and prototype methods via ast-grep without ES5 downleveling, supporting `prototype` overrides and `initialize` chaining.
- **Decoupled Plugin Workspace**: Organizes core engine and plugins in a pnpm workspace, shipping [`OpenMzUpdater`](./plugins/openmz-updater/README_en.md) for safe NW.js updates with verification, backups, and automatic rollback.

## Quick Start

### Using in an RPG Maker MZ Project

#### Option 1: Install via Updater Plugin (Recommended)

1. Download `OpenMzUpdater.js` from a `plugin/openmz-updater@v*` release on [GitHub Releases](https://github.com/enpitsuLin/openmz/releases) and place it in your project's `js/plugins/` directory.
2. Enable `OpenMzUpdater` in the Plugin Manager and set **Manifest URL** to:
   - Latest release: `https://github.com/enpitsuLin/openmz/releases/latest/download/manifest.json`
   - Pinned release: `https://github.com/enpitsuLin/openmz/releases/download/<tag>/manifest.json`
3. Start a playtest from the RPG Maker MZ editor. When the title screen first opens, the plugin checks for updates in the background and prompts you to install if a newer version is available. Restart the game after installation to apply the update.

See the [OpenMzUpdater documentation](./plugins/openmz-updater/README_en.md) for safety guarantees, backup restoration, and the release manifest schema.

#### Option 2: Manual Runtime Installation

Download the core archive from Releases or build from source, then copy all contents of `packages/openmz/dist/runtime/js/` into your RPG Maker MZ project's `js/` directory.

> [!NOTE]
> The runtime output excludes `plugins.js` and `plugins/`. Your existing plugin configuration, database, assets, and save files remain untouched.

### Building from Source

Requires Node.js 24+ and pnpm:

```sh
pnpm install
pnpm build
```

Main build outputs:

- `packages/openmz/dist/runtime/js/`: Core engine scripts, prototype-based PixiJS 8, runtime libs, and `openmz.json`
- `packages/openmz/dist/release/`: Core release archive and `manifest.json` generated via `pnpm --filter openmz run pack`
- `plugins/<plugin-dir>/dist/*.js`: Standalone installable scripts built by each plugin package

## Development & Testing

| Command                             | Description                                       |
| ----------------------------------- | ------------------------------------------------- |
| `pnpm build`                        | Build the OpenMZ core runtime and all plugins     |
| `pnpm lint` / `pnpm lint:fix`       | Lint sources with Oxlint or apply safe auto-fixes |
| `pnpm format` / `pnpm format:check` | Format files with Oxfmt or verify formatting      |
| `pnpm typecheck`                    | Strictly type-check all workspace packages        |
| `pnpm test`                         | Run all Vitest projects                           |
| `pnpm test:unit`                    | Run Node.js unit tests across all packages        |

See the [Development & Release Guide](./docs/development_en.md) for package-scoped commands, browser compatibility testing, code style, and CI/CD workflows.

## Project Structure

```text
.
├── packages/
│   ├── openmz/           # Core engine source, build/pack scripts, and tests
│   ├── build-utils/      # Internal utilities: AST prototype transform, Rolldown bundling & formatting
│   └── release-spec/     # Internal spec: release manifest, semver, and tar archive protocol
├── plugins/
│   └── openmz-updater/   # Updater plugin package (emits dist/OpenMzUpdater.js)
└── vendor/js/            # Vanilla RPG Maker MZ reference and default libs (read-only)
```

## Documentation

- [Plugin Compatibility & PixiJS Migration](./docs/plugin-compatibility_en.md)
- [Build Pipeline & Transformation Rules](./docs/architecture_en.md)
- [OpenMzUpdater Plugin](./plugins/openmz-updater/README_en.md)
- [Development, Testing & Release Guide](./docs/development_en.md)

## License

[MIT](./LICENSE) © enpitsulin
