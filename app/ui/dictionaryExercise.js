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
/*
function speakText(text) {
    return new Promise((resolve, reject) => {
        if (!('speechSynthesis' in window)) {
            reject(new Error('speechSynthesis not supported'));
            return;
        }
        const utter = new SpeechSynthesisUtterance(text);
        // Pick the voice that matches the name stored in playerState.voiceName
        const voices = speechSynthesis.getVoices();
        const voice = voices.find(v => v.name === playerState.voiceName) || voices[0];
        if (voice) utter.voice = voice;
        utter.onend = () => resolve();
        utter.onerror = (e) => reject(e);
        speechSynthesis.speak(utter);
    });
}
*/

/* -----------------------------------------------------------------
   Highlight the current token / translation according to playerState
   ----------------------------------------------------------------- */
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
/*
   async function playbackLoop() {
    playerState.playing = true;
    while (playerState.playing && playerState.tokenIdx < playerState.tokenEls.length) {
        const tIdx = playerState.tokenIdx;
        const transArray = playerState.transEls[tIdx]; // array of translation spans for this token

        // 1️⃣  Speak the Thai token (if we haven’t just spoken it)
        if (playerState.transIdx === -1) {
            highlightCurrent();
            const thaiText = playerState.tokenEls[tIdx].textContent;
            //            await speakText(thaiText);
            await speakText(txt, playerState.voiceName);            await new Promise(r => setTimeout(r, playerState.delaySec * 1000));
            playerState.transIdx = 0;   // move to first translation
            continue;                  // go to the top of the loop to handle translation
        }

        // 2️⃣  Speak the selected translation (if any remain)
        if (playerState.transIdx < transArray.length) {
            const transSpan = transArray[playerState.transIdx];
            highlightCurrent();
            const txt = transSpan.textContent.trim();
            if (txt) {
                await speakText(txt);
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
*/

async function playbackLoop() {
    playerState.playing = true;
    while (playerState.playing && playerState.tokenIdx < playerState.tokenEls.length) {
        const tIdx = playerState.tokenIdx;
        const transArray = playerState.transEls[tIdx]; // array of translation spans for this token

        // 1️⃣  Speak the Thai token (if we haven’t just spoken it)
        if (playerState.transIdx === -1) {
            highlightCurrent();
            const thaiText = playerState.tokenEls[tIdx].textContent;
            // Pass the selected voice name (playerState.voiceName) to the stateless TTS helper.
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
                // Again, forward the voice name.
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
   Build the navigation panel (Play / Pause / Reset / Delay)
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

    return panel;
}

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
                el.style.opacity = '';          // clear any per‑element dimming
            });
            return;
        }

        // -------------------------------------------------------------
        // 4️⃣  No matching voices → show the “Setup Speech” button.
        // -------------------------------------------------------------
        // (Create the message only once.)
        if (!panel.querySelector('.no-voice-msg')) {
            // ----- 4️⃣①  Build the button -----
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'no-voice-btn';
            btn.textContent = locale.speechSetup ?? 'Setup Speech'; // fallback English

            // Basic styling (feel free to adjust in your global CSS)
            btn.style.background = 'var(--link)';
            btn.style.color = '#fff';
            btn.style.border = 'none';
            btn.style.padding = '0.4rem 0.8rem';
            btn.style.borderRadius = '4px';
            btn.style.cursor = 'pointer';
            btn.style.fontSize = '0.9rem';
            btn.style.marginTop = '0.5rem';

            // ----- 4️⃣②  Click → go to the Help page -----
            btn.onclick = () => {
                // Navigate to the generic help page for the current UI language.
                window.router.navigate(`/${uiLang}/help`, true);
            };

            // Attach a wrapper element that we can later identify for opacity
            // handling (helps us keep the button bright while dimming siblings).
            const wrapper = document.createElement('div');
            wrapper.className = 'no-voice-wrapper';
            wrapper.appendChild(btn);
            panel.appendChild(wrapper);
        }

        // -------------------------------------------------------------
        // 5️⃣  Dim *only* the interactive controls (play/pause/reset/delay)
        // -------------------------------------------------------------
        // Block clicks on the whole panel first.
        panel.style.pointerEvents = 'none';

        // Walk every control inside the panel.
        panel.querySelectorAll('button,input,select').forEach(el => {
            // Skip the dedicated “Setup Speech” button (identified by its wrapper).
            if (el.closest('.no-voice-wrapper')) {
                // Keep it fully interactive.
                el.disabled = false;
                el.style.pointerEvents = 'auto';
                el.style.opacity = '1';
            } else {
                // Grey‑out everything else.
                el.disabled = true;
                el.style.pointerEvents = 'none';
                el.style.opacity = '0.5';
            }
        });
    };

    // -----------------------------------------------------------------
    // Run the check immediately (in case voices are already loaded)
    // -----------------------------------------------------------------
    evaluate();

    // -----------------------------------------------------------------
    // Re‑run whenever the browser reports that the voice list has changed.
    // -----------------------------------------------------------------
    if ('speechSynthesis' in window) {
        speechSynthesis.addEventListener('voiceschanged', evaluate);
    }
}


/* -----------------------------------------------------------------
   Main entry – render the dictionary exercise inside the provided <main>.
   ----------------------------------------------------------------- */
export async function renderDictionaryExercise(mainEl, exerciseMeta, uiLang) {
    // -----------------------------------------------------------------
    // 1️⃣ Load the JSON file that contains the token/translation arrays
    // -----------------------------------------------------------------
    const jsonPath = `/app/${exerciseMeta.folder}/${exerciseMeta.file}`;
    const data = await loadJSON(jsonPath);   // data is an array of objects

    // -----------------------------------------------------------------
    // 2️⃣ Prepare the token grid (will be rebuilt on every checkbox change)
    // -----------------------------------------------------------------
    const tokenGrid = document.createElement('div');
    tokenGrid.className = 'dict-grid';
    tokenGrid.style.display = 'flex';
    tokenGrid.style.flexWrap = 'wrap';
    tokenGrid.style.justifyContent = 'center';
    tokenGrid.style.gap = '1rem';
    tokenGrid.style.padding = '1rem';

    // -----------------------------------------------------------------
    // 3️⃣ Internationalised UI strings
    // -----------------------------------------------------------------
    // After flattening the locale cache (see app/data/locales.js) the
    // locale object is returned directly – there is no longer a `.content`
    // wrapper.  Using the old shape caused `locale` to be undefined,
    // which broke all UI strings that rely on it (e.g. languageOptions,
    // display, speak, delay, etc.).
    const locale = getLocale(uiLang);
    const languageKeys = Object.keys(data[0]).filter(k => k !== 'id' && k !== 'tokens');

    // -----------------------------------------------------------------
    // 4️⃣ State objects – which languages are displayed / spoken
    // -----------------------------------------------------------------
    const displayState = {};   // languageCode -> boolean
    const speakState = {};   // languageCode -> boolean

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
    // -----------------------------------------------------------------
    // 6️⃣  Build the language‑options UI inside a <details> element
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
    // The <select id="voiceSelect"> was created earlier in the UI.
    // Here we just sync the player state and listen for changes.
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
    // Expected key: "languageOptions". Fallback to English text.
    summary.textContent = locale.languageOptions || 'Language options';
    details.appendChild(summary);

    // ---- Grid for language options (3 columns) ----
    const optionsGrid = document.createElement('div');
    optionsGrid.style.display = 'grid';
    // 6fr for language names, 2fr each for the two checkbox columns
    optionsGrid.style.gridTemplateColumns = '6fr 2fr 2fr';
    optionsGrid.style.gap = '0.5rem';
    optionsGrid.style.alignItems = 'center';
    details.appendChild(optionsGrid);

    // ---- Header row (empty, "Display", "Speak") ----
    const emptyHeader = document.createElement('div');   // first cell empty
    const displayHeader = document.createElement('div');
    const speakHeader = document.createElement('div');

    // Internationalised column headings
    displayHeader.textContent = locale.display ?? 'Display';
    speakHeader.textContent = locale.speak ?? 'Speak';

    // Center the headings vertically/horizontally
    displayHeader.style.textAlign = 'center';
    speakHeader.style.textAlign = 'center';

    optionsGrid.appendChild(emptyHeader);
    optionsGrid.appendChild(displayHeader);
    optionsGrid.appendChild(speakHeader);

    // ---- One row per language ----
    languageKeys.forEach(langCode => {
        // Language name (localized if possible, otherwise fallback to label)
        const langLabel = LANGUAGE_LABELS[langCode] || langCode.toUpperCase();

        // Language name cell
        const langCell = document.createElement('div');
        langCell.textContent = langLabel;
        optionsGrid.appendChild(langCell);

        // Display checkbox cell
        const displayCell = document.createElement('div');
        const displayCb = document.createElement('input');
        displayCb.type = 'checkbox';
        displayCb.dataset.lang = langCode;
        displayCb.checked = !!displayState[langCode];
        // Center the checkbox
        displayCell.style.textAlign = 'center';
        displayCell.appendChild(displayCb);
        optionsGrid.appendChild(displayCell);

        // Speak checkbox cell
        const speakCell = document.createElement('div');
        const speakCb = document.createElement('input');
        speakCb.type = 'checkbox';
        speakCb.dataset.lang = langCode;
        speakCb.checked = !!speakState[langCode];
        // Center the checkbox
        speakCell.style.textAlign = 'center';
        speakCell.appendChild(speakCb);
        optionsGrid.appendChild(speakCell);

        // -----------------------------------------------------------------
        // Interaction rules
        // -----------------------------------------------------------------
        // If Speak is checked → force Display checked
        speakCb.addEventListener('change', () => {
            if (speakCb.checked) {
                displayCb.checked = true;
                displayState[langCode] = true;
            }
            speakState[langCode] = speakCb.checked;
            rebuildTokenGrid();
        });

        // If Display is unchecked → also uncheck Speak
        displayCb.addEventListener('change', () => {
            if (!displayCb.checked) {
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
    const navPanel = buildNavPanel(locale, uiLang); // pass locale and UI language
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

    // The <select id="voiceSelect"> was created earlier in the UI.
    // Here we just sync the player state and listen for changes.
    if (voiceSelect) {
        // Initialise the player with the current selection
        playerState.voiceName = voiceSelect.value;

        // Update the player state whenever the user picks a different voice
        voiceSelect.addEventListener('change', ev => {
            playerState.voiceName = ev.target.value;
        });
    }

    // -----------------------------------------------------------------
    // 10️⃣ Assemble the page: title → token grid → language options → nav
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

    // Token grid (initially empty – will be filled after first rebuild)
    mainEl.appendChild(tokenGrid);

    // Language‑options panel (the <details> we built above)
    mainEl.appendChild(details);

    // Navigation panel (play / pause / reset / delay)
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
