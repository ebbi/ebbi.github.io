// app/ui/fontSelect.js   (new file)
//import { FONT_CATALOG } from '../data/fonts.js';
//import { getStoredFont, setStoredFont } from '../utils/storage.js';
// app/ui/fontSelect.js   (new file)

import { FONT_CATALOG } from '../data/fonts.js';
import { getStoredFont, setStoredFont } from '../utils/storage.js';
import { applyStoredFont } from '../utils/fontHelper.js';


export function populateFontSelect(selectEl) {
    const saved = getStoredFont();

    selectEl.innerHTML = FONT_CATALOG.map(f => {
        const sel = f.name === saved ? 'selected' : '';
        return `<option value="${f.name}" ${sel}>${f.name}</option>`;
    }).join('');
    /*
        // Keep the UI in sync when the user picks a new font
        selectEl.onchange = ev => {
            const name = ev.target.value;
            setStoredFont(name);
            // Apply immediately (the same logic used elsewhere)
            const entry = FONT_CATALOG.find(f => f.name === name);
            if (entry) {
                document.documentElement.style.fontFamily = entry.family;
                document.dispatchEvent(new CustomEvent('fontChanged'));
            }
        };
    */

    selectEl.onchange = ev => {
        const name = ev.target.value;
        setStoredFont(name);
        // Centralised font application
        applyStoredFont();
    };

}