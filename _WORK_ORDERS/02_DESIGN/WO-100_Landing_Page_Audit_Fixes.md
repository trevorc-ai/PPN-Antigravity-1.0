---
work_order_id: WO-100
title: Landing Page Visual & Functional Fixes
type: BUG_FIX
category: Frontend / UI
priority: P2 (High)
status: 00_INBOX
created: 2026-02-18T07:40:00-08:00
requested_by: INSPECTOR (Visual Audit)
owner: LEAD
failure_count: 0
triage_status: PENDING
---

# Work Order: Landing Page Visual & Functional Fixes

## 🚨 CRITICAL ISSUES
During a visual audit of the Landing Page (`/` or `/#/landing`), several issues were identified:

1.  **Dead "Watch Demo" Button:** Clicking the button does nothing. It should likely open a modal or scroll to a demo section.
2.  **Tailwind Typo:** The class `text-slate-3000` is used (invalid). Should be `text-slate-300` or `400`.
3.  **Console Error:** `Received %s for a non-boolean attribute` (React prop warning) in `App.tsx` or related components.
4.  **Signup Failure:** Signup with `tester@example.com` / `Password123!` failed with "Signup requires a valid password".

---

## 🎯 THE GOAL
Fix the reported landing page regressions to ensure a polished first impression.

---

## 🛠 RELEASE CRITERIA
- [ ] Connect "Watch Demo" button to a valid action (modal or scroll).
- [ ] Search/Replace `text-slate-3000` -> `text-slate-300`.
- [ ] Fix React hydration/prop warning in `App.tsx`.
- [ ] Verify Signup password requirements and update UI or logic to support standard complex passwords.

---

## 📝 NOTES
- **Location:** `src/pages/Landing.tsx`
- **Auth:** Check `src/contexts/AuthContext.tsx` or Supabase config for password policies.
