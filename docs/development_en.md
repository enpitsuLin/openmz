# Development, Testing & Release Guide

[← Back to Home](../README_en.md) · [简体中文](./development.md) | **English**

## Common Commands

| Command                             | Description                                                                  |
| ----------------------------------- | ---------------------------------------------------------------------------- |
| `pnpm build`                        | Recursively build the OpenMZ core runtime and all plugins                    |
| `pnpm lint` / `pnpm lint:fix`       | Lint maintained sources with Oxlint (warnings fail) or apply safe auto-fixes |
| `pnpm format` / `pnpm format:check` | Format maintained files with Oxfmt or verify formatting                      |
| `pnpm typecheck`                    | Strictly type-check engine, internal packages, plugins, and tests            |
| `pnpm test`                         | Run all Vitest projects                                                      |
| `pnpm test:unit`                    | Recursively run Node.js unit tests across all packages                       |

Target individual packages with `pnpm --filter`:

- `pnpm --filter openmz build` / `pnpm --filter openmz run pack` / `pnpm --filter openmz serve:manifest`
- `pnpm --filter openmz test:plugin-compat`
- `pnpm --filter './plugins/*' build` / `pnpm --filter ./plugins/openmz-updater build`

## Test Suite

The root `vitest.config.ts` aggregates projects across workspace packages:

| Project          | Environment         | Coverage                                                                        |
| ---------------- | ------------------- | ------------------------------------------------------------------------------- |
| `build-utils`    | Node.js             | AST class-to-prototype transforms and Pixi initializer restoration              |
| `openmz`         | Node.js             | Engine type stripping, prototype structure, and full runtime builds             |
| `openmz-updater` | Node.js             | Manifest parsing, archive validation, downloads, install/rollback, and title UI |
| `plugin-compat`  | Playwright Chromium | Compares vanilla MZ and built runtime across plugins, UI, scenes, and rendering |

Install Chromium before running browser compatibility tests for the first time:

```sh
pnpm --filter openmz exec playwright install chromium
```

## Code Style

Configured in `.oxlintrc.json` and `.oxfmtrc.json`:

- Engine sources (`packages/openmz/src/*.ts`) use 4-space indentation and double quotes.
- Internal packages, tooling, plugins, and tests use 2-space indentation and single quotes.
- `vendor/`, compatibility fixtures, and `dist/` directories are excluded from source linting and CLI formatting.

## CI & Release Workflow

- **Continuous Integration (CI)**: Pushes and pull requests targeting `main` trigger the [CI workflow](../.github/workflows/ci.yml), running `lint`, `format:check`, `typecheck`, `test:unit`, and `build` in parallel with the Playwright Chromium plugin compatibility suite.
- **Core Releases (CD)**: Pushing a `v*` tag (or manually triggering [Release OpenMZ Core](../.github/workflows/release-core.yml)) runs `pnpm --filter openmz run pack` and publishes the core archive and `manifest.json` to GitHub Releases.
- **Independent Plugin Releases (CD)**: Pushing a `plugin/<dir>@v<version>` tag (for example `plugin/openmz-updater@v1.0.0`, or manually triggering [Release Plugin](../.github/workflows/release-plugin.yml)) verifies the plugin's `package.json` version, builds the plugin, and publishes `plugins/<dir>/dist/*.js` as an independent GitHub Release.
