#!/usr/bin/env node
'use strict';

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

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');

const ALLOWED_HOSTS = ['twolegsbadblog.wordpress.com'];

const TOOLS_DIR = __dirname;
const APP_ROOT = path.resolve(TOOLS_DIR, '..');           // apps/blog
const CACHE_DIR = path.join(TOOLS_DIR, '.cache', 'import-post');
const POSTS_JSON = path.join(APP_ROOT, 'assets', 'data', 'posts.json');
const CONTENT_EN_DIR = path.join(APP_ROOT, 'content', 'en');

class UsageError extends Error {}

// ---------------------------------------------------------------- args

function parseArgs(argv) {
  const cfg = {
    url: null,
    slug: null,
    out: null,
    refresh: false,
    allowHost: null,
    from: 'posts-json',
    dumpHtml: null,
    help: false,
    _errors: [],
  };
  const want = {
    '--url': 'url',
    '--slug': 'slug',
    '--out': 'out',
    '--allow-host': 'allowHost',
    '--from': 'from',
    '--dump-html': 'dumpHtml',
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--refresh') { cfg.refresh = true; continue; }
    if (a === '--help' || a === '-h') { cfg.help = true; continue; }
    if (Object.prototype.hasOwnProperty.call(want, a)) {
      const v = argv[++i];
      if (v === undefined) { cfg._errors.push(`${a} requires a value`); continue; }
      cfg[want[a]] = v;
      continue;
    }
    cfg._errors.push(`unknown argument: ${a}`);
  }
  if (cfg.from !== 'posts-json' && cfg.from !== 'html') {
    cfg._errors.push(`--from must be "posts-json" or "html" (got "${cfg.from}")`);
  }
  if (cfg._errors.length) {
    throw new UsageError(cfg._errors.join('\n'));
  }
  return cfg;
}

const USAGE =
`Usage:
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
  let segs = parsed.pathname.split('/').filter(Boolean);
  const slug = segs.length ? segs[segs.length - 1] : '';
  return decodeURIComponent(slug);
}

function assertAllowedHost(u, allowHost) {
  const parsed = new URL(u);
  if (parsed.protocol !== 'https:') {
    throw new UsageError(`only https: URLs are allowed (got ${parsed.protocol})`);
  }
  const allow = allowHost ? ALLOWED_HOSTS.concat([allowHost]) : ALLOWED_HOSTS;
  if (!allow.includes(parsed.hostname)) {
    throw new UsageError(
      `host not allowed: ${parsed.hostname}\nallowed: ${allow.join(', ')}`);
  }
}

// --------------------------------------------------------------- cache

function defaultCachePath(url) {
  const h = crypto.createHash('sha256').update(url).digest('hex');
  return path.join(CACHE_DIR, `${h}.html`);
}

async function fetchRaw(url, opts = {}) {
  const refresh = !!opts.refresh;
  const allowHost = opts.allowHost || null;
  assertAllowedHost(url, allowHost);

  const cachePath = defaultCachePath(url);
  if (!refresh && fs.existsSync(cachePath)) {
    const body = fs.readFileSync(cachePath, 'utf8');
    return { url, fetchedAt: null, body, cached: true };
  }

  if (typeof fetch !== 'function') {
    throw new Error('global fetch() unavailable (Node 20+ required)');
  }
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) {
    throw new Error(`fetch failed: HTTP ${res.status} ${res.statusText}`);
  }
  const body = await res.text();
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(cachePath, body, 'utf8');
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
  const posts = JSON.parse(fs.readFileSync(POSTS_JSON, 'utf8'));
  const post = posts.find((p) => p.slug === slug);
  if (!post) throw new Error(`slug not found in posts.json: ${slug}`);
  if (!Array.isArray(post.blocks)) {
    throw new Error(`posts.json entry has no blocks[]: ${slug}`);
  }
  return { title: post.title, date: post.date, blocks: post.blocks };
}

// Part 2: HTML strategy. NOT IMPLEMENTED in Part 1 (C1-tool.md D-Tool-10).
// A future chat replaces ONLY this body. Nothing else changes.
function extractHtmlBlocks(/* raw, ctx */) {
  throw new Error('HTML extraction not implemented yet (C1-tool Part 2)');
}

function extractBlocks(strategy, { raw, slug }) {
  if (strategy === 'posts-json') return extractFromPostsJson(slug);
  if (strategy === 'html') return extractHtmlBlocks(raw, { slug });
  throw new UsageError(`unknown strategy: ${strategy}`);
}

function buildContentFile(slug, raw) {
  return {
    slug,
    lang: 'en',
    title: raw.title,
    date: raw.date,
    blocks: raw.blocks,
  };
}

// --------------------------------------------------------------- write

function writeAtomic(outPath, obj) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const tmp = `${outPath}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 2) + '\n', 'utf8');
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
      process.stderr.write('error: --dump-html requires --url\n');
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
    fs.writeFileSync(outPath, fetched.body, 'utf8');
    process.stdout.write(
      `wrote ${path.relative(process.cwd(), outPath)} ` +
      `(${fetched.body.length} bytes, cached=${!!fetched.cached})\n`);
    return 0;
  }

  let slug = cfg.slug;
  if (!slug) {
    if (!cfg.url) {
      process.stderr.write('error: provide --slug or --url\n\n' + USAGE);
      return 2;
    }
    slug = slugFromUrl(cfg.url);
  }

  let raw = null;
  if (cfg.from === 'html') {
    if (!cfg.url) {
      process.stderr.write('error: --from html requires --url\n');
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
    `excerpt=${Object.prototype.hasOwnProperty.call(content, 'excerpt')})\n`);
  return 0;
}

if (require.main === module) {
  main(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (err) => { process.stderr.write(`fatal: ${err && err.stack || err}\n`); process.exit(1); }
  );
}

module.exports = {
  main, parseArgs, fetchRaw, defaultCachePath,
  extractBlocks, extractFromPostsJson, extractHtmlBlocks,
  buildContentFile, slugFromUrl, assertAllowedHost, UsageError,
};
