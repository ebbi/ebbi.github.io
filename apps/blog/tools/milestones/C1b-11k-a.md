# Milestone C1b-11k-a — Extend the D-Tool-9 seam: class-less bare `<table>` (`tableBare`)

Status: next
depends on: C1b-11k

## Scope fence (read first)

This milestone extends the frozen D-Tool-9 extraction seam by ONE entry,
surfaced by recon for C1b-11k (migrate the series post
`a-contemporary-history-of-the-muslim-world-contents`). C1b-11k STOPPED per
its own Scope Fence because the live HTML contains a structural class the
seam as frozen through D-Tool-26 does NOT represent:

- Class `tableBare` (proposed D-Tool-27): a CLASS-LESS bare `<table>` (no
  `class` attribute at all) placed DIRECTLY at top level inside
  entry-content — the legacy WP.com layout table that holds the series
  contents grid. The only table rule in the frozen seam is the
  `<figure class="wp-block-table">` entry (kind "table"); it requires a
  `<figure>` wrapper and does NOT match a bare top-level `<table>`, and no
  other TOP entry matches a `<table>`. The loop's skip-and-advance logic
  therefore steps past `<table>`/`<colgroup>`/`<tbody>`/`<tr>`/`<td>`
  tag-by-tag, capturing the `<td>`-nested `<p align="center">` elements as
  paragraph blocks (raw `<img ...>` markup leaked into paragraph text — the
  L-009 defect shape; 13 occurrences) and DROPPING entirely every `<img>` not
  wrapped in a `<p>` (the second-cell thumbnails). Net effect on the contents
  post: raw `<img>` = 24, rendered image blocks = 0.

This is the TENTH narrow extension of the D-Tool-9 seam freeze (after
D-Tool-18 quote-cite, D-Tool-19 bare-`<p>`, D-Tool-20 bare-`<p><img>`,
D-Tool-21 legacy Jetpack embed, D-Tool-22 legacy `figure.wp-caption` image,
D-Tool-23 emph-wrapped bare-`<p><img>`, D-Tool-24 imageBarePTrailing, D-Tool-25
embedInBareP, D-Tool-26 divBareImg), and it MUST be frozen as its own
LOCKED_DECISIONS entry (D-Tool-27) in THIS milestone. This milestone does NOT
migrate any slug, does NOT regenerate feed.json, and does NOT fork the
migration. The L-013 ledger row (the silent loss of the contents-grid images
from this post) is authored in this milestone (the class is frozen here); the
post is migrated in C1b-11k-b. Recon evidence: apps/blog/PARTIAL.md.

## Objective

By the close of C1b-11k-a:

- The D-Tool-9 seam represents the class-less bare `<table>` faithfully,
  reusing the EXISTING `table` block shape (no new block type, no renderer
  change).
- D-Tool-27 is frozen in tools/LOCKED_DECISIONS.txt with the byte-exact
  regex, the shape reuse, and the non-regression evidence.
- L-013 is recorded in tools/LOSS_LEDGER.md (the silent contents-grid image
  loss discovered at C1b-11k recon; RESOLVED when the post is re-migrated in
  C1b-11k-b), so the row's `resolved-by` names C1b-11k-b.
- Non-regression holds: pilot 80 {image:15,paragraph:62,quote:2,table:1}; ctn
  34 {image:5,paragraph:24,quote:4,footnotes:1} quote[3] len=240; update 2
  {paragraph:2}; part-7..22 byte-identical.
- Re-recon of the contents post now yields the seam-READY census
  `{image:0, paragraph:N, table:1}` (N measured) with all
  `*_para_leftover = 0` — i.e. the seam is READY for C1b-11k-b.

## Opening reads (mandatory, before any write)

1. apps/blog/HANDOFF-CURRENT.txt
2. apps/blog/HANDOFF-C1b-11k.md
3. apps/blog/PARTIAL.md
4. apps/blog/tools/milestones/C1b-11k-a.md (this file)
5. apps/blog/tools/CONTEXT.md
6. apps/blog/tools/WORKFLOW.md
7. apps/blog/tools/LOCKED_DECISIONS.txt
8. apps/blog/tools/LOSS_LEDGER.md
9. apps/blog/tools/ROADMAP.md

## Pre-flight (read-only, paste outputs before any write)

- `git status --porcelain` (expect clean)
- `node apps/blog/tools/test-integrity.js` (expect INTEGRITY OK)
- `node apps/blog/tools/hash-state.js` (record SHAs; confirm LOCKED_DECISIONS
  matches C1b-11k's handoff)

## Interfaces

### Modified: apps/blog/tools/import-post.js

Add ONE entry to the `TOP` array in `extractHtmlBlocks()`.

ENTRY (D-Tool-27 `tableBare`), placed AFTER the `divBareImg` (D-Tool-26)
entry and BEFORE the existing `table` (`figure.wp-block-table`) entry — i.e.
adjacent to the table handling, so the bare top-level `<table>` is claimed
before every `<p>`-keyed entry while leaving the `figure.wp-block-table`
rule and every `<p>` rule byte-identical. (Placement relative to the
`figure.wp-block-table` entry is immaterial — they never overlap: one keys on
a `<figure>`, this one on a class-less `<table>` — but grouping them is
clearer.)

    {
      // D-Tool-27: legacy WP.com layout table — a CLASS-LESS bare <table>
      // (no class attribute at all) placed directly at top level inside
      // entry-content. Used by the series "contents" post to lay out the
      // series grid (12 rows of link-text | thumbnail cells). The only
      // table rule in the frozen seam keys on <figure class="wp-block-table">;
      // a bare top-level <table> matched NO entry, so the loop's
      // skip-and-advance logic stepped past <table>/<td>/<tr> tag-by-tag,
      // leaking the <td>-nested <p><img> markup into paragraph text (the
      // L-009 defect shape) AND dropping entirely every <img> not wrapped
      // in a <p> (silent loss — invisible to *_para_leftover). Promoted to
      // the EXISTING `table` shape { type:"table", content:<inner HTML> }
      // so the renderer (which does table.innerHTML = block.content) needs
      // no change and the whole grid renders faithfully (links, images and
      // all). Keys on a <table> whose open tag has NO class attribute (the
      // negative lookahead asserts no "class=" appears in the open tag).
      re: /<table\b(?![^>]*\bclass=)[^>]*>[\s\S]*?<\/table>/i,
      kind: "tableBare",
    },

Handle `kind === "tableBare"` in `blockFromFragment()` IDENTICALLY to the
existing `table` kind: extract the inner HTML of the `<table>` (WITHOUT the
outer `<table>` tag) and emit `{ type:"table", content:<inner>.trim() }`.
i.e.

    if (kind === "tableBare") {
      const tblM = /<table\b[^>]*>([\s\S]*?)<\/table>/i.exec(frag);
      if (tblM == null) return null;
      return { type: "table", content: tblM[1].trim() };
    }

The `figure.wp-block-table` table rule and every `<p>`-keyed regex
(imageBareP/imageBarePEm/imageBarePTrailing/embedInBareP/paragraphBare) and
the `<figure>`/`<div>` rules stay BYTE-IDENTICAL.

### New: none (no new exported symbol; module.exports unchanged)

## Files to Create

- apps/blog/HANDOFF-C1b-11k-a.md (WORKFLOW step 4)
- apps/blog/tools/milestones/C1b-11k-b.md (WORKFLOW step 7)

## Files to Modify

- apps/blog/tools/import-post.js (one TOP entry + blockFromFragment branch)
- apps/blog/tools/LOCKED_DECISIONS.txt (freeze D-Tool-27)
- apps/blog/tools/LOSS_LEDGER.md (add L-013 row: the silent contents-grid
  image loss)
- apps/blog/tools/ROADMAP.md (C1b-11k-a -> Done; adjust Next)
- apps/blog/HANDOFF-CURRENT.txt (pointer -> HANDOFF-C1b-11k-a.md)

## Files I will NOT touch

- apps/blog/content/en/*.json (no slug migrated this milestone)
- apps/blog/assets/data/feed.json (unchanged; 19 entries)
- apps/blog/assets/data/posts.json (UNTRUSTED; read-only)
- every other app file (router.js, app.js, parser.js, fetcher.js,
  renderer.js, generate-index.js, hash-state.js, test-integrity.js,
  CONTEXT.md, WORKFLOW.md, index.html, style.css)

## Decisions frozen for this milestone

D-Tool-27 (class-less bare top-level `<table>` -> existing `table` shape).
The TENTH narrow extension of the D-Tool-9 seam freeze. Record it with
rationale, the byte-exact regex, the shape reuse, and the non-regression
evidence (pilot 80; ctn 34 {image:5,paragraph:24,quote:4,footnotes:1}
quote[3] len=240; update 2 {paragraph:2}; part-7..22 unchanged).

## Task

1. Confirm pre-flight (clean tree; INTEGRITY OK; LOCKED_DECISIONS_SHA256
   matches C1b-11k).
2. Read the current TOP array + blockFromFragment in import-post.js.
3. Insert the D-Tool-27 TOP entry (after divBareImg, adjacent to the
   figure.wp-block-table entry) and the blockFromFragment `tableBare` branch
   (identical to the existing `table` kind). Keep the `figure.wp-block-table`
   rule and all `<p>`-keyed regexes byte-identical.
   `node --check apps/blog/tools/import-post.js`.
4. Non-regression recons (read-only), each must be unchanged:
   - `update` 2 {paragraph:2}
   - controlling-the-narrative 34 {image:5,paragraph:24,quote:4,footnotes:1},
     quote[3] len=240
   - pilot 80 {image:15,paragraph:62,quote:2,table:1}  ← exercises the
     `<figure wp-block-table>` path; MUST be byte-identical (the pilot's bare
     `<table>` is inside that `<figure>`, so tableBare never fires for it)
   - part-7..22 byte-identical to their committed files
5. Re-recon the contents post (read-only) against the CANONICAL URL
   `https://twolegsbadblog.wordpress.com/2017/01/20/a-contemporary-history-of-the-muslim-world-contents/`:
   expect `{table:1, paragraph:N}` (N measured) with EVERY
   `*_para_leftover = 0` and the raw `<img>` count (24) reconciled as
   SUBSUMED by the single `table` block (the `<img>` markup lives inside the
   table block's content, NOT leaked into any paragraph). The 1 table block
   carries the inner HTML of the `<table>` (colgroup/tbody/tr/td, links and
   images preserved verbatim, entities preserved).
6. Freeze D-Tool-27 in LOCKED_DECISIONS.txt.
7. Add the L-013 row to LOSS_LEDGER.md (silent contents-grid image loss;
   resolved by C1b-11k-b).
8. `node apps/blog/tools/test-integrity.js` -> INTEGRITY OK
9. `node apps/blog/tools/hash-state.js`
10. Author C1b-11k-b.md (the contents-post migration).

## Test Checklist

- [ ] git status --porcelain clean at open
- [ ] test-integrity.js INTEGRITY OK at open
- [ ] LOCKED_DECISIONS_SHA256 matches C1b-11k at open
- [ ] import-post.js: one TOP entry for the class-less bare `<table>`;
      `figure.wp-block-table` rule and all `<p>`-keyed regexes byte-identical
- [ ] blockFromFragment tableBare branch emits { type:"table", content }
      (identical to the existing `table` kind)
- [ ] node --check passes
- [ ] Non-regression: pilot 80 {image:15,paragraph:62,quote:2,table:1} / ctn
      34 (quote[3] len=240) / update 2 / part-7..22 all unchanged
- [ ] contents re-recon: table block present, all *_para_leftover = 0, raw
      <img> count reconciled (subsumed by the table block)
- [ ] D-Tool-27 frozen in LOCKED_DECISIONS.txt
- [ ] L-013 row added to LOSS_LEDGER.md
- [ ] test-integrity.js INTEGRITY OK at close
- [ ] hash-state.js captured

## Known issues the next chat must NOT mistake for bugs

- posts.json is UNTRUSTED. The contents post's canonical (live 200) slug is
  a-contemporary-history-of-the-muslim-world-contents (HTTP 200, no redirect,
  no `protected-` prefix).
- The `<table>` is the legacy WP.com layout grid; its `<td>` cells contain
  both link-text and thumbnail images. Reusing the `table` shape
  (`table.innerHTML = block.content`) renders the grid faithfully; the outer
  `<table>` tag is dropped (D-Tool-15 convention) and the inner
  colgroup/tbody/tr/td markup is preserved verbatim.
- The negative lookahead `(?![^>]*\bclass=)` asserts the `<table>` has NO
  `class=` attribute. The theme's `<table class="recentcommentsavatar">` is in
  the page chrome OUTSIDE entry-content, so it is never seen; and the pilot's
  bare `<table>` is inside `<figure class="wp-block-table">` (consumed whole
  by the earlier table entry), so tableBare must NOT fire for the pilot.
- This loss is SILENT to `*_para_leftover` for the DROPPED images (the second
  cell thumbnails). Reconcile the raw `<img>` count (24) against the rendered
  blocks; after D-Tool-27 all 24 `<img>` live inside the single `table`
  block's content.
- The thumbnails' `<img src>` carry no `&#038;` (simple .png srcs); preserve
  `src` verbatim regardless (D-Tool-15).
- Verbatim `&nbsp;` spacers (D-Tool-16) and inline `<em>`/`<strong>` in
  ordinary paragraphs (D-Tool-15) remain faithful, not losses.
- If ANOTHER new structural class appears, STOP and re-scope again.

## IDE File Path Rules (CRITICAL FOR CONTINUE)

- The VS Code Workspace Root is the `zabon/` directory.
- Output all paths relative to that root, e.g. `apps/blog/index.html`.
- NEVER prefix with `zabon/`.

## Next

C1b-11k-b: migrate `a-contemporary-history-of-the-muslim-world-contents`
(date 2017-01-20T13:22:50+00:00) from the live HTML, now that the seam
represents every class it contains. Regenerate feed.json 19 -> 20 entries
(date-desc; the post's date 2017-01-20 sits between part-10's 2017-01-06 and
part-11's 2017-02-08, so it sorts AFTER part-11 (idx 14) and BEFORE part-10
(idx 15)). Resolves L-013. After it, C1b-DONE proves 20/20.
