// rmmz_core.js v2.0.0

/**
 * This section contains some methods that will be added to the standard
 * Javascript objects.
 *
 * @namespace JsExtensions
 */

/**
 * Makes a shallow copy of the array.
 *
 * @memberof JsExtensions
 * @returns {array} A shallow copy of the array.
 */
Array.prototype.clone = function() {
    return this.slice(0);
};

Object.defineProperty(Array.prototype, "clone", {
    enumerable: false
});

/**
 * Checks whether the array contains a given element.
 *
 * @memberof JsExtensions
 * @param {any} element - The element to search for.
 * @returns {boolean} True if the array contains a given element.
 * @deprecated includes() should be used instead.
 */
Array.prototype.contains = function(element) {
    return this.includes(element);
};

Object.defineProperty(Array.prototype, "contains", {
    enumerable: false
});

/**
 * Checks whether the two arrays are the same.
 *
 * @memberof JsExtensions
 * @param {array} array - The array to compare to.
 * @returns {boolean} True if the two arrays are the same.
 */
Array.prototype.equals = function(array) {
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
    enumerable: false
});

/**
 * Removes a given element from the array (in place).
 *
 * @memberof JsExtensions
 * @param {any} element - The element to remove.
 * @returns {array} The array after remove.
 */
Array.prototype.remove = function(element) {
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
    enumerable: false
});

/**
 * Generates a random integer in the range (0, max-1).
 *
 * @memberof JsExtensions
 * @param {number} max - The upper boundary (excluded).
 * @returns {number} A random integer.
 */
Math.randomInt = function(max) {
    return Math.floor(max * Math.random());
};

/**
 * Returns a number whose value is limited to the given range.
 *
 * @memberof JsExtensions
 * @param {number} min - The lower boundary.
 * @param {number} max - The upper boundary.
 * @returns {number} A number in the range (min, max).
 */
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

/**
 * Returns a modulo value which is always positive.
 *
 * @memberof JsExtensions
 * @param {number} n - The divisor.
 * @returns {number} A modulo value.
 */
Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
};

/**
 * Makes a number string with leading zeros.
 *
 * @memberof JsExtensions
 * @param {number} length - The length of the output string.
 * @returns {string} A string with leading zeros.
 */
Number.prototype.padZero = function(length) {
    return String(this).padZero(length);
};

/**
 * Checks whether the string contains a given string.
 *
 * @memberof JsExtensions
 * @param {string} string - The string to search for.
 * @returns {boolean} True if the string contains a given string.
 * @deprecated includes() should be used instead.
 */
String.prototype.contains = function(string) {
    return this.includes(string);
};

/**
 * Replaces %1, %2 and so on in the string to the arguments.
 *
 * @memberof JsExtensions
 * @param {any} ...args The objects to format.
 * @returns {string} A formatted string.
 */
String.prototype.format = function() {
    return this.replace(/%([0-9]+)/g, (s, n) => arguments[Number(n) - 1]);
};

/**
 * Makes a number string with leading zeros.
 *
 * @memberof JsExtensions
 * @param {number} length - The length of the output string.
 * @returns {string} A string with leading zeros.
 */
String.prototype.padZero = function(length) {
    return this.padStart(length, "0");
};

/**
 * The static class that defines utility methods.
 *
 * @namespace
 */
class Utils {
    constructor() {
        throw new Error("This is a static class");
    }

    /**
     * The name of the RPG Maker. "MZ" in the current version.
     *
     * @type {string}
     * @constant
     */
    static RPGMAKER_NAME = "MZ";

    /**
     * The version of the RPG Maker.
     *
     * @type {string}
     * @constant
     */
    static RPGMAKER_VERSION = "1.10.0";

    /**
     * Checks whether the current RPG Maker version is greater than or equal to
     * the given version.
     *
     * @param {string} version - The "x.x.x" format string to compare.
     * @returns {boolean} True if the current version is greater than or equal
     * to the given version.
     */
    static checkRMVersion(version) {
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
     *
     * @param {string} name - The option name.
     * @returns {boolean} True if the option is in the query string.
     */
    static isOptionValid(name) {
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
     *
     * @returns {boolean} True if the platform is NW.js.
     */
    static isNwjs() {
        return typeof require === "function" && typeof process === "object";
    }

    /**
     * Checks whether the platform is a mobile device.
     *
     * @returns {boolean} True if the platform is a mobile device.
     */
    static isMobileDevice() {
        const r = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i;
        return !!navigator.userAgent.match(r);
    }

    /**
     * Checks whether the browser is Mobile Safari.
     *
     * @returns {boolean} True if the browser is Mobile Safari.
     */
    static isMobileSafari() {
        const agent = navigator.userAgent;
        return !!(
            agent.match(/iPhone|iPad|iPod/) &&
            agent.match(/AppleWebKit/) &&
            !agent.match("CriOS")
        );
    }

    /**
     * Checks whether the browser is Android Chrome.
     *
     * @returns {boolean} True if the browser is Android Chrome.
     */
    static isAndroidChrome() {
        const agent = navigator.userAgent;
        return !!(agent.match(/Android/) && agent.match(/Chrome/));
    }

    /**
     * Checks whether the browser is accessing local files.
     *
     * @returns {boolean} True if the browser is accessing local files.
     */
    static isLocal() {
        return window.location.href.startsWith("file:");
    }

    /**
     * Checks whether the browser supports WebGL.
     *
     * @returns {boolean} True if the browser supports WebGL.
     */
    static canUseWebGL() {
        try {
            const canvas = document.createElement("canvas");
            return !!canvas.getContext("webgl");
        } catch (e) {
            return false;
        }
    }

    /**
     * Checks whether the browser supports Web Audio API.
     *
     * @returns {boolean} True if the browser supports Web Audio API.
     */
    static canUseWebAudioAPI() {
        return !!(window.AudioContext || window.webkitAudioContext);
    }

    /**
     * Checks whether the browser supports CSS Font Loading.
     *
     * @returns {boolean} True if the browser supports CSS Font Loading.
     */
    static canUseCssFontLoading() {
        return !!(document.fonts && document.fonts.ready);
    }

    /**
     * Checks whether the browser supports IndexedDB.
     *
     * @returns {boolean} True if the browser supports IndexedDB.
     */
    static canUseIndexedDB() {
        return !!(
            window.indexedDB ||
            window.mozIndexedDB ||
            window.webkitIndexedDB
        );
    }

    /**
     * Checks whether the browser can play ogg files.
     *
     * @returns {boolean} True if the browser can play ogg files.
     */
    static canPlayOgg() {
        if (!Utils._audioElement) {
            Utils._audioElement = document.createElement("audio");
        }
        return !!(
            Utils._audioElement &&
            Utils._audioElement.canPlayType('audio/ogg; codecs="vorbis"')
        );
    }

    /**
     * Checks whether the browser can play webm files.
     *
     * @returns {boolean} True if the browser can play webm files.
     */
    static canPlayWebm() {
        if (!Utils._videoElement) {
            Utils._videoElement = document.createElement("video");
        }
        return !!(
            Utils._videoElement &&
            Utils._videoElement.canPlayType('video/webm; codecs="vp8, vorbis"')
        );
    }

    /**
     * Encodes a URI component without escaping slash characters.
     *
     * @param {string} str - The input string.
     * @returns {string} Encoded string.
     */
    static encodeURI(str) {
        return encodeURIComponent(str).replace(/%2F/g, "/");
    }

    /**
     * Gets the filename that does not include subfolders.
     *
     * @param {string} filename - The filename with subfolders.
     * @returns {string} The filename without subfolders.
     */
    static extractFileName(filename) {
        return filename.split("/").pop();
    }

    /**
     * Escapes special characters for HTML.
     *
     * @param {string} str - The input string.
     * @returns {string} Escaped string.
     */
    static escapeHtml(str) {
        const entityMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
            "/": "&#x2F;"
        };
        return String(str).replace(/[&<>"'/]/g, s => entityMap[s]);
    }

    /**
     * Checks whether the string contains any Arabic characters.
     *
     * @param {string} str
     * @returns {boolean} True if the string contains any Arabic characters.
     */
    static containsArabic(str) {
        const regExp = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
        return regExp.test(str);
    }

    /**
     * Sets information related to encryption.
     *
     * @param {boolean} hasImages - Whether the image files are encrypted.
     * @param {boolean} hasAudio - Whether the audio files are encrypted.
     * @param {string} key - The encryption key.
     * @returns {void}
     */
    static setEncryptionInfo(hasImages, hasAudio, key) {
        // [Note] This function is implemented for module independence.
        this._hasEncryptedImages = hasImages;
        this._hasEncryptedAudio = hasAudio;
        this._encryptionKey = key;
    }

    /**
     * Checks whether the image files in the game are encrypted.
     *
     * @returns {boolean} True if the image files are encrypted.
     */
    static hasEncryptedImages() {
        return this._hasEncryptedImages;
    }

    /**
     * Checks whether the audio files in the game are encrypted.
     *
     * @returns {boolean} True if the audio files are encrypted.
     */
    static hasEncryptedAudio() {
        return this._hasEncryptedAudio;
    }

    /**
     * Decrypts encrypted data.
     *
     * @param {ArrayBuffer} source - The data to be decrypted.
     * @returns {ArrayBuffer} The decrypted data.
     */
    static decryptArrayBuffer(source) {
        const header = new Uint8Array(source, 0, 16);
        const headerHex = Array.from(header, x => x.toString(16)).join(",");
        if (headerHex !== "52,50,47,4d,56,0,0,0,0,3,1,0,0,0,0,0") {
            throw new Error("Decryption error");
        }
        const body = source.slice(16);
        const view = new DataView(body);
        const key = this._encryptionKey.match(/.{2}/g);
        for (let i = 0; i < 16; i++) {
            view.setUint8(i, view.getUint8(i) ^ parseInt(key[i], 16));
        }
        return body;
    }
}

/**
 * The static class that carries out graphics processing.
 *
 * @namespace
 */
class Graphics {
    constructor() {
        throw new Error("This is a static class");
    }

    /**
     * Initializes the graphics system.
     *
     * @returns {Promise<boolean>}
     */
    static async initialize() {
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
         *
         * @type number
         * @name Graphics.frameCount
         */
        this.frameCount = 0;

        /**
         * The width of the window display area.
         *
         * @type number
         * @name Graphics.boxWidth
         */
        this.boxWidth = this._width;

        /**
         * The height of the window display area.
         *
         * @type number
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
     *
     * @name Graphics.app
     * @type {import("pixi.js").Application}
     */
    static get app() {
        return this._app;
    }

    /**
     * The context object of Effekseer.
     *
     * @name Graphics.effekseer
     * @type {effekseer.EffekseerContext}
     */
    static get effekseer() {
        return this._effekseer;
    }

    /**
     * Register a handler for tick events.
     *
     * @param {(deltaTime: number) => void} handler - The listener function to be added for updates.
     * @returns {void}
     */
    static setTickHandler(handler) {
        this._tickHandler = handler;
    }

    /**
     * Starts the game loop.
     *
     * @returns {void}
     */
    static startGameLoop() {
        if (this._app) {
            this._app.start();
        }
    }

    /**
     * Stops the game loop.
     *
     * @returns {void}
     */
    static stopGameLoop() {
        if (this._app) {
            this._app.stop();
        }
    }

    /**
     * Sets the stage to be rendered.
     *
     * @param {Stage | null} stage - The stage object to be rendered.
     * @returns {void}
     */
    static setStage(stage) {
        if (this._app) {
            this._app.stage = stage;
        }
    }

    /**
     * Shows the loading spinner.
     *
     * @returns {void}
     */
    static startLoading() {
        if (!document.getElementById("loadingSpinner")) {
            document.body.appendChild(this._loadingSpinner);
        }
    }

    /**
     * Erases the loading spinner.
     *
     * @returns {boolean} True if the loading spinner was active.
     */
    static endLoading() {
        if (document.getElementById("loadingSpinner")) {
            document.body.removeChild(this._loadingSpinner);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Displays the error text to the screen.
     *
     * @param {string} name - The name of the error.
     * @param {string} message - The message of the error.
     * @param {Error | ErrorEvent} [error] - The error object.
     * @returns {void}
     */
    static printError(name, message, error = null) {
        if (!this._errorPrinter) {
            this._createErrorPrinter();
        }
        this._errorPrinter.innerHTML = this._makeErrorHtml(name, message, error);
        this._wasLoading = this.endLoading();
        this._applyCanvasFilter();
    }

    /**
     * Displays a button to try to reload resources.
     *
     * @param {() => void} retry - The callback function to be called when the button
     *   is pressed.
     * @returns {void}
     */
    static showRetryButton(retry) {
        const button = document.createElement("button");
        button.id = "retryButton";
        button.innerHTML = "Retry";
        // [Note] stopPropagation() is required for iOS Safari.
        button.ontouchstart = e => e.stopPropagation();
        button.onclick = () => {
            Graphics.eraseError();
            retry();
        };
        this._errorPrinter.appendChild(button);
        button.focus();
    }

    /**
     * Erases the loading error text.
     *
     * @returns {void}
     */
    static eraseError() {
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
     *
     * @param {number} x - The x coordinate on the page to be converted.
     * @returns {number} The x coordinate on the canvas area.
     */
    static pageToCanvasX(x) {
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
     *
     * @param {number} y - The y coordinate on the page to be converted.
     * @returns {number} The y coordinate on the canvas area.
     */
    static pageToCanvasY(y) {
        if (this._canvas) {
            const top = this._canvas.offsetTop;
            return Math.round((y - top) / this._realScale);
        } else {
            return 0;
        }
    }

    /**
     * Checks whether the specified point is inside the game canvas area.
     *
     * @param {number} x - The x coordinate on the canvas area.
     * @param {number} y - The y coordinate on the canvas area.
     * @returns {boolean} True if the specified point is inside the game canvas area.
     */
    static isInsideCanvas(x, y) {
        return x >= 0 && x < this._width && y >= 0 && y < this._height;
    }

    /**
     * Shows the game screen.
     *
     * @returns {void}
     */
    static showScreen() {
        this._canvas.style.opacity = 1;
    }

    /**
     * Hides the game screen.
     *
     * @returns {void}
     */
    static hideScreen() {
        this._canvas.style.opacity = 0;
    }

    /**
     * Changes the size of the game screen.
     *
     * @param {number} width - The width of the game screen.
     * @param {number} height - The height of the game screen.
     * @returns {void}
     */
    static resize(width, height) {
        this._width = width;
        this._height = height;
        this._app.renderer.resize(width, height);
        this._updateAllElements();
    }

    /**
     * The width of the game screen.
     *
     * @name Graphics.width
     * @type {number}
     */
    static get width() {
        return this._width;
    }
    /** @param {number} value */
    static set width(value) {
        if (this._width !== value) {
            this._width = value;
            this._updateAllElements();
        }
    }

    /**
     * The height of the game screen.
     *
     * @name Graphics.height
     * @type {number}
     */
    static get height() {
        return this._height;
    }
    /** @param {number} value */
    static set height(value) {
        if (this._height !== value) {
            this._height = value;
            this._updateAllElements();
        }
    }

    /**
     * The default zoom scale of the game screen.
     *
     * @name Graphics.defaultScale
     * @type {number}
     */
    static get defaultScale() {
        return this._defaultScale;
    }
    /** @param {number} value */
    static set defaultScale(value) {
        if (this._defaultScale !== value) {
            this._defaultScale = value;
            this._updateAllElements();
        }
    }

    /** @returns {void} */
    static _createAllElements() {
        this._createErrorPrinter();
        this._createCanvas();
        this._createLoadingSpinner();
        this._createFPSCounter();
    }

    /** @returns {void} */
    static _updateAllElements() {
        this._updateRealScale();
        this._updateErrorPrinter();
        this._updateCanvas();
        this._updateVideo();
    }

    /**
     * @param {import("pixi.js").Ticker} ticker
     * @returns {void}
     */
    static _onTick(ticker) {
        this._fpsCounter.startTick();
        if (this._tickHandler) {
            this._tickHandler(ticker.deltaTime);
        }
        if (this._canRender()) {
            this._app.render();
        }
        this._fpsCounter.endTick();
    }

    /** @returns {boolean} */
    static _canRender() {
        return !!this._app.stage;
    }

    /** @returns {void} */
    static _updateRealScale() {
        if (this._stretchEnabled && this._width > 0 && this._height > 0) {
            const h = this._stretchWidth() / this._width;
            const v = this._stretchHeight() / this._height;
            this._realScale = Math.min(h, v);
            window.scrollTo(0, 0);
        } else {
            this._realScale = this._defaultScale;
        }
    }

    /** @returns {number} */
    static _stretchWidth() {
        if (Utils.isMobileDevice()) {
            return document.documentElement.clientWidth;
        } else {
            return window.innerWidth;
        }
    }

    /** @returns {number} */
    static _stretchHeight() {
        if (Utils.isMobileDevice()) {
            // [Note] Mobile browsers often have special operations at the top and
            //   bottom of the screen.
            const rate = Utils.isLocal() ? 1.0 : 0.9;
            return document.documentElement.clientHeight * rate;
        } else {
            return window.innerHeight;
        }
    }

    /**
     * @param {string} [name]
     * @param {string} [message]
     * @returns {string}
     */
    static _makeErrorHtml(name, message /*, error*/) {
        const nameDiv = document.createElement("div");
        const messageDiv = document.createElement("div");
        nameDiv.id = "errorName";
        messageDiv.id = "errorMessage";
        nameDiv.innerHTML = Utils.escapeHtml(name || "");
        messageDiv.innerHTML = Utils.escapeHtml(message || "");
        return nameDiv.outerHTML + messageDiv.outerHTML;
    }

    /** @returns {boolean} */
    static _defaultStretchMode() {
        return Utils.isNwjs() || Utils.isMobileDevice();
    }

    /** @returns {void} */
    static _createErrorPrinter() {
        this._errorPrinter = document.createElement("div");
        this._errorPrinter.id = "errorPrinter";
        this._errorPrinter.innerHTML = this._makeErrorHtml();
        document.body.appendChild(this._errorPrinter);
    }

    /** @returns {void} */
    static _updateErrorPrinter() {
        const width = this._width * 0.8 * this._realScale;
        const height = 100 * this._realScale;
        this._errorPrinter.style.width = width + "px";
        this._errorPrinter.style.height = height + "px";
    }

    /** @returns {void} */
    static _createCanvas() {
        this._canvas = document.createElement("canvas");
        this._canvas.id = "gameCanvas";
        this._updateCanvas();
        document.body.appendChild(this._canvas);
    }

    /** @returns {void} */
    static _updateCanvas() {
        this._canvas.width = this._width;
        this._canvas.height = this._height;
        this._canvas.style.zIndex = 1;
        this._centerElement(this._canvas);
    }

    /** @returns {void} */
    static _updateVideo() {
        const width = this._width * this._realScale;
        const height = this._height * this._realScale;
        Video.resize(width, height);
    }

    /** @returns {void} */
    static _createLoadingSpinner() {
        const loadingSpinner = document.createElement("div");
        const loadingSpinnerImage = document.createElement("div");
        loadingSpinner.id = "loadingSpinner";
        loadingSpinnerImage.id = "loadingSpinnerImage";
        loadingSpinner.appendChild(loadingSpinnerImage);
        this._loadingSpinner = loadingSpinner;
    }

    /** @returns {void} */
    static _createFPSCounter() {
        this._fpsCounter = new Graphics.FPSCounter();
    }

    /**
     * @param {HTMLCanvasElement} element
     * @returns {void}
     */
    static _centerElement(element) {
        const width = element.width * this._realScale;
        const height = element.height * this._realScale;
        element.style.position = "absolute";
        element.style.margin = "auto";
        element.style.top = 0;
        element.style.left = 0;
        element.style.right = 0;
        element.style.bottom = 0;
        element.style.width = width + "px";
        element.style.height = height + "px";
    }

    /** @returns {void} */
    static _disableContextMenu() {
        const elements = document.body.getElementsByTagName("*");
        const oncontextmenu = () => false;
        for (const element of elements) {
            element.oncontextmenu = oncontextmenu;
        }
    }

    /** @returns {void} */
    static _applyCanvasFilter() {
        if (this._canvas) {
            this._canvas.style.opacity = 0.5;
            this._canvas.style.filter = "blur(8px)";
            this._canvas.style.webkitFilter = "blur(8px)";
        }
    }

    /** @returns {void} */
    static _clearCanvasFilter() {
        if (this._canvas) {
            this._canvas.style.opacity = 1;
            this._canvas.style.filter = "";
            this._canvas.style.webkitFilter = "";
        }
    }

    /** @returns {void} */
    static _setupEventHandlers() {
        window.addEventListener("resize", this._onWindowResize.bind(this));
        document.addEventListener("keydown", this._onKeyDown.bind(this));
    }

    /** @returns {void} */
    static _onWindowResize() {
        this._updateAllElements();
    }

    /**
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    static _onKeyDown(event) {
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

    /** @returns {void} */
    static _switchFPSCounter() {
        this._fpsCounter.switchMode();
    }

    /** @returns {void} */
    static _switchStretchMode() {
        this._stretchEnabled = !this._stretchEnabled;
        this._updateAllElements();
    }

    /** @returns {void} */
    static _switchFullScreen() {
        if (this._isFullScreen()) {
            this._cancelFullScreen();
        } else {
            this._requestFullScreen();
        }
    }

    /** @returns {boolean} */
    static _isFullScreen() {
        return (
            document.fullScreenElement ||
            document.mozFullScreen ||
            document.webkitFullscreenElement
        );
    }

    /** @returns {void} */
    static _requestFullScreen() {
        const element = document.body;
        if (element.requestFullScreen) {
            element.requestFullScreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    }

    /** @returns {void} */
    static _cancelFullScreen() {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }

    /** @returns {Promise<void>} */
    static async _createPixiApp() {
        const app = new PIXI.Application();
        await app.init({
            canvas: this._canvas,
            preference: "webgl",
            autoStart: false,
            gcMaxUnusedTime: 10000
        });
        app.ticker.remove(app.render, app);
        app.ticker.add(this._onTick, this);
        this._app = app;
    }

    /** @returns {void} */
    static _createEffekseerContext() {
        if (this._app && window.effekseer) {
            this._effekseer = effekseer.createContext();
            if (this._effekseer) {
                this._effekseer.init(this._app.renderer.gl);
                this._effekseer.setRestorationOfStatesFlag(true);
            }
        }
    }
}

/**
 * This is based on Darsain's FPSMeter which is under the MIT license.
 * The original can be found at https://github.com/Darsain/fpsmeter.
 */
Graphics.FPSCounter = class FPSCounter {
    constructor(...args) {
        this.initialize(...args);
    }

    initialize() {
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

    startTick() {
        this._frameStart = performance.now();
    }

    endTick() {
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

    switchMode() {
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

    _createElements() {
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

    _update() {
        const count = this._showFps ? this.fps : this.duration;
        this._labelDiv.textContent = this._showFps ? "FPS" : "ms";
        this._numberDiv.textContent = count.toFixed(0);
    }
};

/**
 * The point class.
 *
 * @class
 * @extends PIXI.Point
 * @param {number} x - The x coordinate.
 * @param {number} y - The y coordinate.
 */
class Point extends PIXI.Point {
    /**
     * @param {number} [x]
     * @param {number} [y]
     */
    constructor(x, y) {
        super(x, y);
    }
}

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
class Rectangle extends PIXI.Rectangle {
    /**
     * @param {number} [x]
     * @param {number} [y]
     * @param {number} [width]
     * @param {number} [height]
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);
    }
}

/**
 * The basic object that represents an image.
 *
 * @class
 * @param {number} width - The width of the bitmap.
 * @param {number} height - The height of the bitmap.
 */
class Bitmap {
    /** @param {[width?: number, height?: number]} args */
    constructor(...args) {
        this.initialize(...args);
    }

    /**
     * @param {number} [width]
     * @param {number} [height]
     */
    initialize(width, height) {
        /** @type {HTMLCanvasElement | null} */
        this._canvas = null;
        /** @type {CanvasRenderingContext2D | null} */
        this._context = null;
        this._textureSource = null;
        /** @type {HTMLImageElement | null} */
        this._image = null;
        /** @type {string} */
        this._url = "";
        /** @type {number} */
        this._paintOpacity = 255;
        /** @type {boolean} */
        this._smooth = true;
        /** @type {Array<(bitmap: Bitmap) => void>} */
        this._loadListeners = [];

        // "none", "loading", "loaded", or "error"
        /** @type {string} */
        this._loadingState = "none";

        if (width > 0 && height > 0) {
            this._createCanvas(width, height);
        }

        /**
         * The face name of the font.
         *
         * @type {string}
         */
        this.fontFace = "sans-serif";

        /**
         * The size of the font in pixels.
         *
         * @type {number}
         */
        this.fontSize = 16;

        /**
         * Whether the font is bold.
         *
         * @type {boolean}
         */
        this.fontBold = false;

        /**
         * Whether the font is italic.
         *
         * @type {boolean}
         */
        this.fontItalic = false;

        /**
         * The color of the text in CSS format.
         *
         * @type {string}
         */
        this.textColor = "#ffffff";

        /**
         * The color of the outline of the text in CSS format.
         *
         * @type {string}
         */
        this.outlineColor = "rgba(0, 0, 0, 0.5)";

        /**
         * The width of the outline of the text.
         *
         * @type {number}
         */
        this.outlineWidth = 3;
    }

    /**
     * Loads a image file.
     *
     * @param {string} url - The image url of the texture.
     * @returns {Bitmap} The new bitmap object.
     */
    static load(url) {
        const bitmap = Object.create(Bitmap.prototype);
        bitmap.initialize();
        bitmap._url = url;
        bitmap._startLoading();
        return bitmap;
    }

    /**
     * Takes a snapshot of the game screen.
     *
     * @param {Stage} stage - The stage object.
     * @returns {Bitmap} The new bitmap object.
     */
    static snap(stage) {
        const width = Graphics.width;
        const height = Graphics.height;
        const bitmap = new Bitmap(width, height);
        const renderTexture = PIXI.RenderTexture.create({ width, height });
        if (stage) {
            const renderer = Graphics.app.renderer;
            renderer.render({ container: stage, target: renderTexture });
            const canvas = renderer.extract.canvas(renderTexture);
            bitmap.context.drawImage(canvas, 0, 0);
            canvas.width = 0;
            canvas.height = 0;
        }
        renderTexture.destroy(true);
        bitmap.textureSource.update();
        return bitmap;
    }

    /**
     * Checks whether the bitmap is ready to render.
     *
     * @returns {boolean} True if the bitmap is ready to render.
     */
    isReady() {
        return this._loadingState === "loaded" || this._loadingState === "none";
    }

    /**
     * Checks whether a loading error has occurred.
     *
     * @returns {boolean} True if a loading error has occurred.
     */
    isError() {
        return this._loadingState === "error";
    }

    /**
     * The url of the image file.
     *
     * @name Bitmap#url
     * @type {string}
     */
    get url() {
        return this._url;
    }

    /**
     * The PixiJS texture source that holds the bitmap image.
     *
     * @type {import("pixi.js").TextureSource}
     * @name Bitmap#textureSource
     */
    get textureSource() {
        return this._textureSource;
    }

    /**
     * The bitmap image.
     *
     * @name Bitmap#image
     * @type {HTMLImageElement | null}
     */
    get image() {
        return this._image;
    }

    /**
     * The bitmap canvas.
     *
     * @name Bitmap#canvas
     * @type {HTMLCanvasElement}
     */
    get canvas() {
        this._ensureCanvas();
        return this._canvas;
    }

    /**
     * The 2d context of the bitmap canvas.
     *
     * @name Bitmap#context
     * @type {CanvasRenderingContext2D}
     */
    get context() {
        this._ensureCanvas();
        return this._context;
    }

    /**
     * The width of the bitmap.
     *
     * @name Bitmap#width
     * @type {number}
     */
    get width() {
        const image = this._canvas || this._image;
        return image ? image.width : 0;
    }

    /**
     * The height of the bitmap.
     *
     * @name Bitmap#height
     * @type {number}
     */
    get height() {
        const image = this._canvas || this._image;
        return image ? image.height : 0;
    }

    /**
     * The rectangle of the bitmap.
     *
     * @name Bitmap#rect
     * @type {Rectangle}
     */
    get rect() {
        return new PIXI.Rectangle(0, 0, this.width, this.height);
    }

    /**
     * Whether the smooth scaling is applied.
     *
     * @name Bitmap#smooth
     * @type {boolean}
     */
    get smooth() {
        return this._smooth;
    }
    /** @param {boolean} value */
    set smooth(value) {
        if (this._smooth !== value) {
            this._smooth = value;
            this._updateScaleMode();
        }
    }

    /**
     * The opacity of the drawing object in the range (0, 255).
     *
     * @name Bitmap#paintOpacity
     * @type {number}
     */
    get paintOpacity() {
        return this._paintOpacity;
    }
    /** @param {number} value */
    set paintOpacity(value) {
        if (this._paintOpacity !== value) {
            this._paintOpacity = value;
            this.context.globalAlpha = this._paintOpacity / 255;
        }
    }

    /**
     * Destroys the bitmap.
     *
     * @returns {void}
     */
    destroy() {
        if (this._textureSource) {
            this._textureSource.destroy();
            this._textureSource = null;
        }
        this._destroyCanvas();
    }

    /**
     * Resizes the bitmap.
     *
     * @param {number} width - The new width of the bitmap.
     * @param {number} height - The new height of the bitmap.
     * @returns {void}
     */
    resize(width, height) {
        width = Math.max(width || 0, 1);
        height = Math.max(height || 0, 1);
        this._ensureCanvas();
        this._textureSource.resize(width, height);
    }

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
    blt(source, sx, sy, sw, sh, dx, dy, dw, dh) {
        dw = dw || sw;
        dh = dh || sh;
        try {
            const image = source._canvas || source._image;
            this.context.globalCompositeOperation = "source-over";
            this.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
            this._textureSource.update();
        } catch (e) {
            //
        }
    }

    /**
     * Returns pixel color at the specified point.
     *
     * @param {number} x - The x coordinate of the pixel in the bitmap.
     * @param {number} y - The y coordinate of the pixel in the bitmap.
     * @returns {string} The pixel color (hex format).
     */
    getPixel(x, y) {
        const data = this.context.getImageData(x, y, 1, 1).data;
        let result = "#";
        for (let i = 0; i < 3; i++) {
            result += data[i].toString(16).padZero(2);
        }
        return result;
    }

    /**
     * Returns alpha pixel value at the specified point.
     *
     * @param {number} x - The x coordinate of the pixel in the bitmap.
     * @param {number} y - The y coordinate of the pixel in the bitmap.
     * @returns {number} The alpha value.
     */
    getAlphaPixel(x, y) {
        const data = this.context.getImageData(x, y, 1, 1).data;
        return data[3];
    }

    /**
     * Clears the specified rectangle.
     *
     * @param {number} x - The x coordinate for the upper-left corner.
     * @param {number} y - The y coordinate for the upper-left corner.
     * @param {number} width - The width of the rectangle to clear.
     * @param {number} height - The height of the rectangle to clear.
     * @returns {void}
     */
    clearRect(x, y, width, height) {
        this.context.clearRect(x, y, width, height);
        this._textureSource.update();
    }

    /**
     * Clears the entire bitmap.
     *
     * @returns {void}
     */
    clear() {
        this.clearRect(0, 0, this.width, this.height);
    }

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
    fillRect(x, y, width, height, color) {
        const context = this.context;
        context.save();
        context.fillStyle = color;
        context.fillRect(x, y, width, height);
        context.restore();
        this._textureSource.update();
    }

    /**
     * Fills the entire bitmap.
     *
     * @param {string} color - The color of the rectangle in CSS format.
     * @returns {void}
     */
    fillAll(color) {
        this.fillRect(0, 0, this.width, this.height, color);
    }

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
    strokeRect(x, y, width, height, color) {
        const context = this.context;
        context.save();
        context.strokeStyle = color;
        context.strokeRect(x, y, width, height);
        context.restore();
        this._textureSource.update();
    }

    // prettier-ignore
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
    gradientFillRect(
        x, y, width, height, color1, color2, vertical
    ) {
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
        this._textureSource.update();
    }

    /**
     * Draws a bitmap in the shape of a circle.
     *
     * @param {number} x - The x coordinate based on the circle center.
     * @param {number} y - The y coordinate based on the circle center.
     * @param {number} radius - The radius of the circle.
     * @param {string} color - The color of the circle in CSS format.
     * @returns {void}
     */
    drawCircle(x, y, radius, color) {
        const context = this.context;
        context.save();
        context.fillStyle = color;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2, false);
        context.fill();
        context.restore();
        this._textureSource.update();
    }

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
    drawText(text, x, y, maxWidth, lineHeight, align) {
        // [Note] Different browser makes different rendering with
        //   textBaseline == 'top'. So we use 'alphabetic' here.
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
        context.textAlign = align;
        context.textBaseline = "alphabetic";
        context.globalAlpha = 1;
        this._drawTextOutline(text, tx, ty, maxWidth);
        context.globalAlpha = alpha;
        this._drawTextBody(text, tx, ty, maxWidth);
        context.restore();
        this._textureSource.update();
    }

    /**
     * Returns the width of the specified text.
     *
     * @param {string} text - The text to be measured.
     * @returns {number} The width of the text in pixels.
     */
    measureTextWidth(text) {
        const context = this.context;
        context.save();
        context.font = this._makeFontNameText();
        const width = context.measureText(text).width;
        context.restore();
        return width;
    }

    /**
     * Adds a callback function that will be called when the bitmap is loaded.
     *
     * @param {(bitmap: Bitmap) => void} listner - The callback function.
     * @returns {void}
     */
    addLoadListener(listner) {
        if (!this.isReady()) {
            this._loadListeners.push(listner);
        } else {
            listner(this);
        }
    }

    /**
     * Tries to load the image again.
     *
     * @returns {void}
     */
    retry() {
        this._startLoading();
    }

    /** @returns {string} */
    _makeFontNameText() {
        const italic = this.fontItalic ? "Italic " : "";
        const bold = this.fontBold ? "Bold " : "";
        return italic + bold + this.fontSize + "px " + this.fontFace;
    }

    /**
     * @param {string} text
     * @param {number} tx
     * @param {number} ty
     * @param {number} maxWidth
     * @returns {void}
     */
    _drawTextOutline(text, tx, ty, maxWidth) {
        const context = this.context;
        context.strokeStyle = this.outlineColor;
        context.lineWidth = this.outlineWidth;
        context.lineJoin = "round";
        context.strokeText(text, tx, ty, maxWidth);
    }

    /**
     * @param {string} text
     * @param {number} tx
     * @param {number} ty
     * @param {number} maxWidth
     * @returns {void}
     */
    _drawTextBody(text, tx, ty, maxWidth) {
        const context = this.context;
        context.fillStyle = this.textColor;
        context.fillText(text, tx, ty, maxWidth);
    }

    /**
     * @param {number} width
     * @param {number} height
     * @returns {void}
     */
    _createCanvas(width, height) {
        this._canvas = document.createElement("canvas");
        this._context = this._canvas.getContext("2d");
        this._canvas.width = width;
        this._canvas.height = height;
        this._createTextureSource(this._canvas);
    }

    /** @returns {void} */
    _ensureCanvas() {
        if (!this._canvas) {
            if (this._image) {
                this._createCanvas(this._image.width, this._image.height);
                this._context.drawImage(this._image, 0, 0);
            } else {
                this._createCanvas(0, 0);
            }
        }
    }

    /** @returns {void} */
    _destroyCanvas() {
        if (this._canvas) {
            this._canvas.width = 0;
            this._canvas.height = 0;
            this._canvas = null;
        }
    }

    /**
     * @param {HTMLCanvasElement | HTMLImageElement} resource
     * @returns {void}
     */
    _createTextureSource(resource) {
        const Source = resource === this._canvas ? PIXI.CanvasSource : PIXI.ImageSource;
        this._textureSource = new Source({ resource, resolution: 1 });
        this._updateScaleMode();
    }

    /** @returns {void} */
    _updateScaleMode() {
        if (this._textureSource) {
            this._textureSource.scaleMode = this._smooth ? "linear" : "nearest";
        }
    }

    /** @returns {void} */
    _startLoading() {
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

    /** @returns {void} */
    _startDecrypting() {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", this._url + "_");
        xhr.responseType = "arraybuffer";
        xhr.onload = () => this._onXhrLoad(xhr);
        xhr.onerror = this._onError.bind(this);
        xhr.send();
    }

    /**
     * @param {XMLHttpRequest} xhr
     * @returns {void}
     */
    _onXhrLoad(xhr) {
        if (xhr.status < 400) {
            const arrayBuffer = Utils.decryptArrayBuffer(xhr.response);
            const blob = new Blob([arrayBuffer]);
            this._image.src = URL.createObjectURL(blob);
        } else {
            this._onError();
        }
    }

    /** @returns {void} */
    _onLoad() {
        if (Utils.hasEncryptedImages()) {
            URL.revokeObjectURL(this._image.src);
        }
        this._loadingState = "loaded";
        this._createTextureSource(this._image);
        this._callLoadListeners();
    }

    /** @returns {void} */
    _callLoadListeners() {
        while (this._loadListeners.length > 0) {
            const listener = this._loadListeners.shift();
            listener(this);
        }
    }

    /** @returns {void} */
    _onError() {
        this._loadingState = "error";
    }
}

/**
 * The basic object that is rendered to the game screen.
 *
 * @class
 * @extends PIXI.Sprite
 * @param {Bitmap} bitmap - The image for the sprite.
 */
class Sprite extends PIXI.Sprite {
    /** @param {[bitmap?: Bitmap]} args */
    constructor(...args) {
        super(new PIXI.Texture({
            source: PIXI.Texture.EMPTY.source,
            frame: new PIXI.Rectangle(),
            dynamic: true
        }));
        // Engine sprites can have overlays and other child sprites.
        this.allowChildren = true;
        this.initialize(...args);
    }

    /** @param {Bitmap} [bitmap] */
    initialize(bitmap) {
        /** @type {number} */
        this.spriteId = Sprite._counter++;
        /** @type {Bitmap} */
        this._bitmap = bitmap;
        /** @type {Rectangle} */
        this._frame = new PIXI.Rectangle();
        /** @type {number} */
        this._hue = 0;
        /** @type {RMMZ.Color} */
        this._blendColor = [0, 0, 0, 0];
        /** @type {RMMZ.Color} */
        this._colorTone = [0, 0, 0, 0];
        /** @type {ColorFilter | null} */
        this._colorFilter = null;
        /** @type {boolean} */
        this._hidden = false;
        this._onBitmapChange();
    }

    /** @type {number} */
    static _counter = 0;

    /**
     * The image for the sprite.
     *
     * @name Sprite#bitmap
     * @type {Bitmap}
     */
    get bitmap() {
        return this._bitmap;
    }
    /** @param {Bitmap} value */
    set bitmap(value) {
        if (this._bitmap !== value) {
            this._bitmap = value;
            this._onBitmapChange();
        }
    }

    /**
     * The width of the sprite without the scale.
     *
     * @name Sprite#width
     * @type {number}
     */
    get width() {
        return this._frame.width;
    }
    /** @param {number} value */
    set width(value) {
        this._frame.width = value;
        this._refresh();
    }

    /**
     * The height of the sprite without the scale.
     *
     * @name Sprite#height
     * @type {number}
     */
    get height() {
        return this._frame.height;
    }
    /** @param {number} value */
    set height(value) {
        this._frame.height = value;
        this._refresh();
    }

    /**
     * The opacity of the sprite (0 to 255).
     *
     * @name Sprite#opacity
     * @type {number}
     */
    get opacity() {
        return this.alpha * 255;
    }
    /** @param {number} value */
    set opacity(value) {
        this.alpha = value.clamp(0, 255) / 255;
    }

    /**
     * The blend mode to be applied to the sprite.
     *
     * @name Sprite#blendMode
     * @type {import("pixi.js").BLEND_MODES}
     */
    get blendMode() {
        return this._colorFilter?.blendMode ?? super.blendMode;
    }

    /** @param {RMMZ.BlendMode} value */
    set blendMode(value) {
        const mode = typeof value === "number" ? Sprite._blendModes[value] ?? "normal" : value;
        if (this._colorFilter) {
            this._colorFilter.blendMode = mode;
        } else {
            super.blendMode = mode;
        }
    }

    static _blendModes = ["normal", "add", "multiply", "screen"];

    /**
     * Destroys the sprite.
     *
     * @returns {void}
     */
    destroy() {
        const options = { children: true, texture: true };
        super.destroy(options);
    }

    /**
     * Updates the sprite for each frame.
     *
     * @returns {void}
     */
    update() {
        for (const child of this.children) {
            if (child.update) {
                child.update();
            }
        }
    }

    /**
     * Makes the sprite "hidden".
     *
     * @returns {void}
     */
    hide() {
        this._hidden = true;
        this.updateVisibility();
    }

    /**
     * Releases the "hidden" state of the sprite.
     *
     * @returns {void}
     */
    show() {
        this._hidden = false;
        this.updateVisibility();
    }

    /**
     * Reflects the "hidden" state of the sprite to the visible state.
     *
     * @returns {void}
     */
    updateVisibility() {
        this.visible = !this._hidden;
    }

    /**
     * Sets the x and y at once.
     *
     * @param {number} x - The x coordinate of the sprite.
     * @param {number} y - The y coordinate of the sprite.
     * @returns {void}
     */
    move(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Sets the rectagle of the bitmap that the sprite displays.
     *
     * @param {number} x - The x coordinate of the frame.
     * @param {number} y - The y coordinate of the frame.
     * @param {number} width - The width of the frame.
     * @param {number} height - The height of the frame.
     * @returns {void}
     */
    setFrame(x, y, width, height) {
        this._refreshFrame = false;
        const frame = this._frame;
        if (
            x !== frame.x ||
            y !== frame.y ||
            width !== frame.width ||
            height !== frame.height
        ) {
            frame.x = x;
            frame.y = y;
            frame.width = width;
            frame.height = height;
            this._refresh();
        }
    }

    /**
     * Sets the hue rotation value.
     *
     * @param {number} hue - The hue value (-360, 360).
     * @returns {void}
     */
    setHue(hue) {
        if (this._hue !== Number(hue)) {
            this._hue = Number(hue);
            this._updateColorFilter();
        }
    }

    /**
     * Gets the blend color for the sprite.
     *
     * @returns {[ number, number, number, number ]} The blend color [r, g, b, a].
     */
    getBlendColor() {
        return this._blendColor.clone();
    }

    /**
     * Sets the blend color for the sprite.
     *
     * @param {RMMZ.Color} color - The blend color [r, g, b, a].
     * @returns {void}
     */
    setBlendColor(color) {
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
     *
     * @returns {[ number, number, number, number ]} The color tone [r, g, b, gray].
     */
    getColorTone() {
        return this._colorTone.clone();
    }

    /**
     * Sets the color tone for the sprite.
     *
     * @param {RMMZ.Color} tone - The color tone [r, g, b, gray].
     * @returns {void}
     */
    setColorTone(tone) {
        if (!(tone instanceof Array)) {
            throw new Error("Argument must be an array");
        }
        if (!this._colorTone.equals(tone)) {
            this._colorTone = tone.clone();
            this._updateColorFilter();
        }
    }

    /** @returns {void} */
    _onBitmapChange() {
        if (this._bitmap) {
            this._refreshFrame = true;
            this._bitmap.addLoadListener(this._onBitmapLoad.bind(this));
        } else {
            this._refreshFrame = false;
            this._refresh();
        }
    }

    /**
     * @param {Bitmap} bitmapLoaded
     * @returns {void}
     */
    _onBitmapLoad(bitmapLoaded) {
        if (bitmapLoaded === this._bitmap) {
            if (this._refreshFrame && this._bitmap) {
                this._refreshFrame = false;
                this._frame.width = this._bitmap.width;
                this._frame.height = this._bitmap.height;
            }
            this._refresh();
        }
    }

    /** @returns {void} */
    _refresh() {
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
        texture.frame.copyFrom({ x: realX, y: realY, width: realW, height: realH });
        const source = textureSource ?? PIXI.Texture.EMPTY.source;
        if (texture.source !== source) {
            texture.source = source;
        }
        texture.update();
    }

    /** @returns {void} */
    _createColorFilter() {
        this._colorFilter = new ColorFilter();
        this._colorFilter.blendMode = super.blendMode;
        super.blendMode = "normal";
        this.filters = [...(this.filters ?? []), this._colorFilter];
    }

    /** @returns {void} */
    _updateColorFilter() {
        if (!this._colorFilter) {
            this._createColorFilter();
        }
        this._colorFilter.setHue(this._hue);
        this._colorFilter.setBlendColor(this._blendColor);
        this._colorFilter.setColorTone(this._colorTone);
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
 *
 * @class
 * @extends PIXI.Container
 */
class Tilemap extends PIXI.Container {
    constructor() {
        super();

        /** @type {number} */
        this._width = Graphics.width;
        /** @type {number} */
        this._height = Graphics.height;
        /** @type {number} */
        this._margin = 20;
        /** @type {number} */
        this._mapWidth = 0;
        /** @type {number} */
        this._mapHeight = 0;
        /** @type {number[] | null} */
        this._mapData = null;
        /** @type {Bitmap[]} */
        this._bitmaps = [];

        /**
         * The width of each tile.
         *
         * @type {number}
         */
        this.tileWidth = 48;

        /**
         * The height of each tile.
         *
         * @type {number}
         */
        this.tileHeight = 48;

        /**
         * The origin point of the tilemap for scrolling.
         *
         * @type {import("pixi.js").Point}
         */
        this.origin = new PIXI.Point();

        /**
         * The tileset flags.
         *
         * @type {any[]}
         */
        this.flags = [];

        /**
         * The animation count for autotiles.
         *
         * @type {number}
         */
        this.animationCount = 0;

        /**
         * Whether the tilemap loops horizontal.
         *
         * @type {boolean}
         */
        this.horizontalWrap = false;

        /**
         * Whether the tilemap loops vertical.
         *
         * @type {boolean}
         */
        this.verticalWrap = false;

        this._createLayers();
        this.onRender = this._updateLayers;
        this.refresh();
    }

    /**
     * The width of the tilemap.
     *
     * @name Tilemap#width
     * @type {number}
     */
    get width() {
        return this._width;
    }
    /** @param {number} value */
    set width(value) {
        this._width = value;
    }

    /**
     * The height of the tilemap.
     *
     * @name Tilemap#height
     * @type {number}
     */
    get height() {
        return this._height;
    }
    /** @param {number} value */
    set height(value) {
        this._height = value;
    }

    /**
     * Destroys the tilemap.
     *
     * @returns {void}
     */
    destroy() {
        super.destroy({ children: true });
        this._tileShader.destroy();
        for (const atlas of this._tileAtlases) {
            atlas.destroy();
        }
    }

    /**
     * Sets the tilemap data.
     *
     * @param {number} width - The width of the map in number of tiles.
     * @param {number} height - The height of the map in number of tiles.
     * @param {number[]} data - The one dimensional array for the map data.
     * @returns {void}
     */
    setData(width, height, data) {
        this._mapWidth = width;
        this._mapHeight = height;
        this._mapData = data;
    }

    /**
     * Checks whether the tileset is ready to render.
     *
     * @returns {boolean} True if the tilemap is ready.
     */
    isReady() {
        for (const bitmap of this._bitmaps) {
            if (bitmap && !bitmap.isReady()) {
                return false;
            }
        }
        return true;
    }

    /**
     * Updates the tilemap for each frame.
     *
     * @returns {void}
     */
    update() {
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
     *
     * @param {Bitmap[]} bitmaps - The array of the tileset bitmaps.
     * @returns {void}
     */
    setBitmaps(bitmaps) {
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
     *
     * @returns {void}
     */
    refresh() {
        this._needsRepaint = true;
    }

    /** @returns {void} */
    _updateLayers() {
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

    /** @returns {void} */
    _createLayers() {
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

    /** @returns {void} */
    _updateBitmaps() {
        if (this._needsBitmapsUpdate && this.isReady()) {
            this._updateAtlasTextures();
            this._needsBitmapsUpdate = false;
            this._needsRepaint = true;
        }
    }

    /** @returns {void} */
    _updateAtlasTextures() {
        // Four tilesheets share each atlas. The shader binds at most three atlases.
        for (let i = 0; i < 3; i++) {
            const bitmaps = this._bitmaps.slice(i * 4, i * 4 + 4);
            if (!this._tileAtlases[i]) {
                const canvas = document.createElement("canvas");
                canvas.width = canvas.height = 2048;
                this._tileAtlases[i] = new PIXI.CanvasSource({
                    resource: canvas,
                    resolution: 1,
                    scaleMode: "nearest"
                });
            }
            const source = this._tileAtlases[i];
            const context = source.resource.getContext("2d");
            context.clearRect(0, 0, 2048, 2048);
            for (let j = 0; j < bitmaps.length; j++) {
                const bitmap = bitmaps[j];
                const image = bitmap?.image || bitmap?.canvas;
                if (image?.width && image.height) {
                    const width = Math.min(image.width, 1024);
                    const height = Math.min(image.height, 1024);
                    context.drawImage(image, 0, 0, width, height,
                        1024 * (j % 2), 1024 * (j >> 1), width, height);
                }
            }
            source.update();
            this._tileShader.resources["uSampler" + i] = source;
        }
    }

    /**
     * @param {number} startX
     * @param {number} startY
     * @returns {void}
     */
    _addAllSpots(startX, startY) {
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

    /**
     * @param {number} startX
     * @param {number} startY
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    _addSpot(startX, startY, x, y) {
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

    /**
     * @param {RMMZ.TileID} tileId
     * @param {number} dx
     * @param {number} dy
     * @returns {void}
     */
    _addSpotTile(tileId, dx, dy) {
        if (this._isHigherTile(tileId)) {
            this._addTile(this._upperLayer, tileId, dx, dy);
        } else {
            this._addTile(this._lowerLayer, tileId, dx, dy);
        }
    }

    /**
     * @param {Tilemap.CombinedLayer} layer
     * @param {RMMZ.TileID} tileId
     * @param {number} dx
     * @param {number} dy
     * @returns {void}
     */
    _addTile(layer, tileId, dx, dy) {
        if (Tilemap.isVisibleTile(tileId)) {
            if (Tilemap.isAutotile(tileId)) {
                this._addAutotile(layer, tileId, dx, dy);
            } else {
                this._addNormalTile(layer, tileId, dx, dy);
            }
        }
    }

    /**
     * @param {Tilemap.CombinedLayer} layer
     * @param {RMMZ.TileID} tileId
     * @param {number} dx
     * @param {number} dy
     * @returns {void}
     */
    _addNormalTile(layer, tileId, dx, dy) {
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

    /**
     * @param {Tilemap.CombinedLayer} layer
     * @param {RMMZ.TileID} tileId
     * @param {number} dx
     * @param {number} dy
     * @returns {void}
     */
    _addAutotile(layer, tileId, dx, dy) {
        const kind = Tilemap.getAutotileKind(tileId);
        const shape = Tilemap.getAutotileShape(tileId);
        const tx = kind % 8;
        const ty = Math.floor(kind / 8);
        let setNumber = 0;
        let bx = 0;
        let by = 0;
        let autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
        let isTable = false;

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

    /**
     * @param {Tilemap.CombinedLayer} layer
     * @param {RMMZ.TileID} tileId
     * @param {number} dx
     * @param {number} dy
     * @returns {void}
     */
    _addTableEdge(layer, tileId, dx, dy) {
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

    /**
     * @param {Tilemap.CombinedLayer} layer
     * @param {number} shadowBits
     * @param {number} dx
     * @param {number} dy
     * @returns {void}
     */
    _addShadow(layer, shadowBits, dx, dy) {
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

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {number}
     */
    _readMapData(x, y, z) {
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

    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    _isHigherTile(tileId) {
        return this.flags[tileId] & 0x10;
    }

    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    _isTableTile(tileId) {
        return Tilemap.isTileA2(tileId) && this.flags[tileId] & 0x80;
    }

    /** @returns {boolean} */
    _isOverpassPosition(/*mx, my*/) {
        return false;
    }

    /** @returns {void} */
    _sortChildren() {
        const sorted = this.children.slice().sort(this._compareChildOrder);
        for (let i = 0; i < sorted.length; i++) {
            sorted[i].zIndex = i;
        }
    }

    /**
     * @param {Sprite} a
     * @param {Sprite} b
     * @returns {number}
     */
    _compareChildOrder(a, b) {
        if (a.z !== b.z) {
            return a.z - b.z;
        } else if (a.y !== b.y) {
            return a.y - b.y;
        } else {
            return a.spriteId - b.spriteId;
        }
    }

    // Tile type checkers
    static TILE_ID_B = 0;

    static TILE_ID_C = 256;

    static TILE_ID_D = 512;

    static TILE_ID_E = 768;

    static TILE_ID_A5 = 1536;

    static TILE_ID_A1 = 2048;

    static TILE_ID_A2 = 2816;

    static TILE_ID_A3 = 4352;

    static TILE_ID_A4 = 5888;

    static TILE_ID_MAX = 8192;

    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isVisibleTile(tileId) {
        return tileId > 0 && tileId < this.TILE_ID_MAX;
    }

    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isAutotile(tileId) {
        return tileId >= this.TILE_ID_A1;
    }

    /**
     * @param {RMMZ.TileID} tileId
     * @returns {number}
     */
    static getAutotileKind(tileId) {
        return Math.floor((tileId - this.TILE_ID_A1) / 48);
    }

    /**
     * @param {RMMZ.TileID} tileId
     * @returns {number}
     */
    static getAutotileShape(tileId) {
        return (tileId - this.TILE_ID_A1) % 48;
    }

    /**
     * @param {number} kind
     * @param {number} shape
     * @returns {number}
     */
    static makeAutotileId(kind, shape) {
        return this.TILE_ID_A1 + kind * 48 + shape;
    }

    /**
     * @param {number} tileID1
     * @param {number} tileID2
     * @returns {boolean}
     */
    static isSameKindTile(tileID1, tileID2) {
        if (this.isAutotile(tileID1) && this.isAutotile(tileID2)) {
            return this.getAutotileKind(tileID1) === this.getAutotileKind(tileID2);
        } else {
            return tileID1 === tileID2;
        }
    }

    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isTileA1(tileId) {
        return tileId >= this.TILE_ID_A1 && tileId < this.TILE_ID_A2;
    }

    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isTileA2(tileId) {
        return tileId >= this.TILE_ID_A2 && tileId < this.TILE_ID_A3;
    }

    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isTileA3(tileId) {
        return tileId >= this.TILE_ID_A3 && tileId < this.TILE_ID_A4;
    }

    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isTileA4(tileId) {
        return tileId >= this.TILE_ID_A4 && tileId < this.TILE_ID_MAX;
    }

    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isTileA5(tileId) {
        return tileId >= this.TILE_ID_A5 && tileId < this.TILE_ID_A1;
    }

    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isWaterTile(tileId) {
        if (this.isTileA1(tileId)) {
            return !(
                tileId >= this.TILE_ID_A1 + 96 && tileId < this.TILE_ID_A1 + 192
            );
        } else {
            return false;
        }
    }

    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isWaterfallTile(tileId) {
        if (tileId >= this.TILE_ID_A1 + 192 && tileId < this.TILE_ID_A2) {
            return this.getAutotileKind(tileId) % 2 === 1;
        } else {
            return false;
        }
    }

    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isGroundTile(tileId) {
        return (
            this.isTileA1(tileId) || this.isTileA2(tileId) || this.isTileA5(tileId)
        );
    }

    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isShadowingTile(tileId) {
        return this.isTileA3(tileId) || this.isTileA4(tileId);
    }

    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isRoofTile(tileId) {
        return this.isTileA3(tileId) && this.getAutotileKind(tileId) % 16 < 8;
    }

    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isWallTopTile(tileId) {
        return this.isTileA4(tileId) && this.getAutotileKind(tileId) % 16 < 8;
    }

    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isWallSideTile(tileId) {
        return (
            (this.isTileA3(tileId) || this.isTileA4(tileId)) &&
            this.getAutotileKind(tileId) % 16 >= 8
        );
    }

    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isWallTile(tileId) {
        return this.isWallTopTile(tileId) || this.isWallSideTile(tileId);
    }

    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isFloorTypeAutotile(tileId) {
        return (
            (this.isTileA1(tileId) && !this.isWaterfallTile(tileId)) ||
            this.isTileA2(tileId) ||
            this.isWallTopTile(tileId)
        );
    }

    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isWallTypeAutotile(tileId) {
        return this.isRoofTile(tileId) || this.isWallSideTile(tileId);
    }

    /**
     * @param {RMMZ.TileID} tileId
     * @returns {boolean}
     */
    static isWaterfallTypeAutotile(tileId) {
        return this.isWaterfallTile(tileId);
    }

    // Autotile shape number to coordinates of tileset images
    // prettier-ignore
    /** @type {number[][][]} */
    static FLOOR_AUTOTILE_TABLE = [
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
    /** @type {number[][][]} */
    static WALL_AUTOTILE_TABLE = [
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
    /** @type {number[][][]} */
    static WATERFALL_AUTOTILE_TABLE = [
        [[2, 0], [1, 0], [2, 1], [1, 1]],
        [[0, 0], [1, 0], [0, 1], [1, 1]],
        [[2, 0], [3, 0], [2, 1], [3, 1]],
        [[0, 0], [3, 0], [0, 1], [3, 1]]
    ];
}

// Internal classes

Tilemap.Layer = class Layer extends PIXI.Mesh {
    /** @param {import("pixi.js").Shader} shader */
    constructor(shader) {
        const vertices = new PIXI.Buffer({
            data: new Float32Array(0),
            usage: PIXI.BufferUsage.VERTEX | PIXI.BufferUsage.COPY_DST,
            shrinkToFit: false
        });
        const indices = new PIXI.Buffer({
            data: new Uint16Array(0),
            usage: PIXI.BufferUsage.INDEX | PIXI.BufferUsage.COPY_DST,
            shrinkToFit: false
        });
        const attribute = (format, offset) => ({
            buffer: vertices,
            format,
            stride: 9 * Float32Array.BYTES_PER_ELEMENT,
            offset: offset * Float32Array.BYTES_PER_ELEMENT
        });
        const geometry = new PIXI.Geometry({
            attributes: {
                aTextureId: attribute("float32", 0),
                aFrame: attribute("float32x4", 1),
                aSource: attribute("float32x2", 5),
                aPosition: attribute("float32x2", 7)
            },
            indexBuffer: indices
        });
        super({ geometry, shader });
        /** @type {Array<[ number, number, number, number, number, number, number ]>} */
        this._elements = [];
        /** @type {Float32Array} */
        this._indexArray = new Uint16Array(0);
        /** @type {Float32Array} */
        this._vertexArray = new Float32Array(0);
        /** @type {boolean} */
        this._needsVertexUpdate = false;
        this.onRender = this._updateGeometry;
    }

    // Four vertices per tile must fit in the 16-bit index buffer.
    static MAX_SIZE = 16000;

    /** @returns {void} */
    destroy() {
        const geometry = this.geometry;
        super.destroy();
        geometry.destroy(true);
    }

    /** @returns {void} */
    clear() {
        this._elements.length = 0;
        this._needsVertexUpdate = true;
    }

    /** @returns {number} */
    size() {
        return this._elements.length;
    }

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
    addRect(setNumber, sx, sy, dx, dy, w, h) {
        this._elements.push([setNumber, sx, sy, dx, dy, w, h]);
        this._needsVertexUpdate = true;
    }

    /** @returns {void} */
    _updateGeometry() {
        if (this._needsVertexUpdate) {
            this._updateIndexBuffer();
            this._updateVertexBuffer();
            this._needsVertexUpdate = false;
        }
        this.renderable = this._elements.length > 0;
    }

    /** @returns {void} */
    _updateIndexBuffer() {
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

    /** @returns {void} */
    _updateVertexBuffer() {
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
};

Tilemap.CombinedLayer = class CombinedLayer extends PIXI.Container {
    /** @param {import("pixi.js").Shader} shader */
    constructor(shader) {
        super();
        for (let i = 0; i < 2; i++) {
            this.addChild(new Tilemap.Layer(shader));
        }
    }

    /** @returns {void} */
    clear() {
        for (const child of this.children) {
            child.clear();
        }
    }

    /** @returns {number} */
    size() {
        return this.children.reduce((r, child) => r + child.size(), 0);
    }

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
    // prettier-ignore
    addRect(
        setNumber, sx, sy, dx, dy, w, h
    ) {
        for (const child of this.children) {
            if (child.size() < Tilemap.Layer.MAX_SIZE) {
                child.addRect(setNumber, sx, sy, dx, dy, w, h);
                break;
            }
        }
    }

};

Tilemap.createShader = function() {
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
        resources: { uSampler0: source, uSampler1: source, uSampler2: source }
    });
};

/**
 * The sprite object for a tiling image.
 *
 * @class
 * @extends PIXI.TilingSprite
 * @param {Bitmap} bitmap - The image for the tiling sprite.
 */
class TilingSprite extends PIXI.TilingSprite {
    /** @param {[bitmap?: Bitmap]} args */
    constructor(...args) {
        super({
            texture: new PIXI.Texture({
                source: PIXI.Texture.EMPTY.source,
                frame: new PIXI.Rectangle(0, 0, 1, 1),
                dynamic: true
            })
        });
        this.onRender = this._updateTilePosition;
        this.initialize(...args);
    }

    /** @param {Bitmap} [bitmap] */
    initialize(bitmap) {
        /** @type {Bitmap} */
        this._bitmap = bitmap;
        this.width = 0;
        this.height = 0;
        /** @type {Rectangle} */
        this._frame = new PIXI.Rectangle();

        /**
         * The origin point of the tiling sprite for scrolling.
         *
         * @type {import("pixi.js").Point}
         */
        this.origin = new PIXI.Point();

        this._onBitmapChange();
    }

    /**
     * The image for the tiling sprite.
     *
     * @name TilingSprite#bitmap
     * @type {Bitmap}
     */
    get bitmap() {
        return this._bitmap;
    }
    /** @param {Bitmap} value */
    set bitmap(value) {
        if (this._bitmap !== value) {
            this._bitmap = value;
            this._onBitmapChange();
        }
    }

    /**
     * The opacity of the tiling sprite (0 to 255).
     *
     * @name TilingSprite#opacity
     * @type {number}
     */
    get opacity() {
        return this.alpha * 255;
    }
    /** @param {number} value */
    set opacity(value) {
        this.alpha = value.clamp(0, 255) / 255;
    }

    /**
     * Destroys the tiling sprite.
     *
     * @returns {void}
     */
    destroy() {
        const options = { children: true, texture: true };
        super.destroy(options);
    }

    /**
     * Updates the tiling sprite for each frame.
     *
     * @returns {void}
     */
    update() {
        for (const child of this.children) {
            if (child.update) {
                child.update();
            }
        }
    }

    /**
     * Sets the x, y, width, and height all at once.
     *
     * @param {number} x - The x coordinate of the tiling sprite.
     * @param {number} y - The y coordinate of the tiling sprite.
     * @param {number} width - The width of the tiling sprite.
     * @param {number} height - The height of the tiling sprite.
     * @returns {void}
     */
    move(x, y, width, height) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 0;
        this.height = height || 0;
    }

    /**
     * Specifies the region of the image that the tiling sprite will use.
     *
     * @param {number} x - The x coordinate of the frame.
     * @param {number} y - The y coordinate of the frame.
     * @param {number} width - The width of the frame.
     * @param {number} height - The height of the frame.
     * @returns {void}
     */
    setFrame(x, y, width, height) {
        this._frame.x = x;
        this._frame.y = y;
        this._frame.width = width;
        this._frame.height = height;
        this._refresh();
    }

    /** @returns {void} */
    _updateTilePosition() {
        this.tilePosition.x = Math.round(-this.origin.x);
        this.tilePosition.y = Math.round(-this.origin.y);
    }

    /** @returns {void} */
    _onBitmapChange() {
        if (this._bitmap) {
            this._bitmap.addLoadListener(bitmap => {
                if (this._bitmap === bitmap) {
                    this._refresh();
                }
            });
        }
        this._refresh();
    }

    /** @returns {void} */
    _refresh() {
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
 *
 * @class
 * @extends PIXI.Container
 */
class ScreenSprite extends PIXI.Container {
    constructor() {
        super();
        /** @type {import("pixi.js").Graphics} */
        this._graphics = new PIXI.Graphics();
        this.addChild(this._graphics);
        this.opacity = 0;
        /** @type {number} */
        this._red = -1;
        /** @type {number} */
        this._green = -1;
        /** @type {number} */
        this._blue = -1;
        this.setBlack();
    }

    /**
     * The opacity of the sprite (0 to 255).
     *
     * @name ScreenSprite#opacity
     * @type {number}
     */
    get opacity() {
        return this.alpha * 255;
    }
    /** @param {number} value */
    set opacity(value) {
        this.alpha = value.clamp(0, 255) / 255;
    }

    /**
     * Destroys the screen sprite.
     *
     * @returns {void}
     */
    destroy() {
        const options = { children: true, texture: true };
        super.destroy(options);
    }

    /**
     * Sets black to the color of the screen sprite.
     *
     * @returns {void}
     */
    setBlack() {
        this.setColor(0, 0, 0);
    }

    /**
     * Sets white to the color of the screen sprite.
     *
     * @returns {void}
     */
    setWhite() {
        this.setColor(255, 255, 255);
    }

    /**
     * Sets the color of the screen sprite by values.
     *
     * @param {number} r - The red value in the range (0, 255).
     * @param {number} g - The green value in the range (0, 255).
     * @param {number} b - The blue value in the range (0, 255).
     * @returns {void}
     */
    setColor(r, g, b) {
        if (this._red !== r || this._green !== g || this._blue !== b) {
            r = Math.round(r || 0).clamp(0, 255);
            g = Math.round(g || 0).clamp(0, 255);
            b = Math.round(b || 0).clamp(0, 255);
            this._red = r;
            this._green = g;
            this._blue = b;
            const graphics = this._graphics;
            graphics.clear().rect(-50000, -50000, 100000, 100000)
                .fill((r << 16) | (g << 8) | b);
        }
    }
}

/**
 * The window in the game.
 *
 * @class
 * @extends PIXI.Container
 */
class Window extends PIXI.Container {
    /** @param {[]} args */
    constructor(...args) {
        super();
        this.initialize(...args);
    }

    initialize() {
        this.onRender = this._updateWindowParts;
        /** @type {boolean} */
        this._isWindow = true;
        /** @type {Bitmap} */
        this._windowskin = null;
        /** @type {number} */
        this._width = 0;
        /** @type {number} */
        this._height = 0;
        /** @type {Rectangle} */
        this._cursorRect = new PIXI.Rectangle();
        /** @type {number} */
        this._openness = 255;
        /** @type {number} */
        this._animationCount = 0;

        /** @type {number} */
        this._padding = 12;
        /** @type {number} */
        this._margin = 4;
        /** @type {RMMZ.Color} */
        this._colorTone = [0, 0, 0, 0];
        /** @type {import("pixi.js").ContainerChild[]} */
        this._innerChildren = [];

        /** @type {import("pixi.js").Container} */
        this._container = null;
        /** @type {Sprite} */
        this._backSprite = null;
        /** @type {Sprite} */
        this._frameSprite = null;
        /** @type {Sprite} */
        this._contentsBackSprite = null;
        /** @type {Sprite} */
        this._cursorSprite = null;
        /** @type {Sprite} */
        this._contentsSprite = null;
        /** @type {Sprite} */
        this._downArrowSprite = null;
        /** @type {Sprite} */
        this._upArrowSprite = null;
        /** @type {Sprite} */
        this._pauseSignSprite = null;

        this._createAllParts();

        /**
         * The origin point of the window for scrolling.
         *
         * @type {import("pixi.js").Point}
         */
        this.origin = new PIXI.Point();

        /**
         * The active state for the window.
         *
         * @type {boolean}
         */
        this.active = true;

        /**
         * The visibility of the frame.
         *
         * @type {boolean}
         */
        this.frameVisible = true;

        /**
         * The visibility of the cursor.
         *
         * @type {boolean}
         */
        this.cursorVisible = true;

        /**
         * The visibility of the down scroll arrow.
         *
         * @type {boolean}
         */
        this.downArrowVisible = false;

        /**
         * The visibility of the up scroll arrow.
         *
         * @type {boolean}
         */
        this.upArrowVisible = false;

        /**
         * The visibility of the pause sign.
         *
         * @type {boolean}
         */
        this.pause = false;
    }

    /**
     * The image used as a window skin.
     *
     * @name Window#windowskin
     * @type {Bitmap}
     */
    get windowskin() {
        return this._windowskin;
    }
    /** @param {Bitmap} value */
    set windowskin(value) {
        if (this._windowskin !== value) {
            this._windowskin = value;
            this._windowskin.addLoadListener(this._onWindowskinLoad.bind(this));
        }
    }

    /**
     * The bitmap used for the window contents.
     *
     * @name Window#contents
     * @type {Bitmap}
     */
    get contents() {
        return this._contentsSprite.bitmap;
    }
    /** @param {Bitmap} value */
    set contents(value) {
        this._contentsSprite.bitmap = value;
    }

    /**
     * The bitmap used for the window contents background.
     *
     * @name Window#contentsBack
     * @type {Bitmap}
     */
    get contentsBack() {
        return this._contentsBackSprite.bitmap;
    }
    /** @param {Bitmap} value */
    set contentsBack(value) {
        this._contentsBackSprite.bitmap = value;
    }

    /**
     * The width of the window in pixels.
     *
     * @name Window#width
     * @type {number}
     */
    get width() {
        return this._width;
    }
    /** @param {number} value */
    set width(value) {
        this._width = value;
        this._refreshAllParts();
    }

    /**
     * The height of the window in pixels.
     *
     * @name Window#height
     * @type {number}
     */
    get height() {
        return this._height;
    }
    /** @param {number} value */
    set height(value) {
        this._height = value;
        this._refreshAllParts();
    }

    /**
     * The size of the padding between the frame and contents.
     *
     * @name Window#padding
     * @type {number}
     */
    get padding() {
        return this._padding;
    }
    /** @param {number} value */
    set padding(value) {
        this._padding = value;
        this._refreshAllParts();
    }

    /**
     * The size of the margin for the window background.
     *
     * @name Window#margin
     * @type {number}
     */
    get margin() {
        return this._margin;
    }
    /** @param {number} value */
    set margin(value) {
        this._margin = value;
        this._refreshAllParts();
    }

    /**
     * The opacity of the window without contents (0 to 255).
     *
     * @name Window#opacity
     * @type {number}
     */
    get opacity() {
        return this._container.alpha * 255;
    }
    /** @param {number} value */
    set opacity(value) {
        this._container.alpha = value.clamp(0, 255) / 255;
    }

    /**
     * The opacity of the window background (0 to 255).
     *
     * @name Window#backOpacity
     * @type {number}
     */
    get backOpacity() {
        return this._backSprite.alpha * 255;
    }
    /** @param {number} value */
    set backOpacity(value) {
        this._backSprite.alpha = value.clamp(0, 255) / 255;
    }

    /**
     * The opacity of the window contents (0 to 255).
     *
     * @name Window#contentsOpacity
     * @type {number}
     */
    get contentsOpacity() {
        return this._contentsSprite.alpha * 255;
    }
    /** @param {number} value */
    set contentsOpacity(value) {
        this._contentsSprite.alpha = value.clamp(0, 255) / 255;
    }

    /**
     * The openness of the window (0 to 255).
     *
     * @name Window#openness
     * @type {number}
     */
    get openness() {
        return this._openness;
    }
    /** @param {number} value */
    set openness(value) {
        if (this._openness !== value) {
            this._openness = value.clamp(0, 255);
            this._container.scale.y = this._openness / 255;
            this._container.y = (this.height / 2) * (1 - this._openness / 255);
        }
    }

    /**
     * The width of the content area in pixels.
     *
     * @name Window#innerWidth
     * @type {number}
     */
    get innerWidth() {
        return Math.max(0, this._width - this._padding * 2);
    }

    /**
     * The height of the content area in pixels.
     *
     * @name Window#innerHeight
     * @type {number}
     */
    get innerHeight() {
        return Math.max(0, this._height - this._padding * 2);
    }

    /**
     * The rectangle of the content area.
     *
     * @name Window#innerRect
     * @type {Rectangle}
     */
    get innerRect() {
        return new PIXI.Rectangle(
            this._padding,
            this._padding,
            this.innerWidth,
            this.innerHeight
        );
    }

    /**
     * Destroys the window.
     *
     * @returns {void}
     */
    destroy() {
        const options = { children: true, texture: true };
        super.destroy(options);
    }

    /**
     * Updates the window for each frame.
     *
     * @returns {void}
     */
    update() {
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
     *
     * @param {number} x - The x coordinate of the window.
     * @param {number} y - The y coordinate of the window.
     * @param {number} width - The width of the window.
     * @param {number} height - The height of the window.
     * @returns {void}
     */
    move(x, y, width, height) {
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
     *
     * @returns {boolean} True if the window is open.
     */
    isOpen() {
        return this._openness >= 255;
    }

    /**
     * Checks whether the window is completely closed (openness == 0).
     *
     * @returns {boolean} True if the window is closed.
     */
    isClosed() {
        return this._openness <= 0;
    }

    /**
     * Sets the position of the command cursor.
     *
     * @param {number} x - The x coordinate of the cursor.
     * @param {number} y - The y coordinate of the cursor.
     * @param {number} width - The width of the cursor.
     * @param {number} height - The height of the cursor.
     * @returns {void}
     */
    setCursorRect(x, y, width, height) {
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
     *
     * @param {number} x - The amount of horizontal movement.
     * @param {number} y - The amount of vertical movement.
     * @returns {void}
     */
    moveCursorBy(x, y) {
        this._cursorRect.x += x;
        this._cursorRect.y += y;
    }

    /**
     * Moves the inner children by the given amount.
     *
     * @param {number} x - The amount of horizontal movement.
     * @param {number} y - The amount of vertical movement.
     * @returns {void}
     */
    moveInnerChildrenBy(x, y) {
        for (const child of this._innerChildren) {
            child.x += x;
            child.y += y;
        }
    }

    /**
     * Changes the color of the background.
     *
     * @param {number} r - The red value in the range (-255, 255).
     * @param {number} g - The green value in the range (-255, 255).
     * @param {number} b - The blue value in the range (-255, 255).
     * @returns {void}
     */
    setTone(r, g, b) {
        const tone = this._colorTone;
        if (r !== tone[0] || g !== tone[1] || b !== tone[2]) {
            this._colorTone = [r, g, b, 0];
            this._refreshBack();
        }
    }

    /**
     * Adds a child between the background and contents.
     *
     * @param {import("pixi.js").ContainerChild} child - The child to add.
     * @returns {import("pixi.js").ContainerChild} The child that was added.
     */
    addChildToBack(child) {
        const containerIndex = this.children.indexOf(this._container);
        return this.addChildAt(child, containerIndex + 1);
    }

    /**
     * Adds a child to the client area.
     *
     * @param {import("pixi.js").ContainerChild} child - The child to add.
     * @returns {import("pixi.js").ContainerChild} The child that was added.
     */
    addInnerChild(child) {
        this._innerChildren.push(child);
        return this._clientArea.addChild(child);
    }

    /** @returns {void} */
    _updateWindowParts() {
        this._updateClientArea();
        this._updateFrame();
        this._updateContentsBack();
        this._updateCursor();
        this._updateContents();
        this._updateArrows();
        this._updatePauseSign();
        this._updateFilterArea();
    }

    /** @returns {import("pixi.js").Rectangle} */
    openBounds() {
        const height = this.height * this.openness / 255;
        return new PIXI.Rectangle(this.x, this.y + (this.height - height) / 2, this.width, height);
    }

    /** @returns {void} */
    _createAllParts() {
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

    /** @returns {void} */
    _createContainer() {
        this._container = new PIXI.Container();
        this.addChild(this._container);
    }

    /** @returns {void} */
    _createBackSprite() {
        this._backSprite = new Sprite();
        this._backSprite.addChild(new TilingSprite());
        this._container.addChild(this._backSprite);
    }

    /** @returns {void} */
    _createFrameSprite() {
        this._frameSprite = new Sprite();
        for (let i = 0; i < 8; i++) {
            this._frameSprite.addChild(new Sprite());
        }
        this._container.addChild(this._frameSprite);
    }

    /** @returns {void} */
    _createClientArea() {
        this._clientArea = new Sprite();
        this._clientArea.filters = [new PIXI.AlphaFilter()];
        this._clientArea.filterArea = new PIXI.Rectangle();
        this._clientArea.move(this._padding, this._padding);
        this.addChild(this._clientArea);
    }

    /** @returns {void} */
    _createContentsBackSprite() {
        this._contentsBackSprite = new Sprite();
        this._clientArea.addChild(this._contentsBackSprite);
    }

    /** @returns {void} */
    _createCursorSprite() {
        this._cursorSprite = new Sprite();
        for (let i = 0; i < 9; i++) {
            this._cursorSprite.addChild(new Sprite());
        }
        this._clientArea.addChild(this._cursorSprite);
    }

    /** @returns {void} */
    _createContentsSprite() {
        this._contentsSprite = new Sprite();
        this._clientArea.addChild(this._contentsSprite);
    }

    /** @returns {void} */
    _createArrowSprites() {
        this._downArrowSprite = new Sprite();
        this.addChild(this._downArrowSprite);
        this._upArrowSprite = new Sprite();
        this.addChild(this._upArrowSprite);
    }

    /** @returns {void} */
    _createPauseSignSprites() {
        this._pauseSignSprite = new Sprite();
        this.addChild(this._pauseSignSprite);
    }

    /** @returns {void} */
    _onWindowskinLoad() {
        this._refreshAllParts();
    }

    /** @returns {void} */
    _refreshAllParts() {
        this._refreshBack();
        this._refreshFrame();
        this._refreshCursor();
        this._refreshArrows();
        this._refreshPauseSign();
    }

    /** @returns {void} */
    _refreshBack() {
        const m = this._margin;
        const w = Math.max(0, this._width - m * 2);
        const h = Math.max(0, this._height - m * 2);
        const sprite = this._backSprite;
        const tilingSprite = sprite.children[0];
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

    /** @returns {void} */
    _refreshFrame() {
        const drect = { x: 0, y: 0, width: this._width, height: this._height };
        const srect = { x: 96, y: 0, width: 96, height: 96 };
        const m = 24;
        for (const child of this._frameSprite.children) {
            child.bitmap = this._windowskin;
        }
        this._setRectPartsGeometry(this._frameSprite, srect, drect, m);
    }

    /** @returns {void} */
    _refreshCursor() {
        const drect = this._cursorRect.clone();
        const srect = { x: 96, y: 96, width: 48, height: 48 };
        const m = 4;
        for (const child of this._cursorSprite.children) {
            child.bitmap = this._windowskin;
        }
        this._setRectPartsGeometry(this._cursorSprite, srect, drect, m);
    }

    /**
     * @param {Sprite} sprite
     * @param {Rectangle} srect
     * @param {Rectangle} drect
     * @param {number} m
     * @returns {void}
     */
    _setRectPartsGeometry(sprite, srect, drect, m) {
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
        const children = sprite.children;
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

    /** @returns {void} */
    _refreshArrows() {
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

    /** @returns {void} */
    _refreshPauseSign() {
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

    /** @returns {void} */
    _updateClientArea() {
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

    /** @returns {void} */
    _updateFrame() {
        this._frameSprite.visible = this.frameVisible;
    }

    /** @returns {void} */
    _updateContentsBack() {
        const bitmap = this._contentsBackSprite.bitmap;
        if (bitmap) {
            this._contentsBackSprite.setFrame(0, 0, bitmap.width, bitmap.height);
        }
    }

    /** @returns {void} */
    _updateCursor() {
        this._cursorSprite.alpha = this._makeCursorAlpha();
        this._cursorSprite.visible = this.isOpen() && this.cursorVisible;
        this._cursorSprite.x = this._cursorRect.x;
        this._cursorSprite.y = this._cursorRect.y;
    }

    /** @returns {number} */
    _makeCursorAlpha() {
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

    /** @returns {void} */
    _updateContents() {
        const bitmap = this._contentsSprite.bitmap;
        if (bitmap) {
            this._contentsSprite.setFrame(0, 0, bitmap.width, bitmap.height);
        }
    }

    /** @returns {void} */
    _updateArrows() {
        this._downArrowSprite.visible = this.isOpen() && this.downArrowVisible;
        this._upArrowSprite.visible = this.isOpen() && this.upArrowVisible;
    }

    /** @returns {void} */
    _updatePauseSign() {
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

    /** @returns {void} */
    _updateFilterArea() {
        const filterArea = this._clientArea.filterArea;
        filterArea.x = this.origin.x;
        filterArea.y = this.origin.y;
        filterArea.width = this.innerWidth;
        filterArea.height = this.innerHeight;
    }
}

/**
 * The layer which contains game windows.
 *
 * @class
 * @extends PIXI.Container
 */
class WindowLayer extends PIXI.Container {
    constructor() {
        super();
        this._windowLayout = [];
        this.onRender = this._updateWindowMasks;
    }

    /** @param {RMMZ.Window} window */
    addWindow(window) {
        if (window._isWindow) {
            const overlayIndex = this.children.findIndex(child => !child._isWindow);
            if (overlayIndex >= 0) {
                return this.addChildAt(window, overlayIndex);
            }
        }
        return this.addChild(window);
    }

    /**
     * Updates the window layer for each frame.
     *
     * @returns {void}
     */
    update() {
        for (const child of this.children) {
            if (child.update) {
                child.update();
            }
        }
    }

    /** @returns {void} */
    _updateWindowMasks() {
        const layout = this.children.filter(child => child._isWindow).map(window => ({
            window,
            bounds: window.visible && window.openness > 0 ? window.openBounds() : null
        }));
        const previous = this._windowLayout;
        if (layout.length === previous.length && layout.every(({ window, bounds }, i) => {
            const last = previous[i];
            return window === last.window &&
                bounds?.x === last.bounds?.x && bounds?.y === last.bounds?.y &&
                bounds?.width === last.bounds?.width && bounds?.height === last.bounds?.height;
        })) {
            return;
        }
        this._windowLayout = layout;
        const occluders = [];
        for (let i = layout.length - 1; i >= 0; i--) {
            const { window, bounds } = layout[i];
            const overlaps = bounds && occluders.filter(rect => rect.intersects(bounds));
            if (overlaps?.length) {
                this._applyWindowMask(window, bounds, overlaps);
            } else if (window._windowLayerMask && window.mask === window._windowLayerMask) {
                window._windowLayerMask.clear();
                window.mask = null;
            }
            if (bounds) occluders.push(bounds);
        }
    }

    /**
     * @param {RMMZ.Window} window
     * @param {import("pixi.js").Rectangle} bounds
     * @param {import("pixi.js").Rectangle[]} occluders
     */
    _applyWindowMask(window, bounds, occluders) {
        if (!window._windowLayerMask) {
            window._windowLayerMask = window.addChild(new PIXI.Graphics());
        }
        const mask = window._windowLayerMask.clear();
        // Keep lower windows out of transparent parts of higher windows.
        let regions = [bounds];
        for (const occluder of occluders) {
            regions = regions.flatMap(region => WindowLayer.subtractRect(region, occluder));
        }
        for (const rect of regions) {
            mask.rect(rect.x - window.x, rect.y - window.y, rect.width, rect.height).fill(0xffffff);
        }
        window.mask = mask;
    }

    /**
     * @param {import("pixi.js").Rectangle} rect
     * @param {import("pixi.js").Rectangle} occluder
     * @returns {import("pixi.js").Rectangle[]}
     */
    static subtractRect(rect, occluder) {
        if (!rect.intersects(occluder)) return [rect];
        const left = Math.max(occluder.left, rect.left);
        const right = Math.min(occluder.right, rect.right);
        const top = Math.max(occluder.top, rect.top);
        const bottom = Math.min(occluder.bottom, rect.bottom);
        return [
            new PIXI.Rectangle(rect.left, rect.top, rect.width, top - rect.top),
            new PIXI.Rectangle(rect.left, bottom, rect.width, rect.bottom - bottom),
            new PIXI.Rectangle(rect.left, top, left - rect.left, bottom - top),
            new PIXI.Rectangle(right, top, rect.right - right, bottom - top)
        ].filter(part => part.width > 0 && part.height > 0);
    }

}

/**
 * The weather effect which displays rain, storm, or snow.
 *
 * @class
 * @extends PIXI.Container
 */
class Weather extends PIXI.Container {
    constructor() {
        super();

        /** @type {number} */
        this._width = Graphics.width;
        /** @type {number} */
        this._height = Graphics.height;
        /** @type {Array<Sprite & { ax: number; ay: number; }>} */
        this._sprites = [];

        this._createBitmaps();
        this._createDimmer();

        /**
         * The type of the weather in ["none", "rain", "storm", "snow"].
         *
         * @type {string}
         */
        this.type = "none";

        /**
         * The power of the weather in the range (0, 9).
         *
         * @type {number}
         */
        this.power = 0;

        /**
         * The origin point of the weather for scrolling.
         *
         * @type {import("pixi.js").Point}
         */
        this.origin = new PIXI.Point();
    }

    /**
     * Destroys the weather.
     *
     * @returns {void}
     */
    destroy() {
        const options = { children: true, texture: true };
        super.destroy(options);
        this._rainBitmap.destroy();
        this._stormBitmap.destroy();
        this._snowBitmap.destroy();
    }

    /**
     * Updates the weather for each frame.
     *
     * @returns {void}
     */
    update() {
        this._updateDimmer();
        this._updateAllSprites();
    }

    /** @returns {void} */
    _createBitmaps() {
        this._rainBitmap = new Bitmap(1, 60);
        this._rainBitmap.fillAll("white");
        this._stormBitmap = new Bitmap(2, 100);
        this._stormBitmap.fillAll("white");
        this._snowBitmap = new Bitmap(9, 9);
        this._snowBitmap.drawCircle(4, 4, 4, "white");
    }

    /** @returns {void} */
    _createDimmer() {
        this._dimmerSprite = new ScreenSprite();
        this._dimmerSprite.setColor(80, 80, 80);
        this.addChild(this._dimmerSprite);
    }

    /** @returns {void} */
    _updateDimmer() {
        this._dimmerSprite.opacity = Math.floor(this.power * 6);
    }

    /** @returns {void} */
    _updateAllSprites() {
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

    /** @returns {void} */
    _addSprite() {
        const sprite = new Sprite(this.viewport);
        sprite.opacity = 0;
        this._sprites.push(sprite);
        this.addChild(sprite);
    }

    /** @returns {void} */
    _removeSprite() {
        this.removeChild(this._sprites.pop());
    }

    /**
     * @param {Sprite & { ax: number; ay: number; }} sprite
     * @returns {void}
     */
    _updateSprite(sprite) {
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

    /**
     * @param {Sprite & { ax: number; ay: number; }} sprite
     * @returns {void}
     */
    _updateRainSprite(sprite) {
        sprite.bitmap = this._rainBitmap;
        sprite.rotation = Math.PI / 16;
        sprite.ax -= 6 * Math.sin(sprite.rotation);
        sprite.ay += 6 * Math.cos(sprite.rotation);
        sprite.opacity -= 6;
    }

    /**
     * @param {Sprite & { ax: number; ay: number; }} sprite
     * @returns {void}
     */
    _updateStormSprite(sprite) {
        sprite.bitmap = this._stormBitmap;
        sprite.rotation = Math.PI / 8;
        sprite.ax -= 8 * Math.sin(sprite.rotation);
        sprite.ay += 8 * Math.cos(sprite.rotation);
        sprite.opacity -= 8;
    }

    /**
     * @param {Sprite & { ax: number; ay: number; }} sprite
     * @returns {void}
     */
    _updateSnowSprite(sprite) {
        sprite.bitmap = this._snowBitmap;
        sprite.rotation = Math.PI / 16;
        sprite.ax -= 3 * Math.sin(sprite.rotation);
        sprite.ay += 3 * Math.cos(sprite.rotation);
        sprite.opacity -= 3;
    }

    /**
     * @param {Sprite & { ax: number; ay: number; }} sprite
     * @returns {void}
     */
    _rebornSprite(sprite) {
        sprite.ax = Math.randomInt(Graphics.width + 100) - 100 + this.origin.x;
        sprite.ay = Math.randomInt(Graphics.height + 200) - 200 + this.origin.y;
        sprite.opacity = 160 + Math.randomInt(60);
    }
}

/**
 * The color filter for WebGL.
 *
 * @class
 * @extends PIXI.Filter
 */
class ColorFilter extends PIXI.Filter {
    constructor() {
        super({
            glProgram: PIXI.GlProgram.from({
                vertex: PIXI.defaultFilterVert,
                fragment: ColorFilter._fragmentSrc()
            }),
            resources: {
                colorUniforms: {
                    hue: { value: 0, type: "f32" },
                    colorTone: { value: [0, 0, 0, 0], type: "vec4<f32>" },
                    blendColor: { value: [0, 0, 0, 0], type: "vec4<f32>" },
                    brightness: { value: 255, type: "f32" }
                }
            }
        });
        this.uniforms = this.resources.colorUniforms.uniforms;
    }

    /**
     * Sets the hue rotation value.
     *
     * @param {number} hue - The hue value (-360, 360).
     * @returns {void}
     */
    setHue(hue) {
        this.uniforms.hue = Number(hue);
    }

    /**
     * Sets the color tone.
     *
     * @param {RMMZ.Color} tone - The color tone [r, g, b, gray].
     * @returns {void}
     */
    setColorTone(tone) {
        if (!(tone instanceof Array)) {
            throw new Error("Argument must be an array");
        }
        this.uniforms.colorTone = tone.clone();
    }

    /**
     * Sets the blend color.
     *
     * @param {RMMZ.Color} color - The blend color [r, g, b, a].
     * @returns {void}
     */
    setBlendColor(color) {
        if (!(color instanceof Array)) {
            throw new Error("Argument must be an array");
        }
        this.uniforms.blendColor = color.clone();
    }

    /**
     * Sets the brightness.
     *
     * @param {number} brightness - The brightness (0 to 255).
     * @returns {void}
     */
    setBrightness(brightness) {
        this.uniforms.brightness = Number(brightness);
    }

    /** @returns {string} */
    static _fragmentSrc() {
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
 *
 * @class
 * @extends PIXI.Container
 */
class Stage extends PIXI.Container {
    /** @param {[]} args */
    constructor(...args) {
        super();
        this.initialize(...args);
    }

    // Scene_Base delegates to this hook during initialization.
    initialize() {}

    /**
     * Destroys the stage.
     *
     * @returns {void}
     */
    destroy() {
        const options = { children: true, texture: true };
        super.destroy(options);
    }
}

/**
 * The audio object of Web Audio API.
 *
 * @class
 * @param {string} url - The url of the audio file.
 */
class WebAudio {
    /** @param {[url: string]} args */
    constructor(...args) {
        this.initialize(...args);
    }

    /** @param {string} url */
    initialize(url) {
        this.clear();
        /** @type {string} */
        this._url = url;
        this._startLoading();
    }

    /**
     * Initializes the audio system.
     *
     * @returns {boolean} True if the audio system is available.
     */
    static initialize() {
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
     *
     * @param {number} value - The master volume (0 to 1).
     * @returns {void}
     */
    static setMasterVolume(value) {
        this._masterVolume = value;
        this._resetVolume();
    }

    /** @returns {void} */
    static _createContext() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this._context = new AudioContext();
        } catch (e) {
            this._context = null;
        }
    }

    /** @returns {number} */
    static _currentTime() {
        return this._context ? this._context.currentTime : 0;
    }

    /** @returns {void} */
    static _createMasterGainNode() {
        const context = this._context;
        if (context) {
            this._masterGainNode = context.createGain();
            this._resetVolume();
            this._masterGainNode.connect(context.destination);
        }
    }

    /** @returns {void} */
    static _setupEventHandlers() {
        const onUserGesture = this._onUserGesture.bind(this);
        const onVisibilityChange = this._onVisibilityChange.bind(this);
        document.addEventListener("keydown", onUserGesture);
        document.addEventListener("mousedown", onUserGesture);
        document.addEventListener("touchend", onUserGesture);
        document.addEventListener("visibilitychange", onVisibilityChange);
    }

    /** @returns {void} */
    static _onUserGesture() {
        const context = this._context;
        if (context && context.state === "suspended") {
            context.resume();
        }
    }

    /** @returns {void} */
    static _onVisibilityChange() {
        if (document.visibilityState === "hidden") {
            this._onHide();
        } else {
            this._onShow();
        }
    }

    /** @returns {void} */
    static _onHide() {
        if (this._shouldMuteOnHide()) {
            this._fadeOut(1);
        }
    }

    /** @returns {void} */
    static _onShow() {
        if (this._shouldMuteOnHide()) {
            this._fadeIn(1);
        }
    }

    /** @returns {boolean} */
    static _shouldMuteOnHide() {
        return Utils.isMobileDevice() && !window.navigator.standalone;
    }

    /** @returns {void} */
    static _resetVolume() {
        if (this._masterGainNode) {
            const gain = this._masterGainNode.gain;
            const volume = this._masterVolume;
            const currentTime = this._currentTime();
            gain.setValueAtTime(volume, currentTime);
        }
    }

    /**
     * @param {number} duration
     * @returns {void}
     */
    static _fadeIn(duration) {
        if (this._masterGainNode) {
            const gain = this._masterGainNode.gain;
            const volume = this._masterVolume;
            const currentTime = this._currentTime();
            gain.setValueAtTime(0, currentTime);
            gain.linearRampToValueAtTime(volume, currentTime + duration);
        }
    }

    /**
     * @param {number} duration
     * @returns {void}
     */
    static _fadeOut(duration) {
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
     *
     * @returns {void}
     */
    clear() {
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
        this._loop = 0;
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
     *
     * @name WebAudio#url
     * @type {string}
     */
    get url() {
        return this._url;
    }

    /**
     * The volume of the audio.
     *
     * @name WebAudio#volume
     * @type {number}
     */
    get volume() {
        return this._volume;
    }
    /** @param {number} value */
    set volume(value) {
        this._volume = value;
        if (this._gainNode) {
            this._gainNode.gain.setValueAtTime(
                this._volume,
                WebAudio._currentTime()
            );
        }
    }

    /**
     * The pitch of the audio.
     *
     * @name WebAudio#pitch
     * @type {number}
     */
    get pitch() {
        return this._pitch;
    }
    /** @param {number} value */
    set pitch(value) {
        if (this._pitch !== value) {
            this._pitch = value;
            if (this.isPlaying()) {
                this.play(this._loop, 0);
            }
        }
    }

    /**
     * The pan of the audio.
     *
     * @name WebAudio#pan
     * @type {number}
     */
    get pan() {
        return this._pan;
    }
    /** @param {number} value */
    set pan(value) {
        this._pan = value;
        this._updatePanner();
    }

    /**
     * Checks whether the audio data is ready to play.
     *
     * @returns {boolean} True if the audio data is ready to play.
     */
    isReady() {
        return this._buffers && this._buffers.length > 0;
    }

    /**
     * Checks whether a loading error has occurred.
     *
     * @returns {boolean} True if a loading error has occurred.
     */
    isError() {
        return this._isError;
    }

    /**
     * Checks whether the audio is playing.
     *
     * @returns {boolean} True if the audio is playing.
     */
    isPlaying() {
        return this._isPlaying;
    }

    /**
     * Plays the audio.
     *
     * @param {boolean} loop - Whether the audio data play in a loop.
     * @param {number} [offset] - The start position to play in seconds.
     * @returns {void}
     */
    play(loop, offset) {
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
     *
     * @returns {void}
     */
    stop() {
        this._isPlaying = false;
        this._removeEndTimer();
        this._removeNodes();
        this._loadListeners = [];
        if (this._stopListeners) {
            while (this._stopListeners.length > 0) {
                const listner = this._stopListeners.shift();
                listner();
            }
        }
    }

    /**
     * Destroys the audio.
     *
     * @returns {void}
     */
    destroy() {
        this._destroyDecoder();
        this.clear();
    }

    /**
     * Performs the audio fade-in.
     *
     * @param {number} duration - Fade-in time in seconds.
     * @returns {void}
     */
    fadeIn(duration) {
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
     *
     * @param {number} duration - Fade-out time in seconds.
     * @returns {void}
     */
    fadeOut(duration) {
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
     *
     * @returns {number}
     */
    seek() {
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
     *
     * @param {() => void} listner - The callback function.
     * @returns {void}
     */
    addLoadListener(listner) {
        this._loadListeners.push(listner);
    }

    /**
     * Adds a callback function that will be called when the playback is stopped.
     *
     * @param {() => void} listner - The callback function.
     * @returns {void}
     */
    addStopListener(listner) {
        this._stopListeners.push(listner);
    }

    /**
     * Tries to load the audio again.
     *
     * @returns {void}
     */
    retry() {
        this._startLoading();
        if (this._isPlaying) {
            this.play(this._loop, 0);
        }
    }

    /** @returns {void} */
    _startLoading() {
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

    /** @returns {boolean} */
    _shouldUseDecoder() {
        return !Utils.canPlayOgg() && typeof VorbisDecoder === "function";
    }

    /** @returns {void} */
    _createDecoder() {
        this._decoder = new VorbisDecoder(
            WebAudio._context,
            this._onDecode.bind(this),
            this._onError.bind(this)
        );
    }

    /** @returns {void} */
    _destroyDecoder() {
        if (this._decoder) {
            this._decoder.destroy();
            this._decoder = null;
        }
    }

    /** @returns {string} */
    _realUrl() {
        return this._url + (Utils.hasEncryptedAudio() ? "_" : "");
    }

    /**
     * @param {string} url
     * @returns {void}
     */
    _startXhrLoading(url) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "arraybuffer";
        xhr.onload = () => this._onXhrLoad(xhr);
        xhr.onerror = this._onError.bind(this);
        xhr.send();
    }

    /**
     * @param {string} url
     * @returns {void}
     */
    _startFetching(url) {
        const options = { credentials: "same-origin" };
        fetch(url, options)
            .then(response => this._onFetch(response))
            .catch(() => this._onError());
    }

    /**
     * @param {XMLHttpRequest} xhr
     * @returns {void}
     */
    _onXhrLoad(xhr) {
        if (xhr.status < 400) {
            this._data = new Uint8Array(xhr.response);
            this._isLoaded = true;
            this._updateBuffer();
        } else {
            this._onError();
        }
    }

    /**
     * @param {Response} response
     * @returns {void}
     */
    _onFetch(response) {
        if (response.ok) {
            const reader = response.body.getReader();
            const readChunk = ({ done, value }) => {
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

    /** @returns {void} */
    _onError() {
        if (this._sourceNodes.length > 0) {
            this._stopSourceNode();
        }
        this._data = null;
        this._isError = true;
    }

    /**
     * @param {Uint8Array} value
     * @returns {void}
     */
    _onFetchProcess(value) {
        this._fetchedSize += value.length;
        this._fetchedData.push(value);
        this._updateBufferOnFetch();
    }

    /** @returns {void} */
    _updateBufferOnFetch() {
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

    /** @returns {void} */
    _concatenateFetchedData() {
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

    /** @returns {void} */
    _updateBuffer() {
        const arrayBuffer = this._readableBuffer();
        this._readLoopComments(arrayBuffer);
        this._decodeAudioData(arrayBuffer);
    }

    /** @returns {ArrayBufferLike} */
    _readableBuffer() {
        if (Utils.hasEncryptedAudio()) {
            return Utils.decryptArrayBuffer(this._data.buffer);
        } else {
            return this._data.buffer;
        }
    }

    /**
     * @param {ArrayBuffer} arrayBuffer
     * @returns {void}
     */
    _decodeAudioData(arrayBuffer) {
        if (this._shouldUseDecoder()) {
            if (this._decoder) {
                this._decoder.send(arrayBuffer, this._isLoaded);
            }
        } else {
            // [Note] Make a temporary copy of arrayBuffer because
            //   decodeAudioData() detaches it.
            WebAudio._context
                .decodeAudioData(arrayBuffer.slice())
                .then(buffer => this._onDecode(buffer))
                .catch(() => this._onError());
        }
    }

    /**
     * @param {AudioBuffer} buffer
     * @returns {void}
     */
    _onDecode(buffer) {
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

    /** @returns {void} */
    _refreshSourceNode() {
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

    /**
     * @param {number} offset
     * @returns {void}
     */
    _startPlaying(offset) {
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

    /** @returns {void} */
    _startAllSourceNodes() {
        for (let i = 0; i < this._sourceNodes.length; i++) {
            this._startSourceNode(i);
        }
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    _startSourceNode(index) {
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
        const chunkEnd = chunkStart + sourceNode.buffer.duration;
        let when = 0;
        let offset = 0;
        let duration = sourceNode.buffer.duration;
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
            if (when >= currentTime && offset < sourceNode.buffer.duration) {
                sourceNode.start(when, offset);
            }
        }
        chunkStart += sourceNode.buffer.duration;
    }

    /** @returns {void} */
    _stopSourceNode() {
        for (const sourceNode of this._sourceNodes) {
            try {
                sourceNode.onended = null;
                sourceNode.stop();
            } catch (e) {
                // Ignore InvalidStateError
            }
        }
    }

    /** @returns {void} */
    _createPannerNode() {
        this._pannerNode = WebAudio._context.createPanner();
        this._pannerNode.panningModel = "equalpower";
        this._pannerNode.connect(WebAudio._masterGainNode);
        this._updatePanner();
    }

    /** @returns {void} */
    _createGainNode() {
        const currentTime = WebAudio._currentTime();
        this._gainNode = WebAudio._context.createGain();
        this._gainNode.gain.setValueAtTime(this._volume, currentTime);
        this._gainNode.connect(this._pannerNode);
    }

    /** @returns {void} */
    _createAllSourceNodes() {
        for (let i = 0; i < this._buffers.length; i++) {
            this._createSourceNode(i);
        }
    }

    /**
     * @param {number} index
     * @returns {void}
     */
    _createSourceNode(index) {
        const sourceNode = WebAudio._context.createBufferSource();
        const currentTime = WebAudio._currentTime();
        sourceNode.buffer = this._buffers[index];
        sourceNode.loop = this._loop && this._isLoaded;
        sourceNode.loopStart = this._loopStartTime;
        sourceNode.loopEnd = this._loopStartTime + this._loopLengthTime;
        sourceNode.playbackRate.setValueAtTime(this._pitch, currentTime);
        sourceNode.connect(this._gainNode);
        this._sourceNodes[index] = sourceNode;
    }

    /** @returns {void} */
    _removeNodes() {
        if (this._sourceNodes && this._sourceNodes.length > 0) {
            this._stopSourceNode();
            this._sourceNodes = [];
            this._gainNode = null;
            this._pannerNode = null;
        }
    }

    /** @returns {void} */
    _createEndTimer() {
        if (this._sourceNodes.length > 0 && !this._loop) {
            const endTime = this._startTime + this._totalTime / this._pitch;
            const delay = endTime - WebAudio._currentTime();
            this._endTimer = setTimeout(this.stop.bind(this), delay * 1000);
        }
    }

    /** @returns {void} */
    _removeEndTimer() {
        if (this._endTimer) {
            clearTimeout(this._endTimer);
            this._endTimer = null;
        }
    }

    /** @returns {void} */
    _updatePanner() {
        if (this._pannerNode) {
            const x = this._pan;
            const z = 1 - Math.abs(x);
            this._pannerNode.setPosition(x, 0, z);
        }
    }

    /** @returns {void} */
    _onLoad() {
        while (this._loadListeners.length > 0) {
            const listner = this._loadListeners.shift();
            listner();
        }
    }

    /**
     * @param {ArrayBuffer} arrayBuffer
     * @returns {void}
     */
    _readLoopComments(arrayBuffer) {
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
                    packetSize += segments.shift();
                }
                if (segments.length > 0) {
                    packetSize += segments.shift();
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

    /**
     * @param {DataView} view
     * @param {number} index
     * @param {number} size
     * @returns {void}
     */
    _readMetaData(view, index, size) {
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

    /**
     * @param {DataView} view
     * @param {number} index
     * @returns {string}
     */
    _readFourCharacters(view, index) {
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
 *
 * @namespace
 */
class Video {
    constructor() {
        throw new Error("This is a static class");
    }

    /**
     * Initializes the video system.
     *
     * @param {number} width - The width of the video.
     * @param {number} height - The height of the video.
     * @returns {void}
     */
    static initialize(width, height) {
        this._element = null;
        this._loading = false;
        this._volume = 1;
        this._createElement();
        this._setupEventHandlers();
        this.resize(width, height);
    }

    /**
     * Changes the display size of the video.
     *
     * @param {number} width - The width of the video.
     * @param {number} height - The height of the video.
     * @returns {void}
     */
    static resize(width, height) {
        if (this._element) {
            this._element.style.width = width + "px";
            this._element.style.height = height + "px";
        }
    }

    /**
     * Starts playback of a video.
     *
     * @param {string} src - The url of the video.
     * @returns {void}
     */
    static play(src) {
        this._element.src = src;
        this._element.onloadeddata = this._onLoad.bind(this);
        this._element.onerror = this._onError.bind(this);
        this._element.onended = this._onEnd.bind(this);
        this._element.load();
        this._loading = true;
    }

    /**
     * Checks whether the video is playing.
     *
     * @returns {boolean} True if the video is playing.
     */
    static isPlaying() {
        return this._loading || this._isVisible();
    }

    /**
     * Sets the volume for videos.
     *
     * @param {number} volume - The volume for videos (0 to 1).
     * @returns {void}
     */
    static setVolume(volume) {
        this._volume = volume;
        if (this._element) {
            this._element.volume = this._volume;
        }
    }

    /** @returns {void} */
    static _createElement() {
        this._element = document.createElement("video");
        this._element.id = "gameVideo";
        this._element.style.position = "absolute";
        this._element.style.margin = "auto";
        this._element.style.top = 0;
        this._element.style.left = 0;
        this._element.style.right = 0;
        this._element.style.bottom = 0;
        this._element.style.opacity = 0;
        this._element.style.zIndex = 2;
        this._element.setAttribute("playsinline", "");
        this._element.oncontextmenu = () => false;
        document.body.appendChild(this._element);
    }

    /** @returns {void} */
    static _onLoad() {
        this._element.volume = this._volume;
        this._element.play();
        this._updateVisibility(true);
        this._loading = false;
    }

    /** @returns {void} */
    static _onError() {
        this._updateVisibility(false);
        const retry = () => {
            this._element.load();
        };
        throw ["LoadError", this._element.src, retry];
    }

    /** @returns {void} */
    static _onEnd() {
        this._updateVisibility(false);
    }

    /**
     * @param {boolean} videoVisible
     * @returns {void}
     */
    static _updateVisibility(videoVisible) {
        if (videoVisible) {
            Graphics.hideScreen();
        } else {
            Graphics.showScreen();
        }
        this._element.style.opacity = videoVisible ? 1 : 0;
    }

    /** @returns {boolean} */
    static _isVisible() {
        return this._element.style.opacity > 0;
    }

    /** @returns {void} */
    static _setupEventHandlers() {
        const onUserGesture = this._onUserGesture.bind(this);
        document.addEventListener("keydown", onUserGesture);
        document.addEventListener("mousedown", onUserGesture);
        document.addEventListener("touchend", onUserGesture);
    }

    /** @returns {void} */
    static _onUserGesture() {
        if (!this._element.src && this._element.paused) {
            this._element.play().catch(() => 0);
        }
    }
}

/**
 * The static class that handles input data from the keyboard and gamepads.
 *
 * @namespace
 */
class Input {
    constructor() {
        throw new Error("This is a static class");
    }

    /**
     * Initializes the input system.
     *
     * @returns {void}
     */
    static initialize() {
        this.clear();
        this._setupEventHandlers();
    }

    /**
     * The wait time of the key repeat in frames.
     *
     * @type {number}
     */
    static keyRepeatWait = 24;

    /**
     * The interval of the key repeat in frames.
     *
     * @type {number}
     */
    static keyRepeatInterval = 6;

    /**
     * A hash table to convert from a virtual key code to a mapped key name.
     *
     * @type {{ readonly 9: "tab"; readonly 13: "ok"; readonly 16: "shift"; readonly 17: "control"; readonly 18: "control"; readonly 27: "escape"; readonly 32: "ok"; readonly 33: "pageup"; readonly 34: "pagedown"; readonly 37: "left"; readonly 38: "up"; readonly 39: "right"; readonly 40: "down"; readonly 45: "escape"; readonly 81: "pageup"; readonly 87: "pagedown"; readonly 88: "escape"; readonly 90: "ok"; readonly 96: "escape"; readonly 98: "down"; readonly 100: "left"; readonly 102: "right"; readonly 104: "up"; readonly 120: "debug"; }}
     */
    static keyMapper = {
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
        120: "debug" // F9
    };

    /**
     * A hash table to convert from a gamepad button to a mapped key name.
     *
     * @type {{ readonly 0: "ok"; readonly 1: "cancel"; readonly 2: "shift"; readonly 3: "menu"; readonly 4: "pageup"; readonly 5: "pagedown"; readonly 12: "up"; readonly 13: "down"; readonly 14: "left"; readonly 15: "right"; }}
     */
    static gamepadMapper = {
        0: "ok", // A
        1: "cancel", // B
        2: "shift", // X
        3: "menu", // Y
        4: "pageup", // LB
        5: "pagedown", // RB
        12: "up", // D-pad up
        13: "down", // D-pad down
        14: "left", // D-pad left
        15: "right" // D-pad right
    };

    /**
     * Clears all the input data.
     *
     * @returns {void}
     */
    static clear() {
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
     *
     * @returns {void}
     */
    static update() {
        this._pollGamepads();
        if (this._currentState[this._latestButton]) {
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
     *
     * @param {string} keyName - The mapped name of the key.
     * @returns {boolean} True if the key is pressed.
     */
    static isPressed(keyName) {
        if (this._isEscapeCompatible(keyName) && this.isPressed("escape")) {
            return true;
        } else {
            return !!this._currentState[keyName];
        }
    }

    /**
     * Checks whether a key is just pressed.
     *
     * @param {string} keyName - The mapped name of the key.
     * @returns {boolean} True if the key is triggered.
     */
    static isTriggered(keyName) {
        if (this._isEscapeCompatible(keyName) && this.isTriggered("escape")) {
            return true;
        } else {
            return this._latestButton === keyName && this._pressedTime === 0;
        }
    }

    /**
     * Checks whether a key is just pressed or a key repeat occurred.
     *
     * @param {string} keyName - The mapped name of the key.
     * @returns {boolean} True if the key is repeated.
     */
    static isRepeated(keyName) {
        if (this._isEscapeCompatible(keyName) && this.isRepeated("escape")) {
            return true;
        } else {
            return (
                this._latestButton === keyName &&
                (this._pressedTime === 0 ||
                    (this._pressedTime >= this.keyRepeatWait &&
                        this._pressedTime % this.keyRepeatInterval === 0))
            );
        }
    }

    /**
     * Checks whether a key is kept depressed.
     *
     * @param {string} keyName - The mapped name of the key.
     * @returns {boolean} True if the key is long-pressed.
     */
    static isLongPressed(keyName) {
        if (this._isEscapeCompatible(keyName) && this.isLongPressed("escape")) {
            return true;
        } else {
            return (
                this._latestButton === keyName &&
                this._pressedTime >= this.keyRepeatWait
            );
        }
    }

    /**
     * The four direction value as a number of the numpad, or 0 for neutral.
     *
     * @name Input.dir4
     * @type {RMMZ.Direction}
     */
    static get dir4() {
        return this._dir4;
    }

    /**
     * The eight direction value as a number of the numpad, or 0 for neutral.
     *
     * @name Input.dir8
     * @type {RMMZ.Direction}
     */
    static get dir8() {
        return this._dir8;
    }

    /**
     * The time of the last input in milliseconds.
     *
     * @type {number}
     * @name Input.date
     */
    static get date() {
        return this._date;
    }

    /**
     * @param {string} buttonName
     * @returns {void}
     */
    static virtualClick(buttonName) {
        this._virtualButton = buttonName;
    }

    /** @returns {void} */
    static _setupEventHandlers() {
        document.addEventListener("keydown", this._onKeyDown.bind(this));
        document.addEventListener("keyup", this._onKeyUp.bind(this));
        window.addEventListener("blur", this._onLostFocus.bind(this));
    }

    /**
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    static _onKeyDown(event) {
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

    /**
     * @param {number} keyCode
     * @returns {boolean}
     */
    static _shouldPreventDefault(keyCode) {
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

    /**
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    static _onKeyUp(event) {
        const buttonName = this.keyMapper[event.keyCode];
        if (buttonName) {
            this._currentState[buttonName] = false;
        }
    }

    /** @returns {void} */
    static _onLostFocus() {
        this.clear();
    }

    /** @returns {void} */
    static _pollGamepads() {
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

    /**
     * @param {Gamepad} gamepad
     * @returns {void}
     */
    static _updateGamepadState(gamepad) {
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

    /** @returns {void} */
    static _updateDirection() {
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

    /** @returns {number} */
    static _signX() {
        const left = this.isPressed("left") ? 1 : 0;
        const right = this.isPressed("right") ? 1 : 0;
        return right - left;
    }

    /** @returns {number} */
    static _signY() {
        const up = this.isPressed("up") ? 1 : 0;
        const down = this.isPressed("down") ? 1 : 0;
        return down - up;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    static _makeNumpadDirection(x, y) {
        if (x === 0 && y === 0) {
            return 0;
        } else {
            return 5 - y * 3 + x;
        }
    }

    /**
     * @param {string} keyName
     * @returns {boolean}
     */
    static _isEscapeCompatible(keyName) {
        return keyName === "cancel" || keyName === "menu";
    }
}

/**
 * The static class that handles input data from the mouse and touchscreen.
 *
 * @namespace
 */
class TouchInput {
    constructor() {
        throw new Error("This is a static class");
    }

    /**
     * Initializes the touch system.
     *
     * @returns {void}
     */
    static initialize() {
        this.clear();
        this._setupEventHandlers();
    }

    /**
     * The wait time of the pseudo key repeat in frames.
     *
     * @type {number}
     */
    static keyRepeatWait = 24;

    /**
     * The interval of the pseudo key repeat in frames.
     *
     * @type {number}
     */
    static keyRepeatInterval = 6;

    /**
     * The threshold number of pixels to treat as moved.
     *
     * @type {number}
     */
    static moveThreshold = 10;

    /**
     * Clears all the touch data.
     *
     * @returns {void}
     */
    static clear() {
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
     *
     * @returns {void}
     */
    static update() {
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
     *
     * @returns {boolean} True if the mouse button or touchscreen is clicked.
     */
    static isClicked() {
        return this._clicked;
    }

    /**
     * Checks whether the mouse button or touchscreen is currently pressed down.
     *
     * @returns {boolean} True if the mouse button or touchscreen is pressed.
     */
    static isPressed() {
        return this._mousePressed || this._screenPressed;
    }

    /**
     * Checks whether the left mouse button or touchscreen is just pressed.
     *
     * @returns {boolean} True if the mouse button or touchscreen is triggered.
     */
    static isTriggered() {
        return this._currentState.triggered;
    }

    /**
     * Checks whether the left mouse button or touchscreen is just pressed
     * or a pseudo key repeat occurred.
     *
     * @returns {boolean} True if the mouse button or touchscreen is repeated.
     */
    static isRepeated() {
        return (
            this.isPressed() &&
            (this._currentState.triggered ||
                (this._pressedTime >= this.keyRepeatWait &&
                    this._pressedTime % this.keyRepeatInterval === 0))
        );
    }

    /**
     * Checks whether the left mouse button or touchscreen is kept depressed.
     *
     * @returns {boolean} True if the left mouse button or touchscreen is long-pressed.
     */
    static isLongPressed() {
        return this.isPressed() && this._pressedTime >= this.keyRepeatWait;
    }

    /**
     * Checks whether the right mouse button is just pressed.
     *
     * @returns {boolean} True if the right mouse button is just pressed.
     */
    static isCancelled() {
        return this._currentState.cancelled;
    }

    /**
     * Checks whether the mouse or a finger on the touchscreen is moved.
     *
     * @returns {boolean} True if the mouse or a finger on the touchscreen is moved.
     */
    static isMoved() {
        return this._currentState.moved;
    }

    /**
     * Checks whether the mouse is moved without pressing a button.
     *
     * @returns {boolean} True if the mouse is hovered.
     */
    static isHovered() {
        return this._currentState.hovered;
    }

    /**
     * Checks whether the left mouse button or touchscreen is released.
     *
     * @returns {boolean} True if the mouse button or touchscreen is released.
     */
    static isReleased() {
        return this._currentState.released;
    }

    /**
     * The horizontal scroll amount.
     *
     * @name TouchInput.wheelX
     * @type {number}
     */
    static get wheelX() {
        return this._currentState.wheelX;
    }

    /**
     * The vertical scroll amount.
     *
     * @name TouchInput.wheelY
     * @type {number}
     */
    static get wheelY() {
        return this._currentState.wheelY;
    }

    /**
     * The x coordinate on the canvas area of the latest touch event.
     *
     * @name TouchInput.x
     * @type {number}
     */
    static get x() {
        return this._x;
    }

    /**
     * The y coordinate on the canvas area of the latest touch event.
     *
     * @name TouchInput.y
     * @type {number}
     */
    static get y() {
        return this._y;
    }

    /**
     * The time of the last input in milliseconds.
     *
     * @name TouchInput.date
     * @type {number}
     */
    static get date() {
        return this._date;
    }

    /** @returns {{ triggered: boolean; cancelled: boolean; moved: boolean; hovered: boolean; released: boolean; wheelX: number; wheelY: number; }} */
    static _createNewState() {
        return {
            triggered: false,
            cancelled: false,
            moved: false,
            hovered: false,
            released: false,
            wheelX: 0,
            wheelY: 0
        };
    }

    /** @returns {void} */
    static _setupEventHandlers() {
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

    /**
     * @param {MouseEvent} event
     * @returns {void}
     */
    static _onMouseDown(event) {
        if (event.button === 0) {
            this._onLeftButtonDown(event);
        } else if (event.button === 1) {
            this._onMiddleButtonDown(event);
        } else if (event.button === 2) {
            this._onRightButtonDown(event);
        }
    }

    /**
     * @param {MouseEvent} event
     * @returns {void}
     */
    static _onLeftButtonDown(event) {
        const x = Graphics.pageToCanvasX(event.pageX);
        const y = Graphics.pageToCanvasY(event.pageY);
        if (Graphics.isInsideCanvas(x, y)) {
            this._mousePressed = true;
            this._pressedTime = 0;
            this._onTrigger(x, y);
        }
    }

    /** @returns {void} */
    static _onMiddleButtonDown(/*event*/) {
        //
    }

    /**
     * @param {MouseEvent} event
     * @returns {void}
     */
    static _onRightButtonDown(event) {
        const x = Graphics.pageToCanvasX(event.pageX);
        const y = Graphics.pageToCanvasY(event.pageY);
        if (Graphics.isInsideCanvas(x, y)) {
            this._onCancel(x, y);
        }
    }

    /**
     * @param {MouseEvent} event
     * @returns {void}
     */
    static _onMouseMove(event) {
        const x = Graphics.pageToCanvasX(event.pageX);
        const y = Graphics.pageToCanvasY(event.pageY);
        if (this._mousePressed) {
            this._onMove(x, y);
        } else if (Graphics.isInsideCanvas(x, y)) {
            this._onHover(x, y);
        }
    }

    /**
     * @param {MouseEvent} event
     * @returns {void}
     */
    static _onMouseUp(event) {
        if (event.button === 0) {
            const x = Graphics.pageToCanvasX(event.pageX);
            const y = Graphics.pageToCanvasY(event.pageY);
            this._mousePressed = false;
            this._onRelease(x, y);
        }
    }

    /**
     * @param {WheelEvent} event
     * @returns {void}
     */
    static _onWheel(event) {
        this._newState.wheelX += event.deltaX;
        this._newState.wheelY += event.deltaY;
        event.preventDefault();
    }

    /**
     * @param {TouchEvent} event
     * @returns {void}
     */
    static _onTouchStart(event) {
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

    /**
     * @param {TouchEvent} event
     * @returns {void}
     */
    static _onTouchMove(event) {
        for (const touch of event.changedTouches) {
            const x = Graphics.pageToCanvasX(touch.pageX);
            const y = Graphics.pageToCanvasY(touch.pageY);
            this._onMove(x, y);
        }
    }

    /**
     * @param {TouchEvent} event
     * @returns {void}
     */
    static _onTouchEnd(event) {
        for (const touch of event.changedTouches) {
            const x = Graphics.pageToCanvasX(touch.pageX);
            const y = Graphics.pageToCanvasY(touch.pageY);
            this._screenPressed = false;
            this._onRelease(x, y);
        }
    }

    /** @returns {void} */
    static _onTouchCancel(/*event*/) {
        this._screenPressed = false;
    }

    /** @returns {void} */
    static _onLostFocus() {
        this.clear();
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    static _onTrigger(x, y) {
        this._newState.triggered = true;
        this._x = x;
        this._y = y;
        this._triggerX = x;
        this._triggerY = y;
        this._moved = false;
        this._date = Date.now();
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    static _onCancel(x, y) {
        this._newState.cancelled = true;
        this._x = x;
        this._y = y;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    static _onMove(x, y) {
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

    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    static _onHover(x, y) {
        this._newState.hovered = true;
        this._x = x;
        this._y = y;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {void}
     */
    static _onRelease(x, y) {
        this._newState.released = true;
        this._x = x;
        this._y = y;
    }
}

/**
 * The static class that handles JSON with object information.
 *
 * @namespace
 */
class JsonEx {
    constructor() {
        throw new Error("This is a static class");
    }

    /**
     * The maximum depth of objects.
     *
     * @default 100
     * @type {number}
     */
    static maxDepth = 100;

    /**
     * Converts an object to a JSON string with object information.
     *
     * @param {any} object - The object to be converted.
     * @returns {string} The JSON string.
     */
    static stringify(object) {
        return JSON.stringify(this._encode(object, 0));
    }

    /**
     * Parses a JSON string and reconstructs the corresponding object.
     *
     * @param {string} json - The JSON string.
     * @returns {any} The reconstructed object.
     */
    static parse(json) {
        return this._decode(JSON.parse(json));
    }

    /**
     * Makes a deep copy of the specified object.
     *
     * @param {any} object - The object to be copied.
     * @returns {any} The copied object.
     */
    static makeDeepCopy(object) {
        return this.parse(this.stringify(object));
    }

    /**
     * Encodes constructor names for serialization. Circular references
     * are unsupported because handling them in MV was too complicated
     * and expensive.
     *
     * @param {any} value
     * @param {number} depth
     * @returns {any}
     */
    static _encode(value, depth) {
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

    /**
     * @param {any} value
     * @returns {any}
     */
    static _decode(value) {
        const type = Object.prototype.toString.call(value);
        if (type === "[object Object]" || type === "[object Array]") {
            if (value["@"]) {
                const constructor = window[value["@"]];
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

// Class declarations are lexical bindings, while plugins and JsonEx resolve
// constructors through the global object, so expose them as global properties.
Object.assign(globalThis, {
    Utils,
    Graphics,
    Point,
    Rectangle,
    Bitmap,
    Sprite,
    Tilemap,
    TilingSprite,
    ScreenSprite,
    Window,
    WindowLayer,
    Weather,
    ColorFilter,
    Stage,
    WebAudio,
    Video,
    Input,
    TouchInput,
    JsonEx,
});
