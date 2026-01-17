import { getStoredLang, setStoredLang } from '../utils/storage.js';
import { getLocale } from '../data/locales.js';
import { loadJSON } from '../utils/fetch.js';
import { renderHeader } from './renderHeader.js';
import { speakText } from '../utils/speech.js';
import { getStoredVoice } from '../utils/storage.js';
import { applyDirection } from '../utils/rtl.js';

export async function initMultipleChoicePage(uiLang, exId, customData = null) {
    if (!uiLang) uiLang = getStoredLang();
    applyDirection(uiLang);

    // 1️⃣ Data Loading & Metadata
    let meta;
    if (customData) {
        meta = { id: exId, title: { en: exId.replace(/-/g, ' ').toUpperCase() } };
    } else {
        const { EXERCISES } = await import('../data/exercises.js');
        meta = EXERCISES.find(e => e.id === exId);
        if (!meta) return;
    }

    const main = await renderHeader(uiLang);
    main.innerHTML = '';
    const pageWrapper = document.createElement('div');
    pageWrapper.className = 'mc-wrapper';
    main.appendChild(pageWrapper);

    let rawRows = customData || await loadJSON(`/app/${meta.folder}/${meta.file}`);

    const rows = rawRows.flatMap(row => {
        const arrayKey = Object.keys(row).find(k => Array.isArray(row[k]));
        if (!arrayKey) return [row];
        return row[arrayKey].map((_, i) => {
            const newRow = { ...row };
            Object.keys(row).forEach(key => {
                if (Array.isArray(row[key])) newRow[key] = row[key][i] || "";
            });
            return newRow;
        });
    }).filter(r => r.en && r.en !== '\n');

    // 2️⃣ State Management
    const state = {
        correct: 0,
        currentIndex: 0,
        pool: [...rows].sort(() => Math.random() - 0.5),
        mistakes: []
    };

    const locale = getLocale(uiLang);
    const allLangCodes = Object.keys(rows[0] || {}).filter(k => k.length <= 5 && !['id', 'tokens'].includes(k));

    // Helper to sync with global speech controller state
    const killGhostSpeech = () => {
        if (window.speechState) window.speechState.currentSessionId++;
        window.speechSynthesis.cancel();
    };

    // 3️⃣ UI Construction
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'mc-controls';
    pageWrapper.appendChild(controlsDiv);

    const createLangSelector = (labelStr, defaultCode) => {
        const wrap = document.createElement('div');
        wrap.className = 'mc-select-group';
        wrap.innerHTML = `<label style="display:block; font-size:0.8rem; opacity:0.7;">${labelStr}</label>`;
        const sel = document.createElement('select');
        allLangCodes.forEach(code => {
            const opt = document.createElement('option');
            opt.value = code;
            opt.textContent = locale.languageLabels?.[code] || code.toUpperCase();
            sel.appendChild(opt);
        });
        sel.value = allLangCodes.includes(defaultCode) ? defaultCode : allLangCodes[0];
        wrap.appendChild(sel);
        controlsDiv.appendChild(wrap);
        return sel;
    };

    const qLangSelect = createLangSelector(locale.questionLanguage || 'Question', 'en');
    const aLangSelect = createLangSelector(locale.answerLanguage || 'Answer', 'th');

    const startBtn = document.createElement('button');
    startBtn.className = 'mc-start-btn';
    startBtn.style.width = '100%';
    startBtn.textContent = locale.startTest || 'Start test';
    controlsDiv.appendChild(startBtn);

    const quizArea = document.createElement('div');
    quizArea.style.display = 'none';
    pageWrapper.appendChild(quizArea);

    const progressContainer = document.createElement('div');
    progressContainer.className = 'mc-progress-container';
    const progressBar = document.createElement('div');
    progressBar.className = 'mc-progress-bar';
    progressContainer.appendChild(progressBar);
    quizArea.appendChild(progressContainer);

    const promptWrapper = document.createElement('div');
    promptWrapper.className = 'mc-prompt';
    quizArea.appendChild(promptWrapper);
    const promptEl = document.createElement('span');
    promptWrapper.appendChild(promptEl);

    const ul = document.createElement('ul');
    ul.className = 'mc-answers';
    quizArea.appendChild(ul);
    for (let i = 0; i < 4; i++) {
        const li = document.createElement('li');
        li.appendChild(document.createElement('button'));
        ul.appendChild(li);
    }

    const feedbackEl = document.createElement('div');
    feedbackEl.className = 'mc-feedback';
    quizArea.appendChild(feedbackEl);

    const bottomRow = document.createElement('div');
    bottomRow.className = 'mc-bottom';
    bottomRow.innerHTML = `<div>Score: <span data-correct>0</span>/<span data-total>${state.pool.length}</span></div>`;
    quizArea.appendChild(bottomRow);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'mc-next-btn';
    nextBtn.style.width = '100%';
    nextBtn.textContent = locale.nextExercise || 'Next';
    nextBtn.disabled = true;
    quizArea.appendChild(nextBtn);

    const backBtn = document.createElement('button');
    backBtn.style.marginTop = '1rem';
    backBtn.style.background = 'none';
    backBtn.textContent = locale.backToExercise || '← Back';
    quizArea.appendChild(backBtn);

    // 4️⃣ Quiz Functions
    function showResults() {
        quizArea.style.display = 'none';
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'mc-results-screen';
        resultsDiv.style.padding = '1rem';

        const percent = Math.round((state.correct / state.pool.length) * 100);
        const qLang = qLangSelect.value;
        const aLang = aLangSelect.value;

        let reviewHTML = "";
        if (state.mistakes.length > 0) {
            reviewHTML = `
            <div style="margin-top: 2rem; text-align: left;">
                <h3 style="font-size: 1rem; margin-bottom: 0.5rem; opacity: 0.8;">Words to Practice:</h3>
                <ul style="list-style: none; padding: 0; border: 1px solid var(--border-surface); border-radius: 8px;">
                    ${state.mistakes.map(m => `
                        <li style="padding: 0.75rem; border-bottom: 1px solid var(--border-surface); display: flex; flex-direction: column; gap: 0.5rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span class="review-speak-btn" data-text="${m[qLang]}" data-lang="${qLang}" style="cursor:pointer; font-size: 1.2rem;">🔊</span>
                                    <strong>${m[qLang]}</strong>
                                </div>
                                <div style="display: flex; align-items: center; gap: 0.5rem; text-align: right;">
                                    <span style="color: var(--heading-accent);">${m[aLang]}</span>
                                    <span class="review-speak-btn" data-text="${m[aLang]}" data-lang="${aLang}" style="cursor:pointer; font-size: 1.2rem;">🔊</span>
                                </div>
                            </div>
                        </li>   
                    `).join('')}
                </ul>
            </div>
        `;
        }

        resultsDiv.innerHTML = `
        <div style="text-align: center;">
            <h2>${locale.testExercise || 'Quiz Complete!'}</h2>
            <div style="font-size: 3rem; font-weight: bold; margin: 1rem 0; color: var(--heading-accent);">${percent}%</div>
            <p>${state.correct} / ${state.pool.length} Correct</p>
        </div>
        ${reviewHTML}
        <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem;">
            <button id="retryBtn" class="mc-start-btn">Restart</button>
            <button id="finalBackBtn" style="padding:1rem; background:none; border:1px solid var(--border-surface);">Return to Lesson</button>
        </div>
    `;

        pageWrapper.appendChild(resultsDiv);

        resultsDiv.querySelectorAll('.review-speak-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                killGhostSpeech(); // Don't overlap review audio
                const text = btn.getAttribute('data-text');
                const lang = btn.getAttribute('data-lang');
                btn.style.opacity = '0.5';
                setTimeout(() => btn.style.opacity = '1', 150);
                speakText(text, getStoredVoice(), lang).catch(console.warn);
            };
        });

        document.getElementById('retryBtn').onclick = () => {
            state.correct = 0;
            state.currentIndex = 0;
            state.pool = [...rows].sort(() => Math.random() - 0.5);
            resultsDiv.remove();
            quizArea.style.display = 'block';
            progressBar.style.width = '0%';
            const correctEl = bottomRow.querySelector('[data-correct]');
            if (correctEl) correctEl.textContent = '0';
            renderQuestion();
        };
        document.getElementById('finalBackBtn').onclick = () => backBtn.click();
    }

    function renderQuestion() {
        const progressPercent = (state.currentIndex / state.pool.length) * 100;
        progressBar.style.width = `${progressPercent}%`;

        if (state.currentIndex >= state.pool.length) {
            progressBar.style.width = '100%';
            showResults();
            return;
        }

        const row = state.pool[state.currentIndex];
        const qLang = qLangSelect.value;
        const aLang = aLangSelect.value;
        const correctTxt = String(row[aLang] || "").trim();

        ul.querySelectorAll('button').forEach(b => {
            b.classList.remove('correct', 'incorrect');
            b.disabled = false;
        });
        feedbackEl.textContent = '';
        nextBtn.disabled = true;

        promptEl.textContent = row[qLang];
        promptWrapper.onclick = () => {
            killGhostSpeech(); // Stop any other audio before speaking prompt
            promptWrapper.style.opacity = '0.5';
            setTimeout(() => promptWrapper.style.opacity = '1', 100);
            speakText(row[qLang], getStoredVoice(), qLang);
        };

        const distractors = rows
            .filter(r => r[aLang] !== correctTxt)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(r => r[aLang]);

        const options = [correctTxt, ...distractors].sort(() => Math.random() - 0.5);

        ul.querySelectorAll('button').forEach((btn, idx) => {
            btn.textContent = options[idx];
            btn.onclick = () => {
                killGhostSpeech(); // Kill prompt speech when an answer is chosen
                speakText(options[idx], getStoredVoice(), aLang);

                if (nextBtn.disabled === false && options[idx] === correctTxt) return;

                if (options[idx] === correctTxt) {
                    btn.classList.add('correct');
                    state.correct++;
                    ul.querySelectorAll('button').forEach(b => b.disabled = true);
                } else {
                    btn.classList.add('incorrect');
                    btn.disabled = true;
                    const currentRow = state.pool[state.currentIndex];
                    if (!state.mistakes.includes(currentRow)) {
                        state.mistakes.push(currentRow);
                    }
                }
                bottomRow.querySelector('[data-correct]').textContent = state.correct;
                nextBtn.disabled = false;
            };
        });
    }

    // 5️⃣ Event Handlers
    startBtn.onclick = () => {
        killGhostSpeech(); // Ensure dictionary audio is dead before starting test
        controlsDiv.style.display = 'none';
        quizArea.style.display = 'block';
        renderQuestion();
    };

    nextBtn.onclick = () => {
        killGhostSpeech(); // Stop speech when moving to next question
        state.currentIndex++;
        renderQuestion();
    };

    backBtn.onclick = () => {
        killGhostSpeech(); // Stop audio when exiting
        sessionStorage.removeItem('custom_quiz_data');
        const targetId = (meta && meta.id) ? meta.id : exId;
        const targetPath = `/${uiLang}/exercises/${targetId}`;
        if (window.router) {
            window.router.navigate(targetPath);
        } else {
            window.location.hash = `#${targetPath}`;
        }
    };
}