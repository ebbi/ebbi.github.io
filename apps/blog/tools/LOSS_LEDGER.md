# Fidelity Loss Ledger

Standing rule (LOCKED_DECISIONS NEW-1/NEW-2): the deployed blog content MUST
faithfully replicate the original WordPress blog. The LIVE HTML extraction
(--from html) is the fidelity oracle AND the C1b migration source. posts.json
is UNTRUSTED. Any currently-unavoidable loss is recorded here and revisited
in a final fidelity check before C1b-DONE. Silent loss is prohibited.

| id    | source                                                 | block type | cause                                                                                                                              | impact          | status   | resolved-by                          |
| ----- | ------------------------------------------------------ | ---------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------- | -------- | ------------------------------------ |
| L-001 | controlling-the-narrative (posts.json entry)           | (all)      | posts.json is front-truncated: holds 9 of 34 blocks; opening/body lost                                                             | 25 of 34 blocks | open     | C1b (source = live HTML)             |
| L-002 | controlling-the-narrative (live, pre-fix)              | footnotes  | extractHtmlBlocks dropped core/footnotes (loop break)                                                                              | 1 block         | resolved | C1-tool-seam-complete                |
| L-003 | controlling-the-narrative (live, pre-fix)              | paragraph  | CENSUS MISCOUNT (not a real loss): the four <p> elements are nested inside four wp-block-quote blocks.                             | 0 blocks        | resolved | C1-tool-seam-complete                |
| L-004 | a-contemporary-history-...-part-17-algeria-2           | embed      | extraction seam cannot extract core/embed                                                                                          | 1 block         | deferred | milestone when series reaches idx 7  |
| L-005 | a-contemporary-history-...-part-15-the-afghan-arabs... | embed      | extraction seam cannot extract core/embed                                                                                          | 1 block         | deferred | milestone when series reaches idx 9  |
| L-006 | a-contemporary-history-...-part-8-afghanistan-1        | embed      | extraction seam cannot extract core/embed                                                                                          | 2 blocks        | deferred | milestone when series reaches idx 18 |
| L-007 | controlling-the-narrative (live, pre-fix)              | quote      | blockFromFragment("quote") ignored <cite> text: the 4th quote carries its body in <cite>, <p> is empty; content was emitted as "". | 1 block         | resolved | C1b-01 (A-fix)                       |
| L-008 | update (live)                                          | paragraph  | extractHtmlBlocks TOP list keys on wp-block-* classes; the update body has ZERO wp-block-* markers and two BARE <p> elements, so the loop matches nothing and throws no recognised blocks in entry-content. Bare-<p> posts are unrepresentable by the D-Tool-9 seam as frozen. | 2 of 2 blocks (whole post) | open | C1b-seam-bare-p (proposed)          |

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
- L-008: mitigation (NOT taken this milestone) is to teach the TOP loop and
  blockFromFragment a bare-<p> rule limited to entry-content. That is a
  second narrow extension of the D-Tool-9 seam freeze (the first was
  D-Tool-18), and must be its own milestone with its own locked-decision
  entry before update.json is written. Evidence: cached dump 92258 bytes;
  grep -c '<p>' = 2; grep -c 'wp-block-*' = 0; 4 KB window after
  entry-content open shows the two bare <p> then the Jetpack Share block.
- posts.json is retained on disk only until C1b-DONE proves 20/20.
