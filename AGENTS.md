# OpenMZ

RPG Maker MZ 核心引擎：使用 TypeScript class 与 PixiJS 8 维护，构建为原型式 JavaScript，兼容既有插件和工程数据。仓库采用 pnpm workspace 结构，将核心引擎、内部公共工具与插件拆分为独立子包。

## 目录

- `packages/openmz/`：OpenMZ 核心引擎包（包名 `openmz`）。
  - `src/`：唯一的引擎维护源码，包含 `main.ts`、六个 `rmmz_*.ts`、数据库协议 `data.d.ts` 和外部环境声明 `environment.d.ts`。
  - `src/libs/`：运行库覆盖目录，同名文件优先于 `vendor/js/libs/`；按文件名的特殊构建规则维护在 `runtime.ts` 的 `libraryProcessors`，其中 `pixi.js` 从 npm 打包。
  - `scripts/cli.ts`：注册并启动 Citty 命令（`build`、`pack`）。
  - `scripts/commands/build/`：`build` 命令、引擎类型擦除与运行时构建（输出至 `packages/openmz/dist/runtime/`）。
  - `scripts/commands/pack/`：`pack` 命令和核心发布产物生成（仅输出压缩包与 `manifest.json` 至 `packages/openmz/dist/release/`）。
  - `scripts/serve-manifest.ts`：提供本地更新源。
  - `tests/unit/`：引擎构建的 Vitest Node.js 测试。
  - `tests/plugin-compat/`：Vitest Browser + Playwright Chromium，对照原版和正式产物；`fixtures/` 包含可直接检出的最小游戏数据、自制 PNG、HTML 和 JavaScript 插件样本。
- `packages/build-utils/`（`@openmz-internal/build-utils`）：内部公共包（直接导出 `.ts`），提供 ast-grep 类转原型、Pixi 初始化恢复、Rolldown 打包、Oxfmt 产物格式化与通用插件构建器，含 `tests/unit/` 单元测试。
- `packages/release-spec/`（`@openmz-internal/release-spec`）：内部公共包（直接导出 `.ts`），提供发布清单、版本比较、运行时格式与 tar 归档公共协议。
- `plugins/`：独立插件子包集合，目录统一采用 kebab-case（构建产物输出为 RPG Maker 插件大驼峰命名），每个插件维护自己的 `package.json`、版本、构建脚本、`src/` 与 `tests/unit/`。
  - `plugins/openmz-updater/`（`@openmz-plugin/updater`）：更新器插件；`src/index.ts` 为 ESM 入口，`src/core.ts` 为安装逻辑，`src/ui.ts` 为标题界面，`scripts/build.ts` 构建输出 `dist/OpenMzUpdater.js`。游戏只安装构建后的 `OpenMzUpdater.js`。
- `vendor/js/`：原版 MZ 参考，勿修改。`vendor/js/libs/` 提供未在 `packages/openmz/src/libs/` 覆盖的运行库。

## 命令

使用 Node.js 24+ 与 pnpm。Node.js 直接执行工具的 `.ts` 入口。

- `pnpm build`：递归构建全部子包（OpenMZ 核心运行时与全部插件）。
- `pnpm lint` / `pnpm lint:fix`：使用 Oxlint 检查或安全修复维护源码。
- `pnpm format` / `pnpm format:check`：使用 Oxfmt 格式化或检查格式。
- `pnpm typecheck`：基于根 `tsconfig.base.json` 分别对根配置与各子包独立 `tsconfig.json` 执行严格类型检查（均保持 `noEmit`；插件通过 `include` 直接复用 `packages/openmz/src/*.ts` 全局类型，不生成第二份声明）。
- `pnpm test`：通过根 `vitest.config.ts` 执行全部 Vitest 测试项目。
- `pnpm test:unit`：递归执行各子包的 Node.js 单元测试。
- 子包命令通过 `pnpm --filter` 调用，例如 `pnpm --filter openmz build`、`pnpm --filter openmz run pack`、`pnpm --filter openmz serve:manifest`、`pnpm --filter openmz test:plugin-compat`、`pnpm --filter ./plugins/openmz-updater build`。

## 开发约定

1. 引擎 `.ts` 维持经典全局脚本，不引入 ES import/export；`packages/openmz/src/libs/pixi.js`、内部包、构建脚本和插件使用 ESM。
2. 类型直接维护在 `.ts` 签名中；JSDoc 保留用途说明。不要生成或维护第二份引擎声明，也不要恢复声明同步脚本。
3. 经 `initialize` 初始化的实例字段使用 `declare`，避免派生类字段在父构造之后重置状态。只使用可擦除的 TypeScript 语法，不使用 enum、参数属性或需要生成运行时代码的 namespace。
4. 数据类型在 `RMMZ` 命名空间。外部环境声明只连接宿主与第三方库。PixiJS 类型使用 `import("pixi.js").Type`。
5. 源码中的 `RmmzWindow`、`RmmzStorageManager` 在构建时恢复为 `Window`、`StorageManager`，类型别名仍可使用 `RMMZ.Window`、`RMMZ.StorageManager`。`GraphicsFPSCounter`、`TilemapLayer`、`TilemapCombinedLayer` 恢复为原有嵌套类。`Sprite_Name.actorName()` 和 `Window_NameEdit.inputName()` 恢复为 `name()`；其他类的 `actorName()` 保持原样。
6. 插件兼容性以 `packages/openmz/dist/runtime/` 为准。构建时让 `Sprite`、`TilingSprite`、`Window`、`Stage` 的 initialize 在现有 this 上执行 Pixi 父构造；普通 new 也必须只初始化一次。
7. `main.ts` 擦除类型后保留 `class Main`，与其他文本产物一起统一格式化。其余引擎、PixiJS 和需要兼容原版的插件类转换为平铺的函数与原型定义，不为单个类创建 IIFE 或注入严格模式。Rolldown 命名空间外壳保留，strict 设为 false。保留原生 async/await、箭头函数、可选链、解构与迭代，不做 ES5 降级。
8. 更新清单从 schemaVersion 1 开始，格式为 prototype。版本记录在 js/openmz.json；更新器不得安装 TypeScript 源码或改写工程插件配置。
9. CI 与 CD 分离。推送或 PR 到 `main` 触发 `.github/workflows/ci.yml`，并行执行静态检查、单测、构建与 Chromium 插件兼容性测试。`pnpm release` 同步核心和 `plugins/` 下各包的版本，只推送一个 `v<版本>` 标签。`.github/workflows/release.yml` 将核心压缩包、清单、`OpenMzUpdater.js` 和 `OpenMzPixi3D.js` 上传到同一个 GitHub Release。HD-2D、HD-2D Debug 和 PixelMovement 为实验插件，其构建产物内置于 `examples/hd2d/` 的独立 RMMZ 工程。
10. 不手改 dist，不维护第二份原型式源码。新增引擎语法时扩展转换与相关单元测试，并检查真实插件场景。
11. 使用 Oxlint 与 Oxfmt，不再临时运行 Prettier。引擎源码（`packages/openmz/src/*.ts`）保留四空格、双引号；工具、内部包与插件代码保留双空格、单引号。vendor、兼容性夹具与生成目录不参与 CLI 格式化；构建通过 Oxfmt API 按基础配置并使用 printWidth 120 格式化文本产物，WASM 按字节复制。
12. Oxlint 对引擎大写全局声明保留跨文件引用例外，局部未用变量继续由 TypeScript 检查。事件脚本的 eval、文本控制码正则和祖先遍历中的 this 游标是明确允许的引擎机制。
