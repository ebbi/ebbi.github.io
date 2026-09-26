/**
 * Zabon Blog — Main Application Entry Point
 */

(() => {
  const appContainer = document.getElementById("app");

  /**
   * Default page renderer (placeholder)
   */
  function renderDefaultPage(route) {
    appContainer.innerHTML = `
      <header>
        <h1>Zabon Blog</h1>
        <nav>
          <a href="#/en/">English</a> |
          <a href="#/fa/">فارسی</a> |
          <a href="#/ar/">العربية</a> |
          <a href="#/th/">ไทย</a>
        </nav>
      </header>
      <main>
        <p>Current Route: <code>${route.path}</code></p>
        <p>Language: ${route.lang} | Direction: ${document.documentElement.dir}</p>
        <p><em>Milestone 00: Bootstrap & Foundation — Complete</em></p>
      </main>
    `;
  }

  /**
   * Initialize application
   */
  function init() {
    const router = window.ZabonRouter.init();

    // Register default wildcard handler
    router.on("*", renderDefaultPage);

    console.log("[App] Initialization complete.");
    console.log("[App] Current route:", router.getCurrentRoute());
  }

  // Start app when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
