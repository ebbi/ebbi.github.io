HANDOFF — Chat 10b: List item as collapsible panel
Status: complete
Current chat id: 10b
Current milestone: 10b
Completed milestones: 00,01,02,03,04,05a,05a-fix,05b-removal,W1,W1-fix,06,06b,07,08,09,C1a,C1-tool,C1-tool-p2,C1-model,C1-tool-cleanup,B1a,C1b-01..C1b-DONE,C1b-18,C1b-12..C1b-17,B1,10b
Next chat id: 11
Context windows used: 1

Files created/modified (exact paths)
- apps/blog/assets/js/app.js (MOD; renderList per-item markup -> collapsible panel + ONE delegated toggle listener; series ordering UNCHANGED)
- apps/blog/assets/css/style.css (MOD; ONE additive "Milestone 10b" block, new classes only; no existing block edited)
- apps/blog/tools/ROADMAP.md (MOD; 10b Next -> Done; 11 becomes next)
- apps/blog/tools/milestones/11.md (NEW; the next milestone, authored here per WORKFLOW step 7)
- apps/blog/HANDOFF-10b.md (NEW; this file)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> HANDOFF-10b.md)

Frozen decisions made in this chat
- D-10b-1: The collapsible toggle is a REAL <button type="button"> with aria-expanded + aria-controls; the panel uses the `hidden` attribute (NOT display:none via a class), so the accessible name/state is correct and Enter/Space work for free. The caret is decorative CSS (::after).
- D-10b-2: The "read full post" link is the ONLY navigation affordance inside the panel; the title toggles, it does NOT navigate. (Matches the 10b ROADMAP wording and prevents D-10b-4's live-anchor violation.)
- D-10b-3: C1b-18 series ordering is PRESERVED VERBATIM (partition by integer seriesOrder; series 1 -> 23 first, then non-series in feed date-desc order). Only the per-item markup string changed.
- D-10b-4: L-010 REMAINS DEFERRED — NOT resolved here. Its fix site (generate-index.js buildExcerpt) is FENCE-EXCLUDED from 10b, and part-22's feed excerpt is a LIVE <a> anchor that would navigate out of the panel and violate D-10b-2; a correct fix needs an excluded file or a scope expansion, both prohibited. Per milestones/10b.md ("if 10b does not address it, keep it deferred — do NOT silently close it"), it stays open and is owed to a generate-index / list-index milestone.

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=af9e5595d9e1cf48e388229c544145bb7dfd02180cb1be44bbd12663ca45b1f3
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the commit-message body, NOT in the handoff. See tools/WORKFLOW.md step 6.
NOTE: FILE_TREE_SHA256 is captured AFTER staging the full 10b file set INCLUDING this handoff + HANDOFF-CURRENT.txt. Pre-stage it was ae4e895ca5aa666e299fd769fb602d275eb2c7fcf51d30a5048a300c9691e825 (before style.css re-apply + stray removal); see commit body for the final value.

The renderList item shape (final)
- Per item: <article class="post-list-item"> > <button class="post-list-item__toggle" type="button" aria-expanded="false" aria-controls="excerpt-<slug>"><span class="post-list-item__title-text">title</span></button> > <p class="post-list-item__meta">date • LANG</p> > <div class="post-list-item__panel" id="excerpt-<slug>" hidden> > <p class="post-list-item__excerpt">...</p> + <a class="post-list-item__read" href="#/<lang>/post/<slug>">Read full post</a> </div> </article>
- panelId = `excerpt-${String(post.slug).replace(/[^a-z0-9_-]/gi, "-")}` (element-id-safe; aria-controls references it; slugs are language-agnostic).
- ONE delegated click listener on the .post-list container, guarded by container.dataset.listToggleBound so it binds ONCE across route changes (renderList replaces innerHTML every render). The handler flips aria-expanded and toggles the panel's `hidden` attribute on the element named by aria-controls.

Non-regression / additive proof
- app.js diff = +41 / -6: the ONLY deletions are the old item markup (the <a class="post-list-item__title"> row + the <p class="post-list-item__excerpt"> row); every added line is the new markup + the listener. The C1b-18 ordering lines (Number.isInteger partition, series.sort by seriesOrder, series.concat(rest)) show NO -/+ in the diff => byte-identical.
- style.css diff = +72 / 0: PURELY ADDITIVE, appended after the B1 block; no existing block edited (one @@ hunk at end of file).
- feed.json NOT regenerated (10b does not change the index); feed.json untouched.

Reconciliation deviations (recorded, not hidden)
- STYLE.CSS REVERT ANOMALY (significant): the first style.css append reported success and verified 726 lines + all 10b markers present; a later git check showed the file reverted to its 654-line HEAD state (0 markers) — the same "edit did not persist" anomaly seen earlier in this session with the Markdown/IDE editor. The block was RE-APPLIED via a shell heredoc and IMMEDIATELY re-verified (726 lines; diff +72/0). The working tree at handoff shows style.css modified and staged. Any prior "applied" claim that was not re-verified after the fact was at risk; this is the reason every verification here is done by reading the on-disk file via git/shell, not by trusting the editor's success message.
- STRAY 0-BYTE FILE (carried warning #11): a 0-byte untracked file with a non-printable name appeared AGAIN at repo root (the SAME anomaly class as B1). Removed via `find "$REPO" -maxdepth 1 -type f -size 0 -delete` (name-glob `rm` did NOT match it). Not milestone work; removed to keep the tree clean per CONTEXT.md.

Partial work (link to PARTIAL.md if present)
- None.

Blocked reason (only if Status: blocked)
- (n/a)

Known issues / TODOs
- L-010 still deferred (see D-10b-4); its home is a generate-index / list-index milestone.
- The old `.post-list-item__title` CSS rule in style.css is now UNUSED by renderList (the title is a <span class="post-list-item__title-text"> inside the button). It is LEFT INTACT deliberately: removing it would be a NON-ADDITIVE style.css edit, forbidden by the 10b fence ("edits NO existing block"). A future milestone may remove it if it adds value; do NOT treat it as a bug.
- The excerpt paragraph still inserts feed.json excerpt as innerHTML (unchanged from 08); this is the surface L-010 lives on. Left as-is deliberately (out of fence).

Assumptions the next chat may rely on
- List view now renders collapsible panels; title toggles, "read full post" navigates; series ordering 1 -> 23 then non-series UNCHANGED from C1b-18.
- feed.json is 26 entries, unchanged.
- The seam (import-post.js) is frozen through D-Tool-29; 10b changed no content file and no seam.
- HANDOFF-CURRENT.txt -> HANDOFF-10b.md; next milestone file is apps/blog/tools/milestones/11.md.
- Tree at 10b close is clean and committed (see commit body).

Test checklist result (pass/fail per item)
- node --check apps/blog/assets/js/app.js -> exit 0: PASS
- node apps/blog/tools/test-integrity.js -> INTEGRITY OK: PASS
- node -e structural smoke test (renderList markup + toggle semantics): real <button> toggle; panel id+hidden; read-link route; aria-controls id match; delegated listener; hidden toggle; aria-expanded toggle; bound-once guard; series ordering preserved; partition by integer seriesOrder -> ALL PASS
- feed.json untouched (git status clean for it): PASS
- css purely additive (numstat 72/0, no -lines): PASS
- node apps/blog/tools/hash-state.js -> captured for commit body: PASS
- git status --porcelain -> exactly 10b's file set (+stray removal): PASS
- Browser items 4/5 (click toggles, Enter/Space, no console errors) -> NOT executed by the agent (no browser in this environment); the structural smoke test covers the wiring. Marked PASS-by-equivalent, browser confirmation owed to a human/next chat.

Human edits made outside tooling (structured)
- None.

Open warnings (count + links only)
1. tools/*.md whitespace may not survive chat copy; anchor edits from `cat -A`. (carried; this chat used shell heredoc + python exact-string edits instead of the Markdown editor)
2. Edit splice pitfall: verify POSITIONALLY, not by substring. (carried)
3. FILENAME COLLISION: B1 vs B1a. (carried)
4. hash-state.js FILE_TREE_SHA256 capture rule: capture AFTER staging. (carried)
5. LOSS_LEDGER.md table padding mixed (cosmetic). (carried)
6. NEW (significant): Editor edits may SILENTLY REVERT (style.css) — RE-VERIFY every edit on disk (git/shell) immediately before relying on it; never trust the editor's success message. (observed twice this session)
7. (recurred) 0-byte stray file at repo root: removed again this chat via `find … -size 0 -delete` (name-glob rm fails on the non-printable name).

Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-10b.md (this file)
- apps/blog/tools/milestones/11.md (the next milestone; authored here per WORKFLOW step 7)
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/ROADMAP.md
- apps/blog/assets/js/app.js (renderList / handleRouteChange call sites)
- apps/blog/assets/js/nav.js (language switcher)
- apps/blog/assets/css/style.css (10b block)
