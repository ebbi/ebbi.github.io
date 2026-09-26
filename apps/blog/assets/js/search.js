/**
 * apps/blog/assets/js/search.js
 * Vanilla JS search UI with debouncing, hash state, and index filtering
 */
(function () {
  let index = [];
  let debounceTimer;
  const DEBOUNCE_MS = 300;

  async function loadIndex() {
    try {
      const res = await fetch("assets/data/search-index.json");
      index = await res.json();
    } catch (e) {
      console.error("Search index load failed", e);
    }
  }

  function init(inputSelector) {
    loadIndex();
    const input = document.querySelector(inputSelector);
    if (!input) return;

    // Restore query from hash on load
    const hashParams = new URLSearchParams(
      window.location.hash.split("?")[1] || "",
    );
    const initialQuery = hashParams.get("q") || "";
    if (initialQuery) {
      input.value = initialQuery;
      emitQuery(initialQuery.toLowerCase());
    }

    input.addEventListener("input", (e) => {
      clearTimeout(debounceTimer);
      const query = e.target.value.trim().toLowerCase();
      updateHash(query);
      debounceTimer = setTimeout(() => emitQuery(query), DEBOUNCE_MS);
    });
  }

  function updateHash(query) {
    const baseHash = window.location.hash.split("?")[0];
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    const suffix = params.toString() ? `?${params.toString()}` : "";
    window.history.replaceState(null, "", `${baseHash}${suffix}`);
  }

  function emitQuery(query) {
    window.dispatchEvent(new CustomEvent("blog:search", { detail: query }));
  }

  function getMatchingSlugs(query) {
    if (!query) return null; // null = show all
    return index
      .filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.excerpt.toLowerCase().includes(query),
      )
      .map((p) => p.slug);
  }

  window.BlogSearch = { init, getMatchingSlugs };
})();
