// rmmz_objects.js v2.0.0

/**
 * The game object class for temporary data that is not included in save data.
 */
class Game_Temp {
    declare _isPlaytest: boolean;
    declare _destinationX: number | null;
    declare _destinationY: number | null;
    declare _touchTarget: Game_Battler | null;
    declare _touchState: "" | "select" | "click";
    declare _needsBattleRefresh: boolean;
    declare _commonEventQueue: RMMZ.CommonEventID[];
    declare _animationQueue: RMMZ.AnimationRequest[];
    declare _balloonQueue: RMMZ.BalloonRequest[];
    declare _lastActionData: [RMMZ.SkillID, RMMZ.ItemID, RMMZ.ActorID, RMMZ.EnemyID, RMMZ.ActorID, RMMZ.EnemyID];

    constructor(...args: any[]) {
        this.initialize(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        this._isPlaytest = Utils.isOptionValid("test");
        this._destinationX = null;
        this._destinationY = null;
        this._touchTarget = null;
        this._touchState = "";
        this._needsBattleRefresh = false;
        this._commonEventQueue = [];
        this._animationQueue = [];
        this._balloonQueue = [];
        this._lastActionData = [0, 0, 0, 0, 0, 0];
    }

    isPlaytest(): boolean {
        return this._isPlaytest;
    }

    setDestination(x: number, y: number): void {
        this._destinationX = x;
        this._destinationY = y;
    }

    clearDestination(): void {
        this._destinationX = null;
        this._destinationY = null;
    }

    isDestinationValid(): boolean {
        return this._destinationX !== null;
    }

    destinationX(): number | null {
        return this._destinationX;
    }

    destinationY(): number | null {
        return this._destinationY;
    }

    setTouchState(target: Game_Battler, state: "select" | "click"): void {
        this._touchTarget = target;
        this._touchState = state;
    }

    clearTouchState(): void {
        this._touchTarget = null;
        this._touchState = "";
    }

    touchTarget(): Game_Battler | null {
        return this._touchTarget;
    }

    touchState(): string {
        return this._touchState;
    }

    requestBattleRefresh(): void {
        if ($gameParty.inBattle()) {
            this._needsBattleRefresh = true;
        }
    }

    clearBattleRefreshRequest(): void {
        this._needsBattleRefresh = false;
    }

    isBattleRefreshRequested(): boolean {
        return this._needsBattleRefresh;
    }

    reserveCommonEvent(commonEventId: RMMZ.CommonEventID): void {
        this._commonEventQueue.push(commonEventId);
    }

    retrieveCommonEvent(): RMMZ.DataCommonEvent {
        return $dataCommonEvents[this._commonEventQueue.shift()!]!;
    }

    clearCommonEventReservation(): void {
        this._commonEventQueue.length = 0;
    }

    isCommonEventReserved(): boolean {
        return this._commonEventQueue.length > 0;
    }

    // prettier-ignore

    requestAnimation(
        targets: RMMZ.AnimationTarget[], animationId: RMMZ.AnimationID, mirror: boolean = false
    ): void {
        if ($dataAnimations[animationId]) {
            const request = {
                targets: targets,
                animationId: animationId,
                mirror: mirror
            };
            this._animationQueue.push(request);
            for (const target of targets) {
                if (target.startAnimation) {
                    target.startAnimation();
                }
            }
        }
    }

    retrieveAnimation(): RMMZ.AnimationRequest | undefined {
        return this._animationQueue.shift();
    }

    requestBalloon(target: Game_Character, balloonId: RMMZ.BalloonIconID): void {
        const request = { target: target, balloonId: balloonId };
        this._balloonQueue.push(request);
        if (target.startBalloon) {
            target.startBalloon();
        }
    }

    retrieveBalloon(): RMMZ.BalloonRequest | undefined {
        return this._balloonQueue.shift();
    }

    lastActionData(type: RMMZ.ActionDataType): number {
        return this._lastActionData[type] || 0;
    }

    setLastActionData(type: RMMZ.ActionDataType, value: number): void {
        this._lastActionData[type] = value;
    }

    setLastUsedSkillId(skillID: RMMZ.SkillID): void {
        this.setLastActionData(0, skillID);
    }

    setLastUsedItemId(itemID: RMMZ.ItemID): void {
        this.setLastActionData(1, itemID);
    }

    setLastSubjectActorId(actorID: RMMZ.ActorID): void {
        this.setLastActionData(2, actorID);
    }

    setLastSubjectEnemyIndex(enemyIndex: RMMZ.EnemyID): void {
        this.setLastActionData(3, enemyIndex);
    }

    setLastTargetActorId(actorID: RMMZ.ActorID): void {
        this.setLastActionData(4, actorID);
    }

    setLastTargetEnemyIndex(enemyIndex: RMMZ.EnemyID): void {
        this.setLastActionData(5, enemyIndex);
    }
}

/**
 * The game object class for the system data.
 */
class Game_System {
    declare _saveEnabled: boolean;
    declare _menuEnabled: boolean;
    declare _encounterEnabled: boolean;
    declare _formationEnabled: boolean;
    declare _battleCount: number;
    declare _winCount: number;
    declare _escapeCount: number;
    declare _saveCount: number;
    declare _versionId: number;
    declare _savefileId: number;
    declare _framesOnSave: number;
    declare _bgmOnSave: RMMZ.DataAudio | null;
    declare _bgsOnSave: RMMZ.DataAudio | null;
    declare _windowTone: RMMZ.Color | null;
    declare _battleBgm: RMMZ.DataAudio | null;
    declare _victoryMe: RMMZ.DataAudio | null;
    declare _defeatMe: RMMZ.DataAudio | null;
    declare _savedBgm: RMMZ.DataAudio | null;
    declare _walkingBgm: RMMZ.DataAudio | null;

    constructor(...args: any[]) {
        this.initialize(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        this._saveEnabled = true;
        this._menuEnabled = true;
        this._encounterEnabled = true;
        this._formationEnabled = true;
        this._battleCount = 0;
        this._winCount = 0;
        this._escapeCount = 0;
        this._saveCount = 0;
        this._versionId = 0;
        this._savefileId = 0;
        this._framesOnSave = 0;
        this._bgmOnSave = null;
        this._bgsOnSave = null;
        this._windowTone = null;
        this._battleBgm = null;
        this._victoryMe = null;
        this._defeatMe = null;
        this._savedBgm = null;
        this._walkingBgm = null;
    }

    isJapanese(): RegExpMatchArray | null {
        return $dataSystem.locale.match(/^ja/);
    }

    isChinese(): RegExpMatchArray | null {
        return $dataSystem.locale.match(/^zh/);
    }

    isKorean(): RegExpMatchArray | null {
        return $dataSystem.locale.match(/^ko/);
    }

    isCJK(): RegExpMatchArray | null {
        return $dataSystem.locale.match(/^(ja|zh|ko)/);
    }

    isRussian(): RegExpMatchArray | null {
        return $dataSystem.locale.match(/^ru/);
    }

    isSideView(): boolean {
        return $dataSystem.optSideView;
    }

    isAutosaveEnabled(): boolean {
        return $dataSystem.optAutosave;
    }

    isMessageSkipEnabled(): boolean {
        return $dataSystem.optMessageSkip;
    }

    isSaveEnabled(): boolean {
        return this._saveEnabled;
    }

    disableSave(): void {
        this._saveEnabled = false;
    }

    enableSave(): void {
        this._saveEnabled = true;
    }

    isMenuEnabled(): boolean {
        return this._menuEnabled;
    }

    disableMenu(): void {
        this._menuEnabled = false;
    }

    enableMenu(): void {
        this._menuEnabled = true;
    }

    isEncounterEnabled(): boolean {
        return this._encounterEnabled;
    }

    disableEncounter(): void {
        this._encounterEnabled = false;
    }

    enableEncounter(): void {
        this._encounterEnabled = true;
    }

    isFormationEnabled(): boolean {
        return this._formationEnabled;
    }

    disableFormation(): void {
        this._formationEnabled = false;
    }

    enableFormation(): void {
        this._formationEnabled = true;
    }

    battleCount(): number {
        return this._battleCount;
    }

    winCount(): number {
        return this._winCount;
    }

    escapeCount(): number {
        return this._escapeCount;
    }

    saveCount(): number {
        return this._saveCount;
    }

    versionId(): number {
        return this._versionId;
    }

    savefileId(): number {
        return this._savefileId || 0;
    }

    setSavefileId(savefileId: number): void {
        this._savefileId = savefileId;
    }

    windowTone(): RMMZ.Color {
        return this._windowTone || $dataSystem.windowTone;
    }

    setWindowTone(value: RMMZ.Color): void {
        this._windowTone = value;
    }

    battleBgm(): RMMZ.DataAudio {
        return this._battleBgm || $dataSystem.battleBgm;
    }

    setBattleBgm(value: RMMZ.DataAudio): void {
        this._battleBgm = value;
    }

    victoryMe(): RMMZ.DataAudio {
        return this._victoryMe || $dataSystem.victoryMe;
    }

    setVictoryMe(value: RMMZ.DataAudio): void {
        this._victoryMe = value;
    }

    defeatMe(): RMMZ.DataAudio {
        return this._defeatMe || $dataSystem.defeatMe;
    }

    setDefeatMe(value: RMMZ.DataAudio): void {
        this._defeatMe = value;
    }

    onBattleStart(): void {
        this._battleCount++;
    }

    onBattleWin(): void {
        this._winCount++;
    }

    onBattleEscape(): void {
        this._escapeCount++;
    }

    onBeforeSave(): void {
        this._saveCount++;
        this._versionId = $dataSystem.versionId;
        this._framesOnSave = Graphics.frameCount;
        this._bgmOnSave = AudioManager.saveBgm();
        this._bgsOnSave = AudioManager.saveBgs();
    }

    onAfterLoad(): void {
        Graphics.frameCount = this._framesOnSave;
        AudioManager.playBgm(this._bgmOnSave!);
        AudioManager.playBgs(this._bgsOnSave!);
    }

    playtime(): number {
        return Math.floor(Graphics.frameCount / 60);
    }

    playtimeText(): string {
        const hour = Math.floor(this.playtime() / 60 / 60);
        const min = Math.floor(this.playtime() / 60) % 60;
        const sec = this.playtime() % 60;
        return hour.padZero(2) + ":" + min.padZero(2) + ":" + sec.padZero(2);
    }

    saveBgm(): void {
        this._savedBgm = AudioManager.saveBgm();
    }

    replayBgm(): void {
        if (this._savedBgm) {
            AudioManager.replayBgm(this._savedBgm);
        }
    }

    saveWalkingBgm(): void {
        this._walkingBgm = AudioManager.saveBgm();
    }

    replayWalkingBgm(): void {
        if (this._walkingBgm) {
            AudioManager.playBgm(this._walkingBgm);
        }
    }

    saveWalkingBgm2(): void {
        this._walkingBgm = $dataMap.bgm;
    }

    mainFontFace(): string {
        return "rmmz-mainfont, " + $dataSystem.advanced.fallbackFonts;
    }

    numberFontFace(): string {
        return "rmmz-numberfont, " + this.mainFontFace();
    }

    mainFontSize(): number {
        return $dataSystem.advanced.fontSize;
    }

    windowPadding(): number {
        return 12;
    }

    windowOpacity(): number {
        return $dataSystem.advanced.windowOpacity;
    }
}

/**
 * The game object class for the timer.
 */
class Game_Timer {
    declare _frames: number;
    declare _working: boolean;

    constructor(...args: any[]) {
        this.initialize(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        this._frames = 0;
        this._working = false;
    }

    update(sceneActive: boolean): void {
        if (sceneActive && this._working && this._frames > 0) {
            this._frames--;
            if (this._frames === 0) {
                this.onExpire();
            }
        }
    }

    start(count: number): void {
        this._frames = count;
        this._working = true;
    }

    stop(): void {
        this._working = false;
    }

    isWorking(): boolean {
        return this._working;
    }

    seconds(): number {
        return Math.floor(this._frames / 60);
    }

    frames(): number {
        return this._frames;
    }

    onExpire(): void {
        BattleManager.abort();
    }
}

/**
 * The game object class for the state of the message window that displays text
 * or selections, etc.
 */
class Game_Message {
    declare _texts: any[];
    declare _choices: any[] | string[];
    declare _speakerName: string;
    declare _faceName: string;
    declare _faceIndex: number;
    declare _background: number;
    declare _positionType: number;
    declare _choiceDefaultType: number;
    declare _choiceCancelType: number;
    declare _choiceBackground: number;
    declare _choicePositionType: number;
    declare _numInputVariableId: number;
    declare _numInputMaxDigits: number;
    declare _itemChoiceVariableId: number;
    declare _itemChoiceItypeId: number;
    declare _scrollMode: boolean;
    declare _scrollSpeed: number;
    declare _scrollNoFast: boolean;
    declare _choiceCallback: ((chosen: number) => void) | null;

    constructor(...args: any[]) {
        this.initialize(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        this.clear();
    }

    clear(): void {
        this._texts = [];
        this._choices = [];
        this._speakerName = "";
        this._faceName = "";
        this._faceIndex = 0;
        this._background = 0;
        this._positionType = 2;
        this._choiceDefaultType = 0;
        this._choiceCancelType = 0;
        this._choiceBackground = 0;
        this._choicePositionType = 2;
        this._numInputVariableId = 0;
        this._numInputMaxDigits = 0;
        this._itemChoiceVariableId = 0;
        this._itemChoiceItypeId = 0;
        this._scrollMode = false;
        this._scrollSpeed = 2;
        this._scrollNoFast = false;
        this._choiceCallback = null;
    }

    choices(): string[] {
        return this._choices;
    }

    speakerName(): string {
        return this._speakerName;
    }

    faceName(): string {
        return this._faceName;
    }

    faceIndex(): number {
        return this._faceIndex;
    }

    background(): RMMZ.TextWindowBackgroundType {
        return this._background as RMMZ.TextWindowBackgroundType;
    }

    positionType(): RMMZ.TextWindowPositionType {
        return this._positionType as RMMZ.TextWindowPositionType;
    }

    choiceDefaultType(): number {
        return this._choiceDefaultType;
    }

    choiceCancelType(): number {
        return this._choiceCancelType;
    }

    choiceBackground(): RMMZ.TextWindowBackgroundType {
        return this._choiceBackground as RMMZ.TextWindowBackgroundType;
    }

    choicePositionType(): RMMZ.TextWindowPositionType {
        return this._choicePositionType as RMMZ.TextWindowPositionType;
    }

    numInputVariableId(): number {
        return this._numInputVariableId;
    }

    numInputMaxDigits(): number {
        return this._numInputMaxDigits;
    }

    itemChoiceVariableId(): number {
        return this._itemChoiceVariableId;
    }

    itemChoiceItypeId(): number {
        return this._itemChoiceItypeId;
    }

    scrollMode(): boolean {
        return this._scrollMode;
    }

    scrollSpeed(): number {
        return this._scrollSpeed;
    }

    scrollNoFast(): boolean {
        return this._scrollNoFast;
    }

    add(text: string): void {
        this._texts.push(text);
    }

    setSpeakerName(speakerName: string): void {
        this._speakerName = speakerName ? speakerName : "";
    }

    setFaceImage(faceName: string, faceIndex: number): void {
        this._faceName = faceName;
        this._faceIndex = faceIndex;
    }

    setBackground(background: RMMZ.TextWindowBackgroundType): void {
        this._background = background;
    }

    setPositionType(positionType: RMMZ.TextWindowPositionType): void {
        this._positionType = positionType;
    }

    setChoices(choices: string[], defaultType: number, cancelType: number): void {
        this._choices = choices;
        this._choiceDefaultType = defaultType;
        this._choiceCancelType = cancelType;
    }

    setChoiceBackground(background: RMMZ.TextWindowBackgroundType): void {
        this._choiceBackground = background;
    }

    setChoicePositionType(positionType: RMMZ.TextWindowPositionType): void {
        this._choicePositionType = positionType;
    }

    setNumberInput(variableId: number, maxDigits: number): void {
        this._numInputVariableId = variableId;
        this._numInputMaxDigits = maxDigits;
    }

    setItemChoice(variableId: number, itemType: RMMZ.ItemType): void {
        this._itemChoiceVariableId = variableId;
        this._itemChoiceItypeId = itemType;
    }

    setScroll(speed: number, noFast: boolean): void {
        this._scrollMode = true;
        this._scrollSpeed = speed;
        this._scrollNoFast = noFast;
    }

    setChoiceCallback(callback: (chosen: number) => void): void {
        this._choiceCallback = callback;
    }

    onChoice(n: number): void {
        if (this._choiceCallback) {
            this._choiceCallback(n);
            this._choiceCallback = null;
        }
    }

    hasText(): boolean {
        return this._texts.length > 0;
    }

    isChoice(): boolean {
        return this._choices.length > 0;
    }

    isNumberInput(): boolean {
        return this._numInputVariableId > 0;
    }

    isItemChoice(): boolean {
        return this._itemChoiceVariableId > 0;
    }

    isBusy(): boolean {
        return this.hasText() || this.isChoice() || this.isNumberInput() || this.isItemChoice();
    }

    newPage(): void {
        if (this._texts.length > 0) {
            this._texts[this._texts.length - 1] += "\f";
        }
    }

    allText(): string {
        return this._texts.join("\n");
    }

    isRTL(): boolean {
        return Utils.containsArabic(this.allText());
    }
}

/**
 * The game object class for switches.
 */
class Game_Switches {
    declare _data: any[];

    constructor(...args: any[]) {
        this.initialize(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        this.clear();
    }

    clear(): void {
        this._data = [];
    }

    value(switchId?: RMMZ.SwitchID): boolean {
        return !!this._data[switchId!];
    }

    setValue(switchId: number, value: boolean): void {
        if (switchId > 0 && switchId < $dataSystem.switches.length) {
            this._data[switchId] = value;
            this.onChange();
        }
    }

    onChange(): void {
        $gameMap.requestRefresh();
    }
}

/**
 * The game object class for variables.
 */
class Game_Variables {
    declare _data: any[];

    constructor(...args: any[]) {
        this.initialize(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        this.clear();
    }

    clear(): void {
        this._data = [];
    }

    value(variableId?: RMMZ.VariableID): number {
        return this._data[variableId!] || 0;
    }

    setValue(variableId: RMMZ.VariableID, value: number): void {
        if (variableId > 0 && variableId < $dataSystem.variables.length) {
            if (typeof value === "number") {
                value = Math.floor(value);
            }
            this._data[variableId] = value;
            this.onChange();
        }
    }

    onChange(): void {
        $gameMap.requestRefresh();
    }
}

/**
 * The game object class for self switches.
 */
class Game_SelfSwitches {
    declare _data: Record<string, boolean>;

    constructor(...args: any[]) {
        this.initialize(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        this.clear();
    }

    clear(): void {
        this._data = {};
    }

    value(key: RMMZ.SelfSwitchID): boolean {
        return !!this._data[String(key)];
    }

    setValue(key: RMMZ.SelfSwitchID, value: boolean): void {
        if (value) {
            this._data[String(key)] = true;
        } else {
            delete this._data[String(key)];
        }
        this.onChange();
    }

    onChange(): void {
        $gameMap.requestRefresh();
    }
}

/**
 * The game object class for screen effect data, such as changes in color tone
 * and flashes.
 */
class Game_Screen {
    declare _brightness: any;
    declare _fadeOutDuration: number;
    declare _fadeInDuration: number;
    declare _tone: number[];
    declare _toneTarget: number[];
    declare _toneDuration: number;
    declare _flashColor: number[];
    declare _flashDuration: number;
    declare _shakePower: number;
    declare _shakeSpeed: number;
    declare _shakeDuration: number;
    declare _shakeDirection: number;
    declare _shake: number;
    declare _zoomX: number;
    declare _zoomY: number;
    declare _zoomScale: any;
    declare _zoomScaleTarget: number;
    declare _zoomDuration: number;
    declare _weatherType: string;
    declare _weatherPower: any;
    declare _weatherPowerTarget: number;
    declare _weatherDuration: number;
    declare _pictures: any;

    constructor(...args: any[]) {
        this.initialize(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        this.clear();
    }

    clear(): void {
        this.clearFade();
        this.clearTone();
        this.clearFlash();
        this.clearShake();
        this.clearZoom();
        this.clearWeather();
        this.clearPictures();
    }

    onBattleStart(): void {
        this.clearFade();
        this.clearFlash();
        this.clearShake();
        this.clearZoom();
        this.eraseBattlePictures();
    }

    brightness(): number {
        return this._brightness;
    }

    tone(): [number, number, number, number] {
        return this._tone as [number, number, number, number];
    }

    flashColor(): [number, number, number, number] {
        return this._flashColor as [number, number, number, number];
    }

    shake(): number {
        return this._shake;
    }

    zoomX(): number {
        return this._zoomX;
    }

    zoomY(): number {
        return this._zoomY;
    }

    zoomScale(): number {
        return this._zoomScale;
    }

    weatherType(): RMMZ.WeatherType {
        return this._weatherType as RMMZ.WeatherType;
    }

    weatherPower(): number {
        return this._weatherPower;
    }

    picture(pictureId: RMMZ.PictureID): Game_Picture | null {
        const realPictureId = this.realPictureId(pictureId);
        return this._pictures[realPictureId];
    }

    realPictureId(pictureId: RMMZ.PictureID): number {
        if ($gameParty.inBattle()) {
            return pictureId + this.maxPictures();
        } else {
            return pictureId;
        }
    }

    clearFade(): void {
        this._brightness = 255;
        this._fadeOutDuration = 0;
        this._fadeInDuration = 0;
    }

    clearTone(): void {
        this._tone = [0, 0, 0, 0];
        this._toneTarget = [0, 0, 0, 0];
        this._toneDuration = 0;
    }

    clearFlash(): void {
        this._flashColor = [0, 0, 0, 0];
        this._flashDuration = 0;
    }

    clearShake(): void {
        this._shakePower = 0;
        this._shakeSpeed = 0;
        this._shakeDuration = 0;
        this._shakeDirection = 1;
        this._shake = 0;
    }

    clearZoom(): void {
        this._zoomX = 0;
        this._zoomY = 0;
        this._zoomScale = 1;
        this._zoomScaleTarget = 1;
        this._zoomDuration = 0;
    }

    clearWeather(): void {
        this._weatherType = "none";
        this._weatherPower = 0;
        this._weatherPowerTarget = 0;
        this._weatherDuration = 0;
    }

    clearPictures(): void {
        this._pictures = [];
    }

    eraseBattlePictures(): void {
        this._pictures = this._pictures.slice(0, this.maxPictures() + 1);
    }

    maxPictures(): number {
        if ("picturesUpperLimit" in $dataSystem.advanced) {
            return $dataSystem.advanced.picturesUpperLimit!;
        } else {
            return 100;
        }
    }

    startFadeOut(duration: number): void {
        this._fadeOutDuration = duration;
        this._fadeInDuration = 0;
    }

    startFadeIn(duration: number): void {
        this._fadeInDuration = duration;
        this._fadeOutDuration = 0;
    }

    startTint(tone: RMMZ.Color, duration: number): void {
        this._toneTarget = tone.clone();
        this._toneDuration = duration;
        if (this._toneDuration === 0) {
            this._tone = this._toneTarget.clone();
        }
    }

    startFlash(color: RMMZ.Color, duration: number): void {
        this._flashColor = color.clone();
        this._flashDuration = duration;
    }

    startShake(power: number, speed: number, duration: number): void {
        this._shakePower = power;
        this._shakeSpeed = speed;
        this._shakeDuration = duration;
    }

    startZoom(x: number, y: number, scale: number, duration: number): void {
        this._zoomX = x;
        this._zoomY = y;
        this._zoomScaleTarget = scale;
        this._zoomDuration = duration;
    }

    setZoom(x: number, y: number, scale: number): void {
        this._zoomX = x;
        this._zoomY = y;
        this._zoomScale = scale;
    }

    changeWeather(type: RMMZ.WeatherType, power: number, duration: number): void {
        if (type !== "none" || duration === 0) {
            this._weatherType = type;
        }
        this._weatherPowerTarget = type === "none" ? 0 : power;
        this._weatherDuration = duration;
        if (duration === 0) {
            this._weatherPower = this._weatherPowerTarget;
        }
    }

    update(): void {
        this.updateFadeOut();
        this.updateFadeIn();
        this.updateTone();
        this.updateFlash();
        this.updateShake();
        this.updateZoom();
        this.updateWeather();
        this.updatePictures();
    }

    updateFadeOut(): void {
        if (this._fadeOutDuration > 0) {
            const d = this._fadeOutDuration;
            this._brightness = (this._brightness * (d - 1)) / d;
            this._fadeOutDuration--;
        }
    }

    updateFadeIn(): void {
        if (this._fadeInDuration > 0) {
            const d = this._fadeInDuration;
            this._brightness = (this._brightness * (d - 1) + 255) / d;
            this._fadeInDuration--;
        }
    }

    updateTone(): void {
        if (this._toneDuration > 0) {
            const d = this._toneDuration;
            for (let i = 0; i < 4; i++) {
                this._tone[i] = (this._tone[i] * (d - 1) + this._toneTarget[i]) / d;
            }
            this._toneDuration--;
        }
    }

    updateFlash(): void {
        if (this._flashDuration > 0) {
            const d = this._flashDuration;
            this._flashColor[3] *= (d - 1) / d;
            this._flashDuration--;
        }
    }

    updateShake(): void {
        if (this._shakeDuration > 0 || this._shake !== 0) {
            const delta = (this._shakePower * this._shakeSpeed * this._shakeDirection) / 10;
            if (this._shakeDuration <= 1 && this._shake * (this._shake + delta) < 0) {
                this._shake = 0;
            } else {
                this._shake += delta;
            }
            if (this._shake > this._shakePower * 2) {
                this._shakeDirection = -1;
            }
            if (this._shake < -this._shakePower * 2) {
                this._shakeDirection = 1;
            }
            this._shakeDuration--;
        }
    }

    updateZoom(): void {
        if (this._zoomDuration > 0) {
            const d = this._zoomDuration;
            const t = this._zoomScaleTarget;
            this._zoomScale = (this._zoomScale * (d - 1) + t) / d;
            this._zoomDuration--;
        }
    }

    updateWeather(): void {
        if (this._weatherDuration > 0) {
            const d = this._weatherDuration;
            const t = this._weatherPowerTarget;
            this._weatherPower = (this._weatherPower * (d - 1) + t) / d;
            this._weatherDuration--;
            if (this._weatherDuration === 0 && this._weatherPowerTarget === 0) {
                this._weatherType = "none";
            }
        }
    }

    updatePictures(): void {
        for (const picture of this._pictures) {
            if (picture) {
                picture.update();
            }
        }
    }

    startFlashForDamage(): void {
        this.startFlash([255, 0, 0, 128], 8);
    }

    // prettier-ignore

    showPicture(
        pictureId: RMMZ.PictureID, name: string, origin: number, x: number, y: number, scaleX: number, scaleY: number, opacity: number, blendMode: RMMZ.BlendMode
    ): void {
        const realPictureId = this.realPictureId(pictureId);
        const picture = new Game_Picture();
        picture.show(name, origin, x, y, scaleX, scaleY, opacity, blendMode);
        this._pictures[realPictureId] = picture;
    }

    // prettier-ignore

    movePicture(
        pictureId: RMMZ.PictureID, origin: number, x: number, y: number, scaleX: number, scaleY: number, opacity: number, blendMode: RMMZ.BlendMode, duration: number,
        easingType: RMMZ.PictureEasingType
    ): void {
        const picture = this.picture(pictureId);
        if (picture) {
            // prettier-ignore
            picture.move(origin, x, y, scaleX, scaleY, opacity, blendMode,
                         duration, easingType);
        }
    }

    rotatePicture(pictureId: RMMZ.PictureID, speed: number): void {
        const picture = this.picture(pictureId);
        if (picture) {
            picture.rotate(speed);
        }
    }

    tintPicture(pictureId: RMMZ.PictureID, tone: RMMZ.Color, duration: number): void {
        const picture = this.picture(pictureId);
        if (picture) {
            picture.tint(tone, duration);
        }
    }

    erasePicture(pictureId: RMMZ.PictureID): void {
        const realPictureId = this.realPictureId(pictureId);
        this._pictures[realPictureId] = null;
    }
}

/**
 * The game object class for a picture.
 */
class Game_Picture {
    declare _name: string;
    declare _origin: number;
    declare _x: any;
    declare _y: any;
    declare _scaleX: any;
    declare _scaleY: any;
    declare _opacity: any;
    declare _blendMode: number | RMMZ.BlendMode;
    declare _targetX: any;
    declare _targetY: any;
    declare _targetScaleX: any;
    declare _targetScaleY: any;
    declare _targetOpacity: any;
    declare _duration: number;
    declare _wholeDuration: number;
    declare _easingType: number;
    declare _easingExponent: number;
    declare _tone: number[] | null;
    declare _toneTarget: number[] | null;
    declare _toneDuration: number;
    declare _angle: number;
    declare _rotationSpeed: number;

    constructor(...args: any[]) {
        this.initialize(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        this.initBasic();
        this.initTarget();
        this.initTone();
        this.initRotation();
    }

    name(): string {
        return this._name;
    }

    origin(): number {
        return this._origin;
    }

    x(): number {
        return this._x;
    }

    y(): number {
        return this._y;
    }

    scaleX(): number {
        return this._scaleX;
    }

    scaleY(): number {
        return this._scaleY;
    }

    opacity(): number {
        return this._opacity;
    }

    blendMode(): RMMZ.BlendMode {
        return this._blendMode;
    }

    tone(): [number, number, number, number] | null {
        return this._tone as [number, number, number, number] | null;
    }

    angle(): number {
        return this._angle;
    }

    initBasic(): void {
        this._name = "";
        this._origin = 0;
        this._x = 0;
        this._y = 0;
        this._scaleX = 100;
        this._scaleY = 100;
        this._opacity = 255;
        this._blendMode = 0;
    }

    initTarget(): void {
        this._targetX = this._x;
        this._targetY = this._y;
        this._targetScaleX = this._scaleX;
        this._targetScaleY = this._scaleY;
        this._targetOpacity = this._opacity;
        this._duration = 0;
        this._wholeDuration = 0;
        this._easingType = 0;
        this._easingExponent = 0;
    }

    initTone(): void {
        this._tone = null;
        this._toneTarget = null;
        this._toneDuration = 0;
    }

    initRotation(): void {
        this._angle = 0;
        this._rotationSpeed = 0;
    }

    // prettier-ignore

    show(
        name: string, origin: number, x: number, y: number, scaleX: number, scaleY: number, opacity: number, blendMode: RMMZ.BlendMode
    ): void {
        this._name = name;
        this._origin = origin;
        this._x = x;
        this._y = y;
        this._scaleX = scaleX;
        this._scaleY = scaleY;
        this._opacity = opacity;
        this._blendMode = blendMode;
        this.initTarget();
        this.initTone();
        this.initRotation();
    }

    // prettier-ignore

    move(
        origin: number, x: number, y: number, scaleX: number, scaleY: number, opacity: number, blendMode: RMMZ.BlendMode, duration: number, easingType: RMMZ.PictureEasingType
    ): void {
        this._origin = origin;
        this._targetX = x;
        this._targetY = y;
        this._targetScaleX = scaleX;
        this._targetScaleY = scaleY;
        this._targetOpacity = opacity;
        this._blendMode = blendMode;
        this._duration = duration;
        this._wholeDuration = duration;
        this._easingType = easingType;
        this._easingExponent = 2;
    }

    rotate(speed: number): void {
        this._rotationSpeed = speed;
    }

    tint(tone: RMMZ.Color, duration: number): void {
        if (!this._tone) {
            this._tone = [0, 0, 0, 0];
        }
        this._toneTarget = tone.clone();
        this._toneDuration = duration;
        if (this._toneDuration === 0) {
            this._tone = this._toneTarget.clone();
        }
    }

    update(): void {
        this.updateMove();
        this.updateTone();
        this.updateRotation();
    }

    updateMove(): void {
        if (this._duration > 0) {
            this._x = this.applyEasing(this._x, this._targetX);
            this._y = this.applyEasing(this._y, this._targetY);
            this._scaleX = this.applyEasing(this._scaleX, this._targetScaleX);
            this._scaleY = this.applyEasing(this._scaleY, this._targetScaleY);
            this._opacity = this.applyEasing(this._opacity, this._targetOpacity);
            this._duration--;
        }
    }

    updateTone(): void {
        if (this._toneDuration > 0) {
            const d = this._toneDuration;
            for (let i = 0; i < 4; i++) {
                this._tone![i] = (this._tone![i] * (d - 1) + this._toneTarget![i]) / d;
            }
            this._toneDuration--;
        }
    }

    updateRotation(): void {
        if (this._rotationSpeed !== 0) {
            this._angle += this._rotationSpeed / 2;
        }
    }

    applyEasing(current: number, target: number): number {
        const d = this._duration;
        const wd = this._wholeDuration;
        const lt = this.calcEasing((wd - d) / wd);
        const t = this.calcEasing((wd - d + 1) / wd);
        const start = (current - target * lt) / (1 - lt);
        return start + (target - start) * t;
    }

    calcEasing(t: number): number {
        const exponent = this._easingExponent;
        switch (this._easingType) {
            case 1: // Slow start
                return this.easeIn(t, exponent);
            case 2: // Slow end
                return this.easeOut(t, exponent);
            case 3: // Slow start and end
                return this.easeInOut(t, exponent);
            default:
                return t;
        }
    }

    easeIn(t: number, exponent: number): number {
        return Math.pow(t, exponent);
    }

    easeOut(t: number, exponent: number): number {
        return 1 - Math.pow(1 - t, exponent);
    }

    easeInOut(t: number, exponent: number): number {
        if (t < 0.5) {
            return this.easeIn(t * 2, exponent) / 2;
        } else {
            return this.easeOut(t * 2 - 1, exponent) / 2 + 0.5;
        }
    }
}

/**
 * The game object class for handling skills, items, weapons, and armor. It is
 * required because save data should not include the database object itself.
 */
class Game_Item<T extends RMMZ.DataItemBase = RMMZ.DatabaseItem> {
    declare _dataClass: RMMZ.DataClassID | "";
    declare _itemId: number;

    constructor(...args: [item?: T | null]) {
        this.initialize(...args);
    }

    initialize(item?: T | null): void;
    initialize(...args: any[]): void;
    initialize(item?: T | null): void {
        this._dataClass = "";
        this._itemId = 0;
        if (item) {
            this.setObject(item);
        }
    }

    isSkill(): boolean {
        return this._dataClass === "skill";
    }

    isItem(): boolean {
        return this._dataClass === "item";
    }

    isUsableItem(): boolean {
        return this.isSkill() || this.isItem();
    }

    isWeapon(): boolean {
        return this._dataClass === "weapon";
    }

    isArmor(): boolean {
        return this._dataClass === "armor";
    }

    isEquipItem(): boolean {
        return this.isWeapon() || this.isArmor();
    }

    isNull(): boolean {
        return this._dataClass === "";
    }

    itemId(): number {
        return this._itemId;
    }

    object(): T | null {
        if (this.isSkill()) {
            return $dataSkills[this._itemId] as T | null;
        } else if (this.isItem()) {
            return $dataItems[this._itemId] as T | null;
        } else if (this.isWeapon()) {
            return $dataWeapons[this._itemId] as T | null;
        } else if (this.isArmor()) {
            return $dataArmors[this._itemId] as T | null;
        } else {
            return null;
        }
    }

    setObject(item: T | null): void {
        if (DataManager.isSkill(item)) {
            this._dataClass = "skill";
        } else if (DataManager.isItem(item)) {
            this._dataClass = "item";
        } else if (DataManager.isWeapon(item)) {
            this._dataClass = "weapon";
        } else if (DataManager.isArmor(item)) {
            this._dataClass = "armor";
        } else {
            this._dataClass = "";
        }
        this._itemId = item ? item.id : 0;
    }

    setEquip(isWeapon: boolean, itemId: number): void {
        this._dataClass = isWeapon ? "weapon" : "armor";
        this._itemId = itemId;
    }
}

/**
 * The game object class for a battle action.
 */
class Game_Action {
    declare _reflectionTarget: Game_Battler | null;

    declare _subjectActorId: RMMZ.ActorID | RMMZ.EnemyID;
    declare _subjectEnemyIndex: number;
    declare _forcing: boolean;
    declare _item: Game_Item<RMMZ.ActionItem>;
    declare _targetIndex: any;

    constructor(...args: [subject: Game_Battler, forcing?: boolean]) {
        this.initialize(...args);
    }

    static readonly EFFECT_RECOVER_HP = 11;

    static readonly EFFECT_RECOVER_MP = 12;

    static readonly EFFECT_GAIN_TP = 13;

    static readonly EFFECT_ADD_STATE = 21;

    static readonly EFFECT_REMOVE_STATE = 22;

    static readonly EFFECT_ADD_BUFF = 31;

    static readonly EFFECT_ADD_DEBUFF = 32;

    static readonly EFFECT_REMOVE_BUFF = 33;

    static readonly EFFECT_REMOVE_DEBUFF = 34;

    static readonly EFFECT_SPECIAL = 41;

    static readonly EFFECT_GROW = 42;

    static readonly EFFECT_LEARN_SKILL = 43;

    static readonly EFFECT_COMMON_EVENT = 44;

    static readonly SPECIAL_EFFECT_ESCAPE = 0;

    static readonly HITTYPE_CERTAIN = 0;

    static readonly HITTYPE_PHYSICAL = 1;

    static readonly HITTYPE_MAGICAL = 2;

    initialize(subject: Game_Battler, forcing?: boolean): void;
    initialize(...args: any[]): void;
    initialize(subject: Game_Battler, forcing?: boolean): void {
        this._subjectActorId = 0;
        this._subjectEnemyIndex = -1;
        this._forcing = forcing || false;
        this.setSubject(subject as RMMZ.ActionTarget);
        this.clear();
    }

    clear(): void {
        this._item = new Game_Item();
        this._targetIndex = -1;
    }

    setSubject(subject: RMMZ.ActionTarget): void {
        if (subject.isActor()) {
            this._subjectActorId = subject.actorId();
            this._subjectEnemyIndex = -1;
        } else {
            this._subjectEnemyIndex = subject.index();
            this._subjectActorId = 0;
        }
    }

    subject(): Game_Actor | Game_Enemy {
        if (this._subjectActorId > 0) {
            return $gameActors.actor(this._subjectActorId)!;
        } else {
            return $gameTroop.members()[this._subjectEnemyIndex];
        }
    }

    friendsUnit(): Game_Party | Game_Troop {
        return this.subject().friendsUnit();
    }

    opponentsUnit(): Game_Party | Game_Troop {
        return this.subject().opponentsUnit();
    }

    setEnemyAction(action: RMMZ.EnemyAction | null | undefined): void {
        if (action) {
            this.setSkill(action.skillId);
        } else {
            this.clear();
        }
    }

    setAttack(): void {
        this.setSkill(this.subject().attackSkillId());
    }

    setGuard(): void {
        this.setSkill(this.subject().guardSkillId());
    }

    setSkill(skillId: RMMZ.SkillID): void {
        this._item.setObject($dataSkills[skillId]);
    }

    setItem(itemId: RMMZ.ItemID): void {
        this._item.setObject($dataItems[itemId]);
    }

    setItemObject(object: RMMZ.ActionItem | null): void {
        this._item.setObject(object);
    }

    setTarget(targetIndex: number): void {
        this._targetIndex = targetIndex;
    }

    item(): RMMZ.ActionItem {
        return this._item.object()!;
    }

    isSkill(): boolean {
        return this._item.isSkill();
    }

    isItem(): boolean {
        return this._item.isItem();
    }

    numRepeats(): number {
        let repeats = this.item().repeats;
        if (this.isAttack()) {
            repeats += this.subject().attackTimesAdd();
        }
        return Math.floor(repeats);
    }

    checkItemScope(list: RMMZ.Scope[]): boolean {
        return list.includes(this.item().scope);
    }

    isForOpponent(): boolean {
        return this.checkItemScope([1, 2, 3, 4, 5, 6, 14]);
    }

    isForFriend(): boolean {
        return this.checkItemScope([7, 8, 9, 10, 11, 12, 13, 14]);
    }

    isForEveryone(): boolean {
        return this.checkItemScope([14]);
    }

    isForAliveFriend(): boolean {
        return this.checkItemScope([7, 8, 11, 14]);
    }

    isForDeadFriend(): boolean {
        return this.checkItemScope([9, 10]);
    }

    isForUser(): boolean {
        return this.checkItemScope([11]);
    }

    isForOne(): boolean {
        return this.checkItemScope([1, 3, 7, 9, 11, 12]);
    }

    isForRandom(): boolean {
        return this.checkItemScope([3, 4, 5, 6]);
    }

    isForAll(): boolean {
        return this.checkItemScope([2, 8, 10, 13, 14]);
    }

    needsSelection(): boolean {
        return this.checkItemScope([1, 7, 9, 12]);
    }

    numTargets(): number {
        return this.isForRandom() ? this.item().scope - 2 : 0;
    }

    checkDamageType(list: RMMZ.DamageType[]): boolean {
        return list.includes(this.item().damage.type);
    }

    isHpEffect(): boolean {
        return this.checkDamageType([1, 3, 5]);
    }

    isMpEffect(): boolean {
        return this.checkDamageType([2, 4, 6]);
    }

    isDamage(): boolean {
        return this.checkDamageType([1, 2]);
    }

    isRecover(): boolean {
        return this.checkDamageType([3, 4]);
    }

    isDrain(): boolean {
        return this.checkDamageType([5, 6]);
    }

    isHpRecover(): boolean {
        return this.checkDamageType([3]);
    }

    isMpRecover(): boolean {
        return this.checkDamageType([4]);
    }

    isCertainHit(): boolean {
        return this.item().hitType === Game_Action.HITTYPE_CERTAIN;
    }

    isPhysical(): boolean {
        return this.item().hitType === Game_Action.HITTYPE_PHYSICAL;
    }

    isMagical(): boolean {
        return this.item().hitType === Game_Action.HITTYPE_MAGICAL;
    }

    isAttack(): boolean {
        return this.item() === $dataSkills[this.subject().attackSkillId()];
    }

    isGuard(): boolean {
        return this.item() === $dataSkills[this.subject().guardSkillId()];
    }

    isMagicSkill(): boolean {
        if (this.isSkill()) {
            return $dataSystem.magicSkills.includes((this.item() as RMMZ.DataSkill).stypeId);
        } else {
            return false;
        }
    }

    decideRandomTarget(): void {
        let target;
        if (this.isForDeadFriend()) {
            target = this.friendsUnit().randomDeadTarget();
        } else if (this.isForFriend()) {
            target = this.friendsUnit().randomTarget();
        } else {
            target = this.opponentsUnit().randomTarget();
        }
        if (target) {
            this._targetIndex = target.index();
        } else {
            this.clear();
        }
    }

    setConfusion(): void {
        this.setAttack();
    }

    prepare(): void {
        if (this.subject().isConfused() && !this._forcing) {
            this.setConfusion();
        }
    }

    isValid(): boolean | RMMZ.ActionItem {
        return (this._forcing && this.item()) || this.subject().canUse(this.item());
    }

    speed(): number {
        const agi = this.subject().agi;
        let speed = agi + Math.randomInt(Math.floor(5 + agi / 4));
        if (this.item()) {
            speed += this.item().speed;
        }
        if (this.isAttack()) {
            speed += this.subject().attackSpeed();
        }
        return speed;
    }

    makeTargets(): (Game_Actor | Game_Enemy)[] {
        const targets = [];
        if (!this._forcing && this.subject().isConfused()) {
            targets.push(this.confusionTarget());
        } else if (this.isForEveryone()) {
            targets.push(...this.targetsForEveryone());
        } else if (this.isForOpponent()) {
            targets.push(...this.targetsForOpponents());
        } else if (this.isForFriend()) {
            targets.push(...this.targetsForFriends());
        }
        return this.repeatTargets(targets);
    }

    repeatTargets(targets: (RMMZ.ActionTarget | null)[]): (Game_Actor | Game_Enemy)[] {
        const repeatedTargets = [];
        const repeats = this.numRepeats();
        for (const target of targets) {
            if (target) {
                for (let i = 0; i < repeats; i++) {
                    repeatedTargets.push(target);
                }
            }
        }
        return repeatedTargets;
    }

    confusionTarget(): Game_Actor | Game_Enemy | null {
        switch (this.subject().confusionLevel()) {
            case 1:
                return this.opponentsUnit().randomTarget();
            case 2:
                if (Math.randomInt(2) === 0) {
                    return this.opponentsUnit().randomTarget();
                }
                return this.friendsUnit().randomTarget();
            default:
                return this.friendsUnit().randomTarget();
        }
    }

    targetsForEveryone(): (Game_Actor | Game_Enemy)[] {
        const opponentMembers = this.opponentsUnit().aliveMembers();
        const friendMembers = this.friendsUnit().aliveMembers();
        return opponentMembers.concat(friendMembers);
    }

    targetsForOpponents(): (Game_Actor | Game_Enemy | null)[] {
        const unit = this.opponentsUnit();
        if (this.isForRandom()) {
            return this.randomTargets(unit);
        } else {
            return this.targetsForAlive(unit);
        }
    }

    targetsForFriends(): (Game_Actor | Game_Enemy | null)[] {
        const unit = this.friendsUnit();
        if (this.isForUser()) {
            return [this.subject()];
        } else if (this.isForDeadFriend()) {
            return this.targetsForDead(unit);
        } else if (this.isForAliveFriend()) {
            return this.targetsForAlive(unit);
        } else {
            return this.targetsForDeadAndAlive(unit);
        }
    }

    randomTargets(unit: RMMZ.ActionUnit): (Game_Actor | Game_Enemy | null)[] {
        const targets = [];
        for (let i = 0; i < this.numTargets(); i++) {
            targets.push(unit.randomTarget());
        }
        return targets;
    }

    targetsForDead(unit: RMMZ.ActionUnit): (Game_Actor | Game_Enemy)[] {
        if (this.isForOne()) {
            return [unit.smoothDeadTarget(this._targetIndex)];
        } else {
            return unit.deadMembers();
        }
    }

    targetsForAlive(unit: RMMZ.ActionUnit): (Game_Actor | Game_Enemy | null)[] {
        if (this.isForOne()) {
            if (this._targetIndex < 0) {
                return [unit.randomTarget()];
            } else {
                return [unit.smoothTarget(this._targetIndex)];
            }
        } else {
            return unit.aliveMembers();
        }
    }

    targetsForDeadAndAlive(unit: RMMZ.ActionUnit): (Game_Actor | Game_Enemy)[] {
        if (this.isForOne()) {
            return [unit.members()[this._targetIndex]];
        } else {
            return unit.members();
        }
    }

    evaluate(): number {
        let value = 0;
        for (const target of this.itemTargetCandidates()) {
            const targetValue = this.evaluateWithTarget(target);
            if (this.isForAll()) {
                value += targetValue!;
            } else if (targetValue! > value) {
                value = targetValue!;
                this._targetIndex = target.index();
            }
        }
        value *= this.numRepeats();
        if (value > 0) {
            value += Math.random();
        }
        return value;
    }

    itemTargetCandidates(): (Game_Actor | Game_Enemy)[] {
        if (!this.isValid()) {
            return [];
        } else if (this.isForOpponent()) {
            return this.opponentsUnit().aliveMembers();
        } else if (this.isForUser()) {
            return [this.subject()];
        } else if (this.isForDeadFriend()) {
            return this.friendsUnit().deadMembers();
        } else {
            return this.friendsUnit().aliveMembers();
        }
    }

    evaluateWithTarget(target: RMMZ.ActionTarget): number | undefined {
        if (this.isHpEffect()) {
            const value = this.makeDamageValue(target, false);
            if (this.isForOpponent()) {
                return value / Math.max(target.hp, 1);
            } else {
                const recovery = Math.min(-value, target.mhp - target.hp);
                return recovery / target.mhp;
            }
        }
    }

    testApply(target: RMMZ.ActionTarget): boolean {
        return (
            this.testLifeAndDeath(target) &&
            ($gameParty.inBattle() ||
                (this.isHpRecover() && target.hp < target.mhp) ||
                (this.isMpRecover() && target.mp < target.mmp) ||
                this.hasItemAnyValidEffects(target))
        );
    }

    testLifeAndDeath(target: RMMZ.ActionTarget): boolean {
        if (this.isForOpponent() || this.isForAliveFriend()) {
            return target.isAlive();
        } else if (this.isForDeadFriend()) {
            return target.isDead();
        } else {
            return true;
        }
    }

    hasItemAnyValidEffects(target: RMMZ.ActionTarget): boolean {
        return this.item().effects.some((effect) => this.testItemEffect(target, effect));
    }

    testItemEffect(target: RMMZ.ActionTarget, effect: RMMZ.ActionEffectBase): boolean {
        switch (effect.code) {
            case Game_Action.EFFECT_RECOVER_HP:
                return target.hp < target.mhp || effect.value1 < 0 || effect.value2 < 0;
            case Game_Action.EFFECT_RECOVER_MP:
                return target.mp < target.mmp || effect.value1 < 0 || effect.value2 < 0;
            case Game_Action.EFFECT_ADD_STATE:
                return !target.isStateAffected(effect.dataId);
            case Game_Action.EFFECT_REMOVE_STATE:
                return target.isStateAffected(effect.dataId);
            case Game_Action.EFFECT_ADD_BUFF:
                return !target.isMaxBuffAffected(effect.dataId);
            case Game_Action.EFFECT_ADD_DEBUFF:
                return !target.isMaxDebuffAffected(effect.dataId);
            case Game_Action.EFFECT_REMOVE_BUFF:
                return target.isBuffAffected(effect.dataId);
            case Game_Action.EFFECT_REMOVE_DEBUFF:
                return target.isDebuffAffected(effect.dataId);
            case Game_Action.EFFECT_LEARN_SKILL:
                return target.isActor() && !target.isLearnedSkill(effect.dataId);
            default:
                return true;
        }
    }

    itemCnt(target: RMMZ.ActionTarget): number {
        if (this.isPhysical() && target.canMove()) {
            return target.cnt;
        } else {
            return 0;
        }
    }

    itemMrf(target: RMMZ.ActionTarget): number {
        if (this.isMagical()) {
            return target.mrf;
        } else {
            return 0;
        }
    }

    itemHit(_target: Game_Battler): number {
        const successRate = this.item().successRate;
        if (this.isPhysical()) {
            return successRate * 0.01 * this.subject().hit;
        } else {
            return successRate * 0.01;
        }
    }

    itemEva(target: RMMZ.ActionTarget): number {
        if (this.isPhysical()) {
            return target.eva;
        } else if (this.isMagical()) {
            return target.mev;
        } else {
            return 0;
        }
    }

    itemCri(target: RMMZ.ActionTarget): number {
        return this.item().damage.critical ? this.subject().cri * (1 - target.cev) : 0;
    }

    apply(target: RMMZ.ActionTarget): void {
        const result = target.result();
        this.subject().clearResult();
        result.clear();
        result.used = this.testApply(target);
        result.missed = result.used && Math.random() >= this.itemHit(target);
        result.evaded = !result.missed && Math.random() < this.itemEva(target);
        result.physical = this.isPhysical();
        result.drain = this.isDrain();
        if (result.isHit()) {
            if (this.item().damage.type > 0) {
                result.critical = Math.random() < this.itemCri(target);
                const value = this.makeDamageValue(target, result.critical);
                this.executeDamage(target, value);
            }
            for (const effect of this.item().effects) {
                this.applyItemEffect(target, effect);
            }
            this.applyItemUserEffect(target);
        }
        this.updateLastTarget(target);
    }

    makeDamageValue(target: RMMZ.ActionTarget, critical: boolean): number {
        const item = this.item();
        const baseValue = this.evalDamageFormula(target);
        let value = baseValue * this.calcElementRate(target);
        if (this.isPhysical()) {
            value *= target.pdr;
        }
        if (this.isMagical()) {
            value *= target.mdr;
        }
        if (baseValue < 0) {
            value *= target.rec;
        }
        if (critical) {
            value = this.applyCritical(value);
        }
        value = this.applyVariance(value, item.damage.variance);
        value = this.applyGuard(value, target);
        value = Math.round(value);
        return value;
    }

    evalDamageFormula(target: RMMZ.ActionTarget): number {
        try {
            const item = this.item();
            const a = this.subject();
            const b = target;
            const v = $gameVariables._data;
            // These bindings are consumed by user-defined damage formulas through eval.
            void a;
            void b;
            void v;
            const sign = [3, 4].includes(item.damage.type) ? -1 : 1;
            const value = Math.max(eval(item.damage.formula), 0) * sign;
            return isNaN(value) ? 0 : value;
        } catch {
            return 0;
        }
    }

    calcElementRate(target: RMMZ.ActionTarget): number {
        if (this.item().damage.elementId < 0) {
            return this.elementsMaxRate(target, this.subject().attackElements());
        } else {
            return target.elementRate(this.item().damage.elementId);
        }
    }

    elementsMaxRate(target: RMMZ.ActionTarget, elements: RMMZ.DataID[]): number {
        if (elements.length > 0) {
            const rates = elements.map((elementId) => target.elementRate(elementId));
            return Math.max(...rates);
        } else {
            return 1;
        }
    }

    applyCritical(damage: number): number {
        return damage * 3;
    }

    applyVariance(damage: number, variance: number): number {
        const amp = Math.floor(Math.max((Math.abs(damage) * variance) / 100, 0));
        const v = Math.randomInt(amp + 1) + Math.randomInt(amp + 1) - amp;
        return damage >= 0 ? damage + v : damage - v;
    }

    applyGuard(damage: number, target: RMMZ.ActionTarget): number {
        return damage / (damage > 0 && target.isGuard() ? 2 * target.grd : 1);
    }

    executeDamage(target: RMMZ.ActionTarget, value: number): void {
        const result = target.result();
        if (value === 0) {
            result.critical = false;
        }
        if (this.isHpEffect()) {
            this.executeHpDamage(target, value);
        }
        if (this.isMpEffect()) {
            this.executeMpDamage(target, value);
        }
    }

    executeHpDamage(target: RMMZ.ActionTarget, value: number): void {
        if (this.isDrain()) {
            value = Math.min(target.hp, value);
        }
        this.makeSuccess(target);
        target.gainHp(-value);
        if (value > 0) {
            target.onDamage(value);
        }
        this.gainDrainedHp(value);
    }

    executeMpDamage(target: RMMZ.ActionTarget, value: number): void {
        if (!this.isMpRecover()) {
            value = Math.min(target.mp, value);
        }
        if (value !== 0) {
            this.makeSuccess(target);
        }
        target.gainMp(-value);
        this.gainDrainedMp(value);
    }

    gainDrainedHp(value: number): void {
        if (this.isDrain()) {
            let gainTarget = this.subject();
            if (this._reflectionTarget) {
                gainTarget = this._reflectionTarget as Game_Actor | Game_Enemy;
            }
            gainTarget.gainHp(value);
        }
    }

    gainDrainedMp(value: number): void {
        if (this.isDrain()) {
            let gainTarget = this.subject();
            if (this._reflectionTarget) {
                gainTarget = this._reflectionTarget as Game_Actor | Game_Enemy;
            }
            gainTarget.gainMp(value);
        }
    }

    applyItemEffect(target: RMMZ.ActionTarget, effect: RMMZ.ActionEffectBase): void {
        switch (effect.code) {
            case Game_Action.EFFECT_RECOVER_HP:
                this.itemEffectRecoverHp(target, effect);
                break;
            case Game_Action.EFFECT_RECOVER_MP:
                this.itemEffectRecoverMp(target, effect);
                break;
            case Game_Action.EFFECT_GAIN_TP:
                this.itemEffectGainTp(target, effect);
                break;
            case Game_Action.EFFECT_ADD_STATE:
                this.itemEffectAddState(target, effect);
                break;
            case Game_Action.EFFECT_REMOVE_STATE:
                this.itemEffectRemoveState(target, effect);
                break;
            case Game_Action.EFFECT_ADD_BUFF:
                this.itemEffectAddBuff(target, effect);
                break;
            case Game_Action.EFFECT_ADD_DEBUFF:
                this.itemEffectAddDebuff(target, effect);
                break;
            case Game_Action.EFFECT_REMOVE_BUFF:
                this.itemEffectRemoveBuff(target, effect);
                break;
            case Game_Action.EFFECT_REMOVE_DEBUFF:
                this.itemEffectRemoveDebuff(target, effect);
                break;
            case Game_Action.EFFECT_SPECIAL:
                this.itemEffectSpecial(target, effect);
                break;
            case Game_Action.EFFECT_GROW:
                this.itemEffectGrow(target, effect);
                break;
            case Game_Action.EFFECT_LEARN_SKILL:
                this.itemEffectLearnSkill(target, effect);
                break;
            case Game_Action.EFFECT_COMMON_EVENT:
                this.itemEffectCommonEvent(target, effect);
                break;
        }
    }

    itemEffectRecoverHp(
        target: RMMZ.ActionTarget,
        effect: RMMZ.ActionEffect<typeof Game_Action.EFFECT_RECOVER_HP>,
    ): void {
        let value = (target.mhp * effect.value1 + effect.value2) * target.rec;
        if (this.isItem()) {
            value *= this.subject().pha;
        }
        value = Math.floor(value);
        if (value !== 0) {
            target.gainHp(value);
            this.makeSuccess(target);
        }
    }

    itemEffectRecoverMp(
        target: RMMZ.ActionTarget,
        effect: RMMZ.ActionEffect<typeof Game_Action.EFFECT_RECOVER_MP>,
    ): void {
        let value = (target.mmp * effect.value1 + effect.value2) * target.rec;
        if (this.isItem()) {
            value *= this.subject().pha;
        }
        value = Math.floor(value);
        if (value !== 0) {
            target.gainMp(value);
            this.makeSuccess(target);
        }
    }

    itemEffectGainTp(target: RMMZ.ActionTarget, effect: RMMZ.ActionEffect<typeof Game_Action.EFFECT_GAIN_TP>): void {
        let value = Math.floor(effect.value1);
        if (value !== 0) {
            target.gainTp(value);
            this.makeSuccess(target);
        }
    }

    itemEffectAddState(
        target: RMMZ.ActionTarget,
        effect: RMMZ.ActionEffect<typeof Game_Action.EFFECT_ADD_STATE>,
    ): void {
        if (effect.dataId === 0) {
            this.itemEffectAddAttackState(target, effect);
        } else {
            this.itemEffectAddNormalState(target, effect);
        }
    }

    itemEffectAddAttackState(
        target: RMMZ.ActionTarget,
        effect: RMMZ.ActionEffect<typeof Game_Action.EFFECT_ADD_STATE>,
    ): void {
        for (const stateId of this.subject().attackStates()) {
            let chance = effect.value1;
            chance *= target.stateRate(stateId);
            chance *= this.subject().attackStatesRate(stateId);
            chance *= this.lukEffectRate(target);
            if (Math.random() < chance) {
                target.addState(stateId);
                this.makeSuccess(target);
            }
        }
    }

    itemEffectAddNormalState(
        target: RMMZ.ActionTarget,
        effect: RMMZ.ActionEffect<typeof Game_Action.EFFECT_ADD_STATE>,
    ): void {
        let chance = effect.value1;
        if (!this.isCertainHit()) {
            chance *= target.stateRate(effect.dataId);
            chance *= this.lukEffectRate(target);
        }
        if (Math.random() < chance) {
            target.addState(effect.dataId);
            this.makeSuccess(target);
        }
    }

    itemEffectRemoveState(
        target: RMMZ.ActionTarget,
        effect: RMMZ.ActionEffect<typeof Game_Action.EFFECT_REMOVE_STATE>,
    ): void {
        let chance = effect.value1;
        if (Math.random() < chance) {
            target.removeState(effect.dataId);
            this.makeSuccess(target);
        }
    }

    itemEffectAddBuff(target: RMMZ.ActionTarget, effect: RMMZ.ActionEffect<typeof Game_Action.EFFECT_ADD_BUFF>): void {
        target.addBuff(effect.dataId, effect.value1);
        this.makeSuccess(target);
    }

    itemEffectAddDebuff(
        target: RMMZ.ActionTarget,
        effect: RMMZ.ActionEffect<typeof Game_Action.EFFECT_ADD_DEBUFF>,
    ): void {
        let chance = target.debuffRate(effect.dataId) * this.lukEffectRate(target);
        if (Math.random() < chance) {
            target.addDebuff(effect.dataId, effect.value1);
            this.makeSuccess(target);
        }
    }

    itemEffectRemoveBuff(
        target: RMMZ.ActionTarget,
        effect: RMMZ.ActionEffect<typeof Game_Action.EFFECT_REMOVE_BUFF>,
    ): void {
        if (target.isBuffAffected(effect.dataId)) {
            target.removeBuff(effect.dataId);
            this.makeSuccess(target);
        }
    }

    itemEffectRemoveDebuff(
        target: RMMZ.ActionTarget,
        effect: RMMZ.ActionEffect<typeof Game_Action.EFFECT_REMOVE_DEBUFF>,
    ): void {
        if (target.isDebuffAffected(effect.dataId)) {
            target.removeBuff(effect.dataId);
            this.makeSuccess(target);
        }
    }

    itemEffectSpecial(target: RMMZ.ActionTarget, effect: RMMZ.ActionEffect<typeof Game_Action.EFFECT_SPECIAL>): void {
        if (effect.dataId === Game_Action.SPECIAL_EFFECT_ESCAPE) {
            target.escape();
            this.makeSuccess(target);
        }
    }

    itemEffectGrow(target: RMMZ.ActionTarget, effect: RMMZ.ActionEffect<typeof Game_Action.EFFECT_GROW>): void {
        target.addParam(effect.dataId, Math.floor(effect.value1));
        this.makeSuccess(target);
    }

    itemEffectLearnSkill(
        target: RMMZ.ActionTarget,
        effect: RMMZ.ActionEffect<typeof Game_Action.EFFECT_LEARN_SKILL>,
    ): void {
        if (target.isActor()) {
            target.learnSkill(effect.dataId);
            this.makeSuccess(target);
        }
    }

    itemEffectCommonEvent(_target: Game_Battler, _effect: RMMZ.ActionEffectBase): void {
        //
    }

    makeSuccess(target: RMMZ.ActionTarget): void {
        target.result().success = true;
    }

    applyItemUserEffect(_target: Game_Battler): void {
        const value = Math.floor(this.item().tpGain * this.subject().tcr);
        this.subject().gainSilentTp(value);
    }

    lukEffectRate(target: RMMZ.ActionTarget): number {
        return Math.max(1.0 + (this.subject().luk - target.luk) * 0.001, 0.0);
    }

    applyGlobal(): void {
        for (const effect of this.item().effects) {
            if (effect.code === Game_Action.EFFECT_COMMON_EVENT) {
                $gameTemp.reserveCommonEvent(effect.dataId);
            }
        }
        this.updateLastUsed();
        this.updateLastSubject();
    }

    updateLastUsed(): void {
        const item = this.item();
        if (DataManager.isSkill(item)) {
            $gameTemp.setLastUsedSkillId(item.id);
        } else if (DataManager.isItem(item)) {
            $gameTemp.setLastUsedItemId(item.id);
        }
    }

    updateLastSubject(): void {
        const subject = this.subject();
        if (subject.isActor()) {
            $gameTemp.setLastSubjectActorId(subject.actorId());
        } else {
            $gameTemp.setLastSubjectEnemyIndex(subject.index() + 1);
        }
    }

    updateLastTarget(target: RMMZ.ActionTarget): void {
        if (target.isActor()) {
            $gameTemp.setLastTargetActorId(target.actorId());
        } else {
            $gameTemp.setLastTargetEnemyIndex(target.index() + 1);
        }
    }
}

/**
 * The game object class for a result of a battle action. For convinience, all
 * member variables in this class are public.
 */
class Game_ActionResult {
    declare used: boolean;
    declare missed: boolean;
    declare evaded: boolean;
    declare physical: boolean;
    declare drain: boolean;
    declare critical: boolean;
    declare success: boolean;
    declare hpAffected: boolean;
    declare hpDamage: number;
    declare mpDamage: number;
    declare tpDamage: number;
    declare addedStates: any[];
    declare removedStates: any[];
    declare addedBuffs: any[];
    declare addedDebuffs: any[];
    declare removedBuffs: any[];

    constructor(...args: []) {
        this.initialize(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        this.clear();
    }

    clear(): void {
        this.used = false;
        this.missed = false;
        this.evaded = false;
        this.physical = false;
        this.drain = false;
        this.critical = false;
        this.success = false;
        this.hpAffected = false;
        this.hpDamage = 0;
        this.mpDamage = 0;
        this.tpDamage = 0;
        this.addedStates = [];
        this.removedStates = [];
        this.addedBuffs = [];
        this.addedDebuffs = [];
        this.removedBuffs = [];
    }

    addedStateObjects(): RMMZ.DataState[] {
        return this.addedStates.map((id) => $dataStates[id]) as RMMZ.DataState[];
    }

    removedStateObjects(): RMMZ.DataState[] {
        return this.removedStates.map((id) => $dataStates[id]) as RMMZ.DataState[];
    }

    isStatusAffected(): boolean {
        return (
            this.addedStates.length > 0 ||
            this.removedStates.length > 0 ||
            this.addedBuffs.length > 0 ||
            this.addedDebuffs.length > 0 ||
            this.removedBuffs.length > 0
        );
    }

    isHit(): boolean {
        return this.used && !this.missed && !this.evaded;
    }

    isStateAdded(stateId: RMMZ.StateID): boolean {
        return this.addedStates.includes(stateId);
    }

    pushAddedState(stateId: RMMZ.StateID): void {
        if (!this.isStateAdded(stateId)) {
            this.addedStates.push(stateId);
        }
    }

    isStateRemoved(stateId: RMMZ.StateID): boolean {
        return this.removedStates.includes(stateId);
    }

    pushRemovedState(stateId: RMMZ.StateID): void {
        if (!this.isStateRemoved(stateId)) {
            this.removedStates.push(stateId);
        }
    }

    isBuffAdded(paramId: RMMZ.ParamID): boolean {
        return this.addedBuffs.includes(paramId);
    }

    pushAddedBuff(paramId: RMMZ.ParamID): void {
        if (!this.isBuffAdded(paramId)) {
            this.addedBuffs.push(paramId);
        }
    }

    isDebuffAdded(paramId: RMMZ.ParamID): boolean {
        return this.addedDebuffs.includes(paramId);
    }

    pushAddedDebuff(paramId: RMMZ.ParamID): void {
        if (!this.isDebuffAdded(paramId)) {
            this.addedDebuffs.push(paramId);
        }
    }

    isBuffRemoved(paramId: RMMZ.ParamID): boolean {
        return this.removedBuffs.includes(paramId);
    }

    pushRemovedBuff(paramId: RMMZ.ParamID): void {
        if (!this.isBuffRemoved(paramId)) {
            this.removedBuffs.push(paramId);
        }
    }
}

/**
 * The superclass of Game_Battler. It mainly contains parameters calculation.
 */
class Game_BattlerBase {
    declare _hp: number;
    declare _mp: number;
    declare _tp: number;
    declare _hidden: boolean;
    declare _paramPlus: number[];
    declare _states: any[];
    declare _stateTurns: Record<string, number>;
    declare _buffs: number[];
    declare _buffTurns: number[];

    constructor(...args: []) {
        this.initialize(...args);
    }

    static readonly TRAIT_ELEMENT_RATE = 11;

    static readonly TRAIT_DEBUFF_RATE = 12;

    static readonly TRAIT_STATE_RATE = 13;

    static readonly TRAIT_STATE_RESIST = 14;

    static readonly TRAIT_PARAM = 21;

    static readonly TRAIT_XPARAM = 22;

    static readonly TRAIT_SPARAM = 23;

    static readonly TRAIT_ATTACK_ELEMENT = 31;

    static readonly TRAIT_ATTACK_STATE = 32;

    static readonly TRAIT_ATTACK_SPEED = 33;

    static readonly TRAIT_ATTACK_TIMES = 34;

    static readonly TRAIT_ATTACK_SKILL = 35;

    static readonly TRAIT_STYPE_ADD = 41;

    static readonly TRAIT_STYPE_SEAL = 42;

    static readonly TRAIT_SKILL_ADD = 43;

    static readonly TRAIT_SKILL_SEAL = 44;

    static readonly TRAIT_EQUIP_WTYPE = 51;

    static readonly TRAIT_EQUIP_ATYPE = 52;

    static readonly TRAIT_EQUIP_LOCK = 53;

    static readonly TRAIT_EQUIP_SEAL = 54;

    static readonly TRAIT_SLOT_TYPE = 55;

    static readonly TRAIT_ACTION_PLUS = 61;

    static readonly TRAIT_SPECIAL_FLAG = 62;

    static readonly TRAIT_COLLAPSE_TYPE = 63;

    static readonly TRAIT_PARTY_ABILITY = 64;

    static readonly FLAG_ID_AUTO_BATTLE = 0;

    static readonly FLAG_ID_GUARD = 1;

    static readonly FLAG_ID_SUBSTITUTE = 2;

    static readonly FLAG_ID_PRESERVE_TP = 3;

    static readonly ICON_BUFF_START = 32;

    static readonly ICON_DEBUFF_START = 48;

    get hp(): number {
        return this._hp;
    }

    get mp(): number {
        return this._mp;
    }

    get tp(): number {
        return this._tp;
    }

    get mhp(): number {
        return this.param(0);
    }

    get mmp(): number {
        return this.param(1);
    }

    get atk(): number {
        return this.param(2);
    }

    get def(): number {
        return this.param(3);
    }

    get mat(): number {
        return this.param(4);
    }

    get mdf(): number {
        return this.param(5);
    }

    get agi(): number {
        return this.param(6);
    }

    get luk(): number {
        return this.param(7);
    }

    get hit(): number {
        return this.xparam(0);
    }

    get eva(): number {
        return this.xparam(1);
    }

    get cri(): number {
        return this.xparam(2);
    }

    get cev(): number {
        return this.xparam(3);
    }

    get mev(): number {
        return this.xparam(4);
    }

    get mrf(): number {
        return this.xparam(5);
    }

    get cnt(): number {
        return this.xparam(6);
    }

    get hrg(): number {
        return this.xparam(7);
    }

    get mrg(): number {
        return this.xparam(8);
    }

    get trg(): number {
        return this.xparam(9);
    }

    get tgr(): number {
        return this.sparam(0);
    }

    get grd(): number {
        return this.sparam(1);
    }

    get rec(): number {
        return this.sparam(2);
    }

    get pha(): number {
        return this.sparam(3);
    }

    get mcr(): number {
        return this.sparam(4);
    }

    get tcr(): number {
        return this.sparam(5);
    }

    get pdr(): number {
        return this.sparam(6);
    }

    get mdr(): number {
        return this.sparam(7);
    }

    get fdr(): number {
        return this.sparam(8);
    }

    get exr(): number {
        return this.sparam(9);
    }

    initialize(..._args: any[]): void;
    initialize(...args: any[]): void;
    initialize(..._args: any[]): void {
        this.initMembers();
    }

    initMembers(): void {
        this._hp = 1;
        this._mp = 0;
        this._tp = 0;
        this._hidden = false;
        this.clearParamPlus();
        this.clearStates();
        this.clearBuffs();
    }

    clearParamPlus(): void {
        this._paramPlus = [0, 0, 0, 0, 0, 0, 0, 0];
    }

    clearStates(): void {
        this._states = [];
        this._stateTurns = {};
    }

    eraseState(stateId: RMMZ.StateID): void {
        this._states.remove(stateId);
        delete this._stateTurns[stateId];
    }

    isStateAffected(stateId: RMMZ.StateID): boolean {
        return this._states.includes(stateId);
    }

    isDeathStateAffected(): boolean {
        return this.isStateAffected(this.deathStateId());
    }

    deathStateId(): number {
        return 1;
    }

    resetStateCounts(stateId: RMMZ.StateID): void {
        const state = $dataStates[stateId];
        const variance = 1 + Math.max(state!.maxTurns - state!.minTurns, 0);
        this._stateTurns[stateId] = state!.minTurns + Math.randomInt(variance);
    }

    isStateExpired(stateId: RMMZ.StateID): boolean {
        return this._stateTurns[stateId] === 0;
    }

    updateStateTurns(): void {
        for (const stateId of this._states) {
            if (this._stateTurns[stateId] > 0) {
                this._stateTurns[stateId]--;
            }
        }
    }

    clearBuffs(): void {
        this._buffs = [0, 0, 0, 0, 0, 0, 0, 0];
        this._buffTurns = [0, 0, 0, 0, 0, 0, 0, 0];
    }

    eraseBuff(paramId: RMMZ.ParamID): void {
        this._buffs[paramId] = 0;
        this._buffTurns[paramId] = 0;
    }

    buffLength(): number {
        return this._buffs.length as 8;
    }

    buff(paramId: RMMZ.ParamID): number {
        return this._buffs[paramId];
    }

    isBuffAffected(paramId: RMMZ.ParamID): boolean {
        return this._buffs[paramId] > 0;
    }

    isDebuffAffected(paramId: RMMZ.ParamID): boolean {
        return this._buffs[paramId] < 0;
    }

    isBuffOrDebuffAffected(paramId: RMMZ.ParamID): boolean {
        return this._buffs[paramId] !== 0;
    }

    isMaxBuffAffected(paramId: RMMZ.ParamID): boolean {
        return this._buffs[paramId] === 2;
    }

    isMaxDebuffAffected(paramId: RMMZ.ParamID): boolean {
        return this._buffs[paramId] === -2;
    }

    increaseBuff(paramId: RMMZ.ParamID): void {
        if (!this.isMaxBuffAffected(paramId)) {
            this._buffs[paramId]++;
        }
    }

    decreaseBuff(paramId: RMMZ.ParamID): void {
        if (!this.isMaxDebuffAffected(paramId)) {
            this._buffs[paramId]--;
        }
    }

    overwriteBuffTurns(paramId: RMMZ.ParamID, turns: number): void {
        if (this._buffTurns[paramId] < turns) {
            this._buffTurns[paramId] = turns;
        }
    }

    isBuffExpired(paramId: RMMZ.ParamID): boolean {
        return this._buffTurns[paramId] === 0;
    }

    updateBuffTurns(): void {
        for (let i = 0; i < this._buffTurns.length; i++) {
            if (this._buffTurns[i] > 0) {
                this._buffTurns[i]--;
            }
        }
    }

    die(): void {
        this._hp = 0;
        this.clearStates();
        this.clearBuffs();
    }

    revive(): void {
        if (this._hp === 0) {
            this._hp = 1;
        }
    }

    states(): RMMZ.DataState[] {
        return this._states.map((id) => $dataStates[id]) as RMMZ.DataState[];
    }

    stateIcons(): number[] {
        return this.states()
            .map((state) => state.iconIndex)
            .filter((iconIndex) => iconIndex > 0);
    }

    buffIcons(): number[] {
        const icons = [];
        for (let i = 0; i < this._buffs.length; i++) {
            if (this._buffs[i] !== 0) {
                icons.push(this.buffIconIndex(this._buffs[i], i as RMMZ.ParamID));
            }
        }
        return icons;
    }

    buffIconIndex(buffLevel: number, paramId: RMMZ.ParamID): number {
        if (buffLevel > 0) {
            return Game_BattlerBase.ICON_BUFF_START + (buffLevel - 1) * 8 + paramId;
        } else if (buffLevel < 0) {
            return Game_BattlerBase.ICON_DEBUFF_START + (-buffLevel - 1) * 8 + paramId;
        } else {
            return 0;
        }
    }

    allIcons(): number[] {
        return this.stateIcons().concat(this.buffIcons());
    }

    traitObjects(): {
        traits: RMMZ.Trait[];
    }[] {
        // Returns an array of the all objects having traits. States only here.
        return this.states();
    }

    allTraits(): RMMZ.Trait[] {
        return this.traitObjects().reduce<RMMZ.Trait[]>((r, obj) => r.concat(obj.traits), []);
    }

    traits(code: RMMZ.TraitType): RMMZ.Trait[] {
        return this.allTraits().filter((trait) => trait.code === code);
    }

    traitsWithId(code: RMMZ.TraitType, id: RMMZ.DataID): RMMZ.Trait[] {
        return this.allTraits().filter((trait) => trait.code === code && trait.dataId === id);
    }

    traitsPi(code: RMMZ.TraitType, id: RMMZ.DataID): number {
        return this.traitsWithId(code, id).reduce((r, trait) => r * trait.value, 1);
    }

    traitsSum(code: RMMZ.TraitType, id: RMMZ.DataID): number {
        return this.traitsWithId(code, id).reduce((r, trait) => r + trait.value, 0);
    }

    traitsSumAll(code: RMMZ.TraitType): number {
        return this.traits(code).reduce((r, trait) => r + trait.value, 0);
    }

    traitsSet(code: RMMZ.TraitType): number[] {
        return this.traits(code).reduce<number[]>((r, trait) => r.concat(trait.dataId), []);
    }

    paramBase(_paramId: RMMZ.ParamID): number {
        return 0;
    }

    paramPlus(paramId: RMMZ.ParamID): number {
        return this._paramPlus[paramId];
    }

    paramBasePlus(paramId: RMMZ.ParamID): number {
        return Math.max(0, this.paramBase(paramId) + this.paramPlus(paramId));
    }

    paramMin(paramId: RMMZ.ParamID): 0 | 1 {
        if (paramId === 0) {
            return 1; // MHP
        } else {
            return 0;
        }
    }

    paramMax(_paramId: RMMZ.ParamID): number {
        return Infinity;
    }

    paramRate(paramId: RMMZ.ParamID): number {
        return this.traitsPi(Game_BattlerBase.TRAIT_PARAM, paramId);
    }

    paramBuffRate(paramId: RMMZ.ParamID): number {
        return this._buffs[paramId] * 0.25 + 1.0;
    }

    param(paramId: RMMZ.ParamID): number {
        const value = this.paramBasePlus(paramId) * this.paramRate(paramId) * this.paramBuffRate(paramId);
        const maxValue = this.paramMax(paramId);
        const minValue = this.paramMin(paramId);
        return Math.round(value.clamp(minValue, maxValue));
    }

    xparam(xparamId: RMMZ.DataID): number {
        return this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, xparamId);
    }

    sparam(sparamId: RMMZ.DataID): number {
        return this.traitsPi(Game_BattlerBase.TRAIT_SPARAM, sparamId);
    }

    elementRate(elementId: RMMZ.DataID): number {
        return this.traitsPi(Game_BattlerBase.TRAIT_ELEMENT_RATE, elementId);
    }

    debuffRate(paramId: RMMZ.ParamID): number {
        return this.traitsPi(Game_BattlerBase.TRAIT_DEBUFF_RATE, paramId);
    }

    stateRate(stateId: RMMZ.StateID): number {
        return this.traitsPi(Game_BattlerBase.TRAIT_STATE_RATE, stateId);
    }

    stateResistSet(): number[] {
        return this.traitsSet(Game_BattlerBase.TRAIT_STATE_RESIST);
    }

    isStateResist(stateId: RMMZ.StateID): boolean {
        return this.stateResistSet().includes(stateId);
    }

    attackElements(): number[] {
        return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_ELEMENT);
    }

    attackStates(): number[] {
        return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_STATE);
    }

    attackStatesRate(stateId: RMMZ.StateID): number {
        return this.traitsSum(Game_BattlerBase.TRAIT_ATTACK_STATE, stateId);
    }

    attackSpeed(): number {
        return this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_SPEED);
    }

    attackTimesAdd(): number {
        return Math.max(this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_TIMES), 0);
    }

    attackSkillId(): number {
        const set = this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_SKILL);
        return set.length > 0 ? Math.max(...set) : 1;
    }

    addedSkillTypes(): number[] {
        return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_ADD);
    }

    isSkillTypeSealed(stypeId: RMMZ.SkillType): boolean {
        return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_SEAL).includes(stypeId);
    }

    addedSkills(): number[] {
        return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_ADD);
    }

    isSkillSealed(skillId: RMMZ.SkillID): boolean {
        return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_SEAL).includes(skillId);
    }

    isEquipWtypeOk(wtypeId: RMMZ.WeaponType): boolean {
        return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_WTYPE).includes(wtypeId);
    }

    isEquipAtypeOk(atypeId: RMMZ.ArmorType): boolean {
        return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_ATYPE).includes(atypeId);
    }

    isEquipTypeLocked(etypeId: RMMZ.ElementType): boolean {
        return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_LOCK).includes(etypeId);
    }

    isEquipTypeSealed(etypeId: RMMZ.ElementType): boolean {
        return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_SEAL).includes(etypeId);
    }

    slotType(): number {
        const set = this.traitsSet(Game_BattlerBase.TRAIT_SLOT_TYPE);
        return set.length > 0 ? Math.max(...set) : 0;
    }

    isDualWield(): boolean {
        return this.slotType() === 1;
    }

    actionPlusSet(): number[] {
        return this.traits(Game_BattlerBase.TRAIT_ACTION_PLUS).map((trait) => trait.value);
    }

    specialFlag(flagId: RMMZ.DataID): boolean {
        return this.traits(Game_BattlerBase.TRAIT_SPECIAL_FLAG).some((trait) => trait.dataId === flagId);
    }

    collapseType(): number {
        const set = this.traitsSet(Game_BattlerBase.TRAIT_COLLAPSE_TYPE);
        return set.length > 0 ? Math.max(...set) : 0;
    }

    partyAbility(abilityId: RMMZ.DataID): boolean {
        return this.traits(Game_BattlerBase.TRAIT_PARTY_ABILITY).some((trait) => trait.dataId === abilityId);
    }

    isAutoBattle(): boolean {
        return this.specialFlag(Game_BattlerBase.FLAG_ID_AUTO_BATTLE);
    }

    isGuard(): boolean {
        return this.specialFlag(Game_BattlerBase.FLAG_ID_GUARD) && this.canMove();
    }

    isSubstitute(): boolean {
        return this.specialFlag(Game_BattlerBase.FLAG_ID_SUBSTITUTE) && this.canMove();
    }

    isPreserveTp(): boolean {
        return this.specialFlag(Game_BattlerBase.FLAG_ID_PRESERVE_TP);
    }

    addParam(paramId: RMMZ.ParamID, value: number): void {
        this._paramPlus[paramId] += value;
        this.refresh();
    }

    setHp(hp: number): void {
        this._hp = hp;
        this.refresh();
    }

    setMp(mp: number): void {
        this._mp = mp;
        this.refresh();
    }

    setTp(tp: number): void {
        this._tp = tp;
        this.refresh();
    }

    maxTp(): number {
        return 100;
    }

    refresh(): void {
        for (const stateId of this.stateResistSet()) {
            this.eraseState(stateId);
        }
        this._hp = this._hp.clamp(0, this.mhp);
        this._mp = this._mp.clamp(0, this.mmp);
        this._tp = this._tp.clamp(0, this.maxTp());
    }

    recoverAll(): void {
        this.clearStates();
        this._hp = this.mhp;
        this._mp = this.mmp;
    }

    hpRate(): number {
        return this.hp / this.mhp;
    }

    mpRate(): number {
        return this.mmp > 0 ? this.mp / this.mmp : 0;
    }

    tpRate(): number {
        return this.tp / this.maxTp();
    }

    hide(): void {
        this._hidden = true;
    }

    appear(): void {
        this._hidden = false;
    }

    isHidden(): boolean {
        return this._hidden;
    }

    isAppeared(): boolean {
        return !this.isHidden();
    }

    isDead(): boolean {
        return this.isAppeared() && this.isDeathStateAffected();
    }

    isAlive(): boolean {
        return this.isAppeared() && !this.isDeathStateAffected();
    }

    isDying(): boolean {
        return this.isAlive() && this._hp < this.mhp / 4;
    }

    isRestricted(): boolean {
        return this.isAppeared() && this.restriction() > 0;
    }

    canInput(): boolean {
        // prettier-ignore
        return this.isAppeared() && this.isActor() &&
                !this.isRestricted() && !this.isAutoBattle();
    }

    canMove(): boolean {
        return this.isAppeared() && this.restriction() < 4;
    }

    isConfused(): boolean {
        return this.isAppeared() && this.restriction() >= 1 && this.restriction() <= 3;
    }

    confusionLevel(): number {
        return this.isConfused() ? this.restriction() : 0;
    }

    isActor(): this is Game_Actor {
        return false;
    }

    isEnemy(): this is Game_Enemy {
        return false;
    }

    sortStates(): void {
        this._states.sort((a, b) => {
            const p1 = $dataStates[a]!.priority;
            const p2 = $dataStates[b]!.priority;
            if (p1 !== p2) {
                return p2 - p1;
            }
            return a - b;
        });
    }

    restriction(): number {
        const restrictions = this.states().map((state) => state.restriction);
        return Math.max(0, ...restrictions);
    }

    addNewState(stateId: RMMZ.StateID): void {
        if (stateId === this.deathStateId()) {
            this.die();
        }
        const restricted = this.isRestricted();
        this._states.push(stateId);
        this.sortStates();
        if (!restricted && this.isRestricted()) {
            this.onRestrict();
        }
    }

    onRestrict(): void {
        //
    }

    mostImportantStateText(): string {
        for (const state of this.states()) {
            if (state.message3) {
                return state.message3;
            }
        }
        return "";
    }

    stateMotionIndex(): RMMZ.Motion {
        const states = this.states();
        if (states.length > 0) {
            return states[0].motion;
        } else {
            return 0;
        }
    }

    stateOverlayIndex(): RMMZ.Overlay {
        const states = this.states();
        if (states.length > 0) {
            return states[0].overlay;
        } else {
            return 0;
        }
    }

    isSkillWtypeOk(_skill: RMMZ.DataSkill): boolean {
        return true;
    }

    skillMpCost(skill: RMMZ.DataSkill): number {
        return Math.floor(skill.mpCost * this.mcr);
    }

    skillTpCost(skill: RMMZ.DataSkill): number {
        return skill.tpCost;
    }

    canPaySkillCost(skill: RMMZ.DataSkill): boolean {
        return this._tp >= this.skillTpCost(skill) && this._mp >= this.skillMpCost(skill);
    }

    paySkillCost(skill: RMMZ.DataSkill): void {
        this._mp -= this.skillMpCost(skill);
        this._tp -= this.skillTpCost(skill);
    }

    isOccasionOk(item: RMMZ.DataSkill | RMMZ.DataItem): boolean {
        if ($gameParty.inBattle()) {
            return item.occasion === 0 || item.occasion === 1;
        } else {
            return item.occasion === 0 || item.occasion === 2;
        }
    }

    meetsUsableItemConditions(item: RMMZ.DataSkill | RMMZ.DataItem): boolean {
        return this.canMove() && this.isOccasionOk(item);
    }

    meetsSkillConditions(skill: RMMZ.DataSkill): boolean {
        return (
            this.meetsUsableItemConditions(skill) &&
            this.isSkillWtypeOk(skill) &&
            this.canPaySkillCost(skill) &&
            !this.isSkillSealed(skill.id) &&
            !this.isSkillTypeSealed(skill.stypeId)
        );
    }

    meetsItemConditions(item: RMMZ.DataSkill | RMMZ.DataItem): boolean {
        return this.meetsUsableItemConditions(item) && $gameParty.hasItem(item);
    }

    canUse(item: RMMZ.DatabaseItem | null): boolean {
        if (!item) {
            return false;
        } else if (DataManager.isSkill(item)) {
            return this.meetsSkillConditions(item);
        } else if (DataManager.isItem(item)) {
            return this.meetsItemConditions(item);
        } else {
            return false;
        }
    }

    canEquip(item: RMMZ.DatabaseItem): item is RMMZ.DataWeapon | RMMZ.DataArmor {
        if (!item) {
            return false;
        } else if (DataManager.isWeapon(item)) {
            return this.canEquipWeapon(item);
        } else if (DataManager.isArmor(item)) {
            return this.canEquipArmor(item);
        } else {
            return false;
        }
    }

    canEquipWeapon(item: RMMZ.DataWeapon): boolean {
        return this.isEquipWtypeOk(item.wtypeId) && !this.isEquipTypeSealed(item.etypeId);
    }

    canEquipArmor(item: RMMZ.DataArmor): boolean {
        return this.isEquipAtypeOk(item.atypeId) && !this.isEquipTypeSealed(item.etypeId);
    }

    guardSkillId(): number {
        return 2;
    }

    canAttack(): boolean {
        return this.canUse($dataSkills[this.attackSkillId()]);
    }

    canGuard(): boolean {
        return this.canUse($dataSkills[this.guardSkillId()]);
    }
}

/**
 * The superclass of Game_Actor and Game_Enemy. It contains methods for sprites
 * and actions.
 */
class Game_Battler extends Game_BattlerBase {
    declare _actions: Game_Action[];
    declare _speed: number;
    declare _result: Game_ActionResult;
    declare _actionState: RMMZ.ActionState | "";
    declare _lastTargetIndex: number;
    declare _damagePopup: boolean;
    declare _effectType: RMMZ.BattlerEffectType | null;
    declare _motionType: RMMZ.BattlerMotionType | null;
    declare _weaponImageId: number;
    declare _motionRefresh: boolean;
    declare _selected: boolean;
    declare _tpbState: string;
    declare _tpbChargeTime: number;
    declare _tpbCastTime: number;
    declare _tpbIdleTime: number;
    declare _tpbTurnCount: number;
    declare _tpbTurnEnd: boolean;

    constructor(..._extra: any[]);
    constructor(...args: []) {
        super(...args);
    }

    initialize(..._args: any[]): void;
    initialize(...args: any[]): void;
    initialize(..._args: any[]): void {
        super.initialize();
    }

    initMembers(): void {
        super.initMembers();

        this._actions = [];
        this._speed = 0;
        this._result = new Game_ActionResult();
        this._actionState = "";
        this._lastTargetIndex = 0;
        this._damagePopup = false;
        this._effectType = null;
        this._motionType = null;
        this._weaponImageId = 0;
        this._motionRefresh = false;
        this._selected = false;
        this._tpbState = "";
        this._tpbChargeTime = 0;
        this._tpbCastTime = 0;
        this._tpbIdleTime = 0;
        this._tpbTurnCount = 0;
        this._tpbTurnEnd = false;
    }

    clearDamagePopup(): void {
        this._damagePopup = false;
    }

    clearWeaponAnimation(): void {
        this._weaponImageId = 0;
    }

    clearEffect(): void {
        this._effectType = null;
    }

    clearMotion(): void {
        this._motionType = null;
        this._motionRefresh = false;
    }

    requestEffect(effectType: RMMZ.BattlerEffectType): void {
        this._effectType = effectType;
    }

    requestMotion(motionType: RMMZ.BattlerMotionType): void {
        this._motionType = motionType;
    }

    requestMotionRefresh(): void {
        this._motionRefresh = true;
    }

    cancelMotionRefresh(): void {
        this._motionRefresh = false;
    }

    select(): void {
        this._selected = true;
    }

    deselect(): void {
        this._selected = false;
    }

    isDamagePopupRequested(): boolean {
        return this._damagePopup;
    }

    isEffectRequested(): boolean {
        return !!this._effectType;
    }

    isMotionRequested(): boolean {
        return !!this._motionType;
    }

    isWeaponAnimationRequested(): boolean {
        return this._weaponImageId > 0;
    }

    isMotionRefreshRequested(): boolean {
        return this._motionRefresh;
    }

    isSelected(): boolean {
        return this._selected;
    }

    effectType(): RMMZ.BattlerEffectType | null {
        return this._effectType;
    }

    motionType(): RMMZ.BattlerMotionType | null {
        return this._motionType;
    }

    weaponImageId(): number {
        return this._weaponImageId;
    }

    startDamagePopup(): void {
        this._damagePopup = true;
    }

    shouldPopupDamage(): boolean {
        const result = this._result;
        return result.missed || result.evaded || result.hpAffected || result.mpDamage !== 0;
    }

    startWeaponAnimation(weaponImageId: RMMZ.DataID): void {
        this._weaponImageId = weaponImageId;
    }

    action(index: number): Game_Action {
        return this._actions[index];
    }

    setAction(index: number, action: Game_Action): void {
        this._actions[index] = action;
    }

    numActions(): number {
        return this._actions.length;
    }

    clearActions(): void {
        this._actions = [];
    }

    result(): Game_ActionResult {
        return this._result;
    }

    clearResult(): void {
        this._result.clear();
    }

    clearTpbChargeTime(): void {
        this._tpbState = "charging";
        this._tpbChargeTime = 0;
    }

    applyTpbPenalty(): void {
        this._tpbState = "charging";
        this._tpbChargeTime -= 1;
    }

    initTpbChargeTime(advantageous?: boolean): void {
        const speed = this.tpbRelativeSpeed();
        this._tpbState = "charging";
        this._tpbChargeTime = advantageous ? 1 : speed * Math.random() * 0.5;
        if (this.isRestricted()) {
            this._tpbChargeTime = 0;
        }
    }

    tpbChargeTime(): number {
        return this._tpbChargeTime;
    }

    startTpbCasting(): void {
        this._tpbState = "casting";
        this._tpbCastTime = 0;
    }

    startTpbAction(): void {
        this._tpbState = "acting";
    }

    isTpbCharged(): boolean {
        return this._tpbState === "charged";
    }

    isTpbReady(): boolean {
        return this._tpbState === "ready";
    }

    isTpbTimeout(): boolean {
        return this._tpbIdleTime >= 1;
    }

    updateTpb(): void {
        if (this.canMove()) {
            this.updateTpbChargeTime();
            this.updateTpbCastTime();
            this.updateTpbAutoBattle();
        }
        if (this.isAlive()) {
            this.updateTpbIdleTime();
        }
    }

    updateTpbChargeTime(): void {
        if (this._tpbState === "charging") {
            this._tpbChargeTime += this.tpbAcceleration();
            if (this._tpbChargeTime >= 1) {
                this._tpbChargeTime = 1;
                this.onTpbCharged();
            }
        }
    }

    updateTpbCastTime(): void {
        if (this._tpbState === "casting") {
            this._tpbCastTime += this.tpbAcceleration();
            if (this._tpbCastTime >= this.tpbRequiredCastTime()) {
                this._tpbCastTime = this.tpbRequiredCastTime();
                this._tpbState = "ready";
            }
        }
    }

    updateTpbAutoBattle(): void {
        if (this.isTpbCharged() && !this.isTpbTurnEnd() && this.isAutoBattle()) {
            this.makeTpbActions();
        }
    }

    updateTpbIdleTime(): void {
        if (!this.canMove() || this.isTpbCharged()) {
            this._tpbIdleTime += this.tpbAcceleration();
        }
    }

    tpbAcceleration(): number {
        const speed = this.tpbRelativeSpeed();
        const referenceTime = $gameParty.tpbReferenceTime();
        return speed / referenceTime;
    }

    tpbRelativeSpeed(): number {
        return this.tpbSpeed() / $gameParty.tpbBaseSpeed();
    }

    tpbSpeed(): number {
        return Math.sqrt(this.agi) + 1;
    }

    tpbBaseSpeed(): number {
        const baseAgility = this.paramBasePlus(6);
        return Math.sqrt(baseAgility) + 1;
    }

    tpbRequiredCastTime(): number {
        const actions = this._actions.filter((action) => action.isValid());
        const items = actions.map((action) => action.item());
        const delay = items.reduce((r, item) => r + Math.max(0, -item.speed), 0);
        return Math.sqrt(delay) / this.tpbSpeed();
    }

    onTpbCharged(): void {
        if (!this.shouldDelayTpbCharge()) {
            this.finishTpbCharge();
        }
    }

    shouldDelayTpbCharge(): boolean {
        return !BattleManager.isActiveTpb() && $gameParty.canInput();
    }

    finishTpbCharge(): void {
        this._tpbState = "charged";
        this._tpbTurnEnd = true;
        this._tpbIdleTime = 0;
    }

    isTpbTurnEnd(): boolean {
        return this._tpbTurnEnd;
    }

    initTpbTurn(): void {
        this._tpbTurnEnd = false;
        this._tpbTurnCount = 0;
        this._tpbIdleTime = 0;
    }

    startTpbTurn(): void {
        this._tpbTurnEnd = false;
        this._tpbTurnCount++;
        this._tpbIdleTime = 0;
        if (this.numActions() === 0) {
            this.makeTpbActions();
        }
    }

    makeTpbActions(): void {
        this.makeActions();
        if (this.canInput()) {
            this.setActionState("undecided");
        } else {
            this.startTpbCasting();
            this.setActionState("waiting");
        }
    }

    onTpbTimeout(): void {
        this.onAllActionsEnd();
        this._tpbTurnEnd = true;
        this._tpbIdleTime = 0;
    }

    turnCount(): number {
        if (BattleManager.isTpb()) {
            return this._tpbTurnCount;
        } else {
            return $gameTroop.turnCount() + 1;
        }
    }

    canInput(): boolean {
        if (BattleManager.isTpb() && !this.isTpbCharged()) {
            return false;
        }
        return super.canInput();
    }

    refresh(): void {
        super.refresh();
        if (this.hp === 0) {
            this.addState(this.deathStateId());
        } else {
            this.removeState(this.deathStateId());
        }
    }

    addState(stateId: RMMZ.StateID): void {
        if (this.isStateAddable(stateId)) {
            if (!this.isStateAffected(stateId)) {
                this.addNewState(stateId);
                this.refresh();
            }
            this.resetStateCounts(stateId);
            this._result.pushAddedState(stateId);
        }
    }

    isStateAddable(stateId: RMMZ.StateID): boolean {
        return (this.isAlive() &&
            $dataStates[stateId] &&
            !this.isStateResist(stateId) &&
            !this.isStateRestrict(stateId))!;
    }

    isStateRestrict(stateId: RMMZ.StateID): boolean {
        return $dataStates[stateId]!.removeByRestriction && this.isRestricted();
    }

    onRestrict(): void {
        super.onRestrict();
        this.clearTpbChargeTime();
        this.clearActions();
        for (const state of this.states()) {
            if (state.removeByRestriction) {
                this.removeState(state.id);
            }
        }
    }

    removeState(stateId: RMMZ.StateID): void {
        if (this.isStateAffected(stateId)) {
            if (stateId === this.deathStateId()) {
                this.revive();
            }
            this.eraseState(stateId);
            this.refresh();
            this._result.pushRemovedState(stateId);
        }
    }

    escape(): void {
        if ($gameParty.inBattle()) {
            this.hide();
        }
        this.clearActions();
        this.clearStates();
        SoundManager.playEscape();
    }

    addBuff(paramId: RMMZ.ParamID, turns: number): void {
        if (this.isAlive()) {
            this.increaseBuff(paramId);
            if (this.isBuffAffected(paramId)) {
                this.overwriteBuffTurns(paramId, turns);
            }
            this._result.pushAddedBuff(paramId);
            this.refresh();
        }
    }

    addDebuff(paramId: RMMZ.ParamID, turns: number): void {
        if (this.isAlive()) {
            this.decreaseBuff(paramId);
            if (this.isDebuffAffected(paramId)) {
                this.overwriteBuffTurns(paramId, turns);
            }
            this._result.pushAddedDebuff(paramId);
            this.refresh();
        }
    }

    removeBuff(paramId: RMMZ.ParamID): void {
        if (this.isAlive() && this.isBuffOrDebuffAffected(paramId)) {
            this.eraseBuff(paramId);
            this._result.pushRemovedBuff(paramId);
            this.refresh();
        }
    }

    removeBattleStates(): void {
        for (const state of this.states()) {
            if (state.removeAtBattleEnd) {
                this.removeState(state.id);
            }
        }
    }

    removeAllBuffs(): void {
        for (let i = 0; i < this.buffLength(); i++) {
            this.removeBuff(i as RMMZ.ParamID);
        }
    }

    removeStatesAuto(timing: RMMZ.AutoRemovalTiming): void {
        for (const state of this.states()) {
            if (this.isStateExpired(state.id) && state.autoRemovalTiming === timing) {
                this.removeState(state.id);
            }
        }
    }

    removeBuffsAuto(): void {
        for (let i = 0; i < this.buffLength(); i++) {
            if (this.isBuffExpired(i as RMMZ.ParamID)) {
                this.removeBuff(i as RMMZ.ParamID);
            }
        }
    }

    removeStatesByDamage(): void {
        for (const state of this.states()) {
            if (state.removeByDamage && Math.randomInt(100) < state.chanceByDamage) {
                this.removeState(state.id);
            }
        }
    }

    makeActionTimes(): number {
        const actionPlusSet = this.actionPlusSet();
        return actionPlusSet.reduce((r, p) => (Math.random() < p ? r + 1 : r), 1);
    }

    makeActions(): void {
        this.clearActions();
        if (this.canMove()) {
            const actionTimes = this.makeActionTimes();
            this._actions = [];
            for (let i = 0; i < actionTimes; i++) {
                this._actions.push(new Game_Action(this));
            }
        }
    }

    speed(): number {
        return this._speed;
    }

    makeSpeed(): void {
        this._speed = Math.min(...this._actions.map((action) => action.speed())) || 0;
    }

    currentAction(): Game_Action {
        return this._actions[0];
    }

    removeCurrentAction(): void {
        this._actions.shift();
    }

    setLastTarget(target: Game_Actor | Game_Enemy): void {
        this._lastTargetIndex = target ? target.index() : 0;
    }

    forceAction(skillId: RMMZ.SkillID, targetIndex: RMMZ.ActorID | RMMZ.EnemyID): void {
        this.clearActions();
        const action = new Game_Action(this, true);
        action.setSkill(skillId);
        if (targetIndex === -2) {
            action.setTarget(this._lastTargetIndex);
        } else if (targetIndex === -1) {
            action.decideRandomTarget();
        } else {
            action.setTarget(targetIndex);
        }
        if (action.item()) {
            this._actions.push(action);
        }
    }

    useItem(item: RMMZ.ActionItem): void {
        if (DataManager.isSkill(item)) {
            this.paySkillCost(item);
        } else if (DataManager.isItem(item)) {
            this.consumeItem(item);
        }
    }

    consumeItem(item: RMMZ.DataItem): void {
        $gameParty.consumeItem(item);
    }

    gainHp(value: number): void {
        this._result.hpDamage = -value;
        this._result.hpAffected = true;
        this.setHp(this.hp + value);
    }

    gainMp(value: number): void {
        this._result.mpDamage = -value;
        this.setMp(this.mp + value);
    }

    gainTp(value: number): void {
        this._result.tpDamage = -value;
        this.setTp(this.tp + value);
    }

    gainSilentTp(value: number): void {
        this.setTp(this.tp + value);
    }

    initTp(): void {
        this.setTp(Math.randomInt(25));
    }

    clearTp(): void {
        this.setTp(0);
    }

    chargeTpByDamage(damageRate: number): void {
        const value = Math.floor(50 * damageRate * this.tcr);
        this.gainSilentTp(value);
    }

    regenerateHp(): void {
        const minRecover = -this.maxSlipDamage();
        const value = Math.max(Math.floor(this.mhp * this.hrg), minRecover);
        if (value !== 0) {
            this.gainHp(value);
        }
    }

    maxSlipDamage(): number {
        return $dataSystem.optSlipDeath ? this.hp : Math.max(this.hp - 1, 0);
    }

    regenerateMp(): void {
        const value = Math.floor(this.mmp * this.mrg);
        if (value !== 0) {
            this.gainMp(value);
        }
    }

    regenerateTp(): void {
        const value = Math.floor(100 * this.trg);
        this.gainSilentTp(value);
    }

    regenerateAll(): void {
        if (this.isAlive()) {
            this.regenerateHp();
            this.regenerateMp();
            this.regenerateTp();
        }
    }

    onBattleStart(advantageous?: boolean): void {
        this.setActionState("undecided");
        this.clearMotion();
        this.initTpbChargeTime(advantageous);
        this.initTpbTurn();
        if (!this.isPreserveTp()) {
            this.initTp();
        }
    }

    onAllActionsEnd(): void {
        this.clearResult();
        this.removeStatesAuto(1);
        this.removeBuffsAuto();
    }

    onTurnEnd(): void {
        this.clearResult();
        this.regenerateAll();
        this.updateStateTurns();
        this.updateBuffTurns();
        this.removeStatesAuto(2);
    }

    onBattleEnd(): void {
        this.clearResult();
        this.removeBattleStates();
        this.removeAllBuffs();
        this.clearActions();
        if (!this.isPreserveTp()) {
            this.clearTp();
        }
        this.appear();
    }

    onDamage(value: number): void {
        this.removeStatesByDamage();
        this.chargeTpByDamage(value / this.mhp);
    }

    setActionState(actionState: RMMZ.ActionState): void {
        this._actionState = actionState;
        this.requestMotionRefresh();
    }

    isUndecided(): boolean {
        return this._actionState === "undecided";
    }

    isInputting(): boolean {
        return this._actionState === "inputting";
    }

    isWaiting(): boolean {
        return this._actionState === "waiting";
    }

    isActing(): boolean {
        return this._actionState === "acting";
    }

    isChanting(): boolean {
        if (this.isWaiting()) {
            return this._actions.some((action) => action.isMagicSkill());
        }
        return false;
    }

    isGuardWaiting(): boolean {
        if (this.isWaiting()) {
            return this._actions.some((action) => action.isGuard());
        }
        return false;
    }

    performActionStart(action: Game_Action): void {
        if (!action.isGuard()) {
            this.setActionState("acting");
        }
    }

    performAction(_action: Game_Action): void {
        //
    }

    performActionEnd(): void {
        //
    }

    performDamage(): void {
        //
    }

    performMiss(): void {
        SoundManager.playMiss();
    }

    performRecovery(): void {
        SoundManager.playRecovery();
    }

    performEvasion(): void {
        SoundManager.playEvasion();
    }

    performMagicEvasion(): void {
        SoundManager.playMagicEvasion();
    }

    performCounter(): void {
        SoundManager.playEvasion();
    }

    performReflection(): void {
        SoundManager.playReflection();
    }

    performSubstitute(_target: Game_Battler): void {
        //
    }

    performCollapse(): void {
        //
    }
}

/**
 * The game object class for an actor.
 */
class Game_Actor extends Game_Battler {
    declare _actorId: number;
    declare _name: string;
    declare _nickname: string;
    declare _classId: number;
    declare _level: number;
    declare _characterName: string;
    declare _characterIndex: number;
    declare _faceName: string;
    declare _faceIndex: number;
    declare _battlerName: string;
    declare _exp: Record<string, number>;
    declare _skills: RMMZ.SkillID[];
    declare _equips: Game_Item<RMMZ.DataEquipment>[];
    declare _actionInputIndex: number;
    declare _lastMenuSkill: Game_Item<RMMZ.DataSkill>;
    declare _lastBattleSkill: Game_Item<RMMZ.DataSkill>;
    declare _lastCommandSymbol: string;
    declare _profile: string;
    declare _stateSteps: Record<string, number>;

    constructor(...args: [actorId: RMMZ.ActorID]) {
        super(...args);
    }

    get level(): number {
        return this._level;
    }

    initialize(actorId: RMMZ.ActorID): void;
    initialize(...args: any[]): void;
    initialize(actorId: RMMZ.ActorID): void {
        super.initialize();
        this.setup(actorId);
    }

    initMembers(): void {
        super.initMembers();

        this._actorId = 0;
        this._name = "";
        this._nickname = "";
        this._classId = 0;
        this._level = 0;
        this._characterName = "";
        this._characterIndex = 0;
        this._faceName = "";
        this._faceIndex = 0;
        this._battlerName = "";
        this._exp = {};
        this._skills = [];
        this._equips = [];
        this._actionInputIndex = 0;
        this._lastMenuSkill = new Game_Item<RMMZ.DataSkill>();
        this._lastBattleSkill = new Game_Item<RMMZ.DataSkill>();
        this._lastCommandSymbol = "";
    }

    setup(actorId: RMMZ.ActorID): void {
        const actor = $dataActors[actorId];
        this._actorId = actorId;
        this._name = actor!.name;
        this._nickname = actor!.nickname;
        this._profile = actor!.profile;
        this._classId = actor!.classId;
        this._level = actor!.initialLevel;
        this.initImages();
        this.initExp();
        this.initSkills();
        this.initEquips(actor!.equips);
        this.clearParamPlus();
        this.recoverAll();
    }

    actorId(): number {
        return this._actorId;
    }

    actor(): RMMZ.DataActor {
        return $dataActors[this._actorId]!;
    }

    name(): string {
        return this._name;
    }

    setName(name: string): void {
        this._name = name;
    }

    nickname(): string {
        return this._nickname;
    }

    setNickname(nickname: string): void {
        this._nickname = nickname;
    }

    profile(): string {
        return this._profile;
    }

    setProfile(profile: string): void {
        this._profile = profile;
    }

    characterName(): string {
        return this._characterName;
    }

    characterIndex(): number {
        return this._characterIndex;
    }

    faceName(): string {
        return this._faceName;
    }

    faceIndex(): number {
        return this._faceIndex;
    }

    battlerName(): string {
        return this._battlerName;
    }

    clearStates(): void {
        super.clearStates();
        this._stateSteps = {};
    }

    eraseState(stateId: RMMZ.StateID): void {
        super.eraseState(stateId);
        delete this._stateSteps[stateId];
    }

    resetStateCounts(stateId: RMMZ.StateID): void {
        super.resetStateCounts(stateId);
        this._stateSteps[stateId] = $dataStates[stateId]!.stepsToRemove;
    }

    initImages(): void {
        const actor = this.actor();
        this._characterName = actor.characterName;
        this._characterIndex = actor.characterIndex;
        this._faceName = actor.faceName;
        this._faceIndex = actor.faceIndex;
        this._battlerName = actor.battlerName;
    }

    expForLevel(level: number): number {
        const c = this.currentClass();
        const basis = c.expParams[0];
        const extra = c.expParams[1];
        const acc_a = c.expParams[2];
        const acc_b = c.expParams[3];
        return Math.round(
            (basis * Math.pow(level - 1, 0.9 + acc_a / 250) * level * (level + 1)) /
                (6 + Math.pow(level, 2) / 50 / acc_b) +
                (level - 1) * extra,
        );
    }

    initExp(): void {
        this._exp[this._classId] = this.currentLevelExp();
    }

    currentExp(): number {
        return this._exp[this._classId];
    }

    currentLevelExp(): number {
        return this.expForLevel(this._level);
    }

    nextLevelExp(): number {
        return this.expForLevel(this._level + 1);
    }

    nextRequiredExp(): number {
        return this.nextLevelExp() - this.currentExp();
    }

    maxLevel(): number {
        return this.actor().maxLevel;
    }

    isMaxLevel(): boolean {
        return this._level >= this.maxLevel();
    }

    initSkills(): void {
        this._skills = [];
        for (const learning of this.currentClass().learnings) {
            if (learning.level <= this._level) {
                this.learnSkill(learning.skillId);
            }
        }
    }

    initEquips(equips: (RMMZ.WeaponID | RMMZ.ArmorID)[]): void {
        const slots = this.equipSlots();
        const maxSlots = slots.length;
        this._equips = [];
        for (let i = 0; i < maxSlots; i++) {
            this._equips[i] = new Game_Item() as Game_Item<RMMZ.DataEquipment>;
        }
        for (let j = 0; j < equips.length; j++) {
            if (j < maxSlots) {
                this._equips[j].setEquip(slots[j] === 1, equips[j]);
            }
        }
        this.releaseUnequippableItems(true);
        this.refresh();
    }

    equipSlots(): number[] {
        const slots = [];
        for (let i = 1; i < $dataSystem.equipTypes.length; i++) {
            slots.push(i);
        }
        if (slots.length >= 2 && this.isDualWield()) {
            slots[1] = 1;
        }
        return slots;
    }

    equips(): RMMZ.DataEquipment[] {
        return this._equips.map((item) => item.object()) as RMMZ.DataEquipment[];
    }

    weapons(): RMMZ.DataWeapon[] {
        return this.equips().filter((item) => item && DataManager.isWeapon(item));
    }

    armors(): RMMZ.DataArmor[] {
        return this.equips().filter((item) => item && DataManager.isArmor(item));
    }

    hasWeapon(weapon: RMMZ.DataWeapon): boolean {
        return this.weapons().includes(weapon);
    }

    hasArmor(armor: RMMZ.DataArmor): boolean {
        return this.armors().includes(armor);
    }

    isEquipChangeOk(slotId: RMMZ.EquipmentSlotID): boolean {
        return !this.isEquipTypeLocked(this.equipSlots()[slotId]) && !this.isEquipTypeSealed(this.equipSlots()[slotId]);
    }

    changeEquip(slotId: RMMZ.EquipmentSlotID, item: RMMZ.DataEquipment | null): void {
        if (
            this.tradeItemWithParty(item, this.equips()[slotId]) &&
            (!item || this.equipSlots()[slotId] === item.etypeId)
        ) {
            this._equips[slotId].setObject(item);
            this.refresh();
        }
    }

    forceChangeEquip(slotId: RMMZ.EquipmentSlotID, item: RMMZ.DataEquipment | null): void {
        this._equips[slotId].setObject(item);
        this.releaseUnequippableItems(true);
        this.refresh();
    }

    tradeItemWithParty(newItem: RMMZ.DataEquipment | null, oldItem: RMMZ.DataEquipment | null): boolean {
        if (newItem && !$gameParty.hasItem(newItem as RMMZ.DatabaseItem)) {
            return false;
        } else {
            $gameParty.gainItem(oldItem as RMMZ.DatabaseItem | null, 1);
            $gameParty.loseItem(newItem as RMMZ.DatabaseItem | null, 1);
            return true;
        }
    }

    changeEquipById(etypeId: RMMZ.EquipmentType, itemId: RMMZ.WeaponID | RMMZ.ArmorID): void {
        const slotId = etypeId - 1;
        if (this.equipSlots()[slotId] === 1) {
            this.changeEquip(slotId, $dataWeapons[itemId]);
        } else {
            this.changeEquip(slotId, $dataArmors[itemId]);
        }
    }

    isEquipped(item: RMMZ.DataEquipment): boolean {
        return this.equips().includes(item);
    }

    discardEquip(item: RMMZ.DataEquipment): void {
        const slotId = this.equips().indexOf(item);
        if (slotId >= 0) {
            this._equips[slotId].setObject(null);
        }
    }

    releaseUnequippableItems(forcing: boolean): void {
        for (;;) {
            const slots = this.equipSlots();
            const equips = this.equips();
            let changed = false;
            for (let i = 0; i < equips.length; i++) {
                const item = equips[i];
                if (item && (!this.canEquip(item as RMMZ.DatabaseItem) || item.etypeId !== slots[i])) {
                    if (!forcing) {
                        this.tradeItemWithParty(null, item);
                    }
                    this._equips[i].setObject(null);
                    changed = true;
                }
            }
            if (!changed) {
                break;
            }
        }
    }

    clearEquipments(): void {
        const maxSlots = this.equipSlots().length;
        for (let i = 0; i < maxSlots; i++) {
            if (this.isEquipChangeOk(i)) {
                this.changeEquip(i, null);
            }
        }
    }

    optimizeEquipments(): void {
        const maxSlots = this.equipSlots().length;
        this.clearEquipments();
        for (let i = 0; i < maxSlots; i++) {
            if (this.isEquipChangeOk(i)) {
                this.changeEquip(i, this.bestEquipItem(i));
            }
        }
    }

    bestEquipItem(slotId: RMMZ.EquipmentSlotID): RMMZ.DataEquipment | null {
        const etypeId = this.equipSlots()[slotId];
        const items = $gameParty.equipItems().filter((item) => item.etypeId === etypeId && this.canEquip(item));
        let bestItem = null;
        let bestPerformance = -1000;
        for (let i = 0; i < items.length; i++) {
            const performance = this.calcEquipItemPerformance(items[i]);
            if (performance > bestPerformance) {
                bestPerformance = performance;
                bestItem = items[i];
            }
        }
        return bestItem;
    }

    calcEquipItemPerformance(item: RMMZ.DataEquipment): number {
        return item.params.reduce((a, b) => a + b);
    }

    isSkillWtypeOk(skill: RMMZ.DataSkill): boolean {
        const wtypeId1 = skill.requiredWtypeId1;
        const wtypeId2 = skill.requiredWtypeId2;
        if (
            (wtypeId1 === 0 && wtypeId2 === 0) ||
            (wtypeId1 > 0 && this.isWtypeEquipped(wtypeId1)) ||
            (wtypeId2 > 0 && this.isWtypeEquipped(wtypeId2))
        ) {
            return true;
        } else {
            return false;
        }
    }

    isWtypeEquipped(wtypeId: RMMZ.WeaponType): boolean {
        return this.weapons().some((weapon) => weapon.wtypeId === wtypeId);
    }

    refresh(): void {
        this.releaseUnequippableItems(false);
        super.refresh();
    }

    hide(): void {
        super.hide();
        $gameTemp.requestBattleRefresh();
    }

    isActor(): this is Game_Actor {
        return true;
    }

    friendsUnit(): Game_Party {
        return $gameParty;
    }

    opponentsUnit(): Game_Troop {
        return $gameTroop;
    }

    index(): number {
        return $gameParty.members().indexOf(this);
    }

    isBattleMember(): boolean {
        return $gameParty.battleMembers().includes(this);
    }

    isFormationChangeOk(): boolean {
        return true;
    }

    currentClass(): RMMZ.DataClass {
        return $dataClasses[this._classId]!;
    }

    isClass(gameClass: RMMZ.DataClass): boolean {
        return gameClass && this._classId === gameClass.id;
    }

    skillTypes(): number[] {
        const skillTypes = this.addedSkillTypes().sort((a, b) => a - b);
        return skillTypes.filter((x, i, self) => self.indexOf(x) === i);
    }

    skills(): RMMZ.DataSkill[] {
        const list: RMMZ.DataSkill[] = [];
        for (const id of this._skills.concat(this.addedSkills())) {
            if (!list.includes($dataSkills[id]!)) {
                list.push($dataSkills[id]!);
            }
        }
        return list;
    }

    usableSkills(): RMMZ.DataSkill[] {
        return this.skills().filter((skill) => this.canUse(skill));
    }

    traitObjects(): {
        traits: RMMZ.Trait[];
    }[] {
        const objects = super.traitObjects();
        objects.push(this.actor(), this.currentClass());
        for (const item of this.equips()) {
            if (item) {
                objects.push(item);
            }
        }
        return objects;
    }

    attackElements(): number[] {
        const set = super.attackElements();
        if (this.hasNoWeapons() && !set.includes(this.bareHandsElementId())) {
            set.push(this.bareHandsElementId());
        }
        return set;
    }

    hasNoWeapons(): boolean {
        return this.weapons().length === 0;
    }

    bareHandsElementId(): number {
        return 1;
    }

    paramBase(paramId: RMMZ.ParamID): number {
        return this.currentClass().params[paramId][this._level];
    }

    paramPlus(paramId: RMMZ.ParamID): number {
        let value = super.paramPlus(paramId);
        for (const item of this.equips()) {
            if (item) {
                value += item.params[paramId];
            }
        }
        return value;
    }

    attackAnimationId1(): number {
        if (this.hasNoWeapons()) {
            return this.bareHandsAnimationId();
        } else {
            const weapons = this.weapons();
            return weapons[0] ? weapons[0].animationId : 0;
        }
    }

    attackAnimationId2(): number {
        const weapons = this.weapons();
        return weapons[1] ? weapons[1].animationId : 0;
    }

    bareHandsAnimationId(): number {
        return 1;
    }

    changeExp(exp: number, show?: boolean): void {
        this._exp[this._classId] = Math.max(exp, 0);
        const lastLevel = this._level;
        const lastSkills = this.skills();
        while (!this.isMaxLevel() && this.currentExp() >= this.nextLevelExp()) {
            this.levelUp();
        }
        while (this.currentExp() < this.currentLevelExp()) {
            this.levelDown();
        }
        if (show && this._level > lastLevel) {
            this.displayLevelUp(this.findNewSkills(lastSkills));
        }
        this.refresh();
    }

    levelUp(): void {
        this._level++;
        for (const learning of this.currentClass().learnings) {
            if (learning.level === this._level) {
                this.learnSkill(learning.skillId);
            }
        }
    }

    levelDown(): void {
        this._level--;
    }

    findNewSkills(lastSkills: RMMZ.DataSkill[]): RMMZ.DataSkill[] {
        const newSkills = this.skills();
        for (const lastSkill of lastSkills) {
            newSkills.remove(lastSkill);
        }
        return newSkills;
    }

    displayLevelUp(newSkills: RMMZ.DataSkill[]): void {
        const text = TextManager.levelUp.format(this._name, TextManager.level, this._level);
        $gameMessage.newPage();
        $gameMessage.add(text);
        for (const skill of newSkills) {
            $gameMessage.add(TextManager.obtainSkill.format(skill.name));
        }
    }

    gainExp(exp: number): void {
        const newExp = this.currentExp() + Math.round(exp * this.finalExpRate());
        this.changeExp(newExp, this.shouldDisplayLevelUp());
    }

    finalExpRate(): number {
        return this.exr * (this.isBattleMember() ? 1 : this.benchMembersExpRate());
    }

    benchMembersExpRate(): 0 | 1 {
        return $dataSystem.optExtraExp ? 1 : 0;
    }

    shouldDisplayLevelUp(): boolean {
        return true;
    }

    changeLevel(level: number, show?: boolean): void {
        level = level.clamp(1, this.maxLevel());
        this.changeExp(this.expForLevel(level), show);
    }

    learnSkill(skillId: RMMZ.SkillID): void {
        if (!this.isLearnedSkill(skillId)) {
            this._skills.push(skillId);
            this._skills.sort((a, b) => a - b);
        }
    }

    forgetSkill(skillId: RMMZ.SkillID): void {
        this._skills.remove(skillId);
    }

    isLearnedSkill(skillId: RMMZ.SkillID): boolean {
        return this._skills.includes(skillId);
    }

    hasSkill(skillId: RMMZ.SkillID): boolean {
        return this.skills().includes($dataSkills[skillId]!);
    }

    changeClass(classId: RMMZ.ClassID, keepExp?: boolean): void {
        if (keepExp) {
            this._exp[classId] = this.currentExp();
        }
        this._classId = classId;
        this._level = 0;
        this.changeExp(this._exp[this._classId] || 0, false);
        this.refresh();
    }

    setCharacterImage(characterName: string, characterIndex: number): void {
        this._characterName = characterName;
        this._characterIndex = characterIndex;
    }

    setFaceImage(faceName: string, faceIndex: number): void {
        this._faceName = faceName;
        this._faceIndex = faceIndex;
        $gameTemp.requestBattleRefresh();
    }

    setBattlerImage(battlerName: string): void {
        this._battlerName = battlerName;
    }

    isSpriteVisible(): boolean {
        return $gameSystem.isSideView();
    }

    performActionStart(action: Game_Action): void {
        super.performActionStart(action);
    }

    performAction(action: Game_Action): void {
        super.performAction(action);
        if (action.isAttack()) {
            this.performAttack();
        } else if (action.isGuard()) {
            this.requestMotion("guard");
        } else if (action.isMagicSkill()) {
            this.requestMotion("spell");
        } else if (action.isSkill()) {
            this.requestMotion("skill");
        } else if (action.isItem()) {
            this.requestMotion("item");
        }
    }

    performActionEnd(): void {
        super.performActionEnd();
    }

    performAttack(): void {
        const weapons = this.weapons();
        const wtypeId = weapons[0] ? weapons[0].wtypeId : 0;
        const attackMotion = $dataSystem.attackMotions[wtypeId];
        if (attackMotion) {
            if (attackMotion.type === 0) {
                this.requestMotion("thrust");
            } else if (attackMotion.type === 1) {
                this.requestMotion("swing");
            } else if (attackMotion.type === 2) {
                this.requestMotion("missile");
            }
            this.startWeaponAnimation(attackMotion.weaponImageId);
        }
    }

    performDamage(): void {
        super.performDamage();
        if (this.isSpriteVisible()) {
            this.requestMotion("damage");
        } else {
            $gameScreen.startShake(5, 5, 10);
        }
        SoundManager.playActorDamage();
    }

    performEvasion(): void {
        super.performEvasion();
        this.requestMotion("evade");
    }

    performMagicEvasion(): void {
        super.performMagicEvasion();
        this.requestMotion("evade");
    }

    performCounter(): void {
        super.performCounter();
        this.performAttack();
    }

    performCollapse(): void {
        super.performCollapse();
        if ($gameParty.inBattle()) {
            SoundManager.playActorCollapse();
        }
    }

    performVictory(): void {
        this.setActionState("done");
        if (this.canMove()) {
            this.requestMotion("victory");
        }
    }

    performEscape(): void {
        if (this.canMove()) {
            this.requestMotion("escape");
        }
    }

    makeActionList(): Game_Action[] {
        const list = [];
        const attackAction = new Game_Action(this);
        attackAction.setAttack();
        list.push(attackAction);
        for (const skill of this.usableSkills()) {
            const skillAction = new Game_Action(this);
            skillAction.setSkill(skill.id);
            list.push(skillAction);
        }
        return list;
    }

    makeAutoBattleActions(): void {
        for (let i = 0; i < this.numActions(); i++) {
            const list = this.makeActionList();
            let maxValue = -Number.MAX_VALUE;
            for (const action of list) {
                const value = action.evaluate();
                if (value > maxValue) {
                    maxValue = value;
                    this.setAction(i, action);
                }
            }
        }
        this.setActionState("waiting");
    }

    makeConfusionActions(): void {
        for (let i = 0; i < this.numActions(); i++) {
            this.action(i).setConfusion();
        }
        this.setActionState("waiting");
    }

    makeActions(): void {
        super.makeActions();
        if (this.numActions() > 0) {
            this.setActionState("undecided");
        } else {
            this.setActionState("waiting");
        }
        if (this.isAutoBattle()) {
            this.makeAutoBattleActions();
        } else if (this.isConfused()) {
            this.makeConfusionActions();
        }
    }

    onPlayerWalk(): void {
        this.clearResult();
        this.checkFloorEffect();
        if ($gamePlayer.isNormal()) {
            this.turnEndOnMap();
            for (const state of this.states()) {
                this.updateStateSteps(state);
            }
            this.showAddedStates();
            this.showRemovedStates();
        }
    }

    updateStateSteps(state: RMMZ.DataState): void {
        if (state.removeByWalking) {
            if (this._stateSteps[state.id] > 0) {
                if (--this._stateSteps[state.id] === 0) {
                    this.removeState(state.id);
                }
            }
        }
    }

    showAddedStates(): void {
        for (const state of this.result().addedStateObjects()) {
            if (state.message1) {
                $gameMessage.add(state.message1.format(this._name));
            }
        }
    }

    showRemovedStates(): void {
        for (const state of this.result().removedStateObjects()) {
            if (state.message4) {
                $gameMessage.add(state.message4.format(this._name));
            }
        }
    }

    stepsForTurn(): number {
        return 20;
    }

    turnEndOnMap(): void {
        if ($gameParty.steps() % this.stepsForTurn() === 0) {
            this.onTurnEnd();
            if (this.result().hpDamage > 0) {
                this.performMapDamage();
            }
        }
    }

    checkFloorEffect(): void {
        if ($gamePlayer.isOnDamageFloor()) {
            this.executeFloorDamage();
        }
    }

    executeFloorDamage(): void {
        const floorDamage = Math.floor(this.basicFloorDamage() * this.fdr);
        const realDamage = Math.min(floorDamage, this.maxFloorDamage());
        this.gainHp(-realDamage);
        if (realDamage > 0) {
            this.performMapDamage();
        }
    }

    basicFloorDamage(): number {
        return 10;
    }

    maxFloorDamage(): number {
        return $dataSystem.optFloorDeath ? this.hp : Math.max(this.hp - 1, 0);
    }

    performMapDamage(): void {
        if (!$gameParty.inBattle()) {
            $gameScreen.startFlashForDamage();
        }
    }

    clearActions(): void {
        super.clearActions();
        this._actionInputIndex = 0;
    }

    inputtingAction(): Game_Action {
        return this.action(this._actionInputIndex);
    }

    selectNextCommand(): boolean {
        if (this._actionInputIndex < this.numActions() - 1) {
            this._actionInputIndex++;
            return true;
        } else {
            return false;
        }
    }

    selectPreviousCommand(): boolean {
        if (this._actionInputIndex > 0) {
            this._actionInputIndex--;
            return true;
        } else {
            return false;
        }
    }

    lastSkill(): RMMZ.DataSkill {
        if ($gameParty.inBattle()) {
            return this.lastBattleSkill();
        } else {
            return this.lastMenuSkill();
        }
    }

    lastMenuSkill(): RMMZ.DataSkill {
        return this._lastMenuSkill.object() as RMMZ.DataSkill;
    }

    setLastMenuSkill(skill: RMMZ.DataSkill | null): void {
        this._lastMenuSkill.setObject(skill);
    }

    lastBattleSkill(): RMMZ.DataSkill {
        return this._lastBattleSkill.object() as RMMZ.DataSkill;
    }

    setLastBattleSkill(skill: RMMZ.DataSkill | null): void {
        this._lastBattleSkill.setObject(skill);
    }

    lastCommandSymbol(): string {
        return this._lastCommandSymbol;
    }

    setLastCommandSymbol(symbol: string): void {
        this._lastCommandSymbol = symbol;
    }

    testEscape(item: RMMZ.DataItem): boolean {
        return item.effects.some((effect) => effect && effect.code === Game_Action.EFFECT_SPECIAL);
    }

    meetsUsableItemConditions(item: RMMZ.DataItem): boolean {
        if ($gameParty.inBattle()) {
            if (!BattleManager.canEscape() && this.testEscape(item)) {
                return false;
            }
        }
        return super.meetsUsableItemConditions(item);
    }

    onEscapeFailure(): void {
        if (BattleManager.isTpb()) {
            this.applyTpbPenalty();
        }
        this.clearActions();
        this.requestMotionRefresh();
    }
}

/**
 * The game object class for an enemy.
 */
class Game_Enemy extends Game_Battler {
    declare _enemyId: number;
    declare _letter: string;
    declare _plural: boolean;
    declare _screenX: number;
    declare _screenY: number;

    constructor(...args: [enemyId: RMMZ.EnemyID, x: number, y: number]) {
        super(...args);
    }

    initialize(enemyId: RMMZ.EnemyID, x: number, y: number): void;
    initialize(...args: any[]): void;
    initialize(enemyId: RMMZ.EnemyID, x: number, y: number): void {
        super.initialize();
        this.setup(enemyId, x, y);
    }

    initMembers(): void {
        super.initMembers();

        this._enemyId = 0;
        this._letter = "";
        this._plural = false;
        this._screenX = 0;
        this._screenY = 0;
    }

    setup(enemyId: RMMZ.EnemyID, x: number, y: number): void {
        this._enemyId = enemyId;
        this._screenX = x;
        this._screenY = y;
        this.recoverAll();
    }

    isEnemy(): this is Game_Enemy {
        return true;
    }

    friendsUnit(): Game_Troop {
        return $gameTroop;
    }

    opponentsUnit(): Game_Party {
        return $gameParty;
    }

    index(): number {
        return $gameTroop.members().indexOf(this);
    }

    isBattleMember(): boolean {
        return this.index() >= 0;
    }

    enemyId(): number {
        return this._enemyId;
    }

    enemy(): RMMZ.DataEnemy {
        return $dataEnemies[this._enemyId]!;
    }

    traitObjects(): {
        traits: RMMZ.Trait[];
    }[] {
        return super.traitObjects().concat(this.enemy());
    }

    paramBase(paramId: RMMZ.ParamID): number {
        return this.enemy().params[paramId];
    }

    exp(): number {
        return this.enemy().exp;
    }

    gold(): number {
        return this.enemy().gold;
    }

    makeDropItems(): RMMZ.InventoryItem[] {
        const rate = this.dropItemRate();
        return this.enemy().dropItems.reduce<RMMZ.InventoryItem[]>((r, di) => {
            if (di.kind > 0 && Math.random() * di.denominator < rate) {
                return r.concat(this.itemObject(di.kind, di.dataId)!);
            } else {
                return r;
            }
        }, []);
    }

    dropItemRate(): 1 | 2 {
        return $gameParty.hasDropItemDouble() ? 2 : 1;
    }

    itemObject(kind: RMMZ.DropItemType, dataId: RMMZ.DataID): RMMZ.DataItem | RMMZ.DataWeapon | RMMZ.DataArmor | null {
        if (kind === 1) {
            return $dataItems[dataId];
        } else if (kind === 2) {
            return $dataWeapons[dataId];
        } else if (kind === 3) {
            return $dataArmors[dataId];
        } else {
            return null;
        }
    }

    isSpriteVisible(): boolean {
        return true;
    }

    screenX(): number {
        return this._screenX;
    }

    screenY(): number {
        return this._screenY;
    }

    battlerName(): string {
        return this.enemy().battlerName;
    }

    battlerHue(): number {
        return this.enemy().battlerHue;
    }

    originalName(): string {
        return this.enemy().name;
    }

    name(): string {
        return this.originalName() + (this._plural ? this._letter : "");
    }

    isLetterEmpty(): boolean {
        return this._letter === "";
    }

    setLetter(letter: string): void {
        this._letter = letter;
    }

    setPlural(plural: boolean): void {
        this._plural = plural;
    }

    performActionStart(action: Game_Action): void {
        super.performActionStart(action);
        this.requestEffect("whiten");
    }

    performAction(action: Game_Action): void {
        super.performAction(action);
    }

    performActionEnd(): void {
        super.performActionEnd();
    }

    performDamage(): void {
        super.performDamage();
        SoundManager.playEnemyDamage();
        this.requestEffect("blink");
    }

    performCollapse(): void {
        super.performCollapse();
        switch (this.collapseType()) {
            case 0:
                this.requestEffect("collapse");
                SoundManager.playEnemyCollapse();
                break;
            case 1:
                this.requestEffect("bossCollapse");
                SoundManager.playBossCollapse1();
                break;
            case 2:
                this.requestEffect("instantCollapse");
                break;
        }
    }

    transform(enemyId: RMMZ.EnemyID): void {
        const name = this.originalName();
        this._enemyId = enemyId;
        if (this.originalName() !== name) {
            this._letter = "";
            this._plural = false;
        }
        this.refresh();
        if (this.numActions() > 0) {
            this.makeActions();
        }
    }

    meetsCondition(action: RMMZ.EnemyAction): boolean {
        const param1 = action.conditionParam1;
        const param2 = action.conditionParam2;
        switch (action.conditionType) {
            case 1:
                return this.meetsTurnCondition(param1, param2);
            case 2:
                return this.meetsHpCondition(param1, param2);
            case 3:
                return this.meetsMpCondition(param1, param2);
            case 4:
                return this.meetsStateCondition(param1);
            case 5:
                return this.meetsPartyLevelCondition(param1);
            case 6:
                return this.meetsSwitchCondition(param1);
            default:
                return true;
        }
    }

    meetsTurnCondition(param1: number, param2: number): boolean {
        const n = this.turnCount();
        if (param2 === 0) {
            return n === param1;
        } else {
            return n > 0 && n >= param1 && n % param2 === param1 % param2;
        }
    }

    meetsHpCondition(param1: number, param2: number): boolean {
        return this.hpRate() >= param1 && this.hpRate() <= param2;
    }

    meetsMpCondition(param1: number, param2: number): boolean {
        return this.mpRate() >= param1 && this.mpRate() <= param2;
    }

    meetsStateCondition(param: RMMZ.StateID): boolean {
        return this.isStateAffected(param);
    }

    meetsPartyLevelCondition(param: number): boolean {
        return $gameParty.highestLevel() >= param;
    }

    meetsSwitchCondition(param: RMMZ.SwitchID): boolean {
        return $gameSwitches.value(param);
    }

    isActionValid(action: RMMZ.EnemyAction): boolean {
        return this.meetsCondition(action) && this.canUse($dataSkills[action.skillId]);
    }

    selectAction(actionList: RMMZ.EnemyAction[], ratingZero: number): RMMZ.EnemyAction | null | undefined {
        const sum = actionList.reduce((r, a) => r + a.rating - ratingZero, 0);
        if (sum > 0) {
            let value = Math.randomInt(sum);
            for (const action of actionList) {
                value -= action.rating - ratingZero;
                if (value < 0) {
                    return action;
                }
            }
        } else {
            return null;
        }
    }

    selectAllActions(actionList: RMMZ.EnemyAction[]): void {
        const ratingMax = Math.max(...actionList.map((a) => a.rating));
        const ratingZero = ratingMax - 3;
        actionList = actionList.filter((a) => a.rating > ratingZero);
        for (let i = 0; i < this.numActions(); i++) {
            this.action(i).setEnemyAction(this.selectAction(actionList, ratingZero));
        }
    }

    makeActions(): void {
        super.makeActions();
        if (this.numActions() > 0) {
            const actionList = this.enemy().actions.filter((a) => this.isActionValid(a));
            if (actionList.length > 0) {
                this.selectAllActions(actionList);
            }
        }
        this.setActionState("waiting");
    }
}

/**
 * The wrapper class for an actor array.
 */
class Game_Actors {
    declare _data: Game_Actor[];

    constructor(...args: any[]) {
        this.initialize(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        this._data = [];
    }

    actor(actorId: RMMZ.ActorID): Game_Actor | null {
        if ($dataActors[actorId]) {
            if (!this._data[actorId]) {
                this._data[actorId] = new Game_Actor(actorId);
            }
            return this._data[actorId];
        }
        return null;
    }
}

/**
 * The superclass of Game_Party and Game_Troop.
 */
class Game_Unit<T extends Game_Battler = Game_Battler> {
    declare _inBattle: boolean;

    constructor(...args: any[]) {
        this.initialize(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        this._inBattle = false;
    }

    inBattle(): boolean {
        return this._inBattle;
    }

    members(): T[] {
        return [];
    }

    aliveMembers(): T[] {
        return this.members().filter((member) => member.isAlive());
    }

    deadMembers(): T[] {
        return this.members().filter((member) => member.isDead());
    }

    movableMembers(): T[] {
        return this.members().filter((member) => member.canMove());
    }

    clearActions(): void {
        for (const member of this.members()) {
            member.clearActions();
        }
    }

    agility(): number {
        const members = this.members();
        const sum = members.reduce((r, member) => r + member.agi, 0);
        return Math.max(1, sum / Math.max(1, members.length));
    }

    tgrSum(): number {
        return this.aliveMembers().reduce((r, member) => r + member.tgr, 0);
    }

    randomTarget(): T | null {
        let tgrRand = Math.random() * this.tgrSum();
        let target = null;
        for (const member of this.aliveMembers()) {
            tgrRand -= member.tgr;
            if (tgrRand <= 0 && !target) {
                target = member;
            }
        }
        return target;
    }

    randomDeadTarget(): T | null {
        const members = this.deadMembers();
        return members.length ? members[Math.randomInt(members.length)] : null;
    }

    smoothTarget(index: number): T {
        const member = this.members()[Math.max(0, index)];
        return member && member.isAlive() ? member : this.aliveMembers()[0];
    }

    smoothDeadTarget(index: number): T {
        const member = this.members()[Math.max(0, index)];
        return member && member.isDead() ? member : this.deadMembers()[0];
    }

    clearResults(): void {
        for (const member of this.members()) {
            member.clearResult();
        }
    }

    onBattleStart(advantageous: boolean): void {
        for (const member of this.members()) {
            member.onBattleStart(advantageous);
        }
        this._inBattle = true;
    }

    onBattleEnd(): void {
        this._inBattle = false;
        for (const member of this.members()) {
            member.onBattleEnd();
        }
    }

    makeActions(): void {
        for (const member of this.members()) {
            member.makeActions();
        }
    }

    select(activeMember: T | null): void {
        for (const member of this.members()) {
            if (member === activeMember) {
                member.select();
            } else {
                member.deselect();
            }
        }
    }

    isAllDead(): boolean {
        return this.aliveMembers().length === 0;
    }

    substituteBattler(target: T): T | null {
        for (const member of this.members()) {
            if (member.isSubstitute() && member !== target) {
                return member;
            }
        }
        return null;
    }

    tpbBaseSpeed(): number {
        const members = this.members();
        return Math.max(...members.map((member) => member.tpbBaseSpeed()));
    }

    tpbReferenceTime(): 60 | 240 {
        return BattleManager.isActiveTpb() ? 240 : 60;
    }

    updateTpb(): void {
        for (const member of this.members()) {
            member.updateTpb();
        }
    }
}

/**
 * The game object class for the party. Information such as gold and items is
 * included.
 */
class Game_Party extends Game_Unit<Game_Actor> {
    declare _gold: number;
    declare _steps: number;
    declare _lastItem: Game_Item<RMMZ.InventoryItem>;
    declare _menuActorId: number;
    declare _targetActorId: number;
    declare _actors: RMMZ.ActorID[];
    declare _items: Record<string, number>;
    declare _weapons: Record<string, number>;
    declare _armors: Record<string, number>;

    constructor(...args: []) {
        super(...args);
    }

    static readonly ABILITY_ENCOUNTER_HALF = 0;

    static readonly ABILITY_ENCOUNTER_NONE = 1;

    static readonly ABILITY_CANCEL_SURPRISE = 2;

    static readonly ABILITY_RAISE_PREEMPTIVE = 3;

    static readonly ABILITY_GOLD_DOUBLE = 4;

    static readonly ABILITY_DROP_ITEM_DOUBLE = 5;

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();

        this._gold = 0;
        this._steps = 0;
        this._lastItem = new Game_Item();
        this._menuActorId = 0;
        this._targetActorId = 0;
        this._actors = [];
        this.initAllItems();
    }

    initAllItems(): void {
        this._items = {};
        this._weapons = {};
        this._armors = {};
    }

    exists(): boolean {
        return this._actors.length > 0;
    }

    size(): number {
        return this.members().length;
    }

    isEmpty(): boolean {
        return this.size() === 0;
    }

    members(): Game_Actor[] {
        return this.inBattle() ? this.battleMembers() : this.allMembers();
    }

    allMembers(): Game_Actor[] {
        return this._actors.map((id) => $gameActors.actor(id)) as Game_Actor[];
    }

    battleMembers(): Game_Actor[] {
        return this.allBattleMembers().filter((actor) => actor.isAppeared());
    }

    hiddenBattleMembers(): Game_Actor[] {
        return this.allBattleMembers().filter((actor) => actor.isHidden());
    }

    allBattleMembers(): Game_Actor[] {
        return this.allMembers().slice(0, this.maxBattleMembers());
    }

    maxBattleMembers(): number {
        return 4;
    }

    leader(): Game_Actor {
        return this.battleMembers()[0];
    }

    removeInvalidMembers(): void {
        for (const actorId of this._actors) {
            if (!$dataActors[Number(actorId)]) {
                this._actors.remove(actorId);
            }
        }
    }

    reviveBattleMembers(): void {
        for (const actor of this.battleMembers()) {
            if (actor.isDead()) {
                actor.setHp(1);
            }
        }
    }

    items(): RMMZ.DataItem[] {
        return Object.keys(this._items).map((id) => $dataItems[Number(id)]!);
    }

    weapons(): RMMZ.DataWeapon[] {
        return Object.keys(this._weapons).map((id) => $dataWeapons[Number(id)]!);
    }

    armors(): RMMZ.DataArmor[] {
        return Object.keys(this._armors).map((id) => $dataArmors[Number(id)]!);
    }

    equipItems(): (RMMZ.DataWeapon | RMMZ.DataArmor)[] {
        return [...this.weapons(), ...this.armors()];
    }

    allItems(): RMMZ.InventoryItem[] {
        return [...this.items(), ...this.equipItems()];
    }

    itemContainer(item: RMMZ.DatabaseItem | null): Record<string, number> | null {
        if (!item) {
            return null;
        } else if (DataManager.isItem(item)) {
            return this._items;
        } else if (DataManager.isWeapon(item)) {
            return this._weapons;
        } else if (DataManager.isArmor(item)) {
            return this._armors;
        } else {
            return null;
        }
    }

    setupStartingMembers(): void {
        this._actors = [];
        for (const actorId of $dataSystem.partyMembers) {
            if ($gameActors.actor(actorId)) {
                this._actors.push(actorId);
            }
        }
    }

    name(): string {
        const numBattleMembers = this.battleMembers().length;
        if (numBattleMembers === 0) {
            return "";
        } else if (numBattleMembers === 1) {
            return this.leader().name();
        } else {
            return TextManager.partyName.format(this.leader().name());
        }
    }

    setupBattleTest(): void {
        this.setupBattleTestMembers();
        this.setupBattleTestItems();
    }

    setupBattleTestMembers(): void {
        for (const battler of $dataSystem.testBattlers) {
            const actor = $gameActors.actor(battler.actorId);
            if (actor) {
                actor.changeLevel(battler.level, false);
                actor.initEquips(battler.equips);
                actor.recoverAll();
                this.addActor(battler.actorId);
            }
        }
    }

    setupBattleTestItems(): void {
        for (const item of $dataItems) {
            if (item && item.name.length > 0) {
                this.gainItem(item, this.maxItems(item));
            }
        }
    }

    highestLevel(): number {
        return Math.max(...this.members().map((actor) => actor.level));
    }

    addActor(actorId: RMMZ.ActorID): void {
        if (!this._actors.includes(actorId)) {
            this._actors.push(actorId);
            $gamePlayer.refresh();
            $gameMap.requestRefresh();
            $gameTemp.requestBattleRefresh();
            if (this.inBattle()) {
                const actor = $gameActors.actor(actorId);
                if (this.battleMembers().includes(actor!)) {
                    actor!.onBattleStart();
                }
            }
        }
    }

    removeActor(actorId: RMMZ.ActorID): void {
        if (this._actors.includes(actorId)) {
            const actor = $gameActors.actor(actorId);
            const wasBattleMember = this.battleMembers().includes(actor!);
            this._actors.remove(actorId);
            $gamePlayer.refresh();
            $gameMap.requestRefresh();
            $gameTemp.requestBattleRefresh();
            if (this.inBattle() && wasBattleMember) {
                actor!.onBattleEnd();
            }
        }
    }

    gold(): number {
        return this._gold;
    }

    gainGold(amount: number): void {
        this._gold = (this._gold + amount).clamp(0, this.maxGold());
    }

    loseGold(amount: number): void {
        this.gainGold(-amount);
    }

    maxGold(): number {
        return 99999999;
    }

    steps(): number {
        return this._steps;
    }

    increaseSteps(): void {
        this._steps++;
    }

    numItems(item: RMMZ.DatabaseItem | null): number {
        const container = this.itemContainer(item);
        return container ? container[item!.id] || 0 : 0;
    }

    maxItems(_item: RMMZ.DataItem | RMMZ.DataWeapon | RMMZ.DataArmor | null): number {
        return 99;
    }

    hasMaxItems(item: RMMZ.DatabaseItem): boolean {
        return this.numItems(item) >= this.maxItems(item! as RMMZ.DataItem | RMMZ.DataWeapon | RMMZ.DataArmor | null);
    }

    hasItem(item: RMMZ.DatabaseItem, includeEquip?: boolean): boolean {
        if (this.numItems(item) > 0) {
            return true;
        } else if (includeEquip && this.isAnyMemberEquipped(item as RMMZ.DataEquipment)) {
            return true;
        } else {
            return false;
        }
    }

    isAnyMemberEquipped(item: RMMZ.DataEquipment): boolean {
        return this.members().some((actor) => actor.equips().includes(item));
    }

    gainItem(item: RMMZ.DatabaseItem | null, amount: number, includeEquip?: boolean): void {
        const container = this.itemContainer(item);
        if (container) {
            const lastNumber = this.numItems(item);
            const newNumber = lastNumber + amount;
            container[item!.id] = newNumber.clamp(
                0,
                this.maxItems(item! as RMMZ.DataItem | RMMZ.DataWeapon | RMMZ.DataArmor | null),
            );
            if (container[item!.id] === 0) {
                delete container[item!.id];
            }
            if (includeEquip && newNumber < 0) {
                this.discardMembersEquip(item! as RMMZ.DataEquipment, -newNumber);
            }
            $gameMap.requestRefresh();
        }
    }

    discardMembersEquip(item: RMMZ.DataEquipment, amount: number): void {
        let n = amount;
        for (const actor of this.members()) {
            while (n > 0 && actor.isEquipped(item)) {
                actor.discardEquip(item);
                n--;
            }
        }
    }

    loseItem(item: RMMZ.DatabaseItem | null, amount: number, includeEquip?: boolean): void {
        this.gainItem(item, -amount, includeEquip);
    }

    consumeItem(item: RMMZ.DatabaseItem): void {
        if (DataManager.isItem(item) && item.consumable) {
            this.loseItem(item, 1);
        }
    }

    canUse(item: RMMZ.DatabaseItem | null): boolean {
        return this.members().some((actor) => actor.canUse(item));
    }

    canInput(): boolean {
        return this.members().some((actor) => actor.canInput());
    }

    isAllDead(): boolean {
        if (super.isAllDead()) {
            return this.inBattle() || !this.isEmpty();
        } else {
            return false;
        }
    }

    isEscaped(): boolean {
        return this.isAllDead() && this.hiddenBattleMembers().length > 0;
    }

    onPlayerWalk(): void {
        for (const actor of this.members()) {
            actor.onPlayerWalk();
        }
    }

    menuActor(): Game_Actor {
        let actor = $gameActors.actor(this._menuActorId);
        if (!this.members().includes(actor!)) {
            actor = this.members()[0];
        }
        return actor!;
    }

    setMenuActor(actor: Game_Actor): void {
        this._menuActorId = actor.actorId();
    }

    makeMenuActorNext(): void {
        let index = this.members().indexOf(this.menuActor());
        if (index >= 0) {
            index = (index + 1) % this.members().length;
            this.setMenuActor(this.members()[index]);
        } else {
            this.setMenuActor(this.members()[0]);
        }
    }

    makeMenuActorPrevious(): void {
        let index = this.members().indexOf(this.menuActor());
        if (index >= 0) {
            index = (index + this.members().length - 1) % this.members().length;
            this.setMenuActor(this.members()[index]);
        } else {
            this.setMenuActor(this.members()[0]);
        }
    }

    targetActor(): Game_Actor {
        let actor = $gameActors.actor(this._targetActorId);
        if (!this.members().includes(actor!)) {
            actor = this.members()[0];
        }
        return actor!;
    }

    setTargetActor(actor: Game_Actor): void {
        this._targetActorId = actor.actorId();
    }

    lastItem(): RMMZ.InventoryItem | null {
        return this._lastItem.object()!;
    }

    setLastItem(item: RMMZ.InventoryItem | null): void {
        this._lastItem.setObject(item);
    }

    swapOrder(index1: RMMZ.ActorID, index2: RMMZ.ActorID): void {
        const temp = this._actors[index1];
        this._actors[index1] = this._actors[index2];
        this._actors[index2] = temp;
        $gamePlayer.refresh();
    }

    charactersForSavefile(): [string, number][] {
        return this.battleMembers().map((actor) => [actor.characterName(), actor.characterIndex()]);
    }

    facesForSavefile(): [string, number][] {
        return this.battleMembers().map((actor) => [actor.faceName(), actor.faceIndex()]);
    }

    partyAbility(abilityId: RMMZ.DataID): boolean {
        return this.battleMembers().some((actor) => actor.partyAbility(abilityId));
    }

    hasEncounterHalf(): boolean {
        return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_HALF);
    }

    hasEncounterNone(): boolean {
        return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_NONE);
    }

    hasCancelSurprise(): boolean {
        return this.partyAbility(Game_Party.ABILITY_CANCEL_SURPRISE);
    }

    hasRaisePreemptive(): boolean {
        return this.partyAbility(Game_Party.ABILITY_RAISE_PREEMPTIVE);
    }

    hasGoldDouble(): boolean {
        return this.partyAbility(Game_Party.ABILITY_GOLD_DOUBLE);
    }

    hasDropItemDouble(): boolean {
        return this.partyAbility(Game_Party.ABILITY_DROP_ITEM_DOUBLE);
    }

    ratePreemptive(troopAgi: number): number {
        let rate = this.agility() >= troopAgi ? 0.05 : 0.03;
        if (this.hasRaisePreemptive()) {
            rate *= 4;
        }
        return rate;
    }

    rateSurprise(troopAgi: number): number {
        let rate = this.agility() >= troopAgi ? 0.03 : 0.05;
        if (this.hasCancelSurprise()) {
            rate = 0;
        }
        return rate;
    }

    performVictory(): void {
        for (const actor of this.members()) {
            actor.performVictory();
        }
    }

    performEscape(): void {
        for (const actor of this.members()) {
            actor.performEscape();
        }
    }

    removeBattleStates(): void {
        for (const actor of this.members()) {
            actor.removeBattleStates();
        }
    }

    requestMotionRefresh(): void {
        for (const actor of this.members()) {
            actor.requestMotionRefresh();
        }
    }

    onEscapeFailure(): void {
        for (const actor of this.members()) {
            actor.onEscapeFailure();
        }
    }
}

/**
 * The game object class for a troop and the battle-related data.
 */
class Game_Troop extends Game_Unit<Game_Enemy> {
    declare _interpreter: Game_Interpreter;
    declare _troopId: number;
    declare _eventFlags: Record<string, boolean>;
    declare _enemies: any[];
    declare _turnCount: number;
    declare _namesCount: Record<string, number>;

    constructor(...args: []) {
        super(...args);
    }

    // prettier-ignore

    static LETTER_TABLE_HALF: string[] = [
        " A"," B"," C"," D"," E"," F"," G"," H"," I"," J"," K"," L"," M",
        " N"," O"," P"," Q"," R"," S"," T"," U"," V"," W"," X"," Y"," Z"
    ];

    // prettier-ignore

    static LETTER_TABLE_FULL: string[] = [
        "Ａ","Ｂ","Ｃ","Ｄ","Ｅ","Ｆ","Ｇ","Ｈ","Ｉ","Ｊ","Ｋ","Ｌ","Ｍ",
        "Ｎ","Ｏ","Ｐ","Ｑ","Ｒ","Ｓ","Ｔ","Ｕ","Ｖ","Ｗ","Ｘ","Ｙ","Ｚ"
    ];

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();

        this._interpreter = new Game_Interpreter();
        this.clear();
    }

    isEventRunning(): boolean {
        return this._interpreter.isRunning();
    }

    updateInterpreter(): void {
        this._interpreter.update();
    }

    turnCount(): number {
        return this._turnCount;
    }

    members(): Game_Enemy[] {
        return this._enemies;
    }

    clear(): void {
        this._interpreter.clear();
        this._troopId = 0;
        this._eventFlags = {};
        this._enemies = [];
        this._turnCount = 0;
        this._namesCount = {};
    }

    troop(): RMMZ.DataTroop {
        return $dataTroops[this._troopId]!;
    }

    setup(troopId: RMMZ.TroopID): void {
        this.clear();
        this._troopId = troopId;
        this._enemies = [];
        for (const member of this.troop().members) {
            if ($dataEnemies[member.enemyId]) {
                const enemyId = member.enemyId;
                const x = member.x;
                const y = member.y;
                const enemy = new Game_Enemy(enemyId, x, y);
                if (member.hidden) {
                    enemy.hide();
                }
                this._enemies.push(enemy);
            }
        }
        this.makeUniqueNames();
    }

    makeUniqueNames(): void {
        const table = this.letterTable();
        for (const enemy of this.members()) {
            if (enemy.isAlive() && enemy.isLetterEmpty()) {
                const name = enemy.originalName();
                const n = this._namesCount[name] || 0;
                enemy.setLetter(table[n % table.length]);
                this._namesCount[name] = n + 1;
            }
        }
        this.updatePluralFlags();
    }

    updatePluralFlags(): void {
        for (const enemy of this.members()) {
            const name = enemy.originalName();
            if (this._namesCount[name] >= 2) {
                enemy.setPlural(true);
            }
        }
    }

    letterTable(): string[] {
        return $gameSystem.isCJK() ? Game_Troop.LETTER_TABLE_FULL : Game_Troop.LETTER_TABLE_HALF;
    }

    enemyNames(): string[] {
        const names: string[] = [];
        for (const enemy of this.members()) {
            const name = enemy.originalName();
            if (enemy.isAlive() && !names.includes(name)) {
                names.push(name);
            }
        }
        return names;
    }

    meetsConditions(page: RMMZ.DataTroopPage): boolean {
        const c = page.conditions;
        if (!c.turnEnding && !c.turnValid && !c.enemyValid && !c.actorValid && !c.switchValid) {
            return false; // Conditions not set
        }
        if (c.turnEnding) {
            if (!BattleManager.isTurnEnd()) {
                return false;
            }
        }
        if (c.turnValid) {
            const n = this._turnCount;
            const a = c.turnA;
            const b = c.turnB;
            if (b === 0 && n !== a) {
                return false;
            }
            if (b > 0 && (n < 1 || n < a || n % b !== a % b)) {
                return false;
            }
        }
        if (c.enemyValid) {
            const enemy = $gameTroop.members()[c.enemyIndex];
            if (!enemy || enemy.hpRate() * 100 > c.enemyHp) {
                return false;
            }
        }
        if (c.actorValid) {
            const actor = $gameActors.actor(c.actorId);
            if (!actor || actor.hpRate() * 100 > c.actorHp) {
                return false;
            }
        }
        if (c.switchValid) {
            if (!$gameSwitches.value(c.switchId)) {
                return false;
            }
        }
        return true;
    }

    setupBattleEvent(): void {
        if (!this._interpreter.isRunning()) {
            if (this._interpreter.setupReservedCommonEvent()) {
                return;
            }
            const pages = this.troop().pages;
            for (let i = 0; i < pages.length; i++) {
                const page = pages[i];
                if (this.meetsConditions(page) && !this._eventFlags[i]) {
                    this._interpreter.setup(page.list);
                    if (page.span <= 1) {
                        this._eventFlags[i] = true;
                    }
                    break;
                }
            }
        }
    }

    increaseTurn(): void {
        const pages = this.troop().pages;
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            if (page.span === 1) {
                this._eventFlags[i] = false;
            }
        }
        this._turnCount++;
    }

    expTotal(): number {
        return this.deadMembers().reduce((r, enemy) => r + enemy.exp(), 0);
    }

    goldTotal(): number {
        const members = this.deadMembers();
        return members.reduce((r, enemy) => r + enemy.gold(), 0) * this.goldRate();
    }

    goldRate(): 1 | 2 {
        return $gameParty.hasGoldDouble() ? 2 : 1;
    }

    makeDropItems(): RMMZ.InventoryItem[] {
        const members = this.deadMembers();
        return members.reduce<RMMZ.InventoryItem[]>((r, enemy) => r.concat(enemy.makeDropItems()), []);
    }

    isTpbTurnEnd(): boolean {
        const members = this.members();
        const turnMax = Math.max(...members.map((member) => member.turnCount()));
        return turnMax > this._turnCount;
    }
}

/**
 * The game object class for a map. It contains scrolling and passage
 * determination functions.
 */
class Game_Map {
    declare _interpreter: Game_Interpreter;
    declare _mapId: number;
    declare _tilesetId: number;
    declare _events: Game_Event[];
    declare _commonEvents: Game_CommonEvent[];
    declare _vehicles: Game_Vehicle[];
    declare _displayX: number;
    declare _displayY: number;
    declare _nameDisplay: boolean;
    declare _scrollDirection: RMMZ.Direction;
    declare _scrollRest: number;
    declare _scrollSpeed: number;
    declare _parallaxName: string;
    declare _parallaxZero: boolean;
    declare _parallaxLoopX: boolean;
    declare _parallaxLoopY: boolean;
    declare _parallaxSx: number;
    declare _parallaxSy: number;
    declare _parallaxX: number;
    declare _parallaxY: number;
    declare _battleback1Name: string | null;
    declare _battleback2Name: string | null;
    declare _needsRefresh: boolean;
    declare _tileEvents: Game_Event[];

    constructor(...args: []) {
        this.initialize(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        this._interpreter = new Game_Interpreter();
        this._mapId = 0;
        this._tilesetId = 0;
        this._events = [];
        this._commonEvents = [];
        this._vehicles = [];
        this._displayX = 0;
        this._displayY = 0;
        this._nameDisplay = true;
        this._scrollDirection = 2;
        this._scrollRest = 0;
        this._scrollSpeed = 4;
        this._parallaxName = "";
        this._parallaxZero = false;
        this._parallaxLoopX = false;
        this._parallaxLoopY = false;
        this._parallaxSx = 0;
        this._parallaxSy = 0;
        this._parallaxX = 0;
        this._parallaxY = 0;
        this._battleback1Name = null;
        this._battleback2Name = null;
        this.createVehicles();
    }

    setup(mapId: RMMZ.MapID): void {
        if (!$dataMap) {
            throw new Error("The map data is not available");
        }
        this._mapId = mapId;
        this._tilesetId = $dataMap.tilesetId;
        this._displayX = 0;
        this._displayY = 0;
        this.refereshVehicles();
        this.setupEvents();
        this.setupScroll();
        this.setupParallax();
        this.setupBattleback();
        this._needsRefresh = false;
    }

    isEventRunning(): boolean {
        return this._interpreter.isRunning() || this.isAnyEventStarting();
    }

    tileWidth(): number {
        if ("tileSize" in $dataSystem) {
            return $dataSystem.tileSize!;
        } else {
            return 48;
        }
    }

    tileHeight(): number {
        return this.tileWidth();
    }

    bushDepth(): number {
        return this.tileHeight() / 4;
    }

    mapId(): number {
        return this._mapId;
    }

    tilesetId(): number {
        return this._tilesetId;
    }

    displayX(): number {
        return this._displayX;
    }

    displayY(): number {
        return this._displayY;
    }

    parallaxName(): string {
        return this._parallaxName;
    }

    battleback1Name(): string | null {
        return this._battleback1Name;
    }

    battleback2Name(): string | null {
        return this._battleback2Name;
    }

    requestRefresh(): void {
        this._needsRefresh = true;
    }

    isNameDisplayEnabled(): boolean {
        return this._nameDisplay;
    }

    disableNameDisplay(): void {
        this._nameDisplay = false;
    }

    enableNameDisplay(): void {
        this._nameDisplay = true;
    }

    createVehicles(): void {
        this._vehicles = [];
        this._vehicles[0] = new Game_Vehicle("boat");
        this._vehicles[1] = new Game_Vehicle("ship");
        this._vehicles[2] = new Game_Vehicle("airship");
    }

    refereshVehicles(): void {
        for (const vehicle of this._vehicles) {
            vehicle.refresh();
        }
    }

    vehicles(): Game_Vehicle[] {
        return this._vehicles;
    }

    vehicle(type: number | RMMZ.VehicleType): Game_Vehicle | null {
        if (type === 0 || type === "boat") {
            return this.boat();
        } else if (type === 1 || type === "ship") {
            return this.ship();
        } else if (type === 2 || type === "airship") {
            return this.airship();
        } else {
            return null;
        }
    }

    boat(): Game_Vehicle {
        return this._vehicles[0];
    }

    ship(): Game_Vehicle {
        return this._vehicles[1];
    }

    airship(): Game_Vehicle {
        return this._vehicles[2];
    }

    setupEvents(): void {
        this._events = [];
        this._commonEvents = [];
        for (const event of $dataMap.events.filter((event) => !!event)) {
            this._events[event.id] = new Game_Event(this._mapId, event.id);
        }
        for (const commonEvent of this.parallelCommonEvents()) {
            this._commonEvents.push(new Game_CommonEvent(commonEvent.id));
        }
        this.refreshTileEvents();
    }

    events(): Game_Event[] {
        return this._events.filter((event) => !!event);
    }

    event(eventId: RMMZ.EventID): Game_Event {
        return this._events[eventId];
    }

    eraseEvent(eventId: RMMZ.EventID): void {
        this._events[eventId].erase();
    }

    autorunCommonEvents(): RMMZ.DataCommonEvent[] {
        return $dataCommonEvents.filter(
            (commonEvent) => commonEvent && commonEvent.trigger === 1,
        ) as RMMZ.DataCommonEvent[];
    }

    parallelCommonEvents(): RMMZ.DataCommonEvent[] {
        return $dataCommonEvents.filter(
            (commonEvent) => commonEvent && commonEvent.trigger === 2,
        ) as RMMZ.DataCommonEvent[];
    }

    setupScroll(): void {
        this._scrollDirection = 2;
        this._scrollRest = 0;
        this._scrollSpeed = 4;
    }

    setupParallax(): void {
        this._parallaxName = $dataMap.parallaxName || "";
        this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
        this._parallaxLoopX = $dataMap.parallaxLoopX;
        this._parallaxLoopY = $dataMap.parallaxLoopY;
        this._parallaxSx = $dataMap.parallaxSx;
        this._parallaxSy = $dataMap.parallaxSy;
        this._parallaxX = 0;
        this._parallaxY = 0;
    }

    setupBattleback(): void {
        if ($dataMap.specifyBattleback) {
            this._battleback1Name = $dataMap.battleback1Name;
            this._battleback2Name = $dataMap.battleback2Name;
        } else {
            this._battleback1Name = null;
            this._battleback2Name = null;
        }
    }

    setDisplayPos(x: number, y: number): void {
        if (this.isLoopHorizontal()) {
            this._displayX = x.mod(this.width());
            this._parallaxX = x;
        } else {
            const endX = this.width() - this.screenTileX();
            this._displayX = endX < 0 ? endX / 2 : x.clamp(0, endX);
            this._parallaxX = this._displayX;
        }
        if (this.isLoopVertical()) {
            this._displayY = y.mod(this.height());
            this._parallaxY = y;
        } else {
            const endY = this.height() - this.screenTileY();
            this._displayY = endY < 0 ? endY / 2 : y.clamp(0, endY);
            this._parallaxY = this._displayY;
        }
    }

    parallaxOx(): number {
        if (this._parallaxZero) {
            return this._parallaxX * this.tileWidth();
        } else if (this._parallaxLoopX) {
            return (this._parallaxX * this.tileWidth()) / 2;
        } else {
            return 0;
        }
    }

    parallaxOy(): number {
        if (this._parallaxZero) {
            return this._parallaxY * this.tileHeight();
        } else if (this._parallaxLoopY) {
            return (this._parallaxY * this.tileHeight()) / 2;
        } else {
            return 0;
        }
    }

    tileset(): RMMZ.DataTileset {
        return $dataTilesets[this._tilesetId]!;
    }

    tilesetFlags(): number[] {
        const tileset = this.tileset();
        if (tileset) {
            return tileset.flags;
        } else {
            return [];
        }
    }

    displayName(): string {
        return $dataMap.displayName;
    }

    width(): number {
        return $dataMap.width;
    }

    height(): number {
        return $dataMap.height;
    }

    data(): number[] {
        return $dataMap.data;
    }

    isLoopHorizontal(): boolean {
        return $dataMap.scrollType === 2 || $dataMap.scrollType === 3;
    }

    isLoopVertical(): boolean {
        return $dataMap.scrollType === 1 || $dataMap.scrollType === 3;
    }

    isDashDisabled(): boolean {
        return $dataMap.disableDashing;
    }

    encounterList(): RMMZ.DataEncounter[] {
        return $dataMap.encounterList;
    }

    encounterStep(): number {
        return $dataMap.encounterStep;
    }

    isOverworld(): boolean {
        return this.tileset() && this.tileset().mode === 0;
    }

    screenTileX(): number {
        return Math.round((Graphics.width / this.tileWidth()) * 16) / 16;
    }

    screenTileY(): number {
        return Math.round((Graphics.height / this.tileHeight()) * 16) / 16;
    }

    adjustX(x: number): number {
        if (this.isLoopHorizontal() && x < this._displayX - (this.width() - this.screenTileX()) / 2) {
            return x - this._displayX + $dataMap.width;
        } else {
            return x - this._displayX;
        }
    }

    adjustY(y: number): number {
        if (this.isLoopVertical() && y < this._displayY - (this.height() - this.screenTileY()) / 2) {
            return y - this._displayY + $dataMap.height;
        } else {
            return y - this._displayY;
        }
    }

    roundX(x: number): number {
        return this.isLoopHorizontal() ? x.mod(this.width()) : x;
    }

    roundY(y: number): number {
        return this.isLoopVertical() ? y.mod(this.height()) : y;
    }

    xWithDirection(x: number, d: RMMZ.Direction): number {
        return x + (d === 6 ? 1 : d === 4 ? -1 : 0);
    }

    yWithDirection(y: number, d: RMMZ.Direction): number {
        return y + (d === 2 ? 1 : d === 8 ? -1 : 0);
    }

    roundXWithDirection(x: number, d: RMMZ.Direction): number {
        return this.roundX(x + (d === 6 ? 1 : d === 4 ? -1 : 0));
    }

    roundYWithDirection(y: number, d: RMMZ.Direction): number {
        return this.roundY(y + (d === 2 ? 1 : d === 8 ? -1 : 0));
    }

    deltaX(x1: number, x2: number): number {
        let result = x1 - x2;
        if (this.isLoopHorizontal() && Math.abs(result) > this.width() / 2) {
            if (result < 0) {
                result += this.width();
            } else {
                result -= this.width();
            }
        }
        return result;
    }

    deltaY(y1: number, y2: number): number {
        let result = y1 - y2;
        if (this.isLoopVertical() && Math.abs(result) > this.height() / 2) {
            if (result < 0) {
                result += this.height();
            } else {
                result -= this.height();
            }
        }
        return result;
    }

    distance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.abs(this.deltaX(x1, x2)) + Math.abs(this.deltaY(y1, y2));
    }

    canvasToMapX(x: number): number {
        const tileWidth = this.tileWidth();
        const originX = this._displayX * tileWidth;
        const mapX = Math.floor((originX + x) / tileWidth);
        return this.roundX(mapX);
    }

    canvasToMapY(y: number): number {
        const tileHeight = this.tileHeight();
        const originY = this._displayY * tileHeight;
        const mapY = Math.floor((originY + y) / tileHeight);
        return this.roundY(mapY);
    }

    autoplay(): void {
        if ($dataMap.autoplayBgm) {
            if ($gamePlayer.isInVehicle()) {
                $gameSystem.saveWalkingBgm2();
            } else {
                AudioManager.playBgm($dataMap.bgm);
            }
        }
        if ($dataMap.autoplayBgs) {
            AudioManager.playBgs($dataMap.bgs);
        }
    }

    refreshIfNeeded(): void {
        if (this._needsRefresh) {
            this.refresh();
        }
    }

    refresh(): void {
        for (const event of this.events()) {
            event.refresh();
        }
        for (const commonEvent of this._commonEvents) {
            commonEvent.refresh();
        }
        this.refreshTileEvents();
        this._needsRefresh = false;
    }

    refreshTileEvents(): void {
        this._tileEvents = this.events().filter((event) => event.isTile());
    }

    eventsXy(x: number, y: number): Game_Event[] {
        return this.events().filter((event) => event.pos(x, y));
    }

    eventsXyNt(x: number, y: number): Game_Event[] {
        return this.events().filter((event) => event.posNt(x, y));
    }

    tileEventsXy(x: number, y: number): Game_Event[] {
        return this._tileEvents.filter((event) => event.posNt(x, y));
    }

    eventIdXy(x: number, y: number): number {
        const list = this.eventsXy(x, y);
        return list.length === 0 ? 0 : list[0].eventId();
    }

    scrollDown(distance: number): void {
        if (this.isLoopVertical()) {
            this._displayY += distance;
            this._displayY %= $dataMap.height;
            if (this._parallaxLoopY) {
                this._parallaxY += distance;
            }
        } else if (this.height() >= this.screenTileY()) {
            const lastY = this._displayY;
            this._displayY = Math.min(this._displayY + distance, this.height() - this.screenTileY());
            this._parallaxY += this._displayY - lastY;
        }
    }

    scrollLeft(distance: number): void {
        if (this.isLoopHorizontal()) {
            this._displayX += $dataMap.width - distance;
            this._displayX %= $dataMap.width;
            if (this._parallaxLoopX) {
                this._parallaxX -= distance;
            }
        } else if (this.width() >= this.screenTileX()) {
            const lastX = this._displayX;
            this._displayX = Math.max(this._displayX - distance, 0);
            this._parallaxX += this._displayX - lastX;
        }
    }

    scrollRight(distance: number): void {
        if (this.isLoopHorizontal()) {
            this._displayX += distance;
            this._displayX %= $dataMap.width;
            if (this._parallaxLoopX) {
                this._parallaxX += distance;
            }
        } else if (this.width() >= this.screenTileX()) {
            const lastX = this._displayX;
            this._displayX = Math.min(this._displayX + distance, this.width() - this.screenTileX());
            this._parallaxX += this._displayX - lastX;
        }
    }

    scrollUp(distance: number): void {
        if (this.isLoopVertical()) {
            this._displayY += $dataMap.height - distance;
            this._displayY %= $dataMap.height;
            if (this._parallaxLoopY) {
                this._parallaxY -= distance;
            }
        } else if (this.height() >= this.screenTileY()) {
            const lastY = this._displayY;
            this._displayY = Math.max(this._displayY - distance, 0);
            this._parallaxY += this._displayY - lastY;
        }
    }

    isValid(x: number, y: number): boolean {
        return x >= 0 && x < this.width() && y >= 0 && y < this.height();
    }

    checkPassage(x: number, y: number, bit: number): boolean {
        const flags = this.tilesetFlags();
        const tiles = this.allTiles(x, y);
        for (const tile of tiles) {
            const flag = flags[tile];
            if ((flag & 0x10) !== 0) {
                // [*] No effect on passage
                continue;
            }
            if ((flag & bit) === 0) {
                // [o] Passable
                return true;
            }
            if ((flag & bit) === bit) {
                // [x] Impassable
                return false;
            }
        }
        return false;
    }

    tileId(x: number, y: number, z: number): number {
        const width = $dataMap.width;
        const height = $dataMap.height;
        return $dataMap.data[(z * height + y) * width + x] || 0;
    }

    layeredTiles(x: number, y: number): number[] {
        const tiles = [];
        for (let i = 0; i < 4; i++) {
            tiles.push(this.tileId(x, y, 3 - i));
        }
        return tiles;
    }

    allTiles(x: number, y: number): number[] {
        const tiles = this.tileEventsXy(x, y).map((event) => event.tileId());
        return tiles.concat(this.layeredTiles(x, y));
    }

    autotileType(x: number, y: number, z: number): number {
        const tileId = this.tileId(x, y, z);
        return tileId >= 2048 ? Math.floor((tileId - 2048) / 48) : -1;
    }

    isPassable(x: number, y: number, d: RMMZ.Direction): boolean {
        return this.checkPassage(x, y, (1 << (d / 2 - 1)) & 0x0f);
    }

    isBoatPassable(x: number, y: number): boolean {
        return this.checkPassage(x, y, 0x0200);
    }

    isShipPassable(x: number, y: number): boolean {
        return this.checkPassage(x, y, 0x0400);
    }

    isAirshipLandOk(x: number, y: number): boolean {
        return this.checkPassage(x, y, 0x0800) && this.checkPassage(x, y, 0x0f);
    }

    checkLayeredTilesFlags(x: number, y: number, bit: number): boolean {
        const flags = this.tilesetFlags();
        return this.layeredTiles(x, y).some((tileId) => (flags[tileId] & bit) !== 0);
    }

    isLadder(x: number, y: number): boolean {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x20);
    }

    isBush(x: number, y: number): boolean {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x40);
    }

    isCounter(x: number, y: number): boolean {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x80);
    }

    isDamageFloor(x: number, y: number): boolean {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x100);
    }

    terrainTag(x: number, y: number): number {
        if (this.isValid(x, y)) {
            const flags = this.tilesetFlags();
            const tiles = this.layeredTiles(x, y);
            for (const tile of tiles) {
                const tag = flags[tile] >> 12;
                if (tag > 0) {
                    return tag;
                }
            }
        }
        return 0;
    }

    regionId(x: number, y: number): number {
        return this.isValid(x, y) ? this.tileId(x, y, 5) : 0;
    }

    startScroll(direction: RMMZ.Direction, distance: number, speed: number): void {
        this._scrollDirection = direction;
        this._scrollRest = distance;
        this._scrollSpeed = speed;
    }

    isScrolling(): boolean {
        return this._scrollRest > 0;
    }

    update(sceneActive: boolean): void {
        this.refreshIfNeeded();
        if (sceneActive) {
            this.updateInterpreter();
        }
        this.updateScroll();
        this.updateEvents();
        this.updateVehicles();
        this.updateParallax();
    }

    updateScroll(): void {
        if (this.isScrolling()) {
            const lastX = this._displayX;
            const lastY = this._displayY;
            this.doScroll(this._scrollDirection, this.scrollDistance());
            if (this._displayX === lastX && this._displayY === lastY) {
                this._scrollRest = 0;
            } else {
                this._scrollRest -= this.scrollDistance();
            }
        }
    }

    scrollDistance(): number {
        return Math.pow(2, this._scrollSpeed) / 256;
    }

    doScroll(direction: RMMZ.Direction, distance: number): void {
        switch (direction) {
            case 2:
                this.scrollDown(distance);
                break;
            case 4:
                this.scrollLeft(distance);
                break;
            case 6:
                this.scrollRight(distance);
                break;
            case 8:
                this.scrollUp(distance);
                break;
        }
    }

    updateEvents(): void {
        for (const event of this.events()) {
            event.update();
        }
        for (const commonEvent of this._commonEvents) {
            commonEvent.update();
        }
    }

    updateVehicles(): void {
        for (const vehicle of this._vehicles) {
            vehicle.update();
        }
    }

    updateParallax(): void {
        if (this._parallaxLoopX) {
            this._parallaxX += this._parallaxSx / this.tileWidth() / 2;
        }
        if (this._parallaxLoopY) {
            this._parallaxY += this._parallaxSy / this.tileHeight() / 2;
        }
    }

    changeTileset(tilesetId: number): void {
        this._tilesetId = tilesetId;
        this.refresh();
    }

    changeBattleback(battleback1Name: string | null, battleback2Name: string | null): void {
        this._battleback1Name = battleback1Name;
        this._battleback2Name = battleback2Name;
    }

    changeParallax(name: string, loopX: boolean, loopY: boolean, sx: number, sy: number): void {
        this._parallaxName = name;
        this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
        if (this._parallaxLoopX && !loopX) {
            this._parallaxX = 0;
        }
        if (this._parallaxLoopY && !loopY) {
            this._parallaxY = 0;
        }
        this._parallaxLoopX = loopX;
        this._parallaxLoopY = loopY;
        this._parallaxSx = sx;
        this._parallaxSy = sy;
    }

    updateInterpreter(): void {
        for (;;) {
            this._interpreter.update();
            if (this._interpreter.isRunning()) {
                return;
            }
            if (this._interpreter.eventId() > 0) {
                this.unlockEvent(this._interpreter.eventId());
                this._interpreter.clear();
            }
            if (!this.setupStartingEvent()) {
                return;
            }
        }
    }

    unlockEvent(eventId: RMMZ.EventID): void {
        if (this._events[eventId]) {
            this._events[eventId].unlock();
        }
    }

    setupStartingEvent(): boolean {
        this.refreshIfNeeded();
        if (this._interpreter.setupReservedCommonEvent()) {
            return true;
        }
        if (this.setupTestEvent()) {
            return true;
        }
        if (this.setupStartingMapEvent()) {
            return true;
        }
        if (this.setupAutorunCommonEvent()) {
            return true;
        }
        return false;
    }

    setupTestEvent(): boolean {
        if (window.$testEvent) {
            this._interpreter.setup($testEvent!, 0);
            $testEvent = null;
            return true;
        }
        return false;
    }

    setupStartingMapEvent(): boolean {
        for (const event of this.events()) {
            if (event.isStarting()) {
                event.clearStartingFlag();
                this._interpreter.setup(event.list(), event.eventId());
                return true;
            }
        }
        return false;
    }

    setupAutorunCommonEvent(): boolean {
        for (const commonEvent of this.autorunCommonEvents()) {
            if ($gameSwitches.value(commonEvent.switchId)) {
                this._interpreter.setup(commonEvent.list);
                return true;
            }
        }
        return false;
    }

    isAnyEventStarting(): boolean {
        return this.events().some((event) => event.isStarting());
    }
}

/**
 * The game object class for a common event. It contains functionality for
 * running parallel process events.
 */
class Game_CommonEvent {
    declare _commonEventId: number;
    declare _interpreter: Game_Interpreter | null;

    constructor(...args: [commonEventId: RMMZ.CommonEventID]) {
        this.initialize(...args);
    }

    initialize(commonEventId: RMMZ.CommonEventID): void;
    initialize(...args: any[]): void;
    initialize(commonEventId: RMMZ.CommonEventID): void {
        this._commonEventId = commonEventId;
        this.refresh();
    }

    event(): RMMZ.DataCommonEvent {
        return $dataCommonEvents[this._commonEventId]!;
    }

    list(): RMMZ.DataCommand[] {
        return this.event().list;
    }

    refresh(): void {
        if (this.isActive()) {
            if (!this._interpreter) {
                this._interpreter = new Game_Interpreter();
            }
        } else {
            this._interpreter = null;
        }
    }

    isActive(): boolean {
        const event = this.event();
        return event.trigger === 2 && $gameSwitches.value(event.switchId);
    }

    update(): void {
        if (this._interpreter) {
            if (!this._interpreter.isRunning()) {
                this._interpreter.setup(this.list());
            }
            this._interpreter.update();
        }
    }
}

/**
 * The superclass of Game_Character. It handles basic information, such as
 * coordinates and images, shared by all characters.
 */
class Game_CharacterBase {
    declare _x: number;
    declare _y: number;
    declare _realX: number;
    declare _realY: number;
    declare _moveSpeed: number;
    declare _moveFrequency: number;
    declare _opacity: number;
    declare _blendMode: RMMZ.BlendMode;
    declare _direction: RMMZ.Direction;
    declare _pattern: number;
    declare _priorityType: RMMZ.PriorityType;
    declare _tileId: number;
    declare _characterName: string;
    declare _characterIndex: number;
    declare _isObjectCharacter: boolean;
    declare _walkAnime: boolean;
    declare _stepAnime: boolean;
    declare _directionFix: boolean;
    declare _through: boolean;
    declare _transparent: boolean;
    declare _bushDepth: number;
    declare _animationId: number;
    declare _balloonId: number;
    declare _animationPlaying: boolean;
    declare _balloonPlaying: boolean;
    declare _animationCount: number;
    declare _stopCount: number;
    declare _jumpCount: number;
    declare _jumpPeak: number;
    declare _movementSuccess: boolean;

    constructor(...args: []) {
        this.initialize(...args);
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    initialize(..._args: any[]): void;
    initialize(...args: any[]): void;
    initialize(..._args: any[]): void {
        this.initMembers();
    }

    initMembers(): void {
        this._x = 0;
        this._y = 0;
        this._realX = 0;
        this._realY = 0;
        this._moveSpeed = 4;
        this._moveFrequency = 6;
        this._opacity = 255;
        this._blendMode = 0 as RMMZ.BlendMode;
        this._direction = 2;
        this._pattern = 1;
        this._priorityType = 1;
        this._tileId = 0;
        this._characterName = "";
        this._characterIndex = 0;
        this._isObjectCharacter = false;
        this._walkAnime = true;
        this._stepAnime = false;
        this._directionFix = false;
        this._through = false;
        this._transparent = false;
        this._bushDepth = 0;
        this._animationId = 0;
        this._balloonId = 0;
        this._animationPlaying = false;
        this._balloonPlaying = false;
        this._animationCount = 0;
        this._stopCount = 0;
        this._jumpCount = 0;
        this._jumpPeak = 0;
        this._movementSuccess = true;
    }

    pos(x: number, y: number): boolean {
        return this._x === x && this._y === y;
    }

    posNt(x: number, y: number): boolean {
        // No through
        return this.pos(x, y) && !this.isThrough();
    }

    moveSpeed(): number {
        return this._moveSpeed;
    }

    setMoveSpeed(moveSpeed: number): void {
        this._moveSpeed = moveSpeed;
    }

    moveFrequency(): number {
        return this._moveFrequency;
    }

    setMoveFrequency(moveFrequency: number): void {
        this._moveFrequency = moveFrequency;
    }

    opacity(): number {
        return this._opacity;
    }

    setOpacity(opacity: number): void {
        this._opacity = opacity;
    }

    blendMode(): RMMZ.BlendMode {
        return this._blendMode;
    }

    setBlendMode(blendMode: RMMZ.BlendMode): void {
        this._blendMode = blendMode;
    }

    isNormalPriority(): boolean {
        return this._priorityType === 1;
    }

    setPriorityType(priorityType: RMMZ.PriorityType): void {
        this._priorityType = priorityType;
    }

    isMoving(): boolean {
        return this._realX !== this._x || this._realY !== this._y;
    }

    isJumping(): boolean {
        return this._jumpCount > 0;
    }

    jumpHeight(): number {
        return (this._jumpPeak * this._jumpPeak - Math.pow(Math.abs(this._jumpCount - this._jumpPeak), 2)) / 2;
    }

    isStopping(): boolean {
        return !this.isMoving() && !this.isJumping();
    }

    checkStop(threshold: number): boolean {
        return this._stopCount > threshold;
    }

    resetStopCount(): void {
        this._stopCount = 0;
    }

    realMoveSpeed(): number {
        return this._moveSpeed + (this.isDashing() ? 1 : 0);
    }

    distancePerFrame(): number {
        return Math.pow(2, this.realMoveSpeed()) / 256;
    }

    isDashing(): boolean {
        return false;
    }

    isDebugThrough(): boolean {
        return false;
    }

    straighten(): void {
        if (this.hasWalkAnime() || this.hasStepAnime()) {
            this._pattern = 1;
        }
        this._animationCount = 0;
    }

    reverseDir(d: RMMZ.Direction): RMMZ.Direction {
        return (10 - d) as RMMZ.Direction;
    }

    canPass(x: number, y: number, d: RMMZ.Direction): boolean {
        const x2 = $gameMap.roundXWithDirection(x, d);
        const y2 = $gameMap.roundYWithDirection(y, d);
        if (!$gameMap.isValid(x2, y2)) {
            return false;
        }
        if (this.isThrough() || this.isDebugThrough()) {
            return true;
        }
        if (!this.isMapPassable(x, y, d)) {
            return false;
        }
        if (this.isCollidedWithCharacters(x2, y2)) {
            return false;
        }
        return true;
    }

    canPassDiagonally(x: number, y: number, horz: RMMZ.Direction, vert: RMMZ.Direction): boolean {
        const x2 = $gameMap.roundXWithDirection(x, horz);
        const y2 = $gameMap.roundYWithDirection(y, vert);
        if (this.canPass(x, y, vert) && this.canPass(x, y2, horz)) {
            return true;
        }
        if (this.canPass(x, y, horz) && this.canPass(x2, y, vert)) {
            return true;
        }
        return false;
    }

    isMapPassable(x: number, y: number, d: RMMZ.Direction): boolean {
        const x2 = $gameMap.roundXWithDirection(x, d);
        const y2 = $gameMap.roundYWithDirection(y, d);
        const d2 = this.reverseDir(d);
        return $gameMap.isPassable(x, y, d) && $gameMap.isPassable(x2, y2, d2);
    }

    isCollidedWithCharacters(x: number, y: number): boolean {
        return this.isCollidedWithEvents(x, y) || this.isCollidedWithVehicles(x, y);
    }

    isCollidedWithEvents(x: number, y: number): boolean {
        const events = $gameMap.eventsXyNt(x, y);
        return events.some((event) => event.isNormalPriority());
    }

    isCollidedWithVehicles(x: number, y: number): boolean {
        return $gameMap.boat().posNt(x, y) || $gameMap.ship().posNt(x, y);
    }

    setPosition(x: number, y: number): void {
        this._x = Math.round(x);
        this._y = Math.round(y);
        this._realX = x;
        this._realY = y;
    }

    copyPosition(character: Game_CharacterBase): void {
        this._x = character._x;
        this._y = character._y;
        this._realX = character._realX;
        this._realY = character._realY;
        this._direction = character._direction;
    }

    locate(x: number, y: number): void {
        this.setPosition(x, y);
        this.straighten();
        this.refreshBushDepth();
    }

    direction(): RMMZ.Direction {
        return this._direction;
    }

    setDirection(d?: RMMZ.Direction | 0): void {
        if (!this.isDirectionFixed() && d) {
            this._direction = d;
        }
        this.resetStopCount();
    }

    isTile(): boolean {
        return this._tileId > 0 && this._priorityType === 0;
    }

    isObjectCharacter(): boolean {
        return this._isObjectCharacter;
    }

    shiftY(): 0 | 6 {
        return this.isObjectCharacter() ? 0 : 6;
    }

    scrolledX(): number {
        return $gameMap.adjustX(this._realX);
    }

    scrolledY(): number {
        return $gameMap.adjustY(this._realY);
    }

    screenX(): number {
        const tw = $gameMap.tileWidth();
        return Math.floor(this.scrolledX() * tw + tw / 2);
    }

    screenY(): number {
        const th = $gameMap.tileHeight();
        return Math.floor(this.scrolledY() * th + th - this.shiftY() - this.jumpHeight());
    }

    screenZ(): number {
        return this._priorityType * 2 + 1;
    }

    isNearTheScreen(): boolean {
        const gw = Graphics.width;
        const gh = Graphics.height;
        const tw = $gameMap.tileWidth();
        const th = $gameMap.tileHeight();
        const px = this.scrolledX() * tw + tw / 2 - gw / 2;
        const py = this.scrolledY() * th + th / 2 - gh / 2;
        return px >= -gw && px <= gw && py >= -gh && py <= gh;
    }

    update(): void {
        if (this.isStopping()) {
            this.updateStop();
        }
        if (this.isJumping()) {
            this.updateJump();
        } else if (this.isMoving()) {
            this.updateMove();
        }
        this.updateAnimation();
    }

    updateStop(): void {
        this._stopCount++;
    }

    updateJump(): void {
        this._jumpCount--;
        this._realX = (this._realX * this._jumpCount + this._x) / (this._jumpCount + 1.0);
        this._realY = (this._realY * this._jumpCount + this._y) / (this._jumpCount + 1.0);
        this.refreshBushDepth();
        if (this._jumpCount === 0) {
            this._realX = this._x = $gameMap.roundX(this._x);
            this._realY = this._y = $gameMap.roundY(this._y);
        }
    }

    updateMove(): void {
        if (this._x < this._realX) {
            this._realX = Math.max(this._realX - this.distancePerFrame(), this._x);
        }
        if (this._x > this._realX) {
            this._realX = Math.min(this._realX + this.distancePerFrame(), this._x);
        }
        if (this._y < this._realY) {
            this._realY = Math.max(this._realY - this.distancePerFrame(), this._y);
        }
        if (this._y > this._realY) {
            this._realY = Math.min(this._realY + this.distancePerFrame(), this._y);
        }
        if (!this.isMoving()) {
            this.refreshBushDepth();
        }
    }

    updateAnimation(): void {
        this.updateAnimationCount();
        if (this._animationCount >= this.animationWait()) {
            this.updatePattern();
            this._animationCount = 0;
        }
    }

    animationWait(): number {
        return (9 - this.realMoveSpeed()) * 3;
    }

    updateAnimationCount(): void {
        if (this.isMoving() && this.hasWalkAnime()) {
            this._animationCount += 1.5;
        } else if (this.hasStepAnime() || !this.isOriginalPattern()) {
            this._animationCount++;
        }
    }

    updatePattern(): void {
        if (!this.hasStepAnime() && this._stopCount > 0) {
            this.resetPattern();
        } else {
            this._pattern = (this._pattern + 1) % this.maxPattern();
        }
    }

    maxPattern(): number {
        return 4;
    }

    pattern(): number {
        return this._pattern < 3 ? this._pattern : 1;
    }

    setPattern(pattern: number): void {
        this._pattern = pattern;
    }

    isOriginalPattern(): boolean {
        return this.pattern() === 1;
    }

    resetPattern(): void {
        this.setPattern(1);
    }

    refreshBushDepth(): void {
        if (this.isNormalPriority() && !this.isObjectCharacter() && this.isOnBush() && !this.isJumping()) {
            if (!this.isMoving()) {
                this._bushDepth = $gameMap.bushDepth();
            }
        } else {
            this._bushDepth = 0;
        }
    }

    isOnLadder(): boolean {
        return $gameMap.isLadder(this._x, this._y);
    }

    isOnBush(): boolean {
        return $gameMap.isBush(this._x, this._y);
    }

    terrainTag(): number {
        return $gameMap.terrainTag(this._x, this._y);
    }

    regionId(): number {
        return $gameMap.regionId(this._x, this._y);
    }

    increaseSteps(): void {
        if (this.isOnLadder()) {
            this.setDirection(8);
        }
        this.resetStopCount();
        this.refreshBushDepth();
    }

    tileId(): number {
        return this._tileId;
    }

    characterName(): string {
        return this._characterName;
    }

    characterIndex(): number {
        return this._characterIndex;
    }

    setImage(characterName: string, characterIndex: number): void {
        this._tileId = 0;
        this._characterName = characterName;
        this._characterIndex = characterIndex;
        this._isObjectCharacter = ImageManager.isObjectCharacter(characterName);
    }

    setTileImage(tileId: RMMZ.TileID): void {
        this._tileId = tileId;
        this._characterName = "";
        this._characterIndex = 0;
        this._isObjectCharacter = true;
    }

    checkEventTriggerTouchFront(d: RMMZ.Direction): void {
        const x2 = $gameMap.roundXWithDirection(this._x, d);
        const y2 = $gameMap.roundYWithDirection(this._y, d);
        this.checkEventTriggerTouch(x2, y2);
    }

    checkEventTriggerTouch(_x: number, _y: number): boolean | void {
        return false;
    }

    isMovementSucceeded(/*x, y*/): boolean {
        return this._movementSuccess;
    }

    setMovementSuccess(success: boolean): void {
        this._movementSuccess = success;
    }

    moveStraight(d: RMMZ.Direction): void {
        this.setMovementSuccess(this.canPass(this._x, this._y, d));
        if (this.isMovementSucceeded()) {
            this.setDirection(d);
            this._x = $gameMap.roundXWithDirection(this._x, d);
            this._y = $gameMap.roundYWithDirection(this._y, d);
            this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(d));
            this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(d));
            this.increaseSteps();
        } else {
            this.setDirection(d);
            this.checkEventTriggerTouchFront(d);
        }
    }

    moveDiagonally(horz: RMMZ.Direction, vert: RMMZ.Direction): void {
        this.setMovementSuccess(this.canPassDiagonally(this._x, this._y, horz, vert));
        if (this.isMovementSucceeded()) {
            this._x = $gameMap.roundXWithDirection(this._x, horz);
            this._y = $gameMap.roundYWithDirection(this._y, vert);
            this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(horz));
            this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(vert));
            this.increaseSteps();
        }
        if (this._direction === this.reverseDir(horz)) {
            this.setDirection(horz);
        }
        if (this._direction === this.reverseDir(vert)) {
            this.setDirection(vert);
        }
    }

    jump(xPlus: number, yPlus: number): void {
        if (Math.abs(xPlus) > Math.abs(yPlus)) {
            if (xPlus !== 0) {
                this.setDirection(xPlus < 0 ? 4 : 6);
            }
        } else {
            if (yPlus !== 0) {
                this.setDirection(yPlus < 0 ? 8 : 2);
            }
        }
        this._x += xPlus;
        this._y += yPlus;
        const distance = Math.round(Math.sqrt(xPlus * xPlus + yPlus * yPlus));
        this._jumpPeak = 10 + distance - this._moveSpeed;
        this._jumpCount = this._jumpPeak * 2;
        this.resetStopCount();
        this.straighten();
    }

    hasWalkAnime(): boolean {
        return this._walkAnime;
    }

    setWalkAnime(walkAnime: boolean): void {
        this._walkAnime = walkAnime;
    }

    hasStepAnime(): boolean {
        return this._stepAnime;
    }

    setStepAnime(stepAnime: boolean): void {
        this._stepAnime = stepAnime;
    }

    isDirectionFixed(): boolean {
        return this._directionFix;
    }

    setDirectionFix(directionFix: boolean): void {
        this._directionFix = directionFix;
    }

    isThrough(): boolean {
        return this._through;
    }

    setThrough(through: boolean): void {
        this._through = through;
    }

    isTransparent(): boolean {
        return this._transparent;
    }

    bushDepth(): number {
        return this._bushDepth;
    }

    setTransparent(transparent: boolean): void {
        this._transparent = transparent;
    }

    startAnimation(): void {
        this._animationPlaying = true;
    }

    startBalloon(): void {
        this._balloonPlaying = true;
    }

    isAnimationPlaying(): boolean {
        return this._animationPlaying;
    }

    isBalloonPlaying(): boolean {
        return this._balloonPlaying;
    }

    endAnimation(): void {
        this._animationPlaying = false;
    }

    endBalloon(): void {
        this._balloonPlaying = false;
    }
}

/**
 * The superclass of Game_Player, Game_Follower, GameVehicle, and Game_Event.
 */
class Game_Character extends Game_CharacterBase {
    declare _moveRouteForcing: boolean;
    declare _moveRoute: RMMZ.MoveRoute | null;
    declare _moveRouteIndex: number;
    declare _originalMoveRoute: RMMZ.MoveRoute | null;
    declare _originalMoveRouteIndex: number;
    declare _waitCount: number;

    constructor(..._extra: any[]);
    constructor(...args: []) {
        super(...args);
    }

    static readonly ROUTE_END = 0;

    static readonly ROUTE_MOVE_DOWN = 1;

    static readonly ROUTE_MOVE_LEFT = 2;

    static readonly ROUTE_MOVE_RIGHT = 3;

    static readonly ROUTE_MOVE_UP = 4;

    static readonly ROUTE_MOVE_LOWER_L = 5;

    static readonly ROUTE_MOVE_LOWER_R = 6;

    static readonly ROUTE_MOVE_UPPER_L = 7;

    static readonly ROUTE_MOVE_UPPER_R = 8;

    static readonly ROUTE_MOVE_RANDOM = 9;

    static readonly ROUTE_MOVE_TOWARD = 10;

    static readonly ROUTE_MOVE_AWAY = 11;

    static readonly ROUTE_MOVE_FORWARD = 12;

    static readonly ROUTE_MOVE_BACKWARD = 13;

    static readonly ROUTE_JUMP = 14;

    static readonly ROUTE_WAIT = 15;

    static readonly ROUTE_TURN_DOWN = 16;

    static readonly ROUTE_TURN_LEFT = 17;

    static readonly ROUTE_TURN_RIGHT = 18;

    static readonly ROUTE_TURN_UP = 19;

    static readonly ROUTE_TURN_90D_R = 20;

    static readonly ROUTE_TURN_90D_L = 21;

    static readonly ROUTE_TURN_180D = 22;

    static readonly ROUTE_TURN_90D_R_L = 23;

    static readonly ROUTE_TURN_RANDOM = 24;

    static readonly ROUTE_TURN_TOWARD = 25;

    static readonly ROUTE_TURN_AWAY = 26;

    static readonly ROUTE_SWITCH_ON = 27;

    static readonly ROUTE_SWITCH_OFF = 28;

    static readonly ROUTE_CHANGE_SPEED = 29;

    static readonly ROUTE_CHANGE_FREQ = 30;

    static readonly ROUTE_WALK_ANIME_ON = 31;

    static readonly ROUTE_WALK_ANIME_OFF = 32;

    static readonly ROUTE_STEP_ANIME_ON = 33;

    static readonly ROUTE_STEP_ANIME_OFF = 34;

    static readonly ROUTE_DIR_FIX_ON = 35;

    static readonly ROUTE_DIR_FIX_OFF = 36;

    static readonly ROUTE_THROUGH_ON = 37;

    static readonly ROUTE_THROUGH_OFF = 38;

    static readonly ROUTE_TRANSPARENT_ON = 39;

    static readonly ROUTE_TRANSPARENT_OFF = 40;

    static readonly ROUTE_CHANGE_IMAGE = 41;

    static readonly ROUTE_CHANGE_OPACITY = 42;

    static readonly ROUTE_CHANGE_BLEND_MODE = 43;

    static readonly ROUTE_PLAY_SE = 44;

    static readonly ROUTE_SCRIPT = 45;

    initialize(..._args: any[]): void;
    initialize(...args: any[]): void;
    initialize(..._args: any[]): void {
        super.initialize();
    }

    initMembers(): void {
        super.initMembers();

        this._moveRouteForcing = false;
        this._moveRoute = null;
        this._moveRouteIndex = 0;
        this._originalMoveRoute = null;
        this._originalMoveRouteIndex = 0;
        this._waitCount = 0;
    }

    memorizeMoveRoute(): void {
        this._originalMoveRoute = this._moveRoute;
        this._originalMoveRouteIndex = this._moveRouteIndex;
    }

    restoreMoveRoute(): void {
        this._moveRoute = this._originalMoveRoute;
        this._moveRouteIndex = this._originalMoveRouteIndex;
        this._originalMoveRoute = null;
    }

    isMoveRouteForcing(): boolean {
        return this._moveRouteForcing;
    }

    setMoveRoute(moveRoute: RMMZ.MoveRoute): void {
        if (this._moveRouteForcing) {
            this._originalMoveRoute = moveRoute;
            this._originalMoveRouteIndex = 0;
        } else {
            this._moveRoute = moveRoute;
            this._moveRouteIndex = 0;
        }
    }

    forceMoveRoute(moveRoute: RMMZ.MoveRoute): void {
        if (!this._originalMoveRoute) {
            this.memorizeMoveRoute();
        }
        this._moveRoute = moveRoute;
        this._moveRouteIndex = 0;
        this._moveRouteForcing = true;
        this._waitCount = 0;
    }

    updateStop(): void {
        super.updateStop();
        if (this._moveRouteForcing) {
            this.updateRoutineMove();
        }
    }

    updateRoutineMove(): void {
        if (this._waitCount > 0) {
            this._waitCount--;
        } else {
            this.setMovementSuccess(true);
            const command = this._moveRoute!.list[this._moveRouteIndex];
            if (command) {
                this.processMoveCommand(command);
                this.advanceMoveRouteIndex();
            }
        }
    }

    processMoveCommand(command: RMMZ.MoveCommand): void {
        const gc = Game_Character;
        const { parameters: params, code } = command;
        switch (code) {
            case gc.ROUTE_END:
                this.processRouteEnd();
                break;
            case gc.ROUTE_MOVE_DOWN:
                this.moveStraight(2);
                break;
            case gc.ROUTE_MOVE_LEFT:
                this.moveStraight(4);
                break;
            case gc.ROUTE_MOVE_RIGHT:
                this.moveStraight(6);
                break;
            case gc.ROUTE_MOVE_UP:
                this.moveStraight(8);
                break;
            case gc.ROUTE_MOVE_LOWER_L:
                this.moveDiagonally(4, 2);
                break;
            case gc.ROUTE_MOVE_LOWER_R:
                this.moveDiagonally(6, 2);
                break;
            case gc.ROUTE_MOVE_UPPER_L:
                this.moveDiagonally(4, 8);
                break;
            case gc.ROUTE_MOVE_UPPER_R:
                this.moveDiagonally(6, 8);
                break;
            case gc.ROUTE_MOVE_RANDOM:
                this.moveRandom();
                break;
            case gc.ROUTE_MOVE_TOWARD:
                this.moveTowardPlayer();
                break;
            case gc.ROUTE_MOVE_AWAY:
                this.moveAwayFromPlayer();
                break;
            case gc.ROUTE_MOVE_FORWARD:
                this.moveForward();
                break;
            case gc.ROUTE_MOVE_BACKWARD:
                this.moveBackward();
                break;
            case gc.ROUTE_JUMP:
                this.jump(params[0]!, params[1]);
                break;
            case gc.ROUTE_WAIT:
                this._waitCount = params[0]! - 1;
                break;
            case gc.ROUTE_TURN_DOWN:
                this.setDirection(2);
                break;
            case gc.ROUTE_TURN_LEFT:
                this.setDirection(4);
                break;
            case gc.ROUTE_TURN_RIGHT:
                this.setDirection(6);
                break;
            case gc.ROUTE_TURN_UP:
                this.setDirection(8);
                break;
            case gc.ROUTE_TURN_90D_R:
                this.turnRight90();
                break;
            case gc.ROUTE_TURN_90D_L:
                this.turnLeft90();
                break;
            case gc.ROUTE_TURN_180D:
                this.turn180();
                break;
            case gc.ROUTE_TURN_90D_R_L:
                this.turnRightOrLeft90();
                break;
            case gc.ROUTE_TURN_RANDOM:
                this.turnRandom();
                break;
            case gc.ROUTE_TURN_TOWARD:
                this.turnTowardPlayer();
                break;
            case gc.ROUTE_TURN_AWAY:
                this.turnAwayFromPlayer();
                break;
            case gc.ROUTE_SWITCH_ON:
                $gameSwitches.setValue(params[0]!, true);
                break;
            case gc.ROUTE_SWITCH_OFF:
                $gameSwitches.setValue(params[0]!, false);
                break;
            case gc.ROUTE_CHANGE_SPEED:
                this.setMoveSpeed(params[0]!);
                break;
            case gc.ROUTE_CHANGE_FREQ:
                this.setMoveFrequency(params[0]!);
                break;
            case gc.ROUTE_WALK_ANIME_ON:
                this.setWalkAnime(true);
                break;
            case gc.ROUTE_WALK_ANIME_OFF:
                this.setWalkAnime(false);
                break;
            case gc.ROUTE_STEP_ANIME_ON:
                this.setStepAnime(true);
                break;
            case gc.ROUTE_STEP_ANIME_OFF:
                this.setStepAnime(false);
                break;
            case gc.ROUTE_DIR_FIX_ON:
                this.setDirectionFix(true);
                break;
            case gc.ROUTE_DIR_FIX_OFF:
                this.setDirectionFix(false);
                break;
            case gc.ROUTE_THROUGH_ON:
                this.setThrough(true);
                break;
            case gc.ROUTE_THROUGH_OFF:
                this.setThrough(false);
                break;
            case gc.ROUTE_TRANSPARENT_ON:
                this.setTransparent(true);
                break;
            case gc.ROUTE_TRANSPARENT_OFF:
                this.setTransparent(false);
                break;
            case gc.ROUTE_CHANGE_IMAGE:
                this.setImage(params[0]!, params[1]);
                break;
            case gc.ROUTE_CHANGE_OPACITY:
                this.setOpacity(params[0]!);
                break;
            case gc.ROUTE_CHANGE_BLEND_MODE:
                this.setBlendMode(params[0]!);
                break;
            case gc.ROUTE_PLAY_SE:
                AudioManager.playSe(params[0]!);
                break;
            case gc.ROUTE_SCRIPT:
                eval(params[0]!);
                break;
        }
    }

    deltaXFrom(x: number): number {
        return $gameMap.deltaX(this.x, x);
    }

    deltaYFrom(y: number): number {
        return $gameMap.deltaY(this.y, y);
    }

    moveRandom(): void {
        const d = 2 + Math.randomInt(4) * 2;
        if (this.canPass(this.x, this.y, d as RMMZ.Direction)) {
            this.moveStraight(d as RMMZ.Direction);
        }
    }

    moveTowardCharacter(character: Game_Character): void {
        const sx = this.deltaXFrom(character.x);
        const sy = this.deltaYFrom(character.y);
        if (Math.abs(sx) > Math.abs(sy)) {
            this.moveStraight(sx > 0 ? 4 : 6);
            if (!this.isMovementSucceeded() && sy !== 0) {
                this.moveStraight(sy > 0 ? 8 : 2);
            }
        } else if (sy !== 0) {
            this.moveStraight(sy > 0 ? 8 : 2);
            if (!this.isMovementSucceeded() && sx !== 0) {
                this.moveStraight(sx > 0 ? 4 : 6);
            }
        }
    }

    moveAwayFromCharacter(character: Game_Character): void {
        const sx = this.deltaXFrom(character.x);
        const sy = this.deltaYFrom(character.y);
        if (Math.abs(sx) > Math.abs(sy)) {
            this.moveStraight(sx > 0 ? 6 : 4);
            if (!this.isMovementSucceeded() && sy !== 0) {
                this.moveStraight(sy > 0 ? 2 : 8);
            }
        } else if (sy !== 0) {
            this.moveStraight(sy > 0 ? 2 : 8);
            if (!this.isMovementSucceeded() && sx !== 0) {
                this.moveStraight(sx > 0 ? 6 : 4);
            }
        }
    }

    turnTowardCharacter(character: Game_Character): void {
        const sx = this.deltaXFrom(character.x);
        const sy = this.deltaYFrom(character.y);
        if (Math.abs(sx) > Math.abs(sy)) {
            this.setDirection(sx > 0 ? 4 : 6);
        } else if (sy !== 0) {
            this.setDirection(sy > 0 ? 8 : 2);
        }
    }

    turnAwayFromCharacter(character: Game_Character): void {
        const sx = this.deltaXFrom(character.x);
        const sy = this.deltaYFrom(character.y);
        if (Math.abs(sx) > Math.abs(sy)) {
            this.setDirection(sx > 0 ? 6 : 4);
        } else if (sy !== 0) {
            this.setDirection(sy > 0 ? 2 : 8);
        }
    }

    turnTowardPlayer(): void {
        this.turnTowardCharacter($gamePlayer);
    }

    turnAwayFromPlayer(): void {
        this.turnAwayFromCharacter($gamePlayer);
    }

    moveTowardPlayer(): void {
        this.moveTowardCharacter($gamePlayer);
    }

    moveAwayFromPlayer(): void {
        this.moveAwayFromCharacter($gamePlayer);
    }

    moveForward(): void {
        this.moveStraight(this.direction());
    }

    moveBackward(): void {
        const lastDirectionFix = this.isDirectionFixed();
        this.setDirectionFix(true);
        this.moveStraight(this.reverseDir(this.direction()));
        this.setDirectionFix(lastDirectionFix);
    }

    processRouteEnd(): void {
        if (this._moveRoute!.repeat) {
            this._moveRouteIndex = -1;
        } else if (this._moveRouteForcing) {
            this._moveRouteForcing = false;
            this.restoreMoveRoute();
            this.setMovementSuccess(false);
        }
    }

    advanceMoveRouteIndex(): void {
        const moveRoute = this._moveRoute;
        if (moveRoute && (this.isMovementSucceeded() || moveRoute.skippable)) {
            let numCommands = moveRoute.list.length - 1;
            this._moveRouteIndex++;
            if (moveRoute.repeat && this._moveRouteIndex >= numCommands) {
                this._moveRouteIndex = 0;
            }
        }
    }

    turnRight90(): void {
        switch (this.direction()) {
            case 2:
                this.setDirection(4);
                break;
            case 4:
                this.setDirection(8);
                break;
            case 6:
                this.setDirection(2);
                break;
            case 8:
                this.setDirection(6);
                break;
        }
    }

    turnLeft90(): void {
        switch (this.direction()) {
            case 2:
                this.setDirection(6);
                break;
            case 4:
                this.setDirection(2);
                break;
            case 6:
                this.setDirection(8);
                break;
            case 8:
                this.setDirection(4);
                break;
        }
    }

    turn180(): void {
        this.setDirection(this.reverseDir(this.direction()));
    }

    turnRightOrLeft90(): void {
        switch (Math.randomInt(2)) {
            case 0:
                this.turnRight90();
                break;
            case 1:
                this.turnLeft90();
                break;
        }
    }

    turnRandom(): void {
        this.setDirection((2 + Math.randomInt(4) * 2!) as RMMZ.Direction | undefined);
    }

    swap(character: Game_Character): void {
        const newX = character.x;
        const newY = character.y;
        character.locate(this.x, this.y);
        this.locate(newX, newY);
    }

    findDirectionTo(goalX: number, goalY: number): 0 | 2 | 4 | 8 | 6 {
        const searchLimit = this.searchLimit();
        const mapWidth = $gameMap.width();
        const nodeList = [];
        const openList = [];
        const closedList = [];
        const start = {} as RMMZ.PathNode;
        let best = start;

        if (this.x === goalX && this.y === goalY) {
            return 0;
        }

        start.parent = null;
        start.x = this.x;
        start.y = this.y;
        start.g = 0;
        start.f = $gameMap.distance(start.x, start.y, goalX, goalY);
        nodeList.push(start);
        openList.push(start.y * mapWidth + start.x);

        while (nodeList.length > 0) {
            let bestIndex = 0;
            for (let i = 0; i < nodeList.length; i++) {
                if (nodeList[i].f < nodeList[bestIndex].f) {
                    bestIndex = i;
                }
            }

            const current = nodeList[bestIndex];
            const x1 = current.x;
            const y1 = current.y;
            const pos1 = y1 * mapWidth + x1;
            const g1 = current.g;

            nodeList.splice(bestIndex, 1);
            openList.splice(openList.indexOf(pos1), 1);
            closedList.push(pos1);

            if (current.x === goalX && current.y === goalY) {
                best = current;
                break;
            }

            if (g1 >= searchLimit) {
                continue;
            }

            for (let j = 0; j < 4; j++) {
                const direction = 2 + j * 2;
                const x2 = $gameMap.roundXWithDirection(x1, direction as RMMZ.Direction);
                const y2 = $gameMap.roundYWithDirection(y1, direction as RMMZ.Direction);
                const pos2 = y2 * mapWidth + x2;

                if (closedList.includes(pos2)) {
                    continue;
                }
                if (!this.canPass(x1, y1, direction as RMMZ.Direction)) {
                    continue;
                }

                const g2 = g1 + 1;
                const index2 = openList.indexOf(pos2);

                if (index2 < 0 || g2 < nodeList[index2].g) {
                    let neighbor = {} as RMMZ.PathNode;
                    if (index2 >= 0) {
                        neighbor = nodeList[index2];
                    } else {
                        nodeList.push(neighbor);
                        openList.push(pos2);
                    }
                    neighbor.parent = current;
                    neighbor.x = x2;
                    neighbor.y = y2;
                    neighbor.g = g2;
                    neighbor.f = g2 + $gameMap.distance(x2, y2, goalX, goalY);
                    if (!best || neighbor.f - neighbor.g < best.f - best.g) {
                        best = neighbor;
                    }
                }
            }
        }

        let node = best;
        while (node.parent && node.parent !== start) {
            node = node.parent;
        }

        const deltaX1 = $gameMap.deltaX(node.x, start.x);
        const deltaY1 = $gameMap.deltaY(node.y, start.y);
        if (deltaY1 > 0) {
            return 2;
        } else if (deltaX1 < 0) {
            return 4;
        } else if (deltaX1 > 0) {
            return 6;
        } else if (deltaY1 < 0) {
            return 8;
        }

        const deltaX2 = this.deltaXFrom(goalX);
        const deltaY2 = this.deltaYFrom(goalY);
        if (Math.abs(deltaX2) > Math.abs(deltaY2)) {
            return deltaX2 > 0 ? 4 : 6;
        } else if (deltaY2 !== 0) {
            return deltaY2 > 0 ? 8 : 2;
        }

        return 0;
    }

    searchLimit(): number {
        return 12;
    }
}

/**
 * The game object class for the player. It contains event starting
 * determinants and map scrolling functions.
 */
class Game_Player extends Game_Character {
    declare _vehicleType: RMMZ.VehicleType;
    declare _vehicleGettingOn: boolean;
    declare _vehicleGettingOff: boolean;
    declare _dashing: boolean;
    declare _needsMapReload: boolean;
    declare _transferring: boolean;
    declare _newMapId: number;
    declare _newX: number;
    declare _newY: number;
    declare _newDirection: RMMZ.Direction;
    declare _fadeType: number | undefined;
    declare _followers: Game_Followers;
    declare _encounterCount: number;

    constructor(...args: []) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
        this.setTransparent($dataSystem.optTransparent);
    }

    initMembers(): void {
        super.initMembers();

        this._vehicleType = "walk";
        this._vehicleGettingOn = false;
        this._vehicleGettingOff = false;
        this._dashing = false;
        this._needsMapReload = false;
        this._transferring = false;
        this._newMapId = 0;
        this._newX = 0;
        this._newY = 0;
        this._newDirection = 0;
        this._fadeType = 0;
        this._followers = new Game_Followers();
        this._encounterCount = 0;
    }

    clearTransferInfo(): void {
        this._transferring = false;
        this._newMapId = 0;
        this._newX = 0;
        this._newY = 0;
        this._newDirection = 0;
    }

    followers(): Game_Followers {
        return this._followers;
    }

    refresh(): void {
        const actor = $gameParty.leader();
        const characterName = actor ? actor.characterName() : "";
        const characterIndex = actor ? actor.characterIndex() : 0;
        this.setImage(characterName, characterIndex);
        this._followers.refresh();
    }

    isStopping(): boolean {
        if (this._vehicleGettingOn || this._vehicleGettingOff) {
            return false;
        }
        return super.isStopping();
    }

    reserveTransfer(mapId: RMMZ.MapID, x: number, y: number, d?: RMMZ.Direction, fadeType?: number): void {
        this._transferring = true;
        this._newMapId = mapId;
        this._newX = x;
        this._newY = y;
        this._newDirection = d!;
        this._fadeType = fadeType;
    }

    setupForNewGame(): void {
        const mapId = $dataSystem.startMapId;
        const x = $dataSystem.startX;
        const y = $dataSystem.startY;
        this.reserveTransfer(mapId, x, y, 2, 0);
    }

    requestMapReload(): void {
        this._needsMapReload = true;
    }

    isTransferring(): boolean {
        return this._transferring;
    }

    newMapId(): number {
        return this._newMapId;
    }

    fadeType(): number | undefined {
        return this._fadeType;
    }

    performTransfer(): void {
        if (this.isTransferring()) {
            this.setDirection(this._newDirection);
            if (this._newMapId !== $gameMap.mapId() || this._needsMapReload) {
                $gameMap.setup(this._newMapId);
                this._needsMapReload = false;
            }
            this.locate(this._newX, this._newY);
            this.refresh();
            this.clearTransferInfo();
        }
    }

    isMapPassable(x: number, y: number, d: RMMZ.Direction): boolean {
        const vehicle = this.vehicle();
        if (vehicle) {
            return vehicle.isMapPassable(x, y, d);
        } else {
            return super.isMapPassable(x, y, d);
        }
    }

    vehicle(): Game_Vehicle {
        return $gameMap.vehicle(this._vehicleType)!;
    }

    isInBoat(): boolean {
        return this._vehicleType === "boat";
    }

    isInShip(): boolean {
        return this._vehicleType === "ship";
    }

    isInAirship(): boolean {
        return this._vehicleType === "airship";
    }

    isInVehicle(): boolean {
        return this.isInBoat() || this.isInShip() || this.isInAirship();
    }

    isNormal(): boolean {
        return this._vehicleType === "walk" && !this.isMoveRouteForcing();
    }

    isDashing(): boolean {
        return this._dashing;
    }

    isDebugThrough(): boolean {
        return Input.isPressed("control") && $gameTemp.isPlaytest();
    }

    isCollided(x: number, y: number): boolean {
        if (this.isThrough()) {
            return false;
        } else {
            return this.pos(x, y) || this._followers.isSomeoneCollided(x, y);
        }
    }

    centerX(): number {
        return ($gameMap.screenTileX() - 1) / 2;
    }

    centerY(): number {
        return ($gameMap.screenTileY() - 1) / 2;
    }

    center(x: number, y: number): void {
        return $gameMap.setDisplayPos(x - this.centerX(), y - this.centerY());
    }

    locate(x: number, y: number): void {
        super.locate(x, y);
        this.center(x, y);
        this.makeEncounterCount();
        if (this.isInVehicle()) {
            this.vehicle().refresh();
        }
        this._followers.synchronize(x, y, this.direction());
    }

    increaseSteps(): void {
        super.increaseSteps();
        if (this.isNormal()) {
            $gameParty.increaseSteps();
        }
    }

    makeEncounterCount(): void {
        const n = $gameMap.encounterStep();
        this._encounterCount = Math.randomInt(n) + Math.randomInt(n) + 1;
    }

    makeEncounterTroopId(): number {
        const encounterList = [];
        let weightSum = 0;
        for (const encounter of $gameMap.encounterList()) {
            if (this.meetsEncounterConditions(encounter)) {
                encounterList.push(encounter);
                weightSum += encounter.weight;
            }
        }
        if (weightSum > 0) {
            let value = Math.randomInt(weightSum);
            for (const encounter of encounterList) {
                value -= encounter.weight;
                if (value < 0) {
                    return encounter.troopId;
                }
            }
        }
        return 0;
    }

    meetsEncounterConditions(encounter: RMMZ.DataEncounter): boolean {
        return encounter.regionSet.length === 0 || encounter.regionSet.includes(this.regionId());
    }

    executeEncounter(): boolean {
        if (!$gameMap.isEventRunning() && this._encounterCount <= 0) {
            this.makeEncounterCount();
            const troopId = this.makeEncounterTroopId();
            if ($dataTroops[troopId]) {
                BattleManager.setup(troopId, true, false);
                BattleManager.onEncounter();
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    startMapEvent(x: number, y: number, triggers: number[], normal: boolean): void {
        if (!$gameMap.isEventRunning()) {
            for (const event of $gameMap.eventsXy(x, y)) {
                if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
                    event.start();
                }
            }
        }
    }

    moveByInput(): void {
        if (!this.isMoving() && this.canMove()) {
            let direction = this.getInputDirection();
            if (direction > 0) {
                $gameTemp.clearDestination();
            } else if ($gameTemp.isDestinationValid()) {
                const x = $gameTemp.destinationX();
                const y = $gameTemp.destinationY();
                direction = this.findDirectionTo(x!, y!);
            }
            if (direction > 0) {
                this.executeMove(direction);
            }
        }
    }

    canMove(): boolean {
        if ($gameMap.isEventRunning() || $gameMessage.isBusy()) {
            return false;
        }
        if (this.isMoveRouteForcing() || this.areFollowersGathering()) {
            return false;
        }
        if (this._vehicleGettingOn || this._vehicleGettingOff) {
            return false;
        }
        if (this.isInVehicle() && !this.vehicle().canMove()) {
            return false;
        }
        return true;
    }

    getInputDirection(): RMMZ.Direction {
        return Input.dir4;
    }

    executeMove(direction: RMMZ.Direction): void {
        this.moveStraight(direction);
    }

    update(sceneActive?: boolean): void {
        const lastScrolledX = this.scrolledX();
        const lastScrolledY = this.scrolledY();
        const wasMoving = this.isMoving();
        this.updateDashing();
        if (sceneActive) {
            this.moveByInput();
        }
        super.update();
        this.updateScroll(lastScrolledX, lastScrolledY);
        this.updateVehicle();
        if (!this.isMoving()) {
            this.updateNonmoving(wasMoving, sceneActive);
        }
        this._followers.update();
    }

    updateDashing(): void {
        if (this.isMoving()) {
            return;
        }
        if (this.canMove() && !this.isInVehicle() && !$gameMap.isDashDisabled()) {
            this._dashing = this.isDashButtonPressed() || $gameTemp.isDestinationValid();
        } else {
            this._dashing = false;
        }
    }

    isDashButtonPressed(): boolean {
        const shift = Input.isPressed("shift");
        if (ConfigManager.alwaysDash) {
            return !shift;
        } else {
            return shift;
        }
    }

    updateScroll(lastScrolledX: number, lastScrolledY: number): void {
        const x1 = lastScrolledX;
        const y1 = lastScrolledY;
        const x2 = this.scrolledX();
        const y2 = this.scrolledY();
        if (y2 > y1 && y2 > this.centerY()) {
            $gameMap.scrollDown(y2 - y1);
        }
        if (x2 < x1 && x2 < this.centerX()) {
            $gameMap.scrollLeft(x1 - x2);
        }
        if (x2 > x1 && x2 > this.centerX()) {
            $gameMap.scrollRight(x2 - x1);
        }
        if (y2 < y1 && y2 < this.centerY()) {
            $gameMap.scrollUp(y1 - y2);
        }
    }

    updateVehicle(): void {
        if (this.isInVehicle() && !this.areFollowersGathering()) {
            if (this._vehicleGettingOn) {
                this.updateVehicleGetOn();
            } else if (this._vehicleGettingOff) {
                this.updateVehicleGetOff();
            } else {
                this.vehicle().syncWithPlayer();
            }
        }
    }

    updateVehicleGetOn(): void {
        if (!this.areFollowersGathering() && !this.isMoving()) {
            this.setDirection(this.vehicle().direction());
            this.setMoveSpeed(this.vehicle().moveSpeed());
            this._vehicleGettingOn = false;
            this.setTransparent(true);
            if (this.isInAirship()) {
                this.setThrough(true);
            }
            this.vehicle().getOn();
        }
    }

    updateVehicleGetOff(): void {
        if (!this.areFollowersGathering() && this.vehicle().isLowest()) {
            this._vehicleGettingOff = false;
            this._vehicleType = "walk";
            this.setTransparent(false);
        }
    }

    updateNonmoving(wasMoving: boolean, sceneActive?: boolean): void {
        if (!$gameMap.isEventRunning()) {
            if (wasMoving) {
                $gameParty.onPlayerWalk();
                this.checkEventTriggerHere([1, 2]);
                if ($gameMap.setupStartingEvent()) {
                    return;
                }
            }
            if (sceneActive && this.triggerAction()) {
                return;
            }
            if (wasMoving) {
                this.updateEncounterCount();
            } else {
                $gameTemp.clearDestination();
            }
        }
    }

    triggerAction(): boolean {
        if (this.canMove()) {
            if (this.triggerButtonAction()) {
                return true;
            }
            if (this.triggerTouchAction()) {
                return true;
            }
        }
        return false;
    }

    triggerButtonAction(): boolean {
        if (Input.isTriggered("ok")) {
            if (this.getOnOffVehicle()) {
                return true;
            }
            this.checkEventTriggerHere([0]);
            if ($gameMap.setupStartingEvent()) {
                return true;
            }
            this.checkEventTriggerThere([0, 1, 2]);
            if ($gameMap.setupStartingEvent()) {
                return true;
            }
        }
        return false;
    }

    triggerTouchAction(): boolean {
        if ($gameTemp.isDestinationValid()) {
            const direction = this.direction();
            const x1 = this.x;
            const y1 = this.y;
            const x2 = $gameMap.roundXWithDirection(x1, direction);
            const y2 = $gameMap.roundYWithDirection(y1, direction);
            const x3 = $gameMap.roundXWithDirection(x2, direction);
            const y3 = $gameMap.roundYWithDirection(y2, direction);
            const destX = $gameTemp.destinationX();
            const destY = $gameTemp.destinationY();
            if (destX === x1 && destY === y1) {
                return this.triggerTouchActionD1(x1, y1);
            } else if (destX === x2 && destY === y2) {
                return this.triggerTouchActionD2(x2, y2);
            } else if (destX === x3 && destY === y3) {
                return this.triggerTouchActionD3(x2, y2);
            }
        }
        return false;
    }

    triggerTouchActionD1(x1: number, y1: number): boolean {
        if ($gameMap.airship().pos(x1, y1)) {
            if (TouchInput.isTriggered() && this.getOnOffVehicle()) {
                return true;
            }
        }
        this.checkEventTriggerHere([0]);
        return $gameMap.setupStartingEvent();
    }

    triggerTouchActionD2(x2: number, y2: number): boolean {
        if ($gameMap.boat().pos(x2, y2) || $gameMap.ship().pos(x2, y2)) {
            if (TouchInput.isTriggered() && this.getOnVehicle()) {
                return true;
            }
        }
        if (this.isInBoat() || this.isInShip()) {
            if (TouchInput.isTriggered() && this.getOffVehicle()) {
                return true;
            }
        }
        this.checkEventTriggerThere([0, 1, 2]);
        return $gameMap.setupStartingEvent();
    }

    triggerTouchActionD3(x2: number, y2: number): boolean {
        if ($gameMap.isCounter(x2, y2)) {
            this.checkEventTriggerThere([0, 1, 2]);
        }
        return $gameMap.setupStartingEvent();
    }

    updateEncounterCount(): void {
        if (this.canEncounter()) {
            this._encounterCount -= this.encounterProgressValue();
        }
    }

    canEncounter(): boolean {
        return (
            !$gameParty.hasEncounterNone() &&
            $gameSystem.isEncounterEnabled() &&
            !this.isInAirship() &&
            !this.isMoveRouteForcing() &&
            !this.isDebugThrough()
        );
    }

    encounterProgressValue(): number {
        let value = $gameMap.isBush(this.x, this.y) ? 2 : 1;
        if ($gameParty.hasEncounterHalf()) {
            value *= 0.5;
        }
        if (this.isInShip()) {
            value *= 0.5;
        }
        return value;
    }

    checkEventTriggerHere(triggers: number[]): void {
        if (this.canStartLocalEvents()) {
            this.startMapEvent(this.x, this.y, triggers, false);
        }
    }

    checkEventTriggerThere(triggers: number[]): void {
        if (this.canStartLocalEvents()) {
            const direction = this.direction();
            const x1 = this.x;
            const y1 = this.y;
            const x2 = $gameMap.roundXWithDirection(x1, direction);
            const y2 = $gameMap.roundYWithDirection(y1, direction);
            this.startMapEvent(x2, y2, triggers, true);
            if (!$gameMap.isAnyEventStarting() && $gameMap.isCounter(x2, y2)) {
                const x3 = $gameMap.roundXWithDirection(x2, direction);
                const y3 = $gameMap.roundYWithDirection(y2, direction);
                this.startMapEvent(x3, y3, triggers, true);
            }
        }
    }

    checkEventTriggerTouch(x: number, y: number): void {
        if (this.canStartLocalEvents()) {
            this.startMapEvent(x, y, [1, 2], true);
        }
    }

    canStartLocalEvents(): boolean {
        return !this.isInAirship();
    }

    getOnOffVehicle(): boolean {
        if (this.isInVehicle()) {
            return this.getOffVehicle();
        } else {
            return this.getOnVehicle();
        }
    }

    getOnVehicle(): boolean {
        const direction = this.direction();
        const x1 = this.x;
        const y1 = this.y;
        const x2 = $gameMap.roundXWithDirection(x1, direction);
        const y2 = $gameMap.roundYWithDirection(y1, direction);
        if ($gameMap.airship().pos(x1, y1)) {
            this._vehicleType = "airship";
        } else if ($gameMap.ship().pos(x2, y2)) {
            this._vehicleType = "ship";
        } else if ($gameMap.boat().pos(x2, y2)) {
            this._vehicleType = "boat";
        }
        if (this.isInVehicle()) {
            this._vehicleGettingOn = true;
            if (!this.isInAirship()) {
                this.forceMoveForward();
            }
            this.gatherFollowers();
        }
        return this._vehicleGettingOn;
    }

    getOffVehicle(): boolean {
        if (this.vehicle().isLandOk(this.x, this.y, this.direction())) {
            if (this.isInAirship()) {
                this.setDirection(2);
            }
            this._followers.synchronize(this.x, this.y, this.direction());
            this.vehicle().getOff();
            if (!this.isInAirship()) {
                this.forceMoveForward();
                this.setTransparent(false);
            }
            this._vehicleGettingOff = true;
            this.setMoveSpeed(4);
            this.setThrough(false);
            this.makeEncounterCount();
            this.gatherFollowers();
        }
        return this._vehicleGettingOff;
    }

    forceMoveForward(): void {
        this.setThrough(true);
        this.moveForward();
        this.setThrough(false);
    }

    isOnDamageFloor(): boolean {
        return $gameMap.isDamageFloor(this.x, this.y) && !this.isInAirship();
    }

    moveStraight(d: RMMZ.Direction): void {
        if (this.canPass(this.x, this.y, d)) {
            this._followers.updateMove();
        }
        super.moveStraight(d);
    }

    moveDiagonally(horz: RMMZ.Direction, vert: RMMZ.Direction): void {
        if (this.canPassDiagonally(this.x, this.y, horz, vert)) {
            this._followers.updateMove();
        }
        super.moveDiagonally(horz, vert);
    }

    jump(xPlus: number, yPlus: number): void {
        super.jump(xPlus, yPlus);
        this._followers.jumpAll();
    }

    showFollowers(): void {
        this._followers.show();
    }

    hideFollowers(): void {
        this._followers.hide();
    }

    gatherFollowers(): void {
        this._followers.gather();
    }

    areFollowersGathering(): boolean {
        return this._followers.areGathering();
    }

    areFollowersGathered(): boolean {
        return this._followers.areGathered();
    }
}

/**
 * The game object class for a follower. A follower is an allied character,
 * other than the front character, displayed in the party.
 */
class Game_Follower extends Game_Character {
    declare _memberIndex: number;

    constructor(...args: [memberIndex: number]) {
        super(...args);
    }

    initialize(memberIndex: number): void;
    initialize(...args: any[]): void;
    initialize(memberIndex: number): void {
        super.initialize();

        this._memberIndex = memberIndex;
        this.setTransparent($dataSystem.optTransparent);
        this.setThrough(true);
    }

    refresh(): void {
        const characterName = this.isVisible() ? this.actor().characterName() : "";
        const characterIndex = this.isVisible() ? this.actor().characterIndex() : 0;
        this.setImage(characterName, characterIndex);
    }

    actor(): Game_Actor {
        return $gameParty.battleMembers()[this._memberIndex];
    }

    isVisible(): boolean {
        return this.actor() && $gamePlayer.followers().isVisible();
    }

    isGathered(): boolean {
        return !this.isMoving() && this.pos($gamePlayer.x, $gamePlayer.y);
    }

    update(): void {
        super.update();
        this.setMoveSpeed($gamePlayer.realMoveSpeed());
        this.setOpacity($gamePlayer.opacity());
        this.setBlendMode($gamePlayer.blendMode());
        this.setWalkAnime($gamePlayer.hasWalkAnime());
        this.setStepAnime($gamePlayer.hasStepAnime());
        this.setDirectionFix($gamePlayer.isDirectionFixed());
        this.setTransparent($gamePlayer.isTransparent());
    }

    chaseCharacter(character: Game_Character): void {
        const sx = this.deltaXFrom(character.x);
        const sy = this.deltaYFrom(character.y);
        if (sx !== 0 && sy !== 0) {
            this.moveDiagonally(sx > 0 ? 4 : 6, sy > 0 ? 8 : 2);
        } else if (sx !== 0) {
            this.moveStraight(sx > 0 ? 4 : 6);
        } else if (sy !== 0) {
            this.moveStraight(sy > 0 ? 8 : 2);
        }
        this.setMoveSpeed($gamePlayer.realMoveSpeed());
    }
}

/**
 * The wrapper class for a follower array.
 */
class Game_Followers {
    declare _visible: boolean;
    declare _gathering: boolean;
    declare _data: Game_Follower[];

    constructor(...args: []) {
        this.initialize(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        this._visible = $dataSystem.optFollowers;
        this._gathering = false;
        this._data = [];
        this.setup();
    }

    setup(): void {
        this._data = [];
        for (let i = 1; i < $gameParty.maxBattleMembers(); i++) {
            this._data.push(new Game_Follower(i));
        }
    }

    isVisible(): boolean {
        return this._visible;
    }

    show(): void {
        this._visible = true;
    }

    hide(): void {
        this._visible = false;
    }

    data(): Game_Follower[] {
        return this._data.clone();
    }

    reverseData(): Game_Follower[] {
        return this._data.clone().reverse();
    }

    follower(index: number): Game_Follower {
        return this._data[index];
    }

    refresh(): void {
        for (const follower of this._data) {
            follower.refresh();
        }
    }

    update(): void {
        if (this.areGathering()) {
            if (!this.areMoving()) {
                this.updateMove();
            }
            if (this.areGathered()) {
                this._gathering = false;
            }
        }
        for (const follower of this._data) {
            follower.update();
        }
    }

    updateMove(): void {
        for (let i = this._data.length - 1; i >= 0; i--) {
            const precedingCharacter = i > 0 ? this._data[i - 1] : $gamePlayer;
            this._data[i].chaseCharacter(precedingCharacter);
        }
    }

    jumpAll(): void {
        if ($gamePlayer.isJumping()) {
            for (const follower of this._data) {
                const sx = $gamePlayer.deltaXFrom(follower.x);
                const sy = $gamePlayer.deltaYFrom(follower.y);
                follower.jump(sx, sy);
            }
        }
    }

    synchronize(x: number, y: number, d: RMMZ.Direction): void {
        for (const follower of this._data) {
            follower.locate(x, y);
            follower.setDirection(d);
        }
    }

    gather(): void {
        this._gathering = true;
    }

    areGathering(): boolean {
        return this._gathering;
    }

    visibleFollowers(): Game_Follower[] {
        return this._data.filter((follower) => follower.isVisible());
    }

    areMoving(): boolean {
        return this.visibleFollowers().some((follower) => follower.isMoving());
    }

    areGathered(): boolean {
        return this.visibleFollowers().every((follower) => follower.isGathered());
    }

    isSomeoneCollided(x: number, y: number): boolean {
        return this.visibleFollowers().some((follower) => follower.pos(x, y));
    }
}

/**
 * The game object class for a vehicle.
 */
class Game_Vehicle extends Game_Character {
    declare _type: RMMZ.VehicleType;
    declare _mapId: number;
    declare _altitude: number;
    declare _driving: boolean;
    declare _bgm: RMMZ.DataAudio | null;

    constructor(...args: [type: RMMZ.VehicleType]) {
        super(...args);
    }

    initialize(type: RMMZ.VehicleType): void;
    initialize(...args: any[]): void;
    initialize(type: RMMZ.VehicleType): void {
        super.initialize();

        this._type = type;
        this.resetDirection();
        this.initMoveSpeed();
        this.loadSystemSettings();
    }

    initMembers(): void {
        super.initMembers();
        this._type = "" as RMMZ.VehicleType;
        this._mapId = 0;
        this._altitude = 0;
        this._driving = false;
        this._bgm = null;
    }

    isBoat(): boolean {
        return this._type === "boat";
    }

    isShip(): boolean {
        return this._type === "ship";
    }

    isAirship(): boolean {
        return this._type === "airship";
    }

    resetDirection(): void {
        this.setDirection(4);
    }

    initMoveSpeed(): void {
        if (this.isBoat()) {
            this.setMoveSpeed(4);
        } else if (this.isShip()) {
            this.setMoveSpeed(5);
        } else if (this.isAirship()) {
            this.setMoveSpeed(6);
        }
    }

    vehicle(): RMMZ.DataVehicle | null {
        if (this.isBoat()) {
            return $dataSystem.boat;
        } else if (this.isShip()) {
            return $dataSystem.ship;
        } else if (this.isAirship()) {
            return $dataSystem.airship;
        } else {
            return null;
        }
    }

    loadSystemSettings(): void {
        const vehicle = this.vehicle();
        this._mapId = vehicle!.startMapId;
        this.setPosition(vehicle!.startX, vehicle!.startY);
        this.setImage(vehicle!.characterName, vehicle!.characterIndex);
    }

    refresh(): void {
        if (this._driving) {
            this._mapId = $gameMap.mapId();
            this.syncWithPlayer();
        } else if (this._mapId === $gameMap.mapId()) {
            this.locate(this.x, this.y);
        }
        if (this.isAirship()) {
            this.setPriorityType(this._driving ? 2 : 0);
        } else {
            this.setPriorityType(1);
        }
        this.setWalkAnime(this._driving);
        this.setStepAnime(this._driving);
        this.setTransparent(this._mapId !== $gameMap.mapId());
    }

    setLocation(mapId: RMMZ.MapID, x: number, y: number): void {
        this._mapId = mapId;
        this.setPosition(x, y);
        this.refresh();
    }

    pos(x: number, y: number): boolean {
        if (this._mapId === $gameMap.mapId()) {
            return super.pos(x, y);
        } else {
            return false;
        }
    }

    isMapPassable(x: number, y: number, d: RMMZ.Direction): boolean {
        const x2 = $gameMap.roundXWithDirection(x, d);
        const y2 = $gameMap.roundYWithDirection(y, d);
        if (this.isBoat()) {
            return $gameMap.isBoatPassable(x2, y2);
        } else if (this.isShip()) {
            return $gameMap.isShipPassable(x2, y2);
        } else if (this.isAirship()) {
            return true;
        } else {
            return false;
        }
    }

    getOn(): void {
        this._driving = true;
        this.setWalkAnime(true);
        this.setStepAnime(true);
        $gameSystem.saveWalkingBgm();
        this.playBgm();
    }

    getOff(): void {
        this._driving = false;
        this.setWalkAnime(false);
        this.setStepAnime(false);
        this.resetDirection();
        $gameSystem.replayWalkingBgm();
    }

    setBgm(bgm: RMMZ.DataAudio): void {
        this._bgm = bgm;
    }

    playBgm(): void {
        AudioManager.playBgm(this._bgm || this.vehicle()!.bgm);
    }

    syncWithPlayer(): void {
        this.copyPosition($gamePlayer);
        this.refreshBushDepth();
    }

    screenY(): number {
        return super.screenY() - this._altitude;
    }

    shadowX(): number {
        return this.screenX();
    }

    shadowY(): number {
        return this.screenY() + this._altitude;
    }

    shadowOpacity(): number {
        return (255 * this._altitude) / this.maxAltitude();
    }

    canMove(): boolean {
        if (this.isAirship()) {
            return this.isHighest();
        } else {
            return true;
        }
    }

    update(): void {
        super.update();
        if (this.isAirship()) {
            this.updateAirship();
        }
    }

    updateAirship(): void {
        this.updateAirshipAltitude();
        this.setStepAnime(this.isHighest());
        this.setPriorityType(this.isLowest() ? 0 : 2);
    }

    updateAirshipAltitude(): void {
        if (this._driving && !this.isHighest()) {
            this._altitude++;
        }
        if (!this._driving && !this.isLowest()) {
            this._altitude--;
        }
    }

    maxAltitude(): number {
        return 48;
    }

    isLowest(): boolean {
        return this._altitude <= 0;
    }

    isHighest(): boolean {
        return this._altitude >= this.maxAltitude();
    }

    isTakeoffOk(): boolean {
        return $gamePlayer.areFollowersGathered();
    }

    isLandOk(x: number, y: number, d: RMMZ.Direction): boolean {
        if (this.isAirship()) {
            if (!$gameMap.isAirshipLandOk(x, y)) {
                return false;
            }
            if ($gameMap.eventsXy(x, y).length > 0) {
                return false;
            }
        } else {
            const x2 = $gameMap.roundXWithDirection(x, d);
            const y2 = $gameMap.roundYWithDirection(y, d);
            if (!$gameMap.isValid(x2, y2)) {
                return false;
            }
            if (!$gameMap.isPassable(x2, y2, this.reverseDir(d))) {
                return false;
            }
            if (this.isCollidedWithCharacters(x2, y2)) {
                return false;
            }
        }
        return true;
    }
}

/**
 * The game object class for an event. It contains functionality for event page
 * switching and running parallel process events.
 */
class Game_Event extends Game_Character {
    declare _mapId: RMMZ.MapID;
    declare _eventId: RMMZ.EventID;
    declare _moveType: number;
    declare _trigger: number | null;
    declare _starting: boolean;
    declare _erased: boolean;
    declare _pageIndex: number;
    declare _originalPattern: number;
    declare _originalDirection: number;
    declare _prelockDirection: RMMZ.Direction;
    declare _locked: boolean;
    declare _interpreter: Game_Interpreter | null;

    constructor(...args: [mapId: RMMZ.MapID, eventId: RMMZ.EventID]) {
        super(...args);
    }

    initialize(mapId: RMMZ.MapID, eventId: RMMZ.EventID): void;
    initialize(...args: any[]): void;
    initialize(mapId: RMMZ.MapID, eventId: RMMZ.EventID): void {
        super.initialize();

        this._mapId = mapId;
        this._eventId = eventId;
        this.locate(this.event().x, this.event().y);
        this.refresh();
    }

    initMembers(): void {
        super.initMembers();

        this._moveType = 0;
        this._trigger = 0;
        this._starting = false;
        this._erased = false;
        this._pageIndex = -2;
        this._originalPattern = 1;
        this._originalDirection = 2;
        this._prelockDirection = 0;
        this._locked = false;
    }

    eventId(): number {
        return this._eventId;
    }

    event(): RMMZ.DataEvent {
        return $dataMap.events[this._eventId]!;
    }

    page(): RMMZ.DataEventPage {
        return this.event().pages[this._pageIndex];
    }

    list(): RMMZ.DataCommand[] {
        return this.page().list;
    }

    isCollidedWithCharacters(x: number, y: number): boolean {
        return super.isCollidedWithCharacters(x, y) || this.isCollidedWithPlayerCharacters(x, y);
    }

    isCollidedWithEvents(x: number, y: number): boolean {
        const events = $gameMap.eventsXyNt(x, y);
        return events.length > 0;
    }

    isCollidedWithPlayerCharacters(x: number, y: number): boolean {
        return this.isNormalPriority() && $gamePlayer.isCollided(x, y);
    }

    lock(): void {
        if (!this._locked) {
            this._prelockDirection = this.direction();
            this.turnTowardPlayer();
            this._locked = true;
        }
    }

    unlock(): void {
        if (this._locked) {
            this._locked = false;
            this.setDirection(this._prelockDirection);
        }
    }

    updateStop(): void {
        if (this._locked) {
            this.resetStopCount();
        }
        super.updateStop();
        if (!this.isMoveRouteForcing()) {
            this.updateSelfMovement();
        }
    }

    updateSelfMovement(): void {
        if (!this._locked && this.isNearTheScreen() && this.checkStop(this.stopCountThreshold())) {
            switch (this._moveType) {
                case 1:
                    this.moveTypeRandom();
                    break;
                case 2:
                    this.moveTypeTowardPlayer();
                    break;
                case 3:
                    this.moveTypeCustom();
                    break;
            }
        }
    }

    stopCountThreshold(): number {
        return 30 * (5 - this.moveFrequency());
    }

    moveTypeRandom(): void {
        switch (Math.randomInt(6)) {
            case 0:
            case 1:
                this.moveRandom();
                break;
            case 2:
            case 3:
            case 4:
                this.moveForward();
                break;
            case 5:
                this.resetStopCount();
                break;
        }
    }

    moveTypeTowardPlayer(): void {
        if (this.isNearThePlayer()) {
            switch (Math.randomInt(6)) {
                case 0:
                case 1:
                case 2:
                case 3:
                    this.moveTowardPlayer();
                    break;
                case 4:
                    this.moveRandom();
                    break;
                case 5:
                    this.moveForward();
                    break;
            }
        } else {
            this.moveRandom();
        }
    }

    isNearThePlayer(): boolean {
        const sx = Math.abs(this.deltaXFrom($gamePlayer.x));
        const sy = Math.abs(this.deltaYFrom($gamePlayer.y));
        return sx + sy < 20;
    }

    moveTypeCustom(): void {
        this.updateRoutineMove();
    }

    isStarting(): boolean {
        return this._starting;
    }

    clearStartingFlag(): void {
        this._starting = false;
    }

    isTriggerIn(triggers: number[]): boolean {
        return triggers.includes(this._trigger!);
    }

    start(): void {
        const list = this.list();
        if (list && list.length > 1) {
            this._starting = true;
            if (this.isTriggerIn([0, 1, 2])) {
                this.lock();
            }
        }
    }

    erase(): void {
        this._erased = true;
        this.refresh();
    }

    refresh(): void {
        const newPageIndex = this._erased ? -1 : this.findProperPageIndex();
        if (this._pageIndex !== newPageIndex) {
            this._pageIndex = newPageIndex;
            this.setupPage();
        }
    }

    findProperPageIndex(): number {
        const pages = this.event().pages;
        for (let i = pages.length - 1; i >= 0; i--) {
            const page = pages[i];
            if (this.meetsConditions(page)) {
                return i;
            }
        }
        return -1;
    }

    meetsConditions(page: RMMZ.DataEventPage): boolean {
        const c = page.conditions;
        if (c.switch1Valid) {
            if (!$gameSwitches.value(c.switch1Id)) {
                return false;
            }
        }
        if (c.switch2Valid) {
            if (!$gameSwitches.value(c.switch2Id)) {
                return false;
            }
        }
        if (c.variableValid) {
            if ($gameVariables.value(c.variableId) < c.variableValue) {
                return false;
            }
        }
        if (c.selfSwitchValid) {
            const key: RMMZ.SelfSwitchID = [this._mapId, this._eventId, c.selfSwitchCh];
            if ($gameSelfSwitches.value(key) !== true) {
                return false;
            }
        }
        if (c.itemValid) {
            const item = $dataItems[c.itemId];
            if (!$gameParty.hasItem(item!)) {
                return false;
            }
        }
        if (c.actorValid) {
            const actor = $gameActors.actor(c.actorId);
            if (!$gameParty.members().includes(actor!)) {
                return false;
            }
        }
        return true;
    }

    setupPage(): void {
        if (this._pageIndex >= 0) {
            this.setupPageSettings();
        } else {
            this.clearPageSettings();
        }
        this.refreshBushDepth();
        this.clearStartingFlag();
        this.checkEventTriggerAuto();
    }

    clearPageSettings(): void {
        this.setImage("", 0);
        this._moveType = 0;
        this._trigger = null;
        this._interpreter = null;
        this.setThrough(true);
    }

    setupPageSettings(): void {
        const page = this.page();
        const image = page.image;
        if (image.tileId > 0) {
            this.setTileImage(image.tileId);
        } else {
            this.setImage(image.characterName, image.characterIndex);
        }
        if (this._originalDirection !== image.direction) {
            this._originalDirection = image.direction;
            this._prelockDirection = 0;
            this.setDirectionFix(false);
            this.setDirection(image.direction);
        }
        if (this._originalPattern !== image.pattern) {
            this._originalPattern = image.pattern;
            this.setPattern(image.pattern);
        }
        this.setMoveSpeed(page.moveSpeed);
        this.setMoveFrequency(page.moveFrequency);
        this.setPriorityType(page.priorityType);
        this.setWalkAnime(page.walkAnime);
        this.setStepAnime(page.stepAnime);
        this.setDirectionFix(page.directionFix);
        this.setThrough(page.through);
        this.setMoveRoute(page.moveRoute);
        this._moveType = page.moveType;
        this._trigger = page.trigger;
        if (this._trigger === 4) {
            this._interpreter = new Game_Interpreter();
        } else {
            this._interpreter = null;
        }
    }

    isOriginalPattern(): boolean {
        return this.pattern() === this._originalPattern;
    }

    resetPattern(): void {
        this.setPattern(this._originalPattern);
    }

    checkEventTriggerTouch(x: number, y: number): void {
        if (!$gameMap.isEventRunning()) {
            if (this._trigger === 2 && $gamePlayer.pos(x, y)) {
                if (!this.isJumping() && this.isNormalPriority()) {
                    this.start();
                }
            }
        }
    }

    checkEventTriggerAuto(): void {
        if (this._trigger === 3) {
            this.start();
        }
    }

    update(): void {
        super.update();
        this.checkEventTriggerAuto();
        this.updateParallel();
    }

    updateParallel(): void {
        if (this._interpreter) {
            if (!this._interpreter.isRunning()) {
                this._interpreter.setup(this.list(), this._eventId);
            }
            this._interpreter.update();
        }
    }

    locate(x: number, y: number): void {
        super.locate(x, y);
        this._prelockDirection = 0;
    }

    forceMoveRoute(moveRoute: RMMZ.MoveRoute): void {
        super.forceMoveRoute(moveRoute);
        this._prelockDirection = 0;
    }
}

/**
 * The interpreter for running event commands.
 */
class Game_Interpreter {
    [command: `command${number}`]: (params: any) => boolean;
    declare _depth: number;
    declare _branch: Record<number, number | boolean | null>;
    declare _indent: number;
    declare _frameCount: number;
    declare _freezeChecker: number;
    declare _mapId: number;
    declare _eventId: number;
    declare _list: RMMZ.DataEventCommand[] | null;
    declare _index: number;
    declare _waitCount: number;
    declare _waitMode: string;
    declare _comments: string | string[];
    declare _characterId: number;
    declare _childInterpreter: Game_Interpreter | null;

    constructor(...args: [depth?: number]) {
        this.initialize(...args);
    }

    initialize(depth?: number): void;
    initialize(...args: any[]): void;
    initialize(depth?: number): void {
        this._depth = depth || 0;
        this.checkOverflow();
        this.clear();

        this._branch = {};
        this._indent = 0;
        this._frameCount = 0;
        this._freezeChecker = 0;
    }

    checkOverflow(): void {
        if (this._depth >= 100) {
            throw new Error("Common event calls exceeded the limit");
        }
    }

    clear(): void {
        this._mapId = 0;
        this._eventId = 0;
        this._list = null;
        this._index = 0;
        this._waitCount = 0;
        this._waitMode = "";
        this._comments = "";
        this._characterId = 0;
        this._childInterpreter = null;
    }

    setup(list: RMMZ.DataCommand[], eventId?: RMMZ.EventID): void {
        this.clear();
        this._mapId = $gameMap.mapId();
        this._eventId = eventId || 0;
        this._list = list;
        this.loadImages();
    }

    /**
     * Preloads face and picture images referenced by upcoming event commands.
     * This is usually sufficient compared with the more complicated preload
     * scheme in certain versions of MV.
     */
    loadImages(): void {
        const list = this._list!.slice(0, 200);
        for (const command of list) {
            switch (command.code) {
                case 101: // Show Text
                    ImageManager.loadFace(command.parameters[0]);
                    break;
                case 231: // Show Picture
                    ImageManager.loadPicture(command.parameters[1]);
                    break;
            }
        }
    }

    eventId(): number {
        return this._eventId;
    }

    isOnCurrentMap(): boolean {
        return this._mapId === $gameMap.mapId();
    }

    setupReservedCommonEvent(): boolean {
        if ($gameTemp.isCommonEventReserved()) {
            const commonEvent = $gameTemp.retrieveCommonEvent();
            if (commonEvent) {
                this.setup(commonEvent.list);
                return true;
            }
        }
        return false;
    }

    isRunning(): boolean {
        return !!this._list;
    }

    update(): void {
        while (this.isRunning()) {
            if (this.updateChild() || this.updateWait()) {
                break;
            }
            if (SceneManager.isSceneChanging()) {
                break;
            }
            if (!this.executeCommand()) {
                break;
            }
            if (this.checkFreeze()) {
                break;
            }
        }
    }

    updateChild(): boolean {
        if (this._childInterpreter) {
            this._childInterpreter.update();
            if (this._childInterpreter.isRunning()) {
                return true;
            } else {
                this._childInterpreter = null;
            }
        }
        return false;
    }

    updateWait(): boolean | null {
        return this.updateWaitCount() || this.updateWaitMode();
    }

    updateWaitCount(): boolean {
        if (this._waitCount > 0) {
            this._waitCount--;
            return true;
        }
        return false;
    }

    updateWaitMode(): boolean | null {
        let character = null;
        let waiting = false;
        switch (this._waitMode) {
            case "message":
                waiting = $gameMessage.isBusy();
                break;
            case "transfer":
                waiting = $gamePlayer.isTransferring();
                break;
            case "scroll":
                waiting = $gameMap.isScrolling();
                break;
            case "route":
                character = this.character(this._characterId);
                waiting = (character && character.isMoveRouteForcing()!)!;
                break;
            case "animation":
                character = this.character(this._characterId);
                waiting = (character && character.isAnimationPlaying()!)!;
                break;
            case "balloon":
                character = this.character(this._characterId);
                waiting = (character && character.isBalloonPlaying()!)!;
                break;
            case "gather":
                waiting = $gamePlayer.areFollowersGathering();
                break;
            case "action":
                waiting = BattleManager.isActionForced();
                break;
            case "video":
                waiting = Video.isPlaying();
                break;
            case "image":
                waiting = !ImageManager.isReady();
                break;
        }
        if (!waiting) {
            this._waitMode = "";
        }
        return waiting;
    }

    setWaitMode(waitMode: RMMZ.WaitMode): void {
        this._waitMode = waitMode;
    }

    wait(duration: number): void {
        this._waitCount = duration;
    }

    fadeSpeed(): number {
        return 24;
    }

    executeCommand(): boolean {
        const command = this.currentCommand();
        if (command) {
            this._indent = command.indent;
            const methodName = ("command" + command.code) as `command${RMMZ.CommandCode}`;
            if (typeof this[methodName] === "function") {
                if (!this[methodName](command.parameters)) {
                    return false;
                }
            }
            this._index++;
        } else {
            this.terminate();
        }
        return true;
    }

    checkFreeze(): boolean {
        if (this._frameCount !== Graphics.frameCount) {
            this._frameCount = Graphics.frameCount;
            this._freezeChecker = 0;
        }
        if (this._freezeChecker++ >= 100000) {
            return true;
        } else {
            return false;
        }
    }

    terminate(): void {
        this._list = null;
        this._comments = "";
    }

    skipBranch(): void {
        while (this._list![this._index + 1].indent > this._indent) {
            this._index++;
        }
    }

    currentCommand<T extends RMMZ.CommandCode>(): RMMZ.ExtractDataCommand<T> | undefined {
        return this._list![this._index] as RMMZ.ExtractDataCommand<T> | undefined;
    }

    nextEventCode(): RMMZ.CommandCode {
        const command = this._list![this._index + 1];
        if (command) {
            return command.code;
        } else {
            return 0;
        }
    }

    iterateActorId(param: RMMZ.ActorID, callback: (actor: Game_Actor) => void): void {
        if (param === 0) {
            $gameParty.members().forEach(callback);
        } else {
            const actor = $gameActors.actor(param);
            if (actor) {
                callback(actor);
            }
        }
    }

    iterateActorEx(param1: 0 | 1, param2: RMMZ.ActorID | RMMZ.VariableID, callback: (actor: Game_Actor) => void): void {
        if (param1 === 0) {
            this.iterateActorId(param2, callback);
        } else {
            this.iterateActorId($gameVariables.value(param2), callback);
        }
    }

    iterateActorIndex(param: number, callback: (actor: Game_Actor) => void): void {
        if (param < 0) {
            $gameParty.members().forEach(callback);
        } else {
            const actor = $gameParty.members()[param];
            if (actor) {
                callback(actor);
            }
        }
    }

    iterateEnemyIndex(param: number, callback: (enemy: Game_Enemy) => void): void {
        if (param < 0) {
            $gameTroop.members().forEach(callback);
        } else {
            const enemy = $gameTroop.members()[param];
            if (enemy) {
                callback(enemy);
            }
        }
    }

    iterateBattler(
        param1: 0 | 1,
        param2: RMMZ.EnemyID | RMMZ.ActorID,
        callback: (battler: RMMZ.ActionTarget) => void,
    ): void {
        if ($gameParty.inBattle()) {
            if (param1 === 0) {
                this.iterateEnemyIndex(param2, callback);
            } else {
                this.iterateActorId(param2, callback);
            }
        }
    }

    character(param: RMMZ.CharacterID): Game_Character | null {
        if ($gameParty.inBattle()) {
            return null;
        } else if (param < 0) {
            return $gamePlayer;
        } else if (this.isOnCurrentMap()) {
            return $gameMap.event(param > 0 ? param : this._eventId);
        } else {
            return null;
        }
    }

    // prettier-ignore

    operateValue(
        operation: RMMZ.ValueOperation, operandType: 0 | 1, operand: number | RMMZ.VariableID
    ): number {
        const value = operandType === 0 ? operand : $gameVariables.value(operand);
        return operation === 0 ? value : -value;
    }

    changeHp(target: RMMZ.ActionTarget, value: number, allowDeath: boolean): void {
        if (target.isAlive()) {
            if (!allowDeath && target.hp <= -value) {
                value = 1 - target.hp;
            }
            target.gainHp(value);
            if (target.isDead()) {
                target.performCollapse();
            }
        }
    }

    // Show Text

    command101(params: RMMZ.CommandParams<101>): boolean {
        if ($gameMessage.isBusy()) {
            return false;
        }
        $gameMessage.setFaceImage(params[0], params[1]);
        $gameMessage.setBackground(params[2]);
        $gameMessage.setPositionType(params[3]);
        $gameMessage.setSpeakerName(params[4]);
        while (this.nextEventCode() === 401) {
            // Text data
            this._index++;
            $gameMessage.add(this.currentCommand<401>()!.parameters[0]!);
        }
        switch (this.nextEventCode()) {
            case 102: // Show Choices
                this._index++;
                this.setupChoices(this.currentCommand<102>()!.parameters);
                break;
            case 103: // Input Number
                this._index++;
                this.setupNumInput(this.currentCommand<103>()!.parameters);
                break;
            case 104: // Select Item
                this._index++;
                this.setupItemChoice(this.currentCommand<104>()!.parameters);
                break;
        }
        this.setWaitMode("message");
        return true;
    }

    // Show Choices

    command102(params: RMMZ.CommandParams<102>): boolean {
        if ($gameMessage.isBusy()) {
            return false;
        }
        this.setupChoices(params);
        this.setWaitMode("message");
        return true;
    }

    setupChoices(params: RMMZ.CommandParams<102>): void {
        const choices = params[0].clone();
        const cancelType = params[1] < choices.length ? params[1] : -2;
        const defaultType = params.length > 2 ? params[2] : 0;
        const positionType = params.length > 3 ? params[3] : 2;
        const background = params.length > 4 ? params[4] : 0;
        $gameMessage.setChoices(choices, defaultType, cancelType);
        $gameMessage.setChoiceBackground(background);
        $gameMessage.setChoicePositionType(positionType);
        $gameMessage.setChoiceCallback((n) => {
            this._branch[this._indent] = n;
        });
    }

    // When [**]

    command402(params: RMMZ.CommandParams<402>): boolean {
        if (this._branch[this._indent] !== params[0]) {
            this.skipBranch();
        }
        return true;
    }

    // When Cancel

    command403(): boolean {
        if ((this._branch[this._indent] as number)! >= 0) {
            this.skipBranch();
        }
        return true;
    }

    // Input Number

    command103(params: RMMZ.CommandParams<103>): boolean {
        if ($gameMessage.isBusy()) {
            return false;
        }
        this.setupNumInput(params);
        this.setWaitMode("message");
        return true;
    }

    setupNumInput(params: RMMZ.CommandParams<103>): void {
        $gameMessage.setNumberInput(params[0], params[1]);
    }

    // Select Item

    command104(params: RMMZ.CommandParams<104>): boolean {
        if ($gameMessage.isBusy()) {
            return false;
        }
        this.setupItemChoice(params);
        this.setWaitMode("message");
        return true;
    }

    setupItemChoice(params: RMMZ.CommandParams<104>): void {
        $gameMessage.setItemChoice(params[0], params[1] || 2);
    }

    // Show Scrolling Text

    command105(params: RMMZ.CommandParams<105>): boolean {
        if ($gameMessage.isBusy()) {
            return false;
        }
        $gameMessage.setScroll(params[0], params[1]);
        while (this.nextEventCode() === 405) {
            this._index++;
            $gameMessage.add(this.currentCommand<405>()!.parameters[0]!);
        }
        this.setWaitMode("message");
        return true;
    }

    // Comment

    command108(params: RMMZ.CommandParams<108>): boolean {
        this._comments = [params[0]];
        while (this.nextEventCode() === 408) {
            this._index++;
            this._comments.push(this.currentCommand<408>()!.parameters[0]!);
        }
        return true;
    }

    // Skip

    command109(): boolean {
        this.skipBranch();
        return true;
    }

    // Conditional Branch

    command111(params: RMMZ.CommandParams<111>): boolean {
        let result = false;
        let value1, value2;
        let actor, enemy, character;
        switch (params[0]) {
            case 0: // Switch
                result = $gameSwitches.value(params[1]) === (params[2] === 0);
                break;
            case 1: // Variable
                value1 = $gameVariables.value(params[1]);
                if (params[2] === 0) {
                    value2 = params[3];
                } else {
                    value2 = $gameVariables.value(params[3]);
                }
                switch (params[4]) {
                    case 0: // Equal to
                        result = value1 === value2;
                        break;
                    case 1: // Greater than or Equal to
                        result = value1 >= value2;
                        break;
                    case 2: // Less than or Equal to
                        result = value1 <= value2;
                        break;
                    case 3: // Greater than
                        result = value1 > value2;
                        break;
                    case 4: // Less than
                        result = value1 < value2;
                        break;
                    case 5: // Not Equal to
                        result = value1 !== value2;
                        break;
                }
                break;
            case 2: // Self Switch
                if (this._eventId > 0) {
                    const key: RMMZ.SelfSwitchID = [this._mapId, this._eventId, params[1]];
                    result = $gameSelfSwitches.value(key) === (params[2] === 0);
                }
                break;
            case 3: // Timer
                if ($gameTimer.isWorking()) {
                    const sec = $gameTimer.frames() / 60;
                    if (params[2] === 0) {
                        result = sec >= params[1];
                    } else {
                        result = sec <= params[1];
                    }
                }
                break;
            case 4: // Actor
                actor = $gameActors.actor(params[1]);
                if (actor) {
                    const n = params[3];
                    switch (params[2]) {
                        case 0: // In the Party
                            result = $gameParty.members().includes(actor);
                            break;
                        case 1: // Name
                            result = actor.name() === n;
                            break;
                        case 2: // Class
                            result = actor.isClass($dataClasses[Number(n!)]!);
                            break;
                        case 3: // Skill
                            result = actor.hasSkill(n! as number);
                            break;
                        case 4: // Weapon
                            result = actor.hasWeapon($dataWeapons[Number(n!)]!);
                            break;
                        case 5: // Armor
                            result = actor.hasArmor($dataArmors[Number(n!)]!);
                            break;
                        case 6: // State
                            result = actor.isStateAffected(n! as number);
                            break;
                    }
                }
                break;
            case 5: // Enemy
                enemy = $gameTroop.members()[params[1]];
                if (enemy) {
                    switch (params[2]) {
                        case 0: // Appeared
                            result = enemy.isAlive();
                            break;
                        case 1: // State
                            result = enemy.isStateAffected(params[3]);
                            break;
                    }
                }
                break;
            case 6: // Character
                character = this.character(params[1]);
                if (character) {
                    result = character.direction() === params[2];
                }
                break;
            case 7: // Gold
                switch (params[2]) {
                    case 0: // Greater than or equal to
                        result = $gameParty.gold() >= params[1];
                        break;
                    case 1: // Less than or equal to
                        result = $gameParty.gold() <= params[1];
                        break;
                    case 2: // Less than
                        result = $gameParty.gold() < params[1];
                        break;
                }
                break;
            case 8: // Item
                result = $gameParty.hasItem($dataItems[params[1]]!);
                break;
            case 9: // Weapon
                result = $gameParty.hasItem($dataWeapons[params[1]]!, params[2]);
                break;
            case 10: // Armor
                result = $gameParty.hasItem($dataArmors[params[1]]!, params[2]);
                break;
            case 11: // Button
                switch (params[2] || 0) {
                    case 0:
                        result = Input.isPressed(params[1]);
                        break;
                    case 1:
                        result = Input.isTriggered(params[1]);
                        break;
                    case 2:
                        result = Input.isRepeated(params[1]);
                        break;
                }
                break;
            case 12: // Script
                result = !!eval(params[1]);
                break;
            case 13: // Vehicle
                result = $gamePlayer.vehicle() === $gameMap.vehicle(params[1]);
                break;
        }
        this._branch[this._indent] = result;
        if (this._branch[this._indent] === false) {
            this.skipBranch();
        }
        return true;
    }

    // Else

    command411(): boolean {
        if (this._branch[this._indent] !== false) {
            this.skipBranch();
        }
        return true;
    }

    // Loop

    command112(): boolean {
        return true;
    }

    // Repeat Above

    command413(): boolean {
        do {
            this._index--;
        } while (this.currentCommand()!.indent !== this._indent);
        return true;
    }

    // Break Loop

    command113(): boolean {
        let depth = 0;
        while (this._index < this._list!.length - 1) {
            this._index++;
            const command = this.currentCommand();
            if (command!.code === 112) {
                depth++;
            }
            if (command!.code === 413) {
                if (depth > 0) {
                    depth--;
                } else {
                    break;
                }
            }
        }
        return true;
    }

    // Exit Event Processing

    command115(): boolean {
        this._index = this._list!.length;
        return true;
    }

    // Common Event

    command117(params: RMMZ.CommandParams<117>): boolean {
        const commonEvent = $dataCommonEvents[params[0]];
        if (commonEvent) {
            const eventId = this.isOnCurrentMap() ? this._eventId : 0;
            this.setupChild(commonEvent.list, eventId);
        }
        return true;
    }

    setupChild(list: RMMZ.DataCommand[], eventId: RMMZ.EventID): void {
        this._childInterpreter = new Game_Interpreter(this._depth + 1);
        this._childInterpreter.setup(list, eventId);
    }

    // Label

    command118(): boolean {
        return true;
    }

    // Jump to Label

    command119(params: RMMZ.CommandParams<119>): boolean {
        const labelName = params[0];
        for (let i = 0; i < this._list!.length; i++) {
            const command = this._list![i];
            if (command.code === 118 && command.parameters[0] === labelName) {
                this.jumpTo(i);
                break;
            }
        }
        return true;
    }

    jumpTo(index: number): void {
        const lastIndex = this._index;
        const startIndex = Math.min(index, lastIndex);
        const endIndex = Math.max(index, lastIndex);
        let indent = this._indent;
        for (let i = startIndex; i <= endIndex; i++) {
            const newIndent = this._list![i].indent;
            if (newIndent !== indent) {
                this._branch[indent] = null;
                indent = newIndent;
            }
        }
        this._index = index;
    }

    // Control Switches

    command121(params: RMMZ.CommandParams<121>): boolean {
        for (let i = params[0]; i <= params[1]; i++) {
            $gameSwitches.setValue(i, params[2] === 0);
        }
        return true;
    }

    // Control Variables

    command122(params: RMMZ.CommandParams<122>): boolean {
        const startId = params[0];
        const endId = params[1];
        const operationType = params[2];
        const operand = params[3];
        let value = 0;
        let randomMax = 1;
        switch (operand) {
            case 0: // Constant
                value = params[4];
                break;
            case 1: // Variable
                value = $gameVariables.value(params[4]);
                break;
            case 2: // Random
                value = params[4];
                randomMax = params[5] - params[4] + 1;
                randomMax = Math.max(randomMax, 1);
                break;
            case 3: // Game Data
                value = this.gameDataOperand(params[4], params[5], params[6]);
                break;
            case 4: // Script
                value = eval(params[4]);
                break;
        }
        for (let i = startId; i <= endId; i++) {
            if (typeof value === "number") {
                const realValue = value + Math.randomInt(randomMax);
                this.operateVariable(i, operationType, realValue);
            } else {
                this.operateVariable(i, operationType, value);
            }
        }
        return true;
    }

    gameDataOperand(type: number, param1: number, param2?: number): number {
        let actor, enemy, character;
        switch (type) {
            case 0: // Item
                return $gameParty.numItems($dataItems[Number(param1)]);
            case 1: // Weapon
                return $gameParty.numItems($dataWeapons[Number(param1)]);
            case 2: // Armor
                return $gameParty.numItems($dataArmors[Number(param1)]);
            case 3: // Actor
                actor = $gameActors.actor(param1);
                if (actor) {
                    switch (param2) {
                        case 0: // Level
                            return actor.level;
                        case 1: // EXP
                            return actor.currentExp();
                        case 2: // HP
                            return actor.hp;
                        case 3: // MP
                            return actor.mp;
                        case 12: // TP
                            return actor.tp;
                        default:
                            // Parameter
                            if (param2! >= 4 && param2! <= 11) {
                                return actor.param((param2! - 4) as RMMZ.ParamID);
                            }
                    }
                }
                break;
            case 4: // Enemy
                enemy = $gameTroop.members()[param1];
                if (enemy) {
                    switch (param2) {
                        case 0: // HP
                            return enemy.hp;
                        case 1: // MP
                            return enemy.mp;
                        case 10: // TP
                            return enemy.tp;
                        default:
                            // Parameter
                            if (param2! >= 2 && param2! <= 9) {
                                return enemy.param((param2! - 2) as RMMZ.ParamID);
                            }
                    }
                }
                break;
            case 5: // Character
                character = this.character(param1);
                if (character) {
                    switch (param2) {
                        case 0: // Map X
                            return character.x;
                        case 1: // Map Y
                            return character.y;
                        case 2: // Direction
                            return character.direction();
                        case 3: // Screen X
                            return character.screenX();
                        case 4: // Screen Y
                            return character.screenY();
                    }
                }
                break;
            case 6: // Party
                actor = $gameParty.members()[param1];
                return actor ? actor.actorId() : 0;
            case 8: // Last
                return $gameTemp.lastActionData(param1 as RMMZ.ActionDataType);
            case 7: // Other
                switch (param1) {
                    case 0: // Map ID
                        return $gameMap.mapId();
                    case 1: // Party Members
                        return $gameParty.size();
                    case 2: // Gold
                        return $gameParty.gold();
                    case 3: // Steps
                        return $gameParty.steps();
                    case 4: // Play Time
                        return $gameSystem.playtime();
                    case 5: // Timer
                        return $gameTimer.seconds();
                    case 6: // Save Count
                        return $gameSystem.saveCount();
                    case 7: // Battle Count
                        return $gameSystem.battleCount();
                    case 8: // Win Count
                        return $gameSystem.winCount();
                    case 9: // Escape Count
                        return $gameSystem.escapeCount();
                }
                break;
        }
        return 0;
    }

    operateVariable(variableId: RMMZ.VariableID, operationType: RMMZ.VariableOperationType, value: number): void {
        try {
            const oldValue = $gameVariables.value(variableId);
            switch (operationType) {
                case 0: // Set
                    $gameVariables.setValue(variableId, value);
                    break;
                case 1: // Add
                    $gameVariables.setValue(variableId, oldValue + value);
                    break;
                case 2: // Sub
                    $gameVariables.setValue(variableId, oldValue - value);
                    break;
                case 3: // Mul
                    $gameVariables.setValue(variableId, oldValue * value);
                    break;
                case 4: // Div
                    $gameVariables.setValue(variableId, oldValue / value);
                    break;
                case 5: // Mod
                    $gameVariables.setValue(variableId, oldValue % value);
                    break;
            }
        } catch {
            $gameVariables.setValue(variableId, 0);
        }
    }

    // Control Self Switch

    command123(params: RMMZ.CommandParams<123>): boolean {
        if (this._eventId > 0) {
            const key: RMMZ.SelfSwitchID = [this._mapId, this._eventId, params[0]];
            $gameSelfSwitches.setValue(key, params[1] === 0);
        }
        return true;
    }

    // Control Timer

    command124(params: RMMZ.CommandParams<124>): boolean {
        if (params[0] === 0) {
            // Start
            $gameTimer.start(params[1] * 60);
        } else {
            // Stop
            $gameTimer.stop();
        }
        return true;
    }

    // Change Gold

    command125(params: RMMZ.CommandParams<125>): boolean {
        const value = this.operateValue(params[0], params[1], params[2]);
        $gameParty.gainGold(value);
        return true;
    }

    // Change Items

    command126(params: RMMZ.CommandParams<126>): boolean {
        const value = this.operateValue(params[1], params[2], params[3]);
        $gameParty.gainItem($dataItems[params[0]], value);
        return true;
    }

    // Change Weapons

    command127(params: RMMZ.CommandParams<127>): boolean {
        const value = this.operateValue(params[1], params[2], params[3]);
        $gameParty.gainItem($dataWeapons[params[0]], value, params[4]);
        return true;
    }

    // Change Armors

    command128(params: RMMZ.CommandParams<128>): boolean {
        const value = this.operateValue(params[1], params[2], params[3]);
        $gameParty.gainItem($dataArmors[params[0]], value, params[4]);
        return true;
    }

    // Change Party Member

    command129(params: RMMZ.CommandParams<129>): boolean {
        const actor = $gameActors.actor(params[0]);
        if (actor) {
            if (params[1] === 0) {
                // Add
                if (params[2]) {
                    // Initialize
                    $gameActors.actor(params[0])!.setup(params[0]);
                }
                $gameParty.addActor(params[0]);
            } else {
                // Remove
                $gameParty.removeActor(params[0]);
            }
        }
        return true;
    }

    // Change Battle BGM

    command132(params: RMMZ.CommandParams<132>): boolean {
        $gameSystem.setBattleBgm(params[0]);
        return true;
    }

    // Change Victory ME

    command133(params: RMMZ.CommandParams<133>): boolean {
        $gameSystem.setVictoryMe(params[0]);
        return true;
    }

    // Change Save Access

    command134(params: RMMZ.CommandParams<134>): boolean {
        if (params[0] === 0) {
            $gameSystem.disableSave();
        } else {
            $gameSystem.enableSave();
        }
        return true;
    }

    // Change Menu Access

    command135(params: RMMZ.CommandParams<135>): boolean {
        if (params[0] === 0) {
            $gameSystem.disableMenu();
        } else {
            $gameSystem.enableMenu();
        }
        return true;
    }

    // Change Encounter

    command136(params: RMMZ.CommandParams<136>): boolean {
        if (params[0] === 0) {
            $gameSystem.disableEncounter();
        } else {
            $gameSystem.enableEncounter();
        }
        $gamePlayer.makeEncounterCount();
        return true;
    }

    // Change Formation Access

    command137(params: RMMZ.CommandParams<137>): boolean {
        if (params[0] === 0) {
            $gameSystem.disableFormation();
        } else {
            $gameSystem.enableFormation();
        }
        return true;
    }

    // Change Window Color

    command138(params: RMMZ.CommandParams<138>): boolean {
        $gameSystem.setWindowTone(params[0]);
        return true;
    }

    // Change Defeat ME

    command139(params: RMMZ.CommandParams<139>): boolean {
        $gameSystem.setDefeatMe(params[0]);
        return true;
    }

    // Change Vehicle BGM

    command140(params: RMMZ.CommandParams<140>): boolean {
        const vehicle = $gameMap.vehicle(params[0]);
        if (vehicle) {
            vehicle.setBgm(params[1]);
        }
        return true;
    }

    // Transfer Player

    command201(params: RMMZ.CommandParams<201>): boolean {
        if ($gameParty.inBattle() || $gameMessage.isBusy()) {
            return false;
        }
        let mapId, x, y;
        if (params[0] === 0) {
            // Direct designation
            mapId = params[1];
            x = params[2];
            y = params[3];
        } else {
            // Designation with variables
            mapId = $gameVariables.value(params[1]);
            x = $gameVariables.value(params[2]);
            y = $gameVariables.value(params[3]);
        }
        $gamePlayer.reserveTransfer(mapId, x, y, params[4], params[5]);
        this.setWaitMode("transfer");
        return true;
    }

    // Set Vehicle Location

    command202(params: RMMZ.CommandParams<202>): boolean {
        let mapId, x, y;
        if (params[1] === 0) {
            // Direct designation
            mapId = params[2];
            x = params[3];
            y = params[4];
        } else {
            // Designation with variables
            mapId = $gameVariables.value(params[2]);
            x = $gameVariables.value(params[3]);
            y = $gameVariables.value(params[4]);
        }
        const vehicle = $gameMap.vehicle(params[0]);
        if (vehicle) {
            vehicle.setLocation(mapId, x, y);
        }
        return true;
    }

    // Set Event Location

    command203(params: RMMZ.CommandParams<203>): boolean {
        const character = this.character(params[0]);
        if (character) {
            if (params[1] === 0) {
                // Direct designation
                character.locate(params[2], params[3]);
            } else if (params[1] === 1) {
                // Designation with variables
                const x = $gameVariables.value(params[2]);
                const y = $gameVariables.value(params[3]);
                character.locate(x, y);
            } else {
                // Exchange with another event
                const character2 = this.character(params[2]);
                if (character2) {
                    character.swap(character2);
                }
            }
            if (params[4] > 0) {
                character.setDirection(params[4]);
            }
        }
        return true;
    }

    // Scroll Map

    command204(params: RMMZ.CommandParams<204>): boolean {
        if (!$gameParty.inBattle()) {
            if ($gameMap.isScrolling()) {
                this.setWaitMode("scroll");
                return false;
            }
            $gameMap.startScroll(params[0], params[1], params[2]);
            if (params[3]) {
                this.setWaitMode("scroll");
            }
        }
        return true;
    }

    // Set Movement Route

    command205(params: RMMZ.CommandParams<205>): boolean {
        $gameMap.refreshIfNeeded();
        this._characterId = params[0];
        const character = this.character(this._characterId);
        if (character) {
            character.forceMoveRoute(params[1]);
            if (params[1].wait) {
                this.setWaitMode("route");
            }
        }
        return true;
    }

    // Get on/off Vehicle

    command206(): boolean {
        $gamePlayer.getOnOffVehicle();
        return true;
    }

    // Change Transparency

    command211(params: RMMZ.CommandParams<211>): boolean {
        $gamePlayer.setTransparent(params[0] === 0);
        return true;
    }

    // Show Animation

    command212(params: RMMZ.CommandParams<212>): boolean {
        this._characterId = params[0];
        const character = this.character(this._characterId);
        if (character) {
            $gameTemp.requestAnimation([character], params[1]);
            if (params[2]) {
                this.setWaitMode("animation");
            }
        }
        return true;
    }

    // Show Balloon Icon

    command213(params: RMMZ.CommandParams<213>): boolean {
        this._characterId = params[0];
        const character = this.character(this._characterId);
        if (character) {
            $gameTemp.requestBalloon(character, params[1]);
            if (params[2]) {
                this.setWaitMode("balloon");
            }
        }
        return true;
    }

    // Erase Event

    command214(): boolean {
        if (this.isOnCurrentMap() && this._eventId > 0) {
            $gameMap.eraseEvent(this._eventId);
        }
        return true;
    }

    // Change Player Followers

    command216(params: RMMZ.CommandParams<216>): boolean {
        if (params[0] === 0) {
            $gamePlayer.showFollowers();
        } else {
            $gamePlayer.hideFollowers();
        }
        $gamePlayer.refresh();
        return true;
    }

    // Gather Followers

    command217(): boolean {
        if (!$gameParty.inBattle()) {
            $gamePlayer.gatherFollowers();
            this.setWaitMode("gather");
        }
        return true;
    }

    // Fadeout Screen

    command221(): boolean {
        if ($gameMessage.isBusy()) {
            return false;
        }
        $gameScreen.startFadeOut(this.fadeSpeed());
        this.wait(this.fadeSpeed());
        return true;
    }

    // Fadein Screen

    command222(): boolean {
        if ($gameMessage.isBusy()) {
            return false;
        }
        $gameScreen.startFadeIn(this.fadeSpeed());
        this.wait(this.fadeSpeed());
        return true;
    }

    // Tint Screen

    command223(params: RMMZ.CommandParams<223>): boolean {
        $gameScreen.startTint(params[0], params[1]);
        if (params[2]) {
            this.wait(params[1]);
        }
        return true;
    }

    // Flash Screen

    command224(params: RMMZ.CommandParams<224>): boolean {
        $gameScreen.startFlash(params[0], params[1]);
        if (params[2]) {
            this.wait(params[1]);
        }
        return true;
    }

    // Shake Screen

    command225(params: RMMZ.CommandParams<225>): boolean {
        $gameScreen.startShake(params[0], params[1], params[2]);
        if (params[3]) {
            this.wait(params[2]);
        }
        return true;
    }

    // Wait

    command230(params: RMMZ.CommandParams<230>): boolean {
        this.wait(params[0]);
        return true;
    }

    // Show Picture

    command231(params: RMMZ.CommandParams<231>): boolean {
        const point = this.picturePoint(params);
        // prettier-ignore
        $gameScreen.showPicture(
            params[0], params[1], params[2], point.x, point.y,
            params[6], params[7], params[8], (params[9])
        );
        return true;
    }

    // Move Picture

    command232(params: RMMZ.CommandParams<232>): boolean {
        const point = this.picturePoint(params);
        // prettier-ignore
        $gameScreen.movePicture(
            params[0], params[2], point.x, point.y, params[6], params[7],
            params[8], (params[9]), params[10], params[12] || 0
        );
        if (params[11]) {
            this.wait(params[10]);
        }
        return true;
    }

    picturePoint(params: RMMZ.CommandParams<231 | 232>): Point {
        const point = new PIXI.Point();
        if (params[3] === 0) {
            // Direct designation
            point.x = params[4];
            point.y = params[5];
        } else {
            // Designation with variables
            point.x = $gameVariables.value(params[4]);
            point.y = $gameVariables.value(params[5]);
        }
        return point;
    }

    // Rotate Picture

    command233(params: RMMZ.CommandParams<233>): boolean {
        $gameScreen.rotatePicture(params[0], params[1]);
        return true;
    }

    // Tint Picture

    command234(params: RMMZ.CommandParams<234>): boolean {
        $gameScreen.tintPicture(params[0], params[1], params[2]);
        if (params[3]) {
            this.wait(params[2]);
        }
        return true;
    }

    // Erase Picture

    command235(params: RMMZ.CommandParams<235>): boolean {
        $gameScreen.erasePicture(params[0]);
        return true;
    }

    // Set Weather Effect

    command236(params: RMMZ.CommandParams<236>): boolean {
        if (!$gameParty.inBattle()) {
            $gameScreen.changeWeather(params[0], params[1], params[2]);
            if (params[3]) {
                this.wait(params[2]);
            }
        }
        return true;
    }

    // Play BGM

    command241(params: RMMZ.CommandParams<241>): boolean {
        AudioManager.playBgm(params[0]);
        return true;
    }

    // Fadeout BGM

    command242(params: RMMZ.CommandParams<242>): boolean {
        AudioManager.fadeOutBgm(params[0]);
        return true;
    }

    // Save BGM

    command243(): boolean {
        $gameSystem.saveBgm();
        return true;
    }

    // Resume BGM

    command244(): boolean {
        $gameSystem.replayBgm();
        return true;
    }

    // Play BGS

    command245(params: RMMZ.CommandParams<245>): boolean {
        AudioManager.playBgs(params[0]);
        return true;
    }

    // Fadeout BGS

    command246(params: RMMZ.CommandParams<246>): boolean {
        AudioManager.fadeOutBgs(params[0]);
        return true;
    }

    // Play ME

    command249(params: RMMZ.CommandParams<249>): boolean {
        AudioManager.playMe(params[0]);
        return true;
    }

    // Play SE

    command250(params: RMMZ.CommandParams<250>): boolean {
        AudioManager.playSe(params[0]);
        return true;
    }

    // Stop SE

    command251(): boolean {
        AudioManager.stopSe();
        return true;
    }

    // Play Movie

    command261(params: RMMZ.CommandParams<261>): boolean {
        if ($gameMessage.isBusy()) {
            return false;
        }
        const name = params[0];
        if (name.length > 0) {
            const ext = this.videoFileExt();
            Video.play("movies/" + name + ext);
            this.setWaitMode("video");
        }
        return true;
    }

    videoFileExt(): ".webm" | ".mp4" {
        if (Utils.canPlayWebm()) {
            return ".webm";
        } else {
            return ".mp4";
        }
    }

    // Change Map Name Display

    command281(params: RMMZ.CommandParams<281>): boolean {
        if (params[0] === 0) {
            $gameMap.enableNameDisplay();
        } else {
            $gameMap.disableNameDisplay();
        }
        return true;
    }

    // Change Tileset

    command282(params: RMMZ.CommandParams<282>): boolean {
        const tileset = $dataTilesets[params[0]];
        const allReady = tileset!.tilesetNames
            .map((tilesetName) => ImageManager.loadTileset(tilesetName))
            .every((bitmap) => bitmap.isReady());
        if (allReady) {
            $gameMap.changeTileset(params[0]);
            return true;
        } else {
            return false;
        }
    }

    // Change Battle Background

    command283(params: RMMZ.CommandParams<283>): boolean {
        $gameMap.changeBattleback(params[0], params[1]);
        return true;
    }

    // Change Parallax

    command284(params: RMMZ.CommandParams<284>): boolean {
        // prettier-ignore
        $gameMap.changeParallax(
            params[0], params[1], params[2], params[3], params[4]
        );
        return true;
    }

    // Get Location Info

    command285(params: RMMZ.CommandParams<285>): boolean {
        let x, y, value;
        if (params[2] === 0) {
            // Direct designation
            x = params[3];
            y = params[4];
        } else if (params[2] === 1) {
            // Designation with variables
            x = $gameVariables.value(params[3]);
            y = $gameVariables.value(params[4]);
        } else {
            // Designation by a character
            const character = this.character(params[3]);
            x = character!.x;
            y = character!.y;
        }
        switch (params[1]) {
            case 0: // Terrain Tag
                value = $gameMap.terrainTag(x, y);
                break;
            case 1: // Event ID
                value = $gameMap.eventIdXy(x, y);
                break;
            case 2: // Tile ID (Layer 1)
            case 3: // Tile ID (Layer 2)
            case 4: // Tile ID (Layer 3)
            case 5: // Tile ID (Layer 4)
                value = $gameMap.tileId(x, y, params[1] - 2);
                break;
            default:
                // Region ID
                value = $gameMap.regionId(x, y);
                break;
        }
        $gameVariables.setValue(params[0], value);
        return true;
    }

    // Battle Processing

    command301(params: RMMZ.CommandParams<301>): boolean {
        if (!$gameParty.inBattle()) {
            let troopId;
            if (params[0] === 0) {
                // Direct designation
                troopId = params[1];
            } else if (params[0] === 1) {
                // Designation with a variable
                troopId = $gameVariables.value(params[1]);
            } else {
                // Same as Random Encounters
                troopId = $gamePlayer.makeEncounterTroopId();
            }
            if ($dataTroops[troopId]) {
                BattleManager.setup(troopId, params[2], params[3]);
                BattleManager.setEventCallback((n) => {
                    this._branch[this._indent] = n;
                });
                $gamePlayer.makeEncounterCount();
                SceneManager.push(Scene_Battle);
            }
        }
        return true;
    }

    // If Win

    command601(): boolean {
        if (this._branch[this._indent] !== 0) {
            this.skipBranch();
        }
        return true;
    }

    // If Escape

    command602(): boolean {
        if (this._branch[this._indent] !== 1) {
            this.skipBranch();
        }
        return true;
    }

    // If Lose

    command603(): boolean {
        if (this._branch[this._indent] !== 2) {
            this.skipBranch();
        }
        return true;
    }

    // Shop Processing

    command302(params: RMMZ.CommandParams<302>): boolean {
        if (!$gameParty.inBattle()) {
            const goods: RMMZ.ShopGoodsEntry[] = [params];
            while (this.nextEventCode() === 605) {
                this._index++;
                goods.push(this.currentCommand<605>()!.parameters);
            }
            SceneManager.push(Scene_Shop);
            SceneManager.prepareNextScene(goods, params[4]);
        }
        return true;
    }

    // Name Input Processing

    command303(params: RMMZ.CommandParams<303>): boolean {
        if (!$gameParty.inBattle()) {
            if ($dataActors[params[0]]) {
                SceneManager.push(Scene_Name);
                SceneManager.prepareNextScene(params[0], params[1]);
            }
        }
        return true;
    }

    // Change HP

    command311(params: RMMZ.CommandParams<311>): boolean {
        const value = this.operateValue(params[2], params[3], params[4]);
        this.iterateActorEx(params[0], params[1], (actor) => {
            this.changeHp(actor, value, params[5]);
        });
        return true;
    }

    // Change MP

    command312(params: RMMZ.CommandParams<312>): boolean {
        const value = this.operateValue(params[2], params[3], params[4]);
        this.iterateActorEx(params[0], params[1], (actor) => {
            actor.gainMp(value);
        });
        return true;
    }

    // Change TP

    command326(params: RMMZ.CommandParams<326>): boolean {
        const value = this.operateValue(params[2], params[3], params[4]);
        this.iterateActorEx(params[0], params[1], (actor) => {
            actor.gainTp(value);
        });
        return true;
    }

    // Change State

    command313(params: RMMZ.CommandParams<313>): boolean {
        this.iterateActorEx(params[0], params[1], (actor) => {
            const alreadyDead = actor.isDead();
            if (params[2] === 0) {
                actor.addState(params[3]);
            } else {
                actor.removeState(params[3]);
            }
            if (actor.isDead() && !alreadyDead) {
                actor.performCollapse();
            }
            actor.clearResult();
        });
        return true;
    }

    // Recover All

    command314(params: RMMZ.CommandParams<314>): boolean {
        this.iterateActorEx(params[0], params[1], (actor) => {
            actor.recoverAll();
        });
        return true;
    }

    // Change EXP

    command315(params: RMMZ.CommandParams<315>): boolean {
        const value = this.operateValue(params[2], params[3], params[4]);
        this.iterateActorEx(params[0], params[1], (actor) => {
            actor.changeExp(actor.currentExp() + value, params[5]);
        });
        return true;
    }

    // Change Level

    command316(params: RMMZ.CommandParams<316>): boolean {
        const value = this.operateValue(params[2], params[3], params[4]);
        this.iterateActorEx(params[0], params[1], (actor) => {
            actor.changeLevel(actor.level + value, params[5]);
        });
        return true;
    }

    // Change Parameter

    command317(params: RMMZ.CommandParams<317>): boolean {
        const value = this.operateValue(params[3], params[4], params[5]);
        this.iterateActorEx(params[0], params[1], (actor) => {
            actor.addParam(params[2], value);
        });
        return true;
    }

    // Change Skill

    command318(params: RMMZ.CommandParams<318>): boolean {
        this.iterateActorEx(params[0], params[1], (actor) => {
            if (params[2] === 0) {
                actor.learnSkill(params[3]);
            } else {
                actor.forgetSkill(params[3]);
            }
        });
        return true;
    }

    // Change Equipment

    command319(params: RMMZ.CommandParams<319>): boolean {
        const actor = $gameActors.actor(params[0]);
        if (actor) {
            actor.changeEquipById(params[1], params[2]);
        }
        return true;
    }

    // Change Name

    command320(params: RMMZ.CommandParams<320>): boolean {
        const actor = $gameActors.actor(params[0]);
        if (actor) {
            actor.setName(params[1]);
        }
        return true;
    }

    // Change Class

    command321(params: RMMZ.CommandParams<321>): boolean {
        const actor = $gameActors.actor(params[0]);
        if (actor && $dataClasses[params[1]]) {
            actor.changeClass(params[1], params[2]);
        }
        return true;
    }

    // Change Actor Images

    command322(params: RMMZ.CommandParams<322>): boolean {
        const actor = $gameActors.actor(params[0]);
        if (actor) {
            actor.setCharacterImage(params[1], params[2]);
            actor.setFaceImage(params[3], params[4]);
            actor.setBattlerImage(params[5]);
        }
        $gamePlayer.refresh();
        return true;
    }

    // Change Vehicle Image

    command323(params: RMMZ.CommandParams<323>): boolean {
        const vehicle = $gameMap.vehicle(params[0]);
        if (vehicle) {
            vehicle.setImage(params[1], params[2]);
        }
        return true;
    }

    // Change Nickname

    command324(params: RMMZ.CommandParams<324>): boolean {
        const actor = $gameActors.actor(params[0]);
        if (actor) {
            actor.setNickname(params[1]);
        }
        return true;
    }

    // Change Profile

    command325(params: RMMZ.CommandParams<325>): boolean {
        const actor = $gameActors.actor(params[0]);
        if (actor) {
            actor.setProfile(params[1]);
        }
        return true;
    }

    // Change Enemy HP

    command331(params: RMMZ.CommandParams<331>): boolean {
        const value = this.operateValue(params[1], params[2], params[3]);
        this.iterateEnemyIndex(params[0], (enemy) => {
            this.changeHp(enemy, value, params[4]);
        });
        return true;
    }

    // Change Enemy MP

    command332(params: RMMZ.CommandParams<332>): boolean {
        const value = this.operateValue(params[1], params[2], params[3]);
        this.iterateEnemyIndex(params[0], (enemy) => {
            enemy.gainMp(value);
        });
        return true;
    }

    // Change Enemy TP

    command342(params: RMMZ.CommandParams<342>): boolean {
        const value = this.operateValue(params[1], params[2], params[3]);
        this.iterateEnemyIndex(params[0], (enemy) => {
            enemy.gainTp(value);
        });
        return true;
    }

    // Change Enemy State

    command333(params: RMMZ.CommandParams<333>): boolean {
        this.iterateEnemyIndex(params[0], (enemy) => {
            const alreadyDead = enemy.isDead();
            if (params[1] === 0) {
                enemy.addState(params[2]);
            } else {
                enemy.removeState(params[2]);
            }
            if (enemy.isDead() && !alreadyDead) {
                enemy.performCollapse();
            }
            enemy.clearResult();
        });
        return true;
    }

    // Enemy Recover All

    command334(params: RMMZ.CommandParams<334>): boolean {
        this.iterateEnemyIndex(params[0], (enemy) => {
            enemy.recoverAll();
        });
        return true;
    }

    // Enemy Appear

    command335(params: RMMZ.CommandParams<335>): boolean {
        this.iterateEnemyIndex(params[0], (enemy) => {
            enemy.appear();
            $gameTroop.makeUniqueNames();
        });
        return true;
    }

    // Enemy Transform

    command336(params: RMMZ.CommandParams<336>): boolean {
        this.iterateEnemyIndex(params[0], (enemy) => {
            enemy.transform(params[1]);
            $gameTroop.makeUniqueNames();
        });
        return true;
    }

    // Show Battle Animation

    command337(params: RMMZ.CommandParams<337>): boolean {
        let param = params[0];
        if (params[2]) {
            param = -1;
        }
        const targets: RMMZ.AnimationTarget[] = [];
        this.iterateEnemyIndex(param, (enemy) => {
            if (enemy.isAlive()) {
                targets.push(enemy);
            }
        });
        $gameTemp.requestAnimation(targets, params[1]);
        return true;
    }

    // Force Action

    command339(params: RMMZ.CommandParams<339>): boolean {
        this.iterateBattler(params[0], params[1], (battler) => {
            if (!battler.isDeathStateAffected()) {
                battler.forceAction(params[2], params[3]);
                BattleManager.forceAction(battler);
                this.setWaitMode("action");
            }
        });
        return true;
    }

    // Abort Battle

    command340(): boolean {
        BattleManager.abort();
        return true;
    }

    // Open Menu Screen

    command351(): boolean {
        if (!$gameParty.inBattle()) {
            SceneManager.push(Scene_Menu);
            Window_MenuCommand.initCommandPosition();
        }
        return true;
    }

    // Open Save Screen

    command352(): boolean {
        if (!$gameParty.inBattle()) {
            SceneManager.push(Scene_Save);
        }
        return true;
    }

    // Game Over

    command353(): boolean {
        SceneManager.goto(Scene_Gameover);
        return true;
    }

    // Return to Title Screen

    command354(): boolean {
        SceneManager.goto(Scene_Title);
        return true;
    }

    // Script

    command355(): boolean {
        let script = this.currentCommand<655>()!.parameters[0] + "\n";
        while (this.nextEventCode() === 655) {
            this._index++;
            script += this.currentCommand<655>()!.parameters[0] + "\n";
        }
        eval(script);
        return true;
    }

    // Plugin Command MV (deprecated)

    command356(params: RMMZ.CommandParams<356>): boolean {
        const args = params[0].split(" ");
        const command = args.shift();
        this.pluginCommand(command, args);
        return true;
    }

    pluginCommand(..._extra: any[]): void;
    pluginCommand(): void {
        // deprecated
    }

    // Plugin Command

    command357(params: RMMZ.CommandParams<357>): boolean {
        const pluginName = Utils.extractFileName(params[0]);
        PluginManager.callCommand(this, pluginName, params[1], params[3]);
        return true;
    }
}
