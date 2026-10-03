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
- C1b-10 Migrate `a-contemporary-history-of-the-muslim-world-part-16-algeria-1`
  from the live HTML (`--from html`) into content/en/. Recon/census
  {image:15,paragraph:71,embed:2} (88 blocks); both embeds carry the raw
  `<iframe>` verbatim with `&#038;` preserved (D-Tool-21); 15 image blocks =
  8 bare `<p><img>` (D-Tool-20) + 7 `figure.wp-caption` (D-Tool-22; 7 captions);
  all `*_para_leftover` = 0; no new seam class. feed.json 9 -> 10 entries
  (date-desc; part-16 at idx 8, after part-17). No LOSS_LEDGER row (no loss).
  Non-regression: pilot 80; controlling-the-narrative 34 {image:5,paragraph:24,
  quote:4,footnotes:1}, quote[3] len=240; update 2 {paragraph:2}; part-17..22
  byte-identical to their pre-C1b-10 committed files. depends on: C1b-09b.
- C1b-11: migrate `a-contemporary-history-of-the-muslim-world-part-15-the-afghan-arabs`
  (posts.json date 2018-06-11). The LAST post carrying the legacy Jetpack embed
  (L-005), whose representation is ALREADY frozen (D-Tool-21, seam READY) —
  plain migration; no new seam class expected. Resolves L-005. feed.json
  10 -> 11 entries. Confirm slug/title/date from posts.json AND the live post
  at close (part-13's slug has a `protected-` prefix — verify fetchability
  when its milestone arrives).
  STATUS: STOPPED (2026). Recon revealed a NEW structural class — a bare <p>
  whose sole content is an <em>-wrapped <img> (source of the markdown
  `_![alt](src)_` image). The frozen seam does NOT represent it (D-Tool-20
  imageBareP requires the <img> to be the sole child; the <em> defeats it, so
  D-Tool-19 paragraphBare captures raw <img> markup => img_para_leftover=1).
  Re-scoped per the Scope Fence into C1b-11a (seam extension) + C1b-11b
  (the migration). ALSO: the canonical slug is NOT ...part-15-the-afghan-arabs
  (that URL 301-redirects); it is the LONG
  a-contemporary-history-of-the-muslim-world-part-15-the-afghan-arabs-foreign-fighters-in-afghanistan.
  See apps/blog/PARTIAL.md and HANDOFF-C1b-11.md. depends on: C1b-10.

- C1b-11a Extend the D-Tool-9 seam (D-Tool-23): a bare `<p>` whose entire
  content is a single `<em>`-wrapped `<img>` (legacy `_![alt](src)_` rendering)
  is promoted to the existing `image` shape. New TOP entry `imageBarePEm`,
  placed after `imageBareP` (D-Tool-20) and before `paragraphBare` (D-Tool-19).
  The sixth narrow extension of the seam freeze. NO slug migrated; feed.json
  unchanged; LOSS_LEDGER untouched. Non-regression: pilot 80; ctn 34
  {image:5,paragraph:24,quote:4,footnotes:1} quote[3] len=240; update 2;
  part-16..22 unchanged. Re-recon part-15 -> {image:13,paragraph:67,embed:1}
  (81), img_para_leftover=0. depends on: C1b-11.
  STATUS: DONE (2026). D-Tool-23 frozen in LOCKED_DECISIONS.txt;
  imageBarePEm TOP entry placed after imageBareP, before paragraphBare (diff
  = +23 pure additions); imageBareP/paragraphBare byte-identical; all
  non-regression targets unchanged; part-15 seam-readiness recon
  {image:13,paragraph:67,embed:1} (81), img_para_leftover=0, 7 wp-caption
  captions, 1 embed verbatim with &#038; preserved. L-005 NOT resolved here.

- C1b-11b Migrate
  `a-contemporary-history-of-the-muslim-world-part-15-the-afghan-arabs-foreign-fighters-in-afghanistan`
  (the LONG canonical slug; date 2018-06-11) from the live HTML (`--from html`)
  into content/en/. Expected census {image:13,paragraph:67,embed:1} (81 blocks);
  1 embed raw `<iframe>` verbatim with `&#038;` preserved (D-Tool-21); all
  `*_para_leftover`=0. Resolves L-005 (recon census: 1 embed). feed.json
  10 -> 11 entries (date-desc). Seam READY (D-Tool-23 frozen in C1b-11a).
  depends on: C1b-11a.
  STATUS: DONE (2026). Migrated part-15 from the live HTML into
  content/en/a-contemporary-history-of-the-muslim-world-part-15-the-afghan-arabs-foreign-fighters-in-afghanistan.json
  (LONG canonical slug). Census {image:13,paragraph:67,embed:1} (81 blocks);
  the 1 embed (idx 76) carries the raw `<iframe ...></iframe>` verbatim with
  `&#038;` preserved (D-Tool-21). 13 images = 7 `figure.wp-caption` (D-Tool-22;
  7 non-empty captions) + 5 bare `<p><img>` (D-Tool-20) + 1 emph-wrapped
  `<p><em><img></em></p>` (D-Tool-23, data-attachment-id 11456). All
  `*_para_leftover`=0. feed.json 10 -> 11 entries (date-desc; part-15 at idx 9,
  after part-16). Resolved L-005. Non-regression: pilot 80; controlling-the-
  narrative 34 {image:5,paragraph:24,quote:4,footnotes:1}, quote[3] len=240;
  update 2 {paragraph:2}; part-16..22 byte-identical to their pre-C1b-11b
  committed files. depends on: C1b-11a.

- C1b-11c Migrate
  `a-contemporary-history-of-the-muslim-world-part-14-yemen-2` (date
  2018-05-11) from the live HTML (`--from html`) into content/en/. Recon
  census {image:9,paragraph:23} (32 blocks); NO embeds and NO emph-wrapped
  images (every class already represented: 1 `figure.wp-caption` D-Tool-22 +
  8 bare `<p><img>` D-Tool-20); all `*_para_leftover`=0; no new seam class.
  feed.json 11 -> 12 entries (date-desc; part-14 at idx 10, after part-15).
  No LOSS_LEDGER row (no loss). depends on: C1b-11b.
  STATUS: DONE (2026). Migrated part-14 from the live HTML into
  content/en/a-contemporary-history-of-the-muslim-world-part-14-yemen-2.json
  (canonical slug; HTTP 200, no redirect). Census {image:9,paragraph:23}
  (32 blocks). 9 images = 1 `figure.wp-caption` (D-Tool-22; 1 non-empty
  caption) + 8 bare `<p><img>` (D-Tool-20). No embeds in source. All
  `*_para_leftover`=0. feed.json 11 -> 12 entries (date-desc; part-14 at
  idx 10, after part-15). No loss discovered (LOSS_LEDGER untouched; L-005
  stays resolved, L-006 stays deferred/seam READY). Non-regression: pilot 80;
  controlling-the-
  narrative 34 {image:5,paragraph:24,quote:4,footnotes:1},
  quote[3] len=240; update 2 {paragraph:2}; part-15..22 byte-identical to
  their pre-C1b-11c committed files. depends on: C1b-11b.

- C1b-11d Migrate
  `protected-a-contemporary-history-of-the-muslim-world-part-13-yemen-1` (date
  2018-04-29) from the live HTML (`--from html`) into content/en/. Recon
  census {image:13,paragraph:37,embed:2} (52 blocks); 2 embeds carry the raw
  `<iframe>` verbatim with `&#038;` preserved (D-Tool-21); 13 images = 12
  bare `<p><img>` (D-Tool-20) + 1 `figure.wp-caption` (D-Tool-22; 1 non-empty
  caption); all `*_para_leftover`=0; no new seam class. NOTE: the slug
  carries a `protected-` prefix (protected WP.com post) — VERIFIED FETCHABLE
  (anonymous HTTP 200, no redirect, entry-content present; no password form).
  feed.json 12 -> 13 entries (date-desc; part-13 at idx 11, after part-14).
  No LOSS_LEDGER row (no loss). depends on: C1b-11c.
  STATUS: DONE (2026). Migrated part-13 from the live HTML into
  content/en/protected-a-contemporary-history-of-the-muslim-world-part-13-
  yemen-1.json (canonical slug; HTTP 200, no redirect). Census
  {image:13,paragraph:37,embed:2} (52 blocks). The 2 embeds carry the raw
  `<iframe ...></iframe>` verbatim with `&#038;` preserved (D-Tool-21).
  13 images = 12 bare `<p><img>` (D-Tool-20) + 1 `figure.wp-caption`
  (D-Tool-22). No emph-wrapped image (D-Tool-23 not exercised). All
  `*_para_leftover`=0. feed.json 12 -> 13 entries (date-desc; part-13 at
  idx 11, after part-14). No loss discovered (LOSS_LEDGER untouched; L-005
  stays resolved, L-006 stays deferred/seam READY). Non-regression: pilot 80;
  controlling-the-
  narrative 34 {image:5,paragraph:24,quote:4,footnotes:1},
  quote[3] len=240; update 2 {paragraph:2}; part-14..22 byte-identical to
  their pre-C1b-11d committed files. depends on: C1b-11c.

- C1b-11e: migrate `a-contemporary-history-of-the-muslim-world-part-12-saudi-
arabia-and-the-arab-cold-war` (posts.json date 2018-04-16). Confirm the
  canonical slug (live HTTP 200, no redirect; no `protected-` prefix —
  verified). Recon measured the census (no count pre-committed). feed.json
  13 -> 14 entries. No seam change expected.
  STATUS: STOPPED (2026). Recon revealed TWO new structural classes the frozen
  seam (D-Tool-9..23) does NOT represent, each making a \*\_para_leftover
  non-zero:
  (A) a bare <p> that BEGINS with a single <img> and CONTINUES with prose
  inside the SAME <p> (D-Tool-20 imageBareP requires the <img> to be
  the sole child; D-Tool-19 paragraphBare then leaves raw <img> markup
  as text) -> img_para_leftover = 1;
  (B) a bare <p> containing prose followed by an inline legacy Jetpack
  embed nested INSIDE the <p> (D-Tool-21 matches the <div> but
  paragraphBare matches the enclosing <p> at an earlier position and
  wins) -> iframe_para_leftover = 1.
  Recon census with the current seam: {paragraph:43,image:11,embed:1} (55),
  NOT seam-READY. Re-scoped per the Scope Fence into C1b-11e-a (seam:
  D-Tool-24 imageBarePTrailing + D-Tool-25 embedInBareP) + C1b-11e-b (the
  migration; expected {image:12,paragraph:43,embed:2} (57)). See
  apps/blog/PARTIAL.md and HANDOFF-C1b-11e.md. depends on: C1b-11d.

- C1b-11e-a Extend the D-Tool-9 seam (D-Tool-24 imageBarePTrailing; D-Tool-25
  embedInBareP): the seventh and eighth narrow extensions. DONE. Bare <p>
  beginning with <img> then prose -> image block + trailing-prose paragraph;
  bare <p> containing prose then an inline legacy Jetpack embed -> paragraph
  - embed (blockFromFragment returns two blocks; loop appends every element).
    Both leading runs use a tempered dot so the match never crosses </p>. NO
    slug migrated; feed.json unchanged (13); LOSS_LEDGER untouched. Seam-READY
    recon of part-12 {image:12,paragraph:43,embed:2} (57), img_para_leftover=0
    AND iframe_para_leftover=0. Non-regression: pilot 80 / ctn 34
    (quote[3] len=240) / update 2 / part-13..22 ALL IDENTICAL. depends on:
    C1b-11e.

- C1b-11e-b Migrate
  `a-contemporary-history-of-the-muslim-world-part-12-saudi-arabia-and-the-arab-cold-war`
  (date 2018-04-16) from the live HTML (`--from html`) into content/en/.
  Expected census {image:12,paragraph:43,embed:2} (57 blocks); 2 embeds raw
  `<iframe>` verbatim with `&#038;` preserved (D-Tool-21); 4 image captions
  (D-Tool-22); all `*_para_leftover`=0. feed.json 13 -> 14 entries
  (date-desc; part-12 after part-13). No LOSS_LEDGER row (no loss). Seam READY
  (D-Tool-24/25 frozen in C1b-11e-a). depends on: C1b-11e-a.

## Now

- 07 App Shell & Toolbars: fixed top/bottom toolbars, drawer,
  language switcher reparented; transport buttons inert. depends on: 06
- 07b Theme toggle (light/dark/auto). depends on: 07
- 07c Font selection (modern/traditional). depends on: 07b
- TTS Text-to-speech (reserved; consumes the inert transport buttons).
  depends on: 07c

## Next (order per depends-on; each authored at the previous chat's close)

- C1b-08..19 (series) remaining EN posts. The seam (through D-Tool-23) covers
  the classes seen so far. C1b-11 STOPPED on a new class (emph-wrapped
  bare-<p><img>) and re-scoped into C1b-11a (seam, D-Tool-23, DONE) + C1b-11b
  (migration, DONE). C1b-11c migrated part-14 (DONE); C1b-11d migrated part-13
  (DONE; `protected-` post verified fetchable); C1b-11e STOPPED on TWO new
  classes and re-scoped into C1b-11e-a (seam, D-Tool-24 + D-Tool-25, DONE) +
  C1b-11e-b (migration) — the next milestone is C1b-11e-b (migrate part-12).
  C1b-DONE proves 20/20, then posts.json deletion is unblocked.
- B1 Renderer remaining block types (pullquote, resourceList, callout,
  footnotes, attachment). depends on: 09
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
- The D-Tool-9 extraction seam is frozen. Six narrow extensions exist so far
  (D-Tool-18 quote-cite; D-Tool-19 bare-<p>; D-Tool-20 bare-<p><img>; D-Tool-21
  legacy Jetpack embed; D-Tool-22 legacy figure.wp-caption image; D-Tool-23
  emph-wrapped bare-<p><img>). Any additional extension is its own milestone
  with its own LOCKED_DECISIONS entry.
