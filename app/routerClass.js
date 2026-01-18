// ---------------------------------------------------------------
// app/routerClass.js
// ---------------------------------------------------------------
// Lightweight client‑side router used by the SPA.
// ---------------------------------------------------------------

import { syncAppState } from './utils/theme.js';

export default class Router {
    /**
     * @param {Array<{path:string, handler:function}>} routes
     */
    constructor(routes = []) {
        /** @private */ this._routes = [];
        /** @private */ this._notFound = null;

        // ---------------------------------------------------------
        // 1️⃣ Pre‑compile all route patterns once.
        // ---------------------------------------------------------
        for (const r of routes) this._register(r.path, r.handler);

        // ---------------------------------------------------------
        // 2️⃣ Listen to back/forward navigation (only in browsers).
        // ---------------------------------------------------------
        if (typeof window !== "undefined") {
            window.addEventListener("popstate", () => this.resolve());
        }

        // ---------------------------------------------------------
        // 3️⃣ Debug – show the compiled routes when the router is built.
        // ---------------------------------------------------------
        console.log("[Router] Initialized with routes:", this._routes);
    }

    // -----------------------------------------------------------------
    // PUBLIC API
    // -----------------------------------------------------------------

    /**
     * Navigate to a new URL while **preserving** query string and hash.
     * @param {string} to          Destination (may include ?…#…)
     * @param {boolean} replace    If true, uses history.replaceState().
     */
    navigate(to, replace = false) {
        const base = window.location.origin;
        const url = new URL(to, base);

        // Normalise the pathname (remove trailing slashes, keep root as '/')
        const cleanPath = url.pathname.replace(/\/+$/g, "") || "/";
        const finalUrl = `${cleanPath}${url.search}${url.hash}`;

        if (replace) history.replaceState(null, "", finalUrl);
        else history.pushState(null, "", finalUrl);

        this.resolve();
    }

    /** Resolve the current location against the route table. */
    async resolve() {
        if (typeof window === "undefined" || typeof location === "undefined") return;

        // --- IMPROVED CLEANUP ---
        // 1. Try to click the physical UI stop button to trigger your original 505-line cleanup
        const stopBtn = document.querySelector('.stop-btn');
        if (stopBtn) stopBtn.click();

        // 2. Fallback: If the controller exists but the button wasn't found, try to call stop
        if (window.activeSpeechController && typeof window.activeSpeechController.stop === 'function') {
            window.activeSpeechController.stop();
        }

        // 3. Hard reset the browser audio queue
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        // -------------------------

        const { pathname, search, hash } = location;
        const cleanPath = pathname.replace(/\/+$/g, "") || "/";

        const match = this._match(cleanPath);

        if (match) {
            const { handler, params } = match;
            await handler({ ...params, search, hash });
        } else if (this._notFound) {
            this._notFound({ search, hash });
        } else {
            console.warn("[Router] No match and no not‑found handler.");
        }

        syncAppState();
    }



    /** Register a 404 / “not found” handler. */
    setNotFound(handler) {
        if (typeof handler !== "function")
            throw new TypeError("Router.setNotFound expects a function");
        this._notFound = handler;
    }

    // -----------------------------------------------------------------
    // PRIVATE HELPERS
    // -----------------------------------------------------------------

    _register(pattern, handler) {
        if (typeof pattern !== "string" || typeof handler !== "function")
            throw new TypeError("Router: each route needs a string pattern and a function handler");

        // ---- SAFETY CHECK -------------------------------------------------
        const stripped = pattern.replace(/:\w+\??/g, "");
        if (!/^[:\w/*?]+$/.test(stripped)) {
            throw new Error(`Router: unsafe characters in route pattern "${pattern}"`);
        }

        const { regex, paramNames } = this._compilePattern(pattern);
        this._routes.push({ regex, paramNames, handler });
    }

    _compilePattern(pattern) {
        // Special case for root "/"
        if (pattern === "/") {
            return { regex: /^\/$/, paramNames: [] };
        }

        // Remove leading slash, we'll add it back later
        let working = pattern.replace(/^\/+/, "");
        const paramNames = [];

        // Optional params → "(?:/([^/]+))?"
        working = working.replace(/:(\w+)\?/g, (_, name) => {
            paramNames.push(name);
            return "(?:/([^/]+))?";
        });

        // Required params → "([^/]+)"
        working = working.replace(/:(\w+)/g, (_, name) => {
            paramNames.push(name);
            return "([^/]+)";
        });

        // Wildcard *
        working = working.replace(/\*/g, ".*");

        const regex = new RegExp(`^/${working}$`);
        return { regex, paramNames };
    }

    _match(path) {
        for (const { regex, paramNames, handler } of this._routes) {
            const m = path.match(regex);
            if (!m) continue;

            const params = {};
            paramNames.forEach((name, i) => {
                const raw = m[i + 1];
                if (raw === undefined) {
                    params[name] = undefined;
                } else {
                    try {
                        params[name] = decodeURIComponent(raw);
                    } catch (e) {
                        console.warn(`Router: malformed encoding "${raw}"`);
                        params[name] = raw;
                    }
                }
            });
            return { handler, params };
        }
        return null;
    }
}