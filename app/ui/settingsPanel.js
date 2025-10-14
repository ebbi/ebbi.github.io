import { populateVoiceList } from '../utils/speech.js';
import { FONT_CATALOG } from '../data/fonts.js';
import { getStoredFont, setStoredFont, getStoredLang } from '../utils/storage.js';   // ← now includes getStoredFont
import { applyFontFamily } from '../utils/fontHelper.js';   // applyCurrentFont is no longer needed
import { SUPPORTED_LANGS } from '../data/locales.js';
import { getOSInstructionKey } from '../utils/osDetection.js';
import { getLocale } from '../data/locales.js';

/**
 * Render the Settings panel (inserted after the toolbar).
 *
 * @param {HTMLElement} afterElement – the toolbar element; the panel is placed
 *                                    right after it in the DOM.
 */
export function renderSettingsPanel(afterElement) {

    // Replacement fragment
    const details = document.createElement('details');
    details.open = true;
    details.style.margin = '0.5rem 1rem';

    // -----------------------------------------------------------
    // 1️⃣ Localised heading – now “Speech Setup” (internationalised)
    // -----------------------------------------------------------
    const summary = document.createElement('summary');

    // Determine the language that is currently stored (fallback handled inside storage)
    const currentLang = getStoredLang();                 // e.g. "en", "th", …
    const localeObj = getLocale(currentLang).content;    // now includes speechSetup

    // Use the new translation key; fall back to the old “Settings” string, then to a literal.
    summary.textContent = localeObj.speechSetup || localeObj.settings || 'Speech Setup';
    details.appendChild(summary);

    // -----------------------------------------------------------
    // 2️⃣ Voice selector (unchanged)
    // -----------------------------------------------------------
    const voiceSelect = document.createElement('select');
    voiceSelect.id = 'voiceSelect';
    voiceSelect.style.marginTop = '0.5rem';
    voiceSelect.style.width = '100%';
    details.appendChild(voiceSelect);

    // -----------------------------------------------------------
    // 3️⃣ Font selector – **removed** from the details panel
    // -----------------------------------------------------------

    // -----------------------------------------------------------
    // Insert the whole panel after the toolbar (or wherever you passed it)
    // -----------------------------------------------------------
    afterElement.parentNode.insertBefore(details, afterElement.nextSibling);

    // -----------------------------------------------------------
    // 4️⃣ Font selector – now placed **above** the details panel
    // -----------------------------------------------------------
    const fontSelect = document.createElement('select');
    fontSelect.id = 'fontSelect';
    fontSelect.style.marginTop = '0.5rem';
    fontSelect.style.width = '100%';
    afterElement.parentNode.insertBefore(fontSelect, details);

    // Insert the whole panel after the toolbar (or wherever you passed it)
    afterElement.parentNode.insertBefore(details, afterElement.nextSibling);

    // Replacement code
    populateVoiceList(voiceSelect, SUPPORTED_LANGS);
    voiceSelect.onchange = ev => {
        const chosen = ev.target.value;
        console.log('[Voice] selected', chosen);
        // (your existing voice‑handling code can stay here)
    };

    // -----------------------------------------------------------------
    // Show detailed voice‑setup instructions for the current OS/device
    // -----------------------------------------------------------------
    (async () => {
        try {
            const osKey = await getOSInstructionKey();               // e.g. installStepsWindows
            const locale = getLocale(getStoredLang()).content;
            const stepsRaw = locale[osKey] || locale.installSteps || '';

            // Split the raw string on line‑break markers (both "\n" and "<br>")
            const stepLines = stepsRaw.split(/\r?\n|<br\s*\/?>/i).filter(Boolean);

            // Build a <ul> with each step as an <li>
            const ul = document.createElement('ul');
            ul.className = 'answer';          // keep the same styling hook
            ul.style.paddingLeft = '1.2rem';  // a little indent for mobile friendliness
            ul.style.margin = '0.5rem 0';

            stepLines.forEach(line => {
                const li = document.createElement('li');
                li.textContent = line.trim();
                ul.appendChild(li);
            });

            // Insert the help list **directly after** the voice selector
            voiceSelect.parentNode.insertBefore(ul, voiceSelect.nextSibling);
        } catch (e) {
            console.warn('Unable to load voice‑setup help:', e);
        }
    })();

    const savedFont = getStoredFont();   // keep the previously saved choice
    fontSelect.innerHTML = FONT_CATALOG.map(f => {
        const sel = f.name === savedFont ? 'selected' : '';
        return `<option value="${f.name}" ${sel}>${f.name}</option>`;
    }).join('');

    // Keep the existing onchange listener (already present later in the file)

    fontSelect.onchange = ev => {
        const chosenName = ev.target.value;
        const fontObj = FONT_CATALOG.find(f => f.name === chosenName);
        if (!fontObj) return;

        // Persist and apply the new font
        setStoredFont(fontObj.name);
        applyFontFamily(fontObj.family);
        console.info(`[Font] Applied ${fontObj.name}`);

        // Optional: notify other parts of the app that the font changed
        document.dispatchEvent(new CustomEvent('fontChanged'));
    };
}
