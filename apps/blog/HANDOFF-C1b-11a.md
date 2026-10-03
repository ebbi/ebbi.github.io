HANDOFF — Chat C1b-11a: Extend the D-Tool-9 seam with D-Tool-23 (emph-wrapped bare-<p><img>)
Status: complete
Current chat id: C1b-11a
Current milestone: C1b-11a
Completed milestones: C1a, C1-tool, C1-tool-p2, C1-model, C1-tool-cleanup, C1-tool-seam-complete, C1b-01, C1b-seam-bare-p, C1b-02, C1b-03, C1b-04, C1b-05, C1b-06, C1b-07, C1b-08, C1b-09a, C1b-09b, C1b-10, C1b-11a
Next chat id: C1b-11b
Context windows used: 1
Files created/modified (exact paths)
- apps/blog/tools/import-post.js (MOD; one TOP entry `imageBarePEm` after
  imageBareP, before paragraphBare; one blockFromFragment branch identical to
  imageBareP; +23 lines, pure additions)
- apps/blog/tools/LOCKED_DECISIONS.txt (MOD; freeze D-Tool-23 after D-Tool-22)
- apps/blog/tools/milestones/C1b-11b.md (NEW; the part-15 migration)
- apps/blog/HANDOFF-C1b-11a.md (NEW; this file)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> this file)
- apps/blog/tools/ROADMAP.md (MOD; C1b-11a -> Done; adjust Next)
Frozen decisions made in this chat
- D-Tool-23: emph-wrapped bare-<p><img> (`imageBarePEm`). The SIXTH narrow
  extension of the D-Tool-9 seam freeze. TOP entry byte-exact regex
  /<p\b(?![^>]*\bclass="[^"]*\bwp-block-)[^>]*>\s*<em>\s*<img\b[^>]*\/?>\s*<\/em>\s*<\/p>/i,
  kind "imageBarePEm", placed AFTER imageBareP (D-Tool-20) and BEFORE
  paragraphBare (D-Tool-19); blockFromFragment branch IDENTICAL to imageBareP
  ({ type:"image", src, caption:"" }, null if no src). imageBareP and
  paragraphBare regexes stay BYTE-IDENTICAL. module.exports unchanged.

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=ca5e5081f0817ac8b365095cd684b183e066096da45c1656e0714747af351f67
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, NOT in the handoff. See tools/WORKFLOW.md step 6.
Expected delta for the next chat
- C1b-11b: migrate part-15 from the LIVE HTML at the LONG canonical URL
  (https://twolegsbadblog.wordpress.com/2018/06/11/a-contemporary-history-of-the-muslim-world-part-15-the-afghan-arabs-foreign-fighters-in-afghanistan/)
  into content/en/<LONG slug>.json via --from html. Expected census
  {image:13,paragraph:67,embed:1} (81 blocks); 1 embed raw <iframe> verbatim
  with &#038; preserved (D-Tool-21); 7 wp-caption captions (D-Tool-22); all
  *_para_leftover = 0. Regenerate feed.json 10 -> 11 (date-desc); resolve L-005.
  NO seam change expected (D-Tool-23 already frozen here).
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
7. The milestone C1b-11a.md suggested regex used the canonical frozen-form
   lookahead `(?![^>]*\bclass="[^"]*\bwp-block-)"`; the user's task text
   transcribed it as `(?![^>]\bclass="[^"]\bwp-block-)"` (missing `*`
   quantifiers). The frozen-form (with `*`) is used; see Deviations.
Deviations from locked decisions (must be empty, or explain)
- DEVIATION (documented): the task text, and the milestone C1b-11a.md
  "Interfaces" block, differed by one token. Task text gave the lookahead as
  `(?![^>]\bclass="[^"]\bwp-block-)`; the milestone's own regex AND the
  existing frozen imageBareP/paragraphBare entries use
  `(?![^>]*\bclass="[^"]*\bwp-block-)`. The single-`[^>]` form does NOT match
  the real part-15 fragment (measured: 0 matches) because one char cannot
  span `<p style="text-align:justify;">`; the frozen form matches exactly 1
  (measured). Used the frozen form for byte-consistency with D-Tool-19/D-Tool-20
  and because the Task Requirements state imageBareP/paragraphBare must stay
  BYTE-IDENTICAL and the entry derives from that frozen form. No D-Tool-19/
  D-Tool-20 behaviour change; pure additions to import-post.js.
Partial work (link to PARTIAL.md if present)
- apps/blog/PARTIAL.md (the C1b-11 STOP record; historical, unchanged).
Known issues / TODOs
- SLUG CORRECTION (carried from C1b-11): part-15's canonical slug is the LONG
  a-contemporary-history-of-the-muslim-world-part-15-the-afghan-arabs-foreign-fighters-in-afghanistan
  (not ...part-15-the-afghan-arabs, which 301-redirects). C1b-11b uses the LONG slug.
- L-005 stays deferred at THIS milestone's close (resolved in C1b-11b).
- L-006 (part-8) remains deferred (seam READY). part-13's slug carries a
  `protected-` prefix (protected WP.com post) — verify fetchability when its
  milestone arrives.
Assumptions the next chat may rely on
- The seam through D-Tool-23 is frozen. D-Tool-23 is now the SIXTH extension.
- pilot/ctn/update/part-16..22 content files are byte-identical to their
  pre-C1b-11a committed files (no content file was written this milestone).
- feed.json is 10 entries, date-desc (unchanged).
- No content file for part-15 exists yet.
- The part-15 live HTML is cached (192126 bytes); a read-only re-recon yields
  {image:13,paragraph:67,embed:1} (81) with img_para_leftover = 0.
Test checklist result (pass/fail per item)
- git status --porcelain clean at open: pass
- test-integrity INTEGRITY OK at open: pass
- LOCKED_DECISIONS_SHA256 = a218f137... at open: pass
- import-post.js: imageBarePEm TOP entry after imageBareP, before
  paragraphBare; imageBareP/paragraphBare byte-identical (diff = +23 pure
  additions): pass
- blockFromFragment imageBarePEm branch identical to imageBareP: pass
- node --check import-post.js: pass
- Non-regression: pilot 80 / ctn 34 (quote[3] len=240) / update 2 /
  part-16..22 all unchanged: pass
- part-15 re-recon {image:13,paragraph:67,embed:1} (81), img_para_leftover=0: pass
- D-Tool-23 frozen in LOCKED_DECISIONS.txt: pass
- test-integrity INTEGRITY OK at close: pass
- hash-state.js captured: pass
Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1b-11a.md
- apps/blog/PARTIAL.md
- apps/blog/tools/milestones/C1b-11b.md
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/LOSS_LEDGER.md
- apps/blog/tools/ROADMAP.md
