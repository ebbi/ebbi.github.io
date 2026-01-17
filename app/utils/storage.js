// app/utils/storage.js
import { SUPPORTED_LANGS, FALLBACK_LANG } from '../data/locales.js';

export const LS_KEYS = {
    LANG: 'local_storage_app_lang',
    FONT: 'local_storage_font',
    THEME: 'local_storage_theme',
    VOICE: 'local_storage_tts_voice'
};

/* ---------- Language ---------- */
export function getStoredLang() {
    const stored = localStorage.getItem(LS_KEYS.LANG);
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;

    // fallback to navigator.language (first two letters)
    const nav = (navigator.language ||
        (navigator.languages && navigator.languages[0]) ||
        '').slice(0, 2).toLowerCase();

    return SUPPORTED_LANGS.includes(nav) ? nav : FALLBACK_LANG;
}
export function setStoredLang(lang) {
    localStorage.setItem(LS_KEYS.LANG, lang);
}

/* ---------- TTS VOICE ---------- */
export function getStoredVoice() {
    return localStorage.getItem(LS_KEYS.VOICE) || 'th-TH';
}
export function setStoredVoice(name) {
    localStorage.setItem(LS_KEYS.VOICE, name);
}

/* ---------- Font ---------- */
export function getStoredFont() {
    return localStorage.getItem(LS_KEYS.FONT) || 'sans-serif';
}
export function setStoredFont(name) {
    localStorage.setItem(LS_KEYS.FONT, name);
}

/* ---------- Theme ---------- */
export function getStoredTheme() {
    return localStorage.getItem(LS_KEYS.THEME) || 'light';
}

export function setStoredTheme(theme) {
    const allowed = new Set(['light', 'dark']);
    const value = allowed.has(theme) ? theme : 'light';
    if (typeof localStorage === 'undefined') return;
    try {
        localStorage.setItem(LS_KEYS.THEME, value);
    } catch (e) {
        // ignore storage errors (e.g. Safari private mode) or optionally log
        console.warn('setStoredTheme: could not persist theme', e);
    }
}