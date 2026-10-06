HANDOFF — Chat 11b: Local image storage (11b-a DONE) + batch translation rollout (11b-b PARTIAL: fa 23/26, quota-exhausted)
Status: partial (11b-a COMMITTED; 11b-b fa batch committed 23/26; th/ar pending quota reset)
Current chat id: 11b
Current milestone: 11b (split per P8 -> 11b-a images, 11b-b translation batch)
Completed milestones: 00,01,02,03,04,05a,05a-fix,05b-removal,W1,W1-fix,06,06b,07,08,09,C1a,C1-tool,C1-tool-p2,C1-model,C1-tool-cleanup,B1a,C1b-01..C1b-DONE,C1b-18,C1b-12..C1b-17,B1,10b,07b,TTS,TTS2,07d,07c,10c,11a,11b-a
Next chat id: 11b-b (translation batch: finish fa's 3 slugs, then th, then ar — one language per chat)
Context windows used: 3

## COMMIT RECORD (2026)

- 11b-a = a1a5b82 "11b-a: local image storage + translate.js usage preflight"
  FILE_TREE_SHA256 (after staging 11b-a) = 72cfab379d1c8343fc5d7d73eec4edf39ee7e1511f1f53ed20994c439faa7d90
- 11b-b (partial) = b3d4d25 "11b-b (partial): fa 23/26 translations + feed.json"
  FILE_TREE_SHA256 (after staging 11b-b) = 3239735977778b3840630a547e3b017b773ca342a249d78d3bbd4a7067b7504b
- predecessor 11a = 255db62 "11a: translation pipeline (m1) + pilot fa/th/ar + switcher open"
  Working tree CLEAN after b3d4d25. feed.json regenerated (51 entries:
  26 en + 23 fa + 1 th + 1 ar) IN the 11b-b commit.

## 11b-b PROGRESS + QUOTA CHECKPOINT (updated in chat 11b-b, first pass)

The first 11b-b pass (`fa`) was run by the human and STOPPED on QUOTA EXHAUSTION.
STATE ON DISK:

- content/fa/: 23 of 26 slugs translated (23 files present + parse OK).
  All 23 carry LOCAL image src (278 local block src + 67 local inline refs,
  0 remote in-scope remaining, 0 broken local refs) — inherited from 11b-a.
- REMAINING fa slugs (3):
  protected-a-contemporary-history-of-the-muslim-world-part-13-yemen-1
  what-we-have-forgotten-and-they-havent-a-history-of-political-islam-and-the-west
  what-we-have-forgotten-and-they-havent-a-history-of-political-islam-and-the-west-part-2
  (the last successful attempt was the ~24th; the 24th slug — part-13 — hit
  HTTP 456 and ABORTED before writing; no partial file. The 2 early parts were
  never attempted.)
- content/th/: 1 file (the 11a pilot only). content/ar/: 1 file (the 11a pilot
  only). The th/ar batches have NOT started (blocked on the same quota).
- The non-blog slugs (`update`, `controlling-the-narrative`, the `contents`
  index post) WERE translated for fa (harmless; they are deny-listed at render).
  If a leaner set is wanted later, delete those 3 from content/fa/ and exclude
  them from the th/ar loops.
- feed.json regenerated (generate-index.js): 51 entries (26 en + 23 fa + 1 th
  - 1 ar); 23 series keep seriesOrder, 25 non-EN carry seriesOrder null.

QUOTA — THE AUTHORITATIVE NUMBER (this is the confusing part):
curl -s -H "Authorization: DeepL-Auth-Key $DEEPL_API_KEY" \
 https://api-free.deepl.com/v2/usage
=> {"character_count":1000000,"character_limit":1000000} (0 left)
The KEY is a FREE key (`:fx`, length 39) -> the tool correctly uses
api-free.deepl.com. The DeepL ACCOUNT WEB PAGE showed ~120,446/1M, which does
NOT match the key's account: /v2/usage is AUTHORITATIVE FOR THE KEY, the web
page is NOT. Do not be misled by the page; trust /v2/usage.
=> The 456 is a REAL quota exhaustion (1,000,000/1,000,000). Nothing to fix in
code. Wait for the monthly reset (1st of month, UTC), upgrade/add a Pro key
(no `:fx` -> routed to api.deepl.com), or use another key.

translate.js CHANGED THIS CHAT (tools/translate.js) — additive only:

- NEW preflight quota check: before a real run it GETs /v2/usage, prints
  "quota : <used> / <limit> used (<remaining> remaining; this slug ≈ N chars)",
  and ABORTS (exit 6) IF remaining <= 0 OR the slug's estimated source cost
  exceeds remaining. Override with --no-usage-check. A failed probe is
  best-effort (warns, continues) — it never blocks translation.
- NEW --usage flag: prints used/limit/remaining for the key in use and exits
  (no --lang needed).
- Endpoint selection UNCHANGED (`:fx` -> free host). g1 behavior, tag
  invariance, structure guard, and per-field translation UNCHANGED.
- Verified (mocked fetch): zero-remaining -> exit 6 (no translate call);
  low-remaining (500 < ~795) -> exit 6; --no-usage-check -> proceeds. node
  --check OK; test-integrity INTEGRITY OK.

CORRECTED 11b-b PROCEDURE (the earlier "translate.js --lang fa" was WRONG):
`translate.js` is a SINGLE-SLUG tool (DEFAULT_SLUG="update"); there is NO
all-slugs mode. Translate PER SLUG. From apps/blog:
export DEEPL_API_KEY=...
node tools/translate.js --usage # check quota FIRST
for slug in $(ls content/en/ | sed 's/\.json$//'); do
[ "$slug" = "a-contemporary-history-of-the-muslim-world-11-afghanistan-3" ] && continue # pilot done
[ -f "content/fa/$slug.json" ] && { echo "SKIP (done): $slug"; continue; }
      echo "=== fa: $slug ==="; node tools/translate.js --lang fa --slug "$slug" || { echo "FAILED: $slug"; break; }
done
node tools/generate-index.js && node tools/test-integrity.js
Then th, then ar (one language per chat). translate.js copies `src` VERBATIM
from EN, so new translations inherit the LOCAL src automatically.

Files created/modified (exact paths)

- apps/blog/tools/localize-images.js (NEW; download + dedup + image-path rewrite tool; workstream A)
- apps/blog/assets/img/posts/<slug>/<YYYY>/<MM>/<basename> (NEW; the local image store; 330 files, 74M)
- apps/blog/content/en/\*.json (MOD; 25 of 26 files — image refs rewritten to LOCAL paths only; src path bytes ONLY)
- apps/blog/content/fa|th|ar/a-contemporary-history-of-the-muslim-world-11-afghanistan-3.json (MOD; 3 pilot translations — src re-synced to local paths ONLY; text byte-identical)
- apps/blog/tools/milestones/11b.md (MOD; parameters RESOLVED + implementation record)
- apps/blog/tools/translate.js (MOD; ADDITIVE — preflight /v2/usage quota check,
  abort exit 6 on exhausted/shortfall, new --usage and --no-usage-check flags;
  g1 + transport behavior otherwise UNCHANGED)
- apps/blog/HANDOFF-11b.md (NEW; this file)

Frozen decisions made in this chat (also in tools/milestones/11b.md)

- D-11b-1 (P1, AMENDED): local store = assets/img/posts/<slug>/<YYYY>/<MM>/<basename>.
  The WordPress uploads YYYY/MM subpath is PRESERVED. RATIONALE: a basename
  collision WITHIN one slug would otherwise SILENTLY OVERWRITE a distinct image
  (part-6: vlcsnap-2016-05-31-15h12m04s113.png under BOTH 2016/05 and 2016/06).
  Verified: 330 distinct files for 330 distinct source keys.
- D-11b-2 (P2): strip the `?w=<NNN>` resize hint; store the FULL-SIZE original.
- D-11b-3 (P3): dedup key = FULL source path (host+pathname, query excluded).
  2 keys are referenced by two different posts (yemen1.gif: part-12+part-13;
  etot.png: part-19+jews-in-palestine) and share ONE local file.
- D-11b-4 (P4): tool is IDEMPOTENT; --dry-run writes nothing. (Verified.)
- D-11b-5 (P5): alt-text DEFERRED again — renderer.js UNTOUCHED. The "Blog image"
  placeholder remains for the 182 caption-less image blocks.
- D-11b-6 (P6, RESOLVED): the 3 committed 11a pilot translations' src is
  RE-SYNCED to the local store via the SAME tool (`--lang <L> --slug <pilot>`),
  NOT by re-calling DeepL. Mechanism (i'): deterministic, offline, src-only,
  text byte-identical, no API cost. Equivalent end state to P6 option (i).
- D-11b-7 (P7): the 17 external images (6 hosts) are formally EXEMPT (stay
  remote). Verified unchanged post-migration.
- D-11b-8 (P8): 11b SPLIT into 11b-a (images) + 11b-b (translation batch).
- D-11b-9 (P9): licensing/attribution HUMAN GATE SIGNED OFF this chat; the real
  migration was authorized (`--yes`). The tool REFUSES a real run without --yes
  (exit 3); --dry-run is allowed without --yes.
- D-11b-10 (P10=b, NEW): the tool ALSO rewrites the image-file attributes
  `data-orig-file` / `data-large-file` (WP attachment original/large image URLs
  on the `contents` table's inline <img> tags), so NO remote IMAGE url remains
  anywhere in content/en. Non-image links (`href`, `data-permalink`) are NEVER
  touched. (This AMENDS the milestone's original "rewrite src only".)
- D-11b-11: test-checklist item 8 CORRECTED. The original "grep
  twolegsbadblog == 0" is UNACHIEVABLE and WRONG: the `contents` post's table
  carries 86 legitimate NON-IMAGE article links (64 href + 22 data-permalink,
  post permalinks) that stay remote by design. Corrected acceptance = "0 remote
  IMAGE urls + 17 external".

MEASURED FACTS (verified, not assumed)

- EN = 26 files. Image refs of all kinds = 349: 326 `image` BLOCKS + 23 inline
  `<img>` (ALL 23 live inside ONE block: the `contents` post's `table` content
  HTML) + the data-\* attrs on those inline tags.
- Media-file URL split: 332 twolegsbadblog.wordpress.com (IN SCOPE) + 17
  external (6 hosts, stay remote). Distinct in-scope KEYS (host+pathname) = 330.
- WP shape uniform: /wp-content/uploads/YYYY/MM/<file> (37 YYYY/MM buckets).
  298 of 309 block src carry `?w=`; all pilot translation srcs carry `?w=660`.
- The `contents` table also carries 37 non-image remote `src` values that are
  YOUTUBE EMBED IFRAMES (www.youtube.com/embed/...) — video, NOT images; left
  remote (correct).

FINAL CENSUS (post-migration, verified across content/en)

- LOCAL asset refs: 376 (= 309 block + 67 inline)
- IN-SCOPE remote remaining: 0 (acceptance: must be 0) PASS
- EXTERNAL remote (kept): 17 (acceptance: must be 17) PASS
- Non-image remote (youtube): 37 (untouched by design)
- Non-image article links kept: 86 (64 href + 22 data-permalink)

Migration report (--report, lang=en)

    EN files rewritten:     25
    Block src rewritten:    309
    Inline <img> rewritten: 67   (23 <img src> + 22 data-orig-file + 22 data-large-file)
    Downloaded new:         330
    Already stored:         0
    Unique local files:     330
    External refs (kept):   17
    Broken local refs:      0

Idempotence / non-regression proof

- 2nd real run: 0 rewritten, 0 downloaded (no-op). PASS.
- content/en diffs are IMAGE-PATH-BYTES ONLY (verified: src-only hunks; JSON
  re-serialized 2-space indent + trailing newline, unchanged formatting).
- Pilot translation diffs are src-ONLY (text byte-identical).
- renderer.js / router.js / nav.js / style.css / import-post.js / generate-index.js
  / test-integrity.js: UNTOUCHED.
- node --check tools/localize-images.js -> exit 0. All 26 EN + 3 translations
  JSON parse. test-integrity.js -> INTEGRITY OK.
- Image magic bytes spot-checked (PNG 89504e47...); store = 330 files / 74M.

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))

LOCKED_DECISIONS_SHA256=af9e5595d9e1cf48e388229c544145bb7dfd02180cb1be44bbd12663ca45b1f3
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=bba559c16b18022717bb7e65d66c07bd908d66542ec8b9b6a6bdfe73125f7392
FILE_TREE_SHA256=3239735977778b3840630a547e3b017b773ca342a249d78d3bbd4a7067b7504b (AFTER staging the full 11b-a + 11b-b-partial set; captured in each commit body — see COMMIT RECORD above)
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the commit-message
body, NOT here. FILE_TREE_SHA256 was captured AFTER staging each commit's set
(11b-a = 72cfab37…; 11b-b partial = 32397359…).

Test checklist result (pass/fail per item)

1. node --check tools/localize-images.js -> exit 0: PASS
2. --dry-run prints plan, writes nothing (tree clean): PASS
3. real run -> every in-scope ref has a local file; broken local refs = 0: PASS
4. external 17 refs (6 hosts) UNCHANGED (still remote): PASS
5. dedup: same-path pairs -> 1 file; within-slug basename collision -> 2 DISTINCT
   files (part-6 2016/05 + 2016/06): PASS
6. idempotence: re-run -> no change: PASS
7. inline rewrites = 67 (23 src + 22 data-orig-file + 22 data-large-file): PASS
8. CORRECTED rewrite scope: 0 remote IMAGE urls + 17 external: PASS
9. P6 pilot re-sync (9 srcs x fa/th/ar; 0 downloads): PASS
10. Workstream B translate.js PER SLUG (single-slug tool) for 26 slugs x lang:
    PARTIAL — fa 23/26 COMMITTED (b3d4d25; quota exhausted, aborted free).
    th/ar still 1 pilot each. See the 11b-b PROGRESS section. translate.js
    preflight quota check added + verified (mocked).
11. generate-index.js after each batch: RUN -> 51 entries (26 en + 23 fa + 1 th
    - 1 ar) committed in b3d4d25. Re-run once fa is complete (3 slugs).
12. node tools/test-integrity.js -> INTEGRITY OK: PASS
13. Browser structural (local images load; 17 external load): PENDING HUMAN
14. node tools/hash-state.js -> FILE_TREE_SHA256 captured AFTER staging each
    commit: 11b-a 72cfab37…; 11b-b 32397359… (both in commit bodies).
15. git status --porcelain: working tree CLEAN after b3d4d25 (verified).

Reconciliation deviations (recorded, not hidden)

- P1 AMENDED: store path added the <YYYY>/<MM>/ segment (defect found in a
  sandbox dry-run; would have silently lost 1 image in part-6). Approved.
- P10=b applied: the tool rewrites data-orig-file/data-large-file too (this
  AMENDS the milestone's stated "src only"). Approved.
- Test item 8 CORRECTED (grep == 0 is impossible; 86 article links stay).
  Approved.
- P6 mechanism: used the SAME localize tool (--lang) to re-sync pilot src rather
  than re-running DeepL translate.js. Net effect identical to option (i);
  chosen because it is deterministic, offline, and cannot churn translated text.
  Approved ("recommendations approved").
- SPLIT confirmed (P8): this chat delivers 11b-a; 11b-b is a separate batch.

Files committed (EXECUTED — see COMMIT RECORD above)

- 11b-a (a1a5b82): tools/localize-images.js; tools/milestones/11b.md;
  HANDOFF-11b.md; assets/img/posts/\*_ (330 files); content/en/_.json (25);
  content/{fa,th,ar}/a-contemporary-history-of-the-muslim-world-11-afghanistan-3.json
  (3 pilot, src-only); tools/translate.js (preflight); tools/ROADMAP.md;
  HANDOFF-CURRENT.txt.
- 11b-b partial (b3d4d25): content/fa/\*.json (22 NEW + the pilot = 23);
  assets/data/feed.json (regenerated; 51 entries).

NOT committed (gitignored): apps/blog/tools/.cache/localize-images/ (download
cache; covered by the tools/.cache/ ignore rule — verified).

Blocked reason (only for 11b-b)

- 11b-b blocked on DEEPL_API_KEY QUOTA (env-only key; never shipped). As of the
  first 11b-b pass: fa 23/26 done; th 0; ar 0; the free key's account is at
  1,000,000 / 1,000,000 (/v2/usage authoritative — NOT the web page). No code
  fix possible: wait for the monthly reset, upgrade/add a Pro key, or use
  another key.
- CORRECTED command (the earlier "--lang fa" alone is WRONG — translate.js is
  single-slug, no all-slugs mode). Per-slug loop (from apps/blog):
  node tools/translate.js --usage # 1) check quota
  for slug in $(ls content/en/ | sed 's/\.json$//'); do
  [ "$slug" = "a-contemporary-history-of-the-muslim-world-11-afghanistan-3" ] && continue
  [ -f "content/fa/$slug.json" ] && continue
  node tools/translate.js --lang fa --slug "$slug" || break
  done
  node tools/generate-index.js && node tools/test-integrity.js
  one language per chat (P8). translate.js copies image `src` VERBATIM from EN,
  so NEW translations automatically carry the LOCAL src (EN is localized).
  No extra src-reconciliation needed for 11b-b.
- NEW: translate.js now preflights /v2/usage and ABORTS (exit 6) when the quota
  is exhausted or the slug won't fit — so a batch no longer dies mid-way on an
  opaque 456. Run `node tools/translate.js --usage` to see the real number.

Known issues / TODOs

- The 17 EXTERNAL images remain REMOTE by decision (D-11b-7). Seeing remote src
  for upload.wikimedia.org / i0.wp.com / i.guim.co.uk /
  muwahhidmedia.files.wordpress.com / c2.staticflickr.com /
  s-media-cache-ak0.pinimg.com is NOT a regression.
- 86 non-image twolegsbadblog ARTICLE links (href + data-permalink) remain remote
  by design (post permalinks). NOT a regression.
- 37 www.youtube.com/embed iframe srcs remain remote by design (video).
- The 182 caption-less image blocks keep alt="Blog image" (P5 deferred).
- Non-batch slugs have NO non-EN file; fa/th/ar readers get the EN fallback (D3)
  until 11b-b lands. Intended interim state.
- L-010 (feed-excerpt HTML leak for part-22) remains deferred.
- C1b-18 series ordering + 10b/10c list & post presentation frozen; 11a post
  header (bare lang code) frozen.
- STRAY 0-BYTE repo-root file (non-printable name): NOT milestone work; exclude
  from staging / `find "$(git rev-parse --show-toplevel)" -maxdepth 1 -type f -size 0 -delete`.

Assumptions the next chat may rely on

- content/en/\*.json image refs (block src + inline image-file attrs) now point
  to local assets/img/posts/<slug>/<YYYY>/<MM>/<basename>; the store is complete
  (330 files) and committed.
- translate.js copies `src` verbatim from EN; therefore any NEW translation of an
  already-localized EN post inherits the LOCAL src automatically.
- The 3 pilot translations are already src-synced (no action needed).
- The store is CONTENT (committed), not cache; the cache dir is gitignored.
- The seam (import-post.js) is frozen through D-Tool-29; 11b-a changed NO seam
  and NO renderer/router/nav/CSS.
- HANDOFF-CURRENT.txt -> HANDOFF-11b.md (DONE; committed in a1a5b82).

Open warnings (count + links only)

1. tools/\*.md whitespace may not survive chat copy; anchor edits from `cat -A`. (carried)
2. Edit splice pitfall: verify POSITIONALLY, not by substring. (carried)
3. FILENAME COLLISION: B1 vs B1a. (carried)
4. hash-state.js FILE_TREE_SHA256 capture rule: capture AFTER staging. (carried)
5. STYLE.CSS write verification: re-read from disk after every write. (carried from 10c)
6. ROADMAP EDIT NO-OP: treat "no tool output" as a NO-OP; confirm each edit with
   a narrow `grep -c`; avoid full-file re-reads of the large ROADMAP. (carried)
7. P9 HUMAN GATE: localize-images.js REFUSES a real run without `--yes`. (NEW)
8. STORE PATH CONTENTION: two distinct uploads may share a basename within a
   slug; ALWAYS keep the <YYYY>/<MM>/ segment. (NEW)
