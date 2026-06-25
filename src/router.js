// src/router.js - Routing functionality
import UI from './ui/index.js';
import App from './main.js';

class Router {
    constructor() {
        this.routes = {
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
        };
    }

    init() {
        window.addEventListener('hashchange', () => this.handle());
        this.handle();
    }

    handle() {
        const hash = window.location.hash.slice(1) || 'library';
        // console.log('Routing to hash:', hash);

        // FORCE CLEANUP: Disable scroll listeners and stop playback before any route change
        import('./services/media-service.js').then(({ default: MediaService }) => {
            MediaService.disableScrollListeners();
            if (App.state.get('media').isPlaying) {
                MediaService.stopSequence();
            }
        });

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
    }

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
    }

    go(path) {
        // // console.log('Navigating to:', path);
        location.hash = path;
    }
}

export default Router;