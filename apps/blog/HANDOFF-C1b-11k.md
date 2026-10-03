HANDOFF — Chat C1b-11k: Migrate the series post `...-muslim-world-contents`
Status: STOP (scope-fence trip; NO content file written)
Current chat id: C1b-11k
Current milestone: C1b-11k
Completed milestones: C1a, C1-tool, C1-tool-p2, C1-model, C1-tool-cleanup, C1-tool-seam-complete, C1b-01, C1b-seam-bare-p, C1b-02, C1b-03, C1b-04, C1b-05, C1b-06, C1b-07, C1b-08, C1b-09a, C1b-09b, C1b-10, C1b-11, C1b-11a, C1b-11b, C1b-11c, C1b-11d, C1b-11e (partial/STOP — re-scoped), C1b-11e-a, C1b-11e-b, C1b-11f, C1b-11g, C1b-11h (partial/STOP — re-scoped), C1b-11h-a, C1b-11h-b, C1b-11i, C1b-11j, C1b-11k (partial/STOP — re-scoped)
Next chat id: C1b-11k-a
Context windows used: 1
Files created/modified (exact paths)

- apps/blog/PARTIAL.md (MOD; new C1b-11k STOP section prepended)
- apps/blog/tools/milestones/C1b-11k-a.md (NEW; the seam extension, D-Tool-27)
- apps/blog/tools/milestones/C1b-11k-b.md (NEW; the migration)
- apps/blog/tools/ROADMAP.md (MOD; C1b-11k STOPPED + C1b-11k-a/C1b-11k-b added;
  Next updated; seam count 9 -> 10)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> HANDOFF-C1b-11k.md)
- apps/blog/HANDOFF-C1b-11k.md (NEW; this file)
  Frozen decisions made in this chat
- None. No seam change, no content file written, nothing committed to
  LOCKED_DECISIONS.txt. D-Tool-27 (tableBare) is PROPOSED in C1b-11k-a; it is
  frozen there, not here.

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=6d8ccb5069925fcbbe764ac65b9a17c6492a0d5172a8a80e305ebc8b0ce40ab1
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, NOT in the handoff. See tools/WORKFLOW.md step 6.
Expected delta for the next chat (C1b-11k-a — seam)

- Extend the D-Tool-9 seam by D-Tool-27 `tableBare`: a CLASS-LESS bare
  top-level `<table>` (no class attribute) promoted to the EXISTING `table`
  shape ({ type:"table", content:<inner HTML of <table>> }).
  Regex `/<table\b(?![^>]*\bclass=)[^>]*>[\s\S]*?<\/table>/i`, blockFromFragment
  handled identically to the existing `table` kind.
- Re-recon the contents post:
  `https://twolegsbadblog.wordpress.com/2017/01/20/a-contemporary-history-of-the-muslim-world-contents/`
  expect {table:1, paragraph:N} with ALL `*_para_leftover` = 0 and the 24 raw
  `<img>` subsumed by the single table block.
- Non-regression: pilot 80 {image:15,paragraph:62,quote:2,table:1} MUST be
  byte-identical (the pilot's bare `<table>` is inside
  `<figure class="wp-block-table">`, so tableBare must NOT fire for it).
- Then C1b-11k-b migrates the contents post (feed.json 19 -> 20; resolves
  L-013).
  Human edits made outside tooling (structured)
- None this chat. Tree was clean at open (last commit 9cd059c, C1b-11j) and
  remained clean at close (no write occurred).
  Open warnings (count + links only)

1. tools/\*.md whitespace may not survive chat copy; anchor edits from `cat -A`. (carried C1b-03/04)
2. Edit splice pitfall: verify POSITIONALLY, not by substring. (carried C1b-04)
3. Stale "## The commit" line in HANDOFF-C1b-seam-bare-p.md (points at 50ffad5) — still unfixed. (carried)
4. LOSS_LEDGER.md table padding mixed (cosmetic). (carried)
5. (carried C1b-07, process) prior chat initially routed shell to the human; resolved.
6. hash-state.js FILE_TREE_SHA256 capture rule: capture AFTER staging; see
   C1b-09a deviation note. (carried)
7. (carried C1b-11a) milestone regex lookahead vs task-text transcription
   (missing `*` quantifiers). Frozen-form regex used.
8. (recurring) a 0-byte stray file appears at repo root; none present this
   chat (git status clean at open and close).
9. (carried C1b-11h) SILENT-loss metric gap: a DROPPED (not leaked) class is
   invisible to `*_para_leftover`; always reconcile the raw `<img>`/`<iframe>`
   count against the rendered block count. RE-CONFIRMED this chat:
   the contents post renders 0 images vs 24 raw `<img>`; only 13 leaked
   (img_para_leftover) while 11 were dropped entirely — the metric alone would
   have missed the 11.
   Deviations from locked decisions (must be empty, or explain)

- None. No write occurred; import-post.js byte-identical; no content file
  written; posts.json untouched; every non-regression target unchanged.
  Partial work (link to PARTIAL.md if present)
- STOP record: apps/blog/PARTIAL.md (new C1b-11k section, top of file).
  Known issues / TODOs
- L-006 stays RESOLVED (part-8, C1b-11i); L-012 stays RESOLVED (part-9,
  C1b-11h-b); L-010 stays DEFERRED (feed excerpt; not C1b). No ledger row was
  authored this chat (the L-013 row is authored in C1b-11k-a where the class
  is frozen).
- Tolerance note: the seam is now frozen through D-Tool-26; ANY further new
  class STOPS and re-scopes (its own milestone). This chat is that STOP.
- Remaining unmigrated series EN posts after C1b-11k-b: NONE. C1b-11k-b is
  the LAST EN post; then C1b-DONE proves 20/20 and posts.json deletion is
  unblocked.
  Assumptions the next chat may rely on
- The seam is frozen through D-Tool-26 (as shipped by C1b-11h-a).
- The contents post's canonical slug = a-contemporary-history-of-the-muslim-world-contents
  (live HTTP 200, 0 redirects, no `protected-` prefix, entry-content present;
  slug/title/date MATCH posts.json — NO discrepancy). It is a SEPARATE slug,
  NOT part-7 and NOT part-8 (the series index/contents post). date
  2017-01-20T13:22:50+00:00; title "A contemporary history of the Muslim
  world: contents" (source `&nbsp;` before `contents` decodes to a space per
  D-Tool-16). cache sha256 =
  939b28077973c3995c6d78aa8c4f55543232b8d5ed2a153f481ca4f9c9e569d9.
- THE NEW CLASS: a CLASS-LESS bare top-level `<table width="916">` (the legacy
  WP.com layout grid: colgroup/tbody/12 tr/48 td; 23 of 24 `<img>` inside
  `<td>` cells). The frozen seam has only the `<figure wp-block-table>` rule,
  which does NOT match it. Result on the contents post with the frozen seam:
  16 blocks all paragraph, img_para_leftover = 13, and 24 raw `<img>` vs 0
  rendered image blocks (silent drop). NEW structural class `tableBare`.
- Scope: the class-less bare `<table>` occurs in ONLY this post (2 cache
  copies). The pilot `jews-in-palestine-before-israel` has a bare `<table>`
  but it is INSIDE `<figure class="wp-block-table aligncenter">` (consumed
  whole by the existing table rule), so pilot 80 {…,table:1} is UNCHANGED and
  NO shipped slug is affected (no retrospective re-migration).
- Re-scoped per the Scope Fence into C1b-11k-a (seam, D-Tool-27) + C1b-11k-b
  (migration, resolves L-013).
  Test checklist result (pass/fail per item) — recon only; no write this chat
- git status --porcelain clean at open: pass
- test-integrity INTEGRITY OK at open: pass
- LOCKED_DECISIONS_SHA256 = 6d8ccb50... matches C1b-11j at open: pass
- contents URL confirmed fetchable (HTTP 200, 0 redirects, entry-content
  present, no `protected-` prefix): pass
- live slug/title/date confirmed; posts.json matches: pass
- recon census measured (frozen seam: {paragraph:16}, img_para_leftover = 13,
  24 raw <img> vs 0 rendered): pass (STOP condition met)
- NEW structural class confirmed (class-less bare top-level <table>): pass
- scope check (only this post affected; pilot unaffected): pass
- NOT written: content/en/*.json, feed.json, LOCKED_DECISIONS.txt,
  LOSS_LEDGER.md, import-post.js: pass (clean at close)
- test-integrity INTEGRITY OK at close: pass (tree untouched)
- hash-state captured: pass
  Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1b-11k.md
- apps/blog/PARTIAL.md
- apps/blog/tools/milestones/C1b-11k-a.md (this is the next milestone's file)
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/LOSS_LEDGER.md
- apps/blog/tools/ROADMAP.md
