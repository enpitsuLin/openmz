// rmmz_sprites.js v2.0.0

/**
 * The sprite class with click handling functions.
 */
class Sprite_Clickable extends Sprite {
    declare _pressed: boolean;
    declare _hovered: boolean;

    constructor(...args: any[]) {
        super(...args);
    }

    initialize(..._args: any[]): void;
    initialize(...args: any[]): void;
    initialize(..._args: any[]): void {
        super.initialize();

        this._pressed = false;
        this._hovered = false;
    }

    update(): void {
        super.update();
        this.processTouch();
    }

    processTouch(): void {
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

    isPressed(): boolean {
        return this._pressed;
    }

    isClickEnabled(): boolean {
        for (let sprite: import("pixi.js").Container | null = this; sprite; sprite = sprite.parent!) {
            if (!sprite.visible) {
                return false;
            }
        }
        return true;
    }

    isBeingTouched(): boolean {
        const touchPos = new PIXI.Point(TouchInput.x, TouchInput.y);
        const localPos = this.toLocal(touchPos);
        return this.hitTest(localPos.x, localPos.y);
    }

    hitTest(x: number, y: number): boolean {
        const rect = new PIXI.Rectangle(
            -this.anchor.x * this.width,
            -this.anchor.y * this.height,
            this.width,
            this.height,
        );
        return rect.contains(x, y);
    }

    onMouseEnter(): void {
        //
    }

    onMouseExit(): void {
        //
    }

    onPress(): void {
        //
    }

    onClick(): void {
        //
    }
}

/**
 * The sprite for displaying a button.
 */
class Sprite_Button extends Sprite_Clickable {
    declare _buttonType: "cancel" | "pageup" | "pagedown" | "down" | "up" | "down2" | "up2" | "ok" | "menu";
    declare _clickHandler: (() => void) | null;
    declare _coldFrame: Rectangle | null;
    declare _hotFrame: Rectangle | null;

    constructor(
        ...args: [buttonType: "cancel" | "pageup" | "pagedown" | "down" | "up" | "down2" | "up2" | "ok" | "menu"]
    ) {
        super(...args);
    }

    initialize(buttonType: "cancel" | "pageup" | "pagedown" | "down" | "up" | "down2" | "up2" | "ok" | "menu"): void;
    initialize(...args: any[]): void;
    initialize(buttonType: "cancel" | "pageup" | "pagedown" | "down" | "up" | "down2" | "up2" | "ok" | "menu"): void {
        super.initialize();

        this._buttonType = buttonType;
        this._clickHandler = null;
        this._coldFrame = null;
        this._hotFrame = null;
        this.setupFrames();
    }

    setupFrames(): void {
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

    blockWidth(): number {
        return 48;
    }

    blockHeight(): number {
        return 48;
    }

    loadButtonImage(): void {
        this.bitmap = ImageManager.loadSystem("ButtonSet");
    }

    buttonData():
        | {
              x: number;
              w: number;
          }
        | {
              x: number;
              w: number;
          }
        | {
              x: number;
              w: number;
          }
        | {
              x: number;
              w: number;
          }
        | {
              x: number;
              w: number;
          }
        | {
              x: number;
              w: number;
          }
        | {
              x: number;
              w: number;
          }
        | {
              x: number;
              w: number;
          }
        | {
              x: number;
              w: number;
          } {
        const buttonTable = {
            cancel: { x: 0, w: 2 },
            pageup: { x: 2, w: 1 },
            pagedown: { x: 3, w: 1 },
            down: { x: 4, w: 1 },
            up: { x: 5, w: 1 },
            down2: { x: 6, w: 1 },
            up2: { x: 7, w: 1 },
            ok: { x: 8, w: 2 },
            menu: { x: 10, w: 1 },
        };
        return buttonTable[this._buttonType];
    }

    update(): void {
        super.update();
        this.checkBitmap();
        this.updateFrame();
        this.updateOpacity();
        this.processTouch();
    }

    checkBitmap(): void {
        if (this.bitmap.isReady() && this.bitmap.width < this.blockWidth() * 11) {
            // Probably MV image is used
            throw new Error("ButtonSet image is too small");
        }
    }

    updateFrame(): void {
        const frame = this.isPressed() ? this._hotFrame : this._coldFrame;
        if (frame) {
            this.setFrame(frame.x, frame.y, frame.width, frame.height);
        }
    }

    updateOpacity(): void {
        this.opacity = this._pressed ? 255 : 192;
    }

    setColdFrame(x: number, y: number, width: number, height: number): void {
        this._coldFrame = new PIXI.Rectangle(x, y, width, height);
    }

    setHotFrame(x: number, y: number, width: number, height: number): void {
        this._hotFrame = new PIXI.Rectangle(x, y, width, height);
    }

    setClickHandler(method: () => void): void {
        this._clickHandler = method;
    }

    onClick(): void {
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
    declare _character: Game_Character;
    declare _balloonDuration: number;
    declare _tilesetId: RMMZ.TilesetID;
    declare _upperBody: Sprite;
    declare _lowerBody: Sprite;
    declare _tileId: number;
    declare _characterName: string;
    declare _characterIndex: number;
    declare _isBigCharacter: boolean;
    declare z: number;
    declare _bushDepth: number;

    constructor(...args: [character: Game_Character]) {
        super(...args);
    }

    initialize(character: Game_Character): void;
    initialize(...args: any[]): void;
    initialize(character: Game_Character): void {
        super.initialize();
        this.initMembers();
        this.setCharacter(character);
    }

    initMembers(): void {
        this.anchor.x = 0.5;
        this.anchor.y = 1;

        this._character = null!;
        this._balloonDuration = 0;
        this._tilesetId = 0;
        this._upperBody = null!;
        this._lowerBody = null!;
    }

    setCharacter(character: Game_Character): void {
        this._character = character;
    }

    checkCharacter(character: Game_Character): boolean {
        return this._character === character;
    }

    update(): void {
        super.update();
        this.updateBitmap();
        this.updateFrame();
        this.updatePosition();
        this.updateOther();
        this.updateVisibility();
    }

    updateVisibility(): void {
        super.updateVisibility();
        if (this.isEmptyCharacter() || this._character.isTransparent()) {
            this.visible = false;
        }
    }

    isTile(): boolean {
        return this._character.isTile();
    }

    isObjectCharacter(): boolean {
        return this._character.isObjectCharacter();
    }

    isEmptyCharacter(): boolean {
        return this._tileId === 0 && !this._characterName;
    }

    tilesetBitmap(tileId: RMMZ.TileID): Bitmap {
        const tileset = $gameMap.tileset();
        const setNumber = 5 + Math.floor(tileId / 256);
        return ImageManager.loadTileset(tileset.tilesetNames[setNumber]);
    }

    updateBitmap(): void {
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

    isImageChanged(): boolean {
        return (
            this._tilesetId !== $gameMap.tilesetId() ||
            this._tileId !== this._character.tileId() ||
            this._characterName !== this._character.characterName() ||
            this._characterIndex !== this._character.characterIndex()
        );
    }

    setTileBitmap(): void {
        this.bitmap = this.tilesetBitmap(this._tileId);
    }

    setCharacterBitmap(): void {
        this.bitmap = ImageManager.loadCharacter(this._characterName);
        this._isBigCharacter = ImageManager.isBigCharacter(this._characterName);
    }

    updateFrame(): void {
        if (this._tileId > 0) {
            this.updateTileFrame();
        } else {
            this.updateCharacterFrame();
        }
    }

    updateTileFrame(): void {
        const tileId = this._tileId;
        const pw = this.patternWidth();
        const ph = this.patternHeight();
        const sx = ((Math.floor(tileId / 128) % 2) * 8 + (tileId % 8)) * pw;
        const sy = (Math.floor((tileId % 256) / 8) % 16) * ph;
        this.setFrame(sx, sy, pw, ph);
    }

    updateCharacterFrame(): void {
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

    characterBlockX(): number {
        if (this._isBigCharacter) {
            return 0;
        } else {
            const index = this._character.characterIndex();
            return (index % 4) * 3;
        }
    }

    characterBlockY(): number {
        if (this._isBigCharacter) {
            return 0;
        } else {
            const index = this._character.characterIndex();
            return Math.floor(index / 4) * 4;
        }
    }

    characterPatternX(): number {
        return this._character.pattern();
    }

    characterPatternY(): number {
        return (this._character.direction() - 2) / 2;
    }

    patternWidth(): number {
        if (this._tileId > 0) {
            return $gameMap.tileWidth();
        } else if (this._isBigCharacter) {
            return this.bitmap.width / 3;
        } else {
            return this.bitmap.width / 12;
        }
    }

    patternHeight(): number {
        if (this._tileId > 0) {
            return $gameMap.tileHeight();
        } else if (this._isBigCharacter) {
            return this.bitmap.height / 4;
        } else {
            return this.bitmap.height / 8;
        }
    }

    updateHalfBodySprites(): void {
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

    createHalfBodySprites(): void {
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

    updatePosition(): void {
        this.x = this._character.screenX();
        this.y = this._character.screenY();
        this.z = this._character.screenZ();
    }

    updateOther(): void {
        this.opacity = this._character.opacity();
        this.blendMode = this._character.blendMode();
        this._bushDepth = this._character.bushDepth();
    }
}

/**
 * The superclass of Sprite_Actor and Sprite_Enemy.
 */
class Sprite_Battler extends Sprite_Clickable {
    declare _battler: RMMZ.ActionTarget;
    declare _damages: Sprite_Damage[];
    declare _homeX: number;
    declare _homeY: number;
    declare _offsetX: number;
    declare _offsetY: number;
    declare _targetOffsetX: number;
    declare _targetOffsetY: number;
    declare _movementDuration: number;
    declare _selectionEffectCount: number;

    constructor(..._extra: any[]);
    constructor(...args: [battler: RMMZ.ActionTarget]) {
        super(...args);
    }

    initialize(battler: RMMZ.ActionTarget): void;
    initialize(...args: any[]): void;
    initialize(battler: RMMZ.ActionTarget): void {
        super.initialize();
        this.initMembers();
        this.setBattler(battler);
    }

    initMembers(): void {
        this.anchor.x = 0.5;
        this.anchor.y = 1;

        this._battler = null!;
        this._damages = [];
        this._homeX = 0;
        this._homeY = 0;
        this._offsetX = 0;
        this._offsetY = 0;
        this._targetOffsetX = NaN;
        this._targetOffsetY = NaN;
        this._movementDuration = 0;
        this._selectionEffectCount = 0;
    }

    setBattler(battler: RMMZ.ActionTarget): void {
        this._battler = battler;
    }

    checkBattler(battler: RMMZ.ActionTarget): boolean {
        return this._battler === battler;
    }

    mainSprite(): Sprite {
        return this;
    }

    setHome(x: number, y: number): void {
        this._homeX = x;
        this._homeY = y;
        this.updatePosition();
    }

    update(): void {
        super.update();
        if (this._battler) {
            this.updateMain();
            this.updateDamagePopup();
            this.updateSelectionEffect();
            this.updateVisibility();
        } else {
            this.bitmap = null!;
        }
    }

    updateVisibility(): void {
        super.updateVisibility();
        if (!this._battler || !this._battler.isSpriteVisible()) {
            this.visible = false;
        }
    }

    updateMain(): void {
        if (this._battler.isSpriteVisible()) {
            this.updateBitmap();
            this.updateFrame();
        }
        this.updateMove();
        this.updatePosition();
    }

    updateBitmap(): void {
        //
    }

    updateFrame(): void {
        //
    }

    updateMove(): void {
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

    updatePosition(): void {
        this.x = this._homeX + this._offsetX;
        this.y = this._homeY + this._offsetY;
    }

    updateDamagePopup(): void {
        this.setupDamagePopup();
        if (this._damages.length > 0) {
            for (const damage of this._damages) {
                damage.update!();
            }
            if (!this._damages[0].isPlaying()) {
                this.destroyDamageSprite(this._damages[0]);
            }
        }
    }

    updateSelectionEffect(): void {
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

    setupDamagePopup(): void {
        if (this._battler.isDamagePopupRequested()) {
            if (this._battler.isSpriteVisible()) {
                this.createDamageSprite();
            }
            this._battler.clearDamagePopup();
            this._battler.clearResult();
        }
    }

    createDamageSprite(): void {
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
        this.parent!.addChild(sprite);
    }

    destroyDamageSprite(sprite: Sprite_Damage): void {
        this.parent!.removeChild(sprite);
        this._damages.remove(sprite);
        sprite.destroy();
    }

    damageOffsetX(): number {
        return 0;
    }

    damageOffsetY(): number {
        return 0;
    }

    startMove(x: number, y: number, duration: number): void {
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

    onMoveEnd(): void {
        //
    }

    isEffecting(): boolean {
        return false;
    }

    isMoving(): boolean {
        return this._movementDuration > 0;
    }

    inHomePosition(): boolean {
        return this._offsetX === 0 && this._offsetY === 0;
    }

    onMouseEnter(): void {
        $gameTemp.setTouchState(this._battler, "select");
    }

    onPress(): void {
        $gameTemp.setTouchState(this._battler, "select");
    }

    onClick(): void {
        $gameTemp.setTouchState(this._battler, "click");
    }
}

/**
 * The sprite for displaying an actor.
 */
class Sprite_Actor extends Sprite_Battler {
    declare _battlerName: string;
    declare _motion: (typeof Sprite_Actor.MOTIONS)[RMMZ.BattlerMotionType] | null;
    declare _motionCount: number;
    declare _pattern: number;
    declare _mainSprite: Sprite;
    declare _shadowSprite: Sprite;
    declare _weaponSprite: Sprite_Weapon;
    declare _stateSprite: Sprite_StateOverlay;
    declare _actor: any;

    constructor(...args: [battler?: Game_Actor]) {
        super(...args!);
    }

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
    } = {
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
        dead: { index: 17, loop: true },
    };

    initialize(battler?: Game_Actor): void;
    initialize(...args: any[]): void;
    initialize(battler?: Game_Actor): void {
        super.initialize(battler!);
        this.moveToStartPosition();
    }

    initMembers(): void {
        super.initMembers();

        this._battlerName = "";
        this._motion = null;
        this._motionCount = 0;
        this._pattern = 0;
        this.createShadowSprite();
        this.createWeaponSprite();
        this.createMainSprite();
        this.createStateSprite();
    }

    mainSprite(): Sprite {
        return this._mainSprite;
    }

    createMainSprite(): void {
        this._mainSprite = new Sprite();
        this._mainSprite.anchor.x = 0.5;
        this._mainSprite.anchor.y = 1;
        this.addChild(this._mainSprite);
    }

    createShadowSprite(): void {
        this._shadowSprite = new Sprite();
        this._shadowSprite.bitmap = ImageManager.loadSystem("Shadow2");
        this._shadowSprite.anchor.x = 0.5;
        this._shadowSprite.anchor.y = 0.5;
        this._shadowSprite.y = -2;
        this.addChild(this._shadowSprite);
    }

    createWeaponSprite(): void {
        this._weaponSprite = new Sprite_Weapon();
        this.addChild(this._weaponSprite);
    }

    createStateSprite(): void {
        this._stateSprite = new Sprite_StateOverlay();
        this.addChild(this._stateSprite);
    }

    setBattler(battler: Game_Actor): void {
        super.setBattler(battler);
        if (battler !== this._actor) {
            this._actor = battler;
            if (battler) {
                this.setActorHome(battler.index());
            } else {
                this._mainSprite.bitmap = null!;
                this._battlerName = "";
            }
            this.startEntryMotion();
            this._stateSprite.setup(battler);
        }
    }

    moveToStartPosition(): void {
        this.startMove(300, 0, 0);
    }

    setActorHome(index: number): void {
        this.setHome(600 + index * 32, 280 + index * 48);
    }

    update(): void {
        super.update();
        this.updateShadow();
        if (this._actor) {
            this.updateMotion();
        }
    }

    updateShadow(): void {
        this._shadowSprite.visible = !!this._actor;
    }

    updateMain(): void {
        super.updateMain();
        if (this._actor.isSpriteVisible() && !this.isMoving()) {
            this.updateTargetPosition();
        }
    }

    setupMotion(): void {
        if (this._actor.isMotionRequested()) {
            this.startMotion(this._actor.motionType());
            this._actor.clearMotion();
        }
    }

    setupWeaponAnimation(): void {
        if (this._actor.isWeaponAnimationRequested()) {
            this._weaponSprite.setup(this._actor.weaponImageId());
            this._actor.clearWeaponAnimation();
        }
    }

    startMotion(motionType: RMMZ.BattlerMotionType): void {
        const newMotion = Sprite_Actor.MOTIONS[motionType];
        if (this._motion !== newMotion) {
            this._motion = newMotion;
            this._motionCount = 0;
            this._pattern = 0;
        }
    }

    updateTargetPosition(): void {
        if (this._actor.canMove() && BattleManager.isEscaped()) {
            this.retreat();
        } else if (this.shouldStepForward()) {
            this.stepForward();
        } else if (!this.inHomePosition()) {
            this.stepBack();
        }
    }

    shouldStepForward(): boolean {
        return this._actor.isInputting() || this._actor.isActing();
    }

    updateBitmap(): void {
        super.updateBitmap();
        const name = this._actor.battlerName();
        if (this._battlerName !== name) {
            this._battlerName = name;
            this._mainSprite.bitmap = ImageManager.loadSvActor(name);
        }
    }

    updateFrame(): void {
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

    updateMove(): void {
        const bitmap = this._mainSprite.bitmap;
        if (!bitmap || bitmap.isReady()) {
            super.updateMove();
        }
    }

    updateMotion(): void {
        this.setupMotion();
        this.setupWeaponAnimation();
        if (this._actor.isMotionRefreshRequested()) {
            this.refreshMotion();
            this._actor.clearMotion();
        }
        this.updateMotionCount();
    }

    updateMotionCount(): void {
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

    motionSpeed(): number {
        return 12;
    }

    refreshMotion(): void {
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

    startEntryMotion(): void {
        if (this._actor && this._actor.canMove()) {
            this.startMotion("walk");
            this.startMove(0, 0, 30);
        } else if (!this.isMoving()) {
            this.refreshMotion();
            this.startMove(0, 0, 0);
        }
    }

    stepForward(): void {
        this.startMove(-48, 0, 12);
    }

    stepBack(): void {
        this.startMove(0, 0, 12);
    }

    retreat(): void {
        this.startMove(300, 0, 30);
    }

    onMoveEnd(): void {
        super.onMoveEnd();
        if (!BattleManager.isBattleEnd()) {
            this.refreshMotion();
        }
    }

    damageOffsetX(): number {
        return super.damageOffsetX() - 32;
    }

    damageOffsetY(): number {
        return super.damageOffsetY();
    }
}

/**
 * The sprite for displaying an enemy.
 */
class Sprite_Enemy extends Sprite_Battler {
    declare _enemy: Game_Enemy;
    declare _appeared: boolean;
    declare _battlerName: string | null;
    declare _battlerHue: number;
    declare _effectType: RMMZ.BattlerEffectType | null;
    declare _effectDuration: number;
    declare _shake: number;
    declare _stateIconSprite: Sprite_StateIcon;

    constructor(...args: any[]) {
        super(...args);
    }

    initialize(battler: any): void;
    initialize(...args: any[]): void;
    initialize(battler: any): void {
        super.initialize(battler);
    }

    initMembers(): void {
        super.initMembers();

        this._enemy = null!;
        this._appeared = false;
        this._battlerName = null;
        this._battlerHue = 0;
        this._effectType = null;
        this._effectDuration = 0;
        this._shake = 0;
        this.createStateIconSprite();
    }

    createStateIconSprite(): void {
        this._stateIconSprite = new Sprite_StateIcon();
        this.addChild(this._stateIconSprite);
    }

    setBattler(battler: Game_Enemy): void {
        super.setBattler(battler);
        this._enemy = battler;
        this.setHome(battler.screenX(), battler.screenY());
        this._stateIconSprite.setup(battler);
    }

    update(): void {
        super.update();
        if (this._enemy) {
            this.updateEffect();
            this.updateStateSprite();
        }
    }

    updateBitmap(): void {
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

    loadBitmap(name: string): void {
        if ($gameSystem.isSideView()) {
            this.bitmap = ImageManager.loadSvEnemy(name);
        } else {
            this.bitmap = ImageManager.loadEnemy(name);
        }
    }

    setHue(hue: number): void {
        super.setHue(hue);
        for (const child of this.children as Sprite[]) {
            if (child.setHue) {
                child.setHue(-hue);
            }
        }
    }

    updateFrame(): void {
        super.updateFrame();
        if (this._effectType === "bossCollapse") {
            this.setFrame(0, 0, this.bitmap.width, this._effectDuration);
        } else {
            this.setFrame(0, 0, this.bitmap.width, this.bitmap.height);
        }
    }

    updatePosition(): void {
        super.updatePosition();
        this.x += this._shake;
    }

    updateStateSprite(): void {
        this._stateIconSprite.y = -Math.round((this.bitmap.height + 40) * 0.9);
        if (this._stateIconSprite.y < 20 - this.y) {
            this._stateIconSprite.y = 20 - this.y;
        }
    }

    initVisibility(): void {
        this._appeared = this._enemy.isAlive();
        if (!this._appeared) {
            this.opacity = 0;
        }
    }

    setupEffect(): void {
        if (this._appeared && this._enemy.isEffectRequested()) {
            this.startEffect(this._enemy.effectType()!);
            this._enemy.clearEffect();
        }
        if (!this._appeared && this._enemy.isAlive()) {
            this.startEffect("appear");
        } else if (this._appeared && this._enemy.isHidden()) {
            this.startEffect("disappear");
        }
    }

    startEffect(effectType: RMMZ.BattlerEffectType): void {
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

    startAppear(): void {
        this._effectDuration = 16;
        this._appeared = true;
    }

    startDisappear(): void {
        this._effectDuration = 32;
        this._appeared = false;
    }

    startWhiten(): void {
        this._effectDuration = 16;
    }

    startBlink(): void {
        this._effectDuration = 20;
    }

    startCollapse(): void {
        this._effectDuration = 32;
        this._appeared = false;
    }

    startBossCollapse(): void {
        this._effectDuration = this.bitmap.height;
        this._appeared = false;
    }

    startInstantCollapse(): void {
        this._effectDuration = 16;
        this._appeared = false;
    }

    updateEffect(): void {
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

    isEffecting(): boolean {
        return this._effectType !== null;
    }

    revertToNormal(): void {
        this._shake = 0;
        this.blendMode = 0;
        this.opacity = 255;
        this.setBlendColor([0, 0, 0, 0]);
    }

    updateWhiten(): void {
        const alpha = 128 - (16 - this._effectDuration) * 8;
        this.setBlendColor([255, 255, 255, alpha]);
    }

    updateBlink(): void {
        this.opacity = this._effectDuration % 10 < 5 ? 255 : 0;
    }

    updateAppear(): void {
        this.opacity = (16 - this._effectDuration) * 16;
    }

    updateDisappear(): void {
        this.opacity = 256 - (32 - this._effectDuration) * 10;
    }

    updateCollapse(): void {
        this.blendMode = 1;
        this.setBlendColor([255, 128, 128, 128]);
        this.opacity *= this._effectDuration / (this._effectDuration + 1);
    }

    updateBossCollapse(): void {
        this._shake = (this._effectDuration % 2) * 4 - 2;
        this.blendMode = 1;
        this.opacity *= this._effectDuration / (this._effectDuration + 1);
        this.setBlendColor([255, 255, 255, 255 - this.opacity]);
        if (this._effectDuration % 20 === 19) {
            SoundManager.playBossCollapse2();
        }
    }

    updateInstantCollapse(): void {
        this.opacity = 0;
    }

    damageOffsetX(): number {
        return super.damageOffsetX();
    }

    damageOffsetY(): number {
        return super.damageOffsetY() - 8;
    }
}

/**
 * The sprite for displaying an animation.
 */
class Sprite_Animation extends PIXI.RenderContainer {
    declare targetObjects: RMMZ.AnimationTarget[];

    declare spriteId: number;
    declare _targets: Sprite[];
    declare _animation: RMMZ.DataAnimation;
    declare _mirror: boolean;
    declare _delay: number;
    declare _previous: Sprite_Animation | Sprite_AnimationMV | null;
    declare _effect: effekseer.EffekseerEffect | null;
    declare _handle: effekseer.EffekseerHandle | null;
    declare _playing: boolean;
    declare _started: boolean;
    declare _frameIndex: number;
    declare _maxTimingFrames: number;
    declare _flashColor: RMMZ.Writable<RMMZ.Color>;
    declare _flashDuration: number;
    declare _viewportSize: number;
    declare z: number;

    constructor() {
        super({});
        this.spriteId = Sprite._counter++;
        this.initMembers();
    }

    initMembers(): void {
        this._targets = [];
        this._animation = null!;
        this._mirror = false;
        this._delay = 0;
        this._previous = null;
        this._effect = null;
        this._handle = null;
        this._playing = false;
        this._started = false;
        this._frameIndex = 0;
        this._maxTimingFrames = 0;
        this._flashColor = [0, 0, 0, 0];
        this._flashDuration = 0;
        this._viewportSize = 4096;
        this.z = 8;
    }

    destroy(options?: import("pixi.js").DestroyOptions): void {
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

    setup(
        targets: Sprite[], animation: RMMZ.DataAnimation, mirror: boolean, delay: number, previous: Sprite_Animation | Sprite_AnimationMV | null
    ): void {
        this._targets = targets;
        this._animation = animation;
        this._mirror = mirror;
        this._delay = delay;
        this._previous = previous;
        this._effect = EffectManager.load(animation.effectName);
        this._playing = true;
        const timings = [...animation.soundTimings, ...animation.flashTimings];
        for (const timing of timings) {
            if (timing.frame > this._maxTimingFrames) {
                this._maxTimingFrames = timing.frame;
            }
        }
    }

    update(): void {
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

    canStart(): boolean {
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
     */
    shouldWaitForPrevious(): boolean {
        return false;
    }

    updateEffectGeometry(): void {
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

    updateMain(): void {
        this.processSoundTimings();
        this.processFlashTimings();
        this._frameIndex++;
        this.checkEnd();
    }

    processSoundTimings(): void {
        for (const timing of this._animation.soundTimings) {
            if (timing.frame === this._frameIndex) {
                AudioManager.playSe(timing.se);
            }
        }
    }

    processFlashTimings(): void {
        for (const timing of this._animation.flashTimings) {
            if (timing.frame === this._frameIndex) {
                this._flashColor = timing.color.clone();
                this._flashDuration = timing.duration;
            }
        }
    }

    checkEnd(): void {
        if (
            this._frameIndex > this._maxTimingFrames &&
            this._flashDuration === 0 &&
            !(this._handle && this._handle.exists)
        ) {
            this._playing = false;
        }
    }

    updateFlash(): void {
        if (this._flashDuration > 0) {
            const d = this._flashDuration--;
            this._flashColor[3] *= (d - 1) / d;
            for (const target of this._targets) {
                target.setBlendColor(this._flashColor);
            }
        }
    }

    isPlaying(): boolean {
        return this._playing;
    }

    setRotation(x: number, y: number, z: number): void {
        if (this._handle) {
            this._handle.setRotation(x, y, z);
        }
    }

    render(renderer: import("pixi.js").WebGLRenderer): void {
        if (this._targets.length > 0 && this._handle && this._handle.exists) {
            const gl = renderer.gl;
            const program = gl.getParameter(gl.CURRENT_PROGRAM);
            const viewport = gl.getParameter(gl.VIEWPORT) as [number, number, number, number];
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

    setProjectionMatrix(renderer: import("pixi.js").Renderer): void {
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

    setCameraMatrix(): void {
        // prettier-ignore
        Graphics.effekseer.setCameraMatrix([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, -10, 1
        ]);
    }

    setViewport(renderer: import("pixi.js").WebGLRenderer): void {
        const vw = this._viewportSize;
        const vh = this._viewportSize;
        const vx = this._animation.offsetX - vw / 2;
        const vy = this._animation.offsetY - vh / 2;
        const pos = this.targetPosition(renderer);
        renderer.gl.viewport(vx + pos.x, vy + pos.y, vw, vh);
    }

    targetPosition(renderer: import("pixi.js").WebGLRenderer): Point {
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

    targetSpritePosition(sprite: Sprite): import("pixi.js").Point {
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
    declare targetObjects: RMMZ.AnimationTarget[];

    declare _targets: Sprite[];
    declare _animation: RMMZ.DataAnimationMV;
    declare _mirror: boolean;
    declare _delay: number;
    declare _rate: number;
    declare _duration: number;
    declare _flashColor: RMMZ.Writable<RMMZ.Color>;
    declare _flashDuration: number;
    declare _screenFlashDuration: number;
    declare _hidingDuration: number;
    declare _hue1: number;
    declare _hue2: number;
    declare _bitmap1: Bitmap;
    declare _bitmap2: Bitmap;
    declare _cellSprites: Sprite[];
    declare _screenFlashSprite: ScreenSprite | null;
    declare z: number;

    constructor(...args: []) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
        this.initMembers();
    }

    initMembers(): void {
        this._targets = [];
        this._animation = null!;
        this._mirror = false;
        this._delay = 0;
        this._rate = 4;
        this._duration = 0;
        this._flashColor = [0, 0, 0, 0];
        this._flashDuration = 0;
        this._screenFlashDuration = 0;
        this._hidingDuration = 0;
        this._hue1 = 0;
        this._hue2 = 0;
        this._bitmap1 = null!;
        this._bitmap2 = null!;
        this._cellSprites = [];
        this._screenFlashSprite = null;
        this.z = 8;
    }

    // prettier-ignore
    setup(
        targets: Sprite[], animation: RMMZ.DataAnimationMV, mirror: boolean, delay: number
    ): void {
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

    setupRate(): void {
        this._rate = 4;
    }

    setupDuration(): void {
        this._duration = this._animation.frames.length * this._rate + 1;
    }

    update(): void {
        super.update();
        this.updateMain();
        this.updateFlash();
        this.updateScreenFlash();
        this.updateHiding();
    }

    updateFlash(): void {
        if (this._flashDuration > 0) {
            const d = this._flashDuration--;
            this._flashColor[3] *= (d - 1) / d;
            for (const target of this._targets) {
                target.setBlendColor(this._flashColor);
            }
        }
    }

    updateScreenFlash(): void {
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

    absoluteX(): number {
        let x = 0;
        let object: import("pixi.js").Container | null = this;
        while (object) {
            x += object.x;
            object = object.parent!;
        }
        return x;
    }

    absoluteY(): number {
        let y = 0;
        let object: import("pixi.js").Container | null = this;
        while (object) {
            y += object.y;
            object = object.parent!;
        }
        return y;
    }

    updateHiding(): void {
        if (this._hidingDuration > 0) {
            this._hidingDuration--;
            if (this._hidingDuration === 0) {
                for (const target of this._targets) {
                    target.show();
                }
            }
        }
    }

    isPlaying(): boolean {
        return this._duration > 0;
    }

    loadBitmaps(): void {
        const name1 = this._animation.animation1Name;
        const name2 = this._animation.animation2Name;
        this._hue1 = this._animation.animation1Hue;
        this._hue2 = this._animation.animation2Hue;
        this._bitmap1 = ImageManager.loadAnimation(name1);
        this._bitmap2 = ImageManager.loadAnimation(name2);
    }

    isReady(): boolean {
        return this._bitmap1 && this._bitmap1.isReady() && this._bitmap2 && this._bitmap2.isReady();
    }

    createCellSprites(): void {
        this._cellSprites = [];
        for (let i = 0; i < 16; i++) {
            const sprite = new Sprite();
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            this._cellSprites.push(sprite);
            this.addChild(sprite);
        }
    }

    createScreenFlashSprite(): void {
        this._screenFlashSprite = new ScreenSprite();
        this.addChild(this._screenFlashSprite);
    }

    updateMain(): void {
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

    updatePosition(): void {
        if (this._animation.position === 3) {
            this.x = this.parent!.width / 2;
            this.y = this.parent!.height / 2;
        } else if (this._targets.length > 0) {
            const target = this._targets[0];
            const parent = target.parent;
            const grandparent = parent ? parent.parent : null;
            this.x = target.x;
            this.y = target.y;
            if (this.parent === grandparent) {
                this.x += parent!.x;
                this.y += parent!.y;
            }
            if (this._animation.position === 0) {
                this.y -= target.height;
            } else if (this._animation.position === 1) {
                this.y -= target.height / 2;
            }
        }
    }

    updateFrame(): void {
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

    currentFrameIndex(): number {
        return this._animation.frames.length - Math.floor((this._duration + this._rate - 1) / this._rate);
    }

    updateAllCellSprites(frame: RMMZ.DataFrameMV): void {
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

    updateCellSprite(sprite: Sprite, cell: RMMZ.DataFrameCellMV): void {
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

    processTimingData(timing: RMMZ.DataTimingMV): void {
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

    startFlash(color: RMMZ.Color, duration: number): void {
        this._flashColor = color.clone();
        this._flashDuration = duration;
    }

    startScreenFlash(color: RMMZ.Color, duration: number): void {
        this._screenFlashDuration = duration;
        if (this._screenFlashSprite) {
            this._screenFlashSprite.setColor(color[0], color[1], color[2]);
            this._screenFlashSprite.opacity = color[3];
        }
    }

    startHiding(duration: number): void {
        this._hidingDuration = duration;
        for (const target of this._targets) {
            target.hide();
        }
    }

    onEnd(): void {
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
    constructor(...args: [type: 0 | 1]) {
        super(...args!);
    }

    initialize(type: 0 | 1): void;
    initialize(...args: any[]): void;
    initialize(type: 0 | 1): void {
        super.initialize();
        if (type === 0) {
            this.bitmap = this.battleback1Bitmap();
        } else {
            this.bitmap = this.battleback2Bitmap();
        }
    }

    adjustPosition(): void {
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

    battleback1Bitmap(): Bitmap {
        return ImageManager.loadBattleback1(this.battleback1Name());
    }

    battleback2Bitmap(): Bitmap {
        return ImageManager.loadBattleback2(this.battleback2Name());
    }

    battleback1Name(): string {
        if (BattleManager.isBattleTest()) {
            return $dataSystem.battleback1Name;
        } else if ($gameMap.battleback1Name() !== null) {
            return $gameMap.battleback1Name()!;
        } else if ($gameMap.isOverworld()) {
            return this.overworldBattleback1Name();
        } else {
            return "";
        }
    }

    battleback2Name(): string {
        if (BattleManager.isBattleTest()) {
            return $dataSystem.battleback2Name;
        } else if ($gameMap.battleback2Name() !== null) {
            return $gameMap.battleback2Name()!;
        } else if ($gameMap.isOverworld()) {
            return this.overworldBattleback2Name();
        } else {
            return "";
        }
    }

    overworldBattleback1Name(): string {
        if ($gamePlayer.isInVehicle()) {
            return this.shipBattleback1Name();
        } else {
            return this.normalBattleback1Name();
        }
    }

    overworldBattleback2Name(): string {
        if ($gamePlayer.isInVehicle()) {
            return this.shipBattleback2Name();
        } else {
            return this.normalBattleback2Name();
        }
    }

    normalBattleback1Name(): string {
        return (
            this.terrainBattleback1Name(this.autotileType(1)) ||
            this.terrainBattleback1Name(this.autotileType(0)) ||
            this.defaultBattleback1Name()
        );
    }

    normalBattleback2Name(): string {
        return (
            this.terrainBattleback2Name(this.autotileType(1)) ||
            this.terrainBattleback2Name(this.autotileType(0)) ||
            this.defaultBattleback2Name()
        );
    }

    terrainBattleback1Name(
        type: RMMZ.TerrainBattlebackType,
    ): "Wasteland" | "DirtField" | "Desert" | "Lava1" | "Lava2" | "Snowfield" | "Clouds" | "PoisonSwamp" | null {
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

    terrainBattleback2Name(
        type: RMMZ.TerrainBattlebackType,
    ): "Wasteland" | "Desert" | "Snowfield" | "Clouds" | "PoisonSwamp" | "Forest" | "Cliff" | "Lava" | undefined {
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

    defaultBattleback1Name(): string {
        return "Grassland";
    }

    defaultBattleback2Name(): string {
        return "Grassland";
    }

    shipBattleback1Name(): string {
        return "Ship";
    }

    shipBattleback2Name(): string {
        return "Ship";
    }

    autotileType(z: number): RMMZ.TerrainBattlebackType {
        return $gameMap.autotileType($gamePlayer.x, $gamePlayer.y, z) as RMMZ.TerrainBattlebackType;
    }
}

/**
 * The sprite for displaying a popup damage.
 */
class Sprite_Damage extends Sprite {
    declare children: RMMZ.DamageDigitSprite[];

    declare _duration: number;
    declare _flashColor: RMMZ.Writable<RMMZ.Color>;
    declare _flashDuration: number;
    declare _colorType: number;

    constructor(...args: any[]) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();

        this._duration = 90;
        this._flashColor = [0, 0, 0, 0];
        this._flashDuration = 0;
        this._colorType = 0;
    }

    destroy(options?: import("pixi.js").DestroyOptions): void {
        for (const child of this.children) {
            if (child.bitmap) {
                child.bitmap.destroy();
            }
        }
        super.destroy(options);
    }

    setup(target: RMMZ.ActionTarget): void {
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

    setupCriticalEffect(): void {
        this._flashColor = [255, 0, 0, 160];
        this._flashDuration = 60;
    }

    fontFace(): string {
        return $gameSystem.numberFontFace();
    }

    fontSize(): number {
        return $gameSystem.mainFontSize() + 4;
    }

    damageColor(): "#ffffff" | "#b9ffb5" | "#ffff90" | "#80b0ff" | "#808080" {
        return ColorManager.damageColor(this._colorType);
    }

    outlineColor(): string {
        return "rgba(0, 0, 0, 0.7)";
    }

    outlineWidth(): number {
        return 4;
    }

    createMiss(): void {
        const h = this.fontSize();
        const w = Math.floor(h * 3.0);
        const sprite = this.createChildSprite(w, h);
        sprite.bitmap.drawText("Miss", 0, 0, w, h, "center");
        sprite.dy = 0;
    }

    createDigits(value: number): void {
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

    createChildSprite(width: number, height: number): RMMZ.DamageDigitSprite {
        const sprite = new Sprite() as RMMZ.DamageDigitSprite;
        sprite.bitmap = this.createBitmap(width, height);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 1;
        sprite.y = -40;
        sprite.ry = sprite.y;
        this.addChild(sprite);
        return sprite;
    }

    createBitmap(width: number, height: number): Bitmap {
        const bitmap = new Bitmap(width, height);
        bitmap.fontFace = this.fontFace();
        bitmap.fontSize = this.fontSize();
        bitmap.textColor = this.damageColor();
        bitmap.outlineColor = this.outlineColor();
        bitmap.outlineWidth = this.outlineWidth();
        return bitmap;
    }

    update(): void {
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

    updateChild(sprite: RMMZ.DamageDigitSprite): void {
        sprite.dy += 0.5;
        sprite.ry += sprite.dy;
        if (sprite.ry >= 0) {
            sprite.ry = 0;
            sprite.dy *= -0.6;
        }
        sprite.y = Math.round(sprite.ry);
        sprite.setBlendColor(this._flashColor);
    }

    updateFlash(): void {
        if (this._flashDuration > 0) {
            const d = this._flashDuration--;
            this._flashColor[3] *= (d - 1) / d;
        }
    }

    updateOpacity(): void {
        if (this._duration < 10) {
            this.opacity = (255 * this._duration) / 10;
        }
    }

    isPlaying(): boolean {
        return this._duration > 0;
    }
}

/**
 * The sprite for displaying a status gauge.
 */
class Sprite_Gauge extends Sprite {
    declare _battler: RMMZ.ActionTarget | null;
    declare _statusType: string;
    declare _value: number;
    declare _maxValue: number;
    declare _targetValue: number;
    declare _targetMaxValue: number;
    declare _duration: number;
    declare _flashingCount: number;

    constructor(...args: []) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
        this.initMembers();
        this.createBitmap();
    }

    initMembers(): void {
        this._battler = null;
        this._statusType = "";
        this._value = NaN;
        this._maxValue = NaN;
        this._targetValue = NaN;
        this._targetMaxValue = NaN;
        this._duration = 0;
        this._flashingCount = 0;
    }

    destroy(options?: import("pixi.js").DestroyOptions): void {
        this.bitmap.destroy();
        super.destroy(options);
    }

    createBitmap(): void {
        const width = this.bitmapWidth();
        const height = this.bitmapHeight();
        this.bitmap = new Bitmap(width, height);
    }

    bitmapWidth(): number {
        return 128;
    }

    bitmapHeight(): number {
        return 32;
    }

    textHeight(): number {
        return 24;
    }

    gaugeHeight(): number {
        return 12;
    }

    gaugeX(): number {
        if (this._statusType === "time") {
            return 0;
        } else {
            return this.measureLabelWidth() + 6;
        }
    }

    labelY(): number {
        return 3;
    }

    labelFontFace(): string {
        return $gameSystem.mainFontFace();
    }

    labelFontSize(): number {
        return $gameSystem.mainFontSize() - 2;
    }

    valueFontFace(): string {
        return $gameSystem.numberFontFace();
    }

    valueFontSize(): number {
        return $gameSystem.mainFontSize() - 6;
    }

    setup(battler: RMMZ.ActionTarget, statusType: "time" | "hp" | "mp" | "tp"): void {
        this._battler = battler;
        this._statusType = statusType;
        this._value = this.currentValue();
        this._maxValue = this.currentMaxValue();
        this.updateBitmap();
    }

    update(): void {
        super.update();
        this.updateBitmap();
    }

    updateBitmap(): void {
        const value = this.currentValue();
        const maxValue = this.currentMaxValue();
        if (value !== this._targetValue || maxValue !== this._targetMaxValue) {
            this.updateTargetValue(value, maxValue);
        }
        this.updateGaugeAnimation();
        this.updateFlashing();
    }

    updateTargetValue(value: number, maxValue: number): void {
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

    smoothness(): 20 | 5 {
        return this._statusType === "time" ? 5 : 20;
    }

    updateGaugeAnimation(): void {
        if (this._duration > 0) {
            const d = this._duration;
            this._value = (this._value * (d - 1) + this._targetValue) / d;
            this._maxValue = (this._maxValue * (d - 1) + this._targetMaxValue) / d;
            this._duration--;
            this.redraw();
        }
    }

    updateFlashing(): void {
        if (this._statusType === "time") {
            this._flashingCount++;
            if (this._battler!.isInputting()) {
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

    flashingColor1(): RMMZ.Color {
        return [255, 255, 255, 64];
    }

    flashingColor2(): RMMZ.Color {
        return [0, 0, 255, 48];
    }

    isValid(): boolean {
        if (this._battler) {
            if (this._statusType === "tp" && !this._battler.isPreserveTp()) {
                return $gameParty.inBattle();
            } else {
                return true;
            }
        }
        return false;
    }

    currentValue(): number {
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

    currentMaxValue(): number {
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

    gaugeLabel(): string {
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

    gaugeBackColor(): string {
        return ColorManager.gaugeBackColor();
    }

    gaugeColor1(): string {
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

    gaugeColor2(): string {
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

    labelColor(): string {
        return ColorManager.systemColor();
    }

    labelOutlineColor(): string {
        return ColorManager.outlineColor();
    }

    labelOutlineWidth(): number {
        return 3;
    }

    valueColor(): string {
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

    valueOutlineColor(): string {
        return "rgba(0, 0, 0, 1)";
    }

    valueOutlineWidth(): number {
        return 2;
    }

    redraw(): void {
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

    drawGauge(): void {
        const gaugeX = this.gaugeX();
        const gaugeY = this.textHeight() - this.gaugeHeight();
        const gaugewidth = this.bitmapWidth() - gaugeX;
        const gaugeHeight = this.gaugeHeight();
        this.drawGaugeRect(gaugeX, gaugeY, gaugewidth, gaugeHeight);
    }

    drawGaugeRect(x: number, y: number, width: number, height: number): void {
        const rate = this.gaugeRate();
        const fillW = Math.floor((width - 2) * rate);
        const fillH = height - 2;
        const color0 = this.gaugeBackColor();
        const color1 = this.gaugeColor1();
        const color2 = this.gaugeColor2();
        this.bitmap.fillRect(x, y, width, height, color0);
        this.bitmap.gradientFillRect(x + 1, y + 1, fillW, fillH, color1, color2);
    }

    gaugeRate(): number {
        if (this.isValid()) {
            const value = this._value;
            const maxValue = this._maxValue;
            return maxValue > 0 ? value / maxValue : 0;
        } else {
            return 0;
        }
    }

    drawLabel(): void {
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

    setupLabelFont(): void {
        this.bitmap.fontFace = this.labelFontFace();
        this.bitmap.fontSize = this.labelFontSize();
        this.bitmap.textColor = this.labelColor();
        this.bitmap.outlineColor = this.labelOutlineColor();
        this.bitmap.outlineWidth = this.labelOutlineWidth();
    }

    measureLabelWidth(): number {
        this.setupLabelFont();
        const labels = [TextManager.hpA, TextManager.mpA, TextManager.tpA];
        const widths = labels.map((str) => this.bitmap.measureTextWidth(str));
        return Math.ceil(Math.max(...widths));
    }

    labelOpacity(): 255 | 160 {
        return this.isValid() ? 255 : 160;
    }

    drawValue(): void {
        const currentValue = this.currentValue();
        const width = this.bitmapWidth();
        const height = this.textHeight();
        this.setupValueFont();
        this.bitmap.drawText(currentValue, 0, 0, width, height, "right");
    }

    setupValueFont(): void {
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
    declare _battler: RMMZ.ActionTarget | null;
    declare _name: string;
    declare _textColor: string;

    constructor(...args: []) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
        this.initMembers();
        this.createBitmap();
    }

    initMembers(): void {
        this._battler = null;
        this._name = "";
        this._textColor = "";
    }

    destroy(options?: import("pixi.js").DestroyOptions): void {
        this.bitmap.destroy();
        super.destroy(options);
    }

    createBitmap(): void {
        const width = this.bitmapWidth();
        const height = this.bitmapHeight();
        this.bitmap = new Bitmap(width, height);
    }

    bitmapWidth(): number {
        return 128;
    }

    bitmapHeight(): number {
        return 24;
    }

    fontFace(): string {
        return $gameSystem.mainFontFace();
    }

    fontSize(): number {
        return $gameSystem.mainFontSize();
    }

    setup(battler: RMMZ.ActionTarget): void {
        this._battler = battler;
        this.updateBitmap();
    }

    update(): void {
        super.update();
        this.updateBitmap();
    }

    updateBitmap(): void {
        const name = this.actorName();
        const color = this.textColor();
        if (name !== this._name || color !== this._textColor) {
            this._name = name;
            this._textColor = color;
            this.redraw();
        }
    }

    actorName(): string {
        return this._battler ? this._battler.name() : "";
    }

    textColor(): string {
        return ColorManager.hpColor(this._battler);
    }

    outlineColor(): string {
        return ColorManager.outlineColor();
    }

    outlineWidth(): number {
        return 3;
    }

    redraw(): void {
        const name = this.actorName();
        const width = this.bitmapWidth();
        const height = this.bitmapHeight();
        this.setupFont();
        this.bitmap.clear();
        this.bitmap.drawText(name, 0, 0, width, height, "left");
    }

    setupFont(): void {
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
    declare _battler: RMMZ.ActionTarget | null;
    declare _iconIndex: number;
    declare _animationCount: number;
    declare _animationIndex: number;

    constructor(...args: []) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
        this.initMembers();
        this.loadBitmap();
    }

    initMembers(): void {
        this._battler = null;
        this._iconIndex = 0;
        this._animationCount = 0;
        this._animationIndex = 0;
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
    }

    loadBitmap(): void {
        this.bitmap = ImageManager.loadSystem("IconSet");
        this.setFrame(0, 0, 0, 0);
    }

    setup(battler: RMMZ.ActionTarget): void {
        if (this._battler !== battler) {
            this._battler = battler;
            this._animationCount = this.animationWait();
        }
    }

    update(): void {
        super.update();
        this._animationCount++;
        if (this._animationCount >= this.animationWait()) {
            this.updateIcon();
            this.updateFrame();
            this._animationCount = 0;
        }
    }

    animationWait(): number {
        return 40;
    }

    updateIcon(): void {
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

    shouldDisplay(): this is {
        _battler: RMMZ.ActionTarget;
    } {
        const battler = this._battler;
        return (battler && (battler.isActor() || battler.isAlive()))!;
    }

    updateFrame(): void {
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
    declare _battler: RMMZ.ActionTarget | null;
    declare _overlayIndex: number;
    declare _animationCount: number;
    declare _pattern: number;

    constructor(...args: []) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
        this.initMembers();
        this.loadBitmap();
    }

    initMembers(): void {
        this._battler = null;
        this._overlayIndex = 0;
        this._animationCount = 0;
        this._pattern = 0;
        this.anchor.x = 0.5;
        this.anchor.y = 1;
    }

    loadBitmap(): void {
        this.bitmap = ImageManager.loadSystem("States");
        this.setFrame(0, 0, 0, 0);
    }

    setup(battler: RMMZ.ActionTarget): void {
        this._battler = battler;
    }

    update(): void {
        super.update();
        this._animationCount++;
        if (this._animationCount >= this.animationWait()) {
            this.updatePattern();
            this.updateFrame();
            this._animationCount = 0;
        }
    }

    animationWait(): number {
        return 8;
    }

    updatePattern(): void {
        this._pattern++;
        this._pattern %= 8;
        if (this._battler) {
            this._overlayIndex = this._battler.stateOverlayIndex();
        } else {
            this._overlayIndex = 0;
        }
    }

    updateFrame(): void {
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
    declare _weaponImageId: number;
    declare _animationCount: number;
    declare _pattern: number;

    constructor(...args: []) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
        this.initMembers();
    }

    initMembers(): void {
        this._weaponImageId = 0;
        this._animationCount = 0;
        this._pattern = 0;
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this.x = -16;
    }

    setup(weaponImageId: number): void {
        this._weaponImageId = weaponImageId;
        this._animationCount = 0;
        this._pattern = 0;
        this.loadBitmap();
        this.updateFrame();
    }

    update(): void {
        super.update();
        this._animationCount++;
        if (this._animationCount >= this.animationWait()) {
            this.updatePattern();
            this.updateFrame();
            this._animationCount = 0;
        }
    }

    animationWait(): number {
        return 12;
    }

    updatePattern(): void {
        this._pattern++;
        if (this._pattern >= 3) {
            this._weaponImageId = 0;
        }
    }

    loadBitmap(): void {
        const pageId = Math.floor((this._weaponImageId - 1) / 12) + 1;
        if (pageId >= 1) {
            this.bitmap = ImageManager.loadSystem("Weapons" + pageId);
        } else {
            this.bitmap = ImageManager.loadSystem("");
        }
    }

    updateFrame(): void {
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

    isPlaying(): boolean {
        return this._weaponImageId > 0;
    }
}

/**
 * The sprite for displaying a balloon icon.
 */
class Sprite_Balloon extends Sprite {
    declare targetObject: Game_Character;

    declare _target: Sprite;
    declare _balloonId: RMMZ.BalloonIconID;
    declare _duration: number;
    declare z: number;

    constructor(...args: []) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
        this.initMembers();
        this.loadBitmap();
    }

    initMembers(): void {
        this._target = null!;
        this._balloonId = 0;
        this._duration = 0;
        this.anchor.x = 0.5;
        this.anchor.y = 1;
        this.z = 7;
    }

    loadBitmap(): void {
        this.bitmap = ImageManager.loadSystem("Balloon");
        this.setFrame(0, 0, 0, 0);
    }

    setup(targetSprite: Sprite, balloonId: RMMZ.BalloonIconID): void {
        this._target = targetSprite;
        this._balloonId = balloonId;
        this._duration = 8 * this.speed() + this.waitTime();
    }

    update(): void {
        super.update();
        if (this._duration > 0) {
            this._duration--;
            if (this._duration > 0) {
                this.updatePosition();
                this.updateFrame();
            }
        }
    }

    updatePosition(): void {
        this.x = this._target.x;
        this.y = this._target.y - this._target.height;
    }

    updateFrame(): void {
        const w = 48;
        const h = 48;
        const sx = this.frameIndex() * w;
        const sy = (this._balloonId - 1) * h;
        this.setFrame(sx, sy, w, h);
    }

    speed(): number {
        return 8;
    }

    waitTime(): number {
        return 12;
    }

    frameIndex(): number {
        const index = (this._duration - this.waitTime()) / this.speed();
        return 7 - Math.max(Math.floor(index), 0);
    }

    isPlaying(): boolean {
        return this._duration > 0;
    }
}

/**
 * The sprite for displaying a picture.
 */
class Sprite_Picture extends Sprite_Clickable {
    declare _pictureId: RMMZ.PictureID;
    declare _pictureName: string;

    constructor(...args: [pictureId: RMMZ.PictureID]) {
        super(...args);
    }

    initialize(pictureId: RMMZ.PictureID): void;
    initialize(...args: any[]): void;
    initialize(pictureId: RMMZ.PictureID): void {
        super.initialize();

        this._pictureId = pictureId;
        this._pictureName = "";
        this.update();
    }

    picture(): Game_Picture | null {
        return $gameScreen.picture(this._pictureId);
    }

    update(): void {
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

    updateBitmap(): void {
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
            this.bitmap = null!;
            this.visible = false;
        }
    }

    updateOrigin(): void {
        const picture = this.picture();
        if (picture!.origin() === 0) {
            this.anchor.x = 0;
            this.anchor.y = 0;
        } else {
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
        }
    }

    updatePosition(): void {
        const picture = this.picture();
        this.x = Math.round(picture!.x());
        this.y = Math.round(picture!.y());
    }

    updateScale(): void {
        const picture = this.picture();
        this.scale.x = picture!.scaleX() / 100;
        this.scale.y = picture!.scaleY() / 100;
    }

    updateTone(): void {
        const picture = this.picture();
        if (picture!.tone()) {
            this.setColorTone(picture!.tone()!);
        } else {
            this.setColorTone([0, 0, 0, 0]);
        }
    }

    updateOther(): void {
        const picture = this.picture();
        this.opacity = picture!.opacity();
        this.blendMode = picture!.blendMode();
        this.rotation = (picture!.angle() * Math.PI) / 180;
    }

    loadBitmap(): void {
        this.bitmap = ImageManager.loadPicture(this._pictureName);
    }
}

/**
 * The sprite for displaying the timer.
 */
class Sprite_Timer extends Sprite {
    declare _seconds: number;

    constructor(...args: []) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();

        this._seconds = 0;
        this.createBitmap();
        this.update();
    }

    destroy(options?: import("pixi.js").DestroyOptions): void {
        this.bitmap.destroy();
        super.destroy(options);
    }

    createBitmap(): void {
        this.bitmap = new Bitmap(96, 48);
        this.bitmap.fontFace = this.fontFace();
        this.bitmap.fontSize = this.fontSize();
        this.bitmap.outlineColor = ColorManager.outlineColor();
    }

    fontFace(): string {
        return $gameSystem.numberFontFace();
    }

    fontSize(): number {
        return $gameSystem.mainFontSize() + 8;
    }

    update(): void {
        super.update();
        this.updateBitmap();
        this.updatePosition();
        this.updateVisibility();
    }

    updateBitmap(): void {
        if (this._seconds !== $gameTimer.seconds()) {
            this._seconds = $gameTimer.seconds();
            this.redraw();
        }
    }

    redraw(): void {
        const text = this.timerText();
        const width = this.bitmap.width;
        const height = this.bitmap.height;
        this.bitmap.clear();
        this.bitmap.drawText(text, 0, 0, width, height, "center");
    }

    timerText(): string {
        const min = Math.floor(this._seconds / 60) % 60;
        const sec = this._seconds % 60;
        return min.padZero(2) + ":" + sec.padZero(2);
    }

    updatePosition(): void {
        this.x = (Graphics.width - this.bitmap.width) / 2;
        this.y = 0;
    }

    updateVisibility(): void {
        this.visible = $gameTimer.isWorking();
    }
}

/**
 * The sprite for displaying the destination place of the touch input.
 */
class Sprite_Destination extends Sprite {
    declare _frameCount: number;

    constructor(...args: []) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
        this.createBitmap();

        this._frameCount = 0;
    }

    destroy(options?: import("pixi.js").DestroyOptions): void {
        if (this.bitmap) {
            this.bitmap.destroy();
        }
        super.destroy(options);
    }

    update(): void {
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

    createBitmap(): void {
        const tileWidth = $gameMap.tileWidth();
        const tileHeight = $gameMap.tileHeight();
        this.bitmap = new Bitmap(tileWidth, tileHeight);
        this.bitmap.fillAll("white");
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.blendMode = 1;
    }

    updatePosition(): void {
        const tileWidth = $gameMap.tileWidth();
        const tileHeight = $gameMap.tileHeight();
        const x = $gameTemp.destinationX();
        const y = $gameTemp.destinationY();
        this.x = ($gameMap.adjustX(x!) + 0.5) * tileWidth;
        this.y = ($gameMap.adjustY(y!) + 0.5) * tileHeight;
    }

    updateAnimation(): void {
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
    declare _effectsContainer: import("pixi.js").Container;

    declare _animationSprites: (Sprite_Animation | Sprite_AnimationMV)[];
    declare _baseSprite: Sprite;
    declare _blackScreen: ScreenSprite;
    declare _baseColorFilter: ColorFilter;
    declare _pictureContainer: Sprite;
    declare _timerSprite: Sprite_Timer;
    declare _overallColorFilter: ColorFilter;

    constructor(..._extra: any[]);
    constructor(...args: []) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();
        this.setFrame(0, 0, Graphics.width, Graphics.height);
        this.loadSystemImages();
        this.createLowerLayer();
        this.createUpperLayer();

        this._animationSprites = [];
    }

    destroy(options?: import("pixi.js").DestroyOptions): void {
        this.removeAllAnimations();
        super.destroy(options);
    }

    loadSystemImages(): void {
        //
    }

    createLowerLayer(): void {
        this.createBaseSprite();
        this.createBaseFilters();
    }

    createUpperLayer(): void {
        this.createPictures();
        this.createTimer();
        this.createOverallFilters();
    }

    update(): void {
        super.update();
        this.updateBaseFilters();
        this.updateOverallFilters();
        this.updatePosition();
        this.updateAnimations();
    }

    createBaseSprite(): void {
        this._baseSprite = new Sprite();
        this._blackScreen = new ScreenSprite();
        this._blackScreen.opacity = 255;
        this.addChild(this._baseSprite);
        this._baseSprite.addChild(this._blackScreen);
    }

    createBaseFilters(): void {
        this._baseColorFilter = new ColorFilter();
        this._baseSprite.filters = [this._baseColorFilter];
    }

    createPictures(): void {
        const rect = this.pictureContainerRect();
        this._pictureContainer = new Sprite();
        this._pictureContainer.setFrame(rect.x, rect.y, rect.width, rect.height);
        for (let i = 1; i <= $gameScreen.maxPictures(); i++) {
            this._pictureContainer.addChild(new Sprite_Picture(i));
        }
        this.addChild(this._pictureContainer);
    }

    pictureContainerRect(): Rectangle {
        return new PIXI.Rectangle(0, 0, Graphics.width, Graphics.height);
    }

    createTimer(): void {
        this._timerSprite = new Sprite_Timer();
        this.addChild(this._timerSprite);
    }

    createOverallFilters(): void {
        this._overallColorFilter = new ColorFilter();
        this.filters = [this._overallColorFilter];
    }

    updateBaseFilters(): void {
        const filter = this._baseColorFilter;
        filter.setColorTone($gameScreen.tone());
    }

    updateOverallFilters(): void {
        const filter = this._overallColorFilter;
        filter.setBlendColor($gameScreen.flashColor());
        filter.setBrightness($gameScreen.brightness());
    }

    updatePosition(): void {
        const screen = $gameScreen;
        const scale = screen.zoomScale();
        this.scale.x = scale;
        this.scale.y = scale;
        this.x = Math.round(-screen.zoomX() * (scale - 1));
        this.y = Math.round(-screen.zoomY() * (scale - 1));
        this.x += Math.round(screen.shake());
    }

    findTargetSprite(_target: any): Sprite | null | undefined {
        return null;
    }

    updateAnimations(): void {
        for (const sprite of this._animationSprites) {
            if (!sprite.isPlaying()) {
                this.removeAnimation(sprite);
            }
        }
        this.processAnimationRequests();
    }

    processAnimationRequests(): void {
        for (;;) {
            const request = $gameTemp.retrieveAnimation();
            if (request) {
                this.createAnimation(request);
            } else {
                break;
            }
        }
    }

    createAnimation(request: RMMZ.AnimationRequest): void {
        const animation = $dataAnimations[request.animationId];
        const targets = request.targets;
        const mirror = request.mirror;
        let delay = this.animationBaseDelay();
        const nextDelay = this.animationNextDelay();
        if (this.isAnimationForEach(animation!)) {
            for (const target of targets) {
                this.createAnimationSprite([target], animation!, mirror, delay);
                delay += nextDelay;
            }
        } else {
            this.createAnimationSprite(targets, animation!, mirror, delay);
        }
    }

    // prettier-ignore

    createAnimationSprite(
        targets: RMMZ.AnimationTarget[], animation: RMMZ.DataAnimation | RMMZ.DataAnimationMV, mirror: boolean, delay: number
    ): void {
        const mv = this.isMVAnimation(animation);
        const sprite = new (mv ? Sprite_AnimationMV : Sprite_Animation)();
        const targetSprites = this.makeTargetSprites(targets);
        const baseDelay = this.animationBaseDelay();
        const previous = delay > baseDelay ? this.lastAnimationSprite() : null;
        if (this.animationShouldMirror(targets[0])) {
            mirror = !mirror;
        }
        sprite.targetObjects = targets;
        sprite.setup(targetSprites, (animation as RMMZ.DataAnimation & RMMZ.DataAnimationMV), mirror, delay, previous);
        this._effectsContainer.addChild(sprite);
        this._animationSprites.push(sprite);
    }

    isMVAnimation(animation: RMMZ.DataAnimation | RMMZ.DataAnimationMV): animation is RMMZ.DataAnimationMV {
        return !!(animation as RMMZ.DataAnimationMV).frames;
    }

    makeTargetSprites(targets: RMMZ.AnimationTarget[]): Sprite[] {
        const targetSprites = [];
        for (const target of targets) {
            const targetSprite = this.findTargetSprite(target);
            if (targetSprite) {
                targetSprites.push(targetSprite);
            }
        }
        return targetSprites;
    }

    lastAnimationSprite(): Sprite_Animation | Sprite_AnimationMV {
        return this._animationSprites[this._animationSprites.length - 1];
    }

    isAnimationForEach(animation: RMMZ.DataAnimation | RMMZ.DataAnimationMV): boolean {
        const mv = this.isMVAnimation(animation);
        return mv ? animation.position !== 3 : animation.displayType === 0;
    }

    animationBaseDelay(): number {
        return 8;
    }

    animationNextDelay(): number {
        return 12;
    }

    animationShouldMirror(
        target: RMMZ.AnimationTarget & {
            isActor?: () => boolean;
        },
    ): boolean {
        return (target && target.isActor && target.isActor())!;
    }

    removeAnimation(sprite: Sprite_Animation | Sprite_AnimationMV): void {
        this._animationSprites.remove(sprite);
        this._effectsContainer.removeChild(sprite);
        for (const target of sprite.targetObjects) {
            if (target.endAnimation) {
                target.endAnimation();
            }
        }
        sprite.destroy();
    }

    removeAllAnimations(): void {
        for (const sprite of this._animationSprites.clone()) {
            this.removeAnimation(sprite);
        }
    }

    isAnimationPlaying(): boolean {
        return this._animationSprites.length > 0;
    }
}

/**
 * The set of sprites on the map screen.
 */
class Spriteset_Map extends Spriteset_Base {
    declare _balloonSprites: Sprite_Balloon[];
    declare _parallax: TilingSprite;
    declare _effectsContainer: Tilemap;
    declare _tilemap: Tilemap;
    declare _tileset: any;
    declare _characterSprites: any[];
    declare _shadowSprite: Sprite;
    declare _destinationSprite: Sprite_Destination;
    declare _weather: Weather;
    declare _parallaxName: string;

    constructor(...args: any[]) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();

        this._balloonSprites = [];
    }

    destroy(options?: import("pixi.js").DestroyOptions): void {
        this.removeAllBalloons();
        super.destroy(options);
    }

    loadSystemImages(): void {
        super.loadSystemImages();
        ImageManager.loadSystem("Balloon");
        ImageManager.loadSystem("Shadow1");
    }

    createLowerLayer(): void {
        super.createLowerLayer();
        this.createParallax();
        this.createTilemap();
        this.createCharacters();
        this.createShadow();
        this.createDestination();
        this.createWeather();
    }

    update(): void {
        super.update();
        this.updateTileset();
        this.updateParallax();
        this.updateTilemap();
        this.updateShadow();
        this.updateWeather();
        this.updateAnimations();
        this.updateBalloons();
    }

    hideCharacters(): void {
        for (const sprite of this._characterSprites) {
            if (!sprite.isTile() && !sprite.isObjectCharacter()) {
                sprite.hide();
            }
        }
    }

    createParallax(): void {
        this._parallax = new TilingSprite();
        this._parallax.move(0, 0, Graphics.width, Graphics.height);
        this._baseSprite.addChild(this._parallax);
    }

    createTilemap(): void {
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

    loadTileset(): void {
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

    createCharacters(): void {
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

    createShadow(): void {
        this._shadowSprite = new Sprite();
        this._shadowSprite.bitmap = ImageManager.loadSystem("Shadow1");
        this._shadowSprite.anchor.x = 0.5;
        this._shadowSprite.anchor.y = 1;
        this._shadowSprite.z = 6;
        this._tilemap.addChild(this._shadowSprite);
    }

    createDestination(): void {
        this._destinationSprite = new Sprite_Destination();
        this._destinationSprite.z = 9;
        this._tilemap.addChild(this._destinationSprite);
    }

    createWeather(): void {
        this._weather = new Weather();
        this.addChild(this._weather);
    }

    updateTileset(): void {
        if (this._tileset !== $gameMap.tileset()) {
            this.loadTileset();
        }
    }

    updateParallax(): void {
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

    updateTilemap(): void {
        this._tilemap.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
        this._tilemap.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
    }

    updateShadow(): void {
        const airship = $gameMap.airship();
        this._shadowSprite.x = airship.shadowX();
        this._shadowSprite.y = airship.shadowY();
        this._shadowSprite.opacity = airship.shadowOpacity();
    }

    updateWeather(): void {
        this._weather.type = $gameScreen.weatherType();
        this._weather.power = $gameScreen.weatherPower();
        this._weather.origin.x = $gameMap.displayX() * $gameMap.tileWidth();
        this._weather.origin.y = $gameMap.displayY() * $gameMap.tileHeight();
    }

    updateBalloons(): void {
        for (const sprite of this._balloonSprites) {
            if (!sprite.isPlaying()) {
                this.removeBalloon(sprite);
            }
        }
        this.processBalloonRequests();
    }

    processBalloonRequests(): void {
        for (;;) {
            const request = $gameTemp.retrieveBalloon();
            if (request) {
                this.createBalloon(request);
            } else {
                break;
            }
        }
    }

    createBalloon(request: RMMZ.BalloonRequest): void {
        const targetSprite = this.findTargetSprite(request.target);
        if (targetSprite) {
            const sprite = new Sprite_Balloon();
            sprite.targetObject = request.target;
            sprite.setup(targetSprite!, request.balloonId);
            this._effectsContainer.addChild(sprite);
            this._balloonSprites.push(sprite);
        }
    }

    removeBalloon(sprite: Sprite_Balloon): void {
        this._balloonSprites.remove(sprite);
        this._effectsContainer.removeChild(sprite);
        if (sprite.targetObject.endBalloon) {
            sprite.targetObject.endBalloon();
        }
        sprite.destroy();
    }

    removeAllBalloons(): void {
        for (const sprite of this._balloonSprites.clone()) {
            this.removeBalloon(sprite);
        }
    }

    findTargetSprite(target: Game_Character): Sprite_Character | undefined {
        return this._characterSprites.find((sprite) => sprite.checkCharacter(target));
    }

    animationBaseDelay(): number {
        return 0;
    }
}

/**
 * The set of sprites on the battle screen.
 */
class Spriteset_Battle extends Spriteset_Base {
    declare _battlebackLocated: boolean;
    declare _backgroundFilter: import("pixi.js").BlurFilter;
    declare _backgroundSprite: Sprite;
    declare _back1Sprite: Sprite_Battleback;
    declare _back2Sprite: Sprite_Battleback;
    declare _battleField: Sprite;
    declare _effectsContainer: Sprite;
    declare _enemySprites: Sprite_Enemy[];
    declare _actorSprites: any[];

    constructor(...args: any[]) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize();

        this._battlebackLocated = false;
    }

    loadSystemImages(): void {
        super.loadSystemImages();
        ImageManager.loadSystem("Shadow2");
        ImageManager.loadSystem("Weapons1");
        ImageManager.loadSystem("Weapons2");
        ImageManager.loadSystem("Weapons3");
    }

    createLowerLayer(): void {
        super.createLowerLayer();
        this.createBackground();
        this.createBattleback();
        this.createBattleField();
        this.createEnemies();
        this.createActors();
    }

    createBackground(): void {
        this._backgroundFilter = new PIXI.BlurFilter();
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap()!;
        this._backgroundSprite.filters = [this._backgroundFilter];
        this._baseSprite.addChild(this._backgroundSprite);
    }

    createBattleback(): void {
        this._back1Sprite = new Sprite_Battleback(0);
        this._back2Sprite = new Sprite_Battleback(1);
        this._baseSprite.addChild(this._back1Sprite);
        this._baseSprite.addChild(this._back2Sprite);
    }

    createBattleField(): void {
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

    battleFieldOffsetY(): number {
        return 24;
    }

    update(): void {
        super.update();
        this.updateActors();
        this.updateBattleback();
        this.updateAnimations();
    }

    updateBattleback(): void {
        if (!this._battlebackLocated) {
            this._back1Sprite.adjustPosition();
            this._back2Sprite.adjustPosition();
            this._battlebackLocated = true;
        }
    }

    createEnemies(): void {
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

    compareEnemySprite(a: Sprite_Enemy, b: Sprite_Enemy): number {
        if (a.y !== b.y) {
            return a.y - b.y;
        } else {
            return b.spriteId - a.spriteId;
        }
    }

    createActors(): void {
        this._actorSprites = [];
        if ($gameSystem.isSideView()) {
            for (let i = 0; i < $gameParty.maxBattleMembers(); i++) {
                const sprite = new Sprite_Actor();
                this._actorSprites.push(sprite);
                this._battleField.addChild(sprite);
            }
        }
    }

    updateActors(): void {
        const members = $gameParty.battleMembers();
        for (let i = 0; i < this._actorSprites.length; i++) {
            this._actorSprites[i].setBattler(members[i]);
        }
    }

    findTargetSprite(target: RMMZ.ActionTarget): Sprite | undefined {
        return this.battlerSprites().find((sprite) => sprite.checkBattler(target));
    }

    battlerSprites(): (Sprite_Actor | Sprite_Enemy)[] {
        return this._enemySprites.concat(this._actorSprites);
    }

    isEffecting(): boolean {
        return this.battlerSprites().some((sprite) => sprite.isEffecting());
    }

    isAnyoneMoving(): boolean {
        return this.battlerSprites().some((sprite) => sprite.isMoving());
    }

    isBusy(): boolean {
        return this.isAnimationPlaying() || this.isAnyoneMoving();
    }
}
