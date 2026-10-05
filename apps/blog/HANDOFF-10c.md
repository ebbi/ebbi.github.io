HANDOFF — Chat 10c: List & panel presentation revamp (gate corrections)
Status: complete
Current chat id: 10c
Current milestone: 10c
Completed milestones: 00,01,02,03,04,05a,05a-fix,05b-removal,W1,W1-fix,06,06b,07,08,09,C1a,C1-tool,C1-tool-p2,C1-model,C1-tool-cleanup,B1a,C1b-01..C1b-DONE,C1b-18,C1b-12..C1b-17,B1,10b,07b,TTS,TTS2,07d,07c,10c
Next chat id: 11 (HUMAN-GATED — translation gate NOT signed off; see below)
Context windows used: 1

Files created/modified (exact paths)
- apps/blog/assets/js/app.js (MOD; NON_BLOG_SLUGS deny-list + renderList = ONE "Two Legs Bad" card panel reusing 10b classes + a compact .blog-index; renderPost UNCHANGED)
- apps/blog/assets/css/style.css (MOD; EXACTLY two edits: one-line .post-detail margin override + ONE additive, new-class-only .blog-index block)
- apps/blog/assets/js/nav.js (MOD; LANGS = content-driven set, EN only, per D-10c-6)
- apps/blog/tools/ROADMAP.md (MOD; 10c added; 10c Next -> Done)
- apps/blog/tools/milestones/10c.md (NEW; this milestone's spec, authored this chat)
- apps/blog/HANDOFF-10c.md (NEW; this file)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> HANDOFF-10c.md)

Frozen decisions made in this chat (also in tools/milestones/10c.md)
- D-10c-1 (SUPERSEDES 10b): the per-item collapsible panel is REMOVED; each list item is a heading that is ITSELF the navigation link (no per-item aria-expanded/aria-controls, no "Read full post" link).
- D-10c-2: ALL blogs are wrapped in ONE outer collapsible panel titled "Two Legs Bad", DEFAULT OPEN, REUSING 10b's existing card classes (.post-list-item + .post-list-item__toggle with its rotating caret + .post-list-item__panel body, `hidden` attribute mechanism) — ZERO new CSS for the panel. It is the ONLY collapsible on the list view.
- D-10c-3: three non-blog slugs are excluded from the blog set entirely via a hardcoded deny-list in renderList (controlling-the-narrative, update, a-contemporary-history-of-the-muslim-world-contents). feed.json is generated+fenced, so the deny-list lives in app.js. Display-only; files stay on disk.
- D-10c-4 (d1): the DATE is dropped from the LIST view only. 09's post view KEEPS `${body.date}`; post-view date formatting/removal is owned by 11. Also drops the list-view summary text.
- D-10c-5: the EXISTING .post-detail class is DELIBERATELY overridden (margin-inline: 1vh 1vw; display:block; max-inline-size:720px) — the human's intentional edit for mobile edge-touching (NOT a typo). Authorized explicitly (outside 11's additive-only fence). All OTHER style.css edits are additive, new-class-only.
- D-10c-6: the switcher offers ONLY languages that have content (recon: EN only). Translations are DEFERRED (gate unsigned); empty fa/ar/th recorded as a Known issue, NOT filled with placeholders.
- D-10c-7: C1b-18 series ordering is PRESERVED VERBATIM.
- D-10c-8: the translation gate is UNSIGNED; this milestone begins NO translation work and does NOT modify the DeepL/Google pipeline.

The renderList shape (final)
- ONE panel: <article class="post-list-item"> > <button class="post-list-item__toggle" type="button" aria-expanded="true" aria-controls="blog-panel-body"><span class="post-list-item__title-text">Two Legs Bad</span></button> > <div class="post-list-item__panel" id="blog-panel-body"> > <ul class="blog-index"> ...items... </ul> </div> </article>
- Per index row (compact, ruled, option B): <li class="blog-index__item"><a class="blog-index__link" href="#/<lang>/post/<slug>">title</a></li>
- ONE delegated click listener on the #app container, guarded by container.dataset.blogPanelBound (bound ONCE across route changes; renderList replaces innerHTML every render). The handler flips aria-expanded and toggles the `hidden` attribute on #blog-panel-body.
- NON_BLOG_SLUGS applied AFTER the lang filter and BEFORE the C1b-18 partition. C1b-18 partition/sort (Number.isInteger seriesOrder; series.sort; series.concat(rest)) BYTE-IDENTICAL.

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=af9e5595d9e1cf48e388229c544145bb7dfd02180cb1be44bbd12663ca45b1f3
FEED_JSON_SHA256=85f19c755fb091cb4d46f5fee99fb178c8ff462ab643adb90f47ca9072e66fc1
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the commit-message body, NOT here. See tools/WORKFLOW.md step 6. FILE_TREE_SHA256 is captured AFTER staging the full 10c file set INCLUDING this handoff + HANDOFF-CURRENT.txt.

Non-regression / additive proof (numstat)
- app.js diff = +56 / -27 (the deleted lines are exactly the old 10b per-item markup + old listener); renderPost markup has NO -/+ => byte-identical; C1b-18 ordering lines have NO -/+ => byte-identical.
- style.css diff = +41 / -1 (the single -1 is the .post-detail margin-inline line; +41 is the new .blog-index block). Braces 166/166; comments 85/85; first char "/".
- nav.js diff = +7 / -9 (LANGS array + comment; the removed lines are the 3 extra language objects + their comment line).
- feed.json NOT regenerated / NOT touched (sha unchanged from C1b-DONE: 85f19c75...).

Reconciliation deviations (recorded, not hidden)
- STYLE.CSS SURGERY (significant, self-corrected): an initial 10c style.css append was made with a missing /* opener AND then a truncated final rule; both were parse-breaking and the human flagged the display breakage. It was FULLY REVERTED via `git checkout -- apps/blog/assets/css/style.css` and re-applied as EXACTLY two verified edits (the .post-detail margin + a complete, delimited .blog-index block). Final on-disk state re-verified by reading the file (braces 166/166; comments 85/85; first char "/"). LESSON: every style.css write was re-read from disk, not trusted from the editor's success message.
- DESIGN CORRECTION (human-driven): the first panel markup used INVENTED .blog-panel* classes (needing new CSS). The human directed (a) the panel must reuse the EXISTING 10b card + arrow (zero new CSS) and (b) the items must be a COMPACT ruled index (option B), not cards. The markup was re-aligned to .post-list-item + .post-list-item__toggle + .post-list-item__panel (panel) and .blog-index* (items). Confirmed class strategy with the human BEFORE writing.
- STRAY 0-BYTE FILE (carried warning #11): a 0-byte untracked file with a non-printable name appeared AGAIN at repo root (e.g. "\001\004\346\004@p9N@8"). NOT milestone work; must be excluded from staging / removed to keep the tree clean (name-glob `rm` does NOT match it; use `find "$REPO" -maxdepth 1 -type f -size 0 -delete`).
- ROUTE-SLUG CROSS-CHECK: the deny-list slugs were confirmed against feed.json + content/en/ (route.slug = router segments[2], raw): controlling-the-narrative, update, a-contemporary-history-of-the-muslim-world-contents. All three present; content/en=26 files.

Partial work (link to PARTIAL.md if present)
- None.

Blocked reason (only if Status: blocked)
- (n/a)

Known issues / TODOs
- TRANSLATION GATE UNSIGNED. fa/ar/th are DEFERRED and empty (0 files). The switcher offers EN ONLY (D-10c-6) — do NOT treat this as a bug. Translations begin only after the human signs off the detailed blog text review / EN finalization.
- 10c SUPERSEDES 10b; do NOT re-introduce per-item panels or the "Read full post" link.
- The POST view still renders its date (.post-header__meta: `${body.date} • LANG`); post-view date formatting/removal is 11's (d1). Do not treat it as a regression of D-10c-4.
- L-010 (feed-excerpt HTML leak for part-22) remains deferred; feed.json is fenced and untouched.
- The old `.post-list-item__title` and `.post-list-item__meta`/`__excerpt`/`__read` CSS rules are now UNUSED by renderList but LEFT INTACT (removing them would be a non-additive style.css edit). Do NOT treat as a bug.
- C1b-18 series ordering + TTS/TTS2/07/07b/07c/07d are frozen; do not re-touch.

Assumptions the next chat may rely on
- List view = ONE "Two Legs Bad" card panel (default OPEN) wrapping a compact ruled .blog-index of heading-links; no per-item panel/date/summary/read-link; the 3 non-blog slugs are absent.
- feed.json is 26 entries, UNCHANGED (sha 85f19c75...).
- The seam (import-post.js) is frozen through D-Tool-29; 10c changed no content file and no seam.
- HANDOFF-CURRENT.txt -> HANDOFF-10c.md; next milestone file is apps/blog/tools/milestones/11.md (HUMAN-GATED).

Test checklist result (pass/fail per item)
- node --check apps/blog/assets/js/app.js -> exit 0: PASS
- node --check apps/blog/assets/js/nav.js -> exit 0: PASS
- node apps/blog/tools/test-integrity.js -> INTEGRITY OK: PASS (existence-only check; no hash update needed)
- style.css structural: braces 166/166; comments 85/85; first char "/": PASS
- git diff numstat matches the intended two style.css edits + app.js + nav.js (feed.json untouched): PASS
- node apps/blog/tools/hash-state.js -> captured for commit body: (run at commit)
- git status --porcelain -> exactly 10c's file set (+stray exclusion): (run at commit)
- Browser items 4-9 (panel card + caret; compact index; heading-is-link; 3 slugs absent; C1b-18 order; .post-detail computed style; switcher EN-only; no console errors): NOT executed by the agent (no browser in this environment). Marked PASS-by-structural-equivalent; browser confirmation owed to a human/next chat.

Human edits made outside tooling (structured)
- apps/blog/assets/css/style.css: the human edited `.post-detail` (margin-inline: 1vh 1vw) — intentional, adopted as D-10c-5 and preserved byte-for-byte. (This is the ONE CSS change the human made directly.)

Open warnings (count + links only)
1. tools/*.md whitespace may not survive chat copy; anchor edits from `cat -A`. (carried)
2. Edit splice pitfall: verify POSITIONALLY, not by substring. (carried)
3. FILENAME COLLISION: B1 vs B1a. (carried)
4. hash-state.js FILE_TREE_SHA256 capture rule: capture AFTER staging. (carried)
5. STYLE.CSS write verification: re-read from disk after every write (this chat's missing-opener + truncated-rule incident). (NEW)
