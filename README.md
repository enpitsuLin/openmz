# OpenMZ

使用 TypeScript `class` 与 PixiJS 8 维护的 RPG Maker MZ 核心引擎，构建为原型式 JavaScript 运行时，兼容既有插件与工程数据。

[![Release](https://img.shields.io/github/v/release/enpitsuLin/openmz?include_prereleases&label=Release)](https://github.com/enpitsuLin/openmz/releases)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D24-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PixiJS](https://img.shields.io/badge/PixiJS-8.x-E72264)](https://pixijs.com/)
[![License](https://img.shields.io/github/license/enpitsuLin/openmz)](./LICENSE)

**简体中文** | [English](./README_en.md)

---

## 核心特性

- **现代 TypeScript 源码**：引擎以 TypeScript `class` 编写，自带完整的数据库、存档、事件与宿主类型声明。
- **PixiJS 8 渲染内核**：从 npm 打包 PixiJS 8 并转为原型式全局 `PIXI`，升级渲染能力的同时兼容既有插件。
- **传统插件兼容**：通过 ast-grep 将类转为平铺函数与原型方法，保留现代 JS 语法，完整支持 `prototype` 覆写与 `initialize` 链式扩展。
- **独立插件子包**：采用 pnpm workspace 解耦核心引擎与插件，配套 [`OpenMzUpdater`](./plugins/openmz-updater/README.md) 支持在 NW.js 中安全校验、备份与自动回滚更新。

## 快速开始

### 在 RPG Maker MZ 工程中使用

#### 方式一：使用更新器插件（推荐）

1. 从 [GitHub Releases](https://github.com/enpitsuLin/openmz/releases) 的 `plugin/openmz-updater@v*` 发布页下载 `OpenMzUpdater.js`，放入工程的 `js/plugins/` 目录。
2. 在插件管理器中启用 `OpenMzUpdater`，将**更新清单地址**设为：
   - 最新正式版：`https://github.com/enpitsuLin/openmz/releases/latest/download/manifest.json`
   - 指定版本：`https://github.com/enpitsuLin/openmz/releases/download/<tag>/manifest.json`
3. 在 NW.js 中启动游戏，首次进入标题画面时将自动检查并提示更新，安装完成后重启生效。

更多安全机制、备份恢复与清单协议说明，见 [OpenMzUpdater 文档](./plugins/openmz-updater/README.md)。

#### 方式二：手动安装运行时

从 Release 下载核心压缩包，或从源码构建后，将 `packages/openmz/dist/runtime/js/` 中的全部内容复制到 RPG Maker MZ 工程的 `js/` 目录。

> [!NOTE]
> 运行时产物不包含 `plugins.js` 与 `plugins/`，工程原有的插件配置、数据库、素材与存档均保持不变。

### 从源码构建

需要 Node.js 24+ 与 pnpm：

```sh
pnpm install
pnpm build
```

主要构建产物：

- `packages/openmz/dist/runtime/js/`：核心脚本、原型式 PixiJS 8、其他运行库与 `openmz.json`
- `packages/openmz/dist/release/`：执行 `pnpm --filter openmz run pack` 生成的发布压缩包与 `manifest.json`
- `plugins/<plugin-dir>/dist/*.js`：各插件子包独立构建的可安装插件脚本

## 开发与测试

| 命令                                | 说明                          |
| ----------------------------------- | ----------------------------- |
| `pnpm build`                        | 构建核心运行时与全部插件      |
| `pnpm lint` / `pnpm lint:fix`       | 使用 Oxlint 检查或自动修复    |
| `pnpm format` / `pnpm format:check` | 使用 Oxfmt 格式化或检查格式   |
| `pnpm typecheck`                    | 严格检查全仓 TypeScript 类型  |
| `pnpm test`                         | 运行全部 Vitest 测试项目      |
| `pnpm test:unit`                    | 运行各子包的 Node.js 单元测试 |

更多单包命令、浏览器兼容性测试、代码规范与发版流程，见 [开发与发布指南](./docs/development.md)。

## 目录结构

```text
.
├── packages/
│   ├── openmz/           # 核心引擎源码、构建/打包脚本与测试
│   ├── build-utils/      # 内部工具：AST 原型转换、Rolldown 打包与格式化
│   └── release-spec/     # 内部协议：发布清单、版本比较与 tar 归档
├── plugins/
│   └── openmz-updater/   # 更新器插件子包（输出 dist/OpenMzUpdater.js）
└── vendor/js/            # 原版 RPG Maker MZ 参考与默认运行库（只读）
```

## 更多文档

- [构建原理与转换规则](./docs/architecture.md)
- [OpenMzUpdater 更新器插件](./plugins/openmz-updater/README.md)
- [开发、测试与发布指南](./docs/development.md)

## 许可证

[MIT](./LICENSE) © enpitsulin
