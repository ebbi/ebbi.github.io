// app/utils/theme.js
import { getStoredTheme, setStoredTheme } from './storage.js';

export function applySavedTheme() {
    const saved = getStoredTheme();
    document.documentElement.dataset.theme = saved;
}

export function toggleTheme() {
    if (typeof document === 'undefined') return; // SSR-safe

    const root = document.documentElement;
    const cur = root.dataset.theme || 'light';
    // Explicit allowed values — adjust if you add more themes.
    const allowed = new Set(['light', 'dark']);
    const current = allowed.has(cur) ? cur : 'light';
    const nxt = current === 'light' ? 'dark' : 'light';

    root.dataset.theme = nxt;

    if (typeof setStoredTheme === 'function') {
        setStoredTheme(nxt);
    } else {
        // Fallback: try localStorage directly (non-blocking)
        try {
            localStorage.setItem('local_storage_theme', nxt);
        } catch (e) {
            // ignore storage errors (e.g. Safari private mode)
        }
    }

    // Optional: update UA color-scheme hint
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.content = nxt;
}