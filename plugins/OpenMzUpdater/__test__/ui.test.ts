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
import { getUpdaterTexts, resolveUpdaterLocale } from '../ui/i18n.ts';
import {
  createAvailableView,
  createErrorView,
  createInstalledView,
  formatProgressSnapshot,
  wrapMessageLines,
  wrapTextLine,
} from '../ui/presenter.ts';

const require = createRequire(import.meta.url);

test('i18n resolves Chinese and English locales cleanly', () => {
  assert.equal(resolveUpdaterLocale('zh_CN'), 'zh');
  assert.equal(resolveUpdaterLocale('zh-TW'), 'zh');
  assert.equal(resolveUpdaterLocale('en_US'), 'en');
  assert.equal(resolveUpdaterLocale(undefined), 'en');

  const zh = getUpdaterTexts('zh_CN');
  const en = getUpdaterTexts('ja_JP');
  assert.equal(zh.title, '更新 OpenMZ');
  assert.equal(en.title, 'Update OpenMZ');
  assert.equal(zh.version(undefined, '2.0.0'), 'RPG Maker MZ → OpenMZ 2.0.0');
  assert.equal(en.version('1.0.0', '2.0.0'), '1.0.0 → OpenMZ 2.0.0');
});

test('resolvePluginName extracts decoded plugin names from script URLs', () => {
  assert.equal(resolvePluginName('file:///game/js/plugins/OpenMzUpdater.js'), 'OpenMzUpdater');
  assert.equal(resolvePluginName('file:///game/js/plugins/My%20Updater.js'), 'My Updater');
  assert.equal(resolvePluginName(''), 'OpenMzUpdater');
});

test('presenter formats progress snapshots and dialog views', () => {
  const texts = getUpdaterTexts('en');

  const dlHalf = formatProgressSnapshot({ phase: 'download', file: 'a.tar.gz', loaded: 5120, total: 10240 }, texts);
  assert.equal(dlHalf.progress, 0.4);
  assert.match(dlHalf.text, /5 \/ 10 KB/);

  const dlOverflow = formatProgressSnapshot(
    { phase: 'download', file: 'a.tar.gz', loaded: 20480, total: 10240 },
    texts,
  );
  assert.equal(dlOverflow.progress, 0.8);

  const verify = formatProgressSnapshot({ phase: 'verify' }, texts);
  assert.equal(verify.progress, 0.8);
  assert.equal(verify.text, texts.verify);

  const apply = formatProgressSnapshot({ phase: 'apply', total: 10 }, texts);
  assert.equal(apply.progress, 0.9);
  assert.equal(apply.text, texts.apply);

  const avail = createAvailableView(
    {
      installed: null,
      available: true,
      manifest: {
        name: 'OpenMZ',
        version: '2.0.0',
        format: runtimeFormat,
        pixiVersion: '8.23.0',
        archive: { url: 'file:///a.tar.gz', size: 10, sha256: 'a'.repeat(64) },
      },
    },
    texts,
  );
  assert.deepEqual(avail.commands, [
    [texts.update, 'update'],
    [texts.skip, 'close'],
  ]);

  const installed = createInstalledView(
    {
      name: 'OpenMZ',
      version: '2.0.0',
      format: runtimeFormat,
      pixiVersion: '8.23.0',
      updatedFiles: ['js/main.js'],
      backupRelativeDir: 'js_backup/20260101-000000',
      requiresRestart: true,
    },
    texts,
  );
  assert.equal(installed.progress, 1);
  assert.deepEqual(installed.commands, [
    [texts.reload, 'reload'],
    [texts.later, 'close'],
  ]);

  const errView = createErrorView(new Error('Network down'), 'check', texts);
  assert.deepEqual(errView.lines, ['Network down']);
  assert.deepEqual(errView.commands, [
    [texts.retry, 'check'],
    [texts.skip, 'close'],
  ]);
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
  assert.deepEqual(shown, ['Update OpenMZ']);

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
