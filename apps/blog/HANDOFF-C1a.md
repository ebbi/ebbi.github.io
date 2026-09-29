HANDOFF — Chat C1a: Content migration, pilot (posts.json -> content/en/<slug>.json)

Status: complete
Current chat id: C1a
Current milestone: C1a
Completed milestones: 00, 01, 02, 03, 04, 05a, 05a-fix, 05b-removal, W1, W1-fix, 06, 06b, 07, 08, 09, C1a
Next chat id: C1b
Context windows used: 1

## Files created/modified (exact paths)

- Created: apps/blog/content/en/jews-in-palestine-before-israel.json
- Created: apps/blog/HANDOFF-C1a.md (this file)
- Created: apps/blog/tools/milestones/C1b.md (authored at close)
- Modified: apps/blog/assets/js/app.js (data loading only; see Decisions)
- Modified: apps/blog/tools/generate-index.js (now reads content/, not
  posts.json; emits the COMPLETE index, not 10-most-recent)
- Modified: apps/blog/assets/data/feed.json (regenerated: 1 entry)
- Modified: apps/blog/tools/ROADMAP.md (C1 split C1a/C1b; new 10b)
- Modified: apps/blog/HANDOFF-CURRENT.txt (points at this handoff)

## Frozen decisions made in this chat

- C1-D1..D4 from C1.md carried unchanged: content/<lang>/<slug>.json is
  canonical (Recovery line); single filter site (L-2) preserved;
  posts.json/feed.json kept on disk but no longer canonical (D3);
  presentation frozen, no class/markup change (D4).
- C1a-D5. Content files carry NO `excerpt` field. The excerpt is DERIVED
  by generate-index.js (buildExcerpt over paragraph blocks) into
  feed.json. This CORRECTS C1.md's Interfaces, which declared an
  `excerpt: string` on the content file. Single source per fact.
- C1a-D6. Milestone C1 is split: C1a = machinery + 1 pilot post (this
  chat); C1b = migrate the remaining 19 EN posts (next chat). The list
  view intentionally shows ONE post at C1a. This is NOT a bug.
- C1a-D7. Data-loading topology (a): app.js reads assets/data/feed.json
  as the list index; renderPost fetches content/<lang>/<slug>.json on
  demand. renderList is unchanged and remains the single posts.filter.
- C1a-D8. generate-index.js emits the COMPLETE index (FEED_SIZE=10
  removed). feed.json's name is now a slight misnomer; flag, not change.
- C1a-D9. Slugs are language-agnostic. renderPost tries
  content/<route.lang>/<slug>.json, then content/en/<slug>.json. EN
  fallback verified (#/fa/post/<en-slug> renders the EN body).
- C1a-D10. Translations are NOT part of C1b. fa/ar/th content is
  milestone 11's job (human review gate per LOCKED_DECISIONS). C1b is
  EN-only and mechanical.

## Hashes (inputs only — see tools/WORKFLOW.md, convention (b))

LOCKED_DECISIONS_SHA256=<FILL FROM tools/hash-state.js>
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=<FILL FROM tools/hash-state.js>
SCHEMA_SHA256= OMITTED (Option 2 — no tools/schema.json)

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, per WORKFLOW.md step 6.

## Expected delta for the next chat

- C1b: migrate the remaining 19 EN posts from posts.json to
  content/en/<slug>.json. No app.js or generate-index.js change — the
  machinery is proven. List returns to 20/20 EN. Each migrated body is
  eyeballed against its live WordPress post (human verification step).
  Reading order: HANDOFF-CURRENT.txt -> HANDOFF-C1a.md ->
  tools/milestones/C1b.md.
- After C1b, milestone 11 (translations) unblocks.

## Human edits made outside tooling (structured)

- Human applied the app.js edits and the generate-index.js re-source.
- Human uncommented the excerpt line (see Deviations) and re-ran the
  tool; feed.json pilot entry now carries the derived excerpt.
- Human confirmed the full browser checklist (list + post + EN fallback).
- Human confirmed design intent: list item should become a collapsible
  panel (title toggles excerpt + read-more link). Recorded as milestone
  10b; NOT done in C1a (presentation was frozen).

## Open warnings (count + links only)

- 0.

## Deviations from locked decisions

- P0 (mine, fixed): the first C1a pilot content file was delivered with
  a placeholder `blocks` array. Cause: a lazy-diff annotation was taken
  as literal file content. Symptom: renderer guard "blocks must be an
  array". Fixed by re-emitting the complete file. Confirmed by
  blocks.length === 30.
- P1 (mine, fixed): app.js was left with TWO `renderPost` definitions
  (new async + old posts.find version). JS hoisting meant the OLD one
  won; it read `post.blocks` off a feed entry (no `blocks`) -> same
  renderer guard. Fixed by deleting the old definition. Confirmed:
  `grep -c 'function renderPost'` === 1.
- P2 (mine, fixed): generate-index.js had
  `// excerpt: buildExcerpt(post.blocks)` commented out, so feed.json
  carried no excerpt and the list rendered a blank excerpt line
  silently. Fixed by uncommenting. Confirmed by inspecting feed.json.
- All three were presentation-layer bugs in the C1a plumbing, caught by
  the browser pilot. None change C1a's frozen decisions.

## Partial work

- None.

## Blocked reason

- N/A

## Known issues / TODOs

- LIST SHOWS 1 POST BY DESIGN (C1a-D6). C1b restores 19 more (20 total
  EN). Not a bug.
- CI INTEGRITY CHECK DOES NOT COVER C1a'S FILES. test-integrity.js
  checks index.html, style.css, router.js, app.js, test-integrity.js,
  hash-state.js, LOCKED_DECISIONS.txt, CONTEXT.md. It does NOT check
  generate-index.js, feed.json, or content/\*\*. INTEGRITY OK is not
  evidence C1a is correct. Do not over-read it.
- feed.json NAME is now a misnomer (it is the full index, not a
  10-most-recent feed). Rename is a future cleanup (C1a-D8).
- posts.json REMAINS ON DISK but is no longer read by anything (C1a-D3;
  recovery interim). A later cleanup milestone deletes it.
- Raw ISO dates in both views (owned by 11; fence carried from 08/09).
- Non-EN list views empty by design (08 L-4) — no fa/ar/th content files
  exist until 11.
- Renderer block coverage is unchanged (B1 owns pullquote/resourceList/
  callout/footnotes/attachment). The pilot's blocks render via existing
  types (image, paragraph).
- Pre-existing intermittent console warning "Layout was forced before
  the page was fully loaded..." (carried from 07).
- Transport buttons inert by design (07 S-4). TTS reserved.
- Closed-drawer focusability deferred to 13a. Drawer aria-labels are
  English literals -> 11.

## Assumptions the next chat may rely on

- Handoff hash block = inputs only; volatile facts in the commit body.
- FILE_TREE_SHA256 = sha256 of `git ls-files apps/blog` (tracked path
  set, not contents). Changes when HANDOFF-C1a.md and
  content/en/jews-in-palestine-before-israel.json are added.
- renderList is the SINGLE list-filter site (L-2). Do not add a second.
- renderList/renderPost class output is UNCHANGED by C1a (08/09 stand).
- Single source per fact: content file = body; feed.json = derived list
  index (incl. excerpt). The word "excerpt" belongs to feed.json only.
- Script order in index.html unchanged from 07.
- C1b is EN-only and mechanical; no tooling/app change expected.

## Test checklist result (pass/fail per item)

1. Pilot content file exists + parses; blocks.length === 30: PASS
2. node --check apps/blog/assets/js/app.js: PASS
3. generate-index.js walks content/, emits 1 entry: PASS
   ("Successfully generated index with 1 entries")
4. feed.json carries the derived excerpt (after uncomment): PASS
5. grep -c 'function renderPost' app.js === 1: PASS
6. grep -c 'mergePostsAndFeed' app.js === 0: PASS
7. grep -c 'post.blocks' app.js === 0: PASS
8. grep posts.filter app.js -> exactly one (L-2): PASS (line 110)
9. node tools/test-integrity.js -> INTEGRITY OK: PASS (see caveat above)
10. Browser #/en -> 1-item list, excerpt shown: PASS
11. Browser #/en/post/jews-in-palestine-before-israel ->
    "Successfully rendered 30 blocks": PASS
12. Browser #/fa/post/jews-in-palestine-before-israel -> content/fa 404,
    EN fallback renders 30 blocks: PASS
13. git status --porcelain == C1a's file set: PASS (M x3 + ?? content/)

## Files to read in the next chat (exact paths)

- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1a.md
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/ROADMAP.md
- apps/blog/tools/milestones/C1b.md
- apps/blog/assets/data/posts.json (source for C1b migration)
- apps/blog/content/en/jews-in-palestine-before-israel.json (the pattern
  C1b must follow)

```

> **Note:** the two `<FILL FROM tools/hash-state.js>` placeholders must be replaced with real values before commit. I will not invent hashes. Run `node apps/blog/tools/hash-state.js`, paste the two relevant lines, and I'll confirm the handoff block — or you fill them directly. If `hash-state.js` does not emit `CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256`, tell me its actual output keys and I'll reconcile (its current behavior is unknown to me — it was not attached this chat).

---

### 2. `apps/blog/HANDOFF-CURRENT.txt` — overwrite

```

apps/blog/HANDOFF-C1a.md

````
(one line, newline-terminated)

---

### 3. `apps/blog/tools/ROADMAP.md` — localized edits

Flip C1 out of Next and into Done, add C1b to Next, add 10b to Next, update the Deferred note about milestone 10.

**In the `## Done` section**, append after `09 Single Post Page`:

```markdown apps/blog/tools/ROADMAP.md
- C1a Content migration, pilot: machinery (app.js reads feed.json index;
  renderPost fetches content/<lang>/<slug>.json; generate-index.js
  reads content/) + 1 EN pilot post. depends on: 09
````

**In the `## Next` section**, replace the `C1` line with:

```markdown apps/blog/tools/ROADMAP.md
- C1b Content migration, remaining 19 EN posts: posts.json ->
  content/en/<slug>.json. Machinery already proven; no app/tool change.
  depends on: C1a
```

**In the `## Next` section**, add (order it just after C1b, before 11):

```markdown apps/blog/tools/ROADMAP.md
- 10b List item as collapsible panel: title toggles the excerpt +
  a "read full post" link (mobile-first; keyboard-accessible). Revisits
  08's list presentation. depends on: C1b
```

**In `## Cross-cutting facts`**, no structural change, but consider adding one line (your call):

```markdown apps/blog/tools/ROADMAP.md
- content/<lang>/<slug>.json is the canonical post source from C1a on;
  feed.json is the derived list index; posts.json is inert (C1a-D3).
```

---

### 4. `apps/blog/tools/milestones/C1b.md` — create

```markdown apps/blog/tools/milestones/C1b.md
# Milestone C1b: Content migration, remaining EN posts

## Scope fence (read first)

C1b moves the remaining 19 EN posts from the interim
assets/data/posts.json into per-post files at
content/en/<slug>.json, following the exact pattern proven in C1a
(content/en/jews-in-palestine-before-israel.json). C1b does NOT touch
app.js, generate-index.js, renderer.js, router.js, style.css, or
index.html — the machinery is already in place and verified. C1b does
NOT add fa/ar/th content (that is milestone 11, human-gated). C1b does
NOT delete posts.json (that is a later cleanup). C1b does NOT change
list/item presentation (that is 10b). C1b is mechanical data migration
with per-post human verification against the live WordPress source.

## Objective

All 20 EN posts exist at content/en/<slug>.json, each byte-faithfully
reproducing its blocks[] from posts.json. feed.json regenerates to 20
entries. The list view shows 20 posts for #/en. No code changes.

## Interfaces (mandatory — a milestone without these is not ready)

### New: apps/blog/content/en/<slug>.json (19 files)

    { "slug": string, "lang": "en", "title": string,
      "date": string, "blocks": [ ... ] }
    NO `excerpt` field (C1a-D5). blocks[] copied verbatim from
    posts.json — same order, same fields, same entity-encoded strings.
    Slugs (19, exact filenames):
      controlling-the-narrative
      a-contemporary-history-of-the-muslim-world-part-22-kosovo-2
      a-contemporary-history-of-the-muslim-world-part-21-bosnia-2
      a-contemporary-history-of-the-muslim-world-part-20-kosovo-1
      a-contemporary-history-of-the-muslim-world-part-19-bosnia-1
      a-contemporary-history-of-the-muslim-world-part-18-algeria-3
      a-contemporary-history-of-the-muslim-world-part-17-algeria-2
      a-contemporary-history-of-the-muslim-world-part-16-algeria-1
      a-contemporary-history-of-the-muslim-world-part-15-the-afghan-arabs-foreign-fighters-in-afghanistan
      a-contemporary-history-of-the-muslim-world-part-14-yemen-2
      protected-a-contemporary-history-of-the-muslim-world-part-13-yemen-1
      a-contemporary-history-of-the-muslim-world-part-12-saudi-arabia-and-the-arab-cold-war
      update
      a-contemporary-history-of-the-muslim-world-11-afghanistan-3
      a-contemporary-history-of-the-muslim-world-contents
      a-contemporary-history-of-the-muslim-world-part-10-afghanistan-pakistan-2
      a-contemporary-history-of-the-muslim-world-part-9-pakistan-1979
      a-contemporary-history-of-the-muslim-world-part-8-afghanistan-1
      a-contemporary-history-of-the-muslim-world-part-7-the-lebanese-civil-war-3
      (plus the pilot, already present, NOT to be re-created)

### Modified: apps/blog/assets/data/feed.json

    Regenerated only — no hand edits. 20 entries after the tool run.

## Files to Create

- apps/blog/content/en/<slug>.json (19 files above)
- apps/blog/HANDOFF-C1b.md (report)

## Files to Modify

- apps/blog/assets/data/feed.json (regenerated by the tool)
- apps/blog/tools/ROADMAP.md (C1b Next -> Done)
- apps/blog/HANDOFF-CURRENT.txt (point at HANDOFF-C1b.md)

## Files I will NOT touch

- apps/blog/assets/js/app.js
- apps/blog/tools/generate-index.js
- apps/blog/assets/js/router.js, renderer.js, nav.js, shell.js, parser.js,
  fetcher.js
- apps/blog/assets/css/style.css
- apps/blog/index.html
- apps/blog/assets/data/posts.json (read-only source)
- apps/blog/tools/LOCKED_DECISIONS.txt, CONTEXT.md, WORKFLOW.md,
  hash-state.js, test-integrity.js

## Decisions frozen for this milestone

- C1b-D1. Follow the C1a pattern exactly: no `excerpt` on content files.
- C1b-D2. blocks[] copied VERBATIM from posts.json. No reformatting, no
  entity decoding, no reordering. The existing entity encoding
  (&#8217; etc.) is intentional and matches the pilot.
- C1b-D3. One post per content file; filename = slug exactly as it
  appears in posts.json.
- C1b-D4. No code change. If a bug is found, it is a deviation to
  report, not a silent fix.
- C1b-D5. Human eyeballs each migrated body against its live WordPress
  post (the verification step that caught three C1a bugs).

## Test Checklist

1. ls apps/blog/content/en/ -> 20 files.
2. For each: node -e JSON.parse ... .blocks.length (no parse errors).
3. node apps/blog/tools/generate-index.js -> "20 entries".
4. cat apps/blog/assets/data/feed.json -> 20 entries, each with a
   derived excerpt; date-descending.
5. grep -c "posts.filter" apps/blog/assets/js/app.js -> exactly 1.
6. node apps/blog/tools/test-integrity.js -> INTEGRITY OK (see caveat:
   does not cover content/ or the tool).
7. Browser #/en -> 20-item list, each with title/excerpt.
8. Browser: open 3-5 posts at random -> render; spot-check bodies.
9. Human verification: each migrated body vs its live WordPress post.
10. git status --porcelain -> exactly C1b's file set.

## Known issues the next chat must NOT mistake for bugs

- Raw ISO dates (11).
- Non-EN lists empty (08 L-4) until 11.
- posts.json still on disk, unread (C1a-D3; cleanup later).
- feed.json name is a misnomer (full index) — rename is later.
- test-integrity.js does not cover content/ or generate-index.js.
```

---

### 5. Commit (WORKFLOW step 6)

Stage explicitly (one `git add` per path; the content path is a directory of files, so add the specific file(s)):

```
git add apps/blog/content/en/jews-in-palestine-before-israel.json
git add apps/blog/assets/js/app.js
git add apps/blog/tools/generate-index.js
git add apps/blog/assets/data/feed.json
git add apps/blog/HANDOFF-C1a.md
git add apps/blog/tools/milestones/C1b.md
git add apps/blog/tools/ROADMAP.md
git add apps/blog/HANDOFF-CURRENT.txt
git status
```

`git status` must show exactly those. Then get the volatile facts:

```
node apps/blog/tools/hash-state.js
git rev-parse HEAD
```

Commit with the body carrying the volatile facts:

```
git commit -m "zabon/blog: C1a content migration pilot (machinery + 1 EN post)" \
           -m "GIT_HEAD=<parent sha from git rev-parse HEAD> GIT_DIRTY=true FILE_TREE_SHA256=<from hash-state.js>"
```
