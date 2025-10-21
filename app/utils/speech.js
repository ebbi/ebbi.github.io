// app/utils/speech.js
/**
 * Populate the <select> with voices that match any of the languages
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

    // -------------------------------------------------------------
    // 1️⃣  Insert a tiny spinner next to the <select> while we wait
    // -------------------------------------------------------------
    const spinner = document.createElement('div');
    spinner.className = 'voice-spinner';
    spinner.setAttribute('aria-live', 'polite');
    spinner.textContent = 'Loading voices…';
    // Insert the spinner *after* the select element
    selectEl.parentNode.insertBefore(spinner, selectEl.nextSibling);

    // -------------------------------------------------------------
    // 2️⃣  Function that actually fills the <select>
    // -------------------------------------------------------------
    function fill() {
        const allVoices = speechSynthesis.getVoices();

        // Keep only voices whose language (first two letters) is in the
        // app's supported language list.
        const matching = allVoices.filter(v => {
            const langPrefix = v.lang.slice(0, 2).toLowerCase();
            return SUPPORTED_LANGS.includes(langPrefix);
        });

        // Clear any previous options.
        selectEl.innerHTML = '';

        matching.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v.name;                     // we store the *name*
            opt.textContent = `${v.name} (${v.lang})`;
            // Mark the default voice (if any) as selected – the UI will
            // later override this with the persisted choice.
            if (v.default) opt.selected = true;
            selectEl.appendChild(opt);
        });

        // If there is at least one voice, make sure the first one is
        // selected so the UI never ends up with an empty <select>.
        if (selectEl.options.length && !selectEl.value) {
            selectEl.selectedIndex = 0;
        }

        // ---------------------------------------------------------
        // 3️⃣  Hide/remove the spinner – we have the data now.
        // ---------------------------------------------------------
        if (spinner && spinner.parentNode) {
            spinner.parentNode.removeChild(spinner);
        }
    }

    // -------------------------------------------------------------
    // 4️⃣  Listen for the asynchronous “voiceschanged” event.
    // -------------------------------------------------------------
    speechSynthesis.addEventListener('voiceschanged', fill);
    fill();   // initial attempt (may be empty, will be refreshed later)
}

/**
 * Speak a piece of text using the supplied voice name.
 *
 * @param {string} text – the text to speak
 * @param {string} [voiceName] – optional voice name; if omitted the first
 *                               available voice is used.
 * @returns {Promise<void>} resolves when the utterance finishes
 */
export function speakText(text, voiceName) {
    return new Promise((resolve, reject) => {
        if (!('speechSynthesis' in window)) {
            reject(new Error('speechSynthesis not supported'));
            return;
        }

        // Cancel any speech that might still be queued – this prevents
        // overlapping utterances when the user clicks fast or hits Reset.
        speechSynthesis.cancel();

        const utter = new SpeechSynthesisUtterance(text);
        const voices = speechSynthesis.getVoices();

        // -----------------------------------------------------------------
        // 1️⃣ Pick the voice (by name) – fall back to the first voice.
        // -----------------------------------------------------------------
        const voice = voiceName
            ? voices.find(v => v.name === voiceName) || voices[0]
            : voices[0];

        if (voice) {
            utter.voice = voice;
            // -----------------------------------------------------------------
            // 2️⃣ Force the language of the utterance to match the voice.
            // -----------------------------------------------------------------
            // Some browsers (especially Chrome) will silently switch to an
            // English voice if `utter.lang` does not match the voice’s
            // language.  Setting it explicitly locks the engine to the
            // chosen voice for the whole token.
            utter.lang = voice.lang;
        }

        // -----------------------------------------------------------------
        // 3️⃣ Event handling – resolve/reject the promise.
        // -----------------------------------------------------------------
        utter.onend = () => resolve();
        utter.onerror = e => reject(e);

        // -----------------------------------------------------------------
        // 4️⃣ Finally speak.
        // -----------------------------------------------------------------
        speechSynthesis.speak(utter);
    });
}

/**
 * Find the first SpeechSynthesis voice whose language starts with the given
 * ISO‑639 two‑letter code (e.g. "en", "th", "ja").
 *
 * @param {string} lang - two‑letter language code (lower‑case)
 * @returns {string|null} - the voice name, or null if none matches
 */
export function findVoiceForLang(lang) {
    if (!('speechSynthesis' in window)) return null;
    const voices = speechSynthesis.getVoices();
    const match = voices.find(v => v.lang.slice(0, 2).toLowerCase() === lang);
    return match ? match.name : null;
}