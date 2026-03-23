---
id: WO-654-B
title: "Add Operator Notification to send-waitlist-welcome Edge Function"
parent: WO-654
owner: BUILDER
status: 03_BUILD
authored_by: LEAD
routed_by: LEAD
priority: P0
created: 2026-03-22
growth_order_ref: "GO-651 (fast-lane P0 exception — operator notification is backend-only, no public-facing UX change)"
depends_on: "WO-636 (confirmed in 04_QA — cleared)"
admin_visibility: "no"
parked_context: ""
target_ship: "2026-03-25"
skills:
  - ".agent/skills/frontend-best-practices/SKILL.md"
failure_count: 0
---

# WO-654-B — Operator Notification on Waitlist Signup

## LEAD Architecture Note

> **TABLE MISMATCH FLAG — BUILDER MUST RESOLVE BEFORE TOUCHING CODE:**
>
> `send-waitlist-welcome/index.ts` line 2 states the webhook fires on **`academy_waitlist`**. But WO-654 Sub-ticket B references **`log_waitlist`** as the signup table. BUILDER must determine which table `Waitlist.tsx` actually inserts into (check `src/pages/Waitlist.tsx` insert call) and confirm it matches what the DB webhook targets. If the tables differ, this must be flagged to LEAD before proceeding.
>
> **OPERATOR EMAIL ADDRESS — CONFIRMED:** Use `signups@ppnportal.net` per WO-654 §Open Questions resolution. Do NOT use `info@ppnportal.net`.
>
> This ticket is backend-only. No UI changes. GO-651 visual review is not required for this sub-ticket.

---

## Context

When a practitioner signs up on `/waitlist`, `send-waitlist-welcome` fires (via DB webhook) and emails the visitor. Trevor/Jason receive zero notification. This is a blind spot — no operator awareness of new signups.

---

## Acceptance Criteria

- [ ] After visitor Email 1 sends successfully, a second Resend email fires to `signups@ppnportal.net`
- [ ] Operator email subject: `[PPN Waitlist] New signup: {first_name} {last_name} — {practitioner_type}`
- [ ] Operator email body (plain-text sufficient — no styled HTML required):
  ```
  New PPN waitlist signup:
  Name: {first_name} {last_name}
  Email: {email}
  Type: {practitioner_type}
  Source: {source}
  Signed up: {timestamp (ISO 8601)}
  ```
- [ ] Failure of the operator notification DOES NOT affect visitor success state — caught silently with `console.warn`
- [ ] If `practitioner_type` is not in the webhook `record`, log `"Unknown"` — never throw
- [ ] Verified via manual test signup: operator email arrives within 60 seconds
- [ ] `npm run build` on the Supabase Functions project passes (if applicable)

---

## Files

| File | Action | FREEZE status |
|---|---|---|
| `supabase/functions/send-waitlist-welcome/index.ts` | **[MODIFY]** Add operator notification after line 67 | Not frozen |

---

## Implementation

### Step 1 — Resolve table mismatch

Check `src/pages/Waitlist.tsx`:
- Find the `supabase.from(...)` insert call
- Note the exact table name
- Confirm it matches `academy_waitlist` (the table in the edge function header)
- Log finding in `builder_notes` frontmatter before writing any code

### Step 2 — Add operator notification

After the existing `console.log` on line 67 of `index.ts` (`Email 1 delivered to ${email}`), add:

```typescript
// ── Send Operator Notification (fire-and-forget) ─────────────────────────
const practitionerType = record.practitioner_type ?? 'Unknown';
const fullName = `${record.first_name ?? ''} ${record.last_name ?? ''}`.trim() || 'Unknown';
const signupTime = new Date().toISOString();

fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: FROM_EMAIL,
    to: 'signups@ppnportal.net',
    subject: `[PPN Waitlist] New signup: ${fullName} — ${practitionerType}`,
    text: `New PPN waitlist signup:\n\nName: ${fullName}\nEmail: ${email}\nType: ${practitionerType}\nSource: ${source}\nSigned up: ${signupTime}`,
    reply_to: REPLY_TO,
  }),
}).catch((opErr) => console.warn('[send-waitlist-welcome] Operator notify failed:', opErr));
```

### Step 3 — WaitlistModal.tsx check

Per WO-654 PRD: "Apply the identical pattern to `WaitlistModal.tsx` edge function call if it fires independently." BUILDER must:
1. Check `src/components/modals/WaitlistModal.tsx` — does it invoke `send-waitlist-welcome` directly via `supabase.functions.invoke`, OR does it also do a `log_waitlist`/`academy_waitlist` insert that triggers the DB webhook?
2. If it invokes the function directly, the operator notification is handled by the edge function above (no code change needed in the modal).
3. If it does NOT invoke the function (insert-only), the DB webhook handles it — also no modal change needed.
4. Log the finding in `builder_notes`.

---

## Do NOT Touch

- The visitor email body or subject — surgical scope only
- `VALID_SOURCES` array — no changes to source handling
- `FROM_EMAIL` or `REPLY_TO` constants
- Any file outside `supabase/functions/send-waitlist-welcome/index.ts`

---

## INSPECTOR QA

- [ ] Submit test signup → operator notification arrives at `trevor@ppnportal.net` within 60s
- [ ] Operator email subject contains `[PPN Waitlist] New signup: {name} — {type}`
- [ ] Visitor still receives their confirmation email (regression check)
- [ ] Visitor success state not affected if operator notify fails
- [ ] BUILDER's `builder_notes` documents table mismatch finding
- [ ] BUILDER's `builder_notes` documents WaitlistModal.tsx finding
