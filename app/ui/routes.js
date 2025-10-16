// ---------------------------------------------------------------
// app/ui/routes.js
// ---------------------------------------------------------------

// ────── existing imports ───────────────────────────────────────
import { renderToolbar } from './toolbar.js';
import { renderSettingsPanel } from './settingsPanel.js';
import { renderMenu } from './menu.js';
import { renderExerciseDetail } from './detail.js';
import { initDictionaryPage } from './dictionaryExercise.js';
import { getOSInstructionKey } from '../utils/osDetection.js';
import { getLocale, SUPPORTED_LANGS, FALLBACK_LANG } from '../data/locales.js';
import { setStoredLang, getStoredLang } from '../utils/storage.js';
import { applyDirection } from '../utils/rtl.js';
import { loadJSON } from '../utils/fetch.js';   // ← NEW import – needed for deep‑link loading
import { renderHeader } from './renderHeader.js';   // <-- added import
// 
// -----------------------------------------------------------------

/* -----------------------------------------------------------------
   HOME – fresh list of exercises
   ----------------------------------------------------------------- */
/* -----------------------------------------------------------------
   Helper – create the page skeleton (header + static nav + empty main)
   ----------------------------------------------------------------- */
async function renderAppSkeleton() {
    // Build the skeleton only once; later calls reuse the existing DOM.
    if (!document.getElementById('toolbarContainer')) {
        document.body.innerHTML = `
            <header id="toolbarContainer"></header>
            <nav class="menu-nav"></nav>
            <main id="main" class="main"></main>
        `;
        // The toolbar lives inside the header.
        renderToolbar(document.getElementById('toolbarContainer'));
    }
}

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

    await renderAppSkeleton();
    clearPage();                     // ensure a clean slate
    await renderMenu(document.getElementById('main'), lang);
}

/* -----------------------------------------------------------------
   EXERCISES LIST – behaves exactly like Home
   ----------------------------------------------------------------- */
export async function exercisesHandler({ lang } = {}) {
    if (lang !== getStoredLang()) await setStoredLang(lang);
    applyDirection(lang);
    await renderAppSkeleton();
    clearPage();
    await renderMenu(document.getElementById('main'), lang);
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
    // 1️⃣  Ensure the page skeleton exists (toolbar, nav, empty <main>)
    // -----------------------------------------------------------------
    await renderAppSkeleton();
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
    document.getElementById('main').appendChild(detailContainer);
    await renderExerciseDetail(detailContainer, id, lang);
}

/* -----------------------------------------------------------------
   SETTINGS PAGE – static header + static nav + settings UI inside <main>
   ----------------------------------------------------------------- */
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

/* -----------------------------------------------------------------
   404 – page not found
   ----------------------------------------------------------------- */
export async function notFoundHandler({ search = '', hash = '' } = {}) {
    await renderAppSkeleton();
    clearPage();
    const main = document.getElementById('main');
    const attempted = `${location.pathname}${search}${hash}`;
    main.innerHTML = `<h2>🚫 Not found</h2>
                      <p>The page <code>${attempted}</code> does not exist.</p>
                      <p>Use the menu above to navigate.</p>`;
}

