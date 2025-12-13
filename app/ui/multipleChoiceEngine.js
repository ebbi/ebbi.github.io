// app/ui/multipleChoiceEngine.js
// ---------------------------------------------------------------
// Multiple‑Choice engine – pure‑logic, no DOM.
// ---------------------------------------------------------------

/**
 * Helper – shuffle an array in‑place (Fisher‑Yates).
 */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Random integer in [min, max] (inclusive).
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Build a **question object** from a raw data row.
 *
 * @param {Object} row               – the raw JSON row (e.g. from test_intermediate_sentences.json)
 * @param {string[]} orderedLangs    – list of language codes, source language first
 * @param {Object} displayMap        – {lang:true/false} – which languages are visible
 * @returns {Object}                – { prompt, options, correctIndex, sourceLang }
 */
function buildQuestion(row, orderedLangs, displayMap) {
    const sourceLang = orderedLangs[0];
    const prompt = (row[sourceLang] && row[sourceLang][0]) || '';

    // Build the pool of *displayed* languages (excluding the source)
    const pool = orderedLangs
        .filter(l => l !== sourceLang && displayMap[l])
        .map(l => ({
            lang: l,
            text: (row[l] && row[l][0]) || '',
            isCorrect: false
        }));

    // Choose a random correct answer from the pool
    const correctIdx = randomInt(0, pool.length - 1);
    pool[correctIdx].isCorrect = true;

    // Shuffle the options so the correct answer isn’t always in the same spot
    shuffle(pool);

    // Return a plain‑object – the UI layer will turn this into DOM.
    return {
        prompt,
        options: pool.map(o => o.text),
        correctIndex: pool.findIndex(o => o.isCorrect),
        sourceLang
    };
}

/**
 * MCQuizEngine – orchestrates a series of multiple‑choice questions.
 *
 * @param {Array<Object>} data          – array of raw rows (already parsed JSON)
 * @param {string} srcLang              – source language code (e.g. "th")
 * @param {string} tgtLang              – UI language (used for UI strings)
 * @param {Object} opts                 – optional config:
 *        {maxQuestions:number, maxWrongAnswers:number}
 */
export class MCQuizEngine {
    constructor(data, srcLang, tgtLang, opts = {}) {
        this._rawData = data;
        this._srcLang = srcLang;
        this._tgtLang = tgtLang;
        this._maxQuestions = opts.maxQuestions ?? 10;
        this._maxWrongAnswers = opts.maxWrongAnswers ?? Infinity;

        // State that survives across rounds
        this._questions = [];          // shuffled list of question objects
        this._current = 0;             // index of the next question to ask
        this._score = { correct: 0, total: 0 };
        this._wrongAnswers = [];       // keep the raw rows for the “practice later” view
        this._finished = false;
    }

    /* -----------------------------------------------------------------
       Public API
       ----------------------------------------------------------------- */

    /** Reset the engine – clears score, wrong‑answer list, etc. */
    reset() {
        this._questions = [];
        this._current = 0;
        this._score = { correct: 0, total: 0 };
        this._wrongAnswers = [];
        this._finished = false;
    }

    /** Get the current score object `{correct,total}`. */
    getScore() {
        return { ...this._score };
    }

    /** Return `true` if the quiz has finished (no more questions). */
    isFinished() {
        return this._finished;
    }

    /** Return a shallow copy of the rows the user got wrong. */
    getWrongAnswers() {
        return [...this._wrongAnswers];
    }

    /** Build the next question (or throw if the quiz is finished). */
    nextQuestion() {
        if (this._finished) {
            throw new Error('Quiz already finished');
        }

        // -----------------------------------------------------------------
        // 1️⃣  Build the pool of *displayed* languages for this round.
        // -----------------------------------------------------------------
        const displayMap = {};
        // By default we show **all** languages except the source.
        // The UI can later mutate this map and call `rebuildTokenGrid()`.
        this._rawData[0] && Object.keys(this._rawData[0]).forEach(k => {
            if (k !== 'id' && k !== 'section' && k !== 'tokens') {
                displayMap[k] = true;
            }
        });

        // -----------------------------------------------------------------
        // 2️⃣  Build the ordered language list – source first, then the rest.
        // -----------------------------------------------------------------
        const rawLangKeys = Object.keys(this._rawData[0] || {});
        const orderedLangs = [
            this._srcLang,
            ...rawLangKeys.filter(l => l !== this._srcLang && l !== 'id' && l !== 'section' && l !== 'tokens')
        ];

        // -----------------------------------------------------------------
        // 3️⃣  If we have no pre‑shuffled queue, create one now.
        // -----------------------------------------------------------------
        if (!this._questions.length) {
            // Build a **shuffled** list of raw rows (skip the first row – it's the header)
            const rows = this._rawData.slice(1);
            shuffle(rows);
            this._questions = rows.map(row => buildQuestion(row, orderedLangs, displayMap));
        }

        // -----------------------------------------------------------------
        // 4️⃣  Pull the next question from the queue.
        // -----------------------------------------------------------------
        const q = this._questions[this._current++];
        if (!q) {
            this._finished = true;
            throw new Error('No more questions');
        }

        // Update the running totals (the UI can read them after the user answers)
        this._score.total++;

        return q;   // {prompt, options, correctIndex, sourceLang}
    }

    /** Record whether the user’s answer was correct. */
    recordAnswer(isCorrect) {
        if (isCorrect) this._score.correct++;
    }

    /** Add a wrong answer to the “practice later” list. */
    addWrongAnswer(row) {
        this._wrongAnswers.push(row);
    }

    /** Update the Speak‑map (called by the UI when check‑boxes change). */
    updateSpeakMap(speakMap) {
        // The engine itself does not need the map for its logic,
        // but we keep the method so the UI can call it uniformly.
        this._speakMap = { ...speakMap };
    }
}