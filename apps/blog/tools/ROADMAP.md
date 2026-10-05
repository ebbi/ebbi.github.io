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
  STATUS: DONE (2026). Migrated part-12 from the live HTML into
  content/en/a-contemporary-history-of-the-muslim-world-part-12-saudi-arabia-
  and-the-arab-cold-war.json (canonical slug; HTTP 200, no redirect; no
  `protected-` prefix). Census {image:12,paragraph:43,embed:2} (57 blocks).
  The 2 embeds (idx 13 standalone D-Tool-21; idx 40 embedInBareP D-Tool-25)
  carry the raw `<iframe ...></iframe>` verbatim with `&#038;` preserved.
  12 images = 7 bare `<p><img>` (D-Tool-20) + 4 `figure.wp-caption` (D-Tool-22;
  4 non-empty captions) + 1 imageBarePTrailing (D-Tool-24; the opener, idx 0).
  All `*_para_leftover`=0. feed.json 13 -> 14 entries (date-desc; part-12 at
  idx 12, after part-13). No loss discovered (LOSS_LEDGER untouched; L-005
  stays resolved, L-006 stays deferred/seam READY). Non-regression: pilot 80;
  controlling-the-narrative 34 {image:5,paragraph:24,quote:4,footnotes:1},
  quote[3] len=240; update 2 {paragraph:2}; part-13..22 byte-identical to
  their pre-C1b-11e-b committed files. depends on: C1b-11e-a.

- C1b-11f: migrate `a-contemporary-history-of-the-muslim-world-11-afghanistan-3`
  (date 2017-02-08T11:18:07+00:00). NOTE the slug shape: NO `part-` token
  (the series number is `...muslim-world-11-...`). Plain migration; seam
  through D-Tool-25 covers every class seen (6 bare `<p><img>` D-Tool-20 + 3
  `figure.wp-caption` D-Tool-22 + 7 legacy Jetpack embeds D-Tool-21). feed.json
  14 -> 15 entries. No loss; LOSS_LEDGER untouched; L-006 stays deferred.
  depends on: C1b-11e-b.
  STATUS: DONE (2026). Migrated part-11 from the live HTML (`--from html`)
  into content/en/a-contemporary-history-of-the-muslim-world-11-afghanistan-3.json
  (canonical slug; HTTP 200, no redirect; no `protected-` prefix). Census
  {image:9,paragraph:36,embed:7} (52 blocks). The 7 embeds carry the raw
  `<iframe ...></iframe>` verbatim with `&#038;` preserved (D-Tool-21). 9 images
  = 6 bare `<p><img>` (D-Tool-20) + 3 `figure.wp-caption` (D-Tool-22; 3
  non-empty captions). All `*_para_leftover`=0. feed.json 14 -> 15 entries
  (date-desc; part-11 at idx 14, LAST — its date 2017-02-08 is OLDER than
  `update` 2017-11-01, so date-desc places it after `update`, NOT before; the
  milestone prose's "idx 13, before update" was a date-arithmetic slip).
  No loss discovered (LOSS_LEDGER untouched; L-006 stays deferred/seam READY).
  Non-regression: pilot 80; controlling-the-narrative 34
  {image:5,paragraph:24,quote:4,footnotes:1}, quote[3] len=240; update 2
  {paragraph:2}; part-12..22 byte-identical to their pre-C1b-11f committed
  files. depends on: C1b-11e-b.

- C1b-11g Migrate
  `a-contemporary-history-of-the-muslim-world-part-10-afghanistan-pakistan-2`
  (date 2017-01-06T20:57:50+00:00) from the live HTML (`--from html`) into
  content/en/. Recon census {image:18,paragraph:40,embed:1} (59 blocks);
  the 1 embed carries the raw `<iframe>` verbatim with `&#038;` preserved
  (D-Tool-21); 18 images = 13 bare `<p><img>` (D-Tool-20) + 5
  `figure.wp-caption` (D-Tool-22; 5 captions); all `*_para_leftover`=0; no
  new seam class. feed.json 15 -> 16 entries (date-desc; part-10 at idx 14,
  after part-11, before `...-contents`). No LOSS_LEDGER row (no loss).
  depends on: C1b-11f.
  STATUS: DONE (2026). Migrated part-10 from the live HTML (`--from html`)
  into content/en/a-contemporary-history-of-the-muslim-world-part-10-afghanistan-pakistan-2.json
  (canonical slug; HTTP 200, no redirect; no `protected-` prefix). Census
  {image:18,paragraph:40,embed:1} (59 blocks). The 1 embed (standalone
  D-Tool-21) carries the raw `<iframe ...></iframe>` verbatim with `&#038;`
  preserved. 18 images = 13 bare `<p><img>` (D-Tool-20) + 5
  `figure.wp-caption` (D-Tool-22; 5 non-empty captions). No emph-wrapped
  image (D-Tool-23), no imageBarePTrailing (D-Tool-24), no embedInBareP
  (D-Tool-25) in this post. All `*_para_leftover`=0. feed.json 15 -> 16
  entries; date-desc puts part-10 at idx 15 (LAST; its date 2017-01-06 is
  OLDER than part-11's 2017-02-08, so it sorts AFTER part-11; the milestone
  prose's "idx 14, before `...-contents`" was a date-arithmetic slip — there
  is no `...-contents` feed entry). No loss discovered (LOSS_LEDGER
  untouched; L-006 stays deferred/seam READY). Non-regression: pilot 80;
  controlling-the-narrative 34 {image:5,paragraph:24,quote:4,footnotes:1},
  quote[3] len=240; update 2 {paragraph:2}; part-11..22 byte-identical to
  their pre-C1b-11g committed files. depends on: C1b-11f.

- C1b-11h Migrate
  `a-contemporary-history-of-the-muslim-world-part-9-pakistan-1979`
  (posts.json date 2016-12-25T23:31:45+00:00) from the live HTML (`--from
html`) into content/en/. Census MEASURED at recon (not pre-committed);
  confirm slug/title/date against the live post (series slugs have shown
  discrepancies). Every class seen so far is covered by the seam through
  D-Tool-25. feed.json 16 -> 17 entries (date-desc; part-9's date 2016-12-25
  is OLDER than part-10's 2017-01-06, so part-9 sorts AFTER part-10).
  No LOSS_LEDGER row (no loss expected); L-006 stays deferred. depends on:
  C1b-11g.
  STATUS: STOPPED (2026). Slug/title/date CONFIRMED against the live post
  (HTTP 200, no redirect, no `protected-` prefix, entry-content present;
  slug = a-contemporary-history-of-the-muslim-world-part-9-pakistan-1979,
  matching posts.json). Recon census with the seam through D-Tool-25:
  {image:13,paragraph:28,embed:1} (42 blocks) — but a SILENT loss: the raw
  body has 14 <img> and only 13 render. The 14th (`270px-miqbal4.jpg`,
  data-attachment-id 9237) is wrapped in a CLASS-LESS bare
  `<div><img .../></div>`, which matched NO frozen TOP entry, so the loop's
  skip-and-advance logic DROPPED it tag-by-tag (the L-009/L-011 defect
  shape). This loss is SILENT to `*_para_leftover` (the markup is dropped,
  not leaked into a paragraph), so only the raw-<img>-count reconciliation
  exposes it. NEW structural class `divBareImg`. Confined to part-9 (0
  occurrences in all 20 other cached sources — no shipped slug affected).
  Re-scoped per the Scope Fence into C1b-11h-a (seam: D-Tool-26 divBareImg)
  - C1b-11h-b (the migration; expected {image:14,paragraph:28,embed:1} (43),
    resolves L-012). See apps/blog/PARTIAL.md and HANDOFF-C1b-11h.md.
    depends on: C1b-11g.

- C1b-11h-a Extend the D-Tool-9 seam (D-Tool-26 divBareImg): the NINTH narrow
  extension. A CLASS-LESS bare `<div>` whose sole child is an `<img>` is
  promoted to the existing `image` shape (regex
  `/<div\b(?![^>]*\bclass=)[^>]*>\s*<img\b[^>]*\/?>\s*<\/div>/i`, placed after
  wpCaptionFig and before table; blockFromFragment handled identically to
  imageBareP). NO slug migrated; feed.json unchanged (16); import-post.js
  changed (seam); the L-012 row authored in LOSS_LEDGER.md. Seam-READY recon
  of part-9 {image:14,paragraph:28,embed:1} (43), img_para_leftover=0.
  Non-regression: pilot 80 / ctn 34 (quote[3] len=240) / update 2 /
  part-10..22 ALL IDENTICAL. depends on: C1b-11h.
  STATUS: DONE (2026). D-Tool-26 frozen in LOCKED_DECISIONS.txt; the
  divBareImg TOP entry placed AFTER wpCaptionFig (D-Tool-22) and BEFORE the
  table entry (diff = +31 pure additions); all five `<p>`-keyed regexes
  (imageBareP/imageBarePEm/imageBarePTrailing/embedInBareP/paragraphBare)
  BYTE-IDENTICAL; blockFromFragment's new branch emits
  { type:"image", src, caption:"" } (null if no src). Seam-READY re-recon of
  part-9 {image:14,paragraph:28,embed:1} (43 blocks), all `*_para_leftover`=0;
  the recovered 14th image is `270px-miqbal4.jpg` (src verbatim, entities
  preserved); 1 embed raw `<iframe>` verbatim with `&#038;` preserved
  (D-Tool-21). L-012 authored (resolved by C1b-11h-b). Non-regression: pilot

  80 / ctn 34 (quote[3] len=240) / update 2 / part-10..22 ALL IDENTICAL.

- C1b-11h-b Migrate
  `a-contemporary-history-of-the-muslim-world-part-9-pakistan-1979`
  (date 2016-12-25T23:31:45+00:00) from the live HTML (`--from html`) into
  content/en/. Expected census {image:14,paragraph:28,embed:1} (43 blocks);
  1 embed raw `<iframe>` verbatim with `&#038;` preserved (D-Tool-21); 5 image
  captions (D-Tool-22); 1 divBareImg (D-Tool-26; `270px-miqbal4.jpg`); all
  `*_para_leftover`=0. feed.json 16 -> 17 entries (date-desc; part-9's date
  2016-12-25 is OLDER than part-10's 2017-01-06, so part-9 sorts AFTER
  part-10 — likely LAST). Resolves L-012. Seam READY (D-Tool-26 frozen in
  C1b-11h-a). depends on: C1b-11h-a.
  STATUS: DONE (2026). Migrated part-9 from the live HTML (`--from html`)
  into content/en/a-contemporary-history-of-the-muslim-world-part-9-pakistan-1979.json
  (canonical slug; HTTP 200, no redirect, no `protected-` prefix). Census
  {image:14,paragraph:28,embed:1} (43 blocks). CRITICAL reconciliation: raw
  `<img>` count (14) == rendered image count (14) — no silent drop (the
  L-012 defect is closed). The 14 images = 8 bare `<p><img>` (D-Tool-20) +
  5 `figure.wp-caption` (D-Tool-22; 5 non-empty captions) + 1 divBareImg
  (D-Tool-26; the recovered `270px-miqbal4.jpg`, data-attachment-id 9237,
  src verbatim). The 1 embed carries the raw `<iframe ...></iframe>` verbatim
  with `&#038;` preserved (D-Tool-21). All `*_para_leftover`=0. feed.json
  16 -> 17 entries (date-desc; part-9 at idx 16, LAST — its date 2016-12-25
  is OLDER than part-10's 2017-01-06, so it sorts AFTER part-10). Resolved
  L-012. No new seam class; import-post.js untouched. Non-regression:
  pilot 80; controlling-the-narrative 34 {image:5,paragraph:24,quote:4,
  footnotes:1}, quote[3] len=240; update 2 {paragraph:2}; part-10..22
  byte-identical to their pre-C1b-11h-b committed files. depends on:
  C1b-11h-a.

- C1b-11i Migrate
  `a-contemporary-history-of-the-muslim-world-part-8-afghanistan-1`
  (posts.json date 2016-08-02T00:41:55+00:00) from the live HTML (`--from
html`) into content/en/. Census MEASURED at recon (NOT pre-committed —
  L-006 recorded the embed count as "(count TBD at recon)"). Resolves the
  deferred ledger row L-006 (part-8's legacy Jetpack embed; D-Tool-21
  already frozen, seam READY). Confirm slug/title/date against the live post
  AND posts.json. feed.json 17 -> 18 entries (date-desc; part-8's date
  2016-08-02 is OLDER than part-9's 2016-12-25, so part-8 sorts AFTER
  part-9). No new seam class expected. depends on: C1b-11h-b.
  STATUS: DONE (2026). Migrated part-8 from the live HTML (`--from html`)
  into content/en/a-contemporary-history-of-the-muslim-world-part-8-afghanistan-1.json
  (canonical slug; HTTP 200, no redirect, no `protected-` prefix; slug/title/
  date match posts.json). Census {paragraph:40,image:14,embed:3} (57 blocks).
  CRITICAL reconciliation: raw `<img>` count (14) == rendered image count (14)
  — no silent drop. The 14 images = 11 bare `<p><img>` (D-Tool-20) + 3
  `figure.wp-caption` (D-Tool-22; 3 non-empty captions). The 3 embeds carry the
  raw `<iframe ...></iframe>` verbatim with `&#038;` preserved (D-Tool-21);
  posts.json advertised 2 (undercount). All `*_para_leftover`=0. feed.json
  17 -> 18 entries (date-desc; part-8 at idx 17, LAST). Resolved L-006. No new
  seam class; import-post.js untouched. Non-regression: pilot 80;
  controlling-the-narrative 34 {image:5,paragraph:24,quote:4,footnotes:1},
  quote[3] len=240; update 2 {paragraph:2}; part-9..22 byte-identical to their
  pre-C1b-11i committed files. depends on: C1b-11h-b.

- C1b-11j Migrate
  `a-contemporary-history-of-the-muslim-world-part-7-the-lebanese-civil-war-3`
  (posts.json date 2016-06-20T21:24:41+00:00) from the live HTML (`--from
html`) into content/en/. Census MEASURED at recon (NOT pre-committed).
  Confirm slug/title/date against the live post AND posts.json. feed.json
  18 -> 19 entries (date-desc; part-7's date 2016-06-20 is OLDER than
  part-8's 2016-08-02, so part-7 sorts AFTER part-8, LAST). No new seam class
  expected (seam frozen through D-Tool-26). depends on: C1b-11i.
  STATUS: DONE (2026). Migrated part-7 from the live HTML (`--from html`)
  into content/en/a-contemporary-history-of-the-muslim-world-part-7-the-lebanese-civil-war-3.json
  (canonical slug; HTTP 200, no redirect, no `protected-` prefix, entry-content
  present; slug/title/date match posts.json — NO discrepancy). Census
  {image:11,paragraph:32,embed:3} (46 blocks). CRITICAL reconciliation: raw
  `<img>` count (11) == rendered image count (11) — no silent drop; raw
  `<iframe>` count (3) == rendered embed count (3). The 11 images = 9
  `div.wp-block-image` (D-Tool-9 imageWrap) + 2 `figure.wp-block-image`
  (imageFig); 9 carry captions (the 2 without — `amal.jpg` idx 0 and
  `vlcsnap-…02h44m15s198.png` idx 24 — are wp-block-image with no
  figcaption). No bare `<p><img>` (D-Tool-20), no `figure.wp-caption`
  (D-Tool-22), no emph-wrapped image (D-Tool-23), no imageBarePTrailing
  (D-Tool-24), no embedInBareP (D-Tool-25), no divBareImg (D-Tool-26). The 3
  embeds carry the raw `<iframe ...></iframe>` verbatim with `&#038;`
  preserved (D-Tool-21); posts.json advertised 0 (front-truncated; live has 3).
  All `*_para_leftover`=0. feed.json 18 -> 19 entries (date-desc; part-7 at
  idx 18, LAST — its date 2016-06-20 is OLDER than part-8's 2016-08-02).
  No loss discovered (LOSS_LEDGER untouched; L-006 stays resolved, L-012
  stays resolved, L-010 stays deferred). Non-regression: pilot 80
  {image:15,paragraph:62,quote:2,table:1}; controlling-the-narrative 34
  {image:5,paragraph:24,quote:4,footnotes:1}, quote[3] len=240; update 2
  {paragraph:2}; part-8..22 byte-identical to their pre-C1b-11j committed
  files. No new seam class; import-post.js untouched. depends on: C1b-11i.

- C1b-11k Migrate the LAST unmigrated EN post in the
  `a-contemporary-history-...` series: the series post
  `a-contemporary-history-of-the-muslim-world-contents` (a SEPARATE slug,
  posts.json date 2017-01-20T13:22:50+00:00). Confirm slug/title/date against
  the live post AND posts.json. Census MEASURED at recon. feed.json 19 -> 20
  entries (date-desc). No new seam class expected (seam frozen through
  D-Tool-26). depends on: C1b-11j.
  STATUS: STOPPED (2026). Slug/title/date CONFIRMED against the live post
  (HTTP 200, no redirect, no `protected-` prefix, entry-content present;
  slug = a-contemporary-history-of-the-muslim-world-contents, matching
  posts.json — NO discrepancy). Recon census with the seam through D-Tool-26:
  {paragraph:16} (16 blocks) — NOT seam-READY: img_para_leftover = 13 and a
  MASSIVE silent image loss (0 image blocks rendered vs 24 raw `<img>` in
  entry-content). The post body is a legacy WP.com CLASS-LESS bare
  `<table width="916">` layout grid (colgroup/tbody/12 tr/48 td; 23 of the
  24 `<img>` live inside `<td>` cells). The frozen seam has only a
  `<figure class="wp-block-table">` rule, which does NOT match a bare
  top-level `<table>`; the loop's skip-and-advance logic stepped past
  `<table>`/`<td>` tag-by-tag, leaking the `<td>`-nested `<p><img>` markup
  into paragraph text (L-009 defect shape; 13 occurrences) AND dropping every
  `<img>` not wrapped in a `<p>` (silent loss — invisible to
  `*_para_leftover`; only the raw-`<img>` (24) vs rendered-image (0)
  reconciliation exposes it). NEW structural class `tableBare`. Confined to
  this post (1 cache, plus the same post's 2nd cache; the pilot's bare
  `<table>` is inside `<figure class="wp-block-table">` so it is NOT affected
  — no shipped slug at risk). Re-scoped per the Scope Fence into C1b-11k-a
  (seam: D-Tool-27 tableBare) + C1b-11k-b (the migration; resolves L-013).
  See apps/blog/PARTIAL.md and HANDOFF-C1b-11k.md. depends on: C1b-11j.

- C1b-11k-a Extend the D-Tool-9 seam (D-Tool-27 tableBare): the TENTH narrow
  extension. A CLASS-LESS bare top-level `<table>` (no class attribute) is
  promoted to the EXISTING `table` shape ({ type:"table", content:<inner HTML
  of <table>> }; renderer does table.innerHTML = block.content). Regex
  `/<table\b(?![^>]*\bclass=)[^>]*>[\s\S]*?<\/table>/i`, placed adjacent to
  the existing figure.wp-block-table entry; blockFromFragment handled
  identically to the existing `table` kind. NO slug migrated; feed.json
  unchanged (19); import-post.js changed (seam); the L-013 row authored in
  LOSS_LEDGER.md. Seam-READY recon of the contents post: {table:1,
  paragraph:N} with all `*_para_leftover` = 0 and the 24 raw `<img>` subsumed
  by the single table block. Non-regression: pilot 80
  {image:15,paragraph:62,quote:2,table:1} / ctn 34 (quote[3] len=240) /
  update 2 / part-7..22 ALL IDENTICAL. depends on: C1b-11k.
  STATUS: STOPPED (2026). Pre-flight passed (clean; INTEGRITY OK;
  LOCKED_DECISIONS_SHA256=6d8ccb50…). The D-Tool-27 tableBare change was
  implemented and verified to be non-regressing (pilot 80 / ctn 34
  quote[3] len=240 / update 2 / all 19 committed content files re-extract
  BYTE-IDENTICAL), and it correctly promoted the post's bare `<table>` grid to
  a single `table` block. BUT the post was NOT seam-READY: a SECOND new
  structural class remained — a bare `<p>` whose ENTIRE content is a single
  `<strong>`-wrapped `<img>` (`<p style="text-align:justify"><strong><img
.../></strong></p>`, the recovered `afghans1.png`, data-attachment-id
  10954, sitting AFTER the `</table>`). D-Tool-23 imageBarePEm keys on `<em>`,
  NOT `<strong>`, so paragraphBare captured the fragment and left raw `<img>`
  markup as text → `img_para_leftover = 1` (NOT 0). Re-con of the contents
  post with tableBare applied: {paragraph:3,table:1} (4 blocks),
  img_para_leftover=1, raw `<img>`=24. NEW structural class
  `imageBarePStrong`. Confined to this post (2 cache copies; no shipped slug
  affected). Per the Scope Fence, C1b-11k-a REVERTED its import-post.js
  change (tree clean) and re-scoped into C1b-11k-a-a (seam: D-Tool-27
  tableBare + D-Tool-28 imageBarePStrong) + C1b-11k-a-b (the migration;
  resolves L-013). See apps/blog/PARTIAL.md and HANDOFF-C1b-11k-a.md.

- C1b-11k-a-a Extend the D-Tool-9 seam (D-Tool-27 tableBare; D-Tool-28
  imageBarePStrong): the TENTH and ELEVENTH narrow extensions. tableBare:
  a CLASS-LESS bare top-level `<table>` (no class attribute) promoted to the
  EXISTING `table` shape; regex
  `/<table\b(?![^>]*\bclass=)[^>]*>[\s\S]*?<\/table>/i`, placed adjacent to
  the figure.wp-block-table entry. imageBarePStrong: a bare `<p>` whose ENTIRE
  content is a single `<strong>`-wrapped `<img>` promoted to the EXISTING
  `image` shape; regex
  `/<p\b(?![^>]*\bclass="[^"]*\bwp-block-)[^>]*>\s*<strong>\s*<img\b[^>]*\/?>\s*<\/strong>\s*<\/p>/i`,
  placed AFTER imageBarePEm (D-Tool-23) and BEFORE paragraphBare (D-Tool-19);
  handled identically to imageBareP. NO slug migrated; feed.json unchanged
  (19); import-post.js changed (seam); the L-013 row authored in
  LOSS_LEDGER.md. Seam-READY recon of the contents post: {table:1,
  paragraph:N} with all `*_para_leftover` = 0 and the 24 raw `<img>`
  accounted for (23 subsumed by the single table block + 1 imageBarePStrong).
  Non-regression: pilot 80 {image:15,paragraph:62,quote:2,table:1} / ctn 34
  (quote[3] len=240) / update 2 / part-7..22 ALL IDENTICAL. depends on:
  C1b-11k-a.
  STATUS: DONE (2026). D-Tool-27 (tableBare) + D-Tool-28 (imageBarePStrong)
  frozen in LOCKED_DECISIONS.txt; the tableBare TOP entry placed AFTER
  divBareImg and ADJACENT to the figure.wp-block-table entry, the
  imageBarePStrong TOP entry placed AFTER imageBarePEm (D-Tool-23) and BEFORE
  paragraphBare (D-Tool-19) (diff = +56 pure additions); blockFromFragment's
  two new branches emit { type:"table", content } (identical to the existing
  `table` kind) and { type:"image", src, caption:"" } (identical to
  imageBareP); the figure.wp-block-table rule and every <p>-keyed regex
  BYTE-IDENTICAL. Seam-READY re-recon of the contents post
  {table:1,image:1,paragraph:2} (4 blocks), all `*_para_leftover`=0; the
  single table block carries the inner HTML of the <table> (len 29665,
  links+images verbatim) subsuming 23 raw <img>, the imageBarePStrong block
  is the recovered afghans1.png (data-attachment-id 10954); the 2 paragraph
  blocks are the post's EMPTY `<p> </p>` spacers. CRITICAL: the pilot's bare
  <table> is inside <figure class="wp-block-table"> so tableBare does NOT
  fire for it (pilot census unchanged). L-013 authored (resolved by
  C1b-11k-a-b). Non-regression: pilot 80 {image:15,paragraph:62,quote:2,table:1};
  ctn 34 {image:5,paragraph:24,quote:4,footnotes:1}, quote[3] len=240;
  update 2 {paragraph:2}; part-7..22 — ALL 19 committed content/en/*.json
  re-extract BYTE-IDENTICAL.

- C1b-11k-a-b Migrate
  `a-contemporary-history-of-the-muslim-world-contents`
  (date 2017-01-20T13:22:50+00:00) from the live HTML (`--from html`) into
  content/en/. Census MEASURED at recon; the single `table` block carries the
  inner HTML of the source `<table>` verbatim; the recovered `afghans1.png`
  is a separate D-Tool-28 `image` block; all `*_para_leftover` = 0; the 24
  raw `<img>` accounted for (none leaked, none dropped). feed.json 19 -> 20
  entries (date-desc; the post's date 2017-01-20 sits between part-10's
  2017-01-06 and part-11's 2017-02-08, so it sorts AFTER part-11 (idx 14) and
  BEFORE part-10 (idx 15)). Resolves L-013. Seam READY (D-Tool-27 + D-Tool-28
  frozen in C1b-11k-a-a). After it, C1b-DONE proves 20/20.
  depends on: C1b-11k-a-a.
  STATUS: DONE (2026). Migrated the series contents post from the live HTML
  (`--from html`) into
  content/en/a-contemporary-history-of-the-muslim-world-contents.json
  (canonical slug; HTTP 200, no redirect, no `protected-` prefix, entry-content
  present; slug/title/date match posts.json — NO discrepancy). Recon MEASURED
  the census: written census {table:1,image:1,paragraph:2} (4 blocks).
  CRITICAL reconciliation: raw `<img>` count (24) EQUALS the rendered image
  total (23 subsumed by the single `table` block + 1 `image` block) — no
  silent drop; raw `<iframe>` (0) == rendered embed (0). All
  `*_para_leftover`=0. The single `table` block carries the inner HTML of the
  source `<table>` VERBATIM (colgroup/tbody/12 `<tr>`/48 `<td>`, links+images
  preserved; outer tag dropped per D-Tool-15; len 29665); the 1 `image` block
  is the recovered D-Tool-28 imageBarePStrong `afghans1.png` (data-attachment-id
  10954, src verbatim); the 2 `paragraph` blocks are the post's EMPTY `<p> </p>`
  spacers. feed.json 19 -> 20 entries (date-desc; the post at idx 15,
  POSITIONALLY after part-11 idx 14 and before part-10 idx 16 — verified).
  Resolved L-013. No new seam class; import-post.js untouched. Non-regression:
  pilot 80 {image:15,paragraph:62,quote:2,table:1}; controlling-the-narrative
  34 {image:5,paragraph:24,quote:4,footnotes:1}, quote[3] len=240; update 2
  {paragraph:2}; part-7..22 byte-identical to their committed files. NOTE
  (CORRECTED by L-014): the claim "ALL series EN posts now migrated; C1b-DONE
  proves 20/20" was WRONG. The C1b chain began at part-7 (C1b-08) and walked
  FORWARD; the six EARLIEST series posts (parts 1–6, 2015-11-27 .. 2016-06-04)
  were never assigned a milestone. The series total is 23 posts (parts 1–22 +
  "Jews in Palestine before Israel"); +2 non-series (`update`,
  `controlling-the-narrative`) = 25 EN files. See L-014; migrations C1b-12..17;
  the REVISED C1b-DONE proves 25/25. depends on: C1b-11k-a-a.

- C1b-12 Migrate SERIES PART 1 (`2015/11/27/what-we-have-forgotten-and-they-
havent-a-history-of-political-islam-and-the-west`, date 2015-11-27) from the
  live HTML (`--from html`) into content/en/. FIRST of the six EARLIEST series
  posts (parts 1–6) missed by the original chain (L-014); the new migration
  track begins here, ascending. SLUG NOTE: parts 1–4 carry legacy NON-UNIFORM
  slugs (NOT the `...muslim-world-part-N-...` pattern); KEEP the live canonical
  slug (faithful; no 404s). Confirm slug/title/date from the live post AND (if
  present) posts.json. Census MEASURED at recon (the earliest posts are the
  richest in legacy markup — recon may reveal a NEW seam class; if so, STOP and
  re-scope per the Scope Fence). feed.json 20 -> 21 entries (date-desc). No
  new seam class expected a priori (seam frozen through D-Tool-28).
  depends on: C1b-11k-a-b.
  STATUS: DONE (2026). Migrated part-1 from the live HTML (`--from html`) into
  content/en/what-we-have-forgotten-and-they-havent-a-history-of-political-
  islam-and-the-west.json (LEGACY NON-UNIFORM canonical slug; HTTP 200, no
  redirect, no `protected-` prefix, entry-content present; slug/title/date
  confirmed from the LIVE post — posts.json is front-truncated and part-1 is
  ABSENT from it, as L-014 warned). Title "A contemporary history of the
  Muslim world, part 1"; date 2015-11-27T12:51:51+00:00. Recon MEASURED the
  census (NOT pre-committed): written census {image:11,paragraph:50} (61
  blocks). CRITICAL reconciliation: raw `<img>` count (11) EQUALS the rendered
  image-block count (11) — no silent drop; raw `<iframe>` (0) == rendered embed
  (0); raw `<figure>` 1 == the single wp-caption image. All `*_para_leftover`=0
  (img/iframe/figure/wp-caption/jetpack). The 11 images = 10 bare `<p><img>`
  (D-Tool-20) + 1 `figure.wp-caption` (D-Tool-22; caption "Oil gusher spouting
  near Kirkuk, c.1932", the Baba Gurgur image). No emph-wrapped image (D-Tool-23),
  no imageBarePStrong (D-Tool-28), no imageBarePTrailing (D-Tool-24), no
  embedInBareP (D-Tool-25), no divBareImg (D-Tool-26), no tableBare (D-Tool-27),
  no quote/footnotes. NO new seam class; import-post.js untouched (seam frozen
  through D-Tool-28). feed.json 20 -> 21 entries (date-desc; part-1 at idx 20,
  LAST — its date 2015-11-27 is OLDER than part-7's 2016-06-20, verified
  POSITIONALLY). No loss discovered (LOSS_LEDGER untouched; L-014 stays OPEN —
  it tracks all six parts, closed at C1b-17). Non-regression: pilot 80
  {image:15,paragraph:62,quote:2,table:1}; controlling-the-narrative 34
  {image:5,paragraph:24,quote:4,footnotes:1}, quote[3] len=240; update 2
  {paragraph:2}; the contents post {table:1,image:1,paragraph:2}; part-7..22 —
  ALL 20 pre-existing committed content/en/\*.json re-extract BYTE-IDENTICAL.
  depends on: C1b-11k-a-b.
- C1b-13 Migrate SERIES PART 2
  (`2015/12/13/what-we-have-forgotten-and-they-havent-a-history-of-political-
islam-and-the-west-part-2`, date 2015-12-13) from the live HTML
  (`--from html`) into content/en/. Legacy non-uniform slug; KEEP the live
  canonical slug. Census MEASURED at recon. feed.json 21 -> 22 entries
  (date-desc). No new seam class expected. depends on: C1b-12.
  STATUS: STOPPED (2026). Slug/title/date CONFIRMED against the live post
  (HTTP 200, no redirect, no `protected-` prefix, entry-content present; slug
  = what-we-have-forgotten-and-they-havent-a-history-of-political-islam-and-
  the-west-part-2; title "A contemporary history of the Muslim world, part 2";
  date 2015-12-13T17:56:44+00:00). Recon census with the seam through
  D-Tool-28: {image:20,paragraph:53,embed:2} (75 blocks) — but BOTH a leak
  AND a silent loss: raw `<img>` 21 vs rendered 20 (one image SILENTLY
  dropped) AND img_para_leftover = 1. The SAME unmodeled class produces both
  symptoms: a bare `<p>` whose content is PROSE followed by a single trailing
  `<img>` at the END of the same `<p>` (prose-then-trailing-image; the MIRROR
  of D-Tool-24 imageBarePTrailing). D-Tool-19 paragraphBare captured the whole
  `<p>`, leaking the inline `<img>` markup into paragraph text (img_para_leftover
  = 1) AND dropping the image entirely (silent to `*_para_leftover`; only the
  raw-`<img>` reconciliation exposes it). NEW structural class
  `imageBarePProse`. Confined to part-2 (1 cache; no shipped slug affected —
  the 21 committed content/en/\*.json all re-extract byte-identical). Re-scoped
  per the Scope Fence into C1b-13a (seam: D-Tool-29 imageBarePProse) +
  C1b-13b (the migration). See apps/blog/HANDOFF-C1b-13a.md.
  depends on: C1b-12.

- C1b-13a Extend the D-Tool-9 seam (D-Tool-29 imageBarePProse): the TWELFTH
  narrow extension. A bare `<p>` (class absent or lacking "wp-block-") whose
  content is PROSE followed by a single trailing `<img>` at the END of the
  same `<p>` is handled by returning UP TO TWO blocks IN SOURCE ORDER: the
  leading prose as a paragraph (raw inner HTML up to but not including the
  trailing <img>, trimmed — the SAME semantics as paragraphBare) AND the
  trailing <img> as the EXISTING image shape. Regex
  `/<p\b(?![^>]*\bclass="[^"]*\bwp-block-)[^>]*>(?:(?!<\/p>)[\s\S])*?<img\b[^>]*\/?>\s*<\/p>/i`,
  placed AFTER imageBarePTrailing (D-Tool-24) and BEFORE embedInBareP
  (D-Tool-25); leading run is a TEMPERED dot so the match never crosses `</p>`.
  NO slug migrated; feed.json unchanged (21); import-post.js changed (seam).
  Seam-READY recon of part-2 {image:21,paragraph:53,embed:2} (76), all
  `*_para_leftover`=0; recovered image assad21.jpg (data-attachment-id 1739).
  Non-regression: pilot 80 {image:15,paragraph:62,quote:2,table:1} / ctn 34
  {image:5,paragraph:24,quote:4,footnotes:1} quote[3] len=240 / update 2 /
  contents {table:1,image:1,paragraph:2} / part-1 {image:11,paragraph:50} /
  part-7..22 ALL IDENTICAL (21/21 byte-identical). depends on: C1b-13.
  STATUS: DONE (2026). D-Tool-29 frozen in LOCKED_DECISIONS.txt (the TWELFTH
  deliberate, narrow extension of the D-Tool-9 seam freeze); the
  imageBarePProse TOP entry placed AFTER imageBarePTrailing / BEFORE
  embedInBareP and the blockFromFragment branch placed AFTER imageBarePTrailing
  / BEFORE embedInBareP (diff = +57 pure additions, 0 deletions);
  imageBareP/imageBarePEm/imageBarePStrong/imageBarePTrailing/embedInBareP/
  paragraphBare regexes BYTE-IDENTICAL. Seam-READY re-recon of part-2
  {image:21,paragraph:53,embed:2} (76 blocks), all `*_para_leftover`=0; the
  recovered 21st image is assad21.jpg (data-attachment-id 1739, src verbatim,
  entities preserved); the 2 embeds carry the raw <iframe> verbatim with
  &#038; preserved (D-Tool-21). Non-regression: pilot 80 / ctn 34
  (quote[3] len=240) / update 2 / contents / part-1 / part-7..22 — ALL 21
  committed content/en/\*.json re-extract BYTE-IDENTICAL.

- C1b-13b Migrate SERIES PART 2
  (`2015/12/13/what-we-have-forgotten-and-they-havent-a-history-of-political-
islam-and-the-west-part-2`, date 2015-12-13) from the live HTML (`--from
html`) into content/en/. Expected census {image:21,paragraph:53,embed:2} (76
  blocks); all `*_para_leftover`=0; raw `<img>` 21 == rendered 21, raw
  `<iframe>` 2 == rendered 2. feed.json 21 -> 22 entries (date-desc; part-2's
  2015-12-13 is OLDER than every existing entry except part-1, so it sorts
  SECOND-TO-LAST, just above part-1). Seam READY (D-Tool-29 frozen in
  C1b-13a). depends on: C1b-13a.
  STATUS: DONE (2026). Migrated part-2 from the live HTML (`--from html`) into
  content/en/what-we-have-forgotten-and-they-havent-a-history-of-political-
  islam-and-the-west-part-2.json (LEGACY NON-UNIFORM canonical slug; HTTP 200,
  no redirect, no `protected-` prefix, entry-content present; slug/title/date
  confirmed from the LIVE post — posts.json is front-truncated and part-2 is
  ABSENT from it, as L-014 warned). Title "A contemporary history of the Muslim
  world, part 2"; date 2015-12-13T17:56:44+00:00. Written census
  {image:21,paragraph:53,embed:2} (76 blocks). CRITICAL reconciliation: raw
  `<img>` count (21) EQUALS the rendered image-block count (21) — no silent
  drop (the D-Tool-29 defect is closed); raw `<iframe>` (2) == rendered embed
  (2); raw `<figure.wp-caption>` (3) == 3 captioned images. All
  `*_para_leftover`=0 (img/iframe/figure/wp-caption/jetpack). The 21 images =
  3 `figure.wp-caption` (D-Tool-22; 3 non-empty captions) + the rest bare
  `<p><img>` variants (D-Tool-20/23/28/24) + 1 recovered `imageBarePProse`
  (D-Tool-29; assad21.jpg, data-attachment-id 1739, idx 49, with its preceding
  prose as a SEPARATE paragraph at idx 48 — source order). Both embeds carry
  the raw `<iframe ...></iframe>` verbatim with `&#038;` preserved (D-Tool-21).
  feed.json 21 -> 22 entries. POSITIONAL NOTE: the milestone prose's "part-2 at
  idx 21, part-1 at idx 20" is a date-arithmetic/idx slip (second-to-last
  cannot be idx 21 of 22 with part-1 idx 20); date-desc correctly places part-2
  SECOND-TO-LAST at idx 20 and part-1 LAST at idx 21 (agent verified
  POSITIONALLY) — the same slip class noted at C1b-11f/11g. No loss discovered
  (LOSS_LEDGER untouched; L-014 stays OPEN — it tracks all six parts, closed at
  C1b-17). Non-regression: pilot 80 {image:15,paragraph:62,quote:2,table:1};
  controlling-the-narrative 34 {image:5,paragraph:24,quote:4,footnotes:1},
  quote[3] len=240; update 2 {paragraph:2}; the contents post
  {table:1,image:1,paragraph:2}; part-1 {image:11,paragraph:50}; part-7..22 —
  ALL 21 pre-existing committed content/en/\*.json re-extract BYTE-IDENTICAL.
  No new seam class; import-post.js untouched (seam frozen through D-Tool-29).
  depends on: C1b-13a.

- C1b-14 Migrate SERIES PART 3
  (`2016/02/21/a-history-of-political-islam-and-the-west-part-3-iran-
revolution-1`, date 2016-02-21) from the live HTML (`--from html`) into
  content/en/. Legacy non-uniform slug (`a-history-of-political-islam-...`);
  KEEP the live canonical slug. Census MEASURED at recon. feed.json
  22 -> 23 entries (date-desc). No new seam class expected. depends on: C1b-13.
  STATUS: DONE (2026). Migrated part-3 from the live HTML (`--from html`) into
  content/en/a-history-of-political-islam-and-the-west-part-3-iran-revolution-1.json
  (LEGACY NON-UNIFORM canonical slug; HTTP 200, no redirect, no `protected-`
  prefix, entry-content present; slug/title/date confirmed from the LIVE post —
  posts.json is front-truncated and part-3 is ABSENT from it, as L-014 warned).
  Title "A contemporary history of the Muslim world, part 3. Iran: Revolution
  #1"; date 2016-02-21T20:27:21+00:00. Recon MEASURED the census (NOT
  pre-committed): written census {image:11,paragraph:44,embed:2} (57 blocks).
  CRITICAL reconciliation: raw `<img>` count (11) EQUALS the rendered
  image-block count (11) — no silent drop; raw `<iframe>` (2) == rendered embed
  (2); raw `<figure.wp-caption>` (1) == 1 captioned image. All
  `*_para_leftover`=0 (img/iframe/figure/wp-caption/jetpack). The 11 images = 1
  `figure.wp-caption` (D-Tool-22; caption "The army fires on protesters, Black
  Friday, 8 September 1978", idx 38) + 10 bare `<p><img>` variants (D-Tool-20).
  Both embeds carry the raw `<iframe ...></iframe>` verbatim with `&#038;`
  preserved (D-Tool-21; youtube IDs fvtt4Jy69LQ idx 35, ldvwY5fFzQ0 idx 52).
  NO new seam class; import-post.js untouched (seam frozen through D-Tool-29).
  feed.json 22 -> 23 entries (date-desc; part-3 at idx 20, POSITIONALLY just
  ABOVE part-2 idx 21 and part-1 idx 22, just BELOW part-7 idx 19 — verified).
  No loss discovered (LOSS_LEDGER untouched; L-014 stays OPEN — it tracks all
  six parts, closed at C1b-17). Non-regression: pilot 80
  {image:15,paragraph:62,quote:2,table:1}; controlling-the-narrative 34
  {image:5,paragraph:24,quote:4,footnotes:1}, quote[3] len=240; update 2
  {paragraph:2}; the contents post {table:1,image:1,paragraph:2}; part-1
  {image:11,paragraph:50}; part-2 {image:21,paragraph:53,embed:2}; part-7..22 —
  ALL 22 pre-existing committed content/en/\*.json re-extract BYTE-IDENTICAL.
  depends on: C1b-13.
- C1b-15 Migrate SERIES PART 4
  (`2016/03/26/a-history-of-political-islam-and-the-west-part-4-iran-
revolution-2`, date 2016-03-26) from the live HTML (`--from html`) into
  content/en/. Legacy non-uniform slug; KEEP the live canonical slug. Census
  MEASURED at recon. feed.json 23 -> 24 entries (date-desc). No new seam class
  expected. depends on: C1b-14.
  STATUS: DONE (2026). Migrated part-4 from the live HTML (`--from html`) into
  content/en/a-history-of-political-islam-and-the-west-part-4-iran-revolution-2.json
  (LEGACY NON-UNIFORM canonical slug; HTTP 200, 0 redirects, no `protected-`
  prefix, entry-content present; slug/title/date confirmed from the LIVE post —
  posts.json is front-truncated and part-4 is ABSENT from it, as L-014 warned).
  Title "A contemporary history of the Muslim world, part 4. Iran: Revolution
  #2"; date 2016-03-26T11:04:20+00:00. Recon MEASURED the census (NOT
  pre-committed): written census {image:12,paragraph:43} (55 blocks).
  CRITICAL reconciliation: raw `<img>` count (12) EQUALS the rendered
  image-block count (12), 1:1 src match — no silent drop; raw `<iframe>` (0)
  == rendered embed (0); raw `<figure.wp-caption>` (3) == 3 captioned images.
  All `*_para_leftover`=0 (img/iframe/figure/wp-caption/jetpack). The 12 images
  = 3 `figure.wp-caption` (D-Tool-22; 3 non-empty captions) + 9 bare `<p><img>`
  variants (D-Tool-20). NO embeds in this post. NO new seam class; import-post.js
  untouched (seam frozen through D-Tool-29). feed.json 23 -> 24 entries
  (date-desc; part-4 at idx 20, POSITIONALLY just ABOVE part-3 idx 21, part-2
  idx 22, part-1 idx 23, just BELOW part-7 idx 19 — verified). No loss
  discovered (LOSS_LEDGER untouched; L-014 stays OPEN — it tracks all six
  parts, closed at C1b-17). Non-regression: pilot 80
  {image:15,paragraph:62,quote:2,table:1}; controlling-the-narrative 34
  {image:5,paragraph:24,quote:4,footnotes:1}, quote[3] len=240; update 2
  {paragraph:2}; the contents post {table:1,image:1,paragraph:2}; part-1
  {image:11,paragraph:50}; part-2 {image:21,paragraph:53,embed:2}; part-3
  {image:11,paragraph:44,embed:2}; part-7..22 — ALL 23 pre-existing committed
  content/en/\*.json re-extract BYTE-IDENTICAL. depends on: C1b-14.

- C1b-16 Migrate SERIES PART 5
  (`2016/05/19/a-contemporary-history-of-the-muslim-world-part-5-the-lebanese-
civil-war-1`, date 2016-05-19) from the live HTML (`--from html`) into
  content/en/. Uniform `...muslim-world-part-5-...` slug (like parts 7+).
  Census MEASURED at recon. feed.json 24 -> 25 entries (date-desc). No new
  seam class expected. depends on: C1b-15.
  STATUS: DONE (2026). Migrated part-5 from the live HTML (`--from html`) into
  content/en/a-contemporary-history-of-the-muslim-world-part-5-the-lebanese-civil-war-1.json
  (canonical UNIFORM slug; HTTP 200, no redirect, no `protected-` prefix,
  entry-content present; slug/title/date confirmed from the LIVE post — title
  "A contemporary history of the Muslim world, part 5: The Lebanese civil war
  #1"; date 2016-05-19T09:53:36+00:00). Recon MEASURED the census (NOT
  pre-committed): written census {image:17,paragraph:29,embed:1} (47 blocks).
  CRITICAL reconciliation: raw `<img>` count (17) EQUALS the rendered
  image-block count (17), 1:1 src match IN ORDER — no silent drop; raw
  `<iframe>` (1) == rendered embed (1); raw `<figure.wp-caption>` (7) == 7
  captioned images. All `*_para_leftover`=0 (img/iframe/figure/wp-caption/
  jetpack). The 17 images = 7 `figure.wp-caption` (D-Tool-22; 7 non-empty
  captions) + 8 bare `<p><img>` (D-Tool-20) + 2 class-less bare
  `<div><img></div>` (D-Tool-26 divBareImg; `beirut.jpg` idx 11 and `sarkis.jpg`
  idx 14). The 1 embed carries the raw `<iframe ...></iframe>` verbatim with
  `&#038;` preserved (D-Tool-21; youtube ID 7SWD-hcPNaw). NO emph-wrapped image
  (D-Tool-23), no imageBarePStrong (D-Tool-28), no imageBarePTrailing
  (D-Tool-24), no imageBarePProse (D-Tool-29), no embedInBareP (D-Tool-25), no
  tableBare (D-Tool-27), no quote/footnotes. NO new seam class; import-post.js
  untouched (seam frozen through D-Tool-29). feed.json 24 -> 25 entries
  (date-desc; part-5 at idx 20, POSITIONALLY just BELOW part-7 idx 19 and just
  ABOVE part-4 idx 21 — verified). No loss discovered (LOSS_LEDGER untouched;
  L-014 stays OPEN — it tracks all six parts, closed at C1b-17). Non-regression:
  pilot 80 {image:15,paragraph:62,quote:2,table:1}; controlling-the-narrative 34
  {image:5,paragraph:24,quote:4,footnotes:1}, quote[3] len=240; update 2
  {paragraph:2}; the contents post {table:1,image:1,paragraph:2}; part-1
  {image:11,paragraph:50}; part-2 {image:21,paragraph:53,embed:2}; part-3
  {image:11,paragraph:44,embed:2}; part-4 {image:12,paragraph:43}; part-7..22 —
  ALL 24 pre-existing committed content/en/\*.json re-extract BYTE-IDENTICAL.
  depends on: C1b-15.

- C1b-17 Migrate SERIES PART 6
  (`2016/06/04/a-contemporary-history-of-the-muslim-world-part-6-the-lebanese-
civil-war-2`, date 2016-06-04) from the live HTML (`--from html`) into
  content/en/. Uniform `...muslim-world-part-6-...` slug. Census MEASURED at
  recon. feed.json 25 -> 26 entries (date-desc). No new seam class expected.
  After it, ALL 23 series EN posts are migrated (L-014 closed).
  depends on: C1b-16.
  STATUS: DONE (2026). Migrated part-6 from the live HTML (`--from html`) into
  content/en/a-contemporary-history-of-the-muslim-world-part-6-the-lebanese-civil-war-2.json
  (canonical UNIFORM slug; HTTP 200, no redirect, no `protected-` prefix,
  entry-content present; slug/title/date confirmed from the LIVE post — title
  "A contemporary history of the Muslim world, part 6: The Lebanese civil war
  #2"; date 2016-06-04T21:13:36+00:00). Recon MEASURED the census (NOT
  pre-committed): written census {image:17,paragraph:35,embed:1} (53 blocks).
  CRITICAL reconciliation: raw `<img>` count (17) EQUALS the rendered
  image-block count (17), 1:1 src match IN ORDER — no silent drop; raw
  `<iframe>` (1) == rendered embed (1); raw `figure.wp-caption` (12) == 12
  captioned images. All `*_para_leftover`=0 (img/iframe/figure/wp-caption/
  jetpack). The 17 images = 12 `figure.wp-caption` (D-Tool-22; 12 non-empty
  captions) + 3 class-less bare `<div><img></div>` (D-Tool-26 divBareImg) +
  2 bare `<p><img>` (D-Tool-20). The 1 embed carries the raw `<iframe
  ...></iframe>` verbatim with `&#038;` preserved (D-Tool-21; youtube ID
  Ih0aCHnjDko). NO emph-wrapped image (D-Tool-23), no imageBarePStrong
  (D-Tool-28), no imageBarePTrailing (D-Tool-24), no imageBarePProse
  (D-Tool-29), no embedInBareP (D-Tool-25), no tableBare (D-Tool-27), no
  quote/footnotes. NO new seam class; import-post.js untouched (seam frozen
  through D-Tool-29). feed.json 25 -> 26 entries (date-desc; part-6 at idx 20,
  POSITIONALLY just BELOW part-7 idx 19 and just ABOVE part-5 idx 21 —
  verified). L-014 CLOSED: all six earliest series posts (parts 1–6) now
  migrated. No loss discovered (LOSS_LEDGER only L-014 flipped to resolved;
  L-001 stays open/by-design, L-010 stays deferred). Non-regression: pilot 80
  {image:15,paragraph:62,quote:2,table:1}; controlling-the-narrative 34
  {image:5,paragraph:24,quote:4,footnotes:1}, quote[3] len=240; update 2
  {paragraph:2}; the contents post {table:1,image:1,paragraph:2}; part-1..5,
  part-7..22 — ALL 25 pre-existing committed content/en/\*.json re-extract
  BYTE-IDENTICAL. depends on: C1b-16.

- C1b-18 Add SERIES-ORDER to the derived index + list view. Give each feed
  entry an integer `seriesOrder` (1..23) for the series posts, sourced from
  the `contents` post's authoritative grid order (the author's own 1..23
  numbering), with ascending-date as the fallback/validation. The list view
  (app.js renderList) sorts/groups the series by `seriesOrder` so the reader
  sees the series in reading order (1 -> 23), while non-series posts
  (`update`, `controlling-the-narrative`, any future post) keep the default
  date-desc ordering. Touches generate-index.js (derived index) + app.js
  (list view) ONLY — NOT the extraction seam or import-post.js. Revisits 08's
  list presentation; overlaps 10b. Depends on: C1b-17 (all series present).
  See HANDOFF-C1b-17.md for the grid-order source.
  STATUS: DONE (2026). generate-index.js derives an integer `seriesOrder`
  (1..23) per EN series entry from the AUTHORITATIVE `contents` post grid
  (buildSeriesOrderMap parses the single `table` block's "N: <title>" cell
  anchors -> slug); non-series entries (`update`, `controlling-the-narrative`,
  the `contents` index post itself) carry `seriesOrder: null`. app.js
  renderList partitions the visible entries into series (integer seriesOrder)
  and non-series, emits the series FIRST in reading order (1 -> 23) and the
  non-series after it in the feed's date-desc order (stable; same markup and
  classes). feed.json regenerated: 26 entries, 23 series with seriesOrder
  1..23, 3 non-series null. Ascending-date rank == grid order 23/23 (the
  fallback/validation). NO seam change; import-post.js untouched. Zero
  non-regression: all 26 committed content/en/\*.json re-extract
  BYTE-IDENTICAL from cache. No LOSS_LEDGER row (no loss). depends on: C1b-17.

- C1b-DONE (REVISED) Final check proving 25/25 EN posts migrated.
  VERIFICATION-ONLY. Re-extract EVERY committed content/en/_.json from the
  live HTML (cache-first, `--from html`) and confirm BYTE-IDENTICAL (25/25
  posts; 26/26 files incl the `contents` index); confirm each census + all
  `_\_para_leftover`= 0 + raw <img>/<iframe> == rendered counts. Regenerate
feed.json; confirm 26 entries POSITIONALLY; confirm every series entry
carries the correct integer seriesOrder (1..23) and the list view reads
the series in reading order. Confirm LOSS_LEDGER final state (L-001
open/by-design, L-010 deferred, L-014 resolved). Then posts.json deletion
is UNBLOCKED (human-gated; NOT silent). depends on: C1b-18.
STATUS: DONE (2026). ALL 26 committed content/en/*.json (25 EN posts = 23
series + 2 non-series, + the series`contents`index post) re-extract
BYTE-IDENTICAL from the live HTML (cache-first; all 26 canonical URLs hit
the import-post cache); every census == expected, every`\*\_para_leftover`= 0, and raw <img>/<iframe> == rendered block count for every file (the
contents post: 24 raw <img> = 23 inside the single`table`block + 1 image
block). feed.json regenerated IDEMPOTENTLY (sha256 unchanged
85f19c755fb091cb4d46f5fee99fb178c8ff462ab643adb90f47ca9072e66fc1): 26
entries, strictly date-desc, 23 series with seriesOrder 1..23 + 3
non-series null; ascending-date rank == grid order 23/23; app.js
renderList reads the series in reading order 1 -> 23. LOSS_LEDGER final
state confirmed: only L-001 (open/by-design) + L-010 (deferred) are
non-resolved; L-014 resolved. NO seam change; import-post.js untouched
(seam frozen through D-Tool-29). The human-gated`git rm apps/blog/assets/data/posts.json` is now UNBLOCKED (NOT executed
  here). C1b is COMPLETE; Next advances to B1.

- B1 Renderer remaining block types (pullquote, resourceList, callout,
  footnotes, attachment); RENDERER-ONLY. Adds four cases to renderBlock()
  (pullquote -> blockquote.pullquote with optional cite; resourceList ->
  ul.resource-list innerHTML; callout -> aside.callout > callout content
  div; attachment -> figure.attachment with a link + optional figcaption)
  and an additive, new-class-only Milestone B1 block to style.css.
  Trusted-markup fields (pullquote.content, resourceList.content,
  callout.content) -> innerHTML; plain-text fields (pullquote.citation,
  attachment.caption, attachment.label) -> textContent via decodeEntities()
  (B1-D6, restates B1a-D1). footnotes already existed
  (C1-tool-seam-footnotes); B1 VERIFIED it and did NOT re-add it. NO seam
  change; import-post.js untouched (seam frozen through D-Tool-29). The four
  new types are renderer-ready but unreachable until a FUTURE seam extension
  emits them (defensive; each case returns null for an unusable block).
  depends on: 09.
  STATUS: DONE (2026). Four cases added to renderBlock() before the default
  case (pullquote/resourceList/callout/attachment); all pre-existing live
  types byte-identical in the switch; the four new cases are pure additions.
  style.css gained ONE additive Milestone B1 block (pullquote, pullquote
  content, pullquote citation, callout, callout info modifier, callout
  content, resource-list, attachment, attachment link, attachment caption)
  reusing existing tokens, logical properties only, RTL-safe; NO existing
  block edited. node --check PASS; test-integrity INTEGRITY OK; node -e
  smoke test PASS for all four types (pullquote -> BLOCKQUOTE.pullquote with
  a citation; resourceList -> UL.resource-list innerHTML; callout ->
  ASIDE.callout.callout--info > callout content div; attachment ->
  FIGURE.attachment > A with href + FIGCAPTION); empty/unusable blocks return
  null (pullquote/resourceList/callout without content; attachment without
  src). Reachability: the four types are NOT emitted by any content file nor
  by the frozen seam; they are renderer-ready for a future seam extension.
  No content file written; no seam change. Next (10b) authored at this close.

- 10b List item as collapsible panel. Each list item is a collapsible panel:
  the title is a REAL <button> (aria-expanded + aria-controls) toggling that
  item's excerpt panel (the `hidden` attribute); a separate "read full post"
  link is the ONLY navigation affordance (the title toggles, it does not
  navigate). ONE delegated click listener on the .post-list container
  (bound-once via a dataset guard since renderList replaces innerHTML on
  every route change); the real <button> gives Enter/Space activation for
  free. Revisits 08's list presentation; preserves C1b-18 series ordering
  VERBATIM. Touches app.js (renderList item markup + the listener) + style.css
  (ONE additive, new-class-only "Milestone 10b" block) ONLY — NOT the
  extraction seam or import-post.js; feed.json NOT regenerated. depends on:
  C1b.
  STATUS: DONE (2026). app.js renderList now emits, per item, a
  <button class="post-list-item__toggle" type="button" aria-expanded="false"
  aria-controls="excerpt-<slug>"> wrapping <span
  class="post-list-item__title-text">, followed by the .post-list-item**meta
  line and a <div class="post-list-item**panel" id="excerpt-<slug>" hidden>
  holding the excerpt paragraph + <a class="post-list-item__read"
  href="#/<lang>/post/<slug>">Read full post</a>. The C1b-18 series ordering
  (series.sort by seriesOrder, then concat(rest)) is BYTE-IDENTICAL to 08;
  only the item markup string changed. ONE delegated click listener on the
  `.post-list` container (guarded by container.dataset.listToggleBound so it
  binds once across route changes) flips aria-expanded and toggles the
  panel's `hidden` attribute. style.css gained ONE additive Milestone 10b
  block (post-list-item**toggle + ::after caret, post-list-item**title-text,
  post-list-item**panel + [hidden], post-list-item**read / :hover) reusing
  existing tokens, logical properties only, RTL-safe (caret mirrors in RTL);
  NO existing block edited (diff = +72 additions, 0 deletions). node --check
  PASS; test-integrity INTEGRITY OK; node -e structural smoke test PASS (real
  button + aria wiring, aria-controls id match, hidden toggle, read-link
  route, delegated listener, bound-once guard, series ordering preserved);
  feed.json untouched; CSS purely additive. D-10b-1 (real <button>,
  aria-expanded + aria-controls, `hidden` attribute not display:none via
  class); D-10b-2 (read-full-post link is the ONLY navigation affordance);
  D-10b-3 (C1b-18 series ordering preserved verbatim); D-10b-4 (L-010 REMAINS
  DEFERRED — its fix site generate-index.js is fence-excluded from 10b and
  part-22's feed excerpt is a LIVE <a> anchor that would navigate out of the
  panel and violate D-10b-2). Known issue recorded: the old
  `.post-list-item__title` CSS rule is now unused by renderList but is LEFT
  INTACT (removing it would be a non-additive style.css edit, forbidden by
  the 10b fence). No content file written; no seam change; import-post.js
  untouched. Next (11) authored at this close.

- 07b Theme toggle (light / dark / auto). Adds a Theme control to the
  Settings panel (the 07 drawer, #app-panel) and applies data-theme=
  day|night; Auto follows prefers-color-scheme and re-resolves on OS
  change; choice persists under ONE localStorage key and is applied before
  first paint (inline head script) so there is no flash of the wrong
  theme. New module assets/js/theme.js (window.BlogTheme = {init,get,set});
  guarded init in app.js. Tokens re-point only — :root (day) + the
  pre-existing html[data-theme="night"] block. Touches index.html, app.js,
  style.css (one additive block) ONLY — NOT the seam or feed.json.
  depends on: 07.
  STATUS: DONE (2026). index.html gained the inline pre-paint head script
  (sets data-theme only, T-3), a #theme-nav section inside the 07 drawer
  (visually-hidden label + #theme-select: Light/Dark/Auto) as a peer of
  #lang-nav, and the theme.js script tag after shell.js. New
  apps/blog/assets/js/theme.js exposes window.BlogTheme = {init,get,set};
  init wires the select 'change' listener + a prefers-color-scheme
  'change' listener (addEventListener with addListener fallback), is
  idempotent, and never references the router or location.hash. app.js
  gained a GUARDED window.BlogTheme.init() after the BlogShell guard,
  mirroring BlogNav/BlogShell (T-5). style.css gained ONE additive
  Milestone 07b block (theme-select / theme-icon / #theme-nav; NEW classes
  only, diff 36/0 — no existing block edited). Both token blocks intact:
  :root (day/default) + html[data-theme="night"]. node --check PASS;
  test-integrity INTEGRITY OK; node -e structural smoke test PASS (auto +
  OS-light -> day; OS scheme change re-resolves; set(light/dark/auto)
  persists under one key + applies; get() reports applied; invalid pref
  ignored; idempotent init; localStorage failure degrades gracefully);
  grep 'data-theme' shows consumers = style.css + theme.js + index.html
  ONLY (no shell.js/router.js/renderer.js leakage). T-1 (control in the 07
  drawer / Settings panel, no new panel); T-2 (day|night; auto via
  prefers-color-scheme + re-resolve); T-3 (ONE localStorage key, applied
  before first paint); T-4 (tokens only); T-5 (guarded init). No content
  file written; no seam change; feed.json untouched. Next (TTS) already
  authored in e4fb028 and VERIFIED present.

- TTS Text-to-speech on the bottom toolbar (Play / Pause / Stop) via the Web
  Speech API, reading the current post's text; buttons enabled on the post
  view, inert on the list view. depends on: 07b.
  STATUS: DONE (2026). New module apps/blog/assets/js/tts.js exposes
  window.BlogTTS = { init, speak, pause, resume, stop, setEnabled } and owns
  the speechSynthesis lifecycle (no route awareness). index.html: the three
  transport buttons are enabled (no longer `disabled` by default), given
  stable ids (tts-play-btn/tts-pause-btn/tts-stop-btn), aria-labels kept, and
  tts.js loads AFTER shell.js and BEFORE app.js. app.js: guarded
  window.BlogTTS.init({ getText: gatherReadableText }) after the BlogTheme
  guard; gatherReadableText() reads the RENDERED post DOM (title + the text of
  every <p>/<blockquote> in .post-content, document order; skips prose nested
  in pre/code/.embed-container/figure/table) per X-2; renderPost enables Play,
  renderList disables all, and handleRouteChange calls window.BlogTTS.stop()
  FIRST (no overlap, X-4). PAUSE RELIABILITY: because many engines (desktop
  Chrome) ignore speechSynthesis.pause() for one long utterance, tts.js speaks
  the post SENTENCE-BY-SENTENCE (one utterance per sentence, queued in onend)
  and pause() cancels + retains (index, charOffset) so Resume continues the
  SAME sentence; a GENERATION token ignores the cancel-induced onend echo so a
  resume does NOT skip to the next sentence. WORD-PRECISE RESUME (best-effort):
  onboundary charIndex is tracked and the sentence is sliced from that offset
  on resume (Chrome desktop); where onboundary is absent it falls back to the
  sentence head. STOP re-enables Play (setIdle) so Play works again after a
  stop. DEFERRED to TTS2 (NOT in TTS): sentence HIGHLIGHTING and
  CLICK-TO-READ-FROM-HERE. style.css: ONE additive Milestone TTS block
  (.transport\_\_btn.is-active / .is-speaking + a reduced-motion guard; NEW
  classes only, diff 37/0 — no existing block edited). X-1 Web Speech API
  engine; X-2 rendered-DOM text source; X-3 disabled-state contract; X-4
  stop-on-route-change; X-5 guarded init; X-6 07's S-4 superseded for the post
  view (list stays inert). node --check / test-integrity / node structural
  smoke suites (chunked playback, disabled-state contract, word-precise resume
  incl. the cancel-echo regression, graceful no-speechSynthesis path; 46/46)
  ALL PASS. No content file written; no seam change; feed.json untouched.
  Next (11) already authored (20c4d3f).

- TTS2 Player functionalities (remainder): sentence highlighting + click-to-read-from-here
  over the TTS transport. depends on: TTS.
  STATUS: DONE (2026). tts.js gained an ADDITIVE surface over
  window.BlogTTS (onSentence(cb), adviseResolver(fn), highlightTarget(),
  and BlogTTS.splitSentences exposed) while every TTS contract stayed
  unchanged (chunked playback, generation token, word-precise resume, X-3,
  X-5); stop()/pause()/end emit the no-active-sentence signal (index -1).
  app.js builds the spoken sentence array + a parallel DOM Range per
  sentence 1:1 BY CONSTRUCTION (per-node split via the SAME splitSentences),
  updates the highlight on onSentence, and a delegated click-to-read seeks
  the CLICKED sentence via caret hit-test (sentenceIndexAtPoint), scrolling
  it toward the top and clearing on route change. style.css gained ONE
  additive, NEW-selector-only block (::highlight(tts-sentence) sentence
  granular via the CSS Custom Highlight API + .tts-sentence--active
  whole-node fallback + .tts-readable hover; tokens reused, logical props,
  RTL-safe; diff +40/0 — no existing block edited). D-TTS2-1..6 frozen
  (highlight driven by a per-sentence progress signal; 1:1 mapping by
  construction; index -1 = no active sentence; click seeks the CLICK POINT
  by coordinate; presentation-only, reduced-motion suppresses only the
  auto-scroll). node --check PASS; test-integrity INTEGRITY OK; structural
  smoke PASS; HUMAN to confirm in-browser. No content file written; no seam
  change; feed.json untouched. Next (07d) authored at this close.

- 07d CSS typography update (book-reader typography pass). A TYPOGRAPHIC
  pass over the reading experience: reading measure, line-height, vertical
  rhythm, heading scale, and blockquote/code/pre/table/figure/list/link/hr
  styling, with prose-only hyphenation (code exempt). Reuses existing tokens;
  adds new tokens ONLY additively; touches style.css ONLY. Sets the
  typographic SYSTEM (measure/rhythm/scale/spacing/hyphenation); font FAMILY
  choice is 07c (depends on 07d). depends on: 07b. File:
  tools/milestones/07d.md.
  STATUS: DONE (2026). style.css gained ADDITIVE typographic tokens in
  :root (--font-body/--font-heading/--font-mono family tokens defaulting to
  the pre-07d stack; --measure; --font-size-base; --line-height-base;
  --rhythm; --space-1..--space-6) and ONE additive "Milestone 07d —
  typography" block styling the reading column (.post-content >
  .blog-post-content: max-inline-size = --measure, centred, base size +
  line-height from tokens) plus headings (em scale off --font-size-base,
  text-wrap: balance), paragraph rhythm (text-wrap: pretty + hyphens: auto),
  links, lists, blockquote, hr, inline code/pre (hyphens: none + pre
  overflow-x: auto; NEVER hyphenate code), table (rhythm + legible cells +
  overflow-x), figure/figcaption, embeds, and the footnotes list; logical
  properties only; RTL-safe; a small-screen @media override re-points the
  size/measure/rhythm tokens. The pre-existing hardcoded html/body
  font-family was RE-POINTED to var(--font-body) (its default value is
  byte-identical, so visuals are unchanged until 07c re-points the family).
  ADDITIVE only: NO existing class renamed, NO existing token removed, NO
  renderer.js class semantics changed. Brace-balance/parse OK; test-integrity
  INTEGRITY OK; HUMAN to confirm the in-browser checklist (measure/rhythm/
  headings/blockquote/code/table/figure/lists/links; code non-hyphenation;
  list+toolbars+drawer intact; day+night legible; RTL unaffected). No content
  file written; no seam change; feed.json untouched. Next (07c) authored at
  this close.

- 07c Font selection in Settings (traditional / modern + default book-reader
  base). Adds a FONT-FAMILY control to the 07 drawer (#app-panel), peer of
  #lang-nav / #theme-nav, letting the reader choose Traditional / Modern with
  a sensible DEFAULT book-reader base. Re-points the family tokens that 07d
  DEFINED (--font-body / --font-heading) via html[data-font=...]; persists the
  choice under ONE localStorage key and applies it BEFORE first paint
  (mirrors theme.js). SYSTEM stacks only (no webfont fetch; F-4). depends on:
  07b, 07d. File: tools/milestones/07c.md.
  STATUS: DONE (2026). New assets/js/font.js exposes window.BlogFont =
  {init,get,set} mirroring theme.js in shape; it owns the resolved reading
  FAMILY only (no route/hash awareness; idempotent init) and is loaded in
  <head> (NOT deferred) so its parse-time apply of the persisted/default
  family runs before first paint (F-3) — the single source of the font early
  apply, coordinated with theme.js's pre-paint theme apply (two external head
  modules, each owning its own early apply; NO inline script). Pref persists
  under ONE key "zabon-blog-font"; keys are traditional|modern; DEFAULT (unset
  or unknown) REMOVES data-font so the CSS :root default applies; set()
  applies the REQUESTED value directly (so a storage failure still applies for
  the session instead of silently reverting to the default). index.html: a
  #font-nav .app-panel__section peer of #theme-nav/#lang-nav (visually-hidden
  label + #font-select Default/Traditional/Modern; empty value = default) +
  the font.js head script. app.js: GUARDED window.BlogFont.init() after the
  BlogTheme guard (F-6). style.css: ADDITIVE family tokens in :root
  (--font-traditional reading serif, --font-modern clean sans; --font-body
  DEFAULTS to var(--font-traditional) = the book-reader base) + the
  html[data-font="traditional"|"modern"] token re-points (F-5; tokens only,
  no component class meaning change) + ONE additive, new-class-only control
  block (#font-nav/.font-icon/.font-select; logical props; RTL-safe). Additive
  only: NO existing class renamed; the old inline body sans stack is preserved
  as --font-modern (nothing lost). node --check PASS (font.js + app.js);
  test-integrity INTEGRITY OK; 14/14 structural smoke PASS (default applies;
  persisted pref re-applies pre-paint; set() persists + applies; "" -> default;
  invalid pref ignored; init idempotent + wires control; storage failure
  degrades gracefully); grep: no font logic in shell/router/renderer (font.js
  is the single owner). HUMAN to confirm the browser items. No content file
  written; no seam change; feed.json untouched. Next (11) is HUMAN-GATED
  (already authored).

## Now

- 07 App Shell & Toolbars: fixed top/bottom toolbars, drawer,
  language switcher reparented; transport buttons inert. depends on: 06
  NOTE: 07's S-4 ("transport buttons inert") is SUPERSEDED for the POST view
  by TTS (X-6); the list view keeps them inert. Enabled buttons on a post are
  NOT a regression.

## Next (order per depends-on; each authored at the previous chat's close)

<!-- Next chat: 11 -->

<!-- HUMAN GATE: the human reviews the blogs in detail for text changes and
     finalizes the EN text BEFORE any translation. Milestone 11 MUST NOT
     start until this review is signed off. This is a necessary step to
     finalize the text prior to translations. -->

- 11 Translations & i18n UI. depends on: C1, and the HUMAN GATE above
  (detailed blog text review / EN text finalization) being signed off.
  ALREADY authored: tools/milestones/11.md (human-gated).
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
- The D-Tool-9 extraction seam is frozen. Twelve narrow extensions exist so
  far (D-Tool-18 quote-cite; D-Tool-19 bare-<p>; D-Tool-20 bare-<p><img>;
  D-Tool-21 legacy Jetpack embed; D-Tool-22 legacy figure.wp-caption image;
  D-Tool-23 emph-wrapped bare-<p><img>; D-Tool-24 imageBarePTrailing;
  D-Tool-25 embedInBareP; D-Tool-26 divBareImg; D-Tool-27 tableBare; D-Tool-28
  imageBarePStrong — frozen in C1b-11k-a-a; D-Tool-29 imageBarePProse —
  frozen in C1b-13a, DONE). Any additional extension is its own milestone with
  its own LOCKED_DECISIONS entry.
