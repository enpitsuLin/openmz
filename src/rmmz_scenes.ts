// rmmz_scenes.js v2.0.0

/**
 * The superclass of all scenes within the game.
 */
class Scene_Base extends Stage {
    declare _started: boolean;
    declare _active: boolean;
    declare _fadeSign: number;
    declare _fadeDuration: number;
    declare _fadeWhite: number | boolean;
    declare _fadeOpacity: number;
    declare _windowLayer: WindowLayer;
    declare _colorFilter: ColorFilter;

    constructor(..._extra: any[]);
    constructor(...args: []) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();

        this._started = false;
        this._active = false;
        this._fadeSign = 0;
        this._fadeDuration = 0;
        this._fadeWhite = 0;
        this._fadeOpacity = 0;
        this.createColorFilter();
    }

    create(): void {
        //
    }

    isActive(): boolean {
        return this._active;
    }

    isReady(): boolean {
        return ImageManager.isReady() && EffectManager.isReady() && FontManager.isReady();
    }

    start(): void {
        this._started = true;
        this._active = true;
    }

    update(): void {
        this.updateFade();
        this.updateColorFilter();
        this.updateChildren();
        AudioManager.checkErrors();
    }

    stop(): void {
        this._active = false;
    }

    isStarted(): boolean {
        return this._started;
    }

    isBusy(): boolean {
        return this.isFading();
    }

    isFading(): boolean {
        return this._fadeDuration > 0;
    }

    terminate(): void {
        //
    }

    createWindowLayer(): void {
        this._windowLayer = new WindowLayer();
        this._windowLayer.x = (Graphics.width - Graphics.boxWidth) / 2;
        this._windowLayer.y = (Graphics.height - Graphics.boxHeight) / 2;
        this.addChild(this._windowLayer);
    }

    addWindow(window: import("pixi.js").Container): void {
        this._windowLayer.addWindow(window as RmmzWindow);
    }

    startFadeIn(duration: number, white?: number | boolean): void {
        this._fadeSign = 1;
        this._fadeDuration = duration || 30;
        this._fadeWhite = white!;
        this._fadeOpacity = 255;
        this.updateColorFilter();
    }

    startFadeOut(duration: number, white?: number | boolean): void {
        this._fadeSign = -1;
        this._fadeDuration = duration || 30;
        this._fadeWhite = white!;
        this._fadeOpacity = 0;
        this.updateColorFilter();
    }

    createColorFilter(): void {
        this._colorFilter = new ColorFilter();
        this.filters = [this._colorFilter];
    }

    updateColorFilter(): void {
        const c = this._fadeWhite ? 255 : 0;
        const blendColor = [c, c, c, this._fadeOpacity];
        this._colorFilter.setBlendColor(blendColor as RMMZ.Color);
    }

    updateFade(): void {
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

    updateChildren(): void {
        for (const child of this.children) {
            if (child.update) {
                child.update();
            }
        }
    }

    popScene(): void {
        SceneManager.pop();
    }

    checkGameover(): void {
        if ($gameParty.isAllDead()) {
            SceneManager.goto(Scene_Gameover);
        }
    }

    fadeOutAll(): void {
        const time = this.slowFadeSpeed() / 60;
        AudioManager.fadeOutBgm(time);
        AudioManager.fadeOutBgs(time);
        AudioManager.fadeOutMe(time);
        this.startFadeOut(this.slowFadeSpeed());
    }

    fadeSpeed(): number {
        return 24;
    }

    slowFadeSpeed(): number {
        return this.fadeSpeed() * 2;
    }

    scaleSprite(sprite: Sprite): void {
        const ratioX = Graphics.width / sprite.bitmap.width;
        const ratioY = Graphics.height / sprite.bitmap.height;
        const scale = Math.max(ratioX, ratioY, 1.0);
        sprite.scale.x = scale;
        sprite.scale.y = scale;
    }

    centerSprite(sprite: Sprite): void {
        sprite.x = Graphics.width / 2;
        sprite.y = Graphics.height / 2;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
    }

    isBottomHelpMode(): boolean {
        return true;
    }

    isBottomButtonMode(): boolean {
        return false;
    }

    isRightInputMode(): boolean {
        return true;
    }

    mainCommandWidth(): number {
        return 240;
    }

    buttonAreaTop(): number {
        if (this.isBottomButtonMode()) {
            return Graphics.boxHeight - this.buttonAreaHeight();
        } else {
            return 0;
        }
    }

    buttonAreaBottom(): number {
        return this.buttonAreaTop() + this.buttonAreaHeight();
    }

    buttonAreaHeight(): number {
        return 52;
    }

    buttonY(): number {
        const offsetY = Math.floor((this.buttonAreaHeight() - 48) / 2);
        return this.buttonAreaTop() + offsetY;
    }

    calcWindowHeight(numLines: number, selectable: boolean): number {
        if (selectable) {
            return Window_Selectable.prototype.fittingHeight(numLines);
        } else {
            return Window_Base.prototype.fittingHeight(numLines);
        }
    }

    requestAutosave(): void {
        if (this.isAutosaveEnabled()) {
            this.executeAutosave();
        }
    }

    isAutosaveEnabled(): boolean {
        return (
            !DataManager.isBattleTest() &&
            !DataManager.isEventTest() &&
            $gameSystem.isAutosaveEnabled() &&
            $gameSystem.isSaveEnabled()
        );
    }

    executeAutosave(): void {
        $gameSystem.onBeforeSave();
        DataManager.saveGame(0)
            .then(() => this.onAutosaveSuccess())
            .catch(() => this.onAutosaveFailure());
    }

    onAutosaveSuccess(): void {
        //
    }

    onAutosaveFailure(): void {
        //
    }
}

/**
 * The scene class for initializing the entire game.
 */
class Scene_Boot extends Scene_Base {
    declare _databaseLoaded: boolean;

    constructor(...args: any[]) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();

        this._databaseLoaded = false;
    }

    create(): void {
        super.create();
        DataManager.loadDatabase();
        RmmzStorageManager.updateForageKeys();
    }

    isReady(): boolean {
        if (!this._databaseLoaded) {
            if (DataManager.isDatabaseLoaded() && RmmzStorageManager.forageKeysUpdated()) {
                this._databaseLoaded = true;
                this.onDatabaseLoaded();
            }
            return false;
        }
        return super.isReady() && this.isPlayerDataLoaded();
    }

    onDatabaseLoaded(): void {
        this.setEncryptionInfo();
        this.loadSystemImages();
        this.loadPlayerData();
        this.loadGameFonts();
    }

    setEncryptionInfo(): void {
        const hasImages = $dataSystem.hasEncryptedImages;
        const hasAudio = $dataSystem.hasEncryptedAudio;
        const key = $dataSystem.encryptionKey;
        Utils.setEncryptionInfo(hasImages!, hasAudio!, key!);
    }

    loadSystemImages(): void {
        ColorManager.loadWindowskin();
        ImageManager.loadSystem("IconSet");
    }

    loadPlayerData(): void {
        DataManager.loadGlobalInfo();
        ConfigManager.load();
    }

    loadGameFonts(): void {
        const advanced = $dataSystem.advanced;
        FontManager.load("rmmz-mainfont", advanced.mainFontFilename);
        FontManager.load("rmmz-numberfont", advanced.numberFontFilename);
    }

    isPlayerDataLoaded(): boolean {
        return DataManager.isGlobalInfoLoaded() && ConfigManager.isLoaded();
    }

    start(): void {
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

    startNormalGame(): void {
        this.checkPlayerLocation();
        DataManager.setupNewGame();
        Window_TitleCommand.initCommandPosition();
        SceneManager.goto(Scene_Splash);
    }

    resizeScreen(): void {
        const screenWidth = $dataSystem.advanced.screenWidth;
        const screenHeight = $dataSystem.advanced.screenHeight;
        Graphics.resize(screenWidth, screenHeight);
        Graphics.defaultScale = this.screenScale();
        this.adjustBoxSize();
        this.adjustWindow();
    }

    adjustBoxSize(): void {
        const uiAreaWidth = $dataSystem.advanced.uiAreaWidth;
        const uiAreaHeight = $dataSystem.advanced.uiAreaHeight;
        const boxMargin = 4;
        Graphics.boxWidth = uiAreaWidth - boxMargin * 2;
        Graphics.boxHeight = uiAreaHeight - boxMargin * 2;
    }

    adjustWindow(): void {
        if (Utils.isNwjs()) {
            const scale = this.screenScale();
            const xDelta = Graphics.width * scale - window.innerWidth;
            const yDelta = Graphics.height * scale - window.innerHeight;
            window.moveBy(-xDelta / 2, -yDelta / 2);
            window.resizeBy(xDelta, yDelta);
        }
    }

    screenScale(): number {
        if ("screenScale" in $dataSystem.advanced) {
            return $dataSystem.advanced.screenScale!;
        } else {
            return 1;
        }
    }

    updateDocumentTitle(): void {
        document.title = $dataSystem.gameTitle;
    }

    checkPlayerLocation(): void {
        if ($dataSystem.startMapId === 0) {
            throw new Error("Player's starting position is not set");
        }
    }
}

/**
 * The scene class of the splash screen.
 */
class Scene_Splash extends Scene_Base {
    declare _backSprite: Sprite;
    declare _waitCount: number;

    constructor(...args: any[]) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
        this.initWaitCount();
    }

    create(): void {
        super.create();
        if (this.isEnabled()) {
            this.createBackground();
        }
    }

    start(): void {
        super.start();
        if (this.isEnabled()) {
            this.adjustBackground();
            this.startFadeIn(this.fadeSpeed(), false);
        }
    }

    update(): void {
        super.update();
        if (this.isActive()) {
            if (!this.updateWaitCount()) {
                this.gotoTitle();
            }
            this.checkSkip();
        }
    }

    stop(): void {
        super.stop();
        if (this.isEnabled()) {
            this.startFadeOut(this.fadeSpeed());
        }
    }

    createBackground(): void {
        this._backSprite = new Sprite();
        this._backSprite.bitmap = ImageManager.loadSystem("Splash");
        this.addChild(this._backSprite);
    }

    adjustBackground(): void {
        this.scaleSprite(this._backSprite);
        this.centerSprite(this._backSprite);
    }

    isEnabled(): boolean {
        return $dataSystem.optSplashScreen;
    }

    initWaitCount(): void {
        if (this.isEnabled()) {
            this._waitCount = 120;
        } else {
            this._waitCount = 0;
        }
    }

    updateWaitCount(): boolean {
        if (this._waitCount > 0) {
            this._waitCount--;
            return true;
        }
        return false;
    }

    checkSkip(): void {
        if (Input.isTriggered("ok") || TouchInput.isTriggered()) {
            this._waitCount = 0;
        }
    }

    gotoTitle(): void {
        SceneManager.goto(Scene_Title);
    }
}

/**
 * The scene class of the title screen.
 */
class Scene_Title extends Scene_Base {
    declare _backSprite1: Sprite;
    declare _backSprite2: Sprite;
    declare _gameTitleSprite: Sprite;
    declare _commandWindow: Window_TitleCommand;

    constructor(...args: any[]) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
    }

    create(): void {
        super.create();
        this.createBackground();
        this.createForeground();
        this.createWindowLayer();
        this.createCommandWindow();
    }

    start(): void {
        super.start();
        SceneManager.clearStack();
        this.adjustBackground();
        this.playTitleMusic();
        this.startFadeIn(this.fadeSpeed(), false);
    }

    update(): void {
        if (!this.isBusy()) {
            this._commandWindow.open();
        }
        super.update();
    }

    isBusy(): boolean {
        return this._commandWindow.isClosing() || super.isBusy();
    }

    terminate(): void {
        super.terminate();
        SceneManager.snapForBackground();
        if (this._gameTitleSprite) {
            this._gameTitleSprite.bitmap.destroy();
        }
    }

    createBackground(): void {
        this._backSprite1 = new Sprite(ImageManager.loadTitle1($dataSystem.title1Name));
        this._backSprite2 = new Sprite(ImageManager.loadTitle2($dataSystem.title2Name));
        this.addChild(this._backSprite1);
        this.addChild(this._backSprite2);
    }

    createForeground(): void {
        this._gameTitleSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
        this.addChild(this._gameTitleSprite);
        if ($dataSystem.optDrawTitle) {
            this.drawGameTitle();
        }
    }

    drawGameTitle(): void {
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

    adjustBackground(): void {
        this.scaleSprite(this._backSprite1);
        this.scaleSprite(this._backSprite2);
        this.centerSprite(this._backSprite1);
        this.centerSprite(this._backSprite2);
    }

    createCommandWindow(): void {
        const background = $dataSystem.titleCommandWindow.background;
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_TitleCommand(rect);
        this._commandWindow.setBackgroundType(background);
        this._commandWindow.setHandler("newGame", this.commandNewGame.bind(this));
        this._commandWindow.setHandler("continue", this.commandContinue.bind(this));
        this._commandWindow.setHandler("options", this.commandOptions.bind(this));
        this.addWindow(this._commandWindow);
    }

    commandWindowRect(): Rectangle {
        const offsetX = $dataSystem.titleCommandWindow.offsetX;
        const offsetY = $dataSystem.titleCommandWindow.offsetY;
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(3, true);
        const wx = (Graphics.boxWidth - ww) / 2 + offsetX;
        const wy = Graphics.boxHeight - wh - 96 + offsetY;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    commandNewGame(): void {
        DataManager.setupNewGame();
        this._commandWindow.close();
        this.fadeOutAll();
        SceneManager.goto(Scene_Map);
    }

    commandContinue(): void {
        this._commandWindow.close();
        SceneManager.push(Scene_Load);
    }

    commandOptions(): void {
        this._commandWindow.close();
        SceneManager.push(Scene_Options);
    }

    playTitleMusic(): void {
        AudioManager.playBgm($dataSystem.titleBgm);
        AudioManager.stopBgs();
        AudioManager.stopMe();
    }
}

/**
 * The superclass of Scene_Map and Scene_Battle.
 */
class Scene_Message extends Scene_Base {
    declare _messageWindow: Window_Message;
    declare _scrollTextWindow: Window_ScrollText;
    declare _goldWindow: Window_Gold;
    declare _nameBoxWindow: Window_NameBox;
    declare _choiceListWindow: Window_ChoiceList;
    declare _numberInputWindow: Window_NumberInput;
    declare _eventItemWindow: Window_EventItem;

    constructor(...args: any[]) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
    }

    isMessageWindowClosing(): boolean {
        return this._messageWindow.isClosing();
    }

    createAllWindows(): void {
        this.createMessageWindow();
        this.createScrollTextWindow();
        this.createGoldWindow();
        this.createNameBoxWindow();
        this.createChoiceListWindow();
        this.createNumberInputWindow();
        this.createEventItemWindow();
        this.associateWindows();
    }

    createMessageWindow(): void {
        const rect = this.messageWindowRect();
        this._messageWindow = new Window_Message(rect);
        this.addWindow(this._messageWindow);
    }

    messageWindowRect(): Rectangle {
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(4, false) + 8;
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = 0;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createScrollTextWindow(): void {
        const rect = this.scrollTextWindowRect();
        this._scrollTextWindow = new Window_ScrollText(rect);
        this.addWindow(this._scrollTextWindow);
    }

    scrollTextWindowRect(): Rectangle {
        const wx = 0;
        const wy = 0;
        const ww = Graphics.boxWidth;
        const wh = Graphics.boxHeight;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createGoldWindow(): void {
        const rect = this.goldWindowRect();
        this._goldWindow = new Window_Gold(rect);
        this._goldWindow.openness = 0;
        this.addWindow(this._goldWindow);
    }

    goldWindowRect(): Rectangle {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(1, true);
        const wx = Graphics.boxWidth - ww;
        const wy = 0;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createNameBoxWindow(): void {
        this._nameBoxWindow = new Window_NameBox();
        this.addWindow(this._nameBoxWindow);
    }

    createChoiceListWindow(): void {
        this._choiceListWindow = new Window_ChoiceList();
        this.addWindow(this._choiceListWindow);
    }

    createNumberInputWindow(): void {
        this._numberInputWindow = new Window_NumberInput();
        this.addWindow(this._numberInputWindow);
    }

    createEventItemWindow(): void {
        const rect = this.eventItemWindowRect();
        this._eventItemWindow = new Window_EventItem(rect);
        this.addWindow(this._eventItemWindow);
    }

    eventItemWindowRect(): Rectangle {
        const wx = 0;
        const wy = 0;
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(4, true);
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    associateWindows(): void {
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

    cancelMessageWait(): void {
        this._messageWindow.cancelWait();
    }
}

/**
 * The scene class of the map screen.
 */
class Scene_Map extends Scene_Message {
    declare _waitCount: number;
    declare _encounterEffectDuration: number;
    declare _mapLoaded: boolean;
    declare _touchCount: number;
    declare _menuEnabled: boolean;
    declare _transfer: boolean;
    declare _lastMapWasNull: boolean;
    declare menuCalling: boolean;
    declare _spriteset: Spriteset_Map;
    declare _mapNameWindow: Window_MapName;
    declare _menuButton: Sprite_Button;

    constructor(...args: any[]) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();

        this._waitCount = 0;
        this._encounterEffectDuration = 0;
        this._mapLoaded = false;
        this._touchCount = 0;
        this._menuEnabled = false;
    }

    create(): void {
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

    isReady(): boolean {
        if (!this._mapLoaded && DataManager.isMapLoaded()) {
            this.onMapLoaded();
            this._mapLoaded = true;
        }
        return this._mapLoaded && super.isReady();
    }

    onMapLoaded(): void {
        if (this._transfer) {
            $gamePlayer.performTransfer();
        }
        this.createDisplayObjects();
    }

    onTransfer(): void {
        ImageManager.clear();
        EffectManager.clear();
    }

    start(): void {
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

    onTransferEnd(): void {
        this._mapNameWindow.open();
        $gameMap.autoplay();
        if (this.shouldAutosave()) {
            this.requestAutosave();
        }
    }

    shouldAutosave(): boolean {
        return !this._lastMapWasNull;
    }

    update(): void {
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

    updateMainMultiply(): void {
        if (this.isFastForward()) {
            this.cancelMessageWait();
            this.updateMain();
        }
        this.updateMain();
    }

    updateMain(): void {
        $gameMap.update(this.isActive());
        $gamePlayer.update(this.isPlayerActive());
        $gameTimer.update(this.isActive());
        $gameScreen.update();
    }

    isPlayerActive(): boolean {
        return this.isActive() && !this.isFading();
    }

    isFastForward(): boolean {
        return (
            $gameMap.isEventRunning() &&
            !SceneManager.isSceneChanging() &&
            (Input.isLongPressed("ok") || TouchInput.isLongPressed())
        );
    }

    stop(): void {
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

    isBusy(): boolean {
        return (
            this.isMessageWindowClosing() || this._waitCount > 0 || this._encounterEffectDuration > 0 || super.isBusy()
        );
    }

    terminate(): void {
        super.terminate();
        if (!SceneManager.isNextScene(Scene_Battle)) {
            this._spriteset.update();
            this._mapNameWindow.hide();
            this.hideMenuButton();
            SceneManager.snapForBackground();
        }
        $gameScreen.clearZoom();
    }

    needsFadeIn(): boolean {
        return SceneManager.isPreviousScene(Scene_Battle) || SceneManager.isPreviousScene(Scene_Load);
    }

    needsSlowFadeOut(): boolean | null {
        return SceneManager.isNextScene(Scene_Title) || SceneManager.isNextScene(Scene_Gameover);
    }

    updateWaitCount(): boolean {
        if (this._waitCount > 0) {
            this._waitCount--;
            return true;
        }
        return false;
    }

    updateDestination(): void {
        if (this.isMapTouchOk()) {
            this.processMapTouch();
        } else {
            $gameTemp.clearDestination();
            this._touchCount = 0;
        }
    }

    updateMenuButton(): void {
        if (this._menuButton) {
            const menuEnabled = this.isMenuEnabled();
            if (menuEnabled === this._menuEnabled) {
                this._menuButton.visible = this._menuEnabled;
            } else {
                this._menuEnabled = menuEnabled;
            }
        }
    }

    hideMenuButton(): void {
        if (this._menuButton) {
            this._menuButton.visible = false;
            this._menuEnabled = false;
        }
    }

    updateMapNameWindow(): void {
        if ($gameMessage.isBusy()) {
            this._mapNameWindow.close();
        }
    }

    isMenuEnabled(): boolean {
        return $gameSystem.isMenuEnabled() && !$gameMap.isEventRunning();
    }

    isMapTouchOk(): boolean {
        return this.isActive() && $gamePlayer.canMove();
    }

    processMapTouch(): void {
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

    isAnyButtonPressed(): boolean {
        return this._menuButton && this._menuButton.isPressed();
    }

    onMapTouch(): void {
        const x = $gameMap.canvasToMapX(TouchInput.x);
        const y = $gameMap.canvasToMapY(TouchInput.y);
        $gameTemp.setDestination(x, y);
    }

    isSceneChangeOk(): boolean {
        return this.isActive() && !$gameMessage.isBusy();
    }

    updateScene(): void {
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

    createDisplayObjects(): void {
        this.createSpriteset();
        this.createWindowLayer();
        this.createAllWindows();
        this.createButtons();
    }

    createSpriteset(): void {
        this._spriteset = new Spriteset_Map();
        this.addChild(this._spriteset);
        this._spriteset.update();
    }

    createAllWindows(): void {
        this.createMapNameWindow();
        super.createAllWindows();
    }

    createMapNameWindow(): void {
        const rect = this.mapNameWindowRect();
        this._mapNameWindow = new Window_MapName(rect);
        this.addWindow(this._mapNameWindow);
    }

    mapNameWindowRect(): Rectangle {
        const wx = 0;
        const wy = 0;
        const ww = 360;
        const wh = this.calcWindowHeight(1, false);
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createButtons(): void {
        if (ConfigManager.touchUI) {
            this.createMenuButton();
        }
    }

    createMenuButton(): void {
        this._menuButton = new Sprite_Button("menu");
        this._menuButton.x = Graphics.boxWidth - this._menuButton.width - 4;
        this._menuButton.y = this.buttonY();
        this._menuButton.visible = false;
        this.addWindow(this._menuButton);
    }

    updateTransferPlayer(): void {
        if ($gamePlayer.isTransferring()) {
            SceneManager.goto(Scene_Map);
        }
    }

    updateEncounter(): void {
        if ($gamePlayer.executeEncounter()) {
            SceneManager.push(Scene_Battle);
        }
    }

    updateCallMenu(): void {
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

    isMenuCalled(): boolean {
        return Input.isTriggered("menu") || TouchInput.isCancelled();
    }

    callMenu(): void {
        SoundManager.playOk();
        SceneManager.push(Scene_Menu);
        Window_MenuCommand.initCommandPosition();
        $gameTemp.clearDestination();
        this._mapNameWindow.hide();
        this._waitCount = 2;
    }

    updateCallDebug(): void {
        if (this.isDebugCalled()) {
            SceneManager.push(Scene_Debug);
        }
    }

    isDebugCalled(): boolean {
        return Input.isTriggered("debug") && $gameTemp.isPlaytest();
    }

    fadeInForTransfer(): void {
        const fadeType = $gamePlayer.fadeType();
        switch (fadeType) {
            case 0:
            case 1:
                this.startFadeIn(this.fadeSpeed(), fadeType === 1);
                break;
        }
    }

    fadeOutForTransfer(): void {
        const fadeType = $gamePlayer.fadeType();
        switch (fadeType) {
            case 0:
            case 1:
                this.startFadeOut(this.fadeSpeed(), fadeType === 1);
                break;
        }
    }

    launchBattle(): void {
        BattleManager.saveBgmAndBgs();
        this.stopAudioOnBattleStart();
        SoundManager.playBattleStart();
        this.startEncounterEffect();
        this._mapNameWindow.hide();
    }

    stopAudioOnBattleStart(): void {
        if (!AudioManager.isCurrentBgm($gameSystem.battleBgm())) {
            AudioManager.stopBgm();
        }
        AudioManager.stopBgs();
        AudioManager.stopMe();
        AudioManager.stopSe();
    }

    startEncounterEffect(): void {
        this._spriteset.hideCharacters();
        this._encounterEffectDuration = this.encounterEffectSpeed();
    }

    updateEncounterEffect(): void {
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

    snapForBattleBackground(): void {
        this._windowLayer.visible = false;
        SceneManager.snapForBackground();
        this._windowLayer.visible = true;
    }

    startFlashForEncounter(duration: number): void {
        const color = [255, 255, 255, 255];
        $gameScreen.startFlash(color as RMMZ.Color, duration);
    }

    encounterEffectSpeed(): number {
        return 60;
    }
}

/**
 * The superclass of all the menu-type scenes.
 */
class Scene_MenuBase extends Scene_Base {
    declare _actor: Game_Actor;
    declare _backgroundFilter: import("pixi.js").BlurFilter;
    declare _backgroundSprite: Sprite;
    declare _helpWindow: Window_Help;
    declare _cancelButton: Sprite_Button;
    declare _pageupButton: Sprite_Button;
    declare _pagedownButton: Sprite_Button;

    constructor(...args: any[]) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
    }

    create(): void {
        super.create();
        this.createBackground();
        this.updateActor();
        this.createWindowLayer();
        this.createButtons();
    }

    update(): void {
        super.update();
        this.updatePageButtons();
    }

    helpAreaTop(): number {
        if (this.isBottomHelpMode()) {
            return this.mainAreaBottom();
        } else if (this.isBottomButtonMode()) {
            return 0;
        } else {
            return this.buttonAreaBottom();
        }
    }

    helpAreaBottom(): number {
        return this.helpAreaTop() + this.helpAreaHeight();
    }

    helpAreaHeight(): number {
        return this.calcWindowHeight(2, false);
    }

    mainAreaTop(): number {
        if (!this.isBottomHelpMode()) {
            return this.helpAreaBottom();
        } else if (this.isBottomButtonMode()) {
            return 0;
        } else {
            return this.buttonAreaBottom();
        }
    }

    mainAreaBottom(): number {
        return this.mainAreaTop() + this.mainAreaHeight();
    }

    mainAreaHeight(): number {
        return Graphics.boxHeight - this.buttonAreaHeight() - this.helpAreaHeight();
    }

    actor(): Game_Actor {
        return this._actor;
    }

    updateActor(): void {
        this._actor = $gameParty.menuActor();
    }

    createBackground(): void {
        this._backgroundFilter = new PIXI.BlurFilter();
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap()!;
        this._backgroundSprite.filters = [this._backgroundFilter];
        this.addChild(this._backgroundSprite);
        this.setBackgroundOpacity(192);
    }

    setBackgroundOpacity(opacity: number): void {
        this._backgroundSprite.opacity = opacity;
    }

    createHelpWindow(): void {
        const rect = this.helpWindowRect();
        this._helpWindow = new Window_Help(rect);
        this.addWindow(this._helpWindow);
    }

    helpWindowRect(): Rectangle {
        const wx = 0;
        const wy = this.helpAreaTop();
        const ww = Graphics.boxWidth;
        const wh = this.helpAreaHeight();
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createButtons(): void {
        if (ConfigManager.touchUI) {
            if (this.needsCancelButton()) {
                this.createCancelButton();
            }
            if (this.needsPageButtons()) {
                this.createPageButtons();
            }
        }
    }

    needsCancelButton(): boolean {
        return true;
    }

    createCancelButton(): void {
        this._cancelButton = new Sprite_Button("cancel");
        this._cancelButton.x = Graphics.boxWidth - this._cancelButton.width - 4;
        this._cancelButton.y = this.buttonY();
        this.addWindow(this._cancelButton);
    }

    needsPageButtons(): boolean {
        return false;
    }

    createPageButtons(): void {
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

    updatePageButtons(): void {
        if (this._pageupButton && this._pagedownButton) {
            const enabled = this.arePageButtonsEnabled();
            this._pageupButton.visible = enabled;
            this._pagedownButton.visible = enabled;
        }
    }

    arePageButtonsEnabled(): boolean {
        return true;
    }

    nextActor(): void {
        $gameParty.makeMenuActorNext();
        this.updateActor();
        this.onActorChange();
    }

    previousActor(): void {
        $gameParty.makeMenuActorPrevious();
        this.updateActor();
        this.onActorChange();
    }

    onActorChange(): void {
        SoundManager.playCursor();
    }
}

/**
 * The scene class of the menu screen.
 */
class Scene_Menu extends Scene_MenuBase {
    declare _commandWindow: Window_MenuCommand;
    declare _goldWindow: Window_Gold;
    declare _statusWindow: Window_MenuStatus;

    constructor(...args: any[]) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
    }

    helpAreaHeight(): number {
        return 0;
    }

    create(): void {
        super.create();
        this.createCommandWindow();
        this.createGoldWindow();
        this.createStatusWindow();
    }

    start(): void {
        super.start();
        this._statusWindow.refresh();
    }

    createCommandWindow(): void {
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

    commandWindowRect(): Rectangle {
        const ww = this.mainCommandWidth();
        const wh = this.mainAreaHeight() - this.goldWindowRect().height;
        const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
        const wy = this.mainAreaTop();
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createGoldWindow(): void {
        const rect = this.goldWindowRect();
        this._goldWindow = new Window_Gold(rect);
        this.addWindow(this._goldWindow);
    }

    goldWindowRect(): Rectangle {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(1, true);
        const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
        const wy = this.mainAreaBottom() - wh;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createStatusWindow(): void {
        const rect = this.statusWindowRect();
        this._statusWindow = new Window_MenuStatus(rect);
        this.addWindow(this._statusWindow);
    }

    statusWindowRect(): Rectangle {
        const ww = Graphics.boxWidth - this.mainCommandWidth();
        const wh = this.mainAreaHeight();
        const wx = this.isRightInputMode() ? 0 : Graphics.boxWidth - ww;
        const wy = this.mainAreaTop();
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    commandItem(): void {
        SceneManager.push(Scene_Item);
    }

    commandPersonal(): void {
        this._statusWindow.setFormationMode(false);
        this._statusWindow.selectLast();
        this._statusWindow.activate();
        this._statusWindow.setHandler("ok", this.onPersonalOk.bind(this));
        this._statusWindow.setHandler("cancel", this.onPersonalCancel.bind(this));
    }

    commandFormation(): void {
        this._statusWindow.setFormationMode(true);
        this._statusWindow.selectLast();
        this._statusWindow.activate();
        this._statusWindow.setHandler("ok", this.onFormationOk.bind(this));
        this._statusWindow.setHandler("cancel", this.onFormationCancel.bind(this));
    }

    commandOptions(): void {
        SceneManager.push(Scene_Options);
    }

    commandSave(): void {
        SceneManager.push(Scene_Save);
    }

    commandGameEnd(): void {
        SceneManager.push(Scene_GameEnd);
    }

    onPersonalOk(): void {
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

    onPersonalCancel(): void {
        this._statusWindow.deselect();
        this._commandWindow.activate();
    }

    onFormationOk(): void {
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

    onFormationCancel(): void {
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
abstract class Scene_ItemBase extends Scene_MenuBase {
    abstract playSeForItem(): void;
    declare _itemWindow: Window_ItemList | Window_SkillList;

    declare _actorWindow: Window_MenuActor;

    constructor(...args: any[]) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
    }

    create(): void {
        super.create();
    }

    createActorWindow(): void {
        const rect = this.actorWindowRect();
        this._actorWindow = new Window_MenuActor(rect);
        this._actorWindow.setHandler("ok", this.onActorOk.bind(this));
        this._actorWindow.setHandler("cancel", this.onActorCancel.bind(this));
        this.addWindow(this._actorWindow);
    }

    actorWindowRect(): Rectangle {
        const wx = 0;
        const wy = Math.min(this.mainAreaTop(), this.helpAreaTop());
        const ww = Graphics.boxWidth - this.mainCommandWidth();
        const wh = this.mainAreaHeight() + this.helpAreaHeight();
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    item(): RMMZ.ActionItem | null {
        return this._itemWindow.item() as RMMZ.ActionItem | null;
    }

    user(): Game_Actor | null | undefined {
        return null;
    }

    isCursorLeft(): boolean {
        return this._itemWindow.index() % 2 === 0;
    }

    showActorWindow(): void {
        if (this.isCursorLeft()) {
            this._actorWindow.x = Graphics.boxWidth - this._actorWindow.width;
        } else {
            this._actorWindow.x = 0;
        }
        this._actorWindow.show();
        this._actorWindow.activate();
    }

    hideActorWindow(): void {
        this._actorWindow.hide();
        this._actorWindow.deactivate();
    }

    isActorWindowActive(): boolean {
        return this._actorWindow && this._actorWindow.active;
    }

    onActorOk(): void {
        if (this.canUse()) {
            this.useItem();
        } else {
            SoundManager.playBuzzer();
        }
    }

    onActorCancel(): void {
        this.hideActorWindow();
        this.activateItemWindow();
    }

    determineItem(): void {
        const action = new Game_Action(this.user()!);
        const item = this.item();
        action.setItemObject(item);
        if (action.isForFriend()) {
            this.showActorWindow();
            this._actorWindow.selectForItem(this.item()!);
        } else {
            this.useItem();
            this.activateItemWindow();
        }
    }

    useItem(): void {
        this.playSeForItem();
        this.user()!.useItem(this.item()!);
        this.applyItem();
        this.checkCommonEvent();
        this.checkGameover();
        this._actorWindow.refresh();
    }

    activateItemWindow(): void {
        this._itemWindow.refresh();
        this._itemWindow.activate();
    }

    itemTargetActors(): Game_Actor[] {
        const action = new Game_Action(this.user()!);
        action.setItemObject(this.item());
        if (!action.isForFriend()) {
            return [];
        } else if (action.isForAll()) {
            return $gameParty.members();
        } else {
            return [$gameParty.members()[this._actorWindow.index()]];
        }
    }

    canUse(): boolean | null | undefined {
        const user = this.user();
        return user && user.canUse(this.item()) && this.isItemEffectsValid();
    }

    isItemEffectsValid(): boolean {
        const action = new Game_Action(this.user()!);
        action.setItemObject(this.item());
        return this.itemTargetActors().some((target) => action.testApply(target));
    }

    applyItem(): void {
        const action = new Game_Action(this.user()!);
        action.setItemObject(this.item());
        for (const target of this.itemTargetActors()) {
            for (let i = 0; i < action.numRepeats(); i++) {
                action.apply(target);
            }
        }
        action.applyGlobal();
    }

    checkCommonEvent(): void {
        if ($gameTemp.isCommonEventReserved()) {
            SceneManager.goto(Scene_Map);
        }
    }
}

/**
 * The scene class of the item screen.
 */
class Scene_Item extends Scene_ItemBase {
    declare _categoryWindow: Window_ItemCategory;
    declare _itemWindow: Window_ItemList;

    constructor(...args: any[]) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
    }

    create(): void {
        super.create();
        this.createHelpWindow();
        this.createCategoryWindow();
        this.createItemWindow();
        this.createActorWindow();
    }

    createCategoryWindow(): void {
        const rect = this.categoryWindowRect();
        this._categoryWindow = new Window_ItemCategory(rect);
        this._categoryWindow.setHelpWindow(this._helpWindow);
        this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
        this._categoryWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._categoryWindow);
    }

    categoryWindowRect(): Rectangle {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(1, true);
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createItemWindow(): void {
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

    itemWindowRect(): Rectangle {
        const wx = 0;
        const wy = this._categoryWindow.y + this._categoryWindow.height;
        const ww = Graphics.boxWidth;
        const wh = this.mainAreaBottom() - wy;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    user(): Game_Actor | undefined {
        const members = $gameParty.movableMembers();
        const bestPha = Math.max(...members.map((member) => member.pha));
        return members.find((member) => member.pha === bestPha);
    }

    onCategoryOk(): void {
        this._itemWindow.activate();
        this._itemWindow.selectLast();
    }

    onItemOk(): void {
        $gameParty.setLastItem(this.item() as RMMZ.DataItem | null);
        this.determineItem();
    }

    onItemCancel(): void {
        if (this._categoryWindow.needsSelection()) {
            this._itemWindow.deselect();
            this._categoryWindow.activate();
        } else {
            this.popScene();
        }
    }

    playSeForItem(): void {
        SoundManager.playUseItem();
    }

    useItem(): void {
        super.useItem();
        this._itemWindow.redrawCurrentItem();
    }
}

/**
 * The scene class of the skill screen.
 */
class Scene_Skill extends Scene_ItemBase {
    declare item: () => RMMZ.DataSkill | null;
    declare _skillTypeWindow: Window_SkillType;
    declare _statusWindow: Window_SkillStatus;
    declare _itemWindow: Window_SkillList;

    constructor(...args: any[]) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
    }

    create(): void {
        super.create();
        this.createHelpWindow();
        this.createSkillTypeWindow();
        this.createStatusWindow();
        this.createItemWindow();
        this.createActorWindow();
    }

    start(): void {
        super.start();
        this.refreshActor();
    }

    createSkillTypeWindow(): void {
        const rect = this.skillTypeWindowRect();
        this._skillTypeWindow = new Window_SkillType(rect);
        this._skillTypeWindow.setHelpWindow(this._helpWindow);
        this._skillTypeWindow.setHandler("skill", this.commandSkill.bind(this));
        this._skillTypeWindow.setHandler("cancel", this.popScene.bind(this));
        this._skillTypeWindow.setHandler("pagedown", this.nextActor.bind(this));
        this._skillTypeWindow.setHandler("pageup", this.previousActor.bind(this));
        this.addWindow(this._skillTypeWindow);
    }

    skillTypeWindowRect(): Rectangle {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(3, true);
        const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
        const wy = this.mainAreaTop();
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createStatusWindow(): void {
        const rect = this.statusWindowRect();
        this._statusWindow = new Window_SkillStatus(rect);
        this.addWindow(this._statusWindow);
    }

    statusWindowRect(): Rectangle {
        const ww = Graphics.boxWidth - this.mainCommandWidth();
        const wh = this._skillTypeWindow.height;
        const wx = this.isRightInputMode() ? 0 : Graphics.boxWidth - ww;
        const wy = this.mainAreaTop();
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createItemWindow(): void {
        const rect = this.itemWindowRect();
        this._itemWindow = new Window_SkillList(rect);
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
        this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
        this._skillTypeWindow.setSkillWindow(this._itemWindow);
        this.addWindow(this._itemWindow);
    }

    itemWindowRect(): Rectangle {
        const wx = 0;
        const wy = this._statusWindow.y + this._statusWindow.height;
        const ww = Graphics.boxWidth;
        const wh = this.mainAreaHeight() - this._statusWindow.height;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    needsPageButtons(): boolean {
        return true;
    }

    arePageButtonsEnabled(): boolean {
        return !this.isActorWindowActive();
    }

    refreshActor(): void {
        const actor = this.actor();
        this._skillTypeWindow.setActor(actor);
        this._statusWindow.setActor(actor);
        this._itemWindow.setActor(actor);
    }

    user(): Game_Actor {
        return this.actor();
    }

    commandSkill(): void {
        this._itemWindow.activate();
        this._itemWindow.selectLast();
    }

    onItemOk(): void {
        this.actor().setLastMenuSkill(this.item()!);
        this.determineItem();
    }

    onItemCancel(): void {
        this._itemWindow.deselect();
        this._skillTypeWindow.activate();
    }

    playSeForItem(): void {
        SoundManager.playUseSkill();
    }

    useItem(): void {
        super.useItem();
        this._statusWindow.refresh();
        this._itemWindow.refresh();
    }

    onActorChange(): void {
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
    declare _statusWindow: Window_EquipStatus;
    declare _commandWindow: Window_EquipCommand;
    declare _slotWindow: Window_EquipSlot;
    declare _itemWindow: Window_EquipItem;

    constructor(...args: any[]) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
    }

    create(): void {
        super.create();
        this.createHelpWindow();
        this.createStatusWindow();
        this.createCommandWindow();
        this.createSlotWindow();
        this.createItemWindow();
        this.refreshActor();
    }

    createStatusWindow(): void {
        const rect = this.statusWindowRect();
        this._statusWindow = new Window_EquipStatus(rect);
        this.addWindow(this._statusWindow);
    }

    statusWindowRect(): Rectangle {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = this.statusWidth();
        const wh = this.mainAreaHeight();
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createCommandWindow(): void {
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

    commandWindowRect(): Rectangle {
        const wx = this.statusWidth();
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth - this.statusWidth();
        const wh = this.calcWindowHeight(1, true);
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createSlotWindow(): void {
        const rect = this.slotWindowRect();
        this._slotWindow = new Window_EquipSlot(rect);
        this._slotWindow.setHelpWindow(this._helpWindow);
        this._slotWindow.setStatusWindow(this._statusWindow);
        this._slotWindow.setHandler("ok", this.onSlotOk.bind(this));
        this._slotWindow.setHandler("cancel", this.onSlotCancel.bind(this));
        this.addWindow(this._slotWindow);
    }

    slotWindowRect(): Rectangle {
        const commandWindowRect = this.commandWindowRect();
        const wx = this.statusWidth();
        const wy = commandWindowRect.y + commandWindowRect.height;
        const ww = Graphics.boxWidth - this.statusWidth();
        const wh = this.mainAreaHeight() - commandWindowRect.height;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createItemWindow(): void {
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

    itemWindowRect(): Rectangle {
        return this.slotWindowRect();
    }

    statusWidth(): number {
        return 312;
    }

    needsPageButtons(): boolean {
        return true;
    }

    arePageButtonsEnabled(): boolean {
        return !(this._itemWindow && this._itemWindow.active);
    }

    refreshActor(): void {
        const actor = this.actor();
        this._statusWindow.setActor(actor);
        this._slotWindow.setActor(actor);
        this._itemWindow.setActor(actor);
    }

    commandEquip(): void {
        this._slotWindow.activate();
        this._slotWindow.select(0);
    }

    commandOptimize(): void {
        SoundManager.playEquip();
        this.actor().optimizeEquipments();
        this._statusWindow.refresh();
        this._slotWindow.refresh();
        this._commandWindow.activate();
    }

    commandClear(): void {
        SoundManager.playEquip();
        this.actor().clearEquipments();
        this._statusWindow.refresh();
        this._slotWindow.refresh();
        this._commandWindow.activate();
    }

    onSlotOk(): void {
        this._slotWindow.hide();
        this._itemWindow.show();
        this._itemWindow.activate();
        this._itemWindow.forceSelect(0);
    }

    onSlotCancel(): void {
        this._slotWindow.deselect();
        this._commandWindow.activate();
    }

    onItemOk(): void {
        SoundManager.playEquip();
        this.executeEquipChange();
        this.hideItemWindow();
        this._slotWindow.refresh();
        this._itemWindow.refresh();
        this._statusWindow.refresh();
    }

    executeEquipChange(): void {
        const actor = this.actor();
        const slotId = this._slotWindow.index();
        const item = this._itemWindow.item();
        actor.changeEquip(slotId, item! as RMMZ.DataEquipment | null);
    }

    onItemCancel(): void {
        this.hideItemWindow();
    }

    onActorChange(): void {
        super.onActorChange();
        this.refreshActor();
        this.hideItemWindow();
        this._slotWindow.deselect();
        this._slotWindow.deactivate();
        this._commandWindow.activate();
    }

    hideItemWindow(): void {
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
    declare _profileWindow: Window_Help;
    declare _statusWindow: Window_Status;
    declare _statusParamsWindow: Window_StatusParams;
    declare _statusEquipWindow: Window_StatusEquip;

    constructor(...args: any[]) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
    }

    create(): void {
        super.create();
        this.createProfileWindow();
        this.createStatusWindow();
        this.createStatusParamsWindow();
        this.createStatusEquipWindow();
    }

    helpAreaHeight(): number {
        return 0;
    }

    createProfileWindow(): void {
        const rect = this.profileWindowRect();
        this._profileWindow = new Window_Help(rect);
        this.addWindow(this._profileWindow);
    }

    profileWindowRect(): Rectangle {
        const ww = Graphics.boxWidth;
        const wh = this.profileHeight();
        const wx = 0;
        const wy = this.mainAreaBottom() - wh;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createStatusWindow(): void {
        const rect = this.statusWindowRect();
        this._statusWindow = new Window_Status(rect);
        this._statusWindow.setHandler("cancel", this.popScene.bind(this));
        this._statusWindow.setHandler("pagedown", this.nextActor.bind(this));
        this._statusWindow.setHandler("pageup", this.previousActor.bind(this));
        this.addWindow(this._statusWindow);
    }

    statusWindowRect(): Rectangle {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth;
        const wh = this.statusParamsWindowRect().y - wy;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createStatusParamsWindow(): void {
        const rect = this.statusParamsWindowRect();
        this._statusParamsWindow = new Window_StatusParams(rect);
        this.addWindow(this._statusParamsWindow);
    }

    statusParamsWindowRect(): Rectangle {
        const ww = this.statusParamsWidth();
        const wh = this.statusParamsHeight();
        const wx = 0;
        const wy = this.mainAreaBottom() - this.profileHeight() - wh;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createStatusEquipWindow(): void {
        const rect = this.statusEquipWindowRect();
        this._statusEquipWindow = new Window_StatusEquip(rect);
        this.addWindow(this._statusEquipWindow);
    }

    statusEquipWindowRect(): Rectangle {
        const ww = Graphics.boxWidth - this.statusParamsWidth();
        const wh = this.statusParamsHeight();
        const wx = this.statusParamsWidth();
        const wy = this.mainAreaBottom() - this.profileHeight() - wh;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    statusParamsWidth(): number {
        return 300;
    }

    statusParamsHeight(): number {
        return this.calcWindowHeight(6, false);
    }

    profileHeight(): number {
        return this.calcWindowHeight(2, false);
    }

    start(): void {
        super.start();
        this.refreshActor();
    }

    needsPageButtons(): boolean {
        return true;
    }

    refreshActor(): void {
        const actor = this.actor();
        this._profileWindow.setText(actor.profile());
        this._statusWindow.setActor(actor);
        this._statusParamsWindow.setActor(actor);
        this._statusEquipWindow.setActor(actor);
    }

    onActorChange(): void {
        super.onActorChange();
        this.refreshActor();
        this._statusWindow.activate();
    }
}

/**
 * The scene class of the options screen.
 */
class Scene_Options extends Scene_MenuBase {
    declare _optionsWindow: Window_Options;

    constructor(...args: any[]) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
    }

    create(): void {
        super.create();
        this.createOptionsWindow();
    }

    terminate(): void {
        super.terminate();
        ConfigManager.save();
    }

    createOptionsWindow(): void {
        const rect = this.optionsWindowRect();
        this._optionsWindow = new Window_Options(rect);
        this._optionsWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._optionsWindow);
    }

    optionsWindowRect(): Rectangle {
        const n = Math.min(this.maxCommands(), this.maxVisibleCommands());
        const ww = 400;
        const wh = this.calcWindowHeight(n, true);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh) / 2;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    maxCommands(): number {
        // Increase this value when adding option items.
        return 7;
    }

    maxVisibleCommands(): number {
        return 12;
    }
}

/**
 * The superclass of Scene_Save and Scene_Load.
 */
class Scene_File extends Scene_MenuBase {
    declare _listWindow: Window_SavefileList;

    constructor(...args: any[]) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
    }

    create(): void {
        super.create();
        DataManager.loadAllSavefileImages();
        this.createHelpWindow();
        this.createListWindow();
        this._helpWindow.setText(this.helpWindowText());
    }

    helpAreaHeight(): number {
        return 0;
    }

    start(): void {
        super.start();
        this._listWindow.refresh();
    }

    savefileId(): number {
        return this._listWindow.savefileId();
    }

    isSavefileEnabled(savefileId: number): boolean {
        return this._listWindow.isEnabled(savefileId);
    }

    createHelpWindow(): void {
        const rect = this.helpWindowRect();
        this._helpWindow = new Window_Help(rect);
        this.addWindow(this._helpWindow);
    }

    helpWindowRect(): Rectangle {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(1, false);
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createListWindow(): void {
        const rect = this.listWindowRect();
        this._listWindow = new Window_SavefileList(rect);
        this._listWindow.setHandler("ok", this.onSavefileOk.bind(this));
        this._listWindow.setHandler("cancel", this.popScene.bind(this));
        this._listWindow.setMode(this.mode()!, this.needsAutosave());
        this._listWindow.selectSavefile(this.firstSavefileId());
        this._listWindow.refresh();
        this.addWindow(this._listWindow);
    }

    listWindowRect(): Rectangle {
        const wx = 0;
        const wy = this.mainAreaTop() + this._helpWindow.height;
        const ww = Graphics.boxWidth;
        const wh = this.mainAreaHeight() - this._helpWindow.height;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    mode(): "save" | "load" | null {
        return null;
    }

    needsAutosave(): boolean {
        return $gameSystem.isAutosaveEnabled();
    }

    activateListWindow(): void {
        this._listWindow.activate();
    }

    helpWindowText(): string {
        return "";
    }

    firstSavefileId(): number {
        return 0;
    }

    onSavefileOk(): void {
        //
    }
}

/**
 * The scene class of the save screen.
 */
class Scene_Save extends Scene_File {
    constructor(...args: any[]) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
    }

    mode(): "save" {
        return "save";
    }

    helpWindowText(): string {
        return TextManager.saveMessage;
    }

    firstSavefileId(): number {
        return $gameSystem.savefileId();
    }

    onSavefileOk(): void {
        super.onSavefileOk();
        const savefileId = this.savefileId();
        if (this.isSavefileEnabled(savefileId)) {
            this.executeSave(savefileId);
        } else {
            this.onSaveFailure();
        }
    }

    executeSave(savefileId: number): void {
        $gameSystem.setSavefileId(savefileId);
        $gameSystem.onBeforeSave();
        DataManager.saveGame(savefileId)
            .then(() => this.onSaveSuccess())
            .catch(() => this.onSaveFailure());
    }

    onSaveSuccess(): void {
        SoundManager.playSave();
        this.popScene();
    }

    onSaveFailure(): void {
        SoundManager.playBuzzer();
        this.activateListWindow();
    }
}

/**
 * The scene class of the load screen.
 */
class Scene_Load extends Scene_File {
    declare _loadSuccess: boolean;

    constructor(...args: any[]) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();

        this._loadSuccess = false;
    }

    terminate(): void {
        super.terminate();
        if (this._loadSuccess) {
            $gameSystem.onAfterLoad();
        }
    }

    mode(): "load" {
        return "load";
    }

    helpWindowText(): string {
        return TextManager.loadMessage;
    }

    firstSavefileId(): number {
        return DataManager.latestSavefileId();
    }

    onSavefileOk(): void {
        super.onSavefileOk();
        const savefileId = this.savefileId();
        if (this.isSavefileEnabled(savefileId)) {
            this.executeLoad(savefileId);
        } else {
            this.onLoadFailure();
        }
    }

    executeLoad(savefileId: number): void {
        DataManager.loadGame(savefileId)
            .then(() => this.onLoadSuccess())
            .catch(() => this.onLoadFailure());
    }

    onLoadSuccess(): void {
        SoundManager.playLoad();
        this.fadeOutAll();
        this.reloadMapIfUpdated();
        SceneManager.goto(Scene_Map);
        this._loadSuccess = true;
    }

    onLoadFailure(): void {
        SoundManager.playBuzzer();
        this.activateListWindow();
    }

    reloadMapIfUpdated(): void {
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
    declare _commandWindow: Window_GameEnd;

    constructor(...args: any[]) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
    }

    create(): void {
        super.create();
        this.createCommandWindow();
    }

    stop(): void {
        super.stop();
        this._commandWindow.close();
    }

    createBackground(): void {
        super.createBackground();
        this.setBackgroundOpacity(128);
    }

    createCommandWindow(): void {
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_GameEnd(rect);
        this._commandWindow.setHandler("toTitle", this.commandToTitle.bind(this));
        this._commandWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._commandWindow);
    }

    commandWindowRect(): Rectangle {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(2, true);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - wh) / 2;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    commandToTitle(): void {
        this.fadeOutAll();
        SceneManager.goto(Scene_Title);
        Window_TitleCommand.initCommandPosition();
    }
}

/**
 * The scene class of the shop screen.
 */
class Scene_Shop extends Scene_MenuBase {
    declare _goods: RMMZ.ShopGoodsEntry[];
    declare _purchaseOnly: boolean;
    declare _item: RMMZ.InventoryItem | null;
    declare _goldWindow: Window_Gold;
    declare _commandWindow: Window_ShopCommand;
    declare _dummyWindow: Window_Base;
    declare _numberWindow: Window_ShopNumber;
    declare _statusWindow: Window_ShopStatus;
    declare _buyWindow: Window_ShopBuy;
    declare _categoryWindow: Window_ItemCategory;
    declare _sellWindow: Window_ShopSell;

    constructor(...args: any[]) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
    }

    prepare(goods: RMMZ.ShopGoodsEntry[], purchaseOnly: boolean): void {
        this._goods = goods;
        this._purchaseOnly = purchaseOnly;
        this._item = null;
    }

    create(): void {
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

    createGoldWindow(): void {
        const rect = this.goldWindowRect();
        this._goldWindow = new Window_Gold(rect);
        this.addWindow(this._goldWindow);
    }

    goldWindowRect(): Rectangle {
        const ww = this.mainCommandWidth();
        const wh = this.calcWindowHeight(1, true);
        const wx = Graphics.boxWidth - ww;
        const wy = this.mainAreaTop();
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createCommandWindow(): void {
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_ShopCommand(rect);
        this._commandWindow.setPurchaseOnly(this._purchaseOnly);
        this._commandWindow.y = this.mainAreaTop();
        this._commandWindow.setHandler("buy", this.commandBuy.bind(this));
        this._commandWindow.setHandler("sell", this.commandSell.bind(this));
        this._commandWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._commandWindow);
    }

    commandWindowRect(): Rectangle {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = this._goldWindow.x;
        const wh = this.calcWindowHeight(1, true);
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createDummyWindow(): void {
        const rect = this.dummyWindowRect();
        this._dummyWindow = new Window_Base(rect);
        this.addWindow(this._dummyWindow);
    }

    dummyWindowRect(): Rectangle {
        const wx = 0;
        const wy = this._commandWindow.y + this._commandWindow.height;
        const ww = Graphics.boxWidth;
        const wh = this.mainAreaHeight() - this._commandWindow.height;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createNumberWindow(): void {
        const rect = this.numberWindowRect();
        this._numberWindow = new Window_ShopNumber(rect);
        this._numberWindow.hide();
        this._numberWindow.setHandler("ok", this.onNumberOk.bind(this));
        this._numberWindow.setHandler("cancel", this.onNumberCancel.bind(this));
        this.addWindow(this._numberWindow);
    }

    numberWindowRect(): Rectangle {
        const wx = 0;
        const wy = this._dummyWindow.y;
        const ww = Graphics.boxWidth - this.statusWidth();
        const wh = this._dummyWindow.height;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createStatusWindow(): void {
        const rect = this.statusWindowRect();
        this._statusWindow = new Window_ShopStatus(rect);
        this._statusWindow.hide();
        this.addWindow(this._statusWindow);
    }

    statusWindowRect(): Rectangle {
        const ww = this.statusWidth();
        const wh = this._dummyWindow.height;
        const wx = Graphics.boxWidth - ww;
        const wy = this._dummyWindow.y;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createBuyWindow(): void {
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

    buyWindowRect(): Rectangle {
        const wx = 0;
        const wy = this._dummyWindow.y;
        const ww = Graphics.boxWidth - this.statusWidth();
        const wh = this._dummyWindow.height;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createCategoryWindow(): void {
        const rect = this.categoryWindowRect();
        this._categoryWindow = new Window_ItemCategory(rect);
        this._categoryWindow.setHelpWindow(this._helpWindow);
        this._categoryWindow.hide();
        this._categoryWindow.deactivate();
        this._categoryWindow.setHandler("ok", this.onCategoryOk.bind(this));
        this._categoryWindow.setHandler("cancel", this.onCategoryCancel.bind(this));
        this.addWindow(this._categoryWindow);
    }

    categoryWindowRect(): Rectangle {
        const wx = 0;
        const wy = this._dummyWindow.y;
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(1, true);
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createSellWindow(): void {
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

    sellWindowRect(): Rectangle {
        const wx = 0;
        const wy = this._categoryWindow.y + this._categoryWindow.height;
        const ww = Graphics.boxWidth;
        const wh = this.mainAreaHeight() - this._commandWindow.height - this._categoryWindow.height;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    statusWidth(): number {
        return 352;
    }

    activateBuyWindow(): void {
        this._buyWindow.setMoney(this.money());
        this._buyWindow.show();
        this._buyWindow.activate();
        this._statusWindow.show();
    }

    activateSellWindow(): void {
        if (this._categoryWindow.needsSelection()) {
            this._categoryWindow.show();
        }
        this._sellWindow.refresh();
        this._sellWindow.show();
        this._sellWindow.activate();
        this._statusWindow.hide();
    }

    commandBuy(): void {
        this._dummyWindow.hide();
        this.activateBuyWindow();
    }

    commandSell(): void {
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

    onBuyOk(): void {
        this._item = this._buyWindow.item();
        this._buyWindow.hide();
        this._numberWindow.setup(this._item!, this.maxBuy(), this.buyingPrice());
        this._numberWindow.setCurrencyUnit(this.currencyUnit());
        this._numberWindow.show();
        this._numberWindow.activate();
    }

    onBuyCancel(): void {
        this._commandWindow.activate();
        this._dummyWindow.show();
        this._buyWindow.hide();
        this._statusWindow.hide();
        this._statusWindow.setItem(null);
        this._helpWindow.clear();
    }

    onCategoryOk(): void {
        this.activateSellWindow();
        this._sellWindow.select(0);
        this._sellWindow.setTopRow(0);
    }

    onCategoryCancel(): void {
        this._commandWindow.activate();
        this._dummyWindow.show();
        this._categoryWindow.hide();
        this._sellWindow.hide();
    }

    onSellOk(): void {
        this._item = this._sellWindow.item();
        this._categoryWindow.hide();
        this._sellWindow.hide();
        this._numberWindow.setup(this._item!, this.maxSell(), this.sellingPrice());
        this._numberWindow.setCurrencyUnit(this.currencyUnit());
        this._numberWindow.show();
        this._numberWindow.activate();
        this._statusWindow.setItem(this._item!);
        this._statusWindow.show();
    }

    onSellCancel(): void {
        this._sellWindow.deselect();
        this._statusWindow.setItem(null);
        this._helpWindow.clear();
        if (this._categoryWindow.needsSelection()) {
            this._categoryWindow.activate();
        } else {
            this.onCategoryCancel();
        }
    }

    onNumberOk(): void {
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

    onNumberCancel(): void {
        SoundManager.playCancel();
        this.endNumberInput();
    }

    doBuy(number: number): void {
        $gameParty.loseGold(number * this.buyingPrice());
        $gameParty.gainItem(this._item, number);
    }

    doSell(number: number): void {
        $gameParty.gainGold(number * this.sellingPrice());
        $gameParty.loseItem(this._item, number);
    }

    endNumberInput(): void {
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

    maxBuy(): number {
        const num = $gameParty.numItems(this._item);
        const max = $gameParty.maxItems(this._item!) - num;
        const price = this.buyingPrice();
        if (price > 0) {
            return Math.min(max, Math.floor(this.money() / price));
        } else {
            return max;
        }
    }

    maxSell(): number {
        return $gameParty.numItems(this._item);
    }

    money(): number {
        return this._goldWindow.value();
    }

    currencyUnit(): string {
        return this._goldWindow.currencyUnit();
    }

    buyingPrice(): number {
        return this._buyWindow.price(this._item!);
    }

    sellingPrice(): number {
        return Math.floor(this._item!.price / 2);
    }
}

/**
 * The scene class of the name input screen.
 */
class Scene_Name extends Scene_MenuBase {
    declare _actorId: number;
    declare _maxLength: number;
    declare _editWindow: Window_NameEdit;
    declare _inputWindow: Window_NameInput;

    constructor(...args: any[]) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
    }

    prepare(actorId: RMMZ.ActorID, maxLength: number): void {
        this._actorId = actorId;
        this._maxLength = maxLength;
    }

    create(): void {
        super.create();
        this._actor = $gameActors.actor(this._actorId)!;
        this.createEditWindow();
        this.createInputWindow();
    }

    start(): void {
        super.start();
        this._editWindow.refresh();
    }

    createEditWindow(): void {
        const rect = this.editWindowRect();
        this._editWindow = new Window_NameEdit(rect);
        this._editWindow.setup(this._actor, this._maxLength);
        this.addWindow(this._editWindow);
    }

    editWindowRect(): Rectangle {
        const inputWindowHeight = this.calcWindowHeight(9, true);
        const padding = $gameSystem.windowPadding();
        const ww = 600;
        const wh = ImageManager.standardFaceHeight + padding * 2;
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = (Graphics.boxHeight - (wh + inputWindowHeight + 8)) / 2;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createInputWindow(): void {
        const rect = this.inputWindowRect();
        this._inputWindow = new Window_NameInput(rect);
        this._inputWindow.setEditWindow(this._editWindow);
        this._inputWindow.setHandler("ok", this.onInputOk.bind(this));
        this.addWindow(this._inputWindow);
    }

    inputWindowRect(): Rectangle {
        const wx = this._editWindow.x;
        const wy = this._editWindow.y + this._editWindow.height + 8;
        const ww = this._editWindow.width;
        const wh = this.calcWindowHeight(9, true);
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    onInputOk(): void {
        this._actor.setName(this._editWindow.inputName());
        this.popScene();
    }
}

/**
 * The scene class of the debug screen.
 */
class Scene_Debug extends Scene_MenuBase {
    declare _rangeWindow: Window_DebugRange;
    declare _editWindow: Window_DebugEdit;
    declare _debugHelpWindow: Window_Base;

    constructor(...args: any[]) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
    }

    create(): void {
        super.create();
        this.createRangeWindow();
        this.createEditWindow();
        this.createDebugHelpWindow();
    }

    needsCancelButton(): boolean {
        return false;
    }

    createRangeWindow(): void {
        const rect = this.rangeWindowRect();
        this._rangeWindow = new Window_DebugRange(rect);
        this._rangeWindow.setHandler("ok", this.onRangeOk.bind(this));
        this._rangeWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._rangeWindow);
    }

    rangeWindowRect(): Rectangle {
        const wx = 0;
        const wy = 0;
        const ww = 246;
        const wh = Graphics.boxHeight;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createEditWindow(): void {
        const rect = this.editWindowRect();
        this._editWindow = new Window_DebugEdit(rect);
        this._editWindow.setHandler("cancel", this.onEditCancel.bind(this));
        this._rangeWindow.setEditWindow(this._editWindow);
        this.addWindow(this._editWindow);
    }

    editWindowRect(): Rectangle {
        const wx = this._rangeWindow.width;
        const wy = 0;
        const ww = Graphics.boxWidth - wx;
        const wh = this.calcWindowHeight(10, true);
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createDebugHelpWindow(): void {
        const rect = this.debugHelpWindowRect();
        this._debugHelpWindow = new Window_Base(rect);
        this.addWindow(this._debugHelpWindow);
    }

    debugHelpWindowRect(): Rectangle {
        const wx = this._editWindow.x;
        const wy = this._editWindow.height;
        const ww = this._editWindow.width;
        const wh = Graphics.boxHeight - wy;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    onRangeOk(): void {
        this._editWindow.activate();
        this._editWindow.select(0);
        this.refreshHelpWindow();
    }

    onEditCancel(): void {
        this._rangeWindow.activate();
        this._editWindow.deselect();
        this.refreshHelpWindow();
    }

    refreshHelpWindow(): void {
        const helpWindow = this._debugHelpWindow;
        helpWindow.contents.clear();
        if (this._editWindow.active) {
            const rect = helpWindow.baseTextRect();
            helpWindow.drawTextEx(this.helpText(), rect.x, rect.y, rect.width);
        }
    }

    helpText(): string {
        if (this._rangeWindow.mode() === "switch") {
            return "Enter : ON / OFF";
        } else {
            return "Left     :  -1    Pageup   : -10\n" + "Right    :  +1    Pagedown : +10";
        }
    }
}

/**
 * The scene class of the battle screen.
 */
class Scene_Battle extends Scene_Message {
    declare _spriteset: Spriteset_Battle;
    declare _logWindow: Window_BattleLog;
    declare _statusWindow: Window_BattleStatus;
    declare _partyCommandWindow: Window_PartyCommand;
    declare _actorCommandWindow: Window_ActorCommand;
    declare _helpWindow: Window_Help;
    declare _skillWindow: Window_BattleSkill;
    declare _itemWindow: Window_BattleItem;
    declare _actorWindow: Window_BattleActor;
    declare _enemyWindow: Window_BattleEnemy;
    declare _cancelButton: Sprite_Button;

    constructor(...args: any[]) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
    }

    create(): void {
        super.create();
        this.createDisplayObjects();
    }

    start(): void {
        super.start();
        BattleManager.playBattleBgm();
        BattleManager.startBattle();
        this._statusWindow.refresh();
        this.startFadeIn(this.fadeSpeed(), false);
    }

    update(): void {
        const active = this.isActive();
        $gameTimer.update(active);
        $gameScreen.update();
        this.updateVisibility();
        if (active && !this.isBusy()) {
            this.updateBattleProcess();
        }
        super.update();
    }

    updateVisibility(): void {
        this.updateLogWindowVisibility();
        this.updateStatusWindowVisibility();
        this.updateInputWindowVisibility();
        this.updateCancelButton();
    }

    updateBattleProcess(): void {
        BattleManager.update(this.isTimeActive());
    }

    isTimeActive(): boolean {
        if (BattleManager.isActiveTpb()) {
            return !this._skillWindow.active && !this._itemWindow.active;
        } else {
            return !this.isAnyInputWindowActive();
        }
    }

    isAnyInputWindowActive(): boolean {
        return (
            this._partyCommandWindow.active ||
            this._actorCommandWindow.active ||
            this._skillWindow.active ||
            this._itemWindow.active ||
            this._actorWindow.active ||
            this._enemyWindow.active
        );
    }

    changeInputWindow(): void {
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

    stop(): void {
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

    terminate(): void {
        super.terminate();
        $gameParty.onBattleEnd();
        $gameTroop.onBattleEnd();
        AudioManager.stopMe();
        if (this.shouldAutosave()) {
            this.requestAutosave();
        }
    }

    shouldAutosave(): boolean | null {
        return SceneManager.isNextScene(Scene_Map);
    }

    needsSlowFadeOut(): boolean | null {
        return SceneManager.isNextScene(Scene_Title) || SceneManager.isNextScene(Scene_Gameover);
    }

    updateLogWindowVisibility(): void {
        this._logWindow.visible = !this._helpWindow.visible;
    }

    updateStatusWindowVisibility(): void {
        if ($gameMessage.isBusy()) {
            this._statusWindow.close();
        } else if (this.shouldOpenStatusWindow()) {
            this._statusWindow.open();
        }
        this.updateStatusWindowPosition();
    }

    shouldOpenStatusWindow(): boolean {
        return this.isActive() && !this.isMessageWindowClosing() && !BattleManager.isBattleEnd();
    }

    updateStatusWindowPosition(): void {
        const statusWindow = this._statusWindow;
        const targetX = this.statusWindowX();
        if (statusWindow.x < targetX) {
            statusWindow.x = Math.min(statusWindow.x + 16, targetX);
        }
        if (statusWindow.x > targetX) {
            statusWindow.x = Math.max(statusWindow.x - 16, targetX);
        }
    }

    statusWindowX(): number {
        if (this.isAnyInputWindowActive()) {
            return this.statusWindowRect().x;
        } else {
            return this._partyCommandWindow.width / 2;
        }
    }

    updateInputWindowVisibility(): void {
        if ($gameMessage.isBusy()) {
            this.closeCommandWindows();
            this.hideSubInputWindows();
        } else if (this.needsInputWindowChange()) {
            this.changeInputWindow();
        }
    }

    needsInputWindowChange(): boolean {
        const windowActive = this.isAnyInputWindowActive();
        const inputting = BattleManager.isInputting();
        if (windowActive && inputting) {
            return this._actorCommandWindow.actor() !== BattleManager.actor();
        }
        return windowActive !== inputting;
    }

    updateCancelButton(): void {
        if (this._cancelButton) {
            this._cancelButton.visible = this.isAnyInputWindowActive() && !this._partyCommandWindow.active;
        }
    }

    createDisplayObjects(): void {
        this.createSpriteset();
        this.createWindowLayer();
        this.createAllWindows();
        this.createButtons();
        BattleManager.setLogWindow(this._logWindow);
        BattleManager.setSpriteset(this._spriteset);
        this._logWindow.setSpriteset(this._spriteset);
    }

    createSpriteset(): void {
        this._spriteset = new Spriteset_Battle();
        this.addChild(this._spriteset);
    }

    createAllWindows(): void {
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

    createLogWindow(): void {
        const rect = this.logWindowRect();
        this._logWindow = new Window_BattleLog(rect);
        this.addWindow(this._logWindow);
    }

    logWindowRect(): Rectangle {
        const wx = 0;
        const wy = 0;
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(10, false);
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createStatusWindow(): void {
        const rect = this.statusWindowRect();
        const statusWindow = new Window_BattleStatus(rect);
        this.addWindow(statusWindow);
        this._statusWindow = statusWindow;
    }

    statusWindowRect(): Rectangle {
        const extra = 10;
        const ww = Graphics.boxWidth - 192;
        const wh = this.windowAreaHeight() + extra;
        const wx = this.isRightInputMode() ? 0 : Graphics.boxWidth - ww;
        const wy = Graphics.boxHeight - wh + extra - 4;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createPartyCommandWindow(): void {
        const rect = this.partyCommandWindowRect();
        const commandWindow = new Window_PartyCommand(rect);
        commandWindow.setHandler("fight", this.commandFight.bind(this));
        commandWindow.setHandler("escape", this.commandEscape.bind(this));
        commandWindow.deselect();
        this.addWindow(commandWindow);
        this._partyCommandWindow = commandWindow;
    }

    partyCommandWindowRect(): Rectangle {
        const ww = 192;
        const wh = this.windowAreaHeight();
        const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
        const wy = Graphics.boxHeight - wh;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createActorCommandWindow(): void {
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

    actorCommandWindowRect(): Rectangle {
        const ww = 192;
        const wh = this.windowAreaHeight();
        const wx = this.isRightInputMode() ? Graphics.boxWidth - ww : 0;
        const wy = Graphics.boxHeight - wh;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createHelpWindow(): void {
        const rect = this.helpWindowRect();
        this._helpWindow = new Window_Help(rect);
        this._helpWindow.hide();
        this.addWindow(this._helpWindow);
    }

    helpWindowRect(): Rectangle {
        const wx = 0;
        const wy = this.helpAreaTop();
        const ww = Graphics.boxWidth;
        const wh = this.helpAreaHeight();
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createSkillWindow(): void {
        const rect = this.skillWindowRect();
        this._skillWindow = new Window_BattleSkill(rect);
        this._skillWindow.setHelpWindow(this._helpWindow);
        this._skillWindow.setHandler("ok", this.onSkillOk.bind(this));
        this._skillWindow.setHandler("cancel", this.onSkillCancel.bind(this));
        this.addWindow(this._skillWindow);
    }

    skillWindowRect(): Rectangle {
        const ww = Graphics.boxWidth;
        const wh = this.windowAreaHeight();
        const wx = 0;
        const wy = Graphics.boxHeight - wh;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    createItemWindow(): void {
        const rect = this.itemWindowRect();
        this._itemWindow = new Window_BattleItem(rect);
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
        this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
        this.addWindow(this._itemWindow);
    }

    itemWindowRect(): Rectangle {
        return this.skillWindowRect();
    }

    createActorWindow(): void {
        const rect = this.actorWindowRect();
        this._actorWindow = new Window_BattleActor(rect);
        this._actorWindow.setHandler("ok", this.onActorOk.bind(this));
        this._actorWindow.setHandler("cancel", this.onActorCancel.bind(this));
        this.addWindow(this._actorWindow);
    }

    actorWindowRect(): Rectangle {
        return this.statusWindowRect();
    }

    createEnemyWindow(): void {
        const rect = this.enemyWindowRect();
        this._enemyWindow = new Window_BattleEnemy(rect);
        this._enemyWindow.setHandler("ok", this.onEnemyOk.bind(this));
        this._enemyWindow.setHandler("cancel", this.onEnemyCancel.bind(this));
        this.addWindow(this._enemyWindow);
    }

    enemyWindowRect(): Rectangle {
        const wx = this._statusWindow.x;
        const ww = this._statusWindow.width;
        const wh = this.windowAreaHeight();
        const wy = Graphics.boxHeight - wh;
        return new PIXI.Rectangle(wx, wy, ww, wh);
    }

    helpAreaTop(): number {
        return 0;
    }

    helpAreaBottom(): number {
        return this.helpAreaTop() + this.helpAreaHeight();
    }

    helpAreaHeight(): number {
        return this.calcWindowHeight(2, false);
    }

    buttonAreaTop(): number {
        return this.helpAreaBottom();
    }

    windowAreaHeight(): number {
        return this.calcWindowHeight(4, true);
    }

    createButtons(): void {
        if (ConfigManager.touchUI) {
            this.createCancelButton();
        }
    }

    createCancelButton(): void {
        this._cancelButton = new Sprite_Button("cancel");
        this._cancelButton.x = Graphics.boxWidth - this._cancelButton.width - 4;
        this._cancelButton.y = this.buttonY();
        this.addWindow(this._cancelButton);
    }

    closeCommandWindows(): void {
        this._partyCommandWindow.deactivate();
        this._actorCommandWindow.deactivate();
        this._partyCommandWindow.close();
        this._actorCommandWindow.close();
    }

    hideSubInputWindows(): void {
        this._actorWindow.deactivate();
        this._enemyWindow.deactivate();
        this._skillWindow.deactivate();
        this._itemWindow.deactivate();
        this._actorWindow.hide();
        this._enemyWindow.hide();
        this._skillWindow.hide();
        this._itemWindow.hide();
    }

    startPartyCommandSelection(): void {
        this._statusWindow.deselect();
        this._statusWindow.show();
        this._statusWindow.open();
        this._actorCommandWindow.setup(null);
        this._actorCommandWindow.close();
        this._partyCommandWindow.setup();
    }

    commandFight(): void {
        this.selectNextCommand();
    }

    commandEscape(): void {
        BattleManager.processEscape();
        this.changeInputWindow();
    }

    startActorCommandSelection(): void {
        this._statusWindow.show();
        this._statusWindow.selectActor(BattleManager.actor());
        this._partyCommandWindow.close();
        this._actorCommandWindow.show();
        this._actorCommandWindow.setup(BattleManager.actor());
    }

    commandAttack(): void {
        const action = BattleManager.inputtingAction();
        action!.setAttack();
        this.onSelectAction();
    }

    commandSkill(): void {
        this._skillWindow.setActor(BattleManager.actor()!);
        this._skillWindow.setStypeId(this._actorCommandWindow.currentExt()!);
        this._skillWindow.refresh();
        this._skillWindow.show();
        this._skillWindow.activate();
        this._statusWindow.hide();
        this._actorCommandWindow.hide();
    }

    commandGuard(): void {
        const action = BattleManager.inputtingAction();
        action!.setGuard();
        this.onSelectAction();
    }

    commandItem(): void {
        this._itemWindow.refresh();
        this._itemWindow.show();
        this._itemWindow.activate();
        this._statusWindow.hide();
        this._actorCommandWindow.hide();
    }

    commandCancel(): void {
        this.selectPreviousCommand();
    }

    selectNextCommand(): void {
        BattleManager.selectNextCommand();
        this.changeInputWindow();
    }

    selectPreviousCommand(): void {
        BattleManager.selectPreviousCommand();
        this.changeInputWindow();
    }

    startActorSelection(): void {
        this._actorWindow.refresh();
        this._actorWindow.show();
        this._actorWindow.activate();
    }

    onActorOk(): void {
        const action = BattleManager.inputtingAction();
        action!.setTarget(this._actorWindow.index());
        this.hideSubInputWindows();
        this.selectNextCommand();
    }

    onActorCancel(): void {
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

    startEnemySelection(): void {
        this._enemyWindow.refresh();
        this._enemyWindow.show();
        this._enemyWindow.select(0);
        this._enemyWindow.activate();
        this._statusWindow.hide();
    }

    onEnemyOk(): void {
        const action = BattleManager.inputtingAction();
        action!.setTarget(this._enemyWindow.enemyIndex());
        this.hideSubInputWindows();
        this.selectNextCommand();
    }

    onEnemyCancel(): void {
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

    onSkillOk(): void {
        const skill = this._skillWindow.item();
        const action = BattleManager.inputtingAction();
        action!.setSkill(skill!.id);
        BattleManager.actor()!.setLastBattleSkill(skill);
        this.onSelectAction();
    }

    onSkillCancel(): void {
        this._skillWindow.hide();
        this._statusWindow.show();
        this._actorCommandWindow.show();
        this._actorCommandWindow.activate();
    }

    onItemOk(): void {
        const item = this._itemWindow.item();
        const action = BattleManager.inputtingAction();
        action!.setItem(item!.id);
        $gameParty.setLastItem(item);
        this.onSelectAction();
    }

    onItemCancel(): void {
        this._itemWindow.hide();
        this._statusWindow.show();
        this._actorCommandWindow.show();
        this._actorCommandWindow.activate();
    }

    onSelectAction(): void {
        const action = BattleManager.inputtingAction();
        if (!action!.needsSelection()) {
            this.selectNextCommand();
        } else if (action!.isForOpponent()) {
            this.startEnemySelection();
        } else {
            this.startActorSelection();
        }
    }

    endCommandSelection(): void {
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
    declare _backSprite: Sprite;

    constructor(...args: any[]) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
    }

    create(): void {
        super.create();
        this.playGameoverMusic();
        this.createBackground();
    }

    start(): void {
        super.start();
        this.adjustBackground();
        this.startFadeIn(this.slowFadeSpeed(), false);
    }

    update(): void {
        if (this.isActive() && !this.isBusy() && this.isTriggered()) {
            this.gotoTitle();
        }
        super.update();
    }

    stop(): void {
        super.stop();
        this.fadeOutAll();
    }

    terminate(): void {
        super.terminate();
        AudioManager.stopAll();
    }

    playGameoverMusic(): void {
        AudioManager.stopBgm();
        AudioManager.stopBgs();
        AudioManager.playMe($dataSystem.gameoverMe);
    }

    createBackground(): void {
        this._backSprite = new Sprite();
        this._backSprite.bitmap = ImageManager.loadSystem("GameOver");
        this.addChild(this._backSprite);
    }

    adjustBackground(): void {
        this.scaleSprite(this._backSprite);
        this.centerSprite(this._backSprite);
    }

    isTriggered(): boolean {
        return Input.isTriggered("ok") || TouchInput.isTriggered();
    }

    gotoTitle(): void {
        SceneManager.goto(Scene_Title);
    }
}
