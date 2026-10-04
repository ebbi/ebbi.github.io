HANDOFF — Chat C1b-13b: Migrate series part-2
Status: complete
Current chat id: C1b-13b
Current milestone: C1b-13b
Completed milestones: C1a, C1-tool, C1-tool-p2, C1-model, C1-tool-cleanup,
C1-tool-seam-complete, C1b-01, C1b-seam-bare-p, C1b-02, C1b-03, C1b-04,
C1b-05, C1b-06, C1b-07, C1b-08, C1b-09a, C1b-09b, C1b-10, C1b-11, C1b-11a,
C1b-11b, C1b-11c, C1b-11d, C1b-11e (partial/STOP — re-scoped), C1b-11e-a,
C1b-11e-b, C1b-11f, C1b-11g, C1b-11h (partial/STOP — re-scoped), C1b-11h-a,
C1b-11h-b, C1b-11i, C1b-11j, C1b-11k (partial/STOP — re-scoped), C1b-11k-a
(partial/STOP — re-scoped), C1b-11k-a-a, C1b-11k-a-b, C1b-PLAN, C1b-12,
C1b-13 (partial/STOP — re-scoped), C1b-13a, C1b-13b
Next chat id: C1b-14
Context windows used: 1
Files created/modified (exact paths)
- apps/blog/content/en/what-we-have-forgotten-and-they-havent-a-history-of-
  political-islam-and-the-west-part-2.json (NEW; the migrated post, census
  {image:21,paragraph:53,embed:2} = 76 blocks, excerpt=false)
- apps/blog/assets/data/feed.json (MOD; 21 -> 22 entries)
- apps/blog/tools/ROADMAP.md (MOD; C1b-13b -> DONE; C1b-13 -> DONE; Next updated)
- apps/blog/tools/milestones/C1b-14.md (NEW; the next migration milestone)
- apps/blog/HANDOFF-C1b-13b.md (NEW; this file)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> HANDOFF-C1b-13b.md)
- ANOMALY (see deviations): the PRIOR chat C1b-13a's deliverables were
  UNCOMMITTED at open; committed by THIS chat as `zabon/blog: C1b-13a …`
  (HEAD before C1b-13b work: 5df1048) to establish a clean tree before
  starting. Files: apps/blog/tools/import-post.js,
  apps/blog/tools/LOCKED_DECISIONS.txt,
  apps/blog/tools/milestones/C1b-13a.md,
  apps/blog/tools/milestones/C1b-13b.md,
  apps/blog/HANDOFF-C1b-13a.md, apps/blog/HANDOFF-CURRENT.txt,
  apps/blog/tools/ROADMAP.md.
Frozen decisions made in this chat
- None. Migration only. The seam was frozen through D-Tool-29 in C1b-13a
  (import-post.js NOT touched here).

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=af9e5595d9e1cf48e388229c544145bb7dfd02180cb1be44bbd12663ca45b1f3
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, NOT in the handoff. See tools/WORKFLOW.md step 6.
Expected delta for the next chat (C1b-14 — migrate series part-3)
- Migrate ONE slug
  (`2016/02/21/a-history-of-political-islam-and-the-west-part-3-iran-
  revolution-1`) `--from html` into content/en/; census MEASURED at recon;
  reconcile raw `<img>` == rendered image blocks, raw `<iframe>` ==
  rendered embeds; all `*_para_leftover` = 0.
- LEGACY NON-UNIFORM slug (`a-history-of-political-islam-...`); KEEP the
  live canonical slug verbatim; confirm it (HTTP 200, no redirect, no
  `protected-` prefix) before writing; filename and `--url` must agree.
  parts 1–6 may be ABSENT from posts.json (front-truncated).
- feed.json 22 -> 23 entries (date-desc; part-3's 2016-02-21 is NEWER than
  part-2/part-1 but OLDER than part-7 2016-06-20, so it sorts near the END,
  just above part-2).
- The seam is frozen through D-Tool-29. If ANOTHER new structural class
  appears, STOP and re-scope again (its own milestone).
- L-014 stays OPEN here (it tracks all six; closed at C1b-17).
- Author C1b-15.md (series part-4) at close.
Human edits made outside tooling (structured)
- None.
Open warnings (count + links only)

1. tools/*.md whitespace may not survive chat copy; anchor edits from `cat -A`. (carried C1b-03/04)
2. Edit splice pitfall: verify POSITIONALLY, not by substring. (carried C1b-04)
3. Stale "## The commit" line in HANDOFF-C1b-seam-bare-p.md (points at
   50ffad5) — still unfixed. (carried)
4. LOSS_LEDGER.md table padding mixed (cosmetic). (carried)
5. (carried C1b-07, process) prior chat initially routed shell to the human; resolved.
6. hash-state.js FILE_TREE_SHA256 capture rule: capture AFTER staging; see
   C1b-09a deviation note. (carried)
7. (carried C1b-11a) milestone regex lookahead vs task-text transcription.
8. (recurring) 0-byte stray file at repo root — none present this chat.
9. (carried C1b-11h) SILENT-loss metric gap: a DROPPED class is invisible
   to `*_para_leftover`; always reconcile raw `<img>`/`<iframe>` counts.
10. (carried C1b-PLAN) parts 1–6 are the RICHEST in legacy markup.
11. (NEW) PRIOR CHAT DID NOT COMMIT: C1b-13a closed (handoff claims
    clean-at-close) but its deliverables were UNCOMMITTED; this chat
    committed them (HEAD 5df1048) before starting. Watch for this class:
    a handoff's "git status clean at close" claim must be verified by git.
Deviations from locked decisions (must be empty, or explain)
- The ANOMALY above: C1b-13a's deliverables were uncommitted at this
  chat's open, so the pre-flight "clean tree" check FAILED on first run.
  Resolution: verified the C1b-13a changes ARE the legitimate, documented
  seam extension (import-post.js diff = +57/-0 PURE additions; D-Tool-29
  appended correctly; node --check clean), committed them as the C1b-13a
  milestone commit, THEN re-ran pre-flight (INTEGRITY OK, tree clean).
  No seam decision was changed; D-Tool-29 is byte-identical to the
  C1b-13a spec. Recorded here per "Human edits / deviations are
  first-class".
- POSITIONAL slip (not a content defect): the milestone/task text said
  part-2 lands at "idx 21" and part-1 at "idx 20". date-desc correctly
  places part-2 SECOND-TO-LAST at idx 20 and part-1 LAST at idx 21
  (verified POSITIONALLY). The task idx values were date-arithmetically
  swapped; the same slip class noted at C1b-11f/11g.
Partial work (link to PARTIAL.md if present)
- None. C1b-13b completed its full scope.
Known issues / TODOs
- L-014 OPEN (parts 2–6 remain; part-2 now migrated); closed at C1b-17.
  L-001 open/by-design; L-010 deferred (part-2's feed excerpt leads with
  `<strong>2</strong>` — the known excerpt-rendering behaviour, NOT a loss).
- HANDOFF-CURRENT.txt updated to HANDOFF-C1b-13b.md at this close.
Assumptions the next chat may rely on
- The seam is frozen through D-Tool-29; the tree at C1b-13b close is clean
  and committed.
- part-2's slug is LEGACY NON-UNIFORM and canonical; title "A contemporary
  history of the Muslim world, part 2"; date 2015-12-13T17:56:44+00:00.
- Written part-2 census {image:21,paragraph:53,embed:2} (76 blocks): 21
  images = 3 figure.wp-caption (D-Tool-22, 3 captions) + bare `<p><img>`
  variants (D-Tool-20/23/28/24) + 1 recovered `imageBarePProse`
  (assad21.jpg, idx 49, prose paragraph at idx 48); 2 embeds both raw
  `<iframe>` verbatim with `&#038;` preserved (D-Tool-21).
- 21 raw `<img>` == 21 rendered; raw `<iframe>` 2 == 2; raw
  `figure.wp-caption` 3 == 3; all `*_para_leftover` = 0.
- feed.json is now 22 entries (date-desc; part-2 at idx 20, part-1 idx 21).
Test checklist result (pass/fail per item)
- git status --porcelain clean at open: FAIL then RESOLVED (C1b-13a uncommitted; committed by this chat -> clean)
- test-integrity INTEGRITY OK at open: pass
- LOCKED_DECISIONS_SHA256 = af9e5595… at open; pilot 36d1164a…: pass
- live slug/title/date confirmed (HTTP 200, no redirect, no `protected-`): pass
- import-post.js --from html wrote the content file (excerpt=false): pass
- census {image:21,paragraph:53,embed:2} (76 blocks): pass
- raw <img> 21 == rendered 21; raw <iframe> 2 == rendered 2; raw figure.wp-caption 3 == 3 captions: pass
- all *_para_leftover = 0; embeds raw <iframe> verbatim with &#038;: pass
- Non-regression: pilot/ctn/update/contents/part-1/part-7..22 byte-identical re-extract (21/21): pass
- generate-index.js -> 22 entries (date-desc; part-2 idx 20, part-1 idx 21): pass
- test-integrity INTEGRITY OK at close: pass
- hash-state captured: pass
Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1b-13b.md (this file)
- apps/blog/tools/milestones/C1b-14.md (the next milestone's file)
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/LOCKED_DECISIONS.txt (see D-Tool-29)
- apps/blog/tools/LOSS_LEDGER.md (see L-014)
- apps/blog/tools/ROADMAP.md
