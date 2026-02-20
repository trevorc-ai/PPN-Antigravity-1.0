---
id: WO-134
title: "Wellness Journey: Investigate Error Storm During Demo Session"
status: 00_INBOX
owner: PENDING
failure_count: 0
created: 2026-02-20
priority: medium
tags: [bug, wellness-journey, error-handling, demo-feedback, investigation]
---

## USER REPORT (VERBATIM)

> "There was one portion of the demo that still popped up a ton of the error messages inside the wellness journey, but I don't recall which one and I'll have to go back and review the video."

---

## CONTEXT

During a live partner demo on 2026-02-20, an error storm (repeated error messages / toasts) occurred in the Wellness Journey section. The exact trigger is unknown pending video review.

---

## KNOWN SUSPECTS — INVESTIGATE FIRST

In priority order based on known fragility:

### 1. MEQ-30 Form (highest probability)
- Longest form in the app (30 items)
- Has a complex save/submit chain  
- If a required field mapping fails, it errors on every save attempt
- Check: `src/pages/MEQ30Page.tsx` and its Supabase insert logic

### 2. WellnessFormRouter — Form resolution failures
- Routes the correct form based on current Arc of Care phase
- If phase context is ambiguous, the router can fire the wrong endpoint repeatedly
- Check: `src/components/wellness-journey/WellnessFormRouter.tsx`

### 3. Patient/Subject ID missing on form submit
- Multiple forms in the Wellness Journey require an active Subject ID as a foreign key
- If the session had no patient context initialized, every submit attempt would throw a FK violation and retry
- Check: `src/components/wellness-journey/PatientSelectModal.tsx` — did subject selection complete before forms were opened?

### 4. Arc of Care phase transitions
- Phase change writes to `arc_of_care_sessions`
- If the session record didn't exist or the user's profile was missing required fields, each step transition could throw
- Check: `src/components/arc-of-care/` phase handlers

---

## PENDING

Trevor to review the demo recording and identify:
- [ ] Which form/section was open when errors started
- [ ] Whether errors were toasts or inline form errors
- [ ] Whether messages were repeating (same message = loop) or sequential (different messages = validation chain)
- [ ] Approximate timestamp in video for BUILDER to cross-reference

---

## ACTION AFTER VIDEO REVIEW

Update this ticket with the specific form name and error message text, then route to BUILDER for investigation and fix.

*WO-134 created by LEAD | 2026-02-20*
