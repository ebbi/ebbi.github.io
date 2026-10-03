HANDOFF — Chat C1b-11h: Migrate part-9 (Pakistan to 1979) [STOP — re-scoped]
Status: partial (STOP: scope-fence trip; NO content file written)
Current chat id: C1b-11h
Current milestone: C1b-11h
Completed milestones: C1a, C1-tool, C1-tool-p2, C1-model, C1-tool-cleanup, C1-tool-seam-complete, C1b-01, C1b-seam-bare-p, C1b-02, C1b-03, C1b-04, C1b-05, C1b-06, C1b-07, C1b-08, C1b-09a, C1b-09b, C1b-10, C1b-11, C1b-11a, C1b-11b, C1b-11c, C1b-11d, C1b-11e (partial/STOP — re-scoped), C1b-11e-a, C1b-11e-b, C1b-11f, C1b-11g
Next chat id: C1b-11h-a
Context windows used: 1
Files created/modified (exact paths)
- apps/blog/PARTIAL.md (MOD; prepended the C1b-11h STOP record)
- apps/blog/tools/milestones/C1b-11h-a.md (NEW; seam: D-Tool-26 divBareImg)
- apps/blog/tools/milestones/C1b-11h-b.md (NEW; migration of part-9)
- apps/blog/tools/ROADMAP.md (MOD; C1b-11h -> STOPPED/re-scoped; added
  C1b-11h-a + C1b-11h-b; adjusted Next + Cross-cutting facts to "nine")
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> HANDOFF-C1b-11h.md)
- apps/blog/HANDOFF-C1b-11h.md (NEW; this file)
Frozen decisions made in this chat
- None. No seam change performed here. D-Tool-26 (divBareImg) is AUTHORED in
  C1b-11h-a.md but NOT frozen in this chat; LOCKED_DECISIONS.txt untouched.

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=7958f41ecde2ac65ab66d85af56a251b50d651122cb8685fd7a491d3b1b52cdc
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, NOT in the handoff. See tools/WORKFLOW.md step 6.
Expected delta for the next chat
- C1b-11h-a: extend the D-Tool-9 seam by ONE entry (D-Tool-26 `divBareImg`),
  frozen in LOCKED_DECISIONS.txt, and add the L-012 ledger row. NO slug
  migrated; feed.json unchanged (16). Then C1b-11h-b migrates part-9
  (`a-contemporary-history-of-the-muslim-world-part-9-pakistan-1979`,
  expected census {image:14,paragraph:28,embed:1} (43 blocks); feed.json
  16 -> 17). Confirm slug/title/date against the live post again in C1b-11h-b.
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
8. (recurring) a 0-byte stray file appears at repo root (name like
   "^A^D...@p9N@8"); none present this chat (checked: repo root + app root
   clean of 0-byte files before any write).
Deviations from locked decisions (must be empty, or explain)
- None. NO seam change; import-post.js byte-identical; LOCKED_DECISIONS.txt
  byte-identical. This is a STOP/re-scope, not a migration (mirrors
  C1b-11 -> C1b-11a/C1b-11b and C1b-11e -> C1b-11e-a/C1b-11e-b).
- PROCESS NOTE (metric gap, not a code deviation): the part-9 silent loss is
  INVISIBLE to the `*_para_leftover` checks (the unmodeled class is DROPPED,
  not leaked into a paragraph). It was caught ONLY by reconciling the raw
  `<img>` count (14) against the rendered image-block count (13). Future
  recon should always reconcile raw image/embed counts, else a drop stays
  silent.
Partial work (link to PARTIAL.md if present)
- apps/blog/PARTIAL.md (C1b-11h STOP record, prepended).
Known issues / TODOs
- THE STOP: part-9's live HTML contains a CLASS-LESS bare `<div>` whose sole
  child is an `<img>` (one occurrence: `270px-miqbal4.jpg`,
  data-attachment-id 9237). No frozen TOP entry matches it, so the loop drops
  it tag-by-tag (the L-009/L-011 defect shape) -> 1 image SILENTLY LOST.
  Resolved by the NEW class `divBareImg` (D-Tool-26), authored in C1b-11h-a.
- The class appears in ONLY the part-9 cache (cache sha256
  42f01bff859cc2df93408523a972da7905f145aebdb5505a5b717346b7d660f6,
  157964 bytes); 0 occurrences in all 20 other cached sources -> NO shipped
  slug affected (no retrospective re-migration).
- L-006 (part-8 afghanistan-1) remains deferred (seam READY); NOT resolved.
- The tolerance note (carried from C1b-09b): the seam is now frozen through
  D-Tool-25; ANY further new class STOPS and re-scopes (its own milestone).
- remaining unmigrated series EN posts after part-9: part-8 (L-006), part-7,
  and the series `...-muslim-world-contents`.
Assumptions the next chat may rely on
- The seam is frozen through D-Tool-25 (as shipped by C1b-11g). No seam
  change performed here.
- part-9's canonical slug (live HTTP 200, no redirect, no `protected-`
  prefix, entry-content present, no password form) =
  a-contemporary-history-of-the-muslim-world-part-9-pakistan-1979, matching
  posts.json (date 2016-12-25T23:31:45+00:00; title "A contemporary history
  of the Muslim world, part 9: Pakistan to 1979").
- Recon census with the frozen seam = {image:13,paragraph:28,embed:1}
  (42 blocks). Raw entry-content counts: total <img>=14; bare <p><img>=8
  (D-Tool-20); figure.wp-caption=5 (D-Tool-22); emph-wrapped=0; div.wp-block-
  image=0; figure.wp-block-image=0; total <iframe>=1; jetpack-video-wrapper=1;
  total <p>=37; wp-block-paragraph=0; wp-block-quote=0; wp-block-footnotes=0;
  wp-block-table=0. The 1 embed is a standalone D-Tool-21 embed (raw
  `<iframe class="youtube-player" ... src="...qYHUJBRRnc4?version=3&#038;...">`
  verbatim, &#038; preserved). The 14th image is the dropped `divBareImg`.
- Seam-READY recon after D-Tool-26 = {image:14,paragraph:28,embed:1}
  (43 blocks), all `*_para_leftover` = 0.
Test checklist result (pass/fail per item)
- git status --porcelain clean at open: pass
- test-integrity INTEGRITY OK at open: pass
- LOCKED_DECISIONS_SHA256 = 7958f41e... at open (matches C1b-11g): pass
- GIT_HEAD = 7b3960e3... at open (matches C1b-11g): pass
- part-9 URL HTTP 200, entry-content present, no redirect, no protected- prefix: pass
- node --check import-post.js passes: pass
- live slug/title/date confirmed; canonical slug = posts.json slug: pass
- recon census MEASURED: {image:13,paragraph:28,embed:1} (42 blocks): pass
- all *_para_leftover = 0 (but silent drop detected via raw-img reconcile): pass
- STOP + re-scope (C1b-11h-a + C1b-11h-b authored): pass
- no content file written / feed.json unchanged (16) / LOCKED_DECISIONS &
  LOSS_LEDGER untouched: pass
- test-integrity INTEGRITY OK at close: pass
- hash-state captured: pass
Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1b-11h.md
- apps/blog/PARTIAL.md
- apps/blog/tools/milestones/C1b-11h-a.md (this is the next milestone's file)
- apps/blog/tools/milestones/C1b-11h-b.md (the following milestone)
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/LOSS_LEDGER.md
- apps/blog/tools/ROADMAP.md
