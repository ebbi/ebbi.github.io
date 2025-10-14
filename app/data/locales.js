// app/data/locales.js
import { loadJSON } from '../utils/fetch.js';   // tiny wrapper (see utils/fetch.js)

export const SUPPORTED_LANGS = ['th', 'fa', 'zh', 'ja', 'es', 'en', 'hi', 'ar'];
export const FALLBACK_LANG = 'en';
export const LS_LANG_KEY = 'local_storage_lang';

export const LANGUAGE_LABELS = {
    th: 'TH - ไทย',
    fa: 'FA - فارسی',
    zh: 'ZH - 中文',
    ja: 'JA - 日本語',
    es: 'ES - Español',
    en: 'EN - English',
    hi: 'HI - हिन्दी',
    ar: 'AR - العربية'
};

export const locales = {};   // will be filled with { en:{content:{…}}, … }

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
                // <<< IMPORTANT >>>  wrap the raw JSON in a `content` property
                locales[lang] = { content: data };
                console.info(`[Locale] Loaded "${lang}"`);
            })
    );

    await Promise.allSettled(loaders);
}

/**
 * Retrieve the locale object for a given language (always returns a
 * `{content:{…}}` shape – never undefined).
 */
export function getLocale(lang) {
    return locales[lang] || locales[FALLBACK_LANG];
}