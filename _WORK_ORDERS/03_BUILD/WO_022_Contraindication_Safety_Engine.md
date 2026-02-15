---
work_order_id: WO_022
title: Implement Contraindication Safety Engine
type: FEATURE
category: Feature
priority: HIGH
status: INBOX
created: 2026-02-14T23:38:59-08:00
requested_by: Trevor Calton
assigned_to: BUILDER
estimated_complexity: 7/10
failure_count: 0
owner: BUILDER
status: 03_BUILD
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
