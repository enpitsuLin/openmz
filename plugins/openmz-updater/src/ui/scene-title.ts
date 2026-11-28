import type { UpdateCheck, UpdateProgress } from '../types.ts';
import type { UpdaterEnvironment } from './env.ts';
import type { DialogView, UpdaterCommand } from './presenter.ts';
import type { UpdaterConfirmWindow, UpdaterMessageWindow } from './windows.ts';
import { checkForUpdate, installUpdate } from '../core.ts';
import { isUpdaterError } from '../errors.ts';
import { getUpdaterTexts } from './i18n.ts';
import {
  createAvailableView,
  createCheckingView,
  createErrorView,
  createInstalledView,
  createUpToDateView,
  formatProgressSnapshot,
} from './presenter.ts';
import { createUpdaterWindows } from './windows.ts';

type UpdaterSceneState = 'idle' | 'checking' | 'prompt' | 'installing' | 'done' | 'error';

export interface UpdaterTitleScene extends Scene_Title {
  _openMzUpdaterActive?: boolean;
  _openMzState?: UpdaterSceneState;
  _openMzAbortController?: AbortController;
  _openMzMessageWindow?: UpdaterMessageWindow;
  _openMzConfirmWindow?: UpdaterConfirmWindow;
  _openMzUpdate?: UpdateCheck;
  createOpenMzUpdater(): void;
  showOpenMzMessage(title: string, lines: string[], progress?: number): void;
  showOpenMzCommands(commands: UpdaterCommand[]): void;
  checkOpenMzUpdate(): Promise<void>;
  runOpenMzUpdate(): Promise<void>;
  closeOpenMzUpdater(): void;
}

const DIALOG_MAX_WIDTH = 540;
const DIALOG_HORIZONTAL_MARGIN = 48;

function isSceneStillActive(scene: UpdaterTitleScene): boolean {
  if (typeof SceneManager === 'undefined') return false;
  if (SceneManager._scene !== scene) return false;
  if (typeof SceneManager.isSceneChanging === 'function' && SceneManager.isSceneChanging()) {
    return false;
  }
  return true;
}

function presentDialog(scene: UpdaterTitleScene, view: DialogView): void {
  scene.showOpenMzMessage(view.title, view.lines, view.progress);
  if (view.commands) {
    scene.showOpenMzCommands(view.commands);
  }
}

export function attachUpdaterToSceneTitle(env: UpdaterEnvironment): void {
  const { Window_OpenMzMessage, Window_OpenMzConfirm } = createUpdaterWindows();
  const title = Scene_Title.prototype as UpdaterTitleScene;
  let hasAutoChecked = false;

  const originalCreate = title.create;
  title.create = function (this: UpdaterTitleScene) {
    originalCreate.call(this);
    if (!hasAutoChecked) {
      hasAutoChecked = true;
      void this.checkOpenMzUpdate();
    }
  };

  const originalIsBusy = title.isBusy;
  title.isBusy = function (this: UpdaterTitleScene) {
    return (
      Boolean(this._openMzUpdaterActive) || Boolean(this._openMzMessageWindow?.isClosing()) || originalIsBusy.call(this)
    );
  };

  if (typeof title.terminate === 'function') {
    const originalTerminate = title.terminate;
    title.terminate = function (this: UpdaterTitleScene) {
      if (this._openMzState === 'checking') {
        this._openMzAbortController?.abort();
      }
      originalTerminate.call(this);
    };
  }

  title.createOpenMzUpdater = function (this: UpdaterTitleScene) {
    if (this._openMzMessageWindow) return;
    const width = Math.min(DIALOG_MAX_WIDTH, Graphics.boxWidth - DIALOG_HORIZONTAL_MARGIN);
    const x = Math.floor((Graphics.boxWidth - width) / 2);
    this._openMzMessageWindow = new Window_OpenMzMessage(new Rectangle(x, 0, width, this.calcWindowHeight(1, false)));
    this._openMzConfirmWindow = new Window_OpenMzConfirm(new Rectangle(x, 0, width, this.calcWindowHeight(1, true)));
    this._openMzConfirmWindow.setHandler('update', this.runOpenMzUpdate.bind(this));
    this._openMzConfirmWindow.setHandler('check', this.checkOpenMzUpdate.bind(this));
    this._openMzConfirmWindow.setHandler('reload', env.reloadApp);
    this._openMzConfirmWindow.setHandler('close', this.closeOpenMzUpdater.bind(this));
    this._openMzConfirmWindow.setHandler('cancel', this.closeOpenMzUpdater.bind(this));
    this.addWindow(this._openMzMessageWindow);
    this.addWindow(this._openMzConfirmWindow);
  };

  title.showOpenMzMessage = function (this: UpdaterTitleScene, heading: string, lines: string[], progress?: number) {
    this.createOpenMzUpdater();
    this._openMzUpdaterActive = true;
    this._commandWindow?.deactivate();
    const message = this._openMzMessageWindow!;
    const commands = this._openMzConfirmWindow!;
    message.setMessage(heading, lines, progress);
    message.y = Math.max(0, Math.floor((Graphics.boxHeight - message.height - commands.height) / 2));
    commands.y = message.y + message.height;
    message.open();
  };

  title.showOpenMzCommands = function (this: UpdaterTitleScene, commands: UpdaterCommand[]) {
    this._openMzConfirmWindow!.setCommands(commands);
    this._openMzConfirmWindow!.open();
    this._openMzConfirmWindow!.activate();
  };

  title.checkOpenMzUpdate = async function (this: UpdaterTitleScene) {
    if (this._openMzState === 'checking' || this._openMzState === 'installing') {
      return;
    }

    const texts = getUpdaterTexts(env.getLocale());
    this._openMzState = 'checking';
    const controller = typeof AbortController === 'function' ? new AbortController() : undefined;
    this._openMzAbortController = controller;

    if (this._openMzConfirmWindow) {
      this._openMzConfirmWindow.deactivate();
      this._openMzConfirmWindow.close();
      presentDialog(this, createCheckingView(texts));
    }

    try {
      const update = await checkForUpdate({
        manifestUrl: env.manifestUrl,
        projectRoot: env.getProjectRoot(),
        nodeRequire: env.nodeRequire,
        signal: controller?.signal,
      });

      if (!isSceneStillActive(this)) {
        this._openMzState = 'idle';
        return;
      }

      this._openMzUpdate = update;
      if (update.available) {
        this._openMzState = 'prompt';
        presentDialog(this, createAvailableView(update, texts));
      } else if (this._openMzMessageWindow) {
        this._openMzState = 'prompt';
        presentDialog(this, createUpToDateView(texts));
      } else {
        this._openMzState = 'idle';
      }
    } catch (error) {
      if (!isSceneStillActive(this) || (isUpdaterError(error) && error.code === 'ABORTED')) {
        this._openMzState = 'idle';
        return;
      }
      this._openMzState = 'error';
      presentDialog(this, createErrorView(error, 'check', texts));
    } finally {
      if (this._openMzAbortController === controller) {
        this._openMzAbortController = undefined;
      }
    }
  };

  title.runOpenMzUpdate = async function (this: UpdaterTitleScene) {
    if (this._openMzState === 'installing' || this._openMzState === 'checking' || !this._openMzUpdate) {
      return;
    }

    const texts = getUpdaterTexts(env.getLocale());
    let lastProgressKey = '';

    const renderProgress = (event: UpdateProgress) => {
      if (!isSceneStillActive(this)) return;
      const snapshot = formatProgressSnapshot(event, texts);
      if (snapshot.key === lastProgressKey) return;
      lastProgressKey = snapshot.key;
      this.showOpenMzMessage(texts.title, [snapshot.text], snapshot.progress);
    };

    this._openMzState = 'installing';
    this._openMzConfirmWindow?.deactivate();
    this._openMzConfirmWindow?.close();

    try {
      const result = await installUpdate({
        update: this._openMzUpdate,
        projectRoot: env.getProjectRoot(),
        nodeRequire: env.nodeRequire,
        onProgress: (event) => {
          renderProgress(event);
          return env.waitForRender();
        },
        onDownload: renderProgress,
      });

      if (!isSceneStillActive(this)) {
        this._openMzState = 'done';
        return;
      }

      this._openMzState = 'done';
      presentDialog(this, createInstalledView(result, texts));
    } catch (error) {
      if (!isSceneStillActive(this)) {
        this._openMzState = 'error';
        return;
      }
      this._openMzState = 'error';
      presentDialog(this, createErrorView(error, 'update', texts));
    }
  };

  title.closeOpenMzUpdater = function (this: UpdaterTitleScene) {
    if (this._openMzState === 'installing') return;
    this._openMzState = 'idle';
    this._openMzUpdaterActive = false;
    this._openMzConfirmWindow?.deactivate();
    this._openMzConfirmWindow?.close();
    this._openMzMessageWindow?.close();
    this._commandWindow?.activate();
  };
}
