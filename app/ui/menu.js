// app/ui/menu.js
import { loadJSON } from '../utils/fetch.js';
import { EXERCISES } from '../data/exercises.js';
import { getLocale } from '../data/locales.js';

// -----------------------------------------------------------------
// Font‑related imports
// -----------------------------------------------------------------
import { FONT_CATALOG } from '../data/fonts.js';
import { getStoredFont, setStoredFont, getStoredLang, setStoredLang } from '../utils/storage.js';
import { applyFontFamily } from '../utils/fontHelper.js';
import { SUPPORTED_LANGS, LANGUAGE_LABELS } from '../data/locales.js';
import { applyDirection } from '../utils/rtl.js';

// -----------------------------------------------------------------
// Local‑storage key for the level‑filter checkboxes
// -----------------------------------------------------------------
const LS_LEVELS_KEY = 'local_storage_levels';

// -----------------------------------------------------------------
// Helpers for level‑filter persistence
// -----------------------------------------------------------------
function getStoredLevels() {
    const raw = localStorage.getItem(LS_LEVELS_KEY);
    if (!raw) return ['basic'];                       // default: only Basic
    try {
        const arr = JSON.parse(raw);
        return Array.isArray(arr) ? arr.map(s => s.toLowerCase()) : ['basic'];
    } catch (_) {
        return ['basic'];
    }
}
function setStoredLevels(levels) {
    try {
        localStorage.setItem(LS_LEVELS_KEY, JSON.stringify(levels));
    } catch (e) {
        console.warn('Could not persist level filter', e);
    }
}

// -----------------------------------------------------------------
// Main render function – called by the router
// -----------------------------------------------------------------
export async function renderMenu(container, UI_LANG) {
    // -------------------------------------------------------------
    // 0️⃣ Start fresh – clear any previous content
    // -------------------------------------------------------------
    container.innerHTML = '';

    // -------------------------------------------------------------
    // 1️⃣ Load exercises (once, cached in EXERCISES)
    // -------------------------------------------------------------
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

    // -----------------------------------------------------------------
    // 2️⃣ Navigation bar (language selector, font selector, level checkboxes)
    // -----------------------------------------------------------------
    const navBar = document.createElement('section');
    navBar.className = 'menu-nav';
    navBar.style.display = 'flex';
    navBar.style.flexDirection = 'column';
    navBar.style.gap = '0';                 // no vertical gap between rows
    navBar.style.marginBottom = '0';
    container.appendChild(navBar);          // attach early – the rest of the code will append to it

    // -------------------- Language selector (now in the nav) --------------------
    const langSelect = document.createElement('select');
    langSelect.id = 'langSelect';
    langSelect.style.width = '100%';
    langSelect.style.fontSize = '0.85rem';
    langSelect.style.margin = '0';
    langSelect.innerHTML = SUPPORTED_LANGS.map(code => {
        const sel = code === getStoredLang() ? 'selected' : '';
        const lbl = LANGUAGE_LABELS[code] || code.toUpperCase();
        return `<option value="${code}" ${sel}>${lbl}</option>`;
    }).join('');
    langSelect.onchange = ev => {
        const newLang = ev.target.value;
        if (newLang !== getStoredLang()) {
            setStoredLang(newLang);
            applyDirection(newLang);
            // reload the menu in the newly selected language
            renderMenu(container, newLang);
        }
    };
    navBar.appendChild(langSelect);

    // -------------------- Font selector --------------------
    const fontSelect = document.createElement('select');
    fontSelect.id = 'fontSelect';
    fontSelect.style.width = '100%';
    fontSelect.style.fontSize = '0.85rem';
    fontSelect.style.margin = '0';
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
    navBar.appendChild(fontSelect);

    // -------------------- Level‑filter checkboxes (row, smaller font) --------------------
    const levelWrapper = document.createElement('div');
    levelWrapper.style.display = 'flex';
    levelWrapper.style.justifyContent = 'space-between';
    levelWrapper.style.alignItems = 'center';   // vertically align checkboxes with labels
    levelWrapper.style.flexWrap = 'nowrap';
    levelWrapper.style.gap = '0.5rem';          // small space between the three boxes
    levelWrapper.style.margin = '0 1rem';       // <-- required margin
    levelWrapper.style.fontSize = '0.85rem';   // same font size as the selects

    const levelDefs = [
        { label: 'Basic', value: 'basic' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advance', value: 'advance' }
    ];
    const storedLevels = getStoredLevels(); // default = ['basic']

    levelDefs.forEach(def => {
        // Each label is a flex row: checkbox next to its text
        const label = document.createElement('label');
        label.style.display = 'flex';
        label.style.alignItems = 'center';    // vertical alignment
        label.style.cursor = 'pointer';
        label.style.margin = '0';

        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.value = def.value;
        cb.checked = storedLevels.includes(def.value);
        cb.style.margin = '0 0.2rem 0 0';      // tiny space between box and text

        // Update stored levels and re‑render on change
        cb.onchange = () => {
            const checked = Array.from(levelWrapper.querySelectorAll('input[type="checkbox"]:checked'))
                .map(i => i.value);
            const final = checked.length ? checked : ['basic']; // never empty
            setStoredLevels(final);
            renderMenu(container, UI_LANG);
        };

        label.appendChild(cb);
        label.appendChild(document.createTextNode(def.label));
        levelWrapper.appendChild(label);
    });

    navBar.appendChild(levelWrapper);

    container.appendChild(navBar);   // navigation bar appears once at the top

    // -------------------------------------------------------------
    // 3️⃣ Exercise list – filtered by selected levels
    // -------------------------------------------------------------
    const ul = document.createElement('ul');
    ul.className = 'menu-list';

    const activeLevels = new Set(getStoredLevels()); // lower‑case strings

    EXERCISES
        .filter(ex => activeLevels.has(ex.level.toLowerCase()))
        .forEach(ex => {
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

    const router = window.router; // global router instance
    ul.addEventListener('click', ev => {
        const item = ev.target.closest('.menu-item');
        if (!item) return;
        const id = item.dataset.id;
        router.navigate(`/${UI_LANG}/exercises/${id}`);
    });

    container.appendChild(ul);
}