---
work_order_id: WO-108
title: Fix High Contrast Font Strain
type: BUG_FIX
category: Frontend / Accessibility
priority: P3 (Medium)
status: 00_INBOX
created: 2026-02-18T08:10:00-08:00
requested_by: USER (Privacy Audit)
owner: LEAD
failure_count: 0
triage_status: PENDING
---

# Work Order: Reduce Font Strain
## 📌 USER INTENT
"Notice the font color violations with the bright white text, causing high strain."

## 🎯 THE GOAL
Soften the text colors in `Settings.tsx` (and globally if needed) to avoid pure white on dark backgrounds.

## 🛠 RELEASE CRITERIA
- [ ] Replace `text-white` or `text-slate-50` with `text-slate-200` or `text-gray-300` in Settings.
- [ ] Audit global CSS variables for high contrast violations.

---
## 📝 NOTES
- **Location:** `src/pages/Settings.tsx`
