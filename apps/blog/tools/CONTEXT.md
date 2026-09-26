# Zabon Blog App — Cross-Chat Context (Native IDE Mode)

This file is the single source of cross-chat rules. Every chat reads it first.
Because we are using a native IDE extension (Continue), the AI reads local files directly via `@` mentions and writes files via IDE diffs. No bundling or CLI wrappers are required.

## Layout

- REPO_ROOT: `<repo-root>`
- APP_ROOT: `<repo-root>/zabon/apps/blog`

The blog is a self-contained app. All tooling (`tools/`), content (`content/`), and assets (`assets/`) live inside APP_ROOT.
All paths in this file and in milestone files are relative to APP_ROOT.
All git operations run from REPO_ROOT. Commit messages are prefixed `zabon/blog:`.

## Precedence

1. `tools/LOCKED_DECISIONS.txt`
2. This file (`tools/CONTEXT.md`)
3. The milestone file

## Native IDE Workflow Rules

1. **File Access**: The AI must read files via `@` mentions in the chat. If a required file is not attached, ask the user to attach it by exact path. Do not reconstruct from memory.
2. **File Writing**: The AI must output code in standard markdown blocks with exact file paths (e.g., `### apps/blog/assets/css/style.css`). The user will use the IDE's "Apply" or "Accept" feature to write the files directly to disk.
3. **Command Execution**: The AI does not run shell commands directly. It asks the user to run them in the VS Code integrated terminal (e.g., `node zabon/apps/blog/tools/test-integrity.js`) and waits for the pasted output.
4. **No Bundling**: The `paste-bundle` mode, `tools/chatbridge.js`, and virtual file markers are deprecated and must not be used. Raw files are read and written directly.

## Hard Rules

- One milestone per chat.
- Integrity check first (`node zabon/apps/blog/tools/test-integrity.js`).
- Hashes come from scripts. Never compute a hash by hand.
- Handoff is mandatory and capped at 150 lines.
- Context budget: If the window is >60% consumed, produce `PARTIAL.md` and stop.
- Human edits are first-class.
- Single source per fact.
- No pushing. Commit locally; the user pushes.
- Approval before generation. Scope confirmation must use exactly this format:

  SCOPE CONFIRMATION
  Milestone: <chat_id> <title>
  Files I will create: <list>
  Files I will modify: <list>
  Files I will NOT touch: <list>
  Tests I will run: <list>
  Reply "approve" to proceed.

- Report deviations in HANDOFF.md.
- Stale-tree check: Do not start work on a dirty git tree.

## Handoff schema, canonical

HANDOFF — Chat <chat_id>: <Title>
Status: <complete | partial | blocked>
Current chat id: <chat_id>
Current milestone: <chat_id>
Completed milestones: <comma-separated chat ids>
Next chat id: <chat_id or COMPLETE>
Context windows used: <n>
Files created/modified (exact paths)
Frozen decisions made in this chat
Hashes (paste output of `node zabon/apps/blog/tools/hash-state.js`)
LOCKED_DECISIONS_SHA256=<hex>
SCHEMA_SHA256=<hex>
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=<hex or MISSING>
FILE_TREE_SHA256=<hex>
GIT_HEAD=<sha>
GIT_DIRTY=<true|false>
Expected delta for the next chat
Human edits made outside tooling (structured)
Open warnings (count + links only)
Deviations from locked decisions (must be empty, or explain)
Partial work (link to PARTIAL.md if present)
Blocked reason (only if Status: blocked)
Known issues / TODOs
Assumptions the next chat may rely on
Test checklist result (pass/fail per item)
Files to read in the next chat (exact paths)

## IDE File Path Rules (CRITICAL FOR CONTINUE)

- The VS Code Workspace Root is the `zabon/` directory.
- When outputting file paths in SCOPE CONFIRMATION, code blocks, or file headers (e.g., `### path/to/file`), you MUST use paths relative to the VS Code Workspace Root (`zabon/`).
- CORRECT: `apps/blog/index.html`
- INCORRECT: `zabon/apps/blog/index.html`, `index.html`, or `./index.html`.
- The Continue extension uses these exact paths to write files to disk. If you include the `zabon/` prefix, files will be created in the wrong location.
