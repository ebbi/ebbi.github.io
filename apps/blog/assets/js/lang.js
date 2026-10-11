/**
 * apps/blog/assets/js/lang.js
 * Milestone 11c — Persistent language selection.
 *
 * Owns exactly one thing: the reader's persisted LANGUAGE CHOICE.
 * - Window surface: window.BlogLang = { get, set, resolve }.
 * - Preference ("en" | "fa" | "th" | "ar") persists in ONE localStorage key
 *   ("zabon-blog-lang"), the theme.js (07b) / font.js (07c) pattern.
 * - It does NOT parse the URL and has NO route awareness: router.js is the
 *   SINGLE source of route state and is the ONLY reader/writer of this key.
 *   The router CONSULTS resolve() when the URL carries no language and WRITES
 *   set() whenever a route resolves (D-11c-2).
 * - URL is the on-load AUTHORITY (D-11c-3): an explicit `#/<lang>/...` always
 *   wins for that visit; this store only fills the GAP when the URL is silent
 *   (so a shared/bookmarked link is honoured).
 *
 * This module is loaded in <head> (NOT deferred), alongside theme.js/font.js,
 * matching the sibling pre-controller modules. It has NO parse-time side
 * effect; the placement documents the shared "head module" contract and lets
 * the router consult it as soon as the controller runs. init is not needed:
 * the module is stateless beyond localStorage.
 */
window.BlogLang = (function () {
  const STORE_KEY = "zabon-blog-lang";
  // The content languages the app actually ships (nav.js LANGS / feed.json).
  // A stored value outside this set is treated as unset.
  const KNOWN = ["en", "fa", "th", "ar"];
  const DEFAULT_CODE = "en";

  /**
   * Read the persisted language. Returns the code when it is a KNOWN language,
   * else "" (unset/unknown). Tolerates a storage failure (private mode).
   * @returns {string}
   */
  function get() {
    let stored = null;
    try {
      stored = window.localStorage.getItem(STORE_KEY);
    } catch (err) {
      // Private mode / storage disabled: treat as unset.
      stored = null;
    }
    return KNOWN.indexOf(stored) !== -1 ? stored : "";
  }

  /**
   * Persist a language choice. No-op for a code outside KNOWN. A storage
   * failure is non-fatal: the current session still behaves (the router has
   * already resolved the language for this visit).
   * @param {string} code
   */
  function set(code) {
    if (KNOWN.indexOf(code) === -1) return;
    try {
      window.localStorage.setItem(STORE_KEY, code);
    } catch (err) {
      // Non-fatal: the navigation already applied for this session.
    }
  }

  /**
   * The language to USE when the URL carries none: the persisted choice when
   * set, else the supplied fallback (default "en"). This is the single
   * "which language when nothing is in the URL" rule (D-11c-2/D-11c-3).
   * @param {string} [fallbackCode]
   * @returns {string}
   */
  function resolve(fallbackCode) {
    const stored = get();
    if (stored) return stored;
    return KNOWN.indexOf(fallbackCode) !== -1 ? fallbackCode : DEFAULT_CODE;
  }

  return {
    get: get,
    set: set,
    resolve: resolve,
  };
})();
