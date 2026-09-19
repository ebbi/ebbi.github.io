### 📋 Stages 7 to 13: Data Implementation

````text
Context: We are building a vanilla JS language learning SPA. We have implemented the core UI and logic for `kind: "letter"` exercises (Flashcards, Quiz, and an Audio-only "Spell" exercise).

Stage Goal: Create the [Thai] ([th]) alphabet JSON data file.

Git Branch: `feat/letter-data`

Reference JSON Schema for `kind: "letter"`:

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

[STRICT CODE OUTPUT RULES]
Only output the new JSON file content. Do not modify `app.js` or `main.css`.

````
