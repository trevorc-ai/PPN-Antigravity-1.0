---
work_order_id: WO_003
title: Feature - Potency Normalizer Calculator
type: FEATURE
category: Feature
priority: MEDIUM
status: ASSIGNED
created: 2026-02-14T18:58:31-08:00
reviewed_by: LEAD
reviewed_at: 2026-02-14T19:07:27-08:00
requested_by: PPN Admin
assigned_to: BUILDER
estimated_complexity: 5/10
failure_count: 0
---

# Work Order: Feature - Potency Normalizer Calculator

## 🎯 THE GOAL

Create a "Substance Calibration" component for the pre-session flow.

### Requirements

1. **Data Source:** Fetch `ref_substances` from Supabase to populate a dropdown
2. **Inputs:**
   - Weight (grams) - numeric input
   - Potency Modifier (0.5x - 3.0x slider)
3. **Logic:** Calculate `Effective Dose = Weight * Potency`
4. **UI:** "Dark Mode" aesthetic (Black background, Gray containers)
5. **Safety:** If `Effective Dose > 5g`, show a Red "High Dose Warning" banner
6. **Action:** On "Confirm," insert a record into `log_doses` linked to the active session

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

You are ONLY allowed to modify the following specific files/areas:

- `src/components/session/DosageCalculator.tsx` (New Component - CREATE THIS)
- `src/hooks/useSessionLogic.ts` (For DB insertion logic)

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Add any free-text notes fields
- Allow negative numbers in weight input
- Change the global theme (only component-level styles allowed)
- Modify any other components or pages
- Touch the database schema
- Add new routes or navigation

**MUST:**
- Ensure the "Potency Slider" defaults to 1.0x
- Validate all numeric inputs
- Handle Supabase fetch errors gracefully
- Use existing design system colors where possible

---

## ✅ Acceptance Criteria

### Functionality
- [ ] Component fetches `ref_substances` from Supabase successfully
- [ ] Dropdown populated with substance names
- [ ] Weight input accepts only positive numbers (grams)
- [ ] Potency slider ranges from 0.5x to 3.0x with 1.0x default
- [ ] Effective dose calculation is accurate: `Weight * Potency`
- [ ] Red warning banner displays when effective dose > 5g
- [ ] "Confirm" button inserts record into `log_doses` table
- [ ] Record properly links to active session

### UI/UX
- [ ] Dark mode aesthetic (black background, gray containers)
- [ ] Component is visually consistent with existing app design
- [ ] All inputs are minimum 44px height (accessibility)
- [ ] Clear labels for all inputs
- [ ] Effective dose displays in real-time as inputs change
- [ ] Warning banner is visually prominent (red, high contrast)

### Security & Compliance
- [ ] No PII collected or stored
- [ ] No free-text fields added
- [ ] Input validation prevents negative numbers
- [ ] Proper error handling for database operations

---

## 🧪 Testing Requirements

- [ ] Test with various substance selections
- [ ] Verify calculation accuracy across potency range
- [ ] Confirm warning appears at exactly 5.0g threshold
- [ ] Test database insertion with valid session
- [ ] Verify error handling when Supabase is unavailable
- [ ] Test input validation (negative numbers, non-numeric input)
- [ ] Verify slider defaults to 1.0x on component mount

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- **Input Height:** All inputs must be minimum 44px height for motor control safety
- **Labels:** All form controls must have visible labels
- **Contrast:** Warning banner must meet WCAG contrast requirements
- **Keyboard Navigation:** All controls must be keyboard accessible

### SECURITY
- **No PII:** Zero personally identifiable information
- **No Free Text:** No text area or uncontrolled text inputs
- **Validation:** All numeric inputs must be validated server-side
- **RLS:** Ensure database operations respect Row Level Security

---

## 🚦 Status

**INBOX** - Ready for BUILDER assignment

---

## Workflow

1. ⏳ CUE creates work order → **CURRENT STEP**
2. ⏳ BUILDER reviews and accepts
3. ⏳ BUILDER creates DosageCalculator component
4. ⏳ BUILDER implements useSessionLogic hook
5. ⏳ BUILDER tests component functionality
6. ⏳ INSPECTOR verifies compliance
7. ⏳ User approves and deploys

---

## 📋 Technical Notes

### Component Structure
```tsx
// Suggested component interface
interface DosageCalculatorProps {
  sessionId: string;
  onConfirm?: () => void;
}
```

### Database Schema Reference
- Table: `log_doses`
- Required fields: `session_id`, `substance_id`, `weight_grams`, `potency_modifier`, `effective_dose_mg`

### Calculation Formula
```
effective_dose_mg = weight_grams * 1000 * potency_modifier * substance.default_potency_factor
```

### Warning Threshold
- Display warning when: `effective_dose_mg > 5000` (5g = 5000mg)

---

## 🎨 Design Specifications

### Colors
- Background: `#000000` (Black)
- Container: `#1a1a1a` or `#2a2a2a` (Dark Gray)
- Warning Banner: `#dc2626` or `#ef4444` (Red)
- Text: `#f1f5f9` (Slate 100)

### Layout
- Component should be self-contained
- Responsive design (mobile-first)
- Clear visual hierarchy
- Adequate spacing between elements

---

## Dependencies

**Prerequisite:** WO_002 (Shadow Market Schema) must be completed first to ensure `ref_substances` and `log_doses` tables exist.

---

## 🔍 INSPECTOR QA APPROVAL

**Reviewed By:** INSPECTOR  
**Review Date:** 2026-02-14T21:43:23-08:00  
**Status:** ✅ **APPROVED**

### Compliance Verification

**✅ ACCESSIBILITY:**
- Minimum 44px input height specified
- Visible labels required for all controls
- WCAG contrast requirements enforced
- Keyboard navigation mandated

**✅ PHI/SECURITY:**
- Zero PII collection
- No free-text fields (controlled inputs only)
- Input validation enforced
- RLS enforcement specified
- Data stored as controlled values (IDs and numerics)

**VERDICT:** This work order is compliant with all accessibility and PHI rules. Cleared for USER_REVIEW.
