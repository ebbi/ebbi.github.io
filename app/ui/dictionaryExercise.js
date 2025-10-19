// ---------------------------------------------------------------
// app/ui/dictionaryExercise.js
// ---------------------------------------------------------------
// Render a “dictionary”‑type exercise (exercise id = "01").
// ---------------------------------------------------------------

import { speakText } from "../utils/speech.js";
import { loadJSON } from "../utils/fetch.js";
import { renderHeader } from "./renderHeader.js";
import {
    getLocale,
    LANGUAGE_LABELS,
    SUPPORTED_LANGS
} from "../data/locales.js";
import { populateVoiceList } from "../utils/speech.js";
import { getStoredVoice, setStoredVoice } from "../utils/storage.js";

// NEW – central speech controller
import { createSpeechController } from "../utils/speechController.js";

/* -----------------------------------------------------------------
   GLOBAL UI state – only the arrays that the controller needs.
   ----------------------------------------------------------------- */
let tokenEls = []; // <span class="thai"> elements (order = tokenIdx)
let transEls = []; // 2‑dimensional: transEls[tokenIdx][langIdx] = <span>

/* -----------------------------------------------------------------
   Declare the controller **before** any function that uses it.
   It will be assigned later (after the DOM skeleton exists) but the
   variable must exist so the click‑handler can reference it.
   ----------------------------------------------------------------- */
let speechCtrl;   // will hold the instance returned by createSpeechController

/**
 * Build the HTML for a single token column.
 *
 * @param {string} thaiWord          – the Thai token
 * @param {Array<string>} translations – parallel array of translations
 * @returns {HTMLElement} the column <div>
 */
function buildTokenColumn(thaiWord, translations) {
    const col = document.createElement("div");
    col.className = "token-col";
    col.style.display = "flex";
    col.style.flexDirection = "column";
    col.style.alignItems = "center";
    col.style.margin = "0 0.5rem";

    // ------------------- Thai token (big & bold) -------------------
    const thaiSpan = document.createElement("span");
    thaiSpan.className = "thai";
    thaiSpan.textContent = thaiWord;
    thaiSpan.style.fontWeight = "bold";
    thaiSpan.style.fontSize = "1.2rem";
    thaiSpan.style.marginBottom = "0.4rem";
    col.appendChild(thaiSpan);

    // keep a reference for the controller
    tokenEls.push(thaiSpan);

    // ------------------- Translations -----------------------------
    translations.forEach((t) => {
        const transSpan = document.createElement("span");
        transSpan.className = "trans";
        transSpan.textContent = t || ""; // empty strings are fine
        transSpan.style.fontSize = "0.9rem";
        transSpan.style.color = "var(--txt-secondary)";
        col.appendChild(transSpan);

        // store in the 2‑D matrix
        const tokenIdx = tokenEls.length - 1;
        if (!transEls[tokenIdx]) transEls[tokenIdx] = [];
        transEls[tokenIdx].push(transSpan);
    });

    // ------------------- Click handling (jump & play) ------------
    const clickHandler = (ev) => {
        const tokenIndex = tokenEls.indexOf(thaiSpan);
        if (tokenIndex === -1) return;

        const isThai = ev.target.classList.contains("thai");
        const transIndex = isThai
            ? -1
            : Array.from(col.children).indexOf(ev.target) - 1; // -1 because first child is Thai

        // Tell the controller where we want to start from
        // (the controller already knows the latest tokenEls / transEls)
        if (speechCtrl) {
            speechCtrl.startFrom(tokenIndex, transIndex);
        }
    };

    // Attach the click handler to both the Thai token and every translation span
    thaiSpan.addEventListener("click", clickHandler);
    col.querySelectorAll(".trans").forEach((tr) =>
        tr.addEventListener("click", clickHandler)
    );

    return col;
}

/* -----------------------------------------------------------------
   Main entry – render the dictionary exercise inside the provided <main>.
   ----------------------------------------------------------------- */
export async function renderDictionaryExercise(mainEl, exerciseMeta, uiLang) {
    // -----------------------------------------------------------------
    // 1️⃣ Load the JSON payload for the exercise
    // -----------------------------------------------------------------
    const jsonPath = `/app/${exerciseMeta.folder}/${exerciseMeta.file}`;
    const data = await loadJSON(jsonPath); // data is an array of objects

    // -----------------------------------------------------------------
    // 2️⃣ Prepare the token grid (will be rebuilt on every checkbox change)
    // -----------------------------------------------------------------
    const tokenGrid = document.createElement("div");
    tokenGrid.className = "dict-grid";
    tokenGrid.style.display = "flex";
    tokenGrid.style.flexWrap = "wrap";
    tokenGrid.style.justifyContent = "center";
    tokenGrid.style.gap = "1rem";
    tokenGrid.style.padding = "1rem";

    tokenGrid.style.height = "70vh";
    tokenGrid.style.overflowY = "auto";

    // -----------------------------------------------------------------
    // 3️⃣ Internationalised UI strings
    // -----------------------------------------------------------------
    const locale = getLocale(uiLang);
    const languageKeys = Object.keys(data[0]).filter(
        (k) => k !== "id" && k !== "tokens"
    );

    // -----------------------------------------------------------------
    // 4️⃣ State objects – which languages are displayed / spoken
    // -----------------------------------------------------------------
    const displayState = {}; // languageCode -> boolean
    const speakState = {};   // languageCode -> boolean

    // Initialise all languages as NOT displayed / NOT spoken,
    // except the currently selected app language (uiLang) which is
    // selected for both Display and Speak by default.
    languageKeys.forEach((l) => {
        const isAppLang = l === uiLang;
        displayState[l] = isAppLang;
        speakState[l] = isAppLang;
    });

    // -----------------------------------------------------------------
    // 5️⃣ Helper that rebuilds the token grid based on current states
    // -----------------------------------------------------------------
    function rebuildTokenGrid() {
        // Reset the highlight‑state arrays each time we rebuild
        tokenEls = [];
        transEls = [];

        tokenGrid.innerHTML = "";

        data.forEach((entry) => {
            const thaiTokens = entry.tokens || [];

            thaiTokens.forEach((thaiWord, idx) => {
                // Build a translation array that respects the displayState
                const translations = languageKeys.map((l) => {
                    if (!displayState[l]) return "";
                    const arr = entry[l] || [];
                    return arr[idx] || "";
                });
                const col = buildTokenColumn(thaiWord, translations);
                tokenGrid.appendChild(col);
            });
        });

        // Keep the speech controller in sync after every rebuild
        if (speechCtrl) speechCtrl.updateElements(tokenEls, transEls);
    }

    // -----------------------------------------------------------------
    // 6️⃣ Build the language‑options UI inside a <details> element
    // -----------------------------------------------------------------
    const details = document.createElement("details");
    details.open = true;
    details.style.margin = "0.5rem 1rem";

    // ---- Summary (title) ----
    const summary = document.createElement("summary");
    summary.textContent = locale.languageOptions || "Language options";
    details.appendChild(summary);

    // ---- Grid for language options (3 columns) ----
    const optionsGrid = document.createElement("div");
    optionsGrid.style.display = "grid";
    optionsGrid.style.gridTemplateColumns = "6fr 2fr 2fr";
    optionsGrid.style.gap = "0.5rem";
    optionsGrid.style.alignItems = "center";
    details.appendChild(optionsGrid);

    // ---- Header row (empty, "Display", "Speak") ----
    const emptyHeader = document.createElement("div");
    const displayHeader = document.createElement("div");
    const speakHeader = document.createElement("div");

    displayHeader.textContent = locale.display ?? "Display";
    speakHeader.textContent = locale.speak ?? "Speak";

    displayHeader.style.textAlign = "center";
    speakHeader.style.textAlign = "center";

    optionsGrid.appendChild(emptyHeader);
    optionsGrid.appendChild(displayHeader);
    optionsGrid.appendChild(speakHeader);

    // ---- One row per language ----
    languageKeys.forEach((langCode) => {
        const langLabel = LANGUAGE_LABELS[langCode] || langCode.toUpperCase();

        // Language name cell
        const langCell = document.createElement("div");
        langCell.textContent = langLabel;
        optionsGrid.appendChild(langCell);

        // Display checkbox cell
        const displayCell = document.createElement("div");
        const displayCb = document.createElement("input");
        displayCb.type = "checkbox";
        displayCb.dataset.lang = langCode;
        displayCb.checked = !!displayState[langCode];
        displayCell.style.textAlign = "center";
        displayCell.appendChild(displayCb);
        optionsGrid.appendChild(displayCell);

        // Speak checkbox cell
        const speakCell = document.createElement("div");
        const speakCb = document.createElement("input");
        speakCb.type = "checkbox";
        speakCb.dataset.lang = langCode;
        speakCb.checked = !!speakState[langCode];
        speakCell.style.textAlign = "center";
        speakCell.appendChild(speakCb);
        optionsGrid.appendChild(speakCell);

        // -----------------------------------------------------------------
        // Interaction rules
        // -----------------------------------------------------------------
        // If Speak is checked → force Display checked
        speakCb.addEventListener("change", () => {
            if (speakCb.checked) {
                displayCb.checked = true;
                displayState[langCode] = true;
            }
            speakState[langCode] = speakCb.checked;
            rebuildTokenGrid();
        });

        // If Display is unchecked → also uncheck Speak
        displayCb.addEventListener("change", () => {
            if (!displayCb.checked) {
                speakCb.checked = false;
                speakState[langCode] = false;
            }
            displayState[langCode] = displayCb.checked;
            rebuildTokenGrid();
        });
    });

    // -----------------------------------------------------------------
    // 7️⃣  Insert the speech‑control panel (created by the controller)
    // -----------------------------------------------------------------
    const speechPanel = document.createElement("div");
    speechPanel.id = "speechPanel";
    // Apply the margin you requested (0.5rem 1rem)
    speechPanel.style.margin = "0.5rem 1rem";

    // -----------------------------------------------------------------
    // 8️⃣  Assemble the page: title → token grid → language options → nav
    // -----------------------------------------------------------------
    mainEl.innerHTML = ""; // wipe any previous content

    // Title (internationalized)
    const titleText =
        (exerciseMeta.title && exerciseMeta.title[uiLang]) ||
        exerciseMeta.title?.en ||
        "Dictionary Exercise";
    const heading = document.createElement("h2");
    heading.textContent = titleText;
    heading.style.textAlign = "center";
    heading.style.marginBottom = "1rem";
    mainEl.appendChild(heading);

    // Token grid (initially empty – will be filled after first rebuild)
    mainEl.appendChild(tokenGrid);

    // Language‑options panel (the <details> we built above)
    mainEl.appendChild(details);

    // Speech‑control panel (will be populated by the controller)
    mainEl.appendChild(speechPanel);

    // -----------------------------------------------------------------
    // 9️⃣  Build the speech controller **before** the first rebuild
    // -----------------------------------------------------------------
    speechCtrl = createSpeechController(speechPanel, {
        // Provide the list of languages your app supports
        getAvailableLanguages: () => SUPPORTED_LANGS,

        // Optional callback – you can keep it empty if you don't need extra work
        onVoiceChange: (newVoice) => {
            console.log("[Speech] voice changed →", newVoice);
            // Persist the choice (mirrors utils/storage.js behaviour)
            try {
                localStorage.setItem("local_storage_tts_voice", newVoice);
            } catch (_) { }
        },

        // Give the controller the DOM collections it will highlight.
        // At this moment tokenEls / transEls are still empty; they will be
        // filled after the first call to rebuildTokenGrid().
        tokenElements: tokenEls,
        translationElements: transEls
    });

    // -----------------------------------------------------------------
    // 10️⃣  Initial render of the token grid (reflect default selections)
    // -----------------------------------------------------------------
    rebuildTokenGrid();

    // -----------------------------------------------------------------
    // 11️⃣  No extra work needed – the click‑handler inside
    //       `buildTokenColumn` now calls `speechCtrl.startFrom(...)`.
    // -----------------------------------------------------------------
}

/**
 * Convenience wrapper used by the router.
 *
 * @param {string} lang – UI language (e.g. "en")
 * @param {string} id   – exercise id ("01")
 */
export async function initDictionaryPage(lang, id) {
    // -----------------------------------------------------------------
    // 1️⃣ Pull the exercise metadata from the global EXERCISES array
    // -----------------------------------------------------------------
    const { EXERCISES } = await import("../data/exercises.js");
    const meta = EXERCISES.find(
        (e) => e.id === id && e.details && e.details.type === "dictionary"
    );
    if (!meta) {
        document.body.textContent = `⚠️ Exercise ${id} not found or not a dictionary type.`;
        return;
    }

    // -----------------------------------------------------------------
    // 2️⃣ Render the shared header (toolbar + nav) and obtain <main>
    // -----------------------------------------------------------------
    const mainEl = await renderHeader(lang);

    // -----------------------------------------------------------------
    // 3️⃣ Render the dictionary UI inside that <main>
    // -----------------------------------------------------------------
    await renderDictionaryExercise(mainEl, meta, lang);
}