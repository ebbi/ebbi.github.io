cat > apps/blog/HANDOFF-W1-fix.md <<'EOF'

# HANDOFF - Chat W1-fix: Create ROADMAP.md; harden WORKFLOW.md step 6

**Status:** complete
**Current chat id:** W1-fix
**Current milestone:** W1-fix
**Completed milestones:** 00, 01, 02, 03, 04, 05a, 05a-fix, 05b-removal, W1, W1-fix
**Next chat id:** 06
**Context windows used:** 1

## Files created/modified

- **Created:** apps/blog/tools/ROADMAP.md
- **Created:** apps/blog/tools/milestones/W1-fix.md
- **Created:** apps/blog/HANDOFF-W1-fix.md (this file)
- **Modified:** apps/blog/tools/WORKFLOW.md (step 6 safe commit form;
  step 7 confirms ROADMAP.md exists; note preferring heredoc for large
  creates/rewrites)
- **Modified:** apps/blog/HANDOFF-CURRENT.txt (points at this handoff)

## Frozen decisions made in this chat

- **W1F-D1:** ROADMAP.md is a living document; reordering is expected and
  is not a deviation.
- **W1F-D2:** The commit-message body convention permits a single-line
  body; consumers parse with grep -o, not grep '^KEY='. Preferred form is
  separate -m flags.
- **W1F-D3:** No history rewrite for W1's flattened body.

## Hashes

- LOCKED_DECISIONS_SHA256=57441c6bb8fc1e19044bc9b0ce44d1f67ec4ee1c71305289c97237067e9a0b86
- CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=1d6b6a91693c712a5116b452a4ac9a5172a558ba2cb8c48cb87e805ff9d54d27
- SCHEMA_SHA256= OMITTED (Option 2 - no tools/schema.json)

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) are in the
commit-message body, per W1-D1 from W1.

## Expected delta for the next chat

- Milestone 06 builds the header + language switcher (navigation-only),
  authored already in apps/blog/tools/milestones/06.md.
- ROADMAP.md now exists; WORKFLOW.md step 7's reference resolves.

## Human edits made outside tooling

- None. (An empty-diff stat flag on tools/milestones/06.md appeared in
  git status and was cleared by git update-index --refresh; no content
  change. Recorded so it is not mistaken for a scope violation.)

## Open warnings

- 0.

## Deviations from locked decisions

- None.

## Partial work

- None.

## Blocked reason

- N/A

## Known issues / TODOs

- ROADMAP.md ordering is a plan, not a contract; only the current
  milestone file is authoritative per chat.
- router.js still hardcodes the RTL set; not in LOCKED_DECISIONS.txt
  (carried from W1; promote in a future tooling milestone).

## Assumptions the next chat may rely on

- Handoff hash block = inputs only; GIT_HEAD/GIT_DIRTY/FILE_TREE_SHA256
  live in the commit body.
- HANDOFF-CURRENT.txt points at apps/blog/HANDOFF-W1-fix.md.
- Milestone-file schema (Interfaces mandatory) is canonical.
- 06.md is authored, staged, and unchanged since its commit.

## Test checklist result

- test-integrity.js: PASS (INTEGRITY OK)
- HANDOFF-CURRENT.txt one line: PASS
- ROADMAP reference in WORKFLOW.md resolves: PASS
- git status exactly the W1-fix file set: PASS
- hash-state inputs captured: PASS

## Files to read in the next chat (exact paths)

- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/ROADMAP.md
- apps/blog/tools/milestones/06.md
- apps/blog/HANDOFF-W1-fix.md
  EOF
  wc -c apps/blog/HANDOFF-W1-fix.md
  head -3 apps/blog/HANDOFF-W1-fix.md
