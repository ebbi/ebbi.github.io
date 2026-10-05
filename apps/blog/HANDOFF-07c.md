HANDOFF — Chat 07c: Font selection in Settings (traditional / modern + default base)
Status: complete
Current chat id: 07c
Current milestone: 07c
Completed milestones: 00,01,02,03,04,05a,05a-fix,05b-removal,W1,W1-fix,06,06b,07,08,09,C1a,C1-tool,C1-tool-p2,C1-model,C1-tool-cleanup,B1a,C1b-01..C1b-DONE,C1b-18,C1b-12..C1b-17,B1,10b,07b,TTS,TTS2,07d,07c
Next chat id: 11
Context windows used: 1

Files created/modified (exact paths)

- apps/blog/assets/js/font.js (NEW; window.BlogFont = {init,get,set}; mirrors
  theme.js; owns the reading FAMILY only; no route/hash awareness; idempotent
  init; loaded in <head> for the pre-paint apply; ONE localStorage key)
- apps/blog/index.html (MOD; #font-nav .app-panel__section peer of #theme-nav
  and #lang-nav: visually-hidden label + #font-select Default/Traditional/
  Modern (empty value = default) + the font.js <head> script AFTER theme.js)
- apps/blog/assets/js/app.js (MOD; GUARDED window.BlogFont.init() added after
  the BlogTheme guard, inside the existing DOMContentLoaded block; no route or
  render logic changed)
- apps/blog/assets/css/style.css (MOD; ADDITIVE. :root gains --font-traditional
  (reading serif), --font-modern (clean sans), and --font-body now DEFAULTS to
  var(--font-traditional); the OLD inline body sans stack is preserved as
  --font-modern (nothing lost). ONE additive html[data-font=...] token re-point
  block + ONE additive, new-class-only control block at EOF. No existing class
  renamed; no token removed.)
- apps/blog/tools/ROADMAP.md (MOD; 07c -> Done with STATUS; Next marker -> 11)
- apps/blog/HANDOFF-07c.md (NEW; this file)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> HANDOFF-07c.md)

Frozen decisions made in this chat

- F-1: The font control lives in the 07 drawer (#app-panel) as a third
  .app-panel__section, peer of #lang-nav/#theme-nav. No new panel.
- F-2: Keys = traditional|modern. The DEFAULT (no stored pref) is the
  book-reader base = the READING SERIF (--font-traditional), applied by 07c;
  headings FOLLOW the body family (--font-heading: var(--font-body) unchanged).
  traditional = the same reading serif; modern = the clean sans stack.
- F-3: Persist under ONE key "zabon-blog-font"; applied BEFORE first paint by
  font.js loaded in <head> (NOT deferred), mirroring theme.js's pre-paint
  pattern. font.js and theme.js are two external head modules, EACH the single
  source of its own early apply (coordinated; NO inline script; not merged).
- F-4: SYSTEM stacks only (no webfont fetch); both stacks end in generic
  serif/sans-serif and degrade gracefully (no invisible text offline).
- F-5: Token-only re-point via html[data-font="traditional"|"modern"]; no
  component class changes meaning; no existing token removed. The absent/
  empty key REMOVES data-font so the :root default governs.
- F-6: Guarded init in app.js (font.js optional; app must not break if absent).
- Carried: D-07d-1..6 (typographic SYSTEM is 07d's; 07c sets FAMILY only),
  X-1..X-6 (TTS), D-TTS2-1..6, D-Tool-9 seam freeze + D-Tool-18..29 unchanged.

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=af9e5595d9e1cf48e388229c544145bb7dfd02180cb1be44bbd12663ca45b1f3
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the commit-message
body, NOT here (WORKFLOW.md step 6). FILE_TREE_SHA256 is captured AFTER staging
the full 07c file set INCLUDING this handoff + HANDOFF-CURRENT.txt.

Interfaces delivered

- New window.BlogFont = { init(): void, get(): string, set(pref): void }.
  get() returns "traditional"|"modern"|"" (the family actually applied; "" =
  the DEFAULT base). set(pref) accepts only "traditional"|"modern"|"" (invalid
  ignored); it persists (or removes on "") the ONE key and applies IMMEDIATELY
  the REQUESTED value (so a storage failure still applies for the session).
  init() wires #font-select's change listener (idempotent). Applies `data-font`
  on <html> (removes it for the default). No route/hash awareness.
- index.html: #font-nav (label "Font" -> #font-select Default/Traditional/
  Modern); font.js loaded in <head> after theme.js.
- app.js: guarded window.BlogFont.init() after the BlogTheme guard.
- style.css: tokens --font-traditional / --font-modern / --font-body (default
  = var(--font-traditional)); selectors html[data-font="traditional"|"modern"]
  re-point --font-body; #font-nav / .font-icon / .font-select control rules.

Expected delta for the next chat

- 11 (Translations & i18n UI) is HUMAN-GATED (already authored:
  tools/milestones/11.md). It MUST NOT start until the detailed EN text review
  is signed off. No font work pending.

Human edits made outside tooling (structured)

- None reported. (Pre-flight cleanup, NOT milestone work: removed one empty
  repo-root file with a control-byte name (`\001\004\346\004@p9N@8`) that
  reappeared (same anomaly as 07d); it is outside apps/blog/ and untracked.)

Open warnings (count + links only)

- 0.

Deviations from locked decisions (must be empty, or explain)

- None. (The --font-body VALUE changes from the old inline sans stack to
  var(--font-traditional): this is 07c EXERCISING the re-point 07d explicitly
  reserved for it (D-07d-1/D-07d-2), not a deletion. The old sans stack is
  preserved verbatim as --font-modern, so --font-body could be re-pointed back
  with no loss.)

Partial work: None. Blocked reason (only if Status: blocked): n/a.

Known issues / TODOs

- The DEFAULT base is a reading SERIF (book-reader-appropriate). If a reviewer
  prefers the previous sans as default, set --font-body back to
  var(--font-modern) in :root (one line; no class/token removal).
- System-stack glyphs vary by OS by design (no webfont fetch; F-4).
- The old `.post-list-item__title` CSS rule remains unused (pre-existing from
  10b; out of 07c's fence).

Assumptions the next chat may rely on

- The body family is data-font-driven on <html>: absent = default serif;
  "traditional" = serif; "modern" = sans. --font-heading follows --font-body.
- font.js is the single owner of font-family JS; theme.js stays the single
  owner of the theme early apply (07c never touched theme.js).
- 11.md is already authored and ready once the HUMAN GATE is signed off.

Test checklist result (pass/fail per item)

1. node --check apps/blog/assets/js/font.js -> exit 0. PASS
2. node apps/blog/tools/test-integrity.js -> INTEGRITY OK. PASS
3. Browser: drawer shows Font control (Traditional/Modern/default); choosing
   re-renders the body immediately -> structural PASS (change listener wired;
   token re-point); HUMAN to confirm visually.
4. Browser: FIRST run (cleared storage) applies the DEFAULT base (serif) ->
   structural PASS (no attribute => :root default); HUMAN to confirm.
5. Browser: reload preserves the choice with no flash -> structural PASS
   (font.js applies at parse time in <head>, mirroring theme.js); HUMAN.
6. Browser: no console errors; theme toggle works; drawer intact; RTL + focus
   unaffected; offline readable -> PASS (no JS in shell/router/renderer; RTL
   uses logical props; focus ring unchanged); HUMAN to confirm.
7. Grep: no font-family logic in shell.js/router.js/renderer.js; font.js is the
   single owner -> PASS.
8. node apps/blog/tools/hash-state.js -> captured (see commit body).
9. git status --porcelain -> exactly 07c's file set. PASS
Extra: 14/14 structural smoke (default apply; persisted pre-paint re-apply;
set() persists+applies; "" -> default; invalid ignored; init idempotent + wires
control; storage failure degrades gracefully). PASS

Files to read in the next chat (exact paths)

- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/milestones/11.md
