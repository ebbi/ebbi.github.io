HANDOFF — Chat 11-ui-i18n: Translate the UI chrome (drawer, toolbars, settings popover, view labels)
Status: DONE (browser-verified)
Current chat id: 11-ui-i18n
Current milestone: 11-ui-i18n (MISSING-FEATURE; no prior chrome i18n existed)
Completed milestones: 00..12 (see ROADMAP "Done") INCLUDING 10c, 11a,
11-language-persist, 11b-a, 11b-b (PARTIAL, quota-blocked), 12, and this
11-ui-i18n.
Next chat id: 11b-b (translation batch) — HUMAN-GATED + QUOTA-BLOCKED;
check `node apps/blog/tools/translate.js --usage` before resuming it.
Context windows used: 1

## WHAT THIS MILESTONE DID

Translated every USER-VISIBLE chrome string into the CURRENT route language
(en/fa/th/ar), with EN fallback. Post BODIES are NOT touched (that is 11b-b).
See tools/milestones/11-ui-i18n.md.

- NEW module: apps/blog/assets/js/i18n.js — window.BlogI18n = { t(key, lang?),
  lang (live getter), setLang(code), apply(root, lang?), onChange(cb) }.
  - DICTIONARY { en, fa, th, ar }, keyed by stable namespaced keys
    (settings._ / speed._ / drawer._ / theme._ / font._ / toolbar._ / view._ /
    menu._ / lang._ / brand._). en = source of truth; 44 keys. t() resolves
    lang -> en -> the raw KEY (a missing translation is VISIBLE, never blank).
  - apply(root) walks `[data-i18n]` (textContent) and `[data-i18n-aria]` (the
    NAMED attribute; its key comes from the sibling `data-i18n-key`).
  - No parse-time side effect; loaded in <head> AFTER lang.js (sibling
    pre-controller head module), so window.BlogI18n exists before app.js runs.
- index.html: `data-i18n` / `data-i18n-aria` / `data-i18n-key` added to the
  drawer (dialog aria, "Menu", close, Language/Theme/Font section labels +
  aria, Light/Dark/Auto, Default/Traditional/Modern), the bottom toolbar
  (transport group aria + Play/Pause/Stop, gear/settings, language button +
  listbox aria, font cycle), the settings popover (Speed/Fine/Pitch/Natural
  pitch/Manual/Voice/Default voice/Test voice + the speed-step options + the
  range aria-labels), the header hamburger aria, AND the toolbar brand
  (`data-i18n="brand.title"`). The language OPTION labels stay ENDONYMS
  (English/فارسی/العربية/ไทย), untranslated (D-11i-3).
- app.js: handleRouteChange now calls BlogI18n.setLang(route.lang) BEFORE the
  view render + BlogI18n.apply(document) AFTER syncSpeechForRoute. A guarded
  t() helper localizes the JS-built view strings: 404 ("view.postNotFound" /
  "view.backToHome"), no-posts ("view.noPosts" / "view.tryAnotherLanguage"),
  load error ("view.loadError"), AND the list-panel blog title
  ("brand.blogTitle" = "Two Legs Bad").
- speech-settings.js: a guarded tr() helper localizes its DYNAMIC strings (voice
  option labels "settings.defaultVoice"/"settings.voiceUnavailable", the
  "speed.custom" rate label, the "lang.aria" language-button aria); a
  BlogI18n.onChange listener re-runs mirrorRate/mirrorLangButton/populateVoices
  on language change.
- tts.js: UNCHANGED (byte-identical) — it sets no aria/text strings from JS.

## HUMAN-REQUESTED ADDITIONS DURING THE CHAT

The human asked (in-browser) to ALSO localize two strings that the initial
recon had scoped as proper nouns:

1. The toolbar BRAND "Zabon Blog" -> key brand.title (data-i18n on the <a>).
2. The list-panel blog title "Two Legs Bad" -> key brand.blogTitle (JS-built in
   renderList via the guarded t()).
   Both ARE translated in all four languages (D-11i-7). "Two Legs Bad" had been
   listed in the milestone stub as "likely NOT translated"; the human superseded
   that.

## BUG FOUND + FIXED DURING THE CHAT (derived F-11i-1 / D-11i-8)

Reported: app start with stored fa rendered the page in fa but the list title
in EN; switching to EN showed the page in EN but the title in fa. ROOT CAUSE:
renderList/renderPost read BlogI18n.t() at BUILD time, but the first cut called
BlogI18n.setLang(route.lang) AFTER the view render in handleRouteChange — so
the freshly rendered view always lagged one language behind. FIX: setLang now
runs BEFORE the render; apply(document) (fixed chrome) still runs AFTER
syncSpeechForRoute. A dedicated ordering assertion was added to the smoke
harness (title built after setLang matches the route language).

## TEST RESULTS

Automated (all green):

- node --check on i18n.js, app.js, speech-settings.js -> exit 0.
- test-integrity.js -> INTEGRITY OK.
- tools/i18n-smoke.js -> 28/28 PASS (t() en->key fallback; explicit-lang lookup;
  unknown lang -> en; apply() textContent + named attr; aria node without key is
  ignored; onChange immediate + on setLang; throwing listener is safe; 44-key
  parity across 4 languages; odd-input safety; the setLang-before-render
  ORDERING contract).
- tools/m12-smoke.js -> 24/24 PASS (speech-settings byte-identical when
  BlogI18n absent).

Browser (human-verified): switch en/fa/th/ar -> the Settings popover, the
drawer labels, the toolbar labels, the brand AND the list-panel title all change
to the route language; switching back -> EN; the TTS Voice list STILL follows
the language; aria-labels localized; no console errors.

## FROZEN DECISIONS (D-11i-1..8)

- D-11i-1: dictionary shape + key naming; en is the source; missing key falls
  back to en then to the raw key (never blank).
- D-11i-2: markup strategy — data-i18n (+ data-i18n-aria / data-i18n-key) on
  fixed index.html nodes; JS-built strings read BlogI18n.t() at build time.
- D-11i-3: endonyms (English/فارسی/ไทย/العربية) are NOT translated.
- D-11i-4: applied on every route change; setLang BEFORE the view render (see
  D-11i-8), apply(document) AFTER; onChange re-localizes JS-built strings.
- D-11i-5: graceful degradation — absent BlogI18n or an unknown lang leaves EN
  chrome fully functional; all call sites guarded.
- D-11i-6: no i18n leakage into the seam/content/feed.json/renderer; guarded
  reads everywhere (tts/speech-settings behave byte-identically when absent).
- D-11i-7 (human-requested): the toolbar BRAND "Zabon Blog" (brand.title) AND
  the list-panel title "Two Legs Bad" (brand.blogTitle) ARE translated.
- D-11i-8 (ORDERING bug fix): setLang MUST precede the view render because the
  JS-built view strings read t() at build time; reversing the order made the
  view lag one language behind.

## FILES (exact paths)

Created:

- apps/blog/assets/js/i18n.js
- apps/blog/tools/i18n-smoke.js
- apps/blog/HANDOFF-11-ui-i18n.md (this file)

Modified:

- apps/blog/index.html (data-i18n/-aria/-key on chrome; load i18n.js in <head>)
- apps/blog/assets/js/app.js (setLang-before-render + apply(document); guarded
  t() for the 404 / no-posts / load-error / blogTitle strings)
- apps/blog/assets/js/speech-settings.js (guarded tr() for dynamic strings +
  BlogI18n.onChange re-localization)
- apps/blog/tools/milestones/11-ui-i18n.md (Interfaces/Decisions/Tests → DONE)
- apps/blog/tools/LOCKED_DECISIONS.txt (appended D-11i-1..8 summary)
- apps/blog/tools/ROADMAP.md (11-ui-i18n recorded DONE)
- apps/blog/HANDOFF-CURRENT.txt (pointer -> HANDOFF-11-ui-i18n.md)

NOT touched (byte-identical): router.js, renderer.js, nav.js, shell.js,
theme.js, font.js, lang.js, tts.js, assets/css/style.css, content/\*\*,
assets/data/feed.json, import-post.js (seam frozen D-Tool-29),
tools/{hash-state,test-integrity,generate-index,localize-images}.js,
tools/CONTEXT.md.

## KNOWN ISSUES / NOTES FOR THE NEXT CHAT

- 11b-b (CONTENT translation) is SEPARATE and still QUOTA-BLOCKED; this milestone
  added NO content. Check `node apps/blog/tools/translate.js --usage` first.
- A stray 0-byte repo-root file with a non-printable name was observed untracked
  during this milestone (NOT created by this work; 0 bytes; outside apps/blog/).
  It was LEFT in place (not staged, not deleted) for the human to remove.
- L-010 (feed-excerpt HTML leak for part-22) remains deferred (unrelated).
- The language OPTION labels are intentionally endonyms; do not "translate" them.
- `hash-state.js` FILE_TREE_SHA256 must be captured AFTER staging (below is the
  pre-staging value; re-run after `git add`).

## HASH STATE (captured pre-staging; RE-RUN AFTER STAGING)

LOCKED_DECISIONS_SHA256=e9c8c02a198ec63373a71c1ecefec3a4ef2b5bc611b80ead31eef505e2e91ea4
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=bba559c16b18022717bb7e65d66c07bd908d66542ec8b9b6a6bdfe73125f7392
FILE_TREE_SHA256=b40c8ab008e45533d89d60acc829ae7977179daa6b605d34a6d1640813066444
GIT_HEAD=a5bc250ed74e11841f94e55fd2439f91a2d5677d
(SCHEMA_SHA256 omitted per Option 2.)

## OPEN WARNINGS (count + links only)

1. tools/\*.md whitespace may not survive chat copy; anchor edits from `cat -A`.
2. Edit splice pitfall: verify POSITIONALLY, not by substring.
3. FILENAME COLLISION risk: B1 vs B1a.
4. hash-state.js FILE_TREE_SHA256: capture AFTER staging.
5. STYLE.CSS write verification: re-read from disk after every write.
6. ROADMAP EDIT NO-OP: treat "no tool output" as a NO-OP; confirm with a narrow
   `grep -c`; avoid full-file re-reads of the large ROADMAP.
7. P9 HUMAN GATE: localize-images.js REFUSES a real run without `--yes`.
8. STORE PATH CONTENTION: ALWAYS keep the <YYYY>/<MM>/ segment.
9. Verify a head-module a body script depends on is PRESENT in index.html; a
   stubbed smoke cannot catch a missing <script> tag.
10. NEW: JS-BUILT strings read BlogI18n.t() at BUILD time — call setLang BEFORE
    the view render, or the view lags one language behind (this milestone's bug).
