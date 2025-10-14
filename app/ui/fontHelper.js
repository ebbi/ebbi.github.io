// app/utils/fontHelper.js
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
export function applyCurrentFont(catalog, getStoredFont) {
    const savedName = getStoredFont();
    const entry = catalog.find(f => f.name === savedName);
    if (entry) {
        applyFontFamily(entry.family);
        return true;
    }
    return false;
}