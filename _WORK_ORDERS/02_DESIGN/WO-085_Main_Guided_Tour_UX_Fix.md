---
id: WO-085
title: "Main Guided Tour — UI/UX Fix & Enhancement"
status: 00_INBOX
owner: PENDING
failure_count: 0
created: 2026-02-17T22:33:38-08:00
priority: high
tags: [guided-tour, ui-ux, bug-fix, designer, onboarding]
---

# WO-085: Main Guided Tour — UI/UX Fix & Enhancement

## USER REQUEST (VERBATIM)
"FYI main guided tour is still not working properly. Please assign to Designer for enhanced UI/UX"

---

## SCOPE DEFINITION

### Primary Objective
Diagnose and redesign the main guided tour's UI/UX to resolve existing functional issues and elevate the overall onboarding experience.

This is a **DESIGNER task** — focus is on visual design, interaction patterns, and UX flow. BUILDER will implement after DESIGNER delivers specs.

---

## BACKGROUND & CONTEXT

### Known History
- A previous attempt to fix guided tour highlighting was made (conversation: "Fixing Guided Tour Highlighting")
- The fix involved adding `data-tour` attributes to sidebar navigation links
- Despite that fix, the tour is **still not working properly**
- The user has flagged this as an ongoing issue requiring a more thorough redesign approach

### What "Not Working Properly" Likely Means
DESIGNER should investigate and confirm which of these apply:
- Tour steps not highlighting the correct elements
- Tooltips rendering in wrong positions
- Tour not progressing past certain steps
- Overlay/backdrop not rendering correctly
- Tour breaking on certain screen sizes
- Steps out of logical order
- Copy/content issues in tooltip text
- Tour not re-launchable after dismissal
- Missing steps for key features

---

## REQUIREMENTS

### 1. Audit Current Tour State
Before redesigning, DESIGNER must document:
- Which steps currently work vs. fail
- What visual/interaction issues exist
- What the intended tour flow should be
- Screenshot or describe each broken state

### 2. UI/UX Redesign Spec
Deliver a complete design specification covering:

#### Tooltip Design
- Visual style (shape, shadow, border, background)
- Typography (size, weight, color — min 12px)
- Arrow/pointer positioning logic
- Close/skip button placement and styling
- Step counter display (e.g., "Step 3 of 8")
- Navigation buttons (Prev / Next / Skip All)

#### Overlay/Backdrop
- Backdrop opacity and color
- Highlighted element treatment (cutout, glow, border)
- Z-index layering strategy
- Scroll behavior when target is off-screen

#### Positioning Logic
- How tooltips position relative to target elements
- Collision detection (what happens near screen edges)
- Mobile/tablet responsive behavior

#### Animation & Transitions
- Step-to-step transition animation
- Tooltip entrance/exit animation
- Highlight pulse or glow effect on target element

#### Tour Flow & Steps
- Review and confirm the complete step list
- Ensure logical narrative order
- Confirm all `data-tour` target elements exist in DOM
- Recommend any missing steps

#### Entry & Exit UX
- How the tour is launched (button, auto-trigger, etc.)
- How users skip or exit mid-tour
- End-of-tour completion screen or message
- How users re-launch the tour (persistent help button?)

### 3. Accessibility Requirements
- All tooltip text minimum 12px
- No color-only meaning
- Keyboard navigable (Tab, Enter, Escape)
- Screen reader compatible ARIA labels
- High contrast between tooltip and backdrop

---

## DELIVERABLES

### Primary: Design Specification
A complete design brief ready for BUILDER implementation, including:
1. **Audit Findings** — Current broken states documented
2. **Tooltip Component Spec** — Visual design with measurements
3. **Overlay Spec** — Backdrop and highlight treatment
4. **Animation Spec** — Transitions and motion
5. **Tour Step List** — Complete revised step inventory
6. **Positioning Rules** — Logic for tooltip placement
7. **Responsive Behavior** — Mobile/tablet adaptations
8. **Accessibility Checklist** — WCAG compliance notes
9. **Handoff Notes for BUILDER** — Implementation instructions

---

## SUCCESS CRITERIA

- [ ] Current broken states identified and documented
- [ ] Complete tooltip design spec delivered
- [ ] Overlay and highlight treatment specified
- [ ] Full tour step list reviewed and confirmed
- [ ] Positioning and collision logic defined
- [ ] Animation and transition specs provided
- [ ] Accessibility requirements met
- [ ] Handoff notes ready for BUILDER

---

## ROUTING GUIDANCE FOR LEAD

**Recommended Owner:** DESIGNER
**Recommended Status:** 02_DESIGN

After DESIGNER completes spec:
- → **BUILDER** for implementation
- Coordinate with **WO-083** and **WO-084** — the Enhanced Privacy Tour and Crisis/Cockpit mini-tours should use the same design system as the fixed main tour

---

## DEPENDENCIES

| Ticket | Relationship |
|--------|-------------|
| WO-083 | Enhanced Privacy Tour — should share the same tour UI system |
| WO-084 | Crisis Logger & Cockpit Mode mini-tours — same system |
| WO-081 | User Guide — tour completion should reference help docs |

---

## NOTES
- Previous fix attempt (adding `data-tour` attributes) was insufficient — a deeper redesign is needed
- DESIGNER should review the existing tour component code before writing specs
- The fixed main tour will serve as the **design foundation** for WO-083 and WO-084 tours
- Consider whether the tour library/approach should be replaced entirely vs. patched

---

## LEAD ARCHITECTURE

**Routed:** 2026-02-17T23:10:06-08:00
**Owner:** DESIGNER
**Status:** 02_DESIGN

### Technical Strategy
DESIGNER must audit the current broken tour state before designing anything. The previous fix (adding data-tour attributes) was insufficient — a proper redesign spec is needed. This spec will become the design foundation for WO-083 (Enhanced Privacy Tour) and WO-084 (Crisis/Cockpit mini-tours), so quality here has downstream impact.

### Constraints
- Audit broken states FIRST — document exactly what fails and why before proposing solutions
- Consider whether the existing tour library should be patched or replaced entirely
- Design system must support: main tour, Enhanced Privacy tour (WO-083), and mini-tours (WO-084)
- All tooltip text minimum 12px — non-negotiable
- No color-only meaning for any tour state (active step, completed step, etc.)
- Keyboard navigable: Tab, Enter, Escape must all work

### Handoff After DESIGNER
DESIGNER → update `owner: BUILDER` and `status: 03_BUILD`. Move ticket to `_WORK_ORDERS/03_BUILD/`. BUILDER implements per spec.
