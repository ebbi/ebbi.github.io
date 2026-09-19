# Zabon — Language Learning App

Zabon is a fully client-side web app for learning languages. It is built with vanilla
HTML/CSS/JavaScript — no frameworks, no build step, no accounts. Content is
**language-agnostic**: every word and sentence carries text in 7 languages, and
the learner toggles which languages are displayed.

## Highlights

- **7 app languages** — English, Thai, Persian (Farsi), Arabic, Spanish,
  Chinese, Japanese. The entire UI is localized, with RTL layout support.
- **92 validated lessons** — 55 thematic scenario lessons across 18 categories,
  24 grammar lessons (G1–G24), 2 phonetic Reading & Writing lessons, and 11
  TSL (Listening & Speaking) book lessons.
- **Interactive lessons** — Words + Sentences panels with scenario dividers,
  tap-to-listen on every line, and per-word token highlighting during speech.
- **Text-to-speech** — Web Speech API with per-language voice selection,
  speed presets (normal / slow / slower), repeat count, and playlist-style
  lesson playback.
- **Spaced-repetition flashcards** — word and sentence decks with
  Again / Hard / Good / Easy ratings.
- **Quizzes** — multiple-choice word and sentence quizzes with automatic
  retry of incorrect questions.
- **Build a sentence** — tap tokens in order to reconstruct sentences, with
  hints and audio feedback.
- **Optional study plan** — onboarding questionnaire (goal / level / usage)
  generates a personalized plan; grammar prerequisites are inserted
  automatically.
- **Progress tracking** — ✅ complete / ▶ in progress / ⏭ skipped, all stored
  locally in your browser.
- **Comfort settings** — auto/light/dark theme, modern/traditional font mode,
  per-lesson language selection.

## Learning cycle

1. Open a lesson from the **Next Up** card, or browse **by Level**
   (🌱 Introductory, 🌿 Intermediate, 🌳 Advanced) or **by Topic** (TSL books).
2. Read and listen: tap ▶ to play the whole lesson, or tap any cell to start
   from there. Adjust languages, repeat count, speed and voices in ⚙ Lesson
   settings.
3. Practice with 🃏 word & sentence flashcards, ❓ quizzes, and 🧩
   build-a-sentence.
4. Check **Complete?** in the bottom bar, then follow **Next Up** and repeat.

### Study plan (optional)

On first launch you can answer goal / level / usage questions to generate a
study plan, or skip and browse freely. Thematic lessons declare grammar
prerequisites (badges such as `G1`, `G5`); any unmet prerequisite is inserted
into the plan ahead of the lesson and can be opened directly from its badge.
Plans can be edited or deleted at any time from the Progress view.

### Reading & Writing Thai

The Reading & Writing category uses a special phonetic display mode: a single
Thai column with large characters plus a localized phonetic note under each one.

### Voice setup

If speech is silent, use 🔊 **Test voices** in the menu. It plays a test
message in every selected language and shows step-by-step voice installation
instructions for Android, iOS, macOS, Windows and Linux.

## Project structure

```
zabon/
├── index.html                 # App shell: toolbar, action/bottom bars,
│                              # hamburger panel, settings sheet, views
├── app.js                     # Single IIFE: services, rendering, one
│                              # delegated data-action click handler
├── main.css                   # Language-agnostic design system
│                              # (theme/font variables, logical CSS for RTL)
├── tools/
│   └── check-lessons.js       # Lesson data validator
└── lessons/
    ├── manifest.json          # Language registry, categories, topics,
    │                          # lesson metadata (levels, grammar tags)
    ├── greetings/  basics/  food-dining/  shopping/  money-bank/
    ├── transport/  weather/  home-daily/  health/  personal-care/
    ├── post-communication/  entertainment/  family-relationships/
    ├── accommodation/  travel-tourism/  emergency/  work/
    ├── religion-culture/
    ├── grammar/               # G01–G24 grammar lessons
    ├── reading-writing/       # Phonetic-mode lessons
    └── TSL/                   # Listening & Speaking books 1–2
```

## Quick start

Zabon is a static site, but lessons are loaded with `fetch()`, so it must be
served over HTTP (opening `index.html` via `file://` will not work):

```bash
python3 -m http.server 8080
# or: npx serve
```

Then open `http://localhost:8080`. No install, no build, no dependencies.

## Lesson data (v2 format)

Each lesson is a single JSON file:

```json
{
  "version": 2,
  "items": [
    { "id": "header_core_words", "header": true,
      "texts": { "en": "Core Words", "th": "คำศัพท์หลัก", ... } },
    { "id": "word_thank", "kind": "word",
      "texts": { "en": "thank", "th": "ขอบคุณ", ... } },
    { "id": "sentence_example", "kind": "sentence",
      "itemIds": ["word_thank"],
      "texts": { "en": "Thank you", "th": "ขอบคุณครับ", ... },
      "tokens": { "th": ["ขอบคุณ", "ครับ"], ... } }
  ]
}
```

Rules enforced by the validator:

- Top level is `{ "version": 2, "items": [...] }`.
- Headers (`"header": true`, no `kind`) are non-interactive dividers; they are
  excluded from exercises and playback.
- Sentences before words within each scenario; minimum 5 scenarios per lesson.
- Every `texts` and `tokens` block covers exactly
  `en, th, fa, ar, es, zh, ja`.
- Every `itemIds` entry resolves to a word defined in the same file.
- Explicit token arrays for all languages; tokens must reconstruct the
  sentence text exactly (th/zh/ja segmented into meaningful units).

Validate the whole library:

```bash
node tools/check-lessons.js
```

## Privacy

No accounts, no server, no analytics. All state — settings, lesson language
selection, flashcard schedules, quiz history, study plan, lessons tried — is
stored locally in `localStorage` under `zabon.*` keys and never leaves your
browser. Everything can be reset from the Progress view.

## Browser support

Modern browsers (ES2020+). Speech uses the Web Speech API; available voices
depend on the device. Thai/Chinese/Japanese tokenization uses
`Intl.Segmenter` where available.

## Development notes

- All interaction goes through one delegated click handler via `data-action`
  attributes in `app.js`; views are rendered by dedicated functions.
- Every UI string in `UI_STRINGS` must cover all 7 app languages.
- CSS is language-agnostic: no `[lang=…]`/`:lang()` selectors; direction comes
  from `dir` attributes plus logical CSS properties.
- Storage keys are namespaced `zabon.*`.
- Data contributions: change one lesson JSON at a time and run
  `tools/check-lessons.js` before committing.

## Roadmap

- ✅ v2 data migration complete: 92 lessons passing validation (0 errors)
- ✅ Grammar (G1–G24) + phonetic Reading & Writing
- ✅ TSL Listening & Speaking books 1–2
- ✅ Two-panel lesson view (Words + Sentences) with Sentences open by default
- ✅ Onboarding → study plan with grammar prerequisites
- 🔄 Additional thematic content
- 📱 PWA installation polish
- 🔐 Optional progress export/backup

## License

Educational project.

Built with ❤️ for Thai language learners worldwide.
