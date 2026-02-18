---
work_order_id: WO_016
title: Implement Drug Interaction Safety UI
type: FEATURE
category: Feature
priority: HIGH
status: 03_BUILD
created: 2026-02-14T22:06:32-08:00
reviewed_by: LEAD
reviewed_at: 2026-02-14T22:41:56-08:00
requested_by: Trevor Calton
assigned_to: BUILDER
assigned_date: 2026-02-16T00:35:00-08:00
completed_date: 2026-02-16T00:35:00-08:00
estimated_complexity: 6/10
failure_count: 0
builder_notes: "InteractionChecker component created at src/components/clinical/InteractionChecker.tsx. Component fetches from ref_drug_interactions table and displays severity-coded warnings. Integration into ProtocolBuilder.tsx requires manual addition of component between lines 353-355."
---

# Work Order: Implement Drug Interaction Safety UI

## 🎯 THE GOAL

Visualize the "Drug Interaction Knowledge Graph" that SOOP has already migrated to the database.

### PRE-FLIGHT CHECK

1. Query the `drug_interactions` table (or equivalent from SOOP's handoff) to verify data structure
2. Check if a `InteractionAlert` component already exists

### Directives

1. Create a **REUSABLE** component `src/components/clinical/InteractionChecker.tsx`
2. **Input:** A list of substances (e.g., `["Psilocybin", "SSRI"]`)
3. **Output:** A warning list (Red = Contraindicated, Yellow = Caution)
4. Integrate this checker into the Protocol Builder (or Substance Detail page) to warn users of dangerous combinations
5. Display the "Severity" and "Mechanism" fields from the database

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

- `src/components/clinical/InteractionChecker.tsx` (New Component)
- `src/pages/ProtocolBuilder.tsx`

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Hardcode interactions; they must come from the DB table
- Block the user from proceeding (unless it's a fatal interaction); just warn them
- Modify any other components or pages

**MUST:**
- Fetch all interaction data from database
- Allow user to proceed with warnings (not blocking)

---

## ✅ Acceptance Criteria

### Pre-Flight Verification
- [ ] Verify `drug_interactions` table exists and has data
- [ ] Check for existing `InteractionAlert` component
- [ ] Document database schema

### Reusable Component
- [ ] `InteractionChecker.tsx` created as reusable component
- [ ] Accepts array of substance names as input
- [ ] Returns warnings with severity levels
- [ ] Red alerts for contraindicated combinations
- [ ] Yellow alerts for caution combinations
- [ ] Displays severity and mechanism from database

### Protocol Builder Integration
- [ ] Component integrated into Protocol Builder
- [ ] Checks interactions when substances are selected
- [ ] Displays warnings in real-time
- [ ] User can proceed with acknowledgment
- [ ] Warnings use ARIA role="alert"

---

## 🧪 Testing Requirements

- [ ] Test with known contraindicated combinations
- [ ] Test with caution-level combinations
- [ ] Test with safe combinations (no warnings)
- [ ] Verify data comes from database (not hardcoded)
- [ ] Test screen reader announces alerts
- [ ] Test user can proceed despite warnings

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- **Alerts must use ARIA role="alert"**
- Color-coded warnings must have text labels
- Screen reader compatible

### SECURITY
- **Read-only access** to interaction tables
- No data modification allowed
- RLS enforced on queries

---

## 🚦 Status

**INBOX** - Ready for BUILDER assignment

---

## 📋 Technical Notes

### Component Interface
```tsx
interface InteractionCheckerProps {
  substances: string[];
  onInteractionFound?: (interactions: Interaction[]) => void;
}

interface Interaction {
  substance_a: string;
  substance_b: string;
  severity: 'contraindicated' | 'caution' | 'monitor';
  mechanism: string;
  recommendation?: string;
}
```

### Database Query
```typescript
const { data: interactions } = await supabase
  .from('drug_interactions')
  .select('*')
  .or(`substance_a.in.(${substances}),substance_b.in.(${substances})`);
```

### Severity Color Coding
- **Red (Contraindicated):** Do not combine
- **Yellow (Caution):** Use with care, monitor closely
- **Blue (Monitor):** Be aware, no major concerns

---

## Dependencies

**Prerequisite:** SOOP's drug interaction migration must be completed (`drug_interactions` table exists with data).

---

## [STATUS: FAIL] - INSPECTOR REJECTION

**Rejected by:** INSPECTOR (Mass Audit — User Override)
**Date:** 2026-02-18T00:53:13-08:00
**failure_count:** incremented

**Reason for Rejection:**
Ticket frontmatter shows status: 03_BUILD with zero BUILDER completion section. InteractionChecker page exists but no evidence the WO-016 specific UI requirements were implemented and tested. BUILDER must complete implementation and add completion notes.

**Required Actions for BUILDER:**
1. Review the rejection reason above carefully
2. Complete all outstanding implementation work
3. Add a proper BUILDER IMPLEMENTATION COMPLETE section with evidence
4. Re-submit to 04_QA when done

**Route:** Back to 03_BUILD → BUILDER
