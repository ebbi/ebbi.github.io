// app/ui/helpPanel.js
/**
 * Render the Help page – FAQ style.
 *
 * The page displays a series of <details> elements (collapsed by default).
 * Each <details> contains:
 *   • a <summary> with the question (derived from the record id)
 *   • a block of pre‑marked‑up HTML that answers the question.
 *
 * All UI strings (titles, placeholders, tooltips) are taken from the
 * locale files, so the page is fully internationalized.
 *
 * The data source is `HELP_RECORDS` (app/data/helpRecords.js).  Each
 * record holds per‑language HTML, allowing you to embed paragraphs,
 * lists, tables, code blocks, images, etc.
 *
 * Exported name follows the new naming convention: `renderHelp`.
 */

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
    //   searchLabel.style.width = '12rem';

    const searchIcon = document.createElement('span');
    searchIcon.textContent = '🔍';
    searchLabel.appendChild(searchIcon);

    const searchInput = document.createElement('input');

    searchInput.type = 'search';
    searchInput.placeholder = locale.searchPlaceholder || 'Search…';
    searchInput.setAttribute('aria-label', locale.searchPlaceholder || 'Search');
    searchInput.style.padding = '0';
    searchInput.style.border = `1px solid var(--border-surface, #ddd)`;
    searchInput.style.borderRadius = '4px';
    searchInput.style.width = '12rem';

    searchLabel.appendChild(searchInput);

    headerRow.appendChild(searchLabel);
    container.appendChild(headerRow);

    // -----------------------------------------------------------------
    // 4️⃣  Render every HELP record.
    // -----------------------------------------------------------------
    HELP_RECORDS.forEach(record => {
        const details = document.createElement('details');
        details.id = record.id;                                   // useful for fragment links
        details.className = `help-detail lang-${lang}`;
        details.style.marginBottom = '1rem';
        /*
                // ---- <summary> – use the record id as a fallback title.
                // If you later add a `title` map per language you can replace this.
                //    const summary = document.createElement('summary');
                //        summary.textContent = record.id.replace(/-/g, ' ');
                //    details.appendChild(summary);
        */
        // ---- Insert the language‑specific HTML (already safe markup).
        const htmlForLang = record.html[lang] ?? record.html['en'] ?? '';
        /*
                //        const wrapper = document.createElement('div');
                //        wrapper.innerHTML = htmlForLang.trim();
                //        details.appendChild(wrapper);
        */

        details.innerHTML = htmlForLang.trim();
        container.appendChild(details);
    });

    // -----------------------------------------------------------------
    // 5️⃣  Simple client‑side search – hide/show <details> that match.
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