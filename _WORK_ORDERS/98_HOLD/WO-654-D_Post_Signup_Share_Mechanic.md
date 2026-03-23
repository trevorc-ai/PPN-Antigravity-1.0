---
id: WO-654-D
title: "Post-Signup Share/Referral Mechanic on Waitlist Success Screen"
parent: WO-654
owner: BUILDER
status: 98_HOLD
authored_by: LEAD
routed_by: LEAD
priority: P1
created: 2026-03-22
growth_order_ref: "GO-651"
hold_reason: "Awaiting GO-651 04_VISUAL_REVIEW — MARKETER must approve mailto subject/body copy before BUILDER implements"
held_at: "2026-03-22"
depends_on: "WO-636 (confirmed in 04_QA — cleared)"
admin_visibility: "no"
parked_context: "Release to 03_BUILD once GO-651 reaches 04_VISUAL_REVIEW and MARKETER provides approved mailto subject + body copy. Add the approved copy to this ticket before routing."
target_ship: "2026-04-01"
skills:
  - ".agent/skills/frontend-best-practices/SKILL.md"
  - ".agent/skills/ppn-ui-standards/SKILL.md"
  - ".agent/skills/frontend-surgical-standards/SKILL.md"
failure_count: 0
---

# WO-654-D — Post-Signup Share/Referral Mechanic

## 🚫 HOLD — DO NOT BUILD

**HOLD REASON:** The pre-filled `mailto:` subject and body copy must be approved by MARKETER via GO-651 before BUILDER implements. The copy must go through brand review. This ticket releases to `03_BUILD` when GO-651 is approved and copy is inserted below.

---

## MARKETER COPY INSERT (to be filled before routing to BUILD)

```
Approved mailto subject: [INSERT AFTER GO-651 APPROVAL]
Approved mailto body: [INSERT AFTER GO-651 APPROVAL]
```

---

## Context

Sub-ticket D of WO-654: on the success screen (after `status === 'success'`), add a "Share with a colleague" section below the existing "What happens next" card. Pure client-side mechanics — no third-party referral SaaS.

---

## Acceptance Criteria

- [ ] Share section renders ONLY when `status === 'success'` — never on idle/loading/error/duplicate
- [ ] Three action buttons:
  1. **Copy link** — copies `https://ppnportal.net/waitlist` to clipboard, shows toast: "Link copied!"
  2. **Share via email** — `mailto:` link with pre-filled subject and body (copy from MARKETER approval above)
  3. **Copy to clipboard** — copies a pre-formatted referral blurb to clipboard, shows toast: "Copied!"
- [ ] Toast confirms on copy — use existing toast/notification pattern in codebase (do not introduce new toast library)
- [ ] No third-party library additions — pure `navigator.clipboard.writeText` + `a href=mailto:`
- [ ] No regression to success state layout — share section appended below, not replacing existing content

---

## Files

| File | Action | FREEZE status |
|---|---|---|
| `src/pages/Waitlist.tsx` | **[MODIFY]** Add share section to success JSX block | Not frozen |

---

## Do NOT Touch

- The success card headline/body copy
- The idle/loading form state
- WaitlistModal.tsx
- Any global CSS

---

## INSPECTOR QA

- [ ] Share section visible on success state, invisible on all other states
- [ ] Copy link toast fires on click
- [ ] mailto link opens with pre-filled subject + body (verify against approved copy)
- [ ] No third-party packages added (check `package.json` diff)
- [ ] `npm run build` passes — zero TypeScript errors
