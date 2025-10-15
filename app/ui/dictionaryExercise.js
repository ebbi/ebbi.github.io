// app/ui/dictionaryExercise.js
// ---------------------------------------------------------------
// Render a “dictionary”‑type exercise (exercise id = "01").
// ---------------------------------------------------------------
import { loadJSON } from '../utils/fetch.js';
import { renderHeader } from './renderHeader.js';
// import { renderHeader } from '/app/ui/renderHeader.js';
import { getLocale, LANGUAGE_LABELS } from '../data/locales.js';
// 1️⃣  IMPORT THE VOICE‑HELPER (already exists in the repo)
import { SUPPORTED_LANGS } from '../data/locales.js';
import { populateVoiceList } from '../utils/speech.js';
// import { router } from '/app/router/router.js';   // global router instance


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

    // Translations – each on its own line
    translations.forEach(t => {
        const transSpan = document.createElement('span');
        transSpan.className = 'trans';
        transSpan.textContent = t || '';          // empty strings are fine
        transSpan.style.fontSize = '0.9rem';
        transSpan.style.color = 'var(--txt-secondary)';
        col.appendChild(transSpan);
    });

    return col;
}

/**
 * Render the dictionary exercise inside the provided <main>.
 *
 * @param {HTMLElement} mainEl – the <main> element returned by renderHeader()
 * @param {Object} exerciseMeta – the entry from exercises.json (id, folder, file, title, …)
 * @param {string} uiLang – UI language code currently selected (e.g. "th")
 */
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
    const locale = getLocale(uiLang).content;
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
    details.open = true;                     // default open
    details.style.margin = '0.5rem 1rem';

    // ---- Summary (internationalised) ----
    const summary = document.createElement('summary');
    // Expected key: "languageOptions". Fallback to English text.
    summary.textContent = locale.languageOptions || 'Language options';
    details.appendChild(summary);


    // ---------------------------------------------------------------
    // 🎤  NEW: Voice selector dropdown (right after the summary)
    // ---------------------------------------------------------------
    const voiceSelect = document.createElement('select');
    voiceSelect.id = 'voiceSelect';
    voiceSelect.style.width = '100%';
    voiceSelect.style.marginTop = '0.5rem';
    voiceSelect.style.marginBottom = '0.5rem';
    details.appendChild(voiceSelect);

    // Helper that runs after the voices are loaded
    function afterVoiceLoad(matchingVoices) {
        // If we got at least one voice → keep the selector visible
        if (matchingVoices.length > 0) {
            // Populate the <select> (the helper already does the heavy lifting)
            populateVoiceList(voiceSelect, SUPPORTED_LANGS);
            voiceSelect.onchange = ev => {
                console.log('[Voice] selected for dictionary', ev.target.value);
                // You can hook your own TTS playback here if you wish.
            };
        } else {
            // Create a new option element
            var newOption = document.createElement("option");
            newOption.value = "1"; // Set the value of the new option
            newOption.text = locale.installVoiceSetup || 'Click ⚙️ and Follow instruction to setup Speech';
            //"Click ⚙️ and Follow instruction to setup Speech"; // Set the text of the new option

            // Append the new option to the select list
            voiceSelect.appendChild(newOption);

            // ---- No voices available -------------------------------------------------
            // Remove the empty <select> (so the UI isn’t confusing)
            /*
                        voiceSelect.remove();
                        
                                    // Show a friendly message
                                    const msg = document.createElement('p');
                                    msg.textContent =
                                        locale.noVoiceMessage ||
                                        'No speech synthesis voices are installed for the supported languages. Instructions to setup in 5 seconds';
                                    msg.style.color = 'var(--error)';
                                    msg.style.fontWeight = 'bold';
                                    details.appendChild(msg);
                        
                                    // After a short pause, send the user to the Settings page where the
                                    // install‑steps modal lives (the modal will pop‑up automatically).
                                    setTimeout(() => {
                                        // The Settings page will call `showInstallModal()` if the voice list
                                        // is still empty, giving the user step‑by‑step OS instructions.
                                        router.navigate(`/${uiLang}/settings`, true);
                                    }, 5000);
                        
                                    */
        }
    }

    // ---------------------------------------------------------------
    // Populate the voice list – the SpeechSynthesis API is async.
    // ---------------------------------------------------------------
    if ('speechSynthesis' in window) {
        // `speechSynthesis.getVoices()` may return an empty array initially.
        // Listen for the `voiceschanged` event and then evaluate.
        const handle = () => {
            const all = speechSynthesis.getVoices();
            const matching = all.filter(v =>
                SUPPORTED_LANGS.includes(v.lang.slice(0, 2).toLowerCase())
            );
            afterVoiceLoad(matching);
        };
        speechSynthesis.addEventListener('voiceschanged', handle);
        // Call once in case the voices are already loaded.
        handle();
    } else {
        // Browser does not support the Web Speech API – treat as “no voices”.
        afterVoiceLoad([]);
    }



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
    displayHeader.textContent = locale.display || 'Display';
    speakHeader.textContent = locale.speak || 'Speak';

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
    // 7️⃣ Assemble the page: title → token grid → language options
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
    // Language options panel
    mainEl.appendChild(details);

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