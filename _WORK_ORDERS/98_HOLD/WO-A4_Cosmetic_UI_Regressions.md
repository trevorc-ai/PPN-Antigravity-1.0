---
owner: BUILDER
status: 00_INBOX
authored_by: INSPECTOR
priority: P1
track: A
track_item: A4
stabilization_brief: STABILIZATION_BRIEF.md v1.2
ui_ux_guardrails: UI_UX_GUARDRAILS.md
created: 2026-03-21
depends_on: WO-A3 (must be complete and stable before this begins)
---

# WO-A4: Live Cockpit UI Regressions — Panel Height, Vitals Graph, Timeline Order

## Context

This work order is a **holding vessel** for cosmetic UI fixes that are in scope for stabilization but do not require schema changes or logic rewrites. Items are added here by the user or INSPECTOR after WO-A2 and WO-A3 are complete.

Individual items in this WO are small, surgical, and label/text/state changes only. No layout refactors. No Tailwind grid/flex restructuring. Each item is independently reviewable.

---

## Items (User to Confirm/Add)

The following items are proposed based on code inspection and the UI/UX Guardrails. User must confirm which to include before BUILDER begins.

### Proposed Item 1 — Vitals Chart Empty State Text
**File:** Relevant vitals chart component  
**Change:** If the chart has no data points (new session or not yet entered), show: *"Vitals will appear here as they are recorded."*  
**Why:** Per UI_UX_GUARDRAILS.md Principle 9 — empty panels look like bugs.  
**Risk:** Zero (text addition only, no layout change)

### Proposed Item 2 — Session Cockpit Phase Label
**File:** `SessionCockpitView.tsx` or equivalent header area  
**Change:** Add a visible phase badge showing `Preparation`, `Dosing`, or `Integration` with the one-sentence definition from the locked phase definitions. This badge should reflect the current session mode (`pre`/`live`/`post` maps to Preparation/Dosing/Integration).  
**Why:** Per UI_UX_GUARDRAILS.md Principle 2 — phase must be always visible, never inferred.  
**Risk:** Low — text/badge addition only. No layout restructuring.  
**Constraint:** Must not use color alone to communicate state (Principle 3).

### Proposed Item 3 — "Resume Active Cycle" vs "Begin New Treatment Cycle" Label Distinction
**File:** Patient selection UI or cockpit entry state  
**Change:** Where the app currently uses ambiguous copy ("Continue" or generic "Start Session"), use the exact copy from UI_UX_GUARDRAILS.md: "Resume Active Cycle" / "Begin New Treatment Cycle" / "View Prior Sessions"  
**Why:** This directly addresses the A3 root cause at the UI/label level (defense in depth). Per UI_UX_GUARDRAILS.md Principle 6.  
**Risk:** Low — copy change only. No component restructuring.

### Proposed Item 4 — Timeline Empty State for New/Awaiting Sessions
**File:** `LiveSessionTimeline.tsx` — empty state rendering  
**Change:** When the timeline has no events (new session, awaiting start), show: *"Session timeline will appear here once the session begins."*  
**Why:** Per UI_UX_GUARDRAILS.md Principle 9.  
**Risk:** Zero (text addition in existing empty state handler)

### Proposed Item 5 — User-Specified Regressions
**Description:** [User to fill in specific cosmetic regressions they have observed]  
**File:** [User to specify]  
**Risk:** [INSPECTOR to assess after user describes]

---

## Constraints (from STABILIZATION_BRIEF.md)

- **RULE 7 STRICTLY ENFORCED HERE.** This WO is cosmetic. Any change that touches CSS classes, heights, widths, padding, margins, z-index, or overflow is OUT OF SCOPE and requires its own dedicated plan.
- Copy changes, text content changes, and `aria-label` additions are in scope.
- Adding small `<span>` or `<p>` text nodes where none existed is in scope IF they do not alter the flex/grid layout of parent containers.
- Each item must be independently stageable. If Item 2 causes a regression, Items 1, 3, 4 must remain committable without it.
- **Two-strike rule applies per item.** If any item causes an unexpected regression, STOP on that item. Complete other items if they are independent.

---

## Acceptance Criteria

Each item has its own acceptance criteria defined above. Overall acceptance:

1. All confirmed items render correctly in the browser
2. No existing functionality is broken (INSPECTOR regression sweep)
3. No layout shifts occur on any screen that contained a modified component
4. `window.print()` for any PDF-adjacent components is unaffected

---

## Verification

1. INSPECTOR visually reviews each item in the browser before marking WO complete
2. INSPECTOR confirms no console errors introduced
3. User does a final spot-check of the cockpit view and any other modified screens

**Route:** BUILDER → INSPECTOR → user visual confirmation before commit.

---

## Note for User

**Before BUILDER begins this WO**, please list any specific cosmetic issues you have noticed since the last stable version. Examples:
- "The session timer appears in the wrong position"
- "The patient ID chip is missing from the cockpit header"
- "Phase badge colors look wrong"
- "The companion overlay button is misaligned"

Add them above under "Proposed Item 5" and INSPECTOR will assess risk and add them to scope or create a separate WO if they require layout changes.
