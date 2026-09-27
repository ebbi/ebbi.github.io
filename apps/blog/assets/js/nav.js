/**
 * apps/blog/assets/js/nav.js
 * Milestone 06 — Navigation & Header.
 *
 * Owns exactly one thing: the header language switcher.
 *
 * Contracts (see tools/milestones/06.md, decisions N1-N5):
 * - N1: Navigation-only. No translation, no language filtering, no
 *   content-file changes.
 * - N2: Every language URL is derived from the router's route object.
 *   This file NEVER parses `location.hash`.
 * - N3: Routes arrive via BlogNav.onRouteChange(route), forwarded from
 *   app.js's existing router callback. No second `hashchange` listener.
 * - N4: RTL/`dir` and `<html lang>` are owned by router.js. This file
 *   does not set them.
 * - N5: The switcher list is the four CONTENT languages (en, fa, ar, th).
 *   The eight UI languages in LOCKED_DECISIONS.txt are intentionally
 *   NOT shown here.
 *
 * Deferred (see HANDOFF-06.md): localized language names, flag icons,
 * and a drop-down/toolbar treatment are out of scope for 06 and belong
 * to milestone 06b.
 */
window.BlogNav = (function () {
  // Single source within 06 for the content-language set (N5).
  const LANGS = [
    { code: "en", label: "EN" },
    { code: "fa", label: "FA" },
    { code: "ar", label: "AR" },
    { code: "th", label: "TH" },
  ];

  const NAV_ID = "lang-nav";
  const LIST_SELECTOR = ".lang-list";
  const LINK_SELECTOR = ".lang-link";
  const CURRENT = "page"; // aria-current value used on the active link

  let router = null;
  let listEl = null;

  /**
   * Build the target href for a language, given the current route.
   * This is the ONLY place the app builds a language-switch URL (N2).
   *
   * @param {string} code  target language code, e.g. "fa"
   * @param {object|null} route  router route { lang, type, slug, raw }
   * @returns {string}  a hash href, e.g. "#/fa" or "#/fa/post/<slug>"
   */
  function buildLangHref(code, route) {
    if (route && route.type === "post" && route.slug) {
      return "#/" + code + "/post/" + route.slug;
    }
    return "#/" + code;
  }

  /**
   * Create the <li><a>…</a></li> nodes once, on init.
   * Later updates only rewrite href / aria-current.
   */
  function renderLinks() {
    if (!listEl) return;
    listEl.innerHTML = "";

    LANGS.forEach(function (lang) {
      const li = document.createElement("li");
      li.className = "lang-item";

      const a = document.createElement("a");
      a.className = "lang-link";
      a.setAttribute("data-lang", lang.code);
      a.setAttribute("hreflang", lang.code);
      a.setAttribute("href", buildLangHref(lang.code, null));
      a.textContent = lang.label;

      li.appendChild(a);
      listEl.appendChild(li);
    });
  }

  /**
   * Update each link's href for the current route, and mark the active
   * language with aria-current. No hash parsing (N2).
   *
   * @param {{lang: string, type: string, slug: string|null}|null} route
   */
  function syncLinks(route) {
    if (!listEl) return;
    const currentLang = (route && route.lang) || "en";

    listEl.querySelectorAll(LINK_SELECTOR).forEach(function (a) {
      const code = a.getAttribute("data-lang");
      a.setAttribute("href", buildLangHref(code, route));
      if (code === currentLang) {
        a.setAttribute("aria-current", CURRENT);
      } else {
        a.removeAttribute("aria-current");
      }
    });
  }

  /**
   * Called once by app.js after BlogRouter.init succeeds.
   * Stores the router reference and builds the link nodes.
   * Does NOT parse location.hash (N2, N3).
   *
   * @param {object} routerRef  window.BlogRouter
   */
  function init(routerRef) {
    router = routerRef || null;
    listEl =
      document.getElementById(NAV_ID)?.querySelector(LIST_SELECTOR) || null;

    if (!listEl) {
      console.warn(
        "BlogNav.init: #" +
          NAV_ID +
          " " +
          LIST_SELECTOR +
          " not found; switcher disabled.",
      );
      return;
    }

    renderLinks();
    syncLinks(router && router.currentRoute ? router.currentRoute : null);
  }

  /**
   * Called by app.js on every router event.
   * Marks aria-current and rewrites hrefs so post-to-post keeps the slug.
   *
   * @param {{lang: string, type: string, slug: string|null}} route
   */
  function onRouteChange(route) {
    if (!route) return;
    syncLinks(route);
  }

  return {
    init: init,
    onRouteChange: onRouteChange,
  };
})();
