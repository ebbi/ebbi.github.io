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

  // Milestone 10c (D-10c-3): non-blog entries excluded from the blog set
  // entirely. These slugs were never blog posts and must not appear in
  // renderList. The exclusion is DISPLAY-only (files stay on disk; a direct
  // URL may still resolve through renderPost). Kept as a hardcoded deny-list
  // here (single source in app.js) because feed.json is generated and fenced.
  const NON_BLOG_SLUGS = [
    "controlling-the-narrative",
    "update",
    "a-contemporary-history-of-the-muslim-world-contents",
  ];

  // TTS2: the sentence<->DOM mapping for the CURRENT post, rebuilt on demand.
  // `readableSentences[i]` is the spoken sentence i; `readableNodes[i]` is the
  // source node (title / <p> / <blockquote>); `readableRanges[i]` is the DOM
  // Range spanning exactly that sentence's text within the node (for a
  // sentence-granular highlight). All are 1:1 and share TTS's splitSentences()
  // rule (D-TTS2-2). tts.js never sees these.
  let readableSentences = [];
  let readableNodes = [];
  let readableRanges = [];
  let activeHighlightRange = null;
  let activeHighlightNode = null;

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
   * TTS2 fallback sentence splitter. Used ONLY when tts.js (window.BlogTTS)
   * is absent, so the app still degrades gracefully. When tts.js is present we
   * ALWAYS use BlogTTS.splitSentences so the spoken list and our node list
   * share one rule (D-TTS2-2). This mirrors that rule exactly.
   * @param {string} text
   * @returns {string[]}
   */
  function fallbackSplitSentences(text) {
    const body =
      typeof text === "string" ? text.replace(/\s+/g, " ").trim() : "";
    if (!body) return [];
    const parts = body
      .split(/(?<=[.!?\u2026][)"'\u201d\u2019\]]?)\s+|\n+/)
      .map((s) => s.trim())
      .filter(Boolean);
    return parts.length ? parts : [body];
  }
  /**
   * The sentence-splitting rule in force: tts.js's when available (single
   * source, D-TTS2-2), else the local mirror.
   * @param {string} text
   * @returns {string[]}
   */
  function splitSentences(text) {
    if (window.BlogTTS && typeof window.BlogTTS.splitSentences === "function") {
      return window.BlogTTS.splitSentences(text);
    }
    return fallbackSplitSentences(text);
  }
  /**
   * TTS2: the readable SOURCE NODES of the CURRENT post, in reading order,
   * gathered from the RENDERED post DOM (X-2, UNCHANGED rule).
   *
   * Inclusion rule: title (.post-header__title) first, then, in document
   * order, every <p> and <blockquote> inside .post-content.
   * Exclusion rule: prose nested in pre/code, .embed-container, figure, or
   * table is SKIPPED (same vertices gatherReadableText has always honoured).
   * @returns {HTMLElement[]}
   */
  function gatherReadableNodes() {
    const container = document.getElementById("app");
    if (!container) return [];
    const nodes = [];

    const title = container.querySelector(".post-header__title");
    if (title && (title.textContent || "").trim()) nodes.push(title);

    const content = container.querySelector(".post-content");
    if (content) {
      const prose = content.querySelectorAll("p, blockquote");
      prose.forEach((el) => {
        if (el.closest("pre, code, .embed-container, figure, table")) return;
        if ((el.textContent || "").replace(/\s+/g, " ").trim()) nodes.push(el);
      });
    }
    return nodes;
  }

  /**
   * TTS2: collapse a node's RAW textContent the SAME way the splitter does
   * (whitespace runs -> one space, trimmed at both ends), returning the
   * collapsed string plus a map from collapsed index -> raw index, so a
   * sentence's position can be mapped back onto the DOM.
   * @param {string} raw
   * @returns {{text:string, rawIndexAt:number[]}}
   */
  function collapseWithMap(raw) {
    const chars = [];
    const rawIndexAt = [];
    for (let i = 0; i < raw.length; i += 1) {
      const c = raw[i];
      if (/\s/.test(c)) {
        if (chars.length === 0) continue; // drop leading whitespace
        if (chars[chars.length - 1] === " ") continue; // collapse runs
        chars.push(" ");
        rawIndexAt.push(i);
      } else {
        chars.push(c);
        rawIndexAt.push(i);
      }
    }
    // drop trailing whitespace
    while (chars.length && chars[chars.length - 1] === " ") {
      chars.pop();
      rawIndexAt.pop();
    }
    return { text: chars.join(""), rawIndexAt: rawIndexAt };
  }

  /**
   * TTS2: turn a raw-text offset within `node` into a (textNode, offset) pair
   * by walking the node's descendant text nodes. Used to build a Range.
   * @param {HTMLElement} node
   * @param {number} rawOffset
   * @returns {{node:Text, offset:number}}
   */
  function locateRawOffset(node, rawOffset) {
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
    let seen = 0;
    let last = null;
    let n;
    while ((n = walker.nextNode())) {
      const len = n.data.length;
      if (rawOffset <= seen + len) {
        return { node: n, offset: rawOffset - seen };
      }
      seen += len;
      last = n;
    }
    // Fallback: end of the last text node.
    if (last) return { node: last, offset: last.data.length };
    return { node: node, offset: node.childNodes.length };
  }
  /**
   * TTS2: build a DOM Range spanning the sentence that starts at `startRaw`
   * with length `lenCollapsed` inside `node`. Because a sentence's text may
   * span inline elements (<a>, <em>), the range is computed from character
   * offsets, not from a single text node.
   * @param {HTMLElement} node
   * @param {number} startRaw raw-text offset where the sentence begins
   * @param {number} lenCollapsed sentence length in collapsed characters
   * @returns {Range|null}
   */
  function rangeForSentence(node, startRaw, lenCollapsed) {
    try {
      const start = locateRawOffset(node, startRaw);
      const end = locateRawOffset(node, startRaw + lenCollapsed);
      const range = document.createRange();
      range.setStart(start.node, start.offset);
      range.setEnd(end.node, end.offset);
      return range;
    } catch (err) {
      return null;
    }
  }

  /**
   * TTS2: build the ordered sentence list, the parallel node list, and the
   * parallel Range list for the CURRENT post. Each source node's text is split
   * with the SHARED rule; sentence starts are located by sequential search in
   * the collapsed text and mapped to a Range, so sentence N is 1:1 with a
   * precise DOM range (D-TTS2-2). Also marks readable nodes with the
   * presentation-only `tts-readable` class for the click affordance.
   * @returns {string[]} the spoken sentence array (also cached in
   *   readableSentences with the parallel readableNodes / readableRanges).
   */
  function buildReadableSentences() {
    const nodes = gatherReadableNodes();
    const sentences = [];
    const map = [];
    const ranges = [];
    nodes.forEach((node) => {
      const raw = node.textContent || "";
      const collapsed = collapseWithMap(raw);
      if (!collapsed.text) return;
      const parts = splitSentences(collapsed.text);
      let cursor = 0; // search position in the collapsed string
      parts.forEach((sentence) => {
        const at = collapsed.text.indexOf(sentence, cursor);
        const startCollapsed = at < 0 ? cursor : at;
        cursor = startCollapsed + sentence.length;
        const startRaw =
          startCollapsed < collapsed.rawIndexAt.length
            ? collapsed.rawIndexAt[startCollapsed]
            : raw.length;
        sentences.push(sentence);
        map.push(node);
        ranges.push(rangeForSentence(node, startRaw, sentence.length));
      });
      node.classList.add("tts-readable");
    });
    readableSentences = sentences;
    readableNodes = map;
    readableRanges = ranges;
    return sentences;
  }

  /**
   * Milestone TTS: the readable text of the CURRENT post as a single string
   * (the X-2 rule, UNCHANGED): title first, then the prose of every readable
   * <p>/<blockquote>. Exposed for callers that want the plain text; Play uses
   * buildReadableSentences() so the spoken list and the node map stay 1:1.
   * @returns {string}
   */
  function gatherReadableText() {
    return buildReadableSentences().join("\n\n");
  }

  /**
   * TTS2: the app-owned resolver from a sentence index to its source DOM node.
   * Handed to tts.js via adviseResolver() so highlightTarget() can answer
   * without tts.js ever touching the post DOM (D-TTS2-6).
   * @param {number} index
   * @returns {HTMLElement|null}
   */
  function nodeForSentence(index) {
    if (index < 0 || index >= readableNodes.length) return null;
    return readableNodes[index] || null;
  }

  /**
   * TTS2: the sentence index of the FIRST spoken sentence produced by `node`,
   * or -1 when the node is not a readable source (D-TTS2-4).
   * @param {HTMLElement} node
   * @returns {number}
   */
  function firstSentenceIndexOf(node) {
    return readableNodes.indexOf(node);
  }

  /** The CSS Custom Highlight registry (progressive enhancement). */
  function highlightRegistry() {
    return typeof CSS !== "undefined" && CSS.highlights ? CSS.highlights : null;
  }

  /**
   * TTS2: the sentence index under a VIEWPORT POINT, or -1. Uses the caret
   * position for the point and returns the sentence Range that CONTAINS that
   * caret. This is what makes click-to-read start from the exact sentence
   * clicked: hit-testing the clicked ELEMENT would match every sentence in the
   * paragraph (the element intersects all of them) and wrongly return the
   * first. Coordinate hit-testing is robust for multi-sentence paragraphs and
   * for sentences that span inline markup.
   * @param {number} x viewport X (event.clientX)
   * @param {number} y viewport Y (event.clientY)
   * @returns {number} sentence index, or -1 when no sentence is under (x, y)
   */
  function sentenceIndexAtPoint(x, y) {
    // 1) Caret at the clicked point -> prefer the sentence containing it.
    let caretNode = null;
    let caretOffset = -1;
    try {
      let caret = null;
      if (document.caretRangeFromPoint) {
        caret = document.caretRangeFromPoint(x, y); // WebKit/Blink
      } else if (document.caretPositionFromPoint) {
        const pos = document.caretPositionFromPoint(x, y); // Firefox
        if (pos) {
          caretNode = pos.offsetNode;
          caretOffset = pos.offset;
        }
      }
      if (caret) {
        caretNode = caret.startContainer;
        caretOffset = caret.startOffset;
      }
    } catch (err) {
      /* non-fatal; fall through to the point-in-range test */
    }
    if (caretNode) {
      for (let i = 0; i < readableRanges.length; i += 1) {
        const r = readableRanges[i];
        if (!r) continue;
        try {
          // Range.comparePoint returns -1 (before), 0 (within, inclusive of
          // edges), or 1 (after). Only 0 means the caret is inside the range.
          if (r.comparePoint(caretNode, caretOffset) === 0) {
            return i;
          }
        } catch (err) {
          /* detached range; skip */
        }
      }
      // The caret is not inside any tracked range (e.g. the gap between
      // sentences): fall back to the first sentence whose node holds the caret.
      const owner = caretNode.nodeType === 3 ? caretNode.parentNode : caretNode;
      if (owner) {
        const node =
          owner.closest &&
          owner.closest(
            ".post-header__title, .post-content p, .post-content blockquote",
          );
        const idx = node ? firstSentenceIndexOf(node) : -1;
        if (idx >= 0) return idx;
      }
    }
    // 2) Fallback (no caret API): the element under the point -> its readable
    // source node -> that node's FIRST sentence. Sentence-precise seeking
    // needs a caret; without one we still seek to the clicked paragraph.
    try {
      const el = document.elementFromPoint
        ? document.elementFromPoint(x, y)
        : null;
      const node =
        el &&
        el.closest &&
        el.closest(
          ".post-header__title, .post-content p, .post-content blockquote",
        );
      if (node) return firstSentenceIndexOf(node);
    } catch (err) {
      /* non-fatal */
    }
    return -1;
  }

  /**
   * TTS2: the highlight controller (sentence granular). Highlights EXACTLY the
   * active sentence using the CSS Custom Highlight API when available, so only
   * the sentence — not the whole paragraph — is marked (D-TTS2-5). Falls back
   * to a whole-node class when the registry is unavailable. `index === -1`
   * (no active sentence) clears the highlight. Also scrolls the active
   * sentence towards the TOP of the viewport (best-effort; skipped when the
   * user prefers reduced motion).
   * @param {number} index
   */
  function updateHighlight(index) {
    const registry = highlightRegistry();
    const range = index >= 0 ? readableRanges[index] : null;
    const node = nodeForSentence(index);

    // Clear the previous presentation.
    if (activeHighlightNode) {
      activeHighlightNode.classList.remove("tts-sentence--active");
    }
    if (registry) {
      if (range) {
        registry.set("tts-sentence", new Highlight(range));
      } else {
        registry.delete("tts-sentence");
      }
    }
    activeHighlightRange = range || null;

    if (node && range) {
      // Whole-node class ONLY as the fallback affordance when no registry.
      if (!registry) node.classList.add("tts-sentence--active");
      activeHighlightNode = registry ? null : node;
      // Bring the sentence towards the TOP of the viewport. Skipped under
      // prefers-reduced-motion.
      try {
        const reduce =
          window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!reduce) {
          const rect = range.getBoundingClientRect();
          if (
            rect &&
            (rect.top < 80 || rect.bottom > window.innerHeight - 80)
          ) {
            const y = rect.top + window.scrollY - 96; // leave room for the bar
            window.scrollTo({ top: y, behavior: "smooth" });
          }
        }
      } catch (err) {
        /* non-fatal */
      }
    } else {
      activeHighlightNode = null;
    }
  }

  /**
   * TTS2: clear any highlight (stop / route change / end). Safe to call when
   * nothing is highlighted.
   */
  function clearHighlight() {
    const registry = highlightRegistry();
    if (registry) {
      try {
        registry.delete("tts-sentence");
      } catch (err) {
        /* non-fatal */
      }
    }
    if (activeHighlightNode) {
      activeHighlightNode.classList.remove("tts-sentence--active");
    }
    activeHighlightNode = null;
    activeHighlightRange = null;
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
    // Milestone 11a (D-11a-9): the raw ISO date was removed from the header
    // (it was already removed from the list in 10c; the header kept it and
    // displayed the machine timestamp verbatim). The header now shows ONLY
    // the language code badge.
    container.innerHTML = `
      <article class="post-detail">
        <header class="post-header">
          <h1 class="post-header__title">${body.title}</h1>
          <p class="post-header__meta">${body.lang.toUpperCase()}</p>
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

    // Milestone TTS2: bind the delegated click-to-read handler ONCE on the
    // persistent #app container (renderPost replaces the post DOM on every
    // route change, so binding per render would leak). A click on any readable
    // text starts reading from the CLICKED SENTENCE (caret hit-test), falling
    // back to the clicked node's first sentence; clicks on <a> links
    // (navigation) and on skipped regions are ignored (D-TTS2-4).
    if (!container.dataset.ttsSeekBound) {
      container.addEventListener("click", function (event) {
        // Links keep their own behaviour — never hijack navigation.
        if (event.target.closest && event.target.closest("a")) return;
        const node =
          event.target.closest &&
          event.target.closest(
            ".post-header__title, .post-content p, .post-content blockquote",
          );
        if (!node) return;
        // Rebuild the mapping from the LIVE DOM so indices are never stale.
        buildReadableSentences();
        // Prefer the EXACT sentence clicked (coordinate hit-test on the caret
        // position); fall back to the node's first sentence.
        let start = sentenceIndexAtPoint(event.clientX, event.clientY);
        if (start < 0) start = firstSentenceIndexOf(node);
        if (start < 0) return; // not a readable source (skipped region etc.)
        if (window.BlogTTS && typeof window.BlogTTS.speak === "function") {
          window.BlogTTS.speak(readableSentences, { start: start });
        }
      });
      container.dataset.ttsSeekBound = "true";
    }

    // Milestone TTS2: rebuild the sentence<->node mapping for this post and
    // prime the highlight controller. This also tags readable nodes with the
    // `tts-readable` affordance class (presentation only, D-TTS2-5).
    buildReadableSentences();

    // Milestone TTS: a post is rendered — enable the transport (Play enabled,
    // Pause/Stop disabled) per X-3. Guarded; the app is unaffected if TTS is
    // absent or the Web Speech API is unavailable.
    if (window.BlogTTS && typeof window.BlogTTS.setEnabled === "function") {
      window.BlogTTS.setEnabled({ play: true, pause: false, stop: false });
    }
  }

  /**
   * Render the home/list view.
   * Milestone 08: namespaced item classes; list is the single filter site.
   * C1b-18: the series is grouped/sorted by integer `seriesOrder` so the
   * reader sees the series in READING ORDER (1 -> 23); non-series posts
   * (`update`, `controlling-the-narrative`, any future post) keep the default
   * date-desc order from feed.json.
   * Milestone 10c (SUPERSEDES 10b): the list is ONE collapsible panel titled
   * "Two Legs Bad", DEFAULT OPEN, that REUSES 10b's existing card classes
   * (.post-list-item card + .post-list-item__toggle with its rotating caret,
   * .post-list-item__panel body) — so the panel needs ZERO new CSS. The posts
   * below it are a compact blog INDEX (a table-of-contents-like ruled list,
   * option B) in reading order: each entry is a heading that is ITSELF the
   * navigation link (no per-item panel, no date, no summary, no "Read full
   * post" link — D-10c-1/D-10c-4). Non-blog slugs are excluded (D-10c-3).
   * C1b-18 ordering is preserved verbatim (D-10c-7).
   * @param {{lang: string}} route
   */
  function renderList(route) {
    const container = document.getElementById("app");
    if (!container) return;

    const visible = posts.filter(
      (p) =>
        (!route.lang || p.lang === route.lang) &&
        NON_BLOG_SLUGS.indexOf(p.slug) === -1,
    );

    if (visible.length === 0) {
      container.innerHTML =
        '<div class="no-posts"><h2>No posts found</h2><p>Try another language.</p></div>';
      return;
    }

    // C1b-18: partition into series (integer seriesOrder) and non-series.
    // The series is emitted FIRST in reading order (1 -> 23); non-series
    // follow in the feed's date-desc order. Ordering is stable, so entries
    // without an order keep their relative feed position.
    const series = visible.filter((p) => Number.isInteger(p.seriesOrder));
    const rest = visible.filter((p) => !Number.isInteger(p.seriesOrder));
    series.sort((a, b) => a.seriesOrder - b.seriesOrder);
    const ordered = series.concat(rest);

    // 10c (D-10c-1, option B): compact index — ruled rows, heading is the
    // link. New classes only (.blog-index*) so no existing class changes
    // meaning; the ONE additive CSS block styles these.
    const indexHtml = ordered
      .map((post) => {
        return `
        <li class="blog-index__item">
          <a class="blog-index__link" href="#/${post.lang}/post/${post.slug}">${post.title}</a>
        </li>
    `;
      })
      .join("");

    // 10c (D-10c-2): ONE outer collapsible panel, DEFAULT OPEN (aria-expanded
    // true; no `hidden` on the body). REUSES 10b's existing classes for the
    // card + rotating caret (.post-list-item + .post-list-item__toggle +
    // .post-list-item__panel); zero new CSS for the panel. The <ul> is the
    // compact blog index (B).
    container.innerHTML = `
      <article class="post-list-item">
        <button class="post-list-item__toggle" type="button"
                aria-expanded="true" aria-controls="blog-panel-body">
          <span class="post-list-item__title-text">Two Legs Bad</span>
        </button>
        <div class="post-list-item__panel" id="blog-panel-body">
          <ul class="blog-index">${indexHtml}
          </ul>
        </div>
      </article>
    `;

    // 10c (D-10c-2): ONE delegated click listener on the list container.
    // renderList replaces innerHTML on every route change, so bind once
    // (guarded) rather than per render. The real <button> gives keyboard
    // activation (Enter/Space) for free; this only toggles state.
    if (!container.dataset.blogPanelBound) {
      container.addEventListener("click", (event) => {
        const toggle = event.target.closest(".post-list-item__toggle");
        if (!toggle || !container.contains(toggle)) return;
        const bodyId = toggle.getAttribute("aria-controls");
        const body = bodyId ? document.getElementById(bodyId) : null;
        if (!body) return;
        const expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", expanded ? "false" : "true");
        if (expanded) {
          body.setAttribute("hidden", "");
        } else {
          body.removeAttribute("hidden");
        }
      });
      container.dataset.blogPanelBound = "true";
    }

    // Milestone TTS: the list view has nothing to read — keep all three
    // transport buttons inert (X-3/X-6). Guarded.
    if (window.BlogTTS && typeof window.BlogTTS.setEnabled === "function") {
      window.BlogTTS.setEnabled({ all: true });
    }
  }

  /**
   * Handle a route change emitted by router.js.
   * Router vocabulary: type is 'list' or 'post'.
   * @param {{lang: string, type: string, slug: string|null}} route
   */

  function handleRouteChange(route) {
    if (!route) return;

    // Milestone TTS: stop any in-flight speech BEFORE changing the view, so a
    // post->post or post->list transition never leaves two utterances running
    // (X-4). Guarded; no-op when TTS is absent.
    if (window.BlogTTS && typeof window.BlogTTS.stop === "function") {
      window.BlogTTS.stop();
    }
    // Milestone TTS2: clear the highlight on every route change (belt-and-
    // braces alongside stop()'s no-active-sentence signal) and drop the stale
    // mapping so a post->list transition leaves no highlight behind (D-TTS2-5).
    clearHighlight();
    readableSentences = [];
    readableNodes = [];
    readableRanges = [];

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

      // Milestone 07b: resolve + apply the persisted/auto theme once.
      // No router dependency; guarded — the app must not break if theme.js
      // fails to load. The pre-paint application lives in theme.js loaded
      // in <head> (T-3); this wires the control + OS listener.
      if (window.BlogTheme && typeof window.BlogTheme.init === "function") {
        window.BlogTheme.init();
      } else {
        console.warn("⚠️ BlogTheme not found; theme toggle disabled.");
      }

      // Milestone 07c: resolve + apply the persisted/default font family once.
      // No router dependency; guarded — the app must not break if font.js
      // fails to load. The pre-paint application lives in font.js loaded in
      // <head> (F-3); this wires the control.
      if (window.BlogFont && typeof window.BlogFont.init === "function") {
        window.BlogFont.init();
      } else {
        console.warn("⚠️ BlogFont not found; font selection disabled.");
      }

      // Milestone TTS: wire the transport buttons once and hand tts.js a
      // live getter for the current post's readable text. Guarded — the app
      // must not break if tts.js fails to load or speechSynthesis is
      // unavailable (X-5).
      // Milestone TTS2: getText returns the SENTENCE ARRAY (built with tts.js's
      // own splitter) so the spoken list and our sentence->node map stay 1:1
      // (D-TTS2-2); register the per-sentence progress listener to drive the
      // highlight, and hand tts.js the app-owned node resolver (D-TTS2-1/6).
      if (window.BlogTTS && typeof window.BlogTTS.init === "function") {
        window.BlogTTS.init({
          getText: function () {
            return buildReadableSentences();
          },
        });
        if (typeof window.BlogTTS.onSentence === "function") {
          window.BlogTTS.onSentence(function (idx) {
            updateHighlight(idx);
          });
        }
        if (typeof window.BlogTTS.adviseResolver === "function") {
          window.BlogTTS.adviseResolver(nodeForSentence);
        }
      } else {
        console.warn("⚠️ BlogTTS not found; text-to-speech disabled.");
      }
    } else {
      console.error("❌ BlogRouter not found; falling back to initial render.");
      handleRouteChange({ lang: "en", type: "list", slug: null });
    }
  });
})();
