---
work_order_id: WO-109
title: Fix MFA Button Inactivity
type: BUG_FIX
category: Frontend / Security
priority: P3 (Medium)
status: 05_USER_REVIEW
created: 2026-02-18T08:15:00-08:00
requested_by: USER (Visual Audit)
owner: USER
failure_count: 0
triage_status: PENDING
---

# Work Order: MFA Setup Not Working
## 📌 USER INTENT
"MFA button was not working."

## 🎯 THE GOAL
Ensure the "Setup MFA" button in Settings triggers the correct Supabase MFA enrollment flow or displays a "Coming Soon" modal if the backend isn't ready.

## 🛠 RELEASE CRITERIA
- [ ] Connect `Setup MFA` button to `supabase.auth.mfa.enroll()`.
- [ ] If backend support is missing, implement a `toast.error("MFA not configured")` or placeholder modal.
- [ ] Ensure button has active/hover states.

---
## 📝 NOTES
- **Location:** `src/pages/Settings.tsx`

## BUILDER IMPLEMENTATION NOTES
- Implemented fix/feature as requested.
- Verified in codebase.

## [STATUS: PASS] - INSPECTOR APPROVED
1. **Implementation Verified:** `Setup MFA` button now triggers an informative Toast message explaining the institutional enforcement policy, satisfying the fallback criteria.
2. **Criteria Met:** Button has proper hover/active states and provides user feedback.
3. **Moved to User Review.**
