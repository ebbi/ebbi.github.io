# Zabon Blog - Roadmap

Not a milestone file. Themes, status, and dependencies only. Milestone
files are authored one at a time, at the close of the previous one
(WORKFLOW.md step 7). Statuses: done | now | next | deferred.

## Done

- 00  Bootstrap & Foundation. depends on: none
- 01  Content Fetcher. depends on: 00
- 02  Block Parser. depends on: 01
- 03  Renderer. depends on: 02
- 04  Router. depends on: 00
- 05a Feeds & Search Index (feed.json; search-index not adopted). depends on: 02
- 05a-fix Repair hash-state.js. depends on: 05a
- 05b Search UI. attempted, reverted, removed.
- 05b-removal Remove Search UI; repair render/list wiring. depends on: 05b
- W1  Adopt workflow fix (b); pointer; document workflow. depends on: none

## Now

- W1-fix Create ROADMAP.md; harden WORKFLOW.md step 6. depends on: W1

## Next (order per depends-on; each authored at the previous chat's close)

- 06  Navigation & Header. depends on: done set
- 07  Footer & Global UI. depends on: 06
- 08  Post List Page. depends on: 07
- 09  Single Post Page. depends on: 08
- B1  Renderer remaining block types (pullquote, resourceList, callout,
      footnotes, attachment). depends on: 09
- 10  About / Static Pages. depends on: 08
- C1  Content migration: posts.json to content/<lang>/<slug>.json;
      rewire app fetch path (closes LOCKED_DECISIONS Recovery line).
      depends on: 09, 10
- 11  Translations & i18n UI. depends on: C1
- 12a RTL & Typography - Persian/Arabic. depends on: 11
- 12b RTL & Typography - Thai/Myanmar. depends on: 12a
- 13a Accessibility & Keyboard Nav. depends on: 12b
- 13b Performance & Caching (Service Worker). depends on: 13a
- 13c SEO & Meta Tags. depends on: 13b
- D1  GitHub Pages wiring under apps/blog/. depends on: 13c
- 14b Cross-browser Testing. depends on: D1, B1
- 14c Final Sign-off & Staging Push. depends on: 14b

## Deferred / decided-not-to-do

- Search UI / search index. Closed by 05b-removal. Re-open only as a
  deliberate future milestone.

## Cross-cutting facts every milestone must respect

- Route vocabulary owned by router.js: { lang, type: 'list'|'post', slug, raw }.
- posts.json + feed.json are the interim data contract until C1.
- RTL set currently hardcoded in router.js; belongs in LOCKED_DECISIONS.txt.
- LOCKED_DECISIONS lists 8 UI languages; 4 content languages. Switcher
  ships the content set only.
- Post slugs are language-agnostic.
