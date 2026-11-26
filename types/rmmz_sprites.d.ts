// Auto-generated from JSDoc in src/js/rmmz_sprites.js via `pnpm build:types`. Do not edit manually.

/**
 * The sprite class with click handling functions.
 */
declare class Sprite_Clickable extends Sprite {
    constructor(...args: any[]);
    initialize(...args: never[]): void;
    /** @type {boolean} */
    _pressed: boolean | undefined;
    /** @type {boolean} */
    _hovered: boolean | undefined;
    /** @returns {void} */
    processTouch(): void;
    /** @returns {boolean} */
    isPressed(): boolean;
    /** @returns {boolean} */
    isClickEnabled(): boolean;
    /** @returns {boolean} */
    isBeingTouched(): boolean;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    hitTest(x: number, y: number): boolean;
    /** @returns {void} */
    onMouseEnter(): void;
    /** @returns {void} */
    onMouseExit(): void;
    /** @returns {void} */
    onPress(): void;
    /** @returns {void} */
    onClick(): void;
}
/**
 * The sprite for displaying a button.
 */
declare class Sprite_Button extends Sprite_Clickable {
    /** @param {[buttonType: "cancel" | "pageup" | "pagedown" | "down" | "up" | "down2" | "up2" | "ok" | "menu"]} args */
    constructor(buttonType: "menu" | "cancel" | "ok" | "pageup" | "pagedown" | "up" | "down" | "down2" | "up2");
    /** @param {"cancel" | "pageup" | "pagedown" | "down" | "up" | "down2" | "up2" | "ok" | "menu"} buttonType */
    initialize(buttonType: "cancel" | "pageup" | "pagedown" | "down" | "up" | "down2" | "up2" | "ok" | "menu"): void;
    /** @type {"cancel" | "pageup" | "pagedown" | "down" | "up" | "down2" | "up2" | "ok" | "menu"} */
    _buttonType: "menu" | "cancel" | "ok" | "pageup" | "pagedown" | "up" | "down" | "down2" | "up2" | undefined;
    /** @type {(() => void) | null} */
    _clickHandler: (() => void) | null | undefined;
    /** @type {Rectangle | null} */
    _coldFrame: Rectangle | null | undefined;
    /** @type {Rectangle | null} */
    _hotFrame: Rectangle | null | undefined;
    /** @returns {void} */
    setupFrames(): void;
    /** @returns {number} */
    blockWidth(): number;
    /** @returns {number} */
    blockHeight(): number;
    /** @returns {void} */
    loadButtonImage(): void;
    /** @returns {{ x: number; w: number; } | { x: number; w: number; } | { x: number; w: number; } | { x: number; w: number; } | { x: number; w: number; } | { x: number; w: number; } | { x: number; w: number; } | { x: number; w: number; } | { x: number; w: number; }} */
    buttonData(): {
        x: number;
        w: number;
    } | {
        x: number;
        w: number;
    } | {
        x: number;
        w: number;
    } | {
        x: number;
        w: number;
    } | {
        x: number;
        w: number;
    } | {
        x: number;
        w: number;
    } | {
        x: number;
        w: number;
    } | {
        x: number;
        w: number;
    } | {
        x: number;
        w: number;
    };
    /** @returns {void} */
    checkBitmap(): void;
    /** @returns {void} */
    updateFrame(): void;
    /** @returns {void} */
    updateOpacity(): void;
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @returns {void}
     */
    setColdFrame(x: number, y: number, width: number, height: number): void;
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @returns {void}
     */
    setHotFrame(x: number, y: number, width: number, height: number): void;
    /**
     * @param {() => void} method
     * @returns {void}
     */
    setClickHandler(method: () => void): void;
}
/**
 * The sprite for displaying a character.
 */
declare class Sprite_Character extends Sprite {
    /** @param {[character: Game_Character]} args */
    constructor(character: Game_Character);
    /** @param {Game_Character} character */
    initialize(character: Game_Character): void;
    initialize(...args: any[]): void;
    /** @returns {void} */
    initMembers(): void;
    /** @type {Game_Character} */
    _character: Game_Character | undefined;
    /** @type {number} */
    _balloonDuration: number | undefined;
    /** @type {RMMZ.TilesetID} */
    _tilesetId: number | undefined;
    /** @type {Sprite} */
    _upperBody: Sprite | undefined;
    /** @type {Sprite} */
    _lowerBody: Sprite | undefined;
    /**
     * @param {Game_Character} character
     * @returns {void}
     */
    setCharacter(character: Game_Character): void;
    /**
     * @param {Game_Character} character
     * @returns {boolean}
     */
    checkCharacter(character: Game_Character): boolean;
    /** @returns {boolean} */
    isTile(): boolean;
    /** @returns {boolean} */
    isObjectCharacter(): boolean;
    /** @returns {boolean} */
    isEmptyCharacter(): boolean;
    /**
     * @param {RMMZ.TileID} tileId
     * @returns {import("../core").Bitmap}
     */
    tilesetBitmap(tileId: RMMZ.TileID): any;
    /** @returns {void} */
    updateBitmap(): void;
    _tileId: number | undefined;
    _characterName: string | undefined;
    _characterIndex: number | undefined;
    /** @returns {boolean} */
    isImageChanged(): boolean;
    /** @returns {void} */
    setTileBitmap(): void;
    /** @returns {void} */
    setCharacterBitmap(): void;
    _isBigCharacter: boolean | undefined;
    /** @returns {void} */
    updateFrame(): void;
    /** @returns {void} */
    updateTileFrame(): void;
    /** @returns {void} */
    updateCharacterFrame(): void;
    /** @returns {number} */
    characterBlockX(): number;
    /** @returns {number} */
    characterBlockY(): number;
    /** @returns {number} */
    characterPatternX(): number;
    /** @returns {number} */
    characterPatternY(): number;
    /** @returns {number} */
    patternWidth(): number;
    /** @returns {number} */
    patternHeight(): number;
    /** @returns {void} */
    updateHalfBodySprites(): void;
    /** @returns {void} */
    createHalfBodySprites(): void;
    /** @returns {void} */
    updatePosition(): void;
    z: number | undefined;
    /** @returns {void} */
    updateOther(): void;
    _bushDepth: number | undefined;
}
/**
 * The superclass of Sprite_Actor and Sprite_Enemy.
 */
declare class Sprite_Battler extends Sprite_Clickable {
    /** @param {[battler: RMMZ.ActionTarget]} args */
    constructor(battler: RMMZ.ActionTarget);
    /** @param {RMMZ.ActionTarget} battler */
    initialize(battler: RMMZ.ActionTarget): void;
    /** @returns {void} */
    initMembers(): void;
    /** @type {RMMZ.ActionTarget} */
    _battler: RMMZ.ActionTarget | undefined;
    /** @type {Sprite_Damage[]} */
    _damages: Sprite_Damage[] | undefined;
    /** @type {number} */
    _homeX: number | undefined;
    /** @type {number} */
    _homeY: number | undefined;
    /** @type {number} */
    _offsetX: number | undefined;
    /** @type {number} */
    _offsetY: number | undefined;
    /** @type {number} */
    _targetOffsetX: number | undefined;
    /** @type {number} */
    _targetOffsetY: number | undefined;
    /** @type {number} */
    _movementDuration: number | undefined;
    /** @type {number} */
    _selectionEffectCount: number | undefined;
    /**
     * @param {RMMZ.ActionTarget} battler
     * @returns {void}
     */
    setBattler(battler: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} battler
     * @returns {boolean}
     */
    checkBattler(battler: RMMZ.ActionTarget): boolean;
    /** @returns {Sprite} */
    mainSprite(): Sprite;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    setHome(x: number, y: number): void;
    /** @returns {void} */
    updateMain(): void;
    /** @returns {void} */
    updateBitmap(): void;
    /** @returns {void} */
    updateFrame(): void;
    /** @returns {void} */
    updateMove(): void;
    /** @returns {void} */
    updatePosition(): void;
    /** @returns {void} */
    updateDamagePopup(): void;
    /** @returns {void} */
    updateSelectionEffect(): void;
    /** @returns {void} */
    setupDamagePopup(): void;
    /** @returns {void} */
    createDamageSprite(): void;
    /**
     * @param {Sprite_Damage} sprite
     * @returns {void}
     */
    destroyDamageSprite(sprite: Sprite_Damage): void;
    /** @returns {number} */
    damageOffsetX(): number;
    /** @returns {number} */
    damageOffsetY(): number;
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} duration
     * @returns {void}
     */
    startMove(x: number, y: number, duration: number): void;
    /** @returns {void} */
    onMoveEnd(): void;
    /** @returns {boolean} */
    isEffecting(): boolean;
    /** @returns {boolean} */
    isMoving(): boolean;
    /** @returns {boolean} */
    inHomePosition(): boolean;
}
/**
 * The sprite for displaying an actor.
 */
declare class Sprite_Actor extends Sprite_Battler {
    /** @type {{ walk: { index: number; loop: boolean; }; wait: { index: number; loop: boolean; }; chant: { index: number; loop: boolean; }; guard: { index: number; loop: boolean; }; damage: { index: number; loop: boolean; }; evade: { index: number; loop: boolean; }; thrust: { index: number; loop: boolean; }; swing: { index: number; loop: boolean; }; missile: { index: number; loop: boolean; }; skill: { index: number; loop: boolean; }; spell: { index: number; loop: boolean; }; item: { index: number; loop: boolean; }; escape: { index: number; loop: boolean; }; victory: { index: number; loop: boolean; }; dying: { index: number; loop: boolean; }; abnormal: { index: number; loop: boolean; }; sleep: { index: number; loop: boolean; }; dead: { index: number; loop: boolean; }; }} */
    static MOTIONS: {
        walk: {
            index: number;
            loop: boolean;
        };
        wait: {
            index: number;
            loop: boolean;
        };
        chant: {
            index: number;
            loop: boolean;
        };
        guard: {
            index: number;
            loop: boolean;
        };
        damage: {
            index: number;
            loop: boolean;
        };
        evade: {
            index: number;
            loop: boolean;
        };
        thrust: {
            index: number;
            loop: boolean;
        };
        swing: {
            index: number;
            loop: boolean;
        };
        missile: {
            index: number;
            loop: boolean;
        };
        skill: {
            index: number;
            loop: boolean;
        };
        spell: {
            index: number;
            loop: boolean;
        };
        item: {
            index: number;
            loop: boolean;
        };
        escape: {
            index: number;
            loop: boolean;
        };
        victory: {
            index: number;
            loop: boolean;
        };
        dying: {
            index: number;
            loop: boolean;
        };
        abnormal: {
            index: number;
            loop: boolean;
        };
        sleep: {
            index: number;
            loop: boolean;
        };
        dead: {
            index: number;
            loop: boolean;
        };
    };
    /** @param {[battler?: Game_Actor]} args */
    constructor(battler?: Game_Actor | undefined);
    /** @param {Game_Actor} [battler] */
    initialize(battler?: Game_Actor): void;
    initialize(...args: any[]): void;
    /** @type {string} */
    _battlerName: string | undefined;
    /** @type {(typeof Sprite_Actor.MOTIONS)[RMMZ.BattlerMotionType] | null} */
    _motion: {
        index: number;
        loop: boolean;
    } | {
        index: number;
        loop: boolean;
    } | {
        index: number;
        loop: boolean;
    } | {
        index: number;
        loop: boolean;
    } | {
        index: number;
        loop: boolean;
    } | {
        index: number;
        loop: boolean;
    } | {
        index: number;
        loop: boolean;
    } | {
        index: number;
        loop: boolean;
    } | {
        index: number;
        loop: boolean;
    } | {
        index: number;
        loop: boolean;
    } | {
        index: number;
        loop: boolean;
    } | {
        index: number;
        loop: boolean;
    } | {
        index: number;
        loop: boolean;
    } | {
        index: number;
        loop: boolean;
    } | {
        index: number;
        loop: boolean;
    } | {
        index: number;
        loop: boolean;
    } | {
        index: number;
        loop: boolean;
    } | {
        index: number;
        loop: boolean;
    } | null | undefined;
    /** @type {number} */
    _motionCount: number | undefined;
    /** @type {number} */
    _pattern: number | undefined;
    /** @returns {void} */
    createMainSprite(): void;
    _mainSprite: Sprite | undefined;
    /** @returns {void} */
    createShadowSprite(): void;
    _shadowSprite: Sprite | undefined;
    /** @returns {void} */
    createWeaponSprite(): void;
    _weaponSprite: Sprite_Weapon | undefined;
    /** @returns {void} */
    createStateSprite(): void;
    _stateSprite: Sprite_StateOverlay | undefined;
    /**
     * @param {Game_Actor} battler
     * @returns {void}
     */
    setBattler(battler: Game_Actor): void;
    _actor: any;
    /** @returns {void} */
    moveToStartPosition(): void;
    /**
     * @param {number} index
     * @returns {void}
     */
    setActorHome(index: number): void;
    /** @returns {void} */
    updateShadow(): void;
    /** @returns {void} */
    setupMotion(): void;
    /** @returns {void} */
    setupWeaponAnimation(): void;
    /**
     * @param {RMMZ.BattlerMotionType} motionType
     * @returns {void}
     */
    startMotion(motionType: RMMZ.BattlerMotionType): void;
    /** @returns {void} */
    updateTargetPosition(): void;
    /** @returns {boolean} */
    shouldStepForward(): boolean;
    /** @returns {void} */
    updateMotion(): void;
    /** @returns {void} */
    updateMotionCount(): void;
    /** @returns {number} */
    motionSpeed(): number;
    /** @returns {void} */
    refreshMotion(): void;
    /** @returns {void} */
    startEntryMotion(): void;
    /** @returns {void} */
    stepForward(): void;
    /** @returns {void} */
    stepBack(): void;
    /** @returns {void} */
    retreat(): void;
}
/**
 * The sprite for displaying an enemy.
 */
declare class Sprite_Enemy extends Sprite_Battler {
    constructor(...args: any[]);
    initialize(battler: any): void;
    /** @type {Game_Enemy} */
    _enemy: Game_Enemy | undefined;
    /** @type {boolean} */
    _appeared: boolean | undefined;
    /** @type {string | null} */
    _battlerName: string | null | undefined;
    /** @type {number} */
    _battlerHue: number | undefined;
    /** @type {RMMZ.BattlerEffectType | null} */
    _effectType: RMMZ.BattlerEffectType | null | undefined;
    /** @type {number} */
    _effectDuration: number | undefined;
    /** @type {number} */
    _shake: number | undefined;
    /** @returns {void} */
    createStateIconSprite(): void;
    _stateIconSprite: Sprite_StateIcon | undefined;
    /**
     * @param {Game_Enemy} battler
     * @returns {void}
     */
    setBattler(battler: Game_Enemy): void;
    /**
     * @param {string} name
     * @returns {void}
     */
    loadBitmap(name: string): void;
    /** @returns {void} */
    updateStateSprite(): void;
    /** @returns {void} */
    initVisibility(): void;
    /** @returns {void} */
    setupEffect(): void;
    /**
     * @param {RMMZ.BattlerEffectType} effectType
     * @returns {void}
     */
    startEffect(effectType: RMMZ.BattlerEffectType): void;
    /** @returns {void} */
    startAppear(): void;
    /** @returns {void} */
    startDisappear(): void;
    /** @returns {void} */
    startWhiten(): void;
    /** @returns {void} */
    startBlink(): void;
    /** @returns {void} */
    startCollapse(): void;
    /** @returns {void} */
    startBossCollapse(): void;
    /** @returns {void} */
    startInstantCollapse(): void;
    /** @returns {void} */
    updateEffect(): void;
    /** @returns {void} */
    revertToNormal(): void;
    /** @returns {void} */
    updateWhiten(): void;
    /** @returns {void} */
    updateBlink(): void;
    /** @returns {void} */
    updateAppear(): void;
    /** @returns {void} */
    updateDisappear(): void;
    /** @returns {void} */
    updateCollapse(): void;
    /** @returns {void} */
    updateBossCollapse(): void;
    /** @returns {void} */
    updateInstantCollapse(): void;
}
declare const Sprite_Animation_base: typeof import("pixi.js").RenderContainer;
/**
 * The sprite for displaying an animation.
 */
declare class Sprite_Animation extends Sprite_Animation_base {
    constructor();
    spriteId: number;
    /** @returns {void} */
    initMembers(): void;
    /** @type {Sprite[]} */
    _targets: Sprite[] | undefined;
    /** @type {RMMZ.DataAnimation} */
    _animation: RMMZ.DataAnimation | undefined;
    /** @type {boolean} */
    _mirror: boolean | undefined;
    /** @type {number} */
    _delay: number | undefined;
    /** @type {Sprite_Animation | null} */
    _previous: Sprite_Animation | null | undefined;
    /** @type {effekseer.EffekseerEffect | null} */
    _effect: effekseer.EffekseerEffect | null | undefined;
    /** @type {effekseer.EffekseerHandle | null} */
    _handle: effekseer.EffekseerHandle | null | undefined;
    /** @type {boolean} */
    _playing: boolean | undefined;
    /** @type {boolean} */
    _started: boolean | undefined;
    /** @type {number} */
    _frameIndex: number | undefined;
    /** @type {number} */
    _maxTimingFrames: number | undefined;
    /** @type {RMMZ.Writable<RMMZ.Color>} */
    _flashColor: [red: number, green: number, blue: number, alpha: number] | undefined;
    /** @type {number} */
    _flashDuration: number | undefined;
    /** @type {number} */
    _viewportSize: number | undefined;
    z: number | undefined;
    /**
     * @param {Sprite[]} targets
     * @param {RMMZ.DataAnimation} animation
     * @param {boolean} mirror
     * @param {number} delay
     * @param {Sprite_Animation | null} previous
     * @returns {void}
     */
    setup(targets: Sprite[], animation: RMMZ.DataAnimation, mirror: boolean, delay: number, previous: Sprite_Animation | null): void;
    /** @returns {void} */
    update(): void;
    /** @returns {boolean} */
    canStart(): boolean;
    /**
     * Allows the animation to start before the previous one finishes.
     * Waiting was a workaround for older versions of Effekseer that
     * were very heavy on some mobile devices.
     *
     * @returns {boolean}
     */
    shouldWaitForPrevious(): boolean;
    /** @returns {void} */
    updateEffectGeometry(): void;
    /** @returns {void} */
    updateMain(): void;
    /** @returns {void} */
    processSoundTimings(): void;
    /** @returns {void} */
    processFlashTimings(): void;
    /** @returns {void} */
    checkEnd(): void;
    /** @returns {void} */
    updateFlash(): void;
    /** @returns {boolean} */
    isPlaying(): boolean;
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {void}
     */
    setRotation(x: number, y: number, z: number): void;
    /**
     * @param {import("pixi.js").Renderer} renderer
     * @returns {void}
     */
    setProjectionMatrix(renderer: import("pixi.js").Renderer): void;
    setCameraMatrix(): void;
    /**
     * @param {import("pixi.js").Renderer} renderer
     * @returns {void}
     */
    setViewport(renderer: import("pixi.js").Renderer): void;
    /**
     * @param {import("pixi.js").Renderer} renderer
     * @returns {Point}
     */
    targetPosition(renderer: import("pixi.js").Renderer): Point;
    /**
     * @param {Sprite} sprite
     * @returns {import("pixi.js").Point}
     */
    targetSpritePosition(sprite: Sprite): import("pixi.js").Point;
}
/**
 * The sprite for displaying an old format animation.
 */
declare class Sprite_AnimationMV extends Sprite {
    /** @param {[]} args */
    constructor();
    initialize(): void;
    /** @returns {void} */
    initMembers(): void;
    /** @type {Sprite[]} */
    _targets: Sprite[] | undefined;
    /** @type {RMMZ.DataAnimationMV} */
    _animation: RMMZ.DataAnimationMV | undefined;
    /** @type {boolean} */
    _mirror: boolean | undefined;
    /** @type {number} */
    _delay: number | undefined;
    /** @type {number} */
    _rate: number | undefined;
    /** @type {number} */
    _duration: number | undefined;
    /** @type {RMMZ.Writable<RMMZ.Color>} */
    _flashColor: [red: number, green: number, blue: number, alpha: number] | undefined;
    /** @type {number} */
    _flashDuration: number | undefined;
    /** @type {number} */
    _screenFlashDuration: number | undefined;
    /** @type {number} */
    _hidingDuration: number | undefined;
    /** @type {number} */
    _hue1: number | undefined;
    /** @type {number} */
    _hue2: number | undefined;
    /** @type {Bitmap} */
    _bitmap1: Bitmap | undefined;
    /** @type {Bitmap} */
    _bitmap2: Bitmap | undefined;
    /** @type {Sprite[]} */
    _cellSprites: Sprite[] | undefined;
    /** @type {ScreenSprite | null} */
    _screenFlashSprite: ScreenSprite | null | undefined;
    z: number | undefined;
    /**
     * @param {Sprite[]} targets
     * @param {RMMZ.DataAnimationMV} animation
     * @param {boolean} mirror
     * @param {number} delay
     * @returns {void}
     */
    setup(targets: Sprite[], animation: RMMZ.DataAnimationMV, mirror: boolean, delay: number): void;
    /** @returns {void} */
    setupRate(): void;
    /** @returns {void} */
    setupDuration(): void;
    /** @returns {void} */
    updateFlash(): void;
    /** @returns {void} */
    updateScreenFlash(): void;
    /** @returns {number} */
    absoluteX(): number;
    /** @returns {number} */
    absoluteY(): number;
    /** @returns {void} */
    updateHiding(): void;
    /** @returns {boolean} */
    isPlaying(): boolean;
    /** @returns {void} */
    loadBitmaps(): void;
    /** @returns {boolean} */
    isReady(): boolean;
    /** @returns {void} */
    createCellSprites(): void;
    /** @returns {void} */
    createScreenFlashSprite(): void;
    /** @returns {void} */
    updateMain(): void;
    /** @returns {void} */
    updatePosition(): void;
    /** @returns {void} */
    updateFrame(): void;
    /** @returns {number} */
    currentFrameIndex(): number;
    /**
     * @param {RMMZ.DataFrameMV} frame
     * @returns {void}
     */
    updateAllCellSprites(frame: RMMZ.DataFrameMV): void;
    /**
     * @param {Sprite} sprite
     * @param {RMMZ.DataFrameCellMV} cell
     * @returns {void}
     */
    updateCellSprite(sprite: Sprite, cell: RMMZ.DataFrameCellMV): void;
    /**
     * @param {RMMZ.DataTimingMV} timing
     * @returns {void}
     */
    processTimingData(timing: RMMZ.DataTimingMV): void;
    /**
     * @param {RMMZ.Color} color
     * @param {number} duration
     * @returns {void}
     */
    startFlash(color: RMMZ.Color, duration: number): void;
    /**
     * @param {RMMZ.Color} color
     * @param {number} duration
     * @returns {void}
     */
    startScreenFlash(color: RMMZ.Color, duration: number): void;
    /**
     * @param {number} duration
     * @returns {void}
     */
    startHiding(duration: number): void;
    /** @returns {void} */
    onEnd(): void;
}
/**
 * The sprite for displaying a background image in battle.
 */
declare class Sprite_Battleback extends TilingSprite {
    /** @param {[type: 0 | 1]} args */
    constructor(type: 0 | 1);
    /** @param {0 | 1} type */
    initialize(type: 0 | 1): void;
    initialize(...args: any[]): void;
    /** @returns {void} */
    adjustPosition(): void;
    /** @returns {import("../core").Bitmap} */
    battleback1Bitmap(): any;
    /** @returns {import("../core").Bitmap} */
    battleback2Bitmap(): any;
    /** @returns {string} */
    battleback1Name(): string;
    /** @returns {string} */
    battleback2Name(): string;
    /** @returns {string} */
    overworldBattleback1Name(): string;
    /** @returns {string} */
    overworldBattleback2Name(): string;
    /** @returns {string} */
    normalBattleback1Name(): string;
    /** @returns {string} */
    normalBattleback2Name(): string;
    /**
     * @param {RMMZ.TerrainBattlebackType} type
     * @returns {"Wasteland" | "DirtField" | "Desert" | "Lava1" | "Lava2" | "Snowfield" | "Clouds" | "PoisonSwamp" | null}
     */
    terrainBattleback1Name(type: RMMZ.TerrainBattlebackType): "Wasteland" | "DirtField" | "Desert" | "Lava1" | "Lava2" | "Snowfield" | "Clouds" | "PoisonSwamp" | null;
    /**
     * @param {RMMZ.TerrainBattlebackType} type
     * @returns {"Wasteland" | "Desert" | "Snowfield" | "Clouds" | "PoisonSwamp" | "Forest" | "Cliff" | "Lava" | undefined}
     */
    terrainBattleback2Name(type: RMMZ.TerrainBattlebackType): "Wasteland" | "Desert" | "Snowfield" | "Clouds" | "PoisonSwamp" | "Forest" | "Cliff" | "Lava" | undefined;
    /** @returns {string} */
    defaultBattleback1Name(): string;
    /** @returns {string} */
    defaultBattleback2Name(): string;
    /** @returns {string} */
    shipBattleback1Name(): string;
    /** @returns {string} */
    shipBattleback2Name(): string;
    /**
     * @param {number} z
     * @returns {RMMZ.TerrainBattlebackType}
     */
    autotileType(z: number): RMMZ.TerrainBattlebackType;
}
/**
 * The sprite for displaying a popup damage.
 */
declare class Sprite_Damage extends Sprite {
    constructor(...args: any[]);
    initialize(): void;
    /** @type {number} */
    _duration: number | undefined;
    /** @type {RMMZ.Writable<RMMZ.Color>} */
    _flashColor: [red: number, green: number, blue: number, alpha: number] | undefined;
    /** @type {number} */
    _flashDuration: number | undefined;
    /** @type {number} */
    _colorType: number | undefined;
    /**
     * @param {import("pixi.js").DestroyOptions} [options]
     * @returns {void}
     */
    destroy(options?: import("pixi.js").DestroyOptions): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    setup(target: RMMZ.ActionTarget): void;
    /** @returns {void} */
    setupCriticalEffect(): void;
    /** @returns {string} */
    fontFace(): string;
    /** @returns {number} */
    fontSize(): number;
    /** @returns {"#ffffff" | "#b9ffb5" | "#ffff90" | "#80b0ff" | "#808080"} */
    damageColor(): "#ffffff" | "#b9ffb5" | "#ffff90" | "#80b0ff" | "#808080";
    /** @returns {string} */
    outlineColor(): string;
    /** @returns {number} */
    outlineWidth(): number;
    /** @returns {void} */
    createMiss(): void;
    /**
     * @param {number} value
     * @returns {void}
     */
    createDigits(value: number): void;
    /**
     * @param {number} width
     * @param {number} height
     * @returns {Sprite}
     */
    createChildSprite(width: number, height: number): Sprite;
    /**
     * @param {number} width
     * @param {number} height
     * @returns {Bitmap}
     */
    createBitmap(width: number, height: number): Bitmap;
    /**
     * @param {Sprite} sprite
     * @returns {void}
     */
    updateChild(sprite: Sprite): void;
    /** @returns {void} */
    updateFlash(): void;
    /** @returns {void} */
    updateOpacity(): void;
    /** @returns {boolean} */
    isPlaying(): boolean;
}
/**
 * The sprite for displaying a status gauge.
 */
declare class Sprite_Gauge extends Sprite {
    /** @param {[]} args */
    constructor();
    initialize(): void;
    /** @returns {void} */
    initMembers(): void;
    /** @type {RMMZ.ActionTarget | null} */
    _battler: RMMZ.ActionTarget | null | undefined;
    /** @type {string} */
    _statusType: string | undefined;
    /** @type {number} */
    _value: number | undefined;
    /** @type {number} */
    _maxValue: number | undefined;
    /** @type {number} */
    _targetValue: number | undefined;
    /** @type {number} */
    _targetMaxValue: number | undefined;
    /** @type {number} */
    _duration: number | undefined;
    /** @type {number} */
    _flashingCount: number | undefined;
    /**
     * @param {import("pixi.js").DestroyOptions} [options]
     * @returns {void}
     */
    destroy(options?: import("pixi.js").DestroyOptions): void;
    /** @returns {void} */
    createBitmap(): void;
    /** @returns {number} */
    bitmapWidth(): number;
    /** @returns {number} */
    bitmapHeight(): number;
    /** @returns {number} */
    textHeight(): number;
    /** @returns {number} */
    gaugeHeight(): number;
    /** @returns {number} */
    gaugeX(): number;
    /** @returns {number} */
    labelY(): number;
    /** @returns {string} */
    labelFontFace(): string;
    /** @returns {number} */
    labelFontSize(): number;
    /** @returns {string} */
    valueFontFace(): string;
    /** @returns {number} */
    valueFontSize(): number;
    /**
     * @param {RMMZ.ActionTarget} battler
     * @param {"time" | "hp" | "mp" | "tp"} statusType
     * @returns {void}
     */
    setup(battler: RMMZ.ActionTarget, statusType: "time" | "hp" | "mp" | "tp"): void;
    /** @returns {void} */
    updateBitmap(): void;
    /**
     * @param {number} value
     * @param {number} maxValue
     * @returns {void}
     */
    updateTargetValue(value: number, maxValue: number): void;
    /** @returns {20 | 5} */
    smoothness(): 20 | 5;
    /** @returns {void} */
    updateGaugeAnimation(): void;
    /** @returns {void} */
    updateFlashing(): void;
    /** @returns {RMMZ.Color} */
    flashingColor1(): RMMZ.Color;
    /** @returns {RMMZ.Color} */
    flashingColor2(): RMMZ.Color;
    /** @returns {boolean} */
    isValid(): boolean;
    /** @returns {number} */
    currentValue(): number;
    /** @returns {number} */
    currentMaxValue(): number;
    /** @returns {string} */
    gaugeLabel(): string;
    /** @returns {string} */
    gaugeBackColor(): string;
    /** @returns {string} */
    gaugeColor1(): string;
    /** @returns {string} */
    gaugeColor2(): string;
    /** @returns {string} */
    labelColor(): string;
    /** @returns {string} */
    labelOutlineColor(): string;
    /** @returns {number} */
    labelOutlineWidth(): number;
    /** @returns {string} */
    valueColor(): string;
    /** @returns {string} */
    valueOutlineColor(): string;
    /** @returns {number} */
    valueOutlineWidth(): number;
    /** @returns {void} */
    redraw(): void;
    /** @returns {void} */
    drawGauge(): void;
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @returns {void}
     */
    drawGaugeRect(x: number, y: number, width: number, height: number): void;
    /** @returns {number} */
    gaugeRate(): number;
    /** @returns {void} */
    drawLabel(): void;
    /** @returns {void} */
    setupLabelFont(): void;
    /** @returns {number} */
    measureLabelWidth(): number;
    /** @returns {255 | 160} */
    labelOpacity(): 255 | 160;
    /** @returns {void} */
    drawValue(): void;
    /** @returns {void} */
    setupValueFont(): void;
}
/**
 * The sprite for displaying a battler's name.
 */
declare class Sprite_Name extends Sprite {
    /** @param {[]} args */
    constructor();
    initialize(): void;
    /** @returns {void} */
    initMembers(): void;
    /** @type {RMMZ.ActionTarget | null} */
    _battler: RMMZ.ActionTarget | null | undefined;
    /** @type {string} */
    _name: string | undefined;
    /** @type {string} */
    _textColor: string | undefined;
    /**
     * @param {import("pixi.js").DestroyOptions} [options]
     * @returns {void}
     */
    destroy(options?: import("pixi.js").DestroyOptions): void;
    /** @returns {void} */
    createBitmap(): void;
    /** @returns {number} */
    bitmapWidth(): number;
    /** @returns {number} */
    bitmapHeight(): number;
    /** @returns {string} */
    fontFace(): string;
    /** @returns {number} */
    fontSize(): number;
    /**
     * @param {RMMZ.ActionTarget} battler
     * @returns {void}
     */
    setup(battler: RMMZ.ActionTarget): void;
    /** @returns {void} */
    updateBitmap(): void;
    /** @returns {string} */
    name(): string;
    /** @returns {string} */
    textColor(): string;
    /** @returns {string} */
    outlineColor(): string;
    /** @returns {number} */
    outlineWidth(): number;
    /** @returns {void} */
    redraw(): void;
    /** @returns {void} */
    setupFont(): void;
}
/**
 * The sprite for displaying state icons.
 */
declare class Sprite_StateIcon extends Sprite {
    /** @param {[]} args */
    constructor();
    initialize(): void;
    /** @returns {void} */
    initMembers(): void;
    /** @type {RMMZ.ActionTarget | null} */
    _battler: RMMZ.ActionTarget | null | undefined;
    /** @type {number} */
    _iconIndex: number | undefined;
    /** @type {number} */
    _animationCount: number | undefined;
    /** @type {number} */
    _animationIndex: number | undefined;
    /** @returns {void} */
    loadBitmap(): void;
    /**
     * @param {RMMZ.ActionTarget} battler
     * @returns {void}
     */
    setup(battler: RMMZ.ActionTarget): void;
    /** @returns {number} */
    animationWait(): number;
    /** @returns {void} */
    updateIcon(): void;
    /** @returns {this is { _battler: RMMZ.ActionTarget; }} */
    shouldDisplay(): this is {
        _battler: RMMZ.ActionTarget;
    };
    /** @returns {void} */
    updateFrame(): void;
}
/**
 * The sprite for displaying an overlay image for a state.
 */
declare class Sprite_StateOverlay extends Sprite {
    /** @param {[]} args */
    constructor();
    initialize(): void;
    /** @returns {void} */
    initMembers(): void;
    /** @type {RMMZ.ActionTarget | null} */
    _battler: RMMZ.ActionTarget | null | undefined;
    /** @type {number} */
    _overlayIndex: number | undefined;
    /** @type {number} */
    _animationCount: number | undefined;
    /** @type {number} */
    _pattern: number | undefined;
    /** @returns {void} */
    loadBitmap(): void;
    /**
     * @param {RMMZ.ActionTarget} battler
     * @returns {void}
     */
    setup(battler: RMMZ.ActionTarget): void;
    /** @returns {number} */
    animationWait(): number;
    /** @returns {void} */
    updatePattern(): void;
    /** @returns {void} */
    updateFrame(): void;
}
/**
 * The sprite for displaying a weapon image for attacking.
 */
declare class Sprite_Weapon extends Sprite {
    /** @param {[]} args */
    constructor();
    initialize(): void;
    /** @returns {void} */
    initMembers(): void;
    /** @type {number} */
    _weaponImageId: number | undefined;
    /** @type {number} */
    _animationCount: number | undefined;
    /** @type {number} */
    _pattern: number | undefined;
    /**
     * @param {number} weaponImageId
     * @returns {void}
     */
    setup(weaponImageId: number): void;
    /** @returns {number} */
    animationWait(): number;
    /** @returns {void} */
    updatePattern(): void;
    /** @returns {void} */
    loadBitmap(): void;
    /** @returns {void} */
    updateFrame(): void;
    /** @returns {boolean} */
    isPlaying(): boolean;
}
/**
 * The sprite for displaying a balloon icon.
 */
declare class Sprite_Balloon extends Sprite {
    /** @param {[]} args */
    constructor();
    initialize(): void;
    /** @returns {void} */
    initMembers(): void;
    /** @type {Sprite} */
    _target: Sprite | undefined;
    /** @type {RMMZ.BalloonIconID} */
    _balloonId: number | undefined;
    /** @type {number} */
    _duration: number | undefined;
    z: number | undefined;
    /** @returns {void} */
    loadBitmap(): void;
    /**
     * @param {Sprite} targetSprite
     * @param {RMMZ.BalloonIconID} balloonId
     * @returns {void}
     */
    setup(targetSprite: Sprite, balloonId: RMMZ.BalloonIconID): void;
    /** @returns {void} */
    updatePosition(): void;
    /** @returns {void} */
    updateFrame(): void;
    /** @returns {number} */
    speed(): number;
    /** @returns {number} */
    waitTime(): number;
    /** @returns {number} */
    frameIndex(): number;
    /** @returns {boolean} */
    isPlaying(): boolean;
}
/**
 * The sprite for displaying a picture.
 */
declare class Sprite_Picture extends Sprite_Clickable {
    /** @param {[pictureId: RMMZ.PictureID]} args */
    constructor(pictureId: number);
    /** @param {RMMZ.PictureID} pictureId */
    initialize(pictureId: RMMZ.PictureID): void;
    /** @type {RMMZ.PictureID} */
    _pictureId: number | undefined;
    /** @type {string} */
    _pictureName: string | undefined;
    /** @returns {import("..").Game_Picture | null} */
    picture(): any | null;
    /** @returns {void} */
    updateBitmap(): void;
    /** @returns {void} */
    updateOrigin(): void;
    /** @returns {void} */
    updatePosition(): void;
    /** @returns {void} */
    updateScale(): void;
    /** @returns {void} */
    updateTone(): void;
    /** @returns {void} */
    updateOther(): void;
    /** @returns {void} */
    loadBitmap(): void;
}
/**
 * The sprite for displaying the timer.
 */
declare class Sprite_Timer extends Sprite {
    /** @param {[]} args */
    constructor();
    initialize(): void;
    /** @type {number} */
    _seconds: number | undefined;
    /**
     * @param {import("pixi.js").DestroyOptions} [options]
     * @returns {void}
     */
    destroy(options?: import("pixi.js").DestroyOptions): void;
    /** @returns {void} */
    createBitmap(): void;
    /** @returns {string} */
    fontFace(): string;
    /** @returns {number} */
    fontSize(): number;
    /** @returns {void} */
    updateBitmap(): void;
    /** @returns {void} */
    redraw(): void;
    /** @returns {string} */
    timerText(): string;
    /** @returns {void} */
    updatePosition(): void;
}
/**
 * The sprite for displaying the destination place of the touch input.
 */
declare class Sprite_Destination extends Sprite {
    /** @param {[]} args */
    constructor();
    initialize(): void;
    /** @type {number} */
    _frameCount: number | undefined;
    /**
     * @param {import("pixi.js").DestroyOptions} [options]
     * @returns {void}
     */
    destroy(options?: import("pixi.js").DestroyOptions): void;
    /** @returns {void} */
    createBitmap(): void;
    /** @returns {void} */
    updatePosition(): void;
    /** @returns {void} */
    updateAnimation(): void;
}
/**
 * The superclass of Spriteset_Map and Spriteset_Battle.
 */
declare class Spriteset_Base extends Sprite {
    /** @param {[]} args */
    constructor();
    initialize(): void;
    /** @type {(Sprite_Animation | Sprite_AnimationMV)[]} */
    _animationSprites: (Sprite_Animation | Sprite_AnimationMV)[] | undefined;
    /**
     * @param {import("pixi.js").DestroyOptions} [options]
     * @returns {void}
     */
    destroy(options?: import("pixi.js").DestroyOptions): void;
    /** @returns {void} */
    loadSystemImages(): void;
    /** @returns {void} */
    createLowerLayer(): void;
    /** @returns {void} */
    createUpperLayer(): void;
    /** @returns {void} */
    createBaseSprite(): void;
    _baseSprite: Sprite | undefined;
    _blackScreen: ScreenSprite | undefined;
    /** @returns {void} */
    createBaseFilters(): void;
    _baseColorFilter: ColorFilter | undefined;
    /** @returns {void} */
    createPictures(): void;
    _pictureContainer: Sprite | undefined;
    /** @returns {Rectangle} */
    pictureContainerRect(): Rectangle;
    /** @returns {void} */
    createTimer(): void;
    _timerSprite: Sprite_Timer | undefined;
    /** @returns {void} */
    createOverallFilters(): void;
    _overallColorFilter: ColorFilter | undefined;
    /** @returns {void} */
    updateBaseFilters(): void;
    /** @returns {void} */
    updateOverallFilters(): void;
    /** @returns {void} */
    updatePosition(): void;
    /**
     * @param {any} target
     * @returns {Sprite | null | undefined}
     */
    findTargetSprite(target: any): Sprite | null | undefined;
    /** @returns {void} */
    updateAnimations(): void;
    /** @returns {void} */
    processAnimationRequests(): void;
    /**
     * @param {RMMZ.AnimationRequest} request
     * @returns {void}
     */
    createAnimation(request: RMMZ.AnimationRequest): void;
    /**
     * @param {RMMZ.AnimationTarget[]} targets
     * @param {RMMZ.DataAnimation | RMMZ.DataAnimationMV} animation
     * @param {boolean} mirror
     * @param {number} delay
     * @returns {void}
     */
    createAnimationSprite(targets: RMMZ.AnimationTarget[], animation: RMMZ.DataAnimation | RMMZ.DataAnimationMV, mirror: boolean, delay: number): void;
    /**
     * @param {RMMZ.DataAnimation | RMMZ.DataAnimationMV} animation
     * @returns {animation is RMMZ.DataAnimationMV}
     */
    isMVAnimation(animation: RMMZ.DataAnimation | RMMZ.DataAnimationMV): animation is RMMZ.DataAnimationMV;
    /**
     * @param {RMMZ.AnimationTarget[]} targets
     * @returns {Sprite[]}
     */
    makeTargetSprites(targets: RMMZ.AnimationTarget[]): Sprite[];
    /** @returns {Sprite_Animation | Sprite_AnimationMV} */
    lastAnimationSprite(): Sprite_Animation | Sprite_AnimationMV;
    /**
     * @param {RMMZ.DataAnimation | RMMZ.DataAnimationMV} animation
     * @returns {boolean}
     */
    isAnimationForEach(animation: RMMZ.DataAnimation | RMMZ.DataAnimationMV): boolean;
    /** @returns {number} */
    animationBaseDelay(): number;
    /** @returns {number} */
    animationNextDelay(): number;
    /**
     * @param {RMMZ.AnimationTarget & { isActor?: () => boolean; }} target
     * @returns {boolean}
     */
    animationShouldMirror(target: RMMZ.AnimationTarget & {
        isActor?: () => boolean;
    }): boolean;
    /**
     * @param {Sprite_Animation | Sprite_AnimationMV} sprite
     * @returns {void}
     */
    removeAnimation(sprite: Sprite_Animation | Sprite_AnimationMV): void;
    /** @returns {void} */
    removeAllAnimations(): void;
    /** @returns {boolean} */
    isAnimationPlaying(): boolean;
}
/**
 * The set of sprites on the map screen.
 */
declare class Spriteset_Map extends Spriteset_Base {
    constructor(...args: any[]);
    /** @type {Sprite_Balloon[]} */
    _balloonSprites: Sprite_Balloon[] | undefined;
    /** @returns {void} */
    hideCharacters(): void;
    /** @returns {void} */
    createParallax(): void;
    _parallax: TilingSprite | undefined;
    /** @returns {void} */
    createTilemap(): void;
    _effectsContainer: Tilemap | undefined;
    _tilemap: Tilemap | undefined;
    /** @returns {void} */
    loadTileset(): void;
    _tileset: any;
    /** @returns {void} */
    createCharacters(): void;
    _characterSprites: any[] | undefined;
    /** @returns {void} */
    createShadow(): void;
    _shadowSprite: Sprite | undefined;
    /** @returns {void} */
    createDestination(): void;
    _destinationSprite: Sprite_Destination | undefined;
    /** @returns {void} */
    createWeather(): void;
    _weather: Weather | undefined;
    /** @returns {void} */
    updateTileset(): void;
    /** @returns {void} */
    updateParallax(): void;
    _parallaxName: string | undefined;
    /** @returns {void} */
    updateTilemap(): void;
    /** @returns {void} */
    updateShadow(): void;
    /** @returns {void} */
    updateWeather(): void;
    /** @returns {void} */
    updateBalloons(): void;
    /** @returns {void} */
    processBalloonRequests(): void;
    /**
     * @param {RMMZ.BalloonRequest} request
     * @returns {void}
     */
    createBalloon(request: RMMZ.BalloonRequest): void;
    /**
     * @param {Sprite_Balloon} sprite
     * @returns {void}
     */
    removeBalloon(sprite: Sprite_Balloon): void;
    /** @returns {void} */
    removeAllBalloons(): void;
    /**
     * @param {Game_Character} target
     * @returns {Sprite_Character | undefined}
     */
    findTargetSprite(target: Game_Character): Sprite_Character | undefined;
}
/**
 * The set of sprites on the battle screen.
 */
declare class Spriteset_Battle extends Spriteset_Base {
    constructor(...args: any[]);
    /** @type {boolean} */
    _battlebackLocated: boolean | undefined;
    /** @returns {void} */
    createBackground(): void;
    _backgroundFilter: import("pixi.js").BlurFilter | undefined;
    _backgroundSprite: Sprite | undefined;
    /** @returns {void} */
    createBattleback(): void;
    _back1Sprite: Sprite_Battleback | undefined;
    _back2Sprite: Sprite_Battleback | undefined;
    /** @returns {void} */
    createBattleField(): void;
    _battleField: Sprite | undefined;
    _effectsContainer: Sprite | undefined;
    /** @returns {number} */
    battleFieldOffsetY(): number;
    /** @returns {void} */
    updateBattleback(): void;
    /** @returns {void} */
    createEnemies(): void;
    _enemySprites: Sprite_Enemy[] | undefined;
    /**
     * @param {Sprite_Enemy} a
     * @param {Sprite_Enemy} b
     * @returns {number}
     */
    compareEnemySprite(a: Sprite_Enemy, b: Sprite_Enemy): number;
    /** @returns {void} */
    createActors(): void;
    _actorSprites: any[] | undefined;
    /** @returns {void} */
    updateActors(): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {Sprite | undefined}
     */
    findTargetSprite(target: RMMZ.ActionTarget): Sprite | undefined;
    /** @returns {(Sprite_Actor | Sprite_Enemy)[]} */
    battlerSprites(): (Sprite_Actor | Sprite_Enemy)[];
    /** @returns {boolean} */
    isEffecting(): boolean;
    /** @returns {boolean} */
    isAnyoneMoving(): boolean;
    /** @returns {boolean} */
    isBusy(): boolean;
}
