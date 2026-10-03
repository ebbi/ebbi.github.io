HANDOFF — Chat C1b-11c: Migrate part-14 (Yemen #2)
Status: complete
Current chat id: C1b-11c
Current milestone: C1b-11c
Completed milestones: C1a, C1-tool, C1-tool-p2, C1-model, C1-tool-cleanup, C1-tool-seam-complete, C1b-01, C1b-seam-bare-p, C1b-02, C1b-03, C1b-04, C1b-05, C1b-06, C1b-07, C1b-08, C1b-09a, C1b-09b, C1b-10, C1b-11, C1b-11a, C1b-11b, C1b-11c
Next chat id: C1b-11d
Context windows used: 1
Files created/modified (exact paths)
- apps/blog/content/en/a-contemporary-history-of-the-muslim-world-part-14-yemen-2.json (NEW; --from html; 32 blocks)
- apps/blog/assets/data/feed.json (MOD; regenerate; 11 -> 12 entries, date-desc)
- apps/blog/tools/milestones/C1b-11d.md (NEW; the part-13 migration plan)
- apps/blog/HANDOFF-C1b-11c.md (NEW; this file)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> this file)
- apps/blog/tools/ROADMAP.md (MOD; C1b-11c -> Done; adjust Next)
Frozen decisions made in this chat
- None. NO seam change; the seam is frozen through D-Tool-23 (C1b-11a).
  This was a plain migration.

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=ca5e5081f0817ac8b365095cd684b183e066096da45c1656e0714747af351f67
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, NOT in the handoff. See tools/WORKFLOW.md step 6.
Expected delta for the next chat
- C1b-11d: migrate part-13 (Yemen #1) from the LIVE HTML at
  https://twolegsbadblog.wordpress.com/2018/04/29/protected-a-contemporary-history-of-the-muslim-world-part-13-yemen-1/
  into content/en/<canonical slug>.json via --from html. NOTE: the slug
  carries a `protected-` prefix (protected WP.com post) — VERIFY FETCHABILITY
  before writing; if gated, STOP and re-scope. posts.json date
  2018-04-29T19:58:23+00:00. Recon the census first (no count pre-committed).
  Regenerate feed.json 12 -> 13 (date-desc; part-13 inserts after part-14).
  NO seam change expected.
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
   (missing `*` quantifiers). Frozen-form regex used; see Deviations.
Deviations from locked decisions (must be empty, or explain)
- None.
Partial work (link to PARTIAL.md if present)
- apps/blog/PARTIAL.md (the C1b-11 STOP record; historical, unchanged).
Known issues / TODOs
- NO loss discovered this milestone; LOSS_LEDGER.md untouched (no new row).
- L-005 RESOLVED (C1b-11b). L-006 (part-8 afghanistan-1) remains deferred
  (seam READY); resolved at its own series milestone.
- remaining unmigrated series EN posts: part-7, part-8 (L-006), part-9,
  part-10, `...-contents`, part-11 (note the `-11-` slug shape, no `part-`),
  part-12, part-13 (`protected-` prefix, next, C1b-11d).
- part-13's slug carries a `protected-` prefix (protected WP.com post) —
  verify fetchability when its milestone arrives.
Assumptions the next chat may rely on
- The seam through D-Tool-23 is frozen; D-Tool-23 is the SIXTH extension.
- part-14 contained NO embeds and NO emph-wrapped images; every class was
  already represented (1 figure.wp-caption + 8 bare <p><img>).
- pilot/ctn/update/part-15..22 content files are byte-identical to their
  pre-C1b-11c committed files (verified: git diff shows only feed.json).
- feed.json is 12 entries, date-desc (part-14 at idx 10, after part-15).
- part-14's canonical URL is HTTP 200 (checked; no redirect). posts.json
  carries slug a-contemporary-history-of-the-muslim-world-part-14-yemen-2,
  date 2018-05-11T20:15:37+00:00, title "A contemporary history of the
  Muslim world, part 14: Yemen #2" (live HTML title carries `Yemen&nbsp;#2`;
  firstTitle decodes &nbsp; to a single space per D-Tool-16).
Test checklist result (pass/fail per item)
- git status --porcelain clean at open: pass
- test-integrity INTEGRITY OK at open: pass
- LOCKED_DECISIONS_SHA256 = ca5e5081... at open (matches C1b-11b): pass
- part-14 content file written with the canonical slug: pass
- census {image:9,paragraph:23} (32 blocks) matches recon: pass
- 0 embeds in source (none to preserve): pass
- 1 image non-empty caption (D-Tool-22 figure.wp-caption): pass
- 9 images = 1 figure.wp-caption + 8 bare <p><img> (D-Tool-20); 0 emph-wrapped: pass
- all *_para_leftover = 0: pass
- feed.json 11 -> 12 entries (date-desc; part-14 at idx 10): pass
- no loss -> LOSS_LEDGER.md untouched: pass
- Non-regression: pilot 80 / ctn 34 (quote[3] len=240) / update 2 /
  part-15..22 all unchanged: pass
- test-integrity INTEGRITY OK at close: pass
- hash-state.js captured: pass
Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1b-11c.md
- apps/blog/PARTIAL.md
- apps/blog/tools/milestones/C1b-11d.md
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/LOSS_LEDGER.md
- apps/blog/tools/ROADMAP.md
