# Milestone 05a-fix: Repair hash-state.js

## Objective

Repair `apps/blog/tools/hash-state.js` so it produces correct, non-MISSING
hashes from the actual repository layout, and record the interim-content
recovery fact in LOCKED_DECISIONS.txt. Backend Node.js tooling only — no
frontend JS.

## Files to Create

1. `apps/blog/tools/milestones/05a-fix.md` (this file)
2. `apps/blog/HANDOFF-05a-fix.md`

## Files to Modify

1. `apps/blog/tools/hash-state.js`
2. `apps/blog/tools/LOCKED_DECISIONS.txt` (append only)

## Files I will NOT touch

- Anything outside `apps/blog/`.
- `apps/blog/assets/js/` (no frontend JS).
- `apps/blog/tools/parser.js`, `apps/blog/tools/fetcher.js`, `apps/blog/tools/generate-index.js` (read-only).
- `apps/blog/assets/data/posts.json`, `apps/blog/assets/data/feed.json` (read-only).
- `apps/blog/tools/CONTEXT.md` (divergence noted in handoff, not edited).

## Decisions frozen

- `APP_ROOT` resolves to `apps/blog` (`path.join(__dirname, "..")`).
- `REPO_ROOT` derives as `path.join(APP_ROOT, "..", "..")` → `zabon/`.
- `SCHEMA_SHA256` is omitted until a real `tools/schema.json` exists (Option 2).
- `FILE_TREE_SHA256` = sha256 of sorted, newline-joined `git ls-files apps/blog`.
- `CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256` = sha256 of the
  `posts.json` entry with `slug === "jews-in-palestine-before-israel"`,
  re-serialized with `JSON.stringify(entry, null, 2)`.
- `GIT_HEAD` / `GIT_DIRTY` come from `git` with cwd = `REPO_ROOT`.

## Test Checklist

1. `node --check apps/blog/tools/hash-state.js` → no syntax errors.
2. From `zabon/`: `node apps/blog/tools/hash-state.js` → prints four
   non-MISSING hashes, a valid `GIT_HEAD`, and `GIT_DIRTY=true`.
3. `SCHEMA_SHA256` is absent from output.
4. Determinism: two consecutive runs produce identical hash values.
5. `GIT_HEAD` equals `git -C zabon rev-parse HEAD`.

````

---

Please run these in the VS Code terminal (CWD = `zabon/`):

```bash
node --check apps/blog/tools/hash-state.js
node apps/blog/tools/hash-state.js
node apps/blog/tools/hash-state.js
git rev-parse HEAD
````
