HANDOFF — Chat C1b-DONE: Prove 25/25 EN posts migrated (final C1b check)
Status: complete
Current chat id: C1b-DONE
Current milestone: C1b-DONE
Completed milestones: C1a, C1-tool, C1-tool-p2, C1-model, C1-tool-cleanup,
C1-tool-seam-complete, C1b-01, C1b-seam-bare-p, C1b-02, C1b-03, C1b-04,
C1b-05, C1b-06, C1b-07, C1b-08, C1b-09a, C1b-09b, C1b-10, C1b-11, C1b-11a,
C1b-11b, C1b-11c, C1b-11d, C1b-11e (partial/STOP — re-scoped), C1b-11e-a,
C1b-11e-b, C1b-11f, C1b-11g, C1b-11h (partial/STOP — re-scoped), C1b-11h-a,
C1b-11h-b, C1b-11i, C1b-11j, C1b-11k (partial/STOP — re-scoped), C1b-11k-a
(partial/STOP — re-scoped), C1b-11k-a-a, C1b-11k-a-b, C1b-PLAN, C1b-12,
C1b-13 (partial/STOP — re-scoped), C1b-13a, C1b-13b, C1b-14, C1b-15, C1b-16,
C1b-17, C1b-18, C1b-DONE
Next chat id: B1
Context windows used: 1
Files created/modified (exact paths)
- apps/blog/HANDOFF-C1b-DONE.md (NEW; this file)
- apps/blog/tools/ROADMAP.md (MOD; C1b-DONE -> Done; C1b complete; Next
  advances to B1)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> HANDOFF-C1b-DONE.md)
- apps/blog/tools/LOSS_LEDGER.md (MOD; L-001 final closure note — resolved
  by design; L-010 deferral reaffirmed; "20/20" prose corrected to 25/25)
Frozen decisions made in this chat
- None. This is a VERIFICATION-ONLY milestone. import-post.js byte-identical
  (untouched); the seam stays frozen through D-Tool-29.
Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=af9e5595d9e1cf48e388229c544145bb7dfd02180cb1be44bbd12663ca45b1f3
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, NOT in the handoff. See tools/WORKFLOW.md step 6.

Fidelity census proof (26/26 files; read-only harness)
- Reconstructed each canonical URL from the committed slug+date
  (https://twolegsbadblog.wordpress.com/YYYY/MM/DD/<slug>/); ALL 26 URLs hit
  the import-post cache (cache-first, no fetch). Re-extracted via
  import-post.extractHtmlBlocks and compared to writeAtomic bytes
  (JSON.stringify(obj,null,2)+"\n"): 26/26 BYTE-IDENTICAL.
- Census == the milestone's per-post expected table for every file; every
  `*_para_leftover` = 0 (img/iframe/figure/wp-caption/jetpack); raw
  <img>/<iframe> EQUALS the rendered block count for every file (the
  contents post: 24 raw <img> = 23 inside the single `table` block + 1
  image block; every other file: 1:1).

Per-post censuses proven (25 EN posts; the `contents` index is the 26th file)
- part-1 {image:11,paragraph:50} (61)
- part-2 {image:21,paragraph:53,embed:2} (76)
- part-3 {image:11,paragraph:44,embed:2} (57)
- part-4 {image:12,paragraph:43} (55)
- part-5 {image:17,paragraph:29,embed:1} (47)
- part-6 {image:17,paragraph:35,embed:1} (53)
- part-7 {image:11,paragraph:32,embed:3} (46)
- part-8 {paragraph:40,image:14,embed:3} (57)
- part-9 {image:14,paragraph:28,embed:1} (43)
- part-10 {image:18,paragraph:40,embed:1} (59)
- part-11 {image:9,paragraph:36,embed:7} (52)
- part-12 {image:12,paragraph:43,embed:2} (57)
- part-13 {image:13,paragraph:37,embed:2} (52)
- part-14 {image:9,paragraph:23} (32)
- part-15 {image:13,paragraph:67,embed:1} (81)
- part-16 {image:15,paragraph:71,embed:2} (88)
- part-17 {image:13,paragraph:59,embed:4} (76)
- part-18 {image:14,paragraph:48,embed:1} (63)
- part-19 {image:17,paragraph:51} (68)
- part-20 {image:12,paragraph:57,embed:1} (70)
- part-21 {image:19,paragraph:82,embed:3} (104)
- part-22 {image:13,paragraph:55} (68)
- jews-in-palestine-before-israel {image:15,paragraph:62,quote:2,table:1} (80)
- controlling-the-narrative {image:5,paragraph:24,quote:4,footnotes:1} (34)
- update {paragraph:2} (2)
- contents index {table:1,image:1,paragraph:2} (4)

feed.json / list view proof
- Regenerated with generate-index.js: IDEMPOTENT (sha256 unchanged
  85f19c755fb091cb4d46f5fee99fb178c8ff462ab643adb90f47ca9072e66fc1; no
  git diff). 26 entries; strictly date-desc.
- 23 series entries carry unique integer seriesOrder 1..23; 3 non-series
  (update, controlling-the-narrative, contents index) carry null.
- Ascending-date rank == seriesOrder 23/23 (fallback/validation match).
- app.js renderList emits the series FIRST in reading order 1 -> 23, then
  the non-series in the feed's date-desc order (same markup/classes).
- NOTE (documented factual, not a deviation): the milestone prose says
  "feed.json has 25 entries"; the true count is 26 = 25 EN posts + the
  series `contents` INDEX post. The index post is a content file but is NOT
  one of the 23 series (it carries seriesOrder null). The C1b-18 handoff
  already reconciled this same off-by-one; recorded here so the next chat
  does not mistake 26 for a bug.

LOSS_LEDGER final state (confirmed)
- Non-resolved rows: L-001 (open; content-source, resolved BY DESIGN because
  C1b migrates from the live HTML, not posts.json) and L-010 (deferred;
  feed-excerpt HTML leak, a generate-index/list-view concern; NOT a C1b seam
  issue). L-002..L-009, L-011, L-012, L-013, L-014 = resolved.
- L-001 closure note recorded (final fidelity check passes; the live HTML is
  the oracle and the migration source; posts.json is inert). L-010 deferral
  reaffirmed. Correction of the stale "posts.json retained until 20/20"
  prose to 25/25.

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
   Exercised this chat: the harness reconciles raw counts for all 26 files.
10. (carried C1b-PLAN) parts 1–6 are the RICHEST in legacy markup.
11. (carried C1b-13b) PRIOR CHAT DID NOT COMMIT: verify a handoff's
    "clean-at-close" claim by git. This chat's open WAS clean (HEAD 8ccd1de
    = C1b-18's commit, dirty=false); the anomaly did NOT recur.
12. (carried C1b-16, process) Prefer `single_find_and_replace` with a tight
    unique anchor for ROADMAP/handoff STATUS splices. This chat: the ROADMAP
    C1b-DONE STATUS edit applied cleanly (verified via git diff); the file
    has exactly ONE C1b-DONE heading.
13. (carried C1b-17) When JSON-LD datePublished is absent, use <meta
    property="article:published_time"> / <time class="entry-date published">.
    Not exercised this chat (no fetch; all-cache verification).
14. (process) A path written as `/tmp/...` resolves under the workspace root
    as `<repo>/tmp/...`. The first harness write landed at `<repo>/tmp/`;
    it was moved OUT of the repo and the stray dir removed before any write
    to a milestone file. No stray file remains (git status clean).
Deviations from locked decisions (must be empty, or explain)
- None. No seam decision changed; import-post.js byte-identical (untouched).
  No generation ran against posts.json; feed.json verified POSITIONALLY.
  The "25 vs 26" wording is a documented factual note (above), not a
  deviation from any locked decision.
Partial work (link to PARTIAL.md if present)
- None. PARTIAL.md shows NO ACTIVE PARTIAL WORK (its C1b-11k-a STOP section
  is marked RESOLVED). C1b-DONE completed its full verification scope.
Known issues / TODOs
- posts.json deletion is UNBLOCKED (25/25 proven) and human-gated; the exact
  command is surfaced below. It was NOT executed here.
- L-010 (feed-excerpt HTML leak for part-22) remains deferred to a
  generate-index/list-view milestone; NOT a C1b seam issue.
- The `contents` index post is NON-SERIES (seriesOrder null); NOT one of the
  23 series.
Assumptions the next chat may rely on
- C1b is COMPLETE: 25/25 EN content files migrated and proven byte-faithful
  from the live HTML; the seam is frozen through D-Tool-29.
- All 26 committed content/en/*.json re-extract BYTE-IDENTICAL from cache.
- feed.json is 26 entries: 23 series (seriesOrder 1..23) + 3 non-series
  (null); the list view reads the series in reading order 1 -> 23.
- LOSS_LEDGER: only L-001 (open/by-design) and L-010 (deferred) are
  non-resolved.
- The tree at C1b-DONE close is clean and committed.
Test checklist result (pass/fail per item)
- git status --porcelain clean at open (HEAD 8ccd1de): pass
- test-integrity INTEGRITY OK at open: pass
- LOCKED_DECISIONS_SHA256 = af9e5595… at open; pilot 36d1164a…: pass
- all 26 content/en/*.json present (25 EN posts = 23 series + 2 non-series;
  + the series `contents` index): pass
- every committed content file re-extracts BYTE-IDENTICAL from the live HTML
  (26/26; cache-first): pass
- every census == expected; all `*_para_leftover` = 0; raw <img>/<iframe> ==
  rendered block count: pass
- feed.json exactly 26 entries (date-desc) verified POSITIONALLY: pass
- series seriesOrder correct (1..23); list view reads 1 -> 23: pass
- LOSS_LEDGER final state (L-001 open/by-design, L-010 deferred, L-014
  resolved, rest resolved): pass
- test-integrity INTEGRITY OK at close: pass
- hash-state.js captured: pass
- posts.json deletion UNBLOCKED and the exact command surfaced: pass
Human-gated action (NOT executed here)
- Command (run from the workspace root):
    git rm apps/blog/assets/data/posts.json
    git commit -m "zabon/blog: remove inert untrusted posts.json (C1b-DONE 25/25 proven)"
  Rationale: posts.json is UNTRUSTED (front-truncated) and INERT since
  C1a-D3; feed.json/app.js read content/ and feed.json, not posts.json. The
  deletion was gated on proving 25/25 (this milestone), which now passes.
  The human may execute it here or in a follow-up chat; do NOT delete silently.
Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1b-DONE.md (this file)
- apps/blog/PARTIAL.md
- apps/blog/tools/milestones/B1.md (the next milestone; AUTHOR IT at the
  close of C1b-DONE per WORKFLOW step 7 — it did NOT exist when this
  handoff was written)
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/LOCKED_DECISIONS.txt (see D-Tool-29)
- apps/blog/tools/LOSS_LEDGER.md (L-001 open/by-design, L-010 deferred, L-014 resolved)
- apps/blog/tools/ROADMAP.md
