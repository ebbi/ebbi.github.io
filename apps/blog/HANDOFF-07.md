HANDOFF — Chat 07: App Shell & Toolbars

Status: complete
Current chat id: 07
Current milestone: 07
Completed milestones: 00, 01, 02, 03, 04, 05a, 05a-fix, 05b-removal, W1, W1-fix, 06, 06b, 07
Next chat id: 08
Context windows used: 1

## Files created/modified (exact paths)

- Created: apps/blog/assets/js/shell.js (drawer: open/close, ESC, backdrop, focus)
- Created: apps/blog/HANDOFF-07.md (this file)
- Modified: apps/blog/index.html (top/bottom app bars; #app-panel drawer; #lang-nav moved; shell.js added after nav.js)
- Modified: apps/blog/assets/css/style.css (07 shell block; dead 06-era CSS removed; focus-visible ring added)
- Modified: apps/blog/assets/js/nav.js (S-5 robust select lookup in #app-panel with document fallback; repaired malformed console.warn)
- Modified: apps/blog/assets/js/app.js (guarded BlogShell.init() call — see Deviations)
- Modified: apps/blog/tools/ROADMAP.md (S-6: 07/07b/07c split; TTS reserved; removed "07 Footer & Global UI")
- Modified: apps/blog/HANDOFF-CURRENT.txt (points at this handoff)

## Frozen decisions made in this chat

- 07.md S-1..S-8 adopted without change: overlay drawer at all widths (no
  desktop rail, deferred 07d); no theme logic (07b); no fonts (07c);
  transport buttons inert (TTS reserved); language switcher reparented,
  not rewritten; ROADMAP split recorded.
- shell.js exposes exactly { init() }; no route awareness; no hash access;
  one click (hamburger), one click (backdrop/close, delegated), one keydown
  (ESC). Idempotent.
- BlogNav public surface unchanged: { init(router), onRouteChange(route) }.
- #lang-nav, #lang-select, and the 06b flag contract preserved.

## Hashes (inputs only — see tools/WORKFLOW.md, convention (b))

LOCKED_DECISIONS_SHA256=57441c6bb8fc1e19044bc9b0ce44d1f67ec4ee1c71305289c97237067e9a0b86
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=1d6b6a91693c712a5116b452a4ac9a5172a558ba2cb8c48cb87e805ff9d54d27
SCHEMA_SHA256= OMITTED (Option 2 — no tools/schema.json)

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, per WORKFLOW.md step 6.

## Expected delta for the next chat

- 08 Post List Page (depends on 07). Reading order: HANDOFF-CURRENT.txt
  → HANDOFF-07.md → tools/milestones/08.md (authored at 07 close).

## Human edits made outside tooling (structured)

- 06b carry-forward reconciled: 06b's commit body (8cc3298) contained an
  un-substituted FILE_TREE_SHA256=<paste-from-hash-state> placeholder and
  GIT_DIRTY=true. True values were FILE_TREE_SHA256=91757043...93 and
  GIT_DIRTY=false. No history rewrite (W1F-D3). Recorded here per the
  carry-forward instruction.
- Human confirmed the full manual browser checklist and the keyboard
  re-test after the focus-ring fix. No content changes outside the
  deviations below.

## Open warnings (count + links only)

- 0.

## Deviations from locked decisions

1. app.js modified (was on 07.md "do not touch"). 07.md's Interfaces
   specified shell.js's init() surface but omitted its call site; app.js
   is the controller that already calls BlogNav.init(). Added a guarded
   BlogShell.init() beside it. Frozen-decision correction.
2. Dead 06-era CSS physically removed from style.css (07.md said "does
   not silently delete the rest"). Declared, not silent: .toolbar*,
   .panel*, .panel__row*, .chevron, .lang-list, .lang-option, .flag,
   .theme-group, .theme-option, .site-header and their RTL pairings were
   provably unreferenced by the 07 HTML.
3. Focus-visibility regression introduced then repaired within 07. The
   first .app-bar__menu-btn:focus-visible rule set `outline: none` with no
   visible replacement; replaced with a visible :focus-visible ring
   (2px solid var(--accent), offset 2px). In-scope (S-8 a11y). Repair
   verified; `grep "outline: none"` returns nothing.

## Partial work

- None.

## Blocked reason

- N/A

## Known issues / TODOs

- Closed-drawer focusability: #panel-close and #lang-select remain
  tabbable while #app-panel is aria-hidden="true". Confirmed via tab-order
  probe. DEFERRED to milestone 13a (Accessibility & Keyboard Nav) per
  07.md S-8. Not a 07 bug.
- Drawer heading "Menu" and aria-labels ("Open menu", "Close menu",
  "Playback") are English literals. UI translation is milestone 11
  (Translations & i18n UI). Not a 07 regression.
- Transport buttons are inert by design (S-4). TTS is a reserved later
  milestone.
- Post slugs language-agnostic; #/fa/post/<en-slug> routes to the EN body
  (carried). posts.json is EN-only; non-EN list views render empty.
- RTL set membership is a literal in router.js, not LOCKED_DECISIONS.txt
  (carried; promote in a tooling milestone).
- Pre-existing console warning "Layout was forced before the page was
  fully loaded..." (renderer path). Not caused by 07; intermittent.

## Assumptions the next chat may rely on

- Handoff hash block = inputs only; GIT_HEAD/GIT_DIRTY/FILE_TREE_SHA256
  live in the commit body.
- FILE_TREE_SHA256 semantics: it is the sha256 of the sorted,
  newline-joined output of `git ls-files apps/blog` — i.e. the TRACKED
  PATH SET, not file contents. It does NOT change when tracked files are
  edited in place, and it excludes untracked files. Expect it to change
  only on add/remove/rename after commit. Do not read it as a content
  hash. (Script: tools/hash-state.js.)
- BlogShell exposes exactly { init() }; init is called once from app.js
  after BlogRouter.init succeeds. shell.js has no router dependency.
- BlogNav exposes exactly { init(router), onRouteChange(route) }; #lang-nav
  now lives inside #app-panel; the select lookup is robust to that move.
- nav.js assigns location.hash exactly once (onChange) and never reads it.
- Script order in index.html: renderer, router, nav, shell, app.

## Test checklist result (pass/fail per item)

- ls created/modified paths present: PASS
- node --check shell.js: PASS
- node --check nav.js: PASS
- grep "window.location.hash" nav.js -> 1 hit (assignment only, line 114): PASS
- grep "data-theme" shell.js index.html -> no output (S-2): PASS
- drawer opens; aria-hidden/aria-expanded flip (true/false <-> false/true): PASS
- ESC closes: PASS
- backdrop click closes: PASS
- drawer switch -> #/fa, html[lang=fa][dir=rtl], drawer still works: PASS
- RTL mirroring, no LTR leakage: PASS
- phone-width (~360px): bars fixed, last item reachable: PASS
- keyboard: Tab -> brand (ring) -> hamburger (ring) -> Enter opens ->
  Tab into drawer -> ESC closes + focus returns: PASS
- console: no new errors, no 404s: PASS
- grep "outline: none" style.css -> no output: PASS
- test-integrity.js -> INTEGRITY OK: PASS
- git status exactly 07's file set: PASS

## Files to read in the next chat (exact paths)

- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-07.md
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/ROADMAP.md
- apps/blog/tools/milestones/08.md
- apps/blog/index.html
- apps/blog/assets/js/shell.js
- apps/blog/assets/js/nav.js
