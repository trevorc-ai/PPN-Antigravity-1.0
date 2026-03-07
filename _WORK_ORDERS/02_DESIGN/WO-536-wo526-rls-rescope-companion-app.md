---
id: WO-536
title: WO-526 Rescope — Companion App Anon Insert Is Intentional; Two-Tier RLS Policy Required
owner: LEAD
status: 02_DESIGN
filed_by: INSPECTOR
date: 2026-03-03
priority: P1
supersedes: WO-526
table: log_session_timeline_events
---

## INSPECTOR Design Finding

> **Work Order:** WO-536 — RLS Policy Rescope: Two-Tier Insert Policy for Practitioners + Companion App
> **Filed by:** INSPECTOR (sourced from USER design clarification, 2026-03-03)
> **Priority:** P1

---

### Background

WO-526 proposed tightening the `INSERT` policy on `log_session_timeline_events` from `public` role to `authenticated` role + site membership in `log_user_sites`. This SQL was NOT applied.

---

### New Constraint Identified

The USER confirmed on 2026-03-03 that the `public` INSERT policy on `log_session_timeline_events` is **intentional** for the Companion App use case:

> "We set up the patient companion app (the one with the spherecules video) specifically so that the patient could tap the buttons below the spherecules video and log how they're feeling without the need for the practitioner to intervene and ask verbally. So that policy was changed intentionally."

The Companion App runs on the patient's device with NO Supabase auth session (anon key only). BUG-529-06 (now fixed) adds a `createTimelineEvent()` call from the Companion overlay. If WO-526 is applied as written, it will **immediately break BUG-529-06** — all companion feeling taps will be rejected by the RLS policy with a silent 403.

---

### Required Rescope

WO-526's single-tier policy must be replaced with a **two-tier approach**:

**Tier 1 — Authenticated practitioners (site-scoped):**
- Same as WO-526's proposed policy: requires `authenticated` role + `log_user_sites` membership at the session's site
- Covers: all practitioner-initiated writes (Quick Keys, buttons, form saves)

**Tier 2 — Companion App (session-token-scoped):**
- Allows `anon` role inserts
- Scoped to a valid `session_id` that exists in `log_clinical_records` with a matching companion access token
- OR: accept any anon insert with a valid `session_id` FK (lower security, simpler)
- LEAD must decide the scoping approach before SOOP writes any SQL

---

### Open Questions for LEAD

1. What is the companion app's session validation mechanism? Is there a token passed in the request, or does it write using only the `session_id`?
2. Should anon companion writes be scoped to: (a) any valid `session_id` in `log_clinical_records`, (b) sessions with `is_active = true` only, or (c) sessions with a companion-specific access token?
3. Should `performed_by` be nullable for companion writes (it currently passes `undefined`)? Or should we insert a sentinel value (e.g., `'companion'` stored as text in a separate column)?

---

### Status Note

WO-526 is in `98_HOLD`. This WO supersedes it. WO-526 must NOT be applied until WO-536's design questions are resolved and INSPECTOR signs off on the new two-tier SQL.
