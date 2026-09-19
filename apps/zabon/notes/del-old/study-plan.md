Here is the complete, updated `study-plan.md`. It is designed to be your master control document. You will copy and paste the "Prompt for New Chat" sections into fresh conversations to execute each stage strictly and safely.

---

# 📘 Zabon App: Master Study Plan & Execution Protocol

## 🛑 Global Execution Rules (Strict Workflow)

To prevent AI context drift and ensure architectural integrity, this project strictly follows a **Chat-per-Stage** execution model.

1. **One Chat = One Stage:** Never combine stages. If a stage fails its Acceptance Tests, **do not fix it in the same chat**.
2. **The Rollback Protocol:** If the AI hallucinates, deviates from the schema, or fails the tests, you must:
   - Close the chat.
   - Run `git branch -D stage-X-<name>` in your terminal to delete the failed branch.
   - Open a **new chat** and paste the exact same prompt.
3. **File Uploads:** You must upload the exact files listed in each stage's prompt to give the AI a narrow, focused context.
4. **Acceptance Tests:** Do not approve the AI's output or commit the code until every single Acceptance Test passes in the browser/DevTools.

---

## 🟢 STAGE 1: Data Layer & Content Generation (Clean Slate)

**Goal:** Discard all legacy lesson data. Generate the new 15-Milestone `manifest.json` and the 15 new milestone content files (`M1.json` through `M15.json`) using the strict `texts` object and `role` schema.

### 📋 Prompt for New Chat (Copy & Paste)

```text
Welcome to Stage 1 of the Zabon App refactoring. We are executing a clean-slate data migration.

CONTEXT:
We are replacing the legacy flat `categories/lessons` structure with a linear, state-machine-driven 15-Milestone architecture (Spiral Mastery).
- Legacy data in the `lessons/` directory is to be completely ignored and deleted.
- We are generating a new `milestones/` directory from scratch.
- Language enforcement is handled via the `texts` object in the content files, NOT the manifest.
- Items use `role: "target"` (SRS tracked) or `role: "context"` (supporting).

FILES TO UPLOAD:
- `manifest.json` (For reference of the old structure, which we are replacing)
- `app.js` (For reference of the current app state)

YOUR TASK:
1. Delete/ignore all references to the old `lessons/` directory.
2. Generate the new `manifest.json` containing the 15 Core Milestones (M1-M15) grouped by 3 tiers (beginner, intermediate, advanced). Include `priority_tags` for the 5 language-agnostic goals.
3. Generate the content files for `milestones/M1.json` through `milestones/M15.json`.
   - M1 must be fully fleshed out as the perfect template.
   - M2-M15 should follow the exact same schema, populated with appropriate spiral-mastery content for their respective themes.
4. Ensure every item in the content files has a `texts` object containing all 7 language codes (en, th, fa, ar, es, zh, ja).

ACCEPTANCE TESTS (Do not finish until I verify these):
1. The `manifest.json` contains exactly 15 milestones, no `categories` array, and valid `priority_tags`.
2. The `milestones/` directory contains `M1.json` through `M15.json`.
3. In `M1.json`, every item has a `texts` object with exactly 7 language keys.
4. Items are correctly tagged with `role: "target"` or `role: "context"`.

Please confirm you understand the context and schema, and then generate the files.
```

### 🔀 Git Commands

```bash
git checkout -b stage-1-data-generation
# ... AI generates files ...
git add manifest.json milestones/
git commit -m "Stage 1: Clean slate data generation (15 Milestones)"
```

---

## 🟢 STAGE 2: The Engine (Services & State Machine)

**Goal:** Refactor `app.js` to replace `StudyPlanService` with `MilestoneService`. Implement the State Machine, Dual-Path Completion, and Cascade Revert logic.

### 📋 Prompt for New Chat (Copy & Paste)

```text
Welcome to Stage 2 of the Zabon App refactoring. We are building the Engine.

CONTEXT:
We have the new 15-Milestone data structure from Stage 1. Now we must update `app.js` to drive it.
- We are deleting `StudyPlanService` and creating `MilestoneService`.
- Storage keys `studyPlan`, `studyPlanProgress`, and `lessonBaseStatus` are deprecated. We will use `milestoneProgress`.
- The State Machine states are: LOCKED -> UNLOCKED -> IN_PROGRESS -> COMPLETED.
- Dual-Path Completion:
  1. Automated: All `role: "target"` items reach `unlock_requirements.srs_box_level` AND `grammar_quiz` passes `grammar_quiz_pass_pct`.
  2. Manual Override: User checks the "Complete?" box.
- Cascade Revert: If a user unchecks the manual override, the milestone reverts to IN_PROGRESS, and all downstream milestones cascade back to LOCKED. Global SRS/Quiz data is PRESERVED.

FILES TO UPLOAD:
- `app.js` (Current version)
- `manifest.json` (From Stage 1)
- `milestones/M1.json` (From Stage 1, for schema reference)

YOUR TASK:
1. Update `STORAGE_KEYS` in `app.js`: Deprecate old study plan keys, add `milestoneProgress`.
2. Delete the `StudyPlanService` class.
3. Implement the `MilestoneService` class with the following methods:
   - `initializeProgress()`: Sets M1 to UNLOCKED, M2-M15 to LOCKED.
   - `getMilestoneState(id)`: Returns current state.
   - `setMilestoneComplete(id, isComplete)`: Handles Manual Override AND the Cascade Revert logic.
   - `evaluateAutoCompletion(id)`: Checks global SRS and Grammar Quiz state to trigger Automated completion.
   - `getNextMilestone()`: Implements the "Next Up" priority algorithm (In-Progress -> Goal-Tagged Unlocked -> Lowest Number Unlocked).
4. Update `resetTargetScopedServices()` to initialize the new `MilestoneService`.

ACCEPTANCE TESTS:
1. In DevTools, verify `zabon.th.milestoneProgress` initializes with M1 as `UNLOCKED` and M2 as `LOCKED`.
2. Call `MilestoneService.setMilestoneComplete('M1', true)`. Verify M1 becomes `COMPLETED` (manual_override) and M2 becomes `UNLOCKED`.
3. Call `MilestoneService.setMilestoneComplete('M1', false)`. Verify M1 reverts to `IN_PROGRESS` and M2 cascades back to `LOCKED`.
4. Verify that the global `zabon.th.srs` data was NOT deleted during the revert.

Please confirm you understand the State Machine logic and implement the changes in `app.js`.
```

### 🔀 Git Commands

```bash
git checkout -b stage-2-engine-state-machine
# ... AI updates app.js ...
git add app.js
git commit -m "Stage 2: Implement MilestoneService and State Machine"
```

---

## 🟢 STAGE 3: Onboarding & Goal Mapping

**Goal:** Update the onboarding flow to use the 5 new language-agnostic goals and map them to the Milestone `priority_tags`.

### 📋 Prompt for New Chat (Copy & Paste)

```text
Welcome to Stage 3 of the Zabon App refactoring. We are updating Onboarding & Goals.

CONTEXT:
The old goals (Travel, Business, Everyday, Exam) are replaced by 5 language-agnostic goals:
1. Survival & Travel (survival)
2. Social & Everyday (social)
3. Professional & Business (professional)
4. Media & Literacy (media)
5. Cultural Integration (cultural)

These goals do not generate separate lesson trees. Instead, the selected goal is saved to `state.settings.userGoal` and used by `MilestoneService.getNextMilestone()` to prioritize milestones based on their `priority_tags` in the manifest.

FILES TO UPLOAD:
- `app.js` (Current version with MilestoneService)
- `manifest.json` (To verify priority_tags)

YOUR TASK:
1. Update `UI_STRINGS` in `app.js`: Replace `onboardingGoalTravel`, `Business`, `Everyday`, `Exam` with the 5 new goals (Survival, Social, Professional, Media, Cultural) across all 7 languages.
2. Update `normalizeOnboardingAnswers`: Change `validGoals` to `["survival", "social", "professional", "media", "cultural"]`.
3. Update `renderOnboarding`: Update the radio button generation to use the new goal values and UI strings.
4. Update `generateStudyPlan`: Instead of calling the old plan generation, simply save the `userGoal` to `state.settings.userGoal`, save onboarding complete, and ensure `MilestoneService` is initialized.
5. Update `MilestoneService.getNextMilestone()` (if not fully completed in Stage 2) to read `state.settings.userGoal` and sort unlocked milestones by matching `priority_tags`.

ACCEPTANCE TESTS:
1. Clear local storage and reload. The onboarding screen shows the 5 new goals.
2. Select "Survival & Travel" and complete onboarding.
3. In DevTools, verify `zabon.settings` contains `userGoal: "survival"`.
4. Verify that the "Next Up" card on the home screen points to a milestone tagged with "survival" (e.g., M2 Survival Needs).

Please confirm and implement the changes.
```

### 🔀 Git Commands

```bash
git checkout -b stage-3-onboarding-goals
# ... AI updates app.js ...
git add app.js
git commit -m "Stage 3: Update onboarding to 5 language-agnostic goals"
```

---

## 🟢 STAGE 4: UI/UX Overhaul (Views & Feedback)

**Goal:** Refactor the Home, Next Up, and Lesson views to visually represent the Milestone State Machine and provide Auto-Completion feedback.

### 📋 Prompt for New Chat (Copy & Paste)

```text
Welcome to Stage 4 of the Zabon App refactoring. We are overhauling the UI/UX.

CONTEXT:
The backend (MilestoneService, State Machine, Goals) is complete. Now we must update the UI to reflect the 15-Milestone structure.
- The Home screen no longer shows flat categories. It shows Milestones grouped by Tier (Beginner, Intermediate, Advanced).
- Milestones have visual states: LOCKED (greyed/locked icon), UNLOCKED (play icon), IN_PROGRESS (yellow indicator), COMPLETED (checkmark).
- The Lesson view needs a progress indicator showing why a milestone isn't auto-completed yet (e.g., "Vocab: 12/20 | Grammar: 60%").

FILES TO UPLOAD:
- `app.js` (Current version)
- `manifest.json`
- `index.html` (If structural DOM changes are needed for the new views)

YOUR TASK:
1. Refactor `renderHome()`: Remove `groupCategoriesByProficiency()`. Implement `renderMilestoneList()` that groups the 15 milestones by `tier` and renders them with the correct visual state icons based on `MilestoneService.getMilestoneState(id)`.
2. Refactor `renderNextUpCard()`: Update it to call `MilestoneService.getNextMilestone()` and display the Milestone's `theme` and `grammar_focus`.
3. Refactor `renderLesson()` & `renderCompleteToggle()`:
   - The checkbox now calls `MilestoneService.setMilestoneComplete(id, checked)`.
   - Add a visual progress text above the checkbox (e.g., "Auto-complete progress: Vocab 12/20 | Grammar Quiz 60% (Need 80%)"). This requires calculating the current SRS box levels of `target` items and the best grammar quiz score.
4. Ensure clicking a LOCKED milestone does nothing (or shows a tooltip), while UNLOCKED/IN_PROGRESS/COMPLETED opens the lesson.

ACCEPTANCE TESTS:
1. Home screen displays 3 collapsible tiers containing the 15 milestones.
2. M1 is clickable (UNLOCKED). M2 has a lock icon and is unclickable (LOCKED).
3. Check the "Complete?" box on M1. Verify M1 gets a checkmark, and M2's lock icon disappears (becomes UNLOCKED).
4. Uncheck the box. Verify M1 loses the checkmark, and M2 gets the lock icon back.
5. Open M1. Verify the "Auto-complete progress" text accurately reflects the SRS and Quiz status.

Please confirm and implement the UI changes.
```

### 🔀 Git Commands

```bash
git checkout -b stage-4-ui-ux-overhaul
# ... AI updates app.js / index.html ...
git add app.js index.html
git commit -m "Stage 4: UI/UX overhaul for Milestone State Machine"
```

---

## 🟢 STAGE 5: Grammar Quiz Integration & Final Polish

**Goal:** Connect the Grammar Quiz to the State Machine's automated completion requirements and perform final cleanup.

### 📋 Prompt for New Chat (Copy & Paste)

```text
Welcome to Stage 5 (Final Stage) of the Zabon App refactoring. We are integrating the Grammar Quiz and polishing.

CONTEXT:
The State Machine requires a Grammar Quiz to pass (e.g., >= 80%) for Automated Completion. Currently, the app has a general `QuizService`, but we need a specific flow for the Milestone Grammar Quiz that updates the `ProgressState`.

FILES TO UPLOAD:
- `app.js` (Current version)
- `milestones/M1.json` (To add/verify `grammar_questions` structure)

YOUR TASK:
1. Update `milestones/M1.json` (and M2-M15) to include a `grammar_questions` array containing multiple-choice questions specifically for the milestone's grammar rule.
2. In `app.js`, add a dedicated "Grammar Quiz" button in the Lesson View (`renderLesson`).
3. When the user clicks this button, use the existing `QuizService` logic but restricted to the `grammar_questions` pool.
4. Upon finishing the Grammar Quiz, calculate the accuracy percentage.
5. Update `ProgressState.milestones[id].grammar_quiz = { best_accuracy: X, attempts: Y, passed: X >= unlock_pct }`.
6. Immediately call `MilestoneService.evaluateAutoCompletion(id)` to see if the milestone should flip to `COMPLETED`.
7. Final cleanup: Remove any dead code, unused legacy functions (like old study plan generators), and ensure no console errors exist.

ACCEPTANCE TESTS:
1. Open M1. Click the "Grammar Quiz" button.
2. Answer the questions. Finish the quiz.
3. In DevTools, verify `zabon.th.milestoneProgress.milestones.M1.grammar_quiz` shows the correct `best_accuracy` and `passed` status.
4. If the accuracy is >= 80% AND all target vocab is at the required SRS box level, verify M1 automatically flips to `COMPLETED` without needing to check the manual override box.
5. Run a full Lighthouse/Console check to ensure zero errors and clean legacy code.

Please confirm and implement the final stage.
```

### 🔀 Git Commands

```bash
git checkout -b stage-5-grammar-quiz-final
# ... AI updates app.js and milestone JSONs ...
git add app.js milestones/
git commit -m "Stage 5: Grammar Quiz integration and final cleanup"
git checkout main
git merge stage-5-grammar-quiz-final
```
