HANDOFF — Chat C1-tool-p2: Wire extractHtmlBlocks() (HTML->blocks)

Status: partial
Current chat id: C1-tool-p2
Current milestone: C1-tool-p2
Completed milestones: 00,01,02,03,04,05a,05a-fix,05b-removal,W1,W1-fix,
06,06b,07,08,09,C1a,C1-tool
Next chat id: C1-model
Context windows used: 1

## Files created/modified (exact paths)

- Modified: apps/blog/tools/import-post.js
  (body of extractHtmlBlocks() ONLY + module-local helpers
  sliceEntryContent/blockFromFragment/innerOf/attrOfFirst/
  captionOf/extractTable/firstTitle/firstDate. Seam D-Tool-9
  preserved. Return shape is {title,date,blocks} to match
  extractFromPostsJson / the frozen seam.)
- Created: apps/blog/HANDOFF-C1-tool-p2.md (this file)
- NOT modified: everything else. posts.json still on disk.

## THE HEADLINE FINDING (read before anything else)

- The 30-block pilot content/en/jews-in-palestine-before-israel.json
  is NOT a faithful capture of the source post. The faithful
  extraction yields 80 blocks; the pilot has 30. The diff shows the
  pilot is MISSING the bulk of the post's prose (opening paragraphs,
  Merneptah/Babylon/Byzantine/early-Islam etc.), not merely 2 blocks.
- Therefore the pilot is a PARTIAL capture (not "post minus a quote
  and a table"). The earlier C1-tool-p2 draft of this handoff
  understated this as a 2-block gap; that was wrong. Corrected here.
- Consequence: the pilot MUST NOT be treated as ground truth for
  completeness, and the C1a-locked output shape may itself be wrong
  for full posts. This is a CONTENT-MODEL decision, not a tool bug.
- Next chat C1-model resolves: is the post a _full_ document (pilot is
  a defect to regenerate) or a _summary+images_ model (extractor and
  content/ disagree on what a "post" is)? Decision belongs in
  LOCKED_DECISIONS.

## Frozen decisions made in this chat

- D-Tool-12 Adopted Option B: extractHtmlBlocks is FAITHFUL. Emits
  quote and table and all prose the HTML contains.
- D-Tool-13 The pilot is a LOSSY/PARTIAL subset (30 vs 80 blocks).
  MUST NOT be treated as ground truth. (Corrected from the
  initial "2 blocks missing" claim.)
- D-Tool-14 Captions extracted as raw inner HTML with a single <em>
  unwrapped; entities NOT decoded. To match pilot image
  captions.
- D-Tool-15 Table block shape UNFROZEN: draft {type:"table",
  rows:[[cell,...]]}. Reconcile with renderer.js before use.
- D-Tool-16 Title/&nbsp;: extractor returns "Jews in Palestine
  before&nbsp;Israel"; pilot has a literal space. UNDECIDED:
  decode or keep raw. Recorded, not silently normalised.

## Hashes (inputs only — see tools/WORKFLOW.md, convention (b))

LOCKED_DECISIONS_SHA256=57441c6bb8fc1e19044bc9b0ce44d1f67ec4ee1c71305289c97237067e9a0b86
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=071d1fe7dc762397e389c22ec036f7092aac6dc67c0458e6f130b1d4aa5a5c4e
SCHEMA_SHA256= OMITTED (Option 2 — no tools/schema.json)

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, per WORKFLOW.md step 6.

## Expected delta for the next chat

- C1-model (next, NOT a tool chat): decide the content model
  (full post vs summary+images), reconcile the quote/table shapes
  with renderer.js, decide the title &nbsp; rule, and only THEN
  either regenerate the pilot from --from html or amend the
  extractor to a (then-LOCKED) reduced shape. Do not author C1b-01
  until the model is settled.

## Human edits made outside tooling (structured)

- Maintainer requirement (governing): the blog content must be a
  COMPLETE mirror of the existing blog; a lossy subset makes the App
  useless. This is why faithful (B) was chosen and why the pilot's
  30-vs-80 gap is now a headline finding.
- Maintainer delivered raw HTML by opening /tmp/pilot.html in an
  editor and pasting (valid delivery path; --dump-html/fetchRaw
  proven to produce the file).
- Maintainer declined Agent Mode (unreliable with this model).
  Delivery stays chat + heredoc/apply.

## Open warnings (count + links only)

- W1. .gitignore for tools/.cache/ still unverified.
- W2. hash-state.js output keys still unverified.
- W4. Table block shape UNFROZEN (D-Tool-15).
- W5. Title &nbsp; handling UNDECIDED (D-Tool-16).
- W6. Content-model conflict: content/ pilot (30) vs faithful HTML
  (80). Escalated to C1-model. Link: this handoff, headline.

## Deviations from locked decisions

- Deviation C1-tool-p2-D1: --from html yields 80 blocks vs pilot 30.
  INTENDED consequence of D-Tool-12 + the "complete mirror"
  requirement. The milestone Test 9/10 expected values (30 / empty)
  are WRONG and are superseded. Reported, not hidden.
- Deviation C1-tool-p2-D2: extractor body was written against one
  sample; correctness asserted by inspection, then VALIDATED by this
  run (node --check pass; run produced 80 blocks of the 4 expected
  types). The one bug found on first run (return-shape) was fixed.

## Partial work

- extractHtmlBlocks is written and RUNS. Remaining: reconcile quote
  and table shapes with renderer.js; decide the content model. No
  PARTIAL.md (status partial is milestone-shaped).

## Blocked reason

- Not blocked. Next step is a DECISION (content model), not an input.

## Known issues / TODOs

- Resolve 30-vs-80 content-model question (C1-model).
- Reconcile quote/table shapes with renderer.js (D-Tool-15).
- Decide title &nbsp; rule (D-Tool-16).
- C1b-01..19 + C1b-DONE NOT yet authored; gated on the model.
- test-integrity.js does not cover import-post.js or content/.

## Assumptions the next chat may rely on

- Seam frozen (D-Tool-9): only extractHtmlBlocks' body changes.
- fetchRaw / --dump-html proven (produced /tmp/pilot.html, cache
  under tools/.cache/import-post/).
- extractHtmlBlocks RUN and produced 80 blocks:
  {image,paragraph,quote,table} from one WP sample.
- extractFromPostsJson proven (Part 1, Test 5 empty diff).
- Output shape C1a-locked (per file) but its CORRECTNESS is in doubt;
  see W6.
- posts.json stays on disk until C1b-DONE proves 20/20.

## Test checklist result (pass/fail per item)

9.  --from html -> RAN. Result: 80 blocks (pilot expected 30).
    FAIL vs milestone expected value; PASS vs faithful-extraction
    intent (D-Tool-12). Real number: 80.
10. diff vs pilot -> RAN. NON-EMPTY: extractor emits ~50 source
    paragraphs absent from the pilot, plus the title &nbsp; diff.
    Expected under D-Tool-12/D-Tool-13.
11. node --check import-post.js -> PASS (silent, exit 0).
12. test-integrity.js -> NOT yet run this chat; run before commit.
13. git status --porcelain -> NOT yet run; expect import-post.js +
    HANDOFF-C1-tool-p2.md + HANDOFF-CURRENT.txt (+ ignore notes/).

## Files to read in the next chat (exact paths)

- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1-tool-p2.md
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/ROADMAP.md
- apps/blog/tools/milestones/C1-tool.md
- apps/blog/tools/import-post.js
- apps/blog/assets/js/renderer.js <-- reconcile quote/table shapes
- apps/blog/assets/js/parser.js <-- block-type contract
- apps/blog/content/en/jews-in-palestine-before-israel.json
