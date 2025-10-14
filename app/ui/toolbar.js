/* ---------------------------------------------------------------
   Toolbar component
   --------------------------------------------------------------- */
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

    // ---------- Language selector ----------
    const langSelect = document.createElement('select');
    langSelect.id = 'langSelect';
    langSelect.style.flex = '0 0 auto';
    langSelect.innerHTML = SUPPORTED_LANGS.map(code => {
        const sel = code === getStoredLang() ? 'selected' : '';
        const lbl = LANGUAGE_LABELS[code] || code.toUpperCase();
        return `<option value="${code}" ${sel}>${lbl}</option>`;
    }).join('');
    langSelect.onchange = ev => {
        const newLang = ev.target.value;
        if (newLang !== getStoredLang()) {
            setStoredLang(newLang);
            applyDirection(newLang);
            router.navigate(`/${newLang}`, true);
        }
    };

    // ---------- Settings button ----------
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

    toolbar.appendChild(homeBtn);
    toolbar.appendChild(langSelect);
    toolbar.appendChild(settingsBtn);
    toolbar.appendChild(themeBtn);
    container.appendChild(toolbar);
}