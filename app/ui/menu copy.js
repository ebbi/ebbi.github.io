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
        // practiceDetails.open = true; // optional default open

        const practiceSummary = document.createElement('summary');
        const locale = getLocale(UI_LANG);
        practiceSummary.textContent = locale.practiceLanguages || 'Practice languages';
        practiceDetails.appendChild(practiceSummary);

        // -----------------------------------------------------------------
        // 1️⃣️⃣  Build the exercise selector dropdown (unchanged)
        // -----------------------------------------------------------------
        function buildExerciseDropdown(UI_LANG, locale) {
            const wrapper = document.createElement('div');
            wrapper.className = 'exerciseDiv';
            const select = document.createElement('select');
            select.id = 'exerciseSelect';
            wrapper.appendChild(select);

            const placeholder = document.createElement('option');
            placeholder.value = '';
            placeholder.disabled = true;
            placeholder.selected = true;
            placeholder.textContent = locale.exercise || 'Exercise';
            select.appendChild(placeholder);

            const levelOrder = ['basic', 'intermediate', 'advance'];
            const byLevel = levelOrder.reduce((acc, lvl) => {
                acc[lvl] = [];
                return acc;
            }, {});

            EXERCISES.forEach(ex => {
                const lvl = (ex.level || 'basic').toLowerCase();
                const bucket = levelOrder.includes(lvl) ? lvl : 'basic';
                byLevel[lvl].push(ex);
            });

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

            const lastId = getLastExercise();
            if (lastId) {
                const optionToSelect = Array.from(select.options).find(o => o.value === lastId);
                if (optionToSelect) optionToSelect.selected = true;
            } else {
                placeholder.selected = true;
            }

            select.addEventListener('change', ev => {
                const chosenId = ev.target.value;
                if (!chosenId) return;
                storeLastExercise(chosenId);
                window.router.navigate(`/${UI_LANG}/exercises/${chosenId}`, true);
            });

            return wrapper;
        }

        practiceDetails.appendChild(buildExerciseDropdown(UI_LANG, locale));

        // -----------------------------------------------------------------
        // 2️⃣️⃣  Render the exercise list **grouped by i18n group key**
        // -----------------------------------------------------------------
        // Filter by the level‑filter checkboxes first
        const activeLevels = new Set(getStoredLevels());

        // Collect exercises into groups (key = group i18n key)
        const groupsMap = new Map(); // groupKey -> array of exercises
        EXERCISES
            .filter(ex => activeLevels.has((ex.level || 'basic').toLowerCase()))
            .forEach(ex => {
                const grpKey = ex.group || 'group.other';
                if (!groupsMap.has(grpKey)) groupsMap.set(grpKey, []);
                groupsMap.get(grpKey).push(ex);
            });

        // Sort groups – you can also sort by a numeric `order` if you add it
        // to the JSON. Here we simply sort alphabetically by the translated label.
        const sortedGroupKeys = Array.from(groupsMap.keys()).sort((a, b) => {
            const labelA = locale[a] || a;
            const labelB = locale[b] || b;
            return labelA.localeCompare(labelB);
        });

        // Render each group as its own <details> panel
        sortedGroupKeys.forEach(groupKey => {
            const groupDetails = document.createElement('details');
            groupDetails.open = true; // groups start opened; change as you wish

            const groupSummary = document.createElement('summary');
            // Translate the group key using the current locale
            groupSummary.textContent = locale[groupKey] || groupKey;
            groupDetails.appendChild(groupSummary);

            const ul = document.createElement('ul');
            ul.className = 'menu-list';

            groupsMap.get(groupKey).forEach(ex => {
                const li = document.createElement('li');
                li.className = 'menu-item';
                li.dataset.id = ex.id;

                const title = document.createElement('h3');
                title.textContent = (ex.title && ex.title[UI_LANG]) || ex.title?.en || ex.id;
                li.appendChild(title);

                const summary = document.createElement('p');
                summary.className = 'summary';
                summary.textContent = (ex.summary && ex.summary[UI_LANG]) || ex.summary?.en || '';
                li.appendChild(summary);

                // “Test Yourself” button – only for exercises that list the
                // “multipleChoice” activity.
                if (Array.isArray(ex.activities) && ex.activities.includes('multipleChoice')) {
                    const testBtn = document.createElement('button');
                    const label = locale.testYourself || 'Test yourself';
                    testBtn.textContent = label;
                    testBtn.className = 'test-yourself-btn';
                    testBtn.onclick = (ev) => {
                        ev.stopPropagation();
                        ev.preventDefault?.();
                        const url = `/${UI_LANG}/exercises/${ex.id}/test`;
                        window.router.navigate(url, true);
                    };
                    li.appendChild(testBtn);
                }

                ul.appendChild(li);
            });

            // Click on a list item navigates to the exercise detail page
            const router = window.router;
            ul.addEventListener('click', ev => {
                const item = ev.target.closest('.menu-item');
                if (!item) return;
                const id = item.dataset.id;
                window.router.navigate(`/${UI_LANG}/exercises/${id}`);
            });

            groupDetails.appendChild(ul);
            practiceDetails.appendChild(groupDetails);
        });

        // Append the whole practice panel to the supplied container
        container.appendChild(practiceDetails);
    }

    // -------------------------------------------------------------
    // 2️⃣  Build the **Books & Blogs** <details> panel (the one you already have)
    // -------------------------------------------------------------
    // `renderBooksPanel` creates its own <details> wrapper and appends it
    // directly to the container, so we just call it after the practice panel.
    renderBooksPanel(container, UI_LANG);   // will create its own <details> and append it
}