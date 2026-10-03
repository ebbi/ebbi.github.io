HANDOFF — Chat C1b-11g: Migrate part-10 (Afghanistan and Pakistan #2)
Status: complete
Current chat id: C1b-11g
Current milestone: C1b-11g
Completed milestones: C1a, C1-tool, C1-tool-p2, C1-model, C1-tool-cleanup, C1-tool-seam-complete, C1b-01, C1b-seam-bare-p, C1b-02, C1b-03, C1b-04, C1b-05, C1b-06, C1b-07, C1b-08, C1b-09a, C1b-09b, C1b-10, C1b-11, C1b-11a, C1b-11b, C1b-11c, C1b-11d, C1b-11e (partial/STOP — re-scoped), C1b-11e-a, C1b-11e-b, C1b-11f, C1b-11g
Next chat id: C1b-11h
Context windows used: 1
Files created/modified (exact paths)
- apps/blog/content/en/a-contemporary-history-of-the-muslim-world-part-10-afghanistan-pakistan-2.json (NEW; 59 blocks)
- apps/blog/assets/data/feed.json (MOD; regenerate; 15 -> 16 entries)
- apps/blog/tools/ROADMAP.md (MOD; C1b-11g -> Done; Next -> C1b-11h)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> this file)
- apps/blog/HANDOFF-C1b-11g.md (NEW; this file)
- apps/blog/tools/milestones/C1b-11h.md (NEW; next EN post in the series)
Frozen decisions made in this chat
- None. No seam change; LOCKED_DECISIONS.txt untouched. D-Tool-24
  (imageBarePTrailing) and D-Tool-25 (embedInBareP) were frozen in C1b-11e-a.

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=7958f41ecde2ac65ab66d85af56a251b50d651122cb8685fd7a491d3b1b52cdc
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, NOT in the handoff. See tools/WORKFLOW.md step 6.
Expected delta for the next chat
- C1b-11h: migrate
  `a-contemporary-history-of-the-muslim-world-part-9-pakistan-1979`
  (posts.json date 2016-12-25T23:31:45+00:00) from the live HTML
  (`--from html`) into content/en/. Confirm slug/title/date against the live
  post (every C1b series milestone does this). MEASURE the census at recon;
  do NOT pre-commit a count. Regenerate feed.json 16 -> 17 entries
  (date-desc; part-9's date 2016-12-25 is OLDER than part-10's 2017-01-06, so
  part-9 sorts AFTER part-10 — likely LAST). Author C1b-11i.md at close.
Human edits made outside tooling (structured)
- None reported.
Open warnings (count + links only)
1. tools/*.md whitespace may not survive chat copy; anchor edits from `cat -A`. (carried C1b-03/04)
2. Edit splice pitfall: verify POSITIONALLY, not by substring. (carried C1b-04)
3. Stale "## The commit" line in HANDOFF-C1b-seam-bare-p.md (points at 50ffad5) — still unfixed. (carried)
4. LOSS_LEDGER.md table padding mixed (cosmetic). (carried)
5. (carried C1b-07, process) prior chat initially routed shell to the human; resolved.
6. hash-state.js FILE_TREE_SHA256 capture rule: capture AFTER staging; see
   C1b-09a deviation note. (carried)
7. (carried C1b-11a) milestone regex lookahead vs task-text transcription
   (missing `*` quantifiers). Frozen-form regex used.
8. (recurring) a 0-byte stray file appears at repo root (name like
   "^A^D...@p9N@8"); none present this chat (checked: repo root + app root
   clean of 0-byte files before any write).
Deviations from locked decisions (must be empty, or explain)
- None. NO seam change; import-post.js byte-identical; LOCKED_DECISIONS.txt
  byte-identical. No D-Tool-23/24/25 occurrences in part-10 (all 0); every
  class is already frozen (D-Tool-20/21/22).
- PROCESS DEVIATION (milestone-prose feed-index slip, not a code deviation):
  C1b-11g.md predicted feed.json "part-10 at idx 14, after part-11, before
  `...-contents`". Actual date-desc placement is idx 15 (LAST):
  part-10's date (2017-01-06) is OLDER than part-11's (2017-02-08), so the
  generator (strict Date.parse descending) places part-10 AFTER part-11.
  The `...-contents` post is NOT in the feed (the feed holds only migrated
  content/en/ slugs; `...-contents` is not yet migrated). idx 15 is correct;
  the milestone prose's expected index was wrong. No content/generator change.
Partial work (link to PARTIAL.md if present)
- apps/blog/PARTIAL.md (C1b-11e STOP record; unchanged here).
Known issues / TODOs
- NO loss discovered this milestone; LOSS_LEDGER.md untouched (no new row).
- L-006 (part-8 afghanistan-1) remains deferred (seam READY); NOT resolved here.
- The tolerance note (carried from C1b-09b): the seam is now frozen through
  D-Tool-25; ANY further new class STOPS and re-scopes (its own milestone).
- remaining unmigrated series EN posts after C1b-11g: part-9 (C1b-11h),
  part-8 (L-006), part-7, and the series `...-muslim-world-contents`.
Assumptions the next chat may rely on
- The seam is frozen through D-Tool-25. No seam change performed here.
- part-10 was migrated from the LIVE HTML (`--from html`); the import-post
  cache holds it (cache sha256 8e02fa2c55774fdfe0946414b695e1361c5f5b3fefe1b41bf5e98acbbba08a09,
  187344 bytes; entry-content length 67247).
- Written census {image:18,paragraph:40,embed:1} (59 blocks), IDENTICAL to the
  C1b-11f seam-READY recon. The 18 images = 13 bare <p><img> (D-Tool-20) + 5
  figure.wp-caption (D-Tool-22; 5 non-empty captions). The 1 embed = a single
  standalone D-Tool-21 legacy Jetpack embed, raw <iframe ...></iframe>
  verbatim with &#038; preserved (src youtube embed qJaZtAYM9KU). imageBarePEm
  (D-Tool-23), imageBarePTrailing (D-Tool-24) and embedInBareP (D-Tool-25) are
  all 0 in this post.
- NON-REGRESSION PROVEN: re-extraction of every cached source re-produces the
  committed content block-for-block: pilot 80 {image:15,paragraph:62,quote:2,
  table:1}; ctn 34 {image:5,paragraph:24,quote:4,footnotes:1}; update 2
  {paragraph:2}; part-11 52 {image:9,paragraph:36,embed:7}; part-12 57
  {image:12,paragraph:43,embed:2}; part-13 52
  {image:13,paragraph:37,embed:2}; part-14 32 {image:9,paragraph:23}; part-15
  81 {image:13,paragraph:67,embed:1}; part-16 88
  {image:15,paragraph:71,embed:2}; part-17 76
  {image:13,paragraph:59,embed:4}; part-18 63
  {image:14,paragraph:48,embed:1}; part-19 68 {image:17,paragraph:51}; part-20
  70 {image:12,paragraph:57,embed:1}; part-21 104
  {image:19,paragraph:82,embed:3}; part-22 68 {image:13,paragraph:55} — ALL
  IDENTICAL (byte-compare of JSON.stringify: 16/16 files identical, 0
  mismatch). All 16 shipped content/en/*.json reproduce byte-identically
  (title/date/slug/blocks).
- feed.json is 16 entries, date-desc; part-10 at idx 15 (LAST; after part-11).
Test checklist result (pass/fail per item)
- git status --porcelain clean at open: pass
- test-integrity INTEGRITY OK at open: pass
- LOCKED_DECISIONS_SHA256 = 7958f41e... at open (matches C1b-11f): pass
- GIT_HEAD = 7474b4da... at open (matches C1b-11f): pass
- part-10 URL HTTP 200, entry-content present, no redirect, no protected- prefix: pass
- node --check import-post.js passes: pass
- part-10 content file written with the canonical slug: pass
- census {image:18,paragraph:40,embed:1} (59 blocks) matches recon: pass
- the 1 embed raw <iframe> verbatim with &#038; preserved; 5 captions: pass
- all *_para_leftover = 0 (img/iframe/figure/wp-caption): pass
- feed.json 16 entries (date-desc; part-10 at idx 15): pass
- no loss -> LOSS_LEDGER.md untouched: pass
- Non-regression pilot/ctn/update/part-11..22 all unchanged: pass
- test-integrity INTEGRITY OK at close: pass
- hash-state captured: pass
Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1b-11g.md
- apps/blog/PARTIAL.md
- apps/blog/tools/milestones/C1b-11h.md (this is the next milestone's file)
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/LOSS_LEDGER.md
- apps/blog/tools/ROADMAP.md
