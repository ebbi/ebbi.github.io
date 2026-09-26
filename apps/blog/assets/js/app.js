/**
 * apps/blog/assets/js/app.js
 * Main application controller. Fetches data, handles routing events,
 * and integrates search filtering.
 */
(function () {
  let allPosts = [];
  let currentSearchQuery = "";

  /**
   * Lightweight hash parser (decoupled from router.js)
   */
  function parseCurrentHash() {
    const hash = window.location.hash.slice(1);
    if (!hash) return { type: "home", lang: "en" };
    const [pathPart] = hash.split("?");
    const segments = pathPart.split("/").filter(Boolean);
    let lang = segments[0] || "en";
    if (segments.length === 1) return { type: "home", lang };
    if (segments[1] === "post" && segments[2])
      return { type: "post", lang, slug: segments[2] };
    return { type: "404", lang };
  }

  /**
   * Render the home/post list view
   */
  function renderList(posts) {
    const container = document.getElementById("app");
    if (!container) return;

    // Filter posts based on active search query
    let postsToShow = posts;
    if (currentSearchQuery) {
      const matchingSlugs = window.BlogSearch
        ? window.BlogSearch.getMatchingSlugs(currentSearchQuery)
        : null;
      if (matchingSlugs) {
        postsToShow = posts.filter((p) => matchingSlugs.includes(p.slug));
      }
    }

    if (postsToShow.length === 0) {
      container.innerHTML =
        '<div class="no-posts"><h2>No posts found</h2><p>Try a different search term.</p></div>';
      return;
    }

    const listHtml = postsToShow
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
   * Render a single post view
   */
  function renderPost(slug) {
    const container = document.getElementById("app");
    if (!container) return;

    const post = allPosts.find((p) => p.slug === slug);
    if (!post) {
      container.innerHTML =
        '<div class="not-found"><h1>404</h1><p>Post not found.</p><a href="#/">Back to home</a></div>';
      return;
    }

    // Delegate to renderer if available
    if (window.BlogRenderer && window.BlogRenderer.render) {
      container.innerHTML = window.BlogRenderer.render(post);
    } else {
      // Fallback basic rendering
      container.innerHTML = `
        <article class="post-detail">
          <h1>${post.title}</h1>
          <p class="post-meta">${post.date} • ${post.lang.toUpperCase()}</p>
          <div class="post-content">
            ${post.blocks.map((b) => `<p>${b.content || ""}</p>`).join("")}
          </div>
        </article>
      `;
    }
  }

  /**
   * Handle route changes dispatched by router.js or initial load
   */
  function handleRouteChange(route) {
    if (route.type === "home") {
      renderList(allPosts);
    } else if (route.type === "post") {
      renderPost(route.slug);
    } else if (route.type === "404") {
      const container = document.getElementById("app");
      if (container)
        container.innerHTML =
          '<div class="not-found"><h1>404</h1><p>Page not found.</p><a href="#/">Back to home</a></div>';
    }
  }

  /**
   * Initialize application
   */
  document.addEventListener("DOMContentLoaded", () => {
    const appContainer = document.getElementById("app");
    if (!appContainer) {
      console.error(
        '❌ CRITICAL ERROR: Could not find <main id="app"> in index.html!',
      );
      return;
    }

    console.log("⏳ Loading posts data...");
    fetch("assets/data/posts.json")
      .then((res) => res.json())
      .then((posts) => {
        allPosts = posts;
        console.log(`✅ Loaded ${posts.length} posts.`);

        // Initialize search UI
        if (window.BlogSearch) {
          window.BlogSearch.init("#search-input");
          window.addEventListener("blog:search", (e) => {
            currentSearchQuery = e.detail;
            // Only re-render list if currently on home route
            const route = parseCurrentHash();
            if (route.type === "home") {
              renderList(allPosts);
            }
          });
        }

        // Listen for route changes from router.js
        window.addEventListener("blog:routechange", (e) => {
          handleRouteChange(e.detail);
        });

        // Trigger initial render after async data is ready
        handleRouteChange(parseCurrentHash());
      })
      .catch((err) => {
        console.error("Failed to load posts:", err);
        appContainer.innerHTML =
          '<div class="error"><h1>Error</h1><p>Failed to load posts data.</p></div>';
      });
  });
})();
