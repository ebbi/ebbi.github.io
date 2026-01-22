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
import { state, setStatus } from '../utils/speechController.js';

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

export const repeatBoxes = new Map();

/* -----------------------------------------------------------------
   Helper – build a column that holds the translations for ONE source token.
   ----------------------------------------------------------------- */
function buildTokenColumn(translations, langs, displayMap) {
    const col = document.createElement('div');
    col.className = 'token-col';

    // 1️⃣ PUSH IMMEDIATELY so tokenEls.length is correct for colIdx
    const colIdx = tokenEls.length;
    tokenEls.push(col);
    transEls[colIdx] = []; // Initialize the translation row for this column

    translations.forEach((txt, idx) => {
        const lang = langs[idx];
        if (!displayMap[lang]) return;

        // NEW: handle "\n"
        if (typeof txt === 'string' && txt.includes('\n')) {
            const parts = txt.split('\n');
            parts.forEach((part, partIdx) => {
                const span = document.createElement('span');
                span.className = 'trans';
                span.textContent = part;
                span.setAttribute('lang', lang);
                col.appendChild(span);

                // Add to the row we initialized above
                transEls[colIdx].push(span);

                if (partIdx < parts.length - 1) {
                    const brDiv = document.createElement('div');
                    brDiv.className = 'dict-grid';
                    col.appendChild(brDiv);
                }
            });
            return;
        }

        // Normal span
        const outerSpan = document.createElement('span');
        outerSpan.className = 'trans';
        outerSpan.setAttribute('lang', lang);
        outerSpan.textContent = txt || '';
        col.appendChild(outerSpan);

        // Add to the row we initialized above
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
 //   tokenEls.push(col);
    return col;
}

/* -----------------------------------------------------------------
   Main entry – render the dictionary exercise inside the provided <main>.
   ----------------------------------------------------------------- */

/**
 * Main render function for Dictionary Exercise
 */
export async function renderDictionaryExercise(mainEl, exerciseMeta, uiLang) {

    // -----------------------------------------------------------------
    // 1️⃣ INITIALIZE DATA & STATE (Must happen first)
    // -----------------------------------------------------------------
    if (!state.repeatMap) state.repeatMap = {};

    const jsonPath = `/app/${exerciseMeta.folder}/${exerciseMeta.file}`;
    const data = await loadJSON(jsonPath);
    window.__debugData = data;

    const exerciseLang = exerciseMeta.language || uiLang;
    const locale = getLocale(uiLang);

    // Inject the locale into the speech state
    state.uiLocale = locale;

    // Derive languages from the JSON payload
    const rawLangKeys = Object.keys(data[0]).filter(
        (k) => k !== 'id' && k !== 'section' && k !== 'tokens'
    );

    const orderedLangs = [
        exerciseLang,
        ...rawLangKeys.filter(l => l !== exerciseLang)
    ];

    // Sync state.repeatMap with available languages
    orderedLangs.forEach(langCode => {
        if (state.repeatMap[langCode] === undefined) {
            state.repeatMap[langCode] = (langCode === exerciseLang) ? 1 : 0;
        }
    });

    // -----------------------------------------------------------------
    // 2️⃣ PREPARE UI CONTAINERS
    // -----------------------------------------------------------------
    const scrollWrapper = document.createElement('div');
    scrollWrapper.className = 'dict-scroll-wrapper';

    // -----------------------------------------------------------------
    // 3️⃣ BUILD LANGUAGE OPTIONS GRID
    // -----------------------------------------------------------------
    const langDetails = document.createElement('details');
    langDetails.id = 'language-options';

    const langSummary = document.createElement('summary');
    langSummary.textContent = locale.languageOptions || 'Language options';
    langDetails.appendChild(langSummary);

    const optionsGrid = document.createElement('div');
    optionsGrid.className = 'options-grid';
    optionsGrid.style.gridTemplateColumns = '1fr 1fr 1fr';
    langDetails.appendChild(optionsGrid);

    // Headers
    [locale.language || 'Language', locale.display || 'Display', locale.repeat || 'Repeat'].forEach(text => {
        const h = document.createElement('h4');
        h.textContent = text;
        optionsGrid.appendChild(h);
    });

    const displayBoxes = new Map();
    repeatBoxes.clear(); // Using the exported Map from top of file

    orderedLangs.forEach(langCode => {
        const langLabel = LANGUAGE_LABELS[langCode] || langCode.toUpperCase();

        const langCell = document.createElement('h4');
        langCell.textContent = langLabel;
        optionsGrid.appendChild(langCell);

        const displayCell = document.createElement('div');
        const displayCb = document.createElement('input');
        displayCb.type = 'checkbox';
        displayCb.checked = (langCode === exerciseLang) || (langCode === uiLang) || (state.repeatMap[langCode] > 0);
        displayCell.appendChild(displayCb);
        optionsGrid.appendChild(displayCell);
        displayBoxes.set(langCode, displayCb);

        const repeatCell = document.createElement('div');
        const repeatInput = document.createElement('input');
        repeatInput.type = 'number';
        repeatInput.min = '0';
        repeatInput.max = '5';
        repeatInput.value = state.repeatMap[langCode] || 0;
        repeatInput.style.width = '3rem';
        repeatCell.appendChild(repeatInput);
        optionsGrid.appendChild(repeatCell);
        repeatBoxes.set(langCode, repeatInput);

        // Interaction Listeners
        displayCb.addEventListener('change', () => {
            if (!displayCb.checked) {
                repeatInput.value = 0;
                delete state.repeatMap[langCode];
            } else {
                if (!state.repeatMap[langCode]) {
                    state.repeatMap[langCode] = 1;
                    repeatInput.value = 1;
                }
            }
            rebuildTokenGrid();
            if (state.playing && typeof setStatus === 'function') setStatus("statusPlaying");
        });

        repeatInput.addEventListener('change', () => {
            const val = parseInt(repeatInput.value) || 0;
            if (val > 0) {
                displayCb.checked = true;
                state.repeatMap[langCode] = val;
            } else {
                delete state.repeatMap[langCode];
            }
            rebuildTokenGrid();
            if (state.playing && typeof setStatus === 'function') setStatus("statusPlaying");
        });
    });

    // -----------------------------------------------------------------
    // 4️⃣ SPEECH CONTROLLER SETUP
    // -----------------------------------------------------------------
    const main = document.getElementById('main');
    const speechPanel = getOrCreateSpeechPanel(main);
    speechPanel.textContent = "";

    speechCtrl = createSpeechController(speechPanel, {
        getAvailableLanguages: () => SUPPORTED_LANGS,
        defaultLang: exerciseLang,
        onVoiceChange: (v) => { try { localStorage.setItem('local_storage_tts_voice', v); } catch (_) { } }
    });

    const playerSetting = speechPanel.querySelector('#player-settings');
    if (playerSetting) playerSetting.appendChild(langDetails);

    // -----------------------------------------------------------------
    // 5️⃣ ASSEMBLE PAGE
    // -----------------------------------------------------------------
    mainEl.innerHTML = '';
    mainEl.appendChild(speechPanel);
    mainEl.appendChild(scrollWrapper);

    // -----------------------------------------------------------------
    // 6️⃣ REBUILD TOKEN GRID (Logic for column generation)
    // -----------------------------------------------------------------
    function rebuildTokenGrid() {
        tokenEls = [];
        transEls = [];
        scrollWrapper.innerHTML = '';

        const displayMap = {};

        // --- Sync repeatMap from UI inputs ---
        orderedLangs.forEach(l => {
            const dCb = displayBoxes.get(l);
            const rIn = repeatBoxes.get(l);
            displayMap[l] = dCb ? dCb.checked : false;

            if (displayMap[l] && rIn) {
                state.repeatMap[l] = parseInt(rIn.value) || 0;
            } else {
                state.repeatMap[l] = 0;
            }
        });

        if (!Object.values(displayMap).some(Boolean)) {
            displayMap[orderedLangs[0]] = true;
            if (displayBoxes.get(orderedLangs[0])) {
                displayBoxes.get(orderedLangs[0]).checked = true;
                state.repeatMap[orderedLangs[0]] = 1;
            }
        }

        let currentSectionContainer = null;
        data.forEach(entry => {
            if (entry.section) {
                // ... (Section creation logic remains the same)
                const detailsEl = document.createElement('details');
                detailsEl.className = 'section-details';
                detailsEl.open = true;
                const secId = `sec-${sectionsMap.size}`;
                detailsEl.dataset.secId = secId;
                detailsEl.dataset.headerId = entry.id;

                const summaryEl = document.createElement('summary');
                summaryEl.className = 'section-header';
                summaryEl.textContent = entry.section[uiLang] || entry.section.en || "";

                const testBtn = document.createElement('button');
                testBtn.textContent = locale.testYourself || 'Test yourself';
                testBtn.className = 'test-section-btn';
                testBtn.onclick = (e) => {
                    e.stopPropagation();
                    const targetId = detailsEl.dataset.headerId;
                    const headerIdx = data.findIndex(item => item && item.id === targetId);
                    if (headerIdx !== -1) launchSectionQuiz(headerIdx);
                };
                summaryEl.appendChild(testBtn);
                detailsEl.appendChild(summaryEl);

                const tokenWrapper = document.createElement('div');
                tokenWrapper.className = 'section-tokens';
                detailsEl.appendChild(tokenWrapper);

                sectionsMap.set(secId, { entry, tokenEls: [], transEls: [] });
                currentSectionContainer = tokenWrapper;
                scrollWrapper.appendChild(detailsEl);
            }

            const sourceTokens = entry[orderedLangs[0]] || [];

            // --- 1️⃣ FILTERING LOGIC STARTS HERE ---
            sourceTokens.forEach((tokenText, idx) => {

                // Skip the index if the source token is exactly a newline
                if (tokenText === "\n") {
                    // If you want a visual line break in the grid, uncomment below:
                    /*
                    const br = document.createElement('div');
                    br.style.flexBasis = '100%';
                    br.style.height = '0';
                    if (currentSectionContainer) currentSectionContainer.appendChild(br);
                    */
                    return;
                }

                const translations = [];
                const langs = [];

                orderedLangs.forEach(lang => {
                    if (!displayMap[lang]) return;
                    const txt = (entry[lang] || [])[idx] ?? '';
                    translations.push(txt);
                    langs.push(lang);
                });

                // --- 2️⃣ BUILDING THE COLUMN ---
                const col = buildTokenColumn(translations, langs, displayMap);

                if (currentSectionContainer) {
                    currentSectionContainer.appendChild(col);
                    const secId = currentSectionContainer.parentElement.dataset.secId;
                    const secInfo = sectionsMap.get(secId);
                    if (secInfo) {
                        secInfo.tokenEls.push(col);
                        // buildTokenColumn pushes to global arrays; use length-1 to sync
                        secInfo.transEls.push(transEls[tokenEls.length - 1] || []);
                    }
                } else {
                    scrollWrapper.appendChild(col);
                }
            });
        });

        if (speechCtrl) {
            speechCtrl.updateElements(tokenEls, transEls);
            speechCtrl.updateRepeatMap(state.repeatMap);
        }
    }

    // -----------------------------------------------------------------
    // 7️⃣ LAUNCH SECTION QUIZ
    // -----------------------------------------------------------------
    async function launchSectionQuiz(headerIdx) {
        const sectionData = data[headerIdx];
        if (!sectionData) return;

        const sectionTitle = sectionData.section ? (sectionData.section[uiLang] || sectionData.section['en'] || "") : "";

        // Collect rows belonging to this section
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

        const quizPayload = { title: sectionTitle, rows: rowsForQuiz };
        sessionStorage.setItem('custom_quiz_data', JSON.stringify(quizPayload));

        const targetPath = `/${uiLang}/quiz/${exerciseMeta.id}`;
        window.router.navigate(targetPath);
    }

    // Initial trigger
    rebuildTokenGrid();
}

// -----------------------------------------------------------------
// Export the entry point (the router calls this)
// -----------------------------------------------------------------
export async function initDictionaryExercise(main, exerciseMeta, uiLang) {
    await renderDictionaryExercise(main, exerciseMeta, uiLang);
}