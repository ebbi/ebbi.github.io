// src/state.js - Application state management
class AppState {
    constructor() {
        this.data = {
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

            // Activity counts
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

        };

        this.defaults = {
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
        };

        this.loadAccordionStates();
    }

    get(key) { 
        return this.data[key]; 
    }
    
    set(key, value) { 
        this.data[key] = value; 
        this.save(key); 
    }
    
    update(key, fn) { 
        this.data[key] = fn(this.data[key]); 
        this.save(key); 
    }

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
    }

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
}

export default AppState;