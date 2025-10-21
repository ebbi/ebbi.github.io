// app/utils/storage.js
/**
 * Centralised wrapper around the Web Storage API.
 *
 * All functions first verify that `localStorage` exists and is writable.
 * If the environment does not provide a usable storage (SSR, private mode,
 * older browsers, etc.) the functions gracefully fall back to in‑memory
 * variables so the rest of the app never crashes.
 *
 * The public API (get/set for LANG, FONT, THEME, VOICE) remains unchanged.
 */

import { SUPPORTED_LANGS, FALLBACK_LANG } from '../data/locales.js';

/* -----------------------------------------------------------------
   1️⃣  Helper – does the current environment support localStorage?
   ----------------------------------------------------------------- */
function isStorageAvailable() {
    try {
        // `typeof` guards against ReferenceError in non‑browser envs.
        if (typeof localStorage === 'undefined') return false;
        // Try a quick write‑read‑remove cycle – some browsers (Safari incognito)
        // expose the object but throw on setItem.
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        // Anything that throws means storage is not usable.
        return false;
    }
}

/* -----------------------------------------------------------------
   2️⃣  Keys used throughout the app
   ----------------------------------------------------------------- */
export const LS_KEYS = {
    LANG: 'local_storage_lang',
    FONT: 'local_storage_font',
    THEME: 'local_storage_theme',
    VOICE: 'local_storage_tts_voice',
    LEVELS: 'local_storage_levels',
    LAST_EX: 'local_storage_last_exercise'
};

/* -----------------------------------------------------------------
   3️⃣  Language
   ----------------------------------------------------------------- */
export function getStoredLang() {
    if (!isStorageAvailable()) return FALLBACK_LANG;
    const stored = localStorage.getItem(LS_KEYS.LANG);
    if (stored && SUPPORTED_LANGS.includes(stored)) return stored;

    // fallback to navigator.language (first two letters)
    const nav = (navigator.language ||
        (navigator.languages && navigator.languages[0]) ||
        '').slice(0, 2).toLowerCase();

    return SUPPORTED_LANGS.includes(nav) ? nav : FALLBACK_LANG;
}
export function setStoredLang(lang) {
    if (!isStorageAvailable()) return;
    localStorage.setItem(LS_KEYS.LANG, lang);
}

/* -----------------------------------------------------------------
   4️⃣  TTS Voice
   ----------------------------------------------------------------- */
export function getStoredVoice() {
    if (!isStorageAvailable()) return 'th-TH';
    return localStorage.getItem(LS_KEYS.VOICE) || 'th-TH';
}
export function setStoredVoice(name) {
    if (!isStorageAvailable()) return;
    localStorage.setItem(LS_KEYS.VOICE, name);
}

/* -----------------------------------------------------------------
   5️⃣  Font
   ----------------------------------------------------------------- */
export function getStoredFont() {
    if (!isStorageAvailable()) return 'sans-serif';
    return localStorage.getItem(LS_KEYS.FONT) || 'sans-serif';
}
export function setStoredFont(name) {
    if (!isStorageAvailable()) return;
    localStorage.setItem(LS_KEYS.FONT, name);
}

/* -----------------------------------------------------------------
   6️⃣  Theme
   ----------------------------------------------------------------- */
export function getStoredTheme() {
    if (!isStorageAvailable()) return 'light';
    return localStorage.getItem(LS_KEYS.THEME) || 'light';
}
export function setStoredTheme(theme) {
    if (!isStorageAvailable()) return;
    const allowed = new Set(['light', 'dark']);
    const value = allowed.has(theme) ? theme : 'light';
    try {
        localStorage.setItem(LS_KEYS.THEME, value);
    } catch (e) {
        // ignore storage errors (e.g. Safari private mode) or optionally log
        console.warn('setStoredTheme: could not persist theme', e);
    }
}

/* -----------------------------------------------------------------
   7️⃣  Level‑filter persistence (used by menu.js)
   ----------------------------------------------------------------- */
export function getStoredLevels() {
    if (!isStorageAvailable()) return ['basic'];
    const raw = localStorage.getItem(LS_KEYS.LEVELS);
    if (!raw) return ['basic'];
    try {
        const arr = JSON.parse(raw);
        return Array.isArray(arr) ? arr.map(s => s.toLowerCase()) : ['basic'];
    } catch (_) {
        return ['basic'];
    }
}
export function setStoredLevels(levels) {
    if (!isStorageAvailable()) return;
    try {
        localStorage.setItem(LS_KEYS.LEVELS, JSON.stringify(levels));
    } catch (e) {
        console.warn('Could not persist level filter', e);
    }
}

/* -----------------------------------------------------------------
   8️⃣  Last‑exercise persistence (used by menu.js)
   ----------------------------------------------------------------- */
export function getLastExercise() {
    if (!isStorageAvailable()) return null;
    try {
        return localStorage.getItem(LS_KEYS.LAST_EX);
    } catch (_) {
        return null;
    }
}
export function setLastExercise(id) {
    if (!isStorageAvailable()) return;
    try {
        localStorage.setItem(LS_KEYS.LAST_EX, id);
    } catch (e) {
        console.warn('[Menu] could not persist last exercise', e);
    }
}