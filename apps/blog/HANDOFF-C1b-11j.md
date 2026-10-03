HANDOFF — Chat C1b-11j: Migrate part-7 (The Lebanese civil war #3)
Status: complete
Current chat id: C1b-11j
Current milestone: C1b-11j
Completed milestones: C1a, C1-tool, C1-tool-p2, C1-model, C1-tool-cleanup, C1-tool-seam-complete, C1b-01, C1b-seam-bare-p, C1b-02, C1b-03, C1b-04, C1b-05, C1b-06, C1b-07, C1b-08, C1b-09a, C1b-09b, C1b-10, C1b-11, C1b-11a, C1b-11b, C1b-11c, C1b-11d, C1b-11e (partial/STOP — re-scoped), C1b-11e-a, C1b-11e-b, C1b-11f, C1b-11g, C1b-11h (partial/STOP — re-scoped), C1b-11h-a, C1b-11h-b, C1b-11i, C1b-11j
Next chat id: C1b-11k
Context windows used: 1
Files created/modified (exact paths)

- apps/blog/content/en/a-contemporary-history-of-the-muslim-world-part-7-the-lebanese-civil-war-3.json
  (NEW; extracted `--from html`, census {image:11,paragraph:32,embed:3}, 46 blocks)
- apps/blog/assets/data/feed.json (MOD; regenerated, 18 -> 19 entries, date-desc;
  part-7 at idx 18, LAST)
- apps/blog/tools/ROADMAP.md (MOD; C1b-11j -> DONE; Next -> C1b-11k)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> HANDOFF-C1b-11j.md)
- apps/blog/HANDOFF-C1b-11j.md (NEW; this file)
- apps/blog/tools/milestones/C1b-11k.md (NEW; the next series migration)
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

- C1b-11k: migrate the LAST unmigrated EN post in the
  `a-contemporary-history-...` series: the series post
  `a-contemporary-history-of-the-muslim-world-contents` (posts.json date
  2017-01-20T13:22:50+00:00 — a SEPARATE slug, NOT part-7). Confirm
  slug/title/date against the live post AND posts.json (series slugs have
  shown discrepancies). Recon the census `--from html`; if a NEW structural
  class appears, STOP and re-scope (its own milestone). Expected feed.json
  19 -> 20 entries (date-desc; 2017-01-20 sits between part-10 2017-01-06
  idx 15 and part-11 2017-02-08 idx 14; verify POSITIONALLY).
  Human edits made outside tooling (structured)
- At open, the tree carried C1b-11i's staged-but-uncommitted deliverables
  (last commit was C1b-11h-b). The human committed C1b-11i first (commit
  56d8597) per Option (A), making the tree clean before any write. This is a
  scheduled hand-off (previous milestone's commit deferred to the human), NOT
  a dirty-tree violation.
  Open warnings (count + links only)

1. tools/\*.md whitespace may not survive chat copy; anchor edits from `cat -A`. (carried C1b-03/04)
2. Edit splice pitfall: verify POSITIONALLY, not by substring. (carried C1b-04)
3. Stale "## The commit" line in HANDOFF-C1b-seam-bare-p.md (points at 50ffad5) — still unfixed. (carried)
4. LOSS_LEDGER.md table padding mixed (cosmetic). (carried)
5. (carried C1b-07, process) prior chat initially routed shell to the human; resolved.
6. hash-state.js FILE_TREE_SHA256 capture rule: capture AFTER staging; see
   C1b-09a deviation note. (carried)
7. (carried C1b-11a) milestone regex lookahead vs task-text transcription
   (missing `*` quantifiers). Frozen-form regex used.
8. (recurring) a 0-byte stray file appears at repo root; none present this
   chat (git status clean after the C1b-11i commit, at open and close).
9. (carried C1b-11h) SILENT-loss metric gap: a DROPPED (not leaked) class is
   invisible to `*_para_leftover`; always reconcile the raw `<img>`/`<iframe>`
   count against the rendered block count. Exercised this chat for part-7
   (raw img 11 == rendered 11; raw iframe 3 == rendered 3; no drop).
   Deviations from locked decisions (must be empty, or explain)

- None. import-post.js byte-identical; no content file other than part-7
  written; posts.json untouched; every non-regression target unchanged.
  Partial work (link to PARTIAL.md if present)
- None this chat (complete). Prior STOP records: apps/blog/PARTIAL.md.
  Known issues / TODOs
- L-006 stays RESOLVED (part-8, C1b-11i); L-012 stays RESOLVED (part-9,
  C1b-11h-b); L-010 stays DEFERRED (feed excerpt; not C1b). No loss found
  this chat; LOSS_LEDGER.md untouched.
- Tolerance note: the seam is now frozen through D-Tool-26; ANY further new
  class STOPS and re-scopes (its own milestone).
- remaining unmigrated series EN posts after part-7: ONLY the series
  `...-muslim-world-contents` (C1b-11k). After it, C1b-DONE proves 20/20.
  Assumptions the next chat may rely on
- The seam is frozen through D-Tool-26 (as shipped by C1b-11h-a).
- part-7's canonical slug = a-contemporary-history-of-the-muslim-world-part-7-the-lebanese-civil-war-3
  (live HTTP 200, 0 redirects, no `protected-` prefix, entry-content present;
  the single "protected" string in the HTML is the word "protected" inside the
  post prose, NOT a password form); date 2016-06-20T21:24:41+00:00; title
  "A contemporary history of the Muslim world, part 7: The Lebanese civil war
  #3" (the source `&nbsp;` before `#3` decoded to a space per D-Tool-16) —
  all matching posts.json. NO slug discrepancy.
- part-7 content file census {image:11,paragraph:32,embed:3} (46 blocks); 11
  images = 9 `div.wp-block-image` (D-Tool-9 imageWrap) + 2
  `figure.wp-block-image` (imageFig), 9 with captions (2 captionless
  wp-block-images: `amal.jpg` idx 0, `vlcsnap-…02h44m15s198.png` idx 24); 3
  embeds (youtube IDs ah26FtPhBMA idx 3, 4a7BKqP61pI idx 8, 3xlPZCM5_Vg
  idx 29) raw `<iframe>` verbatim with `&#038;`; all
  `*_para_leftover` = 0; feed.json 19 entries; part-7 at idx 18 (LAST).
  Test checklist result (pass/fail per item)
- git status --porcelain clean at open: pass (after committing C1b-11i; see
  Human edits)
- test-integrity INTEGRITY OK at open: pass
- LOCKED_DECISIONS_SHA256 = 6d8ccb50... matches C1b-11i at open: pass
- part-7 URL confirmed fetchable (HTTP 200, 0 redirects, entry-content
  present, no `protected-` prefix, no password form): pass
- live slug/title/date confirmed; canonical slug used (filename and --url
  agree): pass
- part-7 content file written with the canonical slug: pass
- census matches recon ({image:11,paragraph:32,embed:3}, 46 blocks): pass
- every embed raw <iframe> verbatim with &#038; preserved; caption-bearing
  images have captions (9/9): pass
- all \*\_para_leftover = 0; raw <img> (11) == rendered images (11);
  raw iframe (3) == rendered embeds (3): pass
- feed.json 18 -> 19 entries (date-desc; part-7 at idx 18, LAST) verified
  POSITIONALLY: pass
- Non-regression: pilot/ctn/update/part-8..22 all unchanged (byte-identical
  on live re-extraction): pass
- test-integrity INTEGRITY OK at close: pass
- hash-state captured: pass
  Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1b-11j.md
- apps/blog/PARTIAL.md
- apps/blog/tools/milestones/C1b-11k.md (this is the next milestone's file)
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/LOSS_LEDGER.md
- apps/blog/tools/ROADMAP.md
