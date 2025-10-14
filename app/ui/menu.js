// app/ui/menu.js
import { loadJSON } from '../utils/fetch.js';
import { EXERCISES } from '../data/exercises.js';
import { getLocale } from '../data/locales.js';

// -----------------------------------------------------------------
// Font‑related imports (kept from the previous version)
// -----------------------------------------------------------------
import { FONT_CATALOG } from '../data/fonts.js';
import { getStoredFont, setStoredFont } from '../utils/storage.js';
import { applyFontFamily } from '../utils/fontHelper.js';

// -----------------------------------------------------------------
// Local‑storage key for the level‑filter checkboxes
// -----------------------------------------------------------------
const LS_LEVELS_KEY = 'local_storage_levels';

// -----------------------------------------------------------------
// Helper – read the stored level selections (array of lower‑case strings)
// -----------------------------------------------------------------
function getStoredLevels() {
    const raw = localStorage.getItem(LS_LEVELS_KEY);
    if (!raw) {
        // Default: only “basic” is selected
        return ['basic'];
    }
    try {
        const arr = JSON.parse(raw);
        return Array.isArray(arr) ? arr.map(s => s.toLowerCase()) : ['basic'];
    } catch (_) {
        return ['basic'];
    }
}

// -----------------------------------------------------------------
// Helper – persist the level selections (expects an array of strings)
// -----------------------------------------------------------------
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
    // 0️⃣ Start fresh – wipe any previous content (prevents duplication)
    // -------------------------------------------------------------
    container.innerHTML = '';   // ensures the nav bar appears only once

    // -------------------------------------------------------------
    // 1️⃣ Load the exercises (once, cached in EXERCISES)
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

    // -------------------------------------------------------------
    // 2️⃣ Build a wrapper that will act as the page‑wide navigation bar
    // -------------------------------------------------------------
    const navBar = document.createElement('section');
    navBar.className = 'menu-nav';
    navBar.style.display = 'flex';
    navBar.style.flexDirection = 'column';
    navBar.style.gap = '0.5rem';
    navBar.style.marginBottom = '1rem';

    // -------------------------------------------------------------
    // 2a️⃣ Font selector (same as before)
    // -------------------------------------------------------------
    const fontSelect = document.createElement('select');
    fontSelect.id = 'fontSelect';
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
    navBar.appendChild(fontSelect);

    // -------------------------------------------------------------
    // 2b️⃣ Level‑filter check‑boxes (Basic / Intermediate / Advance)
    // -------------------------------------------------------------
    const levelWrapper = document.createElement('div');
    levelWrapper.style.display = 'flex';
    levelWrapper.style.justifyContent = 'space-between';
    levelWrapper.style.alignItems = 'center';
    levelWrapper.style.flexWrap = 'nowrap';   // force a single row on mobile
    levelWrapper.style.gap = '0.5rem';

    const levelDefs = [
        { label: 'Basic', value: 'basic' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advance', value: 'advance' }
    ];

    // Load stored selections (default = only Basic)
    const storedLevels = getStoredLevels(); // array of lower‑case strings

    levelDefs.forEach(def => {
        const label = document.createElement('label');
        label.style.flex = '1';
        label.style.textAlign = 'center';
        label.style.cursor = 'pointer';
        label.style.userSelect = 'none';

        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.value = def.value;
        cb.checked = storedLevels.includes(def.value);
        cb.style.marginRight = '0.3rem';

        // When a checkbox changes, persist the new set and re‑render the menu
        cb.onchange = () => {
            const checked = Array.from(levelWrapper.querySelectorAll('input[type="checkbox"]:checked'))
                .map(i => i.value);
            // If nothing is checked, force at least “basic” so the UI never becomes empty
            const final = checked.length ? checked : ['basic'];
            setStoredLevels(final);
            // Re‑render the menu (keep the same language)
            renderMenu(container, UI_LANG);
        };

        label.appendChild(cb);
        label.appendChild(document.createTextNode(def.label));
        levelWrapper.appendChild(label);
    });

    navBar.appendChild(levelWrapper);
    container.appendChild(navBar);   // <-- navigation bar appears once at the top

    // -------------------------------------------------------------
    // 3️⃣ Exercise list – filtered by the selected levels
    // -------------------------------------------------------------
    const ul = document.createElement('ul');
    ul.className = 'menu-list';

    const activeLevels = new Set(getStoredLevels()); // lower‑case strings

    EXERCISES
        .filter(ex => activeLevels.has(ex.level.toLowerCase()))   // filter by level
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