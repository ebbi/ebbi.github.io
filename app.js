// app.js - Refactored with Module Pattern
const App = (function () {
    // ============================================================================
    // PRIVATE MODULES - Each feature is self-contained
    // ============================================================================

    // ----------------------------------------------------------------------------
    // 1. CORE MODULES - State, Event Bus, Router
    // ----------------------------------------------------------------------------

    const State = {
        data: {
            lang: localStorage.getItem('localStorageLang') || 'en',
            theme: localStorage.getItem('localStorageTheme') || 'light',
            font: localStorage.getItem('localStorageFont') || 'font-serif',
            translations: {},
            manifest: null,
            currentDocument: null,
            isAutoScrolling: false,

            // NEW: Track last opened document and accordion states
            lastDocument: localStorage.getItem('lastDocument') || null,
            libraryAccordion: {
                openSection: 0 // Index of currently open library section
            },
            documentAccordion: {
                openSections: {} // Will store open state per document
            },

            media: {
                isPlaying: false,
                isAutoScrolling: false,
                scrolledRows: null,
                scrollEndTimer: null,
                isPausedByScroll: false,
                currentRowId: null,
                currentIndex: 0,
                speed: parseFloat(localStorage.getItem('localStorageSpeed')) || 1,
                delay: parseInt(localStorage.getItem('localStorageDelay')) || 1,
                pitch: parseFloat(localStorage.getItem('localStoragePitch')) || 1,
                voice: localStorage.getItem('localStorageVoice') || '',
                // NEW: Control whether word breakdowns are shown and spoken
                showWordBreakdown: localStorage.getItem('localStorageShowWordBreakdown') !== 'false', // default true
                languageSettings: (() => {
                    const defaults = {
                        th: { show: true, repeat: 1 },
                        en: { show: true, repeat: 1 },
                        fa: { show: false, repeat: 1 }
                    };
                    try {
                        const stored = JSON.parse(localStorage.getItem('localStorageLangMap'));
                        return { ...defaults, ...(stored || {}) };
                    } catch {
                        return defaults;
                    }
                })()
            },


            srs: {
                items: {},
                settings: {
                    newPerDay: 20,
                    reviewsPerDay: 50,
                    learningSteps: [1, 10],
                    graduatingInterval: 1,
                    easyInterval: 4,
                    startingEase: 2.5
                },
                stats: {
                    totalCards: 0,
                    studiedToday: 0,
                    dueToday: 0,
                    lastStudied: null
                },
            },

            sessionHistory: {
                lastVisit: localStorage.getItem('lastVisit') || new Date().toISOString(),
                totalVisits: parseInt(localStorage.getItem('totalVisits') || '0'),
                timeSpent: parseInt(localStorage.getItem('timeSpent') || '0'), // in minutes
                sessionsCompleted: parseInt(localStorage.getItem('sessionsCompleted') || '0')
            },

            activityCounts: (() => {
                try {
                    return JSON.parse(localStorage.getItem('activityCounts')) || {
                        documentsOpened: 0,
                        flashcardsReviewed: 0,
                        quizzesTaken: 0,
                        gamesPlayed: 0,
                        grammarSheetsOpened: 0,
                        audioPlays: 0
                    };
                } catch {
                    return {
                        documentsOpened: 0,
                        flashcardsReviewed: 0,
                        quizzesTaken: 0,
                        gamesPlayed: 0,
                        grammarSheetsOpened: 0,
                        audioPlays: 0
                    };
                }
            })(),

            // Achievements
            achievements: (() => {
                try {
                    return JSON.parse(localStorage.getItem('achievements')) || {
                        firstDocument: false,
                        firstFlashcard: false,
                        firstQuiz: false,
                        firstGame: false,
                        studiedThreeDays: false,
                        reviewedFiftyCards: false
                    };
                } catch {
                    return {
                        firstDocument: false,
                        firstFlashcard: false,
                        firstQuiz: false,
                        firstGame: false,
                        studiedThreeDays: false,
                        reviewedFiftyCards: false
                    };
                }
            })(),

            // Streak tracking
            streak: (() => {
                try {
                    return JSON.parse(localStorage.getItem('streak')) || {
                        current: 0,
                        longest: 0,
                        lastStudyDate: ''
                    };
                } catch {
                    return {
                        current: 0,
                        longest: 0,
                        lastStudyDate: ''
                    };
                }
            })(),

            // Activity history (last 20 actions)
            activityHistory: (() => {
                try {
                    return JSON.parse(localStorage.getItem('activityHistory')) || [];
                } catch {
                    return [];
                }
            })(),

            flashcards: null,
            quiz: null,
            sentenceGame: null,
            grammarSheet: { isOpen: false, content: null },

        },

        defaults: {
            media: {
                speed: 1,
                delay: 1,
                pitch: 1,
                voice: '',
                showWordBreakdown: true, // NEW default
                languageSettings: {
                    th: { show: true, repeat: 1 },
                    en: { show: true, repeat: 1 },
                    fa: { show: false, repeat: 1 }
                }
            }
        },


        get(key) { return this.data[key]; },
        set(key, value) { this.data[key] = value; this.save(key); },
        update(key, fn) { this.data[key] = fn(this.data[key]); this.save(key); },

        save(key) {
            if (key === 'theme') localStorage.setItem('localStorageTheme', this.data.theme);
            if (key === 'lang') localStorage.setItem('localStorageLang', this.data.lang);
            if (key === 'font') localStorage.setItem('localStorageFont', this.data.font);
            if (key === 'lastDocument') localStorage.setItem('lastDocument', this.data.lastDocument);
            if (key === 'libraryAccordion') {
                localStorage.setItem('libraryAccordion', JSON.stringify(this.data.libraryAccordion));
            }
            if (key === 'documentAccordion') {
                localStorage.setItem('documentAccordion', JSON.stringify(this.data.documentAccordion));
            }
            if (key === 'media') {
                localStorage.setItem('localStorageSpeed', this.data.media.speed);
                localStorage.setItem('localStorageDelay', this.data.media.delay);
                localStorage.setItem('localStoragePitch', this.data.media.pitch);
                localStorage.setItem('localStorageVoice', this.data.media.voice);
                localStorage.setItem('localStorageShowWordBreakdown', this.data.media.showWordBreakdown); // NEW
                localStorage.setItem('localStorageLangMap',
                    JSON.stringify(this.data.media.languageSettings));
            }

            // ===== NEW SAVE CASES =====
            if (key === 'activityCounts') {
                localStorage.setItem('activityCounts', JSON.stringify(this.data.activityCounts));
            }
            if (key === 'achievements') {
                localStorage.setItem('achievements', JSON.stringify(this.data.achievements));
            }
            if (key === 'streak') {
                localStorage.setItem('streak', JSON.stringify(this.data.streak));
            }
            if (key === 'activityHistory') {
                localStorage.setItem('activityHistory', JSON.stringify(this.data.activityHistory));
            }
            if (key === 'sessionHistory') {
                localStorage.setItem('lastVisit', this.data.sessionHistory.lastVisit);
                localStorage.setItem('totalVisits', this.data.sessionHistory.totalVisits);
                localStorage.setItem('timeSpent', this.data.sessionHistory.timeSpent);
                localStorage.setItem('sessionsCompleted', this.data.sessionHistory.sessionsCompleted);
            }
        },

        loadAccordionStates() {
            try {
                const savedLibrary = localStorage.getItem('libraryAccordion');
                if (savedLibrary) {
                    this.data.libraryAccordion = JSON.parse(savedLibrary);
                }

                const savedDocument = localStorage.getItem('documentAccordion');
                if (savedDocument) {
                    this.data.documentAccordion = JSON.parse(savedDocument);
                }
            } catch (e) {
                console.warn('Failed to load accordion states', e);
            }
        }

    };

    const EventBus = {
        events: {},

        on(event, callback) {
            if (!this.events[event]) this.events[event] = [];
            this.events[event].push(callback);
        },

        off(event, callback) {
            if (!this.events[event]) return;
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        },

        emit(event, data) {
            if (!this.events[event]) return;
            this.events[event].forEach(callback => callback(data));
        }
    };

    const Router = {
        routes: {
            'library': () => {
                // console.log('Navigating to library');
                UI.Library.render();
                App.hideMediaBar();
            },
            'doc/:id': (id) => {
                // console.log('Navigating to document:', id);
                UI.Document.render(id);
                App.showMediaBar();
            },
            'flashcard/:docId/:section/:type': (docId, section, type) => {
                // console.log('Flashcard route:', { docId, section, type });
                const sectionIdx = section === 'null' ? null : parseInt(section);
                UI.Flashcard.render(docId, sectionIdx, type);
                App.hideMediaBar();
            },
            'flashcard/:docId/:type': (docId, type) => {
                // console.log('Flashcard route (document level):', { docId, type });
                UI.Flashcard.render(docId, null, type);
                App.hideMediaBar();
            },
            'sentence-game/:docId/:section': (docId, section) => {
                // console.log('Sentence game route:', { docId, section });
                const sectionIdx = section === 'null' ? null : parseInt(section);
                UI.Game.render(docId, sectionIdx);
                App.hideMediaBar();
            },
            'sentence-game/:docId': (docId) => {
                // console.log('Sentence game route (document level):', docId);
                UI.Game.render(docId, null);
                App.hideMediaBar();
            },
            'quiz/:docId/:section/:activity': (docId, section, activity) => {
                // console.log('Quiz route with section:', { docId, section, activity });
                const sectionIdx = section === 'null' ? null : parseInt(section);
                UI.Quiz.render(docId, sectionIdx, activity);
                App.hideMediaBar();
            },
            'quiz/:docId/:activity': (docId, activity) => {
                // console.log('Quiz route without section:', { docId, activity });
                UI.Quiz.render(docId, null, activity);
                App.hideMediaBar();
            },
            'help': () => {
                // console.log('Navigating to help');
                UI.Help.render();
                App.hideMediaBar();
            },
            'bookmarks': () => {
                // console.log('Navigating to bookmarks');
                UI.Bookmarks.render();
                App.hideMediaBar();
            },
            'settings': () => {
                // console.log('Navigating to settings');
                App.showSettingsOverlay();
            }
        },

        init() {
            window.addEventListener('hashchange', () => this.handle());
            this.handle();
        },

        handle() {
            const hash = window.location.hash.slice(1) || 'library';
            // console.log('Routing to hash:', hash);

            // FORCE CLEANUP: Disable scroll listeners and stop playback before any route change
            Services.MediaService.disableScrollListeners();
            if (State.data.media.isPlaying) {
                Services.MediaService.stopSequence();
            }

            let matched = false;
            for (const [pattern, handler] of Object.entries(this.routes)) {
                const matches = this.matchRoute(pattern, hash);
                if (matches) {
                    // console.log('Route matched:', pattern, 'with params:', matches);
                    handler(...matches);
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                console.error('No route matched for:', hash);
                this.go('library');
            }
        },

        matchRoute(pattern, hash) {
            const patternParts = pattern.split('/');
            const hashParts = hash.split('/');

            if (patternParts.length !== hashParts.length) {
                return null;
            }

            const params = [];
            for (let i = 0; i < patternParts.length; i++) {
                if (patternParts[i].startsWith(':')) {
                    params.push(hashParts[i]);
                } else if (patternParts[i] !== hashParts[i]) {
                    return null;
                }
            }
            return params;
        },

        go(path) {
            // // console.log('Navigating to:', path);
            location.hash = path;
        }
    };

    // ----------------------------------------------------------------------------
    // 2. DATA MODELS - Transform V2 data into usable objects
    // ----------------------------------------------------------------------------

    const Models = {
        Document: class {
            constructor(data, currentLang) {
                this.id = data.documentId;
                this.metadata = data.metadata || {};
                this.vocabulary = new Models.Vocabulary(data.vocabulary || {});

                // Store document-level activity settings
                this.activity = data.activity || { words: false, sentences: false };
                this.activitySettings = data.activitySettings || { words: {}, sentences: {} };

                // Transform sections
                this.sections = (data.sections || []).map(s =>
                    new Models.Section(s, this, currentLang)
                );
            }

            // Get all word items from entire document (for document-level activities)
            getAllWordItems() {
                const words = [];
                this.sections.forEach(section => {
                    section.content.forEach(block => {
                        if (block.type === 'words') {
                            words.push(...block.words);
                        } else if (block.type === 'paragraph') {
                            block.sentences.forEach(sentence => {
                                words.push(...sentence.words);
                            });
                        }
                    });
                });
                // Remove duplicates by word text
                const uniqueWords = new Map();
                words.forEach(word => {
                    if (!uniqueWords.has(word.word)) {
                        uniqueWords.set(word.word, word);
                    }
                });
                return Array.from(uniqueWords.values());
            }

            // Get all sentence items from entire document
            getAllSentenceItems() {
                const sentences = [];
                this.sections.forEach(section => {
                    section.content.forEach(block => {
                        if (block.type === 'paragraph') {
                            sentences.push(...block.sentences);
                        }
                    });
                });
                return sentences;
            }
        },

        Vocabulary: class {
            constructor(data) {
                this.words = data || {};
                this.cache = new Map();
            }

            getWord(id) {
                if (this.cache.has(id)) return this.cache.get(id);
                const wordData = this.words[id];
                if (!wordData) return null;
                const resolved = {
                    id,
                    word: id,
                    translations: wordData.translations || {},
                    alternatives: wordData.alternatives || [],
                    blankable: wordData.blankable || false
                };
                this.cache.set(id, resolved);
                return resolved;
            }

            resolveWordIds(ids = []) {
                return ids.map(id => this.getWord(id)).filter(w => w);
            }
        },

        Section: class {
            constructor(data, document, currentLang) {
                this.id = data.sectionId || `section-${Math.random()}`;
                this.heading = data.heading?.[currentLang] || data.heading?.en || 'Section';
                this.document = document;

                // Section-level activity settings - use provided values or defaults
                this.activity = {
                    alphabet: data.activity?.alphabet ?? false,
                    words: data.activity?.words ?? false,
                    sentences: data.activity?.sentences ?? false
                };

                /*  console.log('Section initialized:', {
                      id: this.id,
                      activity: this.activity,
                      sourceData: data.activity
                  });
  */

                // Process content items
                this.content = (data.content || []).map(item => {
                    if (item.type === 'words') {
                        return new Models.WordsContent(item, document.vocabulary, currentLang);
                    } else if (item.type === 'paragraph') {
                        return new Models.ParagraphContent(item, document.vocabulary, currentLang);
                    }
                    else if (item.type === 'alphabet-table') {
                        return new Models.AlphabetTableContent(item);
                    } else if (item.type === 'character-grid') {
                        return new Models.CharacterGridContent(item);
                    } else if (item.type === 'character-card') {
                        return new Models.CharacterCardContent(item);
                    } else if (item.type === 'sound-matching') {
                        return new Models.SoundMatching(item);
                    } else if (item.type === 'tone-rule-table') {
                        return new Models.ToneRuleTable(item);
                    } else if (item.type === 'explanation') {
                        return new Models.ExplanationContent(item);
                    }
                    return item;
                });
            }

            hasWordActivities() {
                return this.activity.words || false;
            }

            hasSentenceActivities() {
                return this.activity.sentences || false;
            }

            hasAlphabetActivities() {
                return this.activity.alphabet || false;
            }

            getCharacterItems() {
                const characters = [];
                this.content.forEach(block => {
                    if (block.type === 'alphabet-table') {
                        characters.push(...block.characters);
                    }
                });
                return characters;
            }

            // Get all available activity types for this section
            getActivityTypes() {
                const types = [];
                if (this.hasWordActivities()) {
                    types.push(
                        'multipleChoiceWord',
                        'flashcardWord'
                    );
                }
                if (this.hasSentenceActivities()) {
                    types.push(
                        'multipleChoiceSentence',
                        'flashcardSentence',
                        'buildSentence'
                    );
                }
                return types;
            }
        },

        WordsContent: class {
            constructor(data, vocabulary, currentLang) {
                this.type = 'words';
                this.heading = data.heading?.[currentLang] || data.heading?.en;
                this.activity = data.activity;
                this.words = vocabulary.resolveWordIds(data.wordIds || []);
            }
        },

        ParagraphContent: class {
            constructor(data, vocabulary, currentLang) {
                this.type = 'paragraph';
                this.heading = data.heading?.[currentLang] || data.heading?.en;
                this.grammar = data.grammar;
                this.activity = data.activity;

                this.sentences = (data.sentences || []).map(s => {
                    // Debug: log the wordIds being resolved
                    // console.log(`Resolving wordIds for sentence "${s.source}":`, s.wordIds);
                    const words = vocabulary.resolveWordIds(s.wordIds || []);
                    //  console.log(`Resolved words:`, words.map(w => w.word));

                    return {
                        source: s.source,
                        translations: s.translations || {},
                        grammar: s.grammar,
                        words: words
                    };
                });
            }
        },

        // ============================================================================
        // ADD THIS AFTER Models.ParagraphContent
        // ============================================================================

        // Alphabet Character class
        AlphabetCharacter: class {
            constructor(data) {
                this.id = data.id || data.symbol;
                this.symbol = data.symbol;
                this.sound = data.sound;
                this.name = data.name;
                this.meaning = data.meaning;
                this.class = data.class; // 'middle', 'high', 'low-paired', 'low-unpaired'
                this.audio = data.audio;
                this.strokeOrder = data.strokeOrder || [];
                this.examples = (data.examples || []).map(ex => ({
                    word: ex.word,
                    meaning: ex.meaning,
                    audio: ex.audio
                }));
            }
        },

        // New content types for alphabet learning
        AlphabetTableContent: class {
            constructor(data) {
                this.type = 'alphabet-table';
                this.title = data.title;
                this.classification = data.classification;
                this.characters = (data.characters || []).map(c =>
                    new Models.AlphabetCharacter(c)
                );
            }
        },

        CharacterGridContent: class {
            constructor(data) {
                this.type = 'character-grid';
                this.characters = data.characters || [];
                this.display = data.display || 'grid';
            }
        },

        CharacterCardContent: class {
            constructor(data) {
                this.type = 'character-card';
                this.characterId = data.characterId;
                this.showStrokeOrder = data.showStrokeOrder || false;
                this.showExamples = data.showExamples || false;
            }
        },

        SoundMatching: class {
            constructor(data) {
                this.type = 'sound-matching';
                this.title = data.title;
                this.items = data.items || [];
            }
        },

        ToneRuleTable: class {
            constructor(data) {
                this.type = 'tone-rule-table';
                this.class = data.class;
                this.rules = data.rules || [];
                this.examples = data.examples || [];
            }
        },

        ExplanationContent: class {
            constructor(data) {
                this.type = 'explanation';
                this.text = data.text;
            }
        }

    };

    // ----------------------------------------------------------------------------
    // 3. SERVICES - Business logic
    // ----------------------------------------------------------------------------

    const Services = {

        ActivityResolver: class {
            constructor(globalSettings, localSettings) {
                this.global = globalSettings || { words: {}, sentences: {} };
                this.local = localSettings || {};
                // // console.log('ActivityResolver created with:', { global: this.global, local: this.local });
            }

            resolveForContent(contentItem, sectionLevel = false) {
                /*
                console.log('Resolving activities for:', {
                    contentItem,
                    sectionLevel,
                    global: this.global,
                    local: this.local
                });
*/
                if (contentItem?.activity?.types?.length) {
                    // console.log('Content has explicit types');
                    return contentItem.activity.types;
                }

                if (contentItem?.activity?.inherit === true) {
                    // console.log('Content inherits from global');
                    return this.getGlobalTypes(contentItem.type);
                }

                if (sectionLevel) {
                    // console.log('Section-level resolution');
                    if (this.local.inherit === true) {
                        return this.getAllDocumentTypes();
                    }
                    return this.getGlobalTypes('section');
                }

                if (this.global.inherit === true) {
                    // console.log('Document-level inheritance detected');
                    return this.getAllDocumentTypes();
                }

                if (contentItem?.type) {
                    const types = this.getGlobalTypes(contentItem.type);
                    if (types.length > 0) {
                        // console.log('Using global types for', contentItem.type, types);
                        return types;
                    }
                }

                // console.log('No activities found');
                return [];
            }

            getGlobalTypes(type) {
                if (type === 'words') {
                    return this.global.words?.types || [];
                } else if (type === 'paragraph' || type === 'section') {
                    return this.global.sentences?.types || [];
                }
                return [];
            }

            getAllDocumentTypes() {
                const wordTypes = this.global.words?.types || [];
                const sentenceTypes = this.global.sentences?.types || [];
                const allTypes = [...new Set([...wordTypes, ...sentenceTypes])];
                // console.log('All document types:', allTypes);
                return allTypes;
            }
        },

        DataService: {
            async loadManifest() {
                const response = await fetch('./data/manifest.json');
                State.data.manifest = await response.json();
                return State.data.manifest;
            },

            // In app.js, modify the DataService.loadDocument method:

            async loadDocument(documentId) {
                const filePath = this.findDocumentPath(documentId);
                // Add cache busting parameter
                const response = await fetch(filePath + '?t=' + Date.now());
                const data = await response.json();

                // Debug: log all vocabulary entries before creating the document
                //  console.log('Vocabulary from JSON:', Object.keys(data.vocabulary || {}));

                State.data.currentDocument = new Models.Document(data, State.data.lang);
                EventBus.emit('document:loaded', State.data.currentDocument);
                return State.data.currentDocument;
            },

            findDocumentPath(documentId) {
                for (const obj of State.data.manifest.learningObjects) {
                    const doc = obj.documents.find(d => d.id === documentId);
                    if (doc) return doc.filePath;
                }
                throw new Error(`Document ${documentId} not found`);
            }
        },

        MediaService: {
            cachedVoices: [],
            scrollTimeout: null,
            currentRowId: null,
            scrolledRows: new Set(),
            _isSeeking: false,
            _seekQueue: null,
            _seekTimer: null,

            init() {

                // Watch for DOM changes to detect when document content is removed
                this.domObserver = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                        if (mutation.removedNodes.length > 0) {
                            // Check if any removed node was the document content
                            const wasDocumentRemoved = Array.from(mutation.removedNodes).some(node =>
                                node.nodeType === 1 && node.querySelector?.('.document-content')
                            );

                            if (wasDocumentRemoved && State.data.media.isPlaying) {
                                // console.log('Document content removed, stopping playback');
                                this.stopSequence();
                            }
                        }
                    }
                });

                this.domObserver.observe(document.getElementById('main-content'), {
                    childList: true,
                    subtree: true
                });

                window.speechSynthesis.onvoiceschanged = () => {
                    this.cachedVoices = window.speechSynthesis.getVoices();
                    this.autoSelectThaiVoice();
                };

                setTimeout(() => {
                    if (window.speechSynthesis.getVoices().length > 0) {
                        this.cachedVoices = window.speechSynthesis.getVoices();
                        this.autoSelectThaiVoice();
                    }
                }, 100);

                const pauseOnInteraction = (event) => {

                    const mainContent = document.getElementById('main-content');
                    const isInDocument = mainContent?.querySelector('.document-content') !== null;

                    if (!isInDocument) {
                        // console.log('Not in document view, ignoring pause');
                        return;
                    }

                    // EARLY RETURN: If playback is already stopped, do nothing
                    if (!State.data.media.isPlaying) {
                        return;
                    }
                    /*
                                        // console.log('pauseOnInteraction triggered by:', event?.type || 'unknown', {
                                            isPlaying: State.data.media.isPlaying,
                                            isAutoScrolling: State.data.isAutoScrolling,
                                            scrollLockUntil: window.scrollLockUntil,
                                            currentTime: Date.now()
                                        });
                    */
                    // Don't pause if we're in auto-scroll mode
                    if (State.data.isAutoScrolling) {
                        // console.log('Auto-scrolling in progress, ignoring pause');
                        return;
                    }

                    // Check if we're in the scroll buffer period
                    if (window.scrollLockUntil && Date.now() < window.scrollLockUntil) {
                        // console.log('In scroll buffer period, ignoring pause');
                        return;
                    }

                    // Special handling for keyboard events
                    if (event?.type === 'keydown') {
                        const e = event;
                        if (e.key.includes('Arrow') || e.key === ' ' || e.key.includes('Page')) {
                            if (State.data.isAutoScrolling) {
                                // console.log('Keyboard navigation during auto-scroll, ignoring');
                                return;
                            }
                        }
                    }

                    // Additional check for scroll events - if we've just scrolled, add extra buffer
                    if (event?.type === 'scroll') {
                        // Check if we've scrolled recently (within last 500ms)
                        const lastScrollTime = window.lastScrollTime || 0;
                        const now = Date.now();
                        window.lastScrollTime = now;

                        if (now - lastScrollTime < 500) {
                            // console.log('Rapid scroll detected, adding extra buffer');
                            window.scrollLockUntil = now + 300;
                            return;
                        }
                    }

                    if (State.data.media.isPlaying) {
                        // console.log('PAUSING playback due to interaction');
                        State.data.media.isPlaying = false;
                        window.speechSynthesis.cancel();

                        document.querySelectorAll('.active-highlight').forEach(el => {
                            el.classList.remove('active-highlight');
                        });

                        App.showMediaBar();
                    }
                };

                // Pause on scroll (any scroll, not just wheel)
                window.addEventListener('scroll', (event) => {
                    if (Services.MediaService._scrollListenersEnabled) {
                        pauseOnInteraction(event);
                    }
                }, { passive: true });

                // Pause on wheel (mouse/trackpad)
                window.addEventListener('wheel', (event) => {
                    if (Services.MediaService._scrollListenersEnabled) {
                        pauseOnInteraction(event);
                    }
                }, { passive: true });

                // Pause on touch movement
                window.addEventListener('touchmove', (event) => {
                    if (Services.MediaService._scrollListenersEnabled) {
                        pauseOnInteraction(event);
                    }
                }, { passive: true });

                // Pause on touch start (user tapping somewhere)
                window.addEventListener('touchstart', (event) => {
                    if (Services.MediaService._scrollListenersEnabled) {
                        pauseOnInteraction(event);
                    }
                }, { passive: true });

                // Pause on mouse down (user clicking)
                window.addEventListener('mousedown', (event) => {
                    if (Services.MediaService._scrollListenersEnabled) {
                        pauseOnInteraction(event);
                    }
                }, { passive: true });

                // Pause on keyboard navigation
                window.addEventListener('keydown', (e) => {
                    if (!Services.MediaService._scrollListenersEnabled) return;

                    // Pause on any navigation key
                    if (e.key.includes('Arrow') ||
                        e.key === ' ' ||
                        e.key.includes('Page') ||
                        e.key === 'Home' ||
                        e.key === 'End' ||
                        e.key === 'Tab') {
                        pauseOnInteraction(e);
                    }
                });

                // Pause when window loses focus (user switches tabs)
                window.addEventListener('blur', (event) => {
                    if (Services.MediaService._scrollListenersEnabled) {
                        pauseOnInteraction(event);
                    }
                });

                // Pause when visibility changes (user switches tabs)
                document.addEventListener('visibilitychange', () => {
                    if (Services.MediaService._scrollListenersEnabled && document.hidden && State.data.media.isPlaying) {
                        pauseOnInteraction();
                    }
                });

                // Intersection Observer to pause when element goes out of view
                this.observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (!entry.isIntersecting && State.data.media.isPlaying && !State.data.isAutoScrolling) {
                            // Current playing element is no longer visible
                            pauseOnInteraction();
                        }
                    });
                }, {
                    threshold: 0.1, // Trigger when less than 10% visible
                    rootMargin: '0px'
                });

                // Store observer to observe elements later
                this.observer = this.observer;
            },

            observeCurrentElement(element) {
                // Disconnect previous observations
                if (this.observer) {
                    this.observer.disconnect();
                }
                // Observe the new element
                if (element && this.observer) {
                    this.observer.observe(element);
                }
            },

            handleUserInteraction() {
                if (State.data.media.isPlaying && !State.data.isAutoScrolling) {
                    this.pausePlayback();
                }
            },

            pausePlayback() {
                State.data.media.isPlaying = false;
                window.speechSynthesis.cancel();
                App.showMediaBar(); // Refresh media bar
            },

            autoSelectThaiVoice() {
                if (!State.data.media.voice) {
                    const thaiVoice = this.cachedVoices.find(v => v.lang.startsWith('th'));
                    if (thaiVoice) {
                        State.data.media.voice = thaiVoice.name;
                        State.save('media');
                    }
                }
            },

            getLocaleFor(lang) {
                const map = { th: 'th-TH', en: 'en-US', fa: 'fa-IR' };
                return map[lang] || 'en-US';
            },

            speak(text, lang, onStart, onEnd) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = this.getLocaleFor(lang);
                utterance.rate = State.data.media.speed;
                utterance.pitch = State.data.media.pitch;

                if (lang === 'th' && State.data.media.voice) {
                    const voice = this.cachedVoices.find(v => v.name === State.data.media.voice);
                    if (voice) utterance.voice = voice;
                }

                if (onStart) utterance.onstart = onStart;
                if (onEnd) utterance.onend = onEnd;

                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(utterance);
            },

            getElementsByRow() {
                const elements = Array.from(document.querySelectorAll('.audio-element'));
                const rows = new Map();

                elements.forEach((element, index) => {
                    // For word cards, group by the parent words-grid
                    let rowElement = element.closest('.words-grid') ||
                        element.closest('.alphabet-grid') ||  // Add this
                        element.closest('.character-grid') || // Add this
                        element.closest('.match-items');      // Add this

                    // If not in a grid, use normal grouping
                    if (!rowElement) {
                        rowElement = element.closest('.sentence-group') ||
                            element.closest('.word-card') ||
                            element.closest('.flashcard-front') ||
                            element.closest('.quiz-question-card') ||
                            element.closest('.tone-rule-table-container') || // Add this
                            element.closest('.sound-item');                   // Add this
                    }

                    const rowId = rowElement?.id || rowElement?.getAttribute('data-uid') || `row-${index}`;

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

            enableScrollListeners() {
                // Only enable if we're in a document view
                const mainContent = document.getElementById('main-content');
                const isInDocument = mainContent?.querySelector('.document-content') !== null;

                if (!isInDocument) {
                    // console.log('Not in document view, not enabling scroll listeners');
                    return;
                }

                if (this._scrollListenersEnabled) return;

                this._scrollListenersEnabled = true;
                // console.log('Scroll listeners enabled');
            },

            disableScrollListeners() {
                if (!this._scrollListenersEnabled) return;

                this._scrollListenersEnabled = false;
                // console.log('Scroll listeners disabled');
            },

            stopSequence() {
                // console.log('stopSequence called');

                // Always stop playback regardless of current state
                State.data.media.isPlaying = false;
                State.data.media.currentIndex = 0;

                // Clear tracking
                if (State.data.scrolledRows) {
                    State.data.scrolledRows.clear();
                }
                State.data.currentRowId = null;

                // Cancel any ongoing speech
                window.speechSynthesis.cancel();

                // Remove all highlights
                document.querySelectorAll('.active-highlight').forEach(el => {
                    el.classList.remove('active-highlight');
                });

                // Disconnect observers
                if (this.observer) {
                    this.observer.disconnect();
                }

                if (this.domObserver) {
                    this.domObserver.disconnect();
                }

                // CRITICAL: Disable scroll listeners when playback stops
                this.disableScrollListeners();

                // Clear any pending scroll locks
                window.scrollLockUntil = null;
                window.lastScrollTime = null;

                // Refresh the media bar to show stopped state
                App.showMediaBar();

                // console.log('After stop: Playback stopped and listeners disabled');
            },

            isElementInViewport(el) {
                const rect = el.getBoundingClientRect();
                return (
                    rect.top >= 0 &&
                    rect.left >= 0 &&
                    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );
            },

            isSequenceElement(el) {
                // If we're showing word breakdowns, include them in the sequence
                if (State.data.media.showWordBreakdown) {
                    // Check if this is a word breakdown element
                    const isBreakdownElement =
                        el.classList.contains('sent-word-item') ||
                        el.classList.contains('sent-word-trans') ||
                        (el.hasAttribute('data-link') && el.closest('.sent-word-block'));

                    if (isBreakdownElement) {
                        //   console.log('  → Including word breakdown element in sequence');
                        return true;
                    }
                }

                // If it has data-link, it's a linked element (word breakdown) - NOT sequence when breakdown is OFF
                if (el.hasAttribute('data-link') && !State.data.media.showWordBreakdown) {
                    return false;
                }

                // If it's inside sent-word-block, it's a breakdown - NOT sequence when breakdown is OFF
                if (el.closest('.sent-word-block') && !State.data.media.showWordBreakdown) {
                    return false;
                }

                // Check by class - these are ALWAYS breakdown elements
                const classList = el.classList;

                if (!State.data.media.showWordBreakdown) {
                    // When breakdown is OFF, filter these out
                    if (classList.contains('sent-word-item') ||
                        classList.contains('sent-word-trans') ||
                        classList.contains('matched-word')) {
                        return false;
                    }
                }

                // These classes are ALWAYS main sequence elements
                if (classList.contains('word-source') ||
                    classList.contains('word-trans') ||
                    classList.contains('alphabet-grid-item') ||
                    classList.contains('character-grid-item') ||
                    classList.contains('example-word')) {
                    //    console.log('  → Included: is main sequence element by class');
                    return true;
                }

                // Check for elements with data-uid (sentences and translations)
                if (el.hasAttribute('data-uid')) {
                    // If it's a sentence or translation, include it
                    if (el.closest('.sentence-group') || el.closest('.stack-item')) {
                        //   console.log('  → Included: has data-uid and is in sentence group');
                        return true;
                    }
                }

                // Check for elements in sentence-group with source or trans classes
                if (el.closest('.sentence-group')) {
                    if (classList.contains('source') || classList.contains('trans')) {
                        //   console.log('  → Included: in sentence-group with source/trans');
                        return true;
                    }
                }

                // Check for elements in alphabet-table-container
                if (el.closest('.alphabet-table-container') !== null) {
                    //  console.log('  → Included: in alphabet-table-container');
                    return true;
                }

                // Check for word breakdown elements when setting is ON
                if (State.data.media.showWordBreakdown) {
                    // Include any element that has data-text and is in a word breakdown context
                    if (el.hasAttribute('data-text') &&
                        (el.closest('.sent-word-block') ||
                            el.classList.contains('sent-word-item') ||
                            el.classList.contains('sent-word-trans'))) {
                        //   console.log('  → Included: word breakdown element');
                        return true;
                    }
                }

                //  console.log('  → Filtered out: no matching criteria');
                return false;
            },
            seekToElement: function (element) {
                // Clear any pending seek timer
                if (this._seekTimer) {
                    clearTimeout(this._seekTimer);
                    this._seekTimer = null;
                }

                // Prevent multiple seeks
                if (this._isSeeking) {
                    //  console.log('Already seeking, queueing this request');
                    this._seekQueue = element;
                    return;
                }

                this._isSeeking = true;
                this._seekQueue = null;

                // Get all audio elements
                const allElements = Array.from(document.querySelectorAll('.audio-element'));

                const sequenceElements = allElements.filter(el => this.isSequenceElement(el));

                //  console.log('Seek - All elements:', allElements.length);
                //   console.log('Seek - Sequence elements:', sequenceElements.length);
                //   console.log('Seek - Clicked element classes:', element.classList);
                //   console.log('Seek - Clicked element has data-uid:', element.hasAttribute('data-uid'));

                const targetIndex = sequenceElements.indexOf(element);

                if (targetIndex !== -1) {
                    //        console.log('Found in sequence at index:', targetIndex);

                    // Check if the element is inside a closed details panel and open it
                    const details = element.closest('details');
                    if (details && !details.open) {
                        details.open = true;

                        // Find the section index from the details element
                        const sectionIndex = details.getAttribute('data-section-index');
                        if (sectionIndex !== null) {
                            const documentId = State.data.currentDocument?.id;
                            if (documentId) {
                                State.data.documentAccordion.openSections[documentId] = parseInt(sectionIndex);
                                State.save('documentAccordion');
                            }
                        }

                        // Small delay to allow the details panel to expand
                        setTimeout(() => {
                            this.performSeekWithScroll(element, targetIndex);
                        }, 150);
                    } else {
                        this.performSeekWithScroll(element, targetIndex);
                    }
                } else {
                    //   console.log('Element not in sequence, playing directly');
                    // If the element isn't in the sequence elements, just play it directly
                    const text = element.getAttribute('data-text') || element.textContent.trim();
                    const lang = element.getAttribute('data-lang') || 'th';
                    window.speechSynthesis.cancel();
                    Services.MediaService.speak(text, lang);
                    this._isSeeking = false;
                }
            },

            performSeekWithScroll: function (element, targetIndex) {
                // Cancel any ongoing speech immediately
                window.speechSynthesis.cancel();

                // Reset playback state
                State.data.media.isPlaying = false;
                State.data.media.currentIndex = targetIndex;

                // Clear tracking
                if (State.data.scrolledRows) {
                    State.data.scrolledRows.clear();
                }
                State.data.currentRowId = null;

                // Remove all highlights
                document.querySelectorAll('.active-highlight').forEach(el => {
                    el.classList.remove('active-highlight');
                });

                // Calculate total offset based on media bar visibility
                const toolbarHeight = 56;
                const mediaBar = document.getElementById('media-player-container');
                const mediaBarHeight = mediaBar && mediaBar.innerHTML ? 50 : 0;
                const totalOffset = toolbarHeight + mediaBarHeight + 20;

                // Scroll to the element with offset
                setTimeout(() => {
                    const rect = element.getBoundingClientRect();
                    const absoluteTop = window.scrollY + rect.top;
                    const offsetPosition = absoluteTop - totalOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }, 100);

                // Clear any existing playback timeouts
                if (window._playbackTimer) {
                    clearTimeout(window._playbackTimer);
                    window._playbackTimer = null;
                }

                // Small delay to ensure everything is reset
                window._playbackTimer = setTimeout(() => {
                    // Start playback
                    State.data.media.isPlaying = true;
                    App.playSequence();
                    App.updatePlayPauseIcon(true);
                    window._playbackTimer = null;

                    // Reset seeking flag after playback starts
                    this._seekTimer = setTimeout(() => {
                        this._isSeeking = false;
                        this._seekTimer = null;

                        // Check if there's a queued seek
                        if (this._seekQueue) {
                            const queuedElement = this._seekQueue;
                            this._seekQueue = null;
                            this.seekToElement(queuedElement);
                        }
                    }, 800);
                }, 200); // Increased from 150 to 200ms
            },

            togglePlay() {
                State.data.media.isPlaying = !State.data.media.isPlaying;
                if (State.data.media.isPlaying) {
                    this.playSequence();
                    this.updatePlayPauseIcon(true);
                } else {
                    Services.MediaService.pausePlayback();
                    this.updatePlayPauseIcon(false);
                }
                this.showMediaBar();
            }

        },

        I18n: {
            async loadTranslations() {
                const response = await fetch(`./locales/${State.data.lang}.json`);
                State.data.translations = await response.json();
            },

            t(key, fallback = '') {
                return State.data.translations[key] || fallback;
            }
        },

        PronunciationService: {
            pronunciationMap: null,

            async init() {
                try {
                    // Change this path to point to data/TSL/
                    const response = await fetch('./data/TSL/pronunciation-map.json');
                    this.pronunciationMap = await response.json();
                } catch (e) {
                    console.warn('Could not load pronunciation map', e);
                    this.pronunciationMap = { characterPronunciations: {}, characterNames: {} };
                }
            },

            getCharacterSpeech(character, mode = 'sound') {
                if (!this.pronunciationMap) return character;

                const charData = this.pronunciationMap.characterPronunciations?.[character];
                if (!charData) return character;

                switch (mode) {
                    case 'sound':
                        return charData.th || character;
                    case 'name':
                        const name = this.pronunciationMap.characterNames?.[character];
                        return name ? `${charData.th || character} ${name}` : (charData.th || character);
                    case 'description':
                        return charData.description || character;
                    default:
                        return charData.th || character;
                }
            },

            speakCharacter(character, mode = 'sound') {
                const text = this.getCharacterSpeech(character, mode);
                Services.MediaService.speak(text, 'th');
            },

            speakWord(word, slow = false) {
                if (slow) {
                    const chars = word.split('');
                    let index = 0;

                    const speakNext = () => {
                        if (index < chars.length) {
                            const char = chars[index];
                            const text = this.getCharacterSpeech(char, 'sound');
                            Services.MediaService.speak(text, 'th', null, () => {
                                index++;
                                setTimeout(speakNext, 300);
                            });
                        }
                    };
                    speakNext();
                } else {
                    Services.MediaService.speak(word, 'th');
                }
            }
        }

    };

    // ----------------------------------------------------------------------------
    // 4. UI RENDERERS - All HTML generation
    // ----------------------------------------------------------------------------

    const UI = {

        escapeHtml(str) {
            if (str == null) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        },

        getContainer() {
            return document.getElementById('main-content');
        },

        // ------------------------------------------------------------------------
        // Library View
        // ------------------------------------------------------------------------
        Library: {
            render() {
                const container = UI.getContainer();
                if (!container) return;

                const manifest = State.data.manifest;
                const lang = State.data.lang;
                const t = Services.I18n.t;

                // Get current open section from state
                const openSection = State.data.libraryAccordion.openSection;

                let html = '<div class="library-container">';

                manifest.learningObjects.forEach((obj, idx) => {
                    const title = obj.title[lang] || obj.title.en;
                    const isOpen = idx === openSection;

                    html += `
            <details class="library-section" ${isOpen ? 'open' : ''} data-section-index="${idx}">
                <summary class="library-summary" onclick="App.handleLibraryAccordion(${idx})">
                    <span class="material-icons">expand_more</span>
                    <span class="library-title">${UI.escapeHtml(title)}</span>
                    <span class="library-count">(${obj.documents.length})</span>
                </summary>
                <div class="library-docs">
        `;

                    obj.documents.forEach(doc => {
                        const docTitle = doc.title[lang] || doc.title.en;
                        const isLastDocument = doc.id === State.data.lastDocument;
                        html += `
                <button class="doc-btn ${isLastDocument ? 'last-opened' : ''}" 
                        onclick="App.handleDocumentClick('${doc.id}')">
                    <span class="material-icons doc-btn-icon">description</span>
                    <span class="doc-btn-text">${UI.escapeHtml(docTitle)}</span>
                    <span class="material-icons doc-btn-arrow">chevron_right</span>
                </button>
            `;
                    });

                    html += `</div></details>`;
                });

                html += '</div>';
                container.innerHTML = html;
            }
        },

        // ------------------------------------------------------------------------
        // Document View
        // ------------------------------------------------------------------------
        Document: {

            async render(documentId) {
                const container = UI.getContainer();
                if (!container) return;

                container.innerHTML = '<div class="loading-spinner"></div>';

                try {
                    const doc = await Services.DataService.loadDocument(documentId);
                    const lang = State.data.lang;
                    const t = Services.I18n.t;

                    // Store this as the last opened document
                    State.data.lastDocument = documentId;
                    State.save('lastDocument');

                    // Get saved accordion state for this document
                    const docAccordion = State.data.documentAccordion;

                    // Initialize if this document doesn't have a saved state
                    if (docAccordion.openSections[documentId] === undefined) {
                        docAccordion.openSections[documentId] = 0; // First section open by default
                        State.save('documentAccordion');
                    }

                    let html = `<div class="document-content">`;

                    const documentActivities = this.getDocumentActivities(doc);
                    html += `<div class="document-controls-wrapper">`;

                    documentActivities.forEach(activity => {
                        if (activity === 'flashcardCharacter') {
                            html += `
            <button class="btn-flashcard" onclick="App.startFlashcards('${doc.id}', null, 'character')">
                <span class="material-icons">style</span>
                <span>${t('characters', 'Characters')}</span>
            </button>
        `;
                        } else if (activity === 'flashcardWord') {
                            html += `
            <button class="btn-flashcard" onclick="App.startFlashcards('${doc.id}', null, 'word')">
                <span class="material-icons">style</span>
                <span>${t('words', 'Words')}</span>
            </button>
        `;
                        } else if (activity === 'flashcardSentence') {
                            html += `
            <button class="btn-flashcard" onclick="App.startFlashcards('${doc.id}', null, 'sentence')">
                <span class="material-icons">style</span>
                <span>${t('sentences', 'Sentences')}</span>
            </button>
        `;
                        } else if (activity === 'buildSentence') {
                            html += `
            <button class="btn-sentence-game" onclick="App.startSentenceGame('${doc.id}', null)">
                <span class="material-icons">dashboard</span>
                <span>${t('sentences', 'Sentences')}</span>
            </button>
        `;
                        } else if (activity.startsWith('multipleChoice')) {
                            const isWord = activity.includes('Word');
                            html += `
            <button class="doc-quiz-btn" onclick="location.hash='quiz/${doc.id}/null/${activity}'">
                <span class="material-icons">quiz</span>
                <span>${isWord ? t('words', 'Words') : t('sentences', 'Sentences')}</span>
            </button>
        `;
                        }
                    });

                    html += `</div>`;

                    doc.sections.forEach((section, idx) => {
                        const isOpen = docAccordion.openSections[documentId] === idx;

                        html += `
        <details class="section-details" ${isOpen ? 'open' : ''} data-section-index="${idx}"
                 ontoggle="App.handleDetailsToggle(this, this.open)">
            <summary onclick="App.handleDocumentAccordion('${documentId}', ${idx})">
                <span class="section-title-text">${UI.escapeHtml(section.heading)}</span>
            </summary>
            <div class="section-card">
                ${UI.Document.renderSectionControls(doc.id, idx, section)}
                ${UI.Document.renderContent(section.content, idx)}
            </div>
        </details>
    `;
                    });

                    html += '</div>';
                    container.innerHTML = html;
                } catch (error) {
                    container.innerHTML = `<div class="card">Error loading document: ${error.message}</div>`;
                }
            },

            getDocumentActivities(doc) {
                const activities = [];

                if (doc.activity?.words) {
                    activities.push('multipleChoiceWord', 'flashcardWord');
                }

                if (doc.activity?.sentences) {
                    activities.push('multipleChoiceSentence', 'flashcardSentence', 'buildSentence');
                }

                if (doc.activity?.alphabet) {
                    activities.push('flashcardCharacter');
                }

                return [...new Set(activities)];
            },

            renderSectionControls(docId, sectionIdx, section) {
                const t = Services.I18n.t;
                /*
                                console.log('Rendering section controls for:', {
                                    sectionId: section.id,
                                    hasWordActivities: section.hasWordActivities(),
                                    hasSentenceActivities: section.hasSentenceActivities(),
                                    hasAlphabetActivities: section.hasAlphabetActivities(),
                                    activity: section.activity,
                                    documentActivity: section.document.activity
                                });
                */

                let html = '<div class="section-all-controls">';

                // Word-based activities
                if (section.hasWordActivities()) {
                    html += `
            <button class="btn-flashcard-small" onclick="App.startFlashcards('${docId}', ${sectionIdx}, 'word')">
                <span class="material-icons">style</span>
                <span>${t('words', 'Words')}</span>
            </button>
            <button class="section-quiz-btn" onclick="location.hash='quiz/${docId}/${sectionIdx}/multipleChoiceWord'">
                <span class="material-icons">quiz</span>
                <span>${t('words', 'Words')}</span>
            </button>
        `;
                }

                // Sentence-based activities
                if (section.hasSentenceActivities()) {
                    html += `
            <button class="btn-flashcard-small" onclick="App.startFlashcards('${docId}', ${sectionIdx}, 'sentence')">
                <span class="material-icons">style</span>
                <span>${t('sentences', 'Sentences')}</span>
            </button>
            <button class="btn-sentence-game-small" onclick="App.startSentenceGame('${docId}', ${sectionIdx})">
                <span class="material-icons">dashboard</span>
                <span>${t('sentences', 'Sentences')}</span>
            </button>
            <button class="section-quiz-btn" onclick="location.hash='quiz/${docId}/${sectionIdx}/multipleChoiceSentence'">
                <span class="material-icons">quiz</span>
                <span>${t('sentences', 'Sentences')}</span>
            </button>
        `;
                }

                // Character-based activities (for alphabet)
                if (section.hasAlphabetActivities()) {
                    html += `
            <button class="btn-flashcard-small" onclick="App.startFlashcards('${docId}', ${sectionIdx}, 'character')">
                <span class="material-icons">style</span>
                <span>${t('characters', 'Characters')}</span>
            </button>
        `;
                }

                html += '</div>';
                return html;
            },

            renderContent(content, sectionIdx) {
                return content.map((item, blockIdx) => {
                    let html = '';

                    // Render heading with grammar icon inline (if heading exists)
                    if (item.heading) {
                        const grammarId = `grammar-${sectionIdx}-${blockIdx}`;
                        const grammarIcon = (item.type === 'paragraph' && item.grammar) ? `
                <button class="grammar-icon-btn-inline" 
                        onclick="App.showGrammarSheet('${grammarId}')"
                        aria-label="Show grammar explanation"
                        title="View grammar note">
                    <span class="material-icons">menu_book</span>
                </button>
            ` : '';

                        html += `
                <div class="heading-with-grammar">
                    ${grammarIcon}
                    <h3 class="block-heading">${UI.escapeHtml(item.heading)}</h3>
                </div>
            `;
                    }

                    // Render the content (NO separate grammar header here)
                    if (item.type === 'words') {
                        html += UI.Document.renderWords(item, sectionIdx, blockIdx);
                    } else if (item.type === 'paragraph') {
                        html += UI.Document.renderParagraph(item, sectionIdx, blockIdx);
                    } else if (item.type === 'explanation' ||
                        item.type === 'character-grid' ||
                        item.type === 'character-card' ||
                        item.type === 'matching-exercise' ||
                        item.type === 'sound-matching' ||
                        item.type === 'tone-rule-table' ||
                        item.type === 'alphabet-table') {
                        html += UI.alphabet.renderContent(item);
                    }

                    return html;
                }).join('');
            },

            renderWords(wordsContent, sectionIdx, blockIdx) {
                let html = '<div class="words-grid">';

                wordsContent.words.forEach((word, wordIdx) => {
                    const uid = `w-${sectionIdx}-${blockIdx}-${wordIdx}`;
                    html += UI.Document.renderWordCard(word, uid);
                });

                html += '</div>';
                return html;
            },

            renderWordCard(word, uid) {
                const settings = State.data.media.languageSettings;
                let html = '<div class="word-card">';

                if (settings.th?.show) {
                    html += `
                        <div class="word-source audio-element"
                             lang="th" dir="ltr"
                             data-text="${UI.escapeHtml(word.word)}"
                             data-lang="th"
                             onclick="App.media.play(this)">${UI.escapeHtml(word.word)}</div>
                    `;
                }

                html += '<div class="word-trans-group">';
                Object.entries(settings).forEach(([code, config]) => {
                    if (code !== 'th' && config.show && word.translations[code]) {
                        const dir = code === 'fa' ? 'rtl' : 'ltr';
                        html += `
                            <div class="word-trans lang-${code} audio-element"
                                 lang="${code}" dir="${dir}"
                                 data-text="${UI.escapeHtml(word.translations[code])}"
                                 data-lang="${code}"
                                 onclick="App.media.play(this)">${UI.escapeHtml(word.translations[code])}</div>
                        `;
                    }
                });
                html += '</div></div>';

                return html;
            },

            renderParagraph(paragraph, sectionIdx, blockIdx) {
                return paragraph.sentences.map((sentence, sentIdx) => {
                    const uid = `s-${sectionIdx}-${blockIdx}-${sentIdx}`;

                    // Debug: log the words being passed
                    //  console.log(`Sentence ${sentIdx}: "${sentence.source}" has words:`,
                    //  sentence.words.map(w => w.word));

                    let html = '<div class="sentence-group"><div class="stack-column">';

                    html += `
            <div class="source-wrapper">
                ${sentence.grammar ? `
                    <button class="grammar-icon-btn" onclick="App.showGrammarSheet('${uid}')">
                        <span class="material-icons">menu_book</span>
                    </button>
                ` : ''}
                <div class="stack-item source audio-element"
                     lang="th" dir="ltr"
                     data-text="${UI.escapeHtml(sentence.source)}"
                     data-lang="th"
                     data-uid="${uid}"
                     onclick="App.media.play(this)">
                    ${UI.Document.hydrateSource(sentence.source, sentence.words, uid)}
                </div>
            </div>
        `;

                    // Add word breakdown blocks
                    if (State.data.media.showWordBreakdown &&
                        State.data.media.languageSettings.th?.show &&
                        sentence.words.length) {
                        html += '<div class="sent-word-block">';
                        sentence.words.forEach((word, wordIdx) => {
                            // Create a unique ID for the breakdown item
                            const breakdownId = `${uid}-card-${wordIdx}`;
                            const sourceWordId = `source-${uid}-w-${wordIdx}`;

                            html += `
                                <div id="${breakdownId}" class="sent-word-item audio-element"
                                    data-text="${UI.escapeHtml(word.word)}"
                                    data-lang="th"
                                    data-link="${sourceWordId}"
                                    onclick="App.media.play(this)">
                                    <div class="sent-word-source">${UI.escapeHtml(word.word)}</div>
                                    ${Object.entries(State.data.media.languageSettings)
                                    .filter(([code]) => code !== 'th')
                                    .map(([code, config]) => config.show && word.translations[code] ? `
                                        <div class="sent-word-trans lang-${code} audio-element"
                                            lang="${code}" dir="${code === 'fa' ? 'rtl' : 'ltr'}"
                                            data-text="${UI.escapeHtml(word.translations[code])}"
                                            data-lang="${code}"
                                            data-link="${sourceWordId}"
                                            onclick="App.media.play(this); event.stopPropagation();">
                                            ${UI.escapeHtml(word.translations[code])}
                                        </div>
                                    ` : '').join('')}
                                </div>
                                `;
                        });
                        html += '</div>';
                    }

                    // Add translations
                    Object.entries(State.data.media.languageSettings).forEach(([code, config]) => {
                        if (code !== 'th' && config.show && sentence.translations[code]) {
                            const dir = code === 'fa' ? 'rtl' : 'ltr';
                            html += `
                    <div class="stack-item trans lang-${code} audio-element"
                         lang="${code}" dir="${dir}"
                         data-text="${UI.escapeHtml(sentence.translations[code])}"
                         data-lang="${code}"
                         data-uid="${uid}-trans-${code}"
                         onclick="App.media.play(this)">
                        ${UI.Document.renderTranslationSpan(sentence.translations[code], code, `${uid}-trans-${code}`)}
                    </div>
                `;
                        }
                    });

                    html += '</div></div>';
                    return html;
                }).join('');
            },

            hydrateSource(text, words, uid) {
                if (!words.length) return UI.escapeHtml(text);

                let html = '';
                let cursor = 0;
                let wordIndex = 0;

                while (cursor < text.length && wordIndex < words.length) {
                    const currentWord = words[wordIndex];
                    const wordText = currentWord.word;

                    // Check if the current word matches at the current cursor position
                    if (text.startsWith(wordText, cursor)) {
                        // Found a match - add it as a span with bidirectional links
                        const sourceWordId = `source-${uid}-w-${wordIndex}`;
                        const breakdownId = `${uid}-card-${wordIndex}`;

                        // FIX: Escape the word text content
                        html += `<span id="${sourceWordId}" 
                           class="word-span matched-word"
                           data-link="${breakdownId}"  
                           lang="th" dir="ltr">${UI.escapeHtml(wordText)}</span>`;
                        cursor += wordText.length;
                        wordIndex++;
                    } else {
                        // For Thai text, we need to be more careful - only add single characters
                        // when we're not at a word match to avoid breaking character clusters
                        const char = text[cursor];

                        // Check if this character might be part of a Thai character cluster
                        if (this.isThaiCompositeChar(text, cursor)) {
                            // Get the full character cluster (consonant + vowel/tone marks)
                            const cluster = this.getThaiCharCluster(text, cursor);
                            html += `<span class="unmatched-text">${UI.escapeHtml(cluster)}</span>`;
                            cursor += cluster.length;
                        } else {
                            // Add single character as unmatched text
                            html += `<span class="unmatched-text">${UI.escapeHtml(char)}</span>`;
                            cursor++;
                        }
                    }
                }

                // Add any remaining text after the last matched word
                if (cursor < text.length) {
                    const remainingText = text.slice(cursor);
                    html += `<span class="unmatched-text">${UI.escapeHtml(remainingText)}</span>`;
                }

                // Log if we didn't use all words
                if (wordIndex < words.length) {
                    console.warn(
                        `Not all words were matched in sentence "${text}":\n` +
                        `Used ${wordIndex} of ${words.length} words\n` +
                        `Remaining words: ${words.slice(wordIndex).map(w => w.word).join(', ')}`
                    );
                }

                return html;
            },

            // Helper method to check if a character is part of a Thai composite character
            isThaiCompositeChar(text, index) {
                if (index >= text.length) return false;

                const char = text[index];
                const charCode = char.charCodeAt(0);

                // Thai consonants range (ก-ฮ)
                if (charCode >= 0x0E01 && charCode <= 0x0E2E) return true;

                // Thai vowels that appear above/below (สระอา, สระอี, etc.)
                if (charCode >= 0x0E30 && charCode <= 0x0E3A) return true;

                // Thai tone marks (ไม้เอก, ไม้โท, ไม้ตรี, ไม้จัตวา)
                if (charCode >= 0x0E47 && charCode <= 0x0E4E) return true;

                // Thai vowel signs that appear above (สระอิ, สระอี, สระอึ, สระอื)
                if (charCode === 0x0E34 || charCode === 0x0E35 ||
                    charCode === 0x0E36 || charCode === 0x0E37) return true;

                return false;
            },

            // Helper method to get a complete Thai character cluster
            getThaiCharCluster(text, startIndex) {
                if (startIndex >= text.length) return '';

                let cluster = text[startIndex];
                let index = startIndex + 1;

                // Thai combining characters (vowels and tone marks that appear above/below)
                while (index < text.length) {
                    const char = text[index];
                    const charCode = char.charCodeAt(0);

                    // Check if this is a combining character (vowel or tone mark)
                    const isCombining = (
                        (charCode >= 0x0E30 && charCode <= 0x0E3A) || // vowels
                        (charCode >= 0x0E47 && charCode <= 0x0E4E) || // tone marks
                        charCode === 0x0E34 || charCode === 0x0E35 ||  // vowel signs
                        charCode === 0x0E36 || charCode === 0x0E37
                    );

                    if (isCombining) {
                        cluster += char;
                        index++;
                    } else {
                        break;
                    }
                }

                return cluster;
            },

            renderTranslationSpan(text, lang, uid) {
                if (!text) return '';

                const dir = lang === 'fa' ? 'rtl' : 'ltr';
                const tokens = text.split(/([^\p{L}\p{M}\p{N}\u200c]+)/u);
                let charPos = 0;

                return tokens.map(token => {
                    const isWord = /[\p{L}\p{N}]/u.test(token);
                    const start = charPos;
                    charPos += token.length;

                    if (isWord) {
                        return `<span id="${uid}-w-${start}" class="word-span"
                                       data-start="${start}" data-end="${charPos}"
                                       lang="${lang}" dir="${dir}">${UI.escapeHtml(token)}</span>`;
                    }
                    return UI.escapeHtml(token);
                }).join('');
            }
        },

        alphabet: {

            getCharacterData(characterId) {
                // This would need to be loaded from your data files
                // For now, return null - will be implemented when data is loaded
                return null;
            },

            renderContent(contentItem) {
                const self = this;

                switch (contentItem.type) {
                    case 'explanation':
                        return self.renderExplanation(contentItem);
                    case 'character-grid':
                        return self.renderCharacterGrid(contentItem);
                    case 'character-card':
                        return self.renderCharacterCard(contentItem);
                    // case 'matching-exercise':   ← DELETE this line
                    //     return self.renderMatchingExercise(contentItem); ← DELETE this line
                    case 'sound-matching':
                        return self.renderSoundMatching(contentItem);
                    case 'tone-rule-table':
                        return self.renderToneRuleTable(contentItem);
                    case 'alphabet-table':
                        return self.renderAlphabetTable(contentItem);
                    default:
                        console.warn('Unknown alphabet content type:', contentItem.type);
                        return '';
                }
            },

            renderExplanation(item) {
                const lang = State.data.lang;
                const text = item.text?.[lang] || item.text?.en || '';

                return `
            <details class="explanation-details">
                <summary>
                    <span class="material-icons">info</span>
                    <span>${lang === 'th' ? 'คำอธิบาย' : (lang === 'fa' ? 'توضیحات' : 'Explanation')}</span>
                </summary>
                <div class="explanation-content card">
                    <p>${UI.escapeHtml(text)}</p>
                </div>
            </details>
        `;
            },

            renderCharacterGrid(item) {
                return `
                    <div class="character-grid">
                        ${item.characters.map(char => {
                    const charId = char.id || char;
                    const charSymbol = char.symbol || char;
                    const charSound = char.sound || '';
                    const charClass = char.class || '';

                    // Determine class for color coding
                    let classType = '';
                    if (charClass === 'middle') {
                        classType = 'middle-class';
                    } else if (charClass === 'high') {
                        classType = 'high-class';
                    } else if (charClass === 'low-paired' || charClass === 'low-unpaired') {
                        classType = 'low-class';
                    }

                    return `
                                <button class="character-grid-item audio-element ${classType}" 
                                        onclick="App.media.play(this)"
                                        data-text="${charSymbol}" 
                                        data-lang="th"
                                        data-class="${charClass}">
                                    <span class="character-symbol">${charSymbol}</span>
                                    ${charSound ? `<span class="character-sound">${charSound}</span>` : ''}
                                    ${charClass ? `<span class="class-indicator ${charClass}">${charClass}</span>` : ''}
                                </button>
                            `;
                }).join('')}
                    </div>
                `;
            },

            renderCharacterCard(item) {
                // This will be fully implemented when character data is available
                const charId = item.characterId;
                return `
            <div class="character-card-detailed" data-character-id="${charId}">
                <div class="character-main">
                    <div class="character-large">${charId}</div>
                    <div class="character-info">
                        <div class="character-sound-large">Loading...</div>
                        <button class="btn-audio" onclick="App.Services.MediaService.speak('${charId}', 'th')">
                            <span class="material-icons">volume_up</span> Hear
                        </button>
                    </div>
                </div>
            </div>
        `;
            },

            renderSoundMatching(item) {
                return `
                    <div class="sound-matching-exercise">
                        <h3>${item.title?.[State.data.lang] || item.title?.en || 'Listen and choose'}</h3>
                        <div class="sound-items">
                            ${item.items.map((soundItem, index) => `
                                <div class="sound-item" data-index="${index}">
                                    <button class="btn-play-sound audio-element" 
                                            onclick="App.media.play(this)"
                                            data-text="${soundItem.sound}" 
                                            data-lang="th">
                                        <span class="material-icons">volume_up</span>
                                    </button>
                                    <div class="sound-options">
                                        ${this.renderSoundOptions(soundItem)}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            },

            renderSoundOptions(soundItem) {
                // Simplified - would need actual options from data
                return `
            <button class="sound-option" onclick="App.alphabet.checkSoundAnswer('${soundItem.characterId}', this)">
                <span class="character-symbol">?</span>
            </button>
        `;
            },

            renderToneRuleTable(item) {
                // Determine class for header color
                let classType = '';
                let className = item.class || '';
                if (className.toLowerCase().includes('middle')) {
                    classType = 'middle-class';
                } else if (className.toLowerCase().includes('high')) {
                    classType = 'high-class';
                } else if (className.toLowerCase().includes('low')) {
                    classType = 'low-class';
                }

                return `
                    <div class="tone-rule-table-container">
                        <h3 class="${classType}">${item.class} Class Tone Rules</h3>
                        <table class="tone-rule-table">
                            <thead>
                                <tr>
                                    <th class="${classType}">Condition</th>
                                    <th class="${classType}">Tone</th>
                                    <th class="${classType}">Example</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${item.rules.map(rule => `
                                    <tr>
                                        <td>${rule.condition}</td>
                                        <td><span class="tone-indicator tone-${rule.tone ? rule.tone.toLowerCase() : 'mid'}">${rule.tone || 'Mid'}</span></td>
                                        <td class="example-word audio-element ${classType}" 
                                            onclick="App.media.play(this)"
                                            data-text="${rule.example}" 
                                            data-lang="th">
                                            ${rule.example}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            },

            renderAlphabetTable(item) {
                return `
        <div class="alphabet-table-container">
            <h3>${item.title?.[State.data.lang] || item.title?.en || ''}</h3>
            <div class="alphabet-grid">
                ${item.characters.map(char => {
                    // Determine class for color coding
                    let classType = '';
                    if (char.class === 'middle') {
                        classType = 'middle-class';
                    } else if (char.class === 'high') {
                        classType = 'high-class';
                    } else if (char.class === 'low-paired' || char.class === 'low-unpaired') {
                        classType = 'low-class';
                    } else if (char.class === 'vowel') {
                        classType = 'vowel-class';
                    }

                    // Get the full pronunciation (sound + name)
                    // For consonants: e.g., "นอ หนู", "บอ ใบไม้"
                    // For vowels: just the sound
                    let fullPronunciation = '';
                    if (char.class === 'vowel') {
                        fullPronunciation = char.sound || char.symbol;
                    } else {
                        // Make sure we have both sound and name
                        const sound = char.sound || '';
                        const name = char.name || '';
                        fullPronunciation = sound && name ? `${sound} ${name}` : (sound || name || char.symbol);
                    }

                    // If no sound/name, fallback to symbol
                    if (!fullPronunciation) {
                        fullPronunciation = char.symbol;
                    }

                    return `
                        <div class="alphabet-grid-item audio-element alphabet-item ${classType}" 
                            onclick="App.media.play(this)"
                            data-text="${UI.escapeHtml(fullPronunciation)}" 
                            data-lang="th"
                            data-class="${char.class}"
                            data-symbol="${char.symbol}"
                            data-sound="${char.sound || ''}"
                            data-name="${char.name || ''}"
                            data-meaning="${char.meaning || ''}">
                            <span class="alphabet-symbol">${char.symbol}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
            },

            showConsonantDetail: function (symbol, element) {
                // Get the character data from the element's attributes
                const sound = element.getAttribute('data-sound') || '';
                const name = element.getAttribute('data-name') || '';
                const meaning = element.getAttribute('data-meaning') || '';
                const consonantClass = element.getAttribute('data-class') || '';

                // Map classes to display names
                let className = '';
                let classType = '';
                if (consonantClass === 'middle') {
                    className = 'Middle Class';
                    classType = 'middle';
                } else if (consonantClass === 'high') {
                    className = 'High Class';
                    classType = 'high';
                } else if (consonantClass === 'low-paired') {
                    className = 'Low Class (Paired)';
                    classType = 'low';
                } else if (consonantClass === 'low-unpaired') {
                    className = 'Low Class (Unpaired)';
                    classType = 'low';
                }

                // Emoji mapping for common mnemonics
                const emojiMap = {
                    'ก': '🐔', // ไก่ - chicken
                    'ข': '🥚', // ไข่ - egg
                    'ฃ': '🍾', // ขวด - bottle
                    'ค': '🐃', // ควาย - water buffalo
                    'ฅ': '👤', // คน - human
                    'ฆ': '🔔', // ระฆัง - bell
                    'ง': '🐍', // งู - snake
                    'จ': '🍽️', // จาน - plate
                    'ฉ': '🥘', // ฉิ่ง - cymbal
                    'ช': '🐘', // ช้าง - elephant
                    'ซ': '⛓️', // โซ่ - chain
                    'ฌ': '🌳', // เฌอ - tree
                    'ญ': '👩', // หญิง - female
                    'ฎ': '👑', // ชฎา - head dress
                    'ฏ': '⚔️', // ปฏัก - lance
                    'ฐ': '🗿', // ฐาน - pedestal
                    'ฑ': '👸', // มนโท - lady
                    'ฒ': '👴', // ผู้เฒ่า - elderly
                    'ณ': '🧘', // เณร - novice monk
                    'ด': '👶', // เด็ก - child
                    'ต': '🐢', // เต่า - turtle
                    'ถ': '👜', // ถุง - bag
                    'ท': '💂', // ทหาร - soldier
                    'ธ': '🏁', // ธง - flag
                    'น': '🐭', // หนู - mouse
                    'บ': '🍃', // ใบไม้ - leaf
                    'ป': '🐟', // ปลา - fish
                    'ผ': '🐝', // ผึ้ง - bee
                    'ฝ': '📦', // ฝา - lid
                    'พ': '🍽️', // พาน - offering tray
                    'ฟ': '🦷', // ฟัน - tooth
                    'ภ': '⛵', // สำเภา - junk ship
                    'ม': '🐴', // ม้า - horse
                    'ย': '👹', // ยักษ์ - giant
                    'ร': '🚤', // เรือ - boat
                    'ล': '🐒', // ลิง - monkey
                    'ว': '💍', // แหวน - ring
                    'ศ': '🏯', // ศาลา - pavilion
                    'ษ': '🧘', // ฤษี - hermit
                    'ส': '🐯', // เสือ - tiger
                    'ห': '📦', // หีบ - chest
                    'ฬ': '🪁', // จุฬา - kite
                    'อ': '🫙', // อ่าง - basin
                    'ฮ': '🦉'  // นกฮูก - owl
                };

                const emoji = emojiMap[symbol] || '🔤';

                // Get examples (you might want to pass these from the data)
                const examples = [
                    { word: symbol + '...', meaning: 'Example word' }
                ];

                // Use the GrammarSheet anchor for consistency
                let anchor = document.getElementById('grammar-sheet-anchor');
                if (!anchor) {
                    anchor = document.createElement('div');
                    anchor.id = 'grammar-sheet-anchor';
                    document.body.appendChild(anchor);
                }

                // Build the detail view HTML - FIXED: Changed App.closeConsonantDetail to App.alphabet.closeConsonantDetail
                anchor.innerHTML = `
        <div class="sheet-backdrop" onclick="App.alphabet.closeConsonantDetail()"></div>
        <div class="bottom-sheet ${State.data.theme === 'dark' ? 'dark-theme' : ''}">
            <div class="sheet-handle" onclick="App.alphabet.closeConsonantDetail()"></div>
            <div class="sheet-header">
                <h3>${Services.I18n.t('consonant_details', 'Consonant Details')}</h3>
                <button class="sheet-close material-icons" onclick="App.alphabet.closeConsonantDetail()">close</button>
            </div>
            <div class="sheet-content consonant-detail-sheet">
                <div class="consonant-detail-header">
                    <div class="consonant-detail-symbol ${classType}">${symbol}</div>
                    <div class="consonant-detail-info">
                        <div class="consonant-name">
                            <span class="thai-name">${sound}</span>
                            <span class="class-indicator ${classType}">${consonantClass}</span>
                        </div>
                        <div class="consonant-mnemonic">
                            <span class="mnemonic-emoji">${emoji}</span>
                            <span>${name} (${meaning})</span>
                        </div>
                        <button class="detail-audio-btn" onclick="App.Services.MediaService.speak('${symbol}', 'th')">
                            <span class="material-icons">volume_up</span>
                            ${Services.I18n.t('hear_pronunciation', 'Hear pronunciation')}
                        </button>
                    </div>
                </div>
                
                <div class="consonant-examples">
                    <h4>${Services.I18n.t('example_words', 'Example Words')}</h4>
                    <div class="example-chips">
                        <div class="example-chip" onclick="App.Services.MediaService.speak('${symbol}', 'th')">
                            <span class="example-word">${symbol}</span>
                            <span class="example-meaning">${meaning}</span>
                            <span class="material-icons" style="font-size: 16px;">volume_up</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

                // Add animation classes
                setTimeout(() => {
                    const sheet = document.querySelector('.bottom-sheet');
                    const backdrop = document.querySelector('.sheet-backdrop');
                    if (sheet) sheet.classList.add('open');
                    if (backdrop) backdrop.classList.add('visible');
                }, 10);
            },

            closeConsonantDetail: function () {
                const sheet = document.querySelector('.bottom-sheet');
                const backdrop = document.querySelector('.sheet-backdrop');

                if (sheet) sheet.classList.remove('open');
                if (backdrop) backdrop.classList.remove('visible');

                setTimeout(() => {
                    const anchor = document.getElementById('grammar-sheet-anchor');
                    if (anchor) anchor.innerHTML = '';
                }, 300);
            }

        },

        // ------------------------------------------------------------------------
        // Quiz View
        // ------------------------------------------------------------------------

        Quiz: {

            render(docId, sectionIdx, activityType) {
                // console.log('UI.Quiz.render called with:', { docId, sectionIdx, activityType });
                const container = UI.getContainer();
                if (!container) return;

                container.innerHTML = '<div class="loading-spinner"></div>';

                const items = this.getQuizItems(docId, sectionIdx, activityType);
                // console.log('Quiz items found:', items.length);

                if (items.length === 0) {
                    container.innerHTML = `
                    <div class="flashcard-empty-state">
                        <span class="material-icons">info</span>
                        <h2>No quiz items available</h2>
                        <p>No items found for this quiz type.</p>
                        <button class="btn-activity" onclick="history.back()">Go Back</button>
                    </div>
                `;
                    return;
                }

                // Get all enabled languages from settings
                const allLangs = Object.keys(State.data.media.languageSettings)
                    .filter(code => State.data.media.languageSettings[code].show);

                // Set default languages
                const defaultQuestionLang = allLangs.includes('th') ? 'th' : (allLangs[0] || 'en');
                const defaultAnswerLang = allLangs.filter(l => l !== 'th')[0] || allLangs[0] || 'en';

                State.data.quiz = {
                    items: items.sort(() => Math.random() - 0.5),
                    currentIndex: 0,
                    score: 0,
                    incorrect: [],
                    activityType: activityType,
                    documentId: docId,
                    sectionIndex: sectionIdx,
                    questionLang: defaultQuestionLang,
                    answerLang: defaultAnswerLang
                };

                this.renderQuestion();
            },

            // In UI.Quiz.getQuizItems method:
            getQuizItems(docId, sectionIdx, activityType) {
                const doc = State.data.currentDocument;
                if (!doc) return [];

                const items = [];
                const isWordQuiz = activityType.includes('Word');

                if (sectionIdx !== null) {
                    // Section-level quiz
                    const section = doc.sections[sectionIdx];
                    if (isWordQuiz) {
                        return section.getWordItems().map(word => ({
                            id: `word-${word.word}`,
                            type: 'word',
                            question: word.word,
                            translations: word.translations
                        }));
                    } else {
                        return section.getSentenceItems().map(sentence => ({
                            id: `sent-${sentence.source}`,
                            type: 'sentence',
                            question: sentence.source,
                            translations: sentence.translations
                        }));
                    }
                } else {
                    // Document-level quiz
                    if (isWordQuiz) {
                        return doc.getAllWordItems().map(word => ({
                            id: `word-${word.word}`,
                            type: 'word',
                            question: word.word,
                            translations: word.translations
                        }));
                    } else {
                        return doc.getAllSentenceItems().map(sentence => ({
                            id: `sent-${sentence.source}`,
                            type: 'sentence',
                            question: sentence.source,
                            translations: sentence.translations
                        }));
                    }
                }
            },

            // In app.js - Update UI.Quiz.renderQuestion method to handle Thai answers correctly

            renderQuestion() {
                const container = UI.getContainer();
                const quiz = State.data.quiz;
                if (!quiz || !quiz.items || quiz.items.length === 0) return;

                const item = quiz.items[quiz.currentIndex];
                const t = Services.I18n.t;

                // Get ALL languages from settings, including Thai
                const allLangs = Object.keys(State.data.media.languageSettings)
                    .filter(code => State.data.media.languageSettings[code].show);

                // Set default languages if not set
                if (!quiz.questionLang) {
                    // Default question to Thai if available, otherwise first available language
                    quiz.questionLang = allLangs.includes('th') ? 'th' : (allLangs[0] || 'en');
                }

                if (!quiz.answerLang) {
                    // Default answer to first non-Thai language, or first available if only Thai
                    quiz.answerLang = allLangs.filter(l => l !== 'th')[0] || allLangs[0] || 'en';
                }

                // Get question text based on selected question language
                let questionText = item.question;
                if (quiz.questionLang !== 'th') {
                    // If question language is not Thai, use translation
                    questionText = item.translations[quiz.questionLang] || item.question;
                }

                // Get correct answer based on selected answer language
                // For Thai answers, use the question itself (since it's already Thai)
                let correctAnswer = '';
                if (quiz.answerLang === 'th') {
                    correctAnswer = item.question; // Thai answer is the question itself
                } else {
                    correctAnswer = item.translations[quiz.answerLang] || '';
                }

                // Generate distractors from other items in the same language
                let otherAnswers = [];
                if (quiz.answerLang === 'th') {
                    // For Thai answers, use other items' questions as distractors
                    otherAnswers = quiz.items
                        .filter(i => i.id !== item.id)
                        .map(i => i.question)
                        .filter(a => a && a !== correctAnswer);
                } else {
                    // For other languages, use translations
                    otherAnswers = quiz.items
                        .filter(i => i.id !== item.id)
                        .map(i => i.translations[quiz.answerLang])
                        .filter(a => a && a !== correctAnswer);
                }

                const uniqueDistractors = [...new Set(otherAnswers)].slice(0, 3);
                const options = [correctAnswer, ...uniqueDistractors].sort(() => Math.random() - 0.5);

                const progress = (quiz.currentIndex / quiz.items.length) * 100;

                container.innerHTML = `
        <div class="quiz-container">
            <div class="quiz-header">
                <div class="quiz-header-top">
                    <h2>${t(quiz.activityType, quiz.activityType)}</h2>
                    <button class="quiz-close-btn" onclick="location.hash='doc/${quiz.documentId}'">
                        <span class="material-icons">close</span>
                    </button>
                </div>
                
                <div class="quiz-progress-section">
                    <div class="quiz-progress-container">
                        <div class="quiz-progress-fill" style="width:${progress}%"></div>
                    </div>
                    <div class="quiz-counter">
                        ${quiz.currentIndex + 1} / ${quiz.items.length}
                    </div>
                </div>
                
                <div class="quiz-lang-selectors">
                    <select class="lang-select" onchange="App.quiz.setQuestionLanguage(this.value)">
                        ${allLangs.map(code => {
                    const langName = {
                        'th': 'ไทย',
                        'en': 'English',
                        'fa': 'فارسی'
                    }[code] || code.toUpperCase();
                    return `
                                <option value="${code}" ${code === quiz.questionLang ? 'selected' : ''}>
                                    ${langName}
                                </option>
                            `;
                }).join('')}
                    </select>
                    <span class="material-icons lang-arrow">arrow_forward</span>
                    <select class="lang-select" onchange="App.quiz.setAnswerLanguage(this.value)">
                        ${allLangs.map(code => {
                    const langName = {
                        'th': 'ไทย',
                        'en': 'English',
                        'fa': 'فارسی'
                    }[code] || code.toUpperCase();
                    return `
                                <option value="${code}" ${code === quiz.answerLang ? 'selected' : ''}>
                                    ${langName}
                                </option>
                            `;
                }).join('')}
                    </select>
                </div>
                
                <div class="quiz-score">
                    ${t('score', 'Score')}: ${quiz.score}
                </div>
            </div>

            <div class="quiz-question-card" 
                 onclick="App.media.play(this)"
                 data-text="${UI.escapeHtml(quiz.questionLang === 'th' ? item.question : questionText)}"
                 data-lang="${quiz.questionLang}">
                <div class="quiz-question-text" lang="${quiz.questionLang}" 
                     dir="${quiz.questionLang === 'fa' ? 'rtl' : 'ltr'}">
                    ${UI.escapeHtml(questionText)}
                </div>
            </div>

            <div class="quiz-options-grid">
                ${options.map(option => `
                    <button class="quiz-option-btn" 
                            onclick="App.quiz.handleAnswer(this, '${UI.escapeHtml(option)}', '${UI.escapeHtml(correctAnswer)}')"
                            data-answer="${UI.escapeHtml(option)}"
                            data-text="${UI.escapeHtml(option)}"
                            data-lang="${quiz.answerLang}">
                        <span lang="${quiz.answerLang}" dir="${quiz.answerLang === 'fa' ? 'rtl' : 'ltr'}">
                            ${UI.escapeHtml(option)}
                        </span>
                    </button>
                `).join('')}
            </div>
        </div>
    `;

                // Auto-play the question
                setTimeout(() => {
                    Services.MediaService.speak(questionText, quiz.questionLang);
                }, 100);
            },

            renderResults() {
                const container = UI.getContainer();
                const quiz = State.data.quiz;
                const t = Services.I18n.t;

                // Get available languages for speech
                const availableLangs = Object.keys(State.data.media.languageSettings)
                    .filter(code => code !== 'th' && State.data.media.languageSettings[code].show);

                container.innerHTML = `
        <div class="quiz-container">
            <h2>${t('review', 'Review')}</h2>
            <div class="card">
                <h3>${t('score', 'Score')}: ${quiz.score} / ${quiz.items.length}</h3>
            </div>
            
            ${quiz.incorrect.length > 0 ? `
                <div class="review-list">
                    <h4>${t('incorrect_answers', 'Incorrect Answers')}</h4>
                    ${quiz.incorrect.map(item => {
                    // Get the translation in the quiz answer language (or fallback to first available)
                    const answerLang = quiz.answerLang || availableLangs[0] || 'en';
                    const translation = item.translations[answerLang] ||
                        item.translations[availableLangs[0]] ||
                        item.translations.en || '';

                    return `
                            <div class="card review-item">
                                <div class="review-item-content">
                                    <strong class="review-question" 
                                            onclick="App.media.play(this)"
                                            data-text="${UI.escapeHtml(item.question)}"
                                            data-lang="th">
                                        <span class="material-icons review-speech-icon">volume_up</span>
                                        ${UI.escapeHtml(item.question)}
                                    </strong>
                                    ${translation ? `
                                        <small class="review-answer"
                                               onclick="App.media.play(this)"
                                               data-text="${UI.escapeHtml(translation)}"
                                               data-lang="${answerLang}">
                                            <span class="material-icons review-speech-icon-small">volume_up</span>
                                            ${UI.escapeHtml(translation)}
                                        </small>
                                    ` : ''}
                                </div>
                            </div>
                        `;
                }).join('')}
                </div>
            ` : `
                <div class="perfect-score">
                    <span class="material-icons perfect-icon">emoji_events</span>
                    <p>${t('perfect_score', 'Perfect score! Great job!')}</p>
                </div>
            `}
            
            <div class="quiz-footer-btns">
                <button class="btn-activity" onclick="location.hash='doc/${quiz.documentId}'">
                    <span class="material-icons">arrow_back</span>
                    ${t('finish', 'Finish')}
                </button>
                ${quiz.incorrect.length > 0 ? `
                    <button class="btn-activity" onclick="App.quiz.retryIncorrect()">
                        <span class="material-icons">refresh</span>
                        ${t('retry_incorrect', 'Retry Incorrect')}
                    </button>
                ` : ''}
            </div>
        </div>
    `;
            }

        },

        // ------------------------------------------------------------------------
        // Flashcard View
        // ------------------------------------------------------------------------
        Flashcard: {
            render(docId, sectionIdx, type) {
                // console.log('UI.Flashcard.render called with:', { docId, sectionIdx, type });
                const container = UI.getContainer();
                if (!container) return;

                container.innerHTML = '<div class="loading-spinner"></div>';

                const items = this.getFlashcardItems(docId, sectionIdx, type);
                // console.log('Flashcard items found:', items.length);

                if (items.length === 0) {
                    container.innerHTML = `
                        <div class="flashcard-empty-state">
                            <span class="material-icons">info</span>
                            <h2>No flashcards available</h2>
                            <p>No ${type} found in this section.</p>
                            <button class="btn-activity" onclick="history.back()">Go Back</button>
                        </div>
                    `;
                    return;
                }

                State.data.flashcards = {
                    currentDeck: items,
                    currentIndex: 0,
                    showAnswer: false,
                    documentId: docId,
                    sectionIndex: sectionIdx,
                    type: type
                };

                this.renderCard();
            },

            // In UI.Flashcard.getFlashcardItems (around line 1900-2000)
            getFlashcardItems(docId, sectionIdx, type) {
                const doc = State.data.currentDocument;
                if (!doc) return [];

                if (sectionIdx !== null) {
                    // Section-level flashcards
                    const section = doc.sections[sectionIdx];
                    if (type === 'word') {
                        return section.getWordItems().map(word => ({
                            type: 'word',
                            id: `word-${word.word}`,
                            front: word.word,
                            back: word.translations,
                            word: word
                        }));
                    } else if (type === 'sentence') {
                        return section.getSentenceItems().map(sentence => ({
                            type: 'sentence',
                            id: `sent-${sentence.source}`,
                            front: sentence.source,
                            back: sentence.translations,
                            words: sentence.words
                        }));
                        // ===== ADD THIS =====
                    } else if (type === 'character') {
                        // Collect all characters from alphabet content in this section
                        const characters = [];
                        section.content.forEach(block => {
                            if (block.type === 'alphabet-table') {
                                characters.push(...block.characters);
                            }
                        });

                        return characters.map(char => ({
                            type: 'character',
                            id: `char-${char.symbol}`,
                            front: char.symbol,
                            back: {
                                sound: char.sound,
                                name: char.name,
                                meaning: char.meaning,
                                class: char.class
                            },
                            character: char
                        }));
                    }
                    // ===== END ADDITION =====
                } else {
                    // Document-level flashcards
                    if (type === 'word') {
                        return doc.getAllWordItems().map(word => ({
                            type: 'word',
                            id: `word-${word.word}`,
                            front: word.word,
                            back: word.translations,
                            word: word
                        }));
                    } else if (type === 'sentence') {
                        return doc.getAllSentenceItems().map(sentence => ({
                            type: 'sentence',
                            id: `sent-${sentence.source}`,
                            front: sentence.source,
                            back: sentence.translations,
                            words: sentence.words
                        }));
                    } else if (type === 'character') {
                        // Collect all characters from all sections
                        const characters = [];
                        doc.sections.forEach(section => {
                            section.content.forEach(block => {
                                if (block.type === 'alphabet-table') {
                                    characters.push(...block.characters);
                                }
                            });
                        });

                        return characters.map(char => ({
                            type: 'character',
                            id: `char-${char.symbol}`,
                            front: char.symbol,
                            back: {
                                sound: char.sound,
                                name: char.name,
                                meaning: char.meaning,
                                class: char.class
                            },
                            character: char
                        }));
                    }
                }

                return [];
            },

            renderCard() {
                const container = UI.getContainer();
                const cards = State.data.flashcards;
                if (!cards || !cards.currentDeck || cards.currentDeck.length === 0) return;

                const card = cards.currentDeck[cards.currentIndex];
                const t = Services.I18n.t;

                // Emoji mapping for character mnemonics
                const emojiMap = {
                    'ก': '🐔', 'ข': '🥚', 'ฃ': '🍾', 'ค': '🐃', 'ฅ': '👤',
                    'ฆ': '🔔', 'ง': '🐍', 'จ': '🍽️', 'ฉ': '🥘', 'ช': '🐘',
                    'ซ': '⛓️', 'ฌ': '🌳', 'ญ': '👩', 'ฎ': '👑', 'ฏ': '⚔️',
                    'ฐ': '🗿', 'ฑ': '👸', 'ฒ': '👴', 'ณ': '🧘', 'ด': '👶',
                    'ต': '🐢', 'ถ': '👜', 'ท': '💂', 'ธ': '🏁', 'น': '🐭',
                    'บ': '🍃', 'ป': '🐟', 'ผ': '🐝', 'ฝ': '📦', 'พ': '🍽️',
                    'ฟ': '🦷', 'ภ': '⛵', 'ม': '🐴', 'ย': '👹', 'ร': '🚤',
                    'ล': '🐒', 'ว': '💍', 'ศ': '🏯', 'ษ': '🧘', 'ส': '🐯',
                    'ห': '📦', 'ฬ': '🪁', 'อ': '🫙', 'ฮ': '🦉'
                };

                // Determine class for color coding (if character card)
                let classColor = '';
                let className = '';
                if (card.type === 'character') {
                    if (card.back.class === 'middle') {
                        classColor = 'middle-class';
                        className = 'Middle';
                    } else if (card.back.class === 'high') {
                        classColor = 'high-class';
                        className = 'High';
                    } else if (card.back.class === 'low-paired' || card.back.class === 'low-unpaired') {
                        classColor = 'low-class';
                        className = 'Low';
                    }
                }

                // For character cards, create the full pronunciation (sound + name)
                let fullCharacterPronunciation = '';
                if (card.type === 'character') {
                    const sound = card.back.sound || '';
                    const name = card.back.name || '';
                    fullCharacterPronunciation = sound && name ? `${sound} ${name}` : (sound || name || card.front);
                }

                let html = `
        <div class="flashcard-container">
            <div class="flashcard-header">
                <div class="flashcard-progress">
                    ${t('card', 'Card')} ${cards.currentIndex + 1} / ${cards.currentDeck.length}
                </div>
                <div class="flashcard-header-buttons">
                    <button class="flashcard-header-btn" onclick="App.exitFlashcards()">
                        <span class="material-icons">close</span>
                    </button>
                </div>
            </div>
            
            <div class="flashcard ${cards.showAnswer ? 'show-answer' : ''}">
                <div class="flashcard-front" 
                    onclick="App.Services.MediaService.speak('${UI.escapeHtml(card.type === 'character' ? fullCharacterPronunciation : card.front)}', 'th')"
                    data-text="${UI.escapeHtml(card.type === 'character' ? fullCharacterPronunciation : card.front)}" 
                    data-lang="th">
    `;

                // Customize front display based on card type
                if (card.type === 'character') {
                    // Character card front - show large character with class color
                    html += `
            <div class="flashcard-content character-front ${classColor}" lang="th">
                <div class="character-large-display ${classColor}">${UI.escapeHtml(card.front)}</div>
            </div>
        `;
                } else {
                    // Word or sentence card front
                    html += `
            <div class="flashcard-content" lang="th">${UI.escapeHtml(card.front)}</div>
        `;
                }

                html += `
                </div>
                
                <div class="flashcard-back">
                    <div class="flashcard-translations">
    `;

                if (card.type === 'character') {
                    const emoji = emojiMap[card.front] || '🔤';

                    // Character card back - concise single row with color-coded consonant
                    html += `
            <div class="flashcard-translation-item character-summary ${classColor}">
                <div class="character-summary-content">
                    <span class="character-symbol ${classColor}">${UI.escapeHtml(card.front)}</span>
                    <span class="character-mnemonic">
                        <span class="mnemonic-emoji">${emoji}</span>
                        <span>${card.back.name}</span>
                    </span>
                    <span class="character-meaning">(${card.back.meaning})</span>
                    <span class="character-class-badge ${card.back.class}">${className}</span>
                </div>
                <div class="character-audio-row">
                    <button class="audio-chip" onclick="App.Services.MediaService.speak('${card.back.sound}', 'th')" data-text="${card.back.sound}" data-lang="th">
                        <span class="material-icons">volume_up</span> ${card.back.sound}
                    </button>
                    <button class="audio-chip" onclick="App.Services.MediaService.speak('${fullCharacterPronunciation}', 'th')" data-text="${fullCharacterPronunciation}" data-lang="th">
                        <span class="material-icons">volume_up</span> Hear full name
                    </button>
                </div>
            </div>
        `;
                } else {
                    // Word or sentence card back - show translations
                    Object.entries(State.data.media.languageSettings).forEach(([code, config]) => {
                        if (code !== 'th' && config.show && card.back[code]) {
                            const dir = code === 'fa' ? 'rtl' : 'ltr';
                            html += `
                    <div class="flashcard-translation-item" 
                         lang="${code}" 
                         dir="${dir}"
                         onclick="App.Services.MediaService.speak('${UI.escapeHtml(card.back[code])}', '${code}')"
                         data-text="${UI.escapeHtml(card.back[code])}" 
                         data-lang="${code}">
                        <span class="translation-lang">${code.toUpperCase()}:</span>
                        <span class="translation-text">${UI.escapeHtml(card.back[code])}</span>
                        <span class="material-icons audio-icon">volume_up</span>
                    </div>
                `;
                        }
                    });
                }

                html += `
                    </div>
                </div>
            </div>
            
            ${!cards.showAnswer ? `
                <button class="btn-activity btn-show-answer" onclick="App.showFlashcardAnswer()">
                    ${t('show_answer', 'Show Answer')}
                </button>
            ` : `
                <div class="answer-rating">
                    <p>${t('how_well', 'How well did you know this?')}</p>
                    <div class="rating-buttons">
                        <button class="rating-btn" onclick="App.rateFlashcard(0)">${t('again', 'Again')}</button>
                        <button class="rating-btn" onclick="App.rateFlashcard(3)">${t('hard', 'Hard')}</button>
                        <button class="rating-btn" onclick="App.rateFlashcard(4)">${t('good', 'Good')}</button>
                        <button class="rating-btn" onclick="App.rateFlashcard(5)">${t('easy', 'Easy')}</button>
                    </div>
                </div>
            `}
        </div>
    `;

                container.innerHTML = html;
                App.hideMediaBar();

                // Auto-play the front of the card with full pronunciation for characters
                setTimeout(() => {
                    if (card.type === 'character') {
                        Services.MediaService.speak(fullCharacterPronunciation, 'th');
                    } else {
                        Services.MediaService.speak(card.front, 'th');
                    }
                }, 100);
            }

        },

        // ------------------------------------------------------------------------
        // Sentence Building Game View
        // ------------------------------------------------------------------------
        Game: {
            render(docId, sectionIdx) {
                // console.log('UI.Game.render called with:', { docId, sectionIdx });
                const container = UI.getContainer();
                if (!container) return;

                container.innerHTML = '<div class="loading-spinner"></div>';

                // Get sentences for the game
                const sentences = this.getGameSentences(docId, sectionIdx);
                // console.log('Game sentences found:', sentences.length);

                if (sentences.length === 0) {
                    container.innerHTML = `
                <div class="flashcard-empty-state">
                    <span class="material-icons">info</span>
                    <h2>No sentences available</h2>
                    <p>No sentences found for this game.</p>
                    <button class="btn-activity" onclick="history.back()">Go Back</button>
                </div>
            `;
                    App.hideMediaBar();
                    return;
                }

                // Store game state
                State.data.sentenceGame = {
                    sentences: sentences,
                    currentIndex: 0,
                    currentSentence: sentences[0],
                    userWords: [],
                    showResult: false,
                    isCorrect: false,
                    documentId: docId,
                    sectionIndex: sectionIdx
                };

                this.renderGame();
            },

            // In UI.Game.getGameSentences method:
            getGameSentences(docId, sectionIdx) {
                const doc = State.data.currentDocument;
                if (!doc) return [];

                let sentences = [];

                if (sectionIdx !== null) {
                    // Section-level game
                    const section = doc.sections[sectionIdx];
                    sentences = section.getSentenceItems();
                } else {
                    // Document-level game
                    sentences = doc.getAllSentenceItems();
                }

                // Only include sentences that have word breakdown
                return sentences
                    .filter(s => s.words && s.words.length > 0)
                    .map(s => ({
                        id: `game-${s.source}`,
                        source: s.source,
                        words: s.words.map(w => w.word),
                        wordObjects: s.words,
                        translation: s.translations[State.data.lang] || s.translations.en || ''
                    }));
            },

            renderGame() {
                const container = UI.getContainer();
                const game = State.data.sentenceGame;
                if (!game || !game.sentences || game.sentences.length === 0) return;

                const sentence = game.sentences[game.currentIndex];
                const t = Services.I18n.t;

                // Get available words (not yet used)
                const usedWords = game.userWords || [];
                const availableWords = sentence.words.filter(word => !usedWords.includes(word));

                const progress = (game.currentIndex / game.sentences.length) * 100;

                container.innerHTML = `
            <div class="sentence-game-container">
                <div class="game-header">
                    <div class="game-header-top">
                        <h2>${t('build_sentence', 'Build the Sentence')}</h2>
                        <button class="game-close-btn" onclick="location.hash='doc/${game.documentId}'">
                            <span class="material-icons">close</span>
                        </button>
                    </div>
                    
                    <div class="game-progress-section">
                        <div class="game-progress-container">
                            <div class="game-progress-fill" style="width:${progress}%"></div>
                        </div>
                        <div class="game-counter">
                            ${game.currentIndex + 1} / ${game.sentences.length}
                        </div>
                    </div>
                    
                    ${sentence.translation ? `
                        <div class="sentence-hint">
                            <span class="material-icons">translate</span>
                            ${UI.escapeHtml(sentence.translation)}
                        </div>
                    ` : ''}
                </div>
                
                <div class="sentence-game-area">
                    <!-- Construction Zone -->
                    <div class="construction-zone">
                        <div class="construction-label">${t('your_sentence', 'Your Sentence:')}</div>
                        <div class="word-construction ${game.showResult && game.isCorrect ? 'correct' : ''} 
                                                      ${game.showResult && !game.isCorrect ? 'incorrect' : ''}" 
                             id="word-construction">
                            ${usedWords.length > 0 ?
                        usedWords.map((word, index) => `
                                    <div class="constructed-word" data-index="${index}">
                                        <span class="word-text">${UI.escapeHtml(word)}</span>
                                        ${!game.showResult ? `
                                            <button class="remove-word-btn" 
                                                    onclick="App.game.removeWord(${index})"
                                                    aria-label="${t('remove_word', 'Remove word')}">
                                                <span class="material-icons">close</span>
                                            </button>
                                        ` : ''}
                                    </div>
                                `).join('') :
                        `<div class="construction-placeholder">
                                    ${t('tap_words_to_build', 'Tap words below to build your sentence')}
                                 </div>`
                    }
                        </div>
                    </div>
                    
                    <!-- Word Bank -->
                    <div class="word-bank">
                        <div class="word-bank-label">${t('available_words', 'Available Words:')}</div>
                        <div class="words-container">
                            ${availableWords.map(word => `
                                <button class="word-tile"
                                        onclick="App.game.addWord('${UI.escapeHtml(word)}')"
                                        ${game.showResult ? 'disabled' : ''}>
                                    ${UI.escapeHtml(word)}
                                </button>
                            `).join('')}
                            ${availableWords.length === 0 ? `
                                <div class="no-words-message">${t('all_words_used', 'All words used!')}</div>
                            ` : ''}
                        </div>
                    </div>
                </div>
                
                <!-- Game Controls -->
                <div class="game-controls">
                    <button class="btn-activity btn-reset" 
                            onclick="App.game.reset()" 
                            ${usedWords.length === 0 || game.showResult ? 'disabled' : ''}>
                        <span class="material-icons">refresh</span>
                        <span class="btn-text">${t('reset', 'Reset')}</span>
                    </button>
                    <button class="btn-activity btn-check" 
                            onclick="App.game.check()" 
                            ${usedWords.length === 0 || game.showResult ? 'disabled' : ''}>
                        <span class="material-icons">check</span>
                        <span class="btn-text">${t('check', 'Check')}</span>
                    </button>
                    <button class="btn-activity btn-next" 
                            onclick="App.game.next()" 
                            ${!game.showResult ? 'disabled' : ''}>
                        <span class="material-icons">arrow_forward</span>
                        <span class="btn-text">${t('next', 'Next')}</span>
                    </button>
                </div>
                
                <!-- Result Feedback -->
                ${game.showResult ? `
                    <div class="result-feedback ${game.isCorrect ? 'correct' : 'incorrect'}">
                        <span class="material-icons">${game.isCorrect ? 'check_circle' : 'error'}</span>
                        <span class="feedback-text">
                            ${game.isCorrect ?
                            t('correct_sentence', 'Perfect! You built the sentence correctly.') :
                            t('incorrect_sentence', 'Not quite right. Try again!')}
                        </span>
                        ${!game.isCorrect ? `
                            <button class="btn-show-answer" onclick="App.game.showAnswer()">
                                ${t('show_answer', 'Show Answer')}
                            </button>
                        ` : ''}
                    </div>
                ` : ''}
                
                <!-- Exit Button -->
                <div class="game-footer">
                    <button class="btn-activity btn-exit" onclick="App.game.exit()">
                        <span class="material-icons">exit_to_app</span>
                        <span class="btn-text">${t('exit_game', 'Exit Game')}</span>
                    </button>
                </div>
            </div>
        `;

                App.hideMediaBar();
            },

            renderComplete() {
                const container = UI.getContainer();
                const game = State.data.sentenceGame;
                const t = Services.I18n.t;

                container.innerHTML = `
            <div class="game-complete">
                <span class="material-icons">celebration</span>
                <h2>${t('game_complete', 'Great job!')}</h2>
                <p>${t('sentences_completed', 'You\'ve practiced all the sentences!')}</p>
                
                <div class="game-complete-buttons">
                    <button class="btn-activity" onclick="location.hash='doc/${game.documentId}'">
                        <span class="material-icons">arrow_back</span>
                        ${t('back_to_document', 'Back to Document')}
                    </button>
                    <button class="btn-activity" onclick="App.game.restart()">
                        <span class="material-icons">refresh</span>
                        ${t('play_again', 'Play Again')}
                    </button>
                </div>
            </div>
        `;
            }
        },

        // ------------------------------------------------------------------------
        // Help View
        // ------------------------------------------------------------------------
        Help: {
            render() {
                const container = UI.getContainer();
                if (!container) return;

                const t = Services.I18n.t;

                container.innerHTML = `
            <div class="help-section">
                <h2>${t('help_title', 'Help & User Guide')}</h2>
                
                <!-- Quick Start -->
                <details class="help-details" open>
                    <summary>
                        <span class="material-icons">rocket_launch</span>
                        ${t('quick_start', 'Quick Start')}
                    </summary>
                    <div class="help-content">
                        <ol class="help-steps">
                            <li>
                                <span class="material-icons">menu_book</span>
                                <strong>${t('step_1', '1. Choose a Document')}</strong>
                                <span>${t('step_1_desc', 'From the Library, select any learning document.')}</span>
                            </li>
                            <li>
                                <span class="material-icons">expand_more</span>
                                <strong>${t('step_2', '2. Explore Content')}</strong>
                                <span>${t('step_2_desc', 'Expand sections to see sentences and vocabulary.')}</span>
                            </li>
                            <li>
                                <span class="material-icons">volume_up</span>
                                <strong>${t('step_3', '3. Click to Listen')}</strong>
                                <span>${t('step_3_desc', 'Click any Thai sentence or word to hear pronunciation.')}</span>
                            </li>
                            <li>
                                <span class="material-icons">style</span>
                                <strong>${t('step_4', '4. Practice & Test')}</strong>
                                <span>${t('step_4_desc', 'Use flashcards, quizzes, and games to reinforce learning.')}</span>
                            </li>
                        </ol>
                    </div>
                </details>

                <!-- Voice Setup -->
                <details class="help-details">
                    <summary>
                        <span class="material-icons">record_voice_over</span>
                        ${t('voice_setup', 'Voice Setup & Audio')}
                    </summary>
                    <div class="help-content">
                        <h4>${t('initial_setup', 'Initial Setup')}</h4>
                        <ul class="help-list">
                            <li>
                                <span class="material-icons">check_circle</span>
                                <strong>${t('auto_voice', 'Automatic Voice Selection')}:</strong>
                                <span>${t('auto_voice_desc', 'The app automatically selects a Thai voice when available.')}</span>
                            </li>
                            <li>
                                <span class="material-icons">settings_voice</span>
                                <strong>${t('test_voice', 'Test Your Voice')}:</strong>
                                <span>${t('test_voice_desc', 'Click the "Test Speech" button below to verify Thai speech synthesis.')}</span>
                            </li>
                        </ul>

                        <h4>${t('audio_controls', 'Audio Controls')}</h4>
                        <ul class="help-list">
                            <li>
                                <span class="material-icons">play_arrow</span>
                                <strong>${t('playback', 'Playback')}:</strong>
                                <span>${t('playback_desc', 'Use the media player at the top to control audio sequence.')}</span>
                            </li>
                            <li>
                                <span class="material-icons">speed</span>
                                <strong>${t('speed_control', 'Speed Control')}:</strong>
                                <span>${t('speed_desc', 'Adjust speaking speed from 0.5x to 1.5x.')}</span>
                            </li>
                            <li>
                                <span class="material-icons">timer</span>
                                <strong>${t('delay_control', 'Delay Control')}:</strong>
                                <span>${t('delay_desc', 'Set pause duration between sentences (1-5 seconds).')}</span>
                            </li>
                            <li>
                                <span class="material-icons">repeat</span>
                                <strong>${t('repeat_control', 'Repeat Control')}:</strong>
                                <span>${t('repeat_desc', 'Set how many times each language repeats (1-3 times).')}</span>
                            </li>
                        </ul>

                        <div class="help-note">
                            <span class="material-icons">info</span>
                            <p>${t('voice_note', 'Note: Voice quality depends on your device\'s text-to-speech engine. For best results, install Thai and English voice data in your device settings. See the Device-Specific Setup below for instructions.')}</p>
                        </div>

                        <button class="btn-activity" onclick="App.testSpeech()">
                            <span class="material-icons">volume_up</span>
                            ${t('test_speech', 'Test Thai Speech')}
                        </button>
                    </div>
                </details>

                <!-- Device-Specific Setup -->
                <details class="help-details">
                    <summary>
                        <span class="material-icons">phonelink_setup</span>
                        ${t('device_setup', 'Device-Specific Setup')}
                    </summary>
                    <div class="help-content">

                        <h4>${t('android_title', 'Android')}</h4>
                        <ol>
                            <li>${t('android_1', 'Go to Settings > Language & Input > Text-to-Speech output (or in Settings, search for \"Text to speech\")')}</li>
                            <li>${t('android_2', 'Select Google Text-to-Speech as preferred engine')}</li>
                            <li>${t('android_3', 'Click settings icon next to Google Text-to-Speech')}</li>
                            <li>${t('android_4', 'Install Thai and English voice data')}</li>
                        </ol>

                        <h4>${t('ios_title', 'iOS (iPhone/iPad)')}</h4>
                        <ol>
                            <li>${t('ios_1', 'Go to Settings > Accessibility > Spoken Content')}</li>
                            <li>${t('ios_2', 'Turn on "Speak Selection" and "Speak Screen"')}</li>
                            <li>${t('ios_3', 'Go to Settings > Accessibility > Spoken Content > Voices')}</li>
                            <li>${t('ios_4', 'Download Thai voice (under "Thai")')}</li>
                        </ol>

                        <h4>${t('macos_title', 'macOS')}</h4>
                        <ol>
                            <li>${t('macos_1', 'Go to System Preferences > Accessibility > Spoken Content')}</li>
                            <li>${t('macos_2', 'Check "Speak selected text when key is pressed"')}</li>
                            <li>${t('macos_3', 'Click "System Voice" dropdown and choose "Customize"')}</li>
                            <li>${t('macos_4', 'Select and download Thai voice')}</li>
                        </ol>

                        <h4>${t('windows_title', 'Windows')}</h4>
                        <ol>
                            <li>${t('windows_1', 'Go to Settings > Time & Language > Language')}</li>
                            <li>${t('windows_2', 'Add Thai language pack')}</li>
                            <li>${t('windows_3', 'Go to Settings > Time & Language > Speech')}</li>
                            <li>${t('windows_4', 'Select Thai as speech language')}</li>
                        </ol>
                    </div>
                </details>

                <!-- Document Navigation -->
                <details class="help-details">
                    <summary>
                        <span class="material-icons">menu_book</span>
                        ${t('doc_navigation', 'Document Navigation')}
                    </summary>
                    <div class="help-content">
                        <h4>${t('library_section', 'Library')}</h4>
                        <ul class="help-list">
                            <li>
                                <span class="material-icons">folder</span>
                                <strong>${t('learning_objects', 'Learning Objects')}:</strong>
                                <span>${t('learning_objects_desc', 'Documents are organized by topic (grammar, vocabulary, etc.).')}</span>
                            </li>
                            <li>
                                <span class="material-icons">expand_more</span>
                                <strong>${t('expand_collapse', 'Expand/Collapse')}:</strong>
                                <span>${t('expand_desc', 'Click section headers to expand or collapse content.')}</span>
                            </li>
                        </ul>

                        <h4>${t('sentence_view', 'Sentence View')}</h4>
                        <ul class="help-list">
                            <li>
                                <span class="material-icons">translate</span>
                                <strong>${t('translations', 'Translations')}:</strong>
                                <span>${t('translations_desc', 'Each sentence shows translations in your selected languages (enable/disable in Settings).')}</span>
                            </li>
                            <li>
                                <span class="material-icons">menu_book</span>
                                <strong>${t('grammar_notes', 'Grammar Notes')}:</strong>
                                <span>${t('grammar_desc', 'Look for the book icon to access detailed grammar explanations.')}</span>
                            </li>
                            <li>
                                <span class="material-icons">word</span>
                                <strong>${t('word_breakdown', 'Word Breakdown')}:</strong>
                                <span>${t('word_desc', 'Click on individual words in sentences to hear them separately.')}</span>
                            </li>
                        </ul>
                    </div>
                </details>

                <!-- Flashcards & SRS -->
                <details class="help-details">
                    <summary>
                        <span class="material-icons">style</span>
                        ${t('flashcards', 'Flashcards & Spaced Repetition')}
                    </summary>
                    <div class="help-content">
                        <h4>${t('starting_flashcards', 'Starting Flashcards')}</h4>
                        <ul class="help-list">
                            <li>
                                <span class="material-icons">touch_app</span>
                                <strong>${t('access_flashcards', 'Access')}:</strong>
                                <span>${t('access_flashcards_desc', 'Click the "Words" or "Sentences" buttons next to any document or section.')}</span>
                            </li>
                            <li>
                                <span class="material-icons">settings_overscan</span>
                                <strong>${t('scope', 'Scope')}:</strong>
                                <span>${t('scope_desc', 'Document-level buttons include all content; section-level buttons focus on that section only.')}</span>
                            </li>
                        </ul>

                        <h4>${t('studying', 'Studying')}</h4>
                        <ul class="help-list">
                            <li>
                                <span class="material-icons">front_hand</span>
                                <strong>${t('front_back', 'Front/Back')}:</strong>
                                <span>${t('front_desc', 'Front shows Thai word/sentence, back shows translations.')}</span>
                            </li>
                            <li>
                                <span class="material-icons">volume_up</span>
                                <strong>${t('audio_cards', 'Audio')}:</strong>
                                <span>${t('audio_cards_desc', 'Click the speaker icon on any card to hear pronunciation.')}</span>
                            </li>
                            <li>
                                <span class="material-icons">rate_review</span>
                                <strong>${t('rating', 'Self-Rating')}:</strong>
                                <span>${t('rating_desc', 'Rate how well you knew it: Again (0), Hard (3), Good (4), or Easy (5).')}</span>
                            </li>
                        </ul>

                        <h4>${t('srs_explained', 'How Spaced Repetition Works')}</h4>
                        <div class="help-note">
                            <p>${t('srs_desc', 'The app uses the SM-2 algorithm (like Anki) to schedule reviews:')}</p>
                            <ul>
                                <li>${t('srs_bullet1', '• Cards you know well appear less frequently')}</li>
                                <li>${t('srs_bullet2', '• Cards you struggle with appear more often')}</li>
                                <li>${t('srs_bullet3', '• New cards are shown immediately, then spaced over increasing intervals')}</li>
                                <li>${t('srs_bullet4', '• Your progress is saved locally in your browser')}</li>
                            </ul>
                        </div>

                        <h4>${t('flashcard_features', 'Additional Features')}</h4>
                        <ul class="help-list">
                            <li>
                                <span class="material-icons">bookmark</span>
                                <strong>${t('bookmark_cards', 'Bookmark')}:</strong>
                                <span>${t('bookmark_desc', 'Save cards for later review by clicking the bookmark icon.')}</span>
                            </li>
                            <li>
                                <span class="material-icons">link</span>
                                <strong>${t('link_context', 'View Context')}:</strong>
                                <span>${t('link_context_desc', 'Click the link icon to see the word in its original sentence.')}</span>
                            </li>
                        </ul>
                    </div>
                </details>

                <!-- Multiple Choice Quiz -->
                <details class="help-details">
                    <summary>
                        <span class="material-icons">quiz</span>
                        ${t('mcq', 'Multiple Choice Quiz')}
                    </summary>
                    <div class="help-content">
                        <h4>${t('quiz_start', 'Starting a Quiz')}</h4>
                        <ul class="help-list">
                            <li>
                                <span class="material-icons">touch_app</span>
                                <strong>${t('quiz_access', 'Access')}:</strong>
                                <span>${t('quiz_access_desc', 'Click the "Quiz" buttons next to documents or sections.')}</span>
                            </li>
                            <li>
                                <span class="material-icons">swap_horiz</span>
                                <strong>${t('quiz_languages', 'Languages')}:</strong>
                                <span>${t('quiz_languages_desc', 'Use the dropdown menus to change question and answer languages.')}</span>
                            </li>
                        </ul>

                        <h4>${t('quiz_taking', 'Taking a Quiz')}</h4>
                        <ul class="help-list">
                            <li>
                                <span class="material-icons">volume_up</span>
                                <strong>${t('quiz_audio', 'Audio')}:</strong>
                                <span>${t('quiz_audio_desc', 'Click the speaker icon next to any question or answer to hear pronunciation.')}</span>
                            </li>
                            <li>
                                <span class="material-icons">check_circle</span>
                                <strong>${t('quiz_answers', 'Answers')}:</strong>
                                <span>${t('quiz_answers_desc', 'Correct answers turn green, incorrect turn red.')}</span>
                            </li>
                            <li>
                                <span class="material-icons">refresh</span>
                                <strong>${t('quiz_retry', 'Retry')}:</strong>
                                <span>${t('quiz_retry_desc', 'After the quiz, you can retry only the questions you got wrong.')}</span>
                            </li>
                        </ul>

                        <div class="help-note">
                            <span class="material-icons">lightbulb</span>
                            <p>${t('quiz_tip', 'Tip: The quiz pulls distractors from other items in the same set, making it challenging but fair!')}</p>
                        </div>
                    </div>
                </details>

                <!-- Sentence Building Game -->
                <details class="help-details">
                    <summary>
                        <span class="material-icons">dashboard</span>
                        ${t('sentence_game_help', 'Sentence Building Game')}
                    </summary>
                    <div class="help-content">
                        <h4>${t('game_start', 'How to Play')}</h4>
                        <ul class="help-list">
                            <li>
                                <span class="material-icons">touch_app</span>
                                <strong>${t('game_access', 'Access')}:</strong>
                                <span>${t('game_access_desc', 'Click the "Sentences" button with dashboard icon next to any document or section.')}</span>
                            </li>
                            <li>
                                <span class="material-icons">add_circle</span>
                                <strong>${t('game_add', 'Adding Words')}:</strong>
                                <span>${t('game_add_desc', 'Tap any word in the "Available Words" area to add it to your sentence.')}</span>
                            </li>
                            <li>
                                <span class="material-icons">remove_circle</span>
                                <strong>${t('game_remove', 'Removing Words')}:</strong>
                                <span>${t('game_remove_desc', 'Tap the X on any constructed word to remove it.')}</span>
                            </li>
                        </ul>

                        <h4>${t('game_controls', 'Controls')}</h4>
                        <ul class="help-list">
                            <li>
                                <span class="material-icons">refresh</span>
                                <strong>${t('game_reset', 'Reset')}:</strong>
                                <span>${t('game_reset_desc', 'Clear your current sentence and start over.')}</span>
                            </li>
                            <li>
                                <span class="material-icons">check</span>
                                <strong>${t('game_check', 'Check')}:</strong>
                                <span>${t('game_check_desc', 'Verify if your sentence order is correct.')}</span>
                            </li>
                            <li>
                                <span class="material-icons">arrow_forward</span>
                                <strong>${t('game_next', 'Next')}:</strong>
                                <span>${t('game_next_desc', 'Move to the next sentence after completing the current one.')}</span>
                            </li>
                        </ul>
                    </div>
                </details>

                <!-- Settings & Customization -->
                <details class="help-details">
                    <summary>
                        <span class="material-icons">settings</span>
                        ${t('settings_custom', 'Settings & Customization')}
                    </summary>
                    <div class="help-content">
                        <h4>${t('language_settings', 'Language Settings')}</h4>
                        <ul class="help-list">
                            <li>
                                <span class="material-icons">language</span>
                                <strong>${t('ui_language', 'UI Language')}:</strong>
                                <span>${t('ui_language_desc', 'Change the app interface language using the language button in the toolbar.')}</span>
                            </li>
                            <li>
                                <span class="material-icons">check_box</span>
                                <strong>${t('translation_languages', 'Translation Languages')}:</strong>
                                <span>${t('translation_languages_desc', 'In Settings, check/uncheck languages to show/hide their translations.')}</span>
                            </li>
                            <li>
                                <span class="material-icons">format_list_numbered</span>
                                <strong>${t('repeat_counts', 'Repeat Counts')}:</strong>
                                <span>${t('repeat_counts_desc', 'Set how many times each language repeats during audio playback (1-3).')}</span>
                            </li>
                        </ul>

                        <h4>${t('playback_settings', 'Playback Settings')}</h4>
                        <ul class="help-list">
                            <li>
                                <span class="material-icons">format_list_bulleted</span>
                                <strong>${t('word_breakdown_help', 'Word Breakdown')}:</strong>
                                <span>${t('word_breakdown_help_desc', 'Toggle whether individual words within a sentence and their corresponding selected translations are highlighted.  When enabled, the highlighting and speech sequence is: 1) Source sentence, 2) Individual words in the source sentence with translations, 3) Full sentence translations. When disabled, only sentences are played.')}</span>
                            </li>
                        </ul>

                        <h4>${t('appearance', 'Appearance')}</h4>
                        <ul class="help-list">
                            <li>
                                <span class="material-icons">dark_mode</span>
                                <strong>${t('theme', 'Theme')}:</strong>
                                <span>${t('theme_desc', 'Toggle between light and dark mode using the theme button.')}</span>
                            </li>
                            <li>
                                <span class="material-icons">text_fields</span>
                                <strong>${t('font', 'Font')}:</strong>
                                <span>${t('font_desc', 'Choose from different font styles for better readability.')}</span>
                            </li>
                        </ul>

                        <h4>${t('progress', 'Progress & Data')}</h4>
                        <ul class="help-list">
                            <li>
                                <span class="material-icons">save</span>
                                <strong>${t('auto_save', 'Auto-Save')}:</strong>
                                <span>${t('auto_save_desc', 'All your flashcard progress, settings, and bookmarks are automatically saved in your browser.')}</span>
                            </li>
                            <li>
                                <span class="material-icons">backup</span>
                                <strong>${t('export_import', 'Export/Import')}:</strong>
                                <span>${t('export_import_desc', 'Use the export/import feature to backup or transfer your progress.')}</span>
                            </li>
                        </ul>
                    </div>
                </details>

                <!-- Quick Reference -->
                <details class="help-details">
                    <summary>
                        <span class="material-icons">menu_book</span>
                        ${t('quick_reference', 'Quick Reference')}
                    </summary>
                    <div class="help-content">
                        <table class="help-table">
                            <tr>
                                <th>${t('button', 'Button')}</th>
                                <th>${t('action', 'Action')}</th>
                            </tr>
                            <tr>
                                <td><span class="material-icons">home</span></td>
                                <td>${t('home_action', 'Return to Library')}</td>
                            </tr>
                            <tr>
                                <td><span class="material-icons">language</span></td>
                                <td>${t('language_action', 'Change UI Language')}</td>
                            </tr>
                            <tr>
                                <td><span class="material-icons">text_fields</span></td>
                                <td>${t('font_action', 'Change Font Style')}</td>
                            </tr>
                            <tr>
                                <td><span class="material-icons">dark_mode</span>/<span class="material-icons">light_mode</span></td>
                                <td>${t('theme_action', 'Toggle Dark/Light Theme')}</td>
                            </tr>
                            <tr>
                                <td><span class="material-icons">style</span></td>
                                <td>${t('flashcard_action', 'Start Flashcards')}</td>
                            </tr>
                            <tr>
                                <td><span class="material-icons">quiz</span></td>
                                <td>${t('quiz_action', 'Start Quiz')}</td>
                            </tr>
                            <tr>
                                <td><span class="material-icons">dashboard</span></td>
                                <td>${t('game_action', 'Start Sentence Game')}</td>
                            </tr>
                            <tr>
                                <td><span class="material-icons">settings</span></td>
                                <td>${t('settings_action', 'Open Settings')}</td>
                            </tr>
                        </table>
                    </div>
                </details>

                <!-- Troubleshooting -->
                <details class="help-details">
                    <summary>
                        <span class="material-icons">support_agent</span>
                        ${t('troubleshooting', 'Troubleshooting')}
                    </summary>
                    <div class="help-content">
                        <h4>${t('no_audio', 'No Audio?')}</h4>
                        <ul class="help-list">
                            <li>
                                <span class="material-icons">smartphone</span>
                                <strong>${t('android', 'Android')}:</strong>
                                <span>${t('android_help', 'Install Google Text-to-Speech and download Thai voice data.')}</span>
                            </li>
                            <li>
                                <span class="material-icons">laptop</span>
                                <strong>${t('ios_mac', 'iOS/macOS')}:</strong>
                                <span>${t('ios_help', 'Go to Settings > Accessibility > Spoken Content to download Thai voice.')}</span>
                            </li>
                            <li>
                                <span class="material-icons">computer</span>
                                <strong>${t('windows', 'Windows')}:</strong>
                                <span>${t('windows_help', 'Install Thai language pack in Settings > Time & Language.')}</span>
                            </li>
                        </ul>

                        <h4>${t('progress_lost', 'Progress Lost?')}</h4>
                        <ul class="help-list">
                            <li>
                                <span class="material-icons">cookie</span>
                                <strong>${t('clear_data', 'Cleared Browser Data')}:</strong>
                                <span>${t('clear_data_desc', 'Progress is stored locally. Clearing browser data will reset your progress. Use export feature to backup.')}</span>
                            </li>
                            <li>
                                <span class="material-icons">sync_disabled</span>
                                <strong>${t('private_mode', 'Private/Incognito Mode')}:</strong>
                                <span>${t('private_desc', 'Progress may not persist in private browsing modes.')}</span>
                            </li>
                        </ul>

                        <h4>${t('other_issues', 'Other Issues')}</h4>
                        <ul class="help-list">
                            <li>
                                <span class="material-icons">refresh</span>
                                <strong>${t('refresh', 'Refresh')}:</strong>
                                <span>${t('refresh_desc', 'If something isn\'t working, try refreshing the page.')}</span>
                            </li>
                            <li>
                                <span class="material-icons">bug_report</span>
                                <strong>${t('report', 'Report Issues')}:</strong>
                                <span>${t('report_desc', 'Tell your instructor about any bugs you find!')}</span>
                            </li>
                        </ul>
                    </div>
                </details>

<!-- Your Progress Panel -->
<details class="help-details" open>
    <summary>
        <span class="material-icons">insights</span>
        ${t('your_learning_progress', 'Your Learning Progress')}
    </summary>
    <div class="help-content">
        <!-- Study Streak -->
        <div class="progress-streak">
            <div class="streak-card">
                <span class="material-icons">local_fire_department</span>
                <div class="streak-numbers">
                    <span class="streak-current">${App.getStreak()} ${App.getStreak() === 1 ? t('day', 'day') : t('days', 'days')}</span>
                    <span class="streak-label">${t('current_streak', 'Current Streak')}</span>
                </div>
            </div>
            <div class="streak-calendar">
                ${App.renderStreakCalendar()}
            </div>
        </div>

        <!-- Stats Grid -->
        <div class="progress-stats-grid">
            <div class="stat-card">
                <span class="material-icons">menu_book</span>
                <div class="stat-value">${App.getDocumentsOpened()}</div>
                <div class="stat-label">${t('documents_studied', 'Documents Studied')}</div>
            </div>
            <div class="stat-card">
                <span class="material-icons">style</span>
                <div class="stat-value">${App.getFlashcardsReviewed()}</div>
                <div class="stat-label">${t('flashcards_reviewed', 'Flashcards Reviewed')}</div>
            </div>
            <div class="stat-card">
                <span class="material-icons">quiz</span>
                <div class="stat-value">${App.getQuizzesTaken()}</div>
                <div class="stat-label">${t('quizzes_taken', 'Quizzes Taken')}</div>
            </div>
            <div class="stat-card">
                <span class="material-icons">dashboard</span>
                <div class="stat-value">${App.getGamesPlayed()}</div>
                <div class="stat-label">${t('games_played', 'Games Played')}</div>
            </div>
        </div>

        <!-- Due Cards -->
        <div class="progress-due">
            <h4>${t('due_for_review', 'Due for Review')}</h4>
            <div class="due-cards">
                <div class="due-item">
                    <span class="due-count">${App.getDueToday()}</span>
                    <span class="due-label">${t('cards_today', 'cards today')}</span>
                </div>
                <div class="due-progress">
                    <div class="due-progress-bar" style="width: ${App.getReviewProgress()}%"></div>
                </div>
            </div>
        </div>

        <!-- Recent Activity -->
        <div class="recent-activity">
            <h4>${t('recent_activity', 'Recent Activity')}</h4>
            <div class="activity-timeline">
                ${App.renderActivityTimeline(t)}
            </div>
        </div>

        <!-- Achievements -->
        <div class="achievements-section">
            <h4>${t('achievements', 'Achievements')}</h4>
            <div class="achievements-grid">
                ${App.renderAchievements(t)}
            </div>
        </div>

        <!-- Next Milestone -->
        <div class="next-milestone">
            <div class="milestone-header">
                <span class="material-icons">flag</span>
                <span>${t('next_milestone', 'Next Milestone')}</span>
            </div>
            <div class="milestone-progress">
                <div class="milestone-bar" style="width: ${App.getMilestoneProgress()}%"></div>
            </div>
            <div class="milestone-text">${App.getNextMilestoneText(t)}</div>
        </div>

        <!-- Reset Data Option -->
        <div class="progress-footer">
            <button class="btn-activity" onclick="App.resetProgressData()" style="background: var(--error);">
                <span class="material-icons">restore</span>
                ${t('reset_progress_data', 'Reset Progress Data')}
            </button>
        </div>
    </div>
</details>
        
<!-- Contact Us -->
<details class="help-details">
    <summary>
        <span class="material-icons">contact_support</span>
        ${t('contact_us', 'Contact Us')}
    </summary>
    <div class="help-content">
        <div style="
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            border-radius: 16px;
            padding: 32px 4px;
            color: white;
            text-align: center;
        ">
            <span class="material-icons" style="font-size: 48px; margin-bottom: 16px;">email</span>
            
            <h3 style="margin: 0 0 8px 0; color: white; font-size: 1.5rem; font-weight: 600;">
                ${t('get_in_touch', 'Get in Touch')}
            </h3>
            
            <p style="margin: 0 0 24px 0; opacity: 0.9; font-size: 1rem; line-height: 1.5;">
                ${t('contact_message', 'Have a question, feedback, or need help?')}
            </p>
            
            <a href="mailto:ebrahimShaghouei@gmail.com" 
               style="
                display: inline-flex;
                align-items: center;
                gap: 12px;
                background: white;
                color: var(--primary-dark);
                text-decoration: none;
                padding: 1rem;
                border-radius: 16px;
                font-weight: 600;
                font-size: 0.9rem;
                transition: all 0.2s ease;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            "
               onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.25)';"
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.2)';">
                <span>Ebbi <span lang="th">หล่อ</span> ebrahimShaghouei@gmail.com</span>
             </a>
        </div>
    </div>
</details>


                <!-- Back to Library Button -->
                <div class="help-footer">
                    <button class="btn-activity" onclick="location.hash='library'">
                        <span class="material-icons">arrow_back</span>
                        ${t('back_to_library', 'Back to Library')}
                    </button>
                </div>
            </div>
        `;
                App.hideMediaBar();
            }
        },

        // ------------------------------------------------------------------------
        // Bookmarks View
        // ------------------------------------------------------------------------
        Bookmarks: {
            render() {
                const container = UI.getContainer();
                if (!container) return;

                const bookmarkedCards = Object.values(State.data.srs.items)
                    .filter(item => item.bookmarked);

                if (bookmarkedCards.length === 0) {
                    container.innerHTML = `
                        <div class="flashcard-empty-state">
                            <span class="material-icons">bookmark_border</span>
                            <h2>${Services.I18n.t('no_bookmarks', 'No bookmarked cards')}</h2>
                            <p>${Services.I18n.t('no_bookmarks_message', 'Bookmark cards while studying to review them later.')}</p>
                            <button class="btn-activity" onclick="location.hash='library'">Back to Library</button>
                        </div>
                    `;
                    App.hideMediaBar();
                    return;
                }

                State.data.flashcards = {
                    currentDeck: bookmarkedCards,
                    currentIndex: 0,
                    showAnswer: false,
                    isBookmarkView: true
                };

                UI.Flashcard.renderCard();
            }
        },

        // ------------------------------------------------------------------------
        // Settings Overlay
        // ------------------------------------------------------------------------
        // UI.Settings.render method (around line 3700-3800)
        Settings: {
            render() {
                const anchor = document.getElementById('overlay-anchor');
                if (!anchor) return;

                const media = State.data.media;
                const t = Services.I18n.t;

                const langRows = Object.entries(media.languageSettings)
                    .map(([code, config]) => `
                <tr>
                    <td>${code.toUpperCase()}</td>
                    <td>
                        <input type="checkbox" id="show-${code}"
                            ${config.show ? 'checked' : ''}
                            onchange="App.updateLanguageConfig('${code}', 'show', this.checked, true)">
                    </td>
                    <td>
                        <input type="number" style="width:40px" id="repeat-${code}"
                            value="${config.repeat}" min="1" max="3"
                            onchange="App.updateLanguageConfig('${code}', 'repeat', this.value, true)">
                    </td>
                </tr>
            `).join('');

                // Build the complete HTML string
                let html = `
            <div class="overlay-full card">
                <div class="settings-header">
                    <h2>${t('settings', 'Settings')}</h2>
                    <button class="material-icons" onclick="document.getElementById('overlay-anchor').innerHTML=''">close</button>
                </div>
                
                <div class="settings-sliders">
                    <div class="control-row-inline">
                        <label>${t('speed', 'Speed')}</label>
                        <input type="range" min="0.5" max="2" step="0.25"
                            value="${media.speed}"
                            oninput="this.nextElementSibling.innerText = this.value + 'x'; App.updateMediaParam('speed', this.value, true)">
                        <span class="val-label">${media.speed}x</span>
                    </div>
                    <div class="control-row-inline">
                        <label>${t('delay', 'Delay')}</label>
                        <input type="range" min="1" max="5" step="1"
                            value="${media.delay}"
                            oninput="this.nextElementSibling.innerText = this.value + 's'; App.updateMediaParam('delay', this.value, true)">
                        <span class="val-label">${media.delay}s</span>
                    </div>
                    <div class="control-row-inline">
                        <label>${t('pitch', 'Pitch')}</label>
                        <input type="range" min="0.5" max="1.5" step="0.1"
                            value="${media.pitch}"
                            oninput="this.nextElementSibling.innerText = this.value; App.updateMediaParam('pitch', this.value, true)">
                        <span class="val-label">${media.pitch}</span>
                    </div>
                </div>
                
                <label>${t('voice', 'Voice')}</label>
                <select id="voice-select" onchange="App.updateMediaParam('voice', this.value)" style="width:100%; margin-bottom:15px;">
                    ${Services.MediaService.cachedVoices.map(v => `
                        <option value="${v.name}" ${media.voice === v.name ? 'selected' : ''}>
                            ${v.name}
                        </option>
                    `).join('')}
                </select>
                
                <table>
                    <thead>
                        <tr>
                            <th>${t('translation', 'Translation')}</th>
                            <th>${t('show', 'Show')}</th>
                            <th><span class="material-icons">volume_up</span> ${t('repeat', 'Repeat')}</th>
                        </tr>
                    </thead>
                    <tbody>${langRows}</tbody>
                </table>
        `;

                // Add Word Breakdown Toggle
                html += `
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--border);">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                        <label for="showWordBreakdown" style="font-weight: 600;">
                            <span class="material-icons" style="vertical-align: middle; margin-right: 8px;">format_list_bulleted</span>
                            ${t('show_word_breakdown', 'Show Word Breakdown')}
                        </label>
                        <label class="toggle-switch">
                            <input type="checkbox" id="showWordBreakdown" 
                                   ${State.data.media.showWordBreakdown ? 'checked' : ''}
                                   onchange="App.updateShowWordBreakdown(this.checked)">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0 0 10px 0;">
                        ${t('show_word_breakdown_desc', 'When enabled, individual words in sentences will be shown and spoken during audio playback.')}
                    </p>
                </div>
        `;

                // Add Reset to Defaults Button
                html += `
                <div style="display: flex; justify-content: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--border);">
                    <button class="btn-activity" onclick="App.resetSettingsToDefaults()" style="background: var(--text-secondary);">
                        <span class="material-icons">restore</span>
                        ${t('reset_defaults', 'Reset to Defaults')}
                    </button>
                </div>
            </div>
        `;

                anchor.innerHTML = html;
            }
        },

        // ------------------------------------------------------------------------
        // Grammar Sheet
        // ------------------------------------------------------------------------

        GrammarSheet: {
            render(content) {
                let anchor = document.getElementById('grammar-sheet-anchor');
                if (!anchor) {
                    anchor = document.createElement('div');
                    anchor.id = 'grammar-sheet-anchor';
                    document.body.appendChild(anchor);
                }

                const t = Services.I18n.t;
                const currentLang = State.data.lang;
                const dir = currentLang === 'fa' ? 'rtl' : 'ltr';

                // Get all enabled languages from settings
                const enabledLangs = Object.keys(State.data.media.languageSettings)
                    .filter(code => State.data.media.languageSettings[code].show);

                // Format pattern display
                const patternHtml = content.pattern ? `
            <div class="grammar-pattern">
                <div class="pattern-title">${t('pattern', 'Pattern')}</div>
                <div class="pattern-example">
                    <span class="example-thai" lang="th">${UI.escapeHtml(content.pattern)}</span>
                </div>
            </div>
        ` : '';

                // Format explanation/note
                const noteHtml = content.note ? `
            <div class="grammar-note" lang="${currentLang}" dir="${dir}">
                ${UI.escapeHtml(content.note[currentLang] || content.note.en || content.note)}
            </div>
        ` : '';

                // Format current sentence with ALL language translations
                const currentSentenceHtml = content.source ? `
            <div class="current-sentence">
                <div class="pattern-title">${t('in_this_sentence', 'In this sentence')}</div>
                <div class="example-group">
                    <div class="pattern-example" onclick="App.media.play(this)"
                         data-text="${UI.escapeHtml(content.source)}" data-lang="th">
                        <span class="material-icons audio-icon-small">volume_up</span>
                        <span class="example-thai" lang="th">${UI.escapeHtml(content.source)}</span>
                    </div>
                    ${enabledLangs.filter(lang => lang !== 'th' && content.translations && content.translations[lang]).map(lang => {
                    const dir = lang === 'fa' ? 'rtl' : 'ltr';
                    return `
                            <div class="pattern-example translation-example" 
                                 onclick="App.media.play(this)"
                                 data-text="${UI.escapeHtml(content.translations[lang])}" 
                                 data-lang="${lang}">
                                <span class="material-icons audio-icon-small">volume_up</span>
                                <span class="example-${lang}" lang="${lang}" dir="${dir}">
                                    ${UI.escapeHtml(content.translations[lang])}
                                </span>
                            </div>
                        `;
                }).join('')}
                </div>
            </div>
        ` : '';

                // Format examples from grammar data - ONLY use examples from the grammar object
                const examplesHtml = content.examples && content.examples.length > 0 ? `
            <div class="more-examples">
                <div class="pattern-title">${t('more_examples', 'More examples')}</div>
                ${content.examples.map(ex => `
                    <div class="example-group">
                        <div class="pattern-example" onclick="App.media.play(this)"
                             data-text="${UI.escapeHtml(ex.source)}" data-lang="th">
                            <span class="material-icons audio-icon-small">volume_up</span>
                            <span class="example-thai" lang="th">${UI.escapeHtml(ex.source)}</span>
                        </div>
                        ${enabledLangs.filter(lang => lang !== 'th' && ex.translations && ex.translations[lang]).map(lang => {
                    const dir = lang === 'fa' ? 'rtl' : 'ltr';
                    return `
                                <div class="pattern-example translation-example" 
                                     onclick="App.media.play(this)"
                                     data-text="${UI.escapeHtml(ex.translations[lang])}" 
                                     data-lang="${lang}">
                                    <span class="material-icons audio-icon-small">volume_up</span>
                                    <span class="example-${lang}" lang="${lang}" dir="${dir}">
                                        ${UI.escapeHtml(ex.translations[lang])}
                                    </span>
                                </div>
                            `;
                }).join('')}
                    </div>
                `).join('')}
            </div>
        ` : '';

                // Usage information if available
                const usageHtml = content.usage ? `
            <div class="grammar-usage" lang="${currentLang}" dir="${dir}">
                <div class="pattern-title">${t('usage', 'Usage')}</div>
                <p>${UI.escapeHtml(content.usage[currentLang] || content.usage.en || '')}</p>
            </div>
        ` : '';

                anchor.innerHTML = `
            <div class="sheet-backdrop" onclick="App.closeGrammarSheet()"></div>
            <div class="bottom-sheet ${State.data.theme === 'dark' ? 'dark-theme' : ''}">
                <div class="sheet-handle" onclick="App.closeGrammarSheet()"></div>
                <div class="sheet-header">
                    <h3>${t('grammar_note', 'Grammar Note')}</h3>
                    <button class="sheet-close material-icons" onclick="App.closeGrammarSheet()">close</button>
                </div>
                <div class="sheet-content">
                    ${patternHtml}
                    ${noteHtml}
                    ${usageHtml}
                    ${currentSentenceHtml}
                    ${examplesHtml}
                    
                    <!-- No content message -->
                    ${!patternHtml && !noteHtml && !currentSentenceHtml && !examplesHtml ? `
                        <div class="grammar-empty">
                            <span class="material-icons">info</span>
                            <p>${t('no_grammar_info', 'No grammar information available.')}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

                // Add animation classes
                setTimeout(() => {
                    const sheet = document.querySelector('.bottom-sheet');
                    const backdrop = document.querySelector('.sheet-backdrop');
                    if (sheet) sheet.classList.add('open');
                    if (backdrop) backdrop.classList.add('visible');
                }, 10);
            }
        }

    };

    // ----------------------------------------------------------------------------
    // 5. PUBLIC API - What's exposed to the window
    // ----------------------------------------------------------------------------

    return {
        state: State,
        router: Router,
        Services: Services,

        async init() {

            // Load accordion states first
            State.loadAccordionStates();

            // Track this visit
            State.data.sessionHistory.totalVisits = (State.data.sessionHistory.totalVisits || 0) + 1;
            State.data.sessionHistory.lastVisit = new Date().toISOString();
            State.save('sessionHistory');

            this.renderLayout();
            await Services.I18n.loadTranslations();
            await Services.DataService.loadManifest();
            await Services.PronunciationService.init();
            this.applyTheme();
            Router.init();
            Services.MediaService.init();

            // Check if we should auto-open last document based on URL
            const hash = window.location.hash.slice(1);
            if (!hash && State.data.lastDocument) {
                // Optional: Uncomment if you want to auto-navigate to last document on startup
                // this.router.go(`doc/${State.data.lastDocument}`);
                // For now, we just highlight it in the library (already handled by UI.Library.render)
                //  console.log('Last document available:', State.data.lastDocument);
            }

            const pauseOnInteraction = () => {
                if (State.data.media.isPlaying && !State.data.isAutoScrolling) {
                    State.data.media.isPlaying = false;
                    window.speechSynthesis.cancel();
                    this.showMediaBar();
                }
            };

            window.addEventListener('wheel', pauseOnInteraction, { passive: true });
            window.addEventListener('touchmove', pauseOnInteraction, { passive: true });
            window.addEventListener('keydown', (e) => {
                if (State.data.isAutoScrolling) return;
                if (e.key.includes('Arrow') || e.key === ' ' || e.key.includes('Page')) {
                    pauseOnInteraction();
                }
            });
        },

        renderLayout() {
            const app = document.getElementById('app');
            if (!app) return;

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
                            ${State.data.theme === 'light' ? 'dark_mode' : 'light_mode'}
                        </button>
                        <button class="material-icons toolbar-btn"
                                onclick="location.hash='help'">help_outline</button>
                    </nav>
                </header>
                <div id="media-player-container"></div>
                <main id="main-content"></main>
                <div id="overlay-anchor"></div>
            `;
        },

        applyTheme() {
            document.body.className = `${State.data.theme}-theme ${State.data.font}`;
            document.documentElement.lang = State.data.lang;
            document.documentElement.dir = State.data.lang === 'fa' ? 'rtl' : 'ltr';
        },

        handleLibraryAccordion(clickedIndex) {
            // Close all other sections by updating state
            // If clicking the same section that's already open, close it (null means no section open)
            // Otherwise open the clicked section
            State.data.libraryAccordion.openSection =
                State.data.libraryAccordion.openSection === clickedIndex ? null : clickedIndex;
            State.save('libraryAccordion');

            // Force re-render of library to reflect changes
            if (window.location.hash === '#library' || window.location.hash === '') {
                UI.Library.render();
            }
        },

        handleDocumentAccordion(documentId, clickedIndex) {
            // Get current open section for this document
            const currentOpen = State.data.documentAccordion.openSections[documentId];

            // Update state - if clicking same section, close it; otherwise open new one
            // Using null to represent closed state (no sections open)
            State.data.documentAccordion.openSections[documentId] =
                currentOpen === clickedIndex ? null : clickedIndex;
            State.save('documentAccordion');

            // Note: The actual opening/closing is handled by the browser's details/summary elements
            // We just need to save the state for next time
        },

        handleDocumentClick(documentId) {
            // Store this as the last opened document and navigate
            State.data.lastDocument = documentId;
            State.save('lastDocument');

            // Increment document counter
            State.data.activityCounts.documentsOpened = (State.data.activityCounts.documentsOpened || 0) + 1;
            State.save('activityCounts');

            // Add to activity history
            this.addActivity('menu_book', 'activity_opened_document', { name: documentId });

            // Update streak
            this.updateStreak();

            App.router.go(`doc/${documentId}`);
        },

        alphabet: {

            showCharacterDetail(characterId) {
                const anchor = document.getElementById('overlay-anchor');
                if (!anchor) return;

                anchor.innerHTML = `
                    <div class="overlay-full card character-detail-overlay">
                        <div class="settings-header">
                            <h2>Character Details</h2>
                            <button class="material-icons" onclick="this.closest('.overlay-full').remove()">close</button>
                        </div>
                        <div class="character-large">${characterId}</div>
                        <div class="character-actions">
                            <button class="btn-activity audio-element" 
                                    onclick="App.media.play(this)"
                                    data-text="${characterId}" 
                                    data-lang="th">
                                <span class="material-icons">volume_up</span> Hear
                            </button>
                        </div>
                    </div>
                `;
            },

            addToFlashcards(characterId) {
                App.showNotification('Added to flashcards');
                // SRS integration would go here
            },

            checkSoundAnswer(correctId, button) {
                // Simplified feedback
                button.classList.add('correct');
                setTimeout(() => button.classList.remove('correct'), 1000);
            }
        },

        handleDetailsToggle: function (details, isOpen) {
            // If a details panel is being closed and we're playing, we should stop
            if (!isOpen && State.data.media.isPlaying) {
                // Check if the currently playing element is inside this details panel
                const currentElements = document.querySelectorAll('.audio-element');
                const currentElement = currentElements[State.data.media.currentIndex];
                if (currentElement && details.contains(currentElement)) {
                    // The element being played is inside the panel being closed, stop playback
                    Services.MediaService.stopSequence();
                }
            }
        },

        startFlashcards(docId, sectionIdx, type) {
            // Will be incremented when flashcards are actually viewed
            // The actual count will be updated in rateFlashcard

            Router.go(`flashcard/${docId}/${sectionIdx}/${type}`);
        },

        startSentenceGame(docId, sectionIdx) {

            State.data.activityCounts.gamesPlayed = (State.data.activityCounts.gamesPlayed || 0) + 1;
            State.save('activityCounts');

            // Add to activity history
            this.addActivity('dashboard', 'activity_started_game');

            // Update streak
            this.updateStreak();

            Router.go(`sentence-game/${docId}/${sectionIdx}`);
        },

        showMediaBar() {
            const container = document.getElementById('media-player-container');
            if (!container) return;
            this.renderMediaBar(container);
        },

        hideMediaBar() {
            const container = document.getElementById('media-player-container');
            if (container) {
                container.innerHTML = '';
            }
            document.body.classList.remove('has-media-bar');
        },

        renderMediaBar(container) {
            const media = State.data.media;

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
                <div id="media-text-display" class="media-text-display"></div>
            </div>
            <div class="media-col">
                <button class="material-icons player-ctrl"
                        onclick="App.showSettingsOverlay()">settings</button>
            </div>
        </div>`;

            document.body.classList.add('has-media-bar');
        },

        togglePlay: function () {
            State.data.media.isPlaying = !State.data.media.isPlaying;
            if (State.data.media.isPlaying) {
                this.playSequence();
                this.updatePlayPauseIcon(true);
                // Show notification when starting playback
                const message = Services.I18n.t('click_stop_before_play', 'Click Stop before clicking an item to play');
                App.showNotification(message, 3000);
            } else {
                Services.MediaService.pausePlayback();
                this.updatePlayPauseIcon(false);
            }
            this.showMediaBar();
        },

        stopSequence: function () {
            State.data.media.isPlaying = false;
            State.data.media.currentIndex = 0;
            window.speechSynthesis.cancel();
            this.showMediaBar();
            this.updatePlayPauseIcon(false);
            // REMOVE THIS LINE:
            // const message = Services.I18n.t('playback_stopped', 'Playback stopped');
            // App.showNotification(message, 2000);
        },

        showSettingsOverlay() {
            UI.Settings.render();
        },

        resetSettingsToDefaults() {
            // Reset media settings to defaults
            State.data.media.speed = State.defaults.media.speed;
            State.data.media.delay = State.defaults.media.delay;
            State.data.media.pitch = State.defaults.media.pitch;
            State.data.media.voice = State.defaults.media.voice;
            State.data.media.showWordBreakdown = State.defaults.media.showWordBreakdown; // NEW
            State.data.media.languageSettings = JSON.parse(JSON.stringify(State.defaults.media.languageSettings)); // Deep copy

            // Save all media settings
            State.save('media');

            // Clear any selected voice from localStorage
            localStorage.removeItem('localStorageVoice');
            localStorage.removeItem('localStorageShowWordBreakdown'); // NEW

            // Close the settings overlay
            const anchor = document.getElementById('overlay-anchor');
            if (anchor) anchor.innerHTML = '';

            // Refresh the media bar to show updated values
            const mediaBar = document.getElementById('media-player-container');
            if (mediaBar) {
                this.renderMediaBar(mediaBar);
            }

            // Re-render the current view to apply language visibility changes
            Router.handle();

            // Show confirmation notification
            this.showNotification(Services.I18n.t('settings_reset', 'Settings reset to defaults'));
        },

        // Update the showNotification method to accept a duration parameter (around line 4800)
        showNotification(message, duration = 5000) {
            // Remove any existing notification
            const existing = document.getElementById('settings-notification');
            if (existing) existing.remove();

            // Create notification element
            const notification = document.createElement('div');
            notification.id = 'settings-notification';
            notification.textContent = message;
            notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary);
        color: white;
        padding: 10px 20px;
        border-radius: 20px;
        z-index: 3000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        animation: fadeInOut ${duration / 1000}s ease;
    `;

            document.body.appendChild(notification);

            // Remove after duration
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, duration);
        },

        playAudio: function (text, lang = 'th') {
            Services.MediaService.speak(text, lang);
        },

        playSequence() {
            // console.log('=== playSequence started ===');

            // CRITICAL: Check if we're still in a document view
            const mainContent = document.getElementById('main-content');
            const isInDocument = mainContent?.querySelector('.document-content') !== null;

            if (!isInDocument) {
                // console.log('Not in document view, stopping playback');
                this.stopSequence();
                this.updatePlayPauseIcon(false);
                return;
            }

            // Ensure play icon is set to pause
            this.updatePlayPauseIcon(true);

            // console.log('Current index:', State.data.media.currentIndex);

            // Enable scroll listeners when playback starts
            Services.MediaService.enableScrollListeners();

            // Get ALL audio elements
            const allElements = document.querySelectorAll('.audio-element');

            // Use the MediaService method for filtering
            const sequenceElements = Array.from(allElements).filter(el => {
                const isSeq = Services.MediaService.isSequenceElement(el);
                if (isSeq && State.data.media.showWordBreakdown) {
                    // Log breakdown elements to verify they're being included
                    if (el.closest('.sent-word-block') ||
                        el.classList.contains('sent-word-item') ||
                        el.classList.contains('sent-word-trans')) {
                        /*
                                                console.log('Including breakdown element in sequence:', {
                                                    classes: el.classList,
                                                    text: el.getAttribute('data-text')
                                                });
                                                */
                    }
                }
                return isSeq;
            });
            /*
                        console.log('PlaySequence - All elements:', allElements.length);
                        console.log('PlaySequence - Sequence elements:', sequenceElements.length);
                        console.log('PlaySequence - Breakdown elements count:',
                            sequenceElements.filter(el => el.closest('.sent-word-block')).length);
                        console.log('PlaySequence - Starting from index:', State.data.media.currentIndex);
            */
            // If current index is beyond sequence elements, reset to 0
            if (State.data.media.currentIndex >= sequenceElements.length) {
                State.data.media.currentIndex = 0;
            }

            const settings = State.data.media.languageSettings;

            // Initialize tracking if needed
            if (!State.data.scrolledRows) {
                State.data.scrolledRows = new Set();
            }
            State.data.currentRowId = null;

            // Scroll handling variables
            let scrollEndTimer = null;
            let isPausedByScroll = false;
            let pendingScrollCompletion = false;

            // Function to handle scroll end - simplified to avoid race condition
            const onScrollEnd = () => {
                if (scrollEndTimer) {
                    clearTimeout(scrollEndTimer);
                }

                scrollEndTimer = setTimeout(() => {
                    // console.log('Scroll has completely ended');
                    // Set a longer lock after scroll ends to catch any final events
                    window.scrollLockUntil = Date.now() + 500;

                    // Don't set isAutoScrolling false immediately - wait a bit
                    setTimeout(() => {
                        // console.log('Setting isAutoScrolling = false');
                        State.data.isAutoScrolling = false;
                        pendingScrollCompletion = false;
                    }, 200);

                    scrollEndTimer = null;
                }, 200);
            };

            playNext = () => {
                // console.log('playNext called, currentIndex:', State.data.media.currentIndex);

                // Check if we should pause due to pending scroll completion
                if (pendingScrollCompletion && State.data.media.isPlaying) {
                    // console.log('Pending scroll completion, waiting...');
                    setTimeout(playNext, 50);
                    return;
                }

                if (!State.data.media.isPlaying) {
                    // console.log('Playback stopped by user');
                    return;
                }

                // Re-query sequence elements in case DOM has changed
                const currentAllElements = document.querySelectorAll('.audio-element');
                const currentSequenceElements = Array.from(currentAllElements).filter(el => Services.MediaService.isSequenceElement(el));

                if (State.data.media.currentIndex >= currentSequenceElements.length) {
                    // console.log('Reached end of sequence elements, stopping');
                    this.stopSequence();
                    return;
                }

                // Get the element from the sequence elements list, not from all elements
                const element = currentSequenceElements[State.data.media.currentIndex];
                if (!element) {
                    // console.log('Element not found at index', State.data.media.currentIndex);
                    State.data.media.currentIndex++;
                    setTimeout(playNext, 100);
                    return;
                }

                // Check if the element is inside a closed details panel and open it
                const details = element.closest('details');
                if (details && !details.open) {
                    // console.log('Opening closed details panel for element at index', State.data.media.currentIndex);
                    details.open = true;

                    // Find the section index from the details element
                    const sectionIndex = details.getAttribute('data-section-index');
                    if (sectionIndex !== null) {
                        const documentId = State.data.currentDocument?.id;
                        if (documentId) {
                            // Update the accordion state to reflect that this section is now open
                            // and all others should be closed (accordion behavior)
                            State.data.documentAccordion.openSections[documentId] = parseInt(sectionIndex);
                            State.save('documentAccordion');
                        }
                    }

                    // Small delay to allow the details panel to expand before continuing
                    setTimeout(() => {
                        // Re-get the sequence elements array as the DOM has changed
                        const updatedAllElements = document.querySelectorAll('.audio-element');
                        const updatedSequenceElements = Array.from(updatedAllElements).filter(el => Services.MediaService.isSequenceElement(el));
                        // Find the new index of the same element in the updated sequence
                        const updatedIndex = updatedSequenceElements.indexOf(element);
                        if (updatedIndex !== -1) {
                            State.data.media.currentIndex = updatedIndex;
                        }
                        playNext();
                    }, 150);
                    return;
                }

                // Find the row container
                let row = null;
                if (element.closest('.words-grid')) {
                    row = element.closest('.words-grid');
                    // console.log('Element is in words-grid, row:', row?.id || 'no id');
                } else if (element.closest('.alphabet-grid')) {
                    row = element.closest('.alphabet-grid');
                    // console.log('Element is in alphabet-grid, row:', row?.id || 'no id');
                } else if (element.closest('.character-grid')) {
                    row = element.closest('.character-grid');
                    // console.log('Element is in character-grid, row:', row?.id || 'no id');
                } else if (element.closest('.tone-rule-table-container')) {
                    row = element.closest('.tone-rule-table-container');
                    // console.log('Element is in tone-rule-table, row:', row?.id || 'no id');
                } else {
                    row = element.closest('.sentence-group, .word-card, .flashcard-front, .quiz-question-card, .alphabet-table-container');
                    // console.log('Element is in other container, row:', row?.className);
                }

                const rowId = row?.id || row?.getAttribute('data-uid') || `row-${State.data.media.currentIndex}`;

                // IMPORTANT: For alphabet content, we need to check if the element itself is in viewport
                // because all items share the same row container
                const elementRect = element.getBoundingClientRect();

                // Calculate visible area of the element
                const toolbarHeight = 56; // #app-toolbar height
                const mediaBar = document.getElementById('media-player-container');
                const mediaBarHeight = mediaBar && mediaBar.innerHTML ? 50 : 0; // media-row height when visible
                const topThreshold = toolbarHeight + mediaBarHeight + 20; // Add padding
                const bottomThreshold = 40; // Bottom padding

                // Check if element is in viewport with better thresholds
                const isElementInViewport = (
                    elementRect.top >= topThreshold &&
                    elementRect.bottom <= (window.innerHeight - bottomThreshold)
                );

                // Also check if element is partially visible but needs adjustment
                const needsScrolling = (
                    elementRect.top < topThreshold || // Element too high
                    elementRect.bottom > (window.innerHeight - bottomThreshold) || // Element too low
                    elementRect.top < 0 || // Element above viewport
                    elementRect.bottom > window.innerHeight // Element below viewport
                );

                // Scroll when:
                // 1. We enter a new row (different rowId) OR
                // 2. The element is not properly visible in viewport (for same row items)
                // 3. For alphabet grid items, always ensure they're visible
                const isAlphabetItem = element.classList.contains('alphabet-item') ||
                    element.closest('.alphabet-item') !== null;

                if ((rowId && rowId !== State.data.currentRowId) || needsScrolling || (isAlphabetItem && !isElementInViewport)) {
                    // console.log('Need to scroll -', {
                    //     newRow: rowId !== State.data.currentRowId,
                    //     needsScrolling,
                    //     isAlphabetItem,
                    //     isElementInViewport
                    // });

                    State.data.isAutoScrolling = true;
                    pendingScrollCompletion = true;

                    // Set a long scroll lock immediately
                    window.scrollLockUntil = Date.now() + 1500;

                    // Calculate total offset based on media bar visibility
                    const totalOffset = topThreshold + 20; // Increased padding for better visibility

                    // Determine what to scroll to - prefer the row container, but fall back to element
                    const scrollTarget = row || element;

                    // Use a more precise scroll with offset
                    const rect = scrollTarget.getBoundingClientRect();
                    const absoluteTop = window.scrollY + rect.top;

                    // Calculate target position - we want the element to be at the topThreshold position
                    let targetTop = absoluteTop - topThreshold;

                    // If it's an alphabet item in a grid, we might want to scroll to the row container
                    // to give context, but ensure the specific item is visible
                    if (isAlphabetItem && row && row !== element) {
                        // Scroll to the row but adjust so the element is visible
                        const rowRect = row.getBoundingClientRect();
                        const rowTop = window.scrollY + rowRect.top;

                        // Calculate how far into the row our element is
                        const elementOffsetInRow = elementRect.top - rowRect.top;

                        // Target the row such that our element is at the topThreshold
                        targetTop = rowTop + elementOffsetInRow - topThreshold;
                    }

                    // Ensure we don't scroll above the document
                    targetTop = Math.max(0, targetTop);

                    window.scrollTo({
                        top: targetTop,
                        behavior: 'smooth'
                    });

                    // Listen for scroll end
                    const scrollHandler = () => onScrollEnd();
                    window.addEventListener('scroll', scrollHandler, { passive: true });

                    setTimeout(() => {
                        // console.log('Initial scroll timeout complete');
                        window.removeEventListener('scroll', scrollHandler);

                        State.data.currentRowId = rowId;

                        // Small delay before speaking to let scroll events settle
                        setTimeout(() => {
                            pendingScrollCompletion = false;
                            speakCurrent();
                        }, 200); // Increased from 150ms to 200ms for better stability
                    }, 400);
                } else {
                    // console.log('Element is properly visible, speaking current element');
                    speakCurrent();
                }
            };

            const speakCurrent = () => {
                if (!State.data.media.isPlaying) return;

                // Re-query sequence elements in case DOM has changed
                const currentAllElements = document.querySelectorAll('.audio-element');
                const currentSequenceElements = Array.from(currentAllElements).filter(el => Services.MediaService.isSequenceElement(el));

                if (State.data.media.currentIndex >= currentSequenceElements.length) {
                    // console.log('Element no longer exists, stopping playback');
                    this.stopSequence();
                    return;
                }

                const element = currentSequenceElements[State.data.media.currentIndex];
                if (!element) {
                    // console.log('Element not found, moving to next');
                    State.data.media.currentIndex++;
                    setTimeout(playNext, 100);
                    return;
                }

                // Double-check that the element is in an open details panel
                const details = element.closest('details');
                if (details && !details.open) {
                    // If somehow we got here with a closed panel, open it and retry
                    details.open = true;
                    setTimeout(() => {
                        speakCurrent();
                    }, 100);
                    return;
                }

                const text = element.getAttribute('data-text');
                const lang = element.getAttribute('data-lang');
                const repeats = parseInt(settings[lang]?.repeat) || 1;

                // console.log('Speaking:', { text, lang, repeats, index: State.data.media.currentIndex });

                // Observe this element to pause if it goes out of view
                Services.MediaService.observeCurrentElement(element);

                const display = document.getElementById('media-text-display');
                if (display) {
                    display.innerText = text;
                    display.className = `media-text lang-${lang}`;
                }

                let repeatCount = 0;

                const speakRepeat = () => {
                    if (!State.data.media.isPlaying) return;

                    // Capture the current element and its repeat count
                    const currentElement = element;
                    const currentText = text;
                    const currentLang = lang;
                    const totalRepeats = repeats;
                    let currentRepeat = 0;

                    const speakNextRepeat = () => {
                        if (!State.data.media.isPlaying) return;

                        Services.MediaService.speak(currentText, currentLang,
                            () => {
                                // onStart - add highlight
                                document.querySelectorAll('.active-highlight').forEach(el => {
                                    el.classList.remove('active-highlight');
                                });
                                currentElement.classList.add('active-highlight');

                                const linkId = currentElement.getAttribute('data-link');
                                if (linkId) {
                                    const linkedElement = document.getElementById(linkId);
                                    if (linkedElement) linkedElement.classList.add('active-highlight');
                                }
                            },
                            () => {
                                // onEnd - remove highlight and handle next
                                currentElement.classList.remove('active-highlight');
                                const linkId = currentElement.getAttribute('data-link');
                                if (linkId) {
                                    const linkedElement = document.getElementById(linkId);
                                    if (linkedElement) linkedElement.classList.remove('active-highlight');
                                }

                                currentRepeat++;

                                if (currentRepeat < totalRepeats) {
                                    // More repeats for this element
                                    setTimeout(speakNextRepeat, 100);
                                } else {
                                    // Move to next element after delay
                                    State.data.media.currentIndex++;

                                    // Small delay before next element
                                    setTimeout(() => {
                                        if (State.data.media.isPlaying) {
                                            playNext();
                                        }
                                    }, State.data.media.delay * 1000);
                                }
                            }
                        );
                    };

                    speakNextRepeat();
                };

                speakRepeat();
            };

            playNext();
        },

        updatePlayPauseIcon(isPlaying) {
            const playPauseBtn = document.querySelector('.player-ctrl[onclick="App.togglePlay()"]');
            if (playPauseBtn) {
                playPauseBtn.textContent = isPlaying ? 'pause' : 'play_arrow';
            }
        },

        // In the media.play function, add a check for isPlaying
        media: {
            _isPlaying: false,
            _clickTimer: null,

            // In the media.play function, simplify the notification:
            play: function (element) {
                if (State.data.media.isPlaying) {
                    //   console.log('Playback in progress, stopping before playing clicked element');

                    // Stop the current playback
                    Services.MediaService.stopSequence();

                    // Show simple notification
                    const message = Services.I18n.t('click_stop_before_play', 'Click Stop before clicking an item to play');

                    if (typeof App !== 'undefined' && App.showNotification) {
                        App.showNotification(message, 3000);
                    }

                    // Small delay to ensure cleanup is complete
                    setTimeout(() => {
                        this._executePlay(element);
                    }, 100);

                    return;
                }

                // If not playing, execute immediately
                this._executePlay(element);
            },

            _executePlay: function (element) {
                // Add a disabled attribute to prevent multiple clicks on the same element
                if (element.getAttribute('data-processing') === 'true') {
                    return;
                }

                // Mark this element as being processed
                element.setAttribute('data-processing', 'true');

                // Clear any pending click timer
                if (this._clickTimer) {
                    clearTimeout(this._clickTimer);
                    this._clickTimer = null;
                }

                // Prevent rapid successive clicks
                if (this._isPlaying) {
                    setTimeout(() => {
                        element.removeAttribute('data-processing');
                    }, 500);
                    return;
                }

                this._isPlaying = true;

                // Increment activity counter
                State.data.activityCounts.audioPlays = (State.data.activityCounts.audioPlays || 0) + 1;
                State.save('activityCounts');

                const inDocument = element.closest('.document-content') !== null;

                if (inDocument) {
                    // Determine element type based on clear criteria
                    const isBreakdownElement =
                        element.hasAttribute('data-link') || // Has link to source
                        element.closest('.sent-word-block') !== null || // Inside word breakdown
                        element.classList.contains('sent-word-item') || // Is a word breakdown item
                        element.classList.contains('sent-word-trans') || // Is a word breakdown translation
                        element.classList.contains('matched-word'); // Is a matched word in source

                    // Main sequence elements are those that should trigger seeking
                    const isMainSequence =
                        // Sentence source (has data-uid AND is in sentence-group)
                        (element.hasAttribute('data-uid') && element.closest('.sentence-group') !== null) ||
                        // Word card source
                        element.classList.contains('word-source') ||
                        // Word card translation
                        element.classList.contains('word-trans') ||
                        // Translation in sentence view (has data-uid-trans)
                        (element.hasAttribute('data-uid') && element.getAttribute('data-uid').includes('trans')) ||
                        // Any element in sentence-group with class 'source' or 'trans'
                        (element.closest('.sentence-group') &&
                            (element.classList.contains('source') || element.classList.contains('trans'))) ||
                        // Alphabet grid items
                        element.classList.contains('alphabet-grid-item') ||
                        // Character grid items
                        element.classList.contains('character-grid-item') ||
                        // Alphabet table items
                        element.closest('.alphabet-table-container') !== null ||
                        // Tone rule table examples
                        element.classList.contains('example-word') ||
                        // ALPHABET CONSONANTS - now treated as main sequence
                        element.classList.contains('alphabet-item');

                    if (State.data.media.showWordBreakdown && isBreakdownElement) {
                        // When breakdown is enabled, treat breakdown elements as part of the sequence
                        Services.MediaService.seekToElement(element);

                        this._clickTimer = setTimeout(() => {
                            this._isPlaying = false;
                            element.removeAttribute('data-processing');
                            this._clickTimer = null;
                        }, 1000);
                    } else if (isBreakdownElement) {
                        // For word breakdown elements, just play this single word without seeking
                        const text = element.getAttribute('data-text');
                        const lang = element.getAttribute('data-lang');

                        // If no data-text, try to get text content
                        const textToSpeak = text || element.textContent.trim();

                        // Cancel any ongoing speech
                        window.speechSynthesis.cancel();
                        Services.MediaService.speak(textToSpeak, lang || 'th');

                        // Reset playing flag after a delay
                        this._clickTimer = setTimeout(() => {
                            this._isPlaying = false;
                            element.removeAttribute('data-processing');
                            this._clickTimer = null;
                        }, 500);
                    } else if (isMainSequence) {
                        // Then seek to the clicked element (playback already stopped above)
                        Services.MediaService.seekToElement(element);

                        // Reset playing flag after a delay
                        this._clickTimer = setTimeout(() => {
                            this._isPlaying = false;
                            element.removeAttribute('data-processing');
                            this._clickTimer = null;
                        }, 1000);
                    } else {
                        // Fallback - play directly
                        const text = element.getAttribute('data-text') || element.textContent.trim();
                        const lang = element.getAttribute('data-lang') || 'th';

                        // Cancel any ongoing speech
                        window.speechSynthesis.cancel();
                        Services.MediaService.speak(text, lang);

                        this._clickTimer = setTimeout(() => {
                            this._isPlaying = false;
                            element.removeAttribute('data-processing');
                            this._clickTimer = null;
                        }, 500);
                    }
                } else {
                    // Single playback for flashcards, quizzes, etc.
                    const text = element.getAttribute('data-text');
                    const lang = element.getAttribute('data-lang');

                    // Cancel any ongoing speech
                    window.speechSynthesis.cancel();
                    Services.MediaService.speak(text, lang);

                    // Reset playing flag after a delay
                    this._clickTimer = setTimeout(() => {
                        this._isPlaying = false;
                        element.removeAttribute('data-processing');
                        this._clickTimer = null;
                    }, 500);
                }
            }


        },

        toggleTheme() {
            State.data.theme = State.data.theme === 'light' ? 'dark' : 'light';
            State.save('theme');
            this.applyTheme();
            Router.handle();
        },

        updateMediaParam(key, value, skipMediaBarRefresh = false) {
            State.data.media[key] = parseFloat(value);
            State.save('media');

            // Only refresh the media bar if explicitly requested and not in the middle of slider adjustment
            if (!skipMediaBarRefresh) {
                const mediaBar = document.getElementById('media-player-container');
                if (mediaBar && mediaBar.innerHTML) {
                    this.renderMediaBar(mediaBar);
                }
            }
        },

        updateLanguageConfig(code, key, value, skipMediaBarRefresh = false) {
            State.data.media.languageSettings[code][key] =
                key === 'show' ? !!value : parseInt(value, 10);
            State.save('media');

            // Only refresh if needed and if the media bar exists
            if (!skipMediaBarRefresh) {
                const mediaBar = document.getElementById('media-player-container');
                if (mediaBar && mediaBar.innerHTML) {
                    this.renderMediaBar(mediaBar);
                }
            }

            // Re-render the current view to show/hide translations
            Router.handle();
        },

        updateShowWordBreakdown(show) {
            State.data.media.showWordBreakdown = show;
            State.save('media');

            // Re-render the current document to show/hide word breakdowns
            const currentHash = window.location.hash.slice(1);
            if (currentHash.startsWith('doc/')) {
                Router.handle();
            }

            // Show confirmation
            const message = show ?
                Services.I18n.t('word_breakdown_enabled', 'Word breakdown enabled') :
                Services.I18n.t('word_breakdown_disabled', 'Word breakdown disabled');
            this.showNotification(message);
        },

        quiz: {
            setQuestionLanguage(lang) {
                if (State.data.quiz) {
                    State.data.quiz.questionLang = lang;
                    UI.Quiz.renderQuestion();
                }
            },

            setAnswerLanguage(lang) {
                if (State.data.quiz) {
                    State.data.quiz.answerLang = lang;
                    UI.Quiz.renderQuestion();
                }
            },

            handleAnswer(button, selected, correct) {
                const quiz = State.data.quiz;
                const isCorrect = selected === correct;

                // Increment when answer is submitted (count as one quiz interaction)
                // You might want to track this differently

                // Speak the selected answer
                Services.MediaService.speak(selected, quiz.answerLang);

                button.classList.add(isCorrect ? 'correct' : 'incorrect');

                document.querySelectorAll('.quiz-option-btn').forEach(btn => {
                    btn.disabled = true;
                });

                if (!isCorrect) {
                    document.querySelectorAll('.quiz-option-btn').forEach(btn => {
                        if (btn.dataset.answer === correct) {
                            btn.classList.add('correct');
                        }
                    });
                    quiz.incorrect.push(quiz.items[quiz.currentIndex]);
                } else {
                    quiz.score++;
                }

                setTimeout(() => {
                    quiz.currentIndex++;
                    if (quiz.currentIndex < quiz.items.length) {
                        UI.Quiz.renderQuestion();
                    } else {
                        // Quiz completed
                        State.data.activityCounts.quizzesTaken = (State.data.activityCounts.quizzesTaken || 0) + 1;
                        State.save('activityCounts');

                        this.addActivity('quiz', 'activity_completed_quiz');
                        this.updateStreak();

                        UI.Quiz.renderResults();
                    }
                }, 1500);
            },

            retryIncorrect() {
                const quiz = State.data.quiz;
                if (quiz) {
                    quiz.items = [...quiz.incorrect];
                    quiz.currentIndex = 0;
                    quiz.score = 0;
                    quiz.incorrect = [];
                    UI.Quiz.renderQuestion();
                }
            }
        },

        game: {
            // In the game helpers
            addWord(word) {
                const game = State.data.sentenceGame;
                if (!game || game.showResult) return;

                game.userWords = game.userWords || [];
                game.userWords.push(word);
                UI.Game.renderGame();

                // Speak the added word
                Services.MediaService.speak(word, 'th');
            },

            check() {
                const game = State.data.sentenceGame;
                if (!game) return;

                const sentence = game.sentences[game.currentIndex];
                const userWords = game.userWords || [];
                const correctWords = sentence.words;

                let isCorrect = userWords.length === correctWords.length;
                if (isCorrect) {
                    for (let i = 0; i < userWords.length; i++) {
                        if (userWords[i] !== correctWords[i]) {
                            isCorrect = false;
                            break;
                        }
                    }
                }

                game.showResult = true;
                game.isCorrect = isCorrect;

                UI.Game.renderGame();

                // Speak feedback
                if (isCorrect) {
                    Services.MediaService.speak(sentence.source, 'th');
                } else {
                    Services.MediaService.speak('Try again', State.data.lang);
                }
            },

            showAnswer() {
                const game = State.data.sentenceGame;
                if (!game) return;

                const sentence = game.sentences[game.currentIndex];
                game.userWords = [...sentence.words];
                game.showResult = true;
                game.isCorrect = true;

                UI.Game.renderGame();
                Services.MediaService.speak(sentence.source, 'th');
            },

            removeWord(index) {
                const game = State.data.sentenceGame;
                if (!game || game.showResult) return;

                game.userWords.splice(index, 1);
                UI.Game.renderGame();
            },

            reset() {
                const game = State.data.sentenceGame;
                if (!game) return;

                game.userWords = [];
                game.showResult = false;
                game.isCorrect = false;
                UI.Game.renderGame();
            },

            check() {
                const game = State.data.sentenceGame;
                if (!game) return;

                const sentence = game.sentences[game.currentIndex];
                const userWords = game.userWords || [];
                const correctWords = sentence.words;

                // Compare arrays
                let isCorrect = userWords.length === correctWords.length;
                if (isCorrect) {
                    for (let i = 0; i < userWords.length; i++) {
                        if (userWords[i] !== correctWords[i]) {
                            isCorrect = false;
                            break;
                        }
                    }
                }

                game.showResult = true;
                game.isCorrect = isCorrect;

                UI.Game.renderGame();

                // If correct, speak the sentence
                if (isCorrect) {
                    Services.MediaService.speak(sentence.source, 'th');
                }
            },

            showAnswer() {
                const game = State.data.sentenceGame;
                if (!game) return;

                const sentence = game.sentences[game.currentIndex];
                game.userWords = [...sentence.words];
                game.showResult = true;
                game.isCorrect = true;

                UI.Game.renderGame();
                Services.MediaService.speak(sentence.source, 'th');
            },

            next() {
                const game = State.data.sentenceGame;
                if (!game) return;

                if (game.currentIndex < game.sentences.length - 1) {
                    game.currentIndex++;
                    game.currentSentence = game.sentences[game.currentIndex];
                    game.userWords = [];
                    game.showResult = false;
                    game.isCorrect = false;
                    UI.Game.renderGame();
                } else {
                    UI.Game.renderComplete();
                }
            },

            exit() {
                const game = State.data.sentenceGame;
                if (game?.documentId) {
                    Router.go(`doc/${game.documentId}`);
                } else {
                    Router.go('library');
                }
            },

            restart() {
                const game = State.data.sentenceGame;
                if (game) {
                    game.currentIndex = 0;
                    game.currentSentence = game.sentences[0];
                    game.userWords = [];
                    game.showResult = false;
                    game.isCorrect = false;
                    UI.Game.renderGame();
                }
            }
        },

        showFlashcardAnswer() {
            if (State.data.flashcards) {
                State.data.flashcards.showAnswer = true;
                UI.Flashcard.renderCard();
            }
        },

        rateFlashcard(quality) {
            if (State.data.flashcards) {
                const cards = State.data.flashcards;

                State.data.activityCounts.flashcardsReviewed = (State.data.activityCounts.flashcardsReviewed || 0) + 1;
                State.save('activityCounts');

                // Update streak (studying counts as activity)
                this.updateStreak();

                if (cards.currentIndex < cards.currentDeck.length - 1) {
                    cards.currentIndex++;
                    cards.showAnswer = false;
                    UI.Flashcard.renderCard();
                } else {
                    const container = UI.getContainer();
                    container.innerHTML = `
                        <div class="flashcard-complete">
                            <span class="material-icons">celebration</span>
                            <h2>${Services.I18n.t('session_complete', 'Session Complete!')}</h2>
                            <p>${Services.I18n.t('cards_reviewed', 'You\'ve reviewed all cards.')}</p>
                            <div class="flashcard-complete-buttons">
                                <button class="btn-activity" onclick="location.hash='doc/${cards.documentId}'">
                                    ${Services.I18n.t('back_to_document', 'Back to Document')}
                                </button>
                                <button class="btn-activity" onclick="location.hash='library'">
                                    ${Services.I18n.t('back_to_library', 'Library')}
                                </button>
                            </div>
                        </div>
                    `;
                }
            }
        },

        exitFlashcards() {
            if (State.data.flashcards?.documentId) {
                Router.go(`doc/${State.data.flashcards.documentId}`);
            } else {
                Router.go('library');
            }
        },

        showGrammarSheet(grammarId) {
            State.data.activityCounts.grammarSheetsOpened = (State.data.activityCounts.grammarSheetsOpened || 0) + 1;
            State.save('activityCounts');

            this.addActivity('menu_book', 'activity_viewed_grammar');

            // Parse the grammar ID: grammar-sectionIdx-blockIdx
            const parts = grammarId.split('-');
            if (parts[0] !== 'grammar') return;

            const sectionIdx = parseInt(parts[1]);
            const blockIdx = parseInt(parts[2]);

            try {
                const section = State.data.currentDocument.sections[sectionIdx];
                const block = section.content[blockIdx];

                if (!block || !block.grammar) {
                    console.warn('No grammar data found');
                    return;
                }

                const grammar = block.grammar;

                // IMPORTANT: We DO NOT use any sentences from the block
                // Only use examples explicitly defined in the grammar object
                const examples = [];
                if (grammar.examples && Array.isArray(grammar.examples)) {
                    grammar.examples.forEach(ex => {
                        if (ex.sentenceSource) {
                            examples.push({
                                source: ex.sentenceSource,
                                translations: ex.translations || {} // Pass the FULL translations object
                            });
                        }
                    });
                }

                //   console.log('Grammar examples being passed:', examples);

                UI.GrammarSheet.render({
                    pattern: grammar.pattern,
                    note: grammar.note || grammar.explanation,
                    examples: examples, // ONLY use examples from the grammar object
                    source: null, // No current sentence - we don't want to show a sentence from the block
                    translations: {} // No current translations
                });

            } catch (error) {
                console.error('Error showing grammar sheet:', error);
            }
        },

        findSentenceByUid(uid) {
            const parts = uid.split('-');
            if (parts[0] !== 's') return null;

            try {
                const section = State.data.currentDocument.sections[parseInt(parts[1])];
                const block = section.content[parseInt(parts[2])];
                return block.sentences[parseInt(parts[3])];
            } catch {
                return null;
            }
        },

        findRelatedExamples(pattern) {
            if (!pattern || !State.data.currentDocument) return [];

            const examples = [];
            const seen = new Set(); // Avoid duplicates

            State.data.currentDocument.sections.forEach(section => {
                section.content.forEach(block => {
                    if (block.type === 'paragraph' && block.sentences) {
                        block.sentences.forEach(s => {
                            // Simple pattern matching - check if sentence contains key parts of pattern
                            const patternWords = pattern.replace(/[+]/g, '').trim().split(/\s+/);
                            const matchesPattern = patternWords.some(word =>
                                word.length > 1 && s.source.includes(word)
                            );

                            if (matchesPattern && !seen.has(s.source)) {
                                seen.add(s.source);
                                examples.push({
                                    source: s.source,
                                    translation: s.translations[State.data.lang] ||
                                        s.translations.en || ''
                                });
                            }
                        });
                    }
                });
            });

            return examples.slice(0, 5);
        },

        closeGrammarSheet() {
            const sheet = document.querySelector('.bottom-sheet');
            const backdrop = document.querySelector('.sheet-backdrop');

            if (sheet) sheet.classList.remove('open');
            if (backdrop) backdrop.classList.remove('visible');

            setTimeout(() => {
                const anchor = document.getElementById('grammar-sheet-anchor');
                if (anchor) anchor.innerHTML = '';
            }, 300);
        },

        testSpeech() {
            const testText = 'ทดสอบระบบเสียง';
            Services.MediaService.speak(testText, 'th');
            alert(Services.I18n.t('testing_msg', 'Testing Thai Speech...'));
        },

        toggleMenu(type) {
            const anchor = document.getElementById('overlay-anchor');
            if (!anchor) return;

            if (anchor.innerHTML) {
                anchor.innerHTML = '';
                return;
            }

            const t = Services.I18n.t;
            let options = {};

            if (type === 'lang') {
                options = {
                    en: { name: t('language_en', 'English'), flag: '🇬🇧' },
                    fa: { name: t('language_fa', 'فارسی'), flag: '🇮🇷' },
                    th: { name: t('language_th', 'ไทย'), flag: '🇹🇭' }
                };

                let html = '<div class="overlay-menu card lang-menu">';
                Object.entries(options).forEach(([key, value]) => {
                    html += `
                <button onclick="App.updateSetting('lang','${key}')">
                    <span class="lang-flag">${value.flag}</span>
                    <span class="lang-name">${value.name}</span>
                </button>
            `;
                });
                html += '</div>';
                anchor.innerHTML = html;
            } else {
                // Font options with 'font-serif' (Noto Serif Thai) as the first/default option
                options = {
                    'font-serif': t('font_serif', 'Classic Serif (Noto Serif Thai)'),
                    'font-standard': t('font_standard', 'Standard Sans (Noto Sans Thai)'),
                    'font-thai-modern': t('font_thai', 'Modern Thai (Kanit)'),
                    'font-fa-vazir': t('font_farsi', 'Farsi Script (Vazirmatn)')
                };

                let html = '<div class="overlay-menu card">';
                Object.entries(options).forEach(([key, value]) => {
                    html += `<button onclick="App.updateSetting('font','${key}')">${value}</button>`;
                });
                html += '</div>';
                anchor.innerHTML = html;
            }
        },

        getStreak() {
            return State.data.streak?.current || 0;
        },

        getDocumentsOpened() {
            return State.data.activityCounts?.documentsOpened || 0;
        },

        getFlashcardsReviewed() {
            return State.data.activityCounts?.flashcardsReviewed || 0;
        },

        getQuizzesTaken() {
            return State.data.activityCounts?.quizzesTaken || 0;
        },

        getGamesPlayed() {
            return State.data.activityCounts?.gamesPlayed || 0;
        },

        getDueToday() {
            return State.data.srs?.stats?.dueToday || 0;
        },

        getReviewProgress() {
            const due = this.getDueToday();
            const total = State.data.srs?.stats?.totalCards || 1;
            return Math.min(100, Math.round((due / total) * 100));
        },

        renderStreakCalendar() {
            // Generate last 7 days
            let html = '';
            const today = new Date();
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                const isActive = this.isDateInStreak(dateStr);
                html += `<div class="streak-day ${isActive ? 'active' : ''}">${date.getDate()}</div>`;
            }
            return html;
        },

        isDateInStreak(dateStr) {
            // Simple check - you can enhance this based on your streak tracking
            const lastDate = State.data.streak?.lastStudyDate;
            return lastDate === dateStr;
        },

        renderActivityTimeline(t) {
            // Get last 5 activities from history
            const activities = State.data.activityHistory?.slice(-5) || [];
            if (activities.length === 0) {
                return `<div class="activity-item">${t('no_recent_activity', 'No recent activity')}</div>`;
            }

            return activities.map(act => `
        <div class="activity-item">
            <div class="activity-icon">
                <span class="material-icons">${act.icon}</span>
            </div>
            <div class="activity-details">
                <div class="activity-text">${act.text}</div>
                <div class="activity-time">${act.time}</div>
            </div>
        </div>
    `).join('');
        },

        renderAchievements(t) {
            const achievements = [
                { id: 'firstDocument', icon: 'menu_book', label: t('achievement_first_document', 'First Document') },
                { id: 'firstFlashcard', icon: 'style', label: t('achievement_first_flashcard', 'First Flashcard') },
                { id: 'firstQuiz', icon: 'quiz', label: t('achievement_first_quiz', 'First Quiz') },
                { id: 'firstGame', icon: 'dashboard', label: t('achievement_first_game', 'First Game') },
                { id: 'studiedThreeDays', icon: 'local_fire_department', label: t('achievement_streak_3', '3-Day Streak') },
                { id: 'reviewedFiftyCards', icon: 'star', label: t('achievement_cards_50', '50 Cards Reviewed') }
            ];

            return achievements.map(ach => {
                const unlocked = State.data.achievements?.[ach.id] || false;
                return `
            <div class="achievement-badge ${unlocked ? 'unlocked' : ''}">
                <span class="material-icons">${ach.icon}</span>
                <div class="achievement-label">${ach.label}</div>
            </div>
        `;
            }).join('');
        },

        getMilestoneProgress() {
            const docs = this.getDocumentsOpened();
            if (docs < 5) {
                return (docs / 5) * 100;
            }
            const cards = this.getFlashcardsReviewed();
            if (cards < 50) {
                return (cards / 50) * 100;
            }
            return 100;
        },

        getNextMilestoneText(t) {
            const docs = this.getDocumentsOpened();
            if (docs < 5) {
                const remaining = 5 - docs;
                return t('milestone_study_docs', 'Study {remaining} more document{plural} to reach 5 total')
                    .replace('{remaining}', remaining)
                    .replace('{plural}', remaining === 1 ? '' : 's');
            }
            const cards = this.getFlashcardsReviewed();
            if (cards < 50) {
                const remaining = 50 - cards;
                return t('milestone_review_cards', 'Review {remaining} more card{plural} to reach 50 total')
                    .replace('{remaining}', remaining)
                    .replace('{plural}', remaining === 1 ? '' : 's');
            }
            return t('milestone_completed', '🎉 You\'ve completed all milestones! Keep up the great work!');
        },

        // Method to add activity to history
        addActivity(icon, textKey, textParams = {}) {
            const t = Services.I18n.t;
            let text = textKey;

            // If it's a translation key, translate it
            if (typeof textKey === 'string' && textKey.startsWith('activity_')) {
                text = t(textKey, textKey);
                // Replace placeholders
                Object.keys(textParams).forEach(key => {
                    text = text.replace(`{${key}}`, textParams[key]);
                });
            }

            const history = State.data.activityHistory || [];
            history.push({
                icon: icon,
                text: text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });

            // Keep only last 20 activities
            if (history.length > 20) {
                history.shift();
            }

            State.data.activityHistory = history;
            State.save('activityHistory');
        },

        // Method to update streak
        updateStreak() {
            const today = new Date().toISOString().split('T')[0];
            const streak = State.data.streak;

            if (streak.lastStudyDate === today) {
                // Already studied today
                return;
            }

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (streak.lastStudyDate === yesterdayStr) {
                // Consecutive day
                streak.current++;
            } else {
                // Streak broken
                streak.current = 1;
            }

            if (streak.current > streak.longest) {
                streak.longest = streak.current;
            }

            streak.lastStudyDate = today;
            State.save('streak');

            // Check for streak achievements
            this.checkAchievements();
        },

        // Method to check and unlock achievements
        checkAchievements() {
            const ach = State.data.achievements;
            const t = Services.I18n.t; // Add this line to get the translation function

            if (this.getDocumentsOpened() >= 1 && !ach.firstDocument) {
                ach.firstDocument = true;
                this.addActivity('emoji_events', 'activity_achievement_unlocked', {
                    name: t('achievement_first_document', 'First Document')
                });
            }

            if (this.getFlashcardsReviewed() >= 1 && !ach.firstFlashcard) {
                ach.firstFlashcard = true;
                this.addActivity('emoji_events', 'activity_achievement_unlocked', {
                    name: t('achievement_first_flashcard', 'First Flashcard')
                });
            }

            if (this.getQuizzesTaken() >= 1 && !ach.firstQuiz) {
                ach.firstQuiz = true;
                this.addActivity('emoji_events', 'activity_achievement_unlocked', {
                    name: t('achievement_first_quiz', 'First Quiz')
                });
            }

            if (this.getGamesPlayed() >= 1 && !ach.firstGame) {
                ach.firstGame = true;
                this.addActivity('emoji_events', 'activity_achievement_unlocked', {
                    name: t('achievement_first_game', 'First Game')
                });
            }

            if (State.data.streak?.current >= 3 && !ach.studiedThreeDays) {
                ach.studiedThreeDays = true;
                this.addActivity('emoji_events', 'activity_achievement_unlocked', {
                    name: t('achievement_streak_3', '3-Day Streak')
                });
            }

            if (this.getFlashcardsReviewed() >= 50 && !ach.reviewedFiftyCards) {
                ach.reviewedFiftyCards = true;
                this.addActivity('emoji_events', 'activity_achievement_unlocked', {
                    name: t('achievement_cards_50', '50 Cards Reviewed')
                });
            }

            State.save('achievements');
        },

        resetProgressData() {
            const t = Services.I18n.t;
            if (confirm(t('confirm_reset_progress', 'Are you sure? This will reset all your progress data.'))) {
                // Reset to defaults
                State.data.activityCounts = {
                    documentsOpened: 0,
                    flashcardsReviewed: 0,
                    quizzesTaken: 0,
                    gamesPlayed: 0,
                    grammarSheetsOpened: 0,
                    audioPlays: 0
                };

                State.data.streak = {
                    current: 0,
                    longest: 0,
                    lastStudyDate: ''
                };

                State.data.achievements = {
                    firstDocument: false,
                    firstFlashcard: false,
                    firstQuiz: false,
                    firstGame: false,
                    studiedThreeDays: false,
                    reviewedFiftyCards: false
                };

                State.data.activityHistory = [];

                // Save all
                State.save('activityCounts');
                State.save('streak');
                State.save('achievements');
                State.save('activityHistory');

                // Refresh the help page if we're on it
                if (window.location.hash.includes('help')) {
                    Router.handle();
                }

                this.showNotification(t('progress_data_reset', 'Progress data reset'));
            }
        },

        async updateSetting(type, value) {
            if (type === 'lang') {
                State.data.lang = value;
                State.save('lang');
                await Services.I18n.loadTranslations();
            } else {
                State.data.font = value;
                State.save('font');
            }
            this.applyTheme();

            const anchor = document.getElementById('overlay-anchor');
            if (anchor) anchor.innerHTML = '';

            Router.handle();
        }

    };

})();

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    window.App = App;
    App.init();
});