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
    // Remove the '#' and split by '/'. Default to '/en' if empty.
    const hash = window.location.hash.slice(1) || "/en";
    const segments = hash.split("/").filter((s) => s.length > 0);

    // segments[0] = lang, segments[1] = type, segments[2] = slug
    const lang = segments[0] || "en";
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
