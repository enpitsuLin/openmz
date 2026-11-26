// rmmz_managers.js v2.0.0

/**
 * The static class that manages the database and game objects.
 */
class DataManager {
    constructor() {
        throw new Error("This is a static class");
    }

    /** @type {RMMZ.DataGlobalInfo | null} */
    static _globalInfo = null;

    /** @type {{ name: string; src: string; url: string; }[]} */
    static _errors = [];

    /** @type {readonly [ { readonly name: "$dataActors"; readonly src: "Actors.json"; }, { readonly name: "$dataClasses"; readonly src: "Classes.json"; }, { readonly name: "$dataSkills"; readonly src: "Skills.json"; }, { readonly name: "$dataItems"; readonly src: "Items.json"; }, { readonly name: "$dataWeapons"; readonly src: "Weapons.json"; }, { readonly name: "$dataArmors"; readonly src: "Armors.json"; }, { readonly name: "$dataEnemies"; readonly src: "Enemies.json"; }, { readonly name: "$dataTroops"; readonly src: "Troops.json"; }, { readonly name: "$dataStates"; readonly src: "States.json"; }, { readonly name: "$dataAnimations"; readonly src: "Animations.json"; }, { readonly name: "$dataTilesets"; readonly src: "Tilesets.json"; }, { readonly name: "$dataCommonEvents"; readonly src: "CommonEvents.json"; }, { readonly name: "$dataSystem"; readonly src: "System.json"; }, { readonly name: "$dataMapInfos"; readonly src: "MapInfos.json"; } ]} */
    static _databaseFiles = [
        { name: "$dataActors", src: "Actors.json" },
        { name: "$dataClasses", src: "Classes.json" },
        { name: "$dataSkills", src: "Skills.json" },
        { name: "$dataItems", src: "Items.json" },
        { name: "$dataWeapons", src: "Weapons.json" },
        { name: "$dataArmors", src: "Armors.json" },
        { name: "$dataEnemies", src: "Enemies.json" },
        { name: "$dataTroops", src: "Troops.json" },
        { name: "$dataStates", src: "States.json" },
        { name: "$dataAnimations", src: "Animations.json" },
        { name: "$dataTilesets", src: "Tilesets.json" },
        { name: "$dataCommonEvents", src: "CommonEvents.json" },
        { name: "$dataSystem", src: "System.json" },
        { name: "$dataMapInfos", src: "MapInfos.json" }
    ];

    /** @returns {Promise<0 | undefined>} */
    static loadGlobalInfo() {
        StorageManager.loadObject("global")
            .then(globalInfo => {
                this._globalInfo = globalInfo;
                this.removeInvalidGlobalInfo();
                return 0;
            })
            .catch(() => {
                this._globalInfo = [];
            });
    }

    /** @returns {void} */
    static removeInvalidGlobalInfo() {
        const globalInfo = this._globalInfo;
        for (const info of globalInfo) {
            const savefileId = globalInfo.indexOf(info);
            if (!this.savefileExists(savefileId)) {
                delete globalInfo[savefileId];
            }
        }
    }

    /** @returns {void} */
    static saveGlobalInfo() {
        StorageManager.saveObject("global", this._globalInfo);
    }

    /** @returns {boolean} */
    static isGlobalInfoLoaded() {
        return !!this._globalInfo;
    }

    /** @returns {void} */
    static loadDatabase() {
        const test = this.isBattleTest() || this.isEventTest();
        const prefix = test ? "Test_" : "";
        for (const databaseFile of this._databaseFiles) {
            this.loadDataFile(databaseFile.name, prefix + databaseFile.src);
        }
        if (this.isEventTest()) {
            this.loadDataFile("$testEvent", prefix + "Event.json");
        }
    }

    /**
     * @param {string} name
     * @param {string} src
     * @returns {void}
     */
    static loadDataFile(name, src) {
        const xhr = new XMLHttpRequest();
        const url = "data/" + src;
        window[name] = null;
        xhr.open("GET", url);
        xhr.overrideMimeType("application/json");
        xhr.onload = () => this.onXhrLoad(xhr, name, src, url);
        xhr.onerror = () => this.onXhrError(name, src, url);
        xhr.send();
    }

    /**
     * @param {XMLHttpRequest} xhr
     * @param {string} name
     * @param {string} src
     * @param {string} url
     * @returns {void}
     */
    static onXhrLoad(xhr, name, src, url) {
        if (xhr.status < 400) {
            window[name] = JSON.parse(xhr.responseText);
            this.onLoad(window[name]);
        } else {
            this.onXhrError(name, src, url);
        }
    }

    /**
     * @param {string} name
     * @param {string} src
     * @param {string} url
     * @returns {void}
     */
    static onXhrError(name, src, url) {
        const error = { name: name, src: src, url: url };
        this._errors.push(error);
    }

    /** @returns {boolean} */
    static isDatabaseLoaded() {
        this.checkError();
        for (const databaseFile of this._databaseFiles) {
            if (!window[databaseFile.name]) {
                return false;
            }
        }
        return true;
    }

    /**
     * @param {number} mapId
     * @returns {void}
     */
    static loadMapData(mapId) {
        if (mapId > 0) {
            const filename = "Map%1.json".format(mapId.padZero(3));
            this.loadDataFile("$dataMap", filename);
        } else {
            this.makeEmptyMap();
        }
    }

    /** @returns {void} */
    static makeEmptyMap() {
        $dataMap = {};
        $dataMap.data = [];
        $dataMap.events = [];
        $dataMap.width = 100;
        $dataMap.height = 100;
        $dataMap.scrollType = 3;
    }

    /** @returns {boolean} */
    static isMapLoaded() {
        this.checkError();
        return !!$dataMap;
    }

    /**
     * @param {unknown} object
     * @returns {void}
     */
    static onLoad(object) {
        if (this.isMapObject(object)) {
            this.extractMetadata(object);
            this.extractArrayMetadata(object.events);
        } else {
            this.extractArrayMetadata(object);
        }
    }

    /**
     * @param {unknown} object
     * @returns {object is RMMZ.DataMap}
     */
    static isMapObject(object) {
        return !!(object.data && object.events);
    }

    /**
     * @param {unknown} array
     * @returns {void}
     */
    static extractArrayMetadata(array) {
        if (Array.isArray(array)) {
            for (const data of array) {
                if (data && "note" in data) {
                    this.extractMetadata(data);
                }
            }
        }
    }

    /**
     * @param {{ note: string; meta?: RMMZ.Meta; }} data
     * @returns {void}
     */
    static extractMetadata(data) {
        const regExp = /<([^<>:]+)(:?)([^>]*)>/g;
        data.meta = {};
        for (;;) {
            const match = regExp.exec(data.note);
            if (match) {
                if (match[2] === ":") {
                    data.meta[match[1]] = match[3];
                } else {
                    data.meta[match[1]] = true;
                }
            } else {
                break;
            }
        }
    }

    /** @returns {void} */
    static checkError() {
        if (this._errors.length > 0) {
            const error = this._errors.shift();
            const retry = () => {
                this.loadDataFile(error.name, error.src);
            };
            throw ["LoadError", error.url, retry];
        }
    }

    /** @returns {boolean} */
    static isBattleTest() {
        return Utils.isOptionValid("btest");
    }

    /** @returns {boolean} */
    static isEventTest() {
        return Utils.isOptionValid("etest");
    }

    /** @returns {boolean} */
    static isTitleSkip() {
        return Utils.isOptionValid("tskip");
    }

    /**
     * @param {unknown} item
     * @returns {item is RMMZ.DataSkill}
     */
    static isSkill(item) {
        return item && $dataSkills.includes(item);
    }

    /**
     * @param {unknown} item
     * @returns {item is RMMZ.DataItem}
     */
    static isItem(item) {
        return item && $dataItems.includes(item);
    }

    /**
     * @param {unknown} item
     * @returns {item is RMMZ.DataWeapon}
     */
    static isWeapon(item) {
        return item && $dataWeapons.includes(item);
    }

    /**
     * @param {unknown} item
     * @returns {item is RMMZ.DataArmor}
     */
    static isArmor(item) {
        return item && $dataArmors.includes(item);
    }

    /** @returns {void} */
    static createGameObjects() {
        $gameTemp = new Game_Temp();
        $gameSystem = new Game_System();
        $gameScreen = new Game_Screen();
        $gameTimer = new Game_Timer();
        $gameMessage = new Game_Message();
        $gameSwitches = new Game_Switches();
        $gameVariables = new Game_Variables();
        $gameSelfSwitches = new Game_SelfSwitches();
        $gameActors = new Game_Actors();
        $gameParty = new Game_Party();
        $gameTroop = new Game_Troop();
        $gameMap = new Game_Map();
        $gamePlayer = new Game_Player();
    }

    /** @returns {void} */
    static setupNewGame() {
        this.createGameObjects();
        this.selectSavefileForNewGame();
        $gameParty.setupStartingMembers();
        $gamePlayer.setupForNewGame();
        Graphics.frameCount = 0;
    }

    /** @returns {void} */
    static setupBattleTest() {
        this.createGameObjects();
        $gameParty.setupBattleTest();
        BattleManager.setup($dataSystem.testTroopId, true, false);
        BattleManager.setBattleTest(true);
        BattleManager.playBattleBgm();
    }

    /** @returns {void} */
    static setupEventTest() {
        this.createGameObjects();
        this.selectSavefileForNewGame();
        $gameParty.setupStartingMembers();
        $gamePlayer.reserveTransfer(-1, 8, 6);
        $gamePlayer.setTransparent(false);
    }

    /** @returns {boolean} */
    static isAnySavefileExists() {
        return this._globalInfo.some(x => x);
    }

    /** @returns {number} */
    static latestSavefileId() {
        const globalInfo = this._globalInfo;
        const validInfo = globalInfo.slice(1).filter(x => x);
        const latest = Math.max(...validInfo.map(x => x.timestamp));
        const index = globalInfo.findIndex(x => x && x.timestamp === latest);
        return index > 0 ? index : 0;
    }

    /** @returns {number} */
    static earliestSavefileId() {
        const globalInfo = this._globalInfo;
        const validInfo = globalInfo.slice(1).filter(x => x);
        const earliest = Math.min(...validInfo.map(x => x.timestamp));
        const index = globalInfo.findIndex(x => x && x.timestamp === earliest);
        return index > 0 ? index : 0;
    }

    /** @returns {number} */
    static emptySavefileId() {
        const globalInfo = this._globalInfo;
        const maxSavefiles = this.maxSavefiles();
        if (globalInfo.length < maxSavefiles) {
            return Math.max(1, globalInfo.length);
        } else {
            const index = globalInfo.slice(1).findIndex(x => !x);
            return index >= 0 ? index + 1 : -1;
        }
    }

    /** @returns {void} */
    static loadAllSavefileImages() {
        for (const info of this._globalInfo.filter(x => x)) {
            this.loadSavefileImages(info);
        }
    }

    /**
     * @param {RMMZ.DataSaveInfo} info
     * @returns {void}
     */
    static loadSavefileImages(info) {
        if (info.characters && Symbol.iterator in info.characters) {
            for (const character of info.characters) {
                ImageManager.loadCharacter(character[0]);
            }
        }
        if (info.faces && Symbol.iterator in info.faces) {
            for (const face of info.faces) {
                ImageManager.loadFace(face[0]);
            }
        }
    }

    /** @returns {number} */
    static maxSavefiles() {
        return 20;
    }

    /**
     * @param {number} savefileId
     * @returns {RMMZ.DataSaveInfo | null | undefined}
     */
    static savefileInfo(savefileId) {
        const globalInfo = this._globalInfo;
        return globalInfo[savefileId] ? globalInfo[savefileId] : null;
    }

    /**
     * @param {number} savefileId
     * @returns {boolean}
     */
    static savefileExists(savefileId) {
        const saveName = this.makeSavename(savefileId);
        return StorageManager.exists(saveName);
    }

    /**
     * @param {number} savefileId
     * @returns {Promise<number>}
     */
    static saveGame(savefileId) {
        const contents = this.makeSaveContents();
        const saveName = this.makeSavename(savefileId);
        return StorageManager.saveObject(saveName, contents).then(() => {
            this._globalInfo[savefileId] = this.makeSavefileInfo();
            this.saveGlobalInfo();
            return 0;
        });
    }

    /**
     * @param {number} savefileId
     * @returns {Promise<number>}
     */
    static loadGame(savefileId) {
        const saveName = this.makeSavename(savefileId);
        return StorageManager.loadObject(saveName).then(contents => {
            this.createGameObjects();
            this.extractSaveContents(contents);
            this.correctDataErrors();
            return 0;
        });
    }

    /**
     * @param {number} savefileId
     * @returns {string}
     */
    static makeSavename(savefileId) {
        return "file%1".format(savefileId);
    }

    /** @returns {void} */
    static selectSavefileForNewGame() {
        const emptySavefileId = this.emptySavefileId();
        const earliestSavefileId = this.earliestSavefileId();
        if (emptySavefileId > 0) {
            $gameSystem.setSavefileId(emptySavefileId);
        } else {
            $gameSystem.setSavefileId(earliestSavefileId);
        }
    }

    /** @returns {RMMZ.DataSaveInfo} */
    static makeSavefileInfo() {
        const info = {};
        info.title = $dataSystem.gameTitle;
        info.characters = $gameParty.charactersForSavefile();
        info.faces = $gameParty.facesForSavefile();
        info.playtime = $gameSystem.playtimeText();
        info.timestamp = Date.now();
        return info;
    }

    /** @returns {RMMZ.SaveContents} */
    static makeSaveContents() {
        // A save data does not contain $gameTemp, $gameMessage, and $gameTroop.
        const contents = {};
        contents.system = $gameSystem;
        contents.screen = $gameScreen;
        contents.timer = $gameTimer;
        contents.switches = $gameSwitches;
        contents.variables = $gameVariables;
        contents.selfSwitches = $gameSelfSwitches;
        contents.actors = $gameActors;
        contents.party = $gameParty;
        contents.map = $gameMap;
        contents.player = $gamePlayer;
        return contents;
    }

    /**
     * @param {RMMZ.SaveContents} contents
     * @returns {void}
     */
    static extractSaveContents(contents) {
        $gameSystem = contents.system;
        $gameScreen = contents.screen;
        $gameTimer = contents.timer;
        $gameSwitches = contents.switches;
        $gameVariables = contents.variables;
        $gameSelfSwitches = contents.selfSwitches;
        $gameActors = contents.actors;
        $gameParty = contents.party;
        $gameMap = contents.map;
        $gamePlayer = contents.player;
    }

    /** @returns {void} */
    static correctDataErrors() {
        $gameParty.removeInvalidMembers();
    }
}

$dataActors = null;
$dataClasses = null;
$dataSkills = null;
$dataItems = null;
$dataWeapons = null;
$dataArmors = null;
$dataEnemies = null;
$dataTroops = null;
$dataStates = null;
$dataAnimations = null;
$dataTilesets = null;
$dataCommonEvents = null;
$dataSystem = null;
$dataMapInfos = null;
$dataMap = null;
$gameTemp = null;
$gameSystem = null;
$gameScreen = null;
$gameTimer = null;
$gameMessage = null;
$gameSwitches = null;
$gameVariables = null;
$gameSelfSwitches = null;
$gameActors = null;
$gameParty = null;
$gameTroop = null;
$gameMap = null;
$gamePlayer = null;
$testEvent = null;

/**
 * The static class that manages the configuration data.
 */
class ConfigManager {
    constructor() {
        throw new Error("This is a static class");
    }

    /** @type {boolean} */
    static alwaysDash = false;

    /** @type {boolean} */
    static commandRemember = false;

    /** @type {boolean} */
    static touchUI = true;

    /** @type {boolean} */
    static _isLoaded = false;

    /** @type {number} */
    static get bgmVolume() {
        return AudioManager._bgmVolume;
    }
    /** @param {number} value */
    static set bgmVolume(value) {
        AudioManager.bgmVolume = value;
    }

    /** @type {number} */
    static get bgsVolume() {
        return AudioManager.bgsVolume;
    }
    /** @param {number} value */
    static set bgsVolume(value) {
        AudioManager.bgsVolume = value;
    }

    /** @type {number} */
    static get meVolume() {
        return AudioManager.meVolume;
    }
    /** @param {number} value */
    static set meVolume(value) {
        AudioManager.meVolume = value;
    }

    /** @type {number} */
    static get seVolume() {
        return AudioManager.seVolume;
    }
    /** @param {number} value */
    static set seVolume(value) {
        AudioManager.seVolume = value;
    }

    /** @returns {Promise<number>} */
    static load() {
        StorageManager.loadObject("config")
            .then(config => this.applyData(config || {}))
            .catch(() => 0)
            .then(() => {
                this._isLoaded = true;
                return 0;
            })
            .catch(() => 0);
    }

    /** @returns {void} */
    static save() {
        StorageManager.saveObject("config", this.makeData());
    }

    /** @returns {boolean} */
    static isLoaded() {
        return this._isLoaded;
    }

    /** @returns {RMMZ.DataConfig} */
    static makeData() {
        const config = {};
        config.alwaysDash = this.alwaysDash;
        config.commandRemember = this.commandRemember;
        config.touchUI = this.touchUI;
        config.bgmVolume = this.bgmVolume;
        config.bgsVolume = this.bgsVolume;
        config.meVolume = this.meVolume;
        config.seVolume = this.seVolume;
        return config;
    }

    /**
     * @param {Partial<RMMZ.DataConfig>} config
     * @returns {void}
     */
    static applyData(config) {
        this.alwaysDash = this.readFlag(config, "alwaysDash", false);
        this.commandRemember = this.readFlag(config, "commandRemember", false);
        this.touchUI = this.readFlag(config, "touchUI", true);
        this.bgmVolume = this.readVolume(config, "bgmVolume");
        this.bgsVolume = this.readVolume(config, "bgsVolume");
        this.meVolume = this.readVolume(config, "meVolume");
        this.seVolume = this.readVolume(config, "seVolume");
    }

    /**
     * @param {Partial<RMMZ.DataConfig>} config
     * @param {keyof RMMZ.DataConfig} name
     * @param {boolean} defaultValue
     * @returns {boolean}
     */
    static readFlag(config, name, defaultValue) {
        if (name in config) {
            return !!config[name];
        } else {
            return defaultValue;
        }
    }

    /**
     * @param {Partial<RMMZ.DataConfig>} config
     * @param {keyof RMMZ.DataConfig} name
     * @returns {number}
     */
    static readVolume(config, name) {
        if (name in config) {
            return Number(config[name]).clamp(0, 100);
        } else {
            return 100;
        }
    }
}

/**
 * The static class that manages storage for saving game data.
 */
class StorageManager {
    constructor() {
        throw new Error("This is a static class");
    }

    /** @type {string[]} */
    static _forageKeys = [];

    /** @type {boolean} */
    static _forageKeysUpdated = false;

    /** @returns {boolean} */
    static isLocalMode() {
        return Utils.isNwjs();
    }

    /**
     * @template T
     * @param {string} saveName
     * @param {T} object
     * @returns {Promise<number | void>}
     */
    static saveObject(saveName, object) {
        return this.objectToJson(object)
            .then(json => this.jsonToZip(json))
            .then(zip => this.saveZip(saveName, zip));
    }

    /**
     * @template T
     * @param {string} saveName
     * @returns {Promise<T>}
     */
    static loadObject(saveName) {
        return this.loadZip(saveName)
            .then(zip => this.zipToJson(zip))
            .then(json => this.jsonToObject(json));
    }

    /**
     * @template T
     * @param {T} object
     * @returns {Promise<string>}
     */
    static objectToJson(object) {
        return new Promise((resolve, reject) => {
            try {
                const json = JsonEx.stringify(object);
                resolve(json);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * @template T
     * @param {string} json
     * @returns {Promise<T>}
     */
    static jsonToObject(json) {
        return new Promise((resolve, reject) => {
            try {
                const object = JsonEx.parse(json);
                resolve(object);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * @param {string} json
     * @returns {Promise<string>}
     */
    static jsonToZip(json) {
        return new Promise((resolve, reject) => {
            try {
                const zip = pako.deflate(json, { to: "string", level: 1 });
                if (zip.length >= 50000) {
                    console.warn("Save data is too big.");
                }
                resolve(zip);
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * @param {string} zip
     * @returns {Promise<string>}
     */
    static zipToJson(zip) {
        return new Promise((resolve, reject) => {
            try {
                if (zip) {
                    const json = pako.inflate(zip, { to: "string" });
                    resolve(json);
                } else {
                    resolve("null");
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * @param {string} saveName
     * @param {string} zip
     * @returns {Promise<void> | Promise<number>}
     */
    static saveZip(saveName, zip) {
        if (this.isLocalMode()) {
            return this.saveToLocalFile(saveName, zip);
        } else {
            return this.saveToForage(saveName, zip);
        }
    }

    /**
     * @param {string} saveName
     * @returns {Promise<string>}
     */
    static loadZip(saveName) {
        if (this.isLocalMode()) {
            return this.loadFromLocalFile(saveName);
        } else {
            return this.loadFromForage(saveName);
        }
    }

    /**
     * @param {string} saveName
     * @returns {boolean}
     */
    static exists(saveName) {
        if (this.isLocalMode()) {
            return this.localFileExists(saveName);
        } else {
            return this.forageExists(saveName);
        }
    }

    /**
     * @param {string} saveName
     * @returns {void | Promise<number>}
     */
    static remove(saveName) {
        if (this.isLocalMode()) {
            return this.removeLocalFile(saveName);
        } else {
            return this.removeForage(saveName);
        }
    }

    /**
     * @param {string} saveName
     * @param {string} zip
     * @returns {Promise<void>}
     */
    static saveToLocalFile(saveName, zip) {
        const dirPath = this.fileDirectoryPath();
        const filePath = this.filePath(saveName);
        const backupFilePath = filePath + "_";
        return new Promise((resolve, reject) => {
            this.fsMkdir(dirPath);
            this.fsUnlink(backupFilePath);
            this.fsRename(filePath, backupFilePath);
            try {
                this.fsWriteFile(filePath, zip);
                this.fsUnlink(backupFilePath);
                resolve();
            } catch (e) {
                try {
                    this.fsUnlink(filePath);
                    this.fsRename(backupFilePath, filePath);
                } catch (e2) {
                    //
                }
                reject(e);
            }
        });
    }

    /**
     * @param {string} saveName
     * @returns {Promise<string>}
     */
    static loadFromLocalFile(saveName) {
        const filePath = this.filePath(saveName);
        return new Promise((resolve, reject) => {
            const data = this.fsReadFile(filePath);
            if (data) {
                resolve(data);
            } else {
                reject(new Error("Savefile not found"));
            }
        });
    }

    /**
     * @param {string} saveName
     * @returns {boolean}
     */
    static localFileExists(saveName) {
        const fs = require("fs");
        return fs.existsSync(this.filePath(saveName));
    }

    /**
     * @param {string} saveName
     * @returns {void}
     */
    static removeLocalFile(saveName) {
        this.fsUnlink(this.filePath(saveName));
    }

    /**
     * @param {string} saveName
     * @param {string} zip
     * @returns {Promise<number>}
     */
    static saveToForage(saveName, zip) {
        const key = this.forageKey(saveName);
        const testKey = this.forageTestKey();
        setTimeout(() => localforage.removeItem(testKey));
        return localforage
            .setItem(testKey, zip)
            .then(() => localforage.setItem(key, zip))
            .then(() => this.updateForageKeys());
    }

    /**
     * @param {string} saveName
     * @returns {Promise<string>}
     */
    static loadFromForage(saveName) {
        const key = this.forageKey(saveName);
        return localforage.getItem(key);
    }

    /**
     * @param {string} saveName
     * @returns {boolean}
     */
    static forageExists(saveName) {
        const key = this.forageKey(saveName);
        return this._forageKeys.includes(key);
    }

    /**
     * @param {string} saveName
     * @returns {Promise<number>}
     */
    static removeForage(saveName) {
        const key = this.forageKey(saveName);
        return localforage.removeItem(key).then(() => this.updateForageKeys());
    }

    /** @returns {Promise<number>} */
    static updateForageKeys() {
        this._forageKeysUpdated = false;
        return localforage.keys().then(keys => {
            this._forageKeys = keys;
            this._forageKeysUpdated = true;
            return 0;
        });
    }

    /** @returns {boolean} */
    static forageKeysUpdated() {
        return this._forageKeysUpdated;
    }

    /**
     * @param {string} path
     * @returns {void}
     */
    static fsMkdir(path) {
        const fs = require("fs");
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    }

    /**
     * @param {string} oldPath
     * @param {string} newPath
     * @returns {void}
     */
    static fsRename(oldPath, newPath) {
        const fs = require("fs");
        if (fs.existsSync(oldPath)) {
            fs.renameSync(oldPath, newPath);
        }
    }

    /**
     * @param {string} path
     * @returns {void}
     */
    static fsUnlink(path) {
        const fs = require("fs");
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
    }

    /**
     * @param {string} path
     * @returns {string | null}
     */
    static fsReadFile(path) {
        const fs = require("fs");
        if (fs.existsSync(path)) {
            return fs.readFileSync(path, { encoding: "utf8" });
        } else {
            return null;
        }
    }

    /**
     * @param {string} path
     * @param {string} data
     * @returns {void}
     */
    static fsWriteFile(path, data) {
        const fs = require("fs");
        fs.writeFileSync(path, data);
    }

    /** @returns {string} */
    static fileDirectoryPath() {
        const path = require("path");
        const base = path.dirname(process.mainModule.filename);
        return path.join(base, "save/");
    }

    /**
     * @param {string} saveName
     * @returns {string}
     */
    static filePath(saveName) {
        const dir = this.fileDirectoryPath();
        return dir + saveName + ".rmmzsave";
    }

    /**
     * @param {string} saveName
     * @returns {string}
     */
    static forageKey(saveName) {
        const gameId = $dataSystem.advanced.gameId;
        return "rmmzsave." + gameId + "." + saveName;
    }

    /** @returns {string} */
    static forageTestKey() {
        return "rmmzsave.test";
    }
}

/**
 * The static class that loads font files.
 */
class FontManager {
    constructor() {
        throw new Error("This is a static class");
    }

    /** @type {Record<string, string>} */
    static _urls = {};

    /** @type {Record<string, string>} */
    static _states = {};

    /**
     * @param {string} family
     * @param {string} filename
     * @returns {void}
     */
    static load(family, filename) {
        if (this._states[family] !== "loaded") {
            if (filename) {
                const url = this.makeUrl(filename);
                this.startLoading(family, url);
            } else {
                this._urls[family] = "";
                this._states[family] = "loaded";
            }
        }
    }

    /** @returns {boolean} */
    static isReady() {
        for (const family in this._states) {
            const state = this._states[family];
            if (state === "loading") {
                return false;
            }
            if (state === "error") {
                this.throwLoadError(family);
            }
        }
        return true;
    }

    /**
     * @param {string} family
     * @param {string} url
     * @returns {void}
     */
    static startLoading(family, url) {
        const source = "url(" + url + ")";
        const font = new FontFace(family, source);
        this._urls[family] = url;
        this._states[family] = "loading";
        font.load()
            .then(() => {
                document.fonts.add(font);
                this._states[family] = "loaded";
                return 0;
            })
            .catch(() => {
                this._states[family] = "error";
            });
    }

    /**
     * @param {string} family
     * @returns {void}
     */
    static throwLoadError(family) {
        const url = this._urls[family];
        const retry = () => this.startLoading(family, url);
        throw ["LoadError", url, retry];
    }

    /**
     * @param {string} filename
     * @returns {string}
     */
    static makeUrl(filename) {
        return "fonts/" + Utils.encodeURI(filename);
    }
}

/**
 * The static class that loads images, creates bitmap objects and retains them.
 */
class ImageManager {
    constructor() {
        throw new Error("This is a static class");
    }

    static standardIconWidth = 32;

    static standardIconHeight = 32;

    static standardFaceWidth = 144;

    static standardFaceHeight = 144;

    /** @type {Record<string, Bitmap>} */
    static _cache = {};

    /** @type {Record<string, Bitmap>} */
    static _system = {};

    /** @type {Bitmap} */
    static _emptyBitmap = new Bitmap(1, 1);

    /** @type {number} */
    static get iconWidth() {
        return this.getIconSize();
    }

    /** @type {number} */
    static get iconHeight() {
        return this.getIconSize();
    }

    /** @type {number} */
    static get faceWidth() {
        return this.getFaceSize();
    }

    /** @type {number} */
    static get faceHeight() {
        return this.getFaceSize();
    }

    /** @returns {number} */
    static getIconSize() {
        if ("iconSize" in $dataSystem) {
            return $dataSystem.iconSize;
        } else {
            return this.standardIconWidth;
        }
    }

    /** @returns {number} */
    static getFaceSize() {
        if ("faceSize" in $dataSystem) {
            return $dataSystem.faceSize;
        } else {
            return this.standardFaceWidth;
        }
    }

    /**
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadAnimation(filename) {
        return this.loadBitmap("img/animations/", filename);
    }

    /**
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadBattleback1(filename) {
        return this.loadBitmap("img/battlebacks1/", filename);
    }

    /**
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadBattleback2(filename) {
        return this.loadBitmap("img/battlebacks2/", filename);
    }

    /**
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadEnemy(filename) {
        return this.loadBitmap("img/enemies/", filename);
    }

    /**
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadCharacter(filename) {
        return this.loadBitmap("img/characters/", filename);
    }

    /**
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadFace(filename) {
        return this.loadBitmap("img/faces/", filename);
    }

    /**
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadParallax(filename) {
        return this.loadBitmap("img/parallaxes/", filename);
    }

    /**
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadPicture(filename) {
        return this.loadBitmap("img/pictures/", filename);
    }

    /**
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadSvActor(filename) {
        return this.loadBitmap("img/sv_actors/", filename);
    }

    /**
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadSvEnemy(filename) {
        return this.loadBitmap("img/sv_enemies/", filename);
    }

    /**
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadSystem(filename) {
        return this.loadBitmap("img/system/", filename);
    }

    /**
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadTileset(filename) {
        return this.loadBitmap("img/tilesets/", filename);
    }

    /**
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadTitle1(filename) {
        return this.loadBitmap("img/titles1/", filename);
    }

    /**
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadTitle2(filename) {
        return this.loadBitmap("img/titles2/", filename);
    }

    /**
     * @param {string} folder
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadBitmap(folder, filename) {
        if (filename) {
            const url = folder + Utils.encodeURI(filename) + ".png";
            return this.loadBitmapFromUrl(url);
        } else {
            return this._emptyBitmap;
        }
    }

    /**
     * @param {string} url
     * @returns {Bitmap}
     */
    static loadBitmapFromUrl(url) {
        const cache = url.includes("/system/") ? this._system : this._cache;
        if (!cache[url]) {
            cache[url] = Bitmap.load(url);
        }
        return cache[url];
    }

    /** @returns {void} */
    static clear() {
        const cache = this._cache;
        for (const url in cache) {
            cache[url].destroy();
        }
        this._cache = {};
    }

    /** @returns {boolean} */
    static isReady() {
        for (const cache of [this._cache, this._system]) {
            for (const url in cache) {
                const bitmap = cache[url];
                if (bitmap.isError()) {
                    this.throwLoadError(bitmap);
                }
                if (!bitmap.isReady()) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * @param {Bitmap} bitmap
     * @returns {void}
     */
    static throwLoadError(bitmap) {
        const retry = bitmap.retry.bind(bitmap);
        throw ["LoadError", bitmap.url, retry];
    }

    /**
     * @param {string} filename
     * @returns {boolean}
     */
    static isObjectCharacter(filename) {
        const sign = Utils.extractFileName(filename).match(/^[!$]+/);
        return sign && sign[0].includes("!");
    }

    /**
     * @param {string} filename
     * @returns {boolean}
     */
    static isBigCharacter(filename) {
        const sign = Utils.extractFileName(filename).match(/^[!$]+/);
        return sign && sign[0].includes("$");
    }

    /**
     * @param {string} filename
     * @returns {boolean}
     */
    static isZeroParallax(filename) {
        return Utils.extractFileName(filename).charAt(0) === "!";
    }
}

/**
 * The static class that loads Effekseer effects.
 */
class EffectManager {
    constructor() {
        throw new Error("This is a static class");
    }

    /** @type {Record<string, effekseer.EffekseerEffect>} */
    static _cache = {};

    /** @type {string[]} */
    static _errorUrls = [];

    /**
     * @param {string} [filename]
     * @returns {effekseer.EffekseerEffect | null}
     */
    static load(filename) {
        if (filename) {
            const url = this.makeUrl(filename);
            const cache = this._cache;
            if (!cache[url] && Graphics.effekseer) {
                this.startLoading(url);
            }
            return cache[url];
        } else {
            return null;
        }
    }

    /**
     * @param {string} url
     * @returns {effekseer.EffekseerEffect}
     */
    static startLoading(url) {
        const onLoad = () => this.onLoad(url);
        const onError = (message, url) => this.onError(url);
        const effect = Graphics.effekseer.loadEffect(url, 1, onLoad, onError);
        this._cache[url] = effect;
        return effect;
    }

    /** @returns {void} */
    static clear() {
        for (const url in this._cache) {
            const effect = this._cache[url];
            Graphics.effekseer.releaseEffect(effect);
        }
        this._cache = {};
    }

    /** @returns {void} */
    static onLoad(/*url*/) {
        //
    }

    /**
     * @param {string} url
     * @returns {void}
     */
    static onError(url) {
        this._errorUrls.push(url);
    }

    /**
     * @param {string} filename
     * @returns {string}
     */
    static makeUrl(filename) {
        return "effects/" + Utils.encodeURI(filename) + ".efkefc";
    }

    /** @returns {void} */
    static checkErrors() {
        const url = this._errorUrls.shift();
        if (url) {
            this.throwLoadError(url);
        }
    }

    /**
     * @param {string} url
     * @returns {void}
     */
    static throwLoadError(url) {
        const retry = () => this.startLoading(url);
        throw ["LoadError", url, retry];
    }

    /** @returns {boolean} */
    static isReady() {
        this.checkErrors();
        for (const url in this._cache) {
            const effect = this._cache[url];
            if (!effect.isLoaded) {
                return false;
            }
        }
        return true;
    }
}

/**
 * The static class that handles BGM, BGS, ME and SE.
 */
class AudioManager {
    constructor() {
        throw new Error("This is a static class");
    }

    /** @type {number} */
    static _bgmVolume = 100;

    /** @type {number} */
    static _bgsVolume = 100;

    /** @type {number} */
    static _meVolume = 100;

    /** @type {number} */
    static _seVolume = 100;

    /** @type {RMMZ.DataAudio | null} */
    static _currentBgm = null;

    /** @type {RMMZ.DataAudio | null} */
    static _currentBgs = null;

    /** @type {WebAudio | null} */
    static _bgmBuffer = null;

    /** @type {WebAudio | null} */
    static _bgsBuffer = null;

    /** @type {WebAudio | null} */
    static _meBuffer = null;

    /** @type {WebAudio[]} */
    static _seBuffers = [];

    /** @type {WebAudio[]} */
    static _staticBuffers = [];

    /** @type {number} */
    static _replayFadeTime = 0.5;

    /** @type {string} */
    static _path = "audio/";

    /** @type {number} */
    static get bgmVolume() {
        return this._bgmVolume;
    }
    /** @param {number} value */
    static set bgmVolume(value) {
        this._bgmVolume = value;
        this.updateBgmParameters(this._currentBgm);
    }

    /** @type {number} */
    static get bgsVolume() {
        return this._bgsVolume;
    }
    /** @param {number} value */
    static set bgsVolume(value) {
        this._bgsVolume = value;
        this.updateBgsParameters(this._currentBgs);
    }

    /** @type {number} */
    static get meVolume() {
        return this._meVolume;
    }
    /** @param {number} value */
    static set meVolume(value) {
        this._meVolume = value;
        this.updateMeParameters(this._currentMe);
    }

    /** @type {number} */
    static get seVolume() {
        return this._seVolume;
    }
    /** @param {number} value */
    static set seVolume(value) {
        this._seVolume = value;
    }

    /**
     * @param {RMMZ.DataAudio} bgm
     * @param {number} [pos]
     * @returns {void}
     */
    static playBgm(bgm, pos) {
        if (this.isCurrentBgm(bgm)) {
            this.updateBgmParameters(bgm);
        } else {
            this.stopBgm();
            if (bgm.name) {
                this._bgmBuffer = this.createBuffer("bgm/", bgm.name);
                this.updateBgmParameters(bgm);
                if (!this._meBuffer) {
                    this._bgmBuffer.play(true, pos || 0);
                }
            }
        }
        this.updateCurrentBgm(bgm, pos);
    }

    /**
     * @param {RMMZ.DataAudio} bgm
     * @returns {void}
     */
    static replayBgm(bgm) {
        if (this.isCurrentBgm(bgm)) {
            this.updateBgmParameters(bgm);
        } else {
            this.playBgm(bgm, bgm.pos);
            if (this._bgmBuffer) {
                this._bgmBuffer.fadeIn(this._replayFadeTime);
            }
        }
    }

    /**
     * @param {RMMZ.DataAudio} bgm
     * @returns {boolean | null}
     */
    static isCurrentBgm(bgm) {
        return (
            this._currentBgm &&
            this._bgmBuffer &&
            this._currentBgm.name === bgm.name
        );
    }

    /**
     * @param {RMMZ.DataAudio | null} bgm
     * @returns {void}
     */
    static updateBgmParameters(bgm) {
        this.updateBufferParameters(this._bgmBuffer, this._bgmVolume, bgm);
    }

    /**
     * @param {RMMZ.DataAudio} bgm
     * @param {number} [pos]
     * @returns {void}
     */
    static updateCurrentBgm(bgm, pos) {
        this._currentBgm = {
            name: bgm.name,
            volume: bgm.volume,
            pitch: bgm.pitch,
            pan: bgm.pan,
            pos: pos
        };
    }

    /** @returns {void} */
    static stopBgm() {
        if (this._bgmBuffer) {
            this._bgmBuffer.destroy();
            this._bgmBuffer = null;
            this._currentBgm = null;
        }
    }

    /**
     * @param {number} duration
     * @returns {void}
     */
    static fadeOutBgm(duration) {
        if (this._bgmBuffer && this._currentBgm) {
            this._bgmBuffer.fadeOut(duration);
            this._currentBgm = null;
        }
    }

    /**
     * @param {number} duration
     * @returns {void}
     */
    static fadeInBgm(duration) {
        if (this._bgmBuffer && this._currentBgm) {
            this._bgmBuffer.fadeIn(duration);
        }
    }

    /**
     * @param {RMMZ.DataAudio} bgs
     * @param {number} [pos]
     * @returns {void}
     */
    static playBgs(bgs, pos) {
        if (this.isCurrentBgs(bgs)) {
            this.updateBgsParameters(bgs);
        } else {
            this.stopBgs();
            if (bgs.name) {
                this._bgsBuffer = this.createBuffer("bgs/", bgs.name);
                this.updateBgsParameters(bgs);
                this._bgsBuffer.play(true, pos || 0);
            }
        }
        this.updateCurrentBgs(bgs, pos);
    }

    /**
     * @param {RMMZ.DataAudio} bgs
     * @returns {void}
     */
    static replayBgs(bgs) {
        if (this.isCurrentBgs(bgs)) {
            this.updateBgsParameters(bgs);
        } else {
            this.playBgs(bgs, bgs.pos);
            if (this._bgsBuffer) {
                this._bgsBuffer.fadeIn(this._replayFadeTime);
            }
        }
    }

    /**
     * @param {RMMZ.DataAudio} bgs
     * @returns {boolean | null}
     */
    static isCurrentBgs(bgs) {
        return (
            this._currentBgs &&
            this._bgsBuffer &&
            this._currentBgs.name === bgs.name
        );
    }

    /**
     * @param {RMMZ.DataAudio | null} bgs
     * @returns {void}
     */
    static updateBgsParameters(bgs) {
        this.updateBufferParameters(this._bgsBuffer, this._bgsVolume, bgs);
    }

    /**
     * @param {RMMZ.DataAudio} bgs
     * @param {number} [pos]
     * @returns {void}
     */
    static updateCurrentBgs(bgs, pos) {
        this._currentBgs = {
            name: bgs.name,
            volume: bgs.volume,
            pitch: bgs.pitch,
            pan: bgs.pan,
            pos: pos
        };
    }

    /** @returns {void} */
    static stopBgs() {
        if (this._bgsBuffer) {
            this._bgsBuffer.destroy();
            this._bgsBuffer = null;
            this._currentBgs = null;
        }
    }

    /**
     * @param {number} duration
     * @returns {void}
     */
    static fadeOutBgs(duration) {
        if (this._bgsBuffer && this._currentBgs) {
            this._bgsBuffer.fadeOut(duration);
            this._currentBgs = null;
        }
    }

    /**
     * @param {number} duration
     * @returns {void}
     */
    static fadeInBgs(duration) {
        if (this._bgsBuffer && this._currentBgs) {
            this._bgsBuffer.fadeIn(duration);
        }
    }

    /**
     * @param {RMMZ.DataAudio} me
     * @returns {void}
     */
    static playMe(me) {
        this.stopMe();
        if (me.name) {
            if (this._bgmBuffer && this._currentBgm) {
                this._currentBgm.pos = this._bgmBuffer.seek();
                this._bgmBuffer.stop();
            }
            this._meBuffer = this.createBuffer("me/", me.name);
            this.updateMeParameters(me);
            this._meBuffer.play(false);
            this._meBuffer.addStopListener(this.stopMe.bind(this));
        }
    }

    /**
     * @param {RMMZ.DataAudio | null} me
     * @returns {void}
     */
    static updateMeParameters(me) {
        this.updateBufferParameters(this._meBuffer, this._meVolume, me);
    }

    /**
     * @param {number} duration
     * @returns {void}
     */
    static fadeOutMe(duration) {
        if (this._meBuffer) {
            this._meBuffer.fadeOut(duration);
        }
    }

    /** @returns {void} */
    static stopMe() {
        if (this._meBuffer) {
            this._meBuffer.destroy();
            this._meBuffer = null;
            if (
                this._bgmBuffer &&
                this._currentBgm &&
                !this._bgmBuffer.isPlaying()
            ) {
                this._bgmBuffer.play(true, this._currentBgm.pos);
                this._bgmBuffer.fadeIn(this._replayFadeTime);
            }
        }
    }

    /**
     * @param {RMMZ.DataAudio} se
     * @returns {void}
     */
    static playSe(se) {
        if (se.name) {
            // [Note] Do not play the same sound in the same frame.
            const latestBuffers = this._seBuffers.filter(
                buffer => buffer.frameCount === Graphics.frameCount
            );
            if (latestBuffers.find(buffer => buffer.name === se.name)) {
                return;
            }
            const buffer = this.createBuffer("se/", se.name);
            this.updateSeParameters(buffer, se);
            buffer.play(false);
            this._seBuffers.push(buffer);
            this.cleanupSe();
        }
    }

    /**
     * @param {WebAudio} buffer
     * @param {RMMZ.DataAudio | null} se
     * @returns {void}
     */
    static updateSeParameters(buffer, se) {
        this.updateBufferParameters(buffer, this._seVolume, se);
    }

    /** @returns {void} */
    static cleanupSe() {
        for (const buffer of this._seBuffers) {
            if (!buffer.isPlaying()) {
                buffer.destroy();
            }
        }
        this._seBuffers = this._seBuffers.filter(buffer => buffer.isPlaying());
    }

    /** @returns {void} */
    static stopSe() {
        for (const buffer of this._seBuffers) {
            buffer.destroy();
        }
        this._seBuffers = [];
    }

    /**
     * @param {RMMZ.DataAudio} se
     * @returns {void}
     */
    static playStaticSe(se) {
        if (se.name) {
            this.loadStaticSe(se);
            for (const buffer of this._staticBuffers) {
                if (buffer.name === se.name) {
                    buffer.stop();
                    this.updateSeParameters(buffer, se);
                    buffer.play(false);
                    break;
                }
            }
        }
    }

    /**
     * @param {RMMZ.DataAudio} se
     * @returns {void}
     */
    static loadStaticSe(se) {
        if (se.name && !this.isStaticSe(se)) {
            const buffer = this.createBuffer("se/", se.name);
            this._staticBuffers.push(buffer);
        }
    }

    /**
     * @param {RMMZ.DataAudio} se
     * @returns {boolean}
     */
    static isStaticSe(se) {
        for (const buffer of this._staticBuffers) {
            if (buffer.name === se.name) {
                return true;
            }
        }
        return false;
    }

    /** @returns {void} */
    static stopAll() {
        this.stopMe();
        this.stopBgm();
        this.stopBgs();
        this.stopSe();
    }

    /** @returns {RMMZ.DataAudio} */
    static saveBgm() {
        if (this._currentBgm) {
            const bgm = this._currentBgm;
            return {
                name: bgm.name,
                volume: bgm.volume,
                pitch: bgm.pitch,
                pan: bgm.pan,
                pos: this._bgmBuffer ? this._bgmBuffer.seek() : 0
            };
        } else {
            return this.makeEmptyAudioObject();
        }
    }

    /** @returns {RMMZ.DataAudio} */
    static saveBgs() {
        if (this._currentBgs) {
            const bgs = this._currentBgs;
            return {
                name: bgs.name,
                volume: bgs.volume,
                pitch: bgs.pitch,
                pan: bgs.pan,
                pos: this._bgsBuffer ? this._bgsBuffer.seek() : 0
            };
        } else {
            return this.makeEmptyAudioObject();
        }
    }

    /** @returns {RMMZ.DataAudio} */
    static makeEmptyAudioObject() {
        return { name: "", volume: 0, pitch: 0 };
    }

    /**
     * @param {string} folder
     * @param {string} name
     * @returns {WebAudio}
     */
    static createBuffer(folder, name) {
        const ext = this.audioFileExt();
        const url = this._path + folder + Utils.encodeURI(name) + ext;
        const buffer = new WebAudio(url);
        buffer.name = name;
        buffer.frameCount = Graphics.frameCount;
        return buffer;
    }

    /**
     * @param {WebAudio | null} buffer
     * @param {number} configVolume
     * @param {RMMZ.DataAudio | null} audio
     * @returns {void}
     */
    static updateBufferParameters(buffer, configVolume, audio) {
        if (buffer && audio) {
            buffer.volume = (configVolume * (audio.volume || 0)) / 10000;
            buffer.pitch = (audio.pitch || 0) / 100;
            buffer.pan = (audio.pan || 0) / 100;
        }
    }

    /** @returns {string} */
    static audioFileExt() {
        return ".ogg";
    }

    /** @returns {void} */
    static checkErrors() {
        const buffers = [this._bgmBuffer, this._bgsBuffer, this._meBuffer];
        buffers.push(...this._seBuffers);
        buffers.push(...this._staticBuffers);
        for (const buffer of buffers) {
            if (buffer && buffer.isError()) {
                this.throwLoadError(buffer);
            }
        }
    }

    /**
     * @param {WebAudio} webAudio
     * @returns {void}
     */
    static throwLoadError(webAudio) {
        const retry = webAudio.retry.bind(webAudio);
        throw ["LoadError", webAudio.url, retry];
    }
}

/**
 * The static class that plays sound effects defined in the database.
 */
class SoundManager {
    constructor() {
        throw new Error("This is a static class");
    }

    /** @returns {void} */
    static preloadImportantSounds() {
        this.loadSystemSound(0);
        this.loadSystemSound(1);
        this.loadSystemSound(2);
        this.loadSystemSound(3);
    }

    /**
     * @param {number} n
     * @returns {void}
     */
    static loadSystemSound(n) {
        if ($dataSystem) {
            AudioManager.loadStaticSe($dataSystem.sounds[n]);
        }
    }

    /**
     * @param {number} n
     * @returns {void}
     */
    static playSystemSound(n) {
        if ($dataSystem) {
            AudioManager.playStaticSe($dataSystem.sounds[n]);
        }
    }

    /** @returns {void} */
    static playCursor() {
        this.playSystemSound(0);
    }

    /** @returns {void} */
    static playOk() {
        this.playSystemSound(1);
    }

    /** @returns {void} */
    static playCancel() {
        this.playSystemSound(2);
    }

    /** @returns {void} */
    static playBuzzer() {
        this.playSystemSound(3);
    }

    /** @returns {void} */
    static playEquip() {
        this.playSystemSound(4);
    }

    /** @returns {void} */
    static playSave() {
        this.playSystemSound(5);
    }

    /** @returns {void} */
    static playLoad() {
        this.playSystemSound(6);
    }

    /** @returns {void} */
    static playBattleStart() {
        this.playSystemSound(7);
    }

    /** @returns {void} */
    static playEscape() {
        this.playSystemSound(8);
    }

    /** @returns {void} */
    static playEnemyAttack() {
        this.playSystemSound(9);
    }

    /** @returns {void} */
    static playEnemyDamage() {
        this.playSystemSound(10);
    }

    /** @returns {void} */
    static playEnemyCollapse() {
        this.playSystemSound(11);
    }

    /** @returns {void} */
    static playBossCollapse1() {
        this.playSystemSound(12);
    }

    /** @returns {void} */
    static playBossCollapse2() {
        this.playSystemSound(13);
    }

    /** @returns {void} */
    static playActorDamage() {
        this.playSystemSound(14);
    }

    /** @returns {void} */
    static playActorCollapse() {
        this.playSystemSound(15);
    }

    /** @returns {void} */
    static playRecovery() {
        this.playSystemSound(16);
    }

    /** @returns {void} */
    static playMiss() {
        this.playSystemSound(17);
    }

    /** @returns {void} */
    static playEvasion() {
        this.playSystemSound(18);
    }

    /** @returns {void} */
    static playMagicEvasion() {
        this.playSystemSound(19);
    }

    /** @returns {void} */
    static playReflection() {
        this.playSystemSound(20);
    }

    /** @returns {void} */
    static playShop() {
        this.playSystemSound(21);
    }

    /** @returns {void} */
    static playUseItem() {
        this.playSystemSound(22);
    }

    /** @returns {void} */
    static playUseSkill() {
        this.playSystemSound(23);
    }
}

/**
 * The static class that handles terms and messages.
 */
class TextManager {
    constructor() {
        throw new Error("This is a static class");
    }

    /**
     * @param {number} basicId
     * @returns {string}
     */
    static basic(basicId) {
        return $dataSystem.terms.basic[basicId] || "";
    }

    /**
     * @param {number} paramId
     * @returns {string}
     */
    static param(paramId) {
        return $dataSystem.terms.params[paramId] || "";
    }

    /**
     * @param {number} commandId
     * @returns {string}
     */
    static command(commandId) {
        return $dataSystem.terms.commands[commandId] || "";
    }

    /**
     * @param {keyof RMMZ.Messages} messageId
     * @returns {string}
     */
    static message(messageId) {
        return $dataSystem.terms.messages[messageId] || "";
    }

    /**
     * @param {string} method
     * @param {number} param
     * @returns {PropertyDescriptor}
     */
    static getter(method, param) {
        return {
            get: function() {
                return this[method](param);
            },
            configurable: true
        };
    }

    /** @type {string} */
    static get currencyUnit() {
        return $dataSystem.currencyUnit;
    }
}

Object.defineProperties(TextManager, {
    level: TextManager.getter("basic", 0),
    levelA: TextManager.getter("basic", 1),
    hp: TextManager.getter("basic", 2),
    hpA: TextManager.getter("basic", 3),
    mp: TextManager.getter("basic", 4),
    mpA: TextManager.getter("basic", 5),
    tp: TextManager.getter("basic", 6),
    tpA: TextManager.getter("basic", 7),
    exp: TextManager.getter("basic", 8),
    expA: TextManager.getter("basic", 9),
    fight: TextManager.getter("command", 0),
    escape: TextManager.getter("command", 1),
    attack: TextManager.getter("command", 2),
    guard: TextManager.getter("command", 3),
    item: TextManager.getter("command", 4),
    skill: TextManager.getter("command", 5),
    equip: TextManager.getter("command", 6),
    status: TextManager.getter("command", 7),
    formation: TextManager.getter("command", 8),
    save: TextManager.getter("command", 9),
    gameEnd: TextManager.getter("command", 10),
    options: TextManager.getter("command", 11),
    weapon: TextManager.getter("command", 12),
    armor: TextManager.getter("command", 13),
    keyItem: TextManager.getter("command", 14),
    equip2: TextManager.getter("command", 15),
    optimize: TextManager.getter("command", 16),
    clear: TextManager.getter("command", 17),
    newGame: TextManager.getter("command", 18),
    continue_: TextManager.getter("command", 19),
    toTitle: TextManager.getter("command", 21),
    cancel: TextManager.getter("command", 22),
    buy: TextManager.getter("command", 24),
    sell: TextManager.getter("command", 25),
    alwaysDash: TextManager.getter("message", "alwaysDash"),
    commandRemember: TextManager.getter("message", "commandRemember"),
    touchUI: TextManager.getter("message", "touchUI"),
    bgmVolume: TextManager.getter("message", "bgmVolume"),
    bgsVolume: TextManager.getter("message", "bgsVolume"),
    meVolume: TextManager.getter("message", "meVolume"),
    seVolume: TextManager.getter("message", "seVolume"),
    possession: TextManager.getter("message", "possession"),
    expTotal: TextManager.getter("message", "expTotal"),
    expNext: TextManager.getter("message", "expNext"),
    saveMessage: TextManager.getter("message", "saveMessage"),
    loadMessage: TextManager.getter("message", "loadMessage"),
    file: TextManager.getter("message", "file"),
    autosave: TextManager.getter("message", "autosave"),
    partyName: TextManager.getter("message", "partyName"),
    emerge: TextManager.getter("message", "emerge"),
    preemptive: TextManager.getter("message", "preemptive"),
    surprise: TextManager.getter("message", "surprise"),
    escapeStart: TextManager.getter("message", "escapeStart"),
    escapeFailure: TextManager.getter("message", "escapeFailure"),
    victory: TextManager.getter("message", "victory"),
    defeat: TextManager.getter("message", "defeat"),
    obtainExp: TextManager.getter("message", "obtainExp"),
    obtainGold: TextManager.getter("message", "obtainGold"),
    obtainItem: TextManager.getter("message", "obtainItem"),
    levelUp: TextManager.getter("message", "levelUp"),
    obtainSkill: TextManager.getter("message", "obtainSkill"),
    useItem: TextManager.getter("message", "useItem"),
    criticalToEnemy: TextManager.getter("message", "criticalToEnemy"),
    criticalToActor: TextManager.getter("message", "criticalToActor"),
    actorDamage: TextManager.getter("message", "actorDamage"),
    actorRecovery: TextManager.getter("message", "actorRecovery"),
    actorGain: TextManager.getter("message", "actorGain"),
    actorLoss: TextManager.getter("message", "actorLoss"),
    actorDrain: TextManager.getter("message", "actorDrain"),
    actorNoDamage: TextManager.getter("message", "actorNoDamage"),
    actorNoHit: TextManager.getter("message", "actorNoHit"),
    enemyDamage: TextManager.getter("message", "enemyDamage"),
    enemyRecovery: TextManager.getter("message", "enemyRecovery"),
    enemyGain: TextManager.getter("message", "enemyGain"),
    enemyLoss: TextManager.getter("message", "enemyLoss"),
    enemyDrain: TextManager.getter("message", "enemyDrain"),
    enemyNoDamage: TextManager.getter("message", "enemyNoDamage"),
    enemyNoHit: TextManager.getter("message", "enemyNoHit"),
    evasion: TextManager.getter("message", "evasion"),
    magicEvasion: TextManager.getter("message", "magicEvasion"),
    magicReflection: TextManager.getter("message", "magicReflection"),
    counterAttack: TextManager.getter("message", "counterAttack"),
    substitute: TextManager.getter("message", "substitute"),
    buffAdd: TextManager.getter("message", "buffAdd"),
    debuffAdd: TextManager.getter("message", "debuffAdd"),
    buffRemove: TextManager.getter("message", "buffRemove"),
    actionFailure: TextManager.getter("message", "actionFailure")
});

/**
 * The static class that handles the window colors.
 */
class ColorManager {
    constructor() {
        throw new Error("This is a static class");
    }

    /** @returns {void} */
    static loadWindowskin() {
        this._windowskin = ImageManager.loadSystem("Window");
    }

    /**
     * @param {number} n
     * @returns {string}
     */
    static textColor(n) {
        const px = 96 + (n % 8) * 12 + 6;
        const py = 144 + Math.floor(n / 8) * 12 + 6;
        return this._windowskin.getPixel(px, py);
    }

    /** @returns {string} */
    static normalColor() {
        return this.textColor(0);
    }

    /** @returns {string} */
    static systemColor() {
        return this.textColor(16);
    }

    /** @returns {string} */
    static crisisColor() {
        return this.textColor(17);
    }

    /** @returns {string} */
    static deathColor() {
        return this.textColor(18);
    }

    /** @returns {string} */
    static gaugeBackColor() {
        return this.textColor(19);
    }

    /** @returns {string} */
    static hpGaugeColor1() {
        return this.textColor(20);
    }

    /** @returns {string} */
    static hpGaugeColor2() {
        return this.textColor(21);
    }

    /** @returns {string} */
    static mpGaugeColor1() {
        return this.textColor(22);
    }

    /** @returns {string} */
    static mpGaugeColor2() {
        return this.textColor(23);
    }

    /** @returns {string} */
    static mpCostColor() {
        return this.textColor(23);
    }

    /** @returns {string} */
    static powerUpColor() {
        return this.textColor(24);
    }

    /** @returns {string} */
    static powerDownColor() {
        return this.textColor(25);
    }

    /** @returns {string} */
    static ctGaugeColor1() {
        return this.textColor(26);
    }

    /** @returns {string} */
    static ctGaugeColor2() {
        return this.textColor(27);
    }

    /** @returns {string} */
    static tpGaugeColor1() {
        return this.textColor(28);
    }

    /** @returns {string} */
    static tpGaugeColor2() {
        return this.textColor(29);
    }

    /** @returns {string} */
    static tpCostColor() {
        return this.textColor(29);
    }

    /** @returns {string} */
    static pendingColor() {
        return this._windowskin.getPixel(120, 120);
    }

    /**
     * @param {Game_BattlerBase | null} actor
     * @returns {string}
     */
    static hpColor(actor) {
        if (!actor) {
            return this.normalColor();
        } else if (actor.isDead()) {
            return this.deathColor();
        } else if (actor.isDying()) {
            return this.crisisColor();
        } else {
            return this.normalColor();
        }
    }

    /** @returns {string} */
    static mpColor(/*actor*/) {
        return this.normalColor();
    }

    /** @returns {string} */
    static tpColor(/*actor*/) {
        return this.normalColor();
    }

    /**
     * @param {number} change
     * @returns {string}
     */
    static paramchangeTextColor(change) {
        if (change > 0) {
            return this.powerUpColor();
        } else if (change < 0) {
            return this.powerDownColor();
        } else {
            return this.normalColor();
        }
    }

    /**
     * @param {number} colorType
     * @returns {"#ffffff" | "#b9ffb5" | "#ffff90" | "#80b0ff" | "#808080"}
     */
    static damageColor(colorType) {
        switch (colorType) {
            case 0: // HP damage
                return "#ffffff";
            case 1: // HP recover
                return "#b9ffb5";
            case 2: // MP damage
                return "#ffff90";
            case 3: // MP recover
                return "#80b0ff";
            default:
                return "#808080";
        }
    }

    /** @returns {string} */
    static outlineColor() {
        return "rgba(0, 0, 0, 0.6)";
    }

    /** @returns {string} */
    static dimColor1() {
        return "rgba(0, 0, 0, 0.6)";
    }

    /** @returns {string} */
    static dimColor2() {
        return "rgba(0, 0, 0, 0)";
    }

    /** @returns {string} */
    static itemBackColor1() {
        return "rgba(32, 32, 32, 0.5)";
    }

    /** @returns {string} */
    static itemBackColor2() {
        return "rgba(0, 0, 0, 0.5)";
    }
}

/**
 * The static class that manages scene transitions.
 */
class SceneManager {
    constructor() {
        throw new Error("This is a static class");
    }

    /** @type {Scene_Base | null} */
    static _scene = null;

    /** @type {Scene_Base | null} */
    static _nextScene = null;

    /** @type {(new () => Scene_Base)[]} */
    static _stack = [];

    /** @type {boolean} */
    static _exiting = false;

    /** @type {Scene_Base | null} */
    static _previousScene = null;

    /** @type {(new () => Scene_Base) | null} */
    static _previousClass = null;

    /** @type {Bitmap | null} */
    static _backgroundBitmap = null;

    /** @type {number} */
    static _smoothDeltaTime = 1;

    /** @type {number} */
    static _elapsedTime = 0;

    /**
     * @param {new () => Scene_Base} sceneClass
     * @returns {Promise<void>}
     */
    static async run(sceneClass) {
        try {
            await this.initialize();
            this.goto(sceneClass);
            Graphics.startGameLoop();
        } catch (e) {
            this.catchException(e);
        }
    }

    /** @returns {Promise<void>} */
    static async initialize() {
        this.checkBrowser();
        this.checkPluginErrors();
        await this.initGraphics();
        this.initAudio();
        this.initVideo();
        this.initInput();
        this.setupEventHandlers();
    }

    /** @returns {void} */
    static checkBrowser() {
        if (!Utils.canUseWebGL()) {
            throw new Error("Your browser does not support WebGL.");
        }
        if (!Utils.canUseWebAudioAPI()) {
            throw new Error("Your browser does not support Web Audio API.");
        }
        if (!Utils.canUseCssFontLoading()) {
            throw new Error("Your browser does not support CSS Font Loading.");
        }
        if (!Utils.canUseIndexedDB()) {
            throw new Error("Your browser does not support IndexedDB.");
        }
    }

    /** @returns {void} */
    static checkPluginErrors() {
        PluginManager.checkErrors();
    }

    /** @returns {Promise<void>} */
    static async initGraphics() {
        await Graphics.initialize();
        Graphics.setTickHandler(this.update.bind(this));
    }

    /** @returns {void} */
    static initAudio() {
        WebAudio.initialize();
    }

    /** @returns {void} */
    static initVideo() {
        Video.initialize(Graphics.width, Graphics.height);
    }

    /** @returns {void} */
    static initInput() {
        Input.initialize();
        TouchInput.initialize();
    }

    /** @returns {void} */
    static setupEventHandlers() {
        window.addEventListener("error", this.onError.bind(this));
        window.addEventListener("unhandledrejection", this.onReject.bind(this));
        window.addEventListener("unload", this.onUnload.bind(this));
        document.addEventListener("keydown", this.onKeyDown.bind(this));
    }

    /**
     * @param {number} deltaTime
     * @returns {void}
     */
    static update(deltaTime) {
        try {
            const n = this.determineRepeatNumber(deltaTime);
            for (let i = 0; i < n; i++) {
                this.updateMain();
            }
        } catch (e) {
            this.catchException(e);
        }
    }

    /**
     * Determines how many game updates to run for this frame.
     * The calculation accounts for refresh rates above 60 Hz and smooths
     * sudden changes in deltaTime.
     *
     * @param {number} deltaTime
     * @returns {number}
     */
    static determineRepeatNumber(deltaTime) {
        this._smoothDeltaTime *= 0.8;
        this._smoothDeltaTime += Math.min(deltaTime, 2) * 0.2;
        if (this._smoothDeltaTime >= 0.9) {
            this._elapsedTime = 0;
            return Math.round(this._smoothDeltaTime);
        } else {
            this._elapsedTime += deltaTime;
            if (this._elapsedTime >= 1) {
                this._elapsedTime -= 1;
                return 1;
            }
            return 0;
        }
    }

    /** @returns {void} */
    static terminate() {
        if (Utils.isNwjs()) {
            nw.App.quit();
        }
    }

    /**
     * @param {ErrorEvent} event
     * @returns {void}
     */
    static onError(event) {
        console.error(event.message);
        console.error(event.filename, event.lineno);
        try {
            this.stop();
            Graphics.printError("Error", event.message, event);
            AudioManager.stopAll();
        } catch (e) {
            //
        }
    }

    /**
     * @param {PromiseRejectionEvent} event
     * @returns {void}
     */
    static onReject(event) {
        // Catch uncaught exception in Promise
        event.message = event.reason;
        this.onError(event);
    }

    /** @returns {void} */
    static onUnload() {
        ImageManager.clear();
        EffectManager.clear();
        AudioManager.stopAll();
    }

    /**
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    static onKeyDown(event) {
        if (!event.ctrlKey && !event.altKey) {
            switch (event.keyCode) {
                case 116: // F5
                    this.reloadGame();
                    break;
                case 119: // F8
                    this.showDevTools();
                    break;
            }
        }
    }

    /** @returns {void} */
    static reloadGame() {
        if (Utils.isNwjs()) {
            chrome.runtime.reload();
        }
    }

    /** @returns {void} */
    static showDevTools() {
        if (Utils.isNwjs() && Utils.isOptionValid("test")) {
            nw.Window.get().showDevTools();
        }
    }

    /**
     * @param {unknown} e
     * @returns {void}
     */
    static catchException(e) {
        if (e instanceof Error) {
            this.catchNormalError(e);
        } else if (e instanceof Array && e[0] === "LoadError") {
            this.catchLoadError(e);
        } else {
            this.catchUnknownError(e);
        }
        this.stop();
    }

    /**
     * @param {Error} e
     * @returns {void}
     */
    static catchNormalError(e) {
        Graphics.printError(e.name, e.message, e);
        AudioManager.stopAll();
        console.error(e.stack);
    }

    /**
     * @param {[ "LoadError", string, () => void ]} e
     * @returns {void}
     */
    static catchLoadError(e) {
        const url = e[1];
        const retry = e[2];
        Graphics.printError("Failed to load", url);
        if (retry) {
            Graphics.showRetryButton(() => {
                retry();
                SceneManager.resume();
            });
        } else {
            AudioManager.stopAll();
        }
    }

    /**
     * @param {unknown} e
     * @returns {void}
     */
    static catchUnknownError(e) {
        Graphics.printError("UnknownError", String(e));
        AudioManager.stopAll();
    }

    /** @returns {void} */
    static updateMain() {
        this.updateFrameCount();
        this.updateInputData();
        this.updateEffekseer();
        this.changeScene();
        this.updateScene();
    }

    /** @returns {void} */
    static updateFrameCount() {
        Graphics.frameCount++;
    }

    /** @returns {void} */
    static updateInputData() {
        Input.update();
        TouchInput.update();
    }

    /** @returns {void} */
    static updateEffekseer() {
        if (Graphics.effekseer && this.isGameActive()) {
            Graphics.effekseer.update();
        }
    }

    /** @returns {void} */
    static changeScene() {
        if (this.isSceneChanging() && !this.isCurrentSceneBusy()) {
            if (this._scene) {
                this._scene.terminate();
                this.onSceneTerminate();
            }
            this._scene = this._nextScene;
            this._nextScene = null;
            if (this._scene) {
                this._scene.create();
                this.onSceneCreate();
            }
            if (this._exiting) {
                this.terminate();
            }
        }
    }

    /** @returns {void} */
    static updateScene() {
        if (this._scene) {
            if (this._scene.isStarted()) {
                if (this.isGameActive()) {
                    this._scene.update();
                }
            } else if (this._scene.isReady()) {
                this.onBeforeSceneStart();
                this._scene.start();
                this.onSceneStart();
            }
        }
    }

    /** @returns {boolean} */
    static isGameActive() {
        // [Note] We use "window.top" to support an iframe.
        try {
            return window.top.document.hasFocus();
        } catch (e) {
            // SecurityError
            return true;
        }
    }

    /** @returns {void} */
    static onSceneTerminate() {
        this._previousScene = this._scene;
        this._previousClass = this._scene.constructor;
        Graphics.setStage(null);
    }

    /** @returns {void} */
    static onSceneCreate() {
        Graphics.startLoading();
    }

    /** @returns {void} */
    static onBeforeSceneStart() {
        if (this._previousScene) {
            this._previousScene.destroy();
            this._previousScene = null;
        }
        if (Graphics.effekseer) {
            Graphics.effekseer.stopAll();
        }
    }

    /** @returns {void} */
    static onSceneStart() {
        Graphics.endLoading();
        Graphics.setStage(this._scene);
    }

    /** @returns {boolean} */
    static isSceneChanging() {
        return this._exiting || !!this._nextScene;
    }

    /** @returns {boolean | null} */
    static isCurrentSceneBusy() {
        return this._scene && this._scene.isBusy();
    }

    /**
     * @param {new () => Scene_Base} sceneClass
     * @returns {boolean | null}
     */
    static isNextScene(sceneClass) {
        return this._nextScene && this._nextScene.constructor === sceneClass;
    }

    /**
     * @param {new () => Scene_Base} sceneClass
     * @returns {boolean}
     */
    static isPreviousScene(sceneClass) {
        return this._previousClass === sceneClass;
    }

    /**
     * @param {(new () => Scene_Base) | null} sceneClass
     * @returns {void}
     */
    static goto(sceneClass) {
        if (sceneClass) {
            this._nextScene = new sceneClass();
        }
        if (this._scene) {
            this._scene.stop();
        }
    }

    /**
     * @param {new () => Scene_Base} sceneClass
     * @returns {void}
     */
    static push(sceneClass) {
        this._stack.push(this._scene.constructor);
        this.goto(sceneClass);
    }

    /** @returns {void} */
    static pop() {
        if (this._stack.length > 0) {
            this.goto(this._stack.pop());
        } else {
            this.exit();
        }
    }

    /** @returns {void} */
    static exit() {
        this.goto(null);
        this._exiting = true;
    }

    /** @returns {void} */
    static clearStack() {
        this._stack = [];
    }

    /** @returns {void} */
    static stop() {
        Graphics.stopGameLoop();
    }

    /**
     * @template {Scene_Base & { prepare: (...args: any[]) => void; }} T
     * @returns {void}
     */
    static prepareNextScene() {
        this._nextScene.prepare(...arguments);
    }

    /** @returns {Bitmap} */
    static snap() {
        return Bitmap.snap(this._scene);
    }

    /** @returns {void} */
    static snapForBackground() {
        if (this._backgroundBitmap) {
            this._backgroundBitmap.destroy();
        }
        this._backgroundBitmap = this.snap();
    }

    /** @returns {Bitmap | null} */
    static backgroundBitmap() {
        return this._backgroundBitmap;
    }

    /** @returns {void} */
    static resume() {
        TouchInput.update();
        Graphics.startGameLoop();
    }
}

/**
 * The static class that manages battle progress.
 */
class BattleManager {
    constructor() {
        throw new Error("This is a static class");
    }

    /**
     * @param {number} troopId
     * @param {boolean} canEscape
     * @param {boolean} canLose
     * @returns {void}
     */
    static setup(troopId, canEscape, canLose) {
        this.initMembers();
        this._canEscape = canEscape;
        this._canLose = canLose;
        $gameTroop.setup(troopId);
        $gameScreen.onBattleStart();
        this.makeEscapeRatio();
    }

    /** @returns {void} */
    static initMembers() {
        this._phase = "";
        this._inputting = false;
        this._canEscape = false;
        this._canLose = false;
        this._battleTest = false;
        this._eventCallback = null;
        this._preemptive = false;
        this._surprise = false;
        this._currentActor = null;
        this._actionForcedBattler = null;
        this._mapBgm = null;
        this._mapBgs = null;
        this._actionBattlers = [];
        this._subject = null;
        this._action = null;
        this._targets = [];
        this._logWindow = null;
        this._spriteset = null;
        this._escapeRatio = 0;
        this._escaped = false;
        this._rewards = {};
        this._tpbNeedsPartyCommand = true;
    }

    /** @returns {boolean} */
    static isTpb() {
        return $dataSystem.battleSystem >= 1;
    }

    /** @returns {boolean} */
    static isActiveTpb() {
        return $dataSystem.battleSystem === 1;
    }

    /** @returns {boolean} */
    static isBattleTest() {
        return this._battleTest;
    }

    /**
     * @param {boolean} battleTest
     * @returns {void}
     */
    static setBattleTest(battleTest) {
        this._battleTest = battleTest;
    }

    /**
     * @param {(result: number) => void} callback
     * @returns {void}
     */
    static setEventCallback(callback) {
        this._eventCallback = callback;
    }

    /**
     * @param {Window_BattleLog} logWindow
     * @returns {void}
     */
    static setLogWindow(logWindow) {
        this._logWindow = logWindow;
    }

    /**
     * @param {Spriteset_Battle} spriteset
     * @returns {void}
     */
    static setSpriteset(spriteset) {
        this._spriteset = spriteset;
    }

    /** @returns {void} */
    static onEncounter() {
        this._preemptive = Math.random() < this.ratePreemptive();
        this._surprise = Math.random() < this.rateSurprise() && !this._preemptive;
    }

    /** @returns {number} */
    static ratePreemptive() {
        return $gameParty.ratePreemptive($gameTroop.agility());
    }

    /** @returns {number} */
    static rateSurprise() {
        return $gameParty.rateSurprise($gameTroop.agility());
    }

    /** @returns {void} */
    static saveBgmAndBgs() {
        this._mapBgm = AudioManager.saveBgm();
        this._mapBgs = AudioManager.saveBgs();
    }

    /** @returns {void} */
    static playBattleBgm() {
        AudioManager.playBgm($gameSystem.battleBgm());
        AudioManager.stopBgs();
    }

    /** @returns {void} */
    static playVictoryMe() {
        AudioManager.playMe($gameSystem.victoryMe());
    }

    /** @returns {void} */
    static playDefeatMe() {
        AudioManager.playMe($gameSystem.defeatMe());
    }

    /** @returns {void} */
    static replayBgmAndBgs() {
        if (this._mapBgm) {
            AudioManager.replayBgm(this._mapBgm);
        } else {
            AudioManager.stopBgm();
        }
        if (this._mapBgs) {
            AudioManager.replayBgs(this._mapBgs);
        }
    }

    /** @returns {void} */
    static makeEscapeRatio() {
        this._escapeRatio = (0.5 * $gameParty.agility()) / $gameTroop.agility();
    }

    /**
     * @param {boolean} timeActive
     * @returns {void}
     */
    static update(timeActive) {
        if (!this.isBusy() && !this.updateEvent()) {
            this.updatePhase(timeActive);
        }
        if (this.isTpb()) {
            this.updateTpbInput();
        }
    }

    /**
     * @param {boolean} timeActive
     * @returns {void}
     */
    static updatePhase(timeActive) {
        switch (this._phase) {
            case "start":
                this.updateStart();
                break;
            case "turn":
                this.updateTurn(timeActive);
                break;
            case "action":
                this.updateAction();
                break;
            case "turnEnd":
                this.updateTurnEnd();
                break;
            case "battleEnd":
                this.updateBattleEnd();
                break;
        }
    }

    /** @returns {boolean} */
    static updateEvent() {
        switch (this._phase) {
            case "start":
            case "turn":
            case "turnEnd":
                if (this.isActionForced()) {
                    this.processForcedAction();
                    return true;
                } else {
                    return this.updateEventMain();
                }
        }
        return this.checkAbort();
    }

    /** @returns {boolean} */
    static updateEventMain() {
        $gameTroop.updateInterpreter();
        $gameParty.requestMotionRefresh();
        if ($gameTroop.isEventRunning() || this.checkBattleEnd()) {
            return true;
        }
        $gameTroop.setupBattleEvent();
        if ($gameTroop.isEventRunning() || SceneManager.isSceneChanging()) {
            return true;
        }
        return false;
    }

    /** @returns {boolean | "video" | "scroll" | "image" | "message" | "transfer" | "route" | "animation" | "balloon" | "gather" | "action" | "effect" | "movement"} */
    static isBusy() {
        return (
            $gameMessage.isBusy() ||
            this._spriteset.isBusy() ||
            this._logWindow.isBusy()
        );
    }

    /** @returns {void} */
    static updateTpbInput() {
        if (this._inputting) {
            this.checkTpbInputClose();
        } else {
            this.checkTpbInputOpen();
        }
    }

    /** @returns {void} */
    static checkTpbInputClose() {
        if (!this.isPartyTpbInputtable() || this.needsActorInputCancel()) {
            this.cancelActorInput();
            this._currentActor = null;
            this._inputting = false;
        }
    }

    /** @returns {void} */
    static checkTpbInputOpen() {
        if (this.isPartyTpbInputtable()) {
            if (this._tpbNeedsPartyCommand) {
                this._inputting = true;
                this._tpbNeedsPartyCommand = false;
            } else {
                this.selectNextCommand();
            }
        }
    }

    /** @returns {boolean} */
    static isPartyTpbInputtable() {
        return $gameParty.canInput() && this.isTpbMainPhase();
    }

    /** @returns {boolean | null} */
    static needsActorInputCancel() {
        return this._currentActor && !this._currentActor.canInput();
    }

    /** @returns {boolean} */
    static isTpbMainPhase() {
        return ["turn", "turnEnd", "action"].includes(this._phase);
    }

    /** @returns {boolean} */
    static isInputting() {
        return this._inputting;
    }

    /** @returns {boolean} */
    static isInTurn() {
        return this._phase === "turn";
    }

    /** @returns {boolean} */
    static isTurnEnd() {
        return this._phase === "turnEnd";
    }

    /** @returns {boolean} */
    static isAborting() {
        return this._phase === "aborting";
    }

    /** @returns {boolean} */
    static isBattleEnd() {
        return this._phase === "battleEnd";
    }

    /** @returns {boolean} */
    static canEscape() {
        return this._canEscape;
    }

    /** @returns {boolean} */
    static canLose() {
        return this._canLose;
    }

    /** @returns {boolean} */
    static isEscaped() {
        return this._escaped;
    }

    /** @returns {Game_Actor | null} */
    static actor() {
        return this._currentActor;
    }

    /** @returns {void} */
    static startBattle() {
        this._phase = "start";
        $gameSystem.onBattleStart();
        $gameParty.onBattleStart(this._preemptive);
        $gameTroop.onBattleStart(this._surprise);
        this.displayStartMessages();
    }

    /** @returns {void} */
    static displayStartMessages() {
        for (const name of $gameTroop.enemyNames()) {
            $gameMessage.add(TextManager.emerge.format(name));
        }
        if (this._preemptive) {
            $gameMessage.add(TextManager.preemptive.format($gameParty.name()));
        } else if (this._surprise) {
            $gameMessage.add(TextManager.surprise.format($gameParty.name()));
        }
    }

    /** @returns {void} */
    static startInput() {
        this._phase = "input";
        this._inputting = true;
        $gameParty.makeActions();
        $gameTroop.makeActions();
        this._currentActor = null;
        if (this._surprise || !$gameParty.canInput()) {
            this.startTurn();
        }
    }

    /** @returns {Game_Action | null} */
    static inputtingAction() {
        return this._currentActor ? this._currentActor.inputtingAction() : null;
    }

    /** @returns {void} */
    static selectNextCommand() {
        if (this._currentActor) {
            if (this._currentActor.selectNextCommand()) {
                return;
            }
            this.finishActorInput();
        }
        this.selectNextActor();
    }

    /** @returns {void} */
    static selectNextActor() {
        this.changeCurrentActor(true);
        if (!this._currentActor) {
            if (this.isTpb()) {
                this.changeCurrentActor(true);
            } else {
                this.startTurn();
            }
        }
    }

    /** @returns {void} */
    static selectPreviousCommand() {
        if (this._currentActor) {
            if (this._currentActor.selectPreviousCommand()) {
                return;
            }
            this.cancelActorInput();
        }
        this.selectPreviousActor();
    }

    /** @returns {void} */
    static selectPreviousActor() {
        if (this.isTpb()) {
            this.changeCurrentActor(true);
            if (!this._currentActor) {
                this._inputting = $gameParty.canInput();
            }
        } else {
            this.changeCurrentActor(false);
        }
    }

    /**
     * @param {boolean} forward
     * @returns {void}
     */
    static changeCurrentActor(forward) {
        const members = $gameParty.battleMembers();
        let actor = this._currentActor;
        for (;;) {
            const currentIndex = members.indexOf(actor);
            actor = members[currentIndex + (forward ? 1 : -1)];
            if (!actor || actor.canInput()) {
                break;
            }
        }
        this._currentActor = actor ? actor : null;
        this.startActorInput();
    }

    /** @returns {void} */
    static startActorInput() {
        if (this._currentActor) {
            this._currentActor.setActionState("inputting");
            this._inputting = true;
        }
    }

    /** @returns {void} */
    static finishActorInput() {
        if (this._currentActor) {
            if (this.isTpb()) {
                this._currentActor.startTpbCasting();
            }
            this._currentActor.setActionState("waiting");
        }
    }

    /** @returns {void} */
    static cancelActorInput() {
        if (this._currentActor) {
            this._currentActor.setActionState("undecided");
        }
    }

    /** @returns {void} */
    static updateStart() {
        if (this.isTpb()) {
            this._phase = "turn";
        } else {
            this.startInput();
        }
    }

    /** @returns {void} */
    static startTurn() {
        this._phase = "turn";
        $gameTroop.increaseTurn();
        $gameParty.requestMotionRefresh();
        if (!this.isTpb()) {
            this.makeActionOrders();
            this._logWindow.startTurn();
            this._inputting = false;
        }
    }

    /**
     * @param {boolean} timeActive
     * @returns {void}
     */
    static updateTurn(timeActive) {
        $gameParty.requestMotionRefresh();
        if (this.isTpb() && timeActive) {
            this.updateTpb();
        }
        if (!this._subject) {
            this._subject = this.getNextSubject();
        }
        if (this._subject) {
            this.processTurn();
        } else if (!this.isTpb()) {
            this.endTurn();
        }
    }

    /** @returns {void} */
    static updateTpb() {
        $gameParty.updateTpb();
        $gameTroop.updateTpb();
        this.updateAllTpbBattlers();
        this.checkTpbTurnEnd();
    }

    /** @returns {void} */
    static updateAllTpbBattlers() {
        for (const battler of this.allBattleMembers()) {
            this.updateTpbBattler(battler);
        }
    }

    /**
     * @param {RMMZ.ActionTarget} battler
     * @returns {void}
     */
    static updateTpbBattler(battler) {
        if (battler.isTpbTurnEnd()) {
            battler.onTurnEnd();
            battler.startTpbTurn();
            this.displayBattlerStatus(battler, false);
        } else if (battler.isTpbReady()) {
            battler.startTpbAction();
            this._actionBattlers.push(battler);
        } else if (battler.isTpbTimeout()) {
            battler.onTpbTimeout();
            this.displayBattlerStatus(battler, true);
        }
    }

    /** @returns {void} */
    static checkTpbTurnEnd() {
        if ($gameTroop.isTpbTurnEnd()) {
            this.endTurn();
        }
    }

    /** @returns {void} */
    static processTurn() {
        const subject = this._subject;
        const action = subject.currentAction();
        if (action) {
            action.prepare();
            if (action.isValid()) {
                this.startAction();
            }
            subject.removeCurrentAction();
        } else {
            this.endAction();
            this._subject = null;
        }
    }

    /**
     * @param {RMMZ.ActionTarget} battler
     * @returns {void}
     */
    static endBattlerActions(battler) {
        battler.setActionState(this.isTpb() ? "undecided" : "done");
        battler.onAllActionsEnd();
        battler.clearTpbChargeTime();
        this.displayBattlerStatus(battler, true);
    }

    /** @returns {void} */
    static endTurn() {
        this._phase = "turnEnd";
        this._preemptive = false;
        this._surprise = false;
    }

    /** @returns {void} */
    static updateTurnEnd() {
        if (this.isTpb()) {
            this.startTurn();
        } else {
            this.endAllBattlersTurn();
            this._phase = "start";
        }
    }

    /** @returns {void} */
    static endAllBattlersTurn() {
        for (const battler of this.allBattleMembers()) {
            battler.onTurnEnd();
            this.displayBattlerStatus(battler, false);
        }
    }

    /**
     * @param {RMMZ.ActionTarget} battler
     * @param {boolean} current
     * @returns {void}
     */
    static displayBattlerStatus(battler, current) {
        this._logWindow.displayAutoAffectedStatus(battler);
        if (current) {
            this._logWindow.displayCurrentState(battler);
        }
        this._logWindow.displayRegeneration(battler);
    }

    /** @returns {RMMZ.ActionTarget | null} */
    static getNextSubject() {
        for (;;) {
            const battler = this._actionBattlers.shift();
            if (!battler) {
                return null;
            }
            if (battler.isBattleMember() && battler.isAlive()) {
                return battler;
            }
        }
    }

    /** @returns {(Game_Actor | import("../objects").Game_Enemy)[]} */
    static allBattleMembers() {
        return $gameParty.battleMembers().concat($gameTroop.members());
    }

    /** @returns {void} */
    static makeActionOrders() {
        const battlers = [];
        if (!this._surprise) {
            battlers.push(...$gameParty.battleMembers());
        }
        if (!this._preemptive) {
            battlers.push(...$gameTroop.members());
        }
        for (const battler of battlers) {
            battler.makeSpeed();
        }
        battlers.sort((a, b) => b.speed() - a.speed());
        this._actionBattlers = battlers;
    }

    /** @returns {void} */
    static startAction() {
        const subject = this._subject;
        const action = subject.currentAction();
        const targets = action.makeTargets();
        this._phase = "action";
        this._action = action;
        this._targets = targets;
        subject.cancelMotionRefresh();
        subject.useItem(action.item());
        this._action.applyGlobal();
        this._logWindow.startAction(subject, action, targets);
    }

    /** @returns {void} */
    static updateAction() {
        const target = this._targets.shift();
        if (target) {
            this.invokeAction(this._subject, target);
        } else {
            this.endAction();
        }
    }

    /** @returns {void} */
    static endAction() {
        this._logWindow.endAction(this._subject);
        this._phase = "turn";
        if (this._subject.numActions() === 0) {
            this.endBattlerActions(this._subject);
            this._subject = null;
        }
    }

    /**
     * @param {RMMZ.ActionTarget} subject
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    static invokeAction(subject, target) {
        this._logWindow.push("pushBaseLine");
        if (Math.random() < this._action.itemCnt(target)) {
            this.invokeCounterAttack(subject, target);
        } else if (Math.random() < this._action.itemMrf(target)) {
            this.invokeMagicReflection(subject, target);
        } else {
            this.invokeNormalAction(subject, target);
        }
        subject.setLastTarget(target);
        this._logWindow.push("popBaseLine");
    }

    /**
     * @param {RMMZ.ActionTarget} subject
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    static invokeNormalAction(subject, target) {
        const realTarget = this.applySubstitute(target);
        this._action.apply(realTarget);
        this._logWindow.displayActionResults(subject, realTarget);
    }

    /**
     * @param {RMMZ.ActionTarget} subject
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    static invokeCounterAttack(subject, target) {
        const action = new Game_Action(target);
        action.setAttack();
        action.apply(subject);
        this._logWindow.displayCounter(target);
        this._logWindow.displayActionResults(target, subject);
    }

    /**
     * @param {RMMZ.ActionTarget} subject
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    static invokeMagicReflection(subject, target) {
        this._action._reflectionTarget = target;
        this._logWindow.displayReflection(target);
        this._action.apply(subject);
        this._logWindow.displayActionResults(target, subject);
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {RMMZ.ActionTarget}
     */
    static applySubstitute(target) {
        if (this.checkSubstitute(target)) {
            const substitute = target.friendsUnit().substituteBattler(target);
            if (substitute) {
                this._logWindow.displaySubstitute(substitute, target);
                return substitute;
            }
        }
        return target;
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {boolean}
     */
    static checkSubstitute(target) {
        return target.isDying() && !this._action.isCertainHit();
    }

    /** @returns {boolean} */
    static isActionForced() {
        return (
            !!this._actionForcedBattler &&
            !$gameParty.isAllDead() &&
            !$gameTroop.isAllDead()
        );
    }

    /**
     * @param {RMMZ.ActionTarget} battler
     * @returns {void}
     */
    static forceAction(battler) {
        if (battler.numActions() > 0) {
            this._actionForcedBattler = battler;
            this._actionBattlers.remove(battler);
        }
    }

    /** @returns {void} */
    static processForcedAction() {
        if (this._actionForcedBattler) {
            if (this._subject) {
                this.endBattlerActions(this._subject);
            }
            this._subject = this._actionForcedBattler;
            this._actionForcedBattler = null;
            this.startAction();
            this._subject.removeCurrentAction();
        }
    }

    /** @returns {void} */
    static abort() {
        this._phase = "aborting";
    }

    /** @returns {boolean} */
    static checkBattleEnd() {
        if (this._phase) {
            if ($gameParty.isEscaped()) {
                this.processPartyEscape();
                return true;
            } else if ($gameParty.isAllDead()) {
                this.processDefeat();
                return true;
            } else if ($gameTroop.isAllDead()) {
                this.processVictory();
                return true;
            }
        }
        return false;
    }

    /** @returns {boolean} */
    static checkAbort() {
        if (this.isAborting()) {
            this.processAbort();
            return true;
        }
        return false;
    }

    /** @returns {void} */
    static processVictory() {
        $gameParty.removeBattleStates();
        $gameParty.performVictory();
        this.playVictoryMe();
        this.replayBgmAndBgs();
        this.makeRewards();
        this.displayVictoryMessage();
        this.displayRewards();
        this.gainRewards();
        this.endBattle(0);
    }

    /** @returns {boolean} */
    static processEscape() {
        $gameParty.performEscape();
        SoundManager.playEscape();
        const success = this._preemptive || Math.random() < this._escapeRatio;
        if (success) {
            this.onEscapeSuccess();
        } else {
            this.onEscapeFailure();
        }
        return success;
    }

    /** @returns {void} */
    static onEscapeSuccess() {
        this.displayEscapeSuccessMessage();
        this._escaped = true;
        this.processAbort();
    }

    /** @returns {void} */
    static onEscapeFailure() {
        $gameParty.onEscapeFailure();
        this.displayEscapeFailureMessage();
        this._escapeRatio += 0.1;
        if (!this.isTpb()) {
            this.startTurn();
        }
    }

    /** @returns {void} */
    static processPartyEscape() {
        this._escaped = true;
        this.processAbort();
    }

    /** @returns {void} */
    static processAbort() {
        $gameParty.removeBattleStates();
        this._logWindow.clear();
        this.replayBgmAndBgs();
        this.endBattle(1);
    }

    /** @returns {void} */
    static processDefeat() {
        this.displayDefeatMessage();
        this.playDefeatMe();
        if (this._canLose) {
            this.replayBgmAndBgs();
        } else {
            AudioManager.stopBgm();
        }
        this.endBattle(2);
    }

    /**
     * @param {number} result
     * @returns {void}
     */
    static endBattle(result) {
        this._phase = "battleEnd";
        this.cancelActorInput();
        this._inputting = false;
        if (this._eventCallback) {
            this._eventCallback(result);
        }
        if (result === 0) {
            $gameSystem.onBattleWin();
        } else if (this._escaped) {
            $gameSystem.onBattleEscape();
        }
        $gameTemp.clearCommonEventReservation();
    }

    /** @returns {void} */
    static updateBattleEnd() {
        if (this.isBattleTest()) {
            AudioManager.stopBgm();
            SceneManager.exit();
        } else if (!this._escaped && $gameParty.isAllDead()) {
            if (this._canLose) {
                $gameParty.reviveBattleMembers();
                SceneManager.pop();
            } else {
                SceneManager.goto(Scene_Gameover);
            }
        } else {
            SceneManager.pop();
        }
        this._phase = "";
    }

    /** @returns {void} */
    static makeRewards() {
        this._rewards = {
            gold: $gameTroop.goldTotal(),
            exp: $gameTroop.expTotal(),
            items: $gameTroop.makeDropItems()
        };
    }

    /** @returns {void} */
    static displayVictoryMessage() {
        $gameMessage.add(TextManager.victory.format($gameParty.name()));
    }

    /** @returns {void} */
    static displayDefeatMessage() {
        $gameMessage.add(TextManager.defeat.format($gameParty.name()));
    }

    /** @returns {void} */
    static displayEscapeSuccessMessage() {
        $gameMessage.add(TextManager.escapeStart.format($gameParty.name()));
    }

    /** @returns {void} */
    static displayEscapeFailureMessage() {
        $gameMessage.add(TextManager.escapeStart.format($gameParty.name()));
        $gameMessage.add("\\." + TextManager.escapeFailure);
    }

    /** @returns {void} */
    static displayRewards() {
        this.displayExp();
        this.displayGold();
        this.displayDropItems();
    }

    /** @returns {void} */
    static displayExp() {
        const exp = this._rewards.exp;
        if (exp > 0) {
            const text = TextManager.obtainExp.format(exp, TextManager.exp);
            $gameMessage.add("\\." + text);
        }
    }

    /** @returns {void} */
    static displayGold() {
        const gold = this._rewards.gold;
        if (gold > 0) {
            $gameMessage.add("\\." + TextManager.obtainGold.format(gold));
        }
    }

    /** @returns {void} */
    static displayDropItems() {
        const items = this._rewards.items;
        if (items.length > 0) {
            $gameMessage.newPage();
            for (const item of items) {
                $gameMessage.add(TextManager.obtainItem.format(item.name));
            }
        }
    }

    /** @returns {void} */
    static gainRewards() {
        this.gainExp();
        this.gainGold();
        this.gainDropItems();
    }

    /** @returns {void} */
    static gainExp() {
        const exp = this._rewards.exp;
        for (const actor of $gameParty.allMembers()) {
            actor.gainExp(exp);
        }
    }

    /** @returns {void} */
    static gainGold() {
        $gameParty.gainGold(this._rewards.gold);
    }

    /** @returns {void} */
    static gainDropItems() {
        const items = this._rewards.items;
        for (const item of items) {
            $gameParty.gainItem(item, 1);
        }
    }
}

/**
 * The static class that manages the plugins.
 */
class PluginManager {
    constructor() {
        throw new Error("This is a static class");
    }

    /** @type {string[]} */
    static _scripts = [];

    /** @type {string[]} */
    static _errorUrls = [];

    /** @type {Record<string, Record<string, unknown>>} */
    static _parameters = {};

    /** @type {Record<string, (...args: unknown[]) => void>} */
    static _commands = {};

    /**
     * @param {RMMZ.DataPlugin[]} plugins
     * @returns {void}
     */
    static setup(plugins) {
        for (const plugin of plugins) {
            const pluginName = Utils.extractFileName(plugin.name);
            if (plugin.status && !this._scripts.includes(pluginName)) {
                this.setParameters(pluginName, plugin.parameters);
                this.loadScript(plugin.name);
                this._scripts.push(pluginName);
            }
        }
    }

    /**
     * @param {string} name
     * @returns {Record<string, unknown>}
     */
    static parameters(name) {
        return this._parameters[name.toLowerCase()] || {};
    }

    /**
     * @param {string} name
     * @param {Record<string, unknown>} parameters
     * @returns {void}
     */
    static setParameters(name, parameters) {
        this._parameters[name.toLowerCase()] = parameters;
    }

    /**
     * @param {string} filename
     * @returns {void}
     */
    static loadScript(filename) {
        const url = this.makeUrl(filename);
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.async = false;
        script.defer = true;
        script.onerror = this.onError.bind(this);
        script._url = url;
        document.body.appendChild(script);
    }

    /**
     * @param {Event | string} e
     * @returns {void}
     */
    static onError(e) {
        this._errorUrls.push(e.target._url);
    }

    /**
     * @param {string} filename
     * @returns {string}
     */
    static makeUrl(filename) {
        return "js/plugins/" + Utils.encodeURI(filename) + ".js";
    }

    /** @returns {void} */
    static checkErrors() {
        const url = this._errorUrls.shift();
        if (url) {
            this.throwLoadError(url);
        }
    }

    /**
     * @param {string} url
     * @returns {void}
     */
    static throwLoadError(url) {
        throw new Error("Failed to load: " + url);
    }

    /**
     * @template {RMMZ.PluginParameters} T
     * @param {string} pluginName
     * @param {string} commandName
     * @param {(args: T) => void} func
     * @returns {void}
     */
    static registerCommand(pluginName, commandName, func) {
        const key = pluginName + ":" + commandName;
        this._commands[key] = func;
    }

    /**
     * @param {unknown} self
     * @param {string} pluginName
     * @param {string} commandName
     * @param {unknown[]} args
     * @returns {void}
     */
    static callCommand(self, pluginName, commandName, args) {
        const key = pluginName + ":" + commandName;
        const func = this._commands[key];
        if (typeof func === "function") {
            func.bind(self)(args);
        }
    }
}

// Class declarations are lexical bindings, while plugins and JsonEx resolve
// constructors through the global object, so expose them as global properties.
Object.assign(globalThis, {
    DataManager,
    ConfigManager,
    StorageManager,
    FontManager,
    ImageManager,
    EffectManager,
    AudioManager,
    SoundManager,
    TextManager,
    ColorManager,
    SceneManager,
    BattleManager,
    PluginManager,
});
