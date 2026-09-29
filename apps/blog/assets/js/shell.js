/**
 * apps/blog/assets/js/shell.js
 * Milestone 07 — App Shell & Toolbars.
 *
 * Owns exactly one thing: the side-panel drawer.
 * - Hamburger toggles the panel; aria-expanded mirrors state.
 * - ESC closes; backdrop click closes; the close button closes.
 * - aria-hidden toggles on #app-panel; focus moves in on open and returns
 *   to the hamburger on close (S-8).
 *
 * No route awareness. No hash access. No new exports.
 * Idempotent: safe to call once after DOMContentLoaded.
 */
window.BlogShell = (function () {
  const PANEL_ID = "app-panel";
  const MENU_ID = "menu-btn";

  let panelEl = null;
  let menuEl = null;
  let initialized = false;

  function isOpen() {
    return panelEl && panelEl.getAttribute("aria-hidden") === "false";
  }

  /**
   * Open or close the drawer and keep aria-expanded / aria-hidden in sync.
   * @param {boolean} open
   */
  function setOpen(open) {
    if (!panelEl || !menuEl) return;
    panelEl.setAttribute("aria-hidden", open ? "false" : "true");
    menuEl.setAttribute("aria-expanded", open ? "true" : "false");

    if (open) {
      // Move focus into the panel (first focusable, else the panel content).
      const focusable = panelEl.querySelector(
        "button, [href], select, input, [tabindex]:not([tabindex='-1'])",
      );
      if (focusable) focusable.focus();
    } else {
      // Return focus to the hamburger (S-8).
      menuEl.focus();
    }
  }

  function toggle() {
    setOpen(!isOpen());
  }

  /**
   * Wire the hamburger, ESC, backdrop, and close button.
   * Idempotent — a second call is a no-op.
   */
  function init() {
    if (initialized) return;

    panelEl = document.getElementById(PANEL_ID);
    menuEl = document.getElementById(MENU_ID);

    if (!panelEl || !menuEl) {
      console.warn(
        "BlogShell.init: #" + PANEL_ID + " or #" + MENU_ID + " not found.",
      );
      return;
    }

    // ONE click listener on the hamburger.
    menuEl.addEventListener("click", toggle);

    // ONE click listener for backdrop / close controls (delegated).
    panelEl.addEventListener("click", function (event) {
      if (event.target.closest("[data-close]")) {
        setOpen(false);
      }
    });

    // ONE keydown listener (ESC closes).
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen()) {
        setOpen(false);
      }
    });

    initialized = true;
  }

  return {
    init: init,
  };
})();
