// ---------------------------------------------------------------
// app/utils/speechController.js
// ---------------------------------------------------------------
// Central speech‑controller used by the dictionary exercise.
// Handles Play / Pause / Reset / Delay, voice selection, status line,
// and synchronisation with the token / translation elements supplied
// by the UI.
// ---------------------------------------------------------------

import { speakText, populateVoiceList } from "./speech.js";
import { getStoredVoice, setStoredVoice } from "./storage.js"; 
import { getLocale } from "../data/locales.js";
import { getStoredLang } from "../utils/storage.js";

/* -----------------------------------------------------------------
   Default internal state – identical to the original version.
   ----------------------------------------------------------------- */
const defaultState = {
    tokenIdx: 0,          // which column we are on
    transIdx: -1,         // -1 = source token, >=0 = translation index
    playing: false,
    paused: false,
    delaySec: 1,
    voiceName: null,
    tokenEls: [],         // filled by the UI (columns)
    transEls: []          // 2‑dimensional array of <span> elements
};

/**
 * Factory – builds the UI inside `container` and returns a controller.
 *
 * Options:
 *   - getAvailableLanguages():Array<string> – list of language codes for voice filtering
 *   - defaultLang:string                 – UI language (used to pick a default voice)
 *   - onVoiceChange?(newVoice:string)    – optional callback when the voice changes
 *   - tokenElements:Array<HTMLElement>    – will be replaced on every rebuild
 *   - translationElements:Array<Array<HTMLElement>>
 */
export function createSpeechController(container, {
    getAvailableLanguages,
    defaultLang,
    onVoiceChange,
    tokenElements = [],
    translationElements = [],
    locale = getLocale(defaultLang || "en")
} = {}) {

    // -----------------------------------------------------------------
    // Clone a fresh state for this instance
    // -----------------------------------------------------------------
    const state = { ...defaultState };
    state.tokenEls = tokenElements;
    state.transEls = translationElements;

    // -----------------------------------------------------------------
    // UI – Row 1 = controls (Play / Pause / Reset / Delay)
    // -----------------------------------------------------------------
    const speechPanel = document.createElement("div");
    speechPanel.id = "speechPanel";

    // ---- NEW STYLE FOR PLAYER PANEL -----------------------------------------
    speechPanel.style.fontSize = "0.85rem";
    speechPanel.style.margin = "0.15rem 0.15rem 0.25rem 0.15rem";

    speechPanel.classList.add('speech-panel');

    const controlsRow = document.createElement("div");
    controlsRow.classList.add('speech-controls-row');

    const playBtn = document.createElement("button");
    playBtn.title = locale.playButton || "Play";
    playBtn.textContent = "▶️";
    controlsRow.appendChild(playBtn);

    const pauseBtn = document.createElement("button");
    pauseBtn.title = locale.pauseButton || "Pause";
    pauseBtn.textContent = "⏸️";
    controlsRow.appendChild(pauseBtn);

    const resetBtn = document.createElement("button");
    resetBtn.title = locale.resetButton || "Reset";
    resetBtn.textContent = "🔄";
    controlsRow.appendChild(resetBtn);

    const delayLabel = document.createElement("label");
    delayLabel.textContent = locale.delayLabel || "Delay (s):";
    controlsRow.appendChild(delayLabel);

    const delayInput = document.createElement("input");
    delayInput.type = "number";
    delayInput.min = 1;
    delayInput.max = 5;
    delayInput.step = 0.1;
    delayInput.value = state.delaySec;
    delayInput.style.width = "3rem";
    controlsRow.appendChild(delayInput);

    // -----------------------------------------------------------------
    // UI – Row 2 = status message + voice selector
    // -----------------------------------------------------------------
    const statusVoiceRow = document.createElement("div");
    statusVoiceRow.classList.add('speech-status-row');

    const statusEl = document.createElement("div");
    statusEl.classList.add('speech-status');
    statusVoiceRow.appendChild(statusEl);

    const voiceSelect = document.createElement("select");
    voiceSelect.id = "voiceSelect";
    voiceSelect.classList.add('speech-voice-select');
    statusVoiceRow.appendChild(voiceSelect);

    const defaultOption = document.createElement("option");
    defaultOption.value = locale.selectExerciseVoice; // No value for the default message
    defaultOption.text = "Select exercise language voice"; // The default message
    defaultOption.disabled = true; // Disable the option
    defaultOption.selected = true; // Set it as the selected option
    voiceSelect.insertBefore(defaultOption, voiceSelect.firstChild);


    // -----------------------------------------------------------------
    speechPanel.appendChild(controlsRow);   // Row 1
    speechPanel.appendChild(statusVoiceRow); // Row 2

    // -----------------------------------------------------------------
    // Helper – enable/disable the whole panel (opacity + disabled attrs)
    // -----------------------------------------------------------------
    function setPanelEnabled(enabled, message) {
        controlsRow.style.pointerEvents = enabled ? "" : "none";
        statusVoiceRow.style.pointerEvents = enabled ? "" : "none";

        controlsRow.querySelectorAll("button,input,select").forEach(el => {
            el.disabled = !enabled;
            el.style.opacity = enabled ? "" : "0.5";
        });

        if (typeof message !== "undefined") statusEl.textContent = message;
    }

    // -----------------------------------------------------------------
    // Public helper – set the status line text (uses locale strings)
    // -----------------------------------------------------------------
    function setStatus(key) {
        // `locale` was passed when the controller was created.
        const txt = locale[key] || key;
        statusEl.textContent = txt;
    }

    // -----------------------------------------------------------------
    // Highlight helpers (unchanged)
    // -----------------------------------------------------------------
    function clearHighlights() {
        state.tokenEls.forEach(el => (el.style.background = ""));
        state.transEls.flat().forEach(el => (el.style.background = ""));
    }
    function highlightCurrent() {
        clearHighlights();
        const t = state.tokenIdx;
        const tr = state.transIdx;
        if (t < 0 || t >= state.tokenEls.length) return;
        if (tr === -1) {
            state.tokenEls[t].style.background = "var(--link)";
        } else {
            const el = state.transEls[t][tr];
            if (el) el.style.background = "var(--link)";
        }
    }

    // -----------------------------------------------------------------
    // Simple Promise‑based delay
    // -----------------------------------------------------------------
    function wait(sec) {
        return new Promise(r => setTimeout(r, sec * 1000));
    }

    // -----------------------------------------------------------------
    // Core playback loop – now respects the `speakMap` (see below)
    // -----------------------------------------------------------------
    async function playbackLoop() {
        state.playing = true;
        setStatus("statusPlaying");
        playBtn.disabled = true;

        while (state.playing && state.tokenIdx < state.tokenEls.length) {
            const tIdx = state.tokenIdx;
            const col = state.tokenEls[tIdx];               // <div class="token-col">
            const spans = state.transEls[tIdx];               // array of <span>

            // ---------------------------------------------------------
            // 1️⃣  SOURCE token (transIdx === -1)
            // ---------------------------------------------------------
            if (state.transIdx === -1) {
                const srcSpan = col.querySelector(".trans"); // first span
                const srcLang = srcSpan?.getAttribute("lang");

                // Speak only if its Speak‑checkbox is ON
                if (srcLang && state.speakMap[srcLang]) {
                    highlightCurrent();
                    await speakText(srcSpan.textContent, state.voiceName);
                    await wait(state.delaySec);
                }
                // Move to the first translation (whether spoken or not)
                state.transIdx = 0;
                continue;
            }

            // ---------------------------------------------------------
            // 2️⃣  TRANSLATION spans (transIdx >= 0)
            // ---------------------------------------------------------
            if (state.transIdx < spans.length) {
                const span = spans[state.transIdx];
                const lang = span.getAttribute("lang");

                // Skip if Speak‑checkbox for this language is OFF
                if (!state.speakMap[lang]) {
                    state.transIdx += 1;
                    continue;
                }

                highlightCurrent();
                const txt = span.textContent.trim();
                if (txt) {
                    await speakText(txt, state.voiceName);
                    await wait(state.delaySec);
                }
                state.transIdx += 1;
                continue;
            }

            // ---------------------------------------------------------
            // 3️⃣  Advance to next token
            // ---------------------------------------------------------
            state.tokenIdx += 1;
            state.transIdx = -1;
        }

        // -------------------------------------------------------------
        // End of playback – clear status unless we are paused.
        // -------------------------------------------------------------
        if (!state.paused) setStatus("");
        state.playing = false;
        setPanelEnabled(true);
        playBtn.disabled = false;
    }

    // -----------------------------------------------------------------
    // UI event wiring
    // -----------------------------------------------------------------
    playBtn.onclick = () => {
        if (state.playing) return;
        playBtn.disabled = true;
        state.paused = false;
        playbackLoop().catch(console.warn);
    };

    pauseBtn.onclick = () => {
        if (!state.playing) return;
        if ("speechSynthesis" in window) speechSynthesis.cancel();
        state.playing = false;
        state.paused = true;
        setStatus("statusPaused");
        // keep highlights – do not clear them
    };

    resetBtn.onclick = () => {
        if ("speechSynthesis" in window) speechSynthesis.cancel();
        state.tokenIdx = 0;
        state.transIdx = -1;
        state.playing = false;
        state.paused = false;
        clearHighlights();
        setStatus("statusPlaying");   // reset shows “Playing” immediately
        playbackLoop().catch(console.warn);
    };

    delayInput.oninput = () => {
        const v = parseFloat(delayInput.value);
        if (!isNaN(v) && v >= 1 && v <= 5) state.delaySec = v;
    };

    // -----------------------------------------------------------------
    // Voice‑selector handling – cancel speech, show a temporary message,
    // disable the whole UI for a short timeout, then re‑enable.
    // -----------------------------------------------------------------
    voiceSelect.addEventListener("change", ev => {
        const newVoice = ev.target.value;
        if ("speechSynthesis" in window) speechSynthesis.cancel();

        state.voiceName = newVoice;
        try {
            setStoredVoice(newVoice);
        } catch (e) {
            console.warn("[Speech] could not persist voice:", e);
        }

        // -------------------------------------------------------------
        // ①  Auditory confirmation – speak a short “Voice changed”
        // -------------------------------------------------------------
        // Grab the UI language (the same language used for UI strings)
        const uiLang = getStoredLang();
        const locale = getLocale(uiLang);
        const msg = locale.statusVoiceChange || "Voice changed";
        // Use the *new* voice for the confirmation so the user hears it
        speakText(msg, newVoice).catch(() => {/* ignore TTS errors */ });

        if (typeof onVoiceChange === "function") onVoiceChange(newVoice);

        // Show the “Voice change” message temporarily (visual cue)
        setStatus("statusVoiceChange");
        setPanelEnabled(false);

        setTimeout(() => {
            setPanelEnabled(true);
            setStatus("");               // clear the temporary message
        }, 2000);
    });

    // -----------------------------------------------------------------
    // Populate the voice list (once)
    // -----------------------------------------------------------------
    const availableLangs = getAvailableLanguages ? getAvailableLanguages() : [];
    populateVoiceList(voiceSelect, availableLangs);

    // Auto‑select a voice that matches the UI language (defaultLang)
    const allVoices = ('speechSynthesis' in window) ? speechSynthesis.getVoices() : [];
    let chosenVoice = null;
    if (defaultLang) {
        chosenVoice = allVoices.find(v => v.lang.startsWith(defaultLang));
    }
    if (!chosenVoice && allVoices.length) chosenVoice = allVoices[0];
    if (chosenVoice) {
        const opt = Array.from(voiceSelect.options)
            .find(o => o.value === chosenVoice.name);
        if (opt) voiceSelect.value = opt.value;
        state.voiceName = voiceSelect.value;
    }

    // -----------------------------------------------------------------
    // Assemble everything inside the supplied container
    // -----------------------------------------------------------------
    container.appendChild(controlsRow);
    container.appendChild(statusVoiceRow);

    // -----------------------------------------------------------------
    // Public API – the host can update the element collections,
    // retrieve the voice selector, and start playback from an arbitrary
    // token/translation (used by the click‑handler in dictionaryExercise).
    // -----------------------------------------------------------------
    return {
        /**
         * Replace the token / translation element collections.
         * Called by the dictionary UI after every rebuild.
         */
        updateElements(newTokenEls, newTransEls) {
            state.tokenEls = newTokenEls;
            state.transEls = newTransEls;
            state.tokenIdx = 0;
            state.transIdx = -1;
            clearHighlights();
        },

        /**
         * Update the internal Speak‑map (called after the UI rebuilds
         * the check‑boxes).  `speakMap` is an object:  lang → true/false.
         */
        updateSpeakMap(newMap) {
            state.speakMap = { ...newMap };
        },

        getVoiceSelect() {
            return voiceSelect;
        },

        setStatus,               // expose for external callers if needed

        /**
         * Start playback from a specific token / translation.
         * `tokenIdx` = column index, `transIdx` = -1 for source token,
         * otherwise the index of the translation span inside that column.
         */
        startFrom(tokenIdx, transIdx) {
            if ("speechSynthesis" in window) speechSynthesis.cancel();
            state.tokenIdx = tokenIdx;
            state.transIdx = transIdx;
            highlightCurrent();
            state.paused = false;
            playbackLoop().catch(console.warn);
        },

        destroy() {
            container.innerHTML = "";
        }
    };
}

