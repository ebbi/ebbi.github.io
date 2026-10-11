# Milestone 11-language-persist: Persist language selection (localStorage + cross-view)

STATUS: DONE (2026-06, browser-verified). Split off the open 11b thread as
its own small milestone so the translation batch (11b-b) stays focused.
(Formerly drafted as "11c"; renamed to a semantic name at the human's request.)
Predecessors: 11a (pipeline + switcher), 11b-a (local images), 11b-b
(translation batch, PARTIAL — quota-blocked; see translation-pending.md),
12 (TTS player controls, DONE).

## Scope fence (read first)

This milestone makes the reader's LANGUAGE CHOICE persist. Two requirements:

1. It persists ACROSS SESSIONS: a returning visitor lands in the language they
   last chose, without having to re-pick.
2. It persists WHILE NAVIGATING between a blog post and the index page (and
   back): moving between `#/<lang>/post/<slug>` and the index does not silently
   reset the language, and the header brand/home link no longer forces EN.

It is a STATE/PERSISTENCE milestone, nothing else. It does NOT translate
anything (that is 11b-b), does NOT touch the extraction seam
(tools/import-post.js, frozen through D-Tool-29), does NOT touch content/\*\*,
feed.json, renderer.js, or the CSS. It does NOT change the route vocabulary
({ lang, type: list|post, slug, raw } stays byte-identical) nor the RTL rule.

Single-source note: the router (router.js) is the SINGLE source of route state
and of `currentRoute.lang`. The persisted language therefore belongs to ONE
new module (`assets/js/lang.js`, theme.js/font.js pattern) that the router
CONSULTS when the URL carries no language and WRITES whenever a route resolves
to a known language. No other module reads/writes the key.

## Objective

When this milestone is done: the language choice is stored under ONE
localStorage key and restored when the site is opened without a language in
the URL; switching language updates the stored value; navigating between a post
and the index preserves the chosen language; the header brand/home link returns
to the index in the CURRENT language (not a hardcoded EN); the URL remains the
on-load authority so a shared/bookmarked `#/<lang>/...` link still wins for
that visit; nothing else regresses (list/post render, switcher, RTL,
theme/font, TTS unchanged).

## MEASURED FACTS (agent, this milestone — verified, not assumed)

- router.js `handleRoute()`:
  `const hash = window.location.hash.slice(1) || "/en";`
  → with an EMPTY hash it hardcodes `en`. This is the cross-session gap: a
  returning visitor with a bare URL (no hash, or `#/`) always gets EN.
- router.js derives `lang = segments[0] || "en"` and sets `<html lang>` + `dir`
  (rtl for fa/ar). It exposes `window.BlogRouter.currentRoute = {lang,type,
slug,raw}` and calls `onRouteChange`. The route vocabulary is unchanged by
  this milestone.
- nav.js builds language hrefs (`#/<code>` or `#/<code>/post/<slug>`) via
  `buildLangHref` and assigns `location.hash` on change (the ONLY hash
  assignment in nav.js). It syncs the `<select>` from `route.lang` on every
  route change. So WITHIN a session, the switcher already navigates in-language.
- index.html header brand link is HARDCODED `<a class="brand" href="#/en">`.
  Clicking the logo therefore ALWAYS navigates to `#/en`, forcing EN — this is
  the "navigating between blogs and the index" gap #2.
- app.js renderList emits `href="#/${post.lang}/post/${post.slug}"` (language
  carried in the href) and filters by `route.lang`; renderPost falls back
  to EN when a slug has no file (D3). Both are UNCHANGED by this milestone.
- Established persistence pattern (theme.js 07b, font.js 07c,
  speech-settings.js 12): ONE localStorage key per preference ("zabon-blog-
  theme" / "-font" / "-tts-\*"), read at parse time where a flash matters, and
  a `readPref()` that tolerates private mode / storage-disabled (fall back to
  a sensible default). This milestone mirrors it exactly (key
  "zabon-blog-lang").
- Content languages present (feed.json, measured): en, fa, th, ar. nav.js
  LANGS = en/fa/th/ar. The stored value is validated against this set.

## Interfaces (mandatory — a milestone without these is not ready)

### Create: apps/blog/assets/js/lang.js (window.BlogLang)

    window.BlogLang = { get, set, resolve };
    - STORE_KEY = "zabon-blog-lang" (ONE key; theme.js/font.js pattern).
    - KNOWN = the content language codes the app ships ("en","fa","th","ar");
      any other stored value is treated as unset.
    - get(): read STORE_KEY; return the code when it is in KNOWN, else "".
      Tolerates a localStorage failure (private mode) -> "".
    - set(code): when code is in KNOWN, write STORE_KEY (no-op otherwise).
      Tolerates a storage-write failure (non-fatal; session still behaves).
    - resolve(fallbackCode): the language to USE when the URL carries none —
      get() when set, else the passed fallback (default "en"). This is the
      single "which language when nothing is in the URL" rule.
    - NO route awareness; NO hash access (router.js owns those). Loaded in
      <head> (NOT deferred) like theme.js/font.js so it CAN be consulted at
      parse time — though the router only consults it after DOMContentLoaded.

### Modified: apps/blog/assets/js/router.js

    handleRoute():
    - Parse the hash exactly as today (segments, type, slug).
    - LANGUAGE RESOLUTION (the ONLY change): when the URL carries NO explicit
      language (empty hash, "#", or "#/"), set lang = BlogLang.resolve("en")
      instead of the hardcoded "en". When the URL DOES carry a language
      (segments[0] present), that language WINS for this visit (URL is the
      on-load authority; a shared link is honoured).
    - PERSIST: after resolving lang, call BlogLang.set(lang) so the resolved
      language is remembered for the next session. Guarded: a no-op if
      BlogLang is absent (the router still works with the "en" default).
    - `<html lang>` + `dir` logic, currentRoute, and onRouteChange/emit are
      UNCHANGED. Route vocabulary UNCHANGED. No new event type.

### Modified: apps/blog/index.html

    - Load <script src="assets/js/lang.js"></script> in <head> (NOT deferred),
      BEFORE the router.js script tag, mirroring theme.js/font.js. (lang.js
      has no parse-time side effect; the head placement documents the shared
      "pre-controller module" contract and matches the sibling modules.)
    - The header brand link: change `href="#/en"` to a language-NEUTRAL target
      `href="#/"` so clicking the logo returns to the index in the CURRENT
      language (the router then resolves `#/` to the persisted/current
      language). This is the ONLY markup change.

### NOT modified

    nav.js (already in-language), app.js (list/post already carry route.lang),
    renderer.js, shell.js, theme.js, font.js, tts.js, speech-settings.js,
    assets/css/style.css, tools/import-post.js, content/**, feed.json,
    tools/{generate-index,hash-state,test-integrity}.js,
    tools/{CONTEXT.md,LOCKED_DECISIONS.txt}.

## Files to Create

- apps/blog/assets/js/lang.js (window.BlogLang; the single persistent-language owner)
- apps/blog/tools/milestones/11-language-persist.md (this file; was 11c.md)
- apps/blog/HANDOFF-11-language-persist.md (at close)
- apps/blog/translation-pending.md (+ translation-pending-new-chat.md) (batch scaffolding)

## Files to Modify

- apps/blog/assets/js/router.js (resolve-from-store when URL has no lang +
  persist-on-route; language branch ONLY)
- apps/blog/index.html (load lang.js in <head>; brand href `#/en` -> `#/`)
- apps/blog/tools/generate-index.js (DEFECT FIX D-11c-7: seriesOrder for ALL
  languages, not EN-only)
- apps/blog/assets/data/feed.json (regenerated: non-EN seriesOrder now integer)
- apps/blog/tools/ROADMAP.md (record 11-language-persist; Next advances)
- apps/blog/HANDOFF-CURRENT.txt (pointer -> HANDOFF-11-language-persist.md)

## Files I will NOT touch

- apps/blog/tools/import-post.js (seam frozen through D-Tool-29)
- apps/blog/content/\*_/_.json
- apps/blog/assets/js/{renderer.js,nav.js,app.js,shell.js,theme.js,font.js,
  tts.js,speech-settings.js}
- apps/blog/assets/css/style.css
- apps/blog/tools/{hash-state,test-integrity}.js
- apps/blog/tools/{CONTEXT.md,LOCKED_DECISIONS.txt}
  (NOTE: generate-index.js + feed.json ARE touched — the D-11c-7 defect fix;
  app.js is NOT touched, its existing sort covers every language.)

## Decisions frozen for this milestone

- D-11c-1: ONE localStorage key "zabon-blog-lang"; value is a content-language
  code ("en"|"fa"|"th"|"ar"). Unknown/absent -> treated as unset. (theme.js/
  font.js pattern; single source.)
- D-11c-2: router.js is the ONLY writer/reader of the persisted language. It
  CONSULTS BlogLang.resolve("en") when the URL carries no language, and WRITES
  BlogLang.set(lang) whenever a route resolves. No other module touches the
  key (single source per fact).
- D-11c-3: URL is the on-load AUTHORITY. A URL that carries an explicit
  language ALWAYS wins for that visit (so shared/bookmarked `#/<lang>/...`
  links are honoured); the store only fills the GAP when the URL is silent.
- D-11c-4: the header brand/home link becomes language-NEUTRAL (`#/`) so it
  returns to the index in the CURRENT language; it no longer forces EN.
- D-11c-5: BlogLang degrades gracefully — a localStorage read/write failure
  (private mode) yields "" on read and a session-only no-op on write; the
  router's EN default keeps the app fully functional.
- D-11c-6: NO new route event, NO route-vocabulary change, NO RTL change, NO
  render change. This is a persistence milestone only.

## Test Checklist

1. `node --check apps/blog/assets/js/lang.js` -> exit 0.
2. `node --check apps/blog/assets/js/router.js` -> exit 0.
3. `node apps/blog/tools/test-integrity.js` -> INTEGRITY OK.
4. Node structural smoke (jsdom-free, stubbed window/localStorage): a stored
   `fa` + an EMPTY hash -> routed lang `fa`; a URL `#/en`... -> routed lang
   `en` (URL wins, D-11c-3); switching writes the key; an unknown stored value
   is ignored; a storage failure is non-fatal (falls back to "en").
5. Browser — cross-session: pick فارسی (`#/fa`); reload with a bare URL
   (no hash) -> the app opens in FA.
6. Browser — cross-view: from the index in FA, open a post, then click the
   header brand/home -> back to the FA INDEX (not EN).
7. Browser — URL authority: open a shared `#/ar` link -> opens in AR even if
   the stored language differs (and then the store follows to AR).
8. Browser — no regression: EN unchanged; switcher still navigates; fa/ar RTL
   intact; theme/font/TTS unaffected; no console errors.
9. `node apps/blog/tools/hash-state.js` -> capture FILE_TREE_SHA256 (AFTER
   staging).
10. `git status --porcelain` -> exactly 11c's file set.

## Known issues the next chat must NOT mistake for bugs

- 11b-b (the translation batch) is SEPARATE and still quota-blocked; this
  milestone adds NO content and does not depend on it. A language whose
  content is partial (fa 23/26, th/ar 1) still routes/renders with the EN
  fallback (D3) — intended.
- The store is a PREFERENCE, not content: it is never committed and lives only
  in the reader's browser. Nothing is written to disk under git.
- The brand link target `#/` is intentional (language-neutral); do not "fix"
  it back to `#/en`.
- theme.js/font.js/tts-\* keys are untouched; this milestone adds exactly ONE
  key.

## IDE File Path Rules (CRITICAL FOR CONTINUE)

- Paths are relative to the workspace root (`zabon/`).
- CORRECT: `apps/blog/assets/js/lang.js`
- INCORRECT: `zabon/apps/blog/assets/js/lang.js`

## RESULT (at close)

IMPLEMENTATION BUG FOUND AND FIXED. The first cut left `lang.js` OUT of the
`index.html` head (the `<script>` tag did not land), so `window.BlogLang` was
undefined at runtime and the router silently fell back to "en": browser tests
1 (cross-session) and 2 (cross-view) FAILED, while test 3 (explicit `#/ar`)
passed. Fix: added `<script src="assets/js/lang.js"></script>` to `<head>`
AFTER font.js and BEFORE the body scripts (so it precedes router.js in load
order). Re-tested in-browser — ALL PASS:

1. Switch to فارسی (`#/fa`) -> `localStorage["zabon-blog-lang"] === "fa"`;
   strip the hash + reload -> opens in Persian (RTL). PASS.
2. From the Persian index, open a post, click the "Zabon Blog" brand ->
   returns to the Persian index. PASS.
3. With stored `fa`, open `#/ar` -> opens in Arabic (URL overrides; store
   follows to `ar`). PASS.
4. No regression: EN list/post render; switcher navigates; fa/ar RTL intact;
   theme/font/TTS unaffected; no console errors. PASS.
   (Private-mode / storage-blocked also confirmed: app works, no memory.) PASS.

Lesson recorded: a head-module that a body script depends on MUST be verified
PRESENT in index.html, not just `node --check`-clean; the structural smoke
stubs `window.BlogLang`, so it could not catch a MISSING script tag.

## DEFECT FIX (same milestone): multi-language series ORDER (extends C1b-18)

Found by the human in-browser AFTER the persistence fix: `#/` (EN) shows the
series in correct READING order, but switching to fa shows the index REVERSED.

ROOT CAUSE (verified in feed.json): `generate-index.js` assigned the integer
`seriesOrder` ONLY to EN (`lang === "en" && ... ? map[slug] : null`). Every
non-EN entry therefore carried `seriesOrder: null`, fell into `renderList`'s
`rest` bucket, and was rendered in FEED order (date-desc) — which for this
series is the REVERSE of reading order. EN was correct only because it alone
had the 1..23 orders. This latent gap shipped with 10c (EN-only switcher) and
SURFACED when 11a added fa/th/ar content + exposed them in the switcher.

FIX (D-11c-7, below): the series number is a property of the POST, not the
language — the slug is language-agnostic, so the SAME 1..23 map applies to
every language. `generate-index.js` now assigns `seriesOrder` for ANY language
whose slug is in the map:

    seriesOrder: Object.hasOwn(seriesOrderMap, slug) ? seriesOrderMap[slug] : null,

`app.js` renderList is UNCHANGED — its existing `series.sort(a.seriesOrder -
b.seriesOrder)` then orders every language 1..23. Regenerated feed.json.

VERIFIED (node): EN changes = 0 (byte-identical); non-EN seriesOrder changes =
22 (null -> integer); other field changes = 0; feed.json still 51 entries;
EN order = [1..23]; fa order now ASCENDING (its 3 untranslated slugs — series
1, 2, 13 — are simply absent, and the 3 non-series slugs remain null/rest).
`node tools/test-integrity.js` -> INTEGRITY OK; `node --check
tools/generate-index.js` OK.

- D-11c-7 (defect fix; extends C1b-18): `seriesOrder` is derived from the
  language-agnostic slug and assigned to EVERY language that carries the
  series (not EN-only). The reading order is therefore identical across
  languages; EN output is UNCHANGED. NO change to app.js, the seam, content,
  renderer, router, nav, or CSS. This is the ONLY generator change.

NOTE: `tools/generate-index.js` is NOT part of the frozen extraction seam
(that is `tools/import-post.js`, frozen through D-Tool-29); changing the
DERIVED index is in scope and preserves C1b-18 (EN verbatim).

## Rename note (semantic name)

This milestone was drafted as "11c" and RENAMED to `11-language-persist`
at the human's request. The two artefacts are:

- tools/milestones/11-language-persist.md (this file; was 11c.md)
- apps/blog/HANDOFF-11-language-persist.md (was to be HANDOFF-11c.md)
  All "11c" references in this file's earlier draft sections denote this SAME
  milestone.
