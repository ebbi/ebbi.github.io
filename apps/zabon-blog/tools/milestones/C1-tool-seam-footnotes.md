# Milestone C1-tool-seam-footnotes: Extend seam + renderer for core/footnotes; establish fidelity loss ledger

## Scope fence (read first)

This milestone does ONE thing beyond bookkeeping: it teaches the extraction
seam in tools/import-post.js to preserve WordPress `core/footnotes` blocks,
and teaches renderer.js to display them. It does NOT add `core/embed` support
(deferred; see LOSS_LEDGER.md L-002..L-004). It does NOT migrate any post; it
does NOT write to content/. It does NOT touch parser.js, app.js, router.js,
feed.json, or posts.json. It authors a new durable artifact,
tools/LOSS_LEDGER.md, and freezes the replica-fidelity principle in
LOCKED_DECISIONS.txt. It is inserted, out of sequence, between C1-tool-cleanup
and C1b-01, because the C1b-01 recon proved the seam drops a real block type.

## Objective

After this milestone:

- `extractHtmlBlocks()` recognises `<ol class="wp-block-footnotes">…</ol>`
  and emits `{ type: "footnotes", content: <inner HTML without the outer <ol>> }`.
- `renderer.js` renders a `footnotes` block as `<ol class="footnotes">` with
  the inner HTML (including per-`<li>` `id`s) preserved verbatim.
- `--from html` on the pilot-set post controlling-the-narrative yields the
  footnotes block that posts.json omitted (proving the seam fix).
- A durable fidelity ledger exists and records every known loss.
- The replica-fidelity principle and the ledger are frozen decisions.

## Interfaces (mandatory)

### New: apps/blog/tools/LOSS_LEDGER.md

    Append-only Markdown ledger. One row per loss.
    Schema (frozen):
      | id | source | block type | cause | impact | status | resolved-by |
    id:      L-NNN, monotonic, never reused.
    status:  open | deferred | resolved
    A standing note above the table encodes the oracle rule.

### Modified: apps/blog/tools/import-post.js

    extractHtmlBlocks():    add a TOP entry for the footnotes <ol>, and a
                            blockFromFragment() case
                            ("footnotes") -> { type:"footnotes",
                            content:<inner HTML of the <ol>, outer <ol>
                            tag omitted> }   (cf. D-Tool-15 table handling).
    No other function changes.

### Modified: apps/blog/assets/js/renderer.js

    renderBlock(): add a "footnotes" case
      -> const ol = document.createElement("ol");
         ol.className = "footnotes";
         ol.innerHTML = block.content || "";
         return ol;
    No other case changes.

### Modified: apps/blog/tools/LOCKED_DECISIONS.txt

    Two new lines (see Decisions frozen below).

## Files to Create

- apps/blog/tools/milestones/C1-tool-seam-footnotes.md (this file)
- apps/blog/tools/LOSS_LEDGER.md
- apps/blog/HANDOFF-C1-tool-seam-footnotes.md

## Files to Modify

- apps/blog/tools/import-post.js
- apps/blog/assets/js/renderer.js
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/ROADMAP.md
- apps/blog/HANDOFF-CURRENT.txt

## Files I will NOT touch

- apps/blog/assets/data/posts.json (read-only)
- apps/blog/assets/data/feed.json
- apps/blog/content/en/jews-in-palestine-before-israel.json
- apps/blog/assets/js/app.js, router.js, parser.js, fetcher.js, nav.js, shell.js
- apps/blog/tools/generate-index.js, hash-state.js, test-integrity.js
- apps/blog/assets/css/style.css
- apps/blog/index.html
- apps/blog/tools/CONTEXT.md, WORKFLOW.md

## Decisions frozen for this milestone

- NEW-1 Replica fidelity (governs all of C1b and later content work):
  The deployed blog content MUST be a faithful replica of the original
  WordPress blog. Any loss that is, at present, unavoidable MUST be
  recorded in tools/LOSS_LEDGER.md and revisited in a final fidelity
  check before C1b-DONE. Silent loss is prohibited.
  (Extends D-Tool-12 and D-Tool-4; recorded in LOCKED_DECISIONS.txt.)
- NEW-2 Fidelity oracle:
  For fidelity purposes the LIVE HTML extraction (`--from html`) is the
  oracle; posts.json is a lossy interim index. Where they disagree, the
  discrepancy is recorded in LOSS_LEDGER.md and reported, not silently
  reconciled. (Recorded in LOCKED_DECISIONS.txt.)
- NEW-3 Footnotes block shape (analogous to D-Tool-15 table):
  seam emits { type:"footnotes", content:<inner HTML of the
    <ol class="wp-block-footnotes">, WITHOUT the outer <ol> tag> };
    renderer.js renders <ol class="footnotes"> with innerHTML = content,
    preserving per-<li> id attributes and back-link anchors.

## Test Checklist

0. node --check apps/blog/tools/import-post.js -> OK
1. node --check apps/blog/assets/js/renderer.js -> OK
2. node apps/blog/tools/test-integrity.js -> INTEGRITY OK
3. node apps/blog/tools/import-post.js --from html \
    --url https://twolegsbadblog.wordpress.com/2023/11/27/controlling-the-narrative/ \
    --out /tmp/c1-seam-footnotes.json
   -> succeeds; blocks.length >= 10 (footnotes block now captured)
4. node -e "const p=require('/tmp/c1-seam-footnotes.json');
   const f=p.blocks.find(b=>b.type==='footnotes');
   console.log('hasFootnotes',!!f,'contentLen',f?f.content.length:0,
   'hasLiId', f?/id=/.test(f.content):false);"
   -> hasFootnotes true, contentLen > 0, hasLiId true
5. node -e "const p=require('/tmp/c1-seam-footnotes.json');
   const t={}; p.blocks.forEach(b=>t[b.type]=(t[b.type]||0)+1);
   console.log(JSON.stringify(t));"
   -> includes footnotes; no unexpected types
6. head -20 apps/blog/tools/LOSS_LEDGER.md
   -> header + schema + L-001..L-004 visible
7. Browser (maintainer): render /tmp/c1-seam-footnotes.json via the existing
   render path; footnotes render as <ol class="footnotes">, links clickable,
   entities render as punctuation, back-link anchors intact.
8. git status --porcelain -> exactly this milestone's file set

## Known issues the next chat must NOT mistake for bugs

- core/embed is intentionally NOT handled (L-002..L-004, deferred).
- posts.json remains lossy for controlling-the-narrative (9 blocks); the
  seam's live output is expected to be larger. That gap is the POINT of the
  fix, not a regression.
- LOSS_LEDGER.md entry L-001 is marked resolved only after test 4 passes.

````

---

## 2. `apps/blog/tools/import-post.js` — two localized edits

```javascript apps/blog/tools/import-post.js
// ... existing code ...

  const blocks = [];
  const TOP = [
    {
      re: /<div\b[^>]*class="[^"]*\bwp-block-image\b[^"]*"[^>]*>[\s\S]*?<\/div>/i,
      kind: "imageWrap",
    },
    {
      re: /<figure\b[^>]*class="[^"]*\bwp-block-image\b[^"]*"[^>]*>[\s\S]*?<\/figure>/i,
      kind: "imageFig",
    },
    {
      re: /<figure\b[^>]*class="[^"]*\bwp-block-table\b[^"]*"[^>]*>[\s\S]*?<\/figure>/i,
      kind: "table",
    },
    {
      re: /<blockquote\b[^>]*class="[^"]*\bwp-block-quote\b[^"]*"[^>]*>[\s\S]*?<\/blockquote>/i,
      kind: "quote",
    },
    {{ ADD FOOTNOTES ENTRY HERE — placed BEFORE the paragraph entry so the
       <ol> is matched before the paragraph regex can consume surrounding
       prose; see note below. }}
    {
      re: /<p\b[^>]*class="[^"]*\bwp-block-paragraph\b[^"]*"[^>]*>[\s\S]*?<\/p>/i,
      kind: "paragraph",
    },
  ];

// ... existing code ...

function blockFromFragment(frag, kind) {
  if (kind === "paragraph") {
    const inner = innerOf(frag, "p");
    if (inner == null) return null;
    return { type: "paragraph", content: inner.trim() };
  }

  {{ ADD THE footnotes CASE HERE }}

  if (kind === "imageWrap" || kind === "imageFig") {
    // ... existing code ...
  }
  // ... rest of blockFromFragment unchanged ...
}

// ... rest of file unchanged ...
````

I've used placeholders rather than emit the whole ~470-line file and risk an Apply mismatch. Here are the **exact** replacement texts.

**Edit 2a — add to the `TOP` array, between the `quote` entry and the `paragraph` entry:**

```javascript
    {
      re: /<ol\b[^>]*class="[^"]*\bwp-block-footnotes\b[^"]*"[^>]*>[\s\S]*?<\/ol>/i,
      kind: "footnotes",
    },
```

**Why before `paragraph`:** the paragraph regex is non-greedy per-`<p>`, but ordering the more-specific `<ol>` matcher earlier guarantees the `while` loop's "earliest match wins" tie-break can't let a paragraph straddling the footnotes region consume it. (In practice the `<ol>` is at the end, but the ordering is defensive and cheap.)

**Edit 2b — add this case inside `blockFromFragment`, immediately after the `paragraph` block and before the `imageWrap`/`imageFig` block:**

```javascript
if (kind === "footnotes") {
  // NEW-3: mirror the D-Tool-15 table handling. Emit the inner HTML of
  // the <ol class="wp-block-footnotes"> WITHOUT the outer <ol> tag, so
  // renderer.js can attach the content to its own <ol class="footnotes">
  // and preserve per-<li> id anchors.
  const inner = innerOf(frag, "ol");
  if (inner == null) return null;
  return { type: "footnotes", content: inner.trim() };
}
```

`innerOf` already exists (used by the `quote` case) and handles the attribute-bearing outer tag via `<ol\b[^>]*>([\s\S]*?)<\/ol>`. No new helper.

---

## 3. `apps/blog/assets/js/renderer.js` — one new case

Add inside the `switch (block.type)`, after the `quote` case:

```javascript apps/blog/assets/js/renderer.js
      case "quote":
        const blockquote = document.createElement("blockquote");
        // extractHtmlBlocks emits quote.content already stripped of tags but
        // with entities preserved (D-Tool-15) — the shape innerHTML wants.
        blockquote.innerHTML = block.content || "";
        return blockquote;

      {{ ADD FOOTNOTES CASE HERE }}

      case "list":
        // ... existing code ...
```

**Exact text:**

```javascript
      case "footnotes":
        // NEW-3: content is the inner HTML of the source
        // <ol class="wp-block-footnotes"> (outer <ol> omitted by the seam).
        // A classed <ol> lets typography/RTL milestones style it without a
        // renderer change, and preserves per-<li> id anchors for back-links.
        const footnotes = document.createElement("ol");
        footnotes.className = "footnotes";
        footnotes.innerHTML = block.content || "";
        return footnotes;
```

---

## 4. `apps/blog/tools/LOSS_LEDGER.md` (new)

```markdown apps/blog/tools/LOSS_LEDGER.md
# Fidelity Loss Ledger

Standing rule (LOCKED_DECISIONS, NEW-1/NEW-2): the deployed blog content
MUST faithfully replicate the original WordPress blog. The LIVE HTML
extraction (`--from html`) is the fidelity oracle; posts.json is a lossy
interim index. Any loss that is, at present, unavoidable is recorded here
and revisited in a final fidelity check before C1b-DONE. Silent loss is
prohibited.

Schema (append-only; never reuse an id):

| id    | source                                                                              | block type | cause                                               | impact   | status   | resolved-by                          |
| ----- | ----------------------------------------------------------------------------------- | ---------- | --------------------------------------------------- | -------- | -------- | ------------------------------------ |
| L-001 | controlling-the-narrative                                                           | footnotes  | extraction seam dropped core/footnotes (not in TOP) | 1 of 9   | resolved | C1-tool-seam-footnotes               |
| L-002 | a-contemporary-history-...-part-17-algeria-2                                        | embed      | extraction seam cannot extract core/embed           | 1 block  | deferred | milestone when series reaches idx 7  |
| L-003 | a-contemporary-history-...-part-15-the-afghan-arabs-foreign-fighters-in-afghanistan | embed      | extraction seam cannot extract core/embed           | 1 block  | deferred | milestone when series reaches idx 9  |
| L-004 | a-contemporary-history-...-part-8-afghanistan-1                                     | embed      | extraction seam cannot extract core/embed           | 2 blocks | deferred | milestone when series reaches idx 18 |

Notes:

- L-001 is marked resolved only once C1-tool-seam-footnotes test 4 passes
  (hasFootnotes true, contentLen > 0, hasLiId true). If it does not pass,
  set L-001 status back to open with a one-line cause.
- L-002..L-004: `embed` shape was NOT verified this milestone (the
  part-17-algeria-2 URL was not fetchable; WP REST API unavailable). The
  deferred milestone must first obtain a valid embed dump, then either add
  embed support or re-defer with evidence.
- posts.json itself is lossy (it omitted L-001's footnotes). Any future post
  where the live extraction and posts.json disagree gets a new ledger row.
```

Note: L-001's `status: resolved` is set **provisional on test 4**. If test 4 fails, per the note, you flip it back to `open`. This is the one place the ledger asks the human to act on a test result mid-milestone; flagging it explicitly rather than pretending the sequencing can't go wrong.

---

## 5. `apps/blog/tools/LOCKED_DECISIONS.txt` — append two lines

```text apps/blog/tools/LOCKED_DECISIONS.txt
// ... existing content unchanged ...

// ... existing content unchanged ...

Replica fidelity: the deployed blog content MUST faithfully replicate the original WordPress blog; the LIVE HTML extraction (--from html) is the fidelity oracle; posts.json is a lossy interim index. Any currently-unavoidable loss MUST be recorded in tools/LOSS_LEDGER.md and revisited in a final fidelity check before C1b-DONE. Silent loss is prohibited. (NEW-1, NEW-2)
Footnotes block shape: seam emits { type:"footnotes", content:<inner HTML of the <ol class="wp-block-footnotes">, WITHOUT the outer <ol> tag> }; renderer.js renders <ol class="footnotes"> with innerHTML = content, preserving per-<li> id anchors and back-links. (NEW-3)
```

Appended at end of file (the file is a flat line-per-decision record; no headers).

---

## 6. `apps/blog/tools/ROADMAP.md` — insert before C1b-01

```markdown apps/blog/tools/ROADMAP.md
## Next (order per depends-on; each authored at the previous chat's close)

- C1-tool-seam-footnotes Extend extraction seam + renderer for core/footnotes;
  establish tools/LOSS_LEDGER.md. depends on: C1-tool-cleanup
- B1 Renderer remaining block types (pullquote, resourceList, callout,
  footnotes, attachment). depends on: 09

// ... rest of "Next" unchanged ...
```

Add the same entry to **Done** at close, per the ROADMAP's own status convention.

---

## 7. `apps/blog/HANDOFF-CURRENT.txt`

```text apps/blog/HANDOFF-CURRENT.txt
apps/blog/HANDOFF-C1-tool-seam-footnotes.md
```
