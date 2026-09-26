Here is the complete, updated **Standard Operating Procedure (SOP)** for executing your milestones in the new **Native IDE (Continue + Qwen)** setup.

This completely replaces Steps 12 through 18 of your old `blog-plan.md`. You no longer need `chatbridge.js`, virtual file markers, or bundle uploads.

---

### The Core Philosophy of the New Setup

1. **No Bundling:** You do not run `node tools/chatbridge.js prep`. You simply `@` mention the files you want the AI to read.
2. **Direct Application:** When the AI writes code, you click **"Apply"** or **"Accept"** in the Continue diff view to write it directly to your disk.
3. **Terminal Execution:** When a test needs to run, you run it in the VS Code integrated terminal and paste the output back to the AI.
4. **Self-Contained Paths:** All blog tooling and content live inside `zabon/apps/blog/`. Git operations run from the repo root, and commits are prefixed with `zabon/blog:`.

---

### The Standard Milestone Loop

_Follow this exact loop for every single milestone (from Chat 00 to Chat 14c)._

#### Step 1: Ensure a Clean Git Tree

Before starting any chat, ensure your working directory is clean.

```bash
git status
# If dirty, commit or stash your work before proceeding.
```

#### Step 2: Start the Chat in Continue

Open the Continue chat panel in VS Code. In the chat input box, type the following prompt, using the `@` symbol to attach the necessary context files.

**Copy and paste this exact prompt:**

> @zabon/apps/blog/tools/CONTEXT.md @zabon/apps/blog/tools/LOCKED_DECISIONS.txt @zabon/apps/blog/tools/milestones/[INSERT_CHAT_ID].md
>
> I am starting Milestone [INSERT_CHAT_ID]. Please read the attached files.
> If this is not Chat 00, also read @zabon/apps/blog/HANDOFF.md.
>
> Provide the SCOPE CONFIRMATION for this milestone.

_(Note: Replace `[INSERT_CHAT_ID]` with `00`, `01`, `05a`, etc. For Chat 00, omit the `HANDOFF.md` mention)._

#### Step 3: Approve the Scope

The AI will analyze the milestone and reply with a **SCOPE CONFIRMATION** block listing the files it will create, modify, and the tests it will run.

- Review the list.
- If it looks correct, reply exactly with: **`approve`**
- If it looks wrong, reply with your corrections.

#### Step 4: Generate and Apply Code

Once approved, the AI will begin generating the code for the milestone.

- As it outputs code blocks, look for the **"Apply"** or **"Accept"** button provided by the Continue extension in the chat UI.
- Click it to write the files directly to your `zabon/apps/blog/` directory.
- _Rule:_ The AI must not produce files outside the scope of the current milestone.

#### Step 5: Run Tests and Integrity Checks

The AI will ask you to run tests to verify the work. It will provide the exact command.

- Open the **VS Code Integrated Terminal** (`Ctrl+~`).
- Run the command from the **repo root**. For example:
  ```bash
  node zabon/apps/blog/tools/test-integrity.js
  ```
- Copy the terminal output and paste it back into the Continue chat.
- _Rule:_ If the integrity check fails, **stop**. Do not let the AI guess or manually edit hashes. Ask it to fix the underlying code and re-run the test.

#### Step 6: Record Human Observations (If applicable)

If the milestone requires visual, RTL, or browser checks, you do not need a CLI tool to record them. Simply type your observations directly into the chat:

> "Human observation: The Persian post page is dir=rtl, typography appears correct, no clipped glyphs. Lighthouse mobile performance is 96."

#### Step 7: Generate the Handoff

Once all tests pass and the milestone is complete, prompt the AI:

> "The test checklist is complete. Please generate the HANDOFF.md file according to the canonical schema in CONTEXT.md."

- The AI will output the contents of `HANDOFF.md`.
- Click **"Apply"** to save it to `zabon/apps/blog/HANDOFF.md`.

#### Step 8: Commit to Git

Now that the milestone is complete and the handoff is saved, commit your work.

```bash
git add .
git commit -m "zabon/blog: Chat [INSERT_CHAT_ID]: [INSERT_TITLE]"
```

_(Example: `git commit -m "zabon/blog: Chat 00: bootstrap"`)_

#### Step 9: Start the Next Milestone

Go back to **Step 2**.

- Open a **New Chat** in Continue (to clear the context window).
- `@` mention `CONTEXT.md`, `LOCKED_DECISIONS.txt`, the _next_ milestone file, and the newly created `HANDOFF.md`.

---

### Handling Edge Cases in the New Setup

#### 1. The Context Window Gets Too Long

Because you are using a native IDE, you don't need to worry about the 5-file upload limit, but you _do_ need to watch the AI's context window.

- **Trigger:** If the AI starts forgetting earlier instructions, or if Continue warns you about context limits.
- **Action:** Stop the current chat. Save any unfinished work as `zabon/apps/blog/PARTIAL.md`. Open a **New Chat**, `@` mention `PARTIAL.md`, `CONTEXT.md`, and the current milestone file, and tell the AI to resume.

#### 2. Human Edits Outside the AI

If you manually edit a file (e.g., tweaking CSS or fixing a typo in content) without the AI doing it:

- **Action:** Tell the AI in the chat: _"I manually edited `zabon/apps/blog/assets/css/style.css` to fix a typo."_
- The AI will note this in the next `HANDOFF.md` and run `node zabon/apps/blog/tools/hash-state.js` to update the hashes.

#### 3. Missing Files or Errors

If the AI says it cannot find a file you `@` mentioned:

- **Action:** Check the path. Remember, all blog paths are relative to `zabon/apps/blog/`. Ensure the file actually exists on your disk before mentioning it.

---

### The Chat Sequence

You will repeat the loop above for exactly 21 chats, in this exact order:

**Phase 1: Foundation**

- `00` (Bootstrap)
- `01` (Fetcher)
- `02` (Parser)
- `03` (Renderer)
- `04` (Router)

**Phase 2: Features**

- `05a` (Feeds + Search Index)
- `05b` (Search UI)
- `06` (Navigation & Header)
- `07` (Footer & Global UI)
- `08` (Post List Page)
- `09` (Single Post Page)
- `10` (About / Static Pages)
- `11` (Translations & i18n UI)

**Phase 3: Polish & Edge Cases**

- `12a` (RTL & Typography - Persian/Arabic)
- `12b` (RTL & Typography - Thai/Myanmar)
- `13a` (Accessibility & Keyboard Nav)
- `13b` (Performance & Caching)
- `13c` (SEO & Meta Tags)
- `14a` (Final Content Integration)
- `14b` (Cross-browser Testing)
- `14c` (Final Sign-off & Staging Push)

---

### Summary of What You Can Delete

Because you are using this new setup, you can safely **delete or ignore** the following from your old plan:

- `tools/chatbridge.js` (Do not create it)
- `tools/state.json` (Do not create it)
- `tools/chat-upload/` directory
- `tools/chat-messages/` directory
- Any references to `paste-bundle-qwen5`
- The 53-line bootstrap manifest generation script

You only need `CONTEXT.md`, `LOCKED_DECISIONS.txt`, the `milestones/` folder, and your actual app code.

**Are you ready to create the `CONTEXT.md` and `LOCKED_DECISIONS.txt` files in your `zabon/apps/blog/tools/` directory and begin Chat 00?**
