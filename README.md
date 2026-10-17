# Zabon

A mobile-first home page that links to the Zabon family of web apps.

The site is a single static monorepo: one home page, shared assets, and each
app in its own subfolder. It is published to two GitHub Pages remotes — a
live site and a staging site — from the same local repository.

---

## Live Sites

| Environment | URL                       | Branch    | GitHub repo        |
| ----------- | ------------------------- | --------- | ------------------ |
| Live        | https://ebbigithub.io/    | `main`    | `ebbi.github.io`   |
| Staging     | https://beraar.github.io/ | `develop` | `beraar.github.io` |

Both repositories serve the same folder layout, so relative links work
identically in both environments.

---

Each app under `apps/` is self-contained. Shared CSS, JS, and images live at
the root under `assets/`.

---

## Features

- **Mobile-first layout** — single column on phones, grid on larger screens.
- **App toolbar** — sticky header with a hamburger button and the localized
  app name.
- **Collapsible side panel** — slides in from the left (right in RTL) and
  closes on backdrop tap, the close button, or `Esc`.
- **Language selector** — English, Persian, Thai, Arabic, and Myanmar, each
  shown with its flag and native name. Persian and Arabic switch the whole
  page to right-to-left automatically.
- **Theme selector** — Day, Night, or Auto. Auto follows the operating
  system's `prefers-color-scheme` and reacts live when the OS theme changes.
- **Persistent preferences** — language and theme choices are stored in
  `localStorage` and restored on the next visit.
- **No build step** — plain HTML, CSS, and JavaScript. Works directly on
  GitHub Pages.

---

## Repository notes

**Jekyll is bypassed.** The repo includes an empty `.nojekyll` file at the
root, so GitHub Pages serves the files as-is instead of running Jekyll. This
is faster and avoids Jekyll choking on stray filenames or interpreting `{{ }}`
in JS as Liquid. Do not delete `.nojekyll`.

**UTF-8 filenames are required.** Even with `.nojekyll`, keep filenames and
text files valid UTF-8. A file _named_ with invalid bytes once aborted the
build with `invalid byte sequence in UTF-8`. To enable the pre-commit guard in
your clone:

```bash
tools/install-git-hooks.sh   # sets core.hooksPath=.githooks (once per clone)
```

It blocks committing any non-UTF-8 filename or text-content file. Run it
manually over the whole repo with `tools/check-utf8-paths.sh --all`.

---
