---
description: Stage, commit, and push changes after QA passes. INSPECTOR stages and commits automatically, then posts a push confirmation to the user. Push only happens after the user replies "push".
---

// turbo-all

1. Check the current git status to see what will be committed.
   - `git status`

2. Add only the relevant changed files to staging (specific files from the WO's `files:` field — never `git add -A` blindly).
   - `git add <specific files>`
   - Verify staging: `git diff --cached --stat`

3. Commit the changes with a descriptive message referencing the WO.
   - `git commit -m "feat: WO-NNN — <description>"` (must satisfy commit-msg gate)
   - Confirm with: `git log -1 --oneline`

4. **STOP. Do NOT push yet.** Post the following message to the user exactly:

   > ✅ **STATUS: APPROVED — WO-NNN committed** (`<hash>`)
   > Files changed: `<stat summary>`
   > Reply **`push`** to deploy to production, or **`hold`** to review first.

5. Wait for the user to reply **`push`**. Then and only then:
   - `git push origin main`
   - Confirm: `git log -1 --oneline` and report the live hash.
   - Move the WO to `99_COMPLETED/`.
