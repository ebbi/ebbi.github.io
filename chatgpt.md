=====================================================
Empty template for chatgpt upload

```html
```

```css
```

```js
```
copy empty template

======================================================


```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai&family=Chakra+Petch&display=swap"
        rel="stylesheet" />
    <title>ฝึกฝน Thai</title>

</head>

<body data-theme="light">

    <header>
        <span lang="th">ฝึกฝน</span>
        <span id="settingsInline">
            <button id="themeToggle" title="Toggle Day/Night">🌞</button>
            <label>Thai Font:
                <select id="thaiFont">
                    <option value="">Default</option>
                    <option value="Tahoma">Tahoma</option>
                    <option value="Noto Sans Thai">Noto Sans Thai</option>
                    <option value="Chakra Petch">Chakra Petch</option>
                </select>
            </label>
            <button id="settingsBtn" title="Settings & Help">⚙️</button>
        </span>
    </header>

    <main></main>
</body>
</html>
```


```css

    <style>
        /* Base page styling */
        body {
            font-size: clamp(14px, 2.5vw, 18px);
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            transition: background 0.3s, color 0.3s;
        }

        body[data-theme="dark"] {
            background: #222;
            color: #eee;
        }

        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #00247D;
            color: white;
            padding: 0.5em 1em;
        }

        main {
            padding: 1em;
        }

        section {
            margin-bottom: 1.5em;
            padding-bottom: 1em;
            border-bottom: 1px solid #ccc;
        }

        /* Help block styling */
        details {
            padding: 0.5em 1em;
            border: 1px solid #ccc;
            border-radius: 4px;
            margin: 0.5em 0;
            font-size: 0.9em;
            font-weight: normal;
            text-align: left;
            background: #f9f9f9;
            color: #000;
        }

        details summary {
            cursor: pointer;
            /* font-weight: bold; */
            color: #00247D;
            /* main theme blue */
        }

        body[data-theme="dark"] details {
            background: #2a2a2a;
            border: 1px solid #555;
            color: #eee;
        }

        body[data-theme="dark"] details summary {
            color: #66aaff;
            /* lighter theme accent */
        }

        /* Style nested content in details */
        details p {
            margin: 0.5em 0;
            line-height: 1.5;
            text-align: left;
        }

        details ol {
            margin: 0.5em 1.5em;
            padding-left: 1.2em;
        }

        details ol li {
            margin: 0.4em 0;
        }

        /* === Base Styles for Inputs, Selects, Buttons === */
        .controls button,
        #bookSelectionControls select,
        #settingsInline select,
        .controls input[type="number"],
        #themeToggle {
            font-size: 1em;
            line-height: 1.5;
            padding: 0 0.5em;
            height: 2em;
            border-radius: 4px;
            border: 1px solid #ccc;
            background: #f0f0f0;
            color: #000;
            cursor: pointer;
            box-sizing: border-box;
            vertical-align: middle;
            transition: background 0.2s, color 0.2s, border-color 0.2s;
        }

        /* Number input text alignment */
        .controls input[type="number"] {
            text-align: center;
        }

        /* Checkbox styling */
        .controls label input[type="checkbox"],
        #quizControls label input[type="checkbox"] {
            width: 1em;
            height: 1em;
            margin: 0 0.2em 0 0;
            accent-color: #00247D;
            vertical-align: middle;
            cursor: pointer;
        }

        /* Hover states */
        .controls button:hover,
        .controls input[type="number"]:hover,
        .controls select:hover,
        #themeToggle:hover,
        #quizControls button:hover {
            background: #e0e0e0;
        }

        /* Dark theme adjustments */
        body[data-theme="dark"] .controls button,
        body[data-theme="dark"] .controls input[type="number"],
        body[data-theme="dark"] .controls select,
        body[data-theme="dark"] #themeToggle,
        body[data-theme="dark"] #quizControls button {
            background: #333;
            border: 1px solid #555;
            color: #eee;
        }

        body[data-theme="dark"] .controls button:hover,
        body[data-theme="dark"] .controls input[type="number"]:hover,
        body[data-theme="dark"] .controls select:hover,
        body[data-theme="dark"] #themeToggle:hover,
        body[data-theme="dark"] #quizControls button:hover {
            background: #444;
        }

        body[data-theme="dark"] .controls label input[type="checkbox"],
        body[data-theme="dark"] #quizControls label input[type="checkbox"] {
            accent-color: #66aaff;
        }

        /* Theme Toggle Button */
        #themeToggle {
            background: none;
            border: none;
            width: auto;
            min-width: 0;
            padding: 0 0.5em;
            font-size: 1em;
            line-height: 1.5;
        }

        /* Controls container alignment */
        .controls,
        #bookSelectionControls,
        #settingsInline {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 0.5em;
        }

        /* Label alignment */
        .controls label,
        #settingsInline label {
            display: flex;
            align-items: center;
            gap: 0.3em;
            font-size: 0.9em;
        }

        /* Thai Font Styling */
        .thai-font.tahoma {
            font-family: Tahoma, sans-serif;
        }

        .thai-font.noto {
            font-family: 'Noto Sans Thai', sans-serif;
        }

        .thai-font.chakra {
            font-family: 'Chakra Petch', sans-serif;
        }

        /* Highlighting */
        span.thai-font.highlight-light,
        span:not(.thai-font).highlight-light {
            background: yellow;
            color: black;
        }

        span.thai-font.highlight-dark,
        span:not(.thai-font).highlight-dark {
            background: orange;
            color: black;
        }

        #paragraphDisplay {
            font-size: 1.2em;
            margin: 1em 0;
            white-space: pre-wrap;
            width: 100%;
            box-sizing: border-box;
        }

        #paragraphDisplay span {
            margin: 0 0.2em;
        }

        .word-pair {
            display: inline-block;
            vertical-align: top;
            margin: 0 0.2em 0.3em 0.2em;
        }

        .word-pair span[lang="th-TH"] {
            display: block;
            word-break: keep-all;
            overflow-wrap: break-word;
        }

        .word-pair span[lang="en-US"] {
            display: block;
            word-break: normal;
            overflow-wrap: normal;
            white-space: normal;
            margin-top: 0.1em;
        }

        /* Quiz styling */
        #quiz {
            margin-top: 1em;
        }

        .quiz-heading {
            font-weight: 600;
            margin-bottom: 0.5em;
        }

        .quiz-question {
            margin: 1em 0;
        }

        .quiz-options {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5em;
        }

        .quiz-option {
            border: 1px solid #ccc;
            padding: 0.3em 0.6em;
            cursor: pointer;
            border-radius: 5px;
            user-select: none;
        }

        .quiz-option.correct {
            background: var(--correct, #4caf50);
            color: white;
        }

        .quiz-option.incorrect {
            background: var(--incorrect, #f44336);
            color: white;
        }

        #quizControls {
            display: flex;
            flex-direction: column;
            gap: 0.8em;
            margin-top: 1em;
        }

        #quizControls .quiz-row {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 0.6em;
        }

        #quizControls .quiz-row-top {
            justify-content: flex-start;
        }

        #quizControls .quiz-row-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.4em;
        }

        @media (min-width: 600px) {
            #quizControls .quiz-row-bottom {
                flex-direction: row;
                align-items: center;
            }
        }

        #quizControls .lang-select {
            display: flex;
            flex-wrap: wrap;
            gap: 0.4em 0.8em;
        }

        /* === Unified Button Styling for Paragraph + Quiz Controls + Settings === */
        #paragraphControls button,
        #quizControls button,
        #settingsControls button,
        #closeX {
            font-size: 1rem;
            line-height: 1.5;
            padding: 0 0.5em;
            height: 2.2em;
            min-width: 1em;
            border-radius: 4px;
            border: 1px solid #ccc;
            background: #f0f0f0;
            color: #000;
            cursor: pointer;
            box-sizing: border-box;
            vertical-align: middle;
            transition: background 0.2s, color 0.2s, border-color 0.2s;
        }

        #paragraphControls button:hover,
        #quizControls button:hover,
        #settingsControls button:hover,
        #closeX:hover {
            background: #e0e0e0;
        }

        body[data-theme="dark"] #paragraphControls button,
        body[data-theme="dark"] #quizControls button,
        body[data-theme="dark"] #settingsControls button,
        body[data-theme="dark"] #closeX {
            background: #333;
            border: 1px solid #555;
            color: #eee;
        }

        body[data-theme="dark"] #paragraphControls button:hover,
        body[data-theme="dark"] #quizControls button:hover,
        body[data-theme="dark"] #settingsControls button:hover,
        body[data-theme="dark"] #closeX:hover {
            background: #444;
        }

        /* Paragraph controls responsive layout */
        #paragraphControls {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            /* ✅ left justified */
            gap: 0.5em;
        }

        .paragraph-controls-row {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5em;
            align-items: center;
        }

        /* Responsive adjustments for mobile */
        @media (max-width: 600px) {
            #paragraphControls {
                gap: 0.8em;
            }
        }
    </style>

```

```js

    <script>
        /* --- Utilities --- */
        const saveSetting = (k, v) => localStorage.setItem(k, v);
        const loadSetting = (k, def = '') => localStorage.getItem(k) || def;
        const getSavedInt = (k, def = 0) => parseInt(loadSetting(k, def), 10);

        /* --- State --- */
        let books = [], book = null;
        let currentBook = 0, currentChapter = 0, currentParagraph = 0;
        let isPlaying = false, currentWordIndex = 0, utterance = null;
        let lastHighlightedIndex = null;
        let bookSelect, chapterSelect, paragraphSelect, paragraphDisplay, scoreDisplay;
        let thaiElements = [];

        // Map paragraph keys to TTS codes
        const langMap = {
            th: 'th-TH',
            en: 'en-US',
            fa: 'fa-IR',
            // add more languages here if needed
        };

        /* --- Theme & Font --- */
        const themeToggle = document.getElementById('themeToggle');
        function setTheme(theme) {
            document.body.dataset.theme = theme;
            themeToggle.textContent = theme === 'light' ? '🌞' : '🌙';
            saveSetting('theme', theme);
        }
        themeToggle.addEventListener('click', () => setTheme(document.body.dataset.theme === 'light' ? 'dark' : 'light'));
        setTheme(loadSetting('theme', 'light'));

        const thaiFont = document.getElementById('thaiFont');

        function applyThaiFont() {
            const font = loadSetting('thaiFont', '');
            // Select ALL Thai text, including header, quiz, paragraph
            document.querySelectorAll('[lang="th"], [lang="th-TH"]').forEach(el => {
                el.classList.add('thai-font');
                el.classList.remove('tahoma', 'noto', 'chakra');
                if (font === 'Tahoma') el.classList.add('tahoma');
                if (font === 'Noto Sans Thai') el.classList.add('noto');
                if (font === 'Chakra Petch') el.classList.add('chakra');
            });
        }

        thaiFont.addEventListener('change', () => { saveSetting('thaiFont', thaiFont.value); applyThaiFont(); });
        thaiFont.value = loadSetting('thaiFont', '');
        applyThaiFont();

        /* --- TTS --- */
        function speakTextQueued(text, lang, cb) {
            if (!text) return;
            speechSynthesis.cancel();
            utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.onend = cb;
            speechSynthesis.speak(utterance);
        }

        /* --- Settings View --- */
        const settingsBtn = document.getElementById('settingsBtn');

        function showSettings() {
            const main = document.querySelector('main');
            main.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;
                    background: #00247D; color: white; padding: 0.5em 1em;">
            <h2 style="margin: 0;">Settings & Help</h2>
            <button id="closeX" title="Close Settings">❌</button>
        </div>
        <div style="min-height: 70vh; display: flex; flex-direction: column; justify-content: center;">
            <div id="settingsControls" style="text-align: center; padding: 1em;">
                <button id="checkTTS">Check Sound and Language Setup</button>
                <span id="ttsStatus" style="margin-left: 1em; font-weight: bold;"></span>
                <br><br>
                <button id="closeBtn">Close</button>
            </div>
        </div>
    `;
        }

        function reloadApp() {
            initSPA();
            populateBooks();
        }

        document.addEventListener('click', e => {
            if (e.target.id === 'settingsBtn') {
                showSettings();
            }
            if (e.target.id === 'closeX' || e.target.id === 'closeBtn') {
                reloadApp();
            }
            if (e.target.id === 'checkTTS') {
                const statusEl = document.getElementById('ttsStatus');
                if ('speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined') {
                    statusEl.innerHTML = "<br>Text To Speech is setup.  You should have heard hello in English and Thai ";   // ✅ add <br> before message
                    statusEl.style.color = "green";

                    // 🔊 Speak a short test phrase in EN + TH
                    const testUtterances = [
                        new SpeechSynthesisUtterance("Hello in English"),
                        new SpeechSynthesisUtterance("สวัสดี in Thai")
                    ];
                    testUtterances[0].lang = "en-US";
                    testUtterances[1].lang = "th-TH";

                    // Cancel any previous speech before speaking
                    speechSynthesis.cancel();
                    speechSynthesis.speak(testUtterances[0]);
                    testUtterances[0].onend = () => speechSynthesis.speak(testUtterances[1]);

                } else {
                    statusEl.innerHTML = "<br>Text To Speech(TTS) is not setup, follow the help instructions"; // ❌ add <br> before message
                    statusEl.style.color = "red";

                    // ✅ Append the detailed help block
                    statusEl.innerHTML += `
    <details open>
        <summary>Text To Speech(TTS) Setup instructions for Android, IOS and Browsers</summary>
        <p>
            This app uses Text-To-Speech. You should be able to hear the text by selecting any of the text examples.
        </p>
        <p>
            If you cannot hear any sound, please check the following for your device:
        </p>
        <div id="setupMobileTTS">
            <details>
                <summary>Mobile Android and Chrome browser</summary>
                <p>
                    To enable text-to-speech on Android, you can use the built-in accessibility features.
                </p>
                <div class="text-to-speech-steps">
                    <ol>
                        <li>Go to "Settings" on your Android phone.</li>
                        <li>Scroll down and tap on "Accessibility."</li>
                        <li>Tap on "Select to Speak" or "TalkBack" (depending on your Android version).</li>
                        <li>Turn on the feature and follow the on-screen instructions to set up
                            text-to-speech.</li>
                        <li>Once enabled, you can select text on your screen, and the device will read it
                            aloud.</li>
                        <li>To adjust the text-to-speech settings, go back to "Settings," then
                            "Accessibility,"
                            and tap on "Text-to-Speech output." Here, you can choose the preferred engine,
                            language, and speech rate (install Thai/English language packs).</li>
                        <li>To test the text-to-speech functionality, you can use any app that supports
                            text-to-speech, such as Google Play Books or Google Translate. Simply select the
                            text you want to hear, and tap on the "Speak" option.</li>
                    </ol>
                    <p>Chrome Browser</p>
                    <ol>
                        <li>Open the Chrome browser on your Android phone.</li>
                        <li>Tap the three-dot menu in the top-right corner and select "Settings."</li>
                        <li>Scroll down and tap on "Accessibility."</li>
                        <li>Turn on "Simplified view" and "Simplified view to speech" options to enable
                            Chrome's text-to-speech feature.</li>
                        <li>To test the text-to-speech functionality, you can use any website that supports
                            text-to-speech, such as Google Translate. Simply select the text you want to
                            hear, and tap on the "Speak" option.</li>
                    </ol>
                </div>
            </details>
            <details>
                <summary>Mobile iPhone and Safari browser</summary>
                <p>
                    To enable text-to-speech on iPhone, you can use the built-in accessibility features.
                </p>
                <div class="text-to-speech-steps">
                    <ol>
                        <li>Go to "Settings" on your iPhone.</li>
                        <li>Scroll down and tap on "Accessibility."</li>
                        <li>Tap on "Spoken Content."</li>
                        <li>Turn on "Speak Selection" or "Speak Screen" to enable text-to-speech.</li>
                        <li>To adjust the text-to-speech settings, go back to "Settings," then
                            "Accessibility," and tap on "Spoken Content." Here, you can choose the preferred
                            voice, speaking rate, and language (install Thai language package).</li>
                        <li>To test the text-to-speech functionality, you can use any app that supports
                            text-to-speech, such as Safari or Notes. Simply select the text you want to
                            hear, and tap on the "Speak" option.</li>
                    </ol>
                </div>
                <p>Safari Browser</p>
                <ol>
                    <li>Open the Safari browser on your iPhone.</li>
                    <li>Tap the "Aa" icon in the top-left corner of the screen.</li>
                    <li>Select "Speak Selection" or "Speak Screen" to enable text-to-speech.</li>
                    <li>To test the text-to-speech functionality, you can use any website that supports
                        text-to-speech, such as Google Translate. Simply select the text you want to
                        hear, and tap on the "Speak" option.</li>
                </ol>
            </details>
        </div>

        <div id="setupDesktopTTS">
            <details>
                <summary>Laptop with Chrome browser</summary>
                <p>
                    To enable text-to-speech on a tablet, laptop or desktop, you can use the built-in
                    accessibility features.
                    Here are the steps to enable text-to-speech on Windows devices:
                </p>
                <div class="text-to-speech-steps">
                    <ol>
                        <li>Go to "Settings" on your Windows computer.</li>
                        <li>Click on "Ease of Access."</li>
                        <li>Click on "Narrator" in the left sidebar.</li>
                        <li>Turn on the Narrator toggle switch to enable text-to-speech.</li>
                        <li>To adjust the text-to-speech settings, go back to "Settings," then
                            "Ease of Access," and click on "Narrator." Here, you can choose the preferred
                            voice, speed, and pitch. (install Thai language package)</li>
                        <li>To test the text-to-speech functionality, you can use any app that supports
                            text-to-speech, such as Microsoft Word or Notepad. Simply select the text you
                            want to hear, and press the "Ctrl + Enter" keys.</li>
                    </ol>
                </div>
            </details>

            <details>
                <summary>Laptop with Safari browser</summary>
                <p>
                    To enable text-to-speech on a tablet, laptop or desktop, you can use the built-in
                    accessibility features.
                    Here are the steps to enable text-to-speech on Mac devices:
                </p>
                <div class="text-to-speech-steps">
                    <ol>
                        <li>Go to "System Preferences" on your Mac.</li>
                        <li>Click on "Accessibility."</li>
                        <li>Click on "Speech" in the left sidebar.</li>
                        <li>Turn on the "Speak selected text when the key is pressed" option to enable
                            text-to-speech.</li>
                        <li>To adjust the text-to-speech settings, go back to "System Preferences," then
                            "Accessibility," and click on "Speech." Here, you can choose the preferred
                            voice,
                            speaking rate, and language. (install Thai language package)</li>
                        <li>To test the text-to-speech functionality, you can use
                            any app that supports text-to-speech, such as TextEdit or Safari. Simply select
                            the text you want to hear, and press the "Option + Esc" keys.</li>
                    </ol>
                </div>
            </details>
        </div>
    </details>`;
                }
            }
        });

        /* --- Paragraph Rendering --- */
        function getCurrentParagraph() { return book?.chapters?.[currentChapter]?.paragraphs?.[currentParagraph] || []; }

        /* --- Paragraph Rendering --- */
        function renderParagraph() {
            const para = getCurrentParagraph(); // get current paragraph internally
            if (!para || !para.length) {
                paragraphDisplay.innerHTML = '';
                return;
            }

            paragraphDisplay.innerHTML = '';

            const languageSettings = {
                th: { checkboxId: 'showThai', langCode: 'th-TH' },
                en: { checkboxId: 'showEnglish', langCode: 'en-US' },
                fa: { checkboxId: 'showPersian', langCode: 'fa-IR' }
            };

            para.forEach((wordObj, wordIndex) => {
                // Check if any language is a newline
                const isNewline = Object.values(wordObj).some(val => val === "\n");
                if (isNewline) {
                    paragraphDisplay.appendChild(document.createElement('br'));
                    return; // skip creating empty div
                }

                // Create word-pair container
                const pairDiv = document.createElement('div');
                pairDiv.className = 'word-pair';
                pairDiv.dataset.index = wordIndex;

                // Dynamically add spans for each language
                Object.entries(languageSettings).forEach(([key, { checkboxId, langCode }]) => {
                    if (document.getElementById(checkboxId)?.checked && wordObj[key] && wordObj[key] !== "\n") {
                        const span = document.createElement('span');
                        span.textContent = wordObj[key];
                        span.dataset.langKey = key; // store th/en/fa
                        span.dataset.index = wordIndex;
                        span.onclick = () => playWord(wordObj[key], langCode, span, wordIndex);
                        pairDiv.appendChild(span);
                    }
                });

                // Only append if there are any visible spans
                if (pairDiv.children.length > 0) {
                    paragraphDisplay.appendChild(pairDiv);
                }
            });

            applyThaiFont();

            // Refresh the quiz for this paragraph
            Quiz.buildFromParagraph(para);
        }

        function playWord(text, langKey, span, index) {
            if (!text || text === "\n") return;

            const themeClass = document.body.dataset.theme === 'dark'
                ? 'highlight-dark'
                : 'highlight-light';

            clearHighlights();
            if (span) span.classList.add(themeClass);

            // cancel any queued speech before speaking
            speechSynthesis.cancel();

            const ttsLang = langMap[langKey] || 'th-TH'; // fallback Thai
            const utter = new SpeechSynthesisUtterance(text);
            utter.lang = ttsLang;
            utter.rate = 1;
            speechSynthesis.speak(utter);
        }

        /*
                function clearHighlights() { document.querySelectorAll('#paragraphDisplay span').forEach(s => s.classList.remove('highlight-light', 'highlight-dark')); }
        */

        function clearHighlights() {
            document.querySelectorAll('#paragraphDisplay .word-pair span')
                .forEach(s => s.classList.remove('highlight-light', 'highlight-dark'));
        }

        function speakWord(text, lang, index, { autoAdvance = true } = {}) {
            return new Promise(resolve => {
                if (!text || text === "\n") {
                    resolve();
                    return;
                }

                const themeClass = document.body.dataset.theme === "dark"
                    ? "highlight-dark"
                    : "highlight-light";

                // find correct span for this word/lang
                const pairDiv = paragraphDisplay.querySelector(`.word-pair[data-index="${index}"]`);
                const span = pairDiv ? pairDiv.querySelector(`span[data-langKey="${lang.split('-')[0]}"]`) : null;

                clearHighlights();
                if (span) {
                    span.classList.add(themeClass);
                    lastHighlightedIndex = index;
                }

                const utter = new SpeechSynthesisUtterance(text);
                utter.lang = lang;
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

        /* --- Quiz --- */
        const Quiz = {
            data: [],
            currentQ: 0,

            buildFromParagraph(para) {
                this.data = para.map(w => ({
                    th: w.th,
                    en: w.en,
                    fa: w.fa,
                    attempted: false,
                    correct: false
                }));
                this.currentQ = 0;
                this.render();
            },

            render() {
                const qDiv = document.getElementById("quiz");
                qDiv.innerHTML = "";

                if (!this.data || !this.data.length) {
                    qDiv.textContent = "No quiz available for this paragraph.";
                    return;
                }

                const q = this.data[this.currentQ];
                const qLang = document.querySelector('input[name="questionLang"]:checked')?.value;
                const aLang = document.querySelector('input[name="answerLang"]:checked')?.value;

                if (!qLang || !aLang) {
                    qDiv.textContent = "Select both Question and Answer languages.";
                    return;
                }
                if (qLang === aLang) {
                    qDiv.textContent = "Answer language must be different from Question.";
                    return;
                }

                // --- Question word ---
                const qEl = document.createElement("div");
                qEl.className = "quiz-question";
                qEl.textContent = q[qLang] || "";
                qEl.style.cursor = "pointer";
                qEl.addEventListener("click", () => {
                    speakTextQueued(q[qLang], qLang === "th" ? "th-TH" : qLang === "en" ? "en-US" : "fa-IR");
                });
                qDiv.appendChild(qEl);

                // --- Answer options (limit 4 random) ---
                let opts = this.data
                    .map(qq => qq[aLang])
                    .filter((val, idx, arr) => arr.indexOf(val) === idx && val); // unique & non-empty

                // Always include the correct answer
                const correct = q[aLang];
                opts = opts.filter(o => o !== correct);

                // Pick 3 random wrong + add correct
                opts = [correct, ...opts.sort(() => Math.random() - 0.5).slice(0, 3)];
                opts.sort(() => Math.random() - 0.5);

                // Track score safely
                if (typeof this.score === "undefined") this.score = 0;
                if (typeof this.attempts === "undefined") this.attempts = 0;

                // --- Render answer options ---
                const optsContainer = document.createElement("div");
                optsContainer.className = "quiz-options";

                opts.forEach(opt => {
                    const optEl = document.createElement("div");
                    optEl.className = "quiz-option";
                    optEl.textContent = opt;

                    // Speak on click + check correctness
                    optEl.addEventListener("click", () => {
                        speakTextQueued(opt, aLang === "th" ? "th-TH" : aLang === "en" ? "en-US" : "fa-IR");

                        if (opt === correct) {
                            if (!q.correct) { // first time marking correct
                                optEl.classList.add("correct");
                                this.score++;
                                q.correct = true;
                                q.attempted = true;
                                this.attempts++;
                            }
                        } else {
                            optEl.classList.add("incorrect");
                            q.correct = false;
                            q.attempted = true;
                            this.attempts++;
                        }

                        document.getElementById("score").textContent =
                            `Score: ${this.score}/${this.attempts}`;
                    });

                    optsContainer.appendChild(optEl);
                });

                qDiv.appendChild(optsContainer);
            },

            updateScore() {
                // Ensure counters exist
                if (typeof this.score === "undefined") this.score = 0;
                if (typeof this.attempts === "undefined") this.attempts = 0;

                // Update the score display with live counters
                scoreDisplay.textContent = `Score: ${this.score}/${this.attempts}`;
            }

        };

        function buildQuizFromParagraph(para) { Quiz.buildFromParagraph(para); }

        /* --- SPA Init (Refactored) --- */
        function initSPA() {
            const main = document.querySelector('main');
            main.innerHTML = '';

            /* --- Book/Chapter/Paragraph Selection --- */
            const selSec = document.createElement('section');
            selSec.id = 'bookSelectionControls';
            const bookLabel = document.createElement('label'); bookLabel.textContent = 'Book: ';
            const bookSelectEl = document.createElement('select'); bookSelectEl.id = 'bookSelect'; bookLabel.appendChild(bookSelectEl);
            const chapLabel = document.createElement('label'); chapLabel.textContent = 'Chapter: ';
            const chapSelectEl = document.createElement('select'); chapSelectEl.id = 'chapterSelect'; chapLabel.appendChild(chapSelectEl);
            const paraLabel = document.createElement('label'); paraLabel.textContent = 'Paragraph: ';
            const paraSelectEl = document.createElement('select'); paraSelectEl.id = 'paragraphSelect'; paraLabel.appendChild(paraSelectEl);
            selSec.append(bookLabel, chapLabel, paraLabel);
            main.appendChild(selSec);

            /* --- Paragraph Section --- */
            const paraSec = document.createElement('section'); paraSec.id = 'paragraphSec';
            const paraHeading = document.createElement('div'); paraHeading.className = 'quiz-heading';
            paraHeading.textContent = 'Click Play (or click a word to hear it)';
            paraSec.appendChild(paraHeading);

            const displayDiv = document.createElement('div'); displayDiv.id = 'paragraphDisplay';
            paraSec.appendChild(displayDiv);

            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'controls';
            controlsDiv.id = 'paragraphControls';

            const playBtn = document.createElement('button'); playBtn.id = 'playBtn'; playBtn.textContent = '▶️';
            const pauseBtn = document.createElement('button'); pauseBtn.id = 'pauseBtn'; pauseBtn.textContent = '⏸️';
            const restartBtn = document.createElement('button'); restartBtn.id = 'restartBtn'; restartBtn.textContent = '⏮️';

            // New paragraph navigation buttons
            const prevParaBtn = document.createElement('button'); prevParaBtn.id = 'prevParagraph'; prevParaBtn.textContent = '⬅️';
            const nextParaBtn = document.createElement('button'); nextParaBtn.id = 'nextParagraph'; nextParaBtn.textContent = '➡️';
            const paraLabelText = document.createElement('span'); paraLabelText.textContent = 'Paragraph ';

            const showThaiLbl = document.createElement('label');
            showThaiLbl.innerHTML = `<input type="checkbox" id="showThai" checked> th`;

            const showEnglishLbl = document.createElement('label');
            showEnglishLbl.innerHTML = `<input type="checkbox" id="showEnglish"> en`;

            const showPersianLbl = document.createElement('label');
            showPersianLbl.innerHTML = `<input type="checkbox" id="showPersian"> fa`;

            const delayLbl = document.createElement('label');
            delayLbl.innerHTML = `Delay<input type="number" id="playbackDelay" value="1" min="1" max="10" step="1" style="width: 4em;">`;
            const delayInput = delayLbl.querySelector('input');

            // --- Split into two rows for mobile ---
            const row1 = document.createElement('div'); row1.className = 'paragraph-controls-row';
            row1.style.display = 'flex'; row1.style.flexWrap = 'wrap'; row1.style.gap = '0.5em';
            row1.append(playBtn, pauseBtn, restartBtn, paraLabelText, prevParaBtn, nextParaBtn);

            const row2 = document.createElement('div'); row2.className = 'paragraph-controls-row';
            row2.style.display = 'flex'; row2.style.flexWrap = 'wrap'; row2.style.gap = '0.5em';
            row2.append(showThaiLbl, showEnglishLbl, showPersianLbl, delayLbl);

            controlsDiv.append(row1, row2);
            paraSec.appendChild(controlsDiv);
            main.appendChild(paraSec);

            /* --- Quiz Section --- */
            const quizSec = document.createElement('section');
            quizSec.id = 'quizSec';
            quizSec.innerHTML = `
<p>Multiple Choice Quiz</p>
<div id="quiz"></div>
<div id="quizControls">
    <div class="quiz-row quiz-row-top">
        <button id="prevQ">⬅️</button>
        <button id="nextQ">➡️</button>
        <button id="retryQuiz">🔄</button>
        <label><input type="checkbox" id="incorrectOnly"> Incorrect Only</label>
        <div id="score">Score: 0/0</div>
    </div>

    <div class="quiz-row quiz-row-bottom">
        <div class="lang-select">
            <span>Question: </span>
            <label><input type="radio" name="questionLang" id="questionThai" value="th" checked> th</label>
            <label><input type="radio" name="questionLang" id="questionEnglish" value="en"> en</label>
            <label><input type="radio" name="questionLang" id="questionPersian" value="fa"> fa</label>
        </div>
        <div class="lang-select">
            <span>Answer: </span>
            <label><input type="radio" name="answerLang" id="answerThai" value="th" checked> th</label>
            <label><input type="radio" name="answerLang" id="answerEnglish" value="en"> en</label>
            <label><input type="radio" name="answerLang" id="answerPersian" value="fa"> fa</label>
        </div>
    </div>
</div>`;
            main.appendChild(quizSec);

            /* --- Bind globals --- */
            bookSelect = document.getElementById('bookSelect');
            chapterSelect = document.getElementById('chapterSelect');
            paragraphSelect = document.getElementById('paragraphSelect');
            paragraphDisplay = document.getElementById('paragraphDisplay');
            scoreDisplay = document.getElementById('score');

            // Paragraph selection -> render
            paragraphSelect.addEventListener('change', () => {
                currentParagraph = parseInt(paragraphSelect.value, 10) || 0;
                saveSetting('currentParagraph', currentParagraph);
                renderParagraph();
            });

            // Language settings
            const savedQ = loadSetting('questionLang', 'th');
            const savedA = loadSetting('answerLang', 'en');
            document.querySelector(`input[name="questionLang"][value="${savedQ}"]`).checked = true;
            document.querySelector(`input[name="answerLang"][value="${savedA}"]`).checked = true;

            document.querySelectorAll('input[name="questionLang"]').forEach(r =>
                r.addEventListener('change', e => {
                    saveSetting('questionLang', e.target.value);
                    renderParagraph();
                })
            );
            document.querySelectorAll('input[name="answerLang"]').forEach(r =>
                r.addEventListener('change', e => {
                    saveSetting('answerLang', e.target.value);
                    renderParagraph();
                })
            );

            // Restore user selections
            document.getElementById('showThai').checked = loadSetting('showThai', '1') === '1';
            document.getElementById('showEnglish').checked = loadSetting('showEnglish', '0') === '1';
            document.getElementById('showPersian').checked = loadSetting('showPersian', '0') === '1';
            document.getElementById('playbackDelay').value = loadSetting('playbackDelay', '0.5');

            delayInput.addEventListener('change', () => {
                let val = parseFloat(delayInput.value);
                if (isNaN(val)) val = 0.5;
                val = Math.min(Math.max(val, 0.5), 10);
                delayInput.value = val.toFixed(1);
                saveSetting('playbackDelay', delayInput.value);
            });

            /* --- Paragraph Controls Event Handling --- */
            playBtn.addEventListener('click', playParagraph);
            pauseBtn.addEventListener('click', pauseParagraph);
            restartBtn.addEventListener('click', restartParagraph);

            nextParaBtn.addEventListener('click', () => {
                const max = book?.chapters?.[currentChapter]?.paragraphs?.length || 0;
                if (currentParagraph < max - 1) {
                    currentParagraph++;
                    paragraphSelect.value = currentParagraph;
                    saveSetting('currentParagraph', currentParagraph);
                    loadParagraph();
                }
            });

            prevParaBtn.addEventListener('click', () => {
                if (currentParagraph > 0) {
                    currentParagraph--;
                    paragraphSelect.value = currentParagraph;
                    saveSetting('currentParagraph', currentParagraph);
                    loadParagraph();
                }
            });
        }

        /* --- Book Loading --- */
        async function getBookList() { try { const res = await fetch('/assets/books/bookList.json'); return await res.json(); } catch (e) { console.error(e); return []; } }
        async function populateBooks() {
            const list = await getBookList(); bookSelect.innerHTML = ''; list.forEach(b => { const o = document.createElement('option'); o.value = b.bookFilename; o.textContent = b.bookTitle; bookSelect.appendChild(o); });
            const savedBook = loadSetting('currentBook', bookSelect.value); bookSelect.value = savedBook; await selectBook(savedBook);
        }
        async function selectBook(filename) { try { const res = await fetch(`/assets/books/${filename}`); book = await res.json(); saveSetting('currentBook', filename); populateChapters(); } catch (e) { console.error(e); } }
        function populateChapters() {
            chapterSelect.innerHTML = ''; book.chapters.forEach((c, i) => { const o = document.createElement('option'); o.value = i; o.textContent = c.chapterTitle; chapterSelect.appendChild(o); });
            currentChapter = Math.min(getSavedInt('currentChapter', 0), book.chapters.length - 1); chapterSelect.value = currentChapter; populateParagraphs();
        }
        function populateParagraphs() {
            paragraphSelect.innerHTML = ''; book.chapters[currentChapter].paragraphs.forEach((p, i) => { const o = document.createElement('option'); o.value = i; o.textContent = "Paragraph " + (i + 1); paragraphSelect.appendChild(o); });
            currentParagraph = Math.min(getSavedInt('currentParagraph', 0), book.chapters[currentChapter].paragraphs.length - 1); paragraphSelect.value = currentParagraph; loadParagraph();
        }
        function loadParagraph() { saveSetting('currentChapter', currentChapter); saveSetting('currentParagraph', currentParagraph); renderParagraph(); }

        /* --- Event Delegation --- */
        document.addEventListener('change', e => {
            switch (e.target.id) {
                case 'bookSelect':
                    saveSetting('currentBook', e.target.value);
                    selectBook(e.target.value);
                    break;
                case 'chapterSelect':
                    currentChapter = +e.target.value;
                    saveSetting('currentChapter', currentChapter);
                    populateParagraphs();
                    break;
                case 'paragraphSelect':
                    currentParagraph = +e.target.value;
                    saveSetting('currentParagraph', currentParagraph);
                    loadParagraph();
                    break;
                case 'showThai':
                case 'showEnglish':
                    saveSetting(e.target.id, e.target.checked ? '1' : '0');
                    renderParagraph();
                    break;
                case 'showPersian':
                    saveSetting(e.target.id, e.target.checked ? '1' : '0');
                    renderParagraph();
                    break;
                case 'playbackDelay':
                    let val = parseFloat(e.target.value);
                    if (isNaN(val)) val = 0.5;
                    val = Math.min(Math.max(val, 0.5), 10);
                    e.target.value = val.toFixed(1);
                    saveSetting('playbackDelay', e.target.value);
                    break;
                case 'questionThai':
                case 'incorrectOnly':
                    saveSetting(e.target.id, e.target.checked ? '1' : '0');
                    Quiz.render();
                    break;
            }
        });

        document.addEventListener('click', e => {
            switch (e.target.id) {
                case 'playBtn': playParagraph(); break;
                case 'pauseBtn': pauseParagraph(); break;
                case 'restartBtn': restartParagraph(); break;
                case 'prevQ': Quiz.currentQ = Math.max(0, Quiz.currentQ - 1); Quiz.data.forEach(q => { q.attempted = false; q.correct = false; }); Quiz.render(); break;
                case 'nextQ': Quiz.currentQ++; Quiz.render(); break;
                case 'retryQuiz': Quiz.data.forEach(q => { q.attempted = false; q.correct = false; }); Quiz.render(); break;
            }
        });

        /* --- Playback Controls (play resumes from paused index) --- */
        function playParagraph() {
            if (isPlaying) return; // already playing
            isPlaying = true;

            const para = getCurrentParagraph();
            // if finished, restart from beginning
            if (currentWordIndex >= (para?.length || 0)) {
                currentWordIndex = 0;
            }

            speakNextWord();
        }
        function pauseParagraph() {
            isPlaying = false;
            // ❌ Do NOT clear highlights, keep current highlight visible
            speechSynthesis.cancel();
        }

        function restartParagraph() {
            isPlaying = false;
            speechSynthesis.cancel();
            clearHighlights();
            currentWordIndex = 0;
            lastHighlightedIndex = null;
            isPlaying = true;
            speakNextWord();
        }
        async function speakNextWord() {
            if (!isPlaying) return;

            const para = getCurrentParagraph();
            if (!para || currentWordIndex >= para.length) {
                isPlaying = false;
                clearHighlights();
                return;
            }

            const w = para[currentWordIndex];

            // Skip empty/newline entries
            if (w && !Object.values(w).some(val => val === "\n")) {
                // 🔑 Speak only languages with checked boxes
                if (w.th && document.getElementById("showThai")?.checked) {
                    await speakWord(w.th, "th-TH", currentWordIndex);
                }
                if (w.en && document.getElementById("showEnglish")?.checked) {
                    await speakWord(w.en, "en-US", currentWordIndex);
                }
                if (w.fa && document.getElementById("showPersian")?.checked) {
                    await speakWord(w.fa, "fa-IR", currentWordIndex);
                }
            }

            // keep track for pause/resume
            lastHighlightedIndex = currentWordIndex;
            currentWordIndex++;

            if (isPlaying) {
                const delay = parseFloat(document.getElementById("playbackDelay")?.value) || 0.5;
                setTimeout(speakNextWord, delay * 1000);
            }
        }
        /* --- Init SPA --- */
        (async function () { initSPA(); await populateBooks(); })();


    </script>


```


---
This suggested refactor will not work! Initial code base deleted AGAIN!!!! The App initialization has changed from  /* --- Init SPA --- */
   (async function () { initSPA(); await populateBooks(); })();
to initSPA();  The pargraph handling no longer creates the Quiz for the paragraph, et cetra.  Attempting to merge the last JS chat output addressing the word highlighting bug with the rest of the code seems futile.  With hindsight a diff option earlier may have succeeded more than the suggestion that you would regenerate the entire JS code (clearly you do not check any limit boundary)  The code is too large for your chat output and waiting more hours to see the sam failure is not an option.  The major short coming seems that despite having uploaded html, css, js multiple times, it seems within 2 chat reply / responses, your context is jumbled up and most of the code disappears. I see no option but to give up.   
