---
description: Automatically stage, commit, and push changes to the remote repository to secure progress. MANDATORY after every build session — push is non-optional.
---

// turbo-all

1. Check the current git status to see what will be committed.
   - `git status`

2. Add all changes to the staging area.
   - `git add -A`

3. Commit the changes with a descriptive message that references the work order.
   - `git commit -m "feat: finalize feature (auto-push)"`

4. Push the changes to origin/main to secure to GitHub.
   - `git push origin main`

5. Confirm the push was successful and report the new HEAD hash.
   - `git log -1 --oneline`
   - Confirm output shows `(HEAD -> main, origin/main)` — meaning local and remote are in sync.
   - If they are NOT in sync, push again before stopping.
