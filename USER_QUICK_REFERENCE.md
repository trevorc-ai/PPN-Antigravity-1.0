# PPN Swarm — User Quick Reference
*Last updated: 2026-02-23 | agent.yaml v5.0.0*

---

## How to Talk to Agents

Just type naturally. The swarm identifies which agent should respond based on context.
To address a specific agent directly, call them by name: `@LEAD`, `@INSPECTOR`, `@PRODDY`, etc.

---

## Slash Commands (Workflows)

Type these exactly to trigger a pre-defined agent playbook.

| Command | When to use | Who runs it |
|---|---|---|
| `/lead-pipeline-scan` | Start of any session — see full queue state | LEAD |
| `/finalize_feature` | End of every build session — commit + push | LEAD |
| `/proddy-review` | After PRODDY writes a PRD | INSPECTOR |
| `/pre-commit-safety` | BEFORE any database migration | LEAD / SOOP |
| `/schema-change-policy` | When SOOP is about to change the DB schema | SOOP |
| `/database-integrity-policy` | When auditing or questioning data quality | INSPECTOR |
| `/data-seeding-pipeline` | When seeding benchmark/clinical data | ANALYST |
| `/create_tooltips` | When adding tooltips to a component | BUILDER |

---

## When YOU Need to Decide (Swarm will always escalate these)

- Any database migration touching **production data**
- Priority changes between **P0 tickets**
- **Scope changes** that add more than 1 day of BUILDER work
- Any change to **`agent.yaml`** or `GLOBAL_RULES.md`
- Deleting or **archiving** a work order

---

## What the Swarm Decides Autonomously (Don't Worry About These)

- Which file to edit for a feature
- Code style and implementation approach
- Ticket routing between queues (`mv` commands)
- Git commit message wording
- Whether to run diagnostic commands (grep, git log, ls)

---

## Agent Roster — Who Does What

| Agent | Role | Ask them when… |
|---|---|---|
| **CUE** | Intake & ticket creation | You have a new idea or request to formalize |
| **LEAD** | Architect & coordinator | You need strategy, routing, or the pipeline is stuck |
| **PRODDY** | Product strategy & PRDs | You need to figure out *why* to build something |
| **DESIGNER** | UI/UX & design specs | You need layout decisions before code is written |
| **BUILDER** | React/TypeScript code | You need a feature built |
| **SOOP** | SQL & database | You need schema changes or migrations |
| **MARKETER** | Copy, SEO, pricing | You need landing page content or positioning |
| **ANALYST** | Data & KPIs | You need to understand what the data says |
| **INSPECTOR** | QA gatekeeper | You want code reviewed before shipping |

---

## Pipeline Queue Map

```
00_INBOX → 01_TRIAGE → 02_DESIGN → 03_BUILD → 04_QA → 05_USER_REVIEW → 06_COMPLETE
  CUE         LEAD       DESIGNER    BUILDER    INSPECTOR    YOU           DONE
                         PRODDY      SOOP
                                     MARKETER
                                     ANALYST
```

**New PRODDY gate (v5.0.0):**
```
PRODDY writes PRD in 01_TRIAGE → INSPECTOR runs /proddy-review → LEAD architects
```

---

## Quick Status Check

When you want to know where things stand, say **"@LEAD pipeline scan"** or type `/lead-pipeline-scan`.

LEAD will check:
- `git log --oneline -5` (what was recently shipped)
- `03_BUILD` queue (what's being worked on now)  
- `04_QA` queue (what's waiting for review)
- `00_INBOX` (anything unprocessed)

---

## Two-Strike Rule

If a ticket fails INSPECTOR review **twice**, the swarm stops and escalates to you.  
You'll see: `❌ TWO STRIKES. Run git restore .`

This means the approach needs to change — talk to LEAD to re-scope before more code is written.

---

## End of Session Checklist

The swarm handles this automatically, but you can verify:
1. `git status` — should show clean working tree
2. `git log -1 --oneline` — should show `(HEAD → main, origin/main)` — in sync with GitHub
3. `03_BUILD` queue — should be empty or have only items you're OK leaving

---

*This file is for the USER only. Do not route this through the ticket system.*
