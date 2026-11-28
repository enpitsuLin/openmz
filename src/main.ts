// main.ts v2.0.0

type EngineScript = HTMLScriptElement & { _url: string };

const scriptUrls: string[] = [
    "js/libs/pixi.js",
    "js/libs/pako.min.js",
    "js/libs/localforage.min.js",
    "js/libs/effekseer.min.js",
    "js/libs/vorbisdecoder.js",
    "js/rmmz_core.js",
    "js/rmmz_managers.js",
    "js/rmmz_objects.js",
    "js/rmmz_scenes.js",
    "js/rmmz_sprites.js",
    "js/rmmz_windows.js",
    "js/plugins.js",
];

const effekseerWasmUrl: string = "js/libs/effekseer.wasm";

class Main {
    declare xhrSucceeded: boolean;
    declare loadCount: number;
    declare error: Error | null;
    declare numScripts: number;

    constructor() {
        this.xhrSucceeded = false;
        this.loadCount = 0;
        this.error = null;
    }

    run(): void {
        this.showLoadingSpinner();
        this.testXhr();
        this.hookNwjsClose();
        this.loadMainScripts();
    }

    showLoadingSpinner(): void {
        const loadingSpinner = document.createElement("div");
        const loadingSpinnerImage = document.createElement("div");
        loadingSpinner.id = "loadingSpinner";
        loadingSpinnerImage.id = "loadingSpinnerImage";
        loadingSpinner.appendChild(loadingSpinnerImage);
        document.body.appendChild(loadingSpinner);
    }

    eraseLoadingSpinner(): void {
        const loadingSpinner = document.getElementById("loadingSpinner");
        if (loadingSpinner) {
            document.body.removeChild(loadingSpinner);
        }
    }

    testXhr(): void {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", (document.currentScript as HTMLScriptElement).src);
        xhr.onload = () => (this.xhrSucceeded = true);
        xhr.send();
    }

    /**
     * Quits NW.js explicitly when its window closes, since the process
     * sometimes does not terminate properly on its own.
     */
    hookNwjsClose(): void {
        if (typeof nw === "object") {
            nw.Window.get().on("close", () => nw.App.quit());
        }
    }

    loadMainScripts(): void {
        for (const url of scriptUrls) {
            const script = document.createElement("script") as EngineScript;
            script.type = "text/javascript";
            script.src = url;
            script.async = false;
            script.defer = true;
            script.onload = this.onScriptLoad.bind(this);
            script.onerror = this.onScriptError.bind(this) as OnErrorEventHandler;
            script._url = url;
            document.body.appendChild(script);
        }
        this.numScripts = scriptUrls.length;
        window.addEventListener("load", this.onWindowLoad.bind(this));
        window.addEventListener("error", this.onWindowError.bind(this));
    }

    onScriptLoad(): void {
        if (++this.loadCount === this.numScripts) {
            PluginManager.setup($plugins);
        }
    }

    onScriptError(e: Event): void {
        this.printError("Failed to load", (e.target as EngineScript)._url);
    }

    printError(name: string, message: string): void {
        this.eraseLoadingSpinner();
        if (!document.getElementById("errorPrinter")) {
            const errorPrinter = document.createElement("div");
            errorPrinter.id = "errorPrinter";
            errorPrinter.innerHTML = this.makeErrorHtml(name, message);
            document.body.appendChild(errorPrinter);
        }
    }

    makeErrorHtml(name: string, message: string): string {
        const nameDiv = document.createElement("div");
        const messageDiv = document.createElement("div");
        nameDiv.id = "errorName";
        messageDiv.id = "errorMessage";
        nameDiv.innerHTML = name;
        messageDiv.innerHTML = message;
        return nameDiv.outerHTML + messageDiv.outerHTML;
    }

    onWindowLoad(): void {
        if (!this.xhrSucceeded) {
            const message = "Your browser does not allow to read local files.";
            this.printError("Error", message);
        } else if (this.isPathRandomized()) {
            const message = "Please move the Game.app to a different folder.";
            this.printError("Error", message);
        } else if (this.error) {
            this.printError(this.error.name, this.error.message);
        } else {
            this.initEffekseerRuntime();
        }
    }

    onWindowError(event: ErrorEvent): void {
        if (!this.error) {
            this.error = event.error;
        }
    }

    /**
     * Checks for Gatekeeper Path Randomization, which prevents the game
     * from saving properly.
     */
    isPathRandomized(): boolean {
        return typeof process === "object" && (process.mainModule as NodeModule).filename.startsWith("/private/var");
    }

    initEffekseerRuntime(): void {
        const onLoad = this.onEffekseerLoad.bind(this);
        const onError = this.onEffekseerError.bind(this);
        effekseer.initRuntime(effekseerWasmUrl, onLoad, onError);
    }

    onEffekseerLoad(): void {
        this.eraseLoadingSpinner();
        SceneManager.run(Scene_Boot);
    }

    onEffekseerError(): void {
        this.printError("Failed to load", effekseerWasmUrl);
    }
}

const main: Main = new Main();
main.run();
