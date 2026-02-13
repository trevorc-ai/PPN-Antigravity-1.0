# 🔍 INVESTIGATOR TO-DO LIST
**Role:** Analysis, Research, Validation  
**Date:** 2026-02-10  
**Context:** Landing page layout crowding issues

---

## Priority Tasks

### 🔴 **Critical - Do First**

- [ ] **Validate Trust Indicators Context**
  - User removed the "Trusted by Leading Research Institutions" header
  - Determine if badges need context or can stand alone
  - Check if this matches brand guidelines
  - **Decision needed:** Restore header or redesign badge layout?

- [ ] **Measure Current Visual Density**
  - Open landing page in browser at 1920px, 1440px, 1024px, 768px, 375px
  - Take screenshots of each section
  - Identify which sections feel most cramped
  - **Deliverable:** Annotated screenshots with density notes

- [ ] **Analyze Demo Component Sizes**
  - Measure actual rendered sizes of:
    - `SafetyRiskMatrixDemo`
    - `NetworkBenchmarkDemo`
    - `PatientJourneyDemo`
  - Compare to text column widths
  - **Deliverable:** Size comparison table

### 🟡 **High Priority**

- [ ] **Typography Hierarchy Audit**
  - Review current heading sizes in browser (not just Tailwind classes)
  - Test readability at different viewport sizes
  - Check if hero H1 at 96px is intentional or excessive
  - **Deliverable:** Recommended font size scale

- [ ] **Competitor Benchmarking**
  - Find 3-5 similar B2B SaaS landing pages
  - Analyze their:
    - Section spacing (py-* values)
    - Demo component sizing
    - Typography scale
    - Visual density
  - **Deliverable:** Competitive analysis doc

- [ ] **User Feedback Validation**
  - User said "too crowded" - identify specific pain points
  - Is it:
    - Vertical spacing (sections too close)?
    - Horizontal spacing (columns too tight)?
    - Component sizing (demos too large)?
    - Typography (headings too big)?
  - **Deliverable:** Prioritized list of crowding sources

### 🟢 **Medium Priority**

- [ ] **Mobile Experience Review**
  - Test landing page on actual mobile device (375px)
  - Check if padding values (`p-10 sm:p-20`) cause issues
  - Verify touch targets are adequate
  - **Deliverable:** Mobile-specific recommendations

- [ ] **Accessibility Check**
  - Verify spacing meets WCAG 2.1 guidelines
  - Check if reduced spacing affects keyboard navigation
  - Test with screen reader (VoiceOver/NVDA)
  - **Deliverable:** A11y compliance report

- [ ] **Performance Impact Analysis**
  - Check if large demo components affect page load
  - Measure CLS (Cumulative Layout Shift) scores
  - Identify if spacing changes would improve performance
  - **Deliverable:** Performance metrics before/after

### ⚪ **Low Priority**

- [ ] **Brand Consistency Check**
  - Verify spacing aligns with design system
  - Check if `py-32` standard is documented
  - Ensure changes don't break brand guidelines
  - **Deliverable:** Brand compliance checklist

- [ ] **Long-term Scalability**
  - Consider if spacing system will work for future sections
  - Plan for content expansion
  - Document spacing rationale for future designers
  - **Deliverable:** Spacing system documentation

---

## Research Questions to Answer

1. **Why was the trust indicators header removed?**
   - Was it a UX decision or accidental deletion?
   - Should it be restored or redesigned?

2. **What is the target viewport size?**
   - Optimize for 1440px? 1920px? 1024px?
   - Mobile-first or desktop-first priority?

3. **What is the acceptable visual density?**
   - Should landing page feel spacious or information-dense?
   - B2B SaaS trend: more whitespace or more content?

4. **Are demo components final?**
   - Can they be resized or are dimensions locked?
   - Should they be interactive or static?

5. **What is the conversion goal?**
   - Optimize for scroll depth or CTA clicks?
   - Does spacing affect conversion metrics?

---

## Deliverables Expected

1. ✅ **Annotated screenshots** (density heatmap)
2. ✅ **Size comparison table** (demos vs. text)
3. ✅ **Recommended font scale** (typography hierarchy)
4. ✅ **Competitive analysis** (3-5 examples)
5. ✅ **Prioritized crowding sources** (specific pain points)
6. ✅ **Mobile recommendations** (device-specific)
7. ✅ **A11y compliance report** (WCAG 2.1)
8. ✅ **Performance metrics** (before/after)

---

## Tools Needed

- Browser DevTools (measure rendered sizes)
- Figma/Sketch (if design files exist)
- Lighthouse (performance testing)
- Screen reader (accessibility testing)
- Mobile device or emulator (mobile testing)

---

**Estimated Time:** 4-6 hours  
**Output:** Data-driven recommendations for Builder
