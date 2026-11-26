// rmmz_objects.js v1.10.0

/**
 * The game object class for temporary data that is not included in save data.
 */
class Game_Temp {
    constructor(...args) {
        this.initialize(...args);
    }

    initialize() {
        /** @type {boolean} */
        this._isPlaytest = Utils.isOptionValid("test");
        /** @type {number | null} */
        this._destinationX = null;
        /** @type {number | null} */
        this._destinationY = null;
        /** @type {Game_Battler | null} */
        this._touchTarget = null;
        /** @type {"" | "select" | "click"} */
        this._touchState = "";
        /** @type {boolean} */
        this._needsBattleRefresh = false;
        /** @type {RMMZ.CommonEventID[]} */
        this._commonEventQueue = [];
        /** @type {RMMZ.AnimationRequest[]} */
        this._animationQueue = [];
        /** @type {RMMZ.BalloonRequest[]} */
        this._balloonQueue = [];
        /** @type {[ RMMZ.SkillID, RMMZ.ItemID, RMMZ.ActorID, RMMZ.EnemyID, RMMZ.ActorID, RMMZ.EnemyID ]} */
        this._lastActionData = [0, 0, 0, 0, 0, 0];
    }

    /** @returns {boolean} */
    isPlaytest() {
        return this._isPlaytest;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    setDestination(x, y) {
        this._destinationX = x;
        this._destinationY = y;
    }

    /** @returns {void} */
    clearDestination() {
        this._destinationX = null;
        this._destinationY = null;
    }

    /** @returns {boolean} */
    isDestinationValid() {
        return this._destinationX !== null;
    }

    /** @returns {number | null} */
    destinationX() {
        return this._destinationX;
    }

    /** @returns {number | null} */
    destinationY() {
        return this._destinationY;
    }

    /**
     * @param {Game_Battler} target
     * @param {"select" | "click"} state
     * @returns {void}
     */
    setTouchState(target, state) {
        this._touchTarget = target;
        this._touchState = state;
    }

    /** @returns {void} */
    clearTouchState() {
        this._touchTarget = null;
        this._touchState = "";
    }

    /** @returns {Game_Battler | null} */
    touchTarget() {
        return this._touchTarget;
    }

    /** @returns {string} */
    touchState() {
        return this._touchState;
    }

    /** @returns {void} */
    requestBattleRefresh() {
        if ($gameParty.inBattle()) {
            this._needsBattleRefresh = true;
        }
    }

    /** @returns {void} */
    clearBattleRefreshRequest() {
        this._needsBattleRefresh = false;
    }

    /** @returns {boolean} */
    isBattleRefreshRequested() {
        return this._needsBattleRefresh;
    }

    /**
     * @param {RMMZ.CommonEventID} commonEventId
     * @returns {void}
     */
    reserveCommonEvent(commonEventId) {
        this._commonEventQueue.push(commonEventId);
    }

    /** @returns {import("../data").DataCommonEvent} */
    retrieveCommonEvent() {
        return $dataCommonEvents[this._commonEventQueue.shift()];
    }

    /** @returns {void} */
    clearCommonEventReservation() {
        this._commonEventQueue.length = 0;
    }

    /** @returns {boolean} */
    isCommonEventReserved() {
        return this._commonEventQueue.length > 0;
    }

    // prettier-ignore
    /**
     * @param {(Game_Character | Game_Battler)[]} targets
     * @param {RMMZ.AnimationID} animationId
     * @param {boolean} [mirror]
     * @returns {void}
     */
    requestAnimation(
        targets, animationId, mirror = false
    ) {
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

    /** @returns {RMMZ.AnimationRequest | undefined} */
    retrieveAnimation() {
        return this._animationQueue.shift();
    }

    /**
     * @param {Game_Character} target
     * @param {RMMZ.BalloonIconID} balloonId
     * @returns {void}
     */
    requestBalloon(target, balloonId) {
        const request = { target: target, balloonId: balloonId };
        this._balloonQueue.push(request);
        if (target.startBalloon) {
            target.startBalloon();
        }
    }

    /** @returns {RMMZ.BalloonRequest | undefined} */
    retrieveBalloon() {
        return this._balloonQueue.shift();
    }

    /**
     * @param {RMMZ.ActionDataType} type
     * @returns {number}
     */
    lastActionData(type) {
        return this._lastActionData[type] || 0;
    }

    /**
     * @param {RMMZ.ActionDataType} type
     * @param {number} value
     * @returns {void}
     */
    setLastActionData(type, value) {
        this._lastActionData[type] = value;
    }

    /**
     * @param {RMMZ.SkillID} skillID
     * @returns {void}
     */
    setLastUsedSkillId(skillID) {
        this.setLastActionData(0, skillID);
    }

    /**
     * @param {RMMZ.ItemID} itemID
     * @returns {void}
     */
    setLastUsedItemId(itemID) {
        this.setLastActionData(1, itemID);
    }

    /**
     * @param {RMMZ.ActorID} actorID
     * @returns {void}
     */
    setLastSubjectActorId(actorID) {
        this.setLastActionData(2, actorID);
    }

    /**
     * @param {RMMZ.EnemyID} enemyIndex
     * @returns {void}
     */
    setLastSubjectEnemyIndex(enemyIndex) {
        this.setLastActionData(3, enemyIndex);
    }

    /**
     * @param {RMMZ.ActorID} actorID
     * @returns {void}
     */
    setLastTargetActorId(actorID) {
        this.setLastActionData(4, actorID);
    }

    /**
     * @param {RMMZ.EnemyID} enemyIndex
     * @returns {void}
     */
    setLastTargetEnemyIndex(enemyIndex) {
        this.setLastActionData(5, enemyIndex);
    }
}

/**
 * The game object class for the system data.
 */
class Game_System {
    constructor(...args) {
        this.initialize(...args);
    }

    initialize() {
        /** @type {boolean} */
        this._saveEnabled = true;
        /** @type {boolean} */
        this._menuEnabled = true;
        /** @type {boolean} */
        this._encounterEnabled = true;
        /** @type {boolean} */
        this._formationEnabled = true;
        /** @type {number} */
        this._battleCount = 0;
        /** @type {number} */
        this._winCount = 0;
        /** @type {number} */
        this._escapeCount = 0;
        /** @type {number} */
        this._saveCount = 0;
        /** @type {number} */
        this._versionId = 0;
        /** @type {number} */
        this._savefileId = 0;
        /** @type {number} */
        this._framesOnSave = 0;
        /** @type {RMMZ.DataAudio | null} */
        this._bgmOnSave = null;
        /** @type {RMMZ.DataAudio | null} */
        this._bgsOnSave = null;
        /** @type {RMMZ.Color | null} */
        this._windowTone = null;
        /** @type {RMMZ.DataAudio | null} */
        this._battleBgm = null;
        /** @type {RMMZ.DataAudio | null} */
        this._victoryMe = null;
        /** @type {RMMZ.DataAudio | null} */
        this._defeatMe = null;
        /** @type {RMMZ.DataAudio | null} */
        this._savedBgm = null;
        /** @type {RMMZ.DataAudio | null} */
        this._walkingBgm = null;
    }

    /** @returns {RegExpMatchArray | null} */
    isJapanese() {
        return $dataSystem.locale.match(/^ja/);
    }

    /** @returns {RegExpMatchArray | null} */
    isChinese() {
        return $dataSystem.locale.match(/^zh/);
    }

    /** @returns {RegExpMatchArray | null} */
    isKorean() {
        return $dataSystem.locale.match(/^ko/);
    }

    /** @returns {RegExpMatchArray | null} */
    isCJK() {
        return $dataSystem.locale.match(/^(ja|zh|ko)/);
    }

    /** @returns {RegExpMatchArray | null} */
    isRussian() {
        return $dataSystem.locale.match(/^ru/);
    }

    /** @returns {boolean} */
    isSideView() {
        return $dataSystem.optSideView;
    }

    /** @returns {boolean} */
    isAutosaveEnabled() {
        return $dataSystem.optAutosave;
    }

    /** @returns {boolean} */
    isMessageSkipEnabled() {
        return $dataSystem.optMessageSkip;
    }

    /** @returns {boolean} */
    isSaveEnabled() {
        return this._saveEnabled;
    }

    /** @returns {void} */
    disableSave() {
        this._saveEnabled = false;
    }

    /** @returns {void} */
    enableSave() {
        this._saveEnabled = true;
    }

    /** @returns {boolean} */
    isMenuEnabled() {
        return this._menuEnabled;
    }

    /** @returns {void} */
    disableMenu() {
        this._menuEnabled = false;
    }

    /** @returns {void} */
    enableMenu() {
        this._menuEnabled = true;
    }

    /** @returns {boolean} */
    isEncounterEnabled() {
        return this._encounterEnabled;
    }

    /** @returns {void} */
    disableEncounter() {
        this._encounterEnabled = false;
    }

    /** @returns {void} */
    enableEncounter() {
        this._encounterEnabled = true;
    }

    /** @returns {boolean} */
    isFormationEnabled() {
        return this._formationEnabled;
    }

    /** @returns {void} */
    disableFormation() {
        this._formationEnabled = false;
    }

    /** @returns {void} */
    enableFormation() {
        this._formationEnabled = true;
    }

    /** @returns {number} */
    battleCount() {
        return this._battleCount;
    }

    /** @returns {number} */
    winCount() {
        return this._winCount;
    }

    /** @returns {number} */
    escapeCount() {
        return this._escapeCount;
    }

    /** @returns {number} */
    saveCount() {
        return this._saveCount;
    }

    /** @returns {number} */
    versionId() {
        return this._versionId;
    }

    /** @returns {number} */
    savefileId() {
        return this._savefileId || 0;
    }

    /**
     * @param {number} savefileId
     * @returns {void}
     */
    setSavefileId(savefileId) {
        this._savefileId = savefileId;
    }

    /** @returns {RMMZ.Color} */
    windowTone() {
        return this._windowTone || $dataSystem.windowTone;
    }

    /**
     * @param {RMMZ.Color} value
     * @returns {void}
     */
    setWindowTone(value) {
        this._windowTone = value;
    }

    /** @returns {RMMZ.DataAudio} */
    battleBgm() {
        return this._battleBgm || $dataSystem.battleBgm;
    }

    /**
     * @param {RMMZ.DataAudio} value
     * @returns {void}
     */
    setBattleBgm(value) {
        this._battleBgm = value;
    }

    /** @returns {RMMZ.DataAudio} */
    victoryMe() {
        return this._victoryMe || $dataSystem.victoryMe;
    }

    /**
     * @param {RMMZ.DataAudio} value
     * @returns {void}
     */
    setVictoryMe(value) {
        this._victoryMe = value;
    }

    /** @returns {RMMZ.DataAudio} */
    defeatMe() {
        return this._defeatMe || $dataSystem.defeatMe;
    }

    /**
     * @param {RMMZ.DataAudio} value
     * @returns {void}
     */
    setDefeatMe(value) {
        this._defeatMe = value;
    }

    /** @returns {void} */
    onBattleStart() {
        this._battleCount++;
    }

    /** @returns {void} */
    onBattleWin() {
        this._winCount++;
    }

    /** @returns {void} */
    onBattleEscape() {
        this._escapeCount++;
    }

    /** @returns {void} */
    onBeforeSave() {
        this._saveCount++;
        this._versionId = $dataSystem.versionId;
        this._framesOnSave = Graphics.frameCount;
        this._bgmOnSave = AudioManager.saveBgm();
        this._bgsOnSave = AudioManager.saveBgs();
    }

    /** @returns {void} */
    onAfterLoad() {
        Graphics.frameCount = this._framesOnSave;
        AudioManager.playBgm(this._bgmOnSave);
        AudioManager.playBgs(this._bgsOnSave);
    }

    /** @returns {number} */
    playtime() {
        return Math.floor(Graphics.frameCount / 60);
    }

    /** @returns {string} */
    playtimeText() {
        const hour = Math.floor(this.playtime() / 60 / 60);
        const min = Math.floor(this.playtime() / 60) % 60;
        const sec = this.playtime() % 60;
        return hour.padZero(2) + ":" + min.padZero(2) + ":" + sec.padZero(2);
    }

    /** @returns {void} */
    saveBgm() {
        this._savedBgm = AudioManager.saveBgm();
    }

    /** @returns {void} */
    replayBgm() {
        if (this._savedBgm) {
            AudioManager.replayBgm(this._savedBgm);
        }
    }

    /** @returns {void} */
    saveWalkingBgm() {
        this._walkingBgm = AudioManager.saveBgm();
    }

    /** @returns {void} */
    replayWalkingBgm() {
        if (this._walkingBgm) {
            AudioManager.playBgm(this._walkingBgm);
        }
    }

    /** @returns {void} */
    saveWalkingBgm2() {
        this._walkingBgm = $dataMap.bgm;
    }

    /** @returns {string} */
    mainFontFace() {
        return "rmmz-mainfont, " + $dataSystem.advanced.fallbackFonts;
    }

    /** @returns {string} */
    numberFontFace() {
        return "rmmz-numberfont, " + this.mainFontFace();
    }

    /** @returns {number} */
    mainFontSize() {
        return $dataSystem.advanced.fontSize;
    }

    /** @returns {number} */
    windowPadding() {
        return 12;
    }

    /** @returns {number} */
    windowOpacity() {
        return $dataSystem.advanced.windowOpacity;
    }
}

/**
 * The game object class for the timer.
 */
class Game_Timer {
    constructor(...args) {
        this.initialize(...args);
    }

    initialize() {
        /** @type {number} */
        this._frames = 0;
        /** @type {boolean} */
        this._working = false;
    }

    /**
     * @param {boolean} sceneActive
     * @returns {void}
     */
    update(sceneActive) {
        if (sceneActive && this._working && this._frames > 0) {
            this._frames--;
            if (this._frames === 0) {
                this.onExpire();
            }
        }
    }

    /**
     * @param {number} count
     * @returns {void}
     */
    start(count) {
        this._frames = count;
        this._working = true;
    }

    /** @returns {void} */
    stop() {
        this._working = false;
    }

    /** @returns {boolean} */
    isWorking() {
        return this._working;
    }

    /** @returns {number} */
    seconds() {
        return Math.floor(this._frames / 60);
    }

    /** @returns {number} */
    frames() {
        return this._frames;
    }

    /** @returns {void} */
    onExpire() {
        BattleManager.abort();
    }
}

/**
 * The game object class for the state of the message window that displays text
 * or selections, etc.
 */
class Game_Message {
    constructor(...args) {
        this.initialize(...args);
    }

    initialize() {
        this.clear();
    }

    /** @returns {void} */
    clear() {
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

    /** @returns {string[]} */
    choices() {
        return this._choices;
    }

    /** @returns {string} */
    speakerName() {
        return this._speakerName;
    }

    /** @returns {string} */
    faceName() {
        return this._faceName;
    }

    /** @returns {number} */
    faceIndex() {
        return this._faceIndex;
    }

    /** @returns {RMMZ.TextWindowBackgroundType} */
    background() {
        return this._background;
    }

    /** @returns {RMMZ.TextWindowPositionType} */
    positionType() {
        return this._positionType;
    }

    /** @returns {number} */
    choiceDefaultType() {
        return this._choiceDefaultType;
    }

    /** @returns {number} */
    choiceCancelType() {
        return this._choiceCancelType;
    }

    /** @returns {RMMZ.TextWindowBackgroundType} */
    choiceBackground() {
        return this._choiceBackground;
    }

    /** @returns {RMMZ.TextWindowPositionType} */
    choicePositionType() {
        return this._choicePositionType;
    }

    /** @returns {number} */
    numInputVariableId() {
        return this._numInputVariableId;
    }

    /** @returns {number} */
    numInputMaxDigits() {
        return this._numInputMaxDigits;
    }

    /** @returns {number} */
    itemChoiceVariableId() {
        return this._itemChoiceVariableId;
    }

    /** @returns {number} */
    itemChoiceItypeId() {
        return this._itemChoiceItypeId;
    }

    /** @returns {boolean} */
    scrollMode() {
        return this._scrollMode;
    }

    /** @returns {number} */
    scrollSpeed() {
        return this._scrollSpeed;
    }

    /** @returns {boolean} */
    scrollNoFast() {
        return this._scrollNoFast;
    }

    /**
     * @param {string} text
     * @returns {void}
     */
    add(text) {
        this._texts.push(text);
    }

    /**
     * @param {string} speakerName
     * @returns {void}
     */
    setSpeakerName(speakerName) {
        this._speakerName = speakerName ? speakerName : "";
    }

    /**
     * @param {string} faceName
     * @param {number} faceIndex
     * @returns {void}
     */
    setFaceImage(faceName, faceIndex) {
        this._faceName = faceName;
        this._faceIndex = faceIndex;
    }

    /**
     * @param {RMMZ.TextWindowBackgroundType} background
     * @returns {void}
     */
    setBackground(background) {
        this._background = background;
    }

    /**
     * @param {RMMZ.TextWindowPositionType} positionType
     * @returns {void}
     */
    setPositionType(positionType) {
        this._positionType = positionType;
    }

    /**
     * @param {string[]} choices
     * @param {number} defaultType
     * @param {number} cancelType
     * @returns {void}
     */
    setChoices(choices, defaultType, cancelType) {
        this._choices = choices;
        this._choiceDefaultType = defaultType;
        this._choiceCancelType = cancelType;
    }

    /**
     * @param {RMMZ.TextWindowBackgroundType} background
     * @returns {void}
     */
    setChoiceBackground(background) {
        this._choiceBackground = background;
    }

    /**
     * @param {RMMZ.TextWindowPositionType} positionType
     * @returns {void}
     */
    setChoicePositionType(positionType) {
        this._choicePositionType = positionType;
    }

    /**
     * @param {number} variableId
     * @param {number} maxDigits
     * @returns {void}
     */
    setNumberInput(variableId, maxDigits) {
        this._numInputVariableId = variableId;
        this._numInputMaxDigits = maxDigits;
    }

    /**
     * @param {number} variableId
     * @param {RMMZ.ItemType} itemType
     * @returns {void}
     */
    setItemChoice(variableId, itemType) {
        this._itemChoiceVariableId = variableId;
        this._itemChoiceItypeId = itemType;
    }

    /**
     * @param {number} speed
     * @param {boolean} noFast
     * @returns {void}
     */
    setScroll(speed, noFast) {
        this._scrollMode = true;
        this._scrollSpeed = speed;
        this._scrollNoFast = noFast;
    }

    /**
     * @param {(chosen: number) => void} callback
     * @returns {void}
     */
    setChoiceCallback(callback) {
        this._choiceCallback = callback;
    }

    /**
     * @param {number} n
     * @returns {void}
     */
    onChoice(n) {
        if (this._choiceCallback) {
            this._choiceCallback(n);
            this._choiceCallback = null;
        }
    }

    /** @returns {boolean} */
    hasText() {
        return this._texts.length > 0;
    }

    /** @returns {boolean} */
    isChoice() {
        return this._choices.length > 0;
    }

    /** @returns {boolean} */
    isNumberInput() {
        return this._numInputVariableId > 0;
    }

    /** @returns {boolean} */
    isItemChoice() {
        return this._itemChoiceVariableId > 0;
    }

    /** @returns {boolean} */
    isBusy() {
        return (
            this.hasText() ||
            this.isChoice() ||
            this.isNumberInput() ||
            this.isItemChoice()
        );
    }

    /** @returns {void} */
    newPage() {
        if (this._texts.length > 0) {
            this._texts[this._texts.length - 1] += "\f";
        }
    }

    /** @returns {string} */
    allText() {
        return this._texts.join("\n");
    }

    /** @returns {boolean} */
    isRTL() {
        return Utils.containsArabic(this.allText());
    }
}

/**
 * The game object class for switches.
 */
class Game_Switches {
    constructor(...args) {
        this.initialize(...args);
    }

    initialize() {
        this.clear();
    }

    /** @returns {void} */
    clear() {
        this._data = [];
    }

    /**
     * @param {RMMZ.SwitchID} [switchId]
     * @returns {boolean}
     */
    value(switchId) {
        return !!this._data[switchId];
    }

    /**
     * @param {number} switchId
     * @param {boolean} value
     * @returns {void}
     */
    setValue(switchId, value) {
        if (switchId > 0 && switchId < $dataSystem.switches.length) {
            this._data[switchId] = value;
            this.onChange();
        }
    }

    /** @returns {void} */
    onChange() {
        $gameMap.requestRefresh();
    }
}

/**
 * The game object class for variables.
 */
class Game_Variables {
    constructor(...args) {
        this.initialize(...args);
    }

    initialize() {
        this.clear();
    }

    /** @returns {void} */
    clear() {
        this._data = [];
    }

    /**
     * @param {RMMZ.VariableID} [variableId]
     * @returns {number}
     */
    value(variableId) {
        return this._data[variableId] || 0;
    }

    /**
     * @param {RMMZ.VariableID} variableId
     * @param {number} value
     * @returns {void}
     */
    setValue(variableId, value) {
        if (variableId > 0 && variableId < $dataSystem.variables.length) {
            if (typeof value === "number") {
                value = Math.floor(value);
            }
            this._data[variableId] = value;
            this.onChange();
        }
    }

    /** @returns {void} */
    onChange() {
        $gameMap.requestRefresh();
    }
}

/**
 * The game object class for self switches.
 */
class Game_SelfSwitches {
    constructor(...args) {
        this.initialize(...args);
    }

    initialize() {
        this.clear();
    }

    clear() {
        this._data = {};
    }

    /**
     * @param {RMMZ.SelfSwitchID} key
     * @returns {boolean}
     */
    value(key) {
        return !!this._data[key];
    }

    /**
     * @param {RMMZ.SelfSwitchID} key
     * @param {boolean} value
     * @returns {void}
     */
    setValue(key, value) {
        if (value) {
            this._data[key] = true;
        } else {
            delete this._data[key];
        }
        this.onChange();
    }

    /** @returns {void} */
    onChange() {
        $gameMap.requestRefresh();
    }
}

/**
 * The game object class for screen effect data, such as changes in color tone
 * and flashes.
 */
class Game_Screen {
    constructor(...args) {
        this.initialize(...args);
    }

    initialize() {
        this.clear();
    }

    /** @returns {void} */
    clear() {
        this.clearFade();
        this.clearTone();
        this.clearFlash();
        this.clearShake();
        this.clearZoom();
        this.clearWeather();
        this.clearPictures();
    }

    /** @returns {void} */
    onBattleStart() {
        this.clearFade();
        this.clearFlash();
        this.clearShake();
        this.clearZoom();
        this.eraseBattlePictures();
    }

    /** @returns {number} */
    brightness() {
        return this._brightness;
    }

    /** @returns {[ number, number, number, number ]} */
    tone() {
        return this._tone;
    }

    /** @returns {[ number, number, number, number ]} */
    flashColor() {
        return this._flashColor;
    }

    /** @returns {number} */
    shake() {
        return this._shake;
    }

    /** @returns {number} */
    zoomX() {
        return this._zoomX;
    }

    /** @returns {number} */
    zoomY() {
        return this._zoomY;
    }

    /** @returns {number} */
    zoomScale() {
        return this._zoomScale;
    }

    /** @returns {RMMZ.WeatherType} */
    weatherType() {
        return this._weatherType;
    }

    /** @returns {number} */
    weatherPower() {
        return this._weatherPower;
    }

    /**
     * @param {RMMZ.PictureID} pictureId
     * @returns {Game_Picture | null}
     */
    picture(pictureId) {
        const realPictureId = this.realPictureId(pictureId);
        return this._pictures[realPictureId];
    }

    /**
     * @param {RMMZ.PictureID} pictureId
     * @returns {number}
     */
    realPictureId(pictureId) {
        if ($gameParty.inBattle()) {
            return pictureId + this.maxPictures();
        } else {
            return pictureId;
        }
    }

    /** @returns {void} */
    clearFade() {
        this._brightness = 255;
        this._fadeOutDuration = 0;
        this._fadeInDuration = 0;
    }

    /** @returns {void} */
    clearTone() {
        this._tone = [0, 0, 0, 0];
        this._toneTarget = [0, 0, 0, 0];
        this._toneDuration = 0;
    }

    /** @returns {void} */
    clearFlash() {
        this._flashColor = [0, 0, 0, 0];
        this._flashDuration = 0;
    }

    /** @returns {void} */
    clearShake() {
        this._shakePower = 0;
        this._shakeSpeed = 0;
        this._shakeDuration = 0;
        this._shakeDirection = 1;
        this._shake = 0;
    }

    /** @returns {void} */
    clearZoom() {
        this._zoomX = 0;
        this._zoomY = 0;
        this._zoomScale = 1;
        this._zoomScaleTarget = 1;
        this._zoomDuration = 0;
    }

    /** @returns {void} */
    clearWeather() {
        this._weatherType = "none";
        this._weatherPower = 0;
        this._weatherPowerTarget = 0;
        this._weatherDuration = 0;
    }

    /** @returns {void} */
    clearPictures() {
        this._pictures = [];
    }

    /** @returns {void} */
    eraseBattlePictures() {
        this._pictures = this._pictures.slice(0, this.maxPictures() + 1);
    }

    /** @returns {number} */
    maxPictures() {
        if ("picturesUpperLimit" in $dataSystem.advanced) {
            return $dataSystem.advanced.picturesUpperLimit;
        } else {
            return 100;
        }
    }

    /**
     * @param {number} duration
     * @returns {void}
     */
    startFadeOut(duration) {
        this._fadeOutDuration = duration;
        this._fadeInDuration = 0;
    }

    /**
     * @param {number} duration
     * @returns {void}
     */
    startFadeIn(duration) {
        this._fadeInDuration = duration;
        this._fadeOutDuration = 0;
    }

    /**
     * @param {RMMZ.Color} tone
     * @param {number} duration
     * @returns {void}
     */
    startTint(tone, duration) {
        this._toneTarget = tone.clone();
        this._toneDuration = duration;
        if (this._toneDuration === 0) {
            this._tone = this._toneTarget.clone();
        }
    }

    /**
     * @param {RMMZ.Color} color
     * @param {number} duration
     * @returns {void}
     */
    startFlash(color, duration) {
        this._flashColor = color.clone();
        this._flashDuration = duration;
    }

    /**
     * @param {number} power
     * @param {number} speed
     * @param {number} duration
     * @returns {void}
     */
    startShake(power, speed, duration) {
        this._shakePower = power;
        this._shakeSpeed = speed;
        this._shakeDuration = duration;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} scale
     * @param {number} duration
     * @returns {void}
     */
    startZoom(x, y, scale, duration) {
        this._zoomX = x;
        this._zoomY = y;
        this._zoomScaleTarget = scale;
        this._zoomDuration = duration;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} scale
     * @returns {void}
     */
    setZoom(x, y, scale) {
        this._zoomX = x;
        this._zoomY = y;
        this._zoomScale = scale;
    }

    /**
     * @param {RMMZ.WeatherType} type
     * @param {number} power
     * @param {number} duration
     * @returns {void}
     */
    changeWeather(type, power, duration) {
        if (type !== "none" || duration === 0) {
            this._weatherType = type;
        }
        this._weatherPowerTarget = type === "none" ? 0 : power;
        this._weatherDuration = duration;
        if (duration === 0) {
            this._weatherPower = this._weatherPowerTarget;
        }
    }

    /** @returns {void} */
    update() {
        this.updateFadeOut();
        this.updateFadeIn();
        this.updateTone();
        this.updateFlash();
        this.updateShake();
        this.updateZoom();
        this.updateWeather();
        this.updatePictures();
    }

    /** @returns {void} */
    updateFadeOut() {
        if (this._fadeOutDuration > 0) {
            const d = this._fadeOutDuration;
            this._brightness = (this._brightness * (d - 1)) / d;
            this._fadeOutDuration--;
        }
    }

    /** @returns {void} */
    updateFadeIn() {
        if (this._fadeInDuration > 0) {
            const d = this._fadeInDuration;
            this._brightness = (this._brightness * (d - 1) + 255) / d;
            this._fadeInDuration--;
        }
    }

    /** @returns {void} */
    updateTone() {
        if (this._toneDuration > 0) {
            const d = this._toneDuration;
            for (let i = 0; i < 4; i++) {
                this._tone[i] = (this._tone[i] * (d - 1) + this._toneTarget[i]) / d;
            }
            this._toneDuration--;
        }
    }

    /** @returns {void} */
    updateFlash() {
        if (this._flashDuration > 0) {
            const d = this._flashDuration;
            this._flashColor[3] *= (d - 1) / d;
            this._flashDuration--;
        }
    }

    /** @returns {void} */
    updateShake() {
        if (this._shakeDuration > 0 || this._shake !== 0) {
            const delta =
                (this._shakePower * this._shakeSpeed * this._shakeDirection) / 10;
            if (
                this._shakeDuration <= 1 &&
                this._shake * (this._shake + delta) < 0
            ) {
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

    /** @returns {void} */
    updateZoom() {
        if (this._zoomDuration > 0) {
            const d = this._zoomDuration;
            const t = this._zoomScaleTarget;
            this._zoomScale = (this._zoomScale * (d - 1) + t) / d;
            this._zoomDuration--;
        }
    }

    /** @returns {void} */
    updateWeather() {
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

    /** @returns {void} */
    updatePictures() {
        for (const picture of this._pictures) {
            if (picture) {
                picture.update();
            }
        }
    }

    /** @returns {void} */
    startFlashForDamage() {
        this.startFlash([255, 0, 0, 128], 8);
    }

    // prettier-ignore
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
    showPicture(
        pictureId, name, origin, x, y, scaleX, scaleY, opacity, blendMode
    ) {
        const realPictureId = this.realPictureId(pictureId);
        const picture = new Game_Picture();
        picture.show(name, origin, x, y, scaleX, scaleY, opacity, blendMode);
        this._pictures[realPictureId] = picture;
    }

    // prettier-ignore
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
    movePicture(
        pictureId, origin, x, y, scaleX, scaleY, opacity, blendMode, duration,
        easingType
    ) {
        const picture = this.picture(pictureId);
        if (picture) {
            // prettier-ignore
            picture.move(origin, x, y, scaleX, scaleY, opacity, blendMode,
                         duration, easingType);
        }
    }

    /**
     * @param {RMMZ.PictureID} pictureId
     * @param {number} speed
     * @returns {void}
     */
    rotatePicture(pictureId, speed) {
        const picture = this.picture(pictureId);
        if (picture) {
            picture.rotate(speed);
        }
    }

    /**
     * @param {RMMZ.PictureID} pictureId
     * @param {RMMZ.Color} tone
     * @param {number} duration
     * @returns {void}
     */
    tintPicture(pictureId, tone, duration) {
        const picture = this.picture(pictureId);
        if (picture) {
            picture.tint(tone, duration);
        }
    }

    /**
     * @param {RMMZ.PictureID} pictureId
     * @returns {void}
     */
    erasePicture(pictureId) {
        const realPictureId = this.realPictureId(pictureId);
        this._pictures[realPictureId] = null;
    }
}

/**
 * The game object class for a picture.
 */
class Game_Picture {
    constructor(...args) {
        this.initialize(...args);
    }

    initialize() {
        this.initBasic();
        this.initTarget();
        this.initTone();
        this.initRotation();
    }

    /** @returns {string} */
    name() {
        return this._name;
    }

    /** @returns {number} */
    origin() {
        return this._origin;
    }

    /** @returns {number} */
    x() {
        return this._x;
    }

    /** @returns {number} */
    y() {
        return this._y;
    }

    /** @returns {number} */
    scaleX() {
        return this._scaleX;
    }

    /** @returns {number} */
    scaleY() {
        return this._scaleY;
    }

    /** @returns {number} */
    opacity() {
        return this._opacity;
    }

    /** @returns {import("pixi.js").BLEND_MODES} */
    blendMode() {
        return this._blendMode;
    }

    /** @returns {[ number, number, number, number ] | null} */
    tone() {
        return this._tone;
    }

    /** @returns {number} */
    angle() {
        return this._angle;
    }

    /** @returns {void} */
    initBasic() {
        this._name = "";
        this._origin = 0;
        this._x = 0;
        this._y = 0;
        this._scaleX = 100;
        this._scaleY = 100;
        this._opacity = 255;
        this._blendMode = 0;
    }

    /** @returns {void} */
    initTarget() {
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

    /** @returns {void} */
    initTone() {
        this._tone = null;
        this._toneTarget = null;
        this._toneDuration = 0;
    }

    /** @returns {void} */
    initRotation() {
        this._angle = 0;
        this._rotationSpeed = 0;
    }

    // prettier-ignore
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
    show(
        name, origin, x, y, scaleX, scaleY, opacity, blendMode
    ) {
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
    move(
        origin, x, y, scaleX, scaleY, opacity, blendMode, duration, easingType
    ) {
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

    /**
     * @param {number} speed
     * @returns {void}
     */
    rotate(speed) {
        this._rotationSpeed = speed;
    }

    /**
     * @param {RMMZ.Color} tone
     * @param {number} duration
     * @returns {void}
     */
    tint(tone, duration) {
        if (!this._tone) {
            this._tone = [0, 0, 0, 0];
        }
        this._toneTarget = tone.clone();
        this._toneDuration = duration;
        if (this._toneDuration === 0) {
            this._tone = this._toneTarget.clone();
        }
    }

    /** @returns {void} */
    update() {
        this.updateMove();
        this.updateTone();
        this.updateRotation();
    }

    /** @returns {void} */
    updateMove() {
        if (this._duration > 0) {
            this._x = this.applyEasing(this._x, this._targetX);
            this._y = this.applyEasing(this._y, this._targetY);
            this._scaleX = this.applyEasing(this._scaleX, this._targetScaleX);
            this._scaleY = this.applyEasing(this._scaleY, this._targetScaleY);
            this._opacity = this.applyEasing(this._opacity, this._targetOpacity);
            this._duration--;
        }
    }

    /** @returns {void} */
    updateTone() {
        if (this._toneDuration > 0) {
            const d = this._toneDuration;
            for (let i = 0; i < 4; i++) {
                this._tone[i] = (this._tone[i] * (d - 1) + this._toneTarget[i]) / d;
            }
            this._toneDuration--;
        }
    }

    /** @returns {void} */
    updateRotation() {
        if (this._rotationSpeed !== 0) {
            this._angle += this._rotationSpeed / 2;
        }
    }

    /**
     * @param {number} current
     * @param {number} target
     * @returns {number}
     */
    applyEasing(current, target) {
        const d = this._duration;
        const wd = this._wholeDuration;
        const lt = this.calcEasing((wd - d) / wd);
        const t = this.calcEasing((wd - d + 1) / wd);
        const start = (current - target * lt) / (1 - lt);
        return start + (target - start) * t;
    }

    /**
     * @param {number} t
     * @returns {number}
     */
    calcEasing(t) {
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

    /**
     * @param {number} t
     * @param {number} exponent
     * @returns {number}
     */
    easeIn(t, exponent) {
        return Math.pow(t, exponent);
    }

    /**
     * @param {number} t
     * @param {number} exponent
     * @returns {number}
     */
    easeOut(t, exponent) {
        return 1 - Math.pow(1 - t, exponent);
    }

    /**
     * @param {number} t
     * @param {number} exponent
     * @returns {number}
     */
    easeInOut(t, exponent) {
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
class Game_Item {
    /** @param {[item?: RMMZ.DataItemBase | null]} args */
    constructor(...args) {
        this.initialize(...args);
    }

    /** @param {RMMZ.DataItemBase | null} [item] */
    initialize(item) {
        /** @type {RMMZ.DataClassID | ""} */
        this._dataClass = "";
        /** @type {number} */
        this._itemId = 0;
        if (item) {
            this.setObject(item);
        }
    }

    /** @returns {boolean} */
    isSkill() {
        return this._dataClass === "skill";
    }

    /** @returns {boolean} */
    isItem() {
        return this._dataClass === "item";
    }

    /** @returns {boolean} */
    isUsableItem() {
        return this.isSkill() || this.isItem();
    }

    /** @returns {boolean} */
    isWeapon() {
        return this._dataClass === "weapon";
    }

    /** @returns {boolean} */
    isArmor() {
        return this._dataClass === "armor";
    }

    /** @returns {boolean} */
    isEquipItem() {
        return this.isWeapon() || this.isArmor();
    }

    /** @returns {boolean} */
    isNull() {
        return this._dataClass === "";
    }

    /** @returns {number} */
    itemId() {
        return this._itemId;
    }

    /** @returns {RMMZ.DataItemBase} */
    object() {
        if (this.isSkill()) {
            return $dataSkills[this._itemId];
        } else if (this.isItem()) {
            return $dataItems[this._itemId];
        } else if (this.isWeapon()) {
            return $dataWeapons[this._itemId];
        } else if (this.isArmor()) {
            return $dataArmors[this._itemId];
        } else {
            return null;
        }
    }

    /**
     * @param {RMMZ.DataItemBase | null} item
     * @returns {void}
     */
    setObject(item) {
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

    /**
     * @param {boolean} isWeapon
     * @param {number} itemId
     * @returns {void}
     */
    setEquip(isWeapon, itemId) {
        this._dataClass = isWeapon ? "weapon" : "armor";
        this._itemId = itemId;
    }
}

/**
 * The game object class for a battle action.
 */
class Game_Action {
    /** @param {[subject: Game_Battler, forcing?: boolean]} args */
    constructor(...args) {
        this.initialize(...args);
    }

    static EFFECT_RECOVER_HP = 11;

    static EFFECT_RECOVER_MP = 12;

    static EFFECT_GAIN_TP = 13;

    static EFFECT_ADD_STATE = 21;

    static EFFECT_REMOVE_STATE = 22;

    static EFFECT_ADD_BUFF = 31;

    static EFFECT_ADD_DEBUFF = 32;

    static EFFECT_REMOVE_BUFF = 33;

    static EFFECT_REMOVE_DEBUFF = 34;

    static EFFECT_SPECIAL = 41;

    static EFFECT_GROW = 42;

    static EFFECT_LEARN_SKILL = 43;

    static EFFECT_COMMON_EVENT = 44;

    static SPECIAL_EFFECT_ESCAPE = 0;

    static HITTYPE_CERTAIN = 0;

    static HITTYPE_PHYSICAL = 1;

    static HITTYPE_MAGICAL = 2;

    /**
     * @param {Game_Battler} subject
     * @param {boolean} [forcing]
     */
    initialize(subject, forcing) {
        /** @type {RMMZ.ActorID | RMMZ.EnemyID} */
        this._subjectActorId = 0;
        /** @type {number} */
        this._subjectEnemyIndex = -1;
        /** @type {boolean} */
        this._forcing = forcing || false;
        this.setSubject(subject);
        this.clear();
    }

    /** @returns {void} */
    clear() {
        this._item = new Game_Item();
        this._targetIndex = -1;
    }

    /**
     * @param {RMMZ.ActionTarget} subject
     * @returns {void}
     */
    setSubject(subject) {
        if (subject.isActor()) {
            this._subjectActorId = subject.actorId();
            this._subjectEnemyIndex = -1;
        } else {
            this._subjectEnemyIndex = subject.index();
            this._subjectActorId = 0;
        }
    }

    /** @returns {import("./Game_Actor").Game_Actor | import("./Game_Enemy").Game_Enemy} */
    subject() {
        if (this._subjectActorId > 0) {
            return $gameActors.actor(this._subjectActorId);
        } else {
            return $gameTroop.members()[this._subjectEnemyIndex];
        }
    }

    /** @returns {import("./Game_Party").Game_Party | import("./Game_Troop").Game_Troop} */
    friendsUnit() {
        return this.subject().friendsUnit();
    }

    /** @returns {import("./Game_Party").Game_Party | import("./Game_Troop").Game_Troop} */
    opponentsUnit() {
        return this.subject().opponentsUnit();
    }

    /**
     * @param {RMMZ.EnemyAction | null | undefined} action
     * @returns {void}
     */
    setEnemyAction(action) {
        if (action) {
            this.setSkill(action.skillId);
        } else {
            this.clear();
        }
    }

    /** @returns {void} */
    setAttack() {
        this.setSkill(this.subject().attackSkillId());
    }

    /** @returns {void} */
    setGuard() {
        this.setSkill(this.subject().guardSkillId());
    }

    /**
     * @param {RMMZ.SkillID} skillId
     * @returns {void}
     */
    setSkill(skillId) {
        this._item.setObject($dataSkills[skillId]);
    }

    /**
     * @param {RMMZ.ItemID} itemId
     * @returns {void}
     */
    setItem(itemId) {
        this._item.setObject($dataItems[itemId]);
    }

    /**
     * @param {RMMZ.ActionItem | null} object
     * @returns {void}
     */
    setItemObject(object) {
        this._item.setObject(object);
    }

    /**
     * @param {number} targetIndex
     * @returns {void}
     */
    setTarget(targetIndex) {
        this._targetIndex = targetIndex;
    }

    /** @returns {RMMZ.ActionItem} */
    item() {
        return this._item.object();
    }

    /** @returns {boolean} */
    isSkill() {
        return this._item.isSkill();
    }

    /** @returns {boolean} */
    isItem() {
        return this._item.isItem();
    }

    /** @returns {number} */
    numRepeats() {
        let repeats = this.item().repeats;
        if (this.isAttack()) {
            repeats += this.subject().attackTimesAdd();
        }
        return Math.floor(repeats);
    }

    /**
     * @param {RMMZ.Scope[]} list
     * @returns {boolean}
     */
    checkItemScope(list) {
        return list.includes(this.item().scope);
    }

    /** @returns {boolean} */
    isForOpponent() {
        return this.checkItemScope([1, 2, 3, 4, 5, 6, 14]);
    }

    /** @returns {boolean} */
    isForFriend() {
        return this.checkItemScope([7, 8, 9, 10, 11, 12, 13, 14]);
    }

    /** @returns {boolean} */
    isForEveryone() {
        return this.checkItemScope([14]);
    }

    /** @returns {boolean} */
    isForAliveFriend() {
        return this.checkItemScope([7, 8, 11, 14]);
    }

    /** @returns {boolean} */
    isForDeadFriend() {
        return this.checkItemScope([9, 10]);
    }

    /** @returns {boolean} */
    isForUser() {
        return this.checkItemScope([11]);
    }

    /** @returns {boolean} */
    isForOne() {
        return this.checkItemScope([1, 3, 7, 9, 11, 12]);
    }

    /** @returns {boolean} */
    isForRandom() {
        return this.checkItemScope([3, 4, 5, 6]);
    }

    /** @returns {boolean} */
    isForAll() {
        return this.checkItemScope([2, 8, 10, 13, 14]);
    }

    /** @returns {boolean} */
    needsSelection() {
        return this.checkItemScope([1, 7, 9, 12]);
    }

    /** @returns {number} */
    numTargets() {
        return this.isForRandom() ? this.item().scope - 2 : 0;
    }

    /**
     * @param {RMMZ.DamageType[]} list
     * @returns {boolean}
     */
    checkDamageType(list) {
        return list.includes(this.item().damage.type);
    }

    /** @returns {boolean} */
    isHpEffect() {
        return this.checkDamageType([1, 3, 5]);
    }

    /** @returns {boolean} */
    isMpEffect() {
        return this.checkDamageType([2, 4, 6]);
    }

    /** @returns {boolean} */
    isDamage() {
        return this.checkDamageType([1, 2]);
    }

    /** @returns {boolean} */
    isRecover() {
        return this.checkDamageType([3, 4]);
    }

    /** @returns {boolean} */
    isDrain() {
        return this.checkDamageType([5, 6]);
    }

    /** @returns {boolean} */
    isHpRecover() {
        return this.checkDamageType([3]);
    }

    /** @returns {boolean} */
    isMpRecover() {
        return this.checkDamageType([4]);
    }

    /** @returns {boolean} */
    isCertainHit() {
        return this.item().hitType === Game_Action.HITTYPE_CERTAIN;
    }

    /** @returns {boolean} */
    isPhysical() {
        return this.item().hitType === Game_Action.HITTYPE_PHYSICAL;
    }

    /** @returns {boolean} */
    isMagical() {
        return this.item().hitType === Game_Action.HITTYPE_MAGICAL;
    }

    /** @returns {boolean} */
    isAttack() {
        return this.item() === $dataSkills[this.subject().attackSkillId()];
    }

    /** @returns {boolean} */
    isGuard() {
        return this.item() === $dataSkills[this.subject().guardSkillId()];
    }

    /** @returns {boolean} */
    isMagicSkill() {
        if (this.isSkill()) {
            return $dataSystem.magicSkills.includes(this.item().stypeId);
        } else {
            return false;
        }
    }

    /** @returns {void} */
    decideRandomTarget() {
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

    /** @returns {void} */
    setConfusion() {
        this.setAttack();
    }

    /** @returns {void} */
    prepare() {
        if (this.subject().isConfused() && !this._forcing) {
            this.setConfusion();
        }
    }

    /** @returns {boolean | RMMZ.ActionItem} */
    isValid() {
        return (this._forcing && this.item()) || this.subject().canUse(this.item());
    }

    /** @returns {number} */
    speed() {
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

    /** @returns {(import("./Game_Actor").Game_Actor | import("./Game_Enemy").Game_Enemy)[]} */
    makeTargets() {
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

    /**
     * @param {(RMMZ.ActionTarget | null)[]} targets
     * @returns {(import("./Game_Actor").Game_Actor | import("./Game_Enemy").Game_Enemy)[]}
     */
    repeatTargets(targets) {
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

    /** @returns {import("./Game_Actor").Game_Actor | import("./Game_Enemy").Game_Enemy | null} */
    confusionTarget() {
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

    /** @returns {(import("./Game_Actor").Game_Actor | import("./Game_Enemy").Game_Enemy)[]} */
    targetsForEveryone() {
        const opponentMembers = this.opponentsUnit().aliveMembers();
        const friendMembers = this.friendsUnit().aliveMembers();
        return opponentMembers.concat(friendMembers);
    }

    /** @returns {(import("./Game_Actor").Game_Actor | import("./Game_Enemy").Game_Enemy | null)[]} */
    targetsForOpponents() {
        const unit = this.opponentsUnit();
        if (this.isForRandom()) {
            return this.randomTargets(unit);
        } else {
            return this.targetsForAlive(unit);
        }
    }

    /** @returns {(import("./Game_Actor").Game_Actor | import("./Game_Enemy").Game_Enemy | null)[]} */
    targetsForFriends() {
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

    /**
     * @param {RMMZ.ActionUnit} unit
     * @returns {(import("./Game_Actor").Game_Actor | import("./Game_Enemy").Game_Enemy | null)[]}
     */
    randomTargets(unit) {
        const targets = [];
        for (let i = 0; i < this.numTargets(); i++) {
            targets.push(unit.randomTarget());
        }
        return targets;
    }

    /**
     * @param {RMMZ.ActionUnit} unit
     * @returns {(import("./Game_Actor").Game_Actor | import("./Game_Enemy").Game_Enemy)[]}
     */
    targetsForDead(unit) {
        if (this.isForOne()) {
            return [unit.smoothDeadTarget(this._targetIndex)];
        } else {
            return unit.deadMembers();
        }
    }

    /**
     * @param {RMMZ.ActionUnit} unit
     * @returns {(import("./Game_Actor").Game_Actor | import("./Game_Enemy").Game_Enemy | null)[]}
     */
    targetsForAlive(unit) {
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

    /**
     * @param {RMMZ.ActionUnit} unit
     * @returns {(import("./Game_Actor").Game_Actor | import("./Game_Enemy").Game_Enemy)[]}
     */
    targetsForDeadAndAlive(unit) {
        if (this.isForOne()) {
            return [unit.members()[this._targetIndex]];
        } else {
            return unit.members();
        }
    }

    /** @returns {number} */
    evaluate() {
        let value = 0;
        for (const target of this.itemTargetCandidates()) {
            const targetValue = this.evaluateWithTarget(target);
            if (this.isForAll()) {
                value += targetValue;
            } else if (targetValue > value) {
                value = targetValue;
                this._targetIndex = target.index();
            }
        }
        value *= this.numRepeats();
        if (value > 0) {
            value += Math.random();
        }
        return value;
    }

    /** @returns {(import("./Game_Actor").Game_Actor | import("./Game_Enemy").Game_Enemy)[]} */
    itemTargetCandidates() {
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

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {number | undefined}
     */
    evaluateWithTarget(target) {
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

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {boolean}
     */
    testApply(target) {
        return (
            this.testLifeAndDeath(target) &&
            ($gameParty.inBattle() ||
                (this.isHpRecover() && target.hp < target.mhp) ||
                (this.isMpRecover() && target.mp < target.mmp) ||
                this.hasItemAnyValidEffects(target))
        );
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {boolean}
     */
    testLifeAndDeath(target) {
        if (this.isForOpponent() || this.isForAliveFriend()) {
            return target.isAlive();
        } else if (this.isForDeadFriend()) {
            return target.isDead();
        } else {
            return true;
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {boolean}
     */
    hasItemAnyValidEffects(target) {
        return this.item().effects.some(effect =>
            this.testItemEffect(target, effect)
        );
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffectBase} effect
     * @returns {boolean}
     */
    testItemEffect(target, effect) {
        switch (effect.code) {
            case Game_Action.EFFECT_RECOVER_HP:
                return (
                    target.hp < target.mhp || effect.value1 < 0 || effect.value2 < 0
                );
            case Game_Action.EFFECT_RECOVER_MP:
                return (
                    target.mp < target.mmp || effect.value1 < 0 || effect.value2 < 0
                );
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

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {number}
     */
    itemCnt(target) {
        if (this.isPhysical() && target.canMove()) {
            return target.cnt;
        } else {
            return 0;
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {number}
     */
    itemMrf(target) {
        if (this.isMagical()) {
            return target.mrf;
        } else {
            return 0;
        }
    }

    /**
     * @param {Game_Battler} target
     * @returns {number}
     */
    itemHit(/*target*/) {
        const successRate = this.item().successRate;
        if (this.isPhysical()) {
            return successRate * 0.01 * this.subject().hit;
        } else {
            return successRate * 0.01;
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {number}
     */
    itemEva(target) {
        if (this.isPhysical()) {
            return target.eva;
        } else if (this.isMagical()) {
            return target.mev;
        } else {
            return 0;
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {number}
     */
    itemCri(target) {
        return this.item().damage.critical
            ? this.subject().cri * (1 - target.cev)
            : 0;
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    apply(target) {
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

    /**
     * @param {RMMZ.ActionTarget} target
     * @param {boolean} critical
     * @returns {number}
     */
    makeDamageValue(target, critical) {
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

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {number}
     */
    evalDamageFormula(target) {
        try {
            const item = this.item();
            const a = this.subject(); // eslint-disable-line no-unused-vars
            const b = target; // eslint-disable-line no-unused-vars
            const v = $gameVariables._data; // eslint-disable-line no-unused-vars
            const sign = [3, 4].includes(item.damage.type) ? -1 : 1;
            const value = Math.max(eval(item.damage.formula), 0) * sign;
            return isNaN(value) ? 0 : value;
        } catch (e) {
            return 0;
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {number}
     */
    calcElementRate(target) {
        if (this.item().damage.elementId < 0) {
            return this.elementsMaxRate(target, this.subject().attackElements());
        } else {
            return target.elementRate(this.item().damage.elementId);
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.DataID[]} elements
     * @returns {number}
     */
    elementsMaxRate(target, elements) {
        if (elements.length > 0) {
            const rates = elements.map(elementId => target.elementRate(elementId));
            return Math.max(...rates);
        } else {
            return 1;
        }
    }

    /**
     * @param {number} damage
     * @returns {number}
     */
    applyCritical(damage) {
        return damage * 3;
    }

    /**
     * @param {number} damage
     * @param {number} variance
     * @returns {number}
     */
    applyVariance(damage, variance) {
        const amp = Math.floor(Math.max((Math.abs(damage) * variance) / 100, 0));
        const v = Math.randomInt(amp + 1) + Math.randomInt(amp + 1) - amp;
        return damage >= 0 ? damage + v : damage - v;
    }

    /**
     * @param {number} damage
     * @param {RMMZ.ActionTarget} target
     * @returns {number}
     */
    applyGuard(damage, target) {
        return damage / (damage > 0 && target.isGuard() ? 2 * target.grd : 1);
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @param {number} value
     * @returns {void}
     */
    executeDamage(target, value) {
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

    /**
     * @param {RMMZ.ActionTarget} target
     * @param {number} value
     * @returns {void}
     */
    executeHpDamage(target, value) {
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

    /**
     * @param {RMMZ.ActionTarget} target
     * @param {number} value
     * @returns {void}
     */
    executeMpDamage(target, value) {
        if (!this.isMpRecover()) {
            value = Math.min(target.mp, value);
        }
        if (value !== 0) {
            this.makeSuccess(target);
        }
        target.gainMp(-value);
        this.gainDrainedMp(value);
    }

    /**
     * @param {number} value
     * @returns {void}
     */
    gainDrainedHp(value) {
        if (this.isDrain()) {
            let gainTarget = this.subject();
            if (this._reflectionTarget) {
                gainTarget = this._reflectionTarget;
            }
            gainTarget.gainHp(value);
        }
    }

    /**
     * @param {number} value
     * @returns {void}
     */
    gainDrainedMp(value) {
        if (this.isDrain()) {
            let gainTarget = this.subject();
            if (this._reflectionTarget) {
                gainTarget = this._reflectionTarget;
            }
            gainTarget.gainMp(value);
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffectBase} effect
     * @returns {void}
     */
    applyItemEffect(target, effect) {
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

    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffect<typeof Game_Action.EFFECT_RECOVER_HP>} effect
     * @returns {void}
     */
    itemEffectRecoverHp(target, effect) {
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

    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffect<typeof Game_Action.EFFECT_RECOVER_MP>} effect
     * @returns {void}
     */
    itemEffectRecoverMp(target, effect) {
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

    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffect<typeof Game_Action.EFFECT_GAIN_TP>} effect
     * @returns {void}
     */
    itemEffectGainTp(target, effect) {
        let value = Math.floor(effect.value1);
        if (value !== 0) {
            target.gainTp(value);
            this.makeSuccess(target);
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffect<typeof Game_Action.EFFECT_ADD_STATE>} effect
     * @returns {void}
     */
    itemEffectAddState(target, effect) {
        if (effect.dataId === 0) {
            this.itemEffectAddAttackState(target, effect);
        } else {
            this.itemEffectAddNormalState(target, effect);
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffect<typeof Game_Action.EFFECT_ADD_STATE>} effect
     * @returns {void}
     */
    itemEffectAddAttackState(target, effect) {
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

    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffect<typeof Game_Action.EFFECT_ADD_STATE>} effect
     * @returns {void}
     */
    itemEffectAddNormalState(target, effect) {
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

    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffect<typeof Game_Action.EFFECT_REMOVE_STATE>} effect
     * @returns {void}
     */
    itemEffectRemoveState(target, effect) {
        let chance = effect.value1;
        if (Math.random() < chance) {
            target.removeState(effect.dataId);
            this.makeSuccess(target);
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffect<typeof Game_Action.EFFECT_ADD_BUFF>} effect
     * @returns {void}
     */
    itemEffectAddBuff(target, effect) {
        target.addBuff(effect.dataId, effect.value1);
        this.makeSuccess(target);
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffect<typeof Game_Action.EFFECT_ADD_DEBUFF>} effect
     * @returns {void}
     */
    itemEffectAddDebuff(target, effect) {
        let chance = target.debuffRate(effect.dataId) * this.lukEffectRate(target);
        if (Math.random() < chance) {
            target.addDebuff(effect.dataId, effect.value1);
            this.makeSuccess(target);
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffect<typeof Game_Action.EFFECT_REMOVE_BUFF>} effect
     * @returns {void}
     */
    itemEffectRemoveBuff(target, effect) {
        if (target.isBuffAffected(effect.dataId)) {
            target.removeBuff(effect.dataId);
            this.makeSuccess(target);
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffect<typeof Game_Action.EFFECT_REMOVE_DEBUFF>} effect
     * @returns {void}
     */
    itemEffectRemoveDebuff(target, effect) {
        if (target.isDebuffAffected(effect.dataId)) {
            target.removeBuff(effect.dataId);
            this.makeSuccess(target);
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffect<typeof Game_Action.EFFECT_SPECIAL>} effect
     * @returns {void}
     */
    itemEffectSpecial(target, effect) {
        if (effect.dataId === Game_Action.SPECIAL_EFFECT_ESCAPE) {
            target.escape();
            this.makeSuccess(target);
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffect<typeof Game_Action.EFFECT_GROW>} effect
     * @returns {void}
     */
    itemEffectGrow(target, effect) {
        target.addParam(effect.dataId, Math.floor(effect.value1));
        this.makeSuccess(target);
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ActionEffect<typeof Game_Action.EFFECT_LEARN_SKILL>} effect
     * @returns {void}
     */
    itemEffectLearnSkill(target, effect) {
        if (target.isActor()) {
            target.learnSkill(effect.dataId);
            this.makeSuccess(target);
        }
    }

    /**
     * @param {Game_Battler} target
     * @param {RMMZ.ActionEffectBase} effect
     * @returns {void}
     */
    itemEffectCommonEvent(/*target, effect*/) {
        //
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    makeSuccess(target) {
        target.result().success = true;
    }

    /**
     * @param {Game_Battler} target
     * @returns {void}
     */
    applyItemUserEffect(/*target*/) {
        const value = Math.floor(this.item().tpGain * this.subject().tcr);
        this.subject().gainSilentTp(value);
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {number}
     */
    lukEffectRate(target) {
        return Math.max(1.0 + (this.subject().luk - target.luk) * 0.001, 0.0);
    }

    /** @returns {void} */
    applyGlobal() {
        for (const effect of this.item().effects) {
            if (effect.code === Game_Action.EFFECT_COMMON_EVENT) {
                $gameTemp.reserveCommonEvent(effect.dataId);
            }
        }
        this.updateLastUsed();
        this.updateLastSubject();
    }

    /** @returns {void} */
    updateLastUsed() {
        const item = this.item();
        if (DataManager.isSkill(item)) {
            $gameTemp.setLastUsedSkillId(item.id);
        } else if (DataManager.isItem(item)) {
            $gameTemp.setLastUsedItemId(item.id);
        }
    }

    /** @returns {void} */
    updateLastSubject() {
        const subject = this.subject();
        if (subject.isActor()) {
            $gameTemp.setLastSubjectActorId(subject.actorId());
        } else {
            $gameTemp.setLastSubjectEnemyIndex(subject.index() + 1);
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    updateLastTarget(target) {
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
    /** @param {[]} args */
    constructor(...args) {
        this.initialize(...args);
    }

    initialize() {
        this.clear();
    }

    /** @returns {void} */
    clear() {
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

    /** @returns {import("../data").DataState[]} */
    addedStateObjects() {
        return this.addedStates.map(id => $dataStates[id]);
    }

    /** @returns {import("../data").DataState[]} */
    removedStateObjects() {
        return this.removedStates.map(id => $dataStates[id]);
    }

    /** @returns {boolean} */
    isStatusAffected() {
        return (
            this.addedStates.length > 0 ||
            this.removedStates.length > 0 ||
            this.addedBuffs.length > 0 ||
            this.addedDebuffs.length > 0 ||
            this.removedBuffs.length > 0
        );
    }

    /** @returns {boolean} */
    isHit() {
        return this.used && !this.missed && !this.evaded;
    }

    /**
     * @param {RMMZ.StateID} stateId
     * @returns {boolean}
     */
    isStateAdded(stateId) {
        return this.addedStates.includes(stateId);
    }

    /**
     * @param {RMMZ.StateID} stateId
     * @returns {void}
     */
    pushAddedState(stateId) {
        if (!this.isStateAdded(stateId)) {
            this.addedStates.push(stateId);
        }
    }

    /**
     * @param {RMMZ.StateID} stateId
     * @returns {boolean}
     */
    isStateRemoved(stateId) {
        return this.removedStates.includes(stateId);
    }

    /**
     * @param {RMMZ.StateID} stateId
     * @returns {void}
     */
    pushRemovedState(stateId) {
        if (!this.isStateRemoved(stateId)) {
            this.removedStates.push(stateId);
        }
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {boolean}
     */
    isBuffAdded(paramId) {
        return this.addedBuffs.includes(paramId);
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {void}
     */
    pushAddedBuff(paramId) {
        if (!this.isBuffAdded(paramId)) {
            this.addedBuffs.push(paramId);
        }
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {boolean}
     */
    isDebuffAdded(paramId) {
        return this.addedDebuffs.includes(paramId);
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {void}
     */
    pushAddedDebuff(paramId) {
        if (!this.isDebuffAdded(paramId)) {
            this.addedDebuffs.push(paramId);
        }
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {boolean}
     */
    isBuffRemoved(paramId) {
        return this.removedBuffs.includes(paramId);
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {void}
     */
    pushRemovedBuff(paramId) {
        if (!this.isBuffRemoved(paramId)) {
            this.removedBuffs.push(paramId);
        }
    }
}

/**
 * The superclass of Game_Battler. It mainly contains parameters calculation.
 */
class Game_BattlerBase {
    /** @param {[]} args */
    constructor(...args) {
        this.initialize(...args);
    }

    static TRAIT_ELEMENT_RATE = 11;

    static TRAIT_DEBUFF_RATE = 12;

    static TRAIT_STATE_RATE = 13;

    static TRAIT_STATE_RESIST = 14;

    static TRAIT_PARAM = 21;

    static TRAIT_XPARAM = 22;

    static TRAIT_SPARAM = 23;

    static TRAIT_ATTACK_ELEMENT = 31;

    static TRAIT_ATTACK_STATE = 32;

    static TRAIT_ATTACK_SPEED = 33;

    static TRAIT_ATTACK_TIMES = 34;

    static TRAIT_ATTACK_SKILL = 35;

    static TRAIT_STYPE_ADD = 41;

    static TRAIT_STYPE_SEAL = 42;

    static TRAIT_SKILL_ADD = 43;

    static TRAIT_SKILL_SEAL = 44;

    static TRAIT_EQUIP_WTYPE = 51;

    static TRAIT_EQUIP_ATYPE = 52;

    static TRAIT_EQUIP_LOCK = 53;

    static TRAIT_EQUIP_SEAL = 54;

    static TRAIT_SLOT_TYPE = 55;

    static TRAIT_ACTION_PLUS = 61;

    static TRAIT_SPECIAL_FLAG = 62;

    static TRAIT_COLLAPSE_TYPE = 63;

    static TRAIT_PARTY_ABILITY = 64;

    static FLAG_ID_AUTO_BATTLE = 0;

    static FLAG_ID_GUARD = 1;

    static FLAG_ID_SUBSTITUTE = 2;

    static FLAG_ID_PRESERVE_TP = 3;

    static ICON_BUFF_START = 32;

    static ICON_DEBUFF_START = 48;

    /** @type {number} */
    get hp() {
            return this._hp;
        }

    /** @type {number} */
    get mp() {
            return this._mp;
        }

    /** @type {number} */
    get tp() {
            return this._tp;
        }

    /** @type {number} */
    get mhp() {
            return this.param(0);
        }

    /** @type {number} */
    get mmp() {
            return this.param(1);
        }

    /** @type {number} */
    get atk() {
            return this.param(2);
        }

    /** @type {number} */
    get def() {
            return this.param(3);
        }

    /** @type {number} */
    get mat() {
            return this.param(4);
        }

    /** @type {number} */
    get mdf() {
            return this.param(5);
        }

    /** @type {number} */
    get agi() {
            return this.param(6);
        }

    /** @type {number} */
    get luk() {
            return this.param(7);
        }

    /** @type {number} */
    get hit() {
            return this.xparam(0);
        }

    /** @type {number} */
    get eva() {
            return this.xparam(1);
        }

    /** @type {number} */
    get cri() {
            return this.xparam(2);
        }

    /** @type {number} */
    get cev() {
            return this.xparam(3);
        }

    /** @type {number} */
    get mev() {
            return this.xparam(4);
        }

    /** @type {number} */
    get mrf() {
            return this.xparam(5);
        }

    /** @type {number} */
    get cnt() {
            return this.xparam(6);
        }

    /** @type {number} */
    get hrg() {
            return this.xparam(7);
        }

    /** @type {number} */
    get mrg() {
            return this.xparam(8);
        }

    /** @type {number} */
    get trg() {
            return this.xparam(9);
        }

    /** @type {number} */
    get tgr() {
            return this.sparam(0);
        }

    /** @type {number} */
    get grd() {
            return this.sparam(1);
        }

    /** @type {number} */
    get rec() {
            return this.sparam(2);
        }

    /** @type {number} */
    get pha() {
            return this.sparam(3);
        }

    /** @type {number} */
    get mcr() {
            return this.sparam(4);
        }

    /** @type {number} */
    get tcr() {
            return this.sparam(5);
        }

    /** @type {number} */
    get pdr() {
            return this.sparam(6);
        }

    /** @type {number} */
    get mdr() {
            return this.sparam(7);
        }

    /** @type {number} */
    get fdr() {
            return this.sparam(8);
        }

    /** @type {number} */
    get exr() {
            return this.sparam(9);
        }

    initialize() {
        this.initMembers();
    }

    /** @returns {void} */
    initMembers() {
        /** @type {number} */
        this._hp = 1;
        /** @type {number} */
        this._mp = 0;
        /** @type {number} */
        this._tp = 0;
        /** @type {boolean} */
        this._hidden = false;
        this.clearParamPlus();
        this.clearStates();
        this.clearBuffs();
    }

    /** @returns {void} */
    clearParamPlus() {
        this._paramPlus = [0, 0, 0, 0, 0, 0, 0, 0];
    }

    /** @returns {void} */
    clearStates() {
        this._states = [];
        this._stateTurns = {};
    }

    /**
     * @param {RMMZ.StateID} stateId
     * @returns {void}
     */
    eraseState(stateId) {
        this._states.remove(stateId);
        delete this._stateTurns[stateId];
    }

    /**
     * @param {RMMZ.StateID} stateId
     * @returns {boolean}
     */
    isStateAffected(stateId) {
        return this._states.includes(stateId);
    }

    /** @returns {boolean} */
    isDeathStateAffected() {
        return this.isStateAffected(this.deathStateId());
    }

    /** @returns {number} */
    deathStateId() {
        return 1;
    }

    /**
     * @param {RMMZ.StateID} stateId
     * @returns {void}
     */
    resetStateCounts(stateId) {
        const state = $dataStates[stateId];
        const variance = 1 + Math.max(state.maxTurns - state.minTurns, 0);
        this._stateTurns[stateId] = state.minTurns + Math.randomInt(variance);
    }

    /**
     * @param {RMMZ.StateID} stateId
     * @returns {boolean}
     */
    isStateExpired(stateId) {
        return this._stateTurns[stateId] === 0;
    }

    /** @returns {void} */
    updateStateTurns() {
        for (const stateId of this._states) {
            if (this._stateTurns[stateId] > 0) {
                this._stateTurns[stateId]--;
            }
        }
    }

    /** @returns {void} */
    clearBuffs() {
        this._buffs = [0, 0, 0, 0, 0, 0, 0, 0];
        this._buffTurns = [0, 0, 0, 0, 0, 0, 0, 0];
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {void}
     */
    eraseBuff(paramId) {
        this._buffs[paramId] = 0;
        this._buffTurns[paramId] = 0;
    }

    /** @returns {8} */
    buffLength() {
        return this._buffs.length;
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {number}
     */
    buff(paramId) {
        return this._buffs[paramId];
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {boolean}
     */
    isBuffAffected(paramId) {
        return this._buffs[paramId] > 0;
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {boolean}
     */
    isDebuffAffected(paramId) {
        return this._buffs[paramId] < 0;
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {boolean}
     */
    isBuffOrDebuffAffected(paramId) {
        return this._buffs[paramId] !== 0;
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {boolean}
     */
    isMaxBuffAffected(paramId) {
        return this._buffs[paramId] === 2;
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {boolean}
     */
    isMaxDebuffAffected(paramId) {
        return this._buffs[paramId] === -2;
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {void}
     */
    increaseBuff(paramId) {
        if (!this.isMaxBuffAffected(paramId)) {
            this._buffs[paramId]++;
        }
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {void}
     */
    decreaseBuff(paramId) {
        if (!this.isMaxDebuffAffected(paramId)) {
            this._buffs[paramId]--;
        }
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @param {number} turns
     * @returns {void}
     */
    overwriteBuffTurns(paramId, turns) {
        if (this._buffTurns[paramId] < turns) {
            this._buffTurns[paramId] = turns;
        }
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {boolean}
     */
    isBuffExpired(paramId) {
        return this._buffTurns[paramId] === 0;
    }

    /** @returns {void} */
    updateBuffTurns() {
        for (let i = 0; i < this._buffTurns.length; i++) {
            if (this._buffTurns[i] > 0) {
                this._buffTurns[i]--;
            }
        }
    }

    /** @returns {void} */
    die() {
        this._hp = 0;
        this.clearStates();
        this.clearBuffs();
    }

    /** @returns {void} */
    revive() {
        if (this._hp === 0) {
            this._hp = 1;
        }
    }

    /** @returns {import("../data").DataState[]} */
    states() {
        return this._states.map(id => $dataStates[id]);
    }

    /** @returns {number[]} */
    stateIcons() {
        return this.states()
            .map(state => state.iconIndex)
            .filter(iconIndex => iconIndex > 0);
    }

    /** @returns {number[]} */
    buffIcons() {
        const icons = [];
        for (let i = 0; i < this._buffs.length; i++) {
            if (this._buffs[i] !== 0) {
                icons.push(this.buffIconIndex(this._buffs[i], i));
            }
        }
        return icons;
    }

    /**
     * @param {number} buffLevel
     * @param {RMMZ.ParamID} paramId
     * @returns {number}
     */
    buffIconIndex(buffLevel, paramId) {
        if (buffLevel > 0) {
            return Game_BattlerBase.ICON_BUFF_START + (buffLevel - 1) * 8 + paramId;
        } else if (buffLevel < 0) {
            return (
                Game_BattlerBase.ICON_DEBUFF_START + (-buffLevel - 1) * 8 + paramId
            );
        } else {
            return 0;
        }
    }

    /** @returns {number[]} */
    allIcons() {
        return this.stateIcons().concat(this.buffIcons());
    }

    /** @returns {{ traits: RMMZ.Trait[]; }[]} */
    traitObjects() {
        // Returns an array of the all objects having traits. States only here.
        return this.states();
    }

    /** @returns {RMMZ.Trait[]} */
    allTraits() {
        return this.traitObjects().reduce((r, obj) => r.concat(obj.traits), []);
    }

    /**
     * @param {RMMZ.TraitType} code
     * @returns {RMMZ.Trait[]}
     */
    traits(code) {
        return this.allTraits().filter(trait => trait.code === code);
    }

    /**
     * @param {RMMZ.TraitType} code
     * @param {RMMZ.DataID} id
     * @returns {RMMZ.Trait[]}
     */
    traitsWithId(code, id) {
        return this.allTraits().filter(
            trait => trait.code === code && trait.dataId === id
        );
    }

    /**
     * @param {RMMZ.TraitType} code
     * @param {RMMZ.DataID} id
     * @returns {number}
     */
    traitsPi(code, id) {
        return this.traitsWithId(code, id).reduce((r, trait) => r * trait.value, 1);
    }

    /**
     * @param {RMMZ.TraitType} code
     * @param {RMMZ.DataID} id
     * @returns {number}
     */
    traitsSum(code, id) {
        return this.traitsWithId(code, id).reduce((r, trait) => r + trait.value, 0);
    }

    /**
     * @param {RMMZ.TraitType} code
     * @returns {number}
     */
    traitsSumAll(code) {
        return this.traits(code).reduce((r, trait) => r + trait.value, 0);
    }

    /**
     * @param {RMMZ.TraitType} code
     * @returns {number[]}
     */
    traitsSet(code) {
        return this.traits(code).reduce((r, trait) => r.concat(trait.dataId), []);
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {number}
     */
    paramBase(/*paramId*/) {
        return 0;
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {number}
     */
    paramPlus(paramId) {
        return this._paramPlus[paramId];
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {number}
     */
    paramBasePlus(paramId) {
        return Math.max(0, this.paramBase(paramId) + this.paramPlus(paramId));
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {0 | 1}
     */
    paramMin(paramId) {
        if (paramId === 0) {
            return 1; // MHP
        } else {
            return 0;
        }
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {number}
     */
    paramMax(/*paramId*/) {
        return Infinity;
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {number}
     */
    paramRate(paramId) {
        return this.traitsPi(Game_BattlerBase.TRAIT_PARAM, paramId);
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {number}
     */
    paramBuffRate(paramId) {
        return this._buffs[paramId] * 0.25 + 1.0;
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {number}
     */
    param(paramId) {
        const value =
            this.paramBasePlus(paramId) *
            this.paramRate(paramId) *
            this.paramBuffRate(paramId);
        const maxValue = this.paramMax(paramId);
        const minValue = this.paramMin(paramId);
        return Math.round(value.clamp(minValue, maxValue));
    }

    /**
     * @param {RMMZ.DataID} xparamId
     * @returns {number}
     */
    xparam(xparamId) {
        return this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, xparamId);
    }

    /**
     * @param {RMMZ.DataID} sparamId
     * @returns {number}
     */
    sparam(sparamId) {
        return this.traitsPi(Game_BattlerBase.TRAIT_SPARAM, sparamId);
    }

    /**
     * @param {RMMZ.DataID} elementId
     * @returns {number}
     */
    elementRate(elementId) {
        return this.traitsPi(Game_BattlerBase.TRAIT_ELEMENT_RATE, elementId);
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {number}
     */
    debuffRate(paramId) {
        return this.traitsPi(Game_BattlerBase.TRAIT_DEBUFF_RATE, paramId);
    }

    /**
     * @param {RMMZ.StateID} stateId
     * @returns {number}
     */
    stateRate(stateId) {
        return this.traitsPi(Game_BattlerBase.TRAIT_STATE_RATE, stateId);
    }

    /** @returns {number[]} */
    stateResistSet() {
        return this.traitsSet(Game_BattlerBase.TRAIT_STATE_RESIST);
    }

    /**
     * @param {RMMZ.StateID} stateId
     * @returns {boolean}
     */
    isStateResist(stateId) {
        return this.stateResistSet().includes(stateId);
    }

    /** @returns {number[]} */
    attackElements() {
        return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_ELEMENT);
    }

    /** @returns {number[]} */
    attackStates() {
        return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_STATE);
    }

    /**
     * @param {RMMZ.StateID} stateId
     * @returns {number}
     */
    attackStatesRate(stateId) {
        return this.traitsSum(Game_BattlerBase.TRAIT_ATTACK_STATE, stateId);
    }

    /** @returns {number} */
    attackSpeed() {
        return this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_SPEED);
    }

    /** @returns {number} */
    attackTimesAdd() {
        return Math.max(this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_TIMES), 0);
    }

    /** @returns {number} */
    attackSkillId() {
        const set = this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_SKILL);
        return set.length > 0 ? Math.max(...set) : 1;
    }

    /** @returns {number[]} */
    addedSkillTypes() {
        return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_ADD);
    }

    /**
     * @param {RMMZ.SkillType} stypeId
     * @returns {boolean}
     */
    isSkillTypeSealed(stypeId) {
        return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_SEAL).includes(stypeId);
    }

    /** @returns {number[]} */
    addedSkills() {
        return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_ADD);
    }

    /**
     * @param {RMMZ.SkillID} skillId
     * @returns {boolean}
     */
    isSkillSealed(skillId) {
        return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_SEAL).includes(skillId);
    }

    /**
     * @param {RMMZ.WeaponType} wtypeId
     * @returns {boolean}
     */
    isEquipWtypeOk(wtypeId) {
        return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_WTYPE).includes(wtypeId);
    }

    /**
     * @param {RMMZ.ArmorType} atypeId
     * @returns {boolean}
     */
    isEquipAtypeOk(atypeId) {
        return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_ATYPE).includes(atypeId);
    }

    /**
     * @param {RMMZ.ElementType} etypeId
     * @returns {boolean}
     */
    isEquipTypeLocked(etypeId) {
        return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_LOCK).includes(etypeId);
    }

    /**
     * @param {RMMZ.ElementType} etypeId
     * @returns {boolean}
     */
    isEquipTypeSealed(etypeId) {
        return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_SEAL).includes(etypeId);
    }

    /** @returns {number} */
    slotType() {
        const set = this.traitsSet(Game_BattlerBase.TRAIT_SLOT_TYPE);
        return set.length > 0 ? Math.max(...set) : 0;
    }

    /** @returns {boolean} */
    isDualWield() {
        return this.slotType() === 1;
    }

    /** @returns {number[]} */
    actionPlusSet() {
        return this.traits(Game_BattlerBase.TRAIT_ACTION_PLUS).map(
            trait => trait.value
        );
    }

    /**
     * @param {RMMZ.DataID} flagId
     * @returns {boolean}
     */
    specialFlag(flagId) {
        return this.traits(Game_BattlerBase.TRAIT_SPECIAL_FLAG).some(
            trait => trait.dataId === flagId
        );
    }

    /** @returns {number} */
    collapseType() {
        const set = this.traitsSet(Game_BattlerBase.TRAIT_COLLAPSE_TYPE);
        return set.length > 0 ? Math.max(...set) : 0;
    }

    /**
     * @param {RMMZ.DataID} abilityId
     * @returns {boolean}
     */
    partyAbility(abilityId) {
        return this.traits(Game_BattlerBase.TRAIT_PARTY_ABILITY).some(
            trait => trait.dataId === abilityId
        );
    }

    /** @returns {boolean} */
    isAutoBattle() {
        return this.specialFlag(Game_BattlerBase.FLAG_ID_AUTO_BATTLE);
    }

    /** @returns {boolean} */
    isGuard() {
        return this.specialFlag(Game_BattlerBase.FLAG_ID_GUARD) && this.canMove();
    }

    /** @returns {boolean} */
    isSubstitute() {
        return (
            this.specialFlag(Game_BattlerBase.FLAG_ID_SUBSTITUTE) && this.canMove()
        );
    }

    /** @returns {boolean} */
    isPreserveTp() {
        return this.specialFlag(Game_BattlerBase.FLAG_ID_PRESERVE_TP);
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @param {number} value
     * @returns {void}
     */
    addParam(paramId, value) {
        this._paramPlus[paramId] += value;
        this.refresh();
    }

    /**
     * @param {number} hp
     * @returns {void}
     */
    setHp(hp) {
        this._hp = hp;
        this.refresh();
    }

    /**
     * @param {number} mp
     * @returns {void}
     */
    setMp(mp) {
        this._mp = mp;
        this.refresh();
    }

    /**
     * @param {number} tp
     * @returns {void}
     */
    setTp(tp) {
        this._tp = tp;
        this.refresh();
    }

    /** @returns {number} */
    maxTp() {
        return 100;
    }

    /** @returns {void} */
    refresh() {
        for (const stateId of this.stateResistSet()) {
            this.eraseState(stateId);
        }
        this._hp = this._hp.clamp(0, this.mhp);
        this._mp = this._mp.clamp(0, this.mmp);
        this._tp = this._tp.clamp(0, this.maxTp());
    }

    /** @returns {void} */
    recoverAll() {
        this.clearStates();
        this._hp = this.mhp;
        this._mp = this.mmp;
    }

    /** @returns {number} */
    hpRate() {
        return this.hp / this.mhp;
    }

    /** @returns {number} */
    mpRate() {
        return this.mmp > 0 ? this.mp / this.mmp : 0;
    }

    /** @returns {number} */
    tpRate() {
        return this.tp / this.maxTp();
    }

    /** @returns {void} */
    hide() {
        this._hidden = true;
    }

    /** @returns {void} */
    appear() {
        this._hidden = false;
    }

    /** @returns {boolean} */
    isHidden() {
        return this._hidden;
    }

    /** @returns {boolean} */
    isAppeared() {
        return !this.isHidden();
    }

    /** @returns {boolean} */
    isDead() {
        return this.isAppeared() && this.isDeathStateAffected();
    }

    /** @returns {boolean} */
    isAlive() {
        return this.isAppeared() && !this.isDeathStateAffected();
    }

    /** @returns {boolean} */
    isDying() {
        return this.isAlive() && this._hp < this.mhp / 4;
    }

    /** @returns {boolean} */
    isRestricted() {
        return this.isAppeared() && this.restriction() > 0;
    }

    /** @returns {boolean} */
    canInput() {
        // prettier-ignore
        return this.isAppeared() && this.isActor() &&
                !this.isRestricted() && !this.isAutoBattle();
    }

    /** @returns {boolean} */
    canMove() {
        return this.isAppeared() && this.restriction() < 4;
    }

    /** @returns {boolean} */
    isConfused() {
        return (
            this.isAppeared() && this.restriction() >= 1 && this.restriction() <= 3
        );
    }

    /** @returns {number} */
    confusionLevel() {
        return this.isConfused() ? this.restriction() : 0;
    }

    /** @returns {this is Game_Actor} */
    isActor() {
        return false;
    }

    /** @returns {this is Game_Enemy} */
    isEnemy() {
        return false;
    }

    /** @returns {void} */
    sortStates() {
        this._states.sort((a, b) => {
            const p1 = $dataStates[a].priority;
            const p2 = $dataStates[b].priority;
            if (p1 !== p2) {
                return p2 - p1;
            }
            return a - b;
        });
    }

    /** @returns {number} */
    restriction() {
        const restrictions = this.states().map(state => state.restriction);
        return Math.max(0, ...restrictions);
    }

    /**
     * @param {RMMZ.StateID} stateId
     * @returns {void}
     */
    addNewState(stateId) {
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

    /** @returns {void} */
    onRestrict() {
        //
    }

    /** @returns {string} */
    mostImportantStateText() {
        for (const state of this.states()) {
            if (state.message3) {
                return state.message3;
            }
        }
        return "";
    }

    /** @returns {import("../data").Motion} */
    stateMotionIndex() {
        const states = this.states();
        if (states.length > 0) {
            return states[0].motion;
        } else {
            return 0;
        }
    }

    /** @returns {import("../data").Overlay} */
    stateOverlayIndex() {
        const states = this.states();
        if (states.length > 0) {
            return states[0].overlay;
        } else {
            return 0;
        }
    }

    /**
     * @param {RMMZ.DataSkill} skill
     * @returns {boolean}
     */
    isSkillWtypeOk(/*skill*/) {
        return true;
    }

    /**
     * @param {RMMZ.DataSkill} skill
     * @returns {number}
     */
    skillMpCost(skill) {
        return Math.floor(skill.mpCost * this.mcr);
    }

    /**
     * @param {RMMZ.DataSkill} skill
     * @returns {number}
     */
    skillTpCost(skill) {
        return skill.tpCost;
    }

    /**
     * @param {RMMZ.DataSkill} skill
     * @returns {boolean}
     */
    canPaySkillCost(skill) {
        return (
            this._tp >= this.skillTpCost(skill) &&
            this._mp >= this.skillMpCost(skill)
        );
    }

    /**
     * @param {RMMZ.DataSkill} skill
     * @returns {void}
     */
    paySkillCost(skill) {
        this._mp -= this.skillMpCost(skill);
        this._tp -= this.skillTpCost(skill);
    }

    /**
     * @param {RMMZ.DataSkill | RMMZ.DataItem} item
     * @returns {boolean}
     */
    isOccasionOk(item) {
        if ($gameParty.inBattle()) {
            return item.occasion === 0 || item.occasion === 1;
        } else {
            return item.occasion === 0 || item.occasion === 2;
        }
    }

    /**
     * @param {RMMZ.DataSkill | RMMZ.DataItem} item
     * @returns {boolean}
     */
    meetsUsableItemConditions(item) {
        return this.canMove() && this.isOccasionOk(item);
    }

    /**
     * @param {RMMZ.DataSkill} skill
     * @returns {boolean}
     */
    meetsSkillConditions(skill) {
        return (
            this.meetsUsableItemConditions(skill) &&
            this.isSkillWtypeOk(skill) &&
            this.canPaySkillCost(skill) &&
            !this.isSkillSealed(skill.id) &&
            !this.isSkillTypeSealed(skill.stypeId)
        );
    }

    /**
     * @param {RMMZ.DataSkill | RMMZ.DataItem} item
     * @returns {boolean}
     */
    meetsItemConditions(item) {
        return this.meetsUsableItemConditions(item) && $gameParty.hasItem(item);
    }

    /**
     * @param {RMMZ.DataItemBase | null} item
     * @returns {boolean}
     */
    canUse(item) {
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

    /**
     * @param {RMMZ.DataItemBase} item
     * @returns {item is RMMZ.DataWeapon | RMMZ.DataArmor}
     */
    canEquip(item) {
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

    /**
     * @param {RMMZ.DataWeapon} item
     * @returns {boolean}
     */
    canEquipWeapon(item) {
        return (
            this.isEquipWtypeOk(item.wtypeId) &&
            !this.isEquipTypeSealed(item.etypeId)
        );
    }

    /**
     * @param {RMMZ.DataArmor} item
     * @returns {boolean}
     */
    canEquipArmor(item) {
        return (
            this.isEquipAtypeOk(item.atypeId) &&
            !this.isEquipTypeSealed(item.etypeId)
        );
    }

    /** @returns {number} */
    guardSkillId() {
        return 2;
    }

    /** @returns {boolean} */
    canAttack() {
        return this.canUse($dataSkills[this.attackSkillId()]);
    }

    /** @returns {boolean} */
    canGuard() {
        return this.canUse($dataSkills[this.guardSkillId()]);
    }
}

/**
 * The superclass of Game_Actor and Game_Enemy. It contains methods for sprites
 * and actions.
 */
class Game_Battler extends Game_BattlerBase {
    /** @param {[]} args */
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
    }

    /** @returns {void} */
    initMembers() {
        super.initMembers();
        /** @type {Game_Action[]} */
        this._actions = [];
        /** @type {number} */
        this._speed = 0;
        /** @type {Game_ActionResult} */
        this._result = new Game_ActionResult();
        /** @type {RMMZ.ActionState | ""} */
        this._actionState = "";
        /** @type {number} */
        this._lastTargetIndex = 0;
        /** @type {boolean} */
        this._damagePopup = false;
        /** @type {RMMZ.BattlerEffectType | null} */
        this._effectType = null;
        /** @type {RMMZ.BattlerMotionType | null} */
        this._motionType = null;
        /** @type {number} */
        this._weaponImageId = 0;
        /** @type {boolean} */
        this._motionRefresh = false;
        /** @type {boolean} */
        this._selected = false;
        /** @type {string} */
        this._tpbState = "";
        /** @type {number} */
        this._tpbChargeTime = 0;
        /** @type {number} */
        this._tpbCastTime = 0;
        /** @type {number} */
        this._tpbIdleTime = 0;
        /** @type {number} */
        this._tpbTurnCount = 0;
        /** @type {boolean} */
        this._tpbTurnEnd = false;
    }

    /** @returns {void} */
    clearDamagePopup() {
        this._damagePopup = false;
    }

    /** @returns {void} */
    clearWeaponAnimation() {
        this._weaponImageId = 0;
    }

    /** @returns {void} */
    clearEffect() {
        this._effectType = null;
    }

    /** @returns {void} */
    clearMotion() {
        this._motionType = null;
        this._motionRefresh = false;
    }

    /**
     * @param {RMMZ.BattlerEffectType} effectType
     * @returns {void}
     */
    requestEffect(effectType) {
        this._effectType = effectType;
    }

    /**
     * @param {RMMZ.BattlerMotionType} motionType
     * @returns {void}
     */
    requestMotion(motionType) {
        this._motionType = motionType;
    }

    /** @returns {void} */
    requestMotionRefresh() {
        this._motionRefresh = true;
    }

    /** @returns {void} */
    cancelMotionRefresh() {
        this._motionRefresh = false;
    }

    /** @returns {void} */
    select() {
        this._selected = true;
    }

    /** @returns {void} */
    deselect() {
        this._selected = false;
    }

    /** @returns {boolean} */
    isDamagePopupRequested() {
        return this._damagePopup;
    }

    /** @returns {boolean} */
    isEffectRequested() {
        return !!this._effectType;
    }

    /** @returns {boolean} */
    isMotionRequested() {
        return !!this._motionType;
    }

    /** @returns {boolean} */
    isWeaponAnimationRequested() {
        return this._weaponImageId > 0;
    }

    /** @returns {boolean} */
    isMotionRefreshRequested() {
        return this._motionRefresh;
    }

    /** @returns {boolean} */
    isSelected() {
        return this._selected;
    }

    /** @returns {RMMZ.BattlerEffectType | null} */
    effectType() {
        return this._effectType;
    }

    /** @returns {RMMZ.BattlerMotionType | null} */
    motionType() {
        return this._motionType;
    }

    /** @returns {number} */
    weaponImageId() {
        return this._weaponImageId;
    }

    /** @returns {void} */
    startDamagePopup() {
        this._damagePopup = true;
    }

    /** @returns {boolean} */
    shouldPopupDamage() {
        const result = this._result;
        return (
            result.missed ||
            result.evaded ||
            result.hpAffected ||
            result.mpDamage !== 0
        );
    }

    /**
     * @param {RMMZ.DataID} weaponImageId
     * @returns {void}
     */
    startWeaponAnimation(weaponImageId) {
        this._weaponImageId = weaponImageId;
    }

    /**
     * @param {number} index
     * @returns {Game_Action}
     */
    action(index) {
        return this._actions[index];
    }

    /**
     * @param {number} index
     * @param {Game_Action} action
     * @returns {void}
     */
    setAction(index, action) {
        this._actions[index] = action;
    }

    /** @returns {number} */
    numActions() {
        return this._actions.length;
    }

    /** @returns {void} */
    clearActions() {
        this._actions = [];
    }

    /** @returns {Game_ActionResult} */
    result() {
        return this._result;
    }

    /** @returns {void} */
    clearResult() {
        this._result.clear();
    }

    /** @returns {void} */
    clearTpbChargeTime() {
        this._tpbState = "charging";
        this._tpbChargeTime = 0;
    }

    /** @returns {void} */
    applyTpbPenalty() {
        this._tpbState = "charging";
        this._tpbChargeTime -= 1;
    }

    /**
     * @param {boolean} [advantageous]
     * @returns {void}
     */
    initTpbChargeTime(advantageous) {
        const speed = this.tpbRelativeSpeed();
        this._tpbState = "charging";
        this._tpbChargeTime = advantageous ? 1 : speed * Math.random() * 0.5;
        if (this.isRestricted()) {
            this._tpbChargeTime = 0;
        }
    }

    /** @returns {number} */
    tpbChargeTime() {
        return this._tpbChargeTime;
    }

    /** @returns {void} */
    startTpbCasting() {
        this._tpbState = "casting";
        this._tpbCastTime = 0;
    }

    /** @returns {void} */
    startTpbAction() {
        this._tpbState = "acting";
    }

    /** @returns {boolean} */
    isTpbCharged() {
        return this._tpbState === "charged";
    }

    /** @returns {boolean} */
    isTpbReady() {
        return this._tpbState === "ready";
    }

    /** @returns {boolean} */
    isTpbTimeout() {
        return this._tpbIdleTime >= 1;
    }

    /** @returns {void} */
    updateTpb() {
        if (this.canMove()) {
            this.updateTpbChargeTime();
            this.updateTpbCastTime();
            this.updateTpbAutoBattle();
        }
        if (this.isAlive()) {
            this.updateTpbIdleTime();
        }
    }

    /** @returns {void} */
    updateTpbChargeTime() {
        if (this._tpbState === "charging") {
            this._tpbChargeTime += this.tpbAcceleration();
            if (this._tpbChargeTime >= 1) {
                this._tpbChargeTime = 1;
                this.onTpbCharged();
            }
        }
    }

    /** @returns {void} */
    updateTpbCastTime() {
        if (this._tpbState === "casting") {
            this._tpbCastTime += this.tpbAcceleration();
            if (this._tpbCastTime >= this.tpbRequiredCastTime()) {
                this._tpbCastTime = this.tpbRequiredCastTime();
                this._tpbState = "ready";
            }
        }
    }

    /** @returns {void} */
    updateTpbAutoBattle() {
        if (this.isTpbCharged() && !this.isTpbTurnEnd() && this.isAutoBattle()) {
            this.makeTpbActions();
        }
    }

    /** @returns {void} */
    updateTpbIdleTime() {
        if (!this.canMove() || this.isTpbCharged()) {
            this._tpbIdleTime += this.tpbAcceleration();
        }
    }

    /** @returns {number} */
    tpbAcceleration() {
        const speed = this.tpbRelativeSpeed();
        const referenceTime = $gameParty.tpbReferenceTime();
        return speed / referenceTime;
    }

    /** @returns {number} */
    tpbRelativeSpeed() {
        return this.tpbSpeed() / $gameParty.tpbBaseSpeed();
    }

    /** @returns {number} */
    tpbSpeed() {
        return Math.sqrt(this.agi) + 1;
    }

    /** @returns {number} */
    tpbBaseSpeed() {
        const baseAgility = this.paramBasePlus(6);
        return Math.sqrt(baseAgility) + 1;
    }

    /** @returns {number} */
    tpbRequiredCastTime() {
        const actions = this._actions.filter(action => action.isValid());
        const items = actions.map(action => action.item());
        const delay = items.reduce((r, item) => r + Math.max(0, -item.speed), 0);
        return Math.sqrt(delay) / this.tpbSpeed();
    }

    /** @returns {void} */
    onTpbCharged() {
        if (!this.shouldDelayTpbCharge()) {
            this.finishTpbCharge();
        }
    }

    /** @returns {boolean} */
    shouldDelayTpbCharge() {
        return !BattleManager.isActiveTpb() && $gameParty.canInput();
    }

    /** @returns {void} */
    finishTpbCharge() {
        this._tpbState = "charged";
        this._tpbTurnEnd = true;
        this._tpbIdleTime = 0;
    }

    /** @returns {boolean} */
    isTpbTurnEnd() {
        return this._tpbTurnEnd;
    }

    /** @returns {void} */
    initTpbTurn() {
        this._tpbTurnEnd = false;
        this._tpbTurnCount = 0;
        this._tpbIdleTime = 0;
    }

    /** @returns {void} */
    startTpbTurn() {
        this._tpbTurnEnd = false;
        this._tpbTurnCount++;
        this._tpbIdleTime = 0;
        if (this.numActions() === 0) {
            this.makeTpbActions();
        }
    }

    /** @returns {void} */
    makeTpbActions() {
        this.makeActions();
        if (this.canInput()) {
            this.setActionState("undecided");
        } else {
            this.startTpbCasting();
            this.setActionState("waiting");
        }
    }

    /** @returns {void} */
    onTpbTimeout() {
        this.onAllActionsEnd();
        this._tpbTurnEnd = true;
        this._tpbIdleTime = 0;
    }

    /** @returns {number} */
    turnCount() {
        if (BattleManager.isTpb()) {
            return this._tpbTurnCount;
        } else {
            return $gameTroop.turnCount() + 1;
        }
    }

    /** @returns {boolean} */
    canInput() {
        if (BattleManager.isTpb() && !this.isTpbCharged()) {
            return false;
        }
        return super.canInput();
    }

    /** @returns {void} */
    refresh() {
        super.refresh();
        if (this.hp === 0) {
            this.addState(this.deathStateId());
        } else {
            this.removeState(this.deathStateId());
        }
    }

    /**
     * @param {RMMZ.StateID} stateId
     * @returns {void}
     */
    addState(stateId) {
        if (this.isStateAddable(stateId)) {
            if (!this.isStateAffected(stateId)) {
                this.addNewState(stateId);
                this.refresh();
            }
            this.resetStateCounts(stateId);
            this._result.pushAddedState(stateId);
        }
    }

    /**
     * @param {RMMZ.StateID} stateId
     * @returns {boolean}
     */
    isStateAddable(stateId) {
        return (
            this.isAlive() &&
            $dataStates[stateId] &&
            !this.isStateResist(stateId) &&
            !this.isStateRestrict(stateId)
        );
    }

    /**
     * @param {RMMZ.StateID} stateId
     * @returns {boolean}
     */
    isStateRestrict(stateId) {
        return $dataStates[stateId].removeByRestriction && this.isRestricted();
    }

    /** @returns {void} */
    onRestrict() {
        super.onRestrict();
        this.clearTpbChargeTime();
        this.clearActions();
        for (const state of this.states()) {
            if (state.removeByRestriction) {
                this.removeState(state.id);
            }
        }
    }

    /**
     * @param {RMMZ.StateID} stateId
     * @returns {void}
     */
    removeState(stateId) {
        if (this.isStateAffected(stateId)) {
            if (stateId === this.deathStateId()) {
                this.revive();
            }
            this.eraseState(stateId);
            this.refresh();
            this._result.pushRemovedState(stateId);
        }
    }

    /** @returns {void} */
    escape() {
        if ($gameParty.inBattle()) {
            this.hide();
        }
        this.clearActions();
        this.clearStates();
        SoundManager.playEscape();
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @param {number} turns
     * @returns {void}
     */
    addBuff(paramId, turns) {
        if (this.isAlive()) {
            this.increaseBuff(paramId);
            if (this.isBuffAffected(paramId)) {
                this.overwriteBuffTurns(paramId, turns);
            }
            this._result.pushAddedBuff(paramId);
            this.refresh();
        }
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @param {number} turns
     * @returns {void}
     */
    addDebuff(paramId, turns) {
        if (this.isAlive()) {
            this.decreaseBuff(paramId);
            if (this.isDebuffAffected(paramId)) {
                this.overwriteBuffTurns(paramId, turns);
            }
            this._result.pushAddedDebuff(paramId);
            this.refresh();
        }
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {void}
     */
    removeBuff(paramId) {
        if (this.isAlive() && this.isBuffOrDebuffAffected(paramId)) {
            this.eraseBuff(paramId);
            this._result.pushRemovedBuff(paramId);
            this.refresh();
        }
    }

    /** @returns {void} */
    removeBattleStates() {
        for (const state of this.states()) {
            if (state.removeAtBattleEnd) {
                this.removeState(state.id);
            }
        }
    }

    /** @returns {void} */
    removeAllBuffs() {
        for (let i = 0; i < this.buffLength(); i++) {
            this.removeBuff(i);
        }
    }

    /**
     * @param {RMMZ.AutoRemovalTiming} timing
     * @returns {void}
     */
    removeStatesAuto(timing) {
        for (const state of this.states()) {
            if (
                this.isStateExpired(state.id) &&
                state.autoRemovalTiming === timing
            ) {
                this.removeState(state.id);
            }
        }
    }

    /** @returns {void} */
    removeBuffsAuto() {
        for (let i = 0; i < this.buffLength(); i++) {
            if (this.isBuffExpired(i)) {
                this.removeBuff(i);
            }
        }
    }

    /** @returns {void} */
    removeStatesByDamage() {
        for (const state of this.states()) {
            if (
                state.removeByDamage &&
                Math.randomInt(100) < state.chanceByDamage
            ) {
                this.removeState(state.id);
            }
        }
    }

    /** @returns {number} */
    makeActionTimes() {
        const actionPlusSet = this.actionPlusSet();
        return actionPlusSet.reduce((r, p) => (Math.random() < p ? r + 1 : r), 1);
    }

    /** @returns {void} */
    makeActions() {
        this.clearActions();
        if (this.canMove()) {
            const actionTimes = this.makeActionTimes();
            this._actions = [];
            for (let i = 0; i < actionTimes; i++) {
                this._actions.push(new Game_Action(this));
            }
        }
    }

    /** @returns {number} */
    speed() {
        return this._speed;
    }

    /** @returns {void} */
    makeSpeed() {
        this._speed = Math.min(...this._actions.map(action => action.speed())) || 0;
    }

    /** @returns {Game_Action} */
    currentAction() {
        return this._actions[0];
    }

    /** @returns {void} */
    removeCurrentAction() {
        this._actions.shift();
    }

    /**
     * @param {Game_Actor | Game_Enemy} target
     * @returns {void}
     */
    setLastTarget(target) {
        this._lastTargetIndex = target ? target.index() : 0;
    }

    /**
     * @param {RMMZ.SkillID} skillId
     * @param {RMMZ.ActorID | RMMZ.EnemyID} targetIndex
     * @returns {void}
     */
    forceAction(skillId, targetIndex) {
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

    /**
     * @param {RMMZ.ActionItem} item
     * @returns {void}
     */
    useItem(item) {
        if (DataManager.isSkill(item)) {
            this.paySkillCost(item);
        } else if (DataManager.isItem(item)) {
            this.consumeItem(item);
        }
    }

    /**
     * @param {RMMZ.DataItem} item
     * @returns {void}
     */
    consumeItem(item) {
        $gameParty.consumeItem(item);
    }

    /**
     * @param {number} value
     * @returns {void}
     */
    gainHp(value) {
        this._result.hpDamage = -value;
        this._result.hpAffected = true;
        this.setHp(this.hp + value);
    }

    /**
     * @param {number} value
     * @returns {void}
     */
    gainMp(value) {
        this._result.mpDamage = -value;
        this.setMp(this.mp + value);
    }

    /**
     * @param {number} value
     * @returns {void}
     */
    gainTp(value) {
        this._result.tpDamage = -value;
        this.setTp(this.tp + value);
    }

    /**
     * @param {number} value
     * @returns {void}
     */
    gainSilentTp(value) {
        this.setTp(this.tp + value);
    }

    /** @returns {void} */
    initTp() {
        this.setTp(Math.randomInt(25));
    }

    /** @returns {void} */
    clearTp() {
        this.setTp(0);
    }

    /**
     * @param {number} damageRate
     * @returns {void}
     */
    chargeTpByDamage(damageRate) {
        const value = Math.floor(50 * damageRate * this.tcr);
        this.gainSilentTp(value);
    }

    /** @returns {void} */
    regenerateHp() {
        const minRecover = -this.maxSlipDamage();
        const value = Math.max(Math.floor(this.mhp * this.hrg), minRecover);
        if (value !== 0) {
            this.gainHp(value);
        }
    }

    /** @returns {number} */
    maxSlipDamage() {
        return $dataSystem.optSlipDeath ? this.hp : Math.max(this.hp - 1, 0);
    }

    /** @returns {void} */
    regenerateMp() {
        const value = Math.floor(this.mmp * this.mrg);
        if (value !== 0) {
            this.gainMp(value);
        }
    }

    /** @returns {void} */
    regenerateTp() {
        const value = Math.floor(100 * this.trg);
        this.gainSilentTp(value);
    }

    /** @returns {void} */
    regenerateAll() {
        if (this.isAlive()) {
            this.regenerateHp();
            this.regenerateMp();
            this.regenerateTp();
        }
    }

    /**
     * @param {boolean} [advantageous]
     * @returns {void}
     */
    onBattleStart(advantageous) {
        this.setActionState("undecided");
        this.clearMotion();
        this.initTpbChargeTime(advantageous);
        this.initTpbTurn();
        if (!this.isPreserveTp()) {
            this.initTp();
        }
    }

    /** @returns {void} */
    onAllActionsEnd() {
        this.clearResult();
        this.removeStatesAuto(1);
        this.removeBuffsAuto();
    }

    /** @returns {void} */
    onTurnEnd() {
        this.clearResult();
        this.regenerateAll();
        this.updateStateTurns();
        this.updateBuffTurns();
        this.removeStatesAuto(2);
    }

    /** @returns {void} */
    onBattleEnd() {
        this.clearResult();
        this.removeBattleStates();
        this.removeAllBuffs();
        this.clearActions();
        if (!this.isPreserveTp()) {
            this.clearTp();
        }
        this.appear();
    }

    /**
     * @param {number} value
     * @returns {void}
     */
    onDamage(value) {
        this.removeStatesByDamage();
        this.chargeTpByDamage(value / this.mhp);
    }

    /**
     * @param {RMMZ.ActionState} actionState
     * @returns {void}
     */
    setActionState(actionState) {
        this._actionState = actionState;
        this.requestMotionRefresh();
    }

    /** @returns {boolean} */
    isUndecided() {
        return this._actionState === "undecided";
    }

    /** @returns {boolean} */
    isInputting() {
        return this._actionState === "inputting";
    }

    /** @returns {boolean} */
    isWaiting() {
        return this._actionState === "waiting";
    }

    /** @returns {boolean} */
    isActing() {
        return this._actionState === "acting";
    }

    /** @returns {boolean} */
    isChanting() {
        if (this.isWaiting()) {
            return this._actions.some(action => action.isMagicSkill());
        }
        return false;
    }

    /** @returns {boolean} */
    isGuardWaiting() {
        if (this.isWaiting()) {
            return this._actions.some(action => action.isGuard());
        }
        return false;
    }

    /**
     * @param {Game_Action} action
     * @returns {void}
     */
    performActionStart(action) {
        if (!action.isGuard()) {
            this.setActionState("acting");
        }
    }

    /**
     * @param {Game_Action} action
     * @returns {void}
     */
    performAction(/*action*/) {
        //
    }

    /** @returns {void} */
    performActionEnd() {
        //
    }

    /** @returns {void} */
    performDamage() {
        //
    }

    /** @returns {void} */
    performMiss() {
        SoundManager.playMiss();
    }

    /** @returns {void} */
    performRecovery() {
        SoundManager.playRecovery();
    }

    /** @returns {void} */
    performEvasion() {
        SoundManager.playEvasion();
    }

    /** @returns {void} */
    performMagicEvasion() {
        SoundManager.playMagicEvasion();
    }

    /** @returns {void} */
    performCounter() {
        SoundManager.playEvasion();
    }

    /** @returns {void} */
    performReflection() {
        SoundManager.playReflection();
    }

    /**
     * @param {Game_Battler} target
     * @returns {void}
     */
    performSubstitute(/*target*/) {
        //
    }

    /** @returns {void} */
    performCollapse() {
        //
    }
}

/**
 * The game object class for an actor.
 */
class Game_Actor extends Game_Battler {
    /** @param {[actorId: RMMZ.ActorID]} args */
    constructor(...args) {
        super(...args);
    }

    /** @type {number} */
    get level() {
        return this._level;
    }

    /** @param {RMMZ.ActorID} actorId */
    initialize(actorId) {
        super.initialize();
        this.setup(actorId);
    }

    /** @returns {void} */
    initMembers() {
        super.initMembers();
        /** @type {number} */
        this._actorId = 0;
        /** @type {string} */
        this._name = "";
        /** @type {string} */
        this._nickname = "";
        /** @type {number} */
        this._classId = 0;
        /** @type {number} */
        this._level = 0;
        /** @type {string} */
        this._characterName = "";
        /** @type {number} */
        this._characterIndex = 0;
        /** @type {string} */
        this._faceName = "";
        /** @type {number} */
        this._faceIndex = 0;
        /** @type {string} */
        this._battlerName = "";
        /** @type {Record<RMMZ.ClassID, number>} */
        this._exp = {};
        /** @type {RMMZ.SkillID[]} */
        this._skills = [];
        /** @type {Game_Item[]} */
        this._equips = [];
        /** @type {number} */
        this._actionInputIndex = 0;
        /** @type {Game_Item} */
        this._lastMenuSkill = new Game_Item();
        /** @type {Game_Item} */
        this._lastBattleSkill = new Game_Item();
        /** @type {string} */
        this._lastCommandSymbol = "";
    }

    /**
     * @param {RMMZ.ActorID} actorId
     * @returns {void}
     */
    setup(actorId) {
        const actor = $dataActors[actorId];
        this._actorId = actorId;
        this._name = actor.name;
        this._nickname = actor.nickname;
        this._profile = actor.profile;
        this._classId = actor.classId;
        this._level = actor.initialLevel;
        this.initImages();
        this.initExp();
        this.initSkills();
        this.initEquips(actor.equips);
        this.clearParamPlus();
        this.recoverAll();
    }

    /** @returns {number} */
    actorId() {
        return this._actorId;
    }

    /** @returns {import("../data").DataActor} */
    actor() {
        return $dataActors[this._actorId];
    }

    /** @returns {string} */
    name() {
        return this._name;
    }

    /**
     * @param {string} name
     * @returns {void}
     */
    setName(name) {
        this._name = name;
    }

    /** @returns {string} */
    nickname() {
        return this._nickname;
    }

    /**
     * @param {string} nickname
     * @returns {void}
     */
    setNickname(nickname) {
        this._nickname = nickname;
    }

    /** @returns {string} */
    profile() {
        return this._profile;
    }

    /**
     * @param {string} profile
     * @returns {void}
     */
    setProfile(profile) {
        this._profile = profile;
    }

    /** @returns {string} */
    characterName() {
        return this._characterName;
    }

    /** @returns {number} */
    characterIndex() {
        return this._characterIndex;
    }

    /** @returns {string} */
    faceName() {
        return this._faceName;
    }

    /** @returns {number} */
    faceIndex() {
        return this._faceIndex;
    }

    /** @returns {string} */
    battlerName() {
        return this._battlerName;
    }

    /** @returns {void} */
    clearStates() {
        super.clearStates();
        this._stateSteps = {};
    }

    /**
     * @param {RMMZ.StateID} stateId
     * @returns {void}
     */
    eraseState(stateId) {
        super.eraseState(stateId);
        delete this._stateSteps[stateId];
    }

    /**
     * @param {RMMZ.StateID} stateId
     * @returns {void}
     */
    resetStateCounts(stateId) {
        super.resetStateCounts(stateId);
        this._stateSteps[stateId] = $dataStates[stateId].stepsToRemove;
    }

    /** @returns {void} */
    initImages() {
        const actor = this.actor();
        this._characterName = actor.characterName;
        this._characterIndex = actor.characterIndex;
        this._faceName = actor.faceName;
        this._faceIndex = actor.faceIndex;
        this._battlerName = actor.battlerName;
    }

    /**
     * @param {number} level
     * @returns {number}
     */
    expForLevel(level) {
        const c = this.currentClass();
        const basis = c.expParams[0];
        const extra = c.expParams[1];
        const acc_a = c.expParams[2];
        const acc_b = c.expParams[3];
        return Math.round(
            (basis * Math.pow(level - 1, 0.9 + acc_a / 250) * level * (level + 1)) /
                (6 + Math.pow(level, 2) / 50 / acc_b) +
                (level - 1) * extra
        );
    }

    /** @returns {void} */
    initExp() {
        this._exp[this._classId] = this.currentLevelExp();
    }

    /** @returns {number} */
    currentExp() {
        return this._exp[this._classId];
    }

    /** @returns {number} */
    currentLevelExp() {
        return this.expForLevel(this._level);
    }

    /** @returns {number} */
    nextLevelExp() {
        return this.expForLevel(this._level + 1);
    }

    /** @returns {number} */
    nextRequiredExp() {
        return this.nextLevelExp() - this.currentExp();
    }

    /** @returns {number} */
    maxLevel() {
        return this.actor().maxLevel;
    }

    /** @returns {boolean} */
    isMaxLevel() {
        return this._level >= this.maxLevel();
    }

    /** @returns {void} */
    initSkills() {
        this._skills = [];
        for (const learning of this.currentClass().learnings) {
            if (learning.level <= this._level) {
                this.learnSkill(learning.skillId);
            }
        }
    }

    /**
     * @param {(RMMZ.WeaponID | RMMZ.ArmorID)[]} equips
     * @returns {void}
     */
    initEquips(equips) {
        const slots = this.equipSlots();
        const maxSlots = slots.length;
        this._equips = [];
        for (let i = 0; i < maxSlots; i++) {
            this._equips[i] = new Game_Item();
        }
        for (let j = 0; j < equips.length; j++) {
            if (j < maxSlots) {
                this._equips[j].setEquip(slots[j] === 1, equips[j]);
            }
        }
        this.releaseUnequippableItems(true);
        this.refresh();
    }

    /** @returns {number[]} */
    equipSlots() {
        const slots = [];
        for (let i = 1; i < $dataSystem.equipTypes.length; i++) {
            slots.push(i);
        }
        if (slots.length >= 2 && this.isDualWield()) {
            slots[1] = 1;
        }
        return slots;
    }

    /** @returns {RMMZ.DataEquipment[]} */
    equips() {
        return this._equips.map(item => item.object());
    }

    /** @returns {RMMZ.DataWeapon[]} */
    weapons() {
        return this.equips().filter(item => item && DataManager.isWeapon(item));
    }

    /** @returns {RMMZ.DataArmor[]} */
    armors() {
        return this.equips().filter(item => item && DataManager.isArmor(item));
    }

    /**
     * @param {RMMZ.DataWeapon} weapon
     * @returns {boolean}
     */
    hasWeapon(weapon) {
        return this.weapons().includes(weapon);
    }

    /**
     * @param {RMMZ.DataArmor} armor
     * @returns {boolean}
     */
    hasArmor(armor) {
        return this.armors().includes(armor);
    }

    /**
     * @param {RMMZ.EquipmentSlotID} slotId
     * @returns {boolean}
     */
    isEquipChangeOk(slotId) {
        return (
            !this.isEquipTypeLocked(this.equipSlots()[slotId]) &&
            !this.isEquipTypeSealed(this.equipSlots()[slotId])
        );
    }

    /**
     * @param {RMMZ.EquipmentSlotID} slotId
     * @param {RMMZ.DataEquipment | null} item
     * @returns {void}
     */
    changeEquip(slotId, item) {
        if (
            this.tradeItemWithParty(item, this.equips()[slotId]) &&
            (!item || this.equipSlots()[slotId] === item.etypeId)
        ) {
            this._equips[slotId].setObject(item);
            this.refresh();
        }
    }

    /**
     * @param {RMMZ.EquipmentSlotID} slotId
     * @param {RMMZ.DataEquipment | null} item
     * @returns {void}
     */
    forceChangeEquip(slotId, item) {
        this._equips[slotId].setObject(item);
        this.releaseUnequippableItems(true);
        this.refresh();
    }

    /**
     * @param {RMMZ.DataEquipment | null} newItem
     * @param {RMMZ.DataEquipment | null} oldItem
     * @returns {boolean}
     */
    tradeItemWithParty(newItem, oldItem) {
        if (newItem && !$gameParty.hasItem(newItem)) {
            return false;
        } else {
            $gameParty.gainItem(oldItem, 1);
            $gameParty.loseItem(newItem, 1);
            return true;
        }
    }

    /**
     * @param {RMMZ.EquipmentType} etypeId
     * @param {RMMZ.WeaponID | RMMZ.ArmorID} itemId
     * @returns {void}
     */
    changeEquipById(etypeId, itemId) {
        const slotId = etypeId - 1;
        if (this.equipSlots()[slotId] === 1) {
            this.changeEquip(slotId, $dataWeapons[itemId]);
        } else {
            this.changeEquip(slotId, $dataArmors[itemId]);
        }
    }

    /**
     * @param {RMMZ.DataEquipment} item
     * @returns {boolean}
     */
    isEquipped(item) {
        return this.equips().includes(item);
    }

    /**
     * @param {RMMZ.DataEquipment} item
     * @returns {void}
     */
    discardEquip(item) {
        const slotId = this.equips().indexOf(item);
        if (slotId >= 0) {
            this._equips[slotId].setObject(null);
        }
    }

    /**
     * @param {boolean} forcing
     * @returns {void}
     */
    releaseUnequippableItems(forcing) {
        for (;;) {
            const slots = this.equipSlots();
            const equips = this.equips();
            let changed = false;
            for (let i = 0; i < equips.length; i++) {
                const item = equips[i];
                if (item && (!this.canEquip(item) || item.etypeId !== slots[i])) {
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

    /** @returns {void} */
    clearEquipments() {
        const maxSlots = this.equipSlots().length;
        for (let i = 0; i < maxSlots; i++) {
            if (this.isEquipChangeOk(i)) {
                this.changeEquip(i, null);
            }
        }
    }

    /** @returns {void} */
    optimizeEquipments() {
        const maxSlots = this.equipSlots().length;
        this.clearEquipments();
        for (let i = 0; i < maxSlots; i++) {
            if (this.isEquipChangeOk(i)) {
                this.changeEquip(i, this.bestEquipItem(i));
            }
        }
    }

    /**
     * @param {RMMZ.EquipmentSlotID} slotId
     * @returns {RMMZ.DataEquipment | null}
     */
    bestEquipItem(slotId) {
        const etypeId = this.equipSlots()[slotId];
        const items = $gameParty
            .equipItems()
            .filter(item => item.etypeId === etypeId && this.canEquip(item));
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

    /**
     * @param {RMMZ.DataEquipment} item
     * @returns {number}
     */
    calcEquipItemPerformance(item) {
        return item.params.reduce((a, b) => a + b);
    }

    /**
     * @param {RMMZ.DataSkill} skill
     * @returns {boolean}
     */
    isSkillWtypeOk(skill) {
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

    /**
     * @param {RMMZ.WeaponType} wtypeId
     * @returns {boolean}
     */
    isWtypeEquipped(wtypeId) {
        return this.weapons().some(weapon => weapon.wtypeId === wtypeId);
    }

    /** @returns {void} */
    refresh() {
        this.releaseUnequippableItems(false);
        super.refresh();
    }

    /** @returns {void} */
    hide() {
        super.hide();
        $gameTemp.requestBattleRefresh();
    }

    /** @returns {this is Game_Actor} */
    isActor() {
        return true;
    }

    /** @returns {import("./Game_Party").Game_Party} */
    friendsUnit() {
        return $gameParty;
    }

    /** @returns {import("./Game_Troop").Game_Troop} */
    opponentsUnit() {
        return $gameTroop;
    }

    /** @returns {number} */
    index() {
        return $gameParty.members().indexOf(this);
    }

    /** @returns {boolean} */
    isBattleMember() {
        return $gameParty.battleMembers().includes(this);
    }

    /** @returns {boolean} */
    isFormationChangeOk() {
        return true;
    }

    /** @returns {RMMZ.DataClass} */
    currentClass() {
        return $dataClasses[this._classId];
    }

    /**
     * @param {RMMZ.DataClass} gameClass
     * @returns {boolean}
     */
    isClass(gameClass) {
        return gameClass && this._classId === gameClass.id;
    }

    /** @returns {number[]} */
    skillTypes() {
        const skillTypes = this.addedSkillTypes().sort((a, b) => a - b);
        return skillTypes.filter((x, i, self) => self.indexOf(x) === i);
    }

    /** @returns {RMMZ.DataSkill[]} */
    skills() {
        const list = [];
        for (const id of this._skills.concat(this.addedSkills())) {
            if (!list.includes($dataSkills[id])) {
                list.push($dataSkills[id]);
            }
        }
        return list;
    }

    /** @returns {RMMZ.DataSkill[]} */
    usableSkills() {
        return this.skills().filter(skill => this.canUse(skill));
    }

    /** @returns {{ traits: import("../data").Trait[]; }[]} */
    traitObjects() {
        const objects = super.traitObjects();
        objects.push(this.actor(), this.currentClass());
        for (const item of this.equips()) {
            if (item) {
                objects.push(item);
            }
        }
        return objects;
    }

    /** @returns {number[]} */
    attackElements() {
        const set = super.attackElements();
        if (this.hasNoWeapons() && !set.includes(this.bareHandsElementId())) {
            set.push(this.bareHandsElementId());
        }
        return set;
    }

    /** @returns {boolean} */
    hasNoWeapons() {
        return this.weapons().length === 0;
    }

    /** @returns {number} */
    bareHandsElementId() {
        return 1;
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {number}
     */
    paramBase(paramId) {
        return this.currentClass().params[paramId][this._level];
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {number}
     */
    paramPlus(paramId) {
        let value = super.paramPlus(paramId);
        for (const item of this.equips()) {
            if (item) {
                value += item.params[paramId];
            }
        }
        return value;
    }

    /** @returns {number} */
    attackAnimationId1() {
        if (this.hasNoWeapons()) {
            return this.bareHandsAnimationId();
        } else {
            const weapons = this.weapons();
            return weapons[0] ? weapons[0].animationId : 0;
        }
    }

    /** @returns {0} */
    attackAnimationId2() {
        const weapons = this.weapons();
        return weapons[1] ? weapons[1].animationId : 0;
    }

    /** @returns {number} */
    bareHandsAnimationId() {
        return 1;
    }

    /**
     * @param {number} exp
     * @param {boolean} [show]
     * @returns {void}
     */
    changeExp(exp, show) {
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

    /** @returns {void} */
    levelUp() {
        this._level++;
        for (const learning of this.currentClass().learnings) {
            if (learning.level === this._level) {
                this.learnSkill(learning.skillId);
            }
        }
    }

    /** @returns {void} */
    levelDown() {
        this._level--;
    }

    /**
     * @param {RMMZ.DataSkill[]} lastSkills
     * @returns {RMMZ.DataSkill[]}
     */
    findNewSkills(lastSkills) {
        const newSkills = this.skills();
        for (const lastSkill of lastSkills) {
            newSkills.remove(lastSkill);
        }
        return newSkills;
    }

    /**
     * @param {RMMZ.DataSkill[]} newSkills
     * @returns {void}
     */
    displayLevelUp(newSkills) {
        const text = TextManager.levelUp.format(
            this._name,
            TextManager.level,
            this._level
        );
        $gameMessage.newPage();
        $gameMessage.add(text);
        for (const skill of newSkills) {
            $gameMessage.add(TextManager.obtainSkill.format(skill.name));
        }
    }

    /**
     * @param {number} exp
     * @returns {void}
     */
    gainExp(exp) {
        const newExp = this.currentExp() + Math.round(exp * this.finalExpRate());
        this.changeExp(newExp, this.shouldDisplayLevelUp());
    }

    /** @returns {number} */
    finalExpRate() {
        return this.exr * (this.isBattleMember() ? 1 : this.benchMembersExpRate());
    }

    /** @returns {0 | 1} */
    benchMembersExpRate() {
        return $dataSystem.optExtraExp ? 1 : 0;
    }

    /** @returns {boolean} */
    shouldDisplayLevelUp() {
        return true;
    }

    /**
     * @param {number} level
     * @param {boolean} [show]
     * @returns {void}
     */
    changeLevel(level, show) {
        level = level.clamp(1, this.maxLevel());
        this.changeExp(this.expForLevel(level), show);
    }

    /**
     * @param {RMMZ.SkillID} skillId
     * @returns {void}
     */
    learnSkill(skillId) {
        if (!this.isLearnedSkill(skillId)) {
            this._skills.push(skillId);
            this._skills.sort((a, b) => a - b);
        }
    }

    /**
     * @param {RMMZ.SkillID} skillId
     * @returns {void}
     */
    forgetSkill(skillId) {
        this._skills.remove(skillId);
    }

    /**
     * @param {RMMZ.SkillID} skillId
     * @returns {boolean}
     */
    isLearnedSkill(skillId) {
        return this._skills.includes(skillId);
    }

    /**
     * @param {RMMZ.SkillID} skillId
     * @returns {boolean}
     */
    hasSkill(skillId) {
        return this.skills().includes($dataSkills[skillId]);
    }

    /**
     * @param {RMMZ.ClassID} classId
     * @param {boolean} [keepExp]
     * @returns {void}
     */
    changeClass(classId, keepExp) {
        if (keepExp) {
            this._exp[classId] = this.currentExp();
        }
        this._classId = classId;
        this._level = 0;
        this.changeExp(this._exp[this._classId] || 0, false);
        this.refresh();
    }

    /**
     * @param {string} characterName
     * @param {number} characterIndex
     * @returns {void}
     */
    setCharacterImage(
        characterName,
        characterIndex
    ) {
        this._characterName = characterName;
        this._characterIndex = characterIndex;
    }

    /**
     * @param {string} faceName
     * @param {number} faceIndex
     * @returns {void}
     */
    setFaceImage(faceName, faceIndex) {
        this._faceName = faceName;
        this._faceIndex = faceIndex;
        $gameTemp.requestBattleRefresh();
    }

    /**
     * @param {string} battlerName
     * @returns {void}
     */
    setBattlerImage(battlerName) {
        this._battlerName = battlerName;
    }

    /** @returns {boolean} */
    isSpriteVisible() {
        return $gameSystem.isSideView();
    }

    /**
     * @param {Game_Action} action
     * @returns {void}
     */
    performActionStart(action) {
        super.performActionStart(action);
    }

    /**
     * @param {Game_Action} action
     * @returns {void}
     */
    performAction(action) {
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

    /** @returns {void} */
    performActionEnd() {
        super.performActionEnd();
    }

    /** @returns {void} */
    performAttack() {
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

    /** @returns {void} */
    performDamage() {
        super.performDamage();
        if (this.isSpriteVisible()) {
            this.requestMotion("damage");
        } else {
            $gameScreen.startShake(5, 5, 10);
        }
        SoundManager.playActorDamage();
    }

    /** @returns {void} */
    performEvasion() {
        super.performEvasion();
        this.requestMotion("evade");
    }

    /** @returns {void} */
    performMagicEvasion() {
        super.performMagicEvasion();
        this.requestMotion("evade");
    }

    /** @returns {void} */
    performCounter() {
        super.performCounter();
        this.performAttack();
    }

    /** @returns {void} */
    performCollapse() {
        super.performCollapse();
        if ($gameParty.inBattle()) {
            SoundManager.playActorCollapse();
        }
    }

    /** @returns {void} */
    performVictory() {
        this.setActionState("done");
        if (this.canMove()) {
            this.requestMotion("victory");
        }
    }

    /** @returns {void} */
    performEscape() {
        if (this.canMove()) {
            this.requestMotion("escape");
        }
    }

    /** @returns {Game_Action[]} */
    makeActionList() {
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

    /** @returns {void} */
    makeAutoBattleActions() {
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

    /** @returns {void} */
    makeConfusionActions() {
        for (let i = 0; i < this.numActions(); i++) {
            this.action(i).setConfusion();
        }
        this.setActionState("waiting");
    }

    /** @returns {void} */
    makeActions() {
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

    /** @returns {void} */
    onPlayerWalk() {
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

    /**
     * @param {RMMZ.DataState} state
     * @returns {void}
     */
    updateStateSteps(state) {
        if (state.removeByWalking) {
            if (this._stateSteps[state.id] > 0) {
                if (--this._stateSteps[state.id] === 0) {
                    this.removeState(state.id);
                }
            }
        }
    }

    /** @returns {void} */
    showAddedStates() {
        for (const state of this.result().addedStateObjects()) {
            if (state.message1) {
                $gameMessage.add(state.message1.format(this._name));
            }
        }
    }

    /** @returns {void} */
    showRemovedStates() {
        for (const state of this.result().removedStateObjects()) {
            if (state.message4) {
                $gameMessage.add(state.message4.format(this._name));
            }
        }
    }

    /** @returns {number} */
    stepsForTurn() {
        return 20;
    }

    /** @returns {void} */
    turnEndOnMap() {
        if ($gameParty.steps() % this.stepsForTurn() === 0) {
            this.onTurnEnd();
            if (this.result().hpDamage > 0) {
                this.performMapDamage();
            }
        }
    }

    /** @returns {void} */
    checkFloorEffect() {
        if ($gamePlayer.isOnDamageFloor()) {
            this.executeFloorDamage();
        }
    }

    /** @returns {void} */
    executeFloorDamage() {
        const floorDamage = Math.floor(this.basicFloorDamage() * this.fdr);
        const realDamage = Math.min(floorDamage, this.maxFloorDamage());
        this.gainHp(-realDamage);
        if (realDamage > 0) {
            this.performMapDamage();
        }
    }

    /** @returns {number} */
    basicFloorDamage() {
        return 10;
    }

    /** @returns {number} */
    maxFloorDamage() {
        return $dataSystem.optFloorDeath ? this.hp : Math.max(this.hp - 1, 0);
    }

    /** @returns {void} */
    performMapDamage() {
        if (!$gameParty.inBattle()) {
            $gameScreen.startFlashForDamage();
        }
    }

    /** @returns {void} */
    clearActions() {
        super.clearActions();
        this._actionInputIndex = 0;
    }

    /** @returns {Game_Action} */
    inputtingAction() {
        return this.action(this._actionInputIndex);
    }

    /** @returns {boolean} */
    selectNextCommand() {
        if (this._actionInputIndex < this.numActions() - 1) {
            this._actionInputIndex++;
            return true;
        } else {
            return false;
        }
    }

    /** @returns {boolean} */
    selectPreviousCommand() {
        if (this._actionInputIndex > 0) {
            this._actionInputIndex--;
            return true;
        } else {
            return false;
        }
    }

    /** @returns {RMMZ.DataSkill} */
    lastSkill() {
        if ($gameParty.inBattle()) {
            return this.lastBattleSkill();
        } else {
            return this.lastMenuSkill();
        }
    }

    /** @returns {RMMZ.DataSkill} */
    lastMenuSkill() {
        return this._lastMenuSkill.object();
    }

    /**
     * @param {RMMZ.DataSkill | null} skill
     * @returns {void}
     */
    setLastMenuSkill(skill) {
        this._lastMenuSkill.setObject(skill);
    }

    /** @returns {RMMZ.DataSkill} */
    lastBattleSkill() {
        return this._lastBattleSkill.object();
    }

    /**
     * @param {RMMZ.DataSkill | null} skill
     * @returns {void}
     */
    setLastBattleSkill(skill) {
        this._lastBattleSkill.setObject(skill);
    }

    /** @returns {string} */
    lastCommandSymbol() {
        return this._lastCommandSymbol;
    }

    /**
     * @param {string} symbol
     * @returns {void}
     */
    setLastCommandSymbol(symbol) {
        this._lastCommandSymbol = symbol;
    }

    /**
     * @param {RMMZ.DataItem} item
     * @returns {boolean}
     */
    testEscape(item) {
        return item.effects.some(
            effect => effect && effect.code === Game_Action.EFFECT_SPECIAL
        );
    }

    /**
     * @param {RMMZ.DataItem} item
     * @returns {boolean}
     */
    meetsUsableItemConditions(item) {
        if ($gameParty.inBattle()) {
            if (!BattleManager.canEscape() && this.testEscape(item)) {
                return false;
            }
        }
        return super.meetsUsableItemConditions(item);
    }

    /** @returns {void} */
    onEscapeFailure() {
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
    /** @param {[enemyId: RMMZ.EnemyID, x: number, y: number]} args */
    constructor(...args) {
        super(...args);
    }

    /**
     * @param {RMMZ.EnemyID} enemyId
     * @param {number} x
     * @param {number} y
     */
    initialize(enemyId, x, y) {
        super.initialize();
        this.setup(enemyId, x, y);
    }

    /** @returns {void} */
    initMembers() {
        super.initMembers();
        /** @type {number} */
        this._enemyId = 0;
        /** @type {string} */
        this._letter = "";
        /** @type {boolean} */
        this._plural = false;
        /** @type {number} */
        this._screenX = 0;
        /** @type {number} */
        this._screenY = 0;
    }

    /**
     * @param {RMMZ.EnemyID} enemyId
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    setup(enemyId, x, y) {
        this._enemyId = enemyId;
        this._screenX = x;
        this._screenY = y;
        this.recoverAll();
    }

    /** @returns {this is Game_Enemy} */
    isEnemy() {
        return true;
    }

    /** @returns {import("./Game_Troop").Game_Troop} */
    friendsUnit() {
        return $gameTroop;
    }

    /** @returns {import("./Game_Party").Game_Party} */
    opponentsUnit() {
        return $gameParty;
    }

    /** @returns {number} */
    index() {
        return $gameTroop.members().indexOf(this);
    }

    /** @returns {boolean} */
    isBattleMember() {
        return this.index() >= 0;
    }

    /** @returns {number} */
    enemyId() {
        return this._enemyId;
    }

    /** @returns {import("../data").DataEnemy} */
    enemy() {
        return $dataEnemies[this._enemyId];
    }

    /** @returns {{ traits: import("../data").Trait[]; }[]} */
    traitObjects() {
        return super.traitObjects().concat(this.enemy());
    }

    /**
     * @param {RMMZ.ParamID} paramId
     * @returns {number}
     */
    paramBase(paramId) {
        return this.enemy().params[paramId];
    }

    /** @returns {number} */
    exp() {
        return this.enemy().exp;
    }

    /** @returns {number} */
    gold() {
        return this.enemy().gold;
    }

    /** @returns {RMMZ.DataItemBase[]} */
    makeDropItems() {
        const rate = this.dropItemRate();
        return this.enemy().dropItems.reduce((r, di) => {
            if (di.kind > 0 && Math.random() * di.denominator < rate) {
                return r.concat(this.itemObject(di.kind, di.dataId));
            } else {
                return r;
            }
        }, []);
    }

    /** @returns {1 | 2} */
    dropItemRate() {
        return $gameParty.hasDropItemDouble() ? 2 : 1;
    }

    /**
     * @param {RMMZ.DropItemType} kind
     * @param {RMMZ.DataID} dataId
     * @returns {import("../data").DataItem | import("../data").DataWeapon | import("../data").DataArmor | null}
     */
    itemObject(kind, dataId) {
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

    /** @returns {boolean} */
    isSpriteVisible() {
        return true;
    }

    /** @returns {number} */
    screenX() {
        return this._screenX;
    }

    /** @returns {number} */
    screenY() {
        return this._screenY;
    }

    /** @returns {string} */
    battlerName() {
        return this.enemy().battlerName;
    }

    /** @returns {number} */
    battlerHue() {
        return this.enemy().battlerHue;
    }

    /** @returns {string} */
    originalName() {
        return this.enemy().name;
    }

    /** @returns {string} */
    name() {
        return this.originalName() + (this._plural ? this._letter : "");
    }

    /** @returns {boolean} */
    isLetterEmpty() {
        return this._letter === "";
    }

    /**
     * @param {string} letter
     * @returns {void}
     */
    setLetter(letter) {
        this._letter = letter;
    }

    /**
     * @param {boolean} plural
     * @returns {void}
     */
    setPlural(plural) {
        this._plural = plural;
    }

    /**
     * @param {Game_Action} action
     * @returns {void}
     */
    performActionStart(action) {
        super.performActionStart(action);
        this.requestEffect("whiten");
    }

    /**
     * @param {Game_Action} action
     * @returns {void}
     */
    performAction(action) {
        super.performAction(action);
    }

    /** @returns {void} */
    performActionEnd() {
        super.performActionEnd();
    }

    /** @returns {void} */
    performDamage() {
        super.performDamage();
        SoundManager.playEnemyDamage();
        this.requestEffect("blink");
    }

    /** @returns {void} */
    performCollapse() {
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

    /**
     * @param {RMMZ.EnemyID} enemyId
     * @returns {void}
     */
    transform(enemyId) {
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

    /**
     * @param {RMMZ.EnemyAction} action
     * @returns {boolean}
     */
    meetsCondition(action) {
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

    /**
     * @param {number} param1
     * @param {number} param2
     * @returns {boolean}
     */
    meetsTurnCondition(param1, param2) {
        const n = this.turnCount();
        if (param2 === 0) {
            return n === param1;
        } else {
            return n > 0 && n >= param1 && n % param2 === param1 % param2;
        }
    }

    /**
     * @param {number} param1
     * @param {number} param2
     * @returns {boolean}
     */
    meetsHpCondition(param1, param2) {
        return this.hpRate() >= param1 && this.hpRate() <= param2;
    }

    /**
     * @param {number} param1
     * @param {number} param2
     * @returns {boolean}
     */
    meetsMpCondition(param1, param2) {
        return this.mpRate() >= param1 && this.mpRate() <= param2;
    }

    /**
     * @param {RMMZ.StateID} param
     * @returns {boolean}
     */
    meetsStateCondition(param) {
        return this.isStateAffected(param);
    }

    /**
     * @param {number} param
     * @returns {boolean}
     */
    meetsPartyLevelCondition(param) {
        return $gameParty.highestLevel() >= param;
    }

    /**
     * @param {RMMZ.SwitchID} param
     * @returns {boolean}
     */
    meetsSwitchCondition(param) {
        return $gameSwitches.value(param);
    }

    /**
     * @param {RMMZ.EnemyAction} action
     * @returns {boolean}
     */
    isActionValid(action) {
        return (
            this.meetsCondition(action) && this.canUse($dataSkills[action.skillId])
        );
    }

    /**
     * @param {RMMZ.EnemyAction[]} actionList
     * @param {number} ratingZero
     * @returns {RMMZ.EnemyAction | null | undefined}
     */
    selectAction(actionList, ratingZero) {
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

    /**
     * @param {RMMZ.EnemyAction[]} actionList
     * @returns {void}
     */
    selectAllActions(actionList) {
        const ratingMax = Math.max(...actionList.map(a => a.rating));
        const ratingZero = ratingMax - 3;
        actionList = actionList.filter(a => a.rating > ratingZero);
        for (let i = 0; i < this.numActions(); i++) {
            this.action(i).setEnemyAction(
                this.selectAction(actionList, ratingZero)
            );
        }
    }

    /** @returns {void} */
    makeActions() {
        super.makeActions();
        if (this.numActions() > 0) {
            const actionList = this.enemy().actions.filter(a =>
                this.isActionValid(a)
            );
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
    constructor(...args) {
        this.initialize(...args);
    }

    initialize() {
        /** @type {Game_Actor[]} */
        this._data = [];
    }

    /**
     * @param {RMMZ.ActorID} actorId
     * @returns {Game_Actor | null}
     */
    actor(actorId) {
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
class Game_Unit {
    constructor(...args) {
        this.initialize(...args);
    }

    initialize() {
        /** @type {boolean} */
        this._inBattle = false;
    }

    /** @returns {boolean} */
    inBattle() {
        return this._inBattle;
    }

    /** @returns {Game_Battler[]} */
    members() {
        return [];
    }

    /** @returns {Game_Battler[]} */
    aliveMembers() {
        return this.members().filter(member => member.isAlive());
    }

    /** @returns {Game_Battler[]} */
    deadMembers() {
        return this.members().filter(member => member.isDead());
    }

    /** @returns {Game_Battler[]} */
    movableMembers() {
        return this.members().filter(member => member.canMove());
    }

    /** @returns {void} */
    clearActions() {
        for (const member of this.members()) {
            member.clearActions();
        }
    }

    /** @returns {number} */
    agility() {
        const members = this.members();
        const sum = members.reduce((r, member) => r + member.agi, 0);
        return Math.max(1, sum / Math.max(1, members.length));
    }

    /** @returns {number} */
    tgrSum() {
        return this.aliveMembers().reduce((r, member) => r + member.tgr, 0);
    }

    /** @returns {Game_Battler | null} */
    randomTarget() {
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

    /** @returns {Game_Battler | null} */
    randomDeadTarget() {
        const members = this.deadMembers();
        return members.length ? members[Math.randomInt(members.length)] : null;
    }

    /**
     * @param {number} index
     * @returns {Game_Battler}
     */
    smoothTarget(index) {
        const member = this.members()[Math.max(0, index)];
        return member && member.isAlive() ? member : this.aliveMembers()[0];
    }

    /**
     * @param {number} index
     * @returns {Game_Battler}
     */
    smoothDeadTarget(index) {
        const member = this.members()[Math.max(0, index)];
        return member && member.isDead() ? member : this.deadMembers()[0];
    }

    /** @returns {void} */
    clearResults() {
        for (const member of this.members()) {
            member.clearResult();
        }
    }

    /**
     * @param {boolean} advantageous
     * @returns {void}
     */
    onBattleStart(advantageous) {
        for (const member of this.members()) {
            member.onBattleStart(advantageous);
        }
        this._inBattle = true;
    }

    /** @returns {void} */
    onBattleEnd() {
        this._inBattle = false;
        for (const member of this.members()) {
            member.onBattleEnd();
        }
    }

    /** @returns {void} */
    makeActions() {
        for (const member of this.members()) {
            member.makeActions();
        }
    }

    /**
     * @param {Game_Battler | null} activeMember
     * @returns {void}
     */
    select(activeMember) {
        for (const member of this.members()) {
            if (member === activeMember) {
                member.select();
            } else {
                member.deselect();
            }
        }
    }

    /** @returns {boolean} */
    isAllDead() {
        return this.aliveMembers().length === 0;
    }

    /**
     * @param {Game_Battler} target
     * @returns {Game_Battler | null}
     */
    substituteBattler(target) {
        for (const member of this.members()) {
            if (member.isSubstitute() && member !== target) {
                return member;
            }
        }
        return null;
    }

    /** @returns {number} */
    tpbBaseSpeed() {
        const members = this.members();
        return Math.max(...members.map(member => member.tpbBaseSpeed()));
    }

    /** @returns {60 | 240} */
    tpbReferenceTime() {
        return BattleManager.isActiveTpb() ? 240 : 60;
    }

    /** @returns {void} */
    updateTpb() {
        for (const member of this.members()) {
            member.updateTpb();
        }
    }
}

/**
 * The game object class for the party. Information such as gold and items is
 * included.
 */
class Game_Party extends Game_Unit {
    /** @param {[]} args */
    constructor(...args) {
        super(...args);
    }

    static ABILITY_ENCOUNTER_HALF = 0;

    static ABILITY_ENCOUNTER_NONE = 1;

    static ABILITY_CANCEL_SURPRISE = 2;

    static ABILITY_RAISE_PREEMPTIVE = 3;

    static ABILITY_GOLD_DOUBLE = 4;

    static ABILITY_DROP_ITEM_DOUBLE = 5;

    initialize() {
        super.initialize();
        /** @type {number} */
        this._gold = 0;
        /** @type {number} */
        this._steps = 0;
        /** @type {Game_Item} */
        this._lastItem = new Game_Item();
        /** @type {number} */
        this._menuActorId = 0;
        /** @type {number} */
        this._targetActorId = 0;
        /** @type {RMMZ.ActorID[]} */
        this._actors = [];
        this.initAllItems();
    }

    /** @returns {void} */
    initAllItems() {
        this._items = {};
        this._weapons = {};
        this._armors = {};
    }

    /** @returns {boolean} */
    exists() {
        return this._actors.length > 0;
    }

    /** @returns {number} */
    size() {
        return this.members().length;
    }

    /** @returns {boolean} */
    isEmpty() {
        return this.size() === 0;
    }

    /** @returns {Game_Actor[]} */
    members() {
        return this.inBattle() ? this.battleMembers() : this.allMembers();
    }

    /** @returns {Game_Actor[]} */
    allMembers() {
        return this._actors.map(id => $gameActors.actor(id));
    }

    /** @returns {Game_Actor[]} */
    battleMembers() {
        return this.allBattleMembers().filter(actor => actor.isAppeared());
    }

    /** @returns {Game_Actor[]} */
    hiddenBattleMembers() {
        return this.allBattleMembers().filter(actor => actor.isHidden());
    }

    /** @returns {Game_Actor[]} */
    allBattleMembers() {
        return this.allMembers().slice(0, this.maxBattleMembers());
    }

    /** @returns {number} */
    maxBattleMembers() {
        return 4;
    }

    /** @returns {Game_Actor} */
    leader() {
        return this.battleMembers()[0];
    }

    /** @returns {void} */
    removeInvalidMembers() {
        for (const actorId of this._actors) {
            if (!$dataActors[actorId]) {
                this._actors.remove(actorId);
            }
        }
    }

    /** @returns {void} */
    reviveBattleMembers() {
        for (const actor of this.battleMembers()) {
            if (actor.isDead()) {
                actor.setHp(1);
            }
        }
    }

    /** @returns {import("../data").DataItem[]} */
    items() {
        return Object.keys(this._items).map(id => $dataItems[id]);
    }

    /** @returns {import("../data").DataWeapon[]} */
    weapons() {
        return Object.keys(this._weapons).map(id => $dataWeapons[id]);
    }

    /** @returns {import("../data").DataArmor[]} */
    armors() {
        return Object.keys(this._armors).map(id => $dataArmors[id]);
    }

    /** @returns {RMMZ.DataEquipment[]} */
    equipItems() {
        return this.weapons().concat(this.armors());
    }

    /** @returns {RMMZ.DataItemBase[]} */
    allItems() {
        return this.items().concat(this.equipItems());
    }

    /**
     * @param {RMMZ.DataItemBase | null} item
     * @returns {Record<number, number> | null}
     */
    itemContainer(item) {
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

    /** @returns {void} */
    setupStartingMembers() {
        this._actors = [];
        for (const actorId of $dataSystem.partyMembers) {
            if ($gameActors.actor(actorId)) {
                this._actors.push(actorId);
            }
        }
    }

    /** @returns {string} */
    name() {
        const numBattleMembers = this.battleMembers().length;
        if (numBattleMembers === 0) {
            return "";
        } else if (numBattleMembers === 1) {
            return this.leader().name();
        } else {
            return TextManager.partyName.format(this.leader().name());
        }
    }

    /** @returns {void} */
    setupBattleTest() {
        this.setupBattleTestMembers();
        this.setupBattleTestItems();
    }

    /** @returns {void} */
    setupBattleTestMembers() {
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

    /** @returns {void} */
    setupBattleTestItems() {
        for (const item of $dataItems) {
            if (item && item.name.length > 0) {
                this.gainItem(item, this.maxItems(item));
            }
        }
    }

    /** @returns {number} */
    highestLevel() {
        return Math.max(...this.members().map(actor => actor.level));
    }

    /**
     * @param {RMMZ.ActorID} actorId
     * @returns {void}
     */
    addActor(actorId) {
        if (!this._actors.includes(actorId)) {
            this._actors.push(actorId);
            $gamePlayer.refresh();
            $gameMap.requestRefresh();
            $gameTemp.requestBattleRefresh();
            if (this.inBattle()) {
                const actor = $gameActors.actor(actorId);
                if (this.battleMembers().includes(actor)) {
                    actor.onBattleStart();
                }
            }
        }
    }

    /**
     * @param {RMMZ.ActorID} actorId
     * @returns {void}
     */
    removeActor(actorId) {
        if (this._actors.includes(actorId)) {
            const actor = $gameActors.actor(actorId);
            const wasBattleMember = this.battleMembers().includes(actor);
            this._actors.remove(actorId);
            $gamePlayer.refresh();
            $gameMap.requestRefresh();
            $gameTemp.requestBattleRefresh();
            if (this.inBattle() && wasBattleMember) {
                actor.onBattleEnd();
            }
        }
    }

    /** @returns {number} */
    gold() {
        return this._gold;
    }

    /**
     * @param {number} amount
     * @returns {void}
     */
    gainGold(amount) {
        this._gold = (this._gold + amount).clamp(0, this.maxGold());
    }

    /**
     * @param {number} amount
     * @returns {void}
     */
    loseGold(amount) {
        this.gainGold(-amount);
    }

    /** @returns {number} */
    maxGold() {
        return 99999999;
    }

    /** @returns {number} */
    steps() {
        return this._steps;
    }

    /** @returns {void} */
    increaseSteps() {
        this._steps++;
    }

    /**
     * @param {RMMZ.DataItemBase | null} item
     * @returns {number}
     */
    numItems(item) {
        const container = this.itemContainer(item);
        return container ? container[item.id] || 0 : 0;
    }

    /**
     * @param {RMMZ.DataItem | RMMZ.DataWeapon | RMMZ.DataArmor | null} item
     * @returns {number}
     */
    maxItems(/*item*/) {
        return 99;
    }

    /**
     * @param {RMMZ.DataItemBase} item
     * @returns {boolean}
     */
    hasMaxItems(item) {
        return this.numItems(item) >= this.maxItems(item);
    }

    /**
     * @param {RMMZ.DataItemBase} item
     * @param {boolean} [includeEquip]
     * @returns {boolean}
     */
    hasItem(item, includeEquip) {
        if (this.numItems(item) > 0) {
            return true;
        } else if (includeEquip && this.isAnyMemberEquipped(item)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @param {RMMZ.DataEquipment} item
     * @returns {boolean}
     */
    isAnyMemberEquipped(item) {
        return this.members().some(actor => actor.equips().includes(item));
    }

    /**
     * @param {RMMZ.DataItemBase | null} item
     * @param {number} amount
     * @param {boolean} [includeEquip]
     * @returns {void}
     */
    gainItem(item, amount, includeEquip) {
        const container = this.itemContainer(item);
        if (container) {
            const lastNumber = this.numItems(item);
            const newNumber = lastNumber + amount;
            container[item.id] = newNumber.clamp(0, this.maxItems(item));
            if (container[item.id] === 0) {
                delete container[item.id];
            }
            if (includeEquip && newNumber < 0) {
                this.discardMembersEquip(item, -newNumber);
            }
            $gameMap.requestRefresh();
        }
    }

    /**
     * @param {RMMZ.DataEquipment} item
     * @param {number} amount
     * @returns {void}
     */
    discardMembersEquip(item, amount) {
        let n = amount;
        for (const actor of this.members()) {
            while (n > 0 && actor.isEquipped(item)) {
                actor.discardEquip(item);
                n--;
            }
        }
    }

    /**
     * @param {RMMZ.DataItemBase | null} item
     * @param {number} amount
     * @param {boolean} [includeEquip]
     * @returns {void}
     */
    loseItem(item, amount, includeEquip) {
        this.gainItem(item, -amount, includeEquip);
    }

    /**
     * @param {RMMZ.DataItemBase} item
     * @returns {void}
     */
    consumeItem(item) {
        if (DataManager.isItem(item) && item.consumable) {
            this.loseItem(item, 1);
        }
    }

    /**
     * @param {RMMZ.DataItemBase | null} item
     * @returns {boolean}
     */
    canUse(item) {
        return this.members().some(actor => actor.canUse(item));
    }

    /** @returns {boolean} */
    canInput() {
        return this.members().some(actor => actor.canInput());
    }

    /** @returns {boolean} */
    isAllDead() {
        if (super.isAllDead()) {
            return this.inBattle() || !this.isEmpty();
        } else {
            return false;
        }
    }

    /** @returns {boolean} */
    isEscaped() {
        return this.isAllDead() && this.hiddenBattleMembers().length > 0;
    }

    /** @returns {void} */
    onPlayerWalk() {
        for (const actor of this.members()) {
            actor.onPlayerWalk();
        }
    }

    /** @returns {Game_Actor} */
    menuActor() {
        let actor = $gameActors.actor(this._menuActorId);
        if (!this.members().includes(actor)) {
            actor = this.members()[0];
        }
        return actor;
    }

    /**
     * @param {Game_Actor} actor
     * @returns {void}
     */
    setMenuActor(actor) {
        this._menuActorId = actor.actorId();
    }

    /** @returns {void} */
    makeMenuActorNext() {
        let index = this.members().indexOf(this.menuActor());
        if (index >= 0) {
            index = (index + 1) % this.members().length;
            this.setMenuActor(this.members()[index]);
        } else {
            this.setMenuActor(this.members()[0]);
        }
    }

    /** @returns {void} */
    makeMenuActorPrevious() {
        let index = this.members().indexOf(this.menuActor());
        if (index >= 0) {
            index = (index + this.members().length - 1) % this.members().length;
            this.setMenuActor(this.members()[index]);
        } else {
            this.setMenuActor(this.members()[0]);
        }
    }

    /** @returns {Game_Actor} */
    targetActor() {
        let actor = $gameActors.actor(this._targetActorId);
        if (!this.members().includes(actor)) {
            actor = this.members()[0];
        }
        return actor;
    }

    /**
     * @param {Game_Actor} actor
     * @returns {void}
     */
    setTargetActor(actor) {
        this._targetActorId = actor.actorId();
    }

    /** @returns {RMMZ.DataItemBase} */
    lastItem() {
        return this._lastItem.object();
    }

    /**
     * @param {RMMZ.DataItemBase | null} item
     * @returns {void}
     */
    setLastItem(item) {
        this._lastItem.setObject(item);
    }

    /**
     * @param {RMMZ.ActorID} index1
     * @param {RMMZ.ActorID} index2
     * @returns {void}
     */
    swapOrder(index1, index2) {
        const temp = this._actors[index1];
        this._actors[index1] = this._actors[index2];
        this._actors[index2] = temp;
        $gamePlayer.refresh();
    }

    /** @returns {[ string, number ][]} */
    charactersForSavefile() {
        return this.battleMembers().map(actor => [
            actor.characterName(),
            actor.characterIndex()
        ]);
    }

    /** @returns {[ string, number ][]} */
    facesForSavefile() {
        return this.battleMembers().map(actor => [
            actor.faceName(),
            actor.faceIndex()
        ]);
    }

    /**
     * @param {RMMZ.DataID} abilityId
     * @returns {boolean}
     */
    partyAbility(abilityId) {
        return this.battleMembers().some(actor => actor.partyAbility(abilityId));
    }

    /** @returns {boolean} */
    hasEncounterHalf() {
        return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_HALF);
    }

    /** @returns {boolean} */
    hasEncounterNone() {
        return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_NONE);
    }

    /** @returns {boolean} */
    hasCancelSurprise() {
        return this.partyAbility(Game_Party.ABILITY_CANCEL_SURPRISE);
    }

    /** @returns {boolean} */
    hasRaisePreemptive() {
        return this.partyAbility(Game_Party.ABILITY_RAISE_PREEMPTIVE);
    }

    /** @returns {boolean} */
    hasGoldDouble() {
        return this.partyAbility(Game_Party.ABILITY_GOLD_DOUBLE);
    }

    /** @returns {boolean} */
    hasDropItemDouble() {
        return this.partyAbility(Game_Party.ABILITY_DROP_ITEM_DOUBLE);
    }

    /**
     * @param {number} troopAgi
     * @returns {number}
     */
    ratePreemptive(troopAgi) {
        let rate = this.agility() >= troopAgi ? 0.05 : 0.03;
        if (this.hasRaisePreemptive()) {
            rate *= 4;
        }
        return rate;
    }

    /**
     * @param {number} troopAgi
     * @returns {number}
     */
    rateSurprise(troopAgi) {
        let rate = this.agility() >= troopAgi ? 0.03 : 0.05;
        if (this.hasCancelSurprise()) {
            rate = 0;
        }
        return rate;
    }

    /** @returns {void} */
    performVictory() {
        for (const actor of this.members()) {
            actor.performVictory();
        }
    }

    /** @returns {void} */
    performEscape() {
        for (const actor of this.members()) {
            actor.performEscape();
        }
    }

    /** @returns {void} */
    removeBattleStates() {
        for (const actor of this.members()) {
            actor.removeBattleStates();
        }
    }

    /** @returns {void} */
    requestMotionRefresh() {
        for (const actor of this.members()) {
            actor.requestMotionRefresh();
        }
    }

    /** @returns {void} */
    onEscapeFailure() {
        for (const actor of this.members()) {
            actor.onEscapeFailure();
        }
    }
}

/**
 * The game object class for a troop and the battle-related data.
 */
class Game_Troop extends Game_Unit {
    /** @param {[]} args */
    constructor(...args) {
        super(...args);
    }

    // prettier-ignore
    /** @type {string[]} */
    static LETTER_TABLE_HALF = [
        " A"," B"," C"," D"," E"," F"," G"," H"," I"," J"," K"," L"," M",
        " N"," O"," P"," Q"," R"," S"," T"," U"," V"," W"," X"," Y"," Z"
    ];

    // prettier-ignore
    /** @type {string[]} */
    static LETTER_TABLE_FULL = [
        "Ａ","Ｂ","Ｃ","Ｄ","Ｅ","Ｆ","Ｇ","Ｈ","Ｉ","Ｊ","Ｋ","Ｌ","Ｍ",
        "Ｎ","Ｏ","Ｐ","Ｑ","Ｒ","Ｓ","Ｔ","Ｕ","Ｖ","Ｗ","Ｘ","Ｙ","Ｚ"
    ];

    initialize() {
        super.initialize();
        /** @type {Game_Interpreter} */
        this._interpreter = new Game_Interpreter();
        this.clear();
    }

    /** @returns {boolean} */
    isEventRunning() {
        return this._interpreter.isRunning();
    }

    /** @returns {void} */
    updateInterpreter() {
        this._interpreter.update();
    }

    /** @returns {number} */
    turnCount() {
        return this._turnCount;
    }

    /** @returns {Game_Enemy[]} */
    members() {
        return this._enemies;
    }

    /** @returns {void} */
    clear() {
        this._interpreter.clear();
        this._troopId = 0;
        this._eventFlags = {};
        this._enemies = [];
        this._turnCount = 0;
        this._namesCount = {};
    }

    /** @returns {import("../data").DataTroop} */
    troop() {
        return $dataTroops[this._troopId];
    }

    /**
     * @param {RMMZ.TroopID} troopId
     * @returns {void}
     */
    setup(troopId) {
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

    /** @returns {void} */
    makeUniqueNames() {
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

    /** @returns {void} */
    updatePluralFlags() {
        for (const enemy of this.members()) {
            const name = enemy.originalName();
            if (this._namesCount[name] >= 2) {
                enemy.setPlural(true);
            }
        }
    }

    /** @returns {string[]} */
    letterTable() {
        return $gameSystem.isCJK()
            ? Game_Troop.LETTER_TABLE_FULL
            : Game_Troop.LETTER_TABLE_HALF;
    }

    /** @returns {string[]} */
    enemyNames() {
        const names = [];
        for (const enemy of this.members()) {
            const name = enemy.originalName();
            if (enemy.isAlive() && !names.includes(name)) {
                names.push(name);
            }
        }
        return names;
    }

    /**
     * @param {RMMZ.DataTroopPage} page
     * @returns {boolean}
     */
    meetsConditions(page) {
        const c = page.conditions;
        if (
            !c.turnEnding &&
            !c.turnValid &&
            !c.enemyValid &&
            !c.actorValid &&
            !c.switchValid
        ) {
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

    /** @returns {void} */
    setupBattleEvent() {
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

    /** @returns {void} */
    increaseTurn() {
        const pages = this.troop().pages;
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            if (page.span === 1) {
                this._eventFlags[i] = false;
            }
        }
        this._turnCount++;
    }

    /** @returns {number} */
    expTotal() {
        return this.deadMembers().reduce((r, enemy) => r + enemy.exp(), 0);
    }

    /** @returns {number} */
    goldTotal() {
        const members = this.deadMembers();
        return members.reduce((r, enemy) => r + enemy.gold(), 0) * this.goldRate();
    }

    /** @returns {1 | 2} */
    goldRate() {
        return $gameParty.hasGoldDouble() ? 2 : 1;
    }

    /** @returns {RMMZ.DataItemBase[]} */
    makeDropItems() {
        const members = this.deadMembers();
        return members.reduce((r, enemy) => r.concat(enemy.makeDropItems()), []);
    }

    /** @returns {boolean} */
    isTpbTurnEnd() {
        const members = this.members();
        const turnMax = Math.max(...members.map(member => member.turnCount()));
        return turnMax > this._turnCount;
    }
}

/**
 * The game object class for a map. It contains scrolling and passage
 * determination functions.
 */
class Game_Map {
    /** @param {[]} args */
    constructor(...args) {
        this.initialize(...args);
    }

    initialize() {
        /** @type {Game_Interpreter} */
        this._interpreter = new Game_Interpreter();
        /** @type {number} */
        this._mapId = 0;
        /** @type {number} */
        this._tilesetId = 0;
        /** @type {Game_Event[]} */
        this._events = [];
        /** @type {Game_CommonEvent[]} */
        this._commonEvents = [];
        /** @type {Game_Vehicle[]} */
        this._vehicles = [];
        /** @type {number} */
        this._displayX = 0;
        /** @type {number} */
        this._displayY = 0;
        /** @type {boolean} */
        this._nameDisplay = true;
        /** @type {RMMZ.Direction} */
        this._scrollDirection = 2;
        /** @type {number} */
        this._scrollRest = 0;
        /** @type {number} */
        this._scrollSpeed = 4;
        /** @type {string} */
        this._parallaxName = "";
        /** @type {boolean} */
        this._parallaxZero = false;
        /** @type {boolean} */
        this._parallaxLoopX = false;
        /** @type {boolean} */
        this._parallaxLoopY = false;
        /** @type {number} */
        this._parallaxSx = 0;
        /** @type {number} */
        this._parallaxSy = 0;
        /** @type {number} */
        this._parallaxX = 0;
        /** @type {number} */
        this._parallaxY = 0;
        /** @type {string | null} */
        this._battleback1Name = null;
        /** @type {string | null} */
        this._battleback2Name = null;
        this.createVehicles();
    }

    /**
     * @param {RMMZ.MapID} mapId
     * @returns {void}
     */
    setup(mapId) {
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

    /** @returns {boolean} */
    isEventRunning() {
        return this._interpreter.isRunning() || this.isAnyEventStarting();
    }

    /** @returns {number} */
    tileWidth() {
        if ("tileSize" in $dataSystem) {
            return $dataSystem.tileSize;
        } else {
            return 48;
        }
    }

    /** @returns {number} */
    tileHeight() {
        return this.tileWidth();
    }

    /** @returns {number} */
    bushDepth() {
        return this.tileHeight() / 4;
    }

    /** @returns {number} */
    mapId() {
        return this._mapId;
    }

    /** @returns {number} */
    tilesetId() {
        return this._tilesetId;
    }

    /** @returns {number} */
    displayX() {
        return this._displayX;
    }

    /** @returns {number} */
    displayY() {
        return this._displayY;
    }

    /** @returns {string} */
    parallaxName() {
        return this._parallaxName;
    }

    /** @returns {string | null} */
    battleback1Name() {
        return this._battleback1Name;
    }

    /** @returns {string | null} */
    battleback2Name() {
        return this._battleback2Name;
    }

    /** @returns {void} */
    requestRefresh() {
        this._needsRefresh = true;
    }

    /** @returns {boolean} */
    isNameDisplayEnabled() {
        return this._nameDisplay;
    }

    /** @returns {void} */
    disableNameDisplay() {
        this._nameDisplay = false;
    }

    /** @returns {void} */
    enableNameDisplay() {
        this._nameDisplay = true;
    }

    /** @returns {void} */
    createVehicles() {
        this._vehicles = [];
        this._vehicles[0] = new Game_Vehicle("boat");
        this._vehicles[1] = new Game_Vehicle("ship");
        this._vehicles[2] = new Game_Vehicle("airship");
    }

    /** @returns {void} */
    refereshVehicles() {
        for (const vehicle of this._vehicles) {
            vehicle.refresh();
        }
    }

    /** @returns {Game_Vehicle[]} */
    vehicles() {
        return this._vehicles;
    }

    /**
     * @param {number | RMMZ.VehicleType} type
     * @returns {Game_Vehicle | null}
     */
    vehicle(type) {
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

    /** @returns {Game_Vehicle} */
    boat() {
        return this._vehicles[0];
    }

    /** @returns {Game_Vehicle} */
    ship() {
        return this._vehicles[1];
    }

    /** @returns {Game_Vehicle} */
    airship() {
        return this._vehicles[2];
    }

    /** @returns {void} */
    setupEvents() {
        this._events = [];
        this._commonEvents = [];
        for (const event of $dataMap.events.filter(event => !!event)) {
            this._events[event.id] = new Game_Event(this._mapId, event.id);
        }
        for (const commonEvent of this.parallelCommonEvents()) {
            this._commonEvents.push(new Game_CommonEvent(commonEvent.id));
        }
        this.refreshTileEvents();
    }

    /** @returns {Game_Event[]} */
    events() {
        return this._events.filter(event => !!event);
    }

    /**
     * @param {RMMZ.EventID} eventId
     * @returns {Game_Event}
     */
    event(eventId) {
        return this._events[eventId];
    }

    /**
     * @param {RMMZ.EventID} eventId
     * @returns {void}
     */
    eraseEvent(eventId) {
        this._events[eventId].erase();
    }

    /** @returns {import("../data").DataCommonEvent[]} */
    autorunCommonEvents() {
        return $dataCommonEvents.filter(
            commonEvent => commonEvent && commonEvent.trigger === 1
        );
    }

    /** @returns {import("../data").DataCommonEvent[]} */
    parallelCommonEvents() {
        return $dataCommonEvents.filter(
            commonEvent => commonEvent && commonEvent.trigger === 2
        );
    }

    /** @returns {void} */
    setupScroll() {
        this._scrollDirection = 2;
        this._scrollRest = 0;
        this._scrollSpeed = 4;
    }

    /** @returns {void} */
    setupParallax() {
        this._parallaxName = $dataMap.parallaxName || "";
        this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
        this._parallaxLoopX = $dataMap.parallaxLoopX;
        this._parallaxLoopY = $dataMap.parallaxLoopY;
        this._parallaxSx = $dataMap.parallaxSx;
        this._parallaxSy = $dataMap.parallaxSy;
        this._parallaxX = 0;
        this._parallaxY = 0;
    }

    /** @returns {void} */
    setupBattleback() {
        if ($dataMap.specifyBattleback) {
            this._battleback1Name = $dataMap.battleback1Name;
            this._battleback2Name = $dataMap.battleback2Name;
        } else {
            this._battleback1Name = null;
            this._battleback2Name = null;
        }
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    setDisplayPos(x, y) {
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

    /** @returns {number} */
    parallaxOx() {
        if (this._parallaxZero) {
            return this._parallaxX * this.tileWidth();
        } else if (this._parallaxLoopX) {
            return (this._parallaxX * this.tileWidth()) / 2;
        } else {
            return 0;
        }
    }

    /** @returns {number} */
    parallaxOy() {
        if (this._parallaxZero) {
            return this._parallaxY * this.tileHeight();
        } else if (this._parallaxLoopY) {
            return (this._parallaxY * this.tileHeight()) / 2;
        } else {
            return 0;
        }
    }

    /** @returns {import("../data").DataTileset} */
    tileset() {
        return $dataTilesets[this._tilesetId];
    }

    /** @returns {number[]} */
    tilesetFlags() {
        const tileset = this.tileset();
        if (tileset) {
            return tileset.flags;
        } else {
            return [];
        }
    }

    /** @returns {string} */
    displayName() {
        return $dataMap.displayName;
    }

    /** @returns {number} */
    width() {
        return $dataMap.width;
    }

    /** @returns {number} */
    height() {
        return $dataMap.height;
    }

    /** @returns {number[]} */
    data() {
        return $dataMap.data;
    }

    /** @returns {boolean} */
    isLoopHorizontal() {
        return $dataMap.scrollType === 2 || $dataMap.scrollType === 3;
    }

    /** @returns {boolean} */
    isLoopVertical() {
        return $dataMap.scrollType === 1 || $dataMap.scrollType === 3;
    }

    /** @returns {boolean} */
    isDashDisabled() {
        return $dataMap.disableDashing;
    }

    /** @returns {import("../data").DataEncounter[]} */
    encounterList() {
        return $dataMap.encounterList;
    }

    /** @returns {number} */
    encounterStep() {
        return $dataMap.encounterStep;
    }

    /** @returns {boolean} */
    isOverworld() {
        return this.tileset() && this.tileset().mode === 0;
    }

    /** @returns {number} */
    screenTileX() {
        return Math.round((Graphics.width / this.tileWidth()) * 16) / 16;
    }

    /** @returns {number} */
    screenTileY() {
        return Math.round((Graphics.height / this.tileHeight()) * 16) / 16;
    }

    /**
     * @param {number} x
     * @returns {number}
     */
    adjustX(x) {
        if (
            this.isLoopHorizontal() &&
            x < this._displayX - (this.width() - this.screenTileX()) / 2
        ) {
            return x - this._displayX + $dataMap.width;
        } else {
            return x - this._displayX;
        }
    }

    /**
     * @param {number} y
     * @returns {number}
     */
    adjustY(y) {
        if (
            this.isLoopVertical() &&
            y < this._displayY - (this.height() - this.screenTileY()) / 2
        ) {
            return y - this._displayY + $dataMap.height;
        } else {
            return y - this._displayY;
        }
    }

    /**
     * @param {number} x
     * @returns {number}
     */
    roundX(x) {
        return this.isLoopHorizontal() ? x.mod(this.width()) : x;
    }

    /**
     * @param {number} y
     * @returns {number}
     */
    roundY(y) {
        return this.isLoopVertical() ? y.mod(this.height()) : y;
    }

    /**
     * @param {number} x
     * @param {RMMZ.Direction} d
     * @returns {number}
     */
    xWithDirection(x, d) {
        return x + (d === 6 ? 1 : d === 4 ? -1 : 0);
    }

    /**
     * @param {number} y
     * @param {RMMZ.Direction} d
     * @returns {number}
     */
    yWithDirection(y, d) {
        return y + (d === 2 ? 1 : d === 8 ? -1 : 0);
    }

    /**
     * @param {number} x
     * @param {RMMZ.Direction} d
     * @returns {number}
     */
    roundXWithDirection(x, d) {
        return this.roundX(x + (d === 6 ? 1 : d === 4 ? -1 : 0));
    }

    /**
     * @param {number} y
     * @param {RMMZ.Direction} d
     * @returns {number}
     */
    roundYWithDirection(y, d) {
        return this.roundY(y + (d === 2 ? 1 : d === 8 ? -1 : 0));
    }

    /**
     * @param {number} x1
     * @param {number} x2
     * @returns {number}
     */
    deltaX(x1, x2) {
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

    /**
     * @param {number} y1
     * @param {number} y2
     * @returns {number}
     */
    deltaY(y1, y2) {
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

    /**
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @returns {number}
     */
    distance(x1, y1, x2, y2) {
        return Math.abs(this.deltaX(x1, x2)) + Math.abs(this.deltaY(y1, y2));
    }

    /**
     * @param {number} x
     * @returns {number}
     */
    canvasToMapX(x) {
        const tileWidth = this.tileWidth();
        const originX = this._displayX * tileWidth;
        const mapX = Math.floor((originX + x) / tileWidth);
        return this.roundX(mapX);
    }

    /**
     * @param {number} y
     * @returns {number}
     */
    canvasToMapY(y) {
        const tileHeight = this.tileHeight();
        const originY = this._displayY * tileHeight;
        const mapY = Math.floor((originY + y) / tileHeight);
        return this.roundY(mapY);
    }

    /** @returns {void} */
    autoplay() {
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

    /** @returns {void} */
    refreshIfNeeded() {
        if (this._needsRefresh) {
            this.refresh();
        }
    }

    /** @returns {void} */
    refresh() {
        for (const event of this.events()) {
            event.refresh();
        }
        for (const commonEvent of this._commonEvents) {
            commonEvent.refresh();
        }
        this.refreshTileEvents();
        this._needsRefresh = false;
    }

    /** @returns {void} */
    refreshTileEvents() {
        this._tileEvents = this.events().filter(event => event.isTile());
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {Game_Event[]}
     */
    eventsXy(x, y) {
        return this.events().filter(event => event.pos(x, y));
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {Game_Event[]}
     */
    eventsXyNt(x, y) {
        return this.events().filter(event => event.posNt(x, y));
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {Game_Event[]}
     */
    tileEventsXy(x, y) {
        return this._tileEvents.filter(event => event.posNt(x, y));
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    eventIdXy(x, y) {
        const list = this.eventsXy(x, y);
        return list.length === 0 ? 0 : list[0].eventId();
    }

    /**
     * @param {number} distance
     * @returns {void}
     */
    scrollDown(distance) {
        if (this.isLoopVertical()) {
            this._displayY += distance;
            this._displayY %= $dataMap.height;
            if (this._parallaxLoopY) {
                this._parallaxY += distance;
            }
        } else if (this.height() >= this.screenTileY()) {
            const lastY = this._displayY;
            this._displayY = Math.min(
                this._displayY + distance,
                this.height() - this.screenTileY()
            );
            this._parallaxY += this._displayY - lastY;
        }
    }

    /**
     * @param {number} distance
     * @returns {void}
     */
    scrollLeft(distance) {
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

    /**
     * @param {number} distance
     * @returns {void}
     */
    scrollRight(distance) {
        if (this.isLoopHorizontal()) {
            this._displayX += distance;
            this._displayX %= $dataMap.width;
            if (this._parallaxLoopX) {
                this._parallaxX += distance;
            }
        } else if (this.width() >= this.screenTileX()) {
            const lastX = this._displayX;
            this._displayX = Math.min(
                this._displayX + distance,
                this.width() - this.screenTileX()
            );
            this._parallaxX += this._displayX - lastX;
        }
    }

    /**
     * @param {number} distance
     * @returns {void}
     */
    scrollUp(distance) {
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

    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isValid(x, y) {
        return x >= 0 && x < this.width() && y >= 0 && y < this.height();
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} bit
     * @returns {boolean}
     */
    checkPassage(x, y, bit) {
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

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {number}
     */
    tileId(x, y, z) {
        const width = $dataMap.width;
        const height = $dataMap.height;
        return $dataMap.data[(z * height + y) * width + x] || 0;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {number[]}
     */
    layeredTiles(x, y) {
        const tiles = [];
        for (let i = 0; i < 4; i++) {
            tiles.push(this.tileId(x, y, 3 - i));
        }
        return tiles;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {number[]}
     */
    allTiles(x, y) {
        const tiles = this.tileEventsXy(x, y).map(event => event.tileId());
        return tiles.concat(this.layeredTiles(x, y));
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {number}
     */
    autotileType(x, y, z) {
        const tileId = this.tileId(x, y, z);
        return tileId >= 2048 ? Math.floor((tileId - 2048) / 48) : -1;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {RMMZ.Direction} d
     * @returns {boolean}
     */
    isPassable(x, y, d) {
        return this.checkPassage(x, y, (1 << (d / 2 - 1)) & 0x0f);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isBoatPassable(x, y) {
        return this.checkPassage(x, y, 0x0200);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isShipPassable(x, y) {
        return this.checkPassage(x, y, 0x0400);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isAirshipLandOk(x, y) {
        return this.checkPassage(x, y, 0x0800) && this.checkPassage(x, y, 0x0f);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} bit
     * @returns {boolean}
     */
    checkLayeredTilesFlags(x, y, bit) {
        const flags = this.tilesetFlags();
        return this.layeredTiles(x, y).some(tileId => (flags[tileId] & bit) !== 0);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isLadder(x, y) {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x20);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isBush(x, y) {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x40);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isCounter(x, y) {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x80);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isDamageFloor(x, y) {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x100);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    terrainTag(x, y) {
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

    /**
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    regionId(x, y) {
        return this.isValid(x, y) ? this.tileId(x, y, 5) : 0;
    }

    /**
     * @param {RMMZ.Direction} direction
     * @param {number} distance
     * @param {number} speed
     * @returns {void}
     */
    startScroll(direction, distance, speed) {
        this._scrollDirection = direction;
        this._scrollRest = distance;
        this._scrollSpeed = speed;
    }

    /** @returns {boolean} */
    isScrolling() {
        return this._scrollRest > 0;
    }

    /**
     * @param {boolean} sceneActive
     * @returns {void}
     */
    update(sceneActive) {
        this.refreshIfNeeded();
        if (sceneActive) {
            this.updateInterpreter();
        }
        this.updateScroll();
        this.updateEvents();
        this.updateVehicles();
        this.updateParallax();
    }

    /** @returns {void} */
    updateScroll() {
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

    /** @returns {number} */
    scrollDistance() {
        return Math.pow(2, this._scrollSpeed) / 256;
    }

    /**
     * @param {RMMZ.Direction} direction
     * @param {number} distance
     * @returns {void}
     */
    doScroll(direction, distance) {
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

    /** @returns {void} */
    updateEvents() {
        for (const event of this.events()) {
            event.update();
        }
        for (const commonEvent of this._commonEvents) {
            commonEvent.update();
        }
    }

    /** @returns {void} */
    updateVehicles() {
        for (const vehicle of this._vehicles) {
            vehicle.update();
        }
    }

    /** @returns {void} */
    updateParallax() {
        if (this._parallaxLoopX) {
            this._parallaxX += this._parallaxSx / this.tileWidth() / 2;
        }
        if (this._parallaxLoopY) {
            this._parallaxY += this._parallaxSy / this.tileHeight() / 2;
        }
    }

    /**
     * @param {number} tilesetId
     * @returns {void}
     */
    changeTileset(tilesetId) {
        this._tilesetId = tilesetId;
        this.refresh();
    }

    /**
     * @param {string | null} battleback1Name
     * @param {string | null} battleback2Name
     * @returns {void}
     */
    changeBattleback(
        battleback1Name,
        battleback2Name
    ) {
        this._battleback1Name = battleback1Name;
        this._battleback2Name = battleback2Name;
    }

    /**
     * @param {string} name
     * @param {boolean} loopX
     * @param {boolean} loopY
     * @param {number} sx
     * @param {number} sy
     * @returns {void}
     */
    changeParallax(name, loopX, loopY, sx, sy) {
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

    /** @returns {void} */
    updateInterpreter() {
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

    /**
     * @param {RMMZ.EventID} eventId
     * @returns {void}
     */
    unlockEvent(eventId) {
        if (this._events[eventId]) {
            this._events[eventId].unlock();
        }
    }

    /** @returns {boolean} */
    setupStartingEvent() {
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

    /** @returns {boolean} */
    setupTestEvent() {
        if (window.$testEvent) {
            this._interpreter.setup($testEvent, 0);
            $testEvent = null;
            return true;
        }
        return false;
    }

    /** @returns {boolean} */
    setupStartingMapEvent() {
        for (const event of this.events()) {
            if (event.isStarting()) {
                event.clearStartingFlag();
                this._interpreter.setup(event.list(), event.eventId());
                return true;
            }
        }
        return false;
    }

    /** @returns {boolean} */
    setupAutorunCommonEvent() {
        for (const commonEvent of this.autorunCommonEvents()) {
            if ($gameSwitches.value(commonEvent.switchId)) {
                this._interpreter.setup(commonEvent.list);
                return true;
            }
        }
        return false;
    }

    /** @returns {boolean} */
    isAnyEventStarting() {
        return this.events().some(event => event.isStarting());
    }
}

/**
 * The game object class for a common event. It contains functionality for
 * running parallel process events.
 */
class Game_CommonEvent {
    /** @param {[commonEventId: RMMZ.CommonEventID]} args */
    constructor(...args) {
        this.initialize(...args);
    }

    /** @param {RMMZ.CommonEventID} commonEventId */
    initialize(commonEventId) {
        /** @type {number} */
        this._commonEventId = commonEventId;
        this.refresh();
    }

    /** @returns {import("../data").DataCommonEvent} */
    event() {
        return $dataCommonEvents[this._commonEventId];
    }

    /** @returns {import("../data").DataCommand[]} */
    list() {
        return this.event().list;
    }

    /** @returns {void} */
    refresh() {
        if (this.isActive()) {
            if (!this._interpreter) {
                this._interpreter = new Game_Interpreter();
            }
        } else {
            this._interpreter = null;
        }
    }

    /** @returns {boolean} */
    isActive() {
        const event = this.event();
        return event.trigger === 2 && $gameSwitches.value(event.switchId);
    }

    /** @returns {void} */
    update() {
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
    /** @param {[]} args */
    constructor(...args) {
        this.initialize(...args);
    }

    /** @type {number} */
    get x() {
            return this._x;
        }

    /** @type {number} */
    get y() {
            return this._y;
        }

    initialize() {
        this.initMembers();
    }

    /** @returns {void} */
    initMembers() {
        /** @type {number} */
        this._x = 0;
        /** @type {number} */
        this._y = 0;
        /** @type {number} */
        this._realX = 0;
        /** @type {number} */
        this._realY = 0;
        /** @type {number} */
        this._moveSpeed = 4;
        /** @type {number} */
        this._moveFrequency = 6;
        /** @type {number} */
        this._opacity = 255;
        /** @type {import("pixi.js").BLEND_MODES} */
        this._blendMode = 0;
        /** @type {RMMZ.Direction} */
        this._direction = 2;
        /** @type {number} */
        this._pattern = 1;
        /** @type {RMMZ.PriorityType} */
        this._priorityType = 1;
        /** @type {number} */
        this._tileId = 0;
        /** @type {string} */
        this._characterName = "";
        /** @type {number} */
        this._characterIndex = 0;
        /** @type {boolean} */
        this._isObjectCharacter = false;
        /** @type {boolean} */
        this._walkAnime = true;
        /** @type {boolean} */
        this._stepAnime = false;
        /** @type {boolean} */
        this._directionFix = false;
        /** @type {boolean} */
        this._through = false;
        /** @type {boolean} */
        this._transparent = false;
        /** @type {number} */
        this._bushDepth = 0;
        /** @type {number} */
        this._animationId = 0;
        /** @type {number} */
        this._balloonId = 0;
        /** @type {boolean} */
        this._animationPlaying = false;
        /** @type {boolean} */
        this._balloonPlaying = false;
        /** @type {number} */
        this._animationCount = 0;
        /** @type {number} */
        this._stopCount = 0;
        /** @type {number} */
        this._jumpCount = 0;
        /** @type {number} */
        this._jumpPeak = 0;
        /** @type {boolean} */
        this._movementSuccess = true;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    pos(x, y) {
        return this._x === x && this._y === y;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    posNt(x, y) {
        // No through
        return this.pos(x, y) && !this.isThrough();
    }

    /** @returns {number} */
    moveSpeed() {
        return this._moveSpeed;
    }

    /**
     * @param {number} moveSpeed
     * @returns {void}
     */
    setMoveSpeed(moveSpeed) {
        this._moveSpeed = moveSpeed;
    }

    /** @returns {number} */
    moveFrequency() {
        return this._moveFrequency;
    }

    /**
     * @param {number} moveFrequency
     * @returns {void}
     */
    setMoveFrequency(moveFrequency) {
        this._moveFrequency = moveFrequency;
    }

    /** @returns {number} */
    opacity() {
        return this._opacity;
    }

    /**
     * @param {number} opacity
     * @returns {void}
     */
    setOpacity(opacity) {
        this._opacity = opacity;
    }

    /** @returns {import("pixi.js").BLEND_MODES} */
    blendMode() {
        return this._blendMode;
    }

    /**
     * @param {import("pixi.js").BLEND_MODES} blendMode
     * @returns {void}
     */
    setBlendMode(blendMode) {
        this._blendMode = blendMode;
    }

    /** @returns {boolean} */
    isNormalPriority() {
        return this._priorityType === 1;
    }

    /**
     * @param {RMMZ.PriorityType} priorityType
     * @returns {void}
     */
    setPriorityType(priorityType) {
        this._priorityType = priorityType;
    }

    /** @returns {boolean} */
    isMoving() {
        return this._realX !== this._x || this._realY !== this._y;
    }

    /** @returns {boolean} */
    isJumping() {
        return this._jumpCount > 0;
    }

    /** @returns {number} */
    jumpHeight() {
        return (
            (this._jumpPeak * this._jumpPeak -
                Math.pow(Math.abs(this._jumpCount - this._jumpPeak), 2)) /
            2
        );
    }

    /** @returns {boolean} */
    isStopping() {
        return !this.isMoving() && !this.isJumping();
    }

    /**
     * @param {number} threshold
     * @returns {boolean}
     */
    checkStop(threshold) {
        return this._stopCount > threshold;
    }

    /** @returns {void} */
    resetStopCount() {
        this._stopCount = 0;
    }

    /** @returns {number} */
    realMoveSpeed() {
        return this._moveSpeed + (this.isDashing() ? 1 : 0);
    }

    /** @returns {number} */
    distancePerFrame() {
        return Math.pow(2, this.realMoveSpeed()) / 256;
    }

    /** @returns {boolean} */
    isDashing() {
        return false;
    }

    /** @returns {boolean} */
    isDebugThrough() {
        return false;
    }

    /** @returns {void} */
    straighten() {
        if (this.hasWalkAnime() || this.hasStepAnime()) {
            this._pattern = 1;
        }
        this._animationCount = 0;
    }

    /**
     * @param {RMMZ.Direction} d
     * @returns {RMMZ.Direction}
     */
    reverseDir(d) {
        return 10 - d;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {RMMZ.Direction} d
     * @returns {boolean}
     */
    canPass(x, y, d) {
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

    /**
     * @param {number} x
     * @param {number} y
     * @param {RMMZ.Direction} horz
     * @param {RMMZ.Direction} vert
     * @returns {boolean}
     */
    canPassDiagonally(x, y, horz, vert) {
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

    /**
     * @param {number} x
     * @param {number} y
     * @param {RMMZ.Direction} d
     * @returns {boolean}
     */
    isMapPassable(x, y, d) {
        const x2 = $gameMap.roundXWithDirection(x, d);
        const y2 = $gameMap.roundYWithDirection(y, d);
        const d2 = this.reverseDir(d);
        return $gameMap.isPassable(x, y, d) && $gameMap.isPassable(x2, y2, d2);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isCollidedWithCharacters(x, y) {
        return this.isCollidedWithEvents(x, y) || this.isCollidedWithVehicles(x, y);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isCollidedWithEvents(x, y) {
        const events = $gameMap.eventsXyNt(x, y);
        return events.some(event => event.isNormalPriority());
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isCollidedWithVehicles(x, y) {
        return $gameMap.boat().posNt(x, y) || $gameMap.ship().posNt(x, y);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    setPosition(x, y) {
        this._x = Math.round(x);
        this._y = Math.round(y);
        this._realX = x;
        this._realY = y;
    }

    /**
     * @param {Game_CharacterBase} character
     * @returns {void}
     */
    copyPosition(character) {
        this._x = character._x;
        this._y = character._y;
        this._realX = character._realX;
        this._realY = character._realY;
        this._direction = character._direction;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    locate(x, y) {
        this.setPosition(x, y);
        this.straighten();
        this.refreshBushDepth();
    }

    /** @returns {RMMZ.Direction} */
    direction() {
        return this._direction;
    }

    /**
     * @param {RMMZ.Direction | 0} [d]
     * @returns {void}
     */
    setDirection(d) {
        if (!this.isDirectionFixed() && d) {
            this._direction = d;
        }
        this.resetStopCount();
    }

    /** @returns {boolean} */
    isTile() {
        return this._tileId > 0 && this._priorityType === 0;
    }

    /** @returns {boolean} */
    isObjectCharacter() {
        return this._isObjectCharacter;
    }

    /** @returns {0 | 6} */
    shiftY() {
        return this.isObjectCharacter() ? 0 : 6;
    }

    /** @returns {number} */
    scrolledX() {
        return $gameMap.adjustX(this._realX);
    }

    /** @returns {number} */
    scrolledY() {
        return $gameMap.adjustY(this._realY);
    }

    /** @returns {number} */
    screenX() {
        const tw = $gameMap.tileWidth();
        return Math.floor(this.scrolledX() * tw + tw / 2);
    }

    /** @returns {number} */
    screenY() {
        const th = $gameMap.tileHeight();
        return Math.floor(
            this.scrolledY() * th + th - this.shiftY() - this.jumpHeight()
        );
    }

    /** @returns {number} */
    screenZ() {
        return this._priorityType * 2 + 1;
    }

    /** @returns {boolean} */
    isNearTheScreen() {
        const gw = Graphics.width;
        const gh = Graphics.height;
        const tw = $gameMap.tileWidth();
        const th = $gameMap.tileHeight();
        const px = this.scrolledX() * tw + tw / 2 - gw / 2;
        const py = this.scrolledY() * th + th / 2 - gh / 2;
        return px >= -gw && px <= gw && py >= -gh && py <= gh;
    }

    /** @returns {void} */
    update() {
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

    /** @returns {void} */
    updateStop() {
        this._stopCount++;
    }

    /** @returns {void} */
    updateJump() {
        this._jumpCount--;
        this._realX =
            (this._realX * this._jumpCount + this._x) / (this._jumpCount + 1.0);
        this._realY =
            (this._realY * this._jumpCount + this._y) / (this._jumpCount + 1.0);
        this.refreshBushDepth();
        if (this._jumpCount === 0) {
            this._realX = this._x = $gameMap.roundX(this._x);
            this._realY = this._y = $gameMap.roundY(this._y);
        }
    }

    /** @returns {void} */
    updateMove() {
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

    /** @returns {void} */
    updateAnimation() {
        this.updateAnimationCount();
        if (this._animationCount >= this.animationWait()) {
            this.updatePattern();
            this._animationCount = 0;
        }
    }

    /** @returns {number} */
    animationWait() {
        return (9 - this.realMoveSpeed()) * 3;
    }

    /** @returns {void} */
    updateAnimationCount() {
        if (this.isMoving() && this.hasWalkAnime()) {
            this._animationCount += 1.5;
        } else if (this.hasStepAnime() || !this.isOriginalPattern()) {
            this._animationCount++;
        }
    }

    /** @returns {void} */
    updatePattern() {
        if (!this.hasStepAnime() && this._stopCount > 0) {
            this.resetPattern();
        } else {
            this._pattern = (this._pattern + 1) % this.maxPattern();
        }
    }

    /** @returns {number} */
    maxPattern() {
        return 4;
    }

    /** @returns {number} */
    pattern() {
        return this._pattern < 3 ? this._pattern : 1;
    }

    /**
     * @param {number} pattern
     * @returns {void}
     */
    setPattern(pattern) {
        this._pattern = pattern;
    }

    /** @returns {boolean} */
    isOriginalPattern() {
        return this.pattern() === 1;
    }

    /** @returns {void} */
    resetPattern() {
        this.setPattern(1);
    }

    /** @returns {void} */
    refreshBushDepth() {
        if (
            this.isNormalPriority() &&
            !this.isObjectCharacter() &&
            this.isOnBush() &&
            !this.isJumping()
        ) {
            if (!this.isMoving()) {
                this._bushDepth = $gameMap.bushDepth();
            }
        } else {
            this._bushDepth = 0;
        }
    }

    /** @returns {boolean} */
    isOnLadder() {
        return $gameMap.isLadder(this._x, this._y);
    }

    /** @returns {boolean} */
    isOnBush() {
        return $gameMap.isBush(this._x, this._y);
    }

    /** @returns {number} */
    terrainTag() {
        return $gameMap.terrainTag(this._x, this._y);
    }

    /** @returns {number} */
    regionId() {
        return $gameMap.regionId(this._x, this._y);
    }

    /** @returns {void} */
    increaseSteps() {
        if (this.isOnLadder()) {
            this.setDirection(8);
        }
        this.resetStopCount();
        this.refreshBushDepth();
    }

    /** @returns {number} */
    tileId() {
        return this._tileId;
    }

    /** @returns {string} */
    characterName() {
        return this._characterName;
    }

    /** @returns {number} */
    characterIndex() {
        return this._characterIndex;
    }

    /**
     * @param {string} characterName
     * @param {number} characterIndex
     * @returns {void}
     */
    setImage(
        characterName,
        characterIndex
    ) {
        this._tileId = 0;
        this._characterName = characterName;
        this._characterIndex = characterIndex;
        this._isObjectCharacter = ImageManager.isObjectCharacter(characterName);
    }

    /**
     * @param {RMMZ.TileID} tileId
     * @returns {void}
     */
    setTileImage(tileId) {
        this._tileId = tileId;
        this._characterName = "";
        this._characterIndex = 0;
        this._isObjectCharacter = true;
    }

    /**
     * @param {RMMZ.Direction} d
     * @returns {void}
     */
    checkEventTriggerTouchFront(d) {
        const x2 = $gameMap.roundXWithDirection(this._x, d);
        const y2 = $gameMap.roundYWithDirection(this._y, d);
        this.checkEventTriggerTouch(x2, y2);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean | void}
     */
    checkEventTriggerTouch(/*x, y*/) {
        return false;
    }

    /** @returns {boolean} */
    isMovementSucceeded(/*x, y*/) {
        return this._movementSuccess;
    }

    /**
     * @param {boolean} success
     * @returns {void}
     */
    setMovementSuccess(success) {
        this._movementSuccess = success;
    }

    /**
     * @param {RMMZ.Direction} d
     * @returns {void}
     */
    moveStraight(d) {
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

    /**
     * @param {RMMZ.Direction} horz
     * @param {RMMZ.Direction} vert
     * @returns {void}
     */
    moveDiagonally(horz, vert) {
        this.setMovementSuccess(
            this.canPassDiagonally(this._x, this._y, horz, vert)
        );
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

    /**
     * @param {number} xPlus
     * @param {number} yPlus
     * @returns {void}
     */
    jump(xPlus, yPlus) {
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

    /** @returns {boolean} */
    hasWalkAnime() {
        return this._walkAnime;
    }

    /**
     * @param {boolean} walkAnime
     * @returns {void}
     */
    setWalkAnime(walkAnime) {
        this._walkAnime = walkAnime;
    }

    /** @returns {boolean} */
    hasStepAnime() {
        return this._stepAnime;
    }

    /**
     * @param {boolean} stepAnime
     * @returns {void}
     */
    setStepAnime(stepAnime) {
        this._stepAnime = stepAnime;
    }

    /** @returns {boolean} */
    isDirectionFixed() {
        return this._directionFix;
    }

    /**
     * @param {boolean} directionFix
     * @returns {void}
     */
    setDirectionFix(directionFix) {
        this._directionFix = directionFix;
    }

    /** @returns {boolean} */
    isThrough() {
        return this._through;
    }

    /**
     * @param {boolean} through
     * @returns {void}
     */
    setThrough(through) {
        this._through = through;
    }

    /** @returns {boolean} */
    isTransparent() {
        return this._transparent;
    }

    /** @returns {number} */
    bushDepth() {
        return this._bushDepth;
    }

    /**
     * @param {boolean} transparent
     * @returns {void}
     */
    setTransparent(transparent) {
        this._transparent = transparent;
    }

    /** @returns {void} */
    startAnimation() {
        this._animationPlaying = true;
    }

    /** @returns {void} */
    startBalloon() {
        this._balloonPlaying = true;
    }

    /** @returns {boolean} */
    isAnimationPlaying() {
        return this._animationPlaying;
    }

    /** @returns {boolean} */
    isBalloonPlaying() {
        return this._balloonPlaying;
    }

    /** @returns {void} */
    endAnimation() {
        this._animationPlaying = false;
    }

    /** @returns {void} */
    endBalloon() {
        this._balloonPlaying = false;
    }
}

/**
 * The superclass of Game_Player, Game_Follower, GameVehicle, and Game_Event.
 */
class Game_Character extends Game_CharacterBase {
    /** @param {[]} args */
    constructor(...args) {
        super(...args);
    }

    static ROUTE_END = 0;

    static ROUTE_MOVE_DOWN = 1;

    static ROUTE_MOVE_LEFT = 2;

    static ROUTE_MOVE_RIGHT = 3;

    static ROUTE_MOVE_UP = 4;

    static ROUTE_MOVE_LOWER_L = 5;

    static ROUTE_MOVE_LOWER_R = 6;

    static ROUTE_MOVE_UPPER_L = 7;

    static ROUTE_MOVE_UPPER_R = 8;

    static ROUTE_MOVE_RANDOM = 9;

    static ROUTE_MOVE_TOWARD = 10;

    static ROUTE_MOVE_AWAY = 11;

    static ROUTE_MOVE_FORWARD = 12;

    static ROUTE_MOVE_BACKWARD = 13;

    static ROUTE_JUMP = 14;

    static ROUTE_WAIT = 15;

    static ROUTE_TURN_DOWN = 16;

    static ROUTE_TURN_LEFT = 17;

    static ROUTE_TURN_RIGHT = 18;

    static ROUTE_TURN_UP = 19;

    static ROUTE_TURN_90D_R = 20;

    static ROUTE_TURN_90D_L = 21;

    static ROUTE_TURN_180D = 22;

    static ROUTE_TURN_90D_R_L = 23;

    static ROUTE_TURN_RANDOM = 24;

    static ROUTE_TURN_TOWARD = 25;

    static ROUTE_TURN_AWAY = 26;

    static ROUTE_SWITCH_ON = 27;

    static ROUTE_SWITCH_OFF = 28;

    static ROUTE_CHANGE_SPEED = 29;

    static ROUTE_CHANGE_FREQ = 30;

    static ROUTE_WALK_ANIME_ON = 31;

    static ROUTE_WALK_ANIME_OFF = 32;

    static ROUTE_STEP_ANIME_ON = 33;

    static ROUTE_STEP_ANIME_OFF = 34;

    static ROUTE_DIR_FIX_ON = 35;

    static ROUTE_DIR_FIX_OFF = 36;

    static ROUTE_THROUGH_ON = 37;

    static ROUTE_THROUGH_OFF = 38;

    static ROUTE_TRANSPARENT_ON = 39;

    static ROUTE_TRANSPARENT_OFF = 40;

    static ROUTE_CHANGE_IMAGE = 41;

    static ROUTE_CHANGE_OPACITY = 42;

    static ROUTE_CHANGE_BLEND_MODE = 43;

    static ROUTE_PLAY_SE = 44;

    static ROUTE_SCRIPT = 45;

    initialize() {
        super.initialize();
    }

    /** @returns {void} */
    initMembers() {
        super.initMembers();
        /** @type {boolean} */
        this._moveRouteForcing = false;
        /** @type {RMMZ.MoveRoute | null} */
        this._moveRoute = null;
        /** @type {number} */
        this._moveRouteIndex = 0;
        /** @type {RMMZ.MoveRoute | null} */
        this._originalMoveRoute = null;
        /** @type {number} */
        this._originalMoveRouteIndex = 0;
        /** @type {number} */
        this._waitCount = 0;
    }

    /** @returns {void} */
    memorizeMoveRoute() {
        this._originalMoveRoute = this._moveRoute;
        this._originalMoveRouteIndex = this._moveRouteIndex;
    }

    /** @returns {void} */
    restoreMoveRoute() {
        this._moveRoute = this._originalMoveRoute;
        this._moveRouteIndex = this._originalMoveRouteIndex;
        this._originalMoveRoute = null;
    }

    /** @returns {boolean} */
    isMoveRouteForcing() {
        return this._moveRouteForcing;
    }

    /**
     * @param {RMMZ.MoveRoute} moveRoute
     * @returns {void}
     */
    setMoveRoute(moveRoute) {
        if (this._moveRouteForcing) {
            this._originalMoveRoute = moveRoute;
            this._originalMoveRouteIndex = 0;
        } else {
            this._moveRoute = moveRoute;
            this._moveRouteIndex = 0;
        }
    }

    /**
     * @param {RMMZ.MoveRoute} moveRoute
     * @returns {void}
     */
    forceMoveRoute(moveRoute) {
        if (!this._originalMoveRoute) {
            this.memorizeMoveRoute();
        }
        this._moveRoute = moveRoute;
        this._moveRouteIndex = 0;
        this._moveRouteForcing = true;
        this._waitCount = 0;
    }

    /** @returns {void} */
    updateStop() {
        super.updateStop();
        if (this._moveRouteForcing) {
            this.updateRoutineMove();
        }
    }

    /** @returns {void} */
    updateRoutineMove() {
        if (this._waitCount > 0) {
            this._waitCount--;
        } else {
            this.setMovementSuccess(true);
            const command = this._moveRoute.list[this._moveRouteIndex];
            if (command) {
                this.processMoveCommand(command);
                this.advanceMoveRouteIndex();
            }
        }
    }

    /**
     * @param {RMMZ.DataCommand} command
     * @returns {void}
     */
    processMoveCommand(command) {
        const gc = Game_Character;
        const params = command.parameters;
        switch (command.code) {
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
                this.jump(params[0], params[1]);
                break;
            case gc.ROUTE_WAIT:
                this._waitCount = params[0] - 1;
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
                $gameSwitches.setValue(params[0], true);
                break;
            case gc.ROUTE_SWITCH_OFF:
                $gameSwitches.setValue(params[0], false);
                break;
            case gc.ROUTE_CHANGE_SPEED:
                this.setMoveSpeed(params[0]);
                break;
            case gc.ROUTE_CHANGE_FREQ:
                this.setMoveFrequency(params[0]);
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
                this.setImage(params[0], params[1]);
                break;
            case gc.ROUTE_CHANGE_OPACITY:
                this.setOpacity(params[0]);
                break;
            case gc.ROUTE_CHANGE_BLEND_MODE:
                this.setBlendMode(params[0]);
                break;
            case gc.ROUTE_PLAY_SE:
                AudioManager.playSe(params[0]);
                break;
            case gc.ROUTE_SCRIPT:
                eval(params[0]);
                break;
        }
    }

    /**
     * @param {number} x
     * @returns {number}
     */
    deltaXFrom(x) {
        return $gameMap.deltaX(this.x, x);
    }

    /**
     * @param {number} y
     * @returns {number}
     */
    deltaYFrom(y) {
        return $gameMap.deltaY(this.y, y);
    }

    /** @returns {void} */
    moveRandom() {
        const d = 2 + Math.randomInt(4) * 2;
        if (this.canPass(this.x, this.y, d)) {
            this.moveStraight(d);
        }
    }

    /**
     * @param {Game_Character} character
     * @returns {void}
     */
    moveTowardCharacter(character) {
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

    /**
     * @param {Game_Character} character
     * @returns {void}
     */
    moveAwayFromCharacter(character) {
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

    /**
     * @param {Game_Character} character
     * @returns {void}
     */
    turnTowardCharacter(character) {
        const sx = this.deltaXFrom(character.x);
        const sy = this.deltaYFrom(character.y);
        if (Math.abs(sx) > Math.abs(sy)) {
            this.setDirection(sx > 0 ? 4 : 6);
        } else if (sy !== 0) {
            this.setDirection(sy > 0 ? 8 : 2);
        }
    }

    /**
     * @param {Game_Character} character
     * @returns {void}
     */
    turnAwayFromCharacter(character) {
        const sx = this.deltaXFrom(character.x);
        const sy = this.deltaYFrom(character.y);
        if (Math.abs(sx) > Math.abs(sy)) {
            this.setDirection(sx > 0 ? 6 : 4);
        } else if (sy !== 0) {
            this.setDirection(sy > 0 ? 2 : 8);
        }
    }

    /** @returns {void} */
    turnTowardPlayer() {
        this.turnTowardCharacter($gamePlayer);
    }

    /** @returns {void} */
    turnAwayFromPlayer() {
        this.turnAwayFromCharacter($gamePlayer);
    }

    /** @returns {void} */
    moveTowardPlayer() {
        this.moveTowardCharacter($gamePlayer);
    }

    /** @returns {void} */
    moveAwayFromPlayer() {
        this.moveAwayFromCharacter($gamePlayer);
    }

    /** @returns {void} */
    moveForward() {
        this.moveStraight(this.direction());
    }

    /** @returns {void} */
    moveBackward() {
        const lastDirectionFix = this.isDirectionFixed();
        this.setDirectionFix(true);
        this.moveStraight(this.reverseDir(this.direction()));
        this.setDirectionFix(lastDirectionFix);
    }

    /** @returns {void} */
    processRouteEnd() {
        if (this._moveRoute.repeat) {
            this._moveRouteIndex = -1;
        } else if (this._moveRouteForcing) {
            this._moveRouteForcing = false;
            this.restoreMoveRoute();
            this.setMovementSuccess(false);
        }
    }

    /** @returns {void} */
    advanceMoveRouteIndex() {
        const moveRoute = this._moveRoute;
        if (moveRoute && (this.isMovementSucceeded() || moveRoute.skippable)) {
            let numCommands = moveRoute.list.length - 1;
            this._moveRouteIndex++;
            if (moveRoute.repeat && this._moveRouteIndex >= numCommands) {
                this._moveRouteIndex = 0;
            }
        }
    }

    /** @returns {void} */
    turnRight90() {
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

    /** @returns {void} */
    turnLeft90() {
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

    /** @returns {void} */
    turn180() {
        this.setDirection(this.reverseDir(this.direction()));
    }

    /** @returns {void} */
    turnRightOrLeft90() {
        switch (Math.randomInt(2)) {
            case 0:
                this.turnRight90();
                break;
            case 1:
                this.turnLeft90();
                break;
        }
    }

    /** @returns {void} */
    turnRandom() {
        this.setDirection(2 + Math.randomInt(4) * 2);
    }

    /**
     * @param {Game_Character} character
     * @returns {void}
     */
    swap(character) {
        const newX = character.x;
        const newY = character.y;
        character.locate(this.x, this.y);
        this.locate(newX, newY);
    }

    /**
     * @param {number} goalX
     * @param {number} goalY
     * @returns {0 | 2 | 4 | 8 | 6}
     */
    findDirectionTo(goalX, goalY) {
        const searchLimit = this.searchLimit();
        const mapWidth = $gameMap.width();
        const nodeList = [];
        const openList = [];
        const closedList = [];
        const start = {};
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
                const x2 = $gameMap.roundXWithDirection(x1, direction);
                const y2 = $gameMap.roundYWithDirection(y1, direction);
                const pos2 = y2 * mapWidth + x2;

                if (closedList.includes(pos2)) {
                    continue;
                }
                if (!this.canPass(x1, y1, direction)) {
                    continue;
                }

                const g2 = g1 + 1;
                const index2 = openList.indexOf(pos2);

                if (index2 < 0 || g2 < nodeList[index2].g) {
                    let neighbor = {};
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

    /** @returns {number} */
    searchLimit() {
        return 12;
    }
}

/**
 * The game object class for the player. It contains event starting
 * determinants and map scrolling functions.
 */
class Game_Player extends Game_Character {
    /** @param {[]} args */
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
        this.setTransparent($dataSystem.optTransparent);
    }

    /** @returns {void} */
    initMembers() {
        super.initMembers();
        /** @type {RMMZ.VehicleType} */
        this._vehicleType = "walk";
        /** @type {boolean} */
        this._vehicleGettingOn = false;
        /** @type {boolean} */
        this._vehicleGettingOff = false;
        /** @type {boolean} */
        this._dashing = false;
        /** @type {boolean} */
        this._needsMapReload = false;
        /** @type {boolean} */
        this._transferring = false;
        /** @type {number} */
        this._newMapId = 0;
        /** @type {number} */
        this._newX = 0;
        /** @type {number} */
        this._newY = 0;
        /** @type {RMMZ.Direction} */
        this._newDirection = 0;
        /** @type {number | undefined} */
        this._fadeType = 0;
        /** @type {Game_Followers} */
        this._followers = new Game_Followers();
        /** @type {number} */
        this._encounterCount = 0;
    }

    /** @returns {void} */
    clearTransferInfo() {
        this._transferring = false;
        this._newMapId = 0;
        this._newX = 0;
        this._newY = 0;
        this._newDirection = 0;
    }

    /** @returns {Game_Followers} */
    followers() {
        return this._followers;
    }

    /** @returns {void} */
    refresh() {
        const actor = $gameParty.leader();
        const characterName = actor ? actor.characterName() : "";
        const characterIndex = actor ? actor.characterIndex() : 0;
        this.setImage(characterName, characterIndex);
        this._followers.refresh();
    }

    /** @returns {boolean} */
    isStopping() {
        if (this._vehicleGettingOn || this._vehicleGettingOff) {
            return false;
        }
        return super.isStopping();
    }

    /**
     * @param {RMMZ.MapID} mapId
     * @param {number} x
     * @param {number} y
     * @param {RMMZ.Direction} [d]
     * @param {number} [fadeType]
     * @returns {void}
     */
    reserveTransfer(mapId, x, y, d, fadeType) {
        this._transferring = true;
        this._newMapId = mapId;
        this._newX = x;
        this._newY = y;
        this._newDirection = d;
        this._fadeType = fadeType;
    }

    /** @returns {void} */
    setupForNewGame() {
        const mapId = $dataSystem.startMapId;
        const x = $dataSystem.startX;
        const y = $dataSystem.startY;
        this.reserveTransfer(mapId, x, y, 2, 0);
    }

    /** @returns {void} */
    requestMapReload() {
        this._needsMapReload = true;
    }

    /** @returns {boolean} */
    isTransferring() {
        return this._transferring;
    }

    /** @returns {number} */
    newMapId() {
        return this._newMapId;
    }

    /** @returns {number | undefined} */
    fadeType() {
        return this._fadeType;
    }

    /** @returns {void} */
    performTransfer() {
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

    /**
     * @param {number} x
     * @param {number} y
     * @param {RMMZ.Direction} d
     * @returns {boolean}
     */
    isMapPassable(x, y, d) {
        const vehicle = this.vehicle();
        if (vehicle) {
            return vehicle.isMapPassable(x, y, d);
        } else {
            return super.isMapPassable(x, y, d);
        }
    }

    /** @returns {import("./Game_Vehicle").Game_Vehicle} */
    vehicle() {
        return $gameMap.vehicle(this._vehicleType);
    }

    /** @returns {boolean} */
    isInBoat() {
        return this._vehicleType === "boat";
    }

    /** @returns {boolean} */
    isInShip() {
        return this._vehicleType === "ship";
    }

    /** @returns {boolean} */
    isInAirship() {
        return this._vehicleType === "airship";
    }

    /** @returns {boolean} */
    isInVehicle() {
        return this.isInBoat() || this.isInShip() || this.isInAirship();
    }

    /** @returns {boolean} */
    isNormal() {
        return this._vehicleType === "walk" && !this.isMoveRouteForcing();
    }

    /** @returns {boolean} */
    isDashing() {
        return this._dashing;
    }

    /** @returns {boolean} */
    isDebugThrough() {
        return Input.isPressed("control") && $gameTemp.isPlaytest();
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isCollided(x, y) {
        if (this.isThrough()) {
            return false;
        } else {
            return this.pos(x, y) || this._followers.isSomeoneCollided(x, y);
        }
    }

    /** @returns {number} */
    centerX() {
        return ($gameMap.screenTileX() - 1) / 2;
    }

    /** @returns {number} */
    centerY() {
        return ($gameMap.screenTileY() - 1) / 2;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    center(x, y) {
        return $gameMap.setDisplayPos(x - this.centerX(), y - this.centerY());
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    locate(x, y) {
        super.locate(x, y);
        this.center(x, y);
        this.makeEncounterCount();
        if (this.isInVehicle()) {
            this.vehicle().refresh();
        }
        this._followers.synchronize(x, y, this.direction());
    }

    /** @returns {void} */
    increaseSteps() {
        super.increaseSteps();
        if (this.isNormal()) {
            $gameParty.increaseSteps();
        }
    }

    /** @returns {void} */
    makeEncounterCount() {
        const n = $gameMap.encounterStep();
        this._encounterCount = Math.randomInt(n) + Math.randomInt(n) + 1;
    }

    /** @returns {number} */
    makeEncounterTroopId() {
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

    /**
     * @param {RMMZ.DataEncounter} encounter
     * @returns {boolean}
     */
    meetsEncounterConditions(encounter) {
        return (
            encounter.regionSet.length === 0 ||
            encounter.regionSet.includes(this.regionId())
        );
    }

    /** @returns {boolean} */
    executeEncounter() {
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

    /**
     * @param {number} x
     * @param {number} y
     * @param {number[]} triggers
     * @param {boolean} normal
     * @returns {void}
     */
    startMapEvent(x, y, triggers, normal) {
        if (!$gameMap.isEventRunning()) {
            for (const event of $gameMap.eventsXy(x, y)) {
                if (
                    event.isTriggerIn(triggers) &&
                    event.isNormalPriority() === normal
                ) {
                    event.start();
                }
            }
        }
    }

    /** @returns {void} */
    moveByInput() {
        if (!this.isMoving() && this.canMove()) {
            let direction = this.getInputDirection();
            if (direction > 0) {
                $gameTemp.clearDestination();
            } else if ($gameTemp.isDestinationValid()) {
                const x = $gameTemp.destinationX();
                const y = $gameTemp.destinationY();
                direction = this.findDirectionTo(x, y);
            }
            if (direction > 0) {
                this.executeMove(direction);
            }
        }
    }

    /** @returns {boolean} */
    canMove() {
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

    /** @returns {RMMZ.Direction} */
    getInputDirection() {
        return Input.dir4;
    }

    /**
     * @param {RMMZ.Direction} direction
     * @returns {void}
     */
    executeMove(direction) {
        this.moveStraight(direction);
    }

    /**
     * @param {boolean} [sceneActive]
     * @returns {void}
     */
    update(sceneActive) {
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

    /** @returns {void} */
    updateDashing() {
        if (this.isMoving()) {
            return;
        }
        if (this.canMove() && !this.isInVehicle() && !$gameMap.isDashDisabled()) {
            this._dashing =
                this.isDashButtonPressed() || $gameTemp.isDestinationValid();
        } else {
            this._dashing = false;
        }
    }

    /** @returns {boolean} */
    isDashButtonPressed() {
        const shift = Input.isPressed("shift");
        if (ConfigManager.alwaysDash) {
            return !shift;
        } else {
            return shift;
        }
    }

    /**
     * @param {number} lastScrolledX
     * @param {number} lastScrolledY
     * @returns {void}
     */
    updateScroll(lastScrolledX, lastScrolledY) {
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

    /** @returns {void} */
    updateVehicle() {
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

    /** @returns {void} */
    updateVehicleGetOn() {
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

    /** @returns {void} */
    updateVehicleGetOff() {
        if (!this.areFollowersGathering() && this.vehicle().isLowest()) {
            this._vehicleGettingOff = false;
            this._vehicleType = "walk";
            this.setTransparent(false);
        }
    }

    /**
     * @param {boolean} wasMoving
     * @param {boolean} [sceneActive]
     * @returns {void}
     */
    updateNonmoving(wasMoving, sceneActive) {
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

    /** @returns {boolean} */
    triggerAction() {
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

    /** @returns {boolean} */
    triggerButtonAction() {
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

    /** @returns {boolean} */
    triggerTouchAction() {
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

    /**
     * @param {number} x1
     * @param {number} y1
     * @returns {boolean}
     */
    triggerTouchActionD1(x1, y1) {
        if ($gameMap.airship().pos(x1, y1)) {
            if (TouchInput.isTriggered() && this.getOnOffVehicle()) {
                return true;
            }
        }
        this.checkEventTriggerHere([0]);
        return $gameMap.setupStartingEvent();
    }

    /**
     * @param {number} x2
     * @param {number} y2
     * @returns {boolean}
     */
    triggerTouchActionD2(x2, y2) {
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

    /**
     * @param {number} x2
     * @param {number} y2
     * @returns {boolean}
     */
    triggerTouchActionD3(x2, y2) {
        if ($gameMap.isCounter(x2, y2)) {
            this.checkEventTriggerThere([0, 1, 2]);
        }
        return $gameMap.setupStartingEvent();
    }

    /** @returns {void} */
    updateEncounterCount() {
        if (this.canEncounter()) {
            this._encounterCount -= this.encounterProgressValue();
        }
    }

    /** @returns {boolean} */
    canEncounter() {
        return (
            !$gameParty.hasEncounterNone() &&
            $gameSystem.isEncounterEnabled() &&
            !this.isInAirship() &&
            !this.isMoveRouteForcing() &&
            !this.isDebugThrough()
        );
    }

    /** @returns {number} */
    encounterProgressValue() {
        let value = $gameMap.isBush(this.x, this.y) ? 2 : 1;
        if ($gameParty.hasEncounterHalf()) {
            value *= 0.5;
        }
        if (this.isInShip()) {
            value *= 0.5;
        }
        return value;
    }

    /**
     * @param {number[]} triggers
     * @returns {void}
     */
    checkEventTriggerHere(triggers) {
        if (this.canStartLocalEvents()) {
            this.startMapEvent(this.x, this.y, triggers, false);
        }
    }

    /**
     * @param {number[]} triggers
     * @returns {void}
     */
    checkEventTriggerThere(triggers) {
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

    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    checkEventTriggerTouch(x, y) {
        if (this.canStartLocalEvents()) {
            this.startMapEvent(x, y, [1, 2], true);
        }
    }

    /** @returns {boolean} */
    canStartLocalEvents() {
        return !this.isInAirship();
    }

    /** @returns {boolean} */
    getOnOffVehicle() {
        if (this.isInVehicle()) {
            return this.getOffVehicle();
        } else {
            return this.getOnVehicle();
        }
    }

    /** @returns {boolean} */
    getOnVehicle() {
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

    /** @returns {boolean} */
    getOffVehicle() {
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

    /** @returns {void} */
    forceMoveForward() {
        this.setThrough(true);
        this.moveForward();
        this.setThrough(false);
    }

    /** @returns {boolean} */
    isOnDamageFloor() {
        return $gameMap.isDamageFloor(this.x, this.y) && !this.isInAirship();
    }

    /**
     * @param {RMMZ.Direction} d
     * @returns {void}
     */
    moveStraight(d) {
        if (this.canPass(this.x, this.y, d)) {
            this._followers.updateMove();
        }
        super.moveStraight(d);
    }

    /**
     * @param {RMMZ.Direction} horz
     * @param {RMMZ.Direction} vert
     * @returns {void}
     */
    moveDiagonally(horz, vert) {
        if (this.canPassDiagonally(this.x, this.y, horz, vert)) {
            this._followers.updateMove();
        }
        super.moveDiagonally(horz, vert);
    }

    /**
     * @param {number} xPlus
     * @param {number} yPlus
     * @returns {void}
     */
    jump(xPlus, yPlus) {
        super.jump(xPlus, yPlus);
        this._followers.jumpAll();
    }

    /** @returns {void} */
    showFollowers() {
        this._followers.show();
    }

    /** @returns {void} */
    hideFollowers() {
        this._followers.hide();
    }

    /** @returns {void} */
    gatherFollowers() {
        this._followers.gather();
    }

    /** @returns {boolean} */
    areFollowersGathering() {
        return this._followers.areGathering();
    }

    /** @returns {boolean} */
    areFollowersGathered() {
        return this._followers.areGathered();
    }
}

/**
 * The game object class for a follower. A follower is an allied character,
 * other than the front character, displayed in the party.
 */
class Game_Follower extends Game_Character {
    /** @param {[memberIndex: number]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {number} memberIndex */
    initialize(memberIndex) {
        super.initialize();
        /** @type {number} */
        this._memberIndex = memberIndex;
        this.setTransparent($dataSystem.optTransparent);
        this.setThrough(true);
    }

    /** @returns {void} */
    refresh() {
        const characterName = this.isVisible() ? this.actor().characterName() : "";
        const characterIndex = this.isVisible() ? this.actor().characterIndex() : 0;
        this.setImage(characterName, characterIndex);
    }

    /** @returns {import("./Game_Actor").Game_Actor} */
    actor() {
        return $gameParty.battleMembers()[this._memberIndex];
    }

    /** @returns {boolean} */
    isVisible() {
        return this.actor() && $gamePlayer.followers().isVisible();
    }

    /** @returns {boolean} */
    isGathered() {
        return !this.isMoving() && this.pos($gamePlayer.x, $gamePlayer.y);
    }

    /** @returns {void} */
    update() {
        super.update();
        this.setMoveSpeed($gamePlayer.realMoveSpeed());
        this.setOpacity($gamePlayer.opacity());
        this.setBlendMode($gamePlayer.blendMode());
        this.setWalkAnime($gamePlayer.hasWalkAnime());
        this.setStepAnime($gamePlayer.hasStepAnime());
        this.setDirectionFix($gamePlayer.isDirectionFixed());
        this.setTransparent($gamePlayer.isTransparent());
    }

    /**
     * @param {Game_Character} character
     * @returns {void}
     */
    chaseCharacter(character) {
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
    /** @param {[]} args */
    constructor(...args) {
        this.initialize(...args);
    }

    initialize() {
        /** @type {boolean} */
        this._visible = $dataSystem.optFollowers;
        /** @type {boolean} */
        this._gathering = false;
        /** @type {Game_Follower[]} */
        this._data = [];
        this.setup();
    }

    /** @returns {void} */
    setup() {
        this._data = [];
        for (let i = 1; i < $gameParty.maxBattleMembers(); i++) {
            this._data.push(new Game_Follower(i));
        }
    }

    /** @returns {boolean} */
    isVisible() {
        return this._visible;
    }

    /** @returns {void} */
    show() {
        this._visible = true;
    }

    /** @returns {void} */
    hide() {
        this._visible = false;
    }

    /** @returns {Game_Follower[]} */
    data() {
        return this._data.clone();
    }

    /** @returns {Game_Follower[]} */
    reverseData() {
        return this._data.clone().reverse();
    }

    /**
     * @param {number} index
     * @returns {Game_Follower}
     */
    follower(index) {
        return this._data[index];
    }

    /** @returns {void} */
    refresh() {
        for (const follower of this._data) {
            follower.refresh();
        }
    }

    /** @returns {void} */
    update() {
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

    /** @returns {void} */
    updateMove() {
        for (let i = this._data.length - 1; i >= 0; i--) {
            const precedingCharacter = i > 0 ? this._data[i - 1] : $gamePlayer;
            this._data[i].chaseCharacter(precedingCharacter);
        }
    }

    /** @returns {void} */
    jumpAll() {
        if ($gamePlayer.isJumping()) {
            for (const follower of this._data) {
                const sx = $gamePlayer.deltaXFrom(follower.x);
                const sy = $gamePlayer.deltaYFrom(follower.y);
                follower.jump(sx, sy);
            }
        }
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {RMMZ.Direction} d
     * @returns {void}
     */
    synchronize(x, y, d) {
        for (const follower of this._data) {
            follower.locate(x, y);
            follower.setDirection(d);
        }
    }

    /** @returns {void} */
    gather() {
        this._gathering = true;
    }

    /** @returns {boolean} */
    areGathering() {
        return this._gathering;
    }

    /** @returns {Game_Follower[]} */
    visibleFollowers() {
        return this._data.filter(follower => follower.isVisible());
    }

    /** @returns {boolean} */
    areMoving() {
        return this.visibleFollowers().some(follower => follower.isMoving());
    }

    /** @returns {boolean} */
    areGathered() {
        return this.visibleFollowers().every(follower => follower.isGathered());
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isSomeoneCollided(x, y) {
        return this.visibleFollowers().some(follower => follower.pos(x, y));
    }
}

/**
 * The game object class for a vehicle.
 */
class Game_Vehicle extends Game_Character {
    /** @param {[type: RMMZ.VehicleType]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {RMMZ.VehicleType} type */
    initialize(type) {
        super.initialize();
        /** @type {RMMZ.VehicleType} */
        this._type = type;
        this.resetDirection();
        this.initMoveSpeed();
        this.loadSystemSettings();
    }

    /** @returns {void} */
    initMembers() {
        super.initMembers();
        this._type = "";
        /** @type {number} */
        this._mapId = 0;
        /** @type {number} */
        this._altitude = 0;
        /** @type {boolean} */
        this._driving = false;
        /** @type {RMMZ.DataAudio | null} */
        this._bgm = null;
    }

    /** @returns {boolean} */
    isBoat() {
        return this._type === "boat";
    }

    /** @returns {boolean} */
    isShip() {
        return this._type === "ship";
    }

    /** @returns {boolean} */
    isAirship() {
        return this._type === "airship";
    }

    /** @returns {void} */
    resetDirection() {
        this.setDirection(4);
    }

    /** @returns {void} */
    initMoveSpeed() {
        if (this.isBoat()) {
            this.setMoveSpeed(4);
        } else if (this.isShip()) {
            this.setMoveSpeed(5);
        } else if (this.isAirship()) {
            this.setMoveSpeed(6);
        }
    }

    /** @returns {import("../data").DataVehicle | null} */
    vehicle() {
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

    /** @returns {void} */
    loadSystemSettings() {
        const vehicle = this.vehicle();
        this._mapId = vehicle.startMapId;
        this.setPosition(vehicle.startX, vehicle.startY);
        this.setImage(vehicle.characterName, vehicle.characterIndex);
    }

    /** @returns {void} */
    refresh() {
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

    /**
     * @param {RMMZ.MapID} mapId
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    setLocation(mapId, x, y) {
        this._mapId = mapId;
        this.setPosition(x, y);
        this.refresh();
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    pos(x, y) {
        if (this._mapId === $gameMap.mapId()) {
            return super.pos(x, y);
        } else {
            return false;
        }
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {RMMZ.Direction} d
     * @returns {boolean}
     */
    isMapPassable(x, y, d) {
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

    /** @returns {void} */
    getOn() {
        this._driving = true;
        this.setWalkAnime(true);
        this.setStepAnime(true);
        $gameSystem.saveWalkingBgm();
        this.playBgm();
    }

    /** @returns {void} */
    getOff() {
        this._driving = false;
        this.setWalkAnime(false);
        this.setStepAnime(false);
        this.resetDirection();
        $gameSystem.replayWalkingBgm();
    }

    /**
     * @param {RMMZ.DataAudio} bgm
     * @returns {void}
     */
    setBgm(bgm) {
        this._bgm = bgm;
    }

    /** @returns {void} */
    playBgm() {
        AudioManager.playBgm(this._bgm || this.vehicle().bgm);
    }

    /** @returns {void} */
    syncWithPlayer() {
        this.copyPosition($gamePlayer);
        this.refreshBushDepth();
    }

    /** @returns {number} */
    screenY() {
        return super.screenY() - this._altitude;
    }

    /** @returns {number} */
    shadowX() {
        return this.screenX();
    }

    /** @returns {number} */
    shadowY() {
        return this.screenY() + this._altitude;
    }

    /** @returns {number} */
    shadowOpacity() {
        return (255 * this._altitude) / this.maxAltitude();
    }

    /** @returns {boolean} */
    canMove() {
        if (this.isAirship()) {
            return this.isHighest();
        } else {
            return true;
        }
    }

    /** @returns {void} */
    update() {
        super.update();
        if (this.isAirship()) {
            this.updateAirship();
        }
    }

    /** @returns {void} */
    updateAirship() {
        this.updateAirshipAltitude();
        this.setStepAnime(this.isHighest());
        this.setPriorityType(this.isLowest() ? 0 : 2);
    }

    /** @returns {void} */
    updateAirshipAltitude() {
        if (this._driving && !this.isHighest()) {
            this._altitude++;
        }
        if (!this._driving && !this.isLowest()) {
            this._altitude--;
        }
    }

    /** @returns {number} */
    maxAltitude() {
        return 48;
    }

    /** @returns {boolean} */
    isLowest() {
        return this._altitude <= 0;
    }

    /** @returns {boolean} */
    isHighest() {
        return this._altitude >= this.maxAltitude();
    }

    /** @returns {boolean} */
    isTakeoffOk() {
        return $gamePlayer.areFollowersGathered();
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {RMMZ.Direction} d
     * @returns {boolean}
     */
    isLandOk(x, y, d) {
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
    /** @param {[mapId: RMMZ.MapID, eventId: RMMZ.EventID]} args */
    constructor(...args) {
        super(...args);
    }

    /**
     * @param {RMMZ.MapID} mapId
     * @param {RMMZ.EventID} eventId
     */
    initialize(mapId, eventId) {
        super.initialize();
        /** @type {RMMZ.MapID} */
        this._mapId = mapId;
        /** @type {RMMZ.EventID} */
        this._eventId = eventId;
        this.locate(this.event().x, this.event().y);
        this.refresh();
    }

    /** @returns {void} */
    initMembers() {
        super.initMembers();
        /** @type {number} */
        this._moveType = 0;
        /** @type {number | null} */
        this._trigger = 0;
        /** @type {boolean} */
        this._starting = false;
        /** @type {boolean} */
        this._erased = false;
        /** @type {number} */
        this._pageIndex = -2;
        /** @type {number} */
        this._originalPattern = 1;
        /** @type {number} */
        this._originalDirection = 2;
        /** @type {RMMZ.Direction} */
        this._prelockDirection = 0;
        /** @type {boolean} */
        this._locked = false;
    }

    /** @returns {number} */
    eventId() {
        return this._eventId;
    }

    /** @returns {import("../data").DataEvent} */
    event() {
        return $dataMap.events[this._eventId];
    }

    /** @returns {RMMZ.DataEventPage} */
    page() {
        return this.event().pages[this._pageIndex];
    }

    /** @returns {import("../data").DataCommand[]} */
    list() {
        return this.page().list;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isCollidedWithCharacters(x, y) {
        return (
            super.isCollidedWithCharacters(x, y) ||
            this.isCollidedWithPlayerCharacters(x, y)
        );
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isCollidedWithEvents(x, y) {
        const events = $gameMap.eventsXyNt(x, y);
        return events.length > 0;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isCollidedWithPlayerCharacters(x, y) {
        return this.isNormalPriority() && $gamePlayer.isCollided(x, y);
    }

    /** @returns {void} */
    lock() {
        if (!this._locked) {
            this._prelockDirection = this.direction();
            this.turnTowardPlayer();
            this._locked = true;
        }
    }

    /** @returns {void} */
    unlock() {
        if (this._locked) {
            this._locked = false;
            this.setDirection(this._prelockDirection);
        }
    }

    /** @returns {void} */
    updateStop() {
        if (this._locked) {
            this.resetStopCount();
        }
        super.updateStop();
        if (!this.isMoveRouteForcing()) {
            this.updateSelfMovement();
        }
    }

    /** @returns {void} */
    updateSelfMovement() {
        if (
            !this._locked &&
            this.isNearTheScreen() &&
            this.checkStop(this.stopCountThreshold())
        ) {
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

    /** @returns {number} */
    stopCountThreshold() {
        return 30 * (5 - this.moveFrequency());
    }

    /** @returns {void} */
    moveTypeRandom() {
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

    /** @returns {void} */
    moveTypeTowardPlayer() {
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

    /** @returns {boolean} */
    isNearThePlayer() {
        const sx = Math.abs(this.deltaXFrom($gamePlayer.x));
        const sy = Math.abs(this.deltaYFrom($gamePlayer.y));
        return sx + sy < 20;
    }

    /** @returns {void} */
    moveTypeCustom() {
        this.updateRoutineMove();
    }

    /** @returns {boolean} */
    isStarting() {
        return this._starting;
    }

    /** @returns {void} */
    clearStartingFlag() {
        this._starting = false;
    }

    /**
     * @param {number[]} triggers
     * @returns {boolean}
     */
    isTriggerIn(triggers) {
        return triggers.includes(this._trigger);
    }

    /** @returns {void} */
    start() {
        const list = this.list();
        if (list && list.length > 1) {
            this._starting = true;
            if (this.isTriggerIn([0, 1, 2])) {
                this.lock();
            }
        }
    }

    /** @returns {void} */
    erase() {
        this._erased = true;
        this.refresh();
    }

    /** @returns {void} */
    refresh() {
        const newPageIndex = this._erased ? -1 : this.findProperPageIndex();
        if (this._pageIndex !== newPageIndex) {
            this._pageIndex = newPageIndex;
            this.setupPage();
        }
    }

    /** @returns {number} */
    findProperPageIndex() {
        const pages = this.event().pages;
        for (let i = pages.length - 1; i >= 0; i--) {
            const page = pages[i];
            if (this.meetsConditions(page)) {
                return i;
            }
        }
        return -1;
    }

    /**
     * @param {RMMZ.DataEventPage} page
     * @returns {boolean}
     */
    meetsConditions(page) {
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
            const key = [this._mapId, this._eventId, c.selfSwitchCh];
            if ($gameSelfSwitches.value(key) !== true) {
                return false;
            }
        }
        if (c.itemValid) {
            const item = $dataItems[c.itemId];
            if (!$gameParty.hasItem(item)) {
                return false;
            }
        }
        if (c.actorValid) {
            const actor = $gameActors.actor(c.actorId);
            if (!$gameParty.members().includes(actor)) {
                return false;
            }
        }
        return true;
    }

    /** @returns {void} */
    setupPage() {
        if (this._pageIndex >= 0) {
            this.setupPageSettings();
        } else {
            this.clearPageSettings();
        }
        this.refreshBushDepth();
        this.clearStartingFlag();
        this.checkEventTriggerAuto();
    }

    /** @returns {void} */
    clearPageSettings() {
        this.setImage("", 0);
        this._moveType = 0;
        this._trigger = null;
        this._interpreter = null;
        this.setThrough(true);
    }

    /** @returns {void} */
    setupPageSettings() {
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

    /** @returns {boolean} */
    isOriginalPattern() {
        return this.pattern() === this._originalPattern;
    }

    /** @returns {void} */
    resetPattern() {
        this.setPattern(this._originalPattern);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    checkEventTriggerTouch(x, y) {
        if (!$gameMap.isEventRunning()) {
            if (this._trigger === 2 && $gamePlayer.pos(x, y)) {
                if (!this.isJumping() && this.isNormalPriority()) {
                    this.start();
                }
            }
        }
    }

    /** @returns {void} */
    checkEventTriggerAuto() {
        if (this._trigger === 3) {
            this.start();
        }
    }

    /** @returns {void} */
    update() {
        super.update();
        this.checkEventTriggerAuto();
        this.updateParallel();
    }

    /** @returns {void} */
    updateParallel() {
        if (this._interpreter) {
            if (!this._interpreter.isRunning()) {
                this._interpreter.setup(this.list(), this._eventId);
            }
            this._interpreter.update();
        }
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    locate(x, y) {
        super.locate(x, y);
        this._prelockDirection = 0;
    }

    /**
     * @param {RMMZ.MoveRoute} moveRoute
     * @returns {void}
     */
    forceMoveRoute(moveRoute) {
        super.forceMoveRoute(moveRoute);
        this._prelockDirection = 0;
    }
}

/**
 * The interpreter for running event commands.
 */
class Game_Interpreter {
    /** @param {[depth?: number]} args */
    constructor(...args) {
        this.initialize(...args);
    }

    /** @param {number} [depth] */
    initialize(depth) {
        /** @type {number} */
        this._depth = depth || 0;
        this.checkOverflow();
        this.clear();
        /** @type {Record<number, number | boolean | null>} */
        this._branch = {};
        /** @type {number} */
        this._indent = 0;
        /** @type {number} */
        this._frameCount = 0;
        /** @type {number} */
        this._freezeChecker = 0;
    }

    /** @returns {void} */
    checkOverflow() {
        if (this._depth >= 100) {
            throw new Error("Common event calls exceeded the limit");
        }
    }

    /** @returns {void} */
    clear() {
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

    /**
     * @param {RMMZ.DataCommand[]} list
     * @param {RMMZ.EventID} [eventId]
     * @returns {void}
     */
    setup(list, eventId) {
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
     *
     * @returns {void}
     */
    loadImages() {
        const list = this._list.slice(0, 200);
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

    /** @returns {number} */
    eventId() {
        return this._eventId;
    }

    /** @returns {boolean} */
    isOnCurrentMap() {
        return this._mapId === $gameMap.mapId();
    }

    /** @returns {boolean} */
    setupReservedCommonEvent() {
        if ($gameTemp.isCommonEventReserved()) {
            const commonEvent = $gameTemp.retrieveCommonEvent();
            if (commonEvent) {
                this.setup(commonEvent.list);
                return true;
            }
        }
        return false;
    }

    /** @returns {boolean} */
    isRunning() {
        return !!this._list;
    }

    /** @returns {void} */
    update() {
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

    /** @returns {boolean} */
    updateChild() {
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

    /** @returns {boolean | null} */
    updateWait() {
        return this.updateWaitCount() || this.updateWaitMode();
    }

    /** @returns {boolean} */
    updateWaitCount() {
        if (this._waitCount > 0) {
            this._waitCount--;
            return true;
        }
        return false;
    }

    /** @returns {boolean | null} */
    updateWaitMode() {
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
                waiting = character && character.isMoveRouteForcing();
                break;
            case "animation":
                character = this.character(this._characterId);
                waiting = character && character.isAnimationPlaying();
                break;
            case "balloon":
                character = this.character(this._characterId);
                waiting = character && character.isBalloonPlaying();
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

    /**
     * @param {RMMZ.WaitMode} waitMode
     * @returns {void}
     */
    setWaitMode(waitMode) {
        this._waitMode = waitMode;
    }

    /**
     * @param {number} duration
     * @returns {void}
     */
    wait(duration) {
        this._waitCount = duration;
    }

    /** @returns {number} */
    fadeSpeed() {
        return 24;
    }

    /** @returns {boolean} */
    executeCommand() {
        const command = this.currentCommand();
        if (command) {
            this._indent = command.indent;
            const methodName = "command" + command.code;
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

    /** @returns {boolean} */
    checkFreeze() {
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

    /** @returns {void} */
    terminate() {
        this._list = null;
        this._comments = "";
    }

    /** @returns {void} */
    skipBranch() {
        while (this._list[this._index + 1].indent > this._indent) {
            this._index++;
        }
    }

    /**
     * @template {RMMZ.CommandCode} T
     * @returns {RMMZ.ExtractDataCommand<T>}
     */
    currentCommand() {
        return this._list[this._index];
    }

    /** @returns {0 | 1 | 16 | 2 | 3 | 4 | 5 | 113 | 115 | 12 | 15 | 20 | 30 | 128 | 8 | 7 | 6 | 10 | 9 | 24 | 40 | 32 | 26 | 13 | 17 | 18 | 27 | 33 | 34 | 37 | 38 | 39 | 45 | 102 | 104 | 14 | 36 | 11 | 21 | 22 | 23 | 31 | 35 | 41 | 42 | 43 | 44 | 19 | 25 | 28 | 29 | 101 | 401 | 402 | 403 | 103 | 105 | 405 | 108 | 408 | 109 | 111 | 411 | 112 | 413 | 117 | 118 | 119 | 121 | 122 | 123 | 124 | 125 | 126 | 127 | 129 | 132 | 133 | 134 | 135 | 136 | 137 | 138 | 139 | 140 | 201 | 202 | 203 | 204 | 205 | 505 | 206 | 211 | 212 | 213 | 214 | 216 | 217 | 221 | 222 | 223 | 224 | 225 | 230 | 231 | 232 | 233 | 234 | 235 | 236 | 241 | 242 | 243 | 244 | 245 | 246 | 249 | 250 | 251 | 261 | 281 | 282 | 283 | 284 | 285 | 301 | 601 | 602 | 603 | 302 | 605 | 303 | 311 | 312 | 326 | 313 | 314 | 315 | 316 | 317 | 318 | 319 | 320 | 321 | 322 | 323 | 324 | 325 | 331 | 332 | 342 | 333 | 334 | 335 | 336 | 337 | 339 | 340 | 351 | 352 | 353 | 354 | 355 | 655 | 356 | 357} */
    nextEventCode() {
        const command = this._list[this._index + 1];
        if (command) {
            return command.code;
        } else {
            return 0;
        }
    }

    /**
     * @param {RMMZ.ActorID} param
     * @param {(actor: Game_Actor) => void} callback
     * @returns {void}
     */
    iterateActorId(param, callback) {
        if (param === 0) {
            $gameParty.members().forEach(callback);
        } else {
            const actor = $gameActors.actor(param);
            if (actor) {
                callback(actor);
            }
        }
    }

    /**
     * @param {0 | 1} param1
     * @param {RMMZ.ActorID | RMMZ.VariableID} param2
     * @param {(actor: Game_Actor) => void} callback
     * @returns {void}
     */
    iterateActorEx(param1, param2, callback) {
        if (param1 === 0) {
            this.iterateActorId(param2, callback);
        } else {
            this.iterateActorId($gameVariables.value(param2), callback);
        }
    }

    /**
     * @param {number} param
     * @param {(actor: Game_Actor) => void} callback
     * @returns {void}
     */
    iterateActorIndex(param, callback) {
        if (param < 0) {
            $gameParty.members().forEach(callback);
        } else {
            const actor = $gameParty.members()[param];
            if (actor) {
                callback(actor);
            }
        }
    }

    /**
     * @param {number} param
     * @param {(enemy: Game_Enemy) => void} callback
     * @returns {void}
     */
    iterateEnemyIndex(param, callback) {
        if (param < 0) {
            $gameTroop.members().forEach(callback);
        } else {
            const enemy = $gameTroop.members()[param];
            if (enemy) {
                callback(enemy);
            }
        }
    }

    /**
     * @param {0 | 1} param1
     * @param {RMMZ.EnemyID | RMMZ.ActorID} param2
     * @param {(battler: RMMZ.ActionTarget) => void} callback
     * @returns {void}
     */
    iterateBattler(param1, param2, callback) {
        if ($gameParty.inBattle()) {
            if (param1 === 0) {
                this.iterateEnemyIndex(param2, callback);
            } else {
                this.iterateActorId(param2, callback);
            }
        }
    }

    /**
     * @param {RMMZ.CharacterID} param
     * @returns {Game_Character | null}
     */
    character(param) {
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
    /**
     * @param {RMMZ.ValueOperation} operation
     * @param {0 | 1} operandType
     * @param {number | RMMZ.VariableID} operand
     * @returns {number}
     */
    operateValue(
        operation, operandType, operand
    ) {
        const value = operandType === 0 ? operand : $gameVariables.value(operand);
        return operation === 0 ? value : -value;
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @param {number} value
     * @param {boolean} allowDeath
     * @returns {void}
     */
    changeHp(target, value, allowDeath) {
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
    /**
     * @param {RMMZ.CommandParams<101>} params
     * @returns {boolean}
     */
    command101(params) {
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
            $gameMessage.add(this.currentCommand().parameters[0]);
        }
        switch (this.nextEventCode()) {
            case 102: // Show Choices
                this._index++;
                this.setupChoices(this.currentCommand().parameters);
                break;
            case 103: // Input Number
                this._index++;
                this.setupNumInput(this.currentCommand().parameters);
                break;
            case 104: // Select Item
                this._index++;
                this.setupItemChoice(this.currentCommand().parameters);
                break;
        }
        this.setWaitMode("message");
        return true;
    }

    // Show Choices
    /**
     * @param {RMMZ.CommandParams<102>} params
     * @returns {boolean}
     */
    command102(params) {
        if ($gameMessage.isBusy()) {
            return false;
        }
        this.setupChoices(params);
        this.setWaitMode("message");
        return true;
    }

    /**
     * @param {RMMZ.CommandParams<102>} params
     * @returns {void}
     */
    setupChoices(params) {
        const choices = params[0].clone();
        const cancelType = params[1] < choices.length ? params[1] : -2;
        const defaultType = params.length > 2 ? params[2] : 0;
        const positionType = params.length > 3 ? params[3] : 2;
        const background = params.length > 4 ? params[4] : 0;
        $gameMessage.setChoices(choices, defaultType, cancelType);
        $gameMessage.setChoiceBackground(background);
        $gameMessage.setChoicePositionType(positionType);
        $gameMessage.setChoiceCallback(n => {
            this._branch[this._indent] = n;
        });
    }

    // When [**]
    /**
     * @param {RMMZ.CommandParams<402>} params
     * @returns {boolean}
     */
    command402(params) {
        if (this._branch[this._indent] !== params[0]) {
            this.skipBranch();
        }
        return true;
    }

    // When Cancel
    /** @returns {boolean} */
    command403() {
        if (this._branch[this._indent] >= 0) {
            this.skipBranch();
        }
        return true;
    }

    // Input Number
    /**
     * @param {RMMZ.CommandParams<103>} params
     * @returns {boolean}
     */
    command103(params) {
        if ($gameMessage.isBusy()) {
            return false;
        }
        this.setupNumInput(params);
        this.setWaitMode("message");
        return true;
    }

    /**
     * @param {RMMZ.CommandParams<103>} params
     * @returns {void}
     */
    setupNumInput(params) {
        $gameMessage.setNumberInput(params[0], params[1]);
    }

    // Select Item
    /**
     * @param {RMMZ.CommandParams<104>} params
     * @returns {boolean}
     */
    command104(params) {
        if ($gameMessage.isBusy()) {
            return false;
        }
        this.setupItemChoice(params);
        this.setWaitMode("message");
        return true;
    }

    /**
     * @param {RMMZ.CommandParams<104>} params
     * @returns {void}
     */
    setupItemChoice(params) {
        $gameMessage.setItemChoice(params[0], params[1] || 2);
    }

    // Show Scrolling Text
    /**
     * @param {RMMZ.CommandParams<105>} params
     * @returns {boolean}
     */
    command105(params) {
        if ($gameMessage.isBusy()) {
            return false;
        }
        $gameMessage.setScroll(params[0], params[1]);
        while (this.nextEventCode() === 405) {
            this._index++;
            $gameMessage.add(this.currentCommand().parameters[0]);
        }
        this.setWaitMode("message");
        return true;
    }

    // Comment
    /**
     * @param {RMMZ.CommandParams<108>} params
     * @returns {boolean}
     */
    command108(params) {
        this._comments = [params[0]];
        while (this.nextEventCode() === 408) {
            this._index++;
            this._comments.push(this.currentCommand().parameters[0]);
        }
        return true;
    }

    // Skip
    /** @returns {boolean} */
    command109() {
        this.skipBranch();
        return true;
    }

    // Conditional Branch
    /**
     * @param {RMMZ.CommandParams<111>} params
     * @returns {boolean}
     */
    command111(params) {
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
                    const key = [this._mapId, this._eventId, params[1]];
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
                            result = actor.isClass($dataClasses[n]);
                            break;
                        case 3: // Skill
                            result = actor.hasSkill(n);
                            break;
                        case 4: // Weapon
                            result = actor.hasWeapon($dataWeapons[n]);
                            break;
                        case 5: // Armor
                            result = actor.hasArmor($dataArmors[n]);
                            break;
                        case 6: // State
                            result = actor.isStateAffected(n);
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
                result = $gameParty.hasItem($dataItems[params[1]]);
                break;
            case 9: // Weapon
                result = $gameParty.hasItem($dataWeapons[params[1]], params[2]);
                break;
            case 10: // Armor
                result = $gameParty.hasItem($dataArmors[params[1]], params[2]);
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
    /** @returns {boolean} */
    command411() {
        if (this._branch[this._indent] !== false) {
            this.skipBranch();
        }
        return true;
    }

    // Loop
    /** @returns {boolean} */
    command112() {
        return true;
    }

    // Repeat Above
    /** @returns {boolean} */
    command413() {
        do {
            this._index--;
        } while (this.currentCommand().indent !== this._indent);
        return true;
    }

    // Break Loop
    /** @returns {boolean} */
    command113() {
        let depth = 0;
        while (this._index < this._list.length - 1) {
            this._index++;
            const command = this.currentCommand();
            if (command.code === 112) {
                depth++;
            }
            if (command.code === 413) {
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
    /** @returns {boolean} */
    command115() {
        this._index = this._list.length;
        return true;
    }

    // Common Event
    /**
     * @param {RMMZ.CommandParams<117>} params
     * @returns {boolean}
     */
    command117(params) {
        const commonEvent = $dataCommonEvents[params[0]];
        if (commonEvent) {
            const eventId = this.isOnCurrentMap() ? this._eventId : 0;
            this.setupChild(commonEvent.list, eventId);
        }
        return true;
    }

    /**
     * @param {RMMZ.DataCommand[]} list
     * @param {RMMZ.EventID} eventId
     * @returns {void}
     */
    setupChild(list, eventId) {
        this._childInterpreter = new Game_Interpreter(this._depth + 1);
        this._childInterpreter.setup(list, eventId);
    }

    // Label
    /** @returns {boolean} */
    command118() {
        return true;
    }

    // Jump to Label
    /**
     * @param {RMMZ.CommandParams<119>} params
     * @returns {boolean}
     */
    command119(params) {
        const labelName = params[0];
        for (let i = 0; i < this._list.length; i++) {
            const command = this._list[i];
            if (command.code === 118 && command.parameters[0] === labelName) {
                this.jumpTo(i);
                break;
            }
        }
        return true;
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    jumpTo(index) {
        const lastIndex = this._index;
        const startIndex = Math.min(index, lastIndex);
        const endIndex = Math.max(index, lastIndex);
        let indent = this._indent;
        for (let i = startIndex; i <= endIndex; i++) {
            const newIndent = this._list[i].indent;
            if (newIndent !== indent) {
                this._branch[indent] = null;
                indent = newIndent;
            }
        }
        this._index = index;
    }

    // Control Switches
    /**
     * @param {RMMZ.CommandParams<121>} params
     * @returns {boolean}
     */
    command121(params) {
        for (let i = params[0]; i <= params[1]; i++) {
            $gameSwitches.setValue(i, params[2] === 0);
        }
        return true;
    }

    // Control Variables
    /**
     * @param {RMMZ.CommandParams<122>} params
     * @returns {boolean}
     */
    command122(params) {
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

    /**
     * @param {number} type
     * @param {number} param1
     * @param {number} [param2]
     * @returns {number}
     */
    gameDataOperand(type, param1, param2) {
        let actor, enemy, character;
        switch (type) {
            case 0: // Item
                return $gameParty.numItems($dataItems[param1]);
            case 1: // Weapon
                return $gameParty.numItems($dataWeapons[param1]);
            case 2: // Armor
                return $gameParty.numItems($dataArmors[param1]);
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
                            if (param2 >= 4 && param2 <= 11) {
                                return actor.param(param2 - 4);
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
                            if (param2 >= 2 && param2 <= 9) {
                                return enemy.param(param2 - 2);
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
                return $gameTemp.lastActionData(param1);
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

    /**
     * @param {RMMZ.VariableID} variableId
     * @param {RMMZ.VariableOperationType} operationType
     * @param {number} value
     * @returns {void}
     */
    operateVariable(
        variableId,
        operationType,
        value
    ) {
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
        } catch (e) {
            $gameVariables.setValue(variableId, 0);
        }
    }

    // Control Self Switch
    /**
     * @param {RMMZ.CommandParams<123>} params
     * @returns {boolean}
     */
    command123(params) {
        if (this._eventId > 0) {
            const key = [this._mapId, this._eventId, params[0]];
            $gameSelfSwitches.setValue(key, params[1] === 0);
        }
        return true;
    }

    // Control Timer
    /**
     * @param {RMMZ.CommandParams<124>} params
     * @returns {boolean}
     */
    command124(params) {
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
    /**
     * @param {RMMZ.CommandParams<125>} params
     * @returns {boolean}
     */
    command125(params) {
        const value = this.operateValue(params[0], params[1], params[2]);
        $gameParty.gainGold(value);
        return true;
    }

    // Change Items
    /**
     * @param {RMMZ.CommandParams<126>} params
     * @returns {boolean}
     */
    command126(params) {
        const value = this.operateValue(params[1], params[2], params[3]);
        $gameParty.gainItem($dataItems[params[0]], value);
        return true;
    }

    // Change Weapons
    /**
     * @param {RMMZ.CommandParams<127>} params
     * @returns {boolean}
     */
    command127(params) {
        const value = this.operateValue(params[1], params[2], params[3]);
        $gameParty.gainItem($dataWeapons[params[0]], value, params[4]);
        return true;
    }

    // Change Armors
    /**
     * @param {RMMZ.CommandParams<128>} params
     * @returns {boolean}
     */
    command128(params) {
        const value = this.operateValue(params[1], params[2], params[3]);
        $gameParty.gainItem($dataArmors[params[0]], value, params[4]);
        return true;
    }

    // Change Party Member
    /**
     * @param {RMMZ.CommandParams<129>} params
     * @returns {boolean}
     */
    command129(params) {
        const actor = $gameActors.actor(params[0]);
        if (actor) {
            if (params[1] === 0) {
                // Add
                if (params[2]) {
                    // Initialize
                    $gameActors.actor(params[0]).setup(params[0]);
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
    /**
     * @param {RMMZ.CommandParams<132>} params
     * @returns {boolean}
     */
    command132(params) {
        $gameSystem.setBattleBgm(params[0]);
        return true;
    }

    // Change Victory ME
    /**
     * @param {RMMZ.CommandParams<133>} params
     * @returns {boolean}
     */
    command133(params) {
        $gameSystem.setVictoryMe(params[0]);
        return true;
    }

    // Change Save Access
    /**
     * @param {RMMZ.CommandParams<134>} params
     * @returns {boolean}
     */
    command134(params) {
        if (params[0] === 0) {
            $gameSystem.disableSave();
        } else {
            $gameSystem.enableSave();
        }
        return true;
    }

    // Change Menu Access
    /**
     * @param {RMMZ.CommandParams<135>} params
     * @returns {boolean}
     */
    command135(params) {
        if (params[0] === 0) {
            $gameSystem.disableMenu();
        } else {
            $gameSystem.enableMenu();
        }
        return true;
    }

    // Change Encounter
    /**
     * @param {RMMZ.CommandParams<136>} params
     * @returns {boolean}
     */
    command136(params) {
        if (params[0] === 0) {
            $gameSystem.disableEncounter();
        } else {
            $gameSystem.enableEncounter();
        }
        $gamePlayer.makeEncounterCount();
        return true;
    }

    // Change Formation Access
    /**
     * @param {RMMZ.CommandParams<137>} params
     * @returns {boolean}
     */
    command137(params) {
        if (params[0] === 0) {
            $gameSystem.disableFormation();
        } else {
            $gameSystem.enableFormation();
        }
        return true;
    }

    // Change Window Color
    /**
     * @param {RMMZ.CommandParams<138>} params
     * @returns {boolean}
     */
    command138(params) {
        $gameSystem.setWindowTone(params[0]);
        return true;
    }

    // Change Defeat ME
    /**
     * @param {RMMZ.CommandParams<139>} params
     * @returns {boolean}
     */
    command139(params) {
        $gameSystem.setDefeatMe(params[0]);
        return true;
    }

    // Change Vehicle BGM
    /**
     * @param {RMMZ.CommandParams<140>} params
     * @returns {boolean}
     */
    command140(params) {
        const vehicle = $gameMap.vehicle(params[0]);
        if (vehicle) {
            vehicle.setBgm(params[1]);
        }
        return true;
    }

    // Transfer Player
    /**
     * @param {RMMZ.CommandParams<201>} params
     * @returns {boolean}
     */
    command201(params) {
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
    /**
     * @param {RMMZ.CommandParams<202>} params
     * @returns {boolean}
     */
    command202(params) {
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
    /**
     * @param {RMMZ.CommandParams<203>} params
     * @returns {boolean}
     */
    command203(params) {
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
    /**
     * @param {RMMZ.CommandParams<204>} params
     * @returns {boolean}
     */
    command204(params) {
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
    /**
     * @param {RMMZ.CommandParams<205>} params
     * @returns {boolean}
     */
    command205(params) {
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
    /** @returns {boolean} */
    command206() {
        $gamePlayer.getOnOffVehicle();
        return true;
    }

    // Change Transparency
    /**
     * @param {RMMZ.CommandParams<211>} params
     * @returns {boolean}
     */
    command211(params) {
        $gamePlayer.setTransparent(params[0] === 0);
        return true;
    }

    // Show Animation
    /**
     * @param {RMMZ.CommandParams<212>} params
     * @returns {boolean}
     */
    command212(params) {
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
    /**
     * @param {RMMZ.CommandParams<213>} params
     * @returns {boolean}
     */
    command213(params) {
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
    /** @returns {boolean} */
    command214() {
        if (this.isOnCurrentMap() && this._eventId > 0) {
            $gameMap.eraseEvent(this._eventId);
        }
        return true;
    }

    // Change Player Followers
    /**
     * @param {RMMZ.CommandParams<216>} params
     * @returns {boolean}
     */
    command216(params) {
        if (params[0] === 0) {
            $gamePlayer.showFollowers();
        } else {
            $gamePlayer.hideFollowers();
        }
        $gamePlayer.refresh();
        return true;
    }

    // Gather Followers
    /** @returns {boolean} */
    command217() {
        if (!$gameParty.inBattle()) {
            $gamePlayer.gatherFollowers();
            this.setWaitMode("gather");
        }
        return true;
    }

    // Fadeout Screen
    /** @returns {boolean} */
    command221() {
        if ($gameMessage.isBusy()) {
            return false;
        }
        $gameScreen.startFadeOut(this.fadeSpeed());
        this.wait(this.fadeSpeed());
        return true;
    }

    // Fadein Screen
    /** @returns {boolean} */
    command222() {
        if ($gameMessage.isBusy()) {
            return false;
        }
        $gameScreen.startFadeIn(this.fadeSpeed());
        this.wait(this.fadeSpeed());
        return true;
    }

    // Tint Screen
    /**
     * @param {RMMZ.CommandParams<223>} params
     * @returns {boolean}
     */
    command223(params) {
        $gameScreen.startTint(params[0], params[1]);
        if (params[2]) {
            this.wait(params[1]);
        }
        return true;
    }

    // Flash Screen
    /**
     * @param {RMMZ.CommandParams<224>} params
     * @returns {boolean}
     */
    command224(params) {
        $gameScreen.startFlash(params[0], params[1]);
        if (params[2]) {
            this.wait(params[1]);
        }
        return true;
    }

    // Shake Screen
    /**
     * @param {RMMZ.CommandParams<225>} params
     * @returns {boolean}
     */
    command225(params) {
        $gameScreen.startShake(params[0], params[1], params[2]);
        if (params[3]) {
            this.wait(params[2]);
        }
        return true;
    }

    // Wait
    /**
     * @param {RMMZ.CommandParams<230>} params
     * @returns {boolean}
     */
    command230(params) {
        this.wait(params[0]);
        return true;
    }

    // Show Picture
    /**
     * @param {RMMZ.CommandParams<231>} params
     * @returns {boolean}
     */
    command231(params) {
        const point = this.picturePoint(params);
        // prettier-ignore
        $gameScreen.showPicture(
            params[0], params[1], params[2], point.x, point.y,
            params[6], params[7], params[8], params[9]
        );
        return true;
    }

    // Move Picture
    /**
     * @param {RMMZ.CommandParams<232>} params
     * @returns {boolean}
     */
    command232(params) {
        const point = this.picturePoint(params);
        // prettier-ignore
        $gameScreen.movePicture(
            params[0], params[2], point.x, point.y, params[6], params[7],
            params[8], params[9], params[10], params[12] || 0
        );
        if (params[11]) {
            this.wait(params[10]);
        }
        return true;
    }

    /**
     * @param {RMMZ.CommandParams<231 | 232>} params
     * @returns {Point}
     */
    picturePoint(params) {
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
    /**
     * @param {RMMZ.CommandParams<233>} params
     * @returns {boolean}
     */
    command233(params) {
        $gameScreen.rotatePicture(params[0], params[1]);
        return true;
    }

    // Tint Picture
    /**
     * @param {RMMZ.CommandParams<234>} params
     * @returns {boolean}
     */
    command234(params) {
        $gameScreen.tintPicture(params[0], params[1], params[2]);
        if (params[3]) {
            this.wait(params[2]);
        }
        return true;
    }

    // Erase Picture
    /**
     * @param {RMMZ.CommandParams<235>} params
     * @returns {boolean}
     */
    command235(params) {
        $gameScreen.erasePicture(params[0]);
        return true;
    }

    // Set Weather Effect
    /**
     * @param {RMMZ.CommandParams<236>} params
     * @returns {boolean}
     */
    command236(params) {
        if (!$gameParty.inBattle()) {
            $gameScreen.changeWeather(params[0], params[1], params[2]);
            if (params[3]) {
                this.wait(params[2]);
            }
        }
        return true;
    }

    // Play BGM
    /**
     * @param {RMMZ.CommandParams<241>} params
     * @returns {boolean}
     */
    command241(params) {
        AudioManager.playBgm(params[0]);
        return true;
    }

    // Fadeout BGM
    /**
     * @param {RMMZ.CommandParams<242>} params
     * @returns {boolean}
     */
    command242(params) {
        AudioManager.fadeOutBgm(params[0]);
        return true;
    }

    // Save BGM
    /** @returns {boolean} */
    command243() {
        $gameSystem.saveBgm();
        return true;
    }

    // Resume BGM
    /** @returns {boolean} */
    command244() {
        $gameSystem.replayBgm();
        return true;
    }

    // Play BGS
    /**
     * @param {RMMZ.CommandParams<245>} params
     * @returns {boolean}
     */
    command245(params) {
        AudioManager.playBgs(params[0]);
        return true;
    }

    // Fadeout BGS
    /**
     * @param {RMMZ.CommandParams<246>} params
     * @returns {boolean}
     */
    command246(params) {
        AudioManager.fadeOutBgs(params[0]);
        return true;
    }

    // Play ME
    /**
     * @param {RMMZ.CommandParams<249>} params
     * @returns {boolean}
     */
    command249(params) {
        AudioManager.playMe(params[0]);
        return true;
    }

    // Play SE
    /**
     * @param {RMMZ.CommandParams<250>} params
     * @returns {boolean}
     */
    command250(params) {
        AudioManager.playSe(params[0]);
        return true;
    }

    // Stop SE
    /** @returns {boolean} */
    command251() {
        AudioManager.stopSe();
        return true;
    }

    // Play Movie
    /**
     * @param {RMMZ.CommandParams<261>} params
     * @returns {boolean}
     */
    command261(params) {
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

    /** @returns {".webm" | ".mp4"} */
    videoFileExt() {
        if (Utils.canPlayWebm()) {
            return ".webm";
        } else {
            return ".mp4";
        }
    }

    // Change Map Name Display
    /**
     * @param {RMMZ.CommandParams<281>} params
     * @returns {boolean}
     */
    command281(params) {
        if (params[0] === 0) {
            $gameMap.enableNameDisplay();
        } else {
            $gameMap.disableNameDisplay();
        }
        return true;
    }

    // Change Tileset
    /**
     * @param {RMMZ.CommandParams<282>} params
     * @returns {boolean}
     */
    command282(params) {
        const tileset = $dataTilesets[params[0]];
        const allReady = tileset.tilesetNames
            .map(tilesetName => ImageManager.loadTileset(tilesetName))
            .every(bitmap => bitmap.isReady());
        if (allReady) {
            $gameMap.changeTileset(params[0]);
            return true;
        } else {
            return false;
        }
    }

    // Change Battle Background
    /**
     * @param {RMMZ.CommandParams<283>} params
     * @returns {boolean}
     */
    command283(params) {
        $gameMap.changeBattleback(params[0], params[1]);
        return true;
    }

    // Change Parallax
    /**
     * @param {RMMZ.CommandParams<284>} params
     * @returns {boolean}
     */
    command284(params) {
        // prettier-ignore
        $gameMap.changeParallax(
            params[0], params[1], params[2], params[3], params[4]
        );
        return true;
    }

    // Get Location Info
    /**
     * @param {RMMZ.CommandParams<285>} params
     * @returns {boolean}
     */
    command285(params) {
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
            x = character.x;
            y = character.y;
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
    /**
     * @param {RMMZ.CommandParams<301>} params
     * @returns {boolean}
     */
    command301(params) {
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
                BattleManager.setEventCallback(n => {
                    this._branch[this._indent] = n;
                });
                $gamePlayer.makeEncounterCount();
                SceneManager.push(Scene_Battle);
            }
        }
        return true;
    }

    // If Win
    /** @returns {boolean} */
    command601() {
        if (this._branch[this._indent] !== 0) {
            this.skipBranch();
        }
        return true;
    }

    // If Escape
    /** @returns {boolean} */
    command602() {
        if (this._branch[this._indent] !== 1) {
            this.skipBranch();
        }
        return true;
    }

    // If Lose
    /** @returns {boolean} */
    command603() {
        if (this._branch[this._indent] !== 2) {
            this.skipBranch();
        }
        return true;
    }

    // Shop Processing
    /**
     * @param {RMMZ.CommandParams<302>} params
     * @returns {boolean}
     */
    command302(params) {
        if (!$gameParty.inBattle()) {
            const goods = [params];
            while (this.nextEventCode() === 605) {
                this._index++;
                goods.push(this.currentCommand().parameters);
            }
            SceneManager.push(Scene_Shop);
            SceneManager.prepareNextScene(goods, params[4]);
        }
        return true;
    }

    // Name Input Processing
    /**
     * @param {RMMZ.CommandParams<303>} params
     * @returns {boolean}
     */
    command303(params) {
        if (!$gameParty.inBattle()) {
            if ($dataActors[params[0]]) {
                SceneManager.push(Scene_Name);
                SceneManager.prepareNextScene(params[0], params[1]);
            }
        }
        return true;
    }

    // Change HP
    /**
     * @param {RMMZ.CommandParams<311>} params
     * @returns {boolean}
     */
    command311(params) {
        const value = this.operateValue(params[2], params[3], params[4]);
        this.iterateActorEx(params[0], params[1], actor => {
            this.changeHp(actor, value, params[5]);
        });
        return true;
    }

    // Change MP
    /**
     * @param {RMMZ.CommandParams<312>} params
     * @returns {boolean}
     */
    command312(params) {
        const value = this.operateValue(params[2], params[3], params[4]);
        this.iterateActorEx(params[0], params[1], actor => {
            actor.gainMp(value);
        });
        return true;
    }

    // Change TP
    /**
     * @param {RMMZ.CommandParams<326>} params
     * @returns {boolean}
     */
    command326(params) {
        const value = this.operateValue(params[2], params[3], params[4]);
        this.iterateActorEx(params[0], params[1], actor => {
            actor.gainTp(value);
        });
        return true;
    }

    // Change State
    /**
     * @param {RMMZ.CommandParams<313>} params
     * @returns {boolean}
     */
    command313(params) {
        this.iterateActorEx(params[0], params[1], actor => {
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
    /**
     * @param {RMMZ.CommandParams<314>} params
     * @returns {boolean}
     */
    command314(params) {
        this.iterateActorEx(params[0], params[1], actor => {
            actor.recoverAll();
        });
        return true;
    }

    // Change EXP
    /**
     * @param {RMMZ.CommandParams<315>} params
     * @returns {boolean}
     */
    command315(params) {
        const value = this.operateValue(params[2], params[3], params[4]);
        this.iterateActorEx(params[0], params[1], actor => {
            actor.changeExp(actor.currentExp() + value, params[5]);
        });
        return true;
    }

    // Change Level
    /**
     * @param {RMMZ.CommandParams<316>} params
     * @returns {boolean}
     */
    command316(params) {
        const value = this.operateValue(params[2], params[3], params[4]);
        this.iterateActorEx(params[0], params[1], actor => {
            actor.changeLevel(actor.level + value, params[5]);
        });
        return true;
    }

    // Change Parameter
    /**
     * @param {RMMZ.CommandParams<317>} params
     * @returns {boolean}
     */
    command317(params) {
        const value = this.operateValue(params[3], params[4], params[5]);
        this.iterateActorEx(params[0], params[1], actor => {
            actor.addParam(params[2], value);
        });
        return true;
    }

    // Change Skill
    /**
     * @param {RMMZ.CommandParams<318>} params
     * @returns {boolean}
     */
    command318(params) {
        this.iterateActorEx(params[0], params[1], actor => {
            if (params[2] === 0) {
                actor.learnSkill(params[3]);
            } else {
                actor.forgetSkill(params[3]);
            }
        });
        return true;
    }

    // Change Equipment
    /**
     * @param {RMMZ.CommandParams<319>} params
     * @returns {boolean}
     */
    command319(params) {
        const actor = $gameActors.actor(params[0]);
        if (actor) {
            actor.changeEquipById(params[1], params[2]);
        }
        return true;
    }

    // Change Name
    /**
     * @param {RMMZ.CommandParams<320>} params
     * @returns {boolean}
     */
    command320(params) {
        const actor = $gameActors.actor(params[0]);
        if (actor) {
            actor.setName(params[1]);
        }
        return true;
    }

    // Change Class
    /**
     * @param {RMMZ.CommandParams<321>} params
     * @returns {boolean}
     */
    command321(params) {
        const actor = $gameActors.actor(params[0]);
        if (actor && $dataClasses[params[1]]) {
            actor.changeClass(params[1], params[2]);
        }
        return true;
    }

    // Change Actor Images
    /**
     * @param {RMMZ.CommandParams<322>} params
     * @returns {boolean}
     */
    command322(params) {
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
    /**
     * @param {RMMZ.CommandParams<323>} params
     * @returns {boolean}
     */
    command323(params) {
        const vehicle = $gameMap.vehicle(params[0]);
        if (vehicle) {
            vehicle.setImage(params[1], params[2]);
        }
        return true;
    }

    // Change Nickname
    /**
     * @param {RMMZ.CommandParams<324>} params
     * @returns {boolean}
     */
    command324(params) {
        const actor = $gameActors.actor(params[0]);
        if (actor) {
            actor.setNickname(params[1]);
        }
        return true;
    }

    // Change Profile
    /**
     * @param {RMMZ.CommandParams<325>} params
     * @returns {boolean}
     */
    command325(params) {
        const actor = $gameActors.actor(params[0]);
        if (actor) {
            actor.setProfile(params[1]);
        }
        return true;
    }

    // Change Enemy HP
    /**
     * @param {RMMZ.CommandParams<331>} params
     * @returns {boolean}
     */
    command331(params) {
        const value = this.operateValue(params[1], params[2], params[3]);
        this.iterateEnemyIndex(params[0], enemy => {
            this.changeHp(enemy, value, params[4]);
        });
        return true;
    }

    // Change Enemy MP
    /**
     * @param {RMMZ.CommandParams<332>} params
     * @returns {boolean}
     */
    command332(params) {
        const value = this.operateValue(params[1], params[2], params[3]);
        this.iterateEnemyIndex(params[0], enemy => {
            enemy.gainMp(value);
        });
        return true;
    }

    // Change Enemy TP
    /**
     * @param {RMMZ.CommandParams<342>} params
     * @returns {boolean}
     */
    command342(params) {
        const value = this.operateValue(params[1], params[2], params[3]);
        this.iterateEnemyIndex(params[0], enemy => {
            enemy.gainTp(value);
        });
        return true;
    }

    // Change Enemy State
    /**
     * @param {RMMZ.CommandParams<333>} params
     * @returns {boolean}
     */
    command333(params) {
        this.iterateEnemyIndex(params[0], enemy => {
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
    /**
     * @param {RMMZ.CommandParams<334>} params
     * @returns {boolean}
     */
    command334(params) {
        this.iterateEnemyIndex(params[0], enemy => {
            enemy.recoverAll();
        });
        return true;
    }

    // Enemy Appear
    /**
     * @param {RMMZ.CommandParams<335>} params
     * @returns {boolean}
     */
    command335(params) {
        this.iterateEnemyIndex(params[0], enemy => {
            enemy.appear();
            $gameTroop.makeUniqueNames();
        });
        return true;
    }

    // Enemy Transform
    /**
     * @param {RMMZ.CommandParams<336>} params
     * @returns {boolean}
     */
    command336(params) {
        this.iterateEnemyIndex(params[0], enemy => {
            enemy.transform(params[1]);
            $gameTroop.makeUniqueNames();
        });
        return true;
    }

    // Show Battle Animation
    /**
     * @param {RMMZ.CommandParams<337>} params
     * @returns {boolean}
     */
    command337(params) {
        let param = params[0];
        if (params[2]) {
            param = -1;
        }
        const targets = [];
        this.iterateEnemyIndex(param, enemy => {
            if (enemy.isAlive()) {
                targets.push(enemy);
            }
        });
        $gameTemp.requestAnimation(targets, params[1]);
        return true;
    }

    // Force Action
    /**
     * @param {RMMZ.CommandParams<339>} params
     * @returns {boolean}
     */
    command339(params) {
        this.iterateBattler(params[0], params[1], battler => {
            if (!battler.isDeathStateAffected()) {
                battler.forceAction(params[2], params[3]);
                BattleManager.forceAction(battler);
                this.setWaitMode("action");
            }
        });
        return true;
    }

    // Abort Battle
    /** @returns {boolean} */
    command340() {
        BattleManager.abort();
        return true;
    }

    // Open Menu Screen
    /** @returns {boolean} */
    command351() {
        if (!$gameParty.inBattle()) {
            SceneManager.push(Scene_Menu);
            Window_MenuCommand.initCommandPosition();
        }
        return true;
    }

    // Open Save Screen
    /** @returns {boolean} */
    command352() {
        if (!$gameParty.inBattle()) {
            SceneManager.push(Scene_Save);
        }
        return true;
    }

    // Game Over
    /** @returns {boolean} */
    command353() {
        SceneManager.goto(Scene_Gameover);
        return true;
    }

    // Return to Title Screen
    /** @returns {boolean} */
    command354() {
        SceneManager.goto(Scene_Title);
        return true;
    }

    // Script
    /** @returns {boolean} */
    command355() {
        let script = this.currentCommand().parameters[0] + "\n";
        while (this.nextEventCode() === 655) {
            this._index++;
            script += this.currentCommand().parameters[0] + "\n";
        }
        eval(script);
        return true;
    }

    // Plugin Command MV (deprecated)
    /**
     * @param {RMMZ.CommandParams<356>} params
     * @returns {boolean}
     */
    command356(params) {
        const args = params[0].split(" ");
        const command = args.shift();
        this.pluginCommand(command, args);
        return true;
    }

    pluginCommand() {
        // deprecated
    }

    // Plugin Command
    /**
     * @param {RMMZ.CommandParams<357>} params
     * @returns {boolean}
     */
    command357(params) {
        const pluginName = Utils.extractFileName(params[0]);
        PluginManager.callCommand(this, pluginName, params[1], params[3]);
        return true;
    }
}

// Class declarations are lexical bindings, while plugins and JsonEx resolve
// constructors through the global object, so expose them as global properties.
Object.assign(globalThis, {
    Game_Temp,
    Game_System,
    Game_Timer,
    Game_Message,
    Game_Switches,
    Game_Variables,
    Game_SelfSwitches,
    Game_Screen,
    Game_Picture,
    Game_Item,
    Game_Action,
    Game_ActionResult,
    Game_BattlerBase,
    Game_Battler,
    Game_Actor,
    Game_Enemy,
    Game_Actors,
    Game_Unit,
    Game_Party,
    Game_Troop,
    Game_Map,
    Game_CommonEvent,
    Game_CharacterBase,
    Game_Character,
    Game_Player,
    Game_Follower,
    Game_Followers,
    Game_Vehicle,
    Game_Event,
    Game_Interpreter,
});
