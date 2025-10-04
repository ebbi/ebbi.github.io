// ==================== CONSTANTS ====================
const CONSTANTS = {
    STORAGE_KEYS: {
        THEME: 'theme',
        THAI_FONT: 'thaiFont',
        CURRENT_TOPIC: 'currentTopic',
        CURRENT_TITLE: 'currentTitle',
        CURRENT_EXAMPLE: 'currentExample',
        PLAYBACK_DELAY: 'playbackDelay',
        QUESTION_LANG: 'questionLang',
        ANSWER_LANG: 'answerLang'
    },
    DEFAULT_VALUES: {
        THEME: 'light',
        PLAYBACK_DELAY: '0.5',
        QUESTION_LANG: 'th-TH',
        ANSWER_LANG: 'en-US'
    },
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000
};

// ==================== APP CONFIGURATION ====================
const AppConfig = {
    data: null,
    availableLanguages: [],
    quizEnabledLanguages: [],

    async load() {
        try {
            const response = await fetch('/assets/bhasa/bhasaSetup.json');
            this.data = await response.json();
            this.processLanguages();
            return this.data;
        } catch (error) {
            console.error('Failed to load app configuration:', error);
            // Fallback to default configuration
            this.data = this.getDefaultConfig();
            this.processLanguages();
            return this.data;
        }
    },

    processLanguages() {
        this.availableLanguages = Object.entries(this.data.languages).map(([code, config]) => ({
            code,
            ...config
        }));

        // DEBUG: Log all languages before filtering
        console.log('All languages before quiz filtering:', this.availableLanguages);

        this.quizEnabledLanguages = this.availableLanguages.filter(lang => {
            const isEnabled = lang.quizEnabled;
            console.log(`Language ${lang.code} (${lang.name}): quizEnabled = ${isEnabled}`);
            return isEnabled;
        });

        // MANUAL OVERRIDE: Ensure Japanese is always included in quiz languages
        const japaneseLang = this.availableLanguages.find(lang => lang.code === 'ja-JP');
        if (japaneseLang && !this.quizEnabledLanguages.find(lang => lang.code === 'ja-JP')) {
            console.log('Manually adding Japanese to quiz languages');
            this.quizEnabledLanguages.push(japaneseLang);
        }

        console.log('Final quiz languages:', this.quizEnabledLanguages.map(l => l.code));
    },

    getDefaultConfig() {
        return {
            app: {
                name: "Bhasa Language Learner",
                version: "2.0",
                defaultTheme: "light",
                supportedQuizModes: ["word"],
                maxDisplayLanguages: 6,
                defaultPlaybackDelay: 0.5
            },
            languages: {
                "th-TH": {
                    name: "Thai",
                    nativeName: "ไทย",
                    fontFamily: "Noto Sans Thai, Tahoma, sans-serif",
                    rtl: false,
                    defaultDisplay: true,
                    defaultSpeak: true,
                    quizEnabled: true
                },
                "fa-IR": {
                    name: "Persian",
                    nativeName: "فارسی",
                    fontFamily: "Arial, sans-serif",
                    rtl: true,
                    defaultDisplay: false,
                    defaultSpeak: false,
                    quizEnabled: true
                },
                "en-US": {
                    name: "English",
                    nativeName: "English",
                    fontFamily: "Arial, sans-serif",
                    rtl: false,
                    defaultDisplay: false,
                    defaultSpeak: false,
                    quizEnabled: true
                },
                "ja-JP": {
                    name: "Japanese",
                    nativeName: "日本語",
                    fontFamily: "Arial, sans-serif",
                    rtl: false,
                    defaultDisplay: false,
                    defaultSpeak: false,
                    quizEnabled: true
                }
            },
            features: {
                enableSearch: true,
                enableProgressTracking: true,
                enableTTS: true,
                enableQuiz: true
            }
        };
    },

    getLanguage(code) {
        return this.availableLanguages.find(lang => lang.code === code);
    },

    getDisplayLanguages() {
        return this.availableLanguages.filter(lang =>
            Storage.loadBool(`display_${lang.code}`, lang.defaultDisplay)
        );
    },

    getSpeakLanguages() {
        return this.availableLanguages.filter(lang =>
            Storage.loadBool(`speak_${lang.code}`, lang.defaultSpeak)
        );
    }
};

// ==================== ERROR HANDLER ====================
const ErrorHandler = {
    wrap: (fn, context = '') => {
        return (...args) => {
            try {
                return fn(...args);
            } catch (error) {
                console.error(`Error in ${context}:`, error);
                ErrorHandler.showErrorToUser(error.message);
                return null;
            }
        };
    },

    showErrorToUser: (message) => {
        const contentArea = document.getElementById('contentArea');
        if (contentArea) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.innerHTML = `
    <strong>Something went wrong</strong>
    <p>${ErrorHandler.sanitizeHTML(message)}</p>
    <button onclick="this.parentElement.remove()" style="margin-top: 0.5em;">Dismiss</button>
    `;
            contentArea.prepend(errorDiv);
        }
    },

    showSuccessMessage: (message) => {
        const contentArea = document.getElementById('contentArea');
        if (contentArea) {
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.innerHTML = `
    <strong>Success</strong>
    <p>${ErrorHandler.sanitizeHTML(message)}</p>
    <button onclick="this.parentElement.remove()" style="margin-top: 0.5em;">Dismiss</button>
    `;
            contentArea.prepend(successDiv);
        }
    },

    sanitizeHTML: (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// ==================== UTILITIES ====================
const Utils = {
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle: (func, limit) => {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    setLoadingState: (isLoading) => {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = isLoading ? 'flex' : 'none';
        }
    }
};

// ==================== STORAGE MANAGER ====================
const Storage = {
    save: (key, value) => {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.error('Storage error:', error);
        }
    },

    load: (key, defaultValue = '') => {
        try {
            return localStorage.getItem(key) || defaultValue;
        } catch (error) {
            console.error('Storage error:', error);
            return defaultValue;
        }
    },

    loadInt: (key, defaultValue = 0) => {
        const value = Storage.load(key, defaultValue.toString());
        return parseInt(value, 10);
    },

    loadBool: (key, defaultValue = false) => {
        const value = Storage.load(key, defaultValue ? '1' : '0');
        return value === '1';
    },

    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Storage error:', error);
        }
    }
};

// ==================== NETWORK MANAGER ====================
const NetworkManager = {
    async fetchWithRetry(url, retries = CONSTANTS.MAX_RETRIES, delay = CONSTANTS.RETRY_DELAY) {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url);
                if (response.ok) return response;
                if (response.status === 404) {
                    throw new Error(`File not found: ${url}`);
                }
                throw new Error(`HTTP ${response.status}`);
            } catch (error) {
                if (i === retries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
            }
        }
    },

    async fetchJSON(url) {
        try {
            const response = await this.fetchWithRetry(url);
            return await response.json();
        } catch (error) {
            console.warn(`Failed to load ${url}:`, error.message);
            // Return empty/default data instead of throwing
            if (url.includes('topicList.json')) {
                return this.getDefaultTopicList();
            }
            if (url.includes('bhasaSetup.json')) {
                return AppConfig.getDefaultConfig();
            }
            throw error; // Re-throw for topic files
        }
    },

    getDefaultTopicList() {
        return [
            {
                topicFilename: "greetings.json",
                topic: "Greetings",
                description: "Basic greetings and introductions",
                languageCount: 4,
                exampleCount: 5,
                difficulty: "beginner"
            }
        ];
    }
};

// ==================== SCREEN READER ANNOUNCER ====================
const ScreenReader = {
    announce: (message, priority = 'polite') => {
        const announcement = document.getElementById('statusAnnouncement');
        if (announcement) {
            announcement.setAttribute('aria-live', priority);
            announcement.textContent = message;
            // Clear after announcement
            setTimeout(() => {
                announcement.textContent = '';
            }, 1000);
        }
    }
};

// ==================== ENHANCED TTS MANAGER ====================
const TTSManager = {
    supportedVoices: [],
    testResults: {},
    voiceCache: new Map(),

    initialize() {
        this.loadVoices();
        speechSynthesis.addEventListener('voiceschanged', () => {
            this.loadVoices();
        });
    },

    loadVoices() {
        this.supportedVoices = speechSynthesis.getVoices();
        this.voiceCache.clear();
    },

    isSupported() {
        return 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
    },

    getLanguageVoices(lang) {
        return this.supportedVoices.filter(voice =>
            voice.lang.startsWith(lang) || voice.lang.includes(lang)
        );
    },

    hasLanguageSupport(lang) {
        return this.getLanguageVoices(lang).length > 0;
    },

    testLanguage(lang, text) {
        return new Promise((resolve) => {
            if (!this.isSupported()) {
                resolve({ success: false, error: 'TTS not supported' });
                return;
            }

            if (!this.hasLanguageSupport(lang)) {
                resolve({ success: false, error: `No ${lang} voices available` });
                return;
            }

            try {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = lang;
                utterance.volume = 0.7;

                utterance.onend = () => {
                    resolve({ success: true, voices: this.getLanguageVoices(lang) });
                };

                utterance.onerror = (error) => {
                    resolve({ success: false, error: this.getFriendlyError(error.error) });
                };

                speechSynthesis.speak(utterance);
            } catch (error) {
                resolve({ success: false, error: error.message });
            }
        });
    },

    async comprehensiveTest() {
        const tests = AppConfig.availableLanguages
            .filter(lang => lang.defaultSpeak)
            .map(lang => ({
                lang: lang.code,
                text: this.getTestText(lang.code),
                name: lang.name
            }));

        this.testResults = {};
        let allPassed = true;

        for (const test of tests) {
            const result = await this.testLanguage(test.lang, test.text);
            this.testResults[test.lang] = {
                ...result,
                name: test.name,
                text: test.text
            };

            if (!result.success) {
                allPassed = false;
            }

            await new Promise(resolve => setTimeout(resolve, 500));
        }

        return allPassed;
    },

    getTestText(langCode) {
        const texts = {
            'th-TH': 'สวัสดี นี่คือการทดสอบเสียงพูดภาษาไทย',
            'fa-IR': 'سلام، این تست گفتار فارسی است',
            'en-US': 'Hello, this is English text-to-speech',
            'zh-CN': '你好，这是中文文本转语音测试',
            'ja-JP': 'こんにちは、これは日本語のテキスト読み上げテストです'
        };
        return texts[langCode] || `Test for ${langCode}`;
    },

    speak(text, lang, onEnd) {
        if (!text) return;

        const sanitizedText = ErrorHandler.sanitizeHTML(text);
        if (!sanitizedText) return;

        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(sanitizedText);
        utterance.lang = lang;
        utterance.volume = 0.8;
        utterance.rate = 0.9;
        utterance.pitch = 1.0;

        if (onEnd) utterance.onend = onEnd;

        speechSynthesis.speak(utterance);
        ScreenReader.announce(`Speaking: ${sanitizedText.substring(0, 50)}...`);
    },

    cancel() {
        speechSynthesis.cancel();
        ScreenReader.announce('Speech cancelled');
    },

    pause() {
        speechSynthesis.pause();
        ScreenReader.announce('Speech paused');
    },

    resume() {
        speechSynthesis.resume();
        ScreenReader.announce('Speech resumed');
    },

    getFriendlyError(error) {
        const errorMap = {
            'not-allowed': 'Microphone access denied. Please check browser permissions.',
            'network': 'Network error. Please check your internet connection.',
            'audio-busy': 'Audio device is busy. Please try again.',
            'audio-hardware': 'Audio hardware error. Please check your audio devices.',
            'synthesis-failed': 'Speech synthesis failed. Please try again.',
            'synthesis-unavailable': 'Speech synthesis unavailable for this language.'
        };
        return errorMap[error] || `An unexpected error occurred: ${error}`;
    },

    getSetupInstructions() {
        return `
    <div class="tts-setup-steps">
        <h4>Text-to-Speech Setup Instructions</h4>
        <div class="tts-step">
            <strong>Step 1: Install Language Packs</strong>
            <p>Go to your device settings and install the required language packs for:</p>
            <ul>
                ${AppConfig.availableLanguages.map(lang =>
            `<li><strong>${lang.name}:</strong> Search for "${lang.name} language pack" in your device settings</li>`
        ).join('')}
            </ul>
        </div>
        <div class="tts-step">
            <strong>Step 2: Browser TTS Setup</strong>
            <p>In your browser settings:</p>
            <ul>
                <li>Chrome: Settings → Advanced → Accessibility → Text-to-Speech</li>
                <li>Firefox: Preferences → General → Language → Text-to-Speech</li>
                <li>Safari: System Preferences → Accessibility → Speech</li>
            </ul>
        </div>
        <div class="tts-step">
            <strong>Step 3: Enable Voices</strong>
            <p>Make sure the voices are enabled and set as default in your system's text-to-speech settings.</p>
        </div>
    </div>
    `;
    },

    getStatusMessage() {
        const supportedLanguages = AppConfig.availableLanguages.filter(lang =>
            this.hasLanguageSupport(lang.code)
        );

        if (!this.isSupported()) {
            return {
                type: 'error',
                title: 'TTS Not Supported',
                message: 'Your browser does not support Text-to-Speech. Please use a modern browser like Chrome, Firefox, or Edge.'
            };
        }

        if (supportedLanguages.length === 0) {
            return {
                type: 'error',
                title: 'No TTS Voices Available',
                message: 'No text-to-speech voices are available. Please install language packs following the instructions below.'
            };
        }

        const availableNames = supportedLanguages.map(lang => lang.name);
        const missingLanguages = AppConfig.availableLanguages
            .filter(lang => !this.hasLanguageSupport(lang.code))
            .map(lang => lang.name);

        if (missingLanguages.length > 0) {
            return {
                type: 'warning',
                title: 'Partial TTS Support',
                message: `Available: ${availableNames.join(', ')}. Missing: ${missingLanguages.join(', ')}. Some features may not work properly.`
            };
        }

        return {
            type: 'success',
            title: 'TTS Fully Supported',
            message: `All languages are available: ${availableNames.join(', ')}. Text-to-speech is ready to use.`
        };
    }
};

// ==================== PROGRESS TRACKER ====================
const ProgressTracker = {
    saveProgress: ErrorHandler.wrap((topicId, titleIndex, exampleIndex, score) => {
        const progress = {
            lastAccessed: new Date().toISOString(),
            currentTitle: titleIndex,
            currentExample: exampleIndex,
            scores: ProgressTracker.getScores(topicId),
            completedExamples: ProgressTracker.getCompletedExamples(topicId)
        };

        progress.scores[`${titleIndex}-${exampleIndex}`] = score;
        progress.completedExamples.add(`${titleIndex}-${exampleIndex}`);

        Storage.save(`progress-${topicId}`, JSON.stringify(progress));
    }, 'ProgressTracker.saveProgress'),

    getProgress: ErrorHandler.wrap((topicId) => {
        const progress = Storage.load(`progress-${topicId}`);
        return progress ? JSON.parse(progress) : {
            lastAccessed: null,
            currentTitle: 0,
            currentExample: 0,
            scores: {},
            completedExamples: new Set()
        };
    }, 'ProgressTracker.getProgress'),

    getCompletionPercentage: ErrorHandler.wrap((topicId, topicData) => {
        const progress = ProgressTracker.getProgress(topicId);
        const totalExamples = topicData.titles?.reduce((total, title) =>
            total + (title.examples?.length || 0), 0) || 0;

        if (totalExamples === 0) return 0;

        return Math.round((progress.completedExamples.size / totalExamples) * 100);
    }, 'ProgressTracker.getCompletionPercentage'),

    getScores: (topicId) => {
        const progress = ProgressTracker.getProgress(topicId);
        return progress.scores || {};
    },

    getCompletedExamples: (topicId) => {
        const progress = ProgressTracker.getProgress(topicId);
        return new Set(progress.completedExamples || []);
    }
};

// ==================== APPLICATION STATE ====================
const AppState = {
    topics: [],
    currentTopic: null,
    currentTitle: 0,
    currentExample: 0,
    isPlaying: false,
    currentWordIndex: 0,
    lastHighlightedIndex: null,

    initialize() {
        this.currentTopic = Storage.load(CONSTANTS.STORAGE_KEYS.CURRENT_TOPIC, '');
        this.currentTitle = Storage.loadInt(CONSTANTS.STORAGE_KEYS.CURRENT_TITLE, 0);
        this.currentExample = Storage.loadInt(CONSTANTS.STORAGE_KEYS.CURRENT_EXAMPLE, 0);
    },

    saveNavigation() {
        Storage.save(CONSTANTS.STORAGE_KEYS.CURRENT_TITLE, this.currentTitle);
        Storage.save(CONSTANTS.STORAGE_KEYS.CURRENT_EXAMPLE, this.currentExample);

        if (this.currentTopic?.topicFilename) {
            ProgressTracker.saveProgress(
                this.currentTopic.topicFilename,
                this.currentTitle,
                this.currentExample,
                QuizSystem.score
            );
        }
    },

    getCurrentExample() {
        try {
            const currentTitle = this.currentTopic?.titles?.[this.currentTitle];
            const examples = currentTitle?.examples;
            const example = examples?.[this.currentExample];

            console.log('Current example data:', example);

            if (!example) {
                console.warn('No example found at current position');
                return [];
            }

            // If it's already in word array format, return as-is
            if (Array.isArray(example)) {
                return example;
            }

            // Handle object format with translations
            return example; // Let PlaybackController handle the conversion
        } catch (error) {
            console.error('Error getting current example:', error);
            return [];
        }
    },

    convertTranslationsToWordArray(translations) {
        const languages = Object.keys(translations);
        const wordArrays = languages.map(lang => {
            const content = translations[lang];
            return Array.isArray(content) ? content : [content];
        });

        const maxLength = Math.max(...wordArrays.map(arr => arr.length));
        const result = [];

        for (let i = 0; i < maxLength; i++) {
            const word = {};
            languages.forEach((lang, langIndex) => {
                word[lang] = wordArrays[langIndex][i] || '';
            });
            result.push(word);
        }

        return result;
    }
};

// ========== UI COMPONENTS ==========
const ThemeManager = {
    init() {
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => this.toggle());
        this.set(Storage.load(CONSTANTS.STORAGE_KEYS.THEME, CONSTANTS.DEFAULT_VALUES.THEME));
    },

    set(theme) {
        document.body.dataset.theme = theme;
        document.getElementById('themeToggle').textContent = theme === 'light' ? '🌞' : '🌙';
        document.getElementById('themeToggle').setAttribute('aria-label',
            theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
        Storage.save(CONSTANTS.STORAGE_KEYS.THEME, theme);
        ScreenReader.announce(`Theme set to ${theme} mode`);
    },

    toggle() {
        this.set(document.body.dataset.theme === 'light' ? 'dark' : 'light');
    }
};

const FontManager = {
    init() {
        this.apply();
    },

    apply() {
        const font = Storage.load(CONSTANTS.STORAGE_KEYS.THAI_FONT, '');

        // Apply to body or a container element to cascade down
        const body = document.body;

        // Remove all font classes first
        body.classList.remove('thai-font', 'tahoma', 'noto', 'chakra');

        // Add base class and specific font class
        body.classList.add('thai-font');
        if (font === 'Tahoma') body.classList.add('tahoma');
        if (font === 'Noto Sans Thai') body.classList.add('noto');
        if (font === 'Chakra Petch') body.classList.add('chakra');

        // Also apply directly to app title for redundancy
        const appTitle = document.getElementById('appTitle');
        if (appTitle) {
            appTitle.classList.add('thai-font');
            appTitle.classList.remove('tahoma', 'noto', 'chakra');
            if (font === 'Tahoma') appTitle.classList.add('tahoma');
            if (font === 'Noto Sans Thai') appTitle.classList.add('noto');
            if (font === 'Chakra Petch') appTitle.classList.add('chakra');
        }

        // Apply to font preview
        const fontPreview = document.getElementById('fontPreview');
        if (fontPreview) {
            fontPreview.className = 'font-preview thai-font';
            if (font === 'Tahoma') fontPreview.classList.add('tahoma');
            if (font === 'Noto Sans Thai') fontPreview.classList.add('noto');
            if (font === 'Chakra Petch') fontPreview.classList.add('chakra');
        }

        // Force re-render of example display if it exists
        const exampleDisplay = document.getElementById('exampleDisplay');
        if (exampleDisplay && exampleDisplay.innerHTML) {
            // This will trigger the CSS to apply to the Thai text
            const currentExample = AppState.getCurrentExample();
            if (currentExample && currentExample.length > 0) {
                ExampleRenderer.render(currentExample);
            }
        }
    }
};

// ========== LANGUAGE MANAGER ==========
const LanguageManager = {
    init() {
        this.renderLanguageControls();
        this.renderQuizLanguageOptions();
        this.bindLanguageEvents();
    },

    renderLanguageControls() {
        const languageGrid = document.querySelector('.language-grid');
        if (!languageGrid) return;

        // Clear existing rows (keep headers)
        const existingRows = languageGrid.querySelectorAll('.language-grid-row');
        existingRows.forEach(row => row.remove());

        AppConfig.availableLanguages.forEach(language => {
            const row = document.createElement('div');
            row.className = 'language-grid-row';

            const isDisplayEnabled = Storage.loadBool(`display_${language.code}`, language.defaultDisplay);
            const isSpeakEnabled = Storage.loadBool(`speak_${language.code}`, language.defaultSpeak);

            row.innerHTML = `
    <div class="language-name">
        ${language.name} (${language.nativeName})
    </div>
    <div class="language-checkbox-cell">
        <input type="checkbox" id="display_${language.code}"
            ${isDisplayEnabled ? 'checked' : ''}
            aria-label="Display ${language.name}">
    </div>
    <div class="language-checkbox-cell">
        <input type="checkbox" id="speak_${language.code}"
            ${isSpeakEnabled ? 'checked' : ''}
            aria-label="Speak ${language.name}">
    </div>
    `;

            languageGrid.appendChild(row);
        });
    },

    renderQuizLanguageOptions() {
        const questionGroup = document.getElementById('questionLangGroup');
        const answerGroup = document.getElementById('answerLangGroup');

        if (!questionGroup || !answerGroup) return;

        questionGroup.innerHTML = '';
        answerGroup.innerHTML = '';

        const quizLanguages = AppConfig.quizEnabledLanguages;

        console.log('Quiz Enabled Languages:', quizLanguages);

        const savedQuestionLang = Storage.load(CONSTANTS.STORAGE_KEYS.QUESTION_LANG, CONSTANTS.DEFAULT_VALUES.QUESTION_LANG);
        const savedAnswerLang = Storage.load(CONSTANTS.STORAGE_KEYS.ANSWER_LANG, CONSTANTS.DEFAULT_VALUES.ANSWER_LANG);

        quizLanguages.forEach(language => {
            console.log('Adding quiz language:', language.code, language.name);

            // Question language radio
            const questionLabel = document.createElement('label');
            questionLabel.innerHTML = `
    <input type="radio" name="questionLang" value="${language.code}"
        ${savedQuestionLang === language.code ? 'checked' : ''}>
        ${language.name}
        `;
            questionGroup.appendChild(questionLabel);

            // Answer language radio
            const answerLabel = document.createElement('label');
            answerLabel.innerHTML = `
        <input type="radio" name="answerLang" value="${language.code}"
            ${savedAnswerLang === language.code ? 'checked' : ''}>
            ${language.name}
            `;
            answerGroup.appendChild(answerLabel);
        });

        // ADD THIS: Re-bind quiz language events after rendering
        this.bindQuizLanguageEvents();
    },

    bindLanguageEvents() {
        // Language checkbox events
        AppConfig.availableLanguages.forEach(language => {
            const displayCheckbox = document.getElementById(`display_${language.code}`);
            const speakCheckbox = document.getElementById(`speak_${language.code}`);

            if (displayCheckbox) {
                displayCheckbox.addEventListener('change', (e) => {
                    Storage.save(`display_${language.code}`, e.target.checked ? '1' : '0');
                    AppController.renderExample();
                    ScreenReader.announce(`${language.name} display ${e.target.checked ? 'enabled' : 'disabled'}`);
                });
            }

            if (speakCheckbox) {
                speakCheckbox.addEventListener('change', (e) => {
                    Storage.save(`speak_${language.code}`, e.target.checked ? '1' : '0');
                    ScreenReader.announce(`${language.name} speech ${e.target.checked ? 'enabled' : 'disabled'}`);
                });
            }
        });

        // Bind quiz language events
        this.bindQuizLanguageEvents();
    },

    // NEW METHOD: Bind quiz language change events
    bindQuizLanguageEvents() {
        // Quiz question language radio events
        document.querySelectorAll('input[name="questionLang"]').forEach(radio => {
            // Remove any existing event listeners to prevent duplicates
            radio.replaceWith(radio.cloneNode(true));
        });

        document.querySelectorAll('input[name="questionLang"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                Storage.save(CONSTANTS.STORAGE_KEYS.QUESTION_LANG, e.target.value);
                const lang = AppConfig.getLanguage(e.target.value);
                ScreenReader.announce(`Question language set to ${lang?.name || e.target.value}`);

                // ADD THIS: Refresh the quiz when question language changes
                QuizSystem.refreshQuiz();
            });
        });

        // Quiz answer language radio events
        document.querySelectorAll('input[name="answerLang"]').forEach(radio => {
            // Remove any existing event listeners to prevent duplicates
            radio.replaceWith(radio.cloneNode(true));
        });

        document.querySelectorAll('input[name="answerLang"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                Storage.save(CONSTANTS.STORAGE_KEYS.ANSWER_LANG, e.target.value);
                const lang = AppConfig.getLanguage(e.target.value);
                ScreenReader.announce(`Answer language set to ${lang?.name || e.target.value}`);

                // ADD THIS: Refresh the quiz when answer language changes
                QuizSystem.refreshQuiz();
            });
        });
    },

    getDisplayLanguages() {
        return AppConfig.getDisplayLanguages();
    },

    getSpeakLanguages() {
        return AppConfig.getSpeakLanguages();
    },

    getQuizLanguages() {
        return AppConfig.quizEnabledLanguages;
    }
};

const SettingsManager = {
    show() {
        const contentArea = document.getElementById('contentArea');
        const controlsArea = document.getElementById('controlsArea');
        contentArea.innerHTML = this.getSettingsHTML();
        controlsArea.innerHTML = '';
        this.bindSettingsEvents();
        this.showInitialTTSStatus();
    },

    getSettingsHTML() {
        return `
            <div style="display: flex; justify-content: space-between; align-items: center;
                                background: #00247D; color: white; padding: 0.5em 1em; border-radius: 8px;">
                <h2 style="margin: 0;">Settings & Help</h2>
                <button id="closeX" aria-label="Close settings" style="background: #666; color: white; border: none; padding: 0.5em; border-radius: 4px; cursor: pointer;">❌</button>
            </div>

            <div class="settings-content" style="padding: 1em;">
                <div class="settings-font-controls">
                    <label style="margin: 0;">
                        Thai Font:
                        <select id="settingsThaiFont" aria-label="Select Thai font">
                            <option value="">Default</option>
                            <option value="Tahoma">Tahoma</option>
                            <option value="Noto Sans Thai">Noto Sans Thai</option>
                            <option value="Chakra Petch">Chakra Petch</option>
                        </select>
                    </label>
                </div>
                <div class="font-preview" id="fontPreview" aria-live="polite">ตัวอย่างข้อความภาษาไทย (Thai Text Sample)</div>

                <div class="settings-section">
                    <h3>Text-to-Speech Setup</h3>
                    <p>This App uses Text To Speech. Search in your device and your browser settings for languages and install the required language packs and enable Text To Speech. Then try the Test TTS button for more specific help for your device.</p>

                    <button id="checkTTS" class="settings-button" style="padding: 0.8em 1.5em; background: #00247D; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 1em 0;">
                        🔊 Test TTS Setup & Language Support
                    </button>

                    <div id="ttsStatus"></div>
                    <div id="ttsSetupInstructions"></div>
                    <div id="languageTests"></div>
                </div>

                <div class="settings-section">
                    <details class="keyboard-shortcuts-panel">
                        <summary style="font-weight: bold; font-size: 1.1em; cursor: pointer;">Keyboard Shortcuts</summary>
                        <div class="keyboard-shortcuts">
                            <div class="shortcut-item">
                                <span>Play/Pause</span>
                                <kbd class="shortcut-key">Space</kbd>
                            </div>
                            <div class="shortcut-item">
                                <span>Next Example</span>
                                <kbd class="shortcut-key">→</kbd>
                            </div>
                            <div class="shortcut-item">
                                <span>Previous Example</span>
                                <kbd class="shortcut-key">←</kbd>
                            </div>
                            <div class="shortcut-item">
                                <span>Restart</span>
                                <kbd class="shortcut-key">R</kbd>
                            </div>
                            <div class="shortcut-item">
                                <span>Next Question</span>
                                <kbd class="shortcut-key">N</kbd>
                            </div>
                            <div class="shortcut-item">
                                <span>Settings</span>
                                <kbd class="shortcut-key">S</kbd>
                            </div>
                        </div>
                    </details>
                </div>

                <div style="margin-top: 2em; padding-top: 1em; border-top: 1px solid var(--border-light);">
                    <button id="closeBtn" style="padding: 0.6em 1.2em; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer;">Close Settings</button>
                </div>
            </div>`;
    },

    bindSettingsEvents() {
        document.getElementById('closeX').addEventListener('click', this.close);
        document.getElementById('closeBtn').addEventListener('click', this.close);
        document.getElementById('checkTTS').addEventListener('click', () => this.performTTSCheck());

        const settingsThaiFont = document.getElementById('settingsThaiFont');
        if (settingsThaiFont) {
            settingsThaiFont.value = Storage.load(CONSTANTS.STORAGE_KEYS.THAI_FONT, '');
            settingsThaiFont.addEventListener('change', (e) => {
                Storage.save(CONSTANTS.STORAGE_KEYS.THAI_FONT, e.target.value);
                FontManager.apply(); // Apply immediately when font changes
                ScreenReader.announce(`Thai font changed to ${e.target.value || 'default'}`);
            });
        }
    },

    close() {
        const contentArea = document.getElementById('contentArea');
        const controlsArea = document.getElementById('controlsArea');

        contentArea.innerHTML = AppController.getMainHTML();
        controlsArea.innerHTML = AppController.getControlsHTML();

        AppController.bindUIElements();
        AppController.restoreSettings();
        AppController.loadTopics();
        ScreenReader.announce('Settings closed, returning to main view');
    },

    showInitialTTSStatus() {
        const status = TTSManager.getStatusMessage?.();
        this.showTTSStatus(status);

        if (status?.type !== 'success') {
            const instructions = TTSManager.getSetupInstructions?.();
            document.getElementById('ttsSetupInstructions').innerHTML = instructions;
        }
    },

    async performTTSCheck() {
        const ttsStatus = document.getElementById('ttsStatus');
        const checkBtn = document.getElementById('checkTTS');
        const languageTests = document.getElementById('languageTests');

        checkBtn.innerHTML = '<span class="loading-spinner"></span> Testing TTS...';
        checkBtn.disabled = true;
        ttsStatus.innerHTML = '';
        languageTests.innerHTML = '';

        const testPassed = await TTSManager.comprehensiveTest();
        this.showLanguageTestResults();

        if (!testPassed) {
            const instructions = TTSManager.getSetupInstructions?.();
            document.getElementById('ttsSetupInstructions').innerHTML = instructions;
        }

        checkBtn.innerHTML = '✅ TTS Test Complete';
        checkBtn.disabled = false;

        const finalStatus = TTSManager.getStatusMessage?.();
        this.showTTSStatus(finalStatus);
    },

    showTTSStatus(status) {
        const ttsStatus = document.getElementById('ttsStatus');
        if (!status || !ttsStatus) return;

        const statusClass = `tts-status-${status.type === 'warning' ? 'info' : status.type}`;
        ttsStatus.innerHTML = `
            <div class="tts-status-container ${statusClass}">
                <h4 style="margin: 0 0 0.5em 0;">${status.title}</h4>
                <p style="margin: 0;">${status.message}</p>
            </div>
            `;
    },

    showLanguageTestResults() {
        const languageTests = document.getElementById('languageTests');
        const results = TTSManager.testResults;

        if (!languageTests || Object.keys(results).length === 0) return;

        let html = `<h4>Language Test Results:</h4><div class="tts-language-check">`;

        for (const [lang, result] of Object.entries(results)) {
            const language = AppConfig.getLanguage(lang);
            const icon = result.success ? '✅' : '❌';
            const resultClass = result.success ? 'success-check' : 'error-cross';
            const voices = result.voices ? result.voices.map(v => v.name).join(', ') : 'No voices';

            html += `
                <div style="flex: 1; min-width: 200px; padding: 1em; background: rgba(0,0,0,0.05); border-radius: 8px;">
                    <div style="font-weight: bold;">${icon} ${language?.name || lang}</div>
                    <div class="test-result ${resultClass}">
                        ${result.success ?
                    `<div class="success-list">Working - Available voices:<br>${voices}</div>` :
                    `Failed: ${result.error}. ${this.getLanguageSpecificHelp(lang, result.error)}`
                }
                    </div>
                    <button onclick="testSingleLanguage('${lang}', '${result.text}')"
                        class="language-test"
                        style="margin-top: 0.5em;">
                        Test ${language?.name || lang} Again
                    </button>
                </div>
                `;
        }

        html += `</div>`;
        languageTests.innerHTML = html;
    },

    getLanguageSpecificHelp(lang, error) {
        const language = AppConfig.getLanguage(lang);
        const helpMessages = {
            'th-TH': `To fix Thai TTS: Install Thai language pack in system settings, then restart browser.`,
            'fa-IR': `To fix Persian TTS: Install Persian/Farsi language pack in system settings.`,
            'en-US': `To fix English TTS: Check system language settings and ensure English TTS is enabled.`,
            'ja-JP': `To fix Japanese TTS: Install Japanese language pack in system settings and enable Japanese text-to-speech.`
        };

        return helpMessages[lang] || `Please check your system language settings and install the ${language?.name || lang} language pack.`;
    }
};

// Global function for testing individual languages
window.testSingleLanguage = async function (lang, text) {
    const language = AppConfig.getLanguage(lang);
    const result = await TTSManager.testLanguage(lang, text);
    alert(`${language?.name || lang} TTS Test: ${result.success ? 'SUCCESS' : 'FAILED'}\n${result.success ? 'Voice is working properly' : 'Error: ' + result.error}`);
};

// ========== TOPIC MANAGEMENT ==========
const TopicManager = {
    cache: new Map(),

    async loadTopicList() {
        try {
            const topicList = await NetworkManager.fetchJSON('/assets/bhasa/topics/topicList.json');
            return topicList.map(topic => ({
                topicFilename: topic.topicFilename,
                topic: topic.topic,
                description: topic.description,
                languageCount: topic.languageCount,
                exampleCount: topic.exampleCount,
                difficulty: topic.difficulty
            }));
        } catch (error) {
            console.error('Error loading topic list:', error);
            ErrorHandler.showErrorToUser('Failed to load topics. Please check your connection.');
            return [];
        }
    },

    async loadTopic(filename) {
        if (this.cache.has(filename)) {
            return this.cache.get(filename);
        }

        try {
            const topicData = await NetworkManager.fetchJSON(`/assets/bhasa/topics/${filename}`);
            const processedData = this.processTopicData(topicData);
            this.cache.set(filename, processedData);
            return processedData;
        } catch (error) {
            console.error('Error loading topic:', error);
            throw error;
        }
    },

    processTopicData(topicData) {
        // Handle both old and new format for backward compatibility during transition
        const isNewFormat = topicData.metadata && topicData.titles;

        if (isNewFormat) {
            return {
                topic: topicData.metadata.topic,
                description: topicData.metadata.description,
                titles: topicData.titles.map(titleItem => ({
                    title: titleItem.title,
                    description: titleItem.description,
                    examples: titleItem.examples.map(example => ({
                        // Support both new translations object and old flat structure
                        ...example.translations,
                        translations: example.translations,
                        metadata: example.metadata,
                        id: example.id
                    }))
                })),
                metadata: topicData.metadata
            };
        } else {
            // Old format - convert to new structure
            return {
                topic: topicData.topic,
                titles: topicData.titles?.map(titleItem => ({
                    title: titleItem.title,
                    examples: titleItem.examples?.map((example, index) => ({
                        ...example,
                        translations: example,
                        metadata: {
                            difficulty: 1,
                            category: 'general',
                            notes: ''
                        },
                        id: `auto-${index}`
                    })) || []
                })) || [],
                metadata: {
                    topic: topicData.topic,
                    description: '',
                    languageCount: 4,
                    exampleCount: topicData.titles?.reduce((count, title) => count + (title.examples?.length || 0), 0) || 0,
                    difficulty: 'beginner',
                    version: '1.0'
                }
            };
        }
    },

    clearCache() {
        this.cache.clear();
    }
};

// ========== EXAMPLE RENDERING ==========
const ExampleRenderer = {
    display: null,

    init(displayElement) {
        this.display = displayElement;
    },

    render(example) {
        if (!this.display) return;

        const fragment = document.createDocumentFragment();

        if (!example || (Array.isArray(example) && example.length === 0)) {
            this.display.textContent = 'No example content available.';
            return;
        }

        // Handle both array format (new) and object format (old) for backward compatibility
        if (Array.isArray(example)) {
            // New format: array of word objects
            example.forEach((word, index) => {
                this.renderWordOrNewline(word, index, fragment);
            });
        } else if (typeof example === 'object' && example.translations) {
            // Old format with translations object containing arrays
            const words = this.flattenTranslationsToWords(example.translations);
            words.forEach((word, index) => {
                this.renderWordOrNewline(word, index, fragment);
            });
        } else {
            console.error('Unexpected example format:', example);
            this.display.textContent = 'Invalid example format.';
            return;
        }

        this.display.innerHTML = '';
        this.display.appendChild(fragment);
        this.applyLanguageStyling();
    },

    renderWordOrNewline(word, index, fragment) {
        if (this.isNewline(word)) {
            fragment.appendChild(document.createElement('br'));
            return;
        }

        const pairDiv = document.createElement('div');
        pairDiv.className = 'word-pair performance-optimized';
        pairDiv.dataset.index = index;
        pairDiv.dataset.wordId = word.id || `word-${index}`;

        // Get display languages from configuration
        const displayLanguages = LanguageManager.getDisplayLanguages();

        // Render each display language for this word
        displayLanguages.forEach(language => {
            const text = word[language.code];
            if (text && text !== "\n" && text.trim() !== '') {
                const span = document.createElement('span');
                span.textContent = text;
                span.lang = language.code;
                span.dataset.index = index;
                span.dataset.language = language.code;
                span.tabIndex = 0;
                span.setAttribute('role', 'button');
                span.setAttribute('aria-label', `Speak ${language.name}: ${text}`);

                // Apply language-specific styling
                span.classList.add(`language-font-${language.code}`);
                if (language.rtl) {
                    span.setAttribute('dir', 'rtl');
                }

                // Ensure Thai elements get the thai-font class
                if (language.code === 'th-TH' || language.code === 'th') {
                    span.classList.add('thai-font');
                }

                span.onclick = () => {
                    if (Storage.loadBool(`speak_${language.code}`, language.defaultSpeak)) {
                        PlaybackController.playWord(text, language.code, span, index);
                    }
                };

                span.onkeydown = (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        span.click();
                    }
                };

                pairDiv.appendChild(span);
            }
        });

        if (pairDiv.children.length > 0) {
            fragment.appendChild(pairDiv);
        }
    },

    // Helper method to convert old translation format to word array format
    flattenTranslationsToWords(translations) {
        const languages = Object.keys(translations);
        const maxLength = Math.max(...languages.map(lang => {
            const content = translations[lang];
            return Array.isArray(content) ? content.length : 1;
        }));

        const words = [];
        for (let i = 0; i < maxLength; i++) {
            const word = {};
            languages.forEach(lang => {
                const content = translations[lang];
                if (Array.isArray(content)) {
                    word[lang] = content[i] || '';
                } else {
                    // Handle single string by splitting into words or using entire string
                    word[lang] = i === 0 ? content : '';
                }
            });
            words.push(word);
        }
        return words;
    },

    isNewline(word) {
        // Check if all translations are newlines or empty
        const displayLanguages = LanguageManager.getDisplayLanguages();
        return displayLanguages.every(language => {
            const text = word[language.code];
            return text === "\n" || (text && text.trim() === '');
        });
    },

    applyLanguageStyling() {
        // Apply RTL and font styling to all language elements
        AppConfig.availableLanguages.forEach(language => {
            const elements = this.display.querySelectorAll(`[lang="${language.code}"]`);
            elements.forEach(el => {
                el.classList.add(`language-font-${language.code}`);
                if (language.rtl) {
                    el.setAttribute('dir', 'rtl');
                }
            });
        });
    },

    clearHighlights() {
        if (!this.display) return;
        this.display.querySelectorAll('.word-pair').forEach(pair => {
            pair.classList.remove('highlight-light', 'highlight-dark');
            pair.style.background = '';
        });
    },

    highlightWord(index) {
        this.clearHighlights();
        const wordPair = this.display.querySelector(`.word-pair[data-index="${index}"]`);
        if (wordPair) {
            const themeClass = document.body.dataset.theme === 'dark' ? 'highlight-dark' : 'highlight-light';

            // FIX: Only highlight the first language span instead of the entire word-pair
            const firstLanguageSpan = wordPair.querySelector('span[lang]');
            if (firstLanguageSpan) {
                firstLanguageSpan.classList.add(themeClass);
                // Also set background for visual emphasis
                firstLanguageSpan.style.background = document.body.dataset.theme === 'dark' ? 'orange' : 'yellow';
            }

            // Scroll into view
            wordPair.scrollIntoView({ behavior: 'smooth', block: 'center' });

            AppState.lastHighlightedIndex = index;
            ScreenReader.announce(`Highlighted word at position ${index + 1}`);
        }
    },

    clearHighlights() {
        if (!this.display) return;
        // FIX: Clear highlights from spans instead of word-pairs
        this.display.querySelectorAll('.word-pair span[lang]').forEach(span => {
            span.classList.remove('highlight-light', 'highlight-dark');
            span.style.background = '';
        });
    }
};


/* -------------------------------------------------------------
        PATCH – replace the whole PlaybackController definition
        ------------------------------------------------------------- */
const PlaybackController = {
    /* -----------------------------------------------------------------
       State used by the controller
       ----------------------------------------------------------------- */
    currentTimeout: null,   // timeout handle for the inter‑word delay
    currentSentence: [],     // array of word‑objects that will be spoken
    isPlaying: false,  // true while the example is running
    isPaused: false,  // true while the user has hit “Pause”
    currentWordIndex: 0,      // index inside currentSentence
    currentLanguageIndex: 0,    // index inside the list of speak‑languages

    /* -----------------------------------------------------------------
       Public entry point – called when the user clicks the Play button
       ----------------------------------------------------------------- */
    async playExample() {
        // If we are already playing → pause (toggle behaviour)
        if (this.isPlaying && !this.isPaused) {
            this.pauseExample();
            return;
        }

        // If we are paused → resume
        if (this.isPaused) {
            this.resumeExample();
            return;
        }

        // -----------------------------------------------------------------
        // Fresh start – build the sentence that will be spoken
        // -----------------------------------------------------------------
        const example = AppState.getCurrentExample();
        if (!example || (Array.isArray(example) && example.length === 0)) return;

        this.isPlaying = true;
        this.isPaused = false;
        this.currentSentence = this.prepareSentenceForPlayback(example);
        this.currentWordIndex = 0;
        this.currentLanguageIndex = 0;
        AppState.currentWordIndex = 0;

        ScreenReader.announce('Playback started');
        ExampleRenderer.clearHighlights();

        // Kick‑off the recursive loop
        await this.playbackLoop();
    },

    /* -----------------------------------------------------------------
       Pause – stops the timer and cancels any ongoing utterance
       ----------------------------------------------------------------- */
    pauseExample() {
        this.isPaused = true;
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
            this.currentTimeout = null;
        }
        TTSManager.cancel();                 // stops the current utterance
        ScreenReader.announce('Playback paused');
    },

    /* -----------------------------------------------------------------
       Resume – continues from where we left off
       ----------------------------------------------------------------- */
    resumeExample() {
        if (!this.isPaused) return;          // nothing to do
        this.isPaused = false;
        this.isPlaying = true;
        ScreenReader.announce('Playback resumed');
        this.playbackLoop();                  // continue the loop
    },

    /* -----------------------------------------------------------------
       Restart – clears everything and starts from the first word
       ----------------------------------------------------------------- */
    restartExample() {
        this.stopPlayback();
        ExampleRenderer.clearHighlights();
        this.currentWordIndex = 0;
        this.currentLanguageIndex = 0;
        AppState.currentWordIndex = 0;
        this.playExample();
    },

    /* -----------------------------------------------------------------
       Stop – used by Restart and by the internal clean‑up logic
       ----------------------------------------------------------------- */
    stopPlayback() {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentLanguageIndex = 0;
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
            this.currentTimeout = null;
        }
        TTSManager.cancel();
    },

    /* -----------------------------------------------------------------
       The heart of the feature – a tiny state‑machine that walks
       through the sentence word‑by‑word and language‑by‑language.
       ----------------------------------------------------------------- */
    async playbackLoop() {
        // -------------------------------------------------------------
        // 1️⃣  Has playback been stopped? → clean up and exit
        // -------------------------------------------------------------
        if (!this.isPlaying) {
            this.cleanupPlayback();
            return;
        }

        // -------------------------------------------------------------
        // 2️⃣  Are we paused? → poll every 200 ms until the user resumes
        // -------------------------------------------------------------
        if (this.isPaused) {
            setTimeout(() => this.playbackLoop(), 200);
            return;
        }

        // -------------------------------------------------------------
        // 3️⃣  End of sentence? → finish
        // -------------------------------------------------------------
        if (this.currentWordIndex >= this.currentSentence.length) {
            this.completePlayback();
            return;
        }

        // -------------------------------------------------------------
        // 4️⃣  Play the current word (all enabled languages)
        // -------------------------------------------------------------
        const word = this.currentSentence[this.currentWordIndex];
        const displayIndex = this.getDisplayIndexForWord(this.currentWordIndex);

        // Highlight the word that is about to be spoken
        ExampleRenderer.highlightWord(displayIndex);

        // Speak every language that the user has turned on
        await this.speakAllLanguagesForWord(word);

        // -------------------------------------------------------------
        // 5️⃣  Move on to the next word
        // -------------------------------------------------------------
        this.currentWordIndex++;
        this.currentLanguageIndex = 0;               // reset language counter
        AppState.currentWordIndex = this.currentWordIndex;

        // -------------------------------------------------------------
        // 6️⃣  Wait the user‑defined delay, then recurse
        // -------------------------------------------------------------
        const delay = this.getPlaybackDelay();       // ms (minimum 500 ms)
        this.currentTimeout = setTimeout(() => this.playbackLoop(), delay);
    },

    /* -----------------------------------------------------------------
       Speak every language that the user has ticked “Speak”.
       The function respects the pause/stop flags – if playback is stopped
       or paused in the middle of a word it returns early so that the
       loop can react correctly.
       ----------------------------------------------------------------- */
    async speakAllLanguagesForWord(word) {
        const speakLanguages = LanguageManager.getSpeakLanguages();

        for (let i = this.currentLanguageIndex; i < speakLanguages.length; i++) {
            const language = speakLanguages[i];

            // Abort if playback has been stopped
            if (!this.isPlaying) {
                console.log('Playback stopped before speaking language:', language.code);
                return;
            }

            // Remember where we stopped so that a later resume can continue
            if (this.isPaused) {
                this.currentLanguageIndex = i;      // next time we start with this language
                return;
            }

            const text = word[language.code];
            if (text && text !== "\n" && text.trim() !== '') {
                const ok = await this.speakWord(text, language.code);
                // Even if a particular TTS call fails we keep going – the
                // user still gets the remaining languages.
                if (!ok) console.warn(`TTS failed for ${language.code}`);
            }

            // Small pause between languages (makes the speech sound less
            // rushed).  No pause after the last language.
            if (i < speakLanguages.length - 1) {
                await new Promise(r => setTimeout(r, 200));
            }
        }

        // All languages for this word finished – reset for the next word
        this.currentLanguageIndex = 0;
    },

    /* -----------------------------------------------------------------
       Turn the raw example object (old or new format) into an array of
       word‑objects that contain a key for every language.
       ----------------------------------------------------------------- */
    prepareSentenceForPlayback(example) {
        if (!example) return [];

        // New format – already an array of word objects
        if (Array.isArray(example)) return example;

        // Old format – an object with a “translations” map
        if (example.translations && typeof example.translations === 'object')
            return this.flattenTranslationsToWords(example.translations);

        // Single word object – wrap it in an array
        return [example];
    },

    flattenTranslationsToWords(translations) {
        const langs = Object.keys(translations);
        const maxLen = Math.max(...langs.map(l => {
            const c = translations[l];
            return Array.isArray(c) ? c.length : 1;
        }));

        const words = [];
        for (let i = 0; i < maxLen; i++) {
            const w = {};
            langs.forEach(l => {
                const c = translations[l];
                w[l] = Array.isArray(c) ? (c[i] ?? '') : (i === 0 ? c : '');
            });
            words.push(w);
        }
        return words;
    },

    /* -----------------------------------------------------------------
       Helper: map the internal word index to the index that the UI uses.
       (At the moment they are the same, but keeping the indirection
       makes future tweaks easier.)
       ----------------------------------------------------------------- */
    getDisplayIndexForWord(wordIndex) {
        return wordIndex;
    },

    /* -----------------------------------------------------------------
       User‑configurable delay (seconds → milliseconds, minimum 500 ms)
       ----------------------------------------------------------------- */
    getPlaybackDelay() {
        const d = parseFloat(Storage.load(
            CONSTANTS.STORAGE_KEYS.PLAYBACK_DELAY,
            CONSTANTS.DEFAULT_VALUES.PLAYBACK_DELAY
        ));
        return Math.max(500, d * 1000);
    },

    /* -----------------------------------------------------------------
       Low‑level wrapper around the Web Speech API.
       Returns a promise that resolves **true** when the utterance ends
       (or when it times‑out) and **false** on error.
       ----------------------------------------------------------------- */
    speakWord(text, lang) {
        return new Promise(resolve => {
            if (!text || text === "\n" || text.trim() === '') {
                resolve(true);
                return;
            }

            try {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = lang;
                utterance.volume = 0.8;
                utterance.rate = 0.9;
                utterance.pitch = 1.0;

                let finished = false;

                const finish = ok => {
                    if (finished) return;
                    finished = true;
                    clearTimeout(timeoutId);
                    resolve(ok);
                };

                utterance.onend = () => finish(true);
                utterance.onerror = () => finish(false);

                // Safety net – if the browser never fires onend/onerror
                const timeoutId = setTimeout(() => {
                    console.warn(`TTS timeout for ${lang}`);
                    finish(false);
                }, 5000); // 5 s

                speechSynthesis.speak(utterance);
            } catch (e) {
                console.error('speakWord error:', e);
                resolve(false);
            }
        });
    },

    /* -----------------------------------------------------------------
       Cleanup helpers – called when playback finishes or is aborted
       ----------------------------------------------------------------- */
    cleanupPlayback() {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentWordIndex = 0;
        this.currentLanguageIndex = 0;
        AppState.currentWordIndex = 0;
        ExampleRenderer.clearHighlights();
    },

    completePlayback() {
        this.cleanupPlayback();
        ScreenReader.announce('Playback completed');
    },

    /* -----------------------------------------------------------------
       Click‑handler for a single word (used by the UI)
       ----------------------------------------------------------------- */
    playWord(text, lang, element, index) {
        if (!text || text.trim() === '') return;

        ExampleRenderer.clearHighlights();
        const themeCls = document.body.dataset.theme === 'dark' ? 'highlight-dark' : 'highlight-light';
        element.classList.add(themeCls);
        element.style.background = document.body.dataset.theme === 'dark' ? 'orange' : 'yellow';

        this.speakWord(text, lang);
        ScreenReader.announce(`Speaking: ${text}`);
    }
};
/* -------------------------------------------------------------
   END OF PATCH – the rest of the file stays unchanged
   ------------------------------------------------------------- */

const QuizSystem = {
    data: [],
    currentQuestion: 0,
    score: 0,
    attempts: 0,
    incorrectOnly: false,

    buildFromExample(example) {
        if (!example) {
            console.warn('No example data provided for quiz');
            this.data = [];
            this.render();
            return;
        }

        try {
            // Convert example data to quiz format - handle both array and object formats
            this.data = this.convertExampleToQuestions(example);
            this.currentQuestion = 0;
            this.score = 0;
            this.attempts = 0;
            this.render();
        } catch (error) {
            console.error('Error building quiz from example:', error);
            this.data = [];
            this.render();
        }
    },

    convertExampleToQuestions(example) {
        const questions = [];
        const questionLang = Storage.load(CONSTANTS.STORAGE_KEYS.QUESTION_LANG, CONSTANTS.DEFAULT_VALUES.QUESTION_LANG);
        const answerLang = Storage.load(CONSTANTS.STORAGE_KEYS.ANSWER_LANG, CONSTANTS.DEFAULT_VALUES.ANSWER_LANG);

        // Handle different example formats
        let words = [];

        if (Array.isArray(example)) {
            // New format: array of word objects
            words = example;
        } else if (example.translations && typeof example.translations === 'object') {
            // Old format with translations object
            words = this.flattenTranslationsToWords(example.translations);
        } else if (typeof example === 'object') {
            // Single word object - wrap in array
            words = [example];
        } else {
            console.warn('Unexpected example format for quiz:', example);
            return [];
        }

        // Filter out newlines and empty words
        const validWords = words.filter(word => {
            if (!word || typeof word !== 'object') return false;

            const hasQuestionText = word[questionLang] && word[questionLang].trim() !== '';
            const hasAnswerText = word[answerLang] && word[answerLang].trim() !== '';
            return hasQuestionText && hasAnswerText;
        });

        if (validWords.length === 0) {
            console.warn('No valid words found for quiz in current languages');
            console.log('Available words:', words);
            console.log('Question lang:', questionLang, 'Answer lang:', answerLang);
            return [];
        }

        // Create questions from each word
        validWords.forEach((word, index) => {
            const question = {
                id: `q-${index}`,
                [questionLang]: word[questionLang],
                [answerLang]: word[answerLang],
                translations: word,
                attempted: false,
                correct: false,
                options: this.generateOptions(validWords, index, answerLang)
            };
            questions.push(question);
        });

        console.log(`Created ${questions.length} quiz questions`);
        return questions;
    },

    // Helper method to convert old translation format to word array format
    flattenTranslationsToWords(translations) {
        const languages = Object.keys(translations);
        const maxLength = Math.max(...languages.map(lang => {
            const content = translations[lang];
            return Array.isArray(content) ? content.length : 1;
        }));

        const words = [];
        for (let i = 0; i < maxLength; i++) {
            const word = {};
            languages.forEach(lang => {
                const content = translations[lang];
                if (Array.isArray(content)) {
                    word[lang] = content[i] || '';
                } else {
                    // Handle single string by splitting into words or using entire string
                    word[lang] = i === 0 ? content : '';
                }
            });
            words.push(word);
        }
        return words;
    },

    generateOptions(words, correctIndex, answerLang) {
        const correctAnswer = words[correctIndex][answerLang];
        const options = [correctAnswer];

        // Get 3 random incorrect options
        const otherWords = words.filter((_, index) => index !== correctIndex);
        const shuffled = [...otherWords].sort(() => 0.5 - Math.random());
        const incorrectOptions = shuffled.slice(0, 3).map(word => word[answerLang]);

        options.push(...incorrectOptions);

        // Shuffle all options
        return options.sort(() => 0.5 - Math.random());
    },

    render() {
        const quizContainer = document.getElementById('quiz');
        if (!quizContainer) return;

        const filteredQuestions = this.getFilteredQuestions();

        if (filteredQuestions.length === 0) {
            if (this.incorrectOnly) {
                this.showNoIncorrectMessage(quizContainer);
            } else {
                this.showCompletionMessage(quizContainer);
            }
            return;
        }

        const currentQ = filteredQuestions[this.currentQuestion];
        const questionLang = Storage.load(CONSTANTS.STORAGE_KEYS.QUESTION_LANG, CONSTANTS.DEFAULT_VALUES.QUESTION_LANG);
        const answerLang = Storage.load(CONSTANTS.STORAGE_KEYS.ANSWER_LANG, CONSTANTS.DEFAULT_VALUES.ANSWER_LANG);

        const questionText = currentQ[questionLang] || currentQ.translations?.[questionLang] || 'No question text available';
        const options = currentQ.options || [];

        quizContainer.innerHTML = `
            <div class="quiz-heading">Translate this word:</div>
            <div class="quiz-question" lang="${questionLang}">${this.escapeHTML(questionText)}</div>
            <div class="quiz-options">
                ${options.map((option, index) => `
                    <div class="quiz-option ${currentQ.attempted ? (option === currentQ[answerLang] ? 'correct' : 'incorrect') : ''}" 
                         data-option="${this.escapeHTML(option)}"
                         onclick="QuizSystem.handleAnswer(this, '${this.escapeHTML(option)}', ${this.currentQuestion}, '${answerLang}')">
                        ${this.escapeHTML(option)}
                    </div>
                `).join('')}
            </div>
            `;

        // Update progress indicator
        const progressText = `Question ${this.currentQuestion + 1} of ${filteredQuestions.length}`;
        ScreenReader.announce(progressText);
    },

    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    getFilteredQuestions() {
        if (this.incorrectOnly) {
            return this.data.filter(q => q.attempted && !q.correct);
        }
        return this.data.filter(q => !q.attempted || !this.incorrectOnly);
    },

    showNoIncorrectMessage(container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2em; color: var(--text-light);">
                <p>🎉 No incorrect answers! Great job!</p>
                <p>Uncheck "Incorrect Only" to practice all questions again.</p>
            </div>
        `;
    },

    showCompletionMessage(container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2em; color: var(--text-light);">
                <p>✅ Quiz completed!</p>
                <p>Score: ${this.score}/${this.attempts}</p>
                <p>Click "Retry Quiz" to practice again.</p>
            </div>
        `;
    },

    handleAnswer(optionEl, selectedOption, questionIndex, answerLang) {
        const filteredQuestions = this.getFilteredQuestions();
        const question = filteredQuestions[questionIndex];

        if (!question || question.attempted) return;

        const correctAnswer = question[answerLang] || question.translations?.[answerLang];
        const isCorrect = selectedOption === correctAnswer;

        question.attempted = true;
        question.correct = isCorrect;
        this.attempts++;

        if (isCorrect) {
            optionEl.classList.add('correct');
            this.score++;
            ScreenReader.announce(`Correct! ${selectedOption}`);
        } else {
            optionEl.classList.add('incorrect');
            // Highlight correct answer
            const options = document.querySelectorAll('.quiz-option');
            options.forEach(opt => {
                if (opt.textContent === correctAnswer) {
                    opt.classList.add('correct');
                }
            });
            ScreenReader.announce(`Incorrect. The correct answer is ${correctAnswer}`);
        }

        // Update score display
        const scoreElement = document.getElementById("score");
        if (scoreElement) {
            scoreElement.textContent = `Score: ${this.score}/${this.attempts}`;
        }

        // Auto-advance after delay
        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    },

    nextQuestion() {
        const filteredQuestions = this.getFilteredQuestions();
        if (filteredQuestions.length === 0) {
            this.render();
            return;
        }

        if (this.currentQuestion < filteredQuestions.length - 1) {
            this.currentQuestion++;
        } else {
            this.currentQuestion = 0;
        }
        this.render();
    },

    previousQuestion() {
        const filteredQuestions = this.getFilteredQuestions();
        if (filteredQuestions.length === 0) {
            this.render();
            return;
        }

        if (this.currentQuestion > 0) {
            this.currentQuestion--;
        } else {
            this.currentQuestion = filteredQuestions.length - 1;
        }
        this.render();
    },

    retry() {
        this.data.forEach(q => {
            q.attempted = false;
            q.correct = false;
        });
        this.currentQuestion = 0;
        this.score = 0;
        this.attempts = 0;
        this.render();

        const scoreElement = document.getElementById("score");
        if (scoreElement) {
            scoreElement.textContent = `Score: ${this.score}/${this.attempts}`;
        }

        ScreenReader.announce('Quiz reset. Starting over.');
    },

    toggleIncorrectOnly(showIncorrectOnly) {
        this.incorrectOnly = showIncorrectOnly;
        this.currentQuestion = 0;
        this.render();
        ScreenReader.announce(showIncorrectOnly ?
            'Showing only incorrect questions' :
            'Showing all questions'
        );
    },

    refreshQuiz() {
        // Rebuild quiz when languages change
        const currentExample = AppState.getCurrentExample();
        if (currentExample && currentExample.length > 0) {
            this.buildFromExample(currentExample);
        }
    }
};


// ========== NAVIGATION CONTROLLER ==========
const NavigationController = {
    topicSelect: null,
    titleSelect: null,
    exampleSelect: null,

    init(topicSelect, titleSelect, exampleSelect) {
        this.topicSelect = topicSelect;
        this.titleSelect = titleSelect;
        this.exampleSelect = exampleSelect;

        if (topicSelect) {
            topicSelect.addEventListener('change', (e) => this.handleTopicChange(e.target.value));
        }
        if (titleSelect) {
            titleSelect.addEventListener('change', (e) => this.handleTitleChange(+e.target.value));
        }
        if (exampleSelect) {
            exampleSelect.addEventListener('change', (e) => this.handleExampleChange(+e.target.value));
        }
    },

    async handleTopicChange(topicFilename) {
        if (!topicFilename) return;

        try {
            Storage.save(CONSTANTS.STORAGE_KEYS.CURRENT_TOPIC, topicFilename);
            await AppController.loadTopic(topicFilename);
            ScreenReader.announce(`Topic changed to ${topicFilename}`);
        } catch (error) {
            console.error('Error changing topic:', error);
            ScreenReader.announce(`Error changing topic: ${error.message}`);
        }
    },

    handleTitleChange(titleIndex) {
        AppState.currentTitle = titleIndex;
        AppController.populateExamples();
        ScreenReader.announce(`Title changed to ${titleIndex + 1}`);
    },

    handleExampleChange(exampleIndex) {
        AppState.currentExample = exampleIndex;
        AppController.loadExample();
        ScreenReader.announce(`Example changed to ${exampleIndex + 1}`);
    },

    nextExample() {
        const currentTitle = AppState.currentTopic?.titles?.[AppState.currentTitle];
        const maxExamples = currentTitle?.examples?.length || 0;

        if (AppState.currentExample < maxExamples - 1) {
            AppState.currentExample++;
            if (this.exampleSelect) {
                this.exampleSelect.value = AppState.currentExample;
            }
            AppController.loadExample();
        } else {
            const maxTitles = AppState.currentTopic?.titles?.length || 0;
            if (AppState.currentTitle < maxTitles - 1) {
                AppState.currentTitle++;
                AppState.currentExample = 0;
                if (this.titleSelect) {
                    this.titleSelect.value = AppState.currentTitle;
                }
                AppController.populateExamples();
            } else {
                AppState.currentTitle = 0;
                AppState.currentExample = 0;
                if (this.titleSelect) {
                    this.titleSelect.value = AppState.currentTitle;
                }
                AppController.populateExamples();
            }
        }
    },

    previousExample() {
        if (AppState.currentExample > 0) {
            AppState.currentExample--;
            if (this.exampleSelect) {
                this.exampleSelect.value = AppState.currentExample;
            }
            AppController.loadExample();
        } else {
            if (AppState.currentTitle > 0) {
                AppState.currentTitle--;
                const prevTitle = AppState.currentTopic?.titles?.[AppState.currentTitle];
                AppState.currentExample = (prevTitle?.examples?.length || 1) - 1;
                if (this.titleSelect) {
                    this.titleSelect.value = AppState.currentTitle;
                }
                AppController.populateExamples();
            } else {
                const maxTitles = AppState.currentTopic?.titles?.length || 0;
                AppState.currentTitle = maxTitles - 1;
                const lastTitle = AppState.currentTopic?.titles?.[AppState.currentTitle];
                AppState.currentExample = (lastTitle?.examples?.length || 1) - 1;
                if (this.titleSelect) {
                    this.titleSelect.value = AppState.currentTitle;
                }
                AppController.populateExamples();
            }
        }
    }
};

// ========== KEYBOARD SHORTCUT MANAGER ==========
const KeyboardManager = {
    init() {
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    },

    handleKeydown(event) {
        // Don't trigger shortcuts when user is typing in inputs
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        switch (event.key) {
            case ' ':
                event.preventDefault();
                if (AppState.isPlaying) {
                    PlaybackController.pauseExample();
                } else {
                    PlaybackController.playExample();
                }
                break;
            case 'ArrowRight':
                event.preventDefault();
                NavigationController.nextExample();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                NavigationController.previousExample();
                break;
            case 'r':
            case 'R':
                event.preventDefault();
                PlaybackController.restartExample();
                break;
            case 'n':
            case 'N':
                event.preventDefault();
                QuizSystem.nextQuestion();
                break;
            case 's':
            case 'S':
                event.preventDefault();
                if (!document.getElementById('settingsThaiFont')) {
                    SettingsManager.show();
                }
                break;
            case 'Escape':
                if (document.getElementById('settingsThaiFont')) {
                    event.preventDefault();
                    SettingsManager.close();
                }
                break;
        }
    }
};

// ========== MAIN APPLICATION CONTROLLER ==========
// ========== MAIN APPLICATION CONTROLLER ==========
const AppController = {
    async initSPA() {
        // Initialize all managers and components
        ThemeManager.init();
        FontManager.init();
        TTSManager.initialize();
        KeyboardManager.init();

        // Initialize AppState
        AppState.initialize();

        // Load configuration
        await AppConfig.load();

        // Initialize language manager after config is loaded
        LanguageManager.init();

        // Initialize example renderer
        const exampleDisplay = document.getElementById('exampleDisplay');
        if (exampleDisplay) {
            ExampleRenderer.init(exampleDisplay);
        }

        // Load topics and setup navigation
        await this.loadTopics();
        this.bindUIElements();

        // Load initial example
        this.loadExample();

        ScreenReader.announce('Application initialized successfully');
    },

    async init() {
        // Alternative initialization if needed
        await this.initSPA();
    },

    getMainHTML() {
        return `
            <div class="selection-header">Text To Speech</div>

            <!-- Progress Bar -->
            <div style="margin: 0.5em 0;">
                <div class="progress-bar">
                    <div id="progressBar" class="progress-fill" style="width: 0%"></div>
                </div>
            </div>

            <details class="topic-options-details" id="topicOptionsDetails">
                <summary>Topic & Language Options</summary>
                <div class="topic-options-content">
                    <div id="topicSelectionControls" class="topic-selection-controls">
                        <label>Topic: <select id="topicSelect" aria-label="Select topic"></select></label>
                        <label>Title: <select id="titleSelect" aria-label="Select title"></select></label>
                        <label>Example: <select id="exampleSelect" aria-label="Select example"></select></label>
                    </div>

                    <div class="language-controls">
                        <details>
                            <summary style="font-weight: bold;">Language Options</summary>
                            <div class="language-controls-content">
                                <!-- Dynamic Language Grid -->
                                <div class="language-controls-grid">
                                    <div class="language-grid">
                                        <div class="language-grid-header">Language</div>
                                        <div class="language-grid-header">Display</div>
                                        <div class="language-grid-header">Speak</div>
                                        <!-- Language rows will be dynamically inserted here -->
                                    </div>
                                </div>

                                <!-- Playback Delay -->
                                <div class="language-delay-row">
                                    <span class="delay-label">Reading delay (secs)</span>
                                    <input type="number" id="playbackDelay" class="delay-input" value="0.5" min="0.5"
                                        max="5.0" step="1.0" aria-label="Playback delay in seconds">
                                </div>
                            </div>
                        </details>
                    </div>
                </div>
            </details>

            <section id="exampleSec">
                <div id="exampleDisplay" aria-live="polite"></div>
                <div id="exampleControls" class="controls">
                    <div class="example-controls-row">
                        <button id="playBtn" aria-label="Play example" class="touch-target">▶️</button>
                        <button id="pauseBtn" aria-label="Pause example" class="touch-target">⏸️</button>
                        <button id="restartBtn" aria-label="Restart example" class="touch-target">⏮️</button>
                        <div class="example-number-container">
                            <span class="example-number-label">Example</span>
                            <span id="currentExampleNumber" class="example-number">1</span>
                        </div>
                        <button id="prevExample" aria-label="Previous example" class="touch-target">⬅️</button>
                        <button id="nextExample" aria-label="Next example" class="touch-target">➡️</button>
                    </div>
                </div>
            </section>

            <section id="quizSec">
                <h3>Practice Quiz</h3>

                <div id="quiz" aria-live="polite"></div>
                <div id="quizControls">
                    <!-- Dynamic Language selection -->
                    <div class="quiz-row quiz-row-top">
                        <div class="lang-option">
                            <label>Question Language:</label>
                            <div class="radio-group" id="questionLangGroup">
                                <!-- Dynamic radio buttons will be inserted here -->
                            </div>
                        </div>
                        <div class="lang-option">
                            <label>Answer Language:</label>
                            <div class="radio-group" id="answerLangGroup">
                                <!-- Dynamic radio buttons will be inserted here -->
                            </div>
                        </div>
                    </div>

                    <div class="quiz-row quiz-row-bottom">
                        <button id="prevQ" aria-label="Previous question" class="touch-target">⬅️</button>
                        <button id="nextQ" aria-label="Next question" class="touch-target">➡️</button>
                        <button id="retryQuiz" aria-label="Retry quiz" class="touch-target">🔄</button>
                        <span id="score">Score: 0/0</span>
                        <label>
                            <input type="checkbox" id="incorrectOnly" aria-label="Show only incorrect questions">
                                Incorrect Only
                        </label>
                    </div>
                </div>
            </section>`;
    },

    getControlsHTML() {
        return ''; // Controls are handled by individual components
    },

    bindUIElements() {
        // Get navigation elements
        const topicSelect = document.getElementById('topicSelect');
        const titleSelect = document.getElementById('titleSelect');
        const exampleSelect = document.getElementById('exampleSelect');

        // Initialize navigation controller
        NavigationController.init(topicSelect, titleSelect, exampleSelect);

        // Bind playback controls
        const playBtn = document.getElementById('playBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const restartBtn = document.getElementById('restartBtn');
        const prevExample = document.getElementById('prevExample');
        const nextExample = document.getElementById('nextExample');

        if (playBtn) playBtn.addEventListener('click', () => PlaybackController.playExample());
        if (pauseBtn) pauseBtn.addEventListener('click', () => PlaybackController.pauseExample());
        if (restartBtn) restartBtn.addEventListener('click', () => PlaybackController.restartExample());
        if (prevExample) prevExample.addEventListener('click', () => NavigationController.previousExample());
        if (nextExample) nextExample.addEventListener('click', () => NavigationController.nextExample());

        // Bind quiz controls
        const prevQ = document.getElementById('prevQ');
        const nextQ = document.getElementById('nextQ');
        const retryQuiz = document.getElementById('retryQuiz');
        const incorrectOnly = document.getElementById('incorrectOnly');

        if (prevQ) prevQ.addEventListener('click', () => QuizSystem.previousQuestion());
        if (nextQ) nextQ.addEventListener('click', () => QuizSystem.nextQuestion());
        if (retryQuiz) retryQuiz.addEventListener('click', () => QuizSystem.retry());
        if (incorrectOnly) incorrectOnly.addEventListener('change', (e) => QuizSystem.toggleIncorrectOnly(e.target.checked));

        // Bind settings button
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => SettingsManager.show());
        }

        // Bind playback delay
        const playbackDelay = document.getElementById('playbackDelay');
        if (playbackDelay) {
            playbackDelay.value = Storage.load(CONSTANTS.STORAGE_KEYS.PLAYBACK_DELAY, CONSTANTS.DEFAULT_VALUES.PLAYBACK_DELAY);
            playbackDelay.addEventListener('change', (e) => {
                Storage.save(CONSTANTS.STORAGE_KEYS.PLAYBACK_DELAY, e.target.value);
            });
        }
    },

    async loadTopics() {
        try {
            const topics = await TopicManager.loadTopicList();
            AppState.topics = topics;
            this.populateTopicSelect();

            // Load the saved or first topic
            const savedTopic = Storage.load(CONSTANTS.STORAGE_KEYS.CURRENT_TOPIC);
            const topicToLoad = savedTopic || (topics.length > 0 ? topics[0].topicFilename : '');

            if (topicToLoad) {
                await this.loadTopic(topicToLoad);
            }
        } catch (error) {
            console.error('Error loading topics:', error);
            ErrorHandler.showErrorToUser('Failed to load topics. Please check your connection.');
        }
    },

    populateTopicSelect() {
        const topicSelect = document.getElementById('topicSelect');
        if (!topicSelect) return;

        topicSelect.innerHTML = '';
        AppState.topics.forEach((topic, index) => {
            const option = document.createElement('option');
            option.value = topic.topicFilename;
            option.textContent = topic.topic;
            topicSelect.appendChild(option);
        });

        // Set the current topic
        if (AppState.currentTopic?.topicFilename) {
            topicSelect.value = AppState.currentTopic.topicFilename;
        }
    },

    async loadTopic(topicFilename) {
        try {
            const topicData = await TopicManager.loadTopic(topicFilename);
            AppState.currentTopic = topicData;
            AppState.currentTitle = 0;
            AppState.currentExample = 0;

            this.populateTitles();
            this.populateExamples();
            this.loadExample();

            Storage.save(CONSTANTS.STORAGE_KEYS.CURRENT_TOPIC, topicFilename);
        } catch (error) {
            console.error('Error loading topic:', error);
            ErrorHandler.showErrorToUser(`Failed to load topic: ${error.message}`);
        }
    },

    populateTitles() {
        const titleSelect = document.getElementById('titleSelect');
        if (!titleSelect || !AppState.currentTopic) return;

        titleSelect.innerHTML = '';
        AppState.currentTopic.titles.forEach((title, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = title.title || `Title ${index + 1}`;
            titleSelect.appendChild(option);
        });

        titleSelect.value = AppState.currentTitle;
    },

    populateExamples() {
        const exampleSelect = document.getElementById('exampleSelect');
        if (!exampleSelect || !AppState.currentTopic) return;

        const currentTitle = AppState.currentTopic.titles[AppState.currentTitle];
        if (!currentTitle) return;

        exampleSelect.innerHTML = '';
        const examples = currentTitle.examples || [];

        examples.forEach((example, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `Example ${index + 1}`;
            exampleSelect.appendChild(option);
        });

        exampleSelect.value = AppState.currentExample;
    },

    loadExample() {
        AppState.saveNavigation();
        this.renderExample();

        AppState.currentWordIndex = 0;
        AppState.isPlaying = false;
        TTSManager.cancel();

        this.updateExampleNumber();
        this.updateProgressBar();

        // Ensure quiz language options are refreshed
        setTimeout(() => {
            LanguageManager.renderQuizLanguageOptions();
            this.ensureTopicSelectionVisible();
        }, 200);
    },

    renderExample() {
        const currentTitle = AppState.currentTopic?.titles?.[AppState.currentTitle];
        const examples = currentTitle?.examples;
        const example = examples?.[AppState.currentExample] || [];
        ExampleRenderer.render(example);
        QuizSystem.buildFromExample(example);
    },

    updateExampleNumber() {
        const currentExampleNumber = document.getElementById('currentExampleNumber');
        if (currentExampleNumber) {
            currentExampleNumber.textContent = AppState.currentExample + 1;
        }
    },

    updateProgressBar() {
        const progressBar = document.getElementById('progressBar');
        if (!progressBar || !AppState.currentTopic) return;

        const percentage = ProgressTracker.getCompletionPercentage(
            AppState.currentTopic.topicFilename,
            AppState.currentTopic
        );
        progressBar.style.width = `${percentage}%`;
    },

    ensureTopicSelectionVisible() {
        const topicOptionsDetails = document.getElementById('topicOptionsDetails');
        if (topicOptionsDetails && !topicOptionsDetails.open) {
            topicOptionsDetails.open = true;
        }
    },

    restoreSettings() {
        // Restore any settings that need to be applied
        FontManager.apply();

        // Re-initialize navigation
        const topicSelect = document.getElementById('topicSelect');
        const titleSelect = document.getElementById('titleSelect');
        const exampleSelect = document.getElementById('exampleSelect');
        NavigationController.init(topicSelect, titleSelect, exampleSelect);
    }
};
// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    AppController.initSPA();
    AppController.init();
});