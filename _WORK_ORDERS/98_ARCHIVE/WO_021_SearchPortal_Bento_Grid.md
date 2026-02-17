---
work_order_id: WO_021
title: Refactor SearchPortal to Animated Federated Layout
type: FEATURE
category: Feature
priority: HIGH
status: 03_BUILD
created: 2026-02-14T23:05:14-08:00
requested_by: Trevor Calton
assigned_to: BUILDER
estimated_complexity: 9/10
failure_count: 0
owner: BUILDER
workflow_sequence:
  - step: 1
    agent: LEAD
    action: Initial review and go-ahead
    status: PENDING
  - step: 2
    agent: INSPECTOR
    action: Secondary review and go-ahead
    status: PENDING
  - step: 3
    agent: BUILDER
    action: Implement refactored layout
    status: PENDING
---

# Work Order: Refactor SearchPortal to Animated Federated Layout

## 🎯 THE GOAL

Refactor `SearchPortal.tsx` to implement the "Bento Grid" layout with smooth entry animations.

### Implementation Requirements

1. **Vertical Stacking:** Implement the Substance/Clinical/Network vertical stack

2. **Animation:** Use framer-motion (or CSS transitions) to:
   - "Stagger" the entry of results (Substances appear first, then Patients)
   - Smoothly collapse/expand the AI Insight bar

3. **Smart Filters:** Implement the conditional sidebar that hides irrelevant filters based on the `activeCategory`

4. **Skeleton States:** Create "Shimmering" skeleton loaders that match the exact shape of the new Bento cards (no generic spinners)

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

- `src/pages/SearchPortal.tsx`
- `src/components/search/` (New sub-components)

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Break the existing GoogleGenAI integration
- Cause layout shifts (CLS) when images load
- Modify any other pages or components

**MUST:**
- Preserve GoogleGenAI functionality
- Prevent cumulative layout shift

---

## 🔄 CUSTOM WORKFLOW SEQUENCE

This work order requires a **3-step approval process** due to high complexity and risk:

### Step 1: LEAD Initial Review ✅ COMPLETE
- Review current SearchPortal.tsx implementation
- Assess refactoring scope and risks
- Identify breaking change potential
- Review animation performance implications
- **Deliverable:** Go/No-Go decision with refactoring strategy
- **Status:** APPROVED (Conditional)
- **Completed:** 2026-02-14T23:35:22-08:00
- **Review Doc:** brain/c1cab190-b582-47b4-a73e-ae60341807dc/WO_021_LEAD_Review.md

### Step 2: INSPECTOR Secondary Review ⏳ PENDING
- Verify accessibility of animations (prefers-reduced-motion)
- Review CLS prevention strategy
- Assess skeleton loader accessibility
- Verify GoogleGenAI integration preservation
- **Deliverable:** Accessibility and UX sign-off

### Step 3: BUILDER Implementation ⏳ PENDING
- Refactor SearchPortal.tsx to Bento Grid layout
- Implement vertical stacking (Substance/Clinical/Network)
- Add staggered entry animations with framer-motion
- Create collapsible AI Insight bar
- Implement smart conditional filters
- Create custom skeleton loaders
- **Deliverable:** Production-ready refactored SearchPortal

---

## ✅ Acceptance Criteria

### LEAD Review
- [ ] Current implementation reviewed
- [ ] Refactoring scope defined
- [ ] Risk assessment completed
- [ ] Go/No-Go decision made

### INSPECTOR Review
- [ ] Animation accessibility verified
- [ ] CLS prevention strategy approved
- [ ] Skeleton loader accessibility confirmed
- [ ] Sign-off provided

### BUILDER Implementation
- [ ] Bento Grid layout implemented
- [ ] Vertical stacking (Substance/Clinical/Network)
- [ ] Staggered entry animations
- [ ] AI Insight bar collapse/expand
- [ ] Smart conditional filters
- [ ] Custom skeleton loaders
- [ ] GoogleGenAI integration preserved
- [ ] No layout shifts (CLS = 0)
- [ ] Animations respect prefers-reduced-motion

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- **All animations must respect prefers-reduced-motion**
- Skeleton loaders must be announced to screen readers
- Collapsible elements must be keyboard accessible

---

## 🚦 Status

**PENDING INSPECTOR REVIEW** - LEAD approved (Step 1 complete), awaiting INSPECTOR secondary review (Step 2)

---

## 📋 Technical Specifications

### Animation Library
```bash
npm install framer-motion
```

### Stagger Animation Example
```tsx
<motion.div
  variants={{
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }}
  initial="hidden"
  animate="show"
>
  {results.map((item) => (
    <motion.div variants={itemVariants} key={item.id}>
      {/* Result card */}
    </motion.div>
  ))}
</motion.div>
```

### Reduced Motion Support
```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const transition = prefersReducedMotion 
  ? { duration: 0 } 
  : { duration: 0.3, ease: 'easeOut' };
```

---

## Dependencies

None - This is a refactoring task.

---

## ⚠️ High-Risk Notice

This work order is marked **HIGH PRIORITY** and **HIGH COMPLEXITY** due to:
- Major refactoring of critical search functionality
- Complex animation requirements
- CLS prevention requirements
- GoogleGenAI integration preservation
- Requires multi-agent approval before implementation

## LEAD ARCHITECTURE

**Technical Strategy:**
Refactor `SearchPortal.tsx` (808 lines) to implement Bento Grid layout with framer-motion animations.

**Files to Touch:**
- `src/pages/SearchPortal.tsx` - Main refactor target
- `src/components/search/BentoGrid.tsx` - NEW: Grid layout component
- `src/components/search/SkeletonCard.tsx` - NEW: Custom skeleton loaders
- `package.json` - Add framer-motion dependency

**Constraints:**
- MUST preserve GoogleGenAI integration (lines 383-403)
- MUST implement prefers-reduced-motion support
- MUST prevent CLS (Cumulative Layout Shift)
- File will grow significantly - consider splitting into smaller components

**Recommended Approach:**
1. Install framer-motion: `npm install framer-motion`
2. Create BentoGrid component with CSS Grid (not horizontal scroll)
3. Wrap result cards in motion.div with stagger animations
4. Create custom skeleton loaders matching card shapes
5. Make AI Insight bar collapsible with smooth animation
6. Test with prefers-reduced-motion enabled

**Risk Mitigation:**
- Test animation performance with 50+ cards
- Ensure keyboard navigation still works
- Verify mobile responsiveness (stack vertically on small screens)
