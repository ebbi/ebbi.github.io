/**
 * Zabon Blog — Feed/Index Generator
 * Reads apps/blog/assets/data/posts.json and writes apps/blog/assets/data/feed.json
 * with the 10 most recent posts (date descending), each carrying a plain-text excerpt.
 *
 * Node 20 LTS native implementation (no external npm dependencies).
 */

const fs = require("fs");
const path = require("path");

const INPUT_FILE = path.join(__dirname, "..", "assets", "data", "posts.json");
const OUTPUT_FILE = path.join(__dirname, "..", "assets", "data", "feed.json");

const FEED_SIZE = 10;
const EXCERPT_LENGTH = 150;

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

    // Join with a single space between blocks.
    const separator = parts.length > 0 ? " " : "";
    parts.push(separator + text);
    length += separator.length + text.length;

    if (length >= EXCERPT_LENGTH) break;
  }

  const joined = parts.join("");
  if (joined.length <= EXCERPT_LENGTH) return joined;
  return joined.slice(0, EXCERPT_LENGTH).trimEnd() + "…";
}

function main() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(
      `❌ Error: Input file not found: ${INPUT_FILE}\n` +
        `   Run the parser first: node apps/blog/tools/parser.js`,
    );
    process.exit(1);
  }

  let posts;
  try {
    posts = JSON.parse(fs.readFileSync(INPUT_FILE, "utf8"));
  } catch (err) {
    console.error(`❌ Error: Failed to parse ${INPUT_FILE}: ${err.message}`);
    process.exit(1);
  }

  if (!Array.isArray(posts)) {
    console.error("❌ Error: posts.json must contain an array.");
    process.exit(1);
  }

  // Sort by date descending (ISO-8601 with offset parses reliably via Date).
  const sorted = [...posts].sort((a, b) => {
    const ta = Date.parse(a.date);
    const tb = Date.parse(b.date);
    if (Number.isNaN(ta) && Number.isNaN(tb)) return 0;
    if (Number.isNaN(ta)) return 1;
    if (Number.isNaN(tb)) return -1;
    return tb - ta;
  });

  const feed = sorted.slice(0, FEED_SIZE).map((post) => ({
    slug: post.slug,
    title: decodeEntities(String(post.title || "")),
    date: post.date,
    lang: post.lang,
    excerpt: buildExcerpt(post.blocks),
  }));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(feed, null, 2), "utf8");

  console.log(`✅ Successfully generated feed with ${feed.length} posts.`);
  console.log(`💾 Saved to: ${OUTPUT_FILE}`);
}

main();
