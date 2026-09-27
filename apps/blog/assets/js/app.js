/**
 * apps/blog/assets/js/app.js
 * Main application controller.
 * - Loads posts.json (bodies) and feed.json (excerpts), merged by slug.
 * - Delegates all route parsing to router.js (single source per fact).
 * - Renders list and post views.
 */
(function () {
  let posts = []; // merged: body + excerpt
  /**
   * Fetch JSON with a clear error surface.
   */
  async function loadJson(url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`${url} → HTTP ${res.status}`);
    }
    return res.json();
  }
  /**
   * Merge posts.json bodies with feed.json excerpts, keyed by slug.
   * Missing excerpts degrade to empty string (list still renders).
   */
  function mergePostsAndFeed(postsArr, feedArr) {
    const excerptBySlug = new Map(
      (feedArr || []).map((f) => [f.slug, f.excerpt || ""]),
    );
    return (postsArr || []).map((p) => ({
      ...p,
      excerpt: excerptBySlug.get(p.slug) || "",
    }));
  }

  /**
   * Render the home/list view.
   * @param {{lang: string}} route
   */
  function renderList(route) {
    const container = document.getElementById("app");
    if (!container) return;

    const visible = posts.filter((p) => !route.lang || p.lang === route.lang);

    if (visible.length === 0) {
      container.innerHTML =
        '<div class="no-posts"><h2>No posts found</h2><p>Try another language.</p></div>';
      return;
    }

    const listHtml = visible
      .map(
        (post) => `
      <article class="post-list-item">
        <h2><a href="#/${post.lang}/post/${post.slug}">${post.title}</a></h2>
        <p class="post-meta">${post.date} • ${post.lang.toUpperCase()}</p>
        <p class="post-excerpt">${post.excerpt || ""}</p>
      </article>
    `,
      )
      .join("");

    container.innerHTML = `<div class="post-list">${listHtml}</div>`;
  }

  /**
   * Render a single post view.
   * Clears the container first, then delegates DOM construction to BlogRenderer.
   * @param {{slug: string}} route
   */
  function renderPost(route) {
    const container = document.getElementById("app");
    if (!container) return;

    const post = posts.find((p) => p.slug === route.slug);
    if (!post) {
      container.innerHTML =
        '<div class="not-found"><h1>404</h1><p>Post not found.</p><a href="#/en">Back to home</a></div>';
      return;
    }

    // Header block built here; body delegated to the renderer.
    container.innerHTML = `
      <article class="post-detail">
        <header class="post-header">
          <h1>${post.title}</h1>
          <p class="post-meta">${post.date} • ${post.lang.toUpperCase()}</p>
        </header>
        <div class="post-content"></div>
      </article>
    `;

    const contentEl = container.querySelector(".post-content");
    if (
      window.BlogRenderer &&
      typeof window.BlogRenderer.render === "function"
    ) {
      window.BlogRenderer.render(post.blocks, contentEl); // R1
    } else {
      // Minimal fallback if the renderer failed to load.
      contentEl.textContent = (post.blocks || [])
        .map((b) => b.content || "")
        .join("\n\n");
    }
  }

  /**
   * Handle a route change emitted by router.js.
   * Router vocabulary: type is 'list' or 'post'.
   * @param {{lang: string, type: string, slug: string|null}} route
   */
  function handleRouteChange(route) {
    if (!route) return;
    if (route.type === "post") {
      renderPost(route);
    } else {
      renderList(route); // 'list' (and any unknown → list)
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const appContainer = document.getElementById("app");
    if (!appContainer) {
      console.error('❌ CRITICAL: <main id="app"> not found in index.html');
      return;
    }

    try {
      console.log("⏳ Loading blog data...");
      const [postsArr, feedArr] = await Promise.all([
        loadJson("assets/data/posts.json"),
        loadJson("assets/data/feed.json"),
      ]);
      posts = mergePostsAndFeed(postsArr, feedArr);
      console.log(`✅ Loaded ${posts.length} posts (with excerpts).`);
    } catch (err) {
      console.error("Failed to load blog data:", err);
      appContainer.innerHTML =
        '<div class="error"><h1>Error</h1><p>Failed to load blog data.</p></div>';
      return;
    }

    // Router is the single source of route state.
    if (window.BlogRouter && typeof window.BlogRouter.init === "function") {
      window.BlogRouter.init(handleRouteChange);
    } else {
      console.error("❌ BlogRouter not found; falling back to initial render.");
      handleRouteChange({ lang: "en", type: "list", slug: null });
    }
  });
})();
