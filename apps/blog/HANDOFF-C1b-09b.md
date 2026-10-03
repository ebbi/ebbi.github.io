HANDOFF — Chat C1b-09b: Migrate part-17 (Algeria #2) from the live HTML
Status: complete
Current chat id: C1b-09b
Current milestone: C1b-09b
Completed milestones: C1a, C1-tool, C1-tool-p2, C1-model, C1-tool-cleanup, C1-tool-seam-complete, C1b-01, C1b-seam-bare-p, C1b-02, C1b-03, C1b-04, C1b-05, C1b-06, C1b-07, C1b-08, C1b-09a, C1b-09b
Next chat id: C1b-10
Context windows used: 1
Files created/modified (exact paths)
- apps/blog/content/en/a-contemporary-history-of-the-muslim-world-part-17-algeria-2.json (NEW; generated via --from html, no --out)
- apps/blog/assets/data/feed.json (regenerated: 8 -> 9 entries)
- apps/blog/tools/LOSS_LEDGER.md (L-004 -> resolved; resolution note added)
- apps/blog/tools/milestones/C1b-10.md (NEW; next milestone, filled Interfaces)
- apps/blog/tools/ROADMAP.md (C1b-09b -> Done; Next section -> C1b-10; cross-cutting seam fact 3 -> 5 extensions)
- apps/blog/HANDOFF-CURRENT.txt (pointer -> this file)
- apps/blog/HANDOFF-C1b-09b.md (this file)
Frozen decisions made in this chat
- None. No new D-Tool entry. The seam (through D-Tool-22) already represented
  every class part-17 contains. import-post.js was NOT touched.
- Recon confirmed the expected classes and NO third structural class.

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=a218f137091572516ff297f836fd071e52159724864eb1e098ecbd0c3662c2dc
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, NOT in the handoff. See tools/WORKFLOW.md step 6.
Expected delta for the next chat
- C1b-10: migrate part-16 (`a-contemporary-history-of-the-muslim-world-part-16-algeria-1`,
  date 2018-07-22). Plain migration (no new seam class); pre-verified recon
  {image:15,paragraph:71,embed:2} (88 blocks), *_para_leftover = 0. feed.json
  9 -> 10 entries, part-16 at idx 8 (after part-17).
Human edits made outside tooling (structured)
- None reported.
Open warnings (count + links only)
1. tools/*.md whitespace may not survive chat copy; anchor edits from `cat -A`. (carried C1b-03/04)
2. Edit splice pitfall: verify POSITIONALLY, not by substring. (carried C1b-04)
3. Stale "## The commit" line in HANDOFF-C1b-seam-bare-p.md (points at 50ffad5) — still unfixed. (carried)
4. LOSS_LEDGER.md table padding mixed (cosmetic). (carried)
5. (carried C1b-07, process) prior chat initially routed shell to the human; resolved.
6. hash-state.js FILE_TREE_SHA256 capture rule: capture AFTER staging (reflects
   the tracked set); see C1b-09a deviation note. Not an issue this chat (no new
   tracked file at open; the new content file is staged before commit).
7. A 0-byte stray file (`\001\004...p9N@8`) appeared at repo root AGAIN from a
   shell mangling this chat; removed before close (same as C1b-09a warning 7).
Deviations from locked decisions (must be empty, or explain)
- None. The migration used only frozen representations (D-Tool-21 embed,
  D-Tool-22 wp-caption image, D-Tool-19/20 bare-<p>, D-Tool-15/16 inline).
Partial work (link to PARTIAL.md if present)
- None.
Blocked reason (only if Status: blocked)
- N/A.
Known issues / TODOs
- The C1b-09b milestone text said part-17 belongs "between part-19 (2019-08-12)
  and part-18 (2018-11-02)" in the feed. In true date-desc order part-18
  (2018-11-02) precedes part-17 (2018-10-02), so part-17 sits at idx 7,
  immediately AFTER part-18 (idx 6) and BEFORE update (idx 8). The ordering
  requirement (date-desc) is satisfied; the milestone phrasing was loose.
- L-010 (generate-index buildExcerpt does not strip HTML) does NOT recur for
  part-17 (its excerpt head is prose, no raw tags). Still deferred.
- L-005 (part-15) and L-006 (part-8) remain deferred; seam READY (D-Tool-21).
Assumptions the next chat may rely on
- The D-Tool-9 seam through D-Tool-22 is frozen and unchanged by this chat.
- part-17 is verbatim faithful: census {image:13,paragraph:59,embed:4} (76
  blocks); all 4 embeds carry the raw <iframe> with &#038; preserved; 6
  wp-caption captions present; file round-trips byte-identical to recon
  (sha256 d7ada68b24d13e88150d88a6d9bf3c73daf41516db02e360d55becb8384695d3).
- pilot, controlling-the-narrative, update, part-18..22 are byte-identical to
  their pre-C1b-09b committed files (true non-regression).
- feed.json is 9 entries, date-desc.
Test checklist result (pass/fail per item)
- git status --porcelain clean at open: pass
- test-integrity INTEGRITY OK at open: pass
- Recon part-17 {image:13,paragraph:59,embed:4} (76 blocks); iframe verbatim
  (&#038; preserved); 6 wp-caption captions; all *_para_leftover = 0: pass
- Content file written, canonical keys [slug,lang,title,date,blocks]; no
  excerpt: pass
- Content census round-trip == recon (byte-identical, sha256 d7ada68b...): pass
- generate-index 9 entries, date-desc, part-17 at idx 7: pass
- Non-regression pilot 80 / ctn 34 {image:5,paragraph:24,quote:4,footnotes:1}
  quote[3] len=240 / update 2 {paragraph:2} / part-18 {image:14,paragraph:48,embed:1}
  / part-19 {image:17,paragraph:51} / part-20 {image:12,paragraph:57,embed:1} /
  part-21 {image:19,paragraph:82,embed:3} / part-22 {image:13,paragraph:55}:
  pass (all content files byte-identical to HEAD)
- test-integrity INTEGRITY OK at close: pass
- hash-state.js captured: pass
- LOSS_LEDGER.md L-004 -> resolved: pass
Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1b-09b.md
- apps/blog/tools/milestones/C1b-10.md
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/LOSS_LEDGER.md
- apps/blog/tools/ROADMAP.md
