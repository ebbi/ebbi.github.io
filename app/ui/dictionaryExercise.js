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
import { findVoiceForLang } from "../utils/speech.js";
import { setStoredVoice } from "../utils/storage.js";

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
    col.classList.add('token-col');

    // -----------------------------------------------------------------
    // 1️⃣  Create a <span> only for displayed languages.
    // -----------------------------------------------------------------
    translations.forEach((txt, idx) => {
        const lang = langs[idx];
        if (!displayMap[lang]) return;               // skip hidden languages

        const span = document.createElement("span");
        span.className = "trans";
        span.textContent = txt || "";
        span.classList.add('trans');
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

/**
 * Main entry – render the dictionary exercise inside the provided <main>.
 *
 * @param {HTMLElement} mainEl          – container for the UI.
 * @param {object}      exerciseMeta   – metadata from exercises.json.
 * @param {string}      uiLang         – UI language (e.g. "en").
 * @param {string}      exerciseLang   – language code defined in the exercise (e.g. "th").
 */
export async function renderDictionaryExercise(mainEl, exerciseMeta, uiLang, exerciseLang) {
    // -----------------------------------------------------------------
    // 1️⃣ Load the JSON payload for the exercise
    // -----------------------------------------------------------------
    const jsonPath = `/app/${exerciseMeta.folder}/${exerciseMeta.file}`;
    const data = await loadJSON(jsonPath); // array of objects

    // -----------------------------------------------------------------
    // 2️⃣ Determine the real language of the exercise (source language)
    // -----------------------------------------------------------------
    // If the exercise file specifies a language, use it; otherwise fall back
    // to the UI language.
    const srcLang = exerciseLang || uiLang;

    // -----------------------------------------------------------------
    // 3️⃣ Prepare the token grid (will be rebuilt on every checkbox change)
    // -----------------------------------------------------------------
    const tokenGrid = document.createElement("div");
    tokenGrid.className = "dict-grid";
    tokenGrid.classList.add('dict-grid');

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
    details.style.fontSize = "0.85rem";
    details.classList.add('language-options-details');
    details.style.padding = "0.15rem";
    // -----------------------------------------------------------------
    const summary = document.createElement("summary");
    summary.textContent = locale.languageOptions || "Language options";
    details.appendChild(summary);

    const optionsGrid = document.createElement("div");
    optionsGrid.classList.add('language-options-grid');

    details.appendChild(optionsGrid);

    // Header row
    const emptyHeader = document.createElement("div"); // language list
    const displayHeader = document.createElement("h4");
    const speakHeader = document.createElement("h4");
    displayHeader.textContent = locale.display ?? "Display";
    speakHeader.textContent = locale.speak ?? "Speak";

    displayHeader.classList.add('lang-header');
    speakHeader.classList.add('lang-header');

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
        displayCell.classList.add('lang-cell');
        displayCell.appendChild(displayCb);

        optionsGrid.appendChild(displayCell);
        displayBoxes.set(langCode, displayCb);

        // Speak checkbox
        const speakCell = document.createElement("div");
        const speakCb = document.createElement("input");
        speakCb.type = "checkbox";
        speakCb.dataset.lang = langCode;
        speakCb.checked = (langCode === exerciseLang);
        speakCell.classList.add('lang-cell');
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
    speechPanel.id = "speechPanel";

    // moved to speechController
    /* 
    // -----------------------------------------------------------------
    // 8️⃣ Create the **player control panel** (outside the <details>)
    // -----------------------------------------------------------------
    const speechPanel = document.createElement("div");
    speechPanel.id = "speechPanel";

    // ---- NEW STYLE FOR PLAYER PANEL -----------------------------------------
    speechPanel.style.fontSize = "0.85rem";
    speechPanel.style.margin = "0.15rem 0.15rem 0.25rem 0.15rem";
    speechPanel.style.border = "1px solid var(--border-surface, #ddd)";
    speechPanel.style.borderRadius = "0.5rem";
    speechPanel.style.padding = "0.5rem";
    speechPanel.style.background = "var(--bg-surface, #fff)";
    // -----------------------------------------------------------------

    // -----------------------------------------------------------------
    // Row 1 – Play / Pause / Reset / Delay
    // -----------------------------------------------------------------

        const controlsRow = document.createElement("div");
        controlsRow.style.display = "flex";
        controlsRow.style.alignItems = "center";
        controlsRow.style.gap = "0.5rem";
        controlsRow.style.flexWrap = "wrap";
    
        const playBtn = document.createElement("button");
        playBtn.title = locale.playButton || "Play";
        playBtn.textContent = "▶️";
        controlsRow.appendChild(playBtn);
    
        const pauseBtn = document.createElement("button");
        pauseBtn.title = locale.pauseButton || "Pause";
        pauseBtn.textContent = "⏸️";
        controlsRow.appendChild(pauseBtn);
    
        const resetBtn = document.createElement("button");
        resetBtn.title = locale.resetButton || "Reset";
        resetBtn.textContent = "🔄";
        controlsRow.appendChild(resetBtn);
    
        const delayLabel = document.createElement("label");
        delayLabel.textContent = locale.delayLabel || "Delay (s):";
        controlsRow.appendChild(delayLabel);
    
        const delayInput = document.createElement("input");
        delayInput.type = "number";
        delayInput.min = 1;
        delayInput.max = 5;
        delayInput.step = 0.1;
        delayInput.value = 1;
        delayInput.style.width = "3rem";
        controlsRow.appendChild(delayInput);
    */
    // -----------------------------------------------------------------
    // Row 2 – Status message (¼) + Voice selector (¾)
    // -----------------------------------------------------------------
    /*
        const statusVoiceRow = document.createElement("div");
        statusVoiceRow.style.display = "flex";
        statusVoiceRow.style.alignItems = "center";
        statusVoiceRow.style.gap = "0.5rem";
        statusVoiceRow.style.marginTop = "0.5rem";
    
        const statusEl = document.createElement("div");
        // ¼ of the row
        statusEl.style.flex = "0 0 25%";
        statusEl.style.minHeight = "1.2rem";
        statusEl.style.fontStyle = "italic";
        statusEl.style.fontSize = "0.8rem";
        statusEl.style.border = "1px solid var(--border-surface, #ddd)";
        statusEl.style.borderRadius = "4px";
        statusEl.style.padding = "0.7rem 0.15rem";
        statusEl.style.background = "var(--bg-surface, #fff)";
        statusVoiceRow.appendChild(statusEl);
    
        const voiceSelect = document.createElement("select");
        voiceSelect.id = "voiceSelect";
    
        const defaultOption = document.createElement("option");
        defaultOption.value = locale.selectExerciseVoice; // No value for the default message
        defaultOption.text = "Select exercise language voice"; // The default message
        defaultOption.disabled = true; // Disable the option
        defaultOption.selected = true; // Set it as the selected option
        voiceSelect.insertBefore(defaultOption, voiceSelect.firstChild);
    
        // ¾ of the row
        voiceSelect.style.flex = "0 0 75%";
        // ---- NEW PADDING FOR VOICE SELECT ---------------------------------------
        voiceSelect.style.padding = "0.11rem";
        // ------------------------------------------------------------------------
        voiceSelect.style.boxSizing = "border-box";
        statusVoiceRow.appendChild(voiceSelect);
    */
    // -----------------------------------------------------------------
    // Assemble the two rows inside the speech panel
    // -----------------------------------------------------------------
    //   speechPanel.appendChild(controlsRow);   // Row 1
    //    speechPanel.appendChild(statusVoiceRow); // Row 2

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
                catDiv.style.flex = "0 0 100%";
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
    heading.style.textAlign = "center";
    heading.style.marginBottom = "1rem";

    // Order matters:
    mainEl.appendChild(details);      // 1️⃣ Language options (closed)
    mainEl.appendChild(speechPanel); // 2️⃣ Player controls (outside details)
    mainEl.appendChild(heading);      // 3️⃣ Exercise title (h4)
    mainEl.appendChild(tokenGrid);    // 4️⃣ Token grid

    // -----------------------------------------------------------------
    // 11️⃣ Build the speech controller **inside** the player panel.
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

    /* -------------------------------------------------------------
       12️⃣ Select a voice that matches the *exercise* language.
            If none is found, inform the user.
       ------------------------------------------------------------- */

    const voiceForExercise = findVoiceForLang(srcLang);
    if (voiceForExercise) {
        // Update the voice selector UI
        const voiceSelect = speechCtrl.getVoiceSelect();
        const option = Array.from(voiceSelect.options).find(o => o.value === voiceForExercise);
        if (option) {
            voiceSelect.value = option.value;          // set the selected option
            // *** NEW: fire a change event so the controller updates its internal state ***
            voiceSelect.dispatchEvent(new Event('change'));
        }
        // Persist the choice for future sessions
        setStoredVoice(voiceForExercise);
    } else {
        // No matching voice – show a gentle notice.
        // Using a simple alert keeps the implementation minimal.
        // You can replace this with a nicer modal if you wish.
        alert(
            `The TTS voice for language "${srcLang}" is not available in this browser. ` +
            `The app will still work, but you may want to follow the instructions ` +
            `in the Help page to install the appropriate voice.`
        );
    }

    /* -----------------------------------------------------------------
       13️⃣ Initial render of the grid.
       ----------------------------------------------------------------- */
    rebuildTokenGrid();
}

// -----------------------------------------------------------------
// Wrapper used by the router.
// -----------------------------------------------------------------
export async function initDictionaryPage(lang, id, exerciseLang) {
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
    // Pass the detected exercise language (or fallback to UI language)
    await renderDictionaryExercise(mainEl, meta, lang, exerciseLang);
}