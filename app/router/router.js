// app/router/router.js
// ---------------------------------------------------------------
// Central router configuration
// ---------------------------------------------------------------

import Router from "../routerClass.js";

import {
    homeHandler,
    exercisesHandler,
    exerciseDetailHandler,
    helpHandler,
    booksHandler,
    notFoundHandler,
    testExerciseHandler          // <-- import the test handler
} from "../ui/routes.js";

export const router = new Router([
    { path: "/", handler: homeHandler },
    { path: "/:lang", handler: homeHandler },

    // -------------------------------------------------
    // 1️⃣  Exercises list (same as before)
    // -------------------------------------------------
    { path: "/:lang/exercises", handler: exercisesHandler },

    // -------------------------------------------------
    // 2️⃣  **Test‑yourself** route – must come BEFORE the generic detail route
    // -------------------------------------------------
    { path: "/:lang/exercises/:id/test", handler: testExerciseHandler },

    // -------------------------------------------------
    // 3️⃣  Single‑exercise detail (dictionary, etc.)
    // -------------------------------------------------
    { path: "/:lang/exercises/:id", handler: exerciseDetailHandler },

    { path: "/:lang/help", handler: helpHandler },

    // -----------------------------------------------------------------
    // Deep‑link for Books & Blogs – language is required
    // -----------------------------------------------------------------
    { path: "/:lang/books/:pubId/:pubLang", handler: booksHandler },

    // -----------------------------------------------------------------
    // Optional‑language shortcut – redirects to the stored UI language
    // -----------------------------------------------------------------
    {
        path: "/books/:pubId/:pubLang",
        handler: ({ pubId, pubLang }) => {
            // Pull the language the user currently has stored
            const { getStoredLang } = require('../utils/storage.js');
            const lang = getStoredLang();
            // Replace the URL (replaceState) so the back button feels natural
            window.router.navigate(`/${lang}/books/${pubId}/${pubLang}`, true);
        }
    },

    // -----------------------------------------------------------------
    // Catch‑all 404
    // -----------------------------------------------------------------
    { path: "*", handler: notFoundHandler }
]);


// Expose globally – many modules do `window.router.navigate(...)`
if (typeof window !== "undefined") {
    // -------------------------------------------------------------
    //  Global navigation guard – cancel any ongoing speech before
    //  the router changes the URL (covers Home, Help, language change,
    //  exercise navigation, etc.).
    // -------------------------------------------------------------
    const originalNavigate = router.navigate.bind(router);
    router.navigate = (dest, replace = false) => {
        // Abort any ongoing speech before the URL changes
        if (window.speechManager) {
            window.speechManager.stop();
        }
        return originalNavigate(dest, replace);
    };

    window.router = router;

    /* <<< INSERT >>> */
    // Expose the speech manager on the window so any module (toolbar button,
    // router guard, etc.) can reach it without circular imports.
    if (typeof window !== 'undefined') {
        import('./../utils/speechManager.js').then(mod => {
            window.speechManager = mod.speechManager;
        });
    }

}
