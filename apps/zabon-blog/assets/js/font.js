/**
 * apps/blog/assets/js/font.js
 * Milestone 07c — Font selection (traditional / modern + default base).
 *
 * Owns exactly one thing: the resolved reading font FAMILY.
 * - Window surface: window.BlogFont = { init, get, set }.
 * - Applies `data-font` = "traditional" | "modern" on <html>. When no
 *   preference is stored, the attribute is REMOVED so the CSS :root DEFAULT
 *   (the book-reader base) applies (F-2).
 * - Preference persists in ONE localStorage key (theme-pref pattern, 07b).
 * - Chooses the body family ONLY: it re-points the family tokens that 07d
 *   defined (--font-body / --font-heading). It does NOT own the typographic
 *   SYSTEM (measure, rhythm, scale, hyphenation) — that is 07d.
 * - Fonts are SYSTEM stacks (no network fetch; F-4); the stacks degrade
 *   gracefully to a readable system font (no invisible text).
 *
 * No route awareness. No hash access. Idempotent init.
 *
 * This module is loaded in <head> (before the stylesheet/paint) so that it
 * can apply the persisted/default family synchronously at parse time — there
 * is NO inline script in index.html; the pre-paint application lives here,
 * in the single external module (single source of that early apply). This
 * MIRRORS theme.js's pre-paint pattern and is coordinated with it (both are
 * external head modules, each the single source of its own early apply).
 * init() (control wiring) is called later, guarded, from app.js's
 * DOMContentLoaded block.
 */
window.BlogFont = (function () {
  const STORE_KEY = "zabon-blog-font";
  const SELECT_ID = "font-select";
  // "traditional" and "modern" are the known keys. An absent/unknown pref
  // resolves to the DEFAULT (no data-font attribute -> CSS :root default).
  const PREFS = ["traditional", "modern"];

  let selectEl = null;
  let initialized = false;

  /**
   * Read the persisted preference. Falls back to the DEFAULT ("") when unset
   * or when the stored value is not a known key.
   * @returns {"traditional"|"modern"|""}
   */
  function readPref() {
    let stored = null;
    try {
      stored = window.localStorage.getItem(STORE_KEY);
    } catch (err) {
      // Private mode / storage disabled: fall back to the default.
      stored = null;
    }
    return PREFS.indexOf(stored) !== -1 ? stored : "";
  }

  /**
   * Apply a resolved preference to <html>. "" removes the attribute so the
   * CSS :root DEFAULT (book-reader base) governs.
   * @param {"traditional"|"modern"|""} pref
   */
  function apply(pref) {
    if (pref) {
      document.documentElement.setAttribute("data-font", pref);
    } else {
      document.documentElement.removeAttribute("data-font");
    }
  }

  /**
   * Resolve + apply the current preference, and mirror it onto the control.
   */
  function refresh() {
    const pref = readPref();
    apply(pref);
    if (selectEl) selectEl.value = pref;
  }

  /**
   * @returns {string} the family key actually applied ("traditional",
   *   "modern", or "" for the DEFAULT base).
   */
  function get() {
    const attr = document.documentElement.getAttribute("data-font");
    return PREFS.indexOf(attr) !== -1 ? attr : "";
  }

  /**
   * Persist a preference and apply it immediately. "" (or a known key only)
   * selects the default/known keys respectively.
   * @param {"traditional"|"modern"|""} pref
   */
  function set(pref) {
    // Accept only the known keys or the empty default; ignore anything else.
    if (pref !== "" && PREFS.indexOf(pref) === -1) return;
    try {
      if (pref) {
        window.localStorage.setItem(STORE_KEY, pref);
      } else {
        window.localStorage.removeItem(STORE_KEY);
      }
    } catch (err) {
      // Non-fatal: apply for this session even if storage is unavailable.
    }
    // Apply the REQUESTED value directly (do not re-read storage): if storage
    // is unavailable, refresh()->readPref() would fall back to the default
    // and silently discard the user's choice for this session.
    apply(pref);
    if (selectEl) selectEl.value = pref;
  }

  /**
   * Wire the control. Idempotent.
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

    refresh();
    initialized = true;
  }

  // Pre-paint application: this module is loaded in <head> (deferred is NOT
  // used), so applying here, at parse time, runs before the body renders and
  // avoids a flash of the wrong font (F-3). init() still runs later (guarded)
  // to wire the control.
  try {
    apply(readPref());
  } catch (err) {
    document.documentElement.removeAttribute("data-font");
  }

  return {
    init: init,
    get: get,
    set: set,
  };
})();
