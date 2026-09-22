The local folder structure is as follows:

zabon/
├── index.html ← Home page (links to all apps)
├── assets/ ← Shared CSS, images, fonts
├── apps/
│ ├── zabon/ ← Existing Web App #1
│ │ └── (its own files)
│ ├── zabon-thai/ ← Existing Web App #2
│ │ └── (its own files)
│ └── blog/ ← Future app (folder)
│ └── (empty for now)
├── .gitignore
└── README.md

I have followed Option 1 — Bring the Apps into the monorepo (recommended for a unified home page)

The .git folder has been deleted in both Apps.

The task now is to setup local git and remote live (ebbigithub.io) and staging (beraar.github.io)

I am using VS Code and terminal on a Ubuntu Mate OS.

===============

The index.html and CSS should be a mobile first design. An App toolbar should have the localized name "Zabon", a "hamburger" icon with a collapsible panel that has a language icon for selecting, English, Persian, Thai or Arabic (localized language name + flag) and a Day/Night/Auto settings.
Please provide the code for the above and a .gitignore file.

# Please add Myanmar to the list of languages and update all the text.

The main home index page, zabon/index.html should support the apps languages which are, Arabic, Burmese, English, Spanish, Persian, Japanese, and Thai. Update accordingly.

Sorry, corrected full list of App supported languages:
Arabic, Burmese, Chinese, English, Japanese, Persian, Spanish and Thai.
