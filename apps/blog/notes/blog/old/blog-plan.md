# Complete Plan — Native IDE (Continue + Qwen) Workflow

This is the revised operating plan for developing the self-contained Zabon Blog App using a native VS Code extension (Continue) powered by Qwen.

## What this plan changes

- **Removes**: `tools/chatbridge.js`, virtual file markers (`<<<ZABON...>>>`), `tools/state.json` upload modes, and the 5-file bundle limit.
- **Keeps**: `tools/LOCKED_DECISIONS.txt`, `tools/CONTEXT.md`, the milestone sequence, strict testing, and handoff rules.
- **Adds**: Native IDE `@` mentions, direct file application via IDE diffs, and integrated terminal command execution.

## Directory Layout

- **REPO_ROOT**: `<repo-root>/zabon`
- **APP_ROOT**: `<repo-root>/zabon/apps/blog`
  All blog-specific paths (`tools/`, `content/`, `assets/`) are relative to **APP_ROOT**.
  All git operations run from **REPO_ROOT**. Commit messages are prefixed `zabon/blog:`.

## Step 1 — Git Setup

Run from the REPO_ROOT in your VS Code terminal:

```bash
git checkout develop
git pull staging develop
git checkout -b blog/qwen
```

## Step 2 — Create Directories

Run from REPO_ROOT:

```bash
mkdir -p zabon/apps/blog/tools/milestones \
         zabon/apps/blog/tools/tests \
         zabon/apps/blog/tools/reports/archive \
         zabon/apps/blog/content/en \
         zabon/apps/blog/content/fa \
         zabon/apps/blog/content/ar \
         zabon/apps/blog/content/th \
         zabon/apps/blog/assets/css \
         zabon/apps/blog/assets/js \
         zabon/apps/blog/assets/img \
         zabon/apps/blog/assets/data
touch zabon/apps/blog/tools/.gitkeep \
      zabon/apps/blog/assets/img/.gitkeep \
      zabon/apps/blog/assets/data/.gitkeep
```

## Step 3 — Initialize Core Tooling Files

Create the following files inside zabon/apps/blog/tools/:

1.  CONTEXT.md (Defines the native IDE workflow rules)
2.  LOCKED_DECISIONS.txt (Version 3, updated for native IDE workflow)
3.  Update root .gitignore to include zabon/apps/blog/node_modules/ and zabon/apps/blog/.env

## Step 4 — Start Chat 0 in Continue

1.  Open the Continue chat panel in VS Code.
2.  In the input box, type @ and select zabon/apps/blog/tools/CONTEXT.md.
3.  Type @ and select zabon/apps/blog/tools/LOCKED_DECISIONS.txt.
4.  Type @ and select zabon/apps/blog/tools/milestones/00.md.
5.  Send the prompt: "I have attached the core rules and Milestone 00. Please read them and provide the SCOPE CONFIRMATION."

## Step 5 — The IDE Development Loop

For every milestone, follow this loop:

1.  Scope Approval: Review the AI's SCOPE CONFIRMATION and reply approve.
2.  Generation & Application: The AI will generate code. Use the "Apply" or "Accept" buttons in the Continue diff view to write the files directly to your local disk.
3.  Terminal Commands: When the AI asks you to run a test (e.g., node zabon/apps/blog/tools/test-integrity.js), run it in the VS Code integrated terminal and paste the output back into the chat.
4.  Human Observations: For visual/browser tests, simply type the results directly into the chat.
5.  Handoff: When the milestone is complete, ask the AI to generate HANDOFF.md. Save it to zabon/apps/blog/HANDOFF.md.

Step 6 — Commit and Advance

1.  Use the VS Code Source Control tab (or terminal) to commit your changes:

```bash
git add .
git commit -m "zabon/blog: Chat <chat_id>: <title>"
```

2. Start the next milestone by typing @ and selecting zabon/apps/blog/HANDOFF.md, zabon/apps/blog/tools/CONTEXT.md, and zabon/apps/blog/tools/milestones/<next_id>.md.

## Step 7 — Merge to Staging

Once all milestones are complete and tested locally:

```bash
git checkout develop
git merge blog/qwen
git push staging develop
```

## Chat Sequence

The chat IDs remain exactly as defined in the original plan:
00, 01, 02, 03, 04, 05a, 05b, 06, 07, 08, 09, 10, 11, 12a, 12b, 13a, 13b, 13c, 14a, 14b, 14c.

---

### Your Next Step (No Action Required Yet)

Please review the folder structure and the revised plan above.

**Questions for you to consider:**

1. Does the `zabon/apps/blog/` self-contained structure look correct to you?
2. Are there any specific rules from the old `LOCKED_DECISIONS.txt` that you feel are missing from this simplified version?
3. Are you ready to proceed with creating these files, or would you like to tweak the plan further?

Take your time to study it. I am ready to adjust it based on your feedback before we write a single line of code.
