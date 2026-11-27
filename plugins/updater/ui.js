import { checkForUpdate, installUpdate } from './core.js';

export function setupUpdater() {
    if (typeof PluginManager === 'undefined' || typeof Scene_Title === 'undefined') return;
    const script = document.currentScript?.src || '';
    const pluginName = script ? decodeURIComponent(script.split('/').pop().replace(/\.js$/i, '')) : 'OpenMzUpdater';
    const manifestUrl = String(PluginManager.parameters(pluginName).manifestUrl || '').trim();
    const nodeRequire = typeof require === 'function' ? require : null;
    if (!manifestUrl || !nodeRequire || !Utils.isNwjs()) return;

    const texts = {
        zh: {
            title: '更新 OpenMZ',
            version: (current, target) => `${current || 'RPG Maker MZ'} → OpenMZ ${target}`,
            backup: '原文件将备份到 js_backup/。',
            check: '正在检查更新',
            current: '当前已是最新版',
            download: (loaded, total) => `下载更新包：${Math.floor(loaded / 1024)} / ${Math.ceil(total / 1024)} KB`,
            verify: '校验并解压更新包',
            apply: '备份并安装更新',
            done: '更新完成',
            installed: version => `已安装 OpenMZ ${version}，重启后生效。`,
            saved: path => `备份：${path}`,
            error: '更新失败',
            update: '更新',
            skip: '继续游戏',
            reload: '立即重启',
            retry: '重试',
            later: '稍后重启',
        },
        en: {
            title: 'Update OpenMZ',
            version: (current, target) => `${current || 'RPG Maker MZ'} → OpenMZ ${target}`,
            backup: 'Original files will be saved in js_backup/.',
            check: 'Checking for updates',
            current: 'Already up to date',
            download: (loaded, total) => `Downloading: ${Math.floor(loaded / 1024)} / ${Math.ceil(total / 1024)} KB`,
            verify: 'Verifying and extracting',
            apply: 'Backing up and installing',
            done: 'Update installed',
            installed: version => `OpenMZ ${version} will be used after restarting.`,
            saved: path => `Backup: ${path}`,
            error: 'Update failed',
            update: 'Update',
            skip: 'Continue',
            reload: 'Restart now',
            retry: 'Retry',
            later: 'Restart later',
        },
    };
    const getTexts = () => {
        const locale = $dataSystem.locale || navigator.language;
        return String(locale).toLowerCase().startsWith('zh') ? texts.zh : texts.en;
    };
    const projectRoot = () => {
        const path = nodeRequire('path');
        return window.location.protocol === 'file:'
            ? path.dirname(nodeRequire('url').fileURLToPath(window.location.href))
            : process.mainModule ? path.dirname(process.mainModule.filename) : process.cwd();
    };
    const reload = () => {
        const app = typeof nw === 'object' && nw.Window ? nw.Window.get() : null;
        if (app?.reloadIgnoringCache) app.reloadIgnoringCache();
        else window.location.reload();
    };
    const render = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    class Window_OpenMzMessage extends Window_Base {
        initialize(rect) {
            super.initialize(rect);
            this.openness = 0;
        }

        setMessage(title, lines, progress) {
            const inset = this.itemPadding();
            const width = this.innerWidth - inset * 2;
            const heading = this.wrapLine(title, width);
            const body = lines.flatMap(text => String(text).split(/\r?\n/).flatMap(line => this.wrapLine(line, width)));
            const hasProgress = typeof progress === 'number';
            const height = this.fittingHeight(heading.length + body.length + (hasProgress ? 1 : 0));
            if (this.height !== height) {
                this.height = height;
                this.createContents();
            } else this.contents.clear();
            const lineHeight = this.lineHeight();
            this.changeTextColor(ColorManager.systemColor());
            heading.forEach((line, index) => this.drawText(line, inset, index * lineHeight, width, 'center'));
            this.resetTextColor();
            body.forEach((line, index) => this.drawText(line, inset, (heading.length + index) * lineHeight, width));
            if (hasProgress) this.drawProgress(progress, inset, (heading.length + body.length) * lineHeight, width);
        }

        drawProgress(progress, x, y, width) {
            const rate = Math.min(Math.max(progress, 0), 1);
            const labelWidth = this.textWidth('100%');
            const barWidth = width - labelWidth - this.itemPadding();
            const barHeight = 12;
            const barY = y + Math.floor((this.lineHeight() - barHeight) / 2);
            this.contents.fillRect(x, barY, barWidth, barHeight, ColorManager.gaugeBackColor());
            this.contents.gradientFillRect(x + 1, barY + 1, Math.floor((barWidth - 2) * rate), barHeight - 2,
                ColorManager.hpGaugeColor1(), ColorManager.hpGaugeColor2());
            this.drawText(`${Math.floor(rate * 100)}%`, x + width - labelWidth, y, labelWidth, 'right');
        }

        wrapLine(text, width) {
            const lines = [];
            let line = '';
            for (const token of text.match(/(?:[^/\s]+\/*|\/+)\s*/g) || []) {
                const word = token.trimEnd();
                if (line && this.textWidth(line + word) > width) {
                    lines.push(line.trimEnd());
                    line = '';
                }
                if (this.textWidth(word) <= width) {
                    line += token;
                    continue;
                }
                for (const character of word) {
                    if (line && this.textWidth(line + character) > width) {
                        lines.push(line);
                        line = '';
                    }
                    line += character;
                }
                line += token.slice(word.length);
            }
            lines.push(line.trimEnd());
            return lines;
        }
    }

    class Window_OpenMzConfirm extends Window_HorzCommand {
        initialize(rect) {
            super.initialize(rect);
            this.openness = 0;
            this.deactivate();
        }
        maxCols() { return 2; }
        setCommands(commands) {
            this._openMzCommands = commands;
            this.refresh();
            this.select(0);
        }
        makeCommandList() {
            for (const [label, symbol] of this._openMzCommands || []) this.addCommand(label, symbol);
        }
    }

    let checked = false;
    const createTitle = Scene_Title.prototype.create;
    Scene_Title.prototype.create = function() {
        createTitle.call(this);
        if (!checked) {
            checked = true;
            this.checkOpenMzUpdate();
        }
    };
    const titleBusy = Scene_Title.prototype.isBusy;
    Scene_Title.prototype.isBusy = function() {
        return Boolean(this._openMzUpdaterActive)
            || Boolean(this._openMzMessageWindow?.isClosing()) || titleBusy.call(this);
    };

    Scene_Title.prototype.createOpenMzUpdater = function() {
        if (this._openMzMessageWindow) return;
        const width = Math.min(540, Graphics.boxWidth - 48);
        const x = Math.floor((Graphics.boxWidth - width) / 2);
        this._openMzMessageWindow = new Window_OpenMzMessage(new Rectangle(x, 0, width, this.calcWindowHeight(1, false)));
        this._openMzConfirmWindow = new Window_OpenMzConfirm(new Rectangle(x, 0, width, this.calcWindowHeight(1, true)));
        this._openMzConfirmWindow.setHandler('update', this.runOpenMzUpdate.bind(this));
        this._openMzConfirmWindow.setHandler('check', this.checkOpenMzUpdate.bind(this));
        this._openMzConfirmWindow.setHandler('reload', reload);
        this._openMzConfirmWindow.setHandler('close', this.closeOpenMzUpdater.bind(this));
        this._openMzConfirmWindow.setHandler('cancel', this.closeOpenMzUpdater.bind(this));
        this.addWindow(this._openMzMessageWindow);
        this.addWindow(this._openMzConfirmWindow);
    };
    Scene_Title.prototype.showOpenMzMessage = function(title, lines, progress) {
        this.createOpenMzUpdater();
        this._openMzUpdaterActive = true;
        this._commandWindow.deactivate();
        const message = this._openMzMessageWindow;
        const commands = this._openMzConfirmWindow;
        message.setMessage(title, lines, progress);
        message.y = Math.floor((Graphics.boxHeight - message.height - commands.height) / 2);
        commands.y = message.y + message.height;
        message.open();
    };
    Scene_Title.prototype.showOpenMzCommands = function(commands) {
        this._openMzConfirmWindow.setCommands(commands);
        this._openMzConfirmWindow.open();
        this._openMzConfirmWindow.activate();
    };
    Scene_Title.prototype.checkOpenMzUpdate = async function() {
        const t = getTexts();
        if (this._openMzConfirmWindow) {
            this._openMzConfirmWindow.deactivate();
            this._openMzConfirmWindow.close();
            this.showOpenMzMessage(t.title, [t.check]);
        }
        try {
            const update = await checkForUpdate({ manifestUrl, projectRoot: projectRoot(), nodeRequire });
            // A background version check must not reopen a title scene the player has left.
            if (SceneManager._scene !== this) return;
            this._openMzUpdate = update;
            if (update.available) {
                this.showOpenMzMessage(t.title, [t.version(update.installed?.version, update.manifest.version), t.backup]);
                this.showOpenMzCommands([[t.update, 'update'], [t.skip, 'close']]);
            } else if (this._openMzMessageWindow) {
                this.showOpenMzMessage(t.title, [t.current]);
                this.showOpenMzCommands([[t.skip, 'close']]);
            }
        } catch (error) {
            if (SceneManager._scene !== this) return;
            this.showOpenMzMessage(t.error, [error.message || String(error)]);
            this.showOpenMzCommands([[t.retry, 'check'], [t.skip, 'close']]);
        }
    };
    Scene_Title.prototype.runOpenMzUpdate = async function() {
        const t = getTexts();
        let last = '';
        const showProgress = event => {
            const ratio = event.total ? event.loaded / event.total : 0;
            const progress = event.phase === 'download' ? Math.min(ratio, 1) * 0.8 : event.phase === 'verify' ? 0.8 : 0.9;
            const text = event.phase === 'download' ? t.download(event.loaded, event.total)
                : event.phase === 'verify' ? t.verify : t.apply;
            const key = `${text}:${Math.floor(progress * 100)}`;
            if (key === last) return;
            last = key;
            this.showOpenMzMessage(t.title, [text], progress);
        };
        this._openMzConfirmWindow.deactivate();
        this._openMzConfirmWindow.close();
        try {
            const result = await installUpdate({
                update: this._openMzUpdate,
                projectRoot: projectRoot(),
                nodeRequire,
                onProgress: event => { showProgress(event); return render(); },
                onDownload: showProgress,
            });
            this.showOpenMzMessage(t.done, [t.installed(result.version), t.saved(result.backupRelativeDir)], 1);
            this.showOpenMzCommands([[t.reload, 'reload'], [t.later, 'close']]);
        } catch (error) {
            this.showOpenMzMessage(t.error, [error.message || String(error)]);
            this.showOpenMzCommands([[t.retry, 'update'], [t.skip, 'close']]);
        }
    };
    Scene_Title.prototype.closeOpenMzUpdater = function() {
        this._openMzUpdaterActive = false;
        this._openMzConfirmWindow.deactivate();
        this._openMzConfirmWindow.close();
        this._openMzMessageWindow.close();
        this._commandWindow.activate();
    };
}
