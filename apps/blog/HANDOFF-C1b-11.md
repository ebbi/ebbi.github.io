HANDOFF — Chat C1b-11: Migrate part-15 (the Afghan Arabs) — STOPPED, re-scoped
Status: blocked
Current chat id: C1b-11
Current milestone: C1b-11
Completed milestones: C1a, C1-tool, C1-tool-p2, C1-model, C1-tool-cleanup, C1-tool-seam-complete, C1b-01, C1b-seam-bare-p, C1b-02, C1b-03, C1b-04, C1b-05, C1b-06, C1b-07, C1b-08, C1b-09a, C1b-09b, C1b-10
Next chat id: C1b-11a
Context windows used: 1
Files created/modified (exact paths)
- apps/blog/PARTIAL.md (NEW; STOP record + recon facts)
- apps/blog/tools/milestones/C1b-11a.md (NEW; re-scope: seam extension D-Tool-23)
- apps/blog/tools/ROADMAP.md (C1b-11 -> blocked/split; C1b-11a next)
- apps/blog/HANDOFF-CURRENT.txt (pointer -> this file)
- apps/blog/HANDOFF-C1b-11.md (this file)
Frozen decisions made in this chat
- None. No LOCKED_DECISIONS change. The new class (imageBarePEm) is frozen
  as D-Tool-23 in C1b-11a, its own milestone.
Blocked reason
- Recon for part-15 revealed a NEW structural class: a bare <p> whose entire
  content is a single <em>-wrapped <img> (source of the legacy markdown
  _![alt](src)_ image), e.g.
  <p style="text-align:justify;"><em><img data-attachment-id="11456" ...></em></p>.
  The frozen seam (D-Tool-9..D-Tool-22) does NOT represent it: D-Tool-20
  imageBareP requires the <img> to be the SOLE child of the <p>, so the <em>
  wrapper defeats it and D-Tool-19 paragraphBare captures it as a paragraph,
  leaving raw <img> markup as text (L-009 defect shape). This would make
  img_para_leftover = 1 (not 0). Milestone C1b-11's Scope Fence mandates
  "If a NEW structural class appears, STOP and re-scope (its own milestone)."
  Per user approval (Option A), this chat STOPPED and authored C1b-11a.

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=a218f137091572516ff297f836fd071e52159724864eb1e098ecbd0c3662c2dc
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, NOT in the handoff. See tools/WORKFLOW.md step 6.
Expected delta for the next chat
- C1b-11a: extend the D-Tool-9 seam with ONE TOP entry (imageBarePEm, placed
  after imageBareP and before paragraphBare) + a blockFromFragment branch
  identical to imageBareP; freeze D-Tool-23 in LOCKED_DECISIONS.txt; verify
  non-regression (pilot 80; ctn 34 quote[3] len=240; update 2; part-16..22
  unchanged) and re-recon part-15 to {image:13,paragraph:67,embed:1} (81) with
  img_para_leftover = 0. NO slug migrated, feed.json unchanged, LOSS_LEDGER
  untouched. Author C1b-11b.md at close.
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
7. A 0-byte stray file appeared at repo root AGAIN from a shell mangling this
   chat; removed before close (same as C1b-09a/09b/10 warning 7).
Deviations from locked decisions (must be empty, or explain)
- None. No locked decision was violated; the STOP is the fence working as
  designed. The only new "decision" (imageBarePEm/D-Tool-23) is DEFERRED to
  C1b-11a.
Partial work (link to PARTIAL.md if present)
- apps/blog/PARTIAL.md (STOP record, recon facts, slug-discrepancy note).
Known issues / TODOs
- SLUG CORRECTION: the milestone + ROADMAP recorded the WRONG (redirecting)
  slug ...part-15-the-afghan-arabs. The canonical live slug (HTTP 200, and
  what posts.json carries) is the LONG one:
  a-contemporary-history-of-the-muslim-world-part-15-the-afghan-arabs-foreign-fighters-in-afghanistan.
  import-post.js derives slug from the URL, so recon used the canonical URL.
  C1b-11b MUST use the LONG slug for the content filename.
- part-15 recon census {image:12,paragraph:68,embed:1} (81): 12 images =
  7 figure.wp-caption (D-Tool-22, all 7 captioned) + 5 bare <p><img>
  (D-Tool-20) + the 1 new emph-wrapped image (C1b-11a). 1 embed
  (idx 77), raw <iframe> verbatim with &#038; preserved (D-Tool-21).
  L-005 was "(count TBD at recon)" -> count = 1 embed.
- L-005 remains deferred (NOT resolved this chat; resolved in C1b-11b).
- L-006 (part-8) remains deferred (seam READY).
- part-13's slug carries a `protected-` prefix (protected WP.com post) —
  verify fetchability when its milestone arrives.
Assumptions the next chat may rely on
- The D-Tool-9 seam through D-Tool-22 is frozen and UNCHANGED by this chat.
- pilot, controlling-the-narrative, update, part-16..22 are byte-identical
  to their pre-C1b-11 committed files (true non-regression; no content
  file was written or re-migrated this chat).
- feed.json is 10 entries, date-desc (unchanged).
- No content file for part-15 exists yet.
Test checklist result (pass/fail per item)
- git status --porcelain clean at open: pass
- test-integrity INTEGRITY OK at open: pass
- slug/title/date confirmed from posts.json AND live post: pass (LONG slug;
  short URL 301-redirects)
- Recon part-15 executed: pass -> {image:12,paragraph:68,embed:1} (81);
  embed verbatim (&#038; preserved); 7 wp-caption captions
- All *_para_leftover = 0: FAIL -> img_para_leftover = 1 (NEW class) => STOP
- Content file / feed.json / LOSS_LEDGER / LOCKED_DECISIONS changes: N/A
  (not attempted; fence trip)
- test-integrity INTEGRITY OK at close: pass
- hash-state.js captured: pass
Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1b-11.md
- apps/blog/PARTIAL.md
- apps/blog/tools/milestones/C1b-11a.md
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/LOSS_LEDGER.md
- apps/blog/tools/ROADMAP.md
