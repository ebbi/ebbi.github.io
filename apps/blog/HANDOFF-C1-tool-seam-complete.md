# Handoff — C1-tool-seam-complete

## Status: COMPLETE

## What this milestone did

Made extractHtmlBlocks() faithful to a post's <div class="entry-content">:

- the scan loop no longer BREAKS on an unmatched fragment; it skips the
  unknown fragment and CONTINUES (fixes tail-truncation);
- added core/footnotes handling to TOP + blockFromFragment;
- renderer.js renders a footnotes block as <ol class="footnotes"> (NEW-3);
- established tools/LOSS_LEDGER.md;
- froze replica-fidelity + live-HTML-oracle + posts.json-UNTRUSTED decisions.

## Evidence (controlling-the-narrative, live)

- DOM top-level blocks: 34 {paragraph:24, image:5, quote:4, footnotes:1}
- seam extraction: blocks=34 {image:5, paragraph:24, quote:4, footnotes:1}
- footnotes block: hasFootnotes true, len 1706, hasLiId true
- node --check import-post.js / renderer.js: clean

Target was corrected from 38 to 34 during execution. The 38 was a diagnostic
miscount: q5.js counted four <p> elements that are NESTED INSIDE four

<blockquote> quote blocks as top-level paragraphs. Byte inspection
(h.slice around DOM offset 6009) proved each sits immediately after
<blockquote class="wp-block-quote ...">. No paragraph is lost; they are
preserved within the quotes' content. LOSS_LEDGER L-003 records this as a
miscount, resolved.

## Key finding: posts.json is UNTRUSTED (front-truncated)

posts.json's controlling-the-narrative entry holds 9 blocks (~27%); the live
post has 34. It is front-truncated (opening/body lost) — same defect class as
the original C1a pilot (D-Tool-12). Therefore the C1b migration SOURCE is the
live HTML extraction (--from html), NOT posts.json. posts.json is retained on
disk only until C1b-DONE proves 20/20. (LOCKED_DECISIONS NEW-2; LOSS_LEDGER
L-001, open.)

## Files created

- apps/blog/tools/milestones/C1-tool-seam-complete.md
- apps/blog/tools/LOSS_LEDGER.md
- apps/blog/HANDOFF-C1-tool-seam-complete.md (this file)

## Files modified

- apps/blog/tools/import-post.js (loop skip-and-continue; footnotes)
- apps/blog/assets/js/renderer.js (footnotes case -> <ol class="footnotes">)
- apps/blog/tools/LOCKED_DECISIONS.txt (NEW-1, NEW-2, NEW-3)
- apps/blog/tools/ROADMAP.md (C1-tool-seam-complete inserted)
- apps/blog/HANDOFF-CURRENT.txt (pointer -> this file)

## Superseded

- apps/blog/tools/milestones/C1-tool-seam-footnotes.md — left on disk,
  unstaged, as history. Its premise (posts.json mostly faithful; only
  footnotes missing) was false; superseded by C1-tool-seam-complete.

## LOSS_LEDGER state

- L-001 posts.json front-truncation ............ open (C1b, source=live)
- L-002 footnotes dropped by seam ............. resolved (this milestone)
- L-003 "4 dropped paragraphs" ................ resolved (was a miscount)
- L-004..L-006 core/embed ..................... deferred (idx 7, 9, 18)

## Known issues the next chat must NOT mistake for bugs

- core/embed is intentionally NOT handled (deferred).
- posts.json is untrusted; do NOT migrate from it.
- The old q5.js DOM census prints "38" (counts quote-internal <p> as
  top-level). Correct top-level count is 34. Tool limitation, not a defect.
- The old q5b.js printed image:1 because it counted only <figure>-wrapped
  images; 4 of the 5 are <div class="wp-block-image">. Tool limitation.

## Next milestone

C1b-01 Migrate ONE EN post (controlling-the-narrative) to
content/en/controlling-the-narrative.json, SOURCE = live HTML extraction
(--from html), NOT posts.json. Diff must equal the 34-block census; any
discrepancy is recorded in LOSS_LEDGER.md, not silently reconciled.

````

---

## Then apply the pointer (last)

```sh
printf 'apps/blog/HANDOFF-C1-tool-seam-complete.md\n' > apps/blog/HANDOFF-CURRENT.txt
cat apps/blog/HANDOFF-CURRENT.txt
````

## Then verify the full set and stage

```sh
node apps/blog/tools/test-integrity.js
git status --porcelain
```
