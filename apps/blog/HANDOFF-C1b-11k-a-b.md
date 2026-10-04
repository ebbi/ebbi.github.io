HANDOFF — Chat C1b-11k-a-b: Migrate the series contents post
Status: DONE (contents post migrated; ALL series EN posts now migrated)
Current chat id: C1b-11k-a-b
Current milestone: C1b-11k-a-b
Completed milestones: C1a, C1-tool, C1-tool-p2, C1-model, C1-tool-cleanup,
C1-tool-seam-complete, C1b-01, C1b-seam-bare-p, C1b-02, C1b-03, C1b-04,
C1b-05, C1b-06, C1b-07, C1b-08, C1b-09a, C1b-09b, C1b-10, C1b-11, C1b-11a,
C1b-11b, C1b-11c, C1b-11d, C1b-11e (partial/STOP — re-scoped), C1b-11e-a,
C1b-11e-b, C1b-11f, C1b-11g, C1b-11h (partial/STOP — re-scoped), C1b-11h-a,
C1b-11h-b, C1b-11i, C1b-11j, C1b-11k (partial/STOP — re-scoped), C1b-11k-a
(partial/STOP — re-scoped), C1b-11k-a-a, C1b-11k-a-b
Next chat id: C1b-DONE
Context windows used: 1
Files created/modified (exact paths)
- apps/blog/content/en/a-contemporary-history-of-the-muslim-world-contents.json
  (NEW; 4 blocks; canonical slug; `--from html`)
- apps/blog/assets/data/feed.json (MOD; 19 -> 20 entries, date-desc)
- apps/blog/tools/LOSS_LEDGER.md (MOD; L-013 resolution note appended)
- apps/blog/tools/ROADMAP.md (MOD; C1b-11k-a-b -> STATUS: DONE; Next updated)
- apps/blog/tools/milestones/C1b-DONE.md (NEW; the final 20/20 check milestone)
- apps/blog/HANDOFF-C1b-11k-a-b.md (NEW; this file)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> HANDOFF-C1b-11k-a-b.md)
Frozen decisions made in this chat
- None. Migration only. The seam was frozen through D-Tool-28 in C1b-11k-a-a
  (D-Tool-27 tableBare + D-Tool-28 imageBarePStrong); import-post.js was NOT
  touched. NO new structural class appeared: the measured census
  {table:1,image:1,paragraph:2} used only the already-frozen D-Tool-27
  (tableBare) and D-Tool-28 (imageBarePStrong), plus pre-existing
  paragraphBare (D-Tool-19) for the two EMPTY spacers.

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=465f8c1138b2cc195506b13926188d28b14c5a694d24fb526227630d178710a7
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, NOT in the handoff. See tools/WORKFLOW.md step 6.
Expected delta for the next chat (C1b-DONE — the final 20/20 check)

- Migrate NOTHING. Prove 20/20: re-extract EVERY committed content/en/*.json
  from the live HTML (cache-first) and confirm BYTE-IDENTICAL to the committed
  file; confirm each census equals its expected value, all `*_para_leftover`
  = 0, and raw `<img>`/`<iframe>` == rendered block count.
- feed.json: exactly 20 entries (date-desc), verified POSITIONALLY.
- LOSS_LEDGER final state: L-001 open/by-design, L-010 deferred, all others
  resolved. Then SURFACE (human-gated) the deletion of the now-inert
  assets/data/posts.json.
- Author the next milestone file (ROADMAP Next after C1b, e.g. B1).
Human edits made outside tooling (structured)
- None. Tree was clean at open (last commit b10236b, C1b-11k-a-a) and dirty
  at close (contents content file + feed.json + LOSS_LEDGER.md + ROADMAP.md +
  milestones/C1b-DONE.md + handoffs). One 0-byte stray file at repo root
  (recurring carried-warning #8) was removed before staging.
Open warnings (count + links only)

1. tools/*.md whitespace may not survive chat copy; anchor edits from `cat -A`. (carried C1b-03/04)
2. Edit splice pitfall: verify POSITIONALLY, not by substring; check the
   diffstat shows pure additions for seam edits. (carried C1b-04; re-tripped
   in C1b-11k-a-a, caught before commit)
3. Stale "## The commit" line in HANDOFF-C1b-seam-bare-p.md (points at
   50ffad5) — still unfixed. (carried)
4. LOSS_LEDGER.md table padding mixed (cosmetic). (carried)
5. (carried C1b-07, process) prior chat initially routed shell to the human; resolved.
6. hash-state.js FILE_TREE_SHA256 capture rule: capture AFTER staging; see
   C1b-09a deviation note. (carried)
7. (carried C1b-11a) milestone regex lookahead vs task-text transcription
   (missing `*` quantifiers). Frozen-form regex used.
8. (recurring) a 0-byte stray file appears at repo root; one was present this
   chat (`\001\004\346\004@p9N@8`, 0 bytes, dated Oct 4) and was removed
   before staging.
9. (carried C1b-11h) SILENT-loss metric gap: a DROPPED (not leaked) class is
   invisible to `*_para_leftover`; always reconcile the raw `<img>`/`<iframe>`
   count against the rendered block count. This milestone reconciled 24 raw
   `<img>` == 23 (inside the single `table` block) + 1 (imageBarePStrong).
Deviations from locked decisions (must be empty, or explain)
- None. NO seam change; import-post.js and LOCKED_DECISIONS.txt untouched; no
  content file written except the contents post itself; posts.json untouched;
  every previously shipped content/en/*.json byte-identical.
Partial work (link to PARTIAL.md if present)
- None. C1b-11k-a-b completed its full scope.
Known issues / TODOs
- L-006 RESOLVED (part-8, C1b-11i); L-012 RESOLVED (part-9, C1b-11h-b);
  L-013 RESOLVED here (contents post). L-001 open/by-design; L-010 deferred.
- Remaining unmigrated series EN posts after C1b-11k-a-b: NONE. ALL 20 EN
  content files exist. C1b-DONE is next; it proves 20/20, then posts.json
  deletion is unblocked.
- The contents post emits TWO EMPTY paragraph blocks from its `<p> </p>`
  spacers (pre-existing paragraphBare behaviour, NOT a new class).
Assumptions the next chat may rely on
- The seam is frozen through D-Tool-28. No further seam change is expected in
  C1b-DONE (verification only); if a new class surfaces, STOP and re-scope.
- Live slug == posts.json slug for the contents post (NO discrepancy): HTTP
  200, no redirect, no `protected-` prefix, entry-content present; title
  "A contemporary history of the Muslim world: contents"; date
  2017-01-20T13:22:50+00:00.
- Measured/verified census {table:1,image:1,paragraph:2} (4 blocks): block [1]
  `table` = inner HTML of the source `<table>` VERBATIM (12 `<tr>`, 48 `<td>`,
  colgroup preserved, outer tag dropped per D-Tool-15; len 29665); block [2]
  `image` = D-Tool-28 imageBarePStrong `afghans1.png` (data-attachment-id
  10954, src verbatim, caption ""); blocks [0],[3] = EMPTY paragraph spacers.
- 24 raw `<img>` in entry-content == 23 (inside the table block) + 1 (image
  block); raw `<iframe>` 0 == rendered embed 0; all `*_para_leftover` = 0.
- feed.json 20 entries; contents post at idx 15 (POSITIONALLY after part-11
  idx 14, before part-10 idx 16).
Test checklist result (pass/fail per item)
- git status --porcelain clean at open: pass
- test-integrity INTEGRITY OK at open: pass
- LOCKED_DECISIONS_SHA256 = 465f8c11... matches C1b-11k-a-a at open: pass
- contents URL fetchable (HTTP 200, entry-content present, no redirect, no protected- prefix): pass
- live slug/title/date confirmed; canonical slug used (filename and --url agree): pass
- contents content file written with the canonical slug: pass
- census matches measured recon {table:1,image:1,paragraph:2}: pass
- raw <img> accounted for (23 table + 1 imageBarePStrong), none leaked/dropped: pass
- all *_para_leftover = 0: pass
- table block == source <table> inner HTML verbatim; afghans1.png verbatim: pass
- feed.json 19 -> 20 entries (date-desc) verified POSITIONALLY (idx 15): pass
- Non-regression (pilot/ctn/update/part-7..22) all unchanged: pass
- test-integrity INTEGRITY OK at close: pass
- hash-state captured: pass
Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1b-11k-a-b.md
- apps/blog/tools/milestones/C1b-DONE.md (this is the next milestone's file)
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/LOSS_LEDGER.md
- apps/blog/tools/ROADMAP.md
