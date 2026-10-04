HANDOFF — Chat TTS: Text-to-speech on the bottom toolbar (Play / Pause / Stop)
Status: complete
Current chat id: TTS
Current milestone: TTS
Completed milestones: 00,01,02,03,04,05a,05a-fix,05b-removal,W1,W1-fix,06,06b,07,08,09,C1a,C1-tool,C1-tool-p2,C1-model,C1-tool-cleanup,B1a,C1b-01..C1b-DONE,C1b-18,C1b-12..C1b-17,B1,10b,07b,TTS
Next chat id: 11
Context windows used: 1

Files created/modified (exact paths)

- apps/blog/assets/js/tts.js (NEW; window.BlogTTS = { init, speak, pause, resume, stop, setEnabled }; owns the speechSynthesis lifecycle; SENTENCE-CHUNKED playback for reliable pause; generation token ignores cancel-echo; best-effort word-precise resume via onboundary; guarded; idempotent; NO route awareness; does NOT touch the post DOM)
- apps/blog/index.html (MOD; removed `disabled` from the three transport buttons; gave them ids tts-play-btn/tts-pause-btn/tts-stop-btn; aria-labels kept; tts.js <script> AFTER shell.js, BEFORE app.js; load-order comment updated)
- apps/blog/assets/js/app.js (MOD; gatherReadableText() helper; renderPost enables Play; renderList disables all; handleRouteChange calls window.BlogTTS.stop() FIRST; GUARDED window.BlogTTS.init({getText}) after the BlogTheme guard; one stale 07b comment corrected)
- apps/blog/assets/css/style.css (MOD; ONE additive "Milestone TTS" block, NEW classes only: .transport**btn.is-active, .transport**btn.is-speaking, @keyframes transport-speak-pulse, reduced-motion guard; NO existing block edited)
- apps/blog/tools/ROADMAP.md (MOD; TTS -> Done appended; "Next chat" marker -> 11; a NOTE on 07's entry marking S-4 superseded per X-6)
- apps/blog/HANDOFF-TTS.md (NEW; this file)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> HANDOFF-TTS.md)

Frozen decisions made in this chat

- X-1 (carried): Engine = the Web Speech API (window.speechSynthesis + SpeechSynthesisUtterance). No audio files / server pipeline / voice assets. Voice = a voice matching <html lang> when one exists, else the default.
- X-2 (carried + IMPLEMENTED): Text source = the RENDERED post DOM, NOT a raw block walk. gatherReadableText() emits the title (.post-header\_\_title) first, then, in document order, the text of every <p> and <blockquote> inside .post-content; whitespace collapsed, empties skipped. INCLUSION RULE (exact): only paragraph + blockquote prose is read. EXCLUSION RULE (exact): prose nested in pre/code, .embed-container, figure, or table is SKIPPED, as are images/captions and embedded media.
- X-3 (carried): Transport state contract. List view -> all disabled; post idle -> Play enabled, Pause/Stop disabled; speaking -> Pause+Stop enabled, Play disabled; paused -> Play(resume)+Stop enabled. The buttons' `disabled` state is the SINGLE source of transport availability; tts.js exposes setEnabled() so app.js drives the per-view state.
- X-4 (carried): Route changes stop speech FIRST — window.BlogTTS.stop() is called at the top of handleRouteChange (post->post and post->list). No overlapping utterances.
- X-5 (carried): Guarded init (tts.js optional; app must not break if absent or if speechSynthesis is unavailable).
- X-6 (carried + NOTED IN ROADMAP): 07's S-4 ("transport buttons inert") is SUPERSEDED for the POST view; the list view keeps them inert. Enabled buttons on a post are NOT a regression.
- X-7 (frozen here): Pause reliability = SENTENCE CHUNKING. The post text is split into sentences and each sentence is a SEPARATE utterance, queued in the previous utterance's onend. pause() cancels the in-flight chunk and retains (index, charOffset); resume() re-speaks from there. This makes pause work even on engines that ignore single-utterance pause(). Sentence split rule: after . ! ? … (optionally a closing quote/bracket) + whitespace, and on hard newlines; trimmed; empties dropped.
- X-8 (frozen here): GENERATION TOKEN. Every chunk captures `gen` at creation; pause()/stop()/speak() increment `gen`. A handler whose captured gen is stale ignores its event, so the cancel-induced onend/onerror ECHO does not advance the queue (this fixed "Play after Pause jumps to the next sentence"). A naturally-completed chunk leaves gen unchanged and its onend still advances.
- X-9 (frozen here): Best-effort WORD-PRECISE RESUME. tts.js records the last `onboundary` charIndex within the current sentence; on resume it slices the sentence from that offset (absolute = baseOffset + event.charIndex). Absent onboundary -> resume replays the sentence head (graceful fallback; never skips).
- X-10 (frozen here): STOP returns the transport to POST-IDLE (setIdle: Play enabled, Pause/Stop disabled) so Play works again after a Stop; route changes override with renderList/renderPost's setEnabled.
- X-11 (frozen here): HIGHLIGHTING and CLICK-TO-READ-FROM-HERE are OUT OF SCOPE for TTS and DEFERRED to TTS2. tts.js does not read the post DOM; it only emits speech + tracks sentence position.

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=af9e5595d9e1cf48e388229c544145bb7dfd02180cb1be44bbd12663ca45b1f3
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the commit-message body, NOT in the handoff. See tools/WORKFLOW.md step 6. FILE_TREE_SHA256 is captured AFTER staging the full TTS file set INCLUDING this handoff + HANDOFF-CURRENT.txt.

Interfaces delivered

- window.BlogTTS = { init(opts?), speak(text, opts?), pause(), resume(), stop(), setEnabled(state) }.
- init({ getText }) is idempotent, wires the three buttons; when the Web Speech API is unavailable it leaves all buttons inert and every method is a safe no-op. getText supplies the CURRENT post's readable text on demand (string, or a pre-split sentence array).
- speak(text, opts): splits text into sentences (or accepts an array) and speaks them ONE AT A TIME; opts.start (integer) begins at that sentence. pause()/resume() act between chunks and retain (index, charOffset) so resume continues the same sentence (word-precise where onboundary is supported).
- setEnabled({play,pause,stop}) or setEnabled({all:true}) sets the buttons' disabled state (the single source of availability, X-3).
- index.html: the three transport buttons carry ids tts-play-btn / tts-pause-btn / tts-stop-btn; tts.js loads AFTER shell.js, BEFORE app.js. theme.js stays in <head> (pre-paint).
- DEFERRED (TTS2): onSentence(cb) progress callback + highlightTarget() for highlighting/click-to-read — NOT present in TTS.

Expected delta for the next chat

- 11.md already EXISTS (tracked, committed 20c4d3f) with a filled Interfaces section — VERIFIED, not authored here. The new book-reader milestone (TTS2) is authored at THIS close and slotted AFTER 11 in the ROADMAP.

Human edits made outside tooling (structured)

- The human reported: (a) the Pause button does not pause; (b) request for reader-style sentence highlighting as text is read; (c) request to click text to start reading from that point. These are RECORDED as the TTS2 milestone scope, NOT implemented here (see Deviations/Known issues).

Open warnings (count + links only)

1. tools/\*.md whitespace may not survive chat copy; anchor edits from `cat -A`. (carried; used shell heredoc + python exact-string edits)
2. Edit splice pitfall: verify POSITIONALLY, not by substring. (carried; used here)
3. FILENAME COLLISION: B1 vs B1a. (carried)
4. hash-state.js FILE_TREE_SHA256 capture rule: capture AFTER staging. (carried)
5. LOSS_LEDGER.md table padding mixed (cosmetic). (carried)
6. (significant, recurred) Editor edits may SILENTLY REVERT / the Apply may HANG. NOT hit this chat (used shell heredoc + python exact-string edits throughout); every edit re-verified on disk via git diff. (carried)
7. 0-byte stray file at repo root RECURRED this chat (non-printable name); removed with `find $(git rev-parse --show-toplevel) -maxdepth 1 -type f -size 0 -delete`. (carried)

Deviations from locked decisions (must be empty, or explain)

- None from X-1..X-6 (all honoured). SCOPE NOTE: the human's pause-related reports were treated as IN-FENCE TTS defects and fixed here (sentence chunking + generation token + stop->setIdle). The remaining two requests (sentence highlighting; click-to-read-from-here) are NEW scope beyond TTS's frozen fence; recorded and DEFERRED to the TTS2 milestone rather than silently folded into TTS.

Partial work (link to PARTIAL.md if present)

- None.

Blocked reason (only if Status: blocked)

- (n/a)

Known issues / TODOs

- PAUSE was the original reported defect and IS NOW FIXED in TTS: because many engines (notably desktop Chrome) ignore speechSynthesis.pause()/resume() for a single long utterance, tts.js speaks the post SENTENCE-BY-SENTENCE (one utterance per sentence, queued in onend). pause() cancels the in-flight chunk and RETAINS (index, charOffset); resume() continues the SAME sentence. A GENERATION token (bumped on pause/stop/speak) ignores the cancel-induced onend ECHO, so resume does NOT skip to the next sentence (the second reported defect — fixed).
- WORD-PRECISE RESUME is best-effort: tts.js tracks the last `onboundary` charIndex within the sentence and, on resume, slices the sentence from that offset (Chrome desktop emits onboundary). Where onboundary is absent, resume replays the sentence head — a graceful fallback that NEVER skips content.
- STOP was the third reported defect and IS NOW FIXED: stop() ends with setIdle() (Play enabled, Pause/Stop disabled), so Play works again after a Stop. On a route change, handleRouteChange follows stop() with renderList/renderPost, whose setEnabled() sets the final per-view state (list -> all disabled).
- DEFERRED to TTS2 (NOT in TTS): sentence HIGHLIGHTING and CLICK-TO-READ-FROM-HERE. tts.js does NOT touch the rendered post DOM.
- Sentence splitting is heuristic (may split after abbreviations like "Dr."); documented, not a bug.
- The list view keeping the buttons disabled is intentional (X-3/X-6), not a regression.

Assumptions the next chat may rely on

- window.BlogTTS = { init, speak, pause, resume, stop, setEnabled }; init is called guarded from app.js after the BlogTheme guard. index.html transport buttons carry ids tts-play-btn/tts-pause-btn/tts-stop-btn and are enabled for the post view.
- app.js gathers the post text via gatherReadableText() (rendered-DOM rule above) and passes it to tts.js via the getText option; handleRouteChange calls window.BlogTTS.stop() first.
- No content file written; the seam (import-post.js) is frozen through D-Tool-29; feed.json untouched.
- HANDOFF-CURRENT.txt -> HANDOFF-TTS.md; the next milestone file is apps/blog/tools/milestones/11.md (EXISTS, verified).

Test checklist result (pass/fail per item)

- node --check apps/blog/assets/js/tts.js -> exit 0: PASS
- node --check apps/blog/assets/js/app.js -> exit 0: PASS
- node apps/blog/tools/test-integrity.js -> INTEGRITY OK: PASS
- node structural smoke suites (tts.js): 46/46 PASS across three suites — chunked playback + disabled-state contract (21); word-precise resume incl. cancel-echo regression (8); full regression suite simulating a REAL engine whose cancel() fires the cancelled utterance's onend echo (17). Coverage: exports; init idempotent; init -> all disabled; post-idle setEnabled; Play -> one-sentence-at-a-time; speaking/paused/idle button states; onend advances to next sentence; PAUSE cancels + retains position; RESUME continues the SAME sentence and does NOT skip to the next (the cancel-echo regression); word-precise slice from onboundary offset (and absolute offset accounting across a resume); no-onboundary fallback = sentence head; STOP re-enables Play; Play-after-Stop restarts from sentence 1; speak('') no-op; setEnabled({all:true}); WITH speechSynthesis absent, init/speak/pause/resume/stop never throw AND buttons stay inert (graceful, X-5)
- Structural grep: tts.js has NO location/hash/BlogRouter/currentRoute references (no route-awareness leakage): PASS
- app.js grep: stop() at top of handleRouteChange; setEnabled on post (play:true) + on list (all:true); guarded BlogTTS.init({getText}): PASS
- gatherReadableText rule verified structurally (title-first; p+blockquote document order; excludes pre/code/.embed-container/figure/table; whitespace collapse; empty skip): PASS
- index.html grep '<script>' -> none (no inline script): PASS
- style.css purely additive (numstat 37/0): PASS
- Browser (HUMAN-REPORTED, this chat): Play works; Pause NOW works; Play after Pause NOW resumes the paused sentence (confirmed after the generation-token fix); Stop works and NOW re-enables Play. PASS (human).
- Browser items NOT executed by the agent (no browser here): list-view inert buttons, stop-on-route-change, keyboard, console-clean, graceful stub — covered by the structural suites; browser confirmation owed to a human/next chat.

Files to read in the next chat (exact paths)

- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-TTS.md (this file)
- apps/blog/tools/milestones/11.md (the next milestone; EXISTS, verified)
- apps/blog/tools/milestones/TTS2.md (the book-reader milestone authored at this close)
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/ROADMAP.md
- apps/blog/assets/js/tts.js (new module)
- apps/blog/assets/js/app.js (gatherReadableText + per-view enable + guarded init)
- apps/blog/index.html (transport buttons + script order)
- apps/blog/assets/css/style.css (TTS block)
