// === Constants and State ===
const main = document.querySelector("main");
const paragraphDisplay = document.createElement("div");
paragraphDisplay.id = "paragraphDisplay";

let currentBook = null;
let currentChapter = null;
let currentParagraphs = [];
let currentWordIndex = 0;
let isPlaying = false;
let pauseRequested = false;
let playPromise = null;
let delayMs = 800;

const langMap = {
    th: "th-TH",
    en: "en-US",
    fa: "fa-IR"
};

// === Utility Functions ===
function clearHighlights() {
    document.querySelectorAll(".highlight-light, .highlight-dark").forEach(el =>
        el.classList.remove("highlight-light", "highlight-dark")
    );
}

// === Paragraph Rendering ===
function renderParagraph(para, paragraphIndex) {
    const container = document.createElement("div");
    container.className = "paragraph";
    container.dataset.index = paragraphIndex;

    para.forEach((wordObj, wordIndex) => {
        // Check for newline in any language
        if (Object.values(wordObj).some(val => val === "\n")) {
            container.appendChild(document.createElement("br"));
            return;
        }

        const wordDiv = document.createElement("div");
        wordDiv.className = "word-pair";
        wordDiv.dataset.index = wordIndex;

        Object.keys(wordObj).forEach(key => {
            const span = document.createElement("span");
            span.textContent = wordObj[key];
            span.dataset.langKey = key;
            span.setAttribute("lang", langMap[key] || key);
            span.onclick = () => playWord(wordObj[key], key, span, wordIndex);
            wordDiv.appendChild(span);
        });

        container.appendChild(wordDiv);
    });

    return container;
}

// === Speech Functions ===
async function coreSpeakWord(text, langInput, span = null, index = null, { autoAdvance = true } = {}) {
    if (!text || text === "\n") return Promise.resolve();

    const resolvedLang = langMap[langInput] || (typeof langInput === "string" ? langInput : "th-TH");

    if (!span && index !== null && paragraphDisplay) {
        const pairDiv = paragraphDisplay.querySelector(`.word-pair[data-index="${index}"]`);
        const shortKey = (resolvedLang.split ? resolvedLang.split("-")[0] : resolvedLang);
        span = pairDiv ? pairDiv.querySelector(`span[data-langKey="${shortKey}"]`) : null;
    }

    clearHighlights();
    const themeClass = document.body.dataset.theme === "dark" ? "highlight-dark" : "highlight-light";
    if (span) span.classList.add(themeClass);

    return new Promise(resolve => {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = resolvedLang;
        utter.rate = 1;

        utter.onend = () => {
            if (autoAdvance && isPlaying && span) {
                span.classList.remove("highlight-light", "highlight-dark");
            }
            resolve();
        };

        speechSynthesis.speak(utter);
    });
}

/* Wrapper for manual click */
function playWord(text, langInput, span, index) {
    if (!text || text === "\n") return;
    speechSynthesis.cancel();
    return coreSpeakWord(text, langInput, span, index, { autoAdvance: false });
}

/* Wrapper for auto playback */
function speakWord(text, langInput, index, { autoAdvance = true } = {}) {
    if (!text || text === "\n") return Promise.resolve();
    return coreSpeakWord(text, langInput, null, index, { autoAdvance });
}

// === Playback Controls ===
async function speakNextWord() {
    if (!isPlaying || pauseRequested) return;

    const para = currentParagraphs[0];
    if (!para || currentWordIndex >= para.length) {
        isPlaying = false;
        return;
    }

    const w = para[currentWordIndex];

    for (const [key, val] of Object.entries(w)) {
        const checkbox = document.querySelector(`#${key}Checkbox`);
        if (val && val !== "\n" && checkbox && checkbox.checked) {
            await speakWord(val, key, currentWordIndex, { autoAdvance: true });
        }
    }

    currentWordIndex++;
    if (isPlaying && !pauseRequested) {
        setTimeout(() => speakNextWord(), delayMs);
    }
}

function playParagraph() {
    if (isPlaying) return;
    isPlaying = true;
    pauseRequested = false;
    speakNextWord();
}

function pauseParagraph() {
    pauseRequested = true;
    isPlaying = false;
    speechSynthesis.cancel();
}

function resetParagraph() {
    pauseParagraph();
    currentWordIndex = 0;
    clearHighlights();
    playParagraph();
}

// === SPA Init (simplified placeholder) ===
function initSPA() {
    main.innerHTML = "";
    const controls = document.createElement("div");
    controls.id = "paragraphControls";

    const playBtn = document.createElement("button");
    playBtn.textContent = "Play";
    playBtn.onclick = playParagraph;

    const pauseBtn = document.createElement("button");
    pauseBtn.textContent = "Pause";
    pauseBtn.onclick = pauseParagraph;

    const resetBtn = document.createElement("button");
    resetBtn.textContent = "Reset";
    resetBtn.onclick = resetParagraph;

    controls.appendChild(playBtn);
    controls.appendChild(pauseBtn);
    controls.appendChild(resetBtn);

    main.appendChild(controls);
    main.appendChild(paragraphDisplay);
}

initSPA();
