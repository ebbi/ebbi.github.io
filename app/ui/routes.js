// app/ui/routes.js
import { renderToolbar } from './toolbar.js';
import { renderSettingsPanel } from './settingsPanel.js';
import { renderMenu } from './menu.js';
import { renderExerciseDetail } from './detail.js';
import { initDictionaryPage } from './dictionaryExercise.js';
import { getOSInstructionKey } from '../utils/osDetection.js';
import { renderHeader } from '/app/ui/renderHeader.js';   // absolute‑from‑root (optional)

import { getLocale, SUPPORTED_LANGS, FALLBACK_LANG } from '../data/locales.js';
import { setStoredLang, getStoredLang } from '../utils/storage.js';
import { applyDirection } from '../utils/rtl.js';
import { showModal } from './modal.js';

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
        // use the global router instance
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
    if (lang !== getStoredLang()) await setStoredLang(lang);
    applyDirection(lang);
    await renderAppSkeleton();
    clearPage();

    const { EXERCISES } = await import('../data/exercises.js');
    const meta = EXERCISES.find(e => e.id === id);
    if (!meta) {
        const main = document.getElementById('main');
        main.innerHTML = `<h2>🚫 Not found</h2><p>No exercise with id ${id}.</p>`;
        return;
    }

    // Dictionary‑type exercises have a custom renderer.
    if (meta.details && meta.details.type === 'dictionary') {
        await initDictionaryPage(lang, id);
        return;
    }

    // Generic detail view – inject into <main>.
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
    if (lang !== getStoredLang()) await setStoredLang(lang);
    applyDirection(lang);
    await renderAppSkeleton();
    clearPage();                     // wipe any leftover dynamic UI

    // At this point the DOM already contains:
    //   <header id="toolbarContainer">…</header>
    //   <nav class="menu-nav">…</nav>   (static selectors only)
    //   <main id="main" class="main"></main>

    // 1️⃣ Render the Settings panel **inside** <main>.
    const main = document.getElementById('main');
    renderSettingsPanel(main);   // panel is appended to <main>

    // 2️⃣ Inject any additional settings‑specific markup into <main>.
    const extra = document.createElement('section');
    extra.innerHTML = `<h2>⚙️ Settings (${lang})</h2>
                       <p>TODO – add more preferences here.</p>`;
    main.appendChild(extra);
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

/* -----------------------------------------------------------------
   OPTIONAL: Show the OS‑install‑steps modal (called from voice‑list code)
   ----------------------------------------------------------------- */
export async function showInstallModal() {
    const osKey = await getOSInstructionKey();   // async now!
    const locale = getLocale(getStoredLang()).content;

    const headline = locale.installMessage ||
        'You need to install the languages you are learning.';
    const steps = locale[osKey] || locale.installSteps ||
        'Refer to your OS documentation.';

    const formatted = steps.replace(/<br\s*\/?>/gi, '\n');
    const bodyHTML = `<pre class="answer">${formatted}</pre>`;
    showModal(headline, bodyHTML);
}