# 📗 Document 2: `new-front-end.md` (Finalized Front-End Update Runbook)

This document dictates the exact, minimal changes required in `app.js` to support the new conversational paradigm without breaking the existing SRS, Quiz, and Build Sentence engines.

## 1. Core Objective

Modify `app.js` to natively render the `dialogues` array and `cultural_context` from the lesson JSON, while preserving the existing `items` array logic for exercise compatibility.

## 2. Required `app.js` Modifications

### Step 1: Update `openLesson` to Capture New Fields

Modify the `openLesson` function to store the new conversational data in the `currentLesson` state object.

```javascript
// Inside openLesson(lessonId), after loading content:
currentLesson = {
  meta: lessonMeta,
  items: Array.isArray(content.items) ? content.items : [],
  grammar_questions: Array.isArray(content.grammar_questions)
    ? content.grammar_questions
    : [],
  unlock_requirements: content.unlock_requirements || {},
  displayMode: content.displayMode || "default",
  // NEW: Capture conversational data
  dialogues: Array.isArray(content.dialogues) ? content.dialogues : [],
  cultural_context: content.cultural_context || {},
  failed: Boolean(content.failed),
};
```

### Step 2: Update `renderLesson` to Display Cultural Context and Dialogues

Modify `renderLesson` to render the `cultural_context` at the top, and render the `dialogues` in a chat-bubble format _before_ falling back to (or alongside) the existing `items` rendering for exercises.

```javascript
// Inside renderLesson(), after appending the header:

// 1. Render Cultural Context (if available)
if (
  currentLesson.cultural_context &&
  Object.keys(currentLesson.cultural_context).length > 0
) {
  const ctxText = dataService.getLocalizedText(
    currentLesson.cultural_context,
    preferredAppLanguages(),
  );
  if (ctxText) {
    const ctxBox = document.createElement("div");
    ctxBox.className = "cultural-context-box"; // Requires minor CSS addition
    ctxBox.innerHTML = `<strong>💡 ${t("culturalNote") || "Cultural Note"}:</strong> ${ctxText}`;
    view.appendChild(ctxBox);
  }
}

// 2. Render Dialogues (if available)
if (currentLesson.dialogues && currentLesson.dialogues.length > 0) {
  const dialogueContainer = document.createElement("div");
  dialogueContainer.className = "dialogue-container";

  currentLesson.dialogues.forEach((dialogue) => {
    const dialogueBlock = document.createElement("div");
    dialogueBlock.className = "dialogue-block";

    // Context header
    const ctxHeader = document.createElement("h4");
    ctxHeader.className = "dialogue-context";
    ctxHeader.textContent = dialogue.context; // Could be localized if expanded later
    dialogueBlock.appendChild(ctxHeader);

    // Turns
    dialogue.turns.forEach((turn) => {
      const bubble = document.createElement("div");
      bubble.className = `chat-bubble chat-bubble--${turn.speaker.toLowerCase()}`;

      const text = dataService.getLocalizedText(
        turn.texts,
        preferredAppLanguages(),
      );
      const langCode = state.settings.targetLanguage || "en";

      // Reuse existing sentence text line creator for TTS/token highlighting compatibility
      const textLine = createSentenceTextLine(
        { id: turn.speaker + "_" + dialogue.id, tokens: turn.tokens },
        text,
        langCode,
        ["chat-bubble__text"],
      );

      bubble.appendChild(textLine);
      dialogueBlock.appendChild(bubble);
    });

    dialogueContainer.appendChild(dialogueBlock);
  });

  view.appendChild(dialogueContainer);
}

// 3. Render existing items (for Flashcards/Quiz compatibility)
// ... [Keep existing sections/items rendering logic intact here] ...
```

### Step 3: Add Minimal CSS for Chat Bubbles

Append this to the app's stylesheet (or `<style>` block) to support the new UI:

```css
.cultural-context-box {
  background: var(--surface-2, #f0f4f8);
  border-left: 4px solid var(--accent, #4a90e2);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  font-size: 0.95rem;
}
.dialogue-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 1.5rem 0;
}
.dialogue-context {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted, #666);
  margin-bottom: 0.5rem;
}
.chat-bubble {
  max-width: 85%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin-bottom: 0.5rem;
  line-height: 1.5;
}
.chat-bubble--a {
  align-self: flex-start;
  background: var(--surface-2, #e9ecef);
  border-bottom-left-radius: 4px;
}
.chat-bubble--b {
  align-self: flex-end;
  background: var(--accent, #4a90e2);
  color: white;
  border-bottom-right-radius: 4px;
}
.chat-bubble__text {
  display: block;
}
```

## 3. Validation Checklist for Front-End Update

- [ ] `manifest.json` loads without errors, and all milestones have a `file` property.
- [ ] `currentLesson` object successfully populates `dialogues` and `cultural_context`.
- [ ] The Lesson View renders the cultural note and chat bubbles correctly.
- [ ] TTS play buttons on chat bubbles correctly highlight tokens (leveraging the existing `createSentenceTextLine` function).
- [ ] Navigating to Flashcards, Quiz, and Build Sentence still works flawlessly using the extracted `items` array.

---
