Zabon is a mobile-first language agnostic vanilla HTML, CSS, JS App. The Zabon index.html home pages has a list of Zabon Apps which are independent complete Apps and currently include Zabon and Zabon-thai. Here is the folder structure:

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

The current task is to clarify the requirement and design of a mobile-first multilingual Blog App. Please do not generate any code and instead help clarify requirements and the detail design of the Blog App.

The output should be design questions and clarification followed by subsequent messages and replies to finalize a list of chat messages with clear requirement and tests to approve at each stage before progressing to the next stage of the App design implementation.

The requirement so far:

- The Blog App should be a mobile-first design implemented as a vanilla CSS, HTML, JS.
- There should be a toolbar consistent with the Zabon toolbar, with a collapsible panel for language selection and Dark/Light/Auto toggle modes.
- The toolbar should have a localized search input box for the blogs.
- The blogs should be self contained with their own assets including images and links to resources and articles.
- The blogs should have URL friendly addresses that can be shared on social media Apps.
- The initial target translation languages for the blogs are, Arabic, English, Persian and Thai.

===============
