# Zabon Blog — Per-Milestone Workflow (reference)

Introduced by milestone W1. Supersedes the ad-hoc sequence implied by
HANDOFF-05a / 05a-fix / 05b-removal. Read with CONTEXT.md; CONTEXT.md
precedence still governs (LOCKED_DECISIONS.txt > CONTEXT.md > milestone
file). If this file and CONTEXT.md disagree, CONTEXT.md wins — fix this
file.

## Convention (workflow fix (b))

- The **handoff hash block records inputs only**:
  `LOCKED_DECISIONS_SHA256`, `CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256`,
  and `SCHEMA_SHA256` when `apps/blog/tools/schema.json` exists.
  These do not depend on the commit, or on the handoff's own presence in
  the tree. The block is stable: capture it once, before staging.
- The **commit-message body carries the volatile facts**:
  `GIT_HEAD` (parent SHA), `GIT_DIRTY`, `FILE_TREE_SHA256`.
- Consequence: the multi-step hash dance (stage → hash → re-stage →
  commit → hash again) that 05b-removal required is gone. There is no
  second pass. `GIT_DIRTY=true` at commit time is the expected and final
  value for that milestone, because those facts live in the commit.

## Pointer file

`apps/blog/HANDOFF-CURRENT.txt` contains exactly one non-empty line: the
workspace-relative path of the most recent handoff. Each milestone
overwrites it. It is the first thing every chat reads, so the reading
list is never ambiguous or stale.

## Files in every cycle

Per milestone `<id>` (e.g. `06`):

| File                                   | New/Mod                          | Purpose                                        |
| -------------------------------------- | -------------------------------- | ---------------------------------------------- |
| `apps/blog/tools/milestones/<id>.md`   | new                              | The plan. Authoritative for this chat.         |
| `apps/blog/HANDOFF-<id>.md`            | new                              | The report. First read for the next chat.      |
| `apps/blog/HANDOFF-CURRENT.txt`        | mod                              | Single-line pointer; overwrite each milestone. |
| Implementation files                   | new/mod                          | The work. Listed in the milestone.             |
| `apps/blog/tools/LOCKED_DECISIONS.txt` | mod only if a decision is frozen | Changes its SHA.                               |
| `apps/blog/assets/data/posts.json`     | read-only                        | Post bodies (interim source until C1).         |
| `apps/blog/assets/data/feed.json`      | read-only                        | Excerpts.                                      |

Never touched mid-cycle unless the milestone says so: `router.js`,
`renderer.js`, `parser.js`, `fetcher.js`, `generate-index.js`,
`hash-state.js`, `test-integrity.js`, `CONTEXT.md`.

## The cycle

### 0. Open (new chat, before anything else)

Read, in order:

1. `apps/blog/tools/CONTEXT.md`
2. `apps/blog/tools/LOCKED_DECISIONS.txt`
3. `apps/blog/HANDOFF-CURRENT.txt` — follow to the handoff it names
4. `apps/blog/tools/milestones/<id>.md`
5. Any prior handoff the milestone's Interfaces section references

Then:

- `node apps/blog/tools/test-integrity.js` → must print `INTEGRITY OK`.
- `git status` → `nothing to commit, working tree clean`.
- If either fails: report and stop. Do not proceed.

### 1. Scope confirmation

- Issue `SCOPE CONFIRMATION` in the exact CONTEXT.md format.
- The milestone's Interfaces section must already be filled. If it is
  not, the milestone is not ready: send it back to be written. Do not
  start work.
- Wait for the human to type `approve`. Nothing is written before that.

### 2. Implementation

- Output each file in a fenced block whose info string is the
