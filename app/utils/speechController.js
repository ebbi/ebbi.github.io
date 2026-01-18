// ---------------------------------------------------------------
// app/utils/speechController.js
// ---------------------------------------------------------------

import { speakText, populateVoiceList } from "./speech.js";
import { getStoredVoice, setStoredVoice, getStoredLang } from "./storage.js";
import { getLocale } from "../data/locales.js";
import { speechManager } from './speechManager.js';
import { getOrCreateSpeechPanel } from './speech.js';

const wait = (sec) => new Promise(resolve => setTimeout(resolve, sec * 1000));

const defaultState = {
    tokenIdx: 0,
    transIdx: -1,
    delaySec: 1,
    rate: 1,
    pitch: 1,
    voiceName: null,
    currentSessionId: 0,
    isLoopRunning: false,
    playing: false,
    tokenEls: [],
    transEls: [],
    paused: false,
    speakMap: {},
    repeatMap: {}
};

export function createSpeechController(container, {
    getAvailableLanguages,
    defaultLang,
    onVoiceChange,
    tokenElements = [],
    translationElements = [],
    locale = getLocale(defaultLang || "en")
} = {}) {

    const uiLang = getStoredLang();
    const uiLocale = getLocale(uiLang);

    // --- MANUAL INTERRUPTION ---
    const initInterruption = () => {
        if (typeof window === 'undefined') return;
        const events = ['wheel', 'touchmove', 'keydown'];
        const handleManualInterruption = (e) => {
            // 'state' is the original object from your 505-line file
            if (state && state.playing) {
                // Ignore modifier keys
                if (e.type === 'keydown' && ['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) return;

                console.log(`[SpeechController] Interrupted by ${e.type}`);

                speechCtrl.stopPlayback();
            }
        };
        events.forEach(type => window.addEventListener(type, handleManualInterruption, { passive: true }));
    };

    initInterruption();


    const state = {
        ...defaultState,
        tokenEls: tokenElements || [],
        transEls: translationElements || []
    };

    let lastDetailsEl = null;

    // -----------------------------------------------------------------
    // UI Setup
    // -----------------------------------------------------------------
    //    const speechPanel = document.createElement("div");
    //    speechPanel.id = "speechPanel";

    const speechPanel = getOrCreateSpeechPanel(); // Don't need a parent if it already exists

    // --- Progress Bar ---
    const progressContainer = document.createElement("div");
    progressContainer.id = "speech-progress-container";
    progressContainer.style.cssText = "width:100%; height:6px; background:var(--border-surface); margin-bottom:0.5rem; overflow:hidden; border-radius:3px;";

    const progressBar = document.createElement("div");
    progressBar.id = "speech-progress-bar";
    // Initial transition and style
    progressBar.style.cssText = "width:0%; height:100%; background:var(--heading-accent); transition:width 0.4s cubic-bezier(0.1, 0.7, 0.1, 1);";

    progressContainer.appendChild(progressBar);
    speechPanel.appendChild(progressContainer);

    // --- Player Controls Bar ---
    const playerControls = document.createElement("div");
    playerControls.style.cssText = `display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 1px 0; width: 100%;`;
    const playBtn = document.createElement("button");
    playBtn.className = "control-btn play-btn"; // Use CSS below for centering
    playBtn.textContent = "▶";

    const stopBtn = document.createElement("button");
    stopBtn.className = "control-btn stop-btn";
    stopBtn.textContent = "⏹";

    // --- Status Label (Now in the middle) ---
    const statusEl = document.createElement("div");
    statusEl.id = "speech-status";
    statusEl.style.cssText = "font-size:0.85rem; font-weight:600; color:var(--text-secondary); flex-grow:1; text-align:center; transition: opacity 0.3s;";

    const settingsBtn = document.createElement("button");
    settingsBtn.className = "control-btn settings-btn";
    settingsBtn.textContent = "⚙️";

    const leftGroup = document.createElement("div");
    leftGroup.style.cssText = `display: flex; align-items: center; gap: 8px; flex: 1;`; // Added flex: 1 to let this group take available space

    leftGroup.append(playBtn, stopBtn, statusEl);

    statusEl.style.cssText = "font-size:0.85rem; font-weight:600; color:var(--text-secondary); margin-left: 4px; white-space: nowrap;";

    // Settings on the right
    playerControls.append(leftGroup, settingsBtn);
    //    playerControls.append(playBtn, stopBtn, statusEl, settingsBtn);
    speechPanel.appendChild(playerControls);

    // --- Settings Panel ---
    const settings = document.createElement("div");
    settings.id = "player-settings";
    settings.style.cssText = "display:none; border:1px solid var(--border-surface); padding:10px; border-radius:8px; margin-top:10px;";

    // Sliders
    const delayBox = createSlider(uiLocale.delayLabel || "Delay", 0.5, 5.0, 0.1, state.delaySec, "s", (v) => state.delaySec = v);
    const speedBox = createSlider(uiLocale.speedLabel || "Speed", 0.5, 2.0, 0.1, state.rate, "x", (v) => state.rate = v);
    const pitchBox = createSlider(uiLocale.pitchLabel || "Pitch", 0.5, 2.0, 0.1, state.pitch, "", (v) => state.pitch = v);

    // Voice Selector
    const voiceContainer = document.createElement("div");
    voiceContainer.style.cssText = "display:flex; justify-content:space-between; align-items:center; margin-top:0.5rem;";
    const voiceLabel = document.createElement("label");
    voiceLabel.textContent = uiLocale.voiceLabel || "Voice";
    const voiceSelect = document.createElement("select");
    voiceSelect.id = "voiceSelect";
    voiceContainer.append(voiceLabel, voiceSelect);

    settings.append(delayBox, speedBox, pitchBox, voiceContainer);
    speechPanel.appendChild(settings);
    //   container.appendChild(speechPanel);

    // -----------------------------------------------------------------
    // Internal Logic
    // -----------------------------------------------------------------

    function setStatus(key) {
        const text = uiLocale[key] || "";
        statusEl.innerHTML = '';

        if (text) {
            const label = document.createElement("span");
            label.textContent = text;
            statusEl.appendChild(label);

            // --- SPEED BADGE ---
            const sBadge = document.createElement("span");
            sBadge.className = "speed-badge";
            sBadge.textContent = `${state.rate % 1 === 0 ? state.rate : state.rate.toFixed(1)}x`;
            sBadge.onclick = (e) => {
                e.stopPropagation();
                const speeds = [0.8, 1.0, 1.2, 1.5, 2.0];
                state.rate = speeds[(speeds.indexOf(state.rate) + 1) % speeds.length];
                sBadge.textContent = `${state.rate}x`;
            };
            statusEl.appendChild(sBadge);

            // --- DELAY BADGE ---
            const dBadge = document.createElement("span");
            dBadge.className = "delay-badge";
            dBadge.textContent = `${state.delaySec}s`;
            dBadge.onclick = (e) => {
                e.stopPropagation();
                const delays = [0, 1, 2, 3, 4, 5];
                state.delaySec = delays[(delays.indexOf(state.delaySec) + 1) % delays.length];
                dBadge.textContent = `${state.delaySec}s`;
            };
            statusEl.appendChild(dBadge);

            // --- REPEAT BADGE (Fixed Logic) ---
            const rBadge = document.createElement("span");
            rBadge.className = "repeat-badge";

            // Find current repeat value from any language in the map (e.g., 'en')
            // Default to 1 if not set, because your loop uses count > 0 to speak
            let currentR = state.repeatMap?.['en'] || 1;
            rBadge.textContent = `${currentR}r`;

            rBadge.onclick = (e) => {
                e.stopPropagation();
                let val = parseInt(rBadge.textContent);
                if (isNaN(val)) val = 1;

                // Cycle 1 to 5 (0 is usually avoided as it mutes the loop in your logic)
                let nextR = (val >= 5) ? 1 : val + 1;

                // 1. Update the Map for all languages so the Loop reacts
                if (state.repeatMap) {
                    Object.keys(state.repeatMap).forEach(lang => {
                        state.repeatMap[lang] = nextR;
                    });
                }

                // 2. Update Visuals
                rBadge.textContent = `${nextR}r`;
            };
            statusEl.appendChild(rBadge);

            statusEl.style.visibility = "visible";
            statusEl.style.opacity = "1";
        } else {
            statusEl.style.visibility = "hidden";
            statusEl.style.opacity = "0";
        }
    }

    function updateProgressBar() {
        const bar = document.getElementById("speech-progress-bar");
        if (!bar || !state.tokenEls.length) return;

        const percentage = (state.tokenIdx / state.tokenEls.length) * 100;

        // Smooth update
        requestAnimationFrame(() => {
            bar.style.width = `${percentage}%`;
            bar.style.backgroundColor = state.paused ? "#f39c12" : "var(--heading-accent)";
        });
    }

    progressContainer.style.cursor = "pointer";
    progressContainer.onclick = (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const clickedPercentage = x / rect.width;
        const newIdx = Math.floor(clickedPercentage * state.tokenEls.length);

        // Jump to the clicked word
        speechCtrl.startFrom(newIdx, -1);
    };

    function clearHighlights() {
        // 1. Clear main token highlights
        state.tokenEls.forEach(el => {
            if (el) el.classList.remove('highlighted-token');
        });

        // 2. Clear translation highlights (nested array)
        state.transEls.forEach(subArray => {
            if (subArray) {
                subArray.forEach(el => {
                    if (el) el.classList.remove('highlighted-token');
                });
            }
        });
    }

    function highlightCurrent() {
        clearHighlights();
        const t = state.tokenIdx;
        const tr = state.transIdx;

        // Safety check for index bounds
        if (t < 0 || t >= state.tokenEls.length) return;

        // Determine if we are highlighting the main token (tr === -1) 
        // or a specific translation index
        let targetEl = (tr === -1) ? state.tokenEls[t] : (state.transEls[t]?.[tr]);

        if (targetEl && targetEl instanceof HTMLElement) {
            targetEl.classList.add('highlighted-token');

            // Scroll into view within its container
            targetEl.scrollIntoView({
                behavior: 'smooth',
                block: 'center', // Center is often better for focus
                inline: 'nearest'
            });
        }
    }

    function createSlider(label, min, max, step, val, unit, onChange) {
        const row = document.createElement("div");
        row.style.cssText = "display:flex; align-items:center; gap:0.5rem; margin-bottom:5px;";
        const lbl = document.createElement("label");
        lbl.textContent = `${label}: `;
        const valSpan = document.createElement("span");
        valSpan.textContent = `${val}${unit}`;
        valSpan.style.fontWeight = "bold";
        const input = document.createElement("input");
        input.type = "range"; input.min = min; input.max = max; input.step = step; input.value = val;
        input.oninput = () => {
            const v = parseFloat(input.value);
            valSpan.textContent = `${v.toFixed(1)}${unit}`;
            onChange(v);
        };
        row.append(lbl, valSpan, input);
        return row;
    }

    function syncAccordion(currentTokenEl) {
        const parent = currentTokenEl.closest('details');
        if (!parent) return;
        if (parent !== lastDetailsEl) {
            document.querySelectorAll('#main details').forEach(det => {
                if (det !== parent) { det.open = false; det.classList.remove('section-paused'); }
            });
            parent.open = true;
            lastDetailsEl = parent;
            parent.classList.add('section-pulse');
            setTimeout(() => parent.classList.remove('section-pulse'), 1500);
            parent.scrollIntoView({ behavior: 'smooth', block: 'start' });

            if (!parent.dataset.hasStopListener) {
                parent.addEventListener('toggle', () => {
                    if (!parent.open && state.playing && lastDetailsEl === parent) speechCtrl.stopPlayback();
                });
                parent.dataset.hasStopListener = "true";
            }
        }
        state.paused ? parent.classList.add('section-paused') : parent.classList.remove('section-paused');
    }

    async function playbackLoop() {
        // 1. Assign a unique ID to this specific function call
        const mySessionId = ++state.currentSessionId;

        // 2. Physical Lock: prevent two loops from entering logic at the exact same ms
        if (state.isLoopRunning) return;
        state.isLoopRunning = true;

        state.playing = true;

        playBtn.textContent = "⏸";
        setStatus("statusPlaying");

        // --- THE GHOST KILLER ---
        const abortCheck = async () => {
            // 1. Initial check: Is this loop already a ghost?
            if (state.currentSessionId !== mySessionId || !state.playing) {
                throw new Error("Abort");
            }

            // 2. Pause Handling
            while (state.paused) {
                // Check session inside the pause loop to kill ghosts immediately
                if (state.currentSessionId !== mySessionId || !state.playing) {
                    throw new Error("Abort");
                }
                await wait(0.2);
            }

            // 3. ✨ POST-PAUSE CHECK: If the user clicked a word WHILE we were paused, 
            // the loop just woke up. We MUST kill it here before it touches the indices.
            if (state.currentSessionId !== mySessionId) {
                throw new Error("Abort");
            }
        };

        try {
            while (state.tokenIdx < state.tokenEls.length && state.playing) {
                await abortCheck();

                const col = state.tokenEls[state.tokenIdx];
                if (!col) {
                    state.tokenIdx++;
                    continue;
                }

                // SCROLL ONLY ONCE PER TOKEN
                col.scrollIntoView({ behavior: 'smooth', block: 'center' });

                const spans = state.transEls[state.tokenIdx] || [];
                syncAccordion(col);
                updateProgressBar();

                const srcSpan = col.querySelector(".trans");
                const srcLang = srcSpan?.getAttribute("lang") || col.dataset.sourceLang || defaultLang;

                // --- Phase 1: Source ---
                if (state.transIdx === -1) {
                    highlightCurrent();

                    const count = state.repeatMap[srcLang] || 0;
                    const txt = srcSpan?.textContent?.trim();

                    if (count > 0 && txt) {
                        for (let i = 0; i < count; i++) {
                            await abortCheck();
                            await speakText(txt, state.voiceName, srcLang, state.rate, state.pitch);
                            if (i < count - 1) await wait(state.delaySec * 0.5);
                        }
                        await wait(state.delaySec);
                    } else {
                        await wait(0.1);
                    }
                    // Move to first translation for Phase 2
                    state.transIdx = 0;
                }

                // --- Phase 2: Translations ---
                while (state.transIdx < spans.length) {
                    await abortCheck();

                    const span = spans[state.transIdx];
                    const txt = span?.textContent?.trim();
                    const lang = span?.getAttribute("lang");
                    const count = state.repeatMap[lang] || 0;

                    highlightCurrent();

                    // FIX: Only speak if it's NOT the same element we just spoke in Phase 1
                    // and if the count is greater than 0.
                    if (count > 0 && txt && span !== srcSpan) {
                        for (let i = 0; i < count; i++) {
                            await abortCheck();
                            await speakText(txt, state.voiceName, lang, state.rate, state.pitch);
                            if (i < count - 1) await wait(state.delaySec * 0.5);
                        }
                        await wait(state.delaySec);
                    } else {
                        // Skip quickly but keep highlight visible
                        await wait(0.05);
                    }
                    state.transIdx++;
                }

                // --- PROTECTED INDEX ADVANCE ---
                if (state.currentSessionId === mySessionId && state.playing) {
                    state.tokenIdx++;
                    state.transIdx = -1;
                    await wait(0.1);
                } else {
                    throw new Error("Abort");
                }
            }
        } catch (e) {
            if (e.message !== "Abort") console.error("Loop Error:", e);
        } finally {
            // Only unlock and handle stop UI if we are the LATEST session
            if (state.currentSessionId === mySessionId) {
                state.isLoopRunning = false;
                if (state.tokenIdx >= state.tokenEls.length || !state.playing) {
                    if (state.tokenIdx >= state.tokenEls.length) {
                        state.tokenIdx = 0;
                    }
                    speechCtrl.stopPlayback();
                }
            }
        }
    }

    // -----------------------------------------------------------------
    // Events & API
    // -----------------------------------------------------------------
    playBtn.onclick = () => {
        if (state.playing && !state.paused) {
            state.paused = true;
            window.speechSynthesis.cancel();
            playBtn.textContent = "▶";
            setStatus("statusPaused");
        } else if (state.playing && state.paused) {
            state.paused = false;
            playBtn.textContent = "⏸";
            setStatus("statusPlaying");
        } else {
            // Safety: Cancel anything currently speaking before starting
            window.speechSynthesis.cancel();
            playbackLoop();
        }
    };

    settingsBtn.onclick = () => {
        const isHidden = settings.style.display === "none";
        settings.style.display = isHidden ? "block" : "none";
    };

    voiceSelect.addEventListener("change", ev => {
        state.voiceName = ev.target.value;
        setStoredVoice(state.voiceName);
        if (onVoiceChange) onVoiceChange(state.voiceName);
    });

    populateVoiceList(voiceSelect, getAvailableLanguages?.() || []);

    const speechCtrl = {
        stop: () => speechCtrl.stopPlayback(),
        //        play: () => playLoop(state.currentIndex),
        play: () => playbackLoop().catch(err => console.warn("Play error:", err)),

        updateElements(tokens, trans) {
            state.tokenEls = tokens;
            state.transEls = trans;
            // Only reset index if not currently playing
            if (!state.playing) {
                state.tokenIdx = 0;
                state.transIdx = -1;
            }
            updateProgressBar();
        },

        setActiveElements(t, tr) {
            this.updateElements(t, tr);
        },

        updateSpeakMap(m) {
            state.speakMap = { ...m };
        },

        updateRepeatMap(m) {
            state.repeatMap = { ...m };
        },

        stopPlayback() {
            state.playing = false;
            state.paused = false;
            window.speechSynthesis.cancel();
            speechManager.stop();
            playBtn.textContent = "▶";
            clearHighlights();
            setStatus("");
            if (lastDetailsEl) lastDetailsEl.classList.remove('section-paused');
            lastDetailsEl = null;
            updateProgressBar();
        },

        startFrom(tIdx, transIdx) {
            // 1. Invalidate sessions and update UI immediately
            state.currentSessionId++;
            state.playing = false;
            state.paused = false;

            const statusEl = document.getElementById("speech-status");
            if (statusEl) {
                statusEl.textContent = "Loading...";
                statusEl.classList.add("status-loading");
            }

            window.speechSynthesis.cancel();
            speechManager.stop();
            clearHighlights();
            state.isLoopRunning = false;

            setTimeout(() => {
                state.tokenIdx = tIdx;
                state.transIdx = transIdx;
                state.playing = true;

                // Remove loading effect once the loop starts
                if (statusEl) statusEl.classList.remove("status-loading");

                playbackLoop().catch(err => console.warn("Restart overlap:", err));
            }, 100);
        },

        getTokenIndex: (el) => state.tokenEls.indexOf(el),

        getState: () => state,

        destroy: () => {
            container.innerHTML = "";
        }
    };

    stopBtn.onclick = () => speechCtrl.stopPlayback();

    window.activeSpeechController = speechCtrl;

    return speechCtrl;
}