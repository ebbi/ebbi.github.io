// app/ui/detail.js
import { loadJSON } from '../utils/fetch.js';
import { EXERCISES } from '../data/exercises.js';
import { getLocale, SUPPORTED_LANGS, FALLBACK_LANG } from '../data/locales.js';
import { showInstallModal } from './routes.js';          // <-- import the modal helper

/**
 * Render the detail view for a single exercise.
 *
 * @param {HTMLElement} container – the element that will hold the detail UI.
 * @param {string} id            – exercise id.
 * @param {string} UI_LANG       – currently selected UI language (e.g. "th").
 */
export async function renderExerciseDetail(container, id, UI_LANG) {
    const ex = EXERCISES.find(e => e.id === id);
    if (!ex) {
        showNotFound(container);
        return;
    }

    // -----------------------------------------------------------------
    // 0️⃣  Basic skeleton (title + loading placeholder)
    // -----------------------------------------------------------------
    container.classList.remove('hidden');
    container.textContent = '';

    const loadingH2 = document.createElement('h2');
    loadingH2.textContent = ex.title?.[UI_LANG] || ex.title?.en || '…';
    const loadingP = document.createElement('p');
    loadingP.textContent = 'Loading…';
    container.appendChild(loadingH2);
    container.appendChild(loadingP);

    try {
        // -----------------------------------------------------------------
        // 1️⃣  Load the JSON payload for the exercise
        // -----------------------------------------------------------------
        const jsonPath = `/app/${ex.folder}/${ex.file}`;
        const data = await loadJSON(jsonPath);

        const block = data.content[UI_LANG] || data.content[FALLBACK_LANG];

        // -----------------------------------------------------------------
        // 2️⃣  Build the final fragment (title, prompt, …)
        // -----------------------------------------------------------------
        const frag = document.createDocumentFragment();

        const h2 = document.createElement('h2');
        h2.textContent = ex.title?.[UI_LANG] || ex.title?.en || '';
        frag.appendChild(h2);

        const prompt = document.createElement('p');
        prompt.textContent = block.prompt;
        frag.appendChild(prompt);

        // -----------------------------------------------------------------
        // 3️⃣  **VOICE SELECTOR**
        // -----------------------------------------------------------------
        // Internationalised label – expect a key “voices” in the locale files.
        const locale = getLocale(UI_LANG).content;
        const voiceLabel = locale.voices || 'Voices';

        const voiceWrapper = document.createElement('div');
        voiceWrapper.style.margin = '0.75rem 0';
        voiceWrapper.style.display = 'flex';
        voiceWrapper.style.alignItems = 'center';
        voiceWrapper.style.gap = '0.5rem';

        const voiceLabelEl = document.createElement('label');
        voiceLabelEl.textContent = voiceLabel;
        voiceLabelEl.htmlFor = 'voiceSelect';
        voiceWrapper.appendChild(voiceLabelEl);

        const voiceSelect = document.createElement('select');
        voiceSelect.id = 'voiceSelect';
        voiceSelect.style.flex = '1';
        voiceWrapper.appendChild(voiceSelect);

        // Populate the list with voices that match any of the languages used
        // in this exercise (the exercise may contain several language columns).
        const exerciseLangs = Object.keys(block)
            .filter(k => k !== 'prompt' && k !== 'answer' && k !== 'audio');

        // Filter the SpeechSynthesis voices to those whose language matches
        // one of the exercise languages (compare first two letters, lower‑cased).
        const allVoices = ('speechSynthesis' in window) ? speechSynthesis.getVoices() : [];
        const matchingVoices = allVoices.filter(v => {
            const voiceLang = v.lang.slice(0, 2).toLowerCase();
            return exerciseLangs.some(l => l.toLowerCase() === voiceLang);
        });

        if (matchingVoices.length === 0) {
            // No TTS voices are available – we simply omit the voice selector.
            // (Previously a flash message was shown; it has been removed per requirements.)
        } else {
            // Populate the <select>
            voiceSelect.innerHTML = matchingVoices.map(v => {
                const selected = v.default ? 'selected' : '';
                return `<option value="${v.name}" ${selected}>${v.name} (${v.lang})</option>`;
            }).join('');
            // Optional: react to a change (you can hook your own TTS logic here)
            voiceSelect.addEventListener('change', ev => {
                console.log('[Voice] selected for exercise', ev.target.value);
                // Your existing voice‑handling code can be placed here.
            });
            frag.appendChild(voiceWrapper);
        }

        // -----------------------------------------------------------------
        // 4️⃣  Audio (if present)
        // -----------------------------------------------------------------
        if (block.audio) {
            const audio = document.createElement('audio');
            audio.controls = true;
            audio.src = block.audio;
            frag.appendChild(audio);
        }

        // -----------------------------------------------------------------
        // 5️⃣  Answer block
        // -----------------------------------------------------------------
        const answerPre = document.createElement('pre');
        answerPre.className = 'answer';
        answerPre.textContent = block.answer;
        frag.appendChild(answerPre);

        // -----------------------------------------------------------------
        // 6️⃣  Replace loading UI with the final fragment
        // -----------------------------------------------------------------
        container.innerHTML = '';
        container.appendChild(frag);
    } catch (e) {
        // -----------------------------------------------------------------
        // 7️⃣  Error handling – keep the loading UI but show an error message
        // -----------------------------------------------------------------
        container.innerHTML = `<h2>${ex.title?.[UI_LANG] || ex.title?.en}</h2>
                               <p class="error">⚠️ Failed to load exercise.</p>`;
        console.error('renderExerciseDetail error:', e);
    }
}

/* -----------------------------------------------------------------
   Helper – 404 for a missing exercise ID
   ----------------------------------------------------------------- */
function showNotFound(parent) {
    parent.innerHTML = `<h2>🚫 Not found</h2>
                        <p>The requested exercise does not exist.</p>`;
}