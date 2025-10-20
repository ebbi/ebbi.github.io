// ---------------------------------------------------------------
// app/utils/speechController.js
// ---------------------------------------------------------------

import { speakText, populateVoiceList } from "./speech.js";
import { getStoredVoice, setStoredVoice } from "./storage.js";
import { getLocale } from "../data/locales.js";

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
function makeStatusVoiceRow(locale) {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.justifyContent = "space-between";
    row.style.flexWrap = "wrap";
    row.style.gap = "1rem";
    row.style.marginTop = "0.5rem";

    // ---- status message (left side) ---------------------------------
    const status = document.createElement("div");
    status.style.flex = "1 1 auto";
    status.style.minHeight = "1.2rem";
    status.style.fontStyle = "italic";
    status.style.border = "1px solid var(--border-surface, #ddd)";
    status.style.borderRadius = "4px";
    status.style.padding = "0.2rem 0.5rem";
    status.style.background = "var(--bg-surface, #fff)";
    row.appendChild(status);

    // ---- voice selector (right side) --------------------------------
    const voiceSelect = document.createElement("select");
    voiceSelect.id = "voiceSelect";
    voiceSelect.style.flex = "0 0 auto";
    voiceSelect.style.maxWidth = "calc(100% - 2rem)";
    voiceSelect.style.minWidth = "8rem";
    voiceSelect.style.boxSizing = "border-box";

    row.appendChild(voiceSelect);

    return { row, status, voiceSelect };
}

/* -----------------------------------------------------------------
   Factory – builds the UI inside `container` and returns a controller.
   ----------------------------------------------------------------- */



/* ---------------------------------------------------------------
   speechController.js
   --------------------------------------------------------------- */



export function createSpeechController(container, {
    getAvailableLanguages,
    onVoiceChange,
    tokenElements = [],
    translationElements = [],
    defaultLang = null,
    locale = getLocale(defaultLang || "en")
} = {}) {

    /* -----------------------------------------------------------------
       Internal state – we add a `speakMap` that mirrors the UI’s
       Speak‑checkboxes (lang → true/false).
       ----------------------------------------------------------------- */
    const state = {
        ...defaultState,
        tokenEls: tokenElements,
        transEls: translationElements,
        speakMap: {}               // ← NEW
    };

    /* -----------------------------------------------------------------
       Public helper – the UI will call this after it rebuilds the grid
       (so we always have the latest checkbox state).
       ----------------------------------------------------------------- */
    function updateSpeakMap(newMap) {
        state.speakMap = { ...newMap };
    }

    /* -----------------------------------------------------------------
       Core playback loop – now respects `state.speakMap`.
       ----------------------------------------------------------------- */
    async function playbackLoop() {
        state.playing = true;
        setStatus("statusPlaying");
        playBtn.disabled = true;

        while (state.playing && state.tokenIdx < state.tokenEls.length) {
            const tIdx = state.tokenIdx;
            const col = state.tokenEls[tIdx];               // <div class="token-col">
            const spans = state.transEls[tIdx];               // array of <span>

            /* ---------------------------------------------------------
               1️⃣  SOURCE token (transIdx === -1)
               --------------------------------------------------------- */
            if (state.transIdx === -1) {
                const srcSpan = col.querySelector(".trans"); // first span = source
                const srcLang = srcSpan?.getAttribute("lang");

                // Only speak if the Speak‑checkbox for this language is ON
                if (srcLang && state.speakMap[srcLang]) {
                    highlightCurrent();
                    await speakText(srcSpan.textContent, state.voiceName);
                    await wait(state.delaySec);
                }
                // Move to the first translation (whether or not we spoke)
                state.transIdx = 0;
                continue;
            }

            /* ---------------------------------------------------------
               2️⃣  TRANSLATION spans (transIdx >= 0)
               --------------------------------------------------------- */
            if (state.transIdx < spans.length) {
                const span = spans[state.transIdx];
                const lang = span.getAttribute("lang");

                // Skip this span entirely if its Speak‑checkbox is OFF
                if (!state.speakMap[lang]) {
                    state.transIdx += 1;          // jump to next translation
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

            /* ---------------------------------------------------------
               3️⃣  Advance to next token
               --------------------------------------------------------- */
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

    /* -----------------------------------------------------------------
       Public API – expose the new `updateSpeakMap` method.
       ----------------------------------------------------------------- */
    return {
        updateElements(newTokenEls, newTransEls) {
            state.tokenEls = newTokenEls;
            state.transEls = newTransEls;
            state.tokenIdx = 0;
            state.transIdx = -1;
            clearHighlights();
        },

        updateSpeakMap,                     // ← NEW export

        getVoiceSelect() { return voiceSelect; },
        setStatus,
        startFrom(tokenIdx, transIdx) {
            if ("speechSynthesis" in window) speechSynthesis.cancel();
            state.tokenIdx = tokenIdx;
            state.transIdx = transIdx;
            highlightCurrent();
            state.paused = false;
            playbackLoop().catch(console.warn);
        },

        destroy() { container.innerHTML = ""; }
    };
}



/*

export function createSpeechController(container, {
 getAvailableLanguages,
 onVoiceChange,
 tokenElements = [],
 translationElements = [],
 defaultLang = null,               // <-- UI language of the exercise
 // -----------------------------------------------------------------
 // New: pass the locale object so we can use translated status strings
 // -----------------------------------------------------------------
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
 const controlsRow = document.createElement("div");
 controlsRow.style.display = "flex";
 controlsRow.style.alignItems = "center";
 controlsRow.style.gap = "0.5rem";
 controlsRow.style.flexWrap = "wrap";

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
 // UI – Row 2 = status message + voice selector (built together)
 // -----------------------------------------------------------------
 const { row: statusVoiceRow, status: statusEl, voiceSelect } =
     makeStatusVoiceRow(locale);

 // Populate the voice list (once)
 const availableLangs = getAvailableLanguages ? getAvailableLanguages() : [];
 populateVoiceList(voiceSelect, availableLangs);

 // -----------------------------------------------------------------
 // Auto‑select a voice that matches the exercise language (defaultLang)
 // -----------------------------------------------------------------
 const allVoices = speechSynthesis.getVoices();
 let chosenVoice = null;
 if (defaultLang) {
     chosenVoice = allVoices.find(v => v.lang.startsWith(defaultLang));
 }
 if (!chosenVoice) {
     const fallback = (navigator.language || "").slice(0, 2).toLowerCase();
     chosenVoice = allVoices.find(v => v.lang.startsWith(fallback));
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
     // `key` is one of the locale keys defined above.
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
 // Core playback loop (unchanged, but we now keep highlights on pause)
 // -----------------------------------------------------------------
 async function playbackLoop() {
     state.playing = true;
     setStatus("statusPlaying");
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
             const span = state.transEls[tIdx][state.transIdx];
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
     // End of playback – clear status unless we are paused.
     // -------------------------------------------------------------
     if (state.paused) {
         // keep the “Paused” message (already set by pause handler)
     } else {
         // natural end – clear the status line
         setStatus("");
     }

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

     if (typeof onVoiceChange === "function") onVoiceChange(newVoice);

     // Show the “Voice change” message **temporarily**
     setStatus("statusVoiceChange");
     setPanelEnabled(false);

     // Re‑enable after a short grace period (2 s works well)
     setTimeout(() => {
         setPanelEnabled(true);
         // Once the UI is active again we clear the status line.
         setStatus("");
     }, 2000);
 });

 // -----------------------------------------------------------------
 // Public API – the host can update the element collections,
 // retrieve the voice selector, and start playback from an arbitrary
 // token/translation (used by the click‑handler in dictionaryExercise).
 // -----------------------------------------------------------------
 return {
     updateElements(newTokenEls, newTransEls) {
         state.tokenEls = newTokenEls;
         state.transEls = newTransEls;
         state.tokenIdx = 0;
         state.transIdx = -1;
         clearHighlights();
     },

     getVoiceSelect() {
         return voiceSelect;
     },

     setStatus,               // expose for external callers if needed

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


*/