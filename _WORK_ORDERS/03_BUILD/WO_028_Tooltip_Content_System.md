---
work_order_id: WO_028
title: Implement Tooltip Content System
type: FEATURE
category: Feature
priority: MEDIUM
status: INBOX
created: 2026-02-15T00:04:47-08:00
requested_by: Trevor Calton
assigned_to: BUILDER
estimated_complexity: 5/10
failure_count: 0
owner: BUILDER
status: 03_BUILD
---

# Work Order: Implement Tooltip Content System

## 🎯 THE GOAL

Implement the uploaded tooltip content into the AdvancedTooltip components across the application.

### Content Source

- **File:** `/public/Tooltips.md` (41 lines, 2109 bytes)
- **Sections:** 6 feature areas with implementation-ready tooltip text
- **Format:** Short, helpful snippets

### Directives

1. **Create Tooltip Data:** Convert markdown to JSON/TypeScript data structure
2. **Integrate Content:** Add tooltips to existing components using AdvancedTooltip
3. **Centralize:** Create a tooltip content registry for easy updates

---

## 📋 Tooltip Sections

1. **Safety Shield** - Interaction Check, Mechanism, Severity Score
2. **Legacy Importer** - Paste Area, Review Step, Local Privacy
3. **Reagent Eye** - Camera View, Color Match, Warning
4. **Trial Matchmaker** - Match Badge, Payout, Anon ID
5. **Music Logger** - Playlist Link, Phase, Sync
6. **Research Dashboard** - Sparkline, Efficacy Score, Verified Node

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

- `src/content/tooltips.ts` (New - Tooltip registry)
- `src/components/clinical/InteractionChecker.tsx` (Add tooltips)
- `src/pages/ImportLegacy.tsx` (Add tooltips)
- `src/components/science/ReagentCamera.tsx` (Add tooltips)
- `src/components/session/MusicLogger.tsx` (Add tooltips)
- `src/pages/SearchPortal.tsx` (Add tooltips)

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Modify the tooltip text (it's already written)
- Change the tone or reading level

**MUST:**
- Use existing AdvancedTooltip component
- Maintain consistency

---

## ✅ Acceptance Criteria

- [ ] Tooltip content converted to data structure
- [ ] Tooltips added to Safety Shield features
- [ ] Tooltips added to Legacy Importer
- [ ] Tooltips added to Reagent Eye
- [ ] Tooltips added to Trial Matchmaker
- [ ] Tooltips added to Music Logger
- [ ] Tooltips added to Research Dashboard
- [ ] All tooltips use AdvancedTooltip component

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- Tooltips must be keyboard accessible
- ARIA labels properly set

---

## 🚦 Status

**INBOX** - Awaiting LEAD architectural review

---

## 📋 Technical Specifications

### Tooltip Data Structure
```typescript
export const tooltips = {
  safetyShield: {
    interactionCheck: "We scan this combination against the FDA database to check for dangerous reactions.",
    mechanism: "The biological reason why these two drugs clash (e.g., they both compete for the same receptor).",
    severityScore: "Red = High Risk (Stop). Yellow = Caution (Monitor closely)."
  },
  // ... more sections
};
```

## LEAD ARCHITECTURE

**Technical Strategy:**
Convert tooltip markdown content to TypeScript data structure and integrate with existing AdvancedTooltip component.

**Files to Touch:**
- `public/Tooltips.md` - Source content
- `src/content/tooltips.ts` - NEW: Tooltip registry
- `src/components/clinical/InteractionChecker.tsx` - Add tooltips
- `src/pages/ImportLegacy.tsx` - Add tooltips
- `src/components/science/ReagentCamera.tsx` - Add tooltips
- `src/components/session/MusicLogger.tsx` - Add tooltips
- `src/pages/SearchPortal.tsx` - Add tooltips

**Constraints:**
- MUST NOT modify tooltip text (already written)
- MUST use existing AdvancedTooltip component
- MUST maintain consistency across all components
- MUST ensure keyboard accessibility

**Recommended Approach:**
1. Create `src/content/tooltips.ts` with TypeScript interface
2. Convert markdown content to structured data
3. Import tooltip registry in each component
4. Wrap elements with AdvancedTooltip using content from registry
5. Verify ARIA labels are properly set

**Risk Mitigation:**
- Centralize tooltip content for easy updates
- Test keyboard accessibility
- Verify screen reader compatibility
