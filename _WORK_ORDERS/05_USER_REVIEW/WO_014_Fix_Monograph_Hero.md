---
work_order_id: WO_014
title: Fix Substance Monograph Hero Section
type: DESIGN
category: Design
priority: LOW
status: 03_BUILD
created: 2026-02-14T22:01:16-08:00
requested_by: Trevor Calton
assigned_to: BUILDER
estimated_complexity: 3/10
failure_count: 2
triage_reason: Marked complete but verification needed
retriage_date: 2026-02-16T12:25:00-08:00
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

---

## 🏗️ LEAD ARCHITECTURE (Updated 2026-02-16T12:30:00-08:00)

### User's Verbatim Instructions

**"Proposed layout attached for SubstanceMonograph page - it's just realigning the bento box"**

### Current vs Proposed Layout

**CURRENT LAYOUT (Broken):**
- Vertical stacking on left side
- Molecular structure small on right
- Stats/badges mixed together
- Poor visual hierarchy

**PROPOSED LAYOUT (Target):**
- **3-column horizontal grid:**
  - **Left:** Title + Chemical Name + Registry Access badges
  - **Center:** Molecular Structure (larger, prominent)
  - **Right:** Efficacy Score + Stats cards
- Clean separation of concerns
- Better visual balance and hierarchy

### Implementation Strategy

This is a **CSS grid/flexbox realignment task** - reorganize existing bento box elements into the 3-column layout.

**Files to Modify:**
- `src/pages/SubstanceDetail.tsx` (hero section layout)
- OR `src/components/substance/MonographHero.tsx` (if component exists)

**Key Changes:**
1. Change from vertical stack to **3-column grid** (desktop)
2. Move molecular structure to **center column** (make larger)
3. Move efficacy score + stats to **right column**
4. Ensure **responsive** (stack vertically on mobile)
5. Maintain existing data/functionality - **layout only**

### Handoff to BUILDER

**BUILDER:** Realign the MonographHero bento box to match the proposed 3-column layout:

**Step 1: Locate the Hero Section**
- Check if `src/components/substance/MonographHero.tsx` exists
- If not, find the hero section in `src/pages/SubstanceDetail.tsx`

**Step 2: Implement 3-Column Grid**
```tsx
// Desktop: 3-column grid
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* LEFT: Title + Chemical Name + Registry */}
  <div className="space-y-4">
    <h1>{title}</h1>
    <p className="text-slate-400">{chemicalName}</p>
    {/* Registry access badges */}
  </div>
  
  {/* CENTER: Molecular Structure (larger) */}
  <div className="flex items-center justify-center">
    {/* Make structure image larger */}
  </div>
  
  {/* RIGHT: Efficacy + Stats */}
  <div className="space-y-4">
    {/* Efficacy score card */}
    {/* Stats cards */}
  </div>
</div>
```

**Step 3: Responsive Design**
- Desktop (lg+): 3 columns
- Tablet/Mobile: Stack vertically

**Step 4: Test**
- [ ] Desktop layout matches proposed design
- [ ] Mobile/tablet stacks properly
- [ ] All existing data still displays
- [ ] No console errors

**Step 5: Move to QA**
When complete, move ticket to `04_QA`

**Estimated Time:** 30-45 minutes

---

**LEAD STATUS:** ✅ Architecture complete. Clear bento box realignment task routed to BUILDER.

