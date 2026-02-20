---
id: WO-229
status: 00_INBOX
owner: PENDING
priority: P2
failure_count: 0
repeat_request: false
created: 2026-02-19
---

# WO-229: Guided Tour — Step 2 Broken (Wellness Journey anchor missing)

## User Prompt (verbatim)
"Step 2 goes to the middle of the page because the wellness journey link was removed from the sidebar, so step two points to nothing."

## Status
⚠️ LIKELY AUTO-RESOLVED — The Wellness Journey link was restored to the sidebar in this session (commit 85506ed). The tour step points to `data-tour="nav-wellness-journey"` which is now present in the sidebar again.

## Verification Required
- [ ] Open app, trigger guided tour, confirm Step 2 correctly highlights the Wellness Journey sidebar link
- [ ] If still broken, check `TopHeader.tsx` tour step configuration for step 2 target selector

## LEAD NOTES
Assign to BUILDER to verify in-browser. Low effort — may already be resolved.
