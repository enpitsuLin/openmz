# OpenMZ

RPG Maker MZ 核心引擎：使用 TypeScript class 与 PixiJS 8 维护，构建为原型式 JavaScript，兼容既有插件和工程数据。

## 目录

- `src/`：唯一的引擎维护源码，根目录包含 `main.ts`、六个 `rmmz_*.ts`、数据库协议 `data.d.ts` 和外部环境声明 `environment.d.ts`。
- `src/lib/pixi.js`：PixiJS 的 npm 打包入口；不保留预打包的开发副本。
- `scripts/emit-engine.ts`：只擦除 TypeScript 类型，并恢复浏览器运行时的类名、嵌套类及方法名。
- `scripts/transform-classes.ts`：ast-grep 转换类与原地构造，恢复四个 Pixi 边界类的 initialize 路径。
- `scripts/build.ts`：组合引擎与插件构建。
- `scripts/build-runtime.ts`：生成 `dist/runtime/`。
- `scripts/build-plugins.ts`：独立构建全部或指定插件，自动发现 `plugins/<插件名>/index.ts`，生成 `dist/plugins/`。
- `scripts/build-utils.ts`：共用的项目路径、Rolldown 打包和 Oxfmt 产物格式化。
- `scripts/build-release.ts`：仅从正式构建产物生成 `dist/release/`。
- `shared/engine-release.ts`：发布清单、版本、运行时格式与压缩包条目的公共协议。
- `plugins/`：每个插件使用独立目录，入口统一为 `plugins/<插件名>/index.ts`，内部可按模块继续分层，测试放在插件自己的 `__test__/` 目录。
- `plugins/OpenMzUpdater/`：更新器插件；`index.ts` 为 ESM 入口，`core.ts` 为安装逻辑，`ui.ts` 为标题界面。游戏只安装构建后的 `OpenMzUpdater.js`。
- `tests/unit/`：引擎构建的 Vitest Node.js 测试。`unit` 项目同时自动发现 `plugins/**/__test__/**/*.test.ts`。
- `tests/plugin-compat/`：Vitest Browser + Playwright Chromium，对照原版和正式产物；`fixtures/` 存放示例工程资源、HTML 和 JavaScript 插件样本，素材沿用原有忽略规则。
- `vendor/js/`：原版 MZ 参考，勿修改。
- `vendor/libs/`：正式运行时需要复制的第三方浏览器库与 WASM。

## 命令

使用 Node.js 24+ 与 pnpm。Node.js 直接执行工具的 `.ts` 入口。

- `pnpm build`：构建引擎、PixiJS 8、其他依赖及全部插件。
- `pnpm build:runtime`：仅构建运行时。
- `pnpm build:plugins [插件名]`：仅构建全部或指定插件。
- `pnpm build:release`：构建并打包运行时、清单与全部插件。
- `pnpm lint` / `pnpm lint:fix`：使用 Oxlint 检查或安全修复维护源码。
- `pnpm format` / `pnpm format:check`：使用 Oxfmt 格式化或检查格式。
- `pnpm typecheck`：使用唯一 `tsconfig.json`，严格检查全部维护源码与测试。
- `pnpm test`：执行两个 Vitest 项目。
- `pnpm test:unit`：只执行 Node.js 项目。
- `pnpm test:plugin-compat`：只执行 Chromium 插件兼容性项目，需要本地监听端口。
- `pnpm serve:manifest`：构建并提供本地发布源。

## 开发约定

1. 引擎 `.ts` 维持经典全局脚本，不引入 ES import/export；`src/lib/pixi.js`、工具、共享协议和更新器使用 ESM。
2. 类型直接维护在 `.ts` 签名中；JSDoc 保留用途说明。不要生成或维护第二份引擎声明，也不要恢复声明同步脚本。
3. 经 `initialize` 初始化的实例字段使用 `declare`，避免派生类字段在父构造之后重置状态。只使用可擦除的 TypeScript 语法，不使用 enum、参数属性或需要生成运行时代码的 namespace。
4. 数据类型在 `RMMZ` 命名空间。外部环境声明只连接宿主与第三方库。PixiJS 类型使用 `import("pixi.js").Type`。
5. 源码中的 `RmmzWindow`、`RmmzStorageManager` 在构建时恢复为 `Window`、`StorageManager`，类型别名仍可使用 `RMMZ.Window`、`RMMZ.StorageManager`。`GraphicsFPSCounter`、`TilemapLayer`、`TilemapCombinedLayer` 恢复为原有嵌套类。`Sprite_Name.actorName()` 和 `Window_NameEdit.inputName()` 恢复为 `name()`；其他类的 `actorName()` 保持原样。
6. 插件兼容性以 `dist/runtime/` 为准。构建时让 `Sprite`、`TilingSprite`、`Window`、`Stage` 的 initialize 在现有 this 上执行 Pixi 父构造；普通 new 也必须只初始化一次。
7. `main.ts` 擦除类型后保留 `class Main`，与其他文本产物一起统一格式化。其余引擎、PixiJS 和更新器的类转换为平铺的函数与原型定义，不为单个类创建 IIFE 或注入严格模式。Rolldown 命名空间外壳保留，strict 设为 false。保留原生 async/await、箭头函数、可选链、解构与迭代，不做 ES5 降级。
8. 更新清单从 schemaVersion 1 开始，格式为 prototype。版本记录在 js/openmz.json；更新器不得安装 TypeScript 源码或改写工程插件配置。
9. 不手改 dist，不维护第二份原型式源码。新增引擎语法时扩展转换与相关单元测试，并检查真实插件场景。
10. 使用 Oxlint 与 Oxfmt，不再临时运行 Prettier。引擎源码保留四空格、双引号；工具代码保留双空格、单引号。vendor、兼容性夹具与生成目录不参与 CLI 格式化；构建通过 Oxfmt API 按基础配置并使用 printWidth 120 格式化文本产物，WASM 按字节复制。
11. Oxlint 对引擎大写全局声明保留跨文件引用例外，局部未用变量继续由 TypeScript 检查。事件脚本的 eval、文本控制码正则和祖先遍历中的 this 游标是明确允许的引擎机制。
