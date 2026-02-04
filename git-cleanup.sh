#!/bin/bash
# git-cleanup.sh
echo "Starting Git cleanup..."
echo "Original size:" $(du -sh .git | cut -f1)

# Remove local refs to deleted remote branches
git fetch --prune

# Clean reflog
git reflog expire --expire=now --all

# Aggressive garbage collection
git gc --aggressive --prune=now

# Remove packed refs
git pack-refs --all --prune

echo "Final size:" $(du -sh .git | cut -f1)
echo "Cleanup complete!"