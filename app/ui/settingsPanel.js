// app/ui/settingsPanel.js
/**
 * Render the Settings page – FAQ style.
 *
 * The page displays a single <details> element (closed by default). The
 * <summary> contains the localized question; expanding the element reveals
 * the intro paragraph, an ordered list of steps, and a closing paragraph.
 *
 * All UI strings are stored in `app/data/settingsData.js`.  The renderer
 * reads the current language from local‑storage, falls back to English,
 * and builds the DOM purely with JavaScript – **no external CSS import**.
 *
 * @param {HTMLElement} container – the element that will receive the settings UI
 *                                  (normally the page’s <main> element).
 */
import { SETTINGS_FAQ } from '../data/settingsData.js';
import { getStoredLang } from '../utils/storage.js';

export function renderSettingsPanel(container) {
    // -----------------------------------------------------------------
    // 1️⃣  Clear any previous content.
    // -----------------------------------------------------------------
    container.innerHTML = '';

    // -----------------------------------------------------------------
    // 2️⃣  Determine the UI language (fallback to English).
    // -----------------------------------------------------------------
    const lang = getStoredLang();
    const faq = SETTINGS_FAQ[lang] ?? SETTINGS_FAQ['en']; // always defined
        
    // -----------------------------------------------------------------
    // 3️⃣  Inject a tiny style block (no external CSS file needed).
    // -----------------------------------------------------------------
    const style = document.createElement('style');

    style.textContent = `
        /* -----------------------------------------------------------------
           Base card styling
           ----------------------------------------------------------------- */
        .settings-faq {
            margin: 1rem 0.5rem;
            padding: 0.5rem;
            border: 1px solid var(--border-surface, #ddd);
            border-radius: 0.5rem;
            background: var(--bg-surface, #fff);
        }
        .settings-faq > summary {
            font-weight: 600;
            cursor: pointer;
            margin-bottom: 0.4rem;
        }
        .settings-faq p {
            margin: 0.5rem 0;
        }

        /* -----------------------------------------------------------------
           1️⃣  Keep the list markers *inside* the <ol> so they never
               touch the <details> border (important for RTL languages).
           ----------------------------------------------------------------- */
        .settings-faq ol {
            list-style-position: inside;   /* marker stays inside the padding box */
            margin-left: 0;                /* we control spacing ourselves */
            padding-left: 0;               /* no extra indent */
        }

        /* -----------------------------------------------------------------
           2️⃣  RTL adjustments – right‑align text and push the list a bit
               away from the right border.
           ----------------------------------------------------------------- */
        .settings-faq[dir="rtl"] {
            text-align: right;
        }
        .settings-faq[dir="rtl"] ol {
            margin-right: 1.5rem;   /* space between numbers and the border */
        }

        /* -----------------------------------------------------------------
           3️⃣  Numeral systems per language
           ----------------------------------------------------------------- */
        .lang-th ol   { list-style-type: thai; }          /* ๑, ๒, ๓ … */
        .lang-fa ol   { list-style-type: persian; }       /* ۱, ۲, ۳ … */
        .lang-ar ol   { list-style-type: arabic-indic; }  /* ١, ٢, ٣ … */

        /* -----------------------------------------------------------------
           4️⃣  Native numerals for Hindi, Japanese and Chinese (LTR).
               We hide the default marker and inject a counter with the
               appropriate Unicode‑numeric style.
           ----------------------------------------------------------------- */
        /* Hide the default marker – we’ll generate our own */
        .lang-hi ol,
        .lang-ja ol,
        .lang-zh ol {
            list-style: none;
            counter-reset: li-counter;
        }
        .lang-hi li::before,
        .lang-ja li::before,
        .lang-zh li::before {
            display: inline-block;
            width: 1.2em;               /* reserve space for the number */
            margin-right: 0.3em;
            text-align: right;
            font-weight: 600;
            content: counter(li-counter) ". ";
            counter-increment: li-counter;
        }
        /* Hindi – Devanagari digits */
        .lang-hi li::before {
            content: counter(li-counter, devanagari) ". ";
        }
        /* Japanese – Katakana (full‑width) digits */
        .lang-ja li::before {
            content: counter(li-counter, katakana) ". ";
        }
        /* Chinese – CJK‑Ideographic (Chinese numerals) */
        .lang-zh li::before {
            content: counter(li-counter, cjk-ideographic) ". ";
        }

        /* -----------------------------------------------------------------
           5️⃣  Ensure the <details> element inherits the page direction.
           ----------------------------------------------------------------- */
        .settings-faq {
            direction: inherit;   /* picks up the <html dir> value */
        }
    `;

    container.appendChild(style);

    // -----------------------------------------------------------------
    // 4️⃣  Build the <details> element.
    // -----------------------------------------------------------------
    const details = document.createElement('details');
    details.open = false;                // closed by default
    // Base class for styling + a language‑specific hook (e.g. "lang-th")
    details.className = `settings-faq lang-${lang}`;

    // ---- <summary> (question) ----
    const summary = document.createElement('summary');
    summary.textContent = faq.question;
    details.appendChild(summary);

    // ---- Intro paragraph ----
    const intro = document.createElement('p');
    intro.textContent = faq.intro;
    details.appendChild(intro);

    // ---- Ordered list of steps ----
    const ol = document.createElement('ol');
    faq.steps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        ol.appendChild(li);
    });
    details.appendChild(ol);

    // ---- Outro paragraph ----
    const outro = document.createElement('p');
    outro.textContent = faq.outro;
    details.appendChild(outro);

    // -----------------------------------------------------------------
    // 5️⃣  Insert the assembled <details> into the container.
    // -----------------------------------------------------------------
    container.appendChild(details);
}