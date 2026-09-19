# Zabon — Restart Brief, Current Baseline & Process Rules

## 1. Files to attach with this message

- `app.js` — the single IIFE (current local version, post-sweep baseline)
- `index.html` — the app shell
- `main.css` — the Stage-15 language-agnostic design system
- `lessons/manifest.json` — language registry + categories + the complete lesson set (84 lessons)

Do not attach individual lesson JSON files. They are complete and must never be modified.

## 2. Project overview

Zabon is a language-learning web app: vanilla HTML/CSS/JS, no frameworks, no build step. Target language Thai; the UI supports 7 app languages (`en, th, fa, ar, es, zh, ja`). Content is language-agnostic: every lesson item carries text in all 7 languages and the user toggles which languages display.

## 3. Architecture

- Single IIFE in `app.js`.
- Services: `DataService`, `MediaService`, `SrsService`, `FlashcardService`, `QuizService`, `QuizProgressService`, `StudyPlanService`.
- Rendering functions per view; one delegated click handler `bindGlobalEvents()` (form controls may use `change` listeners per existing convention).
- Views (in `VIEW_IDS`): `onboarding`, `home`, `lesson`, `flashcard`, `quiz`, `build`, `progress`, `voicetest`.
- `window.ZabonV2` exposes `{ state, registry, manifest, dataService, mediaService, srsService, quizProgressService }`.

## 4. Current verified state (baseline for all future stages)

### `app.js`

- `STORAGE_KEYS` — exactly 11 keys: `buildLanguages`, `settings`, `lessonLanguages`, `srs`, `quiz`, `lessonsTried`, `onboardingComplete`, `onboardingAnswers`, `studyPlan`, `studyPlanProgress`, `lessonBaseStatus`. (No `lastLesson`, no `reviewHistory`.)
- `UI_STRINGS` — full set. Lesson-status strings are 3-state only: `lessonStatusComplete`, `lessonStatusInProgress`, `lessonStatusSkipped`. Added `exerciseSettings` for the collapsible exercise config panel. (No `continueWhereLeftOff`, `lessonComplete`, `flashcardSettings`, `planProgress`, or `lessonStatusNotStarted`.)
- State variables: `exerciseSettingsOpen` (boolean) tracks the open/closed state of the exercise settings panel. `quizSession` now includes `selectedItemId` to preserve answered-state across re-renders.
- `bindGlobalEvents()`: `flashcard-start` and `quiz-start` cases removed (exercises auto-start). `toggle-exercise-settings` case added.
- No duplicate function definitions remain. There is exactly one `renderGrammarSubsection(grammarLessons, tierKey)` (bare lessons, status icon via `lessonStatusIcon`), one `renderStudyPlanProgressSection()` (clean loop), one each of `countTierLessons` / `countTierLessonsTried` / `toggleTier` / `toggleGrammarSubsection` / `renderProficiencyTier`.
- `markLessonTried(lessonId)` persists: inside the `if (!lessonsTried.has(lessonId))` block it calls `saveJSON(STORAGE_KEYS.lessonsTried, [...lessonsTried])`. (Verify with the grep in §10.)

### `main.css`

- Stage-15 language-agnostic design system. No `.continue-hint` block, no `.mark-complete-btn`. Unused `.plan-lesson-status` removed.
- Live component blocks include: `.complete-toggle*`, `.lesson-card__status`, `.next-up-card*`, `.browse-by-level`, `.study-plan-list` / `.study-plan-item*`, `.plan-progress-bar` / `.plan-progress-fill` / `.plan-progress-label`, `.plan-lesson-list` / `.plan-lesson-item` / `.plan-actions`, `.proficiency-tier*`, `.grammar-subsection`, `.onboarding*`, `.exercise-settings*`.

### `index.html`

- App shell: toolbar, action bar (flashcards/quiz/build buttons), bottom bar (play/stop/settings), hamburger panel (theme/font cycle, app-language select, `create-plan`, show-progress, open-voice-test), settings sheet, and the 8 view containers. Static labels use `data-ui-string` / `data-ui-label`.

### `manifest.json`

- 7-language registry (`en, th, fa, ar, es, zh, ja`) with `bcp47`, `dir`, `segmentation`. Categories carry per-lesson `level`, `proficiency` (`beginner|intermediate|advanced`), and `grammar` tags. `cat_test` is skipped in Home/plan generation; `cat_grammar` lessons feed the grammar subsections. Complete — do not modify.

## 5. Storage-key map (read/write)

| Key                                               | Written by                                                   | Read by                                 |
| ------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------- |
| zabon.settings, zabon.lessonLanguages             | saveState()                                                  | init()                                  |
| zabon.srs                                         | SrsService                                                   | SrsService                              |
| zabon.quiz                                        | QuizProgressService                                          | QuizProgressService                     |
| zabon.lessonsTried                                | markLessonTried()                                            | init(), cleared by resetAllProgress()   |
| zabon.onboardingComplete, zabon.onboardingAnswers | onboarding flow                                              | goHome(), renderOnboarding(), plan edit |
| zabon.studyPlan, zabon.studyPlanProgress          | StudyPlanService / generateStudyPlan() / setLessonComplete() | everywhere status is shown              |
| zabon.lessonBaseStatus                            | setLessonComplete()                                          | setLessonComplete()                     |
| zabon.buildLanguages                              | saveBuildConfig()                                            | ensureBuildConfig()                     |

## 6. Status model & key behaviors

- Lesson status values: `"complete" | "in-progress" | "skipped"`. `zabon.studyPlanProgress` is the single source of truth for current status in BOTH plan and browse modes.
- Icons: ✅ complete, ⏭ skipped, ▶ not-complete, via `lessonStatusIcon(lessonId)` (reads `studyPlanService.getProgress()`).
- Complete? toggle (`renderCompleteToggle()`, class `complete-toggle`, string `completeQuestion`) lives in the lesson action bar. `setLessonComplete(lessonId, complete)` uses the `zabon.lessonBaseStatus` side-table so unchecking restores the exact prior `skipped` / `in-progress` status.
- Next Up card (`renderNextUpCard()`): with plan → `studyPlanService.getNextLesson()`; without plan → `getNextBrowseLesson()` (tier order Introductory→Intermediate→Advanced, grammar before thematic, first not-complete/not-skipped). Open + Skip buttons both modes; `handleNextUpSkip()` marks `"skipped"`.
- `generateStudyPlan()` preserves complete/skipped statuses across plan regeneration (edit flow); `skipOnboarding()` creates no plan; hamburger `create-plan` button is hidden while a plan exists.
- Exercise Settings: Language configs for Flashcards, Quiz, and Build-a-sentence are wrapped in a collapsible panel (`renderExerciseSettingsPanel`). The panel is closed by default but forced open if `< 2` languages are selected. Flashcards and Quiz auto-start immediately upon rendering if configs are valid; the "Start" buttons have been removed.

## 7. Completed work — DO NOT redo

- Post-B4 Design Changes 1–4 (Complete? checkbox, status icons, unified Next Up card, hamburger Create Study Plan) — implemented and tested.
- Dead-code sweep Steps 1–4 + C5 — all done and tested: garbled `renderStudyPlanProgressSection()` fixed; continue-hint feature fully removed (`renderContinueHint`, `continue-lesson` case, `continueWhereLeftOff` string, `.continue-hint` CSS, `lastLesson` write+key); dead functions/vars removed (`completeOnboarding`, `generateStudyPlanFromAnswers`, `findLessonCategory`, `homeInitialized`); `reviewHistory` key and unused strings (`lessonComplete`, `flashcardSettings`, `planProgress`, `lessonStatusNotStarted`) removed; dead first `renderGrammarSubsection` duplicate removed.
- Open items — addressed and tested: `lessonsTried` persistence restored in `markLessonTried()`; unused `.plan-lesson-status` CSS removed.
- Stage C4 (Collapsible Exercise Settings & Auto-Start) — implemented and tested. Exercise language configs wrapped in a collapsible panel (`data-action="toggle-exercise-settings"`). Start buttons removed; Flashcards and Quiz auto-start on render. Panel forces open on `< 2` languages with error message. `quizSession` tracks `selectedItemId` to preserve answered state on settings toggle.

## 8. Architecture constraints (must not violate)

- `state.lessonLanguages` is the single source of truth for display/exercises.
- All interactions through `bindGlobalEvents()` via `data-action` delegation (exception: form controls with `change` listeners). Native interactive elements like `<details>`/`<summary>` are forbidden for app UI.
- Storage keys namespaced `zabon.*`; theme/font only via `documentElement.dataset`.
- Language-agnostic CSS only; direction via `dir` + logical CSS.
- Any added/removed UI string must respect the 7-language `UI_STRINGS` rule.
- Minimal, scoped changes. No changes to lesson JSON files.
- Leave untouched: lesson JSON, onboarding internals, voice-test, SRS/quiz services, playback machinery (unless a stage explicitly targets them).

## 9. Process rules

- One stage at a time. Deliver the code changes for one stage, then stop and wait for a completion report.
- Manual test cases are listed for each stage. Run them before reporting completion.
- No code is generated until the current stage is confirmed.
- Do not refactor unrelated working code. Changes must be scoped to the stage's deliverables.
- All new UI strings must be added to `UI_STRINGS` with all 7 translations.
- All new interactions go through `bindGlobalEvents()` via `data-action` delegation.
- No lesson JSON files are modified. This is an app-shell redesign only.
- CSS changes must remain language-agnostic. No `[lang]`, `:lang()`, or `[data-lang]` selectors.

## 10. Verification anchors (run these greps on resume to confirm baseline)

- Must return 0 hits (`app.js` + `main.css`): `continueWhereLeftOff`, `continue-hint`, `continue-lesson`, `lastLesson`, `reviewHistory`, `completeOnboarding`, `generateStudyPlanFromAnswers`, `findLessonCategory`, `homeInitialized`, `lessonComplete`, `flashcardSettings`, `planProgress`, `lessonStatusNotStarted`, `mark-complete-btn`, `plan-lesson-status`, `flashcard-start`, `quiz-start`.
- Must return exactly 1 definition each in `app.js`: `renderGrammarSubsection`, `renderStudyPlanProgressSection`, `renderNextUpCard`, `setLessonComplete`, `lessonStatusIcon`, `renderExerciseSettingsPanel`.
- Must return ≥1 hit in `app.js`: `saveJSON(STORAGE_KEYS.lessonsTried` (inside `markLessonTried`).

## 11. Resumption instruction

To resume from a specific stage, tell the assistant:
"Resume from Stage [ID]. Attach the files listed in Section 1. The manifest and lesson data are complete (84 lessons). All prior stages up to C4 are done and tested. Begin Stage [ID]."
The assistant should then read the attached files, run the verification anchors in §10 to confirm the baseline, confirm understanding, and proceed with the specified stage only.
