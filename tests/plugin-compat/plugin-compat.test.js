import { expect, onTestFinished, test, vi } from 'vitest';
import { page } from 'vitest/browser';
import { devDependencies } from '../../package.json';

const pluginName = 'OpenMZCompatibilityProbe';

function waitForGame(game, condition, stage) {
  return vi.waitUntil(() => {
    const error = game.document.querySelector('#errorPrinter')?.textContent?.trim();
    if (error) {
      throw new Error(error);
    }
    return condition();
  }, { timeout: 10_000, message: `Timed out waiting for ${stage}` });
}

function waitForScene(game, name) {
  return waitForGame(game, () => {
    const scene = game.SceneManager?._scene;
    return scene?.constructor.name === name && scene.isStarted() && !scene.isBusy();
  }, name);
}

test.each([
  { engine: 'stock', pixiVersion: '5.3.12' },
  { engine: 'openmz', pixiVersion: devDependencies['pixi.js'] },
])('$engine loads and runs the same RPG Maker MZ plugin', async ({ engine, pixiVersion }) => {
  const iframe = document.createElement('iframe');
  iframe.title = `${engine} test game`;
  iframe.src = `/__plugin-compat__/${engine}/index.html`;
  iframe.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;border:0';
  document.body.append(iframe);
  onTestFinished(() => iframe.remove());
  iframe.focus();

  const game = iframe.contentWindow;
  await waitForScene(game, 'Scene_Title');
  expect(game.PIXI.VERSION).toBe(pixiVersion);
  expect(game.PluginManager.parameters(pluginName).stepVariable).toBe('2');

  game.SceneManager._scene.commandNewGame();
  await waitForScene(game, 'Scene_Map');

  const player = game.$gamePlayer;
  const direction = [2, 4, 6, 8].find(direction => player.canPass(player.x, player.y, direction));
  expect(direction).toBeDefined();
  const steps = game.$gameVariables.value(2);
  const position = [player.x, player.y];
  player.moveStraight(direction);
  expect([player.x, player.y]).not.toEqual(position);
  expect(game.$gameVariables.value(2)).toBe(steps + 1);
  await waitForGame(game, () => !player.isMoving(), 'player to finish moving');

  expect(game.$gameSwitches.value(1)).toBe(false);
  const interpreter = new game.Game_Interpreter();
  interpreter.setup([
    { code: 357, indent: 0, parameters: [pluginName, 'setSwitch', 'Set switch', { switchId: '1' }] },
    { code: 0, indent: 0, parameters: [] },
  ]);
  interpreter.update();
  expect(game.$gameSwitches.value(1)).toBe(true);

  const button = game.SceneManager._scene._menuButton;
  await waitForGame(game, () => button?.visible, 'map menu button');
  const canvas = game.document.getElementById('gameCanvas');
  canvas.dataset.testid = 'game-canvas';
  const center = button.toGlobal(new game.PIXI.Point(button.width / 2, button.height / 2));
  const bounds = canvas.getBoundingClientRect();
  const frame = page.frameLocator(page.elementLocator(iframe));
  // The transparent game video sits above the canvas. Input is handled on document.
  await frame.getByTestId('game-canvas').click({
    force: true,
    position: { x: center.x * bounds.width / canvas.width, y: center.y * bounds.height / canvas.height },
  });

  await waitForScene(game, 'Scene_Menu');
  await waitForGame(game, () => game.SceneManager._scene._commandWindow.isOpen(), 'menu command window');
}, 30_000);
