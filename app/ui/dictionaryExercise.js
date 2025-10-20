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
 * `translations` – array of strings, **first element is the source token**
 * `langs`        – parallel array of language codes (e.g. ["th","en","zh"])
 *
 * The function:
 *   • creates a <div class="token-col">
 *   • creates a <span class="trans"> for **every** translation
 *   • registers the column and its spans with the global tokenEls /
 *     transEls structures (used by the speech controller)
 *   • wires a click handler that starts playback from this column /
 *     the clicked translation.
 *
 * **Important:** No span is appended here – the caller (`rebuildTokenGrid`)
 * will decide which spans should be visible based on the Display check‑boxes.
 */
function buildTokenColumn(translations, langs) {
    const col = document.createElement("div");
    col.className = "token-col";
    col.style.display = "flex";
    col.style.flexDirection = "column";
    col.style.alignItems = "center";
    col.style.margin = "0 0.5rem";

    // -----------------------------------------------------------------
    // 1️⃣  Create a <span> for every translation and remember it.
    // -----------------------------------------------------------------
    translations.forEach((txt, idx) => {
        const span = document.createElement("span");
        span.className = "trans";
        span.textContent = txt || "";
        span.style.fontSize = "0.9rem";
        span.style.color = "var(--txt-secondary)";

        const langCode = langs[idx];
        if (langCode) span.setAttribute("lang", langCode);

        // Keep a reference for the speech controller.
        const colIdx = tokenEls.length; // one column == one token
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

        // The child order matches the translation order.
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
    tokenGrid.style.justifyContent = "center";
    tokenGrid.style.gap = "1rem";
    tokenGrid.style.padding = "1rem";
    tokenGrid.style.height = "70vh";
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
    const displayHeader = document.createElement("div");
    const speakHeader = document.createElement("div");
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
        const langCell = document.createElement("div");
        langCell.textContent = langLabel;
        optionsGrid.appendChild(langCell);

        // Display checkbox
        const displayCell = document.createElement("div");
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
        const speakCell = document.createElement("div");
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
    // 8️⃣ Re‑build the token grid based on the current checkbox state
    // -----------------------------------------------------------------
    function rebuildTokenGrid() {
        // 0️⃣ Reset global collections and clear the visual grid.
        tokenEls = [];
        transEls = [];
        tokenGrid.innerHTML = "";

        // 1️⃣ Build lookup maps from the check‑boxes.
        const displayMap = {}; // lang → true/false
        const speakMap = {}; // lang → true/false (used by the controller)

        orderedLangs.forEach(l => {
            const dCb = displayBoxes.get(l);
            const sCb = speakBoxes.get(l);
            displayMap[l] = dCb ? dCb.checked : false;
            speakMap[l] = sCb ? sCb.checked : false;
        });

        // 2️⃣ Walk through the JSON data and create a column for each token.
        data.forEach(entry => {
            // Deterministic first column – we just use the first language in
            // `orderedLangs`.  It can be any language; all are treated equally.
            const sourceTokens = entry[orderedLangs[0]] || [];

            sourceTokens.forEach((srcWord, idx) => {
                // Build parallel arrays: one entry per language in orderedLangs.
                const translations = [];
                const langs = [];

                orderedLangs.forEach(lang => {
                    const arr = entry[lang] || [];
                    translations.push(arr[idx] ?? ""); // fallback to empty string
                    langs.push(lang);
                });

                // 3️⃣ Create the column (contains a <span> for EVERY language).
                const col = buildTokenColumn(translations, langs);

                // 4️⃣ Show / hide each span according to the Display check‑boxes.
                const colIdx = tokenEls.length - 1; // index of the column we just added
                langs.forEach((lang, i) => {
                    const span = transEls[colIdx][i];
                    if (!span) return; // safety guard

                    if (displayMap[lang]) {
                        // Ensure the span is attached to the column.
                        if (!col.contains(span)) col.appendChild(span);
                    } else {
                        // Remove it if it’s currently attached.
                        if (col.contains(span)) col.removeChild(span);
                    }
                });

                // Append the column to the grid.
                tokenGrid.appendChild(col);
            });
        });

        if (speechCtrl) {
            speechCtrl.updateElements(tokenEls, transEls);
            speechCtrl.updateSpeakMap(speakMap);   // <-- keep Play in sync with Display
        }

    }

    // -----------------------------------------------------------------
    // 9️⃣ Speech‑control panel (created by the controller)
    // -----------------------------------------------------------------
    const speechPanel = document.createElement("div");
    speechPanel.id = "speechPanel";
    speechPanel.style.margin = "0.5rem 1rem";

    // -----------------------------------------------------------------
    // Assemble the page: title → token grid → language options → speech panel
    // -----------------------------------------------------------------
    mainEl.innerHTML = ""; // clear any previous content

    const titleText =
        (exerciseMeta.title && exerciseMeta.title[uiLang]) ||
        exerciseMeta.title?.en ||
        "Dictionary Exercise";

    const heading = document.createElement("h2");
    heading.textContent = titleText;
    heading.style.textAlign = "center";
    heading.style.marginBottom = "1rem";

    mainEl.appendChild(heading);      // title
    mainEl.appendChild(tokenGrid);    // token grid (filled after first rebuild)
    mainEl.appendChild(details);      // language‑options panel
    mainEl.appendChild(speechPanel); // speech‑control UI

    // -----------------------------------------------------------------
    // 10️⃣ Build the speech controller BEFORE the first rebuild
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
    // 11️⃣ Initial render
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

