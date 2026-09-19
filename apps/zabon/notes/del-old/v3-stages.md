Understood. Ignoring legacy Thai progress entirely simplifies the architecture significantly. We will treat the v3 launch as a clean slate: if `state.settings.targetLanguage` is missing, the app halts at the "Select Target Language" prompt, sets the language, and initializes fresh namespaced storage.

Below are the detailed blueprints for **all 5 stages** of Version 3 for your review, followed by the **updated `new-chat.md`** to lock in the v3 context.

---

### Version 3: Stage Blueprints for Review

#### Stage 1: Core Architecture, State Abstraction & First Launch Prompt

- **Gap Analysis:** The app currently hardcodes `th` for defaults and uses flat `zabon.*` storage keys. It lacks a `targetLanguage` state and a first-launch interception mechanism.
- **Task Description:**
  1. Introduce `state.settings.targetLanguage`.
  2. Refactor `STORAGE_KEYS` to be dynamic functions or getters that append the target language (e.g., `zabon.${targetLang}.srs`).
  3. Create a new `target-select-view` in `index.html`.
  4. In `init()`, if `targetLanguage` is missing, render the target selection view instead of `home`. Once selected, save it and initialize the namespaced services.
  5. Remove all hardcoded `"th"` defaults in `ensureExerciseConfigs()` and `renderPhoneticCell()`, replacing them with `state.settings.targetLanguage`.
- **File List:** `app.js`, `index.html`, `main.css`.
- **Verification Checklist:**
  - [ ] App halts at target selection screen on first load.
  - [ ] Selecting a language initializes `zabon.th.srs` (or `fa`, etc.) in LocalStorage.
  - [ ] No hardcoded `"th"` remains in exercise config defaults.

#### Stage 2: Manifest Routing & Grammar Badge Removal

- **Gap Analysis:** The manifest currently points to flat file paths and includes `cat_grammar` and `grammar: []` arrays. The app renders grammar badges and calculates prerequisites.
- **Task Description:**
  1. Update `manifest.json` to use `"file": "lessons/{lang}/..."` for all lesson paths.
  2. Remove the entire `cat_grammar` category from `manifest.json`.
  3. Strip all `"grammar": [...]` arrays from individual lesson definitions in `manifest.json`.
  4. In `app.js`, update `loadLessonFile()` to replace `{lang}` with `state.settings.targetLanguage`.
  5. Delete `renderGrammarBadges()`, `getUnmetGrammarPrerequisites()`, `grammarTagToId()`, and the `renderGrammarSubsection()` logic.
  6. Simplify `StudyPlanService._buildPlan()` to remove grammar prerequisite injection.
- **File List:** `manifest.json`, `app.js`.
- **Verification Checklist:**
  - [ ] `loadLessonFile` successfully resolves `lessons/th/greetings/...` or `lessons/fa/...`.
  - [ ] `cat_grammar` is completely absent from the Home view.
  - [ ] Study Plan generates without injecting grammar lessons.

#### Stage 3: UI/UX & Target Language Dropdown

- **Gap Analysis:** The toolbar lacks a target language selector. Switching target languages needs to seamlessly re-route data and reset the UI.
- **Task Description:**
  1. Add a `<select>` dropdown next to the "Zabon" title in the toolbar.
  2. Populate it with the `manifest.zabon.languages` array (Flag + Localized Name).
  3. Implement the safeguard: if the user selects the `appLanguage` as the `targetLanguage`, force a fallback or show a warning.
  4. On dropdown change: update `state.settings.targetLanguage`, re-initialize namespaced storage keys, clear current lesson state, and route to `home`.
- **File List:** `index.html`, `main.css`, `app.js`.
- **Verification Checklist:**
  - [ ] Dropdown renders correctly in the toolbar.
  - [ ] Switching from Thai to Farsi instantly updates the Home view to show Farsi categories (once data exists).
  - [ ] Cannot select the current App Language as the Target Language.

#### Stage 4: Farsi Data & The New Script Display Mode

- **Gap Analysis:** Farsi data does not exist. The CSS/JS lacks a display mode for Perso-Arabic script connections (isolated, initial, medial, final).
- **Task Description:**
  1. Define the new `"displayMode": "script"` in `app.js` (`renderItemColumn`).
  2. Create CSS for `.script-cell` in `main.css` to display the base character prominently, with connection indicators (e.g., small text showing initial/medial forms or connecting tails).
  3. Update `manifest.json`'s `cat_reading_writing` to use `{lang}` routing and add the Farsi reading/writing lessons.
  4. Generate the Farsi `cat_reading_writing` JSON data (`lessons/fa/reading-writing/...`) utilizing the new `script` display mode structure.
- **File List:** `app.js`, `main.css`, `manifest.json`, `lessons/fa/reading-writing/*.json`.
- **Verification Checklist:**
  - [ ] Farsi reading lesson loads without errors.
  - [ ] The `script` display mode renders the Perso-Arabic connection rules clearly.
  - [ ] Thai reading/writing still uses the `phonetic` display mode correctly.

#### Stage 5: i18n Polish & Edge Cases

- **Gap Analysis:** `UI_STRINGS` contains hardcoded language names (e.g., "Your current Thai level?"). TTS voices need to dynamically adapt.
- **Task Description:**
  1. Update `UI_STRINGS` to use dynamic placeholders (e.g., `"Your current {targetLanguage} level?"`).
  2. Ensure `MediaService` and Voice Test dynamically query the BCP47 code of the _Target Language_, not the App Language.
  3. Verify RTL/LTR mixed-direction rendering in the lesson columns (Farsi RTL next to English LTR).
- **File List:** `app.js`.
- **Verification Checklist:**
  - [ ] Onboarding and UI strings dynamically reflect the selected target language.
  - [ ] TTS playback uses the correct Farsi/Thai voice regardless of the App Language.
  - [ ] Mixed RTL/LTR columns render without breaking the "book-like" layout.

---

### Updated `new-chat.md` (v3 Baseline)

```markdown
Zabon — v3 Multi-Target Baseline & Rules
v3 — Multi-Target Architecture, No Grammar Badges, Namespaced Storage 0. Session Recovery Log (read first)
The v3 app code is the active baseline.
Key v3 changes from v2:

- Multi-Target: The app now supports multiple target languages (Thai, Farsi, etc.) via a toolbar dropdown.
- No Legacy Migration: v3 starts with a clean slate. Existing v2 Thai progress is ignored.
- Namespaced Storage: All progress keys are now scoped to the target language (e.g., `zabon.th.srs`, `zabon.fa.srs`).
- Grammar Badges Removed: `cat_grammar` and all `grammar: []` tags have been removed. Study plans no longer inject grammar prerequisites.
- Manifest Routing: `manifest.json` uses `{lang}` templates for file paths (e.g., `lessons/{lang}/greetings/...`).
- Script Display Mode: A new `"displayMode": "script"` handles Perso-Arabic connection rules for Farsi.

1. Files attached at new-chat start
   `app.js` — the single IIFE (v3 baseline)
   `index.html` — the app shell
   `main.css` — language-agnostic design system
   `manifest.json` — multi-target language registry + categories
   `new-chat.md` — this document

2. Project overview
   Zabon is a language-learning web app: vanilla HTML/CSS/JS, no frameworks.
   The UI supports 7 app languages (`en, th, fa, ar, es, zh, ja`).
   The Target Language (what the user is learning) is selectable (e.g., `th`, `fa`).
   Content is routed dynamically based on the Target Language.

3. Architecture
   Single IIFE in `app.js`.
   State includes `state.settings.targetLanguage` (defaults to `th` on first launch after prompt).
   Storage keys are dynamically generated: `zabon.${targetLang}.srs`, etc.
   Manifest uses `{lang}` templating for lesson file paths.

4. Current verified state (v3 baseline)
   app.js: `STORAGE_KEYS` are dynamic. `UI_STRINGS` use `{targetLanguage}` placeholders. `cat_grammar` logic is fully removed. `loadLessonFile()` resolves `{lang}`.
   main.css: Includes `.script-cell` for Perso-Arabic connection rendering.
   manifest.json: Uses `"file": "lessons/{lang}/..."`. No `grammar` arrays.
   lessons/: Thai data exists in `lessons/th/`. Farsi data exists in `lessons/fa/`.

5. Storage-key map (Namespaced)
   | Key Pattern | Written by | Read by |
   | --- | --- | --- |
   | zabon.settings | saveState() | init() |
   | zabon.lessonLanguages | saveState() | init() |
   | zabon.${lang}.srs | SrsService | SrsService |
| zabon.${lang}.quiz | QuizProgressService | QuizProgressService |
   | zabon.${lang}.lessonsTried | markLessonTried() | init() |
| zabon.${lang}.studyPlan | StudyPlanService | StudyPlanService |
   | zabon.${lang}.studyPlanProgress | StudyPlanService | StudyPlanService |

6. Status model & key behaviors
   Lesson status values: `"complete" | "in-progress" | "skipped"`.
   Target Language Safeguard: `targetLanguage` cannot equal `appLanguage`.
   First Launch: If `targetLanguage` is missing, app halts at target selection view.
   Display Modes: `"phonetic"` (Thai script), `"script"` (Perso-Arabic connections), default (standard columns).

7. Architecture constraints
   `state.settings.targetLanguage` dictates data routing and storage namespacing.
   `state.lessonLanguages` dictates display columns and exercise pairs.
   All interactions through `bindGlobalEvents()`.
   Language-agnostic CSS only; direction via `dir` + logical CSS.

8. Process rules
   One stage at a time. Deliver one stage, then stop and wait for a completion report.
   No code/data is generated until the current stage is confirmed.
   Present the task description and file list before producing a deliverable.

9. Verification anchors (v3)
   Must return 0 hits in `app.js`: `cat_grammar`, `renderGrammarBadges`, `getUnmetGrammarPrerequisites`, `grammarTagToId`.
   Must return ≥1 hit in `app.js`: `state.settings.targetLanguage`, `zabon.${`, `lessons/{lang}`, `displayMode === "script"`.
   Must return ≥1 hit in `manifest.json`: `"file": "lessons/{lang}/`, `"displayMode": "script"`.

10. Data generation rules (v3 lesson format)
    Routing: All lesson files must be placed in `lessons/{lang}/` matching the manifest `{lang}` template.
    Display Modes:

- Default: standard word/sentence columns.
- `"phonetic"`: Large character + localized phonetic note (used for Thai).
- `"script"`: Base character + connection indicators (used for Farsi/Arabic). Requires `connections` object in item data.
  Validation: run `node tools/check-lessons.js` after saving.
```

---

### Next Steps

If these 5 stage blueprints and the updated `new-chat.md` accurately capture the v3 vision, **give me the green light**, and I will generate the exact task description, file list, and code deliverables for **Stage 1**.
