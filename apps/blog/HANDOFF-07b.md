HANDOFF — Chat 07b: Theme toggle (light / dark / auto)
Status: complete
Current chat id: 07b
Current milestone: 07b
Completed milestones: 00,01,02,03,04,05a,05a-fix,05b-removal,W1,W1-fix,06,06b,07,08,09,C1a,C1-tool,C1-tool-p2,C1-model,C1-tool-cleanup,B1a,C1b-01..C1b-DONE,C1b-18,C1b-12..C1b-17,B1,10b,07b
Next chat id: TTS
Context windows used: 1

Files created/modified (exact paths)
- apps/blog/assets/js/theme.js (NEW; window.BlogTheme = {init,get,set}; resolves+applies data-theme; self-applies at parse time so it is loaded in <head>; no inline script)
- apps/blog/index.html (MOD; theme.js <script> in <head> BEFORE the stylesheet; #theme-nav section inside the 07 drawer #app-panel as a peer of #lang-nav, with a visually-hidden label + #theme-select Light/Dark/Auto; script load-order comment updated)
- apps/blog/assets/js/app.js (MOD; GUARDED window.BlogTheme.init() after the BlogShell guard in DOMContentLoaded)
- apps/blog/assets/css/style.css (MOD; ONE additive "Milestone 07b" block, NEW classes only: #theme-nav, .theme-icon, .theme-select; NO existing block edited)
- apps/blog/tools/ROADMAP.md (MOD; 07b -> Done appended; stale 07b Next bullet removed; "Next chat: TTS" marker added)
- apps/blog/HANDOFF-07b.md (NEW; this file)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> HANDOFF-07b.md)

Frozen decisions made in this chat
- T-1: The theme control lives in the 07 drawer (#app-panel) — the Settings panel. No new panel. Control form = native <select id="theme-select"> with an associated visually-hidden <label> (accessible name), matching the language-switcher pattern.
- T-2: data-theme values are "day" and "night" (matching the pre-existing html[data-theme="night"] block). Auto resolves via prefers-color-scheme and re-resolves when the OS preference changes (matchMedia 'change'; addEventListener with addListener fallback).
- T-3: Persistence via ONE localStorage key ("zabon-blog-theme"). The resolved theme is applied BEFORE first paint by loading theme.js in <head> (NOT deferred) — the module self-applies at parse time. There is NO inline script in index.html; theme.js is the single source of the early application (best-practice correction; see Deviations).
- T-4: Themes re-point CSS tokens ONLY. :root is the day/default theme; html[data-theme="night"] is night. No component class changes meaning.
- T-5: Guarded init in app.js (theme.js optional; the app must not break if theme.js fails to load), mirroring the BlogNav/BlogShell guarded-init pattern.

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=af9e5595d9e1cf48e388229c544145bb7dfd02180cb1be44bbd12663ca45b1f3
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the commit-message body, NOT in the handoff. See tools/WORKFLOW.md step 6. FILE_TREE_SHA256 is captured AFTER staging the full 07b file set INCLUDING this handoff + HANDOFF-CURRENT.txt.

Interfaces delivered
- window.BlogTheme = { init(): void, get(): "day"|"night", set(pref: "light"|"dark"|"auto"): void }.
- init() is idempotent, wires the #theme-select 'change' listener + a prefers-color-scheme 'change' listener; it adds NO second OS listener on re-call. No route awareness; no location.hash access.
- get() returns the theme actually applied to <html>. set() persists (ONE key) + applies immediately; an unknown pref is ignored; a localStorage failure is non-fatal (applies for the session).
- index.html: <script src="assets/js/theme.js"></script> in <head> before the stylesheet; #theme-select lives in the drawer.

Non-regression / additive proof
- style.css diff = +36 / -0: PURELY ADDITIVE, appended after the 10b block (numstat 36/0). No existing block edited; the :root + html[data-theme="night"] token blocks are byte-identical.
- app.js diff = +10 / -0: a single guarded block added after the BlogShell guard; no existing line changed.
- index.html diff = +27 / -3: theme.js <script> in <head>, the #theme-nav section, and load-order comment; the 3 deletions are the old script-order comment lines only.
- No content file written; the extraction seam (import-post.js) is UNTOUCHED (frozen through D-Tool-29); feed.json untouched; router.js/renderer.js/nav.js/shell.js untouched.

Carried-anomaly note (NOT milestone work)
- The IDE "Apply" hung on index.html; its later write-back REVERTED my first correct index.html edits to the original file. Recovery: (a) detected the revert via git status (index.html not showing as modified) + `cat -n`; (b) re-applied ALL edits via shell heredoc + python exact-string edits; (c) re-verified positionally on disk. This is the same "silent revert" anomaly class as carried warning #6, now observed on index.html.

Reported defects + fix (human-reported during the chat)
- The first implementation embedded an INLINE <script> in <head> to apply the theme pre-paint. The human flagged this as bad practice (embedded JS should be an external file). FIXED: removed the inline script; theme.js is now an external file loaded in <head> (not deferred) and SELF-APPLIES at parse time. index.html now contains NO inline <script> (verified: `grep '<script>'` = none).
- The human reported "no toggle visible / permanent dark, no way to change". ROOT CAUSE: the hung-apply revert had wiped the #theme-nav control, leaving index.html at HEAD (no control, no theme.js). FIXED by the re-apply above; #theme-nav + #theme-select (Light/Dark/Auto) now present in the drawer (verified positionally, lines 72-79).

Human edits made outside tooling (structured)
- None.

Open warnings (count + links only)
1. tools/*.md whitespace may not survive chat copy; anchor edits from `cat -A`. (carried; this chat used shell heredoc + python exact-string edits)
2. Edit splice pitfall: verify POSITIONALLY, not by substring. (carried; used here)
3. FILENAME COLLISION: B1 vs B1a. (carried)
4. hash-state.js FILE_TREE_SHA256 capture rule: capture AFTER staging. (carried)
5. LOSS_LEDGER.md table padding mixed (cosmetic). (carried)
6. (significant, recurred) Editor edits may SILENTLY REVERT / the Apply may HANG then write back a stale file. Observed this chat on index.html (reverted to HEAD). RE-VERIFY every edit on disk via git/shell immediately; never trust the editor's success message. (carried)
7. 0-byte stray file at repo root: NONE this chat (`find … -size 0` = empty). (carried; monitor)

Deviations from locked decisions (must be empty, or explain)
- One deviation from the milestone's suggested delivery, corrected: the 07b milestone text allowed "a small inline head script (or theme.js loaded in <head>)". The first attempt used the inline script; the human directed best-practice external-JS, so the final form loads theme.js in <head> and self-applies (no inline script). This is within T-3's explicit allowance and is the single source of the early application.

Partial work (link to PARTIAL.md if present)
- None.

Blocked reason (only if Status: blocked)
- (n/a)

Known issues / TODOs
- 07b re-points TOKENS ONLY. A component whose tokens were missing may still look off in dark; note it, do not silently redesign it. (from 07b.md)
- Transport buttons remain inert until TTS; not a bug here. Font selection is 07c; not added here.
- The old `.post-list-item__title` CSS rule remains unused (10b note); left intact deliberately.

Assumptions the next chat may rely on
- <html> carries data-theme = "day"|"night"; :root = day, html[data-theme="night"] = night; themes re-point tokens only.
- theme.js is loaded in <head> (pre-paint) and exposes window.BlogTheme = {init,get,set}; init is called guarded from app.js. The Settings drawer now holds #lang-nav + #theme-nav.
- The seam (import-post.js) is frozen through D-Tool-29; 07b changed no content file and no seam.
- HANDOFF-CURRENT.txt -> HANDOFF-07b.md; the next milestone file is apps/blog/tools/milestones/TTS.md (authored in e4fb028; VERIFIED present + unmodified here).

Test checklist result (pass/fail per item)
- node --check apps/blog/assets/js/theme.js -> exit 0: PASS
- node apps/blog/tools/test-integrity.js -> INTEGRITY OK: PASS
- node -e structural smoke test (theme.js): PASS — parse-time (head load) applies persisted/default theme BEFORE init (no flash); exports {init,get,set}; auto + OS-light -> day; OS scheme change re-resolves -> night; set(light/dark/auto) persists under ONE key + applies; get() reports applied; invalid pref ignored; idempotent init (no second OS listener); storage failure degrades gracefully (falls back to day / still applies for session): ALL PASS
- grep 'data-theme' in shell.js/router.js/renderer.js/nav.js -> none (NO_LEAKAGE): PASS
- grep -rln 'data-theme' consumers -> style.css + theme.js ONLY (index.html no longer sets it inline): PASS
- grep '<script>' index.html -> none (no inline script): PASS
- style.css purely additive (numstat 36/0): PASS
- Browser items (drawer shows Light/Dark/Auto; choosing Dark sets data-theme=night; Light sets day; Auto follows OS + live update; reload preserves; no flash; no console errors) -> NOT executed by the agent (no browser in this environment); covered by the structural smoke test. Browser confirmation owed to a human/next chat.

Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-07b.md (this file)
- apps/blog/tools/milestones/TTS.md (the next milestone; authored in e4fb028)
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/ROADMAP.md
- apps/blog/assets/js/theme.js (new module)
- apps/blog/index.html (drawer DOM #theme-nav + script order)
- apps/blog/assets/js/app.js (guarded-init block)
- apps/blog/assets/js/shell.js (drawer pattern)
- apps/blog/assets/css/style.css (token blocks + 07b block)
