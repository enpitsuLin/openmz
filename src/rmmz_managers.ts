// rmmz_managers.js v2.0.0

/**
 * The static class that manages the database and game objects.
 */
class DataManager {
    constructor() {
        throw new Error("This is a static class");
    }

    static _globalInfo: RMMZ.DataGlobalInfo | null = null;

    static _errors: {
        name: string;
        src: string;
        url: string;
    }[] = [];

    static _databaseFiles: readonly [
        {
            readonly name: "$dataActors";
            readonly src: "Actors.json";
        },
        {
            readonly name: "$dataClasses";
            readonly src: "Classes.json";
        },
        {
            readonly name: "$dataSkills";
            readonly src: "Skills.json";
        },
        {
            readonly name: "$dataItems";
            readonly src: "Items.json";
        },
        {
            readonly name: "$dataWeapons";
            readonly src: "Weapons.json";
        },
        {
            readonly name: "$dataArmors";
            readonly src: "Armors.json";
        },
        {
            readonly name: "$dataEnemies";
            readonly src: "Enemies.json";
        },
        {
            readonly name: "$dataTroops";
            readonly src: "Troops.json";
        },
        {
            readonly name: "$dataStates";
            readonly src: "States.json";
        },
        {
            readonly name: "$dataAnimations";
            readonly src: "Animations.json";
        },
        {
            readonly name: "$dataTilesets";
            readonly src: "Tilesets.json";
        },
        {
            readonly name: "$dataCommonEvents";
            readonly src: "CommonEvents.json";
        },
        {
            readonly name: "$dataSystem";
            readonly src: "System.json";
        },
        {
            readonly name: "$dataMapInfos";
            readonly src: "MapInfos.json";
        },
    ] = [
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
        { name: "$dataMapInfos", src: "MapInfos.json" },
    ];

    static loadGlobalInfo(): void {
        RmmzStorageManager.loadObject("global")
            .then((globalInfo) => {
                this._globalInfo = globalInfo as RMMZ.DataGlobalInfo | null;
                this.removeInvalidGlobalInfo();
                return 0;
            })
            .catch(() => {
                this._globalInfo = [];
            });
    }

    static removeInvalidGlobalInfo(): void {
        const globalInfo = this._globalInfo;
        for (const info of globalInfo!) {
            const savefileId = globalInfo!.indexOf(info);
            if (!this.savefileExists(savefileId)) {
                delete globalInfo![savefileId];
            }
        }
    }

    static saveGlobalInfo(): void {
        RmmzStorageManager.saveObject("global", this._globalInfo);
    }

    static isGlobalInfoLoaded(): boolean {
        return !!this._globalInfo;
    }

    static loadDatabase(): void {
        const test = this.isBattleTest() || this.isEventTest();
        const prefix = test ? "Test_" : "";
        for (const databaseFile of this._databaseFiles) {
            this.loadDataFile(databaseFile.name, prefix + databaseFile.src);
        }
        if (this.isEventTest()) {
            this.loadDataFile("$testEvent", prefix + "Event.json");
        }
    }

    static loadDataFile(name: string, src: string): void {
        const xhr = new XMLHttpRequest();
        const url = "data/" + src;
        (window as unknown as Record<string, unknown>)[name] = null;
        xhr.open("GET", url);
        xhr.overrideMimeType("application/json");
        xhr.onload = () => this.onXhrLoad(xhr, name, src, url);
        xhr.onerror = () => this.onXhrError(name, src, url);
        xhr.send();
    }

    static onXhrLoad(xhr: XMLHttpRequest, name: string, src: string, url: string): void {
        if (xhr.status < 400) {
            (window as unknown as Record<string, unknown>)[name] = JSON.parse(xhr.responseText);
            this.onLoad((window as unknown as Record<string, unknown>)[name]);
        } else {
            this.onXhrError(name, src, url);
        }
    }

    static onXhrError(name: string, src: string, url: string): void {
        const error = { name: name, src: src, url: url };
        this._errors.push(error);
    }

    static isDatabaseLoaded(): boolean {
        this.checkError();
        for (const databaseFile of this._databaseFiles) {
            if (!(window as unknown as Record<string, unknown>)[databaseFile.name]) {
                return false;
            }
        }
        return true;
    }

    static loadMapData(mapId: number): void {
        if (mapId > 0) {
            const filename = "Map%1.json".format(mapId.padZero(3));
            this.loadDataFile("$dataMap", filename);
        } else {
            this.makeEmptyMap();
        }
    }

    static makeEmptyMap(): void {
        $dataMap = {} as RMMZ.DataMap;
        $dataMap.data = [];
        $dataMap.events = [];
        $dataMap.width = 100;
        $dataMap.height = 100;
        $dataMap.scrollType = 3;
    }

    static isMapLoaded(): boolean {
        this.checkError();
        return !!$dataMap;
    }

    static onLoad(object: unknown): void {
        if (this.isMapObject(object)) {
            this.extractMetadata(object);
            this.extractArrayMetadata(object.events);
        } else {
            this.extractArrayMetadata(object);
        }
    }

    static isMapObject(object: unknown): object is RMMZ.DataMap {
        return !!((object as RMMZ.DataMap).data && (object as RMMZ.DataMap).events);
    }

    static extractArrayMetadata(array: unknown): void {
        if (Array.isArray(array)) {
            for (const data of array) {
                if (data && "note" in data) {
                    this.extractMetadata(data);
                }
            }
        }
    }

    static extractMetadata(data: { note: string; meta?: RMMZ.Meta }): void {
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

    static checkError(): void {
        if (this._errors.length > 0) {
            const error = this._errors.shift();
            const retry = () => {
                this.loadDataFile(error!.name, error!.src);
            };
            throw ["LoadError", error!.url, retry];
        }
    }

    static isBattleTest(): boolean {
        return Utils.isOptionValid("btest");
    }

    static isEventTest(): boolean {
        return Utils.isOptionValid("etest");
    }

    static isTitleSkip(): boolean {
        return Utils.isOptionValid("tskip");
    }

    static isSkill(item: unknown): item is RMMZ.DataSkill {
        return !!(item && $dataSkills.includes(item as RMMZ.DataSkill));
    }

    static isItem(item: unknown): item is RMMZ.DataItem {
        return !!(item && $dataItems.includes(item as RMMZ.DataItem));
    }

    static isWeapon(item: unknown): item is RMMZ.DataWeapon {
        return !!(item && $dataWeapons.includes(item as RMMZ.DataWeapon));
    }

    static isArmor(item: unknown): item is RMMZ.DataArmor {
        return !!(item && $dataArmors.includes(item as RMMZ.DataArmor));
    }

    static createGameObjects(): void {
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

    static setupNewGame(): void {
        this.createGameObjects();
        this.selectSavefileForNewGame();
        $gameParty.setupStartingMembers();
        $gamePlayer.setupForNewGame();
        Graphics.frameCount = 0;
    }

    static setupBattleTest(): void {
        this.createGameObjects();
        $gameParty.setupBattleTest();
        BattleManager.setup($dataSystem.testTroopId, true, false);
        BattleManager.setBattleTest(true);
        BattleManager.playBattleBgm();
    }

    static setupEventTest(): void {
        this.createGameObjects();
        this.selectSavefileForNewGame();
        $gameParty.setupStartingMembers();
        $gamePlayer.reserveTransfer(-1, 8, 6);
        $gamePlayer.setTransparent(false);
    }

    static isAnySavefileExists(): boolean {
        return this._globalInfo!.some((x) => x);
    }

    static latestSavefileId(): number {
        const globalInfo = this._globalInfo;
        const validInfo = globalInfo!.slice(1).filter((x) => x);
        const latest = Math.max(...validInfo.map((x) => x!.timestamp));
        const index = globalInfo!.findIndex((x) => x && x.timestamp === latest);
        return index > 0 ? index : 0;
    }

    static earliestSavefileId(): number {
        const globalInfo = this._globalInfo;
        const validInfo = globalInfo!.slice(1).filter((x) => x);
        const earliest = Math.min(...validInfo.map((x) => x!.timestamp));
        const index = globalInfo!.findIndex((x) => x && x.timestamp === earliest);
        return index > 0 ? index : 0;
    }

    static emptySavefileId(): number {
        const globalInfo = this._globalInfo;
        const maxSavefiles = this.maxSavefiles();
        if (globalInfo!.length < maxSavefiles) {
            return Math.max(1, globalInfo!.length);
        } else {
            const index = globalInfo!.slice(1).findIndex((x) => !x);
            return index >= 0 ? index + 1 : -1;
        }
    }

    static loadAllSavefileImages(): void {
        for (const info of this._globalInfo!.filter((x) => x)) {
            this.loadSavefileImages(info!);
        }
    }

    static loadSavefileImages(info: RMMZ.DataSaveInfo): void {
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

    static maxSavefiles(): number {
        return 20;
    }

    static savefileInfo(savefileId: number): RMMZ.DataSaveInfo | null | undefined {
        const globalInfo = this._globalInfo;
        return globalInfo![savefileId] ? globalInfo![savefileId] : null;
    }

    static savefileExists(savefileId: number): boolean {
        const saveName = this.makeSavename(savefileId);
        return RmmzStorageManager.exists(saveName);
    }

    static saveGame(savefileId: number): Promise<number> {
        const contents = this.makeSaveContents();
        const saveName = this.makeSavename(savefileId);
        return RmmzStorageManager.saveObject(saveName, contents).then(() => {
            this._globalInfo![savefileId] = this.makeSavefileInfo();
            this.saveGlobalInfo();
            return 0;
        });
    }

    static loadGame(savefileId: number): Promise<number> {
        const saveName = this.makeSavename(savefileId);
        return RmmzStorageManager.loadObject(saveName).then((contents) => {
            this.createGameObjects();
            this.extractSaveContents(contents as RMMZ.SaveContents);
            this.correctDataErrors();
            return 0;
        });
    }

    static makeSavename(savefileId: number): string {
        return "file%1".format(savefileId);
    }

    static selectSavefileForNewGame(): void {
        const emptySavefileId = this.emptySavefileId();
        const earliestSavefileId = this.earliestSavefileId();
        if (emptySavefileId > 0) {
            $gameSystem.setSavefileId(emptySavefileId);
        } else {
            $gameSystem.setSavefileId(earliestSavefileId);
        }
    }

    static makeSavefileInfo(): RMMZ.DataSaveInfo {
        const info = {} as RMMZ.DataSaveInfo;
        info.title = $dataSystem.gameTitle;
        info.characters = $gameParty.charactersForSavefile();
        info.faces = $gameParty.facesForSavefile();
        info.playtime = $gameSystem.playtimeText();
        info.timestamp = Date.now();
        return info;
    }

    static makeSaveContents(): RMMZ.SaveContents {
        // A save data does not contain $gameTemp, $gameMessage, and $gameTroop.
        const contents = {} as RMMZ.SaveContents;
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

    static extractSaveContents(contents: RMMZ.SaveContents): void {
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

    static correctDataErrors(): void {
        $gameParty.removeInvalidMembers();
    }
}

$dataActors = null!;
$dataClasses = null!;
$dataSkills = null!;
$dataItems = null!;
$dataWeapons = null!;
$dataArmors = null!;
$dataEnemies = null!;
$dataTroops = null!;
$dataStates = null!;
$dataAnimations = null!;
$dataTilesets = null!;
$dataCommonEvents = null!;
$dataSystem = null!;
$dataMapInfos = null!;
$dataMap = null!;
$gameTemp = null!;
$gameSystem = null!;
$gameScreen = null!;
$gameTimer = null!;
$gameMessage = null!;
$gameSwitches = null!;
$gameVariables = null!;
$gameSelfSwitches = null!;
$gameActors = null!;
$gameParty = null!;
$gameTroop = null!;
$gameMap = null!;
$gamePlayer = null!;
$testEvent = null;

/**
 * The static class that manages the configuration data.
 */
class ConfigManager {
    constructor() {
        throw new Error("This is a static class");
    }

    static alwaysDash: boolean = false;

    static commandRemember: boolean = false;

    static touchUI: boolean = true;

    static _isLoaded: boolean = false;

    static get bgmVolume(): number {
        return AudioManager._bgmVolume;
    }

    static set bgmVolume(value: number) {
        AudioManager.bgmVolume = value;
    }

    static get bgsVolume(): number {
        return AudioManager.bgsVolume;
    }

    static set bgsVolume(value: number) {
        AudioManager.bgsVolume = value;
    }

    static get meVolume(): number {
        return AudioManager.meVolume;
    }

    static set meVolume(value: number) {
        AudioManager.meVolume = value;
    }

    static get seVolume(): number {
        return AudioManager.seVolume;
    }

    static set seVolume(value: number) {
        AudioManager.seVolume = value;
    }

    static load(): void {
        RmmzStorageManager.loadObject("config")
            .then((config) => this.applyData(config || {}))
            .catch(() => 0)
            .then(() => {
                this._isLoaded = true;
                return 0;
            })
            .catch(() => 0);
    }

    static save(): void {
        RmmzStorageManager.saveObject("config", this.makeData());
    }

    static isLoaded(): boolean {
        return this._isLoaded;
    }

    static makeData(): RMMZ.DataConfig {
        const config = {} as RMMZ.DataConfig;
        config.alwaysDash = this.alwaysDash;
        config.commandRemember = this.commandRemember;
        config.touchUI = this.touchUI;
        config.bgmVolume = this.bgmVolume;
        config.bgsVolume = this.bgsVolume;
        config.meVolume = this.meVolume;
        config.seVolume = this.seVolume;
        return config;
    }

    static applyData(config: Partial<RMMZ.DataConfig>): void {
        this.alwaysDash = this.readFlag(config, "alwaysDash", false);
        this.commandRemember = this.readFlag(config, "commandRemember", false);
        this.touchUI = this.readFlag(config, "touchUI", true);
        this.bgmVolume = this.readVolume(config, "bgmVolume");
        this.bgsVolume = this.readVolume(config, "bgsVolume");
        this.meVolume = this.readVolume(config, "meVolume");
        this.seVolume = this.readVolume(config, "seVolume");
    }

    static readFlag(config: Partial<RMMZ.DataConfig>, name: keyof RMMZ.DataConfig, defaultValue: boolean): boolean {
        if (name in config) {
            return !!config[name];
        } else {
            return defaultValue;
        }
    }

    static readVolume(config: Partial<RMMZ.DataConfig>, name: keyof RMMZ.DataConfig): number {
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
class RmmzStorageManager {
    constructor() {
        throw new Error("This is a static class");
    }

    static _forageKeys: string[] = [];

    static _forageKeysUpdated: boolean = false;

    static isLocalMode(): boolean {
        return Utils.isNwjs();
    }

    static saveObject<T>(saveName: string, object: T): Promise<number | void> {
        return this.objectToJson(object)
            .then((json) => this.jsonToZip(json))
            .then((zip) => this.saveZip(saveName, zip));
    }

    static loadObject<T>(saveName: string): Promise<T> {
        return this.loadZip(saveName)
            .then((zip) => this.zipToJson(zip))
            .then((json) => this.jsonToObject(json));
    }

    static objectToJson<T>(object: T): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                const json = JsonEx.stringify(object);
                resolve(json);
            } catch (e) {
                reject(e);
            }
        });
    }

    static jsonToObject<T>(json: string): Promise<T> {
        return new Promise((resolve, reject) => {
            try {
                const object = JsonEx.parse(json);
                resolve(object);
            } catch (e) {
                reject(e);
            }
        });
    }

    static jsonToZip(json: string): Promise<string> {
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

    static zipToJson(zip: string): Promise<string> {
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

    static saveZip(saveName: string, zip: string): Promise<void | number> {
        if (this.isLocalMode()) {
            return this.saveToLocalFile(saveName, zip);
        } else {
            return this.saveToForage(saveName, zip);
        }
    }

    static loadZip(saveName: string): Promise<string> {
        if (this.isLocalMode()) {
            return this.loadFromLocalFile(saveName);
        } else {
            return this.loadFromForage(saveName);
        }
    }

    static exists(saveName: string): boolean {
        if (this.isLocalMode()) {
            return this.localFileExists(saveName);
        } else {
            return this.forageExists(saveName);
        }
    }

    static remove(saveName: string): void | Promise<number> {
        if (this.isLocalMode()) {
            return this.removeLocalFile(saveName);
        } else {
            return this.removeForage(saveName);
        }
    }

    static saveToLocalFile(saveName: string, zip: string): Promise<void> {
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
                } catch {
                    //
                }
                reject(e);
            }
        });
    }

    static loadFromLocalFile(saveName: string): Promise<string> {
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

    static localFileExists(saveName: string): boolean {
        const fs = require("fs");
        return fs.existsSync(this.filePath(saveName));
    }

    static removeLocalFile(saveName: string): void {
        this.fsUnlink(this.filePath(saveName));
    }

    static saveToForage(saveName: string, zip: string): Promise<number> {
        const key = this.forageKey(saveName);
        const testKey = this.forageTestKey();
        setTimeout(() => localforage.removeItem(testKey));
        return localforage
            .setItem(testKey, zip)
            .then(() => localforage.setItem(key, zip))
            .then(() => this.updateForageKeys());
    }

    static loadFromForage(saveName: string): Promise<string> {
        const key = this.forageKey(saveName);
        return localforage.getItem(key) as Promise<string>;
    }

    static forageExists(saveName: string): boolean {
        const key = this.forageKey(saveName);
        return this._forageKeys.includes(key);
    }

    static removeForage(saveName: string): Promise<number> {
        const key = this.forageKey(saveName);
        return localforage.removeItem(key).then(() => this.updateForageKeys());
    }

    static updateForageKeys(): Promise<number> {
        this._forageKeysUpdated = false;
        return localforage.keys().then((keys) => {
            this._forageKeys = keys;
            this._forageKeysUpdated = true;
            return 0;
        });
    }

    static forageKeysUpdated(): boolean {
        return this._forageKeysUpdated;
    }

    static fsMkdir(path: string): void {
        const fs = require("fs");
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    }

    static fsRename(oldPath: string, newPath: string): void {
        const fs = require("fs");
        if (fs.existsSync(oldPath)) {
            fs.renameSync(oldPath, newPath);
        }
    }

    static fsUnlink(path: string): void {
        const fs = require("fs");
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
    }

    static fsReadFile(path: string): string | null {
        const fs = require("fs");
        if (fs.existsSync(path)) {
            return fs.readFileSync(path, { encoding: "utf8" });
        } else {
            return null;
        }
    }

    static fsWriteFile(path: string, data: string): void {
        const fs = require("fs");
        fs.writeFileSync(path, data);
    }

    static fileDirectoryPath(): string {
        const path = require("path");
        const base = path.dirname((process.mainModule as NodeModule).filename);
        return path.join(base, "save/");
    }

    static filePath(saveName: string): string {
        const dir = this.fileDirectoryPath();
        return dir + saveName + ".rmmzsave";
    }

    static forageKey(saveName: string): string {
        const gameId = $dataSystem.advanced.gameId;
        return "rmmzsave." + gameId + "." + saveName;
    }

    static forageTestKey(): string {
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

    static _urls: Record<string, string> = {};

    static _states: Record<string, string> = {};

    static load(family: string, filename: string): void {
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

    static isReady(): boolean {
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

    static startLoading(family: string, url: string): void {
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

    static throwLoadError(family: string): void {
        const url = this._urls[family];
        const retry = () => this.startLoading(family, url);
        throw ["LoadError", url, retry];
    }

    static makeUrl(filename: string): string {
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

    static standardIconWidth: number = 32;

    static standardIconHeight: number = 32;

    static standardFaceWidth: number = 144;

    static standardFaceHeight: number = 144;

    static _cache: Record<string, Bitmap> = {};

    static _system: Record<string, Bitmap> = {};

    static _emptyBitmap: Bitmap = new Bitmap(1, 1);

    static get iconWidth(): number {
        return this.getIconSize();
    }

    static get iconHeight(): number {
        return this.getIconSize();
    }

    static get faceWidth(): number {
        return this.getFaceSize();
    }

    static get faceHeight(): number {
        return this.getFaceSize();
    }

    static getIconSize(): number {
        if ("iconSize" in $dataSystem) {
            return $dataSystem.iconSize!;
        } else {
            return this.standardIconWidth;
        }
    }

    static getFaceSize(): number {
        if ("faceSize" in $dataSystem) {
            return $dataSystem.faceSize!;
        } else {
            return this.standardFaceWidth;
        }
    }

    static loadAnimation(filename: string): Bitmap {
        return this.loadBitmap("img/animations/", filename);
    }

    static loadBattleback1(filename: string): Bitmap {
        return this.loadBitmap("img/battlebacks1/", filename);
    }

    static loadBattleback2(filename: string): Bitmap {
        return this.loadBitmap("img/battlebacks2/", filename);
    }

    static loadEnemy(filename: string): Bitmap {
        return this.loadBitmap("img/enemies/", filename);
    }

    static loadCharacter(filename: string): Bitmap {
        return this.loadBitmap("img/characters/", filename);
    }

    static loadFace(filename: string): Bitmap {
        return this.loadBitmap("img/faces/", filename);
    }

    static loadParallax(filename: string): Bitmap {
        return this.loadBitmap("img/parallaxes/", filename);
    }

    static loadPicture(filename: string): Bitmap {
        return this.loadBitmap("img/pictures/", filename);
    }

    static loadSvActor(filename: string): Bitmap {
        return this.loadBitmap("img/sv_actors/", filename);
    }

    static loadSvEnemy(filename: string): Bitmap {
        return this.loadBitmap("img/sv_enemies/", filename);
    }

    static loadSystem(filename: string): Bitmap {
        return this.loadBitmap("img/system/", filename);
    }

    static loadTileset(filename: string): Bitmap {
        return this.loadBitmap("img/tilesets/", filename);
    }

    static loadTitle1(filename: string): Bitmap {
        return this.loadBitmap("img/titles1/", filename);
    }

    static loadTitle2(filename: string): Bitmap {
        return this.loadBitmap("img/titles2/", filename);
    }

    static loadBitmap(folder: string, filename: string): Bitmap {
        if (filename) {
            const url = folder + Utils.encodeURI(filename) + ".png";
            return this.loadBitmapFromUrl(url);
        } else {
            return this._emptyBitmap;
        }
    }

    static loadBitmapFromUrl(url: string): Bitmap {
        const cache = url.includes("/system/") ? this._system : this._cache;
        if (!cache[url]) {
            cache[url] = Bitmap.load(url);
        }
        return cache[url];
    }

    static clear(): void {
        const cache = this._cache;
        for (const url in cache) {
            cache[url].destroy();
        }
        this._cache = {};
    }

    static isReady(): boolean {
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

    static throwLoadError(bitmap: Bitmap): void {
        const retry = bitmap.retry.bind(bitmap);
        throw ["LoadError", bitmap.url, retry];
    }

    static isObjectCharacter(filename: string): boolean {
        const sign = Utils.extractFileName(filename).match(/^[!$]+/);
        return (sign && sign[0].includes("!"))!;
    }

    static isBigCharacter(filename: string): boolean {
        const sign = Utils.extractFileName(filename).match(/^[!$]+/);
        return (sign && sign[0].includes("$"))!;
    }

    static isZeroParallax(filename: string): boolean {
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

    static _cache: Record<string, effekseer.EffekseerEffect> = {};

    static _errorUrls: string[] = [];

    static load(filename?: string): effekseer.EffekseerEffect | null {
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

    static startLoading(url: string): effekseer.EffekseerEffect {
        const onLoad = () => this.onLoad(url);
        const onError = (message: string, url: string) => this.onError(url);
        const effect = Graphics.effekseer.loadEffect(url, 1, onLoad, onError);
        this._cache[url] = effect;
        return effect;
    }

    static clear(): void {
        for (const url in this._cache) {
            const effect = this._cache[url];
            Graphics.effekseer.releaseEffect(effect);
        }
        this._cache = {};
    }

    static onLoad(..._extra: any[]): void;
    static onLoad(/*url*/): void {
        //
    }

    static onError(url: string): void {
        this._errorUrls.push(url);
    }

    static makeUrl(filename: string): string {
        return "effects/" + Utils.encodeURI(filename) + ".efkefc";
    }

    static checkErrors(): void {
        const url = this._errorUrls.shift();
        if (url) {
            this.throwLoadError(url);
        }
    }

    static throwLoadError(url: string): void {
        const retry = () => this.startLoading(url);
        throw ["LoadError", url, retry];
    }

    static isReady(): boolean {
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
    declare static _currentMe: RMMZ.DataAudio | null;

    declare _bgmVolume: number;
    declare _bgsVolume: number;
    declare _meVolume: number;
    declare _seVolume: number;

    constructor() {
        throw new Error("This is a static class");
    }

    static _bgmVolume: number = 100;

    static _bgsVolume: number = 100;

    static _meVolume: number = 100;

    static _seVolume: number = 100;

    static _currentBgm: RMMZ.DataAudio | null = null;

    static _currentBgs: RMMZ.DataAudio | null = null;

    static _bgmBuffer: WebAudio | null = null;

    static _bgsBuffer: WebAudio | null = null;

    static _meBuffer: WebAudio | null = null;

    static _seBuffers: WebAudio[] = [];

    static _staticBuffers: WebAudio[] = [];

    static _replayFadeTime: number = 0.5;

    static _path: string = "audio/";

    static get bgmVolume(): number {
        return this._bgmVolume;
    }

    static set bgmVolume(value: number) {
        this._bgmVolume = value;
        this.updateBgmParameters(this._currentBgm);
    }

    static get bgsVolume(): number {
        return this._bgsVolume;
    }

    static set bgsVolume(value: number) {
        this._bgsVolume = value;
        this.updateBgsParameters(this._currentBgs);
    }

    static get meVolume(): number {
        return this._meVolume;
    }

    static set meVolume(value: number) {
        this._meVolume = value;
        this.updateMeParameters(this._currentMe);
    }

    static get seVolume(): number {
        return this._seVolume;
    }

    static set seVolume(value: number) {
        this._seVolume = value;
    }

    static playBgm(bgm: RMMZ.DataAudio, pos?: number): void {
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

    static replayBgm(bgm: RMMZ.DataAudio): void {
        if (this.isCurrentBgm(bgm)) {
            this.updateBgmParameters(bgm);
        } else {
            this.playBgm(bgm, bgm.pos);
            if (this._bgmBuffer) {
                this._bgmBuffer.fadeIn(this._replayFadeTime);
            }
        }
    }

    static isCurrentBgm(bgm: RMMZ.DataAudio): boolean | null {
        return this._currentBgm && this._bgmBuffer && this._currentBgm.name === bgm.name;
    }

    static updateBgmParameters(bgm: RMMZ.DataAudio | null): void {
        this.updateBufferParameters(this._bgmBuffer, this._bgmVolume, bgm);
    }

    static updateCurrentBgm(bgm: RMMZ.DataAudio, pos?: number): void {
        this._currentBgm = {
            name: bgm.name,
            volume: bgm.volume,
            pitch: bgm.pitch,
            pan: bgm.pan,
            pos: pos,
        };
    }

    static stopBgm(): void {
        if (this._bgmBuffer) {
            this._bgmBuffer.destroy();
            this._bgmBuffer = null;
            this._currentBgm = null;
        }
    }

    static fadeOutBgm(duration: number): void {
        if (this._bgmBuffer && this._currentBgm) {
            this._bgmBuffer.fadeOut(duration);
            this._currentBgm = null;
        }
    }

    static fadeInBgm(duration: number): void {
        if (this._bgmBuffer && this._currentBgm) {
            this._bgmBuffer.fadeIn(duration);
        }
    }

    static playBgs(bgs: RMMZ.DataAudio, pos?: number): void {
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

    static replayBgs(bgs: RMMZ.DataAudio): void {
        if (this.isCurrentBgs(bgs)) {
            this.updateBgsParameters(bgs);
        } else {
            this.playBgs(bgs, bgs.pos);
            if (this._bgsBuffer) {
                this._bgsBuffer.fadeIn(this._replayFadeTime);
            }
        }
    }

    static isCurrentBgs(bgs: RMMZ.DataAudio): boolean | null {
        return this._currentBgs && this._bgsBuffer && this._currentBgs.name === bgs.name;
    }

    static updateBgsParameters(bgs: RMMZ.DataAudio | null): void {
        this.updateBufferParameters(this._bgsBuffer, this._bgsVolume, bgs);
    }

    static updateCurrentBgs(bgs: RMMZ.DataAudio, pos?: number): void {
        this._currentBgs = {
            name: bgs.name,
            volume: bgs.volume,
            pitch: bgs.pitch,
            pan: bgs.pan,
            pos: pos,
        };
    }

    static stopBgs(): void {
        if (this._bgsBuffer) {
            this._bgsBuffer.destroy();
            this._bgsBuffer = null;
            this._currentBgs = null;
        }
    }

    static fadeOutBgs(duration: number): void {
        if (this._bgsBuffer && this._currentBgs) {
            this._bgsBuffer.fadeOut(duration);
            this._currentBgs = null;
        }
    }

    static fadeInBgs(duration: number): void {
        if (this._bgsBuffer && this._currentBgs) {
            this._bgsBuffer.fadeIn(duration);
        }
    }

    static playMe(me: RMMZ.DataAudio): void {
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

    static updateMeParameters(me: RMMZ.DataAudio | null): void {
        this.updateBufferParameters(this._meBuffer, this._meVolume, me);
    }

    static fadeOutMe(duration: number): void {
        if (this._meBuffer) {
            this._meBuffer.fadeOut(duration);
        }
    }

    static stopMe(): void {
        if (this._meBuffer) {
            this._meBuffer.destroy();
            this._meBuffer = null;
            if (this._bgmBuffer && this._currentBgm && !this._bgmBuffer.isPlaying()) {
                this._bgmBuffer.play(true, this._currentBgm.pos);
                this._bgmBuffer.fadeIn(this._replayFadeTime);
            }
        }
    }

    static playSe(se: RMMZ.DataAudio): void {
        if (se.name) {
            // [Note] Do not play the same sound in the same frame.
            const latestBuffers = this._seBuffers.filter((buffer) => buffer.frameCount === Graphics.frameCount);
            if (latestBuffers.find((buffer) => buffer.name === se.name)) {
                return;
            }
            const buffer = this.createBuffer("se/", se.name);
            this.updateSeParameters(buffer, se);
            buffer.play(false);
            this._seBuffers.push(buffer);
            this.cleanupSe();
        }
    }

    static updateSeParameters(buffer: WebAudio, se: RMMZ.DataAudio | null): void {
        this.updateBufferParameters(buffer, this._seVolume, se);
    }

    static cleanupSe(): void {
        for (const buffer of this._seBuffers) {
            if (!buffer.isPlaying()) {
                buffer.destroy();
            }
        }
        this._seBuffers = this._seBuffers.filter((buffer) => buffer.isPlaying());
    }

    static stopSe(): void {
        for (const buffer of this._seBuffers) {
            buffer.destroy();
        }
        this._seBuffers = [];
    }

    static playStaticSe(se: RMMZ.DataAudio): void {
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

    static loadStaticSe(se: RMMZ.DataAudio): void {
        if (se.name && !this.isStaticSe(se)) {
            const buffer = this.createBuffer("se/", se.name);
            this._staticBuffers.push(buffer);
        }
    }

    static isStaticSe(se: RMMZ.DataAudio): boolean {
        for (const buffer of this._staticBuffers) {
            if (buffer.name === se.name) {
                return true;
            }
        }
        return false;
    }

    static stopAll(): void {
        this.stopMe();
        this.stopBgm();
        this.stopBgs();
        this.stopSe();
    }

    static saveBgm(): RMMZ.DataAudio {
        if (this._currentBgm) {
            const bgm = this._currentBgm;
            return {
                name: bgm.name,
                volume: bgm.volume,
                pitch: bgm.pitch,
                pan: bgm.pan,
                pos: this._bgmBuffer ? this._bgmBuffer.seek() : 0,
            };
        } else {
            return this.makeEmptyAudioObject();
        }
    }

    static saveBgs(): RMMZ.DataAudio {
        if (this._currentBgs) {
            const bgs = this._currentBgs;
            return {
                name: bgs.name,
                volume: bgs.volume,
                pitch: bgs.pitch,
                pan: bgs.pan,
                pos: this._bgsBuffer ? this._bgsBuffer.seek() : 0,
            };
        } else {
            return this.makeEmptyAudioObject();
        }
    }

    static makeEmptyAudioObject(): RMMZ.DataAudio {
        return { name: "", volume: 0, pitch: 0, pan: 0 };
    }

    static createBuffer(folder: string, name: string): WebAudio {
        const ext = this.audioFileExt();
        const url = this._path + folder + Utils.encodeURI(name) + ext;
        const buffer = new WebAudio(url);
        buffer.name = name;
        buffer.frameCount = Graphics.frameCount;
        return buffer;
    }

    static updateBufferParameters(buffer: WebAudio | null, configVolume: number, audio: RMMZ.DataAudio | null): void {
        if (buffer && audio) {
            buffer.volume = (configVolume * (audio.volume || 0)) / 10000;
            buffer.pitch = (audio.pitch || 0) / 100;
            buffer.pan = (audio.pan || 0) / 100;
        }
    }

    static audioFileExt(): string {
        return ".ogg";
    }

    static checkErrors(): void {
        const buffers = [this._bgmBuffer, this._bgsBuffer, this._meBuffer];
        buffers.push(...this._seBuffers);
        buffers.push(...this._staticBuffers);
        for (const buffer of buffers) {
            if (buffer && buffer.isError()) {
                this.throwLoadError(buffer);
            }
        }
    }

    static throwLoadError(webAudio: WebAudio): void {
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

    static preloadImportantSounds(): void {
        this.loadSystemSound(0);
        this.loadSystemSound(1);
        this.loadSystemSound(2);
        this.loadSystemSound(3);
    }

    static loadSystemSound(n: number): void {
        if ($dataSystem) {
            AudioManager.loadStaticSe($dataSystem.sounds[n]);
        }
    }

    static playSystemSound(n: number): void {
        if ($dataSystem) {
            AudioManager.playStaticSe($dataSystem.sounds[n]);
        }
    }

    static playCursor(): void {
        this.playSystemSound(0);
    }

    static playOk(): void {
        this.playSystemSound(1);
    }

    static playCancel(): void {
        this.playSystemSound(2);
    }

    static playBuzzer(): void {
        this.playSystemSound(3);
    }

    static playEquip(): void {
        this.playSystemSound(4);
    }

    static playSave(): void {
        this.playSystemSound(5);
    }

    static playLoad(): void {
        this.playSystemSound(6);
    }

    static playBattleStart(): void {
        this.playSystemSound(7);
    }

    static playEscape(): void {
        this.playSystemSound(8);
    }

    static playEnemyAttack(): void {
        this.playSystemSound(9);
    }

    static playEnemyDamage(): void {
        this.playSystemSound(10);
    }

    static playEnemyCollapse(): void {
        this.playSystemSound(11);
    }

    static playBossCollapse1(): void {
        this.playSystemSound(12);
    }

    static playBossCollapse2(): void {
        this.playSystemSound(13);
    }

    static playActorDamage(): void {
        this.playSystemSound(14);
    }

    static playActorCollapse(): void {
        this.playSystemSound(15);
    }

    static playRecovery(): void {
        this.playSystemSound(16);
    }

    static playMiss(): void {
        this.playSystemSound(17);
    }

    static playEvasion(): void {
        this.playSystemSound(18);
    }

    static playMagicEvasion(): void {
        this.playSystemSound(19);
    }

    static playReflection(): void {
        this.playSystemSound(20);
    }

    static playShop(): void {
        this.playSystemSound(21);
    }

    static playUseItem(): void {
        this.playSystemSound(22);
    }

    static playUseSkill(): void {
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

    static basic(basicId: number): string {
        return $dataSystem.terms.basic[basicId] || "";
    }

    static param(paramId: number): string {
        return $dataSystem.terms.params[paramId] || "";
    }

    static command(commandId: number): string {
        return $dataSystem.terms.commands[commandId] || "";
    }

    static message(messageId: keyof RMMZ.Messages): string {
        return $dataSystem.terms.messages[messageId] || "";
    }

    static getter(method: string, param: number | string): PropertyDescriptor {
        return {
            get: function (this: Record<string, (param: number | string) => string>) {
                return this[method](param);
            },
            configurable: true,
        };
    }

    static get currencyUnit(): string {
        return $dataSystem.currencyUnit;
    }
    static get level(): string {
        return this.basic(0);
    }
    static get levelA(): string {
        return this.basic(1);
    }
    static get hp(): string {
        return this.basic(2);
    }
    static get hpA(): string {
        return this.basic(3);
    }
    static get mp(): string {
        return this.basic(4);
    }
    static get mpA(): string {
        return this.basic(5);
    }
    static get tp(): string {
        return this.basic(6);
    }
    static get tpA(): string {
        return this.basic(7);
    }
    static get exp(): string {
        return this.basic(8);
    }
    static get expA(): string {
        return this.basic(9);
    }
    static get fight(): string {
        return this.command(0);
    }
    static get escape(): string {
        return this.command(1);
    }
    static get attack(): string {
        return this.command(2);
    }
    static get guard(): string {
        return this.command(3);
    }
    static get item(): string {
        return this.command(4);
    }
    static get skill(): string {
        return this.command(5);
    }
    static get equip(): string {
        return this.command(6);
    }
    static get status(): string {
        return this.command(7);
    }
    static get formation(): string {
        return this.command(8);
    }
    static get save(): string {
        return this.command(9);
    }
    static get gameEnd(): string {
        return this.command(10);
    }
    static get options(): string {
        return this.command(11);
    }
    static get weapon(): string {
        return this.command(12);
    }
    static get armor(): string {
        return this.command(13);
    }
    static get keyItem(): string {
        return this.command(14);
    }
    static get equip2(): string {
        return this.command(15);
    }
    static get optimize(): string {
        return this.command(16);
    }
    static get clear(): string {
        return this.command(17);
    }
    static get newGame(): string {
        return this.command(18);
    }
    static get continue_(): string {
        return this.command(19);
    }
    static get toTitle(): string {
        return this.command(21);
    }
    static get cancel(): string {
        return this.command(22);
    }
    static get buy(): string {
        return this.command(24);
    }
    static get sell(): string {
        return this.command(25);
    }
    static get alwaysDash(): string {
        return this.message("alwaysDash");
    }
    static get commandRemember(): string {
        return this.message("commandRemember");
    }
    static get touchUI(): string {
        return this.message("touchUI");
    }
    static get bgmVolume(): string {
        return this.message("bgmVolume");
    }
    static get bgsVolume(): string {
        return this.message("bgsVolume");
    }
    static get meVolume(): string {
        return this.message("meVolume");
    }
    static get seVolume(): string {
        return this.message("seVolume");
    }
    static get possession(): string {
        return this.message("possession");
    }
    static get expTotal(): string {
        return this.message("expTotal");
    }
    static get expNext(): string {
        return this.message("expNext");
    }
    static get saveMessage(): string {
        return this.message("saveMessage");
    }
    static get loadMessage(): string {
        return this.message("loadMessage");
    }
    static get file(): string {
        return this.message("file");
    }
    static get autosave(): string {
        return this.message("autosave");
    }
    static get partyName(): string {
        return this.message("partyName");
    }
    static get emerge(): string {
        return this.message("emerge");
    }
    static get preemptive(): string {
        return this.message("preemptive");
    }
    static get surprise(): string {
        return this.message("surprise");
    }
    static get escapeStart(): string {
        return this.message("escapeStart");
    }
    static get escapeFailure(): string {
        return this.message("escapeFailure");
    }
    static get victory(): string {
        return this.message("victory");
    }
    static get defeat(): string {
        return this.message("defeat");
    }
    static get obtainExp(): string {
        return this.message("obtainExp");
    }
    static get obtainGold(): string {
        return this.message("obtainGold");
    }
    static get obtainItem(): string {
        return this.message("obtainItem");
    }
    static get levelUp(): string {
        return this.message("levelUp");
    }
    static get obtainSkill(): string {
        return this.message("obtainSkill");
    }
    static get useItem(): string {
        return this.message("useItem");
    }
    static get criticalToEnemy(): string {
        return this.message("criticalToEnemy");
    }
    static get criticalToActor(): string {
        return this.message("criticalToActor");
    }
    static get actorDamage(): string {
        return this.message("actorDamage");
    }
    static get actorRecovery(): string {
        return this.message("actorRecovery");
    }
    static get actorGain(): string {
        return this.message("actorGain");
    }
    static get actorLoss(): string {
        return this.message("actorLoss");
    }
    static get actorDrain(): string {
        return this.message("actorDrain");
    }
    static get actorNoDamage(): string {
        return this.message("actorNoDamage");
    }
    static get actorNoHit(): string {
        return this.message("actorNoHit");
    }
    static get enemyDamage(): string {
        return this.message("enemyDamage");
    }
    static get enemyRecovery(): string {
        return this.message("enemyRecovery");
    }
    static get enemyGain(): string {
        return this.message("enemyGain");
    }
    static get enemyLoss(): string {
        return this.message("enemyLoss");
    }
    static get enemyDrain(): string {
        return this.message("enemyDrain");
    }
    static get enemyNoDamage(): string {
        return this.message("enemyNoDamage");
    }
    static get enemyNoHit(): string {
        return this.message("enemyNoHit");
    }
    static get evasion(): string {
        return this.message("evasion");
    }
    static get magicEvasion(): string {
        return this.message("magicEvasion");
    }
    static get magicReflection(): string {
        return this.message("magicReflection");
    }
    static get counterAttack(): string {
        return this.message("counterAttack");
    }
    static get substitute(): string {
        return this.message("substitute");
    }
    static get buffAdd(): string {
        return this.message("buffAdd");
    }
    static get debuffAdd(): string {
        return this.message("debuffAdd");
    }
    static get buffRemove(): string {
        return this.message("buffRemove");
    }
    static get actionFailure(): string {
        return this.message("actionFailure");
    }
}

/**
 * The static class that handles the window colors.
 */
class ColorManager {
    declare static _windowskin: Bitmap;

    constructor() {
        throw new Error("This is a static class");
    }

    static loadWindowskin(): void {
        this._windowskin = ImageManager.loadSystem("Window");
    }

    static textColor(n: number): string {
        const px = 96 + (n % 8) * 12 + 6;
        const py = 144 + Math.floor(n / 8) * 12 + 6;
        return this._windowskin.getPixel(px, py);
    }

    static normalColor(): string {
        return this.textColor(0);
    }

    static systemColor(): string {
        return this.textColor(16);
    }

    static crisisColor(): string {
        return this.textColor(17);
    }

    static deathColor(): string {
        return this.textColor(18);
    }

    static gaugeBackColor(): string {
        return this.textColor(19);
    }

    static hpGaugeColor1(): string {
        return this.textColor(20);
    }

    static hpGaugeColor2(): string {
        return this.textColor(21);
    }

    static mpGaugeColor1(): string {
        return this.textColor(22);
    }

    static mpGaugeColor2(): string {
        return this.textColor(23);
    }

    static mpCostColor(): string {
        return this.textColor(23);
    }

    static powerUpColor(): string {
        return this.textColor(24);
    }

    static powerDownColor(): string {
        return this.textColor(25);
    }

    static ctGaugeColor1(): string {
        return this.textColor(26);
    }

    static ctGaugeColor2(): string {
        return this.textColor(27);
    }

    static tpGaugeColor1(): string {
        return this.textColor(28);
    }

    static tpGaugeColor2(): string {
        return this.textColor(29);
    }

    static tpCostColor(): string {
        return this.textColor(29);
    }

    static pendingColor(): string {
        return this._windowskin.getPixel(120, 120);
    }

    static hpColor(actor: Game_BattlerBase | null): string {
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

    static mpColor(..._extra: any[]): string;
    static mpColor(/*actor*/): string {
        return this.normalColor();
    }

    static tpColor(..._extra: any[]): string;
    static tpColor(/*actor*/): string {
        return this.normalColor();
    }

    static paramchangeTextColor(change: number): string {
        if (change > 0) {
            return this.powerUpColor();
        } else if (change < 0) {
            return this.powerDownColor();
        } else {
            return this.normalColor();
        }
    }

    static damageColor(colorType: number): "#ffffff" | "#b9ffb5" | "#ffff90" | "#80b0ff" | "#808080" {
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

    static outlineColor(): string {
        return "rgba(0, 0, 0, 0.6)";
    }

    static dimColor1(): string {
        return "rgba(0, 0, 0, 0.6)";
    }

    static dimColor2(): string {
        return "rgba(0, 0, 0, 0)";
    }

    static itemBackColor1(): string {
        return "rgba(32, 32, 32, 0.5)";
    }

    static itemBackColor2(): string {
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

    static _scene: Scene_Base | null = null;

    static _nextScene: Scene_Base | null = null;

    static _stack: (new () => Scene_Base)[] = [];

    static _exiting: boolean = false;

    static _previousScene: Scene_Base | null = null;

    static _previousClass: (new () => Scene_Base) | null = null;

    static _backgroundBitmap: Bitmap | null = null;

    static _smoothDeltaTime: number = 1;

    static _elapsedTime: number = 0;

    static async run(sceneClass: new () => Scene_Base): Promise<void> {
        try {
            await this.initialize();
            this.goto(sceneClass);
            Graphics.startGameLoop();
        } catch (e) {
            this.catchException(e);
        }
    }

    static async initialize(): Promise<void> {
        this.checkBrowser();
        this.checkPluginErrors();
        await this.initGraphics();
        this.initAudio();
        this.initVideo();
        this.initInput();
        this.setupEventHandlers();
    }

    static checkBrowser(): void {
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

    static checkPluginErrors(): void {
        PluginManager.checkErrors();
    }

    static async initGraphics(): Promise<void> {
        await Graphics.initialize();
        Graphics.setTickHandler(this.update.bind(this));
    }

    static initAudio(): void {
        WebAudio.initialize();
    }

    static initVideo(): void {
        Video.initialize(Graphics.width, Graphics.height);
    }

    static initInput(): void {
        Input.initialize();
        TouchInput.initialize();
    }

    static setupEventHandlers(): void {
        window.addEventListener("error", this.onError.bind(this));
        window.addEventListener("unhandledrejection", this.onReject.bind(this));
        window.addEventListener("unload", this.onUnload.bind(this));
        document.addEventListener("keydown", this.onKeyDown.bind(this));
    }

    static update(deltaTime: number): void {
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
     */
    static determineRepeatNumber(deltaTime: number): number {
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

    static terminate(): void {
        if (Utils.isNwjs()) {
            nw.App.quit();
        }
    }

    static onError(event: Pick<ErrorEvent, "message"> & Partial<Pick<ErrorEvent, "filename" | "lineno">>): void {
        console.error(event.message);
        console.error(event.filename, event.lineno);
        try {
            this.stop();
            Graphics.printError("Error", event.message, event);
            AudioManager.stopAll();
        } catch {
            //
        }
    }

    static onReject(event: PromiseRejectionEvent): void {
        // Catch uncaught exception in Promise
        (event as PromiseRejectionEvent & { message: string }).message = event.reason;
        this.onError(event as PromiseRejectionEvent & { message: string });
    }

    static onUnload(): void {
        ImageManager.clear();
        EffectManager.clear();
        AudioManager.stopAll();
    }

    static onKeyDown(event: KeyboardEvent): void {
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

    static reloadGame(): void {
        if (Utils.isNwjs()) {
            chrome.runtime.reload();
        }
    }

    static showDevTools(): void {
        if (Utils.isNwjs() && Utils.isOptionValid("test")) {
            nw.Window.get().showDevTools();
        }
    }

    static catchException(e: unknown): void {
        if (e instanceof Error) {
            this.catchNormalError(e);
        } else if (e instanceof Array && e[0] === "LoadError") {
            this.catchLoadError(e as ["LoadError", string, () => void]);
        } else {
            this.catchUnknownError(e);
        }
        this.stop();
    }

    static catchNormalError(e: Error): void {
        Graphics.printError(e.name, e.message, e);
        AudioManager.stopAll();
        console.error(e.stack);
    }

    static catchLoadError(e: ["LoadError", string, () => void]): void {
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

    static catchUnknownError(e: unknown): void {
        Graphics.printError("UnknownError", String(e));
        AudioManager.stopAll();
    }

    static updateMain(): void {
        this.updateFrameCount();
        this.updateInputData();
        this.updateEffekseer();
        this.changeScene();
        this.updateScene();
    }

    static updateFrameCount(): void {
        Graphics.frameCount++;
    }

    static updateInputData(): void {
        Input.update();
        TouchInput.update();
    }

    static updateEffekseer(): void {
        if (Graphics.effekseer && this.isGameActive()) {
            Graphics.effekseer.update();
        }
    }

    static changeScene(): void {
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

    static updateScene(): void {
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

    static isGameActive(): boolean {
        // [Note] We use "window.top" to support an iframe.
        try {
            return window.top!.document.hasFocus();
        } catch {
            // SecurityError
            return true;
        }
    }

    static onSceneTerminate(): void {
        this._previousScene = this._scene;
        this._previousClass = this._scene!.constructor as (new () => Scene_Base) | null;
        Graphics.setStage(null);
    }

    static onSceneCreate(): void {
        Graphics.startLoading();
    }

    static onBeforeSceneStart(): void {
        if (this._previousScene) {
            this._previousScene.destroy();
            this._previousScene = null;
        }
        if (Graphics.effekseer) {
            Graphics.effekseer.stopAll();
        }
    }

    static onSceneStart(): void {
        Graphics.endLoading();
        Graphics.setStage(this._scene);
    }

    static isSceneChanging(): boolean {
        return this._exiting || !!this._nextScene;
    }

    static isCurrentSceneBusy(): boolean | null {
        return this._scene && this._scene.isBusy();
    }

    static isNextScene(sceneClass: new () => Scene_Base): boolean | null {
        return this._nextScene && this._nextScene.constructor === sceneClass;
    }

    static isPreviousScene(sceneClass: new () => Scene_Base): boolean {
        return this._previousClass === sceneClass;
    }

    static goto(sceneClass: (new () => Scene_Base) | null): void {
        if (sceneClass) {
            this._nextScene = new sceneClass();
        }
        if (this._scene) {
            this._scene.stop();
        }
    }

    static push(sceneClass: new () => Scene_Base): void {
        this._stack.push(this._scene!.constructor as new () => Scene_Base);
        this.goto(sceneClass);
    }

    static pop(): void {
        if (this._stack.length > 0) {
            this.goto(this._stack.pop()!);
        } else {
            this.exit();
        }
    }

    static exit(): void {
        this.goto(null);
        this._exiting = true;
    }

    static clearStack(): void {
        this._stack = [];
    }

    static stop(): void {
        Graphics.stopGameLoop();
    }

    static prepareNextScene(..._extra: any[]): void;
    static prepareNextScene(): void {
        (
            this._nextScene as Scene_Base & {
                prepare: (...args: any[]) => void;
            }
        ).prepare(...arguments);
    }

    static snap(): Bitmap {
        return Bitmap.snap(this._scene!);
    }

    static snapForBackground(): void {
        if (this._backgroundBitmap) {
            this._backgroundBitmap.destroy();
        }
        this._backgroundBitmap = this.snap();
    }

    static backgroundBitmap(): Bitmap | null {
        return this._backgroundBitmap;
    }

    static resume(): void {
        TouchInput.update();
        Graphics.startGameLoop();
    }
}

/**
 * The static class that manages battle progress.
 */
class BattleManager {
    declare static _currentActor: Game_Actor | null;

    declare static _action: Game_Action | null;
    declare static _targets: (Game_Actor | Game_Enemy)[];

    declare static _canEscape: boolean;
    declare static _canLose: boolean;
    declare static _phase: string;
    declare static _inputting: boolean;
    declare static _battleTest: boolean;
    declare static _eventCallback: (result: number) => void | null;
    declare static _preemptive: boolean;
    declare static _surprise: boolean;
    declare static _actionForcedBattler: RMMZ.ActionTarget | null;
    declare static _mapBgm: RMMZ.AudioFile | null;
    declare static _mapBgs: RMMZ.AudioFile | null;
    declare static _actionBattlers: (Game_Actor | Game_Enemy)[];
    declare static _subject: RMMZ.ActionTarget | null;
    declare static _logWindow: Window_BattleLog | null;
    declare static _spriteset: Spriteset_Battle | null;
    declare static _escapeRatio: number;
    declare static _escaped: boolean;
    declare static _rewards: {
        gold: number;
        exp: number;
        items: RMMZ.DatabaseItem[];
    };
    declare static _tpbNeedsPartyCommand: boolean;

    constructor() {
        throw new Error("This is a static class");
    }

    static setup(troopId: number, canEscape: boolean, canLose: boolean): void {
        this.initMembers();
        this._canEscape = canEscape;
        this._canLose = canLose;
        $gameTroop.setup(troopId);
        $gameScreen.onBattleStart();
        this.makeEscapeRatio();
    }

    static initMembers(): void {
        this._phase = "";
        this._inputting = false;
        this._canEscape = false;
        this._canLose = false;
        this._battleTest = false;
        this._eventCallback = null!;
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
        this._rewards = {} as typeof BattleManager._rewards;
        this._tpbNeedsPartyCommand = true;
    }

    static isTpb(): boolean {
        return $dataSystem.battleSystem >= 1;
    }

    static isActiveTpb(): boolean {
        return $dataSystem.battleSystem === 1;
    }

    static isBattleTest(): boolean {
        return this._battleTest;
    }

    static setBattleTest(battleTest: boolean): void {
        this._battleTest = battleTest;
    }

    static setEventCallback(callback: (result: number) => void): void {
        this._eventCallback = callback;
    }

    static setLogWindow(logWindow: Window_BattleLog): void {
        this._logWindow = logWindow;
    }

    static setSpriteset(spriteset: Spriteset_Battle): void {
        this._spriteset = spriteset;
    }

    static onEncounter(): void {
        this._preemptive = Math.random() < this.ratePreemptive();
        this._surprise = Math.random() < this.rateSurprise() && !this._preemptive;
    }

    static ratePreemptive(): number {
        return $gameParty.ratePreemptive($gameTroop.agility());
    }

    static rateSurprise(): number {
        return $gameParty.rateSurprise($gameTroop.agility());
    }

    static saveBgmAndBgs(): void {
        this._mapBgm = AudioManager.saveBgm();
        this._mapBgs = AudioManager.saveBgs();
    }

    static playBattleBgm(): void {
        AudioManager.playBgm($gameSystem.battleBgm());
        AudioManager.stopBgs();
    }

    static playVictoryMe(): void {
        AudioManager.playMe($gameSystem.victoryMe());
    }

    static playDefeatMe(): void {
        AudioManager.playMe($gameSystem.defeatMe());
    }

    static replayBgmAndBgs(): void {
        if (this._mapBgm) {
            AudioManager.replayBgm(this._mapBgm);
        } else {
            AudioManager.stopBgm();
        }
        if (this._mapBgs) {
            AudioManager.replayBgs(this._mapBgs);
        }
    }

    static makeEscapeRatio(): void {
        this._escapeRatio = (0.5 * $gameParty.agility()) / $gameTroop.agility();
    }

    static update(timeActive: boolean): void {
        if (!this.isBusy() && !this.updateEvent()) {
            this.updatePhase(timeActive);
        }
        if (this.isTpb()) {
            this.updateTpbInput();
        }
    }

    static updatePhase(timeActive: boolean): void {
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

    static updateEvent(): boolean {
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

    static updateEventMain(): boolean {
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

    static isBusy():
        | boolean
        | "video"
        | "scroll"
        | "image"
        | "message"
        | "transfer"
        | "route"
        | "animation"
        | "balloon"
        | "gather"
        | "action"
        | "effect"
        | "movement" {
        return $gameMessage.isBusy() || this._spriteset!.isBusy() || this._logWindow!.isBusy();
    }

    static updateTpbInput(): void {
        if (this._inputting) {
            this.checkTpbInputClose();
        } else {
            this.checkTpbInputOpen();
        }
    }

    static checkTpbInputClose(): void {
        if (!this.isPartyTpbInputtable() || this.needsActorInputCancel()) {
            this.cancelActorInput();
            this._currentActor = null;
            this._inputting = false;
        }
    }

    static checkTpbInputOpen(): void {
        if (this.isPartyTpbInputtable()) {
            if (this._tpbNeedsPartyCommand) {
                this._inputting = true;
                this._tpbNeedsPartyCommand = false;
            } else {
                this.selectNextCommand();
            }
        }
    }

    static isPartyTpbInputtable(): boolean {
        return $gameParty.canInput() && this.isTpbMainPhase();
    }

    static needsActorInputCancel(): boolean | null {
        return this._currentActor && !this._currentActor.canInput();
    }

    static isTpbMainPhase(): boolean {
        return ["turn", "turnEnd", "action"].includes(this._phase);
    }

    static isInputting(): boolean {
        return this._inputting;
    }

    static isInTurn(): boolean {
        return this._phase === "turn";
    }

    static isTurnEnd(): boolean {
        return this._phase === "turnEnd";
    }

    static isAborting(): boolean {
        return this._phase === "aborting";
    }

    static isBattleEnd(): boolean {
        return this._phase === "battleEnd";
    }

    static canEscape(): boolean {
        return this._canEscape;
    }

    static canLose(): boolean {
        return this._canLose;
    }

    static isEscaped(): boolean {
        return this._escaped;
    }

    static actor(): Game_Actor | null {
        return this._currentActor;
    }

    static startBattle(): void {
        this._phase = "start";
        $gameSystem.onBattleStart();
        $gameParty.onBattleStart(this._preemptive);
        $gameTroop.onBattleStart(this._surprise);
        this.displayStartMessages();
    }

    static displayStartMessages(): void {
        for (const name of $gameTroop.enemyNames()) {
            $gameMessage.add(TextManager.emerge.format(name));
        }
        if (this._preemptive) {
            $gameMessage.add(TextManager.preemptive.format($gameParty.name()));
        } else if (this._surprise) {
            $gameMessage.add(TextManager.surprise.format($gameParty.name()));
        }
    }

    static startInput(): void {
        this._phase = "input";
        this._inputting = true;
        $gameParty.makeActions();
        $gameTroop.makeActions();
        this._currentActor = null;
        if (this._surprise || !$gameParty.canInput()) {
            this.startTurn();
        }
    }

    static inputtingAction(): Game_Action | null {
        return this._currentActor ? this._currentActor.inputtingAction() : null;
    }

    static selectNextCommand(): void {
        if (this._currentActor) {
            if (this._currentActor.selectNextCommand()) {
                return;
            }
            this.finishActorInput();
        }
        this.selectNextActor();
    }

    static selectNextActor(): void {
        this.changeCurrentActor(true);
        if (!this._currentActor) {
            if (this.isTpb()) {
                this.changeCurrentActor(true);
            } else {
                this.startTurn();
            }
        }
    }

    static selectPreviousCommand(): void {
        if (this._currentActor) {
            if (this._currentActor.selectPreviousCommand()) {
                return;
            }
            this.cancelActorInput();
        }
        this.selectPreviousActor();
    }

    static selectPreviousActor(): void {
        if (this.isTpb()) {
            this.changeCurrentActor(true);
            if (!this._currentActor) {
                this._inputting = $gameParty.canInput();
            }
        } else {
            this.changeCurrentActor(false);
        }
    }

    static changeCurrentActor(forward: boolean): void {
        const members = $gameParty.battleMembers();
        let actor = this._currentActor;
        for (;;) {
            const currentIndex = members.indexOf(actor!);
            actor = members[currentIndex + (forward ? 1 : -1)];
            if (!actor || actor.canInput()) {
                break;
            }
        }
        this._currentActor = actor ? actor : null;
        this.startActorInput();
    }

    static startActorInput(): void {
        if (this._currentActor) {
            this._currentActor.setActionState("inputting");
            this._inputting = true;
        }
    }

    static finishActorInput(): void {
        if (this._currentActor) {
            if (this.isTpb()) {
                this._currentActor.startTpbCasting();
            }
            this._currentActor.setActionState("waiting");
        }
    }

    static cancelActorInput(): void {
        if (this._currentActor) {
            this._currentActor.setActionState("undecided");
        }
    }

    static updateStart(): void {
        if (this.isTpb()) {
            this._phase = "turn";
        } else {
            this.startInput();
        }
    }

    static startTurn(): void {
        this._phase = "turn";
        $gameTroop.increaseTurn();
        $gameParty.requestMotionRefresh();
        if (!this.isTpb()) {
            this.makeActionOrders();
            this._logWindow!.startTurn();
            this._inputting = false;
        }
    }

    static updateTurn(timeActive: boolean): void {
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

    static updateTpb(): void {
        $gameParty.updateTpb();
        $gameTroop.updateTpb();
        this.updateAllTpbBattlers();
        this.checkTpbTurnEnd();
    }

    static updateAllTpbBattlers(): void {
        for (const battler of this.allBattleMembers()) {
            this.updateTpbBattler(battler);
        }
    }

    static updateTpbBattler(battler: RMMZ.ActionTarget): void {
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

    static checkTpbTurnEnd(): void {
        if ($gameTroop.isTpbTurnEnd()) {
            this.endTurn();
        }
    }

    static processTurn(): void {
        const subject = this._subject;
        const action = subject!.currentAction();
        if (action) {
            action.prepare();
            if (action.isValid()) {
                this.startAction();
            }
            subject!.removeCurrentAction();
        } else {
            this.endAction();
            this._subject = null;
        }
    }

    static endBattlerActions(battler: RMMZ.ActionTarget): void {
        battler.setActionState(this.isTpb() ? "undecided" : "done");
        battler.onAllActionsEnd();
        battler.clearTpbChargeTime();
        this.displayBattlerStatus(battler, true);
    }

    static endTurn(): void {
        this._phase = "turnEnd";
        this._preemptive = false;
        this._surprise = false;
    }

    static updateTurnEnd(): void {
        if (this.isTpb()) {
            this.startTurn();
        } else {
            this.endAllBattlersTurn();
            this._phase = "start";
        }
    }

    static endAllBattlersTurn(): void {
        for (const battler of this.allBattleMembers()) {
            battler.onTurnEnd();
            this.displayBattlerStatus(battler, false);
        }
    }

    static displayBattlerStatus(battler: RMMZ.ActionTarget, current: boolean): void {
        this._logWindow!.displayAutoAffectedStatus(battler);
        if (current) {
            this._logWindow!.displayCurrentState(battler);
        }
        this._logWindow!.displayRegeneration(battler);
    }

    static getNextSubject(): RMMZ.ActionTarget | null {
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

    static allBattleMembers(): (Game_Actor | Game_Enemy)[] {
        return [...$gameParty.battleMembers(), ...$gameTroop.members()];
    }

    static makeActionOrders(): void {
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

    static startAction(): void {
        const subject = this._subject;
        const action = subject!.currentAction();
        const targets = action.makeTargets();
        this._phase = "action";
        this._action = action;
        this._targets = targets;
        subject!.cancelMotionRefresh();
        subject!.useItem(action.item());
        this._action.applyGlobal();
        this._logWindow!.startAction(subject!, action, targets);
    }

    static updateAction(): void {
        const target = this._targets.shift();
        if (target) {
            this.invokeAction(this._subject!, target);
        } else {
            this.endAction();
        }
    }

    static endAction(): void {
        this._logWindow!.endAction(this._subject!);
        this._phase = "turn";
        if (this._subject!.numActions() === 0) {
            this.endBattlerActions(this._subject!);
            this._subject = null;
        }
    }

    static invokeAction(subject: RMMZ.ActionTarget, target: RMMZ.ActionTarget): void {
        this._logWindow!.push("pushBaseLine");
        if (Math.random() < this._action!.itemCnt(target)) {
            this.invokeCounterAttack(subject, target);
        } else if (Math.random() < this._action!.itemMrf(target)) {
            this.invokeMagicReflection(subject, target);
        } else {
            this.invokeNormalAction(subject, target);
        }
        subject.setLastTarget(target);
        this._logWindow!.push("popBaseLine");
    }

    static invokeNormalAction(subject: RMMZ.ActionTarget, target: RMMZ.ActionTarget): void {
        const realTarget = this.applySubstitute(target);
        this._action!.apply(realTarget);
        this._logWindow!.displayActionResults(subject, realTarget);
    }

    static invokeCounterAttack(subject: RMMZ.ActionTarget, target: RMMZ.ActionTarget): void {
        const action = new Game_Action(target);
        action.setAttack();
        action.apply(subject);
        this._logWindow!.displayCounter(target);
        this._logWindow!.displayActionResults(target, subject);
    }

    static invokeMagicReflection(subject: RMMZ.ActionTarget, target: RMMZ.ActionTarget): void {
        this._action!._reflectionTarget = target;
        this._logWindow!.displayReflection(target);
        this._action!.apply(subject);
        this._logWindow!.displayActionResults(target, subject);
    }

    static applySubstitute(target: RMMZ.ActionTarget): RMMZ.ActionTarget {
        if (this.checkSubstitute(target)) {
            const substitute = target.friendsUnit().substituteBattler(target as Game_Enemy & Game_Actor);
            if (substitute) {
                this._logWindow!.displaySubstitute(substitute, target);
                return substitute;
            }
        }
        return target;
    }

    static checkSubstitute(target: RMMZ.ActionTarget): boolean {
        return target.isDying() && !this._action!.isCertainHit();
    }

    static isActionForced(): boolean {
        return !!this._actionForcedBattler && !$gameParty.isAllDead() && !$gameTroop.isAllDead();
    }

    static forceAction(battler: RMMZ.ActionTarget): void {
        if (battler.numActions() > 0) {
            this._actionForcedBattler = battler;
            this._actionBattlers.remove(battler);
        }
    }

    static processForcedAction(): void {
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

    static abort(): void {
        this._phase = "aborting";
    }

    static checkBattleEnd(): boolean {
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

    static checkAbort(): boolean {
        if (this.isAborting()) {
            this.processAbort();
            return true;
        }
        return false;
    }

    static processVictory(): void {
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

    static processEscape(): boolean {
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

    static onEscapeSuccess(): void {
        this.displayEscapeSuccessMessage();
        this._escaped = true;
        this.processAbort();
    }

    static onEscapeFailure(): void {
        $gameParty.onEscapeFailure();
        this.displayEscapeFailureMessage();
        this._escapeRatio += 0.1;
        if (!this.isTpb()) {
            this.startTurn();
        }
    }

    static processPartyEscape(): void {
        this._escaped = true;
        this.processAbort();
    }

    static processAbort(): void {
        $gameParty.removeBattleStates();
        this._logWindow!.clear();
        this.replayBgmAndBgs();
        this.endBattle(1);
    }

    static processDefeat(): void {
        this.displayDefeatMessage();
        this.playDefeatMe();
        if (this._canLose) {
            this.replayBgmAndBgs();
        } else {
            AudioManager.stopBgm();
        }
        this.endBattle(2);
    }

    static endBattle(result: number): void {
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

    static updateBattleEnd(): void {
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

    static makeRewards(): void {
        this._rewards = {
            gold: $gameTroop.goldTotal(),
            exp: $gameTroop.expTotal(),
            items: $gameTroop.makeDropItems(),
        };
    }

    static displayVictoryMessage(): void {
        $gameMessage.add(TextManager.victory.format($gameParty.name()));
    }

    static displayDefeatMessage(): void {
        $gameMessage.add(TextManager.defeat.format($gameParty.name()));
    }

    static displayEscapeSuccessMessage(): void {
        $gameMessage.add(TextManager.escapeStart.format($gameParty.name()));
    }

    static displayEscapeFailureMessage(): void {
        $gameMessage.add(TextManager.escapeStart.format($gameParty.name()));
        $gameMessage.add("\\." + TextManager.escapeFailure);
    }

    static displayRewards(): void {
        this.displayExp();
        this.displayGold();
        this.displayDropItems();
    }

    static displayExp(): void {
        const exp = this._rewards.exp;
        if (exp > 0) {
            const text = TextManager.obtainExp.format(exp, TextManager.exp);
            $gameMessage.add("\\." + text);
        }
    }

    static displayGold(): void {
        const gold = this._rewards.gold;
        if (gold > 0) {
            $gameMessage.add("\\." + TextManager.obtainGold.format(gold));
        }
    }

    static displayDropItems(): void {
        const items = this._rewards.items;
        if (items.length > 0) {
            $gameMessage.newPage();
            for (const item of items) {
                $gameMessage.add(TextManager.obtainItem.format(item.name));
            }
        }
    }

    static gainRewards(): void {
        this.gainExp();
        this.gainGold();
        this.gainDropItems();
    }

    static gainExp(): void {
        const exp = this._rewards.exp;
        for (const actor of $gameParty.allMembers()) {
            actor.gainExp(exp);
        }
    }

    static gainGold(): void {
        $gameParty.gainGold(this._rewards.gold);
    }

    static gainDropItems(): void {
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

    static _scripts: string[] = [];

    static _errorUrls: string[] = [];

    static _parameters: Record<string, Record<string, unknown>> = {};

    static _commands: Record<string, (args: RMMZ.PluginParameters) => void> = {};

    static setup(plugins: RMMZ.DataPlugin[]): void {
        for (const plugin of plugins) {
            const pluginName = Utils.extractFileName(plugin.name);
            if (plugin.status && !this._scripts.includes(pluginName)) {
                this.setParameters(pluginName, plugin.parameters);
                this.loadScript(plugin.name);
                this._scripts.push(pluginName);
            }
        }
    }

    static parameters(name: string): Record<string, unknown> {
        return this._parameters[name.toLowerCase()] || {};
    }

    static setParameters(name: string, parameters: Record<string, unknown>): void {
        this._parameters[name.toLowerCase()] = parameters;
    }

    static loadScript(filename: string): void {
        const url = this.makeUrl(filename);
        const script = document.createElement("script") as HTMLScriptElement & {
            _url: string;
        };
        script.type = "text/javascript";
        script.src = url;
        script.async = false;
        script.defer = true;
        script.onerror = this.onError.bind(this);
        script._url = url;
        document.body.appendChild(script);
    }

    static onError(e: Event | string): void {
        this._errorUrls.push(((e as Event).target as HTMLScriptElement & { _url: string })._url);
    }

    static makeUrl(filename: string): string {
        return "js/plugins/" + Utils.encodeURI(filename) + ".js";
    }

    static checkErrors(): void {
        const url = this._errorUrls.shift();
        if (url) {
            this.throwLoadError(url);
        }
    }

    static throwLoadError(url: string): void {
        throw new Error("Failed to load: " + url);
    }

    static registerCommand<T extends RMMZ.PluginParameters>(
        pluginName: string,
        commandName: string,
        func: (args: T) => void,
    ): void {
        const key = pluginName + ":" + commandName;
        this._commands[key] = func as (...args: unknown[]) => void;
    }

    static callCommand(self: unknown, pluginName: string, commandName: string, args: RMMZ.PluginParameters): void {
        const key = pluginName + ":" + commandName;
        const func = this._commands[key];
        if (typeof func === "function") {
            func.bind(self)(args);
        }
    }
}
