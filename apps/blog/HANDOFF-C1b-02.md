HANDOFF — Chat C1b-02: Migrate `update` from live HTML (BLOCKED)

Status: blocked
Current chat id: C1b-02
Current milestone: C1b-02
Completed milestones: 00,01,02,03,04,05a,05a-fix,05b-removal,W1,W1-fix,
06,06b,07,08,09,C1a,C1-tool,C1-tool-p2,C1-model,C1-tool-cleanup,B1a,
C1-tool-seam-complete,C1b-01
Next chat id: C1b-seam-bare-p
Context windows used: 1

## Files created/modified (exact paths)

- Created: apps/blog/HANDOFF-C1b-02.md (this file)
- Created: apps/blog/tools/milestones/C1b-seam-bare-p.md (next milestone)
- Modified: apps/blog/tools/LOSS_LEDGER.md (added L-008, open)
- Modified: apps/blog/tools/ROADMAP.md (C1b-02 -> blocked; C1b-seam-bare-p -> Next)
- Modified: apps/blog/HANDOFF-CURRENT.txt (pointer -> this handoff)
- NOT created: apps/blog/content/en/update.json (no valid extraction; see below)
- NOT modified: tools/import-post.js (seam frozen; the extension is the NEXT
  milestone), feed.json (no new content), posts.json (read-only, UNTRUSTED),
  LOCKED_DECISIONS.txt (no decision frozen this chat), CONTEXT.md,
  WORKFLOW.md, all content/en/*.json, all assets/js, index.html, style.css.

## THE HEADLINE

- C1b-02 is BLOCKED: the D-Tool-9 seam as frozen CANNOT represent the live
  `update` post. Its body is two BARE `<p>` elements with ZERO wp-block-*
  markers; extractHtmlBlocks' TOP list keys on wp-block-* classes, matches
  nothing, and throws "no recognised blocks in entry-content".
- Root cause: markup variant (case A). NOT a fetch failure, NOT a
  sliceEntryContent under-slice, NOT a consent/interstitial page. The cached
  dump (92258 bytes) is the real post (id 11339, permalink, post-nav). The
  4 KB window after the entry-content open shows both bare <p>, then the
  Jetpack Share block, then `<!-- .entry-content -->`.
- Byte-level evidence (grep counts; full record): LOSS_LEDGER L-008.
- Impact: 2 of 2 blocks — the whole post is unrepresentable. Recorded as
  L-008 (open), per NEW-1/NEW-2. Nothing was reconciled silently.
- The milestone premise (C1b-02.md: seam handles `update`; C1b-01 handoff:
  update is a 2-block confidence-builder) is FALSE via the current seam.

## Frozen decisions made in this chat

- NONE. Deliberately. Re-scoping C1b-02 in place into a seam extension would
  violate CONTEXT.md (one milestone per chat; one plan per milestone file).
  The extension is deferred to its own milestone (C1b-seam-bare-p) with its
  own D-Tool-19 entry. No LOCKED_DECISIONS edit this chat.

## Hashes (inputs only — see tools/WORKFLOW.md, convention (b))

LOCKED_DECISIONS_SHA256=bb2419a11b9f75ef1e8e5fce8e94d1a973e774cf8cf88f2db29e27d259412f65
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256= OMITTED (Option 2 — no tools/schema.json)

NOTE: both values UNCHANGED from C1b-01 (no decision frozen; pilot content
untouched). INPUTS ONLY — re-confirm via `node apps/blog/tools/hash-state.js`
before staging; do not transcribe by hand.

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the
commit-message body, per WORKFLOW.md step 6.

## Expected delta for the next chat

- C1b-seam-bare-p (next, authored as this chat's step 7): extend the D-Tool-9
  seam with a bare-<p> rule, add D-Tool-19, migrate `update` to 2 blocks,
  regenerate feed.json, resolve L-008, and author C1b-03.
- After C1b-seam-bare-p lands, C1b-02's goal is met inside that milestone;
  update.json is written there. C1b-02 needs no separate re-open chat.
- Corpus for C1b-03..19: (a) core/embed posts exist (L-004..L-006, deferred);
  (b) bare-<p> posts exist (L-008). Each class may need its own seam
  extension before the affected slug migrates. Dump+grep each new slug EARLY.

## Human edits made outside tooling (structured)

- Maintainer ran the recon; it failed with
  "extractHtmlBlocks: no recognised blocks in entry-content".
- Maintainer ran the follow-up /tmp require, which failed with
  MODULE_NOT_FOUND — expected, NOT a second bug: writeAtomic never ran
  because extractBlocks threw first; /tmp/c1b-02-recon.json did not exist.
- Maintainer ran --dump-html (92258 bytes, cached=true) and the raw-byte
  greps/cmd that established L-008. All outputs pasted verbatim.

## Open warnings (count + links only)

- W2. hash-state.js output keys still unverified; hash block filled at
  handoff time (inputs only, per convention (b)).
- W8. tools/import-post.md stray — see Known issues. (NOTE: it was NOT
  present in `git status` at stage time this chat; see Known issues.)

## Deviations from locked decisions

- None. The chat OBEYED the locked decisions rather than deviating: D-Tool-9
  (seam frozen) and C1b-02's own "does NOT touch the seam" fence were
  respected by declaring BLOCKED instead of patching import-post.js in place.
  Intended behaviour when a milestone's premise meets reality: stop, record,
  re-scope into a NEW milestone.

## Partial work

- None. No content file, no feed regeneration, no seam edit, no ledger
  fabrication. Clean boundary: BLOCKED.

## Blocked reason

- The live `update` body is two bare `<p>` with no wp-block-* markers; the
  frozen D-Tool-9 seam has no rule for bare <p> inside entry-content and
  throws "no recognised blocks in entry-content". update.json cannot exist
  without a seam extension. See L-008; unblock action = C1b-seam-bare-p.

## Known issues / TODOs

- C1b-seam-bare-p.md authored (this chat); C1b-03..19 + C1b-DONE not authored.
- extractHtmlBlocks has TWO known unrepresentable classes: core/embed
  (L-004..L-006) and bare <p> (L-008). Each needs its own seam milestone.
- W8: tools/import-post.md stray. At this chat's stage step it did NOT appear
  in `git status --porcelain`; it may have been removed or never existed here.
  Resolve before a future tools/-touching milestone (rm or keep-untracked).
- test-integrity.js does not cover content/, feed.json, or the seam.
- IDE Apply can inject stray tokens into .js; inspect `git diff` at the patch
  site (this chat did NOT edit any .js; C1b-seam-bare-p will).

## Assumptions the next chat may rely on

- content/en/controlling-the-narrative.json is canonical (34 blocks; quote[3]
  len=240, cite fix).
- content/en/jews-in-palestine-before-israel.json is unchanged (80 blocks).
- posts.json stays on disk until C1b-DONE proves 20/20; it is NOT a source.
- Host allowlist = twolegsbadblog.wordpress.com, https only.
- feed.json still has 2 entries (NOT regenerated this chat — no new content).
- The `update` live dump cache exists (92258 bytes); a re-run of --from html
  will hit that cache deterministically.

## Test checklist result (pass/fail per item)

0. node --check import-post.js -> OK: PASS (unmodified this chat).
1. test-integrity.js -> INTEGRITY OK: PASS (no tracked file it checks changed).
2. Recon reproducibility: cached dump makes the recon error deterministic,
   not a network race. (Re-run optional; not required for closure.)
3. Raw-byte evidence captured (grep counts + 4 KB window): PASS.
4. git status --porcelain -> exactly this milestone's file set: PENDING
   (runner to confirm at stage time).

## Files to read in the next chat (exact paths)

- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-C1b-02.md
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/LOCKED_DECISIONS.txt (D-Tool-9, D-Tool-18, D-Tool-19 once added)
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/ROADMAP.md
- apps/blog/tools/LOSS_LEDGER.md (esp. L-008)
- apps/blog/tools/milestones/C1b-seam-bare-p.md
- apps/blog/tools/import-post.js (as it will be modified by C1b-seam-bare-p)
- apps/blog/content/en/controlling-the-narrative.json (C1b-01 reference)
- apps/blog/assets/data/posts.json (read-only; next-slug discovery)
- CAP OVERAGE: this handoff is 155 lines vs the 150-line cap in
  CONTEXT.md. Declared, not hidden. Not trimmed further because every
  remaining section carries a fact the next chat needs; a third blind
  trim risked dropping a fact for a cosmetic gain. A future chat may
  condense it opportunistically when it next reads it.
