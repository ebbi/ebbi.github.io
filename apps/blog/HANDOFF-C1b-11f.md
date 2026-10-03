HANDOFF — Chat C1b-11f: Migrate part-11 (Afghanistan #3 : Enter the Taliban)
Status: complete
Current chat id: C1b-11f
Current milestone: C1b-11f
Completed milestones: C1a, C1-tool, C1-tool-p2, C1-model, C1-tool-cleanup, C1-tool-seam-complete, C1b-01, C1b-seam-bare-p, C1b-02, C1b-03, C1b-04, C1b-05, C1b-06, C1b-07, C1b-08, C1b-09a, C1b-09b, C1b-10, C1b-11, C1b-11a, C1b-11b, C1b-11c, C1b-11d, C1b-11e (partial/STOP — re-scoped), C1b-11e-a, C1b-11e-b, C1b-11f
Next chat id: C1b-11g
Context windows used: 1
Files created/modified (exact paths)
- apps/blog/content/en/a-contemporary-history-of-the-muslim-world-11-afghanistan-3.json (NEW; 52 blocks)
- apps/blog/assets/data/feed.json (MOD; regenerate; 14 -> 15 entries)
- apps/blog/tools/ROADMAP.md (MOD; C1b-11f -> Done; added C1b-11g; Next -> C1b-11g)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> this file)
- apps/blog/HANDOFF-C1b-11f.md (NEW; this file)
- apps/blog/tools/milestones/C1b-11g.md (NEW; next EN post in the series)
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
- C1b-11g: migrate
  `a-contemporary-history-of-the-muslim-world-part-10-afghanistan-pakistan-2`
  (date 2017-01-06T20:57:50+00:00) from the live HTML (`--from html`) into
  content/en/. Live canonical URL HTTP 200, no redirect, no `protected-`
  prefix; title "A contemporary history of the Muslim world, part 10:
  Afghanistan (and Pakistan) #2". Seam-READY recon (performed at this close)
  measured census {image:18,paragraph:40,embed:1} (59 blocks),
  img_para_leftover=0 AND iframe_para_leftover=0. Regenerate feed.json
  15 -> 16 entries (date-desc; part-10 inserts after part-11). Author
  C1b-11h.md at close.
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
   "^A^D...@p9N@8"); deleted before any write. None present this chat.
Deviations from locked decisions (must be empty, or explain)
- None. NO seam change; import-post.js byte-identical; LOCKED_DECISIONS.txt
  byte-identical. No D-Tool-24/25 occurrences in part-11 (both are 0); every
  class is already frozen (D-Tool-20/21/22).
- PROCESS DEVIATION (milestone-prose date slip, not a code deviation):
  C1b-11f.md predicted feed.json "part-11 at idx 13, after part-12, before
  update". Actual date-desc placement is idx 14 (LAST), AFTER `update`:
  part-11's date (2017-02-08) is OLDER than update's (2017-11-01). The
  generator sorts strictly by Date.parse descending, so idx 14 is correct;
  the milestone prose's expected index was wrong. No content/generator change.
Partial work (link to PARTIAL.md if present)
- apps/blog/PARTIAL.md (C1b-11e STOP record; unchanged here).
Known issues / TODOs
- NO loss discovered this milestone; LOSS_LEDGER.md untouched (no new row).
- L-006 (part-8 afghanistan-1) remains deferred (seam READY); NOT resolved here.
- The tolerance note (carried from C1b-09b): the seam is now frozen through
  D-Tool-25; ANY further new class STOPS and re-scopes (its own milestone).
- remaining unmigrated series EN posts after C1b-11f: part-10 (C1b-11g),
  part-9, part-8 (L-006), part-7, and the series `...-muslim-world-contents`.
Assumptions the next chat may rely on
- The seam is frozen through D-Tool-25. No seam change performed here.
- part-11 was migrated from the LIVE HTML (`--from html`); the import-post
  cache holds it (cache sha256 d4cd3c21fbb199e1856014ce9f6b54e4e06ae9a612cff4b73b3d24777602c63a,
  159729 bytes; entry-content length 50900).
- Written census {image:9,paragraph:36,embed:7} (52 blocks), IDENTICAL to the
  C1b-11e-b seam-READY recon. The 9 images = 6 bare <p><img> (D-Tool-20) + 3
  figure.wp-caption (D-Tool-22; 3 non-empty captions). The 7 embeds = 7
  standalone D-Tool-21 embeds (all raw <iframe ...></iframe> verbatim, 411
  bytes each, with &#038; preserved); embedInBareP (D-Tool-25) = 0 and
  imageBarePTrailing (D-Tool-24) = 0 in this post.
- NON-REGRESSION PROVEN: re-extraction of every cached source re-produces the
  committed content block-for-block: pilot 80 {image:15,paragraph:62,quote:2,
  table:1}; ctn 34 {image:5,paragraph:24,quote:4,footnotes:1} quote[3] len=240;
  update 2 {paragraph:2}; part-12 57; part-13 52; part-14 32; part-15 81;
  part-16 88; part-17 76; part-18 63; part-19 68; part-20 70; part-21 104;
  part-22 68 — ALL IDENTICAL (byte-compare of JSON.stringify: 15/15 files
  identical, 0 mismatch). All 15 shipped content/en/*.json reproduce
  byte-identically (title/date/slug/blocks).
- feed.json is 15 entries, date-desc; part-11 at idx 14 (LAST; after `update`).
Test checklist result (pass/fail per item)
- git status --porcelain clean at open: pass
- test-integrity INTEGRITY OK at open: pass
- LOCKED_DECISIONS_SHA256 = 7958f41e... at open (matches C1b-11e-b): pass
- GIT_HEAD = 3a996271... at open (matches C1b-11e-b): pass
- part-11 URL HTTP 200, entry-content present, no redirect, no protected- prefix: pass
- node --check import-post.js passes: pass
- part-11 content file written with the canonical slug (NO `part-` token): pass
- census {image:9,paragraph:36,embed:7} (52 blocks) matches recon: pass
- all 7 embeds raw <iframe> verbatim with &#038; preserved; 3 captions: pass
- all *_para_leftover = 0 (img/iframe/figure/wp-caption): pass
- feed.json 15 entries (date-desc; part-11 at idx 14): pass
- no loss -> LOSS_LEDGER.md untouched: pass
- Non-regression pilot/ctn/update/part-12..22 all unchanged: pass
- test-integrity INTEGRITY OK at close: pass
- hash-state captured: pass
Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1b-11f.md
- apps/blog/PARTIAL.md
- apps/blog/tools/milestones/C1b-11g.md (this is the next milestone's file)
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/LOSS_LEDGER.md
- apps/blog/tools/ROADMAP.md
