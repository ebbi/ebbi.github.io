// ---------------------------------------------------------------
// app/ui/dictionaryExercise.js
// ---------------------------------------------------------------
// Render a “dictionary”‑type exercise (exercise id = "01").
// ---------------------------------------------------------------

import { loadJSON } from "../utils/fetch.js";
import { renderHeader } from "./renderHeader.js";
import {
    getLocale,
    LANGUAGE_LABELS,
    SUPPORTED_LANGS
} from "../data/locales.js";
import { createSpeechController } from "../utils/speechController.js";

/* -----------------------------------------------------------------
   GLOBAL UI state – only the arrays that the controller needs.
   ----------------------------------------------------------------- */
let tokenEls = []; // one element per column (the column <div> itself)
let transEls = []; // 2‑dimensional: transEls[colIdx][langIdx] = <span>

/* -----------------------------------------------------------------
   Speech controller instance – created after the first rebuild.
   ----------------------------------------------------------------- */
let speechCtrl;

/**
 * Build a column that holds the translations for ONE source token.
 *
 * `translations` – array of strings (full list, first element = source token)
 * `langs`        – parallel array of language codes
 * `displayMap`   – object: lang → true/false (which languages are currently displayed)
 *
 * The function creates a <div class="token-col"> and appends a <span>
 * **only for the languages whose Display checkbox is ON**.
 *
 * It also registers the column and its spans with the global
 * `tokenEls` / `transEls` matrices (used by the speech controller).
 */
function buildTokenColumn(translations, langs, displayMap) {
    const col = document.createElement("div");
    col.className = "token-col";
    col.style.display = "flex";
    col.style.flexDirection = "column";
    col.style.alignItems = "center";
    col.style.margin = "0 0.5rem";

    // -----------------------------------------------------------------
    // 1️⃣  Create a <span> **only** for languages that are displayed.
    // -----------------------------------------------------------------
    translations.forEach((txt, idx) => {
        const lang = langs[idx];
        if (!displayMap[lang]) return;               // <-- skip hidden languages

        const span = document.createElement("span");
        span.className = "trans";
        span.textContent = txt || "";
        span.style.fontSize = "1rem";
        span.style.color = "var(--txt-secondary)";
        span.setAttribute("lang", lang);

        // Append the visible span to the column.
        col.appendChild(span);

        // Keep a reference for the speech controller.
        const colIdx = tokenEls.length;               // one column == one token
        if (!transEls[colIdx]) transEls[colIdx] = [];
        transEls[colIdx].push(span);
    });

    // -----------------------------------------------------------------
    // 2️⃣  Store the column itself in tokenEls (controller uses the index).
    // -----------------------------------------------------------------
    tokenEls.push(col);

    // -----------------------------------------------------------------
    // 3️⃣  Click handling – start playback from this column / span.
    // -----------------------------------------------------------------
    const clickHandler = (ev) => {
        const tokenIdx = tokenEls.indexOf(col);
        if (tokenIdx === -1) return;

        // The child order matches the translation order (only visible ones).
        const transIdx = Array.from(col.children).indexOf(ev.target);
        if (speechCtrl) speechCtrl.startFrom(tokenIdx, transIdx);
    };

    // Delegate clicks from the column – any `.trans` child will fire.
    col.addEventListener("click", (ev) => {
        if (ev.target.classList.contains("trans")) clickHandler(ev);
    });

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
    const data = await loadJSON(jsonPath); // array of objects

    // -----------------------------------------------------------------
    // 2️⃣ Determine the real language of the exercise (source language)
    // -----------------------------------------------------------------
    const exerciseLang = exerciseMeta.language || uiLang;

    // -----------------------------------------------------------------
    // 3️⃣ Prepare the token grid (will be rebuilt on every checkbox change)
    // -----------------------------------------------------------------
    const tokenGrid = document.createElement("div");
    tokenGrid.className = "dict-grid";
    tokenGrid.style.display = "flex";
    tokenGrid.style.flexWrap = "wrap";
    tokenGrid.style.justifyContent = "flex-start"; // left‑align rows (no centering gaps)
    tokenGrid.style.gap = "1rem";
    tokenGrid.style.padding = "1rem";
    //   tokenGrid.style.height = "70vh";
    tokenGrid.style.overflowY = "auto";

    // -----------------------------------------------------------------
    // 4️⃣ Internationalised UI strings
    // -----------------------------------------------------------------
    const locale = getLocale(uiLang);

    // -----------------------------------------------------------------
    // 5️⃣ Derive the list of language columns from the JSON.
    // -----------------------------------------------------------------
    const rawLangKeys = Object.keys(data[0]).filter(
        (k) => k !== "id" && k !== "category" && k !== "tokens"
    );

    // -----------------------------------------------------------------
    // 6️⃣ Put the source language first, then the rest.
    // -----------------------------------------------------------------
    const orderedLangs = [
        exerciseLang,
        ...rawLangKeys.filter(l => l !== exerciseLang)
    ];

    // -----------------------------------------------------------------
    // 7️⃣ Build the Language‑options panel (Display / Speak check‑boxes)
    // -----------------------------------------------------------------
    const details = document.createElement("details");
    details.open = true;
    details.style.margin = "0.5rem 1rem";

    const summary = document.createElement("summary");
    summary.textContent = locale.languageOptions || "Language options";
    details.appendChild(summary);

    const optionsGrid = document.createElement("div");
    optionsGrid.style.display = "grid";
    optionsGrid.style.gridTemplateColumns = "6fr 2fr 2fr";
    optionsGrid.style.gap = "0.5rem";
    optionsGrid.style.alignItems = "center";
    details.appendChild(optionsGrid);

    // Header row
    const emptyHeader = document.createElement("div");
    const displayHeader = document.createElement("h5");
    const speakHeader = document.createElement("h5");
    displayHeader.textContent = locale.display ?? "Display";
    speakHeader.textContent = locale.speak ?? "Speak";
    displayHeader.style.textAlign = "center";
    speakHeader.style.textAlign = "center";
    optionsGrid.appendChild(emptyHeader);
    optionsGrid.appendChild(displayHeader);
    optionsGrid.appendChild(speakHeader);

    // Maps for the check‑boxes
    const displayBoxes = new Map(); // lang → <input type="checkbox">
    const speakBoxes = new Map();

    orderedLangs.forEach(langCode => {
        const langLabel = LANGUAGE_LABELS[langCode] || langCode.toUpperCase();

        // Language name cell
        const langCell = document.createElement("span");
        langCell.textContent = langLabel;
        optionsGrid.appendChild(langCell);

        // Display checkbox
        const displayCell = document.createElement("span");
        const displayCb = document.createElement("input");
        displayCb.type = "checkbox";
        displayCb.dataset.lang = langCode;
        // Source language is checked by default
        displayCb.checked = (langCode === exerciseLang);
        displayCell.style.textAlign = "center";
        displayCell.appendChild(displayCb);
        optionsGrid.appendChild(displayCell);
        displayBoxes.set(langCode, displayCb);

        // Speak checkbox
        const speakCell = document.createElement("span");
        const speakCb = document.createElement("input");
        speakCb.type = "checkbox";
        speakCb.dataset.lang = langCode;
        speakCb.checked = (langCode === exerciseLang);
        speakCell.style.textAlign = "center";
        speakCell.appendChild(speakCb);
        optionsGrid.appendChild(speakCell);
        speakBoxes.set(langCode, speakCb);

        // Interaction rules
        speakCb.addEventListener("change", () => {
            if (speakCb.checked) displayCb.checked = true;
            rebuildTokenGrid();
        });
        displayCb.addEventListener("change", () => {
            if (!displayCb.checked) speakCb.checked = false;
            rebuildTokenGrid();
        });
    });

    // -----------------------------------------------------------------
    // 8️⃣ Create the speech‑control panel (will be placed inside <details>)
    // -----------------------------------------------------------------
    const speechPanel = document.createElement("div");
    speechPanel.id = "speechPanel";
    // Horizontal layout, always visible
    speechPanel.style.display = "flex";
    speechPanel.style.alignItems = "center";
    speechPanel.style.gap = "0.5rem";
    speechPanel.style.margin = "0.5rem 1rem";

    /**
     * Re‑build the token grid whenever a Display / Speak checkbox changes.
     *
     * The algorithm now also inserts a small “category” heading above the
     * columns that belong to each JSON entry.
     */
    function rebuildTokenGrid() {
        // -------------------------------------------------------------
        // 0️⃣ Reset global collections and clear the visual grid.
        // -------------------------------------------------------------
        tokenEls = [];
        transEls = [];
        tokenGrid.innerHTML = "";

        // -------------------------------------------------------------
        // 1️⃣ Build lookup maps from the check‑boxes.
        // -------------------------------------------------------------
        const displayMap = {}; // lang → true/false (Display)
        const speakMap = {}; // lang → true/false (Speak)

        orderedLangs.forEach(l => {
            const dCb = displayBoxes.get(l);
            const sCb = speakBoxes.get(l);
            displayMap[l] = dCb ? dCb.checked : false;
            speakMap[l] = sCb ? sCb.checked : false;
        });

        // -------------------------------------------------------------
        // 2️⃣ Walk through the JSON data and create a column for each token.
        // -------------------------------------------------------------
        data.forEach(entry => {
            // -----------------------------------------------------------------
            // 2a️⃣  Insert the category heading (once per entry)
            // -----------------------------------------------------------------
            if (entry.category) {
                const catDiv = document.createElement("h5");
                catDiv.className = "category-header";
                // You can style this class in your existing CSS if you wish.
                catDiv.textContent = entry.category;
                catDiv.style.flex = "0 0 100%";
                tokenGrid.appendChild(catDiv);
            }

            // -----------------------------------------------------------------
            // 2b️⃣  Use the first language in orderedLangs as the deterministic source.
            // -----------------------------------------------------------------
            const sourceTokens = entry[orderedLangs[0]] || [];

            sourceTokens.forEach((srcWord, idx) => {
                // ---------------------------------------------------------
                // Build parallel arrays that contain ONLY the displayed languages.
                // ---------------------------------------------------------
                const translations = [];
                const langs = [];

                orderedLangs.forEach(lang => {
                    if (!displayMap[lang]) return; // skip hidden languages

                    const arr = entry[lang] || [];
                    translations.push(arr[idx] ?? ""); // fallback to empty string
                    langs.push(lang);
                });

                // Safety fallback – the source language is always shown.
                if (translations.length === 0) {
                    const srcArr = entry[orderedLangs[0]] || [];
                    translations.push(srcArr[idx] ?? "");
                    langs.push(orderedLangs[0]);
                }

                // ---------------------------------------------------------
                // 3️⃣ Create the column (only visible spans are added).
                // ---------------------------------------------------------
                const col = buildTokenColumn(translations, langs, displayMap);
                tokenGrid.appendChild(col);
            });
        });

        // -------------------------------------------------------------
        // 4️⃣ Tell the speech controller about the new elements AND the
        //    current Speak‑checkbox state.
        // -------------------------------------------------------------
        if (speechCtrl) {
            speechCtrl.updateElements(tokenEls, transEls);
            speechCtrl.updateSpeakMap(speakMap);   // keep Play in sync with Speak boxes
        }
    }

    // -----------------------------------------------------------------
    // 10️⃣ Assemble the page: title → token grid → language options →
    //      speech‑control panel (inside the <details> panel)
    // -----------------------------------------------------------------
    mainEl.innerHTML = ""; // clear any previous content

    const titleText =
        (exerciseMeta.title && exerciseMeta.title[uiLang]) ||
        exerciseMeta.title?.en ||
        "Dictionary Exercise";

    const heading = document.createElement("h4");
    heading.textContent = titleText;
    heading.style.textAlign = "center";
    // heading.style.marginBottom = "1rem";

    // Order matters: heading → token grid → language‑options panel (with speech panel inside)
    mainEl.appendChild(heading);
    mainEl.appendChild(tokenGrid);
    mainEl.appendChild(details);          // language‑options panel

    // Insert the speech‑control panel at the **bottom** of the <details> panel
    details.appendChild(speechPanel);

    // -----------------------------------------------------------------
    // 11️⃣ Build the speech controller **before** the first rebuild.
    // -----------------------------------------------------------------
    speechCtrl = createSpeechController(speechPanel, {
        getAvailableLanguages: () => SUPPORTED_LANGS,
        defaultLang: uiLang,
        onVoiceChange: (newVoice) => {
            console.log("[Speech] voice changed →", newVoice);
            try {
                localStorage.setItem("local_storage_tts_voice", newVoice);
            } catch (_) { }
        },
        tokenElements: tokenEls,
        translationElements: transEls
    });

    // -----------------------------------------------------------------
    // 12️⃣ Initial render
    // -----------------------------------------------------------------
    rebuildTokenGrid();
}

/**
 * Wrapper used by the router.
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