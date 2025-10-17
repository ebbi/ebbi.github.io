// app/ui/menu.js
import { loadJSON } from '../utils/fetch.js';
import { EXERCISES } from '../data/exercises.js';
import { getLocale } from '../data/locales.js';

// -----------------------------------------------------------------
// Font‑related imports
// -----------------------------------------------------------------
import { FONT_CATALOG } from '../data/fonts.js';
import {
    getStoredFont,
    setStoredFont,
    getStoredLang,
    setStoredLang
} from '../utils/storage.js';
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
    if (!raw) return ['basic'];
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

/**
 * Render (or re‑render) the shared navigation bar **without** the
 * level‑filter checkboxes or the exercise list.
 *
 * This function is called once during app start‑up (by renderHeader)
 * to ensure the nav contains only the static selectors.
 *
 * @param {HTMLElement} navEl – the <nav class="menu-nav"> element.
 * @param {string} UI_LANG – currently selected UI language.
 */
function renderStaticNav(navEl, UI_LANG) {

    /* Language selector removed – the static header (renderHeader.js) already
   provides a single language selector with the correct “stay on page”
   behavior. */

    // Clear any previous content (should be empty on first run)
    /*
        navEl.innerHTML = '';
    
        // -------------------- Language selector --------------------
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
                // Navigate to the home route of the new language.
                window.router.navigate(`/${newLang}/`, true);
            }
        };
        navEl.appendChild(langSelect);
    */

    // -------------------- Font selector --------------------
    /*
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
        navEl.appendChild(fontSelect);
        */
}

/**
 * Render the **dynamic** part of the UI (level‑filter checkboxes and the
 * exercise list) inside the supplied `container` (the <main> element).
 *
 * @param {HTMLElement} container – the <main> element where dynamic UI goes.
 * @param {string} UI_LANG – currently selected UI language.
 */
export async function renderMenu(container, UI_LANG) {
    // -------------------------------------------------------------
    // 0️⃣ Ensure exercises are loaded (once)
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
    // 1️⃣ Get (or create) the static <nav class="menu-nav"> element.
    // -------------------------------------------------------------
    let nav = document.querySelector('nav.menu-nav');
    if (!nav) {
        nav = document.createElement('nav');
        nav.className = 'menu-nav';
        // Insert the nav directly after the toolbar container (header)
        const header = document.getElementById('toolbarContainer');
        header.parentNode.insertBefore(nav, header.nextSibling);
    }
    // Populate only the static selectors – no checkboxes or list here.
    renderStaticNav(nav, UI_LANG);

    // -------------------------------------------------------------
    // 2️⃣ Level‑filter checkboxes (dynamic, go inside <main>)
    // -------------------------------------------------------------
    const levelWrapper = document.createElement('div');
    levelWrapper.style.display = 'flex';
    levelWrapper.style.justifyContent = 'space-between';
    levelWrapper.style.alignItems = 'center';
    levelWrapper.style.flexWrap = 'nowrap';
    levelWrapper.style.gap = '0.5rem';
    levelWrapper.style.margin = '0 1rem';
    levelWrapper.style.fontSize = '0.85rem';
    /*
        const localeObj = getLocale(UI_LANG).content;
        const levelDefs = [
            { label: localeObj.basic, value: 'basic' },
            { label: localeObj.intermediate, value: 'intermediate' },
            { label: localeObj.advance, value: 'advance' }
        ];
        */
    // After flattening the locale cache (see locales.js) the locale
    // object is returned directly – there is no longer a `.content`
    // wrapper.  Using the old shape caused `localeObj` to be undefined,
    // which broke the level‑filter UI (basic / intermediate / advance).
    const localeObj = getLocale(UI_LANG);
    const levelDefs = [
        { label: localeObj.basic, value: 'basic' },
        { label: localeObj.intermediate, value: 'intermediate' },
        { label: localeObj.advance, value: 'advance' }
    ];

    const storedLevels = getStoredLevels();

    levelDefs.forEach(def => {
        const label = document.createElement('label');
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.cursor = 'pointer';
        label.style.margin = '0';

        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.value = def.value;
        cb.checked = storedLevels.includes(def.value);
        cb.style.margin = '0 0.2rem 0 0';

        cb.onchange = () => {
            const checked = Array.from(
                levelWrapper.querySelectorAll('input[type="checkbox"]:checked')
            ).map(i => i.value);
            const final = checked.length ? checked : ['basic'];
            setStoredLevels(final);
            // Re‑render the list while staying on the same page.
            renderMenu(container, UI_LANG);
        };

        label.appendChild(cb);
        label.appendChild(document.createTextNode(def.label));
        levelWrapper.appendChild(label);
    });

    // -------------------------------------------------------------
    // 3️⃣ Exercise list (dynamic, also goes inside <main>)
    // -------------------------------------------------------------
    const ul = document.createElement('ul');
    ul.className = 'menu-list';

    const activeLevels = new Set(getStoredLevels());

    EXERCISES
        .filter(ex => activeLevels.has(ex.level.toLowerCase()))
        .forEach(ex => {
            const li = document.createElement('li');
            li.className = 'menu-item';
            li.dataset.id = ex.id;

            const title = document.createElement('h3');
            title.textContent =
                (ex.title && ex.title[UI_LANG]) || ex.title.en || 'Untitled';
            li.appendChild(title);

            const summary = document.createElement('p');
            summary.className = 'summary';
            summary.textContent =
                (ex.summary && ex.summary[UI_LANG]) || ex.summary.en || '';
            li.appendChild(summary);

            ul.appendChild(li);
        });

    const router = window.router; // global router instance
    ul.addEventListener('click', ev => {
        const item = ev.target.closest('.menu-item');
        if (!item) return;
        const id = item.dataset.id;
        window.router.navigate(`/${UI_LANG}/exercises/${id}`);
    });

    // -------------------------------------------------------------
    // 4️⃣ Inject the dynamic pieces into the <main> container.
    // -------------------------------------------------------------
    // Clear any previous dynamic content first.
    container.innerHTML = '';
    container.appendChild(levelWrapper);
    container.appendChild(ul);
}