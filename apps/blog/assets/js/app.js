/**
 * Zabon Blog — Main Application Logic
 * Wires data, router, and renderer together.
 */
(async function () {
  const appContainer = document.getElementById("app");

  // SAFETY CHECK: Ensure the container exists before proceeding
  if (!appContainer) {
    console.error(
      '❌ CRITICAL ERROR: Could not find <main id="app"> in index.html!',
    );
    console.error(
      'Please check your index.html file and ensure it contains <main id="app">.</main>',
    );
    return; // Stop execution to prevent further errors
  }

  let postsData = [];

  // 1. Load Data
  try {
    console.log("⏳ Loading posts data...");
    const response = await fetch("assets/data/posts.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    postsData = await response.json();
    console.log(`✅ Loaded ${postsData.length} posts.`);
  } catch (err) {
    console.error("❌ Error loading data:", err);
    appContainer.innerHTML =
      "<h1>Error</h1><p>Could not load blog data. Check console.</p>";
    return;
  }

  // 2. Render Function
  function renderView(route) {
    appContainer.innerHTML = ""; // Clear previous view

    if (route.type === "post" && route.slug) {
      // Find post by slug
      const post = postsData.find((p) => p.slug === route.slug);

      if (post) {
        const titleEl = document.createElement("h1");
        titleEl.textContent = post.title;
        titleEl.className = "post-title";
        appContainer.appendChild(titleEl);

        const metaEl = document.createElement("p");
        metaEl.className = "post-meta";
        metaEl.textContent = new Date(post.date).toLocaleDateString();
        appContainer.appendChild(metaEl);

        // Render blocks
        window.BlogRenderer.render(post.blocks, appContainer);
      } else {
        // 404 Fallback
        appContainer.innerHTML = `
          <h1>404 - Post Not Found</h1>
          <p>The post "${route.slug}" does not exist.</p>
          <a href="#/${route.lang}">← Back to Home</a>
        `;
      }
    } else {
      // List View (Home)
      const listTitle = document.createElement("h1");
      listTitle.textContent =
        route.lang === "en" ? "Zabon Blog" : `Blog (${route.lang})`;
      appContainer.appendChild(listTitle);

      const ul = document.createElement("ul");
      ul.className = "post-list";

      if (postsData.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No posts found.";
        ul.appendChild(li);
      } else {
        postsData.forEach((post) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = `#/${route.lang}/post/${post.slug}`;
          a.textContent = post.title;
          li.appendChild(a);
          ul.appendChild(li);
        });
      }
      appContainer.appendChild(ul);
    }
  }

  // 3. Initialize Router
  window.BlogRouter.init(renderView);
})();
