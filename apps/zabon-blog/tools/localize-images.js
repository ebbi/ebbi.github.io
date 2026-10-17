#!/usr/bin/env node
"use strict";

/*
 * localize-images.js — download + dedup + src-rewrite tool (Milestone 11b)
 *
 * Workstream A: LOCAL IMAGE STORAGE.
 *
 * The EN corpus (content/en/*.json) has 326 image blocks; ALL are still
 * REMOTE. This tool localizes the ones hosted on the source blog
 * (twolegsbadblog.wordpress.com) into a local store under
 * assets/img/posts/<slug>/ and rewrites every reference to the local path.
 *
 * The 17 EXTERNAL images (see EXTERNAL_HOSTS below) STAY REMOTE by human
 * decision (D-11a-11 / 11b P7) and are left byte-for-byte untouched.
 *
 * This is a SEPARATE network/rewrite tool. It does NOT touch the frozen
 * extraction seam (tools/import-post.js, frozen through D-Tool-29), the
 * router, the renderer, or CSS. It rewrites ONLY image-file URL bytes inside
 * content/en/*.json: each `image` block's `src` field, any `<img src="...">`
 * occurrence in text/HTML fields, AND (P10=b) the WordPress attachment
 * image-file attributes `data-orig-file` / `data-large-file` in text/HTML
 * fields. It NEVER rewrites non-image links (`href`, `data-permalink`) —
 * those are article permalinks and stay remote.
 *
 * Node 20 built-ins only. No dependencies.
 *
 * Params resolved at SCOPE (11b), defaults applied:
 *   P1 store:      assets/img/posts/<slug>/<YYYY>/<MM>/<basename>  (the
 *                  WordPress uploads YYYY/MM subpath is preserved so two
 *                  DISTINCT uploads sharing a basename within one slug — e.g.
 *                  part-6's vlcsnap-2016-05-31-15h12m04s113.png under both
 *                  2016/05 and 2016/06 — cannot overwrite each other)
 *   P2 query:      strip the WordPress `?w=<NNN>` resize hint (store full-size)
 *   P3 dedup key:  FULL source path (host + pathname, query excluded)
 *   P4 idempotent: re-run is a no-op when the store is correct; --dry-run
 *                  writes nothing.
 *   P9 gate:       licensing/attribution review is a HUMAN GATE. Pass --yes
 *                  to acknowledge it; without --yes the real run refuses.
 *   P10:           also rewrite image-file attributes data-orig-file /
 *                  data-large-file (option "b"), so NO remote IMAGE url
 *                  remains anywhere in content/en. Non-image links untouched.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");

// The source blog host whose images are IN SCOPE for localization.
const SOURCE_HOST = "twolegsbadblog.wordpress.com";

// External hosts that STAY REMOTE (the 17 images, 6 distinct hosts).
// See D-11a-11 / 11b P7. Any host here is NEVER downloaded or rewritten.
const EXTERNAL_HOSTS = new Set([
  "upload.wikimedia.org",
  "i0.wp.com",
  "i.guim.co.uk",
  "muwahhidmedia.files.wordpress.com",
  "c2.staticflickr.com",
  "s-media-cache-ak0.pinimg.com",
]);

const TOOLS_DIR = __dirname;
const APP_ROOT = path.resolve(TOOLS_DIR, ".."); // apps/blog
const CONTENT_ROOT = path.join(APP_ROOT, "content");
const CACHE_DIR = path.join(TOOLS_DIR, ".cache", "localize-images");

// Languages this tool may rewrite. `en` is the canonical corpus; the
// translations (fa/th/ar) inherit image `src` VERBATIM from EN at translation
// time (translate.js NEVER touches `src`), so after EN is localized their src
// is stale and must be re-synced. See P6.

// Text/HTML fields that may carry inline <img>/attachment metadata markup.
// Block `src` is handled separately for the `image` block type.
const HTML_FIELDS = ["content", "caption"];

const LANGS = new Set(["en", "fa", "th", "ar"]);

// Image-file URL attributes inside HTML. We rewrite ONLY these — the ones
// that actually reference an image file. `href` and `data-permalink` are
// ARTICLE links and are NEVER rewritten. `src` covers <img src="...">;
// `data-orig-file`/`data-large-file` carry the WP attachment's original and
// large image URLs (present on the `contents` table's inline <img> tags).
const IMG_ATTR_RE =
  /\b(src|data-orig-file|data-large-file)\s*=\s*("([^"]*)"|'([^']*)')/gi;

class UsageError extends Error {}

// ---------------------------------------------------------------- args

function parseArgs(argv) {
  const cfg = {
    slug: null,
    lang: "en",
    dryRun: false,
    force: false,
    report: false,
    yes: false,
    help: false,
    _errors: [],
  };
  const want = { "--slug": "slug", "--lang": "lang" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") {
      cfg.dryRun = true;
      continue;
    }
    if (a === "--force") {
      cfg.force = true;
      continue;
    }
    if (a === "--report") {
      cfg.report = true;
      continue;
    }
    if (a === "--yes") {
      cfg.yes = true;
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
  if (!LANGS.has(cfg.lang)) {
    cfg._errors.push(`--lang must be one of ${[...LANGS].join(", ")}`);
  }
  return cfg;
}

function helpText() {
  return [
    "Usage: node tools/localize-images.js [--lang <en|fa|th|ar>] [--slug <slug>]",
    "                                          [--dry-run] [--force] [--report] [--yes]",
    "",
    "  --lang <code>  Corpus to rewrite (default: en). Translations (fa/th/ar)",
    "                 re-sync their image src to the local store built for EN.",
    "  --slug <slug>  Localize only content/<lang>/<slug>.json (default: all).",
    "  --dry-run      Print the plan; write nothing (tree stays clean).",
    "  --force        Re-download even if the local file already exists.",
    "  --report       Print the summary report at the end.",
    "  --yes          Acknowledge the licensing/attribution HUMAN GATE (P9).",
    "",
    "Localizes twolegsbadblog.wordpress.com images into",
    "assets/img/posts/<slug>/<YYYY>/<MM>/ and rewrites content/<lang>/*.json",
    "image refs (block src, <img src>, data-orig-file, data-large-file).",
    "External hosts stay remote; article links (href/data-permalink) untouched.",
  ].join("\n");
}

// ------------------------------------------------------------ utilities

function sha256(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function parseSrc(src) {
  // Returns { host, pathname, basename, subdir, key } or null if not a
  // parseable URL. `subdir` is the WordPress uploads <YYYY>/<MM> subpath
  // (preserved under the per-slug dir to guarantee uniqueness — two DISTINCT
  // uploads can share a basename within one slug, e.g. part-6's
  // vlcsnap-2016-05-31-15h12m04s113.png exists under both 2016/05 and
  // 2016/06).
  try {
    const u = new URL(src);
    const basename = decodeURIComponent(u.pathname.split("/").pop() || "");
    const m = u.pathname.match(/\/wp-content\/uploads\/(\d{4})\/(\d{2})\//);
    const subdir = m ? `${m[1]}/${m[2]}` : "";
    return {
      host: u.host,
      pathname: u.pathname,
      basename,
      subdir,
      // Dedup key: full source path WITHOUT query (P2/P3).
      key: `${u.host}${u.pathname}`,
    };
  } catch (e) {
    return null;
  }
}

function cachePathFor(key) {
  return path.join(CACHE_DIR, `${sha256(key)}.bin`);
}

// --------------------------------------------------------------- scan

// Given an EN envelope object, walk it and collect every remote image
// reference (both IN-SCOPE source-host and EXTERNAL allow-listed). We
// mutate `obj` in place with a map key -> localRelativePath ONLY when a
// rewrite map is provided AND the ref is in-scope (source host).
//
// collected.blockSrc / collected.inlineSrc receive EVERY parseable ref,
// tagged with its parsed info; callers filter by host as needed.
function walkEnvelope(obj, rewriteMap, collected) {
  // Top-level image blocks: block.type === "image", field block.src.
  const blocks = Array.isArray(obj.blocks) ? obj.blocks : [];
  for (const b of blocks) {
    if (!b || typeof b !== "object") continue;
    if (b.type === "image" && typeof b.src === "string") {
      const info = parseSrc(b.src);
      if (info) {
        collected.blockSrc.push({ src: b.src, info });
        if (
          rewriteMap &&
          info.host === SOURCE_HOST &&
          rewriteMap.has(info.key)
        ) {
          b.src = rewriteMap.get(info.key);
        }
      }
    }
    // Inline image-file URLs inside text/HTML fields: <img src="..."> and the
    // WP attachment's data-orig-file / data-large-file attributes.
    for (const f of HTML_FIELDS) {
      if (typeof b[f] !== "string") continue;
      const fieldVal = b[f];
      if (!fieldVal.includes("twolegsbadblog")) continue;
      let m;
      IMG_ATTR_RE.lastIndex = 0;
      let updated = fieldVal;
      while ((m = IMG_ATTR_RE.exec(fieldVal)) !== null) {
        const attr = m[1];
        const quote = m[2][0]; // " or '
        const url = m[3] !== undefined ? m[3] : m[4];
        const info = url && parseSrc(url);
        if (!info || info.host !== SOURCE_HOST) continue;
        collected.inlineSrc.push({ field: f, attr, src: url, info });
        if (rewriteMap && rewriteMap.has(info.key)) {
          const local = rewriteMap.get(info.key);
          const from = `${attr}=${quote}${url}${quote}`;
          const to = `${attr}=${quote}${local}${quote}`;
          updated = updated.split(from).join(to);
        }
      }
      if (updated !== fieldVal) b[f] = updated;
    }
  }
}

function loadEnvelopes(cfg) {
  const dir = path.join(CONTENT_ROOT, cfg.lang);
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort();
  const selected = cfg.slug
    ? files.filter((f) => f === `${cfg.slug}.json`)
    : files;
  if (cfg.slug && selected.length === 0) {
    throw new UsageError(
      `no such ${cfg.lang} post: content/${cfg.lang}/${cfg.slug}.json`,
    );
  }
  return selected.map((f) => {
    const slug = f.replace(/\.json$/, "");
    const p = path.join(dir, f);
    return { slug, path: p, obj: JSON.parse(fs.readFileSync(p, "utf8")) };
  });
}

// --------------------------------------------------------------- fetch

async function download(url, key, force) {
  const cp = cachePathFor(key);
  if (!force && fs.existsSync(cp)) {
    return { buf: fs.readFileSync(cp), cached: true };
  }
  if (typeof fetch !== "function") {
    throw new Error("global fetch() unavailable (Node 20+ required)");
  }
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(cp, buf);
  return { buf, cached: false };
}

// Local relative path (POSIX) for a source key under a slug dir. The source
// WordPress <YYYY>/<MM>/ uploads subpath is preserved so a basename collision
// WITHIN a slug (part-6's vlcsnap-...png) cannot overwrite a distinct image.
function localRel(slug, p) {
  const tail = p.subdir ? `${p.subdir}/${p.basename}` : p.basename;
  return `assets/img/posts/${slug}/${tail}`;
}

// --------------------------------------------------------------- main

async function main() {
  const cfg = parseArgs(process.argv.slice(2));
  if (cfg.help) {
    console.log(helpText());
    return 0;
  }
  if (cfg._errors.length) {
    console.error("Error: " + cfg._errors.join("; "));
    console.error(helpText());
    return 2;
  }

  // The licensing/attribution review is a HUMAN GATE (P9). A real run
  // requires --yes. --dry-run is allowed without it (writes nothing).
  if (!cfg.dryRun && !cfg.yes) {
    console.error(
      "Error: the licensing/attribution HUMAN GATE (P9) is not acknowledged.\n" +
        "  Re-run with --yes AFTER a human has reviewed the source images'\n" +
        "  licensing/attribution. (Use --dry-run to preview without --yes.)",
    );
    return 3;
  }

  const envelopes = loadEnvelopes(cfg);
  const lang = cfg.lang;

  // PASS 1: scan every selected envelope (read-only) for image refs.
  const scan = { blockSrc: [], inlineSrc: [] };
  for (const env of envelopes) {
    walkEnvelope(env.obj, null, scan);
  }
  const allScanRefs = scan.blockSrc.concat(scan.inlineSrc);
  const inScopeRefs = allScanRefs.filter((e) => e.info.host === SOURCE_HOST);
  const externalRefs = allScanRefs.filter((e) =>
    EXTERNAL_HOSTS.has(e.info.host),
  );

  // Build the download plan, deduped by full source path (key). Two refs
  // with the same key share ONE local file (P3). The local basename is taken
  // from the path (query stripped, P2); the per-slug dir keeps basenames
  // unique WITHIN a slug. Cross-slug basename collisions are allowed
  // (separate dirs), so basename-only dedup is never applied.
  // We re-scan per envelope so every key knows its owning slug + ref count.
  // Map: key -> { url, basename, slug, refCount }
  const plan = new Map();
  for (const env of envelopes) {
    const refs = { blockSrc: [], inlineSrc: [] };
    walkEnvelope(JSON.parse(JSON.stringify(env.obj)), null, refs);
    for (const entry of refs.blockSrc.concat(refs.inlineSrc)) {
      const { info } = entry;
      if (!info || info.host !== SOURCE_HOST) continue; // external stays remote
      if (!plan.has(info.key)) {
        plan.set(info.key, {
          url: entry.src.split("?")[0], // download full-size (P2)
          basename: info.basename,
          subdir: info.subdir,
          slug: env.slug,
          refCount: 0,
        });
      }
      plan.get(info.key).refCount++;
    }
  }

  const externalCount = externalRefs.length;
  const planArr = [...plan.entries()];
  const dupKeys = planArr.filter(([, p]) => p.refCount > 1);

  if (cfg.dryRun) {
    console.log(
      `=== localize-images DRY RUN (lang=${lang}, nothing written) ===`,
    );
    console.log(`${lang} files scanned:      ${envelopes.length}`);
    console.log(`Image refs found:      ${allScanRefs.length} total`);
    console.log(`  in-scope (source):   ${inScopeRefs.length}`);
    console.log(`  external (kept):     ${externalRefs.length}`);
    console.log(`Unique downloads:      ${planArr.length}`);
    console.log(`Deduped keys (>1 ref): ${dupKeys.length}`);
    for (const [key, p] of planArr) {
      console.log(`  DOWNLOAD ${p.url}`);
      console.log(`        -> ${localRel(p.slug, p)}`);
    }
    return 0;
  }

  // PASS 2: download + build the rewrite map (key -> local relative path).
  const rewriteMap = new Map();
  const results = { downloaded: 0, cached: 0, failed: [] };
  for (const [key, p] of planArr) {
    const rel = localRel(p.slug, p);
    const outAbs = path.join(APP_ROOT, rel);
    try {
      let buf;
      if (!cfg.force && fs.existsSync(outAbs)) {
        // Already stored: idempotent no-op (still ensure cache populated).
        buf = fs.readFileSync(outAbs);
        results.cached++;
      } else {
        const dl = await download(p.url, key, cfg.force);
        buf = dl.buf;
        if (dl.cached) results.cached++;
        else results.downloaded++;
      }
      fs.mkdirSync(path.dirname(outAbs), { recursive: true });
      fs.writeFileSync(outAbs, buf);
      rewriteMap.set(key, rel);
    } catch (err) {
      results.failed.push({ url: p.url, error: err.message });
    }
  }

  // If ANY in-scope ref failed to localize, abort WITHOUT rewriting (9).
  if (results.failed.length > 0) {
    console.error("Aborting: some references could not be localized:");
    for (const f of results.failed)
      console.error(`  FAIL ${f.url}: ${f.error}`);
    console.error(`No content/${lang} file was rewritten.`);
    return 4;
  }

  // PASS 3: rewrite each envelope's refs to the local paths.
  let rewrittenFiles = 0;
  let rewrittenBlock = 0;
  let rewrittenInline = 0;
  for (const env of envelopes) {
    const before = JSON.stringify(env.obj);
    const collected = { blockSrc: [], inlineSrc: [] };
    walkEnvelope(env.obj, rewriteMap, collected);
    const after = JSON.stringify(env.obj);
    if (before !== after) {
      rewrittenBlock += collected.blockSrc.filter((e) =>
        rewriteMap.has(e.info.key),
      ).length;
      rewrittenInline += collected.inlineSrc.filter((e) =>
        rewriteMap.has(e.info.key),
      ).length;
      // Write deterministically (2-space indent) + trailing newline, matching
      // the EN corpus formatting.
      const tmp = env.path + ".tmp";
      fs.writeFileSync(tmp, JSON.stringify(env.obj, null, 2) + "\n", "utf8");
      fs.renameSync(tmp, env.path);
      rewrittenFiles++;
    }
  }

  // Broken-local-ref check (must be 0): every IN-SCOPE ref now resolves to a
  // file that exists on disk. External refs are intentionally left remote.
  const broken = [];
  for (const env of envelopes) {
    const still = { blockSrc: [], inlineSrc: [] };
    const clone = JSON.parse(JSON.stringify(env.obj));
    walkEnvelope(clone, null, still);
    for (const e of still.blockSrc.concat(still.inlineSrc)) {
      if (e.info.host !== SOURCE_HOST) continue; // external stays remote
      const rel = rewriteMap.get(e.info.key);
      if (!rel || !fs.existsSync(path.join(APP_ROOT, rel))) {
        broken.push({ file: env.slug, src: e.src });
      }
    }
  }

  if (cfg.report) {
    console.log(`=== localize-images REPORT (lang=${lang}) ===`);
    console.log(`${lang} files rewritten:   ${rewrittenFiles}`);
    console.log(`Block src rewritten:   ${rewrittenBlock}`);
    console.log(`Inline <img> rewritten:${rewrittenInline}`);
    console.log(`Downloaded new:        ${results.downloaded}`);
    console.log(`Already stored:        ${results.cached}`);
    console.log(`Unique local files:    ${rewriteMap.size}`);
    console.log(`External refs (kept):  ${externalCount}`);
    console.log(`Broken local refs:     ${broken.length}`);
    for (const b of broken) console.log(`  BROKEN ${b.file}: ${b.src}`);
  }

  if (broken.length > 0) {
    console.error("ERROR: broken local references remain.");
    return 5;
  }
  return 0;
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    if (err instanceof UsageError) {
      console.error("Error: " + err.message);
      process.exit(2);
    }
    console.error("Fatal: " + (err && err.stack ? err.stack : err));
    process.exit(1);
  });
