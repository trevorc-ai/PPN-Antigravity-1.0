---
id: WO-658
title: "MEQ-30 questionnaire auto-advance UX regression: selecting a button no longer auto-advances to the next question; form must be completable in exactly 31 actions"
owner: BUILDER
status: 04_BUILD
authored_by: LEAD (fast-track)
priority: P1
created: 2026-03-23
fast_track: true
origin: "User fast-track request"
admin_visibility: no
admin_section: ""
parked_context: ""
files:
  - src/components/arc-of-care-forms/phase-1-preparation/MEQ30QuestionnaireForm.tsx
---

## Request
Previously, the MEQ-30 form had a much better UI and UX. Touching or entering a number on the keyboard button automatically advanced the user to the next section, so the entire form could be completed in exactly 31 actions, even on desktop. Now it's very cumbersome. Needs UI rework.

## LEAD Architecture
The current `MEQ30QuestionnaireForm.tsx` has `scrollIntoView` in `updateResponse` that scrolls the viewport toward the next unanswered question, but this is unreliable and insufficient. The desired UX is a **one-question-at-a-time wizard**: only the active (focused) question's buttons are actionable; clicking any score button records the answer and immediately scrolls+focuses the next unanswered question's button row so the practitioner never has to touch the scrollbar. For 30 questions × 1 click + 1 final Save & Done = **31 total actions**. Keyboard digit keys (0–5) should also fire the answer and advance. The fix is purely in `MEQ30QuestionnaireForm.tsx` — no DB, no schema, no other components.

## Open Questions
- [ ] **[USER INPUT REQUIRED]** Should already-answered questions remain fully visible (with green checkmark) as the user scrolls down, or should they collapse to a single-line summary only showing the chosen value? (Collapsed = cleaner; Expanded = reviewable.) **BUILDER must not start until user answers this.**

---

## INSPECTOR 03_REVIEW CLEARANCE: FAST-PASS — no DB impact

**Reviewed by:** INSPECTOR  
**Date:** 2026-03-24  
**Verdict:** ✅ CLEARED — route to `04_BUILD`

**Rationale:**
- `database_changes: no` — confirmed. Single file modification: `MEQ30QuestionnaireForm.tsx`.
- No schema changes, no new routes, no auth changes, no RLS modifications.
- `MEQ30QuestionnaireForm.tsx` is NOT in FREEZE.md.
- Pure UX regression fix: scroll/focus wizard behavior in existing component.
- **BUILDER HOLD:** Do not implement until user answers the open question above (collapsed vs expanded answered questions).
