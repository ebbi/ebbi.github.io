HANDOFF — Chat C1b-11e: Migrate part-12 (Saudi Arabia and the Arab cold war)
Status: partial
Current chat id: C1b-11e
Current milestone: C1b-11e
Completed milestones: C1a, C1-tool, C1-tool-p2, C1-model, C1-tool-cleanup, C1-tool-seam-complete, C1b-01, C1b-seam-bare-p, C1b-02, C1b-03, C1b-04, C1b-05, C1b-06, C1b-07, C1b-08, C1b-09a, C1b-09b, C1b-10, C1b-11, C1b-11a, C1b-11b, C1b-11c, C1b-11d, C1b-11e (partial/STOP — re-scoped)
Next chat id: C1b-11e-a
Context windows used: 1
Files created/modified (exact paths)
- apps/blog/tools/milestones/C1b-11e-a.md (NEW; the re-scope seam-extension plan: D-Tool-24 + D-Tool-25)
- apps/blog/tools/milestones/C1b-11e-b.md (NEW; the part-12 migration plan)
- apps/blog/PARTIAL.md (MOD; appended the C1b-11e STOP record; C1b-11 section intact)
- apps/blog/HANDOFF-C1b-11e.md (NEW; this file)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> this file)
- apps/blog/tools/ROADMAP.md (MOD; C1b-11e STOP + re-scope status)
Frozen decisions made in this chat
- None. NO seam change; the seam is frozen through D-Tool-23 (C1b-11a).
  This chat STOPPED at recon (two new structural classes; re-scoped).

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=ca5e5081f0817ac8b365095cd684b183e066096da45c1656e0714747af351f67
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, NOT in the handoff. See tools/WORKFLOW.md step 6.
Expected delta for the next chat
- C1b-11e-a: extend the D-Tool-9 seam with TWO entries (the seventh and
  eighth narrow extensions) so part-12 is representable:
  - D-Tool-24 `imageBarePTrailing`: bare <p> beginning with a single <img>
    then prose -> emit the leading <img> as an image block; the trailing
    prose is claimed by paragraphBare on the next loop turn.
  - D-Tool-25 `embedInBareP`: bare <p> containing prose then an inline
    legacy Jetpack embed nested inside the <p> -> emit the leading prose as
    a paragraph AND the raw <iframe> as an embed block (blockFromFragment
    returns two blocks; minimal loop accommodation).
  Freeze BOTH in LOCKED_DECISIONS.txt. NO slug migrated; feed.json unchanged
  (13 entries); LOSS_LEDGER untouched. Re-recon part-12 must yield
  {image:12,paragraph:43,embed:2} (57) with img_para_leftover = 0 AND
  iframe_para_leftover = 0, plus non-regression (pilot 80; ctn 34; update 2;
  part-13..22 unchanged). Then C1b-11e-b migrates part-12 (feed.json 13 -> 14).
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
- None. This chat performed no seam change; it STOPPED per the C1b-11e Scope
  Fence (TWO new structural classes) and re-scoped into C1b-11e-a + C1b-11e-b.
Partial work (link to PARTIAL.md if present)
- apps/blog/PARTIAL.md (now holds the C1b-11e STOP record, appended after the
  historical C1b-11 STOP section).
Known issues / TODOs
- STOP triggered: part-12's live HTML contains TWO classes the seam
  (D-Tool-9..23) does not represent; both make a *_para_leftover non-zero.
  Recorded in PARTIAL.md; re-scoped into C1b-11e-a (seam) + C1b-11e-b (migration).
- NO loss discovered this milestone; LOSS_LEDGER.md untouched (no new row).
- L-006 (part-8 afghanistan-1) remains deferred (seam READY); NOT resolved here.
- part-12's canonical URL is HTTP 200 (checked; no redirect); no `protected-`
  prefix. posts.json carries slug
  a-contemporary-history-of-the-muslim-world-part-12-saudi-arabia-and-the-arab-cold-war,
  date 2018-04-16T09:30:30+00:00, title identical to the live post.
- remaining unmigrated series EN posts: part-11 (slug shape `-11-`, no
  `part-` token), part-10, part-9, part-8 (L-006), part-7, ...-contents.
  part-12 is pending C1b-11e-a -> C1b-11e-b.
Assumptions the next chat may rely on
- The seam through D-Tool-23 is frozen; D-Tool-24 and D-Tool-25 are NOT yet
  frozen (they are authored in C1b-11e-a).
- part-12's live HTML is UNCHANGED since this recon (scratch dump 169674 bytes;
  entry-content length 59341).
- TWO new structural classes were found (exactly ONE occurrence each):
  Class A imageBarePTrailing (entry-content offset ~3) and Class B
  embedInBareP (offset ~15319, len=654). The second jetpack wrapper (offset
  ~44134) is STANDALONE and already handled by D-Tool-21.
- Recon census with the current seam: {paragraph:43,image:11,embed:1} (55),
  img_para_leftover=1, iframe_para_leftover=1 (NOT seam-READY).
- Source-of-record recon counts: total <img>=12, bare <p><img></p>=7,
  figure.wp-caption=4, emph-wrapped=0; total <iframe>=2, jetpack wrapper=2.
- pilot/ctn/update/part-13..22 content files are byte-identical to their
  pre-C1b-11e committed files (verified: git status shows only the new/mod
  doc files, no content file).
- feed.json is 13 entries, date-desc (unchanged this chat).
Test checklist result (pass/fail per item)
- git status --porcelain clean at open: pass
- test-integrity INTEGRITY OK at open: pass
- LOCKED_DECISIONS_SHA256 = ca5e5081... at open (matches C1b-11d): pass
- part-12 canonical URL confirmed fetchable (HTTP 200, entry-content): pass
- slug/title/date confirmed from live post AND posts.json: pass
- recon census measured (no count pre-committed): pass
- STOP: TWO new structural classes -> re-scope (its own milestone): TRIGGERED
- no content/regen/decision writes at stop: pass
- no loss -> LOSS_LEDGER.md untouched: pass
- repo clean at close: pass (stray 0-byte file removed)
Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1b-11e.md
- apps/blog/PARTIAL.md
- apps/blog/tools/milestones/C1b-11e-a.md
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/LOSS_LEDGER.md
- apps/blog/tools/ROADMAP.md
