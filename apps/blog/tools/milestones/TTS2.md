# Milestone TTS2: Book-reader TTS — sentence highlighting + click-to-read-from-here

## Scope fence (read first)

This milestone upgrades the TTS transport shipped in TTS (and already
strengthened there: reliable Pause + word-precise Resume) into a BOOK-READER
experience over the CURRENT post's rendered text. After the TTS close-out,
TTS2 is narrowed to TWO features:

(a) HIGHLIGHT the sentence currently being spoken (book-reader style),
advancing in document order as reading proceeds, cleared on stop/end;
(b) CLICK-TO-READ-FROM-HERE: clicking any readable text in the post starts
reading from that point (the clicked sentence becomes the current
sentence and playback continues to the end).

Pause reliability, sentence chunking, and word-precise Resume were DELIVERED IN
TTS (not here): tts.js already splits into sentences and resumes at the last
`onboundary` offset. TTS2 therefore does NOT re-do chunking; it CONSUMES the
existing per-sentence progress signal to drive the highlight.

It is a TTS-experience milestone. It does NOT touch the extraction seam
(`tools/import-post.js`, frozen through D-Tool-29), any `content/**/*.json`,
`feed.json`, `renderer.js` block mappings, `router.js`, `nav.js`, `shell.js`,
`theme.js`, `generate-index.js`/`hash-state.js`/`test-integrity.js`, or the 07b
theme control. It does NOT add audio files, a server pipeline, or voice assets
(X-1 stands: Web Speech API only). It does NOT change the X-3 disabled-state
contract's OUTCOME (list inert; post idle -> Play; speaking -> Pause+Stop;
paused -> Play+Stop). It does NOT store reading position across reloads (a
follow-up, not this milestone).

## Objective

When this milestone is done:

- the sentence currently being spoken is visually highlighted (book-reader
  style), advancing in document order as reading proceeds, and cleared on
  stop/end and on route change,
- clicking any readable text in the rendered post starts reading from that
  point (the clicked node's first sentence becomes the current sentence and
  playback continues to the end); clicks on <a> (links) are ignored so
  navigation is unaffected,
- the X-3 transport state contract is preserved exactly; the list view stays
  inert (X-6); route changes still stop speech first (X-4), and
- everything degrades gracefully when `speechSynthesis` is unavailable (X-5:
  buttons inert, no highlight, no crash).

## Interfaces (mandatory — a milestone without these is not ready)

### Modified: apps/blog/assets/js/tts.js

    window.BlogTTS already exposes { init, speak, pause, resume, stop,
    setEnabled } and speaks SENTENCE-BY-SENTENCE (TTS). TTS2 ADDS a highlight
    surface; keep all existing contracts:
      onSentence(cb)       // register a callback fired (sentenceIndex, total)
                           // as each sentence begins — drives the highlight
      highlightTarget()    // -> the DOM element currently associated with the
                           // active sentence | null  (app.js owns the mapping)
      speak(text, opts?)   // unchanged; opts.start selects the start sentence
                           // (used by click-to-read seek)
      stop()/pause()       // unchanged; must additionally emit a "no active
                           // sentence" signal so the app clears the highlight
    tts.js NEVER walks the post DOM; it emits sentence indices and the app
    maps them to nodes.

### Modified: apps/blog/assets/js/app.js

    - gatherReadableText() ALSO builds the ordered list of READABLE SENTENCE
      SOURCES — i.e. the mapping from "sentence N of the spoken text" back to
      the DOM node that produced it. The X-2 single-source text rule is
      UNCHANGED: title + <p>/<blockquote> prose in .post-content, skipping
      pre/code/.embed-container/figure/table. The sentence list tts.js speaks
      must correspond 1:1 to this list.
    - renderPost: after render, install a delegated click handler on
      .post-content so a click on a readable node starts reading from that
      node's first sentence (seek). The handler MUST ignore clicks on <a>.
    - a highlight controller: when tts.js reports sentence N, add the active
      class to that node and remove it from the previous one; clear on stop.
    - renderList / handleRouteChange: unchanged contracts (disable all;
      stop-first). stop() must also clear the highlight.

### Modified: apps/blog/assets/css/style.css

    ONE additive, new-class-only block for the reader highlight (e.g.
    .tts-sentence--active) reusing tokens (accent/surface), plus an optional
    hover affordance for click-to-read. Respect prefers-reduced-motion. Edits
    NO existing block.

## Files to Create

- apps/blog/tools/milestones/TTS2.md (this file)
- apps/blog/HANDOFF-TTS2.md

## Files to Modify

- apps/blog/assets/js/tts.js (per-sentence progress signal + highlight surface)
- apps/blog/assets/js/app.js (sentence<->DOM mapping; delegated click-to-read; highlight wiring)
- apps/blog/assets/css/style.css (ONE additive reader-highlight block)
- apps/blog/tools/ROADMAP.md (TTS2 -> Done; Next advances)
- apps/blog/HANDOFF-CURRENT.txt (pointer -> HANDOFF-TTS2.md)

## Files I will NOT touch

- apps/blog/tools/import-post.js (seam frozen through D-Tool-29)
- apps/blog/content/\*_/_.json
- apps/blog/assets/data/feed.json
- apps/blog/assets/js/renderer.js
- apps/blog/assets/js/router.js, nav.js, shell.js, theme.js
- apps/blog/tools/{generate-index,hash-state,test-integrity}.js
- apps/blog/tools/{CONTEXT.md,LOCKED_DECISIONS.txt}
- apps/blog/tools/milestones/11.md

## Decisions frozen for this milestone

- (to be frozen here) The highlight is driven by a per-sentence PROGRESS signal
  emitted by tts.js; the SENTENCE<->DOM mapping is produced by app.js (single
  source of the readable-text rule, X-2) — tts.js never walks the DOM.
- (to be frozen here) The sentence list tts.js speaks and app.js's
  sentence->node list MUST stay in 1:1 correspondence; both use the SAME
  sentence-splitting rule (the splitSentences() rule delivered in TTS).
- (to be frozen here) Click-to-read seeks to the clicked node's FIRST spoken
  sentence; clicks on <a> (links) and on skipped regions are ignored.
- (to be frozen here) Highlight is presentation only (an additive CSS class);
  the X-3 disabled-state contract and the list-view inert contract are
  UNCHANGED, and the highlight is cleared on stop/end/route change.
- (to be frozen here) No reading-position persistence across reloads; no
  per-block skip UI. Both are explicit non-goals.

## Test Checklist

1. `node --check apps/blog/assets/js/tts.js` -> exit 0.
2. `node --check apps/blog/assets/js/app.js` -> exit 0.
3. `node apps/blog/tools/test-integrity.js` -> INTEGRITY OK.
4. Browser (post view): Play reads sentence-by-sentence; the active sentence is
   highlighted and advances; Pause stops and the highlight freezes; Resume
   continues the SAME sentence (offset-accurate per TTS).
5. Browser: clicking a mid-post sentence starts reading from that sentence (and
   its highlight becomes active); clicking a link still navigates.
6. Browser (list view): all transport buttons inert; no highlight.
7. Browser: route change (post->post, post->list) stops speech and clears the
   highlight first (no overlap, no stale highlight).
8. Browser: with speechSynthesis stubbed absent, the app loads, buttons inert,
   no highlight, no console crash.
9. `node apps/blog/tools/hash-state.js` -> capture FILE_TREE_SHA256.
10. `git status --porcelain` -> exactly TTS2's file set.

## Known issues the next chat must NOT mistake for bugs

- Sentence boundary detection is heuristic (TTS's splitSentences()); it may
  split after abbreviations like "Dr.". Documented, not a bug. CRITICAL: app.js's
  sentence->node mapping must use the same rule, or indices desync.
- `onboundary`-based word tracking is engine-dependent (Chrome desktop emits
  it). Highlight tracks SENTENCES (not words), so it is engine-independent.
- The list view stays inert (X-6), not a regression.
- TTS2 reads the CURRENT view only; it is not a full-document/PDF reader and
  has no per-block skip UI.

## IDE File Path Rules (CRITICAL FOR CONTINUE)

- Paths are relative to the workspace root (`zabon/`).
- CORRECT: `apps/blog/assets/js/tts.js`
- INCORRECT: `zabon/apps/blog/assets/js/tts.js`
