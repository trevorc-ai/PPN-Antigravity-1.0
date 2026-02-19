---
id: WO-111
title: Site-Wide Mini Guided Tours & UX Standardization
status: 03_BUILD
owner: BUILDER
priority: P2 (High)
category: UX / Onboarding
failure_count: 0
created_date: 2026-02-18T08:15:00-08:00
requested_by: USER
designer_completed: 2026-02-18T14:57:00-08:00
---


## AGENT INSTRUCTIONS
1.  **READ**: Review the User Request and current state analysis below.
2.  **RESEARCH FIRST**: Before designing, research "UI/UX Best Practices for Contextual Onboarding" and "Element Highlighting Patterns".
3.  **EXECUTE**: 
    - Update `docs/archive/misc/HELP_DOCUMENTATION_AND_TOOLTIPS.md` (or creating a new Best Practices doc) with the findings.
    - Audit `GuidedTour.tsx` capabilities.
    - Create a comprehensive Strategy & Design Brief for implementing mini-tours on **every page**.
4.  **HANDOFF**: Follow the instructions at the bottom of this file.

# WO-111: Site-Wide Mini Guided Tours & UX Standardization

## USER CLARIFICATION (2026-02-18)
> "First time users should automatically see the main site wide guided tour. But to reduce cognitive overload, it should just be a 'view from space' and a message that lets them know that there is an individual Page specific guided tour on each page."

## VISUAL REFERENCES (User Uploaded)
The user provided two screenshots defining the aesthetic:
1.  **Global Tour ("View from Space"):** A centered, dark-glass modal ("Welcome to the Research Frontline").
    - Features a "pulse" icon or illustration.
    - "Skip Tour" (text) and "Next" (Blue Button).
    - Dark backdrop opacity ~80%.
2.  **Element Tour ("True Guided Tour"):**
    - **Highlighting:** The target element (e.g., a dashboard card) has a **glowing blue border** and the rest of the screen is masked/darkened.
    - **Popover:** A dark tooltip pointing to the element ("Monitor Live Telemetry").
    - **Step Indicator:** "Step 1 of 3" text.
    - **Controls:** "Dismiss" (top right), "Next Step" (Blue Button).

---

## SCOPE OF WORK (DESIGNER)

### 1. Research & Audit
- **Research Best Practices:** Look for modern patterns for "drip onboarding" or "contextual walkthroughs". Focus on *Element Highlighting* (masking).
- **Skill Check:** Review `ui-ux-product-design` skill.

### 2. Design System Definition
**A. The "View from Space" (Global Welcome):**
- **Trigger:** Auto-launch on first login.
- **Content:** High-level layout orientation. "Welcome to PPN. Here is the layout."
- **Style:** Centered Modal (Reference Screenshot 1).
- **MANDATORY FINAL STEP:** The last step of the Global Tour **MUST** end with the Compass Icon highlighted.
    - **Target element:** The Compass icon button in the top-right nav/header (`[data-tour="compass-icon"]`).
    - **Step Label:** "Step X of X" (final step).
    - **Tooltip Title:** "More Info and Tours"
    - **Tooltip Body:** "To learn more about any element, click ❓. Or take a guided tour through the Portal anywhere you see a compass 🧭."
    - **Controls:** "Back" (text) | "Finish" (blue filled button).
    - **Visual:** Glowing border highlight around the Compass icon — same masking treatment as the page-specific mini-tours.

**B. The "Mini-Tours" (Page Specific):**
- **Trigger:** Compass Icon (Manual) OR Contextual (First visit to a specific complex feature).
- **Style:** "True" Guided Tour (Reference Screenshot 2).
    - **Masking:** Darken entire screen except target.
    - **Focus:** Blue glowing border around target element.
    - **Tooltip:** Floating card with "Step X of Y", Title, Description, "Next".

### 3. Page Inventory & Basics
List every page requiring a tour and draft the *high-level* flow (user intent) for each:
- **Dashboard:** (Existing, maybe needs polish?)
- **Wellness Journey:** (Needs "True" tour upgrade)
- **Substance Catalog:** (How to filter/search)
- **Interaction Checker:** (How to add meds)
- **Protocol Builder:** (Step-by-step guidance)
- **Analytics/Reports:** (Explaining charts)
- **Settings/Profile:** (Privacy controls)

### 4. Deliverable
Create a **`GUIDED_TOUR_SYSTEM_SPEC.md`** containing:
- The UX Pattern (Visual specs for the Tour component).
- The Content Guidelines (ref referencing `HELP_DOCUMENTATION_AND_TOOLTIPS.md`).
- The Tour Strategy (List of pages + Tour Steps for each).

---

## HANDOFF INSTRUCTIONS
Upon completion of the Strategy & Specs:
1.  **UPDATE STATUS**: Change `status` to `03_BUILD`.
2.  **UPDATE OWNER**: Change `owner` to `BUILDER`.
3.  **MOVE FILE**: Move this file to `_WORK_ORDERS/03_BUILD/`.

---

## ✅ DESIGNER COMPLETION NOTES

**Date Completed:** 2026-02-18T14:57:00-08:00  
**Designer:** DESIGNER Agent  
**Status:** ✅ **COMPLETE — ROUTED TO BUILDER**

### Deliverables Produced:

1. **`docs/GUIDED_TOUR_SYSTEM_SPEC.md`** — Full system specification including:
   - UX Pattern spec for both Tier 1 (Global Welcome) and Tier 2 (Mini Tours)
   - Complete visual design tokens and component structure
   - Compass Icon spec and color-coding system
   - Content guidelines (9th-grade reading level rules)
   - **8 complete page tours** with step-by-step content:
     - Dashboard (5 steps), Wellness Journey (4 steps), Substance Catalog (4 steps),
       Interaction Checker (4 steps), Protocol Builder (5 steps), Analytics (4 steps),
       Search Portal (3 steps), Settings (3 steps)
   - Component architecture recommendation (`TourButton.tsx`, `MiniTour.tsx`, `tours/`)
   - Implementation rollout sequence
   - Full INSPECTOR testing checklist

2. **Updated `docs/archive/misc/HELP_DOCUMENTATION_AND_TOOLTIPS.md`** — Referenced and aligned; no conflicts found.

### Key Design Decisions:

- **Box-shadow masking** (not SVG overlays) — more performant, eliminates z-index layering issues
- **`data-tour` attributes** as selectors — stable, semantic, no coupling to CSS classes
- **`useMiniTour(key)` hook pattern** — clean encapsulation of localStorage tracking
- **Centralized step data** in `tours/` directory — BUILDER can add pages without modifying the core component

**DESIGNER SIGN-OFF:** [STATUS: PASS] ✅ Ready for BUILDER.
