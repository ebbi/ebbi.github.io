HANDOFF — Chat C1-tool: Build apps/blog/tools/import-post.js (Part 1)

Status: partial
Current chat id: C1-tool
Current milestone: C1-tool
Completed milestones: 00,01,02,03,04,05a,05a-fix,05b-removal,W1,W1-fix,
  06,06b,07,08,09,C1a
Next chat id: C1-tool-p2
Context windows used: 1

## Files created/modified (exact paths)

- Created: apps/blog/tools/import-post.js
- Created: apps/blog/tools/milestones/C1-tool.md
- Created: apps/blog/HANDOFF-C1-tool.md (this file)
- Modified: apps/blog/HANDOFF-CURRENT.txt (points at this handoff)
- Modified: apps/blog/tools/ROADMAP.md (C1-tool inserted; C1b -> series)
- Modified: apps/blog/tools/milestones/C1b.md (SUPERSEDED header only)

## Frozen decisions made in this chat

- D-Tool-1..8 as listed in milestones/C1-tool.md.
- D-Tool-9  Extraction seam frozen: extractFromPostsJson() and
            extractHtmlBlocks(). A future chat replaces ONLY
            extractHtmlBlocks().
- D-Tool-10 Part 1 does NOT claim HTML extraction works. --from html
            intentionally exits non-zero until Part 2.
- D-Tool-11 --dump-html <path> is the sanctioned way to produce the
            Part 2 input; exits 0; never parses.

## Hashes (inputs only — see tools/WORKFLOW.md, convention (b))

LOCKED_DECISIONS_SHA256=57441c6bb8fc1e19044bc9b0ce44d1f67ec4ee1c71305289c97237067e9a0b86
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=071d1fe7dc762397e389c22ec036f7092aac6dc67c0458e6f130b1d4aa5a5c4e
SCHEMA_SHA256= OMITTED (Option 2 — no tools/schema.json)

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, per WORKFLOW.md step 6.

## Expected delta for the next chat

- Part 2 (C1-tool-p2): implement extractHtmlBlocks() ONLY, then prove
  --from html reproduces the pilot (blocks.length === 30; diff empty).
  Input: the raw WP response produced by Test item 0
  (--dump-html /tmp/pilot.html; 203,941 bytes this run). Reading order:
  HANDOFF-CURRENT.txt -> HANDOFF-C1-tool.md -> tools/milestones/C1-tool.md
  (Part 2 items).

## Human edits made outside tooling (structured)

- Maintainer confirmed posts.json is intact (20 posts) and NOT
  truncated; earlier truncation was upload-only.
- Maintainer confirmed content/en/jews-in-palestine-before-israel.json
  is complete (7374 bytes, 30 blocks, no excerpt). The "only the
  excerpt" observation was the LIST view, not the data.
- Maintainer confirmed delete-deferral: posts.json is not deleted until
  C1b-DONE proves 20/20.
- Maintainer chose "separate": build C1-tool before the C1b series.
- Maintainer approved the split into Part 1 (this chat) and Part 2
  (next chat, gated on raw HTML).
- Maintainer requested the --dump-html convenience flag (D-Tool-11).
- Maintainer uses heredoc delivery (VS Code apply is unreliable here).
- STRAY (resolved): apps/blog/tools/import-post.md — a duplicate/older
  draft of the milestone file, mis-saved at tools/ by the VS Code apply

## Open warnings (count + links only)

- W1. .gitignore existence unverified; tools/.cache/ may show as
  untracked. Not auto-created. Link: milestones/C1-tool.md.
- W2. hash-state.js output keys unverified; hash block filled at
  handoff time.
- W3. apps/blog/tools/import-post.md present, unlisted in Files to
  Create. Left untracked pending maintainer decision (keep or rm).

## Deviations from locked decisions

- Deviation C1-tool-D1 (mine, disclosed): Part 1 ships the envelope
  and the seam, not a working HTML extractor. Cause: the raw WP HTML
  was never in context, and writing an extractor against an unseen DOM
  is the C1a-P0 failure class. Documented in C1-tool.md (D-Tool-10) and
  the Test Checklist (item 6 expected-to-fail). Reported, not hidden.

## Partial work

- Extraction seam is live; extractHtmlBlocks() is the Part 2 todo.
  No PARTIAL.md (status partial is milestone-shaped, not budget).

## Blocked reason

- Not blocked. Part 2 is gated on an input (raw HTML), not a decision.

## Known issues / TODOs

- --from html intentionally unimplemented (D-Tool-10).
- posts.json read by the posts-json strategy; NOT deleted (deferral).
- C1b.md is SUPERSEDED; the series files (C1b-01..19, C1b-DONE) are
  authored at the close of C1-tool-p2, not now.
- test-integrity.js does not cover import-post.js, content/, or
  tools/.cache/.

## Assumptions the next chat may rely on

- Extraction seam is frozen (D-Tool-9). Part 2 replaces ONLY the body
  of extractHtmlBlocks().
- Output shape is C1a-locked; NO excerpt.
- posts.json stays on disk until C1b-DONE.
- Host allowlist defaults to twolegsbadblog.wordpress.com; https only.

## Test checklist result (pass/fail per item)

0. --dump-html writes /tmp/pilot.html (203941 bytes): PASS
1. node --check import-post.js: PASS
2. --help prints usage (incl. --dump-html): PASS
3. --from posts-json --slug jews-... --out /tmp/pilot.json: PASS
4. shape (slug/lang/blocks/excerpt): PASS — juifs... en 30 false
5. diff /tmp/pilot.json vs content/en/...: PASS — DIFF EMPTY
6. --from html -> non-zero "not implemented yet": PASS (by design)
7. test-integrity.js INTEGRITY OK: PASS
8. git status --porcelain == file set: PENDING (stray .md + close
   files not yet applied at test time)

## Files to read in the next chat (exact paths)

- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1-tool.md
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/ROADMAP.md
- apps/blog/tools/milestones/C1-tool.md
- apps/blog/tools/import-post.js
- apps/blog/content/en/jews-in-palestine-before-israel.json (reference)
- **the raw WP response** produced by Test item 0:
  attach @/tmp/pilot.html (or re-run --dump-html in C1-tool-p2)
