---
description: Automatically stage, commit, and push changes to the remote repository to secure progress. MANDATORY after every build session — push is non-optional.
---

⚠️ PUSH REQUIRES EXPLICIT USER APPROVAL — never push without the user saying "go ahead and push" or equivalent.

1. Check the current git status to see what will be committed.
// turbo
   - `git status`

2. Add only the relevant changed files to staging (never git add -A blindly).
   - `git add <specific files>`
// turbo
   - Verify staging: `git diff --cached --stat`

3. Commit the changes with a descriptive message referencing the work done.
   - `git commit -m "feat/fix: <description>"`

4. ⛔ STOP HERE. Report the commit hash to the user and WAIT for explicit push approval.
   - `git log -1 --oneline`
   - Do NOT proceed to step 5 without the user saying "push" or "go ahead".

5. Only after explicit user approval — push to remote.
   - `git push origin main`

6. Confirm the push was successful and report the new HEAD hash.
// turbo
   - `git log -1 --oneline`
