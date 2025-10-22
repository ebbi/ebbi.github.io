// app/ui/routes.js
// ---------------------------------------------------------------
// Central place for every route‑handler used by the SPA router.
// ---------------------------------------------------------------

import { renderHeader } from "./renderHeader.js";
import { getStoredLang, setStoredLang } from "../utils/storage.js";
import { applyDirection } from "../utils/rtl.js";
import {
    getLocale,
    SUPPORTED_LANGS,
    FALLBACK_LANG
} from "../data/locales.js";
import { loadJSON } from "../utils/fetch.js";
import { renderMenu } from "./menu.js";               // <‑‑ NEW import

/* -----------------------------------------------------------------
   Helper – render a simple 404 page (used by notFoundHandler)
   ----------------------------------------------------------------- */
function renderNotFound(main) {
    const locale = getLocale(getStoredLang());
    main.innerHTML = `<h2>🚫 Not found</h2>
                     <p>The page <code>${location.pathname}</code> does not exist.</p>
                     <p>${locale.help || "Help"}: <a href="/${getStoredLang()}/help">${locale.help || "Help"}</a></p>`;
}

/* -----------------------------------------------------------------
   1️⃣  Home handler – now also renders the menu (practice + books)
   ----------------------------------------------------------------- */
export async function homeHandler({ lang } = {}) {
    // Normalise language, persist it and set direction.
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

    // Build the full page skeleton (toolbar + static nav + empty <main>).
    const mainEl = await renderHeader(lang);

    // ---- NEW: render the dynamic UI (practice panel + books panel) ----
    // `renderMenu` receives the <main> element and the current UI language.
    await renderMenu(mainEl, lang);
}

/* -----------------------------------------------------------------
   2️⃣  Exercises list – behaves exactly like Home (renders menu)
   ----------------------------------------------------------------- */
export async function exercisesHandler({ lang } = {}) {
    if (lang !== getStoredLang()) await setStoredLang(lang);
    applyDirection(lang);
    const mainEl = await renderHeader(lang);

    // ---- NEW: render the same dynamic UI as the home page ----
    await renderMenu(mainEl, lang);
}

/* -----------------------------------------------------------------
   3️⃣  Single exercise detail – unchanged from the original code
   ----------------------------------------------------------------- */
export async function exerciseDetailHandler({ lang, id } = {}) {
    if (lang !== getStoredLang()) await setStoredLang(lang);
    applyDirection(lang);
    const mainEl = await renderHeader(lang);
    const main = document.getElementById("main");
    if (!main) return;

    // Load the global EXERCISES array if it is still empty.
    const { EXERCISES } = await import("../data/exercises.js");
    if (!EXERCISES.length) {
        try {
            const data = await loadJSON("/app/data/exercises.json");
            EXERCISES.push(...data);
        } catch (e) {
            console.warn("⚠️ Could not load exercises catalogue", e);
            renderNotFound(main);
            return;
        }
    }

    const meta = EXERCISES.find(e => e.id === id);
    if (!meta) {
        renderNotFound(main);
        return;
    }

    // Dictionary‑type exercises have a custom UI.
    if (meta.details && meta.details.type === "dictionary") {
        const { initDictionaryPage } = await import("./dictionaryExercise.js");
        await initDictionaryPage(lang, id);
        return;
    }

    // Generic detail view – inject a container and let renderExerciseDetail handle it.
    const detailContainer = document.createElement("section");
    detailContainer.id = "detail";
    detailContainer.className = "detail-section hidden";
    main.appendChild(detailContainer);
    const { renderExerciseDetail } = await import("./detail.js");
    await renderExerciseDetail(detailContainer, id, lang);
}

/* -----------------------------------------------------------------
   4️⃣  Help page – unchanged (still uses renderHelp from helpPanel.js)
   ----------------------------------------------------------------- */
export async function helpHandler({ lang } = {}) {
    if (lang !== getStoredLang()) await setStoredLang(lang);
    applyDirection(lang);
    const mainEl = await renderHeader(lang);
    const main = document.getElementById("main");
    if (!main) return;
    main.innerHTML = "";
    const { renderHelp } = await import("./help.js");
    renderHelp(main);
}

/* -----------------------------------------------------------------
   5️⃣  NEW – Books & Blogs deep‑link handler
   ----------------------------------------------------------------- */
export async function booksHandler({ lang, pubId, pubLang } = {}) {
    // -----------------------------------------------------------------
    // Defensive sanity check – if any param is missing, fall back home
    // -----------------------------------------------------------------
    if (!lang || !pubId || !pubLang) {
        console.warn("[booksHandler] missing parameters – redirecting home");
        window.router.navigate(`/${getStoredLang()}/`, true);
        return;
    }

    // -----------------------------------------------------------------
    // Normalise language (fallback if needed)
    // -----------------------------------------------------------------
    if (!SUPPORTED_LANGS.includes(lang)) lang = FALLBACK_LANG;
    if (lang !== getStoredLang()) await setStoredLang(lang);
    applyDirection(lang);

    // -----------------------------------------------------------------
    // Build the page skeleton (toolbar + static nav) and render the panel
    // -----------------------------------------------------------------
    const mainEl = await renderHeader(lang);
    const main = document.getElementById("main");
    if (!main) return;
    main.innerHTML = ""; // clear any previous dynamic UI

    const { renderBooksPanel } = await import("./booksPanel.js");
    // `pubId` and `pubLang` may be undefined – the panel will handle that.
    renderBooksPanel(mainEl, lang, pubId || null, pubLang || null);
}

/* -----------------------------------------------------------------
   6️⃣ 404 – page not found (fallback)
   ----------------------------------------------------------------- */
export async function notFoundHandler({ search = "", hash = "" } = {}) {
    const mainEl = await renderHeader(getStoredLang());
    const main = document.getElementById("main");
    if (!main) return;
    renderNotFound(main);
}

export async function testExerciseHandler({ lang, id } = {}) {
    if (!lang) lang = getStoredLang();
    if (lang !== getStoredLang()) await setStoredLang(lang);
    applyDirection(lang);
    const mainEl = await renderHeader(lang);
    const { initMultipleChoicePage } = await import('./multipleChoiceExercise.js');
    await initMultipleChoicePage(lang, id);
}

/* -----------------------------------------------------------------
   Export the handlers so the router can import them.
   ----------------------------------------------------------------- */
// (All handlers are already exported individually above)