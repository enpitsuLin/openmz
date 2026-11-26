// rmmz_windows.js v1.10.0

/**
 * The superclass of all windows within the game.
 */
class Window_Base extends Window {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize();
        this.loadWindowskin();
        this.checkRectObject(rect);
        this.move(rect.x, rect.y, rect.width, rect.height);
        this.updatePadding();
        this.updateBackOpacity();
        this.updateTone();
        this.createContents();
        /** @type {boolean} */
        this._opening = false;
        /** @type {boolean} */
        this._closing = false;
        /** @type {Sprite | null} */
        this._dimmerSprite = null;
    }

    /**
     * @param {import("pixi.js").DestroyOptions} [options]
     * @returns {void}
     */
    destroy(options) {
        this.destroyContents();
        if (this._dimmerSprite) {
            this._dimmerSprite.bitmap.destroy();
        }
        super.destroy(options);
    }

    /**
     * @param {Rectangle} rect
     * @returns {void}
     */
    checkRectObject(rect) {
        if (typeof rect !== "object" || !("x" in rect)) {
            // Probably MV plugin is used
            throw new Error("Argument must be a Rectangle");
        }
    }

    /** @returns {number} */
    lineHeight() {
        return 36;
    }

    /** @returns {number} */
    itemWidth() {
        return this.innerWidth;
    }

    /** @returns {number} */
    itemHeight() {
        return this.lineHeight();
    }

    /** @returns {number} */
    itemPadding() {
        return 8;
    }

    /** @returns {Rectangle} */
    baseTextRect() {
        const rect = new PIXI.Rectangle(0, 0, this.innerWidth, this.innerHeight);
        rect.pad(-this.itemPadding(), 0);
        return rect;
    }

    /** @returns {void} */
    loadWindowskin() {
        this.windowskin = ImageManager.loadSystem("Window");
    }

    /** @returns {void} */
    updatePadding() {
        this.padding = $gameSystem.windowPadding();
    }

    /** @returns {void} */
    updateBackOpacity() {
        this.backOpacity = $gameSystem.windowOpacity();
    }

    /**
     * @param {number} numLines
     * @returns {number}
     */
    fittingHeight(numLines) {
        return numLines * this.itemHeight() + $gameSystem.windowPadding() * 2;
    }

    /** @returns {void} */
    updateTone() {
        const tone = $gameSystem.windowTone();
        this.setTone(tone[0], tone[1], tone[2]);
    }

    /** @returns {void} */
    createContents() {
        const width = this.contentsWidth();
        const height = this.contentsHeight();
        this.destroyContents();
        this.contents = new Bitmap(width, height);
        this.contentsBack = new Bitmap(width, height);
        this.resetFontSettings();
    }

    /** @returns {void} */
    destroyContents() {
        if (this.contents) {
            this.contents.destroy();
        }
        if (this.contentsBack) {
            this.contentsBack.destroy();
        }
    }

    /** @returns {number} */
    contentsWidth() {
        return this.innerWidth;
    }

    /** @returns {number} */
    contentsHeight() {
        return this.innerHeight;
    }

    /** @returns {void} */
    resetFontSettings() {
        this.contents.fontFace = $gameSystem.mainFontFace();
        this.contents.fontSize = $gameSystem.mainFontSize();
        this.resetTextColor();
    }

    /** @returns {void} */
    resetTextColor() {
        this.changeTextColor(ColorManager.normalColor());
        this.changeOutlineColor(ColorManager.outlineColor());
    }

    /** @returns {void} */
    update() {
        super.update();
        this.updateTone();
        this.updateOpen();
        this.updateClose();
        this.updateBackgroundDimmer();
    }

    /** @returns {void} */
    updateOpen() {
        if (this._opening) {
            this.openness += 32;
            if (this.isOpen()) {
                this._opening = false;
            }
        }
    }

    /** @returns {void} */
    updateClose() {
        if (this._closing) {
            this.openness -= 32;
            if (this.isClosed()) {
                this._closing = false;
            }
        }
    }

    /** @returns {void} */
    open() {
        if (!this.isOpen()) {
            this._opening = true;
        }
        this._closing = false;
    }

    /** @returns {void} */
    close() {
        if (!this.isClosed()) {
            this._closing = true;
        }
        this._opening = false;
    }

    /** @returns {boolean} */
    isOpening() {
        return this._opening;
    }

    /** @returns {boolean} */
    isClosing() {
        return this._closing;
    }

    /** @returns {void} */
    show() {
        this.visible = true;
    }

    /** @returns {void} */
    hide() {
        this.visible = false;
    }

    /** @returns {void} */
    activate() {
        this.active = true;
    }

    /** @returns {void} */
    deactivate() {
        this.active = false;
    }

    /** @returns {string} */
    systemColor() {
        return ColorManager.systemColor();
    }

    /** @returns {number} */
    translucentOpacity() {
        return 160;
    }

    /**
     * @param {string} color
     * @returns {void}
     */
    changeTextColor(color) {
        this.contents.textColor = color;
    }

    /**
     * @param {string} color
     * @returns {void}
     */
    changeOutlineColor(color) {
        this.contents.outlineColor = color;
    }

    /**
     * @param {boolean | number} enabled
     * @returns {void}
     */
    changePaintOpacity(enabled) {
        this.contents.paintOpacity = enabled ? 255 : this.translucentOpacity();
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @returns {void}
     */
    drawRect(x, y, width, height) {
        const outlineColor = this.contents.outlineColor;
        const mainColor = this.contents.textColor;
        this.contents.fillRect(x, y, width, height, outlineColor);
        this.contents.fillRect(x + 1, y + 1, width - 2, height - 2, mainColor);
    }

    /**
     * @param {string | number} text
     * @param {number} x
     * @param {number} y
     * @param {number} [maxWidth]
     * @param {CanvasTextAlign} [align]
     * @returns {void}
     */
    drawText(text, x, y, maxWidth, align) {
        this.contents.drawText(text, x, y, maxWidth, this.lineHeight(), align);
    }

    /**
     * @param {string} text
     * @returns {number}
     */
    textWidth(text) {
        return this.contents.measureTextWidth(text);
    }

    /**
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @returns {number}
     */
    drawTextEx(text, x, y, width) {
        this.resetFontSettings();
        const textState = this.createTextState(text, x, y, width);
        this.processAllText(textState);
        return textState.outputWidth;
    }

    /**
     * @param {string} text
     * @returns {{ width: number; height: number; }}
     */
    textSizeEx(text) {
        this.resetFontSettings();
        const textState = this.createTextState(text, 0, 0, 0);
        textState.drawing = false;
        this.processAllText(textState);
        return { width: textState.outputWidth, height: textState.outputHeight };
    }

    /**
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @returns {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }}
     */
    createTextState(text, x, y, width) {
        const rtl = Utils.containsArabic(text);
        const textState = {};
        textState.text = this.convertEscapeCharacters(text);
        textState.index = 0;
        textState.x = rtl ? x + width : x;
        textState.y = y;
        textState.width = width;
        textState.height = this.calcTextHeight(textState);
        textState.startX = textState.x;
        textState.startY = textState.y;
        textState.rtl = rtl;
        textState.buffer = this.createTextBuffer(rtl);
        textState.drawing = true;
        textState.outputWidth = 0;
        textState.outputHeight = 0;
        return textState;
    }

    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {void}
     */
    processAllText(textState) {
        while (textState.index < textState.text.length) {
            this.processCharacter(textState);
        }
        this.flushTextState(textState);
    }

    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {void}
     */
    flushTextState(textState) {
        const text = textState.buffer;
        const rtl = textState.rtl;
        const width = this.textWidth(text);
        const height = textState.height;
        const x = rtl ? textState.x - width : textState.x;
        const y = textState.y;
        if (textState.drawing) {
            this.contents.drawText(text, x, y, width, height);
        }
        textState.x += rtl ? -width : width;
        textState.buffer = this.createTextBuffer(rtl);
        const outputWidth = Math.abs(textState.x - textState.startX);
        if (textState.outputWidth < outputWidth) {
            textState.outputWidth = outputWidth;
        }
        textState.outputHeight = y - textState.startY + height;
    }

    /**
     * @param {boolean} rtl
     * @returns {"" | "\u202B"}
     */
    createTextBuffer(rtl) {
        // U+202B: RIGHT-TO-LEFT EMBEDDING
        return rtl ? "\u202B" : "";
    }

    /**
     * @param {string} text
     * @returns {string}
     */
    convertEscapeCharacters(text) {
        /* eslint no-control-regex: 0 */
        text = text.replace(/\\/g, "\x1b");
        text = text.replace(/\x1b\x1b/g, "\\");
        while (text.match(/\x1bV\[(\d+)\]/gi)) {
            text = text.replace(/\x1bV\[(\d+)\]/gi, (_, p1) =>
                $gameVariables.value(parseInt(p1))
            );
        }
        text = text.replace(/\x1bN\[(\d+)\]/gi, (_, p1) =>
            this.actorName(parseInt(p1))
        );
        text = text.replace(/\x1bP\[(\d+)\]/gi, (_, p1) =>
            this.partyMemberName(parseInt(p1))
        );
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    }

    /**
     * @param {RMMZ.ActorID} n
     * @returns {string}
     */
    actorName(n) {
        const actor = n >= 1 ? $gameActors.actor(n) : null;
        return actor ? actor.name() : "";
    }

    /**
     * @param {number} n
     * @returns {string}
     */
    partyMemberName(n) {
        const actor = n >= 1 ? $gameParty.members()[n - 1] : null;
        return actor ? actor.name() : "";
    }

    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {void}
     */
    processCharacter(textState) {
        const c = textState.text[textState.index++];
        if (c.charCodeAt(0) < 0x20) {
            this.flushTextState(textState);
            this.processControlCharacter(textState, c);
        } else {
            textState.buffer += c;
        }
    }

    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @param {string} c
     * @returns {void}
     */
    processControlCharacter(textState, c) {
        if (c === "\n") {
            this.processNewLine(textState);
        }
        if (c === "\x1b") {
            const code = this.obtainEscapeCode(textState);
            this.processEscapeCharacter(code, textState);
        }
    }

    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {void}
     */
    processNewLine(textState) {
        textState.x = textState.startX;
        textState.y += textState.height;
        textState.height = this.calcTextHeight(textState);
    }

    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {string}
     */
    obtainEscapeCode(textState) {
        const regExp = /^[$.|^!><{}\\]|^[A-Z]+/i;
        const arr = regExp.exec(textState.text.slice(textState.index));
        if (arr) {
            textState.index += arr[0].length;
            return arr[0].toUpperCase();
        } else {
            return "";
        }
    }

    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {number}
     */
    obtainEscapeParam(textState) {
        const regExp = /^\[\d+\]/;
        const arr = regExp.exec(textState.text.slice(textState.index));
        if (arr) {
            textState.index += arr[0].length;
            return parseInt(arr[0].slice(1));
        } else {
            return "";
        }
    }

    /**
     * @param {"C" | "I" | "PX" | "PY" | "FS" | "{" | "}"} code
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {void}
     */
    processEscapeCharacter(code, textState) {
        switch (code) {
            case "C":
                this.processColorChange(this.obtainEscapeParam(textState));
                break;
            case "I":
                this.processDrawIcon(this.obtainEscapeParam(textState), textState);
                break;
            case "PX":
                textState.x = this.obtainEscapeParam(textState);
                break;
            case "PY":
                textState.y = this.obtainEscapeParam(textState);
                break;
            case "FS":
                this.contents.fontSize = this.obtainEscapeParam(textState);
                break;
            case "{":
                this.makeFontBigger();
                break;
            case "}":
                this.makeFontSmaller();
                break;
        }
    }

    /**
     * @param {number} colorIndex
     * @returns {void}
     */
    processColorChange(colorIndex) {
        this.changeTextColor(ColorManager.textColor(colorIndex));
    }

    /**
     * @param {number} iconIndex
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {void}
     */
    processDrawIcon(iconIndex, textState) {
        const deltaX = ImageManager.standardIconWidth - ImageManager.iconWidth;
        const deltaY = ImageManager.standardIconHeight - ImageManager.iconHeight;
        if (textState.drawing) {
            const x = textState.x + deltaX / 2 + 2;
            const y = textState.y + deltaY / 2 + 2;
            this.drawIcon(iconIndex, x, y);
        }
        textState.x += ImageManager.standardIconWidth + 4;
    }

    /** @returns {void} */
    makeFontBigger() {
        if (this.contents.fontSize <= 96) {
            this.contents.fontSize += 12;
        }
    }

    /** @returns {void} */
    makeFontSmaller() {
        if (this.contents.fontSize >= 24) {
            this.contents.fontSize -= 12;
        }
    }

    /**
     * @param {Partial<{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }> & { text: string; }} textState
     * @returns {number}
     */
    calcTextHeight(textState) {
        const lineSpacing = this.lineHeight() - $gameSystem.mainFontSize();
        const lastFontSize = this.contents.fontSize;
        const lines = textState.text.slice(textState.index).split("\n");
        const textHeight = this.maxFontSizeInLine(lines[0]) + lineSpacing;
        this.contents.fontSize = lastFontSize;
        return textHeight;
    }

    /**
     * @param {string} line
     * @returns {number}
     */
    maxFontSizeInLine(line) {
        let maxFontSize = this.contents.fontSize;
        const regExp = /\x1b({|}|FS)(\[(\d+)])?/gi;
        for (;;) {
            const array = regExp.exec(line);
            if (!array) {
                break;
            }
            const code = String(array[1]).toUpperCase();
            if (code === "{") {
                this.makeFontBigger();
            } else if (code === "}") {
                this.makeFontSmaller();
            } else if (code === "FS") {
                this.contents.fontSize = parseInt(array[3]);
            }
            if (this.contents.fontSize > maxFontSize) {
                maxFontSize = this.contents.fontSize;
            }
        }
        return maxFontSize;
    }

    /**
     * @param {number} iconIndex
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    drawIcon(iconIndex, x, y) {
        const bitmap = ImageManager.loadSystem("IconSet");
        const pw = ImageManager.iconWidth;
        const ph = ImageManager.iconHeight;
        const sx = (iconIndex % 16) * pw;
        const sy = Math.floor(iconIndex / 16) * ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, Math.floor(x), Math.floor(y));
    }

    // prettier-ignore
    /**
     * @param {string} faceName
     * @param {number} faceIndex
     * @param {number} x
     * @param {number} y
     * @param {number} [width]
     * @param {number} [height]
     * @returns {void}
     */
    drawFace(
        faceName, faceIndex, x, y, width, height
    ) {
        width = width || ImageManager.standardFaceWidth;
        height = height || ImageManager.standardFaceHeight;
        const bitmap = ImageManager.loadFace(faceName);
        const pw = ImageManager.faceWidth;
        const ph = ImageManager.faceHeight;
        const sw = Math.min(width, pw);
        const sh = Math.min(height, ph);
        const dx = Math.floor(x + Math.max(width - pw, 0) / 2);
        const dy = Math.floor(y + Math.max(height - ph, 0) / 2);
        const sx = Math.floor((faceIndex % 4) * pw + (pw - sw) / 2);
        const sy = Math.floor(Math.floor(faceIndex / 4) * ph + (ph - sh) / 2);
        this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
    }

    // prettier-ignore
    /**
     * @param {string} characterName
     * @param {number} characterIndex
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    drawCharacter(
        characterName, characterIndex, x, y
    ) {
        const bitmap = ImageManager.loadCharacter(characterName);
        const big = ImageManager.isBigCharacter(characterName);
        const pw = bitmap.width / (big ? 3 : 12);
        const ph = bitmap.height / (big ? 4 : 8);
        const n = big ? 0: characterIndex;
        const sx = ((n % 4) * 3 + 1) * pw;
        const sy = Math.floor(n / 4) * 4 * ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, x - pw / 2, y - ph);
    }

    /**
     * @param {RMMZ.DataItemBase | null} item
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @returns {void}
     */
    drawItemName(item, x, y, width) {
        if (item) {
            const iconY = y + (this.lineHeight() - ImageManager.iconHeight) / 2;
            const delta = ImageManager.standardIconWidth - ImageManager.iconWidth;
            const textMargin = ImageManager.standardIconWidth + 4;
            const itemWidth = Math.max(0, width - textMargin);
            this.resetTextColor();
            this.drawIcon(item.iconIndex, x + delta / 2, iconY);
            this.drawText(item.name, x + textMargin, y, itemWidth);
        }
    }

    /**
     * @param {number} value
     * @param {string} unit
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @returns {void}
     */
    drawCurrencyValue(value, unit, x, y, width) {
        const unitWidth = Math.min(80, this.textWidth(unit));
        this.resetTextColor();
        this.drawText(value, x, y, width - unitWidth - 6, "right");
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(unit, x + width - unitWidth, y, unitWidth, "right");
    }

    /**
     * @param {RMMZ.TextWindowBackgroundType} type
     * @returns {void}
     */
    setBackgroundType(type) {
        if (type === 0) {
            this.opacity = 255;
        } else {
            this.opacity = 0;
        }
        if (type === 1) {
            this.showBackgroundDimmer();
        } else {
            this.hideBackgroundDimmer();
        }
    }

    /** @returns {void} */
    showBackgroundDimmer() {
        if (!this._dimmerSprite) {
            this.createDimmerSprite();
        }
        const bitmap = this._dimmerSprite.bitmap;
        if (bitmap.width !== this.width || bitmap.height !== this.height) {
            this.refreshDimmerBitmap();
        }
        this._dimmerSprite.visible = true;
        this.updateBackgroundDimmer();
    }

    /** @returns {void} */
    createDimmerSprite() {
        this._dimmerSprite = new Sprite();
        this._dimmerSprite.bitmap = new Bitmap(0, 0);
        this._dimmerSprite.x = -4;
        this.addChildToBack(this._dimmerSprite);
    }

    /** @returns {void} */
    hideBackgroundDimmer() {
        if (this._dimmerSprite) {
            this._dimmerSprite.visible = false;
        }
    }

    /** @returns {void} */
    updateBackgroundDimmer() {
        if (this._dimmerSprite) {
            this._dimmerSprite.opacity = this.openness;
        }
    }

    /** @returns {void} */
    refreshDimmerBitmap() {
        if (this._dimmerSprite) {
            const bitmap = this._dimmerSprite.bitmap;
            const w = this.width > 0 ? this.width + 8 : 0;
            const h = this.height;
            const m = this.padding;
            const c1 = ColorManager.dimColor1();
            const c2 = ColorManager.dimColor2();
            bitmap.resize(w, h);
            bitmap.gradientFillRect(0, 0, w, m, c2, c1, true);
            bitmap.fillRect(0, m, w, h - m * 2, c1);
            bitmap.gradientFillRect(0, h - m, w, m, c1, c2, true);
            this._dimmerSprite.setFrame(0, 0, w, h);
        }
    }

    /** @returns {void} */
    playCursorSound() {
        SoundManager.playCursor();
    }

    /** @returns {void} */
    playOkSound() {
        SoundManager.playOk();
    }

    /** @returns {void} */
    playBuzzerSound() {
        SoundManager.playBuzzer();
    }
}

/**
 * The window class with scroll functions.
 */
class Window_Scrollable extends Window_Base {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        /** @type {number} */
        this._scrollX = 0;
        /** @type {number} */
        this._scrollY = 0;
        /** @type {number} */
        this._scrollBaseX = 0;
        /** @type {number} */
        this._scrollBaseY = 0;
        this.clearScrollStatus();
    }

    /** @returns {void} */
    clearScrollStatus() {
        this._scrollTargetX = 0;
        this._scrollTargetY = 0;
        this._scrollDuration = 0;
        this._scrollAccelX = 0;
        this._scrollAccelY = 0;
        this._scrollTouching = false;
        this._scrollLastTouchX = 0;
        this._scrollLastTouchY = 0;
        this._scrollLastCursorVisible = false;
    }

    /** @returns {number} */
    scrollX() {
        return this._scrollX;
    }

    /** @returns {number} */
    scrollY() {
        return this._scrollY;
    }

    /** @returns {number} */
    scrollBaseX() {
        return this._scrollBaseX;
    }

    /** @returns {number} */
    scrollBaseY() {
        return this._scrollBaseY;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    scrollTo(x, y) {
        const scrollX = x.clamp(0, this.maxScrollX());
        const scrollY = y.clamp(0, this.maxScrollY());
        if (this._scrollX !== scrollX || this._scrollY !== scrollY) {
            this._scrollX = scrollX;
            this._scrollY = scrollY;
            this.updateOrigin();
        }
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    scrollBy(x, y) {
        this.scrollTo(this._scrollX + x, this._scrollY + y);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    smoothScrollTo(x, y) {
        this._scrollTargetX = x.clamp(0, this.maxScrollX());
        this._scrollTargetY = y.clamp(0, this.maxScrollY());
        this._scrollDuration = Input.keyRepeatInterval;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    smoothScrollBy(x, y) {
        if (this._scrollDuration === 0) {
            this._scrollTargetX = this.scrollX();
            this._scrollTargetY = this.scrollY();
        }
        this.smoothScrollTo(this._scrollTargetX + x, this._scrollTargetY + y);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    setScrollAccel(x, y) {
        this._scrollAccelX = x;
        this._scrollAccelY = y;
    }

    /** @returns {number} */
    overallWidth() {
        return this.innerWidth;
    }

    /** @returns {number} */
    overallHeight() {
        return this.innerHeight;
    }

    /** @returns {number} */
    maxScrollX() {
        return Math.max(0, this.overallWidth() - this.innerWidth);
    }

    /** @returns {number} */
    maxScrollY() {
        return Math.max(0, this.overallHeight() - this.innerHeight);
    }

    /** @returns {number} */
    scrollBlockWidth() {
        return this.itemWidth();
    }

    /** @returns {number} */
    scrollBlockHeight() {
        return this.itemHeight();
    }

    /**
     * @param {number} n
     * @returns {void}
     */
    smoothScrollDown(n) {
        this.smoothScrollBy(0, this.itemHeight() * n);
    }

    /**
     * @param {number} n
     * @returns {void}
     */
    smoothScrollUp(n) {
        this.smoothScrollBy(0, -this.itemHeight() * n);
    }

    /** @returns {void} */
    update() {
        super.update();
        this.processWheelScroll();
        this.processTouchScroll();
        this.updateSmoothScroll();
        this.updateScrollAccel();
        this.updateArrows();
        this.updateOrigin();
    }

    /** @returns {void} */
    processWheelScroll() {
        if (this.isWheelScrollEnabled() && this.isTouchedInsideFrame()) {
            const threshold = 20;
            if (TouchInput.wheelY >= threshold) {
                this.smoothScrollDown(1);
            }
            if (TouchInput.wheelY <= -threshold) {
                this.smoothScrollUp(1);
            }
        }
    }

    /** @returns {void} */
    processTouchScroll() {
        if (this.isTouchScrollEnabled()) {
            if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
                this.onTouchScrollStart();
            }
            if (this._scrollTouching) {
                if (TouchInput.isReleased()) {
                    this.onTouchScrollEnd();
                } else if (TouchInput.isMoved()) {
                    this.onTouchScroll();
                }
            }
        }
    }

    /** @returns {boolean} */
    isWheelScrollEnabled() {
        return this.isScrollEnabled();
    }

    /** @returns {boolean} */
    isTouchScrollEnabled() {
        return this.isScrollEnabled();
    }

    /** @returns {boolean} */
    isScrollEnabled() {
        return true;
    }

    /** @returns {boolean} */
    isTouchedInsideFrame() {
        const touchPos = new PIXI.Point(TouchInput.x, TouchInput.y);
        const localPos = this.toLocal(touchPos);
        return this.innerRect.contains(localPos.x, localPos.y);
    }

    /** @returns {void} */
    onTouchScrollStart() {
        this._scrollTouching = true;
        this._scrollLastTouchX = TouchInput.x;
        this._scrollLastTouchY = TouchInput.y;
        this._scrollLastCursorVisible = this.cursorVisible;
        this.setScrollAccel(0, 0);
    }

    /** @returns {void} */
    onTouchScroll() {
        const accelX = this._scrollLastTouchX - TouchInput.x;
        const accelY = this._scrollLastTouchY - TouchInput.y;
        this.setScrollAccel(accelX, accelY);
        this._scrollLastTouchX = TouchInput.x;
        this._scrollLastTouchY = TouchInput.y;
        this.cursorVisible = false;
    }

    /** @returns {void} */
    onTouchScrollEnd() {
        this._scrollTouching = false;
        this.cursorVisible = this._scrollLastCursorVisible;
    }

    /** @returns {void} */
    updateSmoothScroll() {
        if (this._scrollDuration > 0) {
            const d = this._scrollDuration;
            const deltaX = (this._scrollTargetX - this._scrollX) / d;
            const deltaY = (this._scrollTargetY - this._scrollY) / d;
            this.scrollBy(deltaX, deltaY);
            this._scrollDuration--;
        }
    }

    /** @returns {void} */
    updateScrollAccel() {
        if (this._scrollAccelX !== 0 || this._scrollAccelY !== 0) {
            this.scrollBy(this._scrollAccelX, this._scrollAccelY);
            this._scrollAccelX *= 0.92;
            this._scrollAccelY *= 0.92;
            if (Math.abs(this._scrollAccelX) < 1) {
                this._scrollAccelX = 0;
            }
            if (Math.abs(this._scrollAccelY) < 1) {
                this._scrollAccelY = 0;
            }
        }
    }

    /** @returns {void} */
    updateArrows() {
        this.downArrowVisible = this._scrollY < this.maxScrollY();
        this.upArrowVisible = this._scrollY > 0;
    }

    /** @returns {void} */
    updateOrigin() {
        const blockWidth = this.scrollBlockWidth() || 1;
        const blockHeight = this.scrollBlockHeight() || 1;
        const baseX = this._scrollX - (this._scrollX % blockWidth);
        const baseY = this._scrollY - (this._scrollY % blockHeight);
        if (baseX !== this._scrollBaseX || baseY !== this._scrollBaseY) {
            this.updateScrollBase(baseX, baseY);
            this.paint();
        }
        this.origin.x = this._scrollX % blockWidth;
        this.origin.y = this._scrollY % blockHeight;
    }

    /**
     * @param {number} baseX
     * @param {number} baseY
     * @returns {void}
     */
    updateScrollBase(baseX, baseY) {
        const deltaX = baseX - this._scrollBaseX;
        const deltaY = baseY - this._scrollBaseY;
        this._scrollBaseX = baseX;
        this._scrollBaseY = baseY;
        this.moveCursorBy(-deltaX, -deltaY);
        this.moveInnerChildrenBy(-deltaX, -deltaY);
    }

    /** @returns {void} */
    paint() {
        // to be overridden
    }
}

/**
 * The window class with cursor movement functions.
 */
class Window_Selectable extends Window_Scrollable {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        /** @type {number} */
        this._index = -1;
        /** @type {boolean} */
        this._cursorFixed = false;
        /** @type {boolean} */
        this._cursorAll = false;
        /** @type {Window_Help | null} */
        this._helpWindow = null;
        /** @type {Record<string, () => void>} */
        this._handlers = {};
        /** @type {boolean} */
        this._doubleTouch = false;
        /** @type {boolean} */
        this._canRepeat = true;
        this.deactivate();
    }

    /** @returns {number} */
    index() {
        return this._index;
    }

    /** @returns {boolean} */
    cursorFixed() {
        return this._cursorFixed;
    }

    /**
     * @param {boolean} cursorFixed
     * @returns {void}
     */
    setCursorFixed(cursorFixed) {
        this._cursorFixed = cursorFixed;
    }

    /** @returns {boolean} */
    cursorAll() {
        return this._cursorAll;
    }

    /**
     * @param {boolean} cursorAll
     * @returns {void}
     */
    setCursorAll(cursorAll) {
        this._cursorAll = cursorAll;
    }

    /** @returns {number} */
    maxCols() {
        return 1;
    }

    /** @returns {number} */
    maxItems() {
        return 0;
    }

    /** @returns {number} */
    colSpacing() {
        return 8;
    }

    /** @returns {number} */
    rowSpacing() {
        return 4;
    }

    /** @returns {number} */
    itemWidth() {
        return Math.floor(this.innerWidth / this.maxCols());
    }

    /** @returns {number} */
    itemHeight() {
        return super.itemHeight() + 8;
    }

    /** @returns {number} */
    contentsHeight() {
        return this.innerHeight + this.itemHeight();
    }

    /** @returns {number} */
    maxRows() {
        return Math.max(Math.ceil(this.maxItems() / this.maxCols()), 1);
    }

    /** @returns {number} */
    overallHeight() {
        return this.maxRows() * this.itemHeight();
    }

    /** @returns {void} */
    activate() {
        super.activate();
        this.reselect();
    }

    /** @returns {void} */
    deactivate() {
        super.deactivate();
        this.reselect();
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    select(index) {
        this._index = index;
        this.refreshCursor();
        this.callUpdateHelp();
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    forceSelect(index) {
        this.select(index);
        this.ensureCursorVisible(false);
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    smoothSelect(index) {
        this.select(index);
        this.ensureCursorVisible(true);
    }

    /** @returns {void} */
    deselect() {
        this.select(-1);
    }

    /** @returns {void} */
    reselect() {
        this.select(this._index);
        this.ensureCursorVisible(true);
        this.cursorVisible = true;
    }

    /** @returns {number} */
    row() {
        return Math.floor(this.index() / this.maxCols());
    }

    /** @returns {number} */
    topRow() {
        return Math.floor(this.scrollY() / this.itemHeight());
    }

    /** @returns {number} */
    maxTopRow() {
        return Math.max(0, this.maxRows() - this.maxPageRows());
    }

    /**
     * @param {number} row
     * @returns {void}
     */
    setTopRow(row) {
        this.scrollTo(this.scrollX(), row * this.itemHeight());
    }

    /** @returns {number} */
    maxPageRows() {
        return Math.floor(this.innerHeight / this.itemHeight());
    }

    /** @returns {number} */
    maxPageItems() {
        return this.maxPageRows() * this.maxCols();
    }

    /** @returns {number} */
    maxVisibleItems() {
        const visibleRows = Math.ceil(this.contentsHeight() / this.itemHeight());
        return visibleRows * this.maxCols();
    }

    /** @returns {boolean} */
    isHorizontal() {
        return this.maxPageRows() === 1;
    }

    /** @returns {number} */
    topIndex() {
        return this.topRow() * this.maxCols();
    }

    /**
     * @param {number} index
     * @returns {Rectangle}
     */
    itemRect(index) {
        const maxCols = this.maxCols();
        const itemWidth = this.itemWidth();
        const itemHeight = this.itemHeight();
        const colSpacing = this.colSpacing();
        const rowSpacing = this.rowSpacing();
        const col = index % maxCols;
        const row = Math.floor(index / maxCols);
        const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX();
        const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();
        const width = itemWidth - colSpacing;
        const height = itemHeight - rowSpacing;
        return new PIXI.Rectangle(x, y, width, height);
    }

    /**
     * @param {number} index
     * @returns {Rectangle}
     */
    itemRectWithPadding(index) {
        const rect = this.itemRect(index);
        const padding = this.itemPadding();
        rect.x += padding;
        rect.width -= padding * 2;
        return rect;
    }

    /**
     * @param {number} index
     * @returns {Rectangle}
     */
    itemLineRect(index) {
        const rect = this.itemRectWithPadding(index);
        const padding = (rect.height - this.lineHeight()) / 2;
        rect.y += padding;
        rect.height -= padding * 2;
        return rect;
    }

    /**
     * @param {Window_Help} helpWindow
     * @returns {void}
     */
    setHelpWindow(helpWindow) {
        this._helpWindow = helpWindow;
        this.callUpdateHelp();
    }

    /** @returns {void} */
    showHelpWindow() {
        if (this._helpWindow) {
            this._helpWindow.show();
        }
    }

    /** @returns {void} */
    hideHelpWindow() {
        if (this._helpWindow) {
            this._helpWindow.hide();
        }
    }

    /**
     * @param {string} symbol
     * @param {() => void} method
     * @returns {void}
     */
    setHandler(symbol, method) {
        this._handlers[symbol] = method;
    }

    /**
     * @param {string} symbol
     * @returns {boolean}
     */
    isHandled(symbol) {
        return !!this._handlers[symbol];
    }

    /**
     * @param {string} symbol
     * @returns {void}
     */
    callHandler(symbol) {
        if (this.isHandled(symbol)) {
            this._handlers[symbol]();
        }
    }

    /** @returns {boolean} */
    isOpenAndActive() {
        return this.isOpen() && this.visible && this.active;
    }

    /** @returns {boolean} */
    isCursorMovable() {
        return (
            this.isOpenAndActive() &&
            !this._cursorFixed &&
            !this._cursorAll &&
            this.maxItems() > 0
        );
    }

    /**
     * @param {boolean} wrap
     * @returns {void}
     */
    cursorDown(wrap) {
        const index = this.index();
        const maxItems = this.maxItems();
        const maxCols = this.maxCols();
        if (index < maxItems - maxCols || (wrap && maxCols === 1)) {
            this.smoothSelect((index + maxCols) % maxItems);
        }
    }

    /**
     * @param {boolean} wrap
     * @returns {void}
     */
    cursorUp(wrap) {
        const index = Math.max(0, this.index());
        const maxItems = this.maxItems();
        const maxCols = this.maxCols();
        if (index >= maxCols || (wrap && maxCols === 1)) {
            this.smoothSelect((index - maxCols + maxItems) % maxItems);
        }
    }

    /**
     * @param {boolean} wrap
     * @returns {void}
     */
    cursorRight(wrap) {
        const index = this.index();
        const maxItems = this.maxItems();
        const maxCols = this.maxCols();
        const horizontal = this.isHorizontal();
        if (maxCols >= 2 && (index < maxItems - 1 || (wrap && horizontal))) {
            this.smoothSelect((index + 1) % maxItems);
        }
    }

    /**
     * @param {boolean} wrap
     * @returns {void}
     */
    cursorLeft(wrap) {
        const index = Math.max(0, this.index());
        const maxItems = this.maxItems();
        const maxCols = this.maxCols();
        const horizontal = this.isHorizontal();
        if (maxCols >= 2 && (index > 0 || (wrap && horizontal))) {
            this.smoothSelect((index - 1 + maxItems) % maxItems);
        }
    }

    /** @returns {void} */
    cursorPagedown() {
        const index = this.index();
        const maxItems = this.maxItems();
        if (this.topRow() + this.maxPageRows() < this.maxRows()) {
            this.smoothScrollDown(this.maxPageRows());
            this.select(Math.min(index + this.maxPageItems(), maxItems - 1));
        }
    }

    /** @returns {void} */
    cursorPageup() {
        const index = this.index();
        if (this.topRow() > 0) {
            this.smoothScrollUp(this.maxPageRows());
            this.select(Math.max(index - this.maxPageItems(), 0));
        }
    }

    /** @returns {boolean} */
    isScrollEnabled() {
        return this.active || this.index() < 0;
    }

    /** @returns {void} */
    update() {
        this.processCursorMove();
        this.processHandling();
        this.processTouch();
        super.update();
    }

    /** @returns {void} */
    processCursorMove() {
        if (this.isCursorMovable()) {
            const lastIndex = this.index();
            if (Input.isRepeated("down")) {
                this.cursorDown(Input.isTriggered("down"));
            }
            if (Input.isRepeated("up")) {
                this.cursorUp(Input.isTriggered("up"));
            }
            if (Input.isRepeated("right")) {
                this.cursorRight(Input.isTriggered("right"));
            }
            if (Input.isRepeated("left")) {
                this.cursorLeft(Input.isTriggered("left"));
            }
            if (!this.isHandled("pagedown") && Input.isTriggered("pagedown")) {
                this.cursorPagedown();
            }
            if (!this.isHandled("pageup") && Input.isTriggered("pageup")) {
                this.cursorPageup();
            }
            if (this.index() !== lastIndex) {
                this.playCursorSound();
            }
        }
    }

    /** @returns {void} */
    processHandling() {
        if (this.isOpenAndActive()) {
            if (this.isOkEnabled() && this.isOkTriggered()) {
                return this.processOk();
            }
            if (this.isCancelEnabled() && this.isCancelTriggered()) {
                return this.processCancel();
            }
            if (this.isHandled("pagedown") && Input.isTriggered("pagedown")) {
                return this.processPagedown();
            }
            if (this.isHandled("pageup") && Input.isTriggered("pageup")) {
                return this.processPageup();
            }
        }
    }

    /** @returns {void} */
    processTouch() {
        if (this.isOpenAndActive()) {
            if (this.isHoverEnabled() && TouchInput.isHovered()) {
                this.onTouchSelect(false);
            } else if (TouchInput.isTriggered()) {
                this.onTouchSelect(true);
            }
            if (TouchInput.isClicked()) {
                this.onTouchOk();
            } else if (TouchInput.isCancelled()) {
                this.onTouchCancel();
            }
        }
    }

    /** @returns {boolean} */
    isHoverEnabled() {
        return true;
    }

    /**
     * @param {boolean} trigger
     * @returns {void}
     */
    onTouchSelect(trigger) {
        this._doubleTouch = false;
        if (this.isCursorMovable()) {
            const lastIndex = this.index();
            const hitIndex = this.hitIndex();
            if (hitIndex >= 0) {
                if (hitIndex === this.index()) {
                    this._doubleTouch = true;
                }
                this.select(hitIndex);
            }
            if (trigger && this.index() !== lastIndex) {
                this.playCursorSound();
            }
        }
    }

    /** @returns {void} */
    onTouchOk() {
        if (this.isTouchOkEnabled()) {
            const hitIndex = this.hitIndex();
            if (this._cursorFixed) {
                if (hitIndex === this.index()) {
                    this.processOk();
                }
            } else if (hitIndex >= 0) {
                this.processOk();
            }
        }
    }

    /** @returns {void} */
    onTouchCancel() {
        if (this.isCancelEnabled()) {
            this.processCancel();
        }
    }

    /** @returns {number} */
    hitIndex() {
        const touchPos = new PIXI.Point(TouchInput.x, TouchInput.y);
        const localPos = this.toLocal(touchPos);
        return this.hitTest(localPos.x, localPos.y);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    hitTest(x, y) {
        if (this.innerRect.contains(x, y)) {
            const cx = this.origin.x + x - this.padding;
            const cy = this.origin.y + y - this.padding;
            const topIndex = this.topIndex();
            for (let i = 0; i < this.maxVisibleItems(); i++) {
                const index = topIndex + i;
                if (index < this.maxItems()) {
                    const rect = this.itemRect(index);
                    if (rect.contains(cx, cy)) {
                        return index;
                    }
                }
            }
        }
        return -1;
    }

    /** @returns {boolean} */
    isTouchOkEnabled() {
        return (
            this.isOkEnabled() &&
            (this._cursorFixed || this._cursorAll || this._doubleTouch)
        );
    }

    /** @returns {boolean} */
    isOkEnabled() {
        return this.isHandled("ok");
    }

    /** @returns {boolean} */
    isCancelEnabled() {
        return this.isHandled("cancel");
    }

    /** @returns {boolean} */
    isOkTriggered() {
        return this._canRepeat ? Input.isRepeated("ok") : Input.isTriggered("ok");
    }

    /** @returns {boolean} */
    isCancelTriggered() {
        return Input.isRepeated("cancel");
    }

    /** @returns {void} */
    processOk() {
        if (this.isCurrentItemEnabled()) {
            this.playOkSound();
            this.updateInputData();
            this.deactivate();
            this.callOkHandler();
        } else {
            this.playBuzzerSound();
        }
    }

    /** @returns {void} */
    callOkHandler() {
        this.callHandler("ok");
    }

    /** @returns {void} */
    processCancel() {
        SoundManager.playCancel();
        this.updateInputData();
        this.deactivate();
        this.callCancelHandler();
    }

    /** @returns {void} */
    callCancelHandler() {
        this.callHandler("cancel");
    }

    /** @returns {void} */
    processPageup() {
        this.updateInputData();
        this.deactivate();
        this.callHandler("pageup");
    }

    /** @returns {void} */
    processPagedown() {
        this.updateInputData();
        this.deactivate();
        this.callHandler("pagedown");
    }

    /** @returns {void} */
    updateInputData() {
        Input.update();
        TouchInput.update();
        this.clearScrollStatus();
    }

    /**
     * @param {boolean} smooth
     * @returns {void}
     */
    ensureCursorVisible(smooth) {
        if (this._cursorAll) {
            this.scrollTo(0, 0);
        } else if (this.innerHeight > 0 && this.row() >= 0) {
            const scrollY = this.scrollY();
            const itemTop = this.row() * this.itemHeight();
            const itemBottom = itemTop + this.itemHeight();
            const scrollMin = itemBottom - this.innerHeight;
            if (scrollY > itemTop) {
                if (smooth) {
                    this.smoothScrollTo(0, itemTop);
                } else {
                    this.scrollTo(0, itemTop);
                }
            } else if (scrollY < scrollMin) {
                if (smooth) {
                    this.smoothScrollTo(0, scrollMin);
                } else {
                    this.scrollTo(0, scrollMin);
                }
            }
        }
    }

    /** @returns {void} */
    callUpdateHelp() {
        if (this.active && this._helpWindow) {
            this.updateHelp();
        }
    }

    /** @returns {void} */
    updateHelp() {
        this._helpWindow.clear();
    }

    /**
     * @param {RMMZ.DataItemBase | null} item
     * @returns {void}
     */
    setHelpWindowItem(item) {
        if (this._helpWindow) {
            this._helpWindow.setItem(item);
        }
    }

    /** @returns {boolean} */
    isCurrentItemEnabled() {
        return true;
    }

    /** @returns {void} */
    drawAllItems() {
        const topIndex = this.topIndex();
        for (let i = 0; i < this.maxVisibleItems(); i++) {
            const index = topIndex + i;
            if (index < this.maxItems()) {
                this.drawItemBackground(index);
                this.drawItem(index);
            }
        }
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    drawItem(/*index*/) {
        //
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    clearItem(index) {
        const rect = this.itemRect(index);
        this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
        this.contentsBack.clearRect(rect.x, rect.y, rect.width, rect.height);
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    drawItemBackground(index) {
        const rect = this.itemRect(index);
        this.drawBackgroundRect(rect);
    }

    /**
     * @param {Rectangle} rect
     * @returns {void}
     */
    drawBackgroundRect(rect) {
        const c1 = ColorManager.itemBackColor1();
        const c2 = ColorManager.itemBackColor2();
        const x = rect.x;
        const y = rect.y;
        const w = rect.width;
        const h = rect.height;
        this.contentsBack.gradientFillRect(x, y, w, h, c1, c2, true);
        this.contentsBack.strokeRect(x, y, w, h, c1);
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    redrawItem(index) {
        if (index >= 0) {
            this.clearItem(index);
            this.drawItemBackground(index);
            this.drawItem(index);
        }
    }

    /** @returns {void} */
    redrawCurrentItem() {
        this.redrawItem(this.index());
    }

    /** @returns {void} */
    refresh() {
        this.paint();
    }

    /** @returns {void} */
    paint() {
        if (this.contents) {
            this.contents.clear();
            this.contentsBack.clear();
            this.drawAllItems();
        }
    }

    /** @returns {void} */
    refreshCursor() {
        if (this._cursorAll) {
            this.refreshCursorForAll();
        } else if (this.index() >= 0) {
            const rect = this.itemRect(this.index());
            this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
        } else {
            this.setCursorRect(0, 0, 0, 0);
        }
    }

    /** @returns {void} */
    refreshCursorForAll() {
        const maxItems = this.maxItems();
        if (maxItems > 0) {
            const rect = this.itemRect(0);
            rect.enlarge(this.itemRect(maxItems - 1));
            this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
        } else {
            this.setCursorRect(0, 0, 0, 0);
        }
    }
}

/**
 * The superclass of windows for selecting a command.
 */
class Window_Command extends Window_Selectable {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        this.refresh();
        this.select(0);
        this.activate();
    }

    /** @returns {number} */
    maxItems() {
        return this._list.length;
    }

    /** @returns {void} */
    clearCommandList() {
        this._list = [];
    }

    /** @returns {void} */
    makeCommandList() {
        //
    }

    // prettier-ignore
    /**
     * @param {string} name
     * @param {string} symbol
     * @param {boolean} [enabled]
     * @param {number | null} [ext]
     * @returns {void}
     */
    addCommand(
        name, symbol, enabled = true, ext = null
    ) {
        this._list.push({ name: name, symbol: symbol, enabled: enabled, ext: ext });
    }

    /**
     * @param {number} index
     * @returns {string}
     */
    commandName(index) {
        return this._list[index].name;
    }

    /**
     * @param {number} index
     * @returns {string}
     */
    commandSymbol(index) {
        return this._list[index].symbol;
    }

    /**
     * @param {number} index
     * @returns {boolean}
     */
    isCommandEnabled(index) {
        return this._list[index].enabled;
    }

    /** @returns {{ name: string; symbol: string; enabled: boolean; ext: number | null; } | null} */
    currentData() {
        return this.index() >= 0 ? this._list[this.index()] : null;
    }

    /** @returns {boolean} */
    isCurrentItemEnabled() {
        return this.currentData() ? this.currentData().enabled : false;
    }

    /** @returns {string | null} */
    currentSymbol() {
        return this.currentData() ? this.currentData().symbol : null;
    }

    /** @returns {number | null} */
    currentExt() {
        return this.currentData() ? this.currentData().ext : null;
    }

    /**
     * @param {string | null} symbol
     * @returns {number}
     */
    findSymbol(symbol) {
        return this._list.findIndex(item => item.symbol === symbol);
    }

    /**
     * @param {string | null} symbol
     * @returns {void}
     */
    selectSymbol(symbol) {
        const index = this.findSymbol(symbol);
        if (index >= 0) {
            this.forceSelect(index);
        } else {
            this.forceSelect(0);
        }
    }

    /**
     * @param {number} ext
     * @returns {number}
     */
    findExt(ext) {
        return this._list.findIndex(item => item.ext === ext);
    }

    /**
     * @param {number} ext
     * @returns {void}
     */
    selectExt(ext) {
        const index = this.findExt(ext);
        if (index >= 0) {
            this.forceSelect(index);
        } else {
            this.forceSelect(0);
        }
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    drawItem(index) {
        const rect = this.itemLineRect(index);
        const align = this.itemTextAlign();
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
    }

    /** @returns {CanvasTextAlign} */
    itemTextAlign() {
        return "center";
    }

    /** @returns {boolean} */
    isOkEnabled() {
        return true;
    }

    /** @returns {void} */
    callOkHandler() {
        const symbol = this.currentSymbol();
        if (this.isHandled(symbol)) {
            this.callHandler(symbol);
        } else if (this.isHandled("ok")) {
            super.callOkHandler();
        } else {
            this.activate();
        }
    }

    /** @returns {void} */
    refresh() {
        this.clearCommandList();
        this.makeCommandList();
        super.refresh();
    }
}

/**
 * The command window for the horizontal selection format.
 */
class Window_HorzCommand extends Window_Command {
    constructor(...args) {
        super(...args);
    }

    initialize(rect) {
        super.initialize(rect);
    }

    /** @returns {number} */
    maxCols() {
        return 4;
    }

    /** @returns {"center"} */
    itemTextAlign() {
        return "center";
    }
}

/**
 * The window for displaying the description of the selected item.
 */
class Window_Help extends Window_Base {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        /** @type {string} */
        this._text = "";
    }

    /**
     * @param {string} text
     * @returns {void}
     */
    setText(text) {
        if (this._text !== text) {
            this._text = text;
            this.refresh();
        }
    }

    /** @returns {void} */
    clear() {
        this.setText("");
    }

    /**
     * @param {RMMZ.DataItemBase | null} item
     * @returns {void}
     */
    setItem(item) {
        this.setText(item ? item.description : "");
    }

    /** @returns {void} */
    refresh() {
        const rect = this.baseTextRect();
        this.contents.clear();
        this.drawTextEx(this._text, rect.x, rect.y, rect.width);
    }
}

/**
 * The window for displaying the party's gold.
 */
class Window_Gold extends Window_Selectable {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        this.refresh();
    }

    /** @returns {number} */
    colSpacing() {
        return 0;
    }

    /** @returns {void} */
    refresh() {
        const rect = this.itemLineRect(0);
        const x = rect.x;
        const y = rect.y;
        const width = rect.width;
        this.contents.clear();
        this.drawCurrencyValue(this.value(), this.currencyUnit(), x, y, width);
    }

    /** @returns {number} */
    value() {
        return $gameParty.gold();
    }

    /** @returns {string} */
    currencyUnit() {
        return TextManager.currencyUnit;
    }

    /** @returns {void} */
    open() {
        this.refresh();
        super.open();
    }
}

/**
 * The superclass of windows for displaying actor status.
 */
class Window_StatusBase extends Window_Selectable {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        /** @type {Record<string, Sprite>} */
        this._additionalSprites = {};
        this.loadFaceImages();
    }

    /** @returns {void} */
    loadFaceImages() {
        for (const actor of $gameParty.members()) {
            ImageManager.loadFace(actor.faceName());
        }
    }

    /** @returns {void} */
    refresh() {
        this.hideAdditionalSprites();
        super.refresh();
    }

    /** @returns {void} */
    hideAdditionalSprites() {
        for (const sprite of Object.values(this._additionalSprites)) {
            sprite.hide();
        }
    }

    /**
     * @param {Game_Actor} actor
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    placeActorName(actor, x, y) {
        const key = "actor%1-name".format(actor.actorId());
        const sprite = this.createInnerSprite(key, Sprite_Name);
        sprite.setup(actor);
        sprite.move(x, y);
        sprite.show();
    }

    /**
     * @param {Game_Actor} actor
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    placeStateIcon(actor, x, y) {
        const key = "actor%1-stateIcon".format(actor.actorId());
        const sprite = this.createInnerSprite(key, Sprite_StateIcon);
        sprite.setup(actor);
        sprite.move(x, y);
        sprite.show();
    }

    /**
     * @param {Game_Actor} actor
     * @param {"time" | "hp" | "mp" | "tp"} type
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    placeGauge(actor, type, x, y) {
        const key = "actor%1-gauge-%2".format(actor.actorId(), type);
        const sprite = this.createInnerSprite(key, Sprite_Gauge);
        sprite.setup(actor, type);
        sprite.move(x, y);
        sprite.show();
    }

    /**
     * @template {Sprite} T
     * @param {string} key
     * @param {new () => T} spriteClass
     * @returns {T}
     */
    createInnerSprite(key, spriteClass) {
        const dict = this._additionalSprites;
        if (dict[key]) {
            return dict[key];
        } else {
            const sprite = new spriteClass();
            dict[key] = sprite;
            this.addInnerChild(sprite);
            return sprite;
        }
    }

    /**
     * @param {Game_Actor} actor
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    placeTimeGauge(actor, x, y) {
        if (BattleManager.isTpb()) {
            this.placeGauge(actor, "time", x, y);
        }
    }

    /**
     * @param {Game_Actor} actor
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    placeBasicGauges(actor, x, y) {
        this.placeGauge(actor, "hp", x, y);
        this.placeGauge(actor, "mp", x, y + this.gaugeLineHeight());
        if ($dataSystem.optDisplayTp) {
            this.placeGauge(actor, "tp", x, y + this.gaugeLineHeight() * 2);
        }
    }

    /** @returns {number} */
    gaugeLineHeight() {
        return 24;
    }

    /**
     * @param {Game_Actor} actor
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    drawActorCharacter(actor, x, y) {
        this.drawCharacter(actor.characterName(), actor.characterIndex(), x, y);
    }

    // prettier-ignore
    /**
     * @param {Game_Actor} actor
     * @param {number} x
     * @param {number} y
     * @param {number} [width]
     * @param {number} [height]
     * @returns {void}
     */
    drawActorFace(
        actor, x, y, width, height
    ) {
        this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height);
    }

    /**
     * @param {Game_Actor} actor
     * @param {number} x
     * @param {number} y
     * @param {number} [width]
     * @returns {void}
     */
    drawActorName(actor, x, y, width) {
        width = width || 168;
        this.changeTextColor(ColorManager.hpColor(actor));
        this.drawText(actor.name(), x, y, width);
    }

    /**
     * @param {Game_Actor} actor
     * @param {number} x
     * @param {number} y
     * @param {number} [width]
     * @returns {void}
     */
    drawActorClass(actor, x, y, width) {
        width = width || 168;
        this.resetTextColor();
        this.drawText(actor.currentClass().name, x, y, width);
    }

    /**
     * @param {Game_Actor} actor
     * @param {number} x
     * @param {number} y
     * @param {number} [width]
     * @returns {void}
     */
    drawActorNickname(actor, x, y, width) {
        width = width || 270;
        this.resetTextColor();
        this.drawText(actor.nickname(), x, y, width);
    }

    /**
     * @param {Game_Actor} actor
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    drawActorLevel(actor, x, y) {
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.levelA, x, y, 48);
        this.resetTextColor();
        this.drawText(actor.level, x + 84, y, 36, "right");
    }

    /**
     * @param {Game_Actor} actor
     * @param {number} x
     * @param {number} y
     * @param {number} [width]
     * @returns {void}
     */
    drawActorIcons(actor, x, y, width) {
        width = width || 144;
        const delta = ImageManager.standardIconWidth - ImageManager.iconWidth;
        const iconWidth = ImageManager.standardIconWidth;
        const icons = actor.allIcons().slice(0, Math.floor(width / iconWidth));
        let iconX = x + delta / 2;
        for (const icon of icons) {
            this.drawIcon(icon, iconX, y + 2);
            iconX += iconWidth;
        }
    }

    /**
     * @param {Game_Actor} actor
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    drawActorSimpleStatus(actor, x, y) {
        const lineHeight = this.lineHeight();
        const x2 = x + 180;
        this.drawActorName(actor, x, y);
        this.drawActorLevel(actor, x, y + lineHeight * 1);
        this.drawActorIcons(actor, x, y + lineHeight * 2);
        this.drawActorClass(actor, x2, y);
        this.placeBasicGauges(actor, x2, y + lineHeight);
    }

    /**
     * @param {Game_Actor} actor
     * @param {number} index
     * @returns {string}
     */
    actorSlotName(actor, index) {
        const slots = actor.equipSlots();
        return $dataSystem.equipTypes[slots[index]];
    }
}

/**
 * The window for selecting a command on the menu screen.
 */
class Window_MenuCommand extends Window_Command {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        this.selectLast();
        /** @type {boolean} */
        this._canRepeat = false;
    }

    /** @type {string | null} */
    static _lastCommandSymbol = null;

    /** @returns {void} */
    static initCommandPosition() {
        this._lastCommandSymbol = null;
    }

    /** @returns {void} */
    makeCommandList() {
        this.addMainCommands();
        this.addFormationCommand();
        this.addOriginalCommands();
        this.addOptionsCommand();
        this.addSaveCommand();
        this.addGameEndCommand();
    }

    /** @returns {void} */
    addMainCommands() {
        const enabled = this.areMainCommandsEnabled();
        if (this.needsCommand("item")) {
            this.addCommand(TextManager.item, "item", enabled);
        }
        if (this.needsCommand("skill")) {
            this.addCommand(TextManager.skill, "skill", enabled);
        }
        if (this.needsCommand("equip")) {
            this.addCommand(TextManager.equip, "equip", enabled);
        }
        if (this.needsCommand("status")) {
            this.addCommand(TextManager.status, "status", enabled);
        }
    }

    /** @returns {void} */
    addFormationCommand() {
        if (this.needsCommand("formation")) {
            const enabled = this.isFormationEnabled();
            this.addCommand(TextManager.formation, "formation", enabled);
        }
    }

    /** @returns {void} */
    addOriginalCommands() {
        //
    }

    /** @returns {void} */
    addOptionsCommand() {
        if (this.needsCommand("options")) {
            const enabled = this.isOptionsEnabled();
            this.addCommand(TextManager.options, "options", enabled);
        }
    }

    /** @returns {void} */
    addSaveCommand() {
        if (this.needsCommand("save")) {
            const enabled = this.isSaveEnabled();
            this.addCommand(TextManager.save, "save", enabled);
        }
    }

    /** @returns {void} */
    addGameEndCommand() {
        const enabled = this.isGameEndEnabled();
        this.addCommand(TextManager.gameEnd, "gameEnd", enabled);
    }

    /**
     * @param {string} name
     * @returns {boolean}
     */
    needsCommand(name) {
        const table = ["item", "skill", "equip", "status", "formation", "save"];
        const index = table.indexOf(name);
        if (index >= 0) {
            return $dataSystem.menuCommands[index];
        }
        return true;
    }

    /** @returns {boolean} */
    areMainCommandsEnabled() {
        return $gameParty.exists();
    }

    /** @returns {boolean} */
    isFormationEnabled() {
        return $gameParty.size() >= 2 && $gameSystem.isFormationEnabled();
    }

    /** @returns {boolean} */
    isOptionsEnabled() {
        return true;
    }

    /** @returns {boolean} */
    isSaveEnabled() {
        return !DataManager.isEventTest() && $gameSystem.isSaveEnabled();
    }

    /** @returns {boolean} */
    isGameEndEnabled() {
        return true;
    }

    /** @returns {void} */
    processOk() {
        Window_MenuCommand._lastCommandSymbol = this.currentSymbol();
        super.processOk();
    }

    /** @returns {void} */
    selectLast() {
        this.selectSymbol(Window_MenuCommand._lastCommandSymbol);
    }
}

/**
 * The window for displaying party member status on the menu screen.
 */
class Window_MenuStatus extends Window_StatusBase {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        /** @type {boolean} */
        this._formationMode = false;
        /** @type {number} */
        this._pendingIndex = -1;
        this.refresh();
    }

    /** @returns {number} */
    maxItems() {
        return $gameParty.size();
    }

    /** @returns {number} */
    numVisibleRows() {
        return 4;
    }

    /** @returns {number} */
    itemHeight() {
        return Math.floor(this.innerHeight / this.numVisibleRows());
    }

    /**
     * @param {number} index
     * @returns {import("..").Game_Actor}
     */
    actor(index) {
        return $gameParty.members()[index];
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    drawItem(index) {
        this.drawPendingItemBackground(index);
        this.drawItemImage(index);
        this.drawItemStatus(index);
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    drawPendingItemBackground(index) {
        if (index === this._pendingIndex) {
            const rect = this.itemRect(index);
            const color = ColorManager.pendingColor();
            this.changePaintOpacity(false);
            this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
            this.changePaintOpacity(true);
        }
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    drawItemImage(index) {
        const actor = this.actor(index);
        const rect = this.itemRect(index);
        const width = ImageManager.standardFaceWidth;
        const height = rect.height - 2;
        this.changePaintOpacity(actor.isBattleMember());
        this.drawActorFace(actor, rect.x + 1, rect.y + 1, width, height);
        this.changePaintOpacity(true);
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    drawItemStatus(index) {
        const actor = this.actor(index);
        const rect = this.itemRect(index);
        const x = rect.x + 180;
        const y = rect.y + Math.floor(rect.height / 2 - this.lineHeight() * 1.5);
        this.drawActorSimpleStatus(actor, x, y);
    }

    /** @returns {void} */
    processOk() {
        super.processOk();
        const actor = this.actor(this.index());
        $gameParty.setMenuActor(actor);
    }

    /** @returns {boolean} */
    isCurrentItemEnabled() {
        if (this._formationMode) {
            const actor = this.actor(this.index());
            return actor && actor.isFormationChangeOk();
        } else {
            return true;
        }
    }

    /** @returns {void} */
    selectLast() {
        this.smoothSelect($gameParty.menuActor().index() || 0);
    }

    /** @returns {boolean} */
    formationMode() {
        return this._formationMode;
    }

    /**
     * @param {boolean} formationMode
     * @returns {void}
     */
    setFormationMode(formationMode) {
        this._formationMode = formationMode;
    }

    /** @returns {number} */
    pendingIndex() {
        return this._pendingIndex;
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    setPendingIndex(index) {
        const lastPendingIndex = this._pendingIndex;
        this._pendingIndex = index;
        this.redrawItem(this._pendingIndex);
        this.redrawItem(lastPendingIndex);
    }
}

/**
 * The window for selecting a target actor on the item and skill screens.
 */
class Window_MenuActor extends Window_MenuStatus {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        this.hide();
    }

    /** @returns {void} */
    processOk() {
        if (!this.cursorAll()) {
            $gameParty.setTargetActor($gameParty.members()[this.index()]);
        }
        this.callOkHandler();
    }

    /** @returns {void} */
    selectLast() {
        this.forceSelect($gameParty.targetActor().index() || 0);
    }

    /**
     * @param {RMMZ.ActionItem} item
     * @returns {void}
     */
    selectForItem(item) {
        const actor = $gameParty.menuActor();
        const action = new Game_Action(actor);
        action.setItemObject(item);
        this.setCursorFixed(false);
        this.setCursorAll(false);
        if (action.isForUser()) {
            if (DataManager.isSkill(item)) {
                this.setCursorFixed(true);
                this.forceSelect(actor.index());
            } else {
                this.selectLast();
            }
        } else if (action.isForAll()) {
            this.setCursorAll(true);
            this.forceSelect(0);
        } else {
            this.selectLast();
        }
    }
}

/**
 * The window for selecting a category of items on the item and shop screens.
 */
class Window_ItemCategory extends Window_HorzCommand {
    constructor(...args) {
        super(...args);
    }

    initialize(rect) {
        super.initialize(rect);
    }

    /** @returns {number} */
    maxCols() {
        return 4;
    }

    /** @returns {void} */
    update() {
        super.update();
        if (this._itemWindow) {
            this._itemWindow.setCategory(this.currentSymbol());
        }
    }

    /** @returns {void} */
    makeCommandList() {
        if (this.needsCommand("item")) {
            this.addCommand(TextManager.item, "item");
        }
        if (this.needsCommand("weapon")) {
            this.addCommand(TextManager.weapon, "weapon");
        }
        if (this.needsCommand("armor")) {
            this.addCommand(TextManager.armor, "armor");
        }
        if (this.needsCommand("keyItem")) {
            this.addCommand(TextManager.keyItem, "keyItem");
        }
    }

    /**
     * @param {string} name
     * @returns {boolean}
     */
    needsCommand(name) {
        const table = ["item", "weapon", "armor", "keyItem"];
        const index = table.indexOf(name);
        if (index >= 0) {
            return $dataSystem.itemCategories[index];
        }
        return true;
    }

    /**
     * @param {Window_ItemList} itemWindow
     * @returns {void}
     */
    setItemWindow(itemWindow) {
        this._itemWindow = itemWindow;
    }

    /** @returns {boolean} */
    needsSelection() {
        return this.maxItems() >= 2;
    }
}

/**
 * The window for selecting an item on the item screen.
 */
class Window_ItemList extends Window_Selectable {
    constructor(...args) {
        super(...args);
    }

    initialize(rect) {
        super.initialize(rect);
        /** @type {string | null} */
        this._category = "none";
        /** @type {(RMMZ.DataItemBase | null)[]} */
        this._data = [];
    }

    /**
     * @param {string | null} category
     * @returns {void}
     */
    setCategory(category) {
        if (this._category !== category) {
            this._category = category;
            this.refresh();
            this.scrollTo(0, 0);
        }
    }

    /** @returns {number} */
    maxCols() {
        return 2;
    }

    /** @returns {number} */
    colSpacing() {
        return 16;
    }

    /** @returns {number} */
    maxItems() {
        return this._data ? this._data.length : 1;
    }

    /** @returns {RMMZ.DataItemBase | null} */
    item() {
        return this.itemAt(this.index());
    }

    /**
     * @param {number} index
     * @returns {RMMZ.DataItemBase | null}
     */
    itemAt(index) {
        return this._data && index >= 0 ? this._data[index] : null;
    }

    /** @returns {boolean} */
    isCurrentItemEnabled() {
        return this.isEnabled(this.item());
    }

    /**
     * @param {RMMZ.DataItemBase | null} item
     * @returns {boolean}
     */
    includes(item) {
        switch (this._category) {
            case "item":
                return DataManager.isItem(item) && item.itypeId === 1;
            case "weapon":
                return DataManager.isWeapon(item);
            case "armor":
                return DataManager.isArmor(item);
            case "keyItem":
                return DataManager.isItem(item) && item.itypeId === 2;
            default:
                return false;
        }
    }

    /** @returns {boolean} */
    needsNumber() {
        if (this._category === "keyItem") {
            return $dataSystem.optKeyItemsNumber;
        } else {
            return true;
        }
    }

    /**
     * @param {RMMZ.DataItemBase | null} item
     * @returns {boolean}
     */
    isEnabled(item) {
        return $gameParty.canUse(item);
    }

    /** @returns {void} */
    makeItemList() {
        this._data = $gameParty.allItems().filter(item => this.includes(item));
        if (this.includes(null)) {
            this._data.push(null);
        }
    }

    /** @returns {void} */
    selectLast() {
        const index = this._data.indexOf($gameParty.lastItem());
        this.forceSelect(index >= 0 ? index : 0);
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    drawItem(index) {
        const item = this.itemAt(index);
        if (item) {
            const numberWidth = this.numberWidth();
            const rect = this.itemLineRect(index);
            this.changePaintOpacity(this.isEnabled(item));
            this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
            this.drawItemNumber(item, rect.x, rect.y, rect.width);
            this.changePaintOpacity(1);
        }
    }

    /** @returns {number} */
    numberWidth() {
        return this.textWidth("000");
    }

    /**
     * @param {RMMZ.DataItemBase} item
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @returns {void}
     */
    drawItemNumber(item, x, y, width) {
        if (this.needsNumber()) {
            this.drawText(":", x, y, width - this.textWidth("00"), "right");
            this.drawText($gameParty.numItems(item), x, y, width, "right");
        }
    }

    /** @returns {void} */
    updateHelp() {
        this.setHelpWindowItem(this.item());
    }

    /** @returns {void} */
    refresh() {
        this.makeItemList();
        super.refresh();
    }
}

/**
 * The window for selecting a skill type on the skill screen.
 */
class Window_SkillType extends Window_Command {
    constructor(...args) {
        super(...args);
    }

    initialize(rect) {
        super.initialize(rect);
        /** @type {Game_Actor | null} */
        this._actor = null;
    }

    /**
     * @param {Game_Actor} actor
     * @returns {void}
     */
    setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
            this.selectLast();
        }
    }

    /** @returns {void} */
    makeCommandList() {
        if (this._actor) {
            const skillTypes = this._actor.skillTypes();
            for (const stypeId of skillTypes) {
                const name = $dataSystem.skillTypes[stypeId];
                this.addCommand(name, "skill", true, stypeId);
            }
        }
    }

    /** @returns {void} */
    update() {
        super.update();
        if (this._skillWindow) {
            this._skillWindow.setStypeId(this.currentExt());
        }
    }

    /**
     * @param {Window_SkillList} skillWindow
     * @returns {void}
     */
    setSkillWindow(skillWindow) {
        this._skillWindow = skillWindow;
    }

    /** @returns {void} */
    selectLast() {
        const skill = this._actor.lastMenuSkill();
        if (skill) {
            this.selectExt(skill.stypeId);
        } else {
            this.forceSelect(0);
        }
    }
}

/**
 * The window for displaying the skill user's status on the skill screen.
 */
class Window_SkillStatus extends Window_StatusBase {
    constructor(...args) {
        super(...args);
    }

    initialize(rect) {
        super.initialize(rect);
        /** @type {Game_Actor | null} */
        this._actor = null;
    }

    /**
     * @param {Game_Actor} actor
     * @returns {void}
     */
    setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    }

    /** @returns {void} */
    refresh() {
        super.refresh();
        if (this._actor) {
            const x = this.colSpacing() / 2;
            const h = this.innerHeight;
            const y = h / 2 - this.lineHeight() * 1.5;
            this.drawActorFace(this._actor, x + 1, 0, 144, h);
            this.drawActorSimpleStatus(this._actor, x + 180, y);
        }
    }
}

/**
 * The window for selecting a skill on the skill screen.
 */
class Window_SkillList extends Window_Selectable {
    constructor(...args) {
        super(...args);
    }

    initialize(rect) {
        super.initialize(rect);
        /** @type {Game_Actor | null} */
        this._actor = null;
        /** @type {RMMZ.SkillType} */
        this._stypeId = 0;
        /** @type {RMMZ.DataSkill[]} */
        this._data = [];
    }

    /**
     * @param {Game_Actor} actor
     * @returns {void}
     */
    setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
            this.scrollTo(0, 0);
        }
    }

    /**
     * @param {RMMZ.SkillType} stypeId
     * @returns {void}
     */
    setStypeId(stypeId) {
        if (this._stypeId !== stypeId) {
            this._stypeId = stypeId;
            this.refresh();
            this.scrollTo(0, 0);
        }
    }

    /** @returns {number} */
    maxCols() {
        return 2;
    }

    /** @returns {number} */
    colSpacing() {
        return 16;
    }

    /** @returns {number} */
    maxItems() {
        return this._data ? this._data.length : 1;
    }

    /** @returns {RMMZ.DataSkill | null} */
    item() {
        return this.itemAt(this.index());
    }

    /**
     * @param {number} index
     * @returns {RMMZ.DataSkill | null}
     */
    itemAt(index) {
        return this._data && index >= 0 ? this._data[index] : null;
    }

    /** @returns {boolean} */
    isCurrentItemEnabled() {
        return this.isEnabled(this._data[this.index()]);
    }

    /**
     * @param {RMMZ.DataSkill} item
     * @returns {boolean}
     */
    includes(item) {
        return item && item.stypeId === this._stypeId;
    }

    /**
     * @param {RMMZ.DataSkill} item
     * @returns {boolean}
     */
    isEnabled(item) {
        return this._actor && this._actor.canUse(item);
    }

    /** @returns {void} */
    makeItemList() {
        if (this._actor) {
            this._data = this._actor.skills().filter(item => this.includes(item));
        } else {
            this._data = [];
        }
    }

    /** @returns {void} */
    selectLast() {
        const index = this._data.indexOf(this._actor.lastSkill());
        this.forceSelect(index >= 0 ? index : 0);
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    drawItem(index) {
        const skill = this.itemAt(index);
        if (skill) {
            const costWidth = this.costWidth();
            const rect = this.itemLineRect(index);
            this.changePaintOpacity(this.isEnabled(skill));
            this.drawItemName(skill, rect.x, rect.y, rect.width - costWidth);
            this.drawSkillCost(skill, rect.x, rect.y, rect.width);
            this.changePaintOpacity(1);
        }
    }

    /** @returns {number} */
    costWidth() {
        return this.textWidth("000");
    }

    /**
     * @param {RMMZ.DataSkill} skill
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @returns {void}
     */
    drawSkillCost(skill, x, y, width) {
        if (this._actor.skillTpCost(skill) > 0) {
            this.changeTextColor(ColorManager.tpCostColor());
            this.drawText(this._actor.skillTpCost(skill), x, y, width, "right");
        } else if (this._actor.skillMpCost(skill) > 0) {
            this.changeTextColor(ColorManager.mpCostColor());
            this.drawText(this._actor.skillMpCost(skill), x, y, width, "right");
        }
    }

    /** @returns {void} */
    updateHelp() {
        this.setHelpWindowItem(this.item());
    }

    /** @returns {void} */
    refresh() {
        this.makeItemList();
        super.refresh();
    }
}

/**
 * The window for displaying parameter changes on the equipment screen.
 */
class Window_EquipStatus extends Window_StatusBase {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        /** @type {Game_Actor | null} */
        this._actor = null;
        /** @type {Game_Actor | null} */
        this._tempActor = null;
        this.refresh();
    }

    /**
     * @param {Game_Actor} actor
     * @returns {void}
     */
    setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    }

    /** @returns {number} */
    colSpacing() {
        return 0;
    }

    /** @returns {void} */
    refresh() {
        this.contents.clear();
        if (this._actor) {
            const nameRect = this.itemLineRect(0);
            this.drawActorName(this._actor, nameRect.x, 0, nameRect.width);
            this.drawActorFace(this._actor, nameRect.x, nameRect.height);
            this.drawAllParams();
        }
    }

    /**
     * @param {Game_Actor | null} tempActor
     * @returns {void}
     */
    setTempActor(tempActor) {
        if (this._tempActor !== tempActor) {
            this._tempActor = tempActor;
            this.refresh();
        }
    }

    /** @returns {void} */
    drawAllParams() {
        for (let i = 0; i < 6; i++) {
            const x = this.itemPadding();
            const y = this.paramY(i);
            this.drawItem(x, y, 2 + i);
        }
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {RMMZ.ParamID} paramId
     * @returns {void}
     */
    drawItem(x, y, paramId) {
        const paramX = this.paramX();
        const paramWidth = this.paramWidth();
        const rightArrowWidth = this.rightArrowWidth();
        this.drawParamName(x, y, paramId);
        if (this._actor) {
            this.drawCurrentParam(paramX, y, paramId);
        }
        this.drawRightArrow(paramX + paramWidth, y);
        if (this._tempActor) {
            this.drawNewParam(paramX + paramWidth + rightArrowWidth, y, paramId);
        }
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {RMMZ.ParamID} paramId
     * @returns {void}
     */
    drawParamName(x, y, paramId) {
        const width = this.paramX() - this.itemPadding() * 2;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.param(paramId), x, y, width);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {RMMZ.ParamID} paramId
     * @returns {void}
     */
    drawCurrentParam(x, y, paramId) {
        const paramWidth = this.paramWidth();
        this.resetTextColor();
        this.drawText(this._actor.param(paramId), x, y, paramWidth, "right");
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    drawRightArrow(x, y) {
        const rightArrowWidth = this.rightArrowWidth();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText("\u2192", x, y, rightArrowWidth, "center");
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {RMMZ.ParamID} paramId
     * @returns {void}
     */
    drawNewParam(x, y, paramId) {
        const paramWidth = this.paramWidth();
        const newValue = this._tempActor.param(paramId);
        const diffvalue = newValue - this._actor.param(paramId);
        this.changeTextColor(ColorManager.paramchangeTextColor(diffvalue));
        this.drawText(newValue, x, y, paramWidth, "right");
    }

    /** @returns {number} */
    rightArrowWidth() {
        return 32;
    }

    /** @returns {number} */
    paramWidth() {
        return 48;
    }

    /** @returns {number} */
    paramX() {
        const itemPadding = this.itemPadding();
        const rightArrowWidth = this.rightArrowWidth();
        const paramWidth = this.paramWidth();
        return this.innerWidth - itemPadding - paramWidth * 2 - rightArrowWidth;
    }

    /**
     * @param {number} index
     * @returns {number}
     */
    paramY(index) {
        const faceHeight = ImageManager.standardFaceHeight;
        return faceHeight + Math.floor(this.lineHeight() * (index + 1.5));
    }
}

/**
 * The window for selecting a command on the equipment screen.
 */
class Window_EquipCommand extends Window_HorzCommand {
    constructor(...args) {
        super(...args);
    }

    initialize(rect) {
        super.initialize(rect);
    }

    /** @returns {number} */
    maxCols() {
        return 3;
    }

    /** @returns {void} */
    makeCommandList() {
        this.addCommand(TextManager.equip2, "equip");
        this.addCommand(TextManager.optimize, "optimize");
        this.addCommand(TextManager.clear, "clear");
    }
}

/**
 * The window for selecting an equipment slot on the equipment screen.
 */
class Window_EquipSlot extends Window_StatusBase {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        /** @type {Game_Actor | null} */
        this._actor = null;
        this.refresh();
    }

    /**
     * @param {Game_Actor} actor
     * @returns {void}
     */
    setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    }

    /** @returns {void} */
    update() {
        super.update();
        if (this._itemWindow) {
            this._itemWindow.setSlotId(this.index());
        }
    }

    /** @returns {number} */
    maxItems() {
        return this._actor ? this._actor.equipSlots().length : 0;
    }

    /** @returns {import("..").DataEquipment | null} */
    item() {
        return this.itemAt(this.index());
    }

    /**
     * @param {number} index
     * @returns {import("..").DataEquipment | null}
     */
    itemAt(index) {
        return this._actor ? this._actor.equips()[index] : null;
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    drawItem(index) {
        if (this._actor) {
            const slotName = this.actorSlotName(this._actor, index);
            const item = this.itemAt(index);
            const slotNameWidth = this.slotNameWidth();
            const rect = this.itemLineRect(index);
            const itemWidth = rect.width - slotNameWidth;
            this.changeTextColor(ColorManager.systemColor());
            this.changePaintOpacity(this.isEnabled(index));
            this.drawText(slotName, rect.x, rect.y, slotNameWidth, rect.height);
            this.drawItemName(item, rect.x + slotNameWidth, rect.y, itemWidth);
            this.changePaintOpacity(true);
        }
    }

    /** @returns {number} */
    slotNameWidth() {
        return 138;
    }

    /**
     * @param {number} index
     * @returns {boolean}
     */
    isEnabled(index) {
        return this._actor ? this._actor.isEquipChangeOk(index) : false;
    }

    /** @returns {boolean} */
    isCurrentItemEnabled() {
        return this.isEnabled(this.index());
    }

    /**
     * @param {Window_EquipStatus} statusWindow
     * @returns {void}
     */
    setStatusWindow(statusWindow) {
        this._statusWindow = statusWindow;
        this.callUpdateHelp();
    }

    /**
     * @param {Window_EquipItem} itemWindow
     * @returns {void}
     */
    setItemWindow(itemWindow) {
        this._itemWindow = itemWindow;
    }

    /** @returns {void} */
    updateHelp() {
        super.updateHelp();
        this.setHelpWindowItem(this.item());
        if (this._statusWindow) {
            this._statusWindow.setTempActor(null);
        }
    }
}

/**
 * The window for selecting an equipment item on the equipment screen.
 */
class Window_EquipItem extends Window_ItemList {
    constructor(...args) {
        super(...args);
    }

    initialize(rect) {
        super.initialize(rect);
        /** @type {Game_Actor | null} */
        this._actor = null;
        /** @type {RMMZ.EquipmentSlotID} */
        this._slotId = 0;
    }

    /** @returns {number} */
    maxCols() {
        return 1;
    }

    /** @returns {number} */
    colSpacing() {
        return 8;
    }

    /**
     * @param {Game_Actor} actor
     * @returns {void}
     */
    setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
            this.scrollTo(0, 0);
        }
    }

    /**
     * @param {RMMZ.EquipmentSlotID} slotId
     * @returns {void}
     */
    setSlotId(slotId) {
        if (this._slotId !== slotId) {
            this._slotId = slotId;
            this.refresh();
            this.scrollTo(0, 0);
        }
    }

    /**
     * @param {RMMZ.DataItemBase | null} item
     * @returns {boolean}
     */
    includes(item) {
        if (item === null) {
            return true;
        }
        return (
            this._actor &&
            this._actor.canEquip(item) &&
            item.etypeId === this.etypeId()
        );
    }

    /** @returns {number} */
    etypeId() {
        if (this._actor && this._slotId >= 0) {
            return this._actor.equipSlots()[this._slotId];
        } else {
            return 0;
        }
    }

    /** @returns {boolean} */
    isEnabled(/*item*/) {
        return true;
    }

    /** @returns {void} */
    selectLast() {
        //
    }

    /**
     * @param {Window_EquipStatus} statusWindow
     * @returns {void}
     */
    setStatusWindow(statusWindow) {
        this._statusWindow = statusWindow;
        this.callUpdateHelp();
    }

    /** @returns {void} */
    updateHelp() {
        super.updateHelp();
        if (this._actor && this._statusWindow && this._slotId >= 0) {
            const actor = JsonEx.makeDeepCopy(this._actor);
            actor.forceChangeEquip(this._slotId, this.item());
            this._statusWindow.setTempActor(actor);
        }
    }

    /** @returns {void} */
    playOkSound() {
        //
    }
}

/**
 * The window for displaying full status on the status screen.
 */
class Window_Status extends Window_StatusBase {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        /** @type {Game_Actor | null} */
        this._actor = null;
        this.refresh();
        this.activate();
    }

    /**
     * @param {Game_Actor} actor
     * @returns {void}
     */
    setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    }

    /** @returns {void} */
    refresh() {
        super.refresh();
        if (this._actor) {
            this.drawBlock1();
            this.drawBlock2();
        }
    }

    /** @returns {void} */
    drawBlock1() {
        const y = this.block1Y();
        this.drawActorName(this._actor, 6, y, 168);
        this.drawActorClass(this._actor, 192, y, 168);
        this.drawActorNickname(this._actor, 432, y, 270);
    }

    /** @returns {number} */
    block1Y() {
        return 0;
    }

    /** @returns {void} */
    drawBlock2() {
        const y = this.block2Y();
        this.drawActorFace(this._actor, 12, y);
        this.drawBasicInfo(204, y);
        this.drawExpInfo(456, y);
    }

    /** @returns {number} */
    block2Y() {
        const lineHeight = this.lineHeight();
        const min = lineHeight;
        const max = this.innerHeight - lineHeight * 4;
        return Math.floor((lineHeight * 1.4).clamp(min, max));
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    drawBasicInfo(x, y) {
        const lineHeight = this.lineHeight();
        this.drawActorLevel(this._actor, x, y + lineHeight * 0);
        this.drawActorIcons(this._actor, x, y + lineHeight * 1);
        this.placeBasicGauges(this._actor, x, y + lineHeight * 2);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    drawExpInfo(x, y) {
        const lineHeight = this.lineHeight();
        const expTotal = TextManager.expTotal.format(TextManager.exp);
        const expNext = TextManager.expNext.format(TextManager.level);
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(expTotal, x, y + lineHeight * 0, 270);
        this.drawText(expNext, x, y + lineHeight * 2, 270);
        this.resetTextColor();
        this.drawText(this.expTotalValue(), x, y + lineHeight * 1, 270, "right");
        this.drawText(this.expNextValue(), x, y + lineHeight * 3, 270, "right");
    }

    /** @returns {number | "-------"} */
    expTotalValue() {
        if (this._actor.isMaxLevel()) {
            return "-------";
        } else {
            return this._actor.currentExp();
        }
    }

    /** @returns {number | "-------"} */
    expNextValue() {
        if (this._actor.isMaxLevel()) {
            return "-------";
        } else {
            return this._actor.nextRequiredExp();
        }
    }
}

/**
 * The window for displaying parameters on the status screen.
 */
class Window_StatusParams extends Window_StatusBase {
    constructor(...args) {
        super(...args);
    }

    initialize(rect) {
        super.initialize(rect);
        /** @type {Game_Actor | null} */
        this._actor = null;
    }

    /**
     * @param {Game_Actor} actor
     * @returns {void}
     */
    setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    }

    /** @returns {number} */
    maxItems() {
        return 6;
    }

    /** @returns {number} */
    itemHeight() {
        return this.lineHeight();
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    drawItem(index) {
        const rect = this.itemLineRect(index);
        const paramId = index + 2;
        const name = TextManager.param(paramId);
        const value = this._actor.param(paramId);
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(name, rect.x, rect.y, 160);
        this.resetTextColor();
        this.drawText(value, rect.x + 160, rect.y, 60, "right");
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    drawItemBackground(/*index*/) {
        //
    }
}

/**
 * The window for displaying equipment items on the status screen.
 */
class Window_StatusEquip extends Window_StatusBase {
    constructor(...args) {
        super(...args);
    }

    initialize(rect) {
        super.initialize(rect);
        /** @type {Game_Actor | null} */
        this._actor = null;
    }

    /**
     * @param {Game_Actor} actor
     * @returns {void}
     */
    setActor(actor) {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    }

    /** @returns {number} */
    maxItems() {
        return this._actor ? this._actor.equipSlots().length : 0;
    }

    /** @returns {number} */
    itemHeight() {
        return this.lineHeight();
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    drawItem(index) {
        const rect = this.itemLineRect(index);
        const equips = this._actor.equips();
        const item = equips[index];
        const slotName = this.actorSlotName(this._actor, index);
        const sw = 138;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(slotName, rect.x, rect.y, sw, rect.height);
        this.drawItemName(item, rect.x + sw, rect.y, rect.width - sw);
    }

    /** @returns {void} */
    drawItemBackground(/*index*/) {
        //
    }
}

/**
 * The window for changing various settings on the options screen.
 */
class Window_Options extends Window_Command {
    constructor(...args) {
        super(...args);
    }

    initialize(rect) {
        super.initialize(rect);
    }

    /** @returns {void} */
    makeCommandList() {
        this.addGeneralOptions();
        this.addVolumeOptions();
    }

    /** @returns {void} */
    addGeneralOptions() {
        this.addCommand(TextManager.alwaysDash, "alwaysDash");
        this.addCommand(TextManager.commandRemember, "commandRemember");
        this.addCommand(TextManager.touchUI, "touchUI");
    }

    /** @returns {void} */
    addVolumeOptions() {
        this.addCommand(TextManager.bgmVolume, "bgmVolume");
        this.addCommand(TextManager.bgsVolume, "bgsVolume");
        this.addCommand(TextManager.meVolume, "meVolume");
        this.addCommand(TextManager.seVolume, "seVolume");
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    drawItem(index) {
        const title = this.commandName(index);
        const status = this.statusText(index);
        const rect = this.itemLineRect(index);
        const statusWidth = this.statusWidth();
        const titleWidth = rect.width - statusWidth;
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(title, rect.x, rect.y, titleWidth, "left");
        this.drawText(status, rect.x + titleWidth, rect.y, statusWidth, "right");
    }

    /** @returns {number} */
    statusWidth() {
        return 120;
    }

    /**
     * @param {number} index
     * @returns {string}
     */
    statusText(index) {
        const symbol = this.commandSymbol(index);
        const value = this.getConfigValue(symbol);
        if (this.isVolumeSymbol(symbol)) {
            return this.volumeStatusText(value);
        } else {
            return this.booleanStatusText(value);
        }
    }

    /**
     * @param {"alwaysDash" | "commandRemember" | "touchUI" | ("bgmVolume" | "bgsVolume" | "meVolume" | "seVolume")} symbol
     * @returns {symbol is "bgmVolume" | "bgsVolume" | "meVolume" | "seVolume"}
     */
    isVolumeSymbol(symbol) {
        return symbol.includes("Volume");
    }

    /**
     * @param {boolean} value
     * @returns {"ON" | "OFF"}
     */
    booleanStatusText(value) {
        return value ? "ON" : "OFF";
    }

    /**
     * @param {number} value
     * @returns {string}
     */
    volumeStatusText(value) {
        return value + "%";
    }

    /** @returns {void} */
    processOk() {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (this.isVolumeSymbol(symbol)) {
            this.changeVolume(symbol, true, true);
        } else {
            this.changeValue(symbol, !this.getConfigValue(symbol));
        }
    }

    /** @returns {void} */
    cursorRight() {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (this.isVolumeSymbol(symbol)) {
            this.changeVolume(symbol, true, false);
        } else {
            this.changeValue(symbol, true);
        }
    }

    /** @returns {void} */
    cursorLeft() {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (this.isVolumeSymbol(symbol)) {
            this.changeVolume(symbol, false, false);
        } else {
            this.changeValue(symbol, false);
        }
    }

    /**
     * @template {"bgmVolume" | "bgsVolume" | "meVolume" | "seVolume"} T
     * @param {T} symbol
     * @param {boolean} forward
     * @param {boolean} wrap
     * @returns {void}
     */
    changeVolume(symbol, forward, wrap) {
        const lastValue = this.getConfigValue(symbol);
        const offset = this.volumeOffset();
        const value = lastValue + (forward ? offset : -offset);
        if (value > 100 && wrap) {
            this.changeValue(symbol, 0);
        } else {
            this.changeValue(symbol, value.clamp(0, 100));
        }
    }

    /** @returns {number} */
    volumeOffset() {
        return 20;
    }

    /**
     * @param {"alwaysDash" | "commandRemember" | "touchUI" | ("bgmVolume" | "bgsVolume" | "meVolume" | "seVolume")} symbol
     * @param {boolean | number} value
     * @returns {void}
     */
    changeValue(symbol, value) {
        const lastValue = this.getConfigValue(symbol);
        if (lastValue !== value) {
            this.setConfigValue(symbol, value);
            this.redrawItem(this.findSymbol(symbol));
            this.playCursorSound();
        }
    }

    /**
     * @template {"alwaysDash" | "commandRemember" | "touchUI" | ("bgmVolume" | "bgsVolume" | "meVolume" | "seVolume")} T
     * @param {T} symbol
     * @returns {typeof ConfigManager[T]}
     */
    getConfigValue(symbol) {
        return ConfigManager[symbol];
    }

    /**
     * @template {"alwaysDash" | "commandRemember" | "touchUI" | ("bgmVolume" | "bgsVolume" | "meVolume" | "seVolume")} T
     * @param {T} symbol
     * @param {typeof ConfigManager[T]} volume
     * @returns {void}
     */
    setConfigValue(symbol, volume) {
        ConfigManager[symbol] = volume;
    }
}

/**
 * The window for selecting a save file on the save and load screens.
 */
class Window_SavefileList extends Window_Selectable {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        this.activate();
        /** @type {("save" | "load") | null} */
        this._mode = null;
        /** @type {boolean} */
        this._autosave = false;
    }

    /**
     * @param {"save" | "load"} mode
     * @param {boolean} autosave
     * @returns {void}
     */
    setMode(mode, autosave) {
        this._mode = mode;
        this._autosave = autosave;
        this.refresh();
    }

    /** @returns {number} */
    maxItems() {
        return DataManager.maxSavefiles() - (this._autosave ? 0 : 1);
    }

    /** @returns {number} */
    numVisibleRows() {
        return 5;
    }

    /** @returns {number} */
    itemHeight() {
        return Math.floor(this.innerHeight / this.numVisibleRows());
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    drawItem(index) {
        const savefileId = this.indexToSavefileId(index);
        const info = DataManager.savefileInfo(savefileId);
        const rect = this.itemRectWithPadding(index);
        this.resetTextColor();
        this.changePaintOpacity(this.isEnabled(savefileId));
        this.drawTitle(savefileId, rect.x, rect.y + 4);
        if (info) {
            this.drawContents(info, rect);
        }
    }

    /**
     * @param {number} index
     * @returns {number}
     */
    indexToSavefileId(index) {
        return index + (this._autosave ? 0 : 1);
    }

    /**
     * @param {number} savefileId
     * @returns {number}
     */
    savefileIdToIndex(savefileId) {
        return savefileId - (this._autosave ? 0 : 1);
    }

    /**
     * @param {number} savefileId
     * @returns {boolean}
     */
    isEnabled(savefileId) {
        if (this._mode === "save") {
            return savefileId > 0;
        } else {
            return !!DataManager.savefileInfo(savefileId);
        }
    }

    /** @returns {number} */
    savefileId() {
        return this.indexToSavefileId(this.index());
    }

    /**
     * @param {number} savefileId
     * @returns {void}
     */
    selectSavefile(savefileId) {
        const index = Math.max(0, this.savefileIdToIndex(savefileId));
        this.select(index);
        this.setTopRow(index - 2);
    }

    /**
     * @param {number} savefileId
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    drawTitle(savefileId, x, y) {
        if (savefileId === 0) {
            this.drawText(TextManager.autosave, x, y, 180);
        } else {
            this.drawText(TextManager.file + " " + savefileId, x, y, 180);
        }
    }

    /**
     * @param {RMMZ.DataSaveInfo} info
     * @param {Rectangle} rect
     * @returns {void}
     */
    drawContents(info, rect) {
        const bottom = rect.y + rect.height;
        if (rect.width >= 420) {
            this.drawPartyCharacters(info, rect.x + 220, bottom - 8);
        }
        const lineHeight = this.lineHeight();
        const y2 = bottom - lineHeight - 4;
        if (y2 >= lineHeight) {
            this.drawPlaytime(info, rect.x, y2, rect.width);
        }
    }

    /**
     * @param {RMMZ.DataSaveInfo} info
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    drawPartyCharacters(info, x, y) {
        if (info.characters) {
            let characterX = x;
            for (const data of info.characters) {
                this.drawCharacter(data[0], data[1], characterX, y);
                characterX += 48;
            }
        }
    }

    /**
     * @param {RMMZ.DataSaveInfo} info
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @returns {void}
     */
    drawPlaytime(info, x, y, width) {
        if (info.playtime) {
            this.drawText(info.playtime, x, y, width, "right");
        }
    }

    /** @returns {void} */
    playOkSound() {
        //
    }
}

/**
 * The window for selecting buy/sell on the shop screen.
 */
class Window_ShopCommand extends Window_HorzCommand {
    constructor(...args) {
        super(...args);
    }

    initialize(rect) {
        super.initialize(rect);
    }

    /**
     * @param {boolean} purchaseOnly
     * @returns {void}
     */
    setPurchaseOnly(purchaseOnly) {
        this._purchaseOnly = purchaseOnly;
        this.refresh();
    }

    /** @returns {number} */
    maxCols() {
        return 3;
    }

    /** @returns {void} */
    makeCommandList() {
        this.addCommand(TextManager.buy, "buy");
        this.addCommand(TextManager.sell, "sell", !this._purchaseOnly);
        this.addCommand(TextManager.cancel, "cancel");
    }
}

/**
 * The window for selecting an item to buy on the shop screen.
 */
class Window_ShopBuy extends Window_Selectable {
    constructor(...args) {
        super(...args);
    }

    initialize(rect) {
        super.initialize(rect);
        /** @type {number} */
        this._money = 0;
    }

    /**
     * @param {RMMZ.ShopGoods[]} shopGoods
     * @returns {void}
     */
    setupGoods(shopGoods) {
        this._shopGoods = shopGoods;
        this.refresh();
        this.select(0);
    }

    /** @returns {number} */
    maxItems() {
        return this._data ? this._data.length : 1;
    }

    /** @returns {RMMZ.DataPricedItemBase | null} */
    item() {
        return this.itemAt(this.index());
    }

    /**
     * @param {number} index
     * @returns {RMMZ.DataPricedItemBase | null}
     */
    itemAt(index) {
        return this._data && index >= 0 ? this._data[index] : null;
    }

    /**
     * @param {number} money
     * @returns {void}
     */
    setMoney(money) {
        this._money = money;
        this.refresh();
    }

    /** @returns {boolean} */
    isCurrentItemEnabled() {
        return this.isEnabled(this._data[this.index()]);
    }

    /**
     * @param {RMMZ.DataPricedItemBase} item
     * @returns {number}
     */
    price(item) {
        return this._price[this._data.indexOf(item)] || 0;
    }

    /**
     * @param {RMMZ.DataPricedItemBase | null} item
     * @returns {boolean}
     */
    isEnabled(item) {
        return (
            item && this.price(item) <= this._money && !$gameParty.hasMaxItems(item)
        );
    }

    /** @returns {void} */
    refresh() {
        this.makeItemList();
        super.refresh();
    }

    /** @returns {void} */
    makeItemList() {
        this._data = [];
        this._price = [];
        for (const goods of this._shopGoods) {
            const item = this.goodsToItem(goods);
            if (item) {
                this._data.push(item);
                this._price.push(goods[2] === 0 ? item.price : goods[3]);
            }
        }
    }

    /**
     * @param {RMMZ.ShopGoods} goods
     * @returns {import("../data").DataItem | import("../data").DataWeapon | import("../data").DataArmor | null}
     */
    goodsToItem(goods) {
        switch (goods[0]) {
            case 0:
                return $dataItems[goods[1]];
            case 1:
                return $dataWeapons[goods[1]];
            case 2:
                return $dataArmors[goods[1]];
            default:
                return null;
        }
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    drawItem(index) {
        const item = this.itemAt(index);
        const price = this.price(item);
        const rect = this.itemLineRect(index);
        const priceWidth = this.priceWidth();
        const priceX = rect.x + rect.width - priceWidth;
        const nameWidth = rect.width - priceWidth;
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x, rect.y, nameWidth);
        this.drawText(price, priceX, rect.y, priceWidth, "right");
        this.changePaintOpacity(true);
    }

    /** @returns {number} */
    priceWidth() {
        return 96;
    }

    /**
     * @param {Window_ShopStatus} statusWindow
     * @returns {void}
     */
    setStatusWindow(statusWindow) {
        this._statusWindow = statusWindow;
        this.callUpdateHelp();
    }

    /** @returns {void} */
    updateHelp() {
        this.setHelpWindowItem(this.item());
        if (this._statusWindow) {
            this._statusWindow.setItem(this.item());
        }
    }
}

/**
 * The window for selecting an item to sell on the shop screen.
 */
class Window_ShopSell extends Window_ItemList {
    constructor(...args) {
        super(...args);
    }

    initialize(rect) {
        super.initialize(rect);
    }

    /**
     * @param {RMMZ.DataPricedItemBase | null} item
     * @returns {boolean}
     */
    isEnabled(item) {
        return item && item.price > 0;
    }
}

/**
 * The window for inputting quantity of items to buy or sell on the shop
 * screen.
 */
class Window_ShopNumber extends Window_Selectable {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        /** @type {RMMZ.DataPricedItemBase | null} */
        this._item = null;
        /** @type {number} */
        this._max = 1;
        /** @type {number} */
        this._price = 0;
        /** @type {number} */
        this._number = 1;
        /** @type {string} */
        this._currencyUnit = TextManager.currencyUnit;
        this.createButtons();
        this.select(0);
        /** @type {boolean} */
        this._canRepeat = false;
    }

    /** @returns {boolean} */
    isScrollEnabled() {
        return false;
    }

    /** @returns {number} */
    number() {
        return this._number;
    }

    /**
     * @param {RMMZ.DataPricedItemBase | null} item
     * @param {number} max
     * @param {number} price
     * @returns {void}
     */
    setup(item, max, price) {
        this._item = item;
        this._max = Math.floor(max);
        this._price = price;
        this._number = 1;
        this.placeButtons();
        this.refresh();
    }

    /**
     * @param {string} currencyUnit
     * @returns {void}
     */
    setCurrencyUnit(currencyUnit) {
        this._currencyUnit = currencyUnit;
        this.refresh();
    }

    /** @returns {void} */
    createButtons() {
        this._buttons = [];
        if (ConfigManager.touchUI) {
            for (const type of ["down2", "down", "up", "up2", "ok"]) {
                const button = new Sprite_Button(type);
                this._buttons.push(button);
                this.addInnerChild(button);
            }
            this._buttons[0].setClickHandler(this.onButtonDown2.bind(this));
            this._buttons[1].setClickHandler(this.onButtonDown.bind(this));
            this._buttons[2].setClickHandler(this.onButtonUp.bind(this));
            this._buttons[3].setClickHandler(this.onButtonUp2.bind(this));
            this._buttons[4].setClickHandler(this.onButtonOk.bind(this));
        }
    }

    /** @returns {void} */
    placeButtons() {
        const sp = this.buttonSpacing();
        const totalWidth = this.totalButtonWidth();
        let x = (this.innerWidth - totalWidth) / 2;
        for (const button of this._buttons) {
            button.x = x;
            button.y = this.buttonY();
            x += button.width + sp;
        }
    }

    /** @returns {number} */
    totalButtonWidth() {
        const sp = this.buttonSpacing();
        return this._buttons.reduce((r, button) => r + button.width + sp, -sp);
    }

    /** @returns {number} */
    buttonSpacing() {
        return 8;
    }

    /** @returns {void} */
    refresh() {
        super.refresh();
        this.drawItemBackground(0);
        this.drawCurrentItemName();
        this.drawMultiplicationSign();
        this.drawNumber();
        this.drawHorzLine();
        this.drawTotalPrice();
    }

    /** @returns {void} */
    drawCurrentItemName() {
        const padding = this.itemPadding();
        const x = padding * 2;
        const y = this.itemNameY();
        const width = this.multiplicationSignX() - padding * 3;
        this.drawItemName(this._item, x, y, width);
    }

    /** @returns {void} */
    drawMultiplicationSign() {
        const sign = this.multiplicationSign();
        const width = this.textWidth(sign);
        const x = this.multiplicationSignX();
        const y = this.itemNameY();
        this.resetTextColor();
        this.drawText(sign, x, y, width);
    }

    /** @returns {string} */
    multiplicationSign() {
        return "\u00d7";
    }

    /** @returns {number} */
    multiplicationSignX() {
        const sign = this.multiplicationSign();
        const width = this.textWidth(sign);
        return this.cursorX() - width * 2;
    }

    /** @returns {void} */
    drawNumber() {
        const x = this.cursorX();
        const y = this.itemNameY();
        const width = this.cursorWidth() - this.itemPadding();
        this.resetTextColor();
        this.drawText(this._number, x, y, width, "right");
    }

    /** @returns {void} */
    drawHorzLine() {
        const padding = this.itemPadding();
        const lineHeight = this.lineHeight();
        const itemY = this.itemNameY();
        const totalY = this.totalPriceY();
        const x = padding;
        const y = Math.floor((itemY + totalY + lineHeight) / 2);
        const width = this.innerWidth - padding * 2;
        this.drawRect(x, y, width, 5);
    }

    /** @returns {void} */
    drawTotalPrice() {
        const padding = this.itemPadding();
        const total = this._price * this._number;
        const width = this.innerWidth - padding * 2;
        const y = this.totalPriceY();
        this.drawCurrencyValue(total, this._currencyUnit, 0, y, width);
    }

    /** @returns {number} */
    itemNameY() {
        return Math.floor(this.innerHeight / 2 - this.lineHeight() * 1.5);
    }

    /** @returns {number} */
    totalPriceY() {
        return Math.floor(this.itemNameY() + this.lineHeight() * 2);
    }

    /** @returns {number} */
    buttonY() {
        return Math.floor(this.totalPriceY() + this.lineHeight() * 2);
    }

    /** @returns {number} */
    cursorWidth() {
        const padding = this.itemPadding();
        const digitWidth = this.textWidth("0");
        return this.maxDigits() * digitWidth + padding * 2;
    }

    /** @returns {number} */
    cursorX() {
        const padding = this.itemPadding();
        return this.innerWidth - this.cursorWidth() - padding * 2;
    }

    /** @returns {number} */
    maxDigits() {
        return 2;
    }

    /** @returns {void} */
    update() {
        super.update();
        this.processNumberChange();
    }

    /** @returns {void} */
    playOkSound() {
        //
    }

    /** @returns {void} */
    processNumberChange() {
        if (this.isOpenAndActive()) {
            if (Input.isRepeated("right")) {
                this.changeNumber(1);
            }
            if (Input.isRepeated("left")) {
                this.changeNumber(-1);
            }
            if (Input.isRepeated("up")) {
                this.changeNumber(10);
            }
            if (Input.isRepeated("down")) {
                this.changeNumber(-10);
            }
        }
    }

    /**
     * @param {number} amount
     * @returns {void}
     */
    changeNumber(amount) {
        const lastNumber = this._number;
        this._number = (this._number + amount).clamp(1, this._max);
        if (this._number !== lastNumber) {
            this.playCursorSound();
            this.refresh();
        }
    }

    /** @returns {Rectangle} */
    itemRect() {
        const rect = new PIXI.Rectangle();
        rect.x = this.cursorX();
        rect.y = this.itemNameY();
        rect.width = this.cursorWidth();
        rect.height = this.lineHeight();
        return rect;
    }

    /** @returns {boolean} */
    isTouchOkEnabled() {
        return false;
    }

    /** @returns {void} */
    onButtonUp() {
        this.changeNumber(1);
    }

    /** @returns {void} */
    onButtonUp2() {
        this.changeNumber(10);
    }

    /** @returns {void} */
    onButtonDown() {
        this.changeNumber(-1);
    }

    /** @returns {void} */
    onButtonDown2() {
        this.changeNumber(-10);
    }

    /** @returns {void} */
    onButtonOk() {
        this.processOk();
    }
}

/**
 * The window for displaying number of items in possession and the actor's
 * equipment on the shop screen.
 */
class Window_ShopStatus extends Window_StatusBase {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        /** @type {RMMZ.DataPricedItemBase | null} */
        this._item = null;
        /** @type {number} */
        this._pageIndex = 0;
        this.refresh();
    }

    /** @returns {void} */
    refresh() {
        this.contents.clear();
        if (this._item) {
            const x = this.itemPadding();
            this.drawPossession(x, 0);
            if (this.isEquipItem()) {
                const y = Math.floor(this.lineHeight() * 1.5);
                this.drawEquipInfo(x, y);
            }
        }
    }

    /**
     * @param {RMMZ.DataPricedItemBase | null} item
     * @returns {void}
     */
    setItem(item) {
        this._item = item;
        this.refresh();
    }

    /** @returns {boolean} */
    isEquipItem() {
        return DataManager.isWeapon(this._item) || DataManager.isArmor(this._item);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    drawPossession(x, y) {
        const width = this.innerWidth - this.itemPadding() - x;
        const possessionWidth = this.textWidth("0000");
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.possession, x, y, width - possessionWidth);
        this.resetTextColor();
        this.drawText($gameParty.numItems(this._item), x, y, width, "right");
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    drawEquipInfo(x, y) {
        const members = this.statusMembers();
        for (let i = 0; i < members.length; i++) {
            const actorY = y + Math.floor(this.lineHeight() * i * 2.2);
            this.drawActorEquipInfo(x, actorY, members[i]);
        }
    }

    /** @returns {Game_Actor[]} */
    statusMembers() {
        const start = this._pageIndex * this.pageSize();
        const end = start + this.pageSize();
        return $gameParty.members().slice(start, end);
    }

    /** @returns {number} */
    pageSize() {
        return 4;
    }

    /** @returns {number} */
    maxPages() {
        return Math.floor(
            ($gameParty.size() + this.pageSize() - 1) / this.pageSize()
        );
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {Game_Actor} actor
     * @returns {void}
     */
    drawActorEquipInfo(x, y, actor) {
        const item1 = this.currentEquippedItem(actor, this._item.etypeId);
        const width = this.innerWidth - x - this.itemPadding();
        const enabled = actor.canEquip(this._item);
        this.changePaintOpacity(enabled);
        this.resetTextColor();
        this.drawText(actor.name(), x, y, width);
        if (enabled) {
            this.drawActorParamChange(x, y, actor, item1);
        }
        this.drawItemName(item1, x, y + this.lineHeight(), width);
        this.changePaintOpacity(true);
    }

    // prettier-ignore
    /**
     * @param {number} x
     * @param {number} y
     * @param {Game_Actor} actor
     * @param {RMMZ.DataEquipment | null} item1
     * @returns {void}
     */
    drawActorParamChange(
        x, y, actor, item1
    ) {
        const width = this.innerWidth - this.itemPadding() - x;
        const paramId = this.paramId();
        const change =
            this._item.params[paramId] - (item1 ? item1.params[paramId] : 0);
        this.changeTextColor(ColorManager.paramchangeTextColor(change));
        this.drawText((change > 0 ? "+" : "") + change, x, y, width, "right");
    }

    /** @returns {RMMZ.ParamID} */
    paramId() {
        return DataManager.isWeapon(this._item) ? 2 : 3;
    }

    /**
     * @param {Game_Actor} actor
     * @param {RMMZ.EquipmentType} etypeId
     * @returns {RMMZ.DataEquipment | null}
     */
    currentEquippedItem(actor, etypeId) {
        const list = [];
        const equips = actor.equips();
        const slots = actor.equipSlots();
        for (let i = 0; i < slots.length; i++) {
            if (slots[i] === etypeId) {
                list.push(equips[i]);
            }
        }
        const paramId = this.paramId();
        let worstParam = Number.MAX_VALUE;
        let worstItem = null;
        for (const item of list) {
            if (item && item.params[paramId] < worstParam) {
                worstParam = item.params[paramId];
                worstItem = item;
            }
        }
        return worstItem;
    }

    /** @returns {void} */
    update() {
        super.update();
        this.updatePage();
    }

    /** @returns {void} */
    updatePage() {
        if (this.isPageChangeEnabled() && this.isPageChangeRequested()) {
            this.changePage();
        }
    }

    /** @returns {boolean} */
    isPageChangeEnabled() {
        return this.visible && this.maxPages() >= 2;
    }

    /** @returns {boolean} */
    isPageChangeRequested() {
        if (Input.isTriggered("shift")) {
            return true;
        }
        if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
            return true;
        }
        return false;
    }

    /** @returns {void} */
    changePage() {
        this._pageIndex = (this._pageIndex + 1) % this.maxPages();
        this.refresh();
        this.playCursorSound();
    }
}

/**
 * The window for editing an actor's name on the name input screen.
 */
class Window_NameEdit extends Window_StatusBase {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        /** @type {Game_Actor | null} */
        this._actor = null;
        /** @type {number} */
        this._maxLength = 0;
        /** @type {string} */
        this._name = "";
        /** @type {number} */
        this._index = 0;
        /** @type {string} */
        this._defaultName = 0;
        this.deactivate();
    }

    /**
     * @param {Game_Actor} actor
     * @param {number} maxLength
     * @returns {void}
     */
    setup(actor, maxLength) {
        this._actor = actor;
        this._maxLength = maxLength;
        this._name = actor.name().slice(0, this._maxLength);
        this._index = this._name.length;
        this._defaultName = this._name;
        ImageManager.loadFace(actor.faceName());
    }

    /** @returns {string} */
    name() {
        return this._name;
    }

    /** @returns {boolean} */
    restoreDefault() {
        this._name = this._defaultName;
        this._index = this._name.length;
        this.refresh();
        return this._name.length > 0;
    }

    /**
     * @param {string} ch
     * @returns {boolean}
     */
    add(ch) {
        if (this._index < this._maxLength) {
            this._name += ch;
            this._index++;
            this.refresh();
            return true;
        } else {
            return false;
        }
    }

    /** @returns {boolean} */
    back() {
        if (this._index > 0) {
            this._index--;
            this._name = this._name.slice(0, this._index);
            this.refresh();
            return true;
        } else {
            return false;
        }
    }

    /** @returns {number} */
    faceWidth() {
        return 144;
    }

    /** @returns {number} */
    charWidth() {
        const text = $gameSystem.isJapanese() ? "\uff21" : "A";
        return this.textWidth(text);
    }

    /** @returns {number} */
    left() {
        const nameCenter = (this.innerWidth + this.faceWidth()) / 2;
        const nameWidth = (this._maxLength + 1) * this.charWidth();
        return Math.min(nameCenter - nameWidth / 2, this.innerWidth - nameWidth);
    }

    /**
     * @param {number} index
     * @returns {Rectangle}
     */
    itemRect(index) {
        const x = this.left() + index * this.charWidth();
        const y = 54;
        const width = this.charWidth();
        const height = this.lineHeight();
        return new PIXI.Rectangle(x, y, width, height);
    }

    /**
     * @param {number} index
     * @returns {Rectangle}
     */
    underlineRect(index) {
        const rect = this.itemRect(index);
        rect.x++;
        rect.y += rect.height - 4;
        rect.width -= 2;
        rect.height = 2;
        return rect;
    }

    /** @returns {string} */
    underlineColor() {
        return ColorManager.normalColor();
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    drawUnderline(index) {
        const rect = this.underlineRect(index);
        const color = this.underlineColor();
        this.contents.paintOpacity = 48;
        this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
        this.contents.paintOpacity = 255;
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    drawChar(index) {
        const rect = this.itemRect(index);
        this.resetTextColor();
        this.drawText(this._name[index] || "", rect.x, rect.y);
    }

    /** @returns {void} */
    refresh() {
        this.contents.clear();
        this.drawActorFace(this._actor, 0, 0);
        for (let i = 0; i < this._maxLength; i++) {
            this.drawUnderline(i);
        }
        for (let j = 0; j < this._name.length; j++) {
            this.drawChar(j);
        }
        const rect = this.itemRect(this._index);
        this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
    }
}

/**
 * The window for selecting text characters on the name input screen.
 */
class Window_NameInput extends Window_Selectable {
    constructor(...args) {
        super(...args);
    }

    // prettier-ignore
    /** @type {string[]} */
    static LATIN1 = [ "A","B","C","D","E",  "a","b","c","d","e",
              "F","G","H","I","J",  "f","g","h","i","j",
              "K","L","M","N","O",  "k","l","m","n","o",
              "P","Q","R","S","T",  "p","q","r","s","t",
              "U","V","W","X","Y",  "u","v","w","x","y",
              "Z","[","]","^","_",  "z","{","}","|","~",
              "0","1","2","3","4",  "!","#","$","%","&",
              "5","6","7","8","9",  "(",")","*","+","-",
              "/","=","@","<",">",  ":",";"," ","Page","OK" ];

    // prettier-ignore
    /** @type {string[]} */
    static LATIN2 = [ "Á","É","Í","Ó","Ú",  "á","é","í","ó","ú",
              "À","È","Ì","Ò","Ù",  "à","è","ì","ò","ù",
              "Â","Ê","Î","Ô","Û",  "â","ê","î","ô","û",
              "Ä","Ë","Ï","Ö","Ü",  "ä","ë","ï","ö","ü",
              "Ā","Ē","Ī","Ō","Ū",  "ā","ē","ī","ō","ū",
              "Ã","Å","Æ","Ç","Ð",  "ã","å","æ","ç","ð",
              "Ñ","Õ","Ø","Š","Ŵ",  "ñ","õ","ø","š","ŵ",
              "Ý","Ŷ","Ÿ","Ž","Þ",  "ý","ÿ","ŷ","ž","þ",
              "Ĳ","Œ","ĳ","œ","ß",  "«","»"," ","Page","OK" ];

    // prettier-ignore
    /** @type {string[]} */
    static RUSSIA = [ "А","Б","В","Г","Д",  "а","б","в","г","д",
              "Е","Ё","Ж","З","И",  "е","ё","ж","з","и",
              "Й","К","Л","М","Н",  "й","к","л","м","н",
              "О","П","Р","С","Т",  "о","п","р","с","т",
              "У","Ф","Х","Ц","Ч",  "у","ф","х","ц","ч",
              "Ш","Щ","Ъ","Ы","Ь",  "ш","щ","ъ","ы","ь",
              "Э","Ю","Я","^","_",  "э","ю","я","%","&",
              "0","1","2","3","4",  "(",")","*","+","-",
              "5","6","7","8","9",  ":",";"," ","","OK" ];

    // prettier-ignore
    /** @type {string[]} */
    static JAPAN1 = [ "あ","い","う","え","お",  "が","ぎ","ぐ","げ","ご",
              "か","き","く","け","こ",  "ざ","じ","ず","ぜ","ぞ",
              "さ","し","す","せ","そ",  "だ","ぢ","づ","で","ど",
              "た","ち","つ","て","と",  "ば","び","ぶ","べ","ぼ",
              "な","に","ぬ","ね","の",  "ぱ","ぴ","ぷ","ぺ","ぽ",
              "は","ひ","ふ","へ","ほ",  "ぁ","ぃ","ぅ","ぇ","ぉ",
              "ま","み","む","め","も",  "っ","ゃ","ゅ","ょ","ゎ",
              "や","ゆ","よ","わ","ん",  "ー","～","・","＝","☆",
              "ら","り","る","れ","ろ",  "ゔ","を","　","カナ","決定" ];

    // prettier-ignore
    /** @type {string[]} */
    static JAPAN2 = [ "ア","イ","ウ","エ","オ",  "ガ","ギ","グ","ゲ","ゴ",
              "カ","キ","ク","ケ","コ",  "ザ","ジ","ズ","ゼ","ゾ",
              "サ","シ","ス","セ","ソ",  "ダ","ヂ","ヅ","デ","ド",
              "タ","チ","ツ","テ","ト",  "バ","ビ","ブ","ベ","ボ",
              "ナ","ニ","ヌ","ネ","ノ",  "パ","ピ","プ","ペ","ポ",
              "ハ","ヒ","フ","ヘ","ホ",  "ァ","ィ","ゥ","ェ","ォ",
              "マ","ミ","ム","メ","モ",  "ッ","ャ","ュ","ョ","ヮ",
              "ヤ","ユ","ヨ","ワ","ン",  "ー","～","・","＝","☆",
              "ラ","リ","ル","レ","ロ",  "ヴ","ヲ","　","英数","決定" ];

    // prettier-ignore
    /** @type {string[]} */
    static JAPAN3 = [ "Ａ","Ｂ","Ｃ","Ｄ","Ｅ",  "ａ","ｂ","ｃ","ｄ","ｅ",
              "Ｆ","Ｇ","Ｈ","Ｉ","Ｊ",  "ｆ","ｇ","ｈ","ｉ","ｊ",
              "Ｋ","Ｌ","Ｍ","Ｎ","Ｏ",  "ｋ","ｌ","ｍ","ｎ","ｏ",
              "Ｐ","Ｑ","Ｒ","Ｓ","Ｔ",  "ｐ","ｑ","ｒ","ｓ","ｔ",
              "Ｕ","Ｖ","Ｗ","Ｘ","Ｙ",  "ｕ","ｖ","ｗ","ｘ","ｙ",
              "Ｚ","［","］","＾","＿",  "ｚ","｛","｝","｜","～",
              "０","１","２","３","４",  "！","＃","＄","％","＆",
              "５","６","７","８","９",  "（","）","＊","＋","－",
              "／","＝","＠","＜","＞",  "：","；","　","かな","決定" ];

    initialize(rect) {
        super.initialize(rect);
        /** @type {Window_NameEdit | null} */
        this._editWindow = null;
        /** @type {number} */
        this._page = 0;
        /** @type {number} */
        this._index = 0;
    }

    /**
     * @param {Window_NameEdit} editWindow
     * @returns {void}
     */
    setEditWindow(editWindow) {
        this._editWindow = editWindow;
        this.refresh();
        this.updateCursor();
        this.activate();
    }

    /** @returns {string[][]} */
    table() {
        if ($gameSystem.isJapanese()) {
            return [
                Window_NameInput.JAPAN1,
                Window_NameInput.JAPAN2,
                Window_NameInput.JAPAN3
            ];
        } else if ($gameSystem.isRussian()) {
            return [Window_NameInput.RUSSIA];
        } else {
            return [Window_NameInput.LATIN1, Window_NameInput.LATIN2];
        }
    }

    /** @returns {number} */
    maxCols() {
        return 10;
    }

    /** @returns {number} */
    maxItems() {
        return 90;
    }

    /** @returns {number} */
    itemWidth() {
        return Math.floor((this.innerWidth - this.groupSpacing()) / 10);
    }

    /** @returns {number} */
    groupSpacing() {
        return 24;
    }

    /** @returns {string} */
    character() {
        return this._index < 88 ? this.table()[this._page][this._index] : "";
    }

    /** @returns {boolean} */
    isPageChange() {
        return this._index === 88;
    }

    /** @returns {boolean} */
    isOk() {
        return this._index === 89;
    }

    /**
     * @param {number} index
     * @returns {Rectangle}
     */
    itemRect(index) {
        const itemWidth = this.itemWidth();
        const itemHeight = this.itemHeight();
        const colSpacing = this.colSpacing();
        const rowSpacing = this.rowSpacing();
        const groupSpacing = this.groupSpacing();
        const col = index % 10;
        const group = Math.floor(col / 5);
        const x = col * itemWidth + group * groupSpacing + colSpacing / 2;
        const y = Math.floor(index / 10) * itemHeight + rowSpacing / 2;
        const width = itemWidth - colSpacing;
        const height = itemHeight - rowSpacing;
        return new PIXI.Rectangle(x, y, width, height);
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    drawItem(index) {
        const table = this.table();
        const character = table[this._page][index];
        const rect = this.itemLineRect(index);
        this.drawText(character, rect.x, rect.y, rect.width, "center");
    }

    /** @returns {void} */
    updateCursor() {
        const rect = this.itemRect(this._index);
        this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
    }

    /** @returns {boolean} */
    isCursorMovable() {
        return this.active;
    }

    /**
     * @param {boolean} wrap
     * @returns {void}
     */
    cursorDown(wrap) {
        if (this._index < 80 || wrap) {
            this._index = (this._index + 10) % 90;
        }
    }

    /**
     * @param {boolean} wrap
     * @returns {void}
     */
    cursorUp(wrap) {
        if (this._index >= 10 || wrap) {
            this._index = (this._index + 80) % 90;
        }
    }

    /**
     * @param {boolean} wrap
     * @returns {void}
     */
    cursorRight(wrap) {
        if (this._index % 10 < 9) {
            this._index++;
        } else if (wrap) {
            this._index -= 9;
        }
    }

    /**
     * @param {boolean} wrap
     * @returns {void}
     */
    cursorLeft(wrap) {
        if (this._index % 10 > 0) {
            this._index--;
        } else if (wrap) {
            this._index += 9;
        }
    }

    /** @returns {void} */
    cursorPagedown() {
        this._page = (this._page + 1) % this.table().length;
        this.refresh();
    }

    /** @returns {void} */
    cursorPageup() {
        this._page = (this._page + this.table().length - 1) % this.table().length;
        this.refresh();
    }

    /** @returns {void} */
    processCursorMove() {
        const lastPage = this._page;
        super.processCursorMove();
        this.updateCursor();
        if (this._page !== lastPage) {
            this.playCursorSound();
        }
    }

    /** @returns {void} */
    processHandling() {
        if (this.isOpen() && this.active) {
            if (Input.isTriggered("shift")) {
                this.processJump();
            }
            if (Input.isRepeated("cancel")) {
                this.processBack();
            }
            if (Input.isRepeated("ok")) {
                this.processOk();
            }
        }
    }

    /** @returns {boolean} */
    isCancelEnabled() {
        return true;
    }

    /** @returns {void} */
    processCancel() {
        this.processBack();
    }

    /** @returns {void} */
    processJump() {
        if (this._index !== 89) {
            this._index = 89;
            this.playCursorSound();
        }
    }

    /** @returns {void} */
    processBack() {
        if (this._editWindow.back()) {
            SoundManager.playCancel();
        }
    }

    /** @returns {void} */
    processOk() {
        if (this.character()) {
            this.onNameAdd();
        } else if (this.isPageChange()) {
            this.playOkSound();
            this.cursorPagedown();
        } else if (this.isOk()) {
            this.onNameOk();
        }
    }

    /** @returns {void} */
    onNameAdd() {
        if (this._editWindow.add(this.character())) {
            this.playOkSound();
        } else {
            this.playBuzzerSound();
        }
    }

    /** @returns {void} */
    onNameOk() {
        if (this._editWindow.name() === "") {
            if (this._editWindow.restoreDefault()) {
                this.playOkSound();
            } else {
                this.playBuzzerSound();
            }
        } else {
            this.playOkSound();
            this.callOkHandler();
        }
    }
}

/**
 * The window for displaying a speaker name above the message window.
 */
class Window_NameBox extends Window_Base {
    /** @param {[]} args */
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize(new PIXI.Rectangle());
        this.openness = 0;
        /** @type {string} */
        this._name = "";
    }

    /**
     * @param {Window_Message} messageWindow
     * @returns {void}
     */
    setMessageWindow(messageWindow) {
        this._messageWindow = messageWindow;
    }

    /**
     * @param {string} name
     * @returns {void}
     */
    setName(name) {
        if (this._name !== name) {
            this._name = name;
            this.refresh();
        }
    }

    /** @returns {void} */
    clear() {
        this.setName("");
    }

    /** @returns {void} */
    start() {
        this.updatePlacement();
        this.updateBackground();
        this.createContents();
        this.refresh();
    }

    /** @returns {void} */
    updatePlacement() {
        this.width = this.windowWidth();
        this.height = this.windowHeight();
        const messageWindow = this._messageWindow;
        if ($gameMessage.isRTL()) {
            this.x = messageWindow.x + messageWindow.width - this.width;
        } else {
            this.x = messageWindow.x;
        }
        if (messageWindow.y > 0) {
            this.y = messageWindow.y - this.height;
        } else {
            this.y = messageWindow.y + messageWindow.height;
        }
    }

    /** @returns {void} */
    updateBackground() {
        this.setBackgroundType($gameMessage.background());
    }

    /** @returns {number} */
    windowWidth() {
        if (this._name) {
            const textWidth = this.textSizeEx(this._name).width;
            const padding = this.padding + this.itemPadding();
            const width = Math.ceil(textWidth) + padding * 2;
            return Math.min(width, Graphics.boxWidth);
        } else {
            return 0;
        }
    }

    /** @returns {number} */
    windowHeight() {
        return this.fittingHeight(1);
    }

    /** @returns {void} */
    refresh() {
        const rect = this.baseTextRect();
        this.contents.clear();
        this.drawTextEx(this._name, rect.x, rect.y, rect.width);
    }
}

/**
 * The window used for the event command [Show Choices].
 */
class Window_ChoiceList extends Window_Command {
    /** @param {[]} args */
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize(new PIXI.Rectangle());
        this.createCancelButton();
        this.openness = 0;
        this.deactivate();
        /** @type {RMMZ.TextWindowBackgroundType} */
        this._background = 0;
        /** @type {boolean} */
        this._canRepeat = false;
    }

    /**
     * @param {Window_Message} messageWindow
     * @returns {void}
     */
    setMessageWindow(messageWindow) {
        this._messageWindow = messageWindow;
    }

    /** @returns {void} */
    createCancelButton() {
        if (ConfigManager.touchUI) {
            this._cancelButton = new Sprite_Button("cancel");
            this._cancelButton.visible = false;
            this.addChild(this._cancelButton);
        }
    }

    /** @returns {void} */
    start() {
        this.updatePlacement();
        this.updateBackground();
        this.placeCancelButton();
        this.createContents();
        this.refresh();
        this.scrollTo(0, 0);
        this.selectDefault();
        this.open();
        this.activate();
    }

    /** @returns {void} */
    update() {
        super.update();
        this.updateCancelButton();
    }

    /** @returns {void} */
    updateCancelButton() {
        if (this._cancelButton) {
            this._cancelButton.visible = this.needsCancelButton() && this.isOpen();
        }
    }

    /** @returns {void} */
    selectDefault() {
        this.select($gameMessage.choiceDefaultType());
    }

    /** @returns {void} */
    updatePlacement() {
        this.x = this.windowX();
        this.y = this.windowY();
        this.width = this.windowWidth();
        this.height = this.windowHeight();
    }

    /** @returns {void} */
    updateBackground() {
        this._background = $gameMessage.choiceBackground();
        this.setBackgroundType(this._background);
    }

    /** @returns {void} */
    placeCancelButton() {
        if (this._cancelButton) {
            const spacing = 8;
            const button = this._cancelButton;
            const right = this.x + this.width;
            if (right < Graphics.boxWidth - button.width + spacing) {
                button.x = this.width + spacing;
            } else {
                button.x = -button.width - spacing;
            }
            button.y = this.height / 2 - button.height / 2;
        }
    }

    /** @returns {number} */
    windowX() {
        const positionType = $gameMessage.choicePositionType();
        if (positionType === 1) {
            return (Graphics.boxWidth - this.windowWidth()) / 2;
        } else if (positionType === 2) {
            return Graphics.boxWidth - this.windowWidth();
        } else {
            return 0;
        }
    }

    /** @returns {number} */
    windowY() {
        const messageY = this._messageWindow.y;
        if (messageY >= Graphics.boxHeight / 2) {
            return messageY - this.windowHeight();
        } else {
            return messageY + this._messageWindow.height;
        }
    }

    /** @returns {number} */
    windowWidth() {
        const width = this.maxChoiceWidth() + this.colSpacing() + this.padding * 2;
        return Math.min(width, Graphics.boxWidth);
    }

    /** @returns {number} */
    windowHeight() {
        return this.fittingHeight(this.numVisibleRows());
    }

    /** @returns {number} */
    numVisibleRows() {
        const choices = $gameMessage.choices();
        return Math.min(choices.length, this.maxLines());
    }

    /** @returns {4 | 8} */
    maxLines() {
        const messageWindow = this._messageWindow;
        const messageY = messageWindow ? messageWindow.y : 0;
        const messageHeight = messageWindow ? messageWindow.height : 0;
        const centerY = Graphics.boxHeight / 2;
        if (messageY < centerY && messageY + messageHeight > centerY) {
            return 4;
        } else {
            return 8;
        }
    }

    /** @returns {number} */
    maxChoiceWidth() {
        let maxWidth = 96;
        const choices = $gameMessage.choices();
        for (const choice of choices) {
            const textWidth = this.textSizeEx(choice).width;
            const choiceWidth = Math.ceil(textWidth) + this.itemPadding() * 2;
            if (maxWidth < choiceWidth) {
                maxWidth = choiceWidth;
            }
        }
        return maxWidth;
    }

    /** @returns {void} */
    makeCommandList() {
        const choices = $gameMessage.choices();
        for (const choice of choices) {
            this.addCommand(choice, "choice");
        }
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    drawItem(index) {
        const rect = this.itemLineRect(index);
        this.drawTextEx(this.commandName(index), rect.x, rect.y, rect.width);
    }

    /** @returns {boolean} */
    isCancelEnabled() {
        return $gameMessage.choiceCancelType() !== -1;
    }

    /** @returns {boolean} */
    needsCancelButton() {
        return $gameMessage.choiceCancelType() === -2;
    }

    /** @returns {void} */
    callOkHandler() {
        $gameMessage.onChoice(this.index());
        this._messageWindow.terminateMessage();
        this.close();
    }

    /** @returns {void} */
    callCancelHandler() {
        $gameMessage.onChoice($gameMessage.choiceCancelType());
        this._messageWindow.terminateMessage();
        this.close();
    }
}

/**
 * The window used for the event command [Input Number].
 */
class Window_NumberInput extends Window_Selectable {
    /** @param {[]} args */
    constructor(...args) {
        super(...args);
    }

    initialize() {
        super.initialize(new PIXI.Rectangle());
        /** @type {number} */
        this._number = 0;
        /** @type {number} */
        this._maxDigits = 1;
        this.openness = 0;
        this.createButtons();
        this.deactivate();
        /** @type {boolean} */
        this._canRepeat = false;
    }

    /**
     * @param {Window_Message} messageWindow
     * @returns {void}
     */
    setMessageWindow(messageWindow) {
        this._messageWindow = messageWindow;
    }

    /** @returns {void} */
    start() {
        this._maxDigits = $gameMessage.numInputMaxDigits();
        this._number = $gameVariables.value($gameMessage.numInputVariableId());
        this._number = this._number.clamp(0, Math.pow(10, this._maxDigits) - 1);
        this.updatePlacement();
        this.placeButtons();
        this.createContents();
        this.refresh();
        this.open();
        this.activate();
        this.select(0);
    }

    /** @returns {void} */
    updatePlacement() {
        const messageY = this._messageWindow.y;
        const spacing = 8;
        this.width = this.windowWidth();
        this.height = this.windowHeight();
        this.x = (Graphics.boxWidth - this.width) / 2;
        if (messageY >= Graphics.boxHeight / 2) {
            this.y = messageY - this.height - spacing;
        } else {
            this.y = messageY + this._messageWindow.height + spacing;
        }
    }

    /** @returns {number} */
    windowWidth() {
        const totalItemWidth = this.maxCols() * this.itemWidth();
        const totalButtonWidth = this.totalButtonWidth();
        return Math.max(totalItemWidth, totalButtonWidth) + this.padding * 2;
    }

    /** @returns {number} */
    windowHeight() {
        if (ConfigManager.touchUI) {
            return this.fittingHeight(1) + this.buttonSpacing() + 48;
        } else {
            return this.fittingHeight(1);
        }
    }

    /** @returns {number} */
    maxCols() {
        return this._maxDigits;
    }

    /** @returns {number} */
    maxItems() {
        return this._maxDigits;
    }

    /** @returns {number} */
    itemWidth() {
        return 48;
    }

    /**
     * @param {number} index
     * @returns {Rectangle}
     */
    itemRect(index) {
        const rect = super.itemRect(index);
        const innerMargin = this.innerWidth - this.maxCols() * this.itemWidth();
        rect.x += innerMargin / 2;
        return rect;
    }

    /** @returns {boolean} */
    isScrollEnabled() {
        return false;
    }

    /** @returns {boolean} */
    isHoverEnabled() {
        return false;
    }

    /** @returns {void} */
    createButtons() {
        this._buttons = [];
        if (ConfigManager.touchUI) {
            for (const type of ["down", "up", "ok"]) {
                const button = new Sprite_Button(type);
                this._buttons.push(button);
                this.addInnerChild(button);
            }
            this._buttons[0].setClickHandler(this.onButtonDown.bind(this));
            this._buttons[1].setClickHandler(this.onButtonUp.bind(this));
            this._buttons[2].setClickHandler(this.onButtonOk.bind(this));
        }
    }

    /** @returns {void} */
    placeButtons() {
        const sp = this.buttonSpacing();
        const totalWidth = this.totalButtonWidth();
        let x = (this.innerWidth - totalWidth) / 2;
        for (const button of this._buttons) {
            button.x = x;
            button.y = this.buttonY();
            x += button.width + sp;
        }
    }

    /** @returns {number} */
    totalButtonWidth() {
        const sp = this.buttonSpacing();
        return this._buttons.reduce((r, button) => r + button.width + sp, -sp);
    }

    /** @returns {number} */
    buttonSpacing() {
        return 8;
    }

    /** @returns {number} */
    buttonY() {
        return this.itemHeight() + this.buttonSpacing();
    }

    /** @returns {void} */
    update() {
        super.update();
        this.processDigitChange();
    }

    /** @returns {void} */
    processDigitChange() {
        if (this.isOpenAndActive()) {
            if (Input.isRepeated("up")) {
                this.changeDigit(true);
            } else if (Input.isRepeated("down")) {
                this.changeDigit(false);
            }
        }
    }

    /**
     * @param {boolean} up
     * @returns {void}
     */
    changeDigit(up) {
        const index = this.index();
        const place = Math.pow(10, this._maxDigits - 1 - index);
        let n = Math.floor(this._number / place) % 10;
        this._number -= n * place;
        if (up) {
            n = (n + 1) % 10;
        } else {
            n = (n + 9) % 10;
        }
        this._number += n * place;
        this.refresh();
        this.playCursorSound();
    }

    /** @returns {boolean} */
    isTouchOkEnabled() {
        return false;
    }

    /** @returns {boolean} */
    isOkEnabled() {
        return true;
    }

    /** @returns {boolean} */
    isCancelEnabled() {
        return false;
    }

    /** @returns {void} */
    processOk() {
        this.playOkSound();
        $gameVariables.setValue($gameMessage.numInputVariableId(), this._number);
        this._messageWindow.terminateMessage();
        this.updateInputData();
        this.deactivate();
        this.close();
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    drawItem(index) {
        const rect = this.itemLineRect(index);
        const align = "center";
        const s = this._number.padZero(this._maxDigits);
        const c = s.slice(index, index + 1);
        this.resetTextColor();
        this.drawText(c, rect.x, rect.y, rect.width, align);
    }

    /** @returns {void} */
    onButtonUp() {
        this.changeDigit(true);
    }

    /** @returns {void} */
    onButtonDown() {
        this.changeDigit(false);
    }

    /** @returns {void} */
    onButtonOk() {
        this.processOk();
    }
}

/**
 * The window used for the event command [Select Item].
 */
class Window_EventItem extends Window_ItemList {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        this.createCancelButton();
        this.openness = 0;
        this.deactivate();
        this.setHandler("ok", this.onOk.bind(this));
        this.setHandler("cancel", this.onCancel.bind(this));
        this._canRepeat = false;
    }

    /**
     * @param {Window_Message} messageWindow
     * @returns {void}
     */
    setMessageWindow(messageWindow) {
        this._messageWindow = messageWindow;
    }

    /** @returns {void} */
    createCancelButton() {
        if (ConfigManager.touchUI) {
            this._cancelButton = new Sprite_Button("cancel");
            this._cancelButton.visible = false;
            this.addChild(this._cancelButton);
        }
    }

    /** @returns {void} */
    start() {
        this.refresh();
        this.updatePlacement();
        this.placeCancelButton();
        this.forceSelect(0);
        this.open();
        this.activate();
    }

    /** @returns {void} */
    update() {
        super.update();
        this.updateCancelButton();
    }

    /** @returns {void} */
    updateCancelButton() {
        if (this._cancelButton) {
            this._cancelButton.visible = this.isOpen();
        }
    }

    /** @returns {void} */
    updatePlacement() {
        if (this._messageWindow.y >= Graphics.boxHeight / 2) {
            this.y = 0;
        } else {
            this.y = Graphics.boxHeight - this.height;
        }
    }

    /** @returns {void} */
    placeCancelButton() {
        if (this._cancelButton) {
            const spacing = 8;
            const button = this._cancelButton;
            if (this.y === 0) {
                button.y = this.height + spacing;
            } else if (this._messageWindow.y >= Graphics.boxHeight / 4) {
                const distance = this.y - this._messageWindow.y;
                button.y = -button.height - spacing - distance;
            } else {
                button.y = -button.height - spacing;
            }
            button.x = this.width - button.width - spacing;
        }
    }

    /**
     * @param {RMMZ.DataItemBase} item
     * @returns {boolean}
     */
    includes(item) {
        const itypeId = $gameMessage.itemChoiceItypeId();
        return DataManager.isItem(item) && item.itypeId === itypeId;
    }

    /** @returns {boolean} */
    needsNumber() {
        const itypeId = $gameMessage.itemChoiceItypeId();
        if (itypeId === 2) {
            // Key Item
            return $dataSystem.optKeyItemsNumber;
        } else if (itypeId >= 3) {
            // Hidden Item
            return false;
        } else {
            // Normal Item
            return true;
        }
    }

    /** @returns {boolean} */
    isEnabled(/*item*/) {
        return true;
    }

    /** @returns {void} */
    onOk() {
        const item = this.item();
        const itemId = item ? item.id : 0;
        $gameVariables.setValue($gameMessage.itemChoiceVariableId(), itemId);
        this._messageWindow.terminateMessage();
        this.close();
    }

    /** @returns {void} */
    onCancel() {
        $gameVariables.setValue($gameMessage.itemChoiceVariableId(), 0);
        this._messageWindow.terminateMessage();
        this.close();
    }
}

/**
 * The window for displaying text messages.
 */
class Window_Message extends Window_Base {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        this.openness = 0;
        this.initMembers();
    }

    /** @returns {void} */
    initMembers() {
        /** @type {RMMZ.TextWindowBackgroundType} */
        this._background = 0;
        /** @type {RMMZ.TextWindowPositionType} */
        this._positionType = 2;
        /** @type {number} */
        this._waitCount = 0;
        /** @type {Bitmap | null} */
        this._faceBitmap = null;
        /** @type {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; } | null} */
        this._textState = null;
        /** @type {Window_Gold | null} */
        this._goldWindow = null;
        /** @type {Window_NameBox | null} */
        this._nameBoxWindow = null;
        /** @type {Window_ChoiceList | null} */
        this._choiceListWindow = null;
        /** @type {Window_NumberInput | null} */
        this._numberInputWindow = null;
        /** @type {Window_EventItem | null} */
        this._eventItemWindow = null;
        this.clearFlags();
    }

    /**
     * @param {Window_Gold} goldWindow
     * @returns {void}
     */
    setGoldWindow(goldWindow) {
        this._goldWindow = goldWindow;
    }

    /**
     * @param {Window_NameBox} nameBoxWindow
     * @returns {void}
     */
    setNameBoxWindow(nameBoxWindow) {
        this._nameBoxWindow = nameBoxWindow;
    }

    /**
     * @param {Window_ChoiceList} choiceListWindow
     * @returns {void}
     */
    setChoiceListWindow(choiceListWindow) {
        this._choiceListWindow = choiceListWindow;
    }

    /**
     * @param {Window_NumberInput} numberInputWindow
     * @returns {void}
     */
    setNumberInputWindow(numberInputWindow) {
        this._numberInputWindow = numberInputWindow;
    }

    /**
     * @param {Window_EventItem} eventItemWindow
     * @returns {void}
     */
    setEventItemWindow(eventItemWindow) {
        this._eventItemWindow = eventItemWindow;
    }

    /** @returns {void} */
    clearFlags() {
        this._showFast = false;
        this._lineShowFast = false;
        this._pauseSkip = false;
    }

    /** @returns {void} */
    update() {
        this.checkToNotClose();
        super.update();
        this.synchronizeNameBox();
        while (!this.isOpening() && !this.isClosing()) {
            if (this.updateWait()) {
                return;
            } else if (this.updateLoading()) {
                return;
            } else if (this.updateInput()) {
                return;
            } else if (this.updateMessage()) {
                return;
            } else if (this.canStart()) {
                this.startMessage();
            } else {
                this.startInput();
                return;
            }
        }
    }

    /** @returns {void} */
    checkToNotClose() {
        if (this.isOpen() && this.isClosing() && this.doesContinue()) {
            this.open();
        }
    }

    /** @returns {void} */
    synchronizeNameBox() {
        this._nameBoxWindow.openness = this.openness;
    }

    /** @returns {boolean} */
    canStart() {
        return $gameMessage.hasText() && !$gameMessage.scrollMode();
    }

    /** @returns {void} */
    startMessage() {
        const text = $gameMessage.allText();
        const textState = this.createTextState(text, 0, 0, 0);
        textState.x = this.newLineX(textState);
        textState.startX = textState.x;
        this._textState = textState;
        this.newPage(this._textState);
        this.updatePlacement();
        this.updateBackground();
        this.open();
        this._nameBoxWindow.start();
    }

    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {number}
     */
    newLineX(textState) {
        const faceExists = $gameMessage.faceName() !== "";
        const faceWidth = ImageManager.standardFaceWidth;
        const spacing = 20;
        const margin = faceExists ? faceWidth + spacing : 4;
        return textState.rtl ? this.innerWidth - margin : margin;
    }

    /** @returns {void} */
    updatePlacement() {
        const goldWindow = this._goldWindow;
        this._positionType = $gameMessage.positionType();
        this.y = (this._positionType * (Graphics.boxHeight - this.height)) / 2;
        if (goldWindow) {
            goldWindow.y = this.y > 0 ? 0 : Graphics.boxHeight - goldWindow.height;
        }
    }

    /** @returns {void} */
    updateBackground() {
        this._background = $gameMessage.background();
        this.setBackgroundType(this._background);
    }

    /** @returns {void} */
    terminateMessage() {
        this.close();
        this._goldWindow.close();
        $gameMessage.clear();
    }

    /** @returns {boolean} */
    updateWait() {
        if (this._waitCount > 0) {
            this._waitCount--;
            return true;
        } else {
            return false;
        }
    }

    /** @returns {void} */
    cancelWait() {
        if ($gameSystem.isMessageSkipEnabled()) {
            this._waitCount = 0;
        }
    }

    /** @returns {boolean} */
    updateLoading() {
        if (this._faceBitmap) {
            if (this._faceBitmap.isReady()) {
                this.drawMessageFace();
                this._faceBitmap = null;
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    /** @returns {boolean} */
    updateInput() {
        if (this.isAnySubWindowActive()) {
            return true;
        }
        if (this.pause) {
            if (this.isTriggered()) {
                Input.update();
                this.pause = false;
                if (!this._textState) {
                    this.terminateMessage();
                }
            }
            return true;
        }
        return false;
    }

    /** @returns {boolean} */
    isAnySubWindowActive() {
        return (
            this._choiceListWindow.active ||
            this._numberInputWindow.active ||
            this._eventItemWindow.active
        );
    }

    /** @returns {boolean} */
    updateMessage() {
        const textState = this._textState;
        if (textState) {
            while (!this.isEndOfText(textState)) {
                if (this.needsNewPage(textState)) {
                    this.newPage(textState);
                }
                this.updateShowFast();
                this.processCharacter(textState);
                if (this.shouldBreakHere(textState)) {
                    break;
                }
            }
            this.flushTextState(textState);
            if (this.isEndOfText(textState) && !this.isWaiting()) {
                this.onEndOfText();
            }
            return true;
        } else {
            return false;
        }
    }

    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {boolean}
     */
    shouldBreakHere(textState) {
        if (this.canBreakHere(textState)) {
            if (!this._showFast && !this._lineShowFast) {
                return true;
            }
            if (this.isWaiting()) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {boolean}
     */
    canBreakHere(textState) {
        if (!this.isEndOfText(textState)) {
            const c = textState.text[textState.index];
            if (c.charCodeAt(0) >= 0xdc00 && c.charCodeAt(0) <= 0xdfff) {
                // surrogate pair
                return false;
            }
            if (textState.rtl && c.charCodeAt(0) > 0x20) {
                return false;
            }
        }
        return true;
    }

    /** @returns {void} */
    onEndOfText() {
        if (!this.startInput()) {
            if (!this._pauseSkip) {
                this.startPause();
            } else {
                this.terminateMessage();
            }
        }
        this._textState = null;
    }

    /** @returns {boolean} */
    startInput() {
        if ($gameMessage.isChoice()) {
            this._choiceListWindow.start();
            return true;
        } else if ($gameMessage.isNumberInput()) {
            this._numberInputWindow.start();
            return true;
        } else if ($gameMessage.isItemChoice()) {
            this._eventItemWindow.start();
            return true;
        } else {
            return false;
        }
    }

    /** @returns {boolean} */
    isTriggered() {
        return (
            Input.isRepeated("ok") ||
            Input.isRepeated("cancel") ||
            TouchInput.isRepeated()
        );
    }

    /** @returns {boolean} */
    doesContinue() {
        return (
            $gameMessage.hasText() &&
            !$gameMessage.scrollMode() &&
            !this.areSettingsChanged()
        );
    }

    /** @returns {boolean} */
    areSettingsChanged() {
        return (
            this._background !== $gameMessage.background() ||
            this._positionType !== $gameMessage.positionType()
        );
    }

    /** @returns {void} */
    updateShowFast() {
        if (this.isTriggered()) {
            this._showFast = true;
        }
    }

    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {void}
     */
    newPage(textState) {
        this.contents.clear();
        this.resetFontSettings();
        this.clearFlags();
        this.updateSpeakerName();
        this.loadMessageFace();
        textState.x = textState.startX;
        textState.y = 0;
        textState.height = this.calcTextHeight(textState);
    }

    /** @returns {void} */
    updateSpeakerName() {
        this._nameBoxWindow.setName($gameMessage.speakerName());
    }

    /** @returns {void} */
    loadMessageFace() {
        this._faceBitmap = ImageManager.loadFace($gameMessage.faceName());
    }

    /** @returns {void} */
    drawMessageFace() {
        const faceName = $gameMessage.faceName();
        const faceIndex = $gameMessage.faceIndex();
        const rtl = $gameMessage.isRTL();
        const width = ImageManager.standardFaceWidth;
        const height = this.innerHeight;
        const x = rtl ? this.innerWidth - width - 4 : 4;
        this.drawFace(faceName, faceIndex, x, 0, width, height);
    }

    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @param {string} c
     * @returns {void}
     */
    processControlCharacter(textState, c) {
        super.processControlCharacter(textState, c);
        if (c === "\f") {
            this.processNewPage(textState);
        }
    }

    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {void}
     */
    processNewLine(textState) {
        this._lineShowFast = false;
        super.processNewLine(textState);
        if (this.needsNewPage(textState)) {
            this.startPause();
        }
    }

    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {void}
     */
    processNewPage(textState) {
        if (textState.text[textState.index] === "\n") {
            textState.index++;
        }
        textState.y = this.contents.height;
        this.startPause();
    }

    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {boolean}
     */
    isEndOfText(textState) {
        return textState.index >= textState.text.length;
    }

    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {boolean}
     */
    needsNewPage(textState) {
        return (
            !this.isEndOfText(textState) &&
            textState.y + textState.height > this.contents.height
        );
    }

    /**
     * @param {("$" | "." | "|" | "!" | ">" | "<" | "^") | ("C" | "I" | "PX" | "PY" | "FS" | "{" | "}")} code
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {void}
     */
    processEscapeCharacter(code, textState) {
        switch (code) {
            case "$":
                this._goldWindow.open();
                break;
            case ".":
                this.startWait(15);
                break;
            case "|":
                this.startWait(60);
                break;
            case "!":
                this.startPause();
                break;
            case ">":
                this._lineShowFast = true;
                break;
            case "<":
                this._lineShowFast = false;
                break;
            case "^":
                this._pauseSkip = true;
                break;
            default:
                super.processEscapeCharacter(code, textState);
                break;
        }
    }

    /**
     * @param {number} count
     * @returns {void}
     */
    startWait(count) {
        this._waitCount = count;
    }

    /** @returns {void} */
    startPause() {
        this.startWait(10);
        this.pause = true;
    }

    /** @returns {boolean} */
    isWaiting() {
        return this.pause || this._waitCount > 0;
    }
}

/**
 * The window for displaying scrolling text. No frame is displayed, but it
 * is handled as a window for convenience.
 */
class Window_ScrollText extends Window_Base {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(new PIXI.Rectangle());
        this.opacity = 0;
        this.hide();
        /** @type {Rectangle} */
        this._reservedRect = rect;
        /** @type {string | null} */
        this._text = "";
        this._maxBitmapHeight = 2048;
        /** @type {number} */
        this._allTextHeight = 0;
        this._blockHeight = 0;
        this._blockIndex = 0;
        this._scrollY = 0;
    }

    /** @returns {void} */
    update() {
        super.update();
        if ($gameMessage.scrollMode()) {
            if (this._text) {
                this.updateMessage();
            }
            if (!this._text && $gameMessage.hasText()) {
                this.startMessage();
            }
        }
    }

    /** @returns {void} */
    startMessage() {
        this._text = $gameMessage.allText();
        if (this._text) {
            this.updatePlacement();
            this._allTextHeight = this.textSizeEx(this._text).height;
            this._blockHeight = this._maxBitmapHeight - this.height;
            this._blockIndex = 0;
            this.origin.y = this._scrollY = -this.height;
            this.createContents();
            this.refresh();
            this.show();
        } else {
            $gameMessage.clear();
        }
    }

    /** @returns {void} */
    refresh() {
        const rect = this.baseTextRect();
        const y = rect.y - this._scrollY + (this._scrollY % this._blockHeight);
        this.contents.clear();
        this.drawTextEx(this._text, rect.x, y, rect.width);
    }

    /** @returns {void} */
    updatePlacement() {
        const rect = this._reservedRect;
        this.move(rect.x, rect.y, rect.width, rect.height);
    }

    /** @returns {number} */
    contentsHeight() {
        if (this._allTextHeight > 0) {
            return Math.min(this._allTextHeight, this._maxBitmapHeight);
        } else {
            return 0;
        }
    }

    /** @returns {void} */
    updateMessage() {
        this._scrollY += this.scrollSpeed();
        if (this._scrollY >= this._allTextHeight) {
            this.terminateMessage();
        } else {
            const blockIndex = Math.floor(this._scrollY / this._blockHeight);
            if (blockIndex > this._blockIndex) {
                this._blockIndex = blockIndex;
                this.refresh();
            }
            this.origin.y = this._scrollY % this._blockHeight;
        }
    }

    /** @returns {number} */
    scrollSpeed() {
        let speed = $gameMessage.scrollSpeed() / 2;
        if (this.isFastForward()) {
            speed *= this.fastForwardRate();
        }
        return speed;
    }

    /** @returns {boolean} */
    isFastForward() {
        if ($gameMessage.scrollNoFast()) {
            return false;
        } else {
            return (
                Input.isPressed("ok") ||
                Input.isPressed("shift") ||
                TouchInput.isPressed()
            );
        }
    }

    /** @returns {number} */
    fastForwardRate() {
        return 3;
    }

    /** @returns {void} */
    terminateMessage() {
        this._text = null;
        $gameMessage.clear();
        this.hide();
    }
}

/**
 * The window for displaying the map name on the map screen.
 */
class Window_MapName extends Window_Base {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        this.opacity = 0;
        this.contentsOpacity = 0;
        /** @type {number} */
        this._showCount = 0;
        this.refresh();
    }

    /** @returns {void} */
    update() {
        super.update();
        if (this._showCount > 0 && $gameMap.isNameDisplayEnabled()) {
            this.updateFadeIn();
            this._showCount--;
        } else {
            this.updateFadeOut();
        }
    }

    /** @returns {void} */
    updateFadeIn() {
        this.contentsOpacity += 16;
    }

    /** @returns {void} */
    updateFadeOut() {
        this.contentsOpacity -= 16;
    }

    /** @returns {void} */
    open() {
        this.refresh();
        this._showCount = 150;
    }

    /** @returns {void} */
    close() {
        this._showCount = 0;
    }

    /** @returns {void} */
    refresh() {
        this.contents.clear();
        if ($gameMap.displayName()) {
            const width = this.innerWidth;
            this.drawBackground(0, 0, width, this.lineHeight());
            this.drawText($gameMap.displayName(), 0, 0, width, "center");
        }
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @returns {void}
     */
    drawBackground(x, y, width, height) {
        const color1 = ColorManager.dimColor1();
        const color2 = ColorManager.dimColor2();
        const half = width / 2;
        this.contents.gradientFillRect(x, y, half, height, color2, color1);
        this.contents.gradientFillRect(x + half, y, half, height, color1, color2);
    }
}

/**
 * The window for displaying battle progress. No frame is displayed, but it is
 * handled as a window for convenience.
 */
class Window_BattleLog extends Window_Base {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        this.opacity = 0;
        /** @type {string[]} */
        this._lines = [];
        /** @type {((Window_BattleLog["performActionStart"] extends (...args: any[]) => any ? { name: "performActionStart"; params: Parameters<Window_BattleLog["performActionStart"]>; } : never) | (Window_BattleLog["performAction"] extends (...args: any[]) => any ? { name: "performAction"; params: Parameters<Window_BattleLog["performAction"]>; } : never) | (Window_BattleLog["performActionEnd"] extends (...args: any[]) => any ? { name: "performActionEnd"; params: Parameters<Window_BattleLog["performActionEnd"]>; } : never) | (Window_BattleLog["performCounter"] extends (...args: any[]) => any ? { name: "performCounter"; params: Parameters<Window_BattleLog["performCounter"]>; } : never) | (Window_BattleLog["performReflection"] extends (...args: any[]) => any ? { name: "performReflection"; params: Parameters<Window_BattleLog["performReflection"]>; } : never) | (Window_BattleLog["performSubstitute"] extends (...args: any[]) => any ? { name: "performSubstitute"; params: Parameters<Window_BattleLog["performSubstitute"]>; } : never) | (Window_BattleLog["performMiss"] extends (...args: any[]) => any ? { name: "performMiss"; params: Parameters<Window_BattleLog["performMiss"]>; } : never) | (Window_BattleLog["performEvasion"] extends (...args: any[]) => any ? { name: "performEvasion"; params: Parameters<Window_BattleLog["performEvasion"]>; } : never) | (Window_BattleLog["performMagicEvasion"] extends (...args: any[]) => any ? { name: "performMagicEvasion"; params: Parameters<Window_BattleLog["performMagicEvasion"]>; } : never) | (Window_BattleLog["performDamage"] extends (...args: any[]) => any ? { name: "performDamage"; params: Parameters<Window_BattleLog["performDamage"]>; } : never) | (Window_BattleLog["performRecovery"] extends (...args: any[]) => any ? { name: "performRecovery"; params: Parameters<Window_BattleLog["performRecovery"]>; } : never) | (Window_BattleLog["performCollapse"] extends (...args: any[]) => any ? { name: "performCollapse"; params: Parameters<Window_BattleLog["performCollapse"]>; } : never) | (Window_BattleLog["pushBaseLine"] extends (...args: any[]) => any ? { name: "pushBaseLine"; params: Parameters<Window_BattleLog["pushBaseLine"]>; } : never) | (Window_BattleLog["popBaseLine"] extends (...args: any[]) => any ? { name: "popBaseLine"; params: Parameters<Window_BattleLog["popBaseLine"]>; } : never) | (Window_BattleLog["addText"] extends (...args: any[]) => any ? { name: "addText"; params: Parameters<Window_BattleLog["addText"]>; } : never) | (Window_BattleLog["popupDamage"] extends (...args: any[]) => any ? { name: "popupDamage"; params: Parameters<Window_BattleLog["popupDamage"]>; } : never) | (Window_BattleLog["wait"] extends (...args: any[]) => any ? { name: "wait"; params: Parameters<Window_BattleLog["wait"]>; } : never) | (Window_BattleLog["waitForMovement"] extends (...args: any[]) => any ? { name: "waitForMovement"; params: Parameters<Window_BattleLog["waitForMovement"]>; } : never) | (Window_BattleLog["waitForNewLine"] extends (...args: any[]) => any ? { name: "waitForNewLine"; params: Parameters<Window_BattleLog["waitForNewLine"]>; } : never) | (Window_BattleLog["waitForEffect"] extends (...args: any[]) => any ? { name: "waitForEffect"; params: Parameters<Window_BattleLog["waitForEffect"]>; } : never) | (Window_BattleLog["showAnimation"] extends (...args: any[]) => any ? { name: "showAnimation"; params: Parameters<Window_BattleLog["showAnimation"]>; } : never) | (Window_BattleLog["clear"] extends (...args: any[]) => any ? { name: "clear"; params: Parameters<Window_BattleLog["clear"]>; } : never))[]} */
        this._methods = [];
        /** @type {number} */
        this._waitCount = 0;
        /** @type {RMMZ.WaitMode} */
        this._waitMode = "";
        /** @type {number[]} */
        this._baseLineStack = [];
        /** @type {Spriteset_Battle | null} */
        this._spriteset = null;
        this.refresh();
    }

    /**
     * @param {Spriteset_Battle} spriteset
     * @returns {void}
     */
    setSpriteset(spriteset) {
        this._spriteset = spriteset;
    }

    /** @returns {number} */
    maxLines() {
        return 10;
    }

    /** @returns {number} */
    numLines() {
        return this._lines.length;
    }

    /** @returns {number} */
    messageSpeed() {
        return 16;
    }

    /** @returns {boolean | "video" | "scroll" | "image" | "message" | "transfer" | "route" | "animation" | "balloon" | "gather" | "action" | "effect" | "movement"} */
    isBusy() {
        return this._waitCount > 0 || this._waitMode || this._methods.length > 0;
    }

    /** @returns {void} */
    update() {
        if (!this.updateWait()) {
            this.callNextMethod();
        }
    }

    /** @returns {boolean} */
    updateWait() {
        return this.updateWaitCount() || this.updateWaitMode();
    }

    /** @returns {boolean} */
    updateWaitCount() {
        if (this._waitCount > 0) {
            this._waitCount -= this.isFastForward() ? 3 : 1;
            if (this._waitCount < 0) {
                this._waitCount = 0;
            }
            return true;
        }
        return false;
    }

    /** @returns {boolean} */
    updateWaitMode() {
        let waiting = false;
        switch (this._waitMode) {
            case "effect":
                waiting = this._spriteset.isEffecting();
                break;
            case "movement":
                waiting = this._spriteset.isAnyoneMoving();
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

    /** @returns {void} */
    callNextMethod() {
        if (this._methods.length > 0) {
            const method = this._methods.shift();
            if (method.name && this[method.name]) {
                this[method.name].apply(this, method.params);
            } else {
                throw new Error("Method not found: " + method.name);
            }
        }
    }

    /** @returns {boolean} */
    isFastForward() {
        return (
            Input.isLongPressed("ok") ||
            Input.isPressed("shift") ||
            TouchInput.isLongPressed()
        );
    }

    /**
     * @template T
     * @param {T} methodName
     * @returns {void}
     */
    push(methodName) {
        const methodArgs = Array.prototype.slice.call(arguments, 1);
        this._methods.push({ name: methodName, params: methodArgs });
    }

    /** @returns {void} */
    clear() {
        this._lines = [];
        this._baseLineStack = [];
        this.refresh();
    }

    /** @returns {void} */
    wait() {
        this._waitCount = this.messageSpeed();
    }

    /** @returns {void} */
    waitForEffect() {
        this.setWaitMode("effect");
    }

    /** @returns {void} */
    waitForMovement() {
        this.setWaitMode("movement");
    }

    /**
     * @param {string} text
     * @returns {void}
     */
    addText(text) {
        this._lines.push(text);
        this.refresh();
        this.wait();
    }

    /** @returns {void} */
    pushBaseLine() {
        this._baseLineStack.push(this._lines.length);
    }

    /** @returns {void} */
    popBaseLine() {
        const baseLine = this._baseLineStack.pop();
        while (this._lines.length > baseLine) {
            this._lines.pop();
        }
    }

    /** @returns {void} */
    waitForNewLine() {
        let baseLine = 0;
        if (this._baseLineStack.length > 0) {
            baseLine = this._baseLineStack[this._baseLineStack.length - 1];
        }
        if (this._lines.length > baseLine) {
            this.wait();
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    popupDamage(target) {
        if (target.shouldPopupDamage()) {
            target.startDamagePopup();
        }
    }

    /**
     * @param {RMMZ.ActionTarget} subject
     * @param {Game_Action} action
     * @returns {void}
     */
    performActionStart(subject, action) {
        subject.performActionStart(action);
    }

    /**
     * @param {RMMZ.ActionTarget} subject
     * @param {Game_Action} action
     * @returns {void}
     */
    performAction(subject, action) {
        subject.performAction(action);
    }

    /**
     * @param {RMMZ.ActionTarget} subject
     * @returns {void}
     */
    performActionEnd(subject) {
        subject.performActionEnd();
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    performDamage(target) {
        target.performDamage();
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    performMiss(target) {
        target.performMiss();
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    performRecovery(target) {
        target.performRecovery();
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    performEvasion(target) {
        target.performEvasion();
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    performMagicEvasion(target) {
        target.performMagicEvasion();
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    performCounter(target) {
        target.performCounter();
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    performReflection(target) {
        target.performReflection();
    }

    /**
     * @param {RMMZ.ActionTarget} substitute
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    performSubstitute(substitute, target) {
        substitute.performSubstitute(target);
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    performCollapse(target) {
        target.performCollapse();
    }

    // prettier-ignore
    /**
     * @param {RMMZ.ActionTarget} subject
     * @param {RMMZ.ActionTarget[]} targets
     * @param {RMMZ.AnimationID} animationId
     * @returns {void}
     */
    showAnimation(
        subject, targets, animationId
    ) {
        if (animationId < 0) {
            this.showAttackAnimation(subject, targets);
        } else {
            this.showNormalAnimation(targets, animationId);
        }
    }

    /**
     * @param {RMMZ.ActionTarget} subject
     * @param {RMMZ.ActionTarget[]} targets
     * @returns {void}
     */
    showAttackAnimation(subject, targets) {
        if (subject.isActor()) {
            this.showActorAttackAnimation(subject, targets);
        } else {
            this.showEnemyAttackAnimation(subject, targets);
        }
    }

    // prettier-ignore
    /**
     * @param {Game_Actor} subject
     * @param {RMMZ.ActionTarget[]} targets
     * @returns {void}
     */
    showActorAttackAnimation(
        subject, targets
    ) {
        this.showNormalAnimation(targets, subject.attackAnimationId1(), false);
        this.showNormalAnimation(targets, subject.attackAnimationId2(), true);
    }

    /**
     * @param {Game_Enemy} subject
     * @param {RMMZ.ActionTarget[]} targets
     * @returns {void}
     */
    // prettier-ignore
    showEnemyAttackAnimation(
        /* subject, targets */
    ) {
        SoundManager.playEnemyAttack();
    }

    // prettier-ignore
    /**
     * @param {RMMZ.ActionTarget[]} targets
     * @param {RMMZ.AnimationID} animationId
     * @param {boolean} [mirror]
     * @returns {void}
     */
    showNormalAnimation(
        targets, animationId, mirror
    ) {
        const animation = $dataAnimations[animationId];
        if (animation) {
            $gameTemp.requestAnimation(targets, animationId, mirror);
        }
    }

    /** @returns {void} */
    refresh() {
        this.drawBackground();
        this.contents.clear();
        for (let i = 0; i < this._lines.length; i++) {
            this.drawLineText(i);
        }
    }

    /** @returns {void} */
    drawBackground() {
        const rect = this.backRect();
        const color = this.backColor();
        this.contentsBack.clear();
        this.contentsBack.paintOpacity = this.backPaintOpacity();
        this.contentsBack.fillRect(rect.x, rect.y, rect.width, rect.height, color);
        this.contentsBack.paintOpacity = 255;
    }

    /** @returns {Rectangle} */
    backRect() {
        const height = this.numLines() * this.itemHeight();
        return new PIXI.Rectangle(0, 0, this.innerWidth, height);
    }

    /**
     * @param {number} index
     * @returns {Rectangle}
     */
    lineRect(index) {
        const itemHeight = this.itemHeight();
        const padding = this.itemPadding();
        const x = padding;
        const y = index * itemHeight;
        const width = this.innerWidth - padding * 2;
        const height = itemHeight;
        return new PIXI.Rectangle(x, y, width, height);
    }

    /** @returns {string} */
    backColor() {
        return "#000000";
    }

    /** @returns {number} */
    backPaintOpacity() {
        return 64;
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    drawLineText(index) {
        const rect = this.lineRect(index);
        this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
        this.drawTextEx(this._lines[index], rect.x, rect.y, rect.width);
    }

    /** @returns {void} */
    startTurn() {
        this.push("wait");
    }

    /**
     * @param {RMMZ.ActionTarget} subject
     * @param {Game_Action} action
     * @param {RMMZ.ActionTarget[]} targets
     * @returns {void}
     */
    startAction(subject, action, targets) {
        const item = action.item();
        this.push("performActionStart", subject, action);
        this.push("waitForMovement");
        this.push("performAction", subject, action);
        this.push("showAnimation", subject, targets.clone(), item.animationId);
        this.displayAction(subject, item);
    }

    /**
     * @param {RMMZ.ActionTarget} subject
     * @returns {void}
     */
    endAction(subject) {
        this.push("waitForNewLine");
        this.push("clear");
        this.push("performActionEnd", subject);
    }

    /**
     * @param {RMMZ.ActionTarget} subject
     * @returns {void}
     */
    displayCurrentState(subject) {
        const stateText = subject.mostImportantStateText();
        if (stateText) {
            this.push("addText", stateText.format(subject.name()));
            this.push("wait");
            this.push("clear");
        }
    }

    /**
     * @param {RMMZ.ActionTarget} subject
     * @returns {void}
     */
    displayRegeneration(subject) {
        this.push("popupDamage", subject);
    }

    /**
     * @param {RMMZ.ActionTarget} subject
     * @param {RMMZ.DataItemBase} item
     * @returns {void}
     */
    displayAction(subject, item) {
        const numMethods = this._methods.length;
        if (DataManager.isSkill(item)) {
            this.displayItemMessage(item.message1, subject, item);
            this.displayItemMessage(item.message2, subject, item);
        } else {
            this.displayItemMessage(TextManager.useItem, subject, item);
        }
        if (this._methods.length === numMethods) {
            this.push("wait");
        }
    }

    /**
     * @param {string} fmt
     * @param {RMMZ.ActionTarget} subject
     * @param {RMMZ.DataItemBase} item
     * @returns {void}
     */
    displayItemMessage(fmt, subject, item) {
        if (fmt) {
            this.push("addText", fmt.format(subject.name(), item.name));
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayCounter(target) {
        this.push("performCounter", target);
        this.push("addText", TextManager.counterAttack.format(target.name()));
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayReflection(target) {
        this.push("performReflection", target);
        this.push("addText", TextManager.magicReflection.format(target.name()));
    }

    /**
     * @param {RMMZ.ActionTarget} substitute
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displaySubstitute(substitute, target) {
        const substName = substitute.name();
        const text = TextManager.substitute.format(substName, target.name());
        this.push("performSubstitute", substitute, target);
        this.push("addText", text);
    }

    /**
     * @param {RMMZ.ActionTarget} subject
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayActionResults(subject, target) {
        if (target.result().used) {
            this.push("pushBaseLine");
            this.displayCritical(target);
            this.push("popupDamage", target);
            this.push("popupDamage", subject);
            this.displayDamage(target);
            this.displayAffectedStatus(target);
            this.displayFailure(target);
            this.push("waitForNewLine");
            this.push("popBaseLine");
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayFailure(target) {
        if (target.result().isHit() && !target.result().success) {
            this.push("addText", TextManager.actionFailure.format(target.name()));
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayCritical(target) {
        if (target.result().critical) {
            if (target.isActor()) {
                this.push("addText", TextManager.criticalToActor);
            } else {
                this.push("addText", TextManager.criticalToEnemy);
            }
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayDamage(target) {
        if (target.result().missed) {
            this.displayMiss(target);
        } else if (target.result().evaded) {
            this.displayEvasion(target);
        } else {
            this.displayHpDamage(target);
            this.displayMpDamage(target);
            this.displayTpDamage(target);
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayMiss(target) {
        let fmt;
        if (target.result().physical) {
            const isActor = target.isActor();
            fmt = isActor ? TextManager.actorNoHit : TextManager.enemyNoHit;
            this.push("performMiss", target);
        } else {
            fmt = TextManager.actionFailure;
        }
        this.push("addText", fmt.format(target.name()));
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayEvasion(target) {
        let fmt;
        if (target.result().physical) {
            fmt = TextManager.evasion;
            this.push("performEvasion", target);
        } else {
            fmt = TextManager.magicEvasion;
            this.push("performMagicEvasion", target);
        }
        this.push("addText", fmt.format(target.name()));
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayHpDamage(target) {
        if (target.result().hpAffected) {
            if (target.result().hpDamage > 0 && !target.result().drain) {
                this.push("performDamage", target);
            }
            if (target.result().hpDamage < 0) {
                this.push("performRecovery", target);
            }
            this.push("addText", this.makeHpDamageText(target));
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayMpDamage(target) {
        if (target.isAlive() && target.result().mpDamage !== 0) {
            if (target.result().mpDamage < 0) {
                this.push("performRecovery", target);
            }
            this.push("addText", this.makeMpDamageText(target));
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayTpDamage(target) {
        if (target.isAlive() && target.result().tpDamage !== 0) {
            if (target.result().tpDamage < 0) {
                this.push("performRecovery", target);
            }
            this.push("addText", this.makeTpDamageText(target));
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayAffectedStatus(target) {
        if (target.result().isStatusAffected()) {
            this.push("pushBaseLine");
            this.displayChangedStates(target);
            this.displayChangedBuffs(target);
            this.push("waitForNewLine");
            this.push("popBaseLine");
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayAutoAffectedStatus(target) {
        if (target.result().isStatusAffected()) {
            this.displayAffectedStatus(target, null);
            this.push("clear");
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayChangedStates(target) {
        this.displayAddedStates(target);
        this.displayRemovedStates(target);
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayAddedStates(target) {
        const result = target.result();
        const states = result.addedStateObjects();
        for (const state of states) {
            const stateText = target.isActor() ? state.message1 : state.message2;
            if (state.id === target.deathStateId()) {
                this.push("performCollapse", target);
            }
            if (stateText) {
                this.push("popBaseLine");
                this.push("pushBaseLine");
                this.push("addText", stateText.format(target.name()));
                this.push("waitForEffect");
            }
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayRemovedStates(target) {
        const result = target.result();
        const states = result.removedStateObjects();
        for (const state of states) {
            if (state.message4) {
                this.push("popBaseLine");
                this.push("pushBaseLine");
                this.push("addText", state.message4.format(target.name()));
            }
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayChangedBuffs(target) {
        const result = target.result();
        this.displayBuffs(target, result.addedBuffs, TextManager.buffAdd);
        this.displayBuffs(target, result.addedDebuffs, TextManager.debuffAdd);
        this.displayBuffs(target, result.removedBuffs, TextManager.buffRemove);
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ParamID[]} buffs
     * @param {string} fmt
     * @returns {void}
     */
    displayBuffs(target, buffs, fmt) {
        for (const paramId of buffs) {
            const text = fmt.format(target.name(), TextManager.param(paramId));
            this.push("popBaseLine");
            this.push("pushBaseLine");
            this.push("addText", text);
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {string}
     */
    makeHpDamageText(target) {
        const result = target.result();
        const damage = result.hpDamage;
        const isActor = target.isActor();
        let fmt;
        if (damage > 0 && result.drain) {
            fmt = isActor ? TextManager.actorDrain : TextManager.enemyDrain;
            return fmt.format(target.name(), TextManager.hp, damage);
        } else if (damage > 0) {
            fmt = isActor ? TextManager.actorDamage : TextManager.enemyDamage;
            return fmt.format(target.name(), damage);
        } else if (damage < 0) {
            fmt = isActor ? TextManager.actorRecovery : TextManager.enemyRecovery;
            return fmt.format(target.name(), TextManager.hp, -damage);
        } else {
            fmt = isActor ? TextManager.actorNoDamage : TextManager.enemyNoDamage;
            return fmt.format(target.name());
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {string}
     */
    makeMpDamageText(target) {
        const result = target.result();
        const damage = result.mpDamage;
        const isActor = target.isActor();
        let fmt;
        if (damage > 0 && result.drain) {
            fmt = isActor ? TextManager.actorDrain : TextManager.enemyDrain;
            return fmt.format(target.name(), TextManager.mp, damage);
        } else if (damage > 0) {
            fmt = isActor ? TextManager.actorLoss : TextManager.enemyLoss;
            return fmt.format(target.name(), TextManager.mp, damage);
        } else if (damage < 0) {
            fmt = isActor ? TextManager.actorRecovery : TextManager.enemyRecovery;
            return fmt.format(target.name(), TextManager.mp, -damage);
        } else {
            return "";
        }
    }

    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {string}
     */
    makeTpDamageText(target) {
        const result = target.result();
        const damage = result.tpDamage;
        const isActor = target.isActor();
        let fmt;
        if (damage > 0) {
            fmt = isActor ? TextManager.actorLoss : TextManager.enemyLoss;
            return fmt.format(target.name(), TextManager.tp, damage);
        } else if (damage < 0) {
            fmt = isActor ? TextManager.actorGain : TextManager.enemyGain;
            return fmt.format(target.name(), TextManager.tp, -damage);
        } else {
            return "";
        }
    }
}

/**
 * The window for selecting whether to fight or escape on the battle screen.
 */
class Window_PartyCommand extends Window_Command {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        this.openness = 0;
        this.deactivate();
    }

    /** @returns {void} */
    makeCommandList() {
        this.addCommand(TextManager.fight, "fight");
        this.addCommand(TextManager.escape, "escape", BattleManager.canEscape());
    }

    /** @returns {void} */
    setup() {
        this.refresh();
        this.forceSelect(0);
        this.activate();
        this.open();
    }
}

/**
 * The window for selecting an actor's action on the battle screen.
 */
class Window_ActorCommand extends Window_Command {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        this.openness = 0;
        this.deactivate();
        /** @type {Game_Actor | null} */
        this._actor = null;
    }

    /** @returns {void} */
    makeCommandList() {
        if (this._actor) {
            this.addAttackCommand();
            this.addSkillCommands();
            this.addGuardCommand();
            this.addItemCommand();
        }
    }

    /** @returns {void} */
    addAttackCommand() {
        this.addCommand(TextManager.attack, "attack", this._actor.canAttack());
    }

    /** @returns {void} */
    addSkillCommands() {
        const skillTypes = this._actor.skillTypes();
        for (const stypeId of skillTypes) {
            const name = $dataSystem.skillTypes[stypeId];
            this.addCommand(name, "skill", true, stypeId);
        }
    }

    /** @returns {void} */
    addGuardCommand() {
        this.addCommand(TextManager.guard, "guard", this._actor.canGuard());
    }

    /** @returns {void} */
    addItemCommand() {
        this.addCommand(TextManager.item, "item");
    }

    /**
     * @param {Game_Actor | null} actor
     * @returns {void}
     */
    setup(actor) {
        this._actor = actor;
        this.refresh();
        this.selectLast();
        this.activate();
        this.open();
    }

    /** @returns {Game_Actor | null} */
    actor() {
        return this._actor;
    }

    /** @returns {void} */
    processOk() {
        if (this._actor) {
            if (ConfigManager.commandRemember) {
                this._actor.setLastCommandSymbol(this.currentSymbol());
            } else {
                this._actor.setLastCommandSymbol("");
            }
        }
        super.processOk();
    }

    /** @returns {void} */
    selectLast() {
        this.forceSelect(0);
        if (this._actor && ConfigManager.commandRemember) {
            const symbol = this._actor.lastCommandSymbol();
            this.selectSymbol(symbol);
            if (symbol === "skill") {
                const skill = this._actor.lastBattleSkill();
                if (skill) {
                    this.selectExt(skill.stypeId);
                }
            }
        }
    }
}

/**
 * The window for displaying the status of party members on the battle screen.
 */
class Window_BattleStatus extends Window_StatusBase {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        this.frameVisible = false;
        this.openness = 0;
        /** @type {number} */
        this._bitmapsReady = 0;
        this.preparePartyRefresh();
    }

    /** @returns {number} */
    extraHeight() {
        return 10;
    }

    /** @returns {number} */
    maxCols() {
        return 4;
    }

    /** @returns {number} */
    itemHeight() {
        return this.innerHeight;
    }

    /** @returns {number} */
    maxItems() {
        return $gameParty.battleMembers().length;
    }

    /** @returns {number} */
    rowSpacing() {
        return 0;
    }

    /** @returns {void} */
    updatePadding() {
        this.padding = 8;
    }

    /**
     * @param {number} index
     * @returns {Game_Actor}
     */
    actor(index) {
        return $gameParty.battleMembers()[index];
    }

    /**
     * @param {Game_Actor | null} actor
     * @returns {void}
     */
    selectActor(actor) {
        const members = $gameParty.battleMembers();
        this.select(members.indexOf(actor));
    }

    /** @returns {void} */
    update() {
        super.update();
        if ($gameTemp.isBattleRefreshRequested()) {
            this.preparePartyRefresh();
        }
    }

    /** @returns {void} */
    preparePartyRefresh() {
        $gameTemp.clearBattleRefreshRequest();
        this._bitmapsReady = 0;
        for (const actor of $gameParty.members()) {
            const bitmap = ImageManager.loadFace(actor.faceName());
            bitmap.addLoadListener(this.performPartyRefresh.bind(this));
        }
    }

    /** @returns {void} */
    performPartyRefresh() {
        this._bitmapsReady++;
        if (this._bitmapsReady >= $gameParty.members().length) {
            this.refresh();
        }
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    drawItem(index) {
        this.drawItemImage(index);
        this.drawItemStatus(index);
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    drawItemImage(index) {
        const actor = this.actor(index);
        const rect = this.faceRect(index);
        this.drawActorFace(actor, rect.x, rect.y, rect.width, rect.height);
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    drawItemStatus(index) {
        const actor = this.actor(index);
        const rect = this.itemRectWithPadding(index);
        const nameX = this.nameX(rect);
        const nameY = this.nameY(rect);
        const stateIconX = this.stateIconX(rect);
        const stateIconY = this.stateIconY(rect);
        const basicGaugesX = this.basicGaugesX(rect);
        const basicGaugesY = this.basicGaugesY(rect);
        this.placeTimeGauge(actor, nameX, nameY);
        this.placeActorName(actor, nameX, nameY);
        this.placeStateIcon(actor, stateIconX, stateIconY);
        this.placeBasicGauges(actor, basicGaugesX, basicGaugesY);
    }

    /**
     * @param {number} index
     * @returns {Rectangle}
     */
    faceRect(index) {
        const rect = this.itemRect(index);
        rect.pad(-1);
        rect.height = this.nameY(rect) + this.gaugeLineHeight() / 2 - rect.y;
        return rect;
    }

    /**
     * @param {Rectangle} rect
     * @returns {number}
     */
    nameX(rect) {
        return rect.x;
    }

    /**
     * @param {Rectangle} rect
     * @returns {number}
     */
    nameY(rect) {
        return this.basicGaugesY(rect) - this.gaugeLineHeight();
    }

    /**
     * @param {Rectangle} rect
     * @returns {number}
     */
    stateIconX(rect) {
        return rect.x + rect.width - ImageManager.standardIconWidth / 2 + 4;
    }

    /**
     * @param {Rectangle} rect
     * @returns {number}
     */
    stateIconY(rect) {
        return rect.y + ImageManager.standardIconHeight / 2 + 4;
    }

    /**
     * @param {Rectangle} rect
     * @returns {number}
     */
    basicGaugesX(rect) {
        return rect.x;
    }

    /**
     * @param {Rectangle} rect
     * @returns {number}
     */
    basicGaugesY(rect) {
        const bottom = rect.y + rect.height - this.extraHeight();
        const numGauges = $dataSystem.optDisplayTp ? 3 : 2;
        return bottom - this.gaugeLineHeight() * numGauges;
    }
}

/**
 * The window for selecting a target actor on the battle screen.
 */
class Window_BattleActor extends Window_BattleStatus {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        this.openness = 255;
        this.hide();
    }

    /** @returns {void} */
    show() {
        this.forceSelect(0);
        $gameTemp.clearTouchState();
        super.show();
    }

    /** @returns {void} */
    hide() {
        super.hide();
        $gameParty.select(null);
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    select(index) {
        super.select(index);
        $gameParty.select(this.actor(index));
    }

    /** @returns {void} */
    processTouch() {
        super.processTouch();
        if (this.isOpenAndActive()) {
            const target = $gameTemp.touchTarget();
            if (target) {
                const members = $gameParty.battleMembers();
                if (members.includes(target)) {
                    this.select(members.indexOf(target));
                    if ($gameTemp.touchState() === "click") {
                        this.processOk();
                    }
                }
                $gameTemp.clearTouchState();
            }
        }
    }
}

/**
 * The window for selecting a target enemy on the battle screen.
 */
class Window_BattleEnemy extends Window_Selectable {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        /** @type {Game_Enemy[]} */
        this._enemies = [];
        super.initialize(rect);
        this.refresh();
        this.hide();
    }

    /** @returns {number} */
    maxCols() {
        return 2;
    }

    /** @returns {number} */
    maxItems() {
        return this._enemies.length;
    }

    /** @returns {Game_Enemy} */
    enemy() {
        return this._enemies[this.index()];
    }

    /** @returns {number} */
    enemyIndex() {
        const enemy = this.enemy();
        return enemy ? enemy.index() : -1;
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    drawItem(index) {
        this.resetTextColor();
        const name = this._enemies[index].name();
        const rect = this.itemLineRect(index);
        this.drawText(name, rect.x, rect.y, rect.width);
    }

    /** @returns {void} */
    show() {
        this.refresh();
        this.forceSelect(0);
        $gameTemp.clearTouchState();
        super.show();
    }

    /** @returns {void} */
    hide() {
        super.hide();
        $gameTroop.select(null);
    }

    /** @returns {void} */
    refresh() {
        this._enemies = $gameTroop.aliveMembers();
        super.refresh();
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    select(index) {
        super.select(index);
        $gameTroop.select(this.enemy());
    }

    /** @returns {void} */
    processTouch() {
        super.processTouch();
        if (this.isOpenAndActive()) {
            const target = $gameTemp.touchTarget();
            if (target) {
                if (this._enemies.includes(target)) {
                    this.select(this._enemies.indexOf(target));
                    if ($gameTemp.touchState() === "click") {
                        this.processOk();
                    }
                }
                $gameTemp.clearTouchState();
            }
        }
    }
}

/**
 * The window for selecting a skill to use on the battle screen.
 */
class Window_BattleSkill extends Window_SkillList {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        this.hide();
    }

    /** @returns {void} */
    show() {
        this.selectLast();
        this.showHelpWindow();
        super.show();
    }

    /** @returns {void} */
    hide() {
        this.hideHelpWindow();
        super.hide();
    }
}

/**
 * The window for selecting an item to use on the battle screen.
 */
class Window_BattleItem extends Window_ItemList {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        this.hide();
    }

    /**
     * @param {RMMZ.DataItemBase} item
     * @returns {boolean}
     */
    includes(item) {
        return $gameParty.canUse(item);
    }

    /** @returns {void} */
    show() {
        this.selectLast();
        this.showHelpWindow();
        super.show();
    }

    /** @returns {void} */
    hide() {
        this.hideHelpWindow();
        super.hide();
    }
}

/**
 * The window for selecting New Game/Continue on the title screen.
 */
class Window_TitleCommand extends Window_Command {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        this.openness = 0;
        this.selectLast();
    }

    /** @type {string | null} */
    static _lastCommandSymbol = null;

    /** @returns {void} */
    static initCommandPosition() {
        this._lastCommandSymbol = null;
    }

    /** @returns {void} */
    makeCommandList() {
        const continueEnabled = this.isContinueEnabled();
        this.addCommand(TextManager.newGame, "newGame");
        this.addCommand(TextManager.continue_, "continue", continueEnabled);
        this.addCommand(TextManager.options, "options");
    }

    /** @returns {boolean} */
    isContinueEnabled() {
        return DataManager.isAnySavefileExists();
    }

    /** @returns {void} */
    processOk() {
        Window_TitleCommand._lastCommandSymbol = this.currentSymbol();
        super.processOk();
    }

    /** @returns {void} */
    selectLast() {
        if (Window_TitleCommand._lastCommandSymbol) {
            this.selectSymbol(Window_TitleCommand._lastCommandSymbol);
        } else if (this.isContinueEnabled()) {
            this.selectSymbol("continue");
        }
    }
}

/**
 * The window for selecting "Go to Title" on the game end screen.
 */
class Window_GameEnd extends Window_Command {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        this.openness = 0;
        this.open();
    }

    /** @returns {void} */
    makeCommandList() {
        this.addCommand(TextManager.toTitle, "toTitle");
        this.addCommand(TextManager.cancel, "cancel");
    }
}

/**
 * The window for selecting a block of switches/variables on the debug screen.
 */
class Window_DebugRange extends Window_Selectable {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @type {number} */
    static lastTopRow = 0;

    /** @type {number} */
    static lastIndex = 0;

    /** @param {Rectangle} rect */
    initialize(rect) {
        /** @type {number} */
        this._maxSwitches = Math.ceil(($dataSystem.switches.length - 1) / 10);
        /** @type {number} */
        this._maxVariables = Math.ceil(($dataSystem.variables.length - 1) / 10);
        super.initialize(rect);
        this.refresh();
        this.setTopRow(Window_DebugRange.lastTopRow);
        this.select(Window_DebugRange.lastIndex);
        this.activate();
    }

    /** @returns {number} */
    maxItems() {
        return this._maxSwitches + this._maxVariables;
    }

    /** @returns {void} */
    update() {
        super.update();
        if (this._editWindow) {
            const index = this.index();
            this._editWindow.setMode(this.mode(index));
            this._editWindow.setTopId(this.topId(index));
        }
    }

    /**
     * @param {number} [index]
     * @returns {"switch" | "variable"}
     */
    mode(index) {
        return this.isSwitchMode(index) ? "switch" : "variable";
    }

    /**
     * @param {number} index
     * @returns {number}
     */
    topId(index) {
        if (this.isSwitchMode(index)) {
            return index * 10 + 1;
        } else {
            return (index - this._maxSwitches) * 10 + 1;
        }
    }

    /**
     * @param {number} [index]
     * @returns {boolean}
     */
    isSwitchMode(index) {
        return index < this._maxSwitches;
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    drawItem(index) {
        const rect = this.itemLineRect(index);
        const c = this.isSwitchMode(index) ? "S" : "V";
        const start = this.topId(index);
        const end = start + 9;
        const text = c + " [" + start.padZero(4) + "-" + end.padZero(4) + "]";
        this.drawText(text, rect.x, rect.y, rect.width);
    }

    /** @returns {boolean} */
    isCancelTriggered() {
        return (
            Window_Selectable.prototype.isCancelTriggered() ||
            Input.isTriggered("debug")
        );
    }

    /** @returns {void} */
    processCancel() {
        super.processCancel();
        Window_DebugRange.lastTopRow = this.topRow();
        Window_DebugRange.lastIndex = this.index();
    }

    /**
     * @param {Window_DebugEdit} editWindow
     * @returns {void}
     */
    setEditWindow(editWindow) {
        this._editWindow = editWindow;
    }
}

/**
 * The window for displaying switches and variables on the debug screen.
 */
class Window_DebugEdit extends Window_Selectable {
    /** @param {[rect: Rectangle]} args */
    constructor(...args) {
        super(...args);
    }

    /** @param {Rectangle} rect */
    initialize(rect) {
        super.initialize(rect);
        /** @type {"switch" | "variable"} */
        this._mode = "switch";
        /** @type {number} */
        this._topId = 1;
        this.refresh();
    }

    /** @returns {number} */
    maxItems() {
        return 10;
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    drawItem(index) {
        const dataId = this._topId + index;
        const idText = dataId.padZero(4) + ":";
        const idWidth = this.textWidth(idText);
        const statusWidth = this.textWidth("-00000000");
        const name = this.itemName(dataId);
        const status = this.itemStatus(dataId);
        const rect = this.itemLineRect(index);
        this.resetTextColor();
        this.drawText(idText, rect.x, rect.y, rect.width);
        rect.x += idWidth;
        rect.width -= idWidth + statusWidth;
        this.drawText(name, rect.x, rect.y, rect.width);
        this.drawText(status, rect.x + rect.width, rect.y, statusWidth, "right");
    }

    /**
     * @param {RMMZ.SwitchID | RMMZ.VariableID} dataId
     * @returns {string}
     */
    itemName(dataId) {
        if (this._mode === "switch") {
            return $dataSystem.switches[dataId];
        } else {
            return $dataSystem.variables[dataId];
        }
    }

    /**
     * @param {RMMZ.SwitchID | RMMZ.VariableID} dataId
     * @returns {string}
     */
    itemStatus(dataId) {
        if (this._mode === "switch") {
            return $gameSwitches.value(dataId) ? "[ON]" : "[OFF]";
        } else {
            return String($gameVariables.value(dataId));
        }
    }

    /**
     * @param {"switch" | "variable"} mode
     * @returns {void}
     */
    setMode(mode) {
        if (this._mode !== mode) {
            this._mode = mode;
            this.refresh();
        }
    }

    /**
     * @param {RMMZ.SwitchID | RMMZ.VariableID} id
     * @returns {void}
     */
    setTopId(id) {
        if (this._topId !== id) {
            this._topId = id;
            this.refresh();
        }
    }

    /** @returns {number} */
    currentId() {
        return this._topId + this.index();
    }

    /** @returns {void} */
    update() {
        super.update();
        if (this.active) {
            if (this._mode === "switch") {
                this.updateSwitch();
            } else {
                this.updateVariable();
            }
        }
    }

    /** @returns {void} */
    updateSwitch() {
        if (Input.isRepeated("ok")) {
            const switchId = this.currentId();
            this.playCursorSound();
            $gameSwitches.setValue(switchId, !$gameSwitches.value(switchId));
            this.redrawCurrentItem();
        }
    }

    /** @returns {void} */
    updateVariable() {
        const variableId = this.currentId();
        const value = $gameVariables.value(variableId);
        if (typeof value === "number") {
            const newValue = value + this.deltaForVariable();
            if (value !== newValue) {
                $gameVariables.setValue(variableId, newValue);
                this.playCursorSound();
                this.redrawCurrentItem();
            }
        }
    }

    /** @returns {0 | 1 | 10 | -1 | -10} */
    deltaForVariable() {
        if (Input.isRepeated("right")) {
            return 1;
        } else if (Input.isRepeated("left")) {
            return -1;
        } else if (Input.isRepeated("pagedown")) {
            return 10;
        } else if (Input.isRepeated("pageup")) {
            return -10;
        }
        return 0;
    }
}

// Class declarations are lexical bindings, while plugins and JsonEx resolve
// constructors through the global object, so expose them as global properties.
Object.assign(globalThis, {
    Window_Base,
    Window_Scrollable,
    Window_Selectable,
    Window_Command,
    Window_HorzCommand,
    Window_Help,
    Window_Gold,
    Window_StatusBase,
    Window_MenuCommand,
    Window_MenuStatus,
    Window_MenuActor,
    Window_ItemCategory,
    Window_ItemList,
    Window_SkillType,
    Window_SkillStatus,
    Window_SkillList,
    Window_EquipStatus,
    Window_EquipCommand,
    Window_EquipSlot,
    Window_EquipItem,
    Window_Status,
    Window_StatusParams,
    Window_StatusEquip,
    Window_Options,
    Window_SavefileList,
    Window_ShopCommand,
    Window_ShopBuy,
    Window_ShopSell,
    Window_ShopNumber,
    Window_ShopStatus,
    Window_NameEdit,
    Window_NameInput,
    Window_NameBox,
    Window_ChoiceList,
    Window_NumberInput,
    Window_EventItem,
    Window_Message,
    Window_ScrollText,
    Window_MapName,
    Window_BattleLog,
    Window_PartyCommand,
    Window_ActorCommand,
    Window_BattleStatus,
    Window_BattleActor,
    Window_BattleEnemy,
    Window_BattleSkill,
    Window_BattleItem,
    Window_TitleCommand,
    Window_GameEnd,
    Window_DebugRange,
    Window_DebugEdit,
});
