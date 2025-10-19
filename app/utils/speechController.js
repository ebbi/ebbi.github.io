// ---------------------------------------------------------------
// app/utils/speechController.js
// ---------------------------------------------------------------
// Centralised speech‑control logic used by dictionaryExercise.js
// and any future exercise type.
// ---------------------------------------------------------------

import { speakText, populateVoiceList } from "./speech.js";

/* -----------------------------------------------------------------
   Default internal state – identical to the one you had before.
   ----------------------------------------------------------------- */
const defaultState = {
    tokenIdx: 0,
    transIdx: -1,
    playing: false,
    paused: false,
    delaySec: 1,
    voiceName: null,
    tokenEls: [],
    transEls: []
};

/* -----------------------------------------------------------------
   Helper – creates the thin status line (row 2) that will hold the
   feedback message **and** the voice selector (they share the same
   flex container).  The line gets a subtle border so it looks like a
   boxed message.
   ----------------------------------------------------------------- */
function makeStatusVoiceRow() {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.justifyContent = "space-between";
    row.style.flexWrap = "wrap";          // mobile‑first: allow wrap when too narrow
    row.style.gap = "1rem";               // 1 rem gap between message & selector
    row.style.marginTop = "0.5rem";

    // ---- status message (left side) ---------------------------------
    const status = document.createElement("div");
    status.style.flex = "1 1 auto";        // take remaining space
    status.style.minHeight = "1.2rem";    // reserve height even when empty
    status.style.fontStyle = "italic";
    status.style.border = "1px solid var(--border-surface, #ddd)";
    status.style.borderRadius = "4px";
    status.style.padding = "0.2rem 0.5rem";
    status.style.background = "var(--bg-surface, #fff)";
    row.appendChild(status);

    // ---- voice selector (right side) --------------------------------
    const voiceSelect = document.createElement("select");
    voiceSelect.id = "voiceSelect";
    voiceSelect.style.flex = "0 0 auto";   // shrink‑to‑fit, never grow
    voiceSelect.style.maxWidth = "calc(100% - 2rem)"; // never exceed parent width
    voiceSelect.style.minWidth = "8rem";   // keep it usable on tiny screens
    voiceSelect.style.boxSizing = "border-box";

    row.appendChild(voiceSelect);

    return { row, status, voiceSelect };
}

/* -----------------------------------------------------------------
   Factory – builds the UI inside `container` and returns a controller.
   ----------------------------------------------------------------- */
export function createSpeechController(container, {
    // -----------------------------------------------------------------
    // Options the host must supply
    // -----------------------------------------------------------------
    getAvailableLanguages,   // () => Array<string>
    onVoiceChange,           // (newVoice) => void (optional)
    tokenElements = [],      // will be overwritten later by the host
    translationElements = [] // same
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
    const controlsRow = document.createElement("div");
    controlsRow.style.display = "flex";
    controlsRow.style.alignItems = "center";
    controlsRow.style.gap = "0.5rem";
    controlsRow.style.flexWrap = "wrap"; // mobile‑first: wrap if needed

    const playBtn = document.createElement("button");
    playBtn.title = "Play";
    playBtn.textContent = "▶️";
    controlsRow.appendChild(playBtn);

    const pauseBtn = document.createElement("button");
    pauseBtn.title = "Pause";
    pauseBtn.textContent = "⏸️";
    controlsRow.appendChild(pauseBtn);

    const resetBtn = document.createElement("button");
    resetBtn.title = "Reset";
    resetBtn.textContent = "🔄";
    controlsRow.appendChild(resetBtn);

    const delayLabel = document.createElement("label");
    delayLabel.textContent = "Delay (s):";
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
    // UI – Row 2 = status message + voice selector (built together)
    // -----------------------------------------------------------------
    const { row: statusVoiceRow, status: statusEl, voiceSelect } =
        makeStatusVoiceRow();

    // Populate the voice list **once** (the controller owns the selector)
    populateVoiceList(voiceSelect, getAvailableLanguages ? getAvailableLanguages() : []);

    // -----------------------------------------------------------------
    // Assemble everything inside the supplied container
    // -----------------------------------------------------------------
    container.appendChild(controlsRow);
    container.appendChild(statusVoiceRow);

    // -----------------------------------------------------------------
    // Helper – enable/disable the whole panel (opacity + disabled attrs)
    // -----------------------------------------------------------------
    function setPanelEnabled(enabled, message) {
        // `message` is optional – if omitted we keep the current text.
        controlsRow.style.pointerEvents = enabled ? "" : "none";
        statusVoiceRow.style.pointerEvents = enabled ? "" : "none";

        controlsRow.querySelectorAll("button,input,select").forEach(el => {
            el.disabled = !enabled;
            el.style.opacity = enabled ? "" : "0.5";
        });

        if (typeof message !== "undefined") statusEl.textContent = message;
    }

    // -----------------------------------------------------------------
    // Public helper – set the status line text (border already applied)
    // -----------------------------------------------------------------
    function setStatus(msg) {
        statusEl.textContent = msg;
    }

    // -----------------------------------------------------------------
    // Highlight helpers (same logic you already had)
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
    // Core playback loop (unchanged, but we now keep highlights on pause)
    // -----------------------------------------------------------------
    async function playbackLoop() {
        state.playing = true;
        setStatus("Playing");
        // Rule a – after the first Play click we will disable the Play button
        playBtn.disabled = true;

        while (state.playing && state.tokenIdx < state.tokenEls.length) {
            const tIdx = state.tokenIdx;
            const transArray = state.transEls[tIdx];

            // ---- Speak Thai token ------------------------------------
            if (state.transIdx === -1) {
                highlightCurrent();
                const thai = state.tokenEls[tIdx].textContent;
                await speakText(thai, state.voiceName);
                await wait(state.delaySec);
                state.transIdx = 0;
                continue;
            }

            // ---- Speak translation ----------------------------------
            if (state.transIdx < transArray.length) {
                const span = transArray[state.transIdx];
                highlightCurrent();
                const txt = span.textContent.trim();
                if (txt) {
                    await speakText(txt, state.voiceName);
                    await wait(state.delaySec);
                }
                state.transIdx += 1;
                continue;
            }

            // ---- Advance to next token -------------------------------
            state.tokenIdx += 1;
            state.transIdx = -1;
        }

        // -------------------------------------------------------------
        // If we exited because of a **pause**, keep the highlight and
        // keep the status message (“Paused”).  If we exited because we
        // reached the end, clear everything.
        // -------------------------------------------------------------
        if (state.paused) {
            // keep highlights & status – nothing to do
        } else {
            // natural end of the exercise
            clearHighlights();
            setStatus(""); // clear message
        }

        state.playing = false;
        setPanelEnabled(true); // re‑enable UI (status unchanged)
        playBtn.disabled = false; // allow Play again (rule a)
    }

    // -----------------------------------------------------------------
    // UI event wiring
    // -----------------------------------------------------------------
    playBtn.onclick = () => {
        if (state.playing) return; // already playing
        // Reset the “Play” button disabled flag (rule a)
        playBtn.disabled = true;
        // If we were paused, clear the paused flag so the loop can run
        state.paused = false;
        playbackLoop().catch(console.warn);
    };

    pauseBtn.onclick = () => {
        if (!state.playing) return;
        if ("speechSynthesis" in window) speechSynthesis.cancel();
        state.playing = false;
        state.paused = true;
        setStatus("Paused"); // rule c – keep message until Play or Reset
        // **Do NOT clear highlights** – they stay visible while paused
    };

    resetBtn.onclick = () => {
        if ("speechSynthesis" in window) speechSynthesis.cancel();
        state.tokenIdx = 0;
        state.transIdx = -1;
        state.playing = false;
        state.paused = false;
        clearHighlights();
        setStatus("Reset"); // rule b – show reset message
        // Immediately start playing again (same behaviour you had before)
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
        if (typeof onVoiceChange === "function") onVoiceChange(newVoice);

        setPanelEnabled(false, "Voice change – waiting…");
        // Re‑enable after a short grace period (2 s works well)
        setTimeout(() => setPanelEnabled(true), 2000);
    });

    // -----------------------------------------------------------------
    // Public API – the host can update the element collections,
    // retrieve the voice selector, and start playback from an arbitrary
    // token/translation (used by the click‑handler in dictionaryExercise).
    // -----------------------------------------------------------------
    return {
        /** Replace the token / translation element arrays (called after a language‑filter change). */
        updateElements(newTokenEls, newTransEls) {
            state.tokenEls = newTokenEls;
            state.transEls = newTransEls;
            // Reset playback pointers so a fresh Play starts from the beginning
            state.tokenIdx = 0;
            state.transIdx = -1;
            clearHighlights();
        },

        /** Return the <select> element that the controller created. */
        getVoiceSelect() {
            return voiceSelect;
        },

        /** External callers can set a status message (e.g. “Paused”). */
        setStatus,

        /** Start playback from a specific token / translation. */
        startFrom(tokenIdx, transIdx) {
            // Reset any ongoing speech first
            if ("speechSynthesis" in window) speechSynthesis.cancel();

            state.tokenIdx = tokenIdx;
            state.transIdx = transIdx;
            // Highlight the starting point immediately
            highlightCurrent();

            // If we were paused, clear that flag so the loop can run
            state.paused = false;
            // Kick off the loop (will respect the current indices)
            playbackLoop().catch(console.warn);
        },

        /** For debugging / unit‑tests – destroy everything inside the container. */
        destroy() {
            container.innerHTML = "";
        }
    };
}