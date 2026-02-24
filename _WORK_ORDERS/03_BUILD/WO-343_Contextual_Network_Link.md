---
status: 03_BUILD
owner: BUILDER
failure_count: 0
created: 2026-02-23
priority: P0 — DEMO BLOCKER (Wednesday Dr. Allen demo)
ref_tables_affected: none (display only, no DB writes)
deadline: 2026-02-26 (Wednesday)
---

# WO-343: Contextual Network Link — Safety Check Trigger

## Context

During the Jason-Trevor meeting (2026-02-23), Jason identified the safety check page as
the "perfect intersection point for network functionality." PRODDY has spec'd Option A
(trigger-based contextual link) as the minimum viable networking feature for the Dr. Allen
demo. This is a DISPLAY-ONLY feature — no new database writes, no PHI, no HIPAA risk.

The link routes OUTSIDE of ppnportal.net to a separate domain (TBD — awaiting Trevor
confirmation, likely ppn.community or similar). The external domain does not need to be
live for the demo — a static placeholder page is acceptable for Wednesday.

---

## User Story

> As a practitioner running a Phase 2 dosing session, when a drug interaction warning
> fires (e.g., Lithium + Psilocybin), I want to see — alongside the safety warning —
> a contextual note that other network practitioners have managed this scenario, with
> a link to view their opt-in profiles on the network platform.

---

## Acceptance Criteria

### AC-1: Trigger Condition
- The contextual link component renders ONLY when a contraindication or safety warning
  is flagged during Phase 2 (the dosing/safety check phase)
- It does NOT render during normal workflow steps with no warnings
- It renders BELOW the warning card, not inline with it

### AC-2: Display Component
The component must show:
```
┌─────────────────────────────────────────────────────────┐
│  🩺 NETWORK INTELLIGENCE                                 │
│                                                         │
│  [N] practitioners in the PPN network have documented   │
│  experience with this contraindication.                  │
│                                                         │
│  [View Practitioner Profiles →]                         │
│                                                         │
│  ⚝ Opt-in only. No patient data is shared.              │
└─────────────────────────────────────────────────────────┘
```

- The `[N]` count for the demo should be hardcoded to a plausible number (e.g., 3–7)
  matching the specific contraindication shown. Use a simple lookup map:
  ```typescript
  const networkCounts: Record<string, number> = {
    'lithium': 4,
    'ssri': 7,
    'maoi': 3,
    'benzodiazepine': 6,
    'default': 2
  };
  ```
- The button opens a new tab to the network domain (use `https://ppn.community` as
  placeholder — confirm with Trevor before pushing to production)

### AC-3: Visual Design
- Use the existing card/panel component pattern from the codebase
- Background: subtle amber/gold tint (distinct from the red warning card above it)
  — this is informational, not alarming
- Icon: network/people icon (existing icon set)
- Font size: minimum 14px per accessibility rules
- The "Opt-in only" footnote: 12px minimum, muted text color
- Animation: fade-in with 300ms delay after the warning card renders

### AC-4: No New Database Calls
- This component is STATIC for the demo — no Supabase queries
- The count is derived from the lookup map above
- In production (post-demo), this will be wired to a query against the opt-in
  practitioner table on the network platform — but that is OUT OF SCOPE for WO-343

### AC-5: Accessibility
- Button has descriptive aria-label: "View practitioners with experience managing
  [contraindication name] — opens in new tab"
- Color is not the only indicator of meaning — icon + text label required
- Keyboard navigable

---

## Component Location

Place the new component in:
```
src/components/networking/NetworkIntelligenceCard.tsx
```

Wire it into the Phase 2 safety check display area. Look for where the interaction
warning cards currently render and add the NetworkIntelligenceCard below them,
conditional on `warnings.length > 0`.

---

## Demo Script Context (for Jason + Dr. Allen walkthrough)

When Dr. Allen sees the Lithium contraindication warning fire, Jason will say:
> "And here's something we're building on top of the safety system — if a warning
> fires, practitioners can instantly see how many others in the network have managed
> this exact scenario and connect with them directly. No patient data shared.
> Completely opt-in."

The link doesn't need to go anywhere functional for Wednesday. A static landing page
on the external domain with "Practitioner Network — Coming Soon" is sufficient.

---

## Out of Scope (Post-Demo Tickets)

- Actual practitioner directory on network domain (WO-344, filed separately)
- Matching algorithm for practitioner-to-contraindication experience (future)
- Real count query from opt-in practitioner table (future)
- Supervision circles feature (Q2)

---

## INSPECTOR Checklist

- [ ] Font >= 14px on all text, >= 12px on footnote
- [ ] No color-only meaning (icon + text label present)
- [ ] No PHI written to database
- [ ] External link opens in new tab with rel="noopener noreferrer"
- [ ] Component renders gracefully if warnings array is empty (renders nothing)
- [ ] No new Supabase tables created

---

*Spec authored by PRODDY — 2026-02-23*
*Deadline: Wednesday 2026-02-26 (Dr. Allen demo)*
