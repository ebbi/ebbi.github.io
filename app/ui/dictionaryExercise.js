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
import { ensureVoiceForExercise } from '../utils/voiceHelper.js';

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
 * `displayMap`   – object: lang → true/false (which languages are displayed)
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
    //    col.style.display = "flex";
    //    col.style.flexDirection = "column";
    //   col.style.alignItems = "center";
    // col.style.margin = "0 0.5rem";

    // -----------------------------------------------------------------
    // 1️⃣  Create a <span> only for displayed languages.
    // -----------------------------------------------------------------
    translations.forEach((txt, idx) => {
        const lang = langs[idx];
        if (!displayMap[lang]) return;               // skip hidden languages

        const span = document.createElement("span");
        span.className = "trans";
        span.textContent = txt || "";
        //        span.style.fontSize = "1rem";
        //        span.style.color = "var(--txt-secondary)";
        span.setAttribute("lang", lang);

        col.appendChild(span);

        // Register for the speech controller.
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

        const transIdx = Array.from(col.children).indexOf(ev.target);
        if (speechCtrl) speechCtrl.startFrom(tokenIdx, transIdx);
    };

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
    //    tokenGrid.style.display = "flex";
    //    tokenGrid.style.flexWrap = "wrap";
    //    tokenGrid.style.justifyContent = "flex-start"; // left‑align rows
    //    tokenGrid.style.gap = "1rem";
    //   tokenGrid.style.padding = "0 1rem 1rem 1rem";
    //    tokenGrid.style.height = "70vh";
    //   tokenGrid.style.overflowY = "auto";

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
    details.open = false;                     // default closed
    // ---- NEW STYLE FOR DETAILS -------------------------------------------------
    //    details.style.fontSize = "0.85rem";
    //   details.style.margin = "0.15rem";
    //   details.style.padding = "0.15rem";
    // -----------------------------------------------------------------
    const summary = document.createElement("summary");
    summary.textContent = locale.languageOptions || "Language options";
    details.appendChild(summary);

    const optionsGrid = document.createElement("div");
    optionsGrid.className = 'options-grid'
    //    optionsGrid.style.display = "grid";
    //    optionsGrid.style.gridTemplateColumns = "6fr 2fr 2fr";
    //   optionsGrid.style.gap = "0.5rem";
    //    optionsGrid.style.alignItems = "center";
    details.appendChild(optionsGrid);

    // Header row
    const emptyHeader = document.createElement("div"); // language list
    const displayHeader = document.createElement("h4");
    const speakHeader = document.createElement("h4");
    displayHeader.textContent = locale.display ?? "Display";
    speakHeader.textContent = locale.speak ?? "Speak";
    //   displayHeader.style.textAlign = "center";
    //   speakHeader.style.textAlign = "center";
    optionsGrid.appendChild(emptyHeader);
    optionsGrid.appendChild(displayHeader);
    optionsGrid.appendChild(speakHeader);

    // Maps for the check‑boxes
    const displayBoxes = new Map(); // lang → <input type="checkbox">
    const speakBoxes = new Map();

    orderedLangs.forEach(langCode => {
        const langLabel = LANGUAGE_LABELS[langCode] || langCode.toUpperCase();

        // Language name cell
        const langCell = document.createElement("h4");
        langCell.textContent = langLabel;
        optionsGrid.appendChild(langCell);

        // Display checkbox
        const displayCell = document.createElement("div");
        const displayCb = document.createElement("input");
        displayCb.type = "checkbox";
        displayCb.dataset.lang = langCode;
        displayCb.checked = (langCode === exerciseLang); // only source language on start
        //        displayCell.style.textAlign = "center";
        displayCell.appendChild(displayCb);
        optionsGrid.appendChild(displayCell);
        displayBoxes.set(langCode, displayCb);

        // Speak checkbox
        const speakCell = document.createElement("div");
        const speakCb = document.createElement("input");
        speakCb.type = "checkbox";
        speakCb.dataset.lang = langCode;
        speakCb.checked = (langCode === exerciseLang);
        //        speakCell.style.textAlign = "center";
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
    // 8️⃣ Create the **player control panel** (outside the <details>)
    // -----------------------------------------------------------------
    const speechPanel = document.createElement("div");
    //   speechPanel.style.padding = "0.5rem";
    //    speechPanel.style.border = "1px solid var(--border-surface)";
    speechPanel.id = "speechPanel";

    // -----------------------------------------------------------------
    // Re‑build the token grid based on the current checkbox state
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

        if (!Object.values(displayMap).some(Boolean)) {
            displayMap[0] = true;
            speakMap[0] = true;
        }

        // 2️⃣ Walk through the JSON data and create a column for each token.
        data.forEach(entry => {
            // Category heading (optional – keep if you like)
            if (entry.category) {
                const catDiv = document.createElement("h5");
                catDiv.className = "category-header";
                catDiv.textContent = entry.category;
                //                catDiv.style.fontWeight = "600";
                //               catDiv.style.margin = "0.4rem 0 0.2rem 0";
                //               catDiv.style.color = "var(--txt-primary)";
                // Full‑width flex item so it sits on its own line.
                //           catDiv.style.flex = "0 0 100%";
                tokenGrid.appendChild(catDiv);
            }

            const sourceTokens = entry[orderedLangs[0]] || [];

            sourceTokens.forEach((srcWord, idx) => {
                // Build parallel arrays that contain ONLY displayed languages.
                const translations = [];
                const langs = [];

                orderedLangs.forEach(lang => {
                    if (!displayMap[lang]) return; // skip hidden languages
                    const arr = entry[lang] || [];
                    translations.push(arr[idx] ?? ""); // fallback to empty string
                    langs.push(lang);
                });

                // Safety fallback – source language is always shown.
                if (translations.length === 0) {
                    const srcArr = entry[orderedLangs[0]] || [];
                    translations.push(srcArr[idx] ?? "");
                    langs.push(orderedLangs[0]);
                }

                // Create the column (only visible spans are added).
                const col = buildTokenColumn(translations, langs, displayMap);
                tokenGrid.appendChild(col);
            });
        });

        // 3️⃣ Update the speech controller.
        if (speechCtrl) {
            speechCtrl.updateElements(tokenEls, transEls);
            speechCtrl.updateSpeakMap(speakMap);   // keep Play in sync with Speak boxes
        }
    }

    // -----------------------------------------------------------------
    // 9️⃣ Assemble the page in the required order:
    //      1️⃣ Language‑options <details> (top, closed)
    //      2️⃣ Player control panel (outside details)
    //      3️⃣ Exercise heading (<h4>)
    //      4️⃣ Token grid
    // -----------------------------------------------------------------
    mainEl.innerHTML = ""; // clear any previous content

    const titleText =
        (exerciseMeta.title && exerciseMeta.title[uiLang]) ||
        exerciseMeta.title?.en ||
        "Dictionary Exercise";

    const heading = document.createElement("h4"); // <-- changed from h2 to h4
    heading.textContent = titleText;
    //    heading.style.textAlign = "center";
    //   heading.style.marginBottom = "1rem";

    // Order matters:
    mainEl.appendChild(details);      // 1️⃣ Language options (closed)
    mainEl.appendChild(speechPanel); // 2️⃣ Player controls (outside details)
    mainEl.appendChild(heading);      // 3️⃣ Exercise title (h4)
    mainEl.appendChild(tokenGrid);    // 4️⃣ Token grid

    // -----------------------------------------------------------------
    // 10️⃣ Build the speech controller **inside** the player panel.
    // -----------------------------------------------------------------

    speechCtrl = createSpeechController(speechPanel, {
        getAvailableLanguages: () => SUPPORTED_LANGS,
        // Use the language defined in the exercise meta (falls back to UI lang)
        defaultLang: exerciseLang,
        onVoiceChange: (newVoice) => {
            console.log("[Speech] voice changed →", newVoice);
            try {
                localStorage.setItem("local_storage_tts_voice", newVoice);
            } catch (error) { }
        },
        tokenElements: tokenEls,
        translationElements: transEls
    });

    // -----------------------------------------------------------------
    // 12️⃣ Initial render of the grid.
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

    // -------------------------------------------------------------
    // 3️⃣  Ensure the voice for the exercise language exists
    // -------------------------------------------------------------
    const exerciseLang = meta.language || lang;   // language field from exercises.json
    await ensureVoiceForExercise(exerciseLang, lang, true); // speak confirmation


    // -----------------------------------------------------------------
    // 2️⃣ Render the shared header (toolbar + nav) and obtain <main>
    // -----------------------------------------------------------------
    const mainEl = await renderHeader(lang);

    // -----------------------------------------------------------------
    // 3️⃣ Render the dictionary UI inside that <main>
    // -----------------------------------------------------------------
    await renderDictionaryExercise(mainEl, meta, lang);
}