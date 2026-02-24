---
id: WO-313
title: "Compliance & Regulatory Outputs — Oregon 303 Form + Chain of Custody"
status: 03_BUILD
owner: BUILDER
created: 2026-02-21
created_by: CUE
failure_count: 0
priority: P2_MEDIUM
tags: [compliance, regulatory, oregon, chain-of-custody, 303-form, practice-management, new-page]
depends_on: []
user_prompt: |
  "State Compliance Reports: for Oregon practitioners, output aggregated de-identified
  demographic and outcome data (e.g., the 303 Client Data Form) formatted for mandatory
  quarterly submission to health authorities.
  Medicine Inventory & Chain of Custody Logs: automated tracking reports detailing the
  exact batch, lot number, and dosage administered, alongside waste disposal records."
---

# WO-313: Compliance & Regulatory Outputs

## WHERE IN THE UI (confirmed by LEAD)

**New page: `/compliance`** — NOT inside Wellness Journey.
This is a practice management tool. Practitioners visit it quarterly or when needed.
It is NOT part of the real-time session workflow.

---

## NEW ROUTE + PAGE

```typescript
// src/App.tsx — add:
{ path: '/compliance', element: <CompliancePage /> }

// src/pages/CompliancePage.tsx — new page
```

**Sidebar entry:** "Compliance" — below "Analytics" in the navigation, with a badge showing
"Report Due" if the current date is within 30 days of a quarter end.

---

## DELIVERABLE 1: Oregon 303 Client Data Form Generator

### OHA Requirements (Oregon Psilocybin Services — OAR 333-333)
The 303 form requires quarterly de-identified submission of:

| Field | Source |
|---|---|
| Reporting period | Quarter start/end dates |
| Total clients served | COUNT(DISTINCT patient_link_code) |
| Age range distribution | Demographics: 21-30 / 31-40 / 41-50 / 51-60 / 61+ |
| Gender distribution | M / F / Non-binary / Prefer not to say |
| Race/ethnicity | OHA categories |
| Primary diagnosis | Condition categories |
| Number of preparation sessions per client | AVG and range |
| Number of administration sessions per client | AVG and range |
| Number of integration sessions per client | AVG and range |
| Adverse events (de-identified count by type) | COUNT from log_safety_events |
| Treatment outcomes (by category) | Response / Partial / Non-responder / Incomplete |
| Referrals made | COUNT |
| Client-reported satisfaction (if collected) | AVG |

### Query Function (`src/services/oregonCompliance.ts`)

```typescript
export async function generate303FormData(
  siteId: string,
  quarterStart: Date,
  quarterEnd: Date
): Promise<OregonForm303Data>

export function export303FormCSV(data: OregonForm303Data): string  // OHA-specified CSV format
export function export303FormPDF(data: OregonForm303Data): void    // Human-readable version
```

### Privacy Rules (CRITICAL)
- **k-anonymity ENFORCED:** Any demographic cell with fewer than 5 clients shows `< 5`
- No individual-level data exported — aggregates only
- Function calls `requireKAnonymity()` before computing any breakdown
- If total clients < 5 for the period, export is blocked: "[INSUFFICIENT DATA — Minimum 5 clients required for compliant submission]"

### UI: 303 Form Generator Panel

```
Oregon 303 Client Data Form — Quarterly Report
───────────────────────────────────────────────
Reporting Period:  [Q1 2026 — Jan 1 to Mar 31, 2026]  [← Select Quarter]

Total Clients Served:    34
Administration Sessions: 41  (avg 1.2 per client)
Preparation Sessions:    102 (avg 3.0 per client)
Integration Sessions:    87  (avg 2.6 per client)

Demographics                Outcomes
Age: 21-30    9 (26%)      Response:       21 (62%)
Age: 31-40    12 (35%)     Partial:        7 (21%)
Age: 41-50    8 (24%)      Non-responder:  4 (12%)
Age: 51+      5 (15%)      Incomplete:     2 (6%)

Adverse Events: 3 total (Grade 1-2 only)

[Preview Report] [Export CSV for OHA Submission] [Export PDF]
[Due Date: March 31, 2026]
```

---

## DELIVERABLE 2: Medicine Chain of Custody Log

### What Data Is Tracked (from `DosingProtocolForm`)

Per session, per substance unit administered:
- Batch number (manufacturer lot)
- Supplier / Licensed producer name
- Quantity received (mg)
- Date received
- Storage location / conditions
- Quantity administered per session (mg, route)
- Patient ID (Subject_ID only)
- Session date
- Administering clinician ID
- Quantity destroyed / wasted post-session (mg)
- Destruction method (witnessed flush / incineration / etc.)
- Witness to destruction

### Database: Additive Migration Required

```sql
-- New table: ref_substance_inventory (static reference — batch tracking)
CREATE TABLE IF NOT EXISTS public.log_chain_of_custody (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id           UUID NOT NULL,
  session_id        UUID,  -- FK to log_clinical_records.id
  substance         TEXT NOT NULL,
  batch_number      TEXT,
  lot_number        TEXT,
  supplier          TEXT,
  quantity_received_mg  NUMERIC(10,2),
  date_received     DATE,
  quantity_administered_mg NUMERIC(10,2),
  route             TEXT,  -- 'oral', 'IM', 'IV', 'intranasal'
  patient_link_code TEXT,  -- Subject_ID only
  session_date      DATE,
  clinician_id      UUID,
  quantity_wasted_mg NUMERIC(10,2),
  destruction_method TEXT,
  destruction_witness TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.log_chain_of_custody ENABLE ROW LEVEL SECURITY;
-- RLS: site-scoped, authenticated users only
```

SOOP must write this migration as part of WO-313 execution.

> ⚠️ **LEAD ARCHITECTURE NOTE (2026-02-21):** `log_chain_of_custody` was already created by migration 062 (verified live). BUILDER: **SKIP** the migration block — the table exists. Build the UI directly against the live table. The schema in this spec is for reference — the deployed version has additional columns (`storage_location`, `storage_conditions`, `destruction_witness_name`, `administering_clinician_id`, `updated_at`, `created_by`). Use those.

### UI: Chain of Custody Log Panel

```
Medicine Inventory & Chain of Custody
───────────────────────────────────────────────────────
[Filter: Substance ▾] [Filter: Date Range ▾] [Export Log]

Date        Patient    Substance    Batch      Administered  Wasted   Witness
2026-01-15  PT-8832X   Psilocybin   LOT-2401A  25mg oral    0.5mg    Jane R.
2026-01-22  PT-9921Y   Psilocybin   LOT-2401A  25mg oral    0.5mg    Jane R.
2026-02-03  PT-4471Z   Ketamine     K-LOT-203  100mg IM     2.0mg    Marcus T.

Total administered this quarter:  450mg psilocybin | 600mg ketamine
Total wasted:                     9mg psilocybin   | 12mg ketamine

[Export Chain of Custody Log — CSV] [Export for Audit — PDF]
```

---

## NEW PAGE: CompliancePage (`src/pages/CompliancePage.tsx`)

### Layout

```
/compliance

┌─────────────────────────────────────────────────────────────┐
│  Compliance & Regulatory                                    │
│  Practice management tools for regulatory submissions       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [TAB: Oregon 303 Form]  [TAB: Chain of Custody]           │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  [Active tab content renders here]                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### "Due Soon" Banner (conditional)

```tsx
// If today is within 30 days of a quarter end date:
const quarterEndDates = ['03-31', '06-30', '09-30', '12-31'];
const daysToDue = getDaysToNearestQuarterEnd();

if (daysToDue <= 30) {
  // Show amber banner: "[ACTION REQUIRED] Oregon Q1 2026 Report due in 23 days — March 31, 2026"
}
```

---

## SIDEBAR INTEGRATION

```tsx
// src/components/Sidebar.tsx — add entry in nav:
{
  path: '/compliance',
  label: 'Compliance',
  icon: 'gavel',  // Material Symbol
  badge: daysToQuarterEnd <= 30 ? 'Due Soon' : undefined,
}
```

---

## ACCEPTANCE CRITERIA

- [ ] `/compliance` route renders the CompliancePage
- [ ] Compliance page appears in sidebar with correct icon
- [ ] "Due Soon" badge appears in sidebar within 30 days of quarter end
- [ ] 303 Form generator correctly aggregates from `log_clinical_records` + `log_longitudinal_assessments`
- [ ] k-anonymity enforced — cells with < 5 clients show `< 5`
- [ ] 303 form export blocked with clear message if total clients < 5
- [ ] CSV export format matches OHA 303 submission template structure
- [ ] Chain of custody table renders correctly from `log_chain_of_custody`
- [ ] Chain of custody PDF export includes all required fields for audit
- [ ] SOOP migration adds `log_chain_of_custody` table with RLS
- [ ] No PHI — only Subject_ID used in chain of custody log
- [ ] All fonts ≥ 12px
- [ ] Responsive layout — works on tablet (practitioners may use iPad in clinic)
- [ ] INSPECTOR: "Due Soon" badge uses text label, not color-only indicator
