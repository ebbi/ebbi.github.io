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
- C1b-seam-bare-p Extend the D-Tool-9 seam (D-Tool-19) so bare-<p> bodies are
  representable; migrate `update` (2 blocks, L-008 resolved); regenerate
  feed.json (3 entries). depends on: C1b-01
- C1b-02 Migrate the EN post `update` from the live HTML extraction
  (--from html) into content/en/update.json. Closed in C1b-seam-bare-p:
  update.json written and verified there (census {paragraph:2}); no separate
  re-open chat. depends on: C1b-seam-bare-p.

- C1b-03 Extend the D-Tool-9 seam (D-Tool-20): legacy bare `<p><img>`
  inline images are promoted to `image` blocks instead of being captured
  by the D-Tool-19 bare-<p> rule as paragraph text. part-22 recon
  {image:4,paragraph:55} (59 blocks), img_para_leftover=0; resolved L-009.
  No slug migrated this milestone (part-22 deferred to C1b-04). depends on:
  C1b-02.
- C1b-04 Migrate `a-contemporary-history-of-the-muslim-world-part-22-kosovo-2`
  from the live HTML (`--from html`) into content/en/. Census {image:4,paragraph:55}
  (59 blocks); feed.json 3 -> 4 entries; L-010 deferred. depends on: C1b-03.
- C1b-05 Migrate `a-contemporary-history-of-the-muslim-world-part-21-bosnia-2`
  from the live HTML (`--from html`) into content/en/. Recon/census {image:5,paragraph:82}
  (87 blocks), no new seam class; feed.json 4 -> 5 entries; L-010 not recurring here. depends on: C1b-04.
- C1b-06 Migrate `a-contemporary-history-of-the-muslim-world-part-20-kosovo-1`
  from the live HTML (`--from html`) into content/en/. Recon/census {image:3,paragraph:57}
  (60 blocks), no new seam class; feed.json 5 -> 6 entries; L-010 not recurring here. depends on: C1b-05.
- C1b-07 Migrate `a-contemporary-history-of-the-muslim-world-part-19-bosnia-1`
  from the live HTML (`--from html`) into content/en/. Recon/census {image:3,paragraph:51}
  (54 blocks), no new seam class (one verbatim `&nbsp;` spacer preserved per D-Tool-16);
  feed.json 6 -> 7 entries; L-010 not recurring here. depends on: C1b-06.
- C1b-08 Migrate `a-contemporary-history-of-the-muslim-world-part-18-algeria-3`
  from the live HTML (`--from html`) into content/en/. Recon/census {image:7,paragraph:48}
  (55 blocks; NOTE: image count was DEFECTIVE, corrected to {image:14,paragraph:48,embed:1}
  in C1b-09a / L-011), no new seam class (three verbatim `&nbsp;` spacers and inline `<em>`/`<strong>`
  preserved per D-Tool-15/D-Tool-16); feed.json 7 -> 8 entries; L-010 not recurring here. depends on: C1b-07.
- C1b-09a Extend the D-Tool-9 seam (D-Tool-21 legacy Jetpack embed; D-Tool-22
  legacy `figure.wp-caption` caption image) and remediate the discovered
  pre-existing silent loss. Recon on part-17 revealed TWO classes the frozen
  seam dropped: the Jetpack embed wrapper AND the caption-shortcode image
  (`figure.wp-caption`), the latter silently lost across EVERY shipped C1b
  slug (unrecorded until now; NEW-1/NEW-2). Re-migrated part-18/19/20/21/22
  from the live HTML so image/embed counts equal the live `entry-content`
  bodies: part-18 {image:14,paragraph:48,embed:1} (was {image:7,...});
  part-19 {image:17,paragraph:51} (was {image:3,...}); part-20
  {image:12,paragraph:57,embed:1} (was {image:3,...}); part-21
  {image:19,paragraph:82,embed:3} (was {image:5,...}); part-22
  {image:13,paragraph:55} (was {image:4,...}). Resolved L-011; L-004..L-006
  seam now READY. feed.json still 8 entries (no new slug). Non-regression:
  pilot 80; controlling-the-narrative 34; update 2 (byte-identical).
  depends on: C1b-08.
- C1b-09b Migrate `a-contemporary-history-of-the-muslim-world-part-17-algeria-2`
  from the live HTML (`--from html`) into content/en/. Recon/census
  {image:13,paragraph:59,embed:4} (76 blocks); all 4 embeds carry the raw
  `<iframe>` verbatim with `&#038;` preserved (D-Tool-21); 6 wp-caption
  captions present (D-Tool-22); all `*_para_leftover` = 0; no new seam class.
  feed.json 8 -> 9 entries (date-desc; part-17 at idx 7, after part-18).
  Resolved L-004; L-005/L-006 remain deferred (seam READY). Non-regression:
  pilot 80; controlling-the-narrative 34 {image:5,paragraph:24,quote:4,
  footnotes:1}, quote[3] len=240; update 2 {paragraph:2}; part-18..22
  byte-identical to their pre-C1b-09b committed files. depends on: C1b-09a.

## Now

- 07 App Shell & Toolbars: fixed top/bottom toolbars, drawer,
  language switcher reparented; transport buttons inert. depends on: 06
- 07b Theme toggle (light/dark/auto). depends on: 07
- 07c Font selection (modern/traditional). depends on: 07b
- TTS Text-to-speech (reserved; consumes the inert transport buttons).
  depends on: 07c

## Next (order per depends-on; each authored at the previous chat's close)

- B1 Renderer remaining block types (pullquote, resourceList, callout,
  footnotes, attachment). depends on: 09
- C1b-08..19 (series) remaining EN posts. The seam (through D-Tool-22) is
  COMPLETE; the only post known to carry core/embed is part-15 (L-005), whose
  representation is already frozen, so it is a plain migration. C1b-DONE
  proves 20/20, then posts.json deletion is unblocked.
  - C1b-10: migrate `a-contemporary-history-of-the-muslim-world-part-16-algeria-1`
    (posts.json date 2018-07-22). Plain migration; no new seam class. Pre-verified
    recon {image:15,paragraph:71,embed:2} (88 blocks), \*\_para_leftover = 0. No loss
    expected. feed.json 9 -> 10 entries. Then part-15 (L-005; representation already
    frozen) is also a plain migration.
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
- The D-Tool-9 extraction seam is frozen. Five narrow extensions exist so far
  (D-Tool-18 quote-cite; D-Tool-19 bare-<p>; D-Tool-20 bare-<p><img>; D-Tool-21
  legacy Jetpack embed; D-Tool-22 legacy figure.wp-caption image). Any additional
  extension is its own milestone with its own LOCKED_DECISIONS entry.
