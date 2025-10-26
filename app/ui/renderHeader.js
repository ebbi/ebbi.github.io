// app/ui/renderHeader.js
// ---------------------------------------------------------------
// Shared header used by Home, Help and every exercise page.
// ---------------------------------------------------------------
import { renderToolbar } from './toolbar.js';
import { renderMenu } from './menu.js';
import { applyDirection } from '../utils/rtl.js';
import { getStoredLang, setStoredLang } from '../utils/storage.js';
// import { SUPPORTED_LANGS, FALLBACK_LANG, LANGUAGE_LABELS } from '../data/locales.js';
import { SUPPORTED_LANGS, FALLBACK_LANG, LANGUAGE_LABELS, getLocale } from '../data/locales.js';
import { populateFontSelect } from './fontSelect.js';
// NEW – central speech controller
import { createSpeechController } from "../utils/speechController.js";

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
    /*
    // -----------------------------------------------------------------
    // 1️⃣ Normalise the language (persist it, set direction)
    // -----------------------------------------------------------------
    if (!SUPPORTED_LANGS.includes(lang)) lang = FALLBACK_LANG;
    if (lang !== getStoredLang()) await setStoredLang(lang);
    applyDirection(lang);
*/

    // 1️⃣ Normalise the language (persist it, set direction)
    if (!SUPPORTED_LANGS.includes(lang)) lang = FALLBACK_LANG;
    if (lang !== getStoredLang()) await setStoredLang(lang);
    applyDirection(lang);

    // 2️⃣ Load the localisation strings for the current UI language
    const locale = getLocale(lang);

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
    /*
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
    */

    // ---- Language selector -------------------------------------------------
    const langSelect = document.createElement('select');
    langSelect.id = 'langSelect';
    langSelect.style.flex = '1';               // will share the row with the font selector
    langSelect.style.fontSize = '0.85rem';
    langSelect.style.margin = '0';

    // placeholder (first row) – not selectable, internationalised
    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    placeholderOption.textContent = locale.appInterfaceLanguage || 'App interface language';
    langSelect.appendChild(placeholderOption);

    // language options
    SUPPORTED_LANGS.forEach(code => {
        const opt = document.createElement('option');
        opt.value = code;
        if (code === getStoredLang()) opt.selected = true;
        const label = LANGUAGE_LABELS[code] || code.toUpperCase();
        opt.textContent = label;
        langSelect.appendChild(opt);
    });

    langSelect.onchange = ev => {
        const newLang = ev.target.value;
        if (newLang !== getStoredLang()) {
            // Persist the new language and update the document direction.
            setStoredLang(newLang);
            applyDirection(newLang);

            // -------------------------------------------------------------
            // Keep the user on the *current* page (home, help, exercise, …)
            // by swapping the first path segment (the language code) with the
            // newly‑selected language.
            // Example transformations:
            //   "/en"               → "/fr"
            //   "/en/help"      → "/fr/help"
            //   "/en/exercises/02"  → "/fr/exercises/02"
            // -------------------------------------------------------------
            const currentPath = location.pathname;               // e.g. "/en/help"
            const segments = currentPath.split('/');              // ["", "en", "help"]
            if (segments.length > 1) {
                segments[1] = newLang;                           // replace language code
            }
            const updatedPath = segments.join('/') || '/';        // rebuild path

            // Use replaceState so the navigation feels seamless (no extra history entry).
            window.router.navigate(updatedPath, true);
        }
    };

    //   nav.appendChild(langSelect);
    /*
        // ---- Font selector ----------------------------------------------------
        const fontSelect = document.createElement('select');
        fontSelect.id = 'fontSelect';
        fontSelect.style.width = '100%';
        fontSelect.style.fontSize = '0.85rem';
        fontSelect.style.margin = '0';
        // The actual options will be filled later by `renderMenu` (it knows the catalog).
        nav.appendChild(fontSelect);
        populateFontSelect(fontSelect);
    */
    // ---- Font selector ----------------------------------------------------
    const fontSelect = document.createElement('select');
    fontSelect.id = 'fontSelect';
    fontSelect.style.flex = '1';               // will share the row with the language selector
    fontSelect.style.fontSize = '0.85rem';
    fontSelect.style.margin = '0';

    // placeholder (first row) – not selectable, internationalised
    const fontPlaceholder = document.createElement('option');
    fontPlaceholder.value = '';
    fontPlaceholder.disabled = true;
    fontPlaceholder.selected = true;
    fontPlaceholder.textContent = locale.appFont || 'App font';
    fontSelect.appendChild(fontPlaceholder);

    // Fill the rest of the options (existing helper does the work)
    populateFontSelect(fontSelect);

    // ---- Wrap the two selectors in a single flex row -----------------------
    const selectorsRow = document.createElement('div');
    selectorsRow.style.display = 'flex';
    selectorsRow.style.gap = '0.5rem';          // optional spacing between the two selects
    selectorsRow.style.margin = '0.5rem 0';     // optional vertical margin

    selectorsRow.appendChild(langSelect);
    selectorsRow.appendChild(fontSelect);

    nav.appendChild(selectorsRow);

    // -----------------------------------------------------------------
    // 5️⃣ Return the <main> element for the caller to inject page‑specific UI.
    // -----------------------------------------------------------------
    return document.getElementById('main');
}
