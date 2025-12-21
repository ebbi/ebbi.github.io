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

    // -----------------------------------------------------------------
    // 1️⃣  Create a <span> only for displayed languages.
    // -----------------------------------------------------------------
    translations.forEach((txt, idx) => {
        const lang = langs[idx];

        // ---------------------------------------------------------
        // Skip hidden languages (unchanged logic)
        // ---------------------------------------------------------
        if (!displayMap[lang]) return;               // skip hidden languages        

        // -------------------------------------------------------------
        // NEW: Handle "\n" inside the text.
        // -------------------------------------------------------------
        if (typeof txt === "string" && txt.includes("\n")) {
            const parts = txt.split("\n");               // ["part1","part2",...]
            parts.forEach((part, partIdx) => {
                // ---- create the regular span for this piece -----------------
                const span = document.createElement("span");
                span.className = "trans";
                span.textContent = part;
                span.setAttribute("lang", lang);
                col.appendChild(span);

                // ---- register the span for the speech controller ----------
                const colIdx = tokenEls.length;
                if (!transEls[colIdx]) transEls[colIdx] = [];
                transEls[colIdx].push(span);

                // ---- after every piece except the last, insert a line‑break div
                if (partIdx < parts.length - 1) {
                    const brDiv = document.createElement("div");
                    brDiv.className = "dict-grid";   // the class you asked for
                    col.appendChild(brDiv);
                }
            });
            // Skip the normal processing for this entry – we already handled it.
            return;
        }

        // ---------------------------------------------------------
        // Create the outer span that the UI and speech controller
        // expect (class="trans").
        // ---------------------------------------------------------
        const outerSpan = document.createElement("span");
        outerSpan.className = "trans";
        outerSpan.setAttribute("lang", lang);

        // -----------------------------------------------------------------
        // Thai consonant class lookup tables (corrected)
        // -----------------------------------------------------------------

        // 1️⃣  High‑class consonants (as you specified)
        const HIGH_CLASS_CONSONANTS = new Set([
            "จ", "ฉ", "ช", "ซ", "ฌ", "ญ"
        ]);

        // 2️⃣  Middle‑class consonants (as you specified)
        const MIDDLE_CLASS_CONSONANTS = new Set([
            "ก", "ข", "ค", "ฆ", "ง"
        ]);

        // 3️⃣  All Thai consonants (the complete inventory of 44 letters)
        //    Source: standard Thai alphabet tables.
        const ALL_THAI_CONSONANTS = [
            "ก", "ข", "ค", "ฆ", "ง", "จ", "ฉ", "ช", "ซ", "ฌ", "ญ", "ฎ", "ฏ", "ฐ", "ฑ", "ฒ", "ณ",
            "ด", "ต", "ถ", "ท", "ธ", "น", "บ", "ป", "ผ", "ฝ", "พ", "ฟ", "ภ", "ม", "ย", "ร", "ล",
            "ว", "ศ", "ษ", "ส", "ห", "ฬ", "อ", "ฮ"
        ];

        // 4️⃣  Low‑class consonants = everything that is a Thai consonant
        //    but NOT in the high‑ or middle‑class sets.
        const LOW_CLASS_CONSONANTS = new Set(
            ALL_THAI_CONSONANTS.filter(ch =>
                !HIGH_CLASS_CONSONANTS.has(ch) && !MIDDLE_CLASS_CONSONANTS.has(ch)
            )
        );

        if (lang === "th" && typeof txt === "string") {

            // ---- 2️⃣  Split the Thai word into Unicode grapheme clusters.
            // Using spread (…) works for most Thai characters because they are
            // in the BMP. For full grapheme‑cluster safety you could use
            // Intl.Segmenter, but the simple split is sufficient for the data
            // you have.
            const chars = [...txt];

            // ---- 3️⃣  Create a nested span for each character with the proper class.
            chars.forEach(ch => {
                const inner = document.createElement("span");

                // Determine the class and also mark it as a speakable element
                // by adding the "trans" class (so the click handler can find it).
                if (HIGH_CLASS_CONSONANTS.has(ch)) {
                    inner.className = "high-class trans";
                } else if (MIDDLE_CLASS_CONSONANTS.has(ch)) {
                    inner.className = "middle-class trans";
                } else {
                    inner.className = "low-class trans";
                }

                inner.textContent = ch;
                outerSpan.appendChild(inner);
            });
        } else {
            // -----------------------------------------------------
            // Non‑Thai (or non‑string) – just put the whole text.
            // -----------------------------------------------------
            outerSpan.textContent = txt || "";
        }

        // ---------------------------------------------------------
        // Append the outer span to the column and register it for the
        // speech controller (identical to the original behaviour).
        // ---------------------------------------------------------
        col.appendChild(outerSpan);

        const colIdx = tokenEls.length;               // one column == one token
        if (!transEls[colIdx]) transEls[colIdx] = [];
        transEls[colIdx].push(outerSpan);
    });

    // -----------------------------------------------------------------
    // 2️⃣  Store the column itself in tokenEls (controller uses the index).
    // -----------------------------------------------------------------
    tokenEls.push(col);

    // -----------------------------------------------------------------
    // 3️⃣  Click handling – start playback from this column / span.
    // -----------------------------------------------------------------

    // ----- helper functions for robust click handling -----
    const isSpeakable = (node) => {
        if (!node || !node.classList) return false;
        return node.classList.contains('trans') ||
            node.classList.contains('high-class') ||
            node.classList.contains('middle-class') ||
            node.classList.contains('low-class');
    };

    const findSpeakableTarget = (startNode, column) => {
        let node = startNode;
        while (node && node !== column) {
            if (isSpeakable(node)) return node;
            node = node.parentNode;
        }
        return null;
    };

    const computeTransIdx = (column, targetNode) => {
        const speakables = Array.from(column.children).filter(isSpeakable);
        return speakables.indexOf(targetNode);
    };
    // ---------------------------------------------------------

    col.addEventListener("click", (ev) => {
        const target = findSpeakableTarget(ev.target, col);
        if (!target) return;               // click was on a non‑speakable element

        const tokenIdx = tokenEls.indexOf(col);
        if (tokenIdx === -1) return;

        const transIdx = computeTransIdx(col, target);
        if (speechCtrl) speechCtrl.startFrom(tokenIdx, transIdx);
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
    const scrollWrapper = document.createElement('div');
    scrollWrapper.className = 'dict-scroll-wrapper';

    function createNewGrid() {
        const g = document.createElement('div');
        g.className = 'dict-grid';
        scrollWrapper.appendChild(g);
        return g;
    }

    // -----------------------------------------------------------------
    // 4️⃣ Internationalised UI strings
    // -----------------------------------------------------------------
    const locale = getLocale(uiLang);

    // -----------------------------------------------------------------
    // 5️⃣ Derive the list of language columns from the JSON.
    // -----------------------------------------------------------------
    const rawLangKeys = Object.keys(data[0]).filter(
        (k) => k !== "id" && k !== "section" && k !== "tokens"
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
    details.open = false;
    const summary = document.createElement("summary");
    summary.textContent = locale.languageOptions || "Language options";
    details.appendChild(summary);

    const optionsGrid = document.createElement("div");
    optionsGrid.className = 'options-grid';
    details.appendChild(optionsGrid);

    // Header row
    const emptyHeader = document.createElement("div"); // language list
    const displayHeader = document.createElement("h4");
    const speakHeader = document.createElement("h4");
    displayHeader.textContent = locale.display ?? "Display";
    speakHeader.textContent = locale.speak ?? "Speak";
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
        displayCb.checked = (langCode === exerciseLang) || (langCode === uiLang);
        displayCell.appendChild(displayCb);
        optionsGrid.appendChild(displayCell);
        displayBoxes.set(langCode, displayCb);

        // Speak checkbox
        const speakCell = document.createElement("div");
        const speakCb = document.createElement("input");
        speakCb.type = "checkbox";
        speakCb.dataset.lang = langCode;
        speakCb.checked = (langCode === exerciseLang) || (langCode === uiLang);
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

    // -----------------------------------------------------------------
    // 9️⃣  Build the speech controller **inside** the player panel.
    // -----------------------------------------------------------------
    speechCtrl = createSpeechController(speechPanel, {
        getAvailableLanguages: () => SUPPORTED_LANGS,
        defaultLang: exerciseLang,
        onVoiceChange: (newVoice) => {
            console.log("[Speech] voice changed →", newVoice);
            try {
                localStorage.setItem("local_storage_tts_voice", newVoice);
            } catch (error) { /* ignore */ }
        },
        tokenElements: tokenEls,
        translationElements: transEls
    });

    // -----------------------------------------------------------------
    // 10️⃣  Assemble the page in the required order:
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

    const heading = document.createElement("h4");
    heading.textContent = titleText;

    // Order matters:
    mainEl.appendChild(details);      // 1️⃣ Language options (closed)
    mainEl.appendChild(speechPanel); // 2️⃣ Player controls (outside details)
    mainEl.appendChild(heading);      // 3️⃣ Exercise title (h4)
    mainEl.appendChild(scrollWrapper); // 4️⃣ Token grid container

    /** -------------------------------------------------------------
     *  rebuildTokenGrid()
     *
     *  New DOM shape (per section):
     *
     *  <div class="dict-grid">
     *      <details class="section-details" style="display:block;">
     *          <summary class="section-header">…section title…</summary>
     *
     *          <!-- One or more wrappers that hold the token columns.
     *               A new wrapper is created after every "\n" line‑break,
     *               but they are all children of the same <details>. -->
     *          <div class="section-tokens">
     *              <div class="token-col">…</div>
     *              <div class="token-col">…</div>
     *              …
     *          </div>
     *
     *          <!-- Additional .section‑tokens may appear after a "\n". -->
     *          <div class="section-tokens">…</div>
     *      </details>
     *
     *      <!-- Sections that have no heading are rendered exactly as before
     *           (token‑cols are direct children of .dict-grid). -->
     *  </div>
     *
     *  The CSS (see the block after the function) hides/shows the
     *  .section‑tokens that belong to a closed/open <details>.
     * ------------------------------------------------------------- */
    function rebuildTokenGrid() {
        // -----------------------------------------------------------------
        // 0️⃣  Reset global collections and clear the visual container.
        // -----------------------------------------------------------------
        tokenEls = [];
        transEls = [];
        scrollWrapper.innerHTML = "";               // wipe any old grids

        // -----------------------------------------------------------------
        // 1️⃣  Start the first .dict-grid container.
        // -----------------------------------------------------------------
        let currentGrid = createNewGrid();          // <div class="dict-grid">

        // -----------------------------------------------------------------
        // 2️⃣  References we need while walking the data.
        // -----------------------------------------------------------------
        let activeDetails = null;   // the <details> we are currently inside (if any)
        let activeSectionContainer = null;   // <div class="section-tokens"> that receives columns

        // -----------------------------------------------------------------
        // 3️⃣  Build lookup maps from the language check‑boxes.
        // -----------------------------------------------------------------
        const displayMap = {}; // lang → true/false
        const speakMap = {}; // lang → true/false (used by the controller)

        orderedLangs.forEach(l => {
            const dCb = displayBoxes.get(l);
            const sCb = speakBoxes.get(l);
            displayMap[l] = dCb ? dCb.checked : false;
            speakMap[l] = sCb ? sCb.checked : false;
        });

        // -----------------------------------------------------------------
        // 4️⃣  Ensure at least one language is displayed.
        // -----------------------------------------------------------------
        if (!Object.values(displayMap).some(Boolean)) {
            const first = orderedLangs[0];
            displayMap[first] = true;
            speakMap[first] = true;
        }

        // -----------------------------------------------------------------
        // 5️⃣  Walk through the JSON data and create columns.
        // -----------------------------------------------------------------
        data.forEach(entry => {

            // -------------------------------------------------------------
            // 5️⃣①  SECTION HEADER → <details><summary>…
            // -------------------------------------------------------------
            if (entry.section) {
                // ---- <details class="section-details"> --------------------
                const detailsEl = document.createElement("details");
                detailsEl.className = "section-details";

                // Force block layout (fixes the “inline” problem on mobile)
                detailsEl.style.display = "block";

                // ---- <summary class="section-header"> --------------------
                const summaryEl = document.createElement("summary");
                summaryEl.className = "section-header";

                // Internationalised title (same fallback chain as before)
                const localizedSection =
                    entry.section[uiLang] ||
                    entry.section.en ||
                    Object.values(entry.section)[0] ||
                    "";
                summaryEl.textContent = localizedSection;

                // Assemble <details><summary></summary></details>
                detailsEl.appendChild(summaryEl);
                currentGrid.appendChild(detailsEl);

                // ---- First token wrapper for this section.
                const tokenWrapper = document.createElement("div");
                tokenWrapper.className = "section-tokens";
                detailsEl.appendChild(tokenWrapper);

                // Remember where we are.
                activeDetails = detailsEl;
                activeSectionContainer = tokenWrapper;
            }

            // -------------------------------------------------------------
            // 5️⃣②  Grab the source‑language array (first language in order)
            // -------------------------------------------------------------
            const sourceTokens = entry[orderedLangs[0]] || [];

            // -------------------------------------------------------------
            // 5️⃣③  Iterate over each token (row) in this entry.
            // -------------------------------------------------------------
            sourceTokens.forEach((srcWord, idx) => {
                // ---- Build parallel arrays that contain ONLY displayed languages.
                const translations = [];
                const langs = [];

                let hasNewline = false; // becomes true if any value contains "\n"

                orderedLangs.forEach(lang => {
                    if (!displayMap[lang]) return; // skip hidden languages
                    const arr = entry[lang] || [];
                    const txt = arr[idx] ?? "";
                    translations.push(txt);
                    langs.push(lang);
                    if (typeof txt === "string" && txt.includes("\n")) {
                        hasNewline = true;
                    }
                });

                // ---- Safety fallback – source language is always shown.
                if (translations.length === 0) {
                    const srcArr = entry[orderedLangs[0]] || [];
                    translations.push(srcArr[idx] ?? "");
                    langs.push(orderedLangs[0]);
                }

                // ---- Create the column (visible spans only) and append it.
                const col = buildTokenColumn(translations, langs, displayMap);

                // ---------------------------------------------------------
                // 5️⃣④  Where do we put the column?
                // ---------------------------------------------------------
                if (activeSectionContainer) {
                    // Inside a <details> → add to the current wrapper.
                    activeSectionContainer.appendChild(col);
                } else {
                    // No active section (regular part of the exercise).
                    currentGrid.appendChild(col);
                }

                // ---------------------------------------------------------
                // 5️⃣⑤  New‑line handling – start a fresh token‑wrapper.
                // ---------------------------------------------------------
                if (hasNewline) {
                    // Create a *new* wrapper for the next block of columns.
                    const newWrapper = document.createElement("div");
                    newWrapper.className = "section-tokens";

                    if (activeDetails) {
                        // Still inside a section → attach the new wrapper
                        // to the same <details>.
                        activeDetails.appendChild(newWrapper);
                        activeSectionContainer = newWrapper;
                    } else {
                        // Not inside a section → the wrapper belongs to the grid.
                        currentGrid.appendChild(newWrapper);
                        activeSectionContainer = newWrapper;
                    }
                }
            });
        });

        // -----------------------------------------------------------------
        // 6️⃣  Update the speech controller with the new element references.
        // -----------------------------------------------------------------
        if (speechCtrl) {
            speechCtrl.updateElements(tokenEls, transEls);
            speechCtrl.updateSpeakMap(speakMap);   // keep Play in sync with Speak boxes
        }
    }

    // -----------------------------------------------------------------
    // 12️⃣  Initial render of the grid.
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
    // 2️⃣ Ensure the voice for the exercise language exists.
    // -----------------------------------------------------------------
    const exerciseLang = meta.language || lang;   // fallback to UI language
    await ensureVoiceForExercise(exerciseLang, lang, true); // speak confirmation

    // -----------------------------------------------------------------
    // 3️⃣ Render the shared header (toolbar + nav) and obtain <main>
    // -----------------------------------------------------------------
    const main = await renderHeader(lang);
    main.innerHTML = '';                     // clear any previous UI

    // -----------------------------------------------------------------
    // 4️⃣ Render the dictionary UI inside the <main>.
    // -----------------------------------------------------------------
    await renderDictionaryExercise(main, meta, lang);
}