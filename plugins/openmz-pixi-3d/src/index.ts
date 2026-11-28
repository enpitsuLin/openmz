/*:
 * @target MZ
 * @plugindesc Exposes PixiJS 3D as PIXI3D on OpenMZ.
 * @help
 * Enable this plugin above any plugin that uses PIXI3D.
 * Access @pixi/3d/extras as PIXI3D.extras, for example PIXI3D.extras.OrbitCamera.
 * Requires OpenMZ with PixiJS 8.23.0 or later and a WebGL2 renderer.
 */
/*:zh
 * @target MZ
 * @plugindesc 在 OpenMZ 中将 PixiJS 3D 暴露为全局变量 PIXI3D。
 * @help
 * 在插件管理器中启用本插件，并将它排在使用 PIXI3D 的插件之前。
 * 通过 PIXI3D.extras 使用 @pixi/3d/extras，例如 PIXI3D.extras.OrbitCamera。
 * 需要使用 PixiJS 8.23.0 或更高版本的 OpenMZ，以及 WebGL2 渲染器。
 */

import './preflight.ts';

export * from '@pixi/3d';
export * as extras from '@pixi/3d/extras';
