// app/ui/toolbar.js
import { toggleTheme } from '../utils/theme.js';
import { getLocale } from '../data/locales.js';
import { applyDirection } from '../utils/rtl.js';
import { setStoredLang, getStoredLang } from '../utils/storage.js';

export function renderToolbar(container) {
    // -----------------------------------------------------------------
    // 1️⃣  Empty the container (in case this runs more than once)
    // -----------------------------------------------------------------
    container.innerHTML = '';

    // -----------------------------------------------------------------
    // 2️⃣  Detect page direction (ltr / rtl) – only needed for the tooltip
    // -----------------------------------------------------------------
    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';

    /* -----------------------------------------------------------------
       3️⃣  Create the three icons (Home, Theme, Help)
       ----------------------------------------------------------------- */
    const homeBtn = document.createElement('button');
    homeBtn.id = 'homeBtn';
    homeBtn.title = 'Home';
    homeBtn.textContent = '🏠';
    homeBtn.style.flex = '0 0 auto';
    homeBtn.onclick = () => {
        // Navigate to the root of the stored language (replaceState → no extra history entry)
        window.router.navigate(`/${getStoredLang()}/`, true);
    };

    const themeBtn = document.createElement('button');
    themeBtn.id = 'themeToggle';
    themeBtn.title = getLocale(getStoredLang()).toggleTheme ||
        'Toggle light/dark mode';
    themeBtn.textContent = '🌙';
    themeBtn.style.flex = '0 0 auto';
    themeBtn.onclick = toggleTheme;

    // ----- NEW HELP BUTTON -------------------------------------------------
    const helpBtn = document.createElement('button');
    helpBtn.id = 'helpBtn';
    helpBtn.title = getLocale(getStoredLang()).helpHeader || 'Help';
    helpBtn.textContent = '❓';               // you can also use ℹ️ or 🛈
    helpBtn.style.flex = '0 0 auto';

    helpBtn.onclick = () => {
        // Navigate to the generic help page, preserving the current language.
        window.router.navigate(`/${getStoredLang()}/help`, true);
    };

    // -----------------------------------------------------------------
    // 4️⃣  Two containers – one for Home, one for Theme+Settings
    // -----------------------------------------------------------------
    const leftContainer = document.createElement('div');
    leftContainer.style.display = 'flex';
    leftContainer.style.alignItems = 'center';
    leftContainer.appendChild(homeBtn); // Home stays on the “start” side

    const rightContainer = document.createElement('div');
    rightContainer.style.display = 'flex';
    rightContainer.style.alignItems = 'center';
    rightContainer.style.gap = '0.5rem';
    rightContainer.appendChild(themeBtn);
    rightContainer.appendChild(helpBtn);
    // rightContainer.appendChild(settingsBtn); // Theme & Settings together

    // -----------------------------------------------------------------
    // 5️⃣  Assemble the toolbar – space‑between pushes the containers apart
    // -----------------------------------------------------------------
    const toolbar = document.createElement('header');
    toolbar.id = 'toolbar';
    toolbar.className = 'toolbar';
    toolbar.style.display = 'flex';
    toolbar.style.justifyContent = 'space-between';
    toolbar.style.alignItems = 'center';
    toolbar.appendChild(leftContainer);
    toolbar.appendChild(rightContainer);

    // -----------------------------------------------------------------
    // 6️⃣  Insert the toolbar into the supplied container
    // -----------------------------------------------------------------
    container.appendChild(toolbar);
}