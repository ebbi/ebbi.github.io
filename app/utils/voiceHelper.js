// app/utils/voiceHelper.js
// ---------------------------------------------------------------
// Helper that makes sure a voice for a given language exists,
// saves it to local‑storage, and optionally speaks a confirmation.
// ---------------------------------------------------------------
import {
    getLocale
} from "../data/locales.js";
/**
 * Find a SpeechSynthesisVoice that matches the given language code.
 *
 * @param {string} lang   – ISO‑639‑1 language code (e.g. "en", "th").
 * @returns {SpeechSynthesisVoice|null}
 */
export function findVoiceForLang(lang) {
    if (!('speechSynthesis' in window)) return null;
    const voices = speechSynthesis.getVoices();
    // Match the first two letters of the voice's lang property.
    return voices.find(v => v.lang.slice(0, 2).toLowerCase() === lang.toLowerCase()) || null;
}

/**
 * Ensure the voice for the exercise language exists.
 *
 * If the voice is missing, show a modal with instructions and
 * redirect the user to the Help page.
 *
 * If the voice exists, store it (local‑storage) and optionally
 * speak a short confirmation.
 *
 * @param {string} exerciseLang   – language code from exercises.json
 * @param {string} uiLang         – current UI language (for the modal text)
 * @param {boolean} speakConfirm  – whether to speak “Voice set …”
 */
export async function ensureVoiceForExercise(exerciseLang, uiLang, speakConfirm = true) {
    const voice = findVoiceForLang(exerciseLang);
    if (!voice) {
        // ----------- 1️⃣  Voice NOT found – show modal -------------

        // Build a minimal modal (you can replace this with your own UI)
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
        title.textContent = getLocale(uiLang).missingVoiceTitle || 'Voice not installed';
        box.appendChild(title);

        const msg = document.createElement('p');
        msg.textContent = getLocale(uiLang).missingVoiceMessage ||
            `The voice for language “${exerciseLang}” is not available on this device. ` +
            `Please follow the steps in Help → “Setup Speech” to install it.`;
        box.appendChild(msg);

        const btn = document.createElement('button');
        btn.textContent = getLocale(uiLang).goToHelp || 'Go to Help';
        btn.style.marginTop = '.5rem';
        btn.onclick = () => {
            document.body.removeChild(overlay);
            // Redirect to the Help page (preserve UI language)
            window.router.navigate(`/${uiLang}/help`, true);
        };
        box.appendChild(btn);

        overlay.appendChild(box);
        document.body.appendChild(overlay);
        return; // stop further processing – the user must install the voice first
    }

    // ----------- 2️⃣  Voice exists – store & optionally announce ----------
    // Save the voice name so the rest of the app can reuse it.
    try {
        localStorage.setItem('local_storage_tts_voice', voice.name);
    } catch (_) { /* ignore storage errors */ }

    if (speakConfirm) {
        const announcement = getLocale(uiLang).voiceSetMessage ||
            `Voice set for the exercise: ${voice.name}`;
        // Use the same speak helper you already have.
        const utter = new SpeechSynthesisUtterance(announcement);
        utter.voice = voice;
        speechSynthesis.speak(utter);
    }
}