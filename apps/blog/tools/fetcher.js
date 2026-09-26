/**
 * Zabon Blog — Content Fetcher
 * Fetches posts from the WordPress.com Public API and caches them locally.
 */

const fs = require("fs");
const path = require("path");

const CACHE_DIR = path.join(__dirname, "cache");
const CACHE_FILE = path.join(CACHE_DIR, "raw-posts.json");
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

// WordPress.com Public API endpoint (reliable for free WP.com sites)
const API_URL =
  "https://public-api.wordpress.com/rest/v1.1/sites/twolegsbadblog.wordpress.com/posts/";

async function fetchPosts() {
  console.log("🚀 Zabon Blog — Content Fetcher");
  console.log("==================================================");

  // Ensure cache directory exists
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  const args = process.argv.slice(2);
  const forceRefresh = args.includes("--refresh");

  // Check cache
  if (!forceRefresh && fs.existsSync(CACHE_FILE)) {
    const stats = fs.statSync(CACHE_FILE);
    const ageMs = Date.now() - stats.mtimeMs;

    if (ageMs < CACHE_MAX_AGE_MS) {
      console.log(
        "✅ Using cached data (age: " +
          Math.round(ageMs / 1000 / 60) +
          " mins)",
      );
      console.log("💡 Use --refresh to force a new network request.");
      return;
    }
    console.log("⏳ Cache expired. Fetching fresh data...");
  } else if (forceRefresh) {
    console.log("🔄 --refresh flag detected: forcing fresh fetch");
  } else {
    console.log("⏳ No cache found. Fetching data...");
  }

  try {
    console.log(`\n📡 Fetching from ${API_URL}...`);
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // WordPress.com API returns { found: N, posts: [...] }
    const posts = data.posts || [];

    if (posts.length === 0) {
      throw new Error("No posts found in the API response.");
    }

    // Save to cache
    fs.writeFileSync(CACHE_FILE, JSON.stringify(posts, null, 2), "utf8");
    console.log(`✅ Successfully fetched and cached ${posts.length} posts.`);
    console.log(`💾 Saved to: ${CACHE_FILE}`);
  } catch (error) {
    console.error(`\n❌ Network request failed: ${error.message}`);

    // Graceful fallback: if cache exists, use it even if expired
    if (fs.existsSync(CACHE_FILE)) {
      console.log("⚠️  Falling back to expired cache due to network error.");
      return;
    }

    console.error(
      "\n❌ Fetcher failed: no data available and no cache to fall back on.",
    );
    process.exit(1);
  }
}

fetchPosts();
