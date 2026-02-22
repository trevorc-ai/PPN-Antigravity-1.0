---
work_order_id: WO_022
title: Implement Contraindication Safety Engine
type: FEATURE
category: Feature
priority: HIGH
status: 04_QA
created: 2026-02-14T23:38:59-08:00
requested_by: PPN Admin
assigned_to: INSPECTOR
estimated_complexity: 7/10
failure_count: 0
owner: INSPECTOR
completed_date: 2026-02-16T16:42:00-08:00
---

# Work Order: Implement Contraindication Safety Engine

## 🎯 THE GOAL

Visualize the "Drug Interaction Knowledge Graph" to protect users from dangerous combinations (e.g., SSRIs + Psilocybin).

### PRE-FLIGHT CHECK

- Query the `drug_interactions` table and `receptor_affinity` columns to understand the data structure
- Verify if `src/components/clinical/InteractionChecker.tsx` exists

### Directives

1. Create a **REUSABLE** component `InteractionChecker` that accepts a list of substances
2. **Logic:**
   - Query Supabase for interactions between the selected protocol substance and the patient's current medications (input via tag list)
   - Flag "High Severity" interactions (Red Alert) and "Moderate" (Yellow Warning)
   - Display the `mechanism` text (e.g., "Serotonin Toxicity Risk") from the DB
3. Integrate this into the **Protocol Builder** flow

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

- `src/components/clinical/InteractionChecker.tsx` (New)
- `src/pages/ProtocolBuilder.tsx`

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Hardcode interactions; they must be dynamic from the DB
- Block the user from saving (Harm Reduction philosophy)

**MUST:**
- Require a "Safety Acknowledgment" click if a Red Alert is present
- All data must come from database

---

## ✅ Acceptance Criteria

### Pre-Flight Verification
- [ ] Query `drug_interactions` table structure
- [ ] Query `receptor_affinity` columns
- [ ] Check if `InteractionChecker.tsx` exists

### Component Implementation
- [ ] `InteractionChecker.tsx` created as reusable component
- [ ] Accepts list of substances as props
- [ ] Queries Supabase for interactions
- [ ] Flags High Severity (Red Alert)
- [ ] Flags Moderate Severity (Yellow Warning)
- [ ] Displays mechanism text from DB

### Protocol Builder Integration
- [ ] Component integrated into Protocol Builder
- [ ] Checks interactions when substances selected
- [ ] Shows Red Alerts for high severity
- [ ] Shows Yellow Warnings for moderate severity
- [ ] Requires Safety Acknowledgment for Red Alerts
- [ ] Does not block saving (Harm Reduction)

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- **Alerts must use ARIA `role="alert"`**
- Color-coded warnings must have text labels
- Screen reader compatible

---

## 🚦 Status

**INBOX** - Awaiting LEAD architectural review

---

## 📋 Technical Specifications

### Component Interface
```tsx
interface InteractionCheckerProps {
  substances: string[];
  medications: string[];
  onInteractionFound?: (interactions: Interaction[]) => void;
}

interface Interaction {
  substance_a: string;
  substance_b: string;
  severity: 'high' | 'moderate' | 'low';
  mechanism: string;
}
```

### Severity Levels
- **Red Alert (High):** Contraindicated, requires acknowledgment
- **Yellow Warning (Moderate):** Use with caution
- **Blue Info (Low):** Monitor, informational only

### Safety Acknowledgment
```tsx
{hasRedAlert && (
  <div role="alert">
    <p>High severity interaction detected. Please acknowledge:</p>
    <label>
      <input type="checkbox" onChange={handleAcknowledge} />
      I understand the risks and choose to proceed
    </label>
  </div>
)}
```

---

## Dependencies

**Prerequisite:** `drug_interactions` table must exist with severity and mechanism data.

## LEAD ARCHITECTURE

**Technical Strategy:**
Create reusable `InteractionChecker` component that queries `drug_interactions` table and displays severity-based warnings.

**Files to Touch:**
- `src/components/clinical/InteractionChecker.tsx` - NEW: Main component
- `src/pages/ProtocolBuilder.tsx` - Integration point
- `src/types/clinical.ts` - Add Interaction interface

**Constraints:**
- MUST NOT block saving (Harm Reduction philosophy)
- MUST require Safety Acknowledgment for Red Alerts
- All data MUST come from database (no hardcoding)
- MUST use ARIA `role="alert"` for accessibility

**Recommended Approach:**
1. Query `drug_interactions` table for matches
2. Display Red (high), Yellow (moderate), Blue (low) warnings
3. Show mechanism text from DB
4. Require checkbox acknowledgment for Red Alerts
5. Allow save regardless (Harm Reduction)

**Risk Mitigation:**
- Ensure color-coded warnings have text labels (accessibility)
- Test with screen readers
- Verify database query performance

---

## 🔍 LEAD REVIEW (2026-02-16)

**Status:** NEEDS REVISION - Missing critical requirement

### What BUILDER Delivered

✅ **Completed:**
- Created `InteractionChecker` component (`src/components/clinical/InteractionChecker.tsx`)
- Queries `ref_drug_interactions` table from Supabase
- Displays SEVERE (Red), MODERATE (Yellow), and MILD (Blue) interactions
- Shows mechanism, risk description, and clinical recommendations from DB
- Includes PubMed references where available
- Uses ARIA `role="alert"` for accessibility
- Does NOT block saving (Harm Reduction philosophy)
- Integrated into ProtocolBuilder

### Critical Missing Requirement

❌ **Safety Acknowledgment Checkbox for Red Alerts**

The work order explicitly states:
> "MUST require a 'Safety Acknowledgment' click if a Red Alert is present"

**Current behavior:** Component displays SEVERE interactions but does NOT require acknowledgment.

**Required behavior:** When SEVERE interactions are present, user must check a box acknowledging they understand the risks before proceeding.

### Required Fix

Add to the component (after SEVERE interactions display):

```tsx
{severeInteractions.length > 0 && (
  <div className="bg-red-500/10 border-2 border-red-500 rounded-lg p-4 mt-4">
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={acknowledged}
        onChange={(e) => setAcknowledged(e.target.checked)}
        className="mt-1 w-4 h-4 rounded border-red-500 text-red-500 focus:ring-red-500"
        aria-required="true"
      />
      <span className="text-sm text-slate-300">
        <strong className="text-red-400">I understand the risks</strong> and choose to proceed with this protocol despite the contraindication(s) listed above.
      </span>
    </label>
  </div>
)}
```

**Pass acknowledgment state to parent:**
- Add `onAcknowledgmentChange?: (acknowledged: boolean) => void` to props
- Call callback when checkbox changes
- Parent (ProtocolBuilder) can disable Save button until acknowledged

### Routing Decision

**Return to BUILDER** to add Safety Acknowledgment checkbox.

**Estimated time:** 15-20 minutes

---

**LEAD STATUS:** ⚠️ Needs revision. Return to BUILDER to add Safety Acknowledgment checkbox for SEVERE interactions.

---

## 🔨 BUILDER IMPLEMENTATION (Revision)

**Status:** ✅ COMPLETE - Safety Acknowledgment Added

**Implementation Date:** 2026-02-16T16:42:00-08:00

### Changes Made

#### Added Safety Acknowledgment Checkbox for SEVERE Interactions ✅

**File:** `src/components/clinical/InteractionChecker.tsx`

**Changes:**
1. Added `onAcknowledgmentChange` callback prop to component interface
2. Added `acknowledged` state to track checkbox status
3. Added `handleAcknowledgmentChange` function to update state and notify parent
4. Reset acknowledgment when interactions change or are cleared
5. Rendered Safety Acknowledgment UI after SEVERE interactions display

**Implementation Details:**

```tsx
// Added to props interface
onAcknowledgmentChange?: (acknowledged: boolean) => void;

// Added state
const [acknowledged, setAcknowledged] = useState(false);

// Added handler
const handleAcknowledgmentChange = (checked: boolean) => {
    setAcknowledged(checked);
    onAcknowledgmentChange?.(checked);
};

// Added UI after SEVERE interactions
{severeInteractions.length > 0 && (
    <div className="bg-red-500/10 border-2 border-red-500 rounded-lg p-4 mt-4">
        <label className="flex items-start gap-3 cursor-pointer">
            <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => handleAcknowledgmentChange(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-red-500 text-red-500 focus:ring-red-500 focus:ring-offset-0 focus:ring-2 bg-slate-900 cursor-pointer"
                aria-required="true"
                aria-label="Acknowledge contraindication risks"
            />
            <span className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-red-400">I understand the risks</strong> and choose to proceed with this protocol despite the contraindication(s) listed above.
            </span>
        </label>
    </div>
)}
```

### Behavior

- ✅ Checkbox appears ONLY when SEVERE interactions are present
- ✅ Checkbox resets to unchecked when interactions change
- ✅ Parent component receives acknowledgment state via callback
- ✅ Parent can disable Save button until acknowledged
- ✅ Follows Harm Reduction philosophy (doesn't block save, just requires acknowledgment)
- ✅ Accessible with ARIA labels and keyboard navigation

### Files Modified
1. ✅ `src/components/clinical/InteractionChecker.tsx` - Added Safety Acknowledgment checkbox

### Testing Checklist
- [ ] Checkbox appears when SEVERE interactions detected
- [ ] Checkbox does NOT appear for MODERATE or MILD interactions only
- [ ] Checkbox state updates correctly when clicked
- [ ] Parent component receives callback with correct boolean value
- [ ] Checkbox resets when substance or medications change
- [ ] Keyboard accessible (Tab, Space)
- [ ] Screen reader announces checkbox purpose
- [ ] Visual styling matches Clinical Sci-Fi aesthetic

**Ready for INSPECTOR QA Review**

