// app/ui/toolbar.js
import { SUPPORTED_LANGS, LANGUAGE_LABELS } from '../data/locales.js';
import { setStoredLang, getStoredLang } from '../utils/storage.js';
import { toggleTheme } from '../utils/theme.js';
import { getLocale } from '../data/locales.js';
import { applyDirection } from '../utils/rtl.js';

export function renderToolbar(container) {
    const router = window.router;                     // global router

    const toolbar = document.createElement('header');
    toolbar.id = 'toolbar';
    toolbar.className = 'toolbar';

    // ---------- Home button ----------
    const homeBtn = document.createElement('button');
    homeBtn.id = 'homeBtn';
    homeBtn.title = 'Home';
    homeBtn.textContent = '🏠';
    homeBtn.style.flex = '0 0 auto';
    homeBtn.onclick = () => {
        router.navigate(`/${getStoredLang()}`, true);
    };

    // ---------- Settings (gear) button ----------
    const settingsBtn = document.createElement('button');
    settingsBtn.id = 'settingsBtn';
    settingsBtn.title = 'Settings';
    settingsBtn.textContent = '⚙️';
    settingsBtn.style.flex = '0 0 auto';
    settingsBtn.onclick = () => {
        router.navigate(`/${getStoredLang()}/settings`, true);
    };

    // ---------- Theme toggle ----------
    const themeBtn = document.createElement('button');
    themeBtn.id = 'themeToggle';
    themeBtn.title = getLocale(getStoredLang()).content.toggleTheme || 'Toggle light/dark mode';
    themeBtn.textContent = '🌙';
    themeBtn.style.flex = '0 0 auto';
    themeBtn.onclick = toggleTheme;

    // Flex layout – left‑to‑right order
    toolbar.style.display = 'flex';
    toolbar.style.justifyContent = 'space-between';
    toolbar.style.alignItems = 'center';

    // Order: Home → Theme toggle → Settings (gear)
    toolbar.appendChild(homeBtn);
    toolbar.appendChild(themeBtn);
    toolbar.appendChild(settingsBtn);
    container.appendChild(toolbar);
}