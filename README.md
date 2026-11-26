# OpenMZ

OpenMZ 是 RPG Maker MZ 运行时引擎的现代化改造项目：在保持既有 RMMZ 插件与工程数据兼容的前提下，将核心脚本升级为 ES6+ Class 与 PixiJS 8 架构。

## 功能

- **现代化核心运行时**：`rmmz_core` / `rmmz_managers` / `rmmz_objects` / `rmmz_scenes` / `rmmz_sprites` / `rmmz_windows` 与 `main.js` 全部改写为 ES6+ Class，仍以经典 `<script>` 全局脚本方式加载，兼容既有插件。
- **PixiJS 8 渲染层**：渲染管线迁移至 PixiJS 8 API。
- **完整类型声明**：`types/` 下提供数据库、存档、全局对象及引擎类的 TypeScript 声明（由 JSDoc 自动生成）。
- **在线升级插件 `OpenMzUpdater`**：在任意 RPG Maker MZ 工程中一键下载并替换为 OpenMZ 核心脚本，自动备份、校验与回滚。

## 使用插件获取 OpenMZ 核心

`OpenMzUpdater.js` 可以把一个现有的 RPG Maker MZ 工程的 `js/` 核心脚本升级为 OpenMZ。

### 1. 下载插件

从 [GitHub Releases](https://github.com/enpitsuLin/openmz/releases) 下载 `OpenMzUpdater.js`，放入工程的 `js/plugins/` 目录。

> [!IMPORTANT]
> 升级前请先备份整个工程，或确认工程已纳入版本管理。

### 2. 配置插件

在 RPG Maker MZ 编辑器的「插件管理器」中添加 `OpenMzUpdater`，并设置参数：

| 参数 | 说明 |
| --- | --- |
| `manifestUrl`（Manifest 地址） | 更新清单 `manifest.json` 的地址。留空时插件不做任何事。 |

常用地址：

- 最新正式版：`https://github.com/enpitsuLin/openmz/releases/latest/download/manifest.json`
- 指定版本：`https://github.com/enpitsuLin/openmz/releases/download/<tag>/manifest.json`（例如 `v2.0.0-rc.0`）

### 3. 运行升级

1. 在编辑器中点击「测试游戏」（或运行 NW.js 桌面版）。
2. 进入标题画面时会弹出升级提示，显示来源地址和目标版本。
3. 选择「确认升级」，插件会依次：
   1. 读取更新清单；
   2. 下载核心压缩包（带进度条）；
   3. 校验大小与 SHA-256 并解压；
   4. 备份原脚本并替换核心文件。
4. 完成后选择「立即重启」即可使用新版引擎；选择「暂不升级」则本次会话不再提示。

升级失败时会显示错误原因，可直接「重试」。

### 升级会做什么

- 仅写入工程的 `js/` 目录；**不会**覆盖 `js/plugins.js` 和 `js/plugins/` 下的插件。
- 被替换的原文件备份到 `js_backup/<时间戳>/`。
- 任一文件写入失败时，已替换的文件会全部回滚。
- 升级成功后，插件会在 `js/plugins.js` 中把自己设为关闭，避免重复提示。之后如需再次升级，在插件管理器中重新启用即可。

### 恢复原版

把 `js_backup/<时间戳>/js/` 中的文件复制回工程的 `js/` 目录即可。

> [!NOTE]
> 插件依赖 Node.js 文件系统接口，仅在 NW.js 环境（编辑器测试游戏 / 桌面版）生效；浏览器或移动端部署时插件会直接跳过。

## Manifest 格式

```json
{
  "schemaVersion": 2,
  "name": "OpenMZ",
  "version": "2.0.0",
  "archive": {
    "url": "openmz-core-2.0.0.tar.gz",
    "size": 123456,
    "sha256": "<64 位十六进制>"
  }
}
```

- `archive.url` 可以是相对地址，相对于清单所在位置解析（经过重定向时，按原始站点上的最后一个地址解析，例如 GitHub Release 的 tag 目录）。
- `size`、`sha256` 可选，填写后会在安装前校验。
- 压缩包为 `tar.gz`，其中的文件路径须以 `js/` 开头。

## 开发

需要 Node.js 与 [pnpm](https://pnpm.io/)。

```sh
pnpm install
```

| 命令 | 说明 |
| --- | --- |
| `pnpm build:pixi` | 重新打包 `src/js/libs/pixi.js` |
| `pnpm build:types` | 从 `src/js/*.js` 的 JSDoc 生成 `types/*.d.ts` |
| `pnpm check:types` | 检查 `types/*.d.ts` 是否与源码同步 |
| `pnpm typecheck` | 运行 `tsc --noEmit` |
| `pnpm test:release` | 运行打包与升级流程测试 |
| `pnpm test:plugin-compat` | 运行 Chromium 插件兼容性测试 |
| `pnpm build:release` | 在 `dist/release/` 生成核心压缩包、`manifest.json` 与 `OpenMzUpdater.js` |
| `pnpm serve:manifest` | 构建并在 `http://127.0.0.1:4173/manifest.json` 提供本地更新源 |

### 本地测试升级

```sh
pnpm serve:manifest            # 可加 --port 8080 或 --no-build
```

然后把插件的 `manifestUrl` 设为 `http://127.0.0.1:4173/manifest.json`，在编辑器中测试游戏即可。

### 发布

推送 `v*` 标签后，GitHub Actions 会构建并把 `openmz-core-<version>.tar.gz`、`manifest.json`、`OpenMzUpdater.js` 上传到对应的 Release。

## 目录结构

```text
src/       可直接运行的示例工程与 OpenMZ 核心运行时（src/js/）
plugins/   OpenMzUpdater 插件源码
types/     TypeScript 类型声明
scripts/   类型生成、发布打包与本地更新源脚本
tests/     发布流程与插件兼容性测试
vendor/    原版 RPG Maker MZ 运行时参考
```

## 许可证

[MIT](./LICENSE) © enpitsulin
