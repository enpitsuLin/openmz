// rmmz_windows.js v2.0.0

/**
 * The superclass of all windows within the game.
 */
class Window_Base extends RmmzWindow {
    declare _opening: boolean;
    declare _closing: boolean;
    declare _dimmerSprite: Sprite | null;

    constructor(rect: Rectangle);
    constructor(..._extra: unknown[]);
    constructor(...args: unknown[]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize();
        this.loadWindowskin();
        this.checkRectObject(rect);
        this.move(rect.x, rect.y, rect.width, rect.height);
        this.updatePadding();
        this.updateBackOpacity();
        this.updateTone();
        this.createContents();

        this._opening = false;
        this._closing = false;
        this._dimmerSprite = null;
    }

    destroy(options?: import("pixi.js").DestroyOptions): void {
        this.destroyContents();
        if (this._dimmerSprite) {
            this._dimmerSprite.bitmap.destroy();
        }
        super.destroy(options);
    }

    checkRectObject(rect: Rectangle): void {
        if (typeof rect !== "object" || !("x" in rect)) {
            // Probably MV plugin is used
            throw new Error("Argument must be a Rectangle");
        }
    }

    lineHeight(): number {
        return 36;
    }

    itemWidth(): number {
        return this.innerWidth;
    }

    itemHeight(): number {
        return this.lineHeight();
    }

    itemPadding(): number {
        return 8;
    }

    baseTextRect(): Rectangle {
        const rect = new PIXI.Rectangle(0, 0, this.innerWidth, this.innerHeight);
        rect.pad(-this.itemPadding(), 0);
        return rect;
    }

    loadWindowskin(): void {
        this.windowskin = ImageManager.loadSystem("Window");
    }

    updatePadding(): void {
        this.padding = $gameSystem.windowPadding();
    }

    updateBackOpacity(): void {
        this.backOpacity = $gameSystem.windowOpacity();
    }

    fittingHeight(numLines: number): number {
        return numLines * this.itemHeight() + $gameSystem.windowPadding() * 2;
    }

    updateTone(): void {
        const tone = $gameSystem.windowTone();
        this.setTone(tone[0], tone[1], tone[2]);
    }

    createContents(): void {
        const width = this.contentsWidth();
        const height = this.contentsHeight();
        this.destroyContents();
        this.contents = new Bitmap(width, height);
        this.contentsBack = new Bitmap(width, height);
        this.resetFontSettings();
    }

    destroyContents(): void {
        if (this.contents) {
            this.contents.destroy();
        }
        if (this.contentsBack) {
            this.contentsBack.destroy();
        }
    }

    contentsWidth(): number {
        return this.innerWidth;
    }

    contentsHeight(): number {
        return this.innerHeight;
    }

    resetFontSettings(): void {
        this.contents.fontFace = $gameSystem.mainFontFace();
        this.contents.fontSize = $gameSystem.mainFontSize();
        this.resetTextColor();
    }

    resetTextColor(): void {
        this.changeTextColor(ColorManager.normalColor());
        this.changeOutlineColor(ColorManager.outlineColor());
    }

    update(): void {
        super.update();
        this.updateTone();
        this.updateOpen();
        this.updateClose();
        this.updateBackgroundDimmer();
    }

    updateOpen(): void {
        if (this._opening) {
            this.openness += 32;
            if (this.isOpen()) {
                this._opening = false;
            }
        }
    }

    updateClose(): void {
        if (this._closing) {
            this.openness -= 32;
            if (this.isClosed()) {
                this._closing = false;
            }
        }
    }

    open(): void {
        if (!this.isOpen()) {
            this._opening = true;
        }
        this._closing = false;
    }

    close(): void {
        if (!this.isClosed()) {
            this._closing = true;
        }
        this._opening = false;
    }

    isOpening(): boolean {
        return this._opening;
    }

    isClosing(): boolean {
        return this._closing;
    }

    show(): void {
        this.visible = true;
    }

    hide(): void {
        this.visible = false;
    }

    activate(): void {
        this.active = true;
    }

    deactivate(): void {
        this.active = false;
    }

    systemColor(): string {
        return ColorManager.systemColor();
    }

    translucentOpacity(): number {
        return 160;
    }

    changeTextColor(color: string): void {
        this.contents.textColor = color;
    }

    changeOutlineColor(color: string): void {
        this.contents.outlineColor = color;
    }

    changePaintOpacity(enabled: boolean | number): void {
        this.contents.paintOpacity = enabled ? 255 : this.translucentOpacity();
    }

    drawRect(x: number, y: number, width: number, height: number): void {
        const outlineColor = this.contents.outlineColor;
        const mainColor = this.contents.textColor;
        this.contents.fillRect(x, y, width, height, outlineColor);
        this.contents.fillRect(x + 1, y + 1, width - 2, height - 2, mainColor);
    }

    drawText(text: string | number, x: number, y: number, maxWidth?: number, align?: CanvasTextAlign): void {
        this.contents.drawText(text, x, y, maxWidth, this.lineHeight(), align);
    }

    textWidth(text: string): number {
        return this.contents.measureTextWidth(text);
    }

    drawTextEx(text: string, x: number, y: number, width: number): number {
        this.resetFontSettings();
        const textState = this.createTextState(text, x, y, width);
        this.processAllText(textState);
        return textState.outputWidth;
    }

    textSizeEx(text: string): Window_Base.TextSize {
        this.resetFontSettings();
        const textState = this.createTextState(text, 0, 0, 0);
        textState.drawing = false;
        this.processAllText(textState);
        return { width: textState.outputWidth, height: textState.outputHeight };
    }

    createTextState(text: string, x: number, y: number, width: number): Window_Base.TextState {
        const rtl = Utils.containsArabic(text);
        const textState = {} as Window_Base.TextState;
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

    processAllText(textState: Window_Base.TextState): void {
        while (textState.index < textState.text.length) {
            this.processCharacter(textState);
        }
        this.flushTextState(textState);
    }

    flushTextState(textState: Window_Base.TextState): void {
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

    createTextBuffer(rtl: boolean): "" | "\u202B" {
        // U+202B: RIGHT-TO-LEFT EMBEDDING
        return rtl ? "\u202B" : "";
    }

    convertEscapeCharacters(text: string): string {
        /* eslint no-control-regex: 0 */
        text = text.replace(/\\/g, "\x1b");
        text = text.replace(/\x1b\x1b/g, "\\");
        while (text.match(/\x1bV\[(\d+)\]/gi)) {
            text = text.replace(/\x1bV\[(\d+)\]/gi, (_, p1) => String($gameVariables.value(parseInt(p1))));
        }
        text = text.replace(/\x1bN\[(\d+)\]/gi, (_, p1) => this.actorName(parseInt(p1)));
        text = text.replace(/\x1bP\[(\d+)\]/gi, (_, p1) => this.partyMemberName(parseInt(p1)));
        text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    }

    actorName(n: RMMZ.ActorID): string {
        const actor = n >= 1 ? $gameActors.actor(n) : null;
        return actor ? actor.name() : "";
    }

    partyMemberName(n: number): string {
        const actor = n >= 1 ? $gameParty.members()[n - 1] : null;
        return actor ? actor.name() : "";
    }

    processCharacter(textState: Window_Base.TextState): void {
        const c = textState.text[textState.index++];
        if (c.charCodeAt(0) < 0x20) {
            this.flushTextState(textState);
            this.processControlCharacter(textState, c);
        } else {
            textState.buffer += c;
        }
    }

    processControlCharacter(textState: Window_Base.TextState, c: string): void {
        if (c === "\n") {
            this.processNewLine(textState);
        }
        if (c === "\x1b") {
            const code = this.obtainEscapeCode(textState);
            this.processEscapeCharacter(code as "}" | "C" | "I" | "PX" | "PY" | "FS" | "{", textState);
        }
    }

    processNewLine(textState: Window_Base.TextState): void {
        textState.x = textState.startX;
        textState.y += textState.height;
        textState.height = this.calcTextHeight(textState);
    }

    obtainEscapeCode(textState: Window_Base.TextState): string {
        const regExp = /^[$.|^!><{}\\]|^[A-Z]+/i;
        const arr = regExp.exec(textState.text.slice(textState.index));
        if (arr) {
            textState.index += arr[0].length;
            return arr[0].toUpperCase();
        } else {
            return "";
        }
    }

    obtainEscapeParam(textState: Window_Base.TextState): number | "" {
        const regExp = /^\[\d+\]/;
        const arr = regExp.exec(textState.text.slice(textState.index));
        if (arr) {
            textState.index += arr[0].length;
            return parseInt(arr[0].slice(1));
        } else {
            return "";
        }
    }

    processEscapeCharacter(code: "C" | "I" | "PX" | "PY" | "FS" | "{" | "}", textState: Window_Base.TextState): void {
        switch (code) {
            case "C":
                this.processColorChange(this.obtainEscapeParam(textState) as number);
                break;
            case "I":
                this.processDrawIcon(this.obtainEscapeParam(textState) as number, textState);
                break;
            case "PX":
                textState.x = this.obtainEscapeParam(textState) as number;
                break;
            case "PY":
                textState.y = this.obtainEscapeParam(textState) as number;
                break;
            case "FS":
                this.contents.fontSize = this.obtainEscapeParam(textState) as number;
                break;
            case "{":
                this.makeFontBigger();
                break;
            case "}":
                this.makeFontSmaller();
                break;
        }
    }

    processColorChange(colorIndex: number): void {
        this.changeTextColor(ColorManager.textColor(colorIndex));
    }

    processDrawIcon(iconIndex: number, textState: Window_Base.TextState): void {
        const deltaX = ImageManager.standardIconWidth - ImageManager.iconWidth;
        const deltaY = ImageManager.standardIconHeight - ImageManager.iconHeight;
        if (textState.drawing) {
            const x = textState.x + deltaX / 2 + 2;
            const y = textState.y + deltaY / 2 + 2;
            this.drawIcon(iconIndex, x, y);
        }
        textState.x += ImageManager.standardIconWidth + 4;
    }

    makeFontBigger(): void {
        if (this.contents.fontSize <= 96) {
            this.contents.fontSize += 12;
        }
    }

    makeFontSmaller(): void {
        if (this.contents.fontSize >= 24) {
            this.contents.fontSize -= 12;
        }
    }

    calcTextHeight(textState: Window_Base.TextState): number {
        const lineSpacing = this.lineHeight() - $gameSystem.mainFontSize();
        const lastFontSize = this.contents.fontSize;
        const lines = textState.text.slice(textState.index).split("\n");
        const textHeight = this.maxFontSizeInLine(lines[0]) + lineSpacing;
        this.contents.fontSize = lastFontSize;
        return textHeight;
    }

    maxFontSizeInLine(line: string): number {
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

    drawIcon(iconIndex: number, x: number, y: number): void {
        const bitmap = ImageManager.loadSystem("IconSet");
        const pw = ImageManager.iconWidth;
        const ph = ImageManager.iconHeight;
        const sx = (iconIndex % 16) * pw;
        const sy = Math.floor(iconIndex / 16) * ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, Math.floor(x), Math.floor(y));
    }

    // prettier-ignore

    drawFace(
        faceName: string, faceIndex: number, x: number, y: number, width?: number, height?: number
    ): void {
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

    drawCharacter(
        characterName: string, characterIndex: number, x: number, y: number
    ): void {
        const bitmap = ImageManager.loadCharacter(characterName);
        const big = ImageManager.isBigCharacter(characterName);
        const pw = bitmap.width / (big ? 3 : 12);
        const ph = bitmap.height / (big ? 4 : 8);
        const n = big ? 0: characterIndex;
        const sx = ((n % 4) * 3 + 1) * pw;
        const sy = Math.floor(n / 4) * 4 * ph;
        this.contents.blt(bitmap, sx, sy, pw, ph, x - pw / 2, y - ph);
    }

    drawItemName(item: RMMZ.DataItemBase | null, x: number, y: number, width: number): void {
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

    drawCurrencyValue(value: number, unit: string, x: number, y: number, width: number): void {
        const unitWidth = Math.min(80, this.textWidth(unit));
        this.resetTextColor();
        this.drawText(value, x, y, width - unitWidth - 6, "right");
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(unit, x + width - unitWidth, y, unitWidth, "right");
    }

    setBackgroundType(type: RMMZ.TextWindowBackgroundType): void {
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

    showBackgroundDimmer(): void {
        if (!this._dimmerSprite) {
            this.createDimmerSprite();
        }
        const bitmap = this._dimmerSprite!.bitmap;
        if (bitmap.width !== this.width || bitmap.height !== this.height) {
            this.refreshDimmerBitmap();
        }
        this._dimmerSprite!.visible = true;
        this.updateBackgroundDimmer();
    }

    createDimmerSprite(): void {
        this._dimmerSprite = new Sprite();
        this._dimmerSprite.bitmap = new Bitmap(0, 0);
        this._dimmerSprite.x = -4;
        this.addChildToBack(this._dimmerSprite);
    }

    hideBackgroundDimmer(): void {
        if (this._dimmerSprite) {
            this._dimmerSprite.visible = false;
        }
    }

    updateBackgroundDimmer(): void {
        if (this._dimmerSprite) {
            this._dimmerSprite.opacity = this.openness;
        }
    }

    refreshDimmerBitmap(): void {
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

    playCursorSound(): void {
        SoundManager.playCursor();
    }

    playOkSound(): void {
        SoundManager.playOk();
    }

    playBuzzerSound(): void {
        SoundManager.playBuzzer();
    }
}

declare namespace Window_Base {
    export interface TextState {
        text: string;
        index: number;
        x: number;
        y: number;
        width: number;
        height: number;
        startX: number;
        startY: number;
        rtl: boolean;
        buffer: string;
        drawing: boolean;
        outputWidth: number;
        outputHeight: number;
    }

    export interface TextSize {
        width: number;
        height: number;
    }
}

/**
 * The window class with scroll functions.
 */
class Window_Scrollable extends Window_Base {
    declare _scrollX: number;
    declare _scrollY: number;
    declare _scrollBaseX: number;
    declare _scrollBaseY: number;
    declare _scrollTargetX: number;
    declare _scrollTargetY: number;
    declare _scrollDuration: number;
    declare _scrollAccelX: number;
    declare _scrollAccelY: number;
    declare _scrollTouching: boolean;
    declare _scrollLastTouchX: number;
    declare _scrollLastTouchY: number;
    declare _scrollLastCursorVisible: boolean;

    constructor(rect: Rectangle);
    constructor(..._extra: unknown[]);
    constructor(...args: unknown[]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);

        this._scrollX = 0;
        this._scrollY = 0;
        this._scrollBaseX = 0;
        this._scrollBaseY = 0;
        this.clearScrollStatus();
    }

    clearScrollStatus(): void {
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

    scrollX(): number {
        return this._scrollX;
    }

    scrollY(): number {
        return this._scrollY;
    }

    scrollBaseX(): number {
        return this._scrollBaseX;
    }

    scrollBaseY(): number {
        return this._scrollBaseY;
    }

    scrollTo(x: number, y: number): void {
        const scrollX = x.clamp(0, this.maxScrollX());
        const scrollY = y.clamp(0, this.maxScrollY());
        if (this._scrollX !== scrollX || this._scrollY !== scrollY) {
            this._scrollX = scrollX;
            this._scrollY = scrollY;
            this.updateOrigin();
        }
    }

    scrollBy(x: number, y: number): void {
        this.scrollTo(this._scrollX + x, this._scrollY + y);
    }

    smoothScrollTo(x: number, y: number): void {
        this._scrollTargetX = x.clamp(0, this.maxScrollX());
        this._scrollTargetY = y.clamp(0, this.maxScrollY());
        this._scrollDuration = Input.keyRepeatInterval;
    }

    smoothScrollBy(x: number, y: number): void {
        if (this._scrollDuration === 0) {
            this._scrollTargetX = this.scrollX();
            this._scrollTargetY = this.scrollY();
        }
        this.smoothScrollTo(this._scrollTargetX + x, this._scrollTargetY + y);
    }

    setScrollAccel(x: number, y: number): void {
        this._scrollAccelX = x;
        this._scrollAccelY = y;
    }

    overallWidth(): number {
        return this.innerWidth;
    }

    overallHeight(): number {
        return this.innerHeight;
    }

    maxScrollX(): number {
        return Math.max(0, this.overallWidth() - this.innerWidth);
    }

    maxScrollY(): number {
        return Math.max(0, this.overallHeight() - this.innerHeight);
    }

    scrollBlockWidth(): number {
        return this.itemWidth();
    }

    scrollBlockHeight(): number {
        return this.itemHeight();
    }

    smoothScrollDown(n: number): void {
        this.smoothScrollBy(0, this.itemHeight() * n);
    }

    smoothScrollUp(n: number): void {
        this.smoothScrollBy(0, -this.itemHeight() * n);
    }

    update(): void {
        super.update();
        this.processWheelScroll();
        this.processTouchScroll();
        this.updateSmoothScroll();
        this.updateScrollAccel();
        this.updateArrows();
        this.updateOrigin();
    }

    processWheelScroll(): void {
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

    processTouchScroll(): void {
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

    isWheelScrollEnabled(): boolean {
        return this.isScrollEnabled();
    }

    isTouchScrollEnabled(): boolean {
        return this.isScrollEnabled();
    }

    isScrollEnabled(): boolean {
        return true;
    }

    isTouchedInsideFrame(): boolean {
        const touchPos = new PIXI.Point(TouchInput.x, TouchInput.y);
        const localPos = this.toLocal(touchPos);
        return this.innerRect.contains(localPos.x, localPos.y);
    }

    onTouchScrollStart(): void {
        this._scrollTouching = true;
        this._scrollLastTouchX = TouchInput.x;
        this._scrollLastTouchY = TouchInput.y;
        this._scrollLastCursorVisible = this.cursorVisible;
        this.setScrollAccel(0, 0);
    }

    onTouchScroll(): void {
        const accelX = this._scrollLastTouchX - TouchInput.x;
        const accelY = this._scrollLastTouchY - TouchInput.y;
        this.setScrollAccel(accelX, accelY);
        this._scrollLastTouchX = TouchInput.x;
        this._scrollLastTouchY = TouchInput.y;
        this.cursorVisible = false;
    }

    onTouchScrollEnd(): void {
        this._scrollTouching = false;
        this.cursorVisible = this._scrollLastCursorVisible;
    }

    updateSmoothScroll(): void {
        if (this._scrollDuration > 0) {
            const d = this._scrollDuration;
            const deltaX = (this._scrollTargetX - this._scrollX) / d;
            const deltaY = (this._scrollTargetY - this._scrollY) / d;
            this.scrollBy(deltaX, deltaY);
            this._scrollDuration--;
        }
    }

    updateScrollAccel(): void {
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

    updateArrows(): void {
        this.downArrowVisible = this._scrollY < this.maxScrollY();
        this.upArrowVisible = this._scrollY > 0;
    }

    updateOrigin(): void {
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

    updateScrollBase(baseX: number, baseY: number): void {
        const deltaX = baseX - this._scrollBaseX;
        const deltaY = baseY - this._scrollBaseY;
        this._scrollBaseX = baseX;
        this._scrollBaseY = baseY;
        this.moveCursorBy(-deltaX, -deltaY);
        this.moveInnerChildrenBy(-deltaX, -deltaY);
    }

    paint(): void {
        // to be overridden
    }
}

/**
 * The window class with cursor movement functions.
 */
class Window_Selectable extends Window_Scrollable {
    declare _index: number;
    declare _cursorFixed: boolean;
    declare _cursorAll: boolean;
    declare _helpWindow: Window_Help | null;
    declare _handlers: Record<string, () => void>;
    declare _doubleTouch: boolean;
    declare _canRepeat: boolean;

    constructor(rect: Rectangle);
    constructor(..._extra: unknown[]);
    constructor(...args: unknown[]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);

        this._index = -1;
        this._cursorFixed = false;
        this._cursorAll = false;
        this._helpWindow = null;
        this._handlers = {};
        this._doubleTouch = false;
        this._canRepeat = true;
        this.deactivate();
    }

    index(): number {
        return this._index;
    }

    cursorFixed(): boolean {
        return this._cursorFixed;
    }

    setCursorFixed(cursorFixed: boolean): void {
        this._cursorFixed = cursorFixed;
    }

    cursorAll(): boolean {
        return this._cursorAll;
    }

    setCursorAll(cursorAll: boolean): void {
        this._cursorAll = cursorAll;
    }

    maxCols(): number {
        return 1;
    }

    maxItems(): number {
        return 0;
    }

    colSpacing(): number {
        return 8;
    }

    rowSpacing(): number {
        return 4;
    }

    itemWidth(): number {
        return Math.floor(this.innerWidth / this.maxCols());
    }

    itemHeight(): number {
        return super.itemHeight() + 8;
    }

    contentsHeight(): number {
        return this.innerHeight + this.itemHeight();
    }

    maxRows(): number {
        return Math.max(Math.ceil(this.maxItems() / this.maxCols()), 1);
    }

    overallHeight(): number {
        return this.maxRows() * this.itemHeight();
    }

    activate(): void {
        super.activate();
        this.reselect();
    }

    deactivate(): void {
        super.deactivate();
        this.reselect();
    }

    select(index: number): void {
        this._index = index;
        this.refreshCursor();
        this.callUpdateHelp();
    }

    forceSelect(index: number): void {
        this.select(index);
        this.ensureCursorVisible(false);
    }

    smoothSelect(index: number): void {
        this.select(index);
        this.ensureCursorVisible(true);
    }

    deselect(): void {
        this.select(-1);
    }

    reselect(): void {
        this.select(this._index);
        this.ensureCursorVisible(true);
        this.cursorVisible = true;
    }

    row(): number {
        return Math.floor(this.index() / this.maxCols());
    }

    topRow(): number {
        return Math.floor(this.scrollY() / this.itemHeight());
    }

    maxTopRow(): number {
        return Math.max(0, this.maxRows() - this.maxPageRows());
    }

    setTopRow(row: number): void {
        this.scrollTo(this.scrollX(), row * this.itemHeight());
    }

    maxPageRows(): number {
        return Math.floor(this.innerHeight / this.itemHeight());
    }

    maxPageItems(): number {
        return this.maxPageRows() * this.maxCols();
    }

    maxVisibleItems(): number {
        const visibleRows = Math.ceil(this.contentsHeight() / this.itemHeight());
        return visibleRows * this.maxCols();
    }

    isHorizontal(): boolean {
        return this.maxPageRows() === 1;
    }

    topIndex(): number {
        return this.topRow() * this.maxCols();
    }

    itemRect(index: number): Rectangle {
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

    itemRectWithPadding(index: number): Rectangle {
        const rect = this.itemRect(index);
        const padding = this.itemPadding();
        rect.x += padding;
        rect.width -= padding * 2;
        return rect;
    }

    itemLineRect(index: number): Rectangle {
        const rect = this.itemRectWithPadding(index);
        const padding = (rect.height - this.lineHeight()) / 2;
        rect.y += padding;
        rect.height -= padding * 2;
        return rect;
    }

    setHelpWindow(helpWindow: Window_Help): void {
        this._helpWindow = helpWindow;
        this.callUpdateHelp();
    }

    showHelpWindow(): void {
        if (this._helpWindow) {
            this._helpWindow.show();
        }
    }

    hideHelpWindow(): void {
        if (this._helpWindow) {
            this._helpWindow.hide();
        }
    }

    setHandler(symbol: string, method: () => void): void {
        this._handlers[symbol] = method;
    }

    isHandled(symbol: string): boolean {
        return !!this._handlers[symbol];
    }

    callHandler(symbol: string): void {
        if (this.isHandled(symbol)) {
            this._handlers[symbol]();
        }
    }

    isOpenAndActive(): boolean {
        return this.isOpen() && this.visible && this.active;
    }

    isCursorMovable(): boolean {
        return this.isOpenAndActive() && !this._cursorFixed && !this._cursorAll && this.maxItems() > 0;
    }

    cursorDown(wrap: boolean): void {
        const index = this.index();
        const maxItems = this.maxItems();
        const maxCols = this.maxCols();
        if (index < maxItems - maxCols || (wrap && maxCols === 1)) {
            this.smoothSelect((index + maxCols) % maxItems);
        }
    }

    cursorUp(wrap: boolean): void {
        const index = Math.max(0, this.index());
        const maxItems = this.maxItems();
        const maxCols = this.maxCols();
        if (index >= maxCols || (wrap && maxCols === 1)) {
            this.smoothSelect((index - maxCols + maxItems) % maxItems);
        }
    }

    cursorRight(wrap: boolean): void {
        const index = this.index();
        const maxItems = this.maxItems();
        const maxCols = this.maxCols();
        const horizontal = this.isHorizontal();
        if (maxCols >= 2 && (index < maxItems - 1 || (wrap && horizontal))) {
            this.smoothSelect((index + 1) % maxItems);
        }
    }

    cursorLeft(wrap: boolean): void {
        const index = Math.max(0, this.index());
        const maxItems = this.maxItems();
        const maxCols = this.maxCols();
        const horizontal = this.isHorizontal();
        if (maxCols >= 2 && (index > 0 || (wrap && horizontal))) {
            this.smoothSelect((index - 1 + maxItems) % maxItems);
        }
    }

    cursorPagedown(): void {
        const index = this.index();
        const maxItems = this.maxItems();
        if (this.topRow() + this.maxPageRows() < this.maxRows()) {
            this.smoothScrollDown(this.maxPageRows());
            this.select(Math.min(index + this.maxPageItems(), maxItems - 1));
        }
    }

    cursorPageup(): void {
        const index = this.index();
        if (this.topRow() > 0) {
            this.smoothScrollUp(this.maxPageRows());
            this.select(Math.max(index - this.maxPageItems(), 0));
        }
    }

    isScrollEnabled(): boolean {
        return this.active || this.index() < 0;
    }

    update(): void {
        this.processCursorMove();
        this.processHandling();
        this.processTouch();
        super.update();
    }

    processCursorMove(): void {
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

    processHandling(): void {
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

    processTouch(): void {
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

    isHoverEnabled(): boolean {
        return true;
    }

    onTouchSelect(trigger: boolean): void {
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

    onTouchOk(): void {
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

    onTouchCancel(): void {
        if (this.isCancelEnabled()) {
            this.processCancel();
        }
    }

    hitIndex(): number {
        const touchPos = new PIXI.Point(TouchInput.x, TouchInput.y);
        const localPos = this.toLocal(touchPos);
        return this.hitTest(localPos.x, localPos.y);
    }

    hitTest(x: number, y: number): number {
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

    isTouchOkEnabled(): boolean {
        return this.isOkEnabled() && (this._cursorFixed || this._cursorAll || this._doubleTouch);
    }

    isOkEnabled(): boolean {
        return this.isHandled("ok");
    }

    isCancelEnabled(): boolean {
        return this.isHandled("cancel");
    }

    isOkTriggered(): boolean {
        return this._canRepeat ? Input.isRepeated("ok") : Input.isTriggered("ok");
    }

    isCancelTriggered(): boolean {
        return Input.isRepeated("cancel");
    }

    processOk(): void {
        if (this.isCurrentItemEnabled()) {
            this.playOkSound();
            this.updateInputData();
            this.deactivate();
            this.callOkHandler();
        } else {
            this.playBuzzerSound();
        }
    }

    callOkHandler(): void {
        this.callHandler("ok");
    }

    processCancel(): void {
        SoundManager.playCancel();
        this.updateInputData();
        this.deactivate();
        this.callCancelHandler();
    }

    callCancelHandler(): void {
        this.callHandler("cancel");
    }

    processPageup(): void {
        this.updateInputData();
        this.deactivate();
        this.callHandler("pageup");
    }

    processPagedown(): void {
        this.updateInputData();
        this.deactivate();
        this.callHandler("pagedown");
    }

    updateInputData(): void {
        Input.update();
        TouchInput.update();
        this.clearScrollStatus();
    }

    ensureCursorVisible(smooth: boolean): void {
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

    callUpdateHelp(): void {
        if (this.active && this._helpWindow) {
            this.updateHelp();
        }
    }

    updateHelp(): void {
        this._helpWindow!.clear();
    }

    setHelpWindowItem(item: RMMZ.DataItemBase | null): void {
        if (this._helpWindow) {
            this._helpWindow.setItem(item);
        }
    }

    isCurrentItemEnabled(): boolean {
        return true;
    }

    drawAllItems(): void {
        const topIndex = this.topIndex();
        for (let i = 0; i < this.maxVisibleItems(); i++) {
            const index = topIndex + i;
            if (index < this.maxItems()) {
                this.drawItemBackground(index);
                this.drawItem(index);
            }
        }
    }

    drawItem(_index: number): void {
        //
    }

    clearItem(index: number): void {
        const rect = this.itemRect(index);
        this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
        this.contentsBack.clearRect(rect.x, rect.y, rect.width, rect.height);
    }

    drawItemBackground(index: number): void {
        const rect = this.itemRect(index);
        this.drawBackgroundRect(rect);
    }

    drawBackgroundRect(rect: Rectangle): void {
        const c1 = ColorManager.itemBackColor1();
        const c2 = ColorManager.itemBackColor2();
        const x = rect.x;
        const y = rect.y;
        const w = rect.width;
        const h = rect.height;
        this.contentsBack.gradientFillRect(x, y, w, h, c1, c2, true);
        this.contentsBack.strokeRect(x, y, w, h, c1);
    }

    redrawItem(index: number): void {
        if (index >= 0) {
            this.clearItem(index);
            this.drawItemBackground(index);
            this.drawItem(index);
        }
    }

    redrawCurrentItem(): void {
        this.redrawItem(this.index());
    }

    refresh(): void {
        this.paint();
    }

    paint(): void {
        if (this.contents) {
            this.contents.clear();
            this.contentsBack.clear();
            this.drawAllItems();
        }
    }

    refreshCursor(): void {
        if (this._cursorAll) {
            this.refreshCursorForAll();
        } else if (this.index() >= 0) {
            const rect = this.itemRect(this.index());
            this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
        } else {
            this.setCursorRect(0, 0, 0, 0);
        }
    }

    refreshCursorForAll(): void {
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
    declare _list: Window_Command.Command[];

    constructor(rect: Rectangle);
    constructor(..._extra: unknown[]);
    constructor(...args: unknown[]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);
        this.refresh();
        this.select(0);
        this.activate();
    }

    maxItems(): number {
        return this._list.length;
    }

    clearCommandList(): void {
        this._list = [];
    }

    makeCommandList(): void {
        //
    }

    // prettier-ignore

    addCommand(
        name: string, symbol: string, enabled: boolean = true, ext: number | null = null
    ): void {
        this._list.push({ name: name, symbol: symbol, enabled: enabled, ext: ext });
    }

    commandName(index: number): string {
        return this._list[index].name;
    }

    commandSymbol(index: number): string {
        return this._list[index].symbol;
    }

    isCommandEnabled(index: number): boolean {
        return this._list[index].enabled;
    }

    currentData(): Window_Command.Command | null {
        return this.index() >= 0 ? this._list[this.index()] : null;
    }

    isCurrentItemEnabled(): boolean {
        return this.currentData() ? this.currentData()!.enabled : false;
    }

    currentSymbol(): string | null {
        return this.currentData() ? this.currentData()!.symbol : null;
    }

    currentExt(): number | null {
        return this.currentData() ? this.currentData()!.ext : null;
    }

    findSymbol(symbol: string | null): number {
        return this._list.findIndex((item) => item.symbol === symbol);
    }

    selectSymbol(symbol: string | null): void {
        const index = this.findSymbol(symbol);
        if (index >= 0) {
            this.forceSelect(index);
        } else {
            this.forceSelect(0);
        }
    }

    findExt(ext: number): number {
        return this._list.findIndex((item) => item.ext === ext);
    }

    selectExt(ext: number): void {
        const index = this.findExt(ext);
        if (index >= 0) {
            this.forceSelect(index);
        } else {
            this.forceSelect(0);
        }
    }

    drawItem(index: number): void {
        const rect = this.itemLineRect(index);
        const align = this.itemTextAlign();
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
    }

    itemTextAlign(): CanvasTextAlign {
        return "center";
    }

    isOkEnabled(): boolean {
        return true;
    }

    callOkHandler(): void {
        const symbol = this.currentSymbol();
        if (this.isHandled(symbol!)) {
            this.callHandler(symbol!);
        } else if (this.isHandled("ok")) {
            super.callOkHandler();
        } else {
            this.activate();
        }
    }

    refresh(): void {
        this.clearCommandList();
        this.makeCommandList();
        super.refresh();
    }
}

declare namespace Window_Command {
    export interface Command {
        name: string;
        symbol: string;
        enabled: boolean;
        ext: number | null;
    }
}

/**
 * The command window for the horizontal selection format.
 */
class Window_HorzCommand extends Window_Command {
    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);
    }

    maxCols(): number {
        return 4;
    }

    itemTextAlign(): "center" {
        return "center";
    }
}

/**
 * The window for displaying the description of the selected item.
 */
class Window_Help extends Window_Base {
    declare _text: string;

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);

        this._text = "";
    }

    setText(text: string): void {
        if (this._text !== text) {
            this._text = text;
            this.refresh();
        }
    }

    clear(): void {
        this.setText("");
    }

    setItem(item: RMMZ.DataItemBase | null): void {
        this.setText(item ? item.description : "");
    }

    refresh(): void {
        const rect = this.baseTextRect();
        this.contents.clear();
        this.drawTextEx(this._text, rect.x, rect.y, rect.width);
    }
}

/**
 * The window for displaying the party's gold.
 */
class Window_Gold extends Window_Selectable {
    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);
        this.refresh();
    }

    colSpacing(): number {
        return 0;
    }

    refresh(): void {
        const rect = this.itemLineRect(0);
        const x = rect.x;
        const y = rect.y;
        const width = rect.width;
        this.contents.clear();
        this.drawCurrencyValue(this.value(), this.currencyUnit(), x, y, width);
    }

    value(): number {
        return $gameParty.gold();
    }

    currencyUnit(): string {
        return TextManager.currencyUnit;
    }

    open(): void {
        this.refresh();
        super.open();
    }
}

/**
 * The superclass of windows for displaying actor status.
 */
class Window_StatusBase extends Window_Selectable {
    declare _additionalSprites: Record<string, Sprite>;

    constructor(rect: Rectangle);
    constructor(..._extra: unknown[]);
    constructor(...args: unknown[]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);

        this._additionalSprites = {};
        this.loadFaceImages();
    }

    loadFaceImages(): void {
        for (const actor of $gameParty.members()) {
            ImageManager.loadFace(actor.faceName());
        }
    }

    refresh(): void {
        this.hideAdditionalSprites();
        super.refresh();
    }

    hideAdditionalSprites(): void {
        for (const sprite of Object.values(this._additionalSprites)) {
            sprite.hide();
        }
    }

    placeActorName(actor: Game_Actor, x: number, y: number): void {
        const key = "actor%1-name".format(actor.actorId());
        const sprite = this.createInnerSprite(key, Sprite_Name);
        sprite.setup(actor);
        sprite.move(x, y);
        sprite.show();
    }

    placeStateIcon(actor: Game_Actor, x: number, y: number): void {
        const key = "actor%1-stateIcon".format(actor.actorId());
        const sprite = this.createInnerSprite(key, Sprite_StateIcon);
        sprite.setup(actor);
        sprite.move(x, y);
        sprite.show();
    }

    placeGauge(actor: Game_Actor, type: "time" | "hp" | "mp" | "tp", x: number, y: number): void {
        const key = "actor%1-gauge-%2".format(actor.actorId(), type);
        const sprite = this.createInnerSprite(key, Sprite_Gauge);
        sprite.setup(actor, type);
        sprite.move(x, y);
        sprite.show();
    }

    createInnerSprite<T extends Sprite>(key: string, spriteClass: new () => T): T {
        const dict = this._additionalSprites;
        if (dict[key]) {
            return dict[key] as T;
        } else {
            const sprite = new spriteClass();
            dict[key] = sprite;
            this.addInnerChild(sprite);
            return sprite;
        }
    }

    placeTimeGauge(actor: Game_Actor, x: number, y: number): void {
        if (BattleManager.isTpb()) {
            this.placeGauge(actor, "time", x, y);
        }
    }

    placeBasicGauges(actor: Game_Actor, x: number, y: number): void {
        this.placeGauge(actor, "hp", x, y);
        this.placeGauge(actor, "mp", x, y + this.gaugeLineHeight());
        if ($dataSystem.optDisplayTp) {
            this.placeGauge(actor, "tp", x, y + this.gaugeLineHeight() * 2);
        }
    }

    gaugeLineHeight(): number {
        return 24;
    }

    drawActorCharacter(actor: Game_Actor, x: number, y: number): void {
        this.drawCharacter(actor.characterName(), actor.characterIndex(), x, y);
    }

    // prettier-ignore

    drawActorFace(
        actor: Game_Actor, x: number, y: number, width?: number, height?: number
    ): void {
        this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height);
    }

    drawActorName(actor: Game_Actor, x: number, y: number, width?: number): void {
        width = width || 168;
        this.changeTextColor(ColorManager.hpColor(actor));
        this.drawText(actor.name(), x, y, width);
    }

    drawActorClass(actor: Game_Actor, x: number, y: number, width?: number): void {
        width = width || 168;
        this.resetTextColor();
        this.drawText(actor.currentClass().name, x, y, width);
    }

    drawActorNickname(actor: Game_Actor, x: number, y: number, width?: number): void {
        width = width || 270;
        this.resetTextColor();
        this.drawText(actor.nickname(), x, y, width);
    }

    drawActorLevel(actor: Game_Actor, x: number, y: number): void {
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.levelA, x, y, 48);
        this.resetTextColor();
        this.drawText(actor.level, x + 84, y, 36, "right");
    }

    drawActorIcons(actor: Game_Actor, x: number, y: number, width?: number): void {
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

    drawActorSimpleStatus(actor: Game_Actor, x: number, y: number): void {
        const lineHeight = this.lineHeight();
        const x2 = x + 180;
        this.drawActorName(actor, x, y);
        this.drawActorLevel(actor, x, y + lineHeight * 1);
        this.drawActorIcons(actor, x, y + lineHeight * 2);
        this.drawActorClass(actor, x2, y);
        this.placeBasicGauges(actor, x2, y + lineHeight);
    }

    actorSlotName(actor: Game_Actor, index: number): string {
        const slots = actor.equipSlots();
        return $dataSystem.equipTypes[slots[index]];
    }
}

/**
 * The window for selecting a command on the menu screen.
 */
class Window_MenuCommand extends Window_Command {
    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);
        this.selectLast();

        this._canRepeat = false;
    }

    static _lastCommandSymbol: string | null = null;

    static initCommandPosition(): void {
        this._lastCommandSymbol = null;
    }

    makeCommandList(): void {
        this.addMainCommands();
        this.addFormationCommand();
        this.addOriginalCommands();
        this.addOptionsCommand();
        this.addSaveCommand();
        this.addGameEndCommand();
    }

    addMainCommands(): void {
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

    addFormationCommand(): void {
        if (this.needsCommand("formation")) {
            const enabled = this.isFormationEnabled();
            this.addCommand(TextManager.formation, "formation", enabled);
        }
    }

    addOriginalCommands(): void {
        //
    }

    addOptionsCommand(): void {
        if (this.needsCommand("options")) {
            const enabled = this.isOptionsEnabled();
            this.addCommand(TextManager.options, "options", enabled);
        }
    }

    addSaveCommand(): void {
        if (this.needsCommand("save")) {
            const enabled = this.isSaveEnabled();
            this.addCommand(TextManager.save, "save", enabled);
        }
    }

    addGameEndCommand(): void {
        const enabled = this.isGameEndEnabled();
        this.addCommand(TextManager.gameEnd, "gameEnd", enabled);
    }

    needsCommand(name: string): boolean {
        const table = ["item", "skill", "equip", "status", "formation", "save"];
        const index = table.indexOf(name);
        if (index >= 0) {
            return $dataSystem.menuCommands[index];
        }
        return true;
    }

    areMainCommandsEnabled(): boolean {
        return $gameParty.exists();
    }

    isFormationEnabled(): boolean {
        return $gameParty.size() >= 2 && $gameSystem.isFormationEnabled();
    }

    isOptionsEnabled(): boolean {
        return true;
    }

    isSaveEnabled(): boolean {
        return !DataManager.isEventTest() && $gameSystem.isSaveEnabled();
    }

    isGameEndEnabled(): boolean {
        return true;
    }

    processOk(): void {
        Window_MenuCommand._lastCommandSymbol = this.currentSymbol();
        super.processOk();
    }

    selectLast(): void {
        this.selectSymbol(Window_MenuCommand._lastCommandSymbol);
    }
}

/**
 * The window for displaying party member status on the menu screen.
 */
class Window_MenuStatus extends Window_StatusBase {
    declare _formationMode: boolean;
    declare _pendingIndex: number;

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);

        this._formationMode = false;
        this._pendingIndex = -1;
        this.refresh();
    }

    maxItems(): number {
        return $gameParty.size();
    }

    numVisibleRows(): number {
        return 4;
    }

    itemHeight(): number {
        return Math.floor(this.innerHeight / this.numVisibleRows());
    }

    actor(index: number): Game_Actor {
        return $gameParty.members()[index];
    }

    drawItem(index: number): void {
        this.drawPendingItemBackground(index);
        this.drawItemImage(index);
        this.drawItemStatus(index);
    }

    drawPendingItemBackground(index: number): void {
        if (index === this._pendingIndex) {
            const rect = this.itemRect(index);
            const color = ColorManager.pendingColor();
            this.changePaintOpacity(false);
            this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
            this.changePaintOpacity(true);
        }
    }

    drawItemImage(index: number): void {
        const actor = this.actor(index);
        const rect = this.itemRect(index);
        const width = ImageManager.standardFaceWidth;
        const height = rect.height - 2;
        this.changePaintOpacity(actor.isBattleMember());
        this.drawActorFace(actor, rect.x + 1, rect.y + 1, width, height);
        this.changePaintOpacity(true);
    }

    drawItemStatus(index: number): void {
        const actor = this.actor(index);
        const rect = this.itemRect(index);
        const x = rect.x + 180;
        const y = rect.y + Math.floor(rect.height / 2 - this.lineHeight() * 1.5);
        this.drawActorSimpleStatus(actor, x, y);
    }

    processOk(): void {
        super.processOk();
        const actor = this.actor(this.index());
        $gameParty.setMenuActor(actor);
    }

    isCurrentItemEnabled(): boolean {
        if (this._formationMode) {
            const actor = this.actor(this.index());
            return actor && actor.isFormationChangeOk();
        } else {
            return true;
        }
    }

    selectLast(): void {
        this.smoothSelect($gameParty.menuActor().index() || 0);
    }

    formationMode(): boolean {
        return this._formationMode;
    }

    setFormationMode(formationMode: boolean): void {
        this._formationMode = formationMode;
    }

    pendingIndex(): number {
        return this._pendingIndex;
    }

    setPendingIndex(index: number): void {
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
    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);
        this.hide();
    }

    processOk(): void {
        if (!this.cursorAll()) {
            $gameParty.setTargetActor($gameParty.members()[this.index()]);
        }
        this.callOkHandler();
    }

    selectLast(): void {
        this.forceSelect($gameParty.targetActor().index() || 0);
    }

    selectForItem(item: RMMZ.ActionItem): void {
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
    declare _itemWindow: Window_ItemList;

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);
    }

    maxCols(): number {
        return 4;
    }

    update(): void {
        super.update();
        if (this._itemWindow) {
            this._itemWindow.setCategory(this.currentSymbol());
        }
    }

    makeCommandList(): void {
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

    needsCommand(name: string): boolean {
        const table = ["item", "weapon", "armor", "keyItem"];
        const index = table.indexOf(name);
        if (index >= 0) {
            return $dataSystem.itemCategories[index];
        }
        return true;
    }

    setItemWindow(itemWindow: Window_ItemList): void {
        this._itemWindow = itemWindow;
    }

    needsSelection(): boolean {
        return this.maxItems() >= 2;
    }
}

/**
 * The window for selecting an item on the item screen.
 */
class Window_ItemList extends Window_Selectable {
    declare _category: string | null;
    declare _data: (RMMZ.InventoryItem | null)[];

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);

        this._category = "none";
        this._data = [];
    }

    setCategory(category: string | null): void {
        if (this._category !== category) {
            this._category = category;
            this.refresh();
            this.scrollTo(0, 0);
        }
    }

    maxCols(): number {
        return 2;
    }

    colSpacing(): number {
        return 16;
    }

    maxItems(): number {
        return this._data ? this._data.length : 1;
    }

    item(): RMMZ.InventoryItem | null {
        return this.itemAt(this.index());
    }

    itemAt(index: number): RMMZ.InventoryItem | null {
        return this._data && index >= 0 ? this._data[index] : null;
    }

    isCurrentItemEnabled(): boolean {
        return this.isEnabled(this.item());
    }

    includes(item: RMMZ.InventoryItem | null): boolean {
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

    needsNumber(): boolean {
        if (this._category === "keyItem") {
            return $dataSystem.optKeyItemsNumber;
        } else {
            return true;
        }
    }

    isEnabled(item: RMMZ.InventoryItem | null): boolean {
        return $gameParty.canUse(item);
    }

    makeItemList(): void {
        this._data = $gameParty.allItems().filter((item) => this.includes(item));
        if (this.includes(null)) {
            this._data.push(null);
        }
    }

    selectLast(): void {
        const index = this._data.indexOf($gameParty.lastItem());
        this.forceSelect(index >= 0 ? index : 0);
    }

    drawItem(index: number): void {
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

    numberWidth(): number {
        return this.textWidth("000");
    }

    drawItemNumber(item: RMMZ.InventoryItem, x: number, y: number, width: number): void {
        if (this.needsNumber()) {
            this.drawText(":", x, y, width - this.textWidth("00"), "right");
            this.drawText($gameParty.numItems(item), x, y, width, "right");
        }
    }

    updateHelp(): void {
        this.setHelpWindowItem(this.item());
    }

    refresh(): void {
        this.makeItemList();
        super.refresh();
    }
}

/**
 * The window for selecting a skill type on the skill screen.
 */
class Window_SkillType extends Window_Command {
    declare _actor: Game_Actor | null;
    declare _skillWindow: Window_SkillList;

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);

        this._actor = null;
    }

    setActor(actor: Game_Actor): void {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
            this.selectLast();
        }
    }

    makeCommandList(): void {
        if (this._actor) {
            const skillTypes = this._actor.skillTypes();
            for (const stypeId of skillTypes) {
                const name = $dataSystem.skillTypes[stypeId];
                this.addCommand(name, "skill", true, stypeId);
            }
        }
    }

    update(): void {
        super.update();
        if (this._skillWindow) {
            this._skillWindow.setStypeId(this.currentExt()!);
        }
    }

    setSkillWindow(skillWindow: Window_SkillList): void {
        this._skillWindow = skillWindow;
    }

    selectLast(): void {
        const skill = this._actor!.lastMenuSkill();
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
    declare _actor: Game_Actor | null;

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);

        this._actor = null;
    }

    setActor(actor: Game_Actor): void {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    }

    refresh(): void {
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
    declare _actor: Game_Actor | null;
    declare _stypeId: RMMZ.SkillType;
    declare _data: RMMZ.DataSkill[];

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);

        this._actor = null;
        this._stypeId = 0;
        this._data = [];
    }

    setActor(actor: Game_Actor): void {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
            this.scrollTo(0, 0);
        }
    }

    setStypeId(stypeId: RMMZ.SkillType): void {
        if (this._stypeId !== stypeId) {
            this._stypeId = stypeId;
            this.refresh();
            this.scrollTo(0, 0);
        }
    }

    maxCols(): number {
        return 2;
    }

    colSpacing(): number {
        return 16;
    }

    maxItems(): number {
        return this._data ? this._data.length : 1;
    }

    item(): RMMZ.DataSkill | null {
        return this.itemAt(this.index());
    }

    itemAt(index: number): RMMZ.DataSkill | null {
        return this._data && index >= 0 ? this._data[index] : null;
    }

    isCurrentItemEnabled(): boolean {
        return this.isEnabled(this._data[this.index()]);
    }

    includes(item: RMMZ.DataSkill): boolean {
        return item && item.stypeId === this._stypeId;
    }

    isEnabled(item: RMMZ.DataSkill): boolean {
        return (this._actor && this._actor.canUse(item))!;
    }

    makeItemList(): void {
        if (this._actor) {
            this._data = this._actor.skills().filter((item) => this.includes(item));
        } else {
            this._data = [];
        }
    }

    selectLast(): void {
        const index = this._data.indexOf(this._actor!.lastSkill());
        this.forceSelect(index >= 0 ? index : 0);
    }

    drawItem(index: number): void {
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

    costWidth(): number {
        return this.textWidth("000");
    }

    drawSkillCost(skill: RMMZ.DataSkill, x: number, y: number, width: number): void {
        if (this._actor!.skillTpCost(skill) > 0) {
            this.changeTextColor(ColorManager.tpCostColor());
            this.drawText(this._actor!.skillTpCost(skill), x, y, width, "right");
        } else if (this._actor!.skillMpCost(skill) > 0) {
            this.changeTextColor(ColorManager.mpCostColor());
            this.drawText(this._actor!.skillMpCost(skill), x, y, width, "right");
        }
    }

    updateHelp(): void {
        this.setHelpWindowItem(this.item());
    }

    refresh(): void {
        this.makeItemList();
        super.refresh();
    }
}

/**
 * The window for displaying parameter changes on the equipment screen.
 */
class Window_EquipStatus extends Window_StatusBase {
    declare _actor: Game_Actor | null;
    declare _tempActor: Game_Actor | null;

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);

        this._actor = null;
        this._tempActor = null;
        this.refresh();
    }

    setActor(actor: Game_Actor): void {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    }

    colSpacing(): number {
        return 0;
    }

    refresh(): void {
        this.contents.clear();
        if (this._actor) {
            const nameRect = this.itemLineRect(0);
            this.drawActorName(this._actor, nameRect.x, 0, nameRect.width);
            this.drawActorFace(this._actor, nameRect.x, nameRect.height);
            this.drawAllParams();
        }
    }

    setTempActor(tempActor: Game_Actor | null): void {
        if (this._tempActor !== tempActor) {
            this._tempActor = tempActor;
            this.refresh();
        }
    }

    drawAllParams(): void {
        for (let i = 0; i < 6; i++) {
            const x = this.itemPadding();
            const y = this.paramY(i);
            this.drawItem(x, y, 2 + i);
        }
    }

    drawItem(x: number, y: number, paramId: RMMZ.ParamID): void;
    drawItem(...args: any[]): void;
    drawItem(x: number, y: number, paramId: RMMZ.ParamID): void {
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

    drawParamName(x: number, y: number, paramId: RMMZ.ParamID): void {
        const width = this.paramX() - this.itemPadding() * 2;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.param(paramId), x, y, width);
    }

    drawCurrentParam(x: number, y: number, paramId: RMMZ.ParamID): void {
        const paramWidth = this.paramWidth();
        this.resetTextColor();
        this.drawText(this._actor!.param(paramId), x, y, paramWidth, "right");
    }

    drawRightArrow(x: number, y: number): void {
        const rightArrowWidth = this.rightArrowWidth();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText("\u2192", x, y, rightArrowWidth, "center");
    }

    drawNewParam(x: number, y: number, paramId: RMMZ.ParamID): void {
        const paramWidth = this.paramWidth();
        const newValue = this._tempActor!.param(paramId);
        const diffvalue = newValue - this._actor!.param(paramId);
        this.changeTextColor(ColorManager.paramchangeTextColor(diffvalue));
        this.drawText(newValue, x, y, paramWidth, "right");
    }

    rightArrowWidth(): number {
        return 32;
    }

    paramWidth(): number {
        return 48;
    }

    paramX(): number {
        const itemPadding = this.itemPadding();
        const rightArrowWidth = this.rightArrowWidth();
        const paramWidth = this.paramWidth();
        return this.innerWidth - itemPadding - paramWidth * 2 - rightArrowWidth;
    }

    paramY(index: number): number {
        const faceHeight = ImageManager.standardFaceHeight;
        return faceHeight + Math.floor(this.lineHeight() * (index + 1.5));
    }
}

/**
 * The window for selecting a command on the equipment screen.
 */
class Window_EquipCommand extends Window_HorzCommand {
    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);
    }

    maxCols(): number {
        return 3;
    }

    makeCommandList(): void {
        this.addCommand(TextManager.equip2, "equip");
        this.addCommand(TextManager.optimize, "optimize");
        this.addCommand(TextManager.clear, "clear");
    }
}

/**
 * The window for selecting an equipment slot on the equipment screen.
 */
class Window_EquipSlot extends Window_StatusBase {
    declare _actor: Game_Actor | null;
    declare _statusWindow: Window_EquipStatus;
    declare _itemWindow: Window_EquipItem;

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);

        this._actor = null;
        this.refresh();
    }

    setActor(actor: Game_Actor): void {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    }

    update(): void {
        super.update();
        if (this._itemWindow) {
            this._itemWindow.setSlotId(this.index());
        }
    }

    maxItems(): number {
        return this._actor ? this._actor.equipSlots().length : 0;
    }

    item(): RMMZ.DataEquipment | null {
        return this.itemAt(this.index());
    }

    itemAt(index: number): RMMZ.DataEquipment | null {
        return this._actor ? this._actor.equips()[index] : null;
    }

    drawItem(index: number): void {
        if (this._actor) {
            const slotName = this.actorSlotName(this._actor, index);
            const item = this.itemAt(index);
            const slotNameWidth = this.slotNameWidth();
            const rect = this.itemLineRect(index);
            const itemWidth = rect.width - slotNameWidth;
            this.changeTextColor(ColorManager.systemColor());
            this.changePaintOpacity(this.isEnabled(index));
            this.drawText(slotName, rect.x, rect.y, slotNameWidth);
            this.drawItemName(item as RMMZ.DatabaseItem | null, rect.x + slotNameWidth, rect.y, itemWidth);
            this.changePaintOpacity(true);
        }
    }

    slotNameWidth(): number {
        return 138;
    }

    isEnabled(index: number): boolean {
        return this._actor ? this._actor.isEquipChangeOk(index) : false;
    }

    isCurrentItemEnabled(): boolean {
        return this.isEnabled(this.index());
    }

    setStatusWindow(statusWindow: Window_EquipStatus): void {
        this._statusWindow = statusWindow;
        this.callUpdateHelp();
    }

    setItemWindow(itemWindow: Window_EquipItem): void {
        this._itemWindow = itemWindow;
    }

    updateHelp(): void {
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
    declare _actor: Game_Actor | null;
    declare _slotId: RMMZ.EquipmentSlotID;
    declare _statusWindow: Window_EquipStatus;

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);

        this._actor = null;
        this._slotId = 0;
    }

    maxCols(): number {
        return 1;
    }

    colSpacing(): number {
        return 8;
    }

    setActor(actor: Game_Actor): void {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
            this.scrollTo(0, 0);
        }
    }

    setSlotId(slotId: RMMZ.EquipmentSlotID): void {
        if (this._slotId !== slotId) {
            this._slotId = slotId;
            this.refresh();
            this.scrollTo(0, 0);
        }
    }

    includes(item: RMMZ.DatabaseItem | null): boolean {
        if (item === null) {
            return true;
        }
        return (this._actor && this._actor.canEquip(item) && item.etypeId === this.etypeId())!;
    }

    etypeId(): number {
        if (this._actor && this._slotId >= 0) {
            return this._actor.equipSlots()[this._slotId];
        } else {
            return 0;
        }
    }

    isEnabled(/*item*/): boolean {
        return true;
    }

    selectLast(): void {
        //
    }

    setStatusWindow(statusWindow: Window_EquipStatus): void {
        this._statusWindow = statusWindow;
        this.callUpdateHelp();
    }

    updateHelp(): void {
        super.updateHelp();
        if (this._actor && this._statusWindow && this._slotId >= 0) {
            const actor = JsonEx.makeDeepCopy(this._actor);
            actor.forceChangeEquip(this._slotId, this.item() as RMMZ.DataEquipment | null);
            this._statusWindow.setTempActor(actor);
        }
    }

    playOkSound(): void {
        //
    }
}

/**
 * The window for displaying full status on the status screen.
 */
class Window_Status extends Window_StatusBase {
    declare _actor: Game_Actor | null;

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);

        this._actor = null;
        this.refresh();
        this.activate();
    }

    setActor(actor: Game_Actor): void {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    }

    refresh(): void {
        super.refresh();
        if (this._actor) {
            this.drawBlock1();
            this.drawBlock2();
        }
    }

    drawBlock1(): void {
        const y = this.block1Y();
        this.drawActorName(this._actor!, 6, y, 168);
        this.drawActorClass(this._actor!, 192, y, 168);
        this.drawActorNickname(this._actor!, 432, y, 270);
    }

    block1Y(): number {
        return 0;
    }

    drawBlock2(): void {
        const y = this.block2Y();
        this.drawActorFace(this._actor!, 12, y);
        this.drawBasicInfo(204, y);
        this.drawExpInfo(456, y);
    }

    block2Y(): number {
        const lineHeight = this.lineHeight();
        const min = lineHeight;
        const max = this.innerHeight - lineHeight * 4;
        return Math.floor((lineHeight * 1.4).clamp(min, max));
    }

    drawBasicInfo(x: number, y: number): void {
        const lineHeight = this.lineHeight();
        this.drawActorLevel(this._actor!, x, y);
        this.drawActorIcons(this._actor!, x, y + lineHeight * 1);
        this.placeBasicGauges(this._actor!, x, y + lineHeight * 2);
    }

    drawExpInfo(x: number, y: number): void {
        const lineHeight = this.lineHeight();
        const expTotal = TextManager.expTotal.format(TextManager.exp);
        const expNext = TextManager.expNext.format(TextManager.level);
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(expTotal, x, y, 270);
        this.drawText(expNext, x, y + lineHeight * 2, 270);
        this.resetTextColor();
        this.drawText(this.expTotalValue(), x, y + lineHeight * 1, 270, "right");
        this.drawText(this.expNextValue(), x, y + lineHeight * 3, 270, "right");
    }

    expTotalValue(): number | "-------" {
        if (this._actor!.isMaxLevel()) {
            return "-------";
        } else {
            return this._actor!.currentExp();
        }
    }

    expNextValue(): number | "-------" {
        if (this._actor!.isMaxLevel()) {
            return "-------";
        } else {
            return this._actor!.nextRequiredExp();
        }
    }
}

/**
 * The window for displaying parameters on the status screen.
 */
class Window_StatusParams extends Window_StatusBase {
    declare _actor: Game_Actor | null;

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);

        this._actor = null;
    }

    setActor(actor: Game_Actor): void {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    }

    maxItems(): number {
        return 6;
    }

    itemHeight(): number {
        return this.lineHeight();
    }

    drawItem(index: number): void {
        const rect = this.itemLineRect(index);
        const paramId = index + 2;
        const name = TextManager.param(paramId);
        const value = this._actor!.param(paramId as RMMZ.ParamID);
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(name, rect.x, rect.y, 160);
        this.resetTextColor();
        this.drawText(value, rect.x + 160, rect.y, 60, "right");
    }

    drawItemBackground(_index: number): void {
        //
    }
}

/**
 * The window for displaying equipment items on the status screen.
 */
class Window_StatusEquip extends Window_StatusBase {
    declare _actor: Game_Actor | null;

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);

        this._actor = null;
    }

    setActor(actor: Game_Actor): void {
        if (this._actor !== actor) {
            this._actor = actor;
            this.refresh();
        }
    }

    maxItems(): number {
        return this._actor ? this._actor.equipSlots().length : 0;
    }

    itemHeight(): number {
        return this.lineHeight();
    }

    drawItem(index: number): void {
        const rect = this.itemLineRect(index);
        const equips = this._actor!.equips();
        const item = equips[index];
        const slotName = this.actorSlotName(this._actor!, index);
        const sw = 138;
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(slotName, rect.x, rect.y, sw);
        this.drawItemName(item as RMMZ.DatabaseItem | null, rect.x + sw, rect.y, rect.width - sw);
    }

    drawItemBackground(/*index*/): void {
        //
    }
}

/**
 * The window for changing various settings on the options screen.
 */
class Window_Options extends Window_Command {
    declare commandSymbol: (index: number) => keyof RMMZ.DataConfig;
    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);
    }

    makeCommandList(): void {
        this.addGeneralOptions();
        this.addVolumeOptions();
    }

    addGeneralOptions(): void {
        this.addCommand(TextManager.alwaysDash, "alwaysDash");
        this.addCommand(TextManager.commandRemember, "commandRemember");
        this.addCommand(TextManager.touchUI, "touchUI");
    }

    addVolumeOptions(): void {
        this.addCommand(TextManager.bgmVolume, "bgmVolume");
        this.addCommand(TextManager.bgsVolume, "bgsVolume");
        this.addCommand(TextManager.meVolume, "meVolume");
        this.addCommand(TextManager.seVolume, "seVolume");
    }

    drawItem(index: number): void {
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

    statusWidth(): number {
        return 120;
    }

    statusText(index: number): string {
        const symbol = this.commandSymbol(index);
        const value = this.getConfigValue(symbol);
        if (this.isVolumeSymbol(symbol)) {
            return this.volumeStatusText(value as number);
        } else {
            return this.booleanStatusText(value as boolean);
        }
    }

    isVolumeSymbol(symbol: string): symbol is "bgmVolume" | "bgsVolume" | "meVolume" | "seVolume" {
        return symbol.includes("Volume");
    }

    booleanStatusText(value: boolean): "ON" | "OFF" {
        return value ? "ON" : "OFF";
    }

    volumeStatusText(value: number): string {
        return value + "%";
    }

    processOk(): void {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (this.isVolumeSymbol(symbol)) {
            this.changeVolume(symbol, true, true);
        } else {
            this.changeValue(symbol, !this.getConfigValue(symbol));
        }
    }

    cursorRight(): void {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (this.isVolumeSymbol(symbol)) {
            this.changeVolume(symbol, true, false);
        } else {
            this.changeValue(symbol, true);
        }
    }

    cursorLeft(): void {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (this.isVolumeSymbol(symbol)) {
            this.changeVolume(symbol, false, false);
        } else {
            this.changeValue(symbol, false);
        }
    }

    changeVolume<T extends "bgmVolume" | "bgsVolume" | "meVolume" | "seVolume">(
        symbol: T,
        forward: boolean,
        wrap: boolean,
    ): void {
        const lastValue = this.getConfigValue(symbol);
        const offset = this.volumeOffset();
        const value = lastValue + (forward ? offset : -offset);
        if (value > 100 && wrap) {
            this.changeValue(symbol, 0);
        } else {
            this.changeValue(symbol, value.clamp(0, 100));
        }
    }

    volumeOffset(): number {
        return 20;
    }

    changeValue(
        symbol: "alwaysDash" | "commandRemember" | "touchUI" | ("bgmVolume" | "bgsVolume" | "meVolume" | "seVolume"),
        value: boolean | number,
    ): void {
        const lastValue = this.getConfigValue(symbol);
        if (lastValue !== value) {
            this.setConfigValue(symbol, value);
            this.redrawItem(this.findSymbol(symbol));
            this.playCursorSound();
        }
    }

    getConfigValue<
        T extends "alwaysDash" | "commandRemember" | "touchUI" | ("bgmVolume" | "bgsVolume" | "meVolume" | "seVolume"),
    >(symbol: T): (typeof ConfigManager)[T] {
        return ConfigManager[symbol];
    }

    setConfigValue<
        T extends "alwaysDash" | "commandRemember" | "touchUI" | ("bgmVolume" | "bgsVolume" | "meVolume" | "seVolume"),
    >(symbol: T, volume: (typeof ConfigManager)[T]): void {
        ConfigManager[symbol] = volume;
    }
}

/**
 * The window for selecting a save file on the save and load screens.
 */
class Window_SavefileList extends Window_Selectable {
    declare _mode: ("save" | "load") | null;
    declare _autosave: boolean;

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);
        this.activate();

        this._mode = null;
        this._autosave = false;
    }

    setMode(mode: "save" | "load", autosave: boolean): void {
        this._mode = mode;
        this._autosave = autosave;
        this.refresh();
    }

    maxItems(): number {
        return DataManager.maxSavefiles() - (this._autosave ? 0 : 1);
    }

    numVisibleRows(): number {
        return 5;
    }

    itemHeight(): number {
        return Math.floor(this.innerHeight / this.numVisibleRows());
    }

    drawItem(index: number): void {
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

    indexToSavefileId(index: number): number {
        return index + (this._autosave ? 0 : 1);
    }

    savefileIdToIndex(savefileId: number): number {
        return savefileId - (this._autosave ? 0 : 1);
    }

    isEnabled(savefileId: number): boolean {
        if (this._mode === "save") {
            return savefileId > 0;
        } else {
            return !!DataManager.savefileInfo(savefileId);
        }
    }

    savefileId(): number {
        return this.indexToSavefileId(this.index());
    }

    selectSavefile(savefileId: number): void {
        const index = Math.max(0, this.savefileIdToIndex(savefileId));
        this.select(index);
        this.setTopRow(index - 2);
    }

    drawTitle(savefileId: number, x: number, y: number): void {
        if (savefileId === 0) {
            this.drawText(TextManager.autosave, x, y, 180);
        } else {
            this.drawText(TextManager.file + " " + savefileId, x, y, 180);
        }
    }

    drawContents(info: RMMZ.DataSaveInfo, rect: Rectangle): void {
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

    drawPartyCharacters(info: RMMZ.DataSaveInfo, x: number, y: number): void {
        if (info.characters) {
            let characterX = x;
            for (const data of info.characters) {
                this.drawCharacter(data[0], data[1], characterX, y);
                characterX += 48;
            }
        }
    }

    drawPlaytime(info: RMMZ.DataSaveInfo, x: number, y: number, width: number): void {
        if (info.playtime) {
            this.drawText(info.playtime, x, y, width, "right");
        }
    }

    playOkSound(): void {
        //
    }
}

/**
 * The window for selecting buy/sell on the shop screen.
 */
class Window_ShopCommand extends Window_HorzCommand {
    declare _purchaseOnly: boolean;

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);
    }

    setPurchaseOnly(purchaseOnly: boolean): void {
        this._purchaseOnly = purchaseOnly;
        this.refresh();
    }

    maxCols(): number {
        return 3;
    }

    makeCommandList(): void {
        this.addCommand(TextManager.buy, "buy");
        this.addCommand(TextManager.sell, "sell", !this._purchaseOnly);
        this.addCommand(TextManager.cancel, "cancel");
    }
}

/**
 * The window for selecting an item to buy on the shop screen.
 */
class Window_ShopBuy extends Window_Selectable {
    declare _money: number;
    declare _shopGoods: RMMZ.ShopGoodsEntry[];
    declare _data: RMMZ.InventoryItem[];
    declare _price: number[];
    declare _statusWindow: Window_ShopStatus;

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);

        this._money = 0;
    }

    setupGoods(shopGoods: RMMZ.ShopGoodsEntry[]): void {
        this._shopGoods = shopGoods;
        this.refresh();
        this.select(0);
    }

    maxItems(): number {
        return this._data ? this._data.length : 1;
    }

    item(): RMMZ.InventoryItem | null {
        return this.itemAt(this.index());
    }

    itemAt(index: number): RMMZ.InventoryItem | null {
        return this._data && index >= 0 ? this._data[index] : null;
    }

    setMoney(money: number): void {
        this._money = money;
        this.refresh();
    }

    isCurrentItemEnabled(): boolean {
        return this.isEnabled(this._data[this.index()]);
    }

    price(item: RMMZ.InventoryItem): number {
        return this._price[this._data.indexOf(item)] || 0;
    }

    isEnabled(item: RMMZ.InventoryItem | null): boolean {
        return (item && this.price(item) <= this._money && !$gameParty.hasMaxItems(item))!;
    }

    refresh(): void {
        this.makeItemList();
        super.refresh();
    }

    makeItemList(): void {
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

    goodsToItem(goods: RMMZ.ShopGoodsEntry): RMMZ.DataItem | RMMZ.DataWeapon | RMMZ.DataArmor | null {
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

    drawItem(index: number): void {
        const item = this.itemAt(index);
        const price = this.price(item!);
        const rect = this.itemLineRect(index);
        const priceWidth = this.priceWidth();
        const priceX = rect.x + rect.width - priceWidth;
        const nameWidth = rect.width - priceWidth;
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x, rect.y, nameWidth);
        this.drawText(price, priceX, rect.y, priceWidth, "right");
        this.changePaintOpacity(true);
    }

    priceWidth(): number {
        return 96;
    }

    setStatusWindow(statusWindow: Window_ShopStatus): void {
        this._statusWindow = statusWindow;
        this.callUpdateHelp();
    }

    updateHelp(): void {
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
    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);
    }

    isEnabled(item: RMMZ.InventoryItem | null): boolean {
        return (item && item.price > 0)!;
    }
}

/**
 * The window for inputting quantity of items to buy or sell on the shop
 * screen.
 */
class Window_ShopNumber extends Window_Selectable {
    declare _item: RMMZ.InventoryItem | null;
    declare _max: number;
    declare _price: number;
    declare _number: number;
    declare _currencyUnit: string;
    declare _buttons: Sprite_Button[];

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);

        this._item = null;
        this._max = 1;
        this._price = 0;
        this._number = 1;
        this._currencyUnit = TextManager.currencyUnit;
        this.createButtons();
        this.select(0);

        this._canRepeat = false;
    }

    isScrollEnabled(): boolean {
        return false;
    }

    number(): number {
        return this._number;
    }

    setup(item: RMMZ.InventoryItem | null, max: number, price: number): void {
        this._item = item;
        this._max = Math.floor(max);
        this._price = price;
        this._number = 1;
        this.placeButtons();
        this.refresh();
    }

    setCurrencyUnit(currencyUnit: string): void {
        this._currencyUnit = currencyUnit;
        this.refresh();
    }

    createButtons(): void {
        this._buttons = [];
        if (ConfigManager.touchUI) {
            for (const type of ["down2", "down", "up", "up2", "ok"]) {
                const button = new Sprite_Button(
                    type as "menu" | "cancel" | "ok" | "pageup" | "pagedown" | "up" | "down" | "down2" | "up2",
                );
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

    placeButtons(): void {
        const sp = this.buttonSpacing();
        const totalWidth = this.totalButtonWidth();
        let x = (this.innerWidth - totalWidth) / 2;
        for (const button of this._buttons) {
            button.x = x;
            button.y = this.buttonY();
            x += button.width + sp;
        }
    }

    totalButtonWidth(): number {
        const sp = this.buttonSpacing();
        return this._buttons.reduce((r, button) => r + button.width + sp, -sp);
    }

    buttonSpacing(): number {
        return 8;
    }

    refresh(): void {
        super.refresh();
        this.drawItemBackground(0);
        this.drawCurrentItemName();
        this.drawMultiplicationSign();
        this.drawNumber();
        this.drawHorzLine();
        this.drawTotalPrice();
    }

    drawCurrentItemName(): void {
        const padding = this.itemPadding();
        const x = padding * 2;
        const y = this.itemNameY();
        const width = this.multiplicationSignX() - padding * 3;
        this.drawItemName(this._item, x, y, width);
    }

    drawMultiplicationSign(): void {
        const sign = this.multiplicationSign();
        const width = this.textWidth(sign);
        const x = this.multiplicationSignX();
        const y = this.itemNameY();
        this.resetTextColor();
        this.drawText(sign, x, y, width);
    }

    multiplicationSign(): string {
        return "\u00d7";
    }

    multiplicationSignX(): number {
        const sign = this.multiplicationSign();
        const width = this.textWidth(sign);
        return this.cursorX() - width * 2;
    }

    drawNumber(): void {
        const x = this.cursorX();
        const y = this.itemNameY();
        const width = this.cursorWidth() - this.itemPadding();
        this.resetTextColor();
        this.drawText(this._number, x, y, width, "right");
    }

    drawHorzLine(): void {
        const padding = this.itemPadding();
        const lineHeight = this.lineHeight();
        const itemY = this.itemNameY();
        const totalY = this.totalPriceY();
        const x = padding;
        const y = Math.floor((itemY + totalY + lineHeight) / 2);
        const width = this.innerWidth - padding * 2;
        this.drawRect(x, y, width, 5);
    }

    drawTotalPrice(): void {
        const padding = this.itemPadding();
        const total = this._price * this._number;
        const width = this.innerWidth - padding * 2;
        const y = this.totalPriceY();
        this.drawCurrencyValue(total, this._currencyUnit, 0, y, width);
    }

    itemNameY(): number {
        return Math.floor(this.innerHeight / 2 - this.lineHeight() * 1.5);
    }

    totalPriceY(): number {
        return Math.floor(this.itemNameY() + this.lineHeight() * 2);
    }

    buttonY(): number {
        return Math.floor(this.totalPriceY() + this.lineHeight() * 2);
    }

    cursorWidth(): number {
        const padding = this.itemPadding();
        const digitWidth = this.textWidth("0");
        return this.maxDigits() * digitWidth + padding * 2;
    }

    cursorX(): number {
        const padding = this.itemPadding();
        return this.innerWidth - this.cursorWidth() - padding * 2;
    }

    maxDigits(): number {
        return 2;
    }

    update(): void {
        super.update();
        this.processNumberChange();
    }

    playOkSound(): void {
        //
    }

    processNumberChange(): void {
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

    changeNumber(amount: number): void {
        const lastNumber = this._number;
        this._number = (this._number + amount).clamp(1, this._max);
        if (this._number !== lastNumber) {
            this.playCursorSound();
            this.refresh();
        }
    }

    itemRect(): Rectangle {
        const rect = new PIXI.Rectangle();
        rect.x = this.cursorX();
        rect.y = this.itemNameY();
        rect.width = this.cursorWidth();
        rect.height = this.lineHeight();
        return rect;
    }

    isTouchOkEnabled(): boolean {
        return false;
    }

    onButtonUp(): void {
        this.changeNumber(1);
    }

    onButtonUp2(): void {
        this.changeNumber(10);
    }

    onButtonDown(): void {
        this.changeNumber(-1);
    }

    onButtonDown2(): void {
        this.changeNumber(-10);
    }

    onButtonOk(): void {
        this.processOk();
    }
}

/**
 * The window for displaying number of items in possession and the actor's
 * equipment on the shop screen.
 */
class Window_ShopStatus extends Window_StatusBase {
    declare _item: RMMZ.InventoryItem | null;
    declare _pageIndex: number;

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);

        this._item = null;
        this._pageIndex = 0;
        this.refresh();
    }

    refresh(): void {
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

    setItem(item: RMMZ.InventoryItem | null): void {
        this._item = item;
        this.refresh();
    }

    isEquipItem(): boolean {
        return DataManager.isWeapon(this._item) || DataManager.isArmor(this._item);
    }

    drawPossession(x: number, y: number): void {
        const width = this.innerWidth - this.itemPadding() - x;
        const possessionWidth = this.textWidth("0000");
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.possession, x, y, width - possessionWidth);
        this.resetTextColor();
        this.drawText($gameParty.numItems(this._item), x, y, width, "right");
    }

    drawEquipInfo(x: number, y: number): void {
        const members = this.statusMembers();
        for (let i = 0; i < members.length; i++) {
            const actorY = y + Math.floor(this.lineHeight() * i * 2.2);
            this.drawActorEquipInfo(x, actorY, members[i]);
        }
    }

    statusMembers(): Game_Actor[] {
        const start = this._pageIndex * this.pageSize();
        const end = start + this.pageSize();
        return $gameParty.members().slice(start, end);
    }

    pageSize(): number {
        return 4;
    }

    maxPages(): number {
        return Math.floor(($gameParty.size() + this.pageSize() - 1) / this.pageSize());
    }

    drawActorEquipInfo(x: number, y: number, actor: Game_Actor): void {
        const item1 = this.currentEquippedItem(actor, (this._item as RMMZ.DataEquipment).etypeId);
        const width = this.innerWidth - x - this.itemPadding();
        const enabled = actor.canEquip(this._item!);
        this.changePaintOpacity(enabled);
        this.resetTextColor();
        this.drawText(actor.name(), x, y, width);
        if (enabled) {
            this.drawActorParamChange(x, y, actor, item1);
        }
        this.drawItemName(item1 as RMMZ.DatabaseItem | null, x, y + this.lineHeight(), width);
        this.changePaintOpacity(true);
    }

    // prettier-ignore

    drawActorParamChange(
        x: number, y: number, actor: Game_Actor, item1: RMMZ.DataEquipment | null
    ): void {
        const width = this.innerWidth - this.itemPadding() - x;
        const paramId = this.paramId();
        const change =
            (this._item as RMMZ.DataEquipment).params[paramId] - (item1 ? item1.params[paramId] : 0);
        this.changeTextColor(ColorManager.paramchangeTextColor(change));
        this.drawText((change > 0 ? "+" : "") + change, x, y, width, "right");
    }

    paramId(): RMMZ.ParamID {
        return DataManager.isWeapon(this._item) ? 2 : 3;
    }

    currentEquippedItem(actor: Game_Actor, etypeId: RMMZ.EquipmentType): RMMZ.DataEquipment | null {
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

    update(): void {
        super.update();
        this.updatePage();
    }

    updatePage(): void {
        if (this.isPageChangeEnabled() && this.isPageChangeRequested()) {
            this.changePage();
        }
    }

    isPageChangeEnabled(): boolean {
        return this.visible && this.maxPages() >= 2;
    }

    isPageChangeRequested(): boolean {
        if (Input.isTriggered("shift")) {
            return true;
        }
        if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
            return true;
        }
        return false;
    }

    changePage(): void {
        this._pageIndex = (this._pageIndex + 1) % this.maxPages();
        this.refresh();
        this.playCursorSound();
    }
}

/**
 * The window for editing an actor's name on the name input screen.
 */
class Window_NameEdit extends Window_StatusBase {
    declare _actor: Game_Actor | null;
    declare _maxLength: number;
    declare _name: string;
    declare _defaultName: string;

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);

        this._actor = null;
        this._maxLength = 0;
        this._name = "";
        this._index = 0;
        this._defaultName = "";
        this.deactivate();
    }

    setup(actor: Game_Actor, maxLength: number): void {
        this._actor = actor;
        this._maxLength = maxLength;
        this._name = actor.name().slice(0, this._maxLength);
        this._index = this._name.length;
        this._defaultName = this._name;
        ImageManager.loadFace(actor.faceName());
    }

    inputName(): string {
        return this._name;
    }

    restoreDefault(): boolean {
        this._name = this._defaultName;
        this._index = this._name.length;
        this.refresh();
        return this._name.length > 0;
    }

    add(ch: string): boolean {
        if (this._index < this._maxLength) {
            this._name += ch;
            this._index++;
            this.refresh();
            return true;
        } else {
            return false;
        }
    }

    back(): boolean {
        if (this._index > 0) {
            this._index--;
            this._name = this._name.slice(0, this._index);
            this.refresh();
            return true;
        } else {
            return false;
        }
    }

    faceWidth(): number {
        return 144;
    }

    charWidth(): number {
        const text = $gameSystem.isJapanese() ? "\uff21" : "A";
        return this.textWidth(text);
    }

    left(): number {
        const nameCenter = (this.innerWidth + this.faceWidth()) / 2;
        const nameWidth = (this._maxLength + 1) * this.charWidth();
        return Math.min(nameCenter - nameWidth / 2, this.innerWidth - nameWidth);
    }

    itemRect(index: number): Rectangle {
        const x = this.left() + index * this.charWidth();
        const y = 54;
        const width = this.charWidth();
        const height = this.lineHeight();
        return new PIXI.Rectangle(x, y, width, height);
    }

    underlineRect(index: number): Rectangle {
        const rect = this.itemRect(index);
        rect.x++;
        rect.y += rect.height - 4;
        rect.width -= 2;
        rect.height = 2;
        return rect;
    }

    underlineColor(): string {
        return ColorManager.normalColor();
    }

    drawUnderline(index: number): void {
        const rect = this.underlineRect(index);
        const color = this.underlineColor();
        this.contents.paintOpacity = 48;
        this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
        this.contents.paintOpacity = 255;
    }

    drawChar(index: number): void {
        const rect = this.itemRect(index);
        this.resetTextColor();
        this.drawText(this._name[index] || "", rect.x, rect.y);
    }

    refresh(): void {
        this.contents.clear();
        this.drawActorFace(this._actor!, 0, 0);
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
    declare _editWindow: Window_NameEdit | null;
    declare _page: number;

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    // prettier-ignore

    static LATIN1: string[] = [ "A","B","C","D","E",  "a","b","c","d","e",
              "F","G","H","I","J",  "f","g","h","i","j",
              "K","L","M","N","O",  "k","l","m","n","o",
              "P","Q","R","S","T",  "p","q","r","s","t",
              "U","V","W","X","Y",  "u","v","w","x","y",
              "Z","[","]","^","_",  "z","{","}","|","~",
              "0","1","2","3","4",  "!","#","$","%","&",
              "5","6","7","8","9",  "(",")","*","+","-",
              "/","=","@","<",">",  ":",";"," ","Page","OK" ];

    // prettier-ignore

    static LATIN2: string[] = [ "Á","É","Í","Ó","Ú",  "á","é","í","ó","ú",
              "À","È","Ì","Ò","Ù",  "à","è","ì","ò","ù",
              "Â","Ê","Î","Ô","Û",  "â","ê","î","ô","û",
              "Ä","Ë","Ï","Ö","Ü",  "ä","ë","ï","ö","ü",
              "Ā","Ē","Ī","Ō","Ū",  "ā","ē","ī","ō","ū",
              "Ã","Å","Æ","Ç","Ð",  "ã","å","æ","ç","ð",
              "Ñ","Õ","Ø","Š","Ŵ",  "ñ","õ","ø","š","ŵ",
              "Ý","Ŷ","Ÿ","Ž","Þ",  "ý","ÿ","ŷ","ž","þ",
              "Ĳ","Œ","ĳ","œ","ß",  "«","»"," ","Page","OK" ];

    // prettier-ignore

    static RUSSIA: string[] = [ "А","Б","В","Г","Д",  "а","б","в","г","д",
              "Е","Ё","Ж","З","И",  "е","ё","ж","з","и",
              "Й","К","Л","М","Н",  "й","к","л","м","н",
              "О","П","Р","С","Т",  "о","п","р","с","т",
              "У","Ф","Х","Ц","Ч",  "у","ф","х","ц","ч",
              "Ш","Щ","Ъ","Ы","Ь",  "ш","щ","ъ","ы","ь",
              "Э","Ю","Я","^","_",  "э","ю","я","%","&",
              "0","1","2","3","4",  "(",")","*","+","-",
              "5","6","7","8","9",  ":",";"," ","","OK" ];

    // prettier-ignore

    static JAPAN1: string[] = [ "あ","い","う","え","お",  "が","ぎ","ぐ","げ","ご",
              "か","き","く","け","こ",  "ざ","じ","ず","ぜ","ぞ",
              "さ","し","す","せ","そ",  "だ","ぢ","づ","で","ど",
              "た","ち","つ","て","と",  "ば","び","ぶ","べ","ぼ",
              "な","に","ぬ","ね","の",  "ぱ","ぴ","ぷ","ぺ","ぽ",
              "は","ひ","ふ","へ","ほ",  "ぁ","ぃ","ぅ","ぇ","ぉ",
              "ま","み","む","め","も",  "っ","ゃ","ゅ","ょ","ゎ",
              "や","ゆ","よ","わ","ん",  "ー","～","・","＝","☆",
              "ら","り","る","れ","ろ",  "ゔ","を","　","カナ","決定" ];

    // prettier-ignore

    static JAPAN2: string[] = [ "ア","イ","ウ","エ","オ",  "ガ","ギ","グ","ゲ","ゴ",
              "カ","キ","ク","ケ","コ",  "ザ","ジ","ズ","ゼ","ゾ",
              "サ","シ","ス","セ","ソ",  "ダ","ヂ","ヅ","デ","ド",
              "タ","チ","ツ","テ","ト",  "バ","ビ","ブ","ベ","ボ",
              "ナ","ニ","ヌ","ネ","ノ",  "パ","ピ","プ","ペ","ポ",
              "ハ","ヒ","フ","ヘ","ホ",  "ァ","ィ","ゥ","ェ","ォ",
              "マ","ミ","ム","メ","モ",  "ッ","ャ","ュ","ョ","ヮ",
              "ヤ","ユ","ヨ","ワ","ン",  "ー","～","・","＝","☆",
              "ラ","リ","ル","レ","ロ",  "ヴ","ヲ","　","英数","決定" ];

    // prettier-ignore

    static JAPAN3: string[] = [ "Ａ","Ｂ","Ｃ","Ｄ","Ｅ",  "ａ","ｂ","ｃ","ｄ","ｅ",
              "Ｆ","Ｇ","Ｈ","Ｉ","Ｊ",  "ｆ","ｇ","ｈ","ｉ","ｊ",
              "Ｋ","Ｌ","Ｍ","Ｎ","Ｏ",  "ｋ","ｌ","ｍ","ｎ","ｏ",
              "Ｐ","Ｑ","Ｒ","Ｓ","Ｔ",  "ｐ","ｑ","ｒ","ｓ","ｔ",
              "Ｕ","Ｖ","Ｗ","Ｘ","Ｙ",  "ｕ","ｖ","ｗ","ｘ","ｙ",
              "Ｚ","［","］","＾","＿",  "ｚ","｛","｝","｜","～",
              "０","１","２","３","４",  "！","＃","＄","％","＆",
              "５","６","７","８","９",  "（","）","＊","＋","－",
              "／","＝","＠","＜","＞",  "：","；","　","かな","決定" ];

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);

        this._editWindow = null;
        this._page = 0;
        this._index = 0;
    }

    setEditWindow(editWindow: Window_NameEdit): void {
        this._editWindow = editWindow;
        this.refresh();
        this.updateCursor();
        this.activate();
    }

    table(): string[][] {
        if ($gameSystem.isJapanese()) {
            return [Window_NameInput.JAPAN1, Window_NameInput.JAPAN2, Window_NameInput.JAPAN3];
        } else if ($gameSystem.isRussian()) {
            return [Window_NameInput.RUSSIA];
        } else {
            return [Window_NameInput.LATIN1, Window_NameInput.LATIN2];
        }
    }

    maxCols(): number {
        return 10;
    }

    maxItems(): number {
        return 90;
    }

    itemWidth(): number {
        return Math.floor((this.innerWidth - this.groupSpacing()) / 10);
    }

    groupSpacing(): number {
        return 24;
    }

    character(): string {
        return this._index < 88 ? this.table()[this._page][this._index] : "";
    }

    isPageChange(): boolean {
        return this._index === 88;
    }

    isOk(): boolean {
        return this._index === 89;
    }

    itemRect(index: number): Rectangle {
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

    drawItem(index: number): void {
        const table = this.table();
        const character = table[this._page][index];
        const rect = this.itemLineRect(index);
        this.drawText(character, rect.x, rect.y, rect.width, "center");
    }

    updateCursor(): void {
        const rect = this.itemRect(this._index);
        this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
    }

    isCursorMovable(): boolean {
        return this.active;
    }

    cursorDown(wrap: boolean): void {
        if (this._index < 80 || wrap) {
            this._index = (this._index + 10) % 90;
        }
    }

    cursorUp(wrap: boolean): void {
        if (this._index >= 10 || wrap) {
            this._index = (this._index + 80) % 90;
        }
    }

    cursorRight(wrap: boolean): void {
        if (this._index % 10 < 9) {
            this._index++;
        } else if (wrap) {
            this._index -= 9;
        }
    }

    cursorLeft(wrap: boolean): void {
        if (this._index % 10 > 0) {
            this._index--;
        } else if (wrap) {
            this._index += 9;
        }
    }

    cursorPagedown(): void {
        this._page = (this._page + 1) % this.table().length;
        this.refresh();
    }

    cursorPageup(): void {
        this._page = (this._page + this.table().length - 1) % this.table().length;
        this.refresh();
    }

    processCursorMove(): void {
        const lastPage = this._page;
        super.processCursorMove();
        this.updateCursor();
        if (this._page !== lastPage) {
            this.playCursorSound();
        }
    }

    processHandling(): void {
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

    isCancelEnabled(): boolean {
        return true;
    }

    processCancel(): void {
        this.processBack();
    }

    processJump(): void {
        if (this._index !== 89) {
            this._index = 89;
            this.playCursorSound();
        }
    }

    processBack(): void {
        if (this._editWindow!.back()) {
            SoundManager.playCancel();
        }
    }

    processOk(): void {
        if (this.character()) {
            this.onNameAdd();
        } else if (this.isPageChange()) {
            this.playOkSound();
            this.cursorPagedown();
        } else if (this.isOk()) {
            this.onNameOk();
        }
    }

    onNameAdd(): void {
        if (this._editWindow!.add(this.character())) {
            this.playOkSound();
        } else {
            this.playBuzzerSound();
        }
    }

    onNameOk(): void {
        if (this._editWindow!.inputName() === "") {
            if (this._editWindow!.restoreDefault()) {
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
    declare _name: string;
    declare _messageWindow: Window_Message;

    constructor(...args: []) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize(new PIXI.Rectangle());
        this.openness = 0;
        this._name = "";
    }

    setMessageWindow(messageWindow: Window_Message): void {
        this._messageWindow = messageWindow;
    }

    setName(name: string): void {
        if (this._name !== name) {
            this._name = name;
            this.refresh();
        }
    }

    clear(): void {
        this.setName("");
    }

    start(): void {
        this.updatePlacement();
        this.updateBackground();
        this.createContents();
        this.refresh();
    }

    updatePlacement(): void {
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

    updateBackground(): void {
        this.setBackgroundType($gameMessage.background());
    }

    windowWidth(): number {
        if (this._name) {
            const textWidth = this.textSizeEx(this._name).width;
            const padding = this.padding + this.itemPadding();
            const width = Math.ceil(textWidth) + padding * 2;
            return Math.min(width, Graphics.boxWidth);
        } else {
            return 0;
        }
    }

    windowHeight(): number {
        return this.fittingHeight(1);
    }

    refresh(): void {
        const rect = this.baseTextRect();
        this.contents.clear();
        this.drawTextEx(this._name, rect.x, rect.y, rect.width);
    }
}

/**
 * The window used for the event command [Show Choices].
 */
class Window_ChoiceList extends Window_Command {
    declare _background: RMMZ.TextWindowBackgroundType;
    declare _messageWindow: Window_Message;
    declare _cancelButton: Sprite_Button;

    constructor(...args: []) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize(new PIXI.Rectangle());
        this.createCancelButton();
        this.openness = 0;
        this.deactivate();

        this._background = 0;
        this._canRepeat = false;
    }

    setMessageWindow(messageWindow: Window_Message): void {
        this._messageWindow = messageWindow;
    }

    createCancelButton(): void {
        if (ConfigManager.touchUI) {
            this._cancelButton = new Sprite_Button("cancel");
            this._cancelButton.visible = false;
            this.addChild(this._cancelButton);
        }
    }

    start(): void {
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

    update(): void {
        super.update();
        this.updateCancelButton();
    }

    updateCancelButton(): void {
        if (this._cancelButton) {
            this._cancelButton.visible = this.needsCancelButton() && this.isOpen();
        }
    }

    selectDefault(): void {
        this.select($gameMessage.choiceDefaultType());
    }

    updatePlacement(): void {
        this.x = this.windowX();
        this.y = this.windowY();
        this.width = this.windowWidth();
        this.height = this.windowHeight();
    }

    updateBackground(): void {
        this._background = $gameMessage.choiceBackground();
        this.setBackgroundType(this._background);
    }

    placeCancelButton(): void {
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

    windowX(): number {
        const positionType = $gameMessage.choicePositionType();
        if (positionType === 1) {
            return (Graphics.boxWidth - this.windowWidth()) / 2;
        } else if (positionType === 2) {
            return Graphics.boxWidth - this.windowWidth();
        } else {
            return 0;
        }
    }

    windowY(): number {
        const messageY = this._messageWindow.y;
        if (messageY >= Graphics.boxHeight / 2) {
            return messageY - this.windowHeight();
        } else {
            return messageY + this._messageWindow.height;
        }
    }

    windowWidth(): number {
        const width = this.maxChoiceWidth() + this.colSpacing() + this.padding * 2;
        return Math.min(width, Graphics.boxWidth);
    }

    windowHeight(): number {
        return this.fittingHeight(this.numVisibleRows());
    }

    numVisibleRows(): number {
        const choices = $gameMessage.choices();
        return Math.min(choices.length, this.maxLines());
    }

    maxLines(): 4 | 8 {
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

    maxChoiceWidth(): number {
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

    makeCommandList(): void {
        const choices = $gameMessage.choices();
        for (const choice of choices) {
            this.addCommand(choice, "choice");
        }
    }

    drawItem(index: number): void {
        const rect = this.itemLineRect(index);
        this.drawTextEx(this.commandName(index), rect.x, rect.y, rect.width);
    }

    isCancelEnabled(): boolean {
        return $gameMessage.choiceCancelType() !== -1;
    }

    needsCancelButton(): boolean {
        return $gameMessage.choiceCancelType() === -2;
    }

    callOkHandler(): void {
        $gameMessage.onChoice(this.index());
        this._messageWindow.terminateMessage();
        this.close();
    }

    callCancelHandler(): void {
        $gameMessage.onChoice($gameMessage.choiceCancelType());
        this._messageWindow.terminateMessage();
        this.close();
    }
}

/**
 * The window used for the event command [Input Number].
 */
class Window_NumberInput extends Window_Selectable {
    declare _number: number;
    declare _maxDigits: number;
    declare _messageWindow: Window_Message;
    declare _buttons: Sprite_Button[];

    constructor(...args: []) {
        super(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        super.initialize(new PIXI.Rectangle());

        this._number = 0;
        this._maxDigits = 1;
        this.openness = 0;
        this.createButtons();
        this.deactivate();

        this._canRepeat = false;
    }

    setMessageWindow(messageWindow: Window_Message): void {
        this._messageWindow = messageWindow;
    }

    start(): void {
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

    updatePlacement(): void {
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

    windowWidth(): number {
        const totalItemWidth = this.maxCols() * this.itemWidth();
        const totalButtonWidth = this.totalButtonWidth();
        return Math.max(totalItemWidth, totalButtonWidth) + this.padding * 2;
    }

    windowHeight(): number {
        if (ConfigManager.touchUI) {
            return this.fittingHeight(1) + this.buttonSpacing() + 48;
        } else {
            return this.fittingHeight(1);
        }
    }

    maxCols(): number {
        return this._maxDigits;
    }

    maxItems(): number {
        return this._maxDigits;
    }

    itemWidth(): number {
        return 48;
    }

    itemRect(index: number): Rectangle {
        const rect = super.itemRect(index);
        const innerMargin = this.innerWidth - this.maxCols() * this.itemWidth();
        rect.x += innerMargin / 2;
        return rect;
    }

    isScrollEnabled(): boolean {
        return false;
    }

    isHoverEnabled(): boolean {
        return false;
    }

    createButtons(): void {
        this._buttons = [];
        if (ConfigManager.touchUI) {
            for (const type of ["down", "up", "ok"]) {
                const button = new Sprite_Button(
                    type as "menu" | "cancel" | "ok" | "pageup" | "pagedown" | "up" | "down" | "down2" | "up2",
                );
                this._buttons.push(button);
                this.addInnerChild(button);
            }
            this._buttons[0].setClickHandler(this.onButtonDown.bind(this));
            this._buttons[1].setClickHandler(this.onButtonUp.bind(this));
            this._buttons[2].setClickHandler(this.onButtonOk.bind(this));
        }
    }

    placeButtons(): void {
        const sp = this.buttonSpacing();
        const totalWidth = this.totalButtonWidth();
        let x = (this.innerWidth - totalWidth) / 2;
        for (const button of this._buttons) {
            button.x = x;
            button.y = this.buttonY();
            x += button.width + sp;
        }
    }

    totalButtonWidth(): number {
        const sp = this.buttonSpacing();
        return this._buttons.reduce((r, button) => r + button.width + sp, -sp);
    }

    buttonSpacing(): number {
        return 8;
    }

    buttonY(): number {
        return this.itemHeight() + this.buttonSpacing();
    }

    update(): void {
        super.update();
        this.processDigitChange();
    }

    processDigitChange(): void {
        if (this.isOpenAndActive()) {
            if (Input.isRepeated("up")) {
                this.changeDigit(true);
            } else if (Input.isRepeated("down")) {
                this.changeDigit(false);
            }
        }
    }

    changeDigit(up: boolean): void {
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

    isTouchOkEnabled(): boolean {
        return false;
    }

    isOkEnabled(): boolean {
        return true;
    }

    isCancelEnabled(): boolean {
        return false;
    }

    processOk(): void {
        this.playOkSound();
        $gameVariables.setValue($gameMessage.numInputVariableId(), this._number);
        this._messageWindow.terminateMessage();
        this.updateInputData();
        this.deactivate();
        this.close();
    }

    drawItem(index: number): void {
        const rect = this.itemLineRect(index);
        const align = "center";
        const s = this._number.padZero(this._maxDigits);
        const c = s.slice(index, index + 1);
        this.resetTextColor();
        this.drawText(c, rect.x, rect.y, rect.width, align);
    }

    onButtonUp(): void {
        this.changeDigit(true);
    }

    onButtonDown(): void {
        this.changeDigit(false);
    }

    onButtonOk(): void {
        this.processOk();
    }
}

/**
 * The window used for the event command [Select Item].
 */
class Window_EventItem extends Window_ItemList {
    declare _messageWindow: Window_Message;
    declare _cancelButton: Sprite_Button;

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);
        this.createCancelButton();
        this.openness = 0;
        this.deactivate();
        this.setHandler("ok", this.onOk.bind(this));
        this.setHandler("cancel", this.onCancel.bind(this));
        this._canRepeat = false;
    }

    setMessageWindow(messageWindow: Window_Message): void {
        this._messageWindow = messageWindow;
    }

    createCancelButton(): void {
        if (ConfigManager.touchUI) {
            this._cancelButton = new Sprite_Button("cancel");
            this._cancelButton.visible = false;
            this.addChild(this._cancelButton);
        }
    }

    start(): void {
        this.refresh();
        this.updatePlacement();
        this.placeCancelButton();
        this.forceSelect(0);
        this.open();
        this.activate();
    }

    update(): void {
        super.update();
        this.updateCancelButton();
    }

    updateCancelButton(): void {
        if (this._cancelButton) {
            this._cancelButton.visible = this.isOpen();
        }
    }

    updatePlacement(): void {
        if (this._messageWindow.y >= Graphics.boxHeight / 2) {
            this.y = 0;
        } else {
            this.y = Graphics.boxHeight - this.height;
        }
    }

    placeCancelButton(): void {
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

    includes(item: RMMZ.InventoryItem | null): boolean {
        const itypeId = $gameMessage.itemChoiceItypeId();
        return DataManager.isItem(item) && item.itypeId === itypeId;
    }

    needsNumber(): boolean {
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

    isEnabled(/*item*/): boolean {
        return true;
    }

    onOk(): void {
        const item = this.item();
        const itemId = item ? item.id : 0;
        $gameVariables.setValue($gameMessage.itemChoiceVariableId(), itemId);
        this._messageWindow.terminateMessage();
        this.close();
    }

    onCancel(): void {
        $gameVariables.setValue($gameMessage.itemChoiceVariableId(), 0);
        this._messageWindow.terminateMessage();
        this.close();
    }
}

/**
 * The window for displaying text messages.
 */
class Window_Message extends Window_Base {
    declare _background: RMMZ.TextWindowBackgroundType;
    declare _positionType: RMMZ.TextWindowPositionType;
    declare _waitCount: number;
    declare _faceBitmap: Bitmap | null;
    declare _textState: Window_Base.TextState | null;
    declare _goldWindow: Window_Gold | null;
    declare _nameBoxWindow: Window_NameBox | null;
    declare _choiceListWindow: Window_ChoiceList | null;
    declare _numberInputWindow: Window_NumberInput | null;
    declare _eventItemWindow: Window_EventItem | null;
    declare _showFast: boolean;
    declare _lineShowFast: boolean;
    declare _pauseSkip: boolean;

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);
        this.openness = 0;
        this.initMembers();
    }

    initMembers(): void {
        this._background = 0;
        this._positionType = 2;
        this._waitCount = 0;
        this._faceBitmap = null;
        this._textState = null;
        this._goldWindow = null;
        this._nameBoxWindow = null;
        this._choiceListWindow = null;
        this._numberInputWindow = null;
        this._eventItemWindow = null;
        this.clearFlags();
    }

    setGoldWindow(goldWindow: Window_Gold): void {
        this._goldWindow = goldWindow;
    }

    setNameBoxWindow(nameBoxWindow: Window_NameBox): void {
        this._nameBoxWindow = nameBoxWindow;
    }

    setChoiceListWindow(choiceListWindow: Window_ChoiceList): void {
        this._choiceListWindow = choiceListWindow;
    }

    setNumberInputWindow(numberInputWindow: Window_NumberInput): void {
        this._numberInputWindow = numberInputWindow;
    }

    setEventItemWindow(eventItemWindow: Window_EventItem): void {
        this._eventItemWindow = eventItemWindow;
    }

    clearFlags(): void {
        this._showFast = false;
        this._lineShowFast = false;
        this._pauseSkip = false;
    }

    update(): void {
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

    checkToNotClose(): void {
        if (this.isOpen() && this.isClosing() && this.doesContinue()) {
            this.open();
        }
    }

    synchronizeNameBox(): void {
        this._nameBoxWindow!.openness = this.openness;
    }

    canStart(): boolean {
        return $gameMessage.hasText() && !$gameMessage.scrollMode();
    }

    startMessage(): void {
        const text = $gameMessage.allText();
        const textState = this.createTextState(text, 0, 0, 0);
        textState.x = this.newLineX(textState);
        textState.startX = textState.x;
        this._textState = textState;
        this.newPage(this._textState);
        this.updatePlacement();
        this.updateBackground();
        this.open();
        this._nameBoxWindow!.start();
    }

    newLineX(textState: Window_Base.TextState): number {
        const faceExists = $gameMessage.faceName() !== "";
        const faceWidth = ImageManager.standardFaceWidth;
        const spacing = 20;
        const margin = faceExists ? faceWidth + spacing : 4;
        return textState.rtl ? this.innerWidth - margin : margin;
    }

    updatePlacement(): void {
        const goldWindow = this._goldWindow;
        this._positionType = $gameMessage.positionType();
        this.y = (this._positionType * (Graphics.boxHeight - this.height)) / 2;
        if (goldWindow) {
            goldWindow.y = this.y > 0 ? 0 : Graphics.boxHeight - goldWindow.height;
        }
    }

    updateBackground(): void {
        this._background = $gameMessage.background();
        this.setBackgroundType(this._background);
    }

    terminateMessage(): void {
        this.close();
        this._goldWindow!.close();
        $gameMessage.clear();
    }

    updateWait(): boolean {
        if (this._waitCount > 0) {
            this._waitCount--;
            return true;
        } else {
            return false;
        }
    }

    cancelWait(): void {
        if ($gameSystem.isMessageSkipEnabled()) {
            this._waitCount = 0;
        }
    }

    updateLoading(): boolean {
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

    updateInput(): boolean {
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

    isAnySubWindowActive(): boolean {
        return this._choiceListWindow!.active || this._numberInputWindow!.active || this._eventItemWindow!.active;
    }

    updateMessage(): boolean {
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

    shouldBreakHere(textState: Window_Base.TextState): boolean {
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

    canBreakHere(textState: Window_Base.TextState): boolean {
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

    onEndOfText(): void {
        if (!this.startInput()) {
            if (!this._pauseSkip) {
                this.startPause();
            } else {
                this.terminateMessage();
            }
        }
        this._textState = null;
    }

    startInput(): boolean {
        if ($gameMessage.isChoice()) {
            this._choiceListWindow!.start();
            return true;
        } else if ($gameMessage.isNumberInput()) {
            this._numberInputWindow!.start();
            return true;
        } else if ($gameMessage.isItemChoice()) {
            this._eventItemWindow!.start();
            return true;
        } else {
            return false;
        }
    }

    isTriggered(): boolean {
        return Input.isRepeated("ok") || Input.isRepeated("cancel") || TouchInput.isRepeated();
    }

    doesContinue(): boolean {
        return $gameMessage.hasText() && !$gameMessage.scrollMode() && !this.areSettingsChanged();
    }

    areSettingsChanged(): boolean {
        return this._background !== $gameMessage.background() || this._positionType !== $gameMessage.positionType();
    }

    updateShowFast(): void {
        if (this.isTriggered()) {
            this._showFast = true;
        }
    }

    newPage(textState: Window_Base.TextState): void {
        this.contents.clear();
        this.resetFontSettings();
        this.clearFlags();
        this.updateSpeakerName();
        this.loadMessageFace();
        textState.x = textState.startX;
        textState.y = 0;
        textState.height = this.calcTextHeight(textState);
    }

    updateSpeakerName(): void {
        this._nameBoxWindow!.setName($gameMessage.speakerName());
    }

    loadMessageFace(): void {
        this._faceBitmap = ImageManager.loadFace($gameMessage.faceName());
    }

    drawMessageFace(): void {
        const faceName = $gameMessage.faceName();
        const faceIndex = $gameMessage.faceIndex();
        const rtl = $gameMessage.isRTL();
        const width = ImageManager.standardFaceWidth;
        const height = this.innerHeight;
        const x = rtl ? this.innerWidth - width - 4 : 4;
        this.drawFace(faceName, faceIndex, x, 0, width, height);
    }

    processControlCharacter(textState: Window_Base.TextState, c: string): void {
        super.processControlCharacter(textState, c);
        if (c === "\f") {
            this.processNewPage(textState);
        }
    }

    processNewLine(textState: Window_Base.TextState): void {
        this._lineShowFast = false;
        super.processNewLine(textState);
        if (this.needsNewPage(textState)) {
            this.startPause();
        }
    }

    processNewPage(textState: Window_Base.TextState): void {
        if (textState.text[textState.index] === "\n") {
            textState.index++;
        }
        textState.y = this.contents.height;
        this.startPause();
    }

    isEndOfText(textState: Window_Base.TextState): boolean {
        return textState.index >= textState.text.length;
    }

    needsNewPage(textState: Window_Base.TextState): boolean {
        return !this.isEndOfText(textState) && textState.y + textState.height > this.contents.height;
    }

    processEscapeCharacter(
        code: ("$" | "." | "|" | "!" | ">" | "<" | "^") | ("C" | "I" | "PX" | "PY" | "FS" | "{" | "}"),
        textState: Window_Base.TextState,
    ): void {
        switch (code) {
            case "$":
                this._goldWindow!.open();
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

    startWait(count: number): void {
        this._waitCount = count;
    }

    startPause(): void {
        this.startWait(10);
        this.pause = true;
    }

    isWaiting(): boolean {
        return this.pause || this._waitCount > 0;
    }
}

/**
 * The window for displaying scrolling text. No frame is displayed, but it
 * is handled as a window for convenience.
 */
class Window_ScrollText extends Window_Base {
    declare _reservedRect: Rectangle;
    declare _text: string | null;
    declare _maxBitmapHeight: number;
    declare _allTextHeight: number;
    declare _blockHeight: number;
    declare _blockIndex: number;
    declare _scrollY: number;

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(new PIXI.Rectangle());
        this.opacity = 0;
        this.hide();

        this._reservedRect = rect;
        this._text = "";
        this._maxBitmapHeight = 2048;
        this._allTextHeight = 0;
        this._blockHeight = 0;
        this._blockIndex = 0;
        this._scrollY = 0;
    }

    update(): void {
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

    startMessage(): void {
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

    refresh(): void {
        const rect = this.baseTextRect();
        const y = rect.y - this._scrollY + (this._scrollY % this._blockHeight);
        this.contents.clear();
        this.drawTextEx(this._text!, rect.x, y, rect.width);
    }

    updatePlacement(): void {
        const rect = this._reservedRect;
        this.move(rect.x, rect.y, rect.width, rect.height);
    }

    contentsHeight(): number {
        if (this._allTextHeight > 0) {
            return Math.min(this._allTextHeight, this._maxBitmapHeight);
        } else {
            return 0;
        }
    }

    updateMessage(): void {
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

    scrollSpeed(): number {
        let speed = $gameMessage.scrollSpeed() / 2;
        if (this.isFastForward()) {
            speed *= this.fastForwardRate();
        }
        return speed;
    }

    isFastForward(): boolean {
        if ($gameMessage.scrollNoFast()) {
            return false;
        } else {
            return Input.isPressed("ok") || Input.isPressed("shift") || TouchInput.isPressed();
        }
    }

    fastForwardRate(): number {
        return 3;
    }

    terminateMessage(): void {
        this._text = null;
        $gameMessage.clear();
        this.hide();
    }
}

/**
 * The window for displaying the map name on the map screen.
 */
class Window_MapName extends Window_Base {
    declare _showCount: number;

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);
        this.opacity = 0;
        this.contentsOpacity = 0;
        this._showCount = 0;
        this.refresh();
    }

    update(): void {
        super.update();
        if (this._showCount > 0 && $gameMap.isNameDisplayEnabled()) {
            this.updateFadeIn();
            this._showCount--;
        } else {
            this.updateFadeOut();
        }
    }

    updateFadeIn(): void {
        this.contentsOpacity += 16;
    }

    updateFadeOut(): void {
        this.contentsOpacity -= 16;
    }

    open(): void {
        this.refresh();
        this._showCount = 150;
    }

    close(): void {
        this._showCount = 0;
    }

    refresh(): void {
        this.contents.clear();
        if ($gameMap.displayName()) {
            const width = this.innerWidth;
            this.drawBackground(0, 0, width, this.lineHeight());
            this.drawText($gameMap.displayName(), 0, 0, width, "center");
        }
    }

    drawBackground(x: number, y: number, width: number, height: number): void {
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
    declare _lines: string[];
    declare _methods: Window_BattleLog.Method[];
    declare _waitCount: number;
    declare _waitMode: RMMZ.WaitMode;
    declare _baseLineStack: number[];
    declare _spriteset: Spriteset_Battle | null;

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);
        this.opacity = 0;
        this._lines = [];
        this._methods = [];
        this._waitCount = 0;
        this._waitMode = "";
        this._baseLineStack = [];
        this._spriteset = null;
        this.refresh();
    }

    setSpriteset(spriteset: Spriteset_Battle): void {
        this._spriteset = spriteset;
    }

    maxLines(): number {
        return 10;
    }

    numLines(): number {
        return this._lines.length;
    }

    messageSpeed(): number {
        return 16;
    }

    isBusy():
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
        return this._waitCount > 0 || this._waitMode || this._methods.length > 0;
    }

    update(): void {
        if (!this.updateWait()) {
            this.callNextMethod();
        }
    }

    updateWait(): boolean {
        return this.updateWaitCount() || this.updateWaitMode();
    }

    updateWaitCount(): boolean {
        if (this._waitCount > 0) {
            this._waitCount -= this.isFastForward() ? 3 : 1;
            if (this._waitCount < 0) {
                this._waitCount = 0;
            }
            return true;
        }
        return false;
    }

    updateWaitMode(): boolean {
        let waiting = false;
        switch (this._waitMode) {
            case "effect":
                waiting = this._spriteset!.isEffecting();
                break;
            case "movement":
                waiting = this._spriteset!.isAnyoneMoving();
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

    callNextMethod(): void {
        if (this._methods.length > 0) {
            const method = this._methods.shift();
            if (method!.name && (this[method!.name] as (...args: unknown[]) => unknown)) {
                (this[method!.name] as (...args: unknown[]) => unknown).apply(this, method!.params);
            } else {
                throw new Error("Method not found: " + method!.name);
            }
        }
    }

    isFastForward(): boolean {
        return Input.isLongPressed("ok") || Input.isPressed("shift") || TouchInput.isLongPressed();
    }

    push<K extends Window_BattleLog.MethodName>(
        methodName: K,
        ...params: Window_BattleLog[K] extends (...args: infer P) => any ? P : never
    ): void;
    push(methodName: Window_BattleLog.MethodName): void {
        const methodArgs = Array.prototype.slice.call(arguments, 1);
        this._methods.push({ name: methodName, params: methodArgs });
    }

    clear(): void {
        this._lines = [];
        this._baseLineStack = [];
        this.refresh();
    }

    wait(): void {
        this._waitCount = this.messageSpeed();
    }

    waitForEffect(): void {
        this.setWaitMode("effect");
    }

    waitForMovement(): void {
        this.setWaitMode("movement");
    }

    addText(text: string): void {
        this._lines.push(text);
        this.refresh();
        this.wait();
    }

    pushBaseLine(): void {
        this._baseLineStack.push(this._lines.length);
    }

    popBaseLine(): void {
        const baseLine = this._baseLineStack.pop();
        while (this._lines.length > baseLine!) {
            this._lines.pop();
        }
    }

    waitForNewLine(): void {
        let baseLine = 0;
        if (this._baseLineStack.length > 0) {
            baseLine = this._baseLineStack[this._baseLineStack.length - 1];
        }
        if (this._lines.length > baseLine) {
            this.wait();
        }
    }

    popupDamage(target: RMMZ.ActionTarget): void {
        if (target.shouldPopupDamage()) {
            target.startDamagePopup();
        }
    }

    performActionStart(subject: RMMZ.ActionTarget, action: Game_Action): void {
        subject.performActionStart(action);
    }

    performAction(subject: RMMZ.ActionTarget, action: Game_Action): void {
        subject.performAction(action);
    }

    performActionEnd(subject: RMMZ.ActionTarget): void {
        subject.performActionEnd();
    }

    performDamage(target: RMMZ.ActionTarget): void {
        target.performDamage();
    }

    performMiss(target: RMMZ.ActionTarget): void {
        target.performMiss();
    }

    performRecovery(target: RMMZ.ActionTarget): void {
        target.performRecovery();
    }

    performEvasion(target: RMMZ.ActionTarget): void {
        target.performEvasion();
    }

    performMagicEvasion(target: RMMZ.ActionTarget): void {
        target.performMagicEvasion();
    }

    performCounter(target: RMMZ.ActionTarget): void {
        target.performCounter();
    }

    performReflection(target: RMMZ.ActionTarget): void {
        target.performReflection();
    }

    performSubstitute(substitute: RMMZ.ActionTarget, target: RMMZ.ActionTarget): void {
        substitute.performSubstitute(target);
    }

    performCollapse(target: RMMZ.ActionTarget): void {
        target.performCollapse();
    }

    // prettier-ignore

    showAnimation(
        subject: RMMZ.ActionTarget, targets: RMMZ.ActionTarget[], animationId: RMMZ.AnimationID
    ): void {
        if (animationId < 0) {
            this.showAttackAnimation(subject, targets);
        } else {
            this.showNormalAnimation(targets, animationId);
        }
    }

    showAttackAnimation(subject: RMMZ.ActionTarget, targets: RMMZ.ActionTarget[]): void {
        if (subject.isActor()) {
            this.showActorAttackAnimation(subject, targets);
        } else {
            this.showEnemyAttackAnimation(subject, targets);
        }
    }

    // prettier-ignore

    showActorAttackAnimation(
        subject: Game_Actor, targets: RMMZ.ActionTarget[]
    ): void {
        this.showNormalAnimation(targets, subject.attackAnimationId1(), false);
        this.showNormalAnimation(targets, subject.attackAnimationId2(), true);
    }

    // prettier-ignore
    showEnemyAttackAnimation(_subject: Game_Enemy, _targets: RMMZ.ActionTarget[]): void {
        SoundManager.playEnemyAttack();
    }

    // prettier-ignore

    showNormalAnimation(
        targets: RMMZ.ActionTarget[], animationId: RMMZ.AnimationID, mirror?: boolean
    ): void {
        const animation = $dataAnimations[animationId];
        if (animation) {
            $gameTemp.requestAnimation(targets, animationId, mirror);
        }
    }

    refresh(): void {
        this.drawBackground();
        this.contents.clear();
        for (let i = 0; i < this._lines.length; i++) {
            this.drawLineText(i);
        }
    }

    drawBackground(): void {
        const rect = this.backRect();
        const color = this.backColor();
        this.contentsBack.clear();
        this.contentsBack.paintOpacity = this.backPaintOpacity();
        this.contentsBack.fillRect(rect.x, rect.y, rect.width, rect.height, color);
        this.contentsBack.paintOpacity = 255;
    }

    backRect(): Rectangle {
        const height = this.numLines() * this.itemHeight();
        return new PIXI.Rectangle(0, 0, this.innerWidth, height);
    }

    lineRect(index: number): Rectangle {
        const itemHeight = this.itemHeight();
        const padding = this.itemPadding();
        const x = padding;
        const y = index * itemHeight;
        const width = this.innerWidth - padding * 2;
        const height = itemHeight;
        return new PIXI.Rectangle(x, y, width, height);
    }

    backColor(): string {
        return "#000000";
    }

    backPaintOpacity(): number {
        return 64;
    }

    drawLineText(index: number): void {
        const rect = this.lineRect(index);
        this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
        this.drawTextEx(this._lines[index], rect.x, rect.y, rect.width);
    }

    startTurn(): void {
        this.push("wait");
    }

    startAction(subject: RMMZ.ActionTarget, action: Game_Action, targets: RMMZ.ActionTarget[]): void {
        const item = action.item();
        this.push("performActionStart", subject, action);
        this.push("waitForMovement");
        this.push("performAction", subject, action);
        this.push("showAnimation", subject, targets.clone(), item.animationId);
        this.displayAction(subject, item);
    }

    endAction(subject: RMMZ.ActionTarget): void {
        this.push("waitForNewLine");
        this.push("clear");
        this.push("performActionEnd", subject);
    }

    displayCurrentState(subject: RMMZ.ActionTarget): void {
        const stateText = subject.mostImportantStateText();
        if (stateText) {
            this.push("addText", stateText.format(subject.name()));
            this.push("wait");
            this.push("clear");
        }
    }

    displayRegeneration(subject: RMMZ.ActionTarget): void {
        this.push("popupDamage", subject);
    }

    displayAction(subject: RMMZ.ActionTarget, item: RMMZ.DatabaseItem): void {
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

    displayItemMessage(fmt: string, subject: RMMZ.ActionTarget, item: RMMZ.DatabaseItem): void {
        if (fmt) {
            this.push("addText", fmt.format(subject.name(), item.name));
        }
    }

    displayCounter(target: RMMZ.ActionTarget): void {
        this.push("performCounter", target);
        this.push("addText", TextManager.counterAttack.format(target.name()));
    }

    displayReflection(target: RMMZ.ActionTarget): void {
        this.push("performReflection", target);
        this.push("addText", TextManager.magicReflection.format(target.name()));
    }

    displaySubstitute(substitute: RMMZ.ActionTarget, target: RMMZ.ActionTarget): void {
        const substName = substitute.name();
        const text = TextManager.substitute.format(substName, target.name());
        this.push("performSubstitute", substitute, target);
        this.push("addText", text);
    }

    displayActionResults(subject: RMMZ.ActionTarget, target: RMMZ.ActionTarget): void {
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

    displayFailure(target: RMMZ.ActionTarget): void {
        if (target.result().isHit() && !target.result().success) {
            this.push("addText", TextManager.actionFailure.format(target.name()));
        }
    }

    displayCritical(target: RMMZ.ActionTarget): void {
        if (target.result().critical) {
            if (target.isActor()) {
                this.push("addText", TextManager.criticalToActor);
            } else {
                this.push("addText", TextManager.criticalToEnemy);
            }
        }
    }

    displayDamage(target: RMMZ.ActionTarget): void {
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

    displayMiss(target: RMMZ.ActionTarget): void {
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

    displayEvasion(target: RMMZ.ActionTarget): void {
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

    displayHpDamage(target: RMMZ.ActionTarget): void {
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

    displayMpDamage(target: RMMZ.ActionTarget): void {
        if (target.isAlive() && target.result().mpDamage !== 0) {
            if (target.result().mpDamage < 0) {
                this.push("performRecovery", target);
            }
            this.push("addText", this.makeMpDamageText(target));
        }
    }

    displayTpDamage(target: RMMZ.ActionTarget): void {
        if (target.isAlive() && target.result().tpDamage !== 0) {
            if (target.result().tpDamage < 0) {
                this.push("performRecovery", target);
            }
            this.push("addText", this.makeTpDamageText(target));
        }
    }

    displayAffectedStatus(target: RMMZ.ActionTarget, ..._extra: unknown[]): void;
    displayAffectedStatus(target: RMMZ.ActionTarget): void {
        if (target.result().isStatusAffected()) {
            this.push("pushBaseLine");
            this.displayChangedStates(target);
            this.displayChangedBuffs(target);
            this.push("waitForNewLine");
            this.push("popBaseLine");
        }
    }

    displayAutoAffectedStatus(target: RMMZ.ActionTarget): void {
        if (target.result().isStatusAffected()) {
            this.displayAffectedStatus(target, null);
            this.push("clear");
        }
    }

    displayChangedStates(target: RMMZ.ActionTarget): void {
        this.displayAddedStates(target);
        this.displayRemovedStates(target);
    }

    displayAddedStates(target: RMMZ.ActionTarget): void {
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

    displayRemovedStates(target: RMMZ.ActionTarget): void {
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

    displayChangedBuffs(target: RMMZ.ActionTarget): void {
        const result = target.result();
        this.displayBuffs(target, result.addedBuffs, TextManager.buffAdd);
        this.displayBuffs(target, result.addedDebuffs, TextManager.debuffAdd);
        this.displayBuffs(target, result.removedBuffs, TextManager.buffRemove);
    }

    displayBuffs(target: RMMZ.ActionTarget, buffs: RMMZ.ParamID[], fmt: string): void {
        for (const paramId of buffs) {
            const text = fmt.format(target.name(), TextManager.param(paramId));
            this.push("popBaseLine");
            this.push("pushBaseLine");
            this.push("addText", text);
        }
    }

    makeHpDamageText(target: RMMZ.ActionTarget): string {
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

    makeMpDamageText(target: RMMZ.ActionTarget): string {
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

    makeTpDamageText(target: RMMZ.ActionTarget): string {
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

declare namespace Window_BattleLog {
    export type MethodName = RMMZ.MethodName<Omit<Window_BattleLog, "_methods" | "push">>;

    export interface Method {
        name: MethodName;
        params: unknown[];
    }
}

/**
 * The window for selecting whether to fight or escape on the battle screen.
 */
class Window_PartyCommand extends Window_Command {
    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);
        this.openness = 0;
        this.deactivate();
    }

    makeCommandList(): void {
        this.addCommand(TextManager.fight, "fight");
        this.addCommand(TextManager.escape, "escape", BattleManager.canEscape());
    }

    setup(): void {
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
    declare _actor: Game_Actor | null;

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);
        this.openness = 0;
        this.deactivate();

        this._actor = null;
    }

    makeCommandList(): void {
        if (this._actor) {
            this.addAttackCommand();
            this.addSkillCommands();
            this.addGuardCommand();
            this.addItemCommand();
        }
    }

    addAttackCommand(): void {
        this.addCommand(TextManager.attack, "attack", this._actor!.canAttack());
    }

    addSkillCommands(): void {
        const skillTypes = this._actor!.skillTypes();
        for (const stypeId of skillTypes) {
            const name = $dataSystem.skillTypes[stypeId];
            this.addCommand(name, "skill", true, stypeId);
        }
    }

    addGuardCommand(): void {
        this.addCommand(TextManager.guard, "guard", this._actor!.canGuard());
    }

    addItemCommand(): void {
        this.addCommand(TextManager.item, "item");
    }

    setup(actor: Game_Actor | null): void {
        this._actor = actor;
        this.refresh();
        this.selectLast();
        this.activate();
        this.open();
    }

    actor(): Game_Actor | null {
        return this._actor;
    }

    processOk(): void {
        if (this._actor) {
            if (ConfigManager.commandRemember) {
                this._actor.setLastCommandSymbol(this.currentSymbol()!);
            } else {
                this._actor.setLastCommandSymbol("");
            }
        }
        super.processOk();
    }

    selectLast(): void {
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
    declare _bitmapsReady: number;

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);
        this.frameVisible = false;
        this.openness = 0;
        this._bitmapsReady = 0;
        this.preparePartyRefresh();
    }

    extraHeight(): number {
        return 10;
    }

    maxCols(): number {
        return 4;
    }

    itemHeight(): number {
        return this.innerHeight;
    }

    maxItems(): number {
        return $gameParty.battleMembers().length;
    }

    rowSpacing(): number {
        return 0;
    }

    updatePadding(): void {
        this.padding = 8;
    }

    actor(index: number): Game_Actor {
        return $gameParty.battleMembers()[index];
    }

    selectActor(actor: Game_Actor | null): void {
        const members = $gameParty.battleMembers();
        this.select(members.indexOf(actor!));
    }

    update(): void {
        super.update();
        if ($gameTemp.isBattleRefreshRequested()) {
            this.preparePartyRefresh();
        }
    }

    preparePartyRefresh(): void {
        $gameTemp.clearBattleRefreshRequest();
        this._bitmapsReady = 0;
        for (const actor of $gameParty.members()) {
            const bitmap = ImageManager.loadFace(actor.faceName());
            bitmap.addLoadListener(this.performPartyRefresh.bind(this));
        }
    }

    performPartyRefresh(): void {
        this._bitmapsReady++;
        if (this._bitmapsReady >= $gameParty.members().length) {
            this.refresh();
        }
    }

    drawItem(index: number): void {
        this.drawItemImage(index);
        this.drawItemStatus(index);
    }

    drawItemImage(index: number): void {
        const actor = this.actor(index);
        const rect = this.faceRect(index);
        this.drawActorFace(actor, rect.x, rect.y, rect.width, rect.height);
    }

    drawItemStatus(index: number): void {
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

    faceRect(index: number): Rectangle {
        const rect = this.itemRect(index);
        rect.pad(-1);
        rect.height = this.nameY(rect) + this.gaugeLineHeight() / 2 - rect.y;
        return rect;
    }

    nameX(rect: Rectangle): number {
        return rect.x;
    }

    nameY(rect: Rectangle): number {
        return this.basicGaugesY(rect) - this.gaugeLineHeight();
    }

    stateIconX(rect: Rectangle): number {
        return rect.x + rect.width - ImageManager.standardIconWidth / 2 + 4;
    }

    stateIconY(rect: Rectangle): number {
        return rect.y + ImageManager.standardIconHeight / 2 + 4;
    }

    basicGaugesX(rect: Rectangle): number {
        return rect.x;
    }

    basicGaugesY(rect: Rectangle): number {
        const bottom = rect.y + rect.height - this.extraHeight();
        const numGauges = $dataSystem.optDisplayTp ? 3 : 2;
        return bottom - this.gaugeLineHeight() * numGauges;
    }
}

/**
 * The window for selecting a target actor on the battle screen.
 */
class Window_BattleActor extends Window_BattleStatus {
    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);
        this.openness = 255;
        this.hide();
    }

    show(): void {
        this.forceSelect(0);
        $gameTemp.clearTouchState();
        super.show();
    }

    hide(): void {
        super.hide();
        $gameParty.select(null);
    }

    select(index: number): void {
        super.select(index);
        $gameParty.select(this.actor(index));
    }

    processTouch(): void {
        super.processTouch();
        if (this.isOpenAndActive()) {
            const target = $gameTemp.touchTarget();
            if (target) {
                const members = $gameParty.battleMembers();
                if (members.includes(target as Game_Actor)) {
                    this.select(members.indexOf(target as Game_Actor));
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
    declare _enemies: Game_Enemy[];

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        this._enemies = [];
        super.initialize(rect);
        this.refresh();
        this.hide();
    }

    maxCols(): number {
        return 2;
    }

    maxItems(): number {
        return this._enemies.length;
    }

    enemy(): Game_Enemy {
        return this._enemies[this.index()];
    }

    enemyIndex(): number {
        const enemy = this.enemy();
        return enemy ? enemy.index() : -1;
    }

    drawItem(index: number): void {
        this.resetTextColor();
        const name = this._enemies[index].name();
        const rect = this.itemLineRect(index);
        this.drawText(name, rect.x, rect.y, rect.width);
    }

    show(): void {
        this.refresh();
        this.forceSelect(0);
        $gameTemp.clearTouchState();
        super.show();
    }

    hide(): void {
        super.hide();
        $gameTroop.select(null);
    }

    refresh(): void {
        this._enemies = $gameTroop.aliveMembers();
        super.refresh();
    }

    select(index: number): void {
        super.select(index);
        $gameTroop.select(this.enemy());
    }

    processTouch(): void {
        super.processTouch();
        if (this.isOpenAndActive()) {
            const target = $gameTemp.touchTarget();
            if (target) {
                if (this._enemies.includes(target as Game_Enemy)) {
                    this.select(this._enemies.indexOf(target as Game_Enemy));
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
    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);
        this.hide();
    }

    show(): void {
        this.selectLast();
        this.showHelpWindow();
        super.show();
    }

    hide(): void {
        this.hideHelpWindow();
        super.hide();
    }
}

/**
 * The window for selecting an item to use on the battle screen.
 */
class Window_BattleItem extends Window_ItemList {
    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);
        this.hide();
    }

    includes(item: RMMZ.InventoryItem | null): boolean {
        return $gameParty.canUse(item);
    }

    show(): void {
        this.selectLast();
        this.showHelpWindow();
        super.show();
    }

    hide(): void {
        this.hideHelpWindow();
        super.hide();
    }
}

/**
 * The window for selecting New Game/Continue on the title screen.
 */
class Window_TitleCommand extends Window_Command {
    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);
        this.openness = 0;
        this.selectLast();
    }

    static _lastCommandSymbol: string | null = null;

    static initCommandPosition(): void {
        this._lastCommandSymbol = null;
    }

    makeCommandList(): void {
        const continueEnabled = this.isContinueEnabled();
        this.addCommand(TextManager.newGame, "newGame");
        this.addCommand(TextManager.continue_, "continue", continueEnabled);
        this.addCommand(TextManager.options, "options");
    }

    isContinueEnabled(): boolean {
        return DataManager.isAnySavefileExists();
    }

    processOk(): void {
        Window_TitleCommand._lastCommandSymbol = this.currentSymbol();
        super.processOk();
    }

    selectLast(): void {
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
    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);
        this.openness = 0;
        this.open();
    }

    makeCommandList(): void {
        this.addCommand(TextManager.toTitle, "toTitle");
        this.addCommand(TextManager.cancel, "cancel");
    }
}

/**
 * The window for selecting a block of switches/variables on the debug screen.
 */
class Window_DebugRange extends Window_Selectable {
    declare _maxSwitches: number;
    declare _maxVariables: number;
    declare _editWindow: Window_DebugEdit;

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    static lastTopRow: number = 0;

    static lastIndex: number = 0;

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        this._maxSwitches = Math.ceil(($dataSystem.switches.length - 1) / 10);
        this._maxVariables = Math.ceil(($dataSystem.variables.length - 1) / 10);
        super.initialize(rect);
        this.refresh();
        this.setTopRow(Window_DebugRange.lastTopRow);
        this.select(Window_DebugRange.lastIndex);
        this.activate();
    }

    maxItems(): number {
        return this._maxSwitches + this._maxVariables;
    }

    update(): void {
        super.update();
        if (this._editWindow) {
            const index = this.index();
            this._editWindow.setMode(this.mode(index));
            this._editWindow.setTopId(this.topId(index));
        }
    }

    mode(index?: number): "switch" | "variable" {
        return this.isSwitchMode(index) ? "switch" : "variable";
    }

    topId(index: number): number {
        if (this.isSwitchMode(index)) {
            return index * 10 + 1;
        } else {
            return (index - this._maxSwitches) * 10 + 1;
        }
    }

    isSwitchMode(index?: number): boolean {
        return index! < this._maxSwitches;
    }

    drawItem(index: number): void {
        const rect = this.itemLineRect(index);
        const c = this.isSwitchMode(index) ? "S" : "V";
        const start = this.topId(index);
        const end = start + 9;
        const text = c + " [" + start.padZero(4) + "-" + end.padZero(4) + "]";
        this.drawText(text, rect.x, rect.y, rect.width);
    }

    isCancelTriggered(): boolean {
        return Window_Selectable.prototype.isCancelTriggered() || Input.isTriggered("debug");
    }

    processCancel(): void {
        super.processCancel();
        Window_DebugRange.lastTopRow = this.topRow();
        Window_DebugRange.lastIndex = this.index();
    }

    setEditWindow(editWindow: Window_DebugEdit): void {
        this._editWindow = editWindow;
    }
}

/**
 * The window for displaying switches and variables on the debug screen.
 */
class Window_DebugEdit extends Window_Selectable {
    declare _mode: "switch" | "variable";
    declare _topId: number;

    constructor(...args: [rect: Rectangle]) {
        super(...args);
    }

    initialize(rect: Rectangle): void;
    initialize(...args: any[]): void;
    initialize(rect: Rectangle): void {
        super.initialize(rect);

        this._mode = "switch";
        this._topId = 1;
        this.refresh();
    }

    maxItems(): number {
        return 10;
    }

    drawItem(index: number): void {
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

    itemName(dataId: RMMZ.SwitchID | RMMZ.VariableID): string {
        if (this._mode === "switch") {
            return $dataSystem.switches[dataId];
        } else {
            return $dataSystem.variables[dataId];
        }
    }

    itemStatus(dataId: RMMZ.SwitchID | RMMZ.VariableID): string {
        if (this._mode === "switch") {
            return $gameSwitches.value(dataId) ? "[ON]" : "[OFF]";
        } else {
            return String($gameVariables.value(dataId));
        }
    }

    setMode(mode: "switch" | "variable"): void {
        if (this._mode !== mode) {
            this._mode = mode;
            this.refresh();
        }
    }

    setTopId(id: RMMZ.SwitchID | RMMZ.VariableID): void {
        if (this._topId !== id) {
            this._topId = id;
            this.refresh();
        }
    }

    currentId(): number {
        return this._topId + this.index();
    }

    update(): void {
        super.update();
        if (this.active) {
            if (this._mode === "switch") {
                this.updateSwitch();
            } else {
                this.updateVariable();
            }
        }
    }

    updateSwitch(): void {
        if (Input.isRepeated("ok")) {
            const switchId = this.currentId();
            this.playCursorSound();
            $gameSwitches.setValue(switchId, !$gameSwitches.value(switchId));
            this.redrawCurrentItem();
        }
    }

    updateVariable(): void {
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

    deltaForVariable(): 0 | 1 | 10 | -1 | -10 {
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
