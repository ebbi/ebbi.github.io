Here is a comprehensive and highly structured prompt that you can copy and paste into a new chat. It is specifically engineered to ensure the AI understands the `app.js` architecture, the exact JSON schema required, and the linguistic nuances of the Thai alphabet (Consonant classes and Vowel structures).

---

### Copy and Paste the Prompt Below into a New Chat:

````markdown
# Context

We are building a vanilla JS language learning SPA called "Zabon". We are currently implementing the `kind: "letter"` data architecture for the Thai language. The app uses specific JSON schemas to render flashcards, quizzes, and audio-spell exercises.

# Task

Generate the COMPLETE and ACCURATE JSON data arrays for the following 4 categories of the Thai alphabet:

1. **Thai Middle Class Consonants** (9 letters)
2. **Thai High Class Consonants** (11 letters)
3. **Thai Low Class Consonants** (24 letters)
4. **Thai Vowels** (Basic forms using 'อ' as the base consonant, e.g., อะ, อา, อิ)

# JSON Schema & Rules

### 1. Consonants (Middle, High, Low)

Use this exact schema for all consonants.

- `id`: Format as `th_{english_name_lowercase}` (e.g., `th_ko_kai`, `th_so_sua`).
- `kind`: MUST be `"letter"`.
- `role`: MUST be `"target"`.
- `texts`: `th` is the Thai character. `en` is the standard English RTGS name (e.g., "Ko Kai", "Cho Chang").
- `phonetic`: `en` is the IPA pronunciation.
- `connections`: Thai consonants do not change shape based on position. Therefore, all 4 values MUST be identical to `texts.th`.
- `meta.category`: MUST be `"consonant"`.
- `meta.tone_class`: MUST be exactly `"mid"`, `"high"`, or `"low"` corresponding to the category.

**Consonant Example:**

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
````

### 2. Vowels

Use this schema for vowels.

- `id`: Format as `th_vowel_{name}` (e.g., `th_vowel_a`, `th_vowel_aa`).
- `texts`: `th` is the vowel symbol attached to the base consonant 'อ' (e.g., "อะ", "อา", "อิ"). `en` is the standard name (e.g., "Sara A", "Sara Aa").
- `phonetic`: `en` is the IPA.
- `connections`: **OMIT THIS FIELD ENTIRELY**. Vowels do not have initial/medial/final script connections. The app's UI will gracefully hide the connection grid if this field is missing.
- `meta.category`: MUST be `"vowel"`.
- `meta.length`: MUST be `"short"` or `"long"`.
- `meta.position`: (Optional but helpful) `"none"` (independent), `"top"`, `"bottom"`, `"left"`, `"right"`, or `"surround"`.

**Vowel Example:**

```json
{
  "id": "th_vowel_aa",
  "kind": "letter",
  "role": "target",
  "texts": { "th": "อา", "en": "Sara Aa" },
  "phonetic": { "en": "/aː/" },
  "meta": { "category": "vowel", "length": "long", "position": "right" }
}
```

# Strict Output Constraints

1. **DO NOT** truncate or summarize. I need the COMPLETE list of all 44 consonants and the standard ~32 Thai vowels.
2. **DO NOT** output any markdown explanations, conversational filler, or code outside the JSON blocks.
3. Output the data as **4 separate JSON arrays** (one for each category) inside standard markdown JSON code blocks so I can easily save them into separate files.
4. Ensure 100% linguistic accuracy for Thai characters, RTGS romanization, and IPA phonetics.

```

```
