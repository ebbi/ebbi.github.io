// app/utils/fontHelper.js
import { FONT_CATALOG } from '../data/fonts.js';
import { getStoredFont } from '../utils/storage.js';


/**
 * Apply a CSS font‑family string to the root element.
 * This ensures *every* descendant inherits the font, even if it was
 * created before the selector ran (e.g. static HTML from index.html).
 *
 * @param {string} cssFamily – the value you would normally assign to
 *                             `font-family` (e.g. `'Roboto', sans-serif`).
 */
export function applyFontFamily(cssFamily) {
    document.documentElement.style.fontFamily = cssFamily;
}

/**
 * Helper that reads the stored font name, finds the matching entry in
 * `FONT_CATALOG`, and applies it.  Returns `true` if a font was applied.
 *
 * @param {Array} catalog – the `FONT_CATALOG` array imported from
 *                          `../data/fonts.js`.
 * @param {Function} getStoredFont – function that reads the LS key.
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