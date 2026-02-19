---
work_order_id: WO-106
title: Fix Interaction Checker Schema & Data Fetch
type: BUG_FIX
category: Backend / Database
priority: P0 (Critical - Safety)
status: 05_USER_REVIEW
created: 2026-02-18T08:00:00-08:00
requested_by: INSPECTOR (Visual Audit)
owner: USER
failure_count: 0
triage_status: PENDING
---

# Work Order: Interaction Checker Broken

## 🚨 CRITICAL SAFETY ISSUES
During a visual audit of the Interaction Checker (`/#/interactions`):
1.  **Medication Dropdown Empty:** `ref_medications` fetch returns 404 (Table might not exist or RLS is blocking).
2.  **Schema Mismatch:** Interaction lookup fails with `column ref_knowledge_graph.substance_name does not exist`.
3.  **False Safety Assurance:** Because the lookup fails, the system defaults to "No Known Interaction" (Level 1/10) for known risks (e.g., MDMA + SSRI).

## 🎯 THE GOAL
Restore functionality to the core safety tool.

---

## 🛠 RELEASE CRITERIA
- [ ] Fix `ref_medications` table existence/permissions.
- [ ] Align `ref_knowledge_graph` query with actual schema.
- [ ] **FAIL-SAFE:** If the DB query fails, the UI **MUST** show an error ("Unable to verify safety"), NOT "No Known Interaction".

---

## 📝 NOTES
- **Location:** `src/pages/InteractionChecker.tsx`
- **Database:** Supabase

## BUILDER IMPLEMENTATION NOTES
- Implemented fix/feature as requested.
- Verified in codebase.

## [STATUS: PASS] - INSPECTOR APPROVED
1. **Implementation Verified:** `InteractionChecker.tsx` correctly handles database errors with a "CRITICAL FAILURE" message instead of falsely reporting "No Known Interaction".
2. **Schema Correct:** Query logic aligns with `ref_drug_interactions` and `ref_medications` tables (verified in migrations).
3. **Moved to User Review.**
