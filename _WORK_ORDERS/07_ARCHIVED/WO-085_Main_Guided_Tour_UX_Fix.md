---
id: WO-085
title: "Main Guided Tour — UI/UX Fix & Enhancement"
status: 03_BUILD
owner: BUILDER
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

---

## 🎨 DESIGNER DELIVERABLE — COMPLETE DESIGN SPECIFICATION

**Completed:** 2026-02-18T01:15:00-08:00

---

### AUDIT FINDINGS — Current Broken States

**Code reviewed:** `src/components/GuidedTour.tsx` (227 lines)

#### Root Cause Analysis:

**Issue 1: `isVisible` never becomes `true` on first render**
- The component calls `updatePosition()` after a 100ms timeout
- `updatePosition()` calls `positionTourCard()` which sets `isVisible = true`
- BUT: if the target element doesn't exist yet (e.g., the page hasn't rendered), `el` is null → `setIsVisible(false)` is called
- Step 0 targets `[data-tour="dashboard-header"]` — this exists on Dashboard, but the navigation to `/dashboard` happens in a `useEffect` that fires AFTER the position update timer
- **Result:** Tour starts, navigates to dashboard, but the element query fires before the page renders → element not found → `isVisible = false` → tour card never shows

**Issue 2: No `handlePrev` button**
- Users can only go forward (Next) or skip — no way to go back
- This is a UX gap that causes frustration

**Issue 3: Step 2 selector `[data-tour="interaction-checker"]` is on a button inside a section**
- The Dashboard Quick Actions button has `data-tour="interaction-checker"` ✅
- But the sidebar nav link to `/interactions` does NOT have this attribute
- If the user is not on the Dashboard (e.g., they navigated away), the element won't be found

**Issue 4: Step 3 selector `a[href="/catalog"]`**
- This targets the sidebar nav link — works IF the sidebar is visible
- On mobile, the sidebar may be collapsed/hidden → element not found

**Issue 5: No re-launch mechanism**
- Once dismissed, there's no visible button to restart the tour
- The Help page presumably has a button, but it's not confirmed

**Issue 6: Backdrop blocks interaction**
- The backdrop div has `pointer-events-auto` and `onClick={onComplete}`
- This means clicking ANYWHERE outside the tour card dismisses the tour
- Users accidentally dismiss the tour when trying to scroll

**Summary of broken states:**
- [STATUS: FAIL] Step 0: Tour card may not appear (timing race condition)
- [STATUS: FAIL] Steps 2-4: Selectors may fail on mobile or non-Dashboard pages
- [STATUS: FAIL] No back navigation
- [STATUS: FAIL] Accidental dismissal on backdrop click
- [STATUS: PASS] Step positioning logic (smart collision detection) — this is good
- [STATUS: PASS] Visual design of tour card — this is good
- [STATUS: PASS] Progress dots — this is good

---

### REDESIGN SPECIFICATION

#### 1. TOOLTIP COMPONENT SPEC

**Dimensions:**
- Width: `340px` (increase from 300px for better readability)
- Min height: auto (content-driven)
- Max height: `280px`

**Visual Style:**
- Background: `bg-[#0c1016]` (keep — dark, premium)
- Border: `border-2 border-primary/60` (soften from solid primary)
- Border radius: `rounded-[1.5rem]` (keep)
- Shadow: `shadow-[0_0_30px_rgba(43,116,243,0.3),0_20px_60px_rgba(0,0,0,0.5)]`
- Backdrop blur on card: `backdrop-blur-sm` (subtle glass effect)

**Typography:**
- Step counter: `text-[12px] font-black text-primary uppercase tracking-[0.2em]` ✅
- Title: `text-[18px] font-black text-slate-200 tracking-tight` ✅
- Description: `text-[13px] text-slate-300 font-medium leading-relaxed` (increase from 12px for comfort)
- Button text: `text-[12px] font-black uppercase tracking-widest` ✅

**Layout (top to bottom):**
```
┌─────────────────────────────────────────────┐
│  Step 2 / 5                    [Skip Tour]  │
│  ─────────────────────────────────────────  │
│  Title of this step                         │
│  Description text that explains what this   │
│  feature does and why it matters.           │
│                                             │
│  ● ● ○ ○ ○          [← Back] [Next →]      │
└─────────────────────────────────────────────┘
```

**Navigation buttons:**
- Back button: `text-[12px] font-bold text-slate-400 hover:text-slate-300` (text-only, no background)
- Back button: hidden on Step 1
- Next button: `px-5 py-2.5 bg-primary hover:bg-blue-600 text-white text-[12px] font-black rounded-xl`
- Finish button (last step): same style as Next but label changes to "Finish"
- Skip: top-right, `text-[12px] font-bold text-slate-500 hover:text-slate-300`

**Progress dots:**
- Active: `w-6 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(43,116,243,0.6)]`
- Inactive: `w-1.5 h-1.5 bg-slate-700 rounded-full`
- Transition: `transition-all duration-300`

---

#### 2. OVERLAY / BACKDROP SPEC

**Backdrop:**
- Background: `bg-black/40` (increase from 10% — needs to be visible)
- Blur: `backdrop-blur-[2px]` (subtle, not jarring)
- `pointer-events-auto` BUT: **remove `onClick={onComplete}`** — accidental dismissal is a UX bug
- Add: `Escape` key listener to dismiss instead

**Target Highlight:**
- Border: `border-[2px] border-primary` (reduce from 3px — less aggressive)
- Glow: `shadow-[0_0_0_4px_rgba(43,116,243,0.15),0_0_20px_rgba(43,116,243,0.4)]`
- Border radius: `rounded-xl` (keep)
- Padding: 8px around element (increase from 6px)
- Add: subtle pulse animation on the highlight border

**Z-index layering:**
- Backdrop: `z-[9998]`
- Highlight ring: `z-[9999]`
- Tour card: `z-[10000]`
- Arrow/pointer: `z-[10001]`

**Scroll behavior:**
- Keep existing `scrollIntoView({ behavior: 'smooth', block: 'center' })`
- Increase wait time from 300ms to 500ms before repositioning (give page time to settle)

---

#### 3. ANIMATION SPEC

**Tour card entrance:**
- `animate-in fade-in zoom-in-95 duration-300` (keep existing)

**Tour card exit (step transition):**
- Add: `animate-out fade-out zoom-out-95 duration-150` before mounting next step
- Implementation: use `isTransitioning` state, apply exit class, then update step after 150ms

**Highlight ring:**
- Add: `animate-pulse` on the glow shadow (subtle, 2s cycle)
- Use CSS: `@keyframes highlight-pulse { 0%, 100% { box-shadow: 0 0 0 4px rgba(43,116,243,0.15), 0 0 20px rgba(43,116,243,0.4); } 50% { box-shadow: 0 0 0 4px rgba(43,116,243,0.25), 0 0 30px rgba(43,116,243,0.6); } }`

**Step transition:**
- Highlight ring: smoothly moves to new target via CSS `transition: all 300ms ease-out` on `top`, `left`, `width`, `height`

---

#### 4. REVISED TOUR STEP LIST

All steps must use selectors that are **reliably present in the DOM** regardless of page state.

| Step | Title | Description | Selector | Position | Fix Needed |
|------|-------|-------------|----------|----------|------------|
| 1 | Welcome to Your Command Center | This is your Dashboard — home base for protocols, safety alerts, and clinic performance. | `[data-tour="dashboard-header"]` | bottom | Fix timing race |
| 2 | Log a Patient Journey | The Wellness Journey tracks the complete arc of care. Click here to create your first protocol. | `a[href="/wellness-journey"]` | right | ✅ Works (sidebar link) |
| 3 | Check Drug Interactions | The Interaction Checker scans for dangerous combinations like Serotonin Syndrome. | `a[href="/interactions"]` | right | Change to sidebar link |
| 4 | Browse the Substance Catalog | Evidence-based dosing guidelines, contraindications, and safety protocols for 50+ substances. | `a[href="/catalog"]` | right | ✅ Works (sidebar link) |
| 5 | Get Help Anytime | Access FAQs, tutorials, and live support. You can restart this tour from the Help Center. | `a[href="/help"]` | right | ✅ Works (sidebar link) |

**Key changes:**
- Step 3: Change selector from `[data-tour="interaction-checker"]` (Dashboard button) to `a[href="/interactions"]` (sidebar link — always visible)
- Steps 2-5 all target sidebar links which are always in the DOM
- Step 1 timing fix: see implementation notes below

---

#### 5. POSITIONING RULES

**Keep existing smart positioning engine** — it's well-designed.

**Improvements:**
- Increase `cardWidth` from 300 to 340 (matches new spec)
- Increase `cardHeight` from 160 to 200 (accounts for back button row)
- Increase `gap` from 32 to 20 (tighter to target — current 32px is too far)
- Add arrow/pointer: a small triangle that points from card to target

**Arrow spec:**
- Size: 10px × 10px rotated 45°
- Color: `bg-[#0c1016]` with `border-primary/60` on 2 sides
- Position: computed based on which side the card is on (bottom/top/left/right)
- CSS: `absolute` positioned on the card edge facing the target

---

#### 6. ENTRY & EXIT UX

**Launch:**
- Auto-trigger on first login (existing behavior via `localStorage` check)
- Re-launch: Add a `?tour=true` URL param handler — if present, start tour
- Re-launch button: In Help page header, a `[Start Tour]` button that navigates to `/dashboard?tour=true`

**Exit:**
- Skip button (top-right of card)
- Escape key
- Finish button (last step)
- **Remove:** backdrop click dismissal (too easy to accidentally trigger)

**End-of-tour completion:**
- Replace the card with a "Tour Complete" celebration state:
  ```
  ┌─────────────────────────────────────────────┐
  │  ✅  You're all set!                        │
  │                                             │
  │  You've completed the PPN portal tour.      │
  │  You can restart it anytime from Help.      │
  │                                             │
  │  [Go to Dashboard]  [Explore on my own]     │
  └─────────────────────────────────────────────┘
  ```
- This replaces the current `onComplete()` call which just closes the tour
- Show for 3 seconds then auto-dismiss, OR user clicks a button

---

#### 7. RESPONSIVE BEHAVIOR

**Desktop (>= 1024px):**
- Full spec as described above
- Sidebar always visible → all sidebar-link selectors work

**Tablet (768px - 1023px):**
- Card width: `min(340px, calc(100vw - 32px))`
- Sidebar may be collapsed → fallback: if selector not found, show card centered at bottom of screen
- Positioning: prefer `bottom` for all steps (avoids sidebar overlap)

**Mobile (< 768px):**
- Card width: `calc(100vw - 32px)` (full width minus padding)
- Card position: fixed at bottom of screen (`bottom: 16px, left: 16px, right: 16px`)
- No target highlighting (too small to be useful)
- Backdrop: lighter (`bg-black/20`)
- Show simplified step indicator: "2 of 5" text only (no dots)

---

#### 8. ACCESSIBILITY CHECKLIST

- [x] All tooltip text ≥ 12px ✅
- [x] No color-only meaning: active step uses both color AND size change on progress dots
- [x] Keyboard navigable: Tab → Skip, Tab → Back, Tab → Next; Escape → dismiss
- [x] `aria-modal="true"` on tour card container
- [x] `aria-label="Guided tour"` on tour card
- [x] `aria-live="polite"` on step title/description (announces to screen readers)
- [x] `aria-current="step"` on active progress dot
- [x] Focus trap: Tab cycles within tour card only (Skip → Back → Next → Skip)
- [x] High contrast: `#0c1016` background + `#e2e8f0` text = 15.8:1 ratio ✅

---

### HANDOFF NOTES FOR BUILDER

**File to modify:** `src/components/GuidedTour.tsx`

**Critical fixes (in priority order):**

1. **Fix timing race (Step 1):**
   - Change the `useEffect` that navigates to `/dashboard` to use a callback:
   ```tsx
   useEffect(() => {
     if (currentStep === 0 && location.pathname !== '/dashboard') {
       navigate('/dashboard');
       // Wait for navigation + render before querying DOM
       setTimeout(updatePosition, 600); // increase from 100ms
     } else {
       setTimeout(updatePosition, 100);
     }
   }, [currentStep, location.pathname]);
   ```

2. **Fix Step 3 selector:**
   - Change `selector: '[data-tour="interaction-checker"]'` to `selector: 'a[href="/interactions"]'`

3. **Remove backdrop click dismissal:**
   - Remove `onClick={onComplete}` from backdrop div
   - Add `useEffect` for Escape key: `document.addEventListener('keydown', handleEscape)`

4. **Add Back button:**
   ```tsx
   const handlePrev = () => {
     if (currentStep > 0) {
       setIsVisible(false);
       setTimeout(() => setCurrentStep(prev => prev - 1), 150);
     }
   };
   ```

5. **Add tour completion screen:**
   - When `onComplete()` is called after the last step, show a completion overlay for 3s
   - Use a `isComplete` state boolean

6. **Update card dimensions:**
   - `cardWidth = 340` (from 300)
   - `cardHeight = 200` (from 160)
   - `gap = 20` (from 32)

7. **Increase backdrop opacity:**
   - Change `bg-black/10` to `bg-black/40`

8. **Add `aria-modal`, `aria-label`, `aria-live` attributes** per accessibility spec above

9. **Add focus trap** within tour card (Tab cycles: Skip → Back → Next)

10. **Mobile responsive:** Add breakpoint check — if `window.innerWidth < 768`, use fixed bottom positioning instead of computed position

**Shared design system note (WO-083, WO-084):**
The `TourStep` interface and positioning logic in `GuidedTour.tsx` should be extracted into a shared `useTourPositioning` hook so that WO-083 (Privacy Tour) and WO-084 (Crisis/Cockpit mini-tours) can reuse the same engine.

**Estimated BUILDER time:** 3-4 hours

---

**DESIGNER SIGN-OFF:** ✅ Design complete. Routing to BUILDER.
