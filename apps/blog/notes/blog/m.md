I have a vanilla JS, HTML, CSS web App hosted on Github.
The index page for the App points to smaller Apps. The folder structure is:
zabon/apps/zabon
zabon/apps/zabon-thai
zabon/apps/blog
Currently I am working on the blog App.

There is git repo setup for staging and testing:
https://github.com/beraar/beraar.github.io/tree/develop

My local git workflow will be:

# 1. Start feature

git checkout develop
git pull staging develop
git checkout -b blog/qwen

# 2. Edit files, then commit

git add .
git commit -m "blog ..."

# 3. Merge into develop and push to staging

git checkout develop
git merge blog/qwen
git push staging develop

The local folder structure is:
zabon/app/blog

I have a detailed plan for implementing the blog (see uploaded blog-plan.md).The plan was intended to be used with Qwen web interface with file uploads.

My question: can Qwen coder interface be used instead of the Qwen web interface to develop the blog App? If so, what is the typical workflow and how is the git repo used in the workflow to update local files and carryout each stage of the plan.

Please address the question above before converting the blog-plan.md to be suitable for the Qwen coder workflow.

---

Before generating the Qwen-Coder-optimized version of blog-plan.md, please clarify how the statement, "Please read @tools/CONTEXT.md" works as there is no access to my local git branch. Does Qwen coder access: https://github.com/beraar/beraar.github.io/tree/develop
And my second question is how is any new code accessed from Qwen to store in the local repo?

---

I am willing to use a Qwen-powered extension inside VS Code. The next step seems to be the setup an extension withing VS Code. Please provide instruction for installing the VS Code extension.
My development environment is the latest VS Code on Ubuntu Mate running on a Raspberry Pi (64bit)

---

The settings displays:
Important:

    Replace sk-or-v1-YOUR_OPENROUTER_API_KEY_HERE with your actual OpenRouter API key.
    Save the file (Ctrl+S). Continue will automatically reload the configuration.

- I saved the configuration YAML file (with the actual OpenRouter API key). Restarted VS Code.
- Clicked on the Continue icon on the VS Code left panel.
- Continue panel opens and the Select model panel displays:
  Models
  No models configured

* Add Chat model
  Ctrl' to toggle model

- Selecting the Add Chat model displays:
  Provider - chose OpenRouter
  Model - numerous Qwen models
  Which model shall I choose? (or am I mistaken in the process for the model/chat setup?)

  qwen-2.5-coder-32b-instruct is not found. The Qwen options available are:
  Qwen-plus
  Qwen3.5-9B
  Qwen3.5-27B
  Qwen3.5-Flash
  Qwen3.5-35B-A3B
  Qwen3.5-122B-A10B
  Qwen3.5 Plus 2026-02-15
  Qwen3.5 Plus 2026-04-20

In the chat input box at the bottom, typing the @ symbol pops up with options:
@ Current File

- Git Diff
- Terminal
- Problems
- Rules
- Add more context providers

Before carrying out the previous message tasks, I need to clarify the current App folder structure as zabon/tools/CONTEXT.md seems incorrect.

The folder structure is:

zabon/
├── index.html ← Home page (links to all apps)
├── assets/ ← Shared CSS, images, fonts
├── apps/
│ ├── zabon/ ← Existing Web App #1
│ │ └── (its own files)
│ ├── zabon-thai/ ← Existing Web App #2
│ │ └── (its own files)
│ └── blog/ ← current dev app (folder)
│ └── (empty for now)
├── .gitignore
└── README.md

The blog feature is intended as a complete self contained App within the apps folder.

And second, I would like to study the revised blog-plan.md before starting to implement it.

zabon/
├── index.html ← Home page (links to all apps)
├── assets/ ← Shared CSS, images, fonts (for the main site)
├── apps/
│ ├── zabon/ ← Existing Web App #1
│ ├── zabon-thai/ ← Existing Web App #2
│ └── blog/ ← The self-contained Blog App (NEW)
│ ├── tools/ ← CONTEXT.md, LOCKED_DECISIONS.txt, milestones, tests
│ ├── content/ ← en/, fa/, ar/, th/ markdown files
│ ├── assets/ ← css/, js/, img/, data/ (specific to the blog)
│ └── index.html ← Blog entry point
├── .gitignore ← Root gitignore (will ignore node_modules, etc.)
└── README.md

http://127.0.0.1:5500/apps/blog/
returns a blank page.

BlogRenderer.render([
{ type: 'paragraph', content: 'Hello World' },
{ type: 'heading', content: 'Test Heading', level: 2 },
{ type: 'image', src: 'https://via.placeholder.com/400x200', caption: 'Test Image Caption' },
{ type: 'quote', content: 'This is a test quote' }
])
Uncaught ReferenceError: BlogRenderer is not defined
<anonymous> debugger eval code:1

debugger eval code:1:4
<anonymous> debugger eval code:1
