==== FLO ====
---
owner: CUE
status: 00_INBOX
authored_by: FLO
---

## WORK ORDER: WO-542

> **Work Order:** WO-542 — Global Typography Refactor (The 14px Mandate)
> **Authored by:** FLO  
> **Date:** 2026-03-04  
> **Status:** Pending CUE review  
> **Priority:** P0

### Objective
Eliminate all instances of the `text-xs` (12px) utility class across the PPN Portal to ensure compliance with the 14px Accessibility Mandate, preventing "glare shock" for practitioners.

### Context & Requirements
- The UX/UI Audit determined that 12px text is too small for our target demographic operating in dim-lit clinical environments.
- This applies globally, particularly to `Waitlist.tsx`, `WellnessJourney.tsx`, and `SafetySurveillancePage.tsx`.
- All `text-xs` classes must be elevated to at least `text-sm` (14px).
- Modifying these classes may require minor padding/margin adjustments to prevent text wrapping or breaking the glass panel UI constraints.

### Tasks
- [ ] Perform a global search for `text-xs` in `src/components` and `src/pages`.
- [ ] Replace `text-xs` with `text-sm` in all identified files.
- [ ] Verify that UI layouts do not break after the size increase.
- [ ] Run the Accessibility Checker to ensure systemic compliance.

### Sign-Off Checklist
- [x] Clear Objective defined
- [x] Context & Requirements provided
- [x] Actionable tasks identified
- [x] Priority tagged as P0
- [x] Routed to `00_INBOX` for CUE review
==== FLO ====
