HANDOFF — Chat C1b-12: Migrate series part-1 (The post WW1 carve-up…)
Status: complete
Current chat id: C1b-12
Current milestone: C1b-12
Completed milestones: C1a, C1-tool, C1-tool-p2, C1-model, C1-tool-cleanup,
C1-tool-seam-complete, C1b-01, C1b-seam-bare-p, C1b-02, C1b-03, C1b-04,
C1b-05, C1b-06, C1b-07, C1b-08, C1b-09a, C1b-09b, C1b-10, C1b-11, C1b-11a,
C1b-11b, C1b-11c, C1b-11d, C1b-11e (partial/STOP — re-scoped), C1b-11e-a,
C1b-11e-b, C1b-11f, C1b-11g, C1b-11h (partial/STOP — re-scoped), C1b-11h-a,
C1b-11h-b, C1b-11i, C1b-11j, C1b-11k (partial/STOP — re-scoped), C1b-11k-a
(partial/STOP — re-scoped), C1b-11k-a-a, C1b-11k-a-b, C1b-PLAN, C1b-12
Next chat id: C1b-13
Context windows used: 1
Files created/modified (exact paths)
- apps/blog/content/en/what-we-have-forgotten-and-they-havent-a-history-of-
  political-islam-and-the-west.json (NEW; 61 blocks; LEGACY NON-UNIFORM
  canonical slug; `--from html`)
- apps/blog/assets/data/feed.json (MOD; 20 -> 21 entries, date-desc)
- apps/blog/tools/ROADMAP.md (MOD; C1b-12 -> STATUS: DONE; Next updated)
- apps/blog/tools/milestones/C1b-13.md (NEW; the next migration milestone)
- apps/blog/HANDOFF-C1b-12.md (NEW; this file)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> HANDOFF-C1b-12.md)
Frozen decisions made in this chat
- None. Migration only. The seam was frozen through D-Tool-28 in C1b-11k-a-a
  (D-Tool-27 tableBare + D-Tool-28 imageBarePStrong); import-post.js was NOT
  touched. NO new structural class appeared: the measured census
  {image:11,paragraph:50} used only the already-frozen D-Tool-20 (bare
  `<p><img>`) and D-Tool-22 (figure.wp-caption).

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=465f8c1138b2cc195506b13926188d28b14c5a694d24fb526227630d178710a7
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, NOT in the handoff. See tools/WORKFLOW.md step 6.
Expected delta for the next chat (C1b-13 — migrate series part-2)
- Migrate ONE slug
  (`2015/12/13/what-we-have-forgotten-and-they-havent-a-history-of-political-
  islam-and-the-west-part-2`) `--from html` into content/en/; census MEASURED
  at recon (NOT pre-committed); reconcile raw `<img>`/`<iframe>` vs rendered
  blocks; all `*_para_leftover` = 0.
- LEGACY NON-UNIFORM slug (parts 1–4); KEEP the live canonical slug; confirm
  it (HTTP 200, no redirect, no `protected-` prefix) before writing; filename
  and `--url` must agree. posts.json is UNTRUSTED/front-truncated — parts 1–6
  may be ABSENT from it.
- feed.json 21 -> 22 entries (date-desc; part-2's 2015-12-13 is OLDER than
  every existing entry except part-1, so it sorts SECOND-TO-LAST, just above
  part-1 at idx 20).
- If a NEW structural class appears, STOP and re-scope (its own milestone).
- L-014 stays OPEN here (it tracks all six; closed at C1b-17).
- Author C1b-14.md (series part-3) at close.
Human edits made outside tooling (structured)
- None. Tree clean at open (HEAD 2d983dd6, C1b-11k-a-b) and dirty at close
  (part-1 content file + feed.json + ROADMAP.md + milestones/C1b-13.md + this
  handoff + HANDOFF-CURRENT.txt).
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
8. (recurring) 0-byte stray file at repo root — none present this chat
   (checked before staging).
9. (carried C1b-11h) SILENT-loss metric gap: a DROPPED (not leaked) class is
   invisible to `*_para_leftover`; always reconcile raw `<img>`/`<iframe>`
   counts. This milestone reconciled 11 raw `<img>` == 10 (bare `<p><img>`)
   + 1 (figure.wp-caption); raw `<iframe>` 0 == rendered 0.
10. (carried C1b-PLAN) parts 1–6 are the RICHEST in legacy markup; treat a
    new class as the EXPECTED failure mode for C1b-12..17. NONE appeared here.
Deviations from locked decisions (must be empty, or explain)
- None. NO seam change; import-post.js and LOCKED_DECISIONS.txt untouched; no
  content file written except part-1 itself; posts.json untouched; every
  previously shipped content/en/*.json byte-identical (20/20 re-extract).
Partial work (link to PARTIAL.md if present)
- None. C1b-12 completed its full scope.
Known issues / TODOs
- L-014 OPEN (parts 1–6: part-1 now migrated; parts 2–6 remain); closed at
  C1b-17. L-001 open/by-design; L-010 deferred; all others resolved.
- HANDOFF-CURRENT.txt updated to HANDOFF-C1b-12.md at this close.
Assumptions the next chat may rely on
- The seam is frozen through D-Tool-28; no further seam change expected a
  priori, but a new class is the LIKELY failure mode for the earliest posts.
- part-1's slug is LEGACY NON-UNIFORM and canonical: HTTP 200, no redirect,
  no `protected-` prefix, entry-content present; title "A contemporary history
  of the Muslim world, part 1"; date 2015-11-27T12:51:51+00:00. part-1 is
  ABSENT from posts.json (front-truncated) — NOT an error.
- Measured/written census {image:11,paragraph:50} (61 blocks): 11 images = 10
  bare `<p><img>` (D-Tool-20) + 1 figure.wp-caption (D-Tool-22; caption "Oil
  gusher spouting near Kirkuk, c.1932"). No embeds, no quote/footnotes, no
  emph-wrapped/strong-wrapped/trailing/divBareImg/tableBare classes.
- 11 raw `<img>` == 11 rendered; raw `<iframe>` 0 == 0; all `*_para_leftover`
  = 0.
- feed.json 21 entries; part-1 at idx 20 (LAST — oldest date 2015-11-27).
Test checklist result (pass/fail per item)
- git status --porcelain clean at open: pass
- test-integrity INTEGRITY OK at open: pass
- LOCKED_DECISIONS_SHA256 matches C1b-11k-a-b at open (465f8c11…): pass
- part-1 URL fetchable (HTTP 200, entry-content present, no redirect, no protected- prefix): pass
- live slug/title/date confirmed; canonical slug used (filename and --url agree): pass
- part-1 content file written with the canonical slug: pass
- census matches recon {image:11,paragraph:50} (measured, not pre-committed): pass
- every embed is raw <iframe> verbatim with &#038; preserved; caption-bearing images have captions: pass (0 embeds; 1 wp-caption carries its caption)
- raw <img> (11) == rendered image count (11); raw <iframe> (0) == rendered embed count (0); all *_para_leftover = 0: pass
- feed.json 20 -> 21 entries (date-desc) verified POSITIONALLY (part-1 at idx 20, LAST): pass
- Non-regression: pilot/ctn/update/contents/part-7..22 all unchanged (byte-identical re-extract, 21/21): pass
- test-integrity INTEGRITY OK at close: pass
- hash-state captured: pass
Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1b-12.md (this file)
- apps/blog/tools/milestones/C1b-13.md (the next milestone's file)
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/LOSS_LEDGER.md (see L-014)
- apps/blog/tools/ROADMAP.md
