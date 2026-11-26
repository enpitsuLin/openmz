// Auto-generated from JSDoc in src/js/rmmz_windows.js via `pnpm build:types`. Do not edit manually.

/**
 * The superclass of all windows within the game.
 */
declare class Window_Base extends RMMZ.Window {
    /** @param {[rect: Rectangle]} args */
    constructor(rect: Rectangle);
    /** @param {Rectangle} rect */
    initialize(rect: Rectangle): void;
    /** @type {boolean} */
    _opening: boolean | undefined;
    /** @type {boolean} */
    _closing: boolean | undefined;
    /** @type {Sprite | null} */
    _dimmerSprite: Sprite | null | undefined;
    /**
     * @param {import("pixi.js").DestroyOptions} [options]
     * @returns {void}
     */
    destroy(options?: import("pixi.js").DestroyOptions): void;
    /**
     * @param {Rectangle} rect
     * @returns {void}
     */
    checkRectObject(rect: Rectangle): void;
    /** @returns {number} */
    lineHeight(): number;
    /** @returns {number} */
    itemWidth(): number;
    /** @returns {number} */
    itemHeight(): number;
    /** @returns {number} */
    itemPadding(): number;
    /** @returns {Rectangle} */
    baseTextRect(): Rectangle;
    /** @returns {void} */
    loadWindowskin(): void;
    /** @returns {void} */
    updatePadding(): void;
    /** @returns {void} */
    updateBackOpacity(): void;
    /**
     * @param {number} numLines
     * @returns {number}
     */
    fittingHeight(numLines: number): number;
    /** @returns {void} */
    updateTone(): void;
    /** @returns {void} */
    createContents(): void;
    /** @returns {void} */
    destroyContents(): void;
    /** @returns {number} */
    contentsWidth(): number;
    /** @returns {number} */
    contentsHeight(): number;
    /** @returns {void} */
    resetFontSettings(): void;
    /** @returns {void} */
    resetTextColor(): void;
    /** @returns {void} */
    updateOpen(): void;
    /** @returns {void} */
    updateClose(): void;
    /** @returns {void} */
    open(): void;
    /** @returns {void} */
    close(): void;
    /** @returns {boolean} */
    isOpening(): boolean;
    /** @returns {boolean} */
    isClosing(): boolean;
    /** @returns {void} */
    show(): void;
    /** @returns {void} */
    hide(): void;
    /** @returns {void} */
    activate(): void;
    /** @returns {void} */
    deactivate(): void;
    /** @returns {string} */
    systemColor(): string;
    /** @returns {number} */
    translucentOpacity(): number;
    /**
     * @param {string} color
     * @returns {void}
     */
    changeTextColor(color: string): void;
    /**
     * @param {string} color
     * @returns {void}
     */
    changeOutlineColor(color: string): void;
    /**
     * @param {boolean | number} enabled
     * @returns {void}
     */
    changePaintOpacity(enabled: boolean | number): void;
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @returns {void}
     */
    drawRect(x: number, y: number, width: number, height: number): void;
    /**
     * @param {string | number} text
     * @param {number} x
     * @param {number} y
     * @param {number} [maxWidth]
     * @param {CanvasTextAlign} [align]
     * @returns {void}
     */
    drawText(text: string | number, x: number, y: number, maxWidth?: number, align?: CanvasTextAlign): void;
    /**
     * @param {string} text
     * @returns {number}
     */
    textWidth(text: string): number;
    /**
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @returns {number}
     */
    drawTextEx(text: string, x: number, y: number, width: number): number;
    /**
     * @param {string} text
     * @returns {{ width: number; height: number; }}
     */
    textSizeEx(text: string): {
        width: number;
        height: number;
    };
    /**
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @returns {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }}
     */
    createTextState(text: string, x: number, y: number, width: number): {
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
    };
    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {void}
     */
    processAllText(textState: {
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
    }): void;
    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {void}
     */
    flushTextState(textState: {
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
    }): void;
    /**
     * @param {boolean} rtl
     * @returns {"" | "\u202B"}
     */
    createTextBuffer(rtl: boolean): "" | "\u202B";
    /**
     * @param {string} text
     * @returns {string}
     */
    convertEscapeCharacters(text: string): string;
    /**
     * @param {RMMZ.ActorID} n
     * @returns {string}
     */
    actorName(n: RMMZ.ActorID): string;
    /**
     * @param {number} n
     * @returns {string}
     */
    partyMemberName(n: number): string;
    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {void}
     */
    processCharacter(textState: {
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
    }): void;
    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @param {string} c
     * @returns {void}
     */
    processControlCharacter(textState: {
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
    }, c: string): void;
    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {void}
     */
    processNewLine(textState: {
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
    }): void;
    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {string}
     */
    obtainEscapeCode(textState: {
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
    }): string;
    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {number}
     */
    obtainEscapeParam(textState: {
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
    }): number;
    /**
     * @param {"C" | "I" | "PX" | "PY" | "FS" | "{" | "}"} code
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {void}
     */
    processEscapeCharacter(code: "C" | "I" | "PX" | "PY" | "FS" | "{" | "}", textState: {
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
    }): void;
    /**
     * @param {number} colorIndex
     * @returns {void}
     */
    processColorChange(colorIndex: number): void;
    /**
     * @param {number} iconIndex
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {void}
     */
    processDrawIcon(iconIndex: number, textState: {
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
    }): void;
    /** @returns {void} */
    makeFontBigger(): void;
    /** @returns {void} */
    makeFontSmaller(): void;
    /**
     * @param {Partial<{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }> & { text: string; }} textState
     * @returns {number}
     */
    calcTextHeight(textState: Partial<{
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
    }> & {
        text: string;
    }): number;
    /**
     * @param {string} line
     * @returns {number}
     */
    maxFontSizeInLine(line: string): number;
    /**
     * @param {number} iconIndex
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    drawIcon(iconIndex: number, x: number, y: number): void;
    /**
     * @param {string} faceName
     * @param {number} faceIndex
     * @param {number} x
     * @param {number} y
     * @param {number} [width]
     * @param {number} [height]
     * @returns {void}
     */
    drawFace(faceName: string, faceIndex: number, x: number, y: number, width?: number, height?: number): void;
    /**
     * @param {string} characterName
     * @param {number} characterIndex
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    drawCharacter(characterName: string, characterIndex: number, x: number, y: number): void;
    /**
     * @param {RMMZ.DataItemBase | null} item
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @returns {void}
     */
    drawItemName(item: RMMZ.DataItemBase | null, x: number, y: number, width: number): void;
    /**
     * @param {number} value
     * @param {string} unit
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @returns {void}
     */
    drawCurrencyValue(value: number, unit: string, x: number, y: number, width: number): void;
    /**
     * @param {RMMZ.TextWindowBackgroundType} type
     * @returns {void}
     */
    setBackgroundType(type: RMMZ.TextWindowBackgroundType): void;
    /** @returns {void} */
    showBackgroundDimmer(): void;
    /** @returns {void} */
    createDimmerSprite(): void;
    /** @returns {void} */
    hideBackgroundDimmer(): void;
    /** @returns {void} */
    updateBackgroundDimmer(): void;
    /** @returns {void} */
    refreshDimmerBitmap(): void;
    /** @returns {void} */
    playCursorSound(): void;
    /** @returns {void} */
    playOkSound(): void;
    /** @returns {void} */
    playBuzzerSound(): void;
}
/**
 * The window class with scroll functions.
 */
declare class Window_Scrollable extends Window_Base {
    /** @type {number} */
    _scrollX: number | undefined;
    /** @type {number} */
    _scrollY: number | undefined;
    /** @type {number} */
    _scrollBaseX: number | undefined;
    /** @type {number} */
    _scrollBaseY: number | undefined;
    /** @returns {void} */
    clearScrollStatus(): void;
    _scrollTargetX: number | undefined;
    _scrollTargetY: number | undefined;
    _scrollDuration: number | undefined;
    _scrollAccelX: number | undefined;
    _scrollAccelY: number | undefined;
    _scrollTouching: boolean | undefined;
    _scrollLastTouchX: number | undefined;
    _scrollLastTouchY: number | undefined;
    _scrollLastCursorVisible: boolean | undefined;
    /** @returns {number} */
    scrollX(): number;
    /** @returns {number} */
    scrollY(): number;
    /** @returns {number} */
    scrollBaseX(): number;
    /** @returns {number} */
    scrollBaseY(): number;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    scrollTo(x: number, y: number): void;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    scrollBy(x: number, y: number): void;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    smoothScrollTo(x: number, y: number): void;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    smoothScrollBy(x: number, y: number): void;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    setScrollAccel(x: number, y: number): void;
    /** @returns {number} */
    overallWidth(): number;
    /** @returns {number} */
    overallHeight(): number;
    /** @returns {number} */
    maxScrollX(): number;
    /** @returns {number} */
    maxScrollY(): number;
    /** @returns {number} */
    scrollBlockWidth(): number;
    /** @returns {number} */
    scrollBlockHeight(): number;
    /**
     * @param {number} n
     * @returns {void}
     */
    smoothScrollDown(n: number): void;
    /**
     * @param {number} n
     * @returns {void}
     */
    smoothScrollUp(n: number): void;
    /** @returns {void} */
    processWheelScroll(): void;
    /** @returns {void} */
    processTouchScroll(): void;
    /** @returns {boolean} */
    isWheelScrollEnabled(): boolean;
    /** @returns {boolean} */
    isTouchScrollEnabled(): boolean;
    /** @returns {boolean} */
    isScrollEnabled(): boolean;
    /** @returns {boolean} */
    isTouchedInsideFrame(): boolean;
    /** @returns {void} */
    onTouchScrollStart(): void;
    /** @returns {void} */
    onTouchScroll(): void;
    /** @returns {void} */
    onTouchScrollEnd(): void;
    /** @returns {void} */
    updateSmoothScroll(): void;
    /** @returns {void} */
    updateScrollAccel(): void;
    /** @returns {void} */
    updateArrows(): void;
    /** @returns {void} */
    updateOrigin(): void;
    /**
     * @param {number} baseX
     * @param {number} baseY
     * @returns {void}
     */
    updateScrollBase(baseX: number, baseY: number): void;
    /** @returns {void} */
    paint(): void;
}
/**
 * The window class with cursor movement functions.
 */
declare class Window_Selectable extends Window_Scrollable {
    /** @type {number} */
    _index: number | undefined;
    /** @type {boolean} */
    _cursorFixed: boolean | undefined;
    /** @type {boolean} */
    _cursorAll: boolean | undefined;
    /** @type {Window_Help | null} */
    _helpWindow: Window_Help | null | undefined;
    /** @type {Record<string, () => void>} */
    _handlers: Record<string, () => void> | undefined;
    /** @type {boolean} */
    _doubleTouch: boolean | undefined;
    /** @type {boolean} */
    _canRepeat: boolean | undefined;
    /** @returns {number} */
    index(): number;
    /** @returns {boolean} */
    cursorFixed(): boolean;
    /**
     * @param {boolean} cursorFixed
     * @returns {void}
     */
    setCursorFixed(cursorFixed: boolean): void;
    /** @returns {boolean} */
    cursorAll(): boolean;
    /**
     * @param {boolean} cursorAll
     * @returns {void}
     */
    setCursorAll(cursorAll: boolean): void;
    /** @returns {number} */
    maxCols(): number;
    /** @returns {number} */
    maxItems(): number;
    /** @returns {number} */
    colSpacing(): number;
    /** @returns {number} */
    rowSpacing(): number;
    /** @returns {number} */
    maxRows(): number;
    /**
     * @param {number} index
     * @returns {void}
     */
    select(index: number): void;
    /**
     * @param {number} index
     * @returns {void}
     */
    forceSelect(index: number): void;
    /**
     * @param {number} index
     * @returns {void}
     */
    smoothSelect(index: number): void;
    /** @returns {void} */
    deselect(): void;
    /** @returns {void} */
    reselect(): void;
    /** @returns {number} */
    row(): number;
    /** @returns {number} */
    topRow(): number;
    /** @returns {number} */
    maxTopRow(): number;
    /**
     * @param {number} row
     * @returns {void}
     */
    setTopRow(row: number): void;
    /** @returns {number} */
    maxPageRows(): number;
    /** @returns {number} */
    maxPageItems(): number;
    /** @returns {number} */
    maxVisibleItems(): number;
    /** @returns {boolean} */
    isHorizontal(): boolean;
    /** @returns {number} */
    topIndex(): number;
    /**
     * @param {number} index
     * @returns {Rectangle}
     */
    itemRect(index: number): Rectangle;
    /**
     * @param {number} index
     * @returns {Rectangle}
     */
    itemRectWithPadding(index: number): Rectangle;
    /**
     * @param {number} index
     * @returns {Rectangle}
     */
    itemLineRect(index: number): Rectangle;
    /**
     * @param {Window_Help} helpWindow
     * @returns {void}
     */
    setHelpWindow(helpWindow: Window_Help): void;
    /** @returns {void} */
    showHelpWindow(): void;
    /** @returns {void} */
    hideHelpWindow(): void;
    /**
     * @param {string} symbol
     * @param {() => void} method
     * @returns {void}
     */
    setHandler(symbol: string, method: () => void): void;
    /**
     * @param {string} symbol
     * @returns {boolean}
     */
    isHandled(symbol: string): boolean;
    /**
     * @param {string} symbol
     * @returns {void}
     */
    callHandler(symbol: string): void;
    /** @returns {boolean} */
    isOpenAndActive(): boolean;
    /** @returns {boolean} */
    isCursorMovable(): boolean;
    /**
     * @param {boolean} wrap
     * @returns {void}
     */
    cursorDown(wrap: boolean): void;
    /**
     * @param {boolean} wrap
     * @returns {void}
     */
    cursorUp(wrap: boolean): void;
    /**
     * @param {boolean} wrap
     * @returns {void}
     */
    cursorRight(wrap: boolean): void;
    /**
     * @param {boolean} wrap
     * @returns {void}
     */
    cursorLeft(wrap: boolean): void;
    /** @returns {void} */
    cursorPagedown(): void;
    /** @returns {void} */
    cursorPageup(): void;
    /** @returns {void} */
    processCursorMove(): void;
    /** @returns {void} */
    processHandling(): void;
    /** @returns {void} */
    processTouch(): void;
    /** @returns {boolean} */
    isHoverEnabled(): boolean;
    /**
     * @param {boolean} trigger
     * @returns {void}
     */
    onTouchSelect(trigger: boolean): void;
    /** @returns {void} */
    onTouchOk(): void;
    /** @returns {void} */
    onTouchCancel(): void;
    /** @returns {number} */
    hitIndex(): number;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    hitTest(x: number, y: number): number;
    /** @returns {boolean} */
    isTouchOkEnabled(): boolean;
    /** @returns {boolean} */
    isOkEnabled(): boolean;
    /** @returns {boolean} */
    isCancelEnabled(): boolean;
    /** @returns {boolean} */
    isOkTriggered(): boolean;
    /** @returns {boolean} */
    isCancelTriggered(): boolean;
    /** @returns {void} */
    processOk(): void;
    /** @returns {void} */
    callOkHandler(): void;
    /** @returns {void} */
    processCancel(): void;
    /** @returns {void} */
    callCancelHandler(): void;
    /** @returns {void} */
    processPageup(): void;
    /** @returns {void} */
    processPagedown(): void;
    /** @returns {void} */
    updateInputData(): void;
    /**
     * @param {boolean} smooth
     * @returns {void}
     */
    ensureCursorVisible(smooth: boolean): void;
    /** @returns {void} */
    callUpdateHelp(): void;
    /** @returns {void} */
    updateHelp(): void;
    /**
     * @param {RMMZ.DataItemBase | null} item
     * @returns {void}
     */
    setHelpWindowItem(item: RMMZ.DataItemBase | null): void;
    /** @returns {boolean} */
    isCurrentItemEnabled(): boolean;
    /** @returns {void} */
    drawAllItems(): void;
    /**
     * @param {number} index
     * @returns {void}
     */
    drawItem(index: number): void;
    /**
     * @param {number} index
     * @returns {void}
     */
    clearItem(index: number): void;
    /**
     * @param {number} index
     * @returns {void}
     */
    drawItemBackground(index: number): void;
    /**
     * @param {Rectangle} rect
     * @returns {void}
     */
    drawBackgroundRect(rect: Rectangle): void;
    /**
     * @param {number} index
     * @returns {void}
     */
    redrawItem(index: number): void;
    /** @returns {void} */
    redrawCurrentItem(): void;
    /** @returns {void} */
    refresh(): void;
    /** @returns {void} */
    refreshCursor(): void;
    /** @returns {void} */
    refreshCursorForAll(): void;
}
/**
 * The superclass of windows for selecting a command.
 */
declare class Window_Command extends Window_Selectable {
    /** @returns {void} */
    clearCommandList(): void;
    _list: any[] | undefined;
    /** @returns {void} */
    makeCommandList(): void;
    /**
     * @param {string} name
     * @param {string} symbol
     * @param {boolean} [enabled]
     * @param {number | null} [ext]
     * @returns {void}
     */
    addCommand(name: string, symbol: string, enabled?: boolean, ext?: number | null): void;
    /**
     * @param {number} index
     * @returns {string}
     */
    commandName(index: number): string;
    /**
     * @param {number} index
     * @returns {string}
     */
    commandSymbol(index: number): string;
    /**
     * @param {number} index
     * @returns {boolean}
     */
    isCommandEnabled(index: number): boolean;
    /** @returns {{ name: string; symbol: string; enabled: boolean; ext: number | null; } | null} */
    currentData(): {
        name: string;
        symbol: string;
        enabled: boolean;
        ext: number | null;
    } | null;
    /** @returns {string | null} */
    currentSymbol(): string | null;
    /** @returns {number | null} */
    currentExt(): number | null;
    /**
     * @param {string | null} symbol
     * @returns {number}
     */
    findSymbol(symbol: string | null): number;
    /**
     * @param {string | null} symbol
     * @returns {void}
     */
    selectSymbol(symbol: string | null): void;
    /**
     * @param {number} ext
     * @returns {number}
     */
    findExt(ext: number): number;
    /**
     * @param {number} ext
     * @returns {void}
     */
    selectExt(ext: number): void;
    /** @returns {CanvasTextAlign} */
    itemTextAlign(): CanvasTextAlign;
}
/**
 * The command window for the horizontal selection format.
 */
declare class Window_HorzCommand extends Window_Command {
    constructor(...args: any[]);
    initialize(rect: any): void;
    /** @returns {"center"} */
    itemTextAlign(): "center";
}
/**
 * The window for displaying the description of the selected item.
 */
declare class Window_Help extends Window_Base {
    /** @type {string} */
    _text: string | undefined;
    /**
     * @param {string} text
     * @returns {void}
     */
    setText(text: string): void;
    /** @returns {void} */
    clear(): void;
    /**
     * @param {RMMZ.DataItemBase | null} item
     * @returns {void}
     */
    setItem(item: RMMZ.DataItemBase | null): void;
    /** @returns {void} */
    refresh(): void;
}
/**
 * The window for displaying the party's gold.
 */
declare class Window_Gold extends Window_Selectable {
    /** @returns {number} */
    value(): number;
    /** @returns {string} */
    currencyUnit(): string;
}
/**
 * The superclass of windows for displaying actor status.
 */
declare class Window_StatusBase extends Window_Selectable {
    /** @type {Record<string, Sprite>} */
    _additionalSprites: Record<string, Sprite> | undefined;
    /** @returns {void} */
    loadFaceImages(): void;
    /** @returns {void} */
    hideAdditionalSprites(): void;
    /**
     * @param {Game_Actor} actor
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    placeActorName(actor: Game_Actor, x: number, y: number): void;
    /**
     * @param {Game_Actor} actor
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    placeStateIcon(actor: Game_Actor, x: number, y: number): void;
    /**
     * @param {Game_Actor} actor
     * @param {"time" | "hp" | "mp" | "tp"} type
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    placeGauge(actor: Game_Actor, type: "time" | "hp" | "mp" | "tp", x: number, y: number): void;
    /**
     * @template {Sprite} T
     * @param {string} key
     * @param {new () => T} spriteClass
     * @returns {T}
     */
    createInnerSprite<T extends Sprite>(key: string, spriteClass: new () => T): T;
    /**
     * @param {Game_Actor} actor
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    placeTimeGauge(actor: Game_Actor, x: number, y: number): void;
    /**
     * @param {Game_Actor} actor
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    placeBasicGauges(actor: Game_Actor, x: number, y: number): void;
    /** @returns {number} */
    gaugeLineHeight(): number;
    /**
     * @param {Game_Actor} actor
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    drawActorCharacter(actor: Game_Actor, x: number, y: number): void;
    /**
     * @param {Game_Actor} actor
     * @param {number} x
     * @param {number} y
     * @param {number} [width]
     * @param {number} [height]
     * @returns {void}
     */
    drawActorFace(actor: Game_Actor, x: number, y: number, width?: number, height?: number): void;
    /**
     * @param {Game_Actor} actor
     * @param {number} x
     * @param {number} y
     * @param {number} [width]
     * @returns {void}
     */
    drawActorName(actor: Game_Actor, x: number, y: number, width?: number): void;
    /**
     * @param {Game_Actor} actor
     * @param {number} x
     * @param {number} y
     * @param {number} [width]
     * @returns {void}
     */
    drawActorClass(actor: Game_Actor, x: number, y: number, width?: number): void;
    /**
     * @param {Game_Actor} actor
     * @param {number} x
     * @param {number} y
     * @param {number} [width]
     * @returns {void}
     */
    drawActorNickname(actor: Game_Actor, x: number, y: number, width?: number): void;
    /**
     * @param {Game_Actor} actor
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    drawActorLevel(actor: Game_Actor, x: number, y: number): void;
    /**
     * @param {Game_Actor} actor
     * @param {number} x
     * @param {number} y
     * @param {number} [width]
     * @returns {void}
     */
    drawActorIcons(actor: Game_Actor, x: number, y: number, width?: number): void;
    /**
     * @param {Game_Actor} actor
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    drawActorSimpleStatus(actor: Game_Actor, x: number, y: number): void;
    /**
     * @param {Game_Actor} actor
     * @param {number} index
     * @returns {string}
     */
    actorSlotName(actor: Game_Actor, index: number): string;
}
/**
 * The window for selecting a command on the menu screen.
 */
declare class Window_MenuCommand extends Window_Command {
    /** @type {string | null} */
    static _lastCommandSymbol: string | null;
    /** @returns {void} */
    static initCommandPosition(): void;
    /** @returns {void} */
    addMainCommands(): void;
    /** @returns {void} */
    addFormationCommand(): void;
    /** @returns {void} */
    addOriginalCommands(): void;
    /** @returns {void} */
    addOptionsCommand(): void;
    /** @returns {void} */
    addSaveCommand(): void;
    /** @returns {void} */
    addGameEndCommand(): void;
    /**
     * @param {string} name
     * @returns {boolean}
     */
    needsCommand(name: string): boolean;
    /** @returns {boolean} */
    areMainCommandsEnabled(): boolean;
    /** @returns {boolean} */
    isFormationEnabled(): boolean;
    /** @returns {boolean} */
    isOptionsEnabled(): boolean;
    /** @returns {boolean} */
    isSaveEnabled(): boolean;
    /** @returns {boolean} */
    isGameEndEnabled(): boolean;
    /** @returns {void} */
    selectLast(): void;
}
/**
 * The window for displaying party member status on the menu screen.
 */
declare class Window_MenuStatus extends Window_StatusBase {
    /** @type {boolean} */
    _formationMode: boolean | undefined;
    /** @type {number} */
    _pendingIndex: number | undefined;
    /** @returns {number} */
    numVisibleRows(): number;
    /**
     * @param {number} index
     * @returns {import("..").Game_Actor}
     */
    actor(index: number): any;
    /**
     * @param {number} index
     * @returns {void}
     */
    drawPendingItemBackground(index: number): void;
    /**
     * @param {number} index
     * @returns {void}
     */
    drawItemImage(index: number): void;
    /**
     * @param {number} index
     * @returns {void}
     */
    drawItemStatus(index: number): void;
    /** @returns {void} */
    selectLast(): void;
    /** @returns {boolean} */
    formationMode(): boolean;
    /**
     * @param {boolean} formationMode
     * @returns {void}
     */
    setFormationMode(formationMode: boolean): void;
    /** @returns {number} */
    pendingIndex(): number;
    /**
     * @param {number} index
     * @returns {void}
     */
    setPendingIndex(index: number): void;
}
/**
 * The window for selecting a target actor on the item and skill screens.
 */
declare class Window_MenuActor extends Window_MenuStatus {
    /**
     * @param {RMMZ.ActionItem} item
     * @returns {void}
     */
    selectForItem(item: RMMZ.ActionItem): void;
}
/**
 * The window for selecting a category of items on the item and shop screens.
 */
declare class Window_ItemCategory extends Window_HorzCommand {
    /**
     * @param {string} name
     * @returns {boolean}
     */
    needsCommand(name: string): boolean;
    /**
     * @param {Window_ItemList} itemWindow
     * @returns {void}
     */
    setItemWindow(itemWindow: Window_ItemList): void;
    _itemWindow: Window_ItemList | undefined;
    /** @returns {boolean} */
    needsSelection(): boolean;
}
/**
 * The window for selecting an item on the item screen.
 */
declare class Window_ItemList extends Window_Selectable {
    constructor(...args: any[]);
    initialize(rect: any): void;
    /** @type {string | null} */
    _category: string | null | undefined;
    /** @type {(RMMZ.DataItemBase | null)[]} */
    _data: (RMMZ.DataItemBase | null)[] | undefined;
    /**
     * @param {string | null} category
     * @returns {void}
     */
    setCategory(category: string | null): void;
    /** @returns {RMMZ.DataItemBase | null} */
    item(): RMMZ.DataItemBase | null;
    /**
     * @param {number} index
     * @returns {RMMZ.DataItemBase | null}
     */
    itemAt(index: number): RMMZ.DataItemBase | null;
    /**
     * @param {RMMZ.DataItemBase | null} item
     * @returns {boolean}
     */
    includes(item: RMMZ.DataItemBase | null): boolean;
    /** @returns {boolean} */
    needsNumber(): boolean;
    /**
     * @param {RMMZ.DataItemBase | null} item
     * @returns {boolean}
     */
    isEnabled(item: RMMZ.DataItemBase | null): boolean;
    /** @returns {void} */
    makeItemList(): void;
    /** @returns {void} */
    selectLast(): void;
    /** @returns {number} */
    numberWidth(): number;
    /**
     * @param {RMMZ.DataItemBase} item
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @returns {void}
     */
    drawItemNumber(item: RMMZ.DataItemBase, x: number, y: number, width: number): void;
}
/**
 * The window for selecting a skill type on the skill screen.
 */
declare class Window_SkillType extends Window_Command {
    constructor(...args: any[]);
    initialize(rect: any): void;
    /** @type {Game_Actor | null} */
    _actor: Game_Actor | null | undefined;
    /**
     * @param {Game_Actor} actor
     * @returns {void}
     */
    setActor(actor: Game_Actor): void;
    /**
     * @param {Window_SkillList} skillWindow
     * @returns {void}
     */
    setSkillWindow(skillWindow: Window_SkillList): void;
    _skillWindow: Window_SkillList | undefined;
    /** @returns {void} */
    selectLast(): void;
}
/**
 * The window for displaying the skill user's status on the skill screen.
 */
declare class Window_SkillStatus extends Window_StatusBase {
    constructor(...args: any[]);
    initialize(rect: any): void;
    /** @type {Game_Actor | null} */
    _actor: Game_Actor | null | undefined;
    /**
     * @param {Game_Actor} actor
     * @returns {void}
     */
    setActor(actor: Game_Actor): void;
}
/**
 * The window for selecting a skill on the skill screen.
 */
declare class Window_SkillList extends Window_Selectable {
    constructor(...args: any[]);
    initialize(rect: any): void;
    /** @type {Game_Actor | null} */
    _actor: Game_Actor | null | undefined;
    /** @type {RMMZ.SkillType} */
    _stypeId: number | undefined;
    /** @type {RMMZ.DataSkill[]} */
    _data: RMMZ.DataSkill[] | undefined;
    /**
     * @param {Game_Actor} actor
     * @returns {void}
     */
    setActor(actor: Game_Actor): void;
    /**
     * @param {RMMZ.SkillType} stypeId
     * @returns {void}
     */
    setStypeId(stypeId: RMMZ.SkillType): void;
    /** @returns {RMMZ.DataSkill | null} */
    item(): RMMZ.DataSkill | null;
    /**
     * @param {number} index
     * @returns {RMMZ.DataSkill | null}
     */
    itemAt(index: number): RMMZ.DataSkill | null;
    /**
     * @param {RMMZ.DataSkill} item
     * @returns {boolean}
     */
    includes(item: RMMZ.DataSkill): boolean;
    /**
     * @param {RMMZ.DataSkill} item
     * @returns {boolean}
     */
    isEnabled(item: RMMZ.DataSkill): boolean;
    /** @returns {void} */
    makeItemList(): void;
    /** @returns {void} */
    selectLast(): void;
    /** @returns {number} */
    costWidth(): number;
    /**
     * @param {RMMZ.DataSkill} skill
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @returns {void}
     */
    drawSkillCost(skill: RMMZ.DataSkill, x: number, y: number, width: number): void;
}
/**
 * The window for displaying parameter changes on the equipment screen.
 */
declare class Window_EquipStatus extends Window_StatusBase {
    /** @type {Game_Actor | null} */
    _actor: Game_Actor | null | undefined;
    /** @type {Game_Actor | null} */
    _tempActor: Game_Actor | null | undefined;
    /**
     * @param {Game_Actor} actor
     * @returns {void}
     */
    setActor(actor: Game_Actor): void;
    /**
     * @param {Game_Actor | null} tempActor
     * @returns {void}
     */
    setTempActor(tempActor: Game_Actor | null): void;
    /** @returns {void} */
    drawAllParams(): void;
    /**
     * @param {number} x
     * @param {number} y
     * @param {RMMZ.ParamID} paramId
     * @returns {void}
     */
    drawItem(x: number, y: number, paramId: RMMZ.ParamID): void;
    drawItem(...args: any[]): void;
    /**
     * @param {number} x
     * @param {number} y
     * @param {RMMZ.ParamID} paramId
     * @returns {void}
     */
    drawParamName(x: number, y: number, paramId: RMMZ.ParamID): void;
    /**
     * @param {number} x
     * @param {number} y
     * @param {RMMZ.ParamID} paramId
     * @returns {void}
     */
    drawCurrentParam(x: number, y: number, paramId: RMMZ.ParamID): void;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    drawRightArrow(x: number, y: number): void;
    /**
     * @param {number} x
     * @param {number} y
     * @param {RMMZ.ParamID} paramId
     * @returns {void}
     */
    drawNewParam(x: number, y: number, paramId: RMMZ.ParamID): void;
    /** @returns {number} */
    rightArrowWidth(): number;
    /** @returns {number} */
    paramWidth(): number;
    /** @returns {number} */
    paramX(): number;
    /**
     * @param {number} index
     * @returns {number}
     */
    paramY(index: number): number;
}
/**
 * The window for selecting a command on the equipment screen.
 */
declare class Window_EquipCommand extends Window_HorzCommand {
}
/**
 * The window for selecting an equipment slot on the equipment screen.
 */
declare class Window_EquipSlot extends Window_StatusBase {
    /** @type {Game_Actor | null} */
    _actor: Game_Actor | null | undefined;
    /**
     * @param {Game_Actor} actor
     * @returns {void}
     */
    setActor(actor: Game_Actor): void;
    /** @returns {import("..").DataEquipment | null} */
    item(): any | null;
    /**
     * @param {number} index
     * @returns {import("..").DataEquipment | null}
     */
    itemAt(index: number): any | null;
    /** @returns {number} */
    slotNameWidth(): number;
    /**
     * @param {number} index
     * @returns {boolean}
     */
    isEnabled(index: number): boolean;
    /**
     * @param {Window_EquipStatus} statusWindow
     * @returns {void}
     */
    setStatusWindow(statusWindow: Window_EquipStatus): void;
    _statusWindow: Window_EquipStatus | undefined;
    /**
     * @param {Window_EquipItem} itemWindow
     * @returns {void}
     */
    setItemWindow(itemWindow: Window_EquipItem): void;
    _itemWindow: Window_EquipItem | undefined;
}
/**
 * The window for selecting an equipment item on the equipment screen.
 */
declare class Window_EquipItem extends Window_ItemList {
    /** @type {Game_Actor | null} */
    _actor: Game_Actor | null | undefined;
    /** @type {RMMZ.EquipmentSlotID} */
    _slotId: number | undefined;
    /**
     * @param {Game_Actor} actor
     * @returns {void}
     */
    setActor(actor: Game_Actor): void;
    /**
     * @param {RMMZ.EquipmentSlotID} slotId
     * @returns {void}
     */
    setSlotId(slotId: RMMZ.EquipmentSlotID): void;
    /** @returns {number} */
    etypeId(): number;
    /** @returns {boolean} */
    isEnabled(): boolean;
    /**
     * @param {Window_EquipStatus} statusWindow
     * @returns {void}
     */
    setStatusWindow(statusWindow: Window_EquipStatus): void;
    _statusWindow: Window_EquipStatus | undefined;
}
/**
 * The window for displaying full status on the status screen.
 */
declare class Window_Status extends Window_StatusBase {
    /** @type {Game_Actor | null} */
    _actor: Game_Actor | null | undefined;
    /**
     * @param {Game_Actor} actor
     * @returns {void}
     */
    setActor(actor: Game_Actor): void;
    /** @returns {void} */
    drawBlock1(): void;
    /** @returns {number} */
    block1Y(): number;
    /** @returns {void} */
    drawBlock2(): void;
    /** @returns {number} */
    block2Y(): number;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    drawBasicInfo(x: number, y: number): void;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    drawExpInfo(x: number, y: number): void;
    /** @returns {number | "-------"} */
    expTotalValue(): number | "-------";
    /** @returns {number | "-------"} */
    expNextValue(): number | "-------";
}
/**
 * The window for displaying parameters on the status screen.
 */
declare class Window_StatusParams extends Window_StatusBase {
    constructor(...args: any[]);
    initialize(rect: any): void;
    /** @type {Game_Actor | null} */
    _actor: Game_Actor | null | undefined;
    /**
     * @param {Game_Actor} actor
     * @returns {void}
     */
    setActor(actor: Game_Actor): void;
}
/**
 * The window for displaying equipment items on the status screen.
 */
declare class Window_StatusEquip extends Window_StatusBase {
    constructor(...args: any[]);
    initialize(rect: any): void;
    /** @type {Game_Actor | null} */
    _actor: Game_Actor | null | undefined;
    /**
     * @param {Game_Actor} actor
     * @returns {void}
     */
    setActor(actor: Game_Actor): void;
    /** @returns {void} */
    drawItemBackground(): void;
}
/**
 * The window for changing various settings on the options screen.
 */
declare class Window_Options extends Window_Command {
    constructor(...args: any[]);
    initialize(rect: any): void;
    /** @returns {void} */
    addGeneralOptions(): void;
    /** @returns {void} */
    addVolumeOptions(): void;
    /** @returns {number} */
    statusWidth(): number;
    /**
     * @param {number} index
     * @returns {string}
     */
    statusText(index: number): string;
    /**
     * @param {"alwaysDash" | "commandRemember" | "touchUI" | ("bgmVolume" | "bgsVolume" | "meVolume" | "seVolume")} symbol
     * @returns {symbol is "bgmVolume" | "bgsVolume" | "meVolume" | "seVolume"}
     */
    isVolumeSymbol(symbol: "alwaysDash" | "commandRemember" | "touchUI" | ("bgmVolume" | "bgsVolume" | "meVolume" | "seVolume")): symbol is "bgmVolume" | "bgsVolume" | "meVolume" | "seVolume";
    /**
     * @param {boolean} value
     * @returns {"ON" | "OFF"}
     */
    booleanStatusText(value: boolean): "ON" | "OFF";
    /**
     * @param {number} value
     * @returns {string}
     */
    volumeStatusText(value: number): string;
    /** @returns {void} */
    cursorRight(): void;
    /** @returns {void} */
    cursorLeft(): void;
    /**
     * @template {"bgmVolume" | "bgsVolume" | "meVolume" | "seVolume"} T
     * @param {T} symbol
     * @param {boolean} forward
     * @param {boolean} wrap
     * @returns {void}
     */
    changeVolume<T extends "bgmVolume" | "bgsVolume" | "meVolume" | "seVolume">(symbol: T, forward: boolean, wrap: boolean): void;
    /** @returns {number} */
    volumeOffset(): number;
    /**
     * @param {"alwaysDash" | "commandRemember" | "touchUI" | ("bgmVolume" | "bgsVolume" | "meVolume" | "seVolume")} symbol
     * @param {boolean | number} value
     * @returns {void}
     */
    changeValue(symbol: "alwaysDash" | "commandRemember" | "touchUI" | ("bgmVolume" | "bgsVolume" | "meVolume" | "seVolume"), value: boolean | number): void;
    /**
     * @template {"alwaysDash" | "commandRemember" | "touchUI" | ("bgmVolume" | "bgsVolume" | "meVolume" | "seVolume")} T
     * @param {T} symbol
     * @returns {typeof ConfigManager[T]}
     */
    getConfigValue<T extends "alwaysDash" | "commandRemember" | "touchUI" | ("bgmVolume" | "bgsVolume" | "meVolume" | "seVolume")>(symbol: T): (typeof ConfigManager)[T];
    /**
     * @template {"alwaysDash" | "commandRemember" | "touchUI" | ("bgmVolume" | "bgsVolume" | "meVolume" | "seVolume")} T
     * @param {T} symbol
     * @param {typeof ConfigManager[T]} volume
     * @returns {void}
     */
    setConfigValue<T extends "alwaysDash" | "commandRemember" | "touchUI" | ("bgmVolume" | "bgsVolume" | "meVolume" | "seVolume")>(symbol: T, volume: (typeof ConfigManager)[T]): void;
}
/**
 * The window for selecting a save file on the save and load screens.
 */
declare class Window_SavefileList extends Window_Selectable {
    /** @type {("save" | "load") | null} */
    _mode: "load" | "save" | null | undefined;
    /** @type {boolean} */
    _autosave: boolean | undefined;
    /**
     * @param {"save" | "load"} mode
     * @param {boolean} autosave
     * @returns {void}
     */
    setMode(mode: "save" | "load", autosave: boolean): void;
    /** @returns {number} */
    numVisibleRows(): number;
    /**
     * @param {number} index
     * @returns {number}
     */
    indexToSavefileId(index: number): number;
    /**
     * @param {number} savefileId
     * @returns {number}
     */
    savefileIdToIndex(savefileId: number): number;
    /**
     * @param {number} savefileId
     * @returns {boolean}
     */
    isEnabled(savefileId: number): boolean;
    /** @returns {number} */
    savefileId(): number;
    /**
     * @param {number} savefileId
     * @returns {void}
     */
    selectSavefile(savefileId: number): void;
    /**
     * @param {number} savefileId
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    drawTitle(savefileId: number, x: number, y: number): void;
    /**
     * @param {RMMZ.DataSaveInfo} info
     * @param {Rectangle} rect
     * @returns {void}
     */
    drawContents(info: RMMZ.DataSaveInfo, rect: Rectangle): void;
    /**
     * @param {RMMZ.DataSaveInfo} info
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    drawPartyCharacters(info: RMMZ.DataSaveInfo, x: number, y: number): void;
    /**
     * @param {RMMZ.DataSaveInfo} info
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @returns {void}
     */
    drawPlaytime(info: RMMZ.DataSaveInfo, x: number, y: number, width: number): void;
}
/**
 * The window for selecting buy/sell on the shop screen.
 */
declare class Window_ShopCommand extends Window_HorzCommand {
    /**
     * @param {boolean} purchaseOnly
     * @returns {void}
     */
    setPurchaseOnly(purchaseOnly: boolean): void;
    _purchaseOnly: boolean | undefined;
}
/**
 * The window for selecting an item to buy on the shop screen.
 */
declare class Window_ShopBuy extends Window_Selectable {
    constructor(...args: any[]);
    initialize(rect: any): void;
    /** @type {number} */
    _money: number | undefined;
    /**
     * @param {RMMZ.ShopGoods[]} shopGoods
     * @returns {void}
     */
    setupGoods(shopGoods: RMMZ.ShopGoods[]): void;
    _shopGoods: ([0, number, 0, number] | [0, number, 1, number] | [1, number, 0, number] | [1, number, 1, number] | [2, number, 0, number] | [2, number, 1, number])[] | undefined;
    /** @returns {RMMZ.DataPricedItemBase | null} */
    item(): RMMZ.DataPricedItemBase | null;
    /**
     * @param {number} index
     * @returns {RMMZ.DataPricedItemBase | null}
     */
    itemAt(index: number): RMMZ.DataPricedItemBase | null;
    /**
     * @param {number} money
     * @returns {void}
     */
    setMoney(money: number): void;
    /**
     * @param {RMMZ.DataPricedItemBase} item
     * @returns {number}
     */
    price(item: RMMZ.DataPricedItemBase): number;
    /**
     * @param {RMMZ.DataPricedItemBase | null} item
     * @returns {boolean}
     */
    isEnabled(item: RMMZ.DataPricedItemBase | null): boolean;
    /** @returns {void} */
    makeItemList(): void;
    _data: any[] | undefined;
    _price: any[] | undefined;
    /**
     * @param {RMMZ.ShopGoods} goods
     * @returns {import("../data").DataItem | import("../data").DataWeapon | import("../data").DataArmor | null}
     */
    goodsToItem(goods: RMMZ.ShopGoods): any | any | any | null;
    /** @returns {number} */
    priceWidth(): number;
    /**
     * @param {Window_ShopStatus} statusWindow
     * @returns {void}
     */
    setStatusWindow(statusWindow: Window_ShopStatus): void;
    _statusWindow: Window_ShopStatus | undefined;
}
/**
 * The window for selecting an item to sell on the shop screen.
 */
declare class Window_ShopSell extends Window_ItemList {
    /**
     * @param {RMMZ.DataPricedItemBase | null} item
     * @returns {boolean}
     */
    isEnabled(item: RMMZ.DataPricedItemBase | null): boolean;
}
/**
 * The window for inputting quantity of items to buy or sell on the shop
 * screen.
 */
declare class Window_ShopNumber extends Window_Selectable {
    /** @type {RMMZ.DataPricedItemBase | null} */
    _item: RMMZ.DataPricedItemBase | null | undefined;
    /** @type {number} */
    _max: number | undefined;
    /** @type {number} */
    _price: number | undefined;
    /** @type {number} */
    _number: number | undefined;
    /** @type {string} */
    _currencyUnit: string | undefined;
    /** @returns {number} */
    number(): number;
    /**
     * @param {RMMZ.DataPricedItemBase | null} item
     * @param {number} max
     * @param {number} price
     * @returns {void}
     */
    setup(item: RMMZ.DataPricedItemBase | null, max: number, price: number): void;
    /**
     * @param {string} currencyUnit
     * @returns {void}
     */
    setCurrencyUnit(currencyUnit: string): void;
    /** @returns {void} */
    createButtons(): void;
    _buttons: any[] | undefined;
    /** @returns {void} */
    placeButtons(): void;
    /** @returns {number} */
    totalButtonWidth(): number;
    /** @returns {number} */
    buttonSpacing(): number;
    /** @returns {void} */
    drawCurrentItemName(): void;
    /** @returns {void} */
    drawMultiplicationSign(): void;
    /** @returns {string} */
    multiplicationSign(): string;
    /** @returns {number} */
    multiplicationSignX(): number;
    /** @returns {void} */
    drawNumber(): void;
    /** @returns {void} */
    drawHorzLine(): void;
    /** @returns {void} */
    drawTotalPrice(): void;
    /** @returns {number} */
    itemNameY(): number;
    /** @returns {number} */
    totalPriceY(): number;
    /** @returns {number} */
    buttonY(): number;
    /** @returns {number} */
    cursorWidth(): number;
    /** @returns {number} */
    cursorX(): number;
    /** @returns {number} */
    maxDigits(): number;
    /** @returns {void} */
    processNumberChange(): void;
    /**
     * @param {number} amount
     * @returns {void}
     */
    changeNumber(amount: number): void;
    /** @returns {Rectangle} */
    itemRect(): Rectangle;
    /** @returns {void} */
    onButtonUp(): void;
    /** @returns {void} */
    onButtonUp2(): void;
    /** @returns {void} */
    onButtonDown(): void;
    /** @returns {void} */
    onButtonDown2(): void;
    /** @returns {void} */
    onButtonOk(): void;
}
/**
 * The window for displaying number of items in possession and the actor's
 * equipment on the shop screen.
 */
declare class Window_ShopStatus extends Window_StatusBase {
    /** @type {RMMZ.DataPricedItemBase | null} */
    _item: RMMZ.DataPricedItemBase | null | undefined;
    /** @type {number} */
    _pageIndex: number | undefined;
    /**
     * @param {RMMZ.DataPricedItemBase | null} item
     * @returns {void}
     */
    setItem(item: RMMZ.DataPricedItemBase | null): void;
    /** @returns {boolean} */
    isEquipItem(): boolean;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    drawPossession(x: number, y: number): void;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    drawEquipInfo(x: number, y: number): void;
    /** @returns {Game_Actor[]} */
    statusMembers(): Game_Actor[];
    /** @returns {number} */
    pageSize(): number;
    /** @returns {number} */
    maxPages(): number;
    /**
     * @param {number} x
     * @param {number} y
     * @param {Game_Actor} actor
     * @returns {void}
     */
    drawActorEquipInfo(x: number, y: number, actor: Game_Actor): void;
    /**
     * @param {number} x
     * @param {number} y
     * @param {Game_Actor} actor
     * @param {RMMZ.DataEquipment | null} item1
     * @returns {void}
     */
    drawActorParamChange(x: number, y: number, actor: Game_Actor, item1: RMMZ.DataEquipment | null): void;
    /** @returns {RMMZ.ParamID} */
    paramId(): RMMZ.ParamID;
    /**
     * @param {Game_Actor} actor
     * @param {RMMZ.EquipmentType} etypeId
     * @returns {RMMZ.DataEquipment | null}
     */
    currentEquippedItem(actor: Game_Actor, etypeId: RMMZ.EquipmentType): RMMZ.DataEquipment | null;
    /** @returns {void} */
    updatePage(): void;
    /** @returns {boolean} */
    isPageChangeEnabled(): boolean;
    /** @returns {boolean} */
    isPageChangeRequested(): boolean;
    /** @returns {void} */
    changePage(): void;
}
/**
 * The window for editing an actor's name on the name input screen.
 */
declare class Window_NameEdit extends Window_StatusBase {
    /** @type {Game_Actor | null} */
    _actor: Game_Actor | null | undefined;
    /** @type {number} */
    _maxLength: number | undefined;
    /** @type {string} */
    _name: string | undefined;
    /** @type {string} */
    _defaultName: string | undefined;
    /**
     * @param {Game_Actor} actor
     * @param {number} maxLength
     * @returns {void}
     */
    setup(actor: Game_Actor, maxLength: number): void;
    /** @returns {string} */
    name(): string;
    /** @returns {boolean} */
    restoreDefault(): boolean;
    /**
     * @param {string} ch
     * @returns {boolean}
     */
    add(ch: string): boolean;
    /** @returns {boolean} */
    back(): boolean;
    /** @returns {number} */
    faceWidth(): number;
    /** @returns {number} */
    charWidth(): number;
    /** @returns {number} */
    left(): number;
    /**
     * @param {number} index
     * @returns {Rectangle}
     */
    underlineRect(index: number): Rectangle;
    /** @returns {string} */
    underlineColor(): string;
    /**
     * @param {number} index
     * @returns {void}
     */
    drawUnderline(index: number): void;
    /**
     * @param {number} index
     * @returns {void}
     */
    drawChar(index: number): void;
}
/**
 * The window for selecting text characters on the name input screen.
 */
declare class Window_NameInput extends Window_Selectable {
    /** @type {string[]} */
    static LATIN1: string[];
    /** @type {string[]} */
    static LATIN2: string[];
    /** @type {string[]} */
    static RUSSIA: string[];
    /** @type {string[]} */
    static JAPAN1: string[];
    /** @type {string[]} */
    static JAPAN2: string[];
    /** @type {string[]} */
    static JAPAN3: string[];
    constructor(...args: any[]);
    initialize(rect: any): void;
    /** @type {Window_NameEdit | null} */
    _editWindow: Window_NameEdit | null | undefined;
    /** @type {number} */
    _page: number | undefined;
    /**
     * @param {Window_NameEdit} editWindow
     * @returns {void}
     */
    setEditWindow(editWindow: Window_NameEdit): void;
    /** @returns {string[][]} */
    table(): string[][];
    /** @returns {number} */
    groupSpacing(): number;
    /** @returns {string} */
    character(): string;
    /** @returns {boolean} */
    isPageChange(): boolean;
    /** @returns {boolean} */
    isOk(): boolean;
    /** @returns {void} */
    updateCursor(): void;
    /** @returns {void} */
    processJump(): void;
    /** @returns {void} */
    processBack(): void;
    /** @returns {void} */
    onNameAdd(): void;
    /** @returns {void} */
    onNameOk(): void;
}
/**
 * The window for displaying a speaker name above the message window.
 */
declare class Window_NameBox extends Window_Base {
    /** @param {[]} args */
    constructor();
    initialize(): void;
    /** @type {string} */
    _name: string | undefined;
    /**
     * @param {Window_Message} messageWindow
     * @returns {void}
     */
    setMessageWindow(messageWindow: Window_Message): void;
    _messageWindow: Window_Message | undefined;
    /**
     * @param {string} name
     * @returns {void}
     */
    setName(name: string): void;
    /** @returns {void} */
    clear(): void;
    /** @returns {void} */
    start(): void;
    /** @returns {void} */
    updatePlacement(): void;
    /** @returns {void} */
    updateBackground(): void;
    /** @returns {number} */
    windowWidth(): number;
    /** @returns {number} */
    windowHeight(): number;
    /** @returns {void} */
    refresh(): void;
}
/**
 * The window used for the event command [Show Choices].
 */
declare class Window_ChoiceList extends Window_Command {
    /** @param {[]} args */
    constructor();
    initialize(): void;
    /** @type {RMMZ.TextWindowBackgroundType} */
    _background: RMMZ.TextWindowBackgroundType | undefined;
    /**
     * @param {Window_Message} messageWindow
     * @returns {void}
     */
    setMessageWindow(messageWindow: Window_Message): void;
    _messageWindow: Window_Message | undefined;
    /** @returns {void} */
    createCancelButton(): void;
    _cancelButton: Sprite_Button | undefined;
    /** @returns {void} */
    start(): void;
    /** @returns {void} */
    updateCancelButton(): void;
    /** @returns {void} */
    selectDefault(): void;
    /** @returns {void} */
    updatePlacement(): void;
    /** @returns {void} */
    updateBackground(): void;
    /** @returns {void} */
    placeCancelButton(): void;
    /** @returns {number} */
    windowX(): number;
    /** @returns {number} */
    windowY(): number;
    /** @returns {number} */
    windowWidth(): number;
    /** @returns {number} */
    windowHeight(): number;
    /** @returns {number} */
    numVisibleRows(): number;
    /** @returns {4 | 8} */
    maxLines(): 4 | 8;
    /** @returns {number} */
    maxChoiceWidth(): number;
    /** @returns {boolean} */
    needsCancelButton(): boolean;
}
/**
 * The window used for the event command [Input Number].
 */
declare class Window_NumberInput extends Window_Selectable {
    /** @param {[]} args */
    constructor();
    initialize(): void;
    /** @type {number} */
    _number: number | undefined;
    /** @type {number} */
    _maxDigits: number | undefined;
    /**
     * @param {Window_Message} messageWindow
     * @returns {void}
     */
    setMessageWindow(messageWindow: Window_Message): void;
    _messageWindow: Window_Message | undefined;
    /** @returns {void} */
    start(): void;
    /** @returns {void} */
    updatePlacement(): void;
    /** @returns {number} */
    windowWidth(): number;
    /** @returns {number} */
    windowHeight(): number;
    /** @returns {void} */
    createButtons(): void;
    _buttons: any[] | undefined;
    /** @returns {void} */
    placeButtons(): void;
    /** @returns {number} */
    totalButtonWidth(): number;
    /** @returns {number} */
    buttonSpacing(): number;
    /** @returns {number} */
    buttonY(): number;
    /** @returns {void} */
    processDigitChange(): void;
    /**
     * @param {boolean} up
     * @returns {void}
     */
    changeDigit(up: boolean): void;
    /** @returns {void} */
    onButtonUp(): void;
    /** @returns {void} */
    onButtonDown(): void;
    /** @returns {void} */
    onButtonOk(): void;
}
/**
 * The window used for the event command [Select Item].
 */
declare class Window_EventItem extends Window_ItemList {
    /** @param {[rect: Rectangle]} args */
    constructor(rect: Rectangle);
    /** @param {Rectangle} rect */
    initialize(rect: Rectangle): void;
    /**
     * @param {Window_Message} messageWindow
     * @returns {void}
     */
    setMessageWindow(messageWindow: Window_Message): void;
    _messageWindow: Window_Message | undefined;
    /** @returns {void} */
    createCancelButton(): void;
    _cancelButton: Sprite_Button | undefined;
    /** @returns {void} */
    start(): void;
    /** @returns {void} */
    updateCancelButton(): void;
    /** @returns {void} */
    updatePlacement(): void;
    /** @returns {void} */
    placeCancelButton(): void;
    /**
     * @param {RMMZ.DataItemBase} item
     * @returns {boolean}
     */
    includes(item: RMMZ.DataItemBase): boolean;
    /** @returns {boolean} */
    isEnabled(): boolean;
    /** @returns {void} */
    onOk(): void;
    /** @returns {void} */
    onCancel(): void;
}
/**
 * The window for displaying text messages.
 */
declare class Window_Message extends Window_Base {
    /** @returns {void} */
    initMembers(): void;
    /** @type {RMMZ.TextWindowBackgroundType} */
    _background: RMMZ.TextWindowBackgroundType | undefined;
    /** @type {RMMZ.TextWindowPositionType} */
    _positionType: RMMZ.TextWindowPositionType | undefined;
    /** @type {number} */
    _waitCount: number | undefined;
    /** @type {Bitmap | null} */
    _faceBitmap: Bitmap | null | undefined;
    /** @type {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; } | null} */
    _textState: {
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
    } | null | undefined;
    /** @type {Window_Gold | null} */
    _goldWindow: Window_Gold | null | undefined;
    /** @type {Window_NameBox | null} */
    _nameBoxWindow: Window_NameBox | null | undefined;
    /** @type {Window_ChoiceList | null} */
    _choiceListWindow: Window_ChoiceList | null | undefined;
    /** @type {Window_NumberInput | null} */
    _numberInputWindow: Window_NumberInput | null | undefined;
    /** @type {Window_EventItem | null} */
    _eventItemWindow: Window_EventItem | null | undefined;
    /**
     * @param {Window_Gold} goldWindow
     * @returns {void}
     */
    setGoldWindow(goldWindow: Window_Gold): void;
    /**
     * @param {Window_NameBox} nameBoxWindow
     * @returns {void}
     */
    setNameBoxWindow(nameBoxWindow: Window_NameBox): void;
    /**
     * @param {Window_ChoiceList} choiceListWindow
     * @returns {void}
     */
    setChoiceListWindow(choiceListWindow: Window_ChoiceList): void;
    /**
     * @param {Window_NumberInput} numberInputWindow
     * @returns {void}
     */
    setNumberInputWindow(numberInputWindow: Window_NumberInput): void;
    /**
     * @param {Window_EventItem} eventItemWindow
     * @returns {void}
     */
    setEventItemWindow(eventItemWindow: Window_EventItem): void;
    /** @returns {void} */
    clearFlags(): void;
    _showFast: boolean | undefined;
    _lineShowFast: boolean | undefined;
    _pauseSkip: boolean | undefined;
    /** @returns {void} */
    checkToNotClose(): void;
    /** @returns {void} */
    synchronizeNameBox(): void;
    /** @returns {boolean} */
    canStart(): boolean;
    /** @returns {void} */
    startMessage(): void;
    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {number}
     */
    newLineX(textState: {
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
    }): number;
    /** @returns {void} */
    updatePlacement(): void;
    /** @returns {void} */
    updateBackground(): void;
    /** @returns {void} */
    terminateMessage(): void;
    /** @returns {boolean} */
    updateWait(): boolean;
    /** @returns {void} */
    cancelWait(): void;
    /** @returns {boolean} */
    updateLoading(): boolean;
    /** @returns {boolean} */
    updateInput(): boolean;
    /** @returns {boolean} */
    isAnySubWindowActive(): boolean;
    /** @returns {boolean} */
    updateMessage(): boolean;
    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {boolean}
     */
    shouldBreakHere(textState: {
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
    }): boolean;
    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {boolean}
     */
    canBreakHere(textState: {
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
    }): boolean;
    /** @returns {void} */
    onEndOfText(): void;
    /** @returns {boolean} */
    startInput(): boolean;
    /** @returns {boolean} */
    isTriggered(): boolean;
    /** @returns {boolean} */
    doesContinue(): boolean;
    /** @returns {boolean} */
    areSettingsChanged(): boolean;
    /** @returns {void} */
    updateShowFast(): void;
    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {void}
     */
    newPage(textState: {
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
    }): void;
    /** @returns {void} */
    updateSpeakerName(): void;
    /** @returns {void} */
    loadMessageFace(): void;
    /** @returns {void} */
    drawMessageFace(): void;
    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {void}
     */
    processNewPage(textState: {
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
    }): void;
    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {boolean}
     */
    isEndOfText(textState: {
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
    }): boolean;
    /**
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {boolean}
     */
    needsNewPage(textState: {
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
    }): boolean;
    /**
     * @param {("$" | "." | "|" | "!" | ">" | "<" | "^") | ("C" | "I" | "PX" | "PY" | "FS" | "{" | "}")} code
     * @param {{ text: string; index: number; x: number; y: number; width: number; height: number; startX: number; startY: number; rtl: boolean; buffer: string; drawing: boolean; outputWidth: number; outputHeight: number; }} textState
     * @returns {void}
     */
    processEscapeCharacter(code: ("$" | "." | "|" | "!" | ">" | "<" | "^") | ("C" | "I" | "PX" | "PY" | "FS" | "{" | "}"), textState: {
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
    }): void;
    /**
     * @param {number} count
     * @returns {void}
     */
    startWait(count: number): void;
    /** @returns {void} */
    startPause(): void;
    /** @returns {boolean} */
    isWaiting(): boolean;
}
/**
 * The window for displaying scrolling text. No frame is displayed, but it
 * is handled as a window for convenience.
 */
declare class Window_ScrollText extends Window_Base {
    /** @type {Rectangle} */
    _reservedRect: Rectangle | undefined;
    /** @type {string | null} */
    _text: string | null | undefined;
    _maxBitmapHeight: number | undefined;
    /** @type {number} */
    _allTextHeight: number | undefined;
    _blockHeight: number | undefined;
    _blockIndex: number | undefined;
    _scrollY: number | undefined;
    /** @returns {void} */
    startMessage(): void;
    /** @returns {void} */
    refresh(): void;
    /** @returns {void} */
    updatePlacement(): void;
    /** @returns {void} */
    updateMessage(): void;
    /** @returns {number} */
    scrollSpeed(): number;
    /** @returns {boolean} */
    isFastForward(): boolean;
    /** @returns {number} */
    fastForwardRate(): number;
    /** @returns {void} */
    terminateMessage(): void;
}
/**
 * The window for displaying the map name on the map screen.
 */
declare class Window_MapName extends Window_Base {
    /** @type {number} */
    _showCount: number | undefined;
    /** @returns {void} */
    updateFadeIn(): void;
    /** @returns {void} */
    updateFadeOut(): void;
    /** @returns {void} */
    refresh(): void;
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @returns {void}
     */
    drawBackground(x: number, y: number, width: number, height: number): void;
}
/**
 * The window for displaying battle progress. No frame is displayed, but it is
 * handled as a window for convenience.
 */
declare class Window_BattleLog extends Window_Base {
    /** @type {string[]} */
    _lines: string[] | undefined;
    /** @type {((Window_BattleLog["performActionStart"] extends (...args: any[]) => any ? { name: "performActionStart"; params: Parameters<Window_BattleLog["performActionStart"]>; } : never) | (Window_BattleLog["performAction"] extends (...args: any[]) => any ? { name: "performAction"; params: Parameters<Window_BattleLog["performAction"]>; } : never) | (Window_BattleLog["performActionEnd"] extends (...args: any[]) => any ? { name: "performActionEnd"; params: Parameters<Window_BattleLog["performActionEnd"]>; } : never) | (Window_BattleLog["performCounter"] extends (...args: any[]) => any ? { name: "performCounter"; params: Parameters<Window_BattleLog["performCounter"]>; } : never) | (Window_BattleLog["performReflection"] extends (...args: any[]) => any ? { name: "performReflection"; params: Parameters<Window_BattleLog["performReflection"]>; } : never) | (Window_BattleLog["performSubstitute"] extends (...args: any[]) => any ? { name: "performSubstitute"; params: Parameters<Window_BattleLog["performSubstitute"]>; } : never) | (Window_BattleLog["performMiss"] extends (...args: any[]) => any ? { name: "performMiss"; params: Parameters<Window_BattleLog["performMiss"]>; } : never) | (Window_BattleLog["performEvasion"] extends (...args: any[]) => any ? { name: "performEvasion"; params: Parameters<Window_BattleLog["performEvasion"]>; } : never) | (Window_BattleLog["performMagicEvasion"] extends (...args: any[]) => any ? { name: "performMagicEvasion"; params: Parameters<Window_BattleLog["performMagicEvasion"]>; } : never) | (Window_BattleLog["performDamage"] extends (...args: any[]) => any ? { name: "performDamage"; params: Parameters<Window_BattleLog["performDamage"]>; } : never) | (Window_BattleLog["performRecovery"] extends (...args: any[]) => any ? { name: "performRecovery"; params: Parameters<Window_BattleLog["performRecovery"]>; } : never) | (Window_BattleLog["performCollapse"] extends (...args: any[]) => any ? { name: "performCollapse"; params: Parameters<Window_BattleLog["performCollapse"]>; } : never) | (Window_BattleLog["pushBaseLine"] extends (...args: any[]) => any ? { name: "pushBaseLine"; params: Parameters<Window_BattleLog["pushBaseLine"]>; } : never) | (Window_BattleLog["popBaseLine"] extends (...args: any[]) => any ? { name: "popBaseLine"; params: Parameters<Window_BattleLog["popBaseLine"]>; } : never) | (Window_BattleLog["addText"] extends (...args: any[]) => any ? { name: "addText"; params: Parameters<Window_BattleLog["addText"]>; } : never) | (Window_BattleLog["popupDamage"] extends (...args: any[]) => any ? { name: "popupDamage"; params: Parameters<Window_BattleLog["popupDamage"]>; } : never) | (Window_BattleLog["wait"] extends (...args: any[]) => any ? { name: "wait"; params: Parameters<Window_BattleLog["wait"]>; } : never) | (Window_BattleLog["waitForMovement"] extends (...args: any[]) => any ? { name: "waitForMovement"; params: Parameters<Window_BattleLog["waitForMovement"]>; } : never) | (Window_BattleLog["waitForNewLine"] extends (...args: any[]) => any ? { name: "waitForNewLine"; params: Parameters<Window_BattleLog["waitForNewLine"]>; } : never) | (Window_BattleLog["waitForEffect"] extends (...args: any[]) => any ? { name: "waitForEffect"; params: Parameters<Window_BattleLog["waitForEffect"]>; } : never) | (Window_BattleLog["showAnimation"] extends (...args: any[]) => any ? { name: "showAnimation"; params: Parameters<Window_BattleLog["showAnimation"]>; } : never) | (Window_BattleLog["clear"] extends (...args: any[]) => any ? { name: "clear"; params: Parameters<Window_BattleLog["clear"]>; } : never))[]} */
    _methods: ({
        name: "performActionStart";
        params: Parameters<Window_BattleLog["performActionStart"]>;
    } | {
        name: "performAction";
        params: Parameters<Window_BattleLog["performAction"]>;
    } | {
        name: "performActionEnd";
        params: Parameters<Window_BattleLog["performActionEnd"]>;
    } | {
        name: "performCounter";
        params: Parameters<Window_BattleLog["performCounter"]>;
    } | {
        name: "performReflection";
        params: Parameters<Window_BattleLog["performReflection"]>;
    } | {
        name: "performSubstitute";
        params: Parameters<Window_BattleLog["performSubstitute"]>;
    } | {
        name: "performMiss";
        params: Parameters<Window_BattleLog["performMiss"]>;
    } | {
        name: "performEvasion";
        params: Parameters<Window_BattleLog["performEvasion"]>;
    } | {
        name: "performMagicEvasion";
        params: Parameters<Window_BattleLog["performMagicEvasion"]>;
    } | {
        name: "performDamage";
        params: Parameters<Window_BattleLog["performDamage"]>;
    } | {
        name: "performRecovery";
        params: Parameters<Window_BattleLog["performRecovery"]>;
    } | {
        name: "performCollapse";
        params: Parameters<Window_BattleLog["performCollapse"]>;
    } | {
        name: "pushBaseLine";
        params: Parameters<Window_BattleLog["pushBaseLine"]>;
    } | {
        name: "popBaseLine";
        params: Parameters<Window_BattleLog["popBaseLine"]>;
    } | {
        name: "addText";
        params: Parameters<Window_BattleLog["addText"]>;
    } | {
        name: "popupDamage";
        params: Parameters<Window_BattleLog["popupDamage"]>;
    } | {
        name: "wait";
        params: Parameters<Window_BattleLog["wait"]>;
    } | {
        name: "waitForMovement";
        params: Parameters<Window_BattleLog["waitForMovement"]>;
    } | {
        name: "waitForNewLine";
        params: Parameters<Window_BattleLog["waitForNewLine"]>;
    } | {
        name: "waitForEffect";
        params: Parameters<Window_BattleLog["waitForEffect"]>;
    } | {
        name: "showAnimation";
        params: Parameters<Window_BattleLog["showAnimation"]>;
    } | {
        name: "clear";
        params: Parameters<Window_BattleLog["clear"]>;
    })[] | undefined;
    /** @type {number} */
    _waitCount: number | undefined;
    /** @type {RMMZ.WaitMode} */
    _waitMode: RMMZ.WaitMode | undefined;
    /** @type {number[]} */
    _baseLineStack: number[] | undefined;
    /** @type {Spriteset_Battle | null} */
    _spriteset: Spriteset_Battle | null | undefined;
    /**
     * @param {Spriteset_Battle} spriteset
     * @returns {void}
     */
    setSpriteset(spriteset: Spriteset_Battle): void;
    /** @returns {number} */
    maxLines(): number;
    /** @returns {number} */
    numLines(): number;
    /** @returns {number} */
    messageSpeed(): number;
    /** @returns {boolean | "video" | "scroll" | "image" | "message" | "transfer" | "route" | "animation" | "balloon" | "gather" | "action" | "effect" | "movement"} */
    isBusy(): boolean | "video" | "scroll" | "image" | "message" | "transfer" | "route" | "animation" | "balloon" | "gather" | "action" | "effect" | "movement";
    /** @returns {boolean} */
    updateWait(): boolean;
    /** @returns {boolean} */
    updateWaitCount(): boolean;
    /** @returns {boolean} */
    updateWaitMode(): boolean;
    /**
     * @param {RMMZ.WaitMode} waitMode
     * @returns {void}
     */
    setWaitMode(waitMode: RMMZ.WaitMode): void;
    /** @returns {void} */
    callNextMethod(): void;
    /** @returns {boolean} */
    isFastForward(): boolean;
    /**
     * @template T
     * @param {T} methodName
     * @returns {void}
     */
    push<T>(methodName: T, ...args: any[]): void;
    /** @returns {void} */
    clear(): void;
    /** @returns {void} */
    wait(): void;
    /** @returns {void} */
    waitForEffect(): void;
    /** @returns {void} */
    waitForMovement(): void;
    /**
     * @param {string} text
     * @returns {void}
     */
    addText(text: string): void;
    /** @returns {void} */
    pushBaseLine(): void;
    /** @returns {void} */
    popBaseLine(): void;
    /** @returns {void} */
    waitForNewLine(): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    popupDamage(target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} subject
     * @param {Game_Action} action
     * @returns {void}
     */
    performActionStart(subject: RMMZ.ActionTarget, action: Game_Action): void;
    /**
     * @param {RMMZ.ActionTarget} subject
     * @param {Game_Action} action
     * @returns {void}
     */
    performAction(subject: RMMZ.ActionTarget, action: Game_Action): void;
    /**
     * @param {RMMZ.ActionTarget} subject
     * @returns {void}
     */
    performActionEnd(subject: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    performDamage(target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    performMiss(target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    performRecovery(target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    performEvasion(target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    performMagicEvasion(target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    performCounter(target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    performReflection(target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} substitute
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    performSubstitute(substitute: RMMZ.ActionTarget, target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    performCollapse(target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} subject
     * @param {RMMZ.ActionTarget[]} targets
     * @param {RMMZ.AnimationID} animationId
     * @returns {void}
     */
    showAnimation(subject: RMMZ.ActionTarget, targets: RMMZ.ActionTarget[], animationId: RMMZ.AnimationID): void;
    /**
     * @param {RMMZ.ActionTarget} subject
     * @param {RMMZ.ActionTarget[]} targets
     * @returns {void}
     */
    showAttackAnimation(subject: RMMZ.ActionTarget, targets: RMMZ.ActionTarget[]): void;
    /**
     * @param {Game_Actor} subject
     * @param {RMMZ.ActionTarget[]} targets
     * @returns {void}
     */
    showActorAttackAnimation(subject: Game_Actor, targets: RMMZ.ActionTarget[]): void;
    /**
     * @param {Game_Enemy} subject
     * @param {RMMZ.ActionTarget[]} targets
     * @returns {void}
     */
    showEnemyAttackAnimation(subject: Game_Enemy, targets: RMMZ.ActionTarget[]): void;
    /**
     * @param {RMMZ.ActionTarget[]} targets
     * @param {RMMZ.AnimationID} animationId
     * @param {boolean} [mirror]
     * @returns {void}
     */
    showNormalAnimation(targets: RMMZ.ActionTarget[], animationId: RMMZ.AnimationID, mirror?: boolean): void;
    /** @returns {void} */
    refresh(): void;
    /** @returns {void} */
    drawBackground(): void;
    /** @returns {Rectangle} */
    backRect(): Rectangle;
    /**
     * @param {number} index
     * @returns {Rectangle}
     */
    lineRect(index: number): Rectangle;
    /** @returns {string} */
    backColor(): string;
    /** @returns {number} */
    backPaintOpacity(): number;
    /**
     * @param {number} index
     * @returns {void}
     */
    drawLineText(index: number): void;
    /** @returns {void} */
    startTurn(): void;
    /**
     * @param {RMMZ.ActionTarget} subject
     * @param {Game_Action} action
     * @param {RMMZ.ActionTarget[]} targets
     * @returns {void}
     */
    startAction(subject: RMMZ.ActionTarget, action: Game_Action, targets: RMMZ.ActionTarget[]): void;
    /**
     * @param {RMMZ.ActionTarget} subject
     * @returns {void}
     */
    endAction(subject: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} subject
     * @returns {void}
     */
    displayCurrentState(subject: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} subject
     * @returns {void}
     */
    displayRegeneration(subject: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} subject
     * @param {RMMZ.DataItemBase} item
     * @returns {void}
     */
    displayAction(subject: RMMZ.ActionTarget, item: RMMZ.DataItemBase): void;
    /**
     * @param {string} fmt
     * @param {RMMZ.ActionTarget} subject
     * @param {RMMZ.DataItemBase} item
     * @returns {void}
     */
    displayItemMessage(fmt: string, subject: RMMZ.ActionTarget, item: RMMZ.DataItemBase): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayCounter(target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayReflection(target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} substitute
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displaySubstitute(substitute: RMMZ.ActionTarget, target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} subject
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayActionResults(subject: RMMZ.ActionTarget, target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayFailure(target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayCritical(target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayDamage(target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayMiss(target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayEvasion(target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayHpDamage(target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayMpDamage(target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayTpDamage(target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayAffectedStatus(target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayAutoAffectedStatus(target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayChangedStates(target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayAddedStates(target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayRemovedStates(target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {void}
     */
    displayChangedBuffs(target: RMMZ.ActionTarget): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @param {RMMZ.ParamID[]} buffs
     * @param {string} fmt
     * @returns {void}
     */
    displayBuffs(target: RMMZ.ActionTarget, buffs: RMMZ.ParamID[], fmt: string): void;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {string}
     */
    makeHpDamageText(target: RMMZ.ActionTarget): string;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {string}
     */
    makeMpDamageText(target: RMMZ.ActionTarget): string;
    /**
     * @param {RMMZ.ActionTarget} target
     * @returns {string}
     */
    makeTpDamageText(target: RMMZ.ActionTarget): string;
}
/**
 * The window for selecting whether to fight or escape on the battle screen.
 */
declare class Window_PartyCommand extends Window_Command {
    /** @returns {void} */
    setup(): void;
}
/**
 * The window for selecting an actor's action on the battle screen.
 */
declare class Window_ActorCommand extends Window_Command {
    /** @type {Game_Actor | null} */
    _actor: Game_Actor | null | undefined;
    /** @returns {void} */
    addAttackCommand(): void;
    /** @returns {void} */
    addSkillCommands(): void;
    /** @returns {void} */
    addGuardCommand(): void;
    /** @returns {void} */
    addItemCommand(): void;
    /**
     * @param {Game_Actor | null} actor
     * @returns {void}
     */
    setup(actor: Game_Actor | null): void;
    /** @returns {Game_Actor | null} */
    actor(): Game_Actor | null;
    /** @returns {void} */
    selectLast(): void;
}
/**
 * The window for displaying the status of party members on the battle screen.
 */
declare class Window_BattleStatus extends Window_StatusBase {
    /** @type {number} */
    _bitmapsReady: number | undefined;
    /** @returns {number} */
    extraHeight(): number;
    /**
     * @param {number} index
     * @returns {Game_Actor}
     */
    actor(index: number): Game_Actor;
    /**
     * @param {Game_Actor | null} actor
     * @returns {void}
     */
    selectActor(actor: Game_Actor | null): void;
    /** @returns {void} */
    preparePartyRefresh(): void;
    /** @returns {void} */
    performPartyRefresh(): void;
    /**
     * @param {number} index
     * @returns {void}
     */
    drawItemImage(index: number): void;
    /**
     * @param {number} index
     * @returns {void}
     */
    drawItemStatus(index: number): void;
    /**
     * @param {number} index
     * @returns {Rectangle}
     */
    faceRect(index: number): Rectangle;
    /**
     * @param {Rectangle} rect
     * @returns {number}
     */
    nameX(rect: Rectangle): number;
    /**
     * @param {Rectangle} rect
     * @returns {number}
     */
    nameY(rect: Rectangle): number;
    /**
     * @param {Rectangle} rect
     * @returns {number}
     */
    stateIconX(rect: Rectangle): number;
    /**
     * @param {Rectangle} rect
     * @returns {number}
     */
    stateIconY(rect: Rectangle): number;
    /**
     * @param {Rectangle} rect
     * @returns {number}
     */
    basicGaugesX(rect: Rectangle): number;
    /**
     * @param {Rectangle} rect
     * @returns {number}
     */
    basicGaugesY(rect: Rectangle): number;
}
/**
 * The window for selecting a target actor on the battle screen.
 */
declare class Window_BattleActor extends Window_BattleStatus {
}
/**
 * The window for selecting a target enemy on the battle screen.
 */
declare class Window_BattleEnemy extends Window_Selectable {
    /** @type {Game_Enemy[]} */
    _enemies: Game_Enemy[] | undefined;
    /** @returns {Game_Enemy} */
    enemy(): Game_Enemy;
    /** @returns {number} */
    enemyIndex(): number;
}
/**
 * The window for selecting a skill to use on the battle screen.
 */
declare class Window_BattleSkill extends Window_SkillList {
    /** @param {[rect: Rectangle]} args */
    constructor(rect: Rectangle);
    /** @param {Rectangle} rect */
    initialize(rect: Rectangle): void;
}
/**
 * The window for selecting an item to use on the battle screen.
 */
declare class Window_BattleItem extends Window_ItemList {
    /** @param {[rect: Rectangle]} args */
    constructor(rect: Rectangle);
    /** @param {Rectangle} rect */
    initialize(rect: Rectangle): void;
    /**
     * @param {RMMZ.DataItemBase} item
     * @returns {boolean}
     */
    includes(item: RMMZ.DataItemBase): boolean;
}
/**
 * The window for selecting New Game/Continue on the title screen.
 */
declare class Window_TitleCommand extends Window_Command {
    /** @type {string | null} */
    static _lastCommandSymbol: string | null;
    /** @returns {void} */
    static initCommandPosition(): void;
    /** @returns {boolean} */
    isContinueEnabled(): boolean;
    /** @returns {void} */
    selectLast(): void;
}
/**
 * The window for selecting "Go to Title" on the game end screen.
 */
declare class Window_GameEnd extends Window_Command {
}
/**
 * The window for selecting a block of switches/variables on the debug screen.
 */
declare class Window_DebugRange extends Window_Selectable {
    /** @type {number} */
    static lastTopRow: number;
    /** @type {number} */
    static lastIndex: number;
    /** @type {number} */
    _maxSwitches: number | undefined;
    /** @type {number} */
    _maxVariables: number | undefined;
    /**
     * @param {number} [index]
     * @returns {"switch" | "variable"}
     */
    mode(index?: number): "switch" | "variable";
    /**
     * @param {number} index
     * @returns {number}
     */
    topId(index: number): number;
    /**
     * @param {number} [index]
     * @returns {boolean}
     */
    isSwitchMode(index?: number): boolean;
    /**
     * @param {Window_DebugEdit} editWindow
     * @returns {void}
     */
    setEditWindow(editWindow: Window_DebugEdit): void;
    _editWindow: Window_DebugEdit | undefined;
}
/**
 * The window for displaying switches and variables on the debug screen.
 */
declare class Window_DebugEdit extends Window_Selectable {
    /** @type {"switch" | "variable"} */
    _mode: "switch" | "variable" | undefined;
    /** @type {number} */
    _topId: number | undefined;
    /**
     * @param {RMMZ.SwitchID | RMMZ.VariableID} dataId
     * @returns {string}
     */
    itemName(dataId: RMMZ.SwitchID | RMMZ.VariableID): string;
    /**
     * @param {RMMZ.SwitchID | RMMZ.VariableID} dataId
     * @returns {string}
     */
    itemStatus(dataId: RMMZ.SwitchID | RMMZ.VariableID): string;
    /**
     * @param {"switch" | "variable"} mode
     * @returns {void}
     */
    setMode(mode: "switch" | "variable"): void;
    /**
     * @param {RMMZ.SwitchID | RMMZ.VariableID} id
     * @returns {void}
     */
    setTopId(id: RMMZ.SwitchID | RMMZ.VariableID): void;
    /** @returns {number} */
    currentId(): number;
    /** @returns {void} */
    updateSwitch(): void;
    /** @returns {void} */
    updateVariable(): void;
    /** @returns {0 | 1 | 10 | -1 | -10} */
    deltaForVariable(): 0 | 1 | 10 | -1 | -10;
}
