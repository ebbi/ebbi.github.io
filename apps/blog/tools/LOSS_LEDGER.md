# Fidelity Loss Ledger

Standing rule (LOCKED_DECISIONS NEW-1/NEW-2): the deployed blog content MUST
faithfully replicate the original WordPress blog. The LIVE HTML extraction
(--from html) is the fidelity oracle AND the C1b migration source. posts.json
is UNTRUSTED. Any currently-unavoidable loss is recorded here and revisited
in a final fidelity check before C1b-DONE. Silent loss is prohibited.

| id    | source                                                 | block type | cause                                                                                                                                                                                                                                                                          | impact                     | status   | resolved-by                          |
| ----- | ------------------------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------- | -------- | ------------------------------------ |
| L-001 | controlling-the-narrative (posts.json entry)           | (all)      | posts.json is front-truncated: holds 9 of 34 blocks; opening/body lost                                                                                                                                                                                                         | 25 of 34 blocks            | open     | C1b (source = live HTML)             |
| L-002 | controlling-the-narrative (live, pre-fix)              | footnotes  | extractHtmlBlocks dropped core/footnotes (loop break)                                                                                                                                                                                                                          | 1 block                    | resolved | C1-tool-seam-complete                |
| L-003 | controlling-the-narrative (live, pre-fix)              | paragraph  | CENSUS MISCOUNT (not a real loss): the four <p> elements are nested inside four wp-block-quote blocks.                                                                                                                                                                         | 0 blocks                   | resolved | C1-tool-seam-complete                |
| L-004 | a-contemporary-history-...-part-17-algeria-2           | embed      | extraction seam cannot extract core/embed                                                                                                                                                                                                                                      | 1 block                    | deferred | milestone when series reaches idx 7  |
| L-005 | a-contemporary-history-...-part-15-the-afghan-arabs... | embed      | extraction seam cannot extract core/embed                                                                                                                                                                                                                                      | 1 block                    | deferred | milestone when series reaches idx 9  |
| L-006 | a-contemporary-history-...-part-8-afghanistan-1        | embed      | extraction seam cannot extract core/embed                                                                                                                                                                                                                                      | 2 blocks                   | deferred | milestone when series reaches idx 18 |
| L-007 | controlling-the-narrative (live, pre-fix)              | quote      | blockFromFragment("quote") ignored <cite> text: the 4th quote carries its body in <cite>, <p> is empty; content was emitted as "".                                                                                                                                             | 1 block                    | resolved | C1b-01 (A-fix)                       |
| L-008 | update (live)                                          | paragraph  | extractHtmlBlocks TOP list keys on wp-block-* classes; the update body has ZERO wp-block-* markers and two BARE <p> elements, so the loop matches nothing and throws no recognised blocks in entry-content. Bare-<p> posts are unrepresentable by the D-Tool-9 seam as frozen. | 2 of 2 blocks (whole post) | resolved | C1b-seam-bare-p (D-Tool-19)          |
| L-009 | a-contemporary-history-...-part-22-kosovo-2 (live) | image | Legacy WP.com inline images are emitted as bare <p><img class="wp-image-..."></p> (no wp-block-image wrapper). The D-Tool-9 seam froze with only imageWrap (div.wp-block-image) and imageFig (figure.wp-block-image); it had no rule for a bare <p>-wrapped <img>. After D-Tool-19, the bare-<p> rule captured these as paragraph blocks, so 4 images would render as raw <img .../> markup text instead of pictures. | 4 of 59 blocks | resolved | C1b-03 (D-Tool-20) |

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
- posts.json is retained on disk only until C1b-DONE proves 20/20.
