import type { DynamicSpriteLight } from '../../utils/spriteLighting.ts';
import { Container3D, DirectionalLight } from '@pixi/3d';
import { EventLightManager } from '../eventLights.ts';
import { createTilemapBillboards } from '../tilemap/billboardTiles.ts';
import { createTilemapGround } from '../tilemap/groundTilemap.ts';
import { parseMapTileOverrides, parseTilesetTileRules } from '../tilemap/tileConfig.ts';
import { loadTilesetBitmaps } from '../tilemap/tilesetUtils.ts';

export interface StageData {
  object: Container3D;
  getSpriteLights: () => readonly DynamicSpriteLight[];
  update: (elapsed: number) => void;
  destroy: () => void;
}

export async function createStage(isCurrent: () => boolean): Promise<StageData | undefined> {
  const map = $gameMap;
  const tileset = map.tileset();
  const dataMap = $dataMap;

  // Parse <hd2d-tile> rules from Tileset Note (by Terrain Tag) and Map Note (by tile coords & layer).
  const tileRules = parseTilesetTileRules(tileset?.note ?? '');
  const mapOverrides = parseMapTileOverrides(dataMap?.note ?? '');

  // Native RMMZ tileset ground (with paired -normal.png) and B-E standing cards/billboards.
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
  const group = new Container3D({ label: '场景' });
  const eventLights = new EventLightManager();
  group.addChild(tilemapGround.object, tilemapBillboards, eventLights.object);

  // Soft moonlight ensures every character and prop casts a grounded silhouette across the entire map.
  const moonLight = new DirectionalLight({
    color: 0x9bb5d6,
    intensity: 0.55,
    castShadow: true,
    shadow: { cascades: 1, maxDistance: 12, bias: 0.0005 },
  });
  moonLight.position.set(-4, 7, 5);
  moonLight.lookAt({ x: 0, y: 0, z: 0 });
  group.addChild(moonLight);

  eventLights.syncAllEvents();

  return {
    object: group,
    getSpriteLights: () => eventLights.getSpriteLights(),
    update: (elapsed: number) => {
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
