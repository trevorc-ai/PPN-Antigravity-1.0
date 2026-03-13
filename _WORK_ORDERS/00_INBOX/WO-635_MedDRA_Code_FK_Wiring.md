# WO-635 — MedDRA Code: Wire FK from Free-Text Input to `ref_meddra_codes` Lookup

**Status:** 00_INBOX
**Priority:** P2 — LOW (completeness; AE Report form still functional without it)
**Author:** INSPECTOR → SOOP + BUILDER
**Date:** 2026-03-13
**Depends on:** None

---

## Background

The Adverse Event (AE) Report section of `SafetyAndAdverseEventForm.tsx` captures a free-text MedDRA code (e.g. `10047700`). This value is currently stored in component state as `data.meddra_code` (a raw string), but it is **never written to the database** because:

1. `log_safety_events` stores a foreign key `meddra_code_id` (integer) pointing to a `ref_meddra_codes` reference table.
2. `WellnessFormRouter.handleSafetyEventSave` does not pass `meddra_code_id` to `createSessionEvent()` — the code comment explicitly acknowledges this gap:

```typescript
// meddra_code_id / intervention_type_id require live ref table lookups:
// The form stores display strings (data.meddra_code is text, data.intervention_type is text).
// clinicalLog.ts resolves string→id for event_type; intervention/meddra use IDs directly.
// These remain null until the form is upgraded to emit FK IDs.
```

3. As a result, every AE Report saved to `log_safety_events` has `meddra_code_id = NULL` even when the practitioner entered a MedDRA code.
4. The code does **not** appear in the Live Session Timeline ledger entry either (since `handleSafetyEventSave` cannot pass it without a resolved ID).

---

## Scope

### Sub-task A — SOOP: Verify/create `ref_meddra_codes` table

Confirm the table `ref_meddra_codes` exists with at minimum:

```sql
id             integer PRIMARY KEY,
meddra_code    varchar  UNIQUE NOT NULL,  -- e.g. '10047700'
preferred_term varchar  NOT NULL,          -- e.g. 'Vomiting'
soc_code       varchar,                    -- System Organ Class (optional)
```

If it does not exist:
- Create migration: `_MIGRATIONS/YYYYMMDD_create_ref_meddra_codes.sql`
- Seed with the ~20 most common adverse event terms in psychedelic therapy contexts (nausea, vomiting, anxiety, panic, tachycardia, hypertension, dizziness, headache, sedation, dissociation, etc.)
- Apply RLS: `SELECT` for authenticated users, no public write.
- Follow `/schema-change-policy` and `/migration-execution-protocol` workflows before executing.

If it already exists, skip to Sub-task B.

---

### Sub-task B — BUILDER: Add MedDRA code resolver to `clinicalLog.ts`

Add a helper alongside the existing `getEventTypeIdByCode` pattern:

```typescript
// src/services/clinicalLog.ts
export async function getMedDRACodeId(code: string): Promise<number | null> {
    const { data, error } = await supabase
        .from('ref_meddra_codes')
        .select('id')
        .eq('meddra_code', code.trim())
        .maybeSingle();
    if (error || !data) {
        console.warn('[getMedDRACodeId] no match for code:', code);
        return null;
    }
    return data.id;
}
```

---

### Sub-task C — BUILDER: Wire resolver in `WellnessFormRouter.handleSafetyEventSave`

In `/src/components/wellness-journey/WellnessFormRouter.tsx`, update `handleSafetyEventSave`:

```typescript
// Current (approximate):
const result = await createSessionEvent({
    session_id: sessionId,
    event_type: data.event_type ?? 'Other',
    // meddra_code_id missing
    ...
});

// Fix: resolve before the write
const meddraCodeId = data.meddra_code
    ? await getMedDRACodeId(data.meddra_code)
    : null;

const result = await createSessionEvent({
    session_id: sessionId,
    event_type: data.event_type ?? 'Other',
    meddra_code_id: meddraCodeId ?? undefined,
    ...
});
```

If the code entered by the practitioner does not match any row in `ref_meddra_codes`, `getMedDRACodeId` returns `null` — the write proceeds without a MedDRA ID (graceful degradation, no error surfaced to user).

---

### Sub-task D — BUILDER: Surface MedDRA code in Timeline Ledger

In `WellnessFormRouter.handleSafetyEventSave`, add the MedDRA code to the AE Report ledger entry description when it is present:

```typescript
// In the aeParts[] array already built for the timeline stamp:
if (data.meddra_code) aeParts.push(`MedDRA: ${data.meddra_code}`);
```

This requires **no** schema change — it just adds the raw code as display text since the ledger description is free text.

---

### Sub-task E — BUILDER: Upgrade `SafetyAndAdverseEventForm` input (optional UX improvement)

Current: the MedDRA field is a free-text input (`<input type="text">`).

Recommended upgrade: change to a **searchable dropdown** backed by the `ref_meddra_codes` reference table. This prevents invalid codes and enables the FK lookup to always succeed.

```tsx
// Replace:
<input type="text" value={data.meddra_code ?? ''} ... />

// With: a typeahead/combobox loading from ref_meddra_codes
// (use the existing useReferenceData hook pattern)
```

This sub-task is **optional** — Sub-tasks A–D fully wire the FK and surface the code. Sub-task E is a UX improvement only.

---

## Do NOT Touch

- `log_safety_events` table structure (FK column `meddra_code_id` already exists)
- `SafetyAndAdverseEventData` TypeScript interface (already has `meddra_code?: string`)
- Any analytics or visualization components
- Existing migration files

---

## Acceptance Criteria

- [ ] `ref_meddra_codes` table exists and has ≥ 10 seeded rows
- [ ] After an AE Report save with a valid MedDRA code, `log_safety_events.meddra_code_id` is NOT NULL
- [ ] After an AE Report save with an **invalid** MedDRA code, the write still succeeds with `meddra_code_id = NULL` (no error thrown)
- [ ] The Live Session Timeline ledger entry for the AE Report includes `MedDRA: [code]` when a code was entered
- [ ] Existing AE Report saves without a MedDRA code are unaffected

---

## LEAD ARCHITECTURE

**Route to:** SOOP (Sub-task A) → BUILDER (Sub-tasks B, C, D, E)
**SOOP must complete migration and seed before BUILDER begins Sub-task B.**
**Sub-task E (searchable dropdown) only if sprint capacity allows.**
