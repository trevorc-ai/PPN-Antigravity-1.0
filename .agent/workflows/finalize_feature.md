---
description: Stage, commit, and push changes to the remote repository to secure progress. MANDATORY after every build session.
---

// turbo-all applies to steps 1–3 ONLY. Steps 4 and 5 are NEVER auto-run.

⚠️ STANDING USER RULES (override turbo-all):
1. The USER must review all diffs before any commit or push.
2. `--no-verify` is FORBIDDEN without explicit USER instruction — it carries the
   same approval requirement as `git push`. Agents may NOT self-authorize it.
3. When presenting diffs to the USER, explain each change in plain English
   (what file, what changed, why it matters) — do not just dump raw diff output.

1. Check the current git status to see what will be committed.
   - `git status`
   - Summarize for USER: "X files changed — here's what they are and why."

2. Show the full diff of all staged changes for USER review.
   - `git diff HEAD` (or `git diff --staged` if already staged)
   - STOP HERE. Explain each changed file in plain English:
     - What file was changed
     - What specifically changed (added / removed / renamed)
     - Why it matters (what feature or fix it belongs to)
   - Do NOT proceed until the USER says "looks good", "approved", or "push".

3. Add all changes to the staging area and commit.
   - `git add -A`
   - `git commit -m "feat: [descriptive message referencing the work order]"`
   - If the pre-commit hook blocks the commit (>5 files, frozen file, SQL, etc.):
     STOP. Show the USER the block message. Ask explicitly: "The gate blocked this
     commit because [reason]. Do you want me to bypass it with --no-verify?"
     Only run `git commit --no-verify` if the USER says yes.

4. ⛔ MANUAL APPROVAL REQUIRED — Push only after USER explicitly approves.
   - `git push origin [branch]`
   - If the pre-push hook blocks: show the USER the block output and wait.
   - Only run `git push --no-verify` if the USER explicitly says to bypass.

5. Confirm the push was successful and report the new HEAD hash.
   - `git log -1 --oneline`
   - Confirm output shows `(HEAD -> branch, origin/branch)` — local and remote in sync.
   - If they are NOT in sync, notify USER before attempting again.
