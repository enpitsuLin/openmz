# OpenMZ

RPG Maker MZ 核心引擎：源码使用 ES6+ class 与 PixiJS 8；正式运行时构建为 ES5 语法的原型式脚本，以兼容既有 RMMZ 插件和工程数据。

## 目录

- `src/`：完整示例工程与 class 源码。核心在 `src/js/{main,rmmz_*}.js`，仍按经典全局脚本顺序加载，不使用 ES import/export。
- `src/js/libs/`：示例工程的开发依赖。正式 PixiJS 由构建脚本从 npm 包重新打包，不直接复制此处的 PixiJS。
- `types/`：全部 `.d.ts`。`env.d.ts` 与 `rmmz_data.d.ts` 手工维护；其他引擎声明由 JSDoc 生成，不手改。
- `scripts/transform-classes.mjs`：ast-grep 转换类与原地构造，恢复四个 Pixi 边界类的 initialize 路径。
- `scripts/build.mjs`：Rolldown 打包 PixiJS 和更新器，TypeScript 降级 ES5，生成 `dist/runtime/` 与 `dist/plugins/`。
- `scripts/build-release.mjs`：仅从正式构建产物生成 `dist/release/`。
- `shared/engine-release.js`：发布清单、版本及运行时格式协议。
- `plugins/OpenMzUpdater.js`：更新器的 ESM 源码入口；`plugins/updater/` 存放检查安装核心与标题界面。只能将构建产物放入游戏。
- `tests/unit/`：Vitest Node.js 单元测试。
- `tests/plugin-compat/`：Vitest Browser + Playwright Chromium，对照原版和正式产物。
- `vendor/js/`：原版 MZ 参考，勿修改。`vendor/lib-entries/pixi.js` 为第三方打包入口。

## 命令

- `pnpm build`：构建 ES5 原型式引擎、PixiJS 8、其他依赖及更新器。
- `pnpm build:release`：构建并打包发布产物。
- `pnpm build:types` / `pnpm check:types`：生成或检查源码声明同步。
- `pnpm typecheck`：使用唯一 `tsconfig.json` 执行 `tsc --noEmit`。
- `pnpm test`：执行两个 Vitest 项目。
- `pnpm test:unit`：只执行 Node.js 项目。
- `pnpm test:plugin-compat`：只执行 Chromium 插件兼容性项目，需要本地监听端口。
- `pnpm serve:manifest`：构建并提供本地发布源。

## 开发约定

1. 核心源码维持经典全局脚本；构建工具、共享协议和更新器源码使用 ESM。
2. 核心类、方法或字段签名变化时同步 JSDoc，并执行 `build:types`、`typecheck`。
3. 数据类型与工具类型放在 `RMMZ` 命名空间；类型层的引擎 `Window`、`StorageManager` 分别暴露为 `RMMZ.Window`、`RMMZ.StorageManager`。
4. JSDoc 引用 PixiJS 类型使用 `import("pixi.js").Type`，不使用值空间的 `PIXI.Type`。
5. 源码中的 `Graphics.initialize`、`Graphics._createPixiApp`、`SceneManager.run/initialize/initGraphics` 为 async。构建负责降级其语法。
6. legacy 插件兼容性以 `dist/runtime/` 为准。构建时让 `Sprite`、`TilingSprite`、`Window`、`Stage` 的 initialize 在现有 this 上执行 Pixi 父构造；普通 new 也必须只初始化一次。
7. ES5 是语法目标，不要求为现代 Web API 提供旧浏览器 polyfill。
8. 更新清单为 schemaVersion 3，格式为 es5-prototype。版本记录在 js/openmz.json；更新器不得安装 class 源码或改写工程插件配置。
9. 不手改 dist，不维护第二份原型式源码。新增引擎语法时扩展转换与相应单元测试，并检查真实插件场景。
