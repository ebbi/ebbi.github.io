```markdown
# Record and Compare Feature: Implementation Plan (Revised 12-Stage)

## Clarifications and Assumptions

To ensure smooth implementation across multiple chat sessions and strictly prevent context drift, the feature has been broken down into 12 highly focused stages.

- **Recording API:** Native `MediaRecorder` API. Format defaults to `audio/webm;codecs=opus` with a fallback.
- **Permissions:** Relies on browser native prompt. Denied state shows a localized error.
- **Overlay UI:** Modal overlay sheet (like `grammar-overlay`), not a full-page view.
- **"Inherit tap to highlight":** Text in the overlay is clickable, triggering `speakLineWithHighlight`.
- **Blob Lifecycle:** Stored in memory as an `ObjectURL`. Revoked immediately after playback or overlay close.
- **Timeout:** 60-second auto-stop.

---

## Stage 1: State, Storage & Internationalization (i18n)

**Context for Next Chat:**
"We are implementing a 'Record and Compare' feature for the Zabon app. This is Stage 1 of 12. We are focusing SOLELY on adding the setting state, storage, and UI strings. Do not implement the Settings UI toggle, mic icons, overlay, or recording logic yet."

**Files to Upload:** `app.js`, `main.css`

**Changes to be Made:**

1. **State & Storage:** Update `normalizeSettings()` to include `recordAndCompare: Boolean(s.recordAndCompare)` (default `false`).
2. **Internationalization:** Add the following keys to `UI_STRINGS` (with translations for th, fa, ar, es, zh, ja):
   - `recordAndCompare`: "Record and Compare"
   - `recordAndCompareDesc`: "Show microphone icons to record your speech"
   - `recordMicAriaLabel`: "Record this text"
   - `recordOverlayTitle`: "Record & Compare"
   - `recordInstruction`: "Compare your speech. Tap to record."
   - `recordBtnStart`: "Record"
   - `recordBtnStop`: "Stop recording"
   - `recordBtnPlay`: "Play and Compare"
   - `recordPermissionDenied`: "Microphone access denied. Please enable it in your browser settings."
   - `recordFailed`: "Recording failed or was silent. Please try again."

**Tests to Approve:**

- [ ] Verify `window.ZabonV2.state.settings.recordAndCompare` exists and defaults to `false`.
- [ ] Verify all new UI strings render correctly when switching the App Language.

---

## Stage 2: Settings UI Toggle

**Context for Next Chat:**
"We are on Stage 2 of 12. Stage 1 (State & i18n) is complete. In this stage, we will add the toggle to the Settings sheet. Do not implement mic icons, overlay, or recording logic yet."

**Files to Upload:** `app.js`, `main.css`

**Changes to be Made:**

1. **Settings UI:** In `renderSettings()`, add a new section above the "Voices" section.
2. Render a toggle (checkbox/switch) for `recordAndCompare` using the `recordAndCompare` and `recordAndCompareDesc` strings.
3. Bind the change event to update `state.settings.recordAndCompare`, save state, and re-render the current view.

**Tests to Approve:**

- [ ] Open Lesson Settings. Verify the toggle appears above "Voices".
- [ ] Toggle ON/OFF. Verify state updates and persists after refresh.

---

## Stage 3: Mic Icons — Word Cells

**Context for Next Chat:**
"We are on Stage 3 of 12. Stages 1-2 are complete. In this stage, we will add the microphone icon ONLY to word cells in the lesson view. Do not touch sentence cells, the overlay, or recording logic yet."

**Files to Upload:** `app.js`, `main.css`

**Changes to be Made:**

1. **DOM Generation:** Modify `renderLanguageCell()`. If `state.settings.recordAndCompare` is true AND `kind !== "sentence"`, append a mic icon button.
2. **HTML Attributes:** The button must have `data-action="open-record-overlay"`, `data-item-id`, `data-lang`, and `data-text`.
3. **Styling:** Add `.record-mic-btn` CSS (small, unobtrusive, aligned next to text). Use an emoji 🎙️ or inline SVG.
4. **Accessibility:** Add `aria-label` using `recordMicAriaLabel`.

**Tests to Approve:**

- [ ] Turn setting OFF: No mic icons appear.
- [ ] Turn setting ON: Mic icons appear next to words, but NOT sentences.
- [ ] Inspect element: Verify `data-item-id`, `data-lang`, and `data-text` are correct.

---

## Stage 4: Mic Icons — Sentence Cells & Layout

**Context for Next Chat:**
"We are on Stage 4 of 12. Stage 3 (Word mic icons) is complete. In this stage, we will add mic icons to sentence cells and ensure it doesn't break text wrapping. Do not implement the overlay or recording logic yet."

**Files to Upload:** `app.js`, `main.css`

**Changes to be Made:**

1. **DOM Generation:** Update `renderLanguageCell()` to also append the mic icon when `kind === "sentence"`.
2. **Layout Verification:** Ensure the mic icon doesn't break the flex-wrap of `.sentence-text` or `.sentence-token` elements. Adjust CSS if necessary (e.g., `flex-shrink: 0` on the mic button).

**Tests to Approve:**

- [ ] Verify mic icons appear next to sentences.
- [ ] Verify sentence text wrapping remains intact and tokens highlight correctly when tapped.

---

## Stage 5: Overlay Shell (Empty Modal)

**Context for Next Chat:**
"We are on Stage 5 of 12. Stages 1-4 are complete. In this stage, we will build the empty overlay shell. Do not add text display, TTS, buttons, or recording logic yet."

**Files to Upload:** `app.js`, `main.css`

**Changes to be Made:**

1. **Overlay DOM:** Create `openRecordOverlay()` that generates a modal sheet (similar to `openGrammarOverlay`).
2. Include backdrop, header (with `recordOverlayTitle`), and close button.
3. **Event Binding:** Wire up `data-action="open-record-overlay"` from Stage 3/4 to trigger this function. Wire up close/backdrop to close it.
4. **Styling:** Add `.record-overlay` CSS.

**Tests to Approve:**

- [ ] Tap a mic icon. Verify the empty overlay opens smoothly.
- [ ] Tap close button/backdrop. Verify it closes.

---

## Stage 6: Overlay Text Display, TTS & Buttons

**Context for Next Chat:**
"We are on Stage 6 of 12. Stage 5 (Overlay shell) is complete. In this stage, we will populate the overlay with the target text, TTS tap-to-hear, and the initial 'Record' button. Do not implement MediaRecorder or playback logic yet."

**Files to Upload:** `app.js`, `main.css`

**Changes to be Made:**

1. **Content Display:** Inside the overlay body, display the target text using `createSentenceTextLine` or `createTextLine`.
2. **TTS:** Attach `speak-text` action to this text so tapping it plays TTS with highlighting.
3. **Instruction & Button:** Add `recordInstruction` text and the initial "Record" button (`recordBtnStart`).

**Tests to Approve:**

- [ ] Verify correct word/sentence displays in the overlay.
- [ ] Tap the text: Verify original TTS plays and highlights correctly.
- [ ] Verify "Record" button and instructional text are visible.

---

## Stage 7: getUserMedia & MediaRecorder Basics

**Context for Next Chat:**
"We are on Stage 7 of 12. Stages 1-6 are complete. In this stage, we will implement the core microphone recording logic to get a Blob. Do not implement button state transitions, UI changes, or playback logic yet."

**Files to Upload:** `app.js`, `main.css`

**Changes to be Made:**

1. **MediaRecorder Setup:** Implement `navigator.mediaDevices.getUserMedia` to get the audio stream.
2. Initialize `MediaRecorder` with the stream.
3. Collect `dataavailable` chunks into an array and create a Blob on `stop`.
4. _Note: Just get the Blob. Do not wire it to the UI button states yet._

**Tests to Approve:**

- [ ] Trigger the recording function manually (e.g., via console or a temporary test button).
- [ ] Verify browser asks for mic permission.
- [ ] Verify a valid audio Blob is created in memory after stopping.

---

## Stage 8: Button State Machine & 60s Timeout

**Context for Next Chat:**
"We are on Stage 8 of 12. Stage 7 (MediaRecorder basics) is complete. In this stage, we will wire up the button state machine and the 60-second auto-stop timeout. Do not implement playback or error handling yet."

**Files to Upload:** `app.js`, `main.css`

**Changes to be Made:**

1. **State Machine:**
   - **Idle:** "Record" button visible. Tapping starts recording, changes button to "Stop recording" (`recordBtnStop`).
   - **Recording:** "Stop" button visible. Tapping stops recorder, changes button to "Play and Compare" (`recordBtnPlay`).
2. **Timeout:** Add a 60-second `setTimeout` that automatically triggers the stop logic when recording starts.

**Tests to Approve:**

- [ ] Tap "Record" -> Button changes to "Stop".
- [ ] Tap "Stop" -> Button changes to "Play and Compare".
- [ ] Wait 60s (or temporarily change to 3s for testing) -> Verify it auto-stops and button changes.

---

## Stage 9: Error Handling & CSS Visual States

**Context for Next Chat:**
"We are on Stage 9 of 12. Stage 8 (State machine) is complete. In this stage, we will add error handling for denied permissions and CSS visual states for the recording process. Do not implement playback logic yet."

**Files to Upload:** `app.js`, `main.css`

**Changes to be Made:**

1. **Error Handling:** If `getUserMedia` fails (permission denied), display `recordPermissionDenied` and disable the record button.
2. **CSS Visual States:** Add a pulsing red dot or specific color animation for the "Recording" state button.

**Tests to Approve:**

- [ ] Deny mic permission in browser settings -> Verify error message displays and button is disabled.
- [ ] Start recording -> Verify the pulsing/visual state activates.

---

## Stage 10: Play & Compare Sequence

**Context for Next Chat:**
"We are on Stage 10 of 12. Stages 1-9 are complete. In this stage, we will implement the 'Play and Compare' sequence. Do not implement memory cleanup or edge cases yet."

**Files to Upload:** `app.js`, `main.css`

**Changes to be Made:**

1. **Playback Sequence:** When "Play and Compare" is tapped:
   - Disable the button.
   - Play original text using `mediaService.speakText`.
   - Wait for TTS `onend` event + 800ms delay.
   - Create `Audio` object using `URL.createObjectURL(blob)` and play it.

**Tests to Approve:**

- [ ] Record a phrase. Tap "Play and Compare".
- [ ] Verify original TTS plays first.
- [ ] Verify short pause, then your recorded voice plays.

---

## Stage 11: State Reset & Memory Cleanup

**Context for Next Chat:**
"We are on Stage 11 of 12. Stage 10 (Playback) is complete. In this stage, we will implement state reset and memory cleanup to prevent leaks. Do not implement edge cases yet."

**Files to Upload:** `app.js`, `main.css`

**Changes to be Made:**

1. **State Reset:** Once user recording finishes (`audio.onended`), change button back to "Record".
2. **Cleanup:** Revoke the Object URL (`URL.revokeObjectURL`), nullify the blob variable, and clear the `MediaRecorder` chunks array.

**Tests to Approve:**

- [ ] Play and compare -> Verify button resets to "Record".
- [ ] Record a second time -> Verify the previous blob was cleared and no memory leaks occur (check DevTools Memory tab if possible).

---

## Stage 12: Edge Cases & Stress Testing

**Context for Next Chat:**
"We are on the final Stage 12 of 12. Stages 1-11 are complete. In this stage, we will handle edge cases and ensure robust cleanup."

**Files to Upload:** `app.js`, `main.css`

**Changes to be Made:**

1. **Overlay Closed Mid-Playback:** If the user closes the overlay while audio is playing, ensure the `Audio` object stops and the blob is cleaned up.
2. **Silent/Empty Recording:** If the recording is completely silent or failed to capture data (Blob size is 0 or too small), show `recordFailed` and reset to the "Record" state.
3. **TTS Failure:** If TTS fails to play, ensure the recorded audio still plays or gracefully aborts.

**Tests to Approve:**

- [ ] Close the overlay during playback -> Verify audio stops immediately and no console errors.
- [ ] Record silence (or block mic) -> Verify `recordFailed` message appears and state resets.
- [ ] Complete full end-to-end flow 5 times in a row to ensure stability.

---

## How to use this plan:

1. Copy the text for **Stage 1** (from "Context for Next Chat" down to "Tests to Approve").
2. Open a new chat.
3. Paste the Stage 1 text.
4. Upload `app.js` and `main.css`.
5. Let the AI generate the code. Apply it, run the tests.
6. If tests pass, copy **Stage 2** and repeat the process in a new chat, uploading the updated files.
```
