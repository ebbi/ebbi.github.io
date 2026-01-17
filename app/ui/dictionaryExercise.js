// ---------------------------------------------------------------
// app/ui/dictionaryExercise.js
// ---------------------------------------------------------------
// Render a “dictionary”‑type exercise (exercise id = "01").
// ---------------------------------------------------------------

import { loadJSON } from '../utils/fetch.js';
import { renderHeader } from './renderHeader.js';
import {
    getLocale,
    LANGUAGE_LABELS,
    SUPPORTED_LANGS,
    FALLBACK_LANG
} from '../data/locales.js';
import { getStoredLang } from '../utils/storage.js';
import { createSpeechController } from '../utils/speechController.js';
import { MCQuizEngine } from './multipleChoiceEngine.js';
import { speakText } from '../utils/speech.js';
import { getStoredVoice } from '../utils/storage.js';
import { applyDirection } from '../utils/rtl.js';
import { ensureVoiceForExercise } from '../utils/voiceHelper.js';
import { getOrCreateSpeechPanel } from '../utils/speech.js';

/* -----------------------------------------------------------------
   GLOBAL UI state – the arrays that the speech controller needs.
   ----------------------------------------------------------------- */
let tokenEls = []; // one element per column (the column <div> itself)
let transEls = []; // 2‑dimensional: transEls[colIdx][langIdx] = <span>

/* -----------------------------------------------------------------
   Speech controller instance – created after the first rebuild.
   ----------------------------------------------------------------- */
let speechCtrl;

/* -----------------------------------------------------------------
   SECTION MAP – keeps a reference to the raw JSON entry for each
   <details class="section-details"> element (used by the quiz).
   ----------------------------------------------------------------- */
const sectionsMap = new Map(); // secId → { entry, tokenEls, transEls }

/* -----------------------------------------------------------------
   Maps that must survive rebuilds (used by the toggle listener).
   ----------------------------------------------------------------- */
let speakMap = {};   // lang → true/false
let repeatMap = {};  // lang → integer (>=1)

/* -----------------------------------------------------------------
   Helper – build a column that holds the translations for ONE source token.
   ----------------------------------------------------------------- */
function buildTokenColumn(translations, langs, displayMap) {
    const col = document.createElement('div');
    col.className = 'token-col';

    // -----------------------------------------------------------------
    // 1️⃣  Create a <span> for each language that is currently displayed.
    // -----------------------------------------------------------------
    translations.forEach((txt, idx) => {
        const lang = langs[idx];

        // -------------------------------------------------------------
        // Skip hidden languages (unchanged logic)
        // -------------------------------------------------------------
        if (!displayMap[lang]) return;               // hidden language

        // -------------------------------------------------------------
        // NEW: handle "\n" inside the text – split into separate spans.
        // -------------------------------------------------------------
        if (typeof txt === 'string' && txt.includes('\n')) {
            const parts = txt.split('\n');               // ["part1","part2",…]
            parts.forEach((part, partIdx) => {
                // ---- regular span for this piece -----------------
                const span = document.createElement('span');
                span.className = 'trans';
                span.textContent = part;
                span.setAttribute('lang', lang);
                col.appendChild(span);

                // ---- register the span for the speech controller ----
                const colIdx = tokenEls.length;
                if (!transEls[colIdx]) transEls[colIdx] = [];
                transEls[colIdx].push(span);

                // ---- after every piece except the last, insert a line‑break div
                if (partIdx < parts.length - 1) {
                    const brDiv = document.createElement('div');
                    brDiv.className = 'dict-grid';
                    col.appendChild(brDiv);
                }
            });
            // Skip the normal processing for this entry – we already handled it.
            return;
        }

        // -------------------------------------------------------------
        // Normal span (including Thai‑character handling – unchanged)
        // -------------------------------------------------------------
        const outerSpan = document.createElement('span');
        outerSpan.className = 'trans';
        outerSpan.setAttribute('lang', lang);
        outerSpan.textContent = txt || '';
        col.appendChild(outerSpan);

        // Register for the speech controller
        const colIdx = tokenEls.length;
        if (!transEls[colIdx]) transEls[colIdx] = [];
        transEls[colIdx].push(outerSpan);
    });

    // -----------------------------------------------------------------
    // 2️⃣  Keep the source language on the column (needed for Thai inner spans)
    // -----------------------------------------------------------------
    if (langs && langs.length) col.dataset.sourceLang = langs[0];

    // -----------------------------------------------------------------
    // 3️⃣  Click handling – start playback from this column / span.
    // -----------------------------------------------------------------
    // Helper to decide whether a node is speakable (has the right class)
    const isSpeakable = (node) => {
        if (!node || !node.classList) return false;
        return node.classList.contains('trans') ||
            node.classList.contains('high-class') ||
            node.classList.contains('middle-class') ||
            node.classList.contains('low-class');
    };

    // Walk up the DOM tree until we find a speakable element or hit the column.
    const findSpeakableTarget = (startNode, column) => {
        let node = startNode;
        while (node && node !== column) {
            if (isSpeakable(node)) return node;
            node = node.parentNode;
        }
        return null;
    };

    // Compute the index of the clicked translation span inside the column.
    const computeTransIdx = (column, targetNode) => {
        const speakables = Array.from(column.children).filter(isSpeakable);
        return speakables.indexOf(targetNode);
    };

    col.addEventListener("click", (ev) => {
        const target = findSpeakableTarget(ev.target, col);
        if (!target) return;               // click was on a non‑speakable element

        // -----------------------------------------------------------------
        // Try the new API first. If it does not exist (old controller version),
        // fall back to the original `tokenEls.indexOf(col)` lookup.
        // -----------------------------------------------------------------
        let tokenIdx = -1;
        if (speechCtrl && typeof speechCtrl.getTokenIndex === 'function') {
            tokenIdx = speechCtrl.getTokenIndex(col);
        } else if (speechCtrl) {
            // old controller – use the global tokenEls array
            tokenIdx = tokenEls.indexOf(col);
        }

        // If the column is not part of the *active* token list, ignore the click.
        if (tokenIdx === -1) return;

        const transIdx = computeTransIdx(col, target);
        if (speechCtrl) speechCtrl.startFrom(tokenIdx, transIdx);
    });

    // -----------------------------------------------------------------
    // 4️⃣  Store the column itself in tokenEls (controller uses the index)
    // -----------------------------------------------------------------
    tokenEls.push(col);
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

    // -------------------------------------------------------------
    // DEBUG – expose the raw data array so we can inspect it from the console
    // -------------------------------------------------------------
    window.__debugData = data;   // <-- add this line


    // -----------------------------------------------------------------
    // 2️⃣ Determine the real language of the exercise (source language)
    // -----------------------------------------------------------------
    const exerciseLang = exerciseMeta.language || uiLang;

    // -----------------------------------------------------------------
    // 3️⃣ Prepare the scroll wrapper that will hold the token grid
    // -----------------------------------------------------------------
    const scrollWrapper = document.createElement('div');
    scrollWrapper.className = 'dict-scroll-wrapper';

    // -----------------------------------------------------------------
    // 4️⃣ Internationalised UI strings
    // -----------------------------------------------------------------
    const locale = getLocale(uiLang);

    // -----------------------------------------------------------------
    // 5️⃣ Derive the list of language columns from the JSON.
    // -----------------------------------------------------------------
    const rawLangKeys = Object.keys(data[0]).filter(
        (k) => k !== 'id' && k !== 'section' && k !== 'tokens'
    );

    // -----------------------------------------------------------------
    // 6️⃣ Put the source language first, then the rest.
    // -----------------------------------------------------------------
    const orderedLangs = [
        exerciseLang,
        ...rawLangKeys.filter(l => l !== exerciseLang)
    ];

    // -----------------------------------------------------------------
    // 7️⃣ Build the Language‑options <details>
    // -----------------------------------------------------------------
    const langDetails = document.createElement('details');
    langDetails.id = 'language-options';
    langDetails.open = false;

    const langSummary = document.createElement('summary');
    langSummary.textContent = locale.languageOptions || 'Language options';
    langDetails.appendChild(langSummary);

    const optionsGrid = document.createElement('div');
    optionsGrid.className = 'options-grid';
    // Simplified to 3 columns: Label | Display | Repeat (which implies Speak)
    optionsGrid.style.gridTemplateColumns = '1fr 1fr 1fr';
    langDetails.appendChild(optionsGrid);

    // Header row
    const headers = [locale.language || 'Language', locale.display || 'Display', locale.repeat || 'Repeat'];
    headers.forEach(text => {
        const h = document.createElement('h4');
        h.textContent = text;
        optionsGrid.appendChild(h);
    });

    const displayBoxes = new Map();
    const repeatBoxes = new Map();

    orderedLangs.forEach(langCode => {
        const langLabel = LANGUAGE_LABELS[langCode] || langCode.toUpperCase();

        const langCell = document.createElement('h4');
        langCell.textContent = langLabel;
        optionsGrid.appendChild(langCell);

        // 1. Display checkbox
        const displayCell = document.createElement('div');
        const displayCb = document.createElement('input');
        displayCb.type = 'checkbox';
        displayCb.checked = (langCode === exerciseLang) || (langCode === uiLang);
        displayCell.appendChild(displayCb);
        optionsGrid.appendChild(displayCell);
        displayBoxes.set(langCode, displayCb);

        // 2. Repeat input (0 = Don't speak)
        const repeatCell = document.createElement('div');
        const repeatInput = document.createElement('input');
        repeatInput.type = 'number';
        repeatInput.min = '0';
        repeatInput.max = '5';
        // Source defaults to 1, others to 0
        repeatInput.value = (langCode === exerciseLang) ? '1' : '0';
        repeatInput.style.width = '3rem';
        repeatCell.appendChild(repeatInput);
        optionsGrid.appendChild(repeatCell);
        repeatBoxes.set(langCode, repeatInput);

        // Interaction Logic
        displayCb.addEventListener('change', () => {
            // If we hide it, we shouldn't speak it
            if (!displayCb.checked) repeatInput.value = 0;
            rebuildTokenGrid();
        });

        repeatInput.addEventListener('change', () => {
            // If we speak it, we must display it
            if (parseInt(repeatInput.value) > 0) displayCb.checked = true;
            rebuildTokenGrid();
        });
    });

    // -----------------------------------------------------------------
    // 8️⃣  Speech panel (contains Play / Pause / Reset / Settings)
    // -----------------------------------------------------------------
    //   const speechPanel = document.createElement('div');
    //   speechPanel.id = 'speechPanel';
    const main = document.getElementById('main');
    const speechPanel = getOrCreateSpeechPanel(main);
    speechPanel.textContent = ""; // Start clean

    // -----------------------------------------------------------------
    // 9️⃣  Create the speech controller (will later receive the token arrays)
    // -----------------------------------------------------------------
    speechCtrl = createSpeechController(speechPanel, {
        getAvailableLanguages: () => SUPPORTED_LANGS,
        defaultLang: exerciseLang,
        onVoiceChange: (newVoice) => {
            console.log('[Speech] voice changed →', newVoice);
            try {
                localStorage.setItem('local_storage_tts_voice', newVoice);
            } catch (_) { }
        },
        tokenElements: tokenEls,
        translationElements: transEls
    });

    // ---------------------------------------------------------------
    // 10️⃣  Move the language‑options <details> into the player‑settings
    // ---------------------------------------------------------------
    // The speech controller already added a <details id="player-settings">
    // inside `speechPanel`. Because `speechPanel` is still unattached to the
    // document, we must query inside it.
    const playerSetting = speechPanel.querySelector('#player-settings');
    if (playerSetting) {
        playerSetting.appendChild(langDetails);
    }

    // -----------------------------------------------------------------
    // 11️⃣  Assemble the page (order matters)
    // -----------------------------------------------------------------
    mainEl.innerHTML = '';               // clear any previous UI
    mainEl.appendChild(speechPanel);     // 1️⃣ player‑settings (now contains language‑options)
    mainEl.appendChild(scrollWrapper);   // 2️⃣ token grid container

    // -----------------------------------------------------------------
    // 12️⃣ Helper – rebuild the token grid
    // -----------------------------------------------------------------
    function rebuildTokenGrid() {
        // -----------------------------------------------------------------
        // 0️⃣ Reset global collections and clear the visual container
        // -----------------------------------------------------------------
        tokenEls = [];
        transEls = [];
        scrollWrapper.innerHTML = '';

        // -----------------------------------------------------------------
        // 1️⃣ Build lookup maps from UI inputs (Display vs Repeats)
        // -----------------------------------------------------------------
        const displayMap = {};
        const speakMapTmp = {};
        const repeatMapTmp = {};

        orderedLangs.forEach(l => {
            const dCb = displayBoxes.get(l);
            const rIn = repeatBoxes.get(l);

            // Display is true if checked
            displayMap[l] = dCb ? dCb.checked : false;

            // Repeat is a number (default 0)
            const rpt = parseInt(rIn?.value || 0, 10);
            repeatMapTmp[l] = rpt;

            // ✨ LOGIC: If repeat count > 0, it belongs in the speak loop
            speakMapTmp[l] = rpt > 0;
        });

        // Ensure safety: always show at least the first language
        if (!Object.values(displayMap).some(Boolean)) {
            displayMap[orderedLangs[0]] = true;
            // If we force display, let's assume the user might want to hear it too
            if (repeatMapTmp[orderedLangs[0]] === 0) {
                repeatMapTmp[orderedLangs[0]] = 1;
                speakMapTmp[orderedLangs[0]] = true;
            }
        }

        // Assign to exercise-level globals
        speakMap = speakMapTmp;
        repeatMap = repeatMapTmp;

        // Debug log to verify maps are ready before token creation
        console.log("Rebuild: Syncing maps to Controller...");
        console.table(repeatMapTmp);

        // -----------------------------------------------------------------
        // 2️⃣ Walk through the JSON data and create columns / sections
        // -----------------------------------------------------------------
        let currentSectionContainer = null;

        data.forEach(entry => {
            // --- SECTION HEADERS ---
            if (entry.section) {
                const detailsEl = document.createElement('details');
                detailsEl.className = 'section-details';
                detailsEl.style.display = 'block';
                detailsEl.dataset.secId = `sec-${sectionsMap.size}`;
                detailsEl.dataset.headerId = entry.id;

                const testBtn = document.createElement('button');
                testBtn.textContent = locale.testYourself || 'Test yourself';
                testBtn.className = 'test-section-btn';
                testBtn.onclick = (e) => {
                    e.stopPropagation();
                    const targetId = detailsEl.dataset.headerId;
                    const headerIdx = data.findIndex(item => item && item.id && String(item.id) === String(targetId));
                    if (headerIdx !== -1) launchSectionQuiz(headerIdx);
                };

                detailsEl.appendChild(testBtn);

                const summaryEl = document.createElement('summary');
                summaryEl.className = 'section-header';
                summaryEl.textContent = entry.section[uiLang] || entry.section.en || Object.values(entry.section)[0] || '';
                detailsEl.appendChild(summaryEl);

                const tokenWrapper = document.createElement('div');
                tokenWrapper.className = 'section-tokens';
                detailsEl.appendChild(tokenWrapper);

                sectionsMap.set(detailsEl.dataset.secId, {
                    entry,
                    tokenEls: [],
                    transEls: []
                });
                currentSectionContainer = tokenWrapper;
                scrollWrapper.appendChild(detailsEl);
            }

            // --- TOKEN ROWS ---
            const sourceTokens = entry[orderedLangs[0]] || [];

            sourceTokens.forEach((srcWord, idx) => {
                const translations = [];
                const langs = [];
                let hasNewline = false;

                orderedLangs.forEach(lang => {
                    if (!displayMap[lang]) return;
                    const arr = entry[lang] || [];
                    const txt = arr[idx] ?? '';
                    translations.push(txt);
                    langs.push(lang);
                    if (typeof txt === 'string' && txt.includes('\n')) hasNewline = true;
                });

                if (translations.length === 0) {
                    translations.push(srcWord || '');
                    langs.push(orderedLangs[0]);
                }

                // buildTokenColumn pushes elements into the global tokenEls/transEls arrays
                const col = buildTokenColumn(translations, langs, displayMap);

                if (currentSectionContainer) {
                    currentSectionContainer.appendChild(col);
                } else {
                    scrollWrapper.appendChild(col);
                }

                // Associate tokens with their parent section for the Quiz
                if (currentSectionContainer && currentSectionContainer.parentElement) {
                    const secId = currentSectionContainer.parentElement.dataset.secId;
                    const secInfo = sectionsMap.get(secId);
                    if (secInfo) {
                        secInfo.tokenEls.push(col);
                        const colIdx = tokenEls.length - 1;
                        secInfo.transEls.push(transEls[colIdx] || []);
                    }
                }

                if (hasNewline) {
                    const newWrapper = document.createElement('div');
                    newWrapper.className = 'section-tokens';
                    if (currentSectionContainer && currentSectionContainer.parentElement) {
                        currentSectionContainer.parentElement.appendChild(newWrapper);
                        currentSectionContainer = newWrapper;
                    } else {
                        scrollWrapper.appendChild(newWrapper);
                        currentSectionContainer = newWrapper;
                    }
                }
            });
        });

        // -----------------------------------------------------------------
        // 3️⃣ Sync everything with the speech controller
        // -----------------------------------------------------------------
        if (speechCtrl) {
            // Push the new DOM elements
            speechCtrl.updateElements(tokenEls, transEls);
            // Push the new logic maps
            console.log("Pushing to Controller now...");
            speechCtrl.updateSpeakMap(speakMap);
            speechCtrl.updateRepeatMap(repeatMap);

            // Highlight current position (usually 0 after a rebuild)
            speechCtrl.setActiveElements(tokenEls, transEls);
        } else {
            console.error("CRITICAL: rebuildTokenGrid tried to sync but speechCtrl is NULL");
        }
    }

    async function launchSectionQuiz(headerIdx) {
        const exId = exerciseMeta.id;
        const sectionData = data[headerIdx];

        if (!sectionData) {
            console.error("Section data not found for index:", headerIdx);
            return;
        }

        // --- NEW: Capture the Section Title ---
        // Assuming your data has a 'header' object with language keys
        const sectionTitle = sectionData.header ? (sectionData.header[uiLang] || sectionData.header['en'] || "") : "";

        const firstKey = Object.keys(sectionData).find(k => Array.isArray(sectionData[k]));
        const rowsForQuiz = sectionData[firstKey].map((_, i) => {
            const row = { id: `section-${headerIdx}-${i}` };
            Object.keys(sectionData).forEach(key => {
                if (Array.isArray(sectionData[key])) {
                    row[key] = sectionData[key][i] || "";
                }
            });
            return row;
        });

        // --- UPDATED: Store as an object so we can pass the title too ---
        const quizPayload = {
            title: sectionTitle,
            rows: rowsForQuiz
        };
        sessionStorage.setItem('custom_quiz_data', JSON.stringify(quizPayload));

        // Ensure this matches your NEW router path in router.js
        const targetPath = `/${uiLang}/quiz/${exId}`;

        if (window.router && typeof window.router.navigate === 'function') {
            window.router.navigate(targetPath);
        } else {
            window.location.hash = `#${targetPath}`;
        }
    }

    // -----------------------------------------------------------------
    // 15️⃣  Initial render of the grid (populate tokenEls / transEls)
    // -----------------------------------------------------------------

    // 1. Call rebuild. This populates tokenEls/transEls AND 
    // internally calls speechCtrl.updateRepeatMap with the CORRECT data.
    rebuildTokenGrid();

    // 2. Final visual sync to ensure the controller knows which elements to highlight.
    if (speechCtrl) {
        speechCtrl.setActiveElements(tokenEls, transEls);
    }

}


// -----------------------------------------------------------------
// Export the entry point (the router calls this)
// -----------------------------------------------------------------
export async function initDictionaryExercise(main, exerciseMeta, uiLang) {
    await renderDictionaryExercise(main, exerciseMeta, uiLang);
}