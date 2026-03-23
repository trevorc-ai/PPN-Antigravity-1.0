---
id: WO-NNN
title: "Human-readable title"
owner: BUILDER
authored_by: LEAD
routed_by: LEAD
status: 02.5_PRE-BUILD_REVIEW
priority: P0 | P1 | P2
created: YYYY-MM-DD
routed_at: YYYY-MM-DD
depends_on: "WO-NNN or none"
skip_approved_by: ""         # Required if this WO was approved to run out of numerical order
hold_reason: ""              # Required if status = 98_HOLD. Describe the exact blocker.
held_at: ""                  # Date moved to 98_HOLD
failure_count: 0             # INSPECTOR increments on each rejection. At 2, moves to 98_HOLD.
completed_at: ""             # BUILDER sets when moving to 04_QA
builder_notes: ""            # BUILDER: one-sentence summary of what was implemented
skills: []                   # e.g. [".agent/skills/frontend-surgical-standards/SKILL.md"]
database_changes: no         # yes = INSPECTOR must run full DB review in 02.5_PRE-BUILD_REVIEW. no = fast-pass.
affects: []                  # List key files changed — INSPECTOR uses this for Phase 3.5 regression trigger matching
admin_visibility: no         # yes = BUILDER must wire into Admin Dashboard before QA
admin_section: ""            # Reports / Analytics / Session Management / Settings / N/A
growth_order_ref: ""         # Required for all public-facing WOs: GO-XXX
---

## Context

[Why does this work order exist? What is broken or missing?]

---

## Acceptance Criteria

- [ ] [Specific, testable criterion]
- [ ] [Specific, testable criterion]
- [ ] `npm run build` clean — no TypeScript errors

---

## Files to Modify

| File | Action |
|---|---|
| `src/path/to/file.tsx` | MODIFY — [what to change] |

---

## Constraints

- [e.g., No schema changes]
- [e.g., Surgical only — do not refactor outside the exact scope]

---

## LEAD Architecture

**Routing Decision:** [LEAD's notes on the approach]
