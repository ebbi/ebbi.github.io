HANDOFF — Chat C1b-11h-a: Extend the D-Tool-9 seam: divBareImg (D-Tool-26)
Status: complete
Current chat id: C1b-11h-a
Current milestone: C1b-11h-a
Completed milestones: C1a, C1-tool, C1-tool-p2, C1-model, C1-tool-cleanup, C1-tool-seam-complete, C1b-01, C1b-seam-bare-p, C1b-02, C1b-03, C1b-04, C1b-05, C1b-06, C1b-07, C1b-08, C1b-09a, C1b-09b, C1b-10, C1b-11, C1b-11a, C1b-11b, C1b-11c, C1b-11d, C1b-11e (partial/STOP — re-scoped), C1b-11e-a, C1b-11e-b, C1b-11f, C1b-11g, C1b-11h (partial/STOP — re-scoped), C1b-11h-a
Next chat id: C1b-11h-b
Context windows used: 1
Files created/modified (exact paths)
- apps/blog/tools/import-post.js (MOD; one TOP entry `divBareImg` after
  wpCaptionFig and before table + one blockFromFragment branch identical to
  imageBareP; all `<p>`-keyed regexes byte-identical; +31 pure additions)
- apps/blog/tools/LOCKED_DECISIONS.txt (MOD; froze D-Tool-26 divBareImg)
- apps/blog/tools/LOSS_LEDGER.md (MOD; added L-012 row + L-012 note)
- apps/blog/tools/ROADMAP.md (MOD; C1b-11h-a -> DONE; Next -> C1b-11h-b)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> HANDOFF-C1b-11h-a.md)
- apps/blog/HANDOFF-C1b-11h-a.md (NEW; this file)
- apps/blog/tools/milestones/C1b-11h-b.md (NEW; the part-9 migration)
Frozen decisions made in this chat
- D-Tool-26 `divBareImg`: TOP entry
  re: /<div\b(?![^>]*\bclass=)[^>]*>\s*<img\b[^>]*\/?>\s*<\/div>/i,
  placed AFTER wpCaptionFig (D-Tool-22) and BEFORE the table entry; handled
  in blockFromFragment IDENTICALLY to imageBareP (D-Tool-20): src =
  attrOfFirst(frag,"img","src") verbatim, emit { type:"image", src,
  caption:"" }, or null if no src. The NINTH narrow extension of the D-Tool-9
  seam freeze. imageBareP/imageBarePEm/imageBarePTrailing/embedInBareP/
  paragraphBare regexes left BYTE-IDENTICAL.

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=6d8ccb5069925fcbbe764ac65b9a17c6492a0d5172a8a80e305ebc8b0ce40ab1
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, NOT in the handoff. See tools/WORKFLOW.md step 6.
Expected delta for the next chat
- C1b-11h-b: migrate part-9
  (`a-contemporary-history-of-the-muslim-world-part-9-pakistan-1979`, date
  2016-12-25T23:31:45+00:00) from the live HTML (`--from html`) now that the
  seam represents every class. Expected census {image:14,paragraph:28,embed:1}
  (43 blocks); feed.json 16 -> 17; resolves L-012. Confirm slug/title/date
  against the live post again in C1b-11h-b.
Human edits made outside tooling (structured)
- None reported.
Open warnings (count + links only)
1. tools/*.md whitespace may not survive chat copy; anchor edits from `cat -A`. (carried C1b-03/04)
2. Edit splice pitfall: verify POSITIONALLY, not by substring. (carried C1b-04)
3. Stale "## The commit" line in HANDOFF-C1b-seam-bare-p.md (points at 50ffad5) — still unfixed. (carried)
4. LOSS_LEDGER.md table padding mixed (cosmetic). (carried)
5. (carried C1b-07, process) prior chat initially routed shell to the human; resolved.
6. hash-state.js FILE_TREE_SHA256 capture rule: capture AFTER staging; see
   C1b-09a deviation note. (carried)
7. (carried C1b-11a) milestone regex lookahead vs task-text transcription
   (missing `*` quantifiers). Frozen-form regex used.
8. (recurring) a 0-byte stray file appears at repo root; none present this
   chat (checked: git status clean at open).
9. (NEW, carried from C1b-11h) SILENT-loss metric gap: a DROPPED (not
   leaked) class is invisible to `*_para_leftover`; always reconcile the raw
   `<img>`/`<iframe>` count against the rendered block count.
Deviations from locked decisions (must be empty, or explain)
- None. import-post.js changed ONLY by the two intended additions; every
  `<p>`-keyed regex is byte-identical (verified by diff); no content file
  written; feed.json unchanged (16); posts.json untouched.
Partial work (link to PARTIAL.md if present)
- None this chat (complete). Prior STOP record: apps/blog/PARTIAL.md (C1b-11h).
Known issues / TODOs
- L-012 (part-9 silent image loss) is RESOLVED by C1b-11h-b (migrate part-9).
  The class is confined to part-9 (0 occurrences in all 20 other cached
  sources); NO shipped slug affected, no retrospective re-migration.
- L-006 (part-8 afghanistan-1) remains deferred (seam READY); NOT resolved.
- Tolerance note (carried): the seam is now frozen through D-Tool-26; ANY
  further new class STOPS and re-scopes (its own milestone).
- remaining unmigrated series EN posts after part-9: part-8 (L-006), part-7,
  and the series `...-muslim-world-contents`.
Assumptions the next chat may rely on
- The seam is frozen through D-Tool-26 (as shipped by C1b-11h-a). part-9's
  canonical slug (live HTTP 200, no redirect, no `protected-` prefix,
  entry-content present) =
  a-contemporary-history-of-the-muslim-world-part-9-pakistan-1979, matching
  posts.json (date 2016-12-25T23:31:45+00:00; title "A contemporary history
  of the Muslim world, part 9: Pakistan to 1979").
- Seam-READY recon with D-Tool-26 = {image:14,paragraph:28,embed:1} (43
  blocks), all `*_para_leftover` = 0. The 14 images = 8 bare `<p><img>`
  (D-Tool-20) + 5 `figure.wp-caption` (D-Tool-22) + 1 divBareImg (D-Tool-26,
  `270px-miqbal4.jpg`, src verbatim). The 1 embed = a standalone D-Tool-21
  embed (raw `<iframe>` verbatim, `&#038;` preserved).
- part-9's date 2016-12-25 is OLDER than part-10's 2017-01-06, so date-desc
  places part-9 AFTER part-10 (likely LAST).
Test checklist result (pass/fail per item)
- git status --porcelain clean at open: pass
- test-integrity INTEGRITY OK at open: pass
- LOCKED_DECISIONS_SHA256 = 7958f41e... at open (matches C1b-11h): pass
- import-post.js: one TOP entry after wpCaptionFig, before table; all
  `<p>`-keyed regexes byte-identical: pass
- blockFromFragment D-Tool-26 branch emits { type:"image", src, caption:"" }
  (null if no src): pass
- node --check passes: pass
- Non-regression: pilot 80 / ctn 34 (quote[3] len=240) / update 2 /
  part-10..22 all unchanged: pass
- part-9 re-recon {image:14,paragraph:28,embed:1} (43), *_para_leftover = 0: pass
- D-Tool-26 frozen in LOCKED_DECISIONS.txt: pass
- L-012 row added to LOSS_LEDGER.md: pass
- test-integrity INTEGRITY OK at close: pass
- hash-state captured: pass
Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1b-11h-a.md
- apps/blog/PARTIAL.md
- apps/blog/tools/milestones/C1b-11h-b.md (this is the next milestone's file)
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/LOSS_LEDGER.md
- apps/blog/tools/ROADMAP.md
