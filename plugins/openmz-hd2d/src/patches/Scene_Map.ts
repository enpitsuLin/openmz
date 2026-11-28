import { Plane, Vector3 } from '@pixi/3d';
import { TILE_UNIT } from '../constants.ts';
import { Spriteset_Hd2d } from '../sprites/Spriteset_Hd2d.ts';

interface Hd2dSpritesetMap extends Spriteset_Map {
  _hd2d?: Spriteset_Hd2d;
}

export function installSceneMapPatch(): void {
  Spriteset_Map.prototype.createLowerLayer = function (this: Hd2dSpritesetMap): void {
    Spriteset_Base.prototype.createLowerLayer.call(this);
    this._hd2d = new Spriteset_Hd2d();
    const effectLayer = this._hd2d.effectLayer;
    Object.assign(this, { _effectsContainer: effectLayer });
    this._baseSprite.addChild(this._hd2d, effectLayer);
    this._characterSprites = this._hd2d.getEffectTargets();
    this.createWeather();
  };

  Spriteset_Map.prototype.update = function (): void {
    Spriteset_Base.prototype.update.call(this);
    this.updateWeather();
    this.updateBalloons();
  };

  const originalIsReady = Scene_Map.prototype.isReady;
  Scene_Map.prototype.isReady = function (this: Scene_Map): boolean {
    if (!originalIsReady.call(this)) return false;
    const spriteset = this._spriteset as Hd2dSpritesetMap | undefined;
    return spriteset?._hd2d?.isReady() ?? true;
  };

  const ground = new Plane(new Vector3(0, 1, 0), 0);
  const originalOnMapTouch = Scene_Map.prototype.onMapTouch;
  Scene_Map.prototype.onMapTouch = function (): void {
    const hd2d = (this._spriteset as Hd2dSpritesetMap | undefined)?._hd2d;
    if (!hd2d) {
      originalOnMapTouch.call(this);
      return;
    }
    const hit = hd2d.view.screenToWorld({ x: TouchInput.x, y: TouchInput.y }, ground);
    if (!hit) return;
    const x = Math.round(hit.x / TILE_UNIT + ($gameMap.width() - 1) / 2);
    const y = Math.round(hit.z / TILE_UNIT + ($gameMap.height() - 1) / 2);
    if ($gameMap.isValid(x, y)) $gameTemp.setDestination(x, y);
  };
}
