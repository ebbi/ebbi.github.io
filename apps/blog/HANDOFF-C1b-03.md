# HANDOFF — C1b-03: Extend the D-Tool-9 seam (D-Tool-20) for legacy bare `<p><img>` images

## Status
DONE. No slug was migrated this milestone (that was the original C1b-03 intent,
re-scoped at recon). part-22 migration is deferred to C1b-04.

## What C1b-03 actually did
The milestone was opened to "migrate the next EN slug from the live HTML".
Read-only recon on the selected slug (`a-contemporary-history-of-the-muslim-world-part-22-kosovo-2`)
found a live census of **59 blocks, all typed `paragraph`** — but **4 of those
"paragraphs" were actually bare `<p><img class="wp-image-..."></p>` images**
(kosovo.png, miners.png, holbrookekla.jpg, screenshot-from-2019-11-13-121142.png).
The D-Tool-9 seam, even after D-Tool-19, had no rule for inline images that are
wrapped in a bare `<p>` with no `wp-block-image` wrapper; D-Tool-19's bare-`<p>`
rule had swallowed them as paragraph text, so a reader would have seen raw
`<img .../>` markup instead of a picture.

Per the project rule that a new structural class is a SEPARATE, narrow
extension of the D-Tool-9 freeze (as D-Tool-18 and D-Tool-19 were), C1b-03 was
re-scoped into a seam-extension milestone. It migrated nothing; it extended the
seam and deferred part-22 to C1b-04.

## The seam change (D-Tool-20)
`tools/import-post.js`, `extractHtmlBlocks()` TOP list and `blockFromFragment()`:
- New TOP entry, placed AFTER the `wp-block-paragraph` entry and BEFORE the
  `paragraphBare` entry:
  `re: /<p\b(?![^>]*\bclass="[^"]*\bwp-block-)[^>]*>\s*<img\b[^>]*\/?>\s*<\/p>/i`,
  `kind: "imageBareP"`.
- New `blockFromFragment()` case for `imageBareP`: reuses the existing image
  shape `{ type:"image", src:<img src verbatim>, caption:"" }` (D-Tool-14).
- The `paragraphBare` regex is left **byte-identical**; the new entry simply
  claims the `<p><img>` case first, by ordering.
- Rationale and full text: `tools/LOCKED_DECISIONS.txt` (D-Tool-20), ledger
  `tools/LOSS_LEDGER.md` (L-009).

## Evidence (live, this session)
- part-22 recon (`--from html`): `blocks=59`, census before fix
  `{paragraph:59}`; after fix `{image:4,paragraph:55}`, `total 59`,
  `img_para_leftover=0`.
- Non-regression, all `--from html`, unchanged:
  - `jews-in-palestine-before-israel` 80 `{image:15,paragraph:62,quote:2,table:1}`
  - `controlling-the-narrative` 34 `{image:5,paragraph:24,quote:4,footnotes:1}`,
    quote[3] len = 240 (D-Tool-18 canary)
  - `update` 2 `{paragraph:2}`
- `tools/test-integrity.js` → INTEGRITY OK.

## Files changed this milestone
- `apps/blog/tools/import-post.js` (seam: D-Tool-20)
- `apps/blog/tools/LOCKED_DECISIONS.txt` (D-Tool-20 entry)
- `apps/blog/tools/LOSS_LEDGER.md` (L-009 row + note)
- `apps/blog/tools/ROADMAP.md` (C1b-03 → Done; C1b-04 → Next; removed duplicate
  `C1-tool-seam-complete` from Next; seam fact Two → Three extensions)
- `apps/blog/HANDOFF-CURRENT.txt` (pointer → this file)
- `apps/blog/HANDOFF-C1b-03.md` (this file)
- `apps/blog/tools/milestones/C1b-04.md` (authored at close, WORKFLOW step 7)

**Not changed:** no `content/en/*.json` (nothing migrated); `assets/data/feed.json`
unchanged at 3 entries; `posts.json` untouched (read-only, order only).

## Process notes / pitfalls discovered (IMPORTANT for future chats)
1. **ROADMAP.md on-disk whitespace does not survive copy into the chat.**
   Four anchor misses occurred, all silent-whitespace-class. Root cause: the
   seam-fact continuation lines are **two-space indented** inside the
   Cross-cutting section (and similar continuations elsewhere). Future edits to
   `ROADMAP.md` (and any `tools/*.md`) must anchor from `sed -n 'A,Bp' FILE | cat -A`
   or `hexdump -C`, never from pasted transcript text. Prefer line-number or
   `Buffer`-level edits with raw-equality assertions.
2. **Never use a giant inline multi-line `node -e` for edits.** The first patch
   attempt doubled every insertion (the command/heredoc was executed twice; the
   shell's history caused a re-run). The robust pattern that worked here:
   write a small script to `/tmp/*.js` with `cat > … <<'EOF'` (one command),
   `node --check` it, then run it once — with idempotency guards ("abort if the
   new marker is already present") and pre/post anchor-count assertions.
3. **The Apply mechanism is not used for `tools/*.md` / `tools/*.txt`**; it has
   corrupted `*`→`_` before. Use terminal `cat >>`/scripts + verify with
   `git diff` and `grep -o … | wc -l`.
4. **`git checkout -- <file>` is the recovery** for a corrupted working file
   (we used it once, cleanly).
5. The stale "## The commit" line in `HANDOFF-C1b-seam-bare-p.md` (pointed at
   50ffad5) is still stale; the true HEAD at C1b-03 open was `dc39e40`.
   (Not fixed in C1b-03; flagging so the next chat reconciles it or fixes it.)

## What the next milestone (C1b-04) must do
Migrate `a-contemporary-history-of-the-muslim-world-part-22-kosovo-2` from the
live HTML (`--from html`) into `content/en/`, generate `feed.json` (now 4
entries), and prove the census `{image:4,paragraph:55}` (59 blocks) against the
live source. Then re-run non-regression on the three migrated slugs. See
`tools/milestones/C1b-04.md`.
