import type {} from '@vitest/browser-playwright';
import { assert, expect, onTestFinished, test, vi } from 'vitest';
import { page } from 'vitest/browser';
import { devDependencies } from '../../package.json';

// Compare the original engine with the published prototype runtime in classic-script iframes.
type GameBitmap = {
  width: number;
  height: number;
  context: CanvasRenderingContext2D;
  mzkp_isTextPicture?: boolean;
  fillAll(color: string): void;
  getPixel(x: number, y: number): string;
  destroy(): void;
};

type ClickableSprite = {
  width: number;
  height: number;
  visible: boolean;
  toGlobal(point: { x: number; y: number }): { x: number; y: number };
};

type LegacySprite = {
  parent: object | null;
  position: { x: number; set(x: number, y: number): void };
  worldTransform: { tx: number };
  anchor: { x: number };
  getLocalBounds(): { x: number; width: number };
  setFrame(x: number, y: number, width: number, height: number): void;
};

type GameScene = {
  isStarted(): boolean;
  isBusy(): boolean;
};

type FileScene = GameScene & {
  _listWindow: {
    y: number;
    height: number;
    maxCols(): number;
    savefileId(): number;
    selectSavefile(id: number): void;
    mzkp_statusWindow: {
      y: number;
      _savefileId: number;
      position: { x: number };
      worldTransform: { tx: number };
    };
  };
};

type Scenes = {
  Scene_Title: GameScene & { commandNewGame(): void };
  Scene_Map: GameScene & {
    _menuButton?: ClickableSprite;
    _spriteset: {
      _pictureContainer: {
        children: (ClickableSprite & {
          _pictureId: number;
          bitmap: GameBitmap | null;
        })[];
      };
    };
    callMenu(): void;
  };
  Scene_Menu: GameScene & {
    _commandWindow: {
      isOpen(): boolean;
      maxCols(): number;
      width: number;
      y: number;
      height: number;
    };
    _statusWindow: { y: number };
    commandSave(): void;
  };
  Scene_Save: FileScene;
  Scene_Load: FileScene;
  LegacyScene: GameScene & {
    sprite: LegacySprite;
    addChild(sprite: LegacySprite): void;
  };
};

type GameWindow = Window & {
  PIXI: Pick<typeof import('pixi.js'), 'VERSION' | 'Point'>;
  Bitmap: {
    new (width: number, height: number): GameBitmap;
    snap(scene: GameScene): GameBitmap;
  };
  SceneManager: {
    _scene: GameScene | null;
    goto(scene: new () => GameScene): void;
  };
  Scene_Base: { prototype: { initialize(): void } };
  Scene_Load: new () => FileScene;
  Sprite: { prototype: { initialize(bitmap: GameBitmap): void } };
  Point: {
    new (x?: number, y?: number): { x: number; y: number };
    prototype: { initialize(x?: number, y?: number): void };
  };
  Rectangle: {
    new (
      x?: number,
      y?: number,
      width?: number,
      height?: number,
    ): {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    prototype: { initialize(x?: number, y?: number, width?: number, height?: number): void };
  };
  Tilemap: {
    prototype: { initialize(): void };
    Layer: { prototype: { initialize(...args: unknown[]): void } };
    CombinedLayer: { prototype: { initialize(...args: unknown[]): void } };
  };
  ScreenSprite: { prototype: { initialize(): void } };
  WindowLayer: { prototype: { initialize(): void } };
  Weather: { prototype: { initialize(): void } };
  ColorFilter: { prototype: { initialize(): void } };
  Sprite_Animation: { prototype: { initialize(): void } };
  Window_Base: abstract new (...args: never[]) => object;
  Game_Interpreter: new () => {
    setup(commands: ReturnType<typeof eventCommand>[]): void;
    update(): void;
  };
  Graphics: { boxWidth: number };
  PluginManager: { parameters(name: string): Record<string, string> };
  $gamePlayer: {
    x: number;
    y: number;
    canPass(x: number, y: number, direction: number): boolean;
    moveStraight(direction: number): void;
    isMoving(): boolean;
  };
  $gameVariables: { value(id: number): number };
  $gameSwitches: { value(id: number): boolean };
  $dataCommonEvents: unknown[];
};

const pluginName = 'OpenMZCompatibilityProbe';

function waitForGame<T>(game: GameWindow, condition: () => T, stage: string) {
  return vi.waitUntil(
    () => {
      const error = game.document.querySelector('#errorPrinter')?.textContent?.trim();
      if (error) {
        throw new Error(error);
      }
      return condition();
    },
    { timeout: 10_000, message: `Waiting for ${stage}` },
  );
}

function waitForScene<Name extends keyof Scenes>(game: GameWindow, name: Name) {
  return waitForGame(
    game,
    () => {
      const scene = game.SceneManager?._scene;
      if (scene?.constructor.name === name && scene.isStarted() && !scene.isBusy()) {
        return scene as Scenes[Name];
      }
    },
    name,
  );
}

function eventCommand(code: number, ...parameters: unknown[]) {
  return { code, indent: 0, parameters };
}

function runEventCommands(game: GameWindow, ...commands: ReturnType<typeof eventCommand>[]) {
  const interpreter = new game.Game_Interpreter();
  interpreter.setup([...commands, eventCommand(0)]);
  interpreter.update();
}

async function clickSprite(game: GameWindow, iframe: HTMLIFrameElement, sprite: ClickableSprite) {
  const canvas = game.document.querySelector<HTMLCanvasElement>('#gameCanvas');
  assert(canvas);
  canvas.dataset.testid = 'game-canvas';
  const center = sprite.toGlobal(new game.PIXI.Point(sprite.width / 2, sprite.height / 2));
  const bounds = canvas.getBoundingClientRect();
  const frame = page.frameLocator(page.elementLocator(iframe));
  // The transparent game video sits above the canvas. Input is handled on document.
  await frame.getByTestId('game-canvas').click({
    force: true,
    position: {
      x: (center.x * bounds.width) / canvas.width,
      y: (center.y * bounds.height) / canvas.height,
    },
  });
}

const engines = [
  { engine: 'stock', pixiVersion: '5.3.12' },
  { engine: 'openmz', pixiVersion: devDependencies['pixi.js'] },
];

async function openGame({ engine, pixiVersion }: (typeof engines)[number]) {
  const iframe = document.createElement('iframe');
  iframe.title = `${engine} test game`;
  iframe.src = `/__plugin-compat__/${engine}/index.html`;
  iframe.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;border:0';
  document.body.append(iframe);
  onTestFinished(() => iframe.remove());
  iframe.focus();

  const game = iframe.contentWindow as GameWindow;
  const title = await waitForScene(game, 'Scene_Title');
  expect(game.PIXI.VERSION).toBe(pixiVersion);
  title.commandNewGame();
  const map = await waitForScene(game, 'Scene_Map');
  return { game, iframe, map };
}

test.each(engines)(
  '$engine runs plugin hooks, clickable text pictures, and AltMenuScreen',
  async (engine) => {
    const { game, iframe, map } = await openGame(engine);
    expect(game.PluginManager.parameters(pluginName).stepVariable).toBe('2');

    const player = game.$gamePlayer;
    const direction = [2, 4, 6, 8].find((direction) => player.canPass(player.x, player.y, direction));
    assert(direction !== undefined);
    const steps = game.$gameVariables.value(2);
    const position = [player.x, player.y];
    player.moveStraight(direction);
    expect([player.x, player.y]).not.toEqual(position);
    expect(game.$gameVariables.value(2)).toBe(steps + 1);
    await waitForGame(game, () => !player.isMoving(), 'player to finish moving');

    expect(game.$gameSwitches.value(1)).toBe(false);
    runEventCommands(
      game,
      eventCommand(357, pluginName, 'setSwitch', 'Set switch', {
        switchId: '1',
      }),
    );
    expect(game.$gameSwitches.value(1)).toBe(true);

    const commonEventId = 1;
    const pictureId = 1;
    game.$dataCommonEvents[commonEventId] = {
      id: commonEventId,
      name: 'Picture clicked',
      trigger: 0,
      switchId: 1,
      list: [eventCommand(121, 2, 2, 0), eventCommand(0)],
    };
    runEventCommands(
      game,
      eventCommand(357, 'TextPicture', 'set', 'Set Text Picture', {
        text: 'Plugin test',
      }),
      eventCommand(231, pictureId, '', 0, 0, 120, 120, 100, 100, 255, 0),
      eventCommand(357, 'ButtonPicture', 'set', 'Set Button Picture', {
        pictureId: String(pictureId),
        commonEventId: String(commonEventId),
      }),
    );
    const picture = map._spriteset._pictureContainer.children.find((sprite) => sprite._pictureId === pictureId);
    assert(picture);
    const { width, height, context } = await waitForGame(
      game,
      () => {
        const bitmap = picture.bitmap;
        return bitmap?.mzkp_isTextPicture && bitmap;
      },
      'TextPicture to create a bitmap',
    );
    const pixels = context.getImageData(0, 0, width, height).data;
    expect(pixels.some((value, index) => index % 4 === 3 && value > 0)).toBe(true);

    expect(game.$gameSwitches.value(2)).toBe(false);
    await clickSprite(game, iframe, picture);
    await waitForGame(game, () => game.$gameSwitches.value(2), 'ButtonPicture to run its common event');

    const menuButton = await waitForGame(game, () => map._menuButton?.visible && map._menuButton, 'map menu button');
    await clickSprite(game, iframe, menuButton);
    const menu = await waitForScene(game, 'Scene_Menu');
    await waitForGame(game, () => menu._commandWindow.isOpen(), 'menu command window');
    expect(menu._commandWindow.maxCols()).toBe(4);
    expect(menu._commandWindow.width).toBe(game.Graphics.boxWidth);
    expect(menu._statusWindow.y).toBe(menu._commandWindow.y + menu._commandWindow.height);
  },
  30_000,
);

async function checkSavefileLayout(game: GameWindow, sceneName: 'Scene_Save' | 'Scene_Load') {
  const scene = await waitForScene(game, sceneName);
  const list = scene._listWindow;
  const status = list.mzkp_statusWindow;
  expect(list.maxCols()).toBe(4);
  expect(status).toBeInstanceOf(game.Window_Base);
  expect(status.y).toBe(list.y + list.height);
  expect(status._savefileId).toBe(list.savefileId());

  list.selectSavefile(list.savefileId() === 2 ? 1 : 2);
  expect(status._savefileId).toBe(list.savefileId());

  const previousX = status.worldTransform.tx;
  status.position.x += 8;
  await waitForGame(game, () => status.worldTransform.tx === previousX + 8, 'savefile window transform');
}

test.each(engines)(
  '$engine opens the AltSaveScreen save and load layouts',
  async (engine) => {
    const { game, map } = await openGame(engine);
    map.callMenu();
    const menu = await waitForScene(game, 'Scene_Menu');
    menu.commandSave();
    await checkSavefileLayout(game, 'Scene_Save');
    game.SceneManager.goto(game.Scene_Load);
    await checkSavefileLayout(game, 'Scene_Load');
  },
  30_000,
);

test.each(engines)(
  '$engine constructs and renders prototype-based scenes and sprites',
  async (engine) => {
    const { game } = await openGame(engine);

    const LegacySprite = function LegacySprite(this: LegacySprite, bitmap: GameBitmap) {
      game.Sprite.prototype.initialize.call(this, bitmap);
    } as unknown as {
      new (bitmap: GameBitmap): LegacySprite;
      prototype: LegacySprite;
    };
    LegacySprite.prototype = Object.create(game.Sprite.prototype);
    LegacySprite.prototype.constructor = LegacySprite;

    const LegacyScene = function LegacyScene(this: Scenes['LegacyScene']) {
      game.Scene_Base.prototype.initialize.call(this);
    } as unknown as {
      new (): Scenes['LegacyScene'];
      prototype: Scenes['LegacyScene'] & { create(): void };
    };
    LegacyScene.prototype = Object.create(game.Scene_Base.prototype);
    LegacyScene.prototype.constructor = LegacyScene;
    LegacyScene.prototype.create = function () {
      const bitmap = new game.Bitmap(8, 8);
      bitmap.fillAll('#ff0000');
      this.sprite = new LegacySprite(bitmap);
      this.sprite.position.set(80, 60);
      this.addChild(this.sprite);
    };

    game.SceneManager.goto(LegacyScene);
    const scene = await waitForScene(game, 'LegacyScene');
    const sprite = scene.sprite;
    expect(sprite).toBeInstanceOf(game.Sprite);
    expect(sprite.parent).toBe(scene);
    expect(sprite.getLocalBounds().width).toBe(8);

    sprite.anchor.x = 0.5;
    expect(sprite.getLocalBounds().x).toBe(-4);
    sprite.setFrame(0, 0, 4, 8);
    expect(sprite.getLocalBounds().width).toBe(4);
    expect(sprite.getLocalBounds().x).toBe(-2);
    sprite.position.x += 8;
    await waitForGame(game, () => sprite.worldTransform.tx === 88, 'legacy sprite transform');

    const snapshot = game.Bitmap.snap(scene);
    try {
      expect(snapshot.getPixel(88, 61)).toBe('#ff0000');
    } finally {
      snapshot.destroy();
    }

    for (const ctor of [
      game.Point,
      game.Rectangle,
      game.Tilemap,
      game.Tilemap.Layer,
      game.Tilemap.CombinedLayer,
      game.ScreenSprite,
      game.WindowLayer,
      game.Weather,
      game.ColorFilter,
      game.Sprite_Animation,
    ]) {
      expect(typeof ctor.prototype.initialize).toBe('function');
    }

    const LegacyPoint = function LegacyPoint(this: { x: number; y: number }, x: number, y: number) {
      game.Point.prototype.initialize.call(this, x, y);
    } as unknown as {
      new (x: number, y: number): { x: number; y: number };
      prototype: { x: number; y: number };
    };
    LegacyPoint.prototype = Object.create(game.Point.prototype);
    LegacyPoint.prototype.constructor = LegacyPoint;
    const legacyPoint = new LegacyPoint(12, 34);
    expect(legacyPoint).toBeInstanceOf(game.Point);
    expect([legacyPoint.x, legacyPoint.y]).toEqual([12, 34]);

    const LegacyScreenSprite = function LegacyScreenSprite(this: { opacity: number }) {
      game.ScreenSprite.prototype.initialize.call(this);
    } as unknown as {
      new (): { opacity: number; setWhite(): void };
      prototype: { opacity: number };
    };
    LegacyScreenSprite.prototype = Object.create(game.ScreenSprite.prototype);
    LegacyScreenSprite.prototype.constructor = LegacyScreenSprite;
    const legacyScreen = new LegacyScreenSprite();
    expect(legacyScreen).toBeInstanceOf(game.ScreenSprite);
    expect(legacyScreen.opacity).toBe(0);
  },
  30_000,
);
