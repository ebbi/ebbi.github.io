// app/utils/voiceHelper.js
import { getLocale } from "../data/locales.js";

// ---------------------------------------------------------------
// Centralised helper that guarantees the TTS voice matches the
// exercise language. It also shows a modal + redirects to Help
// when the required voice is missing.
// ---------------------------------------------------------------

/**
 * Find a SpeechSynthesisVoice that matches the given language code.
 *
 * @param {string} lang   – ISO‑639‑1 code (e.g. "en", "th").
 * @returns {SpeechSynthesisVoice|null}
 */
export function findVoiceForLang(lang) {
    if (!('speechSynthesis' in window)) return null;

    // Some browsers (especially mobile Safari) populate the voice list
    // asynchronously.  We therefore wait for the `voiceschanged` event
    // if the list is still empty.
    const voices = speechSynthesis.getVoices();
    if (voices.length === 0) return null; // caller will retry later

    // Return the first voice whose language starts with the requested code.
    return (
        voices.find(v => v.lang.slice(0, 2).toLowerCase() === lang.toLowerCase()) ||
        null
    );
}

/**
 * Show a simple modal that explains the missing‑voice situation and
 * redirects the user to the Help page.
 *
 * @param {string} missingLang   – language code that could not be found.
 * @param {string} uiLang        – current UI language (for localisation).
 */
export function showMissingVoiceModal(missingLang, uiLang) {
    // -----------------------------------------------------------------
    // 1️⃣  Build the modal (very lightweight – you can replace it later)
    // -----------------------------------------------------------------
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.right = 0;
    overlay.style.bottom = 0;
    overlay.style.background = 'rgba(0,0,0,0.6)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = 9999;

    const box = document.createElement('div');
    box.style.background = 'var(--bg-surface, #fff)';
    box.style.border = '1px solid var(--border-surface, #ddd)';
    box.style.borderRadius = '.5rem';
    box.style.padding = '1rem';
    box.style.maxWidth = '28rem';
    box.style.textAlign = 'center';

    const title = document.createElement('h3');
    title.textContent = `Voice for “${missingLang}” not installed`;
    box.appendChild(title);

    const msg = document.createElement('p');
    msg.textContent =
        'Your device does not have a speech synthesis voice for the language of this exercise. ' +
        'Please follow the steps in Help → “Setup Speech” to install the required voice.';
    box.appendChild(msg);

    const btn = document.createElement('button');
    btn.textContent = 'Go to Help';
    btn.style.marginTop = '.5rem';
    btn.onclick = () => {
        document.body.removeChild(overlay);
        // Redirect to the Help page (preserve UI language)
        window.router.navigate(`/${uiLang}/help`, true);
    };
    box.appendChild(btn);

    overlay.appendChild(box);
    document.body.appendChild(overlay);
}

/**
 * Main entry – make sure the correct voice is selected.
 *
 * @param {string} exerciseLang   – language code from exercises.json (e.g. "th").
 * @param {string} uiLang         – current UI language (for localisation).
 * @param {boolean} speakConfirm  – if true, speak a short confirmation after setting.
 */
export async function ensureVoiceForExercise(exerciseLang, uiLang, speakConfirm = true) {
    // -------------------------------------------------------------
    // 1️⃣  Try to find a matching voice immediately.
    // -------------------------------------------------------------
    let voice = findVoiceForLang(exerciseLang);

    // -------------------------------------------------------------
    // 2️⃣  On some browsers (esp. mobile) the voice list is filled
    //     *after* the page loads.  Listen for the `voiceschanged` event
    //     and retry once.
    // -------------------------------------------------------------
    if (!voice) {
        await new Promise(resolve => {
            const handler = () => {
                voice = findVoiceForLang(exerciseLang);
                speechSynthesis.removeEventListener('voiceschanged', handler);
                resolve();
            };
            speechSynthesis.addEventListener('voiceschanged', handler);
            // Fallback timeout – if the event never fires, we still continue.
            setTimeout(resolve, 1500);
        });
    }

    // -------------------------------------------------------------
    // 3️⃣  If we still have no voice → show modal & abort.
    // -------------------------------------------------------------
    if (!voice) {
        showMissingVoiceModal(exerciseLang, uiLang);
        return;
    }

    // -------------------------------------------------------------
    // 4️⃣  Store the voice name (used by the rest of the app)
    // -------------------------------------------------------------
    try {
        localStorage.setItem('local_storage_tts_voice', voice.name);
    } catch (_) {
        // ignore storage errors (private mode, etc.)
    }

    // -------------------------------------------------------------
    // 5️⃣  Optionally speak a short confirmation.  `${voice.name} (${voice.lang})`
    // -------------------------------------------------------------
    if (speakConfirm) {
        // const locale = getLocale(uiLang);
        // const msg = locale.voiceSetMessage || `${voice.lang} ${voice.name}`;
        const msg = voice.lang + voice.name;
        const utter = new SpeechSynthesisUtterance(msg);
        //        utter.voice = voice;
        utter.volume = 0;
        speechSynthesis.speak(utter);
    }
}