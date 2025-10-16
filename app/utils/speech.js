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