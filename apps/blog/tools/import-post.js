#!/usr/bin/env node
"use strict";

/*
 * import-post.js — per-post WordPress importer (C1-tool Part 1)
 *
 * Contract: fetch ONE public WordPress post URL, write ONE content file
 * in the C1a-locked shape { slug, lang:"en", title, date, blocks }.
 * NO excerpt. See tools/milestones/C1-tool.md for the full spec.
 *
 * Part 1 delivers the fetch/cache/write envelope, a --dump-html helper,
 * and a frozen extraction seam with two strategies:
 *   --from posts-json  : read the slug's blocks from
 *                        assets/data/posts.json (offline, deterministic)
 *   --from html        : fetch the URL and extract blocks from raw HTML
 *                        (Part 2; extractHtmlBlocks throws by design)
 *
 * Node 20 built-ins only. No dependencies.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");

const ALLOWED_HOSTS = ["twolegsbadblog.wordpress.com"];

const TOOLS_DIR = __dirname;
const APP_ROOT = path.resolve(TOOLS_DIR, ".."); // apps/blog
const CACHE_DIR = path.join(TOOLS_DIR, ".cache", "import-post");
const POSTS_JSON = path.join(APP_ROOT, "assets", "data", "posts.json");
const CONTENT_EN_DIR = path.join(APP_ROOT, "content", "en");

class UsageError extends Error {}

// ---------------------------------------------------------------- args

function parseArgs(argv) {
  const cfg = {
    url: null,
    slug: null,
    out: null,
    refresh: false,
    allowHost: null,
    from: "posts-json",
    dumpHtml: null,
    help: false,
    _errors: [],
  };
  const want = {
    "--url": "url",
    "--slug": "slug",
    "--out": "out",
    "--allow-host": "allowHost",
    "--from": "from",
    "--dump-html": "dumpHtml",
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--refresh") {
      cfg.refresh = true;
      continue;
    }
    if (a === "--help" || a === "-h") {
      cfg.help = true;
      continue;
    }
    if (Object.prototype.hasOwnProperty.call(want, a)) {
      const v = argv[++i];
      if (v === undefined) {
        cfg._errors.push(`${a} requires a value`);
        continue;
      }
      cfg[want[a]] = v;
      continue;
    }
    cfg._errors.push(`unknown argument: ${a}`);
  }
  if (cfg.from !== "posts-json" && cfg.from !== "html") {
    cfg._errors.push(
      `--from must be "posts-json" or "html" (got "${cfg.from}")`,
    );
  }
  if (cfg._errors.length) {
    throw new UsageError(cfg._errors.join("\n"));
  }
  return cfg;
}

const USAGE = `Usage:
  node apps/blog/tools/import-post.js [options]

Options:
  --url <wp-post-url>   WordPress post URL
  --slug <slug>         Override the derived slug
  --out <path>          Output file (default content/en/<slug>.json)
  --from <strategy>     posts-json (default) | html
  --refresh             Ignore cache; fetch and overwrite cache
  --dump-html <path>    Fetch (or read cached) raw HTML for --url and
                        write it to <path>, then exit 0. No parsing.
                        Use this to obtain one raw WP response for the
                        C1-tool Part 2 extractor without copy/paste.
  --allow-host <host>   Extra allowed host
  -h, --help            Show this message

Strategy:
  posts-json  Read blocks from assets/data/posts.json for --slug.
              Offline, deterministic. Used by the C1b-* series until
              Part 2 lands.
  html        Fetch --url and extract blocks from raw HTML.
              NOT IMPLEMENTED in C1-tool Part 1 (C1-tool Part 2).

Output shape (C1a-locked):
  { "slug": str, "lang": "en", "title": str, "date": str, "blocks": [ ... ] }
  No "excerpt" field.
`;

// ---------------------------------------------------------------- urls

function slugFromUrl(u) {
  const parsed = new URL(u);
  let segs = parsed.pathname.split("/").filter(Boolean);
  const slug = segs.length ? segs[segs.length - 1] : "";
  return decodeURIComponent(slug);
}

function assertAllowedHost(u, allowHost) {
  const parsed = new URL(u);
  if (parsed.protocol !== "https:") {
    throw new UsageError(
      `only https: URLs are allowed (got ${parsed.protocol})`,
    );
  }
  const allow = allowHost ? ALLOWED_HOSTS.concat([allowHost]) : ALLOWED_HOSTS;
  if (!allow.includes(parsed.hostname)) {
    throw new UsageError(
      `host not allowed: ${parsed.hostname}\nallowed: ${allow.join(", ")}`,
    );
  }
}

// --------------------------------------------------------------- cache

function defaultCachePath(url) {
  const h = crypto.createHash("sha256").update(url).digest("hex");
  return path.join(CACHE_DIR, `${h}.html`);
}

async function fetchRaw(url, opts = {}) {
  const refresh = !!opts.refresh;
  const allowHost = opts.allowHost || null;
  assertAllowedHost(url, allowHost);

  const cachePath = defaultCachePath(url);
  if (!refresh && fs.existsSync(cachePath)) {
    const body = fs.readFileSync(cachePath, "utf8");
    return { url, fetchedAt: null, body, cached: true };
  }

  if (typeof fetch !== "function") {
    throw new Error("global fetch() unavailable (Node 20+ required)");
  }
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    throw new Error(`fetch failed: HTTP ${res.status} ${res.statusText}`);
  }
  const body = await res.text();
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(cachePath, body, "utf8");
  return { url, fetchedAt: new Date().toISOString(), body, cached: false };
}

// ---------------------------------------------------- THE SEAM (frozen)

// Part 1: posts-json strategy. Reads blocks for `slug` from posts.json.
// The posts.json entry IS the content body (slug/lang/title/date/blocks).
// We copy blocks verbatim (D-Tool-3) into the locked shape (D-Tool-2).
function extractFromPostsJson(slug) {
  if (!fs.existsSync(POSTS_JSON)) {
    throw new Error(`posts.json not found at ${POSTS_JSON}`);
  }
  const posts = JSON.parse(fs.readFileSync(POSTS_JSON, "utf8"));
  const post = posts.find((p) => p.slug === slug);
  if (!post) throw new Error(`slug not found in posts.json: ${slug}`);
  if (!Array.isArray(post.blocks)) {
    throw new Error(`posts.json entry has no blocks[]: ${slug}`);
  }
  return { title: post.title, date: post.date, blocks: post.blocks };
}

// Part 2: HTML strategy. Faithful extraction (D-Tool-12). Returns the
// SAME shape extractFromPostsJson returns — { title, date, blocks } —
// because extractBlocks() pipes the result straight into
// buildContentFile(). Seam D-Tool-9: only this body changes.
function extractHtmlBlocks(raw /* ctx */) {
  if (typeof raw !== "string" || raw.length === 0) {
    throw new Error("extractHtmlBlocks: empty or non-string HTML");
  }

  const title = firstTitle(raw);
  const date = firstDate(raw);

  const body = sliceEntryContent(raw);
  if (body == null) {
    throw new Error('extractHtmlBlocks: <div class="entry-content"> not found');
  }

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
      // D-Tool-22: legacy WP.com caption-shortcode image markup -
      // <figure data-shortcode="caption" class="wp-caption aligncenter">
      //   <img ...><figcaption class="wp-caption-text">...</figcaption>
      // </figure>
      // The frozen seam had NO rule for this class, so the loop skipped it
      // tag-by-tag and its <img> was silently lost (unrecorded until
      // C1b-09a). Promoted to the EXISTING image shape { type, src, caption }
      // so the renderer (which already consumes it) needs no change. Placed
      // adjacent to imageFig; keys on the "wp-caption" token so both
      // aligncenter/alignnone variants match.
      re: /<figure\b[^>]*class="[^"]*\bwp-caption\b[^"]*"[^>]*>[\s\S]*?<\/figure>/i,
      kind: "wpCaptionFig",
    },
    {
      // D-Tool-26: legacy WP.com image markup - an <img> wrapped in a
      // CLASS-LESS bare <div> with no class attribute at all (e.g.
      // <div><img data-attachment-id="..." class="aligncenter ..." src="..." /></div>).
      // The frozen seam matched NO entry for this class: imageWrap requires
      // class="...wp-block-image..."; the figure.* rules are <figure> rules;
      // the <p> rules are <p> rules. The loop's skip-and-advance logic then
      // dropped the whole <div><img></div> tag-by-tag, silently losing the
      // image (the L-009/L-011 defect shape). Promoted to the EXISTING image
      // shape { type, src, caption } so the renderer needs no change.
      // Keys on a <div> that has NO class attribute (the negative lookahead
      // asserts no "class=" appears in the div open tag) and whose sole child
      // is a single <img .../>. Placed AFTER wpCaptionFig and BEFORE table
      // (i.e. after the image entries and before every <p>-keyed entry) so
      // it claims the bare <div><img></div> case first while leaving every
      // <p> rule byte-identical.
      re: /<div\b(?![^>]*\bclass=)[^>]*>\s*<img\b[^>]*\/?>\s*<\/div>/i,
      kind: "divBareImg",
    },
    {
      // D-Tool-27: legacy WP.com layout table — a CLASS-LESS bare <table>
      // (no class attribute at all) placed directly at top level inside
      // entry-content. Used by the series "contents" post to lay out the
      // series grid (12 rows of link-text | thumbnail cells). The only
      // table rule in the frozen seam keys on <figure class="wp-block-table">;
      // a bare top-level <table> matched NO entry, so the loop's
      // skip-and-advance logic stepped past <table>/<td>/<tr> tag-by-tag,
      // leaking the <td>-nested <p><img> markup into paragraph text (the
      // L-009 defect shape) AND dropping entirely every <img> not wrapped
      // in a <p> (silent loss — invisible to *_para_leftover). Promoted to
      // the EXISTING `table` shape { type:"table", content:<inner HTML> }
      // so the renderer (which does table.innerHTML = block.content) needs
      // no change and the whole grid renders faithfully (links, images and
      // all). Keys on a <table> whose open tag has NO class attribute (the
      // negative lookahead asserts no "class=" appears in the open tag).
      re: /<table\b(?![^>]*\bclass=)[^>]*>[\s\S]*?<\/table>/i,
      kind: "tableBare",
    },
    {
      re: /<figure\b[^>]*class="[^"]*\bwp-block-table\b[^"]*"[^>]*>[\s\S]*?<\/figure>/i,
      kind: "table",
    },
    {
      re: /<blockquote\b[^>]*class="[^"]*\bwp-block-quote\b[^"]*"[^>]*>[\s\S]*?<\/blockquote>/i,
      kind: "quote",
    },
    {
      re: /<ol\b[^>]*class="[^"]*\bwp-block-footnotes\b[^"]*"[^>]*>[\s\S]*?<\/ol>/i,
      kind: "footnotes",
    },
    {
      // D-Tool-21: legacy WP.com embed wrapper (core/embed output).
      //   <div class="jetpack-video-wrapper">
      //     <span class="embed-youtube" style="...">
      //       <iframe class="youtube-player" ...></iframe>
      //     </span>
      //   </div>
      // The frozen seam had no rule for this class, so the loop's skip-and-
      // advance logic dropped the whole embed tag-by-tag (L-004..L-006).
      // blockFromFragment("embed") emits the raw <iframe> markup verbatim;
      // renderer.js already consumes block.type === "embed".
      re: /<div\b[^>]*class="[^"]*\bjetpack-video-wrapper\b[^"]*"[^>]*>[\s\S]*?<\/div>/i,
      kind: "embed",
    },
    {
      re: /<p\b[^>]*class="[^"]*\bwp-block-paragraph\b[^"]*"[^>]*>[\s\S]*?<\/p>/i,
      kind: "paragraph",
    },
    {
      // D-Tool-20: legacy WP.com image markup - an <img> wrapped in a bare
      // <p> (class absent OR lacking "wp-block-"), with no wp-block-image
      // wrapper. Must sit BEFORE paragraphBare so the image is promoted to
      // an `image` block instead of being swallowed as paragraph text.
      // Matches a <p> whose entire content is a single <img .../>.
      re: /<p\b(?![^>]*\bclass="[^"]*\bwp-block-)[^>]*>\s*<img\b[^>]*\/?>\s*<\/p>/i,
      kind: "imageBareP",
    },
    {
      // D-Tool-23: legacy WP.com emph-wrapped image markup -
      // <p ...><em><img ...></em></p> (source of the markdown
      // _![alt](src)_ rendering). An <img> that is the sole child of
      // a bare <p> but WRAPPED in <em>. imageBareP (D-Tool-20) does NOT
      // match it (the <em> sits between <p> and <img>), so paragraphBare
      // (D-Tool-19) would capture it as a paragraph and leave raw <img>
      // markup as text (the L-009 defect shape). Placed AFTER imageBareP
      // and BEFORE paragraphBare so it claims the case first. Reuses the
      // EXISTING image shape via blockFromFragment kind "imageBarePEm".
      re: /<p\b(?![^>]*\bclass="[^"]*\bwp-block-)[^>]*>\s*<em>\s*<img\b[^>]*\/?>\s*<\/em>\s*<\/p>/i,
      kind: "imageBarePEm",
    },
    {
      // D-Tool-28: legacy WP.com <strong>-wrapped image markup —
      // <p ...><strong><img ...></strong></p> (the sole child of a bare
      // <p> is a <strong>-wrapped <img>). The SAME defect shape as D-Tool-23
      // imageBarePEm, but with <strong> instead of <em>. imageBareP
      // (D-Tool-20) does NOT match it (the <strong> sits between <p> and
      // <img>), imageBarePEm (D-Tool-23) keys on <em>, and paragraphBare
      // (D-Tool-19) would then capture the fragment as a paragraph and
      // leave raw <img> markup as text (the L-009 defect shape). Placed
      // AFTER imageBarePEm and BEFORE paragraphBare so it claims the case
      // first. Reuses the EXISTING image shape via blockFromFragment kind
      // "imageBarePStrong".
      re: /<p\b(?![^>]*\bclass="[^"]*\bwp-block-)[^>]*>\s*<strong>\s*<img\b[^>]*\/?>\s*<\/strong>\s*<\/p>/i,
      kind: "imageBarePStrong",
    },
    {
      // D-Tool-24: legacy WP.com bare <p> that BEGINS with a single <img>
      // and CONTINUES with prose inside the SAME <p> (the image is not the
      // sole child, so D-Tool-20 imageBareP does not match; D-Tool-19
      // paragraphBare would otherwise swallow the whole <p>, leaving raw
      // <img ...> markup as paragraph text - the L-009 defect shape).
      // Matches the WHOLE <p>...</p>: blockFromFragment emits TWO blocks -
      // the leading <img> as an image block AND the trailing prose as a
      // paragraph. The leading run is a TEMPERED dot so the match cannot
      // cross an intervening </p>. Placed AFTER imageBareP so a sole-child
      // <p><img></p> stays with D-Tool-20, and BEFORE paragraphBare so it
      // claims the mixed case first.
      re: /<p\b(?![^>]*\bclass="[^"]*\bwp-block-)[^>]*>\s*<img\b[^>]*\/?>(?:(?!<\/p>)[\s\S])*?<\/p>/i,
      kind: "imageBarePTrailing",
    },
    {
      // D-Tool-25: legacy WP.com bare <p> containing prose followed by an
      // inline legacy Jetpack embed NESTED INSIDE the <p>:
      //   <p ...>...prose...
      //     <div class="jetpack-video-wrapper"><span class="embed-youtube"
      //       ...><iframe ...></iframe></span></div></p>
      // D-Tool-21's embed regex matches the <div ...> (a LATER position),
      // but D-Tool-19 paragraphBare matches the enclosing <p> at an EARLIER
      // position and wins, swallowing the prose AND the iframe into
      // paragraph text (iframe_para_leftover = 1). This entry matches the
      // whole <p>; blockFromFragment emits the leading prose as a paragraph
      // AND the raw <iframe> as an embed block (D-Tool-21 semantics).
      // Placed AFTER D-Tool-24 and BEFORE paragraphBare so it claims the
      // case first. CRITICAL: the leading run is a TEMPERED dot
      // ((?:(?!<\/p>)[\s\S])*?) so the match can NEVER cross an intervening
      // </p> - otherwise it would span from the first bare <p> in the body
      // all the way to the jetpack <div>, swallowing every block between.
      re: /<p\b(?![^>]*\bclass="[^"]*\bwp-block-)[^>]*>(?:(?!<\/p>)[\s\S])*?<div\b[^>]*class="[^"]*\bjetpack-video-wrapper\b[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/p>/i,
      kind: "embedInBareP",
    },
    {
      // D-Tool-19: bare <p> directly inside entry-content. Matches a <p ...>
      // whose class attribute is absent OR (if present) does NOT contain
      // "wp-block-". The negative lookahead excludes wp-block-paragraph
      // (owned by the entry above) and any other wp-block-* class. Wrapper
      // blocks are consumed whole, left-to-right, by the loop below, so a
      // <p> nested inside a <blockquote>/<figure>/<div.wp-block-*> is never
      // reached by this rule.
      //
      // D-Tool-20 also narrows this rule's INTENT: a <p> whose sole child
      // is an <img> is NOT a paragraph. The imageBareP entry above claims
      // that case first (it is placed earlier in TOP), so paragraphBare is
      // only reached for genuine prose. The regex below is intentionally
      // left byte-identical so D-Tool-19 prose behaviour is provably
      // unchanged.
      re: /<p\b(?![^>]*\bclass="[^"]*\bwp-block-)[^>]*>[\s\S]*?<\/p>/i,
      kind: "paragraphBare",
    },
  ];

  let pos = 0;
  while (pos < body.length) {
    let best = null;
    for (const t of TOP) {
      const re = new RegExp(t.re.source, "i");
      const m = re.exec(body.slice(pos));
      if (m && (best === null || m.index < best.index)) {
        best = { t, index: m.index, match: m[0] };
      }
    }
    if (best === null) break;
    if (best.index > 0) {
      const rel = pos + best.index;
      const nextLt = body.indexOf("<", pos);
      if (nextLt !== -1 && nextLt < rel) {
        const nextGt = body.indexOf(">", nextLt);
        pos = nextGt !== -1 ? nextGt + 1 : rel;
        continue;
      }
    }
    const block = blockFromFragment(best.match, best.t.kind);
    // D-Tool-24 (imageBarePTrailing) and D-Tool-25 (embedInBareP) yield
    // MORE THAN ONE block (image+paragraph / paragraph+embed). Every other
    // kind returns a single block. Normalise both shapes here.
    if (Array.isArray(block)) {
      for (const b of block) if (b !== null) blocks.push(b);
    } else if (block !== null) {
      blocks.push(block);
    }
    pos += best.index + best.match.length;
  }

  if (blocks.length === 0) {
    throw new Error("extractHtmlBlocks: no recognised blocks in entry-content");
  }
  return { title, date, blocks };
}

// Title: decode ONLY &nbsp; to a single space (D-Tool-16). renderer.js
// uses textContent and performs no decoding, so whatever we emit is what
// the user sees. The C1a pilot has a plain space here because parser.js
// stripHtml ran .replace(/&nbsp;/g," "); we match that. No general
// entity decoder.
function firstTitle(html) {
  const m =
    /<h1\b[^>]*class="[^"]*\bentry-title\b[^"]*"[^>]*>([\s\S]*?)<\/h1>/i.exec(
      html,
    );
  if (!m) return "";
  return m[1].replace(/&nbsp;/g, " ").trim();
}

function firstDate(html) {
  const m =
    /<time\b[^>]*class="[^"]*\bentry-date\b[^"]*\bpublished\b[^"]*"[^>]*datetime="([^"]*)"/i.exec(
      html,
    ) ||
    /<time\b[^>]*datetime="([^"]*)"[^>]*class="[^"]*\bentry-date\b[^"]*\bpublished\b[^"]*"/i.exec(
      html,
    ) ||
    /<time\b[^>]*class="[^"]*\bentry-date\b[^"]*"[^>]*datetime="([^"]*)"/i.exec(
      html,
    );
  return m ? m[1] : "";
}

// ---- helpers (module-local; not exported — the seam is the body only) ----

function sliceEntryContent(html) {
  const open = html.search(
    /<div\b[^>]*class="[^"]*\bentry-content\b[^"]*"[^>]*>/i,
  );
  if (open === -1) return null;
  const startTag = /<div\b[^>]*class="[^"]*\bentry-content\b[^"]*"[^>]*>/i.exec(
    html.slice(open),
  )[0];
  const start = open + startTag.length;
  // Find the matching close by counting <div>/</div> from here.
  let depth = 1;
  const tagRe = /<(\/?)div\b[^>]*>/gi;
  tagRe.lastIndex = start;
  let m;
  while ((m = tagRe.exec(html)) !== null) {
    if (m[1] === "/") {
      depth--;
      if (depth === 0) return html.slice(start, m.index);
    } else {
      depth++;
    }
  }
  return null; // unbalanced; caller errors
}

function blockFromFragment(frag, kind) {
  if (kind === "paragraph" || kind === "paragraphBare") {
    const inner = innerOf(frag, "p");
    if (inner == null) return null;
    return { type: "paragraph", content: inner.trim() };
  }

  // D-Tool-20: legacy <p><img .../></p>. Emit the SAME image shape the
  // renderer already consumes (D-Tool-14): { type:"image", src, caption }.
  // No caption is possible here (there is no <figcaption>), so "".
  if (kind === "imageBareP") {
    const src = attrOfFirst(frag, "img", "src");
    if (!src) return null;
    return { type: "image", src, caption: "" };
  }

  // D-Tool-26: legacy WP.com image wrapped in a CLASS-LESS bare <div>
  // (<div><img .../></div>). Handled IDENTICALLY to imageBareP: emit the
  // SAME EXISTING image shape the renderer already consumes
  // ({ type:"image", src, caption }). No caption is possible (there is no
  // <figcaption>), so "". Kept as a separate kind only so the TOP regex
  // stays independently byte-stable.
  if (kind === "divBareImg") {
    const src = attrOfFirst(frag, "img", "src");
    if (!src) return null;
    return { type: "image", src, caption: "" };
  }

  // D-Tool-23: legacy WP.com emph-wrapped image (<p><em><img></em></p>).
  // Handled IDENTICALLY to imageBareP: same EXISTING image shape, no
  // caption possible (there is no <figcaption>). Kept as a separate kind
  // only so the two TOP regexes stay independently byte-stable.
  if (kind === "imageBarePEm") {
    const src = attrOfFirst(frag, "img", "src");
    if (!src) return null;
    return { type: "image", src, caption: "" };
  }

  // D-Tool-28: legacy WP.com <strong>-wrapped image
  // (<p><strong><img></strong></p>). Handled IDENTICALLY to imageBareP:
  // same EXISTING image shape, no caption possible (there is no
  // <figcaption>). Kept as a separate kind only so the TOP regex stays
  // independently byte-stable.
  if (kind === "imageBarePStrong") {
    const src = attrOfFirst(frag, "img", "src");
    if (!src) return null;
    return { type: "image", src, caption: "" };
  }

  // D-Tool-24: legacy bare <p> that begins with a single <img> and then
  // continues with prose inside the same <p>. The TOP regex matches the
  // WHOLE <p>; emit TWO blocks: the leading <img> as an image block (the
  // SAME EXISTING image shape as imageBareP; no caption possible, there
  // is no <figcaption>) AND the trailing prose as a paragraph (raw inner
  // HTML, tags/entities preserved, trimmed - the SAME semantics as
  // paragraphBare). If there is no prose after the image, emit only the
  // image (never an empty paragraph).
  if (kind === "imageBarePTrailing") {
    const src = attrOfFirst(frag, "img", "src");
    const out = [];
    if (src) out.push({ type: "image", src, caption: "" });
    // Trailing prose: the raw inner HTML of the <p> with the leading
    // <img ...> removed, trimmed. Emitted EXACTLY as paragraphBare would
    // (tags/entities preserved, no stripTags), so inline <a>/<em> in the
    // prose stay faithful (D-Tool-15).
    const pInner = innerOf(frag, "p");
    const prose =
      pInner == null ? "" : pInner.replace(/^\s*<img\b[^>]*\/?>/, "").trim();
    if (prose.length > 0) out.push({ type: "paragraph", content: prose });
    return out.length ? out : null;
  }

  // D-Tool-25: legacy bare <p> containing prose followed by an inline
  // legacy Jetpack embed nested inside the <p>. Emit TWO blocks: the
  // leading prose as a paragraph (raw inner HTML up to the embed,
  // tags/entities preserved, trimmed per D-Tool-15 - the SAME semantics as
  // paragraphBare) AND the raw <iframe ...></iframe> verbatim as an embed
  // block (D-Tool-21 semantics; &#038; preserved). The jetpack div/span
  // chrome is presentational and is NOT emitted. If the leading prose is
  // empty, emit only the embed (never an empty paragraph).
  if (kind === "embedInBareP") {
    const out = [];
    const ifr = /<iframe\b[^>]*>[\s\S]*?<\/iframe>/i.exec(frag);
    const pInner = innerOf(frag, "p");
    // Leading prose = the <p> inner HTML up to (but NOT including) the
    // inline jetpack-video-wrapper div, trimmed. Emitted EXACTLY as
    // paragraphBare would (tags/entities preserved, no stripTags), so
    // inline <a>/<em> in the prose stay faithful (D-Tool-15). If the prose
    // is empty, emit only the embed (never an empty paragraph).
    let lead = "";
    if (pInner != null) {
      const cut = pInner.search(
        /<div\b[^>]*class="[^"]*\bjetpack-video-wrapper\b[^"]*"[^>]*>/i,
      );
      lead = (cut === -1 ? pInner : pInner.slice(0, cut)).trim();
    }
    if (lead.length > 0) out.push({ type: "paragraph", content: lead });
    if (ifr) out.push({ type: "embed", content: ifr[0] });
    return out.length ? out : null;
  }

  if (kind === "footnotes") {
    const fInner = innerOf(frag, "ol");
    if (fInner == null) return null;
    return { type: "footnotes", content: fInner.trim() };
  }
  if (kind === "imageWrap" || kind === "imageFig") {
    const src = attrOfFirst(frag, "img", "src");
    if (!src) return null;
    const cap = captionOf(frag);
    return { type: "image", src, caption: cap };
  }

  // D-Tool-22: legacy WP.com caption-shortcode image. Same shape as
  // imageFig: src verbatim, caption = inner HTML of the first <figcaption>
  // (via captionOf: trimmed, outer <em> unwrapped, entities preserved).
  if (kind === "wpCaptionFig") {
    const src = attrOfFirst(frag, "img", "src");
    if (!src) return null;
    const cap = captionOf(frag);
    return { type: "image", src, caption: cap };
  }

  // D-Tool-21: legacy WP.com embed wrapper. Emit the raw <iframe ...>
  // ...</iframe> markup verbatim (entities preserved). The jetpack
  // div.wp-block-*/span.embed-youtube chrome is presentational and is NOT
  // emitted. renderer.js does embedDiv.innerHTML = block.content, so the
  // iframe renders inside div.embed-container unchanged.
  if (kind === "embed") {
    const ifr = /<iframe\b[^>]*>[\s\S]*?<\/iframe>/i.exec(frag);
    if (!ifr) return null;
    return { type: "embed", content: ifr[0] };
  }
  if (kind === "table") {
    // D-Tool-15: renderer.js does table.innerHTML = block.content, so
    // content is the inner HTML of <table> (the <tr>/<td> markup WITHOUT
    // the outer <table> tag). No `rows` field.
    const tblM = /<table\b[^>]*>([\s\S]*?)<\/table>/i.exec(frag);
    if (tblM == null) return null;
    return { type: "table", content: tblM[1].trim() };
  }

  // D-Tool-27: legacy WP.com CLASS-LESS bare layout <table>. Handled
  // IDENTICALLY to the existing `table` kind (inner HTML of <table>, drop
  // the outer tag, trim) so the renderer needs no change. Kept as a
  // separate kind only so the two TOP regexes stay independently
  // byte-stable.
  if (kind === "tableBare") {
    const tblM = /<table\b[^>]*>([\s\S]*?)<\/table>/i.exec(frag);
    if (tblM == null) return null;
    return { type: "table", content: tblM[1].trim() };
  }
  if (kind === "quote") {
    // D-Tool-15: renderer.js does blockquote.textContent = block.content,
    // so content must be a PLAIN-TEXT string — tags stripped, entities
    // preserved. Multiple nested <p> are joined by "\n".
    //
    // B1b/A-fix: WP.com often carries the visible quote in a trailing
    // <cite> while the <p> is empty (e.g. Netanyahoo quote in
    // controlling-the-narrative). Collect paragraph bodies AND the
    // <cite> text, in source order, and join them; skip empty parts.
    // If still nothing, fall back to the full inner HTML.
    const inner = innerOf(frag, "blockquote");
    if (inner == null) return null;

    const parts = [];
    const partRe =
      /<p\b[^>]*class="[^"]*\bwp-block-paragraph\b[^"]*"[^>]*>([\s\S]*?)<\/p>|<cite\b[^>]*>([\s\S]*?)<\/cite>/gi;
    let m;
    while ((m = partRe.exec(inner)) !== null) {
      const body = m[1] !== undefined ? m[1] : m[2];
      if (body != null && body.trim().length > 0) parts.push(body);
    }
    const joined = parts.length ? parts.join("\n") : inner;
    return { type: "quote", content: stripTags(joined).trim() };
  }
  return null;
}

// Strip HTML tags, collapse whitespace runs to single spaces, trim.
// Entities are PRESERVED (we do not decode &#8217; etc.) — matches the
// C1a pilot and parser.js stripHtml semantics for body text. This is the
// one thing parser.js did NOT do (parser.js replaced &nbsp; too, but that
// only matters for titles, handled in firstTitle).
function stripTags(s) {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();
}

// Return the raw inner HTML of the first <tag>…</tag> in `frag`.
function innerOf(frag, tag) {
  const re = new RegExp(
    "<" + tag + "\\b[^>]*>([\\s\\S]*?)<\\/" + tag + ">",
    "i",
  );
  const m = re.exec(frag);
  return m ? m[1] : null;
}

// Return value of attribute `name` on the first <tag> in `frag`, verbatim.
function attrOfFirst(frag, tag, name) {
  const re = new RegExp("<" + tag + "\\b[^>]*\\b" + name + '="([^"]*)"', "i");
  const m = re.exec(frag);
  return m ? m[1] : null;
}

// Caption: raw inner HTML of <figcaption>, trimmed; "" if absent.
// NOT html-decoded — the source carries entities and the pilot preserves
// them (e.g. &#8216; &#8217;). D-Tool-14 unchanged.
function captionOf(frag) {
  const m = /<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/i.exec(frag);
  if (!m) return "";
  let cap = m[1].trim();
  const em = /^<em\b[^>]*>([\s\S]*?)<\/em>$/i.exec(cap);
  if (em) cap = em[1].trim();
  return cap;
}
function extractBlocks(strategy, { raw, slug }) {
  if (strategy === "posts-json") return extractFromPostsJson(slug);
  if (strategy === "html") return extractHtmlBlocks(raw, { slug });
  throw new UsageError(`unknown strategy: ${strategy}`);
}

function buildContentFile(slug, raw) {
  return {
    slug,
    lang: "en",
    title: raw.title,
    date: raw.date,
    blocks: raw.blocks,
  };
}

// --------------------------------------------------------------- write

function writeAtomic(outPath, obj) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const tmp = `${outPath}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 2) + "\n", "utf8");
  fs.renameSync(tmp, outPath);
}

// ---------------------------------------------------------------- main

async function main(argv) {
  let cfg;
  try {
    cfg = parseArgs(argv);
  } catch (e) {
    if (e instanceof UsageError) {
      process.stderr.write(`${e.message}\n\n${USAGE}`);
      return 2;
    }
    throw e;
  }
  if (cfg.help) {
    process.stdout.write(USAGE);
    return 0;
  }

  // --dump-html: fetch (cache-first) raw HTML for --url, write it out,
  // exit 0. Never parses. Independent of --from.
  if (cfg.dumpHtml) {
    if (!cfg.url) {
      process.stderr.write("error: --dump-html requires --url\n");
      return 2;
    }
    let fetched;
    try {
      fetched = await fetchRaw(cfg.url, {
        refresh: cfg.refresh,
        allowHost: cfg.allowHost,
      });
    } catch (e) {
      process.stderr.write(`error: ${e.message}\n`);
      return 1;
    }
    const outPath = path.resolve(cfg.dumpHtml);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, fetched.body, "utf8");
    process.stdout.write(
      `wrote ${path.relative(process.cwd(), outPath)} ` +
        `(${fetched.body.length} bytes, cached=${!!fetched.cached})\n`,
    );
    return 0;
  }

  let slug = cfg.slug;
  if (!slug) {
    if (!cfg.url) {
      process.stderr.write("error: provide --slug or --url\n\n" + USAGE);
      return 2;
    }
    slug = slugFromUrl(cfg.url);
  }

  let raw = null;
  if (cfg.from === "html") {
    if (!cfg.url) {
      process.stderr.write("error: --from html requires --url\n");
      return 2;
    }
    const fetched = await fetchRaw(cfg.url, {
      refresh: cfg.refresh,
      allowHost: cfg.allowHost,
    });
    raw = fetched.body;
  }

  let parts;
  try {
    parts = extractBlocks(cfg.from, { raw, slug });
  } catch (e) {
    process.stderr.write(`error: ${e.message}\n`);
    return 1;
  }

  const content = buildContentFile(slug, parts);
  const outPath = cfg.out
    ? path.resolve(cfg.out)
    : path.join(CONTENT_EN_DIR, `${slug}.json`);

  writeAtomic(outPath, content);
  process.stdout.write(
    `wrote ${path.relative(process.cwd(), outPath)} ` +
      `(slug=${content.slug} blocks=${content.blocks.length} ` +
      `excerpt=${Object.prototype.hasOwnProperty.call(content, "excerpt")})\n`,
  );
  return 0;
}

if (require.main === module) {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (err) => {
      process.stderr.write(`fatal: ${(err && err.stack) || err}\n`);
      process.exit(1);
    },
  );
}

module.exports = {
  main,
  parseArgs,
  fetchRaw,
  defaultCachePath,
  extractBlocks,
  extractFromPostsJson,
  extractHtmlBlocks,
  buildContentFile,
  slugFromUrl,
  assertAllowedHost,
  UsageError,
};
