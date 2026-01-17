// ---------------------------------------------------------------
// app/ui/routes.js
// ---------------------------------------------------------------
// Central place for every route‑handler used by the SPA.
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
import { renderMenu } from "./menu.js";
import { renderDictionaryExercise } from "./dictionaryExercise.js";

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

    // **Important:** make sure the <main> is empty before we render anything else.
    // This guarantees that no leftover dictionary UI sticks around.
    const main = document.getElementById("main");
    if (main) main.innerHTML = "";

    // Render the dynamic UI (practice panel + books panel)
    await renderMenu(mainEl, lang);   // default shows “Practice languages”
}

/* -----------------------------------------------------------------
   2️⃣  Exercises list – behaves exactly like Home (renders menu)
   ----------------------------------------------------------------- */
export async function exercisesHandler({ lang } = {}) {
    if (lang !== getStoredLang()) await setStoredLang(lang);
    applyDirection(lang);
    const mainEl = await renderHeader(lang);
    const main = document.getElementById("main");
    if (main) main.innerHTML = "";
    await renderMenu(mainEl, lang, false);   // hide “Practice languages” on the home page
}

/* -----------------------------------------------------------------
   3️⃣  Single exercise detail – dictionary or generic detail
   ----------------------------------------------------------------- */
export async function exerciseDetailHandler({ lang, id } = {}) {
    if (lang !== getStoredLang()) await setStoredLang(lang);
    applyDirection(lang);
    const mainEl = await renderHeader(lang);
    const main = document.getElementById("main");
    if (!main) return;

    // Ensure the <main> starts clean – we don’t want any stray UI.
    main.innerHTML = "";

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

    // -------------------------------------------------------------
    // Dictionary‑type exercises have a custom UI.
    // -------------------------------------------------------------
    if (meta.details && meta.details.type === "dictionary") {
        // Ensure the voice for the exercise language exists.
        const exerciseLang = meta.language || lang;
        const { ensureVoiceForExercise } = await import("../utils/voiceHelper.js");
        await ensureVoiceForExercise(exerciseLang, lang, true);

        // Directly render the dictionary UI inside the <main>.
        await renderDictionaryExercise(main, meta, lang);
        return;
    }

    // -------------------------------------------------------------
    // Generic detail view – inject a container and let renderExerciseDetail handle it.
    // -------------------------------------------------------------
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
    // Defensive sanity check – if any param is missing, fall back home
    if (!lang || !pubId || !pubLang) {
        console.warn("[booksHandler] missing parameters – redirecting home");
        window.router.navigate(`/${getStoredLang()}/`, true);
        return;
    }

    // Normalise language (fallback if needed)
    if (!SUPPORTED_LANGS.includes(lang)) lang = FALLBACK_LANG;
    if (lang !== getStoredLang()) await setStoredLang(lang);
    applyDirection(lang);

    // Build the page skeleton (toolbar + static nav) and render the panel
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

/* -----------------------------------------------------------------
   7️⃣  Test‑yourself (multiple‑choice) page
   ----------------------------------------------------------------- 
export async function testExerciseHandler({ lang, id } = {}) {
    if (!lang) lang = getStoredLang();
    if (lang !== getStoredLang()) await setStoredLang(lang);
    applyDirection(lang);
    const mainEl = await renderHeader(lang);
    const { initMultipleChoicePage } = await import('./multipleChoiceExercise.js');
    await initMultipleChoicePage(lang, id);
}
*/
export async function testExerciseHandler({ lang, id } = {}) {
    // 1️⃣ Normalise language, persist it and set direction
    if (!lang) lang = getStoredLang();
    if (lang !== getStoredLang()) await setStoredLang(lang);
    applyDirection(lang);

    // 2️⃣ Ensure the global EXERCISES array is populated
    const { EXERCISES } = await import("../data/exercises.js");
    if (!EXERCISES.length) {
        try {
            const data = await loadJSON("/app/data/exercises.json");
            EXERCISES.push(...data);
        } catch (e) {
            console.warn("⚠️ Could not load exercises catalogue", e);
            const main = document.getElementById("main");
            if (main) main.innerHTML = `<p>⚠️ Could not load exercises.</p>`;
            return;
        }
    }

    // 3️⃣ Find the requested exercise meta
    const meta = EXERCISES.find(e => e.id === id);
    if (!meta) {
        const main = document.getElementById("main");
        if (main) main.innerHTML = `<p>⚠️ Exercise ${id} not found.</p>`;
        return;
    }

    // 4️⃣ Render the Multiple‑Choice page
    const mainEl = await renderHeader(lang);
    const { initMultipleChoicePage } = await import('./multipleChoiceExercise.js');
    await initMultipleChoicePage(lang, id);
}

/* -----------------------------------------------------------------
   Export the handlers so the router can import them.
   ----------------------------------------------------------------- */
// (All handlers are already exported individually above)