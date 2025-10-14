// app/router.js
/**
 * Lightweight client‑side router.
 *
 * Supported pattern tokens:
 *   • required param   : /:lang
 *   • optional param   : /:lang?
 *   • wildcard (*)    : matches the rest of the path (including slashes)
 *
 * The router does NOT auto‑resolve on construction – the caller must
 * invoke `router.resolve()` after any async bootstrapping (e.g. loading
 * localisation files).  This makes it safe to use in SSR environments.
 */
export class Router {
    /**
     * @param {Array<{path:string, handler:function}>} routes
     */
    constructor(routes = []) {
        /** @private */ this._routes = [];
        /** @private */ this._notFound = null;   // set via setNotFound()

        // -----------------------------------------------------------------
        // 1️⃣ Pre‑compile all route patterns once.
        // -----------------------------------------------------------------
        for (const r of routes) this._register(r.path, r.handler);

        // -----------------------------------------------------------------
        // 2️⃣ Listen to back/forward navigation (only in browsers).
        // -----------------------------------------------------------------
        if (typeof window !== 'undefined') {
            window.addEventListener('popstate', () => this.resolve());
        }

        // -------------------------------------------------------------
        // DEBUG: show the compiled routes when the router is built.
        // -------------------------------------------------------------
        console.log('[Router] Initialized with routes:', this._routes);
    }

    // -----------------------------------------------------------------
    // PUBLIC API
    // -----------------------------------------------------------------

    /**
     * Navigate to a new URL while **preserving** query string and hash.
     * Uses the URL API so leading “?” / “#” are kept intact.
     *
     * @param {string} to          Destination (may include ?…#…)
     * @param {boolean} replace    If true, uses history.replaceState().
     */
    navigate(to, replace = false) {
        // The URL constructor works with relative URLs when we give it a base.
        const base = window.location.origin;
        const url = new URL(to, base);               // parses pathname, search, hash

        // Normalise the pathname (remove trailing slashes, keep root as '/')
        const cleanPath = url.pathname.replace(/\/+$/g, '') || '/';
        const finalUrl = `${cleanPath}${url.search}${url.hash}`;

        if (replace) history.replaceState(null, '', finalUrl);
        else history.pushState(null, '', finalUrl);

        this.resolve();
    }

    /** Resolve the current location against the route table. */
    resolve() {
        // Guard against SSR where `window`/`location` may be undefined.
        if (typeof window === 'undefined' || typeof location === 'undefined') return;

        const { pathname, search, hash } = location;
        const cleanPath = pathname.replace(/\/+$/g, '') || '/';

        // -------------------------------------------------------------
        // DEBUG: show what we are trying to match.
        // -------------------------------------------------------------
        console.log('[Router] resolve() →', { cleanPath, search, hash });

        const match = this._match(cleanPath);
        if (match) {
            const { handler, params } = match;
            console.log('[Router] MATCH', { pattern: match.regex?.source, params });
            handler({ ...params, search, hash });
        } else if (this._notFound) {
            console.warn('[Router] NO MATCH – invoking not‑found handler');
            this._notFound({ search, hash });
        } else {
            console.warn('Router: no match and no not‑found handler.');
        }
    }

    /** Register a 404 / “not found” handler. */
    setNotFound(handler) {
        if (typeof handler !== 'function')
            throw new TypeError('Router.setNotFound expects a function');
        this._notFound = handler;
    }

    // -----------------------------------------------------------------
    // PRIVATE HELPERS
    // -----------------------------------------------------------------

    /**
     * Validate a pattern and store its compiled RegExp + ordered param names.
     *
     * The allowed syntax is deliberately narrow:
     *   - alphanumerics, '/', ':', '?', '*'
     *   - param tokens (`:name` or `:name?`)
     *
     * If you need richer patterns, extend the safety check and update
     * the documentation accordingly.
     */
    _register(pattern, handler) {
        if (typeof pattern !== 'string' || typeof handler !== 'function')
            throw new TypeError('Router: each route needs a string pattern and a function handler');

        // ----------- SAFETY CHECK ---------------------------------------
        // Strip out param tokens before testing for illegal characters.
        const stripped = pattern.replace(/:\w+\??/g, '');
        if (!/^[:\w/*?]+$/.test(stripped)) {
            throw new Error(`Router: unsafe characters in route pattern "${pattern}"`);
        }

        const { regex, paramNames } = this._compilePattern(pattern);
        this._routes.push({ regex, paramNames, handler });
    }

    /**
     * Turn a pattern like "/:lang?/exercises/:id?" into a RegExp and a list
     * of parameter names.
     *
     * **SPECIAL CASE** – if the pattern is exactly "/" we must match a
     * single slash. The previous implementation stripped the trailing slash
     * first, turning "/" into an empty string and producing the RegExp ^$,
     * which never matches "/".  This special‑case fixes the home route.
     *
     * **NORMAL CASE** – we strip the leading slash, replace parameters
     * (without adding a leading slash), then prepend a single slash when
     * we build the final RegExp.  This avoids the “//en” double‑slash
     * problem that caused the router to miss language routes.
     */
    _compilePattern(pattern) {
        // ---- SPECIAL CASE FOR ROOT ("/") ---------------------------------
        if (pattern === '/') {
            // No parameters, just match the literal "/"
            return { regex: /^\/$/, paramNames: [] };
        }

        // ---- NORMAL COMPILATION -----------------------------------------
        // 1️⃣ Remove the leading slash (we'll add it back later)
        let working = pattern.replace(/^\/+/, '');

        const paramNames = [];

        // 2️⃣ Optional parameters – they become "(?:/([^/]+))?"
        working = working.replace(/:(\w+)\?/g, (_, name) => {
            paramNames.push(name);
            return '(?:/([^/]+))?';
        });

        // 3️⃣ Required parameters – they become "([^/]+)" (no leading slash)
        working = working.replace(/:(\w+)/g, (_, name) => {
            paramNames.push(name);
            return '([^/]+)';
        });

        // 4️⃣ Wildcard – matches the rest of the path (including slashes)
        working = working.replace(/\*/g, '.*');

        // 5️⃣ Build the final RegExp.  We always want the pattern to start
        //    with a single slash and end at the string boundary.
        const regex = new RegExp(`^/${working}$`);

        return { regex, paramNames };
    }

    /**
     * Find the first matching route and safely decode its parameters.
     * `decodeURIComponent` can throw on malformed encodings – we catch the
     * error, log the offending value, and fall back to the raw string.
     */
    _match(path) {
        for (const { regex, paramNames, handler } of this._routes) {
            // DEBUG: show each test against the incoming path
            console.log('[Router] testing', { regex: regex.source, path });

            const m = path.match(regex);
            if (!m) continue;

            const params = {};
            paramNames.forEach((name, i) => {
                const raw = m[i + 1];
                if (raw === undefined) {
                    params[name] = undefined;                 // optional param not present
                } else {
                    try {
                        params[name] = decodeURIComponent(raw);
                    } catch (e) {
                        console.warn(`Router: malformed percent‑encoding "${raw}" in path "${path}"`);
                        params[name] = raw;                      // fallback to raw value
                    }
                }
            });
            // Attach the regex to the returned object for the debug log in resolve()
            return { handler, params, regex };
        }
        return null;
    }
}

