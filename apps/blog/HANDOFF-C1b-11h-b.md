HANDOFF — Chat C1b-11h-b: Migrate part-9 (Pakistan to 1979)
Status: complete
Current chat id: C1b-11h-b
Current milestone: C1b-11h-b
Completed milestones: C1a, C1-tool, C1-tool-p2, C1-model, C1-tool-cleanup, C1-tool-seam-complete, C1b-01, C1b-seam-bare-p, C1b-02, C1b-03, C1b-04, C1b-05, C1b-06, C1b-07, C1b-08, C1b-09a, C1b-09b, C1b-10, C1b-11, C1b-11a, C1b-11b, C1b-11c, C1b-11d, C1b-11e (partial/STOP — re-scoped), C1b-11e-a, C1b-11e-b, C1b-11f, C1b-11g, C1b-11h (partial/STOP — re-scoped), C1b-11h-a, C1b-11h-b
Next chat id: C1b-11i
Context windows used: 1
Files created/modified (exact paths)
- apps/blog/content/en/a-contemporary-history-of-the-muslim-world-part-9-pakistan-1979.json
  (NEW; extracted `--from html`, census {image:14,paragraph:28,embed:1}, 43 blocks)
- apps/blog/assets/data/feed.json (MOD; regenerated, 16 -> 17 entries, date-desc)
- apps/blog/tools/LOSS_LEDGER.md (MOD; L-012 row status -> resolved; L-012
  resolution note added; L-012 history note retained)
- apps/blog/tools/ROADMAP.md (MOD; C1b-11h-b -> DONE; Next -> C1b-11i)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> HANDOFF-C1b-11h-b.md)
- apps/blog/HANDOFF-C1b-11h-b.md (NEW; this file)
- apps/blog/tools/milestones/C1b-11i.md (NEW; the next series migration)
Frozen decisions made in this chat
- None. No seam change this milestone (import-post.js byte-identical;
  LOCKED_DECISIONS.txt untouched). D-Tool-26 was frozen in C1b-11h-a.

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=6d8ccb5069925fcbbe764ac65b9a17c6492a0d5172a8a80e305ebc8b0ce40ab1
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, NOT in the handoff. See tools/WORKFLOW.md step 6.
Expected delta for the next chat
- C1b-11i: migrate the next EN post in the `a-contemporary-history-...`
  series. Remaining unmigrated EN series posts: part-8 `afghanistan-1`
  (L-006 — resolves the deferred legacy Jetpack embed; seam already READY),
  then part-7, then the series `...-muslim-world-contents`. Confirm
  slug/title/date against the live post AND posts.json (series slugs have
  shown discrepancies: part-15's short URL 301-redirects to a LONG canonical
  slug; part-13 carries a `protected-` prefix). Recon the census `--from
  html`; if a NEW structural class appears, STOP and re-scope (its own
  milestone). Expected feed.json 17 -> 18 entries.
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
   chat (git status clean at open).
9. (carried C1b-11h) SILENT-loss metric gap: a DROPPED (not leaked) class is
   invisible to `*_para_leftover`; always reconcile the raw `<img>`/`<iframe>`
   count against the rendered block count. Exercised this chat for part-9
   (14 raw == 14 rendered; L-012 closed).
Deviations from locked decisions (must be empty, or explain)
- None. import-post.js byte-identical; no content file other than part-9
  written; posts.json untouched; every non-regression target unchanged.
Partial work (link to PARTIAL.md if present)
- None this chat (complete). Prior STOP record: apps/blog/PARTIAL.md.
Known issues / TODOs
- L-012 RESOLVED (part-9 migrated; census {image:14,paragraph:28,embed:1};
  raw <img> 14 == rendered 14; divBareImg recovered). L-006 (part-8) remains
  deferred (seam READY); NOT resolved. L-010 deferred (feed excerpt; not C1b).
- Tolerance note: the seam is now frozen through D-Tool-26; ANY further new
  class STOPS and re-scopes (its own milestone).
- remaining unmigrated series EN posts after part-9: part-8 (L-006), part-7,
  and the series `...-muslim-world-contents`.
Assumptions the next chat may rely on
- The seam is frozen through D-Tool-26 (as shipped by C1b-11h-a).
- part-9's canonical slug = a-contemporary-history-of-the-muslim-world-part-9-pakistan-1979
  (live HTTP 200, no redirect, no `protected-` prefix, entry-content present);
  date 2016-12-25T23:31:45+00:00; title "A contemporary history of the Muslim
  world, part 9: Pakistan to 1979" — all matching posts.json.
- part-9 content file census {image:14,paragraph:28,embed:1} (43 blocks), all
  `*_para_leftover` = 0; feed.json 17 entries; part-9 at idx 16 (LAST).
Test checklist result (pass/fail per item)
- git status --porcelain clean at open: pass
- test-integrity INTEGRITY OK at open: pass
- LOCKED_DECISIONS_SHA256 = 6d8ccb50... matches C1b-11h-a at open: pass
- part-9 URL fetchable (HTTP 200, 0 redirects, entry-content present, no
  `protected-` prefix, no password form): pass
- live slug/title/date confirmed; canonical slug used (filename and --url
  agree): pass
- census {image:14,paragraph:28,embed:1} (43 blocks): pass
- 1 embed raw <iframe> verbatim with &#038; preserved: pass
- 5 image captions (D-Tool-22): pass
- 270px-miqbal4.jpg present (D-Tool-26): pass
- all *_para_leftover = 0; raw <img> (14) == rendered images (14): pass
- feed.json 16 -> 17 entries (date-desc; part-9 at idx 16, LAST): pass
- L-012 marked resolved in LOSS_LEDGER.md: pass
- Non-regression: pilot/ctn/update/part-10..22 all unchanged: pass
- test-integrity INTEGRITY OK at close: pass
- hash-state captured: pass
Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1b-11h-b.md
- apps/blog/PARTIAL.md
- apps/blog/tools/milestones/C1b-11i.md (this is the next milestone's file)
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/LOSS_LEDGER.md
- apps/blog/tools/ROADMAP.md
