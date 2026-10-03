HANDOFF — Chat C1b-11k-a: Extend the D-Tool-9 seam (tableBare)
Status: STOP (scope-fence trip — SECOND new class; NO seam change frozen)
Current chat id: C1b-11k-a
Current milestone: C1b-11k-a
Completed milestones: C1a, C1-tool, C1-tool-p2, C1-model, C1-tool-cleanup,
C1-tool-seam-complete, C1b-01, C1b-seam-bare-p, C1b-02, C1b-03, C1b-04,
C1b-05, C1b-06, C1b-07, C1b-08, C1b-09a, C1b-09b, C1b-10, C1b-11, C1b-11a,
C1b-11b, C1b-11c, C1b-11d, C1b-11e (partial/STOP — re-scoped), C1b-11e-a,
C1b-11e-b, C1b-11f, C1b-11g, C1b-11h (partial/STOP — re-scoped), C1b-11h-a,
C1b-11h-b, C1b-11i, C1b-11j, C1b-11k (partial/STOP — re-scoped),
C1b-11k-a (partial/STOP — re-scoped)
Next chat id: C1b-11k-a-a
Context windows used: 1
Files created/modified (exact paths)
- apps/blog/HANDOFF-C1b-11k-a.md (NEW; this file)
- apps/blog/PARTIAL.md (MOD; new C1b-11k-a STOP section prepended)
- apps/blog/tools/milestones/C1b-11k-a-a.md (NEW; seam: D-Tool-27 + D-Tool-28)
- apps/blog/tools/milestones/C1b-11k-a-b.md (NEW; the migration)
- apps/blog/tools/ROADMAP.md (MOD; C1b-11k-a STOPPED + C1b-11k-a-a/C1b-11k-a-b
  added; Next updated; seam count 10 -> 11)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> HANDOFF-C1b-11k-a.md)
Frozen decisions made in this chat
- None. No seam change was frozen; import-post.js was REVERTED to the C1b-11k
  committed state. D-Tool-27 (tableBare) + D-Tool-28 (imageBarePStrong) are
  PROPOSED in C1b-11k-a-a; they are frozen there, not here.

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=6d8ccb5069925fcbbe764ac65b9a17c6492a0d5172a8a80e305ebc8b0ce40ab1
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, NOT in the handoff. See tools/WORKFLOW.md step 6.
Expected delta for the next chat (C1b-11k-a-a — seam)

- Extend the D-Tool-9 seam by TWO entries:
  - D-Tool-27 `tableBare`: class-less bare top-level `<table>` ->
    EXISTING `table` shape. Regex
    `/<table\b(?![^>]*\bclass=)[^>]*>[\s\S]*?<\/table>/i`.
  - D-Tool-28 `imageBarePStrong`: bare `<p>` whose entire content is a
    `<strong>`-wrapped `<img>` -> EXISTING `image` shape. Regex
    `/<p\b(?![^>]*\bclass="[^"]*\bwp-block-)[^>]*>\s*<strong>\s*<img\b[^>]*\/?>\s*<\/strong>\s*<\/p>/i`,
    placed after imageBarePEm (D-Tool-23) and before paragraphBare (D-Tool-19).
- Re-recon the contents post
  (`https://twolegsbadblog.wordpress.com/2017/01/20/a-contemporary-history-of-the-muslim-world-contents/`):
  expect {table:1, paragraph:N} with ALL `*_para_leftover` = 0 and the 24 raw
  `<img>` accounted for (23 subsumed by the single table block + 1
  imageBarePStrong `afghans1.png`, data-attachment-id 10954).
- Then C1b-11k-a-b migrates the contents post (feed.json 19 -> 20; resolves
  L-013).
Human edits made outside tooling (structured)
- None. Tree was clean at open (last commit 816377f, C1b-11k) and clean at
  close (import-post.js reverted; no write to content/feed/decisions/ledger).
Open warnings (count + links only)

1. tools/*.md whitespace may not survive chat copy; anchor edits from `cat -A`. (carried C1b-03/04)
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
   count against the rendered block count. RE-CONFIRMED again here: the
   contents post's 2nd-cell thumbnail `<img>` (~11) were dropped entirely and
   were invisible to `*_para_leftover`; only the raw-`<img>` (24) vs
   rendered-image reconciliation exposed them.
Deviations from locked decisions (must be empty, or explain)
- None. import-post.js REVERTED to the C1b-11k committed state; no content
  file written; posts.json untouched; every non-regression target unchanged.
Partial work (link to PARTIAL.md if present)
- STOP record: apps/blog/PARTIAL.md (new C1b-11k-a section, top of file).
Known issues / TODOs
- L-006 stays RESOLVED (part-8, C1b-11i); L-012 stays RESOLVED (part-9,
  C1b-11h-b); L-010 stays DEFERRED (feed excerpt; not C1b). L-013 is NOT yet
  authored (it is authored in C1b-11k-a-a where the class is frozen).
- Tolerance note: ANY further new class STOPS and re-scopes (its own
  milestone). This chat is that STOP (a SECOND class after tableBare).
- Remaining unmigrated series EN posts after C1b-11k-a-b: NONE. C1b-11k-a-b is
  the LAST EN post; then C1b-DONE proves 20/20 and posts.json deletion is
  unblocked.
- The contents post emits TWO EMPTY paragraph blocks from its `<p> </p>`-style
  spacers; pre-existing paragraphBare behaviour, NOT a new class.
Assumptions the next chat may rely on
- The seam is frozen through D-Tool-26 (as shipped by C1b-11h-a).
- The D-Tool-27 tableBare change from C1b-11k-a was verified non-regressing
  (pilot 80 / ctn 34 quote[3] len=240 / update 2 / all 19 content files
  byte-identical) but is NOT frozen (it was reverted); re-apply it in
  C1b-11k-a-a together with D-Tool-28.
- THE SECOND NEW CLASS: a bare `<p>` whose entire content is a single
  `<strong>`-wrapped `<img>` (`<p style="text-align:justify"><strong><img
  .../></strong></p>`), the recovered `afghans1.png` (data-attachment-id
  10954) sitting AFTER the `</table>`. D-Tool-23 keys on `<em>`, not
  `<strong>`, so paragraphBare captured it (img_para_leftover = 1). NEW
  structural class `imageBarePStrong`.
- Scope: `imageBarePStrong` occurs ONLY in the contents post (2 cache files;
  canonical + slug-redirect copy); 0 occurrences in all 20 other cached
  sources. NO shipped slug affected (no retrospective re-migration).
- contents post cache sha256 =
  939b28077973c3995c6d78aa8c4f55543232b8d5ed2a153f481ca4f9c9e569d9.
- Slug/title/date confirmed (NO discrepancy): slug
  a-contemporary-history-of-the-muslim-world-contents; title "A contemporary
  history of the Muslim world: contents"; date 2017-01-20T13:22:50+00:00.
- Re-scoped per the Scope Fence into C1b-11k-a-a (seam, D-Tool-27 + D-Tool-28)
  + C1b-11k-a-b (migration, resolves L-013).
Test checklist result (pass/fail per item) — recon only; no write at close
- git status --porcelain clean at open: pass
- test-integrity INTEGRITY OK at open: pass
- LOCKED_DECISIONS_SHA256 = 6d8ccb50... matches C1b-11k at open: pass
- import-post.js D-Tool-27 tableBare implemented; figure.wp-block-table rule
  and all <p>-keyed regexes byte-identical; node --check passes: pass
- non-regression (pilot 80 / ctn 34 quote[3] len=240 / update 2 / 19 content
  files byte-identical) with tableBare applied: pass
- contents re-recon with tableBare applied: {paragraph:3,table:1} (4 blocks),
  img_para_leftover = 1: STOP (second class confirmed)
- NEW structural class confirmed (imageBarePStrong): pass
- scope check (only this post affected; pilot unaffected): pass
- import-post.js REVERTED to C1b-11k committed state (tree clean): pass
- NOT written: content/en/*.json, feed.json, LOCKED_DECISIONS.txt,
  LOSS_LEDGER.md: pass
- test-integrity INTEGRITY OK at close: pass (tree untouched)
- hash-state captured: pass
Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1b-11k-a.md
- apps/blog/PARTIAL.md
- apps/blog/tools/milestones/C1b-11k-a-a.md (this is the next milestone's file)
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/LOSS_LEDGER.md
- apps/blog/tools/ROADMAP.md
