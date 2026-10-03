HANDOFF — Chat C1b-11e-a: Extend the D-Tool-9 seam (D-Tool-24 + D-Tool-25)
Status: complete
Current chat id: C1b-11e-a
Current milestone: C1b-11e-a
Completed milestones: C1a, C1-tool, C1-tool-p2, C1-model, C1-tool-cleanup, C1-tool-seam-complete, C1b-01, C1b-seam-bare-p, C1b-02, C1b-03, C1b-04, C1b-05, C1b-06, C1b-07, C1b-08, C1b-09a, C1b-09b, C1b-10, C1b-11, C1b-11a, C1b-11b, C1b-11c, C1b-11d, C1b-11e (partial/STOP — re-scoped), C1b-11e-a
Next chat id: C1b-11e-b
Context windows used: 1
Files created/modified (exact paths)
- apps/blog/tools/import-post.js (MOD; +2 TOP entries: imageBarePTrailing, embedInBareP;
  +2 blockFromFragment branches; loop now appends EVERY element of an array return)
- apps/blog/tools/LOCKED_DECISIONS.txt (MOD; froze D-Tool-24 and D-Tool-25)
- apps/blog/HANDOFF-C1b-11e-a.md (NEW; this file)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> this file)
- apps/blog/tools/ROADMAP.md (MOD; C1b-11e-a -> Done; Next = C1b-11e-b)
Frozen decisions made in this chat
- D-Tool-24 (imageBarePTrailing): bare <p> beginning with a single <img> then
  prose -> TWO blocks: the <img> as an image and the trailing prose as a
  paragraph. Regex placed AFTER imageBarePEm, BEFORE paragraphBare; leading
  run tempered ((?:(?!<\/p>)[\s\S])*?) so the match never crosses </p>.
- D-Tool-25 (embedInBareP): bare <p> containing prose then an inline legacy
  Jetpack embed nested inside the <p> -> TWO blocks: the leading prose as a
  paragraph and the raw <iframe> as an embed. Regex placed AFTER
  imageBarePTrailing, BEFORE paragraphBare; leading run tempered.
  These are the SEVENTH and EIGHTH narrow extensions of the D-Tool-9 seam.

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=7958f41ecde2ac65ab66d85af56a251b50d651122cb8685fd7a491d3b1b52cdc
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, NOT in the handoff. See tools/WORKFLOW.md step 6.
Expected delta for the next chat
- C1b-11e-b: migrate
  `a-contemporary-history-of-the-muslim-world-part-12-saudi-arabia-and-the-arab-cold-war`
  (date 2018-04-16T09:30:30+00:00) from the live HTML (`--from html`) into
  content/en/. Expected census {image:12, paragraph:43, embed:2} (57 blocks);
  2 embeds raw `<iframe>` verbatim with `&#038;` preserved (D-Tool-21); 4
  image captions (D-Tool-22); all `*_para_leftover` = 0. Regenerate feed.json
  13 -> 14 entries (date-desc). NO LOSS_LEDGER row (no loss). The seam is
  READY (D-Tool-24/25 frozen here). Then author C1b-11f.md (next EN post).
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
8. (recurring) a 0-byte stray file appears at repo root (name like
   "^A^D...@p9N@8"); deleted before any write. Matches carried warning 7.
Deviations from locked decisions (must be empty, or explain)
- None. The seam was extended in the sanctioned way (two new D-Tool entries,
  frozen in LOCKED_DECISIONS.txt). The existing regexes (imageBareP,
  imageBarePEm, paragraphBare) are byte-identical; the only non-additive
  change is the loop now appending EVERY element when blockFromFragment
  returns an array (required by D-Tool-24/25, which yield two blocks).

  MID-MILESTONE CORRECTION (for the record): the first attempt matched the
  WHOLE mixed <p> for BOTH rules but used a plain lazy `[\s\S]*?` in
  D-Tool-25, which spanned from the first bare <p> in the body to the first
  jetpack <div>, silently swallowing 3 images and 8 paragraphs (census fell
  to {image:9,paragraph:35,embed:2}). Fixed by bounding BOTH new rules'
  leading runs with a tempered dot ((?:(?!<\/p>)[\s\S])*?) and emitting the
  trailing prose/leading prose as separate blocks. Final recon matches the
  expected {image:12,paragraph:43,embed:2} (57) exactly.
Partial work (link to PARTIAL.md if present)
- apps/blog/PARTIAL.md (C1b-11e STOP record appended; unchanged here).
Known issues / TODOs
- NO loss discovered this milestone; LOSS_LEDGER.md untouched (no new row).
- L-006 (part-8 afghanistan-1) remains deferred (seam READY); NOT resolved here.
- The tolerance note (carried from C1b-09b): the seam is now frozen through
  D-Tool-25; ANY further new class STOPS and re-scopes (its own milestone).
- part-12 is pending C1b-11e-b. remaining unmigrated series EN posts after it:
  part-11 (slug shape `-11-`, no `part-` token), part-10, part-9, part-8
  (L-006), part-7, ...-contents.
Assumptions the next chat may rely on
- The seam is frozen through D-Tool-25. D-Tool-24 (imageBarePTrailing) and
  D-Tool-25 (embedInBareP) are frozen in LOCKED_DECISIONS.txt.
- part-12's live HTML is UNCHANGED since recon (scratch dump 169674 bytes;
  entry-content length 59341). The import-post cache also holds it
  (cache sha 5aef8bbe4907...).
- Seam-READY recon of part-12 with the current seam: {image:12,paragraph:43,
  embed:2} (57), img_para_leftover = 0 AND iframe_para_leftover = 0. The 12
  images = 7 bare <p><img> (D-Tool-20) + 4 figure.wp-caption (D-Tool-22, 4
  captions) + 1 imageBarePTrailing (D-Tool-24). The 2 embeds = 1 standalone
  D-Tool-21 embed + 1 embedInBareP (D-Tool-25).
- NON-REGRESSION PROVEN: re-extraction of every cached source re-produces the
  committed content block-for-block: pilot 80 {image:15,paragraph:62,quote:2,
  table:1}; ctn 34 {image:5,paragraph:24,quote:4,footnotes:1} quote[3] len=240;
  update 2 {paragraph:2}; part-13 52; part-14 32; part-15 81; part-16 88;
  part-17 76; part-18 63; part-19 68; part-20 70; part-21 104; part-22 68 —
  ALL IDENTICAL.
- No content file was written this milestone; feed.json remains 13 entries.
Test checklist result (pass/fail per item)
- git status --porcelain clean at open: pass
- test-integrity INTEGRITY OK at open: pass
- LOCKED_DECISIONS_SHA256 = ca5e5081... at open (matches C1b-11e): pass
- imageBarePTrailing + embedInBareP TOP entries placed after imageBarePEm,
  before paragraphBare; imageBareP/imageBarePEm/paragraphBare byte-identical: pass
- blockFromFragment branches emit the EXISTING image shape / paragraph+embed
  (null/[] when nothing): pass
- loop appends every element when blockFromFragment returns an array: pass
- node --check import-post.js passes: pass
- Non-regression: pilot 80 / ctn 34 (quote[3] len=240) / update 2 /
  part-13..22 ALL IDENTICAL: pass
- part-12 re-recon {image:12,paragraph:43,embed:2} (57),
  img_para_leftover = 0 AND iframe_para_leftover = 0: pass
- D-Tool-24 + D-Tool-25 frozen in LOCKED_DECISIONS.txt: pass
- test-integrity INTEGRITY OK at close: pass
- hash-state captured: pass
Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1b-11e-a.md
- apps/blog/PARTIAL.md
- apps/blog/tools/milestones/C1b-11e-b.md (this is the next milestone's file)
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/LOSS_LEDGER.md
- apps/blog/tools/ROADMAP.md
