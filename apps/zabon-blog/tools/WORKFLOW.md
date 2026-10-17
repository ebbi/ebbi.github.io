# Zabon Blog - Per-Milestone Workflow (reference)

Introduced by milestone W1. Read with CONTEXT.md; CONTEXT.md precedence
still governs (LOCKED_DECISIONS.txt > CONTEXT.md > milestone file). If
this file and CONTEXT.md disagree, CONTEXT.md wins - fix this file.

## Convention (workflow fix (b))

- The handoff hash block records INPUTS ONLY:
  LOCKED_DECISIONS_SHA256, CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256,
  and SCHEMA_SHA256 when apps/blog/tools/schema.json exists.
  These do not depend on the commit or on the handoff's own presence in
  the tree. The block is stable: capture it once, before staging.
- The commit-message body carries the volatile facts:
  GIT_HEAD (parent SHA), GIT_DIRTY, FILE_TREE_SHA256.
- Consequence: no stage/hash/re-stage/second-hash dance. GIT_DIRTY=true at
  commit time is the expected and final value, because those facts live in
  the commit, not the handoff.

## Pointer file

apps/blog/HANDOFF-CURRENT.txt contains exactly one newline-terminated
line: the workspace-relative path of the most recent handoff. Overwritten
each milestone (step 5). Read first by every chat (step 0).

## Files in every cycle

Per milestone <id>:

- apps/blog/tools/milestones/<id>.md   new   The plan. Authoritative here.
- apps/blog/HANDOFF-<id>.md            new   The report. Next chat reads first.
- apps/blog/HANDOFF-CURRENT.txt        mod   Single-line pointer.
- Implementation files                 new/mod The work.
- apps/blog/tools/LOCKED_DECISIONS.txt mod only if a decision is frozen.
- apps/blog/assets/data/posts.json     read-only (interim source until C1).
- apps/blog/assets/data/feed.json      read-only.

Never touched mid-cycle unless the milestone says so: router.js,
renderer.js, parser.js, fetcher.js, generate-index.js, hash-state.js,
test-integrity.js, CONTEXT.md.

## The cycle

### 0. Open (new chat, before anything else)

Read, in order:
 1. apps/blog/HANDOFF-CURRENT.txt (one line) -> follow to the handoff named
 2. apps/blog/tools/CONTEXT.md
 3. apps/blog/tools/LOCKED_DECISIONS.txt
 4. apps/blog/tools/milestones/<id>.md
 5. Any prior handoff the milestone's Interfaces section references

Then: node apps/blog/tools/test-integrity.js must print INTEGRITY OK, and
git status must be clean. If either fails: report and stop.

### 1. Scope confirmation

Issue SCOPE CONFIRMATION in the exact CONTEXT.md format. The milestone's
Interfaces section must already be filled; if not, the milestone is not
ready - send it back. Wait for the human to type approve. Nothing is
written before that.

### 2. Implementation

Output each file in a fenced block whose info string is the
workspace-relative path. Full file for new files and rewrites; lazy
snippets for localized edits to large files. Human applies each block.
node --check each created/modified .js as you go.

Preferred delivery for large markdown creates or full-file rewrites:
a terminal heredoc (cat > path <<'EOF' ... EOF), which avoids the apply
mechanism that has intermittently failed on large existing files. Verify
with wc -c / wc -l / head.

### 3. Local verification (before any commit)

Run the Test Checklist verbatim; paste output. Manual browser check for
anything touching render or routing. node apps/blog/tools/hash-state.js
is the source of truth; never compute a hash by hand.

### 4. Write the handoff

Create apps/blog/HANDOFF-<id>.md using the CONTEXT.md schema. Hash block:
inputs only. SCHEMA_SHA256 is OMITTED until tools/schema.json exists. Do
NOT put GIT_HEAD/GIT_DIRTY/FILE_TREE_SHA256 in the handoff. Status is
complete|partial|blocked. List exact paths to read next.

### 5. Update the pointer

Overwrite apps/blog/HANDOFF-CURRENT.txt with one newline-terminated line:
apps/blog/HANDOFF-<id>.md

### 6. Stage and commit

Stage the milestone's files (one git add per path if a missing path is
possible, so a single miss cannot abort the whole stage). git status must
show exactly the milestone's files.

Preferred commit form (separate -m flags so the body is not flattened):

  git commit -m "zabon/blog: <id> <short title>" \
             -m "GIT_HEAD=<parent sha> GIT_DIRTY=<true|false> FILE_TREE_SHA256=<hex>"

A single-line body is acceptable. If the body is one line, do NOT parse
it with grep '^GIT_HEAD='; use grep -o (e.g.
git log -1 --format=%B | grep -o 'GIT_HEAD=[0-9a-f]*'). Do not rewrite
history to reflow a body.

### 7. Author the next milestone

At the close of this milestone only: read apps/blog/tools/ROADMAP.md (now
exists), read this milestone's handoff outcomes, and write
apps/blog/tools/milestones/<next>.md in the CONTEXT.md format, with a
filled Interfaces section. Author only <next>; do not author <next+1>.
Add <next>.md to this handoff's "Files to read" list.

### 8. Close

git status must be clean. Optional determinism check: hash-state.js
FILE_TREE_SHA256 must equal the commit body value. Do not push; the human
pushes.

## Rules at every step

- One milestone per chat. A new milestone starts a new chat.
- Hashes come from scripts. Never compute by hand.
- Single source per fact. If a fact appears twice, delete one copy.
- Handoff capped at 150 lines.
- If the context window is >60% consumed mid-milestone, produce
  PARTIAL.md and stop at a clean boundary.
- Human edits outside tooling are first-class; record them in the handoff.
- Report deviations from locked decisions. An unexplained deviation is a
  failure of the cycle.
- Stale-tree check: do not start work on a dirty tree.
