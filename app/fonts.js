// app/fonts.js
/** ------------------------------------------------------------------
 *  Font catalogue – Google‑Font families that will appear in the UI.
 * ------------------------------------------------------------------ */
export const FONT_CATALOG = [
    { name: 'Noto Sans', family: `'Noto Sans', sans-serif`, google: 'Noto+Sans' },
    { name: 'Noto Sans Thai', family: `'Noto Sans Thai', sans-serif`, google: 'Noto+Sans+Thai' },
    { name: 'Sarabun', family: `'Sarabun', sans-serif`, google: 'Sarabun' },
    { name: 'Amiri', family: `'Amiri', serif`, google: 'Amiri' },
    { name: 'Roboto', family: `'Roboto', sans-serif`, google: 'Roboto' }
];

/**
 * Pre‑load every font in FONT_CATALOG by injecting a <link rel="stylesheet">
 * that points to the Google‑Fonts CSS API.
 *
 * Returns a Promise that resolves when *all* stylesheet loads have fired.
 */
export function preloadFonts() {
    const head = document.head;
    const loadPromises = FONT_CATALOG.map(font => {
        const href = `https://fonts.googleapis.com/css2?family=${font.google}:wght@400;700&display=swap`;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        head.appendChild(link);

        // Resolve when the stylesheet finishes loading (or reject on error)
        return new Promise((resolve, reject) => {
            link.onload = () => resolve(font.name);
            link.onerror = () => reject(new Error(`Failed to load ${font.name}`));
        });
    });

    return Promise.allSettled(loadPromises)
        .then(results => {
            results.forEach(r => {
                if (r.status === 'rejected')
                    console.warn('[Font] ', r.reason);
            });
            console.info('[Font] All font preload attempts finished.');
        });
}