import type { TestContext } from 'vitest';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { runInNewContext } from 'node:vm';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { test } from 'vitest';
import { buildPlugin } from '../../../scripts/commands/build/plugins.ts';
import { createTarBuffer } from '../../../scripts/commands/pack/artifacts.ts';
import { coreScripts, manifestSchema, runtimeFormat, statePath } from '../../../shared/engine-release.ts';
import { readFile } from 'node:fs/promises';
import { resolvePluginName } from '../ui/env.ts';
import { resolveUpdaterLocale } from '../ui/i18n.ts';
import { wrapMessageLines, wrapTextLine } from '../ui/presenter.ts';

const require = createRequire(import.meta.url);

test('resolveUpdaterLocale maps Chinese and fallback locales', () => {
  assert.equal(resolveUpdaterLocale('zh_CN'), 'zh');
  assert.equal(resolveUpdaterLocale('zh-TW'), 'zh');
  assert.equal(resolveUpdaterLocale('en_US'), 'en');
  assert.equal(resolveUpdaterLocale(undefined), 'en');
});

test('resolvePluginName extracts decoded plugin names from script URLs', () => {
  assert.equal(resolvePluginName('file:///game/js/plugins/OpenMzUpdater.js'), 'OpenMzUpdater');
  assert.equal(resolvePluginName('file:///game/js/plugins/My%20Updater.js'), 'My Updater');
  assert.equal(resolvePluginName(''), 'OpenMzUpdater');
});

test('wrapTextLine wraps words, paths, and unbroken strings predictably', () => {
  const mono = (value: string) => value.length;
  assert.deepEqual(wrapTextLine('alpha beta gamma', 10, mono), ['alpha beta', 'gamma']);
  assert.deepEqual(wrapTextLine('js_backup/20260101/main.js', 12, mono), ['js_backup/', '20260101/', 'main.js']);
  assert.deepEqual(wrapTextLine('abcdefghij', 4, mono), ['abcd', 'efgh', 'ij']);
  assert.deepEqual(wrapMessageLines(['line1\r\nline2', 'line3'], 20, mono), ['line1', 'line2', 'line3']);
});

test('Scene_Title ignores background checks while scene is changing and adapts confirm columns', async (t: TestContext) => {
  const root = await mkdtemp(join(tmpdir(), 'openmz-ui-'));
  t.onTestFinished(() => rm(root, { recursive: true, force: true }));

  const pluginFile = await buildPlugin('OpenMzUpdater', { outDir: root });
  const updaterSource = await readFile(pluginFile, 'utf8');

  const projectRoot = join(root, 'project');
  const releaseDir = join(root, 'release');
  await mkdir(join(projectRoot, 'js'), { recursive: true });
  await mkdir(releaseDir, { recursive: true });

  const meta = {
    name: 'OpenMZ' as const,
    version: '1.2.3',
    format: runtimeFormat,
    pixiVersion: '8.23.0',
  };
  const archive = gzipSync(
    createTarBuffer([
      ...coreScripts.map((name) => ({
        relativePath: `js/${name}`,
        content: Buffer.from('new'),
      })),
      { relativePath: 'js/libs/pixi.js', content: Buffer.from('pixi') },
      { relativePath: statePath, content: Buffer.from(JSON.stringify(meta)) },
    ]),
  );
  await writeFile(join(releaseDir, 'openmz.tar.gz'), archive);
  const manifestPath = join(releaseDir, 'manifest.json');
  await writeFile(
    manifestPath,
    JSON.stringify({
      schemaVersion: manifestSchema,
      ...meta,
      archive: {
        url: 'openmz.tar.gz',
        size: archive.length,
        sha256: createHash('sha256').update(archive).digest('hex'),
      },
    }),
  );

  function FakeWindowBase(this: Record<string, unknown>) {
    this.openness = 255;
    this.height = 0;
    this.innerWidth = 500;
  }
  FakeWindowBase.prototype.initialize = function () {};

  function FakeHorzCommand(this: Record<string, unknown>) {
    FakeWindowBase.call(this);
  }
  FakeHorzCommand.prototype = Object.create(FakeWindowBase.prototype);
  FakeHorzCommand.prototype.constructor = FakeHorzCommand;
  FakeHorzCommand.prototype.deactivate = function () {};
  FakeHorzCommand.prototype.refresh = function () {};
  FakeHorzCommand.prototype.select = function () {};
  FakeHorzCommand.prototype.addCommand = function () {};
  FakeHorzCommand.prototype.setHandler = function () {};
  FakeHorzCommand.prototype.open = function () {};
  FakeHorzCommand.prototype.activate = function () {};
  FakeHorzCommand.prototype.close = function () {};
  class FakeSceneTitle {
    declare checkOpenMzUpdate: () => Promise<void>;
    declare showOpenMzMessage: (title: string, lines: string[]) => void;
    declare showOpenMzCommands: (commands: [string, string][]) => void;
    declare createOpenMzUpdater: () => void;
    declare _openMzConfirmWindow?: {
      maxCols: () => number;
      setCommands: (commands: [string, string][]) => void;
    };
    create() {}
    isBusy() {
      return false;
    }
    terminate() {}
    calcWindowHeight() {
      return 64;
    }
    addWindow() {}
  }

  let sceneChanging = false;
  const manager: { _scene?: unknown; isSceneChanging: () => boolean } = {
    isSceneChanging: () => sceneChanging,
  };

  runInNewContext(updaterSource, {
    require,
    URL,
    AbortController,
    setTimeout,
    clearTimeout,
    Graphics: { boxWidth: 816, boxHeight: 624 },
    Rectangle: function () {},
    PluginManager: {
      parameters: () => ({ manifestUrl: pathToFileURL(manifestPath).href }),
    },
    Scene_Title: FakeSceneTitle,
    SceneManager: manager,
    Window_Base: FakeWindowBase,
    Window_HorzCommand: FakeHorzCommand,
    Utils: { isNwjs: () => true },
    document: { currentScript: { src: 'file:///js/plugins/OpenMzUpdater.js' } },
    window: {
      location: {
        protocol: 'file:',
        href: pathToFileURL(join(projectRoot, 'index.html')).href,
      },
    },
    $dataSystem: { locale: 'en_US' },
  });

  const scene = new FakeSceneTitle();
  manager._scene = scene;
  const shown: string[] = [];
  scene.showOpenMzMessage = (title) => shown.push(title);
  scene.showOpenMzCommands = () => {};

  // When scene is transitioning out, background check must not display UI.
  sceneChanging = true;
  await scene.checkOpenMzUpdate();
  assert.deepEqual(shown, []);

  // When scene is active, check displays UI.
  sceneChanging = false;
  await scene.checkOpenMzUpdate();
  assert.equal(shown.length, 1);

  // Confirm window adapts column count between 1 and 2 commands.
  scene.createOpenMzUpdater();
  scene._openMzConfirmWindow!.setCommands([['Continue', 'close']]);
  assert.equal(scene._openMzConfirmWindow!.maxCols(), 1);
  scene._openMzConfirmWindow!.setCommands([
    ['Update', 'update'],
    ['Continue', 'close'],
  ]);
  assert.equal(scene._openMzConfirmWindow!.maxCols(), 2);
});
