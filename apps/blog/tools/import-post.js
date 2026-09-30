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

// Part 2: HTML strategy. Faithful extraction. Returns the SAME shape
// extractFromPostsJson returns — { title, date, blocks } — because
// extractBlocks() pipes the result straight into buildContentFile().
// (See the frozen seam note above extractBlocks.) A future chat changes
// ONLY this body. Nothing else changes.
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
      re: /<figure\b[^>]*class="[^"]*\bwp-block-table\b[^"]*"[^>]*>[\s\S]*?<\/figure>/i,
      kind: "table",
    },
    {
      re: /<blockquote\b[^>]*class="[^"]*\bwp-block-quote\b[^"]*"[^>]*>[\s\S]*?<\/blockquote>/i,
      kind: "quote",
    },
    {
      re: /<p\b[^>]*class="[^"]*\bwp-block-paragraph\b[^"]*"[^>]*>[\s\S]*?<\/p>/i,
      kind: "paragraph",
    },
  ];

  let rest = body;
  while (rest.length > 0) {
    let best = null;
    for (const t of TOP) {
      const m = t.re.exec(rest);
      if (m && (best === null || m.index < best.m.index)) best = { t, m };
    }
    if (best === null) break;
    const frag = best.m[0];
    rest = rest.slice(best.m.index + frag.length);
    const block = blockFromFragment(frag, best.t.kind);
    if (block !== null) blocks.push(block);
  }

  if (blocks.length === 0) {
    throw new Error("extractHtmlBlocks: no recognised blocks in entry-content");
  }
  return { title, date, blocks };
}

function firstTitle(html) {
  const m =
    /<h1\b[^>]*class="[^"]*\bentry-title\b[^"]*"[^>]*>([\s\S]*?)<\/h1>/i.exec(
      html,
    );
  if (!m) return "";
  // Pilot stores title with &nbsp; NOT decoded (e.g. "…before&nbsp;Israel"
  // would appear as-is). Keep raw, trim only.
  return m[1].trim();
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
  let i = start;
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
  if (kind === "paragraph") {
    const inner = innerOf(frag, "p");
    if (inner == null) return null;
    return { type: "paragraph", content: inner.trim() };
  }
  if (kind === "imageWrap" || kind === "imageFig") {
    const src = attrOfFirst(frag, "img", "src");
    if (!src) return null;
    const cap = captionOf(frag);
    return { type: "image", src, caption: cap };
  }
  if (kind === "table") {
    const table = extractTable(frag);
    if (table == null) return null;
    return { type: "table", rows: table };
  }
  if (kind === "quote") {
    const inner = innerOf(frag, "blockquote");
    if (inner == null) return null;
    // Preserve nested paragraph content, but strip the wrapping <p>…
    const ps = [];
    const pRe =
      /<p\b[^>]*class="[^"]*\bwp-block-paragraph\b[^"]*"[^>]*>([\s\S]*?)<\/p>/gi;
    let m;
    while ((m = pRe.exec(inner)) !== null) ps.push(m[1].trim());
    const content = ps.length
      ? ps.join("\n")
      : inner.replace(/<[^>]+>/g, "").trim();
    return { type: "quote", content };
  }
  return null;
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
// NOT html-decoded — the source already carries entities and the pilot
// preserves them (e.g. &#8216; &#8217;). Match the pilot byte-for-byte
// on images.
function captionOf(frag) {
  const m = /<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/i.exec(frag);
  if (!m) return "";
  // Strip a single leading/trailing <em>…</em> wrapper if that is all the
  // caption is, to match pilot captions that store the bare text.
  let cap = m[1].trim();
  const em = /^<em\b[^>]*>([\s\S]*?)<\/em>$/i.exec(cap);
  if (em) cap = em[1].trim();
  return cap;
}

// Extract a <table> into an array of rows, each an array of cell strings
// (raw inner HTML, trimmed). Simple, dependency-free.
function extractTable(frag) {
  const tblM = /<table\b[^>]*>([\s\S]*?)<\/table>/i.exec(frag);
  if (!tblM) return null;
  const rows = [];
  const rowRe = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
  let m;
  while ((m = rowRe.exec(tblM[1])) !== null) {
    const cells = [];
    const cellRe = /<(td|th)\b[^>]*>([\s\S]*?)<\/\1>/gi;
    let c;
    while ((c = cellRe.exec(m[1])) !== null) {
      cells.push(c[2].trim());
    }
    rows.push(cells);
  }
  return rows;
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
