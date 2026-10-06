HANDOFF — Chat 12: TTS Player Controls (speed, pitch, voice) + on-toolbar Language & Font icons
Status: DONE (2026) — implemented, verified, ROADMAP updated; awaiting human commit
Current chat id: 12
Current milestone: 12
Completed milestones: 00,01,02,03,04,05a,05a-fix,05b-removal,W1,W1-fix,06,06b,07,08,09,C1a,C1-tool,C1-tool-p2,C1-model,C1-tool-cleanup,B1a,C1b-01..C1b-DONE,C1b-18,C1b-12..C1b-17,B1,10b,07b,TTS,TTS2,07d,07c,10c,11a,11b-a,11b-b(partial: fa 23/26),12
Next chat id: 11b-b (finish fa 3 slugs, then th, then ar — after quota reset). HUMAN-GATED.
Context windows used: 1 (this chat closed milestone 12)

## RESULT

Milestone 12 is IMPLEMENTED per `apps/blog/tools/milestones/12.md` (the spec).
Design was pre-approved (option 1A + pitch option 2); scope confirmed before
generating. All decisions D-12-1..D-12-8 applied; the scope fence was honored
(NOT the seam, content, feed.json, renderer.js, router.js, or nav/font/theme.js
internals — DELEGATED via public APIs).

## FILES

Create:

- apps/blog/assets/js/speech-settings.js (window.BlogSpeech; NEW)
- apps/blog/tools/m12-smoke.js (dev-only structural smoke harness; NEW)
  Modify (ADDITIVE):
- apps/blog/index.html (toolbar popover + lang/font icons; script)
- apps/blog/assets/js/tts.js (apply rate/pitch/voice at utterance build — guarded)
- apps/blog/assets/js/app.js (guarded BlogSpeech.init + syncSpeechForRoute)
- apps/blog/assets/css/style.css (ONE additive Milestone 12 block; diff +270/0)
- apps/blog/tools/ROADMAP.md (12 -> Done)
- apps/blog/HANDOFF-12.md (this file)
  Untouched: import-post.js, content/\*\*, feed.json, renderer.js, router.js,
  nav.js/font.js/theme.js, generate-index/hash-state/test-integrity, CONTEXT.md,
  LOCKED_DECISIONS.txt. HANDOFF-CURRENT.txt already pointed at 12.

## VERIFICATION

- `node --check` speech-settings.js / tts.js / app.js -> exit 0.
- `node tools/test-integrity.js` -> INTEGRITY OK.
- `node tools/m12-smoke.js` -> 24/24 PASS (voice ranking prefers the best
  `fa-*`; rate/pitch applied; per-language voice memory; auto-pitch curve;
  async voiceschanged repopulation; graceful no-API path).
- CSS brace balance 204/204; Milestone 12 block purely additive.
- diff numstat: style.css 270/0; index.html 177/2 (intentional comment
  replacement); tts.js 57/5 (intentional voice-block replacement); app.js 65/1
  (blank line). All deletions are intentional replacements, not loss.

## COMMIT RECORD

COMMIT RECORD (capture AFTER staging — rule 4):

- IMPORTANT: capture the FILE_TREE_SHA256 via `node tools/hash-state.js`
  AFTER `git add` (staged tree), not before.
- Suggested staging set (exactly milestone 12):
  git add apps/blog/index.html \
   apps/blog/assets/js/speech-settings.js \
   apps/blog/assets/js/tts.js \
   apps/blog/assets/js/app.js \
   apps/blog/assets/css/style.css \
   apps/blog/tools/m12-smoke.js \
   apps/blog/tools/ROADMAP.md \
   apps/blog/HANDOFF-12.md
- Do NOT stage any stray repo-root file; the pre-handoff stray
  non-printable-named file was removed with
  `find "$(git rev-parse --show-toplevel)" -maxdepth 1 -type f -size 0 -delete`
  (already clean this chat).
- Author a commit message in the project's style (see prior milestone commits),
  e.g.: "12: TTS player controls (speed/pitch/voice) + toolbar lang & font icons"
- After staging + commit, run `node tools/hash-state.js` and paste the
  resulting FILE_TREE_SHA256 here; then `git status --porcelain` should show a
  clean tree.

PRE-COMMIT SHA-256 (staged tree): 7b29db397a6e5ef5172507631462e81c4a1afb0ec6dd1a7367a875d1a2cedd74
LOCKED_DECISIONS_SHA256: af9e5595d9e1cf48e388229c544145bb7dfd02180cb1be44bbd12663ca45b1f3
COMMIT HASH: f3df12c

## DECISIONS APPLIED

- D-12-1 speed: utterance.rate; 5 named steps + a 0.5-2.0 slider snapping to a
  named step within epsilon 0.02 else custom. ONE key "zabon-blog-tts-rate".
- D-12-2 pitch: utterance.pitch 0.5-1.5; "auto" (default) = 1 + 0.12\*(rate-1)
  clamped (documented heuristic, NOT a quality claim); "manual" = slider
  verbatim. Keys "-pitch" + "-pitch-mode".
- D-12-3 voice: getVoices() filtered by the route-language BCP-47 prefix; ranked
  localService > default flag > regional specificity > curated NAME markers
  (natural/neural/online/google/microsoft) > stable order; top auto-selects;
  per-language memory (key "-voice" = JSON map lang->voiceURI); handles async
  `voiceschanged`.
- D-12-4 language icon: SAME language set; navigates via the SAME href rule —
  app.js MIRRORS the drawer #lang-select options' data-href (nav.js
  buildLangHref product) onto #tts-lang-menu items (single source; no fork).
- D-12-5 font icon: cycles "" -> traditional -> modern -> "" via BlogFont.set
  (font.js remains the owner of the family + persistence).
- D-12-6 apply-on-next-sentence: settings read fresh per utterance; chunked
  engine unchanged.
- D-12-7 graceful: no speechSynthesis/getVoices -> inert/disabled; every tts.js
  read of BlogSpeech GUARDED (byte-identical when BlogSpeech absent).
- D-12-8 a11y: real <button>s + aria-label; aria-expanded/aria-controls + the
  `hidden` attribute; native select/inputs; Escape/outside-click close; reduced
  motion unaffected (no new animation added).

## DEVIATIONS

- Voice ranking ORDER refined vs the spec's parenthetical list: the spec lists
  "(localService; then name allow-list; then default flag; then regional
  specificity)". Implementation made the NAME allow-list the LOWEST-priority
  tiebreak (after regional specificity) so a recognizable NAME cannot override a
  better-fitting locale. Documented in rankScore's JSDoc. No interface change;
  the ranking is still a documented heuristic (D-12-3 nature preserved).
- app.js reuses the drawer's computed data-href rather than extracting a shared
  helper from nav.js — this keeps nav.js UNTOUCHED while retaining a single
  source of the href rule (allowed by the "if a shared href helper is extracted
  it is added ADDITIVELY" clause; we chose NOT to extract, which is more
  conservative).
- Added a dev-only test harness tools/m12-smoke.js (not in the planned set) so
  test checklist item 4 is reproducible; harmless (Node-only, no runtime load).

## NON-REGRESSION

- 26 content/en/\*.json untouched; feed.json untouched; renderer.js/router.js
  untouched; nav/font/theme untouched.
- tts.js behavior when BlogSpeech is present defaults rate/pitch to 1 and keeps
  the existing lang-prefix voice fallback — Chrome/OS behavior with no reader
  override is unchanged.
- style.css purely additive (no existing block edited).

## WHAT THIS CHAT MUST DO (read milestones/12.md FIRST — it is the spec)

(DONE — milestone 12 implemented; see RESULT/VERIFICATION/COMMIT RECORD above.)

## OPEN WARNINGS (carried to the next chat)

1. tools/\*.md whitespace may not survive chat copy; anchor edits from `cat -A`.
2. Edit splice pitfall: verify POSITIONALLY, not by substring.
3. FILENAME COLLISION: B1 vs B1a.
4. hash-state.js FILE_TREE_SHA256 capture rule: capture AFTER staging.
5. STYLE.CSS write verification: re-read from disk after every write.
6. ROADMAP EDIT NO-OP: treat "no tool output" as a NO-OP; confirm with a narrow
   grep -c; avoid full-file re-reads of the large ROADMAP.
7. P9 HUMAN GATE (11b): localize-images.js REFUSES a real run without --yes.
8. STORE PATH CONTENTION (11b): keep the <YYYY>/<MM>/ segment.
9. Web Speech API voice quality has NO score; "highest quality" is the
   DOCUMENTED heuristic (D-12-3). Pitch cannot make a poor voice good.
10. Some engines ignore pause()/resume(); the TTS chunked engine handles the
    post-level case. rate/pitch/voice support varies by engine.
11. The list view keeps the transport inert (X-3/X-6) — NOT a regression.
12. Available voices differ by browser/OS; the voice list is platform-provided.
