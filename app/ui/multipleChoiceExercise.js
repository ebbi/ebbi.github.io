// app/ui/multipleChoiceExercise.js
// ---------------------------------------------------------------
// Multiple‑Choice (“Test Yourself”) page – fully styled and
// internationalised.
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
    pageWrapper.style.margin = '1rem';
    pageWrapper.style.padding = '1rem';
    pageWrapper.style.border = '1px solid var(--border-surface, #ddd)';
    pageWrapper.style.borderRadius = '.5rem';
    pageWrapper.style.background = 'var(--bg-surface, #fff)';
    pageWrapper.style.position = 'relative'; // for loading overlay
    main.appendChild(pageWrapper);

    // -------------------------------------------------------------
    // 6️⃣ Loading overlay (shown while JSON is fetched)
    // -------------------------------------------------------------
    const overlay = document.createElement('div');
    overlay.textContent = getLocale(uiLang).loading || 'Loading…';
    overlay.style.cssText = `
        position:absolute; inset:0; display:flex;
        align-items:center; justify-content:center;
        background:rgba(255,255,255,0.8);
        font-size:1.2rem; z-index:10;
    `;
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
        k => !['id', 'category', 'tokens'].includes(k)
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
    title.textContent = (meta.title && meta.title[uiLang]) ||
        meta.title?.en || 'Multiple Choice';
    title.style.textAlign = 'center';
    title.style.marginBottom = '1rem';
    pageWrapper.appendChild(title);

    // ----- Controls (language selectors + Start) ---------------
    const controlsDiv = document.createElement('div');
    controlsDiv.style.display = 'flex';
    controlsDiv.style.flexDirection = 'column';
    controlsDiv.style.gap = '0.5rem';
    controlsDiv.style.marginBottom = '1rem';
    pageWrapper.appendChild(controlsDiv);

    // ---- Question language selector (inline) ------------------
    const qLangLabel = document.createElement('label');
    qLangLabel.textContent = locale.questionLanguage || 'Question language';
    qLangLabel.style.marginRight = '0.5rem';
    qLangLabel.style.display = 'inline-block';
    qLangLabel.style.verticalAlign = 'middle';

    const qLangSelect = document.createElement('select');
    qLangSelect.style.display = 'inline-block';
    qLangSelect.style.verticalAlign = 'middle';
    qLangSelect.style.maxWidth = '10ch';
    qLangSelect.style.width = 'auto';
    allLangCodes.forEach(l => {
        const opt = document.createElement('option');
        opt.value = l;
        opt.textContent = (locale.languageLabels?.[l] ?? l.toUpperCase());
        qLangSelect.appendChild(opt);
    });

    const qLangWrapper = document.createElement('div');
    qLangWrapper.style.display = 'flex';
    qLangWrapper.style.alignItems = 'center';
    qLangWrapper.style.gap = '0.25rem';
    qLangWrapper.appendChild(qLangLabel);
    qLangWrapper.appendChild(qLangSelect);
    controlsDiv.appendChild(qLangWrapper);

    // ---- Answer language selector (inline) -------------------
    const aLangLabel = document.createElement('label');
    aLangLabel.textContent = locale.answerLanguage || 'Answer language';
    aLangLabel.style.marginRight = '0.5rem';
    aLangLabel.style.display = 'inline-block';
    aLangLabel.style.verticalAlign = 'middle';

    const aLangSelect = document.createElement('select');
    aLangSelect.style.display = 'inline-block';
    aLangSelect.style.verticalAlign = 'middle';
    aLangSelect.style.maxWidth = '10ch';
    aLangSelect.style.width = 'auto';
    allLangCodes.forEach(l => {
        const opt = document.createElement('option');
        opt.value = l;
        opt.textContent = (locale.languageLabels?.[l] ?? l.toUpperCase());
        aLangSelect.appendChild(opt);
    });

    const aLangWrapper = document.createElement('div');
    aLangWrapper.style.display = 'flex';
    aLangWrapper.style.alignItems = 'center';
    aLangWrapper.style.gap = '0.25rem';
    aLangWrapper.appendChild(aLangLabel);
    aLangWrapper.appendChild(aLangSelect);
    controlsDiv.appendChild(aLangWrapper);

    // ---- Start button -----------------------------------------
    const startBtn = document.createElement('button');
    startBtn.textContent = locale.startTest || 'Start test';
    startBtn.disabled = true;               // enabled only when both selectors have values
    controlsDiv.appendChild(startBtn);

    // ----- Prompt (centered, with speaker icon) ---------------
    const promptWrapper = document.createElement('div');
    promptWrapper.style.display = 'flex';
    promptWrapper.style.alignItems = 'center';
    promptWrapper.style.justifyContent = 'center';
    promptWrapper.style.marginBottom = '1rem';
    promptWrapper.style.fontSize = '1.4rem';
    promptWrapper.style.fontWeight = '600';
    promptWrapper.style.textAlign = 'center';
    promptWrapper.setAttribute('aria-live', 'polite');

    const promptIcon = document.createElement('span');
    promptIcon.textContent = '🔊';
    promptIcon.style.marginRight = '0.4rem';
    promptIcon.style.cursor = 'pointer';
    promptIcon.title = locale.playPrompt || 'Play prompt';
    promptWrapper.appendChild(promptIcon);

    const promptEl = document.createElement('span');
    promptWrapper.appendChild(promptEl);
    pageWrapper.appendChild(promptWrapper);

    // ----- Answer list -----------------------------------------
    const ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    ul.style.padding = '0';
    ul.style.margin = '0';
    ul.style.display = 'flex';
    ul.style.flexDirection = 'column';
    ul.style.gap = '0.5rem';
    pageWrapper.appendChild(ul);

    // create four empty <li><button> slots – we’ll fill them later
    for (let i = 0; i < 4; i++) {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.style.width = '100%';
        btn.style.padding = '0.5rem';
        btn.style.fontSize = '1rem';
        btn.style.cursor = 'pointer';
        li.appendChild(btn);
        ul.appendChild(li);
    }

    // ----- Feedback (correct / incorrect) ----------------------
    const feedbackEl = document.createElement('div');
    feedbackEl.style.fontStyle = 'italic';
    feedbackEl.style.marginBottom = '0.5rem';
    feedbackEl.setAttribute('aria-live', 'assertive');

    // ----- Score & Reset button (single row) -------------------
    const bottomInfoRow = document.createElement('div');
    bottomInfoRow.style.display = 'flex';
    bottomInfoRow.style.justifyContent = 'space-between';
    bottomInfoRow.style.alignItems = 'center';
    bottomInfoRow.style.marginTop = '1rem';
    bottomInfoRow.style.gap = '1rem';

    const scoreEl = document.createElement('div');
    scoreEl.innerHTML = `<span data-correct>0</span>/<span data-total>0</span>`;

    const resetScoreBtn = document.createElement('button');
    resetScoreBtn.textContent = locale.resetScore || 'Reset score';

    bottomInfoRow.appendChild(feedbackEl);   // left side (feedback)
    bottomInfoRow.appendChild(scoreEl);      // centre (score)
    bottomInfoRow.appendChild(resetScoreBtn); // right side (reset)
    pageWrapper.appendChild(bottomInfoRow);

    // ----- Navigation (Back ←  Next →) -------------------------
    const navDiv = document.createElement('div');
    navDiv.style.display = 'flex';
    navDiv.style.justifyContent = 'space-between';
    navDiv.style.alignItems = 'center';
    navDiv.style.marginTop = '1rem';
    pageWrapper.appendChild(navDiv);

    const backBtn = document.createElement('button');
    backBtn.textContent = locale.backToExercise || '← Back to exercise';
    navDiv.appendChild(backBtn);   // left side

    const nextBtn = document.createElement('button');
    nextBtn.textContent = locale.nextExercise || 'Next';
    nextBtn.disabled = true;       // enabled after an answer
    navDiv.appendChild(nextBtn);   // right side

    // -------------------------------------------------------------
    // 10️⃣ State handling
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
        qLangSelect.style.opacity = '0.5';
        aLangSelect.style.opacity = '0.5';
        startBtn.disabled = true;
        renderQuestion();
    });

    // -------------------------------------------------------------
    // 13️⃣ Render a single question (no delay)
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
        promptEl.style.cursor = 'pointer';
        promptEl.title = getLocale(uiLang).playPrompt || 'Play prompt';
        promptEl.onclick = () => {
            speakText(promptTxt, getStoredVoice()).catch(console.warn);
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

            // ----- speaker icon for each answer --------------------
            const ansIcon = document.createElement('span');
            ansIcon.textContent = '🔊';
            ansIcon.style.marginRight = '0.4rem';
            ansIcon.style.cursor = 'pointer';
            ansIcon.title = locale.playAnswer || 'Play answer';
            ansIcon.onclick = (e) => {
                e.stopPropagation(); // prevent double‑trigger
                speakText(opt, getStoredVoice(), aLang).catch(console.warn);
            };

            const ansText = document.createElement('span');
            ansText.textContent = opt;

            btn.appendChild(ansIcon);
            btn.appendChild(ansText);
            btn.dataset.isCorrect = (opt === correctTxt).toString();

            // ARIA label for screen readers
            btn.setAttribute('aria-label', opt);

            btn.onclick = async () => {
                // Speak the chosen answer (non‑blocking)
                speakText(opt, getStoredVoice(), aLang).catch(console.warn);

                const isCorrect = btn.dataset.isCorrect === 'true';
                if (isCorrect) {
                    btn.style.background = '#4caf50';
                    btn.style.color = '#fff';
                    feedbackEl.textContent = locale.correctFeedback || 'Correct!';
                    state.correct++;
                } else {
                    btn.style.background = '#ff5252';
                    btn.style.color = '#fff';
                    feedbackEl.textContent = locale.incorrectFeedback || 'Incorrect.';

                    // also highlight the correct button in green
                    const correctBtn = Array.from(btns).find(b => b.dataset.isCorrect === 'true');
                    if (correctBtn) {
                        correctBtn.style.background = '#4caf50';
                        correctBtn.style.color = '#fff';
                    }
                }

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
        // If the quiz has already started, render a fresh question
        if (!startBtn.disabled) {
            renderQuestion();
        }
    });
}
