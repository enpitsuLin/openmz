// Auto-generated from JSDoc in src/js/main.js via `pnpm build:types`. Do not edit manually.

/** @type {string[]} */
declare const scriptUrls: string[];
/** @type {string} */
declare const effekseerWasmUrl: string;
declare class Main {
    /** @type {boolean} */
    xhrSucceeded: boolean;
    /** @type {number} */
    loadCount: number;
    /** @type {Error | null} */
    error: Error | null;
    /** @returns {void} */
    run(): void;
    /** @returns {void} */
    showLoadingSpinner(): void;
    /** @returns {void} */
    eraseLoadingSpinner(): void;
    /** @returns {void} */
    testXhr(): void;
    /**
     * Quits NW.js explicitly when its window closes, since the process
     * sometimes does not terminate properly on its own.
     *
     * @returns {void}
     */
    hookNwjsClose(): void;
    /** @returns {void} */
    loadMainScripts(): void;
    numScripts: number | undefined;
    /** @returns {void} */
    onScriptLoad(): void;
    /**
     * @param {Event} e
     * @returns {void}
     */
    onScriptError(e: Event): void;
    /**
     * @param {string} name
     * @param {string} message
     * @returns {void}
     */
    printError(name: string, message: string): void;
    /**
     * @param {string} name
     * @param {string} message
     * @returns {string}
     */
    makeErrorHtml(name: string, message: string): string;
    /** @returns {void} */
    onWindowLoad(): void;
    /**
     * @param {ErrorEvent} event
     * @returns {void}
     */
    onWindowError(event: ErrorEvent): void;
    /**
     * Checks for Gatekeeper Path Randomization, which prevents the game
     * from saving properly.
     *
     * @returns {boolean}
     */
    isPathRandomized(): boolean;
    /** @returns {void} */
    initEffekseerRuntime(): void;
    /** @returns {void} */
    onEffekseerLoad(): void;
    /** @returns {void} */
    onEffekseerError(): void;
}
/** @type {Main} */
declare const main: Main;
