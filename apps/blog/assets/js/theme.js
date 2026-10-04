/**
 * apps/blog/assets/js/theme.js
 * Milestone 07b — Theme toggle (light / dark / auto).
 *
 * Owns exactly one thing: the resolved color theme.
 * - Window surface: window.BlogTheme = { init, get, set }.
 * - Applies `data-theme` = "day" | "night" on <html>.
 * - Preference ("light" | "dark" | "auto") persists in ONE localStorage key.
 * - Auto follows `prefers-color-scheme` and re-resolves when the OS changes.
 * - Themes re-point CSS tokens ONLY (style.css :root = day; the
 *   html[data-theme="night"] block = night). No component class changes.
 *
 * No route awareness. No hash access. Idempotent init.
 *
 * This module is loaded in <head> (before the stylesheet/paint) so that it
 * can apply the persisted theme synchronously at parse time — there is NO
 * inline script in index.html; the pre-paint application lives here, in the
 * single external module (best practice; single source of that early apply).
 * init() (control wiring + OS listener) is called later, guarded, from
 * app.js's DOMContentLoaded block.
 */
window.BlogTheme = (function () {
  const STORE_KEY = "zabon-blog-theme";
  const SELECT_ID = "theme-select";
  const PREFS = ["light", "dark", "auto"];

  let selectEl = null;
  let initialized = false;

  /**
   * Read the persisted preference. Falls back to "auto" when unset or
   * when the stored value is not a known preference.
   * @returns {"light"|"dark"|"auto"}
   */
  function readPref() {
    let stored = null;
    try {
      stored = window.localStorage.getItem(STORE_KEY);
    } catch (err) {
      // Private mode / storage disabled: fall back to auto.
      stored = null;
    }
    return PREFS.indexOf(stored) !== -1 ? stored : "auto";
  }

  /**
   * @returns {boolean} true when the OS preference is dark.
   */
  function prefersDark() {
    return (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }

  /**
   * Resolve a preference to a concrete theme value.
   * @param {"light"|"dark"|"auto"} pref
   * @returns {"day"|"night"}
   */
  function resolve(pref) {
    if (pref === "dark") return "night";
    if (pref === "light") return "day";
    return prefersDark() ? "night" : "day"; // auto
  }

  /**
   * Apply a resolved theme to <html>. Sets the attribute only.
   * @param {"day"|"night"} theme
   */
  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  /**
   * Resolve + apply the current preference, and mirror it onto the control.
   */
  function refresh() {
    const pref = readPref();
    apply(resolve(pref));
    if (selectEl) selectEl.value = pref;
  }

  /**
   * @returns {"day"|"night"} the theme actually applied.
   */
  function get() {
    return document.documentElement.getAttribute("data-theme") === "night"
      ? "night"
      : "day";
  }

  /**
   * Persist a preference and apply it immediately.
   * @param {"light"|"dark"|"auto"} pref
   */
  function set(pref) {
    if (PREFS.indexOf(pref) === -1) return;
    try {
      window.localStorage.setItem(STORE_KEY, pref);
    } catch (err) {
      // Non-fatal: apply for this session even if storage is unavailable.
    }
    refresh();
  }

  /**
   * Wire the control + the OS-preference listener. Idempotent.
   */
  function init() {
    if (initialized) return;

    const panel = document.getElementById("app-panel");
    const scope = panel || document;
    selectEl =
      scope.querySelector("#" + SELECT_ID) ||
      document.getElementById(SELECT_ID);

    if (selectEl) {
      selectEl.addEventListener("change", function () {
        set(selectEl.value);
      });
    }

    // Re-resolve when the OS preference changes (auto mode).
    if (typeof window.matchMedia === "function") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const onSchemeChange = function () {
        refresh();
      };
      if (typeof mql.addEventListener === "function") {
        mql.addEventListener("change", onSchemeChange);
      } else if (typeof mql.addListener === "function") {
        mql.addListener(onSchemeChange); // legacy Safari
      }
    }

    refresh();
    initialized = true;
  }

  // Pre-paint application: this module is loaded in <head> (deferred is NOT
  // used), so applying here, at parse time, runs before the body renders and
  // avoids a flash of the wrong theme. init() still runs later (guarded) to
  // wire the control and install the OS listener.
  try {
    apply(resolve(readPref()));
  } catch (err) {
    document.documentElement.setAttribute("data-theme", "day");
  }

  return {
    init: init,
    get: get,
    set: set,
  };
})();
