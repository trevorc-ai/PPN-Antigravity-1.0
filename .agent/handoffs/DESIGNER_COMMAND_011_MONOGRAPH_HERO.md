# Command #011: Substance Monograph Hero Section Fix

**Date Issued:** Feb 13, 2026, 5:50 PM PST  
**Issued By:** LEAD (on behalf of User)  
**Assigned To:** DESIGNER  
**Priority:** P1 - HIGH  
**Estimated Time:** 2-3 hours  
**Start After:** Command #010 (Pricing Page) complete

---

## DIRECTIVE

**USER SAYS:** "For now, I just want to fix the Hero/top section layout."

Fix layout issues in the hero/top section of the Substance Monograph page ONLY. Do not redesign the entire page.

---

## SCOPE

**IN SCOPE:**
- Hero section layout (top of page)
- Substance name, chemical formula, phase badges
- Registry access button
- Any spacing/alignment issues in hero

**OUT OF SCOPE:**
- Molecular Biology section
- 3D visualizations
- Clinical Velocity graph
- Safety & Interactions
- Everything below the hero

---

## CURRENT FILE

`src/pages/SubstanceMonograph.tsx`

---

## REQUIREMENTS

### 1. Identify Issues
- Audit current hero section layout
- Document spacing, alignment, typography issues
- Check mobile responsiveness
- Verify WCAG AAA contrast

### 2. Design Fixes
- Create mockup of improved hero section
- Maintain dark theme aesthetic
- Ensure 12px minimum font size
- Mobile-responsive design

### 3. Implementation Plan
- Provide exact CSS/Tailwind changes
- Specify line numbers to modify
- Include before/after screenshots

---

## DELIVERABLE

Create design spec: `.agent/handoffs/DESIGNER_MONOGRAPH_HERO_FIX.md`

**Include:**
- Current issues identified
- Proposed fixes (mockup/screenshot)
- Implementation instructions for BUILDER
- Estimated implementation time

---

## USER NOTE

User explicitly asked about this ticket. This is a targeted fix, not a full redesign.

**START IMMEDIATELY AFTER PRICING PAGE COMPLETE**
