# Milestone TTS: Text-to-speech on the bottom toolbar (Play / Pause / Stop)

## Scope fence (read first)

This milestone makes the bottom-toolbar transport buttons (Play / Pause /
Stop), present since 07 but shipped inert (S-4), ACTUALLY drive text-to-speech
of the CURRENT post using the Web Speech API (`speechSynthesis`). It touches
`index.html` (enable the buttons; add the script), one new JS module
(`assets/js/tts.js`), `app.js` (guarded init + feed the current post's text to
TTS), `assets/css/style.css` (only additive state classes, e.g. a "speaking"
state on the buttons), the ROADMAP, and the CURRENT pointer. It does NOT touch
the extraction seam (`tools/import-post.js`, frozen through D-Tool-29), any
`content/**/*.json`, `feed.json`, `renderer.js` block mappings, `router.js`,
`generate-index.js`/`hash-state.js`/`test-integrity.js`, or the theme control
(07b). It does NOT add a server-side audio pipeline, cached audio files, or
voice assets; it uses the platform `speechSynthesis` voices present in the
browser. It does NOT change 08/09/10b/B1 classes' meaning.

## Objective

When this milestone is done:

- the Play button starts speaking the current post's readable text (headline
  + paragraph text, in document order), Pause pauses/resumes, Stop cancels and
  resets,
- the buttons reflect state: Play enabled when a post is rendered and not
  speaking; Pause enabled while speaking; Stop enabled while speaking or
  paused; all disabled / inert on the list view (nothing to read) — matching
  07's "inert until TTS" contract for non-post views,
- a route change to another post stops current speech before starting the new
  post (no overlapping utterances),
- the buttons are keyboard-accessible and have correct accessible
  names/state,
- and TTS failure (e.g. `speechSynthesis` unavailable) degrades gracefully
  (buttons stay inert, no console crash, app otherwise unaffected).

## Interfaces (mandatory — a milestone without these is not ready)

### New: apps/blog/assets/js/tts.js

    window.BlogTTS = {
      init(): void,          // wire the transport buttons; guarded, idempotent
      speak(text): void,     // start speaking the given plain text (cancels any current)
      pause(): void,         // pause the current utterance
      resume(): void,        // resume a paused utterance
      stop(): void           // cancel + reset to idle
    };
    // No route awareness inside tts.js; app.js decides WHEN to speak/stop.
    // Exposes only these methods; owns the speechSynthesis lifecycle.

### Modified: apps/blog/index.html

    Remove `disabled` from the three transport buttons; give them ids
    (play-btn / pause-btn / stop-btn) or keep class-based selection with
    stable hooks. Keep aria-labels (Play/Pause/Stop). Load tts.js after
    shell.js, before app.js.

### Modified: apps/blog/assets/js/app.js

    renderPost(route): after the body is rendered, gather the post's readable
      text (title + paragraph/quote text in order; skip code/embed) and make
      it available to TTS (e.g. window.BlogTTS.speak(text) on Play, and
      prime the pending text). On entering the POST view enable Play; on the
      LIST view disable all transport buttons. On route change AWAY from a
      post (or to a new post) call window.BlogTTS.stop() first (no overlap).
    DOMContentLoaded: call window.BlogTTS.init() once, GUARDED (mirror the
      BlogNav/BlogShell guarded-init pattern).

### Modified: apps/blog/assets/css/style.css

    Additive, new-class-only rules for the transport "speaking"/active state
    (e.g. .transport__btn--active) reusing tokens. Edits NO existing block.

## Files to Create

- apps/blog/tools/milestones/TTS.md (this file)
- apps/blog/assets/js/tts.js
- apps/blog/HANDOFF-TTS.md (authored at TTS's close)

## Files to Modify

- apps/blog/index.html (enable transport buttons; ids; script tag)
- apps/blog/assets/js/app.js (guarded BlogTTS.init(); per-view enable/disable; stop-on-route-change; provide post text)
- apps/blog/assets/css/style.css (additive transport state classes only)
- apps/blog/tools/ROADMAP.md (TTS -> Done; Next advances)
- apps/blog/HANDOFF-CURRENT.txt (pointer -> HANDOFF-TTS.md)

## Files I will NOT touch

- apps/blog/tools/import-post.js (seam frozen through D-Tool-29)
- apps/blog/content/**/*.json
- apps/blog/assets/data/feed.json
- apps/blog/assets/js/renderer.js (TTS reads the rendered DOM/text; does not
  add block types)
- apps/blog/assets/js/router.js
- apps/blog/assets/js/nav.js, shell.js, theme.js
- apps/blog/tools/{generate-index,hash-state,test-integrity}.js
- apps/blog/tools/{CONTEXT.md,LOCKED_DECISIONS.txt}

## Decisions frozen for this milestone

- X-1: Engine = the Web Speech API (`window.speechSynthesis` +
  `SpeechSynthesisUtterance`). No audio files, no server pipeline, no voice
  assets. Voices are platform-provided; language selection uses the current
  route language when a matching voice exists, else the default voice.
- X-2: Text source = the rendered post DOM (title + paragraph/quote text in
  document order), NOT a raw block walk. Rationale: single source of what the
  reader sees; avoids re-deriving text the renderer already produced. Skip
  `code`/`embed`/`table` cells if they read poorly; record the exact
  inclusion/exclusion rule in the handoff.
- X-3: Transport state contract: list view -> all three disabled; post view
  idle -> Play enabled, Pause/Stop disabled; speaking -> Pause + Stop enabled,
  Play disabled; paused -> Play(resume) + Stop enabled. The buttons' disabled
  state is the single source of transport availability.
- X-4: Route changes stop speech first (call stop() at the top of
  handleRouteChange for the post->post and post->list transitions). No
  overlapping utterances.
- X-5: Guarded init (tts.js optional; app must not break if absent or if
  speechSynthesis is unavailable).
- X-6: 07's S-4 ("transport buttons inert") is SUPERSEDED here for the post
  view; the list view keeps them inert. Recorded so the next chat does not
  treat enabled buttons as a regression.

## Test Checklist

1. `node --check apps/blog/assets/js/tts.js` -> exit 0.
2. `node apps/blog/tools/test-integrity.js` -> INTEGRITY OK.
3. Browser (post view): Play speaks the post; Pause pauses; Pause again /
   Play resumes; Stop cancels and resets; button disabled-states match X-3.
4. Browser (list view): all transport buttons disabled/inert.
5. Browser: navigating to another post mid-speech stops the old speech first
   (no overlap); navigating to the list stops speech.
6. Browser: keyboard — Tab/Enter/Space operate the buttons; no console errors.
7. Browser: with speechSynthesis stubbed absent, the app still loads and the
   buttons stay inert (graceful).
8. `node apps/blog/tools/hash-state.js` -> capture FILE_TREE_SHA256.
9. `git status --porcelain` -> exactly TTS's file set.

## Known issues the next chat must NOT mistake for bugs

- Browser/OS differences in available voices and in whether `pause()` is
  honoured (some engines only pause between utterances) are platform limits,
  not bugs; record what the test browser did.
- The list view keeping the buttons disabled is intentional (X-3/X-6), not a
  regression of "transport now works".
- TTS reads the CURRENT view's text; it is not a full-document reader and has
  no per-block skip UI (a follow-up if wanted).

## IDE File Path Rules (CRITICAL FOR CONTINUE)

- Paths are relative to the workspace root (`zabon/`).
- CORRECT: `apps/blog/assets/js/tts.js`
- INCORRECT: `zabon/apps/blog/assets/js/tts.js`
