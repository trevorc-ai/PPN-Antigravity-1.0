---
description: /_WORK_ORDERS - Auto-triage, review, prioritize, and organize all outstanding Work Orders
---

# `_WORK_ORDERS` Triage Protocol

When the user types `_WORK_ORDERS`, the agent will execute the following standard operating procedure to maintain an organized, prioritized, and unblocked workflow pipeline.

**Core Law:** The USER is the only bottleneck. Every agent-to-agent handoff is automatic and immediate in the same response. The pipeline only halts at designated USER stages (`06_USER_REVIEW`, `_GROWTH_ORDERS/02_USER_REVIEW`, `_GROWTH_ORDERS/04_VISUAL_REVIEW`).

**Core Rule:** The agent must touch every ticket at least twice — once for planning (pre-execution) and once for QA (post-execution).

## 1. Review & Audit
- Read and list all markdown files in `_WORK_ORDERS/**/*.md` (excluding `99_COMPLETED` and `99_ARCHIVED`).
- Identify the `owner`, `status`, `Priority` (P0/P1/P2), and any blockers/dependencies for each ticket.

## 2. Touch 1: Preliminary Inspection (Pre-Execution)
- For newly surfaced or escalated tickets, perform a rapid inspection of the referenced files or database schemas to ensure the Work Order's context is accurate.
- Flag any architectural discrepancies or missing prerequisite templates BEFORE assigning the ticket to an agent queue.
- **Pillar Classification Check:** For every ticket in `00_INBOX` and `02_TRIAGE`, verify the `pillar_supported:` and `task_type:` fields are populated. If either is blank, add `hold_reason: Missing pillar_supported or task_type — required per GLOBAL_CONSTITUTION §6` and move to `98_HOLD`. Surface to USER.
- **Zero-Pillar Flag:** If `pillar_supported: none`, STOP. Do NOT route to `04_BUILD`. Surface to USER with `/request-triage` verdict before proceeding.
- This serves as the mandatory initial touchpoint to proactively evaluate the plan.

## 3. Organize
- Validate that each Work Order is physically located in the folder that matches its `status` and `owner`.
- If a ticket is misrouted (e.g., `owner: BUILDER` but sitting in `01_DESIGN`, or `status: 99_COMPLETED` but still in `05_QA`), physically move it using the `mv` bash command.
- Ensure all newly created tickets in `00_INBOX` are properly categorized and moved to `02_TRIAGE` or `04_BUILD` depending on readiness.

## 4. Prioritize (FIFO-First)
- **Numerical order is primary.** Sort all ready-to-work tickets by WO number ascending. The lowest WO number executes first, regardless of priority label, unless LEAD or INSPECTOR has explicitly approved an out-of-order exception via a `skip_approved_by:` field in the WO's frontmatter.
- **Priority (P0/P1/P2) is a tiebreaker only** when two WOs have the same numeric prefix.
- Check for dependency bottlenecks (e.g., a P0 front-end ticket blocked by a P1 database ticket). Escalate the blocking ticket's execution order, but still document the exception in `skip_approved_by:`.
- **Stuck WO routing (mandatory):** Any WO that cannot proceed must be moved immediately:
  - Blocked by an unresolved dependency - move to `90_BACKLOG`
  - Blocked pending agent input → move to `98_HOLD` with `hold_reason:` set in frontmatter. If it's a USER decision, surface to user.
  - **Never leave a stuck WO in its current queue.**

## 5. Forward Next Work Order
- Select the single highest-priority, fully unblocked Work Order.
- Present a brief summary of this ticket to the user/LEAD, outlining its objective.
- Ask the user: "Shall we proceed with implementing this Work Order now?"

## 6. Touch 2: QA & Validation (Post-Execution)
- When a ticket moves to `05_QA`, it mandates the second touch.
- Conduct a rigorous review of the implemented code against the original Work Order requirements.
- Verify that standard checklist protocols (e.g., Zero-PHI, RLS constraints) have been strictly followed before forwarding to `06_USER_REVIEW`.

## 7. Report Pipeline State
Output a concise summary table of the current active queues:
| Queue | Count | Key Focus / Next Up |
|-------|-------|---------------------|
| 00_INBOX | N | ... |
| 01_DESIGN | N | ... |
| 02_TRIAGE | N | ... |
| 03_REVIEW | N | ... |
| 04_BUILD | N | Next: WO-[lowest #] | Parallel: [list] |
| 05_QA | N | ... |
| 06_USER_REVIEW | N | PIPELINE PAUSED — awaiting user |
| 90_BACKLOG | N | [blocked reason] |
| 98_HOLD | N | [held reason] |
| 99_COMPLETED | N | - |

## Changelog

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-02-23 | INSPECTOR | Initial triage protocol established |
| 1.1 | 2026-03-21 | LEAD | Fixed MARKETER routing: SEO/copywriting/outreach now routes to `_GROWTH_ORDERS/00_BACKLOG/` via PRODDY, not `04_BUILD/` |
| 2.0 | 2026-03-23 | LEAD | **Pipeline Architecture Redesign.** All stage folder references updated to new numerical names. Added USER-only gate law. Updated pipeline state table. |
