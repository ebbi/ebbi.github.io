HANDOFF — Chat C1b-PLAN: Replan the series migration after L-014 (the missed parts 1–6)
Status: DONE (planning-only; no content migrated; C1b-12..18 + revised C1b-DONE registered)
Current chat id: C1b-PLAN
Current milestone: (planning/replan — no milestone file of its own)
Completed milestones: ... C1b-11k-a-b, C1b-PLAN
Next chat id: C1b-12
Context windows used: 1
Files created/modified (exact paths)
- apps/blog/tools/LOSS_LEDGER.md (MOD; new row L-014 + discovery note)
- apps/blog/tools/ROADMAP.md (MOD; corrected C1b-11k-a-b Done claim;
  added C1b-12..C1b-17 migrations, C1b-18 series-order; rewrote Next)
- apps/blog/tools/milestones/C1b-DONE.md (MOD; revised 20/20 -> 25/25)
- apps/blog/tools/milestones/C1b-12.md (NEW; the next migration milestone)
- apps/blog/HANDOFF-C1b-PLAN.md (NEW; this file)

WHY THIS CHAT EXISTS (trigger)
- HUMAN review of the list view after C1b-11k-a-b reported "missing blogs and
  the order is not correct". Investigation (read-only) confirmed BOTH:
  (1) the six EARLIEST series posts (parts 1–6) were never migrated, and
  (2) feed.json is sorted date-DESC, the reverse of series reading order.

ROOT CAUSE (L-014)
- The C1b migration chain began at part-7 (C1b-08, 2016-06-20) and walked
  FORWARD; the six earlier posts (parts 1–6, 2015-11-27 .. 2016-06-04) were
  never assigned a milestone. The series `contents` post's own grid is the
  AUTHORITATIVE numbering 1..23 (matches the human's list); the live blog
  index confirms the same set. This is a SCOPING/planning loss, NOT an
  extraction loss: no seam class is involved, and NO shipped content file is
  affected (the 20 present files remain faithful).

CORRECTED TOTALS
- Series: 23 posts = parts 1–22 + "Jews in Palestine before Israel" (#23).
- Non-series EN: `update`, `controlling-the-narrative`.
- FINAL total = 25 EN content files (NOT 20). feed.json target = 25 entries.

AUTHORITATIVE SERIES GRID (from the `contents` post; canonical live slugs;
all verified HTTP 200, no redirect, no `protected-` prefix)
- 1  what-we-have-forgotten-and-they-havent-a-history-of-political-islam-and-the-west (2015-11-27) [MISSING]
- 2  what-we-have-forgotten-and-they-havent-a-history-of-political-islam-and-the-west-part-2 (2015-12-13) [MISSING]
- 3  a-history-of-political-islam-and-the-west-part-3-iran-revolution-1 (2016-02-21) [MISSING]
- 4  a-history-of-political-islam-and-the-west-part-4-iran-revolution-2 (2016-03-26) [MISSING]
- 5  a-contemporary-history-of-the-muslim-world-part-5-the-lebanese-civil-war-1 (2016-05-19) [MISSING]
- 6  a-contemporary-history-of-the-muslim-world-part-6-the-lebanese-civil-war-2 (2016-06-04) [MISSING]
- 7..22 (present; migrated C1b-11j..C1b-04)
- 23 jews-in-palestine-before-israel (2024-04-03) [present; the former "pilot"]
- (index) a-contemporary-history-of-the-muslim-world-contents [present; NOT numbered]

DECISIONS MADE THIS CHAT (human "use your recommendations")
- ONE POST PER CHAT for parts 1–6 (C1b-12..C1b-17). Rationale: real context
  drift risk — C1b-11e, C1b-11h, C1b-11k EACH STOPPED on a new class, and the
  earliest posts are the RICHEST in legacy markup (most likely to surface a
  new class).
- KEEP the live canonical slugs for parts 1–4 (legacy NON-UNIFORM slugs; NOT
  the `...muslim-world-part-N-...` pattern). Faithful; no 404s; consistent
  with part-13's `protected-` prefix and part-15's LONG slug.
- SERIES ORDER = the contents grid order (author's 1..23), with ascending
  date as fallback/validation. Implemented as an integer `seriesOrder` field
  added to the derived index + list view in C1b-18 (NOT the extraction seam).
- C1b-18 (series-order) sits AFTER the migrations and BEFORE the revised
  C1b-DONE.

NO SEAM CHANGE
- import-post.js and LOCKED_DECISIONS.txt were NOT touched this chat. The
  seam remains frozen through D-Tool-28 (C1b-11k-a-a). If any of parts 1–6
  surfaces a new class, that is its OWN milestone (STOP and re-scope).

Frozen decisions made in this chat
- None. Planning/ledger/roadmap only.

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=465f8c1138b2cc195506b13926188d28b14c5a694d24fb526227630d178710a7
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, NOT in the handoff. See tools/WORKFLOW.md step 6.
Expected delta for the next chat (C1b-12 — migrate series part-1)
- Migrate ONE slug (`what-we-have-forgotten-...-political-islam-and-the-west`)
  `--from html` into content/en/; census MEASURED at recon (NOT pre-committed);
  reconcile raw <img>/<iframe> vs rendered blocks; all *_para_leftover = 0.
- feed.json 20 -> 21 entries (date-desc; part-1 sorts LAST — oldest date).
- If a NEW structural class appears, STOP and re-scope (its own milestone).
- L-014 stays OPEN here (it tracks all six; closed at C1b-17).
- Author C1b-13.md (series part-2) at close.
Human edits made outside tooling (structured)
- None. Tree clean at open (HEAD 153fc23, C1b-11k-a-b) and dirty at close
  (the four plan files staged + this handoff); committed as 1988274.
Open warnings (count + links only)

1. tools/*.md whitespace may not survive chat copy; anchor edits from `cat -A`. (carried C1b-03/04)
2. Edit splice pitfall: verify POSITIONALLY, not by substring; check the
   diffstat shows pure additions for seam edits. (carried C1b-04)
3. Stale "## The commit" line in HANDOFF-C1b-seam-bare-p.md (points at
   50ffad5) — still unfixed. (carried)
4. LOSS_LEDGER.md table padding mixed (cosmetic). (carried)
5. (carried C1b-07, process) prior chat initially routed shell to the human; resolved.
6. hash-state.js FILE_TREE_SHA256 capture rule: capture AFTER staging; see
   C1b-09a deviation note. (carried)
7. (carried C1b-11a) milestone regex lookahead vs task-text transcription.
8. (recurring) 0-byte stray file at repo root — keep an eye out before staging.
9. (carried C1b-11h) SILENT-loss metric gap: a DROPPED (not leaked) class is
   invisible to `*_para_leftover`; always reconcile raw <img>/<iframe> counts.
10. (NEW, process) parts 1–6 are the RICHEST in legacy markup; treat a new
    class as the EXPECTED failure mode for C1b-12..17, not a surprise.
Deviations from locked decisions (must be empty, or explain)
- None.
Partial work (link to PARTIAL.md if present)
- None.
Known issues / TODOs
- L-014 OPEN (parts 1–6); closed at C1b-17.
- L-001 open/by-design; L-010 deferred; all others resolved.
- HANDOFF-CURRENT.txt still points at HANDOFF-C1b-11k-a-b.md (the last
  COMPLETED handoff). C1b-12.md's opening reads expect exactly that, so it was
  left unchanged. Update it to HANDOFF-C1b-12.md at the close of C1b-12.
Assumptions the next chat may rely on
- The seam is frozen through D-Tool-28; no further seam change expected a
  priori, but a new class is the LIKELY failure mode for parts 1–6.
- posts.json is UNTRUSTED and front-truncated; parts 1–6 may be ABSENT from
  it. The live post AND the contents grid are the authority.
- parts 1–4 slugs are NON-UNIFORM; keep the live canonical slug.
- feed.json is intentionally date-desc; series reading order will be driven
  by the new seriesOrder field (C1b-18), NOT feed position.
Test checklist result (pass/fail per item)
- Investigation (read-only) identified the exact gap (parts 1–6): pass
- live canonical slugs for parts 1–6 confirmed HTTP 200, no redirect: pass
- L-014 recorded (row + note): pass
- ROADMAP corrected + C1b-12..18 registered; Next rewritten: pass
- C1b-DONE revised to 25/25: pass
- C1b-12.md authored: pass
- test-integrity INTEGRITY OK: pass
- LOCKED_DECISIONS_SHA256 unchanged: pass
Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1b-11k-a-b.md
- apps/blog/HANDOFF-C1b-PLAN.md (this file — the replan context)
- apps/blog/tools/milestones/C1b-12.md (the next milestone's file)
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/LOSS_LEDGER.md (see L-014)
- apps/blog/tools/ROADMAP.md
