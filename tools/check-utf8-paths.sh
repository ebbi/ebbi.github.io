#!/usr/bin/env bash
# check-utf8-paths.sh — fail if any staged file path (or text content) is not
# valid UTF-8.
#
# Why: GitHub Pages runs Jekyll, which reads every source-tree path as UTF-8.
# A single file whose NAME contains invalid bytes aborts the build with:
#     "invalid byte sequence in UTF-8"
# (This happened once with a 0-byte file named \x01\x04\xe6\x04@p9N@8.)
#
# Usage:
#   tools/check-utf8-paths.sh            # check staged files (pre-commit)
#   tools/check-utf8-paths.sh --all      # check all tracked files
#
# Exit 0 = clean, exit 1 = offending path(s) found. Never mutates the index.

set -euo pipefail

mode="${1:-staged}"

if [[ "$mode" == "--all" ]]; then
  list_cmd=(git ls-files -z)
else
  list_cmd=(git diff --cached --name-only --diff-filter=ACM -z)
fi

python3 - "${list_cmd[0]}" "${list_cmd[@]:1}" <<'PY'
import subprocess
import sys

cmd = sys.argv[1:]
raw = subprocess.run(cmd, capture_output=True, check=True).stdout
names = [p for p in raw.split(b"\0") if p]

bad_paths = []
bad_content = []

for p in names:
    # 1) Path must be valid UTF-8.
    try:
        path = p.decode("utf-8")
    except UnicodeDecodeError as exc:
        bad_paths.append((p, exc))
        continue

    # 2) Non-binary content must be valid UTF-8 (skip images/PDFs/etc.).
    try:
        with open(path, "rb") as fh:
            data = fh.read()
    except (FileNotFoundError, IsADirectoryError, PermissionError):
        continue
    if b"\0" in data:
        continue
    try:
        data.decode("utf-8")
    except UnicodeDecodeError as exc:
        bad_content.append((path, exc))

if bad_paths:
    sys.stderr.write("\nERROR: non-UTF-8 file NAME(s) staged:\n")
    for p, exc in bad_paths:
        sys.stderr.write(f"  {p!r}  ({exc})\n")
    sys.stderr.write(
        "\nRemove them, e.g.:\n"
        "  git rm --cached -- <name>\n"
        "  rm -- <name>   # or: find . -type f ! -name '*.png' ... to locate\n"
        "\nThese break the GitHub Pages / Jekyll build.\n"
    )

if bad_content:
    sys.stderr.write("\nERROR: non-UTF-8 file CONTENT:\n")
    for path, exc in bad_content:
        sys.stderr.write(f"  {path}  ({exc})\n")
    sys.stderr.write("\nRe-save these files as UTF-8.\n")

sys.exit(1 if (bad_paths or bad_content) else 0)
PY
