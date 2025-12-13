// ---------------------------------------------------------------
// app/ui/multipleChoiceExercise.js
// ---------------------------------------------------------------
// Multiple‑Choice (“Test Yourself”) page – fully styled,
// internationalised and with a streamlined click‑to‑listen experience.
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
    // 1️⃣ Normalise language (persist it, set direction)
    // -------------------------------------------------------------
    if (!uiLang) uiLang = getStoredLang();
    applyDirection(uiLang);

    // -------------------------------------------------------------
    // 2️⃣ Load exercise metadata (from the global EXERCISES array)
    // -------------------------------------------------------------
    const { EXERCISES } = await import('../data/exercises.js');
    const meta = EXERCISES.find(e => e.id === exId);
    if (!meta) {
        document.body.textContent = `⚠️ Exercise ${exId} not found.`;
        return;
    }

    // -------------------------------------------------------------
    // 3️⃣ Ensure the voice for the exercise language exists
    // -------------------------------------------------------------
    const exerciseLang = meta.language || uiLang;   // fallback to UI language
    try {
        await ensureVoiceForExercise(exerciseLang, uiLang, true);
    } catch (e) {
        console.warn('[MC] Voice setup failed:', e);
        // Continue – the quiz will still work, just without TTS.
    }

    // -------------------------------------------------------------
    // 4️⃣ Render the shared header (toolbar + nav) and obtain <main>
    // -------------------------------------------------------------
    const main = await renderHeader(uiLang);
    main.innerHTML = '';                     // clear any previous UI

    // -------------------------------------------------------------
    // 5️⃣ Page wrapper – margin, border, background (mirrors home page)
    // -------------------------------------------------------------
    const pageWrapper = document.createElement('div');
    pageWrapper.className = 'mc-wrapper';
    main.appendChild(pageWrapper);

    // -------------------------------------------------------------
    // 6️⃣ Loading overlay (shown while JSON is fetched)
    // -------------------------------------------------------------
    const overlay = document.createElement('div');
    overlay.textContent = getLocale(uiLang).loading || 'Loading…';
    overlay.className = 'mc-overlay';
    pageWrapper.appendChild(overlay);

    // -------------------------------------------------------------
    // 7️⃣ Load the raw JSON rows for this exercise
    // -------------------------------------------------------------
    let rows;
    try {
        const jsonPath = `/app/${meta.folder}/${meta.file}`;
        rows = await loadJSON(jsonPath);   // array of objects
    } catch (e) {
        pageWrapper.innerHTML = `<p class="error">⚠️ Failed to load exercise data.</p>`;
        console.error('loadJSON error:', e);
        return;
    } finally {
        pageWrapper.removeChild(overlay);
    }

    // -------------------------------------------------------------
    // 8️⃣ Determine all language codes present in the first row
    // -------------------------------------------------------------
    const firstRow = rows[0] || {};
    const allLangCodes = Object.keys(firstRow).filter(
        k => !['id', 'section', 'tokens'].includes(k)
    );

    if (!allLangCodes.length) {
        pageWrapper.innerHTML = `<p class="error">${getLocale(uiLang).noLanguages ||
            'No language columns found.'
            }</p>`;
        return;
    }

    const locale = getLocale(uiLang);

    // -------------------------------------------------------------
    // 9️⃣ Build the UI (title, selectors, prompt, answer list, etc.)
    // -------------------------------------------------------------

    // ----- Title -------------------------------------------------
    const title = document.createElement('h4');
    title.textContent = (meta.title?.[uiLang]) ||
        meta.title?.en || 'Multiple Choice';
    pageWrapper.appendChild(title);

    // ----- Controls (language selectors + Start) ---------------
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'mc-controls';
    pageWrapper.appendChild(controlsDiv);

    // ---- Question language selector (inline) ------------------
    const qLangLabel = document.createElement('label');
    qLangLabel.textContent = locale.questionLanguage || 'Question language';
    const qLangSelect = document.createElement('select');
    allLangCodes.forEach(l => {
        const opt = document.createElement('option');
        opt.value = l;
        opt.textContent = (locale.languageLabels?.[l] ?? l.toUpperCase());
        qLangSelect.appendChild(opt);
    });
    qLangSelect.value = uiLang;
    const qLangWrapper = document.createElement('div');
    qLangWrapper.appendChild(qLangLabel);
    qLangWrapper.appendChild(qLangSelect);
    controlsDiv.appendChild(qLangWrapper);

    // ---- Answer language selector (inline) -------------------
    const aLangLabel = document.createElement('label');
    aLangLabel.textContent = locale.answerLanguage || 'Answer language';
    const aLangSelect = document.createElement('select');
    allLangCodes.forEach(l => {
        const opt = document.createElement('option');
        opt.value = l;
        opt.textContent = (locale.languageLabels?.[l] ?? l.toUpperCase());
        aLangSelect.appendChild(opt);
    });
    aLangSelect.value = exerciseLang;
    const aLangWrapper = document.createElement('div');
    aLangWrapper.appendChild(aLangLabel);
    aLangWrapper.appendChild(aLangSelect);
    controlsDiv.appendChild(aLangWrapper);

    // ---- Start button -----------------------------------------
    const startBtn = document.createElement('button');
    startBtn.textContent = locale.startTest || 'Start test';
    startBtn.disabled = true;               // enabled only when both selectors have values
    controlsDiv.appendChild(startBtn);

    // Validate selectors immediately (in case defaults are already set)
    validateSelectors();

    // ----- Prompt (centered, click‑to‑listen) -----------------
    const promptWrapper = document.createElement('div');
    promptWrapper.className = 'mc-prompt';
    promptWrapper.setAttribute('aria-live', 'polite');
    promptWrapper.style.cursor = 'pointer';
    promptWrapper.title = locale.playPrompt || 'Play prompt';
    pageWrapper.appendChild(promptWrapper);

    const promptEl = document.createElement('span');
    promptWrapper.appendChild(promptEl);

    // ----- Answer list -----------------------------------------
    const ul = document.createElement('ul');
    ul.className = 'mc-answers';
    pageWrapper.appendChild(ul);

    // create four empty <li><button> slots – we’ll fill them later
    for (let i = 0; i < 4; i++) {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        li.appendChild(btn);
        ul.appendChild(li);
    }

    // ----- Feedback (correct / incorrect) ----------------------
    const feedbackEl = document.createElement('div');
    feedbackEl.className = 'mc-feedback';
    feedbackEl.setAttribute('aria-live', 'assertive');
    pageWrapper.appendChild(feedbackEl);

    // ----- Score & Reset button (single row) -------------------
    const bottomInfoRow = document.createElement('div');
    bottomInfoRow.className = 'mc-bottom';
    pageWrapper.appendChild(bottomInfoRow);

    const scoreEl = document.createElement('div');
    // show “Correct / Total”
    scoreEl.innerHTML = `<span data-correct>0</span>/<span data-total>0</span>`;
    bottomInfoRow.appendChild(scoreEl);

    const resetScoreBtn = document.createElement('button');
    resetScoreBtn.textContent = locale.resetScore || 'Reset score';
    bottomInfoRow.appendChild(resetScoreBtn);

    // ----- Navigation (Back ←  Next →) -------------------------
    const navDiv = document.createElement('div');
    navDiv.className = 'mc-nav';
    pageWrapper.appendChild(navDiv);

    const backBtn = document.createElement('button');
    backBtn.textContent = locale.backToExercise || '← Back to exercise';
    navDiv.appendChild(backBtn);   // left side

    const nextBtn = document.createElement('button');
    nextBtn.textContent = locale.nextExercise || 'Next';
    nextBtn.disabled = true;       // enabled after an answer
    navDiv.appendChild(nextBtn);   // right side

    // -------------------------------------------------------------
    // 10️⃣ State handling (correct / total counters)
    // -------------------------------------------------------------
    const state = { correct: 0, total: 0 };

    function updateScoreDisplay() {
        scoreEl.querySelector('[data-correct]').textContent = state.correct;
        scoreEl.querySelector('[data-total]').textContent = state.total;
    }

    // -------------------------------------------------------------
    // 11️⃣ Enable Start button only when both selectors have values
    // -------------------------------------------------------------
    function validateSelectors() {
        startBtn.disabled = !(qLangSelect.value && aLangSelect.value);
    }
    qLangSelect.addEventListener('change', validateSelectors);
    aLangSelect.addEventListener('change', validateSelectors);

    // -------------------------------------------------------------
    // 12️⃣ Start the quiz
    // -------------------------------------------------------------
    startBtn.addEventListener('click', () => {
        qLangSelect.disabled = true;
        aLangSelect.disabled = true;
        startBtn.disabled = true;
        renderQuestion();
    });

    // -------------------------------------------------------------
    // 13️⃣ Render a single question (no delay)
    // -------------------------------------------------------------
    function renderQuestion() {
        // ---- Reset UI -------------------------------------------------
        ul.querySelectorAll('button').forEach(b => {
            b.classList.remove('correct', 'incorrect'); // clear previous colours
            // buttons stay enabled – we do NOT disable them here
        });
        feedbackEl.textContent = '';
        nextBtn.disabled = true;

        // ---- 1️⃣ Pick a random row -----------------------------------
        const row = rows[Math.floor(Math.random() * rows.length)];

        // ---- 2️⃣ Selected languages ----------------------------------
        const qLang = qLangSelect.value;   // language for the prompt
        const aLang = aLangSelect.value;   // answer language (single)

        // -------------------------------------------------------------
        // 3️⃣ Prompt – pick a random index that is used for BOTH
        //    the question language and the answer language.
        // -------------------------------------------------------------
        const srcTokens = row[qLang] || [];
        if (!srcTokens.length) {
            // No source tokens – show a placeholder and disable answers.
            promptEl.textContent = locale.emptyPrompt || '(no prompt)';
            ul.querySelectorAll('button').forEach(b => (b.disabled = true));
            return;
        }
        const randIdx = Math.floor(Math.random() * srcTokens.length);
        const promptTxt = srcTokens[randIdx] || '';
        promptEl.textContent = promptTxt;

        // Click on the prompt itself → speak it
        promptWrapper.onclick = () => {
            speakText(promptTxt, getStoredVoice(), qLang).catch(console.warn);
        };

        // -----------------------------------------------------------------
        // 4️⃣ Build answer options – all from the *answer* language column
        // -----------------------------------------------------------------
        let answerTokens = row[aLang] || [];
        // If the answer column is empty, fall back to the source column.
        if (!answerTokens.length) answerTokens = srcTokens;

        // a) Correct answer – the token that sits at the SAME index
        const correctTxt = answerTokens[randIdx] || '';

        // b) Three distinct distractors from the SAME column (but NOT the correct index)
        const usedIdx = new Set([randIdx]);   // we already used the correct one
        const distractors = [];
        let attempts = 0;
        while (distractors.length < 3 && attempts < 10) {
            attempts++;
            const idx = Math.floor(Math.random() * answerTokens.length);
            if (usedIdx.has(idx)) continue;
            const txt = answerTokens[idx];
            if (txt) {
                distractors.push(txt);
                usedIdx.add(idx);
            }
        }
        // If we still don’t have enough distractors (tiny column), repeat the correct answer.
        while (distractors.length < 3) distractors.push(correctTxt);

        // c) Shuffle the four options and render the buttons (unchanged)
        const options = [correctTxt, ...distractors];
        options.sort(() => Math.random() - 0.5);

        // ---- 5️⃣ Populate the four answer buttons --------------------
        const btns = ul.querySelectorAll('button');

        options.forEach((opt, idx) => {
            const btn = btns[idx];
            btn.innerHTML = ''; // clear any previous content

            const ansText = document.createElement('span');
            ansText.textContent = opt;
            btn.appendChild(ansText);

            // Store correctness as a string ("true"/"false")
            btn.dataset.isCorrect = (opt === correctTxt).toString();

            // ARIA label for screen readers
            btn.setAttribute('aria-label', opt);

            // Click on the button → speak first, then evaluate correctness
            btn.onclick = async () => {
                // 1️⃣ Speak the answer (always)
                speakText(opt, getStoredVoice(), aLang).catch(console.warn);

                // 2️⃣ Evaluate correctness (every click, not just the first)
                const isCorrect = btn.dataset.isCorrect === 'true';
                if (isCorrect) {
                    feedbackEl.textContent = locale.correctFeedback || 'Correct!';
                    btn.classList.add('correct');
                    state.correct++;
                } else {
                    feedbackEl.textContent = locale.incorrectFeedback || 'Incorrect.';
                    btn.classList.add('incorrect');
                }
                state.total++;
                updateScoreDisplay();

                // Enable the “Next” button now that an answer has been given
                nextBtn.disabled = false;
            };
        });
    }

    // -------------------------------------------------------------
    // 🔟  Next button – load a new random question
    // -------------------------------------------------------------
    nextBtn.addEventListener('click', () => {
        renderQuestion();
    });

    // -------------------------------------------------------------
    // 1️⃣1️⃣  Back button – return to the normal dictionary view
    // -------------------------------------------------------------
    backBtn.addEventListener('click', () => {
        window.router.navigate(`/${uiLang}/exercises/${exId}`, true);
    });

    // -------------------------------------------------------------
    // 1️⃣2️⃣  Reset Score button – clears counters and starts over
    // -------------------------------------------------------------
    resetScoreBtn.addEventListener('click', () => {
        state.correct = 0;
        state.total = 0;
        updateScoreDisplay();
        feedbackEl.textContent = '';
        // Remove any lingering colour classes from the answer buttons
        ul.querySelectorAll('button').forEach(b => b.classList.remove('correct', 'incorrect'));
        // If a quiz is already in progress, start a brand‑new question
        if (!startBtn.disabled) {
            renderQuestion();
        }
    });
}

// The module exports only the init function; the router imports it.