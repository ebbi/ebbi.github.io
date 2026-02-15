const App = {
    /* ============================================================================
       STATE & DEFAULTS
    ============================================================================ */
    state: {
        lang: localStorage.getItem('localStorageLang') || 'en',
        theme: localStorage.getItem('localStorageTheme') || 'light',
        font: localStorage.getItem('localStorageFont') || 'font-serif',
        translations: {},
        manifest: null,
        currentDocument: null,
        isAutoScrolling: false,

        media: {
            isPlaying: false,
            currentIndex: 0,
            speed: parseFloat(localStorage.getItem('localStorageSpeed')) || 1,
            delay: parseInt(localStorage.getItem('localStorageDelay')) || 1,
            pitch: parseFloat(localStorage.getItem('localStoragePitch')) || 1,
            voice: localStorage.getItem('localStorageVoice') || '',
            // Merge stored map with defaults so missing languages never disappear
            languageSettings: (() => {
                const defaults = {
                    th: { show: true, repeat: 1 },
                    en: { show: true, repeat: 1 },
                    fa: { show: true, repeat: 1 }
                };
                try {
                    const stored = JSON.parse(localStorage.getItem('localStorageLangMap'));
                    return { ...defaults, ...(stored || {}) };
                } catch (_) {
                    return defaults;
                }
            })()
        },

        scrolledRows: null,
        currentRowId: null,

        grammarSheet: {
            isOpen: false,
            content: null
        },

        srs: {
            items: {},              // All SRS items keyed by ID
            settings: {
                newPerDay: 20,       // Max new cards per day
                reviewsPerDay: 50,    // Max reviews per day
                learningSteps: [1, 10], // Minutes for learning steps
                graduatingInterval: 1,   // Days after first good review
                easyInterval: 4,         // Days for easy cards
                startingEase: 2.5        // Starting ease factor
            },
            stats: {
                totalCards: 0,
                studiedToday: 0,
                dueToday: 0,
                lastStudied: null
            }
        },

        flashcards: {
            currentDeck: null,
            currentIndex: 0,
            showAnswer: false,
            deckType: 'word' // or 'sentence'
        }

    },

    /* ============================================================================
       ERROR LOGGING UTILITIES
    ============================================================================ */
    logError(context, error, additionalData = {}) {
        const timestamp = new Date().toISOString();
        const errorData = {
            timestamp,
            context,
            error: error?.message || String(error),
            stack: error?.stack,
            ...additionalData
        };

        console.error(`[${timestamp}] ${context}:`, errorData);
        return errorData;
    },

    /* ============================================================================
       UTILITIES
    ============================================================================ */

    /**
     * Simple HTML‑escape to avoid XSS when inserting external strings
     * @param {string} str - String to escape
     * @returns {string} Escaped string
     */
    escapeHtml(str) {
        try {
            if (str == null) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        } catch (error) {
            console.error('HTML escape error:', error, 'for input:', str);
            return '';
        }
    },

    /** Cached voice list – filled once `onvoiceschanged` fires */
    cachedVoices: [],

    /**
     * Convert a language code to a sensible locale for SpeechSynthesis
     * @param {string} lang - Language code (e.g., 'th', 'en', 'fa')
     * @returns {string} Locale string for SpeechSynthesis
     */
    getLocaleFor(lang) {
        try {
            const localeMap = { th: 'th-TH', en: 'en-US', fa: 'fa-IR' };
            if (localeMap[lang]) return localeMap[lang];

            // Fallback for unknown languages
            if (typeof lang === 'string' && lang.length >= 2) {
                return `${lang}-${lang.toUpperCase()}`;
            }

            console.warn('Invalid language code:', lang, 'falling back to en-US');
            return 'en-US';
        } catch (error) {
            console.error('Locale generation error:', error, 'for lang:', lang);
            return 'en-US';
        }
    },

    /**
     * Helper to render a single word‑card (used in both paragraph &
     * standalone‑words blocks)
     * @param {Object} wordObj - Word object with translations
     * @param {string} uid - Unique identifier
     * @returns {string} HTML string
     */
    renderWordCard(wordObj, uid) {
        const settings = this.state.media.languageSettings;
        let html = `<div class="word-card">`;

        // Thai source word - ALWAYS RENDER (this is the source text)
        html += `<div class="word-source audio-element"
                 lang="th" dir="ltr"
                 data-text="${this.escapeHtml(wordObj.word)}"
                 data-lang="th"
                 onclick="App.seekAndPlay(this)">${this.escapeHtml(wordObj.word)}</div>`;

        // Translations - render all enabled languages (including Thai if enabled as a translation)
        html += `<div class="word-trans-group">`;
        Object.entries(settings).forEach(([code, config]) => {
            if (config.show && wordObj.translations?.[code]) {
                const dir = code === 'fa' ? 'rtl' : 'ltr';
                html += `<div class="word-trans lang-${code} audio-element"
                         lang="${code}" dir="${dir}"
                         data-text="${this.escapeHtml(wordObj.translations[code])}"
                         data-lang="${code}"
                         onclick="App.seekAndPlay(this)">${this.escapeHtml(wordObj.translations[code])}</div>`;
            }
        });
        html += `</div></div>`;
        return html;
    },

    /**
     * Helper to render a translated sentence span (splits on Unicode
     * punctuation while preserving it)
     * @param {string} text - Translation text
     * @param {string} lang - Language code
     * @param {string} uid - Unique identifier
     * @returns {string} HTML string
     */
    renderTranslationSpan(text, lang, uid) {
        if (!text) return '';

        const dir = lang === 'fa' ? 'rtl' : 'ltr';
        // Split on anything that is NOT a Letter, Mark, Number, or ZWNJ
        const tokens = text.split(/([^\p{L}\p{M}\p{N}\u200c]+)/u);
        let charPos = 0;

        return tokens.map(token => {
            const isWord = /[\p{L}\p{N}]/u.test(token);
            const start = charPos;
            const end = charPos + token.length;
            charPos = end;

            if (isWord) {
                return `<span id="${uid}-${lang}-w-${start}"
                         class="word-span"
                         data-start="${start}"
                         data-end="${end}"
                         lang="${lang}" dir="${dir}">${this.escapeHtml(token)}</span>`;
            }
            return this.escapeHtml(token);
        }).join('');
    },

    /**
     * Render the different block types that appear inside a section.
     * Supported block types:
     * • paragraph – contains one or more sentences, each with optional word‑breakdown
     * • words     – a grid of standalone word cards
     * @param {Array} blocks - Array of block objects
     * @param {number} sectionIndex - Index of the section (for unique IDs)
     * @returns {string} HTML string
     */

    renderBlocks(blocks, sectionIndex = 0) {
        const settings = this.state.media.languageSettings;

        return blocks.map((block, blockIndex) => {
            let blockHtml = `<div class="block-container">`;

            // ------------------------------------------------------------------
            // Paragraph blocks – sentences with source text, optional word list,
            // and per‑language translations.
            // ------------------------------------------------------------------
            if (block.type === 'paragraph') {

                block.elements.forEach((element, elementIndex) => {
                    if (element.type !== 'sentence') return;

                    // ADD sectionIndex to make UID globally unique
                    const uid = `s-${sectionIndex}-${blockIndex}-${elementIndex}`;

                    // Add grammar icon if present
                    if (element.grammar) {
                        blockHtml += `<button class="grammar-icon-btn"
                            onclick="App.showGrammarSheet('${uid}', event)"
                            aria-label="Show grammar explanation"
                            title="View grammar note">
                                <span class="material-icons">menu_book</span>
                            </button>`;
                    }

                    // Source sentence container - ALWAYS RENDER the sentence wrapper
                    blockHtml += `<div class="sentence-group">
                    <div class="stack-column">`;



                    // Word‑by‑word breakdown - ONLY render if Thai source words are enabled
                    if (settings.th && settings.th.show && element.words && element.words.length > 0) {
                        blockHtml += `<div class="sent-word-block">`;
                        element.words.forEach((word, wordIndex) => {
                            blockHtml += `<div id="${uid}-card-${wordIndex}"
                        class="sent-word-item audio-element"
                        data-text="${this.escapeHtml(word.word)}"
                        data-lang="th"
                        data-link="source-${uid}-w-${wordIndex}"
                        onclick="App.seekAndPlay(this)">
                        <div class="sent-word-source" lang="th" dir="ltr">${this.escapeHtml(word.word)}</div>`;

                            // Show translations for each enabled language (EN, FA, etc.)
                            Object.keys(settings).forEach(lang => {
                                // Only show translations for languages that are enabled (excluding Thai since Thai is the source)
                                if (lang !== 'th' && settings[lang].show && word.translations?.[lang]) {
                                    const dir = lang === 'fa' ? 'rtl' : 'ltr';
                                    blockHtml += `<div class="sent-word-trans lang-${lang}" lang="${lang}" dir="${dir}">${this.escapeHtml(word.translations[lang])}</div>`;
                                }
                            });
                            blockHtml += `</div>`;
                        });
                        blockHtml += `</div>`;
                    }

                    // Source sentence wrapper - ALWAYS RENDER the source sentence
                    blockHtml += `
                    <div class="source-wrapper" style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">`;

                    // Add the source sentence with ALL original attributes preserved
                    blockHtml += `<div class="stack-item source audio-element"
                            lang="th" dir="ltr"
                            data-text="${this.escapeHtml(element.source)}"
                            data-lang="th"
                            data-uid="${uid}"
                            onclick="App.seekAndPlay(this)">
                            ${this.hydrateSource(element.source, element.words, uid)}
                        </div>
                    </div>`;

                    // Translations for the whole sentence - ONLY render if language is enabled (EN, FA, etc.)
                    Object.keys(settings).forEach(lang => {
                        // Check if this language is enabled AND has a translation AND is not Thai
                        if (lang !== 'th' && settings[lang].show && element.translations?.[lang]) {
                            const transUid = `${uid}-trans-${lang}`;
                            const dir = lang === 'fa' ? 'rtl' : 'ltr';
                            blockHtml += `<div class="stack-item trans lang-${lang} audio-element"
                                lang="${lang}" dir="${dir}"
                                data-text="${this.escapeHtml(element.translations[lang])}"
                                data-lang="${lang}"
                                onclick="App.seekAndPlay(this)">
                        ${this.renderTranslationSpan(element.translations[lang], lang, transUid)}
                    </div>`;
                        }
                    });

                    blockHtml += `</div></div>`; // close stack-column & sentence-group
                });
            }

            // ------------------------------------------------------------------
            // Words‑grid blocks – a simple grid of independent word cards.
            // ------------------------------------------------------------------
            else if (block.type === 'words') {
                blockHtml += `<div class="words-grid">`;
                block.data.forEach((word, wordIndex) => {
                    // Use unique UID for word cards too
                    const wordUid = `w-${sectionIndex}-${blockIndex}-${wordIndex}`;
                    blockHtml += this.renderWordCard(word, wordUid);
                });
                blockHtml += `</div>`;
            }

            blockHtml += `</div>`; // close block-container
            return blockHtml;
        }).join('');
    },

    // Update renderWordCard to respect Thai checkbox for source words
    renderWordCard(wordObj, uid) {
        const settings = this.state.media.languageSettings;
        let html = `<div class="word-card">`;

        // Thai source word - ONLY render if Thai source words are enabled
        if (settings.th && settings.th.show) {
            html += `<div class="word-source audio-element"
                 lang="th" dir="ltr"
                 data-text="${this.escapeHtml(wordObj.word)}"
                 data-lang="th"
                 onclick="App.seekAndPlay(this)">${this.escapeHtml(wordObj.word)}</div>`;
        }

        // Translations - render all enabled languages (EN, FA, etc.)
        html += `<div class="word-trans-group">`;
        Object.entries(settings).forEach(([code, config]) => {
            if (code !== 'th' && config.show && wordObj.translations?.[code]) {
                const dir = code === 'fa' ? 'rtl' : 'ltr';
                html += `<div class="word-trans lang-${code} audio-element"
                     lang="${code}" dir="${dir}"
                     data-text="${this.escapeHtml(wordObj.translations[code])}"
                     data-lang="${code}"
                     onclick="App.seekAndPlay(this)">${this.escapeHtml(wordObj.translations[code])}</div>`;
            }
        });
        html += `</div></div>`;
        return html;
    },

    hydrateSource(text, words, uid) {
        if (!words || words.length === 0) return this.escapeHtml(text);

        let html = '';
        let cursor = 0;

        // Process each word in the order they appear in the array
        for (let i = 0; i < words.length; i++) {
            const word = words[i];

            // Find the word starting from current cursor position
            const start = text.indexOf(word.word, cursor);

            if (start === -1) {
                // If we can't find it from cursor, log warning and continue
                console.warn(`Could not find word "${word.word}" in "${text}" at or after position ${cursor}`);
                continue;
            }

            const end = start + word.word.length;

            // Add text before the word
            if (start > cursor) {
                html += this.escapeHtml(text.slice(cursor, start));
            }

            // Wrap the word
            html += `<span id="source-${uid}-w-${i}"
             class="word-span"
             data-link="${uid}-card-${i}"
             lang="th" dir="ltr">${this.escapeHtml(word.word)}</span>`;

            cursor = end;
        }

        // Add any remaining text after the last word
        if (cursor < text.length) {
            html += this.escapeHtml(text.slice(cursor));
        }

        return html;
    },

    /** Pause playback without resetting the index (used when the user
        scrolls manually) */
    pausePlayback() {
        this.state.media.isPlaying = false;
        window.speechSynthesis.cancel();
        // Do *not* reset currentIndex – keep the position for later resume
        this.renderMediaBar(document.getElementById('media-player-container'));
    },


    /* ============================================================================
       INITIALISATION & GLOBAL SETUP
    ============================================================================ */

    async init() {
        try {
            this.state.scrolledRows = new Set();
            this.state.currentRowId = null;

            // Set up voices changed handler FIRST
            window.speechSynthesis.onvoiceschanged = () => {
                this.cachedVoices = window.speechSynthesis.getVoices();
                this.autoSelectThaiVoice();
            };

            // Check if voices are already loaded
            setTimeout(() => {
                if (window.speechSynthesis.getVoices().length > 0) {
                    this.cachedVoices = window.speechSynthesis.getVoices();
                    this.autoSelectThaiVoice();
                }
            }, 100);

            // Rest of initialization...
            await this.loadTranslations();
            await this.loadManifest();
            this.applyGlobalSettings();
            this.renderLayout();

            this.loadSRSData();

            // Setup scroll/touch listeners to pause playback (ORIGINAL WORKING VERSION)
            const stopOnScroll = () => {
                if (this.state.media.isPlaying && !this.state.isAutoScrolling) {
                    this.pausePlayback();  // This pauses without resetting index
                }
            };
            window.addEventListener('wheel', stopOnScroll);
            window.addEventListener('touchmove', stopOnScroll);

            // Setup routing
            window.onhashchange = () => this.router();
            this.router();
        } catch (error) {
            this.logError('App initialization failed', error, {
                state: this.state,
                lang: this.state.lang,
                theme: this.state.theme
            });
        }
    },

    /**
     * Automatically select Thai voice if available and none selected
     */
    autoSelectThaiVoice() {
        if (!this.state.media.voice) {
            const thaiVoice = this.cachedVoices.find(voice => voice.lang.startsWith('th'));
            if (thaiVoice) {
                this.state.media.voice = thaiVoice.name;
                localStorage.setItem('localStorageVoice', thaiVoice.name);
            }
        }
    },

    /**
     * Load translations for current language
     */
    async loadTranslations() {
        const response = await fetch(`./locales/${this.state.lang}.json`);
        this.state.translations = await response.json();
    },

    /**
     * Load manifest file (static for a session)
     */
    async loadManifest() {
        if (!this.state.manifest) {
            const response = await fetch('./data/manifest.json');
            this.state.manifest = await response.json();
        }
    },

    /**
     * Apply global settings (theme, font, direction)
     */
    applyGlobalSettings() {
        const root = document.documentElement;
        root.lang = this.state.lang;
        root.dir = this.state.lang === 'fa' ? 'rtl' : 'ltr';

        const allFontClasses = [
            'font-standard',
            'font-serif',
            'font-thai-modern',
            'font-fa-vazir'
        ];

        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${this.state.theme}-theme`);
        document.body.classList.remove(...allFontClasses);
        document.body.classList.add(this.state.font);
    },

    /**
     * Render the main application layout
     */
    renderLayout() {
        const app = document.getElementById('app');
        app.innerHTML = `
        <header id="app-toolbar">
            <nav class="toolbar-left">
                <button class="material-icons toolbar-btn"
                        onclick="location.hash='library'">home</button>
            </nav>
            <nav class="toolbar-right">
                <button class="material-icons toolbar-btn"
                        onclick="App.toggleMenu('lang')">language</button>
                <button class="material-icons toolbar-btn"
                        onclick="App.toggleMenu('font')">text_fields</button>
                <button class="material-icons toolbar-btn"
                        onclick="App.toggleTheme()">
                    ${this.state.theme === 'light' ? 'dark_mode' : 'light_mode'}
                </button>
                <button class="material-icons toolbar-btn"
                        onclick="location.hash='help'">help_outline</button>
            </nav>
        </header>
        <div id="media-player-container"></div>
        <main id="main-content" lang="${this.state.lang}" dir="${this.state.lang === 'fa' ? 'rtl' : 'ltr'}"></main>
        <div id="overlay-anchor"></div>
    `;
    },

    /* ============================================================================
       ROUTING
       ============================================================================ */

    /**
     * Handle hash-based routing
     */
    async router() {
        const hash = location.hash.replace('#', '') || 'library';
        const main = document.getElementById('main-content');
        const mediaBar = document.getElementById('media-player-container');

        this.stopSequence(); // always stop any playback first

        // Check if we're on a flashcard route
        const isFlashcardRoute = hash.startsWith('flashcard/');

        if (isFlashcardRoute) {
            // Hide media bar on flashcard pages
            mediaBar.innerHTML = '';
            document.body.classList.remove('has-media-bar');
        } else {
            // Show media bar on other pages as needed
            if (hash.startsWith('doc/')) {
                this.renderMediaBar(mediaBar);
            } else {
                mediaBar.innerHTML = '';
                document.body.classList.remove('has-media-bar');
            }
        }

        main.innerHTML = '';

        if (hash === 'library') {
            this.renderLibrary(main);
        } else if (hash.startsWith('doc/')) {
            await this.handleDocumentSelection(hash.split('/')[1], main);
        } else if (hash.startsWith('quiz/')) {
            this.initQuizFromHash(hash.split('/'));
        } else if (hash.startsWith('flashcard/')) {
            // Flashcard route - parse parameters
            const parts = hash.split('/');
            const documentId = parts[1];
            const sectionIndex = parts[2] === 'null' ? null : parseInt(parts[2], 10);
            const type = parts[3] || 'word';

            // Make sure the document is loaded
            if (!this.state.currentDocument || this.state.currentDocument.documentId !== documentId) {
                await this.handleDocumentSelection(documentId, document.createElement('div'));
            }

            // Start the flashcard session
            this.startFlashcardSession(documentId, sectionIndex, type);
        } else if (hash === 'help') {
            this.renderHelp(main);
        } else if (hash === 'bookmarks') {
            this.renderBookmarkedCards();
        }
    },

    /* ============================================================================
       MEDIA PLAYER
    ============================================================================ */

    /**
     * Render the media player control bar
     * @param {HTMLElement} container - Container element for media bar
     */
    renderMediaBar(container) {
        if (!container) return;

        const media = this.state.media;
        const repeatBadges = Object.entries(media.languageSettings)
            .filter(([, config]) => config.show)
            .map(([code, config]) => `
                <button class="media-badge"
                        onclick="App.cycleLanguageRep('${code}')">
                    ${code} ${config.repeat}r
                </button>`)
            .join('');

        container.innerHTML = `
        <div class="media-row">
            <div class="media-col">
                <button class="material-icons player-ctrl"
                        onclick="App.togglePlay()">
                    ${media.isPlaying ? 'pause' : 'play_arrow'}
                </button>
                <button class="material-icons player-ctrl"
                        onclick="App.stopSequence()">stop</button>
            </div>
            <div class="media-col middle" style="flex: 1; min-width: 0;">
                <div id="media-text-display" class="media-text-display" 
                     lang="${this.state.lang}" dir="${this.state.lang === 'fa' ? 'rtl' : 'ltr'}"></div>
            </div>
            <div class="media-col">
                <button class="media-badge"
                        onclick="App.cycleSpeed()">${media.speed}x</button>
                <button class="media-badge"
                        onclick="App.cycleDelay()">${media.delay}s</button>
                ${repeatBadges}
            </div>
            <div class="media-col">
                <button class="material-icons player-ctrl"
                        onclick="App.showSettingsOverlay()">settings</button>
            </div>
        </div>`;

        document.body.classList.add('has-media-bar');
    },

    /**
     * Load a document JSON, set up navigation, and render its sections
     * @param {string} documentId - Document ID to load
     * @param {HTMLElement} container - Container element for document content
     */
    async handleDocumentSelection(documentId, container) {
        // 1. Load the document JSON (if it isn't already in state)
        if (!this.state.currentDocument || this.state.currentDocument.documentId !== documentId) {
            try {
                let filePath = '';

                // Find the file path from the manifest
                this.state.manifest.learningObjects.forEach(learningObject => {
                    const document = learningObject.documents.find(doc => doc.id === documentId);
                    if (document) filePath = document.filePath;
                });

                const response = await fetch(filePath);
                this.state.currentDocument = await response.json();
            } catch (error) {
                console.error('Error loading document:', error);
                const currentDir = this.state.lang === 'fa' ? 'rtl' : 'ltr';
                container.innerHTML = `<div class="card" lang="${this.state.lang}" dir="${currentDir}">Error loading document.</div>`;
                return;
            }
        }

        // 2. Pull the document's metadata (title, activities, etc.)
        let documentMeta = null;
        this.state.manifest.learningObjects.forEach(learningObject => {
            const doc = learningObject.documents.find(doc => doc.id === documentId);
            if (doc) documentMeta = doc;
        });

        // 3. Reset media-related state for the newly-selected document
        this.state.media.currentIndex = 0;
        this.state.isAutoScrolling = false;

        // 4. Get translations
        const t = this.state.translations;

        // 5. Build the HTML for the document view
        let html = `<div class="document-content">`;

        // Document title
        const docTitle = this.escapeHtml(
            documentMeta.title[this.state.lang] ||
            documentMeta.title.en ||
            'Untitled Document'
        );
        const currentDir = this.state.lang === 'fa' ? 'rtl' : 'ltr';
        html += `<h1 class="doc-title" lang="${this.state.lang}" dir="${currentDir}">${docTitle}</h1>`;

        // Document-level controls - COMBINED into a single container with 4 buttons
        html += `<div class="document-controls-wrapper">`;

        // Quiz buttons
        if (documentMeta.activities && documentMeta.activities.length > 0) {
            documentMeta.activities.forEach(activity => {
                const isWordQuiz = activity.includes('Word');
                const label = isWordQuiz ? (t.words || 'Words') : (t.sentences || 'Sentences');
                const icon = isWordQuiz ? 'quiz' : 'quiz'; // Both use quiz icon for consistency
                html += `<button class="doc-quiz-btn"
                 onclick="location.hash='quiz/${documentId}/${activity}'"
                 title="${isWordQuiz ? (t.word_quiz || 'Word Quiz') : (t.sentence_quiz || 'Sentence Quiz')}"
                 lang="${this.state.lang}" dir="${currentDir}">
            <span class="material-icons">${icon}</span>
            <span>${label}</span>
        </button>`;
            });
        }

        // Flashcard buttons
        html += `
        <button class="btn-flashcard" onclick="App.initFlashcards('${documentId}', null, 'word')" title="${t.study_words_section || 'Study all words'}">
            <span class="material-icons">style</span>
            <span>${t.words || 'Words'}</span>
        </button>
        <button class="btn-flashcard" onclick="App.initFlashcards('${documentId}', null, 'sentence')" title="${t.study_sentences_section || 'Study all sentences'}">
            <span class="material-icons">quiz</span>
            <span>${t.sentences || 'Sentences'}</span>
        </button>
    `;

        html += `</div>`;

        // Sections
        // Sections
        this.state.currentDocument.sections.forEach((section, index) => {
            const heading = section.heading[this.state.lang] ||
                section.heading.en ||
                'Untitled Section';

            html += `<details class="section-details" open>
    <summary>
        <span class="section-title-text" lang="${this.state.lang}" dir="${currentDir}">${this.escapeHtml(heading)}</span>
        
        <div class="section-controls-wrapper">
            <!-- All section buttons in a single container for proper flex distribution -->
            <div class="section-all-controls">
                ${section.blocks.some(block => block.type === 'words' || block.type === 'paragraph') ? `
                <!-- Flashcard buttons -->
                <button class="btn-flashcard-small" onclick="App.initFlashcards('${documentId}', ${index}, 'word')" title="${t.study_words_section || 'Study words from this section'}">
                    <span class="material-icons">style</span>
                    <span>${t.words || 'Words'}</span>
                </button>
                <button class="btn-flashcard-small" onclick="App.initFlashcards('${documentId}', ${index}, 'sentence')" title="${t.study_sentences_section || 'Study sentences from this section'}">
                    <span class="material-icons">quiz</span>
                    <span>${t.sentences || 'Sentences'}</span>
                </button>
                ` : ''}
                
                ${section.activities ? `
                <!-- Quiz buttons -->
                ${section.activities.map(activity => {
                const isWordQuiz = activity.includes('Word');
                const label = isWordQuiz ? (t.words || 'Words') : (t.sentences || 'Sentences');
                return `<button class="section-quiz-btn"
                                    onclick="event.stopPropagation(); location.hash='quiz/${documentId}/${index}/${activity}'"
                                    title="${isWordQuiz ? (t.word_quiz || 'Word Quiz') : (t.sentence_quiz || 'Sentence Quiz')}"
                                    lang="${this.state.lang}" dir="${currentDir}">
                                <span class="material-icons">quiz</span>
                                <span>${label}</span>
                            </button>`;
            }).join('')}
                ` : ''}
            </div>
        </div>
    </summary>
    <div class="section-card">
        ${this.renderBlocks(section.blocks, index)}
    </div>
</details>`;
        });

        html += `</div>`;
        container.innerHTML = html;
    },

    /**
     * Update media bar with current text
     * @param {string} text - Text to display
     * @param {string} lang - Language code for styling
     */
    updateMediaBar(text, lang) {
        const display = document.getElementById('media-text-display');
        if (display) {
            display.innerText = text;
            display.className = `media-text lang-${lang}`;
        }
    },

    /* ============================================================================
       MEDIA PLAYBACK
    ============================================================================ */
    /**
     * Pause playback without resetting the index (used when user interacts)
     */

    /**
     * Toggle play/pause state
     */
    togglePlay() {
        this.state.media.isPlaying = !this.state.media.isPlaying;
        if (this.state.media.isPlaying) {
            this.playSequence();
        } else {
            window.speechSynthesis.cancel();
        }
        this.renderMediaBar(document.getElementById('media-player-container'));
    },

    /**
     * Stop playback and reset state
     */
    stopSequence() {
        this.state.media.isPlaying = false;
        this.state.media.currentIndex = 0;

        // Clear tracking if it exists
        if (this.state.scrolledRows) {
            this.state.scrolledRows.clear();
        }
        this.state.currentRowId = null;

        window.speechSynthesis.cancel();

        // Clean up highlight classes
        document
            .querySelectorAll('.active-highlight')
            .forEach(el => el.classList.remove('active-highlight'));
        document
            .querySelectorAll('.word-span-highlight')
            .forEach(el => el.classList.remove('word-span-highlight'));

        this.renderMediaBar(document.getElementById('media-player-container'));
    },

    /**
     * Seek to and play from a specific element
     * @param {HTMLElement} element - Element to start playing from
     */
    seekAndPlay(element) {
        // Ignore clicks on inner spans – they are handled by highlightWord()
        if (element.tagName === 'SPAN') return;

        const allElements = Array.from(document.querySelectorAll('.audio-element'));
        const target = element.classList.contains('audio-element')
            ? element
            : element.closest('.audio-element');

        this.state.media.currentIndex = allElements.indexOf(target);

        // Clear tracking so we start fresh from this position
        if (this.state.scrolledRows) {
            this.state.scrolledRows.clear();
        }
        this.state.currentRowId = null;

        window.speechSynthesis.cancel();
        if (!this.state.media.isPlaying) this.togglePlay();
    },

    /**
     * Get audio elements grouped by row
     * @returns {Array} Array of row objects
     */
    getAudioElementsByRow() {
        const elements = Array.from(document.querySelectorAll('.audio-element'));
        const rows = new Map();

        elements.forEach((element, index) => {
            // Find which row this element belongs to
            const rowElement = element.closest('.sentence-group') || element.closest('.word-card');
            const rowId = rowElement?.id || element.getAttribute('data-uid')?.split('-')[0] || `row-${index}`;

            if (!rows.has(rowId)) {
                rows.set(rowId, {
                    id: rowId,
                    element: rowElement,
                    items: []
                });
            }

            rows.get(rowId).items.push({
                element: element,
                index: index,
                text: element.getAttribute('data-text'),
                lang: element.getAttribute('data-lang')
            });
        });

        return Array.from(rows.values());
    },

    /**
     * Play through the sequence of audio elements
     */
    async playSequence() {
        const elements = document.querySelectorAll('.audio-element');
        const settings = this.state.media.languageSettings;

        // Initialize tracking
        if (!this.state.scrolledRows) {
            this.state.scrolledRows = new Set();
        }
        this.state.currentRowId = null;

        while (
            this.state.media.isPlaying &&
            this.state.media.currentIndex < elements.length
        ) {
            const element = elements[this.state.media.currentIndex];
            if (!element) break;

            // Clear previous highlights
            document.querySelectorAll('.active-highlight')
                .forEach(el => el.classList.remove('active-highlight'));

            const text = element.getAttribute('data-text');
            const lang = element.getAttribute('data-lang');

            // Find the row container for this element
            const row = element.closest('.sentence-group, .word-card');
            const rowId = row?.id || row?.getAttribute('data-uid') || `row-${this.state.media.currentIndex}`;

            // Scroll when we enter a new row
            if (rowId && rowId !== this.state.currentRowId) {
                this.state.isAutoScrolling = true;

                // Scroll the row into view
                if (row) {
                    row.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest'
                    });
                } else {
                    element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest'
                    });
                }

                await new Promise(resolve => setTimeout(resolve, 300));
                this.state.isAutoScrolling = false;
                this.state.currentRowId = rowId;
            }

            const repeats = parseInt(settings[lang]?.repeat) || 1;

            // Repeat according to language-specific repeat count
            for (let i = 0; i < repeats; i++) {
                if (!this.state.media.isPlaying) break;
                await this.speakPromise(text, element, lang);
            }

            if (!this.state.media.isPlaying) break;

            // Delay between elements
            await new Promise(resolve =>
                setTimeout(resolve, this.state.media.delay * 1000)
            );
            this.state.media.currentIndex++;
        }

        // If we reached the end, stop cleanly
        if (this.state.media.currentIndex >= elements.length) {
            this.stopSequence();
        }
    },

    /**
     * Promise wrapper for speech synthesis
     * @param {string} text - Text to speak
     * @param {HTMLElement} element - Associated DOM element
     * @param {string} langCode - Language code
     * @returns {Promise} Resolves when speech completes
     */
    speakPromise(text, element, langCode) {
        return new Promise(resolve => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = this.getLocaleFor(langCode);
            utterance.rate = this.state.media.speed;
            utterance.pitch = this.state.media.pitch;

            // Use the cached Thai voice if applicable
            if (langCode === 'th' && this.state.media.voice) {
                const voice = this.cachedVoices.find(
                    v => v.name === this.state.media.voice
                );
                if (voice) utterance.voice = voice;
            }

            // Linked highlighting (sentence ↔ word card)
            const linkId = element.getAttribute('data-link');
            const linkedElement = linkId ? document.getElementById(linkId) : null;

            utterance.onstart = () => {
                element.classList.add('active-highlight');
                if (linkedElement) linkedElement.classList.add('active-highlight');
            };

            const cleanup = () => {
                element.classList.remove('active-highlight');
                if (linkedElement) linkedElement.classList.remove('active-highlight');
                resolve();
            };

            utterance.onend = cleanup;
            utterance.onerror = cleanup;
            window.speechSynthesis.speak(utterance);
        });
    },

    /**
     * Cycle through speech speed options
     */
    cycleSpeed() {
        const speeds = [0.5, 0.75, 1, 1.25, 1.5];
        const currentIndex = speeds.indexOf(this.state.media.speed);
        const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
        this.updateMediaParam('speed', nextSpeed);
    },

    /**
     * Cycle through delay options
     */
    cycleDelay() {
        const nextDelay = (this.state.media.delay % 5) + 1; // allow 1‑5 seconds
        this.updateMediaParam('delay', nextDelay);
    },

    /**
     * Update a media parameter and persist to localStorage
     * @param {string} key - Parameter key
     * @param {any} value - New value
     */
    updateMediaParam(key, value) {
        this.state.media[key] = parseFloat(value);
        localStorage.setItem(`localStorage${key}`, value);
        this.renderMediaBar(document.getElementById('media-player-container'));
    },

    /**
     * Cycle language-specific repeat count
     * @param {string} langCode - Language code
     */
    cycleLanguageRep(langCode) {
        const current = this.state.media.languageSettings[langCode].repeat;
        this.state.media.languageSettings[langCode].repeat = (current % 3) + 1;
        localStorage.setItem(
            'localStorageLangMap',
            JSON.stringify(this.state.media.languageSettings)
        );
        this.renderMediaBar(document.getElementById('media-player-container'));
    },

    /* ============================================================================
       HIGHLIGHTING
    ============================================================================ */

    /**
     * Highlight a word and its linked element
     * @param {HTMLElement} element - Element to highlight
     */
    highlightWord(element) {
        // Remove any existing highlights
        document.querySelectorAll('.active-highlight')
            .forEach(el => el.classList.remove('active-highlight'));

        const linkId = element.getAttribute('data-link');
        const linkedElement = linkId ? document.getElementById(linkId) : null;

        element.classList.add('active-highlight');
        if (linkedElement) linkedElement.classList.add('active-highlight');
    },

    /* ============================================================================
       SETTINGS OVERLAY
    ============================================================================ */

    /**
     * Show settings overlay
     */
    showSettingsOverlay() {
        const anchor = document.getElementById('overlay-anchor');
        const media = this.state.media;
        const t = this.state.translations;
        const currentDir = this.state.lang === 'fa' ? 'rtl' : 'ltr';

        // Build language-configuration rows for the table
        const langRows = Object.entries(media.languageSettings)
            .map(([code, config]) => `
    <tr>
        <td lang="${this.state.lang}" dir="${currentDir}">${code.toUpperCase()}</td>
        <td>
            <label class="visually-hidden" for="show-${code}" lang="${this.state.lang}" dir="${currentDir}">Show ${code}</label>
            <input type="checkbox" id="show-${code}"
                   ${config.show ? 'checked' : ''}
                   onchange="App.updateLanguageConfig('${code}','show',this.checked)">
        </td>
        <td>
            <label class="visually-hidden" for="repeat-${code}" lang="${this.state.lang}" dir="${currentDir}">Repeat count for ${code}</label>
            <input type="number" id="repeat-${code}" style="width:40px"
                   value="${config.repeat}"
                   onchange="App.updateLanguageConfig('${code}','repeat',this.value)">
        </td>
    </tr>`)
            .join('');

        anchor.innerHTML = `
        <div class="overlay-full card">
            <div class="settings-header">
                <h2 lang="${this.state.lang}" dir="${currentDir}">${t.settings || 'Settings'}</h2>
                <button class="material-icons"
                        onclick="document.getElementById('overlay-anchor').innerHTML=''">
                    close
                </button>
            </div>

            <div class="settings-sliders">
                <div class="control-row-inline">
                    <label lang="${this.state.lang}" dir="${currentDir}">${t.speed || 'Speed'}</label>
                    <input type="range" min="0.5" max="2" step="0.25"
                           value="${media.speed}"
                           oninput="App.updateMediaParam('speed', this.value)">
                    <span class="val-label">${media.speed}x</span>
                </div>

                <div class="control-row-inline">
                    <label lang="${this.state.lang}" dir="${currentDir}">${t.delay || 'Delay'}</label>
                    <input type="range" min="1" max="5" step="1"
                           value="${media.delay}"
                           oninput="App.updateMediaParam('delay', this.value)">
                    <span class="val-label">${media.delay}s</span>
                </div>

                <div class="control-row-inline">
                    <label lang="${this.state.lang}" dir="${currentDir}">${t.pitch || 'Pitch'}</label>
                    <input type="range" min="0.5" max="1.5" step="0.1"
                           value="${media.pitch}"
                           oninput="App.updateMediaParam('pitch', this.value)">
                    <span class="val-label">${media.pitch}</span>
                </div>
            </div>

            <label style="display:block; margin-bottom:8px;" lang="${this.state.lang}" dir="${currentDir}">${t.voice || 'Voice'}</label>
            <select id="voice-select"
                    onchange="App.updateMediaParam('voice', this.value)"
                    style="width:100%; margin-bottom:15px;">
                ${this.cachedVoices
                .map(voice =>
                    `<option value="${voice.name}"
                            ${media.voice === voice.name ? 'selected' : ''}>
                            ${voice.name}
                     </option>`
                )
                .join('')}
            </select>

            <table>
                <thead>
                    <tr>
                        <th lang="${this.state.lang}" dir="${currentDir}">${t.translation || 'Translation'}</th>
                        <th lang="${this.state.lang}" dir="${currentDir}">${t.show || 'Show'}</th>
                        <th lang="${this.state.lang}" dir="${currentDir}">
                            <span class="material-icons">volume_up</span> ${t.repeat || 'Repeat'}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    ${langRows}
                </tbody>
            </table>
        </div>`;
    },

    /**
     * Update a language-specific configuration (visibility or repeat count)
     * @param {string} code - Language code
     * @param {string} key - Configuration key ('show' or 'repeat')
     * @param {any} value - New value
     */
    updateLanguageConfig(code, key, value) {
        const config = this.state.media.languageSettings[code];
        if (!config) return;

        config[key] = key === 'show' ? !!value : parseInt(value, 10);
        localStorage.setItem(
            'localStorageLangMap',
            JSON.stringify(this.state.media.languageSettings)
        );
        this.renderMediaBar(document.getElementById('media-player-container'));
        // Re-render the current view so new language settings take effect
        this.router();
    },

    /* ============================================================================
       LIBRARY & HELP RENDERS
    ============================================================================ */

    /**
     * Render the library view
     * @param {HTMLElement} container - Container element
     */
    renderLibrary(container) {
        let html = '<div class="library-container">';

        this.state.manifest.learningObjects.forEach((learningObject, objectIndex) => {
            const objectTitle = this.escapeHtml(
                learningObject.title[this.state.lang] ||
                learningObject.title.en ||
                'Untitled'
            );

            const currentDir = this.state.lang === 'fa' ? 'rtl' : 'ltr';

            html += `
        <details class="library-section" ${objectIndex === 0 ? 'open' : ''}>
            <summary class="library-summary">
                <span class="material-icons">expand_more</span>
                <span class="library-title" lang="${this.state.lang}" dir="${currentDir}">${objectTitle}</span>
                <span class="library-count">(${learningObject.documents.length})</span>
            </summary>
            <div class="library-docs">`;

            learningObject.documents.forEach(document => {
                const documentTitle = this.escapeHtml(
                    document.title[this.state.lang] ||
                    document.title.en ||
                    'Untitled'
                );

                html += `
            <button class="doc-btn"
                    onclick="location.hash='doc/${document.id}'">
                <span class="material-icons doc-btn-icon">description</span>
                <span class="doc-btn-text" lang="${this.state.lang}" dir="${currentDir}">${documentTitle}</span>
                <span class="material-icons doc-btn-arrow">chevron_right</span>
            </button>`;
            });

            html += `</div></details>`;
        });

        html += '</div>';
        container.innerHTML = html;
    },

    /**
     * Render the help view
     * @param {HTMLElement} container - Container element
     */
    renderHelp(container) {
        const t = this.state.translations;
        const currentDir = this.state.lang === 'fa' ? 'rtl' : 'ltr';

        const renderSteps = steps =>
            (Array.isArray(steps) ? steps : [])
                .map(step => `<li lang="${this.state.lang}" dir="${currentDir}">${this.escapeHtml(step)}</li>`)
                .join('');

        container.innerHTML = `
    <section class="card">
        <h2 lang="${this.state.lang}" dir="${currentDir}">${t.help_title || 'Help'}</h2>

        <!-- App Overview -->
        <details class="section-details">
            <summary lang="${this.state.lang}" dir="${currentDir}">${t.app_overview_title || 'App Overview and Usage'}</summary>
            <div class="card card-help">
                <ol>
                    ${renderSteps(t.app_overview_steps || [
            'Browse documents in the Library section',
            'Click on any document to open it',
            'Click on sentences or words to hear them spoken',
            'Use the media player to control playback',
            'Adjust settings for language, speed, and voice',
            'Take quizzes to test your knowledge'
        ])}
                </ol>
            </div>
        </details>

        <div style="margin:20px;">
            <button class="btn-activity"
                    onclick="App.testSpeech()"
                    lang="${this.state.lang}" dir="${currentDir}">
                ${t.test_speech || 'Test Speech'}
            </button>
        </div>

        <details class="section-details">
            <summary lang="${this.state.lang}" dir="${currentDir}">${t.setup_android || 'Android'}</summary>
            <div class="card card-help"><ol>${renderSteps(t.android_steps)}</ol></div>
        </details>

        <details class="section-details">
            <summary lang="${this.state.lang}" dir="${currentDir}">${t.setup_apple || 'Apple'}</summary>
            <div class="card card-help"><ol>${renderSteps(t.apple_steps)}</ol></div>
        </details>

    </section>`;
    },

    /* ============================================================================
       SMALL HELPERS
    ============================================================================ */

    /**
     * Sleep/pause function
     * @param {number} ms - Milliseconds to sleep
     * @returns {Promise} Resolves after specified time
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Fetch translation from MyMemory API
     * @param {string} text - Text to translate
     * @param {string} pair - Language pair (e.g., 'th|en')
     * @returns {Promise<string>} Translated text
     */
    async fetchTranslation(text, pair) {
        try {
            const response = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${pair}`
            );
            const data = await response.json();
            return data.responseStatus === 200 ? data.responseData.translatedText : '';
        } catch (error) {
            console.error('Translation error:', error);
            return '';
        }
    },

    /**
     * Test speech synthesis
     */
    testSpeech() {
        const testText = 'ทดสอบระบบเสียง';
        const utterance = new SpeechSynthesisUtterance(testText);
        utterance.lang = 'th-TH';

        if (this.state.media.voice) {
            const voice = this.cachedVoices.find(v => v.name === this.state.media.voice);
            if (voice) utterance.voice = voice;
        }

        window.speechSynthesis.speak(utterance);
        alert(this.state.translations.testing_msg || 'Testing Thai Speech...');
    },

    /**
     * Reset JSON generator state
     */
    resetJsonState() {
        const generateButton = document.getElementById('btn-generate');
        const outputBox = document.getElementById('json-output');

        if (generateButton) {
            generateButton.disabled = false;
            generateButton.style.opacity = '1';
        }
        if (outputBox) outputBox.style.display = 'none';
    },

    /* ============================================================================
       THEME & MENU
    ============================================================================ */

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        this.state.theme = this.state.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('localStorageTheme', this.state.theme);
        this.applyGlobalSettings();
        this.renderLayout();
        this.router();
    },

    /**
     * Toggle language or font menu
     * @param {string} type - Menu type ('lang' or 'font')
     */
    toggleMenu(type) {
        const anchor = document.getElementById('overlay-anchor');
        if (anchor.innerHTML !== '') {
            anchor.innerHTML = '';
            return;
        }

        const t = this.state.translations;
        let options = {};

        if (type === 'lang') {
            options = {
                en: t.language_en || 'English',
                fa: t.language_fa || 'فارسی',
                th: t.language_th || 'ไทย'
            };
        } else {
            options = {
                'font-standard': t.font_standard || 'Standard (Sans)',
                'font-serif': t.font_serif || 'Classic (Serif)',
                'font-thai-modern': t.font_thai || 'Modern Thai (Loopless)',
                'font-fa-vazir': t.font_farsi || 'Farsi Script (Vazir)'
            };
        }

        const currentDir = this.state.lang === 'fa' ? 'rtl' : 'ltr';
        let html = '<div class="overlay-menu card">';
        Object.entries(options).forEach(([key, value]) => {
            html += `<button onclick="App.updateSetting('${type}','${key}')" lang="${this.state.lang}" dir="${currentDir}">${value}</button>`;
        });
        html += '</div>';
        anchor.innerHTML = html;
    },

    /**
     * Update a setting (language or font)
     * @param {string} type - Setting type ('lang' or 'font')
     * @param {string} value - New value
     */
    async updateSetting(type, value) {
        if (type === 'lang') {
            this.state.lang = value;
            localStorage.setItem('localStorageLang', value);
            await this.loadTranslations();
        } else {
            this.state.font = value;
            localStorage.setItem('localStorageFont', value);
        }
        this.applyGlobalSettings();
        this.renderLayout();
        this.router();
    },

    /* ============================================================================
       QUIZ LOGIC
    ============================================================================ */

    /**
     * Remove duplicate word items from quiz data
     * @param {Array} items - Quiz items array
     * @param {string} sourceLanguage - Source language code
     * @returns {Array} Unique items
     */
    removeDuplicateWordItems(items, sourceLanguage) {
        const seen = new Set();
        return items.filter(item => {
            const key = item.languageMap[sourceLanguage];
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    },

    /**
     * Extract flat quiz items from a document (or a single section)
     * @param {Object} document - Document object
     * @param {number|null} sectionIndex - Section index or null for entire document
     * @param {string} type - Quiz type ('word' or 'sentence')
     * @returns {Array} Quiz items
     */
    getQuizData(document, sectionIndex = null, type = 'word') {
        const items = [];
        const sections = sectionIndex !== null ? [document.sections[sectionIndex]] : document.sections;
        const sourceLanguage = document.sourceLang || 'th';

        sections.forEach(section => {
            section.blocks.forEach(block => {
                if (type === 'multipleChoiceWord') {
                    // 1. Include words from 'words' blocks
                    if (block.type === 'words') {
                        block.data.forEach(word => {
                            const languageMap = {
                                ...word.translations,
                                [sourceLanguage]: word.word
                            };
                            items.push({
                                id: Math.random().toString(36),
                                languageMap,
                                source: 'words-block'
                            });
                        });
                    }
                    // 2. ALSO include individual words from 'sentence' elements
                    else if (block.type === 'paragraph') {
                        block.elements.forEach(element => {
                            if (element.type === 'sentence' && element.words && element.words.length > 0) {
                                element.words.forEach(word => {
                                    const languageMap = {
                                        ...word.translations,
                                        [sourceLanguage]: word.word
                                    };
                                    items.push({
                                        id: Math.random().toString(36),
                                        languageMap,
                                        source: 'sentence-words',
                                        sentenceSource: element.source
                                    });
                                });
                            }
                        });
                    }
                } else if (type === 'multipleChoiceSentence' && block.type === 'paragraph') {
                    block.elements.forEach(element => {
                        if (element.type === 'sentence') {
                            const languageMap = {
                                ...element.translations,
                                [sourceLanguage]: element.source
                            };
                            items.push({
                                id: Math.random().toString(36),
                                languageMap,
                                source: 'sentence'
                            });
                        }
                    });
                }
            });
        });

        // Remove duplicate words
        const uniqueItems = this.removeDuplicateWordItems(items, sourceLanguage);

        // Shuffle and optionally limit the number of quiz items
        const shuffledItems = uniqueItems.sort(() => Math.random() - 0.5);

        // Return all items or limit to a reasonable number
        return shuffledItems; // Or: return shuffledItems.slice(0, 20);
    },

    /**
     * Initialize a quiz from the URL hash
     * @param {Array} hashParts - Hash parts split by '/'
     */
    async initQuizFromHash(hashParts) {
        const documentId = hashParts[1];
        const type = hashParts.length === 4 ? hashParts[3] : hashParts[2];
        const sectionIndex = hashParts.length === 4 ? parseInt(hashParts[2], 10) : null;

        // Ensure the document is loaded
        if (!this.state.currentDocument || this.state.currentDocument.documentId !== documentId) {
            await this.handleDocumentSelection(documentId, document.createElement('div'));
        }

        const data = this.getQuizData(this.state.currentDocument, sectionIndex, type);

        // Locate document metadata for language defaults
        let documentMeta = null;
        this.state.manifest.learningObjects.forEach(learningObject => {
            const doc = learningObject.documents.find(doc => doc.id === documentId);
            if (doc) documentMeta = doc;
        });

        this.state.quiz = {
            items: data.sort(() => Math.random() - 0.5),
            currentIndex: 0,
            score: 0,
            incorrect: [],
            questionLanguage: documentMeta?.sourceLang || 'th',
            answerLanguage: documentMeta?.targetLangs?.[0] || 'en',
            type,
            sectionIndex: sectionIndex,
            documentId
        };

        this.renderQuiz();
    },

    /* ============================================================================
       MEDIA PLAYBACK (CONTINUED)
    ============================================================================ */

    /**
     * Speak a piece of text outside of the normal "play‑sequence".
     * Used by the quiz UI (question preview, answer‑preview icons, etc.).
     * @param {string} text - The string to be spoken
     * @param {string} lang - Language code (e.g., 'th', 'en', 'fa')
     */
    playAudio(text, lang) {
        // Cancel any speech that might already be playing
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.getLocaleFor(lang);
        utterance.rate = this.state.media.speed;
        utterance.pitch = this.state.media.pitch;

        // If the user has selected a specific voice (Thai voice handling)
        if (lang === 'th' && this.state.media.voice) {
            const voice = this.cachedVoices.find(v => v.name === this.state.media.voice);
            if (voice) utterance.voice = voice;
        }

        // Resolve the promise when speaking finishes (mirrors speakPromise)
        utterance.onend = () => { /* nothing special needed here */ };
        utterance.onerror = () => { /* swallow errors silently */ };

        window.speechSynthesis.speak(utterance);
    },

    /* ============================================================================
       QUIZ LOGIC – RENDERING & INTERACTION
    ============================================================================ */

    /**
     * Render the current quiz question
     */
    renderQuiz() {
        const main = document.getElementById('main-content');
        const quiz = this.state.quiz;
        const t = this.state.translations;

        // Current quiz item
        const item = quiz.items[quiz.currentIndex];

        // Determine the heading
        let heading = t.test_yourself || 'Test Yourself';

        if (typeof quiz.sectionIndex === 'number' && quiz.sectionIndex >= 0) {
            const section = this.state.currentDocument.sections[quiz.sectionIndex];
            if (section && section.heading && section.heading[this.state.lang]) {
                heading = section.heading[this.state.lang];
            } else if (section && section.heading && section.heading.en) {
                heading = section.heading.en;
            }
        } else {
            // Document-level quiz – look up the document metadata
            const documentMeta = (() => {
                let meta = null;
                this.state.manifest.learningObjects.forEach(learningObject => {
                    const doc = learningObject.documents.find(doc => doc.id === quiz.documentId);
                    if (doc) meta = doc;
                });
                return meta;
            })();

            if (documentMeta && documentMeta.title && documentMeta.title[this.state.lang]) {
                heading = documentMeta.title[this.state.lang];
            } else if (documentMeta && documentMeta.title && documentMeta.title.en) {
                heading = documentMeta.title.en;
            }
        }

        const scoreLabel = t.score || 'Score';
        const questionText = item.languageMap[quiz.questionLanguage] || 'N/A';
        const correctText = item.languageMap[quiz.answerLanguage] || 'N/A';

        // Build the four answer options (1 correct + up to 3 distractors)
        let distractors = quiz.items
            .map(item => item.languageMap[quiz.answerLanguage])
            .filter(text => text && text !== correctText);

        distractors = [...new Set(distractors)]
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        const options = [correctText, ...distractors].sort(() => Math.random() - 0.5);

        const availableLanguages = Object.keys(item.languageMap);
        const progress = ((quiz.currentIndex) / quiz.items.length) * 100;

        // Get direction for languages
        const questionDir = quiz.questionLanguage === 'fa' ? 'rtl' : 'ltr';
        const answerDir = quiz.answerLanguage === 'fa' ? 'rtl' : 'ltr';

        // Escape quotes properly for the onclick handlers
        const escapedQuestionText = this.escapeHtml(questionText).replace(/'/g, "\\'").replace(/"/g, '\\"');
        const escapedCorrectText = this.escapeHtml(correctText).replace(/'/g, "\\'").replace(/"/g, '\\"');

        // Render the quiz UI
        main.innerHTML = `
        <div class="quiz-container">
            <div class="quiz-header">
                <h2 lang="${this.state.lang}" dir="${this.state.lang === 'fa' ? 'rtl' : 'ltr'}">${this.escapeHtml(heading)}</h2>
                <div class="quiz-progress-container">
                    <div class="quiz-progress-fill"
                         style="width:${progress}%"></div>
                </div>
                <div class="quiz-lang-selectors">
                    <select onchange="App.state.quiz.questionLanguage=this.value;App.renderQuiz()">
                        ${availableLanguages
                .map(lang =>
                    `<option value="${lang}" ${lang === quiz.questionLanguage ? 'selected' : ''}>
                                    ${lang.toUpperCase()}
                                 </option>`
                )
                .join('')}
                    </select>
                    <span class="material-icons">arrow_forward</span>
                    <select onchange="App.state.quiz.answerLanguage=this.value;App.renderQuiz()">
                        ${availableLanguages
                .map(lang =>
                    `<option value="${lang}" ${lang === quiz.answerLanguage ? 'selected' : ''}>
                                    ${lang.toUpperCase()}
                                 </option>`
                )
                .join('')}
                    </select>
                </div>
                <div lang="${this.state.lang}" dir="${this.state.lang === 'fa' ? 'rtl' : 'ltr'}">${scoreLabel}: ${quiz.score}</div>
            </div>

            <div class="quiz-question-card">
                <span class="material-icons audio-preview-icon"
                      onclick="App.playAudio('${escapedQuestionText}', '${quiz.questionLanguage}')">
                    volume_up
                </span>
                <div class="quiz-question-text" lang="${quiz.questionLanguage}" dir="${questionDir}">
                    ${this.escapeHtml(questionText)}
                </div>
            </div>

            <div class="quiz-options-grid">
                ${options.map(option => {
                    const escapedOption = this.escapeHtml(option).replace(/'/g, "\\'").replace(/"/g, '\\"');
                    const escapedOptionForClick = this.escapeHtml(option).replace(/'/g, "\\\\'").replace(/"/g, '\\\\"');
                    return `
                    <button class="quiz-option-btn"
                            lang="${quiz.answerLanguage}" dir="${answerDir}"
                            onclick="App.handleAnswer(this, '${escapedOption}', '${escapedCorrectText}')">
                        <span class="material-icons audio-preview-icon"
                            lang="${quiz.answerLanguage}" dir="${answerDir}"
                            onclick="event.stopPropagation();App.playAudio('${escapedOptionForClick}', '${quiz.answerLanguage}')">
                            volume_up
                        </span>
                        <span lang="${quiz.answerLanguage}" dir="${answerDir}">${this.escapeHtml(option)}</span>
                    </button>`;
                }).join('')}
            </div>
        </div>
    `;

        // Auto-play the question when the UI appears
        this.playAudio(questionText, quiz.questionLanguage);
    },

    /**
     * Process a user's answer
     * @param {HTMLElement} button - The clicked button
     * @param {string} selected - Selected answer text
     * @param {string} correct - Correct answer text
     */
    handleAnswer(button, selected, correct) {
        const quiz = this.state.quiz;
        const isCorrect = selected === correct;

        // Speak the selected answer immediately
        this.playAudio(selected, quiz.answerLanguage);

        // Visual feedback
        if (isCorrect) {
            button.classList.add('correct');
            quiz.score++;
        } else {
            button.classList.add('incorrect');
            quiz.incorrect.push(quiz.items[quiz.currentIndex]);

            // Highlight the correct option
            document.querySelectorAll('.quiz-option-btn')
                .forEach(btn => {
                    if (btn.innerText.includes(correct)) btn.classList.add('correct');
                });
        }

        // Disable all options to prevent double‑clicks
        document.querySelectorAll('.quiz-option-btn')
            .forEach(btn => (btn.disabled = true));

        // Advance after a short pause
        setTimeout(() => {
            quiz.currentIndex++;
            if (quiz.currentIndex < quiz.items.length) {
                this.renderQuiz();
            } else {
                this.renderReview();
            }
        }, 2000);
    },

    /**
     * Final review screen after the quiz ends
     */
    renderReview() {
        const main = document.getElementById('main-content');
        const quiz = this.state.quiz;
        const t = this.state.translations;

        main.innerHTML = `
        <div class="quiz-container">
            <h2 lang="${this.state.lang}" dir="${this.state.lang === 'fa' ? 'rtl' : 'ltr'}">${t.review || 'Review'}</h2>
            <div class="card" lang="${this.state.lang}" dir="${this.state.lang === 'fa' ? 'rtl' : 'ltr'}">
                <h3>${t.score || 'Score'}: ${quiz.score} / ${quiz.items.length}</h3>
            </div>

            <div class="review-list">
                ${quiz.incorrect
                .map(item => {
                    const questionText = item.languageMap[quiz.questionLanguage];
                    const answerText = item.languageMap[quiz.answerLanguage];
                    const questionDir = quiz.questionLanguage === 'fa' ? 'rtl' : 'ltr';
                    const answerDir = quiz.answerLanguage === 'fa' ? 'rtl' : 'ltr';
                    const escapedQuestionText = this.escapeHtml(questionText).replace(/'/g, "\\'").replace(/"/g, '\\"');
                    return `
                            <div class="card review-item"
                                 onclick="App.playAudio('${escapedQuestionText}', '${quiz.questionLanguage}')">
                                <div>
                                    <strong lang="${quiz.questionLanguage}" dir="${questionDir}">${this.escapeHtml(questionText)}</strong> 
                                    <small lang="${quiz.answerLanguage}" dir="${answerDir}">${this.escapeHtml(answerText)}</small>
                                </div>
                            </div>`;
                })
                .join('')}
            </div>

            <div class="quiz-footer-btns">
                <button class="btn-activity btn-flex"
                        lang="${this.state.lang}" dir="${this.state.lang === 'fa' ? 'rtl' : 'ltr'}"
                        onclick="location.hash='doc/${this.state.currentDocument.documentId}'">
                    ${t.finish || 'Finish'}
                </button>
                ${quiz.incorrect.length > 0
                ? `<button class="btn-activity btn-flex"
                                lang="${this.state.lang}" dir="${this.state.lang === 'fa' ? 'rtl' : 'ltr'}"
                                onclick="App.retryIncorrect()">
                                ${t.retry_incorrect || 'Retry Incorrect'}
                            </button>`
                : ''}
            </div>
        </div>
    `;
    },

    /**
     * Restart the quiz using only the items the user got wrong
     */
    retryIncorrect() {
        this.state.quiz.items = [...this.state.quiz.incorrect].sort(
            () => Math.random() - 0.5
        );
        this.state.quiz.currentIndex = 0;
        this.state.quiz.score = 0;
        this.state.quiz.incorrect = [];
        this.renderQuiz();
    },

    /**
     * Show grammar information in bottom sheet
     * @param {string} sentenceUid - Unique ID of the sentence
     * @param {Event} event - Click event
     */
    showGrammarSheet(sentenceUid, event) {
        event.stopPropagation();
        event.preventDefault(); // Add this for safety

        // Find the sentence data
        const sentence = this.findSentenceByUid(sentenceUid);
        if (!sentence || !sentence.grammar) {
            console.warn('No grammar data found for sentence:', sentenceUid);
            return;
        }

        // Find related examples (same pattern in current document)
        const relatedExamples = this.findRelatedExamples(sentence.grammar.pattern);

        this.state.grammarSheet.content = {
            ...sentence.grammar,
            examples: relatedExamples,
            source: sentence.source,
            translation: sentence.translations[this.state.lang]
        };

        // Render first, then open
        this.renderGrammarSheet();

        // Small delay to ensure DOM is updated
        setTimeout(() => {
            this.openGrammarSheet();
        }, 10);
    },

    /**
     * Find sentence by UID (you'll need to implement this based on your data structure)
     */
    findSentenceByUid(uid) {
        // Parse the UID: s-sectionIndex-blockIndex-elementIndex
        const parts = uid.split('-');
        if (parts[0] !== 's') return null;

        const sectionIndex = parseInt(parts[1]);
        const blockIndex = parseInt(parts[2]);
        const elementIndex = parseInt(parts[3]);

        try {
            const section = this.state.currentDocument.sections[sectionIndex];
            const block = section.blocks[blockIndex];
            return block.elements[elementIndex];
        } catch (e) {
            console.error('Error finding sentence:', e);
            return null;
        }
    },

    /**
     * Find examples with the same grammar pattern
     */
    findRelatedExamples(pattern) {
        if (!pattern || !this.state.currentDocument) return [];

        const examples = [];
        this.state.currentDocument.sections.forEach(section => {
            section.blocks.forEach(block => {
                if (block.type === 'paragraph') {
                    block.elements.forEach(element => {
                        if (element.type === 'sentence' &&
                            element.grammar &&
                            element.grammar.pattern === pattern) {
                            examples.push({
                                source: element.source,
                                translation: element.translations[this.state.lang]
                            });
                        }
                    });
                }
            });
        });

        return examples.slice(0, 5); // Limit to 5 examples
    },

    /**
     * Render the grammar bottom sheet content
     */
    /**
     * Render the grammar bottom sheet content
     */
    renderGrammarSheet() {
        const content = this.state.grammarSheet.content;
        if (!content) return;

        // Get or create anchor
        let anchor = document.getElementById('grammar-sheet-anchor');
        if (!anchor) {
            anchor = document.createElement('div');
            anchor.id = 'grammar-sheet-anchor';
            document.body.appendChild(anchor);
        }

        const dir = this.state.lang === 'fa' ? 'rtl' : 'ltr';
        const examples = content.examples || [];

        // Clear any existing content first
        anchor.innerHTML = '';

        // Set the new content
        anchor.innerHTML = `
        <div class="sheet-backdrop" id="grammar-backdrop" onclick="App.closeGrammarSheet()"></div>
        <div class="bottom-sheet ${this.state.theme === 'dark' ? 'dark-theme' : ''}" id="grammar-sheet">
            <div class="sheet-handle" onclick="App.closeGrammarSheet()"></div>
            <div class="sheet-header">
                <h3 lang="${this.state.lang}" dir="${dir}">Grammar Note</h3>
                <button class="sheet-close material-icons" onclick="App.closeGrammarSheet()">close</button>
            </div>
            <div class="sheet-content">
                <div class="grammar-pattern">
                    <div class="pattern-title" lang="${this.state.lang}" dir="${dir}">Pattern</div>
                    <div class="pattern-example">
                        <span class="example-thai" lang="th">${this.escapeHtml(content.pattern || '')}</span>
                    </div>
                </div>
                
                ${content.note ? `
                    <div class="grammar-note" lang="${this.state.lang}" dir="${dir}">
                        ${this.escapeHtml(content.note[this.state.lang] || content.note.en || '')}
                    </div>
                ` : ''}
                
                <div class="current-sentence">
                    <div class="pattern-title" lang="${this.state.lang}" dir="${dir}">In this sentence</div>
                    <div class="pattern-example">
                        <span class="example-thai" lang="th">${this.escapeHtml(content.source || '')}</span>
                        <span class="example-en" lang="${this.state.lang}" dir="${dir}">${this.escapeHtml(content.translation || '')}</span>
                    </div>
                </div>
                
                ${examples.length > 0 ? `
                    <div class="more-examples">
                        <div class="pattern-title" lang="${this.state.lang}" dir="${dir}">More examples</div>
                        ${examples.map(ex => `
                            <div class="pattern-example" onclick="App.playAudio('${this.escapeHtml(ex.source)}', 'th')">
                                <span class="material-icons">volume_up</span>
                                <span class="example-thai" lang="th">${this.escapeHtml(ex.source)}</span>
                                <span class="example-en" lang="${this.state.lang}" dir="${dir}">${this.escapeHtml(ex.translation || '')}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    },

    /**
     * Open the grammar sheet
     */
    openGrammarSheet() {
        const sheet = document.getElementById('grammar-sheet');
        const backdrop = document.getElementById('grammar-backdrop');

        if (sheet) {
            sheet.classList.add('open');
        } else {
            console.warn('Grammar sheet element not found');
            return;
        }

        if (backdrop) {
            backdrop.classList.add('visible');
        }

        this.state.grammarSheet.isOpen = true;
    },

    /**
     * Close the grammar sheet
     */
    closeGrammarSheet() {
        const sheet = document.getElementById('grammar-sheet');
        const backdrop = document.getElementById('grammar-backdrop');

        if (sheet) sheet.classList.remove('open');
        if (backdrop) backdrop.classList.remove('visible');

        // Clear content after animation
        setTimeout(() => {
            const anchor = document.getElementById('grammar-sheet-anchor');
            if (anchor) anchor.innerHTML = '';
            this.state.grammarSheet.content = null;
        }, 300);
    },

    /* ============================================================================
       FLASHCARD / SRS SYSTEM
    ============================================================================ */

    /**
     * Initialize flashcards for a document/section
     * @param {string} documentId - Document ID
     * @param {number|null} sectionIndex - Section index (null for whole doc)
     * @param {string} type - 'word' or 'sentence'
     */

    /*
    initFlashcards(documentId, sectionIndex = null, type = 'word') {
        // Get all potential items from the document
        const items = this.getFlashcardItems(documentId, sectionIndex, type);

        // Create SRS items for new content
        items.forEach(item => {
            const itemId = this.generateItemId(item);
            if (!this.state.srs.items[itemId]) {
                this.state.srs.items[itemId] = {
                    ...item,
                    id: itemId,
                    srsData: {
                        repetitions: 0,
                        interval: 1,
                        easeFactor: 2.5,
                        dueDate: new Date(), // Due immediately for new items
                        lastReviewed: null
                    }
                };
            }
        });

        // Get due items
        this.state.srs.dueItems = this.getDueItems();

        // Start flashcard session
        this.startFlashcardSession();
    },
*/

    /**
     * Initialize flashcards for a document/section
     * @param {string} documentId - Document ID
     * @param {number|null} sectionIndex - Section index (null for whole doc)
     * @param {string} type - 'word' or 'sentence'
     */
    initFlashcards(documentId, sectionIndex = null, type = 'word') {
        // Set the hash to trigger routing
        location.hash = `flashcard/${documentId}/${sectionIndex}/${type}`;
    },

    /**
     * Generate unique ID for an SRS item
     */
    generateItemId(item) {
        if (item.type === 'word') {
            return `word-${item.documentId}-${item.sectionIndex}-${item.word}`;
        } else {
            return `sent-${item.documentId}-${item.sectionIndex}-${item.sentence}`;
        }
    },

    /**
     * Get all potential flashcard items from content
     */
    getFlashcardItems(documentId, sectionIndex, type) {
        const items = [];
        const doc = this.state.currentDocument;
        const sections = sectionIndex !== null ? [doc.sections[sectionIndex]] : doc.sections;

        sections.forEach((section, idx) => {
            section.blocks.forEach((block, blockIdx) => {  // Capture blockIndex
                if (type === 'word') {
                    // Words from word blocks
                    if (block.type === 'words') {
                        block.data.forEach(word => {
                            items.push({
                                type: 'word',
                                documentId,
                                sectionIndex: idx,
                                word: word.word,
                                translations: word.translations,
                                context: {
                                    exampleSentences: this.findExampleSentences(word.word)
                                }
                            });
                        });
                    }
                    // Words from sentence breakdowns
                    else if (block.type === 'paragraph') {
                        block.elements.forEach((element, elementIdx) => {  // Capture elementIndex
                            if (element.words) {
                                element.words.forEach(word => {
                                    items.push({
                                        type: 'word',
                                        documentId,
                                        sectionIndex: idx,
                                        word: word.word,
                                        translations: word.translations,
                                        context: {
                                            sourceSentence: element.source,
                                            sourceTranslation: element.translations[this.state.lang],
                                            sentenceId: `s-${idx}-${blockIdx}-${elementIdx}`  // Now blockIdx and elementIdx are defined
                                        }
                                    });
                                });
                            }
                        });
                    }
                } else if (type === 'sentence') {
                    // Sentences
                    if (block.type === 'paragraph') {
                        block.elements.forEach((element, elementIdx) => {
                            if (element.type === 'sentence') {
                                items.push({
                                    type: 'sentence',
                                    documentId,
                                    sectionIndex: idx,
                                    sentence: element.source,
                                    translations: element.translations,
                                    words: element.words // for cloze deletions
                                });
                            }
                        });
                    }
                }
            });
        });

        return items;
    },

    /**
     * Find example sentences containing a word
     */
    findExampleSentences(word) {
        const examples = [];
        const doc = this.state.currentDocument;

        doc.sections.forEach(section => {
            section.blocks.forEach(block => {
                if (block.type === 'paragraph') {
                    block.elements.forEach(element => {
                        if (element.source && element.source.includes(word)) {
                            examples.push({
                                sentence: element.source,
                                translation: element.translations[this.state.lang]
                            });
                        }
                    });
                }
            });
        });

        return examples.slice(0, 3); // Limit to 3 examples
    },

    /**
     * Get items due for review
     */
    getDueItems() {
        const now = new Date();
        return Object.values(this.state.srs.items)
            .filter(item => new Date(item.srsData.dueDate) <= now)
            .sort(() => Math.random() - 0.5); // Shuffle
    },

    /**
     * Show message when no flashcard items are found
     */
    showNoFlashcardItemsMessage(type) {
        const main = document.getElementById('main-content');
        const t = this.state.translations;

        main.innerHTML = `
        <div class="flashcard-empty-state">
            <span class="material-icons" style="font-size: 64px; color: var(--text-secondary);">info</span>
            <h2 lang="${this.state.lang}" dir="${this.state.lang === 'fa' ? 'rtl' : 'ltr'}">
                ${t.no_flashcard_items || 'No flashcards available'}
            </h2>
            <p lang="${this.state.lang}" dir="${this.state.lang === 'fa' ? 'rtl' : 'ltr'}">
                ${t.no_flashcard_items_message || `No ${type} found in this section.`}
            </p>
            <button class="btn-activity" onclick="history.back()">
                <span class="material-icons">arrow_back</span>
                ${t.go_back || 'Go Back'}
            </button>
        </div>
    `;
    },

    /**
     * Start a flashcard session (called from router)
     */
    startFlashcardSession(documentId, sectionIndex, type) {
        // Get all potential items from the document
        const items = this.getFlashcardItems(documentId, sectionIndex, type);

        if (items.length === 0) {
            this.showNoFlashcardItemsMessage(type);
            return;
        }

        // Create SRS items for new content
        items.forEach(item => {
            const itemId = this.generateItemId(item);
            if (!this.state.srs.items[itemId]) {
                this.state.srs.items[itemId] = {
                    ...item,
                    id: itemId,
                    srsData: {
                        repetitions: 0,
                        interval: 1,
                        easeFactor: 2.5,
                        dueDate: new Date(), // Due immediately for new items
                        lastReviewed: null
                    },
                    bookmarked: false
                };
            }
        });

        // Get due items
        const dueItems = this.getDueItems();

        if (dueItems.length === 0) {
            this.showNoCardsMessage();
            return;
        }

        // Set up flashcard session
        this.state.flashcards = {
            currentDeck: dueItems,
            currentIndex: 0,
            showAnswer: false,
            documentId: documentId,
            sectionIndex: sectionIndex,
            type: type
        };

        this.renderFlashcard();
    },

    /**
     * Process answer and update SRS data (SM-2 algorithm)
     * @param {number} quality - 0-5 (0=complete blackout, 5=perfect recall)
     */
    processAnswer(quality) {
        const card = this.state.flashcards.currentDeck[this.state.flashcards.currentIndex];
        const srs = card.srsData;

        // SM-2 algorithm
        if (quality >= 3) { // Correct response
            if (srs.repetitions === 0) {
                srs.interval = 1;
            } else if (srs.repetitions === 1) {
                srs.interval = 6;
            } else {
                srs.interval = Math.round(srs.interval * srs.easeFactor);
            }

            srs.repetitions++;
        } else { // Incorrect response
            srs.repetitions = 0;
            srs.interval = 1;
        }

        // Update ease factor
        srs.easeFactor = Math.max(
            1.3,
            srs.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
        );

        // Set next due date
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + srs.interval);
        srs.dueDate = nextDate;
        srs.lastReviewed = new Date();

        // Save to localStorage
        this.saveSRSData();

        // Move to next card
        this.nextCard();
    },

    /**
     * Create cloze deletion for sentences
     */
    createClozeDeletion(sentence, words) {
        if (!words || words.length === 0) return sentence;

        // Randomly select a word to hide
        const wordIndex = Math.floor(Math.random() * words.length);
        const targetWord = words[wordIndex].word;

        // Create cloze deletion (hide the word)
        return sentence.replace(targetWord, '[...]');
    },

    /**
     * Render flashcard UI
     */
    renderFlashcard() {
        const main = document.getElementById('main-content');
        const card = this.state.flashcards.currentDeck[this.state.flashcards.currentIndex];
        const showAnswer = this.state.flashcards.showAnswer;
        const t = this.state.translations;

        if (!card) {
            this.showNoCardsMessage();
            return;
        }

        let frontContent, backContent;

        if (card.type === 'word') {
            frontContent = card.word;
            backContent = card.translations[this.state.lang];
        } else {
            // Sentence with cloze
            const cloze = this.createClozeDeletion(card.sentence, card.words);
            frontContent = cloze;
            backContent = card.sentence;
        }

        // Get example sentences for context
        const examples = card.context?.exampleSentences || [];
        const isBookmarked = card.bookmarked || false;

        main.innerHTML = `
        <div class="flashcard-container">
            <div class="flashcard-header">
                <div class="flashcard-progress">
                    ${t.card || 'Card'} ${this.state.flashcards.currentIndex + 1} / ${this.state.flashcards.currentDeck.length}
                </div>
                <div class="flashcard-header-buttons">
                    <button class="flashcard-header-btn" onclick="App.goToBookmarks()" title="${t.view_bookmarks || 'View Bookmarks'}">
                        <span class="material-icons">bookmarks</span>
                    </button>
                    <button class="flashcard-header-btn" onclick="App.exitFlashcards()" title="${t.exit || 'Exit'}">
                        <span class="material-icons">close</span>
                    </button>
                </div>
            </div>
            
            <div class="flashcard ${showAnswer ? 'show-answer' : ''}">
                <div class="flashcard-front">
                    <div class="flashcard-content" lang="th">${this.escapeHtml(frontContent)}</div>
                    <button class="btn-audio" onclick="App.playAudio('${this.escapeHtml(frontContent).replace(/'/g, "\\'")}', 'th')">
                        <span class="material-icons">volume_up</span>
                    </button>
                </div>
                
                <div class="flashcard-back">
                    <div class="flashcard-content" lang="${this.state.lang}" dir="${this.state.lang === 'fa' ? 'rtl' : 'ltr'}">
                        ${this.escapeHtml(backContent)}
                    </div>
                    <button class="btn-audio" onclick="App.playAudio('${this.escapeHtml(backContent).replace(/'/g, "\\'")}', '${this.state.lang}')">
                        <span class="material-icons">volume_up</span>
                    </button>
                </div>
            </div>
            
            ${examples.length > 0 && showAnswer ? `
                <div class="flashcard-context">
                    <h4>${t.example_sentences || 'Example Sentences'}:</h4>
                    ${examples.map(ex => `
                        <div class="context-sentence" onclick="App.playAudio('${this.escapeHtml(ex.sentence).replace(/'/g, "\\'")}', 'th')">
                            <span class="material-icons">volume_up</span>
                            <span lang="th">${this.escapeHtml(ex.sentence)}</span>
                            <small lang="${this.state.lang}" dir="${this.state.lang === 'fa' ? 'rtl' : 'ltr'}">
                                ${this.escapeHtml(ex.translation)}
                            </small>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${!showAnswer ? `
                <button class="btn-activity btn-show-answer" onclick="App.showFlashcardAnswer()">
                    ${t.show_answer || 'Show Answer'}
                </button>
            ` : `
                <div class="answer-rating">
                    <p>${t.how_well || 'How well did you know this?'}</p>
                    <div class="rating-buttons">
                        <button class="rating-btn" onclick="App.processAnswer(0)">${t.again || 'Again'}</button>
                        <button class="rating-btn" onclick="App.processAnswer(3)">${t.hard || 'Hard'}</button>
                        <button class="rating-btn" onclick="App.processAnswer(4)">${t.good || 'Good'}</button>
                        <button class="rating-btn" onclick="App.processAnswer(5)">${t.easy || 'Easy'}</button>
                    </div>
                </div>
            `}
            
            <div class="flashcard-footer">
                <button class="flashcard-footer-btn" onclick="App.reviewContext()" title="${t.view_context || 'View in context'}">
                    <span class="material-icons">info</span>
                </button>
                <button class="flashcard-footer-btn" onclick="App.bookmarkFlashcard()" title="${isBookmarked ? (t.remove_bookmark || 'Remove bookmark') : (t.bookmark || 'Bookmark')}">
                    <span class="material-icons">${isBookmarked ? 'bookmark' : 'bookmark_border'}</span>
                </button>
                <button class="flashcard-footer-btn" onclick="App.linkToOriginal()" title="${t.view_original || 'View original'}">
                    <span class="material-icons">link</span>
                </button>
            </div>
        </div>
    `;
    },

    /**
     * Review full context of a word
     */
    reviewContext() {
        const card = this.state.flashcards.currentDeck[this.state.flashcards.currentIndex];

        if (card.context?.sentenceId) {
            // Navigate back to the document and highlight the sentence
            location.hash = `doc/${card.documentId}`;
            setTimeout(() => {
                const element = document.getElementById(card.context.sentenceId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    element.classList.add('context-highlight');
                }
            }, 500);
        }
    },

    /**
     * Batch generate flashcards from multiple sections
     */
    batchGenerateFlashcards(documentId, sectionIndices = []) {
        const allItems = [];
        sectionIndices.forEach(index => {
            const items = this.getFlashcardItems(documentId, index, 'word');
            allItems.push(...items);
        });

        // Create SRS items
        allItems.forEach(item => {
            const itemId = this.generateItemId(item);
            if (!this.state.srs.items[itemId]) {
                this.state.srs.items[itemId] = {
                    ...item,
                    id: itemId,
                    srsData: {
                        repetitions: 0,
                        interval: 1,
                        easeFactor: 2.5,
                        dueDate: new Date(),
                        lastReviewed: null
                    }
                };
            }
        });

        this.saveSRSData();
        this.showNotification(`Generated ${allItems.length} flashcards`);
    },

    /* ============================================================================
       SRS (SPACED REPETITION SYSTEM) DATA MANAGEMENT
    ============================================================================ */


    /* --------------------------------------------
       SRS Data Persistence
    -------------------------------------------- */

    /**
     * Load SRS data from localStorage
     */
    loadSRSData() {
        try {
            // Load items
            const storedItems = localStorage.getItem('srsItems');
            if (storedItems) {
                this.state.srs.items = JSON.parse(storedItems);

                // Convert date strings back to Date objects
                Object.values(this.state.srs.items).forEach(item => {
                    if (item.srsData.dueDate) {
                        item.srsData.dueDate = new Date(item.srsData.dueDate);
                    }
                    if (item.srsData.lastReviewed) {
                        item.srsData.lastReviewed = new Date(item.srsData.lastReviewed);
                    }
                });
            }

            // Load settings
            const storedSettings = localStorage.getItem('srsSettings');
            if (storedSettings) {
                this.state.srs.settings = JSON.parse(storedSettings);
            }

            // Load stats
            const storedStats = localStorage.getItem('srsStats');
            if (storedStats) {
                this.state.srs.stats = JSON.parse(storedStats);
            }

            // Update stats
            this.updateSRSStats();

        } catch (error) {
            this.logError('Failed to load SRS data', error);
        }
    },

    /**
     * Save all SRS data to localStorage
     */
    saveSRSData() {
        try {
            // Don't save if nothing changed (optimization)
            if (this._srsSaveQueued) return;

            this._srsSaveQueued = true;

            // Debounce saves to avoid excessive writes
            setTimeout(() => {
                localStorage.setItem('srsItems', JSON.stringify(this.state.srs.items));
                localStorage.setItem('srsSettings', JSON.stringify(this.state.srs.settings));
                localStorage.setItem('srsStats', JSON.stringify(this.state.srs.stats));
                this._srsSaveQueued = false;
            }, 500);

        } catch (error) {
            this.logError('Failed to save SRS data', error);
        }
    },

    /**
     * Update SRS statistics
     */
    updateSRSStats() {
        const now = new Date();
        const today = now.toDateString();

        let totalCards = 0;
        let dueToday = 0;
        let studiedToday = 0;

        Object.values(this.state.srs.items).forEach(item => {
            totalCards++;

            // Check if due
            if (item.srsData.dueDate <= now) {
                dueToday++;
            }

            // Check if studied today
            if (item.srsData.lastReviewed &&
                item.srsData.lastReviewed.toDateString() === today) {
                studiedToday++;
            }
        });

        this.state.srs.stats = {
            totalCards,
            dueToday,
            studiedToday,
            lastStudied: now
        };

        this.saveSRSData();
    },

    /* --------------------------------------------
       SRS Item Management
    -------------------------------------------- */

    /**
     * Create a new SRS item from content
     * @param {Object} source - Source content (word or sentence)
     * @returns {Object} SRS item
     */
    createSRSItem(source) {
        const now = new Date();

        // Generate unique ID based on content
        const id = this.generateSRSId(source);

        // Find example sentences for context
        const examples = this.findExampleSentences(
            source.type === 'word' ? source.word : source.sentence
        );

        return {
            id,
            type: source.type,
            documentId: source.documentId,
            sectionIndex: source.sectionIndex,
            created: now,
            modified: now,

            // Content
            ...source,

            // Learning data
            srsData: {
                repetitions: 0,
                interval: 0,
                easeFactor: this.state.srs.settings.startingEase,
                dueDate: now, // Due immediately for new cards
                lastReviewed: null,
                lapses: 0,    // Number of times forgotten
                reviewHistory: [] // Last 10 reviews for analytics
            },

            // Context
            context: {
                examples,
                tags: this.extractTags(source)
            },

            // Metadata
            notes: '',
            bookmarked: false
        };
    },

    /**
     * Generate a stable ID for an SRS item
     */
    generateSRSId(source) {
        const type = source.type;
        const doc = source.documentId;
        const section = source.sectionIndex || '0';

        if (type === 'word') {
            // Use the word itself in the ID for stability
            return `word-${doc}-${section}-${source.word}`;
        } else {
            // For sentences, hash the content to handle changes
            const hash = this.hashString(source.sentence);
            return `sent-${doc}-${section}-${hash}`;
        }
    },

    /**
     * Simple string hash function
     */
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
    },

    /**
     * Extract tags from content
     */
    extractTags(source) {
        const tags = [];

        // Add document/section as tags
        if (source.documentId) tags.push(`doc:${source.documentId}`);
        if (source.sectionIndex !== undefined) tags.push(`section:${source.sectionIndex}`);

        // Add word type tags
        if (source.type === 'word') {
            // Could detect part of speech from data if available
            if (source.pos) tags.push(`pos:${source.pos}`);
        }

        return tags;
    },

    /* --------------------------------------------
       SM-2 Algorithm Implementation
    -------------------------------------------- */

    /**
     * Process a review using SM-2 algorithm
     * @param {Object} item - SRS item
     * @param {number} quality - 0-5 (0=forgot, 5=perfect)
     * @returns {Object} Updated item
     */
    applySM2(item, quality) {
        const srs = item.srsData;

        // Store in history before updating
        srs.reviewHistory.push({
            date: new Date(),
            quality,
            interval: srs.interval,
            ease: srs.easeFactor
        });

        // Keep only last 10 reviews
        if (srs.reviewHistory.length > 10) {
            srs.reviewHistory.shift();
        }

        if (quality < 3) {
            // Failed - reset repetitions
            srs.repetitions = 0;
            srs.interval = 1;
            srs.lapses++;

            // Slightly reduce ease factor
            srs.easeFactor = Math.max(1.3, srs.easeFactor - 0.2);
        } else {
            // Successful recall
            switch (srs.repetitions) {
                case 0:
                    srs.interval = 1; // 1 day
                    break;
                case 1:
                    srs.interval = 6; // 6 days
                    break;
                default:
                    srs.interval = Math.round(srs.interval * srs.easeFactor);
            }

            srs.repetitions++;

            // Adjust ease factor based on quality (SM-2 formula)
            srs.easeFactor += 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
            srs.easeFactor = Math.max(1.3, Math.min(2.5, srs.easeFactor));
        }

        // Set next due date
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + srs.interval);
        srs.dueDate = nextDate;
        srs.lastReviewed = new Date();
        item.modified = new Date();

        return item;
    },

    /**
     * Get next card for review
     */
    getNextCard() {
        const now = new Date();
        const dueItems = [];
        const newItems = [];

        // Separate due and new items
        Object.values(this.state.srs.items).forEach(item => {
            if (item.srsData.repetitions === 0) {
                newItems.push(item);
            } else if (item.srsData.dueDate <= now) {
                dueItems.push(item);
            }
        });

        // Prioritize due items, mix in some new ones
        if (dueItems.length > 0) {
            // Return a random due item
            return dueItems[Math.floor(Math.random() * dueItems.length)];
        } else if (newItems.length > 0) {
            // Check if we've hit the new cards limit for today
            const studiedToday = this.state.srs.stats.studiedToday || 0;
            if (studiedToday < this.state.srs.settings.newPerDay) {
                return newItems[Math.floor(Math.random() * newItems.length)];
            }
        }

        return null;
    },

    /* ============================================================================
       FLASHCARD / SRS SYSTEM - MISSING METHODS
    ============================================================================ */

    /**
     * Show the answer for the current flashcard
     */
    showFlashcardAnswer() {
        this.state.flashcards.showAnswer = true;
        this.renderFlashcard();
    },

    /**
     * Move to the next card in the deck
     */
    nextCard() {
        if (this.state.flashcards.currentIndex < this.state.flashcards.currentDeck.length - 1) {
            // Move to next card
            this.state.flashcards.currentIndex++;
            this.state.flashcards.showAnswer = false;
            this.renderFlashcard();
        } else {
            // End of deck
            this.renderFlashcardComplete();
        }
    },

    /**
     * Link to the original context of the flashcard
     */
    linkToOriginal() {
        const card = this.state.flashcards.currentDeck[this.state.flashcards.currentIndex];

        if (card.context?.sentenceId) {
            // Navigate back to the document and highlight the sentence
            location.hash = `doc/${card.documentId}`;
            setTimeout(() => {
                const element = document.getElementById(card.context.sentenceId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    element.classList.add('context-highlight');

                    // Remove highlight after 3 seconds
                    setTimeout(() => {
                        element.classList.remove('context-highlight');
                    }, 3000);
                }
            }, 500);
        } else {
            // Just go to the document
            location.hash = `doc/${card.documentId}`;
        }
    },

    /**
     * Bookmark/unbookmark the current flashcard
     */
    bookmarkFlashcard() {
        const card = this.state.flashcards.currentDeck[this.state.flashcards.currentIndex];
        const item = this.state.srs.items[card.id];

        if (item) {
            item.bookmarked = !item.bookmarked;
            this.saveSRSData();

            // Update the bookmark icon
            const bookmarkBtn = document.querySelector('.flashcard-footer .material-icons:nth-child(2)');
            if (bookmarkBtn) {
                bookmarkBtn.textContent = item.bookmarked ? 'bookmark' : 'bookmark_border';
            }

            // Show feedback
            this.showNotification(item.bookmarked ? 'Card bookmarked' : 'Bookmark removed');
        }
    },

    /**
     * Show a message when no cards are due
     */
    showNoCardsMessage() {
        const main = document.getElementById('main-content');
        const t = this.state.translations;

        main.innerHTML = `
        <div class="flashcard-empty-state">
            <span class="material-icons" style="font-size: 64px; color: var(--text-secondary);">style</span>
            <h2 lang="${this.state.lang}" dir="${this.state.lang === 'fa' ? 'rtl' : 'ltr'}">
                ${t.no_cards_due || 'No cards due for review'}
            </h2>
            <p lang="${this.state.lang}" dir="${this.state.lang === 'fa' ? 'rtl' : 'ltr'}">
                ${t.no_cards_message || 'Great job! You\'ve reviewed all due cards. Come back later for more.'}
            </p>
            <button class="btn-activity" onclick="location.hash='library'">
                <span class="material-icons">home</span>
                ${t.back_to_library || 'Back to Library'}
            </button>
        </div>
    `;
    },

    /**
     * Show notification message
     * @param {string} message - Message to display
     */
    showNotification(message) {
        // Create notification element if it doesn't exist
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.className = 'notification';
            document.body.appendChild(notification);
        }

        // Set message and show
        notification.textContent = message;
        notification.classList.add('show');

        // Hide after 2 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    },

    /**
     * Render the flashcard completion screen
     */
    renderFlashcardComplete() {
        const main = document.getElementById('main-content');
        const t = this.state.translations;
        const totalCards = this.state.flashcards.currentDeck.length;
        const studiedToday = this.state.srs.stats.studiedToday || 0;

        main.innerHTML = `
        <div class="flashcard-complete">
            <span class="material-icons" style="font-size: 64px; color: var(--success-color);">celebration</span>
            <h2 lang="${this.state.lang}" dir="${this.state.lang === 'fa' ? 'rtl' : 'ltr'}">
                ${t.session_complete || 'Session Complete!'}
            </h2>
            <p lang="${this.state.lang}" dir="${this.state.lang === 'fa' ? 'rtl' : 'ltr'}">
                ${t.cards_reviewed || 'You reviewed'} ${totalCards} ${t.cards || 'cards'}.
            </p>
            <p lang="${this.state.lang}" dir="${this.state.lang === 'fa' ? 'rtl' : 'ltr'}">
                ${t.total_studied || 'Total studied today'}: ${studiedToday}
            </p>
            
            <div class="flashcard-complete-buttons">
                <button class="btn-activity" onclick="location.hash='library'">
                    <span class="material-icons">home</span>
                    ${t.back_to_library || 'Library'}
                </button>
                <button class="btn-activity" onclick="App.startFlashcardSession()">
                    <span class="material-icons">refresh</span>
                    ${t.study_more || 'Study More'}
                </button>
            </div>
        </div>
    `;
    },



    /* --------------------------------------------
       Data Import/Export
    -------------------------------------------- */

    /**
     * Export all SRS data to a JSON file
     */
    async exportSRSData() {
        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            stats: this.state.srs.stats,
            settings: this.state.srs.settings,
            items: this.state.srs.items
        };

        // Convert Dates to strings for JSON
        const jsonString = JSON.stringify(exportData, (key, value) => {
            if (value instanceof Date) {
                return value.toISOString();
            }
            return value;
        }, 2);

        // Create download
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `srs-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);

        return exportData;
    },

    /**
     * Import SRS data from a JSON file
     */
    async importSRSData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result, (key, value) => {
                        // Convert date strings back to Date objects
                        if (key === 'dueDate' || key === 'lastReviewed' ||
                            key === 'created' || key === 'modified' || key === 'date') {
                            return new Date(value);
                        }
                        return value;
                    });

                    // Validate structure
                    if (!data.version || !data.items) {
                        reject(new Error('Invalid SRS data format'));
                        return;
                    }

                    // Merge with existing data (ask user first)
                    if (confirm('Merge with existing data? Click OK to merge, Cancel to replace')) {
                        // Merge
                        this.state.srs.items = {
                            ...this.state.srs.items,
                            ...data.items
                        };
                    } else {
                        // Replace
                        this.state.srs.items = data.items;
                        this.state.srs.settings = data.settings || this.state.srs.settings;
                    }

                    // Save and update
                    this.saveSRSData();
                    this.updateSRSStats();

                    resolve(Object.keys(data.items).length);

                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    },

    /**
     * Reset all SRS data (with confirmation)
     */
    resetSRSData() {
        if (confirm('Are you sure you want to reset all learning progress? This cannot be undone.')) {
            this.state.srs.items = {};
            this.state.srs.stats = {
                totalCards: 0,
                studiedToday: 0,
                dueToday: 0,
                lastStudied: null
            };
            this.saveSRSData();
            return true;
        }
        return false;
    },

    /**
     * Exit flashcards and return to the exercise page
     */
    exitFlashcards() {
        const flashcard = this.state.flashcards;
        if (flashcard.documentId) {
            location.hash = `doc/${flashcard.documentId}`;
        } else {
            location.hash = 'library';
        }
    },

    /**
     * Navigate to bookmarked cards view
     */
    goToBookmarks() {
        location.hash = 'bookmarks';
    },

    /**
     * Render bookmarked cards
     */
    renderBookmarkedCards() {
        const main = document.getElementById('main-content');
        const t = this.state.translations;

        // Get all bookmarked cards
        const bookmarkedCards = Object.values(this.state.srs.items)
            .filter(item => item.bookmarked);

        if (bookmarkedCards.length === 0) {
            main.innerHTML = `
            <div class="flashcard-empty-state">
                <span class="material-icons">bookmark_border</span>
                <h2 lang="${this.state.lang}" dir="${this.state.lang === 'fa' ? 'rtl' : 'ltr'}">
                    ${t.no_bookmarks || 'No bookmarked cards'}
                </h2>
                <p lang="${this.state.lang}" dir="${this.state.lang === 'fa' ? 'rtl' : 'ltr'}">
                    ${t.no_bookmarks_message || 'Bookmark cards while studying to review them later.'}
                </p>
                <button class="btn-activity" onclick="location.hash='library'">
                    <span class="material-icons">home</span>
                    ${t.back_to_library || 'Back to Library'}
                </button>
            </div>
        `;
            return;
        }

        // Start a flashcard session with bookmarked cards
        this.state.flashcards = {
            currentDeck: bookmarkedCards,
            currentIndex: 0,
            showAnswer: false,
            isBookmarkView: true
        };

        this.renderFlashcard();
    },


}; // End of App object

// Kick‑off the SPA
App.init();