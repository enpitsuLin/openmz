# 开发、测试与发布指南

[← 返回首页](../README.md) · **简体中文** | [English](./development_en.md)

## 常用命令

| 命令                                | 说明                                                   |
| ----------------------------------- | ------------------------------------------------------ |
| `pnpm build`                        | 递归构建 OpenMZ 核心运行时与全部插件                   |
| `pnpm lint` / `pnpm lint:fix`       | 使用 Oxlint 检查源码（警告视为错误）或执行安全自动修复 |
| `pnpm format` / `pnpm format:check` | 使用 Oxfmt 格式化源码或检查格式                        |
| `pnpm typecheck`                    | 使用严格模式检查引擎、内部包、插件与测试的 TypeScript  |
| `pnpm test`                         | 运行全部 Vitest 测试项目                               |
| `pnpm test:unit`                    | 递归运行各子包的 Node.js 单元测试                      |

单包操作直接通过 `pnpm --filter` 执行：

- `pnpm --filter openmz build` / `pnpm --filter openmz run pack` / `pnpm --filter openmz serve:manifest`
- `pnpm --filter openmz test:plugin-compat`
- `pnpm --filter './plugins/*' build` / `pnpm --filter ./plugins/openmz-updater build`

## 测试体系

根 `vitest.config.ts` 聚合各子包的测试项目：

| 项目             | 运行环境            | 覆盖范围                                                      |
| ---------------- | ------------------- | ------------------------------------------------------------- |
| `build-utils`    | Node.js             | AST 类转原型、Pixi 初始化恢复等公共转换工具                   |
| `openmz`         | Node.js             | 引擎类型擦除、原型结构与完整运行时构建                        |
| `openmz-updater` | Node.js             | 清单解析、压缩包校验、传输重试、安装回滚与标题 UI 集成        |
| `plugin-compat`  | Playwright Chromium | 使用最小工程夹具对照原版 MZ 与构建产物测试插件、UI 与渲染表现 |

首次运行浏览器兼容性测试前，需先安装 Chromium：

```sh
pnpm --filter openmz exec playwright install chromium
```

## 代码规范

由 `.oxlintrc.json` 与 `.oxfmtrc.json` 统一约束：

- 引擎源码（`packages/openmz/src/*.ts`）保留四空格缩进与双引号。
- 内部包、工具链、插件与测试代码采用双空格缩进与单引号。
- `vendor/`、兼容性夹具与各包 `dist/` 不参与源码检查与 CLI 格式化。

## CI 与发布流程

在干净的工作区运行 `pnpm release`，选择并确认版本。核心、更新器和 OpenMzPixi3D 会升到同一版本并生成一个提交。命令会创建 `v<版本>`、`plugin/openmz-updater@v<版本>` 和 `plugin/openmz-pixi-3d@v<版本>`，一次推送到 `origin` 以触发下方的发布工作流。

- **持续集成（CI）**：推送或发起 PR 至 `main` 时触发 [CI 工作流](../.github/workflows/ci.yml)，并行执行 `lint`、`format:check`、`typecheck`、`test:unit`、`build` 以及 Playwright Chromium 插件兼容性测试。
- **核心发布（CD）**：推送 `v*` 标签（或手动触发 [Release OpenMZ Core 工作流](../.github/workflows/release-core.yml)）后，GitHub Actions 执行 `pnpm --filter openmz run pack`，将核心压缩包与 `manifest.json` 上传至 GitHub Release。
- **插件独立发布（CD）**：推送 `plugin/<插件目录>@v<版本>` 标签（例如 `plugin/openmz-updater@v1.0.0`，或手动触发 [Release Plugin 工作流](../.github/workflows/release-plugin.yml)）后，GitHub Actions 校验对应插件 `package.json` 版本并构建，将 `plugins/<插件目录>/dist/*.js` 发布为独立的 GitHub Release。
