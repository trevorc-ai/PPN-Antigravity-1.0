---
id: WO-228
status: 00_INBOX
owner: PENDING
priority: P2
failure_count: 0
repeat_request: true
created: 2026-02-19
---

# WO-228: Global Blue Button Contrast Audit (REPEAT — accessibility)

## User Prompt (verbatim)
"The blue button 'Log Protocol' is PERFECT. Update all blue buttons on the site to match exactly that color contrast. (most of them are lighter blue with white text and are very difficult to read.)"
"All Blue buttons: color contrast update to match Dashboard button"

## Standard to Match
Dashboard "Log Protocol" button: `bg-indigo-600 hover:bg-indigo-500 text-white`  
This has been applied to: Login Sign In button, Wellness Journey lightbox CTA.

## Known Remaining Violations (bg-primary / light blue)
- `SubstanceCatalog.tsx` — "View Full Monograph" button: `bg-primary hover:bg-blue-600 text-slate-300`
- `MyProtocols.tsx` — "Create New Protocol" button: `bg-primary hover:bg-blue-600 text-slate-300`
- Any remaining `bg-primary` buttons across the app
- `text-slate-300` on colored buttons → must be `text-white`

## CSS Variable Note
`--primary` is defined as an amber/orange color in index.css but Tailwind uses its own `bg-primary` mapping. The actual rendered color of `bg-primary` buttons needs to be verified in browser before mass-replacement.

## Acceptance Criteria
- [ ] All primary action buttons use `bg-indigo-600 hover:bg-indigo-500 text-white`
- [ ] No light blue buttons with white or light-grey text
- [ ] Verified WCAG AA contrast ratio on all CTA buttons
- [ ] Substances page "View Full Monograph" buttons updated

## LEAD NOTES
Can be handled by BUILDER in a single sweep. Low risk.
