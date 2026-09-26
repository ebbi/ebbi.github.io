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

mkdir -p apps/blog/tools/milestones \
 apps/blog/tools/tests \
 apps/blog/tools/reports/archive \
 apps/blog/content/en \
 apps/blog/content/fa \
 apps/blog/content/ar \
 apps/blog/content/th \
 apps/blog/assets/css \
 apps/blog/assets/js \
 apps/blog/assets/img \
 apps/blog/assets/data
touch apps/blog/tools/.gitkeep \
 apps/blog/assets/img/.gitkeep \
 apps/blog/assets/data/.gitkeep

After Approving the seemingly correct Scope confirmation for :
SCOPE CONFIRMATION Milestone: 00 Bootstrap & Foundation Files I will create:

zabon/apps/blog/index.html
zabon/apps/blog/assets/css/style.css
zabon/apps/blog/assets/js/router.js
zabon/apps/blog/assets/js/app.js
zabon/apps/blog/tools/test-integrity.js
zabon/apps/blog/tools/hash-state.js Files I will modify: None Files I will NOT touch: Any files outside zabon/apps/blog/, Root .gitignore

The above files were created at the top level and not in the zabon/apps/blogs

I have manually moved the files into blogs folder but this needs to be resolved for the tests to pass and future file generation.

The test:
$ node apps/blog/tools/fetcher.js --refresh
🚀 Zabon Blog — Content Fetcher
==================================================
🔄 --refresh flag detected: forcing fresh fetch

📡 Fetching from https://twolegsbadblog.wordpress.com/wp-json/wp/v2/posts...
❌ Network request failed: HTTP 404: Not Found

❌ Fetcher failed: no data available

Because, const WP_API_URL = "https://twolegsbadblog.wordpress.com/wp-json/wp/v2/posts";
