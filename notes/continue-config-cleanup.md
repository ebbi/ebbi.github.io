# Continue extension config — dedup + secret leak (recorded for future chats)

Date: 2026
Context: VS Code + Continue extension v2.0.0 (`continue.continue`).

## What was wrong

1. DUPLICATE CONFIG. The models block existed in TWO byte-identical
   files (both 942 bytes, both git-tracked):
   - .continue/config.yaml (KEPT — canonical)
   - .continue/agents/continue.yaml (DELETED — redundant duplicate)
     A third path mentioned in chat, .continue/agents/config.yaml, does
     NOT exist on disk.

2. LEAKED API KEY IN GIT HISTORY. A literal OpenRouter key was committed
   in the bootstrap commit bcd0812 ("zabon/blog: Chat 00: bootstrap"),
   inside .continue/config.yaml:
   ***REMOVED-OPENROUTER-KEY-PREFIX***… (full value in bcd0812; intentionally NOT
   reproduced in full here)
   Removing it from the working tree does NOT remove it from history.

3. INVALID PLACEHOLDER. The working-tree file had
   `apiKey: move-to-env`, which is not valid Continue syntax and fails
   auth. Continue expects either a literal key or a secret reference:
   apiKey: ${{ secrets.OPENROUTER_API_KEY }}

4. TRACKED + SECRET-BEARING = the root cause. .continue/config.yaml was
   git-tracked while allowed to hold a literal key. That combination is
   what produced the bcd0812 leak.

## Decision taken: option B (untrack the config; inline the key safely)

- .continue/config.yaml is now UNTRACKED (`git rm --cached`) but KEPT ON
  DISK, and added to .gitignore (with .continue/.env). Continue keeps
  working; git no longer tracks it.
- The key is supplied INLINE in the (now-ignored) config.yaml:
  apiKey: sk-or-v1-<rotated key>
  Chosen over `${{ secrets.OPENROUTER_API_KEY }}` because Continue 2.0.0's
  interpolation source is UNDOCUMENTED in the config.yaml reference — the
  docs show the `${{ secrets.X }}` form but never say where `secrets` is
  defined/resolved. Untracked-inline is guaranteed to work; the ref form
  is not. (Option A "keep tracked, secret-ref only" and env-var
  interpolation were considered and not chosen.)

## Keys: ONE, not three

OpenRouter keys are ACCOUNT-level, not model-level. A single key
authenticates the whole account and can call every model. There is no
"key per model" binding — do NOT create three keys for three models.
Multiple keys are only for accounting isolation (separate billing /
spend limits), which is not needed here.

- ONE key, created fresh on rotation, inlined into config.yaml.

## Model slugs (VERIFIED against the user's OpenRouter account, 2026)

- `qwen/Qwen3.5-27B` — REAL and in use (OpenRouter billing confirms).
  CORRECTION: an earlier version of this note claimed this slug was "not
  a known OpenRouter model ID and would 404". That was WRONG — it was
  based on stale public knowledge. The user's account lists it and bills
  against it. Retracted.
- Also available to the user:
  qwen/qwen3.8-max-0902 2.4T MoE, 1M-token context,
  post-trained for coding + agentic
  work, tool calling + structured
  output. RECOMMENDED for the heavy
  C1b migration milestones (long
  context, multi-step tool use).
  qwen/qwen3.8-27b open-weight dense VLM; lighter/cheaper.
  deepseek/deepseek-v4-pro-0813 large MoE, GA.
  (The user's git branch is `blog/deepseek` — a BRANCH name, not a model
  choice. "I thought I was using DeepSeek" was most likely the branch
  name, not the served model.)

## Actions taken / to take

- [x] Deleted the duplicate: `git rm .continue/agents/continue.yaml`
- [x] Untracked the config: `git rm --cached .continue/config.yaml`
      (file remains on disk)
- [x] Added `.continue/config.yaml` + `.continue/.env` to .gitignore
- [ ] ROTATE the leaked OpenRouter key at openrouter.ai. REQUIRED — the
      key is in git history and must be treated as compromised. Rotation
      (= create new key + delete the old one) is sufficient; history
      rewrite (git filter-repo / BFG) is NOT required unless the repo
      becomes shared/public.
- [ ] Inline the ROTATED key into the untracked .continue/config.yaml.

## .gitignore prefix bug (FOUND then FIXED while doing this)

The "Zabon Blog App Specific" block was prefixed `zabon/apps/blog/…`, but
the repo ROOT is already `zabon/`. Git matches patterns relative to the

repo root, so those five rules matched NOTHING:
zabon/apps/blog/node_modules/
zabon/apps/blog/.env
zabon/apps/blog/tools/reports/\*.json
zabon/apps/blog/PARTIAL.md
zabon/apps/blog/notes/

FIXED: reprefixed to `apps/blog/…` (no `zabon/`).

IMPACT (narrower than first assumed — verified by inspection):

- There is a SEPARATE, tracked nested file apps/blog/.gitignore (repaired
  by C1-tool-cleanup / W7) that already ignores `notes/` and the tool
  caches. So apps/blog/notes/ and the caches were NEVER actually exposed;
  the root-level rules for those were merely redundant.
- The ONE genuinely-broken target was apps/blog/PARTIAL.md — the root
  rule was dead and nothing else covered it, so it was being TRACKED
  despite the intent. Now UNTRACKED (`git rm --cached`), kept on disk.
- CAVEAT: a dead/misrooted .gitignore rule does NOT untrack an
  already-tracked file anyway — `git rm --cached` is required. Same
  lesson as the config leak.

- [x] Untracked apps/blog/PARTIAL.md (`git rm --cached`; file on disk).
- [x] Reprefixed the five rules to apps/blog/… .
      Also noted: apps/blog/notes/config.yaml is a THIRD stray 942-byte copy of
      the Continue config (untracked, covered by the nested ignore). Left for
      the user.

## Agent approval behaviour (related, unresolved)

Continue 2.0.0 has NO approval/permissions block in config.yaml (verified
against the config.yaml reference: top-level keys are name, version,
schema, models, context, rules, prompts, docs, mcpServers, data ONLY) and
the 8 VS Code Settings entries are autocomplete/remote-config only. The
per-operation Accept/Reject gate is a runtime control in the Agent panel,
not a file setting. Desired policy (writes auto, shell/terminal manual)
is therefore a PANEL-level choice, not a config edit.

## Reference

- Continue config.yaml reference: https://docs.continue.dev/reference
