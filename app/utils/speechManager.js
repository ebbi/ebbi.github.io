/* app/utils/speechManager.js */
class SpeechManager {
    constructor() {
        this.abortController = null;   // will be created per playback session
        this.isPlaying = false;
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
        if (!this.isPlaying) return;
        if ('speechSynthesis' in window) speechSynthesis.cancel();
        this.abortController.abort();
        this.isPlaying = false;
        this.abortController = null;
        const btn = document.getElementById('reloadSoundBtn');
        if (btn) {
            btn.style.opacity = 0.5;
 //           btn.style.display = 'none';
        }
    }

    /** Getter for the current AbortSignal (used inside playbackLoop) */
    get signal() {
        return this.abortController?.signal;
    }
}

/* Export a singleton */
export const speechManager = new SpeechManager();