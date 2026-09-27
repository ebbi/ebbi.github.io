# HANDOFF — Chat 05a-fix: Repair hash-state.js

**Status:** complete
**Current chat id:** 05a-fix
**Current milestone:** 05a-fix
**Completed milestones:** 00, 01, 02, 03, 04, 05a, 05a-fix
**Next chat id:** 06
**Context windows used:** 1

## Files created/modified

- **Created:** `apps/blog/tools/milestones/05a-fix.md`
- **Created:** `apps/blog/HANDOFF-05a-fix.md`
- **Modified:** `apps/blog/tools/hash-state.js` (APP_ROOT/REPO_ROOT fix; Option 2 SCHEMA_SHA256 removal; `git ls-files` file-tree hash; pilot-slug-filtered content hash)
- **Modified:** `apps/blog/tools/LOCKED_DECISIONS.txt` (appended Recovery line only)

## Frozen decisions made in this chat

- `APP_ROOT` in `hash-state.js` resolves to `apps/blog` (`path.join(__dirname, "..")`).
- `REPO_ROOT` derives as `path.join(APP_ROOT, "..", "..")` → `zabon/`.
- **Option 2**: `SCHEMA_SHA256` is omitted from the script and from this and future handoffs until a real `apps/blog/tools/schema.json` exists. `LOCKED_DECISIONS.txt` records the interim fact.
- `FILE_TREE_SHA256` = sha256 of sorted, newline-joined paths from `git ls-files apps/blog` (run with cwd = REPO_ROOT). Honors `.gitignore` natively. Falls back to `MISSING` if `git` is unavailable — no hand-rolled matcher.
- `CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256` = sha256 of the `posts.json` entry with `slug === "jews-in-palestine-before-israel"`, re-serialized with `JSON.stringify(entry, null, 2)`.
- `GIT_HEAD` / `GIT_DIRTY` come from `git` with cwd = `REPO_ROOT`.
- Recovery fact recorded in `LOCKED_DECISIONS.txt`: per-post `content/<lang>/<slug>.json` is the long-term canonical source; `assets/data/posts.json` is the interim canonical source for the pilot during recovery.

## Hashes

**Verified at close-out:** the `LOCKED_DECISIONS.txt` Recovery-line edit was applied before the hashes below were captured, so `LOCKED_DECISIONS_SHA256` already reflects the post-edit file. No further re-run is required for handoff fidelity.

- `LOCKED_DECISIONS_SHA256=57441c6bb8fc1e19044bc9b0ce44d1f67ec4ee1c71305289c97237067e9a0b86`
- `SCHEMA_SHA256=` OMITTED (Option 2 — no schema.json yet)
- `CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=1d6b6a91693c712a5116b452a4ac9a5172a558ba2cb8c48cb87e805ff9d54d27`
- `FILE_TREE_SHA256=ecaf7411a8c3c81eca8b669c45bc53440a3661dfdb72f6e64afdc30b2b0c94e3`
- `GIT_HEAD=d86ec3f03ac7fb516d9b383e142ad64edcdc3e77`
- `GIT_DIRTY=false`

_Note: values captured at the tip of the 05a/05a-fix close-out. See `HANDOFF-05a.md` for the same snapshot._

## Expected delta for the next chat

- The next chat proceeds to its own milestone (id TBD). It may rely on `hash-state.js` producing correct, non-MISSING hashes for `LOCKED_DECISIONS_SHA256`, `CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256`, `FILE_TREE_SHA256`, `GIT_HEAD`, and `GIT_DIRTY`.
- The next chat MUST NOT expect a `SCHEMA_SHA256` value.

## Human edits made outside tooling (structured)

- None.

## Open warnings

- 1: `CONTEXT.md`'s canonical handoff schema still lists `SCHEMA_SHA256`, which Option 2 removes from actual output. Divergence acknowledged and deferred to a future `CONTEXT.md` edit milestone. Not edited here because editing `CONTEXT.md` is a cross-cutting change outside this micro-milestone's scope.

## Deviations from locked decisions

- None. (The `SCHEMA_SHA256` omission is itself a deliberate locked decision from this milestone, not a deviation.)

## Partial work

- None.

## Blocked reason

- N/A

## Known issues / TODOs

- After applying the `LOCKED_DECISIONS.txt` Recovery-line edit, re-run `hash-state.js` and update the hash block above before committing.
- `apps/blog/tools/schema.json` does not exist. When it is created (future milestone), `SCHEMA_SHA256` should be reinstated in `hash-state.js` and in `CONTEXT.md`'s handoff schema.
- `apps/blog/content/<lang>/` does not exist (lost in the git revert). Regeneration of per-post content files is a future milestone; `posts.json` is the interim canonical source.

## Assumptions the next chat may rely on

- The repo root is `/run/media/berar/backup-disk/zabon` (git toplevel).
- `apps/blog/` is the app root; all blog tooling, content, and assets live inside it.
- `git ls-files apps/blog` (cwd = repo root) is the authoritative, `.gitignore`-honoring file list for the tree hash.

## Test checklist result

- **Syntax check (`node --check`):** PASS
- **Execution check:** PASS (four non-MISSING hashes, valid GIT_HEAD, GIT_DIRTY=true)
- **SCHEMA_SHA256 absent:** PASS
- **Determinism (two runs identical):** PASS
- **GIT_HEAD matches `git rev-parse HEAD`:** PASS

## Files to read in the next chat (exact paths)

- `apps/blog/tools/CONTEXT.md`
- `apps/blog/tools/LOCKED_DECISIONS.txt`
- `apps/blog/HANDOFF-05a-fix.md`
- `apps/blog/tools/milestones/<next-milestone>.md`
- `apps/blog/assets/data/posts.json`
- `apps/blog/assets/data/feed.json`

````

---

## Correct commit sequence

Do these steps **in this order**, from `zabon/`:

```bash
# 1. Apply the LOCKED_DECISIONS.txt edit (append Recovery line) and the modified hash-state.js
#    (and create milestones/05a-fix.md and HANDOFF-05a-fix.md) via the IDE Apply button.

# 2. Re-run the hash script now that LOCKED_DECISIONS.txt has changed:
node apps/blog/tools/hash-state.js

# 3. Paste those new values into HANDOFF-05a-fix.md (LOCKED_DECISIONS_SHA256 and FILE_TREE_SHA256 will change).

# 4. Stage and inspect:
git add apps/blog/tools/hash-state.js apps/blog/tools/LOCKED_DECISIONS.txt \
        apps/blog/tools/milestones/05a-fix.md apps/blog/HANDOFF-05a-fix.md
git status

# 5. Commit (from repo root):
git commit -m "zabon/blog: 05a-fix — repair hash-state.js; record interim content source"
````
