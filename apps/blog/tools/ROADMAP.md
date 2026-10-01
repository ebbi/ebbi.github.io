# Zabon Blog - Roadmap

Not a milestone file. Themes, status, and dependencies only. Milestone
files are authored one at a time, at the close of the previous one
(WORKFLOW.md step 7). Statuses: done | now | next | deferred.

## Done

- 00 Bootstrap & Foundation. depends on: none
- 01 Content Fetcher. depends on: 00
- 02 Block Parser. depends on: 01
- 03 Renderer. depends on: 02
- 04 Router. depends on: 00
- 05a Feeds & Search Index (feed.json; search-index not adopted). depends on: 02
- 05a-fix Repair hash-state.js. depends on: 05a
- 05b Search UI. attempted, reverted, removed.
- 05b-removal Remove Search UI; repair render/list wiring. depends on: 05b
- W1 Adopt workflow fix (b); pointer; document workflow. depends on: none
- 08 Post List Page. depends on: 07
- 09 Single Post Page. depends on: 08
- C1a Content migration, pilot: machinery (app.js reads feed.json index;
  renderPost fetches content/<lang>/<slug>.json; generate-index.js reads
  content/) + 1 EN pilot post. depends on: 09
- C1-tool Build tools/import-post.js (fetch/cache/write envelope + frozen extraction seam). depends on: C1a
- C1-tool-p2 Wire extractHtmlBlocks() (faithful HTML->blocks). depends on: C1-tool
- C1-model Settle content model + freeze quote/table/title shapes. Decision-only. depends on: C1-tool-p2
- C1-tool-cleanup Execute C1-model decisions; regenerate the pilot (80 blocks); repair .gitignore (W1/W7). depends on: C1-model
- C1-tool-seam-complete ...
- C1b-01 Migrate controlling-the-narrative from the live HTML extraction
  (--from html) into content/en/controlling-the-narrative.json; prove 34-block
  census; fix cite-carrying quote loss (D-Tool-18). depends on:
  C1-tool-seam-complete

## Now

- 07 App Shell & Toolbars: fixed top/bottom toolbars, drawer,
  language switcher reparented; transport buttons inert. depends on: 06
- 07b Theme toggle (light/dark/auto). depends on: 07
- 07c Font selection (modern/traditional). depends on: 07b
- TTS Text-to-speech (reserved; consumes the inert transport buttons).
  depends on: 07c

## Next (order per depends-on; each authored at the previous chat's close)

- C1b-seam-bare-p Extend the D-Tool-9 seam (a second narrow extension; first
  was D-Tool-18) so extractHtmlBlocks/blockFromFragment can represent BARE
  <p> elements directly inside entry-content, with no wp-block-paragraph
  wrapper. Proves update migrates to its live census (2 blocks, see L-008).
  Recorded as a new locked decision (D-Tool-19). depends on: C1b-01.
  Milestone file authored at C1b-02's close. NOTE: without this milestone,
  update.json cannot be written and C1b-02 stays blocked (L-008).
- C1b-02 (BLOCKED) Migrate the EN post `update` from the live HTML extraction
  (--from html) into content/en/update.json. BLOCKED on C1b-seam-bare-p:
  the sealed extractor cannot represent bare-<p> posts (L-008). Re-open
  after C1b-seam-bare-p lands and re-run the migration. depends on:
  C1b-seam-bare-p.
- C1-tool-seam-complete Make extractHtmlBlocks faithful to entry-content
  (skip-and-continue loop; footnotes; recover dropped paragraphs). Supersedes
  C1-tool-seam-footnotes. depends on: C1-tool-cleanup
- B1 Renderer remaining block types (pullquote, resourceList, callout,
  footnotes, attachment). depends on: 09
- C1b-03..19 (series) remaining EN posts. Corpus KNOWN to include (a) posts
  with core/embed (L-004..L-006, deferred) and (b) posts whose body is bare
  <p> with no wp-block-* markers (L-008). Each class needs its own seam
  extension milestone before the affected slugs can migrate. C1b-DONE proves
  20/20, then posts.json deletion is unblocked.
- 10b List item as collapsible panel: title toggles the excerpt + a
  "read full post" link (mobile-first; keyboard-accessible). Revisits
  08's list presentation. depends on: C1b
- 11 Translations & i18n UI. depends on: C1
- 12a RTL & Typography - Persian/Arabic. depends on: 11
- 12b RTL & Typography - Thai/Myanmar. depends on: 12a
- 13a Accessibility & Keyboard Nav. depends on: 12b
- 13b Performance & Caching (Service Worker). depends on: 13a
- 13c SEO & Meta Tags. depends on: 13b
- D1 GitHub Pages wiring under apps/blog/. depends on: 13c
- 14b Cross-browser Testing. depends on: D1, B1
- 14c Final Sign-off & Staging Push. depends on: 14b

## Deferred / decided-not-to-do

- Search UI / search index. Closed by 05b-removal. Re-open only as a
  deliberate future milestone.
- About / Static Pages (was 10). Decided-not-to-do at 09 close: low
  priority, no downstream dependency. Re-open only if a static page
  (About-Us / contact) is deliberately wanted; note that a real About
  route requires a router.js route-type change, since router.js owns
  the route vocabulary (see Cross-cutting facts).

## Cross-cutting facts every milestone must respect

- Route vocabulary owned by router.js: { lang, type: 'list'|'post', slug, raw }.
- content/<lang>/<slug>.json is the canonical post source from C1a on;
  feed.json is the derived list index; posts.json is inert (C1a-D3).
- RTL set currently hardcoded in router.js; belongs in LOCKED_DECISIONS.txt.
- LOCKED_DECISIONS lists 8 UI languages; 4 content languages. Switcher
  ships the content set only.
- Post slugs are language-agnostic.
- The D-Tool-9 extraction seam is frozen. Two narrow extensions exist so far
  (D-Tool-18 quote-cite; D-Tool-19 proposed for bare-<p>). Any additional
  extension is its own milestone with its own LOCKED_DECISIONS entry.
