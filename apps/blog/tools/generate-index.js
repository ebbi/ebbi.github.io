/**
 * Zabon Blog — List Index Generator
 * Reads apps/blog/content/<lang>/<slug>.json (canonical content) and writes
 * apps/blog/assets/data/feed.json as the COMPLETE list index: every post,
 * date descending, each carrying a plain-text excerpt for the list view.
 *
 * Milestone C1: content/ is the canonical source (LOCKED_DECISIONS Recovery).
 * posts.json is no longer read. The output is no longer a "10 most recent"
 * feed — the app's list view reads this file directly (topology (a)).
 *
 * Node 20 LTS native implementation (no external npm dependencies).
 */

const fs = require("fs");
const path = require("path");

const CONTENT_DIR = path.join(__dirname, "..", "content");
const OUTPUT_FILE = path.join(__dirname, "..", "assets", "data", "feed.json");

const EXCERPT_LENGTH = 150;

// The series `contents` post is the AUTHORITATIVE source of the author's own
// 1..23 series numbering (its single `table` block carries the source grid
// verbatim). We parse the "N: <title>" cell anchors to map each series slug
// to its integer seriesOrder (C1b-18). Non-series posts carry seriesOrder=null.
const SERIES_ORDER_SOURCE_SLUG =
  "a-contemporary-history-of-the-muslim-world-contents";

// Minimal HTML entity decoder for the common named + numeric entities
// that survive parser.js's stripHtml (which only handles tags and &nbsp;).
const NAMED_ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
};

function decodeEntities(str) {
  if (!str) return "";
  return str.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity) => {
    if (entity[0] === "#") {
      const isHex = entity[1] === "x" || entity[1] === "X";
      const code = parseInt(
        isHex ? entity.slice(2) : entity.slice(1),
        isHex ? 16 : 10,
      );
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    const named = NAMED_ENTITIES[entity.toLowerCase()];
    return named !== undefined ? named : match;
  });
}

function normalizeWhitespace(str) {
  return str.replace(/\s+/g, " ").trim();
}

/**
 * Build a plain-text excerpt from a post's blocks.
 * Only `paragraph` blocks are considered "text blocks" — matches the
 * block schema in LOCKED_DECISIONS.txt.
 */
function buildExcerpt(blocks) {
  if (!Array.isArray(blocks)) return "";

  const parts = [];
  let length = 0;

  for (const block of blocks) {
    if (!block || block.type !== "paragraph") continue;
    const raw = typeof block.content === "string" ? block.content : "";
    const text = normalizeWhitespace(decodeEntities(raw));
    if (text.length === 0) continue;

    const separator = parts.length > 0 ? " " : "";
    parts.push(separator + text);
    length += separator.length + text.length;

    if (length >= EXCERPT_LENGTH) break;
  }

  const joined = parts.join("");
  if (joined.length <= EXCERPT_LENGTH) return joined;
  return joined.slice(0, EXCERPT_LENGTH).trimEnd() + "…";
}

/**
 * Derive the series order (1..23) from the AUTHORITATIVE `contents` post.
 * Its single `table` block carries the source grid verbatim; each numbered
 * cell begins with "N: <title>" (or "N. <title>") as the anchor text, and the
 * anchor href ends in the series post's slug (language-agnostic). We map that
 * slug -> N. Returns {} if the source post is absent (non-series build).
 */
function buildSeriesOrderMap(contentRoot) {
  const sourceFile = path.join(
    contentRoot,
    "en",
    `${SERIES_ORDER_SOURCE_SLUG}.json`,
  );
  if (!fs.existsSync(sourceFile)) return {};

  let source;
  try {
    source = JSON.parse(fs.readFileSync(sourceFile, "utf8"));
  } catch (err) {
    console.warn(
      `⚠️  Warning: could not parse series-order source ${sourceFile}: ${err.message}`,
    );
    return {};
  }

  const blocks = Array.isArray(source.blocks) ? source.blocks : [];
  const table = blocks.find((b) => b && b.type === "table");
  if (!table || typeof table.content !== "string") return {};

  const map = {};
  const anchorRe = /<a\b[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = anchorRe.exec(table.content)) !== null) {
    const href = m[1];
    // Strip inner tags/entities from the anchor text; the numbered cell
    // reads "N: <title>" / "N. <title>". The duplicate (thumbnail) anchor is
    // empty and skipped by the numbering test below.
    const text = m[2].replace(/<[^>]*>/g, "").trim();
    const numMatch = text.match(/^(\d+)\s*[:.]/);
    if (!numMatch) continue;
    if (!/twolegsbadblog\.wordpress\.com\//.test(href)) continue;
    const segments = href.replace(/\/+$/, "").split("/");
    const slug = segments[segments.length - 1];
    if (!slug) continue;
    map[slug] = parseInt(numMatch[1], 10);
  }
  return map;
}

/**
 * Recursively find every content/<lang>/<slug>.json file.
 * Returns [{ lang, slug, file }].
 */
function walkContentDir(dir, lang) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) continue; // one level of <lang>/ only
    if (!entry.name.endsWith(".json")) continue;
    out.push({
      lang,
      slug: entry.name.replace(/\.json$/, ""),
      file: full,
    });
  }
  return out;
}

function collectContentFiles() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`❌ Error: Content dir not found: ${CONTENT_DIR}`);
    process.exit(1);
  }
  const files = [];
  for (const entry of fs.readdirSync(CONTENT_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    files.push(
      ...walkContentDir(path.join(CONTENT_DIR, entry.name), entry.name),
    );
  }
  return files;
}

function main() {
  const files = collectContentFiles();

  if (files.length === 0) {
    console.error(
      `❌ Error: No content files found under ${CONTENT_DIR}\n` +
        `   Expected content/<lang>/<slug>.json`,
    );
    process.exit(1);
  }

  // C1b-18: the author's own 1..23 series numbering, sourced from the
  // `contents` post grid. Non-series posts get seriesOrder=null.
  const seriesOrderMap = buildSeriesOrderMap(CONTENT_DIR);

  const index = [];
  for (const { lang, slug, file } of files) {
    let post;
    try {
      post = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (err) {
      console.error(`❌ Error: Failed to parse ${file}: ${err.message}`);
      process.exit(1);
    }
    if (post.slug && post.slug !== slug) {
      console.warn(
        `⚠️  Warning: ${file} declares slug "${post.slug}" but filename is "${slug}". Using filename.`,
      );
    }
    index.push({
      slug,
      title: decodeEntities(String(post.title || "")),
      date: post.date,
      lang,
      seriesOrder:
        lang === "en" && Object.hasOwn(seriesOrderMap, slug)
          ? seriesOrderMap[slug]
          : null,
      excerpt: buildExcerpt(post.blocks),
    });
  }

  // Sort by date descending (ISO-8601 with offset parses reliably via Date).
  index.sort((a, b) => {
    const ta = Date.parse(a.date);
    const tb = Date.parse(b.date);
    if (Number.isNaN(ta) && Number.isNaN(tb)) return 0;
    if (Number.isNaN(ta)) return 1;
    if (Number.isNaN(tb)) return -1;
    return tb - ta;
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2), "utf8");

  console.log(`✅ Successfully generated index with ${index.length} entries.`);
  console.log(`💾 Saved to: ${OUTPUT_FILE}`);
}

main();
