HANDOFF — Chat C1b-seam-bare-p: Represent bare-<p> bodies in the D-Tool-9 seam
Status: complete
Current chat id: C1b-seam-bare-p
Current milestone: C1b-seam-bare-p
Completed milestones: 00,01,02,03,04,05a,05a-fix,05b-removal,W1,W1-fix,
06,06b,07,08,09,C1a,C1-tool,C1-tool-p2,C1-model,C1-tool-cleanup,B1a,
C1-tool-seam-complete,C1b-01,C1b-seam-bare-p,C1b-02
Next chat id: C1b-03
Context windows used: 1

## Files created/modified (exact paths)
- Modified: apps/blog/tools/import-post.js
  (extractHtmlBlocks TOP list: ONE new entry, kind "paragraphBare", regex
  /<p\b(?![^>]*\bclass="[^"]*\bwp-block-)[^>]*>[\s\S]*?<\/p>/i ; and
  blockFromFragment: first guard widened to
  `if (kind === "paragraph" || kind === "paragraphBare")`.
  No exported signature changes; no other function touched.)
- Created: apps/blog/content/en/update.json
  (written by import-post.js --from html from the cached live dump; 2 blocks,
  census {paragraph:2}; slug=update, lang=en, title=Update,
  date=2017-11-01T22:38:58+00:00, no excerpt field.)
- Created: apps/blog/HANDOFF-C1b-seam-bare-p.md (this file)
- Modified: apps/blog/tools/LOCKED_DECISIONS.txt (D-Tool-19 appended)
- Modified: apps/blog/tools/LOSS_LEDGER.md (L-008 open -> resolved; note
  rewritten to record the resolution and its evidence)
- Modified: apps/blog/tools/ROADMAP.md
  (C1b-seam-bare-p and C1b-02 moved to Done; C1b-03 becomes the next item;
  series relabelled C1b-03..19 -> C1b-04..19)
- Modified: apps/blog/HANDOFF-CURRENT.txt (pointer -> this handoff)
- Regenerated: apps/blog/assets/data/feed.json (via generate-index.js;
  now 3 entries: jews-in-palestine-before-israel, controlling-the-narrative,
  update)
- NOT modified: posts.json (read-only, UNTRUSTED, retained until C1b-DONE),
  content/en/controlling-the-narrative.json, content/en/jews-in-palestine-
  before-israel.json, renderer.js, router.js, app.js, parser.js, fetcher.js,
  generate-index.js, hash-state.js, test-integrity.js, context.md, workflow.md,
  index.html, assets/css/style.css.

## The headline
Taught the D-Tool-9 extraction seam to represent posts whose body is a BARE
<p> (no wp-block-* markers). Locked as D-Tool-19 — the second deliberate,
narrow extension of the D-Tool-9 seam freeze (the first was D-Tool-18 in
C1b-01). Migrated the EN post `update` (2 blocks) from the cached live HTML,
regenerating feed.json to 3 entries and resolving L-008 (the whole-post loss
that made `update` unrepresentable and blocked C1b-02).

C1b-02 (migrate `update`) is closed THIS milestone: its sole acceptance
criterion (update.json exists, census {paragraph:2}, verified from live HTML)
was met here. This is a deliberate, recorded deviation from C1b-02's own
milestone text ("BLOCKED -> Next (re-opened)"): a re-open chat would have had
nothing left to do. See Known issues.

## Pre-flight (captured before any write)
- git status --porcelain: empty (clean tree; do not start on a dirty tree).
- node apps/blog/tools/test-integrity.js: INTEGRITY OK.
- node apps/blog/tools/hash-state.js:
  LOCKED_DECISIONS_SHA256=bb2419a11b9f75ef1e8e5fce8e94d1a973e774cf8cf88f2db29e27d259412f65
  CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
  GIT_HEAD=23b2f2b6d0f2fcc505bae11b35c155d91abdfe2b  GIT_DIRTY=false
- Pre-patch reproduction of L-008 (unpatched seam on the cached update dump):
  `error: extractHtmlBlocks: no recognised blocks in entry-content`. This
  confirms the bug is deterministic and the cache is intact.

## The plan (as executed)
One file, one place: import-post.js. Add a bare-<p> rule to the TOP list in
extractHtmlBlocks (kind "paragraphBare"), positioned AFTER all wrapper entries
so the left-to-right skip-and-continue loop consumes blockquote/figure/
div.wp-block-* whole first and never reaches a nested <p>. Handle the new kind
in blockFromFragment identically to "paragraph". Then recon -> migrate ->
non-regression -> regenerate feed -> integrity -> docs.

## Verification (all from the cached live dump; deterministic)
- Recon: import-post.js --from html (update) -> blocks=2, census
  {"paragraph":2}. Matches L-008's claim exactly (two bare <p>).
- Content check: block[0] = the "I have been contacted by a few people…"
  paragraph (link + entities intact per D-Tool-15); block[1] =
  "Gerard Farrell, Dublin, 1 November 2017". Not empty, not Share markup.
- update.json shape: slug=update, lang=en, title=Update,
  date=2017-11-01T22:38:58+00:00 (matches posts.json), nblocks=2, hasExcerpt=false.
- Non-regression — pilot (jews-in-palestine-before-israel): blocks=80,
  census {"image":15,"paragraph":62,"quote":2,"table":1}. Block count unchanged;
  the bare-<p> rule did not swallow any wrapper-internal paragraph.
- Non-regression — C1b-01 (controlling-the-narrative): blocks=34, census
  {"image":5,"paragraph":24,"quote":4,"footnotes":1}, quote[3] len=240.
  Exact match to the C1b-01 handoff. No regression.
- generate-index.js: 3 entries; order date-descending
  (jews-in-palestine 2024-04-03, controlling-the-narrative 2023-11-27,
  update 2017-11-01); update excerpt starts "I have been contacted…".
- test-integrity.js (re-run): INTEGRITY OK.
- git status --porcelain: exactly feed.json (M), import-post.js (M),
  update.json (??).

## The commit
50ffad5  C1b-seam-bare-p: D-Tool-19 bare-<p> seam; migrate update; resolve L-008
(9 files changed, 282 insertions(+), 34 deletions(-).)

## Known issues / tooling findings (durable — read before the next chat)
1. APPLY MECHANISM CORRUPTS MARKDOWN PROSE: applying the LOSS_LEDGER L-008 row
   via the IDE Apply mechanism rewrote `wp-block-*` -> `wp-block-_` (two
   occurrences), silently, and a control `grep` showed 0 remaining `wp-block-*`
   in the file. The `.js` seam was NOT affected (its `[\s\S]*?` survived), so
   the bug is content-dependent and can pass node --check. Rule adopted: do
   NOT use Apply for byte-exact edits to tools/*.md and tools/*.txt. Use a
   single verified terminal command (sed -i on one line, or a Node script).
2. RUN BUTTON INTERMITTENT ON MULTI-COMMAND BLOCKS: observed twice this
   session (a mangled multi-line `git restore` line; a dropped second `sed`).
   Create-new-file is consistent; Run is the unreliable one, notably for two
   consecutive `sed` commands in one click. Rule adopted: ONE command per
   execution, verify each before moving on.
3. OUT-OF-BAND ROADMAP EDIT DETECTED AND REVERTED: during this chat ROADMAP.md
   was found to have lost `C1-tool-seam-complete` and `B1` from Next and to
   have had `C1b-03..19` renamed to `C1b-04..19` — none of which any instruction
   in this chat requested. Cause unattributed. We restored ROADMAP from HEAD
   (git checkout --) and re-applied only the intended edits, verified by diff;
   C1-tool-seam-complete and B1 are intact (context lines in the final diff).
   Single-source rule enforced: the tree is the truth, not the transcript.
4. DELIBERATE DEVIATION: C1b-02 closed as Done within this milestone (see The
   headline). Its milestone text said BLOCKED -> Next. Recorded here rather
   than silently reconciled.
5. STALE/TENSION ITEM (pre-existing, NOT touched this chat): ROADMAP's Done/
   Next still reflects history inconsistently in places unrelated to C1b. Out
   of scope; left for a future roadmap cleanup. Nothing C1b-03 depends on.

## Next chat
id: C1b-03. Milestone file: apps/blog/tools/milestones/C1b-03.md (authored at
this chat's close). Goal: migrate the next EN slug from the live HTML using
--from html (SOURCE IS ALWAYS THE LIVE HTML; posts.json is UNTRUSTED and must
not be read). Corpus is KNOWN to contain posts with core/embed (L-004..L-006,
deferred) and bare-<p> posts (L-008, now handled). Each NEW structural class
requires its own seam-extension milestone + locked decision before the affected
slug migrates.

## Input hashes (inputs only, convention (b) — capture after all writes)
LOCKED_DECISIONS_SHA256=968cfa643e159e32ba76fad9d011871d5aba0b22ac1ccf9f505f803e62bd859d
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
(As predicted: LOCKED_DECISIONS changed from bb2419a1… — deliberate, D-Tool-19
appended. CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL unchanged, 36d1164a… .)
