# OpenMzUpdater

[← 返回首页](../../README.md) · **简体中文** | [English](./README_en.md)

OpenMZ 官方更新器插件，用于在 NW.js 环境中安全检查、下载并安装 OpenMZ 核心运行时更新。

## 安装与使用

1. 从 [GitHub Releases](https://github.com/enpitsuLin/openmz/releases) 的 `plugin/openmz-updater@v*` 发布页下载 `OpenMzUpdater.js`（或自行构建 `dist/OpenMzUpdater.js`），放入 RPG Maker MZ 工程的 `js/plugins/` 目录。
2. 在插件管理器中启用 `OpenMzUpdater`，并将**更新清单地址**配置为：
   - 最新正式版：`https://github.com/enpitsuLin/openmz/releases/latest/download/manifest.json`
   - 指定版本：`https://github.com/enpitsuLin/openmz/releases/download/<tag>/manifest.json`
3. 在 RPG Maker MZ 编辑器中点击「测试游戏」。首次进入标题画面时，插件会在后台检查版本，发现新版本时会提示安装。安装完成后，重启游戏即可生效。

## 安全保障

首次进入标题画面时，`OpenMzUpdater` 会拉取清单并与工程的 `js/openmz.json` 比对语义版本：

- **非侵入式检查**：浏览器环境、清单地址留空、版本相同或目标版本更旧时均不弹窗提示；插件保持启用状态，永不改写 `js/plugins.js`，也拒绝安装包含 `js/plugins/` 路径的更新包。
- **安装前严格校验**：依次校验压缩包字节大小、SHA-256 摘要、条目路径合法性及包内版本元数据。
- **自动备份与回滚**：替换前将原有文件备份至 `js_backup/<时间戳>/`；安装过程中任意步骤失败，都会自动还原已写入的文件与 `js/openmz.json`。
- **手动恢复备份**：如需回退，将对应备份目录中的 `js/` 文件覆盖回工程；若该次更新是首次从原版 MZ 升级到 OpenMZ，还需删除 `js/openmz.json`。

## 发布清单协议

发布清单当前使用 `schemaVersion: 1`，结构定义位于 [`packages/release-spec/src/index.ts`](../../packages/release-spec/src/index.ts)：

| 字段             | 类型     | 说明                             |
| ---------------- | -------- | -------------------------------- |
| `schemaVersion`  | `1`      | 清单协议版本号                   |
| `name`           | `string` | 固定为 `OpenMZ`                  |
| `version`        | `string` | 引擎语义版本号                   |
| `format`         | `string` | 运行时格式，固定为 `prototype`   |
| `pixiVersion`    | `string` | 打包的 PixiJS 版本号             |
| `archive.url`    | `string` | 核心 `tar.gz` 地址，支持相对路径 |
| `archive.size`   | `number` | 压缩包字节数（必填）             |
| `archive.sha256` | `string` | 压缩包 SHA-256 校验值（必填）    |

> [!TIP]
> 当 `archive.url` 为相对路径时，解析基准为清单重定向链中原站最后一个地址，天然兼容 GitHub Releases 的标签跳转与 CDN 分发。

## 构建与本地调试

```sh
# 单独构建本插件（输出 dist/OpenMzUpdater.js）
pnpm --filter ./plugins/openmz-updater build

# 构建核心发布包并启动本地更新源（默认 http://127.0.0.1:4173/manifest.json）
pnpm --filter openmz serve:manifest

# 指定端口或跳过构建直接使用已有 packages/openmz/dist/release/
pnpm --filter openmz serve:manifest --port 8080 --no-build
```

## 目录结构

```text
plugins/openmz-updater/
├── package.json             # 独立版本号、依赖与脚本
├── scripts/build.ts         # 调用 @openmz-internal/build-utils 输出 dist/OpenMzUpdater.js
├── src/
│   ├── index.ts             # 插件入口与中英文元数据声明
│   ├── core.ts              # 更新编排核心
│   ├── manifest.ts          # 清单拉取与校验
│   ├── package-validator.ts # 压缩包路径与版本校验
│   ├── installer.ts         # 备份、安装与回滚
│   ├── transport.ts         # 网络下载与重定向处理
│   ├── tar.ts               # tar.gz 解包
│   ├── errors.ts / types.ts # 错误类型与公共类型
│   └── ui.ts & ui/          # 标题界面与多语言交互
└── tests/
    └── unit/                # Vitest 单元测试
```
