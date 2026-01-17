// app/utils/rtl.js
/**
 * List of ISO‑639 language codes that use a right‑to‑left script.
 * Extend this array whenever you add another RTL language.
 */
export const RTL_LANGS = ['ar', 'fa', 'he', 'ur'];

/**
 * Return true if the supplied language code is RTL.
 *
 * @param {string} lang – two‑letter language code (e.g. "ar")
 * @returns {boolean}
 */
export const isRtlLang = (lang) => RTL_LANGS.includes(lang);

/**
 * Apply the correct text‑direction to the document.
 * Call this whenever the UI language changes (on start‑up *and* on
 * language‑selector changes) so the layout flips instantly.
 *
 * @param {string} lang – current language code
 */
export const applyDirection = (lang) => {
    const dir = isRtlLang(lang) ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.body.setAttribute('dir', dir);
};