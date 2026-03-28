---
id: WO-729
title: "CrisisLogger — Minimal Non-Intrusive UI/UX Redesign Proposal"
owner: PRODDY
status: 00_INBOX
priority: P0
created: 2026-03-27
pillar_supported: "1 — Safety Surveillance"
task_type: "ux-redesign"
database_changes: no
origin: "User escalation 2026-03-27 — WO-696 and associated CrisisLogger implementation obliterated the Dosing Session page layout. Previous implementation rejected. New minimal proposal required."
blocked_until: "WO-706 (CrisisLogger-Not-Rendering) is resolved AND inspect-table.js log_safety_events confirms actual NOT NULL column names (ae_id, causality_id)"
---

## Problem Statement

The prior CrisisLogger UI implementation introduced a major, persistent UI element into the Phase 2 Dosing Session — the most critical screen in the entire application. Adverse events and crises are **rare, fringe occurrences**. Their capture UI must not dominate, restructure, or destabilize the session layout under normal operating conditions.

The previous proposal failed on three dimensions:
1. It physically altered the Dosing Session layout — unacceptable
2. The implementation did not work
3. The payload did not satisfy the actual DB column contract (`ae_id`, `causality_id`)

---

## Design Constraints (Non-Negotiable)

These are hard rules PRODDY must design within:

1. **The Dosing Session layout must not change.** Not by 1px. Not conditionally. The Dosing Session UI is frozen from a layout perspective for this WO.
2. **The trigger must be minimal.** A small button, icon, or dropdown — not a panel, drawer, overlay, or card that competes with session content.
3. **The capture form must be non-persistent.** It appears only when triggered. It dismisses after submission. It does not leave a visible footprint in the session UI.
4. **No layout-breaking component.** No modals that shift content. No drawers that push the DOM. A sheet anchored to the bottom, a popover, or an inline dropdown are acceptable patterns — pending user approval.
5. **The most likely pattern is a dropdown.** User guidance: "My guess is it's a dropdown box, at most."

---

## Payload Contract (Must Be Honored)

Before PRODDY proposes any UI, BUILDER must first run:
```bash
node .agent/scripts/inspect-table.js log_safety_events
```
The proposal must explicitly name the form fields that map to the actual NOT NULL DB columns. Known minimum contract:
- `ae_id` — adverse event FK (may correspond to event type)
- `causality_id` — causality assessment FK

PRODDY's PRD must include a field mapping table showing UI label → DB column → FK reference table.

---

## PRODDY Deliverable

PRODDY must produce:
1. A concise PRD (≤600 words) describing the minimal trigger pattern
2. A field mapping table: UI label → DB column name → `ref_` table source
3. A clear statement of what the trigger looks like from the practitioner's perspective during a live session (one sentence)
4. An explicit statement confirming the Dosing Session layout is unchanged

**Present to USER for approval before routing to BUILD.**

---

## Dependency

This WO is blocked until:
1. WO-706 (`CrisisLogger-Not-Rendering`) is resolved — the component must render correctly before a wiring WO makes sense
2. `inspect-table.js log_safety_events` output is attached to this WO as a pre-build artifact
