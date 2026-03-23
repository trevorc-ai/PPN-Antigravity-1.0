# PPN Portal — User Guide
**Your one-page reference. When you want X, do Y.**

---

## The Two Pipelines

| If your request involves... | Use this | Entry point |
|---|---|---|
| A **bug fix**, new **feature**, **React component**, **database** change, routing, or any platform behavior | **Work Order** (`_WORK_ORDERS`) | `/fast-track [one sentence]` or `@LEAD` |
| **Marketing copy**, an **outreach document**, **leave-behind PDF**, **landing page**, or anything a client or researcher will read | **Growth Order** (`_GROWTH_ORDERS`) | `/fast-track [one sentence]` or `@LEAD` |
| You're not sure | `/fast-track [one sentence]` — LEAD classifies it for you | |

---

## When to Use Each Agent

| Agent | Use when you want to... | Never ask them to... |
|---|---|---|
| `@LEAD` | Scan the pipeline, route a ticket, review a plan, get a status report | Write code, create copy |
| `@PRODDY` | Plan a new feature, prioritize roadmap items, write a PRD | Write code or HTML |
| `@MARKETER` | Draft outreach copy, create a CONTENT_MATRIX | Write code, touch files |
| `@BUILDER` | Build a specific approved Work Order | Triage, plan strategy, or design |
| `@INSPECTOR` | QA a completed build or outreach document | Write any new code |
| `@CUE` | Brainstorm ideas | Execute anything directly |

---

## The Fast-Track Command

**Use this when things are urgent or you don't know which pipeline applies.**

```
/fast-track [one sentence describing what you want]
```

Examples:
- `/fast-track Fix the broken timer display in the session cockpit`
- `/fast-track Create a one-page PDF summary for insurance companies`
- `/fast-track The adverse event modal is crashing on mobile`

LEAD will classify it, create the ticket, and route it. You reply `go` to proceed or `hold` to review first.

---

## The One Rule to Prevent Rework

> Before any code is written, the plan must be approved.
> Before any outreach is built, the copy must be approved.

This is not bureaucracy — it is the reason you won't have to redo work. When something feels urgent, `/fast-track` it. The plan stage takes 2 minutes, not 20.

---

## Approvals You Will Always Need to Give

| Gate | What you're approving |
|---|---|
| Implementation plan | What will be built and which files will be touched |
| Content Matrix (Growth Orders) | Copy, screenshots, and exhibit choices before HTML is written |
| `push` command | Final confirmation before code goes to production |

---

## Status Commands

| Command | What it does |
|---|---|
| `/lead-pipeline-scan` | Full audit of both pipelines. Shows what's stuck, blocked, or ready. |
| `/work-order-triage` | Focused view of the WO pipeline only |
| `/fast-track [sentence]` | Instant ticket creation and routing |
| `/session-handoff` | LEAD updates the session summary document before you close the chat |

---

## Parked Projects

If you started something and haven't touched it in a while:

```
/fast-track pick up [project name or description]
```

LEAD will search `docs/projects/` and `097_BACKLOG` for context, summarize the last known state, and ask if you want to resume. You do not need to remember ticket numbers or artifact paths.

---

## Multi-Part Projects

For anything that will take more than one session or produce more than 2-3 tickets (a new feature set, a campaign, a full "front door" redesign):

```
@PRODDY — New multi-part project: [describe it in 2-3 sentences]
```

PRODDY will create a `PROJECT_BRIEF.md` in `docs/projects/` before filing any tickets. This becomes the permanent anchor — any future agent can find context without you re-explaining it.

---

## Accessibility Note

All PPN Portal work is built for color-blind users. If you notice any UI element where the only difference between states is color (no icon, no label), flag it immediately with:

```
@INSPECTOR — color-only violation spotted: [describe where]
```

INSPECTOR will add it to the QA rejection queue.

---

*This document is maintained by LEAD. Last updated: 2026-03-21*
