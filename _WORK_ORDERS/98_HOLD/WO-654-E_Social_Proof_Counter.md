---
id: WO-654-E
title: "Live Social Proof Counter on Waitlist Page"
parent: WO-654
owner: BUILDER
status: 98_HOLD
authored_by: LEAD
routed_by: LEAD
priority: P2
created: 2026-03-22
growth_order_ref: "GO-651"
hold_reason: "Awaiting GO-651 04_VISUAL_REVIEW + USER to confirm log_waitlist RLS permits anonymous SELECT COUNT(*)"
held_at: "2026-03-22"
depends_on: "WO-636 (confirmed in 04_QA — cleared)"
admin_visibility: "no"
parked_context: "Release to 03_BUILD once: (1) GO-651 reaches 04_VISUAL_REVIEW approval, (2) USER confirms or adds anonymous SELECT COUNT(*) RLS policy on log_waitlist. Update this ticket with USER confirmation before routing."
target_ship: "2026-04-01"
skills:
  - ".agent/skills/frontend-best-practices/SKILL.md"
  - ".agent/skills/ppn-ui-standards/SKILL.md"
  - ".agent/skills/frontend-surgical-standards/SKILL.md"
failure_count: 0
---

# WO-654-E — Live Social Proof Counter

## 🚫 HOLD — DO NOT BUILD

**HOLD REASON (dual gate):**
1. **GO-651 visual review** — public-facing UI change on `/waitlist`
2. **RLS confirmation needed** — The count query runs as an anonymous/unauthenticated Supabase client. USER must confirm that `log_waitlist` has an RLS policy permitting `anon` role `SELECT COUNT(*)`. If not, USER must add one via Supabase dashboard before BUILDER can implement.

---

## USER Confirmation INSERT (fill before routing to BUILD)

```
RLS policy status: [CONFIRMED / NEEDS MIGRATION]
Migration ticket: [WO-XXX if applicable, else "Not required"]
Confirmed by: [USER] on [DATE]
```

---

## Context

Sub-ticket E of WO-654: display a trust signal in the left column of `Waitlist.tsx` showing the live count of practitioners on the waitlist. Display only if count ≥ 10. Cache with 60-second client-side TTL.

---

## Acceptance Criteria

- [ ] On mount, `Waitlist.tsx` fetches `SELECT COUNT(*) FROM log_waitlist` using the existing anon Supabase client
- [ ] Count cached in component state with 60-second TTL (simple `Date.now()` delta check — no external caching library)
- [ ] If count ≥ 10: renders `{count}+ practitioners already on the list` in left column above value-props
- [ ] If count < 10 OR fetch fails: renders nothing (graceful degradation — never shows "3 practitioners")
- [ ] Display position: left column, below subheadline, above video (Sub-ticket C) or above value-props if C not shipped
- [ ] Style: `text-sm font-semibold text-clinical-green` or `text-emerald-400` (MARKETER to confirm via GO-651)
- [ ] Fetch failure is caught silently — never blocks form render

---

## ⚠️ LEAD Notes for USER (Supabase Dashboard Action)

Per WO-654 §Open Questions #5:
> "The `log_waitlist` count query will run as an anonymous/unauthenticated Supabase client. USER must confirm the existing RLS policy on `log_waitlist` permits anonymous `SELECT COUNT(*)`, or add a scoped read policy before BUILDER implements the counter."

USER: before this ticket moves to BUILD, please verify in Supabase dashboard → Authentication → Policies → `log_waitlist`. If no anon SELECT policy exists, create one scoped to COUNT only (no column-level data exposure).

---

## ⚠️ Table Name Discrepancy — USER Must Confirm

WO-654 refers to `log_waitlist`. The edge function (`send-waitlist-welcome`) references `academy_waitlist`. BUILDER uncovering this in WO-654-B must log which table `Waitlist.tsx` actually inserts into. **This ticket cannot proceed until Sub-ticket B `builder_notes` confirms the correct table name.** Update this ticket with the correct table name when known.

---

## Files

| File | Action | FREEZE status |
|---|---|---|
| `src/pages/Waitlist.tsx` | **[MODIFY]** Add count fetch + conditional render in left column | Not frozen |

---

## Do NOT Touch

- `log_waitlist` schema — no column additions or changes
- Any global Supabase client config
- WaitlistModal.tsx

---

## INSPECTOR QA

- [ ] Counter renders when count ≥ 10 (test with seeded data or mocked return)
- [ ] Counter does NOT render when count < 10
- [ ] Fetch failure degrades gracefully (no error state shown)
- [ ] 60-second TTL verified (mock 2 renders < 60s apart — confirm no re-fetch)
- [ ] Anon RLS policy confirmed before shipping
- [ ] `npm run build` passes — zero TypeScript errors
