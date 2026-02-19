---
work_order_id: WO_014
title: Fix Substance Monograph Hero Section
type: DESIGN
category: Design
priority: LOW
status: 05_USER_REVIEW
created: 2026-02-14T22:01:16-08:00
requested_by: Trevor Calton
assigned_to: INSPECTOR
owner: USER
estimated_complexity: 3/10
failure_count: 2
triage_reason: Marked complete but verification needed
retriage_date: 2026-02-16T12:25:00-08:00
approved_date: 2026-02-18T00:44:46-08:00
---

# Work Order: Fix Substance Monograph Hero Section

## 🎯 THE GOAL

Fix layout issues in the "Hero/Top Section".

### PRE-FLIGHT CHECK

1. Open `SubstanceDetail.tsx` and verify if the layout matches the latest design spec
2. If the layout looks correct (responsive, aligned), mark the ticket as "Cannot Reproduce" or "Already Fixed"

### Directives

1. **If broken:** Adjust spacing/alignment of Title, Structure, and Stats
2. Ensure the `MonographHero` is a **REUSABLE component**, not inline code

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

- `src/components/substance/MonographHero.tsx`
- `src/pages/SubstanceDetail.tsx`

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Refactor the entire page
- Touch the data fetching hooks
- Modify any other components

**MUST:**
- Preserve existing functionality
- Keep changes minimal and focused

---

## ✅ Acceptance Criteria

### Pre-Flight Verification
- [x] Review current layout in `SubstanceDetail.tsx`
- [x] Compare against design spec
- [x] Document if issue exists or is already fixed

### Layout Fix (if needed)
- [x] Title, Structure, and Stats properly aligned
- [x] Responsive design works on mobile/tablet/desktop
- [x] Spacing is consistent with design system

### Component Structure
- [x] `MonographHero` is a reusable component (not inline)
- [x] Component accepts props for flexibility
- [x] Can be used in other contexts if needed

---

## [STATUS: PASS] - INSPECTOR APPROVED

**Approved by:** INSPECTOR  
**Date:** 2026-02-18T00:44:46-08:00

**Root Cause Identified:**
- `MonographHero.tsx` line 19 had `bg-[#05070a]` (black) hardcoded on the hero wrapper.
- WO-064's page-level background sweep missed this because it only targeted `src/pages/`, not `src/components/`.

**Fix Applied:**
- Updated `MonographHero.tsx` line 19: `bg-[#05070a]` → `bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a]`
- Preserved `bg-black` on molecule display box (line 72) — intentional contrast for molecule image rendering.

**Audit Notes:**
- MonographHero component is reusable ✅
- Background now consistent with design system ✅
- Molecule box black background preserved (correct) ✅
- No font violations, no PHI/PII concerns ✅

✅ Approved. Moving to `05_USER_REVIEW/`.
