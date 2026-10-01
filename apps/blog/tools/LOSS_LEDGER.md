# Fidelity Loss Ledger

Standing rule (LOCKED_DECISIONS NEW-1/NEW-2): the deployed blog content MUST
faithfully replicate the original WordPress blog. The LIVE HTML extraction
(--from html) is the fidelity oracle AND the C1b migration source. posts.json
is UNTRUSTED. Any currently-unavoidable loss is recorded here and revisited
in a final fidelity check before C1b-DONE. Silent loss is prohibited.

| id    | source | block type | cause | impact | status | resolved-by |
|-------|--------|------------|-------|--------|--------|-------------|
| L-001 | controlling-the-narrative (posts.json entry) | (all) | posts.json is front-truncated: holds 9 of 38 blocks; opening/body lost | 29 of 38 blocks | open | C1b (source = live HTML) |
| L-002 | controlling-the-narrative (live, pre-fix) | footnotes | extractHtmlBlocks dropped core/footnotes (loop break) | 1 block | resolved | C1-tool-seam-complete |
| L-003 | controlling-the-narrative (live, pre-fix) | paragraph | CENSUS MISCOUNT (not a real loss): the four <p> elements are nested inside four wp-block-quote blocks; the seam preserves them within quote content. | 0 blocks (nothing lost) | resolved | C1-tool-seam-complete |
| L-004 | a-contemporary-history-...-part-17-algeria-2 | embed | extraction seam cannot extract core/embed | 1 block | deferred | milestone when series reaches idx 7 |
| L-005 | a-contemporary-history-...-part-15-the-afghan-arabs-foreign-fighters-in-afghanistan | embed | extraction seam cannot extract core/embed | 1 block | deferred | milestone when series reaches idx 9 |
| L-006 | a-contemporary-history-...-part-8-afghanistan-1 | embed | extraction seam cannot extract core/embed | 2 blocks | deferred | milestone when series reaches idx 18 |

Notes:
- L-002 and L-003 are marked resolved only once C1-tool-seam-complete tests 4/5
  reach exactly 38 ({"image":5,"paragraph":28,"quote":4,"footnotes":1}). If not,
  set the unresolved row(s) back to open with a one-line cause.
- L-001 is a CONTENT-SOURCE loss (posts.json), distinct from the extractor
  losses. C1b must migrate from the live HTML, not posts.json.
- L-004..L-006: embed shape unverified (REST API unavailable; part-17 URL not
  fetchable). The deferred milestone must first obtain a valid embed dump.
- posts.json is retained on disk only until C1b-DONE proves 20/20.

- L-003 was recorded in error: q5.js counted quote-internal <p> elements as
  top-level paragraphs. The seam never dropped them. Corrected here; the row is
  retained (not deleted) so the record shows the correction.
