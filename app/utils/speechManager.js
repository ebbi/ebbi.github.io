/* app/utils/speechManager.js */
class SpeechManager {
    constructor() {
        this.abortController = null;   // will be created per playback session
        this.isPlaying = false;

        // The browser provides 'document' globally
        if (typeof document !== 'undefined') {
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    // Logic to stop audio if the user leaves the app
                    this.stop();
                }
            });
        }
    }

    /** Called by a SpeechController when a playback loop starts */
    start() {
        if (this.isPlaying) this.stop();
        this.abortController = new AbortController();
        this.isPlaying = true;
        const btn = document.getElementById('reloadSoundBtn');
        if (btn) {
            btn.style.display = 'inline-block';
            btn.style.opacity = 1;
        }
    }

    stop() {
        // 1. Always clear the abort controller immediately to stop the JS loop
        if (this.abortController) {
            this.abortController.abort();
        }

        // 2. Clear the browser's audio queue
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
        }

        this.isPlaying = false;
        this.abortController = null;

        // UI Updates
        const btn = document.getElementById('reloadSoundBtn');
        if (btn) {
            btn.style.opacity = 0.5;
            // Optionally add a "stopped" class for CSS styling
            btn.classList.remove('active');
        }
    }

    /** Getter for the current AbortSignal (used inside playbackLoop) */
    get signal() {
        return this.abortController?.signal;
    }

}

/* Export a singleton */
export const speechManager = new SpeechManager();