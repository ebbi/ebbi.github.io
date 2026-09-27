# HANDOFF - Chat W1: Adopt workflow fix (b); pointer; document workflow

**Status:** complete
**Current chat id:** W1
**Current milestone:** W1
**Completed milestones:** 00, 01, 02, 03, 04, 05a, 05a-fix, 05b-removal, W1
**Next chat id:** 06
**Context windows used:** 1

## Files created/modified

- **Created:** `apps/blog/tools/WORKFLOW.md`
- **Created:** `apps/blog/HANDOFF-CURRENT.txt`
- **Created:** `apps/blog/tools/milestones/W1.md`
- **Created:** `apps/blog/HANDOFF-W1.md` (this file)
- **Created:** `apps/blog/tools/milestones/06.md`
- **Modified:** `apps/blog/tools/CONTEXT.md` (hash block to inputs only;
  milestone-file schema with mandatory Interfaces; rule 0 names
  HANDOFF-CURRENT.txt)

## Frozen decisions made in this chat

- **W1-D1:** Handoff hash block records inputs only
  (`LOCKED_DECISIONS_SHA256`, `CONTENT_EN_..._SHA256`, `SCHEMA_SHA256`
  when present). `GIT_HEAD`, `GIT_DIRTY`, `FILE_TREE_SHA256` record in
  the commit-message body.
- **W1-D2:** `apps/blog/HANDOFF-CURRENT.txt` is the first file every chat
  reads; one line; overwritten each milestone.
- **W1-D3:** Milestone files must contain a filled Interfaces section.
- **W1-D4:** The next milestone file is authored at the close of the
  current one.

## Hashes

- `LOCKED_DECISIONS_SHA256=57441c6bb8fc1e19044bc9b0ce44d1f67ec4ee1c71305289c97237067e9a0b86`
- `CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=1d6b6a91693c712a5116b452a4ac9a5172a558ba2cb8c48cb87e805ff9d54d27`
- `SCHEMA_SHA256=` OMITTED (Option 2 - no tools/schema.json)

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) are in the
commit-message body, per W1-D1. First handoff under the new schema.

## Expected delta for the next chat

- Milestone 06 builds the header + language switcher, navigation-only.
- Future milestone files follow the CONTEXT.md schema, with a filled
  Interfaces section; authored at each chat's close.

## Human edits made outside tooling

- None to tracked files. One human-applied probe line (`<!-- W1 PROBE -->`)
  was added to CONTEXT.md to diagnose a failed full-file apply, then
  removed. Net effect: none.

## Open warnings

- 1: `apps/blog/tools/ROADMAP.md` does not exist; WORKFLOW.md step 7
  references it. Resolve before 07.

## Deviations from locked decisions

- None.

## Partial work

- None.

## Blocked reason

- N/A

## Known issues / TODOs

- Apply-the-small-block lesson: large full-file replacements of existing
  files failed to apply repeatedly; smaller re-emits and terminal
  heredocs succeeded. Prefer heredoc or one-file-at-a-time for large
  modifies.
- `router.js` hardcodes the RTL language set (`["fa","ar","ur","he"]`);
  not recorded in LOCKED_DECISIONS.txt. Promote in a future milestone.
- ROADMAP.md missing (see Open warnings).

## Assumptions the next chat may rely on

- Handoff hash block = inputs only. Do not look for GIT_HEAD here.
- HANDOFF-CURRENT.txt points at `apps/blog/HANDOFF-W1.md`.
- Milestone-file schema (Interfaces mandatory) is canonical.

## Test checklist result

- test-integrity.js: PASS
- CONTEXT.md three edits present: PASS
- HANDOFF-CURRENT.txt one line: PASS (after printf newline fix)
- git status shows exactly the W1 file set: PASS
- hash-state inputs captured: PASS

## Files to read in the next chat (exact paths)

- `apps/blog/HANDOFF-CURRENT.txt`
- `apps/blog/tools/CONTEXT.md`
- `apps/blog/tools/LOCKED_DECISIONS.txt`
- `apps/blog/tools/WORKFLOW.md`
- `apps/blog/tools/milestones/06.md`
- `apps/blog/HANDOFF-W1.md`
