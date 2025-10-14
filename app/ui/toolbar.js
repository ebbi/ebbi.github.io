// app/ui/toolbar.js
import { toggleTheme } from '../utils/theme.js';
import { getLocale } from '../data/locales.js';
import { applyDirection } from '../utils/rtl.js';
import { setStoredLang, getStoredLang } from '../utils/storage.js';

export function renderToolbar(container) {
    const router = window.router;                     // global router

    // -----------------------------------------------------------------
    // Ensure the container is empty (in case this runs more than once)
    // -----------------------------------------------------------------
    container.innerHTML = '';

    // ---------- Home button ----------
    const homeBtn = document.createElement('button');
    homeBtn.id = 'homeBtn';
    homeBtn.title = 'Home';
    homeBtn.textContent = '🏠';
    homeBtn.style.flex = '0 0 auto';
    homeBtn.onclick = () => {
        router.navigate(`/${getStoredLang()}`, true);
    };

    // ---------- Right‑hand container (theme + settings) ----------
    const rightContainer = document.createElement('div');
    rightContainer.style.display = 'flex';
    rightContainer.style.alignItems = 'center';
    rightContainer.style.marginLeft = 'auto';   // pushes it to the far right
    rightContainer.style.gap = '0.5rem';

    // Theme toggle (light/dark)
    const themeBtn = document.createElement('button');
    themeBtn.id = 'themeToggle';
    themeBtn.title = getLocale(getStoredLang()).content.toggleTheme || 'Toggle light/dark mode';
    themeBtn.textContent = '🌙';
    themeBtn.style.flex = '0 0 auto';
    themeBtn.onclick = toggleTheme;

    // Settings (gear) button
    const settingsBtn = document.createElement('button');
    settingsBtn.id = 'settingsBtn';
    settingsBtn.title = 'Settings';
    settingsBtn.textContent = '⚙️';
    settingsBtn.style.flex = '0 0 auto';
    settingsBtn.onclick = () => {
        router.navigate(`/${getStoredLang()}/settings`, true);
    };

    // Assemble right‑hand group
    rightContainer.appendChild(themeBtn);
    rightContainer.appendChild(settingsBtn);

    // Assemble the toolbar (left‑to‑right order)
    container.appendChild(homeBtn);
    container.appendChild(rightContainer);
}