This is the perfect final step. Defining the exact **Definition of Done** for each stage ensures that neither you nor the AI moves forward with broken or incomplete logic.

By adding the `[APPROVAL TESTS]` block to every prompt, the AI knows exactly what conditions its code must satisfy, and you have a strict checklist to verify before committing to the Git branch.

Here are the **final, complete, copy-pasteable prompts for all 13 stages**. Each is fully self-contained for a new chat.

---

### 📋 Stage 1: Plumbing, Action Bar & View Registration

**Files to upload (2):** `index.html`, `app.js`

```text
Context: We are building a vanilla JS, mobile-first, language-agnostic SPA. The app uses a massive `switch(action)` in `bindGlobalEvents()` and a `VIEW_IDS` array in `app.js`. We are adding a new `kind: "letter"`.

Stage Goal: Add HTML skeletons for 3 new Letter views, register them in the JS router, and update the Action Bar to dynamically show/hide Letter-specific buttons based on the lesson's `kind`.

Git Branch: `feat/letter-plumbing-routing`

[PRE-FLIGHT CHECK - DO NOT WRITE CODE YET]
Before writing code, output:
1. The exact HTML elements added to `index.html` for the 3 views and 3 Action Bar buttons.
2. The exact strings added to `VIEW_IDS` in `app.js`.
3. The exact `case` statements added to `switch(action)` in `bindGlobalEvents()`.
4. The logic flow for how `renderLesson()` toggles Action Bar buttons based on `kind`.

[APPROVAL TESTS - MUST PASS BEFORE MERGING]
1. Inspect the DOM: The 3 new view IDs exist in `index.html`.
2. Open a mock lesson with `kind: "letter"`: The Action Bar hides Word/Sentence buttons and shows the 3 new Letter buttons.
3. Open a standard lesson: The Action Bar shows the standard Word/Sentence buttons and hides the Letter buttons.
4. Clicking the new Letter buttons triggers the new `case` statements without throwing JS errors.

[STRICT CODE OUTPUT RULES]
DO NOT regenerate entire files. ONLY output specific blocks to add/modify using:
1. // 🔍 FIND THIS (in [filename]): \n [exact lines] \n // ✏️ REPLACE WITH: \n [new code]
2. // 📍 INSERT AFTER [function name] in [filename]: \n [new code]
3. // 📍 INSERT NEW CASES inside the switch(action) block in app.js: \n [new cases]
```

---

### 📋 Stage 2: Home View "Alphabet" Panel

**Files to upload (2):** `index.html`, `app.js`

```text
Context: We are building a vanilla JS language learning SPA. We have added the new Letter views and Action Bar routing.

Stage Goal: Add the "Alphabet" collapsible panel to the Home view, positioned directly below the proficiency tiers.

Git Branch: `feat/letter-home-panel`

[PRE-FLIGHT CHECK - DO NOT WRITE CODE YET]
Before writing code, output:
1. The exact HTML structure generated in `app.js` for the "Alphabet" panel.
2. The exact location in `renderHome()` where this panel is injected (must be AFTER `renderMilestoneList()`).
3. The logic for how the panel determines content based on `state.settings.targetLanguage`.

[APPROVAL TESTS - MUST PASS BEFORE MERGING]
1. Open the Home view: The "Alphabet" panel is visible below the Beginner/Intermediate/Advanced tiers.
2. Click the panel header: It successfully expands and collapses.
3. Change the target language in settings: The panel updates to reflect the new language context.

[STRICT CODE OUTPUT RULES]
DO NOT regenerate entire files. ONLY output specific blocks to add/modify using the 🔍 FIND / ✏️ REPLACE and 📍 INSERT AFTER patterns.
```

---

### 📋 Stage 3: JSON Schema, UI Strings & DataService

**Files to upload (1):** `app.js`

```text
Context: We are building a vanilla JS language learning SPA. We have added the "Alphabet" panel and Action Bar routing for `kind: "letter"`.

Stage Goal: Define the strict JSON Schema for `kind: "letter"` items, add UI strings to `UI_STRINGS`, and ensure `DataService` identifies the "letter" kind.

Git Branch: `feat/letter-schema-strings`

[PRE-FLIGHT CHECK - DO NOT WRITE CODE YET]
Before writing code, output:
1. The exact JSON Schema structure for a `kind: "letter"` item (id, kind, role, texts, phonetic, connections, meta).
2. The exact keys added to `UI_STRINGS` for the new exercises (e.g., letterFlashcards, letterQuiz, letterSpell) with English translations.

[APPROVAL TESTS - MUST PASS BEFORE MERGING]
1. Inspect `app.js`: The new UI strings exist and have translations for all 7 languages (or at least fallback to English).
2. In the browser console, create a mock letter item and pass it to `DataService.getItemKind()`. It must return `"letter"`.

[STRICT CODE OUTPUT RULES]
DO NOT regenerate entire files. ONLY output specific blocks to add/modify using the 🔍 FIND / ✏️ REPLACE and 📍 INSERT AFTER patterns.
```

---

### 📋 Stage 4: Letter Flashcards

**Files to upload (3):** `index.html`, `app.js`, `main.css`

```text
Context: We are building a vanilla JS language learning SPA. We have defined the JSON Schema and UI strings. The `letter-flashcard-view` HTML skeleton exists.

Stage Goal: Implement the language-agnostic JS logic and UI rendering for Letter Flashcards inside the dedicated view.

CRITICAL RULE: Do NOT modify the existing `renderFlashcards()`. Create a completely new function `renderLetterFlashcards()`.

Git Branch: `feat/letter-flashcards`

[PRE-FLIGHT CHECK - DO NOT WRITE CODE YET]
Before writing code, output:
1. How `renderLetterFlashcards()` displays the character, name, and phonetics.
2. How it reuses `renderScriptCell()` logic for contextual forms if `connections` exist.
3. The new `case` statements for `bindGlobalEvents()`.

[APPROVAL TESTS - MUST PASS BEFORE MERGING]
1. Click the Letter Flashcard button: The `letter-flashcard-view` opens.
2. The front of the card shows the target letter character.
3. Click "Show Answer": The back shows the name, phonetic note, and the 4-column contextual forms grid (if applicable).
4. Clicking "Again/Hard/Good/Easy" advances to the next card without errors.

[STRICT CODE OUTPUT RULES]
DO NOT regenerate entire files. ONLY output specific blocks to add/modify using the 🔍 FIND / ✏️ REPLACE, 📍 INSERT AFTER, and append CSS to the bottom of `main.css`.
```

---

### 📋 Stage 5: Letter Quiz

**Files to upload (3):** `index.html`, `app.js`, `main.css`

```text
Context: We are building a vanilla JS language learning SPA. We have implemented Letter Flashcards. The `letter-quiz-view` HTML skeleton exists.

Stage Goal: Implement the language-agnostic JS logic and UI rendering for the Letter Quiz inside the dedicated view.

CRITICAL RULE: Do NOT modify the existing `renderQuiz()`. Create a completely new function `renderLetterQuiz()`.

Git Branch: `feat/letter-quiz`

[PRE-FLIGHT CHECK - DO NOT WRITE CODE YET]
Before writing code, output:
1. How `renderLetterQuiz()` presents questions (e.g., play audio -> pick character).
2. The JS logic for generating 3 distractor options from the lesson's letter pool.
3. The new `case` statements for `bindGlobalEvents()`.

[APPROVAL TESTS - MUST PASS BEFORE MERGING]
1. Click the Letter Quiz button: The `letter-quiz-view` opens.
2. The question displays (audio plays or text shows).
3. Four distinct letter options are presented.
4. Clicking the correct option shows "Correct" feedback; clicking wrong shows "Incorrect".
5. Clicking "Next" loads the next question.

[STRICT CODE OUTPUT RULES]
DO NOT regenerate entire files. ONLY output specific blocks to add/modify using the 🔍 FIND / ✏️ REPLACE, 📍 INSERT AFTER, and append CSS to the bottom of `main.css`.
```

---

### 📋 Stage 6: Letter Spell Exercise (Audio-Only)

**Files to upload (3):** `index.html`, `app.js`, `main.css`

```text
Context: We are building a vanilla JS language learning SPA. We have implemented Letter Flashcards and Quiz. The `letter-spell-view` HTML skeleton exists.

Stage Goal: Implement the Letter Spell exercise inside the `letter-spell-view`.
This goal is partially implemented but there is a bug! As a first selection, you can only select one letter from the pool of letters.  There may be redundant code as this exercise started as spell a word and now simplified to select the correct letter from the pool of letters.

CRITICAL RULES:
- The prompt must be ONLY an audio play icon. NO text is shown for the target word.
- The user taps letters from a shuffled pool to build the word in a target area.
- Validation checks the exact array order of tapped chips.

Git Branch: `feat/letter-spell`

[PRE-FLIGHT CHECK - DO NOT WRITE CODE YET]
Before writing code, output:
1. The HTML/JS structure for the UI: audio button, target build area, and shuffled pool.
2. How you handle the "chip pool" for languages without spaces (TH, JA, ZH).
3. The JS logic for shuffling, tap events, and validation.
4. How RTL layout is enforced for FA/AR.

[APPROVAL TESTS - MUST PASS BEFORE MERGING]
1. Click the Letter Spell button: The view opens.
2. Verify NO text is shown for the target word, ONLY an audio play icon.
3. Play audio -> Tap letters in correct order -> Verify "Correct" feedback.
4. Tap letters in wrong order -> Verify "Try again" feedback.
5. Verify the layout respects RTL when the target language is FA or AR.

[STRICT CODE OUTPUT RULES]
DO NOT regenerate entire files. ONLY output specific blocks to add/modify using the 🔍 FIND / ✏️ REPLACE, 📍 INSERT AFTER, and append CSS to the bottom of `main.css`.
```

---

### 📋 Stages 7 to 13: Language Data Implementation

_For Stages 7 through 13, you do not need to upload any files. You simply paste the prompt below, changing the **[LANGUAGE]**, **[CODE]**, **[BRANCH]**, and **[SCHEMA EXAMPLE]** for each stage._

```text
Context: We are building a vanilla JS language learning SPA. We have implemented the core UI and logic for `kind: "letter"` exercises (Flashcards, Quiz, and an Audio-only "Spell" exercise).

Stage Goal: Create the [LANGUAGE] ([CODE]) alphabet JSON data file.

Git Branch: `feat/letter-data-[CODE]`

Reference JSON Schema for `kind: "letter"`:
[INSERT THE EXACT SCHEMA EXAMPLE FOR THIS LANGUAGE HERE - see below]

[PRE-FLIGHT CHECK - DO NOT WRITE CODE YET]
Before writing code, output:
1. A sample of 3-4 [LANGUAGE] items formatted strictly according to the schema above.
2. The exact filename and directory path (e.g., `alphabet/[CODE].json`).

[APPROVAL TESTS - MUST PASS BEFORE MERGING]
1. Load the app with [LANGUAGE] as the target.
2. Open the "Alphabet" panel: The [LANGUAGE] letters/characters render correctly.
3. Run the Flashcards: Characters and phonetics display correctly.
4. Run the Quiz: Audio plays and options match the [LANGUAGE] script.
5. Run the Spell exercise: The audio plays the word, and the correct letter chips appear in the pool.
*(For FA/AR only: Verify RTL layout and contextual forms in Flashcards).*

[STRICT CODE OUTPUT RULES]
Only output the new JSON file content. Do not modify `app.js` or `main.css`.
```

#### Specific Schema Examples to insert into the Template for Stages 7-13:

**Stage 7 (TH):**

```json
{
  "id": "th_ko_kai",
  "kind": "letter",
  "role": "target",
  "texts": { "th": "ก", "en": "Ko Kai" },
  "phonetic": { "en": "/k/" },
  "connections": {
    "isolated": "ก",
    "initial": "ก",
    "medial": "ก",
    "final": "ก"
  },
  "meta": { "category": "consonant", "tone_class": "mid" }
}
```

**Stage 8 (FA):**

```json
{
  "id": "fa_alef",
  "kind": "letter",
  "role": "target",
  "texts": { "fa": "آ", "en": "Alef" },
  "phonetic": { "en": "/ʔ/" },
  "connections": {
    "isolated": "آ",
    "initial": "آ",
    "medial": "ـا",
    "final": "ـا"
  },
  "meta": { "category": "vowel" }
}
```

**Stage 9 (EN):**

```json
{
  "id": "en_a",
  "kind": "letter",
  "role": "target",
  "texts": { "en": "A" },
  "phonetic": { "en": "/eɪ/" },
  "connections": {
    "isolated": "A",
    "initial": "A",
    "medial": "A",
    "final": "A"
  },
  "meta": { "category": "vowel" }
}
```

**Stage 10 (AR):**

```json
{
  "id": "ar_alef",
  "kind": "letter",
  "role": "target",
  "texts": { "ar": "ا", "en": "Alef" },
  "phonetic": { "en": "/a/" },
  "connections": {
    "isolated": "ا",
    "initial": "ا",
    "medial": "ـا",
    "final": "ـا"
  },
  "meta": { "category": "consonant" }
}
```

**Stage 11 (JA):**

```json
{
  "id": "ja_a",
  "kind": "letter",
  "role": "target",
  "texts": { "ja": "あ", "en": "a" },
  "phonetic": { "en": "/a/" },
  "connections": {
    "isolated": "あ",
    "initial": "あ",
    "medial": "あ",
    "final": "あ"
  },
  "meta": { "category": "hiragana" }
}
```

**Stage 12 (ZH):**

```json
{
  "id": "zh_ren",
  "kind": "letter",
  "role": "target",
  "texts": { "zh": "人", "en": "person" },
  "phonetic": { "en": "rén" },
  "connections": {
    "isolated": "人",
    "initial": "人",
    "medial": "人",
    "final": "人"
  },
  "meta": { "category": "radical", "strokes": 2 }
}
```

**Stage 13 (ES):**

```json
{
  "id": "es_a",
  "kind": "letter",
  "role": "target",
  "texts": { "es": "A" },
  "phonetic": { "en": "/a/" },
  "connections": {
    "isolated": "A",
    "initial": "A",
    "medial": "A",
    "final": "A"
  },
  "meta": { "category": "vowel" }
}
```

---

### Execution Summary

You now have a **13-stage, drift-proof implementation plan**.

1. Open a new chat.
2. Upload the exact files listed for that stage.
3. Paste the prompt.
4. Review the Pre-Flight Check.
5. Let the AI generate the Delta-Only code.
6. Run the Approval Tests in your browser.
7. Commit to the specified Git branch.

You are fully ready to begin Stage 1!
