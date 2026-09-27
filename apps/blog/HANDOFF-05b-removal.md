# HANDOFF — Chat 05b-removal: Remove Search UI; repair render/list wiring

**Status:** complete
**Current chat id:** 05b-removal
**Current milestone:** 05b-removal
**Completed milestones:** 00, 01, 02, 03, 04, 05a, 05a-fix, 05b-removal
**Next chat id:** 06
**Context windows used:** 1

## Files created/modified

- **Created:** `apps/blog/tools/milestones/05b-removal.md`
- **Created:** `apps/blog/HANDOFF-05b-removal.md`
- **Modified:** `apps/blog/index.html` (removed duplicated `<header>` and search input; removed `search.js` script tag)
- **Modified:** `apps/blog/assets/js/app.js` (removed search; removed private hash parser; adopted router vocabulary; D1 merged data; R1 renderer call)
- **Modified:** `apps/blog/HANDOFF-05b.md` (prepended SUPERSEDED banner; body left verbatim)
- **Deleted:** `apps/blog/assets/js/search.js` (staged `deleted:`)

## Frozen decisions made in this chat

- **D1:** `app.js` fetches `posts.json` (bodies) and `feed.json` (excerpts), merged by slug. Excerpt rule remains server-side (`generate-index.js`).
- **R1:** `app.js` calls `BlogRenderer.render(post.blocks, container)`; `renderer.js` unchanged.
- **V1:** `app.js` adopts `router.js`'s route vocabulary (`'list'`/`'post'`) directly. Chosen over V2 (private neutral vocabulary + mapping) to avoid a translation layer that can drift from the router. Confirmed live in the manual browser check (`type: "list"` / `type: "post"` in the console log).
- `app.js` delegates route wiring to `BlogRouter.init(callback)`; nothing depends on an event that is never dispatched.
- `router.js` and `renderer.js` are read-only this milestone.

## Hashes

- `LOCKED_DECISIONS_SHA256=57441c6bb8fc1e19044bc9b0ce44d1f67ec4ee1c71305289c97237067e9a0b86`
- `SCHEMA_SHA256=` OMITTED (Option 2)
- `CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=1d6b6a91693c712a5116b452a4ac9a5172a558ba2cb8c48cb87e805ff9d54d27`
- `FILE_TREE_SHA256=` [PENDING STEP 2]
- `GIT_HEAD=` [PENDING STEP 2]
- `GIT_DIRTY=` [PENDING STEP 2]

## Expected delta for the next chat

- The blog frontend now runs on the `posts.json` + `feed.json` contract.
- Milestone 06 proceeds against a working `#/en` list and a working post view.

## Human edits made outside tooling

- **Deletion:** the user deleted `apps/blog/assets/js/search.js` via the IDE (intentional, confirmed). It is staged as `deleted:`. The milestone's `git rm` command failed as a no-op because the path was already gone from the working tree when it ran; the staged deletion satisfies the intent.

## Open warnings

- 1: the milestone's `git rm apps/blog/assets/js/search.js` command failed (`pathspec ... did not match any files`) because the IDE had already removed the file. The intended end state (staged deletion) is present. No action required; recorded for provenance.

## Deviations from locked decisions

- None to the substantive decisions (D1, R1, V1 all applied as frozen).
- Scope note: added a post-edit `test-integrity.js` re-run to the test checklist (not in the milestone's original list); approved by the user before code was written.

## Partial work

- None.

## Blocked reason

- N/A

## Known issues / TODOs

- Content language files (`content/<lang>/`) still missing from the revert; `posts.json` remains interim source (see `LOCKED_DECISIONS.txt` Recovery line).
- `posts.json` currently contains EN-only posts, so `#/fa` and `#/th` render the empty-list state. Correct behavior, not a defect; flagged so the next chat does not mistake it for a regression.
- `renderer.js` does not currently handle all block types in `LOCKED_DECISIONS.txt` (e.g. `pullquote`, `resourceList`, `callout`, `footnotes`, `attachment`); its `default:` case emits `[Unsupported block: <type>]` placeholders. The pilot posts in `posts.json` use only `paragraph`, `image`, `quote`, `embed`, so no placeholders appear on the tested routes. Out of scope here.
- Excerpt seams and mid-word truncation noted in `HANDOFF-05a.md` remain; spec-compliant, optional polish.

## Assumptions the next chat may rely on

- `#/<lang>` renders a filtered list with excerpts; `#/<lang>/post/<slug>` renders the post body.
- `BlogRouter` is the single source of route state; the router's vocabulary is `'list'`/`'post'`.
- `posts.json` and `feed.json` are both required to be present at runtime.

## Test checklist result

- **Syntax check (`node --check apps/blog/assets/js/app.js`):** PASS (no output)
- **Search references removed (grep):** PASS (exit 1, no hits)
- **`parseCurrentHash` removed (grep):** PASS (exit 1, no hits)
- **Manual browser check:** PASS (list with excerpts at `#/en`; 30 blocks rendered into `.post-content` for the pilot post; no 404s)
- **Hash state:** PASS (non-MISSING)
- **`search.js` deleted:** PASS (staged `deleted:`; deleted via IDE — see Open warnings)
- **`test-integrity.js` re-run:** PASS (INTEGRITY OK)

## Files to read in the next chat (exact paths)

- `apps/blog/tools/CONTEXT.md`
- `apps/blog/tools/LOCKED_DECISIONS.txt`
- `apps/blog/HANDOFF-05a-fix.md`
- `apps/blog/HANDOFF-05b-removal.md`
- `apps/blog/tools/milestones/<next>.md`
- `apps/blog/assets/data/posts.json`
- `apps/blog/assets/data/feed.json`

````

## Why three values are still `[PENDING STEP 2]`

`FILE_TREE_SHA256`, `GIT_HEAD`, and `GIT_DIRTY` cannot be finalized yet because:

- `FILE_TREE_SHA256` = sha256 over `git ls-files apps/blog`, i.e. the **index**. The new `HANDOFF-05b-removal.md` isn't in the index until you `git add` it, so the value you'd capture now is wrong.
- `GIT_HEAD` won't move until you commit; the correct value to record is the **commit this milestone produces**, which doesn't exist yet.
- `GIT_DIRTY` will read `false` only once the tree is clean, i.e. after the commit.

This is the same self-reference quirk `HANDOFF-05a.md` carries and documents. So the sequence must be: stage everything → run `hash-state` → write those three values in → re-stage the handoff → commit. That last `git add` of the handoff (after its own hashes are written) is the one-file change that makes `GIT_DIRTY` the only moving part at commit time.

## Run these three steps now

```bash
# 1. Stage the working files (search.js is already staged as deleted)
git add apps/blog/index.html \
        apps/blog/assets/js/app.js \
        apps/blog/HANDOFF-05b.md \
        apps/blog/HANDOFF-05b-removal.md

# 2. Capture the authoritative hashes for the staged tree
node apps/blog/tools/hash-state.js

# 3. Inspect — expect: 1 deleted, 4 modified/added staged, nothing unstaged
git status
````
