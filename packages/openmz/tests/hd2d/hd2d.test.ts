import type { Spriteset_Hd2d } from '../../../../plugins/openmz-hd2d/src/sprites/Spriteset_Hd2d.ts';
import { deepEqual, equal, ok } from 'node:assert/strict';
import { test } from 'node:test';
import { chromium } from 'playwright';

declare global {
  var PIXI3D: typeof import('../../../../plugins/openmz-pixi-3d/src/index.ts');
}

type Hd2dMap = Spriteset_Map & { _hd2d: Spriteset_Hd2d };

test(
  'the standalone HD2D project runs with OpenMZ and renders point-light shadows',
  { timeout: 120_000 },
  async (t) => {
    const index = new URL('../../../../examples/hd2d/index.html', import.meta.url);
    const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--allow-file-access-from-files'] });
    t.after(() => browser.close());
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    page.setDefaultTimeout(20_000);
    const errors: string[] = [];
    const missing: string[] = [];
    page.on('pageerror', (error) => errors.push(error.stack ?? error.message));
    page.on('requestfailed', (request) => {
      const path = new URL(request.url()).pathname;
      if (!path.endsWith('/img/tilesets/Hd2d_B-normal.png')) missing.push(path);
    });

    try {
      await page.goto(index.href);
      await page.waitForFunction(
        () =>
          typeof SceneManager !== 'undefined' &&
          SceneManager._scene instanceof Scene_Title &&
          SceneManager._scene._commandWindow?.isOpen(),
      );
      await page.evaluate(() => (SceneManager._scene as Scene_Title).commandNewGame());
      await page.waitForFunction(
        () => SceneManager._scene instanceof Scene_Map && SceneManager._scene.isPlayerActive(),
      );
      const initial = await page.evaluate(() => {
        const { view } = ((SceneManager._scene as Scene_Map)._spriteset as Hd2dMap)._hd2d;
        return {
          plugins: PluginManager._scripts,
          size: [view.width, view.height],
          lights: view.lights.filter((light) => light.type === 'point').length,
          shadowFaces: view.lights.find((light) => light.type === 'point' && light.canCastShadow)?._gpuShadowData
            ?.cascades?.length,
        };
      });
      deepEqual(initial, {
        plugins: ['OpenMzPixi3D', 'PixelMovement', 'Hd2d', 'Hd2dDebug'],
        size: [1280, 720],
        lights: 3,
        shadowFaces: 6,
      });
      const panel = page.locator('.lil-gui.lil-root');
      const colliderFolder = panel.locator('button.lil-title').filter({ hasText: /^碰撞箱$/ });
      await colliderFolder.click();
      const colliderToggle = panel.getByRole('checkbox', { name: '显示碰撞箱' });
      await colliderToggle.check();
      await page.waitForFunction(() => {
        const { view } = ((SceneManager._scene as Scene_Map)._spriteset as Hd2dMap)._hd2d;
        return view.root.children.find((child) => child.label === '碰撞箱调试')?.visible;
      });
      await colliderToggle.uncheck();
      await colliderFolder.click();
      await colliderFolder.blur();

      await page.keyboard.down('KeyA');
      await page.waitForFunction(() => $gamePlayer._realX < 7.9);
      await page.keyboard.up('KeyA');

      await page.evaluate(() => $gameMap.event(2).start());
      await page.waitForFunction(() => (SceneManager._scene as Scene_Map)._messageWindow._choiceListWindow?.active);
      await page.evaluate(() => {
        const scene = SceneManager._scene as Scene_Map;
        const choice = scene._messageWindow._choiceListWindow!;
        choice.select(0);
        choice.callOkHandler();
      });
      await page.waitForFunction(() => {
        const { view } = ((SceneManager._scene as Scene_Map)._spriteset as Hd2dMap)._hd2d;
        return $gameMap.event(2)._pageIndex === 1 && view.lights.filter((light) => light.type === 'point').length === 2;
      });

      await page.evaluate(() => {
        PluginManager.callCommand({}, 'Hd2d', 'SetEventLight', { eventId: '2', preset: 'torch' });
        PluginManager.callCommand({}, 'Hd2d', 'SetPlayerLight', { type: 'spot', intensity: '5' });
      });
      await page.waitForFunction(() => {
        const { view } = ((SceneManager._scene as Scene_Map)._spriteset as Hd2dMap)._hd2d;
        return (
          view.lights.filter((light) => light.type === 'point').length === 3 &&
          view.lights.some((light) => light.type === 'spot')
        );
      });
      await page.evaluate(() => {
        PluginManager.callCommand({}, 'Hd2d', 'ClearEventLight', { eventId: '2' });
        PluginManager.callCommand({}, 'Hd2d', 'ClearPlayerLight', {});
        $gameTemp.requestBalloon($gamePlayer, 1);
        $gameSelfSwitches.setValue([$gameMap.mapId(), 2, 'A'], false);
      });
      await page.waitForFunction(() => {
        const spriteset = (SceneManager._scene as Scene_Map)._spriteset as Hd2dMap;
        const balloon = spriteset._balloonSprites[0];
        return (
          spriteset._hd2d.view.lights.filter((light) => light.type === 'point').length === 3 &&
          !spriteset._hd2d.view.lights.some((light) => light.type === 'spot') &&
          balloon?._target.height > 0 &&
          balloon.y === balloon._target.y - balloon._target.height
        );
      });

      const touched = await page.evaluate(() => {
        const scene = SceneManager._scene as Scene_Map;
        const { view } = (scene._spriteset as Hd2dMap)._hd2d;
        const tileX = 8;
        const tileY = 7;
        const hit = view.worldToScreen({
          x: (tileX - ($gameMap.width() - 1) / 2) * 0.65,
          y: 0,
          z: (tileY - ($gameMap.height() - 1) / 2) * 0.65,
        });
        if (!hit) return null;
        TouchInput._x = hit.x;
        TouchInput._y = hit.y;
        scene.onMapTouch();
        const tile = [$gameTemp.destinationX(), $gameTemp.destinationY()];
        $gameTemp.clearDestination();
        return tile;
      });
      deepEqual(touched, [8, 7]);

      await page.evaluate(async () => {
        await DataManager.saveGame(1);
        await DataManager.loadGame(1);
        SceneManager.goto(Scene_Map);
      });
      await page.waitForFunction(
        () => SceneManager._scene instanceof Scene_Map && SceneManager._scene.isPlayerActive(),
      );
      const loadedX = await page.evaluate(() => $gamePlayer._realX);
      await page.keyboard.down('KeyA');
      await page.waitForFunction((x) => $gamePlayer._realX < x - 0.06, loadedX);
      await page.keyboard.up('KeyA');
      equal(await page.locator('.lil-gui.lil-root').count(), 1);

      const shadow = await page.evaluate(() => {
        Graphics.app.ticker.stop();
        const renderer = Graphics.app.renderer;
        const { View3D, Mesh3D, CubeGeometry, PlaneGeometry, PointLight, Material3D } = PIXI3D;
        const container = new PIXI.Container();
        const view = new View3D({ width: 480, height: 320, autoResize: false, shadowQuality: 'low' });
        container.addChild(view);
        view.camera.position.set(3, 6, 7);
        view.camera.lookAt({ x: 0, y: 0, z: 0 });
        const material = new Material3D({ baseColor: 0xaaaaaa, metallic: 0, roughness: 1 });
        const ground = new Mesh3D({
          geometry: new PlaneGeometry({ width: 10, height: 10 }),
          material,
          rotation: { x: -Math.PI / 2, y: 0, z: 0 },
          receiveShadow: true,
        });
        const cube = new Mesh3D({
          geometry: new CubeGeometry(),
          material,
          position: { x: 0, y: 0.5, z: 0 },
          castShadow: true,
        });
        const light = new PointLight({ intensity: 6, range: 12, decay: 0.25, castShadow: true });
        light.position.set(-2, 2, 0);
        view.root.addChild(ground, cube, light);
        const target = PIXI.RenderTexture.create({ width: 480, height: 320 });
        const frame = () => {
          renderer.render({ container, target, clear: true });
          return renderer.extract.pixels(target).pixels.slice();
        };
        const before = frame();
        const faces = light._gpuShadowData?.cascades?.length;
        light.castShadow = false;
        const after = frame();
        let brighterPixels = 0;
        for (let i = 0; i < before.length; i += 4) {
          if (after[i] - before[i] > 4) brighterPixels++;
        }
        target.destroy(true);
        container.destroy({ children: true });
        return { faces, brighterPixels };
      });
      equal(shadow.faces, 6);
      ok(shadow.brighterPixels > 0, 'Disabling the point shadow should brighten pixels on the ground');
    } catch (error) {
      const state = await page.evaluate(() => ({
        engineError: document.querySelector('#errorPrinter')?.textContent,
        scene: typeof SceneManager === 'undefined' ? null : SceneManager._scene?.constructor.name,
        mapActive: typeof SceneManager !== 'undefined' && SceneManager._scene?.isActive(),
      }));
      throw new Error(JSON.stringify({ ...state, errors, missing }), { cause: error });
    }
    deepEqual(errors, []);
    deepEqual(missing, []);
  },
);
