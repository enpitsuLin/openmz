// Auto-generated from JSDoc in src/js/rmmz_objects.js via `pnpm build:types`. Do not edit manually.

/**
 * The game object class for temporary data that is not included in save data.
 */
declare class Game_Temp {
    constructor(...args: any[]);
    initialize(): void;
    /** @type {boolean} */
    _isPlaytest: boolean | undefined;
    /** @type {number | null} */
    _destinationX: number | null | undefined;
    /** @type {number | null} */
    _destinationY: number | null | undefined;
    /** @type {Game_Battler | null} */
    _touchTarget: Game_Battler | null | undefined;
    /** @type {"" | "select" | "click"} */
    _touchState: "" | "select" | "click" | undefined;
    /** @type {boolean} */
    _needsBattleRefresh: boolean | undefined;
    /** @type {RMMZ.CommonEventID[]} */
    _commonEventQueue: number[] | undefined;
    /** @type {RMMZ.AnimationRequest[]} */
    _animationQueue: RMMZ.AnimationRequest[] | undefined;
    /** @type {RMMZ.BalloonRequest[]} */
    _balloonQueue: RMMZ.BalloonRequest[] | undefined;
    /** @type {[ RMMZ.SkillID, RMMZ.ItemID, RMMZ.ActorID, RMMZ.EnemyID, RMMZ.ActorID, RMMZ.EnemyID ]} */
    _lastActionData: [number, number, number, number, number, number] | undefined;
    /** @returns {boolean} */
    isPlaytest(): boolean;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    setDestination(x: number, y: number): void;
    /** @returns {void} */
    clearDestination(): void;
    /** @returns {boolean} */
    isDestinationValid(): boolean;
    /** @returns {number | null} */
    destinationX(): number | null;
    /** @returns {number | null} */
    destinationY(): number | null;
    /**
     * @param {Game_Battler} target
     * @param {"select" | "click"} state
     * @returns {void}
     */
    setTouchState(target: Game_Battler, state: "select" | "click"): void;
    /** @returns {void} */
    clearTouchState(): void;
    /** @returns {Game_Battler | null} */
    touchTarget(): Game_Battler | null;
    /** @returns {string} */
    touchState(): string;
    /** @returns {void} */
    requestBattleRefresh(): void;
    /** @returns {void} */
    clearBattleRefreshRequest(): void;
    /** @returns {boolean} */
    isBattleRefreshRequested(): boolean;
    /**
     * @param {RMMZ.CommonEventID} commonEventId
     * @returns {void}
     */
    reserveCommonEvent(commonEventId: RMMZ.CommonEventID): void;
    /** @returns {import("../data").DataCommonEvent} */
    retrieveCommonEvent(): any;
    /** @returns {void} */
    clearCommonEventReservation(): void;
    /** @returns {boolean} */
    isCommonEventReserved(): boolean;
    /**
     * @param {(Game_Character | Game_Battler)[]} targets
     * @param {RMMZ.AnimationID} animationId
     * @param {boolean} [mirror]
     * @returns {void}
     */
    requestAnimation(targets: (Game_Character | Game_Battler)[], animationId: RMMZ.AnimationID, mirror?: boolean): void;
    /** @returns {RMMZ.AnimationRequest | undefined} */
    retrieveAnimation(): RMMZ.AnimationRequest | undefined;
    /**
     * @param {Game_Character} target
     * @param {RMMZ.BalloonIconID} balloonId
     * @returns {void}
     */
    requestBalloon(target: Game_Character, balloonId: RMMZ.BalloonIconID): void;
    /** @returns {RMMZ.BalloonRequest | undefined} */
    retrieveBalloon(): RMMZ.BalloonRequest | undefined;
    /**
     * @param {RMMZ.ActionDataType} type
     * @returns {number}
     */
    lastActionData(type: RMMZ.ActionDataType): number;
    /**
     * @param {RMMZ.ActionDataType} type
     * @param {number} value
     * @returns {void}
     */
    setLastActionData(type: RMMZ.ActionDataType, value: number): void;
    /**
     * @param {RMMZ.SkillID} skillID
     * @returns {void}
     */
    setLastUsedSkillId(skillID: RMMZ.SkillID): void;
    /**
     * @param {RMMZ.ItemID} itemID
     * @returns {void}
     */
    setLastUsedItemId(itemID: RMMZ.ItemID): void;
    /**
     * @param {RMMZ.ActorID} actorID
     * @returns {void}
     */
    setLastSubjectActorId(actorID: RMMZ.ActorID): void;
    /**
     * @param {RMMZ.EnemyID} enemyIndex
     * @returns {void}
     */
    setLastSubjectEnemyIndex(enemyIndex: RMMZ.EnemyID): void;
    /**
     * @param {RMMZ.ActorID} actorID
     * @returns {void}
     */
    setLastTargetActorId(actorID: RMMZ.ActorID): void;
    /**
     * @param {RMMZ.EnemyID} enemyIndex
     * @returns {void}
     */
    setLastTargetEnemyIndex(enemyIndex: RMMZ.EnemyID): void;
}
/**
 * The game object class for the system data.
 */
declare class Game_System {
    constructor(...args: any[]);
    initialize(): void;
    /** @type {boolean} */
    _saveEnabled: boolean | undefined;
    /** @type {boolean} */
    _menuEnabled: boolean | undefined;
    /** @type {boolean} */
    _encounterEnabled: boolean | undefined;
    /** @type {boolean} */
    _formationEnabled: boolean | undefined;
    /** @type {number} */
    _battleCount: number | undefined;
    /** @type {number} */
    _winCount: number | undefined;
    /** @type {number} */
    _escapeCount: number | undefined;
    /** @type {number} */
    _saveCount: number | undefined;
    /** @type {number} */
    _versionId: number | undefined;
    /** @type {number} */
    _savefileId: number | undefined;
    /** @type {number} */
    _framesOnSave: number | undefined;
    /** @type {RMMZ.DataAudio | null} */
    _bgmOnSave: RMMZ.AudioFile | null | undefined;
    /** @type {RMMZ.DataAudio | null} */
    _bgsOnSave: RMMZ.AudioFile | null | undefined;
    /** @type {RMMZ.Color | null} */
    _windowTone: RMMZ.Color | null | undefined;
    /** @type {RMMZ.DataAudio | null} */
    _battleBgm: RMMZ.AudioFile | null | undefined;
    /** @type {RMMZ.DataAudio | null} */
    _victoryMe: RMMZ.AudioFile | null | undefined;
    /** @type {RMMZ.DataAudio | null} */
    _defeatMe: RMMZ.AudioFile | null | undefined;
    /** @type {RMMZ.DataAudio | null} */
    _savedBgm: RMMZ.AudioFile | null | undefined;
    /** @type {RMMZ.DataAudio | null} */
    _walkingBgm: RMMZ.AudioFile | null | undefined;
    /** @returns {RegExpMatchArray | null} */
    isJapanese(): RegExpMatchArray | null;
    /** @returns {RegExpMatchArray | null} */
    isChinese(): RegExpMatchArray | null;
    /** @returns {RegExpMatchArray | null} */
    isKorean(): RegExpMatchArray | null;
    /** @returns {RegExpMatchArray | null} */
    isCJK(): RegExpMatchArray | null;
    /** @returns {RegExpMatchArray | null} */
    isRussian(): RegExpMatchArray | null;
    /** @returns {boolean} */
    isSideView(): boolean;
    /** @returns {boolean} */
    isAutosaveEnabled(): boolean;
    /** @returns {boolean} */
    isMessageSkipEnabled(): boolean;
    /** @returns {boolean} */
    isSaveEnabled(): boolean;
    /** @returns {void} */
    disableSave(): void;
    /** @returns {void} */
    enableSave(): void;
    /** @returns {boolean} */
    isMenuEnabled(): boolean;
    /** @returns {void} */
    disableMenu(): void;
    /** @returns {void} */
    enableMenu(): void;
    /** @returns {boolean} */
    isEncounterEnabled(): boolean;
    /** @returns {void} */
    disableEncounter(): void;
    /** @returns {void} */
    enableEncounter(): void;
    /** @returns {boolean} */
    isFormationEnabled(): boolean;
    /** @returns {void} */
    disableFormation(): void;
    /** @returns {void} */
    enableFormation(): void;
    /** @returns {number} */
    battleCount(): number;
    /** @returns {number} */
    winCount(): number;
    /** @returns {number} */
    escapeCount(): number;
    /** @returns {number} */
    saveCount(): number;
    /** @returns {number} */
    versionId(): number;
    /** @returns {number} */
    savefileId(): number;
    /**
     * @param {number} savefileId
     * @returns {void}
     */
    setSavefileId(savefileId: number): void;
    /** @returns {RMMZ.Color} */
    windowTone(): RMMZ.Color;
    /**
     * @param {RMMZ.Color} value
     * @returns {void}
     */
    setWindowTone(value: RMMZ.Color): void;
    /** @returns {RMMZ.DataAudio} */
    battleBgm(): RMMZ.DataAudio;
    /**
     * @param {RMMZ.DataAudio} value
     * @returns {void}
     */
    setBattleBgm(value: RMMZ.DataAudio): void;
    /** @returns {RMMZ.DataAudio} */
    victoryMe(): RMMZ.DataAudio;
    /**
     * @param {RMMZ.DataAudio} value
     * @returns {void}
     */
    setVictoryMe(value: RMMZ.DataAudio): void;
    /** @returns {RMMZ.DataAudio} */
    defeatMe(): RMMZ.DataAudio;
    /**
     * @param {RMMZ.DataAudio} value
     * @returns {void}
     */
    setDefeatMe(value: RMMZ.DataAudio): void;
    /** @returns {void} */
    onBattleStart(): void;
    /** @returns {void} */
    onBattleWin(): void;
    /** @returns {void} */
    onBattleEscape(): void;
    /** @returns {void} */
    onBeforeSave(): void;
    /** @returns {void} */
    onAfterLoad(): void;
    /** @returns {number} */
    playtime(): number;
    /** @returns {string} */
    playtimeText(): string;
    /** @returns {void} */
    saveBgm(): void;
    /** @returns {void} */
    replayBgm(): void;
    /** @returns {void} */
    saveWalkingBgm(): void;
    /** @returns {void} */
    replayWalkingBgm(): void;
    /** @returns {void} */
    saveWalkingBgm2(): void;
    /** @returns {string} */
    mainFontFace(): string;
    /** @returns {string} */
    numberFontFace(): string;
    /** @returns {number} */
    mainFontSize(): number;
    /** @returns {number} */
    windowPadding(): number;
    /** @returns {number} */
    windowOpacity(): number;
}
/**
 * The game object class for the timer.
 */
declare class Game_Timer {
    constructor(...args: any[]);
    initialize(): void;
    /** @type {number} */
    _frames: number | undefined;
    /** @type {boolean} */
    _working: boolean | undefined;
    /**
     * @param {boolean} sceneActive
     * @returns {void}
     */
    update(sceneActive: boolean): void;
    /**
     * @param {number} count
     * @returns {void}
     */
    start(count: number): void;
    /** @returns {void} */
    stop(): void;
    /** @returns {boolean} */
    isWorking(): boolean;
    /** @returns {number} */
    seconds(): number;
    /** @returns {number} */
    frames(): number;
    /** @returns {void} */
    onExpire(): void;
}
/**
 * The game object class for the state of the message window that displays text
 * or selections, etc.
 */
declare class Game_Message {
    constructor(...args: any[]);
    initialize(): void;
    /** @returns {void} */
    clear(): void;
    _texts: any[] | undefined;
    _choices: any[] | string[] | undefined;
    _speakerName: string | undefined;
    _faceName: string | undefined;
    _faceIndex: number | undefined;
    _background: number | undefined;
    _positionType: number | undefined;
    _choiceDefaultType: number | undefined;
    _choiceCancelType: number | undefined;
    _choiceBackground: number | undefined;
    _choicePositionType: number | undefined;
    _numInputVariableId: number | undefined;
    _numInputMaxDigits: number | undefined;
    _itemChoiceVariableId: number | undefined;
    _itemChoiceItypeId: number | undefined;
    _scrollMode: boolean | undefined;
    _scrollSpeed: number | undefined;
    _scrollNoFast: boolean | undefined;
    _choiceCallback: ((chosen: number) => void) | null | undefined;
    /** @returns {string[]} */
    choices(): string[];
    /** @returns {string} */
    speakerName(): string;
    /** @returns {string} */
    faceName(): string;
    /** @returns {number} */
    faceIndex(): number;
    /** @returns {RMMZ.TextWindowBackgroundType} */
    background(): RMMZ.TextWindowBackgroundType;
    /** @returns {RMMZ.TextWindowPositionType} */
    positionType(): RMMZ.TextWindowPositionType;
    /** @returns {number} */
    choiceDefaultType(): number;
    /** @returns {number} */
    choiceCancelType(): number;
    /** @returns {RMMZ.TextWindowBackgroundType} */
    choiceBackground(): RMMZ.TextWindowBackgroundType;
    /** @returns {RMMZ.TextWindowPositionType} */
    choicePositionType(): RMMZ.TextWindowPositionType;
    /** @returns {number} */
    numInputVariableId(): number;
    /** @returns {number} */
    numInputMaxDigits(): number;
    /** @returns {number} */
    itemChoiceVariableId(): number;
    /** @returns {number} */
    itemChoiceItypeId(): number;
    /** @returns {boolean} */
    scrollMode(): boolean;
    /** @returns {number} */
    scrollSpeed(): number;
    /** @returns {boolean} */
    scrollNoFast(): boolean;
    /**
     * @param {string} text
     * @returns {void}
     */
    add(text: string): void;
    /**
     * @param {string} speakerName
     * @returns {void}
     */
    setSpeakerName(speakerName: string): void;
    /**
     * @param {string} faceName
     * @param {number} faceIndex
     * @returns {void}
     */
    setFaceImage(faceName: string, faceIndex: number): void;
    /**
     * @param {RMMZ.TextWindowBackgroundType} background
     * @returns {void}
     */
    setBackground(background: RMMZ.TextWindowBackgroundType): void;
    /**
     * @param {RMMZ.TextWindowPositionType} positionType
     * @returns {void}
     */
    setPositionType(positionType: RMMZ.TextWindowPositionType): void;
    /**
     * @param {string[]} choices
     * @param {number} defaultType
     * @param {number} cancelType
     * @returns {void}
     */
    setChoices(choices: string[], defaultType: number, cancelType: number): void;
    /**
     * @param {RMMZ.TextWindowBackgroundType} background
     * @returns {void}
     */
    setChoiceBackground(background: RMMZ.TextWindowBackgroundType): void;
    /**
     * @param {RMMZ.TextWindowPositionType} positionType
     * @returns {void}
     */
    setChoicePositionType(positionType: RMMZ.TextWindowPositionType): void;
    /**
     * @param {number} variableId
     * @param {number} maxDigits
     * @returns {void}
     */
    setNumberInput(variableId: number, maxDigits: number): void;
    /**
     * @param {number} variableId
     * @param {RMMZ.ItemType} itemType
     * @returns {void}
     */
    setItemChoice(variableId: number, itemType: RMMZ.ItemType): void;
    /**
     * @param {number} speed
     * @param {boolean} noFast
     * @returns {void}
     */
    setScroll(speed: number, noFast: boolean): void;
    /**
     * @param {(chosen: number) => void} callback
     * @returns {void}
     */
    setChoiceCallback(callback: (chosen: number) => void): void;
    /**
     * @param {number} n
     * @returns {void}
     */
    onChoice(n: number): void;
    /** @returns {boolean} */
    hasText(): boolean;
    /** @returns {boolean} */
    isChoice(): boolean;
    /** @returns {boolean} */
    isNumberInput(): boolean;
    /** @returns {boolean} */
    isItemChoice(): boolean;
    /** @returns {boolean} */
    isBusy(): boolean;
    /** @returns {void} */
    newPage(): void;
    /** @returns {string} */
    allText(): string;
    /** @returns {boolean} */
    isRTL(): boolean;
}
/**
 * The game object class for switches.
 */
declare class Game_Switches {
    constructor(...args: any[]);
    initialize(): void;
    /** @returns {void} */
    clear(): void;
    _data: any[] | undefined;
    /**
     * @param {RMMZ.SwitchID} [switchId]
     * @returns {boolean}
     */
    value(switchId?: RMMZ.SwitchID): boolean;
    /**
     * @param {number} switchId
     * @param {boolean} value
     * @returns {void}
     */
    setValue(switchId: number, value: boolean): void;
    /** @returns {void} */
    onChange(): void;
}
/**
 * The game object class for variables.
 */
declare class Game_Variables {
    constructor(...args: any[]);
    initialize(): void;
    /** @returns {void} */
    clear(): void;
    _data: any[] | undefined;
    /**
     * @param {RMMZ.VariableID} [variableId]
     * @returns {number}
     */
    value(variableId?: RMMZ.VariableID): number;
    /**
     * @param {RMMZ.VariableID} variableId
     * @param {number} value
     * @returns {void}
     */
    setValue(variableId: RMMZ.VariableID, value: number): void;
    /** @returns {void} */
    onChange(): void;
}
/**
 * The game object class for self switches.
 */
declare class Game_SelfSwitches {
    constructor(...args: any[]);
    initialize(): void;
    clear(): void;
    _data: {} | undefined;
    /**
     * @param {RMMZ.SelfSwitchID} key
     * @returns {boolean}
     */
    value(key: RMMZ.SelfSwitchID): boolean;
    /**
     * @param {RMMZ.SelfSwitchID} key
     * @param {boolean} value
     * @returns {void}
     */
    setValue(key: RMMZ.SelfSwitchID, value: boolean): void;
    /** @returns {void} */
    onChange(): void;
}
/**
 * The game object class for screen effect data, such as changes in color tone
 * and flashes.
 */
declare class Game_Screen {
    constructor(...args: any[]);
    initialize(): void;
    /** @returns {void} */
    clear(): void;
    /** @returns {void} */
    onBattleStart(): void;
    /** @returns {number} */
    brightness(): number;
    /** @returns {[ number, number, number, number ]} */
    tone(): [number, number, number, number];
    /** @returns {[ number, number, number, number ]} */
    flashColor(): [number, number, number, number];
    /** @returns {number} */
    shake(): number;
    /** @returns {number} */
    zoomX(): number;
    /** @returns {number} */
    zoomY(): number;
    /** @returns {number} */
    zoomScale(): number;
    /** @returns {RMMZ.WeatherType} */
    weatherType(): RMMZ.WeatherType;
    /** @returns {number} */
    weatherPower(): number;
    /**
     * @param {RMMZ.PictureID} pictureId
     * @returns {Game_Picture | null}
     */
    picture(pictureId: RMMZ.PictureID): Game_Picture | null;
    /**
     * @param {RMMZ.PictureID} pictureId
     * @returns {number}
     */
    realPictureId(pictureId: RMMZ.PictureID): number;
    /** @returns {void} */
    clearFade(): void;
    _brightness: any;
    _fadeOutDuration: number | undefined;
    _fadeInDuration: number | undefined;
    /** @returns {void} */
    clearTone(): void;
    _tone: number[] | undefined;
    _toneTarget: number[] | undefined;
    _toneDuration: number | undefined;
    /** @returns {void} */
    clearFlash(): void;
    _flashColor: number[] | undefined;
    _flashDuration: number | undefined;
    /** @returns {void} */
    clearShake(): void;
    _shakePower: number | undefined;
    _shakeSpeed: number | undefined;
    _shakeDuration: number | undefined;
    _shakeDirection: number | undefined;
    _shake: number | undefined;
    /** @returns {void} */
    clearZoom(): void;
    _zoomX: number | undefined;
    _zoomY: number | undefined;
    _zoomScale: any;
    _zoomScaleTarget: number | undefined;
    _zoomDuration: number | undefined;
    /** @returns {void} */
    clearWeather(): void;
    _weatherType: string | undefined;
    _weatherPower: any;
    _weatherPowerTarget: number | undefined;
    _weatherDuration: number | undefined;
    /** @returns {void} */
    clearPictures(): void;
    _pictures: any;
    /** @returns {void} */
    eraseBattlePictures(): void;
    /** @returns {number} */
    maxPictures(): number;
    /**
     * @param {number} duration
     * @returns {void}
     */
    startFadeOut(duration: number): void;
    /**
     * @param {number} duration
     * @returns {void}
     */
    startFadeIn(duration: number): void;
    /**
     * @param {RMMZ.Color} tone
     * @param {number} duration
     * @returns {void}
     */
    startTint(tone: RMMZ.Color, duration: number): void;
    /**
     * @param {RMMZ.Color} color
     * @param {number} duration
     * @returns {void}
     */
    startFlash(color: RMMZ.Color, duration: number): void;
    /**
     * @param {number} power
     * @param {number} speed
     * @param {number} duration
     * @returns {void}
     */
    startShake(power: number, speed: number, duration: number): void;
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} scale
     * @param {number} duration
     * @returns {void}
     */
    startZoom(x: number, y: number, scale: number, duration: number): void;
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} scale
     * @returns {void}
     */
    setZoom(x: number, y: number, scale: number): void;
    /**
     * @param {RMMZ.WeatherType} type
     * @param {number} power
     * @param {number} duration
     * @returns {void}
     */
    changeWeather(type: RMMZ.WeatherType, power: number, duration: number): void;
    /** @returns {void} */
    update(): void;
    /** @returns {void} */
    updateFadeOut(): void;
    /** @returns {void} */
    updateFadeIn(): void;
    /** @returns {void} */
    updateTone(): void;
    /** @returns {void} */
    updateFlash(): void;
    /** @returns {void} */
    updateShake(): void;
    /** @returns {void} */
    updateZoom(): void;
    /** @returns {void} */
    updateWeather(): void;
    /** @returns {void} */
    updatePictures(): void;
    /** @returns {void} */
    startFlashForDamage(): void;
    /**
     * @param {RMMZ.PictureID} pictureId
     * @param {string} name
     * @param {number} origin
     * @param {number} x
     * @param {number} y
     * @param {number} scaleX
     * @param {number} scaleY
     * @param {number} opacity
     * @param {import("pixi.js").BLEND_MODES} blendMode
     * @returns {void}
     */
    showPicture(pictureId: RMMZ.PictureID, name: string, origin: number, x: number, y: number, scaleX: number, scaleY: number, opacity: number, blendMode: import("pixi.js").BLEND_MODES): void;
    /**
     * @param {RMMZ.PictureID} pictureId
     * @param {number} origin
     * @param {number} x
     * @param {number} y
     * @param {number} scaleX
     * @param {number} scaleY
     * @param {number} opacity
     * @param {import("pixi.js").BLEND_MODES} blendMode
     * @param {number} duration
     * @param {RMMZ.PictureEasingType} easingType
     * @returns {void}
     */
    movePicture(pictureId: RMMZ.PictureID, origin: number, x: number, y: number, scaleX: number, scaleY: number, opacity: number, blendMode: import("pixi.js").BLEND_MODES, duration: number, easingType: RMMZ.PictureEasingType): void;
    /**
     * @param {RMMZ.PictureID} pictureId
     * @param {number} speed
     * @returns {void}
     */
    rotatePicture(pictureId: RMMZ.PictureID, speed: number): void;
    /**
     * @param {RMMZ.PictureID} pictureId
     * @param {RMMZ.Color} tone
     * @param {number} duration
     * @returns {void}
     */
    tintPicture(pictureId: RMMZ.PictureID, tone: RMMZ.Color, duration: number): void;
    /**
     * @param {RMMZ.PictureID} pictureId
     * @returns {void}
     */
    erasePicture(pictureId: RMMZ.PictureID): void;
}
/**
 * The game object class for a picture.
 */
declare class Game_Picture {
    constructor(...args: any[]);
    initialize(): void;
    /** @returns {string} */
    name(): string;
    /** @returns {number} */
    origin(): number;
    /** @returns {number} */
    x(): number;
    /** @returns {number} */
    y(): number;
    /** @returns {number} */
    scaleX(): number;
    /** @returns {number} */
    scaleY(): number;
    /** @returns {number} */
    opacity(): number;
    /** @returns {import("pixi.js").BLEND_MODES} */
    blendMode(): import("pixi.js").BLEND_MODES;
    /** @returns {[ number, number, number, number ] | null} */
    tone(): [number, number, number, number] | null;
    /** @returns {number} */
    angle(): number;
    /** @returns {void} */
    initBasic(): void;
    _name: string | undefined;
    _origin: number | undefined;
    _x: any;
    _y: any;
    _scaleX: any;
    _scaleY: any;
    _opacity: any;
    _blendMode: number | import("pixi.js").BLEND_MODES | undefined;
    /** @returns {void} */
    initTarget(): void;
    _targetX: any;
    _targetY: any;
    _targetScaleX: any;
    _targetScaleY: any;
    _targetOpacity: any;
    _duration: number | undefined;
    _wholeDuration: number | undefined;
    _easingType: number | undefined;
    _easingExponent: number | undefined;
    /** @returns {void} */
    initTone(): void;
    _tone: number[] | null | undefined;
    _toneTarget: number[] | null | undefined;
    _toneDuration: number | undefined;
    /** @returns {void} */
    initRotation(): void;
    _angle: number | undefined;
    _rotationSpeed: number | undefined;
    /**
     * @param {string} name
     * @param {number} origin
     * @param {number} x
     * @param {number} y
     * @param {number} scaleX
     * @param {number} scaleY
     * @param {number} opacity
     * @param {import("pixi.js").BLEND_MODES} blendMode
     * @returns {void}
     */
    show(name: string, origin: number, x: number, y: number, scaleX: number, scaleY: number, opacity: number, blendMode: import("pixi.js").BLEND_MODES): void;
    /**
     * @param {number} origin
     * @param {number} x
     * @param {number} y
     * @param {number} scaleX
     * @param {number} scaleY
     * @param {number} opacity
     * @param {import("pixi.js").BLEND_MODES} blendMode
     * @param {number} duration
     * @param {RMMZ.PictureEasingType} easingType
     * @returns {void}
     */
    move(origin: number, x: number, y: number, scaleX: number, scaleY: number, opacity: number, blendMode: import("pixi.js").BLEND_MODES, duration: number, easingType: RMMZ.PictureEasingType): void;
    /**
     * @param {number} speed
     * @returns {void}
     */
    rotate(speed: number): void;
    /**
     * @param {RMMZ.Color} tone
     * @param {number} duration
     * @returns {void}
     */
    tint(tone: RMMZ.Color, duration: number): void;
    /** @returns {void} */
    update(): void;
    /** @returns {void} */
    updateMove(): void;
    /** @returns {void} */
    updateTone(): void;
    /** @returns {void} */
    updateRotation(): void;
    /**
     * @param {number} current
     * @param {number} target
     * @returns {number}
     */
    applyEasing(current: number, target: number): number;
    /**
     * @param {number} t
     * @returns {number}
     */
    calcEasing(t: number): number;
    /**
     * @param {number} t
     * @param {number} exponent
     * @returns {number}
     */
    easeIn(t: number, exponent: number): number;
    /**
     * @param {number} t
     * @param {number} exponent
     * @returns {number}
     */
    easeOut(t: number, exponent: number): number;
    /**
     * @param {number} t
     * @param {number} exponent
     * @returns {number}
     */
    easeInOut(t: number, exponent: number): number;
}
/**
 * The game object class for handling skills, items, weapons, and armor. It is
 * required because save data should not include the database object itself.
 */
declare class Game_Item {
    /** @param {[item?: RMMZ.DataItemBase | null]} args */
    constructor(item?: RMMZ.DataItemBase | null | undefined);
    /** @param {RMMZ.DataItemBase | null} [item] */
    initialize(item?: RMMZ.DataItemBase | null): void;
    /** @type {RMMZ.DataClassID | ""} */
    _dataClass: "" | RMMZ.DataClassID | undefined;
    /** @type {number} */
    _itemId: number | undefined;
    /** @returns {boolean} */
    isSkill(): boolean;
    /** @returns {boolean} */
    isItem(): boolean;
    /** @returns {boolean} */
    isUsableItem(): boolean;
    /** @returns {boolean} */
    isWeapon(): boolean;
    /** @returns {boolean} */
    isArmor(): boolean;
    /** @returns {boolean} */
    isEquipItem(): boolean;
    /** @returns {boolean} */
    isNull(): boolean;
    /** @returns {number} */
    itemId(): number;
    /** @returns {RMMZ.DataItemBase} */
    object(): RMMZ.DataItemBase;
    /**
     * @param {RMMZ.DataItemBase | null} item
     * @returns {void}
     */
    setObject(item: RMMZ.DataItemBase | null): void;
    /**
     * @param {boolean} isWeapon
     * @param {number} itemId
     * @returns {void}
     */
    setEquip(isWeapon: boolean, itemId: number): void;
}
/**
 * The game object class for a battle action.
 */
declare class Game_Action {
    static EFFECT_RECOVER_HP: number;
    static EFFECT_RECOVER_MP: number;
    static EFFECT_GAIN_TP: number;
    static EFFECT_ADD_STATE: number;
    static EFFECT_REMOVE_STATE: number;
    static EFFECT_ADD_BUFF: number;
    static EFFECT_ADD_DEBUFF: number;
    static EFFECT_REMOVE_BUFF: number;
    static EFFECT_REMOVE_DEBUFF: number;
    static EFFECT_SPECIAL: number;
    static EFFECT_GROW: number;
    static EFFECT_LEARN_SKILL: number;
    static EFFECT_COMMON_EVENT: number;
    static SPECIAL_EFFECT_ESCAPE: number;
    static HITTYPE_CERTAIN: number;
    static HITTYPE_PHYSICAL: number;
    static HITTYPE_MAGICAL: number;
    /** @param {[subject: Game_Battler, forcing?: boolean]} args */
    constructor(subject: Game_Battler, forcing?: boolean | undefined);
    /**
     * @param {Game_Battler} subject
     * @param {boolean} [forcing]
     */
    initialize(subject: Game_Battler, forcing?: boolean): void;
    /** @type {RMMZ.ActorID | RMMZ.EnemyID} */
    _subjectActorId: number | undefined;
    /** @type {number} */
    _subjectEnemyIndex: number | undefined;
    /** @type {boolean} */
    _forcing: boolean | undefined;
    /** @returns {void} */
    clear(): void;
    _item: Game_Item | undefined;
    _targetIndex: any;
    /**
     * @param {RMMZ.ActionTarget} subject
     * @returns {void}
     */
    setSubject(subject: RMMZ.ActionTarget): void;
    /** @returns {import("./Game_Actor").Game_Actor | import("./Game_Enemy").Game_Enemy} */
    subject(): any | any;
    /** @returns {import("./Game_Party").Game_Party | import("./Game_Troop").Game_Troop} */
    friendsUnit(): any | any;
    /** @returns {import("./Game_Party").Game_Party | import("./Game_Troop").Game_Troop} */
    opponentsUnit(): any | any;
    /**
     * @param {RMMZ.EnemyAction | null | undefined} action
     * @returns {void}
     */
    setEnemyAction(action: RMMZ.EnemyAction | null | undefined): void;
    /** @returns {void} */
    setAttack(): void;
    /** @returns {void} */
    setGuard(): void;
    /**
     * @param {RMMZ.SkillID} skillId
     * @returns {void}
     */
    setSkill(skillId: RMMZ.SkillID): void;
    /**
     * @param {RMMZ.ItemID} itemId
     * @returns {void}
     */
    setItem(itemId: RMMZ.ItemID): void;
    /**
     * @param {RMMZ.ActionItem | null} object
     * @returns {void}
     */
    setItemObject(object: RMMZ.ActionItem | null): void;
    /**
     * @param {number} targetIndex
     * @returns {void}
     */
    setTarget(targetIndex: number): void;
    /** @returns {RMMZ.ActionItem} */
    item(): RMMZ.ActionItem;
    /** @returns {boolean} */
    isSkill(): boolean;
    /** @returns {boolean} */
    isItem(): boolean;
    /** @returns {number} */
    numRepeats(): number;
    /**
     * @param {RMMZ.Scope[]} list
     * @returns {boolean}
     */
    checkItemScope(list: RMMZ.Scope[]): boolean;
    /** @returns {boolean} */
    isForOpponent(): boolean;
    /** @returns {boolean} */
    isForFriend(): boolean;
    /** @returns {boolean} */
    isForEveryone(): boolean;
    /** @returns {boolean} */
    isForAliveFriend(): boolean;
    /** @returns {boolean} */
    isForDeadFriend(): boolean;
    /** @returns {boolean} */
    isForUser(): boolean;
    /** @returns {boolean} */
    isForOne(): boolean;
    /** @returns {boolean} */
    isForRandom(): boolean;
    /** @returns {boolean} */
    isForAll(): boolean;
    /** @returns {boolean} */
    needsSelection(): boolean;
    /** @returns {number} */
    numTargets(): number;
    /**
     * @param {RMMZ.DamageType[]} list
     * @returns {boolean}
     */
    checkDamageType(list: RMMZ.DamageType[]): boolean;
    /** @returns {boolean} */
    isHpEffect(): boolean;
    /** @returns {boolean} */
    isMpEffect(): boolean;
    /** @returns {boolean} */
    isDamage(): boolean;
    /** @returns {boolean} */
    isRecover(): boolean;
    /** @returns {boolean} */
    isDrain(): boolean;
    /** @returns {boolean} */
    isHpRecover(): boolean;
    /** @returns {boolean} */
    isMpRecover(): boolean;
    /** @returns {boolean} */
    isCertainHit(): boolean;
    /** @returns {boolean} */
    isPhysical(): boolean;
    /** @returns {boolean} */
    isMagical(): boolean;
    /** @returns {boolean} */
    isAttack(): boolean;
    /** @returns {boolean} */
    isGuard(): boolean;
    /** @returns {boolean} */
    isMagicSkill(): boolean;
    /** @returns {void} */
    decideRandomTarget(): void;
    /** @returns {void} */
    setConfusion(): void;
    /** @returns {void} */
    prepare(): void;
    /** @returns {boolean | RMMZ.ActionItem} */
    isValid(): boolean | RMMZ.ActionItem;
    /** @returns {number} */
    speed(): number;
    /** @returns {(import("./Game_Actor").Game_Actor | import("./Game_Enemy").Game_Enemy)[]} */
    makeTargets(): (any | any)[];
    /**
     * @param {(RMMZ.ActionTarget | null)[]} targets
     * @returns {(import("./Game_Actor").Game_Actor | import("./Game_Enemy").Game_Enemy)[]}
     */
    repeatTargets(targets: (RMMZ.ActionTarget | null)[]): (any | any)[];
    /** @returns {import("./Game_Actor").Game_Actor | import("./Game_Enemy").Game_Enemy | null} */
    confusionTarget(): any | any | null;
    /** @returns {(import("./Game_Actor").Game_Actor | import("./Game_Enemy").Game_Enemy)[]} */
    targetsForEveryone(): (any | any)[];
    /** @returns {(import("./Game_Actor").Game_Actor | import("./Game_Enemy").Game_Enemy | null)[]} */
    targetsForOpponents(): (any | any | null)[];
    /** @returns {(import("./Game_Actor").Game_Actor | import("./Game_Enemy").Game_Enemy | null)[]} */
    targetsForFriends(): (any | any | null)[];
    /**
     * @param {RMMZ.ActionUnit} unit
     * @returns {(import("./Game_Actor").Game_Actor | import("./Game_Enemy").Game_Enemy | null)[]}
     */
    randomTargets(unit: RMMZ.ActionUnit): (any | any | null)[];
    /**
     * @param {RMMZ.ActionUnit} unit
     * @returns {(import("./Game_Actor").Game_Actor | import("./Game_Enemy").Game_Enemy)[]}
     */
    targetsForDead(unit: RMMZ.ActionUnit): (any | any)[];
    /**
     * @param {RMMZ.ActionUnit} unit
     * @returns {(import("./Game_Actor").Game_Actor | import("./Game_Enemy").Game_Enemy | null)[]}
     */
    targetsForAlive(unit: RMMZ.ActionUnit): (any | any | null)[];
    /**
     * @param {RMMZ.ActionUnit} unit
     * @returns {(import("./Game_Actor").Game_Actor | import("./Game_Enemy").Game_Enemy)[]}
     */
    targetsForDeadAndAlive(unit: RMMZ.ActionUnit): (any | any)[];
    /** @returns {number} */
    evaluate(): number;
    /** @returns {(import("./Game_Actor").Game_Actor | import("./Game_Enemy").Game_Enemy)[]} */
    itemTargetCandidates(): (any | any)[];
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {number | undefined}
     */
    evaluateWithTarget(target: RMMZ.ActionTarget): number | undefined;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {boolean}
     */
    testApply(target: RMMZ.ActionTarget): boolean;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {boolean}
     */
    testLifeAndDeath(target: RMMZ.ActionTarget): boolean;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {boolean}
     */
    hasItemAnyValidEffects(target: RMMZ.ActionTarget): boolean;
    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffectBase} effect
     * @returns {boolean}
     */
    testItemEffect(target: RMMZ.ActionTarget, effect: RMMZ.ActionEffectBase): boolean;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {number}
     */
    itemCnt(target: RMMZ.ActionTarget): number;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {number}
     */
    itemMrf(target: RMMZ.ActionTarget): number;
    /**
     * @param {Game_Battler} target
     * @returns {number}
     */
    itemHit(target: Game_Battler): number;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {number}
     */
    itemEva(target: RMMZ.ActionTarget): number;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {number}
     */
    itemCri(target: RMMZ.ActionTarget): number;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    apply(target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @param {boolean} critical
     * @returns {number}
     */
    makeDamageValue(target: RMMZ.ActionTarget, critical: boolean): number;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {number}
     */
    evalDamageFormula(target: RMMZ.ActionTarget): number;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {number}
     */
    calcElementRate(target: RMMZ.ActionTarget): number;
    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.DataID[]} elements
     * @returns {number}
     */
    elementsMaxRate(target: RMMZ.ActionTarget, elements: RMMZ.DataID[]): number;
    /**
     * @param {number} damage
     * @returns {number}
     */
    applyCritical(damage: number): number;
    /**
     * @param {number} damage
     * @param {number} variance
     * @returns {number}
     */
    applyVariance(damage: number, variance: number): number;
    /**
     * @param {number} damage
     * @param {RMMZ.ActionTarget} target
     * @returns {number}
     */
    applyGuard(damage: number, target: RMMZ.ActionTarget): number;
    /**
     * @param {RMMZ.ActionTarget} target
     * @param {number} value
     * @returns {void}
     */
    executeDamage(target: RMMZ.ActionTarget, value: number): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @param {number} value
     * @returns {void}
     */
    executeHpDamage(target: RMMZ.ActionTarget, value: number): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @param {number} value
     * @returns {void}
     */
    executeMpDamage(target: RMMZ.ActionTarget, value: number): void;
    /**
     * @param {number} value
     * @returns {void}
     */
    gainDrainedHp(value: number): void;
    /**
     * @param {number} value
     * @returns {void}
     */
    gainDrainedMp(value: number): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffectBase} effect
     * @returns {void}
     */
    applyItemEffect(target: RMMZ.ActionTarget, effect: RMMZ.ActionEffectBase): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffect<typeof Game_Action.EFFECT_RECOVER_HP>} effect
     * @returns {void}
     */
    itemEffectRecoverHp(target: RMMZ.ActionTarget, effect: RMMZ.ActionEffect<typeof Game_Action.EFFECT_RECOVER_HP>): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffect<typeof Game_Action.EFFECT_RECOVER_MP>} effect
     * @returns {void}
     */
    itemEffectRecoverMp(target: RMMZ.ActionTarget, effect: RMMZ.ActionEffect<typeof Game_Action.EFFECT_RECOVER_MP>): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffect<typeof Game_Action.EFFECT_GAIN_TP>} effect
     * @returns {void}
     */
    itemEffectGainTp(target: RMMZ.ActionTarget, effect: RMMZ.ActionEffect<typeof Game_Action.EFFECT_GAIN_TP>): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffect<typeof Game_Action.EFFECT_ADD_STATE>} effect
     * @returns {void}
     */
    itemEffectAddState(target: RMMZ.ActionTarget, effect: RMMZ.ActionEffect<typeof Game_Action.EFFECT_ADD_STATE>): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffect<typeof Game_Action.EFFECT_ADD_STATE>} effect
     * @returns {void}
     */
    itemEffectAddAttackState(target: RMMZ.ActionTarget, effect: RMMZ.ActionEffect<typeof Game_Action.EFFECT_ADD_STATE>): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffect<typeof Game_Action.EFFECT_ADD_STATE>} effect
     * @returns {void}
     */
    itemEffectAddNormalState(target: RMMZ.ActionTarget, effect: RMMZ.ActionEffect<typeof Game_Action.EFFECT_ADD_STATE>): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffect<typeof Game_Action.EFFECT_REMOVE_STATE>} effect
     * @returns {void}
     */
    itemEffectRemoveState(target: RMMZ.ActionTarget, effect: RMMZ.ActionEffect<typeof Game_Action.EFFECT_REMOVE_STATE>): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffect<typeof Game_Action.EFFECT_ADD_BUFF>} effect
     * @returns {void}
     */
    itemEffectAddBuff(target: RMMZ.ActionTarget, effect: RMMZ.ActionEffect<typeof Game_Action.EFFECT_ADD_BUFF>): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffect<typeof Game_Action.EFFECT_ADD_DEBUFF>} effect
     * @returns {void}
     */
    itemEffectAddDebuff(target: RMMZ.ActionTarget, effect: RMMZ.ActionEffect<typeof Game_Action.EFFECT_ADD_DEBUFF>): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffect<typeof Game_Action.EFFECT_REMOVE_BUFF>} effect
     * @returns {void}
     */
    itemEffectRemoveBuff(target: RMMZ.ActionTarget, effect: RMMZ.ActionEffect<typeof Game_Action.EFFECT_REMOVE_BUFF>): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffect<typeof Game_Action.EFFECT_REMOVE_DEBUFF>} effect
     * @returns {void}
     */
    itemEffectRemoveDebuff(target: RMMZ.ActionTarget, effect: RMMZ.ActionEffect<typeof Game_Action.EFFECT_REMOVE_DEBUFF>): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffect<typeof Game_Action.EFFECT_SPECIAL>} effect
     * @returns {void}
     */
    itemEffectSpecial(target: RMMZ.ActionTarget, effect: RMMZ.ActionEffect<typeof Game_Action.EFFECT_SPECIAL>): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffect<typeof Game_Action.EFFECT_GROW>} effect
     * @returns {void}
     */
    itemEffectGrow(target: RMMZ.ActionTarget, effect: RMMZ.ActionEffect<typeof Game_Action.EFFECT_GROW>): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffect<typeof Game_Action.EFFECT_LEARN_SKILL>} effect
     * @returns {void}
     */
    itemEffectLearnSkill(target: RMMZ.ActionTarget, effect: RMMZ.ActionEffect<typeof Game_Action.EFFECT_LEARN_SKILL>): void;
    /**
     * @param {Game_Battler} target
     * @param {RMMZ.ActionEffectBase} effect
     * @returns {void}
     */
    itemEffectCommonEvent(target: Game_Battler, effect: RMMZ.ActionEffectBase): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    makeSuccess(target: RMMZ.ActionTarget): void;
    /**
     * @param {Game_Battler} target
     * @returns {void}
     */
    applyItemUserEffect(target: Game_Battler): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {number}
     */
    lukEffectRate(target: RMMZ.ActionTarget): number;
    /** @returns {void} */
    applyGlobal(): void;
    /** @returns {void} */
    updateLastUsed(): void;
    /** @returns {void} */
    updateLastSubject(): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    updateLastTarget(target: RMMZ.ActionTarget): void;
}
/**
 * The game object class for a result of a battle action. For convinience, all
 * member variables in this class are public.
 */
declare class Game_ActionResult {
    /** @param {[]} args */
    constructor();
    initialize(): void;
    /** @returns {void} */
    clear(): void;
    used: boolean | undefined;
    missed: boolean | undefined;
    evaded: boolean | undefined;
    physical: boolean | undefined;
    drain: boolean | undefined;
    critical: boolean | undefined;
    success: boolean | undefined;
    hpAffected: boolean | undefined;
    hpDamage: number | undefined;
    mpDamage: number | undefined;
    tpDamage: number | undefined;
    addedStates: any[] | undefined;
    removedStates: any[] | undefined;
    addedBuffs: any[] | undefined;
    addedDebuffs: any[] | undefined;
    removedBuffs: any[] | undefined;
    /** @returns {import("../data").DataState[]} */
    addedStateObjects(): any[];
    /** @returns {import("../data").DataState[]} */
    removedStateObjects(): any[];
    /** @returns {boolean} */
    isStatusAffected(): boolean;
    /** @returns {boolean} */
    isHit(): boolean;
    /**
     * @param {RMMZ.StateID} stateId
     * @returns {boolean}
     */
    isStateAdded(stateId: RMMZ.StateID): boolean;
    /**
     * @param {RMMZ.StateID} stateId
     * @returns {void}
     */
    pushAddedState(stateId: RMMZ.StateID): void;
    /**
     * @param {RMMZ.StateID} stateId
     * @returns {boolean}
     */
    isStateRemoved(stateId: RMMZ.StateID): boolean;
    /**
     * @param {RMMZ.StateID} stateId
     * @returns {void}
     */
    pushRemovedState(stateId: RMMZ.StateID): void;
    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {boolean}
     */
    isBuffAdded(paramId: RMMZ.ParamID): boolean;
    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {void}
     */
    pushAddedBuff(paramId: RMMZ.ParamID): void;
    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {boolean}
     */
    isDebuffAdded(paramId: RMMZ.ParamID): boolean;
    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {void}
     */
    pushAddedDebuff(paramId: RMMZ.ParamID): void;
    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {boolean}
     */
    isBuffRemoved(paramId: RMMZ.ParamID): boolean;
    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {void}
     */
    pushRemovedBuff(paramId: RMMZ.ParamID): void;
}
/**
 * The superclass of Game_Battler. It mainly contains parameters calculation.
 */
declare class Game_BattlerBase {
    static TRAIT_ELEMENT_RATE: number;
    static TRAIT_DEBUFF_RATE: number;
    static TRAIT_STATE_RATE: number;
    static TRAIT_STATE_RESIST: number;
    static TRAIT_PARAM: number;
    static TRAIT_XPARAM: number;
    static TRAIT_SPARAM: number;
    static TRAIT_ATTACK_ELEMENT: number;
    static TRAIT_ATTACK_STATE: number;
    static TRAIT_ATTACK_SPEED: number;
    static TRAIT_ATTACK_TIMES: number;
    static TRAIT_ATTACK_SKILL: number;
    static TRAIT_STYPE_ADD: number;
    static TRAIT_STYPE_SEAL: number;
    static TRAIT_SKILL_ADD: number;
    static TRAIT_SKILL_SEAL: number;
    static TRAIT_EQUIP_WTYPE: number;
    static TRAIT_EQUIP_ATYPE: number;
    static TRAIT_EQUIP_LOCK: number;
    static TRAIT_EQUIP_SEAL: number;
    static TRAIT_SLOT_TYPE: number;
    static TRAIT_ACTION_PLUS: number;
    static TRAIT_SPECIAL_FLAG: number;
    static TRAIT_COLLAPSE_TYPE: number;
    static TRAIT_PARTY_ABILITY: number;
    static FLAG_ID_AUTO_BATTLE: number;
    static FLAG_ID_GUARD: number;
    static FLAG_ID_SUBSTITUTE: number;
    static FLAG_ID_PRESERVE_TP: number;
    static ICON_BUFF_START: number;
    static ICON_DEBUFF_START: number;
    /** @param {[]} args */
    constructor();
    /** @type {number} */
    get hp(): number;
    /** @type {number} */
    get mp(): number;
    /** @type {number} */
    get tp(): number;
    /** @type {number} */
    get mhp(): number;
    /** @type {number} */
    get mmp(): number;
    /** @type {number} */
    get atk(): number;
    /** @type {number} */
    get def(): number;
    /** @type {number} */
    get mat(): number;
    /** @type {number} */
    get mdf(): number;
    /** @type {number} */
    get agi(): number;
    /** @type {number} */
    get luk(): number;
    /** @type {number} */
    get hit(): number;
    /** @type {number} */
    get eva(): number;
    /** @type {number} */
    get cri(): number;
    /** @type {number} */
    get cev(): number;
    /** @type {number} */
    get mev(): number;
    /** @type {number} */
    get mrf(): number;
    /** @type {number} */
    get cnt(): number;
    /** @type {number} */
    get hrg(): number;
    /** @type {number} */
    get mrg(): number;
    /** @type {number} */
    get trg(): number;
    /** @type {number} */
    get tgr(): number;
    /** @type {number} */
    get grd(): number;
    /** @type {number} */
    get rec(): number;
    /** @type {number} */
    get pha(): number;
    /** @type {number} */
    get mcr(): number;
    /** @type {number} */
    get tcr(): number;
    /** @type {number} */
    get pdr(): number;
    /** @type {number} */
    get mdr(): number;
    /** @type {number} */
    get fdr(): number;
    /** @type {number} */
    get exr(): number;
    initialize(...args: never[]): void;
    /** @returns {void} */
    initMembers(): void;
    /** @type {number} */
    _hp: number | undefined;
    /** @type {number} */
    _mp: number | undefined;
    /** @type {number} */
    _tp: number | undefined;
    /** @type {boolean} */
    _hidden: boolean | undefined;
    /** @returns {void} */
    clearParamPlus(): void;
    _paramPlus: number[] | undefined;
    /** @returns {void} */
    clearStates(): void;
    _states: any[] | undefined;
    _stateTurns: {} | undefined;
    /**
     * @param {RMMZ.StateID} stateId
     * @returns {void}
     */
    eraseState(stateId: RMMZ.StateID): void;
    /**
     * @param {RMMZ.StateID} stateId
     * @returns {boolean}
     */
    isStateAffected(stateId: RMMZ.StateID): boolean;
    /** @returns {boolean} */
    isDeathStateAffected(): boolean;
    /** @returns {number} */
    deathStateId(): number;
    /**
     * @param {RMMZ.StateID} stateId
     * @returns {void}
     */
    resetStateCounts(stateId: RMMZ.StateID): void;
    /**
     * @param {RMMZ.StateID} stateId
     * @returns {boolean}
     */
    isStateExpired(stateId: RMMZ.StateID): boolean;
    /** @returns {void} */
    updateStateTurns(): void;
    /** @returns {void} */
    clearBuffs(): void;
    _buffs: number[] | undefined;
    _buffTurns: number[] | undefined;
    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {void}
     */
    eraseBuff(paramId: RMMZ.ParamID): void;
    /** @returns {8} */
    buffLength(): 8;
    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {number}
     */
    buff(paramId: RMMZ.ParamID): number;
    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {boolean}
     */
    isBuffAffected(paramId: RMMZ.ParamID): boolean;
    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {boolean}
     */
    isDebuffAffected(paramId: RMMZ.ParamID): boolean;
    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {boolean}
     */
    isBuffOrDebuffAffected(paramId: RMMZ.ParamID): boolean;
    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {boolean}
     */
    isMaxBuffAffected(paramId: RMMZ.ParamID): boolean;
    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {boolean}
     */
    isMaxDebuffAffected(paramId: RMMZ.ParamID): boolean;
    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {void}
     */
    increaseBuff(paramId: RMMZ.ParamID): void;
    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {void}
     */
    decreaseBuff(paramId: RMMZ.ParamID): void;
    /**
     * @param {RMMZ.ParamID} paramId
     * @param {number} turns
     * @returns {void}
     */
    overwriteBuffTurns(paramId: RMMZ.ParamID, turns: number): void;
    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {boolean}
     */
    isBuffExpired(paramId: RMMZ.ParamID): boolean;
    /** @returns {void} */
    updateBuffTurns(): void;
    /** @returns {void} */
    die(): void;
    /** @returns {void} */
    revive(): void;
    /** @returns {import("../data").DataState[]} */
    states(): any[];
    /** @returns {number[]} */
    stateIcons(): number[];
    /** @returns {number[]} */
    buffIcons(): number[];
    /**
     * @param {number} buffLevel
     * @param {RMMZ.ParamID} paramId
     * @returns {number}
     */
    buffIconIndex(buffLevel: number, paramId: RMMZ.ParamID): number;
    /** @returns {number[]} */
    allIcons(): number[];
    /** @returns {{ traits: RMMZ.Trait[]; }[]} */
    traitObjects(): {
        traits: RMMZ.Trait[];
    }[];
    /** @returns {RMMZ.Trait[]} */
    allTraits(): RMMZ.Trait[];
    /**
     * @param {RMMZ.TraitType} code
     * @returns {RMMZ.Trait[]}
     */
    traits(code: RMMZ.TraitType): RMMZ.Trait[];
    /**
     * @param {RMMZ.TraitType} code
     * @param {RMMZ.DataID} id
     * @returns {RMMZ.Trait[]}
     */
    traitsWithId(code: RMMZ.TraitType, id: RMMZ.DataID): RMMZ.Trait[];
    /**
     * @param {RMMZ.TraitType} code
     * @param {RMMZ.DataID} id
     * @returns {number}
     */
    traitsPi(code: RMMZ.TraitType, id: RMMZ.DataID): number;
    /**
     * @param {RMMZ.TraitType} code
     * @param {RMMZ.DataID} id
     * @returns {number}
     */
    traitsSum(code: RMMZ.TraitType, id: RMMZ.DataID): number;
    /**
     * @param {RMMZ.TraitType} code
     * @returns {number}
     */
    traitsSumAll(code: RMMZ.TraitType): number;
    /**
     * @param {RMMZ.TraitType} code
     * @returns {number[]}
     */
    traitsSet(code: RMMZ.TraitType): number[];
    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {number}
     */
    paramBase(paramId: RMMZ.ParamID): number;
    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {number}
     */
    paramPlus(paramId: RMMZ.ParamID): number;
    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {number}
     */
    paramBasePlus(paramId: RMMZ.ParamID): number;
    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {0 | 1}
     */
    paramMin(paramId: RMMZ.ParamID): 0 | 1;
    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {number}
     */
    paramMax(paramId: RMMZ.ParamID): number;
    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {number}
     */
    paramRate(paramId: RMMZ.ParamID): number;
    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {number}
     */
    paramBuffRate(paramId: RMMZ.ParamID): number;
    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {number}
     */
    param(paramId: RMMZ.ParamID): number;
    /**
     * @param {RMMZ.DataID} xparamId
     * @returns {number}
     */
    xparam(xparamId: RMMZ.DataID): number;
    /**
     * @param {RMMZ.DataID} sparamId
     * @returns {number}
     */
    sparam(sparamId: RMMZ.DataID): number;
    /**
     * @param {RMMZ.DataID} elementId
     * @returns {number}
     */
    elementRate(elementId: RMMZ.DataID): number;
    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {number}
     */
    debuffRate(paramId: RMMZ.ParamID): number;
    /**
     * @param {RMMZ.StateID} stateId
     * @returns {number}
     */
    stateRate(stateId: RMMZ.StateID): number;
    /** @returns {number[]} */
    stateResistSet(): number[];
    /**
     * @param {RMMZ.StateID} stateId
     * @returns {boolean}
     */
    isStateResist(stateId: RMMZ.StateID): boolean;
    /** @returns {number[]} */
    attackElements(): number[];
    /** @returns {number[]} */
    attackStates(): number[];
    /**
     * @param {RMMZ.StateID} stateId
     * @returns {number}
     */
    attackStatesRate(stateId: RMMZ.StateID): number;
    /** @returns {number} */
    attackSpeed(): number;
    /** @returns {number} */
    attackTimesAdd(): number;
    /** @returns {number} */
    attackSkillId(): number;
    /** @returns {number[]} */
    addedSkillTypes(): number[];
    /**
     * @param {RMMZ.SkillType} stypeId
     * @returns {boolean}
     */
    isSkillTypeSealed(stypeId: RMMZ.SkillType): boolean;
    /** @returns {number[]} */
    addedSkills(): number[];
    /**
     * @param {RMMZ.SkillID} skillId
     * @returns {boolean}
     */
    isSkillSealed(skillId: RMMZ.SkillID): boolean;
    /**
     * @param {RMMZ.WeaponType} wtypeId
     * @returns {boolean}
     */
    isEquipWtypeOk(wtypeId: RMMZ.WeaponType): boolean;
    /**
     * @param {RMMZ.ArmorType} atypeId
     * @returns {boolean}
     */
    isEquipAtypeOk(atypeId: RMMZ.ArmorType): boolean;
    /**
     * @param {RMMZ.ElementType} etypeId
     * @returns {boolean}
     */
    isEquipTypeLocked(etypeId: RMMZ.ElementType): boolean;
    /**
     * @param {RMMZ.ElementType} etypeId
     * @returns {boolean}
     */
    isEquipTypeSealed(etypeId: RMMZ.ElementType): boolean;
    /** @returns {number} */
    slotType(): number;
    /** @returns {boolean} */
    isDualWield(): boolean;
    /** @returns {number[]} */
    actionPlusSet(): number[];
    /**
     * @param {RMMZ.DataID} flagId
     * @returns {boolean}
     */
    specialFlag(flagId: RMMZ.DataID): boolean;
    /** @returns {number} */
    collapseType(): number;
    /**
     * @param {RMMZ.DataID} abilityId
     * @returns {boolean}
     */
    partyAbility(abilityId: RMMZ.DataID): boolean;
    /** @returns {boolean} */
    isAutoBattle(): boolean;
    /** @returns {boolean} */
    isGuard(): boolean;
    /** @returns {boolean} */
    isSubstitute(): boolean;
    /** @returns {boolean} */
    isPreserveTp(): boolean;
    /**
     * @param {RMMZ.ParamID} paramId
     * @param {number} value
     * @returns {void}
     */
    addParam(paramId: RMMZ.ParamID, value: number): void;
    /**
     * @param {number} hp
     * @returns {void}
     */
    setHp(hp: number): void;
    /**
     * @param {number} mp
     * @returns {void}
     */
    setMp(mp: number): void;
    /**
     * @param {number} tp
     * @returns {void}
     */
    setTp(tp: number): void;
    /** @returns {number} */
    maxTp(): number;
    /** @returns {void} */
    refresh(): void;
    /** @returns {void} */
    recoverAll(): void;
    /** @returns {number} */
    hpRate(): number;
    /** @returns {number} */
    mpRate(): number;
    /** @returns {number} */
    tpRate(): number;
    /** @returns {void} */
    hide(): void;
    /** @returns {void} */
    appear(): void;
    /** @returns {boolean} */
    isHidden(): boolean;
    /** @returns {boolean} */
    isAppeared(): boolean;
    /** @returns {boolean} */
    isDead(): boolean;
    /** @returns {boolean} */
    isAlive(): boolean;
    /** @returns {boolean} */
    isDying(): boolean;
    /** @returns {boolean} */
    isRestricted(): boolean;
    /** @returns {boolean} */
    canInput(): boolean;
    /** @returns {boolean} */
    canMove(): boolean;
    /** @returns {boolean} */
    isConfused(): boolean;
    /** @returns {number} */
    confusionLevel(): number;
    /** @returns {this is Game_Actor} */
    isActor(): this is Game_Actor;
    /** @returns {this is Game_Enemy} */
    isEnemy(): this is Game_Enemy;
    /** @returns {void} */
    sortStates(): void;
    /** @returns {number} */
    restriction(): number;
    /**
     * @param {RMMZ.StateID} stateId
     * @returns {void}
     */
    addNewState(stateId: RMMZ.StateID): void;
    /** @returns {void} */
    onRestrict(): void;
    /** @returns {string} */
    mostImportantStateText(): string;
    /** @returns {import("../data").Motion} */
    stateMotionIndex(): any;
    /** @returns {import("../data").Overlay} */
    stateOverlayIndex(): any;
    /**
     * @param {RMMZ.DataSkill} skill
     * @returns {boolean}
     */
    isSkillWtypeOk(skill: RMMZ.DataSkill): boolean;
    /**
     * @param {RMMZ.DataSkill} skill
     * @returns {number}
     */
    skillMpCost(skill: RMMZ.DataSkill): number;
    /**
     * @param {RMMZ.DataSkill} skill
     * @returns {number}
     */
    skillTpCost(skill: RMMZ.DataSkill): number;
    /**
     * @param {RMMZ.DataSkill} skill
     * @returns {boolean}
     */
    canPaySkillCost(skill: RMMZ.DataSkill): boolean;
    /**
     * @param {RMMZ.DataSkill} skill
     * @returns {void}
     */
    paySkillCost(skill: RMMZ.DataSkill): void;
    /**
     * @param {RMMZ.DataSkill | RMMZ.DataItem} item
     * @returns {boolean}
     */
    isOccasionOk(item: RMMZ.DataSkill | RMMZ.DataItem): boolean;
    /**
     * @param {RMMZ.DataSkill | RMMZ.DataItem} item
     * @returns {boolean}
     */
    meetsUsableItemConditions(item: RMMZ.DataSkill | RMMZ.DataItem): boolean;
    /**
     * @param {RMMZ.DataSkill} skill
     * @returns {boolean}
     */
    meetsSkillConditions(skill: RMMZ.DataSkill): boolean;
    /**
     * @param {RMMZ.DataSkill | RMMZ.DataItem} item
     * @returns {boolean}
     */
    meetsItemConditions(item: RMMZ.DataSkill | RMMZ.DataItem): boolean;
    /**
     * @param {RMMZ.DataItemBase | null} item
     * @returns {boolean}
     */
    canUse(item: RMMZ.DataItemBase | null): boolean;
    /**
     * @param {RMMZ.DataItemBase} item
     * @returns {item is RMMZ.DataWeapon | RMMZ.DataArmor}
     */
    canEquip(item: RMMZ.DataItemBase): item is RMMZ.DataWeapon | RMMZ.DataArmor;
    /**
     * @param {RMMZ.DataWeapon} item
     * @returns {boolean}
     */
    canEquipWeapon(item: RMMZ.DataWeapon): boolean;
    /**
     * @param {RMMZ.DataArmor} item
     * @returns {boolean}
     */
    canEquipArmor(item: RMMZ.DataArmor): boolean;
    /** @returns {number} */
    guardSkillId(): number;
    /** @returns {boolean} */
    canAttack(): boolean;
    /** @returns {boolean} */
    canGuard(): boolean;
}
/**
 * The superclass of Game_Actor and Game_Enemy. It contains methods for sprites
 * and actions.
 */
declare class Game_Battler extends Game_BattlerBase {
    /** @type {Game_Action[]} */
    _actions: Game_Action[] | undefined;
    /** @type {number} */
    _speed: number | undefined;
    /** @type {Game_ActionResult} */
    _result: Game_ActionResult | undefined;
    /** @type {RMMZ.ActionState | ""} */
    _actionState: "" | RMMZ.ActionState | undefined;
    /** @type {number} */
    _lastTargetIndex: number | undefined;
    /** @type {boolean} */
    _damagePopup: boolean | undefined;
    /** @type {RMMZ.BattlerEffectType | null} */
    _effectType: RMMZ.BattlerEffectType | null | undefined;
    /** @type {RMMZ.BattlerMotionType | null} */
    _motionType: RMMZ.BattlerMotionType | null | undefined;
    /** @type {number} */
    _weaponImageId: number | undefined;
    /** @type {boolean} */
    _motionRefresh: boolean | undefined;
    /** @type {boolean} */
    _selected: boolean | undefined;
    /** @type {string} */
    _tpbState: string | undefined;
    /** @type {number} */
    _tpbChargeTime: number | undefined;
    /** @type {number} */
    _tpbCastTime: number | undefined;
    /** @type {number} */
    _tpbIdleTime: number | undefined;
    /** @type {number} */
    _tpbTurnCount: number | undefined;
    /** @type {boolean} */
    _tpbTurnEnd: boolean | undefined;
    /** @returns {void} */
    clearDamagePopup(): void;
    /** @returns {void} */
    clearWeaponAnimation(): void;
    /** @returns {void} */
    clearEffect(): void;
    /** @returns {void} */
    clearMotion(): void;
    /**
     * @param {RMMZ.BattlerEffectType} effectType
     * @returns {void}
     */
    requestEffect(effectType: RMMZ.BattlerEffectType): void;
    /**
     * @param {RMMZ.BattlerMotionType} motionType
     * @returns {void}
     */
    requestMotion(motionType: RMMZ.BattlerMotionType): void;
    /** @returns {void} */
    requestMotionRefresh(): void;
    /** @returns {void} */
    cancelMotionRefresh(): void;
    /** @returns {void} */
    select(): void;
    /** @returns {void} */
    deselect(): void;
    /** @returns {boolean} */
    isDamagePopupRequested(): boolean;
    /** @returns {boolean} */
    isEffectRequested(): boolean;
    /** @returns {boolean} */
    isMotionRequested(): boolean;
    /** @returns {boolean} */
    isWeaponAnimationRequested(): boolean;
    /** @returns {boolean} */
    isMotionRefreshRequested(): boolean;
    /** @returns {boolean} */
    isSelected(): boolean;
    /** @returns {RMMZ.BattlerEffectType | null} */
    effectType(): RMMZ.BattlerEffectType | null;
    /** @returns {RMMZ.BattlerMotionType | null} */
    motionType(): RMMZ.BattlerMotionType | null;
    /** @returns {number} */
    weaponImageId(): number;
    /** @returns {void} */
    startDamagePopup(): void;
    /** @returns {boolean} */
    shouldPopupDamage(): boolean;
    /**
     * @param {RMMZ.DataID} weaponImageId
     * @returns {void}
     */
    startWeaponAnimation(weaponImageId: RMMZ.DataID): void;
    /**
     * @param {number} index
     * @returns {Game_Action}
     */
    action(index: number): Game_Action;
    /**
     * @param {number} index
     * @param {Game_Action} action
     * @returns {void}
     */
    setAction(index: number, action: Game_Action): void;
    /** @returns {number} */
    numActions(): number;
    /** @returns {void} */
    clearActions(): void;
    /** @returns {Game_ActionResult} */
    result(): Game_ActionResult;
    /** @returns {void} */
    clearResult(): void;
    /** @returns {void} */
    clearTpbChargeTime(): void;
    /** @returns {void} */
    applyTpbPenalty(): void;
    /**
     * @param {boolean} [advantageous]
     * @returns {void}
     */
    initTpbChargeTime(advantageous?: boolean): void;
    /** @returns {number} */
    tpbChargeTime(): number;
    /** @returns {void} */
    startTpbCasting(): void;
    /** @returns {void} */
    startTpbAction(): void;
    /** @returns {boolean} */
    isTpbCharged(): boolean;
    /** @returns {boolean} */
    isTpbReady(): boolean;
    /** @returns {boolean} */
    isTpbTimeout(): boolean;
    /** @returns {void} */
    updateTpb(): void;
    /** @returns {void} */
    updateTpbChargeTime(): void;
    /** @returns {void} */
    updateTpbCastTime(): void;
    /** @returns {void} */
    updateTpbAutoBattle(): void;
    /** @returns {void} */
    updateTpbIdleTime(): void;
    /** @returns {number} */
    tpbAcceleration(): number;
    /** @returns {number} */
    tpbRelativeSpeed(): number;
    /** @returns {number} */
    tpbSpeed(): number;
    /** @returns {number} */
    tpbBaseSpeed(): number;
    /** @returns {number} */
    tpbRequiredCastTime(): number;
    /** @returns {void} */
    onTpbCharged(): void;
    /** @returns {boolean} */
    shouldDelayTpbCharge(): boolean;
    /** @returns {void} */
    finishTpbCharge(): void;
    /** @returns {boolean} */
    isTpbTurnEnd(): boolean;
    /** @returns {void} */
    initTpbTurn(): void;
    /** @returns {void} */
    startTpbTurn(): void;
    /** @returns {void} */
    makeTpbActions(): void;
    /** @returns {void} */
    onTpbTimeout(): void;
    /** @returns {number} */
    turnCount(): number;
    /**
     * @param {RMMZ.StateID} stateId
     * @returns {void}
     */
    addState(stateId: RMMZ.StateID): void;
    /**
     * @param {RMMZ.StateID} stateId
     * @returns {boolean}
     */
    isStateAddable(stateId: RMMZ.StateID): boolean;
    /**
     * @param {RMMZ.StateID} stateId
     * @returns {boolean}
     */
    isStateRestrict(stateId: RMMZ.StateID): boolean;
    /**
     * @param {RMMZ.StateID} stateId
     * @returns {void}
     */
    removeState(stateId: RMMZ.StateID): void;
    /** @returns {void} */
    escape(): void;
    /**
     * @param {RMMZ.ParamID} paramId
     * @param {number} turns
     * @returns {void}
     */
    addBuff(paramId: RMMZ.ParamID, turns: number): void;
    /**
     * @param {RMMZ.ParamID} paramId
     * @param {number} turns
     * @returns {void}
     */
    addDebuff(paramId: RMMZ.ParamID, turns: number): void;
    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {void}
     */
    removeBuff(paramId: RMMZ.ParamID): void;
    /** @returns {void} */
    removeBattleStates(): void;
    /** @returns {void} */
    removeAllBuffs(): void;
    /**
     * @param {RMMZ.AutoRemovalTiming} timing
     * @returns {void}
     */
    removeStatesAuto(timing: RMMZ.AutoRemovalTiming): void;
    /** @returns {void} */
    removeBuffsAuto(): void;
    /** @returns {void} */
    removeStatesByDamage(): void;
    /** @returns {number} */
    makeActionTimes(): number;
    /** @returns {void} */
    makeActions(): void;
    /** @returns {number} */
    speed(): number;
    /** @returns {void} */
    makeSpeed(): void;
    /** @returns {Game_Action} */
    currentAction(): Game_Action;
    /** @returns {void} */
    removeCurrentAction(): void;
    /**
     * @param {Game_Actor | Game_Enemy} target
     * @returns {void}
     */
    setLastTarget(target: Game_Actor | Game_Enemy): void;
    /**
     * @param {RMMZ.SkillID} skillId
     * @param {RMMZ.ActorID | RMMZ.EnemyID} targetIndex
     * @returns {void}
     */
    forceAction(skillId: RMMZ.SkillID, targetIndex: RMMZ.ActorID | RMMZ.EnemyID): void;
    /**
     * @param {RMMZ.ActionItem} item
     * @returns {void}
     */
    useItem(item: RMMZ.ActionItem): void;
    /**
     * @param {RMMZ.DataItem} item
     * @returns {void}
     */
    consumeItem(item: RMMZ.DataItem): void;
    /**
     * @param {number} value
     * @returns {void}
     */
    gainHp(value: number): void;
    /**
     * @param {number} value
     * @returns {void}
     */
    gainMp(value: number): void;
    /**
     * @param {number} value
     * @returns {void}
     */
    gainTp(value: number): void;
    /**
     * @param {number} value
     * @returns {void}
     */
    gainSilentTp(value: number): void;
    /** @returns {void} */
    initTp(): void;
    /** @returns {void} */
    clearTp(): void;
    /**
     * @param {number} damageRate
     * @returns {void}
     */
    chargeTpByDamage(damageRate: number): void;
    /** @returns {void} */
    regenerateHp(): void;
    /** @returns {number} */
    maxSlipDamage(): number;
    /** @returns {void} */
    regenerateMp(): void;
    /** @returns {void} */
    regenerateTp(): void;
    /** @returns {void} */
    regenerateAll(): void;
    /**
     * @param {boolean} [advantageous]
     * @returns {void}
     */
    onBattleStart(advantageous?: boolean): void;
    /** @returns {void} */
    onAllActionsEnd(): void;
    /** @returns {void} */
    onTurnEnd(): void;
    /** @returns {void} */
    onBattleEnd(): void;
    /**
     * @param {number} value
     * @returns {void}
     */
    onDamage(value: number): void;
    /**
     * @param {RMMZ.ActionState} actionState
     * @returns {void}
     */
    setActionState(actionState: RMMZ.ActionState): void;
    /** @returns {boolean} */
    isUndecided(): boolean;
    /** @returns {boolean} */
    isInputting(): boolean;
    /** @returns {boolean} */
    isWaiting(): boolean;
    /** @returns {boolean} */
    isActing(): boolean;
    /** @returns {boolean} */
    isChanting(): boolean;
    /** @returns {boolean} */
    isGuardWaiting(): boolean;
    /**
     * @param {Game_Action} action
     * @returns {void}
     */
    performActionStart(action: Game_Action): void;
    /**
     * @param {Game_Action} action
     * @returns {void}
     */
    performAction(action: Game_Action): void;
    /** @returns {void} */
    performActionEnd(): void;
    /** @returns {void} */
    performDamage(): void;
    /** @returns {void} */
    performMiss(): void;
    /** @returns {void} */
    performRecovery(): void;
    /** @returns {void} */
    performEvasion(): void;
    /** @returns {void} */
    performMagicEvasion(): void;
    /** @returns {void} */
    performCounter(): void;
    /** @returns {void} */
    performReflection(): void;
    /**
     * @param {Game_Battler} target
     * @returns {void}
     */
    performSubstitute(target: Game_Battler): void;
    /** @returns {void} */
    performCollapse(): void;
}
/**
 * The game object class for an actor.
 */
declare class Game_Actor extends Game_Battler {
    /** @param {[actorId: RMMZ.ActorID]} args */
    constructor(actorId: number);
    /** @type {number} */
    get level(): number;
    /** @param {RMMZ.ActorID} actorId */
    initialize(actorId: RMMZ.ActorID): void;
    /** @type {number} */
    _actorId: number | undefined;
    /** @type {string} */
    _name: string | undefined;
    /** @type {string} */
    _nickname: string | undefined;
    /** @type {number} */
    _classId: number | undefined;
    /** @type {number} */
    _level: number | undefined;
    /** @type {string} */
    _characterName: string | undefined;
    /** @type {number} */
    _characterIndex: number | undefined;
    /** @type {string} */
    _faceName: string | undefined;
    /** @type {number} */
    _faceIndex: number | undefined;
    /** @type {string} */
    _battlerName: string | undefined;
    /** @type {Record<RMMZ.ClassID, number>} */
    _exp: Record<number, number> | undefined;
    /** @type {RMMZ.SkillID[]} */
    _skills: number[] | undefined;
    /** @type {Game_Item[]} */
    _equips: Game_Item[] | undefined;
    /** @type {number} */
    _actionInputIndex: number | undefined;
    /** @type {Game_Item} */
    _lastMenuSkill: Game_Item | undefined;
    /** @type {Game_Item} */
    _lastBattleSkill: Game_Item | undefined;
    /** @type {string} */
    _lastCommandSymbol: string | undefined;
    /**
     * @param {RMMZ.ActorID} actorId
     * @returns {void}
     */
    setup(actorId: RMMZ.ActorID): void;
    _profile: string | undefined;
    /** @returns {number} */
    actorId(): number;
    /** @returns {import("../data").DataActor} */
    actor(): any;
    /** @returns {string} */
    name(): string;
    /**
     * @param {string} name
     * @returns {void}
     */
    setName(name: string): void;
    /** @returns {string} */
    nickname(): string;
    /**
     * @param {string} nickname
     * @returns {void}
     */
    setNickname(nickname: string): void;
    /** @returns {string} */
    profile(): string;
    /**
     * @param {string} profile
     * @returns {void}
     */
    setProfile(profile: string): void;
    /** @returns {string} */
    characterName(): string;
    /** @returns {number} */
    characterIndex(): number;
    /** @returns {string} */
    faceName(): string;
    /** @returns {number} */
    faceIndex(): number;
    /** @returns {string} */
    battlerName(): string;
    _stateSteps: {} | undefined;
    /** @returns {void} */
    initImages(): void;
    /**
     * @param {number} level
     * @returns {number}
     */
    expForLevel(level: number): number;
    /** @returns {void} */
    initExp(): void;
    /** @returns {number} */
    currentExp(): number;
    /** @returns {number} */
    currentLevelExp(): number;
    /** @returns {number} */
    nextLevelExp(): number;
    /** @returns {number} */
    nextRequiredExp(): number;
    /** @returns {number} */
    maxLevel(): number;
    /** @returns {boolean} */
    isMaxLevel(): boolean;
    /** @returns {void} */
    initSkills(): void;
    /**
     * @param {(RMMZ.WeaponID | RMMZ.ArmorID)[]} equips
     * @returns {void}
     */
    initEquips(equips: (RMMZ.WeaponID | RMMZ.ArmorID)[]): void;
    /** @returns {number[]} */
    equipSlots(): number[];
    /** @returns {RMMZ.DataEquipment[]} */
    equips(): RMMZ.DataEquipment[];
    /** @returns {RMMZ.DataWeapon[]} */
    weapons(): RMMZ.DataWeapon[];
    /** @returns {RMMZ.DataArmor[]} */
    armors(): RMMZ.DataArmor[];
    /**
     * @param {RMMZ.DataWeapon} weapon
     * @returns {boolean}
     */
    hasWeapon(weapon: RMMZ.DataWeapon): boolean;
    /**
     * @param {RMMZ.DataArmor} armor
     * @returns {boolean}
     */
    hasArmor(armor: RMMZ.DataArmor): boolean;
    /**
     * @param {RMMZ.EquipmentSlotID} slotId
     * @returns {boolean}
     */
    isEquipChangeOk(slotId: RMMZ.EquipmentSlotID): boolean;
    /**
     * @param {RMMZ.EquipmentSlotID} slotId
     * @param {RMMZ.DataEquipment | null} item
     * @returns {void}
     */
    changeEquip(slotId: RMMZ.EquipmentSlotID, item: RMMZ.DataEquipment | null): void;
    /**
     * @param {RMMZ.EquipmentSlotID} slotId
     * @param {RMMZ.DataEquipment | null} item
     * @returns {void}
     */
    forceChangeEquip(slotId: RMMZ.EquipmentSlotID, item: RMMZ.DataEquipment | null): void;
    /**
     * @param {RMMZ.DataEquipment | null} newItem
     * @param {RMMZ.DataEquipment | null} oldItem
     * @returns {boolean}
     */
    tradeItemWithParty(newItem: RMMZ.DataEquipment | null, oldItem: RMMZ.DataEquipment | null): boolean;
    /**
     * @param {RMMZ.EquipmentType} etypeId
     * @param {RMMZ.WeaponID | RMMZ.ArmorID} itemId
     * @returns {void}
     */
    changeEquipById(etypeId: RMMZ.EquipmentType, itemId: RMMZ.WeaponID | RMMZ.ArmorID): void;
    /**
     * @param {RMMZ.DataEquipment} item
     * @returns {boolean}
     */
    isEquipped(item: RMMZ.DataEquipment): boolean;
    /**
     * @param {RMMZ.DataEquipment} item
     * @returns {void}
     */
    discardEquip(item: RMMZ.DataEquipment): void;
    /**
     * @param {boolean} forcing
     * @returns {void}
     */
    releaseUnequippableItems(forcing: boolean): void;
    /** @returns {void} */
    clearEquipments(): void;
    /** @returns {void} */
    optimizeEquipments(): void;
    /**
     * @param {RMMZ.EquipmentSlotID} slotId
     * @returns {RMMZ.DataEquipment | null}
     */
    bestEquipItem(slotId: RMMZ.EquipmentSlotID): RMMZ.DataEquipment | null;
    /**
     * @param {RMMZ.DataEquipment} item
     * @returns {number}
     */
    calcEquipItemPerformance(item: RMMZ.DataEquipment): number;
    /**
     * @param {RMMZ.WeaponType} wtypeId
     * @returns {boolean}
     */
    isWtypeEquipped(wtypeId: RMMZ.WeaponType): boolean;
    /** @returns {import("./Game_Party").Game_Party} */
    friendsUnit(): any;
    /** @returns {import("./Game_Troop").Game_Troop} */
    opponentsUnit(): any;
    /** @returns {number} */
    index(): number;
    /** @returns {boolean} */
    isBattleMember(): boolean;
    /** @returns {boolean} */
    isFormationChangeOk(): boolean;
    /** @returns {RMMZ.DataClass} */
    currentClass(): RMMZ.DataClass;
    /**
     * @param {RMMZ.DataClass} gameClass
     * @returns {boolean}
     */
    isClass(gameClass: RMMZ.DataClass): boolean;
    /** @returns {number[]} */
    skillTypes(): number[];
    /** @returns {RMMZ.DataSkill[]} */
    skills(): RMMZ.DataSkill[];
    /** @returns {RMMZ.DataSkill[]} */
    usableSkills(): RMMZ.DataSkill[];
    /** @returns {{ traits: import("../data").Trait[]; }[]} */
    traitObjects(): {
        traits: any[];
    }[];
    /** @returns {boolean} */
    hasNoWeapons(): boolean;
    /** @returns {number} */
    bareHandsElementId(): number;
    /** @returns {number} */
    attackAnimationId1(): number;
    /** @returns {0} */
    attackAnimationId2(): 0;
    /** @returns {number} */
    bareHandsAnimationId(): number;
    /**
     * @param {number} exp
     * @param {boolean} [show]
     * @returns {void}
     */
    changeExp(exp: number, show?: boolean): void;
    /** @returns {void} */
    levelUp(): void;
    /** @returns {void} */
    levelDown(): void;
    /**
     * @param {RMMZ.DataSkill[]} lastSkills
     * @returns {RMMZ.DataSkill[]}
     */
    findNewSkills(lastSkills: RMMZ.DataSkill[]): RMMZ.DataSkill[];
    /**
     * @param {RMMZ.DataSkill[]} newSkills
     * @returns {void}
     */
    displayLevelUp(newSkills: RMMZ.DataSkill[]): void;
    /**
     * @param {number} exp
     * @returns {void}
     */
    gainExp(exp: number): void;
    /** @returns {number} */
    finalExpRate(): number;
    /** @returns {0 | 1} */
    benchMembersExpRate(): 0 | 1;
    /** @returns {boolean} */
    shouldDisplayLevelUp(): boolean;
    /**
     * @param {number} level
     * @param {boolean} [show]
     * @returns {void}
     */
    changeLevel(level: number, show?: boolean): void;
    /**
     * @param {RMMZ.SkillID} skillId
     * @returns {void}
     */
    learnSkill(skillId: RMMZ.SkillID): void;
    /**
     * @param {RMMZ.SkillID} skillId
     * @returns {void}
     */
    forgetSkill(skillId: RMMZ.SkillID): void;
    /**
     * @param {RMMZ.SkillID} skillId
     * @returns {boolean}
     */
    isLearnedSkill(skillId: RMMZ.SkillID): boolean;
    /**
     * @param {RMMZ.SkillID} skillId
     * @returns {boolean}
     */
    hasSkill(skillId: RMMZ.SkillID): boolean;
    /**
     * @param {RMMZ.ClassID} classId
     * @param {boolean} [keepExp]
     * @returns {void}
     */
    changeClass(classId: RMMZ.ClassID, keepExp?: boolean): void;
    /**
     * @param {string} characterName
     * @param {number} characterIndex
     * @returns {void}
     */
    setCharacterImage(characterName: string, characterIndex: number): void;
    /**
     * @param {string} faceName
     * @param {number} faceIndex
     * @returns {void}
     */
    setFaceImage(faceName: string, faceIndex: number): void;
    /**
     * @param {string} battlerName
     * @returns {void}
     */
    setBattlerImage(battlerName: string): void;
    /** @returns {boolean} */
    isSpriteVisible(): boolean;
    /** @returns {void} */
    performAttack(): void;
    /** @returns {void} */
    performVictory(): void;
    /** @returns {void} */
    performEscape(): void;
    /** @returns {Game_Action[]} */
    makeActionList(): Game_Action[];
    /** @returns {void} */
    makeAutoBattleActions(): void;
    /** @returns {void} */
    makeConfusionActions(): void;
    /** @returns {void} */
    onPlayerWalk(): void;
    /**
     * @param {RMMZ.DataState} state
     * @returns {void}
     */
    updateStateSteps(state: RMMZ.DataState): void;
    /** @returns {void} */
    showAddedStates(): void;
    /** @returns {void} */
    showRemovedStates(): void;
    /** @returns {number} */
    stepsForTurn(): number;
    /** @returns {void} */
    turnEndOnMap(): void;
    /** @returns {void} */
    checkFloorEffect(): void;
    /** @returns {void} */
    executeFloorDamage(): void;
    /** @returns {number} */
    basicFloorDamage(): number;
    /** @returns {number} */
    maxFloorDamage(): number;
    /** @returns {void} */
    performMapDamage(): void;
    /** @returns {Game_Action} */
    inputtingAction(): Game_Action;
    /** @returns {boolean} */
    selectNextCommand(): boolean;
    /** @returns {boolean} */
    selectPreviousCommand(): boolean;
    /** @returns {RMMZ.DataSkill} */
    lastSkill(): RMMZ.DataSkill;
    /** @returns {RMMZ.DataSkill} */
    lastMenuSkill(): RMMZ.DataSkill;
    /**
     * @param {RMMZ.DataSkill | null} skill
     * @returns {void}
     */
    setLastMenuSkill(skill: RMMZ.DataSkill | null): void;
    /** @returns {RMMZ.DataSkill} */
    lastBattleSkill(): RMMZ.DataSkill;
    /**
     * @param {RMMZ.DataSkill | null} skill
     * @returns {void}
     */
    setLastBattleSkill(skill: RMMZ.DataSkill | null): void;
    /** @returns {string} */
    lastCommandSymbol(): string;
    /**
     * @param {string} symbol
     * @returns {void}
     */
    setLastCommandSymbol(symbol: string): void;
    /**
     * @param {RMMZ.DataItem} item
     * @returns {boolean}
     */
    testEscape(item: RMMZ.DataItem): boolean;
    /**
     * @param {RMMZ.DataItem} item
     * @returns {boolean}
     */
    meetsUsableItemConditions(item: RMMZ.DataItem): boolean;
    /** @returns {void} */
    onEscapeFailure(): void;
}
/**
 * The game object class for an enemy.
 */
declare class Game_Enemy extends Game_Battler {
    /** @param {[enemyId: RMMZ.EnemyID, x: number, y: number]} args */
    constructor(enemyId: number, x: number, y: number);
    /**
     * @param {RMMZ.EnemyID} enemyId
     * @param {number} x
     * @param {number} y
     */
    initialize(enemyId: RMMZ.EnemyID, x: number, y: number): void;
    /** @type {number} */
    _enemyId: number | undefined;
    /** @type {string} */
    _letter: string | undefined;
    /** @type {boolean} */
    _plural: boolean | undefined;
    /** @type {number} */
    _screenX: number | undefined;
    /** @type {number} */
    _screenY: number | undefined;
    /**
     * @param {RMMZ.EnemyID} enemyId
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    setup(enemyId: RMMZ.EnemyID, x: number, y: number): void;
    /** @returns {import("./Game_Troop").Game_Troop} */
    friendsUnit(): any;
    /** @returns {import("./Game_Party").Game_Party} */
    opponentsUnit(): any;
    /** @returns {number} */
    index(): number;
    /** @returns {boolean} */
    isBattleMember(): boolean;
    /** @returns {number} */
    enemyId(): number;
    /** @returns {import("../data").DataEnemy} */
    enemy(): any;
    /** @returns {{ traits: import("../data").Trait[]; }[]} */
    traitObjects(): {
        traits: any[];
    }[];
    /** @returns {number} */
    exp(): number;
    /** @returns {number} */
    gold(): number;
    /** @returns {RMMZ.DataItemBase[]} */
    makeDropItems(): RMMZ.DataItemBase[];
    /** @returns {1 | 2} */
    dropItemRate(): 1 | 2;
    /**
     * @param {RMMZ.DropItemType} kind
     * @param {RMMZ.DataID} dataId
     * @returns {import("../data").DataItem | import("../data").DataWeapon | import("../data").DataArmor | null}
     */
    itemObject(kind: RMMZ.DropItemType, dataId: RMMZ.DataID): any | any | any | null;
    /** @returns {boolean} */
    isSpriteVisible(): boolean;
    /** @returns {number} */
    screenX(): number;
    /** @returns {number} */
    screenY(): number;
    /** @returns {string} */
    battlerName(): string;
    /** @returns {number} */
    battlerHue(): number;
    /** @returns {string} */
    originalName(): string;
    /** @returns {string} */
    name(): string;
    /** @returns {boolean} */
    isLetterEmpty(): boolean;
    /**
     * @param {string} letter
     * @returns {void}
     */
    setLetter(letter: string): void;
    /**
     * @param {boolean} plural
     * @returns {void}
     */
    setPlural(plural: boolean): void;
    /**
     * @param {RMMZ.EnemyID} enemyId
     * @returns {void}
     */
    transform(enemyId: RMMZ.EnemyID): void;
    /**
     * @param {RMMZ.EnemyAction} action
     * @returns {boolean}
     */
    meetsCondition(action: RMMZ.EnemyAction): boolean;
    /**
     * @param {number} param1
     * @param {number} param2
     * @returns {boolean}
     */
    meetsTurnCondition(param1: number, param2: number): boolean;
    /**
     * @param {number} param1
     * @param {number} param2
     * @returns {boolean}
     */
    meetsHpCondition(param1: number, param2: number): boolean;
    /**
     * @param {number} param1
     * @param {number} param2
     * @returns {boolean}
     */
    meetsMpCondition(param1: number, param2: number): boolean;
    /**
     * @param {RMMZ.StateID} param
     * @returns {boolean}
     */
    meetsStateCondition(param: RMMZ.StateID): boolean;
    /**
     * @param {number} param
     * @returns {boolean}
     */
    meetsPartyLevelCondition(param: number): boolean;
    /**
     * @param {RMMZ.SwitchID} param
     * @returns {boolean}
     */
    meetsSwitchCondition(param: RMMZ.SwitchID): boolean;
    /**
     * @param {RMMZ.EnemyAction} action
     * @returns {boolean}
     */
    isActionValid(action: RMMZ.EnemyAction): boolean;
    /**
     * @param {RMMZ.EnemyAction[]} actionList
     * @param {number} ratingZero
     * @returns {RMMZ.EnemyAction | null | undefined}
     */
    selectAction(actionList: RMMZ.EnemyAction[], ratingZero: number): RMMZ.EnemyAction | null | undefined;
    /**
     * @param {RMMZ.EnemyAction[]} actionList
     * @returns {void}
     */
    selectAllActions(actionList: RMMZ.EnemyAction[]): void;
}
/**
 * The wrapper class for an actor array.
 */
declare class Game_Actors {
    constructor(...args: any[]);
    initialize(): void;
    /** @type {Game_Actor[]} */
    _data: Game_Actor[] | undefined;
    /**
     * @param {RMMZ.ActorID} actorId
     * @returns {Game_Actor | null}
     */
    actor(actorId: RMMZ.ActorID): Game_Actor | null;
}
/**
 * The superclass of Game_Party and Game_Troop.
 */
declare class Game_Unit {
    constructor(...args: any[]);
    initialize(): void;
    /** @type {boolean} */
    _inBattle: boolean | undefined;
    /** @returns {boolean} */
    inBattle(): boolean;
    /** @returns {Game_Battler[]} */
    members(): Game_Battler[];
    /** @returns {Game_Battler[]} */
    aliveMembers(): Game_Battler[];
    /** @returns {Game_Battler[]} */
    deadMembers(): Game_Battler[];
    /** @returns {Game_Battler[]} */
    movableMembers(): Game_Battler[];
    /** @returns {void} */
    clearActions(): void;
    /** @returns {number} */
    agility(): number;
    /** @returns {number} */
    tgrSum(): number;
    /** @returns {Game_Battler | null} */
    randomTarget(): Game_Battler | null;
    /** @returns {Game_Battler | null} */
    randomDeadTarget(): Game_Battler | null;
    /**
     * @param {number} index
     * @returns {Game_Battler}
     */
    smoothTarget(index: number): Game_Battler;
    /**
     * @param {number} index
     * @returns {Game_Battler}
     */
    smoothDeadTarget(index: number): Game_Battler;
    /** @returns {void} */
    clearResults(): void;
    /**
     * @param {boolean} advantageous
     * @returns {void}
     */
    onBattleStart(advantageous: boolean): void;
    /** @returns {void} */
    onBattleEnd(): void;
    /** @returns {void} */
    makeActions(): void;
    /**
     * @param {Game_Battler | null} activeMember
     * @returns {void}
     */
    select(activeMember: Game_Battler | null): void;
    /** @returns {boolean} */
    isAllDead(): boolean;
    /**
     * @param {Game_Battler} target
     * @returns {Game_Battler | null}
     */
    substituteBattler(target: Game_Battler): Game_Battler | null;
    /** @returns {number} */
    tpbBaseSpeed(): number;
    /** @returns {60 | 240} */
    tpbReferenceTime(): 60 | 240;
    /** @returns {void} */
    updateTpb(): void;
}
/**
 * The game object class for the party. Information such as gold and items is
 * included.
 */
declare class Game_Party extends Game_Unit {
    static ABILITY_ENCOUNTER_HALF: number;
    static ABILITY_ENCOUNTER_NONE: number;
    static ABILITY_CANCEL_SURPRISE: number;
    static ABILITY_RAISE_PREEMPTIVE: number;
    static ABILITY_GOLD_DOUBLE: number;
    static ABILITY_DROP_ITEM_DOUBLE: number;
    /** @param {[]} args */
    constructor();
    /** @type {number} */
    _gold: number | undefined;
    /** @type {number} */
    _steps: number | undefined;
    /** @type {Game_Item} */
    _lastItem: Game_Item | undefined;
    /** @type {number} */
    _menuActorId: number | undefined;
    /** @type {number} */
    _targetActorId: number | undefined;
    /** @type {RMMZ.ActorID[]} */
    _actors: number[] | undefined;
    /** @returns {void} */
    initAllItems(): void;
    _items: {} | undefined;
    _weapons: {} | undefined;
    _armors: {} | undefined;
    /** @returns {boolean} */
    exists(): boolean;
    /** @returns {number} */
    size(): number;
    /** @returns {boolean} */
    isEmpty(): boolean;
    /** @returns {Game_Actor[]} */
    members(): Game_Actor[];
    /** @returns {Game_Actor[]} */
    allMembers(): Game_Actor[];
    /** @returns {Game_Actor[]} */
    battleMembers(): Game_Actor[];
    /** @returns {Game_Actor[]} */
    hiddenBattleMembers(): Game_Actor[];
    /** @returns {Game_Actor[]} */
    allBattleMembers(): Game_Actor[];
    /** @returns {number} */
    maxBattleMembers(): number;
    /** @returns {Game_Actor} */
    leader(): Game_Actor;
    /** @returns {void} */
    removeInvalidMembers(): void;
    /** @returns {void} */
    reviveBattleMembers(): void;
    /** @returns {import("../data").DataItem[]} */
    items(): any[];
    /** @returns {import("../data").DataWeapon[]} */
    weapons(): any[];
    /** @returns {import("../data").DataArmor[]} */
    armors(): any[];
    /** @returns {RMMZ.DataEquipment[]} */
    equipItems(): RMMZ.DataEquipment[];
    /** @returns {RMMZ.DataItemBase[]} */
    allItems(): RMMZ.DataItemBase[];
    /**
     * @param {RMMZ.DataItemBase | null} item
     * @returns {Record<number, number> | null}
     */
    itemContainer(item: RMMZ.DataItemBase | null): Record<number, number> | null;
    /** @returns {void} */
    setupStartingMembers(): void;
    /** @returns {string} */
    name(): string;
    /** @returns {void} */
    setupBattleTest(): void;
    /** @returns {void} */
    setupBattleTestMembers(): void;
    /** @returns {void} */
    setupBattleTestItems(): void;
    /** @returns {number} */
    highestLevel(): number;
    /**
     * @param {RMMZ.ActorID} actorId
     * @returns {void}
     */
    addActor(actorId: RMMZ.ActorID): void;
    /**
     * @param {RMMZ.ActorID} actorId
     * @returns {void}
     */
    removeActor(actorId: RMMZ.ActorID): void;
    /** @returns {number} */
    gold(): number;
    /**
     * @param {number} amount
     * @returns {void}
     */
    gainGold(amount: number): void;
    /**
     * @param {number} amount
     * @returns {void}
     */
    loseGold(amount: number): void;
    /** @returns {number} */
    maxGold(): number;
    /** @returns {number} */
    steps(): number;
    /** @returns {void} */
    increaseSteps(): void;
    /**
     * @param {RMMZ.DataItemBase | null} item
     * @returns {number}
     */
    numItems(item: RMMZ.DataItemBase | null): number;
    /**
     * @param {RMMZ.DataItem | RMMZ.DataWeapon | RMMZ.DataArmor | null} item
     * @returns {number}
     */
    maxItems(item: RMMZ.DataItem | RMMZ.DataWeapon | RMMZ.DataArmor | null): number;
    /**
     * @param {RMMZ.DataItemBase} item
     * @returns {boolean}
     */
    hasMaxItems(item: RMMZ.DataItemBase): boolean;
    /**
     * @param {RMMZ.DataItemBase} item
     * @param {boolean} [includeEquip]
     * @returns {boolean}
     */
    hasItem(item: RMMZ.DataItemBase, includeEquip?: boolean): boolean;
    /**
     * @param {RMMZ.DataEquipment} item
     * @returns {boolean}
     */
    isAnyMemberEquipped(item: RMMZ.DataEquipment): boolean;
    /**
     * @param {RMMZ.DataItemBase | null} item
     * @param {number} amount
     * @param {boolean} [includeEquip]
     * @returns {void}
     */
    gainItem(item: RMMZ.DataItemBase | null, amount: number, includeEquip?: boolean): void;
    /**
     * @param {RMMZ.DataEquipment} item
     * @param {number} amount
     * @returns {void}
     */
    discardMembersEquip(item: RMMZ.DataEquipment, amount: number): void;
    /**
     * @param {RMMZ.DataItemBase | null} item
     * @param {number} amount
     * @param {boolean} [includeEquip]
     * @returns {void}
     */
    loseItem(item: RMMZ.DataItemBase | null, amount: number, includeEquip?: boolean): void;
    /**
     * @param {RMMZ.DataItemBase} item
     * @returns {void}
     */
    consumeItem(item: RMMZ.DataItemBase): void;
    /**
     * @param {RMMZ.DataItemBase | null} item
     * @returns {boolean}
     */
    canUse(item: RMMZ.DataItemBase | null): boolean;
    /** @returns {boolean} */
    canInput(): boolean;
    /** @returns {boolean} */
    isEscaped(): boolean;
    /** @returns {void} */
    onPlayerWalk(): void;
    /** @returns {Game_Actor} */
    menuActor(): Game_Actor;
    /**
     * @param {Game_Actor} actor
     * @returns {void}
     */
    setMenuActor(actor: Game_Actor): void;
    /** @returns {void} */
    makeMenuActorNext(): void;
    /** @returns {void} */
    makeMenuActorPrevious(): void;
    /** @returns {Game_Actor} */
    targetActor(): Game_Actor;
    /**
     * @param {Game_Actor} actor
     * @returns {void}
     */
    setTargetActor(actor: Game_Actor): void;
    /** @returns {RMMZ.DataItemBase} */
    lastItem(): RMMZ.DataItemBase;
    /**
     * @param {RMMZ.DataItemBase | null} item
     * @returns {void}
     */
    setLastItem(item: RMMZ.DataItemBase | null): void;
    /**
     * @param {RMMZ.ActorID} index1
     * @param {RMMZ.ActorID} index2
     * @returns {void}
     */
    swapOrder(index1: RMMZ.ActorID, index2: RMMZ.ActorID): void;
    /** @returns {[ string, number ][]} */
    charactersForSavefile(): [string, number][];
    /** @returns {[ string, number ][]} */
    facesForSavefile(): [string, number][];
    /**
     * @param {RMMZ.DataID} abilityId
     * @returns {boolean}
     */
    partyAbility(abilityId: RMMZ.DataID): boolean;
    /** @returns {boolean} */
    hasEncounterHalf(): boolean;
    /** @returns {boolean} */
    hasEncounterNone(): boolean;
    /** @returns {boolean} */
    hasCancelSurprise(): boolean;
    /** @returns {boolean} */
    hasRaisePreemptive(): boolean;
    /** @returns {boolean} */
    hasGoldDouble(): boolean;
    /** @returns {boolean} */
    hasDropItemDouble(): boolean;
    /**
     * @param {number} troopAgi
     * @returns {number}
     */
    ratePreemptive(troopAgi: number): number;
    /**
     * @param {number} troopAgi
     * @returns {number}
     */
    rateSurprise(troopAgi: number): number;
    /** @returns {void} */
    performVictory(): void;
    /** @returns {void} */
    performEscape(): void;
    /** @returns {void} */
    removeBattleStates(): void;
    /** @returns {void} */
    requestMotionRefresh(): void;
    /** @returns {void} */
    onEscapeFailure(): void;
}
/**
 * The game object class for a troop and the battle-related data.
 */
declare class Game_Troop extends Game_Unit {
    /** @type {string[]} */
    static LETTER_TABLE_HALF: string[];
    /** @type {string[]} */
    static LETTER_TABLE_FULL: string[];
    /** @param {[]} args */
    constructor();
    /** @type {Game_Interpreter} */
    _interpreter: Game_Interpreter | undefined;
    /** @returns {boolean} */
    isEventRunning(): boolean;
    /** @returns {void} */
    updateInterpreter(): void;
    /** @returns {number} */
    turnCount(): number;
    /** @returns {Game_Enemy[]} */
    members(): Game_Enemy[];
    /** @returns {void} */
    clear(): void;
    _troopId: number | undefined;
    _eventFlags: {} | undefined;
    _enemies: any[] | undefined;
    _turnCount: number | undefined;
    _namesCount: {} | undefined;
    /** @returns {import("../data").DataTroop} */
    troop(): any;
    /**
     * @param {RMMZ.TroopID} troopId
     * @returns {void}
     */
    setup(troopId: RMMZ.TroopID): void;
    /** @returns {void} */
    makeUniqueNames(): void;
    /** @returns {void} */
    updatePluralFlags(): void;
    /** @returns {string[]} */
    letterTable(): string[];
    /** @returns {string[]} */
    enemyNames(): string[];
    /**
     * @param {RMMZ.DataTroopPage} page
     * @returns {boolean}
     */
    meetsConditions(page: RMMZ.DataTroopPage): boolean;
    /** @returns {void} */
    setupBattleEvent(): void;
    /** @returns {void} */
    increaseTurn(): void;
    /** @returns {number} */
    expTotal(): number;
    /** @returns {number} */
    goldTotal(): number;
    /** @returns {1 | 2} */
    goldRate(): 1 | 2;
    /** @returns {RMMZ.DataItemBase[]} */
    makeDropItems(): RMMZ.DataItemBase[];
    /** @returns {boolean} */
    isTpbTurnEnd(): boolean;
}
/**
 * The game object class for a map. It contains scrolling and passage
 * determination functions.
 */
declare class Game_Map {
    /** @param {[]} args */
    constructor();
    initialize(): void;
    /** @type {Game_Interpreter} */
    _interpreter: Game_Interpreter | undefined;
    /** @type {number} */
    _mapId: number | undefined;
    /** @type {number} */
    _tilesetId: number | undefined;
    /** @type {Game_Event[]} */
    _events: Game_Event[] | undefined;
    /** @type {Game_CommonEvent[]} */
    _commonEvents: Game_CommonEvent[] | undefined;
    /** @type {Game_Vehicle[]} */
    _vehicles: Game_Vehicle[] | undefined;
    /** @type {number} */
    _displayX: number | undefined;
    /** @type {number} */
    _displayY: number | undefined;
    /** @type {boolean} */
    _nameDisplay: boolean | undefined;
    /** @type {RMMZ.Direction} */
    _scrollDirection: RMMZ.Direction | undefined;
    /** @type {number} */
    _scrollRest: number | undefined;
    /** @type {number} */
    _scrollSpeed: number | undefined;
    /** @type {string} */
    _parallaxName: string | undefined;
    /** @type {boolean} */
    _parallaxZero: boolean | undefined;
    /** @type {boolean} */
    _parallaxLoopX: boolean | undefined;
    /** @type {boolean} */
    _parallaxLoopY: boolean | undefined;
    /** @type {number} */
    _parallaxSx: number | undefined;
    /** @type {number} */
    _parallaxSy: number | undefined;
    /** @type {number} */
    _parallaxX: number | undefined;
    /** @type {number} */
    _parallaxY: number | undefined;
    /** @type {string | null} */
    _battleback1Name: string | null | undefined;
    /** @type {string | null} */
    _battleback2Name: string | null | undefined;
    /**
     * @param {RMMZ.MapID} mapId
     * @returns {void}
     */
    setup(mapId: RMMZ.MapID): void;
    _needsRefresh: boolean | undefined;
    /** @returns {boolean} */
    isEventRunning(): boolean;
    /** @returns {number} */
    tileWidth(): number;
    /** @returns {number} */
    tileHeight(): number;
    /** @returns {number} */
    bushDepth(): number;
    /** @returns {number} */
    mapId(): number;
    /** @returns {number} */
    tilesetId(): number;
    /** @returns {number} */
    displayX(): number;
    /** @returns {number} */
    displayY(): number;
    /** @returns {string} */
    parallaxName(): string;
    /** @returns {string | null} */
    battleback1Name(): string | null;
    /** @returns {string | null} */
    battleback2Name(): string | null;
    /** @returns {void} */
    requestRefresh(): void;
    /** @returns {boolean} */
    isNameDisplayEnabled(): boolean;
    /** @returns {void} */
    disableNameDisplay(): void;
    /** @returns {void} */
    enableNameDisplay(): void;
    /** @returns {void} */
    createVehicles(): void;
    /** @returns {void} */
    refereshVehicles(): void;
    /** @returns {Game_Vehicle[]} */
    vehicles(): Game_Vehicle[];
    /**
     * @param {number | RMMZ.VehicleType} type
     * @returns {Game_Vehicle | null}
     */
    vehicle(type: number | RMMZ.VehicleType): Game_Vehicle | null;
    /** @returns {Game_Vehicle} */
    boat(): Game_Vehicle;
    /** @returns {Game_Vehicle} */
    ship(): Game_Vehicle;
    /** @returns {Game_Vehicle} */
    airship(): Game_Vehicle;
    /** @returns {void} */
    setupEvents(): void;
    /** @returns {Game_Event[]} */
    events(): Game_Event[];
    /**
     * @param {RMMZ.EventID} eventId
     * @returns {Game_Event}
     */
    event(eventId: RMMZ.EventID): Game_Event;
    /**
     * @param {RMMZ.EventID} eventId
     * @returns {void}
     */
    eraseEvent(eventId: RMMZ.EventID): void;
    /** @returns {import("../data").DataCommonEvent[]} */
    autorunCommonEvents(): any[];
    /** @returns {import("../data").DataCommonEvent[]} */
    parallelCommonEvents(): any[];
    /** @returns {void} */
    setupScroll(): void;
    /** @returns {void} */
    setupParallax(): void;
    /** @returns {void} */
    setupBattleback(): void;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    setDisplayPos(x: number, y: number): void;
    /** @returns {number} */
    parallaxOx(): number;
    /** @returns {number} */
    parallaxOy(): number;
    /** @returns {import("../data").DataTileset} */
    tileset(): any;
    /** @returns {number[]} */
    tilesetFlags(): number[];
    /** @returns {string} */
    displayName(): string;
    /** @returns {number} */
    width(): number;
    /** @returns {number} */
    height(): number;
    /** @returns {number[]} */
    data(): number[];
    /** @returns {boolean} */
    isLoopHorizontal(): boolean;
    /** @returns {boolean} */
    isLoopVertical(): boolean;
    /** @returns {boolean} */
    isDashDisabled(): boolean;
    /** @returns {import("../data").DataEncounter[]} */
    encounterList(): any[];
    /** @returns {number} */
    encounterStep(): number;
    /** @returns {boolean} */
    isOverworld(): boolean;
    /** @returns {number} */
    screenTileX(): number;
    /** @returns {number} */
    screenTileY(): number;
    /**
     * @param {number} x
     * @returns {number}
     */
    adjustX(x: number): number;
    /**
     * @param {number} y
     * @returns {number}
     */
    adjustY(y: number): number;
    /**
     * @param {number} x
     * @returns {number}
     */
    roundX(x: number): number;
    /**
     * @param {number} y
     * @returns {number}
     */
    roundY(y: number): number;
    /**
     * @param {number} x
     * @param {RMMZ.Direction} d
     * @returns {number}
     */
    xWithDirection(x: number, d: RMMZ.Direction): number;
    /**
     * @param {number} y
     * @param {RMMZ.Direction} d
     * @returns {number}
     */
    yWithDirection(y: number, d: RMMZ.Direction): number;
    /**
     * @param {number} x
     * @param {RMMZ.Direction} d
     * @returns {number}
     */
    roundXWithDirection(x: number, d: RMMZ.Direction): number;
    /**
     * @param {number} y
     * @param {RMMZ.Direction} d
     * @returns {number}
     */
    roundYWithDirection(y: number, d: RMMZ.Direction): number;
    /**
     * @param {number} x1
     * @param {number} x2
     * @returns {number}
     */
    deltaX(x1: number, x2: number): number;
    /**
     * @param {number} y1
     * @param {number} y2
     * @returns {number}
     */
    deltaY(y1: number, y2: number): number;
    /**
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @returns {number}
     */
    distance(x1: number, y1: number, x2: number, y2: number): number;
    /**
     * @param {number} x
     * @returns {number}
     */
    canvasToMapX(x: number): number;
    /**
     * @param {number} y
     * @returns {number}
     */
    canvasToMapY(y: number): number;
    /** @returns {void} */
    autoplay(): void;
    /** @returns {void} */
    refreshIfNeeded(): void;
    /** @returns {void} */
    refresh(): void;
    /** @returns {void} */
    refreshTileEvents(): void;
    _tileEvents: Game_Event[] | undefined;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {Game_Event[]}
     */
    eventsXy(x: number, y: number): Game_Event[];
    /**
     * @param {number} x
     * @param {number} y
     * @returns {Game_Event[]}
     */
    eventsXyNt(x: number, y: number): Game_Event[];
    /**
     * @param {number} x
     * @param {number} y
     * @returns {Game_Event[]}
     */
    tileEventsXy(x: number, y: number): Game_Event[];
    /**
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    eventIdXy(x: number, y: number): number;
    /**
     * @param {number} distance
     * @returns {void}
     */
    scrollDown(distance: number): void;
    /**
     * @param {number} distance
     * @returns {void}
     */
    scrollLeft(distance: number): void;
    /**
     * @param {number} distance
     * @returns {void}
     */
    scrollRight(distance: number): void;
    /**
     * @param {number} distance
     * @returns {void}
     */
    scrollUp(distance: number): void;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isValid(x: number, y: number): boolean;
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} bit
     * @returns {boolean}
     */
    checkPassage(x: number, y: number, bit: number): boolean;
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {number}
     */
    tileId(x: number, y: number, z: number): number;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {number[]}
     */
    layeredTiles(x: number, y: number): number[];
    /**
     * @param {number} x
     * @param {number} y
     * @returns {number[]}
     */
    allTiles(x: number, y: number): number[];
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {number}
     */
    autotileType(x: number, y: number, z: number): number;
    /**
     * @param {number} x
     * @param {number} y
     * @param {RMMZ.Direction} d
     * @returns {boolean}
     */
    isPassable(x: number, y: number, d: RMMZ.Direction): boolean;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isBoatPassable(x: number, y: number): boolean;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isShipPassable(x: number, y: number): boolean;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isAirshipLandOk(x: number, y: number): boolean;
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} bit
     * @returns {boolean}
     */
    checkLayeredTilesFlags(x: number, y: number, bit: number): boolean;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isLadder(x: number, y: number): boolean;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isBush(x: number, y: number): boolean;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isCounter(x: number, y: number): boolean;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isDamageFloor(x: number, y: number): boolean;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    terrainTag(x: number, y: number): number;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    regionId(x: number, y: number): number;
    /**
     * @param {RMMZ.Direction} direction
     * @param {number} distance
     * @param {number} speed
     * @returns {void}
     */
    startScroll(direction: RMMZ.Direction, distance: number, speed: number): void;
    /** @returns {boolean} */
    isScrolling(): boolean;
    /**
     * @param {boolean} sceneActive
     * @returns {void}
     */
    update(sceneActive: boolean): void;
    /** @returns {void} */
    updateScroll(): void;
    /** @returns {number} */
    scrollDistance(): number;
    /**
     * @param {RMMZ.Direction} direction
     * @param {number} distance
     * @returns {void}
     */
    doScroll(direction: RMMZ.Direction, distance: number): void;
    /** @returns {void} */
    updateEvents(): void;
    /** @returns {void} */
    updateVehicles(): void;
    /** @returns {void} */
    updateParallax(): void;
    /**
     * @param {number} tilesetId
     * @returns {void}
     */
    changeTileset(tilesetId: number): void;
    /**
     * @param {string | null} battleback1Name
     * @param {string | null} battleback2Name
     * @returns {void}
     */
    changeBattleback(battleback1Name: string | null, battleback2Name: string | null): void;
    /**
     * @param {string} name
     * @param {boolean} loopX
     * @param {boolean} loopY
     * @param {number} sx
     * @param {number} sy
     * @returns {void}
     */
    changeParallax(name: string, loopX: boolean, loopY: boolean, sx: number, sy: number): void;
    /** @returns {void} */
    updateInterpreter(): void;
    /**
     * @param {RMMZ.EventID} eventId
     * @returns {void}
     */
    unlockEvent(eventId: RMMZ.EventID): void;
    /** @returns {boolean} */
    setupStartingEvent(): boolean;
    /** @returns {boolean} */
    setupTestEvent(): boolean;
    /** @returns {boolean} */
    setupStartingMapEvent(): boolean;
    /** @returns {boolean} */
    setupAutorunCommonEvent(): boolean;
    /** @returns {boolean} */
    isAnyEventStarting(): boolean;
}
/**
 * The game object class for a common event. It contains functionality for
 * running parallel process events.
 */
declare class Game_CommonEvent {
    /** @param {[commonEventId: RMMZ.CommonEventID]} args */
    constructor(commonEventId: number);
    /** @param {RMMZ.CommonEventID} commonEventId */
    initialize(commonEventId: RMMZ.CommonEventID): void;
    /** @type {number} */
    _commonEventId: number | undefined;
    /** @returns {import("../data").DataCommonEvent} */
    event(): any;
    /** @returns {import("../data").DataCommand[]} */
    list(): any[];
    /** @returns {void} */
    refresh(): void;
    _interpreter: Game_Interpreter | null | undefined;
    /** @returns {boolean} */
    isActive(): boolean;
    /** @returns {void} */
    update(): void;
}
/**
 * The superclass of Game_Character. It handles basic information, such as
 * coordinates and images, shared by all characters.
 */
declare class Game_CharacterBase {
    /** @param {[]} args */
    constructor();
    /** @type {number} */
    get x(): number;
    /** @type {number} */
    get y(): number;
    initialize(...args: never[]): void;
    /** @returns {void} */
    initMembers(): void;
    /** @type {number} */
    _x: number | undefined;
    /** @type {number} */
    _y: number | undefined;
    /** @type {number} */
    _realX: number | undefined;
    /** @type {number} */
    _realY: number | undefined;
    /** @type {number} */
    _moveSpeed: number | undefined;
    /** @type {number} */
    _moveFrequency: number | undefined;
    /** @type {number} */
    _opacity: number | undefined;
    /** @type {import("pixi.js").BLEND_MODES} */
    _blendMode: import("pixi.js").BLEND_MODES | undefined;
    /** @type {RMMZ.Direction} */
    _direction: RMMZ.Direction | undefined;
    /** @type {number} */
    _pattern: number | undefined;
    /** @type {RMMZ.PriorityType} */
    _priorityType: RMMZ.PriorityType | undefined;
    /** @type {number} */
    _tileId: number | undefined;
    /** @type {string} */
    _characterName: string | undefined;
    /** @type {number} */
    _characterIndex: number | undefined;
    /** @type {boolean} */
    _isObjectCharacter: boolean | undefined;
    /** @type {boolean} */
    _walkAnime: boolean | undefined;
    /** @type {boolean} */
    _stepAnime: boolean | undefined;
    /** @type {boolean} */
    _directionFix: boolean | undefined;
    /** @type {boolean} */
    _through: boolean | undefined;
    /** @type {boolean} */
    _transparent: boolean | undefined;
    /** @type {number} */
    _bushDepth: number | undefined;
    /** @type {number} */
    _animationId: number | undefined;
    /** @type {number} */
    _balloonId: number | undefined;
    /** @type {boolean} */
    _animationPlaying: boolean | undefined;
    /** @type {boolean} */
    _balloonPlaying: boolean | undefined;
    /** @type {number} */
    _animationCount: number | undefined;
    /** @type {number} */
    _stopCount: number | undefined;
    /** @type {number} */
    _jumpCount: number | undefined;
    /** @type {number} */
    _jumpPeak: number | undefined;
    /** @type {boolean} */
    _movementSuccess: boolean | undefined;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    pos(x: number, y: number): boolean;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    posNt(x: number, y: number): boolean;
    /** @returns {number} */
    moveSpeed(): number;
    /**
     * @param {number} moveSpeed
     * @returns {void}
     */
    setMoveSpeed(moveSpeed: number): void;
    /** @returns {number} */
    moveFrequency(): number;
    /**
     * @param {number} moveFrequency
     * @returns {void}
     */
    setMoveFrequency(moveFrequency: number): void;
    /** @returns {number} */
    opacity(): number;
    /**
     * @param {number} opacity
     * @returns {void}
     */
    setOpacity(opacity: number): void;
    /** @returns {import("pixi.js").BLEND_MODES} */
    blendMode(): import("pixi.js").BLEND_MODES;
    /**
     * @param {import("pixi.js").BLEND_MODES} blendMode
     * @returns {void}
     */
    setBlendMode(blendMode: import("pixi.js").BLEND_MODES): void;
    /** @returns {boolean} */
    isNormalPriority(): boolean;
    /**
     * @param {RMMZ.PriorityType} priorityType
     * @returns {void}
     */
    setPriorityType(priorityType: RMMZ.PriorityType): void;
    /** @returns {boolean} */
    isMoving(): boolean;
    /** @returns {boolean} */
    isJumping(): boolean;
    /** @returns {number} */
    jumpHeight(): number;
    /** @returns {boolean} */
    isStopping(): boolean;
    /**
     * @param {number} threshold
     * @returns {boolean}
     */
    checkStop(threshold: number): boolean;
    /** @returns {void} */
    resetStopCount(): void;
    /** @returns {number} */
    realMoveSpeed(): number;
    /** @returns {number} */
    distancePerFrame(): number;
    /** @returns {boolean} */
    isDashing(): boolean;
    /** @returns {boolean} */
    isDebugThrough(): boolean;
    /** @returns {void} */
    straighten(): void;
    /**
     * @param {RMMZ.Direction} d
     * @returns {RMMZ.Direction}
     */
    reverseDir(d: RMMZ.Direction): RMMZ.Direction;
    /**
     * @param {number} x
     * @param {number} y
     * @param {RMMZ.Direction} d
     * @returns {boolean}
     */
    canPass(x: number, y: number, d: RMMZ.Direction): boolean;
    /**
     * @param {number} x
     * @param {number} y
     * @param {RMMZ.Direction} horz
     * @param {RMMZ.Direction} vert
     * @returns {boolean}
     */
    canPassDiagonally(x: number, y: number, horz: RMMZ.Direction, vert: RMMZ.Direction): boolean;
    /**
     * @param {number} x
     * @param {number} y
     * @param {RMMZ.Direction} d
     * @returns {boolean}
     */
    isMapPassable(x: number, y: number, d: RMMZ.Direction): boolean;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isCollidedWithCharacters(x: number, y: number): boolean;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isCollidedWithEvents(x: number, y: number): boolean;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isCollidedWithVehicles(x: number, y: number): boolean;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    setPosition(x: number, y: number): void;
    /**
     * @param {Game_CharacterBase} character
     * @returns {void}
     */
    copyPosition(character: Game_CharacterBase): void;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    locate(x: number, y: number): void;
    /** @returns {RMMZ.Direction} */
    direction(): RMMZ.Direction;
    /**
     * @param {RMMZ.Direction | 0} [d]
     * @returns {void}
     */
    setDirection(d?: RMMZ.Direction | 0): void;
    /** @returns {boolean} */
    isTile(): boolean;
    /** @returns {boolean} */
    isObjectCharacter(): boolean;
    /** @returns {0 | 6} */
    shiftY(): 0 | 6;
    /** @returns {number} */
    scrolledX(): number;
    /** @returns {number} */
    scrolledY(): number;
    /** @returns {number} */
    screenX(): number;
    /** @returns {number} */
    screenY(): number;
    /** @returns {number} */
    screenZ(): number;
    /** @returns {boolean} */
    isNearTheScreen(): boolean;
    /** @returns {void} */
    update(): void;
    /** @returns {void} */
    updateStop(): void;
    /** @returns {void} */
    updateJump(): void;
    /** @returns {void} */
    updateMove(): void;
    /** @returns {void} */
    updateAnimation(): void;
    /** @returns {number} */
    animationWait(): number;
    /** @returns {void} */
    updateAnimationCount(): void;
    /** @returns {void} */
    updatePattern(): void;
    /** @returns {number} */
    maxPattern(): number;
    /** @returns {number} */
    pattern(): number;
    /**
     * @param {number} pattern
     * @returns {void}
     */
    setPattern(pattern: number): void;
    /** @returns {boolean} */
    isOriginalPattern(): boolean;
    /** @returns {void} */
    resetPattern(): void;
    /** @returns {void} */
    refreshBushDepth(): void;
    /** @returns {boolean} */
    isOnLadder(): boolean;
    /** @returns {boolean} */
    isOnBush(): boolean;
    /** @returns {number} */
    terrainTag(): number;
    /** @returns {number} */
    regionId(): number;
    /** @returns {void} */
    increaseSteps(): void;
    /** @returns {number} */
    tileId(): number;
    /** @returns {string} */
    characterName(): string;
    /** @returns {number} */
    characterIndex(): number;
    /**
     * @param {string} characterName
     * @param {number} characterIndex
     * @returns {void}
     */
    setImage(characterName: string, characterIndex: number): void;
    /**
     * @param {RMMZ.TileID} tileId
     * @returns {void}
     */
    setTileImage(tileId: RMMZ.TileID): void;
    /**
     * @param {RMMZ.Direction} d
     * @returns {void}
     */
    checkEventTriggerTouchFront(d: RMMZ.Direction): void;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean | void}
     */
    checkEventTriggerTouch(x: number, y: number): boolean | void;
    /** @returns {boolean} */
    isMovementSucceeded(): boolean;
    /**
     * @param {boolean} success
     * @returns {void}
     */
    setMovementSuccess(success: boolean): void;
    /**
     * @param {RMMZ.Direction} d
     * @returns {void}
     */
    moveStraight(d: RMMZ.Direction): void;
    /**
     * @param {RMMZ.Direction} horz
     * @param {RMMZ.Direction} vert
     * @returns {void}
     */
    moveDiagonally(horz: RMMZ.Direction, vert: RMMZ.Direction): void;
    /**
     * @param {number} xPlus
     * @param {number} yPlus
     * @returns {void}
     */
    jump(xPlus: number, yPlus: number): void;
    /** @returns {boolean} */
    hasWalkAnime(): boolean;
    /**
     * @param {boolean} walkAnime
     * @returns {void}
     */
    setWalkAnime(walkAnime: boolean): void;
    /** @returns {boolean} */
    hasStepAnime(): boolean;
    /**
     * @param {boolean} stepAnime
     * @returns {void}
     */
    setStepAnime(stepAnime: boolean): void;
    /** @returns {boolean} */
    isDirectionFixed(): boolean;
    /**
     * @param {boolean} directionFix
     * @returns {void}
     */
    setDirectionFix(directionFix: boolean): void;
    /** @returns {boolean} */
    isThrough(): boolean;
    /**
     * @param {boolean} through
     * @returns {void}
     */
    setThrough(through: boolean): void;
    /** @returns {boolean} */
    isTransparent(): boolean;
    /** @returns {number} */
    bushDepth(): number;
    /**
     * @param {boolean} transparent
     * @returns {void}
     */
    setTransparent(transparent: boolean): void;
    /** @returns {void} */
    startAnimation(): void;
    /** @returns {void} */
    startBalloon(): void;
    /** @returns {boolean} */
    isAnimationPlaying(): boolean;
    /** @returns {boolean} */
    isBalloonPlaying(): boolean;
    /** @returns {void} */
    endAnimation(): void;
    /** @returns {void} */
    endBalloon(): void;
}
/**
 * The superclass of Game_Player, Game_Follower, GameVehicle, and Game_Event.
 */
declare class Game_Character extends Game_CharacterBase {
    static ROUTE_END: number;
    static ROUTE_MOVE_DOWN: number;
    static ROUTE_MOVE_LEFT: number;
    static ROUTE_MOVE_RIGHT: number;
    static ROUTE_MOVE_UP: number;
    static ROUTE_MOVE_LOWER_L: number;
    static ROUTE_MOVE_LOWER_R: number;
    static ROUTE_MOVE_UPPER_L: number;
    static ROUTE_MOVE_UPPER_R: number;
    static ROUTE_MOVE_RANDOM: number;
    static ROUTE_MOVE_TOWARD: number;
    static ROUTE_MOVE_AWAY: number;
    static ROUTE_MOVE_FORWARD: number;
    static ROUTE_MOVE_BACKWARD: number;
    static ROUTE_JUMP: number;
    static ROUTE_WAIT: number;
    static ROUTE_TURN_DOWN: number;
    static ROUTE_TURN_LEFT: number;
    static ROUTE_TURN_RIGHT: number;
    static ROUTE_TURN_UP: number;
    static ROUTE_TURN_90D_R: number;
    static ROUTE_TURN_90D_L: number;
    static ROUTE_TURN_180D: number;
    static ROUTE_TURN_90D_R_L: number;
    static ROUTE_TURN_RANDOM: number;
    static ROUTE_TURN_TOWARD: number;
    static ROUTE_TURN_AWAY: number;
    static ROUTE_SWITCH_ON: number;
    static ROUTE_SWITCH_OFF: number;
    static ROUTE_CHANGE_SPEED: number;
    static ROUTE_CHANGE_FREQ: number;
    static ROUTE_WALK_ANIME_ON: number;
    static ROUTE_WALK_ANIME_OFF: number;
    static ROUTE_STEP_ANIME_ON: number;
    static ROUTE_STEP_ANIME_OFF: number;
    static ROUTE_DIR_FIX_ON: number;
    static ROUTE_DIR_FIX_OFF: number;
    static ROUTE_THROUGH_ON: number;
    static ROUTE_THROUGH_OFF: number;
    static ROUTE_TRANSPARENT_ON: number;
    static ROUTE_TRANSPARENT_OFF: number;
    static ROUTE_CHANGE_IMAGE: number;
    static ROUTE_CHANGE_OPACITY: number;
    static ROUTE_CHANGE_BLEND_MODE: number;
    static ROUTE_PLAY_SE: number;
    static ROUTE_SCRIPT: number;
    /** @type {boolean} */
    _moveRouteForcing: boolean | undefined;
    /** @type {RMMZ.MoveRoute | null} */
    _moveRoute: RMMZ.MoveRoute | null | undefined;
    /** @type {number} */
    _moveRouteIndex: number | undefined;
    /** @type {RMMZ.MoveRoute | null} */
    _originalMoveRoute: RMMZ.MoveRoute | null | undefined;
    /** @type {number} */
    _originalMoveRouteIndex: number | undefined;
    /** @type {number} */
    _waitCount: number | undefined;
    /** @returns {void} */
    memorizeMoveRoute(): void;
    /** @returns {void} */
    restoreMoveRoute(): void;
    /** @returns {boolean} */
    isMoveRouteForcing(): boolean;
    /**
     * @param {RMMZ.MoveRoute} moveRoute
     * @returns {void}
     */
    setMoveRoute(moveRoute: RMMZ.MoveRoute): void;
    /**
     * @param {RMMZ.MoveRoute} moveRoute
     * @returns {void}
     */
    forceMoveRoute(moveRoute: RMMZ.MoveRoute): void;
    /** @returns {void} */
    updateRoutineMove(): void;
    /**
     * @param {RMMZ.DataCommand} command
     * @returns {void}
     */
    processMoveCommand(command: RMMZ.DataCommand): void;
    /**
     * @param {number} x
     * @returns {number}
     */
    deltaXFrom(x: number): number;
    /**
     * @param {number} y
     * @returns {number}
     */
    deltaYFrom(y: number): number;
    /** @returns {void} */
    moveRandom(): void;
    /**
     * @param {Game_Character} character
     * @returns {void}
     */
    moveTowardCharacter(character: Game_Character): void;
    /**
     * @param {Game_Character} character
     * @returns {void}
     */
    moveAwayFromCharacter(character: Game_Character): void;
    /**
     * @param {Game_Character} character
     * @returns {void}
     */
    turnTowardCharacter(character: Game_Character): void;
    /**
     * @param {Game_Character} character
     * @returns {void}
     */
    turnAwayFromCharacter(character: Game_Character): void;
    /** @returns {void} */
    turnTowardPlayer(): void;
    /** @returns {void} */
    turnAwayFromPlayer(): void;
    /** @returns {void} */
    moveTowardPlayer(): void;
    /** @returns {void} */
    moveAwayFromPlayer(): void;
    /** @returns {void} */
    moveForward(): void;
    /** @returns {void} */
    moveBackward(): void;
    /** @returns {void} */
    processRouteEnd(): void;
    /** @returns {void} */
    advanceMoveRouteIndex(): void;
    /** @returns {void} */
    turnRight90(): void;
    /** @returns {void} */
    turnLeft90(): void;
    /** @returns {void} */
    turn180(): void;
    /** @returns {void} */
    turnRightOrLeft90(): void;
    /** @returns {void} */
    turnRandom(): void;
    /**
     * @param {Game_Character} character
     * @returns {void}
     */
    swap(character: Game_Character): void;
    /**
     * @param {number} goalX
     * @param {number} goalY
     * @returns {0 | 2 | 4 | 8 | 6}
     */
    findDirectionTo(goalX: number, goalY: number): 0 | 2 | 4 | 8 | 6;
    /** @returns {number} */
    searchLimit(): number;
}
/**
 * The game object class for the player. It contains event starting
 * determinants and map scrolling functions.
 */
declare class Game_Player extends Game_Character {
    /** @type {RMMZ.VehicleType} */
    _vehicleType: RMMZ.VehicleType | undefined;
    /** @type {boolean} */
    _vehicleGettingOn: boolean | undefined;
    /** @type {boolean} */
    _vehicleGettingOff: boolean | undefined;
    /** @type {boolean} */
    _dashing: boolean | undefined;
    /** @type {boolean} */
    _needsMapReload: boolean | undefined;
    /** @type {boolean} */
    _transferring: boolean | undefined;
    /** @type {number} */
    _newMapId: number | undefined;
    /** @type {number} */
    _newX: number | undefined;
    /** @type {number} */
    _newY: number | undefined;
    /** @type {RMMZ.Direction} */
    _newDirection: RMMZ.Direction | undefined;
    /** @type {number | undefined} */
    _fadeType: number | undefined;
    /** @type {Game_Followers} */
    _followers: Game_Followers | undefined;
    /** @type {number} */
    _encounterCount: number | undefined;
    /** @returns {void} */
    clearTransferInfo(): void;
    /** @returns {Game_Followers} */
    followers(): Game_Followers;
    /** @returns {void} */
    refresh(): void;
    /**
     * @param {RMMZ.MapID} mapId
     * @param {number} x
     * @param {number} y
     * @param {RMMZ.Direction} [d]
     * @param {number} [fadeType]
     * @returns {void}
     */
    reserveTransfer(mapId: RMMZ.MapID, x: number, y: number, d?: RMMZ.Direction, fadeType?: number): void;
    /** @returns {void} */
    setupForNewGame(): void;
    /** @returns {void} */
    requestMapReload(): void;
    /** @returns {boolean} */
    isTransferring(): boolean;
    /** @returns {number} */
    newMapId(): number;
    /** @returns {number | undefined} */
    fadeType(): number | undefined;
    /** @returns {void} */
    performTransfer(): void;
    /** @returns {import("./Game_Vehicle").Game_Vehicle} */
    vehicle(): any;
    /** @returns {boolean} */
    isInBoat(): boolean;
    /** @returns {boolean} */
    isInShip(): boolean;
    /** @returns {boolean} */
    isInAirship(): boolean;
    /** @returns {boolean} */
    isInVehicle(): boolean;
    /** @returns {boolean} */
    isNormal(): boolean;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isCollided(x: number, y: number): boolean;
    /** @returns {number} */
    centerX(): number;
    /** @returns {number} */
    centerY(): number;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    center(x: number, y: number): void;
    /** @returns {void} */
    makeEncounterCount(): void;
    /** @returns {number} */
    makeEncounterTroopId(): number;
    /**
     * @param {RMMZ.DataEncounter} encounter
     * @returns {boolean}
     */
    meetsEncounterConditions(encounter: RMMZ.DataEncounter): boolean;
    /** @returns {boolean} */
    executeEncounter(): boolean;
    /**
     * @param {number} x
     * @param {number} y
     * @param {number[]} triggers
     * @param {boolean} normal
     * @returns {void}
     */
    startMapEvent(x: number, y: number, triggers: number[], normal: boolean): void;
    /** @returns {void} */
    moveByInput(): void;
    /** @returns {boolean} */
    canMove(): boolean;
    /** @returns {RMMZ.Direction} */
    getInputDirection(): RMMZ.Direction;
    /**
     * @param {RMMZ.Direction} direction
     * @returns {void}
     */
    executeMove(direction: RMMZ.Direction): void;
    /**
     * @param {boolean} [sceneActive]
     * @returns {void}
     */
    update(sceneActive?: boolean): void;
    /** @returns {void} */
    updateDashing(): void;
    /** @returns {boolean} */
    isDashButtonPressed(): boolean;
    /**
     * @param {number} lastScrolledX
     * @param {number} lastScrolledY
     * @returns {void}
     */
    updateScroll(lastScrolledX: number, lastScrolledY: number): void;
    /** @returns {void} */
    updateVehicle(): void;
    /** @returns {void} */
    updateVehicleGetOn(): void;
    /** @returns {void} */
    updateVehicleGetOff(): void;
    /**
     * @param {boolean} wasMoving
     * @param {boolean} [sceneActive]
     * @returns {void}
     */
    updateNonmoving(wasMoving: boolean, sceneActive?: boolean): void;
    /** @returns {boolean} */
    triggerAction(): boolean;
    /** @returns {boolean} */
    triggerButtonAction(): boolean;
    /** @returns {boolean} */
    triggerTouchAction(): boolean;
    /**
     * @param {number} x1
     * @param {number} y1
     * @returns {boolean}
     */
    triggerTouchActionD1(x1: number, y1: number): boolean;
    /**
     * @param {number} x2
     * @param {number} y2
     * @returns {boolean}
     */
    triggerTouchActionD2(x2: number, y2: number): boolean;
    /**
     * @param {number} x2
     * @param {number} y2
     * @returns {boolean}
     */
    triggerTouchActionD3(x2: number, y2: number): boolean;
    /** @returns {void} */
    updateEncounterCount(): void;
    /** @returns {boolean} */
    canEncounter(): boolean;
    /** @returns {number} */
    encounterProgressValue(): number;
    /**
     * @param {number[]} triggers
     * @returns {void}
     */
    checkEventTriggerHere(triggers: number[]): void;
    /**
     * @param {number[]} triggers
     * @returns {void}
     */
    checkEventTriggerThere(triggers: number[]): void;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    checkEventTriggerTouch(x: number, y: number): void;
    /** @returns {boolean} */
    canStartLocalEvents(): boolean;
    /** @returns {boolean} */
    getOnOffVehicle(): boolean;
    /** @returns {boolean} */
    getOnVehicle(): boolean;
    /** @returns {boolean} */
    getOffVehicle(): boolean;
    /** @returns {void} */
    forceMoveForward(): void;
    /** @returns {boolean} */
    isOnDamageFloor(): boolean;
    /** @returns {void} */
    showFollowers(): void;
    /** @returns {void} */
    hideFollowers(): void;
    /** @returns {void} */
    gatherFollowers(): void;
    /** @returns {boolean} */
    areFollowersGathering(): boolean;
    /** @returns {boolean} */
    areFollowersGathered(): boolean;
}
/**
 * The game object class for a follower. A follower is an allied character,
 * other than the front character, displayed in the party.
 */
declare class Game_Follower extends Game_Character {
    /** @param {[memberIndex: number]} args */
    constructor(memberIndex: number);
    /** @param {number} memberIndex */
    initialize(memberIndex: number): void;
    /** @type {number} */
    _memberIndex: number | undefined;
    /** @returns {void} */
    refresh(): void;
    /** @returns {import("./Game_Actor").Game_Actor} */
    actor(): any;
    /** @returns {boolean} */
    isVisible(): boolean;
    /** @returns {boolean} */
    isGathered(): boolean;
    /**
     * @param {Game_Character} character
     * @returns {void}
     */
    chaseCharacter(character: Game_Character): void;
}
/**
 * The wrapper class for a follower array.
 */
declare class Game_Followers {
    /** @param {[]} args */
    constructor();
    initialize(): void;
    /** @type {boolean} */
    _visible: boolean | undefined;
    /** @type {boolean} */
    _gathering: boolean | undefined;
    /** @type {Game_Follower[]} */
    _data: Game_Follower[] | undefined;
    /** @returns {void} */
    setup(): void;
    /** @returns {boolean} */
    isVisible(): boolean;
    /** @returns {void} */
    show(): void;
    /** @returns {void} */
    hide(): void;
    /** @returns {Game_Follower[]} */
    data(): Game_Follower[];
    /** @returns {Game_Follower[]} */
    reverseData(): Game_Follower[];
    /**
     * @param {number} index
     * @returns {Game_Follower}
     */
    follower(index: number): Game_Follower;
    /** @returns {void} */
    refresh(): void;
    /** @returns {void} */
    update(): void;
    /** @returns {void} */
    updateMove(): void;
    /** @returns {void} */
    jumpAll(): void;
    /**
     * @param {number} x
     * @param {number} y
     * @param {RMMZ.Direction} d
     * @returns {void}
     */
    synchronize(x: number, y: number, d: RMMZ.Direction): void;
    /** @returns {void} */
    gather(): void;
    /** @returns {boolean} */
    areGathering(): boolean;
    /** @returns {Game_Follower[]} */
    visibleFollowers(): Game_Follower[];
    /** @returns {boolean} */
    areMoving(): boolean;
    /** @returns {boolean} */
    areGathered(): boolean;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isSomeoneCollided(x: number, y: number): boolean;
}
/**
 * The game object class for a vehicle.
 */
declare class Game_Vehicle extends Game_Character {
    /** @param {[type: RMMZ.VehicleType]} args */
    constructor(type: RMMZ.VehicleType);
    /** @param {RMMZ.VehicleType} type */
    initialize(type: RMMZ.VehicleType): void;
    /** @type {RMMZ.VehicleType} */
    _type: RMMZ.VehicleType | undefined;
    /** @type {number} */
    _mapId: number | undefined;
    /** @type {number} */
    _altitude: number | undefined;
    /** @type {boolean} */
    _driving: boolean | undefined;
    /** @type {RMMZ.DataAudio | null} */
    _bgm: RMMZ.AudioFile | null | undefined;
    /** @returns {boolean} */
    isBoat(): boolean;
    /** @returns {boolean} */
    isShip(): boolean;
    /** @returns {boolean} */
    isAirship(): boolean;
    /** @returns {void} */
    resetDirection(): void;
    /** @returns {void} */
    initMoveSpeed(): void;
    /** @returns {import("../data").DataVehicle | null} */
    vehicle(): any | null;
    /** @returns {void} */
    loadSystemSettings(): void;
    /** @returns {void} */
    refresh(): void;
    /**
     * @param {RMMZ.MapID} mapId
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    setLocation(mapId: RMMZ.MapID, x: number, y: number): void;
    /** @returns {void} */
    getOn(): void;
    /** @returns {void} */
    getOff(): void;
    /**
     * @param {RMMZ.DataAudio} bgm
     * @returns {void}
     */
    setBgm(bgm: RMMZ.DataAudio): void;
    /** @returns {void} */
    playBgm(): void;
    /** @returns {void} */
    syncWithPlayer(): void;
    /** @returns {number} */
    shadowX(): number;
    /** @returns {number} */
    shadowY(): number;
    /** @returns {number} */
    shadowOpacity(): number;
    /** @returns {boolean} */
    canMove(): boolean;
    /** @returns {void} */
    updateAirship(): void;
    /** @returns {void} */
    updateAirshipAltitude(): void;
    /** @returns {number} */
    maxAltitude(): number;
    /** @returns {boolean} */
    isLowest(): boolean;
    /** @returns {boolean} */
    isHighest(): boolean;
    /** @returns {boolean} */
    isTakeoffOk(): boolean;
    /**
     * @param {number} x
     * @param {number} y
     * @param {RMMZ.Direction} d
     * @returns {boolean}
     */
    isLandOk(x: number, y: number, d: RMMZ.Direction): boolean;
}
/**
 * The game object class for an event. It contains functionality for event page
 * switching and running parallel process events.
 */
declare class Game_Event extends Game_Character {
    /** @param {[mapId: RMMZ.MapID, eventId: RMMZ.EventID]} args */
    constructor(mapId: number, eventId: number);
    /**
     * @param {RMMZ.MapID} mapId
     * @param {RMMZ.EventID} eventId
     */
    initialize(mapId: RMMZ.MapID, eventId: RMMZ.EventID): void;
    /** @type {RMMZ.MapID} */
    _mapId: number | undefined;
    /** @type {RMMZ.EventID} */
    _eventId: number | undefined;
    /** @type {number} */
    _moveType: number | undefined;
    /** @type {number | null} */
    _trigger: number | null | undefined;
    /** @type {boolean} */
    _starting: boolean | undefined;
    /** @type {boolean} */
    _erased: boolean | undefined;
    /** @type {number} */
    _pageIndex: number | undefined;
    /** @type {number} */
    _originalPattern: number | undefined;
    /** @type {number} */
    _originalDirection: number | undefined;
    /** @type {RMMZ.Direction} */
    _prelockDirection: RMMZ.Direction | undefined;
    /** @type {boolean} */
    _locked: boolean | undefined;
    /** @returns {number} */
    eventId(): number;
    /** @returns {import("../data").DataEvent} */
    event(): any;
    /** @returns {RMMZ.DataEventPage} */
    page(): RMMZ.DataEventPage;
    /** @returns {import("../data").DataCommand[]} */
    list(): any[];
    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isCollidedWithPlayerCharacters(x: number, y: number): boolean;
    /** @returns {void} */
    lock(): void;
    /** @returns {void} */
    unlock(): void;
    /** @returns {void} */
    updateSelfMovement(): void;
    /** @returns {number} */
    stopCountThreshold(): number;
    /** @returns {void} */
    moveTypeRandom(): void;
    /** @returns {void} */
    moveTypeTowardPlayer(): void;
    /** @returns {boolean} */
    isNearThePlayer(): boolean;
    /** @returns {void} */
    moveTypeCustom(): void;
    /** @returns {boolean} */
    isStarting(): boolean;
    /** @returns {void} */
    clearStartingFlag(): void;
    /**
     * @param {number[]} triggers
     * @returns {boolean}
     */
    isTriggerIn(triggers: number[]): boolean;
    /** @returns {void} */
    start(): void;
    /** @returns {void} */
    erase(): void;
    /** @returns {void} */
    refresh(): void;
    /** @returns {number} */
    findProperPageIndex(): number;
    /**
     * @param {RMMZ.DataEventPage} page
     * @returns {boolean}
     */
    meetsConditions(page: RMMZ.DataEventPage): boolean;
    /** @returns {void} */
    setupPage(): void;
    /** @returns {void} */
    clearPageSettings(): void;
    _interpreter: Game_Interpreter | null | undefined;
    /** @returns {void} */
    setupPageSettings(): void;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    checkEventTriggerTouch(x: number, y: number): void;
    /** @returns {void} */
    checkEventTriggerAuto(): void;
    /** @returns {void} */
    updateParallel(): void;
}
/**
 * The interpreter for running event commands.
 */
declare class Game_Interpreter {
    /** @param {[depth?: number]} args */
    constructor(depth?: number | undefined);
    /** @param {number} [depth] */
    initialize(depth?: number): void;
    /** @type {number} */
    _depth: number | undefined;
    /** @type {Record<number, number | boolean | null>} */
    _branch: Record<number, number | boolean | null> | undefined;
    /** @type {number} */
    _indent: number | undefined;
    /** @type {number} */
    _frameCount: number | undefined;
    /** @type {number} */
    _freezeChecker: number | undefined;
    /** @returns {void} */
    checkOverflow(): void;
    /** @returns {void} */
    clear(): void;
    _mapId: number | undefined;
    _eventId: number | undefined;
    _list: RMMZ.DataEventCommand[] | null | undefined;
    _index: number | undefined;
    _waitCount: number | undefined;
    _waitMode: string | undefined;
    _comments: string | string[] | undefined;
    _characterId: number | undefined;
    _childInterpreter: Game_Interpreter | null | undefined;
    /**
     * @param {RMMZ.DataCommand[]} list
     * @param {RMMZ.EventID} [eventId]
     * @returns {void}
     */
    setup(list: RMMZ.DataCommand[], eventId?: RMMZ.EventID): void;
    /**
     * Preloads face and picture images referenced by upcoming event commands.
     * This is usually sufficient compared with the more complicated preload
     * scheme in certain versions of MV.
     *
     * @returns {void}
     */
    loadImages(): void;
    /** @returns {number} */
    eventId(): number;
    /** @returns {boolean} */
    isOnCurrentMap(): boolean;
    /** @returns {boolean} */
    setupReservedCommonEvent(): boolean;
    /** @returns {boolean} */
    isRunning(): boolean;
    /** @returns {void} */
    update(): void;
    /** @returns {boolean} */
    updateChild(): boolean;
    /** @returns {boolean | null} */
    updateWait(): boolean | null;
    /** @returns {boolean} */
    updateWaitCount(): boolean;
    /** @returns {boolean | null} */
    updateWaitMode(): boolean | null;
    /**
     * @param {RMMZ.WaitMode} waitMode
     * @returns {void}
     */
    setWaitMode(waitMode: RMMZ.WaitMode): void;
    /**
     * @param {number} duration
     * @returns {void}
     */
    wait(duration: number): void;
    /** @returns {number} */
    fadeSpeed(): number;
    /** @returns {boolean} */
    executeCommand(): boolean;
    /** @returns {boolean} */
    checkFreeze(): boolean;
    /** @returns {void} */
    terminate(): void;
    /** @returns {void} */
    skipBranch(): void;
    /**
     * @template {RMMZ.CommandCode} T
     * @returns {RMMZ.ExtractDataCommand<T>}
     */
    currentCommand<T extends RMMZ.CommandCode>(): RMMZ.ExtractDataCommand<T>;
    /** @returns {0 | 1 | 16 | 2 | 3 | 4 | 5 | 113 | 115 | 12 | 15 | 20 | 30 | 128 | 8 | 7 | 6 | 10 | 9 | 24 | 40 | 32 | 26 | 13 | 17 | 18 | 27 | 33 | 34 | 37 | 38 | 39 | 45 | 102 | 104 | 14 | 36 | 11 | 21 | 22 | 23 | 31 | 35 | 41 | 42 | 43 | 44 | 19 | 25 | 28 | 29 | 101 | 401 | 402 | 403 | 103 | 105 | 405 | 108 | 408 | 109 | 111 | 411 | 112 | 413 | 117 | 118 | 119 | 121 | 122 | 123 | 124 | 125 | 126 | 127 | 129 | 132 | 133 | 134 | 135 | 136 | 137 | 138 | 139 | 140 | 201 | 202 | 203 | 204 | 205 | 505 | 206 | 211 | 212 | 213 | 214 | 216 | 217 | 221 | 222 | 223 | 224 | 225 | 230 | 231 | 232 | 233 | 234 | 235 | 236 | 241 | 242 | 243 | 244 | 245 | 246 | 249 | 250 | 251 | 261 | 281 | 282 | 283 | 284 | 285 | 301 | 601 | 602 | 603 | 302 | 605 | 303 | 311 | 312 | 326 | 313 | 314 | 315 | 316 | 317 | 318 | 319 | 320 | 321 | 322 | 323 | 324 | 325 | 331 | 332 | 342 | 333 | 334 | 335 | 336 | 337 | 339 | 340 | 351 | 352 | 353 | 354 | 355 | 655 | 356 | 357} */
    nextEventCode(): 0 | 1 | 16 | 2 | 3 | 4 | 5 | 113 | 115 | 12 | 15 | 20 | 30 | 128 | 8 | 7 | 6 | 10 | 9 | 24 | 40 | 32 | 26 | 13 | 17 | 18 | 27 | 33 | 34 | 37 | 38 | 39 | 45 | 102 | 104 | 14 | 36 | 11 | 21 | 22 | 23 | 31 | 35 | 41 | 42 | 43 | 44 | 19 | 25 | 28 | 29 | 101 | 401 | 402 | 403 | 103 | 105 | 405 | 108 | 408 | 109 | 111 | 411 | 112 | 413 | 117 | 118 | 119 | 121 | 122 | 123 | 124 | 125 | 126 | 127 | 129 | 132 | 133 | 134 | 135 | 136 | 137 | 138 | 139 | 140 | 201 | 202 | 203 | 204 | 205 | 505 | 206 | 211 | 212 | 213 | 214 | 216 | 217 | 221 | 222 | 223 | 224 | 225 | 230 | 231 | 232 | 233 | 234 | 235 | 236 | 241 | 242 | 243 | 244 | 245 | 246 | 249 | 250 | 251 | 261 | 281 | 282 | 283 | 284 | 285 | 301 | 601 | 602 | 603 | 302 | 605 | 303 | 311 | 312 | 326 | 313 | 314 | 315 | 316 | 317 | 318 | 319 | 320 | 321 | 322 | 323 | 324 | 325 | 331 | 332 | 342 | 333 | 334 | 335 | 336 | 337 | 339 | 340 | 351 | 352 | 353 | 354 | 355 | 655 | 356 | 357;
    /**
     * @param {RMMZ.ActorID} param
     * @param {(actor: Game_Actor) => void} callback
     * @returns {void}
     */
    iterateActorId(param: RMMZ.ActorID, callback: (actor: Game_Actor) => void): void;
    /**
     * @param {0 | 1} param1
     * @param {RMMZ.ActorID | RMMZ.VariableID} param2
     * @param {(actor: Game_Actor) => void} callback
     * @returns {void}
     */
    iterateActorEx(param1: 0 | 1, param2: RMMZ.ActorID | RMMZ.VariableID, callback: (actor: Game_Actor) => void): void;
    /**
     * @param {number} param
     * @param {(actor: Game_Actor) => void} callback
     * @returns {void}
     */
    iterateActorIndex(param: number, callback: (actor: Game_Actor) => void): void;
    /**
     * @param {number} param
     * @param {(enemy: Game_Enemy) => void} callback
     * @returns {void}
     */
    iterateEnemyIndex(param: number, callback: (enemy: Game_Enemy) => void): void;
    /**
     * @param {0 | 1} param1
     * @param {RMMZ.EnemyID | RMMZ.ActorID} param2
     * @param {(battler: RMMZ.ActionTarget) => void} callback
     * @returns {void}
     */
    iterateBattler(param1: 0 | 1, param2: RMMZ.EnemyID | RMMZ.ActorID, callback: (battler: RMMZ.ActionTarget) => void): void;
    /**
     * @param {RMMZ.CharacterID} param
     * @returns {Game_Character | null}
     */
    character(param: RMMZ.CharacterID): Game_Character | null;
    /**
     * @param {RMMZ.ValueOperation} operation
     * @param {0 | 1} operandType
     * @param {number | RMMZ.VariableID} operand
     * @returns {number}
     */
    operateValue(operation: RMMZ.ValueOperation, operandType: 0 | 1, operand: number | RMMZ.VariableID): number;
    /**
     * @param {RMMZ.ActionTarget} target
     * @param {number} value
     * @param {boolean} allowDeath
     * @returns {void}
     */
    changeHp(target: RMMZ.ActionTarget, value: number, allowDeath: boolean): void;
    /**
     * @param {RMMZ.CommandParams<101>} params
     * @returns {boolean}
     */
    command101(params: RMMZ.CommandParams<101>): boolean;
    /**
     * @param {RMMZ.CommandParams<102>} params
     * @returns {boolean}
     */
    command102(params: RMMZ.CommandParams<102>): boolean;
    /**
     * @param {RMMZ.CommandParams<102>} params
     * @returns {void}
     */
    setupChoices(params: RMMZ.CommandParams<102>): void;
    /**
     * @param {RMMZ.CommandParams<402>} params
     * @returns {boolean}
     */
    command402(params: RMMZ.CommandParams<402>): boolean;
    /** @returns {boolean} */
    command403(): boolean;
    /**
     * @param {RMMZ.CommandParams<103>} params
     * @returns {boolean}
     */
    command103(params: RMMZ.CommandParams<103>): boolean;
    /**
     * @param {RMMZ.CommandParams<103>} params
     * @returns {void}
     */
    setupNumInput(params: RMMZ.CommandParams<103>): void;
    /**
     * @param {RMMZ.CommandParams<104>} params
     * @returns {boolean}
     */
    command104(params: RMMZ.CommandParams<104>): boolean;
    /**
     * @param {RMMZ.CommandParams<104>} params
     * @returns {void}
     */
    setupItemChoice(params: RMMZ.CommandParams<104>): void;
    /**
     * @param {RMMZ.CommandParams<105>} params
     * @returns {boolean}
     */
    command105(params: RMMZ.CommandParams<105>): boolean;
    /**
     * @param {RMMZ.CommandParams<108>} params
     * @returns {boolean}
     */
    command108(params: RMMZ.CommandParams<108>): boolean;
    /** @returns {boolean} */
    command109(): boolean;
    /**
     * @param {RMMZ.CommandParams<111>} params
     * @returns {boolean}
     */
    command111(params: RMMZ.CommandParams<111>): boolean;
    /** @returns {boolean} */
    command411(): boolean;
    /** @returns {boolean} */
    command112(): boolean;
    /** @returns {boolean} */
    command413(): boolean;
    /** @returns {boolean} */
    command113(): boolean;
    /** @returns {boolean} */
    command115(): boolean;
    /**
     * @param {RMMZ.CommandParams<117>} params
     * @returns {boolean}
     */
    command117(params: RMMZ.CommandParams<117>): boolean;
    /**
     * @param {RMMZ.DataCommand[]} list
     * @param {RMMZ.EventID} eventId
     * @returns {void}
     */
    setupChild(list: RMMZ.DataCommand[], eventId: RMMZ.EventID): void;
    /** @returns {boolean} */
    command118(): boolean;
    /**
     * @param {RMMZ.CommandParams<119>} params
     * @returns {boolean}
     */
    command119(params: RMMZ.CommandParams<119>): boolean;
    /**
     * @param {number} index
     * @returns {void}
     */
    jumpTo(index: number): void;
    /**
     * @param {RMMZ.CommandParams<121>} params
     * @returns {boolean}
     */
    command121(params: RMMZ.CommandParams<121>): boolean;
    /**
     * @param {RMMZ.CommandParams<122>} params
     * @returns {boolean}
     */
    command122(params: RMMZ.CommandParams<122>): boolean;
    /**
     * @param {number} type
     * @param {number} param1
     * @param {number} [param2]
     * @returns {number}
     */
    gameDataOperand(type: number, param1: number, param2?: number): number;
    /**
     * @param {RMMZ.VariableID} variableId
     * @param {RMMZ.VariableOperationType} operationType
     * @param {number} value
     * @returns {void}
     */
    operateVariable(variableId: RMMZ.VariableID, operationType: RMMZ.VariableOperationType, value: number): void;
    /**
     * @param {RMMZ.CommandParams<123>} params
     * @returns {boolean}
     */
    command123(params: RMMZ.CommandParams<123>): boolean;
    /**
     * @param {RMMZ.CommandParams<124>} params
     * @returns {boolean}
     */
    command124(params: RMMZ.CommandParams<124>): boolean;
    /**
     * @param {RMMZ.CommandParams<125>} params
     * @returns {boolean}
     */
    command125(params: RMMZ.CommandParams<125>): boolean;
    /**
     * @param {RMMZ.CommandParams<126>} params
     * @returns {boolean}
     */
    command126(params: RMMZ.CommandParams<126>): boolean;
    /**
     * @param {RMMZ.CommandParams<127>} params
     * @returns {boolean}
     */
    command127(params: RMMZ.CommandParams<127>): boolean;
    /**
     * @param {RMMZ.CommandParams<128>} params
     * @returns {boolean}
     */
    command128(params: RMMZ.CommandParams<128>): boolean;
    /**
     * @param {RMMZ.CommandParams<129>} params
     * @returns {boolean}
     */
    command129(params: RMMZ.CommandParams<129>): boolean;
    /**
     * @param {RMMZ.CommandParams<132>} params
     * @returns {boolean}
     */
    command132(params: RMMZ.CommandParams<132>): boolean;
    /**
     * @param {RMMZ.CommandParams<133>} params
     * @returns {boolean}
     */
    command133(params: RMMZ.CommandParams<133>): boolean;
    /**
     * @param {RMMZ.CommandParams<134>} params
     * @returns {boolean}
     */
    command134(params: RMMZ.CommandParams<134>): boolean;
    /**
     * @param {RMMZ.CommandParams<135>} params
     * @returns {boolean}
     */
    command135(params: RMMZ.CommandParams<135>): boolean;
    /**
     * @param {RMMZ.CommandParams<136>} params
     * @returns {boolean}
     */
    command136(params: RMMZ.CommandParams<136>): boolean;
    /**
     * @param {RMMZ.CommandParams<137>} params
     * @returns {boolean}
     */
    command137(params: RMMZ.CommandParams<137>): boolean;
    /**
     * @param {RMMZ.CommandParams<138>} params
     * @returns {boolean}
     */
    command138(params: RMMZ.CommandParams<138>): boolean;
    /**
     * @param {RMMZ.CommandParams<139>} params
     * @returns {boolean}
     */
    command139(params: RMMZ.CommandParams<139>): boolean;
    /**
     * @param {RMMZ.CommandParams<140>} params
     * @returns {boolean}
     */
    command140(params: RMMZ.CommandParams<140>): boolean;
    /**
     * @param {RMMZ.CommandParams<201>} params
     * @returns {boolean}
     */
    command201(params: RMMZ.CommandParams<201>): boolean;
    /**
     * @param {RMMZ.CommandParams<202>} params
     * @returns {boolean}
     */
    command202(params: RMMZ.CommandParams<202>): boolean;
    /**
     * @param {RMMZ.CommandParams<203>} params
     * @returns {boolean}
     */
    command203(params: RMMZ.CommandParams<203>): boolean;
    /**
     * @param {RMMZ.CommandParams<204>} params
     * @returns {boolean}
     */
    command204(params: RMMZ.CommandParams<204>): boolean;
    /**
     * @param {RMMZ.CommandParams<205>} params
     * @returns {boolean}
     */
    command205(params: RMMZ.CommandParams<205>): boolean;
    /** @returns {boolean} */
    command206(): boolean;
    /**
     * @param {RMMZ.CommandParams<211>} params
     * @returns {boolean}
     */
    command211(params: RMMZ.CommandParams<211>): boolean;
    /**
     * @param {RMMZ.CommandParams<212>} params
     * @returns {boolean}
     */
    command212(params: RMMZ.CommandParams<212>): boolean;
    /**
     * @param {RMMZ.CommandParams<213>} params
     * @returns {boolean}
     */
    command213(params: RMMZ.CommandParams<213>): boolean;
    /** @returns {boolean} */
    command214(): boolean;
    /**
     * @param {RMMZ.CommandParams<216>} params
     * @returns {boolean}
     */
    command216(params: RMMZ.CommandParams<216>): boolean;
    /** @returns {boolean} */
    command217(): boolean;
    /** @returns {boolean} */
    command221(): boolean;
    /** @returns {boolean} */
    command222(): boolean;
    /**
     * @param {RMMZ.CommandParams<223>} params
     * @returns {boolean}
     */
    command223(params: RMMZ.CommandParams<223>): boolean;
    /**
     * @param {RMMZ.CommandParams<224>} params
     * @returns {boolean}
     */
    command224(params: RMMZ.CommandParams<224>): boolean;
    /**
     * @param {RMMZ.CommandParams<225>} params
     * @returns {boolean}
     */
    command225(params: RMMZ.CommandParams<225>): boolean;
    /**
     * @param {RMMZ.CommandParams<230>} params
     * @returns {boolean}
     */
    command230(params: RMMZ.CommandParams<230>): boolean;
    /**
     * @param {RMMZ.CommandParams<231>} params
     * @returns {boolean}
     */
    command231(params: RMMZ.CommandParams<231>): boolean;
    /**
     * @param {RMMZ.CommandParams<232>} params
     * @returns {boolean}
     */
    command232(params: RMMZ.CommandParams<232>): boolean;
    /**
     * @param {RMMZ.CommandParams<231 | 232>} params
     * @returns {Point}
     */
    picturePoint(params: RMMZ.CommandParams<231 | 232>): Point;
    /**
     * @param {RMMZ.CommandParams<233>} params
     * @returns {boolean}
     */
    command233(params: RMMZ.CommandParams<233>): boolean;
    /**
     * @param {RMMZ.CommandParams<234>} params
     * @returns {boolean}
     */
    command234(params: RMMZ.CommandParams<234>): boolean;
    /**
     * @param {RMMZ.CommandParams<235>} params
     * @returns {boolean}
     */
    command235(params: RMMZ.CommandParams<235>): boolean;
    /**
     * @param {RMMZ.CommandParams<236>} params
     * @returns {boolean}
     */
    command236(params: RMMZ.CommandParams<236>): boolean;
    /**
     * @param {RMMZ.CommandParams<241>} params
     * @returns {boolean}
     */
    command241(params: RMMZ.CommandParams<241>): boolean;
    /**
     * @param {RMMZ.CommandParams<242>} params
     * @returns {boolean}
     */
    command242(params: RMMZ.CommandParams<242>): boolean;
    /** @returns {boolean} */
    command243(): boolean;
    /** @returns {boolean} */
    command244(): boolean;
    /**
     * @param {RMMZ.CommandParams<245>} params
     * @returns {boolean}
     */
    command245(params: RMMZ.CommandParams<245>): boolean;
    /**
     * @param {RMMZ.CommandParams<246>} params
     * @returns {boolean}
     */
    command246(params: RMMZ.CommandParams<246>): boolean;
    /**
     * @param {RMMZ.CommandParams<249>} params
     * @returns {boolean}
     */
    command249(params: RMMZ.CommandParams<249>): boolean;
    /**
     * @param {RMMZ.CommandParams<250>} params
     * @returns {boolean}
     */
    command250(params: RMMZ.CommandParams<250>): boolean;
    /** @returns {boolean} */
    command251(): boolean;
    /**
     * @param {RMMZ.CommandParams<261>} params
     * @returns {boolean}
     */
    command261(params: RMMZ.CommandParams<261>): boolean;
    /** @returns {".webm" | ".mp4"} */
    videoFileExt(): ".webm" | ".mp4";
    /**
     * @param {RMMZ.CommandParams<281>} params
     * @returns {boolean}
     */
    command281(params: RMMZ.CommandParams<281>): boolean;
    /**
     * @param {RMMZ.CommandParams<282>} params
     * @returns {boolean}
     */
    command282(params: RMMZ.CommandParams<282>): boolean;
    /**
     * @param {RMMZ.CommandParams<283>} params
     * @returns {boolean}
     */
    command283(params: RMMZ.CommandParams<283>): boolean;
    /**
     * @param {RMMZ.CommandParams<284>} params
     * @returns {boolean}
     */
    command284(params: RMMZ.CommandParams<284>): boolean;
    /**
     * @param {RMMZ.CommandParams<285>} params
     * @returns {boolean}
     */
    command285(params: RMMZ.CommandParams<285>): boolean;
    /**
     * @param {RMMZ.CommandParams<301>} params
     * @returns {boolean}
     */
    command301(params: RMMZ.CommandParams<301>): boolean;
    /** @returns {boolean} */
    command601(): boolean;
    /** @returns {boolean} */
    command602(): boolean;
    /** @returns {boolean} */
    command603(): boolean;
    /**
     * @param {RMMZ.CommandParams<302>} params
     * @returns {boolean}
     */
    command302(params: RMMZ.CommandParams<302>): boolean;
    /**
     * @param {RMMZ.CommandParams<303>} params
     * @returns {boolean}
     */
    command303(params: RMMZ.CommandParams<303>): boolean;
    /**
     * @param {RMMZ.CommandParams<311>} params
     * @returns {boolean}
     */
    command311(params: RMMZ.CommandParams<311>): boolean;
    /**
     * @param {RMMZ.CommandParams<312>} params
     * @returns {boolean}
     */
    command312(params: RMMZ.CommandParams<312>): boolean;
    /**
     * @param {RMMZ.CommandParams<326>} params
     * @returns {boolean}
     */
    command326(params: RMMZ.CommandParams<326>): boolean;
    /**
     * @param {RMMZ.CommandParams<313>} params
     * @returns {boolean}
     */
    command313(params: RMMZ.CommandParams<313>): boolean;
    /**
     * @param {RMMZ.CommandParams<314>} params
     * @returns {boolean}
     */
    command314(params: RMMZ.CommandParams<314>): boolean;
    /**
     * @param {RMMZ.CommandParams<315>} params
     * @returns {boolean}
     */
    command315(params: RMMZ.CommandParams<315>): boolean;
    /**
     * @param {RMMZ.CommandParams<316>} params
     * @returns {boolean}
     */
    command316(params: RMMZ.CommandParams<316>): boolean;
    /**
     * @param {RMMZ.CommandParams<317>} params
     * @returns {boolean}
     */
    command317(params: RMMZ.CommandParams<317>): boolean;
    /**
     * @param {RMMZ.CommandParams<318>} params
     * @returns {boolean}
     */
    command318(params: RMMZ.CommandParams<318>): boolean;
    /**
     * @param {RMMZ.CommandParams<319>} params
     * @returns {boolean}
     */
    command319(params: RMMZ.CommandParams<319>): boolean;
    /**
     * @param {RMMZ.CommandParams<320>} params
     * @returns {boolean}
     */
    command320(params: RMMZ.CommandParams<320>): boolean;
    /**
     * @param {RMMZ.CommandParams<321>} params
     * @returns {boolean}
     */
    command321(params: RMMZ.CommandParams<321>): boolean;
    /**
     * @param {RMMZ.CommandParams<322>} params
     * @returns {boolean}
     */
    command322(params: RMMZ.CommandParams<322>): boolean;
    /**
     * @param {RMMZ.CommandParams<323>} params
     * @returns {boolean}
     */
    command323(params: RMMZ.CommandParams<323>): boolean;
    /**
     * @param {RMMZ.CommandParams<324>} params
     * @returns {boolean}
     */
    command324(params: RMMZ.CommandParams<324>): boolean;
    /**
     * @param {RMMZ.CommandParams<325>} params
     * @returns {boolean}
     */
    command325(params: RMMZ.CommandParams<325>): boolean;
    /**
     * @param {RMMZ.CommandParams<331>} params
     * @returns {boolean}
     */
    command331(params: RMMZ.CommandParams<331>): boolean;
    /**
     * @param {RMMZ.CommandParams<332>} params
     * @returns {boolean}
     */
    command332(params: RMMZ.CommandParams<332>): boolean;
    /**
     * @param {RMMZ.CommandParams<342>} params
     * @returns {boolean}
     */
    command342(params: RMMZ.CommandParams<342>): boolean;
    /**
     * @param {RMMZ.CommandParams<333>} params
     * @returns {boolean}
     */
    command333(params: RMMZ.CommandParams<333>): boolean;
    /**
     * @param {RMMZ.CommandParams<334>} params
     * @returns {boolean}
     */
    command334(params: RMMZ.CommandParams<334>): boolean;
    /**
     * @param {RMMZ.CommandParams<335>} params
     * @returns {boolean}
     */
    command335(params: RMMZ.CommandParams<335>): boolean;
    /**
     * @param {RMMZ.CommandParams<336>} params
     * @returns {boolean}
     */
    command336(params: RMMZ.CommandParams<336>): boolean;
    /**
     * @param {RMMZ.CommandParams<337>} params
     * @returns {boolean}
     */
    command337(params: RMMZ.CommandParams<337>): boolean;
    /**
     * @param {RMMZ.CommandParams<339>} params
     * @returns {boolean}
     */
    command339(params: RMMZ.CommandParams<339>): boolean;
    /** @returns {boolean} */
    command340(): boolean;
    /** @returns {boolean} */
    command351(): boolean;
    /** @returns {boolean} */
    command352(): boolean;
    /** @returns {boolean} */
    command353(): boolean;
    /** @returns {boolean} */
    command354(): boolean;
    /** @returns {boolean} */
    command355(): boolean;
    /**
     * @param {RMMZ.CommandParams<356>} params
     * @returns {boolean}
     */
    command356(params: RMMZ.CommandParams<356>): boolean;
    pluginCommand(): void;
    /**
     * @param {RMMZ.CommandParams<357>} params
     * @returns {boolean}
     */
    command357(params: RMMZ.CommandParams<357>): boolean;
}
