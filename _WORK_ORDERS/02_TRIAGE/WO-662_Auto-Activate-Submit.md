---
id: WO-662
title: "All forms should automatically activate the 'save' or 'complete' button once the form is complete, removing the requirement for a final manual click."
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
files: []
---

## Request

All forms should automatically activate the 'save' or 'complete' button once the form is complete, to save the user a step.

## LEAD Architecture

Currently all arc-of-care forms (Phase 1–3), assessment wizards (MEQ-30, Baseline, Quick Experience Check), and shared
modals have save/complete buttons that are either disabled until all required fields are filled, or enabled but require
a manual click. The request is to **auto-submit** (or auto-trigger the save action) the moment the form reaches a
complete state — i.e., when the last required field is answered or the progress indicator hits 100%.

**Affected areas (likely files):**
- `src/components/arc-of-care/AssessmentForm.tsx` — quick assessment wizard (seen in screenshot at "Page 5 of 5, 100%")
- `src/components/arc-of-care-forms/shared/FormFooter.tsx` — shared footer with Save button
- All Phase 1–3 arc-of-care form components (15+ files) that own their own submit button
- `src/components/wizards/BaselineAssessmentWizard.tsx`
- `src/pages/AdaptiveAssessmentPage.tsx`

**Mechanism:** When the completion condition transitions from `false → true`, fire the save handler automatically
after a short configurable delay (e.g., 800 ms) to give the user visual confirmation of completion before the action
fires. A toast/flash animation on the button before auto-submit is recommended UX.

## Open Questions
- [ ] Should the auto-submit fire immediately on 100% completion, or after a short delay with a visual countdown on the button?
- [ ] Should forms with **multi-page wizards** (e.g., Assessment page 5 of 5) auto-advance to the final submission, or only auto-submit on the truly last page?
- [ ] Are there any forms that should be **excluded** from auto-submit (e.g., consent forms requiring an intentional final click)?
