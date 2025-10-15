// app/ui/dictionaryExercise.js
// ---------------------------------------------------------------
// Render a “dictionary”‑type exercise (exercise id = "01").
// ---------------------------------------------------------------
import { loadJSON } from '../utils/fetch.js';
import { renderHeader } from './renderHeader.js';

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
 * @param {string} uiLang – the UI language code currently selected (e.g. "th")
 */
export async function renderDictionaryExercise(mainEl, exerciseMeta, uiLang) {
    // -----------------------------------------------------------------
    // 1️⃣  Load the JSON file that contains the token/translation arrays
    // -----------------------------------------------------------------
    const jsonPath = `/app${exerciseMeta.folder}/${exerciseMeta.file}`;
    const data = await loadJSON(jsonPath);   // data is an array of objects

    // -----------------------------------------------------------------
    // 2️⃣  Create the container that will hold all token columns
    // -----------------------------------------------------------------
    const grid = document.createElement('div');
    grid.className = 'dict-grid';
    grid.style.display = 'flex';
    grid.style.flexWrap = 'wrap';
    grid.style.justifyContent = 'center';
    grid.style.gap = '1rem';
    grid.style.padding = '1rem';

    // -----------------------------------------------------------------
    // 3️⃣  For each entry in the JSON, pair the Thai token with its
    //     translations (same index across language arrays) and build a column.
    // -----------------------------------------------------------------
    data.forEach(entry => {
        const thaiTokens = entry.tokens || [];
        const langs = Object.keys(entry).filter(k => k !== 'id' && k !== 'tokens');

        // Build a column for every Thai token in this entry
        thaiTokens.forEach((thaiWord, idx) => {
            // Collect the translation for this index from every language array
            const translations = langs.map(l => (entry[l] && entry[l][idx]) || '');
            const col = buildTokenColumn(thaiWord, translations);
            grid.appendChild(col);
        });
    });

    // -----------------------------------------------------------------
    // 4️⃣  Inject the grid into the <main> (clearing any previous content)
    // -----------------------------------------------------------------
    mainEl.innerHTML = '';          // wipe out anything that might be there

    // ----- TITLE ----------------------------------------------------
    // Use the title in the *currently selected UI language*.  If the
    // title for that language does not exist, fall back to English.
    const titleText = (exerciseMeta.title && exerciseMeta.title[uiLang]) ||
        exerciseMeta.title?.en ||
        'Dictionary Exercise';

    const heading = document.createElement('h2');
    heading.textContent = titleText;
    heading.style.textAlign = 'center';
    heading.style.marginBottom = '1rem';
    mainEl.appendChild(heading);

    // ----- GRID -----------------------------------------------------
    mainEl.appendChild(grid);
}

/**
 * Convenience wrapper used by the router.
 *
 * @param {string} lang – UI language (e.g. "en")
 * @param {string} id   – exercise id ("01")
 */
export async function initDictionaryPage(lang, id) {
    // -----------------------------------------------------------------
    // 1️⃣  Pull the exercise metadata from the global EXERCISES array
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
    // 2️⃣  Render the shared header (toolbar + nav) and obtain <main>
    // -----------------------------------------------------------------
    const mainEl = await renderHeader(lang);

    // -----------------------------------------------------------------
    // 3️⃣  Render the dictionary UI inside that <main>
    // -----------------------------------------------------------------
    await renderDictionaryExercise(mainEl, meta, lang);
}