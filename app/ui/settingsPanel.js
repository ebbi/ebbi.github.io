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
    (async () => {
        try {
            const osKey = await getOSInstructionKey(); // e.g. installStepsWindows
            const locale = getLocale(getStoredLang()).content;
            const stepsRaw = locale[osKey] || locale.installSteps || '';
            const stepLines = stepsRaw.split(/\r?\n|<br\s*\/?>/i).filter(Boolean);

            const ul = document.createElement('ul');
            ul.className = 'answer';
            ul.style.paddingLeft = '1.2rem';
            ul.style.margin = '0.5rem 0';

            stepLines.forEach(line => {
                const li = document.createElement('li');
                li.textContent = line.trim();
                ul.appendChild(li);
            });

            // Insert the help list directly after the voice selector.
            details.insertBefore(ul, voiceSelect.nextSibling);
        } catch (e) {
            console.warn('Unable to load voice‑setup help:', e);
        }
    })();

    // -----------------------------------------------------------
    // 6️⃣ Font selector – **removed** from the settings panel.
    // -----------------------------------------------------------
    // The font selector already lives in the static navigation bar
    // (rendered by renderHeader / renderMenu).  Keeping it here would
    // duplicate the control and break the required page structure.
}