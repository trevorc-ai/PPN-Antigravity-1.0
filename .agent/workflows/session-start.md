---
description: Mandatory session-start pipeline scan — run at the top of every work session to unblock the pipeline.
---

// turbo-all
1. Check git state: `git log --oneline -3 && echo "---" && git status --short`
2. Count the TRIAGE queue: `find _WORK_ORDERS/01_TRIAGE -name "*.md" | grep -v DS_Store | wc -l`
3. Count USER_REVIEW queue: `find _WORK_ORDERS/05_USER_REVIEW -name "*.md" | grep -v DS_Store`
4. Count INBOX queue: `find _WORK_ORDERS/00_INBOX -name "*.md" | grep -v DS_Store | wc -l`
5. Report findings in this format:

```
==== SESSION START REPORT ====
Git: [HEAD commit] — [in sync / N commits ahead of origin]
Uncommitted changes: [N files / clean]

INBOX:    [N] tickets unrouted
TRIAGE:   [N] tickets awaiting LEAD architecture
BUILD:    [N] tickets in progress
QA:       [N] tickets awaiting INSPECTOR
REVIEW:   [N] tickets awaiting USER decision
HOLD:     [N] tickets paused

ACTION NEEDED:
- [list any queue > 5, any uncommitted changes, any misrouted tickets]
==== SESSION START REPORT ====
```

6. Ask USER: "Which queue do you want to work through first?"
