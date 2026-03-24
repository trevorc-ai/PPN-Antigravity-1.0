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

---

## INSPECTOR QA — Phase 1: Scope & DB Audit
- [x] Database Freeze Check: No DB changes. PASS
- [x] Scope Check: Only `StructuredIntegrationSessionForm.tsx` and `BehavioralChangeTrackerForm.tsx` modified — both explicitly listed in approved plan. PASS
- [x] Refactor Check: Changes surgically targeted. No code outside targeted lines rewritten. PASS

## INSPECTOR QA — Phase 2: UI & Accessibility
- [x] Color Check: All states now paired with icon + label. No color-only indicators. PASS
- [x] Typography Check: `text-xs` eliminated. All text ≥ `text-sm`. PASS
- [x] Character Check: `grep -rn "—"` returned zero matches. PASS
- [x] Input Check: No free-text `<textarea>` added. PASS
- [x] Mobile-First Check: `grep -n 'grid-cols-[2-9]\b'` returned zero bare matches (all responsive prefixed). PASS

## Phase 3.5 Regression Results
Trigger files matched: `StructuredIntegrationSessionForm.tsx`
Workflow run: `/phase3-integration-regression`

- Scenario 1 (Integration Session New UI + Save): PASS
- Scenario 2 (Assessment Data Persistence): FAIL — pre-existing bug, NOT introduced by WO-664. `LongitudinalAssessmentForm` not in scope; `WellnessFormRouter` passes no `initialData` prop. Follow-up filed as WO-665.
- Scenario 3 (Step Card Illumination): PASS
- Scenario 4 (Bidirectional Navigation): PASS

Overall: ✅ REGRESSION CLEAR for WO-664 scope — WO-665 filed for Scenario 2 persistence bug

## INSPECTOR QA — Visual Evidence
![WO-664: Teal icon + PHI-SAFE badge + Attended button with CheckCircle icon](file:///Users/trevorcalton/.gemini/antigravity/brain/9898adfb-b214-4559-8978-8284d60a5828/integration_session_form_header_1774277270220.png)

![WO-664: Homework Daily Journaling selected — teal bg-teal-600 active state confirmed](file:///Users/trevorcalton/.gemini/antigravity/brain/9898adfb-b214-4559-8978-8284d60a5828/integration_session_form_homework_selected_1774277287630.png)

INSPECTOR VERDICT: ✅ APPROVED | Date: 2026-03-23
