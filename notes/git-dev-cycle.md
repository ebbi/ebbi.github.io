# 1. Start feature

git checkout develop
git pull staging develop
git checkout -b feature/my-feature

# 2. Edit files, then commit

git add .
git commit -m "Add my feature"

# 3. Merge into develop and push to staging

git checkout develop
git merge feature/my-feature
git push staging develop

# → test at https://beraar.github.io/

# 4. Promote to live

git checkout main
git pull live main
git merge develop
git push live main

# → verify at https://ebbigithub.io/

# 5. Tidy up

git branch -d feature/my-feature
git checkout develop
git merge main
git push staging develop
