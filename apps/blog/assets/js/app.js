/**
 * apps/blog/assets/js/app.js
 * Main application controller.
 * - Loads assets/data/feed.json as the list index (C1).
 * - Post bodies are fetched on demand from content/<lang>/<slug>.json.
 * - Delegates all route parsing to router.js (single source per fact).
 * - Renders list and post views.
 */
(function () {
  let posts = []; // C1: list index entries {slug,title,date,lang,excerpt}

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
   * C1: fetch a post body from content/<lang>/<slug>.json.
   * Slugs are language-agnostic (D3): if the requested language has no file,
   * fall back to EN. Returns null when neither exists (caller renders 404).
   */
  async function loadPostBody(lang, slug) {
    const candidates = [];
    if (lang && lang !== "en") candidates.push(`content/${lang}/${slug}.json`);
    candidates.push(`content/en/${slug}.json`);
    for (const url of candidates) {
      try {
        return await loadJson(url);
      } catch (err) {
        // 404 on a candidate is expected during fallback; only the last
        // failure should surface. Keep trying.
      }
    }
    return null;
  }

  /**
   * Render a single post view.
   * C1: fetches the body from content/<lang>/<slug>.json on demand, with
   * an EN fallback for language-agnostic slugs (D3). Header + 404 markup
   * and classes are UNCHANGED from 09.
   * @param {{lang: string, slug: string}} route
   */
  async function renderPost(route) {
    const container = document.getElementById("app");
    if (!container) return;

    const body = await loadPostBody(route.lang, route.slug);
    if (!body) {
      container.innerHTML =
        '<div class="not-found"><h1>404</h1><p>Post not found.</p><a href="#/en">Back to home</a></div>';
      return;
    }

    // Header block built here; body delegated to the renderer.
    // Milestone 09: namespaced classes mirror 08's list vocabulary (L-3);
    // .post-header__meta supersedes the bare .post-meta class.
    container.innerHTML = `
      <article class="post-detail">
        <header class="post-header">
          <h1 class="post-header__title">${body.title}</h1>
          <p class="post-header__meta">${body.date} • ${body.lang.toUpperCase()}</p>
        </header>
        <div class="post-content"></div>
      </article>
    `;

    const contentEl = container.querySelector(".post-content");
    if (
      window.BlogRenderer &&
      typeof window.BlogRenderer.render === "function"
    ) {
      window.BlogRenderer.render(body.blocks, contentEl); // R1
    } else {
      // Minimal fallback if the renderer failed to load.
      contentEl.textContent = (body.blocks || [])
        .map((b) => b.content || "")
        .join("\n\n");
    }
  }

  /**
   * Render the home/list view.
   * Milestone 08: namespaced item classes; list is the single filter site.
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
        <a class="post-list-item__title" href="#/${post.lang}/post/${post.slug}">${post.title}</a>
        <p class="post-list-item__meta">${post.date} • ${post.lang.toUpperCase()}</p>
        <p class="post-list-item__excerpt">${post.excerpt || ""}</p>
      </article>
    `,
      )
      .join("");

    container.innerHTML = `<div class="post-list">${listHtml}</div>`;
  }

  /**
   * Handle a route change emitted by router.js.
   * Router vocabulary: type is 'list' or 'post'.
   * @param {{lang: string, type: string, slug: string|null}} route
   */

  function handleRouteChange(route) {
    if (!route) return;
    if (route.type === "post") {
      renderPost(route); // fire-and-forget; renderPost handles its own await
    } else {
      renderList(route); // 'list' (and any unknown → list)
    }

    // Milestone 06: keep the language switcher in sync with the route.
    // Guarded — the app must not break if nav.js fails to load.
    if (window.BlogNav && typeof window.BlogNav.onRouteChange === "function") {
      window.BlogNav.onRouteChange(route);
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const appContainer = document.getElementById("app");
    if (!appContainer) {
      console.error('❌ CRITICAL: <main id="app"> not found in index.html');
      return;
    }

    try {
      console.log("⏳ Loading list index...");
      const feedArr = await loadJson("assets/data/feed.json");
      posts = Array.isArray(feedArr) ? feedArr : [];
      console.log(`✅ Loaded ${posts.length} index entries.`);
    } catch (err) {
      console.error("Failed to load list index:", err);
      appContainer.innerHTML =
        '<div class="error"><h1>Error</h1><p>Failed to load blog data.</p></div>';
      return;
    }

    // Router is the single source of route state.
    if (window.BlogRouter && typeof window.BlogRouter.init === "function") {
      window.BlogRouter.init(handleRouteChange);

      // Milestone 06: initialize the header language switcher once.
      // Guarded — the app must not break if nav.js fails to load.
      if (window.BlogNav && typeof window.BlogNav.init === "function") {
        window.BlogNav.init(window.BlogRouter);
      } else {
        console.warn("⚠️ BlogNav not found; language switcher disabled.");
      }

      // Milestone 07: initialize the app shell (drawer) once. No router
      // dependency; guarded — the app must not break if shell.js fails.
      if (window.BlogShell && typeof window.BlogShell.init === "function") {
        window.BlogShell.init();
      } else {
        console.warn("⚠️ BlogShell not found; drawer disabled.");
      }
    } else {
      console.error("❌ BlogRouter not found; falling back to initial render.");
      handleRouteChange({ lang: "en", type: "list", slug: null });
    }
  });
})();
