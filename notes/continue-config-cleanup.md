# Continue extension config — dedup + secret leak (recorded for future chats)

Date: 2026
Context: VS Code + Continue extension v2.0.0 (`continue.continue`).

## CRITICAL: the LIVE config is ~/.continue/config.yaml, NOT the repo one

Discovered LATE in this work (after the workspace cleanup was already done):
Continue 2.x reads the HOME config `~/.continue/config.yaml`. The workspace
file `zabon/.continue/config.yaml` (which all of the cleanup below touched)
was NOT the one in use — it may never have been loaded. Correcting the
record here so the next chat is not misled:

- LIVE file: `~/.continue/config.yaml` (perms -rw-------; modified Sep 27).
  Its models at discovery:
  1. "DeepSeek Coder" provider: deepseek, model: deepseek-coder,
     apiKey: sk-868af… <-- LEAKED (see below)
  2. "Qwen: Qwen3.5-27B" provider: openrouter, model: qwen/qwen3.5-27b,
     apiKey: sk-or-v1-… (marked "to be changed. TODO")
     This is why the user "thought they were using DeepSeek" — the LIVE home
     config has a DeepSeek entry, and the active model is the one SELECTED in
     the panel dropdown (see "How Continue picks a model" below).

- The workspace config zabon/.continue/config.yaml was RENAMED by the user
  to del-config.yaml and then DELETED; the entire workspace .continue/ dir
  (config, agents/, del-config.yaml) is now removed and the tree is clean.

### SECOND LEAKED KEY (home config)

sk-868af… — a DeepSeek key in ~/.continue/config.yaml. It is NOT in any git
repo (home dir is outside zabon), so there is NO git-history leak for it.
BUT it appears in Continue's own session/transcript files
(~/.continue/sessions/_.json, ~/.continue/dev_data/0.2.0/_.jsonl) and was
shown in chat. ROTATE it at platform.deepseek.com. Same for the OpenRouter
key. Treat both as compromised.

### Which config loses the secret argument

The ${{ secrets.OPENROUTER_API_KEY }} indirection only helps if a file
might be COMMITTED to git. The home config is outside any repo and is never
committed, so the indirection protects against nothing there and risks a
broken resolve (the resolution source is undocumented in 2.0.0).
RECOMMENDATION for the home config: use the LITERAL rotated key, not the
${{ secrets.… }} form.

## How Continue picks a model (answers "which of the 3?")

The active chat/agent model is the one SELECTED in the model-picker
dropdown in the Continue panel — not a first-model-wins rule. The `roles`
array (chat/edit/apply/autocomplete) says which model MAY serve which
function; with no `roles` set, each defaults to [chat, edit, apply,
summarize]. If several models can serve `chat`, the dropdown selection
decides. NO model in either config has the `autocomplete` role, so tab
autocomplete has no model to call.

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

## Decision taken: untrack the WORKSPACE config, then delete it

SUPERSEDED for the live setup by the CRITICAL section above (the live
config is the HOME one). Kept for the record of what was done to the repo:

- .continue/config.yaml was UNTRACKED (`git rm --cached`) and added to
  .gitignore (with .continue/.env).
- It has since been RENAMED (del-config.yaml) and DELETED entirely, along
  with the whole workspace .continue/ dir. Conclusion: the workspace config
  is gone; the live config is ~/.continue/config.yaml.
- Rationale for INLINE-literal over `${{ secrets.… }}`: Continue 2.0.0's
  interpolation source is UNDOCUMENTED in the config.yaml reference — the
  docs show the `${{ secrets.X }}` form but never say where `secrets` is
  defined/resolved. A literal in a non-repo file is guaranteed to work; the
  ref form is not.

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
  NOTE: the "I thought I was using DeepSeek" question is now EXPLAINED —
  the LIVE home config (~/.continue/config.yaml) contains a real "DeepSeek
  Coder" entry (provider: deepseek). DeepSeek was genuinely configured;
  the git branch `blog/deepseek` is coincidental. See the CRITICAL section.

## Actions taken / to take

- [x] Deleted the duplicate: `git rm .continue/agents/continue.yaml`
- [x] Untracked the config: `git rm --cached .continue/config.yaml`
- [x] Added `.continue/config.yaml` + `.continue/.env` to .gitignore
- [x] Renamed workspace config to del-config.yaml, then DELETED it (and
      the empty .continue/agents/, .continue/) — whole workspace config
      dir gone; tree clean. (Commit c7cd51c untracked config + PARTIAL.md;
      the later deletion of the working-tree files is uncommitted local
      housekeeping, no git effect since they were already ignored.)
- [x] ROTATE the OPENROUTER key (sk-or-v1-…) at openrouter.ai. It IS in
      git history (commit bcd0812) -> treated as compromised. Rotation
      (= create new + delete old) was enough; no history rewrite needed
      unless the repo becomes shared/public. DONE (user, 2026).
- [x] ROTATE the DEEPSEEK key (sk-868af…) at platform.deepseek.com. NOT
      in git, but exposed in chat + Continue session/transcript files.
      DONE (user, 2026).
- [x] Put the ROTATED OpenRouter key as a LITERAL into the LIVE/home
      config `~/.continue/config.yaml` (not the workspace one, which no
      longer exists). The home config is outside git, so literal is safe
      and avoids the undocumented secret-resolution path. DONE (user).
- [ ] Select the desired model in the Continue panel dropdown (that is
      what chooses the active model; see the section above).
- [ ] Optional: apps/blog/notes/config.yaml is a THIRD stray 942-byte copy
      of the Continue config (untracked, covered by the nested ignore).

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
      (Stray-copy note consolidated into the Actions list above.)

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
