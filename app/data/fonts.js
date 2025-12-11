// app/data/fonts.js
// app/data/fonts.js
export const FONT_CATALOG = [
    {
        // Open Sans – widely used, highly readable UI font
        name: 'Font - Open Sans',
        family: `'Open Sans', sans-serif`,
        google: 'Open+Sans'                     // → https://fonts.googleapis.com/css2?family=Open+Sans
    },
    {
        // Kanit – Thai‑friendly sans‑serif
        name: 'Font - Kanit',
        family: `'Kanit', sans-serif`,
        google: 'Kanit'                         // → https://fonts.googleapis.com/css2?family=Kanit
    },
    { name: 'Font - Roboto', family: `'Roboto', sans-serif`, google: 'Roboto' },
    {
        // Noto Nastaliq Urdu – beautiful calligraphic Urdu script
        name: 'Font - Noto Nastaliq Urdu',
        family: `'Noto Nastaliq Urdu', serif`,
        // Google‑Fonts URL parameter (spaces become “+”)
        google: 'Noto+Nastaliq+Urdu'   // → https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu
    },
    {
        // Noto Sans Thai – the Thai‑specific variant of Noto Sans
        name: 'Font - Noto Sans Thai',
        family: `'Noto Sans Thai', sans-serif`,
        google: 'Noto+Sans+Thai'                // → https://fonts.googleapis.com/css2?family=Noto+Sans+Thai
    },
    {
        // Amiri – classic Arabic‑script serif (already in your project)
        name: 'Font - Amiri',
        family: `'Amiri', serif`,
        google: 'Amiri'                         // → https://fonts.googleapis.com/css2?family=Amiri
    }
];
/**
 * Inject a <link> for each Google‑Font and resolve when all have loaded.
 */
export function preloadFonts() {
    const head = document.head;
    const promises = FONT_CATALOG.map(f => {
        const href = `https://fonts.googleapis.com/css2?family=${f.google}:wght@400;700&display=swap`;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        head.appendChild(link);
        return new Promise((res, rej) => {
            link.onload = () => res(f.name);
            link.onerror = () => rej(new Error(`Failed to load ${f.name}`));
        });
    });
    return Promise.allSettled(promises).then(r => {
        r.forEach(item => {
            if (item.status === 'rejected') console.warn('[Font]', item.reason);
        });
        console.info('[Font] preload finished');
    });
}