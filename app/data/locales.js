// app/data/locales.js
import { loadJSON } from '../utils/fetch.js';   // tiny wrapper (see utils/fetch.js)

//export const SUPPORTED_LANGS = ['th', 'fa', 'zh', 'ja', 'es', 'en', 'hi', 'ar'];
export const SUPPORTED_LANGS = ['th', 'fa', 'en'];

export const FALLBACK_LANG = 'th';
export const LS_LANG_KEY = 'local_storage_app_lang';

export const LANGUAGE_LABELS = {
    th: 'TH - ไทย',
    en: 'EN - English',
    fa: 'FA - فارسی'
    /*
    zh: 'ZH - 中文',
    ja: 'JA - 日本語',
    es: 'ES - Español',
    hi: 'HI - हिन्दी',
    ar: 'AR - العربية'
    */
};

// The locale cache will hold the raw JSON objects directly.
// Consumers can now do `const loc = getLocale(lang); loc.toggleTheme`.
export const locales = {};   // will be filled with { en:{…}, th:{…}, … }

/**
 * Load every locale file, wrap it in a `content` object and cache it.
 * Returns a Promise that resolves when *all* locales are ready.
 */
export async function loadLocales() {
    const loaders = SUPPORTED_LANGS.map(lang =>
        loadJSON(`/app/locales/${lang}.json`)
            .catch(() => {
                console.warn(`Locale "${lang}" not found – using empty fallback.`);
                return {};                     // empty fallback
            })
            .then(data => {
                // Store the raw JSON – no extra nesting.
                locales[lang] = data;
                console.info(`[Locale] Loaded "${lang}"`);
            })
    );

    await Promise.allSettled(loaders);
}

/** Return the locale object for *lang* (never undefined). */
export function getLocale(lang) {
    return locales[lang] ?? locales[FALLBACK_LANG];
}