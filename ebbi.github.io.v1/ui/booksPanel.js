// ---------------------------------------------------------------
// app/ui/booksPanel.js
// ---------------------------------------------------------------
// Renders the “Books & Blogs” <details> panel that lives on the
// home page (and also on the deep‑link route).
// ---------------------------------------------------------------

import { loadJSON } from "../utils/fetch.js";
import { getLocale } from "../data/locales.js";

/**
 * Render the panel inside `container`.
 *
 * @param {HTMLElement} container   – element that will receive the panel.
 * @param {string} uiLang           – current UI language (e.g. "en").
 * @param {string|null} prePubId    – optional publication id to pre‑select
 *                                   (used for deep‑link URLs).
 * @param {string|null} preLang     – optional language code to pre‑select.
 */
export async function renderBooksPanel(container, uiLang, prePubId = null, preLang = null) {
    const locale = getLocale(uiLang);

    // -----------------------------------------------------------------
    // 0️⃣ Load the static JSON catalogue
    // -----------------------------------------------------------------
    const data = await loadJSON("app/data/books.json");
    const pubs = data.publications || [];

    // -----------------------------------------------------------------
    // 1️⃣ Build the <details> wrapper
    // -----------------------------------------------------------------
    const details = document.createElement("details");
//    details.open = true;                     // expanded by default

    const summary = document.createElement("summary");
    summary.textContent = locale.booksAndBlogs || "Books & Blogs";
    details.appendChild(summary);

    // -----------------------------------------------------------------
    // 2️⃣ Search input
    // -----------------------------------------------------------------
    const searchInput = document.createElement("input");
    searchInput.type = "search";
    searchInput.placeholder = locale.searchPlaceholder || "Search…";
    details.appendChild(searchInput);

    // -----------------------------------------------------------------
    // 3️⃣ Publication selector
    // -----------------------------------------------------------------
    const pubSelect = document.createElement("select");
    pubSelect.id = "pubSelect";

    const pubPlaceholder = document.createElement("option");
    pubPlaceholder.value = "";
    pubPlaceholder.disabled = true;
    pubPlaceholder.textContent = locale.selectPublication || "Select publication";
    pubSelect.appendChild(pubPlaceholder);

    pubs.forEach(pub => {
        const opt = document.createElement("option");
        opt.value = pub.id;
        opt.textContent = (pub.title[uiLang] || pub.title.en || pub.id);
        pubSelect.appendChild(opt);
    });
    details.appendChild(pubSelect);

    // -----------------------------------------------------------------
    // 4️⃣ Language selector (populated *after* a publication is chosen)
    // -----------------------------------------------------------------
    const langSelect = document.createElement("select");
    langSelect.id = "langSelect";

    const langPlaceholder = document.createElement("option");
    langPlaceholder.value = "";
    langPlaceholder.disabled = true;
    langPlaceholder.textContent = locale.selectLanguage || "Select language";
    langSelect.appendChild(langPlaceholder);
    details.appendChild(langSelect);

    // -----------------------------------------------------------------
    // 5️⃣ Cards grid – will be filled after the two selectors are set
    // -----------------------------------------------------------------
    const cardsGrid = document.createElement("div");
    cardsGrid.className = "books-cards-grid";

    details.appendChild(cardsGrid);

    // -----------------------------------------------------------------
    // 6️⃣ Helper – (re)populate language selector based on chosen pub
    // -----------------------------------------------------------------
    function populateLangs(publication) {
        // clear previous options (keep placeholder)
        langSelect.innerHTML = "";
        langSelect.appendChild(langPlaceholder);

        publication.languages.forEach(l => {
            const opt = document.createElement("option");
            opt.value = l;
            opt.textContent = l.toUpperCase(); // you could map to LANGUAGE_LABELS if you want
            langSelect.appendChild(opt);
        });
    }

    // -----------------------------------------------------------------
    // 7️⃣ Helper – render the card grid for the current pub + lang
    // -----------------------------------------------------------------
    function renderCards(publication, lang) {
        cardsGrid.innerHTML = ""; // clear

        const entries = publication.latestEntries || [];

        // simple search filter (case‑insensitive)
        const term = searchInput.value.trim().toLowerCase();

        const filtered = entries.filter(entry => {
            if (!term) return true;
            const title = (entry.title[lang] || entry.title.en || "").toLowerCase();
            const summary = (entry.summary[lang] || entry.summary.en || "").toLowerCase();
            return title.includes(term) || summary.includes(term);
        });

        filtered.forEach(entry => {
            const card = document.createElement("article");
            card.className = "book-card";

            // ---- media (image) ----
            if (entry.media && entry.media.image) {
                const img = document.createElement("img");
                img.src = entry.media.image;
                img.alt = (entry.title[lang] || entry.title.en || "");
                card.appendChild(img);
            }

            const content = document.createElement("div");
            content.className = "content";

            // ---- title ----
            const h3 = document.createElement("h3");
            h3.textContent = entry.title[lang] || entry.title.en || "";
            content.appendChild(h3);

            // ---- summary ----
            const p = document.createElement("p");
            p.textContent = entry.summary[lang] || entry.summary.en || "";
            content.appendChild(p);

            // ---- optional read‑more link (could be a placeholder) ----
            const a = document.createElement("a");
            a.href = "#";               // you can later point to a detailed view
            a.className = "read-more";
            a.textContent = locale.readMore || "Read more";
            content.appendChild(a);

            card.appendChild(content);
            cardsGrid.appendChild(card);
        });
    }

    // -----------------------------------------------------------------
    // 8️⃣ Event wiring
    // -----------------------------------------------------------------
    pubSelect.addEventListener("change", () => {
        const pubId = pubSelect.value;
        const publication = pubs.find(p => p.id === pubId);
        if (!publication) return;

        // Populate language dropdown for this publication
        populateLangs(publication);

        // If a language was already pre‑selected (deep‑link) try to keep it
        if (preLang && publication.languages.includes(preLang)) {
            langSelect.value = preLang;
            renderCards(publication, preLang);
        } else {
            // otherwise clear cards until a language is chosen
            cardsGrid.innerHTML = "";
        }
    });

    langSelect.addEventListener("change", () => {
        const pubId = pubSelect.value;
        const lang = langSelect.value;
        const publication = pubs.find(p => p.id === pubId);
        if (!publication) return;
        renderCards(publication, lang);
    });

    // Search works on the currently displayed cards
    searchInput.addEventListener("input", () => {
        const pubId = pubSelect.value;
        const lang = langSelect.value;
        const publication = pubs.find(p => p.id === pubId);
        if (!publication || !lang) return;
        renderCards(publication, lang);
    });

    // -----------------------------------------------------------------
    // 9️⃣ Pre‑selection for deep‑links (if arguments were passed)
    // -----------------------------------------------------------------
    if (prePubId) {
        const pubOption = Array.from(pubSelect.options).find(o => o.value === prePubId);
        if (pubOption) {
            pubSelect.value = prePubId;
            pubSelect.dispatchEvent(new Event("change"));
            // language will be set inside the change handler
        }
    }

    // -----------------------------------------------------------------
    // 10️⃣ Append the whole thing to the container
    // -----------------------------------------------------------------
    container.appendChild(details);
}