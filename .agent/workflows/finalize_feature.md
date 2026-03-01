---
description: Stage, commit, and push changes to the remote repository to secure progress. MANDATORY after every build session.
---

// turbo-all applies to steps 1–3 ONLY. Step 4 (push) is NEVER auto-run.

⚠️ STANDING USER RULE (overrides turbo-all): The USER must review all diffs before
any git push. DO NOT push until the USER has explicitly said "push" or "approved".

1. Check the current git status to see what will be committed.
   - `git status`

2. Show the full diff of all staged changes for USER review.
   - `git diff HEAD` (or `git diff --staged` if already staged)
   - STOP HERE. Present the diff output to the USER and wait for explicit approval.
   - Do NOT proceed to step 3 until the USER says "looks good", "approved", or "push".

3. Add all changes to the staging area and commit.
   - `git add -A`
   - `git commit -m "feat: [descriptive message referencing the work order]"`

4. ⛔ MANUAL APPROVAL REQUIRED — Push only after USER explicitly approves.
   - `git push origin [branch]`
   - Never auto-run this step. Always wait for USER go-ahead.

5. Confirm the push was successful and report the new HEAD hash.
   - `git log -1 --oneline`
   - Confirm output shows `(HEAD -> branch, origin/branch)` — local and remote in sync.
   - If they are NOT in sync, notify USER before attempting again.
