// ---------------------------------------------------------------
// app/ui/routes.js
// ---------------------------------------------------------------

// ────── existing imports ───────────────────────────────────────
import { renderToolbar } from './toolbar.js';
import { renderHelp } from './help.js';   // or wherever you implement it - here
import { renderMenu } from './menu.js';
import { renderExerciseDetail } from './detail.js';
import { initDictionaryPage } from './dictionaryExercise.js';
// import { getOSInstructionKey } from '../utils/osDetection.js';
import { getLocale, SUPPORTED_LANGS, FALLBACK_LANG } from '../data/locales.js';
import { setStoredLang, getStoredLang } from '../utils/storage.js';
import { applyDirection } from '../utils/rtl.js';
import { loadJSON } from '../utils/fetch.js';   // ← NEW import – needed for deep‑link loading
import { renderHeader } from './renderHeader.js';   // <-- use the full header builder
// 
// -----------------------------------------------------------------

/* -----------------------------------------------------------------
   HOME – fresh list of exercises
   ----------------------------------------------------------------- */

/* -----------------------------------------------------------------
   Utility – clear page‑specific content (keep header, nav, main)
   ----------------------------------------------------------------- */
function clearPage() {
    // Remove everything that lives inside <main>. Header and nav stay.
    const main = document.getElementById('main');
    if (main) main.innerHTML = '';
}

/* -----------------------------------------------------------------
   HOME – fresh list of exercises
   ----------------------------------------------------------------- */
export async function homeHandler({ lang } = {}) {
    // -------------------------------------------------------------
    // 1️⃣ Normalise language, persist it and set text direction.
    // -------------------------------------------------------------
    if (!lang) {
        window.router.navigate(`/${getStoredLang()}/`, true);
        return;
    }
    if (!SUPPORTED_LANGS.includes(lang)) {
        window.router.navigate(`/${FALLBACK_LANG}/`, true);
        return;
    }
    if (lang !== getStoredLang()) await setStoredLang(lang);
    applyDirection(lang);

    // -------------------------------------------------------------
    // 2️⃣ Build the full header (toolbar + language/font selectors)
    // -------------------------------------------------------------
    const mainEl = await renderHeader(lang);

    // -------------------------------------------------------------
    // 3️⃣ Remove any leftover dynamic UI from a previous view.
    // -------------------------------------------------------------
    clearPage();

    // -------------------------------------------------------------
    // 4️⃣ Render the menu (level filters + exercise list) inside <main>.
    // -------------------------------------------------------------
    await renderMenu(mainEl, lang);
}

/* -----------------------------------------------------------------
   EXERCISES LIST – behaves exactly like Home
   ----------------------------------------------------------------- */
export async function exercisesHandler({ lang } = {}) {
    if (lang !== getStoredLang()) await setStoredLang(lang);
    applyDirection(lang);

    // Build header and get <main>
    const mainEl = await renderHeader(lang);
    clearPage();
    await renderMenu(mainEl, lang);
}

/* -----------------------------------------------------------------
   SINGLE EXERCISE DETAIL – dispatch based on exercise “type”
   ----------------------------------------------------------------- */
export async function exerciseDetailHandler({ lang, id } = {}) {
    // -----------------------------------------------------------------
    // 0️⃣  Persist language & direction (same as other handlers)
    // -----------------------------------------------------------------
    if (lang !== getStoredLang()) await setStoredLang(lang);
    applyDirection(lang);

    // -----------------------------------------------------------------
    // 1️⃣  Build the full page skeleton (toolbar, static nav, empty <main>)
    // -----------------------------------------------------------------
    const mainEl = await renderHeader(lang);
    clearPage();

    // -----------------------------------------------------------------
    // 2️⃣  Load the global EXERCISES array if it is still empty.
    //     This covers the case where the user lands directly on a deep‑link
    //     (e.g. /en/exercises/02) before the home page has populated it.
    // -----------------------------------------------------------------
    const { EXERCISES } = await import('../data/exercises.js');
    if (!EXERCISES.length) {
        try {
            const data = await loadJSON('/app/data/exercises.json');
            EXERCISES.push(...data);
        } catch (e) {
            console.warn('⚠️ Could not load exercises catalogue', e);
            const main = document.getElementById('main');
            main.innerHTML = `<h2>🚫 Not found</h2>
                             <p>Failed to load the exercises list.</p>`;
            return;
        }
    }

    // -----------------------------------------------------------------
    // 3️⃣  Find the requested exercise metadata
    // -----------------------------------------------------------------
    const meta = EXERCISES.find(e => e.id === id);
    if (!meta) {
        const main = document.getElementById('main');
        main.innerHTML = `<h2>🚫 Not found</h2>
                         <p>No exercise with id ${id}.</p>`;
        return;
    }

    // -----------------------------------------------------------------
    // 4️⃣  Dispatch to the appropriate renderer
    // -----------------------------------------------------------------
    // Dictionary‑type exercises have a custom UI.
    if (meta.details && meta.details.type === 'dictionary') {
        await initDictionaryPage(lang, id);
        return;
    }

    // Generic detail view – inject a container and let renderExerciseDetail handle it.
    const detailContainer = document.createElement('section');
    detailContainer.id = 'detail';
    detailContainer.className = 'detail-section hidden';
    mainEl.appendChild(detailContainer);
    await renderExerciseDetail(detailContainer, id, lang);
}

/* -----------------------------------------------------------------
   SETTINGS PAGE – static header + static nav + settings UI inside <main>
   ----------------------------------------------------------------- */
/*
   export async function settingsHandler({ lang } = {}) {
    // Persist language and set correct text direction.
    if (lang !== getStoredLang()) await setStoredLang(lang);
    applyDirection(lang);

    // Build the static page skeleton (toolbar + language selector) and get <main>.
    const main = await renderHeader(lang);

    // Ensure the main area is empty before we inject our UI.
    clearPage();

    // Render the Settings panel inside the <main> element.
    renderSettingsPanel(main);
}
*/

// Minimal help handler (already uses renderHeader)
export async function helpHandler({ lang } = {}) {
    if (lang !== getStoredLang()) await setStoredLang(lang);
    applyDirection(lang);
    const main = await renderHeader(lang);   // renders toolbar + selectors
    // clear any previous content
    const mainEl = document.getElementById('main');
    mainEl.innerHTML = '';
    // render the help UI (the function exported from helpPanel.js)
    renderHelp(mainEl);                 // <-- import renderHelp from '../ui/help.js'
}

/* -----------------------------------------------------------------
   404 – page not found
   ----------------------------------------------------------------- */
export async function notFoundHandler({ search = '', hash = '' } = {}) {
    // Build the skeleton (toolbar + static nav) and get <main>.
    const main = await renderHeader(getStoredLang());
    clearPage();
    const mainEl = document.getElementById('main');
    const attempted = `${location.pathname}${search}${hash}`;
    mainEl.innerHTML = `<h2>🚫 Not found</h2>
                       <p>The page <code>${attempted}</code> does not exist.</p>
                       <p>Use the menu above to navigate.</p>`;
}