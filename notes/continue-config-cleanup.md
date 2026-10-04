# Continue extension config — dedup + secret leak (recorded for future chats)

Date: 2026
Context: VS Code + Continue extension v2.0.0 (`continue.continue`).

## What was wrong

1. DUPLICATE CONFIG. The models block existed in TWO byte-identical
   files (both 942 bytes, both git-tracked):
     - .continue/config.yaml                (KEPT — canonical)
     - .continue/agents/continue.yaml       (DELETED — redundant duplicate)
   A third path mentioned in chat, .continue/agents/config.yaml, does
   NOT exist on disk.

2. LEAKED API KEY IN GIT HISTORY. A literal OpenRouter key was committed
   in the bootstrap commit bcd0812 ("zabon/blog: Chat 00: bootstrap"),
   inside .continue/config.yaml:
     ***REMOVED-OPENROUTER-KEY-PREFIX***…  (full value in bcd0812; intentionally NOT
                         reproduced in full here)
   Removing it from the working tree does NOT remove it from history.

3. INVALID PLACEHOLDER. The working-tree file had
   `apiKey: move-to-env`, which is not valid Continue syntax and fails
   auth. Continue expects either a literal key or a secret reference:
     apiKey: ${{ secrets.OPENROUTER_API_KEY }}

## Actions taken / to take

- [x] Deleted the duplicate: `git rm .continue/agents/continue.yaml`
- [ ] Replace .continue/config.yaml contents with the secret-ref version
      (see below) — applied by the human (the file is blocked to the agent
      as a security concern, and it is where the secret lives).
- [ ] ROTATE the leaked OpenRouter key at openrouter.ai. REQUIRED — the
      key is in git history and must be treated as compromised. Rotation
      is sufficient; history rewrite (git filter-repo / BFG) is NOT
      required unless the repo becomes shared/public.
- [ ] Set the secret: Continue panel → model → API key, or environment
      variable OPENROUTER_API_KEY. Never inline the literal key.

## Canonical .continue/config.yaml (secret externalized)

    name: Zabon Blog Config
    version: 1.0.0
    schema: v1

    models:
      - name: <human-readable label>
        provider: openrouter
        model: <EXACT provider/model slug from openrouter.ai>
        apiKey: ${{ secrets.OPENROUTER_API_KEY }}
        roles:
          - chat
          - edit
          - apply
        defaultCompletionOptions:
          contextLength: 131072
          maxTokens: 8192
        capabilities:
          - tool_use

Note on `models: name:` — it is a FREE-FORM DISPLAY LABEL in Continue's
model picker. It need not match the model ID or any file name. The `model:`
field, by contrast, MUST be the exact slug OpenRouter publishes. The
original `qwen/Qwen3.5-27B` is not a known OpenRouter model ID and would
404 — verify the real slug before relying on it.

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
