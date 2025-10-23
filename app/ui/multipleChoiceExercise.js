// ---------------------------------------------------------------
// Multiple‑Choice (“Test Yourself”) page
// ---------------------------------------------------------------
// Features:
//
// • Dropdown – question language (source)
// • Dropdown – answer language (single, all four options come from this language)
// • Random question from the exercise JSON
// • Four answer buttons (one correct, three distractors) – all from the selected answer language
// • Click‑to‑speak for prompt and answers
// • Immediate evaluation (no 2‑second delay) with green/red highlighting
// • Score display (Correct / Total)
// • Next button (loads a new random question)
// • Back button (returns to the normal dictionary view)
// ---------------------------------------------------------------

import { loadJSON } from '../utils/fetch.js';
import { renderHeader } from './renderHeader.js';
import { getLocale } from '../data/locales.js';
import { getStoredLang, setStoredLang } from '../utils/storage.js';
import { MCQuizEngine } from "./multipleChoiceEngine.js";
import { speakText } from '../utils/speech.js';
import { getStoredVoice } from '../utils/storage.js';
import { applyDirection } from '../utils/rtl.js';
import { ensureVoiceForExercise } from '../utils/voiceHelper.js';

/**
 * Initialise the Multiple‑Choice page.
 *
 * @param {string} uiLang   – UI language (e.g. "en").
 * @param {string} exId     – exercise id (e.g. "01").
 */
export async function initMultipleChoicePage(uiLang, exId) {
    // -------------------------------------------------------------
    // 1️⃣  Normalise language (persist it, set direction)
    // -------------------------------------------------------------
    if (!uiLang) uiLang = getStoredLang();
    applyDirection(uiLang);

    // -------------------------------------------------------------
    // 2️⃣  Load exercise metadata (from the global EXERCISES array)
    // -------------------------------------------------------------
    const { EXERCISES } = await import('../data/exercises.js');
    const meta = EXERCISES.find(e => e.id === exId);
    if (!meta) {
        document.body.textContent = `⚠️ Exercise ${exId} not found.`;
        return;
    }

    // -------------------------------------------------------------
    // NEW – Ensure the voice for the exercise language exists
    // -------------------------------------------------------------
    const exerciseLang = meta.language || uiLang;   // language field from exercises.json
    await ensureVoiceForExercise(exerciseLang, uiLang, true); // speak confirmation

    // -------------------------------------------------------------
    // 3️⃣  Load the raw JSON rows for this exercise
    // -------------------------------------------------------------
    const jsonPath = `/app/${meta.folder}/${meta.file}`;
    const rows = await loadJSON(jsonPath);   // array of objects

    // -------------------------------------------------------------
    // 4️⃣  Determine all language codes present in the first row
    // -------------------------------------------------------------
    const firstRow = rows[0] || {};
    const allLangCodes = Object.keys(firstRow).filter(
        k => !['id', 'category', 'tokens'].includes(k)
    );

    // -------------------------------------------------------------
    // 5️⃣  Build the page skeleton (toolbar + static nav + empty <main>)
    // -------------------------------------------------------------
    const main = await renderHeader(uiLang);
    const container = document.getElementById('main');
    container.innerHTML = '';   // clear any previous content

    // -----------------------------------------------------------------
    // 5️⃣ A  Title
    // -----------------------------------------------------------------
    const title = document.createElement('h4');
    title.textContent = (meta.title && meta.title[uiLang]) || meta.title?.en || '';
    title.style.textAlign = 'center';
    title.style.marginBottom = '1rem';
    container.appendChild(title);

    // -----------------------------------------------------------------
    // 5️⃣ B  Controls – language selectors + Start button
    // -----------------------------------------------------------------
    const controlsDiv = document.createElement('div');
    controlsDiv.style.display = 'flex';
    controlsDiv.style.flexDirection = 'column';
    controlsDiv.style.gap = '0.5rem';
    controlsDiv.style.marginBottom = '1rem';
    container.appendChild(controlsDiv);

    // ---- Question language selector (single) ----
    const qLangLabel = document.createElement('label');
    qLangLabel.textContent = getLocale(uiLang).questionLanguage || 'Question language';
    qLangLabel.style.marginRight = '0.5rem';
    const qLangSelect = document.createElement('select');
    allLangCodes.forEach(l => {
        const opt = document.createElement('option');
        opt.value = l;
        opt.textContent = (getLocale(uiLang).languageLabels?.[l] ?? l.toUpperCase());
        qLangSelect.appendChild(opt);
    });
    const qLangWrapper = document.createElement('div');
    qLangWrapper.appendChild(qLangLabel);
    qLangWrapper.appendChild(qLangSelect);
    controlsDiv.appendChild(qLangWrapper);

    // ---- Answer language selector (single) ----
    const aLangLabel = document.createElement('label');
    aLangLabel.textContent = getLocale(uiLang).answerLanguage || 'Answer language';
    aLangLabel.style.marginRight = '0.5rem';
    const aLangSelect = document.createElement('select');   // single‑select
    allLangCodes.forEach(l => {
        const opt = document.createElement('option');
        opt.value = l;
        opt.textContent = (getLocale(uiLang).languageLabels?.[l] ?? l.toUpperCase());
        aLangSelect.appendChild(opt);
    });
    const aLangWrapper = document.createElement('div');
    aLangWrapper.appendChild(aLangLabel);
    aLangWrapper.appendChild(aLangSelect);
    controlsDiv.appendChild(aLangWrapper);

    // ---- Start button ----
    const startBtn = document.createElement('button');
    startBtn.textContent = getLocale(uiLang).startTest || 'Start test';
    startBtn.disabled = true;               // enabled only when both selectors have values
    controlsDiv.appendChild(startBtn);

    // -----------------------------------------------------------------
    // 5️⃣ C  Prompt (question word) – will be filled later
    // -----------------------------------------------------------------
    const promptEl = document.createElement('div');
    promptEl.className = 'mc-prompt';
    promptEl.style.fontSize = '1.4rem';
    promptEl.style.fontWeight = '600';
    promptEl.style.marginBottom = '1rem';
    promptEl.setAttribute('aria-live', 'polite');
    container.appendChild(promptEl);

    // -----------------------------------------------------------------
    // 5️⃣ D  Answer options (four buttons)
    // -----------------------------------------------------------------
    const ul = document.createElement('ul');
    ul.className = 'mc-options';
    ul.setAttribute('role', 'listbox');
    ul.style.listStyle = 'none';
    ul.style.padding = '0';
    ul.style.margin = '0';
    ul.style.display = 'flex';
    ul.style.flexDirection = 'column';
    ul.style.gap = '0.5rem';
    container.appendChild(ul);

    // create four empty <li><button> slots – we’ll fill them later
    for (let i = 0; i < 4; i++) {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'mc-option';
        btn.style.width = '100%';
        btn.style.padding = '0.5rem';
        btn.style.fontSize = '1rem';
        btn.style.cursor = 'pointer';
        li.appendChild(btn);
        ul.appendChild(li);
    }

    // -----------------------------------------------------------------
    // 5️⃣ E  Feedback line
    // -----------------------------------------------------------------
    const feedbackEl = document.createElement('div');
    feedbackEl.className = 'mc-feedback';
    feedbackEl.setAttribute('aria-live', 'assertive');
    feedbackEl.style.marginTop = '0.5rem';
    feedbackEl.style.fontStyle = 'italic';
    container.appendChild(feedbackEl);

    // -----------------------------------------------------------------
    // 5️⃣ F  Score display
    // -----------------------------------------------------------------
    const scoreEl = document.createElement('div');
    scoreEl.className = 'mc-score';
    scoreEl.innerHTML = `Score: <span data-correct>0</span>/<span data-total>0</span>`;
    scoreEl.style.marginTop = '0.5rem';
    container.appendChild(scoreEl);

    // -----------------------------------------------------------------
    // 5️⃣ G  Navigation buttons (Next & Back)
    // -----------------------------------------------------------------
    const navDiv = document.createElement('div');
    navDiv.style.marginTop = '1rem';
    navDiv.style.display = 'flex';
    navDiv.style.justifyContent = 'space-between';
    container.appendChild(navDiv);

    const nextBtn = document.createElement('button');
    nextBtn.textContent = getLocale(uiLang).nextExercise || 'Next';
    nextBtn.disabled = true;               // enabled after an answer
    navDiv.appendChild(nextBtn);

    const backBtn = document.createElement('button');
    backBtn.textContent = getLocale(uiLang)['← Back to exercise'] || '← Back to exercise';
    navDiv.appendChild(backBtn);

    // -------------------------------------------------------------
    // 6️⃣  State & score helpers
    // -------------------------------------------------------------
    const state = { correct: 0, total: 0 };

    function updateScoreDisplay() {
        scoreEl.querySelector('[data-correct]').textContent = state.correct;
        scoreEl.querySelector('[data-total]').textContent = state.total;
    }

    // -------------------------------------------------------------
    // 7️⃣  Enable Start button only when both selectors have values
    // -------------------------------------------------------------
    function validateSelectors() {
        const qLang = qLangSelect.value;
        const aLang = aLangSelect.value;
        startBtn.disabled = !(qLang && aLang);
    }
    qLangSelect.addEventListener('change', validateSelectors);
    aLangSelect.addEventListener('change', validateSelectors);

    // -------------------------------------------------------------
    // 8️⃣  Start the quiz – lock selectors, dim them, and render first question
    // -------------------------------------------------------------
    startBtn.addEventListener('click', () => {
        // Dim the selectors to show they are frozen
        qLangSelect.disabled = true;
        aLangSelect.disabled = true;
        qLangSelect.style.opacity = '0.5';
        aLangSelect.style.opacity = '0.5';
        startBtn.disabled = true;
        renderQuestion();
    });

    // -------------------------------------------------------------
    // 9️⃣  Render a single question (no 2‑second delay)
    // -------------------------------------------------------------
    function renderQuestion() {
        // ---- Reset UI -------------------------------------------------
        ul.querySelectorAll('button').forEach(b => {
            b.disabled = false;
            b.style.background = '';
            b.style.color = '';
        });
        feedbackEl.textContent = '';
        nextBtn.disabled = true;

        // ---- 1️⃣ Pick a random row -----------------------------------
        const row = rows[Math.floor(Math.random() * rows.length)];

        // ---- 2️⃣ Selected languages ----------------------------------
        const qLang = qLangSelect.value;   // language for the prompt
        const aLang = aLangSelect.value;   // answer language (single)

        // ---- 3️⃣ Prompt (spoken) ------------------------------------
        const promptTxt = (row[qLang] && row[qLang][0]) || '';
        promptEl.textContent = promptTxt;
        promptEl.style.cursor = 'pointer';
        promptEl.title = getLocale(uiLang).playPrompt || 'Click to hear the word';
        promptEl.onclick = () => speakText(promptTxt, getStoredVoice());

        // ---- 4️⃣ Build answer options (all from aLang) -------------
        const tokens = row[aLang] || [];

        // a) Choose a random index for the correct answer
        const correctIdx = tokens.length
            ? Math.floor(Math.random() * tokens.length)
            : -1;
        const correctTxt = correctIdx >= 0 ? tokens[correctIdx] : '';

        // b) Gather three distinct distractors from the SAME column
        const usedIdx = new Set();
        if (correctIdx >= 0) usedIdx.add(correctIdx);
        const distractors = [];
        let attempts = 0;
        while (distractors.length < 3 && attempts < 10) {
            attempts++;
            if (tokens.length === 0) break;
            const idx = Math.floor(Math.random() * tokens.length);
            if (usedIdx.has(idx)) continue;
            const txt = tokens[idx];
            if (txt) {
                distractors.push(txt);
                usedIdx.add(idx);
            }
        }
        // If still not enough, repeat the correct token
        while (distractors.length < 3) {
            distractors.push(correctTxt);
        }

        // d) Shuffle the four options
        const options = [correctTxt, ...distractors];
        options.sort(() => Math.random() - 0.5);

        // ---- 5️⃣ Populate the four answer buttons --------------------
        const btns = ul.querySelectorAll('button');
        options.forEach((opt, idx) => {
            const btn = btns[idx];
            btn.textContent = opt;
            btn.dataset.isCorrect = (opt === correctTxt).toString();

            btn.onclick = async () => {
                // Speak the chosen answer first
                await speakText(opt, getStoredVoice());

                // Immediate evaluation (no timeout)
                const isCorrect = btn.dataset.isCorrect === 'true';
                if (isCorrect) {
                    // ✅ correct → green
                    btn.style.background = '#4caf50';
                    btn.style.color = '#fff';
                    feedbackEl.textContent = 'Correct!';
                    state.correct++;
                } else {
                    // ❌ wrong → red
                    btn.style.background = '#ff5252';
                    btn.style.color = '#fff';
                    feedbackEl.textContent = 'Incorrect.';

                    // also highlight the correct button in green
                    const correctBtn = Array.from(btns).find(b => b.dataset.isCorrect === 'true');
                    if (correctBtn) {
                        correctBtn.style.background = '#4caf50';
                        correctBtn.style.color = '#fff';
                    }
                }

                // Update score
                state.total++;
                updateScoreDisplay();

                // Disable all answer buttons
                btns.forEach(b => (b.disabled = true));

                // Enable Next button
                nextBtn.disabled = false;
            };
        });
    }

    // -------------------------------------------------------------
    // 1️⃣1️⃣  Back button – return to the normal dictionary view
    // -------------------------------------------------------------
    backBtn.addEventListener('click', () => {
        window.router.navigate(`/${uiLang}/exercises/${exId}`, true);
    });


    // -------------------------------------------------------------
    // 🔟  Next button – load a new random question
    // -------------------------------------------------------------
    nextBtn.addEventListener('click', () => {
        renderQuestion();
    });


}