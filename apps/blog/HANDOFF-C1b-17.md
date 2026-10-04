HANDOFF — Chat C1b-17: Migrate series part-6
Status: complete
Current chat id: C1b-17
Current milestone: C1b-17
Completed milestones: C1a, C1-tool, C1-tool-p2, C1-model, C1-tool-cleanup,
C1-tool-seam-complete, C1b-01, C1b-seam-bare-p, C1b-02, C1b-03, C1b-04,
C1b-05, C1b-06, C1b-07, C1b-08, C1b-09a, C1b-09b, C1b-10, C1b-11, C1b-11a,
C1b-11b, C1b-11c, C1b-11d, C1b-11e (partial/STOP — re-scoped), C1b-11e-a,
C1b-11e-b, C1b-11f, C1b-11g, C1b-11h (partial/STOP — re-scoped), C1b-11h-a,
C1b-11h-b, C1b-11i, C1b-11j, C1b-11k (partial/STOP — re-scoped), C1b-11k-a
(partial/STOP — re-scoped), C1b-11k-a-a, C1b-11k-a-b, C1b-PLAN, C1b-12,
C1b-13 (partial/STOP — re-scoped), C1b-13a, C1b-13b, C1b-14, C1b-15, C1b-16,
C1b-17
Next chat id: C1b-18
Context windows used: 1
Files created/modified (exact paths)
- apps/blog/content/en/a-contemporary-history-of-the-muslim-world-part-6-the-
  lebanese-civil-war-2.json (NEW; the migrated post, census
  {image:17,paragraph:35,embed:1} = 53 blocks, excerpt=false)
- apps/blog/assets/data/feed.json (MOD; 25 -> 26 entries)
- apps/blog/tools/ROADMAP.md (MOD; C1b-17 -> DONE)
- apps/blog/tools/LOSS_LEDGER.md (MOD; L-014 -> resolved + resolution note)
- apps/blog/tools/milestones/C1b-DONE.md (already present; the REVISED
  25/25 finale — NOT re-authored this chat)
- apps/blog/HANDOFF-C1b-17.md (NEW; this file)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> HANDOFF-C1b-17.md)
Frozen decisions made in this chat
- None. Migration only. The seam was frozen through D-Tool-29 in C1b-13a
  (import-post.js NOT touched here).

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=af9e5595d9e1cf48e388229c544145bb7dfd02180cb1be44bbd12663ca45b1f3
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, NOT in the handoff. See tools/WORKFLOW.md step 6.
Expected delta for the next chat (C1b-18 — series-order on the derived index
+ list view)
- Give each feed entry an integer `seriesOrder` (1..23) for the series posts,
  sourced from the `contents` post's authoritative grid (the author's own
  1..23 numbering), ascending-date as fallback/validation. The list view
  (app.js renderList) sorts/groups the series by `seriesOrder` so the reader
  sees the series in reading order (1 -> 23); non-series posts (`update`,
  `controlling-the-narrative`) keep the default date-desc ordering.
- Touches generate-index.js (derived index) + app.js (list view) ONLY — NOT
  the extraction seam and NOT import-post.js.
- The `contents` post (slug a-contemporary-history-of-the-muslim-world-
  contents) is the grid-order source; its single `table` block carries the
  inner HTML of the source `<table>` verbatim (len 29665). See
  HANDOFF-C1b-17.md's "Assumptions the next chat may rely on".
- After C1b-18, the REVISED C1b-DONE proves 25/25, then posts.json deletion
  is unblocked.
- The seam is frozen through D-Tool-29. If a new extraction class appears,
  STOP and re-scope (its own milestone).
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
   This chat: part-6 recon used an `entry-content`-bounded body capture
   (boundary = entry-footer/sharedaddy/jp-post-flair/post-navigation); raw
   `<img>` 17 == rendered 17 (1:1 src IN ORDER); raw `<iframe>` 1 ==
   rendered 1; raw `figure.wp-caption` 12 == 12 captions — no drop.
10. (carried C1b-PLAN) parts 1–6 are the RICHEST in legacy markup.
11. (carried C1b-13b) PRIOR CHAT DID NOT COMMIT: verify a handoff's
    "clean-at-close" claim by git. This chat's open WAS clean (HEAD d45fa32
    = C1b-16's commit, dirty=false); the anomaly did NOT recur.
12. (carried C1b-16, process) Prefer `single_find_and_replace` with a tight
    unique anchor for ROADMAP/handoff STATUS splices. This chat confirmed:
    the ROADMAP C1b-17 edit applied cleanly as a pure +34-line addition
    (verified via `git diff`), and the file has exactly ONE C1b-17 heading
    and ONE "Migrated part-6" STATUS block.
13. (NEW C1b-17, recon) The live post's JSON-LD `datePublished` is absent;
    the publish date came from `<meta property="article:published_time"
    content="2016-06-04T21:13:36+00:00">` and the `<time class="entry-date
    published" datetime=...>` element. Use those when JSON-LD is missing.
Deviations from locked decisions (must be empty, or explain)
- None. No seam decision changed; import-post.js byte-identical (untouched).
  No pre-committed idx this chat; feed.json verified POSITIONALLY.
Partial work (link to PARTIAL.md if present)
- None. C1b-17 completed its full scope.
Known issues / TODOs
- L-014 CLOSED at this chat (all six earliest series posts parts 1–6 now
  migrated). L-001 open/by-design; L-010 deferred. These are the ONLY
  non-resolved ledger rows.
- HANDOFF-CURRENT.txt updated to HANDOFF-C1b-17.md at this close.
- C1b-DONE.md is ALREADY the REVISED 25/25 finale (authored earlier; its
  part-6 row points to this handoff via "<from HANDOFF-C1b-17.md>"). The
  next-next chat runs it.
Assumptions the next chat may rely on
- The seam is frozen through D-Tool-29; the tree at C1b-17 close is clean
  and committed.
- part-6's slug is the UNIFORM canonical
  `a-contemporary-history-of-the-muslim-world-part-6-the-lebanese-civil-war-2`;
  title "A contemporary history of the Muslim world, part 6: The Lebanese
  civil war #2"; date 2016-06-04T21:13:36+00:00.
- Written part-6 census {image:17,paragraph:35,embed:1} (53 blocks): 17
  images = 12 `figure.wp-caption` (D-Tool-22; 12 non-empty captions) + 3
  class-less bare `<div><img></div>` (D-Tool-26 divBareImg) + 2 bare
  `<p><img>` (D-Tool-20). 1 embed = raw `<iframe ...></iframe>` verbatim
  with `&#038;` preserved (D-Tool-21; youtube ID Ih0aCHnjDko).
- 17 raw `<img>` == 17 rendered (1:1 src match, IN ORDER); raw `<iframe>`
  1 == 1; raw `figure.wp-caption` 12 == 12 captions; all `*_para_leftover` = 0.
- feed.json is now 26 entries (date-desc; part-6 idx 20, POSITIONALLY just
  BELOW part-7 idx 19 and just ABOVE part-5 idx 21; part-4 idx 22, part-3
  idx 23, part-2 idx 24, part-1 idx 25).
- content/en/ now holds 26 JSON files total; of these, 25 are EN POST files
  (23 series + 2 non-series) and 1 is the series `contents` post — all 25
  non-pilot-post files re-extract BYTE-IDENTICAL from cache.
- The `contents` post grid is the authoritative series order (1..23) for
  C1b-18.
Test checklist result (pass/fail per item)
- git status --porcelain clean at open: pass (HEAD d45fa32, tree clean)
- test-integrity INTEGRITY OK at open: pass
- LOCKED_DECISIONS_SHA256 = af9e5595… at open; pilot 36d1164a…: pass
- live slug/title/date confirmed (HTTP 200, 0 redirects, no `protected-`): pass
- import-post.js --from html wrote the content file (excerpt=false): pass
- census {image:17,paragraph:35,embed:1} (53 blocks): pass
- raw <img> 17 == rendered 17 (1:1 src, IN ORDER); raw <iframe> 1 == rendered 1; raw figure.wp-caption 12 == 12 captions: pass
- all *_para_leftover = 0: pass
- Non-regression: pilot/ctn/update/contents/part-1/part-2/part-3/part-4/part-5/part-7..22 byte-identical re-extract (25/25): pass
- generate-index.js -> 26 entries (date-desc; part-6 idx 20, POSITIONALLY verified): pass
- test-integrity INTEGRITY OK at close: pass
- hash-state captured: pass
Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1b-17.md (this file)
- apps/blog/tools/milestones/C1b-18.md (if authored; else ROADMAP's C1b-18)
- apps/blog/tools/milestones/C1b-DONE.md (the REVISED finale)
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/LOCKED_DECISIONS.txt (see D-Tool-29)
- apps/blog/tools/LOSS_LEDGER.md (see L-014, now resolved)
- apps/blog/tools/ROADMAP.md
