// app/router/router.js
// ---------------------------------------------------------------
// Central router configuration
// ---------------------------------------------------------------
import { BASE_URL } from '../config.js';
import Router from "../routerClass.js";
import { getStoredLang } from '../utils/storage.js';

import {
    homeHandler,
    exercisesHandler,
    exerciseDetailHandler,
    helpHandler,
    booksHandler,
    notFoundHandler
} from "../ui/routes.js";

export const router = new Router([
    { path: "/", handler: homeHandler },
    { path: "/:lang", handler: homeHandler },

    { path: "/:lang/exercises", handler: exercisesHandler },
    { path: "/:lang/exercises/:id", handler: exerciseDetailHandler },

    { path: "/:lang/help", handler: helpHandler },

    // -----------------------------------------------------------------
    // Deep‑link for Books & Blogs – language is required
    // -----------------------------------------------------------------
    { path: "/:lang/books/:pubId/:pubLang", handler: booksHandler },

    // -----------------------------------------------------------------
    // Optional‑language shortcut – redirects to the stored UI language
    // -----------------------------------------------------------------
    /*
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
*/
    {
        path: "/books/:pubId/:pubLang",
        handler: async ({ pubId, pubLang }) => {
            // Pull the language the user currently has stored (now via ES‑module import) 
            const lang = getStoredLang();
            // 
            // Replace the URL (replaceState) so the back button feels natural 
            //           window.router.navigate('/${lang}/books/${pubId}/${pubLang}', true);
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
    window.router = router;
}