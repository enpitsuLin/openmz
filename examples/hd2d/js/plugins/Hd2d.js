/*:
 * @target MZ
 * @plugindesc [Experimental] HD-2D 3D diorama renderer for OpenMZ.
 * @base OpenMzPixi3D
 * @orderAfter OpenMzPixi3D
 * @orderAfter PixelMovement
 * @author rmmz-next
 *
 * @command SetEventLight
 * @text Set Event Light
 * @desc Attach or override a dynamic 3D light on an event (0 = current event).
 *
 * @arg eventId
 * @text Event ID
 * @desc Target event ID (0 = this event).
 * @type number
 * @min 0
 * @default 0
 *
 * @arg preset
 * @text Preset
 * @desc Optional preset defaults (any field below overrides it).
 * @type select
 * @option None
 * @value
 * @option Torch (warm flickering shadow light)
 * @value torch
 * @option Campfire (wide flickering shadow light)
 * @value campfire
 * @option Lantern (soft warm swaying light)
 * @value lantern
 * @option Crystal (cool pulsing light)
 * @value crystal
 * @option Flashlight (directional spot light)
 * @value flashlight
 * @default
 *
 * @arg type
 * @text Light Type
 * @type select
 * @option Inherit / Point
 * @value
 * @option Point Light
 * @value point
 * @option Spot Light
 * @value spot
 * @default
 *
 * @arg color
 * @text Color (#RRGGBB)
 * @type string
 * @default
 *
 * @arg intensity
 * @text Intensity
 * @type string
 * @default
 *
 * @arg range
 * @text Range
 * @type string
 * @default
 *
 * @arg decay
 * @text Decay (Point)
 * @type string
 * @default
 *
 * @arg offsetX
 * @text Offset X
 * @type string
 * @default
 *
 * @arg offsetY
 * @text Offset Y (Height)
 * @type string
 * @default
 *
 * @arg offsetZ
 * @text Offset Z
 * @type string
 * @default
 *
 * @arg castShadow
 * @text Cast Shadow
 * @type select
 * @option Inherit
 * @value inherit
 * @option On
 * @value true
 * @option Off
 * @value false
 * @default inherit
 *
 * @arg spriteLight
 * @text Tint Characters
 * @type select
 * @option Inherit
 * @value inherit
 * @option On
 * @value true
 * @option Off
 * @value false
 * @default inherit
 *
 * @arg flicker
 * @text Flicker Strength (0-1)
 * @type string
 * @default
 *
 * @arg pulse
 * @text Pulse Strength (0-1)
 * @type string
 * @default
 *
 * @arg sway
 * @text Sway Amplitude
 * @type string
 * @default
 *
 * @arg coneAngle
 * @text Spot Cone Angle (deg)
 * @type string
 * @default
 *
 * @arg penumbra
 * @text Spot Penumbra (0-1)
 * @type string
 * @default
 *
 * @arg pitch
 * @text Spot Pitch (deg)
 * @type string
 * @default
 *
 * @arg followDir
 * @text Spot Follow Event Direction
 * @type select
 * @option Inherit
 * @value inherit
 * @option On
 * @value true
 * @option Off
 * @value false
 * @default inherit
 *
 * @command ClearEventLight
 * @text Clear / Turn Off Event Light
 * @desc Restore an event's note/page light or forcibly turn it off.
 *
 * @arg eventId
 * @text Event ID
 * @type number
 * @min 0
 * @default 0
 *
 * @arg turnOff
 * @text Force Turn Off
 * @desc When true, turns off all lights on this event instead of restoring note/page lights.
 * @type boolean
 * @default false
 *
 * @command SetPlayerLight
 * @text Set Player Light
 * @desc Attach a dynamic light (lantern, flashlight, etc.) to the player across maps.
 *
 * @arg preset
 * @text Preset
 * @type select
 * @option Lantern
 * @value lantern
 * @option Flashlight
 * @value flashlight
 * @option Torch
 * @value torch
 * @option Crystal
 * @value crystal
 * @option Custom
 * @value
 * @default lantern
 *
 * @arg type
 * @text Light Type
 * @type select
 * @option Inherit / Point
 * @value
 * @option Point Light
 * @value point
 * @option Spot Light
 * @value spot
 * @default
 *
 * @arg color
 * @text Color (#RRGGBB)
 * @type string
 * @default
 *
 * @arg intensity
 * @text Intensity
 * @type string
 * @default
 *
 * @arg range
 * @text Range
 * @type string
 * @default
 *
 * @arg castShadow
 * @text Cast Shadow
 * @type select
 * @option Inherit
 * @value inherit
 * @option On
 * @value true
 * @option Off
 * @value false
 * @default inherit
 *
 * @arg coneAngle
 * @text Spot Cone Angle (deg)
 * @type string
 * @default
 *
 * @arg pitch
 * @text Spot Pitch (deg)
 * @type string
 * @default
 *
 * @command ClearPlayerLight
 * @text Clear Player Light
 * @desc Remove the dynamic light attached to the player.
 *
 * @help
 * Native Tileset Integration:
 *   - Ground (A1-A5 + flat B-E + shadows) renders via RMMZ's native Tilemap
 *     with automatic paired "<tileset>-normal.png" normal maps and A1 water animation.
 *   - B-E tiles stand upright based on Terrain Tag + Tileset Note <hd2d-tile> rules
 *     (defaults: tag 1 = standing card with subtle yaw, tag 2 = straight card; A1-A5 stay flat).
 *   - Tileset Note: <hd2d-tile tag="1" mode="flat|stand|cylindrical|spherical" jitter="0.16" deg="0">
 *   - Map Note (per-tile override, editor layer 2-4 optional):
 *     <hd2d-tile x="9" y="5" layer="3" deg="-20" rot="-0.35" mode="stand|cylindrical|spherical" offset="0,0,0">
 *
 * Event Appearance Tag (<hd2d-sprite ...> in Note or active Page Comments):
 *   Supports both character sheets and tileset events (tileId > 0).
 *   Attributes (all optional):
 *     offset="x,y,z" (or x/y/z)   anchor="x,y"            rot="0.15"
 *     scale="1"                   pixelSize="0.015"       billboard="none|cylindrical|spherical"
 *     emissive="0.7"              emissiveColor="#ffc484" blend="true|false"
 *     shadow="true|false"         groundShadow="true|false"
 *     sway="0.05" swaySpeed="2"   swayPitch="0.075" swayPitchSpeed="3"
 *     breathe="true|false"        collider="auto|none|r|w,d"
 *
 * Event Light Tag (<hd2d-light ...> / <hd2d-no-light> in Note or Page Comments):
 *   Page comments override the Note, so switching event pages automatically
 *   turns lights on/off or swaps color/intensity.
 *   Attributes (all optional):
 *     preset="torch|campfire|lantern|crystal|flashlight"
 *     type="point|spot"          color="#ffbb4c"
 *     intensity="10"             range="3.5"           decay="0.25"
 *     offset="0,0.85,0.15"       (or x/y/z)
 *     shadow="true|false"        shadowBias="0.00015"  spriteLight="true|false"
 *     flicker="0.15"             flickerSpeed="1"      flickerJitter="0.002"
 *     pulse="0.25"               pulseSpeed="2.4"
 *     sway="0.03"                swaySpeed="2"
 *     angle="32" penumbra="0.4"  pitch="-26" yaw="0"   followDir="true|false"
 */
/*:zh
 * @target MZ
 * @plugindesc [实验性] OpenMZ 的 HD-2D 3D 场景渲染插件。
 * @base OpenMzPixi3D
 * @orderAfter OpenMzPixi3D
 * @orderAfter PixelMovement
 * @author rmmz-next
 *
 * @command SetEventLight
 * @text 设置事件光源
 * @desc 为指定事件附加或覆盖动态 3D 光源（事件 ID 为 0 表示当前事件）。
 *
 * @arg eventId
 * @text 事件 ID
 * @desc 目标事件 ID（0 表示本事件）。
 * @type number
 * @min 0
 * @default 0
 *
 * @arg preset
 * @text 光源预设
 * @desc 可选预设模板（下方填写的任意参数都会覆盖预设值）。
 * @type select
 * @option 无
 * @value
 * @option 火把（暖色闪烁投影点光源）
 * @value torch
 * @option 篝火（大范围暖色闪烁投影光源）
 * @value campfire
 * @option 灯笼（柔和暖色摇曳光源）
 * @value lantern
 * @option 水晶（冷色呼吸脉冲光源）
 * @value crystal
 * @option 手电筒（朝向聚光灯）
 * @value flashlight
 * @default
 *
 * @arg type
 * @text 光源类型
 * @type select
 * @option 继承 / 点光源
 * @value
 * @option 点光源 (Point)
 * @value point
 * @option 聚光灯 (Spot)
 * @value spot
 * @default
 *
 * @arg color
 * @text 颜色 (#RRGGBB)
 * @type string
 * @default
 *
 * @arg intensity
 * @text 光照强度
 * @type string
 * @default
 *
 * @arg range
 * @text 照射范围
 * @type string
 * @default
 *
 * @arg decay
 * @text 衰减指数（点光源）
 * @type string
 * @default
 *
 * @arg offsetX
 * @text 偏移 X
 * @type string
 * @default
 *
 * @arg offsetY
 * @text 偏移 Y（高度）
 * @type string
 * @default
 *
 * @arg offsetZ
 * @text 偏移 Z
 * @type string
 * @default
 *
 * @arg castShadow
 * @text 投射阴影
 * @type select
 * @option 继承
 * @value inherit
 * @option 开启
 * @value true
 * @option 关闭
 * @value false
 * @default inherit
 *
 * @arg spriteLight
 * @text 照亮角色精灵
 * @type select
 * @option 继承
 * @value inherit
 * @option 开启
 * @value true
 * @option 关闭
 * @value false
 * @default inherit
 *
 * @arg flicker
 * @text 闪烁幅度 (0-1)
 * @type string
 * @default
 *
 * @arg pulse
 * @text 呼吸脉冲幅度 (0-1)
 * @type string
 * @default
 *
 * @arg sway
 * @text 摇晃幅度
 * @type string
 * @default
 *
 * @arg coneAngle
 * @text 聚光灯张角（度）
 * @type string
 * @default
 *
 * @arg penumbra
 * @text 聚光灯柔和边缘 (0-1)
 * @type string
 * @default
 *
 * @arg pitch
 * @text 聚光灯俯仰角（度）
 * @type string
 * @default
 *
 * @arg followDir
 * @text 聚光灯跟随事件朝向
 * @type select
 * @option 继承
 * @value inherit
 * @option 开启
 * @value true
 * @option 关闭
 * @value false
 * @default inherit
 *
 * @command ClearEventLight
 * @text 清除 / 关闭事件光源
 * @desc 恢复事件备注/页注释中的默认光源，或强制熄灭。
 *
 * @arg eventId
 * @text 事件 ID
 * @type number
 * @min 0
 * @default 0
 *
 * @arg turnOff
 * @text 强制熄灭
 * @desc 开启后会熄灭该事件所有光源；关闭则恢复为备注或事件页注释配置的光源。
 * @type boolean
 * @default false
 *
 * @command SetPlayerLight
 * @text 设置主角随身光源
 * @desc 为主角附加跨地图保留的动态光源（如提灯、手电筒等）。
 *
 * @arg preset
 * @text 光源预设
 * @type select
 * @option 提灯 (Lantern)
 * @value lantern
 * @option 手电筒 (Flashlight)
 * @value flashlight
 * @option 火把 (Torch)
 * @value torch
 * @option 水晶 (Crystal)
 * @value crystal
 * @option 自定义
 * @value
 * @default lantern
 *
 * @arg type
 * @text 光源类型
 * @type select
 * @option 继承 / 点光源
 * @value
 * @option 点光源 (Point)
 * @value point
 * @option 聚光灯 (Spot)
 * @value spot
 * @default
 *
 * @arg color
 * @text 颜色 (#RRGGBB)
 * @type string
 * @default
 *
 * @arg intensity
 * @text 光照强度
 * @type string
 * @default
 *
 * @arg range
 * @text 照射范围
 * @type string
 * @default
 *
 * @arg castShadow
 * @text 投射阴影
 * @type select
 * @option 继承
 * @value inherit
 * @option 开启
 * @value true
 * @option 关闭
 * @value false
 * @default inherit
 *
 * @arg coneAngle
 * @text 聚光灯张角（度）
 * @type string
 * @default
 *
 * @arg pitch
 * @text 聚光灯俯仰角（度）
 * @type string
 * @default
 *
 * @command ClearPlayerLight
 * @text 清除主角随身光源
 * @desc 移除附加在主角身上的动态光源。
 *
 * @help
 * 【原生图块集成】
 * - 地面（A1-A5 与平坦 B-E 图块）：直接通过 RMMZ 原生 Tilemap 渲染，自动加载
 *   同名 "<图块名>-normal.png" 法线贴图，并支持 A1 动态水面动画。
 * - 立体景物（仅作用于 B-E 图块，A1-A5 始终平贴地面）：
 *   默认地形标志 1 为带轻微随机偏转的竖立卡片，地形标志 2 为笔直竖立卡片；
 *   可在「图块集备注」用 <hd2d-tile> 自定义任意地形标志（1~7）的行为：
 *     <hd2d-tile tag="1" mode="stand" jitter="0.16">
 *     <hd2d-tile tag="3" mode="cylindrical">  （始终朝向相机的圆柱 Billboard）
 *     <hd2d-tile tag="4" mode="spherical">    （全轴朝向相机的球型 Billboard）
 *     <hd2d-tile tag="1" mode="flat">         （强制贴地平铺，覆盖默认行为）
 * - 地图单格覆写（写在「地图备注」中，可精确设置 Y 轴偏转或模式）：
 *     <hd2d-tile x="9" y="5" deg="-20">                  （匹配该格所有立牌层）
 *     <hd2d-tile x="9" y="5" layer="3" rot="-0.35" mode="stand" offset="0,0,0">
 *     （layer 对应 RMMZ 编辑器图层 2~4，也可用 z="1~3"；多格合并立牌填其中任意一格即可命中）
 *
 * 【事件外观标签 <hd2d-sprite ...>】
 * 可写在事件「备注」或当前事件页「注释」中（页注释优先，翻页自动切换），
 * 同时支持行走图事件与图块事件（tileId > 0）。常用属性（均可选）：
 *   offset="x,y,z"          位置偏移（也可用 x/y/z 单独指定）
 *   anchor="x,y"            锚点（默认 0.5,1 贴地；挂件可用 0.5,0）
 *   rot="0.15"              Y 轴旋转（弧度）
 *   scale="1"               整体缩放倍率
 *   pixelSize="0.015"       覆盖单像素世界尺寸
 *   emissive="0.7"          自发光强度（>0 触发泛光）
 *   emissiveColor="#ffc484" 自发光染色
 *   shadow="true|false"     是否投射剪影阴影（自发光体默认关闭）
 *   groundShadow="true|false" 是否显示脚底接触圆影
 *   sway="0.05" swaySpeed="2" 挂件左右摇晃幅度与频率
 *   swayPitch="0.075" swayPitchSpeed="3" 前后摇晃幅度与频率
 *   breathe="true|false"    是否启用呼吸微动
 *   billboard="none|cylindrical|spherical" 朝向相机模式
 *   collider="auto|none|r|w,d" 碰撞盒模式（默认按精灵底部像素自动推导，高空悬空自动穿透）
 *
 * 【事件光源标签 <hd2d-light ...> / <hd2d-no-light>】
 * 可写在事件「备注」或当前事件页「注释」中，同一事件支持叠加多个光源；
 * 切页时自动开关灯或切换颜色强度，写 <hd2d-no-light> 可在当前页熄灭备注光源。
 * 常用属性（均可选）：
 *   preset="torch|campfire|lantern|crystal|flashlight"
 *   type="point|spot"       color="#ffbb4c"
 *   intensity="10"          range="3.5"            decay="0.25"
 *   offset="0,0.85,0.15"    (或 x/y/z)
 *   shadow="true|false"     shadowBias="0.00015"   spriteLight="true|false"
 *   flicker="0.15"          flickerSpeed="1"       flickerJitter="0.002"
 *   pulse="0.25"            pulseSpeed="2.4"
 *   sway="0.03"             swaySpeed="2"
 *   angle="32" penumbra="0.4" pitch="-26" yaw="0"  followDir="true|false"
 *
 * 示例：
 *   <hd2d-light preset="torch" offset="0.18,0.97,0.09">
 *   <hd2d-light type="spot" color="#fff0cc" intensity="15" range="6" angle="28" followDir="true" shadow="true">
 *
 * 如需实时调试后期特效、雾、粒子、自由相机或碰撞箱，请在插件管理器中本插件
 * 下方启用独立的 Hd2dDebug.js 插件。
 */
(function (_pixi_3d, pixi_js, _pixi_3d_extras) {
  // src/constants.ts
  const TILE_UNIT = 0.65;
  const CHAR_PIXEL_SIZE_TALL = 0.01;
  const CHAR_PIXEL_SIZE_COMPACT = 0.015;
  const TILE_BILLBOARD_PIXEL_SIZE = 0.0155;
  const HD2D_ASSET_ROOT = 'img/hd2d';
  /**
   * Converts RMMZ map tile coordinates into centered 3D world coordinates.
   * Tile center (mapWidth - 1) / 2, (mapHeight - 1) / 2 maps to world origin (0, 0).
   */
  function tileToWorld(tileX, tileY, mapWidth, mapHeight) {
    return {
      x: (tileX - (mapWidth - 1) / 2) * TILE_UNIT,
      z: (tileY - (mapHeight - 1) / 2) * TILE_UNIT,
    };
  }
  function hd2dAssetUrl(relativePath) {
    const clean = relativePath.replace(/^\/+/, '');
    return `${HD2D_ASSET_ROOT}/${clean}`;
  }
  // src/scene/eventLights.ts
  const DEFAULT_LIGHT_SPEC = {
    type: 'point',
    color: 0xffcc88,
    intensity: 10,
    range: 3,
    decay: 0.25,
    radius: 0.1,
    offsetX: 0,
    offsetY: 0.85,
    offsetZ: 0.15,
    castShadow: false,
    shadowBias: 15e-5,
    spriteLight: true,
    flicker: 0,
    flickerSpeed: 1,
    flickerJitter: 0.002,
    pulse: 0,
    pulseSpeed: 2.4,
    sway: 0,
    swaySpeed: 2,
    coneAngle: 32,
    penumbra: 0.4,
    pitch: -26,
    yaw: null,
    followDir: true,
  };
  const LIGHT_PRESETS = {
    torch: {
      type: 'point',
      color: 0xffbb4c,
      intensity: 12,
      range: 2.6,
      decay: 0.15,
      offsetX: 0.14,
      offsetY: 1.05,
      offsetZ: 0.28,
      castShadow: true,
      shadowBias: 15e-5,
      flicker: 0.14,
      flickerSpeed: 1,
      flickerJitter: 0.002,
    },
    campfire: {
      type: 'point',
      color: 0xff9c40,
      intensity: 14,
      range: 4,
      decay: 0.22,
      offsetX: 0,
      offsetY: 0.55,
      offsetZ: 0.1,
      castShadow: true,
      shadowBias: 2e-4,
      flicker: 0.22,
      flickerSpeed: 1.15,
      flickerJitter: 0.004,
    },
    lantern: {
      type: 'point',
      color: 0xffd39b,
      intensity: 8.5,
      range: 3.6,
      decay: 0.35,
      offsetX: 0,
      offsetY: 0.9,
      offsetZ: 0.15,
      castShadow: false,
      sway: 0.03,
      swaySpeed: 2,
    },
    crystal: {
      type: 'point',
      color: 6737151,
      intensity: 9.5,
      range: 3.4,
      decay: 0.3,
      offsetX: 0,
      offsetY: 0.75,
      offsetZ: 0.12,
      castShadow: false,
      pulse: 0.28,
      pulseSpeed: 2.6,
    },
    flashlight: {
      type: 'spot',
      color: 0xfff3d6,
      intensity: 16,
      range: 6.5,
      coneAngle: 28,
      penumbra: 0.45,
      offsetX: 0,
      offsetY: 0.65,
      offsetZ: 0,
      pitch: -18,
      followDir: true,
      castShadow: true,
      shadowBias: 2e-4,
    },
  };
  function resolveEventLightSpec(partial) {
    const presetValues = partial.preset ? LIGHT_PRESETS[partial.preset] : void 0;
    const { preset: _ignored, ...rest } = partial;
    return {
      ...DEFAULT_LIGHT_SPEC,
      ...presetValues,
      ...definedOnly(rest),
    };
  }
  function definedOnly(obj) {
    const out = {};
    for (const [key, value] of Object.entries(obj)) if (value !== void 0) out[key] = value;
    return out;
  }
  function parseColor(raw) {
    if (!raw) return void 0;
    const clean = raw.trim().replace(/^#|^0x/i, '');
    if (!/^[0-9a-f]{6}$/i.test(clean)) return void 0;
    return Number.parseInt(clean, 16);
  }
  function parseNumber(raw) {
    if (raw === void 0 || raw.trim() === '') return void 0;
    const num = Number(raw);
    return Number.isFinite(num) ? num : void 0;
  }
  function parseBoolean(raw) {
    if (raw === void 0) return void 0;
    const lower = raw.trim().toLowerCase();
    if (lower === 'true' || lower === '1' || lower === 'yes' || lower === 'on') return true;
    if (lower === 'false' || lower === '0' || lower === 'no' || lower === 'off') return false;
  }
  function parseAttrs(raw) {
    const attrs = {};
    for (const match of raw.matchAll(/([a-z][\w-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/gi)) {
      const key = match[1].toLowerCase();
      attrs[key] = match[2] ?? match[3] ?? match[4] ?? 'true';
    }
    return attrs;
  }
  function parseSingleLightTag(attrText) {
    const a = parseAttrs(attrText);
    const presetRaw = a.preset?.toLowerCase();
    const preset = presetRaw && presetRaw in LIGHT_PRESETS ? presetRaw : void 0;
    const typeRaw = a.type?.toLowerCase();
    const type = typeRaw === 'spot' ? 'spot' : typeRaw === 'point' ? 'point' : void 0;
    let offsetX = parseNumber(a.x);
    let offsetY = parseNumber(a.y);
    let offsetZ = parseNumber(a.z);
    if (a.offset) {
      const parts = a.offset.split(',').map((s) => Number(s.trim()));
      if (Number.isFinite(parts[0])) offsetX = parts[0];
      if (Number.isFinite(parts[1])) offsetY = parts[1];
      if (Number.isFinite(parts[2])) offsetZ = parts[2];
    }
    const flickerVal = a.flicker === 'true' ? 0.16 : a.flicker === 'false' ? 0 : parseNumber(a.flicker);
    const pulseVal = a.pulse === 'true' ? 0.25 : a.pulse === 'false' ? 0 : parseNumber(a.pulse);
    const swayVal = a.sway === 'true' ? 0.04 : a.sway === 'false' ? 0 : parseNumber(a.sway);
    return resolveEventLightSpec({
      preset,
      type,
      color: parseColor(a.color),
      intensity: parseNumber(a.intensity),
      range: parseNumber(a.range),
      decay: parseNumber(a.decay),
      radius: parseNumber(a.radius),
      offsetX,
      offsetY,
      offsetZ,
      castShadow: parseBoolean(a.shadow ?? a.castshadow),
      shadowBias: parseNumber(a.shadowbias ?? a.bias),
      spriteLight: parseBoolean(a.spritelight),
      flicker: flickerVal,
      flickerSpeed: parseNumber(a.flickerspeed),
      flickerJitter: parseNumber(a.flickerjitter),
      pulse: pulseVal,
      pulseSpeed: parseNumber(a.pulsespeed),
      sway: swayVal,
      swaySpeed: parseNumber(a.swayspeed),
      coneAngle: parseNumber(a.angle ?? a.coneangle),
      penumbra: parseNumber(a.penumbra),
      pitch: parseNumber(a.pitch),
      yaw: parseNumber(a.yaw),
      followDir: parseBoolean(a.followdir),
    });
  }
  function parseLightTagsFromText(text) {
    const disabled = /<hd2d-no-light\s*\/?>/i.test(text);
    const specs = [];
    for (const match of text.matchAll(/<hd2d-light([^>]*)>/gi)) {
      const attrText = (match[1] ?? '').replace(/\/$/, '');
      specs.push(parseSingleLightTag(attrText));
    }
    return {
      specs,
      disabled,
    };
  }
  function extractEventPageComments(event) {
    const page = event.page();
    if (!page || !page.list) return '';
    const lines = [];
    for (const command of page.list)
      if (command.code === 108 || command.code === 408) lines.push(String(command.parameters[0] ?? ''));
    return lines.join('\n');
  }
  const runtimeOverrides = {
    mapId: 0,
    events: /* @__PURE__ */ new Map(),
    player: null,
    version: 0,
  };
  function ensureMapOverrides(mapId) {
    if (runtimeOverrides.mapId !== mapId) {
      runtimeOverrides.mapId = mapId;
      runtimeOverrides.events.clear();
    }
  }
  function setEventLightOverride(mapId, eventId, specs) {
    ensureMapOverrides(mapId);
    runtimeOverrides.events.set(eventId, specs);
    runtimeOverrides.version++;
  }
  function clearEventLightOverride(mapId, eventId) {
    ensureMapOverrides(mapId);
    if (runtimeOverrides.events.delete(eventId)) runtimeOverrides.version++;
  }
  function setPlayerLightOverride(specs) {
    runtimeOverrides.player = specs;
    runtimeOverrides.version++;
  }
  function resolveEventLightsForEvent(event, defaultSpecs = []) {
    ensureMapOverrides($gameMap.mapId());
    if (event._erased || !event.page())
      return {
        specs: [],
        disabled: true,
      };
    if (runtimeOverrides.events.has(event.eventId())) {
      const override = runtimeOverrides.events.get(event.eventId());
      if (!override || override.length === 0)
        return {
          specs: [],
          disabled: true,
        };
      return {
        specs: override,
        disabled: false,
      };
    }
    const pageTags = parseLightTagsFromText(extractEventPageComments(event));
    if (pageTags.disabled)
      return {
        specs: [],
        disabled: true,
      };
    if (pageTags.specs.length > 0)
      return {
        specs: pageTags.specs,
        disabled: false,
      };
    const noteTags = parseLightTagsFromText(event.event()?.note ?? '');
    if (noteTags.disabled)
      return {
        specs: [],
        disabled: true,
      };
    if (noteTags.specs.length > 0)
      return {
        specs: noteTags.specs,
        disabled: false,
      };
    return {
      specs: [...defaultSpecs],
      disabled: false,
    };
  }
  function directionToYawRad(direction) {
    switch (direction) {
      case 2:
        return 0;
      case 4:
        return -Math.PI * 0.5;
      case 6:
        return Math.PI * 0.5;
      case 8:
        return Math.PI;
      default:
        return 0;
    }
  }
  function createLightInstance(spec, phase) {
    return {
      spec,
      light:
        spec.type === 'spot'
          ? new _pixi_3d.SpotLight({
              color: spec.color,
              intensity: spec.intensity,
              range: spec.range,
              radius: spec.radius,
              coneAngle: spec.coneAngle,
              penumbra: spec.penumbra,
              castShadow: spec.castShadow,
              shadow: spec.castShadow ? { bias: spec.shadowBias } : void 0,
            })
          : new _pixi_3d.PointLight({
              color: spec.color,
              intensity: spec.intensity,
              range: spec.range,
              decay: spec.decay,
              radius: spec.radius,
              castShadow: spec.castShadow,
              shadow: spec.castShadow ? { bias: spec.shadowBias } : void 0,
            }),
      phase,
    };
  }
  var EventLightManager = class {
    object = new _pixi_3d.Container3D({ label: '事件光源' });
    tracked = [];
    lastOverrideVersion = -1;
    activeSpriteLights = [];
    constructor() {
      this.tracked.push({
        character: $gamePlayer,
        defaultSpecs: [],
        lastPageIndex: -999,
        lastErased: false,
        instances: [],
      });
    }
    registerEvent(event, defaultSpecs = [], onToggle) {
      const existing = this.tracked.find((t) => t.event === event);
      if (existing) {
        existing.defaultSpecs = defaultSpecs;
        existing.onToggle = onToggle;
        this.rebuildEntry(existing);
        return;
      }
      const entry = {
        character: event,
        event,
        defaultSpecs,
        onToggle,
        lastPageIndex: -999,
        lastErased: false,
        instances: [],
      };
      this.tracked.push(entry);
      this.rebuildEntry(entry);
    }
    syncAllEvents() {
      for (const event of $gameMap.events())
        if (!this.tracked.some((t) => t.event === event)) this.registerEvent(event);
      this.rebuildPlayerEntry();
      this.lastOverrideVersion = runtimeOverrides.version;
    }
    getSpriteLights() {
      return this.activeSpriteLights;
    }
    update(elapsed) {
      const overridesChanged = this.lastOverrideVersion !== runtimeOverrides.version;
      if (overridesChanged) {
        this.lastOverrideVersion = runtimeOverrides.version;
        this.rebuildPlayerEntry();
      }
      const map = $gameMap;
      const mapWidth = map.width();
      const mapHeight = map.height();
      const tMs = elapsed * 1e3;
      this.activeSpriteLights.length = 0;
      for (const entry of this.tracked) {
        if (entry.event) {
          const pageIndex = entry.event._pageIndex;
          const erased = entry.event._erased;
          if (overridesChanged || pageIndex !== entry.lastPageIndex || erased !== entry.lastErased)
            this.rebuildEntry(entry);
        }
        if (entry.instances.length === 0) continue;
        const { x: worldX, z: worldZ } = tileToWorld(
          entry.character._realX,
          entry.character._realY,
          mapWidth,
          mapHeight,
        );
        const jumpY = entry.character.jumpHeight() * CHAR_PIXEL_SIZE_TALL;
        for (const inst of entry.instances) {
          const { spec, light, phase } = inst;
          let intensity = spec.intensity;
          let jitterX = 0;
          let jitterY = 0;
          let swayX = 0;
          if (spec.flicker > 0) {
            const t = tMs * spec.flickerSpeed + phase * 317;
            const wave = (Math.sin(t * 4) + Math.sin(t * 2.1) * 0.5 + Math.sin(t * 6.3) * 0.2) / 1.7;
            intensity *= Math.max(0.05, 1 + wave * spec.flicker);
            jitterX = Math.sin(t) * spec.flickerJitter;
            jitterY = Math.cos(t * 1.3) * spec.flickerJitter * 0.75;
          }
          if (spec.pulse > 0) intensity *= Math.max(0.05, 1 + Math.sin(elapsed * spec.pulseSpeed + phase) * spec.pulse);
          if (spec.sway > 0) swayX = Math.sin(elapsed * spec.swaySpeed + phase) * spec.sway;
          light.intensity = intensity;
          const lx = worldX + spec.offsetX + jitterX + swayX;
          const ly = jumpY + spec.offsetY + jitterY;
          const lz = worldZ + spec.offsetZ;
          light.position.set(lx, ly, lz);
          if (light.type === 'spot') {
            const yaw =
              spec.yaw !== null
                ? (spec.yaw * Math.PI) / 180
                : spec.followDir
                  ? directionToYawRad(entry.character.direction())
                  : 0;
            const pitch = (spec.pitch * Math.PI) / 180;
            const cosPitch = Math.cos(pitch);
            const dirX = Math.sin(yaw) * cosPitch;
            const dirY = Math.sin(pitch);
            const dirZ = Math.cos(yaw) * cosPitch;
            light.lookAt({
              x: lx + dirX,
              y: ly + dirY,
              z: lz + dirZ,
            });
          }
          if (spec.spriteLight) this.activeSpriteLights.push(light);
        }
      }
    }
    destroy() {
      for (const entry of this.tracked) this.clearEntryLights(entry);
      this.tracked.length = 0;
      this.activeSpriteLights.length = 0;
    }
    clearEntryLights(entry) {
      for (const inst of entry.instances) {
        this.object.removeChild(inst.light);
        inst.light.destroy();
      }
      entry.instances.length = 0;
    }
    rebuildPlayerEntry() {
      const playerEntry = this.tracked[0];
      if (!playerEntry) return;
      this.clearEntryLights(playerEntry);
      (runtimeOverrides.player ?? []).forEach((spec, idx) => {
        const inst = createLightInstance(spec, idx * 1.7);
        playerEntry.instances.push(inst);
        this.object.addChild(inst.light);
      });
    }
    rebuildEntry(entry) {
      if (!entry.event) return;
      this.clearEntryLights(entry);
      entry.lastPageIndex = entry.event._pageIndex;
      entry.lastErased = entry.event._erased;
      const { specs, disabled } = resolveEventLightsForEvent(entry.event, entry.defaultSpecs);
      specs.forEach((spec, idx) => {
        const inst = createLightInstance(spec, entry.event.eventId() * 2.3 + idx * 1.1);
        entry.instances.push(inst);
        this.object.addChild(inst.light);
      });
      entry.onToggle?.(!disabled && specs.length > 0);
    }
  };
  // src/patches/PluginCommands.ts
  function parseOptNumber(raw) {
    if (!raw || raw.trim() === '') return void 0;
    const n = Number(raw);
    return Number.isFinite(n) ? n : void 0;
  }
  function parseOptColor(raw) {
    if (!raw || raw.trim() === '') return void 0;
    const clean = raw.trim().replace(/^#|^0x/i, '');
    return /^[0-9a-f]{6}$/i.test(clean) ? Number.parseInt(clean, 16) : void 0;
  }
  function parseOptBool(raw) {
    if (!raw || raw.trim() === '' || raw === 'inherit') return void 0;
    return raw === 'true';
  }
  function specFromCommandArgs(args) {
    const presetRaw = args.preset?.trim().toLowerCase();
    const preset = presetRaw && presetRaw in LIGHT_PRESETS ? presetRaw : void 0;
    const typeRaw = args.type?.trim().toLowerCase();
    return {
      preset,
      type: typeRaw === 'spot' ? 'spot' : typeRaw === 'point' ? 'point' : void 0,
      color: parseOptColor(args.color),
      intensity: parseOptNumber(args.intensity),
      range: parseOptNumber(args.range),
      decay: parseOptNumber(args.decay),
      offsetX: parseOptNumber(args.offsetX),
      offsetY: parseOptNumber(args.offsetY),
      offsetZ: parseOptNumber(args.offsetZ),
      castShadow: parseOptBool(args.castShadow),
      spriteLight: parseOptBool(args.spriteLight),
      flicker: parseOptNumber(args.flicker),
      pulse: parseOptNumber(args.pulse),
      sway: parseOptNumber(args.sway),
      coneAngle: parseOptNumber(args.coneAngle),
      penumbra: parseOptNumber(args.penumbra),
      pitch: parseOptNumber(args.pitch),
      followDir: parseOptBool(args.followDir),
    };
  }
  function installPluginCommands() {
    PluginManager.registerCommand('Hd2d', 'SetEventLight', function (args) {
      const rawId = Number(args.eventId ?? 0);
      const eventId = rawId > 0 ? rawId : (this._eventId ?? 0);
      if (eventId <= 0) return;
      const spec = resolveEventLightSpec(specFromCommandArgs(args));
      setEventLightOverride($gameMap.mapId(), eventId, [spec]);
    });
    PluginManager.registerCommand('Hd2d', 'ClearEventLight', function (args) {
      const rawId = Number(args.eventId ?? 0);
      const eventId = rawId > 0 ? rawId : (this._eventId ?? 0);
      if (eventId <= 0) return;
      if (args.turnOff === 'true') setEventLightOverride($gameMap.mapId(), eventId, null);
      else clearEventLightOverride($gameMap.mapId(), eventId);
    });
    PluginManager.registerCommand('Hd2d', 'SetPlayerLight', (args) => {
      setPlayerLightOverride([resolveEventLightSpec(specFromCommandArgs(args))]);
    });
    PluginManager.registerCommand('Hd2d', 'ClearPlayerLight', () => {
      setPlayerLightOverride(null);
    });
  }
  // src/scene/camera.ts
  function clamp$1(value, min, max) {
    if (min >= max) return (min + max) * 0.5;
    return Math.max(min, Math.min(max, value));
  }
  function createFollowCamera(camera, bounds) {
    const settings = {
      follow: true,
      fov: 45,
      offsetX: -0.25,
      offsetY: 1.72,
      offsetZ: 5.52,
      lookAtY: 0.15,
      damping: 7,
    };
    let focusX = 0;
    let focusZ = 0;
    let paused = false;
    const getTarget = () => ({
      x: settings.follow ? focusX : 0,
      y: settings.lookAtY,
      z: settings.follow ? focusZ : 0,
    });
    const applyTransform = () => {
      camera.fov = settings.fov;
      camera.near = 0.1;
      camera.far = 100;
      if (paused) return;
      const target = getTarget();
      camera.position.set(target.x + settings.offsetX, settings.offsetY, target.z + settings.offsetZ);
      camera.lookAt(target);
    };
    const snapTo = (targetX, targetZ) => {
      focusX = clamp$1(targetX, bounds.minX, bounds.maxX);
      focusZ = clamp$1(targetZ, bounds.minZ, bounds.maxZ);
      applyTransform();
    };
    const update = (targetX, targetZ, delta) => {
      const clampedX = clamp$1(targetX, bounds.minX, bounds.maxX);
      const clampedZ = clamp$1(targetZ, bounds.minZ, bounds.maxZ);
      const alpha = 1 - Math.exp(-Math.max(settings.damping, 0.01) * delta);
      focusX += (clampedX - focusX) * alpha;
      focusZ += (clampedZ - focusZ) * alpha;
      applyTransform();
    };
    const setPaused = (nextPaused) => {
      paused = nextPaused;
      if (!paused) applyTransform();
    };
    applyTransform();
    return {
      settings,
      apply: applyTransform,
      snapTo,
      update,
      setPaused,
      getTarget,
    };
  }
  // src/scene/dust.ts
  const MAX_PARTICLES = 200;
  const HALF_AREA = 3.2;
  function wrapCoord(value, center, halfSpan) {
    const span = halfSpan * 2;
    return center + ((((value - center + halfSpan) % span) + span) % span) - halfSpan;
  }
  function createDust() {
    const settings = {
      enabled: true,
      size: 0.008,
      randomness: 3,
      speed: 0.005,
      count: 60,
      color: '#ffD39B',
    };
    const object = new _pixi_3d.ParticleContainer3D({ capacity: MAX_PARTICLES });
    const particles = Array.from({ length: MAX_PARTICLES }, () => ({
      x: (Math.random() * 2 - 1) * HALF_AREA,
      y: Math.random() * HALF_AREA * 1.4,
      z: (Math.random() * 2 - 1) * HALF_AREA,
      drift: (Math.random() - 0.5) / 5,
      rise: Math.random() / 5,
    }));
    const color = new pixi_js.Color();
    let tint = 0;
    let visibleCount = 0;
    const apply = () => {
      object.visible = settings.enabled;
      tint = (0, _pixi_3d.packParticleColor)(color.setValue(settings.color).toNumber(), 0.8);
      if (settings.count < visibleCount) object.clear();
      visibleCount = settings.count;
    };
    const update = (delta, centerX, centerZ) => {
      if (!settings.enabled) return;
      const speed = settings.speed * delta * 60;
      const maxY = HALF_AREA * 1.4;
      for (let index = 0; index < settings.count; index++) {
        const particle = particles[index];
        particle.x = wrapCoord(particle.x + particle.drift * speed * settings.randomness, centerX, HALF_AREA);
        particle.y -= particle.rise * speed;
        particle.z = wrapCoord(particle.z, centerZ, HALF_AREA);
        if (particle.y <= 0.05) particle.y = maxY;
        object.writePacked(index, particle.x, particle.y, particle.z, settings.size, 0, tint);
      }
      object.upload();
    };
    apply();
    return {
      settings,
      object,
      apply,
      update,
    };
  }
  // src/scene/fog.ts
  function createFog(view) {
    const settings = {
      enabled: true,
      color: '#0f1b1a',
      density: 0.06,
    };
    const apply = () => {
      view.fog = settings.enabled
        ? {
            type: 'exp2',
            color: settings.color,
            density: settings.density,
          }
        : null;
    };
    apply();
    return {
      settings,
      apply,
    };
  }
  // src/scene/postProcessing.ts
  var GradeEffect = class extends _pixi_3d.PostEffect {
    uniforms = new pixi_js.UniformGroup({
      uGrade: {
        value: /* @__PURE__ */ new Float32Array(3),
        type: 'vec3<f32>',
      },
      uVignette: {
        value: /* @__PURE__ */ new Float32Array(2),
        type: 'vec2<f32>',
      },
      uReinhard: {
        value: -1,
        type: 'f32',
      },
    });
    fragment = {
      gl: `vec4 effect(vec2 uv) {
  vec4 color = sampleColor(uv);
  float average = dot(color.rgb, vec3(1.0 / 3.0));
  vec3 rgb = mix(color.rgb, vec3(average), uGrade.x);
  rgb = (rgb - 0.5 + uGrade.y) * uGrade.z + 0.5;
  float edge = length(uv - 0.5) * (uVignette.x + uVignette.y);
  rgb = max(rgb * (1.0 - smoothstep(uVignette.y * 0.799, 0.8, edge)), vec3(0.0));
  if (uReinhard >= 0.0) {
    rgb *= uReinhard;
    float luminance = 10.0 * dot(rgb, vec3(0.2126, 0.7152, 0.0722));
    rgb *= luminance * (1.0 + luminance * 0.0001) / (1.0 + luminance);
  }
  return vec4(rgb, color.a);
}`,
      gpu: `fn effect(uv: vec2<f32>) -> vec4<f32> {
  let color = sampleColor(uv);
  let average = dot(color.rgb, vec3<f32>(1.0 / 3.0));
  var rgb = mix(color.rgb, vec3<f32>(average), fx.uGrade.x);
  rgb = (rgb - 0.5 + fx.uGrade.y) * fx.uGrade.z + 0.5;
  let edge = length(uv - 0.5) * (fx.uVignette.x + fx.uVignette.y);
  rgb = max(rgb * (1.0 - smoothstep(fx.uVignette.y * 0.799, 0.8, edge)), vec3<f32>(0.0));
  if (fx.uReinhard >= 0.0) {
    rgb *= fx.uReinhard;
    let luminance = 10.0 * dot(rgb, vec3<f32>(0.2126, 0.7152, 0.0722));
    rgb *= luminance * (1.0 + luminance * 0.0001) / (1.0 + luminance);
  }
  return vec4<f32>(rgb, color.a);
}`,
    };
    configure(average, brightness, contrast, darkness, offset, exposure) {
      const gain = contrast > 0 ? 1 / Math.max(1 - contrast, 0.001) : 1 + contrast;
      this.uniforms.uniforms.uGrade.set([average, brightness, gain]);
      this.uniforms.uniforms.uVignette.set([darkness, offset]);
      this.uniforms.uniforms.uReinhard = exposure;
      this.uniforms.update();
    }
  };
  var ScreenTiltShiftEffect = class extends _pixi_3d.PostEffect {
    inputMips = true;
    uniforms = new pixi_js.UniformGroup({
      uFocus: {
        value: /* @__PURE__ */ new Float32Array(4),
        type: 'vec4<f32>',
      },
    });
    fragment = {
      gl: `vec4 effect(vec2 uv) {
  float distanceToFocus = abs(1.0 - 2.0 * uv.y - uFocus.x);
  float blur = smoothstep(uFocus.y, uFocus.y + max(uFocus.z, 0.001), distanceToFocus);
  return sampleColorLod(uv, log2(1.0 + blur * uFocus.w));
}`,
      gpu: `fn effect(uv: vec2<f32>) -> vec4<f32> {
  let distanceToFocus = abs(1.0 - 2.0 * uv.y - fx.uFocus.x);
  let blur = smoothstep(fx.uFocus.y, fx.uFocus.y + max(fx.uFocus.z, 0.001), distanceToFocus);
  return sampleColorLod(uv, log2(1.0 + blur * fx.uFocus.w));
}`,
    };
    constructor() {
      super({ stage: 'afterToneMapping' });
    }
    configure(offset, focusArea, feather, radius) {
      this.uniforms.uniforms.uFocus.set([offset, focusArea, feather, radius]);
      this.uniforms.update();
    }
  };
  function createPostProcessing(view) {
    const settings = {
      bloom: {
        enabled: true,
        intensity: 6,
        threshold: 0.15,
        radius: 0.85,
      },
      colorAverage: {
        enabled: true,
        opacity: 0.19,
      },
      brightnessContrast: {
        enabled: true,
        brightness: -0.012,
        contrast: 0.06,
      },
      vignette: {
        enabled: true,
        darkness: 0.9,
        offset: 0.1,
      },
      toneMapping: {
        enabled: true,
        mode: 'reinhard2',
        exposure: 0.94,
      },
      tiltShift: {
        enabled: true,
        offset: 0.02,
        focusArea: 0.65,
        feather: 0.45,
        radius: 12,
      },
    };
    const bloom = new _pixi_3d_extras.BloomEffect({
      smoothing: 0.3,
      screenBlend: true,
      levels: 7,
    });
    const grade = new GradeEffect();
    const tiltShift = new ScreenTiltShiftEffect();
    view.passes = [bloom, grade, tiltShift];
    const apply = () => {
      const glow = settings.bloom;
      bloom.enabled = glow.enabled;
      bloom.intensity = glow.intensity;
      bloom.threshold = glow.threshold;
      bloom.radius = glow.radius;
      const average = settings.colorAverage;
      const contrast = settings.brightnessContrast;
      const vignette = settings.vignette;
      const tone = settings.toneMapping;
      const mode = tone.enabled ? tone.mode : 'none';
      const sceneCurve = mode === 'reinhard2';
      grade.enabled = average.enabled || contrast.enabled || vignette.enabled || sceneCurve;
      grade.configure(
        average.enabled ? average.opacity : 0,
        contrast.enabled ? contrast.brightness : 0,
        contrast.enabled ? contrast.contrast : 0,
        vignette.enabled ? vignette.darkness : 0,
        vignette.enabled ? vignette.offset : 0,
        sceneCurve ? tone.exposure : -1,
      );
      view.toneMapping = sceneCurve ? 'none' : mode;
      view.exposure = tone.enabled && !sceneCurve ? tone.exposure : 1;
      const shift = settings.tiltShift;
      tiltShift.enabled = shift.enabled;
      tiltShift.configure(shift.offset, Math.max(0, shift.focusArea - shift.feather), shift.feather, shift.radius);
    };
    apply();
    return {
      settings,
      apply,
    };
  }
  // src/scene/sky.ts
  const SKY_ROTATION_Y = -Math.PI * 0.095;
  let cachedEnvironment = null;
  async function loadSkyboxEnvironment() {
    const url = hd2dAssetUrl('skybox.hdr');
    const buffer = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const fail = () => reject(/* @__PURE__ */ new Error(`Failed to load: ${url}`));
      xhr.open('GET', url);
      xhr.responseType = 'arraybuffer';
      xhr.onload = () => {
        if (xhr.status < 400 && xhr.response instanceof ArrayBuffer) resolve(xhr.response);
        else fail();
      };
      xhr.onerror = fail;
      xhr.send();
    });
    const panorama = (0, _pixi_3d.parseRadianceHdr)(buffer);
    const { width, height, data } = panorama;
    const stride = width * 3;
    const shift = Math.round((-SKY_ROTATION_Y * width) / (2 * Math.PI)) * 3;
    const wrapped = new Float32Array(shift);
    for (let y = 0; y < height; y++) {
      const start = y * stride;
      const end = start + stride;
      wrapped.set(data.subarray(end - shift, end));
      data.copyWithin(start + shift, start, end - shift);
      data.set(wrapped, start);
    }
    return (0, _pixi_3d.equirectToCube)(panorama, 512, 'skybox');
  }
  function loadSkybox() {
    cachedEnvironment ??= loadSkyboxEnvironment().catch((error) => {
      cachedEnvironment = null;
      throw error;
    });
    return cachedEnvironment;
  }
  // src/scene/spriteShadow.ts
  const imageDataCache = /* @__PURE__ */ new WeakMap();
  const silhouetteCache = /* @__PURE__ */ new WeakMap();
  const EMPTY_FOOTPRINT = {
    bottomInsetRatio: 0,
    widthRatio: 0,
    centerOffsetRatio: 0,
  };
  const footprintCache = /* @__PURE__ */ new WeakMap();
  const shadowMaterial = new _pixi_3d.FlatMaterial();
  function readPixels(texture) {
    const source = texture.source;
    const cached = imageDataCache.get(source);
    if (cached) return cached;
    const resource = source.resource;
    if (!resource || source.pixelWidth <= 0 || source.pixelHeight <= 0) return null;
    const canvas = document.createElement('canvas');
    canvas.width = source.pixelWidth;
    canvas.height = source.pixelHeight;
    const context = canvas.getContext('2d');
    if (!context) return null;
    context.drawImage(resource, 0, 0);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
    imageDataCache.set(source, pixels);
    return pixels;
  }
  function buildSilhouette(texture) {
    const cached = silhouetteCache.get(texture);
    if (cached) return cached;
    const pixelData = readPixels(texture);
    if (!pixelData) return _pixi_3d.Geometry3D.EMPTY;
    const { data, width: stride } = pixelData;
    const resolution = texture.source.resolution;
    const frame = texture.frame;
    const left = Math.round(frame.x * resolution);
    const top = Math.round(frame.y * resolution);
    const width = Math.round(frame.width * resolution);
    const height = Math.round(frame.height * resolution);
    if (width <= 0 || height <= 0) return _pixi_3d.Geometry3D.EMPTY;
    const positions = [];
    const indices = [];
    for (let y = 0; y < height; y++) {
      const row = ((top + y) * stride + left) * 4;
      let start = -1;
      for (let x = 0; x <= width; x++)
        if (x < width && (data[row + x * 4 + 3] ?? 0) >= 128) {
          if (start === -1) start = x;
        } else if (start !== -1) {
          const index = positions.length / 3;
          const x0 = start / width - 0.5;
          const x1 = x / width - 0.5;
          const y0 = 0.5 - (y + 1) / height;
          const y1 = 0.5 - y / height;
          positions.push(x0, y0, 0, x1, y0, 0, x1, y1, 0, x0, y1, 0);
          indices.push(index, index + 1, index + 2, index, index + 2, index + 3);
          indices.push(index + 2, index + 1, index, index + 3, index + 2, index);
          start = -1;
        }
    }
    const geometry =
      positions.length > 0
        ? new _pixi_3d.Geometry3D({
            positions: new Float32Array(positions),
            indices: new Uint32Array(indices),
          })
        : _pixi_3d.Geometry3D.EMPTY;
    silhouetteCache.set(texture, geometry);
    return geometry;
  }
  /** Computes cached opaque base bounds (bottom inset, horizontal width, center offset) of a texture frame. */
  function getSpriteFootprintMetrics(texture) {
    const cached = footprintCache.get(texture);
    if (cached) return cached;
    const pixelData = readPixels(texture);
    if (!pixelData) return EMPTY_FOOTPRINT;
    const { data, width: stride } = pixelData;
    const resolution = texture.source.resolution;
    const frame = texture.frame;
    const left = Math.round(frame.x * resolution);
    const top = Math.round(frame.y * resolution);
    const width = Math.round(frame.width * resolution);
    const height = Math.round(frame.height * resolution);
    if (width <= 0 || height <= 0) return EMPTY_FOOTPRINT;
    let firstOpaqueY = -1;
    let lastOpaqueY = -1;
    for (let y = 0; y < height; y++) {
      const row = ((top + y) * stride + left) * 4;
      for (let x = 0; x < width; x++)
        if ((data[row + x * 4 + 3] ?? 0) >= 128) {
          if (firstOpaqueY === -1) firstOpaqueY = y;
          lastOpaqueY = y;
          break;
        }
    }
    if (lastOpaqueY === -1) {
      footprintCache.set(texture, EMPTY_FOOTPRINT);
      return EMPTY_FOOTPRINT;
    }
    const visibleHeight = lastOpaqueY - firstOpaqueY + 1;
    const baseBandHeight = Math.max(Math.min(visibleHeight, 6), Math.ceil(visibleHeight * 0.35));
    const baseStartY = Math.max(firstOpaqueY, lastOpaqueY - baseBandHeight + 1);
    let minX = width;
    let maxX = -1;
    for (let y = baseStartY; y <= lastOpaqueY; y++) {
      const row = ((top + y) * stride + left) * 4;
      for (let x = 0; x < width; x++)
        if ((data[row + x * 4 + 3] ?? 0) >= 128) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
        }
    }
    const metrics = {
      bottomInsetRatio: (height - 1 - lastOpaqueY) / height,
      widthRatio: maxX >= minX ? (maxX - minX + 1) / width : 0,
      centerOffsetRatio: maxX >= minX ? ((minX + maxX + 1) * 0.5) / width - 0.5 : 0,
    };
    footprintCache.set(texture, metrics);
    return metrics;
  }
  /** Returns the fraction of transparent padding rows at the bottom of a texture frame. */
  function getBottomInsetRatio(texture) {
    return getSpriteFootprintMetrics(texture).bottomInsetRatio;
  }
  function addSpriteShadow(sprite) {
    const shadow = new _pixi_3d.Mesh3D({
      geometry: buildSilhouette(sprite.texture),
      material: shadowMaterial,
      castShadow: true,
    });
    shadow.disablePass('opaque');
    sprite.addChild(shadow);
    return {
      update: (texture) => {
        shadow.geometry = buildSilhouette(texture);
      },
      setVisible: (visible) => {
        shadow.visible = visible;
        shadow.castShadow = visible;
      },
    };
  }
  // src/scene/tilemap/tileConfig.ts
  const DEG_TO_RAD = Math.PI / 180;
  const DEFAULT_TAG_RULES = [
    [
      1,
      {
        mode: 'stand',
        jitter: null,
        rotationY: null,
      },
    ],
    [
      2,
      {
        mode: 'stand',
        jitter: 0,
        rotationY: 0,
      },
    ],
  ];
  function parseStandMode(modeRaw, billboardRaw) {
    const raw = (modeRaw ?? billboardRaw)?.trim().toLowerCase();
    if (!raw) return null;
    switch (raw) {
      case 'flat':
      case 'none':
      case 'false':
        return 'flat';
      case 'stand':
      case 'card':
        return 'stand';
      case 'cylindrical':
      case 'billboard':
      case 'true':
        return 'cylindrical';
      case 'spherical':
        return 'spherical';
      default:
        return null;
    }
  }
  function parseRotationRad(attrs) {
    const rot = parseNumber(attrs.rot ?? attrs.yaw);
    if (rot !== void 0) return rot;
    const deg = parseNumber(attrs.deg);
    if (deg !== void 0) return deg * DEG_TO_RAD;
    return null;
  }
  function parseOffset(attrs) {
    let x = parseNumber(attrs.offsetx) ?? null;
    let y = parseNumber(attrs.offsety) ?? null;
    let z = parseNumber(attrs.offsetz) ?? null;
    if (attrs.offset) {
      const parts = attrs.offset.split(',').map((s) => Number(s.trim()));
      if (Number.isFinite(parts[0])) x = parts[0];
      if (Number.isFinite(parts[1])) y = parts[1];
      if (Number.isFinite(parts[2])) z = parts[2];
    }
    return {
      x,
      y,
      z,
    };
  }
  function matchTileTags(note) {
    const results = [];
    for (const match of note.matchAll(/<hd2d-tile([^>]*)>/gi)) {
      const raw = match[1] ?? '';
      results.push(raw.endsWith('/') ? raw.slice(0, -1) : raw);
    }
    return results;
  }
  /**
   * Parses <hd2d-tile tag="..." mode="..." jitter="..." rot="..." deg="..."> tags from a Tileset's Note.
   * Unspecified tags keep defaults (tag 1 = standing card with subtle jitter, tag 2 = straight standing card).
   */
  function parseTilesetTileRules(note) {
    const rules = new Map(DEFAULT_TAG_RULES.map(([tag, rule]) => [tag, { ...rule }]));
    if (!note) return rules;
    for (const attrText of matchTileTags(note)) {
      const attrs = parseAttrs(attrText);
      if (!attrs.tag) continue;
      const tags = attrs.tag
        .split(',')
        .map((s) => Number.parseInt(s.trim(), 10))
        .filter((n) => Number.isInteger(n) && n >= 1 && n <= 7);
      if (tags.length === 0) continue;
      const mode = parseStandMode(attrs.mode, attrs.billboard) ?? 'stand';
      const rotationY = parseRotationRad(attrs);
      const jitterRaw = attrs.jitter?.trim().toLowerCase();
      let jitter = 0;
      if (jitterRaw === 'auto') jitter = null;
      else if (jitterRaw !== void 0) jitter = Math.max(0, parseNumber(jitterRaw) ?? 0);
      for (const tag of tags)
        rules.set(tag, {
          mode,
          jitter,
          rotationY,
        });
    }
    return rules;
  }
  /**
   * Parses <hd2d-tile x="..." y="..." layer="..." deg="..." rot="..." mode="..." offset="..."> tags from a Map's Note.
   * Editor layer accepts 2..4 (mapped to internal z = 1..3); z directly accepts 1..3.
   */
  function parseMapTileOverrides(note) {
    const overrides = [];
    if (!note) return overrides;
    for (const attrText of matchTileTags(note)) {
      const attrs = parseAttrs(attrText);
      const x = parseNumber(attrs.x);
      const y = parseNumber(attrs.y);
      if (x === void 0 || y === void 0 || !Number.isInteger(x) || !Number.isInteger(y)) continue;
      let layerZ = null;
      const editorLayer = parseNumber(attrs.layer);
      if (editorLayer !== void 0 && Number.isInteger(editorLayer) && editorLayer >= 2 && editorLayer <= 4)
        layerZ = editorLayer - 1;
      else {
        const rawZ = parseNumber(attrs.z);
        if (rawZ !== void 0 && Number.isInteger(rawZ) && rawZ >= 1 && rawZ <= 3) layerZ = rawZ;
      }
      const mode = parseStandMode(attrs.mode, attrs.billboard);
      const rotationY = parseRotationRad(attrs);
      const offset = parseOffset(attrs);
      overrides.push({
        x,
        y,
        layerZ,
        mode,
        rotationY,
        offsetX: offset.x,
        offsetY: offset.y,
        offsetZ: offset.z,
      });
    }
    return overrides;
  }
  /** Extracts the Terrain Tag (1..7) for B-E tiles only; A1-A5 always return 0 and stay flat on the ground. */
  function getStandingTerrainTag(tileId, flags) {
    if (!Tilemap.isVisibleTile(tileId) || Tilemap.isAutotile(tileId) || Tilemap.isTileA5(tileId)) return 0;
    return (flags[tileId] ?? 0) >> 12;
  }
  /** Finds the effective map-level override for a single tile cell and internal B-E layer z (1..3). */
  function findMapTileOverride(x, y, layerZ, overrides) {
    let wildcard = null;
    let exact = null;
    for (const item of overrides) {
      if (item.x !== x || item.y !== y) continue;
      if (item.layerZ === layerZ) exact = item;
      else if (item.layerZ === null) wildcard = item;
    }
    return exact ?? wildcard;
  }
  /** Resolves the standing rule for a B-E tile at (x, y, z), or null if it should remain flat on the ground. */
  function resolveStandingTileRule(x, y, layerZ, tileId, flags, rules, overrides) {
    const tag = getStandingTerrainTag(tileId, flags);
    const baseRule = tag > 0 ? (rules.get(tag) ?? null) : null;
    const override = overrides.length > 0 ? findMapTileOverride(x, y, layerZ, overrides) : null;
    const effectiveMode = override?.mode ?? baseRule?.mode ?? 'flat';
    if (effectiveMode === 'flat') return null;
    return {
      mode: effectiveMode,
      jitter: baseRule?.jitter ?? 0,
      rotationY: override?.rotationY ?? baseRule?.rotationY ?? null,
    };
  }
  // src/scene/tilemap/billboardTiles.ts
  const slicedTileCache = /* @__PURE__ */ new WeakMap();
  function getSlicedTileRegion(source, sx, sy, sw, sh) {
    let cache = slicedTileCache.get(source);
    if (!cache) {
      cache = /* @__PURE__ */ new Map();
      slicedTileCache.set(source, cache);
    }
    const key = `${sx},${sy},${sw},${sh}`;
    let texture = cache.get(key);
    if (!texture) {
      texture = new pixi_js.Texture({
        source,
        frame: new pixi_js.Rectangle(sx, sy, sw, sh),
      });
      cache.set(key, texture);
    }
    return texture;
  }
  function decodeTileCell(x, y, tileId, terrainTag, rule) {
    return {
      x,
      y,
      setNumber: 5 + Math.floor(tileId / 256),
      sheetCol: (Math.floor(tileId / 128) % 2) * 8 + (tileId % 8),
      sheetRow: Math.floor((tileId % 256) / 8) % 16,
      terrainTag,
      rule,
    };
  }
  /** Deterministic subtle yaw variation from map position so tiles look handcrafted. */
  function subtleYaw(x, y, spanCols, spanRows, explicitJitter) {
    const maxAngle = explicitJitter !== null ? explicitJitter : spanRows >= 3 ? 0.28 : spanCols >= 2 ? 0.16 : 0.12;
    if (maxAngle <= 0) return 0;
    const hash = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return ((hash - Math.floor(hash)) * 2 - 1) * maxAngle;
  }
  function toPixiBillboardMode(mode) {
    if (mode === 'cylindrical') return 'cylindrical';
    if (mode === 'spherical') return 'spherical';
    return 'none';
  }
  /**
   * Finds a map-level <hd2d-tile> override matching any cell in a grouped multi-tile cluster.
   * Exact layer matches take precedence over wildcard (layer-less) matches.
   */
  function findClusterOverride(cluster, layerZ, overrides) {
    if (overrides.length === 0) return null;
    let fallback = null;
    for (const cell of cluster) {
      const match = findMapTileOverride(cell.x, cell.y, layerZ, overrides);
      if (!match) continue;
      if (match.layerZ === layerZ) return match;
      fallback = match;
    }
    return fallback;
  }
  /**
   * Scans native B-E tile layers (z=1..3) for standing tiles resolved via Tileset & Map
   * <hd2d-tile> rules and groups contiguous adjacent tiles into unified 3D cards/billboards.
   */
  function createTilemapBillboards(bitmaps, tileRules, mapOverrides) {
    const map = $gameMap;
    const mapWidth = map.width();
    const mapHeight = map.height();
    const tileWidth = map.tileWidth();
    const tileHeight = map.tileHeight();
    const flags = map.tilesetFlags();
    const data = map.data();
    const layerSize = mapWidth * mapHeight;
    const pixelSize = TILE_BILLBOARD_PIXEL_SIZE;
    const group = new _pixi_3d.Container3D({ label: '原生立牌景物' });
    const neighbors = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    for (let z = 1; z <= 3; z++) {
      const offset = z * layerSize;
      const cellMap = /* @__PURE__ */ new Map();
      for (let y = 0; y < mapHeight; y++)
        for (let x = 0; x < mapWidth; x++) {
          const idx = y * mapWidth + x;
          const tileId = data[offset + idx] ?? 0;
          if (tileId <= 0) continue;
          const rule = resolveStandingTileRule(x, y, z, tileId, flags, tileRules, mapOverrides);
          if (rule) {
            const tag = getStandingTerrainTag(tileId, flags);
            cellMap.set(idx, decodeTileCell(x, y, tileId, tag, rule));
          }
        }
      const visited = /* @__PURE__ */ new Set();
      for (const [startIdx, startCell] of cellMap) {
        if (visited.has(startIdx)) continue;
        const cluster = [];
        const queue = [startCell];
        visited.add(startIdx);
        while (queue.length > 0) {
          const current = queue.shift();
          cluster.push(current);
          for (const [dx, dy] of neighbors) {
            const nx = current.x + dx;
            const ny = current.y + dy;
            if (nx < 0 || nx >= mapWidth || ny < 0 || ny >= mapHeight) continue;
            const nIdx = ny * mapWidth + nx;
            if (visited.has(nIdx)) continue;
            const next = cellMap.get(nIdx);
            if (!next) continue;
            if (
              next.setNumber === current.setNumber &&
              next.terrainTag === current.terrainTag &&
              next.rule.mode === current.rule.mode &&
              next.sheetCol - current.sheetCol === dx &&
              next.sheetRow - current.sheetRow === dy
            ) {
              visited.add(nIdx);
              queue.push(next);
            }
          }
        }
        let minX = 1e400;
        let maxX = -1e400;
        let maxY = -1e400;
        let minCol = 1e400;
        let maxCol = -1e400;
        let minRow = 1e400;
        let maxRow = -1e400;
        for (const cell of cluster) {
          if (cell.x < minX) minX = cell.x;
          if (cell.x > maxX) maxX = cell.x;
          if (cell.y > maxY) maxY = cell.y;
          if (cell.sheetCol < minCol) minCol = cell.sheetCol;
          if (cell.sheetCol > maxCol) maxCol = cell.sheetCol;
          if (cell.sheetRow < minRow) minRow = cell.sheetRow;
          if (cell.sheetRow > maxRow) maxRow = cell.sheetRow;
        }
        const bitmap = bitmaps[startCell.setNumber];
        if (!bitmap || !bitmap.textureSource) continue;
        const spanCols = maxCol - minCol + 1;
        const spanRows = maxRow - minRow + 1;
        const sx = minCol * tileWidth;
        const sy = minRow * tileHeight;
        const sw = spanCols * tileWidth;
        const sh = spanRows * tileHeight;
        const texture = getSlicedTileRegion(bitmap.textureSource, sx, sy, sw, sh);
        const worldHeight = sh * pixelSize;
        const bottomInset = getBottomInsetRatio(texture) * worldHeight;
        const { x: worldX, z: worldZ } = tileToWorld((minX + maxX) * 0.5, maxY, mapWidth, mapHeight);
        const layerZBias = (z - 2) * 0.02;
        const mapOverride = findClusterOverride(cluster, z, mapOverrides);
        const billboardMode = toPixiBillboardMode(mapOverride?.mode ?? startCell.rule.mode);
        let rotationY = 0;
        if (billboardMode === 'none')
          rotationY =
            mapOverride?.rotationY ??
            startCell.rule.rotationY ??
            subtleYaw(minX, maxY, spanCols, spanRows, startCell.rule.jitter);
        const posX = worldX + (mapOverride?.offsetX ?? 0);
        const posY = -bottomInset + (mapOverride?.offsetY ?? 0);
        const posZ = worldZ + layerZBias + (mapOverride?.offsetZ ?? 0);
        const sprite = new _pixi_3d.Sprite3D({
          texture,
          pixelSize,
          anchor: {
            x: 0.5,
            y: 1,
          },
          position: {
            x: posX,
            y: posY,
            z: posZ,
          },
          rotation: {
            x: 0,
            y: rotationY,
            z: 0,
          },
          billboardMode,
          material: new _pixi_3d.Material3D({
            doubleSided: true,
            alphaMode: 'mask',
            metallic: spanRows >= 2 ? 0.35 : 0.15,
            roughness: 1,
          }),
          receiveShadow: true,
        });
        addSpriteShadow(sprite);
        group.addChild(sprite);
      }
    }
    return group;
  }
  // src/scene/tilemap/tilesetUtils.ts
  function waitBitmapReady(bitmap) {
    if (bitmap.isReady() || bitmap.isError()) return Promise.resolve(bitmap);
    return new Promise((resolve) => {
      bitmap.addLoadListener(() => resolve(bitmap));
    });
  }
  async function loadTilesetBitmaps(tilesetNames) {
    const bitmaps = tilesetNames.map((name) => ImageManager.loadTileset(name));
    await Promise.all(bitmaps.map(waitBitmapReady));
    for (const bitmap of bitmaps) if (bitmap.textureSource) bitmap.textureSource.scaleMode = 'nearest';
    return bitmaps;
  }
  function createFlatNormalBitmap(width = 48, height = 48) {
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(width, 1);
    canvas.height = Math.max(height, 1);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgb(128, 128, 255)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return {
      width: canvas.width,
      height: canvas.height,
      canvas,
      image: null,
      isReady: () => true,
      isError: () => false,
      addLoadListener: (cb) => cb(void 0),
    };
  }
  function loadOptionalNormalBitmap(tilesetName, fallbackWidth, fallbackHeight) {
    if (!tilesetName) return Promise.resolve(createFlatNormalBitmap(fallbackWidth, fallbackHeight));
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          image: img,
          canvas: null,
          isReady: () => true,
          isError: () => false,
          addLoadListener: (cb) => cb(void 0),
        });
      };
      img.onerror = () => {
        resolve(createFlatNormalBitmap(fallbackWidth, fallbackHeight));
      };
      img.src = `img/tilesets/${encodeURIComponent(tilesetName).replace(/%2F/g, '/').replace(/%24/g, '$')}-normal.png`;
    });
  }
  // src/scene/tilemap/groundTilemap.ts
  function stripBillboardTiles(data, width, height, flags, tileRules, mapOverrides, stripShadows) {
    const layerSize = width * height;
    const out = data.slice();
    for (let z = 1; z < 4; z++) {
      const offset = z * layerSize;
      for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++) {
          const idx = offset + y * width + x;
          const tileId = out[idx] ?? 0;
          if (tileId > 0 && resolveStandingTileRule(x, y, z, tileId, flags, tileRules, mapOverrides)) out[idx] = 0;
        }
    }
    if (stripShadows) {
      const shadowOffset = 4 * layerSize;
      for (let i = 0; i < layerSize; i++) out[shadowOffset + i] = 0;
    }
    return out;
  }
  function hasAnimatedA1Tiles(data, width, height) {
    const layerSize = width * height;
    for (let z = 0; z < 2; z++) {
      const offset = z * layerSize;
      for (let i = 0; i < layerSize; i++) {
        const tileId = data[offset + i] ?? 0;
        if (Tilemap.isTileA1(tileId)) return true;
      }
    }
    return false;
  }
  function buildOffscreenTilemap(mapWidth, mapHeight, tileWidth, tileHeight, data, flags, bitmaps) {
    const tilemap = new Tilemap();
    tilemap._margin = 0;
    tilemap.animationFrame = 0;
    tilemap.tileWidth = tileWidth;
    tilemap.tileHeight = tileHeight;
    tilemap.width = mapWidth * tileWidth;
    tilemap.height = mapHeight * tileHeight;
    tilemap.horizontalWrap = false;
    tilemap.verticalWrap = false;
    tilemap.flags = flags;
    tilemap.setData(mapWidth, mapHeight, data);
    tilemap.setBitmaps(bitmaps);
    tilemap.refresh();
    return tilemap;
  }
  async function createTilemapGround(colorBitmaps, tileRules, mapOverrides, isCurrent) {
    const map = $gameMap;
    const tileset = map.tileset();
    const mapWidth = map.width();
    const mapHeight = map.height();
    const tileWidth = map.tileWidth();
    const tileHeight = map.tileHeight();
    const flags = map.tilesetFlags();
    const rawData = map.data();
    const colorData = stripBillboardTiles(rawData, mapWidth, mapHeight, flags, tileRules, mapOverrides, false);
    const normalData = stripBillboardTiles(rawData, mapWidth, mapHeight, flags, tileRules, mapOverrides, true);
    const animated = hasAnimatedA1Tiles(colorData, mapWidth, mapHeight);
    const tilesetNames = tileset?.tilesetNames ?? [];
    const normalBitmaps = await Promise.all(
      tilesetNames.map((name, index) => {
        const ref = colorBitmaps[index];
        return loadOptionalNormalBitmap(name, ref?.width || 48, ref?.height || 48);
      }),
    );
    if (!isCurrent()) return;
    const pixelWidth = mapWidth * tileWidth;
    const pixelHeight = mapHeight * tileHeight;
    const colorTilemap = buildOffscreenTilemap(
      mapWidth,
      mapHeight,
      tileWidth,
      tileHeight,
      colorData,
      flags,
      colorBitmaps,
    );
    const normalTilemap = buildOffscreenTilemap(
      mapWidth,
      mapHeight,
      tileWidth,
      tileHeight,
      normalData,
      flags,
      normalBitmaps,
    );
    const colorTarget = pixi_js.RenderTexture.create({
      width: pixelWidth,
      height: pixelHeight,
      resolution: 1,
      scaleMode: 'nearest',
    });
    const normalTarget = pixi_js.RenderTexture.create({
      width: pixelWidth,
      height: pixelHeight,
      resolution: 1,
      scaleMode: 'nearest',
    });
    const renderTilemapToTarget = (tilemap, target) => {
      Graphics.app.renderer.render({
        container: tilemap,
        target,
        clear: true,
      });
    };
    renderTilemapToTarget(colorTilemap, colorTarget);
    renderTilemapToTarget(normalTilemap, normalTarget);
    const worldWidth = mapWidth * TILE_UNIT;
    const worldHeight = mapHeight * TILE_UNIT;
    const group = new _pixi_3d.Container3D({ label: '原生地面' });
    const mainGround = new _pixi_3d.Mesh3D({
      geometry: new _pixi_3d.PlaneGeometry({
        width: worldWidth,
        height: worldHeight,
        flipV: false,
      }),
      material: new _pixi_3d.Material3D({
        baseColorTexture: colorTarget,
        normalTexture: normalTarget,
        normalScale: 0.45,
        roughness: 1,
      }),
      rotation: {
        x: -Math.PI / 2,
        y: 0,
        z: 0,
      },
      castShadow: false,
      receiveShadow: true,
    });
    group.addChild(mainGround);
    let lastFrame = colorTilemap.animationFrame;
    const update = () => {
      if (!animated) return;
      colorTilemap.update();
      if (colorTilemap.animationFrame !== lastFrame) {
        lastFrame = colorTilemap.animationFrame;
        normalTilemap.animationFrame = lastFrame;
        renderTilemapToTarget(colorTilemap, colorTarget);
        renderTilemapToTarget(normalTilemap, normalTarget);
      }
    };
    const destroy = () => {
      mainGround.destroy({
        geometry: true,
        material: true,
      });
      colorTilemap.destroy();
      normalTilemap.destroy();
      colorTarget.destroy(true);
      normalTarget.destroy(true);
    };
    return {
      object: group,
      update,
      destroy,
    };
  }
  // src/scene/stage/index.ts
  async function createStage(isCurrent) {
    const tileset = $gameMap.tileset();
    const dataMap = $dataMap;
    const tileRules = parseTilesetTileRules(tileset?.note ?? '');
    const mapOverrides = parseMapTileOverrides(dataMap?.note ?? '');
    const colorBitmaps = await loadTilesetBitmaps(tileset?.tilesetNames ?? []);
    if (!isCurrent()) return;
    const tilemapGround = await createTilemapGround(colorBitmaps, tileRules, mapOverrides, isCurrent);
    if (!tilemapGround) return;
    if (!isCurrent()) {
      tilemapGround.destroy();
      tilemapGround.object.destroy({ children: true });
      return;
    }
    const tilemapBillboards = createTilemapBillboards(colorBitmaps, tileRules, mapOverrides);
    const group = new _pixi_3d.Container3D({ label: '场景' });
    const eventLights = new EventLightManager();
    group.addChild(tilemapGround.object, tilemapBillboards, eventLights.object);
    const moonLight = new _pixi_3d.DirectionalLight({
      color: 0x9bb5d6,
      intensity: 0.55,
      castShadow: true,
      shadow: {
        cascades: 1,
        maxDistance: 12,
        bias: 5e-4,
      },
    });
    moonLight.position.set(-4, 7, 5);
    moonLight.lookAt({
      x: 0,
      y: 0,
      z: 0,
    });
    group.addChild(moonLight);
    eventLights.syncAllEvents();
    return {
      object: group,
      getSpriteLights: () => eventLights.getSpriteLights(),
      update: (elapsed) => {
        tilemapGround.update();
        eventLights.update(elapsed);
      },
      destroy: () => {
        tilemapGround.destroy();
        eventLights.destroy();
        group.destroy({ children: true });
      },
    };
  }
  // src/state.ts
  const persistedHd2dState = {};
  // src/scene/eventSpriteConfig.ts
  const DEFAULT_EVENT_SPRITE_CONFIG = {
    offsetX: 0,
    offsetY: 0,
    offsetZ: 0,
    hasCustomOffsetY: false,
    scale: 1,
    pixelSize: null,
    anchorX: 0.5,
    anchorY: 1,
    emissive: 0,
    emissiveColor: 0xffffff,
    castShadow: null,
    groundShadow: null,
    sway: 0,
    swaySpeed: 2,
    swayPitch: 0,
    swayPitchSpeed: 3,
    breathe: null,
    rotationY: 0,
    billboardMode: 'none',
    blend: false,
    collider: { mode: 'auto' },
  };
  function applySpriteTag(target, attrText) {
    const a = parseAttrs(attrText);
    let offsetX = parseNumber(a.x);
    let offsetY = parseNumber(a.y);
    let offsetZ = parseNumber(a.z);
    if (a.offset) {
      const parts = a.offset.split(',').map((s) => Number(s.trim()));
      if (Number.isFinite(parts[0])) offsetX = parts[0];
      if (Number.isFinite(parts[1])) offsetY = parts[1];
      if (Number.isFinite(parts[2])) offsetZ = parts[2];
    }
    if (offsetX !== void 0) target.offsetX = offsetX;
    if (offsetY !== void 0) {
      target.offsetY = offsetY;
      target.hasCustomOffsetY = true;
    }
    if (offsetZ !== void 0) target.offsetZ = offsetZ;
    let anchorX = parseNumber(a.anchorx);
    let anchorY = parseNumber(a.anchory);
    if (a.anchor) {
      const parts = a.anchor.split(',').map((s) => Number(s.trim()));
      if (Number.isFinite(parts[0])) anchorX = parts[0];
      if (Number.isFinite(parts[1])) anchorY = parts[1];
    }
    if (anchorX !== void 0) target.anchorX = anchorX;
    if (anchorY !== void 0) target.anchorY = anchorY;
    const scale = parseNumber(a.scale);
    if (scale !== void 0 && scale > 0) target.scale = scale;
    const pixelSize = parseNumber(a.pixelsize);
    if (pixelSize !== void 0 && pixelSize > 0) target.pixelSize = pixelSize;
    if (a.emissive !== void 0) {
      if (a.emissive === 'true') target.emissive = 1;
      else if (a.emissive === 'false') target.emissive = 0;
      else target.emissive = Math.max(0, parseNumber(a.emissive) ?? 0);
    }
    const emissiveColor = parseColor(a.emissivecolor);
    if (emissiveColor !== void 0) target.emissiveColor = emissiveColor;
    const shadow = parseBoolean(a.shadow ?? a.castshadow);
    if (shadow !== void 0) target.castShadow = shadow;
    if (parseBoolean(a.noshadow) === true) target.castShadow = false;
    const groundShadow = parseBoolean(a.groundshadow);
    if (groundShadow !== void 0) target.groundShadow = groundShadow;
    const sway = a.sway === 'true' ? 0.05 : a.sway === 'false' ? 0 : parseNumber(a.sway);
    if (sway !== void 0) target.sway = sway;
    const swaySpeed = parseNumber(a.swayspeed);
    if (swaySpeed !== void 0) target.swaySpeed = swaySpeed;
    const swayPitch = a.swaypitch === 'true' ? 0.075 : a.swaypitch === 'false' ? 0 : parseNumber(a.swaypitch);
    if (swayPitch !== void 0) target.swayPitch = swayPitch;
    const swayPitchSpeed = parseNumber(a.swaypitchspeed);
    if (swayPitchSpeed !== void 0) target.swayPitchSpeed = swayPitchSpeed;
    const breathe = parseBoolean(a.breathe);
    if (breathe !== void 0) target.breathe = breathe;
    const rot = parseNumber(a.rot ?? a.yaw);
    if (rot !== void 0) target.rotationY = rot;
    const billboardRaw = a.billboard?.toLowerCase();
    if (billboardRaw === 'none' || billboardRaw === 'cylindrical' || billboardRaw === 'spherical')
      target.billboardMode = billboardRaw;
    const blend = parseBoolean(a.blend);
    if (blend !== void 0) target.blend = blend;
    if (a.collider !== void 0) {
      const raw = a.collider.trim().toLowerCase();
      if (raw === 'none' || raw === 'false' || raw === '0') target.collider = { mode: 'none' };
      else if (raw === 'auto' || raw === 'true') target.collider = { mode: 'auto' };
      else {
        const parts = raw.split(',').map((s) => Number(s.trim()));
        if (parts.length >= 2 && Number.isFinite(parts[0]) && Number.isFinite(parts[1]) && parts[0] > 0 && parts[1] > 0)
          target.collider = {
            mode: 'box',
            halfW: parts[0] * 0.5,
            halfD: parts[1] * 0.5,
          };
        else if (parts.length === 1 && Number.isFinite(parts[0]) && parts[0] > 0)
          target.collider = {
            mode: 'box',
            halfW: parts[0],
            halfD: parts[0],
          };
      }
    }
  }
  function applyTagsFromText(target, text) {
    for (const match of text.matchAll(/<hd2d-sprite([^>]*)>/gi)) {
      const raw = match[1] ?? '';
      applySpriteTag(target, raw.endsWith('/') ? raw.slice(0, -1) : raw);
    }
  }
  function resolveEventSpriteConfig(event) {
    const config = { ...DEFAULT_EVENT_SPRITE_CONFIG };
    const note = event.event()?.note ?? '';
    if (note) applyTagsFromText(config, note);
    const pageComments = extractEventPageComments(event);
    if (pageComments) applyTagsFromText(config, pageComments);
    return config;
  }
  // src/scene/groundShadow.ts
  function createBlobTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
    gradient.addColorStop(0.55, 'rgba(0, 0, 0, 0.55)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    return pixi_js.Texture.from(canvas);
  }
  let blobTexture;
  function createGroundShadow(width = 0.56, height = width, alpha = 0.78) {
    blobTexture ??= createBlobTexture();
    return new _pixi_3d.Sprite3D({
      texture: blobTexture,
      width,
      height,
      alpha,
      billboardMode: 'none',
      position: {
        x: 0,
        y: 0.004,
        z: 0,
      },
      rotation: {
        x: -Math.PI / 2,
        y: 0,
        z: 0,
      },
    });
  }
  // src/utils/spriteLighting.ts
  const lightPosition = new _pixi_3d.Vector3();
  function tintSprite(position, lights) {
    let red = 0.79;
    let green = 0.63;
    let blue = 0.54;
    for (const light of lights) {
      if (!light.visible || light.intensity <= 0) continue;
      const distance = light.getGlobalPosition(lightPosition).distanceTo(position);
      const falloff = Math.max(0, 1 - distance / (light.range || 4));
      const strength = 0.3 * Math.min(light.intensity / 10, 1) * falloff ** 2;
      red += light.color.red * strength;
      green += light.color.green * strength;
      blue += light.color.blue * strength;
    }
    return [Math.min(red, 1), Math.min(green, 1), Math.min(blue, 1)];
  }
  // src/sprites/Sprite_Hd2dCharacter.ts
  const frameTextureCache = /* @__PURE__ */ new WeakMap();
  function getSlicedFrame(source, sx, sy, pw, ph) {
    let cache = frameTextureCache.get(source);
    if (!cache) {
      cache = /* @__PURE__ */ new Map();
      frameTextureCache.set(source, cache);
    }
    const key = `${sx},${sy},${pw},${ph}`;
    let texture = cache.get(key);
    if (!texture) {
      texture = new pixi_js.Texture({
        source,
        frame: new pixi_js.Rectangle(sx, sy, pw, ph),
      });
      cache.set(key, texture);
    }
    return texture;
  }
  const ELEVATED_CLEARANCE_Y = 0.45;
  const MIN_AUTO_HALF_W = 0.12;
  const MAX_AUTO_HALF_W = 1.5;
  const MIN_AUTO_HALF_D = 0.1;
  const MAX_AUTO_HALF_D = 0.24;
  function clamp(value, min, max) {
    return value < min ? min : value > max ? max : value;
  }
  function isGameEvent(character) {
    return 'eventId' in character && typeof character.event === 'function';
  }
  function isCharacterVisible(character) {
    if (character.isTransparent() || character.opacity() <= 0) return false;
    if ('isVisible' in character && typeof character.isVisible === 'function') {
      if (!character.isVisible()) return false;
    }
    return character.tileId() > 0 || character.characterName().length > 0;
  }
  var Hd2dEffectTarget = class extends Sprite_Character {
    projectedHeight = 0;
    get height() {
      return this.projectedHeight;
    }
    update() {}
    setBlendColor(color) {
      this._blendColor = color.clone();
    }
  };
  const effectPoint = new pixi_js.Point();
  const effectTop = new pixi_js.Point();
  const effectPosition = new _pixi_3d.Vector3();
  var Sprite_Hd2dCharacter = class {
    character;
    effectTarget;
    object;
    sprite;
    groundShadow;
    shadowHandle;
    defaultMaterial;
    emissiveMaterial = null;
    worldPos = new _pixi_3d.Vector3();
    swayPhase;
    zBias;
    bitmap = null;
    characterName = '';
    isBigCharacter = false;
    tilesetName = '';
    lastFrameKey = '';
    lastPageIndex = -999;
    config = DEFAULT_EVENT_SPRITE_CONFIG;
    isTileMode = false;
    pixelSize = CHAR_PIXEL_SIZE_TALL;
    spriteWidth = 48 * CHAR_PIXEL_SIZE_TALL;
    spriteHeight = 80 * CHAR_PIXEL_SIZE_TALL;
    bottomInset = 0;
    constructor(character, phaseOffset = 0, zBias = 0) {
      this.character = character;
      this.effectTarget = new Hd2dEffectTarget(character);
      this.effectTarget.renderable = false;
      this.swayPhase = phaseOffset;
      this.zBias = zBias;
      this.object = new _pixi_3d.Container3D({ label: 'character' });
      this.sprite = new _pixi_3d.Sprite3D({
        texture: pixi_js.Texture.EMPTY,
        pixelSize: CHAR_PIXEL_SIZE_TALL,
        anchor: {
          x: 0.5,
          y: 1,
        },
        alphaMode: 'mask',
        billboardMode: 'none',
        receiveShadow: true,
      });
      this.defaultMaterial = this.sprite.material;
      this.shadowHandle = addSpriteShadow(this.sprite);
      this.object.addChild(this.sprite);
      this.groundShadow = createGroundShadow(0.42, 0.32, 0.6);
      this.object.visible = false;
      this.groundShadow.visible = false;
    }
    update(mapWidth, mapHeight, elapsed, lights) {
      this.syncEventConfig();
      if (!isCharacterVisible(this.character)) {
        this.object.visible = false;
        this.groundShadow.visible = false;
        this.syncEventCollider(null);
        return;
      }
      const tileId = this.character.tileId();
      const bitmap = tileId > 0 ? this.resolveTileBitmap(tileId) : this.resolveCharacterBitmap();
      if (!bitmap || !bitmap.isReady() || !bitmap.textureSource) {
        this.object.visible = false;
        this.groundShadow.visible = false;
        return;
      }
      bitmap.textureSource.scaleMode = 'nearest';
      this.isTileMode = tileId > 0;
      this.object.visible = true;
      if (tileId > 0) this.updateTileFrame(bitmap, tileId);
      else this.updateCharacterFrame(bitmap);
      this.applyMaterialAndShadowState();
      this.updateTransform(mapWidth, mapHeight, elapsed);
      this.updateLighting(lights);
      if (this.effectTarget._hidden) {
        this.object.visible = false;
        this.groundShadow.visible = false;
      }
    }
    updateEffectTarget(view) {
      const target = this.effectTarget;
      const parent = target.parent;
      const pos = this.object.position;
      const base = this.sprite.position.y - (1 - this.sprite.anchor.y) * this.spriteHeight;
      effectPosition.set(pos.x, pos.y + base, pos.z);
      if (!parent || !view.worldToScreen(effectPosition, effectPoint)) return;
      parent.toLocal(effectPoint, void 0, target.position);
      effectPosition.y += this.spriteHeight * this.sprite.scale.y;
      if (view.worldToScreen(effectPosition, effectTop)) {
        parent.toLocal(effectTop, void 0, effectTop);
        target.projectedHeight = Math.max(0, target.y - effectTop.y);
      }
    }
    syncEventConfig() {
      if (!isGameEvent(this.character)) return;
      const pageIndex = this.character._pageIndex;
      if (pageIndex === this.lastPageIndex) return;
      this.lastPageIndex = pageIndex;
      this.config = resolveEventSpriteConfig(this.character);
      this.lastFrameKey = '';
    }
    resolveCharacterBitmap() {
      const name = this.character.characterName();
      if (name !== this.characterName || this.tilesetName !== '') {
        this.characterName = name;
        this.tilesetName = '';
        this.bitmap = ImageManager.loadCharacter(name);
        this.isBigCharacter = ImageManager.isBigCharacter(name);
        this.lastFrameKey = '';
      }
      return this.bitmap;
    }
    resolveTileBitmap(tileId) {
      const setNumber = 5 + Math.floor(tileId / 256);
      const name = $gameMap.tileset()?.tilesetNames[setNumber] ?? '';
      if (!name) return null;
      if (name !== this.tilesetName || this.characterName !== '') {
        this.tilesetName = name;
        this.characterName = '';
        this.bitmap = ImageManager.loadTileset(name);
        this.lastFrameKey = '';
      }
      return this.bitmap;
    }
    updateTileFrame(bitmap, tileId) {
      const map = $gameMap;
      const pw = map.tileWidth();
      const ph = map.tileHeight();
      const sx = ((Math.floor(tileId / 128) % 2) * 8 + (tileId % 8)) * pw;
      const sy = (Math.floor((tileId % 256) / 8) % 16) * ph;
      const frameKey = `tile:${this.tilesetName}:${tileId}:${this.config.pixelSize ?? 'auto'}:${this.config.scale}`;
      if (frameKey !== this.lastFrameKey) {
        this.lastFrameKey = frameKey;
        const texture = getSlicedFrame(bitmap.textureSource, sx, sy, pw, ph);
        this.applyFrameTexture(texture, pw, ph, TILE_BILLBOARD_PIXEL_SIZE);
      }
    }
    updateCharacterFrame(bitmap) {
      const pw = this.isBigCharacter ? bitmap.width / 3 : bitmap.width / 12;
      const ph = this.isBigCharacter ? bitmap.height / 4 : bitmap.height / 8;
      const index = this.character.characterIndex();
      const blockX = this.isBigCharacter ? 0 : (index % 4) * 3;
      const blockY = this.isBigCharacter ? 0 : Math.floor(index / 4) * 4;
      const patternX = this.character.pattern();
      const patternY = (this.character.direction() - 2) / 2;
      const sx = (blockX + patternX) * pw;
      const sy = (blockY + patternY) * ph;
      const frameKey = `char:${this.characterName}:${sx},${sy},${pw},${ph}:${this.config.pixelSize ?? 'auto'}:${this.config.scale}`;
      if (frameKey !== this.lastFrameKey) {
        this.lastFrameKey = frameKey;
        const texture = getSlicedFrame(bitmap.textureSource, sx, sy, pw, ph);
        const defaultPixelSize = ph >= 64 ? CHAR_PIXEL_SIZE_TALL : CHAR_PIXEL_SIZE_COMPACT;
        this.applyFrameTexture(texture, pw, ph, defaultPixelSize);
      }
    }
    applyFrameTexture(texture, pw, ph, defaultPixelSize) {
      this.pixelSize = (this.config.pixelSize ?? defaultPixelSize) * this.config.scale;
      this.sprite.pixelSize = this.pixelSize;
      this.spriteWidth = pw * this.pixelSize;
      this.spriteHeight = ph * this.pixelSize;
      const footprint = getSpriteFootprintMetrics(texture);
      this.bottomInset = footprint.bottomInsetRatio * this.spriteHeight;
      this.sprite.texture = texture;
      if (this.emissiveMaterial?.emissive) this.emissiveMaterial.emissive.texture = texture;
      this.shadowHandle.update(texture);
      this.syncEventCollider(footprint);
    }
    syncEventCollider(footprint) {
      if (!isGameEvent(this.character)) return;
      const target = this.character;
      const cfg = this.config;
      const spec = cfg.collider;
      if (!footprint) {
        if (spec.mode === 'none')
          target._pixelCollider = {
            offsetX: cfg.offsetX / TILE_UNIT,
            offsetY: cfg.offsetZ / TILE_UNIT,
            halfW: 0.15,
            halfD: 0.15,
            disabled: true,
          };
        else if (spec.mode === 'box')
          target._pixelCollider = {
            offsetX: cfg.offsetX / TILE_UNIT,
            offsetY: cfg.offsetZ / TILE_UNIT,
            halfW: spec.halfW,
            halfD: spec.halfD,
          };
        else target._pixelCollider = null;
        return;
      }
      const localCenterX = (0.5 - cfg.anchorX + footprint.centerOffsetRatio) * this.spriteWidth;
      const cosY = Math.cos(cfg.rotationY);
      const sinY = Math.sin(cfg.rotationY);
      const worldOffsetX = cfg.offsetX + localCenterX * cosY;
      const worldOffsetZ = cfg.offsetZ - localCenterX * sinY;
      const offsetX = worldOffsetX / TILE_UNIT;
      const offsetY = worldOffsetZ / TILE_UNIT;
      if (spec.mode === 'none') {
        target._pixelCollider = {
          offsetX,
          offsetY,
          halfW: 0.15,
          halfD: 0.15,
          disabled: true,
        };
        return;
      }
      if (spec.mode === 'box') {
        target._pixelCollider = {
          offsetX,
          offsetY,
          halfW: spec.halfW,
          halfD: spec.halfD,
        };
        return;
      }
      const elevated =
        cfg.offsetY -
          (1 - cfg.anchorY) * this.spriteHeight +
          (cfg.anchorY >= 0.5 && !cfg.hasCustomOffsetY ? 0 : this.bottomInset) >=
        ELEVATED_CLEARANCE_Y;
      const halfW = clamp(
        (this.spriteWidth * (footprint.widthRatio > 0 ? footprint.widthRatio : 0.5) * 0.5) / TILE_UNIT,
        MIN_AUTO_HALF_W,
        MAX_AUTO_HALF_W,
      );
      target._pixelCollider = {
        offsetX,
        offsetY,
        halfW,
        halfD: clamp(halfW * 0.65, MIN_AUTO_HALF_D, MAX_AUTO_HALF_D),
        disabled: elevated,
      };
    }
    applyMaterialAndShadowState() {
      const cfg = this.config;
      const isEmissive = cfg.emissive > 0;
      if (isEmissive) {
        const targetAlphaMode = cfg.blend ? 'blend' : 'mask';
        if (!this.emissiveMaterial)
          this.emissiveMaterial = new _pixi_3d.Material3D({
            baseColorTexture: this.sprite.texture,
            doubleSided: true,
            alphaMode: targetAlphaMode,
            metallic: 1,
            roughness: 1,
            emissive: {
              texture: this.sprite.texture,
              color: cfg.emissiveColor,
              strength: cfg.emissive,
            },
          });
        else {
          this.emissiveMaterial.alphaMode = targetAlphaMode;
          this.emissiveMaterial.textures.baseColor = this.sprite.texture;
          if (this.emissiveMaterial.emissive) {
            this.emissiveMaterial.emissive.texture = this.sprite.texture;
            this.emissiveMaterial.emissive.color = cfg.emissiveColor;
            this.emissiveMaterial.emissive.strength = cfg.emissive;
          }
        }
        if (this.sprite.material !== this.emissiveMaterial) this.sprite.material = this.emissiveMaterial;
      } else {
        if (this.sprite.material !== this.defaultMaterial) this.sprite.material = this.defaultMaterial;
        this.sprite.alphaMode = cfg.blend ? 'blend' : 'mask';
      }
      this.sprite.billboardMode = cfg.billboardMode;
      this.sprite.anchor.set(cfg.anchorX, cfg.anchorY);
      const castShadow = cfg.castShadow ?? !isEmissive;
      this.shadowHandle.setVisible(castShadow);
      const showGroundShadow = cfg.groundShadow ?? (!this.isTileMode && !isEmissive && !cfg.hasCustomOffsetY);
      this.groundShadow.visible = showGroundShadow;
    }
    updateTransform(mapWidth, mapHeight, elapsed) {
      const cfg = this.config;
      const { x, z } = tileToWorld(this.character._realX, this.character._realY, mapWidth, mapHeight);
      const jumpWorld = this.character.jumpHeight() * this.pixelSize;
      this.object.position.set(x + cfg.offsetX, jumpWorld + cfg.offsetY, z + cfg.offsetZ + this.zBias);
      this.object.rotation.y = cfg.rotationY;
      if (this.groundShadow.visible) {
        this.groundShadow.position.set(x + cfg.offsetX, 0.004, z + cfg.offsetZ + this.zBias);
        const shadowScale = Math.max(0.45, 1 - jumpWorld * 0.45);
        this.groundShadow.width = Math.max(0.32, this.spriteWidth * 0.76) * shadowScale;
        this.groundShadow.height = Math.max(0.24, this.spriteWidth * 0.56) * shadowScale;
        const opacity = this.character.opacity() / 255;
        this.groundShadow.alpha = 0.6 * opacity * shadowScale;
      }
      const opacity = this.character.opacity() / 255;
      this.sprite.alpha = opacity;
      if (cfg.breathe ?? (!this.isTileMode && cfg.emissive <= 0 && cfg.sway === 0 && cfg.swayPitch === 0)) {
        const swayAmplitude = this.character.isMoving() ? 0.012 : 0.007;
        const swaySpeed = this.character.isMoving() ? 6.5 : 3;
        const offset = Math.sin(elapsed * swaySpeed + this.swayPhase) * swayAmplitude;
        this.sprite.scale.set(1, 1 + offset / Math.max(this.spriteHeight, 0.01), 1);
      } else this.sprite.scale.set(1, 1, 1);
      this.sprite.rotation.z = cfg.sway !== 0 ? Math.sin(elapsed * cfg.swaySpeed) * cfg.sway : 0;
      this.sprite.rotation.x = cfg.swayPitch !== 0 ? Math.sin(elapsed * cfg.swayPitchSpeed) * cfg.swayPitch : 0;
      const shouldSeatOnGround = cfg.anchorY >= 0.5 && !cfg.hasCustomOffsetY;
      this.sprite.position.y = shouldSeatOnGround ? -this.bottomInset : 0;
    }
    updateLighting(lights) {
      if (this.config.emissive > 0) return;
      this.worldPos.set(
        this.object.position.x,
        this.object.position.y + this.spriteHeight * 0.5,
        this.object.position.z,
      );
      const tint = tintSprite(this.worldPos, lights);
      const [red, green, blue, alpha] = this.effectTarget._blendColor;
      const opacity = alpha / 255;
      this.sprite.tint = [
        tint[0] * (1 - opacity) + (red / 255) * opacity,
        tint[1] * (1 - opacity) + (green / 255) * opacity,
        tint[2] * (1 - opacity) + (blue / 255) * opacity,
      ];
    }
  };
  // src/sprites/Spriteset_Hd2d.ts
  var MapEffects = class extends pixi_js.Container {
    update() {
      for (const child of this.children) child.update?.();
    }
  };
  var Spriteset_Hd2d = class extends pixi_js.Container {
    view;
    effectLayer = new MapEffects();
    fog;
    dust;
    post;
    followCamera;
    characters = [];
    stageData = null;
    loadError = null;
    destroyedFlag = false;
    elapsed = 0;
    constructor() {
      super();
      this.view = new _pixi_3d.View3D({
        width: Graphics.width,
        height: Graphics.height,
        autoResize: false,
        shadowQuality: 'high',
        shadowFilter: 'pcf',
      });
      this.view.eventMode = 'none';
      this.addChild(this.view);
      this.effectLayer.boundsArea = new pixi_js.Rectangle(0, 0, Graphics.width, Graphics.height);
      this.fog = createFog(this.view);
      this.dust = createDust();
      this.post = createPostProcessing(this.view);
      const mapWidth = $gameMap.width();
      const mapHeight = $gameMap.height();
      const halfW = Math.max(0, mapWidth * TILE_UNIT * 0.5 - 1.4);
      const halfH = Math.max(0, mapHeight * TILE_UNIT * 0.5 - 1.2);
      this.followCamera = createFollowCamera(this.view.camera, {
        minX: -halfW,
        maxX: halfW,
        minZ: -halfH,
        maxZ: halfH,
      });
      this.restorePersistedSettings();
      this.createCharacters();
      this.view.root.addChild(this.dust.object);
      const playerPos = this.getPlayerWorldPos();
      this.followCamera.snapTo(playerPos.x, playerPos.z);
      this.loadAsyncAssets();
    }
    isReady() {
      if (this.loadError) throw this.loadError;
      return this.stageData !== null;
    }
    getEffectTargets() {
      return this.characters.map(({ effectTarget }) => effectTarget);
    }
    update() {
      if (this.destroyedFlag) return;
      if (this.view.width !== Graphics.width || this.view.height !== Graphics.height) {
        this.view.width = Graphics.width;
        this.view.height = Graphics.height;
        this.effectLayer.boundsArea.width = Graphics.width;
        this.effectLayer.boundsArea.height = Graphics.height;
      }
      const rawDelta = (Graphics.app?.ticker?.deltaMS ?? 16.667) / 1e3;
      const delta = Math.min(Math.max(rawDelta, 0.001), 0.1);
      this.elapsed += delta;
      const stage = this.stageData;
      if (stage) stage.update(this.elapsed);
      const mapWidth = $gameMap.width();
      const mapHeight = $gameMap.height();
      const lights = stage?.getSpriteLights() ?? [];
      for (const characterSprite of this.characters) characterSprite.update(mapWidth, mapHeight, this.elapsed, lights);
      const playerPos = this.getPlayerWorldPos();
      this.followCamera.update(playerPos.x, playerPos.z, delta);
      for (const character of this.characters) character.updateEffectTarget(this.view);
      this.dust.update(delta, playerPos.x, playerPos.z);
    }
    destroy() {
      if (this.destroyedFlag) return;
      this.destroyedFlag = true;
      this.savePersistedSettings();
      this.stageData?.destroy();
      this.stageData = null;
      super.destroy({ children: true });
    }
    async loadAsyncAssets() {
      const [sky, stage] = await Promise.allSettled([loadSkybox(), createStage(() => !this.destroyedFlag)]);
      if (this.destroyedFlag || sky.status === 'rejected' || stage.status === 'rejected') {
        if (stage.status === 'fulfilled') stage.value?.destroy();
        if (!this.destroyedFlag) {
          const error = sky.status === 'rejected' ? sky.reason : stage.status === 'rejected' ? stage.reason : null;
          this.loadError = error instanceof Error ? error : new Error(String(error));
        }
        return;
      }
      this.view.background = sky.value;
      this.view.environment = sky.value;
      if (stage.value) {
        this.stageData = stage.value;
        this.view.root.addChild(stage.value.object);
      }
    }
    createCharacters() {
      const map = $gameMap;
      const player = $gamePlayer;
      [...map.events(), ...map.vehicles(), ...player.followers().reverseData(), player].forEach((character, index) => {
        const sprite = new Sprite_Hd2dCharacter(character, index * 1.3, index * 8e-4);
        this.characters.push(sprite);
        this.view.root.addChild(sprite.groundShadow, sprite.object);
        this.effectLayer.addChild(sprite.effectTarget);
      });
    }
    getPlayerWorldPos() {
      const player = $gamePlayer;
      const map = $gameMap;
      return tileToWorld(player._realX, player._realY, map.width(), map.height());
    }
    restorePersistedSettings() {
      if (persistedHd2dState.post) {
        Object.assign(this.post.settings.bloom, persistedHd2dState.post.bloom);
        Object.assign(this.post.settings.colorAverage, persistedHd2dState.post.colorAverage);
        Object.assign(this.post.settings.brightnessContrast, persistedHd2dState.post.brightnessContrast);
        Object.assign(this.post.settings.vignette, persistedHd2dState.post.vignette);
        Object.assign(this.post.settings.toneMapping, persistedHd2dState.post.toneMapping);
        Object.assign(this.post.settings.tiltShift, persistedHd2dState.post.tiltShift);
        this.post.apply();
      }
      if (persistedHd2dState.fog) {
        Object.assign(this.fog.settings, persistedHd2dState.fog);
        this.fog.apply();
      }
      if (persistedHd2dState.dust) {
        Object.assign(this.dust.settings, persistedHd2dState.dust);
        this.dust.apply();
      }
      if (persistedHd2dState.camera) {
        Object.assign(this.followCamera.settings, persistedHd2dState.camera);
        this.followCamera.apply();
      }
    }
    savePersistedSettings() {
      persistedHd2dState.post = structuredClone(this.post.settings);
      persistedHd2dState.fog = { ...this.fog.settings };
      persistedHd2dState.dust = { ...this.dust.settings };
      persistedHd2dState.camera = { ...this.followCamera.settings };
    }
  };
  // src/patches/Scene_Map.ts
  function installSceneMapPatch() {
    Spriteset_Map.prototype.createLowerLayer = function () {
      Spriteset_Base.prototype.createLowerLayer.call(this);
      this._hd2d = new Spriteset_Hd2d();
      const effectLayer = this._hd2d.effectLayer;
      Object.assign(this, { _effectsContainer: effectLayer });
      this._baseSprite.addChild(this._hd2d, effectLayer);
      this._characterSprites = this._hd2d.getEffectTargets();
      this.createWeather();
    };
    Spriteset_Map.prototype.update = function () {
      Spriteset_Base.prototype.update.call(this);
      this.updateWeather();
      this.updateBalloons();
    };
    const originalIsReady = Scene_Map.prototype.isReady;
    Scene_Map.prototype.isReady = function () {
      if (!originalIsReady.call(this)) return false;
      return this._spriteset?._hd2d?.isReady() ?? true;
    };
    const ground = new _pixi_3d.Plane(new _pixi_3d.Vector3(0, 1, 0), 0);
    const originalOnMapTouch = Scene_Map.prototype.onMapTouch;
    Scene_Map.prototype.onMapTouch = function () {
      const hd2d = this._spriteset?._hd2d;
      if (!hd2d) {
        originalOnMapTouch.call(this);
        return;
      }
      const hit = hd2d.view.screenToWorld(
        {
          x: TouchInput.x,
          y: TouchInput.y,
        },
        ground,
      );
      if (!hit) return;
      const x = Math.round(hit.x / TILE_UNIT + ($gameMap.width() - 1) / 2);
      const y = Math.round(hit.z / TILE_UNIT + ($gameMap.height() - 1) / 2);
      if ($gameMap.isValid(x, y)) $gameTemp.setDestination(x, y);
    };
  }
  // src/install.ts
  function installHd2d() {
    installSceneMapPatch();
    installPluginCommands();
  }
  // src/index.ts
  installHd2d();
})(PIXI3D, PIXI, PIXI3D.extras);
