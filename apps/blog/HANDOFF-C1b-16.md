HANDOFF — Chat C1b-16: Migrate series part-5
Status: complete
Current chat id: C1b-16
Current milestone: C1b-16
Completed milestones: C1a, C1-tool, C1-tool-p2, C1-model, C1-tool-cleanup,
C1-tool-seam-complete, C1b-01, C1b-seam-bare-p, C1b-02, C1b-03, C1b-04,
C1b-05, C1b-06, C1b-07, C1b-08, C1b-09a, C1b-09b, C1b-10, C1b-11, C1b-11a,
C1b-11b, C1b-11c, C1b-11d, C1b-11e (partial/STOP — re-scoped), C1b-11e-a,
C1b-11e-b, C1b-11f, C1b-11g, C1b-11h (partial/STOP — re-scoped), C1b-11h-a,
C1b-11h-b, C1b-11i, C1b-11j, C1b-11k (partial/STOP — re-scoped), C1b-11k-a
(partial/STOP — re-scoped), C1b-11k-a-a, C1b-11k-a-b, C1b-PLAN, C1b-12,
C1b-13 (partial/STOP — re-scoped), C1b-13a, C1b-13b, C1b-14, C1b-15, C1b-16
Next chat id: C1b-17
Context windows used: 1
Files created/modified (exact paths)
- apps/blog/content/en/a-contemporary-history-of-the-muslim-world-part-5-the-
  lebanese-civil-war-1.json (NEW; the migrated post, census
  {image:17,paragraph:29,embed:1} = 47 blocks, excerpt=false)
- apps/blog/assets/data/feed.json (MOD; 24 -> 25 entries)
- apps/blog/tools/ROADMAP.md (MOD; C1b-16 -> DONE)
- apps/blog/tools/milestones/C1b-17.md (NEW; the next migration milestone)
- apps/blog/HANDOFF-C1b-16.md (NEW; this file)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> HANDOFF-C1b-16.md)
Frozen decisions made in this chat
- None. Migration only. The seam was frozen through D-Tool-29 in C1b-13a
  (import-post.js NOT touched here).

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=af9e5595d9e1cf48e388229c544145bb7dfd02180cb1be44bbd12663ca45b1f3
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, NOT in the handoff. See tools/WORKFLOW.md step 6.
Expected delta for the next chat (C1b-17 — migrate series part-6)
- Migrate ONE slug
  (`2016/06/04/a-contemporary-history-of-the-muslim-world-part-6-the-
  lebanese-civil-war-2`) `--from html` into content/en/; census MEASURED at
  recon; reconcile raw `<img>` == rendered image blocks, raw `<iframe>` ==
  rendered embeds; all `*_para_leftover` = 0.
- part-6 carries the UNIFORM `...muslim-world-part-6-...` slug (like part-5
  and parts 7+); KEEP the live canonical slug verbatim; confirm it (HTTP
  200, no redirect, no `protected-` prefix) before writing; filename and
  `--url` must agree.
- parts 1–6 may be ABSENT from posts.json (front-truncated).
- feed.json 25 -> 26 entries (date-desc; part-6's 2016-06-04 is NEWER than
  part-5's 2016-05-19 and OLDER than part-7's 2016-06-20, so it sorts just
  BELOW part-7 idx 19, ABOVE part-5 idx 20). Verify POSITIONALLY.
- The seam is frozen through D-Tool-29. If ANOTHER new structural class
  appears, STOP and re-scope again (its own milestone).
- After C1b-17, ALL 23 series EN posts are migrated: L-014 closes here.
- Author the (REVISED) C1b-DONE.md check at close.
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
   This chat: part-5 recon used an `entry-content`-bounded body capture
   (boundary = entry-footer/sharedaddy/jp-post-flair/post-navigation); raw
   `<img>` 17 == rendered 17; raw `<iframe>` 1 == rendered 1 — no drop.
10. (carried C1b-PLAN) parts 1–6 are the RICHEST in legacy markup.
11. (carried C1b-13b) PRIOR CHAT DID NOT COMMIT: verify a handoff's
    "clean-at-close" claim by git. This chat's open WAS clean (HEAD ac15673
    = C1b-15's commit, dirty=false); the anomaly did NOT recur.
12. (NEW C1b-16, process) The `edit_existing_file`/first multi-tool attempts
    to splice the ROADMAP STATUS block failed (tool arg formatting with the
    long literal including `/*`); the successful path was a single
    `single_find_and_replace` anchored on the exact C1b-16 prose tail +
    `- C1b-17 Migrate SERIES PART 6` heading. Prefer
    `single_find_and_replace` with a tight unique anchor for such splices.
Deviations from locked decisions (must be empty, or explain)
- None. No seam decision changed; import-post.js byte-identical (untouched).
  No pre-committed idx this chat; feed.json verified POSITIONALLY.
Partial work (link to PARTIAL.md if present)
- None. C1b-16 completed its full scope.
Known issues / TODOs
- L-014 OPEN (parts 1,2,3,4,5 now migrated; of the six, only part-6
  pending); closed at C1b-17. L-001 open/by-design; L-010 deferred.
- HANDOFF-CURRENT.txt updated to HANDOFF-C1b-16.md at this close.
Assumptions the next chat may rely on
- The seam is frozen through D-Tool-29; the tree at C1b-16 close is clean
  and committed.
- part-5's slug is the UNIFORM canonical
  `a-contemporary-history-of-the-muslim-world-part-5-the-lebanese-civil-war-1`;
  title "A contemporary history of the Muslim world, part 5: The Lebanese
  civil war #1"; date 2016-05-19T09:53:36+00:00.
- Written part-5 census {image:17,paragraph:29,embed:1} (47 blocks): 17
  images = 7 `figure.wp-caption` (D-Tool-22; 7 non-empty captions) + 8 bare
  `<p><img>` (D-Tool-20) + 2 class-less bare `<div><img></div>` (D-Tool-26
  divBareImg; beirut.jpg idx 11, sarkis.jpg idx 14). 1 embed = raw
  `<iframe ...></iframe>` verbatim with `&#038;` preserved (D-Tool-21;
  youtube ID 7SWD-hcPNaw).
- 17 raw `<img>` == 17 rendered (1:1 src match, in order); raw `<iframe>`
  1 == 1; raw `figure.wp-caption` 7 == 7 captions; all `*_para_leftover` = 0.
- feed.json is now 25 entries (date-desc; part-5 idx 20, part-4 idx 21,
  part-3 idx 22, part-2 idx 23, part-1 idx 24; part-7 idx 19 above).
Test checklist result (pass/fail per item)
- git status --porcelain clean at open: pass (HEAD ac15673, tree clean)
- test-integrity INTEGRITY OK at open: pass
- LOCKED_DECISIONS_SHA256 = af9e5595… at open; pilot 36d1164a…: pass
- live slug/title/date confirmed (HTTP 200, 0 redirects, no `protected-`): pass
- import-post.js --from html wrote the content file (excerpt=false): pass
- census {image:17,paragraph:29,embed:1} (47 blocks): pass
- raw <img> 17 == rendered 17 (1:1 src, in order); raw <iframe> 1 == rendered 1; raw figure.wp-caption 7 == 7 captions: pass
- all *_para_leftover = 0: pass
- Non-regression: pilot/ctn/update/contents/part-1/part-2/part-3/part-4/part-7..22 byte-identical re-extract (24/24): pass
- generate-index.js -> 25 entries (date-desc; part-5 idx 20, POSITIONALLY verified): pass
- test-integrity INTEGRITY OK at close: pass
- hash-state captured: pass
Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1b-16.md (this file)
- apps/blog/tools/milestones/C1b-17.md (the next milestone's file)
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/LOCKED_DECISIONS.txt (see D-Tool-29)
- apps/blog/tools/LOSS_LEDGER.md (see L-014)
- apps/blog/tools/ROADMAP.md
