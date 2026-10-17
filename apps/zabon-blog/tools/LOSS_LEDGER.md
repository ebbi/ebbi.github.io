# Fidelity Loss Ledger

Standing rule (LOCKED_DECISIONS NEW-1/NEW-2): the deployed blog content MUST
faithfully replicate the original WordPress blog. The LIVE HTML extraction
(--from html) is the fidelity oracle AND the C1b migration source. posts.json
is UNTRUSTED. Any currently-unavoidable loss is recorded here and revisited
in a final fidelity check before C1b-DONE. Silent loss is prohibited.

| id    | source                                                     | block type    | cause                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | impact                                                                                                                                                                                                                                                                                       | status                                                                                         | resolved-by                                                                                                     |
| ----- | ---------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| L-001 | controlling-the-narrative (posts.json entry)               | (all)         | posts.json is front-truncated: holds 9 of 34 blocks; opening/body lost                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 25 of 34 blocks                                                                                                                                                                                                                                                                              | open                                                                                           | C1b (source = live HTML)                                                                                        |
| L-002 | controlling-the-narrative (live, pre-fix)                  | footnotes     | extractHtmlBlocks dropped core/footnotes (loop break)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 1 block                                                                                                                                                                                                                                                                                      | resolved                                                                                       | C1-tool-seam-complete                                                                                           |
| L-003 | controlling-the-narrative (live, pre-fix)                  | paragraph     | CENSUS MISCOUNT (not a real loss): the four <p> elements are nested inside four wp-block-quote blocks.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 0 blocks                                                                                                                                                                                                                                                                                     | resolved                                                                                       | C1-tool-seam-complete                                                                                           |
| L-004 | a-contemporary-history-...-part-17-algeria-2               | embed         | extraction seam cannot extract core/embed (live markup is the legacy Jetpack wrapper div.jetpack-video-wrapper > span.embed-youtube > iframe; the frozen seam had no rule, so the loop dropped it tag-by-tag)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 4 blocks (not 1; posts.json undercounts)                                                                                                                                                                                                                                                     | resolved                                                                                       | C1b-09b migrated the slug (D-Tool-21, frozen in C1b-09a)                                                        |
| L-005 | a-contemporary-history-...-part-15-the-afghan-arabs...     | embed         | extraction seam cannot extract core/embed (legacy Jetpack wrapper; see L-004)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 1 block (recon census)                                                                                                                                                                                                                                                                       | resolved                                                                                       | C1b-11b migrated the slug (LONG slug; D-Tool-21, frozen in C1b-09a)                                             |
| L-006 | a-contemporary-history-...-part-8-afghanistan-1            | embed         | extraction seam cannot extract core/embed (legacy Jetpack wrapper; see L-004)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 3 blocks (recon census; posts.json advertised 2 — undercounts)                                                                                                                                                                                                                               | resolved                                                                                       | C1b-11i migrated the slug (D-Tool-21, frozen in C1b-09a)                                                        |
| L-007 | controlling-the-narrative (live, pre-fix)                  | quote         | blockFromFragment("quote") ignored <cite> text: the 4th quote carries its body in <cite>, <p> is empty; content was emitted as "".                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 1 block                                                                                                                                                                                                                                                                                      | resolved                                                                                       | C1b-01 (A-fix)                                                                                                  |
| L-008 | update (live)                                              | paragraph     | extractHtmlBlocks TOP list keys on wp-block-_ classes; the update body has ZERO wp-block-_ markers and two BARE <p> elements, so the loop matches nothing and throws no recognised blocks in entry-content. Bare-<p> posts are unrepresentable by the D-Tool-9 seam as frozen.                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 2 of 2 blocks (whole post)                                                                                                                                                                                                                                                                   | resolved                                                                                       | C1b-seam-bare-p (D-Tool-19)                                                                                     |
| L-009 | a-contemporary-history-...-part-22-kosovo-2 (live)         | image         | Legacy WP.com inline images are emitted as bare <p><img class="wp-image-..."></p> (no wp-block-image wrapper). The D-Tool-9 seam froze with only imageWrap (div.wp-block-image) and imageFig (figure.wp-block-image); it had no rule for a bare <p>-wrapped <img>. After D-Tool-19, the bare-<p> rule captured these as paragraph blocks, so 4 images would render as raw <img .../> markup text instead of pictures.                                                                                                                                                                                                                                                                                                                      | 4 of 59 blocks                                                                                                                                                                                                                                                                               | resolved                                                                                       | C1b-03 (D-Tool-20)                                                                                              |
| L-010 | a-contemporary-history-...-part-22-kosovo-2 (feed excerpt) | excerpt       | generate-index.js buildExcerpt() decodes entities but does NOT strip HTML tags; part-22's first paragraph leads with an inline <a href>, so the feed excerpt renders raw anchor markup as text. Content file itself is faithful; defect is in the DERIVED list index only.                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 1 feed excerpt (part-22)                                                                                                                                                                                                                                                                     | deferred                                                                                       | generate-index/list-view milestone (not C1b-04)                                                                 |
| L-011 | a-contemporary-history-...-part-17..22 (live)              | image         | Legacy WP.com caption-shortcode images are emitted as <figure data-shortcode="caption" class="wp-caption aligncenter                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | alignnone"><img ...><figcaption class="wp-caption-text">...</figcaption></figure> (no wp-block-image wrapper). The D-Tool-9 seam had NO rule for figure.wp-caption, so the loop skipped the block and its <img> was silently lost (unrecorded until C1b-09a). Affects every C1b series post. | 7 (part-18) +14 (part-19) +9 (part-20) +14 (part-21) +9 (part-22) +6 (part-17, TBD at C1b-09b) | resolved                                                                                                        | C1b-09a (D-Tool-22); slugs re-migrated |
| L-012 | a-contemporary-history-...-part-9-pakistan-1979 (live)     | image         | Legacy WP.com inline image emitted as a CLASS-LESS bare <div><img .../></div> (no class attribute at all). The D-Tool-9 seam (frozen through D-Tool-25) had NO rule for it, so the loop's skip-and-advance logic dropped the <div> and the <img> tag-by-tag and the image was SILENTLY lost (the same defect shape as L-009/L-011).                                                                                                                                                                                                                                                                                                                                                                                                        | 1 of 43 blocks (`270px-miqbal4.jpg`, data-attachment-id 9237)                                                                                                                                                                                                                                | resolved                                                                                       | C1b-11h-b (part-9 re-migrated; D-Tool-26 frozen in C1b-11h-a)                                                   |
| L-013 | a-contemporary-history-of-the-muslim-world-contents (live) | image + table | The post body is a legacy WP.com CLASS-LESS bare `<table width="916">` layout grid (colgroup/tbody/12 tr/48 td; 23 of the 24 `<img>` live inside `<td>` cells). The D-Tool-9 seam (frozen through D-Tool-26) had NO rule for a bare top-level `<table>` (its only table rule keys on `<figure class="wp-block-table">`), so the loop's skip-and-advance logic stepped past `<table>`/`<td>` tag-by-tag, LEAKING the `<td>`-nested `<p><img>` markup into paragraph text (13 occurrences; the L-009 defect shape) AND DROPPING entirely every `<img>` NOT wrapped in a `<p>` (the second-cell thumbnails). The DROPPED images are SILENT to `*_para_leftover`; only the raw-`<img>` (24) vs rendered-image (0) reconciliation exposes them. | 24 images (0 rendered) + 13 leaked-into-paragraph fragments                                                                                                                                                                                                                                  | resolved                                                                                       | C1b-11k-a-b (contents post re-migrated; D-Tool-27 tableBare + D-Tool-28 imageBarePStrong frozen in C1b-11k-a-a) |
| L-014 | a-contemporary-history-...-part-1 .. part-6 (live)         | (whole posts) | SCOPING LOSS (not an extraction loss): the C1b migration chain began at part-7 (C1b-08, 2016-06-20) and walked FORWARD; the six EARLIEST series posts — parts 1–6 (2015-11-27 .. 2016-06-04) — were never assigned a milestone and were never migrated. The series `contents` grid (the authoritative author numbering 1..23) lists them; the live blog index confirms them. Discovery: human review of the list view after C1b-11k-a-b (the list showed #7.. onward; "missing blogs and the order is not correct").                                                                                                                                                                                                                       | 6 whole posts: part-1, part-2, part-3, part-4, part-5, part-6 (series posts 1..6 of 23)                                                                                                                                                                                                      | resolved                                                                                       | C1b-12..C1b-17 (one post per chat; parts 1–6 migrated ascending); then revised C1b-DONE proves 25/25            |

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
  {image:5,paragraph:24,quote:4,footnotes:1}, quote[3] len=240; update 2
  {paragraph:2}.
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
- posts.json is retained on disk only until C1b-DONE proves 25/25.

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
  in C1b-09b; L-005 migrated in C1b-11b; L-006 migrate at their series milestones.
- L-004: RESOLVED in C1b-09b. part-17 was migrated from the live HTML
  (`--from html`) into content/en/a-contemporary-history-of-the-muslim-world-
  part-17-algeria-2.json. Recon/written census {image:13,paragraph:59,embed:4}
  (76 blocks); all 4 embeds carry the raw <iframe ...></iframe> verbatim with
  `&#038;` preserved (D-Tool-21). img_para_leftover / iframe_para_leftover /
  wp-caption_para_leftover / figure_para_leftover = 0. feed.json 8 -> 9
  entries (date-desc; part-17 at idx 7, after part-18). Non-regression: pilot 80;
  controlling-the-narrative 34 {image:5,paragraph:24,quote:4,footnotes:1}, quote[3]
  len=240; update 2 {paragraph:2}; part-18 {image:14,paragraph:48,embed:1};
  part-19 {image:17,paragraph:51}; part-20 {image:12,paragraph:57,embed:1};
  part-21 {image:19,paragraph:82,embed:3}; part-22 {image:13,paragraph:55} —
  all byte-identical to their pre-C1b-09b committed files. L-005/L-006 remain deferred (seam READY).
- L-005: RESOLVED in C1b-11b. part-15 was migrated from the live HTML
  (`--from html`) into
  content/en/a-contemporary-history-of-the-muslim-world-part-15-the-afghan-arabs-foreign-fighters-in-afghanistan.json
  (the LONG canonical slug; the short `...part-15-the-afghan-arabs` URL
  301-redirects to it). Recon census 1 embed (idx 76); written census
  {image:13,paragraph:67,embed:1} (81 blocks). The single embed carries the
  raw `<iframe ...></iframe>` VERBATIM with `&#038;` preserved (D-Tool-21):
  `<iframe loading="lazy" class="youtube-player" width="660" height="372"
src="https://www.youtube.com/embed/FGhGHxw0mSo?version=3&#038;rel=1&#038;
showsearch=0&#038;showinfo=1&#038;iv_load_policy=1&#038;fs=1&#038;hl=en&#038;
autohide=2&#038;wmode=transparent" ...></iframe>`. The 13 images = 7
  `figure.wp-caption` (D-Tool-22; 7 non-empty captions) + 5 bare `<p><img>`
  (D-Tool-20) + 1 emph-wrapped `<p><em><img></em></p>` (D-Tool-23,
  data-attachment-id 11456). img_para_leftover / iframe_para_leftover /
  wp-caption_para_leftover / figure_para_leftover = 0. feed.json 10 -> 11
  entries (date-desc; part-15 at idx 9, after part-16). Non-regression:
  pilot 80; controlling-the-narrative 34 {image:5,paragraph:24,quote:4,
  footnotes:1}, quote[3] len=240; update 2 {paragraph:2}; part-16
  {image:15,paragraph:71,embed:2}; part-17 {image:13,paragraph:59,embed:4};
  part-18 {image:14,paragraph:48,embed:1}; part-19 {image:17,paragraph:51};
  part-20 {image:12,paragraph:57,embed:1}; part-21 {image:19,paragraph:82,
  embed:3}; part-22 {image:13,paragraph:55} —
  all byte-identical to their
  pre-C1b-11b committed files. L-006 (part-8) remains deferred (seam READY).
- L-012: RESOLVED in C1b-11h-b. part-9 was migrated from the live HTML
  (`--from html`) into
  content/en/a-contemporary-history-of-the-muslim-world-part-9-pakistan-1979.json
  (canonical slug; HTTP 200, no redirect, no `protected-` prefix). Written
  census {image:14,paragraph:28,embed:1} (43 blocks). CRITICAL reconciliation:
  the raw `<img>` count (14) EQUALS the rendered image-block count (14) — no
  silent drop. The 14 images = 8 bare `<p><img>` (D-Tool-20) + 5
  `figure.wp-caption` (D-Tool-22; 5 non-empty captions) + 1 divBareImg
  (D-Tool-26; the recovered `270px-miqbal4.jpg`, data-attachment-id 9237, src
  `https://twolegsbadblog.wordpress.com/wp-content/uploads/2016/10/270px-miqbal4.jpg?w=660`
  verbatim). All `*_para_leftover` = 0 (img/iframe/figure/wp-caption/jetpack).
  The 1 embed carries the raw `<iframe ...></iframe>` verbatim with `&#038;`
  preserved (D-Tool-21). feed.json 16 -> 17 entries (date-desc; part-9 at
  idx 16, LAST — its date 2016-12-25 is OLDER than part-10's 2017-01-06).
  Non-regression: pilot 80 {image:15,paragraph:62,quote:2,table:1};
  controlling-the-narrative 34 {image:5,paragraph:24,quote:4,footnotes:1},
  quote[3] len=240; update 2 {paragraph:2}; part-10..22 — all byte-identical
  to their committed files. L-006 (part-8 afghanistan-1) remains deferred
  (seam READY); NOT resolved here. (C1b-11h-b note)
- L-012 (history): discovered in C1b-11h recon (migrate part-9); the class
  was confined to part-9. part-9's live body has 14 raw <img> but the
  seam (frozen through D-Tool-25) rendered only 13. The 14th
  (`270px-miqbal4.jpg`, data-attachment-id 9237) is wrapped in a CLASS-LESS
  bare `<div><img .../></div>` (no class attribute at all), which matched NO
  TOP entry; the loop's skip-and-advance logic then dropped the `<div>` and
  the `<img>` tag-by-tag, SILENTLY losing the image. Same defect shape as
  L-009/L-011 (a legacy image markup class the seam did not model). CRITICAL:
  this loss is SILENT to the `*_para_leftover` checks (the markup is DROPPED,
  not leaked into a paragraph), so only reconciling the raw `<img>` count
  (14) against the rendered image-block count (13) exposes it. RESOLVED by
  freezing D-Tool-26 (divBareImg: a class-less bare `<div>` whose sole child
  is a single `<img>` -> the EXISTING image shape { type, src, caption:"" })
  in C1b-11h-a, then re-migrating part-9 in C1b-11h-b. Confined to part-9
  (0 occurrences in all 20 other cached sources; no shipped slug affected, no
  retrospective re-migration). Seam-readiness (C1b-11h-a): re-recon of part-9
  -> {image:14,paragraph:28,embed:1} (43 blocks), all `*_para_leftover` = 0;
  recovered image src
  `https://twolegsbadblog.wordpress.com/wp-content/uploads/2016/10/270px-miqbal4.jpg?w=660`
  (verbatim, entities preserved). Non-regression: pilot 80
  {image:15,paragraph:62,quote:2,table:1}; controlling-the-narrative 34
  {image:5,paragraph:24,quote:4,footnotes:1}, quote[3] len=240; update 2
  {paragraph:2}; part-10..22 all byte-identical to their committed files.
  (D-Tool-26; C1b-11h-a note)
- L-006: RESOLVED in C1b-11i. part-8 was migrated from the live HTML
  (`--from html`) into
  content/en/a-contemporary-history-of-the-muslim-world-part-8-afghanistan-1.json
  (canonical slug; HTTP 200, no redirect, no `protected-` prefix, entry-content
  present; slug/title/date match posts.json). Recon MEASURED the census (NO
  count pre-committed): written census {paragraph:40,image:14,embed:3}
  (57 blocks). The embed count is 3 (posts.json advertised 2 — an undercount,
  consistent with part-17's 1-vs-4). All 3 embeds carry the raw
  `<iframe ...></iframe>` VERBATIM with `&#038;` preserved (D-Tool-21):
  youtube IDs wvwP0mC8qHE (idx 36), A9RCFZnWGE0 (idx 50), arPP37g1Rmo
  (idx 54). CRITICAL reconciliation: the raw `<img>` count (14) EQUALS the
  rendered image-block count (14) — no silent drop. The 14 images = 11 bare
  `<p><img>` (D-Tool-20) + 3 `figure.wp-caption` (D-Tool-22; 3 non-empty
  captions: "Emblem of the PDPA", "Left to right: Nur Muhammad Taraki,
  Hafizullah Amin and Babrak Karmal.", "Left to right: Rabbani, Massoud and
  Hekmatyar."). All `*_para_leftover` = 0 (img/iframe/figure/wp-caption/
  jetpack). feed.json 17 -> 18 entries (date-desc; part-8 at idx 17, LAST —
  its date 2016-08-02 is OLDER than part-9's 2016-12-25). Non-regression: pilot 80 {image:15,paragraph:62,quote:2,table:1};
  controlling-the-narrative 34 {image:5,paragraph:24,quote:4,footnotes:1},
  quote[3] len=240; update 2 {paragraph:2}; part-9..22 all byte-identical to
  their committed files.
  No new seam class; import-post.js untouched (seam frozen through D-Tool-26).
  (C1b-11i note)
- L-013: discovered in C1b-11k recon (migrate the series post
  `a-contemporary-history-of-the-muslim-world-contents`). The post body is a
  legacy WP.com CLASS-LESS bare `<table width="916" cellspacing="0"
cellpadding="0">` layout grid (colgroup/tbody/12 tr/48 td; alternating
  link-text | thumbnail cells) holding 23 of the post's 24 raw `<img>`. The
  D-Tool-9 seam (frozen through D-Tool-26) had NO rule for a bare top-level
  `<table>`: its only table rule keys on `<figure class="wp-block-table">`.
  The loop's skip-and-advance logic therefore stepped past
  `<table>`/`<colgroup>`/`<tbody>`/`<tr>`/`<td>` tag-by-tag, LEAKING the
  `<td>`-nested `<p align="center"><strong><img></strong></p>` markup into
  paragraph text (13 occurrences of the L-009 defect shape) AND DROPPING
  entirely every `<img>` NOT wrapped in a `<p>` (the second-cell thumbnails).
  Recon with the seam through D-Tool-26: {paragraph:16} (16 blocks),
  img_para_leftover = 13, rendered image blocks = 0 vs 24 raw `<img>` (a
  MASSIVE silent loss — the DROPPED images are invisible to `*_para_leftover`;
  only the raw-`<img>` vs rendered-image reconciliation exposes them). A SECOND
  new class surfaced when tableBare was applied alone in C1b-11k-a: a bare
  `<p>` whose ENTIRE content is a single `<strong>`-wrapped `<img>`
  (`<p style="text-align:justify"><strong><img .../></strong></p>`, the
  recovered `afghans1.png`, data-attachment-id 10954, sitting AFTER the
  `</table>`); D-Tool-23 imageBarePEm keys on `<em>`, NOT `<strong>`, so
  paragraphBare captured it (img_para_leftover = 1). RESOLVED by freezing BOTH
  D-Tool-27 (tableBare: a class-less bare top-level `<table>` -> the EXISTING
  `table` shape { type:"table", content:<inner HTML> }) and D-Tool-28
  (imageBarePStrong: a bare `<p>` whose entire content is a single
  `<strong>`-wrapped `<img>` -> the EXISTING image shape { type, src,
  caption:"" }) in C1b-11k-a-a, then re-migrating the post in C1b-11k-a-b.
  Confined to the contents post (class-less bare `<table>` and the
  `<strong>`-wrapped image occur in ONLY its 2 cache copies; 0 occurrences in
  all 20 other cached sources — no shipped slug affected, no retrospective
  re-migration). Seam-readiness (C1b-11k-a-a): re-recon of the contents post
  -> {table:1,paragraph:2,image:1} (4 blocks), all `*_para_leftover` = 0; the
  24 raw `<img>` accounted for (23 subsumed by the single `table` block
  [inner HTML len 29665, links+images verbatim] + 1 imageBarePStrong
  `afghans1.png`, data-attachment-id 10954, src verbatim); the 2 paragraph
  blocks are the post's `<p> </p>`-style spacers (EMPTY, content "", which is
  pre-existing paragraphBare behaviour, NOT a new class). The pilot's bare
  `<table>` is WRAPPED in `<figure class="wp-block-table aligncenter">`, so
  tableBare does NOT fire for the pilot (its {table:1} census is UNCHANGED).
  Non-regression: pilot 80 {image:15,paragraph:62,quote:2,table:1};
  controlling-the-narrative 34 {image:5,paragraph:24,quote:4,footnotes:1},
  quote[3] len=240; update 2 {paragraph:2}; part-7..22 — ALL 19 committed
  content/en/\*.json re-extract BYTE-IDENTICAL. (D-Tool-27 + D-Tool-28;
  C1b-11k-a-a note)
- L-013: RESOLVED in C1b-11k-a-b. The contents post was migrated from the
  live HTML (`--from html`) into
  content/en/a-contemporary-history-of-the-muslim-world-contents.json
  (canonical slug; HTTP 200, no redirect, no `protected-` prefix, entry-content
  present; slug/title/date match posts.json — NO discrepancy). Recon MEASURED
  the census (NO count pre-committed): written census
  {table:1,image:1,paragraph:2} (4 blocks). CRITICAL reconciliation: the raw
  `<img>` count in entry-content (24) EQUALS the rendered blocks' image total
  (23 subsumed by the single `table` block + 1 `image` block) — no silent
  drop; raw `<iframe>` (0) == rendered embed (0); raw `<figure>` (0), raw
  `<figcaption>` (0), jetpack wrappers (0). All `*_para_leftover` = 0
  (img/iframe/figure/wp-caption/jetpack); no `<img>` markup leaks into any
  paragraph block. Block [1] `table` carries the inner HTML of the source
  `<table>` VERBATIM (colgroup/tbody/12 `<tr>`/48 `<td>`, links+images
  preserved; outer `<table>` tag dropped per D-Tool-15; content len 29665).
  Block [2] `image` is the recovered D-Tool-28 imageBarePStrong `afghans1.png`
  (data-attachment-id 10954, src
  `https://twolegsbadblog.wordpress.com/wp-content/uploads/2017/01/afghans1.png`
  verbatim, caption ""). Blocks [0],[3] `paragraph` are the post's two EMPTY
  `<p> </p>` spacers (pre-existing paragraphBare behaviour, NOT a new class).
  feed.json 19 -> 20 entries (date-desc; the post's date 2017-01-20 sits
  between part-11's 2017-02-08 and part-10's 2017-01-06, so it sorts POSITIONALLY
  at idx 15: after part-11 (idx 14), before part-10 (idx 16) — verified).
  Non-regression: pilot 80 {image:15,paragraph:62,quote:2,table:1};
  controlling-the-narrative 34 {image:5,paragraph:24,quote:4,footnotes:1},
  quote[3] len=240; update 2 {paragraph:2}; part-7..22 — all byte-identical to
  their committed files. No new seam class; import-post.js untouched (seam
  frozen through D-Tool-28). After this, ALL series EN posts are migrated; C1b-DONE proves 25/25, then posts.json deletion is unblocked.
  (C1b-11k-a-b note)
- L-014: discovered by HUMAN review of the list view after C1b-11k-a-b. The
  C1b-11k-a-b note's claim "ALL series EN posts are migrated" was WRONG: the
  chain began at part-7 (C1b-08) and walked forward, so the six EARLIEST
  series posts (parts 1–6, dated 2015-11-27 .. 2016-06-04) were never
  assigned a milestone and were never migrated. The AUTHORITATIVE series
  numbering is the `contents` post's own grid (1..23); the live blog index
  (https://twolegsbadblog.wordpress.com/) confirms the same set. The correct
  series total is 23 posts (parts 1–22 + "Jews in Palestine before Israel"),
  plus 2 non-series EN posts (`update`, `controlling-the-narrative`) = 25 EN
  content files (NOT 20). This is a SCOPING/planning loss, NOT an extraction
  loss: no seam class is involved and NO shipped content file is affected
  (the 20 present files remain faithful). The missing posts (grid order):
  part-1 `2015/11/27/what-we-have-forgotten-and-they-havent-a-history-of-
political-islam-and-the-west/`; part-2 `2015/12/13/…-part-2/`;
  part-3 `2016/02/21/a-history-of-political-islam-and-the-west-part-3-iran-
revolution-1/`; part-4 `2016/03/26/…part-4-iran-revolution-2/`;
  part-5 `2016/05/19/a-contemporary-history-of-the-muslim-world-part-5-the-
lebanese-civil-war-1/`; part-6 `2016/06/04/…part-6-the-lebanese-civil-
war-2/`. SLUG NOTE: parts 1–4 carry legacy non-uniform slugs (NOT the
  `a-contemporary-history-of-the-muslim-world-part-N-…` pattern); we keep
  the LIVE canonical slugs (faithful; no 404s; consistent with part-13's
  `protected-` prefix and part-15's LONG slug). Resolution: migrate parts
  1–6 ascending (C1b-12..C1b-17, one post per chat), add a series-order
  field/sort to the derived index + list view ( C1b-18), then a REVISED
  C1b-DONE proves 25/25.
  (L-014; C1b-11k-a-b-discovery note)
- L-014: RESOLVED. All six earliest series posts were migrated, ascending,
  one post per chat: C1b-12 (part-1, {image:11,paragraph:50} (61)),
  C1b-13b (part-2, {image:21,paragraph:53,embed:2} (76); seam D-Tool-29 added
  in C1b-13a for the new `imageBarePProse` class), C1b-14 (part-3,
  {image:11,paragraph:44,embed:2} (57)), C1b-15 (part-4,
  {image:12,paragraph:43} (55)), C1b-16 (part-5,
  {image:17,paragraph:29,embed:1} (47)), C1b-17 (part-6,
  {image:17,paragraph:35,embed:1} (53)). For EVERY one: raw `<img>` count ==
  rendered image-block count (1:1 src match in order where checked), raw
  `<iframe>` == rendered embed, all `*_para_leftover`=0, and NO new seam class
  (except part-2's imageBarePProse, D-Tool-29). The 23 series EN posts
  (parts 1–22 + "Jews in Palestine before Israel") + 2 non-series (`update`,
  `controlling-the-narrative`) = 25 EN content files are now present and
  byte-faithful; the revised C1b-DONE proves 25/25. Non-regression at each
  step: pilot 80 {image:15,paragraph:62,quote:2,table:1};
  controlling-the-narrative 34 {image:5,paragraph:24,quote:4,footnotes:1},
  quote[3] len=240; update 2 {paragraph:2}; the contents post
  {table:1,image:1,paragraph:2}; and every prior committed content/en/\*.json
  re-extract BYTE-IDENTICAL. (L-014; C1b-12..C1b-17 resolutions)
- L-001: FINAL CLOSURE (C1b-DONE). L-001 is a CONTENT-SOURCE loss: the
  UNTRUSTED, front-truncated posts.json entry for `controlling-the-narrative`
  held 9 of 34 blocks. It is resolved BY DESIGN because the C1b migration
  source (and the fidelity oracle) is the LIVE HTML, not posts.json; the
  committed `controlling-the-narrative.json` is byte-faithful from the live
  HTML ({image:5,paragraph:24,quote:4,footnotes:1} (34 blocks), quote[3]
  len=240). The final C1b-DONE fidelity check re-extracted EVERY committed
  content/en/*.json from the live HTML (cache-first) and confirmed 26/26
  BYTE-IDENTICAL, every census == expected, all `*_para_leftover` = 0, and
  raw `<img>`/`<iframe>` == rendered block counts. With 25/25 EN content
  files proven, posts.json is fully INERT (feed.json/app.js read content/ and
  feed.json, never posts.json) and its human-gated deletion is now UNBLOCKED
  (NOT executed here). L-001 stays "open" in the table only to record it is a
  by-design, source-only artifact; it requires no extraction fix. (C1b-DONE note)
- L-010: DEFERRAL REAFFIRMED (C1b-DONE). Still deferred to a generate-index /
  list-view milestone; it is a DERIVED feed-excerpt HTML leak (part-22),
  NOT a C1b seam/content issue. The part-22 CONTENT file remains byte-faithful
  ({image:13,paragraph:55} (68 blocks)). (C1b-DONE note)
- L-006: RESOLVED in C1b-11i (cross-reference; see the L-006 C1b-11i note
  above). (C1b-DONE reconciliation)
