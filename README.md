# OpenMZ

用 ES6 class 维护的 RPG Maker MZ 引擎核心。构建时生成原型式引擎与 PixiJS 8，使既有插件能够通过 `prototype`、`.call(this)` 和 `initialize` 扩展引擎。

## 构建与使用

```sh
pnpm install
pnpm build
```

构建生成：

| 目录 | 内容 |
| --- | --- |
| `dist/runtime/js/` | 核心脚本、原型式 PixiJS 8、其他运行依赖与 `openmz.json` |
| `dist/plugins/OpenMzUpdater.js` | 可直接安装的单文件更新插件 |

将 `dist/runtime/js/` 的内容复制到 RPG Maker MZ 工程的 `js/` 目录。产物不包含 `plugins.js` 和 `plugins/`，工程原有的插件配置、数据库、素材和存档保持原样。

`src/` 保留完整的示例工程及 class 源码。运行 legacy 插件时应使用构建产物；插件兼容性测试会自动将构建脚本与示例工程资源组合加载。

## 构建方式

1. Rolldown 从安装的 `pixi.js` 包生成浏览器全局 `PIXI`。
2. ast-grep 将引擎与 PixiJS 的 class 转换为函数、原型方法及属性描述符。
3. 构建时将 `Sprite`、`TilingSprite`、`Window`、`Stage` 的 PixiJS 初始化移入 `initialize`。普通 `new` 与旧插件的 `initialize.call(this)` 都在同一个对象上初始化一次。
4. 生成 `js/openmz.json`，记录引擎版本、PixiJS 版本及产物格式。单元测试检查原型结构、现代语法保留，以及没有引入 TypeScript 降级辅助函数。

派生构造函数使用 `.call` / `.apply`，不通过 `Reflect.construct` 替换对象。方法可以枚举，访问器不可枚举。其余现代语法（包括 async/await、箭头函数、可选链、解构和迭代）保留原样，不进行 ES5 语法降级。TypeScript 仅用于类型检查与声明生成。

## 测试

Vitest 包含两个项目：

| 项目 | 环境 | 范围 |
| --- | --- | --- |
| `unit` | Node.js | AST 转换、原型式构建、版本检查、发布包、安装及回滚 |
| `plugin-compat` | Playwright Chromium | 对照原版 MZ 与正式产物测试插件、窗口、场景、精灵和渲染 |

```sh
pnpm test
pnpm test:unit
pnpm test:plugin-compat
```

首次运行浏览器测试时安装 Chromium：

```sh
pnpm exec playwright install chromium
```

## 更新插件

1. 将构建或 Release 中的 `OpenMzUpdater.js` 放入工程的 `js/plugins/`。
2. 在编辑器的插件管理器中启用它，配置“更新清单地址”。
3. 在 NW.js 中启动游戏。首次进入标题画面时，插件在后台读取清单并比较版本。
4. 有新版本时显示当前版本与目标版本。选择“更新”后下载、校验、备份并安装。
5. 安装成功后重启生效。插件保持启用，后续启动会继续检查新版本。

清单地址可以使用：

- 最新正式版：`https://github.com/enpitsuLin/openmz/releases/latest/download/manifest.json`
- 指定版本：`https://github.com/enpitsuLin/openmz/releases/download/<tag>/manifest.json`

更新器通过 `js/openmz.json` 识别已安装版本；版本相同或目标更旧时不提示安装。更新器不会改写 `js/plugins.js`，也不会在更新包中接受 `js/plugins/` 的文件。浏览器环境或空清单地址下不检查更新。

安装前必须通过压缩包大小、SHA-256、路径及包内版本校验。被替换文件保存在 `js_backup/<时间戳>/`，任何替换失败都会恢复已修改的文件和版本记录。

恢复备份时，将对应备份中的 `js/` 文件复制回工程；若该次更新首次安装 OpenMZ，还需删除工程的 `js/openmz.json` 以恢复原版版本状态。

### 发布清单

当前使用 `schemaVersion: 3`，不接受旧清单格式。

| 字段 | 内容 |
| --- | --- |
| `name` | `OpenMZ` |
| `version` | 引擎语义版本 |
| `format` | `prototype` |
| `pixiVersion` | 打包的 PixiJS 版本 |
| `archive.url` | 核心 `tar.gz` 地址，可使用相对路径 |
| `archive.size` | 压缩包字节数，必填 |
| `archive.sha256` | 压缩包 SHA-256，必填 |

相对压缩包地址以清单重定向链中原站最后一个地址为基准，支持 GitHub Release 的标签跳转与 CDN 下载。

### 本地更新源

```sh
pnpm serve:manifest
```

构建发布包并在 `http://127.0.0.1:4173/manifest.json` 提供更新源。将插件清单地址设为该地址即可在编辑器中测试。支持 `--port 8080`，以及使用已有发布包的 `--no-build`。

## 开发命令

| 命令 | 作用 |
| --- | --- |
| `pnpm build` | 构建完整运行时与更新插件 |
| `pnpm build:release` | 从构建产物生成发布压缩包、清单与更新插件 |
| `pnpm build:types` | 从源码 JSDoc 生成类型声明 |
| `pnpm check:types` | 检查类型声明是否同步 |
| `pnpm typecheck` | 执行 TypeScript 类型检查 |
| `pnpm test` | 执行两个 Vitest 项目 |
| `pnpm serve:manifest` | 提供本地更新源 |

发布流程从标签或 `--version` 取得版本，保证包内记录与清单一致。推送 `v*` 标签后，GitHub Actions 会完成类型检查、两个项目的测试，再将 `dist/release/` 中的产物上传到 Release。

## 目录

| 路径 | 内容 |
| --- | --- |
| `src/` | 示例工程、ES6 class 核心源码与开发依赖 |
| `types/` | 数据类型、环境声明及自动生成的引擎声明 |
| `scripts/` | AST 转换、构建、类型生成、发布和本地服务器 |
| `shared/` | 构建与更新器共用的发布协议 |
| `plugins/` | 更新插件的 ESM 入口、安装核心与标题界面 |
| `tests/unit/` | Node.js 单元测试 |
| `tests/plugin-compat/` | 浏览器插件测试与原版插件样本 |
| `vendor/` | 原版 MZ 参考及第三方打包入口 |
| `dist/` | 自动生成的运行时、插件和发布产物 |

## 许可证

[MIT](./LICENSE) © enpitsulin
