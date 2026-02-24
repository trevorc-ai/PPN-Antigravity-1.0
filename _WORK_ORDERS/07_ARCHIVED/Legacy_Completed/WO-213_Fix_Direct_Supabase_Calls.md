---
id: WO-213
title: "BUILDER: Fix Direct Supabase Calls — Route Through Service Layer"
status: 05_USER_REVIEW
owner: USER
priority: P0
created: 2026-02-19
completed: 2026-02-19
failure_count: 0
ref_tables_affected: log_behavioral_changes, log_integration_sessions
---

## COMPLETED ✅

Both forms now route through the service layer per Turning_Point.md architecture.

### Changes Made

**BehavioralChangeTracker.tsx**
- Removed: `import { supabase } from '../../supabaseClient'`
- Added: `import { createBehavioralChange } from '../../services/clinicalLog'`
- `handleSave` now calls `createBehavioralChange()` with full field mapping
- Maps `impact_on_wellbeing`, `confidence_sustaining`, `related_to_dosing` to structured columns

**StructuredIntegrationSession.tsx**  
- Removed: `import { supabase } from '../../supabaseClient'`
- Added: `import { createIntegrationSession } from '../../services/clinicalLog'`
- `handleSave` now calls `createIntegrationSession()` with structured rating fields
- **ELIMINATED**: `session_notes: JSON.stringify({...})` blob — free-text architecture violation removed
- **TODO**: `session_focus_ids[]` and `homework_assigned_ids[]` pending RefPicker (WO-214)

### What WO-214 (RefPicker) Will Complete
- Replace `focus_areas: string[]` with `session_focus_ids: number[]` FK IDs
- Replace `homework_assigned: string[]` with `homework_assigned_ids: number[]` FK IDs
