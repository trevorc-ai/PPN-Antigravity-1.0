---
id: WO-562
title: "Phase 1 UI Polish — Set & Setting Buttons + Phase 1→2 Scroll Bug"
status: 03_BUILD
owner: BUILDER
created: 2026-03-01T20:12:47-08:00
failure_count: 0
priority: P2
authored_by: LEAD
source: "User notes 2026-03-01 live testing session"
---

## LEAD ARCHITECTURE

### Context

Three small but high-visibility Phase 1 UI defects confirmed in live testing.

### Architecture Decisions

**Defect 1 — Set & Setting: button text not centered**
- Button labels in the Set & Setting slide-out are visually off-center (text is not horizontally centered within the button)
- Fix: ensure buttons use `flex items-center justify-center text-center` or equivalent. Check for any `text-left` override or fixed padding causing offset.

**Defect 2 — Prior Psychedelic Experience: button labels too long**
Remove unnecessary words from the experience level button labels. Exact replacements:

| Current label | New label |
|---|---|
| "Minimal (1–2 times)" | "1–2 Times" |
| "Some (3–5 times)" | "3–5 Times" |
| "Experienced (6+ times)" | "6+ Times" |
| (Any "None" / "Naive" label) | Keep as-is |

Rationale: shorter labels fit on one line, eliminate layout overflow, improve scannability. The count is sufficient — the adjectives add no clinical information.

**Defect 3 — Phase 1 "Proceed to Phase 2" scrolls to bottom of Phase 2**
- Clicking "Proceed to Phase 2" on the Phase 1 screen advances the user to Phase 2 but scrolls to the **bottom** of the Phase 2 view instead of the top
- Fix: after the phase transition, call `window.scrollTo({ top: 0, behavior: 'smooth' })` or scroll the main content container to `scrollTop = 0`
- This is a one-line fix in the phase transition handler

### Files Likely Touched

- Set & Setting slide-out component (grep for `SetAndSetting\|set.*setting\|Prior.*Psychedelic\|psychedelic.*experience`)
- Phase transition handler (grep for `setActivePhase\|handleProceedToPhase2\|phase.*2` in `WellnessJourney.tsx`)

---

## Acceptance Criteria

- [ ] All buttons in the Set & Setting slide-out have horizontally centered text on all viewport widths
- [ ] "Prior Psychedelic Experience" buttons display shortened labels: "1–2 Times", "3–5 Times", "6+ Times"
- [ ] No label-related layout overflow on any button in Set & Setting
- [ ] Clicking "Proceed to Phase 2" from Phase 1 scrolls the page to the **top** of Phase 2 (not bottom)
- [ ] Scroll behavior is smooth, not an instant jump
- [ ] No regressions in Set & Setting form submission or selection state
- [ ] No regressions in phase transition logic

---

## BUILDER IMPLEMENTATION COMPLETE

*(BUILDER to fill in this section when done)*

---

## INSPECTOR QA

*(To be completed in 04_QA after BUILDER handoff)*
