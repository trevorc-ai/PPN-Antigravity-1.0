---
description: LEAD auto-orientation workflow — run automatically at the start of every session before doing anything else. Surfaces current state, user review queue, and next actions in one read.
---

# `/brief` — Automatic Session Orientation

> **LEAD must run this workflow automatically at the start of every new conversation, before reading any WO, before running pipeline scan, before anything else.**
> The user should never have to ask for context. LEAD provides it unprompted.

## When to Run (Automatic Triggers)

Run this workflow immediately when any of these conditions are true:
- A new conversation has started and LEAD has not yet given an orientation
- The user's first message does not invoke a specific slash command
- The user says "where were we", "what's the status", "catch me up", or similar

## Step 1: Read SESSION_HANDOFF.md

```bash
cat /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/SESSION_HANDOFF.md
```

## Step 2: Scan for User Review Items (the most important queue)

```bash
ls /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/_WORK_ORDERS/06_USER_REVIEW/ 2>/dev/null
ls /Users/trevorcalton/Desktop/PPN-Antigravity-1.0/_GROWTH_ORDERS/06_QA/ 2>/dev/null
```

## Step 3: Post This Exact Format (no extra commentary)

```
📋 **Session Brief** — [today's date]

**Needs Your Eyes:**
[List each item in 06_USER_REVIEW and 06_QA — ticket ID + one-sentence description. If empty: "Nothing pending your review."]

**Active / In-Flight:**
[2-3 most urgent in-flight items from SESSION_HANDOFF.md]

**Recommended Focus:**
[Top 1 action item for this session, one sentence]

Commands: `/fast-track [sentence]` · `/lead-pipeline-scan` · `/ppn-ui-standards [file]` · `wrap up`
```

## Rules

- Keep the brief itself under 12 lines. No tables, no headers beyond what's shown above.
- Do NOT ask the user any questions in the brief response. State facts only.
- **After posting the brief, immediately run `/lead-pipeline-scan` inline — drain `00_INBOX`, `02_TRIAGE`, `03_REVIEW`, `05_QA`, and all `_GROWTH_ORDERS` non-BUILDER queues before returning control.** Do not wait for the user to ask. Do not ask permission. Just run it.
- The user only receives control back after all agent-owned queues are actioned.

## Changelog

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-03-24 | ANTIGRAVITY | Initial — auto-orientation workflow. Replaces manual re-explanation at session start. |
| 1.1 | 2026-03-25 | LEAD | Removed anti-pattern rule blocking pipeline scan. After posting brief, LEAD must immediately drain all non-BUILDER queues inline. User receives control only after all agent-owned queues are actioned. |

