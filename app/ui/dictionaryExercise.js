// ---------------------------------------------------------------
// app/ui/dictionaryExercise.js
// ---------------------------------------------------------------
// Render a “dictionary”‑type exercise (exercise id = "01").
// ---------------------------------------------------------------
import { speakText } from '../utils/speech.js';
import { loadJSON } from '../utils/fetch.js';
import { renderHeader } from './renderHeader.js';
import { getLocale, LANGUAGE_LABELS } from '../data/locales.js';
import { SUPPORTED_LANGS } from '../data/locales.js';
import { populateVoiceList } from '../utils/speech.js';
import { EXERCISES } from '../data/exercises.js';   // ← needed for Prev/Next navigation

/* === PATCH START === */
// -----------------------------------------------------------------
// 0️⃣  GLOBAL STATE for the player
// -----------------------------------------------------------------
let playerState = {
    // indices are **zero‑based**
    tokenIdx: 0,          // which Thai token we are on
    transIdx: -1,         // -1 means we are about to speak the Thai token,
    // 0..N‑1 are the selected translations
    playing: false,
    paused: false,
    delaySec: 1,          // default delay between utterances
    voiceName: null,      // name of the voice selected in the voice <select>
    // will be filled later with the DOM elements we need to highlight
    tokenEls: [],         // array of <span class="thai"> elements (order = tokenIdx)
    transEls: []          // 2‑dimensional: transEls[tokenIdx][langIdx] = <span>
};
/* === PATCH END === */

/**
 * Build the HTML for a single token column.
 *
 * @param {string} thaiWord          – the Thai token
 * @param {Array<string>} translations – parallel array of translations
 * @returns {HTMLElement} the column <div>
 */
function buildTokenColumn(thaiWord, translations) {
    const col = document.createElement('div');
    col.className = 'token-col';
    col.style.display = 'flex';
    col.style.flexDirection = 'column';
    col.style.alignItems = 'center';
    col.style.margin = '0 0.5rem';

    // Thai token – larger, bold
    const thaiSpan = document.createElement('span');
    thaiSpan.className = 'thai';
    thaiSpan.textContent = thaiWord;
    thaiSpan.style.fontWeight = 'bold';
    thaiSpan.style.fontSize = '1.2rem';
    thaiSpan.style.marginBottom = '0.4rem';
    col.appendChild(thaiSpan);

    // Store the Thai element for later highlighting
    /* === PATCH START === */
    playerState.tokenEls.push(thaiSpan);
    /* === PATCH END === */

    // Translations – each on its own line
    translations.forEach((t, i) => {
        const transSpan = document.createElement('span');
        transSpan.className = 'trans';
        transSpan.textContent = t || '';          // empty strings are fine
        transSpan.style.fontSize = '0.9rem';
        transSpan.style.color = 'var(--txt-secondary)';
        col.appendChild(transSpan);

        // Keep a reference for highlighting later
        /* === PATCH START === */
        if (!playerState.transEls[playerState.tokenEls.length - 1])
            playerState.transEls[playerState.tokenEls.length - 1] = [];
        playerState.transEls[playerState.tokenEls.length - 1].push(transSpan);
        /* === PATCH END === */
    });

    // -----------------------------------------------------------------
    // Click on any word (Thai or translation) → highlight & start from it
    // -----------------------------------------------------------------
    const clickHandler = (ev) => {
        // Find which token we clicked
        const tokenIndex = playerState.tokenEls.indexOf(thaiSpan);
        if (tokenIndex === -1) return;

        // Determine whether we clicked the Thai word or a translation
        const isThai = ev.target.classList.contains('thai');
        const transIndex = isThai ? -1 : Array.from(col.children).indexOf(ev.target) - 1; // -1 because first child is Thai

        // Update player state
        playerState.tokenIdx = tokenIndex;
        playerState.transIdx = transIndex;   // -1 → next utterance will be Thai
        highlightCurrent();                 // visual feedback
        // If we are already playing, we let the current utterance finish;
        // otherwise we start playing from the selected word.
        if (!playerState.playing) startPlaying();
    };
    thaiSpan.addEventListener('click', clickHandler);
    col.querySelectorAll('.trans').forEach(tr => tr.addEventListener('click', clickHandler));

    return col;
}

/* === PATCH START === */
// -----------------------------------------------------------------
// Helper: speak a string with the selected voice, returns a Promise
// -----------------------------------------------------------------
/* (the old inline version was removed – we now use the stateless
   `speakText` imported from ../utils/speech.js) */
// -----------------------------------------------------------------
function clearHighlights() {
    playerState.tokenEls.forEach(el => el.style.background = '');
    playerState.transEls.flat().forEach(el => el.style.background = '');
}
function highlightCurrent() {
    clearHighlights();
    const tIdx = playerState.tokenIdx;
    const trIdx = playerState.transIdx;
    if (tIdx < 0 || tIdx >= playerState.tokenEls.length) return;
    if (trIdx === -1) {
        // Thai token is highlighted
        playerState.tokenEls[tIdx].style.background = 'var(--link)';
    } else {
        const transEl = playerState.transEls[tIdx][trIdx];
        if (transEl) transEl.style.background = 'var(--link)';
    }
}

/* -----------------------------------------------------------------
   Core playback loop – walks through tokens & selected translations
   ----------------------------------------------------------------- */
async function playbackLoop() {
    playerState.playing = true;
    while (playerState.playing && playerState.tokenIdx < playerState.tokenEls.length) {
        const tIdx = playerState.tokenIdx;
        const transArray = playerState.transEls[tIdx]; // array of translation spans for this token

        // 1️⃣  Speak the Thai token (if we haven’t just spoken it)
        if (playerState.transIdx === -1) {
            highlightCurrent();
            const thaiText = playerState.tokenEls[tIdx].textContent;
            await speakText(thaiText, playerState.voiceName);
            await new Promise(r => setTimeout(r, playerState.delaySec * 1000));
            playerState.transIdx = 0;   // move to first translation
            continue;                  // go to the top of the loop to handle translation
        }

        // 2️⃣  Speak the selected translation (if any remain)
        if (playerState.transIdx < transArray.length) {
            const transSpan = transArray[playerState.transIdx];
            highlightCurrent();
            const txt = transSpan.textContent.trim();
            if (txt) {
                await speakText(txt, playerState.voiceName);
                await new Promise(r => setTimeout(r, playerState.delaySec * 1000));
            }
            playerState.transIdx += 1;
            continue;                  // stay on same token until all translations done
        }

        // 3️⃣  All translations for this token are done → advance to next token
        playerState.tokenIdx += 1;
        playerState.transIdx = -1;      // reset to Thai for the next token
    }
    playerState.playing = false;
    clearHighlights();
}

/* -----------------------------------------------------------------
   Public controls – called from the UI buttons
   ----------------------------------------------------------------- */
function startPlaying() {
    if (playerState.playing) return;   // already playing
    playerState.paused = false;
    playbackLoop().catch(console.warn);
}
function pausePlaying() {
    if (!playerState.playing) return;
    speechSynthesis.cancel();          // stop any ongoing utterance
    playerState.playing = false;
    playerState.paused = true;
}
function resetPlaying() {
    speechSynthesis.cancel();
    playerState.tokenIdx = 0;
    playerState.transIdx = -1;
    playerState.playing = false;
    playerState.paused = false;
    clearHighlights();
    startPlaying();
}

/* -----------------------------------------------------------------
   Build the navigation panel (Play / Pause / Reset / Delay + arrows)
   ----------------------------------------------------------------- */
function buildNavPanel(locale, uiLang) {
    const panel = document.createElement('div');
    panel.style.display = 'flex';
    panel.style.alignItems = 'center';
    panel.style.gap = '0.5rem';
    panel.style.margin = '0.5rem 1rem';

    // ---- Play button -------------------------------------------------
    const playBtn = document.createElement('button');
    playBtn.title = 'Play';
    playBtn.textContent = '▶️';
    playBtn.onclick = () => startPlaying();
    panel.appendChild(playBtn);

    // ---- Pause button ------------------------------------------------
    const pauseBtn = document.createElement('button');
    pauseBtn.title = 'Pause';
    pauseBtn.textContent = '⏸️';
    pauseBtn.onclick = () => pausePlaying();
    panel.appendChild(pauseBtn);

    // ---- Reset button ------------------------------------------------
    const resetBtn = document.createElement('button');
    resetBtn.title = 'Reset';
    resetBtn.textContent = '🔄';
    resetBtn.onclick = () => resetPlaying();
    panel.appendChild(resetBtn);

    // ---- Delay input -------------------------------------------------
    const delayLabel = document.createElement('label');
    delayLabel.textContent = locale.delay ?? 'Delay (s):';
    delayLabel.style.marginRight = '0.2rem';
    panel.appendChild(delayLabel);

    const delayInput = document.createElement('input');
    delayInput.type = 'number';
    delayInput.min = 1;
    delayInput.max = 5;
    delayInput.step = 0.1;
    delayInput.value = playerState.delaySec;
    delayInput.style.width = '3rem';
    delayInput.oninput = () => {
        const val = parseFloat(delayInput.value);
        if (!isNaN(val) && val >= 1 && val <= 5) {
            playerState.delaySec = val;
        }
    };
    panel.appendChild(delayInput);

    // ---- Arrow buttons (Prev / Next) ---------------------------------
    const prevBtn = document.createElement('button');
    prevBtn.title = locale.prevExercise ?? 'Previous';
    prevBtn.textContent = '←';
    prevBtn.style.marginLeft = '0.4rem';
    prevBtn.onclick = () => {
        const curId = window.router.current?.params?.id;
        if (!curId) return;
        const idx = EXERCISES.findIndex(e => e.id === curId);
        if (idx > 0) {
            const prevId = EXERCISES[idx - 1].id;
            window.router.navigate(`/${uiLang}/exercises/${prevId}`, true);
        }
    };
    panel.appendChild(prevBtn);

    const nextBtn = document.createElement('button');
    nextBtn.title = locale.nextExercise ?? 'Next';
    nextBtn.textContent = '→';
    nextBtn.style.marginLeft = '0.2rem';
    nextBtn.onclick = () => {
        const curId = window.router.current?.params?.id;
        if (!curId) return;
        const idx = EXERCISES.findIndex(e => e.id === curId);
        if (idx >= 0 && idx < EXERCISES.length - 1) {
            const nextId = EXERCISES[idx + 1].id;
            window.router.navigate(`/${uiLang}/exercises/${nextId}`, true);
        }
    };
    panel.appendChild(nextBtn);

    return panel;
}

/* -----------------------------------------------------------------
   maybeDisableControls – disables the whole nav panel when no matching
   SpeechSynthesis voices are available.
   ----------------------------------------------------------------- */
function maybeDisableControls(panel, locale, uiLang) {
    // -----------------------------------------------------------------
    // Helper that decides whether we have any usable TTS voice for the
    // languages supported by the app.  We look at the *actual* SpeechSynthesis
    // voice list, not just the <select> options (which may be empty while the
    // browser is still loading voices).
    // -----------------------------------------------------------------
    const evaluate = () => {
        // 1️⃣  Gather all voices known to the browser
        const allVoices = ('speechSynthesis' in window) ? speechSynthesis.getVoices() : [];

        // 2️⃣  Keep only those whose language matches one of the app languages
        const matching = allVoices.filter(v =>
            SUPPORTED_LANGS.includes(v.lang.slice(0, 2).toLowerCase())
        );

        const hasVoices = matching.length > 0;

        // -------------------------------------------------------------
        // 3️⃣  If we have at least one matching voice → enable everything.
        // -------------------------------------------------------------
        if (hasVoices) {
            // Remove any previously added warning/message
            const existingMsg = panel.querySelector('.no-voice-msg');
            if (existingMsg) existingMsg.remove();

            // Restore normal appearance & interactivity
            panel.style.pointerEvents = '';
            panel.querySelectorAll('button,input,select').forEach(el => {
                el.disabled = false;
                el.style.opacity = '';
            });
            return;
        }

        // -------------------------------------------------------------
        // 4️⃣  No matching voices → show the “Setup Speech” button.
        // -------------------------------------------------------------
        if (!panel.querySelector('.no-voice-msg')) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'no-voice-btn';
            btn.textContent = locale.speechSetup ?? 'Setup Speech';
            btn.style.background = 'var(--link)';
            btn.style.color = '#fff';
            btn.style.border = 'none';
            btn.style.padding = '0.4rem 0.8rem';
            btn.style.borderRadius = '4px';
            btn.style.cursor = 'pointer';
            btn.style.fontSize = '0.9rem';
            btn.style.marginTop = '0.5rem';
            btn.onclick = () => {
                // Navigate to the generic help page for the current UI language.
                window.router.navigate(`/${uiLang}/help`, true);
            };
            const wrapper = document.createElement('div');
            wrapper.className = 'no-voice-wrapper';
            wrapper.appendChild(btn);
            panel.appendChild(wrapper);
        }

        // -------------------------------------------------------------
        // 5️⃣  Dim *only* the interactive controls (play/pause/reset/delay)
        // -------------------------------------------------------------
        panel.style.pointerEvents = 'none';
        panel.querySelectorAll('button,input,select').forEach(el => {
            if (el.closest('.no-voice-wrapper')) {
                el.disabled = false;
                el.style.pointerEvents = 'auto';
                el.style.opacity = '1';
            } else {
                el.disabled = true;
                el.style.pointerEvents = 'none';
                el.style.opacity = '0.5';
            }
        });
    };

    // Run the check immediately (in case voices are already loaded)
    evaluate();

    // Re‑run whenever the browser reports that the voice list has changed.
    if ('speechSynthesis' in window) {
        speechSynthesis.addEventListener('voiceschanged', evaluate);
    }
}

/* -----------------------------------------------------------------
   Main entry – render the dictionary exercise inside the provided <main>.
   ----------------------------------------------------------------- */
export async function renderDictionaryExercise(mainEl, exerciseMeta, uiLang) {
    // -----------------------------------------------------------------
    // 0️⃣  Make <main> a flex column that fills the viewport.
    // -----------------------------------------------------------------
    mainEl.style.display = 'flex';
    mainEl.style.flexDirection = 'column';
    mainEl.style.height = '100vh';
    mainEl.style.boxSizing = 'border-box';

    // -----------------------------------------------------------------
    // 1️⃣ Load the JSON file that contains the token/translation arrays
    // -----------------------------------------------------------------
    const jsonPath = `/app/${exerciseMeta.folder}/${exerciseMeta.file}`;
    const data = await loadJSON(jsonPath);   // data is an array of objects

    // -----------------------------------------------------------------
    // 2️⃣ Prepare a scrollable wrapper for the token grid.
    // -----------------------------------------------------------------
    const scrollWrapper = document.createElement('div');
    scrollWrapper.style.display = 'flex';
    scrollWrapper.style.flexDirection = 'column';
    scrollWrapper.style.flexGrow = '1';
    scrollWrapper.style.overflowY = 'auto';
    scrollWrapper.style.padding = '0 1rem';

    const tokenGrid = document.createElement('div');
    tokenGrid.className = 'dict-grid';
    tokenGrid.style.display = 'flex';
    tokenGrid.style.flexWrap = 'wrap';
    tokenGrid.style.justifyContent = 'center';
    tokenGrid.style.gap = '1rem';
    tokenGrid.style.padding = '1rem 0';

    // put the grid inside the scrolling wrapper
    scrollWrapper.appendChild(tokenGrid);

    // -----------------------------------------------------------------
    // 3️⃣ Internationalised UI strings
    // -----------------------------------------------------------------
    const locale = getLocale(uiLang);
    const languageKeys = Object.keys(data[0]).filter(k => k !== 'id' && k !== 'tokens');

    // -----------------------------------------------------------------
    // 4️⃣ State objects – which languages are displayed / spoken
    // -----------------------------------------------------------------
    const displayState = {};   // languageCode -> boolean
    const speakState = {};     // languageCode -> boolean

    // Initialise all languages as NOT displayed / NOT spoken,
    // **except** the currently selected app language (uiLang) which is
    // selected for both Display and Speak by default.
    languageKeys.forEach(l => {
        const isAppLang = l === uiLang;
        displayState[l] = isAppLang;
        speakState[l] = isAppLang;
    });

    // -----------------------------------------------------------------
    // 5️⃣ Helper that rebuilds the token grid based on current states
    // -----------------------------------------------------------------
    function rebuildTokenGrid() {
        // Reset the highlight‑state arrays each time we rebuild
        playerState.tokenEls = [];
        playerState.transEls = [];

        tokenGrid.innerHTML = '';

        data.forEach(entry => {
            const thaiTokens = entry.tokens || [];

            thaiTokens.forEach((thaiWord, idx) => {
                // Build a translation array that respects the displayState
                const translations = languageKeys.map(l => {
                    if (!displayState[l]) return '';
                    const arr = entry[l] || [];
                    return arr[idx] || '';
                });
                const col = buildTokenColumn(thaiWord, translations);
                tokenGrid.appendChild(col);
            });
        });
    }

    // -----------------------------------------------------------------
    // 6️⃣ Build the language‑options UI inside a <details> element
    // -----------------------------------------------------------------
    const details = document.createElement('details');

    /* -------------------------------------------------------------
       6️⃣️⃣  Voice selector – appears just below the language options
       ------------------------------------------------------------- */
    const voiceSelect = document.createElement('select');
    voiceSelect.id = 'voiceSelect';
    voiceSelect.style.width = '100%';
    voiceSelect.style.marginTop = '0.5rem';
    voiceSelect.style.marginBottom = '0.5rem';
    details.appendChild(voiceSelect);

    // Populate the list with the voices that match any of the app languages.
    populateVoiceList(voiceSelect, SUPPORTED_LANGS);

    // Remember the selected voice for the player.
    playerState.voiceName = voiceSelect.value;

    /* -------------------------------------------------------------
       9️⃣  Sync voiceSelect after the UI is built
       ------------------------------------------------------------- */
    if (voiceSelect) {
        // Initialise the player with the current selection
        playerState.voiceName = voiceSelect.value;

        // Update the player state when the user picks a different voice.
        voiceSelect.addEventListener('change', ev => {
            playerState.voiceName = ev.target.value;
        });
    }

    details.open = true;                     // default open
    details.style.margin = '0.5rem 1rem';
    mainEl.appendChild(details);

    // ---- Summary (internationalised) ----
    const summary = document.createElement('summary');
    summary.textContent = locale.languageOptions || 'Language options';
    details.appendChild(summary);

    // ---- Grid for language options (3 columns) ----
    const optionsGrid = document.createElement('div');
    optionsGrid.style.display = 'grid';
    optionsGrid.style.gridTemplateColumns = '6fr 2fr 2fr';
    optionsGrid.style.gap = '0.5rem';
    optionsGrid.style.alignItems = 'center';
    details.appendChild(optionsGrid);

    // ---- Header row (empty, "Display", "Speak") ----
    const emptyHeader = document.createElement('div');   // first cell empty
    const displayHeader = document.createElement('div');
    const speakHeader = document.createElement('div');

    displayHeader.textContent = locale.display ?? 'Display';
    speakHeader.textContent = locale.speak ?? 'Speak';

    displayHeader.style.textAlign = 'center';
    speakHeader.style.textAlign = 'center';

    optionsGrid.appendChild(emptyHeader);
    optionsGrid.appendChild(displayHeader);
    optionsGrid.appendChild(speakHeader);

    // ---- One row per language ----
    languageKeys.forEach(langCode => {
        const langLabel = LANGUAGE_LABELS[langCode] || langCode.toUpperCase();

        const langCell = document.createElement('div');
        langCell.textContent = langLabel;
        optionsGrid.appendChild(langCell);

        const displayCell = document.createElement('div');
        const displayCb = document.createElement('input');
        displayCb.type = 'checkbox';
        displayCb.dataset.lang = langCode;
        displayCb.checked = !!displayState[langCode];
        displayCell.style.textAlign = 'center';
        displayCell.appendChild(displayCb);
        optionsGrid.appendChild(displayCell);

        const speakCell = document.createElement('div');
        const speakCb = document.createElement('input');
        speakCb.type = 'checkbox';
        speakCb.dataset.lang = langCode;
        speakCb.checked = !!speakState[langCode];
        speakCell.style.textAlign = 'center';
        speakCell.appendChild(speakCb);
        optionsGrid.appendChild(speakCell);

        // Interaction rules
        speakCb.addEventListener('change', () => {
            // Interaction rules (continued)
            if (speakCb.checked) {
                // If Speak is checked → force Display checked
                displayCb.checked = true;
                displayState[langCode] = true;
            }
            speakState[langCode] = speakCb.checked;
            rebuildTokenGrid();
        });

        // -----------------------------------------------------------------
        // When the Display checkbox changes we also need to keep the UI in sync.
        // -----------------------------------------------------------------
        displayCb.addEventListener('change', () => {
            if (!displayCb.checked) {
                // If Display is unchecked → also uncheck Speak
                speakCb.checked = false;
                speakState[langCode] = false;
            }
            displayState[langCode] = displayCb.checked;
            rebuildTokenGrid();
        });
    });

    // -----------------------------------------------------------------
    // 7️⃣  Insert the navigation panel **below** the language‑options <details>
    // -----------------------------------------------------------------
    const navPanel = buildNavPanel(locale, uiLang); // now includes Prev/Next arrows
    mainEl.appendChild(navPanel);              // placed after the <details>

    // -----------------------------------------------------------------
    // 8️⃣  If there are no TTS voices, show the install‑message and
    //      disable the whole navigation panel.
    // -----------------------------------------------------------------
    maybeDisableControls(navPanel, locale, uiLang);

    // -----------------------------------------------------------------
    // 9️⃣  Hook up the voice selector (if it exists on the page) so
    //      the player knows which voice to use.
    // -----------------------------------------------------------------
    if (voiceSelect) {
        // Initialise the player with the current selection
        playerState.voiceName = voiceSelect.value;

        // Update the player state whenever the user picks a different voice
        voiceSelect.addEventListener('change', ev => {
            playerState.voiceName = ev.target.value;
        });
    }

    // -----------------------------------------------------------------
    // 10️⃣ Assemble the page: title → scrollable grid → language options → nav
    // -----------------------------------------------------------------
    mainEl.innerHTML = '';          // wipe any previous content

    // Title (internationalised)
    const titleText = (exerciseMeta.title && exerciseMeta.title[uiLang]) ||
        exerciseMeta.title?.en ||
        'Dictionary Exercise';
    const heading = document.createElement('h2');
    heading.textContent = titleText;
    heading.style.textAlign = 'center';
    heading.style.marginBottom = '1rem';
    mainEl.appendChild(heading);

    // Scrollable wrapper that holds the token grid
    mainEl.appendChild(scrollWrapper);

    // Language‑options panel (the <details> we built above)
    mainEl.appendChild(details);

    // Navigation panel (play / pause / reset / delay + arrows)
    mainEl.appendChild(navPanel);

    // Initial render of the token grid (reflect default selections)
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
    const { EXERCISES } = await import('../data/exercises.js');
    const meta = EXERCISES.find(
        e => e.id === id && e.details && e.details.type === 'dictionary'
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