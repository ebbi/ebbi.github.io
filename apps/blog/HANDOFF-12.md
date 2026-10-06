HANDOFF — Chat 12: TTS Player Controls (speed, pitch, voice) + on-toolbar Language & Font icons
Status: not started (milestone file AUTHORED; no code written; design APPROVED)
Current chat id: 12
Current milestone: 12
Completed milestones: 00,01,02,03,04,05a,05a-fix,05b-removal,W1,W1-fix,06,06b,07,08,09,C1a,C1-tool,C1-tool-p2,C1-model,C1-tool-cleanup,B1a,C1b-01..C1b-DONE,C1b-18,C1b-12..C1b-17,B1,10b,07b,TTS,TTS2,07d,07c,10c,11a,11b-a,11b-b(partial: fa 23/26)
Next chat id: 12 (this milestone), then 11b-b (finish fa 3 slugs, then th, then ar — after quota reset)
Context windows used: 0 (this is the OPENING handoff for chat 12)

## WHAT THIS CHAT MUST DO (read milestones/12.md FIRST — it is the spec)

Implement **Milestone 12** exactly as specified in
`apps/blog/tools/milestones/12.md`. That file is the single source of the
scope fence, interfaces, decisions (D-12-1..D-12-8), and test checklist.
DESIGN IS ALREADY APPROVED (option 1A + pitch option 2); do not re-litigate.

Approve via the SCOPE CONFIRMATION block in tools/CONTEXT.md before generating.

## APPROVED DESIGN (do not change without asking)

- Toolbar layout (1A): the bottom transport bar shows, after Play/Pause/Stop:
  a ⚙ SETTINGS toggle (#tts-settings-btn -> popover #tts-settings holding
  SPEED + PITCH + VOICE controls + a "Test voice" button), then a
  LANGUAGE icon (#tts-lang-btn, same language set as the drawer switcher),
  then a FONT icon (#tts-font-btn, cycles Default/Traditional/Modern).
- Speed: 5 named steps (Slower 0.6 / Slow 0.8 / Normal 1.0 / Fast 1.25 /
  Faster 1.6) PLUS a 0.5–2.0 slider that snaps to a named step.
- Pitch: "Natural pitch" AUTO heuristic DEFAULT ON (small upward compensation
  for |rate-1|) + a manual override slider (0.5–1.5). Documented as a
  heuristic, NOT an engine-quality claim.
- Voice: filter getVoices() by the CURRENT route language prefix; rank by a
  DOCUMENTED heuristic (localService, curated name markers, default flag,
  regional specificity); auto-select the top; remember the choice PER LANGUAGE.
  Handle the async `voiceschanged` empty-list case.

## PLANNED FILE SET (from 12.md)

Create:
- apps/blog/assets/js/speech-settings.js  <-- NOT YET WRITTEN
- apps/blog/HANDOFF-12.md (this file; will carry the COMMIT RECORD at close)
Modify (ADDITIVE only):
- apps/blog/index.html (toolbar popover + lang/font icons; load speech-settings.js)
- apps/blog/assets/js/tts.js (read rate/pitch/voice at utterance build — guarded)
- apps/blog/assets/js/app.js (guarded BlogSpeech.init; wire lang/font icons; set lang on route change)
- apps/blog/assets/css/style.css (ONE additive Milestone-12 block)
- apps/blog/tools/ROADMAP.md (12 -> Done; Next advances)
- apps/blog/HANDOFF-CURRENT.txt (pointer -> HANDOFF-12.md)  <-- DONE in the 11b chat

Do NOT touch: import-post.js (seam frozen), content/**, feed.json, renderer.js,
router.js, nav.js/font.js/theme.js (DELEGATE via public APIs), the
generate-index/hash-state/test-integrity tools, LOCKED_DECISIONS.txt, CONTEXT.md.

## KEY FILES TO READ (with @)

- apps/blog/assets/js/tts.js        (the engine; makeUtterance() is the hook)
- apps/blog/assets/js/app.js        (guarded init + route wiring)
- apps/blog/index.html              (the bottom toolbar markup)
- apps/blog/assets/js/font.js       (BlogFont.get/set — cycleFont delegates here)
- apps/blog/assets/js/nav.js        (language set + buildLangHref semantics)
- apps/blog/assets/css/style.css    (add the ONE new block at the end)
- apps/blog/tools/milestones/12.md  (THE SPEC)

## IMPLEMENTATION NOTES / PATTERNS TO MIRROR

- Storage: ONE localStorage key per pref (theme.js/font.js pattern):
  "zabon-blog-tts-rate", "zabon-blog-tts-pitch", "zabon-blog-tts-pitch-mode",
  "zabon-blog-tts-voice" (JSON map lang->voiceURI).
- Guarded init in app.js DOMContentLoaded, mirroring BlogNav/BlogShell/
  BlogTheme/BlogFont. app.js passes the current route language to BlogSpeech
  (setLang) on init + every route change.
- tts.js makeUtterance() must read BlogSpeech GUARDED so behavior is
  byte-identical when BlogSpeech is absent: u.rate = getRate(), u.pitch =
  effectivePitch(rate), u.voice = resolvedVoice(lang) || existing fallback.
  The chunked engine is unchanged: settings apply at the NEXT sentence.
- a11y: real <button>s with aria-label; popover uses aria-expanded/
  aria-controls + the `hidden` attribute (10b convention); native select/inputs;
  reduced-motion guard for any animation.
- Single source: the language ICON reuses nav.js's href rule (do not fork URL
  building); the FONT icon calls BlogFont.set (font.js stays the owner).

## STATE ON DISK (verified before this handoff)

- 11b work COMMITTED: a1a5b82 (11b-a), b3d4d25 (11b-b partial: fa 23/26 +
  feed.json 51 entries), 16a1840 (docs). Predecessor 11a = 255db62.
- Git tree: CLEAN except a stray non-printable-named repo-root file
  (NOT milestone work; exclude / delete with:
  find "$(git rev-parse --show-toplevel)" -maxdepth 1 -type f -size 0 -delete).
- test-integrity: INTEGRITY OK.

## DEVIATIONS

- None yet (no code written).

## OPEN WARNINGS (carried)

1. tools/*.md whitespace may not survive chat copy; anchor edits from `cat -A`.
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
