Zabon is a mobile-first language agnostic vanilla HTML, CSS, JS App. The Zabon index.html home pages has a list of Zabon Apps which are independent complete Apps and currently include Zabon, Zabon-thai, and blog. Here is the folder structure:

zabon/
├── index.html ← Home page (links to all apps)
├── assets/ ← CSS, images, fonts
├── apps/
│ ├── zabon/ ← Existing Web App #1
│ │ └── (its own files)
│ ├── zabon-thai/ ← Existing Web App #2
│ │ └── (its own files)
│ └── blog/ ← Existing Web App #3
├── .gitignore
└── README.md

The current task is to:

- Rename the blog App to be zabon-blog
- The index page toolbar for the App zabon and zabon-thai have a link Zabon that points to the main index page. The link word Zabon should be replaced with a suitable icon for the main index page.
- The zabon-blog App should have the same main home link in its toolbar.
