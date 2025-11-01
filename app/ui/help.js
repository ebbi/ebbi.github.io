// app/ui/help.js
// ---------------------------------------------------------------
// Render the Help page – FAQ style (fully i18n‑aware).
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

    const title = document.createElement('h2');
    title.textContent = locale.help || 'Help';
    headerRow.appendChild(title);

    const searchLabel = document.createElement('label');

    const searchIcon = document.createElement('span');
    searchIcon.textContent = '🔍';
    searchLabel.appendChild(searchIcon);

    const searchInput = document.createElement('input');
    searchInput.type = 'search';
    searchInput.placeholder = locale.searchPlaceholder || 'Search';
    searchLabel.appendChild(searchInput);

    headerRow.appendChild(searchLabel);
    container.appendChild(headerRow);


    // -----------------------------------------------------------------
    // 5️⃣  Render every HELP_RECORD (including Android, iOS and the
    //     “How do I use the App?” entry).  The localisation keys follow
    //     the pattern:
    //       helpFaq<record.id>Title
    //       helpFaq<record.id>Body
    // -----------------------------------------------------------------
    HELP_RECORDS.forEach(record => {
        const details = document.createElement('details');
        details.className = 'help-detail';
        details.id = record.id;                                   // useful for fragment links

        // ---- Summary (title) -------------------------------------------------
        const titleKey = `helpFaq${record.id}Title`;               // e.g. helpFaqTtsAndroidTitle
        const summaryText =
            locale[titleKey] ||
            (record.title && record.title[lang]) ||
            record.id;                                            // fallback to id if nothing else
        const summary = document.createElement('summary');
        summary.textContent = summaryText;
        details.appendChild(summary);

        // ---- Body (HTML) ----------------------------------------------------
        // 1️⃣  Locale‑specific body (if present)
        // 2️⃣  Record’s own HTML object (fallback)
        // 3️⃣  Empty string if nothing is found.
        const bodyKey = `helpFaq${record.id}Body`;
        const rawHtml =
            locale[bodyKey] ||
            (record.html && record.html[lang]) ||
            '';

        // The body may contain multiple paragraphs, lists, etc.
        // Insert it verbatim – the string is trusted to contain safe HTML.
        const bodyContainer = document.createElement('div');
        bodyContainer.innerHTML = rawHtml;
        details.appendChild(bodyContainer);

        container.appendChild(details);
    });

    // -----------------------------------------------------------------
    // 6️⃣  Simple client‑side search – hide/show <details> that match.
    // -----------------------------------------------------------------
    if (searchInput) {
        searchInput.addEventListener('input', ev => {
            const term = ev.target.value.trim().toLowerCase();

            container.querySelectorAll('details').forEach(det => {
                const q = det.querySelector('summary').textContent.toLowerCase();
                const a = det.textContent.toLowerCase(); // includes inner HTML text
                const match = term === '' || q.includes(term) || a.includes(term);
            });
        });
    }
}