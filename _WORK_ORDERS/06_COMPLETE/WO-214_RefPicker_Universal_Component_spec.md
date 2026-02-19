---
id: WO-214
title: "DESIGNER + BUILDER: RefPicker Universal Component — 3-Mode Ref_ Picker"
status: 02_DESIGN
owner: DESIGNER
priority: P1
created: 2026-02-19
failure_count: 0
ref_tables_affected: all ref_ tables
depends_on: Turning_Point.md — DESIGNER mandate
---

## MANDATE (from Turning_Point.md)

> "Every form in the system reduces to the same interaction pattern: 'Here are your options' (from ref_ table) → user selects some → IDs saved to log_ table. I design one great ref_picker component — and everything else is layout, sequencing, and clinical UX."

> "The ref_picker component I need to build — since you've now confirmed this is the universal interaction pattern — should feel like selecting toppings, not filling out a form."

## SCOPE

A single `<RefPicker>` component that auto-selects rendering mode based on item count:

| Item Count | Mode | Pattern |
|-----------|------|---------|
| ≤ 12 items | Full chip/button grid | Current pattern — keep it |
| 13–40 items | Grouped collapsible sections by category | New |
| 41+ items | Searchable dropdown with recently-used surfaced first | New |

## DESIGNER DELIVERABLE

Design brief for the `RefPicker` component covering all three modes:

### Required Specs

1. **Mode 1: Chip Grid (≤12 items)**
   - Touch-friendly button chips, 2-3 columns
   - Selected state: `bg-primary/20 border-primary text-primary`
   - Multi-select: selected items show with checkmark
   - Accessible: `aria-pressed`, `role="group"`, keyboard navigable

2. **Mode 2: Grouped Collapsible (13-40 items)**
   - Group header with item count badge
   - Expand/collapse per section
   - Show 3 most-recently-used items always visible
   - Category labels from `ref.category` column

3. **Mode 3: Searchable Dropdown (41+ items)**
   - Text search input with clear button
   - Recently-used items pinned to top (sorted by last_used_at desc)
   - Keyboard arrows navigate, Enter selects
   - No typing allowed for free text — search only filters existing options

### Component API

```tsx
interface RefPickerProps {
    items: { id: number; label: string; category?: string }[];
    selected: number[];                      // selected IDs
    onChange: (ids: number[]) => void;       // returns FK integer IDs
    multi?: boolean;                         // default true
    label: string;                           // accessibility label
    maxItems?: number;                       // max selections (cardinality guard)
    recentlyUsed?: number[];                 // IDs used in last 7 days
}
```

### Critical Rules

- **Never stores labels** — only integer IDs are emitted via `onChange`
- Font size ≥ 14px throughout (WCAG AA)
- No color-only state indicators — use text labels + icons
- Touch target ≥ 44px (WCAG mobile)
- Error state when `maxItems` exceeded: amber border + count label

## BUILDER FOLLOW-ON

After INSPECTOR approves DESIGNER spec:
1. Build `src/components/ui/RefPicker.tsx`
2. Integrate into `StructuredIntegrationSessionForm.tsx` (replaces FOCUS_AREAS string array → FK ids)
3. Integrate into `BehavioralChangeTrackerForm.tsx` (replaces CHANGE_TYPES → FK ids)
4. Remove the `// TODO (WO-214)` annotations from WO-213 changes

## Acceptance Criteria

- [ ] 3-mode rendering works correctly based on item count
- [ ] `onChange` always returns `number[]` (FK IDs — never label strings)
- [ ] Mode auto-selects based on `items.length` threshold
- [ ] All 3 modes WCAG AA accessible
- [ ] `maxItems` cardinality guard works correctly
- [ ] Component replaces hardcoded arrays in StructuredIntegrationSession and BehavioralChangeTracker
