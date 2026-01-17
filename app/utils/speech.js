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
export function speakText(text, voiceName, lang, rate = 1, pitch = 1) { // ✨ Added pitch param
    return new Promise((resolve, reject) => {
        if (!("speechSynthesis" in window)) return reject("No TTS support");

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.pitch = pitch; // ✨ Apply pitch here (0 to 2)

        if (lang) utterance.lang = lang;

        if (voiceName) {
            const voices = window.speechSynthesis.getVoices();
            const selectedVoice = voices.find(v => v.name === voiceName);
            if (selectedVoice) utterance.voice = selectedVoice;
        }

        utterance.onend = () => resolve();
        utterance.onerror = (e) => reject(e);

        window.speechSynthesis.speak(utterance);
    });
}

/**
 * Ensures only one speechPanel exists in the DOM.
 * Returns the existing panel or a newly created one.
 */
// Add this at the top or bottom of your speech.js

export function getOrCreateSpeechPanel(parentContainer) {
    let panel = document.getElementById('speechPanel');

    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'speechPanel';
    }

    // If we are on an exercise page, ensure it's at the top of the content
    const target = parentContainer || document.getElementById('main');
    if (target && panel.parentElement !== target) {
        target.prepend(panel);
    }

    return panel;
}