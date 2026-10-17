# Milestone C1-tool: Build tools/import-post.js (per-post WordPress importer)

## Scope fence (read first)

C1-tool builds one offline tool that fetches ONE public WordPress post
URL and writes ONE content file at apps/blog/content/en/<slug>.json in
the C1a-locked shape. It does NOT discover posts, does NOT read or
write posts.json (read-only, for reference/fallback), does NOT touch
feed.json, app.js, generate-index.js, renderer.js, router.js, style.css,
or index.html. It does NOT add dependencies. It does NOT decide which
post to import (the C1b-* series does that). It does NOT migrate the 19
posts (that is the C1b-01..19 series). Part 1 (this chat) delivers the
fetch/cache/write envelope plus an inspectable extraction seam with an
offline fallback to posts.json. Part 2 (next chat) wires the real
HTML->blocks extractor, gated on the maintainer pasting one raw WP
response.

## Objective

A runnable apps/blog/tools/import-post.js that:
- accepts --url (WP post), optional --slug, --out, --refresh,
  --dump-html, --allow-host;
- is offline/cache-first with --refresh (LOCKED_DECISIONS);
- default-deny host allowlist (twolegsbadblog.wordpress.com);
- writes { slug, lang:"en", title, date, blocks }, NO excerpt;
- writes atomically (.tmp then rename); never a partial file;
- exposes one clearly-marked extraction function so the Part 2 chat
  replaces exactly one function body, nothing else.

## Interfaces (mandatory)

### New: apps/blog/tools/import-post.js

    // CLI
    //   node import-post.js --url <WP URL> [--slug s] [--out p]
    //                       [--from posts-json|html] [--refresh]
    //                       [--dump-html path] [--allow-host h]
    // Exported (module) surface for future tooling reuse:
    module.exports = { main, parseArgs, fetchRaw, defaultCachePath,
                       extractBlocks, extractFromPostsJson,
                       extractHtmlBlocks, buildContentFile, slugFromUrl,
                       assertAllowedHost, UsageError };

    // One-line contract per exported symbol:
    //   parseArgs(argv)        -> cfg object  (throws UsageError on bad args)
    //   slugFromUrl(url)       -> trailing path segment, normalized
    //   fetchRaw(url, opts)    -> { url, fetchedAt, body }   (string body)
    //                             cache-first unless opts.refresh
    //   defaultCachePath(url)  -> tools/.cache/import-post/<sha256(url)>.html
    //   extractBlocks(strat,ctx) -> { title, date, blocks }
    //   extractFromPostsJson(slug) -> { title, date, blocks }   (Part 1, live)
    //   extractHtmlBlocks(raw,ctx) -> blocks[]   <-- THE SEAM (Part 2)
    //   buildContentFile(slug, raw) -> content object (no excerpt)
    //   main(argv)             -> exit code

    // Extraction seam: Part 1 has TWO strategies, chosen by --from:
    //   --from posts-json  (default): read slug's blocks from
    //       apps/blog/assets/data/posts.json (offline, deterministic).
    //       This is how T3/T4/T5 pass today.
    //   --from html: fetch the URL and extract blocks from the raw
    //       HTML via extractHtmlBlocks(raw). Part 2 fills the body of
    //       extractHtmlBlocks; Part 1 throws a clear
    //       "HTML extraction not implemented yet (C1-tool Part 2)".
    // A future chat changes ONLY extractHtmlBlocks' body. The seam is
    // frozen.

    // --dump-html <path>: fetch (cache-first) raw HTML for --url,
    //   write it to <path>, exit 0, never parse. The clean way to
    //   obtain the one raw WP response Part 2 needs.

### Modified: apps/blog/HANDOFF-CURRENT.txt

    Single newline-terminated line:
    apps/blog/HANDOFF-C1-tool.md

### Modified: apps/blog/tools/ROADMAP.md

    Insert C1-tool before C1b; record that C1b.md is superseded by
    C1-tool + C1b-01..19 + C1b-DONE.

### Modified: apps/blog/tools/milestones/C1b.md

    Header line only: "SUPERSEDED by C1-tool + C1b-01..19 + C1b-DONE".

## Files to Create

- apps/blog/tools/import-post.js
- apps/blog/tools/milestones/C1-tool.md (this file)
- apps/blog/HANDOFF-C1-tool.md

## Files to Modify

- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/tools/ROADMAP.md
- apps/blog/tools/milestones/C1b.md (SUPERSEDED header only)

## Files I will NOT touch

- apps/blog/assets/data/posts.json (read-only fallback source; NOT deleted)
- apps/blog/assets/data/feed.json
- apps/blog/content/en/jews-in-palestine-before-israel.json (reference)
- apps/blog/assets/js/*  (app, renderer, router, nav, shell, parser, fetcher)
- apps/blog/tools/generate-index.js, hash-state.js, test-integrity.js
- apps/blog/assets/css/style.css
- apps/blog/index.html
- apps/blog/tools/LOCKED_DECISIONS.txt, CONTEXT.md, WORKFLOW.md

## Decisions frozen for this milestone

- D-Tool-1  One post per invocation; atomic write (.tmp + rename).
- D-Tool-2  Output shape = C1a-locked; NO excerpt; lang:"en".
- D-Tool-3  blocks[] verbatim; no reorder/dedupe/normalise/decode.
- D-Tool-4  Pilot file is the reference; diffs are REPORTED not
            silently reconciled.
- D-Tool-5  Cache-first; --refresh; cache under
            tools/.cache/import-post/ (raw body, not parsed output).
- D-Tool-6  Scope fence: one URL -> one file; nothing else.
- D-Tool-7  Node 20 built-ins only; zero npm.
- D-Tool-8  Default-deny host allowlist (twolegsbadblog.wordpress.com);
            https only.
- D-Tool-9  Extraction seam is frozen. Two strategies selected by
            --from: "posts-json" (default, offline, deterministic)
            and "html" (Part 2). The two bodies are
            extractFromPostsJson() and extractHtmlBlocks(). A single
            future chat fills ONLY extractHtmlBlocks().
- D-Tool-10 Part 1 does not claim HTML extraction works. T3-T5 are run
            with --from posts-json against the pilot slug. T6 with
            --from html is EXPECTED to fail until Part 2; that is a
            known, documented state, not a bug.
- D-Tool-11 --dump-html <path> fetches (cache-first) raw HTML for
            --url, writes it to <path>, exits 0, never parses. It is
            the sanctioned way to produce the Part 2 input.

## Test Checklist

Part 1 (this chat, runnable now):
0. node apps/blog/tools/import-post.js --dump-html /tmp/pilot.html \
     --url https://twolegsbadblog.wordpress.com/2024/04/03/jews-in-palestine-before-israel/ \
     --refresh
     -> exit 0, writes /tmp/pilot.html, prints byte count.
     File must start with "<!DOCTYPE html" or "<!doctype html".
     This is the raw WP response Part 2 needs.
1. node --check apps/blog/tools/import-post.js
2. node apps/blog/tools/import-post.js --help  -> usage (lists --dump-html)
3. node apps/blog/tools/import-post.js --from posts-json \
     --slug jews-in-palestine-before-israel --out /tmp/pilot.json
4. node -e "const p=require('/tmp/pilot.json'); console.log(p.slug,
     p.lang, p.blocks.length,
     Object.prototype.hasOwnProperty.call(p,'excerpt'))"
     -> jews-in-palestine-before-israel en 30 false
5. diff /tmp/pilot.json apps/blog/content/en/
     jews-in-palestine-before-israel.json  -> expected EMPTY
6. node apps/blog/tools/import-post.js --from html --url
     https://twolegsbadblog.wordpress.com/2024/04/03/jews-in-palestine-before-israel/
     -> EXPECTED to exit non-zero:
        "HTML extraction not implemented yet (C1-tool Part 2)".
        Documented, not a bug (D-Tool-10).
7. node apps/blog/tools/test-integrity.js -> INTEGRITY OK
8. git status --porcelain -> exactly this milestone's file set

Part 2 (next chat, gated on raw HTML paste):
9.  --from html against the pilot -> blocks.length === 30
10. diff against pilot content file -> empty (or reported)

## Known issues the next chat must NOT mistake for bugs

- --from html intentionally unimplemented in Part 1 (D-Tool-10).
- posts.json is read by the posts-json strategy; it is NOT deleted
  (delete-deferral until C1b-DONE).
- .gitignore existence unverified; if absent, tools/.cache/ is
  untracked and recorded as an open warning, not auto-created.
- hash-state.js output keys still unverified; handoff hash block
  filled at handoff time.
