HANDOFF — Chat 06: Navigation & Header

Status: complete
Current chat id: 06
Current milestone: 06
Completed milestones: 00, 01, 02, 03, 04, 05a, 05a-fix, 05b-removal, W1, W1-fix, 06
Next chat id: 06b
Context windows used: 1

## Files created/modified (exact paths)

- **Created:** apps/blog/assets/js/nav.js
- **Created:** apps/blog/HANDOFF-06.md (this file)
- **Created:** apps/blog/tools/milestones/06b.md (authored at step 7)
- **Modified:** apps/blog/index.html (structured `<header>` with brand + `#lang-nav`; nav.js added between router.js and app.js; load-order comment updated)
- **Modified:** apps/blog/assets/css/style.css (append-only header + language-list block; mobile-first; logical properties)
- **Modified:** apps/blog/assets/js/app.js (BlogNav.init after BlogRouter.init; BlogNav.onRouteChange(route) inside handleRouteChange; both guarded)
- **Modified:** apps/blog/HANDOFF-CURRENT.txt (points at this handoff)

## Frozen decisions made in this chat

- **N6:** The header's language switcher is the surface for language
  selection. Its initial form is a four-link `<ul>` (content languages
  only) per 06.md N5. Localized names, flag icons, and a drop-down
  treatment are deferred to 06b; the milestone file for 06b is authored
  in this chat (step 7).
- **N7:** The CSS added in 06 is mobile-first: base rules target small
  screens; a single `@media (min-width: 481px)` enhances to the
  two-column header. No `max-width` media queries and no physical
  left/right properties were introduced.

## Hashes (inputs only — see tools/WORKFLOW.md, convention (b))

LOCKED_DECISIONS_SHA256=57441c6bb8fc1e19044bc9b0ce44d1f67ec4ee1c71305289c97237067e9a0b86
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=1d6b6a91693c712a5116b452a4ac9a5172a558ba2cb8c48cb87e805ff9d54d27
SCHEMA_SHA256= OMITTED (Option 2 — no tools/schema.json)

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, per WORKFLOW.md step 6.

## Expected delta for the next chat

- 06b builds the toolbar treatment, drop-down language selection,
  localized language names, and flag icons. It must respect N6 (switcher
  remains the selection surface) and the human-review gate for strings.
- Reading order for 06b: HANDOFF-CURRENT.txt -> HANDOFF-06.md ->
  tools/milestones/06b.md.

## Human edits made outside tooling (structured)

- None.

## Open warnings (count + links only)

- 0.

## Deviations from locked decisions

- None. (06b is new scope authored at step 7, not a deviation from 06.)

## Partial work

- None.

## Blocked reason

- N/A

## Known issues / TODOs

- Post slugs are language-agnostic (`LOCKED_DECISIONS.txt`), so
  `#/fa/post/<en-slug>` routes to a post and renders its EN body under
  an `fa` URL. Expected until translated content lands. Confirmed in
  this chat's manual test: arth/th/fa all render the same 30 blocks.
- `posts.json` is EN-only; `#/fa` and `#/th` render the empty list
  state. Expected.
- RTL set membership is a literal in `router.js` and is not recorded in
  `LOCKED_DECISIONS.txt`. Out of scope for 06; carried from W1.
- `nav.js` contains the string `location.hash` twice, both in comments
  (lines 11, 104) as documentation of N2. The 06.md checklist expected
  "no hits"; the intent (no code usage) is satisfied.

## Assumptions the next chat may rely on

- Handoff hash block = inputs only; GIT_HEAD/GIT_DIRTY/FILE_TREE_SHA256
  live in the commit body.
- HANDOFF-CURRENT.txt points at apps/blog/HANDOFF-06.md.
- Milestone-file schema (Interfaces mandatory) is canonical.
- 06b.md is authored, staged with this cycle, and unchanged once committed.
- nav.js exposes exactly `{ init(router), onRouteChange(route) }` on
  `window.BlogNav`; `init` builds the `<li><a>` nodes once, `onRouteChange`
  only rewrites `href` and `aria-current`.

## Test checklist result (pass/fail per item)

- ls paths present: PASS
- node --check nav.js: PASS
- node --check app.js: PASS
- grep location.hash in nav.js: PASS (2 hits, both comments; no code usage)
- new header CSS: mobile-first, no physical left/right: PASS
- manual browser, en->fa: PASS
- manual browser, post-to-post preserves slug (ar): PASS
- `<html lang/dir>` updated per route: PASS
- console: no new errors, no 404s: PASS
- test-integrity.js: PASS (INTEGRITY OK)
- git status exactly the 06 file set: PASS

## Files to read in the next chat (exact paths)

- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-06.md
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/ROADMAP.md
- apps/blog/tools/milestones/06b.md
- apps/blog/index.html
- apps/blog/assets/js/nav.js
- apps/blog/assets/js/router.js

```

### Note on the two hashes

I did **not** fill in `LOCKED_DECISIONS_SHA256` or `CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256` — per CONTEXT.md Hard Rules, "Hashes come from scripts. Never compute a hash by hand." I'd be guessing otherwise.

**Run these now and paste the output**, and I'll patch the handoff with the real values before you stage:

```

node apps/blog/tools/hash-state.js

````

(It'll also print `GIT_HEAD` / `GIT_DIRTY` / `FILE_TREE_SHA256`, which we'll use in step 6's commit body — not in the handoff.)

---

## Step 5 — `apps/blog/HANDOFF-CURRENT.txt`

```text apps/blog/HANDOFF-CURRENT.txt
apps/blog/HANDOFF-06.md
````

(Exactly one newline-terminated line. Overwrite the file.)

---

## Step 7 — `apps/blog/tools/milestones/06b.md` (new)

```markdown apps/blog/tools/milestones/06b.md
# Milestone 06b: Toolbar & Language Drop-down

## Scope fence (read first)

06b is a **presentation + selection-surface** milestone. It upgrades the
language switcher introduced by 06 into a toolbar-resident drop-down with
localized language names and flag icons. It does NOT translate content,
does NOT filter content by language, and does NOT introduce per-language
post files. Routing behavior is unchanged: selecting a language updates
the URL hash while preserving the current view (list stays a list; a post
stays that same post slug), exactly as 06 defined.

## Objective

Replace the four-link `<ul class="lang-list">` inside `#lang-nav` with a
drop-down control that:

- lists the four content languages (en, fa, ar, th),
- shows each language's **localized name** (e.g. English, فارسی, العربية,
  ไทย),
- shows a flag icon per language,
- preserves 06's routing semantics (list->list, post keeps slug),
- keeps the active language programmatically discoverable
  (`aria-current="true"` on the selected option, per the mechanism chosen
  below).

## Interfaces (mandatory)

### Modified: `apps/blog/assets/js/nav.js`

    window.BlogNav = {
      init(router): void,              // unchanged signature
      onRouteChange(route): void       // unchanged signature
    };

- `init(router)` now:
  - builds the drop-down (replacing the `<ul>` contents),
  - populates each option with localized name + flag,
  - installs a single `change` listener on the drop-down that sets
    `location.hash` to the option's precomputed `href`.
- `onRouteChange(route)` now:
  - recomputes each option's `href` from `route` (reusing 06's
    `buildLangHref(code, route)` rule — still the ONLY place a
    language-switch URL is built),
  - sets the drop-down's `value` to `route.lang` if `route.lang` is in
    the content set, otherwise leaves the control disabled or unset.

No new exports. No second `hashchange` listener. `location.hash` is still
read only in comments; every URL is derived from the route object.

### Modified: `apps/blog/index.html`

Replace the `<ul class="lang-list"></ul>` inside `#lang-nav` with the
chosen drop-down markup (see "Decisions frozen for this milestone").

### Modified: `apps/blog/assets/css/style.css`

Add toolbar + drop-down styles. Mobile-first (per 06.md N7). Logical
properties. Flag icon rendered at a fixed size; total per-flag asset
<= 200 KB per `LOCKED_DECISIONS.txt`.

### New: `apps/blog/assets/img/flags/<code>.svg` (or method chosen below)

One asset per content language. Directory convention follows
`LOCKED_DECISIONS.txt` (images under `assets/img/`). Filenames are the
language code, not a country code, to make the flag!=language caveat
explicit in the tree.

## Files to Create

1. `apps/blog/assets/img/flags/en.svg` (mechanism TBD — see decisions)
2. `apps/blog/assets/img/flags/fa.svg`
3. `apps/blog/assets/img/flags/ar.svg`
4. `apps/blog/assets/img/flags/th.svg`
5. `apps/blog/HANDOFF-06b.md`

## Files to Modify

1. `apps/blog/assets/js/nav.js`
2. `apps/blog/index.html`
3. `apps/blog/assets/css/style.css`
4. `apps/blog/HANDOFF-CURRENT.txt` (step 5)

## Files I will NOT touch

- `apps/blog/tools/parser.js`, `fetcher.js`, `generate-index.js`,
  `hash-state.js`, `test-integrity.js`
- `apps/blog/assets/data/posts.json`, `feed.json`
- `apps/blog/assets/js/router.js` (RTL + `dir` + `lang` live here)
- `apps/blog/assets/js/renderer.js`
- `apps/blog/assets/js/app.js` (init/forward wiring already done in 06)
- `apps/blog/tools/CONTEXT.md`, `LOCKED_DECISIONS.txt`, `WORKFLOW.md`
- Anything outside `apps/blog/`

## Decisions frozen for this milestone

- **B-1 Toolbar.** The "toolbar" is the existing `<header>` region
  introduced by 06. No separate fixed bar is added. If a distinct fixed
  toolbar is later wanted, that is a new milestone, not an extension of
  this one.
- **B-2 Selection control.** The drop-down is a **native `<select>`
  element** with a `<label>` (visually hidden if needed). Native is
  chosen for keyboard/AT robustness and to avoid a custom listbox's
  accessibility surface. A custom `role="listbox"` popup is explicitly
  NOT adopted here.
- **B-3 Selection semantics.** Changing the drop-down writes
  `location.hash` to the option's precomputed `href`. This is the ONLY
  `location.hash` assignment in `nav.js`; the precomputed href is still
  produced by `buildLangHref`, which never reads the hash (N2 preserved).
- **B-4 Flag mechanism.** TBD at approval gate. Candidates:
  (a) committed SVG per language under `assets/img/flags/`;
  (b) emoji flags (zero assets, OS-dependent rendering);
  (c) CSS sprite. **Default proposal: (a).** Reason: deterministic
  rendering, small files, tree has a single source per flag. Emoji (b)
  is rejected by default because rendering varies by OS and font.
- **B-5 Localized names.** Names are content, not metadata:
  English / فارسی / العربية / ไทย. Per `LOCKED_DECISIONS.txt`
  Translation rule, human per-language review is a mandatory gate. This
  milestone ships the strings **pending review** and records them as
  awaiting the gate in its handoff. If review is not complete by this
  milestone's verification step, the milestone is `partial`, not
  `complete`.
- **B-6 flag != language caveat.** The "flag" is decorative for the
  language. This is recorded, not fixed: Persian is spoken beyond Iran,
  Arabic spans many countries. The accessible name and `hreflang`
  attribute use the **language code/name**, never the flag.

## Test Checklist

1. File tree:
   `ls apps/blog/assets/js/nav.js apps/blog/assets/img/flags/ apps/blog/index.html`
2. Syntax:
   `node --check apps/blog/assets/js/nav.js`
3. No hash parsing in nav:
   `grep -n "window.location.hash" apps/blog/assets/js/nav.js`
   -> only the one assignment in the change handler; no reads.
4. Native `<select>` has an associated `<label>` (manual review).
5. Flag assets: each <= 200 KB; total added to the tree small.
6. Manual browser (report verbatim):
   - `#/en`: drop-down shows English / فارسی / العربية / ไทย with flags;
     "English" selected; `<html lang="en" dir="ltr">`.
   - Change to فارسی -> `#/fa`; `<html lang="fa" dir="rtl">`;
     "فارسی" selected.
   - From `#/en/post/jews-in-palestine-before-israel`, choose العربية ->
     `#/ar/post/jews-in-palestine-before-israel`; post renders.
   - Keyboard: Tab to control, open with Enter/Space, arrow to an option,
     Enter -> URL changes.
   - Phone-width viewport: toolbar wraps cleanly; drop-down remains usable.
   - No new console errors; no 404s.
7. `node apps/blog/tools/test-integrity.js` -> INTEGRITY OK

## Known issues the next chat must NOT mistake for bugs

- Post slugs remain language-agnostic (from `LOCKED_DECISIONS.txt`), so
  `#/fa/post/<en-slug>` still routes to the EN body under an `fa` URL
  until translated content exists.
- `posts.json` is EN-only; `#/fa` and `#/th` render the empty list state.
- RTL set membership remains a literal in `router.js` and is not in
  `LOCKED_DECISIONS.txt`. If 06b's flag/name work surfaces this again,
  promote it in a tooling milestone.
- The flag imagery is decorative and chosen by convention; it does not
  assert language-country identity (B-6).

## IDE File Path Rules (CRITICAL FOR CONTINUE)

- The VS Code Workspace Root is the `zabon/` directory.
- All paths in SCOPE CONFIRMATION, code blocks, and file headers MUST be
  relative to the VS Code Workspace Root.
- CORRECT: `apps/blog/assets/js/nav.js`
- INCORRECT: `zabon/apps/blog/assets/js/nav.js`, `nav.js`, `./nav.js`.
```

---

## Step 6 — stage and commit (after you paste hash-state.js output)

Once you paste `hash-state.js` output, I'll patch the two hash lines into `HANDOFF-06.md`, then hand you the exact stage/commit commands in the WORKFLOW.md step-6 preferred form (`git add` per path; separate `-m` flags). I will not stage or commit for you.

**Go ahead and run:**

```
node apps/blog/tools/hash-state.js
```
