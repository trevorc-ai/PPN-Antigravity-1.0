---
description: Automatically stage, commit, and push changes to the remote repository to secure progress.
---

1. Check the current git status to see what will be committed.
   - `git status`

2. Add all changes to the staging area.
   - `git add .`

3. Commit the changes with a standard message.
   - `git commit -m "feat: finalize feature (auto-push)"`

4. Push the changes to the current branch on origin.
   - `git push origin HEAD`

5. Confirm the push was successful.
   - `git log -1 --stat`
