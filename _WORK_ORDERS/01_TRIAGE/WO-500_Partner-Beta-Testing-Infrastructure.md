---
id: WO-500
title: "Partner Beta Testing Infrastructure — Magic Link Auth, TEST Data Isolation, Mock Records, Role Expansion"
status: 01_TRIAGE
owner: PRODDY
created: 2026-02-26
created_by: LEAD
failure_count: 0
priority: P1
tags: [partner-testing, auth, mock-data, roles, beta, data-isolation]
depends_on: []
---

# WO-500: Partner Beta Testing Infrastructure

## USER REQUEST (Verbatim)
> "We have the table ref_user_roles with role_name options for admin, partner, and user. I can create logins for our partners that will give them the ability to use the site like a typical user, but any logs they create such as new patients will automatically be identified by having TEST in the patient ID hash. That way, they can test the Wellness Journey as many times as they want, and we will easily be able to filter or scrub that data later."

> "I would like to have PRODDY design a welcoming branded looking email created with an invitation to test the portal and explain to them that any records they create will be not be reflected in the actual live data when the site officially launches. Ideally, I could create the logins for each partner in advance, and they could just click the email and have their login credentials automatically populate in the login screen."

---

## LEAD ARCHITECTURE

### Confirmed Decisions (from USER)

1. **Magic Link Auth** — Use Supabase's built-in invite/magic link flow. Do NOT pass credentials in URL query params. INSPECTOR to walk user through Supabase dashboard invite setup separately.
2. **TEST Data Isolation** — Dual strategy: `TEST-{hash}` prefix in `subject_id` AND `is_test BOOLEAN DEFAULT FALSE` column on the patients table.
3. **Mock Records** — Each partner account gets seeded with a unique set of mock patient records with enough variety to exercise all Wellness Journey components (vitals, assessments, protocols, Phase 3 integration). No two partners share the same mock dataset.
4. **Scale** — Up to **10 testers** for this wave. Manual Supabase dashboard account creation is sufficient. No self-serve admin tool needed yet. Testers fall into two categories: domain experts (full Wellness Journey access) and UI/UX observers (beta_observer role — guided demo shell, read-only with pre-seeded data).
5. **Global Benchmark Intelligence** — Partners CAN see it. Data is publicly sourced CC BY 4.0 / Open Access. RLS should allow `partner` role full read access to `benchmark_cohorts`.
6. **Live Data Isolation** — Partners MUST NOT see real patient data from other practitioners. RLS scoping required.

### Role Tier Expansion (Strategic — See PRODDY Section)

USER has flagged that the current 3-role system (admin, partner, user) is insufficient. The future roadmap needs:

| Role Tier | Description | Examples |
|---|---|---|
| `admin` | Full system access | Trevor |
| `owner` | Business owner — all business data, no admin controls | Jason (co-founder) |
| `partner_free` | Free pilot tester — full Wellness Journey, TEST data only | Dr. Jason Allen (advisory board) |
| `partner_paid` | Paid pilot tester — same as partner_free, paid tier | TBD |
| `beta_observer` | Non-practitioner early feedback tester — guided demo shell, read-only | Trevor's wife, UI/UX observers |
| `user_free` | Free tier — limited access | Students, researchers, academics |
| `user_pro` | Paid Tier 1 — individual practitioners/researchers | Standard individual users |
| `user_premium` | Paid Tier 2 — advanced features | Power users |
| `user_enterprise` | Multi-seat — clinics, research orgs | Singularism, clinic groups |

> **NAMING RATIONALE:** `user_` prefix is role-agnostic — works for clinicians, researchers, compliance officers, and admins. `partner_` is reserved for pre-launch relationship holders. `beta_observer` is a temporary, time-boxed role to be deprecated post-launch. `clinician_` was dropped — it baked a persona assumption into the data model that excluded non-practitioner audience segments.

> **NOTE:** PRODDY to validate/refine these tiers and map to feature gate matrix. This is a strategic decision with billing implications.

### Technical Scope (for BUILDER + SOOP)

#### Database Changes Required
1. **`patients` table** — Add `is_test BOOLEAN NOT NULL DEFAULT FALSE` column (additive, migration required)
2. **`patients` patient ID generation** — Enforce `TEST-` prefix in `subject_id` when `is_test = TRUE` (app logic + DB constraint)
3. **`ref_user_roles`** — Additive inserts of new role tiers (after PRODDY finalizes the tier names)
4. **`user_profiles`** — No schema change needed; `role_id` FK handles new roles automatically
5. **RLS Policies** — Update to scope `partner` role reads to own data only (no cross-clinician visibility)

#### Mock Data Seeder
- Create `supabase/seeds/seed_partner_mock_records.sql`
- Each of up to 10 partner accounts gets: 2–3 mock patients, each with varied phases, vitals, assessments, and at least one PHQ-9 baseline
- Records must have `is_test = TRUE` and `subject_id` prefixed with `TEST-`

#### Benchmark Intelligence Access
- Confirm/add RLS policy: `partner` role can SELECT from `benchmark_cohorts`
- Status check: `backend/data/benchmark_cohorts_seed.csv` exists with 11 rows of real data. 
- **Seeding has NOT been executed against production** — script exists at `backend/scripts/seed_benchmark_cohorts.py` but needs to be run. This is a **blocker** for the Global Benchmark Intelligence feature being meaningful for partner testers.

---

## PRODDY SCOPE (This Ticket — 01_TRIAGE)

PRODDY must deliver:
1. **Feature Gate Matrix** — Map each role tier to which features they can access (Wellness Journey, Benchmark Intel, Protocol Builder, etc.)
2. **Role Tier Validation** — Confirm or refine the 8-tier role system above. Define exact role_name strings.
3. **Partner Onboarding Email Brief** — Copy brief + design direction for the branded partner invite email (MARKETER will execute)
4. **Mock Record Variety Spec** — Define what "enough variety" means: which substances, which phases, which assessment instruments should be represented across the mock dataset

---

## DOWNSTREAM TICKETS (LEAD to create after PRODDY strategy complete)

- **WO-501** → SOOP/BUILDER: DB migration (`is_test` column, new role inserts, RLS updates)
- **WO-502** → BUILDER: Mock records seeder script
- **WO-503** → MARKETER: Branded partner invite email (HTML, copy)
- **WO-504** → BUILDER: Run benchmark cohorts seeder against production (`seed_benchmark_cohorts.py`)

---

## PRODDY STRATEGY OUTPUT
*Completed 2026-02-26. Source: NotebookLM (MVP demo + clinical research). Session ID: 626e7931*

---

### 1. Feature Gate Matrix

*Rationale anchored in Dr. Allen's demo feedback: multi-patient dashboard (running concurrent rooms), QT interval vitals (non-negotiable safety), and data export (defensibility for insurance/malpractice) were his top priorities.*

| Feature | admin | owner | partner_paid | partner_free | beta_observer | user_enterprise | user_premium | user_pro | user_free |
|---|---|---|---|---|---|---|---|---|---|
| Wellness Journey | ✅ Full | ✅ Full | ✅ Full | ✅ Full | 👁 Read-only | ✅ Full | ✅ Full | ✅ Full | ⚠️ Basic |
| Session Vitals Logging | ✅ | ✅ | ✅ | ✅ | 👁 Read-only | ✅ | ✅ | ✅ | ✅ |
| Baseline Assessments | ✅ | ✅ | ✅ | ✅ | 👁 Read-only | ✅ | ✅ | ✅ | ✅ |
| Multi-patient Dashboard | ✅ | ✅ | ✅ | ✅ | 👁 Read-only | ✅ | ✅ | ✅ | ❌ |
| Protocol Builder | ✅ | ✅ | ✅ | ❌ | 👁 Read-only | ✅ | ✅ | ✅ | ❌ |
| Data Export | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| Analytics / Reporting | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| Global Benchmark Intel | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Admin Panel | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |

> **NOTE for USER review:** PRODDY recommends `partner_free` does NOT get Protocol Builder, Data Export, Analytics, or Benchmark Intel. These are premium value differentiators. Free pilot testers get the clinical workflow (Wellness Journey + vitals + assessments) — enough to evaluate the core product and provide meaningful feedback — but the analytical layer is a paid incentive.

---

### 2. Partner Onboarding Email Brief

**Tone:** Collaborative, scientifically rigorous, reassuring, and focused on reducing cognitive load.

**Key Messages:**
- **Welcome + Shared Mission** — Welcome partner to PPN Beta. Mission: make the industry safer and allow practitioners to be more present with patients by removing manual calculation and tracking work.
- **Sandbox Expectations** — Clearly state this is a beta test environment. Dummy records will NOT appear in live production data. Reinforce that PPN uses randomized 10-digit alphanumeric IDs — no PHI is ever entered or at risk.
- **What to Test** — Invite them to run PPN in parallel with their current paper charts. Stress-test:
  - Interaction Checker (e.g., flag Lithium or Suboxone/Buprenorphine contraindications)
  - Running Dosage Calculator (real-time mg/kg across timestamped booster doses)
  - QT interval / EKG vitals logging (most critical ibogaine safety metric)
- **CTA** — Single prominent button → magic link login. Mobile-friendly.

**MARKETER note:** Copy should feel like a letter from a colleague in the field, not a SaaS product announcement.

---

### 3. Mock Record Variety Spec

**Mock Patient A — Ibogaine TPA Protocol** *(Safety, dosing, vitals focus)*
- Substance: Ibogaine / Total Plant Alkaloids (TPA)
- Phase: Active 30-hour treatment session
- Exercises: Interaction Checker (Buprenorphine/Suboxone flag), Protocol Builder running mg/kg calc across booster doses, QT interval vitals logging (continuous EKG entries)
- Outcome trajectory: Stable but monitoring-intensive

**Mock Patient B — Sequential Trifecta Therapy** *(Outcomes + subjective tracking focus)*
- Substance: MDMA → Psilocybin (same session arc)
- Phase: Full Wellness Journey (Prep → Treatment → Integration)
- Exercises: PHQ-9 baseline (score ~25) → Integration follow-up (drop to ~12), Patient View subjective logging (ego dissolution taps), MEQ-30 post-session scale
- Outcome trajectory: Clear improvement arc — demonstrates system's longitudinal value

**Mock Patient C — Ketamine Adverse Event Case** *(Defensibility + multi-tasking focus)*
- Substance: Ketamine
- Phase: Treatment with adverse event
- Exercises: Multi-patient dashboard (force switching between rooms), timestamped intervention logging (diaphoresis response), C-SSRS baseline documentation, Data Export (anonymized CSV for defensibility demo)
- Outcome trajectory: Adverse event managed and documented — demonstrates safety/compliance layer

---

## ACCEPTANCE CRITERIA

- [x] PRODDY delivers feature gate matrix with role tier definitions
- [x] PRODDY delivers partner onboarding email brief
- [x] PRODDY delivers mock record variety spec
- [ ] USER reviews Feature Gate Matrix (esp. partner_free restrictions)
- [ ] LEAD routes downstream tickets: WO-501 (DB migration), WO-502 (mock seeder), WO-503 (email)

