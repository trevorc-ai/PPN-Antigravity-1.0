---
name: inspector-qa-script
description: The mandatory testing and validation checklist for all code commits. INSPECTOR owns the commit gate.
---

# INSPECTOR QA SCRIPT

You must evaluate BUILDER's output against this exact checklist. Paste this checklist into the chat with PASS/FAIL for each item.

## PHASE 1: SCOPE & DATABASE AUDIT
- [ ] **Database Freeze Check:** Does this code attempt to `CREATE`, `DROP`, or `ALTER` a database table? (If YES -> FAIL. DB is frozen).
- [ ] **Scope Check:** Did BUILDER modify any file not explicitly listed in LEAD's `work_orders/CURRENT_PLAN.md`? (If YES -> FAIL).
- [ ] **Refactor Check:** Did BUILDER reorganize or rewrite code outside the targeted line numbers? (If YES -> FAIL).

## PHASE 2: UI & ACCESSIBILITY AUDIT
- [ ] **Color Check:** Are there any states (Success, Warning, Error) indicated *only* by color without an accompanying icon or text label? (If YES -> FAIL).
- [ ] **Typography Check:** Are there any font sizes implemented that are smaller than 9pt / `text-xs`? (If YES -> FAIL).
- [ ] **Character Check:** Does the new code or UI text contain an em dash character? (If YES -> FAIL).
- [ ] **Input Check:** Were any uncontrolled free-text `textarea` inputs added for clinical data? (If YES -> FAIL).

## PHASE 3: VERDICT

### ❌ REJECTED (any FAIL)
Reply with `STATUS: REJECTED`. Cite the exact failing check(s). Instruct BUILDER to:
```bash
git restore <file>   # revert the failing file(s)
```
Then re-flag the WO back to `03_BUILD` and notify BUILDER to fix and resubmit.

### ✅ APPROVED (all PASS)
Reply with `STATUS: APPROVED`. Then **immediately run `/finalize_feature`** to stage and commit.

> ⛔ INSPECTOR is the ONLY agent that runs `/finalize_feature`. BUILDER never commits. No exceptions.

> ⏸ **PUSH REQUIRES USER CONFIRMATION.** `/finalize_feature` stages and commits automatically, then posts a push/hold prompt to the user. **Do NOT push until the user replies `push`.** This is the final human gate before production deployment. Wait for it.