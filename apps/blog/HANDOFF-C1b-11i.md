HANDOFF — Chat C1b-11i: Migrate part-8 (Afghanistan #1)
Status: complete
Current chat id: C1b-11i
Current milestone: C1b-11i
Completed milestones: C1a, C1-tool, C1-tool-p2, C1-model, C1-tool-cleanup, C1-tool-seam-complete, C1b-01, C1b-seam-bare-p, C1b-02, C1b-03, C1b-04, C1b-05, C1b-06, C1b-07, C1b-08, C1b-09a, C1b-09b, C1b-10, C1b-11, C1b-11a, C1b-11b, C1b-11c, C1b-11d, C1b-11e (partial/STOP — re-scoped), C1b-11e-a, C1b-11e-b, C1b-11f, C1b-11g, C1b-11h (partial/STOP — re-scoped), C1b-11h-a, C1b-11h-b, C1b-11i
Next chat id: C1b-11j
Context windows used: 1
Files created/modified (exact paths)
- apps/blog/content/en/a-contemporary-history-of-the-muslim-world-part-8-afghanistan-1.json
  (NEW; extracted `--from html`, census {paragraph:40,image:14,embed:3}, 57 blocks)
- apps/blog/assets/data/feed.json (MOD; regenerated, 17 -> 18 entries, date-desc;
  part-8 at idx 17, LAST)
- apps/blog/tools/LOSS_LEDGER.md (MOD; L-006 row status -> resolved, resolved-by
  C1b-11i; L-006 impact updated to "3 blocks (recon census; posts.json
  advertised 2 — undercounts)"; L-006 resolution note added; L-006 history
  retained)
- apps/blog/tools/ROADMAP.md (MOD; C1b-11i -> DONE; Next -> C1b-11j)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> HANDOFF-C1b-11i.md)
- apps/blog/HANDOFF-C1b-11i.md (NEW; this file)
- apps/blog/tools/milestones/C1b-11j.md (NEW; the next series migration)
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
- C1b-11j: migrate the next EN post in the `a-contemporary-history-...`
  series. Remaining unmigrated EN series posts: part-7
  `a-contemporary-history-of-the-muslim-world-part-7-the-lebanese-civil-war-3`
  (posts.json date 2016-06-20T21:24:41+00:00), then the series post
  `a-contemporary-history-of-the-muslim-world-contents` (posts.json date
  2017-01-20T13:22:50+00:00 — a SEPARATE slug, NOT part-8). Confirm
  slug/title/date against the live post AND posts.json (series slugs have
  shown discrepancies: part-15's short URL 301-redirects to a LONG canonical
  slug; part-13 carries a `protected-` prefix). Recon the census `--from
  html`; if a NEW structural class appears, STOP and re-scope (its own
  milestone). Expected feed.json 18 -> 19 entries.
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
   chat (git status clean at open and at close).
9. (carried C1b-11h) SILENT-loss metric gap: a DROPPED (not leaked) class is
   invisible to `*_para_leftover`; always reconcile the raw `<img>`/`<iframe>`
   count against the rendered block count. Exercised this chat for part-8
   (raw img 14 == rendered 14; raw iframe 3 == rendered 3; no drop).
Deviations from locked decisions (must be empty, or explain)
- None. import-post.js byte-identical; no content file other than part-8
  written; posts.json untouched; every non-regression target unchanged.
Partial work (link to PARTIAL.md if present)
- None this chat (complete). Prior STOP records: apps/blog/PARTIAL.md.
Known issues / TODOs
- L-006 RESOLVED (part-8 migrated; census {paragraph:40,image:14,embed:3};
  raw <img> 14 == rendered 14; 3 embeds verbatim with &#038;; 3 captions).
  posts.json advertised 2 embeds (undercount; live has 3). L-012 stays
  resolved (part-9). L-010 deferred (feed excerpt; not C1b).
- Tolerance note: the seam is now frozen through D-Tool-26; ANY further new
  class STOPS and re-scopes (its own milestone).
- remaining unmigrated series EN posts after part-8: part-7, and the series
  `...-muslim-world-contents`.
Assumptions the next chat may rely on
- The seam is frozen through D-Tool-26 (as shipped by C1b-11h-a).
- part-8's canonical slug = a-contemporary-history-of-the-muslim-world-part-8-afghanistan-1
  (live HTTP 200, no redirect, no `protected-` prefix, entry-content present);
  date 2016-08-02T00:41:55+00:00; title "A contemporary history of the Muslim
  world, part 8: Afghanistan #1" — all matching posts.json.
- part-8 content file census {paragraph:40,image:14,embed:3} (57 blocks); 14
  images = 11 bare `<p><img>` (D-Tool-20) + 3 `figure.wp-caption` (D-Tool-22;
  3 captions); 3 embeds (youtube wvwP0mC8qHE idx 36, A9RCFZnWGE0 idx 50,
  arPP37g1Rmo idx 54) raw `<iframe>` verbatim with `&#038;`; all
  `*_para_leftover` = 0; feed.json 18 entries; part-8 at idx 17 (LAST).
Test checklist result (pass/fail per item)
- git status --porcelain clean at open: pass
- test-integrity INTEGRITY OK at open: pass
- LOCKED_DECISIONS_SHA256 = 6d8ccb50... matches C1b-11h-b at open: pass
- part-8 URL confirmed fetchable (HTTP 200, 0 redirects, entry-content
  present, no `protected-` prefix, no password form): pass
- live slug/title/date confirmed; canonical slug used (filename and --url
  agree): pass
- part-8 content file written with the canonical slug: pass
- census matches recon ({paragraph:40,image:14,embed:3}, 57 blocks): pass
- every embed raw <iframe> verbatim with &#038; preserved; caption-bearing
  images have captions (3/3): pass
- all *_para_leftover = 0; raw <img> (14) == rendered images (14);
  raw iframe (3) == rendered embeds (3): pass
- feed.json 17 -> 18 entries (date-desc; part-8 at idx 17, LAST) verified
  POSITIONALLY: pass
- L-006 marked resolved in LOSS_LEDGER.md: pass
- Non-regression: pilot/ctn/update/part-9..22 all unchanged: pass
- test-integrity INTEGRITY OK at close: pass
- hash-state captured: pass
Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1b-11i.md
- apps/blog/PARTIAL.md
- apps/blog/tools/milestones/C1b-11j.md (this is the next milestone's file)
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/LOSS_LEDGER.md
- apps/blog/tools/ROADMAP.md
