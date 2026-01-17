// app/ui/toolbar.js
import { toggleTheme, syncAppState } from '../utils/theme.js';
import { getLocale, SUPPORTED_LANGS, LANGUAGE_LABELS } from '../data/locales.js';
import { setStoredLang, getStoredLang } from '../utils/storage.js';
import { applyDirection } from '../utils/rtl.js';
import { populateFontSelect } from './fontSelect.js';

export function renderToolbar(container) {
    // 1️⃣ Cleanup: Remove any existing hidden selectors from the body
    document.querySelectorAll('.completely-hidden').forEach(el => el.remove());

    container.innerHTML = '';
    const lang = getStoredLang();
    //   const locale = getLocale(lang);

    const toolbar = document.createElement('header');
    toolbar.id = 'toolbar';
    toolbar.className = 'toolbar';

    // --- Left side ---
    const leftContainer = document.createElement('div');
    const homeBtn = document.createElement('button');
    homeBtn.textContent = '🏠';
    homeBtn.onclick = () => {
        if (window.speechManager) window.speechManager.stop();
        window.router.navigate(`/${lang}/`, true);
        location.reload();
    };
    leftContainer.appendChild(homeBtn);

    // --- Right side ---
    const rightContainer = document.createElement('div');
    rightContainer.className = 'toolbar-right';

    // 🌐 Language Trigger
    const langBtn = document.createElement('button');
    langBtn.textContent = '🌐';
    const hiddenLangSelect = document.createElement('select');
    hiddenLangSelect.className = 'completely-hidden';
    SUPPORTED_LANGS.forEach(code => {
        const opt = document.createElement('option');
        opt.value = code;
        opt.selected = (code === lang);
        opt.textContent = LANGUAGE_LABELS[code] || code.toUpperCase();
        hiddenLangSelect.appendChild(opt);
    });

    hiddenLangSelect.onchange = (e) => {

        const newLang = e.target.value;
        const currentPath = window.location.pathname;
        setStoredLang(newLang);

        let newPath;
        const segments = currentPath.split('/').filter(Boolean);
        // Check if the first segment is a 2-letter lang code (e.g., 'en', 'fa')
        const hasLangPrefix = segments.length > 0 && segments[0].length === 2;

        if (hasLangPrefix) {
            // Replace existing: /en/help -> /th/help
            segments[0] = newLang;
            newPath = '/' + segments.join('/') + '/';
        } else {
            // Prepend to root: / -> /th/
            newPath = '/' + newLang + '/' + segments.join('/');
        }

        console.log(`[Toolbar] Language change detected: ${newLang}`);
        console.log(`[Toolbar] Redirecting to: ${newPath}`);

        window.location.href = newPath;

        // Sync attributes immediately for visual consistency (dir/lang)
        //    syncAppState();
        //    location.reload(); // Simplest way to sync all states
    };

    //   document.body.appendChild(hiddenLangSelect); // Appending to body fixes Firefox rendering
    toolbar.appendChild(hiddenLangSelect);
    langBtn.onclick = () => hiddenLangSelect.showPicker();

    // 🔠 Font Trigger
    const fontBtn = document.createElement('button');
    fontBtn.textContent = '🔠';
    const hiddenFontSelect = document.createElement('select');
    hiddenFontSelect.className = 'completely-hidden';
    populateFontSelect(hiddenFontSelect);
    //   document.body.appendChild(hiddenFontSelect);
    toolbar.appendChild(hiddenFontSelect);

    fontBtn.onclick = () => hiddenFontSelect.showPicker();

    // Theme & Help
    const themeBtn = document.createElement('button');
    themeBtn.textContent = '🌓';
    themeBtn.onclick = toggleTheme;

    const helpBtn = document.createElement('button');
    helpBtn.textContent = '❓';
    helpBtn.onclick = () => window.router.navigate(`/${lang}/help`, true);

    // Assembly
    rightContainer.append(langBtn, fontBtn, themeBtn, helpBtn);
    toolbar.append(leftContainer, rightContainer);
    container.appendChild(toolbar);
}