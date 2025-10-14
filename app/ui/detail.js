// app/ui/detail.js
import { loadJSON } from '../utils/fetch.js';
import { EXERCISES } from '../data/exercises.js';
import { getLocale } from '../data/locales.js';
import { FALLBACK_LANG } from '../data/locales.js';

export async function renderExerciseDetail(container, id, UI_LANG) {
    const ex = EXERCISES.find(e => e.id === id);
    if (!ex) {
        showNotFound(container);
        return;
    }

    // Show a temporary loading state
    container.classList.remove('hidden');
    container.textContent = '';
    const loadingH2 = document.createElement('h2');
    loadingH2.textContent = ex.title?.[UI_LANG] || ex.title?.en || '…';
    const loadingP = document.createElement('p');
    loadingP.textContent = 'Loading…';
    container.appendChild(loadingH2);
    container.appendChild(loadingP);

    try {
        const data = await loadJSON(`/app/${ex.folder}/${ex.file}`);
        const block = data.content[UI_LANG] || data.content[FALLBACK_LANG];

        // Build the final fragment
        const frag = document.createDocumentFragment();

        const h2 = document.createElement('h2');
        h2.textContent = ex.title?.[UI_LANG] || ex.title?.en || '';
        frag.appendChild(h2);

        const prompt = document.createElement('p');
        prompt.textContent = block.prompt;
        frag.appendChild(prompt);

        if (block.audio) {
            const audio = document.createElement('audio');
            audio.controls = true;
            audio.src = block.audio;
            frag.appendChild(audio);
        }

        const answerPre = document.createElement('pre');
        answerPre.className = 'answer';
        answerPre.textContent = block.answer;
        frag.appendChild(answerPre);

        container.innerHTML = '';
        container.appendChild(frag);
    } catch (e) {
        container.innerHTML = `<h2>${ex.title?.[UI_LANG] || ex.title?.en}</h2>
                               <p class="error">⚠️ Failed to load exercise.</p>`;
    }
}

/* -----------------------------------------------------------------
   Helper – 404 for a missing exercise ID
   ----------------------------------------------------------------- */
function showNotFound(parent) {
    parent.innerHTML = `<h2>🚫 Not found</h2>
                        <p>The requested exercise does not exist.</p>`;
}