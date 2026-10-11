#!/bin/bash

# 1. Check if we are inside a Git repository
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "❌ Error: You are not inside a Git repository."
    exit 1
fi

# 2. Warn the user
echo "========================================================"
echo "⚠️  WARNING: DESTRUCTIVE ACTION ⚠️"
echo "This script will permanently delete ALL previous commits,"
echo "branches, and logs. It will keep your current files and"
echo "save them as a single new 'Initial' commit."
echo "========================================================"
read -p "Are you absolutely sure you want to proceed? (y/N) " confirm

if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    echo "Aborted."
    exit 0
fi

echo "Starting Git cleanup..."
echo "Original size:" $(du -sh .git | cut -f1)

# 3. Get the current branch name to restore it later
CURRENT_BRANCH=$(git branch --show-current)
if [ -z "$CURRENT_BRANCH" ]; then
    # Fallback if in a detached HEAD state
    CURRENT_BRANCH="main" 
fi

echo "🔄 Creating an orphan branch..."
git checkout --orphan temp_cleanup_branch

echo "📦 Staging all current files..."
git add -A

echo "💾 Creating the new single commit..."
# Grab the message from the very last commit, or use a default
LAST_MSG=$(git log -1 --pretty=%B 2>/dev/null || echo "Fresh start after history cleanup")
git commit -m "$LAST_MSG"

echo "🗑️  Deleting the old branch with all history..."
git branch -D "$CURRENT_BRANCH"

echo "🔁 Renaming the new branch back to the original name..."
git branch -m "$CURRENT_BRANCH"

echo "🧹 Clearing reflogs and garbage collecting to free disk space..."
# This ensures the old commits are actually removed from your local disk
git reflog expire --expire=now --all
git gc --prune=now --aggressive

echo "✅ Cleanup complete!"
echo "Your repository now contains only one commit."
echo "Final size:" $(du -sh .git | cut -f1)
