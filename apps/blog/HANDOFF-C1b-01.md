HANDOFF — Chat C1b-01: Migrate controlling-the-narrative from live HTML

Status: complete
Current chat id: C1b-01
Current milestone: C1b-01
Completed milestones: 00,01,02,03,04,05a,05a-fix,05b-removal,W1,W1-fix,
06,06b,07,08,09,C1a,C1-tool,C1-tool-p2,C1-model,C1-tool-cleanup,B1a,
C1-tool-seam-complete,C1b-01
Next chat id: C1b-02
Context windows used: 1

## Files created/modified (exact paths)

- Created: apps/blog/content/en/controlling-the-narrative.json
  (written by import-post.js --from html; 34 blocks; see verification below)
- Created: apps/blog/HANDOFF-C1b-01.md (this file)
- Modified: apps/blog/tools/import-post.js
  (blockFromFragment quote case: cite-carrying fix for L-007; see The
  headline. Seam otherwise untouched; no exported signature changes.)
- Modified: apps/blog/tools/LOSS_LEDGER.md
  (L-001 corrected 38→34; L-007 added, resolved)
- Modified: apps/blog/tools/LOCKED_DECISIONS.txt (D-Tool-18 appended)
- Modified: apps/blog/tools/ROADMAP.md (C1b-01 to Done; C1b-02 becomes Next)
- Modified: apps/blog/HANDOFF-CURRENT.txt (pointer → this handoff)
- Regenerated: apps/blog/assets/data/feed.json (via generate-index.js;
  now 2 entries: jews-in-palestine-before-israel, controlling-the-narrative)
- NOT modified: posts.json (read-only, UNTRUSTED, retained until C1b-DONE),
  renderer.js, CONTEXT.md, WORKFLOW.md, content/en/jews-in-palestine-\*.json,
  apps/blog/index.html, apps/blog/assets/css/style.css.

## THE HEADLINE

- The C1b-01 migration SOURCE is the live HTML extraction (--from html),
  NOT posts.json. posts.json is UNTRUSTED (front-truncated: its
  controlling-the-narrative entry holds 9 blocks; the live post has 34).
  LOCKED_DECISIONS NEW-1/NEW-2; LOSS_LEDGER L-001.
- Live census target WAS MET exactly: 34 blocks,
  {"image":5,"paragraph":24,"quote":4,"footnotes":1}.
- One content-level loss was found and closed in this milestone (L-007):
  the 4th <blockquote class="wp-block-quote"> carries its visible text in a
  <cite> element while its <p class="wp-block-paragraph"> is empty. The
  pre-fix quote case only collected <p> bodies, so it emitted "".
  The fix extends the inner scan to match <p> OR <cite>, keeping non-empty
  bodies, joined by "\n", falling back to the blockquote inner HTML if
  neither. Post-fix quote[3] len=240 (was 0).
- The fix is a deliberate, narrow extension of the D-Tool-9 seam freeze,
  recorded as D-Tool-18. It changes only the quote case's inner scan; no
  exported surface changes.
- The pilot (jews-in-palestine-before-israel.json) was checked and is
  UNAFFECTED: both pilot quotes carry their text in <p>, not <cite>.

## Frozen decisions made in this chat

- D-Tool-18 (appended to LOCKED_DECISIONS.txt): quote content, cite-carrying
  — see that file for the exact wording. This is the only decision made
  this chat.

## Hashes (inputs only — see tools/WORKFLOW.md, convention (b))

LOCKED_DECISIONS_SHA256=bb2419a11b9f75ef1e8e5fce8e94d1a973e774cf8cf88f2db29e27d259412f65
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256= OMITTED (Option 2 — no tools/schema.json)

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, per WORKFLOW.md step 6.

## Expected delta for the next chat

- C1b-02: migrate the NEXT EN post from the live HTML extraction
  (--from html), NOT posts.json, into content/en/<slug>.json. Its milestone
  file is authored at C1b-01's close — see C1b-02's milestone file
  (authored as part of this chat's close, listed under Files to read).
- C1b should continue to check each post for WP block types outside
  extractHtmlBlocks' TOP list (heading, list, divider, embed, gallery,
  pullquote, callout, resourceList, footnotes, attachment). Wed nesday's
  run of the series will hit idx 7 (part-17-algeria-2, one embed) and idx
  9 (part-15-the-afghan-arabs..., one embed) — L-004/L-005 deferred items
  will become live blocking concerns when C1b reaches those slugs.

## Human edits made outside tooling (structured)

- Maintainer ran the recon extractor; identified that posts.json front-
  truncation had already been proven by C1-tool-seam-complete (9 of 34) and
  restated the scope change.
- Maintainer applied the quote-case patch via the IDE Apply mechanism. An
  "Apply;" label token was injected into the source at the patch site; this
  passed node --check but threw at runtime ("Apply is not defined"),
  aborting the quote branch and masking the fix. Maintainer removed it with
  sed after bytes were inspected. The final verified diff shows only the
  intended change.
- Maintainer ran all checks and pasted outputs; confirmed the post-fix
  census and the corrected quote[3] head text.

## Open warnings (count + links only)

- W2. hash-state.js output keys still unverified; hash block filled at
  handoff time (inputs only, per convention (b)).
- W8. tools/import-post.md stray — status: see Known issues.

## Deviations from locked decisions

- One: D-Tool-9 (the seam is "frozen") was narrowly extended by D-Tool-18
  to fix L-007 (cite-carrying quote content loss). No other seam behavior
  changed. Recorded in LOSS_LEDGER.md and LOCKED_DECISIONS.txt.

## Partial work

- None.

## Blocked reason

- (n/a — status complete)

## Known issues / TODOs

- C1b-02..19 + C1b-DONE not authored (except C1b-02's milestone file, per
  WORKFLOW step 7, authored at this chat's close).
- extractHtmlBlocks covers image/paragraph/quote/table/footnotes only;
  heading, list, divider, embed, gallery, pullquote, callout, resourceList,
  attachment would be silently dropped. Carried forward for C1b.
- L-004..L-006 (embed, three slugs) remain deferred.
- W8: tools/import-post.md — resolve (rm or keep-untracked) before staging
  a milestone that touches tools/. This milestone touches tools/; W8 was
  not staged.
- The IDE "Apply" mechanism injected a label token into the source at patch
  site this chat. Do not trust a green node --check as proof the patch
  matched intent; always inspect git diff at the patch site.
- test-integrity.js does not cover renderer.js, content/, tools/import-post.js,
  or tools/.cache/.

## Assumptions the next chat may rely on

- content/en/controlling-the-narrative.json is canonical and matches the
  live 34-block extraction, including the new cite fix.
- content/en/jews-in-palestine-before-israel.json is unchanged (80 blocks).
- import-post.js's quote case now collects <p class="wp-block-paragraph"> and
  <cite> bodies in source order, skipping empties, joined by "\n".
- posts.json stays on disk until C1b-DONE proves 20/20.
- Host allowlist = twolegsbadblog.wordpress.com, https only.
- feed.json now has 2 entries (regenerated by generate-index.js).

## Test checklist result (pass/fail per item)

0. node --check import-post.js -> OK: PASS.
1. import-post.js --from html on controlling-the-narrative URL -> blocks=34
   excerpt=false: PASS.
2. Census == {"image":5,"paragraph":24,"quote":4,"footnotes":1}: PASS.
3. footnotes block present, len=1706, contains id=: PASS.
4. quote[3] len>0 and head begins "Anyone who wants to thwart": PASS (240).
5. quote[0..2] unchanged from pre-fix run (477/340/151): PASS.
6. Pilot quotes unaffected (343/426): PASS.
7. generate-index.js -> 2 entries: PASS.
8. test-integrity.js -> INTEGRITY OK: PASS.
9. git status --porcelain: only this milestone's file set (see stage step).

## Files to read in the next chat (exact paths)

- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1b-01.md
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/LOCKED_DECISIONS.txt (esp. NEW-1/NEW-2/NEW-3, D-Tool-18)
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/ROADMAP.md
- apps/blog/tools/LOSS_LEDGER.md
- apps/blog/tools/milestones/C1b-02.md (authored at this chat's close)
- apps/blog/tools/import-post.js (as modified)
- apps/blog/content/en/controlling-the-narrative.json (reference)
- apps/blog/assets/data/posts.json (read-only; to identify next slug)
