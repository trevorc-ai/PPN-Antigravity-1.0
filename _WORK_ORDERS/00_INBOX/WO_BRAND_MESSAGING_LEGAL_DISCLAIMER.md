---
title: "Brand Messaging Update & Legal Disclaimer Integration"
category: "Marketing / Design"
priority: "P1"
assigned_to: "DESIGNER"
created_date: "2026-02-15"
status: "PENDING"
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
