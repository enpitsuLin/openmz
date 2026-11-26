// rmmz_sprites.js v1.10.0

/**
 * The sprite class with click handling functions.
 */
class Sprite_Clickable extends Sprite {
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
        /** @type {boolean} */
        this._pressed = false;
        /** @type {boolean} */
        this._hovered = false;
    }

    /** @returns {void} */
    update() {
        super.update();
        this.processTouch();
    }

    /** @returns {void} */
    processTouch() {
        if (this.isClickEnabled()) {
            if (this.isBeingTouched()) {
                if (!this._hovered && TouchInput.isHovered()) {
                    this._hovered = true;
                    this.onMouseEnter();
                }
                if (TouchInput.isTriggered()) {
                    this._pressed = true;
                    this.onPress();
                }
            } else {
                if (this._hovered) {
                    this.onMouseExit();
                }
                this._pressed = false;
                this._hovered = false;
            }
            if (this._pressed && TouchInput.isReleased()) {
                this._pressed = false;
                this.onClick();
            }
        } else {
            this._pressed = false;
            this._hovered = false;
        }
    }

    /** @returns {boolean} */
    isPressed() {
        return this._pressed;
    }

    /** @returns {boolean} */
    isClickEnabled() {
        for (let sprite = this; sprite; sprite = sprite.parent) {
            if (!sprite.visible) {
                return false;
            }
        }
        return true;
    }

    /** @returns {boolean} */
    isBeingTouched() {
        const touchPos = new PIXI.Point(TouchInput.x, TouchInput.y);
        const localPos = this.toLocal(touchPos);
        return this.hitTest(localPos.x, localPos.y);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    hitTest(x, y) {
        const rect = new PIXI.Rectangle(
            -this.anchor.x * this.width,
            -this.anchor.y * this.height,
            this.width,
            this.height
        );
        return rect.contains(x, y);
    }

    /** @returns {void} */
    onMouseEnter() {
        //
    }

    /** @returns {void} */
    onMouseExit() {
        //
    }

    /** @returns {void} */
    onPress() {
        //
    }

    /** @returns {void} */
    onClick() {
        //
    }
}

/**
 * The sprite for displaying a button.
 */
class Sprite_Button extends Sprite_Clickable {
    /** @param {[buttonType: "cancel" | "pageup" | "pagedown" | "down" | "up" | "down2" | "up2" | "ok" | "menu"]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {"cancel" | "pageup" | "pagedown" | "down" | "up" | "down2" | "up2" | "ok" | "menu"} buttonType */
    initialize(buttonType) {
        super.initialize();
        /** @type {"cancel" | "pageup" | "pagedown" | "down" | "up" | "down2" | "up2" | "ok" | "menu"} */
        this._buttonType = buttonType;
        /** @type {(() => void) | null} */
        this._clickHandler = null;
        /** @type {Rectangle | null} */
        this._coldFrame = null;
        /** @type {Rectangle | null} */
        this._hotFrame = null;
        this.setupFrames();
    }

    /** @returns {void} */
    setupFrames() {
        const data = this.buttonData();
        const x = data.x * this.blockWidth();
        const width = data.w * this.blockWidth();
        const height = this.blockHeight();
        this.loadButtonImage();
        this.setColdFrame(x, 0, width, height);
        this.setHotFrame(x, height, width, height);
        this.updateFrame();
        this.updateOpacity();
    }

    /** @returns {number} */
    blockWidth() {
        return 48;
    }

    /** @returns {number} */
    blockHeight() {
        return 48;
    }

    /** @returns {void} */
    loadButtonImage() {
        this.bitmap = ImageManager.loadSystem("ButtonSet");
    }

    /** @returns {{ x: number; w: number; } | { x: number; w: number; } | { x: number; w: number; } | { x: number; w: number; } | { x: number; w: number; } | { x: number; w: number; } | { x: number; w: number; } | { x: number; w: number; } | { x: number; w: number; }} */
    buttonData() {
        const buttonTable = {
            cancel: { x: 0, w: 2 },
            pageup: { x: 2, w: 1 },
            pagedown: { x: 3, w: 1 },
            down: { x: 4, w: 1 },
            up: { x: 5, w: 1 },
            down2: { x: 6, w: 1 },
            up2: { x: 7, w: 1 },
            ok: { x: 8, w: 2 },
            menu: { x: 10, w: 1 }
        };
        return buttonTable[this._buttonType];
    }

    /** @returns {void} */
    update() {
        super.update();
        this.checkBitmap();
        this.updateFrame();
        this.updateOpacity();
        this.processTouch();
    }

    /** @returns {void} */
    checkBitmap() {
        if (this.bitmap.isReady() && this.bitmap.width < this.blockWidth() * 11) {
            // Probably MV image is used
            throw new Error("ButtonSet image is too small");
        }
    }

    /** @returns {void} */
    updateFrame() {
        const frame = this.isPressed() ? this._hotFrame : this._coldFrame;
        if (frame) {
            this.setFrame(frame.x, frame.y, frame.width, frame.height);
        }
    }

    /** @returns {void} */
    updateOpacity() {
        this.opacity = this._pressed ? 255 : 192;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @returns {void}
     */
    setColdFrame(x, y, width, height) {
        this._coldFrame = new PIXI.Rectangle(x, y, width, height);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @returns {void}
     */
    setHotFrame(x, y, width, height) {
        this._hotFrame = new PIXI.Rectangle(x, y, width, height);
    }

    /**
     * @param {() => void} method
     * @returns {void}
     */
    setClickHandler(method) {
        this._clickHandler = method;
    }

    /** @returns {void} */
    onClick() {
        if (this._clickHandler) {
            this._clickHandler();
        } else {
            Input.virtualClick(this._buttonType);
        }
    }
}

/**
 * The sprite for displaying a character.
 */
class Sprite_Character extends Sprite {
    /** @param {[character: Game_Character]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Game_Character} character */
    initialize(character) {
        super.initialize();
        this.initMembers();
        this.setCharacter(character);
    }

    /** @returns {void} */
    initMembers() {
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        /** @type {Game_Character} */
        this._character = null;
        /** @type {number} */
        this._balloonDuration = 0;
        /** @type {RMMZ.TilesetID} */
        this._tilesetId = 0;
        /** @type {Sprite} */
        this._upperBody = null;
        /** @type {Sprite} */
        this._lowerBody = null;
    }

    /**
     * @param {Game_Character} character
     * @returns {void}
     */
    setCharacter(character) {
        this._character = character;
    }

    /**
     * @param {Game_Character} character
     * @returns {boolean}
     */
    checkCharacter(character) {
        return this._character === character;
    }

    /** @returns {void} */
    update() {
        super.update();
        this.updateBitmap();
        this.updateFrame();
        this.updatePosition();
        this.updateOther();
        this.updateVisibility();
    }

    /** @returns {void} */
    updateVisibility() {
        super.updateVisibility();
        if (this.isEmptyCharacter() || this._character.isTransparent()) {
            this.visible = false;
        }
    }

    /** @returns {boolean} */
    isTile() {
        return this._character.isTile();
    }

    /** @returns {boolean} */
    isObjectCharacter() {
        return this._character.isObjectCharacter();
    }

    /** @returns {boolean} */
    isEmptyCharacter() {
        return this._tileId === 0 && !this._characterName;
    }

    /**
     * @param {RMMZ.TileID} tileId
     * @returns {import("../core").Bitmap}
     */
    tilesetBitmap(tileId) {
        const tileset = $gameMap.tileset();
        const setNumber = 5 + Math.floor(tileId / 256);
        return ImageManager.loadTileset(tileset.tilesetNames[setNumber]);
    }

    /** @returns {void} */
    updateBitmap() {
        if (this.isImageChanged()) {
            this._tilesetId = $gameMap.tilesetId();
            this._tileId = this._character.tileId();
            this._characterName = this._character.characterName();
            this._characterIndex = this._character.characterIndex();
            if (this._tileId > 0) {
                this.setTileBitmap();
            } else {
                this.setCharacterBitmap();
            }
        }
    }

    /** @returns {boolean} */
    isImageChanged() {
        return (
            this._tilesetId !== $gameMap.tilesetId() ||
            this._tileId !== this._character.tileId() ||
            this._characterName !== this._character.characterName() ||
            this._characterIndex !== this._character.characterIndex()
        );
    }

    /** @returns {void} */
    setTileBitmap() {
        this.bitmap = this.tilesetBitmap(this._tileId);
    }

    /** @returns {void} */
    setCharacterBitmap() {
        this.bitmap = ImageManager.loadCharacter(this._characterName);
        this._isBigCharacter = ImageManager.isBigCharacter(this._characterName);
    }

    /** @returns {void} */
    updateFrame() {
        if (this._tileId > 0) {
            this.updateTileFrame();
        } else {
            this.updateCharacterFrame();
        }
    }

    /** @returns {void} */
    updateTileFrame() {
        const tileId = this._tileId;
        const pw = this.patternWidth();
        const ph = this.patternHeight();
        const sx = ((Math.floor(tileId / 128) % 2) * 8 + (tileId % 8)) * pw;
        const sy = (Math.floor((tileId % 256) / 8) % 16) * ph;
        this.setFrame(sx, sy, pw, ph);
    }

    /** @returns {void} */
    updateCharacterFrame() {
        const pw = this.patternWidth();
        const ph = this.patternHeight();
        const sx = (this.characterBlockX() + this.characterPatternX()) * pw;
        const sy = (this.characterBlockY() + this.characterPatternY()) * ph;
        this.updateHalfBodySprites();
        if (this._bushDepth > 0) {
            const d = this._bushDepth;
            this._upperBody.setFrame(sx, sy, pw, ph - d);
            this._lowerBody.setFrame(sx, sy + ph - d, pw, d);
            this.setFrame(sx, sy, 0, ph);
        } else {
            this.setFrame(sx, sy, pw, ph);
        }
    }

    /** @returns {number} */
    characterBlockX() {
        if (this._isBigCharacter) {
            return 0;
        } else {
            const index = this._character.characterIndex();
            return (index % 4) * 3;
        }
    }

    /** @returns {number} */
    characterBlockY() {
        if (this._isBigCharacter) {
            return 0;
        } else {
            const index = this._character.characterIndex();
            return Math.floor(index / 4) * 4;
        }
    }

    /** @returns {number} */
    characterPatternX() {
        return this._character.pattern();
    }

    /** @returns {number} */
    characterPatternY() {
        return (this._character.direction() - 2) / 2;
    }

    /** @returns {number} */
    patternWidth() {
        if (this._tileId > 0) {
            return $gameMap.tileWidth();
        } else if (this._isBigCharacter) {
            return this.bitmap.width / 3;
        } else {
            return this.bitmap.width / 12;
        }
    }

    /** @returns {number} */
    patternHeight() {
        if (this._tileId > 0) {
            return $gameMap.tileHeight();
        } else if (this._isBigCharacter) {
            return this.bitmap.height / 4;
        } else {
            return this.bitmap.height / 8;
        }
    }

    /** @returns {void} */
    updateHalfBodySprites() {
        if (this._bushDepth > 0) {
            this.createHalfBodySprites();
            this._upperBody.bitmap = this.bitmap;
            this._upperBody.visible = true;
            this._upperBody.y = -this._bushDepth;
            this._lowerBody.bitmap = this.bitmap;
            this._lowerBody.visible = true;
            this._upperBody.setBlendColor(this.getBlendColor());
            this._lowerBody.setBlendColor(this.getBlendColor());
            this._upperBody.setColorTone(this.getColorTone());
            this._lowerBody.setColorTone(this.getColorTone());
            this._upperBody.blendMode = this.blendMode;
            this._lowerBody.blendMode = this.blendMode;
        } else if (this._upperBody) {
            this._upperBody.visible = false;
            this._lowerBody.visible = false;
        }
    }

    /** @returns {void} */
    createHalfBodySprites() {
        if (!this._upperBody) {
            this._upperBody = new Sprite();
            this._upperBody.anchor.x = 0.5;
            this._upperBody.anchor.y = 1;
            this.addChild(this._upperBody);
        }
        if (!this._lowerBody) {
            this._lowerBody = new Sprite();
            this._lowerBody.anchor.x = 0.5;
            this._lowerBody.anchor.y = 1;
            this._lowerBody.opacity = 128;
            this.addChild(this._lowerBody);
        }
    }

    /** @returns {void} */
    updatePosition() {
        this.x = this._character.screenX();
        this.y = this._character.screenY();
        this.z = this._character.screenZ();
    }

    /** @returns {void} */
    updateOther() {
        this.opacity = this._character.opacity();
        this.blendMode = this._character.blendMode();
        this._bushDepth = this._character.bushDepth();
    }
}

/**
 * The superclass of Sprite_Actor and Sprite_Enemy.
 */
class Sprite_Battler extends Sprite_Clickable {
    /** @param {[battler: RMMZ.ActionTarget]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {RMMZ.ActionTarget} battler */
    initialize(battler) {
        super.initialize();
        this.initMembers();
        this.setBattler(battler);
    }

    /** @returns {void} */
    initMembers() {
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        /** @type {RMMZ.ActionTarget} */
        this._battler = null;
        /** @type {Sprite_Damage[]} */
        this._damages = [];
        /** @type {number} */
        this._homeX = 0;
        /** @type {number} */
        this._homeY = 0;
        /** @type {number} */
        this._offsetX = 0;
        /** @type {number} */
        this._offsetY = 0;
        /** @type {number} */
        this._targetOffsetX = NaN;
        /** @type {number} */
        this._targetOffsetY = NaN;
        /** @type {number} */
        this._movementDuration = 0;
        /** @type {number} */
        this._selectionEffectCount = 0;
    }

    /**
     * @param {RMMZ.ActionTarget} battler
     * @returns {void}
     */
    setBattler(battler) {
        this._battler = battler;
    }

    /**
     * @param {RMMZ.ActionTarget} battler
     * @returns {boolean}
     */
    checkBattler(battler) {
        return this._battler === battler;
    }

    /** @returns {Sprite} */
    mainSprite() {
        return this;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    setHome(x, y) {
        this._homeX = x;
        this._homeY = y;
        this.updatePosition();
    }

    /** @returns {void} */
    update() {
        super.update();
        if (this._battler) {
            this.updateMain();
            this.updateDamagePopup();
            this.updateSelectionEffect();
            this.updateVisibility();
        } else {
            this.bitmap = null;
        }
    }

    /** @returns {void} */
    updateVisibility() {
        super.updateVisibility();
        if (!this._battler || !this._battler.isSpriteVisible()) {
            this.visible = false;
        }
    }

    /** @returns {void} */
    updateMain() {
        if (this._battler.isSpriteVisible()) {
            this.updateBitmap();
            this.updateFrame();
        }
        this.updateMove();
        this.updatePosition();
    }

    /** @returns {void} */
    updateBitmap() {
        //
    }

    /** @returns {void} */
    updateFrame() {
        //
    }

    /** @returns {void} */
    updateMove() {
        if (this._movementDuration > 0) {
            const d = this._movementDuration;
            this._offsetX = (this._offsetX * (d - 1) + this._targetOffsetX) / d;
            this._offsetY = (this._offsetY * (d - 1) + this._targetOffsetY) / d;
            this._movementDuration--;
            if (this._movementDuration === 0) {
                this.onMoveEnd();
            }
        }
    }

    /** @returns {void} */
    updatePosition() {
        this.x = this._homeX + this._offsetX;
        this.y = this._homeY + this._offsetY;
    }

    /** @returns {void} */
    updateDamagePopup() {
        this.setupDamagePopup();
        if (this._damages.length > 0) {
            for (const damage of this._damages) {
                damage.update();
            }
            if (!this._damages[0].isPlaying()) {
                this.destroyDamageSprite(this._damages[0]);
            }
        }
    }

    /** @returns {void} */
    updateSelectionEffect() {
        const target = this.mainSprite();
        if (this._battler.isSelected()) {
            this._selectionEffectCount++;
            if (this._selectionEffectCount % 30 < 15) {
                target.setBlendColor([255, 255, 255, 64]);
            } else {
                target.setBlendColor([0, 0, 0, 0]);
            }
        } else if (this._selectionEffectCount > 0) {
            this._selectionEffectCount = 0;
            target.setBlendColor([0, 0, 0, 0]);
        }
    }

    /** @returns {void} */
    setupDamagePopup() {
        if (this._battler.isDamagePopupRequested()) {
            if (this._battler.isSpriteVisible()) {
                this.createDamageSprite();
            }
            this._battler.clearDamagePopup();
            this._battler.clearResult();
        }
    }

    /** @returns {void} */
    createDamageSprite() {
        const last = this._damages[this._damages.length - 1];
        const sprite = new Sprite_Damage();
        if (last) {
            sprite.x = last.x + 8;
            sprite.y = last.y - 16;
        } else {
            sprite.x = this.x + this.damageOffsetX();
            sprite.y = this.y + this.damageOffsetY();
        }
        sprite.setup(this._battler);
        this._damages.push(sprite);
        this.parent.addChild(sprite);
    }

    /**
     * @param {Sprite_Damage} sprite
     * @returns {void}
     */
    destroyDamageSprite(sprite) {
        this.parent.removeChild(sprite);
        this._damages.remove(sprite);
        sprite.destroy();
    }

    /** @returns {number} */
    damageOffsetX() {
        return 0;
    }

    /** @returns {number} */
    damageOffsetY() {
        return 0;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} duration
     * @returns {void}
     */
    startMove(x, y, duration) {
        if (this._targetOffsetX !== x || this._targetOffsetY !== y) {
            this._targetOffsetX = x;
            this._targetOffsetY = y;
            this._movementDuration = duration;
            if (duration === 0) {
                this._offsetX = x;
                this._offsetY = y;
            }
        }
    }

    /** @returns {void} */
    onMoveEnd() {
        //
    }

    /** @returns {boolean} */
    isEffecting() {
        return false;
    }

    /** @returns {boolean} */
    isMoving() {
        return this._movementDuration > 0;
    }

    /** @returns {boolean} */
    inHomePosition() {
        return this._offsetX === 0 && this._offsetY === 0;
    }

    /** @returns {void} */
    onMouseEnter() {
        $gameTemp.setTouchState(this._battler, "select");
    }

    /** @returns {void} */
    onPress() {
        $gameTemp.setTouchState(this._battler, "select");
    }

    /** @returns {void} */
    onClick() {
        $gameTemp.setTouchState(this._battler, "click");
    }
}

/**
 * The sprite for displaying an actor.
 */
class Sprite_Actor extends Sprite_Battler {
    /** @param {[battler?: Game_Actor]} args */
    constructor(...args) {
        super(...args);
    }

    /** @type {{ walk: { index: number; loop: boolean; }; wait: { index: number; loop: boolean; }; chant: { index: number; loop: boolean; }; guard: { index: number; loop: boolean; }; damage: { index: number; loop: boolean; }; evade: { index: number; loop: boolean; }; thrust: { index: number; loop: boolean; }; swing: { index: number; loop: boolean; }; missile: { index: number; loop: boolean; }; skill: { index: number; loop: boolean; }; spell: { index: number; loop: boolean; }; item: { index: number; loop: boolean; }; escape: { index: number; loop: boolean; }; victory: { index: number; loop: boolean; }; dying: { index: number; loop: boolean; }; abnormal: { index: number; loop: boolean; }; sleep: { index: number; loop: boolean; }; dead: { index: number; loop: boolean; }; }} */
    static MOTIONS = {
        walk: { index: 0, loop: true },
        wait: { index: 1, loop: true },
        chant: { index: 2, loop: true },
        guard: { index: 3, loop: true },
        damage: { index: 4, loop: false },
        evade: { index: 5, loop: false },
        thrust: { index: 6, loop: false },
        swing: { index: 7, loop: false },
        missile: { index: 8, loop: false },
        skill: { index: 9, loop: false },
        spell: { index: 10, loop: false },
        item: { index: 11, loop: false },
        escape: { index: 12, loop: true },
        victory: { index: 13, loop: true },
        dying: { index: 14, loop: true },
        abnormal: { index: 15, loop: true },
        sleep: { index: 16, loop: true },
        dead: { index: 17, loop: true }
    };

    /** @param {Game_Actor} [battler] */
    initialize(battler) {
        super.initialize(battler);
        this.moveToStartPosition();
    }

    /** @returns {void} */
    initMembers() {
        super.initMembers();
        /** @type {string} */
        this._battlerName = "";
        /** @type {(typeof Sprite_Actor.MOTIONS)[RMMZ.BattlerMotionType] | null} */
        this._motion = null;
        /** @type {number} */
        this._motionCount = 0;
        /** @type {number} */
        this._pattern = 0;
        this.createShadowSprite();
        this.createWeaponSprite();
        this.createMainSprite();
        this.createStateSprite();
    }

    /** @returns {Sprite} */
    mainSprite() {
        return this._mainSprite;
    }

    /** @returns {void} */
    createMainSprite() {
        this._mainSprite = new Sprite();
        this._mainSprite.anchor.x = 0.5;
        this._mainSprite.anchor.y = 1;
        this.addChild(this._mainSprite);
    }

    /** @returns {void} */
    createShadowSprite() {
        this._shadowSprite = new Sprite();
        this._shadowSprite.bitmap = ImageManager.loadSystem("Shadow2");
        this._shadowSprite.anchor.x = 0.5;
        this._shadowSprite.anchor.y = 0.5;
        this._shadowSprite.y = -2;
        this.addChild(this._shadowSprite);
    }

    /** @returns {void} */
    createWeaponSprite() {
        this._weaponSprite = new Sprite_Weapon();
        this.addChild(this._weaponSprite);
    }

    /** @returns {void} */
    createStateSprite() {
        this._stateSprite = new Sprite_StateOverlay();
        this.addChild(this._stateSprite);
    }

    /**
     * @param {Game_Actor} battler
     * @returns {void}
     */
    setBattler(battler) {
        super.setBattler(battler);
        if (battler !== this._actor) {
            this._actor = battler;
            if (battler) {
                this.setActorHome(battler.index());
            } else {
                this._mainSprite.bitmap = null;
                this._battlerName = "";
            }
            this.startEntryMotion();
            this._stateSprite.setup(battler);
        }
    }

    /** @returns {void} */
    moveToStartPosition() {
        this.startMove(300, 0, 0);
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    setActorHome(index) {
        this.setHome(600 + index * 32, 280 + index * 48);
    }

    /** @returns {void} */
    update() {
        super.update();
        this.updateShadow();
        if (this._actor) {
            this.updateMotion();
        }
    }

    /** @returns {void} */
    updateShadow() {
        this._shadowSprite.visible = !!this._actor;
    }

    /** @returns {void} */
    updateMain() {
        super.updateMain();
        if (this._actor.isSpriteVisible() && !this.isMoving()) {
            this.updateTargetPosition();
        }
    }

    /** @returns {void} */
    setupMotion() {
        if (this._actor.isMotionRequested()) {
            this.startMotion(this._actor.motionType());
            this._actor.clearMotion();
        }
    }

    /** @returns {void} */
    setupWeaponAnimation() {
        if (this._actor.isWeaponAnimationRequested()) {
            this._weaponSprite.setup(this._actor.weaponImageId());
            this._actor.clearWeaponAnimation();
        }
    }

    /**
     * @param {RMMZ.BattlerMotionType} motionType
     * @returns {void}
     */
    startMotion(motionType) {
        const newMotion = Sprite_Actor.MOTIONS[motionType];
        if (this._motion !== newMotion) {
            this._motion = newMotion;
            this._motionCount = 0;
            this._pattern = 0;
        }
    }

    /** @returns {void} */
    updateTargetPosition() {
        if (this._actor.canMove() && BattleManager.isEscaped()) {
            this.retreat();
        } else if (this.shouldStepForward()) {
            this.stepForward();
        } else if (!this.inHomePosition()) {
            this.stepBack();
        }
    }

    /** @returns {boolean} */
    shouldStepForward() {
        return this._actor.isInputting() || this._actor.isActing();
    }

    /** @returns {void} */
    updateBitmap() {
        super.updateBitmap();
        const name = this._actor.battlerName();
        if (this._battlerName !== name) {
            this._battlerName = name;
            this._mainSprite.bitmap = ImageManager.loadSvActor(name);
        }
    }

    /** @returns {void} */
    updateFrame() {
        super.updateFrame();
        const bitmap = this._mainSprite.bitmap;
        if (bitmap) {
            const motionIndex = this._motion ? this._motion.index : 0;
            const pattern = this._pattern < 3 ? this._pattern : 1;
            const cw = bitmap.width / 9;
            const ch = bitmap.height / 6;
            const cx = Math.floor(motionIndex / 6) * 3 + pattern;
            const cy = motionIndex % 6;
            this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch);
            this.setFrame(0, 0, cw, ch);
        }
    }

    /** @returns {void} */
    updateMove() {
        const bitmap = this._mainSprite.bitmap;
        if (!bitmap || bitmap.isReady()) {
            super.updateMove();
        }
    }

    /** @returns {void} */
    updateMotion() {
        this.setupMotion();
        this.setupWeaponAnimation();
        if (this._actor.isMotionRefreshRequested()) {
            this.refreshMotion();
            this._actor.clearMotion();
        }
        this.updateMotionCount();
    }

    /** @returns {void} */
    updateMotionCount() {
        if (this._motion && ++this._motionCount >= this.motionSpeed()) {
            if (this._motion.loop) {
                this._pattern = (this._pattern + 1) % 4;
            } else if (this._pattern < 2) {
                this._pattern++;
            } else {
                this.refreshMotion();
            }
            this._motionCount = 0;
        }
    }

    /** @returns {number} */
    motionSpeed() {
        return 12;
    }

    /** @returns {void} */
    refreshMotion() {
        const actor = this._actor;
        if (actor) {
            const stateMotion = actor.stateMotionIndex();
            if (actor.isInputting() || actor.isActing()) {
                this.startMotion("walk");
            } else if (stateMotion === 3) {
                this.startMotion("dead");
            } else if (stateMotion === 2) {
                this.startMotion("sleep");
            } else if (actor.isChanting()) {
                this.startMotion("chant");
            } else if (actor.isGuard() || actor.isGuardWaiting()) {
                this.startMotion("guard");
            } else if (stateMotion === 1) {
                this.startMotion("abnormal");
            } else if (actor.isDying()) {
                this.startMotion("dying");
            } else if (actor.isUndecided()) {
                this.startMotion("walk");
            } else {
                this.startMotion("wait");
            }
        }
    }

    /** @returns {void} */
    startEntryMotion() {
        if (this._actor && this._actor.canMove()) {
            this.startMotion("walk");
            this.startMove(0, 0, 30);
        } else if (!this.isMoving()) {
            this.refreshMotion();
            this.startMove(0, 0, 0);
        }
    }

    /** @returns {void} */
    stepForward() {
        this.startMove(-48, 0, 12);
    }

    /** @returns {void} */
    stepBack() {
        this.startMove(0, 0, 12);
    }

    /** @returns {void} */
    retreat() {
        this.startMove(300, 0, 30);
    }

    /** @returns {void} */
    onMoveEnd() {
        super.onMoveEnd();
        if (!BattleManager.isBattleEnd()) {
            this.refreshMotion();
        }
    }

    /** @returns {number} */
    damageOffsetX() {
        return super.damageOffsetX() - 32;
    }

    /** @returns {number} */
    damageOffsetY() {
        return super.damageOffsetY();
    }
}

/**
 * The sprite for displaying an enemy.
 */
class Sprite_Enemy extends Sprite_Battler {
    constructor(...args) {
        super(...args);
    }

    initialize(battler) {
        super.initialize(battler);
    }

    /** @returns {void} */
    initMembers() {
        super.initMembers();
        /** @type {Game_Enemy} */
        this._enemy = null;
        /** @type {boolean} */
        this._appeared = false;
        /** @type {string | null} */
        this._battlerName = null;
        /** @type {number} */
        this._battlerHue = 0;
        /** @type {RMMZ.BattlerEffectType | null} */
        this._effectType = null;
        /** @type {number} */
        this._effectDuration = 0;
        /** @type {number} */
        this._shake = 0;
        this.createStateIconSprite();
    }

    /** @returns {void} */
    createStateIconSprite() {
        this._stateIconSprite = new Sprite_StateIcon();
        this.addChild(this._stateIconSprite);
    }

    /**
     * @param {Game_Enemy} battler
     * @returns {void}
     */
    setBattler(battler) {
        super.setBattler(battler);
        this._enemy = battler;
        this.setHome(battler.screenX(), battler.screenY());
        this._stateIconSprite.setup(battler);
    }

    /** @returns {void} */
    update() {
        super.update();
        if (this._enemy) {
            this.updateEffect();
            this.updateStateSprite();
        }
    }

    /** @returns {void} */
    updateBitmap() {
        super.updateBitmap();
        const name = this._enemy.battlerName();
        const hue = this._enemy.battlerHue();
        if (this._battlerName !== name || this._battlerHue !== hue) {
            this._battlerName = name;
            this._battlerHue = hue;
            this.loadBitmap(name);
            this.setHue(hue);
            this.initVisibility();
        }
    }

    /**
     * @param {string} name
     * @returns {void}
     */
    loadBitmap(name) {
        if ($gameSystem.isSideView()) {
            this.bitmap = ImageManager.loadSvEnemy(name);
        } else {
            this.bitmap = ImageManager.loadEnemy(name);
        }
    }

    /**
     * @param {number} hue
     * @returns {void}
     */
    setHue(hue) {
        super.setHue(hue);
        for (const child of this.children) {
            if (child.setHue) {
                child.setHue(-hue);
            }
        }
    }

    /** @returns {void} */
    updateFrame() {
        super.updateFrame();
        if (this._effectType === "bossCollapse") {
            this.setFrame(0, 0, this.bitmap.width, this._effectDuration);
        } else {
            this.setFrame(0, 0, this.bitmap.width, this.bitmap.height);
        }
    }

    /** @returns {void} */
    updatePosition() {
        super.updatePosition();
        this.x += this._shake;
    }

    /** @returns {void} */
    updateStateSprite() {
        this._stateIconSprite.y = -Math.round((this.bitmap.height + 40) * 0.9);
        if (this._stateIconSprite.y < 20 - this.y) {
            this._stateIconSprite.y = 20 - this.y;
        }
    }

    /** @returns {void} */
    initVisibility() {
        this._appeared = this._enemy.isAlive();
        if (!this._appeared) {
            this.opacity = 0;
        }
    }

    /** @returns {void} */
    setupEffect() {
        if (this._appeared && this._enemy.isEffectRequested()) {
            this.startEffect(this._enemy.effectType());
            this._enemy.clearEffect();
        }
        if (!this._appeared && this._enemy.isAlive()) {
            this.startEffect("appear");
        } else if (this._appeared && this._enemy.isHidden()) {
            this.startEffect("disappear");
        }
    }

    /**
     * @param {RMMZ.BattlerEffectType} effectType
     * @returns {void}
     */
    startEffect(effectType) {
        this._effectType = effectType;
        switch (this._effectType) {
            case "appear":
                this.startAppear();
                break;
            case "disappear":
                this.startDisappear();
                break;
            case "whiten":
                this.startWhiten();
                break;
            case "blink":
                this.startBlink();
                break;
            case "collapse":
                this.startCollapse();
                break;
            case "bossCollapse":
                this.startBossCollapse();
                break;
            case "instantCollapse":
                this.startInstantCollapse();
                break;
        }
        this.revertToNormal();
    }

    /** @returns {void} */
    startAppear() {
        this._effectDuration = 16;
        this._appeared = true;
    }

    /** @returns {void} */
    startDisappear() {
        this._effectDuration = 32;
        this._appeared = false;
    }

    /** @returns {void} */
    startWhiten() {
        this._effectDuration = 16;
    }

    /** @returns {void} */
    startBlink() {
        this._effectDuration = 20;
    }

    /** @returns {void} */
    startCollapse() {
        this._effectDuration = 32;
        this._appeared = false;
    }

    /** @returns {void} */
    startBossCollapse() {
        this._effectDuration = this.bitmap.height;
        this._appeared = false;
    }

    /** @returns {void} */
    startInstantCollapse() {
        this._effectDuration = 16;
        this._appeared = false;
    }

    /** @returns {void} */
    updateEffect() {
        this.setupEffect();
        if (this._effectDuration > 0) {
            this._effectDuration--;
            switch (this._effectType) {
                case "whiten":
                    this.updateWhiten();
                    break;
                case "blink":
                    this.updateBlink();
                    break;
                case "appear":
                    this.updateAppear();
                    break;
                case "disappear":
                    this.updateDisappear();
                    break;
                case "collapse":
                    this.updateCollapse();
                    break;
                case "bossCollapse":
                    this.updateBossCollapse();
                    break;
                case "instantCollapse":
                    this.updateInstantCollapse();
                    break;
            }
            if (this._effectDuration === 0) {
                this._effectType = null;
            }
        }
    }

    /** @returns {boolean} */
    isEffecting() {
        return this._effectType !== null;
    }

    /** @returns {void} */
    revertToNormal() {
        this._shake = 0;
        this.blendMode = 0;
        this.opacity = 255;
        this.setBlendColor([0, 0, 0, 0]);
    }

    /** @returns {void} */
    updateWhiten() {
        const alpha = 128 - (16 - this._effectDuration) * 8;
        this.setBlendColor([255, 255, 255, alpha]);
    }

    /** @returns {void} */
    updateBlink() {
        this.opacity = this._effectDuration % 10 < 5 ? 255 : 0;
    }

    /** @returns {void} */
    updateAppear() {
        this.opacity = (16 - this._effectDuration) * 16;
    }

    /** @returns {void} */
    updateDisappear() {
        this.opacity = 256 - (32 - this._effectDuration) * 10;
    }

    /** @returns {void} */
    updateCollapse() {
        this.blendMode = 1;
        this.setBlendColor([255, 128, 128, 128]);
        this.opacity *= this._effectDuration / (this._effectDuration + 1);
    }

    /** @returns {void} */
    updateBossCollapse() {
        this._shake = (this._effectDuration % 2) * 4 - 2;
        this.blendMode = 1;
        this.opacity *= this._effectDuration / (this._effectDuration + 1);
        this.setBlendColor([255, 255, 255, 255 - this.opacity]);
        if (this._effectDuration % 20 === 19) {
            SoundManager.playBossCollapse2();
        }
    }

    /** @returns {void} */
    updateInstantCollapse() {
        this.opacity = 0;
    }

    /** @returns {number} */
    damageOffsetX() {
        return super.damageOffsetX();
    }

    /** @returns {number} */
    damageOffsetY() {
        return super.damageOffsetY() - 8;
    }
}

/**
 * The sprite for displaying an animation.
 */
class Sprite_Animation extends PIXI.RenderContainer {
    constructor() {
        super({});
        this.spriteId = Sprite._counter++;
        this.initMembers();
    }

    /** @returns {void} */
    initMembers() {
        /** @type {Sprite[]} */
        this._targets = [];
        /** @type {RMMZ.DataAnimation} */
        this._animation = null;
        /** @type {boolean} */
        this._mirror = false;
        /** @type {number} */
        this._delay = 0;
        /** @type {Sprite_Animation | null} */
        this._previous = null;
        /** @type {effekseer.EffekseerEffect | null} */
        this._effect = null;
        /** @type {effekseer.EffekseerHandle | null} */
        this._handle = null;
        /** @type {boolean} */
        this._playing = false;
        /** @type {boolean} */
        this._started = false;
        /** @type {number} */
        this._frameIndex = 0;
        /** @type {number} */
        this._maxTimingFrames = 0;
        /** @type {RMMZ.Writable<RMMZ.Color>} */
        this._flashColor = [0, 0, 0, 0];
        /** @type {number} */
        this._flashDuration = 0;
        /** @type {number} */
        this._viewportSize = 4096;
        this.z = 8;
    }

    /**
     * @param {import("pixi.js").DestroyOptions} [options]
     * @returns {void}
     */
    destroy(options) {
        super.destroy(options);
        if (this._handle) {
            this._handle.stop();
        }
        this._effect = null;
        this._handle = null;
        this._playing = false;
        this._started = false;
    }

    // prettier-ignore
    /**
     * @param {Sprite[]} targets
     * @param {RMMZ.DataAnimation} animation
     * @param {boolean} mirror
     * @param {number} delay
     * @param {Sprite_Animation | null} previous
     * @returns {void}
     */
    setup(
        targets, animation, mirror, delay, previous
    ) {
        this._targets = targets;
        this._animation = animation;
        this._mirror = mirror;
        this._delay = delay;
        this._previous = previous;
        this._effect = EffectManager.load(animation.effectName);
        this._playing = true;
        const timings = animation.soundTimings.concat(animation.flashTimings);
        for (const timing of timings) {
            if (timing.frame > this._maxTimingFrames) {
                this._maxTimingFrames = timing.frame;
            }
        }
    }

    /** @returns {void} */
    update() {
        if (this._delay > 0) {
            this._delay--;
        } else if (this._playing) {
            if (!this._started && this.canStart()) {
                if (this._effect) {
                    if (this._effect.isLoaded) {
                        this._handle = Graphics.effekseer.play(this._effect);
                        this._started = true;
                    } else {
                        EffectManager.checkErrors();
                    }
                } else {
                    this._started = true;
                }
            }
            if (this._started) {
                this.updateEffectGeometry();
                this.updateMain();
                this.updateFlash();
            }
        }
    }

    /** @returns {boolean} */
    canStart() {
        if (this._previous && this.shouldWaitForPrevious()) {
            return !this._previous.isPlaying();
        } else {
            return true;
        }
    }

    /**
     * Allows the animation to start before the previous one finishes.
     * Waiting was a workaround for older versions of Effekseer that
     * were very heavy on some mobile devices.
     *
     * @returns {boolean}
     */
    shouldWaitForPrevious() {
        return false;
    }

    /** @returns {void} */
    updateEffectGeometry() {
        const scale = this._animation.scale / 100;
        const r = Math.PI / 180;
        const rx = this._animation.rotation.x * r;
        const ry = this._animation.rotation.y * r;
        const rz = this._animation.rotation.z * r;
        if (this._handle) {
            this._handle.setLocation(0, 0, 0);
            this._handle.setRotation(rx, ry, rz);
            this._handle.setScale(scale, scale, scale);
            this._handle.setSpeed(this._animation.speed / 100);
        }
    }

    /** @returns {void} */
    updateMain() {
        this.processSoundTimings();
        this.processFlashTimings();
        this._frameIndex++;
        this.checkEnd();
    }

    /** @returns {void} */
    processSoundTimings() {
        for (const timing of this._animation.soundTimings) {
            if (timing.frame === this._frameIndex) {
                AudioManager.playSe(timing.se);
            }
        }
    }

    /** @returns {void} */
    processFlashTimings() {
        for (const timing of this._animation.flashTimings) {
            if (timing.frame === this._frameIndex) {
                this._flashColor = timing.color.clone();
                this._flashDuration = timing.duration;
            }
        }
    }

    /** @returns {void} */
    checkEnd() {
        if (
            this._frameIndex > this._maxTimingFrames &&
            this._flashDuration === 0 &&
            !(this._handle && this._handle.exists)
        ) {
            this._playing = false;
        }
    }

    /** @returns {void} */
    updateFlash() {
        if (this._flashDuration > 0) {
            const d = this._flashDuration--;
            this._flashColor[3] *= (d - 1) / d;
            for (const target of this._targets) {
                target.setBlendColor(this._flashColor);
            }
        }
    }

    /** @returns {boolean} */
    isPlaying() {
        return this._playing;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {void}
     */
    setRotation(x, y, z) {
        if (this._handle) {
            this._handle.setRotation(x, y, z);
        }
    }

    /**
     * @param {import("pixi.js").Renderer} renderer
     * @returns {void}
     */
    render(renderer) {
        if (this._targets.length > 0 && this._handle && this._handle.exists) {
            const gl = renderer.gl;
            const program = gl.getParameter(gl.CURRENT_PROGRAM);
            const viewport = gl.getParameter(gl.VIEWPORT);
            this.setProjectionMatrix(renderer);
            this.setCameraMatrix();
            this.setViewport(renderer);
            Graphics.effekseer.beginDraw();
            try {
                Graphics.effekseer.drawHandle(this._handle);
            } finally {
                Graphics.effekseer.endDraw();
                // Effekseer cannot restore programs created outside its WASM runtime.
                gl.useProgram(program);
                gl.viewport(...viewport);
            }
        }
    }

    /**
     * @param {import("pixi.js").Renderer} renderer
     * @returns {void}
     */
    setProjectionMatrix(renderer) {
        const x = this._mirror ? -1 : 1;
        const y = -1;
        const p = -(this._viewportSize / renderer.canvas.height);
        // prettier-ignore
        Graphics.effekseer.setProjectionMatrix([
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, 1, p,
            0, 0, 0, 1,
        ]);
    }

    setCameraMatrix() {
        // prettier-ignore
        Graphics.effekseer.setCameraMatrix([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, -10, 1
        ]);
    }

    /**
     * @param {import("pixi.js").Renderer} renderer
     * @returns {void}
     */
    setViewport(renderer) {
        const vw = this._viewportSize;
        const vh = this._viewportSize;
        const vx = this._animation.offsetX - vw / 2;
        const vy = this._animation.offsetY - vh / 2;
        const pos = this.targetPosition(renderer);
        renderer.gl.viewport(vx + pos.x, vy + pos.y, vw, vh);
    }

    /**
     * @param {import("pixi.js").Renderer} renderer
     * @returns {Point}
     */
    targetPosition(renderer) {
        const pos = new PIXI.Point();
        if (this._animation.displayType === 2) {
            pos.x = renderer.canvas.width / 2;
            pos.y = renderer.canvas.height / 2;
        } else {
            for (const target of this._targets) {
                const tpos = this.targetSpritePosition(target);
                pos.x += tpos.x;
                pos.y += tpos.y;
            }
            pos.x /= this._targets.length;
            pos.y /= this._targets.length;
        }
        return pos;
    }

    /**
     * @param {Sprite} sprite
     * @returns {import("pixi.js").Point}
     */
    targetSpritePosition(sprite) {
        const point = new PIXI.Point(0, -sprite.height / 2);
        if (this._animation.alignBottom) {
            point.y = 0;
        }
        return sprite.toGlobal(point);
    }
}

/**
 * The sprite for displaying an old format animation.
 */
class Sprite_AnimationMV extends Sprite {
    /** @param {[]} args */
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
        this.initMembers();
    }

    /** @returns {void} */
    initMembers() {
        /** @type {Sprite[]} */
        this._targets = [];
        /** @type {RMMZ.DataAnimationMV} */
        this._animation = null;
        /** @type {boolean} */
        this._mirror = false;
        /** @type {number} */
        this._delay = 0;
        /** @type {number} */
        this._rate = 4;
        /** @type {number} */
        this._duration = 0;
        /** @type {RMMZ.Writable<RMMZ.Color>} */
        this._flashColor = [0, 0, 0, 0];
        /** @type {number} */
        this._flashDuration = 0;
        /** @type {number} */
        this._screenFlashDuration = 0;
        /** @type {number} */
        this._hidingDuration = 0;
        /** @type {number} */
        this._hue1 = 0;
        /** @type {number} */
        this._hue2 = 0;
        /** @type {Bitmap} */
        this._bitmap1 = null;
        /** @type {Bitmap} */
        this._bitmap2 = null;
        /** @type {Sprite[]} */
        this._cellSprites = [];
        /** @type {ScreenSprite | null} */
        this._screenFlashSprite = null;
        this.z = 8;
    }

    /**
     * @param {Sprite[]} targets
     * @param {RMMZ.DataAnimationMV} animation
     * @param {boolean} mirror
     * @param {number} delay
     * @returns {void}
     */
    // prettier-ignore
    setup(
        targets, animation, mirror, delay
    ) {
        this._targets = targets;
        this._animation = animation;
        this._mirror = mirror;
        this._delay = delay;
        if (this._animation) {
            this.setupRate();
            this.setupDuration();
            this.loadBitmaps();
            this.createCellSprites();
            this.createScreenFlashSprite();
        }
    }

    /** @returns {void} */
    setupRate() {
        this._rate = 4;
    }

    /** @returns {void} */
    setupDuration() {
        this._duration = this._animation.frames.length * this._rate + 1;
    }

    /** @returns {void} */
    update() {
        super.update();
        this.updateMain();
        this.updateFlash();
        this.updateScreenFlash();
        this.updateHiding();
    }

    /** @returns {void} */
    updateFlash() {
        if (this._flashDuration > 0) {
            const d = this._flashDuration--;
            this._flashColor[3] *= (d - 1) / d;
            for (const target of this._targets) {
                target.setBlendColor(this._flashColor);
            }
        }
    }

    /** @returns {void} */
    updateScreenFlash() {
        if (this._screenFlashDuration > 0) {
            const d = this._screenFlashDuration--;
            if (this._screenFlashSprite) {
                this._screenFlashSprite.x = -this.absoluteX();
                this._screenFlashSprite.y = -this.absoluteY();
                this._screenFlashSprite.opacity *= (d - 1) / d;
                this._screenFlashSprite.visible = this._screenFlashDuration > 0;
            }
        }
    }

    /** @returns {number} */
    absoluteX() {
        let x = 0;
        let object = this;
        while (object) {
            x += object.x;
            object = object.parent;
        }
        return x;
    }

    /** @returns {number} */
    absoluteY() {
        let y = 0;
        let object = this;
        while (object) {
            y += object.y;
            object = object.parent;
        }
        return y;
    }

    /** @returns {void} */
    updateHiding() {
        if (this._hidingDuration > 0) {
            this._hidingDuration--;
            if (this._hidingDuration === 0) {
                for (const target of this._targets) {
                    target.show();
                }
            }
        }
    }

    /** @returns {boolean} */
    isPlaying() {
        return this._duration > 0;
    }

    /** @returns {void} */
    loadBitmaps() {
        const name1 = this._animation.animation1Name;
        const name2 = this._animation.animation2Name;
        this._hue1 = this._animation.animation1Hue;
        this._hue2 = this._animation.animation2Hue;
        this._bitmap1 = ImageManager.loadAnimation(name1);
        this._bitmap2 = ImageManager.loadAnimation(name2);
    }

    /** @returns {boolean} */
    isReady() {
        return (
            this._bitmap1 &&
            this._bitmap1.isReady() &&
            this._bitmap2 &&
            this._bitmap2.isReady()
        );
    }

    /** @returns {void} */
    createCellSprites() {
        this._cellSprites = [];
        for (let i = 0; i < 16; i++) {
            const sprite = new Sprite();
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            this._cellSprites.push(sprite);
            this.addChild(sprite);
        }
    }

    /** @returns {void} */
    createScreenFlashSprite() {
        this._screenFlashSprite = new ScreenSprite();
        this.addChild(this._screenFlashSprite);
    }

    /** @returns {void} */
    updateMain() {
        if (this.isPlaying() && this.isReady()) {
            if (this._delay > 0) {
                this._delay--;
            } else {
                this._duration--;
                this.updatePosition();
                if (this._duration % this._rate === 0) {
                    this.updateFrame();
                }
                if (this._duration <= 0) {
                    this.onEnd();
                }
            }
        }
    }

    /** @returns {void} */
    updatePosition() {
        if (this._animation.position === 3) {
            this.x = this.parent.width / 2;
            this.y = this.parent.height / 2;
        } else if (this._targets.length > 0) {
            const target = this._targets[0];
            const parent = target.parent;
            const grandparent = parent ? parent.parent : null;
            this.x = target.x;
            this.y = target.y;
            if (this.parent === grandparent) {
                this.x += parent.x;
                this.y += parent.y;
            }
            if (this._animation.position === 0) {
                this.y -= target.height;
            } else if (this._animation.position === 1) {
                this.y -= target.height / 2;
            }
        }
    }

    /** @returns {void} */
    updateFrame() {
        if (this._duration > 0) {
            const frameIndex = this.currentFrameIndex();
            this.updateAllCellSprites(this._animation.frames[frameIndex]);
            for (const timing of this._animation.timings) {
                if (timing.frame === frameIndex) {
                    this.processTimingData(timing);
                }
            }
        }
    }

    /** @returns {number} */
    currentFrameIndex() {
        return (
            this._animation.frames.length -
            Math.floor((this._duration + this._rate - 1) / this._rate)
        );
    }

    /**
     * @param {RMMZ.DataFrameMV} frame
     * @returns {void}
     */
    updateAllCellSprites(frame) {
        if (this._targets.length > 0) {
            for (let i = 0; i < this._cellSprites.length; i++) {
                const sprite = this._cellSprites[i];
                if (i < frame.length) {
                    this.updateCellSprite(sprite, frame[i]);
                } else {
                    sprite.visible = false;
                }
            }
        }
    }

    /**
     * @param {Sprite} sprite
     * @param {RMMZ.DataFrameCellMV} cell
     * @returns {void}
     */
    updateCellSprite(sprite, cell) {
        const pattern = cell[0];
        if (pattern >= 0) {
            const sx = (pattern % 5) * 192;
            const sy = Math.floor((pattern % 100) / 5) * 192;
            const mirror = this._mirror;
            sprite.bitmap = pattern < 100 ? this._bitmap1 : this._bitmap2;
            sprite.setHue(pattern < 100 ? this._hue1 : this._hue2);
            sprite.setFrame(sx, sy, 192, 192);
            sprite.x = cell[1];
            sprite.y = cell[2];
            sprite.rotation = (cell[4] * Math.PI) / 180;
            sprite.scale.x = cell[3] / 100;

            if (cell[5]) {
                sprite.scale.x *= -1;
            }
            if (mirror) {
                sprite.x *= -1;
                sprite.rotation *= -1;
                sprite.scale.x *= -1;
            }

            sprite.scale.y = cell[3] / 100;
            sprite.opacity = cell[6];
            sprite.blendMode = cell[7];
            sprite.visible = true;
        } else {
            sprite.visible = false;
        }
    }

    /**
     * @param {RMMZ.DataTimingMV} timing
     * @returns {void}
     */
    processTimingData(timing) {
        const duration = timing.flashDuration * this._rate;
        switch (timing.flashScope) {
            case 1:
                this.startFlash(timing.flashColor, duration);
                break;
            case 2:
                this.startScreenFlash(timing.flashColor, duration);
                break;
            case 3:
                this.startHiding(duration);
                break;
        }
        if (timing.se) {
            AudioManager.playSe(timing.se);
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
     * @param {RMMZ.Color} color
     * @param {number} duration
     * @returns {void}
     */
    startScreenFlash(color, duration) {
        this._screenFlashDuration = duration;
        if (this._screenFlashSprite) {
            this._screenFlashSprite.setColor(color[0], color[1], color[2]);
            this._screenFlashSprite.opacity = color[3];
        }
    }

    /**
     * @param {number} duration
     * @returns {void}
     */
    startHiding(duration) {
        this._hidingDuration = duration;
        for (const target of this._targets) {
            target.hide();
        }
    }

    /** @returns {void} */
    onEnd() {
        this._flashDuration = 0;
        this._screenFlashDuration = 0;
        this._hidingDuration = 0;
        for (const target of this._targets) {
            target.setBlendColor([0, 0, 0, 0]);
            target.show();
        }
    }
}

/**
 * The sprite for displaying a background image in battle.
 */
class Sprite_Battleback extends TilingSprite {
    /** @param {[type: 0 | 1]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {0 | 1} type */
    initialize(type) {
        super.initialize();
        if (type === 0) {
            this.bitmap = this.battleback1Bitmap();
        } else {
            this.bitmap = this.battleback2Bitmap();
        }
    }

    /** @returns {void} */
    adjustPosition() {
        this.width = Math.floor((1000 * Graphics.width) / 816);
        this.height = Math.floor((740 * Graphics.height) / 624);
        this.x = (Graphics.width - this.width) / 2;
        if ($gameSystem.isSideView()) {
            this.y = Graphics.height - this.height;
        } else {
            this.y = 0;
        }
        const ratioX = this.width / this.bitmap.width;
        const ratioY = this.height / this.bitmap.height;
        const scale = Math.max(ratioX, ratioY, 1.0);
        this.scale.x = scale;
        this.scale.y = scale;
    }

    /** @returns {import("../core").Bitmap} */
    battleback1Bitmap() {
        return ImageManager.loadBattleback1(this.battleback1Name());
    }

    /** @returns {import("../core").Bitmap} */
    battleback2Bitmap() {
        return ImageManager.loadBattleback2(this.battleback2Name());
    }

    /** @returns {string} */
    battleback1Name() {
        if (BattleManager.isBattleTest()) {
            return $dataSystem.battleback1Name;
        } else if ($gameMap.battleback1Name() !== null) {
            return $gameMap.battleback1Name();
        } else if ($gameMap.isOverworld()) {
            return this.overworldBattleback1Name();
        } else {
            return "";
        }
    }

    /** @returns {string} */
    battleback2Name() {
        if (BattleManager.isBattleTest()) {
            return $dataSystem.battleback2Name;
        } else if ($gameMap.battleback2Name() !== null) {
            return $gameMap.battleback2Name();
        } else if ($gameMap.isOverworld()) {
            return this.overworldBattleback2Name();
        } else {
            return "";
        }
    }

    /** @returns {string} */
    overworldBattleback1Name() {
        if ($gamePlayer.isInVehicle()) {
            return this.shipBattleback1Name();
        } else {
            return this.normalBattleback1Name();
        }
    }

    /** @returns {string} */
    overworldBattleback2Name() {
        if ($gamePlayer.isInVehicle()) {
            return this.shipBattleback2Name();
        } else {
            return this.normalBattleback2Name();
        }
    }

    /** @returns {string} */
    normalBattleback1Name() {
        return (
            this.terrainBattleback1Name(this.autotileType(1)) ||
            this.terrainBattleback1Name(this.autotileType(0)) ||
            this.defaultBattleback1Name()
        );
    }

    /** @returns {string} */
    normalBattleback2Name() {
        return (
            this.terrainBattleback2Name(this.autotileType(1)) ||
            this.terrainBattleback2Name(this.autotileType(0)) ||
            this.defaultBattleback2Name()
        );
    }

    /**
     * @param {RMMZ.TerrainBattlebackType} type
     * @returns {"Wasteland" | "DirtField" | "Desert" | "Lava1" | "Lava2" | "Snowfield" | "Clouds" | "PoisonSwamp" | null}
     */
    terrainBattleback1Name(type) {
        switch (type) {
            case 24:
            case 25:
                return "Wasteland";
            case 26:
            case 27:
                return "DirtField";
            case 32:
            case 33:
                return "Desert";
            case 34:
                return "Lava1";
            case 35:
                return "Lava2";
            case 40:
            case 41:
                return "Snowfield";
            case 42:
                return "Clouds";
            case 4:
            case 5:
                return "PoisonSwamp";
            default:
                return null;
        }
    }

    /**
     * @param {RMMZ.TerrainBattlebackType} type
     * @returns {"Wasteland" | "Desert" | "Snowfield" | "Clouds" | "PoisonSwamp" | "Forest" | "Cliff" | "Lava" | undefined}
     */
    terrainBattleback2Name(type) {
        switch (type) {
            case 20:
            case 21:
                return "Forest";
            case 22:
            case 30:
            case 38:
                return "Cliff";
            case 24:
            case 25:
            case 26:
            case 27:
                return "Wasteland";
            case 32:
            case 33:
                return "Desert";
            case 34:
            case 35:
                return "Lava";
            case 40:
            case 41:
                return "Snowfield";
            case 42:
                return "Clouds";
            case 4:
            case 5:
                return "PoisonSwamp";
        }
    }

    /** @returns {string} */
    defaultBattleback1Name() {
        return "Grassland";
    }

    /** @returns {string} */
    defaultBattleback2Name() {
        return "Grassland";
    }

    /** @returns {string} */
    shipBattleback1Name() {
        return "Ship";
    }

    /** @returns {string} */
    shipBattleback2Name() {
        return "Ship";
    }

    /**
     * @param {number} z
     * @returns {RMMZ.TerrainBattlebackType}
     */
    autotileType(z) {
        return $gameMap.autotileType($gamePlayer.x, $gamePlayer.y, z);
    }
}

/**
 * The sprite for displaying a popup damage.
 */
class Sprite_Damage extends Sprite {
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
        /** @type {number} */
        this._duration = 90;
        /** @type {RMMZ.Writable<RMMZ.Color>} */
        this._flashColor = [0, 0, 0, 0];
        /** @type {number} */
        this._flashDuration = 0;
        /** @type {number} */
        this._colorType = 0;
    }

    /**
     * @param {import("pixi.js").DestroyOptions} [options]
     * @returns {void}
     */
    destroy(options) {
        for (const child of this.children) {
            if (child.bitmap) {
                child.bitmap.destroy();
            }
        }
        super.destroy(options);
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    setup(target) {
        const result = target.result();
        if (result.missed || result.evaded) {
            this._colorType = 0;
            this.createMiss();
        } else if (result.hpAffected) {
            this._colorType = result.hpDamage >= 0 ? 0 : 1;
            this.createDigits(result.hpDamage);
        } else if (target.isAlive() && result.mpDamage !== 0) {
            this._colorType = result.mpDamage >= 0 ? 2 : 3;
            this.createDigits(result.mpDamage);
        }
        if (result.critical) {
            this.setupCriticalEffect();
        }
    }

    /** @returns {void} */
    setupCriticalEffect() {
        this._flashColor = [255, 0, 0, 160];
        this._flashDuration = 60;
    }

    /** @returns {string} */
    fontFace() {
        return $gameSystem.numberFontFace();
    }

    /** @returns {number} */
    fontSize() {
        return $gameSystem.mainFontSize() + 4;
    }

    /** @returns {"#ffffff" | "#b9ffb5" | "#ffff90" | "#80b0ff" | "#808080"} */
    damageColor() {
        return ColorManager.damageColor(this._colorType);
    }

    /** @returns {string} */
    outlineColor() {
        return "rgba(0, 0, 0, 0.7)";
    }

    /** @returns {number} */
    outlineWidth() {
        return 4;
    }

    /** @returns {void} */
    createMiss() {
        const h = this.fontSize();
        const w = Math.floor(h * 3.0);
        const sprite = this.createChildSprite(w, h);
        sprite.bitmap.drawText("Miss", 0, 0, w, h, "center");
        sprite.dy = 0;
    }

    /**
     * @param {number} value
     * @returns {void}
     */
    createDigits(value) {
        const string = Math.abs(value).toString();
        const h = this.fontSize();
        const w = Math.floor(h * 0.75);
        for (let i = 0; i < string.length; i++) {
            const sprite = this.createChildSprite(w, h);
            sprite.bitmap.drawText(string[i], 0, 0, w, h, "center");
            sprite.x = (i - (string.length - 1) / 2) * w;
            sprite.dy = -i;
        }
    }

    /**
     * @param {number} width
     * @param {number} height
     * @returns {Sprite}
     */
    createChildSprite(width, height) {
        const sprite = new Sprite();
        sprite.bitmap = this.createBitmap(width, height);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 1;
        sprite.y = -40;
        sprite.ry = sprite.y;
        this.addChild(sprite);
        return sprite;
    }

    /**
     * @param {number} width
     * @param {number} height
     * @returns {Bitmap}
     */
    createBitmap(width, height) {
        const bitmap = new Bitmap(width, height);
        bitmap.fontFace = this.fontFace();
        bitmap.fontSize = this.fontSize();
        bitmap.textColor = this.damageColor();
        bitmap.outlineColor = this.outlineColor();
        bitmap.outlineWidth = this.outlineWidth();
        return bitmap;
    }

    /** @returns {void} */
    update() {
        super.update();
        if (this._duration > 0) {
            this._duration--;
            for (const child of this.children) {
                this.updateChild(child);
            }
        }
        this.updateFlash();
        this.updateOpacity();
    }

    /**
     * @param {Sprite} sprite
     * @returns {void}
     */
    updateChild(sprite) {
        sprite.dy += 0.5;
        sprite.ry += sprite.dy;
        if (sprite.ry >= 0) {
            sprite.ry = 0;
            sprite.dy *= -0.6;
        }
        sprite.y = Math.round(sprite.ry);
        sprite.setBlendColor(this._flashColor);
    }

    /** @returns {void} */
    updateFlash() {
        if (this._flashDuration > 0) {
            const d = this._flashDuration--;
            this._flashColor[3] *= (d - 1) / d;
        }
    }

    /** @returns {void} */
    updateOpacity() {
        if (this._duration < 10) {
            this.opacity = (255 * this._duration) / 10;
        }
    }

    /** @returns {boolean} */
    isPlaying() {
        return this._duration > 0;
    }
}

/**
 * The sprite for displaying a status gauge.
 */
class Sprite_Gauge extends Sprite {
    /** @param {[]} args */
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
        this.initMembers();
        this.createBitmap();
    }

    /** @returns {void} */
    initMembers() {
        /** @type {RMMZ.ActionTarget | null} */
        this._battler = null;
        /** @type {string} */
        this._statusType = "";
        /** @type {number} */
        this._value = NaN;
        /** @type {number} */
        this._maxValue = NaN;
        /** @type {number} */
        this._targetValue = NaN;
        /** @type {number} */
        this._targetMaxValue = NaN;
        /** @type {number} */
        this._duration = 0;
        /** @type {number} */
        this._flashingCount = 0;
    }

    /**
     * @param {import("pixi.js").DestroyOptions} [options]
     * @returns {void}
     */
    destroy(options) {
        this.bitmap.destroy();
        super.destroy(options);
    }

    /** @returns {void} */
    createBitmap() {
        const width = this.bitmapWidth();
        const height = this.bitmapHeight();
        this.bitmap = new Bitmap(width, height);
    }

    /** @returns {number} */
    bitmapWidth() {
        return 128;
    }

    /** @returns {number} */
    bitmapHeight() {
        return 32;
    }

    /** @returns {number} */
    textHeight() {
        return 24;
    }

    /** @returns {number} */
    gaugeHeight() {
        return 12;
    }

    /** @returns {number} */
    gaugeX() {
        if (this._statusType === "time") {
            return 0;
        } else {
            return this.measureLabelWidth() + 6;
        }
    }

    /** @returns {number} */
    labelY() {
        return 3;
    }

    /** @returns {string} */
    labelFontFace() {
        return $gameSystem.mainFontFace();
    }

    /** @returns {number} */
    labelFontSize() {
        return $gameSystem.mainFontSize() - 2;
    }

    /** @returns {string} */
    valueFontFace() {
        return $gameSystem.numberFontFace();
    }

    /** @returns {number} */
    valueFontSize() {
        return $gameSystem.mainFontSize() - 6;
    }

    /**
     * @param {RMMZ.ActionTarget} battler
     * @param {"time" | "hp" | "mp" | "tp"} statusType
     * @returns {void}
     */
    setup(battler, statusType) {
        this._battler = battler;
        this._statusType = statusType;
        this._value = this.currentValue();
        this._maxValue = this.currentMaxValue();
        this.updateBitmap();
    }

    /** @returns {void} */
    update() {
        super.update();
        this.updateBitmap();
    }

    /** @returns {void} */
    updateBitmap() {
        const value = this.currentValue();
        const maxValue = this.currentMaxValue();
        if (value !== this._targetValue || maxValue !== this._targetMaxValue) {
            this.updateTargetValue(value, maxValue);
        }
        this.updateGaugeAnimation();
        this.updateFlashing();
    }

    /**
     * @param {number} value
     * @param {number} maxValue
     * @returns {void}
     */
    updateTargetValue(value, maxValue) {
        this._targetValue = value;
        this._targetMaxValue = maxValue;
        if (isNaN(this._value)) {
            this._value = value;
            this._maxValue = maxValue;
            this.redraw();
        } else {
            this._duration = this.smoothness();
        }
    }

    /** @returns {20 | 5} */
    smoothness() {
        return this._statusType === "time" ? 5 : 20;
    }

    /** @returns {void} */
    updateGaugeAnimation() {
        if (this._duration > 0) {
            const d = this._duration;
            this._value = (this._value * (d - 1) + this._targetValue) / d;
            this._maxValue = (this._maxValue * (d - 1) + this._targetMaxValue) / d;
            this._duration--;
            this.redraw();
        }
    }

    /** @returns {void} */
    updateFlashing() {
        if (this._statusType === "time") {
            this._flashingCount++;
            if (this._battler.isInputting()) {
                if (this._flashingCount % 30 < 15) {
                    this.setBlendColor(this.flashingColor1());
                } else {
                    this.setBlendColor(this.flashingColor2());
                }
            } else {
                this.setBlendColor([0, 0, 0, 0]);
            }
        }
    }

    /** @returns {RMMZ.Color} */
    flashingColor1() {
        return [255, 255, 255, 64];
    }

    /** @returns {RMMZ.Color} */
    flashingColor2() {
        return [0, 0, 255, 48];
    }

    /** @returns {boolean} */
    isValid() {
        if (this._battler) {
            if (this._statusType === "tp" && !this._battler.isPreserveTp()) {
                return $gameParty.inBattle();
            } else {
                return true;
            }
        }
        return false;
    }

    /** @returns {number} */
    currentValue() {
        if (this._battler) {
            switch (this._statusType) {
                case "hp":
                    return this._battler.hp;
                case "mp":
                    return this._battler.mp;
                case "tp":
                    return this._battler.tp;
                case "time":
                    return this._battler.tpbChargeTime();
            }
        }
        return NaN;
    }

    /** @returns {number} */
    currentMaxValue() {
        if (this._battler) {
            switch (this._statusType) {
                case "hp":
                    return this._battler.mhp;
                case "mp":
                    return this._battler.mmp;
                case "tp":
                    return this._battler.maxTp();
                case "time":
                    return 1;
            }
        }
        return NaN;
    }

    /** @returns {string} */
    gaugeLabel() {
        switch (this._statusType) {
            case "hp":
                return TextManager.hpA;
            case "mp":
                return TextManager.mpA;
            case "tp":
                return TextManager.tpA;
            default:
                return "";
        }
    }

    /** @returns {string} */
    gaugeBackColor() {
        return ColorManager.gaugeBackColor();
    }

    /** @returns {string} */
    gaugeColor1() {
        switch (this._statusType) {
            case "hp":
                return ColorManager.hpGaugeColor1();
            case "mp":
                return ColorManager.mpGaugeColor1();
            case "tp":
                return ColorManager.tpGaugeColor1();
            case "time":
                return ColorManager.ctGaugeColor1();
            default:
                return ColorManager.normalColor();
        }
    }

    /** @returns {string} */
    gaugeColor2() {
        switch (this._statusType) {
            case "hp":
                return ColorManager.hpGaugeColor2();
            case "mp":
                return ColorManager.mpGaugeColor2();
            case "tp":
                return ColorManager.tpGaugeColor2();
            case "time":
                return ColorManager.ctGaugeColor2();
            default:
                return ColorManager.normalColor();
        }
    }

    /** @returns {string} */
    labelColor() {
        return ColorManager.systemColor();
    }

    /** @returns {string} */
    labelOutlineColor() {
        return ColorManager.outlineColor();
    }

    /** @returns {number} */
    labelOutlineWidth() {
        return 3;
    }

    /** @returns {string} */
    valueColor() {
        switch (this._statusType) {
            case "hp":
                return ColorManager.hpColor(this._battler);
            case "mp":
                return ColorManager.mpColor(this._battler);
            case "tp":
                return ColorManager.tpColor(this._battler);
            default:
                return ColorManager.normalColor();
        }
    }

    /** @returns {string} */
    valueOutlineColor() {
        return "rgba(0, 0, 0, 1)";
    }

    /** @returns {number} */
    valueOutlineWidth() {
        return 2;
    }

    /** @returns {void} */
    redraw() {
        this.bitmap.clear();
        const currentValue = this.currentValue();
        if (!isNaN(currentValue)) {
            this.drawGauge();
            if (this._statusType !== "time") {
                this.drawLabel();
                if (this.isValid()) {
                    this.drawValue();
                }
            }
        }
    }

    /** @returns {void} */
    drawGauge() {
        const gaugeX = this.gaugeX();
        const gaugeY = this.textHeight() - this.gaugeHeight();
        const gaugewidth = this.bitmapWidth() - gaugeX;
        const gaugeHeight = this.gaugeHeight();
        this.drawGaugeRect(gaugeX, gaugeY, gaugewidth, gaugeHeight);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @returns {void}
     */
    drawGaugeRect(x, y, width, height) {
        const rate = this.gaugeRate();
        const fillW = Math.floor((width - 2) * rate);
        const fillH = height - 2;
        const color0 = this.gaugeBackColor();
        const color1 = this.gaugeColor1();
        const color2 = this.gaugeColor2();
        this.bitmap.fillRect(x, y, width, height, color0);
        this.bitmap.gradientFillRect(x + 1, y + 1, fillW, fillH, color1, color2);
    }

    /** @returns {number} */
    gaugeRate() {
        if (this.isValid()) {
            const value = this._value;
            const maxValue = this._maxValue;
            return maxValue > 0 ? value / maxValue : 0;
        } else {
            return 0;
        }
    }

    /** @returns {void} */
    drawLabel() {
        const label = this.gaugeLabel();
        const x = this.labelOutlineWidth() / 2;
        const y = this.labelY();
        const width = this.bitmapWidth();
        const height = this.textHeight();
        this.setupLabelFont();
        this.bitmap.paintOpacity = this.labelOpacity();
        this.bitmap.drawText(label, x, y, width, height, "left");
        this.bitmap.paintOpacity = 255;
    }

    /** @returns {void} */
    setupLabelFont() {
        this.bitmap.fontFace = this.labelFontFace();
        this.bitmap.fontSize = this.labelFontSize();
        this.bitmap.textColor = this.labelColor();
        this.bitmap.outlineColor = this.labelOutlineColor();
        this.bitmap.outlineWidth = this.labelOutlineWidth();
    }

    /** @returns {number} */
    measureLabelWidth() {
        this.setupLabelFont();
        const labels = [TextManager.hpA, TextManager.mpA, TextManager.tpA];
        const widths = labels.map(str => this.bitmap.measureTextWidth(str));
        return Math.ceil(Math.max(...widths));
    }

    /** @returns {255 | 160} */
    labelOpacity() {
        return this.isValid() ? 255 : 160;
    }

    /** @returns {void} */
    drawValue() {
        const currentValue = this.currentValue();
        const width = this.bitmapWidth();
        const height = this.textHeight();
        this.setupValueFont();
        this.bitmap.drawText(currentValue, 0, 0, width, height, "right");
    }

    /** @returns {void} */
    setupValueFont() {
        this.bitmap.fontFace = this.valueFontFace();
        this.bitmap.fontSize = this.valueFontSize();
        this.bitmap.textColor = this.valueColor();
        this.bitmap.outlineColor = this.valueOutlineColor();
        this.bitmap.outlineWidth = this.valueOutlineWidth();
    }
}

/**
 * The sprite for displaying a battler's name.
 */
class Sprite_Name extends Sprite {
    /** @param {[]} args */
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
        this.initMembers();
        this.createBitmap();
    }

    /** @returns {void} */
    initMembers() {
        /** @type {RMMZ.ActionTarget | null} */
        this._battler = null;
        /** @type {string} */
        this._name = "";
        /** @type {string} */
        this._textColor = "";
    }

    /**
     * @param {import("pixi.js").DestroyOptions} [options]
     * @returns {void}
     */
    destroy(options) {
        this.bitmap.destroy();
        super.destroy(options);
    }

    /** @returns {void} */
    createBitmap() {
        const width = this.bitmapWidth();
        const height = this.bitmapHeight();
        this.bitmap = new Bitmap(width, height);
    }

    /** @returns {number} */
    bitmapWidth() {
        return 128;
    }

    /** @returns {number} */
    bitmapHeight() {
        return 24;
    }

    /** @returns {string} */
    fontFace() {
        return $gameSystem.mainFontFace();
    }

    /** @returns {number} */
    fontSize() {
        return $gameSystem.mainFontSize();
    }

    /**
     * @param {RMMZ.ActionTarget} battler
     * @returns {void}
     */
    setup(battler) {
        this._battler = battler;
        this.updateBitmap();
    }

    /** @returns {void} */
    update() {
        super.update();
        this.updateBitmap();
    }

    /** @returns {void} */
    updateBitmap() {
        const name = this.name();
        const color = this.textColor();
        if (name !== this._name || color !== this._textColor) {
            this._name = name;
            this._textColor = color;
            this.redraw();
        }
    }

    /** @returns {string} */
    name() {
        return this._battler ? this._battler.name() : "";
    }

    /** @returns {string} */
    textColor() {
        return ColorManager.hpColor(this._battler);
    }

    /** @returns {string} */
    outlineColor() {
        return ColorManager.outlineColor();
    }

    /** @returns {number} */
    outlineWidth() {
        return 3;
    }

    /** @returns {void} */
    redraw() {
        const name = this.name();
        const width = this.bitmapWidth();
        const height = this.bitmapHeight();
        this.setupFont();
        this.bitmap.clear();
        this.bitmap.drawText(name, 0, 0, width, height, "left");
    }

    /** @returns {void} */
    setupFont() {
        this.bitmap.fontFace = this.fontFace();
        this.bitmap.fontSize = this.fontSize();
        this.bitmap.textColor = this.textColor();
        this.bitmap.outlineColor = this.outlineColor();
        this.bitmap.outlineWidth = this.outlineWidth();
    }
}

/**
 * The sprite for displaying state icons.
 */
class Sprite_StateIcon extends Sprite {
    /** @param {[]} args */
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
        this.initMembers();
        this.loadBitmap();
    }

    /** @returns {void} */
    initMembers() {
        /** @type {RMMZ.ActionTarget | null} */
        this._battler = null;
        /** @type {number} */
        this._iconIndex = 0;
        /** @type {number} */
        this._animationCount = 0;
        /** @type {number} */
        this._animationIndex = 0;
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
    }

    /** @returns {void} */
    loadBitmap() {
        this.bitmap = ImageManager.loadSystem("IconSet");
        this.setFrame(0, 0, 0, 0);
    }

    /**
     * @param {RMMZ.ActionTarget} battler
     * @returns {void}
     */
    setup(battler) {
        if (this._battler !== battler) {
            this._battler = battler;
            this._animationCount = this.animationWait();
        }
    }

    /** @returns {void} */
    update() {
        super.update();
        this._animationCount++;
        if (this._animationCount >= this.animationWait()) {
            this.updateIcon();
            this.updateFrame();
            this._animationCount = 0;
        }
    }

    /** @returns {number} */
    animationWait() {
        return 40;
    }

    /** @returns {void} */
    updateIcon() {
        const icons = [];
        if (this.shouldDisplay()) {
            icons.push(...this._battler.allIcons());
        }
        if (icons.length > 0) {
            this._animationIndex++;
            if (this._animationIndex >= icons.length) {
                this._animationIndex = 0;
            }
            this._iconIndex = icons[this._animationIndex];
        } else {
            this._animationIndex = 0;
            this._iconIndex = 0;
        }
    }

    /** @returns {this is { _battler: RMMZ.ActionTarget; }} */
    shouldDisplay() {
        const battler = this._battler;
        return battler && (battler.isActor() || battler.isAlive());
    }

    /** @returns {void} */
    updateFrame() {
        const pw = ImageManager.iconWidth;
        const ph = ImageManager.iconHeight;
        const sx = (this._iconIndex % 16) * pw;
        const sy = Math.floor(this._iconIndex / 16) * ph;
        this.setFrame(sx, sy, pw, ph);
    }
}

/**
 * The sprite for displaying an overlay image for a state.
 */
class Sprite_StateOverlay extends Sprite {
    /** @param {[]} args */
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
        this.initMembers();
        this.loadBitmap();
    }

    /** @returns {void} */
    initMembers() {
        /** @type {RMMZ.ActionTarget | null} */
        this._battler = null;
        /** @type {number} */
        this._overlayIndex = 0;
        /** @type {number} */
        this._animationCount = 0;
        /** @type {number} */
        this._pattern = 0;
        this.anchor.x = 0.5;
        this.anchor.y = 1;
    }

    /** @returns {void} */
    loadBitmap() {
        this.bitmap = ImageManager.loadSystem("States");
        this.setFrame(0, 0, 0, 0);
    }

    /**
     * @param {RMMZ.ActionTarget} battler
     * @returns {void}
     */
    setup(battler) {
        this._battler = battler;
    }

    /** @returns {void} */
    update() {
        super.update();
        this._animationCount++;
        if (this._animationCount >= this.animationWait()) {
            this.updatePattern();
            this.updateFrame();
            this._animationCount = 0;
        }
    }

    /** @returns {number} */
    animationWait() {
        return 8;
    }

    /** @returns {void} */
    updatePattern() {
        this._pattern++;
        this._pattern %= 8;
        if (this._battler) {
            this._overlayIndex = this._battler.stateOverlayIndex();
        } else {
            this._overlayIndex = 0;
        }
    }

    /** @returns {void} */
    updateFrame() {
        if (this._overlayIndex > 0) {
            const w = 96;
            const h = 96;
            const sx = this._pattern * w;
            const sy = (this._overlayIndex - 1) * h;
            this.setFrame(sx, sy, w, h);
        } else {
            this.setFrame(0, 0, 0, 0);
        }
    }
}

/**
 * The sprite for displaying a weapon image for attacking.
 */
class Sprite_Weapon extends Sprite {
    /** @param {[]} args */
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
        this.initMembers();
    }

    /** @returns {void} */
    initMembers() {
        /** @type {number} */
        this._weaponImageId = 0;
        /** @type {number} */
        this._animationCount = 0;
        /** @type {number} */
        this._pattern = 0;
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this.x = -16;
    }

    /**
     * @param {number} weaponImageId
     * @returns {void}
     */
    setup(weaponImageId) {
        this._weaponImageId = weaponImageId;
        this._animationCount = 0;
        this._pattern = 0;
        this.loadBitmap();
        this.updateFrame();
    }

    /** @returns {void} */
    update() {
        super.update();
        this._animationCount++;
        if (this._animationCount >= this.animationWait()) {
            this.updatePattern();
            this.updateFrame();
            this._animationCount = 0;
        }
    }

    /** @returns {number} */
    animationWait() {
        return 12;
    }

    /** @returns {void} */
    updatePattern() {
        this._pattern++;
        if (this._pattern >= 3) {
            this._weaponImageId = 0;
        }
    }

    /** @returns {void} */
    loadBitmap() {
        const pageId = Math.floor((this._weaponImageId - 1) / 12) + 1;
        if (pageId >= 1) {
            this.bitmap = ImageManager.loadSystem("Weapons" + pageId);
        } else {
            this.bitmap = ImageManager.loadSystem("");
        }
    }

    /** @returns {void} */
    updateFrame() {
        if (this._weaponImageId > 0) {
            const index = (this._weaponImageId - 1) % 12;
            const w = 96;
            const h = 64;
            const sx = (Math.floor(index / 6) * 3 + this._pattern) * w;
            const sy = Math.floor(index % 6) * h;
            this.setFrame(sx, sy, w, h);
        } else {
            this.setFrame(0, 0, 0, 0);
        }
    }

    /** @returns {boolean} */
    isPlaying() {
        return this._weaponImageId > 0;
    }
}

/**
 * The sprite for displaying a balloon icon.
 */
class Sprite_Balloon extends Sprite {
    /** @param {[]} args */
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
        this.initMembers();
        this.loadBitmap();
    }

    /** @returns {void} */
    initMembers() {
        /** @type {Sprite} */
        this._target = null;
        /** @type {RMMZ.BalloonIconID} */
        this._balloonId = 0;
        /** @type {number} */
        this._duration = 0;
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this.z = 7;
    }

    /** @returns {void} */
    loadBitmap() {
        this.bitmap = ImageManager.loadSystem("Balloon");
        this.setFrame(0, 0, 0, 0);
    }

    /**
     * @param {Sprite} targetSprite
     * @param {RMMZ.BalloonIconID} balloonId
     * @returns {void}
     */
    setup(targetSprite, balloonId) {
        this._target = targetSprite;
        this._balloonId = balloonId;
        this._duration = 8 * this.speed() + this.waitTime();
    }

    /** @returns {void} */
    update() {
        super.update();
        if (this._duration > 0) {
            this._duration--;
            if (this._duration > 0) {
                this.updatePosition();
                this.updateFrame();
            }
        }
    }

    /** @returns {void} */
    updatePosition() {
        this.x = this._target.x;
        this.y = this._target.y - this._target.height;
    }

    /** @returns {void} */
    updateFrame() {
        const w = 48;
        const h = 48;
        const sx = this.frameIndex() * w;
        const sy = (this._balloonId - 1) * h;
        this.setFrame(sx, sy, w, h);
    }

    /** @returns {number} */
    speed() {
        return 8;
    }

    /** @returns {number} */
    waitTime() {
        return 12;
    }

    /** @returns {number} */
    frameIndex() {
        const index = (this._duration - this.waitTime()) / this.speed();
        return 7 - Math.max(Math.floor(index), 0);
    }

    /** @returns {boolean} */
    isPlaying() {
        return this._duration > 0;
    }
}

/**
 * The sprite for displaying a picture.
 */
class Sprite_Picture extends Sprite_Clickable {
    /** @param {[pictureId: RMMZ.PictureID]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {RMMZ.PictureID} pictureId */
    initialize(pictureId) {
        super.initialize();
        /** @type {RMMZ.PictureID} */
        this._pictureId = pictureId;
        /** @type {string} */
        this._pictureName = "";
        this.update();
    }

    /** @returns {import("..").Game_Picture | null} */
    picture() {
        return $gameScreen.picture(this._pictureId);
    }

    /** @returns {void} */
    update() {
        super.update();
        this.updateBitmap();
        if (this.visible) {
            this.updateOrigin();
            this.updatePosition();
            this.updateScale();
            this.updateTone();
            this.updateOther();
        }
    }

    /** @returns {void} */
    updateBitmap() {
        const picture = this.picture();
        if (picture) {
            const pictureName = picture.name();
            if (this._pictureName !== pictureName) {
                this._pictureName = pictureName;
                this.loadBitmap();
            }
            this.visible = true;
        } else {
            this._pictureName = "";
            this.bitmap = null;
            this.visible = false;
        }
    }

    /** @returns {void} */
    updateOrigin() {
        const picture = this.picture();
        if (picture.origin() === 0) {
            this.anchor.x = 0;
            this.anchor.y = 0;
        } else {
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
        }
    }

    /** @returns {void} */
    updatePosition() {
        const picture = this.picture();
        this.x = Math.round(picture.x());
        this.y = Math.round(picture.y());
    }

    /** @returns {void} */
    updateScale() {
        const picture = this.picture();
        this.scale.x = picture.scaleX() / 100;
        this.scale.y = picture.scaleY() / 100;
    }

    /** @returns {void} */
    updateTone() {
        const picture = this.picture();
        if (picture.tone()) {
            this.setColorTone(picture.tone());
        } else {
            this.setColorTone([0, 0, 0, 0]);
        }
    }

    /** @returns {void} */
    updateOther() {
        const picture = this.picture();
        this.opacity = picture.opacity();
        this.blendMode = picture.blendMode();
        this.rotation = (picture.angle() * Math.PI) / 180;
    }

    /** @returns {void} */
    loadBitmap() {
        this.bitmap = ImageManager.loadPicture(this._pictureName);
    }
}

/**
 * The sprite for displaying the timer.
 */
class Sprite_Timer extends Sprite {
    /** @param {[]} args */
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
        /** @type {number} */
        this._seconds = 0;
        this.createBitmap();
        this.update();
    }

    /**
     * @param {import("pixi.js").DestroyOptions} [options]
     * @returns {void}
     */
    destroy(options) {
        this.bitmap.destroy();
        super.destroy(options);
    }

    /** @returns {void} */
    createBitmap() {
        this.bitmap = new Bitmap(96, 48);
        this.bitmap.fontFace = this.fontFace();
        this.bitmap.fontSize = this.fontSize();
        this.bitmap.outlineColor = ColorManager.outlineColor();
    }

    /** @returns {string} */
    fontFace() {
        return $gameSystem.numberFontFace();
    }

    /** @returns {number} */
    fontSize() {
        return $gameSystem.mainFontSize() + 8;
    }

    /** @returns {void} */
    update() {
        super.update();
        this.updateBitmap();
        this.updatePosition();
        this.updateVisibility();
    }

    /** @returns {void} */
    updateBitmap() {
        if (this._seconds !== $gameTimer.seconds()) {
            this._seconds = $gameTimer.seconds();
            this.redraw();
        }
    }

    /** @returns {void} */
    redraw() {
        const text = this.timerText();
        const width = this.bitmap.width;
        const height = this.bitmap.height;
        this.bitmap.clear();
        this.bitmap.drawText(text, 0, 0, width, height, "center");
    }

    /** @returns {string} */
    timerText() {
        const min = Math.floor(this._seconds / 60) % 60;
        const sec = this._seconds % 60;
        return min.padZero(2) + ":" + sec.padZero(2);
    }

    /** @returns {void} */
    updatePosition() {
        this.x = (Graphics.width - this.bitmap.width) / 2;
        this.y = 0;
    }

    /** @returns {void} */
    updateVisibility() {
        this.visible = $gameTimer.isWorking();
    }
}

/**
 * The sprite for displaying the destination place of the touch input.
 */
class Sprite_Destination extends Sprite {
    /** @param {[]} args */
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
        this.createBitmap();
        /** @type {number} */
        this._frameCount = 0;
    }

    /**
     * @param {import("pixi.js").DestroyOptions} [options]
     * @returns {void}
     */
    destroy(options) {
        if (this.bitmap) {
            this.bitmap.destroy();
        }
        super.destroy(options);
    }

    /** @returns {void} */
    update() {
        super.update();
        if ($gameTemp.isDestinationValid()) {
            this.updatePosition();
            this.updateAnimation();
            this.visible = true;
        } else {
            this._frameCount = 0;
            this.visible = false;
        }
    }

    /** @returns {void} */
    createBitmap() {
        const tileWidth = $gameMap.tileWidth();
        const tileHeight = $gameMap.tileHeight();
        this.bitmap = new Bitmap(tileWidth, tileHeight);
        this.bitmap.fillAll("white");
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.blendMode = 1;
    }

    /** @returns {void} */
    updatePosition() {
        const tileWidth = $gameMap.tileWidth();
        const tileHeight = $gameMap.tileHeight();
        const x = $gameTemp.destinationX();
        const y = $gameTemp.destinationY();
        this.x = ($gameMap.adjustX(x) + 0.5) * tileWidth;
        this.y = ($gameMap.adjustY(y) + 0.5) * tileHeight;
    }

    /** @returns {void} */
    updateAnimation() {
        this._frameCount++;
        this._frameCount %= 20;
        this.opacity = (20 - this._frameCount) * 6;
        this.scale.x = 1 + this._frameCount / 20;
        this.scale.y = this.scale.x;
    }
}

/**
 * The superclass of Spriteset_Map and Spriteset_Battle.
 */
class Spriteset_Base extends Sprite {
    /** @param {[]} args */
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
        this.setFrame(0, 0, Graphics.width, Graphics.height);
        this.loadSystemImages();
        this.createLowerLayer();
        this.createUpperLayer();
        /** @type {(Sprite_Animation | Sprite_AnimationMV)[]} */
        this._animationSprites = [];
    }

    /**
     * @param {import("pixi.js").DestroyOptions} [options]
     * @returns {void}
     */
    destroy(options) {
        this.removeAllAnimations();
        super.destroy(options);
    }

    /** @returns {void} */
    loadSystemImages() {
        //
    }

    /** @returns {void} */
    createLowerLayer() {
        this.createBaseSprite();
        this.createBaseFilters();
    }

    /** @returns {void} */
    createUpperLayer() {
        this.createPictures();
        this.createTimer();
        this.createOverallFilters();
    }

    /** @returns {void} */
    update() {
        super.update();
        this.updateBaseFilters();
        this.updateOverallFilters();
        this.updatePosition();
        this.updateAnimations();
    }

    /** @returns {void} */
    createBaseSprite() {
        this._baseSprite = new Sprite();
        this._blackScreen = new ScreenSprite();
        this._blackScreen.opacity = 255;
        this.addChild(this._baseSprite);
        this._baseSprite.addChild(this._blackScreen);
    }

    /** @returns {void} */
    createBaseFilters() {
        this._baseColorFilter = new ColorFilter();
        this._baseSprite.filters = [this._baseColorFilter];
    }

    /** @returns {void} */
    createPictures() {
        const rect = this.pictureContainerRect();
        this._pictureContainer = new Sprite();
        this._pictureContainer.setFrame(rect.x, rect.y, rect.width, rect.height);
        for (let i = 1; i <= $gameScreen.maxPictures(); i++) {
            this._pictureContainer.addChild(new Sprite_Picture(i));
        }
        this.addChild(this._pictureContainer);
    }

    /** @returns {Rectangle} */
    pictureContainerRect() {
        return new PIXI.Rectangle(0, 0, Graphics.width, Graphics.height);
    }

    /** @returns {void} */
    createTimer() {
        this._timerSprite = new Sprite_Timer();
        this.addChild(this._timerSprite);
    }

    /** @returns {void} */
    createOverallFilters() {
        this._overallColorFilter = new ColorFilter();
        this.filters = [this._overallColorFilter];
    }

    /** @returns {void} */
    updateBaseFilters() {
        const filter = this._baseColorFilter;
        filter.setColorTone($gameScreen.tone());
    }

    /** @returns {void} */
    updateOverallFilters() {
        const filter = this._overallColorFilter;
        filter.setBlendColor($gameScreen.flashColor());
        filter.setBrightness($gameScreen.brightness());
    }

    /** @returns {void} */
    updatePosition() {
        const screen = $gameScreen;
        const scale = screen.zoomScale();
        this.scale.x = scale;
        this.scale.y = scale;
        this.x = Math.round(-screen.zoomX() * (scale - 1));
        this.y = Math.round(-screen.zoomY() * (scale - 1));
        this.x += Math.round(screen.shake());
    }

    /**
     * @param {any} target
     * @returns {Sprite | null | undefined}
     */
    findTargetSprite(/*target*/) {
        return null;
    }

    /** @returns {void} */
    updateAnimations() {
        for (const sprite of this._animationSprites) {
            if (!sprite.isPlaying()) {
                this.removeAnimation(sprite);
            }
        }
        this.processAnimationRequests();
    }

    /** @returns {void} */
    processAnimationRequests() {
        for (;;) {
            const request = $gameTemp.retrieveAnimation();
            if (request) {
                this.createAnimation(request);
            } else {
                break;
            }
        }
    }

    /**
     * @param {RMMZ.AnimationRequest} request
     * @returns {void}
     */
    createAnimation(request) {
        const animation = $dataAnimations[request.animationId];
        const targets = request.targets;
        const mirror = request.mirror;
        let delay = this.animationBaseDelay();
        const nextDelay = this.animationNextDelay();
        if (this.isAnimationForEach(animation)) {
            for (const target of targets) {
                this.createAnimationSprite([target], animation, mirror, delay);
                delay += nextDelay;
            }
        } else {
            this.createAnimationSprite(targets, animation, mirror, delay);
        }
    }

    // prettier-ignore
    /**
     * @param {RMMZ.AnimationTarget[]} targets
     * @param {RMMZ.DataAnimation | RMMZ.DataAnimationMV} animation
     * @param {boolean} mirror
     * @param {number} delay
     * @returns {void}
     */
    createAnimationSprite(
        targets, animation, mirror, delay
    ) {
        const mv = this.isMVAnimation(animation);
        const sprite = new (mv ? Sprite_AnimationMV : Sprite_Animation)();
        const targetSprites = this.makeTargetSprites(targets);
        const baseDelay = this.animationBaseDelay();
        const previous = delay > baseDelay ? this.lastAnimationSprite() : null;
        if (this.animationShouldMirror(targets[0])) {
            mirror = !mirror;
        }
        sprite.targetObjects = targets;
        sprite.setup(targetSprites, animation, mirror, delay, previous);
        this._effectsContainer.addChild(sprite);
        this._animationSprites.push(sprite);
    }

    /**
     * @param {RMMZ.DataAnimation | RMMZ.DataAnimationMV} animation
     * @returns {animation is RMMZ.DataAnimationMV}
     */
    isMVAnimation(animation) {
        return !!animation.frames;
    }

    /**
     * @param {RMMZ.AnimationTarget[]} targets
     * @returns {Sprite[]}
     */
    makeTargetSprites(targets) {
        const targetSprites = [];
        for (const target of targets) {
            const targetSprite = this.findTargetSprite(target);
            if (targetSprite) {
                targetSprites.push(targetSprite);
            }
        }
        return targetSprites;
    }

    /** @returns {Sprite_Animation | Sprite_AnimationMV} */
    lastAnimationSprite() {
        return this._animationSprites[this._animationSprites.length - 1];
    }

    /**
     * @param {RMMZ.DataAnimation | RMMZ.DataAnimationMV} animation
     * @returns {boolean}
     */
    isAnimationForEach(animation) {
        const mv = this.isMVAnimation(animation);
        return mv ? animation.position !== 3 : animation.displayType === 0;
    }

    /** @returns {number} */
    animationBaseDelay() {
        return 8;
    }

    /** @returns {number} */
    animationNextDelay() {
        return 12;
    }

    /**
     * @param {RMMZ.AnimationTarget & { isActor?: () => boolean; }} target
     * @returns {boolean}
     */
    animationShouldMirror(target) {
        return target && target.isActor && target.isActor();
    }

    /**
     * @param {Sprite_Animation | Sprite_AnimationMV} sprite
     * @returns {void}
     */
    removeAnimation(sprite) {
        this._animationSprites.remove(sprite);
        this._effectsContainer.removeChild(sprite);
        for (const target of sprite.targetObjects) {
            if (target.endAnimation) {
                target.endAnimation();
            }
        }
        sprite.destroy();
    }

    /** @returns {void} */
    removeAllAnimations() {
        for (const sprite of this._animationSprites.clone()) {
            this.removeAnimation(sprite);
        }
    }

    /** @returns {boolean} */
    isAnimationPlaying() {
        return this._animationSprites.length > 0;
    }
}

/**
 * The set of sprites on the map screen.
 */
class Spriteset_Map extends Spriteset_Base {
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
        /** @type {Sprite_Balloon[]} */
        this._balloonSprites = [];
    }

    /**
     * @param {import("pixi.js").DestroyOptions} [options]
     * @returns {void}
     */
    destroy(options) {
        this.removeAllBalloons();
        super.destroy(options);
    }

    /** @returns {void} */
    loadSystemImages() {
        super.loadSystemImages();
        ImageManager.loadSystem("Balloon");
        ImageManager.loadSystem("Shadow1");
    }

    /** @returns {void} */
    createLowerLayer() {
        super.createLowerLayer();
        this.createParallax();
        this.createTilemap();
        this.createCharacters();
        this.createShadow();
        this.createDestination();
        this.createWeather();
    }

    /** @returns {void} */
    update() {
        super.update();
        this.updateTileset();
        this.updateParallax();
        this.updateTilemap();
        this.updateShadow();
        this.updateWeather();
        this.updateAnimations();
        this.updateBalloons();
    }

    /** @returns {void} */
    hideCharacters() {
        for (const sprite of this._characterSprites) {
            if (!sprite.isTile() && !sprite.isObjectCharacter()) {
                sprite.hide();
            }
        }
    }

    /** @returns {void} */
    createParallax() {
        this._parallax = new TilingSprite();
        this._parallax.move(0, 0, Graphics.width, Graphics.height);
        this._baseSprite.addChild(this._parallax);
    }

    /** @returns {void} */
    createTilemap() {
        const tilemap = new Tilemap();
        tilemap.tileWidth = $gameMap.tileWidth();
        tilemap.tileHeight = $gameMap.tileHeight();
        tilemap.setData($gameMap.width(), $gameMap.height(), $gameMap.data());
        tilemap.horizontalWrap = $gameMap.isLoopHorizontal();
        tilemap.verticalWrap = $gameMap.isLoopVertical();
        this._baseSprite.addChild(tilemap);
        this._effectsContainer = tilemap;
        this._tilemap = tilemap;
        this.loadTileset();
    }

    /** @returns {void} */
    loadTileset() {
        this._tileset = $gameMap.tileset();
        if (this._tileset) {
            const bitmaps = [];
            const tilesetNames = this._tileset.tilesetNames;
            for (const name of tilesetNames) {
                bitmaps.push(ImageManager.loadTileset(name));
            }
            this._tilemap.setBitmaps(bitmaps);
            this._tilemap.flags = $gameMap.tilesetFlags();
        }
    }

    /** @returns {void} */
    createCharacters() {
        this._characterSprites = [];
        for (const event of $gameMap.events()) {
            this._characterSprites.push(new Sprite_Character(event));
        }
        for (const vehicle of $gameMap.vehicles()) {
            this._characterSprites.push(new Sprite_Character(vehicle));
        }
        for (const follower of $gamePlayer.followers().reverseData()) {
            this._characterSprites.push(new Sprite_Character(follower));
        }
        this._characterSprites.push(new Sprite_Character($gamePlayer));
        for (const sprite of this._characterSprites) {
            this._tilemap.addChild(sprite);
        }
    }

    /** @returns {void} */
    createShadow() {
        this._shadowSprite = new Sprite();
        this._shadowSprite.bitmap = ImageManager.loadSystem("Shadow1");
        this._shadowSprite.anchor.x = 0.5;
        this._shadowSprite.anchor.y = 1;
        this._shadowSprite.z = 6;
        this._tilemap.addChild(this._shadowSprite);
    }

    /** @returns {void} */
    createDestination() {
        this._destinationSprite = new Sprite_Destination();
        this._destinationSprite.z = 9;
        this._tilemap.addChild(this._destinationSprite);
    }

    /** @returns {void} */
    createWeather() {
        this._weather = new Weather();
        this.addChild(this._weather);
    }

    /** @returns {void} */
    updateTileset() {
        if (this._tileset !== $gameMap.tileset()) {
            this.loadTileset();
        }
    }

    /** @returns {void} */
    updateParallax() {
        if (this._parallaxName !== $gameMap.parallaxName()) {
            this._parallaxName = $gameMap.parallaxName();
            this._parallax.bitmap = ImageManager.loadParallax(this._parallaxName);
        }
        if (this._parallax.bitmap) {
            const bitmap = this._parallax.bitmap;
            this._parallax.origin.x = $gameMap.parallaxOx() % bitmap.width;
            this._parallax.origin.y = $gameMap.parallaxOy() % bitmap.height;
        }
    }

    /** @returns {void} */
    updateTilemap() {
        this._tilemap.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
        this._tilemap.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
    }

    /** @returns {void} */
    updateShadow() {
        const airship = $gameMap.airship();
        this._shadowSprite.x = airship.shadowX();
        this._shadowSprite.y = airship.shadowY();
        this._shadowSprite.opacity = airship.shadowOpacity();
    }

    /** @returns {void} */
    updateWeather() {
        this._weather.type = $gameScreen.weatherType();
        this._weather.power = $gameScreen.weatherPower();
        this._weather.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
        this._weather.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
    }

    /** @returns {void} */
    updateBalloons() {
        for (const sprite of this._balloonSprites) {
            if (!sprite.isPlaying()) {
                this.removeBalloon(sprite);
            }
        }
        this.processBalloonRequests();
    }

    /** @returns {void} */
    processBalloonRequests() {
        for (;;) {
            const request = $gameTemp.retrieveBalloon();
            if (request) {
                this.createBalloon(request);
            } else {
                break;
            }
        }
    }

    /**
     * @param {RMMZ.BalloonRequest} request
     * @returns {void}
     */
    createBalloon(request) {
        const targetSprite = this.findTargetSprite(request.target);
        if (targetSprite) {
            const sprite = new Sprite_Balloon();
            sprite.targetObject = request.target;
            sprite.setup(targetSprite, request.balloonId);
            this._effectsContainer.addChild(sprite);
            this._balloonSprites.push(sprite);
        }
    }

    /**
     * @param {Sprite_Balloon} sprite
     * @returns {void}
     */
    removeBalloon(sprite) {
        this._balloonSprites.remove(sprite);
        this._effectsContainer.removeChild(sprite);
        if (sprite.targetObject.endBalloon) {
            sprite.targetObject.endBalloon();
        }
        sprite.destroy();
    }

    /** @returns {void} */
    removeAllBalloons() {
        for (const sprite of this._balloonSprites.clone()) {
            this.removeBalloon(sprite);
        }
    }

    /**
     * @param {Game_Character} target
     * @returns {Sprite_Character | undefined}
     */
    findTargetSprite(target) {
        return this._characterSprites.find(sprite => sprite.checkCharacter(target));
    }

    /** @returns {number} */
    animationBaseDelay() {
        return 0;
    }
}

/**
 * The set of sprites on the battle screen.
 */
class Spriteset_Battle extends Spriteset_Base {
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize();
        /** @type {boolean} */
        this._battlebackLocated = false;
    }

    /** @returns {void} */
    loadSystemImages() {
        super.loadSystemImages();
        ImageManager.loadSystem("Shadow2");
        ImageManager.loadSystem("Weapons1");
        ImageManager.loadSystem("Weapons2");
        ImageManager.loadSystem("Weapons3");
    }

    /** @returns {void} */
    createLowerLayer() {
        super.createLowerLayer();
        this.createBackground();
        this.createBattleback();
        this.createBattleField();
        this.createEnemies();
        this.createActors();
    }

    /** @returns {void} */
    createBackground() {
        this._backgroundFilter = new PIXI.BlurFilter();
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        this._backgroundSprite.filters = [this._backgroundFilter];
        this._baseSprite.addChild(this._backgroundSprite);
    }

    /** @returns {void} */
    createBattleback() {
        this._back1Sprite = new Sprite_Battleback(0);
        this._back2Sprite = new Sprite_Battleback(1);
        this._baseSprite.addChild(this._back1Sprite);
        this._baseSprite.addChild(this._back2Sprite);
    }

    /** @returns {void} */
    createBattleField() {
        const width = Graphics.boxWidth;
        const height = Graphics.boxHeight;
        const x = (Graphics.width - width) / 2;
        const y = (Graphics.height - height) / 2;
        this._battleField = new Sprite();
        this._battleField.setFrame(0, 0, width, height);
        this._battleField.x = x;
        this._battleField.y = y - this.battleFieldOffsetY();
        this._baseSprite.addChild(this._battleField);
        this._effectsContainer = this._battleField;
    }

    /** @returns {number} */
    battleFieldOffsetY() {
        return 24;
    }

    /** @returns {void} */
    update() {
        super.update();
        this.updateActors();
        this.updateBattleback();
        this.updateAnimations();
    }

    /** @returns {void} */
    updateBattleback() {
        if (!this._battlebackLocated) {
            this._back1Sprite.adjustPosition();
            this._back2Sprite.adjustPosition();
            this._battlebackLocated = true;
        }
    }

    /** @returns {void} */
    createEnemies() {
        const enemies = $gameTroop.members();
        const sprites = [];
        for (const enemy of enemies) {
            sprites.push(new Sprite_Enemy(enemy));
        }
        sprites.sort(this.compareEnemySprite.bind(this));
        for (const sprite of sprites) {
            this._battleField.addChild(sprite);
        }
        this._enemySprites = sprites;
    }

    /**
     * @param {Sprite_Enemy} a
     * @param {Sprite_Enemy} b
     * @returns {number}
     */
    compareEnemySprite(a, b) {
        if (a.y !== b.y) {
            return a.y - b.y;
        } else {
            return b.spriteId - a.spriteId;
        }
    }

    /** @returns {void} */
    createActors() {
        this._actorSprites = [];
        if ($gameSystem.isSideView()) {
            for (let i = 0; i < $gameParty.maxBattleMembers(); i++) {
                const sprite = new Sprite_Actor();
                this._actorSprites.push(sprite);
                this._battleField.addChild(sprite);
            }
        }
    }

    /** @returns {void} */
    updateActors() {
        const members = $gameParty.battleMembers();
        for (let i = 0; i < this._actorSprites.length; i++) {
            this._actorSprites[i].setBattler(members[i]);
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {Sprite | undefined}
     */
    findTargetSprite(target) {
        return this.battlerSprites().find(sprite => sprite.checkBattler(target));
    }

    /** @returns {(Sprite_Actor | Sprite_Enemy)[]} */
    battlerSprites() {
        return this._enemySprites.concat(this._actorSprites);
    }

    /** @returns {boolean} */
    isEffecting() {
        return this.battlerSprites().some(sprite => sprite.isEffecting());
    }

    /** @returns {boolean} */
    isAnyoneMoving() {
        return this.battlerSprites().some(sprite => sprite.isMoving());
    }

    /** @returns {boolean} */
    isBusy() {
        return this.isAnimationPlaying() || this.isAnyoneMoving();
    }
}

// Class declarations are lexical bindings, while plugins and JsonEx resolve
// constructors through the global object, so expose them as global properties.
Object.assign(globalThis, {
    Sprite_Clickable,
    Sprite_Button,
    Sprite_Character,
    Sprite_Battler,
    Sprite_Actor,
    Sprite_Enemy,
    Sprite_Animation,
    Sprite_AnimationMV,
    Sprite_Battleback,
    Sprite_Damage,
    Sprite_Gauge,
    Sprite_Name,
    Sprite_StateIcon,
    Sprite_StateOverlay,
    Sprite_Weapon,
    Sprite_Balloon,
    Sprite_Picture,
    Sprite_Timer,
    Sprite_Destination,
    Spriteset_Base,
    Spriteset_Map,
    Spriteset_Battle,
});
