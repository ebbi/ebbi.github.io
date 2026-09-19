# Zabon v3.1 — Master Language Rollout Plan (Session Recovery Context)

**Document Purpose:** This is the definitive, staged rollout plan for activating all 7 languages (`en`, `fa`, `zh`, `ja`, `ar`, `es`) as fully compliant Target Languages in Zabon v3.1. Thai (`th`) is the established baseline.
**Usage:** Save this document. If the chat context is lost or a new session is started, upload this file to instantly restore the architectural roadmap, process rules, and exact next steps.

---

## 🛑 Core Process Rules (Strictly Enforced)

1. **Feedback-Driven & Targeted Fixes Only:** Modify _only_ the specific JSON files or `manifest.json` entries required for the current phase's language. Do not regenerate untouched files.
2. **Strict Schema Adherence:** All lesson JSON files must strictly follow `version: 2`, `items: [...]` schema. Unsegmented languages (`zh`, `ja`, `th`) **must** include the `tokens` array for word-by-word TTS highlighting.
3. **The "Rule of 5" Compliance:** Every thematic lesson must contain exactly 5 distinct conversational scenarios, with a minimum of 5 words and 5 sentences per scenario.
4. **Mandatory Re-validation:** After _every_ phase, the user must run:
   - `node tools/validate-lessons.js` (Checks Rule of 5, 7-language translation completeness, and token presence).
   - `node tools/validate-targets.js` (Checks that `targets` arrays perfectly align with the new grammatical rules).

---

## 📋 Standardized Checklist Per Language Phase

For _each_ language phase below, the following 5 steps must be completed before marking the phase as "DONE":

1. **Grammar Rule Expansion:** Add language-specific rules to the `grammar_rules` array in `manifest.json`.
2. **Pedagogical Routing:** Update the `targets` array in relevant `manifest.json` lessons to include the new language code (e.g., `"targets": ["en", "th", "fa", ...]`).
3. **Data Compliance Expansion:** Update all applicable lesson JSON files to include the new language code in the `translations` array, provide valid text for all items, and generate `tokens` arrays for `zh` and `ja`.
4. **App Registration:** Add the language code to the `IMPLEMENTED_TARGET_LANGUAGES` frozen array in `app.js`.
5. **Validation:** Run both validation scripts and resolve any errors before proceeding.

---

## 🗺️ Staged Rollout Plan

### Phase 1: English (`en`) as Target Language

_Goal: Establish the primary "bridge" language as a fully routable target, focusing on hurdles for non-native English learners._

- **New Grammar Rules to Add (`manifest.json`):**
  - `rule_en_articles`: Definite vs. Indefinite Articles (a, an, the).
  - `rule_en_sva`: Subject-Verb Agreement (e.g., third-person singular "-s").
- **Pedagogical Routing:** Update universal lessons (Greetings, Basics, Wh- Questions) and specific grammar lessons to include `"en"` in `targets`.
- **Data Focus:** Ensure all existing `th`-centric lessons have high-quality, natural-sounding `en` translations and `tokens` are _not_ required (whitespace segmentation).
- **App Update:** `IMPLEMENTED_TARGET_LANGUAGES = Object.freeze(["th", "fa", "en"]);`

### Phase 2: Persian (`fa`) as Target Language

_Goal: Activate full RTL support and Persian-specific syntactic structures._

- **New Grammar Rules to Add (`manifest.json`):**
  - `rule_fa_ezafe`: The Ezafe construction (linking nouns to adjectives/possessors).
  - `rule_fa_sov`: Subject-Object-Verb word order (contrasting with universal SVO).
  - `rule_fa_formality`: Formal (`shomā`) vs. Informal (`to`) address and verb conjugation.
- **Pedagogical Routing:** Add `"fa"` to `targets` for universal lessons. Restrict `rule_fa_ezafe` and `rule_fa_sov` lessons to `"targets": ["fa"]`.
- **Data Focus:** Verify RTL rendering in UI. Ensure all lesson JSONs have complete `fa` translations. No `tokens` required (whitespace segmentation).
- **App Update:** `IMPLEMENTED_TARGET_LANGUAGES` already includes `"fa"`, but verify full UI string coverage.

### Phase 3: Chinese (`zh`) as Target Language

_Goal: Activate Mandarin Chinese, leveraging the `Intl.Segmenter` API for TTS highlighting._

- **New Grammar Rules to Add (`manifest.json`):**
  - `rule_zh_aspect`: Aspect particles (le 了, zhe 着, guo 过) for completed/ongoing/experienced actions.
  - _(Note: `rule_g09` Classifiers, `rule_g10` Topic-Comment, and `rule_g11` Serial Verbs already exist and apply to `zh`)_.
- **Pedagogical Routing:** Add `"zh"` to `targets` for universal lessons. Update `rule_g09`, `rule_g10`, `rule_g11`, and new `rule_zh_aspect` to include `"zh"`.
- **Data Focus:** **CRITICAL:** Every `zh` sentence item _must_ include a meticulously accurate `tokens` array matching the `zh` text character-by-character/word-by-word for TTS highlighting.
- **App Update:** `IMPLEMENTED_TARGET_LANGUAGES = Object.freeze(["th", "fa", "en", "zh"]);`

### Phase 4: Japanese (`ja`) as Target Language

_Goal: Activate Japanese, focusing on its agglutinative nature and particle system._

- **New Grammar Rules to Add (`manifest.json`):**
  - `rule_ja_particles`: Core case particles (wa は, ga が, wo を, ni に, de で).
  - `rule_ja_conjugation`: Polite (`-masu`) vs. Dictionary form basics.
  - _(Note: `rule_g09` Classifiers and `rule_g10` Topic-Comment already exist and apply to `ja`)_.
- **Pedagogical Routing:** Add `"ja"` to `targets` for universal lessons. Update `rule_g09`, `rule_g10`, and new `rule_ja_*` rules to include `"ja"`.
- **Data Focus:** **CRITICAL:** Every `ja` sentence item _must_ include a meticulously accurate `tokens` array. Ensure polite forms are consistently used in beginner/intermediate lessons.
- **App Update:** `IMPLEMENTED_TARGET_LANGUAGES = Object.freeze(["th", "fa", "en", "zh", "ja"]);`

### Phase 5: Arabic (`ar`) as Target Language

_Goal: Activate Arabic, ensuring robust RTL rendering and morphological agreement._

- **New Grammar Rules to Add (`manifest.json`):**
  - `rule_ar_idafa`: The Construct State (genitive construction for possession).
  - `rule_ar_agreement`: Strict gender and number agreement (singular, dual, plural) between nouns, adjectives, and verbs.
  - `rule_ar_definite`: The Definite Article (`al-`) and Sun/Moon letter phonetic rules.
- **Pedagogical Routing:** Add `"ar"` to `targets` for universal lessons. Restrict new `rule_ar_*` lessons to `"targets": ["ar"]`.
- **Data Focus:** Verify RTL rendering. Ensure all `ar` text uses proper diacritics (tashkeel) where necessary for beginner clarity, though standard script is acceptable. Whitespace segmentation applies.
- **App Update:** `IMPLEMENTED_TARGET_LANGUAGES = Object.freeze(["th", "fa", "en", "zh", "ja", "ar"]);`

### Phase 6: Spanish (`es`) as Target Language

_Goal: Activate Spanish, focusing on its most notorious hurdles for global learners._

- **New Grammar Rules to Add (`manifest.json`):**
  - `rule_es_ser_estar`: The distinction between permanent (Ser) and temporary (Estar) states.
  - `rule_es_agreement`: Gender and number agreement for nouns, articles, and adjectives.
  - `rule_es_pronouns`: Object pronoun placement (pre-conjugated verb vs. attached to infinitive/gerund).
- **Pedagogical Routing:** Add `"es"` to `targets` for universal lessons. Restrict new `rule_es_*` lessons to `"targets": ["es"]`.
- **Data Focus:** Ensure all `es` translations reflect natural regional neutrality (or specify a default like `es-ES` as defined in `manifest.json` BCP47). Whitespace segmentation applies.
- **App Update:** `IMPLEMENTED_TARGET_LANGUAGES = Object.freeze(["th", "fa", "en", "zh", "ja", "ar", "es"]);` (Rollout Complete).

---

## 🛠️ Session Recovery Instructions

If you need to start a new chat or the context is lost:

1. Upload this `rollout-plan.md` file.
2. State: _"I am ready to begin [Phase X: Language]. Please generate the specific `manifest.json` grammar rule additions and the targeted lesson JSON updates for this phase, adhering strictly to the Rule of 5 and schema requirements."_
3. I will then generate _only_ the required changes for that specific phase, followed by the exact terminal commands for re-validation.

---

**Current Status:** Awaiting your command to begin **Phase 1: English (`en`)** or to adjust any part of this master plan before execution.
