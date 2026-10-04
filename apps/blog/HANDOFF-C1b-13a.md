HANDOFF — Chat C1b-13a: Seam extension — prose-then-trailing-image in a bare <p>
Status: complete
Current chat id: C1b-13a
Current milestone: C1b-13a
Completed milestones: C1a, C1-tool, C1-tool-p2, C1-model, C1-tool-cleanup,
C1-tool-seam-complete, C1b-01, C1b-seam-bare-p, C1b-02, C1b-03, C1b-04,
C1b-05, C1b-06, C1b-07, C1b-08, C1b-09a, C1b-09b, C1b-10, C1b-11, C1b-11a,
C1b-11b, C1b-11c, C1b-11d, C1b-11e (partial/STOP — re-scoped), C1b-11e-a,
C1b-11e-b, C1b-11f, C1b-11g, C1b-11h (partial/STOP — re-scoped), C1b-11h-a,
C1b-11h-b, C1b-11i, C1b-11j, C1b-11k (partial/STOP — re-scoped), C1b-11k-a
(partial/STOP — re-scoped), C1b-11k-a-a, C1b-11k-a-b, C1b-PLAN, C1b-12,
C1b-13 (partial/STOP — re-scoped), C1b-13a
Next chat id: C1b-13b
Context windows used: 1
Files created/modified (exact paths)
- apps/blog/tools/import-post.js (MOD; +57 lines, 0 deletions — one new TOP
  entry `imageBarePProse` AFTER D-Tool-24 / BEFORE D-Tool-25, and one new
  blockFromFragment() branch, AFTER imageBarePTrailing / BEFORE embedInBareP)
- apps/blog/tools/LOCKED_DECISIONS.txt (MOD; appended D-Tool-29)
- apps/blog/tools/milestones/C1b-13a.md (NEW; this milestone's plan)
- apps/blog/tools/milestones/C1b-13b.md (NEW; the next migration milestone)
- apps/blog/HANDOFF-C1b-13a.md (NEW; this file)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> HANDOFF-C1b-13a.md)
Frozen decisions made in this chat
- D-Tool-29 — prose-then-trailing-image bare-`<p>` rule (`imageBarePProse`).
  The TWELFTH deliberate, narrow extension of the D-Tool-9 seam freeze,
  after D-Tool-18..28. A bare `<p>` (class absent or lacking "wp-block-")
  whose content is PROSE followed by a single trailing `<img>` at the END
  of the same `<p>` (the MIRROR of D-Tool-24 imageBarePTrailing). Emits UP
  TO TWO blocks IN SOURCE ORDER: the leading prose as a paragraph (raw
  inner HTML up to but not including the trailing `<img>`, trimmed — the
  SAME semantics as paragraphBare) AND the trailing `<img>` as the EXISTING
  image shape `{type:"image", src, caption:""}`. Leading run is a TEMPERED
  dot so the match never crosses `</p>`. NO prior regex changed.

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=af9e5595d9e1cf48e388229c544145bb7dfd02180cb1be44bbd12663ca45b1f3
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, NOT in the handoff. See tools/WORKFLOW.md step 6.
Expected delta for the next chat (C1b-13b — migrate series part-2)
- Migrate ONE slug
  (`2015/12/13/what-we-have-forgotten-and-they-havent-a-history-of-political-
  islam-and-the-west-part-2`) `--from html` into content/en/; census MEASURED
  at recon (now seam-ready): `{image:21,paragraph:53,embed:2}` (76 blocks);
  reconcile raw `<img>` 21 == 21, raw `<iframe>` 2 == 2; all
  `*_para_leftover` = 0.
- LEGACY NON-UNIFORM slug (parts 1–4); KEEP the live canonical slug; confirm
  it (HTTP 200, no redirect, no `protected-` prefix) before writing; filename
  and `--url` must agree. posts.json is UNTRUSTED/front-truncated — parts 1–6
  may be ABSENT from it.
- feed.json 21 -> 22 entries (date-desc; part-2's 2015-12-13 is OLDER than
  every existing entry except part-1, so it sorts SECOND-TO-LAST, just above
  part-1 at idx 20; part-2 lands at idx 21).
- The seam is now frozen through D-Tool-29. If ANOTHER new structural class
  appears, STOP and re-scope again (its own milestone).
- L-014 stays OPEN here (it tracks all six; closed at C1b-17).
- Author C1b-14.md (series part-3) at close.
Human edits made outside tooling (structured)
- None. Tree clean at open (HEAD d5b8160b, C1b-12) and dirty at close
  (import-post.js + LOCKED_DECISIONS.txt + milestones/C1b-13a.md +
  milestones/C1b-13b.md + this handoff + HANDOFF-CURRENT.txt).
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
   counts. THIS milestone's trigger: raw `<img>` 21 vs rendered 20 (one
   silently dropped) AND `img_para_leftover = 1` — BOTH symptoms from the
   SAME unmodeled class (prose-then-trailing-image).
10. (carried C1b-PLAN) parts 1–6 are the RICHEST in legacy markup; a new
    class is the EXPECTED failure mode. It appeared here exactly as predicted.
Deviations from locked decisions (must be empty, or explain)
- None. Seam change is a PURE ADDITION (0 deletions); every prior regex is
  byte-identical; NO content file written; posts.json untouched; all 21
  previously shipped content/en/*.json byte-identical on re-extract.
Partial work (link to PARTIAL.md if present)
- None. C1b-13a completed its full scope.
Known issues / TODOs
- L-014 OPEN (parts 1–6: part-1 migrated; parts 2–6 remain; part-2 is now
  seam-ready); closed at C1b-17. L-001 open/by-design; L-010 deferred.
- HANDOFF-CURRENT.txt updated to HANDOFF-C1b-13a.md at this close.
Assumptions the next chat may rely on
- The seam is now frozen through D-Tool-29; part-2 is seam-ready.
- part-2's slug is LEGACY NON-UNIFORM and canonical: HTTP 200, no redirect,
  no `protected-` prefix, entry-content present; title "A contemporary
  history of the Muslim world, part 2"; date 2015-12-13T17:56:44+00:00.
  part-2 is ABSENT from posts.json (front-truncated) — NOT an error.
- Recon census {image:21,paragraph:53,embed:2} (76 blocks): 21 images =
  3 figure.wp-caption (D-Tool-22, 3 captions) + the rest bare `<p><img>`
  variants (D-Tool-20/23/28/24) + 1 recovered `imageBarePProse`
  (assad21.jpg); 2 embeds, both raw `<iframe>` verbatim with `&#038;`
  preserved (D-Tool-21).
- 21 raw `<img>` == 21 rendered; raw `<iframe>` 2 == 2; all
  `*_para_leftover` = 0.
- feed.json currently 21 entries; part-2 will land at idx 21 (LAST).
Test checklist result (pass/fail per item)
- git status --porcelain clean at open: pass
- test-integrity INTEGRITY OK at open: pass
- LOCKED_DECISIONS_SHA256 matches C1b-12 at open (465f8c11…): pass
- recon of part-2 shows a NEW structural class (raw <img> 21 vs rendered 20; img_para_leftover = 1): pass (STOP triggered as designed)
- seam extension is a PURE ADDITION: git diff --stat = +57 / -0; node --check clean: pass
- seam-readiness recon of part-2 {image:21,paragraph:53,embed:2} (76 blocks), all *_para_leftover = 0, raw counts reconcile: pass
- Non-regression: pilot/ctn/update/contents/part-1/part-7..22 all byte-identical re-extract (21/21): pass
- test-integrity INTEGRITY OK at close: pass
- hash-state captured (LOCKED_DECISIONS_SHA256=af9e5595…; pilot 36d1164a…): pass
Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1b-13a.md (this file)
- apps/blog/tools/milestones/C1b-13b.md (the next milestone's file)
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/LOCKED_DECISIONS.txt (see D-Tool-29)
- apps/blog/tools/LOSS_LEDGER.md (see L-014)
- apps/blog/tools/ROADMAP.md
