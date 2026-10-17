#!/usr/bin/env bash
# install-git-hooks.sh — point git at the versioned .githooks/ directory so
# the pre-commit UTF-8 guard is shared by everyone who clones the repo.
#
# Run once per clone:
#   tools/install-git-hooks.sh
set -euo pipefail
root="$(git rev-parse --show-toplevel)"
cd "$root"

chmod +x .githooks/pre-commit tools/check-utf8-paths.sh
git config core.hooksPath .githooks

echo "core.hooksPath -> .githooks"
echo "pre-commit UTF-8 guard installed."
