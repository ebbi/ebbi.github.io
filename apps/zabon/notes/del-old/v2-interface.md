Here is the updated and comprehensive staged implementation plan, incorporating your original requirements and the new omissions. The plan is structured to be executed one stage at a time in separate chats to prevent context loss, with clear acceptance tests for each step.

---

# Staged Implementation Plan for Zabon Modifications

## Stage 1 — Clickable "Zabon" Toolbar Header

**Scope:** Make the app title in the fixed toolbar navigate to the home page when tapped/clicked.

**Files affected:**

- `index.html` — The toolbar title element needs a `data-action` attribute (e.g., `data-action="go-home-header"`) or to be wrapped in a button so the global event delegation can intercept it.
- `app.js` — Add a new `case` in the global click handler's `switch` block that calls `goHome()`.

**Comments:**

- This is a low-risk, isolated change. The `goHome()` function already exists.
- Ensure the title element has an appropriate `aria-label` and `cursor: pointer` styling for accessibility and UX.

**Acceptance test:**

1. Navigate to any view (lesson, flashcards, quiz, settings, etc.).
2. Tap the "Zabon" text in the top toolbar.
3. **Expected:** The app returns to the home view. No console errors.

---

## Stage 2 — Rename "Introductory" to "Beginner" & Append "lessons" to Next-Up Card

**Scope:**

1. Globally rename the "Introductory" proficiency tier to "Beginner".
2. In the `next-up-card__meta` row, append the word "lessons" to the tier label (e.g., "🌱 Beginner lessons").

**Files affected:**

- `app.js` —
  - Update `UI_STRINGS.tierIntroductory` to "Beginner" (and provide the correct translations for all 7 app languages).
  - In `renderNextUpCard()`, modify the `levelSpan` text assembly to append the localized word for "lessons" (you may need to add a new `UI_STRINGS` key like `lessonsLabel` to maintain i18n integrity, rather than hardcoding the English word).

**Comments:**

- Changing the `tierIntroductory` string automatically updates the home page tier header and the Next Up card base label.
- Appending "lessons" specifically in `renderNextUpCard()` ensures we don't accidentally break the header titles on the home page or study plan panels, which should just say "Beginner", not "Beginner lessons".

**Acceptance test:**

1. Load the home page. **Expected:** The first tier header reads "🌱 Beginner" (not "Introductory").
2. Ensure a Next Up card is visible. **Expected:** The meta row displays "🌱 Beginner lessons" (or the localized equivalent).
3. Verify the same localized behavior for Intermediate and Advanced tiers.

---

## Stage 3 — Delete "Browse by Topic" and TSL Data

**Scope:** Completely remove the "Browse by Topic" section, all associated rendering functions, and the TSL topic/book/lesson data.

**Files affected:**

- `manifest.json` — Delete the entire `"topics"` array (which contains `topic_tsl` and its books/lessons).
- `app.js` — Remove the following functions entirely: `renderBrowseByTopic()`, `renderTopicPanel()`, `renderBookPanel()`, `filterTopicsForActiveTarget()`, `toggleTopic()`, `toggleBook()`.
- `app.js` — Remove the calls to `renderBrowseByTopic()` and the "Browse by Topic" heading inside `renderHome()`.
- `app.js` — Remove the `"toggle-topic"` and `"toggle-book"` cases from the global click handler.
- `app.js` — Remove the topic/book fallback branch inside `getNavigationContext()` and the topic iteration inside `findLessonMeta()`.

**Comments:**

- This is the largest single deletion. Doing it before structural home-page changes (Stages 4 & 5) reduces the surface area of code that needs to be refactored.
- The TSL JSON lesson files on disk can be deleted from the file system, though the app will simply ignore them once the manifest references are gone.

**Acceptance test:**

1. Load the home page. **Expected:** No "Browse by Topic" heading or TSL content appears.
2. Open the browser console. **Expected:** No errors related to missing topic data or undefined functions.
3. Verify the rest of the home page still functions correctly.

---

## Stage 4 — Replace "Browse by Level" with "Study Plan & Progress" on Home Page

**Scope:** Remove the standalone "Browse by Level" heading from the home page. In its place, embed the "Study Plan & Progress" collapsible panel (currently only visible in the Progress view) directly on the home page.

**Files affected:**

- `app.js`:
  - In `renderHome()`: Remove the `browseHeader` element (`<h3 class="browse-by-level">`).
  - Instead, call the existing `renderStudyPlanProgressSection()` function (or a refactored version of it) and append it to the home view where the "Browse by Level" list used to be.
  - The proficiency tiers (Beginner, Intermediate, Advanced) will eventually live _inside_ this panel (handled in Stage 5), so for now, this stage just establishes the outer container on the home page.

**Comments:**

- This is a structural reorganization. The Progress view (accessible via the hamburger menu) should still exist and function as before, so avoid tightly coupling the home page rendering to the point where it breaks the dedicated Progress view. Extract shared rendering logic if necessary.

**Acceptance test:**

1. Load the home page. **Expected:** No "Browse by Level" heading. A "Study Plan & Progress" collapsible panel is visible in its place.
2. Expand the panel. **Expected:** It shows the study plan controls/progress bar (currently, it will show the flat list or "No study plan yet" message).
3. Navigate to the Progress view via the hamburger menu. **Expected:** It still functions correctly.

---

## Stage 5 — Implement "Study Plan" Collapsible Panel with 3 Tiers & Actions

**Scope:** Restructure the contents of the "Study Plan & Progress" panel. When a study plan exists, it should contain an inner collapsible panel titled "Study Plan" (closed by default). Inside this inner panel, render the three proficiency tiers (Beginner, Intermediate, Advanced) followed by the Edit and Delete buttons.

**Files affected:**

- `app.js`:
  - Modify `renderStudyPlanProgressSection()`.
  - When a plan exists, after rendering the progress bar/label, create a new inner collapsible panel (using the `progress-section` CSS classes) titled "Study Plan".
  - **Default State:** Ensure this inner panel is closed by default (do not add its key to `openProgressSections`).
  - **Inner Panel Contents:**
    1. Render the three collapsible sub-panels for "Beginner", "Intermediate", and "Advanced" (reusing the `renderProficiencyTier` logic, but grouping lessons by their `proficiency` field).
    2. Below the three tiers, render the "Edit Study Plan" and "Delete Study Plan" buttons (moved from the outer panel).
  - `StudyPlanService.generate()`: Ensure the plan generation tags lessons with their proficiency level so the rendering logic can group them into the three tiers. (The manifest already has the `proficiency` field on lessons, so grouping can be done at render time).

**Comments:**

- This creates a nested collapsible structure: Outer ("Study Plan & Progress") -> Inner ("Study Plan") -> Tiers ("Beginner", etc.).
- The overall progress bar (e.g., "12/30 · 40%") should remain in the outer panel so users can see progress at a glance without expanding the inner panel.

**Acceptance test:**

1. Create a new study plan via the onboarding flow.
2. On the home page, expand the outer "Study Plan & Progress" panel. **Expected:** You see the progress bar, and a collapsed inner panel titled "Study Plan".
3. Expand the inner "Study Plan" panel. **Expected:** You see three collapsible sub-panels: "Beginner", "Intermediate", "Advanced". Below them are the "Edit" and "Delete" buttons.
4. The overall progress bar should still show correct totals.

---

## Stage 6 — Grammar First, Then Alphabetical Order in All Collapsible Panels

**Scope:** Within every collapsible tier panel (Beginner, Intermediate, Advanced) on both the home page and the study plan, the Grammar category/lessons should appear first, followed by all remaining categories/lessons sorted alphabetically by their localized title.

**Files affected:**

- `app.js`:
  - `groupCategoriesByProficiency()`: Modify this function (or the rendering logic that consumes it) to sort the categories within each tier.
  - **Sorting Logic:**
    1. Categories whose `id` starts with `"cat_grammar"` should be placed first.
    2. The remaining categories should be sorted alphabetically by their localized title (using `dataService.getLocalizedText(category.title, preferredAppLanguages())` and `localeCompare`).
  - Apply this exact same sorting logic when rendering the tiers inside the Study Plan inner panel (from Stage 5).

**Comments:**

- "Grammar panel" refers to the categories `cat_grammar_intro`, `cat_grammar_inter`, and `cat_grammar_adv`. Each tier should show its corresponding grammar category first.
- Alphabetical sorting must use the _localized_ title based on `state.settings.appLanguage`. This means the sort order will dynamically update if the user switches the app language.
- This stage is placed last because it depends on the final structural hierarchy established in Stages 4 and 5.

**Acceptance test:**

1. On the home page (or inside the Study Plan panel), expand the "Beginner" tier.
2. **Expected:** The Grammar category (e.g., "Grammar: Introductory/Beginner") appears first.
3. **Expected:** The remaining categories (e.g., "Food & Dining", "Greetings & Social", "Survival Basics") appear in alphabetical order.
4. Switch the app language (e.g., to Thai or Farsi). **Expected:** The alphabetical order of the non-Grammar categories updates to match the localized titles.
5. Repeat verification for Intermediate and Advanced tiers.

---

## Summary of Stage Dependencies

| Stage | Focus                              | Depends On                       | Risk Level                             |
| :---- | :--------------------------------- | :------------------------------- | :------------------------------------- |
| **1** | Clickable Header                   | None                             | Low                                    |
| **2** | "Beginner" & "lessons" strings     | None                             | Low                                    |
| **3** | Delete Topic/TSL Data              | None                             | Medium (Large deletion)                |
| **4** | Home Page "Study Plan & Progress"  | Stage 3 (Cleaner after deletion) | Medium (Structural)                    |
| **5** | Inner "Study Plan" Panel & 3 Tiers | Stage 4 (Outer panel must exist) | High (Complex nesting & data grouping) |
| **6** | Grammar First + Alpha Sort         | Stage 5 (Final tier structure)   | Low (Sorting logic only)               |

_Note: Stages 1, 2, and 3 are largely independent but are ordered to clear out dead code (Stage 3) before building the new structural hierarchy (Stages 4-6)._
