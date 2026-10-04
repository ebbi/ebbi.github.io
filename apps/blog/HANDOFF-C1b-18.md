HANDOFF — Chat C1b-18: Add series-order to the derived index + list view
Status: complete
Current chat id: C1b-18
Current milestone: C1b-18
Completed milestones: C1a, C1-tool, C1-tool-p2, C1-model, C1-tool-cleanup,
C1-tool-seam-complete, C1b-01, C1b-seam-bare-p, C1b-02, C1b-03, C1b-04,
C1b-05, C1b-06, C1b-07, C1b-08, C1b-09a, C1b-09b, C1b-10, C1b-11, C1b-11a,
C1b-11b, C1b-11c, C1b-11d, C1b-11e (partial/STOP — re-scoped), C1b-11e-a,
C1b-11e-b, C1b-11f, C1b-11g, C1b-11h (partial/STOP — re-scoped), C1b-11h-a,
C1b-11h-b, C1b-11i, C1b-11j, C1b-11k (partial/STOP — re-scoped), C1b-11k-a
(partial/STOP — re-scoped), C1b-11k-a-a, C1b-11k-a-b, C1b-PLAN, C1b-12,
C1b-13 (partial/STOP — re-scoped), C1b-13a, C1b-13b, C1b-14, C1b-15, C1b-16,
C1b-17, C1b-18
Next chat id: C1b-DONE
Context windows used: 1
Files created/modified (exact paths)
- apps/blog/tools/generate-index.js (MOD; +buildSeriesOrderMap; emits
  integer seriesOrder per EN series entry, else null; date-desc sort kept)
- apps/blog/assets/js/app.js (MOD; renderList partitions series vs
  non-series; series emitted first in reading order 1 -> 23, non-series
  after in date-desc; same markup/classes)
- apps/blog/assets/data/feed.json (MOD; regenerated, 26 entries; 23 series
  carry seriesOrder 1..23, 3 non-series null)
- apps/blog/tools/ROADMAP.md (MOD; C1b-18 -> STATUS: DONE)
- apps/blog/HANDOFF-C1b-18.md (NEW; this file)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> HANDOFF-C1b-18.md)
Frozen decisions made in this chat
- None. This is NOT a seam milestone. import-post.js byte-identical
  (untouched); the seam stays frozen through D-Tool-29.
Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=af9e5595d9e1cf48e388229c544145bb7dfd02180cb1be44bbd12663ca45b1f3
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, NOT in the handoff. See tools/WORKFLOW.md step 6.
Expected delta for the next chat (C1b-DONE — REVISED finale)
- VERIFICATION-ONLY. Re-extract EVERY committed content/en/*.json (24 EN
  posts + the `contents` index post = 25 files; note content/en/ holds 26
  files total, one of which is the pilot, all 26 include `contents`) from the
  live HTML (cache-first, `--from html`) and confirm BYTE-IDENTICAL (25/25
  posts; 26/26 files incl the contents index). Confirm each census + all
  `*_para_leftover` = 0 + raw <img>/<iframe> == rendered counts.
- Regenerate feed.json; confirm 26 entries, verified POSITIONALLY; confirm
  every series entry carries the correct integer seriesOrder (1..23) and the
  list view reads the series in reading order.
- Confirm LOSS_LEDGER final state: L-001 open/by-design and L-010 deferred are
  the only non-resolved rows; L-014 resolved.
- test-integrity INTEGRITY OK; hash-state captured; then the human-gated
  (NOT silent) deletion of apps/blog/assets/data/posts.json is UNBLOCKED.
- C1b-DONE.md already exists (authored earlier; REVISED 25/25 finale). No new
  milestone file was authored this chat (WORKFLOW step 7: the next milestone
  is C1b-DONE, which is already present).
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
   This chat: no extraction ran on new content (verification re-extraction);
   all 26 files byte-identical, so the gap is not exercised.
10. (carried C1b-PLAN) parts 1–6 are the RICHEST in legacy markup.
11. (carried C1b-13b) PRIOR CHAT DID NOT COMMIT: verify a handoff's
    "clean-at-close" claim by git. This chat's open WAS clean (HEAD a818de8
    = C1b-17's commit, dirty=false); the anomaly did NOT recur.
12. (carried C1b-16, process) Prefer `single_find_and_replace` with a tight
    unique anchor for ROADMAP/handoff STATUS splices. This chat confirmed:
    the ROADMAP C1b-18 STATUS edit applied cleanly as a pure addition
    (verified via `git diff`); the file has exactly ONE C1b-18 heading.
13. (carried C1b-17) When JSON-LD datePublished is absent, use <meta
    property="article:published_time"> / <time class="entry-date published">.
    Not exercised this chat (no fetch).
Deviations from locked decisions (must be empty, or explain)
- None. No seam decision changed; import-post.js byte-identical (untouched).
  No generation ran against posts.json; feed.json verified POSITIONALLY.
Partial work (link to PARTIAL.md if present)
- None. C1b-18 completed its full scope.
Known issues / TODOs
- The `contents` index post is NON-SERIES (carries seriesOrder null); the
  author's grid numbers the 23 series posts, NOT the contents post itself.
- Non-series entries (`update`, `controlling-the-narrative`, `contents`)
  keep the feed's date-desc order and are emitted AFTER the series.
- C1b-DONE.md is ALREADY the REVISED 25/25 finale. The next chat runs it and
  then surfaces the human-gated posts.json deletion command.
Assumptions the next chat may rely on
- The seam is frozen through D-Tool-29; the tree at C1b-18 close is clean
  and committed.
- The series grid order (from the `contents` post's `table` block) is
  1..23 and EQUALS the ascending-date rank 23/23 (fallback/validation).
- feed.json is 26 entries: 23 series (seriesOrder 1..23) + 3 non-series
  (`update`, `controlling-the-narrative`, `contents` index) with null.
- app.js renderList reads the series in reading order 1 -> 23; non-series
  stay date-desc. Same markup/classes as 08.
- content/en/ now holds 26 JSON files: 25 EN posts (23 series + 2
  non-series) + 1 series `contents` index post; all re-extract
  BYTE-IDENTICAL from cache.
Test checklist result (pass/fail per item)
- git status --porcelain clean at open (HEAD a818de8): pass
- test-integrity INTEGRITY OK at open: pass
- LOCKED_DECISIONS_SHA256 = af9e5595… at open; pilot 36d1164a…: pass
- C1b-grid -> slug mapping resolves all 23 series slugs 1..23; ascending-date
  rank == grid order 23/23: pass
- generate-index.js (+buildSeriesOrderMap) node --check: pass
- feed.json regenerated: 26 entries; 23 series seriesOrder 1..23; 3 null: pass
- feed.json verified POSITIONALLY (series ascending 1..23; non-series
  date-desc preserved): pass
- app.js node --check; renderList emits series reading order 1 -> 23 then
  non-series date-desc (simulated on feed.json): pass
- Non-regression: all 26 committed content/en/*.json re-extract
  BYTE-IDENTICAL from cache (26/26): pass
- Scope fence: only generate-index.js/app.js/feed.json modified (+ROADMAP/
  handoff/pointer): pass (git status confirmed; no seam/content touched)
- test-integrity INTEGRITY OK at close: pass
- hash-state captured (after staging): pass
Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1b-18.md (this file)
- apps/blog/PARTIAL.md
- apps/blog/tools/milestones/C1b-DONE.md (the REVISED finale)
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/LOCKED_DECISIONS.txt (see D-Tool-29)
- apps/blog/tools/LOSS_LEDGER.md (L-014 resolved; L-001 open/by-design, L-010 deferred)
- apps/blog/tools/ROADMAP.md
