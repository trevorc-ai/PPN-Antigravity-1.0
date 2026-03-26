---
id: WO-693
title: "Run /ppn-ui-standards enforcement on SessionVitalsForm.tsx — font violations present"
owner: LEAD
status: 00_INBOX
authored_by: LEAD (fast-track)
priority: P2
created: 2026-03-24
fast_track: true
origin: "User fast-track request"
admin_visibility: no
admin_section: ""
parked_context: ""
files:
  - src/components/arc-of-care-forms/phase-2-dosing/SessionVitalsForm.tsx
---

## Request
Execute the full /ppn-ui-standards enforcement workflow on `SessionVitalsForm.tsx`. User reports font violations. Run all 8 audit checks, report violations, and fix them.

## LEAD Architecture
Run the standard 8-grep audit from the /ppn-ui-standards workflow against `SessionVitalsForm.tsx`. Fix all violations in-place. Run TypeScript check after fixes.

Likely violations based on user screenshot: bare `text-xs` without `md:text-sm`, sub-pixel font sizes, possible low-contrast text tokens.
