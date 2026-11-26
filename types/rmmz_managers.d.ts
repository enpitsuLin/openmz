// Auto-generated from JSDoc in src/js/rmmz_managers.js via `pnpm build:types`. Do not edit manually.

/**
 * The static class that manages the database and game objects.
 */
declare class DataManager {
    /** @type {RMMZ.DataGlobalInfo | null} */
    static _globalInfo: RMMZ.DataGlobalInfo | null;
    /** @type {{ name: string; src: string; url: string; }[]} */
    static _errors: {
        name: string;
        src: string;
        url: string;
    }[];
    /** @type {readonly [ { readonly name: "$dataActors"; readonly src: "Actors.json"; }, { readonly name: "$dataClasses"; readonly src: "Classes.json"; }, { readonly name: "$dataSkills"; readonly src: "Skills.json"; }, { readonly name: "$dataItems"; readonly src: "Items.json"; }, { readonly name: "$dataWeapons"; readonly src: "Weapons.json"; }, { readonly name: "$dataArmors"; readonly src: "Armors.json"; }, { readonly name: "$dataEnemies"; readonly src: "Enemies.json"; }, { readonly name: "$dataTroops"; readonly src: "Troops.json"; }, { readonly name: "$dataStates"; readonly src: "States.json"; }, { readonly name: "$dataAnimations"; readonly src: "Animations.json"; }, { readonly name: "$dataTilesets"; readonly src: "Tilesets.json"; }, { readonly name: "$dataCommonEvents"; readonly src: "CommonEvents.json"; }, { readonly name: "$dataSystem"; readonly src: "System.json"; }, { readonly name: "$dataMapInfos"; readonly src: "MapInfos.json"; } ]} */
    static _databaseFiles: readonly [{
        readonly name: "$dataActors";
        readonly src: "Actors.json";
    }, {
        readonly name: "$dataClasses";
        readonly src: "Classes.json";
    }, {
        readonly name: "$dataSkills";
        readonly src: "Skills.json";
    }, {
        readonly name: "$dataItems";
        readonly src: "Items.json";
    }, {
        readonly name: "$dataWeapons";
        readonly src: "Weapons.json";
    }, {
        readonly name: "$dataArmors";
        readonly src: "Armors.json";
    }, {
        readonly name: "$dataEnemies";
        readonly src: "Enemies.json";
    }, {
        readonly name: "$dataTroops";
        readonly src: "Troops.json";
    }, {
        readonly name: "$dataStates";
        readonly src: "States.json";
    }, {
        readonly name: "$dataAnimations";
        readonly src: "Animations.json";
    }, {
        readonly name: "$dataTilesets";
        readonly src: "Tilesets.json";
    }, {
        readonly name: "$dataCommonEvents";
        readonly src: "CommonEvents.json";
    }, {
        readonly name: "$dataSystem";
        readonly src: "System.json";
    }, {
        readonly name: "$dataMapInfos";
        readonly src: "MapInfos.json";
    }];
    /** @returns {Promise<0 | undefined>} */
    static loadGlobalInfo(): Promise<0 | undefined>;
    /** @returns {void} */
    static removeInvalidGlobalInfo(): void;
    /** @returns {void} */
    static saveGlobalInfo(): void;
    /** @returns {boolean} */
    static isGlobalInfoLoaded(): boolean;
    /** @returns {void} */
    static loadDatabase(): void;
    /**
     * @param {string} name
     * @param {string} src
     * @returns {void}
     */
    static loadDataFile(name: string, src: string): void;
    /**
     * @param {XMLHttpRequest} xhr
     * @param {string} name
     * @param {string} src
     * @param {string} url
     * @returns {void}
     */
    static onXhrLoad(xhr: XMLHttpRequest, name: string, src: string, url: string): void;
    /**
     * @param {string} name
     * @param {string} src
     * @param {string} url
     * @returns {void}
     */
    static onXhrError(name: string, src: string, url: string): void;
    /** @returns {boolean} */
    static isDatabaseLoaded(): boolean;
    /**
     * @param {number} mapId
     * @returns {void}
     */
    static loadMapData(mapId: number): void;
    /** @returns {void} */
    static makeEmptyMap(): void;
    /** @returns {boolean} */
    static isMapLoaded(): boolean;
    /**
     * @param {unknown} object
     * @returns {void}
     */
    static onLoad(object: unknown): void;
    /**
     * @param {unknown} object
     * @returns {object is RMMZ.DataMap}
     */
    static isMapObject(object: unknown): object is RMMZ.DataMap;
    /**
     * @param {unknown} array
     * @returns {void}
     */
    static extractArrayMetadata(array: unknown): void;
    /**
     * @param {{ note: string; meta?: RMMZ.Meta; }} data
     * @returns {void}
     */
    static extractMetadata(data: {
        note: string;
        meta?: RMMZ.Meta;
    }): void;
    /** @returns {void} */
    static checkError(): void;
    /** @returns {boolean} */
    static isBattleTest(): boolean;
    /** @returns {boolean} */
    static isEventTest(): boolean;
    /** @returns {boolean} */
    static isTitleSkip(): boolean;
    /**
     * @param {unknown} item
     * @returns {item is RMMZ.DataSkill}
     */
    static isSkill(item: unknown): item is RMMZ.DataSkill;
    /**
     * @param {unknown} item
     * @returns {item is RMMZ.DataItem}
     */
    static isItem(item: unknown): item is RMMZ.DataItem;
    /**
     * @param {unknown} item
     * @returns {item is RMMZ.DataWeapon}
     */
    static isWeapon(item: unknown): item is RMMZ.DataWeapon;
    /**
     * @param {unknown} item
     * @returns {item is RMMZ.DataArmor}
     */
    static isArmor(item: unknown): item is RMMZ.DataArmor;
    /** @returns {void} */
    static createGameObjects(): void;
    /** @returns {void} */
    static setupNewGame(): void;
    /** @returns {void} */
    static setupBattleTest(): void;
    /** @returns {void} */
    static setupEventTest(): void;
    /** @returns {boolean} */
    static isAnySavefileExists(): boolean;
    /** @returns {number} */
    static latestSavefileId(): number;
    /** @returns {number} */
    static earliestSavefileId(): number;
    /** @returns {number} */
    static emptySavefileId(): number;
    /** @returns {void} */
    static loadAllSavefileImages(): void;
    /**
     * @param {RMMZ.DataSaveInfo} info
     * @returns {void}
     */
    static loadSavefileImages(info: RMMZ.DataSaveInfo): void;
    /** @returns {number} */
    static maxSavefiles(): number;
    /**
     * @param {number} savefileId
     * @returns {RMMZ.DataSaveInfo | null | undefined}
     */
    static savefileInfo(savefileId: number): RMMZ.DataSaveInfo | null | undefined;
    /**
     * @param {number} savefileId
     * @returns {boolean}
     */
    static savefileExists(savefileId: number): boolean;
    /**
     * @param {number} savefileId
     * @returns {Promise<number>}
     */
    static saveGame(savefileId: number): Promise<number>;
    /**
     * @param {number} savefileId
     * @returns {Promise<number>}
     */
    static loadGame(savefileId: number): Promise<number>;
    /**
     * @param {number} savefileId
     * @returns {string}
     */
    static makeSavename(savefileId: number): string;
    /** @returns {void} */
    static selectSavefileForNewGame(): void;
    /** @returns {RMMZ.DataSaveInfo} */
    static makeSavefileInfo(): RMMZ.DataSaveInfo;
    /** @returns {RMMZ.SaveContents} */
    static makeSaveContents(): RMMZ.SaveContents;
    /**
     * @param {RMMZ.SaveContents} contents
     * @returns {void}
     */
    static extractSaveContents(contents: RMMZ.SaveContents): void;
    /** @returns {void} */
    static correctDataErrors(): void;
}
/**
 * The static class that manages the configuration data.
 */
declare class ConfigManager {
    /** @type {boolean} */
    static alwaysDash: boolean;
    /** @type {boolean} */
    static commandRemember: boolean;
    /** @type {boolean} */
    static touchUI: boolean;
    /** @type {boolean} */
    static _isLoaded: boolean;
    /** @param {number} value */
    static set bgmVolume(value: number);
    /** @type {number} */
    static get bgmVolume(): number;
    /** @param {number} value */
    static set bgsVolume(value: number);
    /** @type {number} */
    static get bgsVolume(): number;
    /** @param {number} value */
    static set meVolume(value: number);
    /** @type {number} */
    static get meVolume(): number;
    /** @param {number} value */
    static set seVolume(value: number);
    /** @type {number} */
    static get seVolume(): number;
    /** @returns {Promise<number>} */
    static load(): Promise<number>;
    /** @returns {void} */
    static save(): void;
    /** @returns {boolean} */
    static isLoaded(): boolean;
    /** @returns {RMMZ.DataConfig} */
    static makeData(): RMMZ.DataConfig;
    /**
     * @param {Partial<RMMZ.DataConfig>} config
     * @returns {void}
     */
    static applyData(config: Partial<RMMZ.DataConfig>): void;
    /**
     * @param {Partial<RMMZ.DataConfig>} config
     * @param {keyof RMMZ.DataConfig} name
     * @param {boolean} defaultValue
     * @returns {boolean}
     */
    static readFlag(config: Partial<RMMZ.DataConfig>, name: keyof RMMZ.DataConfig, defaultValue: boolean): boolean;
    /**
     * @param {Partial<RMMZ.DataConfig>} config
     * @param {keyof RMMZ.DataConfig} name
     * @returns {number}
     */
    static readVolume(config: Partial<RMMZ.DataConfig>, name: keyof RMMZ.DataConfig): number;
}
/**
 * The static class that loads font files.
 */
declare class FontManager {
    /** @type {Record<string, string>} */
    static _urls: Record<string, string>;
    /** @type {Record<string, string>} */
    static _states: Record<string, string>;
    /**
     * @param {string} family
     * @param {string} filename
     * @returns {void}
     */
    static load(family: string, filename: string): void;
    /** @returns {boolean} */
    static isReady(): boolean;
    /**
     * @param {string} family
     * @param {string} url
     * @returns {void}
     */
    static startLoading(family: string, url: string): void;
    /**
     * @param {string} family
     * @returns {void}
     */
    static throwLoadError(family: string): void;
    /**
     * @param {string} filename
     * @returns {string}
     */
    static makeUrl(filename: string): string;
}
/**
 * The static class that loads images, creates bitmap objects and retains them.
 */
declare class ImageManager {
    static standardIconWidth: number;
    static standardIconHeight: number;
    static standardFaceWidth: number;
    static standardFaceHeight: number;
    /** @type {Record<string, Bitmap>} */
    static _cache: Record<string, Bitmap>;
    /** @type {Record<string, Bitmap>} */
    static _system: Record<string, Bitmap>;
    /** @type {Bitmap} */
    static _emptyBitmap: Bitmap;
    /** @type {number} */
    static get iconWidth(): number;
    /** @type {number} */
    static get iconHeight(): number;
    /** @type {number} */
    static get faceWidth(): number;
    /** @type {number} */
    static get faceHeight(): number;
    /** @returns {number} */
    static getIconSize(): number;
    /** @returns {number} */
    static getFaceSize(): number;
    /**
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadAnimation(filename: string): Bitmap;
    /**
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadBattleback1(filename: string): Bitmap;
    /**
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadBattleback2(filename: string): Bitmap;
    /**
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadEnemy(filename: string): Bitmap;
    /**
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadCharacter(filename: string): Bitmap;
    /**
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadFace(filename: string): Bitmap;
    /**
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadParallax(filename: string): Bitmap;
    /**
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadPicture(filename: string): Bitmap;
    /**
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadSvActor(filename: string): Bitmap;
    /**
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadSvEnemy(filename: string): Bitmap;
    /**
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadSystem(filename: string): Bitmap;
    /**
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadTileset(filename: string): Bitmap;
    /**
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadTitle1(filename: string): Bitmap;
    /**
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadTitle2(filename: string): Bitmap;
    /**
     * @param {string} folder
     * @param {string} filename
     * @returns {Bitmap}
     */
    static loadBitmap(folder: string, filename: string): Bitmap;
    /**
     * @param {string} url
     * @returns {Bitmap}
     */
    static loadBitmapFromUrl(url: string): Bitmap;
    /** @returns {void} */
    static clear(): void;
    /** @returns {boolean} */
    static isReady(): boolean;
    /**
     * @param {Bitmap} bitmap
     * @returns {void}
     */
    static throwLoadError(bitmap: Bitmap): void;
    /**
     * @param {string} filename
     * @returns {boolean}
     */
    static isObjectCharacter(filename: string): boolean;
    /**
     * @param {string} filename
     * @returns {boolean}
     */
    static isBigCharacter(filename: string): boolean;
    /**
     * @param {string} filename
     * @returns {boolean}
     */
    static isZeroParallax(filename: string): boolean;
}
/**
 * The static class that loads Effekseer effects.
 */
declare class EffectManager {
    /** @type {Record<string, effekseer.EffekseerEffect>} */
    static _cache: Record<string, effekseer.EffekseerEffect>;
    /** @type {string[]} */
    static _errorUrls: string[];
    /**
     * @param {string} [filename]
     * @returns {effekseer.EffekseerEffect | null}
     */
    static load(filename?: string): effekseer.EffekseerEffect | null;
    /**
     * @param {string} url
     * @returns {effekseer.EffekseerEffect}
     */
    static startLoading(url: string): effekseer.EffekseerEffect;
    /** @returns {void} */
    static clear(): void;
    /** @returns {void} */
    static onLoad(): void;
    /**
     * @param {string} url
     * @returns {void}
     */
    static onError(url: string): void;
    /**
     * @param {string} filename
     * @returns {string}
     */
    static makeUrl(filename: string): string;
    /** @returns {void} */
    static checkErrors(): void;
    /**
     * @param {string} url
     * @returns {void}
     */
    static throwLoadError(url: string): void;
    /** @returns {boolean} */
    static isReady(): boolean;
}
/**
 * The static class that handles BGM, BGS, ME and SE.
 */
declare class AudioManager {
    /** @type {number} */
    static _bgmVolume: number;
    /** @type {number} */
    static _bgsVolume: number;
    /** @type {number} */
    static _meVolume: number;
    /** @type {number} */
    static _seVolume: number;
    /** @type {RMMZ.DataAudio | null} */
    static _currentBgm: RMMZ.DataAudio | null;
    /** @type {RMMZ.DataAudio | null} */
    static _currentBgs: RMMZ.DataAudio | null;
    /** @type {WebAudio | null} */
    static _bgmBuffer: WebAudio | null;
    /** @type {WebAudio | null} */
    static _bgsBuffer: WebAudio | null;
    /** @type {WebAudio | null} */
    static _meBuffer: WebAudio | null;
    /** @type {WebAudio[]} */
    static _seBuffers: WebAudio[];
    /** @type {WebAudio[]} */
    static _staticBuffers: WebAudio[];
    /** @type {number} */
    static _replayFadeTime: number;
    /** @type {string} */
    static _path: string;
    /** @param {number} value */
    static set bgmVolume(value: number);
    /** @type {number} */
    static get bgmVolume(): number;
    /** @param {number} value */
    static set bgsVolume(value: number);
    /** @type {number} */
    static get bgsVolume(): number;
    /** @param {number} value */
    static set meVolume(value: number);
    /** @type {number} */
    static get meVolume(): number;
    /** @param {number} value */
    static set seVolume(value: number);
    /** @type {number} */
    static get seVolume(): number;
    /**
     * @param {RMMZ.DataAudio} bgm
     * @param {number} [pos]
     * @returns {void}
     */
    static playBgm(bgm: RMMZ.DataAudio, pos?: number): void;
    /**
     * @param {RMMZ.DataAudio} bgm
     * @returns {void}
     */
    static replayBgm(bgm: RMMZ.DataAudio): void;
    /**
     * @param {RMMZ.DataAudio} bgm
     * @returns {boolean | null}
     */
    static isCurrentBgm(bgm: RMMZ.DataAudio): boolean | null;
    /**
     * @param {RMMZ.DataAudio | null} bgm
     * @returns {void}
     */
    static updateBgmParameters(bgm: RMMZ.DataAudio | null): void;
    /**
     * @param {RMMZ.DataAudio} bgm
     * @param {number} [pos]
     * @returns {void}
     */
    static updateCurrentBgm(bgm: RMMZ.DataAudio, pos?: number): void;
    /** @returns {void} */
    static stopBgm(): void;
    /**
     * @param {number} duration
     * @returns {void}
     */
    static fadeOutBgm(duration: number): void;
    /**
     * @param {number} duration
     * @returns {void}
     */
    static fadeInBgm(duration: number): void;
    /**
     * @param {RMMZ.DataAudio} bgs
     * @param {number} [pos]
     * @returns {void}
     */
    static playBgs(bgs: RMMZ.DataAudio, pos?: number): void;
    /**
     * @param {RMMZ.DataAudio} bgs
     * @returns {void}
     */
    static replayBgs(bgs: RMMZ.DataAudio): void;
    /**
     * @param {RMMZ.DataAudio} bgs
     * @returns {boolean | null}
     */
    static isCurrentBgs(bgs: RMMZ.DataAudio): boolean | null;
    /**
     * @param {RMMZ.DataAudio | null} bgs
     * @returns {void}
     */
    static updateBgsParameters(bgs: RMMZ.DataAudio | null): void;
    /**
     * @param {RMMZ.DataAudio} bgs
     * @param {number} [pos]
     * @returns {void}
     */
    static updateCurrentBgs(bgs: RMMZ.DataAudio, pos?: number): void;
    /** @returns {void} */
    static stopBgs(): void;
    /**
     * @param {number} duration
     * @returns {void}
     */
    static fadeOutBgs(duration: number): void;
    /**
     * @param {number} duration
     * @returns {void}
     */
    static fadeInBgs(duration: number): void;
    /**
     * @param {RMMZ.DataAudio} me
     * @returns {void}
     */
    static playMe(me: RMMZ.DataAudio): void;
    /**
     * @param {RMMZ.DataAudio | null} me
     * @returns {void}
     */
    static updateMeParameters(me: RMMZ.DataAudio | null): void;
    /**
     * @param {number} duration
     * @returns {void}
     */
    static fadeOutMe(duration: number): void;
    /** @returns {void} */
    static stopMe(): void;
    /**
     * @param {RMMZ.DataAudio} se
     * @returns {void}
     */
    static playSe(se: RMMZ.DataAudio): void;
    /**
     * @param {WebAudio} buffer
     * @param {RMMZ.DataAudio | null} se
     * @returns {void}
     */
    static updateSeParameters(buffer: WebAudio, se: RMMZ.DataAudio | null): void;
    /** @returns {void} */
    static cleanupSe(): void;
    /** @returns {void} */
    static stopSe(): void;
    /**
     * @param {RMMZ.DataAudio} se
     * @returns {void}
     */
    static playStaticSe(se: RMMZ.DataAudio): void;
    /**
     * @param {RMMZ.DataAudio} se
     * @returns {void}
     */
    static loadStaticSe(se: RMMZ.DataAudio): void;
    /**
     * @param {RMMZ.DataAudio} se
     * @returns {boolean}
     */
    static isStaticSe(se: RMMZ.DataAudio): boolean;
    /** @returns {void} */
    static stopAll(): void;
    /** @returns {RMMZ.DataAudio} */
    static saveBgm(): RMMZ.DataAudio;
    /** @returns {RMMZ.DataAudio} */
    static saveBgs(): RMMZ.DataAudio;
    /** @returns {RMMZ.DataAudio} */
    static makeEmptyAudioObject(): RMMZ.DataAudio;
    /**
     * @param {string} folder
     * @param {string} name
     * @returns {WebAudio}
     */
    static createBuffer(folder: string, name: string): WebAudio;
    /**
     * @param {WebAudio | null} buffer
     * @param {number} configVolume
     * @param {RMMZ.DataAudio | null} audio
     * @returns {void}
     */
    static updateBufferParameters(buffer: WebAudio | null, configVolume: number, audio: RMMZ.DataAudio | null): void;
    /** @returns {string} */
    static audioFileExt(): string;
    /** @returns {void} */
    static checkErrors(): void;
    /**
     * @param {WebAudio} webAudio
     * @returns {void}
     */
    static throwLoadError(webAudio: WebAudio): void;
}
/**
 * The static class that plays sound effects defined in the database.
 */
declare class SoundManager {
    /** @returns {void} */
    static preloadImportantSounds(): void;
    /**
     * @param {number} n
     * @returns {void}
     */
    static loadSystemSound(n: number): void;
    /**
     * @param {number} n
     * @returns {void}
     */
    static playSystemSound(n: number): void;
    /** @returns {void} */
    static playCursor(): void;
    /** @returns {void} */
    static playOk(): void;
    /** @returns {void} */
    static playCancel(): void;
    /** @returns {void} */
    static playBuzzer(): void;
    /** @returns {void} */
    static playEquip(): void;
    /** @returns {void} */
    static playSave(): void;
    /** @returns {void} */
    static playLoad(): void;
    /** @returns {void} */
    static playBattleStart(): void;
    /** @returns {void} */
    static playEscape(): void;
    /** @returns {void} */
    static playEnemyAttack(): void;
    /** @returns {void} */
    static playEnemyDamage(): void;
    /** @returns {void} */
    static playEnemyCollapse(): void;
    /** @returns {void} */
    static playBossCollapse1(): void;
    /** @returns {void} */
    static playBossCollapse2(): void;
    /** @returns {void} */
    static playActorDamage(): void;
    /** @returns {void} */
    static playActorCollapse(): void;
    /** @returns {void} */
    static playRecovery(): void;
    /** @returns {void} */
    static playMiss(): void;
    /** @returns {void} */
    static playEvasion(): void;
    /** @returns {void} */
    static playMagicEvasion(): void;
    /** @returns {void} */
    static playReflection(): void;
    /** @returns {void} */
    static playShop(): void;
    /** @returns {void} */
    static playUseItem(): void;
    /** @returns {void} */
    static playUseSkill(): void;
}
/**
 * The static class that handles terms and messages.
 */
declare class TextManager {
    /**
     * @param {number} basicId
     * @returns {string}
     */
    static basic(basicId: number): string;
    /**
     * @param {number} paramId
     * @returns {string}
     */
    static param(paramId: number): string;
    /**
     * @param {number} commandId
     * @returns {string}
     */
    static command(commandId: number): string;
    /**
     * @param {keyof RMMZ.Messages} messageId
     * @returns {string}
     */
    static message(messageId: keyof RMMZ.Messages): string;
    /**
     * @param {string} method
     * @param {number} param
     * @returns {PropertyDescriptor}
     */
    static getter(method: string, param: number): PropertyDescriptor;
    /** @type {string} */
    static get currencyUnit(): string;
}
/**
 * The static class that handles the window colors.
 */
declare class ColorManager {
    /** @returns {void} */
    static loadWindowskin(): void;
    /**
     * @param {number} n
     * @returns {string}
     */
    static textColor(n: number): string;
    /** @returns {string} */
    static normalColor(): string;
    /** @returns {string} */
    static systemColor(): string;
    /** @returns {string} */
    static crisisColor(): string;
    /** @returns {string} */
    static deathColor(): string;
    /** @returns {string} */
    static gaugeBackColor(): string;
    /** @returns {string} */
    static hpGaugeColor1(): string;
    /** @returns {string} */
    static hpGaugeColor2(): string;
    /** @returns {string} */
    static mpGaugeColor1(): string;
    /** @returns {string} */
    static mpGaugeColor2(): string;
    /** @returns {string} */
    static mpCostColor(): string;
    /** @returns {string} */
    static powerUpColor(): string;
    /** @returns {string} */
    static powerDownColor(): string;
    /** @returns {string} */
    static ctGaugeColor1(): string;
    /** @returns {string} */
    static ctGaugeColor2(): string;
    /** @returns {string} */
    static tpGaugeColor1(): string;
    /** @returns {string} */
    static tpGaugeColor2(): string;
    /** @returns {string} */
    static tpCostColor(): string;
    /** @returns {string} */
    static pendingColor(): string;
    /**
     * @param {Game_BattlerBase | null} actor
     * @returns {string}
     */
    static hpColor(actor: Game_BattlerBase | null): string;
    /** @returns {string} */
    static mpColor(): string;
    /** @returns {string} */
    static tpColor(): string;
    /**
     * @param {number} change
     * @returns {string}
     */
    static paramchangeTextColor(change: number): string;
    /**
     * @param {number} colorType
     * @returns {"#ffffff" | "#b9ffb5" | "#ffff90" | "#80b0ff" | "#808080"}
     */
    static damageColor(colorType: number): "#ffffff" | "#b9ffb5" | "#ffff90" | "#80b0ff" | "#808080";
    /** @returns {string} */
    static outlineColor(): string;
    /** @returns {string} */
    static dimColor1(): string;
    /** @returns {string} */
    static dimColor2(): string;
    /** @returns {string} */
    static itemBackColor1(): string;
    /** @returns {string} */
    static itemBackColor2(): string;
}
/**
 * The static class that manages scene transitions.
 */
declare class SceneManager {
    /** @type {Scene_Base | null} */
    static _scene: Scene_Base | null;
    /** @type {Scene_Base | null} */
    static _nextScene: Scene_Base | null;
    /** @type {(new () => Scene_Base)[]} */
    static _stack: (new () => Scene_Base)[];
    /** @type {boolean} */
    static _exiting: boolean;
    /** @type {Scene_Base | null} */
    static _previousScene: Scene_Base | null;
    /** @type {(new () => Scene_Base) | null} */
    static _previousClass: (new () => Scene_Base) | null;
    /** @type {Bitmap | null} */
    static _backgroundBitmap: Bitmap | null;
    /** @type {number} */
    static _smoothDeltaTime: number;
    /** @type {number} */
    static _elapsedTime: number;
    /**
     * @param {new () => Scene_Base} sceneClass
     * @returns {Promise<void>}
     */
    static run(sceneClass: new () => Scene_Base): Promise<void>;
    /** @returns {Promise<void>} */
    static initialize(): Promise<void>;
    /** @returns {void} */
    static checkBrowser(): void;
    /** @returns {void} */
    static checkPluginErrors(): void;
    /** @returns {Promise<void>} */
    static initGraphics(): Promise<void>;
    /** @returns {void} */
    static initAudio(): void;
    /** @returns {void} */
    static initVideo(): void;
    /** @returns {void} */
    static initInput(): void;
    /** @returns {void} */
    static setupEventHandlers(): void;
    /**
     * @param {number} deltaTime
     * @returns {void}
     */
    static update(deltaTime: number): void;
    /**
     * Determines how many game updates to run for this frame.
     * The calculation accounts for refresh rates above 60 Hz and smooths
     * sudden changes in deltaTime.
     *
     * @param {number} deltaTime
     * @returns {number}
     */
    static determineRepeatNumber(deltaTime: number): number;
    /** @returns {void} */
    static terminate(): void;
    /**
     * @param {ErrorEvent} event
     * @returns {void}
     */
    static onError(event: ErrorEvent): void;
    /**
     * @param {PromiseRejectionEvent} event
     * @returns {void}
     */
    static onReject(event: PromiseRejectionEvent): void;
    /** @returns {void} */
    static onUnload(): void;
    /**
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    static onKeyDown(event: KeyboardEvent): void;
    /** @returns {void} */
    static reloadGame(): void;
    /** @returns {void} */
    static showDevTools(): void;
    /**
     * @param {unknown} e
     * @returns {void}
     */
    static catchException(e: unknown): void;
    /**
     * @param {Error} e
     * @returns {void}
     */
    static catchNormalError(e: Error): void;
    /**
     * @param {[ "LoadError", string, () => void ]} e
     * @returns {void}
     */
    static catchLoadError(e: ["LoadError", string, () => void]): void;
    /**
     * @param {unknown} e
     * @returns {void}
     */
    static catchUnknownError(e: unknown): void;
    /** @returns {void} */
    static updateMain(): void;
    /** @returns {void} */
    static updateFrameCount(): void;
    /** @returns {void} */
    static updateInputData(): void;
    /** @returns {void} */
    static updateEffekseer(): void;
    /** @returns {void} */
    static changeScene(): void;
    /** @returns {void} */
    static updateScene(): void;
    /** @returns {boolean} */
    static isGameActive(): boolean;
    /** @returns {void} */
    static onSceneTerminate(): void;
    /** @returns {void} */
    static onSceneCreate(): void;
    /** @returns {void} */
    static onBeforeSceneStart(): void;
    /** @returns {void} */
    static onSceneStart(): void;
    /** @returns {boolean} */
    static isSceneChanging(): boolean;
    /** @returns {boolean | null} */
    static isCurrentSceneBusy(): boolean | null;
    /**
     * @param {new () => Scene_Base} sceneClass
     * @returns {boolean | null}
     */
    static isNextScene(sceneClass: new () => Scene_Base): boolean | null;
    /**
     * @param {new () => Scene_Base} sceneClass
     * @returns {boolean}
     */
    static isPreviousScene(sceneClass: new () => Scene_Base): boolean;
    /**
     * @param {(new () => Scene_Base) | null} sceneClass
     * @returns {void}
     */
    static goto(sceneClass: (new () => Scene_Base) | null): void;
    /**
     * @param {new () => Scene_Base} sceneClass
     * @returns {void}
     */
    static push(sceneClass: new () => Scene_Base): void;
    /** @returns {void} */
    static pop(): void;
    /** @returns {void} */
    static exit(): void;
    /** @returns {void} */
    static clearStack(): void;
    /** @returns {void} */
    static stop(): void;
    /**
     * @template {Scene_Base & { prepare: (...args: any[]) => void; }} T
     * @returns {void}
     */
    static prepareNextScene<T extends Scene_Base & {
        prepare: (...args: any[]) => void;
    }>(...args: any[]): void;
    /** @returns {Bitmap} */
    static snap(): Bitmap;
    /** @returns {void} */
    static snapForBackground(): void;
    /** @returns {Bitmap | null} */
    static backgroundBitmap(): Bitmap | null;
    /** @returns {void} */
    static resume(): void;
}
/**
 * The static class that manages battle progress.
 */
declare class BattleManager {
    /**
     * @param {number} troopId
     * @param {boolean} canEscape
     * @param {boolean} canLose
     * @returns {void}
     */
    static setup(troopId: number, canEscape: boolean, canLose: boolean): void;
    /** @returns {void} */
    static initMembers(): void;
    /** @returns {boolean} */
    static isTpb(): boolean;
    /** @returns {boolean} */
    static isActiveTpb(): boolean;
    /** @returns {boolean} */
    static isBattleTest(): boolean;
    /**
     * @param {boolean} battleTest
     * @returns {void}
     */
    static setBattleTest(battleTest: boolean): void;
    /**
     * @param {(result: number) => void} callback
     * @returns {void}
     */
    static setEventCallback(callback: (result: number) => void): void;
    /**
     * @param {Window_BattleLog} logWindow
     * @returns {void}
     */
    static setLogWindow(logWindow: Window_BattleLog): void;
    /**
     * @param {Spriteset_Battle} spriteset
     * @returns {void}
     */
    static setSpriteset(spriteset: Spriteset_Battle): void;
    /** @returns {void} */
    static onEncounter(): void;
    /** @returns {number} */
    static ratePreemptive(): number;
    /** @returns {number} */
    static rateSurprise(): number;
    /** @returns {void} */
    static saveBgmAndBgs(): void;
    /** @returns {void} */
    static playBattleBgm(): void;
    /** @returns {void} */
    static playVictoryMe(): void;
    /** @returns {void} */
    static playDefeatMe(): void;
    /** @returns {void} */
    static replayBgmAndBgs(): void;
    /** @returns {void} */
    static makeEscapeRatio(): void;
    /**
     * @param {boolean} timeActive
     * @returns {void}
     */
    static update(timeActive: boolean): void;
    /**
     * @param {boolean} timeActive
     * @returns {void}
     */
    static updatePhase(timeActive: boolean): void;
    /** @returns {boolean} */
    static updateEvent(): boolean;
    /** @returns {boolean} */
    static updateEventMain(): boolean;
    /** @returns {boolean | "video" | "scroll" | "image" | "message" | "transfer" | "route" | "animation" | "balloon" | "gather" | "action" | "effect" | "movement"} */
    static isBusy(): boolean | "video" | "scroll" | "image" | "message" | "transfer" | "route" | "animation" | "balloon" | "gather" | "action" | "effect" | "movement";
    /** @returns {void} */
    static updateTpbInput(): void;
    /** @returns {void} */
    static checkTpbInputClose(): void;
    /** @returns {void} */
    static checkTpbInputOpen(): void;
    /** @returns {boolean} */
    static isPartyTpbInputtable(): boolean;
    /** @returns {boolean | null} */
    static needsActorInputCancel(): boolean | null;
    /** @returns {boolean} */
    static isTpbMainPhase(): boolean;
    /** @returns {boolean} */
    static isInputting(): boolean;
    /** @returns {boolean} */
    static isInTurn(): boolean;
    /** @returns {boolean} */
    static isTurnEnd(): boolean;
    /** @returns {boolean} */
    static isAborting(): boolean;
    /** @returns {boolean} */
    static isBattleEnd(): boolean;
    /** @returns {boolean} */
    static canEscape(): boolean;
    /** @returns {boolean} */
    static canLose(): boolean;
    /** @returns {boolean} */
    static isEscaped(): boolean;
    /** @returns {Game_Actor | null} */
    static actor(): Game_Actor | null;
    /** @returns {void} */
    static startBattle(): void;
    /** @returns {void} */
    static displayStartMessages(): void;
    /** @returns {void} */
    static startInput(): void;
    /** @returns {Game_Action | null} */
    static inputtingAction(): Game_Action | null;
    /** @returns {void} */
    static selectNextCommand(): void;
    /** @returns {void} */
    static selectNextActor(): void;
    /** @returns {void} */
    static selectPreviousCommand(): void;
    /** @returns {void} */
    static selectPreviousActor(): void;
    /**
     * @param {boolean} forward
     * @returns {void}
     */
    static changeCurrentActor(forward: boolean): void;
    /** @returns {void} */
    static startActorInput(): void;
    /** @returns {void} */
    static finishActorInput(): void;
    /** @returns {void} */
    static cancelActorInput(): void;
    /** @returns {void} */
    static updateStart(): void;
    /** @returns {void} */
    static startTurn(): void;
    /**
     * @param {boolean} timeActive
     * @returns {void}
     */
    static updateTurn(timeActive: boolean): void;
    /** @returns {void} */
    static updateTpb(): void;
    /** @returns {void} */
    static updateAllTpbBattlers(): void;
    /**
     * @param {RMMZ.ActionTarget} battler
     * @returns {void}
     */
    static updateTpbBattler(battler: RMMZ.ActionTarget): void;
    /** @returns {void} */
    static checkTpbTurnEnd(): void;
    /** @returns {void} */
    static processTurn(): void;
    /**
     * @param {RMMZ.ActionTarget} battler
     * @returns {void}
     */
    static endBattlerActions(battler: RMMZ.ActionTarget): void;
    /** @returns {void} */
    static endTurn(): void;
    /** @returns {void} */
    static updateTurnEnd(): void;
    /** @returns {void} */
    static endAllBattlersTurn(): void;
    /**
     * @param {RMMZ.ActionTarget} battler
     * @param {boolean} current
     * @returns {void}
     */
    static displayBattlerStatus(battler: RMMZ.ActionTarget, current: boolean): void;
    /** @returns {RMMZ.ActionTarget | null} */
    static getNextSubject(): RMMZ.ActionTarget | null;
    /** @returns {(Game_Actor | import("../objects").Game_Enemy)[]} */
    static allBattleMembers(): (Game_Actor | any)[];
    /** @returns {void} */
    static makeActionOrders(): void;
    /** @returns {void} */
    static startAction(): void;
    /** @returns {void} */
    static updateAction(): void;
    /** @returns {void} */
    static endAction(): void;
    /**
     * @param {RMMZ.ActionTarget} subject
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    static invokeAction(subject: RMMZ.ActionTarget, target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} subject
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    static invokeNormalAction(subject: RMMZ.ActionTarget, target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} subject
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    static invokeCounterAttack(subject: RMMZ.ActionTarget, target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} subject
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    static invokeMagicReflection(subject: RMMZ.ActionTarget, target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {RMMZ.ActionTarget}
     */
    static applySubstitute(target: RMMZ.ActionTarget): RMMZ.ActionTarget;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {boolean}
     */
    static checkSubstitute(target: RMMZ.ActionTarget): boolean;
    /** @returns {boolean} */
    static isActionForced(): boolean;
    /**
     * @param {RMMZ.ActionTarget} battler
     * @returns {void}
     */
    static forceAction(battler: RMMZ.ActionTarget): void;
    /** @returns {void} */
    static processForcedAction(): void;
    /** @returns {void} */
    static abort(): void;
    /** @returns {boolean} */
    static checkBattleEnd(): boolean;
    /** @returns {boolean} */
    static checkAbort(): boolean;
    /** @returns {void} */
    static processVictory(): void;
    /** @returns {boolean} */
    static processEscape(): boolean;
    /** @returns {void} */
    static onEscapeSuccess(): void;
    /** @returns {void} */
    static onEscapeFailure(): void;
    /** @returns {void} */
    static processPartyEscape(): void;
    /** @returns {void} */
    static processAbort(): void;
    /** @returns {void} */
    static processDefeat(): void;
    /**
     * @param {number} result
     * @returns {void}
     */
    static endBattle(result: number): void;
    /** @returns {void} */
    static updateBattleEnd(): void;
    /** @returns {void} */
    static makeRewards(): void;
    /** @returns {void} */
    static displayVictoryMessage(): void;
    /** @returns {void} */
    static displayDefeatMessage(): void;
    /** @returns {void} */
    static displayEscapeSuccessMessage(): void;
    /** @returns {void} */
    static displayEscapeFailureMessage(): void;
    /** @returns {void} */
    static displayRewards(): void;
    /** @returns {void} */
    static displayExp(): void;
    /** @returns {void} */
    static displayGold(): void;
    /** @returns {void} */
    static displayDropItems(): void;
    /** @returns {void} */
    static gainRewards(): void;
    /** @returns {void} */
    static gainExp(): void;
    /** @returns {void} */
    static gainGold(): void;
    /** @returns {void} */
    static gainDropItems(): void;
}
/**
 * The static class that manages the plugins.
 */
declare class PluginManager {
    /** @type {string[]} */
    static _scripts: string[];
    /** @type {string[]} */
    static _errorUrls: string[];
    /** @type {Record<string, Record<string, unknown>>} */
    static _parameters: Record<string, Record<string, unknown>>;
    /** @type {Record<string, (...args: unknown[]) => void>} */
    static _commands: Record<string, (...args: unknown[]) => void>;
    /**
     * @param {RMMZ.DataPlugin[]} plugins
     * @returns {void}
     */
    static setup(plugins: RMMZ.DataPlugin[]): void;
    /**
     * @param {string} name
     * @returns {Record<string, unknown>}
     */
    static parameters(name: string): Record<string, unknown>;
    /**
     * @param {string} name
     * @param {Record<string, unknown>} parameters
     * @returns {void}
     */
    static setParameters(name: string, parameters: Record<string, unknown>): void;
    /**
     * @param {string} filename
     * @returns {void}
     */
    static loadScript(filename: string): void;
    /**
     * @param {Event | string} e
     * @returns {void}
     */
    static onError(e: Event | string): void;
    /**
     * @param {string} filename
     * @returns {string}
     */
    static makeUrl(filename: string): string;
    /** @returns {void} */
    static checkErrors(): void;
    /**
     * @param {string} url
     * @returns {void}
     */
    static throwLoadError(url: string): void;
    /**
     * @template {RMMZ.PluginParameters} T
     * @param {string} pluginName
     * @param {string} commandName
     * @param {(args: T) => void} func
     * @returns {void}
     */
    static registerCommand<T extends RMMZ.PluginParameters>(pluginName: string, commandName: string, func: (args: T) => void): void;
    /**
     * @param {unknown} self
     * @param {string} pluginName
     * @param {string} commandName
     * @param {unknown[]} args
     * @returns {void}
     */
    static callCommand(self: unknown, pluginName: string, commandName: string, args: unknown[]): void;
}
declare namespace RMMZ {
    /**
     * The static class that manages storage for saving game data.
     */
    class StorageManager {
        /** @type {string[]} */
        static _forageKeys: string[];
        /** @type {boolean} */
        static _forageKeysUpdated: boolean;
        /** @returns {boolean} */
        static isLocalMode(): boolean;
        /**
         * @template T
         * @param {string} saveName
         * @param {T} object
         * @returns {Promise<number | void>}
         */
        static saveObject<T>(saveName: string, object: T): Promise<number | void>;
        /**
         * @template T
         * @param {string} saveName
         * @returns {Promise<T>}
         */
        static loadObject<T>(saveName: string): Promise<T>;
        /**
         * @template T
         * @param {T} object
         * @returns {Promise<string>}
         */
        static objectToJson<T>(object: T): Promise<string>;
        /**
         * @template T
         * @param {string} json
         * @returns {Promise<T>}
         */
        static jsonToObject<T>(json: string): Promise<T>;
        /**
         * @param {string} json
         * @returns {Promise<string>}
         */
        static jsonToZip(json: string): Promise<string>;
        /**
         * @param {string} zip
         * @returns {Promise<string>}
         */
        static zipToJson(zip: string): Promise<string>;
        /**
         * @param {string} saveName
         * @param {string} zip
         * @returns {Promise<void> | Promise<number>}
         */
        static saveZip(saveName: string, zip: string): Promise<void> | Promise<number>;
        /**
         * @param {string} saveName
         * @returns {Promise<string>}
         */
        static loadZip(saveName: string): Promise<string>;
        /**
         * @param {string} saveName
         * @returns {boolean}
         */
        static exists(saveName: string): boolean;
        /**
         * @param {string} saveName
         * @returns {void | Promise<number>}
         */
        static remove(saveName: string): void | Promise<number>;
        /**
         * @param {string} saveName
         * @param {string} zip
         * @returns {Promise<void>}
         */
        static saveToLocalFile(saveName: string, zip: string): Promise<void>;
        /**
         * @param {string} saveName
         * @returns {Promise<string>}
         */
        static loadFromLocalFile(saveName: string): Promise<string>;
        /**
         * @param {string} saveName
         * @returns {boolean}
         */
        static localFileExists(saveName: string): boolean;
        /**
         * @param {string} saveName
         * @returns {void}
         */
        static removeLocalFile(saveName: string): void;
        /**
         * @param {string} saveName
         * @param {string} zip
         * @returns {Promise<number>}
         */
        static saveToForage(saveName: string, zip: string): Promise<number>;
        /**
         * @param {string} saveName
         * @returns {Promise<string>}
         */
        static loadFromForage(saveName: string): Promise<string>;
        /**
         * @param {string} saveName
         * @returns {boolean}
         */
        static forageExists(saveName: string): boolean;
        /**
         * @param {string} saveName
         * @returns {Promise<number>}
         */
        static removeForage(saveName: string): Promise<number>;
        /** @returns {Promise<number>} */
        static updateForageKeys(): Promise<number>;
        /** @returns {boolean} */
        static forageKeysUpdated(): boolean;
        /**
         * @param {string} path
         * @returns {void}
         */
        static fsMkdir(path: string): void;
        /**
         * @param {string} oldPath
         * @param {string} newPath
         * @returns {void}
         */
        static fsRename(oldPath: string, newPath: string): void;
        /**
         * @param {string} path
         * @returns {void}
         */
        static fsUnlink(path: string): void;
        /**
         * @param {string} path
         * @returns {string | null}
         */
        static fsReadFile(path: string): string | null;
        /**
         * @param {string} path
         * @param {string} data
         * @returns {void}
         */
        static fsWriteFile(path: string, data: string): void;
        /** @returns {string} */
        static fileDirectoryPath(): string;
        /**
         * @param {string} saveName
         * @returns {string}
         */
        static filePath(saveName: string): string;
        /**
         * @param {string} saveName
         * @returns {string}
         */
        static forageKey(saveName: string): string;
        /** @returns {string} */
        static forageTestKey(): string;
    }
}
