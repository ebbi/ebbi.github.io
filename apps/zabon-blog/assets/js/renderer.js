/**
 * Zabon Blog — Frontend Renderer
 * Vanilla JS DOM builder for blog post blocks.
 * Exposes `window.BlogRenderer.render(blocks, targetElement)`
 */

// Module-scope helper (add near the top of the IIFE/object, before renderBlock).
// Decode HTML character references (&#8217;, &amp;, &nbsp;, etc.) to plain text
// WITHOUT interpreting tags. Safe for any field that is meant to be plain text
// but was extracted from HTML source (captions, alts if ever needed).
function decodeEntities(str) {
  if (!str) return "";
  const el = document.createElement("textarea");
  el.innerHTML = str;
  return el.value; // value returns the parsed text with entities decoded
}

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
        // Trusted: content authored and committed via import-post.js pipeline.
        p.innerHTML = block.content || "";
        return p;

      case "heading":
        const level = Math.min(Math.max(block.level || 2, 1), 6); // Ensure h1-h6
        const h = document.createElement(`h${level}`);
        // Trusted: content authored and committed via import-post.js pipeline.
        h.innerHTML = block.content || "";
        return h;

      case "image":
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        img.src = block.src || "";
        // Decode entities for the alt text too, for consistency.
        img.alt = decodeEntities(block.caption) || "Blog image";
        img.style.maxWidth = "100%"; // Basic responsive safeguard
        figure.appendChild(img);

        if (block.caption) {
          const figcaption = document.createElement("figcaption");
          // Captions are plain text but extracted from HTML source, so they may
          // carry character references (&#8217; etc.). Decode them; do NOT use
          // innerHTML, so a stray '<' can never become a tag.
          figcaption.textContent = decodeEntities(block.caption);
          figure.appendChild(figcaption);
        }
        return figure;

      case "quote":
        const blockquote = document.createElement("blockquote");
        // extractHtmlBlocks emits quote.content already stripped of tags but
        // with entities preserved (D-Tool-15) — the shape innerHTML wants.
        blockquote.innerHTML = block.content || "";
        return blockquote;

      case "footnotes":
        // NEW-3: content is the inner HTML of the source
        // <ol class="wp-block-footnotes"> (outer <ol> omitted by the seam).
        const footnotes = document.createElement("ol");
        footnotes.className = "footnotes";
        footnotes.innerHTML = block.content || "";
        return footnotes;

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

      case "pullquote": {
        // B1-D1: content is plain text (tags stripped, entities preserved)
        // — the same contract as quote (D-Tool-15); citation is optional
        // plain text. B1-D6: trusted-markup fields -> innerHTML; plain-text
        // fields -> textContent via decodeEntities().
        if (!block.content) return null;
        const pullquote = document.createElement("blockquote");
        pullquote.className = "pullquote";
        const pullquoteBody = document.createElement("div");
        pullquoteBody.className = "pullquote__content";
        pullquoteBody.innerHTML = block.content;
        pullquote.appendChild(pullquoteBody);
        if (block.citation) {
          const pullquoteCite = document.createElement("cite");
          pullquoteCite.className = "pullquote__citation";
          pullquoteCite.textContent = decodeEntities(block.citation);
          pullquote.appendChild(pullquoteCite);
        }
        return pullquote;
      }

      case "resourceList": {
        // B1-D2: content is the inner HTML of a source list (outer tag
        // omitted), mirroring footnotes/list; rendered as a classed <ul>.
        if (!block.content) return null;
        const resourceList = document.createElement("ul");
        resourceList.className = "resource-list";
        resourceList.innerHTML = block.content;
        return resourceList;
      }

      case "callout": {
        // B1-D3: content is trusted inner HTML (B1-D6 -> innerHTML).
        if (!block.content) return null;
        const callout = document.createElement("aside");
        callout.className = "callout callout--info";
        const calloutBody = document.createElement("div");
        calloutBody.className = "callout__content";
        calloutBody.innerHTML = block.content;
        callout.appendChild(calloutBody);
        return callout;
      }

      case "attachment": {
        // B1-D4: src is a required URL; caption/label are optional plain
        // text (B1-D6 -> textContent via decodeEntities()).
        if (!block.src) return null;
        const attachment = document.createElement("figure");
        attachment.className = "attachment";
        const attachmentLink = document.createElement("a");
        attachmentLink.className = "attachment__link";
        attachmentLink.href = block.src;
        attachmentLink.textContent = block.label
          ? decodeEntities(block.label)
          : block.src;
        attachment.appendChild(attachmentLink);
        if (block.caption) {
          const attachmentCaption = document.createElement("figcaption");
          attachmentCaption.className = "attachment__caption";
          attachmentCaption.textContent = decodeEntities(block.caption);
          attachment.appendChild(attachmentCaption);
        }
        return attachment;
      }

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
