---
work_order_id: WO_014
title: Fix Substance Monograph Hero Section
type: DESIGN
category: Design
priority: LOW
status: COMPLETE
created: 2026-02-14T22:01:16-08:00
requested_by: Trevor Calton
assigned_to: DESIGNER
estimated_complexity: 3/10
failure_count: 0
completed: 2026-02-14T22:12:00-08:00
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
- [ ] Review current layout in `SubstanceDetail.tsx`
- [ ] Compare against design spec
- [ ] Document if issue exists or is already fixed

### Layout Fix (if needed)
- [ ] Title, Structure, and Stats properly aligned
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Spacing is consistent with design system

### Component Structure
- [ ] `MonographHero` is a reusable component (not inline)
- [ ] Component accepts props for flexibility
- [ ] Can be used in other contexts if needed

---

## 🧪 Testing Requirements

- [ ] Test layout on desktop (1920px)
- [ ] Test layout on tablet (768px)
- [ ] Test layout on mobile (375px)
- [ ] Verify H1 tags are preserved
- [ ] Test with different substance data

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- **H1 tags must be preserved**
- Semantic HTML structure maintained
- Proper heading hierarchy

### SECURITY
None

---

## 🚦 Status

**INBOX** - Ready for DESIGNER assignment

---

## 📋 Technical Notes

### Expected Component Structure
```tsx
interface MonographHeroProps {
  title: string;
  structure?: string;
  stats?: {
    label: string;
    value: string;
  }[];
}
```

### Layout Elements to Check
- Title alignment and size
- Structure visualization placement
- Stats grid/flex layout
- Spacing between elements
- Mobile responsiveness

---

## Dependencies

None - This is a standalone design fix.
