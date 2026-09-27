# HANDOFF — Chat 05a: Feeds & Search Index (Backend Only)

**Status:** complete
**Current chat id:** 05a
**Current milestone:** 05a
**Completed milestones:** 00, 01, 02, 03, 04, 05a, 05a-fix
**Next chat id:** 06
**Context windows used:** 1

## Files created/modified

- **Created:** `apps/blog/tools/generate-index.js`
- **Created (generated output, committed):** `apps/blog/assets/data/feed.json`
- **Created:** `apps/blog/tools/milestones/05a.md`
- **Created:** `apps/blog/HANDOFF-05a.md` (this file)
- **Modified:** none

## Frozen decisions made in this chat

- `feed.json` schema: array of `{ slug, title, date, lang, excerpt }`, max 10 entries.
- Sort by `date` descending using `Date.parse` on the ISO-8601 string; unparseable dates sink to the bottom (do not throw).
- Excerpt source = `paragraph` blocks only (excludes `quote`, `heading`, `image`, `embed`, etc.), matching the block schema in `LOCKED_DECISIONS.txt`.
- Excerpt = up to 150 chars of decoded, whitespace-normalized, entity-decoded concatenated paragraph text; blocks joined with a single space; truncated with a trailing `…` when cut.
- HTML entity decoding is done in-script via a small named + numeric decoder (parser.js only strips tags and `&nbsp;`).
- Node 20 native `fs`/`path` only; no npm dependencies. No frontend JS was created or modified (05b discarded).

## Hashes

- `LOCKED_DECISIONS_SHA256=57441c6bb8fc1e19044bc9b0ce44d1f67ec4ee1c71305289c97237067e9a0b86`
- `SCHEMA_SHA256=` OMITTED (Option 2 — no `tools/schema.json` exists; see milestone 05a-fix and `LOCKED_DECISIONS.txt` Recovery line)
- `CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=1d6b6a91693c712a5116b452a4ac9a5172a558ba2cb8c48cb87e805ff9d54d27`
- `FILE_TREE_SHA256=ecaf7411a8c3c81eca8b669c45bc53440a3661dfdb72f6e64afdc30b2b0c94e3`
- `GIT_HEAD=d86ec3f03ac7fb516d9b383e142ad64edcdc3e77`
- `GIT_DIRTY=false`

_Note: `FILE_TREE_SHA256` reflects the git-tracked file set at the time `hash-state.js` was run. Untracked files are not included by design (see milestone 05a-fix)._

## Expected delta for the next chat

- The next chat proceeds to milestone 06 (id TBD). It may rely on `feed.json` (10 most recent posts, date descending) and on `posts.json` as the interim canonical post source.
- The next chat MUST NOT expect a `SCHEMA_SHA256` value.

## Human edits made outside tooling (structured)

- `apps/blog/notes/blog/m.md` — human chat log, committed deliberately on its own (commit `48402086`).

## Open warnings

- 1: `HANDOFF-05b.md` is present in the tree but describes pre-revert work (`Chat 05b: Search UI`) that does not exist on this branch. It is a stale artifact from the `develop` history. Not acted on in 05a; flagged for the next chat.
- 2 (resolved): `apps/blog/notes/blog/m.md` is a human scratchpad; as of commit `d86ec3f` it is gitignored, so it no longer affects `GIT_DIRTY`.

## Deviations from locked decisions

- None. The discarding of the 05b frontend Search UI was an explicit user instruction for this milestone, not a deviation.

## Partial work

- None.

## Blocked reason

- N/A

## Known issues / TODOs

- Excerpt seams: consecutive paragraph blocks are joined with a single space, producing occasional run-on seams (e.g. `…history Secondly…`). Spec-compliant; optional polish.
- Truncation is mid-word (e.g. `jettisone…`). Spec-compliant; optional polish.
- `apps/blog/content/<lang>/` does not exist (lost in the `develop` revert). Regeneration of per-post content files is a future milestone; `posts.json` is the interim canonical source.

## Assumptions the next chat may rely on

- `apps/blog/assets/data/posts.json` is the single source of truth for post data.
- `apps/blog/assets/data/feed.json` is the derived, read-only artifact produced by `generate-index.js`; re-running it is idempotent.
- `apps/blog/tools/hash-state.js` produces correct, non-MISSING hashes for `LOCKED_DECISIONS_SHA256`, `CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256`, `FILE_TREE_SHA256`, `GIT_HEAD`, and `GIT_DIRTY`.

## Test checklist result

- **File Tree Check:** PASS (`apps/blog/tools/generate-index.js` exists)
- **Execution Check:** PASS (`node apps/blog/tools/generate-index.js` → "Successfully generated feed with 10 posts.")
- **Schema Validation:** PASS (10 entries, date desc, plain-text excerpts, no HTML/entities)

## Files to read in the next chat (exact paths)

- `apps/blog/tools/CONTEXT.md`
- `apps/blog/tools/LOCKED_DECISIONS.txt`
- `apps/blog/HANDOFF-05a.md` (this file)
- `apps/blog/HANDOFF-05a-fix.md`
- `apps/blog/tools/milestones/<next-milestone>.md`
- `apps/blog/assets/data/posts.json`
- `apps/blog/assets/data/feed.json`

````

## Commit this file

From `zabon/`:

```bash
git add apps/blog/HANDOFF-05a.md
git commit -m "zabon/blog: 05a — restore handoff"
````

Then verify the tree is still clean:

```bash
git status
node apps/blog/tools/hash-state.js
```

Note that committing `HANDOFF-05a.md` will change `FILE_TREE_SHA256` (untracked→tracked) and `GIT_HEAD` again. That's expected. After you paste the new values, I'll finalize the two handoffs' hash blocks in one last corrective commit:

```bash
git commit -m "zabon/blog: 05a/05a-fix — sync handoff hashes post-restore"
```
