// app/ui/menu.js
import { loadJSON } from '../utils/fetch.js';
import { EXERCISES } from '../data/exercises.js';
import { getLocale } from '../data/locales.js';

// NEW imports for the font selector
import { FONT_CATALOG } from '../data/fonts.js';
import { getStoredFont, setStoredFont } from '../utils/storage.js';
import { applyFontFamily } from '../utils/fontHelper.js';

export async function renderMenu(container, UI_LANG) {
    // Load exercises once (cached in EXERCISES)
    if (!EXERCISES.length) {
        try {
            const data = await loadJSON('/app/data/exercises.json');
            EXERCISES.push(...data);
        } catch (e) {
            const err = document.createElement('p');
            err.textContent = '❌ Unable to load exercises.';
            container.appendChild(err);
            return;
        }
    }

    const loc = getLocale(UI_LANG).content;
    const section = document.createElement('section');
    section.className = 'menu-section';

    // ---------- Font selector (now placed above the list) ----------
    const fontSelect = document.createElement('select');
    fontSelect.id = 'fontSelect';
    fontSelect.style.marginTop = '0.5rem';
    fontSelect.style.width = '100%';
    const savedFont = getStoredFont();
    fontSelect.innerHTML = FONT_CATALOG.map(f => {
        const sel = f.name === savedFont ? 'selected' : '';
        return `<option value="${f.name}" ${sel}>${f.name}</option>`;
    }).join('');
    fontSelect.onchange = ev => {
        const chosenName = ev.target.value;
        const fontObj = FONT_CATALOG.find(f => f.name === chosenName);
        if (!fontObj) return;
        setStoredFont(fontObj.name);
        applyFontFamily(fontObj.family);
        document.dispatchEvent(new CustomEvent('fontChanged'));
    };
    section.appendChild(fontSelect);

    // ---------- Exercise list ----------
    const ul = document.createElement('ul');
    ul.className = 'menu-list';

    EXERCISES.forEach(ex => {
        const li = document.createElement('li');
        li.className = 'menu-item';
        li.dataset.id = ex.id;

        const title = document.createElement('h3');
        title.textContent = (ex.title && ex.title[UI_LANG]) || ex.title.en || 'Untitled';
        li.appendChild(title);

        const summary = document.createElement('p');
        summary.className = 'summary';
        summary.textContent = (ex.summary && ex.summary[UI_LANG]) || ex.summary.en || '';
        li.appendChild(summary);

        ul.appendChild(li);
    });

    const router = window.router;                     // global router

    ul.addEventListener('click', ev => {
        const item = ev.target.closest('.menu-item');
        if (!item) return;
        const id = item.dataset.id;
        router.navigate(`/${UI_LANG}/exercises/${id}`);
    });

    section.appendChild(ul);
    container.appendChild(section);
}