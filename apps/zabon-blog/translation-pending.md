# TRANSLATION PENDING (11b-b) + CURRENT MILESTONE POINTER

Purpose: ONE place a fresh chat can read to (a) resume the TRANSLATION track
(11b-b) and (b) find the CURRENT milestone (11-language-persist). Translation
work spans several weeks, so this file exists to prevent workflow drift.

Last updated: 2026-06 (at the close of 11-language-persist).

---

## PART A — CURRENT MILESTONE (non-translation track)

Milestone: **11-language-persist** (formerly drafted as "11c").
File: `tools/milestones/11-language-persist.md`. STATUS: DONE (browser-verified).
What it does: persists the reader's language choice in localStorage (ONE key
`zabon-blog-lang`), restores it when the URL carries no language, and keeps it
while navigating post <-> index (the header brand is now language-neutral
`#/`). New module `assets/js/lang.js` (window.BlogLang); `router.js` is the
single reader/writer; `index.html` loads lang.js in `<head>` and uses `#/`.
Open items: NONE functional. Remaining bookkeeping at close: ROADMAP entry +
this file + delete of the old HANDOFF-*.md set. If a NEW chat is opened for
anything OTHER than translations, read `HANDOFF-CURRENT.txt` first.

---

## PART B — TRANSLATION TRACK: 11b-b (RESUME HERE)

Goal: translate the remaining EN slugs PER LANGUAGE — **fa, then th, then ar**
(one language per chat, D-11b-8/P8). The EN text was FINALIZED by the human
(human gate SIGNED OFF at 10c close): translation is UNBLOCKED.

### STATE ON DISK (verified at 11b close)

- `content/en/` = **26 files** (23 series + `update` + `controlling-the-narrative`
  + the series `contents` index post). This is the SOURCE set.
- `content/fa/` = **23 of 26** slugs translated (23 files, parse OK), all
  carrying LOCAL image `src` (inherited from 11b-a). **3 fa slugs REMAIN:**
  1. `protected-a-contemporary-history-of-the-muslim-world-part-13-yemen-1`
  2. `what-we-have-forgotten-and-they-havent-a-history-of-political-islam-and-the-west`
  3. `what-we-have-forgotten-and-they-havent-a-history-of-political-islam-and-the-west-part-2`
- `content/th/` = 1 file (the 11a pilot only). Batch NOT started.
- `content/ar/` = 1 file (the 11a pilot only). Batch NOT started.
- The 3 NON-BLOG slugs (`update`, `controlling-the-narrative`, the `contents`
  index post) were translated for fa (harmless; deny-listed at render). If a
  leaner set is wanted, delete them from `content/fa/` and exclude them from the
  th/ar loops.

### BLOCKER (as of last run): DeepL QUOTA EXHAUSTED

The prior `fa` pass STOPPED on HTTP 456 (quota). The AUTHORITATIVE number is
`/v2/usage`, NOT the DeepL account web page:

    curl -s -H "Authorization: DeepL-Auth-Key $DEEPL_API_KEY" \
      https://api-free.deepl.com/v2/usage
    => {"character_count":1000000,"character_limit":1000000}   # 0 left

The key is a FREE key (`:fx`, length 39) -> the tool correctly uses
`api-free.deepl.com`. The web page (~120,446/1M) does NOT match the key's
account; **trust /v2/usage**. Resolution options: wait for the monthly reset
(1st of month, UTC), upgrade/add a Pro key (no `:fx` -> routed to
`api.deepl.com`), or use another key.

### THE CORRECT PROCEDURE (do NOT use "--lang fa" alone)

`tools/translate.js` is a **SINGLE-SLUG** tool (DEFAULT_SLUG="update"); there is
NO all-slugs mode. Translate PER SLUG. From `apps/blog`:

    export DEEPL_API_KEY=...                       # env-only; NEVER committed
    node tools/translate.js --usage                # 1) check quota FIRST
    # 2) fa loop — the 3 remaining slugs (skip already-done + the pilot):
    for slug in $(ls content/en/ | sed 's/\.json$//'); do
      [ "$slug" = "a-contemporary-history-of-the-muslim-world-11-afghanistan-3" ] && continue
      [ -f "content/fa/$slug.json" ] && { echo "SKIP (done): $slug"; continue; }
      echo "=== fa: $slug ==="
      node tools/translate.js --lang fa --slug "$slug" || { echo "FAILED: $slug"; break; }
    done
    # 3) regenerate + verify:
    node tools/generate-index.js && node tools/test-integrity.js

Then repeat the loop with `--lang th` (then `--lang ar`) in a LATER chat.
`translate.js` copies image `src` VERBATIM from EN, so NEW translations
automatically inherit the LOCAL src (EN is already localized). NO extra
src-reconciliation step is needed for 11b-b.

### translate.js QUOTA PREFLIGHT (added in 11b, additive)

- Before a real run it GETs `/v2/usage`, prints used/limit/remaining + the
  slug's estimated cost, and ABORTS (exit 6) if remaining <= 0 OR the slug
  won't fit. Override with `--no-usage-check`.
- `--usage` prints used/limit/remaining for the key and exits (no `--lang`).
- Endpoint selection (`:fx` -> free host), g1 tag/URL invariance, structure
  guard, and per-field translation are UNCHANGED.

### AFTER EACH LANGUAGE BATCH

1. `node tools/generate-index.js` then `node tools/test-integrity.js`.
2. feed.json grows accordingly (51 entries after the fa partial: 26 en + 23 fa
   + 1 th + 1 ar). The 3 non-blog slugs are excluded from the rendered list
   (deny-list in app.js renderList) but ARE in feed.json.
3. Translations inherit LOCAL `src` (11b-a); do NOT re-reconcile images.

---

## PART C — SCAFFOLDING FACTS THE NEXT CHAT MUST NOT RE-DISCOVER

- EN is localized: content/en image refs point to
  `assets/img/posts/<slug>/<YYYY>/<MM>/<basename>` (330 files, committed). The
  `<YYYY>/<MM>/` segment is MANDATORY (a within-slug basename collision would
  otherwise silently overwrite a distinct image — the part-6 defect).
- 17 EXTERNAL images stay REMOTE by decision (D-11b-7); 86 non-image article
  links (href/data-permalink) stay remote; 37 youtube embed iframes stay remote.
  All THREE are NOT regressions.
- The 182 caption-less image blocks still use alt="Blog image" (P5 deferred).
- Non-batch slugs have NO non-EN file; fa/th/ar readers get the EN fallback (D3)
  until 11b-b lands. Intended interim state.
- L-010 (feed-excerpt HTML leak for part-22) remains deferred.
- The extraction seam (import-post.js) is FROZEN through D-Tool-29; 11b and
  11-language-persist changed NO seam.
- C1b-18 series ordering + 10b/10c list & post presentation are FROZEN.

## PART D — WORKFLOW REMINDERS (carried warnings)

1. `tools/*.md` whitespace may not survive chat copy; anchor edits from `cat -A`.
2. Edit splice pitfall: verify POSITIONALLY, not by substring.
3. FILENAME COLLISION risk: B1 vs B1a (mind distinct names).
4. `hash-state.js` FILE_TREE_SHA256: capture AFTER staging.
5. STYLE.CSS write verification: re-read from disk after every write.
6. ROADMAP EDIT NO-OP: treat "no tool output" as a NO-OP; confirm each edit with
   a narrow `grep -c`; avoid full-file re-reads of the large ROADMAP.
7. P9 HUMAN GATE: `localize-images.js` REFUSES a real run without `--yes`.
8. STORE PATH CONTENTION: ALWAYS keep the `<YYYY>/<MM>/` segment.
9. A head-module a body script depends on MUST be verified PRESENT in
   index.html (11-language-persist lesson); `node --check` + a stubbed smoke
   CANNOT catch a missing `<script>` tag.
