It is important to clarify a key detail about the `blog-plan.md` you uploaded: **It references the 21 milestone files, but it does not actually contain their content.** The plan assumes those files already exist in your repository from a previous setup phase.

Since your `tools/milestones/` folder is currently empty, we need to create them.

### Why I am providing these in Batches

Generating 21 highly detailed milestone files—each containing strict file paths, exact test checklists, and locked-decision constraints—in a single response will exceed output limits and result in truncated or degraded instructions. To ensure the AI in Continue follows the strict `CONTEXT.md` rules perfectly, **I will provide them in logical batches.**

Below is the **Complete Roadmap** for all 21 milestones, followed by the **full, ready-to-paste content for Milestone 00 (Bootstrap)**.

Once you complete Chat 00 and commit, simply ask me for "Batch 2 (Milestones 01-04)", and we will proceed step-by-step.

---

### The 21-Milestone Roadmap

- **Phase 1: Foundation**
  - `00`: Bootstrap & Foundation (HTML shell, CSS variables, basic Router, Integrity script)
  - `01`: Content Fetcher (Node.js script to pull/cache WP JSON or local MD)
  - `02`: Block Parser (Converts JSON/MD to structured DOM blocks)
  - `03`: Renderer (Vanilla JS DOM builder for the block types)
  - `04`: Router (Hash-based routing for GitHub Pages, language detection)
- **Phase 2: Core Features**
  - `05a`: Feeds & Search Index (JSON generation for lists/search)
  - `05b`: Search UI (Client-side fuzzy search implementation)
  - `06`: Navigation & Header (Language switcher, RTL/LTR toggle)
  - `07`: Footer & Global UI (Copyright, links, offline fallback)
  - `08`: Post List Page (Feed rendering, pagination/infinite scroll)
  - `09`: Single Post Page (Article layout, block rendering, media)
  - `10`: About / Static Pages (Static content rendering)
  - `11`: Translations & i18n UI (Handling UI strings vs Content languages)
- **Phase 3: Polish & Edge Cases**
  - `12a`: RTL & Typography - Persian/Arabic (Font loading, dir=rtl, CSS logic)
  - `12b`: RTL & Typography - Thai/Myanmar (Line-height fixes, font stacking)
  - `13a`: Accessibility & Keyboard Nav (Focus traps, ARIA, screen reader)
  - `13b`: Performance & Caching (Service Worker basics, asset optimization)
  - `13c`: SEO & Meta Tags (Dynamic OG tags, JSON-LD, canonical URLs)
  - `14a`: Final Content Integration (Pilot post: Jews in Palestine before Israel)
  - `14b`: Cross-browser Testing (Safari, Firefox, mobile viewports)
  - `14c`: Final Sign-off & Staging Push (Final integrity, merge to develop)

---

### MILESTONE 00: Bootstrap & Foundation

_Create the file `zabon/apps/blog/tools/milestones/00.md` and paste the following content exactly._

```markdown
# Milestone 00: Bootstrap & Foundation

## Objective

Establish the self-contained blog app skeleton. Create the base HTML shell, foundational CSS variables (supporting LTR/RTL and multi-language typography), a basic hash-based router (required for GitHub Pages), and the foundational Node.js integrity testing scripts.

## Files to Create

1. `zabon/apps/blog/index.html`
2. `zabon/apps/blog/assets/css/style.css`
3. `zabon/apps/blog/assets/js/router.js`
4. `zabon/apps/blog/assets/js/app.js`
5. `zabon/apps/blog/tools/test-integrity.js`
6. `zabon/apps/blog/tools/hash-state.js`

## Files to Modify

- None. (This is the bootstrap milestone).

## Files I will NOT touch

- Any files outside `zabon/apps/blog/`.
- Root `.gitignore` (assumed already updated).

## Hard Constraints (from LOCKED_DECISIONS.txt)

- **Vanilla JS only.** No frameworks, no build steps (Webpack/Vite), no npm dependencies for the frontend.
- **GitHub Pages compatible.** Routing must be hash-based (`#/en/...`) to avoid 404s on page refresh.
- **Self-contained.** All paths in HTML/CSS/JS must be relative to `zabon/apps/blog/`.
- **Typography.** CSS must define base variables for `--dir`, `--font-family-primary`, and line-heights to accommodate RTL (fa, ar) and complex scripts (th, my).
- **Node 20 LTS.** Tooling scripts must use native Node 20 features (e.g., native `node:test` if applicable, or standard `fs`/`path`).

## Test Checklist

The milestone is NOT complete until all the following pass:

1. **File Tree Check**:
   - Run `ls zabon/apps/blog/index.html zabon/apps/blog/assets/css/style.css zabon/apps/blog/assets/js/router.js zabon/apps/blog/assets/js/app.js`
   - All files must exist.
2. **HTML Validity**:
   - Open `zabon/apps/blog/index.html` in a browser.
   - No console errors.
   - The `<html>` tag must dynamically or statically support `lang` and `dir` attributes.
3. **CSS Variables Check**:
   - Inspect `style.css`. It must contain `:root` variables for typography and directionality.
4. **Router Check**:
   - Load `index.html` in the browser.
   - The console should log the initial route parsed by `router.js`.
5. **Integrity Script Check**:
   - Run from REPO_ROOT: `node zabon/apps/blog/tools/test-integrity.js`
   - It must output `INTEGRITY OK` (or gracefully report that content hashes are MISSING, which is expected for Chat 00, but the script itself must not crash).

## Execution Instructions for the AI

1. Read `@zabon/apps/blog/tools/CONTEXT.md` and `@zabon/apps/blog/tools/LOCKED_DECISIONS.txt`.
2. Provide the **SCOPE CONFIRMATION** using the exact format defined in CONTEXT.md.
3. Wait for the user to reply `approve`.
4. Generate the code for the 6 files. Use exact file paths in markdown headers so the user can use the IDE "Apply" feature.
5. Instruct the user to run the Test Checklist commands in the VS Code terminal and paste the output.
6. Generate the `HANDOFF.md` file according to the canonical schema in CONTEXT.md.
```

---

### Your Next Steps

1. **Create the directory and file**:

   ```bash
   mkdir -p zabon/apps/blog/tools/milestones
   ```

   Save the markdown above as `zabon/apps/blog/tools/milestones/00.md`.

2. **Start Chat 0 in Continue**:
   Open the Continue chat panel and type:

   > @zabon/apps/blog/tools/CONTEXT.md @zabon/apps/blog/tools/LOCKED_DECISIONS.txt @zabon/apps/blog/tools/milestones/00.md
   >
   > I am starting Milestone 00. Please read the attached files and provide the SCOPE CONFIRMATION.

3. **Execute & Commit**:
   Follow the AI's instructions, apply the code diffs, run the tests, generate the Handoff, and commit:
   ```bash
   git add .
   git commit -m "zabon/blog: Chat 00: bootstrap"
   ```

**Once Chat 00 is successfully completed and committed, reply to me with: "Ready for Batch 2 (Milestones 01-04)"**, and I will generate the next set of milestone files for the Fetcher, Parser, Renderer, and Router.
