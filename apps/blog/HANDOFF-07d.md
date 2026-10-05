HANDOFF — Chat 07d: CSS typography update (book-reader typography pass)
Status: complete
Current chat id: 07d
Current milestone: 07d
Completed milestones: 00,01,02,03,04,05a,05a-fix,05b-removal,W1,W1-fix,06,06b,07,08,09,C1a,C1-tool,C1-tool-p2,C1-model,C1-tool-cleanup,B1a,C1b-01..C1b-DONE,C1b-18,C1b-12..C1b-17,B1,10b,07b,TTS,TTS2,07d
Next chat id: 07c
Context windows used: 1

Files created/modified (exact paths)

- apps/blog/assets/css/style.css (MOD; additive. (a) ADDITIVE typographic
  tokens appended to :root: --font-body / --font-heading (= var(--font-body))
  / --font-mono / --measure / --font-size-base / --line-height-base /
  --rhythm / --space-1..--space-6. (b) the pre-existing hardcoded html,body
  font-family was RE-POINTED to var(--font-body) whose DEFAULT value is
  byte-identical to the removed inline stack (visual no-op until 07c
  re-points the family). (c) ONE additive "Milestone 07d — typography" block
  at EOF styling the reading column + long-form elements.)
- apps/blog/tools/ROADMAP.md (MOD; TTS2 -> Done appended; 07d -> Done
  appended with STATUS; Next marker -> 07c; 07d removed from Next)
- apps/blog/HANDOFF-07d.md (NEW; this file)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> HANDOFF-07d.md; also fixed
  the previous stray second newline so it is exactly ONE line)

Frozen decisions made in this chat

- D-07d-1: The typographic SYSTEM (measure, rhythm, base size/leading,
  heading scale, spacing scale, hyphenation) is defined ONCE in :root tokens
  and consumed by the reading-column block; font FAMILY choice is NOT here
  (07c re-points --font-body/--font-heading). This milestone sets the system
  and the DEFAULT family value only.
- D-07d-2: ADDITIVE-only. New tokens are appended to :root; the ONE edit to
  an existing declaration is re-pointing html,body font-family to
  var(--font-body), whose default value reproduces the removed stack
  verbatim (no visual change; single source for the body family). No token
  and no class is removed or renamed, so 07c can safely re-point the family
  tokens.
- D-07d-3: Reading column = `.post-content` capped at --measure (~42rem,
  ~60–75ch), centred; the renderer's `.blog-post-content` wrapper is a
  transparent pass-through (its class semantics unchanged; renderer.js NOT
  touched).
- D-07d-4: Hyphenation is PROSE-only; code/pre explicitly opt OUT (hyphens:
  none, overflow-wrap/word-break normal; `pre` scrolls via overflow-x:auto).
  Code must always read verbatim.
- D-07d-5: Logical properties only; RTL-safe by construction. A small-screen
  @media (max-width:480px) re-points --font-size-base/--line-height-base/
  --measure/--rhythm for comfortable mobile reading.
- D-07d-6: System stacks only (no webfont fetch); the DEFAULT book-reader
  base is the existing system sans stack (unchanged) — a reading serif is a
  FAMILY option owned by 07c, not forced here.
- Carried: X-1..X-6 (TTS), D-TTS2-1..6, X-6 (07 S-4 superseded for post
  view); D-Tool-9 seam freeze + D-Tool-18..29 unchanged.

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=af9e5595d9e1cf48e388229c544145bb7dfd02180cb1be44bbd12663ca45b1f3
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the commit-message
body, NOT here (WORKFLOW.md step 6). FILE_TREE_SHA256 is captured AFTER staging
the full 07d file set INCLUDING this handoff + HANDOFF-CURRENT.txt.

Interfaces delivered

- CSS only (no JS/markup API changed). New tokens: --font-body,
  --font-heading, --font-mono, --measure, --font-size-base,
  --line-height-base, --rhythm, --space-1..--space-6 (all ADDITIVE; each
  family token declared exactly once in :root). New selectors (all
  `.post-content ...`): reading column, headings + scale, p, a, ul/ol/li,
  blockquote, hr, code/kbd/samp, pre, pre code, table, th/td, figure,
  figure img, figcaption, .embed-container(+/iframe), .footnotes(+/li),
  .pullquote (spacing only). NO class NAME removed or renamed; renderer.js
  contracts unchanged.

Expected delta for the next chat

- 07c (Font selection): authors tools/milestones/07c.md (ALREADY authored,
  see Files to read) + implements a Font control in the 07 drawer
  (#app-panel) offering Traditional/Modern families with a book-reader
  DEFAULT, re-pointing the --font-\* family tokens DEFINED BY 07d and
  persisting the choice under ONE localStorage key (theme-pref pattern,
  07b), applied before first paint. Touches index.html + a new font.js (or
  shell.js) + app.js guarded init + style.css (family token values) ONLY.

Human edits made outside tooling (structured)

- None reported.

Open warnings (count + links only)

- 0.

Deviations from locked decisions (must be empty, or explain)

- None. (The single edit to a pre-existing declaration — html,body
  font-family -> var(--font-body) — is a re-point whose default value is
  byte-identical; it removes no token and changes no rendered output. The
  milestone permitted "reusing existing tokens; MAY add new tokens ONLY
  additively", so defining the family tokens here (which 07c re-points) is
  in-scope and additive.)

Partial work: None. Blocked reason (only if Status: blocked): n/a.

Known issues / TODOs

- PROSE-ONLY hyphenation relies on a language tag for correct hyphenation
  dictionary choice; the document/containers carry `lang` (router/HTML). A
  missing lang degrades to no hyphenation (safe).
- text-wrap: pretty / balance are progressive enhancements (Chrome/Safari);
  older engines ignore them (no layout break).
- Accessibility: this is a pure visual pass; it does NOT change semantics,
  focus order, or the TTS/transport behaviour; re-checked logically
  (headings remain real headings, lists real lists, table real table).
- A pre-existing empty spacing scale did not exist; --space-\* and --rhythm
  are new, so 12a/12b RTL typography may reuse them (no conflict).

Assumptions the next chat may rely on

- --font-body is the single body family source (html,body now consumed via
  the token); --font-heading defaults to var(--font-body). 07c re-points
  these two (and may add a serif/sans pair) without touching any component
  class.
- --measure / --font-size-base / --line-height-base / --rhythm / --space-\*
  are the typographic system tokens for later milestones.

Test checklist result (pass/fail per item)

1. node apps/blog/tools/test-integrity.js -> INTEGRITY OK
2. node --check (no JS touched; n/a) -> unaffected; style.css is not JS.
3. CSS brace-balance / parse sanity -> BALANCED (156/156), final depth 0.
4. Additivity grep -> no `--token` removals; no selector removals; only the
   html,body font stack re-pointed to var(--font-body) (byte-identical
   default). PASS.
5. Reading measure / rhythm / headings / blockquote / code / table / figure
   / lists / links -> implemented in CSS; HUMAN to confirm in-browser.
6. Code non-hyphenation (hyphens:none on code/pre; pre overflow-x:auto) ->
   structural PASS; HUMAN to confirm.
7. List view / toolbars / drawer / TTS transport untouched -> PASS (no JS,
   no markup, no other CSS block changed).
8. Day + night legible (tokens reused; no hard-coded colors) -> PASS
   (only var(--surface*)/var(--border)/var(--accent)/var(--text*) used).
9. node apps/blog/tools/hash-state.js -> captured (see commit body).
10. git status --porcelain -> exactly the 07d file set.

Files to read in the next chat (exact paths)

- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/milestones/07c.md
