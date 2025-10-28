// ---------------------------------------------------------------
// app/ui/dictionaryExercise.js
// ---------------------------------------------------------------
// Render a “dictionary”‑type exercise (exercise id = "01").
// ---------------------------------------------------------------

import { loadJSON } from "../utils/fetch.js";
import { getLocale, LANGUAGE_LABELS, SUPPORTED_LANGS } from "../data/locales.js";
import { ensureVoiceForExercise } from "../utils/voiceHelper.js";
import { speakText, populateVoiceList } from "../utils/speech.js";

let locale;                                 // ← will hold the UI‑language object for the current page
import { setStoredVoice } from "../utils/storage.js";

let playBtn;      // Play button in the speech panel
let pauseBtn;     // Pause button in the speech panel
let resetBtn;     // Reset button in the speech panel
let delayInput;   // Delay <input> in the speech panel

//let locale;          // UI‑language object (filled inside renderDictionaryExercise)
let statusEl;        // the status `<div>` inside the speech panel
let controlsRow;    // the row that holds Play / Pause / Reset / Delay
let statusVoiceRow; // the row that holds the status line + voice selector
/* -----------------------------------------------------------------
   GLOBAL UI state – only the arrays that the controller needs.
   ----------------------------------------------------------------- */
let tokenEls = []; // one element per column (the column <div> itself)
let transEls = []; // 2‑dimensional: transEls[colIdx][langIdx] = <span>

/* -----------------------------------------------------------------
   Playback state – moved **above** the stop‑speech helper so the
   helper can modify it directly when navigation occurs.
   ----------------------------------------------------------------- */
const state = {
    tokenIdx: 0,          // current column index
    transIdx: -1,         // -1 = source token, >=0 = translation index
    playing: false,
    paused: false,
    delaySec: 1,
    voiceName: null,
    tokenEls: [],         // will be filled by rebuildTokenGrid()
    transEls: []          // will be filled by rebuildTokenGrid()
};

/* -----------------------------------------------------------------
   Abort flag & pending‑wait resolver – used to stop playback instantly.
   ----------------------------------------------------------------- */
let stopRequested = false;          // set to true when navigation occurs
let pendingTimeoutId = null;        // ID from setTimeout (used by wait())
let pendingWaitResolve = null;      // resolve function for the current wait()

/* -----------------------------------------------------------------
   Helper – stop any ongoing speech and reset the controller UI.
   This function is exposed globally so the toolbar, router, and
   page‑unload handler can call it without importing this module.
   ----------------------------------------------------------------- */
function stopAllSpeech() {
    // 1️⃣ Cancel any utterance that might already be playing.
    if (typeof speechSynthesis !== "undefined") {
        speechSynthesis.cancel();   // abort any queued utterance
    }

    // 2️⃣ Signal the playback loop to abort.
    stopRequested = true;

    // 3️⃣ Also clear the internal playback state.
    state.playing = false;
    state.paused = false;

    // 4️⃣ Resolve any pending wait() so the async loop can exit.
    if (pendingWaitResolve) {
        pendingWaitResolve();
        pendingWaitResolve = null;
    }

    // 5️⃣ Clear the timeout (if it still exists).
    if (pendingTimeoutId !== null) {
        clearTimeout(pendingTimeoutId);
        pendingTimeoutId = null;
    }
}

/* -----------------------------------------------------------------
   Helper – tiny wrapper around setTimeout that also stores the
   resolve function so we can finish the wait early when navigation
   occurs.
   ----------------------------------------------------------------- */
function wait(sec) {
    return new Promise(resolve => {
        pendingWaitResolve = resolve;
        pendingTimeoutId = setTimeout(() => {
            pendingTimeoutId = null;
            pendingWaitResolve = null;
            resolve();
        }, sec * 1000);
    });
}

/* -----------------------------------------------------------------
   Build a column that holds the translations for ONE source token.
   ----------------------------------------------------------------- */
function buildTokenColumn(translations, langs, displayMap) {
    const col = document.createElement("div");
    col.className = "token-col";
    col.style.display = "flex";
    col.style.flexDirection = "column";
    col.style.alignItems = "center";
 //   col.style.margin = "0 0.5rem";

    // -----------------------------------------------------------------
    // 1️⃣  Create a <span> only for displayed languages.
    // -----------------------------------------------------------------
    translations.forEach((txt, idx) => {
        const lang = langs[idx];
        if (!displayMap[lang]) return;               // skip hidden languages

        const span = document.createElement("span");
        span.className = "trans";
        span.textContent = txt || "";
        span.style.fontSize = "1rem";
        span.setAttribute("lang", lang);

        col.appendChild(span);

        // Register for the playback loop.
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
        // Start playback from the clicked token/translation.
        startFrom(tokenIdx, transIdx);
    };

    col.addEventListener("click", (ev) => {
        if (ev.target.classList.contains("trans")) clickHandler(ev);
    });

    return col;
}


// -----------------------------------------------------------------
// UI helpers – status line, enable/disable panel, highlight.
// -----------------------------------------------------------------
function setStatus(key) {
    // `locale` is the localisation object that was created at the
    // start of renderDictionaryExercise (it already reflects the UI
    // language the user selected).
    const txt = locale[key] ?? {
        statusPlaying: 'Playing',
        statusPaused: 'Paused',
        statusVoiceChange: 'Voice changed'
    }[key] ?? key;

    statusEl.textContent = txt;
}

function setPanelEnabled(enabled, message) {
    controlsRow.style.pointerEvents = enabled ? "" : "none";
    statusVoiceRow.style.pointerEvents = enabled ? "" : "none";

    controlsRow.querySelectorAll("button,input,select").forEach(el => {
        el.disabled = !enabled;
        el.style.opacity = enabled ? "" : "0.5";
    });

    if (typeof message !== "undefined") statusEl.textContent = message;
}

function clearHighlights() {
    tokenEls.forEach(el => (el.style.background = ""));
    transEls.flat().forEach(el => (el.style.background = ""));
}

function highlightCurrent() {
    clearHighlights();
    const t = state.tokenIdx;
    const tr = state.transIdx;
    if (t < 0 || t >= tokenEls.length) return;
    if (tr === -1) {
        tokenEls[t].style.background = "var(--link)";
    } else {
        const el = transEls[t][tr];
        if (el) el.style.background = "var(--link)";
    }
}


// -----------------------------------------------------------------
// Playback loop – respects the `stopRequested` flag.
// -----------------------------------------------------------------
async function playbackLoop() {
    // Reset abort flag for a fresh run.
    stopRequested = false;

    state.playing = true;
    setStatus("statusPlaying");
    playBtn.disabled = true;

    while (state.playing && !stopRequested && state.tokenIdx < tokenEls.length) {
        const tIdx = state.tokenIdx;
        const col = tokenEls[tIdx];               // <div class="token-col">
        const spans = state.transEls[tIdx];        // array of <span>

        // ---------------------------------------------------------
        // 1️⃣  SOURCE token (transIdx === -1)
        // ---------------------------------------------------------
        if (state.transIdx === -1) {
            const srcSpan = col.querySelector(".trans");
            const srcLang = srcSpan?.getAttribute("lang");

            if (srcLang && state.speakMap[srcLang]) {
                highlightCurrent();
                await speakText(srcSpan.textContent, state.voiceName, srcLang);
                await wait(state.delaySec);
            }
            state.transIdx = 0;
            continue;
        }

        // ---------------------------------------------------------
        // 2️⃣  TRANSLATION spans (transIdx >= 0)
        // ---------------------------------------------------------
        if (state.transIdx < spans.length) {
            const span = spans[state.transIdx];
            const lang = span.getAttribute("lang");

            if (!state.speakMap[lang]) {
                state.transIdx += 1;
                continue;
            }

            highlightCurrent();
            const txt = span.textContent.trim();
            if (txt) {
                await speakText(txt, state.voiceName, lang);
                await wait(state.delaySec);
            }
            state.transIdx += 1;
            continue;
        }

        // ---------------------------------------------------------
        // 3️⃣  Advance to next token
        // ---------------------------------------------------------
        state.tokenIdx += 1;
        state.transIdx = -1;
    }

    // -------------------------------------------------------------
    // End of playback – clear status unless we are paused.
    // -------------------------------------------------------------
    if (!state.paused) setStatus("");
    state.playing = false;
    setPanelEnabled(true);
    playBtn.disabled = false;
}

/* -----------------------------------------------------------------
   Helper – start playback from a specific token / translation.
   ----------------------------------------------------------------- */
function startFrom(tokenIdx, transIdx) {
    // Abort any current playback first.
    if (state.playing) {
        stopAllSpeech();
    }
    state.tokenIdx = tokenIdx;
    state.transIdx = transIdx;
    // Kick off the playback loop.
    playbackLoop().catch(console.warn);
}

/* -----------------------------------------------------------------
   Main entry – render the dictionary exercise inside the provided <main>.
   ----------------------------------------------------------------- */
export async function renderDictionaryExercise(container, exerciseMeta, uiLang) {
    // -----------------------------------------------------------------
    // 1️⃣ Load the JSON payload for the exercise
    // -----------------------------------------------------------------
    const jsonPath = `/app/${exerciseMeta.folder}/${exerciseMeta.file}`;
    const data = await loadJSON(jsonPath); // array of objects

    // -----------------------------------------------------------------
    // 2️⃣ Determine the real language of the exercise (source language)
    // -----------------------------------------------------------------
    const exerciseLang = exerciseMeta.language || uiLang; // fallback to UI language

    // -----------------------------------------------------------------
    // 3️⃣ Prepare the token grid (will be rebuilt on every checkbox change)
    // -----------------------------------------------------------------
    const tokenGrid = document.createElement("div");
    tokenGrid.className = "dict-grid";
    tokenGrid.style.display = "flex";
    tokenGrid.style.flexWrap = "wrap";
    tokenGrid.style.justifyContent = "flex-start"; // left‑align rows
    tokenGrid.style.gap = "1rem";
 //   tokenGrid.style.padding = "0 1rem 1rem 1rem";
    tokenGrid.style.overflowY = "auto";

    // -----------------------------------------------------------------
    // 4️⃣ Internationalised UI strings (using the UI language)
    // -----------------------------------------------------------------
    locale = getLocale(uiLang);

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
    //  details.style.fontSize = "0.85rem";
    // details.style.margin = "0.15rem";
    // details.style.padding = "0.15rem";

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
    const displayHeader = document.createElement("h4");
    const speakHeader = document.createElement("h4");
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
        const langCell = document.createElement("h4");
        langCell.textContent = langLabel;
        optionsGrid.appendChild(langCell);

        // Display checkbox
        const displayCell = document.createElement("div");
        const displayCb = document.createElement("input");
        displayCb.type = "checkbox";
        displayCb.dataset.lang = langCode;
        displayCb.checked = (langCode === exerciseLang); // only source language on start
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
    // 8️⃣ Create the **player control panel** (outside the <details>)
    // -----------------------------------------------------------------
    const playerPanel = document.createElement("div");
 //   playerPanel.style.padding = "0.5rem";
    playerPanel.style.border = "1px solid var(--border-surface)";
    playerPanel.id = "speechPanel";

    // ---- Controls row (Play / Pause / Reset / Delay)
    controlsRow = document.createElement("div");   // ← module‑level
    controlsRow.style.display = "flex";
    controlsRow.style.alignItems = "center";
    controlsRow.style.gap = "0.5rem";
    playerPanel.appendChild(controlsRow);

    playBtn = document.createElement("button");   // assign to module‑level variable
    playBtn.title = locale.playButton || "Play";
    playBtn.textContent = "▶️";
    controlsRow.appendChild(playBtn);

    pauseBtn = document.createElement("button");   // assign to module‑level variable
    pauseBtn.title = locale.pauseButton || "Pause";
    pauseBtn.textContent = "⏸️";
    controlsRow.appendChild(pauseBtn);

    pauseBtn = document.createElement("button");   // assign to module‑level variable

    resetBtn = document.createElement("button");   // assign to module‑level variable
    resetBtn.title = locale.resetButton || "Reset";
    resetBtn.textContent = "🔄";
    controlsRow.appendChild(resetBtn);

    const delayLabel = document.createElement("label");
    delayLabel.textContent = locale.delayLabel || "Delay (s):";
    controlsRow.appendChild(delayLabel);

    delayInput = document.createElement("input");   // assign to module‑level variable
    delayInput.type = "number";
    delayInput.min = "1";
    delayInput.max = "5";
    delayInput.step = "0.1";
    delayInput.value = state.delaySec;
    delayInput.style.width = "3rem";
    controlsRow.appendChild(delayInput);

    // ---- Status / voice selector row ----
    statusVoiceRow = document.createElement("div");   // ← module‑level
    statusVoiceRow.style.display = "flex";
    statusVoiceRow.style.alignItems = "center";
    statusVoiceRow.style.gap = "0.5rem";
 //   statusVoiceRow.style.marginTop = "0.5rem";
    playerPanel.appendChild(statusVoiceRow);

    statusEl = document.createElement("div");   // ← assign to the module‑level variable

    statusEl.style.flex = "0 0 25%";
    statusEl.style.minHeight = "1.2rem";
    statusEl.style.fontStyle = "italic";
    //   statusEl.style.fontSize = "0.8rem";
    statusEl.style.border = "1px solid var(--border-surface)";
    statusEl.style.borderRadius = "4px";
    statusEl.style.background = "var(--bg-surface, #fff)";
    statusVoiceRow.appendChild(statusEl);

    const voiceSelect = document.createElement("select");
    voiceSelect.id = "voiceSelect";
    voiceSelect.style.flex = "0 0 75%";
 //   voiceSelect.style.padding = "0.11rem";
    statusVoiceRow.appendChild(voiceSelect);

    // -----------------------------------------------------------------
    // 9️⃣ Re‑build the token grid based on the current checkbox state
    // -----------------------------------------------------------------
    function rebuildTokenGrid() {
        // Reset global collections and clear the visual grid.
        tokenEls = [];
        transEls = [];
        tokenGrid.innerHTML = "";

        // Build lookup maps from the check‑boxes.
        const displayMap = {}; // lang → true/false
        const speakMap = {};   // lang → true/false (used by the controller)

        orderedLangs.forEach(l => {
            const dCb = displayBoxes.get(l);
            const sCb = speakBoxes.get(l);
            displayMap[l] = dCb ? dCb.checked : false;
            speakMap[l] = sCb ? sCb.checked : false;
        });

        // Ensure at least one language is displayed.
        if (!Object.values(displayMap).some(Boolean)) {
            displayMap[orderedLangs[0]] = true;
            speakMap[orderedLangs[0]] = true;
        }

        // Walk through the JSON data and create a column for each token.
        data.forEach(entry => {
            // Optional category heading
            if (entry.category) {
                const catDiv = document.createElement("h5");
                catDiv.className = "category-header";
                catDiv.textContent = entry.category;
                catDiv.style.flex = "0 0 100%";
                tokenGrid.appendChild(catDiv);
            }

            const sourceTokens = entry[orderedLangs[0]] || [];

            sourceTokens.forEach((srcWord, idx) => {
                const translations = [];
                const langs = [];

                orderedLangs.forEach(lang => {
                    if (!displayMap[lang]) return; // skip hidden languages
                    const arr = entry[lang] || [];
                    translations.push(arr[idx] ?? "");
                    langs.push(lang);
                });

                // Safety fallback – source language is always shown.
                if (translations.length === 0) {
                    const srcArr = entry[orderedLangs[0]] || [];
                    translations.push(srcArr[idx] ?? "");
                    langs.push(orderedLangs[0]);
                }

                const col = buildTokenColumn(translations, langs, displayMap);
                tokenGrid.appendChild(col);
            });
        });

        // Store the speak map in state for the playback loop.
        state.speakMap = speakMap;

        // Synchronise the freshly built arrays with the state object
        state.tokenEls = tokenEls;
        state.transEls = transEls;
    }


    // -----------------------------------------------------------------
    // Initial render of the token grid and attach UI to the page.
    // -----------------------------------------------------------------
    rebuildTokenGrid();

    // -------------------------------------------------------------
    // ✅  Attach the UI pieces to the page.
    // -------------------------------------------------------------
    //   * language‑options panel (`details`)
    //   * player control panel (`playerPanel`)
    //   * token grid (`tokenGrid`)
    // -------------------------------------------------------------
    container.appendChild(details);
    container.appendChild(playerPanel);
    container.appendChild(tokenGrid);

    // -------------------------------------------------------------
    // UI event wiring (play / pause / reset / delay / voice selector)
    // -------------------------------------------------------------
    playBtn.onclick = () => {
        if (state.playing) return;
        playBtn.disabled = true;
        state.paused = false;
        playbackLoop().catch(console.warn);
    };

    pauseBtn.onclick = () => {
        if (!state.playing) return;
        if ("speechSynthesis" in window) speechSynthesis.cancel();
        state.playing = false;
        state.paused = true;
        setStatus("statusPaused");
        // Re‑enable the Play button so the user can resume.
        playBtn.disabled = false;
    };

    resetBtn.onclick = () => {
        if ("speechSynthesis" in window) speechSynthesis.cancel();
        state.tokenIdx = 0;
        state.transIdx = -1;
        state.playing = false;
        state.paused = false;
        clearHighlights();
        setStatus("statusPlaying");
        playbackLoop().catch(console.warn);
    };

    delayInput.oninput = () => {
        const v = parseFloat(delayInput.value);
        if (!isNaN(v) && v >= 1 && v <= 5) state.delaySec = v;
    };

    // Populate voice list (once) and handle voice changes.
    populateVoiceList(voiceSelect, SUPPORTED_LANGS);
    voiceSelect.addEventListener("change", ev => {
        const newVoice = ev.target.value;
        if ("speechSynthesis" in window) speechSynthesis.cancel();

        state.voiceName = newVoice;
        try {
            setStoredVoice(newVoice);
        } catch (e) {
            console.warn("[Speech] could not persist voice:", e);
        }

        // Show temporary “Voice change” status.
        setStatus("statusVoiceChange");
        setPanelEnabled(false);

        setTimeout(() => {
            setPanelEnabled(true);
            setStatus("");               // clear the temporary message
        }, 2000);
    });
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
    // 2️⃣  Render the shared header (toolbar + nav) and obtain <main>
    // -----------------------------------------------------------------
    const mainEl = await renderHeader(lang);
    mainEl.innerHTML = "";                     // clear any previous UI

    // -------------------------------------------------------------
    // 3️⃣  Render the dictionary UI inside that <main>
    // -------------------------------------------------------------
    await renderDictionaryExercise(mainEl, meta, lang);
}