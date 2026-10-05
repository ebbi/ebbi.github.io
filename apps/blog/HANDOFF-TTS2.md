HANDOFF — Chat TTS2: Player functionalities (remainder) — sentence highlighting + click-to-read-from-here
Status: complete
Current chat id: TTS2
Current milestone: TTS2
Completed milestones: 00,01,02,03,04,05a,05a-fix,05b-removal,W1,W1-fix,06,06b,07,08,09,C1a,C1-tool,C1-tool-p2,C1-model,C1-tool-cleanup,B1a,C1b-01..C1b-DONE,C1b-18,C1b-12..C1b-17,B1,10b,07b,TTS,TTS2
Next chat id: 07d
Context windows used: 1

Files created/modified (exact paths)

- apps/blog/assets/js/tts.js (MOD; ADDITIVE surface over BlogTTS = {init,speak,
  pause,resume,stop,setEnabled}: onSentence(cb), adviseResolver(fn),
  highlightTarget(), splitSentences (exposed so app.js shares the rule).
  stop()/pause()/end emit the no-active-sentence signal (index -1). ALL TTS
  contracts UNCHANGED (chunked playback, generation token, word-precise resume,
  X-3, X-5). tts.js NEVER walks the post DOM.)
- apps/blog/assets/js/app.js (MOD; buildReadableSentences() -> spoken array +
  parallel node list + parallel DOM Range per sentence, 1:1 by construction
  (per-node split via BlogTTS.splitSentences; collapseWithMap/locateRawOffset/
  rangeForSentence map a char offset onto a Range); getText returns the ARRAY;
  onSentence -> updateHighlight(); delegated click-to-read seeks the CLICKED
  sentence via caret hit-test (sentenceIndexAtPoint); scrolls the active
  sentence toward the TOP; clearHighlight; handleRouteChange clears+drops.)
- apps/blog/assets/css/style.css (MOD; ONE additive new-selector-only block:
  ::highlight(tts-sentence) [sentence granular] + .tts-sentence--active
  [whole-node fallback] + .tts-readable hover; tokens reused, logical props,
  RTL-safe; NO existing block edited; diff +40/0)
- apps/blog/tools/ROADMAP.md (MOD; TTS2 -> Done appended with STATUS; Next -> 07d)
- apps/blog/HANDOFF-TTS2.md (NEW; this file)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> HANDOFF-TTS2.md)

Frozen decisions made in this chat

- D-TTS2-1: Highlight driven by a per-sentence PROGRESS signal from tts.js —
  onSentence(cb) fires (index, total) as each sentence BEGINS. The
  SENTENCE<->DOM mapping is produced/OWNED by app.js (single source of X-2);
  tts.js never walks the post DOM.
- D-TTS2-2: The spoken list and app.js's sentence->node list stay 1:1 BY
  CONSTRUCTION — app.js builds the array per source node with tts.js's SAME
  splitSentences() (now exposed) and passes THAT array to speak(); NO re-split
  of a joined string (which desyncs when a node lacks terminal punctuation).
- D-TTS2-3: No-active-sentence signal = index -1; stop() and pause() emit it
  (post END too) and the app clears the highlight; resume() re-emits the SAME
  index, restoring the same sentence. TENSION: Test #4 says pause "freezes" the
  highlight; the mandatory Interfaces say pause emits no-active-sentence so the
  app CLEARS it. Following the authoritative Interfaces: cleared on pause,
  POSITION retained (Resume continues the same sentence).
- D-TTS2-4: Click-to-read seeks the sentence at the CLICK POINT: on a non-<a>
  click, app.js hit-tests the caret under (clientX,clientY) via
  caretRangeFromPoint/caretPositionFromPoint and picks the Range containing it
  (Range.comparePoint === 0); falls back to the node's FIRST sentence
  (caret-less: elementFromPoint -> node); ignores <a> and skipped regions.
  Hit-testing the clicked ELEMENT is WRONG (the <p> intersects every sentence ->
  always index 0); the click is tested by COORDINATE.
- D-TTS2-5: Presentation only. Sentence granular via the CSS Custom Highlight
  API (key "tts-sentence"); whole-node `.tts-sentence--active` fallback when the
  registry is unavailable. X-3 and list inert (X-6) UNCHANGED; cleared on
  stop/end/route change; prefers-reduced-motion suppresses only the auto-scroll.
- D-TTS2-6: highlightTarget() returns the node from an app-owned resolver
  (adviseResolver(fn) — app.js supplies nodeForSentence); tts.js never touches
  the DOM. No speechSynthesis -> inert buttons, no highlight, no crash.
- X-1..X-6 (carried from TTS): Web Speech API engine; rendered-DOM text source;
  disabled-state contract; stop-on-route-change; guarded init; list inert.

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=af9e5595d9e1cf48e388229c544145bb7dfd02180cb1be44bbd12663ca45b1f3
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the commit-message
body, NOT here (WORKFLOW.md step 6). FILE_TREE_SHA256 is captured AFTER staging
the full TTS2 file set INCLUDING this handoff + HANDOFF-CURRENT.txt.

Interfaces delivered

- tts.js (additive): onSentence(cb) (also fires immediately with current state);
  highlightTarget() -> Element|null (via the app resolver); adviseResolver(fn);
  splitSentences(text) -> string[]. speak(array|string,{start}) unchanged;
  stop()/pause() emit -1.
- app.js (internal): buildReadableSentences(), nodeForSentence(index),
  firstSentenceIndexOf(node), updateHighlight(index), clearHighlight(),
  sentenceIndexAtPoint(x,y). No public app surface added.

Expected delta for the next chat

- 07d (CSS typography) authors tools/milestones/07d.md + implements a
  book-reader typography pass reusing tokens (tokens only additively); touches
  style.css (possibly index.html) ONLY. Then 07c (font selection) authors.

Human edits made outside tooling (structured)

- None reported.

Open warnings (count + links only)

- 0.

Deviations from locked decisions (must be empty, or explain)

- Interpretation, not a deviation: D-TTS2-3 resolves the Test#4-vs-Interfaces
  tension (pause "freezes" vs pause emits -1 → clears) in favor of the
  authoritative Interfaces. Position retained (Resume continues same sentence).
  Flip = one line (don't emit -1 from pause()).

Partial work: None. Blocked reason (only if Status: blocked): n/a.

Known issues / TODOs

- Sentence-split boundaries remain the TTS heuristic (may split after "Dr.");
  app.js uses the SAME rule so indices never desync. Not a bug.
- Sentence-granular highlight = CSS Custom Highlight API (::highlight): Chrome/
  Edge 105+, Safari 17.2+, Firefox 140+. Older engines fall back to the
  whole-node .tts-sentence--active class. A caret exactly on a sentence
  boundary may resolve to the earlier sentence (document-order first match);
  ambiguous click, acceptable.

Assumptions the next chat may rely on

- BlogTTS.splitSentences is the single sentence-splitting rule (both consumers)
  -> 1:1 mapping by construction.
- Highlight registry key is "tts-sentence"; clearHighlight() deletes it.
- readableSentences/readableNodes/readableRanges are rebuilt per post and
  dropped on route change; stale-proof (the click handler rebuilds first).

Test checklist result (pass/fail per item)

1. node --check tts.js -> PASS
2. node --check app.js -> PASS
3. node tools/test-integrity.js -> INTEGRITY OK
4. Post-view highlight advances / pause clears (D-TTS2-3) / resume same
   sentence -> structural smoke PASS (no headless DOM); HUMAN to confirm.
5. Click-to-read seeks CLICKED sentence; link navigates -> selection logic
   proven (click in sentence 2 -> index 1, etc.); HUMAN to confirm in-browser.
6. List view inert, no highlight -> unchanged (setEnabled all).
7. Route change stops + clears -> clearHighlight() in handleRouteChange.
8. No speechSynthesis -> inert, no highlight, no crash -> guarded paths kept.
9. node tools/hash-state.js -> captured (see commit body).
10. git status --porcelain -> exactly the TTS2 file set.

Files to read in the next chat (exact paths)

- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/milestones/07d.md
