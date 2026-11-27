# OpenMZ

用 TypeScript 与 ES6 class 维护的 RPG Maker MZ 引擎核心。构建时生成原型式 JavaScript 引擎与 PixiJS 8，使既有插件能够通过 `prototype`、`.call(this)` 和 `initialize` 扩展引擎。

## 构建与使用

使用 Node.js 24 或更新版本：

```sh
pnpm install
pnpm build
```

构建生成：

| 目录                | 内容                                                    |
| ------------------- | ------------------------------------------------------- |
| `dist/runtime/js/`  | 核心脚本、原型式 PixiJS 8、其他运行依赖与 `openmz.json` |
| `dist/plugins/*.js` | 每个插件独立生成的可安装脚本                            |

将 `dist/runtime/js/` 的内容复制到 RPG Maker MZ 工程的 `js/` 目录。产物不包含 `plugins.js` 和 `plugins/`，工程原有的插件配置、数据库、素材和存档保持原样。

`src/` 只维护引擎 TypeScript 源码、类型协议和 `lib/pixi.js` 打包入口。示例工程资源与插件样本位于 `tests/plugin-compat/fixtures/`；测试服务器会将它们与正式构建产物组合加载。

## 构建方式

1. Node.js 擦除 `src/{main,rmmz_*}.ts` 的类型；`declare` 字段不生成赋值，保留 `initialize` 的原有初始化顺序。构建脚本、共享协议、更新器和测试也直接维护为 TypeScript。
2. Rolldown 通过 `src/lib/pixi.js` 从安装的 `pixi.js` 包生成浏览器全局 `PIXI`，其他第三方运行库从 `vendor/libs/` 复制。
3. ast-grep 将引擎与 PixiJS 的 class 转换为平铺的函数、原型方法及属性描述符，不为每个类生成 IIFE 或添加严格模式。类表达式使用唯一的内部绑定，保留构造函数名称和自身引用。`main.ts` 只擦除类型，产出的 `main.js` 保留 `class Main`。
4. 构建时将 `Sprite`、`TilingSprite`、`Window`、`Stage` 的 PixiJS 初始化移入 `initialize`。普通 `new` 与旧插件的 `initialize.call(this)` 都在同一个对象上初始化一次。
5. 生成 `js/openmz.json`，记录引擎版本、PixiJS 版本及产物格式。单元测试检查类型擦除、原型结构、现代语法保留，以及没有引入 TypeScript 降级辅助函数。
6. 写入前通过 Oxfmt JavaScript API，按项目基础配置并将产物 `printWidth` 设为 120，统一格式化引擎、PixiJS、更新器和其他文本产物；WASM 保持原始字节。发布清单也使用同一格式化入口。

派生构造函数使用 `.call` / `.apply`，不通过 `Reflect.construct` 替换对象。方法可以枚举，访问器不可枚举。转换后的函数采用原版原型式引擎的非严格模式语义。Rolldown 保留 PixiJS 与更新器的命名空间外壳，并关闭严格模式指令输出。其余现代语法（包括 async/await、箭头函数、可选链、解构和迭代）保留原样，不进行 ES5 语法降级。类型直接写在维护源码中，不再生成或同步另一份引擎 `.d.ts`。`src/data.d.ts` 定义数据库、存档及事件协议；`environment.d.ts` 连接浏览器、NW.js 与第三方库。

## 测试

Vitest 包含两个项目：

| 项目            | 环境                | 范围                                                   |
| --------------- | ------------------- | ------------------------------------------------------ |
| `unit`          | Node.js             | AST 转换、原型式构建、版本检查、发布包、安装及回滚     |
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

插件源码按插件名分目录，当前更新器结构为：

```text
plugins/
└── OpenMzUpdater/
    ├── index.ts
    ├── core.ts
    ├── ui.ts
    └── __test__/
        └── updater.test.ts
```

每个插件以自己的 `index.ts` 为入口，内部可继续按功能拆分子目录。插件测试放在对应的 `__test__/` 下，由 `pnpm test:unit` 自动发现。

```sh
pnpm build:plugins
pnpm build:plugins OpenMzUpdater
```

插件构建会自动发现 `plugins/` 下各插件目录，保留中英文插件元数据，输出为 `dist/plugins/<插件名>.js`。也可以传入插件名仅构建指定插件。

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

首次发布的清单使用 `schemaVersion: 1`。

| 字段             | 内容                               |
| ---------------- | ---------------------------------- |
| `name`           | `OpenMZ`                           |
| `version`        | 引擎语义版本                       |
| `format`         | `prototype`                        |
| `pixiVersion`    | 打包的 PixiJS 版本                 |
| `archive.url`    | 核心 `tar.gz` 地址，可使用相对路径 |
| `archive.size`   | 压缩包字节数，必填                 |
| `archive.sha256` | 压缩包 SHA-256，必填               |

相对压缩包地址以清单重定向链中原站最后一个地址为基准，支持 GitHub Release 的标签跳转与 CDN 下载。

### 本地更新源

```sh
pnpm serve:manifest
```

构建发布包并在 `http://127.0.0.1:4173/manifest.json` 提供更新源。将插件清单地址设为该地址即可在编辑器中测试。支持 `--port 8080`，以及使用已有发布包的 `--no-build`。

## 开发命令

| 命令                          | 作用                                                   |
| ----------------------------- | ------------------------------------------------------ |
| `pnpm build`                  | 构建完整运行时与全部插件                               |
| `pnpm build:runtime`          | 仅构建引擎、PixiJS 与其他运行依赖                      |
| `pnpm build:plugins [插件名]` | 独立构建全部插件或指定插件                             |
| `pnpm build:release`          | 生成运行时压缩包、清单与全部插件                       |
| `pnpm lint`                   | 使用 Oxlint 检查维护源码，警告也视为失败               |
| `pnpm lint:fix`               | 应用 Oxlint 的安全自动修复                             |
| `pnpm format`                 | 使用 Oxfmt 格式化维护源码与配置                        |
| `pnpm format:check`           | 检查格式，供 CI 使用                                   |
| `pnpm typecheck`              | 严格检查引擎、构建脚本、更新器及测试的 TypeScript 类型 |
| `pnpm test`                   | 执行两个 Vitest 项目                                   |
| `pnpm serve:manifest`         | 提供本地更新源                                         |

Oxlint 与 Oxfmt 的配置分别位于 `.oxlintrc.json`、`.oxfmtrc.json`。引擎保留四空格缩进与双引号，工具代码使用双空格与单引号；第三方库、兼容性夹具和生成目录不参与源码检查或 CLI 格式化；构建流程会通过 API 格式化生成的文本产物。

发布流程从标签或 `--version` 取得版本，保证包内记录与清单一致。推送 `v*` 标签后，GitHub Actions 会完成类型检查、两个项目的测试，再将 `dist/release/` 中的产物上传到 Release。

## 目录

| 路径                   | 内容                                                          |
| ---------------------- | ------------------------------------------------------------- |
| `src/`                 | TypeScript class 引擎源码、数据库协议及外部环境类型           |
| `src/lib/pixi.js`      | PixiJS 的 npm 打包入口                                        |
| `vendor/libs/`         | Effekseer、Pako、LocalForage 和 Vorbis 等第三方运行库         |
| `scripts/`             | TypeScript 类型擦除、AST 转换、构建、发布和本地服务器         |
| `shared/`              | 构建与更新器共用的发布协议                                    |
| `plugins/`             | 按插件名分目录，包含各插件的入口与内部模块                    |
| `tests/unit/`          | 引擎构建的 Node.js 单元测试                                   |
| `tests/plugin-compat/` | 浏览器插件测试；`fixtures/` 存放示例工程资源、HTML 和插件样本 |
| `vendor/js/`           | 原版 MZ 运行时参考                                            |
| `dist/`                | 自动生成的运行时、插件和发布产物                              |

## 许可证

[MIT](./LICENSE) © enpitsulin
