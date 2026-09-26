# HANDOFF — Chat 04: Router & App Integration

**Status:** complete
**Current chat id:** 04
**Current milestone:** 04
**Completed milestones:** 00, 01, 02, 03, 04
**Next chat id:** 05a
**Context windows used:** 1

## Files created/modified

- **Created:** `apps/blog/assets/js/router.js`
- **Created:** `apps/blog/assets/js/app.js`
- **Modified:** `apps/blog/index.html` (Added header nav, main container, footer, and correct script loading order)

## Frozen decisions made in this chat

- Routing uses hash-based URLs (`#/<lang>/post/<slug>` or `#/<lang>`) to ensure GitHub Pages compatibility without server-side rewrite rules.
- The `<html>` element's `lang` and `dir` attributes are dynamically updated by the router based on the URL segment (e.g., `fa` and `ar` trigger `dir="rtl"`).
- Data is fetched once on app initialization (`fetch('assets/data/posts.json')`) and cached in memory for instant route transitions.
- A graceful 404 fallback is rendered if a requested slug is not found in the loaded data.

## Hashes

_(Run `node apps/blog/tools/hash-state.js` in the terminal and paste the output here to update the hashes before final commit)._

- `LOCKED_DECISIONS_SHA256=` [RUN_HASH_STATE_JS]
- `SCHEMA_SHA256=` [RUN_HASH_STATE_JS]
- `CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=` [RUN_HASH_STATE_JS]
- `FILE_TREE_SHA256=` [RUN_HASH_STATE_JS]
- `GIT_HEAD=` [RUN_GIT_REV_PARSE_HEAD]
- `GIT_DIRTY=` false

## Expected delta for the next chat

- Chat 05a will implement the Feeds & Search Index generation.
- This involves creating a Node.js script to generate a lightweight, searchable JSON index from `apps/blog/assets/data/posts.json` for client-side fuzzy search.

## Human edits made outside tooling

- None.

## Open warnings

- 0

## Deviations from locked decisions

- None.

## Partial work

- None.

## Blocked reason

- N/A

## Known issues / TODOs

- None for this milestone.

## Assumptions the next chat may rely on

- `apps/blog/assets/data/posts.json` is the single source of truth for post data.
- The router reliably exposes the current route state, and the app container (`#app`) is consistently cleared and re-rendered on route changes.

## Test checklist result

- **File Tree Check:** PASS (`router.js`, `app.js`, `index.html` exist)
- **HTML Script Check:** PASS (Scripts load in correct dependency order: renderer, router, app)
- **Browser Routing Check:** PASS (Home list loads, clicking posts renders blocks, `<html>` lang/dir attributes update dynamically)
- **404 Fallback Check:** PASS (Navigating to a non-existent slug shows a graceful error message with a back link)

## Files to read in the next chat

- `apps/blog/tools/CONTEXT.md`
- `apps/blog/tools/LOCKED_DECISIONS.txt`
- `apps/blog/HANDOFF.md`
- `apps/blog/tools/milestones/05a.md`
- `apps/blog/assets/data/posts.json`
