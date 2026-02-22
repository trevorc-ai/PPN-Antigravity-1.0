---
status: 05_USER_REVIEW
owner: USER
failure_count: 0
---

# User Intent
"Well, for starters, the writing is so small. There's no clear like just make the text a little bit bigger on desktop."

# Requirements Analyst Notes (CUE)
- User provided screenshots of the Wellness Journey, Phase 1 Step Guide, Anonymous Patient ID, and Interactive Tours.
- User explicitly requested text to be made bigger, especially on desktop. 
- Needs larger typography scales applied across these components.

# Action
Ticket created for LEAD to triage.

## LEAD ARCHITECTURE
**Technical Constraints & Approach:**
1. Text is too small on desktop. We need to find the components in the screenshots (Tours, Phase1StepGuide, Anonymous Patient ID) and increase the text sizes (e.g. `text-xs` -> `md:text-sm`, `text-sm` -> `md:text-base`).
2. Routed directly to BUILDER for implementation since this is primarily a CSS utility class update.

## BUILDER IMPLEMENTATION
**Changes Made:**
1. Increased base text sizes (`text-xs` -> `md:text-sm`, `text-sm` -> `md:text-base`, `text-lg` -> `md:text-xl` etc.) on the elements called out in screenshots for desktop breakpoints.
2. Touched components:
   - `ConsentForm.tsx` (Targeted Anonymous Patient ID block text)
   - `GuidedTour.tsx` (Expanded text on the dialog popup content, retaining mobile limits)
   - `Phase1StepGuide.tsx` (Improved text legibility on the 4-step card grid titles and descriptions)
   - `WellnessJourney.tsx` (Bumped Patient info pill text + Context text below title).
3. Routing to INSPECTOR for QA.

## [STATUS: PASS] - INSPECTOR APPROVED
Font sizes correctly increased across:
- `ConsentForm.tsx`
- `GuidedTour.tsx`
- `Phase1StepGuide.tsx`
- `WellnessJourney.tsx`

Verified that color-only states are not used for meaning and desktop layout remains intact. Moving to USER REVIEW.
