# OpenMZ

RPG Maker MZ 运行时引擎的现代化改造项目，在保持既有 RMMZ 插件与工程数据兼容的前提下，将引擎升级为现代 ES6+ Class 与 PixiJS 8 架构。

## 目录结构

- `src/`：可直接运行的完整游戏项目与引擎运行时（仅放运行时文件，不放 `.d.ts`）
  - `src/js/rmmz_*.js`、`src/js/main.js`：现代化后的核心运行时源码（经典浏览器全局脚本，通过 JSDoc 维护类型）
  - `src/js/libs/`：第三方浏览器依赖产物（其中 `pixi.js` 由 Rolldown 打包生成）
  - `src/js/plugins.js`：插件配置入口（全局 `var $plugins`）
  - `src/data/`、`src/img/`、`src/audio/`、`src/effects/`、`src/fonts/`：示例工程资源与数据库 JSON
- `types/`：集中存放项目 TypeScript 类型声明
  - `types/env.d.ts`：运行时全局库声明（`PIXI`、`effekseer`、`pako`、`localforage`、`vorbis`、`nw`、浏览器扩展等，手工维护）
  - `types/rmmz_data.d.ts`：数据库 JSON、存档、配置、事件指令、`$data*`/`$game*`/`$plugins` 全局类型与 `RMMZ` 命名空间（手工维护）
  - `types/{main,rmmz_core,rmmz_managers,rmmz_objects,rmmz_sprites,rmmz_windows,rmmz_scenes}.d.ts`：由 `src/js/*.js` 的 JSDoc 自动生成，**不要手改**
- `scripts/build-dts.mjs`：基于 TypeScript Compiler API 从 `src/js/*.js` 生成/校验 `types/*.d.ts` 的脚本
- `tests/plugin-compat/`：基于 Vitest Browser + Playwright (Chromium) 的插件兼容性浏览器端测试
- `vendor/`：原版 RPG Maker MZ 运行时参考（`vendor/js/`）与第三方打包入口（`vendor/lib-entries/pixi.js`）；`vendor/js/` 仅作对照参考，勿直接修改

## 技术栈与命令

- 包管理器：`pnpm`（ESM 项目，`"type": "module"`）
- 核心依赖：`pixi.js` 8.x、`rolldown`、`typescript` 6.x、`vitest` + `@vitest/browser-playwright`
- 常用命令：
  - `pnpm build:pixi`：通过 `rolldown.config.js` 重新打包 `src/js/libs/pixi.js`（IIFE，全局 `PIXI`）
  - `pnpm build:types`：从 `src/js/*.js` 的 JSDoc 重新生成 `types/*.d.ts`
  - `pnpm check:types`：检查 `types/*.d.ts` 是否与 `src/js/*.js` 保持同步
  - `pnpm typecheck`：使用唯一配置文件 `tsconfig.json` 运行 `tsc --noEmit`
  - `pnpm test:plugin-compat`：运行 Chromium 浏览器插件兼容性测试（需要本地监听端口）

## 开发与类型约定

1. **运行时加载模式**：`src/js/{rmmz_*,main,plugins}.js` 以经典 `<script>` 顺序加载并暴露到全局作用域，勿在其中引入 ES `import`/`export` 语法。
2. **类型单一数据源**：修改 `src/js/*.js` 的类、方法或字段签名时，同步更新对应 JSDoc，然后运行 `pnpm build:types` 与 `pnpm typecheck`。
3. **全局命名空间避冲突**：
   - 所有数据类型与工具类型位于全局 `declare namespace RMMZ`（在 JSDoc 中使用 `RMMZ.DataActor`、`RMMZ.ParamID` 等）。
   - 为避免与 `lib.dom.d.ts` 冲突，引擎 `Window` 与 `StorageManager` 在类型层暴露为 `RMMZ.Window`、`RMMZ.StorageManager`。
   - 在 JSDoc 中引用 PixiJS 8 类型时使用 `import("pixi.js").<Type>`，不要使用值空间的 `PIXI.<Type>`。
4. **PixiJS 8 差异**：`Graphics.initialize`、`Graphics._createPixiApp`、`SceneManager.{run,initialize,initGraphics}` 为 `async` 方法；渲染层已迁移至 PixiJS 8 API（`TextureSource`、`ContainerChild`、`Renderer`、`Ticker`、`RenderContainer`、`GlProgram` 等）。
