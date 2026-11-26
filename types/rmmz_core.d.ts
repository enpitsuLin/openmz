// Auto-generated from JSDoc in src/js/rmmz_core.js via `pnpm build:types`. Do not edit manually.

/**
 * The static class that defines utility methods.
 *
 * @namespace
 */
declare class Utils {
    /**
     * The name of the RPG Maker. "MZ" in the current version.
     *
     * @type {string}
     * @constant
     */
    static RPGMAKER_NAME: string;
    /**
     * The version of the RPG Maker.
     *
     * @type {string}
     * @constant
     */
    static RPGMAKER_VERSION: string;
    /**
     * Checks whether the current RPG Maker version is greater than or equal to
     * the given version.
     *
     * @param {string} version - The "x.x.x" format string to compare.
     * @returns {boolean} True if the current version is greater than or equal
     * to the given version.
     */
    static checkRMVersion(version: string): boolean;
    /**
     * Checks whether the option is in the query string.
     *
     * @param {string} name - The option name.
     * @returns {boolean} True if the option is in the query string.
     */
    static isOptionValid(name: string): boolean;
    /**
     * Checks whether the platform is NW.js.
     *
     * @returns {boolean} True if the platform is NW.js.
     */
    static isNwjs(): boolean;
    /**
     * Checks whether the platform is a mobile device.
     *
     * @returns {boolean} True if the platform is a mobile device.
     */
    static isMobileDevice(): boolean;
    /**
     * Checks whether the browser is Mobile Safari.
     *
     * @returns {boolean} True if the browser is Mobile Safari.
     */
    static isMobileSafari(): boolean;
    /**
     * Checks whether the browser is Android Chrome.
     *
     * @returns {boolean} True if the browser is Android Chrome.
     */
    static isAndroidChrome(): boolean;
    /**
     * Checks whether the browser is accessing local files.
     *
     * @returns {boolean} True if the browser is accessing local files.
     */
    static isLocal(): boolean;
    /**
     * Checks whether the browser supports WebGL.
     *
     * @returns {boolean} True if the browser supports WebGL.
     */
    static canUseWebGL(): boolean;
    /**
     * Checks whether the browser supports Web Audio API.
     *
     * @returns {boolean} True if the browser supports Web Audio API.
     */
    static canUseWebAudioAPI(): boolean;
    /**
     * Checks whether the browser supports CSS Font Loading.
     *
     * @returns {boolean} True if the browser supports CSS Font Loading.
     */
    static canUseCssFontLoading(): boolean;
    /**
     * Checks whether the browser supports IndexedDB.
     *
     * @returns {boolean} True if the browser supports IndexedDB.
     */
    static canUseIndexedDB(): boolean;
    /**
     * Checks whether the browser can play ogg files.
     *
     * @returns {boolean} True if the browser can play ogg files.
     */
    static canPlayOgg(): boolean;
    /**
     * Checks whether the browser can play webm files.
     *
     * @returns {boolean} True if the browser can play webm files.
     */
    static canPlayWebm(): boolean;
    /**
     * Encodes a URI component without escaping slash characters.
     *
     * @param {string} str - The input string.
     * @returns {string} Encoded string.
     */
    static encodeURI(str: string): string;
    /**
     * Gets the filename that does not include subfolders.
     *
     * @param {string} filename - The filename with subfolders.
     * @returns {string} The filename without subfolders.
     */
    static extractFileName(filename: string): string;
    /**
     * Escapes special characters for HTML.
     *
     * @param {string} str - The input string.
     * @returns {string} Escaped string.
     */
    static escapeHtml(str: string): string;
    /**
     * Checks whether the string contains any Arabic characters.
     *
     * @param {string} str
     * @returns {boolean} True if the string contains any Arabic characters.
     */
    static containsArabic(str: string): boolean;
    /**
     * Sets information related to encryption.
     *
     * @param {boolean} hasImages - Whether the image files are encrypted.
     * @param {boolean} hasAudio - Whether the audio files are encrypted.
     * @param {string} key - The encryption key.
     * @returns {void}
     */
    static setEncryptionInfo(hasImages: boolean, hasAudio: boolean, key: string): void;
    /**
     * Checks whether the image files in the game are encrypted.
     *
     * @returns {boolean} True if the image files are encrypted.
     */
    static hasEncryptedImages(): boolean;
    /**
     * Checks whether the audio files in the game are encrypted.
     *
     * @returns {boolean} True if the audio files are encrypted.
     */
    static hasEncryptedAudio(): boolean;
    /**
     * Decrypts encrypted data.
     *
     * @param {ArrayBuffer} source - The data to be decrypted.
     * @returns {ArrayBuffer} The decrypted data.
     */
    static decryptArrayBuffer(source: ArrayBuffer): ArrayBuffer;
}
/**
 * The static class that carries out graphics processing.
 *
 * @namespace
 */
declare class Graphics {
    /**
     * Initializes the graphics system.
     *
     * @returns {Promise<boolean>}
     */
    static initialize(): Promise<boolean>;
    /**
     * The PIXI.Application object.
     *
     * @name Graphics.app
     * @type {import("pixi.js").Application}
     */
    static get app(): import("pixi.js").Application;
    /**
     * The context object of Effekseer.
     *
     * @name Graphics.effekseer
     * @type {effekseer.EffekseerContext}
     */
    static get effekseer(): effekseer.EffekseerContext;
    /**
     * Register a handler for tick events.
     *
     * @param {(deltaTime: number) => void} handler - The listener function to be added for updates.
     * @returns {void}
     */
    static setTickHandler(handler: (deltaTime: number) => void): void;
    /**
     * Starts the game loop.
     *
     * @returns {void}
     */
    static startGameLoop(): void;
    /**
     * Stops the game loop.
     *
     * @returns {void}
     */
    static stopGameLoop(): void;
    /**
     * Sets the stage to be rendered.
     *
     * @param {Stage | null} stage - The stage object to be rendered.
     * @returns {void}
     */
    static setStage(stage: Stage | null): void;
    /**
     * Shows the loading spinner.
     *
     * @returns {void}
     */
    static startLoading(): void;
    /**
     * Erases the loading spinner.
     *
     * @returns {boolean} True if the loading spinner was active.
     */
    static endLoading(): boolean;
    /**
     * Displays the error text to the screen.
     *
     * @param {string} name - The name of the error.
     * @param {string} message - The message of the error.
     * @param {Error | ErrorEvent} [error] - The error object.
     * @returns {void}
     */
    static printError(name: string, message: string, error?: Error | ErrorEvent): void;
    /**
     * Displays a button to try to reload resources.
     *
     * @param {() => void} retry - The callback function to be called when the button
     *   is pressed.
     * @returns {void}
     */
    static showRetryButton(retry: () => void): void;
    /**
     * Erases the loading error text.
     *
     * @returns {void}
     */
    static eraseError(): void;
    /**
     * Converts an x coordinate on the page to the corresponding
     * x coordinate on the canvas area.
     *
     * @param {number} x - The x coordinate on the page to be converted.
     * @returns {number} The x coordinate on the canvas area.
     */
    static pageToCanvasX(x: number): number;
    /**
     * Converts a y coordinate on the page to the corresponding
     * y coordinate on the canvas area.
     *
     * @param {number} y - The y coordinate on the page to be converted.
     * @returns {number} The y coordinate on the canvas area.
     */
    static pageToCanvasY(y: number): number;
    /**
     * Checks whether the specified point is inside the game canvas area.
     *
     * @param {number} x - The x coordinate on the canvas area.
     * @param {number} y - The y coordinate on the canvas area.
     * @returns {boolean} True if the specified point is inside the game canvas area.
     */
    static isInsideCanvas(x: number, y: number): boolean;
    /**
     * Shows the game screen.
     *
     * @returns {void}
     */
    static showScreen(): void;
    /**
     * Hides the game screen.
     *
     * @returns {void}
     */
    static hideScreen(): void;
    /**
     * Changes the size of the game screen.
     *
     * @param {number} width - The width of the game screen.
     * @param {number} height - The height of the game screen.
     * @returns {void}
     */
    static resize(width: number, height: number): void;
    /** @param {number} value */
    static set width(value: number);
    /**
     * The width of the game screen.
     *
     * @name Graphics.width
     * @type {number}
     */
    static get width(): number;
    /** @param {number} value */
    static set height(value: number);
    /**
     * The height of the game screen.
     *
     * @name Graphics.height
     * @type {number}
     */
    static get height(): number;
    /** @param {number} value */
    static set defaultScale(value: number);
    /**
     * The default zoom scale of the game screen.
     *
     * @name Graphics.defaultScale
     * @type {number}
     */
    static get defaultScale(): number;
    /** @returns {void} */
    static _createAllElements(): void;
    /** @returns {void} */
    static _updateAllElements(): void;
    /**
     * @param {import("pixi.js").Ticker} ticker
     * @returns {void}
     */
    static _onTick(ticker: import("pixi.js").Ticker): void;
    /** @returns {boolean} */
    static _canRender(): boolean;
    /** @returns {void} */
    static _updateRealScale(): void;
    /** @returns {number} */
    static _stretchWidth(): number;
    /** @returns {number} */
    static _stretchHeight(): number;
    /**
     * @param {string} [name]
     * @param {string} [message]
     * @returns {string}
     */
    static _makeErrorHtml(name?: string, message?: string): string;
    /** @returns {boolean} */
    static _defaultStretchMode(): boolean;
    /** @returns {void} */
    static _createErrorPrinter(): void;
    /** @returns {void} */
    static _updateErrorPrinter(): void;
    /** @returns {void} */
    static _createCanvas(): void;
    /** @returns {void} */
    static _updateCanvas(): void;
    /** @returns {void} */
    static _updateVideo(): void;
    /** @returns {void} */
    static _createLoadingSpinner(): void;
    /** @returns {void} */
    static _createFPSCounter(): void;
    /**
     * @param {HTMLCanvasElement} element
     * @returns {void}
     */
    static _centerElement(element: HTMLCanvasElement): void;
    /** @returns {void} */
    static _disableContextMenu(): void;
    /** @returns {void} */
    static _applyCanvasFilter(): void;
    /** @returns {void} */
    static _clearCanvasFilter(): void;
    /** @returns {void} */
    static _setupEventHandlers(): void;
    /** @returns {void} */
    static _onWindowResize(): void;
    /**
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    static _onKeyDown(event: KeyboardEvent): void;
    /** @returns {void} */
    static _switchFPSCounter(): void;
    /** @returns {void} */
    static _switchStretchMode(): void;
    /** @returns {void} */
    static _switchFullScreen(): void;
    /** @returns {boolean} */
    static _isFullScreen(): boolean;
    /** @returns {void} */
    static _requestFullScreen(): void;
    /** @returns {void} */
    static _cancelFullScreen(): void;
    /** @returns {Promise<void>} */
    static _createPixiApp(): Promise<void>;
    /** @returns {void} */
    static _createEffekseerContext(): void;
}
declare namespace Graphics {
    export let _width: any;
    export let _height: any;
    export let _defaultScale: any;
    export let _realScale: any;
    export let _errorPrinter: HTMLDivElement | null | undefined;
    export let _tickHandler: ((deltaTime: number) => void) | null | undefined;
    export let _canvas: HTMLCanvasElement | null | undefined;
    export let _fpsCounter: Graphics.FPSCounter | null | undefined;
    export let _loadingSpinner: HTMLDivElement | null | undefined;
    export let _stretchEnabled: any;
    export let _app: import("pixi.js").Application<import("pixi.js").Renderer> | null | undefined;
    export let _effekseer: effekseer.EffekseerContext | null | undefined;
    export let _wasLoading: boolean | undefined;
    export let frameCount: number | undefined;
    export let boxWidth: number | undefined;
    export let boxHeight: number | undefined;
}
declare const Point_base: typeof import("pixi.js").Point;
/**
 * The point class.
 *
 * @class
 * @extends PIXI.Point
 * @param {number} x - The x coordinate.
 * @param {number} y - The y coordinate.
 */
declare class Point extends Point_base {
}
declare const Rectangle_base: typeof import("pixi.js").Rectangle;
/**
 * The rectangle class.
 *
 * @class
 * @extends PIXI.Rectangle
 * @param {number} x - The x coordinate for the upper-left corner.
 * @param {number} y - The y coordinate for the upper-left corner.
 * @param {number} width - The width of the rectangle.
 * @param {number} height - The height of the rectangle.
 */
declare class Rectangle extends Rectangle_base {
    /**
     * @param {number} [x]
     * @param {number} [y]
     * @param {number} [width]
     * @param {number} [height]
     */
    constructor(x?: number, y?: number, width?: number, height?: number);
}
/**
 * The basic object that represents an image.
 *
 * @class
 * @param {number} width - The width of the bitmap.
 * @param {number} height - The height of the bitmap.
 */
declare class Bitmap {
    /**
     * Loads a image file.
     *
     * @param {string} url - The image url of the texture.
     * @returns {Bitmap} The new bitmap object.
     */
    static load(url: string): Bitmap;
    /**
     * Takes a snapshot of the game screen.
     *
     * @param {Stage} stage - The stage object.
     * @returns {Bitmap} The new bitmap object.
     */
    static snap(stage: Stage): Bitmap;
    /** @param {[width?: number, height?: number]} args */
    constructor(width?: number | undefined, height?: number | undefined);
    /**
     * @param {number} [width]
     * @param {number} [height]
     */
    initialize(width?: number, height?: number): void;
    /** @type {HTMLCanvasElement | null} */
    _canvas: HTMLCanvasElement | null | undefined;
    /** @type {CanvasRenderingContext2D | null} */
    _context: CanvasRenderingContext2D | null | undefined;
    _textureSource: import("pixi.js").ImageSource | null | undefined;
    /** @type {HTMLImageElement | null} */
    _image: HTMLImageElement | null | undefined;
    /** @type {string} */
    _url: string | undefined;
    /** @type {number} */
    _paintOpacity: number | undefined;
    /** @type {boolean} */
    _smooth: boolean | undefined;
    /** @type {Array<(bitmap: Bitmap) => void>} */
    _loadListeners: ((bitmap: Bitmap) => void)[] | undefined;
    /** @type {string} */
    _loadingState: string | undefined;
    /**
     * The face name of the font.
     *
     * @type {string}
     */
    fontFace: string | undefined;
    /**
     * The size of the font in pixels.
     *
     * @type {number}
     */
    fontSize: number | undefined;
    /**
     * Whether the font is bold.
     *
     * @type {boolean}
     */
    fontBold: boolean | undefined;
    /**
     * Whether the font is italic.
     *
     * @type {boolean}
     */
    fontItalic: boolean | undefined;
    /**
     * The color of the text in CSS format.
     *
     * @type {string}
     */
    textColor: string | undefined;
    /**
     * The color of the outline of the text in CSS format.
     *
     * @type {string}
     */
    outlineColor: string | undefined;
    /**
     * The width of the outline of the text.
     *
     * @type {number}
     */
    outlineWidth: number | undefined;
    /**
     * Checks whether the bitmap is ready to render.
     *
     * @returns {boolean} True if the bitmap is ready to render.
     */
    isReady(): boolean;
    /**
     * Checks whether a loading error has occurred.
     *
     * @returns {boolean} True if a loading error has occurred.
     */
    isError(): boolean;
    /**
     * The url of the image file.
     *
     * @name Bitmap#url
     * @type {string}
     */
    get url(): string;
    /**
     * The PixiJS texture source that holds the bitmap image.
     *
     * @type {import("pixi.js").TextureSource}
     * @name Bitmap#textureSource
     */
    get textureSource(): import("pixi.js").TextureSource;
    /**
     * The bitmap image.
     *
     * @name Bitmap#image
     * @type {HTMLImageElement | null}
     */
    get image(): HTMLImageElement | null;
    /**
     * The bitmap canvas.
     *
     * @name Bitmap#canvas
     * @type {HTMLCanvasElement}
     */
    get canvas(): HTMLCanvasElement;
    /**
     * The 2d context of the bitmap canvas.
     *
     * @name Bitmap#context
     * @type {CanvasRenderingContext2D}
     */
    get context(): CanvasRenderingContext2D;
    /**
     * The width of the bitmap.
     *
     * @name Bitmap#width
     * @type {number}
     */
    get width(): number;
    /**
     * The height of the bitmap.
     *
     * @name Bitmap#height
     * @type {number}
     */
    get height(): number;
    /**
     * The rectangle of the bitmap.
     *
     * @name Bitmap#rect
     * @type {Rectangle}
     */
    get rect(): Rectangle;
    /** @param {boolean} value */
    set smooth(value: boolean);
    /**
     * Whether the smooth scaling is applied.
     *
     * @name Bitmap#smooth
     * @type {boolean}
     */
    get smooth(): boolean;
    /** @param {number} value */
    set paintOpacity(value: number);
    /**
     * The opacity of the drawing object in the range (0, 255).
     *
     * @name Bitmap#paintOpacity
     * @type {number}
     */
    get paintOpacity(): number;
    /**
     * Destroys the bitmap.
     *
     * @returns {void}
     */
    destroy(): void;
    /**
     * Resizes the bitmap.
     *
     * @param {number} width - The new width of the bitmap.
     * @param {number} height - The new height of the bitmap.
     * @returns {void}
     */
    resize(width: number, height: number): void;
    /**
     * Performs a block transfer.
     *
     * @param {Bitmap} source - The bitmap to draw.
     * @param {number} sx - The x coordinate in the source.
     * @param {number} sy - The y coordinate in the source.
     * @param {number} sw - The width of the source image.
     * @param {number} sh - The height of the source image.
     * @param {number} dx - The x coordinate in the destination.
     * @param {number} dy - The y coordinate in the destination.
     * @param {number} [dw] The width to draw the image in the destination.
     * @param {number} [dh] The height to draw the image in the destination.
     * @returns {void}
     */
    blt(source: Bitmap, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw?: number, dh?: number): void;
    /**
     * Returns pixel color at the specified point.
     *
     * @param {number} x - The x coordinate of the pixel in the bitmap.
     * @param {number} y - The y coordinate of the pixel in the bitmap.
     * @returns {string} The pixel color (hex format).
     */
    getPixel(x: number, y: number): string;
    /**
     * Returns alpha pixel value at the specified point.
     *
     * @param {number} x - The x coordinate of the pixel in the bitmap.
     * @param {number} y - The y coordinate of the pixel in the bitmap.
     * @returns {number} The alpha value.
     */
    getAlphaPixel(x: number, y: number): number;
    /**
     * Clears the specified rectangle.
     *
     * @param {number} x - The x coordinate for the upper-left corner.
     * @param {number} y - The y coordinate for the upper-left corner.
     * @param {number} width - The width of the rectangle to clear.
     * @param {number} height - The height of the rectangle to clear.
     * @returns {void}
     */
    clearRect(x: number, y: number, width: number, height: number): void;
    /**
     * Clears the entire bitmap.
     *
     * @returns {void}
     */
    clear(): void;
    /**
     * Fills the specified rectangle.
     *
     * @param {number} x - The x coordinate for the upper-left corner.
     * @param {number} y - The y coordinate for the upper-left corner.
     * @param {number} width - The width of the rectangle to fill.
     * @param {number} height - The height of the rectangle to fill.
     * @param {string} color - The color of the rectangle in CSS format.
     * @returns {void}
     */
    fillRect(x: number, y: number, width: number, height: number, color: string): void;
    /**
     * Fills the entire bitmap.
     *
     * @param {string} color - The color of the rectangle in CSS format.
     * @returns {void}
     */
    fillAll(color: string): void;
    /**
     * Draws the specified rectangular frame.
     *
     * @param {number} x - The x coordinate for the upper-left corner.
     * @param {number} y - The y coordinate for the upper-left corner.
     * @param {number} width - The width of the rectangle to fill.
     * @param {number} height - The height of the rectangle to fill.
     * @param {string} color - The color of the rectangle in CSS format.
     * @returns {void}
     */
    strokeRect(x: number, y: number, width: number, height: number, color: string): void;
    /**
     * Draws the rectangle with a gradation.
     *
     * @param {number} x - The x coordinate for the upper-left corner.
     * @param {number} y - The y coordinate for the upper-left corner.
     * @param {number} width - The width of the rectangle to fill.
     * @param {number} height - The height of the rectangle to fill.
     * @param {string} color1 - The gradient starting color.
     * @param {string} color2 - The gradient ending color.
     * @param {boolean} [vertical] - Whether the gradient should be draw as vertical or not.
     * @returns {void}
     */
    gradientFillRect(x: number, y: number, width: number, height: number, color1: string, color2: string, vertical?: boolean): void;
    /**
     * Draws a bitmap in the shape of a circle.
     *
     * @param {number} x - The x coordinate based on the circle center.
     * @param {number} y - The y coordinate based on the circle center.
     * @param {number} radius - The radius of the circle.
     * @param {string} color - The color of the circle in CSS format.
     * @returns {void}
     */
    drawCircle(x: number, y: number, radius: number, color: string): void;
    /**
     * Draws the outline text to the bitmap.
     *
     * @param {string} text - The text that will be drawn.
     * @param {number} x - The x coordinate for the left of the text.
     * @param {number} y - The y coordinate for the top of the text.
     * @param {number} maxWidth - The maximum allowed width of the text.
     * @param {number} lineHeight - The height of the text line.
     * @param {CanvasTextAlign} [align] - The alignment of the text.
     * @returns {void}
     */
    drawText(text: string, x: number, y: number, maxWidth: number, lineHeight: number, align?: CanvasTextAlign): void;
    /**
     * Returns the width of the specified text.
     *
     * @param {string} text - The text to be measured.
     * @returns {number} The width of the text in pixels.
     */
    measureTextWidth(text: string): number;
    /**
     * Adds a callback function that will be called when the bitmap is loaded.
     *
     * @param {(bitmap: Bitmap) => void} listner - The callback function.
     * @returns {void}
     */
    addLoadListener(listner: (bitmap: Bitmap) => void): void;
    /**
     * Tries to load the image again.
     *
     * @returns {void}
     */
    retry(): void;
    /** @returns {string} */
    _makeFontNameText(): string;
    /**
     * @param {string} text
     * @param {number} tx
     * @param {number} ty
     * @param {number} maxWidth
     * @returns {void}
     */
    _drawTextOutline(text: string, tx: number, ty: number, maxWidth: number): void;
    /**
     * @param {string} text
     * @param {number} tx
     * @param {number} ty
     * @param {number} maxWidth
     * @returns {void}
     */
    _drawTextBody(text: string, tx: number, ty: number, maxWidth: number): void;
    /**
     * @param {number} width
     * @param {number} height
     * @returns {void}
     */
    _createCanvas(width: number, height: number): void;
    /** @returns {void} */
    _ensureCanvas(): void;
    /** @returns {void} */
    _destroyCanvas(): void;
    /**
     * @param {HTMLCanvasElement | HTMLImageElement} resource
     * @returns {void}
     */
    _createTextureSource(resource: HTMLCanvasElement | HTMLImageElement): void;
    /** @returns {void} */
    _updateScaleMode(): void;
    /** @returns {void} */
    _startLoading(): void;
    /** @returns {void} */
    _startDecrypting(): void;
    /**
     * @param {XMLHttpRequest} xhr
     * @returns {void}
     */
    _onXhrLoad(xhr: XMLHttpRequest): void;
    /** @returns {void} */
    _onLoad(): void;
    /** @returns {void} */
    _callLoadListeners(): void;
    /** @returns {void} */
    _onError(): void;
}
declare const Sprite_base: typeof import("pixi.js").Sprite;
/**
 * The basic object that is rendered to the game screen.
 *
 * @class
 * @extends PIXI.Sprite
 * @param {Bitmap} bitmap - The image for the sprite.
 */
declare class Sprite extends Sprite_base {
    /** @type {number} */
    static _counter: number;
    static _blendModes: string[];
    /** @param {[bitmap?: Bitmap]} args */
    constructor(bitmap?: Bitmap | undefined);
    /** @param {Bitmap} [bitmap] */
    initialize(bitmap?: Bitmap): void;
    /** @type {number} */
    spriteId: number | undefined;
    /** @type {Bitmap} */
    _bitmap: Bitmap | undefined;
    /** @type {Rectangle} */
    _frame: Rectangle | undefined;
    /** @type {number} */
    _hue: number | undefined;
    /** @type {RMMZ.Color} */
    _blendColor: RMMZ.Color | undefined;
    /** @type {RMMZ.Color} */
    _colorTone: RMMZ.Color | undefined;
    /** @type {ColorFilter | null} */
    _colorFilter: ColorFilter | null | undefined;
    /** @type {boolean} */
    _hidden: boolean | undefined;
    /** @param {Bitmap} value */
    set bitmap(value: Bitmap);
    /**
     * The image for the sprite.
     *
     * @name Sprite#bitmap
     * @type {Bitmap}
     */
    get bitmap(): Bitmap;
    /** @param {number} value */
    set opacity(value: number);
    /**
     * The opacity of the sprite (0 to 255).
     *
     * @name Sprite#opacity
     * @type {number}
     */
    get opacity(): number;
    /**
     * Destroys the sprite.
     *
     * @returns {void}
     */
    destroy(): void;
    /**
     * Updates the sprite for each frame.
     *
     * @returns {void}
     */
    update(): void;
    /**
     * Makes the sprite "hidden".
     *
     * @returns {void}
     */
    hide(): void;
    /**
     * Releases the "hidden" state of the sprite.
     *
     * @returns {void}
     */
    show(): void;
    /**
     * Reflects the "hidden" state of the sprite to the visible state.
     *
     * @returns {void}
     */
    updateVisibility(): void;
    /**
     * Sets the x and y at once.
     *
     * @param {number} x - The x coordinate of the sprite.
     * @param {number} y - The y coordinate of the sprite.
     * @returns {void}
     */
    move(x: number, y: number): void;
    /**
     * Sets the rectagle of the bitmap that the sprite displays.
     *
     * @param {number} x - The x coordinate of the frame.
     * @param {number} y - The y coordinate of the frame.
     * @param {number} width - The width of the frame.
     * @param {number} height - The height of the frame.
     * @returns {void}
     */
    setFrame(x: number, y: number, width: number, height: number): void;
    _refreshFrame: boolean | undefined;
    /**
     * Sets the hue rotation value.
     *
     * @param {number} hue - The hue value (-360, 360).
     * @returns {void}
     */
    setHue(hue: number): void;
    /**
     * Gets the blend color for the sprite.
     *
     * @returns {[ number, number, number, number ]} The blend color [r, g, b, a].
     */
    getBlendColor(): [number, number, number, number];
    /**
     * Sets the blend color for the sprite.
     *
     * @param {RMMZ.Color} color - The blend color [r, g, b, a].
     * @returns {void}
     */
    setBlendColor(color: RMMZ.Color): void;
    /**
     * Gets the color tone for the sprite.
     *
     * @returns {[ number, number, number, number ]} The color tone [r, g, b, gray].
     */
    getColorTone(): [number, number, number, number];
    /**
     * Sets the color tone for the sprite.
     *
     * @param {RMMZ.Color} tone - The color tone [r, g, b, gray].
     * @returns {void}
     */
    setColorTone(tone: RMMZ.Color): void;
    /** @returns {void} */
    _onBitmapChange(): void;
    /**
     * @param {Bitmap} bitmapLoaded
     * @returns {void}
     */
    _onBitmapLoad(bitmapLoaded: Bitmap): void;
    /** @returns {void} */
    _refresh(): void;
    /** @returns {void} */
    _createColorFilter(): void;
    /** @returns {void} */
    _updateColorFilter(): void;
}
declare const Tilemap_base: typeof import("pixi.js").Container;
/**
 * The tilemap which displays 2D tile-based game map.
 *
 * Child z coordinates, from back to front:
 * - 0: Lower tiles
 * - 1: Lower characters
 * - 3: Normal characters
 * - 4: Upper tiles
 * - 5: Upper characters
 * - 6: Airship shadow
 * - 7: Balloon
 * - 8: Animation
 * - 9: Destination
 *
 * @class
 * @extends PIXI.Container
 */
declare class Tilemap extends Tilemap_base {
    static TILE_ID_B: number;
    static TILE_ID_C: number;
    static TILE_ID_D: number;
    static TILE_ID_E: number;
    static TILE_ID_A5: number;
    static TILE_ID_A1: number;
    static TILE_ID_A2: number;
    static TILE_ID_A3: number;
    static TILE_ID_A4: number;
    static TILE_ID_MAX: number;
    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isVisibleTile(tileId: RMMZ.TileID): boolean;
    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isAutotile(tileId: RMMZ.TileID): boolean;
    /**
     * @param {RMMZ.TileID} tileId
     * @returns {number}
     */
    static getAutotileKind(tileId: RMMZ.TileID): number;
    /**
     * @param {RMMZ.TileID} tileId
     * @returns {number}
     */
    static getAutotileShape(tileId: RMMZ.TileID): number;
    /**
     * @param {number} kind
     * @param {number} shape
     * @returns {number}
     */
    static makeAutotileId(kind: number, shape: number): number;
    /**
     * @param {number} tileID1
     * @param {number} tileID2
     * @returns {boolean}
     */
    static isSameKindTile(tileID1: number, tileID2: number): boolean;
    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isTileA1(tileId: RMMZ.TileID): boolean;
    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isTileA2(tileId: RMMZ.TileID): boolean;
    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isTileA3(tileId: RMMZ.TileID): boolean;
    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isTileA4(tileId: RMMZ.TileID): boolean;
    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isTileA5(tileId: RMMZ.TileID): boolean;
    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isWaterTile(tileId: RMMZ.TileID): boolean;
    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isWaterfallTile(tileId: RMMZ.TileID): boolean;
    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isGroundTile(tileId: RMMZ.TileID): boolean;
    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isShadowingTile(tileId: RMMZ.TileID): boolean;
    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isRoofTile(tileId: RMMZ.TileID): boolean;
    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isWallTopTile(tileId: RMMZ.TileID): boolean;
    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isWallSideTile(tileId: RMMZ.TileID): boolean;
    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isWallTile(tileId: RMMZ.TileID): boolean;
    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isFloorTypeAutotile(tileId: RMMZ.TileID): boolean;
    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isWallTypeAutotile(tileId: RMMZ.TileID): boolean;
    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isWaterfallTypeAutotile(tileId: RMMZ.TileID): boolean;
    /** @type {number[][][]} */
    static FLOOR_AUTOTILE_TABLE: number[][][];
    /** @type {number[][][]} */
    static WALL_AUTOTILE_TABLE: number[][][];
    /** @type {number[][][]} */
    static WATERFALL_AUTOTILE_TABLE: number[][][];
    constructor();
    /** @type {number} */
    _width: number;
    /** @type {number} */
    _height: number;
    /** @type {number} */
    _margin: number;
    /** @type {number} */
    _mapWidth: number;
    /** @type {number} */
    _mapHeight: number;
    /** @type {number[] | null} */
    _mapData: number[] | null;
    /** @type {Bitmap[]} */
    _bitmaps: Bitmap[];
    /**
     * The width of each tile.
     *
     * @type {number}
     */
    tileWidth: number;
    /**
     * The height of each tile.
     *
     * @type {number}
     */
    tileHeight: number;
    /**
     * The tileset flags.
     *
     * @type {any[]}
     */
    flags: any[];
    /**
     * The animation count for autotiles.
     *
     * @type {number}
     */
    animationCount: number;
    /**
     * Whether the tilemap loops horizontal.
     *
     * @type {boolean}
     */
    horizontalWrap: boolean;
    /**
     * Whether the tilemap loops vertical.
     *
     * @type {boolean}
     */
    verticalWrap: boolean;
    onRender: () => void;
    /**
     * Destroys the tilemap.
     *
     * @returns {void}
     */
    destroy(): void;
    /**
     * Sets the tilemap data.
     *
     * @param {number} width - The width of the map in number of tiles.
     * @param {number} height - The height of the map in number of tiles.
     * @param {number[]} data - The one dimensional array for the map data.
     * @returns {void}
     */
    setData(width: number, height: number, data: number[]): void;
    /**
     * Checks whether the tileset is ready to render.
     *
     * @returns {boolean} True if the tilemap is ready.
     */
    isReady(): boolean;
    /**
     * Updates the tilemap for each frame.
     *
     * @returns {void}
     */
    update(): void;
    animationFrame: number | undefined;
    /**
     * Sets the bitmaps used as a tileset.
     *
     * We wait for the images to finish loading. Creating textures
     * from bitmaps that are not yet loaded here brings some maintenance
     * difficulties. For example, PIXI overwrites img.onload internally.
     *
     * @param {Bitmap[]} bitmaps - The array of the tileset bitmaps.
     * @returns {void}
     */
    setBitmaps(bitmaps: Bitmap[]): void;
    _needsBitmapsUpdate: boolean | undefined;
    /**
     * Forces to repaint the entire tilemap.
     *
     * @returns {void}
     */
    refresh(): void;
    _needsRepaint: boolean | undefined;
    /** @returns {void} */
    _updateLayers(): void;
    _lastAnimationFrame: number | undefined;
    _lastStartX: any;
    _lastStartY: any;
    /** @returns {void} */
    _createLayers(): void;
    _tileAtlases: any[] | undefined;
    _tileShader: import("pixi.js").Shader | undefined;
    _lowerLayer: Tilemap.CombinedLayer | undefined;
    _upperLayer: Tilemap.CombinedLayer | undefined;
    /** @returns {void} */
    _updateBitmaps(): void;
    /** @returns {void} */
    _updateAtlasTextures(): void;
    /**
     * @param {number} startX
     * @param {number} startY
     * @returns {void}
     */
    _addAllSpots(startX: number, startY: number): void;
    /**
     * @param {number} startX
     * @param {number} startY
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    _addSpot(startX: number, startY: number, x: number, y: number): void;
    /**
     * @param {RMMZ.TileID} tileId
     * @param {number} dx
     * @param {number} dy
     * @returns {void}
     */
    _addSpotTile(tileId: RMMZ.TileID, dx: number, dy: number): void;
    /**
     * @param {TilemapCombinedLayer} layer
     * @param {RMMZ.TileID} tileId
     * @param {number} dx
     * @param {number} dy
     * @returns {void}
     */
    _addTile(layer: Tilemap.CombinedLayer, tileId: RMMZ.TileID, dx: number, dy: number): void;
    /**
     * @param {TilemapCombinedLayer} layer
     * @param {RMMZ.TileID} tileId
     * @param {number} dx
     * @param {number} dy
     * @returns {void}
     */
    _addNormalTile(layer: Tilemap.CombinedLayer, tileId: RMMZ.TileID, dx: number, dy: number): void;
    /**
     * @param {TilemapCombinedLayer} layer
     * @param {RMMZ.TileID} tileId
     * @param {number} dx
     * @param {number} dy
     * @returns {void}
     */
    _addAutotile(layer: Tilemap.CombinedLayer, tileId: RMMZ.TileID, dx: number, dy: number): void;
    /**
     * @param {TilemapCombinedLayer} layer
     * @param {RMMZ.TileID} tileId
     * @param {number} dx
     * @param {number} dy
     * @returns {void}
     */
    _addTableEdge(layer: Tilemap.CombinedLayer, tileId: RMMZ.TileID, dx: number, dy: number): void;
    /**
     * @param {TilemapCombinedLayer} layer
     * @param {number} shadowBits
     * @param {number} dx
     * @param {number} dy
     * @returns {void}
     */
    _addShadow(layer: Tilemap.CombinedLayer, shadowBits: number, dx: number, dy: number): void;
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {number}
     */
    _readMapData(x: number, y: number, z: number): number;
    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    _isHigherTile(tileId: RMMZ.TileID): boolean;
    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    _isTableTile(tileId: RMMZ.TileID): boolean;
    /** @returns {boolean} */
    _isOverpassPosition(): boolean;
    /** @returns {void} */
    _sortChildren(): void;
    /**
     * @param {Sprite} a
     * @param {Sprite} b
     * @returns {number}
     */
    _compareChildOrder(a: Sprite, b: Sprite): number;
}
declare namespace Tilemap {
    export function createShader(): import("pixi.js").Shader;
}
declare const TilemapLayer_base: typeof import("pixi.js").Mesh;
declare const TilemapCombinedLayer_base: typeof import("pixi.js").Container;
declare const TilingSprite_base: typeof import("pixi.js").TilingSprite;
/**
 * The sprite object for a tiling image.
 *
 * @class
 * @extends PIXI.TilingSprite
 * @param {Bitmap} bitmap - The image for the tiling sprite.
 */
declare class TilingSprite extends TilingSprite_base {
    /** @param {[bitmap?: Bitmap]} args */
    constructor(bitmap?: Bitmap | undefined);
    onRender: () => void;
    /** @param {Bitmap} [bitmap] */
    initialize(bitmap?: Bitmap): void;
    /** @type {Bitmap} */
    _bitmap: Bitmap | undefined;
    /** @type {Rectangle} */
    _frame: Rectangle | undefined;
    /** @param {Bitmap} value */
    set bitmap(value: Bitmap);
    /**
     * The image for the tiling sprite.
     *
     * @name TilingSprite#bitmap
     * @type {Bitmap}
     */
    get bitmap(): Bitmap;
    /** @param {number} value */
    set opacity(value: number);
    /**
     * The opacity of the tiling sprite (0 to 255).
     *
     * @name TilingSprite#opacity
     * @type {number}
     */
    get opacity(): number;
    /**
     * Destroys the tiling sprite.
     *
     * @returns {void}
     */
    destroy(): void;
    /**
     * Updates the tiling sprite for each frame.
     *
     * @returns {void}
     */
    update(): void;
    /**
     * Sets the x, y, width, and height all at once.
     *
     * @param {number} x - The x coordinate of the tiling sprite.
     * @param {number} y - The y coordinate of the tiling sprite.
     * @param {number} width - The width of the tiling sprite.
     * @param {number} height - The height of the tiling sprite.
     * @returns {void}
     */
    move(x: number, y: number, width: number, height: number): void;
    /**
     * Specifies the region of the image that the tiling sprite will use.
     *
     * @param {number} x - The x coordinate of the frame.
     * @param {number} y - The y coordinate of the frame.
     * @param {number} width - The width of the frame.
     * @param {number} height - The height of the frame.
     * @returns {void}
     */
    setFrame(x: number, y: number, width: number, height: number): void;
    /** @returns {void} */
    _updateTilePosition(): void;
    /** @returns {void} */
    _onBitmapChange(): void;
    /** @returns {void} */
    _refresh(): void;
}
declare const ScreenSprite_base: typeof import("pixi.js").Container;
/**
 * The sprite which covers the entire game screen.
 *
 * @class
 * @extends PIXI.Container
 */
declare class ScreenSprite extends ScreenSprite_base {
    constructor();
    /** @type {import("pixi.js").Graphics} */
    _graphics: import("pixi.js").Graphics;
    /** @param {number} value */
    set opacity(value: number);
    /**
     * The opacity of the sprite (0 to 255).
     *
     * @name ScreenSprite#opacity
     * @type {number}
     */
    get opacity(): number;
    /** @type {number} */
    _red: number;
    /** @type {number} */
    _green: number;
    /** @type {number} */
    _blue: number;
    /**
     * Destroys the screen sprite.
     *
     * @returns {void}
     */
    destroy(): void;
    /**
     * Sets black to the color of the screen sprite.
     *
     * @returns {void}
     */
    setBlack(): void;
    /**
     * Sets white to the color of the screen sprite.
     *
     * @returns {void}
     */
    setWhite(): void;
    /**
     * Sets the color of the screen sprite by values.
     *
     * @param {number} r - The red value in the range (0, 255).
     * @param {number} g - The green value in the range (0, 255).
     * @param {number} b - The blue value in the range (0, 255).
     * @returns {void}
     */
    setColor(r: number, g: number, b: number): void;
}
declare const RmmzWindow_base: typeof import("pixi.js").Container;
declare const WindowLayer_base: typeof import("pixi.js").Container;
/**
 * The layer which contains game windows.
 *
 * @class
 * @extends PIXI.Container
 */
declare class WindowLayer extends WindowLayer_base {
    /**
     * @param {import("pixi.js").Rectangle} rect
     * @param {import("pixi.js").Rectangle} occluder
     * @returns {import("pixi.js").Rectangle[]}
     */
    static subtractRect(rect: import("pixi.js").Rectangle, occluder: import("pixi.js").Rectangle): import("pixi.js").Rectangle[];
    constructor();
    _windowLayout: any[];
    onRender: () => void;
    /** @param {RMMZ.Window} window */
    addWindow(window: RMMZ.Window): RMMZ.Window;
    /**
     * Updates the window layer for each frame.
     *
     * @returns {void}
     */
    update(): void;
    /** @returns {void} */
    _updateWindowMasks(): void;
    /**
     * @param {RMMZ.Window} window
     * @param {import("pixi.js").Rectangle} bounds
     * @param {import("pixi.js").Rectangle[]} occluders
     */
    _applyWindowMask(window: RMMZ.Window, bounds: import("pixi.js").Rectangle, occluders: import("pixi.js").Rectangle[]): void;
}
declare const Weather_base: typeof import("pixi.js").Container;
/**
 * The weather effect which displays rain, storm, or snow.
 *
 * @class
 * @extends PIXI.Container
 */
declare class Weather extends Weather_base {
    constructor();
    /** @type {number} */
    _width: number;
    /** @type {number} */
    _height: number;
    /** @type {Array<Sprite & { ax: number; ay: number; }>} */
    _sprites: Array<Sprite & {
        ax: number;
        ay: number;
    }>;
    /**
     * The type of the weather in ["none", "rain", "storm", "snow"].
     *
     * @type {string}
     */
    type: string;
    /**
     * The power of the weather in the range (0, 9).
     *
     * @type {number}
     */
    power: number;
    /**
     * Destroys the weather.
     *
     * @returns {void}
     */
    destroy(): void;
    /**
     * Updates the weather for each frame.
     *
     * @returns {void}
     */
    update(): void;
    /** @returns {void} */
    _createBitmaps(): void;
    _rainBitmap: Bitmap | undefined;
    _stormBitmap: Bitmap | undefined;
    _snowBitmap: Bitmap | undefined;
    /** @returns {void} */
    _createDimmer(): void;
    _dimmerSprite: ScreenSprite | undefined;
    /** @returns {void} */
    _updateDimmer(): void;
    /** @returns {void} */
    _updateAllSprites(): void;
    /** @returns {void} */
    _addSprite(): void;
    /** @returns {void} */
    _removeSprite(): void;
    /**
     * @param {Sprite & { ax: number; ay: number; }} sprite
     * @returns {void}
     */
    _updateSprite(sprite: Sprite & {
        ax: number;
        ay: number;
    }): void;
    /**
     * @param {Sprite & { ax: number; ay: number; }} sprite
     * @returns {void}
     */
    _updateRainSprite(sprite: Sprite & {
        ax: number;
        ay: number;
    }): void;
    /**
     * @param {Sprite & { ax: number; ay: number; }} sprite
     * @returns {void}
     */
    _updateStormSprite(sprite: Sprite & {
        ax: number;
        ay: number;
    }): void;
    /**
     * @param {Sprite & { ax: number; ay: number; }} sprite
     * @returns {void}
     */
    _updateSnowSprite(sprite: Sprite & {
        ax: number;
        ay: number;
    }): void;
    /**
     * @param {Sprite & { ax: number; ay: number; }} sprite
     * @returns {void}
     */
    _rebornSprite(sprite: Sprite & {
        ax: number;
        ay: number;
    }): void;
}
declare const ColorFilter_base: typeof import("pixi.js").Filter;
/**
 * The color filter for WebGL.
 *
 * @class
 * @extends PIXI.Filter
 */
declare class ColorFilter extends ColorFilter_base {
    /** @returns {string} */
    static _fragmentSrc(): string;
    constructor();
    uniforms: any;
    /**
     * Sets the hue rotation value.
     *
     * @param {number} hue - The hue value (-360, 360).
     * @returns {void}
     */
    setHue(hue: number): void;
    /**
     * Sets the color tone.
     *
     * @param {RMMZ.Color} tone - The color tone [r, g, b, gray].
     * @returns {void}
     */
    setColorTone(tone: RMMZ.Color): void;
    /**
     * Sets the blend color.
     *
     * @param {RMMZ.Color} color - The blend color [r, g, b, a].
     * @returns {void}
     */
    setBlendColor(color: RMMZ.Color): void;
    /**
     * Sets the brightness.
     *
     * @param {number} brightness - The brightness (0 to 255).
     * @returns {void}
     */
    setBrightness(brightness: number): void;
}
declare const Stage_base: typeof import("pixi.js").Container;
/**
 * The root object of the display tree.
 *
 * @class
 * @extends PIXI.Container
 */
declare class Stage extends Stage_base {
    /** @param {[]} args */
    constructor();
    initialize(): void;
    /**
     * Destroys the stage.
     *
     * @returns {void}
     */
    destroy(): void;
}
/**
 * The audio object of Web Audio API.
 *
 * @class
 * @param {string} url - The url of the audio file.
 */
declare class WebAudio {
    /**
     * Initializes the audio system.
     *
     * @returns {boolean} True if the audio system is available.
     */
    static initialize(): boolean;
    /**
     * Sets the master volume for all audio.
     *
     * @param {number} value - The master volume (0 to 1).
     * @returns {void}
     */
    static setMasterVolume(value: number): void;
    /** @returns {void} */
    static _createContext(): void;
    /** @returns {number} */
    static _currentTime(): number;
    /** @returns {void} */
    static _createMasterGainNode(): void;
    /** @returns {void} */
    static _setupEventHandlers(): void;
    /** @returns {void} */
    static _onUserGesture(): void;
    /** @returns {void} */
    static _onVisibilityChange(): void;
    /** @returns {void} */
    static _onHide(): void;
    /** @returns {void} */
    static _onShow(): void;
    /** @returns {boolean} */
    static _shouldMuteOnHide(): boolean;
    /** @returns {void} */
    static _resetVolume(): void;
    /**
     * @param {number} duration
     * @returns {void}
     */
    static _fadeIn(duration: number): void;
    /**
     * @param {number} duration
     * @returns {void}
     */
    static _fadeOut(duration: number): void;
    /** @param {[url: string]} args */
    constructor(url: string);
    /** @param {string} url */
    initialize(url: string): void;
    /** @type {string} */
    _url: string | undefined;
    /**
     * Clears the audio data.
     *
     * @returns {void}
     */
    clear(): void;
    _data: any;
    _fetchedSize: number | undefined;
    _fetchedData: any[] | undefined;
    _buffers: any[] | undefined;
    _sourceNodes: any[] | undefined;
    _gainNode: GainNode | null | undefined;
    _pannerNode: PannerNode | null | undefined;
    _totalTime: number | undefined;
    _sampleRate: number | undefined;
    _loop: number | boolean | undefined;
    _loopStart: number | undefined;
    _loopLength: number | undefined;
    _loopStartTime: number | undefined;
    _loopLengthTime: number | undefined;
    _startTime: number | undefined;
    _volume: number | undefined;
    _pitch: any;
    _pan: number | undefined;
    _endTimer: number | null | undefined;
    _loadListeners: any[] | undefined;
    _stopListeners: any[] | undefined;
    _lastUpdateTime: number | undefined;
    _isLoaded: boolean | undefined;
    _isError: boolean | undefined;
    _isPlaying: boolean | undefined;
    _decoder: VorbisDecoder | null | undefined;
    /**
     * The url of the audio file.
     *
     * @name WebAudio#url
     * @type {string}
     */
    get url(): string;
    /** @param {number} value */
    set volume(value: number);
    /**
     * The volume of the audio.
     *
     * @name WebAudio#volume
     * @type {number}
     */
    get volume(): number;
    /** @param {number} value */
    set pitch(value: number);
    /**
     * The pitch of the audio.
     *
     * @name WebAudio#pitch
     * @type {number}
     */
    get pitch(): number;
    /** @param {number} value */
    set pan(value: number);
    /**
     * The pan of the audio.
     *
     * @name WebAudio#pan
     * @type {number}
     */
    get pan(): number;
    /**
     * Checks whether the audio data is ready to play.
     *
     * @returns {boolean} True if the audio data is ready to play.
     */
    isReady(): boolean;
    /**
     * Checks whether a loading error has occurred.
     *
     * @returns {boolean} True if a loading error has occurred.
     */
    isError(): boolean;
    /**
     * Checks whether the audio is playing.
     *
     * @returns {boolean} True if the audio is playing.
     */
    isPlaying(): boolean;
    /**
     * Plays the audio.
     *
     * @param {boolean} loop - Whether the audio data play in a loop.
     * @param {number} [offset] - The start position to play in seconds.
     * @returns {void}
     */
    play(loop: boolean, offset?: number): void;
    /**
     * Stops the audio.
     *
     * @returns {void}
     */
    stop(): void;
    /**
     * Destroys the audio.
     *
     * @returns {void}
     */
    destroy(): void;
    /**
     * Performs the audio fade-in.
     *
     * @param {number} duration - Fade-in time in seconds.
     * @returns {void}
     */
    fadeIn(duration: number): void;
    /**
     * Performs the audio fade-out.
     *
     * @param {number} duration - Fade-out time in seconds.
     * @returns {void}
     */
    fadeOut(duration: number): void;
    /**
     * Gets the seek position of the audio.
     *
     * @returns {number}
     */
    seek(): number;
    /**
     * Adds a callback function that will be called when the audio data is loaded.
     *
     * @param {() => void} listner - The callback function.
     * @returns {void}
     */
    addLoadListener(listner: () => void): void;
    /**
     * Adds a callback function that will be called when the playback is stopped.
     *
     * @param {() => void} listner - The callback function.
     * @returns {void}
     */
    addStopListener(listner: () => void): void;
    /**
     * Tries to load the audio again.
     *
     * @returns {void}
     */
    retry(): void;
    /** @returns {void} */
    _startLoading(): void;
    /** @returns {boolean} */
    _shouldUseDecoder(): boolean;
    /** @returns {void} */
    _createDecoder(): void;
    /** @returns {void} */
    _destroyDecoder(): void;
    /** @returns {string} */
    _realUrl(): string;
    /**
     * @param {string} url
     * @returns {void}
     */
    _startXhrLoading(url: string): void;
    /**
     * @param {string} url
     * @returns {void}
     */
    _startFetching(url: string): void;
    /**
     * @param {XMLHttpRequest} xhr
     * @returns {void}
     */
    _onXhrLoad(xhr: XMLHttpRequest): void;
    /**
     * @param {Response} response
     * @returns {void}
     */
    _onFetch(response: Response): void;
    /** @returns {void} */
    _onError(): void;
    /**
     * @param {Uint8Array} value
     * @returns {void}
     */
    _onFetchProcess(value: Uint8Array): void;
    /** @returns {void} */
    _updateBufferOnFetch(): void;
    /** @returns {void} */
    _concatenateFetchedData(): void;
    /** @returns {void} */
    _updateBuffer(): void;
    /** @returns {ArrayBufferLike} */
    _readableBuffer(): ArrayBufferLike;
    /**
     * @param {ArrayBuffer} arrayBuffer
     * @returns {void}
     */
    _decodeAudioData(arrayBuffer: ArrayBuffer): void;
    /**
     * @param {AudioBuffer} buffer
     * @returns {void}
     */
    _onDecode(buffer: AudioBuffer): void;
    /** @returns {void} */
    _refreshSourceNode(): void;
    /**
     * @param {number} offset
     * @returns {void}
     */
    _startPlaying(offset: number): void;
    /** @returns {void} */
    _startAllSourceNodes(): void;
    /**
     * @param {number} index
     * @returns {void}
     */
    _startSourceNode(index: number): void;
    /** @returns {void} */
    _stopSourceNode(): void;
    /** @returns {void} */
    _createPannerNode(): void;
    /** @returns {void} */
    _createGainNode(): void;
    /** @returns {void} */
    _createAllSourceNodes(): void;
    /**
     * @param {number} index
     * @returns {void}
     */
    _createSourceNode(index: number): void;
    /** @returns {void} */
    _removeNodes(): void;
    /** @returns {void} */
    _createEndTimer(): void;
    /** @returns {void} */
    _removeEndTimer(): void;
    /** @returns {void} */
    _updatePanner(): void;
    /** @returns {void} */
    _onLoad(): void;
    /**
     * @param {ArrayBuffer} arrayBuffer
     * @returns {void}
     */
    _readLoopComments(arrayBuffer: ArrayBuffer): void;
    /**
     * @param {DataView} view
     * @param {number} index
     * @param {number} size
     * @returns {void}
     */
    _readMetaData(view: DataView, index: number, size: number): void;
    /**
     * @param {DataView} view
     * @param {number} index
     * @returns {string}
     */
    _readFourCharacters(view: DataView, index: number): string;
}
/**
 * The static class that handles video playback.
 *
 * @namespace
 */
declare class Video {
    /**
     * Initializes the video system.
     *
     * @param {number} width - The width of the video.
     * @param {number} height - The height of the video.
     * @returns {void}
     */
    static initialize(width: number, height: number): void;
    /**
     * Changes the display size of the video.
     *
     * @param {number} width - The width of the video.
     * @param {number} height - The height of the video.
     * @returns {void}
     */
    static resize(width: number, height: number): void;
    /**
     * Starts playback of a video.
     *
     * @param {string} src - The url of the video.
     * @returns {void}
     */
    static play(src: string): void;
    /**
     * Checks whether the video is playing.
     *
     * @returns {boolean} True if the video is playing.
     */
    static isPlaying(): boolean;
    /**
     * Sets the volume for videos.
     *
     * @param {number} volume - The volume for videos (0 to 1).
     * @returns {void}
     */
    static setVolume(volume: number): void;
    /** @returns {void} */
    static _createElement(): void;
    /** @returns {void} */
    static _onLoad(): void;
    /** @returns {void} */
    static _onError(): void;
    /** @returns {void} */
    static _onEnd(): void;
    /**
     * @param {boolean} videoVisible
     * @returns {void}
     */
    static _updateVisibility(videoVisible: boolean): void;
    /** @returns {boolean} */
    static _isVisible(): boolean;
    /** @returns {void} */
    static _setupEventHandlers(): void;
    /** @returns {void} */
    static _onUserGesture(): void;
}
/**
 * The static class that handles input data from the keyboard and gamepads.
 *
 * @namespace
 */
declare class Input {
    /**
     * Initializes the input system.
     *
     * @returns {void}
     */
    static initialize(): void;
    /**
     * The wait time of the key repeat in frames.
     *
     * @type {number}
     */
    static keyRepeatWait: number;
    /**
     * The interval of the key repeat in frames.
     *
     * @type {number}
     */
    static keyRepeatInterval: number;
    /**
     * A hash table to convert from a virtual key code to a mapped key name.
     *
     * @type {{ readonly 9: "tab"; readonly 13: "ok"; readonly 16: "shift"; readonly 17: "control"; readonly 18: "control"; readonly 27: "escape"; readonly 32: "ok"; readonly 33: "pageup"; readonly 34: "pagedown"; readonly 37: "left"; readonly 38: "up"; readonly 39: "right"; readonly 40: "down"; readonly 45: "escape"; readonly 81: "pageup"; readonly 87: "pagedown"; readonly 88: "escape"; readonly 90: "ok"; readonly 96: "escape"; readonly 98: "down"; readonly 100: "left"; readonly 102: "right"; readonly 104: "up"; readonly 120: "debug"; }}
     */
    static keyMapper: {
        readonly 9: "tab";
        readonly 13: "ok";
        readonly 16: "shift";
        readonly 17: "control";
        readonly 18: "control";
        readonly 27: "escape";
        readonly 32: "ok";
        readonly 33: "pageup";
        readonly 34: "pagedown";
        readonly 37: "left";
        readonly 38: "up";
        readonly 39: "right";
        readonly 40: "down";
        readonly 45: "escape";
        readonly 81: "pageup";
        readonly 87: "pagedown";
        readonly 88: "escape";
        readonly 90: "ok";
        readonly 96: "escape";
        readonly 98: "down";
        readonly 100: "left";
        readonly 102: "right";
        readonly 104: "up";
        readonly 120: "debug";
    };
    /**
     * A hash table to convert from a gamepad button to a mapped key name.
     *
     * @type {{ readonly 0: "ok"; readonly 1: "cancel"; readonly 2: "shift"; readonly 3: "menu"; readonly 4: "pageup"; readonly 5: "pagedown"; readonly 12: "up"; readonly 13: "down"; readonly 14: "left"; readonly 15: "right"; }}
     */
    static gamepadMapper: {
        readonly 0: "ok";
        readonly 1: "cancel";
        readonly 2: "shift";
        readonly 3: "menu";
        readonly 4: "pageup";
        readonly 5: "pagedown";
        readonly 12: "up";
        readonly 13: "down";
        readonly 14: "left";
        readonly 15: "right";
    };
    /**
     * Clears all the input data.
     *
     * @returns {void}
     */
    static clear(): void;
    /**
     * Updates the input data.
     *
     * @returns {void}
     */
    static update(): void;
    /**
     * Checks whether a key is currently pressed down.
     *
     * @param {string} keyName - The mapped name of the key.
     * @returns {boolean} True if the key is pressed.
     */
    static isPressed(keyName: string): boolean;
    /**
     * Checks whether a key is just pressed.
     *
     * @param {string} keyName - The mapped name of the key.
     * @returns {boolean} True if the key is triggered.
     */
    static isTriggered(keyName: string): boolean;
    /**
     * Checks whether a key is just pressed or a key repeat occurred.
     *
     * @param {string} keyName - The mapped name of the key.
     * @returns {boolean} True if the key is repeated.
     */
    static isRepeated(keyName: string): boolean;
    /**
     * Checks whether a key is kept depressed.
     *
     * @param {string} keyName - The mapped name of the key.
     * @returns {boolean} True if the key is long-pressed.
     */
    static isLongPressed(keyName: string): boolean;
    /**
     * The four direction value as a number of the numpad, or 0 for neutral.
     *
     * @name Input.dir4
     * @type {RMMZ.Direction}
     */
    static get dir4(): RMMZ.Direction;
    /**
     * The eight direction value as a number of the numpad, or 0 for neutral.
     *
     * @name Input.dir8
     * @type {RMMZ.Direction}
     */
    static get dir8(): RMMZ.Direction;
    /**
     * The time of the last input in milliseconds.
     *
     * @type {number}
     * @name Input.date
     */
    static get date(): number;
    /**
     * @param {string} buttonName
     * @returns {void}
     */
    static virtualClick(buttonName: string): void;
    /** @returns {void} */
    static _setupEventHandlers(): void;
    /**
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    static _onKeyDown(event: KeyboardEvent): void;
    /**
     * @param {number} keyCode
     * @returns {boolean}
     */
    static _shouldPreventDefault(keyCode: number): boolean;
    /**
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    static _onKeyUp(event: KeyboardEvent): void;
    /** @returns {void} */
    static _onLostFocus(): void;
    /** @returns {void} */
    static _pollGamepads(): void;
    /**
     * @param {Gamepad} gamepad
     * @returns {void}
     */
    static _updateGamepadState(gamepad: Gamepad): void;
    /** @returns {void} */
    static _updateDirection(): void;
    /** @returns {number} */
    static _signX(): number;
    /** @returns {number} */
    static _signY(): number;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    static _makeNumpadDirection(x: number, y: number): number;
    /**
     * @param {string} keyName
     * @returns {boolean}
     */
    static _isEscapeCompatible(keyName: string): boolean;
}
/**
 * The static class that handles input data from the mouse and touchscreen.
 *
 * @namespace
 */
declare class TouchInput {
    /**
     * Initializes the touch system.
     *
     * @returns {void}
     */
    static initialize(): void;
    /**
     * The wait time of the pseudo key repeat in frames.
     *
     * @type {number}
     */
    static keyRepeatWait: number;
    /**
     * The interval of the pseudo key repeat in frames.
     *
     * @type {number}
     */
    static keyRepeatInterval: number;
    /**
     * The threshold number of pixels to treat as moved.
     *
     * @type {number}
     */
    static moveThreshold: number;
    /**
     * Clears all the touch data.
     *
     * @returns {void}
     */
    static clear(): void;
    /**
     * Updates the touch data.
     *
     * @returns {void}
     */
    static update(): void;
    /**
     * Checks whether the mouse button or touchscreen has been pressed and
     * released at the same position.
     *
     * @returns {boolean} True if the mouse button or touchscreen is clicked.
     */
    static isClicked(): boolean;
    /**
     * Checks whether the mouse button or touchscreen is currently pressed down.
     *
     * @returns {boolean} True if the mouse button or touchscreen is pressed.
     */
    static isPressed(): boolean;
    /**
     * Checks whether the left mouse button or touchscreen is just pressed.
     *
     * @returns {boolean} True if the mouse button or touchscreen is triggered.
     */
    static isTriggered(): boolean;
    /**
     * Checks whether the left mouse button or touchscreen is just pressed
     * or a pseudo key repeat occurred.
     *
     * @returns {boolean} True if the mouse button or touchscreen is repeated.
     */
    static isRepeated(): boolean;
    /**
     * Checks whether the left mouse button or touchscreen is kept depressed.
     *
     * @returns {boolean} True if the left mouse button or touchscreen is long-pressed.
     */
    static isLongPressed(): boolean;
    /**
     * Checks whether the right mouse button is just pressed.
     *
     * @returns {boolean} True if the right mouse button is just pressed.
     */
    static isCancelled(): boolean;
    /**
     * Checks whether the mouse or a finger on the touchscreen is moved.
     *
     * @returns {boolean} True if the mouse or a finger on the touchscreen is moved.
     */
    static isMoved(): boolean;
    /**
     * Checks whether the mouse is moved without pressing a button.
     *
     * @returns {boolean} True if the mouse is hovered.
     */
    static isHovered(): boolean;
    /**
     * Checks whether the left mouse button or touchscreen is released.
     *
     * @returns {boolean} True if the mouse button or touchscreen is released.
     */
    static isReleased(): boolean;
    /**
     * The horizontal scroll amount.
     *
     * @name TouchInput.wheelX
     * @type {number}
     */
    static get wheelX(): number;
    /**
     * The vertical scroll amount.
     *
     * @name TouchInput.wheelY
     * @type {number}
     */
    static get wheelY(): number;
    /**
     * The x coordinate on the canvas area of the latest touch event.
     *
     * @name TouchInput.x
     * @type {number}
     */
    static get x(): number;
    /**
     * The y coordinate on the canvas area of the latest touch event.
     *
     * @name TouchInput.y
     * @type {number}
     */
    static get y(): number;
    /**
     * The time of the last input in milliseconds.
     *
     * @name TouchInput.date
     * @type {number}
     */
    static get date(): number;
    /** @returns {{ triggered: boolean; cancelled: boolean; moved: boolean; hovered: boolean; released: boolean; wheelX: number; wheelY: number; }} */
    static _createNewState(): {
        triggered: boolean;
        cancelled: boolean;
        moved: boolean;
        hovered: boolean;
        released: boolean;
        wheelX: number;
        wheelY: number;
    };
    /** @returns {void} */
    static _setupEventHandlers(): void;
    /**
     * @param {MouseEvent} event
     * @returns {void}
     */
    static _onMouseDown(event: MouseEvent): void;
    /**
     * @param {MouseEvent} event
     * @returns {void}
     */
    static _onLeftButtonDown(event: MouseEvent): void;
    /** @returns {void} */
    static _onMiddleButtonDown(): void;
    /**
     * @param {MouseEvent} event
     * @returns {void}
     */
    static _onRightButtonDown(event: MouseEvent): void;
    /**
     * @param {MouseEvent} event
     * @returns {void}
     */
    static _onMouseMove(event: MouseEvent): void;
    /**
     * @param {MouseEvent} event
     * @returns {void}
     */
    static _onMouseUp(event: MouseEvent): void;
    /**
     * @param {WheelEvent} event
     * @returns {void}
     */
    static _onWheel(event: WheelEvent): void;
    /**
     * @param {TouchEvent} event
     * @returns {void}
     */
    static _onTouchStart(event: TouchEvent): void;
    /**
     * @param {TouchEvent} event
     * @returns {void}
     */
    static _onTouchMove(event: TouchEvent): void;
    /**
     * @param {TouchEvent} event
     * @returns {void}
     */
    static _onTouchEnd(event: TouchEvent): void;
    /** @returns {void} */
    static _onTouchCancel(): void;
    /** @returns {void} */
    static _onLostFocus(): void;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    static _onTrigger(x: number, y: number): void;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    static _onCancel(x: number, y: number): void;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    static _onMove(x: number, y: number): void;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    static _onHover(x: number, y: number): void;
    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    static _onRelease(x: number, y: number): void;
}
/**
 * The static class that handles JSON with object information.
 *
 * @namespace
 */
declare class JsonEx {
    /**
     * The maximum depth of objects.
     *
     * @default 100
     * @type {number}
     */
    static maxDepth: number;
    /**
     * Converts an object to a JSON string with object information.
     *
     * @param {any} object - The object to be converted.
     * @returns {string} The JSON string.
     */
    static stringify(object: any): string;
    /**
     * Parses a JSON string and reconstructs the corresponding object.
     *
     * @param {string} json - The JSON string.
     * @returns {any} The reconstructed object.
     */
    static parse(json: string): any;
    /**
     * Makes a deep copy of the specified object.
     *
     * @param {any} object - The object to be copied.
     * @returns {any} The copied object.
     */
    static makeDeepCopy(object: any): any;
    /**
     * Encodes constructor names for serialization. Circular references
     * are unsupported because handling them in MV was too complicated
     * and expensive.
     *
     * @param {any} value
     * @param {number} depth
     * @returns {any}
     */
    static _encode(value: any, depth: number): any;
    /**
     * @param {any} value
     * @returns {any}
     */
    static _decode(value: any): any;
}
declare namespace Graphics {
    /**
     * This is based on Darsain's FPSMeter which is under the MIT license.
     * The original can be found at https://github.com/Darsain/fpsmeter.
     */
    class FPSCounter {
        constructor(...args: any[]);
        initialize(): void;
        _tickCount: number | undefined;
        _frameTime: number | undefined;
        _frameStart: number | undefined;
        _lastLoop: number | undefined;
        _showFps: boolean | undefined;
        fps: number | undefined;
        duration: number | undefined;
        startTick(): void;
        endTick(): void;
        switchMode(): void;
        _createElements(): void;
        _boxDiv: HTMLDivElement | undefined;
        _labelDiv: HTMLDivElement | undefined;
        _numberDiv: HTMLDivElement | undefined;
        _update(): void;
    }
}
declare namespace Tilemap {
    class Layer extends TilemapLayer_base {
        static MAX_SIZE: number;
        /** @param {import("pixi.js").Shader} shader */
        constructor(shader: import("pixi.js").Shader);
        /** @type {Array<[ number, number, number, number, number, number, number ]>} */
        _elements: Array<[number, number, number, number, number, number, number]>;
        /** @type {Float32Array} */
        _indexArray: Float32Array;
        /** @type {Float32Array} */
        _vertexArray: Float32Array;
        /** @type {boolean} */
        _needsVertexUpdate: boolean;
        onRender: () => void;
        /** @returns {void} */
        destroy(): void;
        /** @returns {void} */
        clear(): void;
        /** @returns {number} */
        size(): number;
        /**
         * @param {number} setNumber
         * @param {number} sx
         * @param {number} sy
         * @param {number} dx
         * @param {number} dy
         * @param {number} w
         * @param {number} h
         * @returns {void}
         */
        addRect(setNumber: number, sx: number, sy: number, dx: number, dy: number, w: number, h: number): void;
        /** @returns {void} */
        _updateGeometry(): void;
        /** @returns {void} */
        _updateIndexBuffer(): void;
        /** @returns {void} */
        _updateVertexBuffer(): void;
    }
    class CombinedLayer extends TilemapCombinedLayer_base {
        /** @param {import("pixi.js").Shader} shader */
        constructor(shader: import("pixi.js").Shader);
        /** @returns {void} */
        clear(): void;
        /** @returns {number} */
        size(): number;
        /**
         * @param {number} setNumber
         * @param {number} sx
         * @param {number} sy
         * @param {number} dx
         * @param {number} dy
         * @param {number} w
         * @param {number} h
         * @returns {void}
         */
        addRect(setNumber: number, sx: number, sy: number, dx: number, dy: number, w: number, h: number): void;
    }
}
declare namespace RMMZ {
    /**
     * The window in the game.
     *
     * @class
     * @extends PIXI.Container
     */
    class Window extends RmmzWindow_base {
        /** @param {[]} args */
        constructor();
        initialize(...args: never[]): void;
        /** @type {boolean} */
        _isWindow: boolean | undefined;
        /** @type {Bitmap} */
        _windowskin: Bitmap | undefined;
        /** @type {number} */
        _width: number | undefined;
        /** @type {number} */
        _height: number | undefined;
        /** @type {Rectangle} */
        _cursorRect: Rectangle | undefined;
        /** @type {number} */
        _openness: number | undefined;
        /** @type {number} */
        _animationCount: number | undefined;
        /** @type {number} */
        _padding: number | undefined;
        /** @type {number} */
        _margin: number | undefined;
        /** @type {RMMZ.Color} */
        _colorTone: RMMZ.Color | undefined;
        /** @type {import("pixi.js").ContainerChild[]} */
        _innerChildren: import("pixi.js").ContainerChild[] | undefined;
        /** @type {import("pixi.js").Container} */
        _container: import("pixi.js").Container<import("pixi.js").ContainerChild> | undefined;
        /** @type {Sprite} */
        _backSprite: Sprite | undefined;
        /** @type {Sprite} */
        _frameSprite: Sprite | undefined;
        /** @type {Sprite} */
        _contentsBackSprite: Sprite | undefined;
        /** @type {Sprite} */
        _cursorSprite: Sprite | undefined;
        /** @type {Sprite} */
        _contentsSprite: Sprite | undefined;
        /** @type {Sprite} */
        _downArrowSprite: Sprite | undefined;
        /** @type {Sprite} */
        _upArrowSprite: Sprite | undefined;
        /** @type {Sprite} */
        _pauseSignSprite: Sprite | undefined;
        /**
         * The active state for the window.
         *
         * @type {boolean}
         */
        active: boolean | undefined;
        /**
         * The visibility of the frame.
         *
         * @type {boolean}
         */
        frameVisible: boolean | undefined;
        /**
         * The visibility of the cursor.
         *
         * @type {boolean}
         */
        cursorVisible: boolean | undefined;
        /**
         * The visibility of the down scroll arrow.
         *
         * @type {boolean}
         */
        downArrowVisible: boolean | undefined;
        /**
         * The visibility of the up scroll arrow.
         *
         * @type {boolean}
         */
        upArrowVisible: boolean | undefined;
        /**
         * The visibility of the pause sign.
         *
         * @type {boolean}
         */
        pause: boolean | undefined;
        /** @param {Bitmap} value */
        set windowskin(value: Bitmap);
        /**
         * The image used as a window skin.
         *
         * @name Window#windowskin
         * @type {Bitmap}
         */
        get windowskin(): Bitmap;
        /** @param {Bitmap} value */
        set contents(value: Bitmap);
        /**
         * The bitmap used for the window contents.
         *
         * @name Window#contents
         * @type {Bitmap}
         */
        get contents(): Bitmap;
        /** @param {Bitmap} value */
        set contentsBack(value: Bitmap);
        /**
         * The bitmap used for the window contents background.
         *
         * @name Window#contentsBack
         * @type {Bitmap}
         */
        get contentsBack(): Bitmap;
        /** @param {number} value */
        set padding(value: number);
        /**
         * The size of the padding between the frame and contents.
         *
         * @name Window#padding
         * @type {number}
         */
        get padding(): number;
        /** @param {number} value */
        set margin(value: number);
        /**
         * The size of the margin for the window background.
         *
         * @name Window#margin
         * @type {number}
         */
        get margin(): number;
        /** @param {number} value */
        set opacity(value: number);
        /**
         * The opacity of the window without contents (0 to 255).
         *
         * @name Window#opacity
         * @type {number}
         */
        get opacity(): number;
        /** @param {number} value */
        set backOpacity(value: number);
        /**
         * The opacity of the window background (0 to 255).
         *
         * @name Window#backOpacity
         * @type {number}
         */
        get backOpacity(): number;
        /** @param {number} value */
        set contentsOpacity(value: number);
        /**
         * The opacity of the window contents (0 to 255).
         *
         * @name Window#contentsOpacity
         * @type {number}
         */
        get contentsOpacity(): number;
        /** @param {number} value */
        set openness(value: number);
        /**
         * The openness of the window (0 to 255).
         *
         * @name Window#openness
         * @type {number}
         */
        get openness(): number;
        /**
         * The width of the content area in pixels.
         *
         * @name Window#innerWidth
         * @type {number}
         */
        get innerWidth(): number;
        /**
         * The height of the content area in pixels.
         *
         * @name Window#innerHeight
         * @type {number}
         */
        get innerHeight(): number;
        /**
         * The rectangle of the content area.
         *
         * @name Window#innerRect
         * @type {Rectangle}
         */
        get innerRect(): Rectangle;
        /**
         * Destroys the window.
         *
         * @returns {void}
         */
        destroy(): void;
        /**
         * Updates the window for each frame.
         *
         * @returns {void}
         */
        update(): void;
        /**
         * Sets the x, y, width, and height all at once.
         *
         * @param {number} x - The x coordinate of the window.
         * @param {number} y - The y coordinate of the window.
         * @param {number} width - The width of the window.
         * @param {number} height - The height of the window.
         * @returns {void}
         */
        move(x: number, y: number, width: number, height: number): void;
        /**
         * Checks whether the window is completely open (openness == 255).
         *
         * @returns {boolean} True if the window is open.
         */
        isOpen(): boolean;
        /**
         * Checks whether the window is completely closed (openness == 0).
         *
         * @returns {boolean} True if the window is closed.
         */
        isClosed(): boolean;
        /**
         * Sets the position of the command cursor.
         *
         * @param {number} x - The x coordinate of the cursor.
         * @param {number} y - The y coordinate of the cursor.
         * @param {number} width - The width of the cursor.
         * @param {number} height - The height of the cursor.
         * @returns {void}
         */
        setCursorRect(x: number, y: number, width: number, height: number): void;
        /**
         * Moves the cursor position by the given amount.
         *
         * @param {number} x - The amount of horizontal movement.
         * @param {number} y - The amount of vertical movement.
         * @returns {void}
         */
        moveCursorBy(x: number, y: number): void;
        /**
         * Moves the inner children by the given amount.
         *
         * @param {number} x - The amount of horizontal movement.
         * @param {number} y - The amount of vertical movement.
         * @returns {void}
         */
        moveInnerChildrenBy(x: number, y: number): void;
        /**
         * Changes the color of the background.
         *
         * @param {number} r - The red value in the range (-255, 255).
         * @param {number} g - The green value in the range (-255, 255).
         * @param {number} b - The blue value in the range (-255, 255).
         * @returns {void}
         */
        setTone(r: number, g: number, b: number): void;
        /**
         * Adds a child between the background and contents.
         *
         * @param {import("pixi.js").ContainerChild} child - The child to add.
         * @returns {import("pixi.js").ContainerChild} The child that was added.
         */
        addChildToBack(child: import("pixi.js").ContainerChild): import("pixi.js").ContainerChild;
        /**
         * Adds a child to the client area.
         *
         * @param {import("pixi.js").ContainerChild} child - The child to add.
         * @returns {import("pixi.js").ContainerChild} The child that was added.
         */
        addInnerChild(child: import("pixi.js").ContainerChild): import("pixi.js").ContainerChild;
        /** @returns {void} */
        _updateWindowParts(): void;
        /** @returns {import("pixi.js").Rectangle} */
        openBounds(): import("pixi.js").Rectangle;
        /** @returns {void} */
        _createAllParts(): void;
        /** @returns {void} */
        _createContainer(): void;
        /** @returns {void} */
        _createBackSprite(): void;
        /** @returns {void} */
        _createFrameSprite(): void;
        /** @returns {void} */
        _createClientArea(): void;
        _clientArea: Sprite | undefined;
        /** @returns {void} */
        _createContentsBackSprite(): void;
        /** @returns {void} */
        _createCursorSprite(): void;
        /** @returns {void} */
        _createContentsSprite(): void;
        /** @returns {void} */
        _createArrowSprites(): void;
        /** @returns {void} */
        _createPauseSignSprites(): void;
        /** @returns {void} */
        _onWindowskinLoad(): void;
        /** @returns {void} */
        _refreshAllParts(): void;
        /** @returns {void} */
        _refreshBack(): void;
        /** @returns {void} */
        _refreshFrame(): void;
        /** @returns {void} */
        _refreshCursor(): void;
        /**
         * @param {Sprite} sprite
         * @param {Rectangle} srect
         * @param {Rectangle} drect
         * @param {number} m
         * @returns {void}
         */
        _setRectPartsGeometry(sprite: Sprite, srect: Rectangle, drect: Rectangle, m: number): void;
        /** @returns {void} */
        _refreshArrows(): void;
        /** @returns {void} */
        _refreshPauseSign(): void;
        /** @returns {void} */
        _updateClientArea(): void;
        /** @returns {void} */
        _updateFrame(): void;
        /** @returns {void} */
        _updateContentsBack(): void;
        /** @returns {void} */
        _updateCursor(): void;
        /** @returns {number} */
        _makeCursorAlpha(): number;
        /** @returns {void} */
        _updateContents(): void;
        /** @returns {void} */
        _updateArrows(): void;
        /** @returns {void} */
        _updatePauseSign(): void;
        /** @returns {void} */
        _updateFilterArea(): void;
    }
}
