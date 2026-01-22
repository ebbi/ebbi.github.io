// app/utils/speechManager.js

class SpeechManager {
    constructor() {
        this.voices = [];
        this.isPlaying = false;
        this.abortController = null;
        if (this.utterance) this.utterance = null;

        if (typeof window !== 'undefined' && window.speechSynthesis) {
            const loadVoices = () => {
                this.voices = window.speechSynthesis.getVoices();
            };
            window.speechSynthesis.onvoiceschanged = loadVoices;
            loadVoices();
        }
    }

    stop() {
        // 1. Always clear the abort controller immediately to stop the JS loop
        if (this.abortController) {
            this.abortController.abort();
        }

        // 2. Clear the browser's audio queue
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }

        this.isPlaying = false;
        this.abortController = null;
        if (this.utterance) this.utterance = null;

        // UI Updates
        const btn = document.getElementById('reloadSoundBtn');
        if (btn) {
            btn.style.opacity = 0.5;
            btn.classList.remove('active');
        }
    }

    async speak(text, lang = 'en', rate = 1.0) {
        this.stop();
        if (!text) return;

        this.abortController = new AbortController();
        const signal = this.abortController.signal;

        return new Promise((resolve, reject) => {
            this.utterance = new SpeechSynthesisUtterance(text);
            this.utterance.lang = lang;
            this.utterance.rate = rate;

            this.utterance.onstart = () => { this.isPlaying = true; };
            this.utterance.onend = () => {
                this.isPlaying = false;
                resolve();
            };
            this.utterance.onerror = (e) => {
                this.isPlaying = false;
                if (e.error === 'interrupted') resolve();
                else reject(e);
            };

            if (signal.aborted) {
                resolve();
                return;
            }

            window.speechSynthesis.speak(this.utterance);

            signal.addEventListener('abort', () => {
                window.speechSynthesis.cancel();
                resolve();
            });
        });
    }
}

export const speechManager = new SpeechManager();