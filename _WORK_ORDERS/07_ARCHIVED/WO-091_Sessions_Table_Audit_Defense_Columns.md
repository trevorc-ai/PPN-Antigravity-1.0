---
id: WO-091
title: "Sessions Table — Audit Defense Columns (Additive Extension to log_sm_sessions)"
status: 03_BUILD
owner: SOOP
ticket_type: EVALUATION (not a direct build order)
priority: P2 (High)
category: Database / Privacy / Audit Defense / Grey Market
failure_count: 0
created_date: 2026-02-17T18:52:36-08:00
estimated_complexity: 4/10
source: gemini_recommendation
proddy_validation_required: true
strategic_alignment: Grey Market "Phantom Shield" — Audit Defense
requested_by: PPN Admin
related_tickets:
  - WO_002 (06_COMPLETE — Shadow Market Schema, log_sm_sessions DEPLOYED)
  - WO-090 (01_TRIAGE — Clients Table Ghost Record, EVALUATION)
  - WO-088 (01_TRIAGE — Duress Mode Fake PIN, EVALUATION)
---

# User Request (Verbatim)

> 2. Sessions Table ("Audit Defense" Log)
> This proves process without revealing content.

```sql
CREATE TABLE sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practitioner_id UUID REFERENCES practitioners(id),
    client_id UUID REFERENCES clients(client_id),
    jurisdiction_code VARCHAR(10), 
    protocol_id UUID REFERENCES protocols(id),
    screening_completed BOOLEAN DEFAULT FALSE,
    contraindications_checked BOOLEAN DEFAULT FALSE,
    informed_consent_signed BOOLEAN DEFAULT FALSE,
    is_duress_record BOOLEAN DEFAULT FALSE,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE
);
```

---

## ⚠️ LEAD Duplicate Analysis — READ FIRST

**~70% of this schema is already DEPLOYED** in `public.log_sm_sessions` (migration 022, WO_002 COMPLETE).

### Column-by-Column Comparison

| Proposed Column | Status in `log_sm_sessions` | Notes |
|---|---|---|
| `session_id UUID PK` | ✅ `id UUID PK` | Deployed — different name only |
| `practitioner_id` → `practitioners(id)` | ⚠️ `user_id` → `auth.users(id)` | Deployed — FK to auth.users, not a practitioners table |
| `client_id` → `clients(client_id)` | ⚠️ `client_blind_hash TEXT` | Deployed as hash — FK upgrade depends on WO-090 approval |
| `jurisdiction_code VARCHAR(10)` | ✅ `jurisdiction_code INTEGER` | **Deployed** — type mismatch (INTEGER vs VARCHAR) |
| `protocol_id UUID` | ✅ `protocol_id UUID` | **Deployed** — exact match |
| `is_duress_record BOOLEAN` | ✅ `is_duress_mode BOOLEAN` | **Deployed** — same concept, different name |
| `start_time TIMESTAMPTZ` | ✅ `start_time TIMESTAMPTZ` | **Deployed** — exact match |
| `end_time TIMESTAMPTZ` | ✅ `end_time TIMESTAMPTZ` | **Deployed** — exact match |
| `screening_completed BOOLEAN` | ❌ **MISSING** | **Net-new value** |
| `contraindications_checked BOOLEAN` | ❌ **MISSING** | **Net-new value** |
| `informed_consent_signed BOOLEAN` | ❌ **MISSING** | **Net-new value** |
| "Canary" alert behavior on duress | ❌ **MISSING** | `is_duress_mode` exists but no server-side canary logic |

### What This Ticket Is Actually About

The real net-new value in this proposal is **3 audit defense boolean columns** and **canary alert behavior**:

1. `screening_completed BOOLEAN` — Proves pre-session screening was done
2. `contraindications_checked BOOLEAN` — Proves contraindications were reviewed
3. `informed_consent_signed BOOLEAN` — Proves consent was obtained (with timestamp)
4. **Canary alert:** When `is_duress_mode = TRUE`, server silently logs a "canary" alert (e.g., sends a webhook to a trusted contact) while displaying dummy data to the coercing party

---

## Strategic Context

The "Audit Defense" framing is the key insight: these boolean flags don't store *what* happened — they prove *that* a process was followed. In a legal context:

> "Did you screen this client before the session?"
> → `screening_completed = TRUE`, timestamp: Jan 15, 2026 09:30 UTC
> → "Yes, and here's the cryptographic proof."

This is the **process paper trail** that complements the **event paper trail** in the Crisis Logger (WO-060).

---

## Proposed Additive Migration (If Approved)

Per the **additive-only database rule**, this would be an `ALTER TABLE` — NOT a new `CREATE TABLE`:

```sql
-- Additive extension to existing log_sm_sessions
-- DO NOT create a new sessions table — log_sm_sessions already exists

ALTER TABLE public.log_sm_sessions
    ADD COLUMN IF NOT EXISTS screening_completed BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS contraindications_checked BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS informed_consent_signed BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS informed_consent_signed_at TIMESTAMPTZ; -- Timestamp of consent

COMMENT ON COLUMN public.log_sm_sessions.screening_completed 
    IS 'Audit defense: Proves pre-session mental health screening was completed';
COMMENT ON COLUMN public.log_sm_sessions.contraindications_checked 
    IS 'Audit defense: Proves contraindications were reviewed before session';
COMMENT ON COLUMN public.log_sm_sessions.informed_consent_signed 
    IS 'Audit defense: Proves informed consent was obtained';
COMMENT ON COLUMN public.log_sm_sessions.informed_consent_signed_at 
    IS 'Audit defense: UTC timestamp of consent signature';
```

### Canary Alert Logic (Edge Function)

```typescript
// Triggered when is_duress_mode is set to TRUE on a session
// Silently notifies a pre-configured trusted contact

Deno.serve(async (req) => {
  const { session_id, practitioner_id } = await req.json();
  
  // Get practitioner's emergency contact (from user_profiles)
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('emergency_contact_email, emergency_contact_phone')
    .eq('user_id', practitioner_id)
    .single();

  if (profile?.emergency_contact_email) {
    // Send silent canary alert — no UI confirmation shown to user
    await sendEmail({
      to: profile.emergency_contact_email,
      subject: "⚠️ PPN Safety Alert",
      body: `A safety alert was triggered at ${new Date().toISOString()}. 
             If you are not aware of this, please check on the practitioner.`
    });
  }
  
  // Log canary event server-side (not visible in app)
  await supabase.from('canary_alerts').insert({
    session_id,
    triggered_at: new Date().toISOString(),
    // No practitioner identity stored — just the session
  });
});
```

---

## Key Questions for PRODDY

1. **New table vs. additive columns:** The user proposed `CREATE TABLE sessions` — but `log_sm_sessions` already exists. PRODDY must decide: extend the existing table (additive, safe) or create a parallel table (risky, creates confusion)?
2. **`practitioners` table dependency:** The proposal references `practitioners(id)` — this table does not exist. Current schema uses `auth.users`. Does PRODDY want to create a `practitioners` profile table?
3. **`clients` table dependency:** `client_id UUID REFERENCES clients(client_id)` depends on WO-090 being approved and built first.
4. **Canary alert UX:** Who configures the emergency contact? Where in the app? This needs a settings UI.
5. **`jurisdiction_code` type conflict:** Existing column is `INTEGER`, proposal uses `VARCHAR(10)`. Cannot change type in place (additive-only rule). PRODDY must decide if this matters.
6. **Arc of Care overlap:** `screening_completed`, `contraindications_checked`, and `informed_consent_signed` may already be tracked in the Arc of Care schema (migration 050). SOOP should cross-check before any migration is written.

---

## Acceptance Criteria (If Approved)

- [ ] `screening_completed`, `contraindications_checked`, `informed_consent_signed`, `informed_consent_signed_at` added to `log_sm_sessions` (additive only)
- [ ] Canary alert Edge Function created and triggered on `is_duress_mode = TRUE`
- [ ] Emergency contact configuration added to user settings UI
- [ ] RLS policies unchanged (additive columns inherit existing policies)
- [ ] No new `sessions` table created (would conflict with existing `log_sm_sessions`)

---

## 🚦 Status

**01_TRIAGE → PRODDY** — Evaluation ticket. PRODDY to assess:
1. Whether to extend `log_sm_sessions` (recommended) or create a new table (not recommended)
2. Dependency chain: WO-090 (clients table) must be approved first if `client_id` FK is desired
3. Whether Arc of Care schema (migration 050) already tracks the 3 boolean flags
4. Canary alert UX and emergency contact configuration scope

May not proceed to BUILD without PRODDY sign-off.

---

## 📣 PRODDY STRATEGIC EVALUATION — COMPLETE (2026-02-18 00:09 PST)

### VERDICT: ✅ APPROVED — Extend `log_sm_sessions`, Defer Canary Alert

**1. Extend vs. New Table:** EXTEND `log_sm_sessions` via `ALTER TABLE`. Do NOT create a new `sessions` table. The existing table is deployed and working. Creating a parallel table would create confusion and violate the additive-only rule's spirit.

**2. The 3 Audit Defense Columns:** ✅ APPROVED immediately. These are low-risk, high-value additions:
- `screening_completed BOOLEAN`
- `contraindications_checked BOOLEAN`
- `informed_consent_signed BOOLEAN`
- `informed_consent_signed_at TIMESTAMPTZ`

**3. Arc of Care Overlap Check:** SOOP must cross-check migration 050 (Arc of Care schema) before writing this migration. If these booleans already exist in the Arc of Care schema, do NOT duplicate them — instead create a view or FK reference.

**4. Canary Alert:** ⚠️ DEFER to Phase 2. The canary alert requires:
- Emergency contact settings UI (new BUILDER ticket)
- Edge Function for silent webhook (new SOOP ticket)
- Legal review (does a silent alert create liability?)
This is too complex for the current sprint. Ship the 3 boolean columns now, canary in Phase 2.

**5. `practitioners` table dependency:** Same as WO-090 — SOOP must verify this table exists before writing the FK reference.

**6. `jurisdiction_code` type conflict:** Leave as-is. The existing `INTEGER` column is deployed. Do not attempt to change it. The VARCHAR proposal is a future enhancement.

**PRODDY SIGN-OFF:** ✅ Approved for 3 boolean columns only. Canary deferred. Route to SOOP.

**Routing:** `owner: LEAD` — route to SOOP. Dependency: WO-090 must be approved first if `client_id` FK is desired.
