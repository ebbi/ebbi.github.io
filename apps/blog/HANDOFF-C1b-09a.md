HANDOFF — Chat C1b-09a: Complete the D-Tool-9 seam (embed + legacy wp-caption image) and remediate the discovered pre-existing loss
Status: complete
Current chat id: C1b-09a
Current milestone: C1b-09a
Completed milestones: C1a, C1-tool, C1-tool-p2, C1-model, C1-tool-cleanup, C1-tool-seam-complete, C1b-01, C1b-seam-bare-p, C1b-02, C1b-03, C1b-04, C1b-05, C1b-06, C1b-07, C1b-08, C1b-09a
Next chat id: C1b-09b
Context windows used: 1
Files created/modified (exact paths)

- apps/blog/tools/milestones/C1b-09a.md (NEW; the re-scope plan)
- apps/blog/tools/import-post.js (TOP: +embed, +wpCaptionFig; blockFromFragment: +2 cases)
- apps/blog/tools/LOCKED_DECISIONS.txt (NEW D-Tool-21 embed; NEW D-Tool-22 wp-caption image)
- apps/blog/tools/LOSS_LEDGER.md (NEW L-011 wp-caption, resolved; L-004..L-006 seam-ready; notes)
- apps/blog/content/en/a-contemporary-history-of-the-muslim-world-part-18-algeria-3.json (re-migrated)
- apps/blog/content/en/a-contemporary-history-of-the-muslim-world-part-19-bosnia-1.json (re-migrated)
- apps/blog/content/en/a-contemporary-history-of-the-muslim-world-part-20-kosovo-1.json (re-migrated)
- apps/blog/content/en/a-contemporary-history-of-the-muslim-world-part-21-bosnia-2.json (re-migrated)
- apps/blog/content/en/a-contemporary-history-of-the-muslim-world-part-22-kosovo-2.json (re-migrated)
- apps/blog/tools/ROADMAP.md (C1b-09a -> Done; C1b-08 census note corrected; C1b-09 -> C1b-09b in Next)
- apps/blog/HANDOFF-CURRENT.txt (pointer -> this file)
- apps/blog/HANDOFF-C1b-09a.md (this file)
  Frozen decisions made in this chat
- D-Tool-21 LEGACY JETPACK EMBED. extractHtmlBlocks() TOP gains an entry
  (after footnotes, before paragraphBare):
  /<div\b[^>]_class="[^"]_\bjetpack-video-wrapper\b[^"]_"[^>]_>[\s\S]\*?<\/div>/i
  kind "embed"; blockFromFragment() emits { type:"embed",
  content:<inner <iframe ...></iframe> verbatim, entities preserved> }.
  renderer.js already consumes type:"embed" (no renderer change).
- D-Tool-22 LEGACY figure.wp-caption CAPTION IMAGE. TOP gains an entry
  (adjacent to imageFig):
  /<figure\b[^>]_class="[^"]_\bwp-caption\b[^"]_"[^>]_>[\s\S]\*?<\/figure>/i
  kind "wpCaptionFig"; blockFromFragment() reuses the image path
  { type:"image", src:<img src verbatim>, caption:<figcaption via captionOf()> }.
  These are the FOURTH and FIFTH narrow extensions of the D-Tool-9 seam
  freeze (after D-Tool-18/19/20).
- GATE (maintainer, Option A): C1b-09 split into C1b-09a (seam completion +
  discovered-loss remediation, no new slug) and C1b-09b (migrate part-17).

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=a218f137091572516ff297f836fd071e52159724864eb1e098ecbd0c3662c2dc
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, NOT in the handoff. See tools/WORKFLOW.md step 6.
Expected delta for the next chat

- C1b-09b: migrate part-17 (`a-contemporary-history-of-the-muslim-world-part-17-algeria-2`,
  date 2018-10-02) with the seam now complete. Expected census
  {image:13, paragraph:? , embed:4}; resolve L-004; feed.json 8 -> 9 entries.
  Human edits made outside tooling (structured)
- None reported.
  Open warnings (count + links only)

1. tools/\*.md whitespace may not survive chat copy; anchor edits from `cat -A`. (carried from C1b-03/04)
2. Edit splice pitfall: verify POSITIONALLY, not by substring. (carried from C1b-04)
3. Stale "## The commit" line in HANDOFF-C1b-seam-bare-p.md (points at 50ffad5) — still unfixed. (carried)
4. LOSS_LEDGER.md table padding mixed (cosmetic). (carried)
5. (carried from C1b-07, process) prior chat initially routed shell to the human; resolved.
6. NEW: hash-state.js FILE_TREE_SHA256 is sha256 of `git ls-files apps/blog`
   (sorted); it was captured at OPEN (pre-change=86c1f37c) but the committed
   tree's value is 3f39c735. See the WORKFLOW DEVIATION above — capture it
   AFTER staging next time.
7. NEW: a 0-byte stray file (`\001\004...p9N@8`) appeared at repo root from a
   shell mangling during this chat; removed before close.
   Deviations from locked decisions (must be empty, or explain)

- The milestone's Interfaces text guessed a `wp-block-embed` wrapper; the
  live markup is the legacy Jetpack wrapper. Recon-driven adaptation
  (dump+grep before writing the regex), within the milestone's explicit
  instruction. Recorded as D-Tool-21.
- WORKFLOW DEVIATION (volatile fact, no data impact): the commit body's
  FILE_TREE_SHA256 was captured at OPEN (pre-change) = 86c1f37c..., but
  FILE_TREE_SHA256 = sha256 of `git ls-files apps/blog`, which changes when
  the two new milestone files are tracked. The committed tree's true value
  (and what hash-state.js prints post-commit) is 3f39c735.... So step 8's
  determinism check does NOT self-match for this commit. Per WORKFLOW
  ("do not rewrite history to reflow a body") the commit was NOT amended.
  Correct rule for next time: capture FILE_TREE_SHA256 AFTER staging (it
  reflects the tracked set at commit), not at open. GIT_HEAD=07aa7cc... and
  GIT_DIRTY=true in the body are correct.
  Partial work (link to PARTIAL.md if present)
- None.
  Blocked reason (only if Status: blocked)
- N/A.
  Known issues / TODOs
- The C1b-09 re-scope was forced by recon: the frozen seam silently dropped
  TWO classes, not one. The second (`figure.wp-caption`) was an unrecorded
  pre-existing loss across ALL shipped C1b slugs (now L-011, resolved).
- L-010 (generate-index buildExcerpt does not strip HTML) still deferred and
  not fixed here; feed.json was regenerated and is byte-unchanged (the
  affected posts' first block is an image/paragraph with no inline <a> at the
  excerpt head).
- part-17 itself is NOT migrated here (C1b-09b). Its live body has 13 imgs
  (7 bare-<p> + 6 wp-caption) and 4 Jetpack embeds.
- C1b-09.md is SUPERSEDED by C1b-09a.md + C1b-09b; kept on disk for the record.
  Assumptions the next chat may rely on
- The D-Tool-9 seam through D-Tool-22 is frozen. D-Tool-21 (embed) and
  D-Tool-22 (wp-caption image) are consumed by part-17's migration (C1b-09b).
- The five re-migrated slugs are verbatim faithful: image/embed counts equal
  the live `entry-content` bodies; each file round-trips byte-identical to recon.
- pilot, controlling-the-narrative, update are byte-identical to their
  pre-C1b-09a committed files (true non-regression).
- feed.json is unchanged (8 entries).
  Test checklist result (pass/fail per item)
- git status clean at open: pass
- test-integrity INTEGRITY OK at open: pass
- node --check import-post.js: pass
- Non-regression pilot 80 / ctn 34 {image:5,paragraph:24,quote:4,footnotes:1}
  quote[3] len=240 / update 2 {paragraph:2}: byte-identical — pass
- part-18 re-migrated {image:14,paragraph:48,embed:1} (63), live body imgs=14
  embeds=1: pass
- part-19 re-migrated {image:17,paragraph:51} (68), live body imgs=17 embeds=0: pass
- part-20 re-migrated {image:12,paragraph:57,embed:1} (70), live body imgs=12
  embeds=1: pass
- part-21 re-migrated {image:19,paragraph:82,embed:3} (104), live body imgs=19
  embeds=3: pass
- part-22 re-migrated {image:13,paragraph:55} (68), live body imgs=13 embeds=0: pass
- Each content file round-trips byte-identical to recon: pass
- img_para_leftover / iframe_para_leftover / wp-caption_para_leftover = 0 (all 5): pass
- generate-index 8 entries, date-desc: pass
- test-integrity INTEGRITY OK at close: pass
- hash-state.js captured: pass
- LOSS_LEDGER.md L-011 added + resolved; L-004..L-006 seam-ready: pass
  Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1b-09a.md
- apps/blog/tools/milestones/C1b-09b.md
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/LOSS_LEDGER.md
- apps/blog/tools/ROADMAP.md
