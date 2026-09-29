HANDOFF — Chat 09: Single Post Page

Status: complete
Current chat id: 09
Current milestone: 09
Completed milestones: 00, 01, 02, 03, 04, 05a, 05a-fix, 05b-removal, W1, W1-fix, 06, 06b, 07, 08, 09
Next chat id: C1
Context windows used: 1

## Files created/modified (exact paths)

- Created: apps/blog/HANDOFF-09.md (this file)
- Modified: apps/blog/assets/js/app.js (renderPost header block only:
  <h1> -> .post-header__title; <p class="post-meta"> ->
  .post-header__meta; per 09.md D1/L-3)
- Modified: apps/blog/assets/css/style.css (added "Milestone 09 —
  Single post" block; purely additive — no dead CSS to remove)
- Modified: apps/blog/tools/ROADMAP.md (09 flipped Next -> Done)
- Modified: apps/blog/HANDOFF-CURRENT.txt (points at this handoff)

## Frozen decisions made in this chat

- 09.md D1..D5 adopted: renderPost header adopts namespaced classes
  .post-header**title|**meta (D1); date formatting stays OUT (D2,
  owned by 11); slug is language-agnostic (D3); block rendering
  delegated to BlogRenderer.render (D4); renderList frozen (D5).
- D1 consequence: .post-header\_\_meta supersedes the bare .post-meta
  class from 09 onward. Downstream (11, 12a) may rely on this. The
  bare .post-meta class no longer appears in rendered markup; it
  survives only as text inside a code comment in app.js.
- Data contract unchanged: posts.json + feed.json remain interim (L-1);
  C1 owns conversion. Not touched in 09.

## Hashes (inputs only — see tools/WORKFLOW.md, convention (b))

LOCKED_DECISIONS_SHA256=57441c6bb8fc1e19044bc9b0ce44d1f67ec4ee1c71305289c97237067e9a0b86
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=1d6b6a91693c712a5116b452a4ac9a5172a558ba2cb8c48cb87e805ff9d54d27
SCHEMA_SHA256= OMITTED (Option 2 — no tools/schema.json)

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, per WORKFLOW.md step 6.

## Expected delta for the next chat

- C1 Content migration (posts.json -> content/<lang>/<slug>.json; rewire
  app fetch path; closes LOCKED_DECISIONS Recovery line). Depends on 09
  only (see ROADMAP: 10 About was omitted, so the prior 09,10 edge is
  now 09). Reading order: HANDOFF-CURRENT.txt -> HANDOFF-09.md ->
  tools/milestones/C1.md (authored at 09 close).
- After C1, 11 (Translations & i18n UI) unblocks; it depends on C1.

## Human edits made outside tooling (structured)

- Human confirmed the full manual browser checklist for 09 (see Test
  checklist below).
- Human reviewed and accepted a wording note: the string "post-meta"
  still appears once, inside an explanatory code comment in app.js
  (line ~86), documenting the supersession of the bare class. No
  rendered-markup occurrence remains. Human opted to leave the
  comment as-is.

## Open warnings (count + links only)

- 0.

## Deviations from locked decisions

- None. Every change falls inside 09.md's declared Interfaces
  (renderPost, style.css post block) and Files to Modify list.

## Partial work

- None.

## Blocked reason

- N/A

## Known issues / TODOs

- ABOUT / STATIC PAGES OMITTED (decision at 09 close). The intended
  About-Us page (contact details) was low priority with no downstream
  dependency, so milestone 10 was NOT authored.
  - Re-open trigger: only if a static page is deliberately wanted.
  - CAVEAT on re-open: a real About route REQUIRES a router.js change.
    router.js is the single owner of route vocabulary
    ({ lang, type: 'list'|'post', slug, raw }). Today #/<lang>/about
    falls through and renderList is shown ("any unknown -> list" in
    app.js). Adding a page route means a new type (e.g. 'page:') frozen
    into LOCKED_DECISIONS.txt and a renderPage in app.js — a declared
    deviation from the no-router-change pattern, not a silent edit.

- DATE FORMATTING (fence carried from 08; re-fenced by 09.md D2).
  renderList and renderPost both emit the raw ISO string
  (e.g. 2024-04-03T23:59:38+00:00). Do NOT "fix" with slice(0,10) or
  any partial formatter. Correct fix is locale-aware
  Intl.DateTimeFormat in BOTH views -> milestone 11 (i18n). Candidate
  line already parked for the 11 milestone file.
- Non-EN list views are EMPTY by design (08 L-4; posts.json is
  EN-only). #/fa, #/th render .no-posts until translated content
  lands (C1/11).
- Post slugs are language-agnostic; #/fa/post/<en-slug> routes to the
  EN body (D3; carried from LOCKED_DECISIONS).
- Bare .post-meta class: superseded by .post-header\_\_meta (D1). No CSS
  rule for .post-meta survives; the name occurs only in an app.js
  comment. Not a bug.
- .post-content is intentionally not restyled here; block-type layout
  belongs to the renderer / B1.
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
  tools/hash-state.js.) It WILL change for 09 vs 08 because
  HANDOFF-09.md is a new tracked path.
- renderList is the SINGLE list filter site (L-2); do not introduce a
  second filter.
- Namespaced classes are canonical from 08/09 onward: list =
  .post-list, .post-list-item, .post-list-item**title|**meta|**excerpt,
  .no-posts; post = .post-detail, .post-header,
  .post-header**title|\_\_meta, .post-content, .not-found.
- renderPost looks up by slug only (language-agnostic), then delegates
  blocks to window.BlogRenderer.render(post.blocks, contentEl).
- .post-detail and .post-list are both capped at max-inline-size 720px
  and centered (margin-inline: auto); logical properties only, RTL-safe.
- Script order in index.html unchanged from 07: renderer, router, nav,
  shell, app.

## Test checklist result (pass/fail per item)

1. ls modified paths present: PASS
2. node --check apps/blog/assets/js/app.js: PASS
3. grep post-header**title|post-header**meta in app.js + style.css:
   PASS (app.js:90-91; style.css:513,521)
4. grep post-header (container styled) + grep post-meta (app.js):
   PASS with note — .post-header present in both; the single
   "post-meta" match is inside an explanatory code comment (app.js
   ~86), not rendered markup.
5. grep "posts.filter" app.js -> exactly one filtering site (L-2): PASS
6. grep ".post-list-item" style.css -> 08 list block intact: PASS
   (style.css:426-460, all six selectors)
7. node apps/blog/tools/test-integrity.js -> INTEGRITY OK: PASS
8. git status --porcelain == 09's file set: PASS (M x4 + ?? 09.md)
9. Manual browser:
   - #/en -> click title -> styled post; header .post-header\_\_title;
     meta "<date> • EN" (raw ISO expected, not a bug); body via
     BlogRenderer: PASS
   - #/en/post/does-not-exist -> styled 404; "Back to home" returns
     to #/en: PASS
   - #/fa/post/<en-slug> -> EN body renders (D3): PASS
   - Phone width (~360px): readable; no horizontal scroll: PASS
   - Keyboard: Tab reaches title/back-home links; visible focus
     ring (inherits 07 :focus-visible): PASS
   - Console: no new errors, no 404s: PASS

## Files to read in the next chat (exact paths)

- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-09.md
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/ROADMAP.md
- apps/blog/tools/milestones/C1.md
- apps/blog/HANDOFF-08.md (precedent for list-view classes, L-3/L-4)
- apps/blog/index.html
- apps/blog/assets/js/app.js
- apps/blog/assets/css/style.css

```

Line count is within the 150-line cap. The pointer file was already set to `apps/blog/HANDOFF-09.md` in my previous block, so no re-apply needed there.

---

### apps/blog/tools/ROADMAP.md — addendum

One localized fix: `10 About / Static Pages` is still in **Next** and correctly so — it's authored at *this* close (step 7), not moved to Done. No change needed to the edit I gave earlier. (Just confirming, since 09.md's `Files I will NOT touch` lists `10.md` as "not authored yet" — that flips in the next block.)

---

Proceed to **WORKFLOW step 7** — author `apps/blog/tools/milestones/10.md` (About / Static Pages)?

Given `10.md` is a *new* file (not a localized edit), the preferred delivery is a heredoc:

```

cat > apps/blog/tools/milestones/10.md <<'EOF'
...contents...
EOF
