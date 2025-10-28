// ---------------------------------------------------------------
// app/utils/speech.js
// ---------------------------------------------------------------

/**
 * Populate a <select> with voices that match any of the languages
 * you support (e.g. ["th", "en", "es", …]).
 *
 * The function is deliberately tolerant – if no matching voices are
 * found it leaves the <select> empty (the caller can decide what to do).
 */
export function populateVoiceList(selectEl, SUPPORTED_LANGS) {
    if (!('speechSynthesis' in window)) {
        console.warn('speechSynthesis API not available.');
        return;
    }

    function fill() {
        const allVoices = speechSynthesis.getVoices();

        const matching = allVoices.filter(v => {
            const langPrefix = v.lang.slice(0, 2).toLowerCase();
            return SUPPORTED_LANGS.includes(langPrefix);
        });

        selectEl.innerHTML = '';

        matching.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v.name;                     // we store the *name*
            opt.textContent = `${v.name} (${v.lang})`;
            if (v.default) opt.selected = true;
            selectEl.appendChild(opt);
        });

        if (selectEl.options.length && !selectEl.value) {
            selectEl.selectedIndex = 0;
        }
    }

    speechSynthesis.addEventListener('voiceschanged', fill);
    fill();   // initial attempt (may be empty, will be refreshed later)
}

/**
 * Speak a piece of text using the supplied voice name.
 *
 * @param {string} text – the text to speak
 * @param {string} [voiceName] – optional voice name; if omitted the first
 *                               available voice is used.
 * @param {string} [lang] – optional BCP‑47 language tag (e.g. "th", "en").
 * @returns {Promise<void>} resolves when the utterance finishes
 */
export function speakText(text, voiceName, lang) {
    return new Promise((resolve, reject) => {
        if (!('speechSynthesis' in window)) {
            reject(new Error('speechSynthesis not supported'));
            return;
        }

        // ---------------------------------------------------------
        // 1️⃣  **Cancel any utterance that might already be playing**.
        // ---------------------------------------------------------
        speechSynthesis.cancel();

        const utter = new SpeechSynthesisUtterance(text);
        const voices = speechSynthesis.getVoices();

        const voice = voiceName
            ? voices.find(v => v.name === voiceName) || voices[0]
            : voices[0];

        if (voice) {
            utter.voice = voice;
            // Force the language if the caller supplied one.
            utter.lang = lang ? lang : voice.lang;
        }

        utter.onend = () => resolve();
        utter.onerror = e => reject(e);

        speechSynthesis.speak(utter);
    });
}