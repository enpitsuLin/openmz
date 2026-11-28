# Plugin Compatibility

[← Back to Home](../README_en.md) · [简体中文](./plugin-compatibility.md) | **English**

OpenMZ preserves RPG Maker MZ’s global prototype structure and engine APIs in its build output (see [Build Pipeline](./architecture_en.md)), while upgrading the underlying rendering kernel from vanilla **PixiJS 5.3.12** ([Vanilla PixiJS](../vendor/js/libs/pixi.js#L2)) to **PixiJS 8.23.0** ([OpenMZ dependency version](../pnpm-workspace.yaml#L14)).

> [!TIP]
> Check `PIXI.VERSION` in the game console to confirm the running PixiJS version. If your plugin targets both vanilla MZ and OpenMZ, use `PIXI.VERSION` or feature detection to branch where needed.

## Compatibility Overview

### Compatible by Default: RPG Maker MZ Engine Layer

Most plugins built on high-level engine APIs and traditional prototype extensions work out of the box:

- **Prototype overrides**: Wrapping methods on `Game_Player.prototype.increaseSteps`, scenes, data objects, and sprites.
- **Parameters and commands**: `PluginManager.parameters()` and `PluginManager.registerCommand()` keep vanilla semantics.
- **Legacy subclassing**: Initializing subclasses via `Sprite.prototype.initialize.call(this, bitmap)`.
- **Standard engine objects**: Plugins using `Bitmap`, `Sprite`, `Window_Base`, and `Scene_Base` can be tested with their existing configuration first.

### Adaptation Required: PixiJS & Rendering Internals

Two categories of plugins require migration or dual-version handling:

- Plugins that directly call PixiJS v5 APIs removed or changed in v8 (such as legacy `PIXI.Filter`, `PIXI.Loader`, or `RenderTexture.create(w, h)`).
- Plugins that hook into internal engine rendering details (such as overriding `updateTransform()` / `render()`, `Window.prototype.drawShape`, or `Tilemap.Renderer`).

---

## PixiJS 5 → 8 Migration Reference

### Quick Reference

| Area                | Vanilla MZ (PixiJS 5)                          | OpenMZ (PixiJS 8)                                              | Engine Reference                                          |
| ------------------- | ---------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------- |
| Blur filter         | `PIXI.filters.BlurFilter`                      | `PIXI.BlurFilter`                                              | —                                                         |
| Custom shaders      | `new PIXI.Filter(vert, frag, uniforms)`        | `new PIXI.Filter({ glProgram, resources })`                    | [`ColorFilter`](../packages/openmz/src/rmmz_core.ts#L4273) |
| Offscreen textures  | `RenderTexture.create(w, h)`                   | `RenderTexture.create({ width, height })`                      | [`Bitmap.snap`](../packages/openmz/src/rmmz_core.ts#L1200) |
| Offscreen rendering | `renderer.render(stage, target)`               | `renderer.render({ container, target })` / `extract.canvas()`  | [`Bitmap.snap`](../packages/openmz/src/rmmz_core.ts#L1200) |
| Blend modes         | Numeric `0–3` or string                        | String required for `PIXI.Sprite` & `TilingSprite`; `Sprite` accepts `0–3` | [`Sprite#blendMode`](../packages/openmz/src/rmmz_core.ts#L1819) |
| Per-render hooks    | Override `updateTransform()` / `render()`      | Assign `onRender`                                              | [`WindowLayer`](../packages/openmz/src/rmmz_core.ts#L3990) |
| Window masking      | `Window.prototype.drawShape`                   | `openBounds()` and rectangular masks                           | [`WindowLayer`](../packages/openmz/src/rmmz_core.ts#L3990) |
| Tilemap batching    | `Tilemap.Renderer` / `renderer.plugins.rpgtilemap` | `PIXI.Mesh`-based `TilemapLayer`                           | [`TilemapLayer`](../packages/openmz/src/rmmz_core.ts#L2829) |
| Bitmap texture      | `bitmap.baseTexture`                           | `bitmap.textureSource` (call `textureSource.update()` to flush) | [`Bitmap#textureSource`](../packages/openmz/src/rmmz_core.ts#L1242) |
| Asset loading       | `PIXI.Loader.shared.add(...)`                  | `await PIXI.Assets.load(url)`                                  | —                                                         |
| Interaction         | `renderer.plugins.interaction`                 | `renderer.events` & display object events (`globalpointermove` for drag) | —                                               |
| App initialization  | Synchronous `new PIXI.Application(options)`    | `const app = new PIXI.Application(); await app.init(options)`  | [`Graphics._createPixiApp`](../packages/openmz/src/rmmz_core.ts#L952) |
| Particle containers | `ParticleContainer.addChild(sprite)`           | Use `Particle` and `addParticle()`                             | —                                                         |

### 1. Filters and Shaders

- **Built-in filter namespace**: Replace `PIXI.filters.BlurFilter` with `PIXI.BlurFilter`.
- **Custom WebGL filters**: Calling `new PIXI.Filter(vertex, fragment, uniforms)` can construct a filter in PixiJS 8 without applying any rendering effect. Create the program with `GlProgram.from({ vertex, fragment })` and declare uniform types in `resources`:

```js
// PixiJS 5
const filter = new PIXI.Filter(vert, frag, { uTime: 0 });

// PixiJS 8 (OpenMZ)
const glProgram = PIXI.GlProgram.from({ vertex: vert, fragment: frag });
const filter = new PIXI.Filter({
    glProgram,
    resources: {
        customUniforms: {
            uTime: { value: 0, type: "f32" },
        },
    },
});
```

Reference: [`ColorFilter`](../packages/openmz/src/rmmz_core.ts#L4273).

### 2. Snapshots and Offscreen Rendering

Prefer the engine’s `Bitmap.snap(stage)` for scene snapshots. When calling PixiJS directly for offscreen rendering, use options objects; positional arguments (such as `RenderTexture.create(8, 8)` or `renderer.render(container, target)`) produce a `1×1` texture or leave the target transparent in PixiJS 8:

```js
// PixiJS 8 (OpenMZ)
const renderTexture = PIXI.RenderTexture.create({ width, height });
renderer.render({ container: stage, target: renderTexture });
const canvas = renderer.extract.canvas(renderTexture);
```

Reference: [`Bitmap.snap`](../packages/openmz/src/rmmz_core.ts#L1200).

### 3. Blend Modes

- **Engine `Sprite`**: Accepts numeric values `0–3` and maps them to `"normal"`, `"add"`, `"multiply"`, or `"screen"` (other numeric values fall back to `"normal"`). Reading `blendMode` returns the string value.
- **`PIXI.Sprite` and engine `TilingSprite`**: Setting numeric values such as `blendMode = 1` will not apply additive blending. Always assign string values (for example, `"add"`).

> [!NOTE]
> When maintaining [`Sprite#blendMode`](../packages/openmz/src/rmmz_core.ts#L1819) in `packages/openmz/src/rmmz_core.ts`, contributors must preserve the numeric-to-string mapping so existing plugins using numeric constants continue to work.

### 4. Render Hooks, Window Masking, and Tilemaps

- **Render hooks**: PixiJS 8 skips child overrides of `updateTransform()` and `render()` during normal scene traversal. Attach per-render updates to the display object’s `onRender` callback instead.
- **Window occlusion**: Vanilla MZ uses `Window.prototype.drawShape` for window masking. OpenMZ’s [`WindowLayer`](../packages/openmz/src/rmmz_core.ts#L3990) uses `openBounds()` and rectangular masks, updated via `this.onRender`.
- **Tilemaps**: `Tilemap.Renderer` and `renderer.plugins.rpgtilemap` have been removed. Plugins that customize tile batching or shaders need to adapt to the `PIXI.Mesh`-based [`TilemapLayer`](../packages/openmz/src/rmmz_core.ts#L2829).

### 5. Textures and Asset Loading

- **Bitmap texture source**: `Bitmap.baseTexture` has been replaced by `Bitmap.textureSource` ([`Bitmap#textureSource`](../packages/openmz/src/rmmz_core.ts#L1242)). After drawing directly to a bitmap’s canvas, call `bitmap.textureSource.update()` to notify PixiJS.
- **`PIXI.Texture.baseTexture`**: `PIXI.Texture` instances still expose `baseTexture` as a getter pointing to `texture.source`.
- **Async asset loading**: `PIXI.Loader.prototype.add()` and `PIXI.Loader.shared` are gone, and calling `Texture.from(url)` on an uncached URL returns `null`. Use `PIXI.Assets` instead:

```js
// PixiJS 8 (OpenMZ)
const texture = await PIXI.Assets.load(url);
```

### 6. Interaction and Dragging

- `interactive = true` and `event.data.getLocalPosition()` remain functional.
- Migrate code that accesses `renderer.plugins.interaction` to `renderer.events` and display object events; see the [PixiJS v8 events guide](https://pixijs.com/8.x/guides/components/events).
- Listen for `globalpointermove` when dragging needs to keep tracking the pointer after it leaves the target object.

### 7. Application, Ticker, and Particles

- **Application initialization**: Plugins creating their own `PIXI.Application` must `await app.init(options)` before accessing `app.renderer` (see [`Graphics._createPixiApp`](../packages/openmz/src/rmmz_core.ts#L952)).
- **Ticker callbacks**: Callbacks receive the `Ticker` instance rather than a numeric delta; read `ticker.deltaTime`.
- **Particle containers**: `ParticleContainer.addChild(sprite)` throws; use `Particle` and `addParticle()`.

For general upgrade details, refer to the [PixiJS v8 migration guide](https://pixijs.com/8.x/guides/migrations/v8).

---

## Verification and Testing

### Automated Tests (For Contributors)

OpenMZ runs end-to-end compatibility tests in Playwright Chromium comparing vanilla MZ against the OpenMZ build, covering:

- Plugin parameters and `PluginManager.registerCommand()` execution
- Player hooks (`Game_Player` prototype extensions)
- Text pictures and pointer clicks
- Menu and save/load screen layouts
- Legacy `initialize.call(this)` prototype construction
- `Bitmap.snap()` offscreen snapshots and pixel readback

Run the suite (see [Development and Testing Guide](./development_en.md#test-suite) for setup):

```sh
pnpm --filter openmz test:plugin-compat
```

Test source: [`plugin-compat.test.ts`](../packages/openmz/tests/plugin-compat/plugin-compat.test.ts).

### Pre-Release Checklist (For Plugin & Game Developers)

Even when engine APIs and automated tests pass, complex rendering plugins can behave differently depending on the runtime environment. Before shipping a game, verify your actual plugin combination in the target **NW.js** runtime or browser, paying special attention to:

- Custom filters and shaders (including WebGL 1 fallback behavior)
- Scene snapshots and offscreen rendering (such as blurred menu backgrounds)
- Cross-bounds pointer dragging and custom interaction handlers
- Particle effects and Effekseer animations
