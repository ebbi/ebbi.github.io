/**
 * apps/blog/assets/js/nav.js
 * Milestone 06b — Toolbar & Language Drop-down.
 *
 * Owns exactly one thing: the header language switcher.
 *
 * Contracts (see tools/milestones/06b.md):
 * - B-2: the control is a native <select> with an associated <label>.
 * - B-3: changing it writes location.hash from the option's precomputed
 *   href. This is the ONLY location.hash assignment in this file; the
 *   href is produced by buildLangHref, which never reads the hash (N2).
 * - B-4(i): the flag is decorative and rendered beside the closed
 *   control; it is a mirror of the selection, not a second selector.
 * - B-5: option text is the localized language name (content; pending
 *   per-language human review).
 * - B-6: the flag does not assert language-country identity; accessible
 *   name and hreflang use the language code/name, never the flag.
 * - N4: RTL/dir and <html lang> are owned by router.js; not touched here.
 * - Preserved from 06: no second hashchange listener; no hash parsing.
 */
window.BlogNav = (function () {
  // Milestone 10c (D-10c-6): the switcher offers ONLY languages that have
  // content (recon: content/en = 26 files; content/{fa,ar,th} = 0). The
  // LOCKED_DECISIONS UI-language list is a superset and is NOT shipped
  // wholesale. Translations are DEFERRED (human gate not signed off), so the
  // offered set is EN only for now. Adding a language here is the ONLY change
  // needed once its content/<lang>/ dir has files.
  const LANGS = [{ code: "en", name: "English" }];
  const NAV_ID = "lang-nav";
  const SELECT_ID = "lang-select";
  const FLAG_SELECTOR = ".lang-flag";

  let router = null;
  let selectEl = null;
  let flagEl = null;

  /**
   * Build the target href for a language, given the current route.
   * The ONLY place the app builds a language-switch URL (N2/B-3).
   *
   * @param {string} code  target language code, e.g. "fa"
   * @param {object|null} route  { lang, type, slug, raw }
   * @returns {string}  a hash href, e.g. "#/fa" or "#/fa/post/<slug>"
   */
  function buildLangHref(code, route) {
    if (route && route.type === "post" && route.slug) {
      return "#/" + code + "/post/" + route.slug;
    }
    return "#/" + code;
  }

  /**
   * Populate the <select> once, on init.
   * Later updates only rewrite value / href.
   */
  function renderOptions() {
    if (!selectEl) return;
    selectEl.innerHTML = "";

    LANGS.forEach(function (lang) {
      const opt = document.createElement("option");
      opt.value = lang.code;
      opt.textContent = lang.name;
      // hreflang documents the language of the destination (B-6).
      opt.setAttribute("hreflang", lang.code);
      // data-href is recomputed on every route change (see sync).
      opt.setAttribute("data-href", buildLangHref(lang.code, null));
      selectEl.appendChild(opt);
    });
  }

  /**
   * Update each option's href for the current route, set the selected
   * value, and mirror the decorative flag. No hash parsing (N2/B-3).
   *
   * @param {{lang: string, type: string, slug: string|null}|null} route
   */
  function sync(route) {
    if (!selectEl) return;

    const currentLang = (route && route.lang) || "en";

    Array.prototype.forEach.call(selectEl.options, function (opt) {
      opt.setAttribute("data-href", buildLangHref(opt.value, route));
    });

    // Selection state on a native <select> is `value`, not aria-current.
    const codes = LANGS.map(function (l) {
      return l.code;
    });
    if (codes.indexOf(currentLang) !== -1) {
      selectEl.value = currentLang;
    }
    selectEl.setAttribute("data-lang", currentLang);

    if (flagEl) {
      flagEl.setAttribute("data-lang", currentLang);
    }
  }

  /**
   * Single change handler: navigate to the selected option's href.
   * This is the ONLY location.hash assignment in this file (B-3).
   */
  function onChange() {
    if (!selectEl) return;
    const opt = selectEl.options[selectEl.selectedIndex];
    if (!opt) return;
    const href = opt.getAttribute("data-href");
    if (href) {
      // Assignment only; never read. URL building stays in buildLangHref.
      window.location.hash = href;
    }
  }

  /**
   * Called once by app.js after BlogRouter.init succeeds.
   * Stores the router ref, builds options, installs the change listener.
   * Does NOT parse location.hash (N2/B-3).
   *
   * @param {object} routerRef  window.BlogRouter
   */

  function init(routerRef) {
    router = routerRef || null;

    // S-5 (07): the switcher now lives inside #app-panel (moved from the
    // header). Resolve within the panel when present, else fall back to the
    // document so the lookup is robust to the element's new home.
    const panel = document.getElementById("app-panel");
    const scope = panel || document;
    const nav =
      scope.querySelector("#" + NAV_ID) || document.getElementById(NAV_ID);
    selectEl = nav ? nav.querySelector("#" + SELECT_ID) : null;
    flagEl = nav ? nav.querySelector(FLAG_SELECTOR) : null;

    if (!selectEl) {
      console.warn(
        "BlogNav.init: #" + SELECT_ID + " not found; switcher disabled.",
      );
      return;
    }

    renderOptions();
    selectEl.addEventListener("change", onChange);
    sync(router && router.currentRoute ? router.currentRoute : null);
  }

  // ... rest of code ...

  /**
   * Called by app.js on every router event.
   * Rewrites option hrefs and mirrors the selection + flag.
   *
   * @param {{lang: string, type: string, slug: string|null}} route
   */
  function onRouteChange(route) {
    if (!route) return;
    sync(route);
  }

  return {
    init: init,
    onRouteChange: onRouteChange,
  };
})();
