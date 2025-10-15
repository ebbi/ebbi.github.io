// app/ui/renderHeader.js
// ---------------------------------------------------------------
// Shared header used by Home, Settings and every exercise page.
// ---------------------------------------------------------------
import { renderToolbar } from './toolbar.js';
import { renderMenu } from './menu.js';
import { applyDirection } from '../utils/rtl.js';
import { getStoredLang, setStoredLang } from '../utils/storage.js';
import { SUPPORTED_LANGS, FALLBACK_LANG, LANGUAGE_LABELS } from '../data/locales.js';

/**
 * Creates the static page skeleton:
 *   • <header id="toolbarContainer"> – holds the toolbar.
 *   • <nav class="menu-nav"> – holds ONLY the language‑ and font‑selectors.
 *   • <main id="main" class="main"> – where page‑specific content will be injected.
 *
 * The dynamic UI elements (level‑filter checkboxes and the exercise list)
 * are **not** created here. They will be added later by `renderMenu`
 * when the home page is rendered.
 *
 * @param {string} lang – language code that should be active.
 * @returns {HTMLElement} the <main id="main"> element.
 */
export async function renderHeader(lang) {
    // -----------------------------------------------------------------
    // 1️⃣ Normalise the language (persist it, set direction)
    // -----------------------------------------------------------------
    if (!SUPPORTED_LANGS.includes(lang)) lang = FALLBACK_LANG;
    if (lang !== getStoredLang()) await setStoredLang(lang);
    applyDirection(lang);

    // -----------------------------------------------------------------
    // 2️⃣ Build the static skeleton (toolbar, static nav, empty <main>)
    // -----------------------------------------------------------------
    document.body.innerHTML = `
        <header id="toolbarContainer"></header>
        <nav class="menu-nav"></nav>
        <main id="main" class="main"></main>
    `;

    // -----------------------------------------------------------------
    // 3️⃣ Render the toolbar (top‑of‑page)
    // -----------------------------------------------------------------
    renderToolbar(document.getElementById('toolbarContainer'));

    // -----------------------------------------------------------------
    // 4️⃣ Populate the static navigation bar with language & font selectors
    // -----------------------------------------------------------------
    const nav = document.querySelector('nav.menu-nav');

    // ---- Language selector -------------------------------------------------
    const langSelect = document.createElement('select');
    langSelect.id = 'langSelect';
    langSelect.style.width = '100%';
    langSelect.style.fontSize = '0.85rem';
    langSelect.style.margin = '0';
    langSelect.innerHTML = SUPPORTED_LANGS.map(code => {
        const selected = code === getStoredLang() ? 'selected' : '';
        const label = LANGUAGE_LABELS[code] || code.toUpperCase();
        return `<option value="${code}" ${selected}>${label}</option>`;
    }).join('');
    langSelect.onchange = ev => {
        const newLang = ev.target.value;
        if (newLang !== getStoredLang()) {
            // Persist language, update direction, then navigate to home for the new lang
            setStoredLang(newLang);
            applyDirection(newLang);
            router.navigate(`/${newLang}/`, true);
        }
    };
    nav.appendChild(langSelect);

    // ---- Font selector ----------------------------------------------------
    const fontSelect = document.createElement('select');
    fontSelect.id = 'fontSelect';
    fontSelect.style.width = '100%';
    fontSelect.style.fontSize = '0.85rem';
    fontSelect.style.margin = '0';
    // The actual options will be filled later by `renderMenu` (it knows the catalog).
    nav.appendChild(fontSelect);

    // -----------------------------------------------------------------
    // 5️⃣ Return the <main> element for the caller to inject page‑specific UI.
    // -----------------------------------------------------------------
    return document.getElementById('main');
}