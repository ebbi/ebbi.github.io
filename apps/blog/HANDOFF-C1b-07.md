HANDOFF — Chat C1b-07: Migrate part-19 (Bosnia #1) from the live HTML
Status: complete
Current chat id: C1b-07
Current milestone: C1b-07
Completed milestones: C1a, C1-tool, C1-tool-p2, C1-model, C1-tool-cleanup, C1-tool-seam-complete, C1b-01, C1b-seam-bare-p, C1b-02, C1b-03, C1b-04, C1b-05, C1b-06, C1b-07
Next chat id: C1b-08
Context windows used: 1
Files created/modified (exact paths)
  - apps/blog/content/en/a-contemporary-history-of-the-muslim-world-part-19-bosnia-1.json (NEW)
  - apps/blog/assets/data/feed.json (6 -> 7 entries)
  - apps/blog/tools/ROADMAP.md (C1b-07 -> Done; removed from Next)
  - apps/blog/HANDOFF-CURRENT.txt (pointer -> this file)
  - apps/blog/HANDOFF-C1b-07.md (this file)
  - apps/blog/tools/milestones/C1b-08.md (authored at close, WORKFLOW step 7)
Frozen decisions made in this chat
  - None. No new seam class surfaced, so no D-Tool-21; the D-Tool-9 seam
    (through D-Tool-20) is consumed unchanged. Interfaces section of
    tools/milestones/C1b-07.md was present and intentionally EMPTY.

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=ae06f1182c298543235ab8d02a0fdd1c30f91d0321de61ee0ac69444c38f3b6a
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, NOT in the handoff. See tools/WORKFLOW.md step 6.
Expected delta for the next chat
  - One new content file:
    content/en/a-contemporary-history-of-the-muslim-world-part-18-algeria-3.json
  - feed.json 7 -> 8 entries
  - ROADMAP: C1b-08 -> Done; C1b-09 authored at close
Human edits made outside tooling (structured)
  - None reported.
Open warnings (count + links only)
  1. tools/*.md whitespace does not survive chat copy; anchor edits from
     `cat -A`. (carried from C1b-03/C1b-04)
  2. Edit splice pitfall: insert AT header index / above a guaranteed blank
     line; verify POSITIONALLY, not by substring. (carried from C1b-04)
  3. Stale "## The commit" line in HANDOFF-C1b-seam-bare-p.md (points at
     50ffad5; true C1b-03 HEAD was 5ab2656d) — still unfixed, outside fences.
  4. LOSS_LEDGER.md table padding mixed (L-001..L-008 aligned; L-009/L-010
     minimal) — cosmetic.
  5. NEW (process, not data): this chat initially routed every shell command
     to the human for manual paste; the human asked to run directly instead.
     All recon/verify commands were ultimately executed in the terminal. No
     data impact.
Deviations from locked decisions (must be empty, or explain)
  - None.
Partial work (link to PARTIAL.md if present)
  - None.
Blocked reason (only if Status: blocked)
  - N/A.
Known issues / TODOs
  - L-010 (generate-index.js buildExcerpt does not strip HTML tags) does NOT
    recur for part-19: its first paragraph (#1) is plain prose, feed excerpt
    head 'The ostensible purpose of this blog has always been to chronicle…'.
    Still deferred, not fixed here (generate-index.js fence-excluded).
  - The milestone file specifies no census for part-19 itself (only the
    non-regression slugs). Observed census {image:3,paragraph:51}, 54 blocks;
    no residual img markup in paragraphs (img_para_leftover=0).
  - part-19 contains ONE verbatim spacer paragraph: block #45, len=6,
    content "&nbsp;". This is faithful to the live HTML and is preserved
    verbatim per D-Tool-16 (no general entity decoder for body text);
    renderer.js uses textContent so it renders as a blank line. NOT a loss.
  - part-19's first block (#0) is an image, not a lead paragraph; the lead
    prose paragraph is #1. Recon initially looked empty because it probed
    blocks[0].content (undefined for image) — no defect.
  - C1b-08 slug confirmed from on-disk metadata (posts.json): part-18 is
    Algeria #3 (date 2018-11-02) — NOT "bosnia-2". Series naming is irregular.
Assumptions the next chat may rely on
  - The D-Tool-9 seam through D-Tool-20 is frozen and unchanged by C1b-07.
  - part-19 content file is verbatim faithful from the live HTML
    (`--from html`); census {image:3,paragraph:51}, 54 blocks;
    round-trip byte-identical to recon (blocks/title/date all equal).
  - feed.json is the derived list index; 7 entries, date-desc.
Test checklist result (pass/fail per item)
  - Recon blocks=54 {image:3,paragraph:51}, img_para_leftover=0: pass
  - Content file written, canonical keys [slug,lang,title,date,blocks]: pass
  - Content census round-trip == recon (byte-identical): pass
  - generate-index 7 entries, date-desc, part-19 placed at index 5 (between
    part-20 2019-11-28 and update 2017-11-01): pass
  - Non-regression pilot 80 / ctn 34 (quote[3] len=240) / update 2 /
    part-22 59 / part-21 87 / part-20 60 / part-19 54: pass
  - test-integrity.js INTEGRITY OK: pass
  - hash-state.js captured: pass
Files to read in the next chat (exact paths)
  - apps/blog/HANDOFF-CURRENT.txt
  - apps/blog/HANDOFF-C1b-07.md
  - apps/blog/tools/milestones/C1b-08.md
  - apps/blog/tools/CONTEXT.md
  - apps/blog/tools/LOCKED_DECISIONS.txt
  - apps/blog/tools/LOSS_LEDGER.md
  - apps/blog/tools/ROADMAP.md
