---
id: WO-664
title: "Full audit and apply PPN UI Standards to every form in Phase 3, particularly the Integration Session page which fails color blindness accessibility"
owner: LEAD
status: 00_INBOX
authored_by: LEAD (fast-track)
priority: P1
created: 2026-03-23
fast_track: true
origin: "User fast-track request"
admin_visibility: no
admin_section: ""
parked_context: ""
files:
  - src/components/arc-of-care-forms/phase-3-integration/StructuredIntegrationSessionForm.tsx
  - src/components/arc-of-care-forms/phase-3-integration/BehavioralChangeTrackerForm.tsx
  - src/components/arc-of-care-forms/phase-3-integration/DailyPulseCheckForm.tsx
  - src/components/arc-of-care-forms/phase-3-integration/LongitudinalAssessmentForm.tsx
---

## Request

Full audit and apply PPN UI Standards to every form in Phase 3, particularly the Integration Session page which fails color blindness accessibility.

## LEAD Architecture

All four Phase 3 integration forms were audited. Critical violations found: (1) `StructuredIntegrationSessionForm` uses `bg-cyan-500` for Homework toggles — a non-phase color and invisible to blue-yellow colorblind users — and `bg-purple-400` for the header icon (also off-palette); (2) `BehavioralChangeTrackerForm` uses dynamic color classes (`bg-${color}-500`) for the Impact on Well-Being selector — Tailwind can't purge these and users can't distinguish "Highly Positive" (emerald) from "Moderately Positive" (green); (3) The Attendance toggle in `StructuredIntegrationSessionForm` uses `bg-emerald-500`, `bg-yellow-500`, and `bg-red-500` — a red vs. green combination, the most common form of colorblindness (deuteranopia); (4) `text-xs` used in the compliance badge (`✓ 100% COMPLIANT`) on two forms; (5) The "100% COMPLIANT" badge is ironic since the form itself violates the standard. All changes are surgical: replace non-phase colors with teal (`#0d9488`/`teal-600`) for Phase 3, add icons to every color-only state, fix `text-xs` violations.

## Open Questions

- [ ] None — violations are unambiguous. Proceeding to build.
