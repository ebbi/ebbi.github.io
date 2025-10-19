// app/bootstrap.js
/* --------------------------------------------------------------
   Imports
   -------------------------------------------------------------- */
//import { applyStoredFont } from './utils/fontHelper.js';

import {
    loadLocales,
    getLocale,
    SUPPORTED_LANGS,
    FALLBACK_LANG,
    LS_LANG_KEY
} from './data/locales.js';

import { preloadFonts } from './data/fonts.js';
// Remove the line entirely – the global `window.router` is already defined.
import { router } from './router/router.js';
import { applySavedTheme } from './utils/theme.js';
import {
    getStoredLang,
    setStoredLang,
    getStoredFont,
    getStoredVoice,
    setStoredVoice
} from './utils/storage.js';

import {
    homeHandler,
    exercisesHandler,
    exerciseDetailHandler,
    helpHandler,
    notFoundHandler
} from './ui/routes.js';

import { FONT_CATALOG } from './data/fonts.js';
import { applyStoredFont } from './utils/fontHelper.js';

import { applyDirection, isRtlLang } from './utils/rtl.js';

/* --------------------------------------------------------------
   1️⃣ Load locales first – we need them before any UI is built
   -------------------------------------------------------------- */
(async () => {
    try {
        await loadLocales();          // populates `locales` with {en:{content:{…}}, …}
        await preloadFonts();         // optional but improves UX
        applySavedTheme();            // early theme (light/dark)

        /* --------------------------------------------------------------
           2️⃣ Router creation – same routes you already used
           -------------------------------------------------------------- */
        window.router = new Router([
            { path: '/', handler: homeHandler },
            { path: '/:lang', handler: homeHandler },
            { path: '/:lang/exercises', handler: exercisesHandler },
            { path: '/:lang/exercises/:id', handler: exerciseDetailHandler },
            { path: '/:lang/help', handler: helpHandler },
        ]);
        router.setNotFound(notFoundHandler);

        /* --------------------------------------------------------------
           3️⃣ Persist language & set text direction (LTR / RTL)
           -------------------------------------------------------------- */
        let storedLang = getStoredLang();   // reads from LS or navigator
        if (!SUPPORTED_LANGS.includes(storedLang)) {
            setStoredLang(FALLBACK_LANG);
            storedLang = FALLBACK_LANG; // fallback guaranteed to be valid
        }


        /* --------------------------------------------------------------
           3️⃣ Persist TTS Voice
           -------------------------------------------------------------- */
        let storedVoice = getStoredVoice();   // reads from LS or navigator
        const allVoices = ('speechSynthesis' in window) ? speechSynthesis.getVoices() : [];

        if (allVoices.includes(storedVoice)) {
            setStoredVoice(storedVoice);
        }

        // Apply the correct direction globally (now via the helper)
        applyDirection(storedLang);

        /* --------------------------------------------------------------
           4️⃣ Apply the persisted font (if any) BEFORE any UI is rendered
           -------------------------------------------------------------- */
        //        applyCurrentFont(FONT_CATALOG, getStoredFont);
        // Apply the persisted font (single source of truth)
        applyStoredFont();

        /* --------------------------------------------------------------
           5️⃣ Finally resolve the current URL → first page view
           -------------------------------------------------------------- */
        router.resolve();   // this will call the appropriate handler
    } catch (e) {
        console.error('❌ App initialization failed:', e);
        document.body.textContent = 'Failed to start the application – see console for details.';
    }
})();