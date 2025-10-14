// app/ui/routes.js
import { renderToolbar } from './toolbar.js';
import { renderSettingsPanel } from './settingsPanel.js';
import { renderMenu } from './menu.js';
import { renderExerciseDetail } from './detail.js';

import { getLocale, SUPPORTED_LANGS, FALLBACK_LANG } from '../data/locales.js';
import { setStoredLang, getStoredLang } from '../utils/storage.js';

import { applyFontFamily } from './fontHelper.js';
import { getStoredFont } from '../utils/storage.js';
import { showModal } from './modal.js';
import { getOSInstructionKey } from '../utils/osDetection.js';

import { isRtlLang } from '../utils/rtl.js';
import { applyDirection } from '../utils/rtl.js';   // ← NEW import

/* -----------------------------------------------------------------
   Helper – common page skeleton (toolbar + empty <main>)
   ----------------------------------------------------------------- */
async function renderAppSkeleton() {
    // The toolbar header is already present in the DOM (created by bootstrap.js),
    // so we only need to ensure the <main> container exists.
    document.body.innerHTML = `
        <header id="toolbar" class="toolbar"></header>
        <main id="main" class="main"></main>
    `;

    // Render the toolbar into the *existing* header element.
    renderToolbar(document.getElementById('toolbar'));
}

/* -----------------------------------------------------------------
   HOME – just the menu (no extra UI)
   ----------------------------------------------------------------- */
export async function homeHandler({ lang } = {}) {
    // If the URL omitted the language, redirect to stored/default language
    if (!lang) {
        router.navigate(`/${getStoredLang()}/`, true);
        return;
    }

    // Validate language
    if (!SUPPORTED_LANGS.includes(lang)) {
        router.navigate(`/${FALLBACK_LANG}/`, true);
        return;
    }

    // Persist language change and apply direction
    if (lang !== getStoredLang()) await setStoredLang(lang);
    applyDirection(lang);                     // ← NEW line

    await renderAppSkeleton();
    await renderMenu(document.getElementById('main'), lang);
}

/* -----------------------------------------------------------------
   EXERCISES LIST (same UI as home, but you could add a heading)
   ----------------------------------------------------------------- */
export async function exercisesHandler({ lang } = {}) {
    if (lang !== getStoredLang()) await setStoredLang(lang);
    applyDirection(lang);                     // ← NEW line
    await renderAppSkeleton();
    await renderMenu(document.getElementById('main'), lang);
}

/* -----------------------------------------------------------------
   SINGLE EXERCISE DETAIL
   ----------------------------------------------------------------- */
export async function exerciseDetailHandler({ lang, id } = {}) {
    if (lang !== getStoredLang()) await setStoredLang(lang);
    applyDirection(lang);                     // ← NEW line
    await renderAppSkeleton();

    const detailContainer = document.createElement('section');
    detailContainer.id = 'detail';
    detailContainer.className = 'detail-section hidden';
    document.getElementById('main').appendChild(detailContainer);

    await renderExerciseDetail(detailContainer, id, lang);
}

/* -----------------------------------------------------------------
   SETTINGS PAGE (currently just a placeholder)
   ----------------------------------------------------------------- */
export async function settingsHandler({ lang } = {}) {
    if (lang !== getStoredLang()) await setStoredLang(lang);
    applyDirection(lang);
    await renderAppSkeleton();

    // Insert the Settings panel (the Speech‑Setup details) now that the
    // skeleton is ready.
    renderSettingsPanel(document.getElementById('toolbar'));

    const main = document.getElementById('main');
    main.innerHTML = `<h2>⚙️ Settings (${lang})</h2><p>TODO – add more preferences here.</p>`;
}

/* -----------------------------------------------------------------
   404 – page not found
   ----------------------------------------------------------------- */
export async function notFoundHandler({ search = '', hash = '' } = {}) {
    await renderAppSkeleton();

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
    const osKey = await getOSInstructionKey();          // ← async now!
    const locale = getLocale(getStoredLang()).content;

    const headline = locale.installMessage || 'You need to install the languages you are learning.';
    const steps = locale[osKey] || locale.installSteps || 'Refer to your OS documentation.';

    // Convert <br> tags to real line breaks for the <pre> element
    const formatted = steps.replace(/<br\s*\/?>/gi, '\n');

    const bodyHTML = `<pre class="answer">${formatted}</pre>`;
    showModal(headline, bodyHTML);
}
