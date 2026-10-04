HANDOFF — Chat B1: Renderer remaining block types (pullquote, resourceList, callout, attachment)
Status: complete
Current chat id: B1
Current milestone: B1
Completed milestones: 00,01,02,03,04,05a,05a-fix,05b-removal,W1,W1-fix,06,06b,07,08,09,C1a,C1-tool,C1-tool-p2,C1-model,C1-tool-cleanup,B1a,C1b-01..C1b-DONE,C1b-18,C1b-12..C1b-17,B1
Next chat id: 10b
Context windows used: 1

Files created/modified (exact paths)
- apps/blog/tools/milestones/B1.md (NEW; authored here — the FILE THE PRIOR CHAT FAILED TO AUTHOR; see Deviation 1)
- apps/blog/assets/js/renderer.js (MOD; four new cases: pullquote, resourceList, callout, attachment; footnotes already present, unchanged)
- apps/blog/assets/css/style.css (MOD; one additive "Milestone B1" block: .pullquote/.callout/.resource-list/.attachment; no existing block edited)
- apps/blog/tools/ROADMAP.md (MOD; B1 Next -> Done; 10b becomes next)
- apps/blog/tools/milestones/10b.md (NEW; the next milestone, authored here per WORKFLOW step 7)
- apps/blog/HANDOFF-B1.md (NEW; this file)
- apps/blog/HANDOFF-CURRENT.txt (MOD; pointer -> HANDOFF-B1.md)

Frozen decisions made in this chat
- B1-D1 pullquote shape: {type:"pullquote", content:<plain-text string, tags stripped, entities preserved>, citation:<plain-text string|null>}. Rendered as <blockquote class="pullquote"> > .pullquote__content (innerHTML) + optional <cite class="pullquote__citation">. Same plain-text contract as quote (D-Tool-15); citation is plain text -> textContent via decodeEntities(). No content file emits this type yet (seam frozen); shape is forward-looking and consumed defensively.
- B1-D2 resourceList shape: {type:"resourceList", content:<inner HTML of a source list, outer tag omitted>}. Rendered as <ul class="resource-list"> with innerHTML = content (mirrors footnotes/list).
- B1-D3 callout shape: {type:"callout", content:<inner HTML>}. Rendered as <aside class="callout callout--info"> > <div class="callout__content"> (innerHTML).
- B1-D4 attachment shape: {type:"attachment", src:<url string>, caption:<plain-text string|null>, label:<plain-text string|null>}. Rendered as <figure class="attachment"> > <a class="attachment__link" href=src> (textContent = decodeEntities(label), fallback src) + optional <figcaption class="attachment__caption"> (textContent = decodeEntities(caption)).
- B1-D5 No seam change. import-post.js untouched; the D-Tool-9 seam stays frozen through D-Tool-29. The four shapes are renderer-only and defensive (each case returns null for an unusable block rather than throwing).
- B1-D6 Renderer injection rule extended uniformly (restates B1a-D1): trusted-markup fields (pullquote.content, resourceList.content, callout.content) -> innerHTML; plain-text fields (pullquote.citation, attachment.caption, attachment.label) -> textContent via decodeEntities(). No user input on the render path.
- B1-D7 CSS is additive and new-class-only. The B1 style block defines ONLY new classes; it edits no existing block and adds no class used by another milestone. Reuses existing tokens (--surface, --surface-2, --border, --radius, --text, --text-muted, --accent, --transition), logical properties only, RTL-safe.

Hashes (inputs only — see tools/WORKFLOW.md, convention (b))
LOCKED_DECISIONS_SHA256=af9e5595d9e1cf48e388229c544145bb7dfd02180cb1be44bbd12663ca45b1f3
CONTENT_EN_JEWS_IN_PALESTINE_BEFORE_ISRAEL_SHA256=36d1164a1b4ded8d10484517c95e6a73180ce4e3741a91da8beee47b439eaa3d
SCHEMA_SHA256=OMITTED

Volatile facts (GIT_HEAD, GIT_DIRTY, FILE_TREE_SHA256) live in the commit-message body, NOT in the handoff. See tools/WORKFLOW.md step 6.

The four block mappings added to renderBlock()
- pullquote -> <blockquote class="pullquote"> ; .pullquote__content innerHTML content; .pullquote__citation textContent decodeEntities(citation).
- resourceList -> <ul class="resource-list"> ; innerHTML content.
- callout -> <aside class="callout callout--info"> ; .callout__content innerHTML content.
- attachment -> <figure class="attachment"> ; <a.attachment__link href> (label/source) + <figcaption.attachment__caption> (caption).
- footnotes -> already implemented (C1-tool-seam-footnotes); VERIFIED present and unchanged. B1 did not re-add it.

Reachability of the new types
The four types are NOT emitted by any current content file and NOT by the frozen seam (import-post.js through D-Tool-29). They are renderer-ready for a future seam extension. Deliberate: B1 is renderer-only; a seam change is its own milestone with its own LOCKED_DECISIONS entry.

Non-regression evidence
The pre-existing live block types (paragraph, heading, image, quote, footnotes, list, table, divider, embed) are byte-identical in the switch; the four new cases are pure additions (diff = +65 insertions, 0 deletions). All 26 content/en/*.json still render unchanged (renderer reads only block.type + a few fields; new cases are additive and cannot affect old types).

Deviations from locked decisions (must be empty, or explain)
- AUTHORED B1.md IN THIS CHAT. WORKFLOW step 7 says the NEXT milestone's file is authored at the PRIOR chat's close. The C1b-DONE handoff named apps/blog/tools/milestones/B1.md as "the next milestone; AUTHOR IT at the close of C1b-DONE", but that chat did NOT author it (the file did not exist at B1 open). Per CONTEXT.md ("a milestone without a filled Interfaces section is not ready"), B1 was not ready; to start B1 the missing file had to be authored. Recorded, not hidden.
- RECONCILIATION DEVIATION (NEW, significant): on OPEN, the B1 handoff text was presented as complete, but NO B1 artifact existed on disk: renderer.js had no new cases, style.css had no B1 block, milestones/B1.md and HANDOFF-B1.md did not exist, HANDOFF-CURRENT.txt still pointed at HANDOFF-C1b-DONE.md, and ROADMAP still listed B1 under Next. The prior chat wrote the handoff TEXT but never applied the edits or committed (the carried warning #11 anomaly). B1 was therefore actually performed in THIS chat; this handoff supersedes the unreconciled claim.
- footnotes was listed in the ROADMAP B1 line but already existed in renderer.js (C1-tool-seam-footnotes). B1 verified it and did NOT re-add it. Not a change; noted so the next chat does not look for a new footnotes case.

Partial work (link to PARTIAL.md if present)
- None.

Blocked reason (only if Status: blocked)
- (n/a)

Known issues / TODOs
- B1-D1..B1-D4 shapes are CONVENTIONS, not yet exercised by real content. When a seam milestone first emits one of these types, reconcile the emitted shape against B1-D1..B1-D4 and, if they disagree, either adapt the seam or amend the renderer case in that milestone (do NOT silently diverge).
- The four types remain unreachable from the deployed blog until a seam extension emits them; that is expected and correct.
- L-010 (feed-excerpt HTML leak for part-22) still deferred (home: 10b or its own).

Assumptions the next chat may rely on
- renderer.js now maps every block type in the LOCKED_DECISIONS vocabulary EXCEPT gallery (out of B1's ROADMAP scope). gallery is the only remaining unmapped type.
- The seam (import-post.js) is frozen through D-Tool-29; B1 changed no content file and no seam.
- All 26 content/en/*.json still render byte-identically.
- feed.json is 26 entries; list view reads series 1 -> 23 then non-series.
- Tree at B1 close is clean and committed.

Test checklist result (pass/fail per item)
- node --check apps/blog/assets/js/renderer.js -> no output (exit 0): PASS
- node apps/blog/tools/test-integrity.js -> INTEGRITY OK: PASS
- node -e smoke test (renderBlock for each new type; assert tag/class): pullquote -> BLOCKQUOTE.pullquote with .pullquote__citation; resourceList -> UL.resource-list; callout -> ASIDE.callout.callout--info > .callout__content; attachment -> FIGURE.attachment > A[href] (+ figcaption); empty/unusable -> null; ALL PASS
- grep -n new cases in renderer.js + new classes in style.css: PASS
- node apps/blog/tools/hash-state.js -> captured for commit body: PASS
- git status --porcelain -> exactly B1's file set (+housekeeping stray removal): PASS

Human edits made outside tooling (structured)
- None.

Open warnings (count + links only)
1. tools/*.md whitespace may not survive chat copy; anchor edits from `cat -A`. (carried)
2. Edit splice pitfall: verify POSITIONALLY, not by substring. (carried)
3. FILENAME COLLISION: B1 (this chat: remaining block types) vs B1a (renderer injection consistency + caption decode). Distinct ids; distinct scope. (NEW prior chat)
4. hash-state.js FILE_TREE_SHA256 capture rule: capture AFTER staging. (carried)
5. LOSS_LEDGER.md table padding mixed (cosmetic). (carried)
6. (resolved this chat) 0-byte stray file at repo root: a 0-byte untracked file was present at OPEN and was removed to start from a clean tree (CONTEXT.md: do not start on a dirty tree). Not milestone work.

Files to read in the next chat (exact paths)
- apps/blog/HANDOFF-CURRENT.txt
- apps/blog/HANDOFF-B1.md (this file)
- apps/blog/tools/milestones/10b.md (the next milestone; AUTHOR IT was done here per WORKFLOW step 7)
- apps/blog/tools/CONTEXT.md
- apps/blog/tools/WORKFLOW.md
- apps/blog/tools/LOCKED_DECISIONS.txt
- apps/blog/tools/ROADMAP.md
- apps/blog/assets/js/app.js (renderList / renderPost call sites)
- apps/blog/assets/js/renderer.js (as modified)
- apps/blog/assets/css/style.css (B1 block)
