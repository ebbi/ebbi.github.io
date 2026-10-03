# PARTIAL — Chat C1b-11h: Migrate part-9 (Pakistan to 1979)

Status: STOP (scope-fence trip; NO content file written)
Reason: ONE NEW structural class appeared during recon, causing a SILENT
image loss. Milestone C1b-11h's Scope Fence mandates "If a NEW structural
class appears, STOP and re-scope again (its own milestone)." Nothing was
written to content/, feed.json, LOCKED_DECISIONS.txt, or LOSS_LEDGER.md this
chat.

## What was done (all read-only)

- Pre-flight passed at open:
  - `git status --porcelain` clean
  - `node apps/blog/tools/test-integrity.js` -> INTEGRITY OK
  - `node apps/blog/tools/hash-state.js` -> LOCKED_DECISIONS_SHA256=
    7958f41ecde2ac65ab66d85af56a251b50d651122cb8685fd7a491d3b1b52cdc
    (matches C1b-11g's handoff); GIT_HEAD=7b3960e3 (C1b-11g).
- Confirmed slug/title/date from posts.json AND the live post.
- Recon (read-only) into a scratch path outside the repo (/tmp/c1b11h/).

## Finding 1 — slug confirmed (posts.json RIGHT)

The live canonical URL (HTTP 200, no redirect, entry-content present, no
password form; title identical to posts.json) is
https://twolegsbadblog.wordpress.com/2016/12/25/a-contemporary-history-of-the-muslim-world-part-9-pakistan-1979/

- slug: a-contemporary-history-of-the-muslim-world-part-9-pakistan-1979
- title: A contemporary history of the Muslim world, part 9: Pakistan to 1979
- date: 2016-12-25T23:31:45+00:00
  No redirect; no `protected-` prefix. posts.json matches the live slug.

## Finding 2 — recon census (with the frozen seam, D-Tool-9..25)

42 blocks: {image:13, paragraph:28, embed:1}.

- embed: 1, raw <iframe class="youtube-player" ... src="...qYHUJBRRnc4?version=3&#038;rel=1&#038;..." ...></iframe> verbatim, &#038; preserved (D-Tool-21).
- images rendered: 13 = 8 bare <p><img> (D-Tool-20) + 5 figure.wp-caption (D-Tool-22; all 5 carry a figcaption).
- Raw markup inside entry-content: total <img> = 14; bare <p><img></p> (sole
  child) = 8; figure.wp-caption = 5; emph-wrapped <p><em><img></em></p> = 0;
  div.wp-block-image = 0; figure.wp-block-image = 0; total <iframe> = 1;
  jetpack-video-wrapper div = 1; total <p> = 37; wp-block-paragraph = 0;
  wp-block-quote = 0; wp-block-footnotes = 0; wp-block-table = 0.
  Reconciliation: 8 (D-Tool-20) + 5 (D-Tool-22) = 13 images render; the 14th is
  SILENTLY SWALLOWED (see Finding 3). All `*_para_leftover` = 0 (the defect is
  a DROP, not a raw-markup leak — so the `*_para_leftover` metric does NOT
  catch it; the count 13 vs 14 raw <img> is the tell).

## Finding 3 — THE STOP: new structural class (divBareImg)

Exactly ONE occurrence in entry-content (raw offset ~12524), the image
`270px-miqbal4.jpg` (data-attachment-id="9237"):

  <div><img data-attachment-id="9237" data-permalink=".../270px-miqbal4/" data-orig-file=".../270px-miqbal4.jpg" ... loading="lazy" class="aligncenter size-full wp-image-9237" src="https://twolegsbadblog.wordpress.com/wp-content/uploads/2016/10/270px-miqbal4.jpg?w=660" alt="270px-Miqbal4.jpg" ... /></div>

A CLASS-LESS bare <div> whose SOLE child is an <img> (no class attribute at
all; there is exactly one such div-wrapped sole-img in the whole body, and
zero div-with-class wrapping a sole img). The frozen seam (D-Tool-9 ..
D-Tool-25) does NOT represent it:

- imageWrap (D-Tool-9) requires class="...wp-block-image..."; this <div> has
  NO class, so imageWrap does not match.
- imageFig (D-Tool-9) / wpCaptionFig (D-Tool-22) are <figure> rules.
- imageBareP / imageBarePEm / imageBarePTrailing (D-Tool-20/23/24) are <p>
  rules; this wrapper is a <div>, not a <p>.
- paragraphBare (D-Tool-19) is a <p> rule; it does not match a <div>.
- The loop's skip-and-advance logic therefore steps past `<div>` and the
  `<img>` tag-by-tag, DROPPING the image entirely (same defect shape as
  L-009 / L-011: a legacy image markup class the seam did not model).

Verified: the string "270px-miqbal4" appears NOWHERE in the extracted blocks
(13 image blocks; the 14th raw <img> is absent). img_para_leftover = 0 here
because the markup is DROPPED before any paragraph capture, so this loss is
SILENT to the `*_para_leftover` checks — it is caught only by the raw <img>
count reconciliation (14 raw vs 13 rendered).

This is the STOP condition. Resolution requires a NEW narrow seam extension
(a NINTH D-Tool entry, `divBareImg`) frozen in its OWN milestone, authored as
apps/blog/tools/milestones/C1b-11h-a.md. After it, seam-READY recon of part-9
yields {image:14, paragraph:28, embed:1} (43 blocks), all `*_para_leftover`=0.

Scope note: this class appears in ONLY the part-9 cache (cache sha
42f01bff859cc2df93408523a972da7905f145aebdb5505a5b717346b7d660f6); scanning
all 20 other cached sources shows 0 occurrences, so NO previously shipped
slug is affected (no retrospective re-migration). A NEW L-012 ledger row is
authored in C1b-11h-a (where the class is frozen) / resolved in C1b-11h-b.

## NOT done (deferred to C1b-11h-a then C1b-11h-b)

- No content/en/\*.json written.
- feed.json NOT regenerated (still 16 entries).
- LOCKED_DECISIONS.txt NOT touched (the new D-Tool entry is frozen in C1b-11h-a).
- LOSS_LEDGER.md NOT touched (the L-012 row is authored at the fix/migration).
- import-post.js NOT touched (the seam extension is its OWN milestone).

## Repo state at stop

Clean (no 0-byte stray file at repo root or app root before write). This
chat's deliverables are the handoff, this PARTIAL section, the re-scope
milestones C1b-11h-a.md and C1b-11h-b.md, HANDOFF-CURRENT.txt and ROADMAP.md
— and a local commit (no push).

---

# PARTIAL — Chat C1b-11: Migrate part-15 (the Afghan Arabs)

Status: STOP (scope-fence trip; NO content file written)

## What was done (all read-only)

- Pre-flight passed at open:
  - `git status --porcelain` clean
  - `node apps/blog/tools/test-integrity.js` -> INTEGRITY OK
  - `node apps/blog/tools/hash-state.js` -> LOCKED_DECISIONS_SHA256=
    a218f137091572516ff297f836fd071e52159724864eb1e098ecbd0c3662c2dc
    (matches C1b-10's handoff); GIT_HEAD=9ee17cf1 (C1b-10).
- Confirmed slug/title/date from posts.json AND the live post.
- Recon (read-only) into a scratch path outside the repo.

## Finding 1 — slug discrepancy (posts.json RIGHT this time)

The milestone's "expected" URL
.../2018/06/11/a-contemporary-history-of-the-muslim-world-part-15-the-afghan-arabs/
301-redirects to the canonical
.../2018/06/11/a-contemporary-history-of-the-muslim-world-part-15-the-afghan-arabs-foreign-fighters-in-afghanistan/

posts.json carries the LONGER (canonical) slug, which is the one the live
site serves (HTTP 200). import-post.js derives the slug from the URL
(slugFromUrl), so recon was run against the canonical URL and the derived
slug/title/date match posts.json:

- slug: a-contemporary-history-of-the-muslim-world-part-15-the-afghan-arabs-foreign-fighters-in-afghanistan
- title: A contemporary history of the Muslim world, part 15: The &#8216;Afghan Arabs&#8217; : foreign fighters in Afghanistan
- date: 2018-06-11T07:48:18+00:00

ACTION: the re-scoped milestones (C1b-11a, C1b-11b) and the eventual
content filename MUST use the LONG canonical slug, not the redirecting one.

## Finding 2 — recon census

81 blocks: {image:12, paragraph:68, embed:1}.

- embed: 1 (idx 77), raw <iframe class="youtube-player" ... src="...FGhGHxw0mSo?version=3&#038;rel=1..."> verbatim, &#038; preserved (D-Tool-21). L-005 was "(count TBD at recon)" -> count = 1 embed.
- images: 12 = 7 figure.wp-caption (D-Tool-22; all 7 carry a figcaption) + 5 bare <p><img> (D-Tool-20).
- Raw markup inside entry-content: figure.wp-caption=7, bare-p><img=5, img=13, iframe=1, jetpack-video-wrapper=1, figcaption=7.

## Finding 3 — THE STOP: new structural class (imageBarePEm)

Exactly ONE occurrence in entry-content (source of the live text
"_![Screenshot from 2018-05-20 16:28:00.png](...162800.png?w=471)_"):

  <p style="text-align:justify;"><em><img data-attachment-id="11456" ...></em></p>

The frozen seam (D-Tool-9 .. D-Tool-22) does NOT represent an <em>-wrapped
bare-<p><img>:

- D-Tool-20 imageBareP requires the <img> to be the SOLE child of the <p>;
  the <em> wrapper defeats it.
- D-Tool-19 paragraphBare therefore captures it as a paragraph, leaving raw
  <img ...> markup as paragraph text (same defect shape as L-009).
- Consequence: img_para_leftover WOULD BE 1, not 0 -> violates C1b-11.

This is the STOP condition. Resolution requires a NEW narrow seam extension
(a sixth D-Tool entry, imageBarePEm) frozen in its OWN milestone, which is
authored as apps/blog/tools/milestones/C1b-11a.md.

## NOT done (deferred to C1b-11a then C1b-11b)

- No content/en/\*.json written.
- feed.json NOT regenerated (still 10 entries).
- LOCKED_DECISIONS.txt NOT touched (the new D-Tool entry is frozen in C1b-11a).
- LOSS_LEDGER.md NOT touched (L-005 stays "deferred"; its resolution note is
  written when part-15 is actually migrated in C1b-11b).

## Repo state at stop

Clean (the recurring 0-byte stray file at repo root was removed before any
write; it matched carried warning 7). This chat's deliverables are the
handoff, this PARTIAL, the re-scope milestone C1b-11a.md, HANDOFF-CURRENT.txt
and ROADMAP.md — and a local commit (no push).

---

# PARTIAL — Chat C1b-11e: Migrate part-12 (Saudi Arabia and the Arab cold war)

Status: STOP (scope-fence trip; NO content file written)
Reason: TWO NEW structural classes appeared during recon. Milestone C1b-11e's
Scope Fence mandates "If a NEW structural class appears, STOP and re-scope
(its own milestone)." Nothing was written to content/, feed.json,
LOCKED_DECISIONS.txt, or LOSS_LEDGER.md this chat.

## What was done (all read-only)

- Pre-flight passed at open:
  - `git status --porcelain` clean
  - `node apps/blog/tools/test-integrity.js` -> INTEGRITY OK
  - `node apps/blog/tools/hash-state.js` -> LOCKED_DECISIONS_SHA256=
    ca5e5081f0817ac8b365095cd684b183e066096da45c1656e0714747af351f67
    (matches C1b-11d's handoff); GIT_HEAD=3277c83c (C1b-11d).
- Confirmed slug/title/date from posts.json AND the live post.
- Recon (read-only) into a scratch path outside the repo.

## Finding 1 — slug confirmed (posts.json RIGHT)

The live canonical URL (HTTP 200, entry-content present; title identical to
posts.json) is
https://twolegsbadblog.wordpress.com/2018/04/16/a-contemporary-history-of-the-muslim-world-part-12-saudi-arabia-and-the-arab-cold-war/

- slug: a-contemporary-history-of-the-muslim-world-part-12-saudi-arabia-and-the-arab-cold-war
- title: A contemporary history of the Muslim world, part 12: Saudi Arabia and the &#8216;Arab Cold War&#8217;
- date: 2018-04-16T09:30:30+00:00
  No redirect; no `protected-` prefix. posts.json matches the live slug.

## Finding 2 — recon census (with the frozen seam, D-Tool-9..23)

55 blocks: {paragraph:43, image:11, embed:1} — NOT seam-READY, because:
img_para_leftover = 1 AND iframe_para_leftover = 1.

Raw markup inside entry-content: total <img> = 12; bare <p><img></p> (sole
child) = 7; figure.wp-caption = 4; emph-wrapped <p><em><img></em></p> = 0.
total <iframe> = 2; jetpack-video-wrapper div = 2.

Reconciliation: 7 (D-Tool-20) + 4 (D-Tool-22) = 11 images render; the 12th is
swallowed (Class A). One of the 2 jetpack wrappers renders as an embed
(standalone, D-Tool-21); the other is swallowed (Class B).

## Finding 3 — THE STOP: TWO new structural classes

Class A `imageBarePTrailing` (one occurrence, entry-content offset ~3):

  <p style="text-align:justify;"><img data-attachment-id="11094" ... src="...nasserfaisal1.jpg?w=715&#038;h=258" ... />After the previous posts on the Afghan war, my intention was originally to examine ...</p>

A bare <p> that BEGINS with a single <img> and CONTINUES with prose inside the
SAME <p> (no </p> between the image and the text). The frozen seam does NOT
represent it:

- D-Tool-20 imageBareP requires the <img> to be the SOLE child; the trailing
  prose defeats it.
- D-Tool-19 paragraphBare then captures the whole <p>, leaving raw <img ...>
  markup as paragraph text (the L-009 defect shape).
- Consequence: img_para_leftover = 1 -> violates C1b-11e.

Class B `embedInBareP` (one occurrence, entry-content offset ~15319; len=654):

  <p style="text-align:justify;">This propaganda video gives an idea of the kind of hybrid world being built in the desert in the 1950s: <div class="jetpack-video-wrapper"><span class="embed-youtube" ...><iframe class="youtube-player" ... src="...8sjhiz4CaUo?version=3&#038;rel=1..." ...></iframe></span></div></p>

A bare <p> containing prose followed by an inline legacy Jetpack embed NESTED
INSIDE the <p>. The frozen seam does NOT represent it:

- D-Tool-21's embed regex matches the <div class="jetpack-video-wrapper">, but
  that match sits at a LATER position than the enclosing <p ...>.
- D-Tool-19 paragraphBare matches the enclosing <p> at an EARLIER position and
  wins, swallowing the prose AND the iframe into paragraph text.
- Consequence: iframe_para_leftover = 1 -> violates C1b-11e.

(The SECOND jetpack wrapper, offset ~44134, is preceded by a closed </p>
("<p>&nbsp;</p>") so it is standalone and D-Tool-21 matches it correctly as an
embed block — hence census embed:1.)

## The STOP

Resolution requires TWO NEW narrow seam extensions frozen in their OWN
milestone (seventh + eighth after D-Tool-23):

- D-Tool-24 `imageBarePTrailing`: bare <p> beginning with <img> then prose ->
  emit the leading <img> as an image block; the trailing prose is claimed by
  paragraphBare on the next loop turn.
- D-Tool-25 `embedInBareP`: bare <p> containing prose then an inline legacy
  Jetpack embed -> emit the leading prose as a paragraph AND the raw <iframe>
  as an embed block (blockFromFragment returns two blocks; minimal loop
  accommodation).
  Authored as apps/blog/tools/milestones/C1b-11e-a.md (seam), then part-12 is
  migrated in apps/blog/tools/milestones/C1b-11e-b.md.

## NOT done (deferred to C1b-11e-a then C1b-11e-b)

- No content/en/\*.json written.
- feed.json NOT regenerated (still 13 entries).
- LOCKED_DECISIONS.txt NOT touched (the new D-Tool entries are frozen in
  C1b-11e-a).
- LOSS_LEDGER.md NOT touched (no loss; L-006 stays deferred/seam READY).

## Repo state at stop

Clean (the recurring 0-byte stray file at repo root, matching carried warning
7, was removed before any write). This chat's deliverables are the handoff,
this PARTIAL section, the re-scope milestones C1b-11e-a.md and C1b-11e-b.md,
HANDOFF-CURRENT.txt and ROADMAP.md — and a local commit (no push).
