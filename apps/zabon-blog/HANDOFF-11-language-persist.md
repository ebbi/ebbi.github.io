HANDOFF — Chat 11-language-persist: Persist language selection (localStorage + cross-view)
Status: DONE (browser-verified)
Current chat id: 11-language-persist (formerly drafted as "11c")
Current milestone: 11-language-persist
Completed milestones: 00..12 (see ROADMAP "Done") INCLUDING 10c, 11a, 11b-a,
11b-b (PARTIAL, quota-blocked), 12, and this 11-language-persist.
Next chat id: 11b-b (translation batch) — HUMAN-GATED + QUOTA-BLOCKED;
see apps/blog/translation-pending.md and translation-pending-new-chat.md.
Context windows used: 1

## WHAT THIS MILESTONE DID

Made the reader's LANGUAGE CHOICE persist (a) ACROSS SESSIONS and (b) WHILE
NAVIGATING between a post and the index. See tools/milestones/11-language-persist.md.

- NEW module: apps/blog/assets/js/lang.js — window.BlogLang = {get,set,resolve}.
  ONE localStorage key "zabon-blog-lang"; KNOWN = en/fa/th/ar; a value outside
  KNOWN is treated as unset; a storage failure -> "" on read, non-fatal no-op on
  write. theme.js/font.js pattern.
- router.js: the empty-hash default "en" was REPLACED by BlogLang.resolve("en")
  when the URL carries no language (URL is the on-load AUTHORITY, D-11c-3), and
  any route that carries a language now calls BlogLang.set(lang) (guarded,
  D-11c-2). Route vocabulary / <html lang>/dir / currentRoute / onRouteChange
  UNCHANGED.
- index.html: lang.js loaded in <head> (NOT deferred) AFTER font.js; the header
  brand link changed from "#/en" to the language-neutral "#/" (D-11c-4).

## DEFECT FIX (same milestone): multi-language series ORDER (D-11c-7)

Found in-browser AFTER the persistence fix: `#/` (EN) showed the series in
correct READING order, but switching to fa showed the index REVERSED.
ROOT CAUSE: generate-index.js gated seriesOrder to `lang === "en"`, so every
non-EN entry had seriesOrder=null and fell into renderList's date-desc `rest`
bucket (reverse of reading order). FIX: seriesOrder is a property of the POST
(language-agnostic slug), so it is now assigned for ANY language in the map
(`Object.hasOwn(seriesOrderMap, slug) ? seriesOrderMap[slug] : null`). app.js
UNCHANGED (its existing series.sort covers all languages). feed.json
regenerated: 0 EN changes (byte-identical), 22 non-EN null->integer, 0 other;
51 entries; EN order [1..23]; fa order now ascending (its 3 untranslated slugs
1/2/13 simply absent); INTEGRITY OK; generate-index.js --check OK.

## IMPLEMENTATION BUG FOUND + FIXED DURING THE CHAT (important)

The first cut left `lang.js` OUT of index.html's <head> (the <script> tag did
not land), so window.BlogLang was undefined at runtime and the router silently
fell back to "en". Browser tests 1 (cross-session) and 2 (cross-view) FAILED;
test 3 (explicit #/ar) passed. FIX: added
`<script src="assets/js/lang.js"></script>` to <head> after font.js and before
the body scripts. Re-tested in-browser — ALL PASS.

LESSON (carried): a head-module that a body script depends on MUST be verified
PRESENT in index.html, not just `node --check`-clean; the structural smoke stubs
window.BlogLang, so it CANNOT catch a MISSING <script> tag.

## TEST RESULTS (human, in-browser) — ALL PASS

1. Switch to فارسی (#/fa) -> localStorage["zabon-blog-lang"]==="fa"; strip the
   hash + reload -> opens in Persian (RTL). PASS.
2. From the Persian index, open a post, click the "Zabon Blog" brand -> returns
   to the Persian index. PASS.
3. With stored fa, open #/ar -> opens in Arabic (URL overrides; store follows). PASS.
4. No regression (EN list/post, switcher, fa/ar RTL, theme/font/TTS, no console
   errors); private-mode / storage-blocked still fully works (no memory). PASS.

Automated: node --check lang.js + router.js -> exit 0; test-integrity
INTEGRITY OK; 14/14 structural smoke PASS (bare URL + stored fa -> fa; explicit
#/en beats stored fa -> en + persists; #/ar persists; post route persists; "#/"
resolves stored fa; unknown stored value -> en; no stored value -> en; storage
failure -> en non-fatal; BlogLang absent -> en default).

## FROZEN DECISIONS (D-11c-1..7)

- D-11c-1: ONE localStorage key "zabon-blog-lang"; value in {en,fa,th,ar};
  unknown/absent -> unset.
- D-11c-2: router.js is the ONLY reader/writer of the key (consults resolve()
  when the URL is silent; writes set() when a route carries a language).
- D-11c-3: the URL is the on-load AUTHORITY (explicit #/<lang>/... wins for the
  visit); the store only fills the GAP when the URL is silent.
- D-11c-4: the header brand link is language-NEUTRAL ("#/"); no longer forces EN.
- D-11c-5: BlogLang degrades gracefully (private mode -> "" / no-op; router
  keeps the "en" default).
- D-11c-6: NO new route event, NO route-vocabulary change, NO RTL change, NO
  render change. Persistence only.
- D-11c-7 (defect fix; extends C1b-18): seriesOrder is derived from the
  language-agnostic slug and assigned to EVERY language that carries the
  series (not EN-only). Reading order is identical across languages; EN output
  UNCHANGED. NO change to app.js, the seam, content, renderer, router, nav, or
  CSS. The ONLY generator change.

## FILES (exact paths)

Created:

- apps/blog/assets/js/lang.js
- apps/blog/tools/milestones/11-language-persist.md (renamed from 11c.md)
- apps/blog/translation-pending.md
- apps/blog/translation-pending-new-chat.md
- apps/blog/HANDOFF-11-language-persist.md (this file)

Modified:

- apps/blog/assets/js/router.js (language resolve + persist; language branch ONLY)
- apps/blog/index.html (load lang.js in <head>; brand href "#/en" -> "#/")
- apps/blog/tools/generate-index.js (DEFECT FIX D-11c-7: seriesOrder for ALL
  languages, not EN-only)
- apps/blog/assets/data/feed.json (regenerated: non-EN seriesOrder -> integer)
- apps/blog/tools/ROADMAP.md (11-language-persist recorded DONE; Next unchanged)
- apps/blog/HANDOFF-CURRENT.txt (pointer -> HANDOFF-11-language-persist.md)

DELETED (housekeeping, human-approved): ALL completed HANDOFF-_.md files
(HANDOFF-01 .. HANDOFF-C1b-DONE, HANDOFF-TTS_, HANDOFF-W1\*, HANDOFF-11a/11b,
HANDOFF-12, etc.). The history is preserved in git; ROADMAP + milestone files
remain the authority. HANDOFF-CURRENT.txt is RETAINED (it is the live pointer).

NOT touched: import-post.js (seam frozen through D-Tool-29), content/\*\*,
renderer.js, nav.js, app.js (its existing series.sort covers every language),
shell.js, theme.js, font.js, tts.js, speech-settings.js, style.css,
tools/{hash-state,test-integrity}.js, tools/{CONTEXT.md,LOCKED_DECISIONS.txt}.
(NOTE: generate-index.js + feed.json ARE modified — the D-11c-7 defect fix.)

## KNOWN ISSUES / NOTES FOR THE NEXT CHAT

- 11b-b (translation) is SEPARATE and still QUOTA-BLOCKED; this milestone added
  NO content and does not depend on it. A language with partial content (fa
  23/26, th/ar 1) still routes/renders with the EN fallback (D3) — intended.
- The store is a reader PREFERENCE (never committed); nothing is written to disk.
- The brand link target "#/" is INTENTIONAL; do not "fix" it back to "#/en".
- The stray 0-byte repo-root file with a non-printable name was DELETED
  (housekeeping; not milestone work).
- L-010 (feed-excerpt HTML leak for part-22) remains deferred. C1b-18 ordering
  (+ 10b/10c presentation) is INTACT and now EXTENDED to every language by the
  D-11c-7 defect fix; EN ordering is byte-identical.

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
9. NEW: verify a head-module a body script depends on is PRESENT in index.html
   (this milestone's lesson); a stubbed smoke cannot catch a missing <script>.
