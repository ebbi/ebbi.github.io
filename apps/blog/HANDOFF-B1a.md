HANDOFF — Chat B1a: Renderer injection consistency + caption entity decode

Status: complete
Current chat id: B1a
Current milestone: B1a
Completed milestones: 00,01,02,03,04,05a,05a-fix,05b-removal,W1,W1-fix,
06,06b,07,08,09,C1a,C1-tool,C1-tool-p2,C1-model,C1-tool-cleanup,B1a
Next chat id: C1b-01
Context windows used: 1

## Files created/modified (exact paths)

- Modified: apps/blog/assets/js/renderer.js — renderBlock(): paragraph,
  heading, and quote switched from textContent to innerHTML (trusted-markup
  contract; see Frozen decisions). figcaption and img.alt now assigned via
  new module-scope decodeEntities() helper (textarea.innerHTML -> .value);
  caption field stays plain-text, no tag interpretation. figcaption was NOT
  switched to innerHTML.
- Created: apps/blog/HANDOFF-B1a.md (this file).
- Modified: apps/blog/HANDOFF-CURRENT.txt (points at this handoff).
- NOT modified: import-post.js, content/en/jews-in-palestine-before-israel.json,
  LOCKED_DECISIONS.txt, ROADMAP.md, any tools/ file, parser.js, router.js,
  app.js, index.html, style.css, posts.json, feed.json.

## THE HEADLINE

- The regenerated pilot (C1-tool-cleanup, 80 blocks) exposed that renderer.js
  was escaping intended markup in paragraphs. Several ~62 paragraphs carry
  <em>, <a href>, and <strong>, plus HTML character references; textContent
  displayed all of these as literal tag text to the reader. The pilot was
  visibly broken in the browser, not merely theoretically inconsistent.
- Cause was pre-existing renderer asymmetry, not a regression from
  C1-tool-cleanup: innerHTML for list/table/embed (lines 81/86/95) vs
  textContent for paragraph/heading/image-caption/quote (48/54/67/74), with
  the line-80 comment already stating the trusted-pipeline rationale that
  applied equally to the four.
- Fix is renderer-only. No pipeline, seam, schema, or content change.

## Frozen decisions made in this chat

- B1a-D1 Renderer injection rule, now uniform:
  - Trusted markup fields (paragraph.content, heading.content,
    quote.content, list.content, table.content, embed.content): innerHTML.
  - Plain-text fields (image.caption, image alt): textContent, preceded by
    decodeEntities() so character references (&#8217; etc.) render as
    punctuation rather than literal sequences.
    Rationale: content/<lang>/<slug>.json is authored/committed via the
    import-post.js pipeline; there is no user-submitted input on the render
    path. This restates and extends the line-80 comment.
- B1a-D2 decodeEntities() implemented via detached <textarea>: value is
  defined as text after entity decoding and tag-stripping, so it decodes
  entities and cannot surface a tag. Chosen over innerHTML-div for the
  plain-text fields to keep the two-field distinction explicit.
- B1a-D3 quote.content stays on innerHTML (treated as trusted markup like
  paragraph), NOT routed through decodeEntities. Per D-Tool-15 the extractor
  already strips tags from quote content, so the two are visually equivalent
  for current data; innerHTML is the shape that survives a future tag in a
  quote, matching how paragraphs are handled. Open sub-point below.

Open sub-point (not frozen, flagged for the record): if a future import
leaves a tag inside quote.content, innerHTML will honour it. If that is
undesirable, quote should move to decodeEntities. Deferred; no current data
triggers it.

## Hashes (inputs only — see tools/WORKFLOW.md, convention (b))

LOCKED_DECISIONS_SHA256=ee3428ab7e74d9cc24db22856aeceee03972267ae85770c6e19f55fcaf24b0cd
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256= OMITTED (Option 2 — no tools/schema.json)

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, per WORKFLOW.md step 6.

## Expected delta for the next chat

- C1b-01 (first of the C1b-01..19 series): migrate the NEXT EN post from
  posts.json -> content/en/<slug>.json, exactly as C1-tool-cleanup projected.
  B1a inserted no new milestone and did not consume C1b-01. C1b-01's
  milestone file is authored at C1b-01's own close, NOT now.
- C1b should still check whether any of the 19 posts contains WP block types
  outside extractHtmlBlocks' TOP list (heading, list, divider, embed,
  gallery, pullquote, callout, resourceList, footnotes, attachment) — carried
  forward unchanged from C1-tool-cleanup's Known issues.

## Human edits made outside tooling (structured)

- Maintainer identified the renderer asymmetry (B1a) from the live pilot,
  supplied the pilot URL, and proposed the "make the four match the three"
  framing. AI narrowed it: paragraph/heading/quote to innerHTML only;
  caption kept textContent.
- Maintainer ran all syntax/integrity checks and all browser checks; pasted
  outputs. Confirmed caption entity defect (&#8216; literal) and the
  subsequent fix.
- Maintainer chose to stay in chat mode; no Agent Mode (model warning).

## Open warnings (count + links only)

- W2. hash-state.js output keys still unverified; hash block filled at
  handoff time (inputs only, per convention (b)).
- W8. tools/import-post.md stray — status: see Known issues.

## Deviations from locked decisions

- One: B1a was executed as an out-of-sequence insertion between
  C1-tool-cleanup and C1b-01; it was not named as "Next chat id" by the
  previous handoff (which named C1b-01). Reason: the regenerated pilot
  surfaced a live rendering defect. Reported here, not hidden. C1b-01 remains
  the next chat id. No LOCKED_DECISIONS entry was edited, so D-Tool-12/15/
  16/17 are untouched; B1a-D1..D3 are recorded here only.

## Partial work

- None.

## Blocked reason

- (n/a — status complete)

## Known issues / TODOs

- B1a-D3 open sub-point (above): quote.content tag-in-data case.
- Typography and page layout need improvement (maintainer, this chat).
  Forward concern, not a B1a defect. Natural home is 12a/12b RTL &
  Typography; noted so it is not lost.
- C1b-01..19 + C1b-DONE not authored.
- extractHtmlBlocks covers image/paragraph/quote/table only; other WP block
  types would be silently dropped. Carried forward for C1b (unchanged).
- W8: tools/import-post.md — resolve (rm or keep-untracked) before staging
  a milestone. NOTE: B1a does not stage it; see Test checklist item 4.
- test-integrity.js does not cover renderer.js, content/, or tools/.cache/.

## Assumptions the next chat may rely on

- Seam frozen (D-Tool-9); extractHtmlBlocks untouched by B1a.
- Pilot content file is unchanged since C1-tool-cleanup (80 blocks).
- Renderer now displays paragraph/heading/quote markup and decodes
  caption entities; verified in-browser on the pilot.
- posts.json stays on disk until C1b-DONE proves 20/20.
- Host allowlist = twolegsbadblog.wordpress.com, https only.
- Cache is ignored at apps/blog/.gitignore (D-Tool-17).

## Test checklist result (pass/fail per item)

0. node --check renderer.js -> SYNTAX OK: PASS.
1. test-integrity.js -> INTEGRITY OK: PASS (after both edits).
2. Browser, paragraph/heading/quote markup: PASS — <em> italic, <strong>
   bold, <a href> links clickable (controlling-the-narrative, Verso Books,
   Wikimedia), curly entities render as punctuation.
3. Browser, caption negative check: FAILED first pass (literal &#8216; in
   Western Wall caption) -> decodeEntities() added -> PASS on re-check;
   Ottoman, Madaba, al-Andalus/chess, Ramban captions also PASS.
4. Browser, img.alt decoded (curly quotes, not &#8216;): PASS.
5. Regression re-check after caption edit (items 2 above) still PASS.
6. git status --porcelain (see §stage) — expected set is renderer.js,
   HANDOFF-B1a.md, HANDOFF-CURRENT.txt only. Not run at handoff time;
   run at stage. W8 stray NOT staged.

## Files to read in the next chat (exact paths)

- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-B1a.md
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/ROADMAP.md
- apps/blog/tools/milestones/C1-tool.md
- apps/blog/tools/import-post.js
- apps/blog/assets/js/renderer.js (as modified)
- apps/blog/content/en/jews-in-palestine-before-israel.json (reference)
- apps/blog/assets/data/posts.json (read-only; C1b path option)

````

## 2. `apps/blog/HANDOFF-CURRENT.txt`

Overwrite with exactly this one newline-terminated line:

```text apps/blog/HANDOFF-CURRENT.txt
apps/blog/HANDOFF-B1a.md
````

## 3. Fallback heredoc for §1 (only if Apply fails on the large new file)

```sh
cat > apps/blog/HANDOFF-B1a.md <<'EOF'
HANDOFF — Chat B1a: Renderer injection consistency + caption entity decode

Status: complete
Current chat id: B1a
Current milestone: B1a
Completed milestones: 00,01,02,03,04,05a,05a-fix,05b-removal,W1,W1-fix,
  06,06b,07,08,09,C1a,C1-tool,C1-tool-p2,C1-model,C1-tool-cleanup,B1a
Next chat id: C1b-01
Context windows used: 1

...PASTE FULL BODY FROM §1 HERE...

EOF
wc -l apps/blog/HANDOFF-B1a.md
head -3 apps/blog/HANDOFF-B1a.md
```

(If you use the heredoc, paste the whole §1 markdown between the markers — I can emit the full heredoc verbatim if the Apply button misbehaves.)

## 4. Stage, commit, close

One `git add` per path (so a missing path cannot abort the whole stage), then exactly the milestone's files:

```sh
git add apps/blog/assets/js/renderer.js
git add apps/blog/HANDOFF-B1a.md
git add apps/blog/HANDOFF-CURRENT.txt

git status --porcelain
```

`git status` must show **only** those three as staged, and **must not** stage `apps/blog/tools/import-post.md` (the W8 stray). If W8 appears as `??` untracked, leave it — do not `git add` it. Expected output shape:

```
M  apps/blog/HANDOFF-CURRENT.txt
A  apps/blog/HANDOFF-B1a.md
M  apps/blog/assets/js/renderer.js
?? apps/blog/tools/import-post.md   <- leave alone
```

Then get the parent SHA and commit:

```sh
git rev-parse HEAD
```

```sh
git commit -m "zabon/blog: B1a renderer injection consistency + caption entity decode" \
           -m "GIT_HEAD=<parent sha from above> GIT_DIRTY=true FILE_TREE_SHA256=<hex from hash-state.js>"
```

`GIT_DIRTY=true` is the expected final value per convention (b). Get the `FILE_TREE_SHA256` from `node apps/blog/tools/hash-state.js` — do not compute it by hand.

Then:

```sh
git status --porcelain
```
