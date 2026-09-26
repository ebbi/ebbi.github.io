/**
 * Zabon Blog — Frontend Renderer
 * Vanilla JS DOM builder for blog post blocks.
 * Exposes `window.BlogRenderer.render(blocks, targetElement)`
 */

window.BlogRenderer = {
  /**
   * Renders an array of block objects into the DOM.
   * @param {Array} blocks - Array of block objects from posts.json
   * @param {HTMLElement} targetElement - Where to append the content (defaults to document.body)
   */
  render: function (blocks, targetElement) {
    if (!blocks || !Array.isArray(blocks)) {
      console.error("BlogRenderer.render: blocks must be an array");
      return;
    }

    const container = targetElement || document.body;
    const wrapper = document.createElement("div");
    wrapper.className = "blog-post-content";

    blocks.forEach((block) => {
      const el = this.renderBlock(block);
      if (el) {
        wrapper.appendChild(el);
      }
    });

    container.appendChild(wrapper);
    console.log(
      `✅ Successfully rendered ${blocks.length} blocks into`,
      container,
    );
  },

  /**
   * Renders a single block object into a DOM element.
   * @param {Object} block - The block object
   * @returns {HTMLElement|null}
   */
  renderBlock: function (block) {
    if (!block || !block.type) return null;

    switch (block.type) {
      case "paragraph":
        const p = document.createElement("p");
        p.textContent = block.content || "";
        return p;

      case "heading":
        const level = Math.min(Math.max(block.level || 2, 1), 6); // Ensure h1-h6
        const h = document.createElement(`h${level}`);
        h.textContent = block.content || "";
        return h;

      case "image":
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = block.src || "";
        img.alt = block.caption || "Blog image";
        img.style.maxWidth = "100%"; // Basic responsive safeguard
        figure.appendChild(img);

        if (block.caption) {
          const figcaption = document.createElement("figcaption");
          figcaption.textContent = block.caption;
          figure.appendChild(figcaption);
        }
        return figure;

      case "quote":
        const blockquote = document.createElement("blockquote");
        blockquote.textContent = block.content || "";
        return blockquote;

      case "list":
        const list = document.createElement(block.ordered ? "ol" : "ul");
        // The parser preserves <li> tags inside the list content.
        // Since this comes from our own trusted build pipeline, innerHTML is safe here.
        list.innerHTML = block.content || "";
        return list;

      case "table":
        const table = document.createElement("table");
        table.innerHTML = block.content || "";
        return table;

      case "divider":
        return document.createElement("hr");

      case "embed":
        const embedDiv = document.createElement("div");
        embedDiv.className = "embed-container";
        embedDiv.innerHTML = block.content || "";
        return embedDiv;

      default:
        console.warn(
          "BlogRenderer: Unknown block type encountered:",
          block.type,
        );
        // Fallback to prevent breaking the render loop
        const fallback = document.createElement("div");
        fallback.className = "block-fallback";
        fallback.textContent = `[Unsupported block: ${block.type}]`;
        return fallback;
    }
  },
};

console.log("✅ BlogRenderer loaded successfully. Ready to render.");
