---
description: Stage, commit, and push changes after QA passes. The agent decides when to push — no user approval gate. Push happens automatically once the agent is satisfied the work is complete and correct.
---

// turbo-all

1. Check the current git status to see what will be committed.
   - `git status`

2. Add only the relevant changed files to staging (never `git add -A` blindly).
   - `git add <specific files>`
   - Verify staging: `git diff --cached --stat`

3. Commit the changes with a descriptive message referencing the work done.
   - `git commit -m "feat: WO-NNN — <description>"` (must satisfy commit-msg gate)

4. Push immediately. No user approval required — the agent is responsible for QA before reaching this step.
   - `git push origin main`

5. Confirm successful push and report the new HEAD hash to the user.
   - `git log -1 --oneline`
