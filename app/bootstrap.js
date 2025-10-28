// app/bootstrap.js
/* --------------------------------------------------------------
   Imports
   -------------------------------------------------------------- */
import { loadLocales, SUPPORTED_LANGS, FALLBACK_LANG } from './data/locales.js';
import { preloadFonts } from './data/fonts.js';
import { router } from './router/router.js';          // <-- singleton router
import { applySavedTheme } from './utils/theme.js';
import {
    getStoredLang,
    setStoredLang,
    getStoredFont,
    getStoredVoice,
    setStoredVoice
} from './utils/storage.js';
import { applyStoredFont } from './utils/fontHelper.js';
import { applyDirection } from './utils/rtl.js';



/* --------------------------------------------------------------
   1️⃣ Load everything that must be ready before we render UI
   -------------------------------------------------------------- */
(async () => {
    try {
        // -----------------------------------------------------------------
        // 0️⃣ Locales – needed for any UI text
        // -----------------------------------------------------------------
        await loadLocales();                 // fills the `locales` cache

        // -----------------------------------------------------------------
        // 1️⃣ Fonts – optional, but we wait so the UI doesn’t flash
        // -----------------------------------------------------------------
        await preloadFonts();                // logs failures, does not block forever

        // -----------------------------------------------------------------
        // 2️⃣ Theme – set light/dark before anything paints
        // -----------------------------------------------------------------
        applySavedTheme();

        // -----------------------------------------------------------------
        // 3️⃣ Language persistence & direction
        // -----------------------------------------------------------------
        let storedLang = getStoredLang();    // reads from LS or navigator
        if (!SUPPORTED_LANGS.includes(storedLang)) {
            setStoredLang(FALLBACK_LANG);
            storedLang = FALLBACK_LANG;
        }
        applyDirection(storedLang);          // adds dir="ltr"/"rtl" attributes

        // -----------------------------------------------------------------
        // 4️⃣ TTS voice persistence (only if the SpeechSynthesis API exists)
        // -----------------------------------------------------------------
        const storedVoice = getStoredVoice();
        const allVoices = ('speechSynthesis' in window) ? speechSynthesis.getVoices() : [];
        if (allVoices.some(v => v.name === storedVoice)) {
            setStoredVoice(storedVoice);
        }

        // -----------------------------------------------------------------
        // 5️⃣ Font – apply the persisted font *before* any UI renders
        // -----------------------------------------------------------------
        applyStoredFont();

        // -----------------------------------------------------------------
        // 6️⃣ Check for redirect path and resolve the appropriate URL
        // -----------------------------------------------------------------
        const redirectPath = sessionStorage.getItem('redirect_path');
        if (redirectPath) {
            sessionStorage.removeItem('redirect_path');
            router.navigate(redirectPath, true);  // replace current history entry
        } else {
            router.resolve();   // normal route resolution
        }
    } catch (e) {
        console.error('❌ App initialization failed:', e);
        document.body.textContent = 'Failed to start the application – see console for details.';
    }
})();