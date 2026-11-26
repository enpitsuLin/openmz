// Auto-generated from JSDoc in src/js/rmmz_scenes.js via `pnpm build:types`. Do not edit manually.

/**
 * The superclass of all scenes within the game.
 */
declare class Scene_Base extends Stage {
    /** @type {boolean} */
    _started: boolean | undefined;
    /** @type {boolean} */
    _active: boolean | undefined;
    /** @type {number} */
    _fadeSign: number | undefined;
    /** @type {number} */
    _fadeDuration: number | undefined;
    /** @type {number | boolean} */
    _fadeWhite: number | boolean | undefined;
    /** @type {number} */
    _fadeOpacity: number | undefined;
    /** @returns {void} */
    create(): void;
    /** @returns {boolean} */
    isActive(): boolean;
    /** @returns {boolean} */
    isReady(): boolean;
    /** @returns {void} */
    start(): void;
    /** @returns {void} */
    update(): void;
    /** @returns {void} */
    stop(): void;
    /** @returns {boolean} */
    isStarted(): boolean;
    /** @returns {boolean} */
    isBusy(): boolean;
    /** @returns {boolean} */
    isFading(): boolean;
    /** @returns {void} */
    terminate(): void;
    /** @returns {void} */
    createWindowLayer(): void;
    _windowLayer: WindowLayer | undefined;
    /**
     * @param {import("pixi.js").Container} window
     * @returns {void}
     */
    addWindow(window: import("pixi.js").Container): void;
    /**
     * @param {number} duration
     * @param {number | boolean} [white]
     * @returns {void}
     */
    startFadeIn(duration: number, white?: number | boolean): void;
    /**
     * @param {number} duration
     * @param {number | boolean} [white]
     * @returns {void}
     */
    startFadeOut(duration: number, white?: number | boolean): void;
    /** @returns {void} */
    createColorFilter(): void;
    _colorFilter: ColorFilter | undefined;
    /** @returns {void} */
    updateColorFilter(): void;
    /** @returns {void} */
    updateFade(): void;
    /** @returns {void} */
    updateChildren(): void;
    /** @returns {void} */
    popScene(): void;
    /** @returns {void} */
    checkGameover(): void;
    /** @returns {void} */
    fadeOutAll(): void;
    /** @returns {number} */
    fadeSpeed(): number;
    /** @returns {number} */
    slowFadeSpeed(): number;
    /**
     * @param {Sprite} sprite
     * @returns {void}
     */
    scaleSprite(sprite: Sprite): void;
    /**
     * @param {Sprite} sprite
     * @returns {void}
     */
    centerSprite(sprite: Sprite): void;
    /** @returns {boolean} */
    isBottomHelpMode(): boolean;
    /** @returns {boolean} */
    isBottomButtonMode(): boolean;
    /** @returns {boolean} */
    isRightInputMode(): boolean;
    /** @returns {number} */
    mainCommandWidth(): number;
    /** @returns {number} */
    buttonAreaTop(): number;
    /** @returns {number} */
    buttonAreaBottom(): number;
    /** @returns {number} */
    buttonAreaHeight(): number;
    /** @returns {number} */
    buttonY(): number;
    /**
     * @param {number} numLines
     * @param {boolean} selectable
     * @returns {number}
     */
    calcWindowHeight(numLines: number, selectable: boolean): number;
    /** @returns {void} */
    requestAutosave(): void;
    /** @returns {boolean} */
    isAutosaveEnabled(): boolean;
    /** @returns {void} */
    executeAutosave(): void;
    /** @returns {void} */
    onAutosaveSuccess(): void;
    /** @returns {void} */
    onAutosaveFailure(): void;
}
/**
 * The scene class for initializing the entire game.
 */
declare class Scene_Boot extends Scene_Base {
    constructor(...args: any[]);
    /** @type {boolean} */
    _databaseLoaded: boolean | undefined;
    /** @returns {void} */
    onDatabaseLoaded(): void;
    /** @returns {void} */
    setEncryptionInfo(): void;
    /** @returns {void} */
    loadSystemImages(): void;
    /** @returns {void} */
    loadPlayerData(): void;
    /** @returns {void} */
    loadGameFonts(): void;
    /** @returns {boolean} */
    isPlayerDataLoaded(): boolean;
    /** @returns {void} */
    startNormalGame(): void;
    /** @returns {void} */
    resizeScreen(): void;
    /** @returns {void} */
    adjustBoxSize(): void;
    /** @returns {void} */
    adjustWindow(): void;
    /** @returns {number} */
    screenScale(): number;
    /** @returns {void} */
    updateDocumentTitle(): void;
    /** @returns {void} */
    checkPlayerLocation(): void;
}
/**
 * The scene class of the splash screen.
 */
declare class Scene_Splash extends Scene_Base {
    constructor(...args: any[]);
    /** @returns {void} */
    createBackground(): void;
    _backSprite: Sprite | undefined;
    /** @returns {void} */
    adjustBackground(): void;
    /** @returns {boolean} */
    isEnabled(): boolean;
    /** @returns {void} */
    initWaitCount(): void;
    _waitCount: number | undefined;
    /** @returns {boolean} */
    updateWaitCount(): boolean;
    /** @returns {void} */
    checkSkip(): void;
    /** @returns {void} */
    gotoTitle(): void;
}
/**
 * The scene class of the title screen.
 */
declare class Scene_Title extends Scene_Base {
    constructor(...args: any[]);
    /** @returns {void} */
    createBackground(): void;
    _backSprite1: Sprite | undefined;
    _backSprite2: Sprite | undefined;
    /** @returns {void} */
    createForeground(): void;
    _gameTitleSprite: Sprite | undefined;
    /** @returns {void} */
    drawGameTitle(): void;
    /** @returns {void} */
    adjustBackground(): void;
    /** @returns {void} */
    createCommandWindow(): void;
    _commandWindow: Window_TitleCommand | undefined;
    /** @returns {Rectangle} */
    commandWindowRect(): Rectangle;
    /** @returns {void} */
    commandNewGame(): void;
    /** @returns {void} */
    commandContinue(): void;
    /** @returns {void} */
    commandOptions(): void;
    /** @returns {void} */
    playTitleMusic(): void;
}
/**
 * The superclass of Scene_Map and Scene_Battle.
 */
declare class Scene_Message extends Scene_Base {
    constructor(...args: any[]);
    /** @returns {boolean} */
    isMessageWindowClosing(): boolean;
    /** @returns {void} */
    createAllWindows(): void;
    /** @returns {void} */
    createMessageWindow(): void;
    _messageWindow: Window_Message | undefined;
    /** @returns {Rectangle} */
    messageWindowRect(): Rectangle;
    /** @returns {void} */
    createScrollTextWindow(): void;
    _scrollTextWindow: Window_ScrollText | undefined;
    /** @returns {Rectangle} */
    scrollTextWindowRect(): Rectangle;
    /** @returns {void} */
    createGoldWindow(): void;
    _goldWindow: Window_Gold | undefined;
    /** @returns {Rectangle} */
    goldWindowRect(): Rectangle;
    /** @returns {void} */
    createNameBoxWindow(): void;
    _nameBoxWindow: Window_NameBox | undefined;
    /** @returns {void} */
    createChoiceListWindow(): void;
    _choiceListWindow: Window_ChoiceList | undefined;
    /** @returns {void} */
    createNumberInputWindow(): void;
    _numberInputWindow: Window_NumberInput | undefined;
    /** @returns {void} */
    createEventItemWindow(): void;
    _eventItemWindow: Window_EventItem | undefined;
    /** @returns {Rectangle} */
    eventItemWindowRect(): Rectangle;
    /** @returns {void} */
    associateWindows(): void;
    /** @returns {void} */
    cancelMessageWait(): void;
}
/**
 * The scene class of the map screen.
 */
declare class Scene_Map extends Scene_Message {
    /** @type {number} */
    _waitCount: number | undefined;
    /** @type {number} */
    _encounterEffectDuration: number | undefined;
    /** @type {boolean} */
    _mapLoaded: boolean | undefined;
    /** @type {number} */
    _touchCount: number | undefined;
    /** @type {boolean} */
    _menuEnabled: boolean | undefined;
    _transfer: boolean | undefined;
    _lastMapWasNull: boolean | undefined;
    /** @returns {void} */
    onMapLoaded(): void;
    /** @returns {void} */
    onTransfer(): void;
    menuCalling: boolean | undefined;
    /** @returns {void} */
    onTransferEnd(): void;
    /** @returns {boolean} */
    shouldAutosave(): boolean;
    /** @returns {void} */
    updateMainMultiply(): void;
    /** @returns {void} */
    updateMain(): void;
    /** @returns {boolean} */
    isPlayerActive(): boolean;
    /** @returns {boolean} */
    isFastForward(): boolean;
    /** @returns {boolean} */
    needsFadeIn(): boolean;
    /** @returns {boolean | null} */
    needsSlowFadeOut(): boolean | null;
    /** @returns {boolean} */
    updateWaitCount(): boolean;
    /** @returns {void} */
    updateDestination(): void;
    /** @returns {void} */
    updateMenuButton(): void;
    /** @returns {void} */
    hideMenuButton(): void;
    /** @returns {void} */
    updateMapNameWindow(): void;
    /** @returns {boolean} */
    isMenuEnabled(): boolean;
    /** @returns {boolean} */
    isMapTouchOk(): boolean;
    /** @returns {void} */
    processMapTouch(): void;
    /** @returns {boolean} */
    isAnyButtonPressed(): boolean;
    /** @returns {void} */
    onMapTouch(): void;
    /** @returns {boolean} */
    isSceneChangeOk(): boolean;
    /** @returns {void} */
    updateScene(): void;
    /** @returns {void} */
    createDisplayObjects(): void;
    /** @returns {void} */
    createSpriteset(): void;
    _spriteset: Spriteset_Map | undefined;
    /** @returns {void} */
    createMapNameWindow(): void;
    _mapNameWindow: Window_MapName | undefined;
    /** @returns {Rectangle} */
    mapNameWindowRect(): Rectangle;
    /** @returns {void} */
    createButtons(): void;
    /** @returns {void} */
    createMenuButton(): void;
    _menuButton: Sprite_Button | undefined;
    /** @returns {void} */
    updateTransferPlayer(): void;
    /** @returns {void} */
    updateEncounter(): void;
    /** @returns {void} */
    updateCallMenu(): void;
    /** @returns {boolean} */
    isMenuCalled(): boolean;
    /** @returns {void} */
    callMenu(): void;
    /** @returns {void} */
    updateCallDebug(): void;
    /** @returns {boolean} */
    isDebugCalled(): boolean;
    /** @returns {void} */
    fadeInForTransfer(): void;
    /** @returns {void} */
    fadeOutForTransfer(): void;
    /** @returns {void} */
    launchBattle(): void;
    /** @returns {void} */
    stopAudioOnBattleStart(): void;
    /** @returns {void} */
    startEncounterEffect(): void;
    /** @returns {void} */
    updateEncounterEffect(): void;
    /** @returns {void} */
    snapForBattleBackground(): void;
    /**
     * @param {number} duration
     * @returns {void}
     */
    startFlashForEncounter(duration: number): void;
    /** @returns {number} */
    encounterEffectSpeed(): number;
}
/**
 * The superclass of all the menu-type scenes.
 */
declare class Scene_MenuBase extends Scene_Base {
    constructor(...args: any[]);
    /** @returns {number} */
    helpAreaTop(): number;
    /** @returns {number} */
    helpAreaBottom(): number;
    /** @returns {number} */
    helpAreaHeight(): number;
    /** @returns {number} */
    mainAreaTop(): number;
    /** @returns {number} */
    mainAreaBottom(): number;
    /** @returns {number} */
    mainAreaHeight(): number;
    /** @returns {Game_Actor} */
    actor(): Game_Actor;
    /** @returns {void} */
    updateActor(): void;
    _actor: Game_Actor | undefined;
    /** @returns {void} */
    createBackground(): void;
    _backgroundFilter: import("pixi.js").BlurFilter | undefined;
    _backgroundSprite: Sprite | undefined;
    /**
     * @param {number} opacity
     * @returns {void}
     */
    setBackgroundOpacity(opacity: number): void;
    /** @returns {void} */
    createHelpWindow(): void;
    _helpWindow: Window_Help | undefined;
    /** @returns {Rectangle} */
    helpWindowRect(): Rectangle;
    /** @returns {void} */
    createButtons(): void;
    /** @returns {boolean} */
    needsCancelButton(): boolean;
    /** @returns {void} */
    createCancelButton(): void;
    _cancelButton: Sprite_Button | undefined;
    /** @returns {boolean} */
    needsPageButtons(): boolean;
    /** @returns {void} */
    createPageButtons(): void;
    _pageupButton: Sprite_Button | undefined;
    _pagedownButton: Sprite_Button | undefined;
    /** @returns {void} */
    updatePageButtons(): void;
    /** @returns {boolean} */
    arePageButtonsEnabled(): boolean;
    /** @returns {void} */
    nextActor(): void;
    /** @returns {void} */
    previousActor(): void;
    /** @returns {void} */
    onActorChange(): void;
}
/**
 * The scene class of the menu screen.
 */
declare class Scene_Menu extends Scene_MenuBase {
    /** @returns {void} */
    createCommandWindow(): void;
    _commandWindow: Window_MenuCommand | undefined;
    /** @returns {Rectangle} */
    commandWindowRect(): Rectangle;
    /** @returns {void} */
    createGoldWindow(): void;
    _goldWindow: Window_Gold | undefined;
    /** @returns {Rectangle} */
    goldWindowRect(): Rectangle;
    /** @returns {void} */
    createStatusWindow(): void;
    _statusWindow: Window_MenuStatus | undefined;
    /** @returns {Rectangle} */
    statusWindowRect(): Rectangle;
    /** @returns {void} */
    commandItem(): void;
    /** @returns {void} */
    commandPersonal(): void;
    /** @returns {void} */
    commandFormation(): void;
    /** @returns {void} */
    commandOptions(): void;
    /** @returns {void} */
    commandSave(): void;
    /** @returns {void} */
    commandGameEnd(): void;
    /** @returns {void} */
    onPersonalOk(): void;
    /** @returns {void} */
    onPersonalCancel(): void;
    /** @returns {void} */
    onFormationOk(): void;
    /** @returns {void} */
    onFormationCancel(): void;
}
/**
 * The superclass of Scene_Item and Scene_Skill.
 */
declare class Scene_ItemBase extends Scene_MenuBase {
    /** @returns {void} */
    createActorWindow(): void;
    _actorWindow: Window_MenuActor | undefined;
    /** @returns {Rectangle} */
    actorWindowRect(): Rectangle;
    /** @returns {RMMZ.ActionItem | null} */
    item(): RMMZ.ActionItem | null;
    /** @returns {Game_Actor | null | undefined} */
    user(): Game_Actor | null | undefined;
    /** @returns {boolean} */
    isCursorLeft(): boolean;
    /** @returns {void} */
    showActorWindow(): void;
    /** @returns {void} */
    hideActorWindow(): void;
    /** @returns {boolean} */
    isActorWindowActive(): boolean;
    /** @returns {void} */
    onActorOk(): void;
    /** @returns {void} */
    onActorCancel(): void;
    /** @returns {void} */
    determineItem(): void;
    /** @returns {void} */
    useItem(): void;
    /** @returns {void} */
    activateItemWindow(): void;
    /** @returns {Game_Actor[]} */
    itemTargetActors(): Game_Actor[];
    /** @returns {boolean | null | undefined} */
    canUse(): boolean | null | undefined;
    /** @returns {boolean} */
    isItemEffectsValid(): boolean;
    /** @returns {void} */
    applyItem(): void;
    /** @returns {void} */
    checkCommonEvent(): void;
}
/**
 * The scene class of the item screen.
 */
declare class Scene_Item extends Scene_ItemBase {
    /** @returns {void} */
    createCategoryWindow(): void;
    _categoryWindow: Window_ItemCategory | undefined;
    /** @returns {Rectangle} */
    categoryWindowRect(): Rectangle;
    /** @returns {void} */
    createItemWindow(): void;
    _itemWindow: Window_ItemList | undefined;
    /** @returns {Rectangle} */
    itemWindowRect(): Rectangle;
    /** @returns {import("..").Game_Actor | undefined} */
    user(): any | undefined;
    /** @returns {void} */
    onCategoryOk(): void;
    /** @returns {void} */
    onItemOk(): void;
    /** @returns {void} */
    onItemCancel(): void;
    /** @returns {void} */
    playSeForItem(): void;
}
/**
 * The scene class of the skill screen.
 */
declare class Scene_Skill extends Scene_ItemBase {
    /** @returns {void} */
    createSkillTypeWindow(): void;
    _skillTypeWindow: Window_SkillType | undefined;
    /** @returns {Rectangle} */
    skillTypeWindowRect(): Rectangle;
    /** @returns {void} */
    createStatusWindow(): void;
    _statusWindow: Window_SkillStatus | undefined;
    /** @returns {Rectangle} */
    statusWindowRect(): Rectangle;
    /** @returns {void} */
    createItemWindow(): void;
    _itemWindow: Window_SkillList | undefined;
    /** @returns {Rectangle} */
    itemWindowRect(): Rectangle;
    /** @returns {void} */
    refreshActor(): void;
    /** @returns {import("..").Game_Actor} */
    user(): any;
    /** @returns {void} */
    commandSkill(): void;
    /** @returns {void} */
    onItemOk(): void;
    /** @returns {void} */
    onItemCancel(): void;
    /** @returns {void} */
    playSeForItem(): void;
}
/**
 * The scene class of the equipment screen.
 */
declare class Scene_Equip extends Scene_MenuBase {
    /** @returns {void} */
    createStatusWindow(): void;
    _statusWindow: Window_EquipStatus | undefined;
    /** @returns {Rectangle} */
    statusWindowRect(): Rectangle;
    /** @returns {void} */
    createCommandWindow(): void;
    _commandWindow: Window_EquipCommand | undefined;
    /** @returns {Rectangle} */
    commandWindowRect(): Rectangle;
    /** @returns {void} */
    createSlotWindow(): void;
    _slotWindow: Window_EquipSlot | undefined;
    /** @returns {Rectangle} */
    slotWindowRect(): Rectangle;
    /** @returns {void} */
    createItemWindow(): void;
    _itemWindow: Window_EquipItem | undefined;
    /** @returns {Rectangle} */
    itemWindowRect(): Rectangle;
    /** @returns {number} */
    statusWidth(): number;
    /** @returns {void} */
    refreshActor(): void;
    /** @returns {void} */
    commandEquip(): void;
    /** @returns {void} */
    commandOptimize(): void;
    /** @returns {void} */
    commandClear(): void;
    /** @returns {void} */
    onSlotOk(): void;
    /** @returns {void} */
    onSlotCancel(): void;
    /** @returns {void} */
    onItemOk(): void;
    /** @returns {void} */
    executeEquipChange(): void;
    /** @returns {void} */
    onItemCancel(): void;
    /** @returns {void} */
    hideItemWindow(): void;
}
/**
 * The scene class of the status screen.
 */
declare class Scene_Status extends Scene_MenuBase {
    /** @returns {void} */
    createProfileWindow(): void;
    _profileWindow: Window_Help | undefined;
    /** @returns {Rectangle} */
    profileWindowRect(): Rectangle;
    /** @returns {void} */
    createStatusWindow(): void;
    _statusWindow: Window_Status | undefined;
    /** @returns {Rectangle} */
    statusWindowRect(): Rectangle;
    /** @returns {void} */
    createStatusParamsWindow(): void;
    _statusParamsWindow: Window_StatusParams | undefined;
    /** @returns {Rectangle} */
    statusParamsWindowRect(): Rectangle;
    /** @returns {void} */
    createStatusEquipWindow(): void;
    _statusEquipWindow: Window_StatusEquip | undefined;
    /** @returns {Rectangle} */
    statusEquipWindowRect(): Rectangle;
    /** @returns {number} */
    statusParamsWidth(): number;
    /** @returns {number} */
    statusParamsHeight(): number;
    /** @returns {number} */
    profileHeight(): number;
    /** @returns {void} */
    refreshActor(): void;
}
/**
 * The scene class of the options screen.
 */
declare class Scene_Options extends Scene_MenuBase {
    /** @returns {void} */
    createOptionsWindow(): void;
    _optionsWindow: Window_Options | undefined;
    /** @returns {Rectangle} */
    optionsWindowRect(): Rectangle;
    /** @returns {number} */
    maxCommands(): number;
    /** @returns {number} */
    maxVisibleCommands(): number;
}
/**
 * The superclass of Scene_Save and Scene_Load.
 */
declare class Scene_File extends Scene_MenuBase {
    /** @returns {number} */
    savefileId(): number;
    /**
     * @param {number} savefileId
     * @returns {boolean}
     */
    isSavefileEnabled(savefileId: number): boolean;
    /** @returns {void} */
    createListWindow(): void;
    _listWindow: Window_SavefileList | undefined;
    /** @returns {Rectangle} */
    listWindowRect(): Rectangle;
    /** @returns {"save" | "load"} */
    mode(): "save" | "load";
    /** @returns {boolean} */
    needsAutosave(): boolean;
    /** @returns {void} */
    activateListWindow(): void;
    /** @returns {string} */
    helpWindowText(): string;
    /** @returns {number} */
    firstSavefileId(): number;
    /** @returns {void} */
    onSavefileOk(): void;
}
/**
 * The scene class of the save screen.
 */
declare class Scene_Save extends Scene_File {
    /** @returns {"save"} */
    mode(): "save";
    /**
     * @param {number} savefileId
     * @returns {void}
     */
    executeSave(savefileId: number): void;
    /** @returns {void} */
    onSaveSuccess(): void;
    /** @returns {void} */
    onSaveFailure(): void;
}
/**
 * The scene class of the load screen.
 */
declare class Scene_Load extends Scene_File {
    /** @type {boolean} */
    _loadSuccess: boolean | undefined;
    /** @returns {"load"} */
    mode(): "load";
    /**
     * @param {number} savefileId
     * @returns {void}
     */
    executeLoad(savefileId: number): void;
    /** @returns {void} */
    onLoadSuccess(): void;
    /** @returns {void} */
    onLoadFailure(): void;
    /** @returns {void} */
    reloadMapIfUpdated(): void;
}
/**
 * The scene class of the game end screen.
 */
declare class Scene_GameEnd extends Scene_MenuBase {
    /** @returns {void} */
    createCommandWindow(): void;
    _commandWindow: Window_GameEnd | undefined;
    /** @returns {Rectangle} */
    commandWindowRect(): Rectangle;
    /** @returns {void} */
    commandToTitle(): void;
}
/**
 * The scene class of the shop screen.
 */
declare class Scene_Shop extends Scene_MenuBase {
    /**
     * @param {RMMZ.ShopGoods[]} goods
     * @param {boolean} purchaseOnly
     * @returns {void}
     */
    prepare(goods: RMMZ.ShopGoods[], purchaseOnly: boolean): void;
    _goods: ([0, number, 0, number] | [0, number, 1, number] | [1, number, 0, number] | [1, number, 1, number] | [2, number, 0, number] | [2, number, 1, number])[] | undefined;
    _purchaseOnly: boolean | undefined;
    _item: RMMZ.DataItemBase | RMMZ.DataPricedItemBase | null | undefined;
    /** @returns {void} */
    createGoldWindow(): void;
    _goldWindow: Window_Gold | undefined;
    /** @returns {Rectangle} */
    goldWindowRect(): Rectangle;
    /** @returns {void} */
    createCommandWindow(): void;
    _commandWindow: Window_ShopCommand | undefined;
    /** @returns {Rectangle} */
    commandWindowRect(): Rectangle;
    /** @returns {void} */
    createDummyWindow(): void;
    _dummyWindow: Window_Base | undefined;
    /** @returns {Rectangle} */
    dummyWindowRect(): Rectangle;
    /** @returns {void} */
    createNumberWindow(): void;
    _numberWindow: Window_ShopNumber | undefined;
    /** @returns {Rectangle} */
    numberWindowRect(): Rectangle;
    /** @returns {void} */
    createStatusWindow(): void;
    _statusWindow: Window_ShopStatus | undefined;
    /** @returns {Rectangle} */
    statusWindowRect(): Rectangle;
    /** @returns {void} */
    createBuyWindow(): void;
    _buyWindow: Window_ShopBuy | undefined;
    /** @returns {Rectangle} */
    buyWindowRect(): Rectangle;
    /** @returns {void} */
    createCategoryWindow(): void;
    _categoryWindow: Window_ItemCategory | undefined;
    /** @returns {Rectangle} */
    categoryWindowRect(): Rectangle;
    /** @returns {void} */
    createSellWindow(): void;
    _sellWindow: Window_ShopSell | undefined;
    /** @returns {Rectangle} */
    sellWindowRect(): Rectangle;
    /** @returns {number} */
    statusWidth(): number;
    /** @returns {void} */
    activateBuyWindow(): void;
    /** @returns {void} */
    activateSellWindow(): void;
    /** @returns {void} */
    commandBuy(): void;
    /** @returns {void} */
    commandSell(): void;
    /** @returns {void} */
    onBuyOk(): void;
    /** @returns {void} */
    onBuyCancel(): void;
    /** @returns {void} */
    onCategoryOk(): void;
    /** @returns {void} */
    onCategoryCancel(): void;
    /** @returns {void} */
    onSellOk(): void;
    /** @returns {void} */
    onSellCancel(): void;
    /** @returns {void} */
    onNumberOk(): void;
    /** @returns {void} */
    onNumberCancel(): void;
    /**
     * @param {number} number
     * @returns {void}
     */
    doBuy(number: number): void;
    /**
     * @param {number} number
     * @returns {void}
     */
    doSell(number: number): void;
    /** @returns {void} */
    endNumberInput(): void;
    /** @returns {number} */
    maxBuy(): number;
    /** @returns {number} */
    maxSell(): number;
    /** @returns {number} */
    money(): number;
    /** @returns {string} */
    currencyUnit(): string;
    /** @returns {number} */
    buyingPrice(): number;
    /** @returns {number} */
    sellingPrice(): number;
}
/**
 * The scene class of the name input screen.
 */
declare class Scene_Name extends Scene_MenuBase {
    /**
     * @param {RMMZ.ActorID} actorId
     * @param {number} maxLength
     * @returns {void}
     */
    prepare(actorId: RMMZ.ActorID, maxLength: number): void;
    _actorId: number | undefined;
    _maxLength: number | undefined;
    /** @returns {void} */
    createEditWindow(): void;
    _editWindow: Window_NameEdit | undefined;
    /** @returns {Rectangle} */
    editWindowRect(): Rectangle;
    /** @returns {void} */
    createInputWindow(): void;
    _inputWindow: Window_NameInput | undefined;
    /** @returns {Rectangle} */
    inputWindowRect(): Rectangle;
    /** @returns {void} */
    onInputOk(): void;
}
/**
 * The scene class of the debug screen.
 */
declare class Scene_Debug extends Scene_MenuBase {
    /** @returns {void} */
    createRangeWindow(): void;
    _rangeWindow: Window_DebugRange | undefined;
    /** @returns {Rectangle} */
    rangeWindowRect(): Rectangle;
    /** @returns {void} */
    createEditWindow(): void;
    _editWindow: Window_DebugEdit | undefined;
    /** @returns {Rectangle} */
    editWindowRect(): Rectangle;
    /** @returns {void} */
    createDebugHelpWindow(): void;
    _debugHelpWindow: Window_Base | undefined;
    /** @returns {Rectangle} */
    debugHelpWindowRect(): Rectangle;
    /** @returns {void} */
    onRangeOk(): void;
    /** @returns {void} */
    onEditCancel(): void;
    /** @returns {void} */
    refreshHelpWindow(): void;
    /** @returns {string} */
    helpText(): string;
}
/**
 * The scene class of the battle screen.
 */
declare class Scene_Battle extends Scene_Message {
    /** @returns {void} */
    updateVisibility(): void;
    /** @returns {void} */
    updateBattleProcess(): void;
    /** @returns {boolean} */
    isTimeActive(): boolean;
    /** @returns {boolean} */
    isAnyInputWindowActive(): boolean;
    /** @returns {void} */
    changeInputWindow(): void;
    /** @returns {boolean | null} */
    shouldAutosave(): boolean | null;
    /** @returns {boolean | null} */
    needsSlowFadeOut(): boolean | null;
    /** @returns {void} */
    updateLogWindowVisibility(): void;
    /** @returns {void} */
    updateStatusWindowVisibility(): void;
    /** @returns {boolean} */
    shouldOpenStatusWindow(): boolean;
    /** @returns {void} */
    updateStatusWindowPosition(): void;
    /** @returns {number} */
    statusWindowX(): number;
    /** @returns {void} */
    updateInputWindowVisibility(): void;
    /** @returns {boolean} */
    needsInputWindowChange(): boolean;
    /** @returns {void} */
    updateCancelButton(): void;
    /** @returns {void} */
    createDisplayObjects(): void;
    /** @returns {void} */
    createSpriteset(): void;
    _spriteset: Spriteset_Battle | undefined;
    /** @returns {void} */
    createLogWindow(): void;
    _logWindow: Window_BattleLog | undefined;
    /** @returns {Rectangle} */
    logWindowRect(): Rectangle;
    /** @returns {void} */
    createStatusWindow(): void;
    _statusWindow: Window_BattleStatus | undefined;
    /** @returns {Rectangle} */
    statusWindowRect(): Rectangle;
    /** @returns {void} */
    createPartyCommandWindow(): void;
    _partyCommandWindow: Window_PartyCommand | undefined;
    /** @returns {Rectangle} */
    partyCommandWindowRect(): Rectangle;
    /** @returns {void} */
    createActorCommandWindow(): void;
    _actorCommandWindow: Window_ActorCommand | undefined;
    /** @returns {Rectangle} */
    actorCommandWindowRect(): Rectangle;
    /** @returns {void} */
    createHelpWindow(): void;
    _helpWindow: Window_Help | undefined;
    /** @returns {Rectangle} */
    helpWindowRect(): Rectangle;
    /** @returns {void} */
    createSkillWindow(): void;
    _skillWindow: Window_BattleSkill | undefined;
    /** @returns {Rectangle} */
    skillWindowRect(): Rectangle;
    /** @returns {void} */
    createItemWindow(): void;
    _itemWindow: Window_BattleItem | undefined;
    /** @returns {Rectangle} */
    itemWindowRect(): Rectangle;
    /** @returns {void} */
    createActorWindow(): void;
    _actorWindow: Window_BattleActor | undefined;
    /** @returns {Rectangle} */
    actorWindowRect(): Rectangle;
    /** @returns {void} */
    createEnemyWindow(): void;
    _enemyWindow: Window_BattleEnemy | undefined;
    /** @returns {Rectangle} */
    enemyWindowRect(): Rectangle;
    /** @returns {number} */
    helpAreaTop(): number;
    /** @returns {number} */
    helpAreaBottom(): number;
    /** @returns {number} */
    helpAreaHeight(): number;
    /** @returns {number} */
    windowAreaHeight(): number;
    /** @returns {void} */
    createButtons(): void;
    /** @returns {void} */
    createCancelButton(): void;
    _cancelButton: Sprite_Button | undefined;
    /** @returns {void} */
    closeCommandWindows(): void;
    /** @returns {void} */
    hideSubInputWindows(): void;
    /** @returns {void} */
    startPartyCommandSelection(): void;
    /** @returns {void} */
    commandFight(): void;
    /** @returns {void} */
    commandEscape(): void;
    /** @returns {void} */
    startActorCommandSelection(): void;
    /** @returns {void} */
    commandAttack(): void;
    /** @returns {void} */
    commandSkill(): void;
    /** @returns {void} */
    commandGuard(): void;
    /** @returns {void} */
    commandItem(): void;
    /** @returns {void} */
    commandCancel(): void;
    /** @returns {void} */
    selectNextCommand(): void;
    /** @returns {void} */
    selectPreviousCommand(): void;
    /** @returns {void} */
    startActorSelection(): void;
    /** @returns {void} */
    onActorOk(): void;
    /** @returns {void} */
    onActorCancel(): void;
    /** @returns {void} */
    startEnemySelection(): void;
    /** @returns {void} */
    onEnemyOk(): void;
    /** @returns {void} */
    onEnemyCancel(): void;
    /** @returns {void} */
    onSkillOk(): void;
    /** @returns {void} */
    onSkillCancel(): void;
    /** @returns {void} */
    onItemOk(): void;
    /** @returns {void} */
    onItemCancel(): void;
    /** @returns {void} */
    onSelectAction(): void;
    /** @returns {void} */
    endCommandSelection(): void;
}
/**
 * The scene class of the game over screen.
 */
declare class Scene_Gameover extends Scene_Base {
    constructor(...args: any[]);
    /** @returns {void} */
    playGameoverMusic(): void;
    /** @returns {void} */
    createBackground(): void;
    _backSprite: Sprite | undefined;
    /** @returns {void} */
    adjustBackground(): void;
    /** @returns {boolean} */
    isTriggered(): boolean;
    /** @returns {void} */
    gotoTitle(): void;
}
