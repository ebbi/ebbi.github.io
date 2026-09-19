I am working on the Zabon language learning app. I need you to generate a lesson data file (JSON) for the following metadata:

          "file": "lessons/accommodation/hotel-requests.json",
          "level": 6,
          "proficiency": "intermediate",
          "translations": ["en", "th", "fa", "ar", "es", "zh", "ja"],
          "targets": ["en", "th", "fa", "ar", "es", "zh", "ja"]

Here are the strict constraints and instructions you MUST follow:

🚨 METADATA ADHERENCE (Length & Linguistic Complexity)
You MUST read the target lesson's `proficiency` and `level` fields to determine the length and complexity of the generated content.

LENGTH (Based on `proficiency`):
`"beginner"` (Introductory): Target 20-25 sentences.
`"intermediate"`: Target 30-35 sentences.
`"advanced"`: Target 40-50 sentences.
_Note: Prioritize a natural conclusion to the scenario over artificially padding the conversation just to hit a number._

LINGUISTIC COMPLEXITY (Based on `level` 1-9):
Levels 1-3 (Beginner): Simple structures, high-frequency survival vocabulary, short sentences, concrete topics.
Levels 4-6 (Intermediate): Compound sentences, natural conversational flow, specific situational vocabulary, common idioms.
Levels 7-9 (Advanced): Complex grammar (conditionals, passive voice, reported speech), nuanced dialogue, formal/informal register switching, specialized/professional vocabulary.

🚨 GRAMMAR & PEDAGOGICAL FOCUS
If the lesson contains a `"focus"` attribute, this indicates the pedagogical topic.
You MUST naturally integrate this focus topic into the dialogue. Prioritize natural conversational flow, idiomatic expressions, and logical context over forcing the grammar rule into every single sentence. The grammar point should be the thematic flavor of the conversation, not a syntactic straitjacket.

🚨 TARGET LANGUAGES vs. TRANSLATION LANGUAGES
The metadata defines `translations` (all 7 languages) and `targets` (the specific languages being taught).
You MUST provide all 7 languages in the `texts` object for UI consistency.
However, the linguistic complexity, naturalness, and pedagogical focus ONLY apply to the `targets` array. The other languages just need to be accurate semantic translations.

🚨 CONVERSATION SCENARIO & FLOW (CRITICAL FOR NATURALNESS)
The lesson MUST be divided into at least 5 distinct conversational scenarios (e.g., Scenario 1: Greeting & Browsing, Scenario 2: Asking for details, etc.).

CRITICAL INTRA-SCENARIO COHESION: Within each scenario, the sentences MUST form a single, continuous, logical back-and-forth dialogue. The second speaker's line MUST directly respond to, answer, or react to the first speaker's immediately preceding line. Do NOT generate disconnected, random, or unrelated statements within the same scenario.
Allow for natural turn-taking. Do not write long monologues; keep turns relatively balanced and responsive.

🚨 STRICT STRUCTURAL & NAMING CONVENTIONS (CRITICAL FOR FRONTEND)
You MUST follow this exact JSON structure and ID naming scheme. Do NOT use lazy IDs like "h1", "s1", or "w1".
The JSON `"items"` array MUST follow this exact sequential order:

A. Scenario Sections (MUST come first):
Generate at least 5 distinct conversational scenarios.
Each scenario MUST start with a header using the prefix `"header_scenario_"` (e.g., `"header_scenario_1"`, `"header_scenario_2"`).
Under each scenario header, provide the conversational sentences that form a cohesive back-and-forth dialogue for that specific scenario.
Sentence IDs MUST use the prefix `"sentence_"` (e.g., `"sentence_1"`, `"sentence_2"`).

B. Words Section (MUST come last):
Each scenario set of words MUST start with a header using the prefix `"header_scenario_[1..n]_words"` (e.g., `"header_scenario_1_words"`, `"header_scenario_2_words"`).
Word IDs MUST use the prefix `"word_"` (e.g., `"word_1"`, `"word_2"`).
Do NOT put any words at the beginning of the file. All words must be under `"header_words"` at the end.

🚨 VOCABULARY EXTRACTION RULES (CRITICAL)
Extract all content words (nouns, verbs, adjectives, adverbs) and target grammar particles.
DO NOT extract universal stop words (articles like 'a/the', basic pronouns like 'I/you', or basic prepositions) unless they are the specific grammar focus of the lesson. This keeps the vocabulary list focused and prevents output token exhaustion.

Do not duplicate words in the word list. If a word was already extracted in a previous scenario, do not generate a new `word_*` object for it. Just omit it from the subsequent scenario's word list.

Ensure the text for every word is an EXACT substring of the text in at least one sentence in that specific scenario. Do not use dictionary/infinitive forms if they differ from the spoken text (e.g., if the sentence says "went", extract "went", not "go").

SENTENCE-FIRST EXTRACTION METHOD
Step 1: Define the conversation scenarios and generate the conversational sentences FIRST.
Step 2: Review the sentences you just generated.
Step 3: Extract the core words DIRECTLY from these spoken sentences following the rules above.

🚨 TOKENS & FORMATTING RULES
Whitespace Languages (`en`, `fa`, `ar`, `es`): You MUST generate a `"tokens"` array for these languages in every sentence. The tokens must be the exact words that reconstruct the sentence when joined by spaces.

🚨 CRITICAL TOKENIZATION RULE: Punctuation marks (., ?, !, ,, etc.) MUST remain attached to the word they follow. Do NOT separate punctuation into its own token. For example, "Excuse me." must be tokenized as `["Excuse", "me."]`. Joining the tokens with a single space MUST perfectly reconstruct the original text without adding erroneous spaces before punctuation.

Segmenter Languages (`th`, `zh`, `ja`): DO NOT generate the `"tokens"` array for these languages. My post-processing pipeline will handle word segmentation.

Formatting: Ensure absolutely NO trailing or leading spaces in any of the translation strings or token strings.

🚨 STRICT OUTPUT FORMAT (NO SCRATCHPAD)
Perform your planning and vocabulary extraction internally. Output ONLY a valid JSON object. Do not output markdown formatting (like ```json), scratchpads, or explanations. The very first character of your response must be `{`and the last must be`}`.

{
"items": [
{
"id": "header_scenario_1",
"header": true,
"texts": { "en": "Scenario 1: ...", "th": "...", "fa": "...", "ar": "...", "es": "...", "zh": "...", "ja": "..." }
},
{
"id": "sentence_1",
"kind": "sentence",
"texts": { "en": "...", "th": "...", "fa": "...", "ar": "...", "es": "...", "zh": "...", "ja": "..." },
"tokens": { "en": ["..."], "fa": ["..."], "ar": ["..."], "es": ["..."] }
},
{
"id": "sentence_2",
"kind": "sentence",
"texts": { "en": "...", "th": "...", "fa": "...", "ar": "...", "es": "...", "zh": "...", "ja": "..." },
"tokens": { "en": ["..."], "fa": ["..."], "ar": ["..."], "es": ["..."] }
},
...
{
"id": "header_words",
"header": true,
"texts": { "en": "Words", "th": "คำศัพท์", "fa": "واژگان", "ar": "المفردات", "es": "Palabras", "zh": "词汇", "ja": "語彙" }
},
{
"id": "header_scenario_1_words",
"header": true,
"texts": { "en": "Scenario 1 words", "th": "คำศัพท์สถานการณ์ 1", "fa": "کلمات سناریو 1", "ar": "كلمات السيناريو 1", "es": "Palabras del escenario 1", "zh": "场景1词汇", "ja": "シナリオ1の単語" }
},
{
"id": "word_1",
"kind": "word",
"texts": { "en": "...", "th": "...", "fa": "...", "ar": "...", "es": "...", "zh": "...", "ja": "..." }
}
]
}

🚨 ERROR HANDLING & PARTIAL REGENERATION (CRITICAL FOR TOKEN SAVING)
When the validation script (`validate-lessons.js`) returns a failure report with specific item errors (e.g., `[TOKEN_MISMATCH] items[17] (sentence_15)` or `[TEXT_MISMATCH] items[42] (word_12)`):
DO NOT regenerate or output the entire JSON file.
Outputting the whole file wastes tokens and risks context drift.

Instead, ONLY output the specific JSON block(s) that need fixing.
Rules for Partial Output:

1. Identify the broken items: Look at the validation report.
2. Output ONLY the corrected block(s): Provide just the JSON object for the broken `sentence_*` or `word_*`.
3. Cascading Fixes: If you change the `texts` of a `sentence_*` to fix a tokenization or spelling error, you MUST also output the corresponding `word_*` blocks that contain the modified text so they remain in sync.

Format: Output the corrected blocks as a simple JSON array, clearly labeled so I can easily copy-paste and replace them in the main file.
