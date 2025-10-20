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
   ----------------------------------------------------------------- */
let speechCtrl;   // will hold the instance returned by createSpeechController

/**
 * Build the HTML for a single token column.
 *
 * @param {string} thaiWord          – the Thai token
 * @param {Array<string>} translations – parallel array of translations (already filtered)
 * @param {Array<string>} langs        – parallel array of language codes (e.g. ["en","zh","fa"])
 * @returns {HTMLElement} the column <div>
 */
function buildTokenColumn(thaiWord, translations, langs) {
    const col = document.createElement("div");
    col.className = "token-col";
    col.style.display = "flex";
    col.style.flexDirection = "column";
    col.style.alignItems = "center";
    col.style.margin = "0 0.5rem";

    // ------------------- Thai token (big & bold) -------------------
    // es no need 
    /* es -
        const thaiSpan = document.createElement("span");
        thaiSpan.className = "thai";
        thaiSpan.textContent = thaiWord;
        thaiSpan.style.fontWeight = "bold";
        thaiSpan.style.fontSize = "1.2rem";
        thaiSpan.style.marginBottom = "0.4rem";
        thaiSpan.setAttribute("lang", "th");               // original language
        col.appendChild(thaiSpan);
        tokenEls.push(thaiSpan);
    */
    // ------------------- Translations -----------------------------

    // es + add thaiWord (rename thaiWord to originalText)
    translations.unshift(thaiWord);

    translations.forEach((t, idx) => {

        //        console.log("t, idx ", t, idx);

        const transSpan = document.createElement("span");
        transSpan.className = "trans";
        transSpan.textContent = t || "";
        transSpan.style.fontSize = "0.9rem";
        transSpan.style.color = "var(--txt-secondary)";

        const langCode = langs[idx];
        if (langCode) transSpan.setAttribute("lang", langCode);

        col.appendChild(transSpan);

        // es - const tokenIdx = tokenEls.length - 1;
        const tokenIdx = tokenEls.length;


        if (!transEls[tokenIdx]) transEls[tokenIdx] = [];
        transEls[tokenIdx].push(transSpan);
    });

    // ------------------- Click handling (jump & play) ------------
    const clickHandler = (ev) => {
        // es -
        //       const tokenIndex = tokenEls.indexOf(thaiSpan);
        // es +
        const tokenIndex = 1;  // start from origin
        console.log("tokenIndex ", tokenIndex);

        // es allow checkbox for exercise words, sentences, paragraphs - rename thaiSpan to exerciseLandSpan
        //        if (tokenIndex === -1) return;

        /* es        
                const isThai = ev.target.classList.contains("thai");
                const transIndex = isThai
                    ? -1
                    : Array.from(col.children).indexOf(ev.target) - 1; // -1 because first child is Thai
        */
        // es +
        transIndex = Array.from(col.children).indexOf(ev.target);

        if (speechCtrl) {
            speechCtrl.startFrom(tokenIndex, transIndex);
        }
    };

    //   thaiSpan.addEventListener("click", clickHandler);
    col.querySelectorAll(".trans").forEach(tr =>
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
    const data = await loadJSON(jsonPath); // array of objects

    console.log("es mainEl, exerciseMeta, uiLang", mainEl, exerciseMeta, uiLang);


    // -----------------------------------------------------------------
    // 2️⃣ Determine the **real language of the exercise**.
    //    This is the language that appears in the JSON as the token column.
    //    It is stored in the exercise metadata as `language`.
    //    If for some reason it is missing we fall back to the UI language.
    // -----------------------------------------------------------------
    const exerciseLang = exerciseMeta.language || uiLang;   // <-- NEW

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
    //    Every key except "id", "category" and "tokens" is a language code.
    // -----------------------------------------------------------------
    const rawLangKeys = Object.keys(data[0]).filter(
        (k) => k !== "id" && k !== "category" && k !== "tokens"
    );
    console.log("rawLangKeys ", rawLangKeys);

    // -----------------------------------------------------------------
    // 6️⃣ Put the *source* language (exerciseLang) first.
    // -----------------------------------------------------------------
    const orderedLangs = [
        exerciseLang,
        ...rawLangKeys.filter(l => l !== exerciseLang)
    ];
    console.log("orderedLangs ", orderedLangs);

    // -----------------------------------------------------------------
    // 7️⃣ Build the **Language options** <details> panel.
    //    We'll keep a map of the actual checkbox elements so we can
    //    read their state reliably (no fragile index math).
    // -----------------------------------------------------------------
    const details = document.createElement("details");
    details.open = true;
    details.style.margin = "0.5rem 1rem";

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

    // -----------------------------------------------------------------
    // 8️⃣ Store references to every checkbox in two maps:
    //    displayBoxes[lang] → the *Display* <input>
    //    speakBoxes[lang]   → the *Speak*   <input>
    // -----------------------------------------------------------------
    const displayBoxes = new Map(); // lang -> checkbox element
    const speakBoxes = new Map(); // lang -> checkbox element

    orderedLangs.forEach(langCode => {
        const langLabel = LANGUAGE_LABELS[langCode] || langCode.toUpperCase();

        // ---- Language name cell ----
        const langCell = document.createElement("div");
        langCell.textContent = langLabel;
        optionsGrid.appendChild(langCell);

        // ---- Display checkbox cell ----
        const displayCell = document.createElement("div");
        const displayCb = document.createElement("input");
        displayCb.type = "checkbox";
        displayCb.dataset.lang = langCode;
        // Only the **exercise** language is checked by default
        displayCb.checked = (langCode === exerciseLang);
        displayCell.style.textAlign = "center";
        displayCell.appendChild(displayCb);
        optionsGrid.appendChild(displayCell);
        displayBoxes.set(langCode, displayCb);

        // ---- Speak checkbox cell ----
        const speakCell = document.createElement("div");
        const speakCb = document.createElement("input");
        speakCb.type = "checkbox";
        speakCb.dataset.lang = langCode;
        // Only the **exercise** language is checked by default
        speakCb.checked = (langCode === exerciseLang);
        speakCell.style.textAlign = "center";
        speakCell.appendChild(speakCb);
        optionsGrid.appendChild(speakCell);
        speakBoxes.set(langCode, speakCb);

        // -----------------------------------------------------------------
        // Interaction rules (same as before)
        // -----------------------------------------------------------------
        // If Speak is checked → force Display checked
        speakCb.addEventListener("change", () => {
            if (speakCb.checked) {
                displayCb.checked = true;
            }
            rebuildTokenGrid();
        });

        // If Display is unchecked → also uncheck Speak
        displayCb.addEventListener("change", () => {
            if (!displayCb.checked) {
                speakCb.checked = false;
            }
            rebuildTokenGrid();
        });
    });

    // -----------------------------------------------------------------
    // 9️⃣ Helper that rebuilds the token grid based on the **actual**
    //     checkbox states (no indirect state objects).
    // -----------------------------------------------------------------
    function rebuildTokenGrid() {
        // Reset highlight arrays and clear the grid
        tokenEls = [];
        transEls = [];
        tokenGrid.innerHTML = "";

        // -------------------------------------------------------------
        // Build two plain objects: displayMap[lang] = true/false,
        //                         speakMap[lang]   = true/false
        // -------------------------------------------------------------
        const displayMap = {};
        const speakMap = {};

        orderedLangs.forEach(l => {
            const dCb = displayBoxes.get(l);
            const sCb = speakBoxes.get(l);
            displayMap[l] = dCb ? dCb.checked : false;
            speakMap[l] = sCb ? sCb.checked : false;
        });

        //        const originalDisplay = displayMap[exerciseLang] ?? true; // <-- use exerciseLang

        console.log("%c[Dictionary] displayedLangs:", "color:#06c",
            Object.keys(displayMap).filter(l => displayMap[l] && l !== exerciseLang));
        //        console.log("%c[Dictionary] original language display:", "color:#06c",
        //            originalDisplay);

        // -------------------------------------------------------------
        // Build the grid row‑by‑row
        // -------------------------------------------------------------
        data.forEach(entry => {
            const sourceTokens = entry[exerciseLang] || [];

            sourceTokens.forEach((srcWord, idx) => {
                // Languages (other than the original) that are currently displayed
                const otherDisplayed = orderedLangs
                    .filter(l => l !== exerciseLang && displayMap[l]);

                // Build the translation array for those languages only
                const translations = otherDisplayed.map(l => {
                    const arr = entry[l] || [];
                    return arr[idx] || "";
                });

                // Parallel array of language codes (null for hidden columns)
                const columnLangs = otherDisplayed.map(l =>
                    displayMap[l] ? l : null
                );

                const col = buildTokenColumn(srcWord, translations, columnLangs);

                /* es DO NOT HIDE THE COLUMN ALLOW THE USER TO DECIDE
                                // Hide the whole column if the original language’s Display is OFF
                                if (!originalDisplay) {
                                    col.style.display = "none";
                                }
                */
                tokenGrid.appendChild(col);
            });
        });

        // Keep the speech controller in sync after every rebuild
        if (speechCtrl) speechCtrl.updateElements(tokenEls, transEls);
    }

    // -----------------------------------------------------------------
    // 🔟 Insert the speech‑control panel (created by the controller)
    // -----------------------------------------------------------------
    const speechPanel = document.createElement("div");
    speechPanel.id = "speechPanel";
    speechPanel.style.margin = "0.5rem 1rem";

    // -----------------------------------------------------------------
    // 📦 Assemble the page: title → token grid → language options → speech panel
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
    // 11️⃣ Build the speech controller **before** the first rebuild
    // -----------------------------------------------------------------
    speechCtrl = createSpeechController(speechPanel, {
        // Provide the list of languages your app supports
        getAvailableLanguages: () => SUPPORTED_LANGS,

        // Pass the UI language so the controller can pick a matching voice
        defaultLang: uiLang,

        // Optional callback – you can keep it empty if you don't need extra work
        onVoiceChange: (newVoice) => {
            console.log("[Speech] voice changed →", newVoice);
            // Persist the choice (mirrors utils/storage.js behaviour)
            try {
                localStorage.setItem("local_storage_tts_voice", newVoice);
            } catch (_) { }
        },

        // Give the controller the DOM collections it will highlight.
        tokenElements: tokenEls,
        translationElements: transEls
    });

    // -----------------------------------------------------------------
    // 12️⃣ Initial render of the token grid (respecting the default selections)
    // -----------------------------------------------------------------
    rebuildTokenGrid();
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