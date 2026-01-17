// app/utils/fontHelper.js
import { FONT_CATALOG } from '../data/fonts.js';
import { getStoredFont } from '../utils/storage.js';

/**
 * Apply a CSS font‑family string to the root element.
 * All descendants inherit the font automatically.
 *
 * @param {string} cssFamily – e.g. "'Roboto', sans-serif"
 */
export function applyFontFamily(cssFamily) {
    document.documentElement.style.fontFamily = cssFamily;
}

/**
 * Read the stored font name, locate the matching entry in the catalog,
 * and apply it to the root element.
 *
 * @param {Array} catalog – FONT_CATALOG imported from '../data/fonts.js'
 * @param {Function} getStoredFont – function that reads the LS key.
 * @returns {boolean} true if a font was applied, false otherwise.
 */
/*
export function applyCurrentFont(catalog, getStoredFont) {
    const savedName = getStoredFont();
    const entry = catalog.find(f => f.name === savedName);
    if (entry) {
        applyFontFamily(entry.family);
        return true;
    }
    return false;
}
*/

/**
 * Apply the font stored in local‑storage (or the default) to the root.
 * This is the single source of truth for “apply the persisted font”.
 */
export function applyStoredFont() {
    const name = getStoredFont();               // imported from storage.js
    const entry = FONT_CATALOG.find(f => f.name === name);
    if (entry) {
        applyFontFamily(entry.family);
        // Emit an event so any UI listening for font changes can react.
        document.dispatchEvent(new CustomEvent('fontChanged'));
    } else {
        // Fallback to the first font in the catalog.
        applyFontFamily(FONT_CATALOG[0].family);
    }
}