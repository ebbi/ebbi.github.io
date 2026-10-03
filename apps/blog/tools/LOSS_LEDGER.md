# Fidelity Loss Ledger

Standing rule (LOCKED_DECISIONS NEW-1/NEW-2): the deployed blog content MUST
faithfully replicate the original WordPress blog. The LIVE HTML extraction
(--from html) is the fidelity oracle AND the C1b migration source. posts.json
is UNTRUSTED. Any currently-unavoidable loss is recorded here and revisited
in a final fidelity check before C1b-DONE. Silent loss is prohibited.

| id    | source                                                     | block type | cause                                                                                                                                                                                                                                                                                                                                                                                                                 | impact                                                                                                                                                                                                                                                                                       | status                                                                                         | resolved-by                                                        |
| ----- | ---------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------- |
| L-001 | controlling-the-narrative (posts.json entry)               | (all)      | posts.json is front-truncated: holds 9 of 34 blocks; opening/body lost                                                                                                                                                                                                                                                                                                                                                | 25 of 34 blocks                                                                                                                                                                                                                                                                              | open                                                                                           | C1b (source = live HTML)                                           |
| L-002 | controlling-the-narrative (live, pre-fix)                  | footnotes  | extractHtmlBlocks dropped core/footnotes (loop break)                                                                                                                                                                                                                                                                                                                                                                 | 1 block                                                                                                                                                                                                                                                                                      | resolved                                                                                       | C1-tool-seam-complete                                              |
| L-003 | controlling-the-narrative (live, pre-fix)                  | paragraph  | CENSUS MISCOUNT (not a real loss): the four <p> elements are nested inside four wp-block-quote blocks.                                                                                                                                                                                                                                                                                                                | 0 blocks                                                                                                                                                                                                                                                                                     | resolved                                                                                       | C1-tool-seam-complete                                              |
| L-004 | a-contemporary-history-...-part-17-algeria-2               | embed      | extraction seam cannot extract core/embed (live markup is the legacy Jetpack wrapper div.jetpack-video-wrapper > span.embed-youtube > iframe; the frozen seam had no rule, so the loop dropped it tag-by-tag)                                                                                                                                                                                                         | 4 blocks (not 1; posts.json undercounts)                                                                                                                                                                                                                                                     | resolved                                                                                       | C1b-09b migrated the slug (D-Tool-21, frozen in C1b-09a)           |
| L-005 | a-contemporary-history-...-part-15-the-afghan-arabs...     | embed      | extraction seam cannot extract core/embed (legacy Jetpack wrapper; see L-004)                                                                                                                                                                                                                                                                                                                                         | (count TBD at recon)                                                                                                                                                                                                                                                                         | deferred (seam READY)                                                                          | C1b-09a froze representation (D-Tool-21); migrate at series idx 9  |
| L-006 | a-contemporary-history-...-part-8-afghanistan-1            | embed      | extraction seam cannot extract core/embed (legacy Jetpack wrapper; see L-004)                                                                                                                                                                                                                                                                                                                                         | (count TBD at recon)                                                                                                                                                                                                                                                                         | deferred (seam READY)                                                                          | C1b-09a froze representation (D-Tool-21); migrate at series idx 18 |
| L-007 | controlling-the-narrative (live, pre-fix)                  | quote      | blockFromFragment("quote") ignored <cite> text: the 4th quote carries its body in <cite>, <p> is empty; content was emitted as "".                                                                                                                                                                                                                                                                                    | 1 block                                                                                                                                                                                                                                                                                      | resolved                                                                                       | C1b-01 (A-fix)                                                     |
| L-008 | update (live)                                              | paragraph  | extractHtmlBlocks TOP list keys on wp-block-_ classes; the update body has ZERO wp-block-_ markers and two BARE <p> elements, so the loop matches nothing and throws no recognised blocks in entry-content. Bare-<p> posts are unrepresentable by the D-Tool-9 seam as frozen.                                                                                                                                        | 2 of 2 blocks (whole post)                                                                                                                                                                                                                                                                   | resolved                                                                                       | C1b-seam-bare-p (D-Tool-19)                                        |
| L-009 | a-contemporary-history-...-part-22-kosovo-2 (live)         | image      | Legacy WP.com inline images are emitted as bare <p><img class="wp-image-..."></p> (no wp-block-image wrapper). The D-Tool-9 seam froze with only imageWrap (div.wp-block-image) and imageFig (figure.wp-block-image); it had no rule for a bare <p>-wrapped <img>. After D-Tool-19, the bare-<p> rule captured these as paragraph blocks, so 4 images would render as raw <img .../> markup text instead of pictures. | 4 of 59 blocks                                                                                                                                                                                                                                                                               | resolved                                                                                       | C1b-03 (D-Tool-20)                                                 |
| L-010 | a-contemporary-history-...-part-22-kosovo-2 (feed excerpt) | excerpt    | generate-index.js buildExcerpt() decodes entities but does NOT strip HTML tags; part-22's first paragraph leads with an inline <a href>, so the feed excerpt renders raw anchor markup as text. Content file itself is faithful; defect is in the DERIVED list index only.                                                                                                                                            | 1 feed excerpt (part-22)                                                                                                                                                                                                                                                                     | deferred                                                                                       | generate-index/list-view milestone (not C1b-04)                    |
| L-011 | a-contemporary-history-...-part-17..22 (live)              | image      | Legacy WP.com caption-shortcode images are emitted as <figure data-shortcode="caption" class="wp-caption aligncenter                                                                                                                                                                                                                                                                                                  | alignnone"><img ...><figcaption class="wp-caption-text">...</figcaption></figure> (no wp-block-image wrapper). The D-Tool-9 seam had NO rule for figure.wp-caption, so the loop skipped the block and its <img> was silently lost (unrecorded until C1b-09a). Affects every C1b series post. | 7 (part-18) +14 (part-19) +9 (part-20) +14 (part-21) +9 (part-22) +6 (part-17, TBD at C1b-09b) | resolved                                                           | C1b-09a (D-Tool-22); slugs re-migrated |

Notes:

- L-002 was superseded by C1-tool-seam-complete's loop-fix. The pre-fix 38
  target was a diagnostic miscount (q5.js counted quote-internal <p> as
  top-level paragraphs). Correct top-level count is 34; see L-003.
- L-003: q5.js counted quote-internal <p> elements as top-level paragraphs.
  The seam never dropped them. Row retained (not deleted) so the record shows
  the correction.
- L-007: fixed in C1b-01 by extending the quote case's inner scan to match
  <p class="wp-block-paragraph"> OR <cite> in one pass, keeping only non-empty
  bodies, joined by "\n", falling back to the blockquote inner HTML if none.
  Post-fix quote[3] len=240 (was 0), head "Anyone who wants to thwart…".
- L-001 is a CONTENT-SOURCE loss (posts.json), distinct from the extractor
  losses. C1b migrates from the live HTML, not posts.json.
- L-004..L-006: embed shape unverified (REST API unavailable; part-17 URL
  not fetchable). The deferred milestone must first obtain a valid embed dump.
- L-008: mitigated and RESOLVED in C1b-seam-bare-p by teaching the TOP loop
  and blockFromFragment a bare-<p> rule limited to entry-content (D-Tool-19).
  This was a second narrow extension of the D-Tool-9 seam freeze (the first
  was D-Tool-18), done in its own milestone with its own locked decision
  before update.json was written. Evidence: cached dump 92258 bytes;
  post-fix recon blocks=2, census {paragraph:2}; live text confirmed
  non-empty. Non-regression: pilot 80 blocks (unchanged), C1b-01 34 blocks
  {image:5,paragraph:24,quote:4,footnotes:1}, quote[3] len=240.
- L-009: mitigated and RESOLVED in C1b-03 by extending the D-Tool-9
  seam (D-Tool-20): extractHtmlBlocks tops out a bare <p><img> as an
  image block before paragraphBare sees it. The class is legacy WP.com
  inline-image markup (no wp-block-image wrapper); D-Tool-19's bare-<p>
  rule had captured it as paragraph, which would have rendered raw <img>
  markup as text. Evidence: live recon part-22 59 blocks ->
  {image:4,paragraph:55}, img_para_leftover=0. Non-regression: pilot 80
  {image:15,paragraph:62,quote:2,table:1}; controlling-the-narrative 34
  {image:5,paragraph:24,quote:4,footnotes:1}; update 2 {paragraph:2}.
  (C1b-03 D-Tool-20 note)
- L-010: DEFERRED (recorded C1b-04, not fixed there). generate-index.js
  buildExcerpt() decodes entities and normalizes whitespace but does NOT
  strip HTML tags; it assumes paragraph block content is prose. part-22's
  first paragraph block begins with an inline <a href>, so its feed entry
  excerpt renders the raw anchor markup as visible text in the list view.
  The part-22 CONTENT file is faithful (census {image:4,paragraph:55},
  verbatim from the live HTML); the defect is confined to the DERIVED
  feed.json excerpt for that one entry. Fix belongs to a generate-index /
  list-view milestone (generate-index.js is fence-excluded from C1b-04).
  Not a seam issue: no D-Tool entry. C1b-04 evidence: feed.json part-22
  excerpt head 'Picking up where we left off in <a href="https://twolegsbadb…'.
- posts.json is retained on disk only until C1b-DONE proves 20/20.

- L-011: discovered in C1b-09a recon; the legacy `figure.wp-caption`
  caption image matched NO TOP entry in the frozen seam, so its <img> was
  silently dropped across ALL C1b series posts. This is the same defect
  shape as L-009 (a legacy image markup class the seam did not model), but
  for the caption-shortcode figure rather than the bare <p><img>. RESOLVED
  in C1b-09a by freezing D-Tool-22 (wpCaptionFig -> existing image shape
  { type:"image", src, caption }) and RE-MIGRATING the affected shipped
  slugs from the live HTML. Corrected censuses (live body counts in parens):
  part-18 {image:14,paragraph:48,embed:1} (imgs=14,embeds=1); part-19
  {image:17,paragraph:51} (imgs=17); part-20 {image:12,paragraph:57,embed:1}
  (imgs=12,embeds=1); part-21 {image:19,paragraph:82,embed:3} (imgs=19,
  embeds=3); part-22 {image:13,paragraph:55} (imgs=13). img_para_leftover=0
  for all. Non-regression: pilot 80; controlling-the-narrative 34
  {image:5,paragraph:24,quote:4,footnotes:1}, quote[3] len=240; update 2
  {paragraph:2} (none contain wp-caption or jetpack wrappers).
- L-004..L-006: the embed class was CONFIRMED on the live part-17 HTML in
  C1b-09a as the legacy Jetpack wrapper (NOT wp-block-embed). D-Tool-21 now
  represents it ({ type:"embed", content:<raw iframe verbatim> }); the seam
  is READY. part-17 has 4 embeds (posts.json advertised 1). L-004 migrates
  in C1b-09b; L-005/L-006 migrate at their series milestones.
- L-004: RESOLVED in C1b-09b. part-17 was migrated from the live HTML
  (`--from html`) into content/en/a-contemporary-history-of-the-muslim-world-
  part-17-algeria-2.json. Recon/written census {image:13,paragraph:59,embed:4}
  (76 blocks); all 4 embeds carry the raw <iframe ...></iframe> verbatim with
  `&#038;` preserved (D-Tool-21). img_para_leftover / iframe_para_leftover /
  wp-caption_para_leftover / figure_para_leftover = 0. feed.json 8 -> 9
  entries (date-desc; part-17 at idx 7, after part-18). Non-regression:
  pilot 80; controlling-the-narrative 34 {image:5,paragraph:24,quote:4,
  footnotes:1}, quote[3] len=240; update 2 {paragraph:2}; part-18
  {image:14,paragraph:48,embed:1}; part-19 {image:17,paragraph:51}; part-20
  {image:12,paragraph:57,embed:1}; part-21 {image:19,paragraph:82,embed:3};
  part-22 {image:13,paragraph:55} — all byte-identical to their pre-C1b-09b
  committed files. L-005/L-006 remain deferred (seam READY).
