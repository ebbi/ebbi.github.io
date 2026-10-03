# HANDOFF — C1b-04: Migrate part-22 (Kosovo #2) from the live HTML

## Status
DONE. part-22 migrated; feed.json now 4 entries; test-integrity green;
no new seam class (no D-Tool-21); L-010 recorded (deferred).

## What C1b-04 did
Migrated `a-contemporary-history-of-the-muslim-world-part-22-kosovo-2`
from the live HTML (`--from html`) into content/en/, regenerated the index
(feed.json 3 -> 4 entries), and proved the census against the live source.
No seam change this milestone: C1b-03's D-Tool-20 already covered the
slug's bare `<p><img>` class, so recon matched exactly and no extension
was needed.

## Evidence (live, this session)
- Recon + canonical census: blocks=59, `{image:4,paragraph:55}`,
  img_para_leftover=0, excerpt field absent (`excerpt=false`).
- Canonical file keys exactly: ["slug","lang","title","date","blocks"].
- date = 2020-10-01T19:28:51+00:00 (matches the live post).
- title = "A contemporary history of the Muslim world, part 22: Kosovo #2".
- feed.json: 4 entries, date-desc: pilot (2024-04-03), ctn (2023-11-27),
  part-22 (2020-10-01), update (2017-11-01).
- Non-regression (`--from html`, unchanged):
  - jews-in-palestine-before-israel 80 `{image:15,paragraph:62,quote:2,table:1}`
  - controlling-the-narrative 34 `{image:5,paragraph:24,quote:4,footnotes:1}`,
    quote[3] len = 240 (D-Tool-18 canary)
  - update 2 `{paragraph:2}`
- `tools/test-integrity.js` -> INTEGRITY OK.

## Hashes (inputs only; volatile facts are in the commit body)
LOCKED_DECISIONS_SHA256=ae06f1182c298543235ab8d02a0fdd1c30f91d0321de61ee0ac69444c38f3b6a
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

## Files changed this milestone
- apps/blog/content/en/a-contemporary-history-of-the-muslim-world-part-22-kosovo-2.json (NEW)
- apps/blog/assets/data/feed.json (3 -> 4 entries)
- apps/blog/tools/LOSS_LEDGER.md (L-010 row + note; deferred)
- apps/blog/tools/ROADMAP.md (C1b-04 -> Done; C1b-05 -> Next; rolling 05..19 -> 06..19)
- apps/blog/HANDOFF-CURRENT.txt (pointer -> this file)
- apps/blog/HANDOFF-C1b-04.md (this file)
- apps/blog/tools/milestones/C1b-05.md (authored at close, WORKFLOW step 7)
Not changed: no seam file (D-Tool-20 frozen); no renderer/router/app/parser/fetcher;
posts.json untouched (read-only, order only); LOCKED_DECISIONS.txt unchanged.

## Deviation: milestone C1b-04 had no Interfaces section
The C1b-04 milestone file carried no `## Interfaces` block. This was
CONFIRMED DELIBERATE by the human before the write: C1b-04 introduces no
new symbol, changes no call site, and adds no new data contract (it
consumes import-post.js `--from html` and generate-index.js exactly as
frozen). Recorded here so the audit trail reflects an intentional EMPTY
Interfaces set, not a truncation. Future milestones should still fill it
when any interface actually changes.

## New loss recorded (deferred, NOT fixed here)
- L-010: generate-index.js buildExcerpt() decodes entities but does NOT
  strip HTML tags; part-22's first paragraph block begins with an inline
  `<a href>`, so the DERIVED feed.json excerpt for that entry renders raw
  anchor markup as text in the list view. The CONTENT file is faithful
  (census {image:4,paragraph:55}); the defect is confined to the derived
  index excerpt. generate-index.js is fence-excluded from C1b-04; fix
  belongs to a generate-index / list-view milestone (see 10b for the
  list panel). Not a seam issue: no D-Tool entry.

## Open warnings / known issues for the next chat
1. ROADMAP.md (and any tools/*.md) whitespace does NOT survive copy into
   the chat. Anchor all edits from `sed -n 'A,Bp' FILE | cat -A` or
   `hexdump -C`, never from pasted transcript text. (Same warning carried
   from C1b-03.)
2. Edit-script pitfall found this milestone: a `findIndexOf("## Header")`
   anchor whose call site then does `splice(idx + 1, ...)` inserts BELOW
   the header, not above it. To place an entry at the END of a section
   that is immediately followed by another `## Header`, insert AT the
   header index (or above a guaranteed blank line), and VERIFY
   POSITIONALLY (assert which section the new line landed in), not by
   substring presence. A substring check is ambiguous when a "Done" entry
   reuses a line prefix that also exists in "Next".
3. The stale "## The commit" line in `HANDOFF-C1b-seam-bare-p.md`
   (pointed at 50ffad5) is STILL stale. Not fixed in C1b-03 or C1b-04
   (outside both milestones' fences). Flagged again so a future cleanup
   milestone reconciles it. True C1b-03 commit HEAD was 5ab2656d
   (confirmed by hash-state.js at C1b-04 open).
4. LOSS_LEDGER.md table padding is mixed: rows L-001..L-008 are
   column-aligned; L-009 and L-010 use minimal single-space padding.
   Markdown renders both identically; a later tidy-up may normalize.

## What the next milestone (C1b-05) must do
Migrate `a-contemporary-history-of-the-muslim-world-part-21-bosnia-2`
from the live HTML (`--from html`) into content/en/, prove its census
against the live source, and regenerate feed.json (now 5 entries). Then
re-run non-regression on the four migrated slugs. See
tools/milestones/C1b-05.md. If a NEW structural class appears, C1b-05
becomes a seam-extension milestone with its own LOCKED_DECISIONS entry
(D-Tool-21) and the slug defers again.
