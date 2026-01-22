// app/ui/menu.js
// ---------------------------------------------------------------
// Render the dynamic part of the UI (exercise list, Books & Blogs)
// inside the supplied <main> container.
// ---------------------------------------------------------------

import { loadJSON } from '../utils/fetch.js';
import { EXERCISES } from '../data/exercises.js';
import {
    getLocale,
    SUPPORTED_LANGS,
    FALLBACK_LANG,          // needed for safe fallback language
    LANGUAGE_LABELS
} from '../data/locales.js';
import {
    getStoredLang,
    setStoredLang,
    getStoredFont,
    setStoredFont,
    getStoredTheme,
    setStoredTheme
} from '../utils/storage.js';
import { applyFontFamily } from '../utils/fontHelper.js';
import { applyDirection } from '../utils/rtl.js';
import { renderBooksPanel } from './booksPanel.js';

/* -------------------------------------------------------------
   0️⃣  GLOBAL maps that survive across calls
   ------------------------------------------------------------- */
let GROUP_LABELS = {};   // groupId → { en:"...", th:"...", … }
let GROUP_ORDER = [];   // ordered list of groupIds as they appear in the JSON

/* -------------------------------------------------------------
   1️⃣  Load exercises (once) and also capture the group order
   ------------------------------------------------------------- */
export async function ensureExercisesLoaded() {
    if (EXERCISES.length) return; // already loaded

    try {
        const data = await loadJSON('/app/data/exercises.json');

        // ---- Extract group definitions (if present) -----------------
        const groupDef = data.find(item => item.type === 'groupDefinitions');
        if (groupDef && Array.isArray(groupDef.groups)) {
            groupDef.groups.forEach(g => {
                GROUP_LABELS[g.id] = g.label;   // e.g. { en:"Thai Foundations", th:"พื้นฐานภาษาไทย", … }
                GROUP_ORDER.push(g.id);         // preserve the order from the JSON file
            });
        }

        // ---- Push only the real exercises into the global array -----
        const exercisesOnly = data.filter(item => !item.type);
        EXERCISES.push(...exercisesOnly);
    } catch (e) {
        console.warn('⚠️ Could not load exercises catalogue', e);
        throw e;
    }
}

/* -------------------------------------------------------------
   2️⃣  Helpers for persisting UI state (last‑visited exercise)
   ------------------------------------------------------------- */
const LS_LAST_EX_ID = 'local_storage_last_exercise';
function storeLastExercise(id) {
    try {
        localStorage.setItem(LS_LAST_EX_ID, id);
    } catch (e) {
        console.warn('[Menu] could not persist last exercise', e);
    }
}
function getLastExercise() {
    try {
        return localStorage.getItem(LS_LAST_EX_ID);
    } catch (_) {
        return null;
    }
}

/* -------------------------------------------------------------
   3️⃣  MAIN export – renderMenu
   ------------------------------------------------------------- */
export async function renderMenu(container, UI_LANG, showPractice = true) {
    // ---------------------------------------------------------
    // 0️⃣  Make sure the data (including GROUP_LABELS & GROUP_ORDER) is ready
    // ---------------------------------------------------------
    await ensureExercisesLoaded();

    // ---------------------------------------------------------
    // 1️⃣  Build the Practice‑languages panel (unchanged except no level filter)
    // ---------------------------------------------------------
    if (showPractice) {
        const practiceDetails = document.createElement('details');
        const practiceSummary = document.createElement('summary');
        const locale = getLocale(UI_LANG);
        practiceSummary.textContent = locale.practiceLanguages || 'Practice languages';
        practiceDetails.appendChild(practiceSummary);

        // ---------------------------------------------------------------
        // 1️⃣  Build the Exercise drop‑down (inside the Practice panel)
        // ---------------------------------------------------------------
        function buildExerciseDropdown(UI_LANG, locale) {
            const wrapper = document.createElement('div');
            wrapper.className = 'exerciseDiv';
            const select = document.createElement('select');
            select.id = 'exerciseSelect';
            wrapper.appendChild(select);

            // ---------------------------------------------------------
            // Placeholder – always the first entry (non‑selectable)
            // ---------------------------------------------------------
            const placeholder = document.createElement('option');
            placeholder.value = '';
            placeholder.disabled = true;
            placeholder.selected = true;
            placeholder.textContent = locale.exercise || 'Exercise';
            select.appendChild(placeholder);

            // ---------------------------------------------------------
            // Build the same ordered group map that the main UI uses
            // ---------------------------------------------------------
            const groupsMap = new Map();
            EXERCISES.forEach(ex => {
                const grpKey = ex.group || 'group.other';
                if (!groupsMap.has(grpKey)) groupsMap.set(grpKey, []);
                groupsMap.get(grpKey).push(ex);   // keep JSON order inside each group
            });

            // Ordered list of group IDs (preserves the order from groupDefinitions)
            const orderedGroupKeys = GROUP_ORDER.filter(gId => groupsMap.has(gId));

            // ---------------------------------------------------------
            // For each group create an <optgroup> with the localized label
            // ---------------------------------------------------------
            orderedGroupKeys.forEach(groupKey => {
                const labelObj = GROUP_LABELS[groupKey] || {};
                const groupLabel = labelObj[UI_LANG] ||
                    labelObj[FALLBACK_LANG] ||
                    groupKey;   // fallback to raw key if translation missing

                const optGroup = document.createElement('optgroup');
                optGroup.label = groupLabel;   // <-- this is the visible header

                // Add the exercises that belong to this group
                groupsMap.get(groupKey).forEach(ex => {
                    const opt = document.createElement('option');
                    const title = (ex.title && ex.title[UI_LANG]) || ex.title?.en || ex.id;
                    opt.value = ex.id;
                    opt.textContent = title;
                    optGroup.appendChild(opt);
                });

                // Append the whole group to the <select>
                select.appendChild(optGroup);
            });

            // ---------------------------------------------------------
            // Restore previously‑selected exercise (if any)
            // ---------------------------------------------------------
            /*
                        const lastId = getLastExercise();
                        if (lastId) {
                            const optionToSelect = Array.from(select.options).find(o => o.value === lastId);
                            if (optionToSelect) optionToSelect.selected = true;
                        } else {
                            placeholder.selected = true;
                        }
            */
            placeholder.selected = true;
            
            // ---------------------------------------------------------
            // Change handler – navigate to the chosen exercise
            // ---------------------------------------------------------
            select.addEventListener('change', ev => {
                const chosenId = ev.target.value;
                if (!chosenId) return;
                storeLastExercise(chosenId);
                window.router.navigate(`/${UI_LANG}/exercises/${chosenId}`, true);
            });

            return wrapper;
        }

        practiceDetails.appendChild(buildExerciseDropdown(UI_LANG, locale));

        // ---------------------------------------------------------
        // 2️⃣  Build the grouped exercise list **inside** practiceDetails
        // ---------------------------------------------------------

        // ---- a) Build a map: groupId → [exercises] ------------
        const groupsMap = new Map();
        EXERCISES.forEach(ex => {
            const grpKey = ex.group || 'group.other';
            if (!groupsMap.has(grpKey)) groupsMap.set(grpKey, []);
            groupsMap.get(grpKey).push(ex);   // keep the order from the JSON file
        });

        // ---- b) Preserve the order from GROUP_ORDER ----------
        //      (filter out any groups that have no exercises)
        const orderedGroupKeys = GROUP_ORDER.filter(gId => groupsMap.has(gId));

        // ---- c) Render each group **into** practiceDetails -----
        orderedGroupKeys.forEach(groupKey => {
            const groupDetails = document.createElement('details');
            groupDetails.open = false; // groups start opened

            const groupSummary = document.createElement('summary');

            // ----- Use the label from GROUP_LABELS ---------------
            const labelObj = GROUP_LABELS[groupKey] || {};
            const headingText = labelObj[UI_LANG] ||
                labelObj[FALLBACK_LANG] ||
                groupKey;   // fallback to raw id
            groupSummary.textContent = headingText;
            // -----------------------------------------------------

            groupDetails.appendChild(groupSummary);

            const ul = document.createElement('ul');
            ul.className = 'menu-list';

            // ---- Exercises inside this group stay in JSON order ----
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

                // ---- Test‑yourself button (unchanged) ------------
                if (Array.isArray(ex.activities) && ex.activities.includes('multipleChoice')) {
                    const testBtn = document.createElement('button');
                    const label = locale.testYourself || 'Test yourself';
                    testBtn.textContent = label;
                    testBtn.className = 'test-yourself-btn';
                    testBtn.onclick = ev => {
                        ev.stopPropagation();
                        ev.preventDefault?.();
                        const url = `/${UI_LANG}/exercises/${ex.id}/test`;
                        window.router.navigate(url, true);
                    };
                    li.appendChild(testBtn);
                }

                ul.appendChild(li);
            });

            // ---- Click‑handler for the whole list (unchanged) ----
            ul.addEventListener('click', ev => {
                const item = ev.target.closest('.menu-item');
                if (!item) return;
                const id = item.dataset.id;
                window.router.navigate(`/${UI_LANG}/exercises/${id}`);
            });

            groupDetails.appendChild(ul);

            // *** IMPORTANT *** – add the group panel **to the practiceDetails**
            practiceDetails.appendChild(groupDetails);
        });

        // ---------------------------------------------------------
        // 3️⃣  Finally add the whole practice panel to the container
        // ---------------------------------------------------------
        container.appendChild(practiceDetails);
    }

    // ---------------------------------------------------------
    // 4️⃣  Render the Books & Blogs panel (unchanged)
    // ---------------------------------------------------------
    renderBooksPanel(container, UI_LANG);

    const selectEl = container.querySelector('#exerciseSelect');
    if (selectEl) {
        selectEl.selectedIndex = 0;
    }

}