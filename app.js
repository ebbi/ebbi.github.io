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
                languageSettings: (() => {
                    const defaults = {
                        th: { show: true, repeat: 1 },
                        en: { show: true, repeat: 1 },
                        fa: { show: true, repeat: 1 }
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
                }
            },
            flashcards: null,
            quiz: null,
            sentenceGame: null,
            grammarSheet: { isOpen: false, content: null }
        },

        // MOVE DEFAULTS HERE - at the same level as data, not inside data
        defaults: {
            media: {
                speed: 1,
                delay: 1,
                pitch: 1,
                voice: '',
                languageSettings: {
                    th: { show: true, repeat: 1 },
                    en: { show: true, repeat: 1 },
                    fa: { show: true, repeat: 1 }
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
            if (key === 'media') {
                localStorage.setItem('localStorageSpeed', this.data.media.speed);
                localStorage.setItem('localStorageDelay', this.data.media.delay);
                localStorage.setItem('localStoragePitch', this.data.media.pitch);
                localStorage.setItem('localStorageVoice', this.data.media.voice);
                localStorage.setItem('localStorageLangMap',
                    JSON.stringify(this.data.media.languageSettings));
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

                // Section-level activity settings (override document)
                this.activity = data.activity || { words: false, sentences: false };

                // Process content items
                this.content = (data.content || []).map(item => {
                    if (item.type === 'words') {
                        return new Models.WordsContent(item, document.vocabulary, currentLang);
                    } else if (item.type === 'paragraph') {
                        return new Models.ParagraphContent(item, document.vocabulary, currentLang);
                    }
                    return item;
                });
            }

            // Check if word activities are enabled for this section
            hasWordActivities() {
                // Section activity overrides document
                if (this.activity.words !== undefined) {
                    return this.activity.words;
                }
                // Fall back to document level
                return this.document.activity.words || false;
            }

            // Check if sentence activities are enabled for this section
            hasSentenceActivities() {
                // Section activity overrides document
                if (this.activity.sentences !== undefined) {
                    return this.activity.sentences;
                }
                // Fall back to document level
                return this.document.activity.sentences || false;
            }

            // Get word items for this section only
            getWordItems() {
                const words = [];
                this.content.forEach(block => {
                    if (block.type === 'words') {
                        words.push(...block.words);
                    } else if (block.type === 'paragraph') {
                        block.sentences.forEach(sentence => {
                            words.push(...sentence.words);
                        });
                    }
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

            // Get sentence items for this section only
            getSentenceItems() {
                const sentences = [];
                this.content.forEach(block => {
                    if (block.type === 'paragraph') {
                        sentences.push(...block.sentences);
                    }
                });
                return sentences;
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
                this.grammar = data.grammar; // Store the grammar object
                this.activity = data.activity;

                this.sentences = (data.sentences || []).map(s => ({
                    source: s.source,
                    translations: s.translations || {},
                    grammar: s.grammar,
                    words: vocabulary.resolveWordIds(s.wordIds || [])
                }));
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

            async loadDocument(documentId) {
                const filePath = this.findDocumentPath(documentId);
                const response = await fetch(filePath);
                const data = await response.json();
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

        // Media playback
        MediaService: {
            cachedVoices: [],
            scrollTimeout: null,
            currentRowId: null,
            scrolledRows: new Set(),

            init() {
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

            // Get elements grouped by visual row
            getElementsByRow() {
                const elements = Array.from(document.querySelectorAll('.audio-element'));
                const rows = new Map();

                elements.forEach((element, index) => {
                    // For word cards, group by the parent words-grid
                    let rowElement = element.closest('.words-grid');

                    // If not in a words-grid, use normal grouping
                    if (!rowElement) {
                        rowElement = element.closest('.sentence-group') ||
                            element.closest('.word-card') ||
                            element.closest('.flashcard-front') ||
                            element.closest('.quiz-question-card');
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
            // Add these methods to Services.MediaService:

            enableScrollListeners() {
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
                /*
                console.log('Current state before stop:', {
                    isPlaying: State.data.media.isPlaying,
                    currentIndex: State.data.media.currentIndex,
                    totalElements: document.querySelectorAll('.audio-element').length
                });
*/
                State.data.media.isPlaying = false;
                State.data.media.currentIndex = 0;

                // Clear tracking
                if (State.data.scrolledRows) {
                    State.data.scrolledRows.clear();
                }
                State.data.currentRowId = null;

                window.speechSynthesis.cancel();

                // Remove all highlights
                document.querySelectorAll('.active-highlight').forEach(el => {
                    el.classList.remove('active-highlight');
                });

                // Disconnect observer
                if (Services.MediaService.observer) {
                    Services.MediaService.observer.disconnect();
                }

                // Disable scroll listeners when playback stops
                this.disableScrollListeners();

                App.showMediaBar();

                /*
                console.log('After stop:', {
                    isPlaying: State.data.media.isPlaying,
                    currentIndex: State.data.media.currentIndex
                });
                */

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

            seekToElement(element) {
                // Find the index directly from all audio elements - simpler and more reliable
                const allElements = Array.from(document.querySelectorAll('.audio-element'));
                const targetIndex = allElements.indexOf(element);

                if (targetIndex !== -1) {
                    State.data.media.currentIndex = targetIndex;

                    // Clear tracking
                    if (State.data.scrolledRows) {
                        State.data.scrolledRows.clear();
                    }
                    State.data.currentRowId = null;

                    if (!State.data.media.isPlaying) {
                        State.data.media.isPlaying = true;
                        App.playSequence();
                    } else {
                        window.speechSynthesis.cancel();
                        App.playSequence();
                    }
                }
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

                let html = '<div class="library-container">';

                manifest.learningObjects.forEach((obj, idx) => {
                    const title = obj.title[lang] || obj.title.en;

                    html += `
                        <details class="library-section" ${idx === 0 ? 'open' : ''}>
                            <summary class="library-summary">
                                <span class="material-icons">expand_more</span>
                                <span class="library-title">${UI.escapeHtml(title)}</span>
                                <span class="library-count">(${obj.documents.length})</span>
                            </summary>
                            <div class="library-docs">
                    `;

                    obj.documents.forEach(doc => {
                        const docTitle = doc.title[lang] || doc.title.en;
                        html += `
                            <button class="doc-btn" onclick="App.router.go('doc/${doc.id}')">
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

                    let html = `<div class="document-content">`;

                    const documentActivities = this.getDocumentActivities(doc);
                    // console.log('Document activities:', documentActivities);

                    html += `<div class="document-controls-wrapper">`;

                    documentActivities.forEach(activity => {
                        const isWord = activity.includes('Word');
                        const isGame = activity === 'buildSentence';

                        if (isGame) {
                            html += `
                                <button class="btn-sentence-game" onclick="App.startSentenceGame('${doc.id}', null)">
                                    <span class="material-icons">dashboard</span>
                                    <span>${t('sentences', 'Sentences')}</span>
                                </button>
                            `;
                        } else if (activity.startsWith('flashcard')) {
                            const type = isWord ? 'word' : 'sentence';
                            html += `
                                <button class="btn-flashcard" onclick="App.startFlashcards('${doc.id}', null, '${type}')">
                                    <span class="material-icons">style</span>
                                    <span>${isWord ? t('words', 'Words') : t('sentences', 'Sentences')}</span>
                                </button>
                            `;
                        } else if (activity.startsWith('multipleChoice')) {
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
                        html += `
                            <details class="section-details" open>
                                <summary>
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
            /*
                        getDocumentActivities(doc) {
                            const activities = [];
                            const settings = doc.activitySettings;
            
                            if (settings.inherit === true) {
                                const wordTypes = settings.words?.types || [];
                                const sentenceTypes = settings.sentences?.types || [];
                                return [...new Set([...wordTypes, ...sentenceTypes])];
                            }
            
                            if (settings.words?.types) {
                                activities.push(...settings.words.types);
                            }
                            if (settings.sentences?.types) {
                                activities.push(...settings.sentences.types);
                            }
            
                            return [...new Set(activities)];
                        },
            */
            // Replace both getDocumentActivities methods with this one:
            getDocumentActivities(doc) {
                const activities = [];

                // Check document-level activity flags (simplified model)
                if (doc.activity?.words) {
                    activities.push('multipleChoiceWord', 'flashcardWord');
                }
                if (doc.activity?.sentences) {
                    activities.push('multipleChoiceSentence', 'flashcardSentence', 'buildSentence');
                }

                // If no activity flags, fall back to activitySettings (legacy)
                if (activities.length === 0 && doc.activitySettings) {
                    const settings = doc.activitySettings;
                    if (settings.inherit === true) {
                        const wordTypes = settings.words?.types || [];
                        const sentenceTypes = settings.sentences?.types || [];
                        return [...new Set([...wordTypes, ...sentenceTypes])];
                    }
                    if (settings.words?.types) {
                        activities.push(...settings.words.types);
                    }
                    if (settings.sentences?.types) {
                        activities.push(...settings.sentences.types);
                    }
                }

                return [...new Set(activities)];
            },

            renderSectionControls(docId, sectionIdx, section) {
                const t = Services.I18n.t;
                const activityTypes = section.getActivityTypes();

                // console.log('Section activity types:', activityTypes);

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

                    if (State.data.media.languageSettings.th?.show && sentence.words.length) {
                        html += '<div class="sent-word-block">';
                        sentence.words.forEach((word, wordIdx) => {
                            html += `
                                <div id="${uid}-card-${wordIdx}" class="sent-word-item audio-element"
                                     data-text="${UI.escapeHtml(word.word)}"
                                     data-lang="th"
                                     data-link="source-${uid}-w-${wordIdx}"
                                     onclick="App.media.play(this)">
                                    <div class="sent-word-source">${UI.escapeHtml(word.word)}</div>
                                    ${Object.entries(State.data.media.languageSettings)
                                    .filter(([code]) => code !== 'th')
                                    .map(([code, config]) => config.show && word.translations[code] ? `
                                            <div class="sent-word-trans lang-${code}" lang="${code}" dir="${code === 'fa' ? 'rtl' : 'ltr'}">
                                                ${UI.escapeHtml(word.translations[code])}
                                            </div>
                                        ` : '').join('')}
                                </div>
                            `;
                        });
                        html += '</div>';
                    }

                    Object.entries(State.data.media.languageSettings).forEach(([code, config]) => {
                        if (code !== 'th' && config.show && sentence.translations[code]) {
                            const dir = code === 'fa' ? 'rtl' : 'ltr';
                            html += `
                                <div class="stack-item trans lang-${code} audio-element"
                                     lang="${code}" dir="${dir}"
                                     data-text="${UI.escapeHtml(sentence.translations[code])}"
                                     data-lang="${code}"
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

                words.forEach((word, i) => {
                    const start = text.indexOf(word.word, cursor);
                    if (start === -1) return;

                    if (start > cursor) {
                        html += UI.escapeHtml(text.slice(cursor, start));
                    }

                    html += `<span id="source-${uid}-w-${i}" class="word-span"
                                   data-link="${uid}-card-${i}"
                                   lang="th" dir="ltr">${UI.escapeHtml(word.word)}</span>`;
                    cursor = start + word.word.length;
                });

                if (cursor < text.length) {
                    html += UI.escapeHtml(text.slice(cursor));
                }

                return html;
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

                State.data.quiz = {
                    items: items.sort(() => Math.random() - 0.5),
                    currentIndex: 0,
                    score: 0,
                    incorrect: [],
                    activityType: activityType,
                    documentId: docId,
                    sectionIndex: sectionIdx,
                    questionLang: 'th',
                    answerLang: 'en'
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

            renderQuestion() {
                const container = UI.getContainer();
                const quiz = State.data.quiz;
                if (!quiz || !quiz.items || quiz.items.length === 0) return;

                const item = quiz.items[quiz.currentIndex];
                const t = Services.I18n.t;

                const availableLangs = Object.keys(State.data.media.languageSettings)
                    .filter(code => code !== 'th' && State.data.media.languageSettings[code].show);

                const answerLang = quiz.answerLang || availableLangs[0] || 'en';
                const correctAnswer = item.translations[answerLang];

                const otherAnswers = quiz.items
                    .filter(i => i.id !== item.id)
                    .map(i => i.translations[answerLang])
                    .filter(a => a && a !== correctAnswer);

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
                    <select onchange="App.quiz.setQuestionLanguage(this.value)">
                        ${['th', ...availableLangs].map(code => `
                            <option value="${code}" ${code === quiz.questionLang ? 'selected' : ''}>
                                ${code.toUpperCase()}
                            </option>
                        `).join('')}
                    </select>
                    <span class="material-icons">arrow_forward</span>
                    <select onchange="App.quiz.setAnswerLanguage(this.value)">
                        ${availableLangs.map(code => `
                            <option value="${code}" ${code === quiz.answerLang ? 'selected' : ''}>
                                ${code.toUpperCase()}
                            </option>
                        `).join('')}
                    </select>
                </div>
                
                <div class="quiz-score">
                    ${t('score', 'Score')}: ${quiz.score}
                </div>
            </div>

            <div class="quiz-question-card">
                <span class="material-icons audio-preview-icon"
                      onclick="App.media.play(this); event.stopPropagation();"
                      data-text="${UI.escapeHtml(item.question)}"
                      data-lang="th">
                    volume_up
                </span>
                <div class="quiz-question-text" lang="th" 
                     onclick="App.media.play(this)"
                     data-text="${UI.escapeHtml(item.question)}"
                     data-lang="th">
                    ${UI.escapeHtml(item.question)}
                </div>
            </div>

            <div class="quiz-options-grid">
                ${options.map(option => `
                    <button class="quiz-option-btn" 
                            onclick="App.quiz.handleAnswer(this, '${UI.escapeHtml(option)}', '${UI.escapeHtml(correctAnswer)}')"
                            data-answer="${UI.escapeHtml(option)}">
                        <span class="material-icons audio-preview-icon"
                              onclick="event.stopPropagation(); App.media.play(this)"
                              data-text="${UI.escapeHtml(option)}"
                              data-lang="${answerLang}">
                            volume_up
                        </span>
                        <span lang="${answerLang}" dir="${answerLang === 'fa' ? 'rtl' : 'ltr'}"
                              onclick="event.stopPropagation(); App.media.play(this)"
                              data-text="${UI.escapeHtml(option)}"
                              data-lang="${answerLang}">
                            ${UI.escapeHtml(option)}
                        </span>
                    </button>
                `).join('')}
            </div>
        </div>
    `;

                // Auto-play the question
                setTimeout(() => {
                    Services.MediaService.speak(item.question, 'th');
                }, 100);
            },

            renderResults() {
                const container = UI.getContainer();
                const quiz = State.data.quiz;
                const t = Services.I18n.t;

                container.innerHTML = `
                    <div class="quiz-container">
                        <h2>${t('review', 'Review')}</h2>
                        <div class="card">
                            <h3>${t('score', 'Score')}: ${quiz.score} / ${quiz.items.length}</h3>
                        </div>
                        
                        ${quiz.incorrect.length > 0 ? `
                            <div class="review-list">
                                <h4>${t('incorrect_answers', 'Incorrect Answers')}</h4>
                                ${quiz.incorrect.map(item => `
                                    <div class="card review-item">
                                        <strong lang="th">${UI.escapeHtml(item.question)}</strong>
                                        <small>${UI.escapeHtml(item.translations[quiz.answerLang || 'en'])}</small>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                        
                        <div class="quiz-footer-btns">
                            <button class="btn-activity" onclick="location.hash='doc/${quiz.documentId}'">
                                ${t('finish', 'Finish')}
                            </button>
                            ${quiz.incorrect.length > 0 ? `
                                <button class="btn-activity" onclick="App.quiz.retryIncorrect()">
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

            // In UI.Flashcard.getFlashcardItems method:
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
                    } else {
                        return section.getSentenceItems().map(sentence => ({
                            type: 'sentence',
                            id: `sent-${sentence.source}`,
                            front: sentence.source,
                            back: sentence.translations,
                            words: sentence.words
                        }));
                    }
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
                    } else {
                        return doc.getAllSentenceItems().map(sentence => ({
                            type: 'sentence',
                            id: `sent-${sentence.source}`,
                            front: sentence.source,
                            back: sentence.translations,
                            words: sentence.words
                        }));
                    }
                }
            },

            renderCard() {
                const container = UI.getContainer();
                const cards = State.data.flashcards;
                if (!cards || !cards.currentDeck || cards.currentDeck.length === 0) return;

                const card = cards.currentDeck[cards.currentIndex];
                const t = Services.I18n.t;

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
                <div class="flashcard-front" onclick="App.media.play(this)"
                     data-text="${UI.escapeHtml(card.front)}" data-lang="th">
                    <div class="flashcard-content" lang="th">${UI.escapeHtml(card.front)}</div>
                    <span class="material-icons audio-icon">volume_up</span>
                </div>
                
                <div class="flashcard-back">
                    <div class="flashcard-translations">
    `;

                Object.entries(State.data.media.languageSettings).forEach(([code, config]) => {
                    if (code !== 'th' && config.show && card.back[code]) {
                        const dir = code === 'fa' ? 'rtl' : 'ltr';
                        html += `
                <div class="flashcard-translation-item" lang="${code}" dir="${dir}"
                     onclick="App.media.play(this)"
                     data-text="${UI.escapeHtml(card.back[code])}" data-lang="${code}">
                    <span class="translation-lang">${code.toUpperCase()}:</span>
                    <span class="translation-text">${UI.escapeHtml(card.back[code])}</span>
                    <span class="material-icons audio-icon-small">volume_up</span>
                </div>
            `;
                    }
                });

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

                // Auto-play the front of the card
                setTimeout(() => {
                    Services.MediaService.speak(card.front, 'th');
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
                            <p>${t('voice_note', 'Note: Voice quality depends on your device\'s text-to-speech engine. For best results, install Thai voice data in your device settings.')}</p>
                        </div>

                        <button class="btn-activity" onclick="App.testSpeech()">
                            <span class="material-icons">volume_up</span>
                            ${t('test_speech', 'Test Thai Speech')}
                        </button>
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

                <!-- Device-Specific Setup -->
                <details class="help-details">
                    <summary>
                        <span class="material-icons">phonelink_setup</span>
                        ${t('device_setup', 'Device-Specific Setup')}
                    </summary>
                    <div class="help-content">
                        <h4>${t('android_title', 'Android')}</h4>
                        <ol>
                            <li>${t('android_1', 'Install Google Text-to-Speech from Play Store')}</li>
                            <li>${t('android_2', 'Go to Settings > Language & Input > Text-to-Speech output')}</li>
                            <li>${t('android_3', 'Select Google Text-to-Speech as preferred engine')}</li>
                            <li>${t('android_4', 'Click settings icon next to Google Text-to-Speech')}</li>
                            <li>${t('android_5', 'Install Thai voice data')}</li>
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

                // In UI.Settings.render method, add the button after the table but before closing the overlay div:

                anchor.innerHTML = `
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
                        
                        <!-- Reset to Defaults Button -->
                        <div style="display: flex; justify-content: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--border);">
                            <button class="btn-activity" onclick="App.resetSettingsToDefaults()" style="background: var(--text-secondary);">
                                <span class="material-icons">restore</span>
                                ${t('reset_defaults', 'Reset to Defaults')}
                            </button>
                        </div>
                    </div>
                `;

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

                // Format current sentence
                const currentSentenceHtml = content.source ? `
            <div class="current-sentence">
                <div class="pattern-title">${t('in_this_sentence', 'In this sentence')}</div>
                <div class="pattern-example" onclick="App.media.play(this)"
                     data-text="${UI.escapeHtml(content.source)}" data-lang="th">
                    <span class="material-icons audio-icon-small">volume_up</span>
                    <span class="example-thai" lang="th">${UI.escapeHtml(content.source)}</span>
                    ${content.translation ? `
                        <span class="example-en" lang="${currentLang}" dir="${dir}">
                            ${UI.escapeHtml(content.translation)}
                        </span>
                    ` : ''}
                </div>
            </div>
        ` : '';

                // Format examples
                const examplesHtml = content.examples && content.examples.length > 0 ? `
            <div class="more-examples">
                <div class="pattern-title">${t('more_examples', 'More examples')}</div>
                ${content.examples.map(ex => `
                    <div class="pattern-example" onclick="App.media.play(this)"
                         data-text="${UI.escapeHtml(ex.source)}" data-lang="th">
                        <span class="material-icons audio-icon-small">volume_up</span>
                        <span class="example-thai" lang="th">${UI.escapeHtml(ex.source)}</span>
                        ${ex.translation ? `
                            <span class="example-en" lang="${currentLang}" dir="${dir}">
                                ${UI.escapeHtml(ex.translation)}
                            </span>
                        ` : ''}
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

        async init() {
            this.renderLayout();
            await Services.I18n.loadTranslations();
            await Services.DataService.loadManifest();
            this.applyTheme();
            Router.init();
            Services.MediaService.init();

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

                // Don't pause during auto-scrolling
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

        startFlashcards(docId, sectionIdx, type) {
            Router.go(`flashcard/${docId}/${sectionIdx}/${type}`);
        },

        startSentenceGame(docId, sectionIdx) {
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

        togglePlay() {
            State.data.media.isPlaying = !State.data.media.isPlaying;
            if (State.data.media.isPlaying) {
                this.playSequence(); // This calls App.playSequence, not Services.MediaService.playSequence
            } else {
                Services.MediaService.pausePlayback();
            }
            this.showMediaBar();
        },

        stopSequence() {
            State.data.media.isPlaying = false;
            State.data.media.currentIndex = 0;
            window.speechSynthesis.cancel();
            this.showMediaBar();
        },

        showSettingsOverlay() {
            UI.Settings.render();
        },

        resetSettingsToDefaults() {
            // console.log('Resetting settings to defaults');

            // Reset media settings to defaults
            State.data.media.speed = State.defaults.media.speed;
            State.data.media.delay = State.defaults.media.delay;
            State.data.media.pitch = State.defaults.media.pitch;
            State.data.media.voice = State.defaults.media.voice;
            State.data.media.languageSettings = JSON.parse(JSON.stringify(State.defaults.media.languageSettings)); // Deep copy

            // Save all media settings
            State.save('media');

            // Clear any selected voice from localStorage (though save() already does this)
            localStorage.removeItem('localStorageVoice');

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

        // Add this helper method to the App return object:

        showNotification(message) {
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
                animation: fadeInOut 2s ease;
            `;

            document.body.appendChild(notification);

            // Remove after 2 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 2000);
        },

        playSequence() {
            // console.log('=== playSequence started ===');
            // console.log('Current index:', State.data.media.currentIndex);

            // Enable scroll listeners when playback starts
            Services.MediaService.enableScrollListeners();

            const elements = document.querySelectorAll('.audio-element');
            // console.log('Total audio elements found:', elements.length);

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
                }, 200); // Increased from 150ms to 200ms
            };

            const playNext = () => {
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

                if (State.data.media.currentIndex >= elements.length) {
                    // console.log('Reached end of elements, stopping');
                    this.stopSequence();
                    return;
                }

                const element = elements[State.data.media.currentIndex];
                if (!element) {
                    // console.log('Element not found at index', State.data.media.currentIndex);
                    State.data.media.currentIndex++;
                    setTimeout(playNext, 100);
                    return;
                }

                // Find the row container
                let row = null;
                if (element.closest('.words-grid')) {
                    row = element.closest('.words-grid');
                    // console.log('Element is in words-grid, row:', row?.id || 'no id');
                } else {
                    row = element.closest('.sentence-group, .word-card, .flashcard-front, .quiz-question-card');
                    // console.log('Element is in other container, row:', row?.className);
                }

                const rowId = row?.id || row?.getAttribute('data-uid') || `row-${State.data.media.currentIndex}`;
                // console.log('Row ID:', rowId, 'Current row ID:', State.data.currentRowId);

                // Scroll when we enter a new row
                if (rowId && rowId !== State.data.currentRowId) {
                    // console.log('New row detected, scrolling...');
                    State.data.isAutoScrolling = true;
                    pendingScrollCompletion = true;

                    // Set a long scroll lock immediately
                    window.scrollLockUntil = Date.now() + 1500; // Increased to 1500ms

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
                        }, 100);
                    }, 400); // Increased from 300ms to 400ms
                } else {
                    // console.log('Same row, speaking current element');
                    speakCurrent();
                }
            };

            const speakCurrent = () => {
                if (!State.data.media.isPlaying) return;

                const element = elements[State.data.media.currentIndex];
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

                    Services.MediaService.speak(text, lang,
                        () => {
                            // Clear previous highlights
                            document.querySelectorAll('.active-highlight').forEach(el => {
                                el.classList.remove('active-highlight');
                            });

                            element.classList.add('active-highlight');

                            const linkId = element.getAttribute('data-link');
                            if (linkId) {
                                const linkedElement = document.getElementById(linkId);
                                if (linkedElement) linkedElement.classList.add('active-highlight');
                            }
                        },
                        () => {
                            element.classList.remove('active-highlight');

                            const linkId = element.getAttribute('data-link');
                            if (linkId) {
                                const linkedElement = document.getElementById(linkId);
                                if (linkedElement) linkedElement.classList.remove('active-highlight');
                            }

                            repeatCount++;
                            if (repeatCount < repeats) {
                                // console.log('Repeating, count:', repeatCount);
                                setTimeout(speakRepeat, 100);
                            } else {
                                // console.log('Moving to next element');
                                State.data.media.currentIndex++;
                                // console.log('New index:', State.data.media.currentIndex);
                                // console.log('Elements length:', elements.length);

                                // Check if we've reached the end
                                if (State.data.media.currentIndex >= elements.length) {
                                    // console.log('END REACHED: currentIndex >= elements.length');
                                }

                                setTimeout(playNext, State.data.media.delay * 1000);
                            }
                        }
                    );
                };

                speakRepeat();
            };

            playNext();
        },

        media: {
            play(element) {
                const inDocument = element.closest('.document-content') !== null;

                if (inDocument) {
                    // Use seekToElement for document content
                    Services.MediaService.seekToElement(element);
                } else {
                    // Single playback for flashcards, quizzes, etc.
                    const text = element.getAttribute('data-text');
                    const lang = element.getAttribute('data-lang');
                    Services.MediaService.speak(text, lang);
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

        // Quiz helpers
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
        // Game helpers
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

        // Flashcard helpers
        showFlashcardAnswer() {
            if (State.data.flashcards) {
                State.data.flashcards.showAnswer = true;
                UI.Flashcard.renderCard();
            }
        },

        rateFlashcard(quality) {
            if (State.data.flashcards) {
                const cards = State.data.flashcards;

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

        // Grammar sheet
        showGrammarSheet(grammarId) {
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
                const examples = [];

                // Find examples from current document
                State.data.currentDocument.sections.forEach(s => {
                    s.content.forEach(b => {
                        if (b.type === 'paragraph' && b.sentences) {
                            b.sentences.forEach(sent => {
                                // Check if sentence matches the grammar pattern
                                if (sent.source && grammar.pattern) {
                                    // Simple pattern matching - you might want to enhance this
                                    if (sent.source.includes(grammar.pattern.replace(/[+]/g, '').trim())) {
                                        examples.push({
                                            source: sent.source,
                                            translation: sent.translations[State.data.lang] ||
                                                sent.translations.en || ''
                                        });
                                    }
                                }
                            });
                        }
                    });
                });

                // Get current sentence if available
                let currentSource = '';
                let currentTranslation = '';

                if (block.sentences && block.sentences[0]) {
                    currentSource = block.sentences[0].source;
                    currentTranslation = block.sentences[0].translations[State.data.lang] ||
                        block.sentences[0].translations.en || '';
                }

                UI.GrammarSheet.render({
                    pattern: grammar.pattern,
                    note: grammar.note || grammar.explanation,
                    examples: examples.slice(0, 5), // Limit to 5 examples
                    source: currentSource,
                    translation: currentTranslation
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
                options = {
                    'font-standard': t('font_standard', 'Standard (Sans)'),
                    'font-serif': t('font_serif', 'Classic (Serif)'),
                    'font-thai-modern': t('font_thai', 'Modern Thai (Loopless)'),
                    'font-fa-vazir': t('font_farsi', 'Farsi Script (Vazir)')
                };

                let html = '<div class="overlay-menu card">';
                Object.entries(options).forEach(([key, value]) => {
                    html += `<button onclick="App.updateSetting('font','${key}')">${value}</button>`;
                });
                html += '</div>';
                anchor.innerHTML = html;
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