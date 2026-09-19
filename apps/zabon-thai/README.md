# Zabon - Thai Language Learning App

A multilingual web application for learning Thai with support for English and Persian (Farsi) translations. The app features interactive documents, text-to-speech functionality, quizzes, and spaced repetition learning.

## Features

### Core Learning Tools
- **Interactive Documents**: Browse and study Thai language lessons with word-by-word breakdowns
- **Text-to-Speech (TTS)**: Listen to native pronunciation with adjustable speed, pitch, and voice settings
- **Quizzes**: Test your knowledge with vocabulary and sentence exercises
- **Spaced Repetition System (SRS)**: Flashcard-based learning with intelligent review scheduling
- **Progress Tracking**: Monitor your learning activity and session history

### Language Support
- **Source Language**: Thai (th)
- **Target Languages**: English (en), Persian/Farsi (fa)
- **UI Localization**: Full interface translation in all three languages

### Document Library
- TSL (Thai As a Second Language) curriculum - 10 levels
- Progressive reading materials
- Thematic vocabulary collections
- Grammar reference sheets
- Blog articles (planned feature)

## Project Structure

```
/workspace
├── index.html              # Main entry point
├── app.js                  # Application logic (module pattern)
├── style.css               # Styles and themes
├── admin.html              # Admin interface
├── test-plan.html          # Testing interface
├── locales/                # UI translations
│   ├── en.json            # English translations
│   ├── fa.json            # Persian translations
│   └── th.json            # Thai translations
├── data/                   # Learning content
│   ├── manifest.json      # Document catalog and metadata
│   ├── TSL/               # TSL curriculum files (LS1.json, LS2.json, etc.)
│   ├── progressive/       # Progressive reading materials
│   ├── thematic/          # Thematic vocabulary
│   ├── grammar/           # Grammar reference sheets
│   └── reading/           # Additional reading content
├── blogs/                  # Blog articles (future feature)
├── fa/                     # Persian-specific resources
└── plan.txt               # Development roadmap
```

## Quick Start

### Running Locally

1. Clone or download the repository
2. Open `index.html` in a modern web browser
3. No build process required - pure HTML/CSS/JavaScript

### For Development

You can use any local web server:

```bash
# Using Python 3
python -m http.server 8080

# Using Node.js
npx serve

# Using PHP
php -S localhost:8080
```

Then navigate to `http://localhost:8080`

## Usage Guide

### Getting Started
1. **Browse Library**: Navigate to the Library section to see available documents
2. **Select Document**: Click on any document to open it
3. **Listen & Learn**: Click on sentences or words to hear them spoken
4. **Adjust Settings**: Customize speed, voice, and display preferences
5. **Take Quizzes**: Test your knowledge after studying

### Media Player Controls
- **Play/Pause**: Toggle audio playback
- **Stop**: Stop current playback
- **Speed**: Adjust playback speed (0.5x - 2x)
- **Delay**: Control pause between sentences
- **Pitch**: Modify voice pitch

### Settings
- **Language Options**: Choose which translations to display
- **Font Selection**: Standard, Classic (Serif), Modern Thai, or Farsi Script
- **Theme**: Light or dark mode
- **Voice Settings**: Select TTS voice and language

## Data Model

### Document Structure
Each learning document contains:
- Vocabulary with translations in multiple languages
- Sentence breakdowns with grammatical information
- Audio metadata for TTS
- Difficulty level and estimated study time

### Manifest System
The `manifest.json` file catalogs all learning objects with:
- Document metadata (title, description, level)
- File paths to content
- Word and sentence counts
- Grammar points and tags
- Estimated completion time

## Customization

### Adding New Content
1. Create JSON data files following the existing structure in `data/TSL/`
2. Update `manifest.json` with new document entries
3. Add UI translations to `locales/*.json` if needed

### Theme Customization
Modify `style.css` to customize:
- Color schemes
- Font families
- Layout and spacing
- Responsive breakpoints

## Technical Details

### Architecture
- **Module Pattern**: JavaScript organized in self-contained modules
- **State Management**: Centralized state with localStorage persistence
- **Event Bus**: Pub/sub pattern for component communication
- **Router**: Client-side navigation for different views

### Browser Compatibility
- Modern browsers with ES6+ support
- Web Speech API for TTS functionality
- LocalStorage for user preferences and progress

### Dependencies
- Google Fonts (Kanit, Noto Sans Thai, Noto Serif Thai, Vazirmatn)
- Material Icons
- No external JavaScript frameworks

## Roadmap

### Completed Features
- ✅ Core document viewer with TTS
- ✅ Quiz system with scoring
- ✅ Spaced repetition flashcards
- ✅ Multi-language UI
- ✅ Settings persistence
- ✅ Activity tracking

### Planned Features
- 🔄 Blog reader with multilingual highlighting
- 📚 Advanced literacy materials (RW 4-5)
- 🎯 Enhanced progress analytics
- 📱 Mobile app optimization
- 🔐 User accounts and cloud sync

## Development Notes

### Text-to-Speech Setup

**Android:**
1. Search for "Text-to-speech" in device Settings
2. Ensure "Google Speech Services" is the preferred engine
3. Install Thai (Thailand) voice data

**iOS/macOS:**
1. Go to Settings > Accessibility > Spoken Content
2. Download Thai voice in Voices settings
3. Adjust speaking rate as needed

### Testing
- Use `test-plan.html` for feature testing
- Admin interface available at `admin.html`
- JSON generation tools in `data/generate-json/`

## License

This project is for educational purposes.

## Contributing

Contributions are welcome! Please ensure:
- JSON files follow the established schema
- Translations are accurate and culturally appropriate
- Code follows the existing module pattern
- Test thoroughly before submitting

## Support

For questions or issues, please refer to the in-app Help section or check the documentation in the `/blogs` directory.

---

**Built with ❤️ for Thai language learners worldwide**
