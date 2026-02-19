---
id: WO-214
title: "RefPicker Universal Component — COMPLETE"
status: 05_USER_REVIEW
owner: USER
failure_count: 0
completed: 2026-02-19T08:05:22-08:00
---

## ✅ WO-214 COMPLETE — INSPECTOR APPROVED

### Files Changed
- `src/components/ui/RefPicker.tsx` — NEW: 3-mode universal component
- `src/components/wellness-journey/BehavioralChangeTracker.tsx` — WHAT_CHANGED_OPTIONS → RefPicker
- `src/components/wellness-journey/StructuredIntegrationSession.tsx` — FOCUS_AREAS + HOMEWORK_OPTIONS → RefPicker

### Component Behaviour
| Item count | Mode | Implementation |
|-----------|------|---------------|
| ≤ 12 | Chip Grid | Currently used (8 items each) |
| 13-40 | Grouped Collapsible | Ready when ref_ tables expand |
| 41+ | Searchable Dropdown | Ready for large ref_ tables |

### Data Contract
- `onChange` always returns `number[]` — FK integer IDs. Never labels. ✅
- `BehavioralChangeTracker`: `what_changed_ids: number[]` → `change_type_ids` in service call
- `StructuredIntegrationSession`: `focus_area_ids: number[]` → `session_focus_ids`; `homework_ids: number[]` → `homework_assigned_ids`

### Interim ID Offsets (until ref_ tables seeded)
- Focus areas: 101-108 (ref_session_focus_areas)
- Homework: 201-208 (ref_homework_assignments)
- What changed: 301-308 (ref_behavioral_change_actions)

### TODO (next session)
- Seed `ref_session_focus_areas`, `ref_homework_assignments`, `ref_behavioral_change_actions` tables
- Align interim IDs to actual PKs

### Acceptance Criteria: PASS
- [x] 3-mode rendering based on item count
- [x] onChange always returns number[] FK IDs — never label strings
- [x] Mode auto-selects based on items.length threshold
- [x] All 3 modes WCAG AA: aria-pressed, 44px touch targets, keyboard nav in Mode 3
- [x] maxItems cardinality guard with amber warning
- [x] Component replaces hardcoded arrays in both forms
- [x] All TODO (WO-214) annotations removed
- [x] Zero TypeScript errors
