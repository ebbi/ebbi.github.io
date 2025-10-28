// ---------------------------------------------------------------
// app/ui/menu.js
// ---------------------------------------------------------------
// Render the dynamic part of the UI (level‑filter checkboxes,
// exercise list, and the Books & Blogs panel) inside the supplied
// <main> container.
// ---------------------------------------------------------------

import { loadJSON } from '../utils/fetch.js';
import { EXERCISES } from '../data/exercises.js';
import { getLocale } from '../data/locales.js';

// Font‑related imports (needed for the font selector that lives in the
// static nav – we keep them here because the original file already
// imported them).
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

// Books & Blogs panel (rendered *after* the practice panel)
import { renderBooksPanel } from './booksPanel.js';

// Local‑storage key for the level‑filter checkboxes
const LS_LEVELS_KEY = 'local_storage_levels';

// Helpers for level‑filter persistence
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

// Local‑storage key for the “last visited” exercise
const LS_LAST_EX_ID = 'local_storage_last_exercise';

/**
 * Save the chosen exercise id to local‑storage.
 * @param {string} id
 */
function storeLastExercise(id) {
    try {
        localStorage.setItem(LS_LAST_EX_ID, id);
    } catch (e) {
        console.warn('[Menu] could not persist last exercise', e);
    }
}

/**
 * Retrieve the stored id (or null if none / corrupted).
 * @returns {string|null}
 */
function getLastExercise() {
    try {
        return localStorage.getItem(LS_LAST_EX_ID);
    } catch (_) {
        return null;
    }
}

/**
 * Render the **dynamic** part of the UI (level‑filter checkboxes,
 * exercise list, and the Books & Blogs panel) inside `container`.
 *
 * @param {HTMLElement} container – the <main> element where dynamic UI goes.
 * @param {string} UI_LANG – currently selected UI language.
 * @param {boolean} [showPractice=true] – whether to render the
 *        “Practice languages” <details> panel (hide on the home page).
 */
export async function renderMenu(container, UI_LANG, showPractice = true) {
    // -------------------------------------------------------------
    // 0️⃣  Ensure the global EXERCISES array is populated (once)
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
    // 1️⃣  Build the **Practice languages** <details> panel
    // -------------------------------------------------------------
    if (showPractice) {
        const practiceDetails = document.createElement('details');
        practiceDetails.open = true;                     // expanded by default
//        practiceDetails.style.margin = '0.5rem 1rem';

        const practiceSummary = document.createElement('summary');
        const locale = getLocale(UI_LANG);
        practiceSummary.textContent = locale.practiceLanguages || 'Practice languages';
        practiceDetails.appendChild(practiceSummary);

        // ----- Exercise selector (dropdown with optgroups) -----
        function buildExerciseDropdown(UI_LANG, locale) {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.gap = '0.5rem';
//            wrapper.style.margin = '0.5rem 1rem';
 //           wrapper.style.fontSize = '0.9rem';

            const label = document.createElement('label');
            label.textContent = locale.exercise || 'Exercise';
            label.htmlFor = 'exerciseSelect';
            wrapper.appendChild(label);

            const select = document.createElement('select');
            select.id = 'exerciseSelect';
            select.style.flex = '1';
            select.style.maxWidth = '12rem';
 //           select.style.padding = 0;
            wrapper.appendChild(select);

            // ---- Placeholder (disabled) ----
            const placeholder = document.createElement('option');
            placeholder.value = '';
            placeholder.textContent = '--';
            placeholder.disabled = true;
            select.appendChild(placeholder);

            // ---- Group by level -------------------------------------------------
            const levelOrder = ['basic', 'intermediate', 'advance'];
            const byLevel = levelOrder.reduce((acc, lvl) => {
                acc[lvl] = [];
                return acc;
            }, {});

            EXERCISES.forEach(ex => {
                const lvl = (ex.level || 'basic').toLowerCase();
                const bucket = levelOrder.includes(lvl) ? lvl : 'basic';
                byLevel[bucket].push(ex);
            });

            // ---- Create <optgroup>s ------------------------------------------------
            levelOrder.forEach(lvl => {
                const group = document.createElement('optgroup');
                const grpLabel = locale[lvl] || lvl.charAt(0).toUpperCase() + lvl.slice(1);
                group.label = grpLabel;

                byLevel[lvl].forEach(ex => {
                    const opt = document.createElement('option');
                    const title = (ex.title && ex.title[UI_LANG]) || ex.title?.en || ex.id;
                    opt.value = ex.id;
                    opt.textContent = title;
                    group.appendChild(opt);
                });

                if (group.children.length) select.appendChild(group);
            });

            // ---- Pre‑select the last‑visited exercise (if still present) ----
            const lastId = getLastExercise();
            if (lastId) {
                const optionToSelect = Array.from(select.options).find(o => o.value === lastId);
                if (optionToSelect) optionToSelect.selected = true;
            } else {
                placeholder.selected = true;
            }

            // ---- React to a change ------------------------------------------------
            select.addEventListener('change', ev => {
                const chosenId = ev.target.value;
                if (!chosenId) return;

                storeLastExercise(chosenId);
                window.router.navigate(`/${UI_LANG}/exercises/${chosenId}`, true);
            });

            return wrapper;
        }

        practiceDetails.appendChild(buildExerciseDropdown(UI_LANG, locale));

        // ----- Level‑filter checkboxes -----
        const levelWrapper = document.createElement('div');
        levelWrapper.style.display = 'flex';
        levelWrapper.style.justifyContent = 'space-between';
        levelWrapper.style.alignItems = 'center';
        levelWrapper.style.flexWrap = 'nowrap';
        levelWrapper.style.gap = '0.5rem';
//        levelWrapper.style.margin = '0 1rem';
        levelWrapper.style.width = '14rem';
//        levelWrapper.style.fontSize = '0.85rem';

        const localeObj = getLocale(UI_LANG); // raw locale object (no .content wrapper)

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
//            label.style.margin = '0';

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
                renderMenu(container, UI_LANG, true);
            };

            label.appendChild(cb);
            label.appendChild(document.createTextNode(def.label));
            levelWrapper.appendChild(label);
        });

        practiceDetails.appendChild(levelWrapper);

        // ----- Exercise list (cards) -----
        const ul = document.createElement('ul');
        ul.className = 'menu-list';

        const activeLevels = new Set(getStoredLevels());

        EXERCISES
            .filter(ex => activeLevels.has((ex.level || 'basic').toLowerCase()))
            .forEach(ex => {
                const li = document.createElement('li');
                li.className = 'menu-item';
                li.dataset.id = ex.id;

                const title = document.createElement('h3');
                title.textContent =
                    (ex.title && ex.title[UI_LANG]) || ex.title?.en || 'Untitled';
                li.appendChild(title);

                const summary = document.createElement('p');
                summary.className = 'summary';
                summary.textContent =
                    (ex.summary && ex.summary[UI_LANG]) || ex.summary?.en || '';
                li.appendChild(summary);

                // “Test Yourself” button – only for exercises that list the
                // “multipleChoice” activity.
                if (Array.isArray(ex.activities) && ex.activities.includes('multipleChoice')) {
                    const testBtn = document.createElement('button');
                    const label = locale.testYourself || 'Test yourself';
                    testBtn.textContent = label;
                    testBtn.className = 'test-yourself-btn';
 //                   testBtn.style.marginTop = '0.5rem';
                    // NOTE: the event object is passed so we can stop propagation
                    testBtn.onclick = (ev) => {
                        // Prevent the click from reaching the <ul> listener.
                        ev.stopPropagation();
                        // Optional – cancel any default button behaviour (no‑op in most browsers)
                        ev.preventDefault?.();

                        const url = `/${UI_LANG}/exercises/${ex.id}/test`;
                        window.router.navigate(url, true);
                    };
                    li.appendChild(testBtn);
                }

                ul.appendChild(li);
            });

        const router = window.router; // global router instance
        ul.addEventListener('click', ev => {
            const item = ev.target.closest('.menu-item');
            if (!item) return;
            const id = item.dataset.id;
            window.router.navigate(`/${UI_LANG}/exercises/${id}`);
        });

        // **IMPORTANT** – put the list *inside* the <details>!
        practiceDetails.appendChild(ul);

        // Append the whole thing to the supplied <main> container
        container.appendChild(practiceDetails);
    }

    // -------------------------------------------------------------
    // 2️⃣  Build the **Books & Blogs** <details> panel (the one you already have)
    // -------------------------------------------------------------
    // `renderBooksPanel` creates its own <details> wrapper and appends it
    // directly to the container, so we just call it after the practice panel.
    renderBooksPanel(container, UI_LANG);   // will create its own <details> and append it
}