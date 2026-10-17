# NEW-CHAT STARTER — TRANSLATION TRACK (11b-b)

Copy the block below verbatim into a NEW chat to resume translations.

---------------------------------------------------------------------

You are continuing the Zabon Blog project. The current, non-translation
milestone is DONE (11-language-persist: language-choice persistence).
The task now is the TRANSLATION BATCH (milestone 11b-b).

FIRST, read these files before doing anything:
- apps/blog/translation-pending.md   (the full resume instructions — READ IT)
- apps/blog/tools/milestones/11b.md  (the milestone parameters)
- apps/blog/tools/milestones/11-language-persist.md (current milestone, DONE)

STATE: content/en = 26 files (the source set). content/fa = 23/26 done;
content/th = 1 (pilot only); content/ar = 1 (pilot only). The blocker is DeepL
QUOTA (free key at 1,000,000/1,000,000 — /v2/usage is AUTHORITATIVE, NOT the
web page). Resolution: wait for the monthly reset, or upgrade/add a Pro key, or
use another key.

WORK THIS CHAT: ONE LANGUAGE ONLY (fa to finish its 3 remaining slugs; if fa is
already complete, do th; then ar in later chats — one language per chat).

PROCEDURE (translate.js is SINGLE-SLUG; there is NO all-slugs mode; do NOT run
"--lang fa" alone). From apps/blog:

    export DEEPL_API_KEY=...                 # env-only; never commit the key
    node tools/translate.js --usage          # 1) check quota FIRST
    # 2) per-slug loop (fa shown; the 3 remaining slugs):
    for slug in $(ls content/en/ | sed 's/\.json$//'); do
      [ "$slug" = "a-contemporary-history-of-the-muslim-world-11-afghanistan-3" ] && continue
      [ -f "content/fa/$slug.json" ] && { echo "SKIP (done): $slug"; continue; }
      echo "=== fa: $slug ==="
      node tools/translate.js --lang fa --slug "$slug" || { echo "FAILED: $slug"; break; }
    done
    # 3) regenerate + verify:
    node tools/generate-index.js && node tools/test-integrity.js

translate.js now PREFLIGHTS /v2/usage and ABORTS (exit 6) if the quota is
exhausted or the slug won't fit (override: --no-usage-check). translate.js
copies image `src` VERBATIM from EN, so new translations inherit the LOCAL src
automatically — do NOT re-reconcile images.

RULES:
- One language per chat (fa -> th -> ar).
- Regenerate feed.json + run test-integrity after each language batch.
- The extraction seam (import-post.js) is FROZEN through D-Tool-29; do not touch.
- Bootstrap by reading the files above; do NOT improvise the workflow.
- At the end, commit with the repo's convention ("zabon/blog: ..." prefix) and
  update apps/blog/HANDOFF-CURRENT.txt + apps/blog/translation-pending.md.

Begin by reading apps/blog/translation-pending.md and reporting the current
quota (node tools/translate.js --usage) BEFORE translating anything.

---------------------------------------------------------------------
