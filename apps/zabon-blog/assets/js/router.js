/**
 * Zabon Blog — Hash-based Router (Bulletproof Version)
 * Handles URL parsing, language detection, and route events.
 */
window.BlogRouter = {
  currentRoute: null,
  onRouteChange: null,

  init: function (callback) {
    this.onRouteChange = callback;
    window.addEventListener("hashchange", () => this.handleRoute());
    this.handleRoute(); // Handle initial load immediately
  },

  handleRoute: function () {
    // Remove the '#' and split by '/'. (Milestone 11c) An EMPTY hash no
    // longer hardcodes "en": the language is resolved below via BlogLang so a
    // returned visitor lands in the language they last chose.
    const hash = window.location.hash.slice(1) || "";
    const segments = hash.split("/").filter((s) => s.length > 0);

    // segments[0] = lang, segments[1] = type, segments[2] = slug
    // Milestone 11c (D-11c-3): the URL is the on-load AUTHORITY. A URL that
    // carries an explicit language (segments[0]) ALWAYS wins for this visit,
    // so a shared/bookmarked `#/<lang>/...` link is honoured. When the URL is
    // SILENT (empty hash, "#", or "#/"), fall back to the persisted language
    // (window.BlogLang), then to "en". Guarded — the router still works with
    // the plain "en" default if lang.js failed to load.
    const urlLang = segments[0] || null;
    let lang = urlLang;
    if (!lang) {
      lang =
        window.BlogLang && typeof window.BlogLang.resolve === "function"
          ? window.BlogLang.resolve("en")
          : "en";
    } else if (window.BlogLang && typeof window.BlogLang.set === "function") {
      // A route that carries a language PERSISTS it (D-11c-2), so the next
      // bare-URL visit opens in the same language. Guarded; never throws.
      window.BlogLang.set(lang);
    }
    const type = segments[1] || "list"; // 'post' or 'list'
    const slug = segments[2] || null;

    // Update HTML attributes for RTL/LTR and language
    const htmlEl = document.documentElement;
    htmlEl.setAttribute("lang", lang);
    const rtlLangs = ["fa", "ar", "ur", "he"];
    htmlEl.setAttribute("dir", rtlLangs.includes(lang) ? "rtl" : "ltr");

    this.currentRoute = { lang, type, slug, raw: window.location.hash };

    console.log("🛣️ Route changed:", this.currentRoute);
    if (this.onRouteChange) {
      this.onRouteChange(this.currentRoute);
    }
  },
};
