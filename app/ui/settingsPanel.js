// app/ui/settingsPanel.js
import { populateVoiceList } from '../utils/speech.js';
import { FONT_CATALOG } from '../data/fonts.js';
import { getStoredFont, setStoredFont, getStoredLang } from '../utils/storage.js';
import { applyFontFamily } from '../utils/fontHelper.js';
import { SUPPORTED_LANGS } from '../data/locales.js';
import { getOSInstructionKey } from '../utils/osDetection.js';
import { getLocale } from '../data/locales.js';

/**
 * Render the Settings panel.
 *
 * **Important:** This function now injects the panel **into the element
 * passed as `container`** (normally the `<main>` element).  It no longer
 * creates a duplicate font‑selector or places any UI outside of `<main>`.
 *
 * @param {HTMLElement} container – the element that will receive the settings UI
 *                                  (typically the page’s `<main>`).
 */
export function renderSettingsPanel(container) {
    // -----------------------------------------------------------
    // 1️⃣ Create the <details> wrapper (collapsed by default)
    // -----------------------------------------------------------
    const details = document.createElement('details');
    details.open = true;
    details.style.margin = '0.5rem 1rem';
    container.appendChild(details);

    // -----------------------------------------------------------
    // 2️⃣ Localised heading – “Speech Setup” (or fallback)
    // -----------------------------------------------------------
    const summary = document.createElement('summary');
    const currentLang = getStoredLang();
    const localeObj = getLocale(currentLang).content;
    summary.textContent = localeObj.speechSetup || localeObj.settings || 'Speech Setup';
    details.appendChild(summary);

    // -----------------------------------------------------------
    // 3️⃣ Voice selector (unchanged)
    // -----------------------------------------------------------
    const voiceSelect = document.createElement('select');
    voiceSelect.id = 'voiceSelect';
    voiceSelect.style.marginTop = '0.5rem';
    voiceSelect.style.width = '100%';
    details.appendChild(voiceSelect);

    // -----------------------------------------------------------
    // 4️⃣ Populate the voice list
    // -----------------------------------------------------------
    populateVoiceList(voiceSelect, SUPPORTED_LANGS);
    voiceSelect.onchange = ev => {
        const chosen = ev.target.value;
        console.log('[Voice] selected', chosen);
        // Existing voice‑handling logic can stay here.
    };

    // -----------------------------------------------------------
    // 5️⃣ OS‑specific installation instructions (as a <ul>)
    // -----------------------------------------------------------
    /* -------------------------------------------------------------
       5️⃣  OS‑specific installation instructions (as a <ul>)
       ------------------------------------------------------------- */
    (async () => {
        try {
            // -----------------------------------------------------------------
            // Determine which OS‑specific key we need (e.g. installStepsWindows)
            // -----------------------------------------------------------------
            const osKey = await getOSInstructionKey(); // returns a string like "installStepsWindows"
            const locale = getLocale(getStoredLang()).content;

            // -----------------------------------------------------------------
            // Grab the raw step text from the locale file.
            // If the OS‑specific key is missing we fall back to the generic list.
            // -----------------------------------------------------------------
            const stepsRaw = locale[osKey] || locale.installSteps || '';

            // -----------------------------------------------------------------
            // Split the raw text into individual lines, ignoring empty ones.
            // The locale strings may contain line‑breaks or <br/> tags.
            // -----------------------------------------------------------------
            const stepLines = stepsRaw
                .split(/\r?\n|<br\s*\/?>/i)   // split on newline or <br/>
                .map(l => l.trim())
                .filter(l => l.length);

            // -----------------------------------------------------------------
            // Build a friendly intro sentence that tells the user what to do.
            // This sentence is also internationalised.
            // -----------------------------------------------------------------
            const intro = locale.setupSpeechIntro ||
                locale.installVoiceSetupIntro ||
                'Follow these steps to install the speech‑synthesis voice for your system:';

            // -----------------------------------------------------------------
            // Create the <ul> that will hold the step list.
            // -----------------------------------------------------------------
            const ul = document.createElement('ul');
            ul.className = 'answer';
            ul.style.paddingLeft = '1.2rem';
            ul.style.margin = '0.5rem 0';

            // Add the introductory sentence as the first <li> (styled bold)
            const introLi = document.createElement('li');
            introLi.textContent = intro;
            introLi.style.fontWeight = 'bold';
            ul.appendChild(introLi);

            // Append each step as its own <li>
            stepLines.forEach(line => {
                const li = document.createElement('li');
                li.textContent = line;
                ul.appendChild(li);
            });

            // Insert the help list directly after the voice selector.
            details.insertBefore(ul, voiceSelect.nextSibling);
        } catch (e) {
            console.warn('Unable to load voice‑setup help:', e);
        }
    })();
}