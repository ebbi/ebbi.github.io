// app/utils/voiceHelper.js
import { getLocale } from "../data/locales.js";

/* ---------------------------------------------------------------
   CONSTANTS – Thai is the ultimate fallback for both language
   and voice selection.
   --------------------------------------------------------------- */
const THAI_FALLBACK_LANG = "th";

/**
 * Find a SpeechSynthesisVoice that matches the given language code.
 *
 * @param {string} lang – ISO‑639‑1 code (e.g. "en", "th").
 * @returns {SpeechSynthesisVoice|null}
 */
export function findVoiceForLang(lang) {
    if (!("speechSynthesis" in window)) return null;

    // Some browsers (especially mobile Safari) populate the voice list
    // asynchronously.  We therefore wait for the `voiceschanged` event
    // if the list is still empty.
    const voices = speechSynthesis.getVoices();
    if (voices.length === 0) return null; // caller will retry later

    // Normalise the language code (lower‑case, trim)
    const lc = (lang || "").toLowerCase().trim();

    // Return the first voice whose language starts with the requested code.
    return (
        voices.find(v => v.lang.slice(0, 2).toLowerCase() === lc) ||
        null
    );
}

/**
 * Show a modal that explains the missing‑voice situation and redirects
 * the user to the Help page.  The text is taken from the current UI
 * locale (so you can translate it in each *.json file).
 *
 * @param {string} missingLang – language code that could not be found.
 * @param {string} uiLang      – current UI language (for localisation).
 */
export function showMissingVoiceModal(missingLang, uiLang) {
    const locale = getLocale(uiLang);

    // -----------------------------------------------------------------
    // 1️⃣  Build the modal (lightweight – replace strings with i18n keys)
    // -----------------------------------------------------------------
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999
    });

    const box = document.createElement("div");
    Object.assign(box.style, {
        background: "var(--bg-surface, #fff)",
        border: "1px solid var(--border-surface, #ddd)",
        borderRadius: ".5rem",
//        padding: "1rem",
        maxWidth: "28rem",
        textAlign: "center"
    });

    const title = document.createElement("h3");
    title.textContent =
        locale.missingVoiceTitle ||
        `Voice for “${missingLang}” not installed`;
    box.appendChild(title);

    const msg = document.createElement("p");
    // Allow the locale to contain a placeholder {lang}
    const rawMsg = locale.missingVoiceBody ||
        `Your device does not have a speech‑synthesis voice for the language “${missingLang}”. Please follow the steps in Help → “Setup Speech”.`;
    msg.textContent = rawMsg.replace("{lang}", missingLang);
    box.appendChild(msg);

    const btn = document.createElement("button");
    btn.textContent = locale.goToHelp || "Go to Help";
    btn.onclick = () => {
        document.body.removeChild(overlay);
        // Navigate to the generic Help page (preserve UI language)
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
export async function ensureVoiceForExercise(
    exerciseLang,
    uiLang,
    speakConfirm = true
) {
    // -----------------------------------------------------------------
    // 0️⃣  Normalise the language – guarantee we always have a value.
    // -----------------------------------------------------------------
    const lang = (exerciseLang || "").trim()
        ? exerciseLang.trim().toLowerCase()
        : THAI_FALLBACK_LANG; // fallback to Thai if missing

    // -----------------------------------------------------------------
    // 1️⃣  Try to find a matching voice immediately.
    // -----------------------------------------------------------------
    let voice = findVoiceForLang(lang);

    // -----------------------------------------------------------------
    // 2️⃣  On some browsers (esp. mobile) the voice list is filled
    //     *after* the page loads.  Listen for the `voiceschanged` event
    //     and retry once.
    // -----------------------------------------------------------------
    if (!voice) {
        await new Promise(resolve => {
            const handler = () => {
                voice = findVoiceForLang(lang);
                speechSynthesis.removeEventListener("voiceschanged", handler);
                resolve();
            };
            speechSynthesis.addEventListener("voiceschanged", handler);
            // Fallback timeout – if the event never fires, we still continue.
            setTimeout(resolve, 1500);
        });
    }

    // -----------------------------------------------------------------
    // 3️⃣  If still no voice → try a *Thai* voice as a final fallback.
    // -----------------------------------------------------------------
    if (!voice) {
        voice = findVoiceForLang(THAI_FALLBACK_LANG);
    }

    // -----------------------------------------------------------------
    // 4️⃣  If we still have no voice → show modal & abort.
    // -----------------------------------------------------------------
    if (!voice) {
        showMissingVoiceModal(lang, uiLang);
        return;
    }

    // -----------------------------------------------------------------
    // 5️⃣  Store the voice name (used by the rest of the app)
    // -----------------------------------------------------------------
    try {
        localStorage.setItem("local_storage_tts_voice", voice.name);
    } catch (_) {
        // ignore storage errors (private mode, etc.)
    }

    // -----------------------------------------------------------------
    // 6️⃣  Optionally speak a short confirmation (low volume).
    // -----------------------------------------------------------------
    if (speakConfirm) {
        const msg = `${voice.lang} – ${voice.name}`;
        const utter = new SpeechSynthesisUtterance(msg);
        utter.voice = voice;
        // Quiet but audible – 0.15 is ~15 % of max volume.
        utter.volume = 0.15;
        // Force the language of the utterance to match the voice.
        utter.lang = voice.lang;
        speechSynthesis.speak(utter);
    }
}