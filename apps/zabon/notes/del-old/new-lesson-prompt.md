Here is the optimized prompt to paste into a new chat.

I have used the **Universal Classifiers** lesson as the concrete example, since that was the focus of our previous discussion. I have also pre-extracted the metadata and the specific grammar rule description from your `manifest.json` and injected it directly into the prompt, as we agreed this prevents the LLM from "hallucinating" or missing the rule.

---

### Copy and Paste This Prompt:

````text
I am working on the Zabon language learning app. I need you to generate a lesson data file (JSON) for a specific lesson.

I have uploaded two files to this chat:
1. `new-lesson.md`: Contains all the strict constraints, JSON schema, structural rules, and formatting instructions you MUST follow.
2. `manifest.json`: Contains the lesson metadata, target languages, and the grammar rules registry.

### TARGET LESSON
Please generate the lesson for the following file path defined in `manifest.json`:
`lessons/grammar/universal-classifiers.json`

### LESSON METADATA (Extracted from manifest.json)
- Title: Grammar: Classifiers
- Proficiency: beginner (Generate a MINIMUM of 25 sentences)
- Level: 2 (Beginner: Simple structures, high-frequency survival vocabulary, short sentences, concrete topics)
- Target Languages (Strict Grammar Application): th, zh, ja
- Translation Languages (Semantic Equivalents): en, fa, ar, es

### GRAMMAR RULE DESCRIPTION (Injected for strict adherence)
Rule ID: `rule_universal_classifiers`
Description: "Use appropriate measure words/classifiers when counting nouns. Essential for Thai, Chinese, and Japanese. Ensure the classifier matches the semantic category of the noun."

### EXECUTION INSTRUCTIONS
1. Read and strictly follow ALL rules in `new-lesson.md`.
2. Pay special attention to the "TARGET LANGUAGES vs. TRANSLATION LANGUAGES" rule. The linguistic complexity and strict classifier grammar ONLY apply to `th`, `zh`, and `ja`. The other languages just need accurate semantic translations.
3. Ensure every sentence object includes the `"speaker": "A"` or `"speaker": "B"` field, strictly alternating.
4. Extract ONLY content words and target grammar particles for the vocabulary section. DO NOT extract universal stop words.
5. Do your planning and vocabulary extraction internally.
6. Output **ONLY** a valid JSON object. Do not output markdown formatting (like ```json), scratchpads, or explanations. The very first character of your response must be `{` and the last must be `}`.
````

---

### 💡 How to adapt this for other lessons:

When you are ready to generate the next lesson, just update the three sections in the prompt:

1. **TARGET LESSON:** Change the file path (e.g., `lessons/grammar/universal-svo.json`).
2. **LESSON METADATA:** Look up the new lesson in `manifest.json` and update the Title, Proficiency, Level, and Target/Translation languages. _(Tip: You can ask the LLM to do this for you in the prompt by saying: "Look up the metadata for [path] in the manifest and use it", but pre-filling it like above guarantees 100% accuracy and saves tokens)._
3. **GRAMMAR RULE DESCRIPTION:** Find the `description` (English is fine) for the corresponding `rule_id` in the `manifest.json` and paste it in. If the lesson doesn't have a `rules` array (like the Greetings or Survival basics lessons), just delete that section and change the instruction to: _"Focus on natural, high-frequency conversational vocabulary for the target proficiency level."_
