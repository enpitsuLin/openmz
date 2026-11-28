# 插件兼容性

[← 返回首页](../README.md) · **简体中文** | [English](./plugin-compatibility_en.md)

OpenMZ 在构建产物中保留了 RPG Maker MZ 的全局原型结构与引擎接口（详见[构建原理](./architecture.md)），同时将底层渲染内核从原版的 **PixiJS 5.3.12**（[原版 PixiJS](../vendor/js/libs/pixi.js#L2)）升级为 **PixiJS 8.23.0**（[依赖版本](../pnpm-workspace.yaml#L14)）。

> [!TIP]
> 在游戏控制台中查看 `PIXI.VERSION` 即可确认当前运行的 PixiJS 版本。若需同时兼容原版 MZ 与 OpenMZ，可根据 `PIXI.VERSION` 或目标 API 的存在性做特性检测。

## 兼容边界概览

### 默认兼容：RPG Maker MZ 引擎层

绝大多数依赖引擎高层接口与传统原型扩展方式的插件可以直接运行：

- **原型方法覆写**：如包装 `Game_Player.prototype.increaseSteps` 等场景、数据与精灵方法。
- **插件参数与指令**：`PluginManager.parameters()` 与 `PluginManager.registerCommand()` 保持原版语义。
- **传统子类构造**：如通过 `Sprite.prototype.initialize.call(this, bitmap)` 初始化旧式子类。
- **标准引擎对象**：仅使用 `Bitmap`、`Sprite`、`Window_Base`、`Scene_Base` 等引擎 API 的插件，可直接沿用原有配置。

### 需要适配：PixiJS 与渲染底层

以下两类插件需要对照下文进行迁移或双版本适配：

- 直接调用 PixiJS v5 已移除或签名变更的 API（如旧版 `PIXI.Filter`、`PIXI.Loader`、`RenderTexture.create(w, h)` 等）。
- 深入引擎渲染内部实现（如覆写 `updateTransform()` / `render()`、修改 `Window.prototype.drawShape`、扩展 `Tilemap.Renderer`）的插件。

---

## PixiJS 5 → 8 迁移参考

### 速查表

| 领域           | 原版 MZ (PixiJS 5)                                 | OpenMZ (PixiJS 8)                                                    | 引擎参考实现                                                          |
| -------------- | -------------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 模糊滤镜       | `PIXI.filters.BlurFilter`                          | `PIXI.BlurFilter`                                                    | —                                                                     |
| 自定义着色器   | `new PIXI.Filter(vert, frag, uniforms)`            | `new PIXI.Filter({ glProgram, resources })`                          | [`ColorFilter`](../packages/openmz/src/rmmz_core.ts#L4273)            |
| 离屏纹理创建   | `RenderTexture.create(w, h)`                       | `RenderTexture.create({ width, height })`                            | [`Bitmap.snap`](../packages/openmz/src/rmmz_core.ts#L1200)            |
| 离屏渲染与提取 | `renderer.render(stage, target)`                   | `renderer.render({ container, target })` / `extract.canvas()`        | [`Bitmap.snap`](../packages/openmz/src/rmmz_core.ts#L1200)            |
| 混合模式       | 数字 `0–3` 或字符串                                | `PIXI.Sprite` 与 `TilingSprite` 需使用字符串；`Sprite` 兼容 `0–3`    | [`Sprite#blendMode`](../packages/openmz/src/rmmz_core.ts#L1819)       |
| 逐帧渲染钩子   | 覆写子对象 `updateTransform()` / `render()`        | 挂载 `onRender`                                                      | [`WindowLayer`](../packages/openmz/src/rmmz_core.ts#L3990)            |
| 窗口遮挡遮罩   | `Window.prototype.drawShape`                       | `openBounds()` 与矩形遮罩                                            | [`WindowLayer`](../packages/openmz/src/rmmz_core.ts#L3990)            |
| 瓦片地图批处理 | `Tilemap.Renderer` / `renderer.plugins.rpgtilemap` | 基于 `PIXI.Mesh` 的 `TilemapLayer`                                   | [`TilemapLayer`](../packages/openmz/src/rmmz_core.ts#L2829)           |
| 位图底层纹理   | `bitmap.baseTexture`                               | `bitmap.textureSource`（刷新调用 `textureSource.update()`）          | [`Bitmap#textureSource`](../packages/openmz/src/rmmz_core.ts#L1242)   |
| 资源加载器     | `PIXI.Loader.shared.add(...)`                      | `await PIXI.Assets.load(url)`                                        | —                                                                     |
| 交互系统       | `renderer.plugins.interaction`                     | `renderer.events` 与显示对象事件（拖拽移出监听 `globalpointermove`） | —                                                                     |
| 应用初始化     | 同步 `new PIXI.Application(options)`               | `const app = new PIXI.Application(); await app.init(options)`        | [`Graphics._createPixiApp`](../packages/openmz/src/rmmz_core.ts#L952) |
| 粒子容器       | `ParticleContainer.addChild(sprite)`               | 使用 `Particle` 与 `addParticle()`                                   | —                                                                     |

### 1. 滤镜与着色器

- **内置滤镜命名空间**：`PIXI.filters.BlurFilter` 已移至 `PIXI.BlurFilter`。
- **自定义 WebGL 滤镜**：旧式 `new PIXI.Filter(vertex, fragment, uniforms)` 在 PixiJS 8 中可能构造成功但不会产生渲染效果。请改用 `GlProgram.from({ vertex, fragment })` 创建程序，并在 `resources` 中显式声明 uniform 类型：

```js
// PixiJS 5
const filter = new PIXI.Filter(vert, frag, { uTime: 0 });

// PixiJS 8 (OpenMZ)
const glProgram = PIXI.GlProgram.from({ vertex: vert, fragment: frag });
const filter = new PIXI.Filter({
  glProgram,
  resources: {
    customUniforms: {
      uTime: { value: 0, type: 'f32' },
    },
  },
});
```

参考实现：[`ColorFilter`](../packages/openmz/src/rmmz_core.ts#L4273)。

### 2. 截图与离屏渲染

优先使用引擎提供的 `Bitmap.snap(stage)` 获取场景截图。若插件需要直接调用 PixiJS 进行离屏渲染，必须使用对象参数形式；位置参数形式（如 `RenderTexture.create(8, 8)` 或 `renderer.render(container, target)`）在 PixiJS 8 中会导致纹理尺寸异常（退化为 `1×1`）或目标纹理保持透明：

```js
// PixiJS 8 (OpenMZ)
const renderTexture = PIXI.RenderTexture.create({ width, height });
renderer.render({ container: stage, target: renderTexture });
const canvas = renderer.extract.canvas(renderTexture);
```

参考实现：[`Bitmap.snap`](../packages/openmz/src/rmmz_core.ts#L1200)。

### 3. 混合模式

- **引擎 `Sprite`**：保留了对数字 `0–3` 的兼容，setter 会将其映射为 `"normal"`、`"add"`、`"multiply"` 或 `"screen"`（其余数字回退为 `"normal"`），getter 统一返回字符串。
- **`PIXI.Sprite` 与引擎 `TilingSprite`**：直接赋值数字（如 `blendMode = 1`）不会触发加色等混合效果，必须使用字符串（例如 `"add"`）。

> [!NOTE]
> 贡献者在维护 `packages/openmz/src/rmmz_core.ts` 中的 [`Sprite#blendMode`](../packages/openmz/src/rmmz_core.ts#L1819) 时，需保留数字到字符串的兼容映射，避免破坏依赖数字常量的既有插件。

### 4. 渲染钩子、窗口遮罩与瓦片地图

- **渲染钩子**：PixiJS 8 在常规场景遍历时不再调用子对象覆写的 `updateTransform()` 或 `render()`。需要在每次渲染前执行的逻辑，应挂载到显示对象的 `onRender` 回调。
- **窗口遮挡**：原版 MZ 通过 `Window.prototype.drawShape` 实现窗口遮罩；OpenMZ 的 [`WindowLayer`](../packages/openmz/src/rmmz_core.ts#L3990) 改用 `openBounds()` 与矩形遮罩，并通过 `this.onRender` 更新。
- **瓦片地图**：原版 `Tilemap.Renderer` 与 `renderer.plugins.rpgtilemap` 已移除。修改瓦片批处理或自定义着色器的插件，需要适配基于 `PIXI.Mesh` 的 [`TilemapLayer`](../packages/openmz/src/rmmz_core.ts#L2829)。

### 5. 纹理与资源加载

- **Bitmap 纹理源**：引擎将 `Bitmap.baseTexture` 替换为 `Bitmap.textureSource`（[`Bitmap#textureSource`](../packages/openmz/src/rmmz_core.ts#L1242)）。向 Bitmap 的 Canvas 直接绘图后，调用 `bitmap.textureSource.update()` 通知 PixiJS 刷新纹理。
- **`PIXI.Texture.baseTexture`**：实例仍保留 `baseTexture` getter，指向 `texture.source`。
- **异步资源加载**：`PIXI.Loader` 的 `.add()` 与 `.shared` 已移除，且直接对未缓存 URL 调用 `Texture.from(url)` 会返回 `null`。请改用 `PIXI.Assets`：

```js
// PixiJS 8 (OpenMZ)
const texture = await PIXI.Assets.load(url);
```

### 6. 交互与拖拽

- `interactive = true` 与 `event.data.getLocalPosition()` 在当前版本仍可正常使用。
- 依赖 `renderer.plugins.interaction` 的代码需迁移至 `renderer.events` 与显示对象事件；详见 [PixiJS v8 事件文档](https://pixijs.com/8.x/guides/components/events)。
- 拖拽过程中需要在指针移出对象边界后继续追踪时，应监听 `globalpointermove`。

### 7. 应用、Ticker 与粒子

- **应用初始化**：自行创建 `PIXI.Application` 的插件必须等待 `await app.init(options)` 完成后再访问 `app.renderer`（参考 [`Graphics._createPixiApp`](../packages/openmz/src/rmmz_core.ts#L952)）。
- **Ticker 回调**：回调参数变为 `Ticker` 实例而非数值时间增量，通过 `ticker.deltaTime` 读取帧间隔。
- **粒子容器**：`ParticleContainer.addChild(sprite)` 会抛出异常，需改用 `Particle` 与 `addParticle()`。

更多通用升级细节可参考 [PixiJS v8 官方迁移指南](https://pixijs.com/8.x/guides/migrations/v8)。

---

## 兼容性验证与测试

### 自动化测试（面向贡献者）

OpenMZ 使用 Playwright Chromium 对照原版 MZ 与 OpenMZ 构建产物运行端到端兼容性测试，覆盖：

- 插件参数读取与 `PluginManager.registerCommand()` 指令执行
- 角色钩子（`Game_Player` 原型扩展）
- 文字图片渲染与点击交互
- 菜单与存读档界面布局
- 传统 `initialize.call(this)` 原型继承构造
- `Bitmap.snap()` 离屏截图与像素读取

运行测试（详细环境要求见[开发与测试指南](./development.md#测试体系)）：

```sh
pnpm --filter openmz test:plugin-compat
```

测试实现见 [`plugin-compat.test.ts`](../packages/openmz/tests/plugin-compat/plugin-compat.test.ts)。

### 发布前检查清单（面向插件与游戏开发者）

即使核心接口与自动化测试通过，复杂渲染插件仍可能受目标运行环境影响。游戏发布前建议在目标 **NW.js** 或浏览器环境中重点验证以下场景：

- 自定义滤镜与着色器（含强制 WebGL 1 回退模式下的表现）
- 场景截图与离屏渲染（如菜单背景模糊）
- 跨区域指针拖拽与自定义交互事件
- 粒子效果与 Effekseer 动画叠加渲染
