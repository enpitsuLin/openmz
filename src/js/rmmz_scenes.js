// rmmz_scenes.js v1.10.0

/**
 * The superclass of all scenes within the game.
 */
class Scene_Base extends Stage {
    /** @param {[]} args */
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
        /** @type {boolean} */
        this._started = false;
        /** @type {boolean} */
        this._active = false;
        /** @type {number} */
        this._fadeSign = 0;
        /** @type {number} */
        this._fadeDuration = 0;
        /** @type {number | boolean} */
        this._fadeWhite = 0;
        /** @type {number} */
        this._fadeOpacity = 0;
        this.createColorFilter();
    }

    /** @returns {void} */
    create() {
        //
    }

    /** @returns {boolean} */
    isActive() {
        return this._active;
    }

    /** @returns {boolean} */
    isReady() {
        return (
            ImageManager.isReady() &&
            EffectManager.isReady() &&
            FontManager.isReady()
        );
    }

    /** @returns {void} */
    start() {
        this._started = true;
        this._active = true;
    }

    /** @returns {void} */
    update() {
        this.updateFade();
        this.updateColorFilter();
        this.updateChildren();
        AudioManager.checkErrors();
    }

    /** @returns {void} */
    stop() {
        this._active = false;
    }

    /** @returns {boolean} */
    isStarted() {
        return this._started;
    }

    /** @returns {boolean} */
    isBusy() {
        return this.isFading();
    }

    /** @returns {boolean} */
    isFading() {
        return this._fadeDuration > 0;
    }

    /** @returns {void} */
    terminate() {
        //
    }

    /** @returns {void} */
    createWindowLayer() {
        this._windowLayer = new WindowLayer();
        this._windowLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
        this._windowLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
        this.addChild(this._windowLayer);
    }

    /**
     * @param {import("pixi.js").Container} window
     * @returns {void}
     */
    addWindow(window) {
        this._windowLayer.addWindow(window);
    }

    /**
     * @param {number} duration
     * @param {number | boolean} [white]
     * @returns {void}
     */
    startFadeIn(duration, white) {
        this._fadeSign = 1;
        this._fadeDuration = duration || 30;
        this._fadeWhite = white;
        this._fadeOpacity = 255;
        this.updateColorFilter();
    }

    /**
     * @param {number} duration
     * @param {number | boolean} [white]
     * @returns {void}
     */
    startFadeOut(duration, white) {
        this._fadeSign = -1;
        this._fadeDuration = duration || 30;
        this._fadeWhite = white;
        this._fadeOpacity = 0;
        this.updateColorFilter();
    }

    /** @returns {void} */
    createColorFilter() {
        this._colorFilter = new ColorFilter();
        this.filters = [this._colorFilter];
    }

    /** @returns {void} */
    updateColorFilter() {
        const c = this._fadeWhite ? 255 : 0;
        const blendColor = [c, c, c, this._fadeOpacity];
        this._colorFilter.setBlendColor(blendColor);
    }

    /** @returns {void} */
    updateFade() {
        if (this._fadeDuration > 0) {
            const d = this._fadeDuration;
            if (this._fadeSign > 0) {
                this._fadeOpacity -= this._fadeOpacity / d;
            } else {
                this._fadeOpacity += (255 - this._fadeOpacity) / d;
            }
            this._fadeDuration--;
        }
    }

    /** @returns {void} */
    updateChildren() {
        for (const child of this.children) {
            if (child.update) {
                child.update();
            }
        }
    }

    /** @returns {void} */
    popScene() {
        SceneManager.pop();
    }

    /** @returns {void} */
    checkGameover() {
        if ($gameParty.isAllDead()) {
            SceneManager.goto(Scene_Gameover);
        }
    }

    /** @returns {void} */
    fadeOutAll() {
        const time = this.slowFadeSpeed() / 60;
        AudioManager.fadeOutBgm(time);
        AudioManager.fadeOutBgs(time);
        AudioManager.fadeOutMe(time);
        this.startFadeOut(this.slowFadeSpeed());
    }

    /** @returns {number} */
    fadeSpeed() {
        return 24;
    }

    /** @returns {number} */
    slowFadeSpeed() {
        return this.fadeSpeed() * 2;
    }

    /**
     * @param {Sprite} sprite
     * @returns {void}
     */
    scaleSprite(sprite) {
        const ratioX = Graphics.width / sprite.bitmap.width;
        const ratioY = Graphics.height / sprite.bitmap.height;
        const scale = Math.max(ratioX, ratioY, 1.0);
        sprite.scale.x = scale;
        sprite.scale.y = scale;
    }

    /**
     * @param {Sprite} sprite
     * @returns {void}
     */
    centerSprite(sprite) {
        sprite.x = Graphics.width / 2;
        sprite.y = Graphics.height / 2;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
    }

    /** @returns {boolean} */
    isBottomHelpMode() {
        return true;
    }

    /** @returns {boolean} */
    isBottomButtonMode() {
        return false;
    }

    /** @returns {boolean} */
    isRightInputMode() {
        return true;
    }

    /** @returns {number} */
    mainCommandWidth() {
        return 240;
    }

    /** @returns {number} */
    buttonAreaTop() {
        if (this.isBottomButtonMode()) {
            return Graphics.boxHeight - this.buttonAreaHeight();
        } else {
            return 0;
        }
    }

    /** @returns {number} */
    buttonAreaBottom() {
        return this.buttonAreaTop() + this.buttonAreaHeight();
    }

    /** @returns {number} */
    buttonAreaHeight() {
        return 52;
    }

    /** @returns {number} */
    buttonY() {
        const offsetY = Math.floor((this.buttonAreaHeight() - 48) / 2);
        return this.buttonAreaTop() + offsetY;
    }

    /**
     * @param {number} numLines
     * @param {boolean} selectable
     * @returns {number}
     */
    calcWindowHeight(numLines, selectable) {
        if (selectable) {
            return Window_Selectable.prototype.fittingHeight(numLines);
        } else {
            return Window_Base.prototype.fittingHeight(numLines);
        }
    }

    /** @returns {void} */
    requestAutosave() {
        if (this.isAutosaveEnabled()) {
            this.executeAutosave();
        }
    }

    /** @returns {boolean} */
    isAutosaveEnabled() {
        return (
            !DataManager.isBattleTest() &&
            !DataManager.isEventTest() &&
            $gameSystem.isAutosaveEnabled() &&
            $gameSystem.isSaveEnabled()
        );
    }

    /** @returns {void} */
    executeAutosave() {
        $gameSystem.onBeforeSave();
        DataManager.saveGame(0)
            .then(() => this.onAutosaveSuccess())
            .catch(() => this.onAutosaveFailure());
    }

    /** @returns {void} */
    onAutosaveSuccess() {
        //
    }

    /** @returns {void} */
    onAutosaveFailure() {
        //
    }
}

/**
 * The scene class for initializing the entire game.
 */
class Scene_Boot extends Scene_Base {
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
        /** @type {boolean} */
        this._databaseLoaded = false;
    }

    /** @returns {void} */
    create() {
        super.create();
        DataManager.loadDatabase();
        StorageManager.updateForageKeys();
    }

    /** @returns {boolean} */
    isReady() {
        if (!this._databaseLoaded) {
            if (
                DataManager.isDatabaseLoaded() &&
                StorageManager.forageKeysUpdated()
            ) {
                this._databaseLoaded = true;
                this.onDatabaseLoaded();
            }
            return false;
        }
        return super.isReady() && this.isPlayerDataLoaded();
    }

    /** @returns {void} */
    onDatabaseLoaded() {
        this.setEncryptionInfo();
        this.loadSystemImages();
        this.loadPlayerData();
        this.loadGameFonts();
    }

    /** @returns {void} */
    setEncryptionInfo() {
        const hasImages = $dataSystem.hasEncryptedImages;
        const hasAudio = $dataSystem.hasEncryptedAudio;
        const key = $dataSystem.encryptionKey;
        Utils.setEncryptionInfo(hasImages, hasAudio, key);
    }

    /** @returns {void} */
    loadSystemImages() {
        ColorManager.loadWindowskin();
        ImageManager.loadSystem("IconSet");
    }

    /** @returns {void} */
    loadPlayerData() {
        DataManager.loadGlobalInfo();
        ConfigManager.load();
    }

    /** @returns {void} */
    loadGameFonts() {
        const advanced = $dataSystem.advanced;
        FontManager.load("rmmz-mainfont", advanced.mainFontFilename);
        FontManager.load("rmmz-numberfont", advanced.numberFontFilename);
    }

    /** @returns {boolean} */
    isPlayerDataLoaded() {
        return DataManager.isGlobalInfoLoaded() && ConfigManager.isLoaded();
    }

    /** @returns {void} */
    start() {
        super.start();
        SoundManager.preloadImportantSounds();
        if (DataManager.isBattleTest()) {
            DataManager.setupBattleTest();
            SceneManager.goto(Scene_Battle);
        } else if (DataManager.isEventTest()) {
            DataManager.setupEventTest();
            SceneManager.goto(Scene_Map);
        } else if (DataManager.isTitleSkip()) {
            this.checkPlayerLocation();
            DataManager.setupNewGame();
            SceneManager.goto(Scene_Map);
        } else {
            this.startNormalGame();
        }
        this.resizeScreen();
        this.updateDocumentTitle();
    }

    /** @returns {void} */
    startNormalGame() {
        this.checkPlayerLocation();
        DataManager.setupNewGame();
        Window_TitleCommand.initCommandPosition();
        SceneManager.goto(Scene_Splash);
    }

    /** @returns {void} */
    resizeScreen() {
        const screenWidth = $dataSystem.advanced.screenWidth;
        const screenHeight = $dataSystem.advanced.screenHeight;
        Graphics.resize(screenWidth, screenHeight);
        Graphics.defaultScale = this.screenScale();
        this.adjustBoxSize();
        this.adjustWindow();
    }

    /** @returns {void} */
    adjustBoxSize() {
        const uiAreaWidth = $dataSystem.advanced.uiAreaWidth;
        const uiAreaHeight = $dataSystem.advanced.uiAreaHeight;
        const boxMargin = 4;
        Graphics.boxWidth = uiAreaWidth - boxMargin * 2;
        Graphics.boxHeight = uiAreaHeight - boxMargin * 2;
    }

    /** @returns {void} */
    adjustWindow() {
        if (Utils.isNwjs()) {
            const scale = this.screenScale();
            const xDelta = Graphics.width * scale - window.innerWidth;
            const yDelta = Graphics.height * scale - window.innerHeight;
            window.moveBy(-xDelta / 2, -yDelta / 2);
            window.resizeBy(xDelta, yDelta);
        }
    }

    /** @returns {number} */
    screenScale() {
        if ("screenScale" in $dataSystem.advanced) {
            return $dataSystem.advanced.screenScale;
        } else {
            return 1;
        }
    }

    /** @returns {void} */
    updateDocumentTitle() {
        document.title = $dataSystem.gameTitle;
    }

    /** @returns {void} */
    checkPlayerLocation() {
        if ($dataSystem.startMapId === 0) {
            throw new Error("Player's starting position is not set");
        }
    }
}

/**
 * The scene class of the splash screen.
 */
class Scene_Splash extends Scene_Base {
    constructor(...args) {
        super(...args);
    }

    /** @returns {void} */
    initialize() {
        super.initialize();
        this.initWaitCount();
    }

    /** @returns {void} */
    create() {
        super.create();
        if (this.isEnabled()) {
            this.createBackground();
        }
    }

    /** @returns {void} */
    start() {
        super.start();
        if (this.isEnabled()) {
            this.adjustBackground();
            this.startFadeIn(this.fadeSpeed(), false);
        }
    }

    /** @returns {void} */
    update() {
        super.update();
        if (this.isActive()) {
            if (!this.updateWaitCount()) {
                this.gotoTitle();
            }
            this.checkSkip();
        }
    }

    /** @returns {void} */
    stop() {
        super.stop();
        if (this.isEnabled()) {
            this.startFadeOut(this.fadeSpeed());
        }
    }

    /** @returns {void} */
    createBackground() {
        this._backSprite = new Sprite();
        this._backSprite.bitmap = ImageManager.loadSystem("Splash");
        this.addChild(this._backSprite);
    }

    /** @returns {void} */
    adjustBackground() {
        this.scaleSprite(this._backSprite);
        this.centerSprite(this._backSprite);
    }

    /** @returns {boolean} */
    isEnabled() {
        return $dataSystem.optSplashScreen;
    }

    /** @returns {void} */
    initWaitCount() {
        if (this.isEnabled()) {
            this._waitCount = 120;
        } else {
            this._waitCount = 0;
        }
    }

    /** @returns {boolean} */
    updateWaitCount() {
        if (this._waitCount > 0) {
            this._waitCount--;
            return true;
        }
        return false;
    }

    /** @returns {void} */
    checkSkip() {
        if (Input.isTriggered("ok") || TouchInput.isTriggered()) {
            this._waitCount = 0;
        }
    }

    /** @returns {void} */
    gotoTitle() {
        SceneManager.goto(Scene_Title);
    }
}

/**
 * The scene class of the title screen.
 */
class Scene_Title extends Scene_Base {
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
    }

    /** @returns {void} */
    create() {
        super.create();
        this.createBackground();
        this.createForeground();
        this.createWindowLayer();
        this.createCommandWindow();
    }

    /** @returns {void} */
    start() {
        super.start();
        SceneManager.clearStack();
        this.adjustBackground();
        this.playTitleMusic();
        this.startFadeIn(this.fadeSpeed(), false);
    }

    /** @returns {void} */
    update() {
        if (!this.isBusy()) {
            this._commandWindow.open();
        }
        super.update();
    }

    /** @returns {boolean} */
    isBusy() {
        return (
            this._commandWindow.isClosing() ||
            super.isBusy()
        );
    }

    /** @returns {void} */
    terminate() {
        super.terminate();
        SceneManager.snapForBackground();
        if (this._gameTitleSprite) {
            this._gameTitleSprite.bitmap.destroy();
        }
    }

    /** @returns {void} */
    createBackground() {
        this._backSprite1 = new Sprite(
            ImageManager.loadTitle1($dataSystem.title1Name)
        );
        this._backSprite2 = new Sprite(
            ImageManager.loadTitle2($dataSystem.title2Name)
        );
        this.addChild(this._backSprite1);
        this.addChild(this._backSprite2);
    }

    /** @returns {void} */
    createForeground() {
        this._gameTitleSprite = new Sprite(
            new Bitmap(Graphics.width, Graphics.height)
        );
        this.addChild(this._gameTitleSprite);
        if ($dataSystem.optDrawTitle) {
            this.drawGameTitle();
        }
    }

    /** @returns {void} */
    drawGameTitle() {
        const x = 20;
        const y = Graphics.height / 4;
        const maxWidth = Graphics.width - x * 2;
        const text = $dataSystem.gameTitle;
        const bitmap = this._gameTitleSprite.bitmap;
        bitmap.fontFace = $gameSystem.mainFontFace();
        bitmap.outlineColor = "black";
        bitmap.outlineWidth = 8;
        bitmap.fontSize = 72;
        bitmap.drawText(text, x, y, maxWidth, 48, "center");
    }

    /** @returns {void} */
    adjustBackground() {
        this.scaleSprite(this._backSprite1);
        this.scaleSprite(this._backSprite2);
        this.centerSprite(this._backSprite1);
        this.centerSprite(this._backSprite2);
    }

    /** @returns {void} */
    createCommandWindow() {
        const background = $dataSystem.titleCommandWindow.background;
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_TitleCommand(rect);
        this._commandWindow.setBackgroundType(background);
        this._commandWindow.setHandler("newGame", this.commandNewGame.bind(this));
        this._commandWindow.setHandler("continue", this.commandContinue.bind(this));
        this._commandWindow.setHandler("options", this.commandOptions.bind(this));
        this.addWindow(this._commandWindow);
    }

    /** @returns {Rectangle} */
    commandWindowRect() {
        const offsetX = $dataSystem.titleCommandWindow.offsetX;
        const offsetY = $dataSystem.titleCommandWindow.offsetY;
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(3, true);
        const wx = (Graphics.boxWidth - ww) / 2 + offsetX;
        const wy = Graphics.boxHeight - wh - 96 + offsetY;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    commandNewGame() {
        DataManager.setupNewGame();
        this._commandWindow.close();
        this.fadeOutAll();
        SceneManager.goto(Scene_Map);
    }

    /** @returns {void} */
    commandContinue() {
        this._commandWindow.close();
        SceneManager.push(Scene_Load);
    }

    /** @returns {void} */
    commandOptions() {
        this._commandWindow.close();
        SceneManager.push(Scene_Options);
    }

    /** @returns {void} */
    playTitleMusic() {
        AudioManager.playBgm($dataSystem.titleBgm);
        AudioManager.stopBgs();
        AudioManager.stopMe();
    }
}

/**
 * The superclass of Scene_Map and Scene_Battle.
 */
class Scene_Message extends Scene_Base {
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
    }

    /** @returns {boolean} */
    isMessageWindowClosing() {
        return this._messageWindow.isClosing();
    }

    /** @returns {void} */
    createAllWindows() {
        this.createMessageWindow();
        this.createScrollTextWindow();
        this.createGoldWindow();
        this.createNameBoxWindow();
        this.createChoiceListWindow();
        this.createNumberInputWindow();
        this.createEventItemWindow();
        this.associateWindows();
    }

    /** @returns {void} */
    createMessageWindow() {
        const rect = this.messageWindowRect();
        this._messageWindow = new Window_Message(rect);
        this.addWindow(this._messageWindow);
    }

    /** @returns {Rectangle} */
    messageWindowRect() {
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(4, false) + 8;
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = 0;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createScrollTextWindow() {
        const rect = this.scrollTextWindowRect();
        this._scrollTextWindow = new Window_ScrollText(rect);
        this.addWindow(this._scrollTextWindow);
    }

    /** @returns {Rectangle} */
    scrollTextWindowRect() {
        const wx = 0;
        const wy = 0;
        const ww = Graphics.boxWidth;
        const wh = Graphics.boxHeight;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createGoldWindow() {
        const rect = this.goldWindowRect();
        this._goldWindow = new Window_Gold(rect);
        this._goldWindow.openness = 0;
        this.addWindow(this._goldWindow);
    }

    /** @returns {Rectangle} */
    goldWindowRect() {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(1, true);
        const wx = Graphics.boxWidth - ww;
        const wy = 0;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createNameBoxWindow() {
        this._nameBoxWindow = new Window_NameBox();
        this.addWindow(this._nameBoxWindow);
    }

    /** @returns {void} */
    createChoiceListWindow() {
        this._choiceListWindow = new Window_ChoiceList();
        this.addWindow(this._choiceListWindow);
    }

    /** @returns {void} */
    createNumberInputWindow() {
        this._numberInputWindow = new Window_NumberInput();
        this.addWindow(this._numberInputWindow);
    }

    /** @returns {void} */
    createEventItemWindow() {
        const rect = this.eventItemWindowRect();
        this._eventItemWindow = new Window_EventItem(rect);
        this.addWindow(this._eventItemWindow);
    }

    /** @returns {Rectangle} */
    eventItemWindowRect() {
        const wx = 0;
        const wy = 0;
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(4, true);
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    associateWindows() {
        const messageWindow = this._messageWindow;
        messageWindow.setGoldWindow(this._goldWindow);
        messageWindow.setNameBoxWindow(this._nameBoxWindow);
        messageWindow.setChoiceListWindow(this._choiceListWindow);
        messageWindow.setNumberInputWindow(this._numberInputWindow);
        messageWindow.setEventItemWindow(this._eventItemWindow);
        this._nameBoxWindow.setMessageWindow(messageWindow);
        this._choiceListWindow.setMessageWindow(messageWindow);
        this._numberInputWindow.setMessageWindow(messageWindow);
        this._eventItemWindow.setMessageWindow(messageWindow);
    }

    /** @returns {void} */
    cancelMessageWait() {
        this._messageWindow.cancelWait();
    }
}

/**
 * The scene class of the map screen.
 */
class Scene_Map extends Scene_Message {
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
        /** @type {number} */
        this._waitCount = 0;
        /** @type {number} */
        this._encounterEffectDuration = 0;
        /** @type {boolean} */
        this._mapLoaded = false;
        /** @type {number} */
        this._touchCount = 0;
        /** @type {boolean} */
        this._menuEnabled = false;
    }

    /** @returns {void} */
    create() {
        super.create();
        this._transfer = $gamePlayer.isTransferring();
        this._lastMapWasNull = !$dataMap;
        if (this._transfer) {
            DataManager.loadMapData($gamePlayer.newMapId());
            this.onTransfer();
        } else {
            DataManager.loadMapData($gameMap.mapId());
        }
    }

    /** @returns {boolean} */
    isReady() {
        if (!this._mapLoaded && DataManager.isMapLoaded()) {
            this.onMapLoaded();
            this._mapLoaded = true;
        }
        return this._mapLoaded && super.isReady();
    }

    /** @returns {void} */
    onMapLoaded() {
        if (this._transfer) {
            $gamePlayer.performTransfer();
        }
        this.createDisplayObjects();
    }

    /** @returns {void} */
    onTransfer() {
        ImageManager.clear();
        EffectManager.clear();
    }

    /** @returns {void} */
    start() {
        super.start();
        SceneManager.clearStack();
        if (this._transfer) {
            this.fadeInForTransfer();
            this.onTransferEnd();
        } else if (this.needsFadeIn()) {
            this.startFadeIn(this.fadeSpeed(), false);
        }
        this.menuCalling = false;
    }

    /** @returns {void} */
    onTransferEnd() {
        this._mapNameWindow.open();
        $gameMap.autoplay();
        if (this.shouldAutosave()) {
            this.requestAutosave();
        }
    }

    /** @returns {boolean} */
    shouldAutosave() {
        return !this._lastMapWasNull;
    }

    /** @returns {void} */
    update() {
        super.update();
        this.updateDestination();
        this.updateMenuButton();
        this.updateMapNameWindow();
        this.updateMainMultiply();
        if (this.isSceneChangeOk()) {
            this.updateScene();
        } else if (SceneManager.isNextScene(Scene_Battle)) {
            this.updateEncounterEffect();
        }
        this.updateWaitCount();
    }

    /** @returns {void} */
    updateMainMultiply() {
        if (this.isFastForward()) {
            this.cancelMessageWait();
            this.updateMain();
        }
        this.updateMain();
    }

    /** @returns {void} */
    updateMain() {
        $gameMap.update(this.isActive());
        $gamePlayer.update(this.isPlayerActive());
        $gameTimer.update(this.isActive());
        $gameScreen.update();
    }

    /** @returns {boolean} */
    isPlayerActive() {
        return this.isActive() && !this.isFading();
    }

    /** @returns {boolean} */
    isFastForward() {
        return (
            $gameMap.isEventRunning() &&
            !SceneManager.isSceneChanging() &&
            (Input.isLongPressed("ok") || TouchInput.isLongPressed())
        );
    }

    /** @returns {void} */
    stop() {
        super.stop();
        $gamePlayer.straighten();
        this._mapNameWindow.close();
        if (this.needsSlowFadeOut()) {
            this.startFadeOut(this.slowFadeSpeed(), false);
        } else if (SceneManager.isNextScene(Scene_Map)) {
            this.fadeOutForTransfer();
        } else if (SceneManager.isNextScene(Scene_Battle)) {
            this.launchBattle();
        }
    }

    /** @returns {boolean} */
    isBusy() {
        return (
            this.isMessageWindowClosing() ||
            this._waitCount > 0 ||
            this._encounterEffectDuration > 0 ||
            super.isBusy()
        );
    }

    /** @returns {void} */
    terminate() {
        super.terminate();
        if (!SceneManager.isNextScene(Scene_Battle)) {
            this._spriteset.update();
            this._mapNameWindow.hide();
            this.hideMenuButton();
            SceneManager.snapForBackground();
        }
        $gameScreen.clearZoom();
    }

    /** @returns {boolean} */
    needsFadeIn() {
        return (
            SceneManager.isPreviousScene(Scene_Battle) ||
            SceneManager.isPreviousScene(Scene_Load)
        );
    }

    /** @returns {boolean | null} */
    needsSlowFadeOut() {
        return (
            SceneManager.isNextScene(Scene_Title) ||
            SceneManager.isNextScene(Scene_Gameover)
        );
    }

    /** @returns {boolean} */
    updateWaitCount() {
        if (this._waitCount > 0) {
            this._waitCount--;
            return true;
        }
        return false;
    }

    /** @returns {void} */
    updateDestination() {
        if (this.isMapTouchOk()) {
            this.processMapTouch();
        } else {
            $gameTemp.clearDestination();
            this._touchCount = 0;
        }
    }

    /** @returns {void} */
    updateMenuButton() {
        if (this._menuButton) {
            const menuEnabled = this.isMenuEnabled();
            if (menuEnabled === this._menuEnabled) {
                this._menuButton.visible = this._menuEnabled;
            } else {
                this._menuEnabled = menuEnabled;
            }
        }
    }

    /** @returns {void} */
    hideMenuButton() {
        if (this._menuButton) {
            this._menuButton.visible = false;
            this._menuEnabled = false;
        }
    }

    /** @returns {void} */
    updateMapNameWindow() {
        if ($gameMessage.isBusy()) {
            this._mapNameWindow.close();
        }
    }

    /** @returns {boolean} */
    isMenuEnabled() {
        return $gameSystem.isMenuEnabled() && !$gameMap.isEventRunning();
    }

    /** @returns {boolean} */
    isMapTouchOk() {
        return this.isActive() && $gamePlayer.canMove();
    }

    /** @returns {void} */
    processMapTouch() {
        if (TouchInput.isTriggered() || this._touchCount > 0) {
            if (TouchInput.isPressed() && !this.isAnyButtonPressed()) {
                if (this._touchCount === 0 || this._touchCount >= 15) {
                    this.onMapTouch();
                }
                this._touchCount++;
            } else {
                this._touchCount = 0;
            }
        }
    }

    /** @returns {boolean} */
    isAnyButtonPressed() {
        return this._menuButton && this._menuButton.isPressed();
    }

    /** @returns {void} */
    onMapTouch() {
        const x = $gameMap.canvasToMapX(TouchInput.x);
        const y = $gameMap.canvasToMapY(TouchInput.y);
        $gameTemp.setDestination(x, y);
    }

    /** @returns {boolean} */
    isSceneChangeOk() {
        return this.isActive() && !$gameMessage.isBusy();
    }

    /** @returns {void} */
    updateScene() {
        this.checkGameover();
        if (!SceneManager.isSceneChanging()) {
            this.updateTransferPlayer();
        }
        if (!SceneManager.isSceneChanging()) {
            this.updateEncounter();
        }
        if (!SceneManager.isSceneChanging()) {
            this.updateCallMenu();
        }
        if (!SceneManager.isSceneChanging()) {
            this.updateCallDebug();
        }
    }

    /** @returns {void} */
    createDisplayObjects() {
        this.createSpriteset();
        this.createWindowLayer();
        this.createAllWindows();
        this.createButtons();
    }

    /** @returns {void} */
    createSpriteset() {
        this._spriteset = new Spriteset_Map();
        this.addChild(this._spriteset);
        this._spriteset.update();
    }

    /** @returns {void} */
    createAllWindows() {
        this.createMapNameWindow();
        super.createAllWindows();
    }

    /** @returns {void} */
    createMapNameWindow() {
        const rect = this.mapNameWindowRect();
        this._mapNameWindow = new Window_MapName(rect);
        this.addWindow(this._mapNameWindow);
    }

    /** @returns {Rectangle} */
    mapNameWindowRect() {
        const wx = 0;
        const wy = 0;
        const ww = 360;
        const wh = this.calcWindowHeight(1, false);
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createButtons() {
        if (ConfigManager.touchUI) {
            this.createMenuButton();
        }
    }

    /** @returns {void} */
    createMenuButton() {
        this._menuButton = new Sprite_Button("menu");
        this._menuButton.x = Graphics.boxWidth - this._menuButton.width - 4;
        this._menuButton.y = this.buttonY();
        this._menuButton.visible = false;
        this.addWindow(this._menuButton);
    }

    /** @returns {void} */
    updateTransferPlayer() {
        if ($gamePlayer.isTransferring()) {
            SceneManager.goto(Scene_Map);
        }
    }

    /** @returns {void} */
    updateEncounter() {
        if ($gamePlayer.executeEncounter()) {
            SceneManager.push(Scene_Battle);
        }
    }

    /** @returns {void} */
    updateCallMenu() {
        if (this.isMenuEnabled()) {
            if (this.isMenuCalled()) {
                this.menuCalling = true;
            }
            if (this.menuCalling && !$gamePlayer.isMoving()) {
                this.callMenu();
            }
        } else {
            this.menuCalling = false;
        }
    }

    /** @returns {boolean} */
    isMenuCalled() {
        return Input.isTriggered("menu") || TouchInput.isCancelled();
    }

    /** @returns {void} */
    callMenu() {
        SoundManager.playOk();
        SceneManager.push(Scene_Menu);
        Window_MenuCommand.initCommandPosition();
        $gameTemp.clearDestination();
        this._mapNameWindow.hide();
        this._waitCount = 2;
    }

    /** @returns {void} */
    updateCallDebug() {
        if (this.isDebugCalled()) {
            SceneManager.push(Scene_Debug);
        }
    }

    /** @returns {boolean} */
    isDebugCalled() {
        return Input.isTriggered("debug") && $gameTemp.isPlaytest();
    }

    /** @returns {void} */
    fadeInForTransfer() {
        const fadeType = $gamePlayer.fadeType();
        switch (fadeType) {
            case 0:
            case 1:
                this.startFadeIn(this.fadeSpeed(), fadeType === 1);
                break;
        }
    }

    /** @returns {void} */
    fadeOutForTransfer() {
        const fadeType = $gamePlayer.fadeType();
        switch (fadeType) {
            case 0:
            case 1:
                this.startFadeOut(this.fadeSpeed(), fadeType === 1);
                break;
        }
    }

    /** @returns {void} */
    launchBattle() {
        BattleManager.saveBgmAndBgs();
        this.stopAudioOnBattleStart();
        SoundManager.playBattleStart();
        this.startEncounterEffect();
        this._mapNameWindow.hide();
    }

    /** @returns {void} */
    stopAudioOnBattleStart() {
        if (!AudioManager.isCurrentBgm($gameSystem.battleBgm())) {
            AudioManager.stopBgm();
        }
        AudioManager.stopBgs();
        AudioManager.stopMe();
        AudioManager.stopSe();
    }

    /** @returns {void} */
    startEncounterEffect() {
        this._spriteset.hideCharacters();
        this._encounterEffectDuration = this.encounterEffectSpeed();
    }

    /** @returns {void} */
    updateEncounterEffect() {
        if (this._encounterEffectDuration > 0) {
            this._encounterEffectDuration--;
            const speed = this.encounterEffectSpeed();
            const n = speed - this._encounterEffectDuration;
            const p = n / speed;
            const q = ((p - 1) * 20 * p + 5) * p + 1;
            const zoomX = $gamePlayer.screenX();
            const zoomY = $gamePlayer.screenY() - 24;
            if (n === 2) {
                $gameScreen.setZoom(zoomX, zoomY, 1);
                this.snapForBattleBackground();
                this.startFlashForEncounter(speed / 2);
            }
            $gameScreen.setZoom(zoomX, zoomY, q);
            if (n === Math.floor(speed / 6)) {
                this.startFlashForEncounter(speed / 2);
            }
            if (n === Math.floor(speed / 2)) {
                BattleManager.playBattleBgm();
                this.startFadeOut(this.fadeSpeed());
            }
        }
    }

    /** @returns {void} */
    snapForBattleBackground() {
        this._windowLayer.visible = false;
        SceneManager.snapForBackground();
        this._windowLayer.visible = true;
    }

    /**
     * @param {number} duration
     * @returns {void}
     */
    startFlashForEncounter(duration) {
        const color = [255, 255, 255, 255];
        $gameScreen.startFlash(color, duration);
    }

    /** @returns {number} */
    encounterEffectSpeed() {
        return 60;
    }
}

/**
 * The superclass of all the menu-type scenes.
 */
class Scene_MenuBase extends Scene_Base {
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
    }

    /** @returns {void} */
    create() {
        super.create();
        this.createBackground();
        this.updateActor();
        this.createWindowLayer();
        this.createButtons();
    }

    /** @returns {void} */
    update() {
        super.update();
        this.updatePageButtons();
    }

    /** @returns {number} */
    helpAreaTop() {
        if (this.isBottomHelpMode()) {
            return this.mainAreaBottom();
        } else if (this.isBottomButtonMode()) {
            return 0;
        } else {
            return this.buttonAreaBottom();
        }
    }

    /** @returns {number} */
    helpAreaBottom() {
        return this.helpAreaTop() + this.helpAreaHeight();
    }

    /** @returns {number} */
    helpAreaHeight() {
        return this.calcWindowHeight(2, false);
    }

    /** @returns {number} */
    mainAreaTop() {
        if (!this.isBottomHelpMode()) {
            return this.helpAreaBottom();
        } else if (this.isBottomButtonMode()) {
            return 0;
        } else {
            return this.buttonAreaBottom();
        }
    }

    /** @returns {number} */
    mainAreaBottom() {
        return this.mainAreaTop() + this.mainAreaHeight();
    }

    /** @returns {number} */
    mainAreaHeight() {
        return Graphics.boxHeight - this.buttonAreaHeight() - this.helpAreaHeight();
    }

    /** @returns {Game_Actor} */
    actor() {
        return this._actor;
    }

    /** @returns {void} */
    updateActor() {
        this._actor = $gameParty.menuActor();
    }

    /** @returns {void} */
    createBackground() {
        this._backgroundFilter = new PIXI.BlurFilter();
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        this._backgroundSprite.filters = [this._backgroundFilter];
        this.addChild(this._backgroundSprite);
        this.setBackgroundOpacity(192);
    }

    /**
     * @param {number} opacity
     * @returns {void}
     */
    setBackgroundOpacity(opacity) {
        this._backgroundSprite.opacity = opacity;
    }

    /** @returns {void} */
    createHelpWindow() {
        const rect = this.helpWindowRect();
        this._helpWindow = new Window_Help(rect);
        this.addWindow(this._helpWindow);
    }

    /** @returns {Rectangle} */
    helpWindowRect() {
        const wx = 0;
        const wy = this.helpAreaTop();
        const ww = Graphics.boxWidth;
        const wh = this.helpAreaHeight();
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createButtons() {
        if (ConfigManager.touchUI) {
            if (this.needsCancelButton()) {
                this.createCancelButton();
            }
            if (this.needsPageButtons()) {
                this.createPageButtons();
            }
        }
    }

    /** @returns {boolean} */
    needsCancelButton() {
        return true;
    }

    /** @returns {void} */
    createCancelButton() {
        this._cancelButton = new Sprite_Button("cancel");
        this._cancelButton.x = Graphics.boxWidth - this._cancelButton.width - 4;
        this._cancelButton.y = this.buttonY();
        this.addWindow(this._cancelButton);
    }

    /** @returns {boolean} */
    needsPageButtons() {
        return false;
    }

    /** @returns {void} */
    createPageButtons() {
        this._pageupButton = new Sprite_Button("pageup");
        this._pageupButton.x = 4;
        this._pageupButton.y = this.buttonY();
        const pageupRight = this._pageupButton.x + this._pageupButton.width;
        this._pagedownButton = new Sprite_Button("pagedown");
        this._pagedownButton.x = pageupRight + 4;
        this._pagedownButton.y = this.buttonY();
        this.addWindow(this._pageupButton);
        this.addWindow(this._pagedownButton);
        this._pageupButton.setClickHandler(this.previousActor.bind(this));
        this._pagedownButton.setClickHandler(this.nextActor.bind(this));
    }

    /** @returns {void} */
    updatePageButtons() {
        if (this._pageupButton && this._pagedownButton) {
            const enabled = this.arePageButtonsEnabled();
            this._pageupButton.visible = enabled;
            this._pagedownButton.visible = enabled;
        }
    }

    /** @returns {boolean} */
    arePageButtonsEnabled() {
        return true;
    }

    /** @returns {void} */
    nextActor() {
        $gameParty.makeMenuActorNext();
        this.updateActor();
        this.onActorChange();
    }

    /** @returns {void} */
    previousActor() {
        $gameParty.makeMenuActorPrevious();
        this.updateActor();
        this.onActorChange();
    }

    /** @returns {void} */
    onActorChange() {
        SoundManager.playCursor();
    }
}

/**
 * The scene class of the menu screen.
 */
class Scene_Menu extends Scene_MenuBase {
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
    }

    /** @returns {number} */
    helpAreaHeight() {
        return 0;
    }

    /** @returns {void} */
    create() {
        super.create();
        this.createCommandWindow();
        this.createGoldWindow();
        this.createStatusWindow();
    }

    /** @returns {void} */
    start() {
        super.start();
        this._statusWindow.refresh();
    }

    /** @returns {void} */
    createCommandWindow() {
        const rect = this.commandWindowRect();
        const commandWindow = new Window_MenuCommand(rect);
        commandWindow.setHandler("item", this.commandItem.bind(this));
        commandWindow.setHandler("skill", this.commandPersonal.bind(this));
        commandWindow.setHandler("equip", this.commandPersonal.bind(this));
        commandWindow.setHandler("status", this.commandPersonal.bind(this));
        commandWindow.setHandler("formation", this.commandFormation.bind(this));
        commandWindow.setHandler("options", this.commandOptions.bind(this));
        commandWindow.setHandler("save", this.commandSave.bind(this));
        commandWindow.setHandler("gameEnd", this.commandGameEnd.bind(this));
        commandWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(commandWindow);
        this._commandWindow = commandWindow;
    }

    /** @returns {Rectangle} */
    commandWindowRect() {
        const ww = this.mainCommandWidth();
        const wh = this.mainAreaHeight() - this.goldWindowRect().height;
        const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
        const wy = this.mainAreaTop();
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createGoldWindow() {
        const rect = this.goldWindowRect();
        this._goldWindow = new Window_Gold(rect);
        this.addWindow(this._goldWindow);
    }

    /** @returns {Rectangle} */
    goldWindowRect() {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(1, true);
        const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
        const wy = this.mainAreaBottom() - wh;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createStatusWindow() {
        const rect = this.statusWindowRect();
        this._statusWindow = new Window_MenuStatus(rect);
        this.addWindow(this._statusWindow);
    }

    /** @returns {Rectangle} */
    statusWindowRect() {
        const ww = Graphics.boxWidth - this.mainCommandWidth();
        const wh = this.mainAreaHeight();
        const wx = this.isRightInputMode() ? 0 : Graphics.boxWidth - ww;
        const wy = this.mainAreaTop();
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    commandItem() {
        SceneManager.push(Scene_Item);
    }

    /** @returns {void} */
    commandPersonal() {
        this._statusWindow.setFormationMode(false);
        this._statusWindow.selectLast();
        this._statusWindow.activate();
        this._statusWindow.setHandler("ok", this.onPersonalOk.bind(this));
        this._statusWindow.setHandler("cancel", this.onPersonalCancel.bind(this));
    }

    /** @returns {void} */
    commandFormation() {
        this._statusWindow.setFormationMode(true);
        this._statusWindow.selectLast();
        this._statusWindow.activate();
        this._statusWindow.setHandler("ok", this.onFormationOk.bind(this));
        this._statusWindow.setHandler("cancel", this.onFormationCancel.bind(this));
    }

    /** @returns {void} */
    commandOptions() {
        SceneManager.push(Scene_Options);
    }

    /** @returns {void} */
    commandSave() {
        SceneManager.push(Scene_Save);
    }

    /** @returns {void} */
    commandGameEnd() {
        SceneManager.push(Scene_GameEnd);
    }

    /** @returns {void} */
    onPersonalOk() {
        switch (this._commandWindow.currentSymbol()) {
            case "skill":
                SceneManager.push(Scene_Skill);
                break;
            case "equip":
                SceneManager.push(Scene_Equip);
                break;
            case "status":
                SceneManager.push(Scene_Status);
                break;
        }
    }

    /** @returns {void} */
    onPersonalCancel() {
        this._statusWindow.deselect();
        this._commandWindow.activate();
    }

    /** @returns {void} */
    onFormationOk() {
        const index = this._statusWindow.index();
        const pendingIndex = this._statusWindow.pendingIndex();
        if (pendingIndex >= 0) {
            $gameParty.swapOrder(index, pendingIndex);
            this._statusWindow.setPendingIndex(-1);
            this._statusWindow.redrawItem(index);
        } else {
            this._statusWindow.setPendingIndex(index);
        }
        this._statusWindow.activate();
    }

    /** @returns {void} */
    onFormationCancel() {
        if (this._statusWindow.pendingIndex() >= 0) {
            this._statusWindow.setPendingIndex(-1);
            this._statusWindow.activate();
        } else {
            this._statusWindow.deselect();
            this._commandWindow.activate();
        }
    }
}

/**
 * The superclass of Scene_Item and Scene_Skill.
 */
class Scene_ItemBase extends Scene_MenuBase {
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
    }

    /** @returns {void} */
    create() {
        super.create();
    }

    /** @returns {void} */
    createActorWindow() {
        const rect = this.actorWindowRect();
        this._actorWindow = new Window_MenuActor(rect);
        this._actorWindow.setHandler("ok", this.onActorOk.bind(this));
        this._actorWindow.setHandler("cancel", this.onActorCancel.bind(this));
        this.addWindow(this._actorWindow);
    }

    /** @returns {Rectangle} */
    actorWindowRect() {
        const wx = 0;
        const wy = Math.min(this.mainAreaTop(), this.helpAreaTop());
        const ww = Graphics.boxWidth - this.mainCommandWidth();
        const wh = this.mainAreaHeight() + this.helpAreaHeight();
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {RMMZ.ActionItem | null} */
    item() {
        return this._itemWindow.item();
    }

    /** @returns {Game_Actor | null | undefined} */
    user() {
        return null;
    }

    /** @returns {boolean} */
    isCursorLeft() {
        return this._itemWindow.index() % 2 === 0;
    }

    /** @returns {void} */
    showActorWindow() {
        if (this.isCursorLeft()) {
            this._actorWindow.x = Graphics.boxWidth - this._actorWindow.width;
        } else {
            this._actorWindow.x = 0;
        }
        this._actorWindow.show();
        this._actorWindow.activate();
    }

    /** @returns {void} */
    hideActorWindow() {
        this._actorWindow.hide();
        this._actorWindow.deactivate();
    }

    /** @returns {boolean} */
    isActorWindowActive() {
        return this._actorWindow && this._actorWindow.active;
    }

    /** @returns {void} */
    onActorOk() {
        if (this.canUse()) {
            this.useItem();
        } else {
            SoundManager.playBuzzer();
        }
    }

    /** @returns {void} */
    onActorCancel() {
        this.hideActorWindow();
        this.activateItemWindow();
    }

    /** @returns {void} */
    determineItem() {
        const action = new Game_Action(this.user());
        const item = this.item();
        action.setItemObject(item);
        if (action.isForFriend()) {
            this.showActorWindow();
            this._actorWindow.selectForItem(this.item());
        } else {
            this.useItem();
            this.activateItemWindow();
        }
    }

    /** @returns {void} */
    useItem() {
        this.playSeForItem();
        this.user().useItem(this.item());
        this.applyItem();
        this.checkCommonEvent();
        this.checkGameover();
        this._actorWindow.refresh();
    }

    /** @returns {void} */
    activateItemWindow() {
        this._itemWindow.refresh();
        this._itemWindow.activate();
    }

    /** @returns {Game_Actor[]} */
    itemTargetActors() {
        const action = new Game_Action(this.user());
        action.setItemObject(this.item());
        if (!action.isForFriend()) {
            return [];
        } else if (action.isForAll()) {
            return $gameParty.members();
        } else {
            return [$gameParty.members()[this._actorWindow.index()]];
        }
    }

    /** @returns {boolean | null | undefined} */
    canUse() {
        const user = this.user();
        return user && user.canUse(this.item()) && this.isItemEffectsValid();
    }

    /** @returns {boolean} */
    isItemEffectsValid() {
        const action = new Game_Action(this.user());
        action.setItemObject(this.item());
        return this.itemTargetActors().some(target => action.testApply(target));
    }

    /** @returns {void} */
    applyItem() {
        const action = new Game_Action(this.user());
        action.setItemObject(this.item());
        for (const target of this.itemTargetActors()) {
            for (let i = 0; i < action.numRepeats(); i++) {
                action.apply(target);
            }
        }
        action.applyGlobal();
    }

    /** @returns {void} */
    checkCommonEvent() {
        if ($gameTemp.isCommonEventReserved()) {
            SceneManager.goto(Scene_Map);
        }
    }
}

/**
 * The scene class of the item screen.
 */
class Scene_Item extends Scene_ItemBase {
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
    }

    /** @returns {void} */
    create() {
        super.create();
        this.createHelpWindow();
        this.createCategoryWindow();
        this.createItemWindow();
        this.createActorWindow();
    }

    /** @returns {void} */
    createCategoryWindow() {
        const rect = this.categoryWindowRect();
        this._categoryWindow = new Window_ItemCategory(rect);
        this._categoryWindow.setHelpWindow(this._helpWindow);
        this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
        this._categoryWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._categoryWindow);
    }

    /** @returns {Rectangle} */
    categoryWindowRect() {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(1, true);
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createItemWindow() {
        const rect = this.itemWindowRect();
        this._itemWindow = new Window_ItemList(rect);
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
        this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
        this.addWindow(this._itemWindow);
        this._categoryWindow.setItemWindow(this._itemWindow);
        if (!this._categoryWindow.needsSelection()) {
            this._itemWindow.y -= this._categoryWindow.height;
            this._itemWindow.height += this._categoryWindow.height;
            this._itemWindow.createContents();
            this._categoryWindow.update();
            this._categoryWindow.hide();
            this._categoryWindow.deactivate();
            this.onCategoryOk();
        }
    }

    /** @returns {Rectangle} */
    itemWindowRect() {
        const wx = 0;
        const wy = this._categoryWindow.y + this._categoryWindow.height;
        const ww = Graphics.boxWidth;
        const wh = this.mainAreaBottom() - wy;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {import("..").Game_Actor | undefined} */
    user() {
        const members = $gameParty.movableMembers();
        const bestPha = Math.max(...members.map(member => member.pha));
        return members.find(member => member.pha === bestPha);
    }

    /** @returns {void} */
    onCategoryOk() {
        this._itemWindow.activate();
        this._itemWindow.selectLast();
    }

    /** @returns {void} */
    onItemOk() {
        $gameParty.setLastItem(this.item());
        this.determineItem();
    }

    /** @returns {void} */
    onItemCancel() {
        if (this._categoryWindow.needsSelection()) {
            this._itemWindow.deselect();
            this._categoryWindow.activate();
        } else {
            this.popScene();
        }
    }

    /** @returns {void} */
    playSeForItem() {
        SoundManager.playUseItem();
    }

    /** @returns {void} */
    useItem() {
        super.useItem();
        this._itemWindow.redrawCurrentItem();
    }
}

/**
 * The scene class of the skill screen.
 */
class Scene_Skill extends Scene_ItemBase {
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
    }

    /** @returns {void} */
    create() {
        super.create();
        this.createHelpWindow();
        this.createSkillTypeWindow();
        this.createStatusWindow();
        this.createItemWindow();
        this.createActorWindow();
    }

    /** @returns {void} */
    start() {
        super.start();
        this.refreshActor();
    }

    /** @returns {void} */
    createSkillTypeWindow() {
        const rect = this.skillTypeWindowRect();
        this._skillTypeWindow = new Window_SkillType(rect);
        this._skillTypeWindow.setHelpWindow(this._helpWindow);
        this._skillTypeWindow.setHandler("skill", this.commandSkill.bind(this));
        this._skillTypeWindow.setHandler("cancel", this.popScene.bind(this));
        this._skillTypeWindow.setHandler("pagedown", this.nextActor.bind(this));
        this._skillTypeWindow.setHandler("pageup", this.previousActor.bind(this));
        this.addWindow(this._skillTypeWindow);
    }

    /** @returns {Rectangle} */
    skillTypeWindowRect() {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(3, true);
        const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
        const wy = this.mainAreaTop();
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createStatusWindow() {
        const rect = this.statusWindowRect();
        this._statusWindow = new Window_SkillStatus(rect);
        this.addWindow(this._statusWindow);
    }

    /** @returns {Rectangle} */
    statusWindowRect() {
        const ww = Graphics.boxWidth - this.mainCommandWidth();
        const wh = this._skillTypeWindow.height;
        const wx = this.isRightInputMode() ? 0 : Graphics.boxWidth - ww;
        const wy = this.mainAreaTop();
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createItemWindow() {
        const rect = this.itemWindowRect();
        this._itemWindow = new Window_SkillList(rect);
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
        this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
        this._skillTypeWindow.setSkillWindow(this._itemWindow);
        this.addWindow(this._itemWindow);
    }

    /** @returns {Rectangle} */
    itemWindowRect() {
        const wx = 0;
        const wy = this._statusWindow.y + this._statusWindow.height;
        const ww = Graphics.boxWidth;
        const wh = this.mainAreaHeight() - this._statusWindow.height;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {boolean} */
    needsPageButtons() {
        return true;
    }

    /** @returns {boolean} */
    arePageButtonsEnabled() {
        return !this.isActorWindowActive();
    }

    /** @returns {void} */
    refreshActor() {
        const actor = this.actor();
        this._skillTypeWindow.setActor(actor);
        this._statusWindow.setActor(actor);
        this._itemWindow.setActor(actor);
    }

    /** @returns {import("..").Game_Actor} */
    user() {
        return this.actor();
    }

    /** @returns {void} */
    commandSkill() {
        this._itemWindow.activate();
        this._itemWindow.selectLast();
    }

    /** @returns {void} */
    onItemOk() {
        this.actor().setLastMenuSkill(this.item());
        this.determineItem();
    }

    /** @returns {void} */
    onItemCancel() {
        this._itemWindow.deselect();
        this._skillTypeWindow.activate();
    }

    /** @returns {void} */
    playSeForItem() {
        SoundManager.playUseSkill();
    }

    /** @returns {void} */
    useItem() {
        super.useItem();
        this._statusWindow.refresh();
        this._itemWindow.refresh();
    }

    /** @returns {void} */
    onActorChange() {
        super.onActorChange();
        this.refreshActor();
        this._itemWindow.deselect();
        this._skillTypeWindow.activate();
    }
}

/**
 * The scene class of the equipment screen.
 */
class Scene_Equip extends Scene_MenuBase {
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
    }

    /** @returns {void} */
    create() {
        super.create();
        this.createHelpWindow();
        this.createStatusWindow();
        this.createCommandWindow();
        this.createSlotWindow();
        this.createItemWindow();
        this.refreshActor();
    }

    /** @returns {void} */
    createStatusWindow() {
        const rect = this.statusWindowRect();
        this._statusWindow = new Window_EquipStatus(rect);
        this.addWindow(this._statusWindow);
    }

    /** @returns {Rectangle} */
    statusWindowRect() {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = this.statusWidth();
        const wh = this.mainAreaHeight();
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createCommandWindow() {
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_EquipCommand(rect);
        this._commandWindow.setHelpWindow(this._helpWindow);
        this._commandWindow.setHandler("equip", this.commandEquip.bind(this));
        this._commandWindow.setHandler("optimize", this.commandOptimize.bind(this));
        this._commandWindow.setHandler("clear", this.commandClear.bind(this));
        this._commandWindow.setHandler("cancel", this.popScene.bind(this));
        this._commandWindow.setHandler("pagedown", this.nextActor.bind(this));
        this._commandWindow.setHandler("pageup", this.previousActor.bind(this));
        this.addWindow(this._commandWindow);
    }

    /** @returns {Rectangle} */
    commandWindowRect() {
        const wx = this.statusWidth();
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth - this.statusWidth();
        const wh = this.calcWindowHeight(1, true);
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createSlotWindow() {
        const rect = this.slotWindowRect();
        this._slotWindow = new Window_EquipSlot(rect);
        this._slotWindow.setHelpWindow(this._helpWindow);
        this._slotWindow.setStatusWindow(this._statusWindow);
        this._slotWindow.setHandler("ok", this.onSlotOk.bind(this));
        this._slotWindow.setHandler("cancel", this.onSlotCancel.bind(this));
        this.addWindow(this._slotWindow);
    }

    /** @returns {Rectangle} */
    slotWindowRect() {
        const commandWindowRect = this.commandWindowRect();
        const wx = this.statusWidth();
        const wy = commandWindowRect.y + commandWindowRect.height;
        const ww = Graphics.boxWidth - this.statusWidth();
        const wh = this.mainAreaHeight() - commandWindowRect.height;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createItemWindow() {
        const rect = this.itemWindowRect();
        this._itemWindow = new Window_EquipItem(rect);
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setStatusWindow(this._statusWindow);
        this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
        this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
        this._itemWindow.hide();
        this._slotWindow.setItemWindow(this._itemWindow);
        this.addWindow(this._itemWindow);
    }

    /** @returns {Rectangle} */
    itemWindowRect() {
        return this.slotWindowRect();
    }

    /** @returns {number} */
    statusWidth() {
        return 312;
    }

    /** @returns {boolean} */
    needsPageButtons() {
        return true;
    }

    /** @returns {boolean} */
    arePageButtonsEnabled() {
        return !(this._itemWindow && this._itemWindow.active);
    }

    /** @returns {void} */
    refreshActor() {
        const actor = this.actor();
        this._statusWindow.setActor(actor);
        this._slotWindow.setActor(actor);
        this._itemWindow.setActor(actor);
    }

    /** @returns {void} */
    commandEquip() {
        this._slotWindow.activate();
        this._slotWindow.select(0);
    }

    /** @returns {void} */
    commandOptimize() {
        SoundManager.playEquip();
        this.actor().optimizeEquipments();
        this._statusWindow.refresh();
        this._slotWindow.refresh();
        this._commandWindow.activate();
    }

    /** @returns {void} */
    commandClear() {
        SoundManager.playEquip();
        this.actor().clearEquipments();
        this._statusWindow.refresh();
        this._slotWindow.refresh();
        this._commandWindow.activate();
    }

    /** @returns {void} */
    onSlotOk() {
        this._slotWindow.hide();
        this._itemWindow.show();
        this._itemWindow.activate();
        this._itemWindow.forceSelect(0);
    }

    /** @returns {void} */
    onSlotCancel() {
        this._slotWindow.deselect();
        this._commandWindow.activate();
    }

    /** @returns {void} */
    onItemOk() {
        SoundManager.playEquip();
        this.executeEquipChange();
        this.hideItemWindow();
        this._slotWindow.refresh();
        this._itemWindow.refresh();
        this._statusWindow.refresh();
    }

    /** @returns {void} */
    executeEquipChange() {
        const actor = this.actor();
        const slotId = this._slotWindow.index();
        const item = this._itemWindow.item();
        actor.changeEquip(slotId, item);
    }

    /** @returns {void} */
    onItemCancel() {
        this.hideItemWindow();
    }

    /** @returns {void} */
    onActorChange() {
        super.onActorChange();
        this.refreshActor();
        this.hideItemWindow();
        this._slotWindow.deselect();
        this._slotWindow.deactivate();
        this._commandWindow.activate();
    }

    /** @returns {void} */
    hideItemWindow() {
        this._slotWindow.show();
        this._slotWindow.activate();
        this._itemWindow.hide();
        this._itemWindow.deselect();
    }
}

/**
 * The scene class of the status screen.
 */
class Scene_Status extends Scene_MenuBase {
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
    }

    /** @returns {void} */
    create() {
        super.create();
        this.createProfileWindow();
        this.createStatusWindow();
        this.createStatusParamsWindow();
        this.createStatusEquipWindow();
    }

    /** @returns {number} */
    helpAreaHeight() {
        return 0;
    }

    /** @returns {void} */
    createProfileWindow() {
        const rect = this.profileWindowRect();
        this._profileWindow = new Window_Help(rect);
        this.addWindow(this._profileWindow);
    }

    /** @returns {Rectangle} */
    profileWindowRect() {
        const ww = Graphics.boxWidth;
        const wh = this.profileHeight();
        const wx = 0;
        const wy = this.mainAreaBottom() - wh;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createStatusWindow() {
        const rect = this.statusWindowRect();
        this._statusWindow = new Window_Status(rect);
        this._statusWindow.setHandler("cancel", this.popScene.bind(this));
        this._statusWindow.setHandler("pagedown", this.nextActor.bind(this));
        this._statusWindow.setHandler("pageup", this.previousActor.bind(this));
        this.addWindow(this._statusWindow);
    }

    /** @returns {Rectangle} */
    statusWindowRect() {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth;
        const wh = this.statusParamsWindowRect().y - wy;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createStatusParamsWindow() {
        const rect = this.statusParamsWindowRect();
        this._statusParamsWindow = new Window_StatusParams(rect);
        this.addWindow(this._statusParamsWindow);
    }

    /** @returns {Rectangle} */
    statusParamsWindowRect() {
        const ww = this.statusParamsWidth();
        const wh = this.statusParamsHeight();
        const wx = 0;
        const wy = this.mainAreaBottom() - this.profileHeight() - wh;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createStatusEquipWindow() {
        const rect = this.statusEquipWindowRect();
        this._statusEquipWindow = new Window_StatusEquip(rect);
        this.addWindow(this._statusEquipWindow);
    }

    /** @returns {Rectangle} */
    statusEquipWindowRect() {
        const ww = Graphics.boxWidth - this.statusParamsWidth();
        const wh = this.statusParamsHeight();
        const wx = this.statusParamsWidth();
        const wy = this.mainAreaBottom() - this.profileHeight() - wh;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {number} */
    statusParamsWidth() {
        return 300;
    }

    /** @returns {number} */
    statusParamsHeight() {
        return this.calcWindowHeight(6, false);
    }

    /** @returns {number} */
    profileHeight() {
        return this.calcWindowHeight(2, false);
    }

    /** @returns {void} */
    start() {
        super.start();
        this.refreshActor();
    }

    /** @returns {boolean} */
    needsPageButtons() {
        return true;
    }

    /** @returns {void} */
    refreshActor() {
        const actor = this.actor();
        this._profileWindow.setText(actor.profile());
        this._statusWindow.setActor(actor);
        this._statusParamsWindow.setActor(actor);
        this._statusEquipWindow.setActor(actor);
    }

    /** @returns {void} */
    onActorChange() {
        super.onActorChange();
        this.refreshActor();
        this._statusWindow.activate();
    }
}

/**
 * The scene class of the options screen.
 */
class Scene_Options extends Scene_MenuBase {
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
    }

    /** @returns {void} */
    create() {
        super.create();
        this.createOptionsWindow();
    }

    /** @returns {void} */
    terminate() {
        super.terminate();
        ConfigManager.save();
    }

    /** @returns {void} */
    createOptionsWindow() {
        const rect = this.optionsWindowRect();
        this._optionsWindow = new Window_Options(rect);
        this._optionsWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._optionsWindow);
    }

    /** @returns {Rectangle} */
    optionsWindowRect() {
        const n = Math.min(this.maxCommands(), this.maxVisibleCommands());
        const ww = 400;
        const wh = this.calcWindowHeight(n, true);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh) / 2;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {number} */
    maxCommands() {
        // Increase this value when adding option items.
        return 7;
    }

    /** @returns {number} */
    maxVisibleCommands() {
        return 12;
    }
}

/**
 * The superclass of Scene_Save and Scene_Load.
 */
class Scene_File extends Scene_MenuBase {
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
    }

    /** @returns {void} */
    create() {
        super.create();
        DataManager.loadAllSavefileImages();
        this.createHelpWindow();
        this.createListWindow();
        this._helpWindow.setText(this.helpWindowText());
    }

    /** @returns {number} */
    helpAreaHeight() {
        return 0;
    }

    /** @returns {void} */
    start() {
        super.start();
        this._listWindow.refresh();
    }

    /** @returns {number} */
    savefileId() {
        return this._listWindow.savefileId();
    }

    /**
     * @param {number} savefileId
     * @returns {boolean}
     */
    isSavefileEnabled(savefileId) {
        return this._listWindow.isEnabled(savefileId);
    }

    /** @returns {void} */
    createHelpWindow() {
        const rect = this.helpWindowRect();
        this._helpWindow = new Window_Help(rect);
        this.addWindow(this._helpWindow);
    }

    /** @returns {Rectangle} */
    helpWindowRect() {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(1, false);
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createListWindow() {
        const rect = this.listWindowRect();
        this._listWindow = new Window_SavefileList(rect);
        this._listWindow.setHandler("ok", this.onSavefileOk.bind(this));
        this._listWindow.setHandler("cancel", this.popScene.bind(this));
        this._listWindow.setMode(this.mode(), this.needsAutosave());
        this._listWindow.selectSavefile(this.firstSavefileId());
        this._listWindow.refresh();
        this.addWindow(this._listWindow);
    }

    /** @returns {Rectangle} */
    listWindowRect() {
        const wx = 0;
        const wy = this.mainAreaTop() + this._helpWindow.height;
        const ww = Graphics.boxWidth;
        const wh = this.mainAreaHeight() - this._helpWindow.height;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {"save" | "load"} */
    mode() {
        return null;
    }

    /** @returns {boolean} */
    needsAutosave() {
        return $gameSystem.isAutosaveEnabled();
    }

    /** @returns {void} */
    activateListWindow() {
        this._listWindow.activate();
    }

    /** @returns {string} */
    helpWindowText() {
        return "";
    }

    /** @returns {number} */
    firstSavefileId() {
        return 0;
    }

    /** @returns {void} */
    onSavefileOk() {
        //
    }
}

/**
 * The scene class of the save screen.
 */
class Scene_Save extends Scene_File {
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
    }

    /** @returns {"save"} */
    mode() {
        return "save";
    }

    /** @returns {string} */
    helpWindowText() {
        return TextManager.saveMessage;
    }

    /** @returns {number} */
    firstSavefileId() {
        return $gameSystem.savefileId();
    }

    /** @returns {void} */
    onSavefileOk() {
        super.onSavefileOk();
        const savefileId = this.savefileId();
        if (this.isSavefileEnabled(savefileId)) {
            this.executeSave(savefileId);
        } else {
            this.onSaveFailure();
        }
    }

    /**
     * @param {number} savefileId
     * @returns {void}
     */
    executeSave(savefileId) {
        $gameSystem.setSavefileId(savefileId);
        $gameSystem.onBeforeSave();
        DataManager.saveGame(savefileId)
            .then(() => this.onSaveSuccess())
            .catch(() => this.onSaveFailure());
    }

    /** @returns {void} */
    onSaveSuccess() {
        SoundManager.playSave();
        this.popScene();
    }

    /** @returns {void} */
    onSaveFailure() {
        SoundManager.playBuzzer();
        this.activateListWindow();
    }
}

/**
 * The scene class of the load screen.
 */
class Scene_Load extends Scene_File {
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
        /** @type {boolean} */
        this._loadSuccess = false;
    }

    /** @returns {void} */
    terminate() {
        super.terminate();
        if (this._loadSuccess) {
            $gameSystem.onAfterLoad();
        }
    }

    /** @returns {"load"} */
    mode() {
        return "load";
    }

    /** @returns {string} */
    helpWindowText() {
        return TextManager.loadMessage;
    }

    /** @returns {number} */
    firstSavefileId() {
        return DataManager.latestSavefileId();
    }

    /** @returns {void} */
    onSavefileOk() {
        super.onSavefileOk();
        const savefileId = this.savefileId();
        if (this.isSavefileEnabled(savefileId)) {
            this.executeLoad(savefileId);
        } else {
            this.onLoadFailure();
        }
    }

    /**
     * @param {number} savefileId
     * @returns {void}
     */
    executeLoad(savefileId) {
        DataManager.loadGame(savefileId)
            .then(() => this.onLoadSuccess())
            .catch(() => this.onLoadFailure());
    }

    /** @returns {void} */
    onLoadSuccess() {
        SoundManager.playLoad();
        this.fadeOutAll();
        this.reloadMapIfUpdated();
        SceneManager.goto(Scene_Map);
        this._loadSuccess = true;
    }

    /** @returns {void} */
    onLoadFailure() {
        SoundManager.playBuzzer();
        this.activateListWindow();
    }

    /** @returns {void} */
    reloadMapIfUpdated() {
        if ($gameSystem.versionId() !== $dataSystem.versionId) {
            const mapId = $gameMap.mapId();
            const x = $gamePlayer.x;
            const y = $gamePlayer.y;
            const d = $gamePlayer.direction();
            $gamePlayer.reserveTransfer(mapId, x, y, d, 0);
            $gamePlayer.requestMapReload();
        }
    }
}

/**
 * The scene class of the game end screen.
 */
class Scene_GameEnd extends Scene_MenuBase {
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
    }

    /** @returns {void} */
    create() {
        super.create();
        this.createCommandWindow();
    }

    /** @returns {void} */
    stop() {
        super.stop();
        this._commandWindow.close();
    }

    /** @returns {void} */
    createBackground() {
        super.createBackground();
        this.setBackgroundOpacity(128);
    }

    /** @returns {void} */
    createCommandWindow() {
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_GameEnd(rect);
        this._commandWindow.setHandler("toTitle", this.commandToTitle.bind(this));
        this._commandWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._commandWindow);
    }

    /** @returns {Rectangle} */
    commandWindowRect() {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(2, true);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh) / 2;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    commandToTitle() {
        this.fadeOutAll();
        SceneManager.goto(Scene_Title);
        Window_TitleCommand.initCommandPosition();
    }
}

/**
 * The scene class of the shop screen.
 */
class Scene_Shop extends Scene_MenuBase {
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
    }

    /**
     * @param {RMMZ.ShopGoods[]} goods
     * @param {boolean} purchaseOnly
     * @returns {void}
     */
    prepare(goods, purchaseOnly) {
        this._goods = goods;
        this._purchaseOnly = purchaseOnly;
        this._item = null;
    }

    /** @returns {void} */
    create() {
        super.create();
        this.createHelpWindow();
        this.createGoldWindow();
        this.createCommandWindow();
        this.createDummyWindow();
        this.createNumberWindow();
        this.createStatusWindow();
        this.createBuyWindow();
        this.createCategoryWindow();
        this.createSellWindow();
    }

    /** @returns {void} */
    createGoldWindow() {
        const rect = this.goldWindowRect();
        this._goldWindow = new Window_Gold(rect);
        this.addWindow(this._goldWindow);
    }

    /** @returns {Rectangle} */
    goldWindowRect() {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(1, true);
        const wx = Graphics.boxWidth - ww;
        const wy = this.mainAreaTop();
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createCommandWindow() {
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_ShopCommand(rect);
        this._commandWindow.setPurchaseOnly(this._purchaseOnly);
        this._commandWindow.y = this.mainAreaTop();
        this._commandWindow.setHandler("buy", this.commandBuy.bind(this));
        this._commandWindow.setHandler("sell", this.commandSell.bind(this));
        this._commandWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._commandWindow);
    }

    /** @returns {Rectangle} */
    commandWindowRect() {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = this._goldWindow.x;
        const wh = this.calcWindowHeight(1, true);
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createDummyWindow() {
        const rect = this.dummyWindowRect();
        this._dummyWindow = new Window_Base(rect);
        this.addWindow(this._dummyWindow);
    }

    /** @returns {Rectangle} */
    dummyWindowRect() {
        const wx = 0;
        const wy = this._commandWindow.y + this._commandWindow.height;
        const ww = Graphics.boxWidth;
        const wh = this.mainAreaHeight() - this._commandWindow.height;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createNumberWindow() {
        const rect = this.numberWindowRect();
        this._numberWindow = new Window_ShopNumber(rect);
        this._numberWindow.hide();
        this._numberWindow.setHandler("ok", this.onNumberOk.bind(this));
        this._numberWindow.setHandler("cancel", this.onNumberCancel.bind(this));
        this.addWindow(this._numberWindow);
    }

    /** @returns {Rectangle} */
    numberWindowRect() {
        const wx = 0;
        const wy = this._dummyWindow.y;
        const ww = Graphics.boxWidth - this.statusWidth();
        const wh = this._dummyWindow.height;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createStatusWindow() {
        const rect = this.statusWindowRect();
        this._statusWindow = new Window_ShopStatus(rect);
        this._statusWindow.hide();
        this.addWindow(this._statusWindow);
    }

    /** @returns {Rectangle} */
    statusWindowRect() {
        const ww = this.statusWidth();
        const wh = this._dummyWindow.height;
        const wx = Graphics.boxWidth - ww;
        const wy = this._dummyWindow.y;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createBuyWindow() {
        const rect = this.buyWindowRect();
        this._buyWindow = new Window_ShopBuy(rect);
        this._buyWindow.setupGoods(this._goods);
        this._buyWindow.setHelpWindow(this._helpWindow);
        this._buyWindow.setStatusWindow(this._statusWindow);
        this._buyWindow.hide();
        this._buyWindow.setHandler("ok", this.onBuyOk.bind(this));
        this._buyWindow.setHandler("cancel", this.onBuyCancel.bind(this));
        this.addWindow(this._buyWindow);
    }

    /** @returns {Rectangle} */
    buyWindowRect() {
        const wx = 0;
        const wy = this._dummyWindow.y;
        const ww = Graphics.boxWidth - this.statusWidth();
        const wh = this._dummyWindow.height;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createCategoryWindow() {
        const rect = this.categoryWindowRect();
        this._categoryWindow = new Window_ItemCategory(rect);
        this._categoryWindow.setHelpWindow(this._helpWindow);
        this._categoryWindow.hide();
        this._categoryWindow.deactivate();
        this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
        this._categoryWindow.setHandler("cancel", this.onCategoryCancel.bind(this));
        this.addWindow(this._categoryWindow);
    }

    /** @returns {Rectangle} */
    categoryWindowRect() {
        const wx = 0;
        const wy = this._dummyWindow.y;
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(1, true);
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createSellWindow() {
        const rect = this.sellWindowRect();
        this._sellWindow = new Window_ShopSell(rect);
        this._sellWindow.setHelpWindow(this._helpWindow);
        this._sellWindow.hide();
        this._sellWindow.setHandler("ok", this.onSellOk.bind(this));
        this._sellWindow.setHandler("cancel", this.onSellCancel.bind(this));
        this._categoryWindow.setItemWindow(this._sellWindow);
        this.addWindow(this._sellWindow);
        if (!this._categoryWindow.needsSelection()) {
            this._sellWindow.y -= this._categoryWindow.height;
            this._sellWindow.height += this._categoryWindow.height;
            this._sellWindow.createContents();
        }
    }

    /** @returns {Rectangle} */
    sellWindowRect() {
        const wx = 0;
        const wy = this._categoryWindow.y + this._categoryWindow.height;
        const ww = Graphics.boxWidth;
        const wh =
            this.mainAreaHeight() -
            this._commandWindow.height -
            this._categoryWindow.height;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {number} */
    statusWidth() {
        return 352;
    }

    /** @returns {void} */
    activateBuyWindow() {
        this._buyWindow.setMoney(this.money());
        this._buyWindow.show();
        this._buyWindow.activate();
        this._statusWindow.show();
    }

    /** @returns {void} */
    activateSellWindow() {
        if (this._categoryWindow.needsSelection()) {
            this._categoryWindow.show();
        }
        this._sellWindow.refresh();
        this._sellWindow.show();
        this._sellWindow.activate();
        this._statusWindow.hide();
    }

    /** @returns {void} */
    commandBuy() {
        this._dummyWindow.hide();
        this.activateBuyWindow();
    }

    /** @returns {void} */
    commandSell() {
        this._dummyWindow.hide();
        this._sellWindow.show();
        this._sellWindow.deselect();
        this._sellWindow.refresh();
        if (this._categoryWindow.needsSelection()) {
            this._categoryWindow.show();
            this._categoryWindow.activate();
        } else {
            this.onCategoryOk();
        }
    }

    /** @returns {void} */
    onBuyOk() {
        this._item = this._buyWindow.item();
        this._buyWindow.hide();
        this._numberWindow.setup(this._item, this.maxBuy(), this.buyingPrice());
        this._numberWindow.setCurrencyUnit(this.currencyUnit());
        this._numberWindow.show();
        this._numberWindow.activate();
    }

    /** @returns {void} */
    onBuyCancel() {
        this._commandWindow.activate();
        this._dummyWindow.show();
        this._buyWindow.hide();
        this._statusWindow.hide();
        this._statusWindow.setItem(null);
        this._helpWindow.clear();
    }

    /** @returns {void} */
    onCategoryOk() {
        this.activateSellWindow();
        this._sellWindow.select(0);
        this._sellWindow.setTopRow(0);
    }

    /** @returns {void} */
    onCategoryCancel() {
        this._commandWindow.activate();
        this._dummyWindow.show();
        this._categoryWindow.hide();
        this._sellWindow.hide();
    }

    /** @returns {void} */
    onSellOk() {
        this._item = this._sellWindow.item();
        this._categoryWindow.hide();
        this._sellWindow.hide();
        this._numberWindow.setup(this._item, this.maxSell(), this.sellingPrice());
        this._numberWindow.setCurrencyUnit(this.currencyUnit());
        this._numberWindow.show();
        this._numberWindow.activate();
        this._statusWindow.setItem(this._item);
        this._statusWindow.show();
    }

    /** @returns {void} */
    onSellCancel() {
        this._sellWindow.deselect();
        this._statusWindow.setItem(null);
        this._helpWindow.clear();
        if (this._categoryWindow.needsSelection()) {
            this._categoryWindow.activate();
        } else {
            this.onCategoryCancel();
        }
    }

    /** @returns {void} */
    onNumberOk() {
        SoundManager.playShop();
        switch (this._commandWindow.currentSymbol()) {
            case "buy":
                this.doBuy(this._numberWindow.number());
                break;
            case "sell":
                this.doSell(this._numberWindow.number());
                break;
        }
        this.endNumberInput();
        this._goldWindow.refresh();
        this._statusWindow.refresh();
    }

    /** @returns {void} */
    onNumberCancel() {
        SoundManager.playCancel();
        this.endNumberInput();
    }

    /**
     * @param {number} number
     * @returns {void}
     */
    doBuy(number) {
        $gameParty.loseGold(number * this.buyingPrice());
        $gameParty.gainItem(this._item, number);
    }

    /**
     * @param {number} number
     * @returns {void}
     */
    doSell(number) {
        $gameParty.gainGold(number * this.sellingPrice());
        $gameParty.loseItem(this._item, number);
    }

    /** @returns {void} */
    endNumberInput() {
        this._numberWindow.hide();
        switch (this._commandWindow.currentSymbol()) {
            case "buy":
                this.activateBuyWindow();
                break;
            case "sell":
                this.activateSellWindow();
                break;
        }
    }

    /** @returns {number} */
    maxBuy() {
        const num = $gameParty.numItems(this._item);
        const max = $gameParty.maxItems(this._item) - num;
        const price = this.buyingPrice();
        if (price > 0) {
            return Math.min(max, Math.floor(this.money() / price));
        } else {
            return max;
        }
    }

    /** @returns {number} */
    maxSell() {
        return $gameParty.numItems(this._item);
    }

    /** @returns {number} */
    money() {
        return this._goldWindow.value();
    }

    /** @returns {string} */
    currencyUnit() {
        return this._goldWindow.currencyUnit();
    }

    /** @returns {number} */
    buyingPrice() {
        return this._buyWindow.price(this._item);
    }

    /** @returns {number} */
    sellingPrice() {
        return Math.floor(this._item.price / 2);
    }
}

/**
 * The scene class of the name input screen.
 */
class Scene_Name extends Scene_MenuBase {
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
    }

    /**
     * @param {RMMZ.ActorID} actorId
     * @param {number} maxLength
     * @returns {void}
     */
    prepare(actorId, maxLength) {
        this._actorId = actorId;
        this._maxLength = maxLength;
    }

    /** @returns {void} */
    create() {
        super.create();
        this._actor = $gameActors.actor(this._actorId);
        this.createEditWindow();
        this.createInputWindow();
    }

    /** @returns {void} */
    start() {
        super.start();
        this._editWindow.refresh();
    }

    /** @returns {void} */
    createEditWindow() {
        const rect = this.editWindowRect();
        this._editWindow = new Window_NameEdit(rect);
        this._editWindow.setup(this._actor, this._maxLength);
        this.addWindow(this._editWindow);
    }

    /** @returns {Rectangle} */
    editWindowRect() {
        const inputWindowHeight = this.calcWindowHeight(9, true);
        const padding = $gameSystem.windowPadding();
        const ww = 600;
        const wh = ImageManager.standardFaceHeight + padding * 2;
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - (wh + inputWindowHeight + 8)) / 2;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createInputWindow() {
        const rect = this.inputWindowRect();
        this._inputWindow = new Window_NameInput(rect);
        this._inputWindow.setEditWindow(this._editWindow);
        this._inputWindow.setHandler("ok", this.onInputOk.bind(this));
        this.addWindow(this._inputWindow);
    }

    /** @returns {Rectangle} */
    inputWindowRect() {
        const wx = this._editWindow.x;
        const wy = this._editWindow.y + this._editWindow.height + 8;
        const ww = this._editWindow.width;
        const wh = this.calcWindowHeight(9, true);
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    onInputOk() {
        this._actor.setName(this._editWindow.name());
        this.popScene();
    }
}

/**
 * The scene class of the debug screen.
 */
class Scene_Debug extends Scene_MenuBase {
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
    }

    /** @returns {void} */
    create() {
        super.create();
        this.createRangeWindow();
        this.createEditWindow();
        this.createDebugHelpWindow();
    }

    /** @returns {boolean} */
    needsCancelButton() {
        return false;
    }

    /** @returns {void} */
    createRangeWindow() {
        const rect = this.rangeWindowRect();
        this._rangeWindow = new Window_DebugRange(rect);
        this._rangeWindow.setHandler("ok", this.onRangeOk.bind(this));
        this._rangeWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._rangeWindow);
    }

    /** @returns {Rectangle} */
    rangeWindowRect() {
        const wx = 0;
        const wy = 0;
        const ww = 246;
        const wh = Graphics.boxHeight;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createEditWindow() {
        const rect = this.editWindowRect();
        this._editWindow = new Window_DebugEdit(rect);
        this._editWindow.setHandler("cancel", this.onEditCancel.bind(this));
        this._rangeWindow.setEditWindow(this._editWindow);
        this.addWindow(this._editWindow);
    }

    /** @returns {Rectangle} */
    editWindowRect() {
        const wx = this._rangeWindow.width;
        const wy = 0;
        const ww = Graphics.boxWidth - wx;
        const wh = this.calcWindowHeight(10, true);
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createDebugHelpWindow() {
        const rect = this.debugHelpWindowRect();
        this._debugHelpWindow = new Window_Base(rect);
        this.addWindow(this._debugHelpWindow);
    }

    /** @returns {Rectangle} */
    debugHelpWindowRect() {
        const wx = this._editWindow.x;
        const wy = this._editWindow.height;
        const ww = this._editWindow.width;
        const wh = Graphics.boxHeight - wy;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    onRangeOk() {
        this._editWindow.activate();
        this._editWindow.select(0);
        this.refreshHelpWindow();
    }

    /** @returns {void} */
    onEditCancel() {
        this._rangeWindow.activate();
        this._editWindow.deselect();
        this.refreshHelpWindow();
    }

    /** @returns {void} */
    refreshHelpWindow() {
        const helpWindow = this._debugHelpWindow;
        helpWindow.contents.clear();
        if (this._editWindow.active) {
            const rect = helpWindow.baseTextRect();
            helpWindow.drawTextEx(this.helpText(), rect.x, rect.y, rect.width);
        }
    }

    /** @returns {string} */
    helpText() {
        if (this._rangeWindow.mode() === "switch") {
            return "Enter : ON / OFF";
        } else {
            return (
                "Left     :  -1    Pageup   : -10\n" +
                "Right    :  +1    Pagedown : +10"
            );
        }
    }
}

/**
 * The scene class of the battle screen.
 */
class Scene_Battle extends Scene_Message {
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
    }

    /** @returns {void} */
    create() {
        super.create();
        this.createDisplayObjects();
    }

    /** @returns {void} */
    start() {
        super.start();
        BattleManager.playBattleBgm();
        BattleManager.startBattle();
        this._statusWindow.refresh();
        this.startFadeIn(this.fadeSpeed(), false);
    }

    /** @returns {void} */
    update() {
        const active = this.isActive();
        $gameTimer.update(active);
        $gameScreen.update();
        this.updateVisibility();
        if (active && !this.isBusy()) {
            this.updateBattleProcess();
        }
        super.update();
    }

    /** @returns {void} */
    updateVisibility() {
        this.updateLogWindowVisibility();
        this.updateStatusWindowVisibility();
        this.updateInputWindowVisibility();
        this.updateCancelButton();
    }

    /** @returns {void} */
    updateBattleProcess() {
        BattleManager.update(this.isTimeActive());
    }

    /** @returns {boolean} */
    isTimeActive() {
        if (BattleManager.isActiveTpb()) {
            return !this._skillWindow.active && !this._itemWindow.active;
        } else {
            return !this.isAnyInputWindowActive();
        }
    }

    /** @returns {boolean} */
    isAnyInputWindowActive() {
        return (
            this._partyCommandWindow.active ||
            this._actorCommandWindow.active ||
            this._skillWindow.active ||
            this._itemWindow.active ||
            this._actorWindow.active ||
            this._enemyWindow.active
        );
    }

    /** @returns {void} */
    changeInputWindow() {
        this.hideSubInputWindows();
        if (BattleManager.isInputting()) {
            if (BattleManager.actor()) {
                this.startActorCommandSelection();
            } else {
                this.startPartyCommandSelection();
            }
        } else {
            this.endCommandSelection();
        }
    }

    /** @returns {void} */
    stop() {
        super.stop();
        if (this.needsSlowFadeOut()) {
            this.startFadeOut(this.slowFadeSpeed(), false);
        } else {
            this.startFadeOut(this.fadeSpeed(), false);
        }
        this._statusWindow.close();
        this._partyCommandWindow.close();
        this._actorCommandWindow.close();
    }

    /** @returns {void} */
    terminate() {
        super.terminate();
        $gameParty.onBattleEnd();
        $gameTroop.onBattleEnd();
        AudioManager.stopMe();
        if (this.shouldAutosave()) {
            this.requestAutosave();
        }
    }

    /** @returns {boolean | null} */
    shouldAutosave() {
        return SceneManager.isNextScene(Scene_Map);
    }

    /** @returns {boolean | null} */
    needsSlowFadeOut() {
        return (
            SceneManager.isNextScene(Scene_Title) ||
            SceneManager.isNextScene(Scene_Gameover)
        );
    }

    /** @returns {void} */
    updateLogWindowVisibility() {
        this._logWindow.visible = !this._helpWindow.visible;
    }

    /** @returns {void} */
    updateStatusWindowVisibility() {
        if ($gameMessage.isBusy()) {
            this._statusWindow.close();
        } else if (this.shouldOpenStatusWindow()) {
            this._statusWindow.open();
        }
        this.updateStatusWindowPosition();
    }

    /** @returns {boolean} */
    shouldOpenStatusWindow() {
        return (
            this.isActive() &&
            !this.isMessageWindowClosing() &&
            !BattleManager.isBattleEnd()
        );
    }

    /** @returns {void} */
    updateStatusWindowPosition() {
        const statusWindow = this._statusWindow;
        const targetX = this.statusWindowX();
        if (statusWindow.x < targetX) {
            statusWindow.x = Math.min(statusWindow.x + 16, targetX);
        }
        if (statusWindow.x > targetX) {
            statusWindow.x = Math.max(statusWindow.x - 16, targetX);
        }
    }

    /** @returns {number} */
    statusWindowX() {
        if (this.isAnyInputWindowActive()) {
            return this.statusWindowRect().x;
        } else {
            return this._partyCommandWindow.width / 2;
        }
    }

    /** @returns {void} */
    updateInputWindowVisibility() {
        if ($gameMessage.isBusy()) {
            this.closeCommandWindows();
            this.hideSubInputWindows();
        } else if (this.needsInputWindowChange()) {
            this.changeInputWindow();
        }
    }

    /** @returns {boolean} */
    needsInputWindowChange() {
        const windowActive = this.isAnyInputWindowActive();
        const inputting = BattleManager.isInputting();
        if (windowActive && inputting) {
            return this._actorCommandWindow.actor() !== BattleManager.actor();
        }
        return windowActive !== inputting;
    }

    /** @returns {void} */
    updateCancelButton() {
        if (this._cancelButton) {
            this._cancelButton.visible =
                this.isAnyInputWindowActive() && !this._partyCommandWindow.active;
        }
    }

    /** @returns {void} */
    createDisplayObjects() {
        this.createSpriteset();
        this.createWindowLayer();
        this.createAllWindows();
        this.createButtons();
        BattleManager.setLogWindow(this._logWindow);
        BattleManager.setSpriteset(this._spriteset);
        this._logWindow.setSpriteset(this._spriteset);
    }

    /** @returns {void} */
    createSpriteset() {
        this._spriteset = new Spriteset_Battle();
        this.addChild(this._spriteset);
    }

    /** @returns {void} */
    createAllWindows() {
        this.createLogWindow();
        this.createStatusWindow();
        this.createPartyCommandWindow();
        this.createActorCommandWindow();
        this.createHelpWindow();
        this.createSkillWindow();
        this.createItemWindow();
        this.createActorWindow();
        this.createEnemyWindow();
        super.createAllWindows();
    }

    /** @returns {void} */
    createLogWindow() {
        const rect = this.logWindowRect();
        this._logWindow = new Window_BattleLog(rect);
        this.addWindow(this._logWindow);
    }

    /** @returns {Rectangle} */
    logWindowRect() {
        const wx = 0;
        const wy = 0;
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(10, false);
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createStatusWindow() {
        const rect = this.statusWindowRect();
        const statusWindow = new Window_BattleStatus(rect);
        this.addWindow(statusWindow);
        this._statusWindow = statusWindow;
    }

    /** @returns {Rectangle} */
    statusWindowRect() {
        const extra = 10;
        const ww = Graphics.boxWidth - 192;
        const wh = this.windowAreaHeight() + extra;
        const wx = this.isRightInputMode() ? 0 : Graphics.boxWidth - ww;
        const wy = Graphics.boxHeight - wh + extra - 4;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createPartyCommandWindow() {
        const rect = this.partyCommandWindowRect();
        const commandWindow = new Window_PartyCommand(rect);
        commandWindow.setHandler("fight", this.commandFight.bind(this));
        commandWindow.setHandler("escape", this.commandEscape.bind(this));
        commandWindow.deselect();
        this.addWindow(commandWindow);
        this._partyCommandWindow = commandWindow;
    }

    /** @returns {Rectangle} */
    partyCommandWindowRect() {
        const ww = 192;
        const wh = this.windowAreaHeight();
        const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
        const wy = Graphics.boxHeight - wh;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createActorCommandWindow() {
        const rect = this.actorCommandWindowRect();
        const commandWindow = new Window_ActorCommand(rect);
        commandWindow.y = Graphics.boxHeight - commandWindow.height;
        commandWindow.setHandler("attack", this.commandAttack.bind(this));
        commandWindow.setHandler("skill", this.commandSkill.bind(this));
        commandWindow.setHandler("guard", this.commandGuard.bind(this));
        commandWindow.setHandler("item", this.commandItem.bind(this));
        commandWindow.setHandler("cancel", this.commandCancel.bind(this));
        this.addWindow(commandWindow);
        this._actorCommandWindow = commandWindow;
    }

    /** @returns {Rectangle} */
    actorCommandWindowRect() {
        const ww = 192;
        const wh = this.windowAreaHeight();
        const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
        const wy = Graphics.boxHeight - wh;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createHelpWindow() {
        const rect = this.helpWindowRect();
        this._helpWindow = new Window_Help(rect);
        this._helpWindow.hide();
        this.addWindow(this._helpWindow);
    }

    /** @returns {Rectangle} */
    helpWindowRect() {
        const wx = 0;
        const wy = this.helpAreaTop();
        const ww = Graphics.boxWidth;
        const wh = this.helpAreaHeight();
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createSkillWindow() {
        const rect = this.skillWindowRect();
        this._skillWindow = new Window_BattleSkill(rect);
        this._skillWindow.setHelpWindow(this._helpWindow);
        this._skillWindow.setHandler("ok", this.onSkillOk.bind(this));
        this._skillWindow.setHandler("cancel", this.onSkillCancel.bind(this));
        this.addWindow(this._skillWindow);
    }

    /** @returns {Rectangle} */
    skillWindowRect() {
        const ww = Graphics.boxWidth;
        const wh = this.windowAreaHeight();
        const wx = 0;
        const wy = Graphics.boxHeight - wh;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {void} */
    createItemWindow() {
        const rect = this.itemWindowRect();
        this._itemWindow = new Window_BattleItem(rect);
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
        this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
        this.addWindow(this._itemWindow);
    }

    /** @returns {Rectangle} */
    itemWindowRect() {
        return this.skillWindowRect();
    }

    /** @returns {void} */
    createActorWindow() {
        const rect = this.actorWindowRect();
        this._actorWindow = new Window_BattleActor(rect);
        this._actorWindow.setHandler("ok", this.onActorOk.bind(this));
        this._actorWindow.setHandler("cancel", this.onActorCancel.bind(this));
        this.addWindow(this._actorWindow);
    }

    /** @returns {Rectangle} */
    actorWindowRect() {
        return this.statusWindowRect();
    }

    /** @returns {void} */
    createEnemyWindow() {
        const rect = this.enemyWindowRect();
        this._enemyWindow = new Window_BattleEnemy(rect);
        this._enemyWindow.setHandler("ok", this.onEnemyOk.bind(this));
        this._enemyWindow.setHandler("cancel", this.onEnemyCancel.bind(this));
        this.addWindow(this._enemyWindow);
    }

    /** @returns {Rectangle} */
    enemyWindowRect() {
        const wx = this._statusWindow.x;
        const ww = this._statusWindow.width;
        const wh = this.windowAreaHeight();
        const wy = Graphics.boxHeight - wh;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    /** @returns {number} */
    helpAreaTop() {
        return 0;
    }

    /** @returns {number} */
    helpAreaBottom() {
        return this.helpAreaTop() + this.helpAreaHeight();
    }

    /** @returns {number} */
    helpAreaHeight() {
        return this.calcWindowHeight(2, false);
    }

    /** @returns {number} */
    buttonAreaTop() {
        return this.helpAreaBottom();
    }

    /** @returns {number} */
    windowAreaHeight() {
        return this.calcWindowHeight(4, true);
    }

    /** @returns {void} */
    createButtons() {
        if (ConfigManager.touchUI) {
            this.createCancelButton();
        }
    }

    /** @returns {void} */
    createCancelButton() {
        this._cancelButton = new Sprite_Button("cancel");
        this._cancelButton.x = Graphics.boxWidth - this._cancelButton.width - 4;
        this._cancelButton.y = this.buttonY();
        this.addWindow(this._cancelButton);
    }

    /** @returns {void} */
    closeCommandWindows() {
        this._partyCommandWindow.deactivate();
        this._actorCommandWindow.deactivate();
        this._partyCommandWindow.close();
        this._actorCommandWindow.close();
    }

    /** @returns {void} */
    hideSubInputWindows() {
        this._actorWindow.deactivate();
        this._enemyWindow.deactivate();
        this._skillWindow.deactivate();
        this._itemWindow.deactivate();
        this._actorWindow.hide();
        this._enemyWindow.hide();
        this._skillWindow.hide();
        this._itemWindow.hide();
    }

    /** @returns {void} */
    startPartyCommandSelection() {
        this._statusWindow.deselect();
        this._statusWindow.show();
        this._statusWindow.open();
        this._actorCommandWindow.setup(null);
        this._actorCommandWindow.close();
        this._partyCommandWindow.setup();
    }

    /** @returns {void} */
    commandFight() {
        this.selectNextCommand();
    }

    /** @returns {void} */
    commandEscape() {
        BattleManager.processEscape();
        this.changeInputWindow();
    }

    /** @returns {void} */
    startActorCommandSelection() {
        this._statusWindow.show();
        this._statusWindow.selectActor(BattleManager.actor());
        this._partyCommandWindow.close();
        this._actorCommandWindow.show();
        this._actorCommandWindow.setup(BattleManager.actor());
    }

    /** @returns {void} */
    commandAttack() {
        const action = BattleManager.inputtingAction();
        action.setAttack();
        this.onSelectAction();
    }

    /** @returns {void} */
    commandSkill() {
        this._skillWindow.setActor(BattleManager.actor());
        this._skillWindow.setStypeId(this._actorCommandWindow.currentExt());
        this._skillWindow.refresh();
        this._skillWindow.show();
        this._skillWindow.activate();
        this._statusWindow.hide();
        this._actorCommandWindow.hide();
    }

    /** @returns {void} */
    commandGuard() {
        const action = BattleManager.inputtingAction();
        action.setGuard();
        this.onSelectAction();
    }

    /** @returns {void} */
    commandItem() {
        this._itemWindow.refresh();
        this._itemWindow.show();
        this._itemWindow.activate();
        this._statusWindow.hide();
        this._actorCommandWindow.hide();
    }

    /** @returns {void} */
    commandCancel() {
        this.selectPreviousCommand();
    }

    /** @returns {void} */
    selectNextCommand() {
        BattleManager.selectNextCommand();
        this.changeInputWindow();
    }

    /** @returns {void} */
    selectPreviousCommand() {
        BattleManager.selectPreviousCommand();
        this.changeInputWindow();
    }

    /** @returns {void} */
    startActorSelection() {
        this._actorWindow.refresh();
        this._actorWindow.show();
        this._actorWindow.activate();
    }

    /** @returns {void} */
    onActorOk() {
        const action = BattleManager.inputtingAction();
        action.setTarget(this._actorWindow.index());
        this.hideSubInputWindows();
        this.selectNextCommand();
    }

    /** @returns {void} */
    onActorCancel() {
        this._actorWindow.hide();
        switch (this._actorCommandWindow.currentSymbol()) {
            case "skill":
                this._skillWindow.show();
                this._skillWindow.activate();
                break;
            case "item":
                this._itemWindow.show();
                this._itemWindow.activate();
                break;
        }
    }

    /** @returns {void} */
    startEnemySelection() {
        this._enemyWindow.refresh();
        this._enemyWindow.show();
        this._enemyWindow.select(0);
        this._enemyWindow.activate();
        this._statusWindow.hide();
    }

    /** @returns {void} */
    onEnemyOk() {
        const action = BattleManager.inputtingAction();
        action.setTarget(this._enemyWindow.enemyIndex());
        this.hideSubInputWindows();
        this.selectNextCommand();
    }

    /** @returns {void} */
    onEnemyCancel() {
        this._enemyWindow.hide();
        switch (this._actorCommandWindow.currentSymbol()) {
            case "attack":
                this._statusWindow.show();
                this._actorCommandWindow.activate();
                break;
            case "skill":
                this._skillWindow.show();
                this._skillWindow.activate();
                break;
            case "item":
                this._itemWindow.show();
                this._itemWindow.activate();
                break;
        }
    }

    /** @returns {void} */
    onSkillOk() {
        const skill = this._skillWindow.item();
        const action = BattleManager.inputtingAction();
        action.setSkill(skill.id);
        BattleManager.actor().setLastBattleSkill(skill);
        this.onSelectAction();
    }

    /** @returns {void} */
    onSkillCancel() {
        this._skillWindow.hide();
        this._statusWindow.show();
        this._actorCommandWindow.show();
        this._actorCommandWindow.activate();
    }

    /** @returns {void} */
    onItemOk() {
        const item = this._itemWindow.item();
        const action = BattleManager.inputtingAction();
        action.setItem(item.id);
        $gameParty.setLastItem(item);
        this.onSelectAction();
    }

    /** @returns {void} */
    onItemCancel() {
        this._itemWindow.hide();
        this._statusWindow.show();
        this._actorCommandWindow.show();
        this._actorCommandWindow.activate();
    }

    /** @returns {void} */
    onSelectAction() {
        const action = BattleManager.inputtingAction();
        if (!action.needsSelection()) {
            this.selectNextCommand();
        } else if (action.isForOpponent()) {
            this.startEnemySelection();
        } else {
            this.startActorSelection();
        }
    }

    /** @returns {void} */
    endCommandSelection() {
        this.closeCommandWindows();
        this.hideSubInputWindows();
        this._statusWindow.deselect();
        this._statusWindow.show();
    }
}

/**
 * The scene class of the game over screen.
 */
class Scene_Gameover extends Scene_Base {
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
    }

    /** @returns {void} */
    create() {
        super.create();
        this.playGameoverMusic();
        this.createBackground();
    }

    /** @returns {void} */
    start() {
        super.start();
        this.adjustBackground();
        this.startFadeIn(this.slowFadeSpeed(), false);
    }

    /** @returns {void} */
    update() {
        if (this.isActive() && !this.isBusy() && this.isTriggered()) {
            this.gotoTitle();
        }
        super.update();
    }

    /** @returns {void} */
    stop() {
        super.stop();
        this.fadeOutAll();
    }

    /** @returns {void} */
    terminate() {
        super.terminate();
        AudioManager.stopAll();
    }

    /** @returns {void} */
    playGameoverMusic() {
        AudioManager.stopBgm();
        AudioManager.stopBgs();
        AudioManager.playMe($dataSystem.gameoverMe);
    }

    /** @returns {void} */
    createBackground() {
        this._backSprite = new Sprite();
        this._backSprite.bitmap = ImageManager.loadSystem("GameOver");
        this.addChild(this._backSprite);
    }

    /** @returns {void} */
    adjustBackground() {
        this.scaleSprite(this._backSprite);
        this.centerSprite(this._backSprite);
    }

    /** @returns {boolean} */
    isTriggered() {
        return Input.isTriggered("ok") || TouchInput.isTriggered();
    }

    /** @returns {void} */
    gotoTitle() {
        SceneManager.goto(Scene_Title);
    }
}

// Class declarations are lexical bindings, while plugins and JsonEx resolve
// constructors through the global object, so expose them as global properties.
Object.assign(globalThis, {
    Scene_Base,
    Scene_Boot,
    Scene_Splash,
    Scene_Title,
    Scene_Message,
    Scene_Map,
    Scene_MenuBase,
    Scene_Menu,
    Scene_ItemBase,
    Scene_Item,
    Scene_Skill,
    Scene_Equip,
    Scene_Status,
    Scene_Options,
    Scene_File,
    Scene_Save,
    Scene_Load,
    Scene_GameEnd,
    Scene_Shop,
    Scene_Name,
    Scene_Debug,
    Scene_Battle,
    Scene_Gameover,
});
