/**
 * Zabon Blog — Hash-Based Router
 * GitHub Pages compatible (no server-side routing)
 */

const ROUTER = (() => {
  let currentRoute = null;
  let handlers = new Map();

  /**
   * Parse hash into structured route object
   * Format: #/<lang>/<slug> or #/<lang>/
   */
  function parseHash(hashStr) {
    const cleanHash = hashStr.replace(/^#/, "");
    const segments = cleanHash.split("/").filter(Boolean);

    if (segments.length === 0) {
      return { lang: "en", slug: null, path: "/" };
    }

    const lang = segments[0] || "en";
    const slug = segments[1] || null;
    const path = `/${lang}${slug ? "/" + slug : ""}`;

    return { lang, slug, path };
  }

  /**
   * Register a route handler
   */
  function on(routePattern, handler) {
    handlers.set(routePattern, handler);
  }

  /**
   * Navigate to a new route
   */
  function navigate(routeObj) {
    const newPath = `#${routeObj.path}`;
    if (window.location.hash !== newPath) {
      window.location.hash = newPath;
    } else {
      handleRouteChange(routeObj);
    }
  }

  /**
   * Handle route change event
   */
  function handleRouteChange(newRoute) {
    console.log("[Router] Route changed:", newRoute);
    currentRoute = newRoute;

    // Update HTML lang/dir attributes
    document.documentElement.lang = newRoute.lang;
    document.documentElement.dir = ["fa", "ar"].includes(newRoute.lang)
      ? "rtl"
      : "ltr";

    // Trigger registered handlers
    handlers.forEach((handler, pattern) => {
      if (pattern === "*" || pattern === newRoute.path) {
        handler(newRoute);
      }
    });
  }

  /**
   * Initialize router
   */
  function init() {
    window.addEventListener("hashchange", () => {
      const route = parseHash(window.location.hash);
      handleRouteChange(route);
    });

    // Initial route
    const initialHash = window.location.hash || "#/en/";
    const initialRoute = parseHash(initialHash);
    handleRouteChange(initialRoute);

    return { parseHash, on, navigate, getCurrentRoute: () => currentRoute };
  }

  return { init };
})();

// Expose globally for debugging
window.ZabonRouter = ROUTER;
