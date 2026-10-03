HANDOFF — Chat C1b-11k-a-a: Extend the D-Tool-9 seam (tableBare + imageBarePStrong)
Status: DONE (seam frozen: D-Tool-27 + D-Tool-28; no slug migrated)
Current chat id: C1b-11k-a-a
Current milestone: C1b-11k-a-a
Completed milestones: C1a, C1-tool, C1-tool-p2, C1-model, C1-tool-cleanup,
C1-tool-seam-complete, C1b-01, C1b-seam-bare-p, C1b-02, C1b-03, C1b-04,
C1b-05, C1b-06, C1b-07, C1b-08, C1b-09a, C1b-09b, C1b-10, C1b-11, C1b-11a,
C1b-11b, C1b-11c, C1b-11d, C1b-11e (partial/STOP — re-scoped), C1b-11e-a,
C1b-11e-b, C1b-11f, C1b-11g, C1b-11h (partial/STOP — re-scoped), C1b-11h-a,
C1b-11h-b, C1b-11i, C1b-11j, C1b-11k (partial/STOP — re-scoped),
C1b-11k-a (partial/STOP — re-scoped), C1b-11k-a-a
Next chat id: C1b-11k-a-b
Context windows used: 1
Files created/modified (exact paths)
- apps/blog/tools/import-post.js (MOD; seam: D-Tool-27 tableBare entry +
  D-Tool-28 imageBarePStrong entry in the TOP list; two new blockFromFragment
  branches — imageBarePStrong identical to imageBareP, tableBare identical to
  the existing table kind. diff = +56 pure additions, 0 deletions)
- apps/blog/tools/LOCKED_DECISIONS.txt (MOD; D-Tool-27 + D-Tool-28 frozen)
- apps/blog/tools/LOSS_LEDGER.md (MOD; L-013 row added + detailed L-013 note)
- apps/blog/tools/milestones/C1b-11k-a-b.md (MOD; measured census recorded)
- apps/blog/tools/ROADMAP.md (MOD; C1b-11k-a-a -> STATUS: DONE; seam count
  note updated; Next updated)
- apps/blog/HANDOFF-C1b-11k-a-a.md (NEW; this file)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> HANDOFF-C1b-11k-a-a.md)
Frozen decisions made in this chat
- D-Tool-27 `tableBare`: a CLASS-LESS bare top-level `<table>` (no class
  attribute) is promoted to the EXISTING `table` shape
  { type:"table", content:<inner HTML of <table>> }. Regex
  `/<table\b(?![^>]*\bclass=)[^>]*>[\s\S]*?<\/table>/i`, placed AFTER
  divBareImg (D-Tool-26) and ADJACENT to the existing figure.wp-block-table
  entry; blockFromFragment handled identically to the existing `table` kind.
  The TENTH narrow extension of the D-Tool-9 seam freeze.
- D-Tool-28 `imageBarePStrong`: a bare `<p>` (class absent OR lacking
  "wp-block-") whose ENTIRE content is a single `<strong>`-wrapped `<img>` is
  promoted to the EXISTING `image` shape { type:"image", src, caption:"" }.
  Regex
  `/<p\b(?![^>]*\bclass="[^"]*\bwp-block-)[^>]*>\s*<strong>\s*<img\b[^>]*\/?>\s*<\/strong>\s*<\/p>/i`,
  placed AFTER imageBarePEm (D-Tool-23) and BEFORE paragraphBare (D-Tool-19);
  handled identically to imageBareP. The ELEVENTH narrow extension.

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=465f8c1138b2cc195506b13926188d28b14c5a694d24fb526227630d178710a7
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, NOT in the handoff. See tools/WORKFLOW.md step 6.
Expected delta for the next chat (C1b-11k-a-b — migration)

- Migrate the contents post
  `a-contemporary-history-of-the-muslim-world-contents`
  (`https://twolegsbadblog.wordpress.com/2017/01/20/a-contemporary-history-of-the-muslim-world-contents/`)
  via `--from html` into
  content/en/a-contemporary-history-of-the-muslim-world-contents.json.
  Recon MEASURED the census {table:1, image:1, paragraph:2} (4 blocks); all
  `*_para_leftover` = 0; the 24 raw `<img>` accounted for (23 subsumed by the
  single `table` block [inner HTML len 29665] + 1 imageBarePStrong
  `afghans1.png`, data-attachment-id 10954); the 2 paragraph blocks are the
  post's EMPTY `<p> </p>` spacers (pre-existing paragraphBare behaviour).
- feed.json 19 -> 20 entries (date-desc; the post's date 2017-01-20 sits
  between part-10's 2017-01-06 and part-11's 2017-02-08, so it sorts AFTER
  part-11 (idx 14) and BEFORE part-10 (idx 15)). Verify POSITIONALLY.
- Flip L-013 to resolved; author C1b-DONE.md (the final 20/20 check).
Human edits made outside tooling (structured)
- None. Tree was clean at open (last commit 20c51e7, C1b-11k-a STOP) and
  dirty at close (import-post.js + LOCKED_DECISIONS.txt + LOSS_LEDGER.md +
  milestones + ROADMAP + handoffs).
Open warnings (count + links only)

1. tools/*.md whitespace may not survive chat copy; anchor edits from `cat -A`. (carried C1b-03/04)
2. Edit splice pitfall: verify POSITIONALLY, not by substring. (carried C1b-04)
   RE-TRIPPED here (first attempt) — an anchor-matched MultiEdit consumed
   D-Tool-24/25/19 and replaced them with D-Tool-28; caught by the diffstat
   (467 deletions) and reverted with `git checkout --`; re-done with
   single_find_and_replace using longer unique anchors. Always check the
   diffstat shows pure additions before proceeding.
3. Stale "## The commit" line in HANDOFF-C1b-seam-bare-p.md (points at 50ffad5) — still unfixed. (carried)
4. LOSS_LEDGER.md table padding mixed (cosmetic). (carried)
5. (carried C1b-07, process) prior chat initially routed shell to the human; resolved.
6. hash-state.js FILE_TREE_SHA256 capture rule: capture AFTER staging; see
   C1b-09a deviation note. (carried)
7. (carried C1b-11a) milestone regex lookahead vs task-text transcription
   (missing `*` quantifiers). Frozen-form regex used.
8. (recurring) a 0-byte stray file appears at repo root; none present this
   chat (git status clean at open).
9. (carried C1b-11h) SILENT-loss metric gap: a DROPPED (not leaked) class is
   invisible to `*_para_leftover`; always reconcile the raw `<img>`/`<iframe>`
   count against the rendered block count. The contents post's 2nd-cell
   thumbnail `<img>` were dropped entirely; only the raw-`<img>` (24) vs
   rendered-image reconciliation exposes them. tableBare now subsumes 23 of
   them.
Deviations from locked decisions (must be empty, or explain)
- None. The seam change is exactly the two frozen entries; the
  figure.wp-block-table rule and every `<p>`-keyed regex are BYTE-IDENTICAL;
  no content file written; posts.json untouched; every non-regression target
  unchanged.
Partial work (link to PARTIAL.md if present)
- None. C1b-11k-a-a completed its full scope.
Known issues / TODOs
- L-006 stays RESOLVED (part-8, C1b-11i); L-012 stays RESOLVED (part-9,
  C1b-11h-b); L-010 stays DEFERRED (feed excerpt; not C1b). L-013 authored
  here (resolved by C1b-11k-a-b).
- Tolerance note: ANY further new class STOPS and re-scopes (its own
  milestone).
- Remaining unmigrated series EN posts after C1b-11k-a-b: NONE. C1b-11k-a-b is
  the LAST EN post; then C1b-DONE proves 20/20 and posts.json deletion is
  unblocked.
- The contents post emits TWO EMPTY paragraph blocks from its `<p> </p>`-style
  spacers; pre-existing paragraphBare behaviour, NOT a new class.
Assumptions the next chat may rely on
- The seam is now frozen through D-Tool-28.
- D-Tool-27 tableBare placement: AFTER divBareImg, ADJACENT to (immediately
  before) the existing figure.wp-block-table entry. Non-overlapping (one keys
  on `<figure>`, the other on a class-less `<table>`).
- D-Tool-28 imageBarePStrong placement: AFTER imageBarePEm (D-Tool-23) and
  BEFORE imageBarePTrailing (D-Tool-24) / embedInBareP (D-Tool-25) /
  paragraphBare (D-Tool-19).
- CRITICAL non-regression: the pilot's bare `<table>` is WRAPPED in
  `<figure class="wp-block-table aligncenter">`, so the earlier `table` entry
  consumes it whole and tableBare does NOT fire for the pilot (its {table:1}
  census is UNCHANGED). Verified.
- Seam-READY re-recon of the contents post: {table:1,image:1,paragraph:2}
  (4 blocks), all `*_para_leftover` = 0; the single table block carries the
  inner HTML of the `<table>` (colgroup/tbody/tr/td, links+images verbatim,
  len 29665); the imageBarePStrong block is `afghans1.png` (src verbatim);
  the 2 paragraph blocks are EMPTY.
- Scope: both new classes occur ONLY in the contents post (2 cache copies;
  canonical `c380869b...` + slug-redirect copy); 0 occurrences in all 20 other
  cached sources. NO shipped slug affected (no retrospective re-migration).
- content/en/jews-in-palestine-before-israel.json remains the pilot (80
  blocks; sha unchanged).
Test checklist result (pass/fail per item)
- git status --porcelain clean at open: pass
- test-integrity INTEGRITY OK at open: pass
- LOCKED_DECISIONS_SHA256 = 6d8ccb50... matches C1b-11k-a at open: pass
- node --check import-post.js: pass
- diff = pure additions (+56, 0 deletions) after the splice re-do: pass
- D-Tool-27 tableBare + D-Tool-28 imageBarePStrong frozen in
  LOCKED_DECISIONS.txt: pass
- figure.wp-block-table rule and all `<p>`-keyed regexes byte-identical: pass
- contents re-recon {table:1,image:1,paragraph:2} (4 blocks), all
  `*_para_leftover` = 0; 24 raw `<img>` accounted for (23 table + 1
  imageBarePStrong): pass
- non-regression (pilot 80 / ctn 34 quote[3] len=240 / update 2 / part-7..22;
  ALL 19 committed content/en/*.json re-extract BYTE-IDENTICAL): pass
- NOT written: content/en/*.json, feed.json, posts.json: pass
- test-integrity INTEGRITY OK at close: pass
- hash-state captured: pass
Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1b-11k-a-a.md
- apps/blog/tools/milestones/C1b-11k-a-b.md (this is the next milestone's file)
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/LOSS_LEDGER.md
- apps/blog/tools/ROADMAP.md
