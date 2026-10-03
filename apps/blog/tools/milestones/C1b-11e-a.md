# Milestone C1b-11e-a — Extend the D-Tool-9 seam: mixed bare-`<p>` fragments (image-trailing prose + prose-trailing embed)

Status: next
depends on: C1b-11e

## Scope fence (read first)

This milestone extends the frozen D-Tool-9 extraction seam by TWO entries,
both surfaced by recon for C1b-11e (migrate part-12). C1b-11e STOPPED per its
own Scope Fence because part-12's live HTML contains TWO structural classes
the seam as frozen through D-Tool-23 does NOT represent, each of which makes a
`*_para_leftover` non-zero:

- Class A `imageBarePTrailing` (D-Tool-24): a bare `<p>` whose content BEGINS
  with a single `<img ...>` and CONTINUES with prose inside the SAME `<p>`
  (no `</p>` between the image and the text). D-Tool-20 imageBareP requires the
  `<img>` to be the SOLE child of the `<p>`, so it does not match; D-Tool-19
  paragraphBare then swallows the fragment as a paragraph, leaving raw `<img>`
  markup as paragraph text (the L-009 defect shape) -> `img_para_leftover = 1`.
- Class B `embedInBareP` (D-Tool-25): a bare `<p>` whose content is prose
  followed by an inline legacy Jetpack embed (`<div class="jetpack-video-wrapper">
  ...<iframe ...></iframe>...</div>`) NESTED INSIDE the `<p>`. D-Tool-21's TOP
  `embed` regex matches the `<div ...>` (a LATER match position), but D-Tool-19
  paragraphBare matches the enclosing `<p ...>` at an EARLIER position and wins,
  swallowing the prose AND the iframe into paragraph text ->
  `iframe_para_leftover = 1`.

This is the SEVENTH and EIGHTH narrow extension of the D-Tool-9 seam freeze
(after D-Tool-18 quote-cite, D-Tool-19 bare-`<p>`, D-Tool-20 bare-`<p><img>`,
D-Tool-21 legacy Jetpack embed, D-Tool-22 legacy `figure.wp-caption` image,
D-Tool-23 emph-wrapped bare-`<p><img>`), and they MUST be frozen as their own
LOCKED_DECISIONS entries (D-Tool-24, D-Tool-25) in THIS milestone. This
milestone does NOT migrate any slug, does NOT regenerate feed.json, and does
NOT touch LOSS_LEDGER.md. part-12 is migrated in C1b-11e-b. Recon evidence:
apps/blog/PARTIAL.md.

## Objective

By the close of C1b-11e-a:

- The D-Tool-9 seam represents BOTH mixed bare-`<p>` fragments faithfully,
  reusing the EXISTING `image` and `embed` shapes (no new block type, no
  renderer change).
- D-Tool-24 and D-Tool-25 are frozen in tools/LOCKED_DECISIONS.txt with the
  byte-exact regexes, the shape reuse, and the non-regression evidence.
- Non-regression holds: pilot 80 {image:15,paragraph:62,quote:2,table:1}; ctn
  34 {image:5,paragraph:24,quote:4,footnotes:1} quote[3] len=240; update 2
  {paragraph:2}; part-13..22 byte-identical.
- Re-recon of part-12 now yields the seam-READY census with
  `img_para_leftover = 0` AND `iframe_para_leftover = 0` — i.e. the seam is
  READY for C1b-11e-b.

## Opening reads (mandatory, before any write)

1. apps/blog/HANDOFF-CURRENT.txt
2. apps/blog/HANDOFF-C1b-11e.md
3. apps/blog/PARTIAL.md
4. apps/blog/tools/milestones/C1b-11e-a.md (this file)
5. apps/blog/tools/CONTEXT.md
6. apps/blog/tools/WORKFLOW.md
7. apps/blog/tools/LOCKED_DECISIONS.txt
8. apps/blog/tools/LOSS_LEDGER.md
9. apps/blog/tools/ROADMAP.md

## Pre-flight (read-only, paste outputs before any write)

- `git status --porcelain` (expect clean)
- `node apps/blog/tools/test-integrity.js` (expect INTEGRITY OK)
- `node apps/blog/tools/hash-state.js` (record SHAs; confirm LOCKED_DECISIONS
  matches C1b-11e's handoff)

## Interfaces

### Modified: apps/blog/tools/import-post.js

Add TWO entries to the `TOP` array in `extractHtmlBlocks()`.

ENTRY 1 (D-Tool-24 `imageBarePTrailing`), placed AFTER the `imageBarePEm`
(D-Tool-23) entry and BEFORE the `paragraphBare` (D-Tool-19) entry:

    {
      // D-Tool-24: legacy WP.com bare <p> that BEGINS with a single <img>
      // and continues with prose inside the SAME <p> (the image is not the
      // sole child, so D-Tool-20 imageBareP does not match; D-Tool-19
      // paragraphBare would otherwise swallow the <img> as raw markup text).
      // Capture the leading <img> as an image block; the remaining prose is
      // captured by the existing paragraphBare rule on the NEXT loop turn.
      re: /<p\b(?![^>]*\bclass="[^"]*\bwp-block-)[^>]*>\s*<img\b[^>]*\/?>\s*(?!<\/p>)(?=[\s\S])/i,
      kind: "imageBarePTrailing",
    },

Handle `kind === "imageBarePTrailing"` in `blockFromFragment()` by emitting
the EXISTING image shape `{ type:"image", src, caption:"" }`, where `src =
attrOfFirst(frag, "img", "src")` verbatim, or `return null` if no `src`. The
fragment the loop advances past is ONLY the `<p ...>` OPEN TAG plus the
leading `<img ...>` (NOT the whole `<p>`); the trailing prose remains in the
body and is claimed by the D-Tool-19 paragraphBare rule (which matches the
next bare `<p>` region). NOTE: this entry must NOT consume the closing
`</p>`. The exact match boundary (open tag + img only) is part of the frozen
spec and must be verified positionally (Open warning 2), not by substring.

ENTRY 2 (D-Tool-25 `embedInBareP`), placed AFTER ENTRY 1 and BEFORE the
`paragraphBare` (D-Tool-19) entry:

    {
      // D-Tool-25: legacy WP.com bare <p> containing prose followed by an
      // inline legacy Jetpack embed nested INSIDE the <p>
      // (<p ...>...prose...<div class="jetpack-video-wrapper">...
      //  <iframe ...></iframe>...</div></p>). D-Tool-21's embed regex matches
      // the <div>, but D-Tool-19 paragraphBare matches the enclosing <p> at an
      // earlier position and wins, swallowing the iframe as raw markup text.
      // Emit the prose as a paragraph AND the embed as an embed block, in one
      // TOP entry, so the loop never sees the raw <p> as a paragraph.
      re: /<p\b(?![^>]*\bclass="[^"]*\bwp-block-)[^>]*>[\s\S]*?<div\b[^>]*class="[^"]*\bjetpack-video-wrapper\b[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/p>/i,
      kind: "embedInBareP",
    },

Handle `kind === "embedInBareP"` in `blockFromFragment()` by returning (up
to) TWO blocks: the leading prose as `{ type:"paragraph", content:<prose> }`
(tags stripped, entities preserved, trimmed, per D-Tool-15) and the raw
`<iframe ...></iframe>` verbatim as `{ type:"embed", content:ifr }`
(D-Tool-21 semantics, `&#038;` preserved). Since `blockFromFragment()` today
returns a single block, the seam gains a documented, minimal accommodation
for the ONE call site that may need to push two blocks (see Task): the TOP
loop must append BOTH. If the leading prose is empty, emit only the embed.
The jetpack div/span chrome is NOT emitted (presentational), matching
D-Tool-21.

The `imageBareP` (D-Tool-20), `imageBarePEm` (D-Tool-23) and `paragraphBare`
(D-Tool-19) regexes stay BYTE-IDENTICAL (no behaviour change).

### New: none (no new exported symbol; module.exports unchanged)

## Files to Create

- apps/blog/HANDOFF-C1b-11e-a.md (WORKFLOW step 4)
- apps/blog/tools/milestones/C1b-11e-b.md (WORKFLOW step 7)

## Files to Modify

- apps/blog/tools/import-post.js (two TOP entries + blockFromFragment branch;
  minimal multi-block accommodation at the loop)
- apps/blog/tools/LOCKED_DECISIONS.txt (freeze D-Tool-24 and D-Tool-25)
- apps/blog/tools/ROADMAP.md (C1b-11e-a -> Done; adjust Next)
- apps/blog/HANDOFF-CURRENT.txt (pointer -> HANDOFF-C1b-11e-a.md)

## Files I will NOT touch

- apps/blog/content/en/*.json (no slug migrated this milestone)
- apps/blog/assets/data/feed.json (unchanged; 13 entries)
- apps/blog/tools/LOSS_LEDGER.md (no loss; untouched)
- apps/blog/assets/data/posts.json (UNTRUSTED; read-only)
- every other app file (router.js, app.js, parser.js, fetcher.js,
  renderer.js, generate-index.js, hash-state.js, test-integrity.js,
  CONTEXT.md, WORKFLOW.md, index.html, style.css)

## Decisions frozen for this milestone

D-Tool-24 (bare `<p>` beginning with `<img>` then prose -> image block +
paragraph) and D-Tool-25 (bare `<p>` containing prose then an inline legacy
Jetpack embed -> paragraph + embed). The seventh and eighth narrow extensions
of the D-Tool-9 seam freeze. Record each with rationale, the byte-exact regex,
the shape reuse, and the non-regression evidence (pilot 80; ctn 34
{image:5,paragraph:24,quote:4,footnotes:1} quote[3] len=240; update 2
{paragraph:2}; part-13..22 unchanged).

## Task

1. Confirm pre-flight (clean tree; INTEGRITY OK; LOCKED_DECISIONS_SHA256
   matches C1b-11e).
2. Read the current TOP array + blockFromFragment + TOP loop in
   import-post.js.
3. Insert the two TOP entries (D-Tool-24 after imageBarePEm, D-Tool-25 after
   D-Tool-24; both before paragraphBare). For D-Tool-25, add the minimal
   multi-block accommodation at the loop (blockFromFragment may return an
   array; the loop appends each element). Keep imageBareP / imageBarePEm /
   paragraphBare regexes byte-identical. `node --check apps/blog/tools/import-post.js`.
4. Non-regression recons (read-only), each must be unchanged:
   - `update` 2 {paragraph:2}
   - controlling-the-narrative 34 {image:5,paragraph:24,quote:4,footnotes:1},
     quote[3] len=240
   - pilot 80 {image:15,paragraph:62,quote:2,table:1}
   - part-13 {image:13,paragraph:37,embed:2}; part-14 {image:9,paragraph:23};
     part-15 {image:13,paragraph:67,embed:1}; part-16
     {image:15,paragraph:71,embed:2}; part-17 {image:13,paragraph:59,embed:4};
     part-18 {image:14,paragraph:48,embed:1}; part-19 {image:17,paragraph:51};
     part-20 {image:12,paragraph:57,embed:1}; part-21
     {image:19,paragraph:82,embed:3}; part-22 {image:13,paragraph:55}
5. Re-recon part-12 (read-only) against the CANONICAL URL
   `https://twolegsbadblog.wordpress.com/2018/04/16/a-contemporary-history-of-the-muslim-world-part-12-saudi-arabia-and-the-arab-cold-war/`:
   expect `{image:12, paragraph:43, embed:2}` (57 blocks) and
   `img_para_leftover = 0` AND `iframe_para_leftover = 0`. The 12 images =
   7 bare `<p><img>` (D-Tool-20) + 4 `figure.wp-caption` (D-Tool-22) + 1
   `imageBarePTrailing` (D-Tool-24). The 2 embeds = 1 standalone D-Tool-21
   embed + 1 `embedInBareP` (D-Tool-25).
6. Freeze D-Tool-24 and D-Tool-25 in LOCKED_DECISIONS.txt.
7. `node apps/blog/tools/test-integrity.js` -> INTEGRITY OK
8. `node apps/blog/tools/hash-state.js`
9. Author C1b-11e-b.md (the part-12 migration).

## Test Checklist

- [ ] git status --porcelain clean at open
- [ ] test-integrity.js INTEGRITY OK at open
- [ ] LOCKED_DECISIONS_SHA256 matches C1b-11e at open
- [ ] import-post.js: two TOP entries placed after imageBarePEm, before
      paragraphBare; imageBareP/imageBarePEm/paragraphBare byte-identical
- [ ] blockFromFragment D-Tool-24 branch emits { type:"image", src,
      caption:"" } (null if no src)
- [ ] blockFromFragment D-Tool-25 branch emits the leading prose (paragraph)
      AND the raw iframe (embed) verbatim with &#038; preserved
- [ ] loop appends both blocks for the multi-block case; node --check passes
- [ ] Non-regression: pilot 80 / ctn 34 (quote[3] len=240) / update 2 /
      part-13..22 all unchanged
- [ ] part-12 re-recon {image:12,paragraph:43,embed:2} (57),
      img_para_leftover = 0 AND iframe_para_leftover = 0
- [ ] D-Tool-24 + D-Tool-25 frozen in LOCKED_DECISIONS.txt
- [ ] test-integrity.js INTEGRITY OK at close
- [ ] hash-state.js captured

## Known issues the next chat must NOT mistake for bugs

- posts.json is UNTRUSTED. part-12's canonical (live 200) slug is
  a-contemporary-history-of-the-muslim-world-part-12-saudi-arabia-and-the-arab-cold-war.
- The `<img>` may carry many data-* attributes; extract `src` only, verbatim.
- D-Tool-24 must NOT consume the closing `</p>`; the trailing prose is claimed
  by paragraphBare on the next loop turn. Verify POSITIONALLY (Open warning 2).
- D-Tool-25's leading prose may end with a colon (": "); strip tags, preserve
  entities, trim; emit "" prose as no paragraph.
- Verbatim `&nbsp;` spacers (D-Tool-16) and inline `<em>`/`<strong>` in
  ordinary paragraphs (D-Tool-15) remain faithful, not losses.
- The embed `<iframe src>` carries `&#038;` entities; PRESERVE verbatim.
- If ANOTHER new structural class appears, STOP and re-scope again.

## IDE File Path Rules (CRITICAL FOR CONTINUE)

- The VS Code Workspace Root is the `zabon/` directory.
- Output all paths relative to that root, e.g. `apps/blog/index.html`.
- NEVER prefix with `zabon/`.

## Next

C1b-11e-b: migrate `a-contemporary-history-of-the-muslim-world-part-12-saudi-arabia-and-the-arab-cold-war`
(date 2018-04-16) from the live HTML, now that the seam represents every class
it contains. Expected census {image:12,paragraph:43,embed:2} (57 blocks);
regenerate feed.json 13 -> 14 entries (date-desc). No LOSS_LEDGER row (no
loss).
