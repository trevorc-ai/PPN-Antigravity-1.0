---
work_order_id: WO_012
title: Integrate Receptor Affinity Data into UI
type: FEATURE
category: Feature
priority: MEDIUM
status: ASSIGNED
created: 2026-02-14T21:59:44-08:00
reviewed_by: LEAD
reviewed_at: 2026-02-14T22:41:56-08:00
requested_by: Trevor Calton
assigned_to: BUILDER
estimated_complexity: 5/10
failure_count: 0
---

# Work Order: Integrate Receptor Affinity Data into UI

## 🎯 THE GOAL

Visualize the receptor affinity (Ki values) data.

### PRE-FLIGHT CHECK

1. Query `ref_substances` to verify the receptor columns exist (as per SOOP's handoff)
2. Check `src/components/charts/` for existing Radar/Bar charts

### Directives

1. Create a **REUSABLE** component `src/components/science/ReceptorChart.tsx`
2. It must accept a generic data array prop, not be hardcoded to one substance
3. Fetch the new receptor columns from `ref_substances`
4. Implement the chart on `SubstanceDetail.tsx` using the reusable component

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

- `src/components/science/ReceptorChart.tsx` (New Reusable Component)
- `src/pages/SubstanceDetail.tsx`

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Create a new database table
- Hardcode Ki values
- Build the chart logic directly inside the page file; it must be imported
- Modify any other components or pages

**MUST:**
- Build as reusable component
- Accept data via props
- Use existing database columns

---

## ✅ Acceptance Criteria

### Pre-Flight Verification
- [ ] Verify receptor columns exist in `ref_substances` table
- [ ] Check for existing chart components in `src/components/charts/`
- [ ] Document findings before implementation

### Reusable Chart Component
- [ ] ReceptorChart.tsx created as **reusable component**
- [ ] Accepts generic data array via props (not hardcoded)
- [ ] Supports both radar and bar chart types
- [ ] Responsive design (mobile and desktop)
- [ ] Loading state while fetching data
- [ ] Can be used in multiple contexts (substance detail, comparisons, etc.)
- [ ] Includes `<table>` fallback for screen readers

### Substance Detail Integration
- [ ] Chart imported and used in SubstanceDetail.tsx
- [ ] Data fetched from `ref_substances` table
- [ ] No hardcoded values
- [ ] Chart displays below substance information

---

## 🧪 Testing Requirements

- [ ] Test chart with real receptor data
- [ ] Test with substances that have receptor data
- [ ] Test with substances missing receptor data
- [ ] Verify table fallback is accessible
- [ ] Test responsive behavior on mobile
- [ ] Verify component can be reused elsewhere

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- **Charts must include a `<table>` fallback** for screen readers
- Color contrast meets WCAG standards
- Alternative text for visual elements

### SECURITY
- **Read-only access** to receptor data
- No data modification allowed
- RLS enforced on database queries

---

## 🚦 Status

**INBOX** - Ready for BUILDER assignment

---

## 📋 Technical Notes

### Component Interface (Reusable)
```tsx
interface ReceptorChartProps {
  data: ReceptorDataPoint[];
  chartType?: 'radar' | 'bar';
  title?: string;
  showTable?: boolean;
}

interface ReceptorDataPoint {
  receptor: string;
  ki_value: number | null;
  unit?: string;
}
```

### Usage Example
```tsx
// In SubstanceDetail.tsx
<ReceptorChart 
  data={receptorData}
  chartType="radar"
  title="Receptor Affinity Profile"
  showTable={true}
/>
```

### Data Fetching
```typescript
const { data: substance } = await supabase
  .from('ref_substances')
  .select('id, name, ki_5ht2a, ki_5ht1a, ki_d2, ki_nmda')
  .eq('id', substanceId)
  .single();

// Transform to generic format
const receptorData = transformToReceptorData(substance);
```

---

## Dependencies

**Prerequisite:** SOOP's receptor affinity migration must be completed (receptor columns added to `ref_substances` table).
