HANDOFF — Chat 08: Post List Page

Status: complete
Current chat id: 08
Current milestone: 08
Completed milestones: 00, 01, 02, 03, 04, 05a, 05a-fix, 05b-removal, W1, W1-fix, 06, 06b, 07, 08
Next chat id: 09
Context windows used: 1

## Files created/modified (exact paths)

- Created: apps/blog/HANDOFF-08.md (this file)
- Modified: apps/blog/assets/js/app.js (renderList: namespaced item
  classes per L-3; filter and empty-state block unchanged)
- Modified: apps/blog/assets/css/style.css (added "Milestone 08 — Post
  list" block; purely additive — no dead CSS to remove)
- Modified: apps/blog/tools/ROADMAP.md (08 flipped Next -> Done; L-6)
- Modified: apps/blog/HANDOFF-CURRENT.txt (points at this handoff)

## Frozen decisions made in this chat

- 08.md S-1..S-7 adopted: list view only; single filter site (L-2);
  namespaced classes .post-list-item**title|**meta|\_\_excerpt (L-3);
  empty state .no-posts carried, not fixed (L-4); no new route
  vocabulary (L-5); ROADMAP self-flip (L-6).
- Data contract unchanged: posts.json + feed.json remain interim (L-1);
  C1 owns conversion.
- renderPost NOT touched. The list markup rename is scoped to
  renderList; renderPost's header still uses the bare post-meta class.
  Rationale: 08.md Interfaces name renderList only; renaming the post
  view is a different milestone's concern.

## Hashes (inputs only — see tools/WORKFLOW.md, convention (b))

LOCKED_DECISIONS_SHA256=57441c6bb8fc1e19044bc9b0ce44d1f67ec4ee1c71305289c97237067e9a0b86
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=1d6b6a91693c712a5116b452a4ac9a5172a558ba2cb8c48cb87e805ff9d54d27
SCHEMA_SHA256= OMITTED (Option 2 — no tools/schema.json)

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, per WORKFLOW.md step 6.

## Expected delta for the next chat

- 09 Single Post Page (depends on 08; 08.md L-6). Reading order:
  HANDOFF-CURRENT.txt -> HANDOFF-08.md -> tools/milestones/09.md
  (authored at 08 close).

## Human edits made outside tooling (structured)

- Human confirmed the full manual browser checklist for 08 (see Test
  checklist below). No content changes outside the deviations below.
- Human raised a date-format caveat ("date and time should be formatted
  to just date") during verification. Resolved as Option A — out of
  08 scope; deferred. See Known issues / TODOs. No code change made.

## Open warnings (count + links only)

- 0.

## Deviations from locked decisions

- None. Every change falls inside 08.md's declared Interfaces
  (renderList, style.css list block) and Files to Modify list.

## Partial work

- None.

## Blocked reason

- N/A

## Known issues / TODOs

- DATE FORMATTING (raised during 08 verification; deferred by
  decision). renderList and renderPost both emit the raw ISO string
  from posts.json/feed.json (e.g. 2024-04-03T23:59:38+00:00). 08
  changed classes, not data, so this is pre-existing and out of 08
  scope (08.md Scope fence: list view only). Correct fix is
  locale-aware Intl.DateTimeFormat in BOTH views -> belongs to 11
  (Translations & i18n UI). Candidate line for the 11 milestone file.
  Not a 08 bug; do NOT "fix" with a bare slice(0,10) here.
- Non-EN list views are EMPTY by design (L-4); posts.json is EN-only.
  #/fa, #/th render .no-posts until translated content lands (C1/11).
- Post slugs are language-agnostic; #/fa/post/<en-slug> routes to the
  EN body (carried from LOCKED_DECISIONS.txt).
- renderPost header still uses bare post-meta class (not namespaced);
  intentional, out of 08 scope.
- Transport buttons are inert by design (07 S-4). TTS reserved.
- Closed-drawer focusability deferred to 13a (carried from 07).
- Drawer heading/aria-labels are English literals -> 11 (carried 07).
- Pre-existing intermittent console warning "Layout was forced before
  the page was fully loaded..." (carried from 07).

## Assumptions the next chat may rely on

- Handoff hash block = inputs only; GIT_HEAD/GIT_DIRTY/FILE_TREE_SHA256
  live in the commit body.
- FILE_TREE_SHA256 semantics: sha256 of the sorted, newline-joined
  output of `git ls-files apps/blog` — the TRACKED PATH SET, not file
  contents. Unchanged by in-place edits; excludes untracked files.
  Changes on add/remove/rename after commit. (Script:
  tools/hash-state.js.) It WILL change for 08 vs 07 because
  HANDOFF-08.md is a new tracked path.
- renderList is the SINGLE list filter site (L-2); do not introduce a
  second filter.
- Namespaced list classes are canonical from 08 onward (L-3):
  .post-list, .post-list-item, .post-list-item**title,
  .post-list-item**meta, .post-list-item\_\_excerpt, .no-posts.
- .post-list is capped at max-inline-size 720px and centered
  (margin-inline: auto); logical properties only, RTL-safe.
- Script order in index.html unchanged from 07: renderer, router, nav,
  shell, app.

## Test checklist result (pass/fail per item)

1. ls modified paths present: PASS
2. node --check apps/blog/assets/js/app.js: PASS
3. grep post-list-item\_\_|no-posts in app.js + style.css: PASS
   (namespaced classes present in both)
4. grep "posts.filter" app.js -> exactly one filtering site (L-2): PASS
5. Manual browser:
   - #/en: list renders; title link, date • EN, excerpt; title links
     navigate to #/en/post/<slug>: PASS
   - #/fa: .no-posts empty state, centered, no broken layout; no
     console errors: PASS
   - Phone-width (~360px): items stack; no horizontal scroll: PASS
   - Keyboard: Tab reaches each .post-list-item\_\_title; visible focus
     ring: PASS
   - Console: no new errors, no 404s: PASS
6. node apps/blog/tools/test-integrity.js -> INTEGRITY OK: PASS
7. git status --porcelain == 08's file set: PASS (see step 6)

## Files to read in the next chat (exact paths)

- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-08.md
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/ROADMAP.md
- apps/blog/tools/milestones/09.md
- apps/blog/index.html
- apps/blog/assets/js/app.js
- apps/blog/assets/css/style.css

```

---

## Step 6 — stage and commit

Run from `zabon/`. Per WORKFLOW step 6: one `git add` per path, then capture `FILE_TREE_SHA256` **after** the add so the body reflects the tracked set including `HANDOFF-08.md`.

**1. Stage (one add per path):**
```

git add apps/blog/assets/js/app.js
git add apps/blog/assets/css/style.css
git add apps/blog/tools/ROADMAP.md
git add apps/blog/HANDOFF-CURRENT.txt
git add apps/blog/HANDOFF-08.md
git status --porcelain

```

Expect exactly five lines (`M`/`M`/`M`/`M`/`A`) — and nothing else. If any extra path appears, stop and report.

**2. Capture the volatile facts:**
```

node apps/blog/tools/hash-state.js
git rev-parse HEAD

```

The `hash-state.js` output gives the fresh `FILE_TREE_SHA256` (it will differ from 07's `91757043…` — `HANDOFF-08.md` is a new tracked path). `git rev-parse HEAD` is the parent SHA (`GIT_HEAD`).

**3. Commit (separate -m flags so the body isn't flattened):**
```

git commit -m "zabon/blog: 08 Post List Page" \
 -m "GIT_HEAD=<parent sha from step 2> GIT_DIRTY=true FILE_TREE_SHA256=<hex from step 2>"

```
`GIT_DIRTY=true` is the expected, final value — the volatile facts live in the commit, not the handoff (WORKFLOW convention (b)).

**4. Confirm:**
```

git status --porcelain
git log --oneline -3

```
Expect clean porcelain and `08 Post List Page` at the top.

---

## Step 7 — author milestone 09

Per WORKFLOW step 7, at the close of 08 I author **only** `apps/blog/tools/milestones/09.md` (Single Post Page, depends on 08), in the CONTEXT.md format with a filled Interfaces section. Then it gets added to this handoff's "Files to read" list (already listed above).

**How do you want 09 delivered?** Since `09.md` is a *new* file (not a localized edit to a large existing one), the WORKFLOW-preferred delivery is a terminal heredoc:

```

cat > apps/blog/tools/milestones/09.md <<'EOF'
...contents...
EOF
