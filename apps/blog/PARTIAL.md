# PARTIAL — Chat C1b-11: Migrate part-15 (the Afghan Arabs)

Status: STOP (scope-fence trip; NO content file written)
Reason: a NEW structural class appeared during recon. Milestone C1b-11's
Scope Fence mandates "If a NEW structural class appears, STOP and re-scope
(its own milestone)." Nothing was written to content/, feed.json,
LOCKED_DECISIONS.txt, or LOSS_LEDGER.md this chat.

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
- embed: 1 (idx 77), raw <iframe class="youtube-player" ... src="...FGhGHxw0mSo?version=3&#038;rel=1...">  verbatim, &#038; preserved (D-Tool-21). L-005 was "(count TBD at recon)" -> count = 1 embed.
- images: 12 = 7 figure.wp-caption (D-Tool-22; all 7 carry a figcaption) + 5 bare <p><img> (D-Tool-20).
- Raw markup inside entry-content:  figure.wp-caption=7, bare-p><img=5, img=13, iframe=1, jetpack-video-wrapper=1, figcaption=7.

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

- No content/en/*.json written.
- feed.json NOT regenerated (still 10 entries).
- LOCKED_DECISIONS.txt NOT touched (the new D-Tool entry is frozen in C1b-11a).
- LOSS_LEDGER.md NOT touched (L-005 stays "deferred"; its resolution note is
  written when part-15 is actually migrated in C1b-11b).

## Repo state at stop

Clean (the recurring 0-byte stray file at repo root was removed before any
write; it matched carried warning 7). This chat's deliverables are the
handoff, this PARTIAL, the re-scope milestone C1b-11a.md, HANDOFF-CURRENT.txt
and ROADMAP.md — and a local commit (no push).
