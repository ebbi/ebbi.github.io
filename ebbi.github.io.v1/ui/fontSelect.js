import { FONT_CATALOG } from '../data/fonts.js';
import { getStoredFont, setStoredFont } from '../utils/storage.js';
import { applyStoredFont } from '../utils/fontHelper.js';

export function populateFontSelect(selectEl) {
    const saved = getStoredFont();

    selectEl.innerHTML = FONT_CATALOG.map(f => {
        const sel = f.name === saved ? 'selected' : '';
        return `<option value="${f.name}" ${sel}>${f.name}</option>`;
    }).join('');

    selectEl.onchange = ev => {
        const name = ev.target.value;
        setStoredFont(name);
        applyStoredFont();
    };

}