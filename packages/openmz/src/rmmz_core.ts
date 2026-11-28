// rmmz_core.js v2.0.0

/**
 * This section contains some methods that will be added to the standard
 * Javascript objects.
 */

/**
 * Makes a shallow copy of the array.
 * @memberof JsExtensions
 * @returns A shallow copy of the array.
 */
Array.prototype.clone = function <T extends unknown[]>(this: T): T {
    return this.slice(0) as T;
};

Object.defineProperty(Array.prototype, "clone", {
    enumerable: false,
});

/**
 * Checks whether the array contains a given element.
 * @memberof JsExtensions
 * @param element - The element to search for.
 * @returns True if the array contains a given element.
 * @deprecated includes() should be used instead.
 */
Array.prototype.contains = function <T>(this: T[], element: T): boolean {
    return this.includes(element);
};

Object.defineProperty(Array.prototype, "contains", {
    enumerable: false,
});

/**
 * Checks whether the two arrays are the same.
 * @memberof JsExtensions
 * @param array - The array to compare to.
 * @returns True if the two arrays are the same.
 */
Array.prototype.equals = function (array: readonly unknown[]): boolean {
    if (!array || this.length !== array.length) {
        return false;
    }
    for (let i = 0; i < this.length; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
            if (!this[i].equals(array[i])) {
                return false;
            }
        } else if (this[i] !== array[i]) {
            return false;
        }
    }
    return true;
};

Object.defineProperty(Array.prototype, "equals", {
    enumerable: false,
});

/**
 * Removes a given element from the array (in place).
 * @memberof JsExtensions
 * @param element - The element to remove.
 * @returns The array after remove.
 */
Array.prototype.remove = function <T>(this: T[], element: T): T[] {
    for (;;) {
        const index = this.indexOf(element);
        if (index >= 0) {
            this.splice(index, 1);
        } else {
            return this;
        }
    }
};

Object.defineProperty(Array.prototype, "remove", {
    enumerable: false,
});

/**
 * Generates a random integer in the range (0, max-1).
 * @memberof JsExtensions
 * @param max - The upper boundary (excluded).
 * @returns A random integer.
 */
Math.randomInt = function (max: number): number {
    return Math.floor(max * Math.random());
};

/**
 * Returns a number whose value is limited to the given range.
 * @memberof JsExtensions
 * @param min - The lower boundary.
 * @param max - The upper boundary.
 * @returns A number in the range (min, max).
 */
Number.prototype.clamp = function (this: number, min: number, max: number): number {
    return Math.min(Math.max(this, min), max);
};

/**
 * Returns a modulo value which is always positive.
 * @memberof JsExtensions
 * @param n - The divisor.
 * @returns A modulo value.
 */
Number.prototype.mod = function (this: number, n: number): number {
    return ((this % n) + n) % n;
};

/**
 * Makes a number string with leading zeros.
 * @memberof JsExtensions
 * @param length - The length of the output string.
 * @returns A string with leading zeros.
 */
Number.prototype.padZero = function (length: number): string {
    return String(this).padZero(length);
};

/**
 * Checks whether the string contains a given string.
 * @memberof JsExtensions
 * @param string - The string to search for.
 * @returns True if the string contains a given string.
 * @deprecated includes() should be used instead.
 */
String.prototype.contains = function (string: string): boolean {
    return this.includes(string);
};

/**
 * Replaces %1, %2 and so on in the string to the arguments.
 * @memberof JsExtensions
 * @param args The objects to format.
 * @returns A formatted string.
 */
String.prototype.format = function (...args: unknown[]): string {
    return this.replace(/%([0-9]+)/g, (s, n) => args[Number(n) - 1] as string);
};

/**
 * Makes a number string with leading zeros.
 * @memberof JsExtensions
 * @param length - The length of the output string.
 * @returns A string with leading zeros.
 */
String.prototype.padZero = function (length: number): string {
    return this.padStart(length, "0");
};

/**
 * The static class that defines utility methods.
 */
class Utils {
    declare static _audioElement: HTMLAudioElement;
    declare static _videoElement: HTMLVideoElement;

    declare static _hasEncryptedImages: boolean;
    declare static _hasEncryptedAudio: boolean;
    declare static _encryptionKey: string;

    constructor() {
        throw new Error("This is a static class");
    }

    /**
     * The engine name.
     * @constant
     */
    static RPGMAKER_NAME: string = "OPENMZ";

    /**
     * The engine version.
     * @constant
     */
    static RPGMAKER_VERSION: string = "2.0.0";

    /**
     * Checks whether the current RPG Maker version is greater than or equal to
     * the given version.
     * @param version - The "x.x.x" format string to compare.
     * @returns True if the current version is greater than or equal to the given version.
     */
    static checkRMVersion(version: string): boolean {
        const array1 = this.RPGMAKER_VERSION.split(".");
        const array2 = String(version).split(".");
        for (let i = 0; i < array1.length; i++) {
            const v1 = parseInt(array1[i]);
            const v2 = parseInt(array2[i]);
            if (v1 > v2) {
                return true;
            } else if (v1 < v2) {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks whether the option is in the query string.
     * @param name - The option name.
     * @returns True if the option is in the query string.
     */
    static isOptionValid(name: string): boolean {
        const args = location.search.slice(1);
        if (args.split("&").includes(name)) {
            return true;
        }
        if (this.isNwjs() && nw.App.argv.length > 0) {
            return nw.App.argv[0].split("&").includes(name);
        }
        return false;
    }

    /**
     * Checks whether the platform is NW.js.
     * @returns True if the platform is NW.js.
     */
    static isNwjs(): boolean {
        return typeof require === "function" && typeof process === "object";
    }

    /**
     * Checks whether the platform is a mobile device.
     * @returns True if the platform is a mobile device.
     */
    static isMobileDevice(): boolean {
        const r = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i;
        return !!navigator.userAgent.match(r);
    }

    /**
     * Checks whether the browser is Mobile Safari.
     * @returns True if the browser is Mobile Safari.
     */
    static isMobileSafari(): boolean {
        const agent = navigator.userAgent;
        return !!(agent.match(/iPhone|iPad|iPod/) && agent.match(/AppleWebKit/) && !agent.match("CriOS"));
    }

    /**
     * Checks whether the browser is Android Chrome.
     * @returns True if the browser is Android Chrome.
     */
    static isAndroidChrome(): boolean {
        const agent = navigator.userAgent;
        return !!(agent.match(/Android/) && agent.match(/Chrome/));
    }

    /**
     * Checks whether the browser is accessing local files.
     * @returns True if the browser is accessing local files.
     */
    static isLocal(): boolean {
        return window.location.href.startsWith("file:");
    }

    /**
     * Checks whether the browser supports WebGL.
     * @returns True if the browser supports WebGL.
     */
    static canUseWebGL(): boolean {
        try {
            const canvas = document.createElement("canvas");
            return !!canvas.getContext("webgl");
        } catch {
            return false;
        }
    }

    /**
     * Checks whether the browser supports Web Audio API.
     * @returns True if the browser supports Web Audio API.
     */
    static canUseWebAudioAPI(): boolean {
        return !!(window.AudioContext || window.webkitAudioContext);
    }

    /**
     * Checks whether the browser supports CSS Font Loading.
     * @returns True if the browser supports CSS Font Loading.
     */
    static canUseCssFontLoading(): boolean {
        return !!(document.fonts && document.fonts.ready);
    }

    /**
     * Checks whether the browser supports IndexedDB.
     * @returns True if the browser supports IndexedDB.
     */
    static canUseIndexedDB(): boolean {
        return !!(window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB);
    }

    /**
     * Checks whether the browser can play ogg files.
     * @returns True if the browser can play ogg files.
     */
    static canPlayOgg(): boolean {
        if (!Utils._audioElement) {
            Utils._audioElement = document.createElement("audio");
        }
        return !!(Utils._audioElement && Utils._audioElement.canPlayType('audio/ogg; codecs="vorbis"'));
    }

    /**
     * Checks whether the browser can play webm files.
     * @returns True if the browser can play webm files.
     */
    static canPlayWebm(): boolean {
        if (!Utils._videoElement) {
            Utils._videoElement = document.createElement("video");
        }
        return !!(Utils._videoElement && Utils._videoElement.canPlayType('video/webm; codecs="vp8, vorbis"'));
    }

    /**
     * Encodes a URI component without escaping slash characters.
     * @param str - The input string.
     * @returns Encoded string.
     */
    static encodeURI(str: string): string {
        return encodeURIComponent(str).replace(/%2F/g, "/");
    }

    /**
     * Gets the filename that does not include subfolders.
     * @param filename - The filename with subfolders.
     * @returns The filename without subfolders.
     */
    static extractFileName(filename: string): string {
        return filename.split("/").pop()!;
    }

    /**
     * Escapes special characters for HTML.
     * @param str - The input string.
     * @returns Escaped string.
     */
    static escapeHtml(str: string): string {
        const entityMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
            "/": "&#x2F;",
        };
        return String(str).replace(/[&<>"'/]/g, (s) => entityMap[s as keyof typeof entityMap]);
    }

    /**
     * Checks whether the string contains any Arabic characters.
     * @returns True if the string contains any Arabic characters.
     */
    static containsArabic(str: string): boolean {
        const regExp = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
        return regExp.test(str);
    }

    /**
     * Sets information related to encryption.
     * @param hasImages - Whether the image files are encrypted.
     * @param hasAudio - Whether the audio files are encrypted.
     * @param key - The encryption key.
     */
    static setEncryptionInfo(hasImages: boolean, hasAudio: boolean, key: string): void {
        // [Note] This function is implemented for module independence.
        this._hasEncryptedImages = hasImages;
        this._hasEncryptedAudio = hasAudio;
        this._encryptionKey = key;
    }

    /**
     * Checks whether the image files in the game are encrypted.
     * @returns True if the image files are encrypted.
     */
    static hasEncryptedImages(): boolean {
        return this._hasEncryptedImages;
    }

    /**
     * Checks whether the audio files in the game are encrypted.
     * @returns True if the audio files are encrypted.
     */
    static hasEncryptedAudio(): boolean {
        return this._hasEncryptedAudio;
    }

    /**
     * Decrypts encrypted data.
     * @param source - The data to be decrypted.
     * @returns The decrypted data.
     */
    static decryptArrayBuffer(source: ArrayBuffer): ArrayBuffer {
        const header = new Uint8Array(source, 0, 16);
        const headerHex = Array.from(header, (x) => x.toString(16)).join(",");
        if (headerHex !== "52,50,47,4d,56,0,0,0,0,3,1,0,0,0,0,0") {
            throw new Error("Decryption error");
        }
        const body = source.slice(16);
        const view = new DataView(body);
        const key = this._encryptionKey.match(/.{2}/g);
        for (let i = 0; i < 16; i++) {
            view.setUint8(i, view.getUint8(i) ^ parseInt(key![i], 16));
        }
        return body;
    }
}

/**
 * The static class that carries out graphics processing.
 */
class Graphics {
    declare _width: number;
    declare _height: number;
    declare _defaultScale: number;

    declare static _width: number;
    declare static _height: number;
    declare static _defaultScale: number;
    declare static _realScale: number;
    declare static _errorPrinter: HTMLDivElement | null;
    declare static _tickHandler: Graphics.TickHandler | null;
    declare static _canvas: HTMLCanvasElement | null;
    declare static _fpsCounter: Graphics.FPSCounter | null;
    declare static _loadingSpinner: HTMLDivElement | null;
    declare static _stretchEnabled: boolean;
    declare static _app: import("pixi.js").Application<import("pixi.js").WebGLRenderer<HTMLCanvasElement>> | null;
    declare static _effekseer: effekseer.EffekseerContext | null;
    declare static _wasLoading: boolean;
    declare static frameCount: number;
    declare static boxWidth: number;
    declare static boxHeight: number;
    declare static FPSCounter: typeof GraphicsFPSCounter;

    constructor() {
        throw new Error("This is a static class");
    }

    /**
     * Initializes the graphics system.
     */
    static async initialize(): Promise<void> {
        this._width = 0;
        this._height = 0;
        this._defaultScale = 1;
        this._realScale = 1;
        this._errorPrinter = null;
        this._tickHandler = null;
        this._canvas = null;
        this._fpsCounter = null;
        this._loadingSpinner = null;
        this._stretchEnabled = this._defaultStretchMode();
        this._app = null;
        this._effekseer = null;
        this._wasLoading = false;

        /**
         * The total frame count of the game screen.
         * @name Graphics.frameCount
         */
        this.frameCount = 0;

        /**
         * The width of the window display area.
         * @name Graphics.boxWidth
         */
        this.boxWidth = this._width;

        /**
         * The height of the window display area.
         * @name Graphics.boxHeight
         */
        this.boxHeight = this._height;

        this._updateRealScale();
        this._createAllElements();
        this._disableContextMenu();
        this._setupEventHandlers();
        await this._createPixiApp();
        this._createEffekseerContext();
    }

    /**
     * The PIXI.Application object.
     * @name Graphics.app
     */
    static get app(): import("pixi.js").Application<import("pixi.js").WebGLRenderer<HTMLCanvasElement>> {
        return this._app!;
    }

    /**
     * The context object of Effekseer.
     * @name Graphics.effekseer
     */
    static get effekseer(): effekseer.EffekseerContext {
        return this._effekseer!;
    }

    /**
     * Register a handler for tick events.
     * @param handler - The listener function to be added for updates.
     */
    static setTickHandler(handler: Graphics.TickHandler): void {
        this._tickHandler = handler;
    }

    /**
     * Starts the game loop.
     */
    static startGameLoop(): void {
        if (this._app) {
            this._app.start();
        }
    }

    /**
     * Stops the game loop.
     */
    static stopGameLoop(): void {
        if (this._app) {
            this._app.stop();
        }
    }

    /**
     * Sets the stage to be rendered.
     * @param stage - The stage object to be rendered.
     */
    static setStage(stage: Stage | null): void {
        if (this._app) {
            this._app.stage = stage!;
        }
    }

    /**
     * Shows the loading spinner.
     */
    static startLoading(): void {
        if (!document.getElementById("loadingSpinner")) {
            document.body.appendChild(this._loadingSpinner!);
        }
    }

    /**
     * Erases the loading spinner.
     * @returns True if the loading spinner was active.
     */
    static endLoading(): boolean {
        if (document.getElementById("loadingSpinner")) {
            document.body.removeChild(this._loadingSpinner!);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Displays the error text to the screen.
     * @param name - The name of the error.
     * @param message - The message of the error.
     * @param error - The error object.
     */
    static printError(name: string, message: string, error: unknown = null): void {
        if (!this._errorPrinter) {
            this._createErrorPrinter();
        }
        this._errorPrinter!.innerHTML = this._makeErrorHtml(name, message, error);
        this._wasLoading = this.endLoading();
        this._applyCanvasFilter();
    }

    /**
 * Displays a button to try to reload resources.
 * @param retry - The callback function to be called when the button
is pressed.
 */
    static showRetryButton(retry: () => void): void {
        const button = document.createElement("button");
        button.id = "retryButton";
        button.innerHTML = "Retry";
        // [Note] stopPropagation() is required for iOS Safari.
        button.ontouchstart = (e) => e.stopPropagation();
        button.onclick = () => {
            Graphics.eraseError();
            retry();
        };
        this._errorPrinter!.appendChild(button);
        button.focus();
    }

    /**
     * Erases the loading error text.
     */
    static eraseError(): void {
        if (this._errorPrinter) {
            this._errorPrinter.innerHTML = this._makeErrorHtml();
            if (this._wasLoading) {
                this.startLoading();
            }
        }
        this._clearCanvasFilter();
    }

    /**
     * Converts an x coordinate on the page to the corresponding
     * x coordinate on the canvas area.
     * @param x - The x coordinate on the page to be converted.
     * @returns The x coordinate on the canvas area.
     */
    static pageToCanvasX(x: number): number {
        if (this._canvas) {
            const left = this._canvas.offsetLeft;
            return Math.round((x - left) / this._realScale);
        } else {
            return 0;
        }
    }

    /**
     * Converts a y coordinate on the page to the corresponding
     * y coordinate on the canvas area.
     * @param y - The y coordinate on the page to be converted.
     * @returns The y coordinate on the canvas area.
     */
    static pageToCanvasY(y: number): number {
        if (this._canvas) {
            const top = this._canvas.offsetTop;
            return Math.round((y - top) / this._realScale);
        } else {
            return 0;
        }
    }

    /**
     * Checks whether the specified point is inside the game canvas area.
     * @param x - The x coordinate on the canvas area.
     * @param y - The y coordinate on the canvas area.
     * @returns True if the specified point is inside the game canvas area.
     */
    static isInsideCanvas(x: number, y: number): boolean {
        return x >= 0 && x < this._width && y >= 0 && y < this._height;
    }

    /**
     * Shows the game screen.
     */
    static showScreen(): void {
        this._canvas!.style.opacity = String(1);
    }

    /**
     * Hides the game screen.
     */
    static hideScreen(): void {
        this._canvas!.style.opacity = String(0);
    }

    /**
     * Changes the size of the game screen.
     * @param width - The width of the game screen.
     * @param height - The height of the game screen.
     */
    static resize(width: number, height: number): void {
        this._width = width;
        this._height = height;
        this._app!.renderer.resize(width, height);
        this._updateAllElements();
    }

    /**
     * The width of the game screen.
     * @name Graphics.width
     */
    static get width(): number {
        return this._width;
    }

    static set width(value: number) {
        if (this._width !== value) {
            this._width = value;
            this._updateAllElements();
        }
    }

    /**
     * The height of the game screen.
     * @name Graphics.height
     */
    static get height(): number {
        return this._height;
    }

    static set height(value: number) {
        if (this._height !== value) {
            this._height = value;
            this._updateAllElements();
        }
    }

    /**
     * The default zoom scale of the game screen.
     * @name Graphics.defaultScale
     */
    static get defaultScale(): number {
        return this._defaultScale;
    }

    static set defaultScale(value: number) {
        if (this._defaultScale !== value) {
            this._defaultScale = value;
            this._updateAllElements();
        }
    }

    static _createAllElements(): void {
        this._createErrorPrinter();
        this._createCanvas();
        this._createLoadingSpinner();
        this._createFPSCounter();
    }

    static _updateAllElements(): void {
        this._updateRealScale();
        this._updateErrorPrinter();
        this._updateCanvas();
        this._updateVideo();
    }

    static _onTick(ticker: import("pixi.js").Ticker): void {
        this._fpsCounter!.startTick();
        if (this._tickHandler) {
            this._tickHandler(ticker.deltaTime);
        }
        if (this._canRender()) {
            this._app!.render();
        }
        this._fpsCounter!.endTick();
    }

    static _canRender(): boolean {
        return !!this._app!.stage;
    }

    static _updateRealScale(): void {
        if (this._stretchEnabled && this._width > 0 && this._height > 0) {
            const h = this._stretchWidth() / this._width;
            const v = this._stretchHeight() / this._height;
            this._realScale = Math.min(h, v);
            window.scrollTo(0, 0);
        } else {
            this._realScale = this._defaultScale;
        }
    }

    static _stretchWidth(): number {
        if (Utils.isMobileDevice()) {
            return document.documentElement.clientWidth;
        } else {
            return window.innerWidth;
        }
    }

    static _stretchHeight(): number {
        if (Utils.isMobileDevice()) {
            // [Note] Mobile browsers often have special operations at the top and
            //   bottom of the screen.
            const rate = Utils.isLocal() ? 1.0 : 0.9;
            return document.documentElement.clientHeight * rate;
        } else {
            return window.innerHeight;
        }
    }

    static _makeErrorHtml(name?: string, message?: string, error?: unknown): string;
    static _makeErrorHtml(name?: string, message?: string /*, error*/): string {
        const nameDiv = document.createElement("div");
        const messageDiv = document.createElement("div");
        nameDiv.id = "errorName";
        messageDiv.id = "errorMessage";
        nameDiv.innerHTML = Utils.escapeHtml(name || "");
        messageDiv.innerHTML = Utils.escapeHtml(message || "");
        return nameDiv.outerHTML + messageDiv.outerHTML;
    }

    static _defaultStretchMode(): boolean {
        return Utils.isNwjs() || Utils.isMobileDevice();
    }

    static _createErrorPrinter(): void {
        this._errorPrinter = document.createElement("div");
        this._errorPrinter.id = "errorPrinter";
        this._errorPrinter.innerHTML = this._makeErrorHtml();
        document.body.appendChild(this._errorPrinter);
    }

    static _updateErrorPrinter(): void {
        const width = this._width * 0.8 * this._realScale;
        const height = 100 * this._realScale;
        this._errorPrinter!.style.width = width + "px";
        this._errorPrinter!.style.height = height + "px";
    }

    static _createCanvas(): void {
        this._canvas = document.createElement("canvas");
        this._canvas.id = "gameCanvas";
        this._updateCanvas();
        document.body.appendChild(this._canvas);
    }

    static _updateCanvas(): void {
        this._canvas!.width = this._width;
        this._canvas!.height = this._height;
        this._canvas!.style.zIndex = String(1);
        this._centerElement(this._canvas!);
    }

    static _updateVideo(): void {
        const width = this._width * this._realScale;
        const height = this._height * this._realScale;
        Video.resize(width, height);
    }

    static _createLoadingSpinner(): void {
        const loadingSpinner = document.createElement("div");
        const loadingSpinnerImage = document.createElement("div");
        loadingSpinner.id = "loadingSpinner";
        loadingSpinnerImage.id = "loadingSpinnerImage";
        loadingSpinner.appendChild(loadingSpinnerImage);
        this._loadingSpinner = loadingSpinner;
    }

    static _createFPSCounter(): void {
        this._fpsCounter = new Graphics.FPSCounter();
    }

    static _centerElement(element: HTMLCanvasElement): void {
        const width = element.width * this._realScale;
        const height = element.height * this._realScale;
        element.style.position = "absolute";
        element.style.margin = "auto";
        element.style.top = String(0);
        element.style.left = String(0);
        element.style.right = String(0);
        element.style.bottom = String(0);
        element.style.width = width + "px";
        element.style.height = height + "px";
    }

    static _disableContextMenu(): void {
        const elements = document.body.getElementsByTagName("*");
        const oncontextmenu = () => false;
        for (const element of elements) {
            (element as Element & GlobalEventHandlers).oncontextmenu = oncontextmenu;
        }
    }

    static _applyCanvasFilter(): void {
        if (this._canvas) {
            this._canvas.style.opacity = String(0.5);
            this._canvas.style.filter = "blur(8px)";
            this._canvas.style.webkitFilter = "blur(8px)";
        }
    }

    static _clearCanvasFilter(): void {
        if (this._canvas) {
            this._canvas.style.opacity = String(1);
            this._canvas.style.filter = "";
            this._canvas.style.webkitFilter = "";
        }
    }

    static _setupEventHandlers(): void {
        window.addEventListener("resize", this._onWindowResize.bind(this));
        document.addEventListener("keydown", this._onKeyDown.bind(this));
    }

    static _onWindowResize(): void {
        this._updateAllElements();
    }

    static _onKeyDown(event: KeyboardEvent): void {
        if (!event.ctrlKey && !event.altKey) {
            switch (event.keyCode) {
                case 113: // F2
                    event.preventDefault();
                    this._switchFPSCounter();
                    break;
                case 114: // F3
                    event.preventDefault();
                    this._switchStretchMode();
                    break;
                case 115: // F4
                    event.preventDefault();
                    this._switchFullScreen();
                    break;
            }
        }
    }

    static _switchFPSCounter(): void {
        this._fpsCounter!.switchMode();
    }

    static _switchStretchMode(): void {
        this._stretchEnabled = !this._stretchEnabled;
        this._updateAllElements();
    }

    static _switchFullScreen(): void {
        if (this._isFullScreen()) {
            this._cancelFullScreen();
        } else {
            this._requestFullScreen();
        }
    }

    static _isFullScreen(): boolean {
        return (document.fullScreenElement || document.mozFullScreen || document.webkitFullscreenElement) as boolean;
    }

    static _requestFullScreen(): void {
        const element = document.body;
        if (element.requestFullScreen) {
            element.requestFullScreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen(
                (Element as typeof Element & { ALLOW_KEYBOARD_INPUT: number }).ALLOW_KEYBOARD_INPUT,
            );
        }
    }

    static _cancelFullScreen(): void {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }

    static async _createPixiApp(): Promise<void> {
        const app = new PIXI.Application<import("pixi.js").WebGLRenderer<HTMLCanvasElement>>();
        await app.init({
            canvas: this._canvas!,
            preference: "webgl",
            autoStart: false,
            gcMaxUnusedTime: 10000,
        });
        app.ticker.remove(app.render, app);
        app.ticker.add(this._onTick, this);
        this._app = app;
    }

    static _createEffekseerContext(): void {
        if (this._app && window.effekseer) {
            this._effekseer = effekseer.createContext();
            if (this._effekseer) {
                this._effekseer.init(this._app.renderer.gl);
                this._effekseer.setRestorationOfStatesFlag(true);
            }
        }
    }
}

declare namespace Graphics {
    export type FPSCounter = GraphicsFPSCounter;

    export type TickHandler = (deltaTime: number) => void;
}

/**
 * This is based on Darsain's FPSMeter which is under the MIT license.
 * The original can be found at https://github.com/Darsain/fpsmeter.
 */
class GraphicsFPSCounter {
    declare _tickCount: number;
    declare _frameTime: number;
    declare _frameStart: number;
    declare _lastLoop: number;
    declare _showFps: boolean;
    declare fps: number;
    declare duration: number;
    declare _boxDiv: HTMLDivElement;
    declare _labelDiv: HTMLDivElement;
    declare _numberDiv: HTMLDivElement;

    constructor(...args: []) {
        this.initialize(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        this._tickCount = 0;
        this._frameTime = 100;
        this._frameStart = 0;
        this._lastLoop = performance.now() - 100;
        this._showFps = true;
        this.fps = 0;
        this.duration = 0;
        this._createElements();
        this._update();
    }

    startTick(): void {
        this._frameStart = performance.now();
    }

    endTick(): void {
        const time = performance.now();
        const thisFrameTime = time - this._lastLoop;
        this._frameTime += (thisFrameTime - this._frameTime) / 12;
        this.fps = 1000 / this._frameTime;
        this.duration = Math.max(0, time - this._frameStart);
        this._lastLoop = time;
        if (this._tickCount++ % 15 === 0) {
            this._update();
        }
    }

    switchMode(): void {
        if (this._boxDiv.style.display === "none") {
            this._boxDiv.style.display = "block";
            this._showFps = true;
        } else if (this._showFps) {
            this._showFps = false;
        } else {
            this._boxDiv.style.display = "none";
        }
        this._update();
    }

    _createElements(): void {
        this._boxDiv = document.createElement("div");
        this._labelDiv = document.createElement("div");
        this._numberDiv = document.createElement("div");
        this._boxDiv.id = "fpsCounterBox";
        this._labelDiv.id = "fpsCounterLabel";
        this._numberDiv.id = "fpsCounterNumber";
        this._boxDiv.style.display = "none";
        this._boxDiv.appendChild(this._labelDiv);
        this._boxDiv.appendChild(this._numberDiv);
        document.body.appendChild(this._boxDiv);
    }

    _update(): void {
        const count = this._showFps ? this.fps : this.duration;
        this._labelDiv.textContent = this._showFps ? "FPS" : "ms";
        this._numberDiv.textContent = count.toFixed(0);
    }
}
Graphics.FPSCounter = GraphicsFPSCounter;

/**
 * The point class.
 * @param x - The x coordinate.
 * @param y - The y coordinate.
 */
class Point extends PIXI.Point {
    constructor(x?: number, y?: number) {
        super(x, y);
        this.initialize!(x, y);
    }

    initialize?(x?: number, y?: number): void;
    initialize?(...args: any[]): void;
    initialize?(): void {}
}

/**
 * The rectangle class.
 * @param x - The x coordinate for the upper-left corner.
 * @param y - The y coordinate for the upper-left corner.
 * @param width - The width of the rectangle.
 * @param height - The height of the rectangle.
 */
class Rectangle extends PIXI.Rectangle {
    constructor(x?: number, y?: number, width?: number, height?: number) {
        super(x, y, width, height);
        this.initialize!(x, y, width, height);
    }

    initialize?(x?: number, y?: number, width?: number, height?: number): void;
    initialize?(...args: any[]): void;
    initialize?(): void {}
}

/**
 * The basic object that represents an image.
 * @param width - The width of the bitmap.
 * @param height - The height of the bitmap.
 */
class Bitmap {
    declare _canvas: HTMLCanvasElement | null;
    declare _context: CanvasRenderingContext2D | null;
    declare _textureSource: import("pixi.js").ImageSource | null;
    declare _image: HTMLImageElement | null;
    declare _url: string;
    declare _paintOpacity: number;
    declare _smooth: boolean;
    declare _loadListeners: Array<Bitmap.LoadListener>;
    declare _loadingState: string;
    declare fontFace: string;
    declare fontSize: number;
    declare fontBold: boolean;
    declare fontItalic: boolean;
    declare textColor: string;
    declare outlineColor: string;
    declare outlineWidth: number;

    constructor(...args: [width?: number, height?: number]) {
        this.initialize(...args);
    }

    initialize(width?: number, height?: number): void;
    initialize(...args: any[]): void;
    initialize(width?: number, height?: number): void {
        this._canvas = null;
        this._context = null;
        this._textureSource = null;
        this._image = null;
        this._url = "";
        this._paintOpacity = 255;
        this._smooth = true;
        this._loadListeners = [];

        // "none", "loading", "loaded", or "error"

        this._loadingState = "none";

        if (width! > 0 && height! > 0) {
            this._createCanvas(width!, height!);
        }

        /**
         * The face name of the font.
         */
        this.fontFace = "sans-serif";

        /**
         * The size of the font in pixels.
         */
        this.fontSize = 16;

        /**
         * Whether the font is bold.
         */
        this.fontBold = false;

        /**
         * Whether the font is italic.
         */
        this.fontItalic = false;

        /**
         * The color of the text in CSS format.
         */
        this.textColor = "#ffffff";

        /**
         * The color of the outline of the text in CSS format.
         */
        this.outlineColor = "rgba(0, 0, 0, 0.5)";

        /**
         * The width of the outline of the text.
         */
        this.outlineWidth = 3;
    }

    /**
     * Loads a image file.
     * @param url - The image url of the texture.
     * @returns The new bitmap object.
     */
    static load(url: string): Bitmap {
        const bitmap = Object.create(Bitmap.prototype);
        bitmap.initialize();
        bitmap._url = url;
        bitmap._startLoading();
        return bitmap;
    }

    /**
     * Takes a snapshot of the game screen.
     * @param stage - The stage object.
     * @returns The new bitmap object.
     */
    static snap(stage: Stage): Bitmap {
        const width = Graphics.width;
        const height = Graphics.height;
        const bitmap = new Bitmap(width, height);
        const renderTexture = PIXI.RenderTexture.create({ width, height });
        if (stage) {
            const renderer = Graphics.app.renderer;
            renderer.render({ container: stage, target: renderTexture });
            const canvas = renderer.extract.canvas(renderTexture);
            bitmap.context.drawImage(canvas as CanvasImageSource, 0, 0);
            canvas.width = 0;
            canvas.height = 0;
        }
        renderTexture.destroy(true);
        bitmap.textureSource.update();
        return bitmap;
    }

    /**
     * Checks whether the bitmap is ready to render.
     * @returns True if the bitmap is ready to render.
     */
    isReady(): boolean {
        return this._loadingState === "loaded" || this._loadingState === "none";
    }

    /**
     * Checks whether a loading error has occurred.
     * @returns True if a loading error has occurred.
     */
    isError(): boolean {
        return this._loadingState === "error";
    }

    /**
     * The url of the image file.
     * @name Bitmap#url
     */
    get url(): string {
        return this._url;
    }

    /**
     * The PixiJS texture source that holds the bitmap image.
     * @name Bitmap#textureSource
     */
    get textureSource(): import("pixi.js").TextureSource {
        return this._textureSource!;
    }

    /**
     * The bitmap image.
     * @name Bitmap#image
     */
    get image(): HTMLImageElement | null {
        return this._image;
    }

    /**
     * The bitmap canvas.
     * @name Bitmap#canvas
     */
    get canvas(): HTMLCanvasElement {
        this._ensureCanvas();
        return this._canvas!;
    }

    /**
     * The 2d context of the bitmap canvas.
     * @name Bitmap#context
     */
    get context(): CanvasRenderingContext2D {
        this._ensureCanvas();
        return this._context!;
    }

    /**
     * The width of the bitmap.
     * @name Bitmap#width
     */
    get width(): number {
        const image = this._canvas || this._image;
        return image ? image.width : 0;
    }

    /**
     * The height of the bitmap.
     * @name Bitmap#height
     */
    get height(): number {
        const image = this._canvas || this._image;
        return image ? image.height : 0;
    }

    /**
     * The rectangle of the bitmap.
     * @name Bitmap#rect
     */
    get rect(): Rectangle {
        return new PIXI.Rectangle(0, 0, this.width, this.height);
    }

    /**
     * Whether the smooth scaling is applied.
     * @name Bitmap#smooth
     */
    get smooth(): boolean {
        return this._smooth;
    }

    set smooth(value: boolean) {
        if (this._smooth !== value) {
            this._smooth = value;
            this._updateScaleMode();
        }
    }

    /**
     * The opacity of the drawing object in the range (0, 255).
     * @name Bitmap#paintOpacity
     */
    get paintOpacity(): number {
        return this._paintOpacity;
    }

    set paintOpacity(value: number) {
        if (this._paintOpacity !== value) {
            this._paintOpacity = value;
            this.context.globalAlpha = this._paintOpacity / 255;
        }
    }

    /**
     * Destroys the bitmap.
     */
    destroy(): void {
        if (this._textureSource) {
            this._textureSource.destroy();
            this._textureSource = null;
        }
        this._destroyCanvas();
    }

    /**
     * Resizes the bitmap.
     * @param width - The new width of the bitmap.
     * @param height - The new height of the bitmap.
     */
    resize(width: number, height: number): void {
        width = Math.max(width || 0, 1);
        height = Math.max(height || 0, 1);
        this._ensureCanvas();
        this._textureSource!.resize(width, height);
    }

    /**
     * Performs a block transfer.
     * @param source - The bitmap to draw.
     * @param sx - The x coordinate in the source.
     * @param sy - The y coordinate in the source.
     * @param sw - The width of the source image.
     * @param sh - The height of the source image.
     * @param dx - The x coordinate in the destination.
     * @param dy - The y coordinate in the destination.
     * @param dw The width to draw the image in the destination.
     * @param dh The height to draw the image in the destination.
     */
    blt(
        source: Bitmap,
        sx: number,
        sy: number,
        sw: number,
        sh: number,
        dx: number,
        dy: number,
        dw?: number,
        dh?: number,
    ): void {
        dw = dw || sw;
        dh = dh || sh;
        try {
            const image = source._canvas || source._image;
            this.context.globalCompositeOperation = "source-over";
            this.context.drawImage(image!, sx, sy, sw, sh, dx, dy, dw, dh);
            this._textureSource!.update();
        } catch {
            //
        }
    }

    /**
     * Returns pixel color at the specified point.
     * @param x - The x coordinate of the pixel in the bitmap.
     * @param y - The y coordinate of the pixel in the bitmap.
     * @returns The pixel color (hex format).
     */
    getPixel(x: number, y: number): string {
        const data = this.context.getImageData(x, y, 1, 1).data;
        let result = "#";
        for (let i = 0; i < 3; i++) {
            result += data[i].toString(16).padZero(2);
        }
        return result;
    }

    /**
     * Returns alpha pixel value at the specified point.
     * @param x - The x coordinate of the pixel in the bitmap.
     * @param y - The y coordinate of the pixel in the bitmap.
     * @returns The alpha value.
     */
    getAlphaPixel(x: number, y: number): number {
        const data = this.context.getImageData(x, y, 1, 1).data;
        return data[3];
    }

    /**
     * Clears the specified rectangle.
     * @param x - The x coordinate for the upper-left corner.
     * @param y - The y coordinate for the upper-left corner.
     * @param width - The width of the rectangle to clear.
     * @param height - The height of the rectangle to clear.
     */
    clearRect(x: number, y: number, width: number, height: number): void {
        this.context.clearRect(x, y, width, height);
        this._textureSource!.update();
    }

    /**
     * Clears the entire bitmap.
     */
    clear(): void {
        this.clearRect(0, 0, this.width, this.height);
    }

    /**
     * Fills the specified rectangle.
     * @param x - The x coordinate for the upper-left corner.
     * @param y - The y coordinate for the upper-left corner.
     * @param width - The width of the rectangle to fill.
     * @param height - The height of the rectangle to fill.
     * @param color - The color of the rectangle in CSS format.
     */
    fillRect(x: number, y: number, width: number, height: number, color: string): void {
        const context = this.context;
        context.save();
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
        context.restore();
        this._textureSource!.update();
    }

    /**
     * Fills the entire bitmap.
     * @param color - The color of the rectangle in CSS format.
     */
    fillAll(color: string): void {
        this.fillRect(0, 0, this.width, this.height, color);
    }

    /**
     * Draws the specified rectangular frame.
     * @param x - The x coordinate for the upper-left corner.
     * @param y - The y coordinate for the upper-left corner.
     * @param width - The width of the rectangle to fill.
     * @param height - The height of the rectangle to fill.
     * @param color - The color of the rectangle in CSS format.
     */
    strokeRect(x: number, y: number, width: number, height: number, color: string): void {
        const context = this.context;
        context.save();
        context.strokeStyle = color;
        context.strokeRect(x, y, width, height);
        context.restore();
        this._textureSource!.update();
    }

    // prettier-ignore
    /**
     * Draws the rectangle with a gradation.
     * @param x - The x coordinate for the upper-left corner.
     * @param y - The y coordinate for the upper-left corner.
     * @param width - The width of the rectangle to fill.
     * @param height - The height of the rectangle to fill.
     * @param color1 - The gradient starting color.
     * @param color2 - The gradient ending color.
     * @param vertical - Whether the gradient should be draw as vertical or not.
     */
    gradientFillRect(
        x: number, y: number, width: number, height: number, color1: string, color2: string, vertical?: boolean
    ): void {
        const context = this.context;
        const x1 = vertical ? x : x + width;
        const y1 = vertical ? y + height : y;
        const grad = context.createLinearGradient(x, y, x1, y1);
        grad.addColorStop(0, color1);
        grad.addColorStop(1, color2);
        context.save();
        context.fillStyle = grad;
        context.fillRect(x, y, width, height);
        context.restore();
        this._textureSource!.update();
    }

    /**
     * Draws a bitmap in the shape of a circle.
     * @param x - The x coordinate based on the circle center.
     * @param y - The y coordinate based on the circle center.
     * @param radius - The radius of the circle.
     * @param color - The color of the circle in CSS format.
     */
    drawCircle(x: number, y: number, radius: number, color: string): void {
        const context = this.context;
        context.save();
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2, false);
        context.fill();
        context.restore();
        this._textureSource!.update();
    }

    /**
     * Draws the outline text to the bitmap.
     * @param text - The text that will be drawn.
     * @param x - The x coordinate for the left of the text.
     * @param y - The y coordinate for the top of the text.
     * @param maxWidth - The maximum allowed width of the text.
     * @param lineHeight - The height of the text line.
     * @param align - The alignment of the text.
     */
    drawText(
        text: string | number,
        x: number,
        y: number,
        maxWidth: number | undefined,
        lineHeight: number,
        align?: CanvasTextAlign,
    ): void {
        // [Note] Different browser makes different rendering with
        //   textBaseline == 'top'. So we use 'alphabetic' here.
        text = String(text);
        const context = this.context;
        const alpha = context.globalAlpha;
        maxWidth = maxWidth || 0xffffffff;
        let tx = x;
        let ty = Math.round(y + lineHeight / 2 + this.fontSize * 0.35);
        if (align === "center") {
            tx += maxWidth / 2;
        }
        if (align === "right") {
            tx += maxWidth;
        }
        context.save();
        context.font = this._makeFontNameText();
        context.textAlign = align!;
        context.textBaseline = "alphabetic";
        context.globalAlpha = 1;
        this._drawTextOutline(text, tx, ty, maxWidth);
        context.globalAlpha = alpha;
        this._drawTextBody(text, tx, ty, maxWidth);
        context.restore();
        this._textureSource!.update();
    }

    /**
     * Returns the width of the specified text.
     * @param text - The text to be measured.
     * @returns The width of the text in pixels.
     */
    measureTextWidth(text: string): number {
        const context = this.context;
        context.save();
        context.font = this._makeFontNameText();
        const width = context.measureText(text).width;
        context.restore();
        return width;
    }

    /**
     * Adds a callback function that will be called when the bitmap is loaded.
     * @param listner - The callback function.
     */
    addLoadListener(listner: Bitmap.LoadListener): void {
        if (!this.isReady()) {
            this._loadListeners.push(listner);
        } else {
            listner(this);
        }
    }

    /**
     * Tries to load the image again.
     */
    retry(): void {
        this._startLoading();
    }

    _makeFontNameText(): string {
        const italic = this.fontItalic ? "Italic " : "";
        const bold = this.fontBold ? "Bold " : "";
        return italic + bold + this.fontSize + "px " + this.fontFace;
    }

    _drawTextOutline(text: string, tx: number, ty: number, maxWidth: number): void {
        const context = this.context;
        context.strokeStyle = this.outlineColor;
        context.lineWidth = this.outlineWidth;
        context.lineJoin = "round";
        context.strokeText(text, tx, ty, maxWidth);
    }

    _drawTextBody(text: string, tx: number, ty: number, maxWidth: number): void {
        const context = this.context;
        context.fillStyle = this.textColor;
        context.fillText(text, tx, ty, maxWidth);
    }

    _createCanvas(width: number, height: number): void {
        this._canvas = document.createElement("canvas");
        this._context = this._canvas.getContext("2d");
        this._canvas.width = width;
        this._canvas.height = height;
        this._createTextureSource(this._canvas);
    }

    _ensureCanvas(): void {
        if (!this._canvas) {
            if (this._image) {
                this._createCanvas(this._image.width, this._image.height);
                this._context!.drawImage(this._image, 0, 0);
            } else {
                this._createCanvas(0, 0);
            }
        }
    }

    _destroyCanvas(): void {
        if (this._canvas) {
            this._canvas.width = 0;
            this._canvas.height = 0;
            this._canvas = null;
        }
    }

    _createTextureSource(resource: HTMLCanvasElement | HTMLImageElement): void {
        const Source = resource === this._canvas ? PIXI.CanvasSource : PIXI.ImageSource;
        this._textureSource = new Source({ resource, resolution: 1 });
        this._updateScaleMode();
    }

    _updateScaleMode(): void {
        if (this._textureSource) {
            this._textureSource.scaleMode = this._smooth ? "linear" : "nearest";
        }
    }

    _startLoading(): void {
        this._image = new Image();
        this._image.onload = this._onLoad.bind(this);
        this._image.onerror = this._onError.bind(this);
        this._destroyCanvas();
        this._loadingState = "loading";
        if (Utils.hasEncryptedImages()) {
            this._startDecrypting();
        } else {
            this._image.src = this._url;
            if (this._image.width > 0) {
                this._image.onload = null;
                this._onLoad();
            }
        }
    }

    _startDecrypting(): void {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", this._url + "_");
        xhr.responseType = "arraybuffer";
        xhr.onload = () => this._onXhrLoad(xhr);
        xhr.onerror = this._onError.bind(this);
        xhr.send();
    }

    _onXhrLoad(xhr: XMLHttpRequest): void {
        if (xhr.status < 400) {
            const arrayBuffer = Utils.decryptArrayBuffer(xhr.response);
            const blob = new Blob([arrayBuffer]);
            this._image!.src = URL.createObjectURL(blob);
        } else {
            this._onError();
        }
    }

    _onLoad(): void {
        if (Utils.hasEncryptedImages()) {
            URL.revokeObjectURL(this._image!.src);
        }
        this._loadingState = "loaded";
        this._createTextureSource(this._image!);
        this._callLoadListeners();
    }

    _callLoadListeners(): void {
        while (this._loadListeners.length > 0) {
            const listener = this._loadListeners.shift();
            listener!(this);
        }
    }

    _onError(): void {
        this._loadingState = "error";
    }
}

declare namespace Bitmap {
    export type LoadListener = (bitmap: Bitmap) => void;
}

/**
 * The basic object that is rendered to the game screen.
 * @param bitmap - The image for the sprite.
 */
class Sprite extends PIXI.Sprite {
    declare children: RMMZ.UpdateableChild[];
    declare z: number;

    declare spriteId: number;
    declare _bitmap: Bitmap;
    declare _frame: Rectangle;
    declare _hue: number;
    declare _blendColor: RMMZ.Color;
    declare _colorTone: RMMZ.Color;
    declare _colorFilter: ColorFilter | null;
    declare _hidden: boolean;
    declare _refreshFrame: boolean;

    constructor(...args: unknown[]) {
        super(
            new PIXI.Texture({
                source: PIXI.Texture.EMPTY.source,
                frame: new PIXI.Rectangle(),
                dynamic: true,
            }),
        );
        // Engine sprites can have overlays and other child sprites.
        this.allowChildren = true;
        this.initialize(...args);
    }

    initialize(bitmap?: Bitmap): void;
    initialize(...args: any[]): void;
    initialize(bitmap?: Bitmap): void {
        this.spriteId = Sprite._counter++;
        this._bitmap = bitmap!;
        this._frame = new PIXI.Rectangle();
        this._hue = 0;
        this._blendColor = [0, 0, 0, 0];
        this._colorTone = [0, 0, 0, 0];
        this._colorFilter = null;
        this._hidden = false;
        this._onBitmapChange();
    }

    static _counter: number = 0;

    /**
     * The image for the sprite.
     * @name Sprite#bitmap
     */
    get bitmap(): Bitmap {
        return this._bitmap;
    }

    set bitmap(value: Bitmap) {
        if (this._bitmap !== value) {
            this._bitmap = value;
            this._onBitmapChange();
        }
    }

    /**
     * The width of the sprite without the scale.
     * @name Sprite#width
     */
    get width(): number {
        return this._frame.width;
    }

    set width(value: number) {
        this._frame.width = value;
        this._refresh();
    }

    /**
     * The height of the sprite without the scale.
     * @name Sprite#height
     */
    get height(): number {
        return this._frame.height;
    }

    set height(value: number) {
        this._frame.height = value;
        this._refresh();
    }

    /**
     * The opacity of the sprite (0 to 255).
     * @name Sprite#opacity
     */
    get opacity(): number {
        return this.alpha * 255;
    }

    set opacity(value: number) {
        this.alpha = value.clamp(0, 255) / 255;
    }

    /**
     * The blend mode to be applied to the sprite.
     * @name Sprite#blendMode
     */
    get blendMode(): import("pixi.js").BLEND_MODES {
        return this._colorFilter?.blendMode ?? super.blendMode;
    }

    set blendMode(value: RMMZ.BlendMode) {
        const mode = typeof value === "number" ? (Sprite._blendModes[value] ?? "normal") : value;
        if (this._colorFilter) {
            this._colorFilter.blendMode = mode as import("pixi.js").BLEND_MODES;
        } else {
            super.blendMode = mode as import("pixi.js").BLEND_MODES;
        }
    }

    static _blendModes: string[] = ["normal", "add", "multiply", "screen"];

    /**
     * Destroys the sprite.
     */
    destroy(options?: import("pixi.js").DestroyOptions): void;
    destroy(): void {
        const options = { children: true, texture: true };
        super.destroy(options);
    }

    /**
     * Updates the sprite for each frame.
     */
    update(): void {
        for (const child of this.children) {
            if (child.update) {
                child.update();
            }
        }
    }

    /**
     * Makes the sprite "hidden".
     */
    hide(): void {
        this._hidden = true;
        this.updateVisibility();
    }

    /**
     * Releases the "hidden" state of the sprite.
     */
    show(): void {
        this._hidden = false;
        this.updateVisibility();
    }

    /**
     * Reflects the "hidden" state of the sprite to the visible state.
     */
    updateVisibility(): void {
        this.visible = !this._hidden;
    }

    /**
     * Sets the x and y at once.
     * @param x - The x coordinate of the sprite.
     * @param y - The y coordinate of the sprite.
     */
    move(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    /**
     * Sets the rectagle of the bitmap that the sprite displays.
     * @param x - The x coordinate of the frame.
     * @param y - The y coordinate of the frame.
     * @param width - The width of the frame.
     * @param height - The height of the frame.
     */
    setFrame(x: number, y: number, width: number, height: number): void {
        this._refreshFrame = false;
        const frame = this._frame;
        if (x !== frame.x || y !== frame.y || width !== frame.width || height !== frame.height) {
            frame.x = x;
            frame.y = y;
            frame.width = width;
            frame.height = height;
            this._refresh();
        }
    }

    /**
     * Sets the hue rotation value.
     * @param hue - The hue value (-360, 360).
     */
    setHue(hue: number): void {
        if (this._hue !== Number(hue)) {
            this._hue = Number(hue);
            this._updateColorFilter();
        }
    }

    /**
     * Gets the blend color for the sprite.
     * @returns The blend color [r, g, b, a].
     */
    getBlendColor(): RMMZ.Color {
        return this._blendColor.clone();
    }

    /**
     * Sets the blend color for the sprite.
     * @param color - The blend color [r, g, b, a].
     */
    setBlendColor(color: RMMZ.Color): void {
        if (!(color instanceof Array)) {
            throw new Error("Argument must be an array");
        }
        if (!this._blendColor.equals(color)) {
            this._blendColor = color.clone();
            this._updateColorFilter();
        }
    }

    /**
     * Gets the color tone for the sprite.
     * @returns The color tone [r, g, b, gray].
     */
    getColorTone(): RMMZ.Tone {
        return this._colorTone.clone();
    }

    /**
     * Sets the color tone for the sprite.
     * @param tone - The color tone [r, g, b, gray].
     */
    setColorTone(tone: RMMZ.Color): void {
        if (!(tone instanceof Array)) {
            throw new Error("Argument must be an array");
        }
        if (!this._colorTone.equals(tone)) {
            this._colorTone = tone.clone();
            this._updateColorFilter();
        }
    }

    _onBitmapChange(): void {
        if (this._bitmap) {
            this._refreshFrame = true;
            this._bitmap.addLoadListener(this._onBitmapLoad.bind(this));
        } else {
            this._refreshFrame = false;
            this._refresh();
        }
    }

    _onBitmapLoad(bitmapLoaded: Bitmap): void {
        if (bitmapLoaded === this._bitmap) {
            if (this._refreshFrame && this._bitmap) {
                this._refreshFrame = false;
                this._frame.width = this._bitmap.width;
                this._frame.height = this._bitmap.height;
            }
            this._refresh();
        }
    }

    _refresh(): void {
        const texture = this.texture;
        const frameX = Math.floor(this._frame.x);
        const frameY = Math.floor(this._frame.y);
        const frameW = Math.floor(this._frame.width);
        const frameH = Math.floor(this._frame.height);
        const textureSource = this._bitmap ? this._bitmap.textureSource : null;
        const textureSourceW = textureSource ? textureSource.width : 0;
        const textureSourceH = textureSource ? textureSource.height : 0;
        const realX = frameX.clamp(0, textureSourceW);
        const realY = frameY.clamp(0, textureSourceH);
        const realW = (frameW - realX + frameX).clamp(0, textureSourceW - realX);
        const realH = (frameH - realY + frameY).clamp(0, textureSourceH - realY);
        this.pivot.x = frameX - realX;
        this.pivot.y = frameY - realY;
        texture.frame.copyFrom({
            x: realX,
            y: realY,
            width: realW,
            height: realH,
        } as import("pixi.js").Rectangle);
        const source = textureSource ?? PIXI.Texture.EMPTY.source;
        if (texture.source !== source) {
            texture.source = source;
        }
        texture.update();
    }

    _createColorFilter(): void {
        this._colorFilter = new ColorFilter();
        this._colorFilter.blendMode = super.blendMode;
        super.blendMode = "normal";
        this.filters = [...(this.filters ?? []), this._colorFilter];
    }

    _updateColorFilter(): void {
        if (!this._colorFilter) {
            this._createColorFilter();
        }
        this._colorFilter!.setHue(this._hue);
        this._colorFilter!.setBlendColor(this._blendColor);
        this._colorFilter!.setColorTone(this._colorTone);
    }
}

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
 */
class Tilemap extends PIXI.Container {
    declare children: RMMZ.UpdateableChild[];
    declare _width: number;
    declare _height: number;
    declare _margin: number;
    declare _mapWidth: number;
    declare _mapHeight: number;
    declare _mapData: number[] | null;
    declare _bitmaps: Bitmap[];
    declare tileWidth: number;
    declare tileHeight: number;
    declare flags: number[];
    declare animationCount: number;
    declare horizontalWrap: boolean;
    declare verticalWrap: boolean;
    declare animationFrame: number;
    declare _needsBitmapsUpdate: boolean;
    declare _needsRepaint: boolean;
    declare _lastAnimationFrame: number;
    declare _lastStartX: number | undefined;
    declare _lastStartY: number | undefined;
    declare _tileAtlases: import("pixi.js").CanvasSource[];
    declare _tileShader: import("pixi.js").Shader;
    declare _lowerLayer: Tilemap.CombinedLayer;
    declare _upperLayer: Tilemap.CombinedLayer;
    declare static Layer: typeof TilemapLayer;
    declare static CombinedLayer: typeof TilemapCombinedLayer;

    constructor(...args: []) {
        super();
        this.initialize(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        this._width = Graphics.width;
        this._height = Graphics.height;
        this._margin = 20;
        this._mapWidth = 0;
        this._mapHeight = 0;
        this._mapData = null;
        this._bitmaps = [];

        /**
         * The width of each tile.
         */
        this.tileWidth = 48;

        /**
         * The height of each tile.
         */
        this.tileHeight = 48;

        /**
         * The origin point of the tilemap for scrolling.
         */
        this.origin = new PIXI.Point();

        /**
         * The tileset flags.
         */
        this.flags = [];

        /**
         * The animation count for autotiles.
         */
        this.animationCount = 0;

        /**
         * Whether the tilemap loops horizontal.
         */
        this.horizontalWrap = false;

        /**
         * Whether the tilemap loops vertical.
         */
        this.verticalWrap = false;

        this._createLayers();
        this.onRender = this._updateLayers;
        this.refresh();
    }

    /**
     * The width of the tilemap.
     * @name Tilemap#width
     */
    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }

    /**
     * The height of the tilemap.
     * @name Tilemap#height
     */
    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
    }

    /**
     * Destroys the tilemap.
     */
    destroy(): void {
        super.destroy({ children: true });
        this._tileShader.destroy();
        for (const atlas of this._tileAtlases) {
            atlas.destroy();
        }
    }

    /**
     * Sets the tilemap data.
     * @param width - The width of the map in number of tiles.
     * @param height - The height of the map in number of tiles.
     * @param data - The one dimensional array for the map data.
     */
    setData(width: number, height: number, data: number[]): void {
        this._mapWidth = width;
        this._mapHeight = height;
        this._mapData = data;
    }

    /**
     * Checks whether the tileset is ready to render.
     * @returns True if the tilemap is ready.
     */
    isReady(): boolean {
        for (const bitmap of this._bitmaps) {
            if (bitmap && !bitmap.isReady()) {
                return false;
            }
        }
        return true;
    }

    /**
     * Updates the tilemap for each frame.
     */
    update(): void {
        this.animationCount++;
        this.animationFrame = Math.floor(this.animationCount / 30);
        for (const child of this.children) {
            if (child.update) {
                child.update();
            }
        }
    }

    /**
     * Sets the bitmaps used as a tileset.
     *
     * We wait for the images to finish loading. Creating textures
     * from bitmaps that are not yet loaded here brings some maintenance
     * difficulties. For example, PIXI overwrites img.onload internally.
     * @param bitmaps - The array of the tileset bitmaps.
     */
    setBitmaps(bitmaps: Bitmap[]): void {
        this._bitmaps = bitmaps;
        const listener = this._updateBitmaps.bind(this);
        for (const bitmap of this._bitmaps) {
            if (!bitmap.isReady()) {
                bitmap.addLoadListener(listener);
            }
        }
        this._needsBitmapsUpdate = true;
        this._updateBitmaps();
    }

    /**
     * Forces to repaint the entire tilemap.
     */
    refresh(): void {
        this._needsRepaint = true;
    }

    _updateLayers(): void {
        const ox = Math.ceil(this.origin.x);
        const oy = Math.ceil(this.origin.y);
        const startX = Math.floor((ox - this._margin) / this.tileWidth);
        const startY = Math.floor((oy - this._margin) / this.tileHeight);
        this._lowerLayer.x = startX * this.tileWidth - ox;
        this._lowerLayer.y = startY * this.tileHeight - oy;
        this._upperLayer.x = startX * this.tileWidth - ox;
        this._upperLayer.y = startY * this.tileHeight - oy;
        if (
            this._needsRepaint ||
            this._lastAnimationFrame !== this.animationFrame ||
            this._lastStartX !== startX ||
            this._lastStartY !== startY
        ) {
            this._lastAnimationFrame = this.animationFrame;
            this._lastStartX = startX;
            this._lastStartY = startY;
            this._addAllSpots(startX, startY);
            this._needsRepaint = false;
        }
        this._sortChildren();
    }

    _createLayers(): void {
        this._tileAtlases = [];
        this._tileShader = Tilemap.createShader();
        this._lowerLayer = new Tilemap.CombinedLayer(this._tileShader);
        this._lowerLayer.z = 0;
        this._upperLayer = new Tilemap.CombinedLayer(this._tileShader);
        this._upperLayer.z = 4;
        this.addChild(this._lowerLayer);
        this.addChild(this._upperLayer);
        this._needsRepaint = true;
    }

    _updateBitmaps(): void {
        if (this._needsBitmapsUpdate && this.isReady()) {
            this._updateAtlasTextures();
            this._needsBitmapsUpdate = false;
            this._needsRepaint = true;
        }
    }

    _updateAtlasTextures(): void {
        // Four tilesheets share each atlas. The shader binds at most three atlases.
        for (let i = 0; i < 3; i++) {
            const bitmaps = this._bitmaps.slice(i * 4, i * 4 + 4);
            if (!this._tileAtlases[i]) {
                const canvas = document.createElement("canvas");
                canvas.width = canvas.height = 2048;
                this._tileAtlases[i] = new PIXI.CanvasSource({
                    resource: canvas,
                    resolution: 1,
                    scaleMode: "nearest",
                });
            }
            const source = this._tileAtlases[i];
            const context = source.resource.getContext("2d")!;
            context.clearRect(0, 0, 2048, 2048);
            for (let j = 0; j < bitmaps.length; j++) {
                const bitmap = bitmaps[j];
                const image = bitmap?.image || bitmap?.canvas;
                if (image?.width && image.height) {
                    const width = Math.min(image.width, 1024);
                    const height = Math.min(image.height, 1024);
                    context.drawImage(image, 0, 0, width, height, 1024 * (j % 2), 1024 * (j >> 1), width, height);
                }
            }
            source.update();
            this._tileShader.resources["uSampler" + i] = source;
        }
    }

    _addAllSpots(startX: number, startY: number): void {
        this._lowerLayer.clear();
        this._upperLayer.clear();
        const widthWithMatgin = this.width + this._margin * 2;
        const heightWithMatgin = this.height + this._margin * 2;
        const tileCols = Math.ceil(widthWithMatgin / this.tileWidth) + 1;
        const tileRows = Math.ceil(heightWithMatgin / this.tileHeight) + 1;
        for (let y = 0; y < tileRows; y++) {
            for (let x = 0; x < tileCols; x++) {
                this._addSpot(startX, startY, x, y);
            }
        }
    }

    _addSpot(startX: number, startY: number, x: number, y: number): void {
        const mx = startX + x;
        const my = startY + y;
        const dx = x * this.tileWidth;
        const dy = y * this.tileHeight;
        const tileId0 = this._readMapData(mx, my, 0);
        const tileId1 = this._readMapData(mx, my, 1);
        const tileId2 = this._readMapData(mx, my, 2);
        const tileId3 = this._readMapData(mx, my, 3);
        const shadowBits = this._readMapData(mx, my, 4);
        const upperTileId1 = this._readMapData(mx, my - 1, 1);

        this._addSpotTile(tileId0, dx, dy);
        this._addSpotTile(tileId1, dx, dy);
        this._addShadow(this._lowerLayer, shadowBits, dx, dy);
        if (this._isTableTile(upperTileId1) && !this._isTableTile(tileId1)) {
            if (!Tilemap.isShadowingTile(tileId0)) {
                this._addTableEdge(this._lowerLayer, upperTileId1, dx, dy);
            }
        }
        if (this._isOverpassPosition(mx, my)) {
            this._addTile(this._upperLayer, tileId2, dx, dy);
            this._addTile(this._upperLayer, tileId3, dx, dy);
        } else {
            this._addSpotTile(tileId2, dx, dy);
            this._addSpotTile(tileId3, dx, dy);
        }
    }

    _addSpotTile(tileId: RMMZ.TileID, dx: number, dy: number): void {
        if (this._isHigherTile(tileId)) {
            this._addTile(this._upperLayer, tileId, dx, dy);
        } else {
            this._addTile(this._lowerLayer, tileId, dx, dy);
        }
    }

    _addTile(layer: TilemapCombinedLayer, tileId: RMMZ.TileID, dx: number, dy: number): void {
        if (Tilemap.isVisibleTile(tileId)) {
            if (Tilemap.isAutotile(tileId)) {
                this._addAutotile(layer, tileId, dx, dy);
            } else {
                this._addNormalTile(layer, tileId, dx, dy);
            }
        }
    }

    _addNormalTile(layer: TilemapCombinedLayer, tileId: RMMZ.TileID, dx: number, dy: number): void {
        let setNumber = 0;

        if (Tilemap.isTileA5(tileId)) {
            setNumber = 4;
        } else {
            setNumber = 5 + Math.floor(tileId / 256);
        }

        const w = this.tileWidth;
        const h = this.tileHeight;
        const sx = ((Math.floor(tileId / 128) % 2) * 8 + (tileId % 8)) * w;
        const sy = (Math.floor((tileId % 256) / 8) % 16) * h;

        layer.addRect(setNumber, sx, sy, dx, dy, w, h);
    }

    _addAutotile(layer: TilemapCombinedLayer, tileId: RMMZ.TileID, dx: number, dy: number): void {
        const kind = Tilemap.getAutotileKind(tileId);
        const shape = Tilemap.getAutotileShape(tileId);
        const tx = kind % 8;
        const ty = Math.floor(kind / 8);
        let setNumber = 0;
        let bx = 0;
        let by = 0;
        let autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
        let isTable: number | boolean = false;

        if (Tilemap.isTileA1(tileId)) {
            const waterSurfaceIndex = [0, 1, 2, 1][this.animationFrame % 4];
            setNumber = 0;
            if (kind === 0) {
                bx = waterSurfaceIndex * 2;
                by = 0;
            } else if (kind === 1) {
                bx = waterSurfaceIndex * 2;
                by = 3;
            } else if (kind === 2) {
                bx = 6;
                by = 0;
            } else if (kind === 3) {
                bx = 6;
                by = 3;
            } else {
                bx = Math.floor(tx / 4) * 8;
                by = ty * 6 + (Math.floor(tx / 2) % 2) * 3;
                if (kind % 2 === 0) {
                    bx += waterSurfaceIndex * 2;
                } else {
                    bx += 6;
                    autotileTable = Tilemap.WATERFALL_AUTOTILE_TABLE;
                    by += this.animationFrame % 3;
                }
            }
        } else if (Tilemap.isTileA2(tileId)) {
            setNumber = 1;
            bx = tx * 2;
            by = (ty - 2) * 3;
            isTable = this._isTableTile(tileId);
        } else if (Tilemap.isTileA3(tileId)) {
            setNumber = 2;
            bx = tx * 2;
            by = (ty - 6) * 2;
            autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
        } else if (Tilemap.isTileA4(tileId)) {
            setNumber = 3;
            bx = tx * 2;
            by = Math.floor((ty - 10) * 2.5 + (ty % 2 === 1 ? 0.5 : 0));
            if (ty % 2 === 1) {
                autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
            }
        }

        const table = autotileTable[shape];
        const w1 = this.tileWidth / 2;
        const h1 = this.tileHeight / 2;
        for (let i = 0; i < 4; i++) {
            const qsx = table[i][0];
            const qsy = table[i][1];
            const sx1 = (bx * 2 + qsx) * w1;
            const sy1 = (by * 2 + qsy) * h1;
            const dx1 = dx + (i % 2) * w1;
            const dy1 = dy + Math.floor(i / 2) * h1;
            if (isTable && (qsy === 1 || qsy === 5)) {
                const qsx2 = qsy === 1 ? (4 - qsx) % 4 : qsx;
                const qsy2 = 3;
                const sx2 = (bx * 2 + qsx2) * w1;
                const sy2 = (by * 2 + qsy2) * h1;
                layer.addRect(setNumber, sx2, sy2, dx1, dy1, w1, h1);
                layer.addRect(setNumber, sx1, sy1, dx1, dy1 + h1 / 2, w1, h1 / 2);
            } else {
                layer.addRect(setNumber, sx1, sy1, dx1, dy1, w1, h1);
            }
        }
    }

    _addTableEdge(layer: TilemapCombinedLayer, tileId: RMMZ.TileID, dx: number, dy: number): void {
        if (Tilemap.isTileA2(tileId)) {
            const autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
            const kind = Tilemap.getAutotileKind(tileId);
            const shape = Tilemap.getAutotileShape(tileId);
            const tx = kind % 8;
            const ty = Math.floor(kind / 8);
            const setNumber = 1;
            const bx = tx * 2;
            const by = (ty - 2) * 3;
            const table = autotileTable[shape];
            const w1 = this.tileWidth / 2;
            const h1 = this.tileHeight / 2;
            for (let i = 0; i < 2; i++) {
                const qsx = table[2 + i][0];
                const qsy = table[2 + i][1];
                const sx1 = (bx * 2 + qsx) * w1;
                const sy1 = (by * 2 + qsy) * h1 + h1 / 2;
                const dx1 = dx + (i % 2) * w1;
                const dy1 = dy + Math.floor(i / 2) * h1;
                layer.addRect(setNumber, sx1, sy1, dx1, dy1, w1, h1 / 2);
            }
        }
    }

    _addShadow(layer: TilemapCombinedLayer, shadowBits: number, dx: number, dy: number): void {
        if (shadowBits & 0x0f) {
            const w1 = this.tileWidth / 2;
            const h1 = this.tileHeight / 2;
            for (let i = 0; i < 4; i++) {
                if (shadowBits & (1 << i)) {
                    const dx1 = dx + (i % 2) * w1;
                    const dy1 = dy + Math.floor(i / 2) * h1;
                    layer.addRect(-1, 0, 0, dx1, dy1, w1, h1);
                }
            }
        }
    }

    _readMapData(x: number, y: number, z: number): number {
        if (this._mapData) {
            const width = this._mapWidth;
            const height = this._mapHeight;
            if (this.horizontalWrap) {
                x = x.mod(width);
            }
            if (this.verticalWrap) {
                y = y.mod(height);
            }
            if (x >= 0 && x < width && y >= 0 && y < height) {
                return this._mapData[(z * height + y) * width + x] || 0;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }

    _isHigherTile(tileId: RMMZ.TileID): number {
        return this.flags[tileId] & 0x10;
    }

    _isTableTile(tileId: RMMZ.TileID): number | boolean {
        return Tilemap.isTileA2(tileId) && this.flags[tileId] & 0x80;
    }

    _isOverpassPosition(mx: number, my: number): boolean;
    _isOverpassPosition(/*mx, my*/): boolean {
        return false;
    }

    _sortChildren(): void {
        const sorted = this.children.slice().sort(this._compareChildOrder as Tilemap.ChildComparator | undefined);
        for (let i = 0; i < sorted.length; i++) {
            sorted[i].zIndex = i;
        }
    }

    _compareChildOrder(a: Tilemap.Child, b: Tilemap.Child): number {
        if (a.z !== b.z) {
            return a.z - b.z;
        } else if (a.y !== b.y) {
            return a.y - b.y;
        } else {
            return a.spriteId - b.spriteId;
        }
    }

    // Tile type checkers
    static readonly TILE_ID_B = 0;

    static readonly TILE_ID_C = 256;

    static readonly TILE_ID_D = 512;

    static readonly TILE_ID_E = 768;

    static readonly TILE_ID_A5 = 1536;

    static readonly TILE_ID_A1 = 2048;

    static readonly TILE_ID_A2 = 2816;

    static readonly TILE_ID_A3 = 4352;

    static readonly TILE_ID_A4 = 5888;

    static readonly TILE_ID_MAX = 8192;

    static isVisibleTile(tileId: RMMZ.TileID): boolean {
        return tileId > 0 && tileId < this.TILE_ID_MAX;
    }

    static isAutotile(tileId: RMMZ.TileID): boolean {
        return tileId >= this.TILE_ID_A1;
    }

    static getAutotileKind(tileId: RMMZ.TileID): number {
        return Math.floor((tileId - this.TILE_ID_A1) / 48);
    }

    static getAutotileShape(tileId: RMMZ.TileID): number {
        return (tileId - this.TILE_ID_A1) % 48;
    }

    static makeAutotileId(kind: number, shape: number): number {
        return this.TILE_ID_A1 + kind * 48 + shape;
    }

    static isSameKindTile(tileID1: number, tileID2: number): boolean {
        if (this.isAutotile(tileID1) && this.isAutotile(tileID2)) {
            return this.getAutotileKind(tileID1) === this.getAutotileKind(tileID2);
        } else {
            return tileID1 === tileID2;
        }
    }

    static isTileA1(tileId: RMMZ.TileID): boolean {
        return tileId >= this.TILE_ID_A1 && tileId < this.TILE_ID_A2;
    }

    static isTileA2(tileId: RMMZ.TileID): boolean {
        return tileId >= this.TILE_ID_A2 && tileId < this.TILE_ID_A3;
    }

    static isTileA3(tileId: RMMZ.TileID): boolean {
        return tileId >= this.TILE_ID_A3 && tileId < this.TILE_ID_A4;
    }

    static isTileA4(tileId: RMMZ.TileID): boolean {
        return tileId >= this.TILE_ID_A4 && tileId < this.TILE_ID_MAX;
    }

    static isTileA5(tileId: RMMZ.TileID): boolean {
        return tileId >= this.TILE_ID_A5 && tileId < this.TILE_ID_A1;
    }

    static isWaterTile(tileId: RMMZ.TileID): boolean {
        if (this.isTileA1(tileId)) {
            return !(tileId >= this.TILE_ID_A1 + 96 && tileId < this.TILE_ID_A1 + 192);
        } else {
            return false;
        }
    }

    static isWaterfallTile(tileId: RMMZ.TileID): boolean {
        if (tileId >= this.TILE_ID_A1 + 192 && tileId < this.TILE_ID_A2) {
            return this.getAutotileKind(tileId) % 2 === 1;
        } else {
            return false;
        }
    }

    static isGroundTile(tileId: RMMZ.TileID): boolean {
        return this.isTileA1(tileId) || this.isTileA2(tileId) || this.isTileA5(tileId);
    }

    static isShadowingTile(tileId: RMMZ.TileID): boolean {
        return this.isTileA3(tileId) || this.isTileA4(tileId);
    }

    static isRoofTile(tileId: RMMZ.TileID): boolean {
        return this.isTileA3(tileId) && this.getAutotileKind(tileId) % 16 < 8;
    }

    static isWallTopTile(tileId: RMMZ.TileID): boolean {
        return this.isTileA4(tileId) && this.getAutotileKind(tileId) % 16 < 8;
    }

    static isWallSideTile(tileId: RMMZ.TileID): boolean {
        return (this.isTileA3(tileId) || this.isTileA4(tileId)) && this.getAutotileKind(tileId) % 16 >= 8;
    }

    static isWallTile(tileId: RMMZ.TileID): boolean {
        return this.isWallTopTile(tileId) || this.isWallSideTile(tileId);
    }

    static isFloorTypeAutotile(tileId: RMMZ.TileID): boolean {
        return (
            (this.isTileA1(tileId) && !this.isWaterfallTile(tileId)) ||
            this.isTileA2(tileId) ||
            this.isWallTopTile(tileId)
        );
    }

    static isWallTypeAutotile(tileId: RMMZ.TileID): boolean {
        return this.isRoofTile(tileId) || this.isWallSideTile(tileId);
    }

    static isWaterfallTypeAutotile(tileId: RMMZ.TileID): boolean {
        return this.isWaterfallTile(tileId);
    }

    // Autotile shape number to coordinates of tileset images
    // prettier-ignore

    static FLOOR_AUTOTILE_TABLE: number[][][] = [
        [[2, 4], [1, 4], [2, 3], [1, 3]],
        [[2, 0], [1, 4], [2, 3], [1, 3]],
        [[2, 4], [3, 0], [2, 3], [1, 3]],
        [[2, 0], [3, 0], [2, 3], [1, 3]],
        [[2, 4], [1, 4], [2, 3], [3, 1]],
        [[2, 0], [1, 4], [2, 3], [3, 1]],
        [[2, 4], [3, 0], [2, 3], [3, 1]],
        [[2, 0], [3, 0], [2, 3], [3, 1]],
        [[2, 4], [1, 4], [2, 1], [1, 3]],
        [[2, 0], [1, 4], [2, 1], [1, 3]],
        [[2, 4], [3, 0], [2, 1], [1, 3]],
        [[2, 0], [3, 0], [2, 1], [1, 3]],
        [[2, 4], [1, 4], [2, 1], [3, 1]],
        [[2, 0], [1, 4], [2, 1], [3, 1]],
        [[2, 4], [3, 0], [2, 1], [3, 1]],
        [[2, 0], [3, 0], [2, 1], [3, 1]],
        [[0, 4], [1, 4], [0, 3], [1, 3]],
        [[0, 4], [3, 0], [0, 3], [1, 3]],
        [[0, 4], [1, 4], [0, 3], [3, 1]],
        [[0, 4], [3, 0], [0, 3], [3, 1]],
        [[2, 2], [1, 2], [2, 3], [1, 3]],
        [[2, 2], [1, 2], [2, 3], [3, 1]],
        [[2, 2], [1, 2], [2, 1], [1, 3]],
        [[2, 2], [1, 2], [2, 1], [3, 1]],
        [[2, 4], [3, 4], [2, 3], [3, 3]],
        [[2, 4], [3, 4], [2, 1], [3, 3]],
        [[2, 0], [3, 4], [2, 3], [3, 3]],
        [[2, 0], [3, 4], [2, 1], [3, 3]],
        [[2, 4], [1, 4], [2, 5], [1, 5]],
        [[2, 0], [1, 4], [2, 5], [1, 5]],
        [[2, 4], [3, 0], [2, 5], [1, 5]],
        [[2, 0], [3, 0], [2, 5], [1, 5]],
        [[0, 4], [3, 4], [0, 3], [3, 3]],
        [[2, 2], [1, 2], [2, 5], [1, 5]],
        [[0, 2], [1, 2], [0, 3], [1, 3]],
        [[0, 2], [1, 2], [0, 3], [3, 1]],
        [[2, 2], [3, 2], [2, 3], [3, 3]],
        [[2, 2], [3, 2], [2, 1], [3, 3]],
        [[2, 4], [3, 4], [2, 5], [3, 5]],
        [[2, 0], [3, 4], [2, 5], [3, 5]],
        [[0, 4], [1, 4], [0, 5], [1, 5]],
        [[0, 4], [3, 0], [0, 5], [1, 5]],
        [[0, 2], [3, 2], [0, 3], [3, 3]],
        [[0, 2], [1, 2], [0, 5], [1, 5]],
        [[0, 4], [3, 4], [0, 5], [3, 5]],
        [[2, 2], [3, 2], [2, 5], [3, 5]],
        [[0, 2], [3, 2], [0, 5], [3, 5]],
        [[0, 0], [1, 0], [0, 1], [1, 1]]
    ];

    // prettier-ignore

    static WALL_AUTOTILE_TABLE: number[][][] = [
        [[2, 2], [1, 2], [2, 1], [1, 1]],
        [[0, 2], [1, 2], [0, 1], [1, 1]],
        [[2, 0], [1, 0], [2, 1], [1, 1]],
        [[0, 0], [1, 0], [0, 1], [1, 1]],
        [[2, 2], [3, 2], [2, 1], [3, 1]],
        [[0, 2], [3, 2], [0, 1], [3, 1]],
        [[2, 0], [3, 0], [2, 1], [3, 1]],
        [[0, 0], [3, 0], [0, 1], [3, 1]],
        [[2, 2], [1, 2], [2, 3], [1, 3]],
        [[0, 2], [1, 2], [0, 3], [1, 3]],
        [[2, 0], [1, 0], [2, 3], [1, 3]],
        [[0, 0], [1, 0], [0, 3], [1, 3]],
        [[2, 2], [3, 2], [2, 3], [3, 3]],
        [[0, 2], [3, 2], [0, 3], [3, 3]],
        [[2, 0], [3, 0], [2, 3], [3, 3]],
        [[0, 0], [3, 0], [0, 3], [3, 3]]
    ];

    // prettier-ignore

    static WATERFALL_AUTOTILE_TABLE: number[][][] = [
        [[2, 0], [1, 0], [2, 1], [1, 1]],
        [[0, 0], [1, 0], [0, 1], [1, 1]],
        [[2, 0], [3, 0], [2, 1], [3, 1]],
        [[0, 0], [3, 0], [0, 1], [3, 1]]
    ];
    static createShader() {
        const vertex = `
        in float aTextureId;
        in vec4 aFrame;
        in vec2 aSource;
        in vec2 aPosition;
        uniform mat3 uProjectionMatrix;
        uniform mat3 uWorldTransformMatrix;
        uniform mat3 uTransformMatrix;
        out vec4 vFrame;
        out vec2 vTextureCoord;
        out float vTextureId;

        void main() {
            mat3 transform = uProjectionMatrix * uWorldTransformMatrix * uTransformMatrix;
            gl_Position = vec4((transform * vec3(aPosition, 1.0)).xy, 0.0, 1.0);
            vFrame = aFrame;
            vTextureCoord = aSource;
            vTextureId = aTextureId;
        }
    `;
        const fragment = `
        in vec4 vFrame;
        in vec2 vTextureCoord;
        in float vTextureId;
        uniform sampler2D uSampler0;
        uniform sampler2D uSampler1;
        uniform sampler2D uSampler2;
        uniform vec4 uColor;
        uniform vec4 uWorldColorAlpha;
        out vec4 finalColor;

        void main() {
            vec2 uv = clamp(vTextureCoord, vFrame.xy, vFrame.zw) / 2048.0;
            vec4 color;
            if (vTextureId < 0.0) {
                color = vec4(0.0, 0.0, 0.0, 0.5);
            } else if (vTextureId < 0.5) {
                color = texture(uSampler0, uv);
            } else if (vTextureId < 1.5) {
                color = texture(uSampler1, uv);
            } else {
                color = texture(uSampler2, uv);
            }
            finalColor = color * uColor * uWorldColorAlpha;
        }
    `;
        const source = PIXI.Texture.EMPTY.source;
        return PIXI.Shader.from({
            gl: { vertex, fragment },
            resources: {
                uSampler0: source,
                uSampler1: source,
                uSampler2: source,
            },
        });
    }
}

declare namespace Tilemap {
    export type Layer = TilemapLayer;
    export type CombinedLayer = TilemapCombinedLayer;

    export type Child = import("pixi.js").ContainerChild & {
        z: number;
        spriteId: number;
    };

    export type ChildComparator = (a: import("pixi.js").ContainerChild, b: import("pixi.js").ContainerChild) => number;
}

// Internal classes

class TilemapLayer extends PIXI.Mesh<import("pixi.js").Geometry, import("pixi.js").Shader> {
    declare _elements: Array<TilemapLayer.Element>;
    declare _indexArray: Uint16Array;
    declare _vertexArray: Float32Array;
    declare _needsVertexUpdate: boolean;

    constructor(shader: import("pixi.js").Shader) {
        const vertices = new PIXI.Buffer({
            data: new Float32Array(0),
            usage: PIXI.BufferUsage.VERTEX | PIXI.BufferUsage.COPY_DST,
            shrinkToFit: false,
        });
        const indices = new PIXI.Buffer({
            data: new Uint16Array(0),
            usage: PIXI.BufferUsage.INDEX | PIXI.BufferUsage.COPY_DST,
            shrinkToFit: false,
        });
        const attribute = (format: import("pixi.js").VertexFormat, offset: number) => ({
            buffer: vertices,
            format,
            stride: 9 * Float32Array.BYTES_PER_ELEMENT,
            offset: offset * Float32Array.BYTES_PER_ELEMENT,
        });
        const geometry = new PIXI.Geometry({
            attributes: {
                aTextureId: attribute("float32", 0),
                aFrame: attribute("float32x4", 1),
                aSource: attribute("float32x2", 5),
                aPosition: attribute("float32x2", 7),
            },
            indexBuffer: indices,
        });
        super({ geometry, shader });
        this.initialize(shader);
    }

    initialize(shader: import("pixi.js").Shader): void;
    initialize(...args: any[]): void;
    initialize(): void {
        this._elements = [];
        this._indexArray = new Uint16Array(0);
        this._vertexArray = new Float32Array(0);
        this._needsVertexUpdate = false;
        this.onRender = this._updateGeometry;
    }

    // Four vertices per tile must fit in the 16-bit index buffer.
    static readonly MAX_SIZE = 16000;

    destroy(): void {
        const geometry = this.geometry;
        super.destroy();
        geometry.destroy(true);
    }

    clear(): void {
        this._elements.length = 0;
        this._needsVertexUpdate = true;
    }

    size(): number {
        return this._elements.length;
    }

    addRect(setNumber: number, sx: number, sy: number, dx: number, dy: number, w: number, h: number): void {
        this._elements.push([setNumber, sx, sy, dx, dy, w, h]);
        this._needsVertexUpdate = true;
    }

    _updateGeometry(): void {
        if (this._needsVertexUpdate) {
            this._updateIndexBuffer();
            this._updateVertexBuffer();
            this._needsVertexUpdate = false;
        }
        this.renderable = this._elements.length > 0;
    }

    _updateIndexBuffer(): void {
        const count = this._elements.length;
        const indexCount = count * 6;
        if (this._indexArray.length < indexCount) {
            const capacity = Math.min(count * 2, Tilemap.Layer.MAX_SIZE);
            const indices = new Uint16Array(capacity * 6);
            for (let i = 0; i < capacity; i++) {
                const index = i * 6;
                const vertex = i * 4;
                indices[index] = vertex;
                indices[index + 1] = vertex + 1;
                indices[index + 2] = vertex + 2;
                indices[index + 3] = vertex;
                indices[index + 4] = vertex + 2;
                indices[index + 5] = vertex + 3;
            }
            this._indexArray = indices;
        }
        const indexBuffer = this.geometry.getIndex();
        if (indexBuffer.data.length !== indexCount) {
            indexBuffer.data = this._indexArray.subarray(0, indexCount);
        }
    }

    _updateVertexBuffer(): void {
        const numElements = this._elements.length;
        const required = numElements * 4 * 9;
        if (this._vertexArray.length < required) {
            this._vertexArray = new Float32Array(required * 2);
        }
        const vertexArray = this._vertexArray;
        let index = 0;
        for (const item of this._elements) {
            const setNumber = item[0];
            const tid = setNumber >> 2;
            const sxOffset = 1024 * (setNumber & 1);
            const syOffset = 1024 * ((setNumber >> 1) & 1);
            const sx = item[1] + sxOffset;
            const sy = item[2] + syOffset;
            const dx = item[3];
            const dy = item[4];
            const w = item[5];
            const h = item[6];
            const frameLeft = sx + 0.5;
            const frameTop = sy + 0.5;
            const frameRight = sx + w - 0.5;
            const frameBottom = sy + h - 0.5;
            vertexArray[index++] = tid;
            vertexArray[index++] = frameLeft;
            vertexArray[index++] = frameTop;
            vertexArray[index++] = frameRight;
            vertexArray[index++] = frameBottom;
            vertexArray[index++] = sx;
            vertexArray[index++] = sy;
            vertexArray[index++] = dx;
            vertexArray[index++] = dy;
            vertexArray[index++] = tid;
            vertexArray[index++] = frameLeft;
            vertexArray[index++] = frameTop;
            vertexArray[index++] = frameRight;
            vertexArray[index++] = frameBottom;
            vertexArray[index++] = sx + w;
            vertexArray[index++] = sy;
            vertexArray[index++] = dx + w;
            vertexArray[index++] = dy;
            vertexArray[index++] = tid;
            vertexArray[index++] = frameLeft;
            vertexArray[index++] = frameTop;
            vertexArray[index++] = frameRight;
            vertexArray[index++] = frameBottom;
            vertexArray[index++] = sx + w;
            vertexArray[index++] = sy + h;
            vertexArray[index++] = dx + w;
            vertexArray[index++] = dy + h;
            vertexArray[index++] = tid;
            vertexArray[index++] = frameLeft;
            vertexArray[index++] = frameTop;
            vertexArray[index++] = frameRight;
            vertexArray[index++] = frameBottom;
            vertexArray[index++] = sx;
            vertexArray[index++] = sy + h;
            vertexArray[index++] = dx;
            vertexArray[index++] = dy + h;
        }
        this.geometry.getBuffer("aPosition").setDataWithSize(vertexArray, required, true);
    }
}

declare namespace TilemapLayer {
    export type Element = [
        setNumber: number,
        sx: number,
        sy: number,
        dx: number,
        dy: number,
        width: number,
        height: number,
    ];
}
Tilemap.Layer = TilemapLayer;

class TilemapCombinedLayer extends PIXI.Container {
    declare z: number;
    declare children: TilemapLayer[];

    constructor(...args: [shader: import("pixi.js").Shader]) {
        super();
        this.initialize(...args);
    }

    initialize(shader: import("pixi.js").Shader): void;
    initialize(...args: any[]): void;
    initialize(shader: import("pixi.js").Shader): void {
        for (let i = 0; i < 2; i++) {
            this.addChild(new Tilemap.Layer(shader));
        }
    }

    clear(): void {
        for (const child of this.children) {
            child.clear();
        }
    }

    size(): number {
        return this.children.reduce((r, child) => r + child.size(), 0);
    }

    // prettier-ignore
    addRect(
        setNumber: number, sx: number, sy: number, dx: number, dy: number, w: number, h: number
    ): void {
        for (const child of this.children) {
            if (child.size() < Tilemap.Layer.MAX_SIZE) {
                child.addRect(setNumber, sx, sy, dx, dy, w, h);
                break;
            }
        }
    }
}
Tilemap.CombinedLayer = TilemapCombinedLayer;

/**
 * The sprite object for a tiling image.
 * @param bitmap - The image for the tiling sprite.
 */
class TilingSprite extends PIXI.TilingSprite {
    declare children: RMMZ.UpdateableChild[];
    declare _bitmap: Bitmap;
    declare _frame: Rectangle;

    constructor(...args: unknown[]) {
        super({
            texture: new PIXI.Texture({
                source: PIXI.Texture.EMPTY.source,
                frame: new PIXI.Rectangle(0, 0, 1, 1),
                dynamic: true,
            }),
        });
        this.onRender = this._updateTilePosition;
        this.initialize(...args);
    }

    initialize(bitmap?: Bitmap): void;
    initialize(...args: any[]): void;
    initialize(bitmap?: Bitmap): void {
        this._bitmap = bitmap!;
        this.width = 0;
        this.height = 0;
        this._frame = new PIXI.Rectangle();

        /**
         * The origin point of the tiling sprite for scrolling.
         */
        this.origin = new PIXI.Point();

        this._onBitmapChange();
    }

    /**
     * The image for the tiling sprite.
     * @name TilingSprite#bitmap
     */
    get bitmap(): Bitmap {
        return this._bitmap;
    }

    set bitmap(value: Bitmap) {
        if (this._bitmap !== value) {
            this._bitmap = value;
            this._onBitmapChange();
        }
    }

    /**
     * The opacity of the tiling sprite (0 to 255).
     * @name TilingSprite#opacity
     */
    get opacity(): number {
        return this.alpha * 255;
    }

    set opacity(value: number) {
        this.alpha = value.clamp(0, 255) / 255;
    }

    /**
     * Destroys the tiling sprite.
     */
    destroy(): void {
        const options = { children: true, texture: true };
        super.destroy(options);
    }

    /**
     * Updates the tiling sprite for each frame.
     */
    update(): void {
        for (const child of this.children) {
            if (child.update) {
                child.update();
            }
        }
    }

    /**
     * Sets the x, y, width, and height all at once.
     * @param x - The x coordinate of the tiling sprite.
     * @param y - The y coordinate of the tiling sprite.
     * @param width - The width of the tiling sprite.
     * @param height - The height of the tiling sprite.
     */
    move(x: number, y: number, width: number, height: number): void {
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 0;
        this.height = height || 0;
    }

    /**
     * Specifies the region of the image that the tiling sprite will use.
     * @param x - The x coordinate of the frame.
     * @param y - The y coordinate of the frame.
     * @param width - The width of the frame.
     * @param height - The height of the frame.
     */
    setFrame(x: number, y: number, width: number, height: number): void {
        this._frame.x = x;
        this._frame.y = y;
        this._frame.width = width;
        this._frame.height = height;
        this._refresh();
    }

    _updateTilePosition(): void {
        this.tilePosition.x = Math.round(-this.origin.x);
        this.tilePosition.y = Math.round(-this.origin.y);
    }

    _onBitmapChange(): void {
        if (this._bitmap) {
            this._bitmap.addLoadListener((bitmap) => {
                if (this._bitmap === bitmap) {
                    this._refresh();
                }
            });
        }
        this._refresh();
    }

    _refresh(): void {
        const texture = this.texture;
        const source = this._bitmap?.textureSource;
        if (source) {
            const frame = this._frame.clone();
            if (frame.width === 0 && frame.height === 0) {
                frame.width = source.width;
                frame.height = source.height;
            }
            texture.frame.copyFrom(frame);
        } else {
            texture.frame.copyFrom(PIXI.Texture.EMPTY.frame);
        }
        const nextSource = source ?? PIXI.Texture.EMPTY.source;
        if (texture.source !== nextSource) {
            texture.source = nextSource;
        }
        texture.update();
    }
}

/**
 * The sprite which covers the entire game screen.
 */
class ScreenSprite extends PIXI.Container {
    declare _graphics: import("pixi.js").Graphics;
    declare _red: number;
    declare _green: number;
    declare _blue: number;

    constructor(...args: []) {
        super();
        this.initialize(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        this._graphics = new PIXI.Graphics();
        this.addChild(this._graphics);
        this.opacity = 0;
        this._red = -1;
        this._green = -1;
        this._blue = -1;
        this.setBlack();
    }

    /**
     * The opacity of the sprite (0 to 255).
     * @name ScreenSprite#opacity
     */
    get opacity(): number {
        return this.alpha * 255;
    }

    set opacity(value: number) {
        this.alpha = value.clamp(0, 255) / 255;
    }

    /**
     * Destroys the screen sprite.
     */
    destroy(): void {
        const options = { children: true, texture: true };
        super.destroy(options);
    }

    /**
     * Sets black to the color of the screen sprite.
     */
    setBlack(): void {
        this.setColor(0, 0, 0);
    }

    /**
     * Sets white to the color of the screen sprite.
     */
    setWhite(): void {
        this.setColor(255, 255, 255);
    }

    /**
     * Sets the color of the screen sprite by values.
     * @param r - The red value in the range (0, 255).
     * @param g - The green value in the range (0, 255).
     * @param b - The blue value in the range (0, 255).
     */
    setColor(r: number, g: number, b: number): void {
        if (this._red !== r || this._green !== g || this._blue !== b) {
            r = Math.round(r || 0).clamp(0, 255);
            g = Math.round(g || 0).clamp(0, 255);
            b = Math.round(b || 0).clamp(0, 255);
            this._red = r;
            this._green = g;
            this._blue = b;
            const graphics = this._graphics;
            graphics
                .clear()
                .rect(-50000, -50000, 100000, 100000)
                .fill((r << 16) | (g << 8) | b);
        }
    }
}

/**
 * The window in the game.
 */
class RmmzWindow extends PIXI.Container {
    declare children: RMMZ.UpdateableChild[];
    declare _windowLayerMask: import("pixi.js").Graphics | undefined;

    declare _isWindow: boolean;
    declare _windowskin: Bitmap;
    declare _width: number;
    declare _height: number;
    declare _cursorRect: Rectangle;
    declare _openness: number;
    declare _animationCount: number;
    declare _padding: number;
    declare _margin: number;
    declare _colorTone: RMMZ.Color;
    declare _innerChildren: import("pixi.js").ContainerChild[];
    declare _container: import("pixi.js").Container;
    declare _backSprite: Sprite;
    declare _frameSprite: Sprite;
    declare _contentsBackSprite: Sprite;
    declare _cursorSprite: Sprite;
    declare _contentsSprite: Sprite;
    declare _downArrowSprite: Sprite;
    declare _upArrowSprite: Sprite;
    declare _pauseSignSprite: Sprite;
    declare active: boolean;
    declare frameVisible: boolean;
    declare cursorVisible: boolean;
    declare downArrowVisible: boolean;
    declare upArrowVisible: boolean;
    declare pause: boolean;
    declare _clientArea: Sprite;

    constructor();
    constructor(..._extra: unknown[]);
    constructor(...args: unknown[]) {
        super();
        this.initialize(...args);
    }

    initialize(..._args: any[]): void;
    initialize(...args: any[]): void;
    initialize(..._args: any[]): void {
        this.onRender = this._updateWindowParts;
        this._isWindow = true;
        this._windowskin = null!;
        this._width = 0;
        this._height = 0;
        this._cursorRect = new PIXI.Rectangle();
        this._openness = 255;
        this._animationCount = 0;
        this._padding = 12;
        this._margin = 4;
        this._colorTone = [0, 0, 0, 0];
        this._innerChildren = [];
        this._container = null!;
        this._backSprite = null!;
        this._frameSprite = null!;
        this._contentsBackSprite = null!;
        this._cursorSprite = null!;
        this._contentsSprite = null!;
        this._downArrowSprite = null!;
        this._upArrowSprite = null!;
        this._pauseSignSprite = null!;

        this._createAllParts();

        /**
         * The origin point of the window for scrolling.
         */
        this.origin = new PIXI.Point();

        /**
         * The active state for the window.
         */
        this.active = true;

        /**
         * The visibility of the frame.
         */
        this.frameVisible = true;

        /**
         * The visibility of the cursor.
         */
        this.cursorVisible = true;

        /**
         * The visibility of the down scroll arrow.
         */
        this.downArrowVisible = false;

        /**
         * The visibility of the up scroll arrow.
         */
        this.upArrowVisible = false;

        /**
         * The visibility of the pause sign.
         */
        this.pause = false;
    }

    /**
     * The image used as a window skin.
     * @name Window#windowskin
     */
    get windowskin(): Bitmap {
        return this._windowskin;
    }

    set windowskin(value: Bitmap) {
        if (this._windowskin !== value) {
            this._windowskin = value;
            this._windowskin.addLoadListener(this._onWindowskinLoad.bind(this));
        }
    }

    /**
     * The bitmap used for the window contents.
     * @name Window#contents
     */
    get contents(): Bitmap {
        return this._contentsSprite.bitmap;
    }

    set contents(value: Bitmap) {
        this._contentsSprite.bitmap = value;
    }

    /**
     * The bitmap used for the window contents background.
     * @name Window#contentsBack
     */
    get contentsBack(): Bitmap {
        return this._contentsBackSprite.bitmap;
    }

    set contentsBack(value: Bitmap) {
        this._contentsBackSprite.bitmap = value;
    }

    /**
     * The width of the window in pixels.
     * @name Window#width
     */
    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
        this._refreshAllParts();
    }

    /**
     * The height of the window in pixels.
     * @name Window#height
     */
    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
        this._refreshAllParts();
    }

    /**
     * The size of the padding between the frame and contents.
     * @name Window#padding
     */
    get padding(): number {
        return this._padding;
    }

    set padding(value: number) {
        this._padding = value;
        this._refreshAllParts();
    }

    /**
     * The size of the margin for the window background.
     * @name Window#margin
     */
    get margin(): number {
        return this._margin;
    }

    set margin(value: number) {
        this._margin = value;
        this._refreshAllParts();
    }

    /**
     * The opacity of the window without contents (0 to 255).
     * @name Window#opacity
     */
    get opacity(): number {
        return this._container.alpha * 255;
    }

    set opacity(value: number) {
        this._container.alpha = value.clamp(0, 255) / 255;
    }

    /**
     * The opacity of the window background (0 to 255).
     * @name Window#backOpacity
     */
    get backOpacity(): number {
        return this._backSprite.alpha * 255;
    }

    set backOpacity(value: number) {
        this._backSprite.alpha = value.clamp(0, 255) / 255;
    }

    /**
     * The opacity of the window contents (0 to 255).
     * @name Window#contentsOpacity
     */
    get contentsOpacity(): number {
        return this._contentsSprite.alpha * 255;
    }

    set contentsOpacity(value: number) {
        this._contentsSprite.alpha = value.clamp(0, 255) / 255;
    }

    /**
     * The openness of the window (0 to 255).
     * @name Window#openness
     */
    get openness(): number {
        return this._openness;
    }

    set openness(value: number) {
        if (this._openness !== value) {
            this._openness = value.clamp(0, 255);
            this._container.scale.y = this._openness / 255;
            this._container.y = (this.height / 2) * (1 - this._openness / 255);
        }
    }

    /**
     * The width of the content area in pixels.
     * @name Window#innerWidth
     */
    get innerWidth(): number {
        return Math.max(0, this._width - this._padding * 2);
    }

    /**
     * The height of the content area in pixels.
     * @name Window#innerHeight
     */
    get innerHeight(): number {
        return Math.max(0, this._height - this._padding * 2);
    }

    /**
     * The rectangle of the content area.
     * @name Window#innerRect
     */
    get innerRect(): Rectangle {
        return new PIXI.Rectangle(this._padding, this._padding, this.innerWidth, this.innerHeight);
    }

    /**
     * Destroys the window.
     */
    destroy(options?: import("pixi.js").DestroyOptions): void;
    destroy(): void {
        const options = { children: true, texture: true };
        super.destroy(options);
    }

    /**
     * Updates the window for each frame.
     */
    update(): void {
        if (this.active) {
            this._animationCount++;
        }
        for (const child of this.children) {
            if (child.update) {
                child.update();
            }
        }
    }

    /**
     * Sets the x, y, width, and height all at once.
     * @param x - The x coordinate of the window.
     * @param y - The y coordinate of the window.
     * @param width - The width of the window.
     * @param height - The height of the window.
     */
    move(x: number, y: number, width: number, height: number): void {
        this.x = x || 0;
        this.y = y || 0;
        if (this._width !== width || this._height !== height) {
            this._width = width || 0;
            this._height = height || 0;
            this._refreshAllParts();
        }
    }

    /**
     * Checks whether the window is completely open (openness == 255).
     * @returns True if the window is open.
     */
    isOpen(): boolean {
        return this._openness >= 255;
    }

    /**
     * Checks whether the window is completely closed (openness == 0).
     * @returns True if the window is closed.
     */
    isClosed(): boolean {
        return this._openness <= 0;
    }

    /**
     * Sets the position of the command cursor.
     * @param x - The x coordinate of the cursor.
     * @param y - The y coordinate of the cursor.
     * @param width - The width of the cursor.
     * @param height - The height of the cursor.
     */
    setCursorRect(x: number, y: number, width: number, height: number): void {
        const cw = Math.floor(width || 0);
        const ch = Math.floor(height || 0);
        this._cursorRect.x = Math.floor(x || 0);
        this._cursorRect.y = Math.floor(y || 0);
        if (this._cursorRect.width !== cw || this._cursorRect.height !== ch) {
            this._cursorRect.width = cw;
            this._cursorRect.height = ch;
            this._refreshCursor();
        }
    }

    /**
     * Moves the cursor position by the given amount.
     * @param x - The amount of horizontal movement.
     * @param y - The amount of vertical movement.
     */
    moveCursorBy(x: number, y: number): void {
        this._cursorRect.x += x;
        this._cursorRect.y += y;
    }

    /**
     * Moves the inner children by the given amount.
     * @param x - The amount of horizontal movement.
     * @param y - The amount of vertical movement.
     */
    moveInnerChildrenBy(x: number, y: number): void {
        for (const child of this._innerChildren) {
            child.x += x;
            child.y += y;
        }
    }

    /**
     * Changes the color of the background.
     * @param r - The red value in the range (-255, 255).
     * @param g - The green value in the range (-255, 255).
     * @param b - The blue value in the range (-255, 255).
     */
    setTone(r: number, g: number, b: number): void {
        const tone = this._colorTone;
        if (r !== tone[0] || g !== tone[1] || b !== tone[2]) {
            this._colorTone = [r, g, b, 0];
            this._refreshBack();
        }
    }

    /**
     * Adds a child between the background and contents.
     * @param child - The child to add.
     * @returns The child that was added.
     */
    addChildToBack(child: import("pixi.js").ContainerChild): import("pixi.js").ContainerChild {
        const containerIndex = this.children.indexOf(this._container);
        return this.addChildAt(child, containerIndex + 1);
    }

    /**
     * Adds a child to the client area.
     * @param child - The child to add.
     * @returns The child that was added.
     */
    addInnerChild(child: import("pixi.js").ContainerChild): import("pixi.js").ContainerChild {
        this._innerChildren.push(child);
        return this._clientArea.addChild(child);
    }

    _updateWindowParts(): void {
        this._updateClientArea();
        this._updateFrame();
        this._updateContentsBack();
        this._updateCursor();
        this._updateContents();
        this._updateArrows();
        this._updatePauseSign();
        this._updateFilterArea();
    }

    openBounds(): import("pixi.js").Rectangle {
        const height = (this.height * this.openness) / 255;
        return new PIXI.Rectangle(this.x, this.y + (this.height - height) / 2, this.width, height);
    }

    _createAllParts(): void {
        this._createContainer();
        this._createBackSprite();
        this._createFrameSprite();
        this._createClientArea();
        this._createContentsBackSprite();
        this._createCursorSprite();
        this._createContentsSprite();
        this._createArrowSprites();
        this._createPauseSignSprites();
    }

    _createContainer(): void {
        this._container = new PIXI.Container();
        this.addChild(this._container);
    }

    _createBackSprite(): void {
        this._backSprite = new Sprite();
        this._backSprite.addChild(new TilingSprite());
        this._container.addChild(this._backSprite);
    }

    _createFrameSprite(): void {
        this._frameSprite = new Sprite();
        for (let i = 0; i < 8; i++) {
            this._frameSprite.addChild(new Sprite());
        }
        this._container.addChild(this._frameSprite);
    }

    _createClientArea(): void {
        this._clientArea = new Sprite();
        this._clientArea.filters = [new PIXI.AlphaFilter()];
        this._clientArea.filterArea = new PIXI.Rectangle();
        this._clientArea.move(this._padding, this._padding);
        this.addChild(this._clientArea);
    }

    _createContentsBackSprite(): void {
        this._contentsBackSprite = new Sprite();
        this._clientArea.addChild(this._contentsBackSprite);
    }

    _createCursorSprite(): void {
        this._cursorSprite = new Sprite();
        for (let i = 0; i < 9; i++) {
            this._cursorSprite.addChild(new Sprite());
        }
        this._clientArea.addChild(this._cursorSprite);
    }

    _createContentsSprite(): void {
        this._contentsSprite = new Sprite();
        this._clientArea.addChild(this._contentsSprite);
    }

    _createArrowSprites(): void {
        this._downArrowSprite = new Sprite();
        this.addChild(this._downArrowSprite);
        this._upArrowSprite = new Sprite();
        this.addChild(this._upArrowSprite);
    }

    _createPauseSignSprites(): void {
        this._pauseSignSprite = new Sprite();
        this.addChild(this._pauseSignSprite);
    }

    _onWindowskinLoad(): void {
        this._refreshAllParts();
    }

    _refreshAllParts(): void {
        this._refreshBack();
        this._refreshFrame();
        this._refreshCursor();
        this._refreshArrows();
        this._refreshPauseSign();
    }

    _refreshBack(): void {
        const m = this._margin;
        const w = Math.max(0, this._width - m * 2);
        const h = Math.max(0, this._height - m * 2);
        const sprite = this._backSprite;
        const tilingSprite = sprite.children[0] as TilingSprite;
        // [Note] We use 95 instead of 96 here to avoid blurring edges.
        sprite.bitmap = this._windowskin;
        sprite.setFrame(0, 0, 95, 95);
        sprite.move(m, m);
        sprite.scale.x = w / 95;
        sprite.scale.y = h / 95;
        tilingSprite.bitmap = this._windowskin;
        tilingSprite.setFrame(0, 96, 96, 96);
        tilingSprite.move(0, 0, w, h);
        tilingSprite.scale.x = 1 / sprite.scale.x;
        tilingSprite.scale.y = 1 / sprite.scale.y;
        sprite.setColorTone(this._colorTone);
    }

    _refreshFrame(): void {
        const drect = { x: 0, y: 0, width: this._width, height: this._height };
        const srect = { x: 96, y: 0, width: 96, height: 96 };
        const m = 24;
        for (const child of this._frameSprite.children as Sprite[]) {
            child.bitmap = this._windowskin;
        }
        this._setRectPartsGeometry(this._frameSprite, srect as Rectangle, drect, m);
    }

    _refreshCursor(): void {
        const drect = this._cursorRect.clone();
        const srect = { x: 96, y: 96, width: 48, height: 48 };
        const m = 4;
        for (const child of this._cursorSprite.children as Sprite[]) {
            child.bitmap = this._windowskin;
        }
        this._setRectPartsGeometry(this._cursorSprite, srect as Rectangle, drect, m);
    }

    _setRectPartsGeometry(
        sprite: Sprite,
        srect: Pick<Rectangle, "x" | "y" | "width" | "height">,
        drect: Pick<Rectangle, "x" | "y" | "width" | "height">,
        m: number,
    ): void {
        const sx = srect.x;
        const sy = srect.y;
        const sw = srect.width;
        const sh = srect.height;
        const dx = drect.x;
        const dy = drect.y;
        const dw = drect.width;
        const dh = drect.height;
        const smw = sw - m * 2;
        const smh = sh - m * 2;
        const dmw = dw - m * 2;
        const dmh = dh - m * 2;
        const children = sprite.children as Sprite[];
        sprite.setFrame(0, 0, dw, dh);
        sprite.move(dx, dy);
        // corner
        children[0].setFrame(sx, sy, m, m);
        children[1].setFrame(sx + sw - m, sy, m, m);
        children[2].setFrame(sx, sy + sw - m, m, m);
        children[3].setFrame(sx + sw - m, sy + sw - m, m, m);
        children[0].move(0, 0);
        children[1].move(dw - m, 0);
        children[2].move(0, dh - m);
        children[3].move(dw - m, dh - m);
        // edge
        children[4].move(m, 0);
        children[5].move(m, dh - m);
        children[6].move(0, m);
        children[7].move(dw - m, m);
        children[4].setFrame(sx + m, sy, smw, m);
        children[5].setFrame(sx + m, sy + sw - m, smw, m);
        children[6].setFrame(sx, sy + m, m, smh);
        children[7].setFrame(sx + sw - m, sy + m, m, smh);
        children[4].scale.x = dmw / smw;
        children[5].scale.x = dmw / smw;
        children[6].scale.y = dmh / smh;
        children[7].scale.y = dmh / smh;
        // center
        if (children[8]) {
            children[8].setFrame(sx + m, sy + m, smw, smh);
            children[8].move(m, m);
            children[8].scale.x = dmw / smw;
            children[8].scale.y = dmh / smh;
        }
        for (const child of children) {
            child.visible = dw > 0 && dh > 0;
        }
    }

    _refreshArrows(): void {
        const w = this._width;
        const h = this._height;
        const p = 24;
        const q = p / 2;
        const sx = 96 + p;
        const sy = 0 + p;
        this._downArrowSprite.bitmap = this._windowskin;
        this._downArrowSprite.anchor.x = 0.5;
        this._downArrowSprite.anchor.y = 0.5;
        this._downArrowSprite.setFrame(sx + q, sy + q + p, p, q);
        this._downArrowSprite.move(w / 2, h - q);
        this._upArrowSprite.bitmap = this._windowskin;
        this._upArrowSprite.anchor.x = 0.5;
        this._upArrowSprite.anchor.y = 0.5;
        this._upArrowSprite.setFrame(sx + q, sy, p, q);
        this._upArrowSprite.move(w / 2, q);
    }

    _refreshPauseSign(): void {
        const sx = 144;
        const sy = 96;
        const p = 24;
        this._pauseSignSprite.bitmap = this._windowskin;
        this._pauseSignSprite.anchor.x = 0.5;
        this._pauseSignSprite.anchor.y = 1;
        this._pauseSignSprite.move(this._width / 2, this._height);
        this._pauseSignSprite.setFrame(sx, sy, p, p);
        this._pauseSignSprite.alpha = 0;
    }

    _updateClientArea(): void {
        const pad = this._padding;
        this._clientArea.move(pad, pad);
        this._clientArea.x = pad - this.origin.x;
        this._clientArea.y = pad - this.origin.y;
        if (this.innerWidth > 0 && this.innerHeight > 0) {
            this._clientArea.visible = this.isOpen();
        } else {
            this._clientArea.visible = false;
        }
    }

    _updateFrame(): void {
        this._frameSprite.visible = this.frameVisible;
    }

    _updateContentsBack(): void {
        const bitmap = this._contentsBackSprite.bitmap;
        if (bitmap) {
            this._contentsBackSprite.setFrame(0, 0, bitmap.width, bitmap.height);
        }
    }

    _updateCursor(): void {
        this._cursorSprite.alpha = this._makeCursorAlpha();
        this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprite.x = this._cursorRect.x;
        this._cursorSprite.y = this._cursorRect.y;
    }

    _makeCursorAlpha(): number {
        const blinkCount = this._animationCount % 40;
        const baseAlpha = this.contentsOpacity / 255;
        if (this.active) {
            if (blinkCount < 20) {
                return baseAlpha - blinkCount / 32;
            } else {
                return baseAlpha - (40 - blinkCount) / 32;
            }
        }
        return baseAlpha;
    }

    _updateContents(): void {
        const bitmap = this._contentsSprite.bitmap;
        if (bitmap) {
            this._contentsSprite.setFrame(0, 0, bitmap.width, bitmap.height);
        }
    }

    _updateArrows(): void {
        this._downArrowSprite.visible = this.isOpen() && this.downArrowVisible;
        this._upArrowSprite.visible = this.isOpen() && this.upArrowVisible;
    }

    _updatePauseSign(): void {
        const sprite = this._pauseSignSprite;
        const x = Math.floor(this._animationCount / 16) % 2;
        const y = Math.floor(this._animationCount / 16 / 2) % 2;
        const sx = 144;
        const sy = 96;
        const p = 24;
        if (!this.pause) {
            sprite.alpha = 0;
        } else if (sprite.alpha < 1) {
            sprite.alpha = Math.min(sprite.alpha + 0.1, 1);
        }
        sprite.setFrame(sx + x * p, sy + y * p, p, p);
        sprite.visible = this.isOpen();
    }

    _updateFilterArea(): void {
        const filterArea = this._clientArea.filterArea;
        filterArea!.x = this.origin.x;
        filterArea!.y = this.origin.y;
        filterArea!.width = this.innerWidth;
        filterArea!.height = this.innerHeight;
    }
}

/**
 * The layer which contains game windows.
 */
class WindowLayer extends PIXI.Container {
    declare children: RmmzWindow[];

    declare _windowLayout: { window: RmmzWindow; bounds: import("pixi.js").Rectangle | null }[];

    constructor(...args: []) {
        super();
        this.initialize(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        this._windowLayout = [];
        this.onRender = this._updateWindowMasks;
    }

    addWindow(window: RmmzWindow): RmmzWindow {
        if (window._isWindow) {
            const overlayIndex = this.children.findIndex((child) => !child._isWindow);
            if (overlayIndex >= 0) {
                return this.addChildAt(window, overlayIndex);
            }
        }
        return this.addChild(window);
    }

    /**
     * Updates the window layer for each frame.
     */
    update(): void {
        for (const child of this.children) {
            if (child.update) {
                child.update();
            }
        }
    }

    _updateWindowMasks(): void {
        const layout = this.children
            .filter((child) => child._isWindow)
            .map((window) => ({
                window,
                bounds: window.visible && window.openness > 0 ? window.openBounds() : null,
            }));
        const previous = this._windowLayout;
        if (
            layout.length === previous.length &&
            layout.every(({ window, bounds }, i) => {
                const last = previous[i];
                return (
                    window === last.window &&
                    bounds?.x === last.bounds?.x &&
                    bounds?.y === last.bounds?.y &&
                    bounds?.width === last.bounds?.width &&
                    bounds?.height === last.bounds?.height
                );
            })
        ) {
            return;
        }
        this._windowLayout = layout;
        const occluders = [];
        for (let i = layout.length - 1; i >= 0; i--) {
            const { window, bounds } = layout[i];
            const overlaps = bounds && occluders.filter((rect: Rectangle) => rect.intersects(bounds));
            if (overlaps?.length) {
                this._applyWindowMask(window, bounds!, overlaps);
            } else if (window._windowLayerMask && window.mask === window._windowLayerMask) {
                window._windowLayerMask.clear();
                window.mask = null;
            }
            if (bounds) occluders.push(bounds);
        }
    }

    _applyWindowMask(
        window: RmmzWindow,
        bounds: import("pixi.js").Rectangle,
        occluders: import("pixi.js").Rectangle[],
    ): void {
        if (!window._windowLayerMask) {
            window._windowLayerMask = window.addChild(new PIXI.Graphics());
        }
        const mask = window._windowLayerMask.clear();
        // Keep lower windows out of transparent parts of higher windows.
        let regions = [bounds];
        for (const occluder of occluders) {
            regions = regions.flatMap((region) => WindowLayer.subtractRect(region, occluder));
        }
        for (const rect of regions) {
            mask.rect(rect.x - window.x, rect.y - window.y, rect.width, rect.height).fill(0xffffff);
        }
        window.mask = mask;
    }

    static subtractRect(
        rect: import("pixi.js").Rectangle,
        occluder: import("pixi.js").Rectangle,
    ): import("pixi.js").Rectangle[] {
        if (!rect.intersects(occluder)) return [rect];
        const left = Math.max(occluder.left, rect.left);
        const right = Math.min(occluder.right, rect.right);
        const top = Math.max(occluder.top, rect.top);
        const bottom = Math.min(occluder.bottom, rect.bottom);
        return [
            new PIXI.Rectangle(rect.left, rect.top, rect.width, top - rect.top),
            new PIXI.Rectangle(rect.left, bottom, rect.width, rect.bottom - bottom),
            new PIXI.Rectangle(rect.left, top, left - rect.left, bottom - top),
            new PIXI.Rectangle(right, top, rect.right - right, bottom - top),
        ].filter((part) => part.width > 0 && part.height > 0);
    }
}

/**
 * The weather effect which displays rain, storm, or snow.
 */
class Weather extends PIXI.Container {
    declare viewport: import("pixi.js").Rectangle;

    declare _width: number;
    declare _height: number;
    declare _sprites: Weather.ParticleSprite[];
    declare type: string;
    declare power: number;
    declare _rainBitmap: Bitmap;
    declare _stormBitmap: Bitmap;
    declare _snowBitmap: Bitmap;
    declare _dimmerSprite: ScreenSprite;

    constructor(...args: []) {
        super();
        this.initialize(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        this._width = Graphics.width;
        this._height = Graphics.height;
        this._sprites = [];

        this._createBitmaps();
        this._createDimmer();

        /**
         * The type of the weather in ["none", "rain", "storm", "snow"].
         */
        this.type = "none";

        /**
         * The power of the weather in the range (0, 9).
         */
        this.power = 0;

        /**
         * The origin point of the weather for scrolling.
         */
        this.origin = new PIXI.Point();
    }

    /**
     * Destroys the weather.
     */
    destroy(): void {
        const options = { children: true, texture: true };
        super.destroy(options);
        this._rainBitmap.destroy();
        this._stormBitmap.destroy();
        this._snowBitmap.destroy();
    }

    /**
     * Updates the weather for each frame.
     */
    update(): void {
        this._updateDimmer();
        this._updateAllSprites();
    }

    _createBitmaps(): void {
        this._rainBitmap = new Bitmap(1, 60);
        this._rainBitmap.fillAll("white");
        this._stormBitmap = new Bitmap(2, 100);
        this._stormBitmap.fillAll("white");
        this._snowBitmap = new Bitmap(9, 9);
        this._snowBitmap.drawCircle(4, 4, 4, "white");
    }

    _createDimmer(): void {
        this._dimmerSprite = new ScreenSprite();
        this._dimmerSprite.setColor(80, 80, 80);
        this.addChild(this._dimmerSprite);
    }

    _updateDimmer(): void {
        this._dimmerSprite.opacity = Math.floor(this.power * 6);
    }

    _updateAllSprites(): void {
        const maxSprites = Math.floor(this.power * 10);
        while (this._sprites.length < maxSprites) {
            this._addSprite();
        }
        while (this._sprites.length > maxSprites) {
            this._removeSprite();
        }
        for (const sprite of this._sprites) {
            this._updateSprite(sprite);
            sprite.x = sprite.ax - this.origin.x;
            sprite.y = sprite.ay - this.origin.y;
        }
    }

    _addSprite(): void {
        const sprite = new Sprite() as Weather["_sprites"][number];
        sprite.opacity = 0;
        this._sprites.push(sprite);
        this.addChild(sprite);
    }

    _removeSprite(): void {
        this.removeChild(this._sprites.pop()!);
    }

    _updateSprite(sprite: Weather.ParticleSprite): void {
        switch (this.type) {
            case "rain":
                this._updateRainSprite(sprite);
                break;
            case "storm":
                this._updateStormSprite(sprite);
                break;
            case "snow":
                this._updateSnowSprite(sprite);
                break;
        }
        if (sprite.opacity < 40) {
            this._rebornSprite(sprite);
        }
    }

    _updateRainSprite(sprite: Weather.ParticleSprite): void {
        sprite.bitmap = this._rainBitmap;
        sprite.rotation = Math.PI / 16;
        sprite.ax -= 6 * Math.sin(sprite.rotation);
        sprite.ay += 6 * Math.cos(sprite.rotation);
        sprite.opacity -= 6;
    }

    _updateStormSprite(sprite: Weather.ParticleSprite): void {
        sprite.bitmap = this._stormBitmap;
        sprite.rotation = Math.PI / 8;
        sprite.ax -= 8 * Math.sin(sprite.rotation);
        sprite.ay += 8 * Math.cos(sprite.rotation);
        sprite.opacity -= 8;
    }

    _updateSnowSprite(sprite: Weather.ParticleSprite): void {
        sprite.bitmap = this._snowBitmap;
        sprite.rotation = Math.PI / 16;
        sprite.ax -= 3 * Math.sin(sprite.rotation);
        sprite.ay += 3 * Math.cos(sprite.rotation);
        sprite.opacity -= 3;
    }

    _rebornSprite(sprite: Weather.ParticleSprite): void {
        sprite.ax = Math.randomInt(Graphics.width + 100) - 100 + this.origin.x;
        sprite.ay = Math.randomInt(Graphics.height + 200) - 200 + this.origin.y;
        sprite.opacity = 160 + Math.randomInt(60);
    }
}

declare namespace Weather {
    export interface ParticleSprite extends Sprite {
        ax: number;
        ay: number;
    }
}

/**
 * The color filter for WebGL.
 */
class ColorFilter extends PIXI.Filter {
    declare uniforms: {
        hue: number;
        colorTone: RMMZ.Color;
        blendColor: RMMZ.Color;
        brightness: number;
    };

    constructor(...args: []) {
        super({
            glProgram: PIXI.GlProgram.from({
                vertex: PIXI.defaultFilterVert,
                fragment: ColorFilter._fragmentSrc(),
            }),
            resources: {
                colorUniforms: {
                    hue: { value: 0, type: "f32" },
                    colorTone: { value: [0, 0, 0, 0], type: "vec4<f32>" },
                    blendColor: { value: [0, 0, 0, 0], type: "vec4<f32>" },
                    brightness: { value: 255, type: "f32" },
                },
            },
        });
        this.initialize(...args);
    }

    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {
        this.uniforms = this.resources.colorUniforms.uniforms;
    }

    /**
     * Sets the hue rotation value.
     * @param hue - The hue value (-360, 360).
     */
    setHue(hue: number): void {
        this.uniforms.hue = Number(hue);
    }

    /**
     * Sets the color tone.
     * @param tone - The color tone [r, g, b, gray].
     */
    setColorTone(tone: RMMZ.Color): void {
        if (!(tone instanceof Array)) {
            throw new Error("Argument must be an array");
        }
        this.uniforms.colorTone = tone.clone();
    }

    /**
     * Sets the blend color.
     * @param color - The blend color [r, g, b, a].
     */
    setBlendColor(color: RMMZ.Color): void {
        if (!(color instanceof Array)) {
            throw new Error("Argument must be an array");
        }
        this.uniforms.blendColor = color.clone();
    }

    /**
     * Sets the brightness.
     * @param brightness - The brightness (0 to 255).
     */
    setBrightness(brightness: number): void {
        this.uniforms.brightness = Number(brightness);
    }

    static _fragmentSrc(): string {
        const src =
            "in vec2 vTextureCoord;" +
            "out vec4 finalColor;" +
            "uniform sampler2D uTexture;" +
            "uniform float hue;" +
            "uniform vec4 colorTone;" +
            "uniform vec4 blendColor;" +
            "uniform float brightness;" +
            "vec3 rgbToHsl(vec3 rgb) {" +
            "  float r = rgb.r;" +
            "  float g = rgb.g;" +
            "  float b = rgb.b;" +
            "  float cmin = min(r, min(g, b));" +
            "  float cmax = max(r, max(g, b));" +
            "  float h = 0.0;" +
            "  float s = 0.0;" +
            "  float l = (cmin + cmax) / 2.0;" +
            "  float delta = cmax - cmin;" +
            "  if (delta > 0.0) {" +
            "    if (r == cmax) {" +
            "      h = mod((g - b) / delta + 6.0, 6.0) / 6.0;" +
            "    } else if (g == cmax) {" +
            "      h = ((b - r) / delta + 2.0) / 6.0;" +
            "    } else {" +
            "      h = ((r - g) / delta + 4.0) / 6.0;" +
            "    }" +
            "    if (l < 1.0) {" +
            "      s = delta / (1.0 - abs(2.0 * l - 1.0));" +
            "    }" +
            "  }" +
            "  return vec3(h, s, l);" +
            "}" +
            "vec3 hslToRgb(vec3 hsl) {" +
            "  float h = hsl.x;" +
            "  float s = hsl.y;" +
            "  float l = hsl.z;" +
            "  float c = (1.0 - abs(2.0 * l - 1.0)) * s;" +
            "  float x = c * (1.0 - abs((mod(h * 6.0, 2.0)) - 1.0));" +
            "  float m = l - c / 2.0;" +
            "  float cm = c + m;" +
            "  float xm = x + m;" +
            "  if (h < 1.0 / 6.0) {" +
            "    return vec3(cm, xm, m);" +
            "  } else if (h < 2.0 / 6.0) {" +
            "    return vec3(xm, cm, m);" +
            "  } else if (h < 3.0 / 6.0) {" +
            "    return vec3(m, cm, xm);" +
            "  } else if (h < 4.0 / 6.0) {" +
            "    return vec3(m, xm, cm);" +
            "  } else if (h < 5.0 / 6.0) {" +
            "    return vec3(xm, m, cm);" +
            "  } else {" +
            "    return vec3(cm, m, xm);" +
            "  }" +
            "}" +
            "void main() {" +
            "  vec4 sample = texture(uTexture, vTextureCoord);" +
            "  float a = sample.a;" +
            "  vec3 hsl = rgbToHsl(sample.rgb);" +
            "  hsl.x = mod(hsl.x + hue / 360.0, 1.0);" +
            "  hsl.y = hsl.y * (1.0 - colorTone.a / 255.0);" +
            "  vec3 rgb = hslToRgb(hsl);" +
            "  float r = rgb.r;" +
            "  float g = rgb.g;" +
            "  float b = rgb.b;" +
            "  float r2 = colorTone.r / 255.0;" +
            "  float g2 = colorTone.g / 255.0;" +
            "  float b2 = colorTone.b / 255.0;" +
            "  float r3 = blendColor.r / 255.0;" +
            "  float g3 = blendColor.g / 255.0;" +
            "  float b3 = blendColor.b / 255.0;" +
            "  float i3 = blendColor.a / 255.0;" +
            "  float i1 = 1.0 - i3;" +
            "  r = clamp((r / a + r2) * a, 0.0, 1.0);" +
            "  g = clamp((g / a + g2) * a, 0.0, 1.0);" +
            "  b = clamp((b / a + b2) * a, 0.0, 1.0);" +
            "  r = clamp(r * i1 + r3 * i3 * a, 0.0, 1.0);" +
            "  g = clamp(g * i1 + g3 * i3 * a, 0.0, 1.0);" +
            "  b = clamp(b * i1 + b3 * i3 * a, 0.0, 1.0);" +
            "  r = r * brightness / 255.0;" +
            "  g = g * brightness / 255.0;" +
            "  b = b * brightness / 255.0;" +
            "  finalColor = vec4(r, g, b, a);" +
            "}";
        return src;
    }
}

/**
 * The root object of the display tree.
 */
class Stage extends PIXI.Container {
    declare children: RMMZ.UpdateableChild[];
    constructor();
    constructor(..._extra: unknown[]);
    constructor(...args: unknown[]) {
        super();
        this.initialize(...args);
    }

    // Scene_Base delegates to this hook during initialization.
    initialize(): void;
    initialize(...args: any[]): void;
    initialize(): void {}

    /**
     * Destroys the stage.
     */
    destroy(): void {
        const options = { children: true, texture: true };
        super.destroy(options);
    }
}

/**
 * The audio object of Web Audio API.
 * @param url - The url of the audio file.
 */
class WebAudio {
    declare name: string;
    declare frameCount: number;

    declare static _masterGainNode: GainNode | null;

    declare static _context: AudioContext | null;
    declare static _masterVolume: number;

    declare _url: string;
    declare _data: Uint8Array<ArrayBuffer> | null;
    declare _fetchedSize: number;
    declare _fetchedData: Uint8Array[];
    declare _buffers: AudioBuffer[];
    declare _sourceNodes: AudioBufferSourceNode[];
    declare _gainNode: GainNode | null;
    declare _pannerNode: PannerNode | null;
    declare _totalTime: number;
    declare _sampleRate: number;
    declare _loop: boolean;
    declare _loopStart: number;
    declare _loopLength: number;
    declare _loopStartTime: number;
    declare _loopLengthTime: number;
    declare _startTime: number;
    declare _volume: number;
    declare _pitch: number;
    declare _pan: number;
    declare _endTimer: number | null;
    declare _loadListeners: (() => void)[];
    declare _stopListeners: (() => void)[];
    declare _lastUpdateTime: number;
    declare _isLoaded: boolean;
    declare _isError: boolean;
    declare _isPlaying: boolean;
    declare _decoder: VorbisDecoder | null;

    constructor(...args: [url: string]) {
        this.initialize(...args);
    }

    initialize(url: string): void;
    initialize(...args: any[]): void;
    initialize(url: string): void {
        this.clear();

        this._url = url;
        this._startLoading();
    }

    /**
     * Initializes the audio system.
     * @returns True if the audio system is available.
     */
    static initialize(): boolean {
        this._context = null;
        this._masterGainNode = null;
        this._masterVolume = 1;
        this._createContext();
        this._createMasterGainNode();
        this._setupEventHandlers();
        return !!this._context;
    }

    /**
     * Sets the master volume for all audio.
     * @param value - The master volume (0 to 1).
     */
    static setMasterVolume(value: number): void {
        this._masterVolume = value;
        this._resetVolume();
    }

    static _createContext(): void {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this._context = new AudioContext();
        } catch {
            this._context = null;
        }
    }

    static _currentTime(): number {
        return this._context ? this._context.currentTime : 0;
    }

    static _createMasterGainNode(): void {
        const context = this._context;
        if (context) {
            this._masterGainNode = context.createGain();
            this._resetVolume();
            this._masterGainNode.connect(context.destination);
        }
    }

    static _setupEventHandlers(): void {
        const onUserGesture = this._onUserGesture.bind(this);
        const onVisibilityChange = this._onVisibilityChange.bind(this);
        document.addEventListener("keydown", onUserGesture);
        document.addEventListener("mousedown", onUserGesture);
        document.addEventListener("touchend", onUserGesture);
        document.addEventListener("visibilitychange", onVisibilityChange);
    }

    static _onUserGesture(): void {
        const context = this._context;
        if (context && context.state === "suspended") {
            context.resume();
        }
    }

    static _onVisibilityChange(): void {
        if (document.visibilityState === "hidden") {
            this._onHide();
        } else {
            this._onShow();
        }
    }

    static _onHide(): void {
        if (this._shouldMuteOnHide()) {
            this._fadeOut(1);
        }
    }

    static _onShow(): void {
        if (this._shouldMuteOnHide()) {
            this._fadeIn(1);
        }
    }

    static _shouldMuteOnHide(): boolean {
        return Utils.isMobileDevice() && !window.navigator.standalone;
    }

    static _resetVolume(): void {
        if (this._masterGainNode) {
            const gain = this._masterGainNode.gain;
            const volume = this._masterVolume;
            const currentTime = this._currentTime();
            gain.setValueAtTime(volume, currentTime);
        }
    }

    static _fadeIn(duration: number): void {
        if (this._masterGainNode) {
            const gain = this._masterGainNode.gain;
            const volume = this._masterVolume;
            const currentTime = this._currentTime();
            gain.setValueAtTime(0, currentTime);
            gain.linearRampToValueAtTime(volume, currentTime + duration);
        }
    }

    static _fadeOut(duration: number): void {
        if (this._masterGainNode) {
            const gain = this._masterGainNode.gain;
            const volume = this._masterVolume;
            const currentTime = this._currentTime();
            gain.setValueAtTime(volume, currentTime);
            gain.linearRampToValueAtTime(0, currentTime + duration);
        }
    }

    /**
     * Clears the audio data.
     */
    clear(): void {
        this.stop();
        this._data = null;
        this._fetchedSize = 0;
        this._fetchedData = [];
        this._buffers = [];
        this._sourceNodes = [];
        this._gainNode = null;
        this._pannerNode = null;
        this._totalTime = 0;
        this._sampleRate = 0;
        this._loop = false;
        this._loopStart = 0;
        this._loopLength = 0;
        this._loopStartTime = 0;
        this._loopLengthTime = 0;
        this._startTime = 0;
        this._volume = 1;
        this._pitch = 1;
        this._pan = 0;
        this._endTimer = null;
        this._loadListeners = [];
        this._stopListeners = [];
        this._lastUpdateTime = 0;
        this._isLoaded = false;
        this._isError = false;
        this._isPlaying = false;
        this._decoder = null;
    }

    /**
     * The url of the audio file.
     * @name WebAudio#url
     */
    get url(): string {
        return this._url;
    }

    /**
     * The volume of the audio.
     * @name WebAudio#volume
     */
    get volume(): number {
        return this._volume;
    }

    set volume(value: number) {
        this._volume = value;
        if (this._gainNode) {
            this._gainNode.gain.setValueAtTime(this._volume, WebAudio._currentTime());
        }
    }

    /**
     * The pitch of the audio.
     * @name WebAudio#pitch
     */
    get pitch(): number {
        return this._pitch;
    }

    set pitch(value: number) {
        if (this._pitch !== value) {
            this._pitch = value;
            if (this.isPlaying()) {
                this.play(this._loop, 0);
            }
        }
    }

    /**
     * The pan of the audio.
     * @name WebAudio#pan
     */
    get pan(): number {
        return this._pan;
    }

    set pan(value: number) {
        this._pan = value;
        this._updatePanner();
    }

    /**
     * Checks whether the audio data is ready to play.
     * @returns True if the audio data is ready to play.
     */
    isReady(): boolean {
        return this._buffers && this._buffers.length > 0;
    }

    /**
     * Checks whether a loading error has occurred.
     * @returns True if a loading error has occurred.
     */
    isError(): boolean {
        return this._isError;
    }

    /**
     * Checks whether the audio is playing.
     * @returns True if the audio is playing.
     */
    isPlaying(): boolean {
        return this._isPlaying;
    }

    /**
     * Plays the audio.
     * @param loop - Whether the audio data play in a loop.
     * @param offset - The start position to play in seconds.
     */
    play(loop: boolean, offset?: number): void {
        this._loop = loop;
        if (this.isReady()) {
            offset = offset || 0;
            this._startPlaying(offset);
        } else if (WebAudio._context) {
            this.addLoadListener(() => this.play(loop, offset));
        }
        this._isPlaying = true;
    }

    /**
     * Stops the audio.
     */
    stop(): void {
        this._isPlaying = false;
        this._removeEndTimer();
        this._removeNodes();
        this._loadListeners = [];
        if (this._stopListeners) {
            while (this._stopListeners.length > 0) {
                const listner = this._stopListeners.shift()!;
                listner();
            }
        }
    }

    /**
     * Destroys the audio.
     */
    destroy(): void {
        this._destroyDecoder();
        this.clear();
    }

    /**
     * Performs the audio fade-in.
     * @param duration - Fade-in time in seconds.
     */
    fadeIn(duration: number): void {
        if (this.isReady()) {
            if (this._gainNode) {
                const gain = this._gainNode.gain;
                const currentTime = WebAudio._currentTime();
                gain.setValueAtTime(0, currentTime);
                gain.linearRampToValueAtTime(this._volume, currentTime + duration);
            }
        } else {
            this.addLoadListener(() => this.fadeIn(duration));
        }
    }

    /**
     * Performs the audio fade-out.
     * @param duration - Fade-out time in seconds.
     */
    fadeOut(duration: number): void {
        if (this._gainNode) {
            const gain = this._gainNode.gain;
            const currentTime = WebAudio._currentTime();
            gain.setValueAtTime(this._volume, currentTime);
            gain.linearRampToValueAtTime(0, currentTime + duration);
        }
        this._isPlaying = false;
        this._loadListeners = [];
    }

    /**
     * Gets the seek position of the audio.
     */
    seek(): number {
        if (WebAudio._context) {
            let pos = (WebAudio._currentTime() - this._startTime) * this._pitch;
            if (this._loopLengthTime > 0) {
                while (pos >= this._loopStartTime + this._loopLengthTime) {
                    pos -= this._loopLengthTime;
                }
            }
            return pos;
        } else {
            return 0;
        }
    }

    /**
     * Adds a callback function that will be called when the audio data is loaded.
     * @param listner - The callback function.
     */
    addLoadListener(listner: () => void): void {
        this._loadListeners.push(listner);
    }

    /**
     * Adds a callback function that will be called when the playback is stopped.
     * @param listner - The callback function.
     */
    addStopListener(listner: () => void): void {
        this._stopListeners.push(listner);
    }

    /**
     * Tries to load the audio again.
     */
    retry(): void {
        this._startLoading();
        if (this._isPlaying) {
            this.play(this._loop, 0);
        }
    }

    _startLoading(): void {
        if (WebAudio._context) {
            const url = this._realUrl();
            if (Utils.isLocal()) {
                this._startXhrLoading(url);
            } else {
                this._startFetching(url);
            }
            const currentTime = WebAudio._currentTime();
            this._lastUpdateTime = currentTime - 0.5;
            this._isError = false;
            this._isLoaded = false;
            this._destroyDecoder();
            if (this._shouldUseDecoder()) {
                this._createDecoder();
            }
        }
    }

    _shouldUseDecoder(): boolean {
        return !Utils.canPlayOgg() && typeof VorbisDecoder === "function";
    }

    _createDecoder(): void {
        this._decoder = new VorbisDecoder(WebAudio._context, this._onDecode.bind(this), this._onError.bind(this));
    }

    _destroyDecoder(): void {
        if (this._decoder) {
            this._decoder.destroy();
            this._decoder = null;
        }
    }

    _realUrl(): string {
        return this._url + (Utils.hasEncryptedAudio() ? "_" : "");
    }

    _startXhrLoading(url: string): void {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "arraybuffer";
        xhr.onload = () => this._onXhrLoad(xhr);
        xhr.onerror = this._onError.bind(this);
        xhr.send();
    }

    _startFetching(url: string): void {
        const options: RequestInit = { credentials: "same-origin" };
        fetch(url, options)
            .then((response) => this._onFetch(response))
            .catch(() => this._onError());
    }

    _onXhrLoad(xhr: XMLHttpRequest): void {
        if (xhr.status < 400) {
            this._data = new Uint8Array(xhr.response);
            this._isLoaded = true;
            this._updateBuffer();
        } else {
            this._onError();
        }
    }

    _onFetch(response: Response): void {
        if (response.ok) {
            const reader = response.body!.getReader();
            const readChunk = ({
                done,
                value,
            }: ReadableStreamReadResult<Uint8Array<ArrayBuffer>>): Promise<number> | number => {
                if (done) {
                    this._isLoaded = true;
                    if (this._fetchedSize > 0) {
                        this._concatenateFetchedData();
                        this._updateBuffer();
                        this._data = null;
                    }
                    return 0;
                } else {
                    this._onFetchProcess(value);
                    return reader.read().then(readChunk);
                }
            };
            reader
                .read()
                .then(readChunk)
                .catch(() => this._onError());
        } else {
            this._onError();
        }
    }

    _onError(): void {
        if (this._sourceNodes.length > 0) {
            this._stopSourceNode();
        }
        this._data = null;
        this._isError = true;
    }

    _onFetchProcess(value: Uint8Array): void {
        this._fetchedSize += value.length;
        this._fetchedData.push(value);
        this._updateBufferOnFetch();
    }

    _updateBufferOnFetch(): void {
        const currentTime = WebAudio._currentTime();
        const deltaTime = currentTime - this._lastUpdateTime;
        const currentData = this._data;
        const currentSize = currentData ? currentData.length : 0;
        if (deltaTime >= 1 && currentSize + this._fetchedSize >= 200000) {
            this._concatenateFetchedData();
            this._updateBuffer();
            this._lastUpdateTime = currentTime;
        }
    }

    _concatenateFetchedData(): void {
        const currentData = this._data;
        const currentSize = currentData ? currentData.length : 0;
        const newData = new Uint8Array(currentSize + this._fetchedSize);
        let pos = 0;
        if (currentData) {
            newData.set(currentData);
            pos += currentSize;
        }
        for (const value of this._fetchedData) {
            newData.set(value, pos);
            pos += value.length;
        }
        this._data = newData;
        this._fetchedData = [];
        this._fetchedSize = 0;
    }

    _updateBuffer(): void {
        const arrayBuffer = this._readableBuffer();
        this._readLoopComments(arrayBuffer as ArrayBuffer);
        this._decodeAudioData(arrayBuffer as ArrayBuffer);
    }

    _readableBuffer(): ArrayBufferLike {
        if (Utils.hasEncryptedAudio()) {
            return Utils.decryptArrayBuffer(this._data!.buffer);
        } else {
            return this._data!.buffer;
        }
    }

    _decodeAudioData(arrayBuffer: ArrayBuffer): void {
        if (this._shouldUseDecoder()) {
            if (this._decoder) {
                this._decoder.send(arrayBuffer, this._isLoaded);
            }
        } else {
            // [Note] Make a temporary copy of arrayBuffer because
            //   decodeAudioData() detaches it.
            WebAudio._context!.decodeAudioData(arrayBuffer.slice())
                .then((buffer) => this._onDecode(buffer))
                .catch(() => this._onError());
        }
    }

    _onDecode(buffer: AudioBuffer): void {
        if (!this._shouldUseDecoder()) {
            this._buffers = [];
            this._totalTime = 0;
        }
        this._buffers.push(buffer);
        this._totalTime += buffer.duration;
        if (this._loopLength > 0 && this._sampleRate > 0) {
            this._loopStartTime = this._loopStart / this._sampleRate;
            this._loopLengthTime = this._loopLength / this._sampleRate;
        } else {
            this._loopStartTime = 0;
            this._loopLengthTime = this._totalTime;
        }
        if (this._sourceNodes.length > 0) {
            this._refreshSourceNode();
        }
        this._onLoad();
    }

    _refreshSourceNode(): void {
        if (this._shouldUseDecoder()) {
            const index = this._buffers.length - 1;
            this._createSourceNode(index);
            if (this._isPlaying) {
                this._startSourceNode(index);
            }
        } else {
            this._stopSourceNode();
            this._createAllSourceNodes();
            if (this._isPlaying) {
                this._startAllSourceNodes();
            }
        }
        if (this._isPlaying) {
            this._removeEndTimer();
            this._createEndTimer();
        }
    }

    _startPlaying(offset: number): void {
        if (this._loopLengthTime > 0) {
            while (offset >= this._loopStartTime + this._loopLengthTime) {
                offset -= this._loopLengthTime;
            }
        }
        this._startTime = WebAudio._currentTime() - offset / this._pitch;
        this._removeEndTimer();
        this._removeNodes();
        this._createPannerNode();
        this._createGainNode();
        this._createAllSourceNodes();
        this._startAllSourceNodes();
        this._createEndTimer();
    }

    _startAllSourceNodes(): void {
        for (let i = 0; i < this._sourceNodes.length; i++) {
            this._startSourceNode(i);
        }
    }

    _startSourceNode(index: number): void {
        const sourceNode = this._sourceNodes[index];
        const seekPos = this.seek();
        const currentTime = WebAudio._currentTime();
        const loop = this._loop;
        const loopStart = this._loopStartTime;
        const loopLength = this._loopLengthTime;
        const loopEnd = loopStart + loopLength;
        const pitch = this._pitch;
        let chunkStart = 0;
        for (let i = 0; i < index; i++) {
            chunkStart += this._buffers[i].duration;
        }
        const chunkEnd = chunkStart + sourceNode.buffer!.duration;
        let when = 0;
        let offset = 0;
        let duration = sourceNode.buffer!.duration;
        if (seekPos >= chunkStart && seekPos < chunkEnd - 0.01) {
            when = currentTime;
            offset = seekPos - chunkStart;
        } else {
            when = currentTime + (chunkStart - seekPos) / pitch;
            offset = 0;
            if (loop) {
                if (when < currentTime - 0.01) {
                    when += loopLength / pitch;
                }
                if (seekPos >= loopStart && chunkStart < loopStart) {
                    when += (loopStart - chunkStart) / pitch;
                    offset = loopStart - chunkStart;
                }
            }
        }
        if (loop && loopEnd < chunkEnd) {
            duration = loopEnd - chunkStart - offset;
        }
        if (this._shouldUseDecoder()) {
            if (when >= currentTime && offset < duration) {
                sourceNode.loop = false;
                sourceNode.start(when, offset, duration);
                if (loop && chunkEnd > loopStart) {
                    sourceNode.onended = () => {
                        this._createSourceNode(index);
                        this._startSourceNode(index);
                    };
                }
            }
        } else {
            if (when >= currentTime && offset < sourceNode.buffer!.duration) {
                sourceNode.start(when, offset);
            }
        }
        chunkStart += sourceNode.buffer!.duration;
    }

    _stopSourceNode(): void {
        for (const sourceNode of this._sourceNodes) {
            try {
                sourceNode.onended = null;
                sourceNode.stop();
            } catch {
                // Ignore InvalidStateError
            }
        }
    }

    _createPannerNode(): void {
        this._pannerNode = WebAudio._context!.createPanner();
        this._pannerNode.panningModel = "equalpower";
        this._pannerNode.connect(WebAudio._masterGainNode!);
        this._updatePanner();
    }

    _createGainNode(): void {
        const currentTime = WebAudio._currentTime();
        this._gainNode = WebAudio._context!.createGain();
        this._gainNode.gain.setValueAtTime(this._volume, currentTime);
        this._gainNode.connect(this._pannerNode!);
    }

    _createAllSourceNodes(): void {
        for (let i = 0; i < this._buffers.length; i++) {
            this._createSourceNode(i);
        }
    }

    _createSourceNode(index: number): void {
        const sourceNode = WebAudio._context!.createBufferSource();
        const currentTime = WebAudio._currentTime();
        sourceNode.buffer = this._buffers[index];
        sourceNode.loop = this._loop && this._isLoaded;
        sourceNode.loopStart = this._loopStartTime;
        sourceNode.loopEnd = this._loopStartTime + this._loopLengthTime;
        sourceNode.playbackRate.setValueAtTime(this._pitch, currentTime);
        sourceNode.connect(this._gainNode!);
        this._sourceNodes[index] = sourceNode;
    }

    _removeNodes(): void {
        if (this._sourceNodes && this._sourceNodes.length > 0) {
            this._stopSourceNode();
            this._sourceNodes = [];
            this._gainNode = null;
            this._pannerNode = null;
        }
    }

    _createEndTimer(): void {
        if (this._sourceNodes.length > 0 && !this._loop) {
            const endTime = this._startTime + this._totalTime / this._pitch;
            const delay = endTime - WebAudio._currentTime();
            this._endTimer = window.setTimeout(this.stop.bind(this), delay * 1000);
        }
    }

    _removeEndTimer(): void {
        if (this._endTimer) {
            clearTimeout(this._endTimer);
            this._endTimer = null;
        }
    }

    _updatePanner(): void {
        if (this._pannerNode) {
            const x = this._pan;
            const z = 1 - Math.abs(x);
            this._pannerNode.setPosition(x, 0, z);
        }
    }

    _onLoad(): void {
        while (this._loadListeners.length > 0) {
            const listner = this._loadListeners.shift()!;
            listner();
        }
    }

    _readLoopComments(arrayBuffer: ArrayBuffer): void {
        const view = new DataView(arrayBuffer);
        let index = 0;
        while (index < view.byteLength - 30) {
            if (this._readFourCharacters(view, index) !== "OggS") {
                break;
            }
            index += 26;
            const numSegments = view.getUint8(index++);
            const segments = [];
            for (let i = 0; i < numSegments; i++) {
                segments.push(view.getUint8(index++));
            }
            const packets = [];
            while (segments.length > 0) {
                let packetSize = 0;
                while (segments[0] === 255) {
                    packetSize += segments.shift()!;
                }
                if (segments.length > 0) {
                    packetSize += segments.shift()!;
                }
                packets.push(packetSize);
            }
            let vorbisHeaderFound = false;
            for (const size of packets) {
                if (this._readFourCharacters(view, index + 1) === "vorb") {
                    const headerType = view.getUint8(index);
                    if (headerType === 1) {
                        this._sampleRate = view.getUint32(index + 12, true);
                    } else if (headerType === 3) {
                        this._readMetaData(view, index, size);
                    }
                    vorbisHeaderFound = true;
                }
                index += size;
            }
            if (!vorbisHeaderFound) {
                break;
            }
        }
    }

    _readMetaData(view: DataView, index: number, size: number): void {
        for (let i = index; i < index + size - 10; i++) {
            if (this._readFourCharacters(view, i) === "LOOP") {
                let text = "";
                while (view.getUint8(i) > 0) {
                    text += String.fromCharCode(view.getUint8(i++));
                }
                if (text.match(/LOOPSTART=([0-9]+)/)) {
                    this._loopStart = parseInt(RegExp.$1);
                }
                if (text.match(/LOOPLENGTH=([0-9]+)/)) {
                    this._loopLength = parseInt(RegExp.$1);
                }
                if (text === "LOOPSTART" || text === "LOOPLENGTH") {
                    let text2 = "";
                    i += 16;
                    while (view.getUint8(i) > 0) {
                        text2 += String.fromCharCode(view.getUint8(i++));
                    }
                    if (text === "LOOPSTART") {
                        this._loopStart = parseInt(text2);
                    } else {
                        this._loopLength = parseInt(text2);
                    }
                }
            }
        }
    }

    _readFourCharacters(view: DataView, index: number): string {
        let string = "";
        if (index <= view.byteLength - 4) {
            for (let i = 0; i < 4; i++) {
                string += String.fromCharCode(view.getUint8(index + i));
            }
        }
        return string;
    }
}

/**
 * The static class that handles video playback.
 */
class Video {
    declare static _element: HTMLVideoElement | null;
    declare static _loading: boolean;
    declare static _volume: number;

    constructor() {
        throw new Error("This is a static class");
    }

    /**
     * Initializes the video system.
     * @param width - The width of the video.
     * @param height - The height of the video.
     */
    static initialize(width: number, height: number): void {
        this._element = null;
        this._loading = false;
        this._volume = 1;
        this._createElement();
        this._setupEventHandlers();
        this.resize(width, height);
    }

    /**
     * Changes the display size of the video.
     * @param width - The width of the video.
     * @param height - The height of the video.
     */
    static resize(width: number, height: number): void {
        if (this._element) {
            this._element.style.width = width + "px";
            this._element.style.height = height + "px";
        }
    }

    /**
     * Starts playback of a video.
     * @param src - The url of the video.
     */
    static play(src: string): void {
        this._element!.src = src;
        this._element!.onloadeddata = this._onLoad.bind(this);
        this._element!.onerror = this._onError.bind(this);
        this._element!.onended = this._onEnd.bind(this);
        this._element!.load();
        this._loading = true;
    }

    /**
     * Checks whether the video is playing.
     * @returns True if the video is playing.
     */
    static isPlaying(): boolean {
        return this._loading || this._isVisible();
    }

    /**
     * Sets the volume for videos.
     * @param volume - The volume for videos (0 to 1).
     */
    static setVolume(volume: number): void {
        this._volume = volume;
        if (this._element) {
            this._element.volume = this._volume;
        }
    }

    static _createElement(): void {
        this._element = document.createElement("video");
        this._element.id = "gameVideo";
        this._element.style.position = "absolute";
        this._element.style.margin = "auto";
        this._element.style.top = String(0);
        this._element.style.left = String(0);
        this._element.style.right = String(0);
        this._element.style.bottom = String(0);
        this._element.style.opacity = String(0);
        this._element.style.zIndex = String(2);
        this._element.setAttribute("playsinline", "");
        this._element.oncontextmenu = () => false;
        document.body.appendChild(this._element);
    }

    static _onLoad(): void {
        this._element!.volume = this._volume;
        this._element!.play();
        this._updateVisibility(true);
        this._loading = false;
    }

    static _onError(): void {
        this._updateVisibility(false);
        const retry = () => {
            this._element!.load();
        };
        throw ["LoadError", this._element!.src, retry];
    }

    static _onEnd(): void {
        this._updateVisibility(false);
    }

    static _updateVisibility(videoVisible: boolean): void {
        if (videoVisible) {
            Graphics.hideScreen();
        } else {
            Graphics.showScreen();
        }
        this._element!.style.opacity = String(videoVisible ? 1 : 0);
    }

    static _isVisible(): boolean {
        return Number(this._element!.style.opacity) > 0;
    }

    static _setupEventHandlers(): void {
        const onUserGesture = this._onUserGesture.bind(this);
        document.addEventListener("keydown", onUserGesture);
        document.addEventListener("mousedown", onUserGesture);
        document.addEventListener("touchend", onUserGesture);
    }

    static _onUserGesture(): void {
        if (!this._element!.src && this._element!.paused) {
            this._element!.play().catch(() => 0);
        }
    }
}

/**
 * The static class that handles input data from the keyboard and gamepads.
 */
class Input {
    declare static _currentState: Record<string, boolean>;
    declare static _previousState: Record<string, boolean>;
    declare static _gamepadStates: boolean[][];

    declare static _latestButton: string | null;
    declare static _pressedTime: number;
    declare static _dir4: number;
    declare static _dir8: number;
    declare static _preferredAxis: string;
    declare static _date: number;
    declare static _virtualButton: string | null;

    constructor() {
        throw new Error("This is a static class");
    }

    /**
     * Initializes the input system.
     */
    static initialize(): void {
        this.clear();
        this._setupEventHandlers();
    }

    /**
     * The wait time of the key repeat in frames.
     */
    static keyRepeatWait: number = 24;

    /**
     * The interval of the key repeat in frames.
     */
    static keyRepeatInterval: number = 6;

    /**
     * A hash table to convert from a virtual key code to a mapped key name.
     */
    static keyMapper: Record<number, string> = {
        9: "tab", // tab
        13: "ok", // enter
        16: "shift", // shift
        17: "control", // control
        18: "control", // alt
        27: "escape", // escape
        32: "ok", // space
        33: "pageup", // pageup
        34: "pagedown", // pagedown
        37: "left", // left arrow
        38: "up", // up arrow
        39: "right", // right arrow
        40: "down", // down arrow
        45: "escape", // insert
        81: "pageup", // Q
        87: "pagedown", // W
        88: "escape", // X
        90: "ok", // Z
        96: "escape", // numpad 0
        98: "down", // numpad 2
        100: "left", // numpad 4
        102: "right", // numpad 6
        104: "up", // numpad 8
        120: "debug", // F9
    };

    /**
     * A hash table to convert from a gamepad button to a mapped key name.
     */
    static gamepadMapper: Record<number, string> = {
        0: "ok", // A
        1: "cancel", // B
        2: "shift", // X
        3: "menu", // Y
        4: "pageup", // LB
        5: "pagedown", // RB
        12: "up", // D-pad up
        13: "down", // D-pad down
        14: "left", // D-pad left
        15: "right", // D-pad right
    };

    /**
     * Clears all the input data.
     */
    static clear(): void {
        this._currentState = {};
        this._previousState = {};
        this._gamepadStates = [];
        this._latestButton = null;
        this._pressedTime = 0;
        this._dir4 = 0;
        this._dir8 = 0;
        this._preferredAxis = "";
        this._date = 0;
        this._virtualButton = null;
    }

    /**
     * Updates the input data.
     */
    static update(): void {
        this._pollGamepads();
        if (this._currentState[this._latestButton!]) {
            this._pressedTime++;
        } else {
            this._latestButton = null;
        }
        for (const name in this._currentState) {
            if (this._currentState[name] && !this._previousState[name]) {
                this._latestButton = name;
                this._pressedTime = 0;
                this._date = Date.now();
            }
            this._previousState[name] = this._currentState[name];
        }
        if (this._virtualButton) {
            this._latestButton = this._virtualButton;
            this._pressedTime = 0;
            this._virtualButton = null;
        }
        this._updateDirection();
    }

    /**
     * Checks whether a key is currently pressed down.
     * @param keyName - The mapped name of the key.
     * @returns True if the key is pressed.
     */
    static isPressed(keyName: string): boolean {
        if (this._isEscapeCompatible(keyName) && this.isPressed("escape")) {
            return true;
        } else {
            return !!this._currentState[keyName];
        }
    }

    /**
     * Checks whether a key is just pressed.
     * @param keyName - The mapped name of the key.
     * @returns True if the key is triggered.
     */
    static isTriggered(keyName: string): boolean {
        if (this._isEscapeCompatible(keyName) && this.isTriggered("escape")) {
            return true;
        } else {
            return this._latestButton === keyName && this._pressedTime === 0;
        }
    }

    /**
     * Checks whether a key is just pressed or a key repeat occurred.
     * @param keyName - The mapped name of the key.
     * @returns True if the key is repeated.
     */
    static isRepeated(keyName: string): boolean {
        if (this._isEscapeCompatible(keyName) && this.isRepeated("escape")) {
            return true;
        } else {
            return (
                this._latestButton === keyName &&
                (this._pressedTime === 0 ||
                    (this._pressedTime >= this.keyRepeatWait && this._pressedTime % this.keyRepeatInterval === 0))
            );
        }
    }

    /**
     * Checks whether a key is kept depressed.
     * @param keyName - The mapped name of the key.
     * @returns True if the key is long-pressed.
     */
    static isLongPressed(keyName: string): boolean {
        if (this._isEscapeCompatible(keyName) && this.isLongPressed("escape")) {
            return true;
        } else {
            return this._latestButton === keyName && this._pressedTime >= this.keyRepeatWait;
        }
    }

    /**
     * The four direction value as a number of the numpad, or 0 for neutral.
     * @name Input.dir4
     */
    static get dir4(): RMMZ.Direction {
        return this._dir4 as RMMZ.Direction;
    }

    /**
     * The eight direction value as a number of the numpad, or 0 for neutral.
     * @name Input.dir8
     */
    static get dir8(): RMMZ.Direction {
        return this._dir8 as RMMZ.Direction;
    }

    /**
     * The time of the last input in milliseconds.
     * @name Input.date
     */
    static get date(): number {
        return this._date;
    }

    static virtualClick(buttonName: string): void {
        this._virtualButton = buttonName;
    }

    static _setupEventHandlers(): void {
        document.addEventListener("keydown", this._onKeyDown.bind(this));
        document.addEventListener("keyup", this._onKeyUp.bind(this));
        window.addEventListener("blur", this._onLostFocus.bind(this));
    }

    static _onKeyDown(event: KeyboardEvent): void {
        if (this._shouldPreventDefault(event.keyCode)) {
            event.preventDefault();
        }
        if (event.keyCode === 144) {
            // Numlock
            this.clear();
        }
        const buttonName = this.keyMapper[event.keyCode];
        if (buttonName) {
            this._currentState[buttonName] = true;
        }
    }

    static _shouldPreventDefault(keyCode: number): boolean {
        switch (keyCode) {
            case 8: // backspace
            case 9: // tab
            case 33: // pageup
            case 34: // pagedown
            case 37: // left arrow
            case 38: // up arrow
            case 39: // right arrow
            case 40: // down arrow
                return true;
        }
        return false;
    }

    static _onKeyUp(event: KeyboardEvent): void {
        const buttonName = this.keyMapper[event.keyCode];
        if (buttonName) {
            this._currentState[buttonName] = false;
        }
    }

    static _onLostFocus(): void {
        this.clear();
    }

    static _pollGamepads(): void {
        if (navigator.getGamepads) {
            const gamepads = navigator.getGamepads();
            if (gamepads) {
                for (const gamepad of gamepads) {
                    if (gamepad && gamepad.connected) {
                        this._updateGamepadState(gamepad);
                    }
                }
            }
        }
    }

    static _updateGamepadState(gamepad: Gamepad): void {
        const lastState = this._gamepadStates[gamepad.index] || [];
        const newState = [];
        const buttons = gamepad.buttons;
        const axes = gamepad.axes;
        const threshold = 0.5;
        newState[12] = false;
        newState[13] = false;
        newState[14] = false;
        newState[15] = false;
        for (let i = 0; i < buttons.length; i++) {
            newState[i] = buttons[i].pressed;
        }
        if (axes[1] < -threshold) {
            newState[12] = true; // up
        } else if (axes[1] > threshold) {
            newState[13] = true; // down
        }
        if (axes[0] < -threshold) {
            newState[14] = true; // left
        } else if (axes[0] > threshold) {
            newState[15] = true; // right
        }
        for (let j = 0; j < newState.length; j++) {
            if (newState[j] !== lastState[j]) {
                const buttonName = this.gamepadMapper[j];
                if (buttonName) {
                    this._currentState[buttonName] = newState[j];
                }
            }
        }
        this._gamepadStates[gamepad.index] = newState;
    }

    static _updateDirection(): void {
        let x = this._signX();
        let y = this._signY();
        this._dir8 = this._makeNumpadDirection(x, y);
        if (x !== 0 && y !== 0) {
            if (this._preferredAxis === "x") {
                y = 0;
            } else {
                x = 0;
            }
        } else if (x !== 0) {
            this._preferredAxis = "y";
        } else if (y !== 0) {
            this._preferredAxis = "x";
        }
        this._dir4 = this._makeNumpadDirection(x, y);
    }

    static _signX(): number {
        const left = this.isPressed("left") ? 1 : 0;
        const right = this.isPressed("right") ? 1 : 0;
        return right - left;
    }

    static _signY(): number {
        const up = this.isPressed("up") ? 1 : 0;
        const down = this.isPressed("down") ? 1 : 0;
        return down - up;
    }

    static _makeNumpadDirection(x: number, y: number): number {
        if (x === 0 && y === 0) {
            return 0;
        } else {
            return 5 - y * 3 + x;
        }
    }

    static _isEscapeCompatible(keyName: string): boolean {
        return keyName === "cancel" || keyName === "menu";
    }
}

/**
 * The static class that handles input data from the mouse and touchscreen.
 */
class TouchInput {
    declare static _mousePressed: boolean;
    declare static _screenPressed: boolean;
    declare static _pressedTime: number;
    declare static _clicked: boolean;
    declare static _newState: TouchInput.State;
    declare static _currentState: TouchInput.State;
    declare static _x: number;
    declare static _y: number;
    declare static _triggerX: number;
    declare static _triggerY: number;
    declare static _moved: boolean;
    declare static _date: number;

    constructor() {
        throw new Error("This is a static class");
    }

    /**
     * Initializes the touch system.
     */
    static initialize(): void {
        this.clear();
        this._setupEventHandlers();
    }

    /**
     * The wait time of the pseudo key repeat in frames.
     */
    static keyRepeatWait: number = 24;

    /**
     * The interval of the pseudo key repeat in frames.
     */
    static keyRepeatInterval: number = 6;

    /**
     * The threshold number of pixels to treat as moved.
     */
    static moveThreshold: number = 10;

    /**
     * Clears all the touch data.
     */
    static clear(): void {
        this._mousePressed = false;
        this._screenPressed = false;
        this._pressedTime = 0;
        this._clicked = false;
        this._newState = this._createNewState();
        this._currentState = this._createNewState();
        this._x = 0;
        this._y = 0;
        this._triggerX = 0;
        this._triggerY = 0;
        this._moved = false;
        this._date = 0;
    }

    /**
     * Updates the touch data.
     */
    static update(): void {
        this._currentState = this._newState;
        this._newState = this._createNewState();
        this._clicked = this._currentState.released && !this._moved;
        if (this.isPressed()) {
            this._pressedTime++;
        }
    }

    /**
     * Checks whether the mouse button or touchscreen has been pressed and
     * released at the same position.
     * @returns True if the mouse button or touchscreen is clicked.
     */
    static isClicked(): boolean {
        return this._clicked;
    }

    /**
     * Checks whether the mouse button or touchscreen is currently pressed down.
     * @returns True if the mouse button or touchscreen is pressed.
     */
    static isPressed(): boolean {
        return this._mousePressed || this._screenPressed;
    }

    /**
     * Checks whether the left mouse button or touchscreen is just pressed.
     * @returns True if the mouse button or touchscreen is triggered.
     */
    static isTriggered(): boolean {
        return this._currentState.triggered;
    }

    /**
     * Checks whether the left mouse button or touchscreen is just pressed
     * or a pseudo key repeat occurred.
     * @returns True if the mouse button or touchscreen is repeated.
     */
    static isRepeated(): boolean {
        return (
            this.isPressed() &&
            (this._currentState.triggered ||
                (this._pressedTime >= this.keyRepeatWait && this._pressedTime % this.keyRepeatInterval === 0))
        );
    }

    /**
     * Checks whether the left mouse button or touchscreen is kept depressed.
     * @returns True if the left mouse button or touchscreen is long-pressed.
     */
    static isLongPressed(): boolean {
        return this.isPressed() && this._pressedTime >= this.keyRepeatWait;
    }

    /**
     * Checks whether the right mouse button is just pressed.
     * @returns True if the right mouse button is just pressed.
     */
    static isCancelled(): boolean {
        return this._currentState.cancelled;
    }

    /**
     * Checks whether the mouse or a finger on the touchscreen is moved.
     * @returns True if the mouse or a finger on the touchscreen is moved.
     */
    static isMoved(): boolean {
        return this._currentState.moved;
    }

    /**
     * Checks whether the mouse is moved without pressing a button.
     * @returns True if the mouse is hovered.
     */
    static isHovered(): boolean {
        return this._currentState.hovered;
    }

    /**
     * Checks whether the left mouse button or touchscreen is released.
     * @returns True if the mouse button or touchscreen is released.
     */
    static isReleased(): boolean {
        return this._currentState.released;
    }

    /**
     * The horizontal scroll amount.
     * @name TouchInput.wheelX
     */
    static get wheelX(): number {
        return this._currentState.wheelX;
    }

    /**
     * The vertical scroll amount.
     * @name TouchInput.wheelY
     */
    static get wheelY(): number {
        return this._currentState.wheelY;
    }

    /**
     * The x coordinate on the canvas area of the latest touch event.
     * @name TouchInput.x
     */
    static get x(): number {
        return this._x;
    }

    /**
     * The y coordinate on the canvas area of the latest touch event.
     * @name TouchInput.y
     */
    static get y(): number {
        return this._y;
    }

    /**
     * The time of the last input in milliseconds.
     * @name TouchInput.date
     */
    static get date(): number {
        return this._date;
    }

    static _createNewState(): TouchInput.State {
        return {
            triggered: false,
            cancelled: false,
            moved: false,
            hovered: false,
            released: false,
            wheelX: 0,
            wheelY: 0,
        };
    }

    static _setupEventHandlers(): void {
        const pf = { passive: false };
        document.addEventListener("mousedown", this._onMouseDown.bind(this));
        document.addEventListener("mousemove", this._onMouseMove.bind(this));
        document.addEventListener("mouseup", this._onMouseUp.bind(this));
        document.addEventListener("wheel", this._onWheel.bind(this), pf);
        document.addEventListener("touchstart", this._onTouchStart.bind(this), pf);
        document.addEventListener("touchmove", this._onTouchMove.bind(this), pf);
        document.addEventListener("touchend", this._onTouchEnd.bind(this));
        document.addEventListener("touchcancel", this._onTouchCancel.bind(this));
        window.addEventListener("blur", this._onLostFocus.bind(this));
    }

    static _onMouseDown(event: MouseEvent): void {
        if (event.button === 0) {
            this._onLeftButtonDown(event);
        } else if (event.button === 1) {
            this._onMiddleButtonDown(event);
        } else if (event.button === 2) {
            this._onRightButtonDown(event);
        }
    }

    static _onLeftButtonDown(event: MouseEvent): void {
        const x = Graphics.pageToCanvasX(event.pageX);
        const y = Graphics.pageToCanvasY(event.pageY);
        if (Graphics.isInsideCanvas(x, y)) {
            this._mousePressed = true;
            this._pressedTime = 0;
            this._onTrigger(x, y);
        }
    }

    static _onMiddleButtonDown(event: MouseEvent): void;
    static _onMiddleButtonDown(/*event*/): void {
        //
    }

    static _onRightButtonDown(event: MouseEvent): void {
        const x = Graphics.pageToCanvasX(event.pageX);
        const y = Graphics.pageToCanvasY(event.pageY);
        if (Graphics.isInsideCanvas(x, y)) {
            this._onCancel(x, y);
        }
    }

    static _onMouseMove(event: MouseEvent): void {
        const x = Graphics.pageToCanvasX(event.pageX);
        const y = Graphics.pageToCanvasY(event.pageY);
        if (this._mousePressed) {
            this._onMove(x, y);
        } else if (Graphics.isInsideCanvas(x, y)) {
            this._onHover(x, y);
        }
    }

    static _onMouseUp(event: MouseEvent): void {
        if (event.button === 0) {
            const x = Graphics.pageToCanvasX(event.pageX);
            const y = Graphics.pageToCanvasY(event.pageY);
            this._mousePressed = false;
            this._onRelease(x, y);
        }
    }

    static _onWheel(event: WheelEvent): void {
        this._newState.wheelX += event.deltaX;
        this._newState.wheelY += event.deltaY;
        event.preventDefault();
    }

    static _onTouchStart(event: TouchEvent): void {
        for (const touch of event.changedTouches) {
            const x = Graphics.pageToCanvasX(touch.pageX);
            const y = Graphics.pageToCanvasY(touch.pageY);
            if (Graphics.isInsideCanvas(x, y)) {
                this._screenPressed = true;
                this._pressedTime = 0;
                if (event.touches.length >= 2) {
                    this._onCancel(x, y);
                } else {
                    this._onTrigger(x, y);
                }
                event.preventDefault();
            }
        }
        if (window.cordova || window.navigator.standalone) {
            event.preventDefault();
        }
    }

    static _onTouchMove(event: TouchEvent): void {
        for (const touch of event.changedTouches) {
            const x = Graphics.pageToCanvasX(touch.pageX);
            const y = Graphics.pageToCanvasY(touch.pageY);
            this._onMove(x, y);
        }
    }

    static _onTouchEnd(event: TouchEvent): void {
        for (const touch of event.changedTouches) {
            const x = Graphics.pageToCanvasX(touch.pageX);
            const y = Graphics.pageToCanvasY(touch.pageY);
            this._screenPressed = false;
            this._onRelease(x, y);
        }
    }

    static _onTouchCancel(/*event*/): void {
        this._screenPressed = false;
    }

    static _onLostFocus(): void {
        this.clear();
    }

    static _onTrigger(x: number, y: number): void {
        this._newState.triggered = true;
        this._x = x;
        this._y = y;
        this._triggerX = x;
        this._triggerY = y;
        this._moved = false;
        this._date = Date.now();
    }

    static _onCancel(x: number, y: number): void {
        this._newState.cancelled = true;
        this._x = x;
        this._y = y;
    }

    static _onMove(x: number, y: number): void {
        const dx = Math.abs(x - this._triggerX);
        const dy = Math.abs(y - this._triggerY);
        if (dx > this.moveThreshold || dy > this.moveThreshold) {
            this._moved = true;
        }
        if (this._moved) {
            this._newState.moved = true;
            this._x = x;
            this._y = y;
        }
    }

    static _onHover(x: number, y: number): void {
        this._newState.hovered = true;
        this._x = x;
        this._y = y;
    }

    static _onRelease(x: number, y: number): void {
        this._newState.released = true;
        this._x = x;
        this._y = y;
    }
}

declare namespace TouchInput {
    export interface State {
        triggered: boolean;
        cancelled: boolean;
        moved: boolean;
        hovered: boolean;
        released: boolean;
        wheelX: number;
        wheelY: number;
    }
}

/**
 * The static class that handles JSON with object information.
 */
class JsonEx {
    constructor() {
        throw new Error("This is a static class");
    }

    /**
     * The maximum depth of objects.
     * @default 100
     */
    static maxDepth: number = 100;

    /**
     * Converts an object to a JSON string with object information.
     * @param object - The object to be converted.
     * @returns The JSON string.
     */
    static stringify(object: unknown): string {
        return JSON.stringify(this._encode(object, 0));
    }

    /**
     * Parses a JSON string and reconstructs the corresponding object.
     * @param json - The JSON string.
     * @returns The reconstructed object.
     */
    static parse(json: string): any {
        return this._decode(JSON.parse(json));
    }

    /**
     * Makes a deep copy of the specified object.
     * @param object - The object to be copied.
     * @returns The copied object.
     */
    static makeDeepCopy<T>(object: T): T {
        return this.parse(this.stringify(object));
    }

    /**
     * Encodes constructor names for serialization. Circular references
     * are unsupported because handling them in MV was too complicated
     * and expensive.
     */
    static _encode(value: any, depth: number): any {
        if (depth >= this.maxDepth) {
            throw new Error("Object too deep");
        }
        const type = Object.prototype.toString.call(value);
        if (type === "[object Object]" || type === "[object Array]") {
            const constructorName = value.constructor.name;
            if (constructorName !== "Object" && constructorName !== "Array") {
                value["@"] = constructorName;
            }
            for (const key of Object.keys(value)) {
                value[key] = this._encode(value[key], depth + 1);
            }
        }
        return value;
    }

    static _decode(value: any): any {
        const type = Object.prototype.toString.call(value);
        if (type === "[object Object]" || type === "[object Array]") {
            if (value["@"]) {
                const constructor = (window as unknown as Record<string, { prototype: object }>)[value["@"]];
                if (constructor) {
                    Object.setPrototypeOf(value, constructor.prototype);
                }
            }
            for (const key of Object.keys(value)) {
                value[key] = this._decode(value[key]);
            }
        }
        return value;
    }
}
