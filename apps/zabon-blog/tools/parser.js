/**
 * Zabon Blog — Block Parser
 * Parses raw WordPress JSON cache into structured block JSON.
 * Node 20 LTS native implementation (no external npm dependencies).
 */

const fs = require("fs");
const path = require("path");

const CACHE_FILE = path.join(__dirname, "cache", "raw-posts.json");
const OUTPUT_FILE = path.join(__dirname, "..", "assets", "data", "posts.json");

// Ensure output directory exists
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

if (!fs.existsSync(CACHE_FILE)) {
  console.error(
    "❌ Error: Cache file not found. Run fetcher.js --refresh first.",
  );
  process.exit(1);
}

const rawPosts = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function parseBlocks(html) {
  const blocks = [];
  let remaining = html;

  // Helper to extract and remove the first match of a regex
  function extractAndRemove(regex, type, transform) {
    const match = remaining.match(regex);
    if (match) {
      const block = transform ? transform(match) : { type, content: match[0] };
      blocks.push(block);
      remaining = remaining.slice(match.index + match[0].length);
      return true;
    }
    return false;
  }

  // Process sequentially
  while (remaining.trim().length > 0) {
    // 1. Headings
    if (
      extractAndRemove(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/i, "heading", (m) => ({
        type: "heading",
        level: parseInt(m[1], 10),
        content: stripHtml(m[2]),
      }))
    )
      continue;

    // 2. Images (with optional figure/figcaption)
    if (
      extractAndRemove(
        /<figure[^>]*>\s*<img[^>]+src=["']([^"']+)["'][^>]*>(?:\s*<figcaption[^>]*>([\s\S]*?)<\/figcaption>)?\s*<\/figure>/i,
        "image",
        (m) => ({
          type: "image",
          src: m[1],
          caption: m[2] ? stripHtml(m[2]) : "",
        }),
      )
    )
      continue;

    if (
      extractAndRemove(
        /<img[^>]+src=["']([^"']+)["'][^>]*>/i,
        "image",
        (m) => ({
          type: "image",
          src: m[1],
          caption: "",
        }),
      )
    )
      continue;

    // 3. Blockquotes
    if (
      extractAndRemove(
        /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/i,
        "quote",
        (m) => ({
          type: "quote",
          content: stripHtml(m[1]),
        }),
      )
    )
      continue;

    // 4. Lists
    if (
      extractAndRemove(/<(ul|ol)[^>]*>([\s\S]*?)<\/\1>/i, "list", (m) => ({
        type: "list",
        ordered: m[1].toLowerCase() === "ol",
        content: m[2].trim(),
      }))
    )
      continue;

    // 5. Tables
    if (
      extractAndRemove(/<table[^>]*>([\s\S]*?)<\/table>/i, "table", (m) => ({
        type: "table",
        content: m[1].trim(),
      }))
    )
      continue;

    // 6. Dividers
    if (
      extractAndRemove(/<hr[^>]*>/i, "divider", () => ({
        type: "divider",
        content: "",
      }))
    )
      continue;

    // 7. Embeds (iframes, etc.)
    if (
      extractAndRemove(
        /<(iframe|embed)[^>]*>([\s\S]*?)<\/\1>/i,
        "embed",
        (m) => ({
          type: "embed",
          content: m[0],
        }),
      )
    )
      continue;

    if (
      extractAndRemove(/<(iframe|embed)[^>]*\/>/i, "embed", (m) => ({
        type: "embed",
        content: m[0],
      }))
    )
      continue;

    // 8. Paragraphs
    if (
      extractAndRemove(/<p[^>]*>([\s\S]*?)<\/p>/i, "paragraph", (m) => ({
        type: "paragraph",
        content: stripHtml(m[1]),
      }))
    )
      continue;

    // 9. Fallback: If there's text but no matching tag, treat as paragraph
    const textMatch = remaining.match(/^([^<]+)/);
    if (textMatch) {
      const text = textMatch[1].trim();
      if (text.length > 0) {
        blocks.push({ type: "paragraph", content: text });
      }
      remaining = remaining.slice(textMatch[0].length);
      continue;
    }

    // 10. Skip unknown tags to prevent infinite loops
    const skipMatch = remaining.match(/^<[^>]+>/);
    if (skipMatch) {
      remaining = remaining.slice(skipMatch[0].length);
      continue;
    }

    // Safety break for stray characters
    if (remaining.length < 5) break;
    remaining = remaining.slice(1);
  }

  return blocks;
}

const parsedPosts = rawPosts.map((post) => {
  // WP.com Public API returns content and title as direct strings,
  // unlike the standard WP REST API which uses { rendered: '...' }
  const contentHtml =
    typeof post.content === "string"
      ? post.content
      : post.content?.rendered || "";
  const titleHtml =
    typeof post.title === "string" ? post.title : post.title?.rendered || "";

  return {
    slug: post.slug,
    title: stripHtml(titleHtml) || "Untitled",
    date: post.date,
    lang: "en", // Default for pilot phase
    blocks: parseBlocks(contentHtml),
  };
});

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(parsedPosts, null, 2), "utf8");
console.log(`✅ Successfully parsed ${parsedPosts.length} posts.`);
console.log(`💾 Saved to: ${OUTPUT_FILE}`);
