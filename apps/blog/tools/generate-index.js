#!/usr/bin/env node
/**
 * Milestone 05a: Feeds & Search Index Generator
 * Reads posts.json and generates search-index.json + feed.json
 * Node 20 LTS | No external dependencies
 */

const fs = require("fs");
const path = require("path");

// __dirname is apps/blog/tools. One '..' lands us in apps/blog.
const DATA_DIR = path.join(__dirname, "..", "assets", "data");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");
const SEARCH_INDEX_FILE = path.join(DATA_DIR, "search-index.json");
const FEED_FILE = path.join(DATA_DIR, "feed.json");

/**
 * Extract plain text excerpt from blocks (first 150 chars)
 * @param {Array} blocks - Post blocks array
 * @returns {string} - Plain text excerpt (~150 chars)
 */
function extractExcerpt(blocks) {
  if (!blocks || !Array.isArray(blocks)) return "";

  let text = "";
  for (const block of blocks) {
    if (block.type === "paragraph" && block.content) {
      text += block.content.replace(/<[^>]+>/g, "") + " ";
    } else if (block.type === "heading" && block.content) {
      text += block.content.replace(/<[^>]+>/g, "") + " ";
    }
    // Stop at 200 chars before trimming
    if (text.length > 200) break;
  }

  return text.trim().slice(0, 150);
}

/**
 * Main execution
 */
function main() {
  console.log("📖 Reading posts.json...");

  if (!fs.existsSync(POSTS_FILE)) {
    console.error("❌ Error: posts.json not found at", POSTS_FILE);
    process.exit(1);
  }

  const postsData = JSON.parse(fs.readFileSync(POSTS_FILE, "utf8"));
  const posts = Array.isArray(postsData) ? postsData : [];

  console.log(`📊 Found ${posts.length} posts`);

  // Generate search index (all posts)
  const searchIndex = posts.map((post) => ({
    slug: post.slug || "",
    title: post.title || "",
    date: post.date || "",
    lang: post.lang || "en",
    excerpt: extractExcerpt(post.blocks || []),
    tags: [], // Reserved for future
  }));

  // Generate feed (10 most recent, sorted by date desc)
  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.date || "").getTime();
    const dateB = new Date(b.date || "").getTime();
    return dateB - dateA; // Descending order
  });

  const feed = sortedPosts.slice(0, 10).map((post) => ({
    slug: post.slug || "",
    title: post.title || "",
    date: post.date || "",
    lang: post.lang || "en",
    excerpt: extractExcerpt(post.blocks || []),
  }));

  // Write files
  console.log("💾 Writing search-index.json...");
  fs.writeFileSync(
    SEARCH_INDEX_FILE,
    JSON.stringify(searchIndex, null, 2),
    "utf8",
  );

  console.log("💾 Writing feed.json...");
  fs.writeFileSync(FEED_FILE, JSON.stringify(feed, null, 2), "utf8");

  console.log("✅ Successfully generated search-index.json and feed.json");
  console.log(`   • search-index.json: ${searchIndex.length} entries`);
  console.log(`   • feed.json: ${feed.length} entries`);
}

main();
