### 📘 Final Definitive `new-lesson.md`

````markdown
# Zabon Curriculum Generation Runbook (Normalized Architecture)

This is the single source of truth for generating milestone data (M1–M15).
The app uses a **Normalized (Base + Extension)** architecture. Therefore, generating a complete milestone requires TWO distinct JSON outputs:

1. **The Common Core** (Language-agnostic vocab, sentences, and 7-language translation matrix).
2. **The Language Extension** (Target-language-specific grammar notes and multiple-choice quizzes).

When the user requests a milestone, you MUST read this document, look up the parameters in §2, and follow the 4-Step Protocol in §4.

---

## §1. Global Rules

1. **No `dialogues` in final JSON.** Dialogues are strictly a scratchpad drafting tool. They must NOT appear in the output JSON.
2. **`"kind"` is mandatory.**
   - Core vocabulary: `"kind": "word"`, `"role": "target"`
   - Extracted sentences: `"kind": "sentence"`, `"role": "target"`
   - Grammar notes: `"kind": "grammar"`, `"role": "grammar"`
3. **Strict extraction.** Every sentence and word in the final `items` array MUST be directly extracted from the dialogues drafted in Step 2.
4. **Dynamic Targeting.** The AI must look at the User's Prompt to determine if it is generating the **Common Core** or a **Language Extension**, and adjust the output schema and file path accordingly.

---

## §2. Milestone Parameter Table

| ID  | Tier         | Topic                          | Dialogues | Turns/Dialogue | Core Words | Sentences (min) |
| --- | ------------ | ------------------------------ | --------- | -------------- | ---------- | --------------- |
| M1  | Beginner     | Foundations & Greetings        | 3         | 4–5            | 6–8        | 12              |
| M2  | Beginner     | Numbers & Time                 | 3         | 4–5            | 6–8        | 12              |
| M3  | Beginner     | Survival Needs                 | 3         | 4–5            | 6–8        | 12              |
| M4  | Beginner     | Directions & Transport         | 3         | 4–5            | 6–8        | 12              |
| M5  | Beginner     | Shopping & Money               | 3         | 4–5            | 6–8        | 12              |
| M6  | Intermediate | Daily Routines & Hobbies       | 4         | 6–8            | 10–12      | 24              |
| M7  | Intermediate | Health & Emergencies           | 4         | 6–8            | 10–12      | 24              |
| M8  | Intermediate | Work & Business Basics         | 4         | 6–8            | 10–12      | 24              |
| M9  | Intermediate | Travel & Accommodation         | 4         | 6–8            | 10–12      | 24              |
| M10 | Intermediate | Socializing & Opinions         | 4         | 6–8            | 10–12      | 24              |
| M11 | Advanced     | Abstract Concepts & Philosophy | 4         | 10–12          | 12–15      | 40              |
| M12 | Advanced     | Media, News & Technology       | 4         | 10–12          | 12–15      | 40              |
| M13 | Advanced     | Culture, History & Traditions  | 4         | 10–12          | 12–15      | 40              |
| M14 | Advanced     | Professional Negotiations      | 4         | 10–12          | 12–15      | 40              |
| M15 | Advanced     | Nuance, Humor & Idioms         | 4         | 10–12          | 12–15      | 40              |

---

## §3. JSON Schemas (Two-Pass Output)

### Schema A: The Common Core (`milestones/common/MX.json`)

_Triggered when User Prompt says: "Output ONLY Pass 1: The Common Core"_
_Contains the universal 7-language translation matrix. NO grammar questions._

```json
{
  "milestone_id": "MX",
  "displayMode": "default",
  "unlock_requirements": { "srs_box_level": 4, "grammar_quiz_pass_pct": 80 },
  "cultural_context": { "en": "...", "th": "...", "fa": "...", "zh": "...", "ja": "...", "ar": "...", "es": "..." },
  "items": [
    { "header": true, "id": "MX_h_vocab", "texts": { "en": "Core Vocabulary", "th": "...", "fa": "...", "zh": "...", "ja": "...", "ar": "...", "es": "..." } },
    { "id": "MX_w1", "role": "target", "kind": "word", "texts": { "en": "...", "th": "...", "fa": "...", "zh": "...", "ja": "...", "ar": "...", "es": "..." } },
    { "header": true, "id": "MX_h_d1", "texts": { "en": "Dialogue 1", "th": "...", "fa": "...", "zh": "...", "ja": "...", "ar": "...", "es": "..." } },
    { "id": "MX_t1", "role": "target", "kind": "sentence", "texts": { "en": "...", "th": "...", "fa": "...", "zh": "...", "ja": "...", "ar": "...", "es": "..." }, "tokens": { "th": [...], "zh": [...], "ja": [...] } }
  ]
}
```

### Schema B: The Language Extension (`milestones/[lang]/MX.json`)

_Triggered when User Prompt says: "Target Language: [lang]. Output ONLY the Language Extension"_
_Contains ONLY the grammar notes and multiple-choice questions for the SPECIFIC target language._

```json
{
  "milestone_id": "MX",
  "target_language": "[lang]",
  "items": [
    {
      "header": true,
      "id": "MX_h_grammar",
      "texts": {
        "en": "[Lang] Grammar Focus",
        "th": "...",
        "fa": "...",
        "zh": "...",
        "ja": "...",
        "ar": "...",
        "es": "..."
      }
    },
    {
      "id": "MX_g1",
      "role": "grammar",
      "kind": "grammar",
      "texts": {
        "en": "...",
        "th": "...",
        "fa": "...",
        "zh": "...",
        "ja": "...",
        "ar": "...",
        "es": "..."
      }
    }
  ],
  "grammar_questions": [
    {
      "id": "MX_gq1",
      "question": {
        "en": "...",
        "th": "...",
        "fa": "...",
        "zh": "...",
        "ja": "...",
        "ar": "...",
        "es": "..."
      },
      "options": [
        { "text": { "en": "...", "[lang]": "..." } },
        { "text": { "en": "...", "[lang]": "..." } }
      ],
      "correctOptionIndex": 0
    }
  ]
}
```

---

## §4. 4-Step Chain-of-Thought Protocol

### Step 1 — Lookup

Read §2. Identify the milestone's parameters. State them explicitly.

### Step 2 — Draft Dialogues (Scratchpad)

Write the required number of dialogues in **English** and the **Target Language** (if generating Extension) or **Thai** (if generating Common). Ensure logical flow.

### Step 3 — Translate & Tokenize (Scratchpad)

Translate lines into the remaining languages. Build `tokens` arrays for `th`, `zh`, `ja`.

### Step 4 — Extract JSON (Execute based on User Prompt)

- **If User requested Common Core:** Output Schema A. Ensure all 7 languages are in `texts`.
- **If User requested Language Extension:** Output Schema B. Ensure `target_language` matches the prompt. Ensure grammar questions test the specific grammar of that language.
````
