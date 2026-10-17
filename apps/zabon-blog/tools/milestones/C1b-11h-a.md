# Milestone C1b-11h-a — Extend the D-Tool-9 seam: bare-`<div>`-wrapped `<img>` (`divBareImg`)

Status: next
depends on: C1b-11h

## Scope fence (read first)

This milestone extends the frozen D-Tool-9 extraction seam by ONE entry,
surfaced by recon for C1b-11h (migrate part-9). C1b-11h STOPPED per its own
Scope Fence because part-9's live HTML contains a structural class the seam
as frozen through D-Tool-25 does NOT represent:

- Class `divBareImg` (proposed D-Tool-26): a CLASS-LESS bare `<div>` whose
  SOLE child is an `<img ...>` (no `class` attribute at all). No frozen TOP
  entry matches it — `imageWrap` requires `class="...wp-block-image..."`; the
  `figure.*` rules (imageFig, wpCaptionFig) are `<figure>` rules; the `<p>`
  rules (imageBareP/imageBarePEm/imageBarePTrailing D-Tool-20/23/24,
  paragraphBare D-Tool-19) do not match a `<div>`. The loop's skip-and-advance
  logic therefore steps past `<div>` and the `<img>` tag-by-tag and DROPS the
  image entirely (the L-009/L-011 defect shape: a legacy image markup class
  the seam did not model). This is a SILENT loss — it does NOT leak raw
  markup into a paragraph, so `*_para_leftover` stays 0 and cannot catch it;
  it is caught only by reconciling the raw `<img>` count (14) against the
  rendered image-block count (13).

This is the NINTH narrow extension of the D-Tool-9 seam freeze (after
D-Tool-18 quote-cite, D-Tool-19 bare-`<p>`, D-Tool-20 bare-`<p><img>`,
D-Tool-21 legacy Jetpack embed, D-Tool-22 legacy `figure.wp-caption` image,
D-Tool-23 emph-wrapped bare-`<p><img>`, D-Tool-24 imageBarePTrailing, D-Tool-25
embedInBareP), and it MUST be frozen as its own LOCKED_DECISIONS entry
(D-Tool-26) in THIS milestone. This milestone does NOT migrate any slug, does
NOT regenerate feed.json, and does NOT fork the migration. The L-012 ledger
row (the silent loss of `270px-miqbal4.jpg` from part-9) is authored in this
milestone (the class is frozen here); part-9 is migrated in C1b-11h-b. Recon
evidence: apps/blog/PARTIAL.md.

## Objective

By the close of C1b-11h-a:

- The D-Tool-9 seam represents the bare-`<div>`-wrapped `<img>` faithfully,
  reusing the EXISTING `image` shape (no new block type, no renderer change).
- D-Tool-26 is frozen in tools/LOCKED_DECISIONS.txt with the byte-exact
  regex, the shape reuse, and the non-regression evidence.
- L-012 is recorded in tools/LOSS_LEDGER.md (the silent part-9 image loss
  discovered at C1b-11h recon; RESOLVED when part-9 is re-migrated in
  C1b-11h-b), OR recorded as an open row if migration is deferred — per the
  plan below it is resolved in C1b-11h-b, so the row's `resolved-by` names
  C1b-11h-b.
- Non-regression holds: pilot 80 {image:15,paragraph:62,quote:2,table:1}; ctn
  34 {image:5,paragraph:24,quote:4,footnotes:1} quote[3] len=240; update 2
  {paragraph:2}; part-10..22 byte-identical.
- Re-recon of part-9 now yields the seam-READY census `{image:14,
  paragraph:28, embed:1}` (43 blocks) with all `*_para_leftover = 0` — i.e.
  the seam is READY for C1b-11h-b.

## Opening reads (mandatory, before any write)

1. apps/blog/HANDOFF-CURRENT.txt
2. apps/blog/HANDOFF-C1b-11h.md
3. apps/blog/PARTIAL.md
4. apps/blog/tools/milestones/C1b-11h-a.md (this file)
5. apps/blog/tools/CONTEXT.md
6. apps/blog/tools/WORKFLOW.md
7. apps/blog/tools/LOCKED_DECISIONS.txt
8. apps/blog/tools/LOSS_LEDGER.md
9. apps/blog/tools/ROADMAP.md

## Pre-flight (read-only, paste outputs before any write)

- `git status --porcelain` (expect clean)
- `node apps/blog/tools/test-integrity.js` (expect INTEGRITY OK)
- `node apps/blog/tools/hash-state.js` (record SHAs; confirm LOCKED_DECISIONS
  matches C1b-11h's handoff)

## Interfaces

### Modified: apps/blog/tools/import-post.js

Add ONE entry to the `TOP` array in `extractHtmlBlocks()`.

ENTRY (D-Tool-26 `divBareImg`), placed AFTER the `wpCaptionFig` (D-Tool-22)
entry and BEFORE the `table` entry — i.e. AFTER the `imageWrap`/`imageFig`
image entries and BEFORE the first `<p>`-keyed entry, so it claims the bare
`<div><img></div>` case first while leaving every `<p>` rule byte-identical:

    {
      // D-Tool-26: legacy WP.com image markup - an <img> wrapped in a
      // CLASS-LESS bare <div> with no class attribute at all (e.g.
      // <div><img data-attachment-id="..." class="aligncenter ..." src="..." /></div>).
      // The frozen seam matched NO entry for this class: imageWrap requires
      // class="...wp-block-image..."; the figure.* rules are <figure> rules;
      // the <p> rules are <p> rules. The loop's skip-and-advance logic then
      // dropped the whole <div><img></div> tag-by-tag, silently losing the
      // image (the L-009/L-011 defect shape). Promoted to the EXISTING image
      // shape { type, src, caption } so the renderer needs no change.
      // Keys on a <div> that has NO class attribute (the negative lookahead
      // asserts no "class=" appears in the div open tag) and whose sole child
      // is a single <img .../>.
      re: /<div\b(?![^>]*\bclass=)[^>]*>\s*<img\b[^>]*\/?>\s*<\/div>/i,
      kind: "divBareImg",
    },

Handle `kind === "divBareImg"` in `blockFromFragment()` IDENTICALLY to
`imageBareP` (D-Tool-20): `const src = attrOfFirst(frag, "img", "src"); if
(!src) return null; return { type: "image", src, caption: "" };`. No caption
is possible (there is no `<figcaption>`), so `caption:""`. The image shape
reuses the EXISTING path the renderer already consumes.

The `imageBareP` (D-Tool-20), `imageBarePEm` (D-Tool-23),
`imageBarePTrailing` (D-Tool-24), `embedInBareP` (D-Tool-25) and
`paragraphBare` (D-Tool-19) regexes stay BYTE-IDENTICAL (no behaviour change).

### New: none (no new exported symbol; module.exports unchanged)

## Files to Create

- apps/blog/HANDOFF-C1b-11h-a.md (WORKFLOW step 4)
- apps/blog/tools/milestones/C1b-11h-b.md (WORKFLOW step 7)

## Files to Modify

- apps/blog/tools/import-post.js (one TOP entry + blockFromFragment branch)
- apps/blog/tools/LOCKED_DECISIONS.txt (freeze D-Tool-26)
- apps/blog/tools/LOSS_LEDGER.md (add L-012 row: the silent part-9 image loss)
- apps/blog/tools/ROADMAP.md (C1b-11h-a -> Done; adjust Next)
- apps/blog/HANDOFF-CURRENT.txt (pointer -> HANDOFF-C1b-11h-a.md)

## Files I will NOT touch

- apps/blog/content/en/*.json (no slug migrated this milestone)
- apps/blog/assets/data/feed.json (unchanged; 16 entries)
- apps/blog/assets/data/posts.json (UNTRUSTED; read-only)
- every other app file (router.js, app.js, parser.js, fetcher.js,
  renderer.js, generate-index.js, hash-state.js, test-integrity.js,
  CONTEXT.md, WORKFLOW.md, index.html, style.css)

## Decisions frozen for this milestone

D-Tool-26 (bare class-less `<div>` wrapping a sole `<img>` -> existing image
shape). The NINTH narrow extension of the D-Tool-9 seam freeze. Record it
with rationale, the byte-exact regex, the shape reuse, and the
non-regression evidence (pilot 80; ctn 34 {image:5,paragraph:24,quote:4,
footnotes:1} quote[3] len=240; update 2 {paragraph:2}; part-10..22 unchanged).

## Task

1. Confirm pre-flight (clean tree; INTEGRITY OK; LOCKED_DECISIONS_SHA256
   matches C1b-11h).
2. Read the current TOP array + blockFromFragment in import-post.js.
3. Insert the D-Tool-26 TOP entry (after wpCaptionFig, before table) and the
   blockFromFragment `divBareImg` branch (identical to imageBareP). Keep the
   `<p>`-keyed regexes byte-identical.
   `node --check apps/blog/tools/import-post.js`.
4. Non-regression recons (read-only), each must be unchanged:
   - `update` 2 {paragraph:2}
   - controlling-the-narrative 34 {image:5,paragraph:24,quote:4,footnotes:1},
     quote[3] len=240
   - pilot 80 {image:15,paragraph:62,quote:2,table:1}
   - part-10 {image:18,paragraph:40,embed:1}; part-11
     {image:9,paragraph:36,embed:7}; part-12 {image:12,paragraph:43,embed:2};
     part-13 {image:13,paragraph:37,embed:2}; part-14 {image:9,paragraph:23};
     part-15 {image:13,paragraph:67,embed:1}; part-16
     {image:15,paragraph:71,embed:2}; part-17 {image:13,paragraph:59,embed:4};
     part-18 {image:14,paragraph:48,embed:1}; part-19 {image:17,paragraph:51};
     part-20 {image:12,paragraph:57,embed:1}; part-21
     {image:19,paragraph:82,embed:3}; part-22 {image:13,paragraph:55}
5. Re-recon part-9 (read-only) against the CANONICAL URL
   `https://twolegsbadblog.wordpress.com/2016/12/25/a-contemporary-history-of-the-muslim-world-part-9-pakistan-1979/`:
   expect `{image:14, paragraph:28, embed:1}` (43 blocks) and
   `img_para_leftover = 0`. The 14 images = 8 bare `<p><img>` (D-Tool-20) +
   5 `figure.wp-caption` (D-Tool-22) + 1 `divBareImg` (D-Tool-26, the
   recovered `270px-miqbal4.jpg`, src verbatim). The 1 embed = a standalone
   D-Tool-21 embed (raw `<iframe>` verbatim, `&#038;` preserved).
6. Freeze D-Tool-26 in LOCKED_DECISIONS.txt.
7. Add the L-012 row to LOSS_LEDGER.md (silent part-9 image loss; resolved by
   C1b-11h-b).
8. `node apps/blog/tools/test-integrity.js` -> INTEGRITY OK
9. `node apps/blog/tools/hash-state.js`
10. Author C1b-11h-b.md (the part-9 migration).

## Test Checklist

- [ ] git status --porcelain clean at open
- [ ] test-integrity.js INTEGRITY OK at open
- [ ] LOCKED_DECISIONS_SHA256 matches C1b-11h at open
- [ ] import-post.js: one TOP entry placed after wpCaptionFig, before table;
      all `<p>`-keyed regexes byte-identical
- [ ] blockFromFragment D-Tool-26 branch emits { type:"image", src,
      caption:"" } (null if no src)
- [ ] node --check passes
- [ ] Non-regression: pilot 80 / ctn 34 (quote[3] len=240) / update 2 /
      part-10..22 all unchanged
- [ ] part-9 re-recon {image:14,paragraph:28,embed:1} (43), img_para_leftover = 0
- [ ] D-Tool-26 frozen in LOCKED_DECISIONS.txt
- [ ] L-012 row added to LOSS_LEDGER.md
- [ ] test-integrity.js INTEGRITY OK at close
- [ ] hash-state.js captured

## Known issues the next chat must NOT mistake for bugs

- posts.json is UNTRUSTED. part-9's canonical (live 200) slug is
  a-contemporary-history-of-the-muslim-world-part-9-pakistan-1979.
- The `<img>` carries many data-* attributes; extract `src` only, verbatim
  (D-Tool-15: entities like `&#038;` in the src are preserved, NOT decoded).
- The negative lookahead `(?![^>]*\bclass=)` asserts the `<div>` has NO
  `class=` attribute. A `<div class="...">` wrapping an image must NOT be
  captured by this rule (imageWrap owns the wp-block-image case); this class
  is a CLASS-LESS bare `<div>` only.
- This loss is SILENT to `*_para_leftover` (the markup is dropped, not leaked
  into a paragraph). Reconcile the raw `<img>` count (14) against the rendered
  image count; the recovered image is `270px-miqbal4.jpg`.
- Verbatim `&nbsp;` spacers (D-Tool-16) and inline `<em>`/`<strong>` in
  ordinary paragraphs (D-Tool-15) remain faithful, not losses.
- The embed's `<iframe src>` carries `&#038;` entities; PRESERVE verbatim.
- If ANOTHER new structural class appears, STOP and re-scope again.

## IDE File Path Rules (CRITICAL FOR CONTINUE)

- The VS Code Workspace Root is the `zabon/` directory.
- Output all paths relative to that root, e.g. `apps/blog/index.html`.
- NEVER prefix with `zabon/`.

## Next

C1b-11h-b: migrate `a-contemporary-history-of-the-muslim-world-part-9-pakistan-1979`
(date 2016-12-25T23:31:45+00:00) from the live HTML, now that the seam
represents every class it contains. Expected census {image:14,paragraph:28,
embed:1} (43 blocks); regenerate feed.json 16 -> 17 entries (date-desc;
part-9's date 2016-12-25 is OLDER than part-10's 2017-01-06, so part-9 sorts
AFTER part-10 — likely LAST). Resolves L-012.
