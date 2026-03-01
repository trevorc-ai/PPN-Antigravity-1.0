---
status: 03_BUILD
owner: BUILDER
failure_count: 0
priority: CRITICAL
---

# WO-501: Critical Mobile & Interaction Checker Regressions

## User Report (verbatim)
"Choose your workspace is now a dead end because you can't get to the button at the bottom."
"The boxes used to illuminate once you selected a substance. Now they don't."
"There is still a second text box on the interaction checker under the medications."
"Lithium doesn't even show up in the dropdown."
"Wellness Journey is 100% broken on mobile."
"Dashboard is a total fail on mobile."
"Clinical Intelligence page — pages not snapping to phone."
"Print Report button should say Export, not print, and should be at the bottom on mobile."
"Blue orb instead of video — unauthorized."
"Content locked until 10 submissions — unauthorized."

## Issues (Fix ONLY these — no additions)

### 1. PatientSelectModal — Mobile Dead End
- `bg-slate-900` modal has `overflow-hidden` on outer container —
  the choose view is too tall on small screens, the "Scan Patient Label" card
  pushes content off screen with no scroll. The outer div needs `overflow-y-auto max-h-[90vh]`.

### 2. InteractionChecker (pages/InteractionChecker.tsx)
- Box illumination: substance cards need to visually highlight when a substance is selected
  (bg-primary/20 highlight based on selectedPsychedelic === substance_name)
- Second text box: There is no second textbox in the current code — verify in browser.
  After browser check add fix if needed.
- Lithium missing: check ref_clinical_interactions / ref_medications DB for lithium entry.
  If it's not in ref_medications, the MedDropdown won't show it. This is a data issue, not code.
  The code itself filters by is_active=true — if lithium is is_active=false, that's the bug.

### 3. Analytics (Clinical Intelligence) — Mobile
- "Print Report" button → rename to "Export Report"
- On mobile (< md breakpoint), move that button to the bottom of the page header section
  or hide it from top and show it only at bottom via a sticky footer or bottom of content
- Pages not snapping: PageContainer needs `overflow-x-hidden` on mobile

### 4. Dashboard Mobile
- Quick Actions grid cols need to be 2 on mobile (already are `grid-cols-2`) — check
  if the outer container has horizontal overflow issues

## LEAD Architecture
- Zero new features
- Zero new components
- Zero design changes not listed above
- All changes are targeted surgical fixes
