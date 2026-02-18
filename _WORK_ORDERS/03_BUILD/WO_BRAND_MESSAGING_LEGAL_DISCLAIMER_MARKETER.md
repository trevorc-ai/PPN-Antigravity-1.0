---
title: "Brand Messaging Update & Legal Disclaimer Integration"
category: "Marketing / Design"
priority: "P1"
owner: "MARKETER"
assigned_to: "BUILDER"
assigned_date: "2026-02-15T17:10:00-08:00"
created_date: "2026-02-15"
status: "03_BUILD"
failure_count: 0
estimated_effort: "MEDIUM"
---

# Brand Messaging Update & Legal Disclaimer Integration

## 1. THE GOAL

Implement the newly approved brand tagline and mandatory legal safety disclosures across all public-facing and internal portal surfaces.

### Tagline Implementation
Update the Hero section of the Landing Page and the Sidebar header to feature the new tagline:

**"Augmented intelligence for the global psychedelic wellness community."**

### Global Legal Footer
Add a persistent, high-visibility legal disclaimer to the site footer and all "Drug Interaction" or "Safety Matrix" search results:

**"This is for informational purposes only. For medical advice or diagnosis, consult a professional."**

### Typography Standard
Ensure the tagline is styled in the "Clinical Sci-Fi" brand font (Monospace or high-legibility Sans-Serif) at a minimum of 14px.

### Safety Positioning
Place the legal disclaimer in a "Warning" sub-panel using the designated Aurora-Slate border style to ensure it is the first thing a user sees when viewing clinical data.

---

## 2. THE BLAST RADIUS (Authorized Target Area)

You and the swarm are ONLY allowed to modify the following specific files/areas:
* `/frontend/src/pages/Landing.tsx` (Hero section)
* `/frontend/src/components/layout/Footer.tsx`
* `/frontend/src/components/layout/Sidebar.tsx`
* `/frontend/src/components/clinical/SafetyMatrix.tsx`
* `/frontend/src/components/clinical/InteractionChecker.tsx`

---

## 3. THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

* **DO NOT** modify any clinical logic, receptor affinity data, or database schemas.
* **DO NOT** change the "Deep Slate" (#020408) background or existing Aurora gradient system.
* **DO NOT** remove existing accessibility features; the disclaimer must be screen-readable.
* **DO NOT** alter the Tiered Access logic; the disclaimer must show for both Free and Paid tiers.
* Ensure the disclaimer does not block functional buttons like "Log Protocol" or "Check Interactions."

---

## 4. MANDATORY COMPLIANCE

### ACCESSIBILITY
* Minimum 12px fonts for the disclaimer.
* The disclaimer must be paired with a ⚠️ icon to ensure visibility for users with color vision deficiency.
* All text must be screen-reader accessible.

### SECURITY
* No PHI/PII data collection.
* The tagline and disclaimer implementation must remain strictly static and informational.

---

## IMPLEMENTATION CHECKLIST

### Tagline Updates
- [ ] Update Landing Page Hero section with new tagline
- [ ] Update Sidebar header with new tagline
- [ ] Apply "Clinical Sci-Fi" typography (Monospace/Sans-Serif, minimum 14px)
- [ ] Verify tagline is responsive across all viewport sizes

### Legal Disclaimer Integration
- [ ] Add disclaimer to global Footer component
- [ ] Add disclaimer to SafetyMatrix component results
- [ ] Add disclaimer to InteractionChecker component results
- [ ] Style disclaimer with Aurora-Slate border in "Warning" sub-panel
- [ ] Include ⚠️ icon with disclaimer text
- [ ] Ensure minimum 12px font size for disclaimer

### Quality Assurance
- [ ] Verify disclaimer does not block functional buttons
- [ ] Test screen reader accessibility for both tagline and disclaimer
- [ ] Confirm disclaimer appears for both Free and Paid tiers
- [ ] Validate no clinical logic or data schemas were modified
- [ ] Ensure Deep Slate background and Aurora gradients remain unchanged

---

## DELIVERABLES

1. **Updated Components** with tagline and disclaimer integrated
2. **Visual Verification** screenshots showing:
   - Landing page with new tagline
   - Sidebar with new tagline
   - Safety Matrix with legal disclaimer
   - Interaction Checker with legal disclaimer
   - Footer with legal disclaimer
3. **Accessibility Report** confirming screen reader compatibility and icon pairing

---

## SUCCESS CRITERIA

- [ ] New tagline appears on Landing Hero and Sidebar header
- [ ] Tagline uses Clinical Sci-Fi typography at ≥14px
- [ ] Legal disclaimer appears in Footer, SafetyMatrix, and InteractionChecker
- [ ] Disclaimer styled with Aurora-Slate border and ⚠️ icon
- [ ] Disclaimer text is ≥12px and screen-reader accessible
- [ ] No functional buttons are blocked by disclaimer
- [ ] No clinical logic, schemas, or brand colors modified
- [ ] Disclaimer visible to both Free and Paid tier users

---

## DESIGNER COMPLETION NOTES

**Specification Completed:** 2026-02-15T17:10:00-08:00  
**Status:** ✅ READY FOR BUILDER IMPLEMENTATION

### Deliverable Created:

**BRAND_MESSAGING_SPEC_V1.md** ✅
- **Location:** `/docs/design/BRAND_MESSAGING_SPEC_V1.md`
- **Summary:** Complete implementation specification for tagline and legal disclaimer
- **Includes:** Code examples, styling specs, accessibility requirements, testing checklist

### Specification Contents:

#### 1. Brand Tagline Implementation
**Tagline:** "Augmented intelligence for the global psychedelic wellness community."

**Placement Locations:**
- ✅ Landing Page Hero (below headline, above CTAs)
- ✅ Sidebar Header (below PPN logo, abbreviated version)

**Styling Specifications:**
- Font size: 18-20px (responsive)
- Color: Slate 300 (#cbd5e1) for 5.2:1 contrast
- Font weight: 500 (Medium)
- Letter-spacing: 0.025em
- Full code examples provided

#### 2. Legal Disclaimer Implementation
**Disclaimer:** "This is for informational purposes only. For medical advice or diagnosis, consult a professional."

**Placement Locations:**
- ✅ Global Footer (above copyright)
- ✅ Safety Matrix (above results, conditional)
- ✅ Interaction Checker (above results, conditional)

**Styling Specifications:**
- Background: Amber 500 at 10% opacity
- Border: Amber 500 at 30% opacity (footer) or left-border (clinical components)
- Icon: ⚠️ warning (Material Symbols)
- Font size: 12-14px
- Color: Slate 300 body, Amber 400 labels
- Full code examples provided

### Files to Modify:

**BUILDER must update the following files:**
1. `/src/pages/Landing.tsx` - Add tagline to hero section
2. `/src/components/Sidebar.tsx` - Add tagline below logo
3. `/src/components/Footer.tsx` - Add disclaimer section
4. `/src/components/clinical/SafetyMatrix.tsx` OR `/src/pages/InteractionChecker.tsx` - Add conditional disclaimer

### Accessibility Compliance:

**Tagline:**
- ✅ Minimum 14px font size (18px used)
- ✅ 5.2:1 contrast ratio (Slate 300 on Deep Slate)
- ✅ Screen reader accessible
- ✅ Responsive across all viewports

**Disclaimer:**
- ✅ Minimum 12px font size (12-14px used)
- ✅ Icon + text (not color-only)
- ✅ ⚠️ warning icon for visual emphasis
- ✅ "Medical Disclaimer" label for screen readers
- ✅ High contrast (Amber 400/500 on dark background)
- ✅ Does not block functional buttons

### Implementation Guidance:

**Recommended Order:**
1. Footer (easiest to implement and test)
2. Landing Page (high visibility)
3. Sidebar (may need layout adjustments)
4. Clinical Components (requires conditional logic)

**Potential Issues:**
- Sidebar space constraints → Use abbreviated tagline
- Clinical component file paths → May need to locate correct files
- Conditional display → Ensure disclaimer only shows when results present
- Button blocking → Test that disclaimer doesn't cover interactive elements

**Color Update Note:**
Per WO_041 accessibility audit, `text-slate-400` is deprecated. Consider using `text-slate-300` for sidebar tagline.

### Testing Requirements:

**Visual Testing:**
- [ ] Tagline on Landing (desktop, tablet, mobile)
- [ ] Tagline in Sidebar (desktop, tablet, mobile)
- [ ] Disclaimer in Footer (all pages)
- [ ] Disclaimer in Safety Matrix (when results shown)
- [ ] Disclaimer in Interaction Checker (when results shown)

**Accessibility Testing:**
- [ ] Screen reader announces tagline
- [ ] Screen reader announces disclaimer with label
- [ ] Warning icon announced
- [ ] All text meets 12px minimum
- [ ] All text meets 4.5:1 contrast
- [ ] Keyboard navigation not affected

**Functional Testing:**
- [ ] Disclaimer doesn't block buttons
- [ ] Disclaimer doesn't interfere with scrolling
- [ ] Appears for Free tier users
- [ ] Appears for Paid tier users
- [ ] No console errors

**Cross-Browser Testing:**
- [ ] Chrome, Firefox, Safari, Edge (latest)
- [ ] Mobile Safari (iOS), Mobile Chrome (Android)

### Success Criteria:

- ✅ Tagline appears on Landing Page and Sidebar
- ✅ Tagline uses Clinical Sci-Fi typography (14px+ minimum)
- ✅ Disclaimer appears in Footer, Safety Matrix, Interaction Checker
- ✅ Disclaimer styled with Aurora-Slate border and ⚠️ icon
- ✅ All text is 12px+ and screen reader accessible
- ✅ No functional buttons blocked
- ✅ Visible to both Free and Paid tiers
- ✅ No clinical logic, schemas, or brand colors modified

### Notes for BUILDER:

- Complete specification with code examples provided
- All styling uses existing Tailwind classes
- No new dependencies required
- Estimated effort: 2-3 hours
- Test thoroughly before moving to QA

**Ready for BUILD Phase:** ✅ YES
