# Milestone W1-fix: Create ROADMAP.md; harden WORKFLOW.md step 6

## Scope fence (read first)

Micro-milestone. Tooling/docs only; no runtime code. It (1) creates the
ROADMAP.md that WORKFLOW.md step 7 references (fixing a dangling
reference left by W1), and (2) corrects WORKFLOW.md step 6 to show the
safe commit-message form, because W1's own commit body was flattened to
one line by shell quoting and we chose NOT to amend history.

## Objective

1. Create apps/blog/tools/ROADMAP.md: status + depends-on per item, plus
   the cross-cutting facts block. Terse; expected to be reordered.
2. Amend WORKFLOW.md step 6 to (a) show the safe multi-flag commit form,
   and (b) state that a flattened one-line body is acceptable and how to
   parse it (grep -o rather than grep '^KEY=').

## Interfaces (mandatory)

### New: apps/blog/tools/ROADMAP.md
Non-executable document. Read at WORKFLOW.md step 7. Sections: Done, Now,
Next, Deferred, Cross-cutting facts. Status vocabulary: done|now|next|deferred.

### Modified: apps/blog/tools/WORKFLOW.md
Step 6 only. No other section changes. No new executable surface.

## Files to Create

1. apps/blog/tools/milestones/W1-fix.md (this file)
2. apps/blog/tools/ROADMAP.md
3. apps/blog/HANDOFF-W1-fix.md

## Files to Modify

1. apps/blog/tools/WORKFLOW.md (step 6)
2. apps/blog/HANDOFF-CURRENT.txt (step 5)

## Files I will NOT touch

- apps/blog/assets/**
- apps/blog/index.html
- apps/blog/tools/parser.js, fetcher.js, generate-index.js, hash-state.js,
  test-integrity.js
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/milestones/06.md
- apps/blog/assets/data/posts.json, feed.json
- Anything outside apps/blog/

## Decisions frozen for this milestone

- **W1F-D1:** ROADMAP.md is a living document; reordering is expected and
  is not a deviation.
- **W1F-D2:** The commit-message body convention permits a single-line
  body; consumers must use `grep -o`, not `grep '^KEY='`. Preferred form
  is separate `-m` flags.
- **W1F-D3:** No history rewrite for W1's flattened body.

## Test Checklist

1. node apps/blog/tools/test-integrity.js -> INTEGRITY OK
2. wc -l apps/blog/HANDOFF-CURRENT.txt -> 1
3. grep -n "ROADMAP" apps/blog/tools/WORKFLOW.md -> reference resolves to
   an existing file (ls apps/blog/tools/ROADMAP.md succeeds)
4. node apps/blog/tools/hash-state.js -> capture inputs + FILE_TREE_SHA256
5. git status -> exactly the W1-fix file set

## Known issues the next chat must NOT mistake for bugs

- ROADMAP.md order is a plan, not a contract; later milestones may
  reorder it. Only the current milestone file is authoritative for a chat.
