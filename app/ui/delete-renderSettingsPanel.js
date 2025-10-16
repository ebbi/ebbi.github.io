// app/ui/renderSettingsPanel.js
import { SETTINGS_FAQ } from '../data/settingsData.js';
import { getStoredLang } from '../utils/storage.js';

/**
 * Render the Settings page – FAQ style.
 *
 * The page displays a single <details> element (closed by default). The
 * <summary> contains the localized question; expanding the element reveals
 * the intro paragraph, an ordered list of steps, and a closing paragraph.
 *
 * @param {HTMLElement} container – the element that will receive the settings UI
 *                                  (normally the page’s <main> element).
 */
export function renderSettingsPanel(container) {
    // -----------------------------------------------------------------
    // 1️⃣  Clear any previous content.
    // -----------------------------------------------------------------
    container.innerHTML = '';

    // -----------------------------------------------------------------
    // 2️⃣  Determine the UI language (fallback to English).
    // -----------------------------------------------------------------
    const lang = getStoredLang();
    const faq = SETTINGS_FAQ[lang] || SETTINGS_FAQ['en']; // always defined

    // -----------------------------------------------------------------
    // 3️⃣  Inject a tiny style block (no external CSS import needed).
    // -----------------------------------------------------------------
    const style = document.createElement('style');
    style.textContent = `
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
        .settings-faq ol {
            margin-left: 1.5rem;
        }
    `;
    container.appendChild(style);

    // -----------------------------------------------------------------
    // 4️⃣  Build the <details> element.
    // -----------------------------------------------------------------
    const details = document.createElement('details');
    details.open = false;                // closed by default
    details.className = 'settings-faq';

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