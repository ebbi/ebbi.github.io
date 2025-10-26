// app/ui/help.js
// ---------------------------------------------------------------
// Render the Help page – FAQ style (now fully i18n‑aware).
// ---------------------------------------------------------------

import { getLocale } from '../data/locales.js';
import { HELP_RECORDS } from '../data/helpRecords.js';
import { getStoredLang } from '../utils/storage.js';

/**
 * Render the Help UI inside the supplied container (normally the page’s <main>).
 *
 * @param {HTMLElement} container – the element that will receive the help UI.
 */
export function renderHelp(container) {
    // -----------------------------------------------------------------
    // 1️⃣  Clear any previous content.
    // -----------------------------------------------------------------
    container.innerHTML = '';

    // -----------------------------------------------------------------
    // 2️⃣  Determine the UI language (fallback to English).
    // -----------------------------------------------------------------
    const lang = getStoredLang();               // reads from local‑storage
    const locale = getLocale(lang);

    // -----------------------------------------------------------------
    // 3️⃣  Header row – left‑aligned “Help” title, right‑aligned search.
    // -----------------------------------------------------------------
    const headerRow = document.createElement('div');
    headerRow.style.display = 'flex';
    headerRow.style.justifyContent = 'space-between';
    headerRow.style.alignItems = 'center';
    headerRow.style.padding = '0.5rem 1rem';
    headerRow.style.borderBottom = `1px solid var(--border-surface, #ddd)`;

    const title = document.createElement('h2');
    title.textContent = locale.help || 'Help';
    title.style.margin = '0';
    headerRow.appendChild(title);

    const searchLabel = document.createElement('label');
    searchLabel.style.display = 'flex';
    searchLabel.style.alignItems = 'center';
    searchLabel.style.gap = '0.25rem';

    const searchIcon = document.createElement('span');
    searchIcon.textContent = '🔍';
    searchLabel.appendChild(searchIcon);

    const searchInput = document.createElement('input');
    searchInput.type = 'search';
    searchInput.placeholder = locale.searchPlaceholder || 'Search…';
    searchInput.style.padding = '0';
    searchInput.style.border = `1px solid var(--border-surface, #ddd)`;
    searchInput.style.borderRadius = '4px';
    searchInput.style.width = '12rem';
    searchLabel.appendChild(searchInput);

    headerRow.appendChild(searchLabel);
    container.appendChild(headerRow);

    // -----------------------------------------------------------------
    // 4️⃣  Tiny style block (no external CSS needed).
    // -----------------------------------------------------------------
    const style = document.createElement('style');
    style.textContent = `
        .help-detail {
            margin: 1rem 0.5rem;
            padding: 0.5rem;
            border: 1px solid var(--border-surface, #ddd);
            border-radius: 0.5rem;
            background: var(--bg-surface, #fff);
        }
        .help-detail > summary {
            font-weight: 600;
            cursor: pointer;
            margin-bottom: 0.4rem;
        }
        .help-detail p {
            margin: 0.5rem 0;
            white-space: pre-line;   /* preserve line‑breaks (\n) */
        }
    `;
    container.appendChild(style);

    // -----------------------------------------------------------------
    // 5️⃣  Render the **original** HELP records (with proper fallbacks)
    // -----------------------------------------------------------------
    HELP_RECORDS.forEach(record => {
        const details = document.createElement('details');
        details.className = 'help-detail';
        details.id = record.id;                                   // useful for fragment links

        // ---- Summary (question) ------------------------------------
        // Prefer a locale‑specific title, then the record’s own title, then the id.
        const titleKey = `helpFaq${record.id}Title`;               // e.g. helpFaqHowToUseTitle
        const summaryText =
            locale[titleKey] ||
            (record.title && record.title[lang]) ||
            record.id;
        const summary = document.createElement('summary');
        summary.textContent = summaryText;
        details.appendChild(summary);

        // ---- Body (answer) -----------------------------------------
        // 1️⃣  Locale‑specific body (if you added one)
        // 2️⃣  Record’s own HTML (the original format)
        // 3️⃣  Fallback to an empty string.
        const bodyKey = `helpFaq${record.id}Body`;                 // e.g. helpFaqHowToUseBody
        const rawHtml =
            locale[bodyKey] ||
            (record.html && record.html[lang]) ||
            '';

        // Split on newline characters and create <p> elements.
        // Empty lines are ignored.
        const paragraphs = rawHtml.split('\n').filter(p => p.trim() !== '');
/*
        paragraphs.forEach(p => {
            const pEl = document.createElement('p');
            pEl.textContent = p;
            details.appendChild(pEl);
        });
*/
        container.appendChild(details);
    });

    /*
    // -----------------------------------------------------------------
    // 6️⃣  **Add the new “How do I use the App?” FAQ** (i18n)
    // -----------------------------------------------------------------
    const newId = 'howToUse';   // any unique id you like
    const newDetails = document.createElement('details');
    newDetails.className = 'help-detail';
    newDetails.id = newId;

    const newSummary = document.createElement('summary');
    newSummary.textContent = locale.helpFaqHowToUseTitle ||
        'How do I use the App?';
    newDetails.appendChild(newSummary);

    const newBodyRaw = locale.helpFaqHowToUseBody ||
        'Lumo the AI reply is: welcome to the learning environment! 🎉\n' +
        'Here’s a quick rundown of the main features:\n' +
        '1. Home / Exercise list – pick any exercise card to open the dictionary view.\n' +
        '2. Dictionary view – you’ll see the source word in the selected language and its translations. Tap any word (or the speaker icon) to hear it spoken.\n' +
        '3. Display / Speak check‑boxes – hide or show language columns, and decide which languages the “Play” button will read aloud.\n' +
        '4. Test Yourself – hit the “Test Yourself” button on an exercise card. Choose a question language and an answer language, then start the quiz. Four answer buttons appear; click one to hear it and get instant feedback.\n' +
        '5. Score tracking – the quiz shows “Correct / Total” and lets you review any words you got wrong via the “Practice later” link.\n' +
        '6. Books & Blogs – scroll down on the Home page to discover curated reading material, filtered by language.\n' +
        '7. Help & Settings – the toolbar at the top gives you quick access to language switching, theme toggling, and the Help section where you can find detailed guides (like this one!).\n' +
        'Enjoy exploring! If you ever get stuck, the Help page has step‑by‑step instructions for every feature.';

    // Turn the newline‑separated text into <p> elements.
    newBodyRaw.split('\n').filter(p => p.trim() !== '').forEach(p => {
        const pEl = document.createElement('p');
        pEl.textContent = p;
        newDetails.appendChild(pEl);
    });

    container.appendChild(newDetails);
*/

    // -----------------------------------------------------------------
    // 7️⃣  Simple client‑side search – hide/show <details> that match.
    // -----------------------------------------------------------------
    if (searchInput) {
        searchInput.addEventListener('input', ev => {
            const term = ev.target.value.trim().toLowerCase();

            container.querySelectorAll('details').forEach(det => {
                const q = det.querySelector('summary').textContent.toLowerCase();
                const a = det.textContent.toLowerCase(); // includes inner HTML text
                const match = term === '' || q.includes(term) || a.includes(term);
                det.style.display = match ? '' : 'none';
            });
        });
    }
}