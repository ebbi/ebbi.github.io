// app/utils/speech.js
export function populateVoiceList(selectEl, SUPPORTED_LANGS) {
    if (!('speechSynthesis' in window)) {
        console.warn('speechSynthesis API not available.');
        return;
    }

    function fill() {
        const allVoices = speechSynthesis.getVoices();
        const matching = allVoices.filter(v => SUPPORTED_LANGS.includes(v.lang.slice(0, 2).toLowerCase()));

        selectEl.innerHTML = '';
        matching.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v.name;
            opt.textContent = `${v.name} (${v.lang})`;
            selectEl.appendChild(opt);
        });
        if (selectEl.options.length) selectEl.selectedIndex = 0;
    }

    speechSynthesis.addEventListener('voiceschanged', fill);
    fill();
}

/**
 * Speak a piece of text using the supplied voice name.
 * The function is deliberately **stateless** – it does **not** rely on any
 * external `playerState` object.  Callers (e.g. dictionaryExercise.js) must
 * pass the name of the voice they want to use.
 *
 * @param {string} text – the text to speak
 * @param {string} [voiceName] – optional voice name; if omitted the first
 *                               available voice is used.
 */
export function speakText(text, voiceName) {
    return new Promise((resolve, reject) => {
        if (!('speechSynthesis' in window)) {
            reject(new Error('speechSynthesis not supported'));
            return;
        }
        const utter = new SpeechSynthesisUtterance(text);
        const voices = speechSynthesis.getVoices();

        // `voiceName` may be undefined – in that case we just pick the first voice.
        const voice = voiceName
            ? voices.find(v => v.name === voiceName) || voices[0]
            : voices[0];

        if (voice) utter.voice = voice;
        utter.onend = () => resolve();
        utter.onerror = e => reject(e);
        speechSynthesis.speak(utter);
    });
}