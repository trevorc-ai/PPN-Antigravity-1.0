---
id: WO-705
title: "Add Zepbound, Propranolol, and Pristiq (desvenlafaxine) to the drug interaction checker library"
owner: LEAD
status: 00_INBOX
authored_by: LEAD (fast-track)
priority: P1
created: 2026-03-27
fast_track: true
origin: "Dr. Allen — fast-track request via research report: Zepbound-Propranolo-Pristiq-research-report.md"
admin_visibility: yes
admin_section: Settings
parked_context: ""
pillar_supported: Safety
task_type: schema | ui-feature
files:
  - public/internal/admin_uploads/research/Zepbound-Propranolo-Pristiq-research-report.md
---

## Request

Add Zepbound (tirzepatide), Propranolol, and Pristiq (desvenlafaxine) to the drug interaction checker library with all pairings, risk buckets, evidence flags, and QA test cases derived from the attached clinical research report.

## Source Research

**Report:** `public/internal/admin_uploads/research/Zepbound-Propranolo-Pristiq-research-report.md`

All 30 interaction records and 18 QA test cases are defined in full in the source report. The CSV extract at the bottom of the report (`## Structured data schema addendum, QA test cases, and CSV extract`) is the authoritative flat data source for seeding.

---

## LEAD Architecture

This work requires two layers:

**1. Database / Schema Layer**
The existing drug interaction checker schema must be extended to accept three new concomitant medications. New fields flagged in the report must be confirmed against the live schema before any migration is written:
- `route_context` (oral, inhaled, intranasal, IV/IM)
- `timing_context` (relative to last dose and to Zepbound initiation/dose escalation)
- `onset_shift_flag` (none, possible delay, likely delay)
- `gi_hydration_risk_flag` (none, possible, high)
- `vitals_masking_flag` (beta-blocker: risk of masked tachycardia)
- `maoi_exposure_flag` (ayahuasca/harmala = MAOI exposure present)

If these columns do not exist on the interaction table, an additive migration must be written and reviewed before seeding.

**2. Data Seeding Layer**
30 interaction records (all psychedelic × {Zepbound, Propranolol, Pristiq} pairings) and 18 QA test cases must be seeded from the CSV extract in the source report. Risk bucket logic must implement:

| Risk Bucket | Trigger |
|---|---|
| `absolute_contraindication` | Pristiq + Ayahuasca/harmalas (MAOI exposure) |
| `strong_caution` | Pristiq + MDMA; Propranolol + Ibogaine; Zepbound + Ayahuasca (active dehydration) |
| `needs_clinician_review` | Propranolol + MDMA; Pristiq + Esketamine (uncontrolled BP/seizure Hx); Psilocybin + Zepbound (recent dose escalation) |
| `possible_efficacy_blunting` | Pristiq + Psilocybin; Pristiq + MDMA |
| `monitor_only` | Zepbound + non-oral psychedelics (stable GI/hydration); Esketamine + Pristiq (with BP gate); LSD + Propranolol |
| `insufficient_evidence` | Inhaled DMT + Zepbound; 5-MeO-DMT + Zepbound |

**Pillar:** Safety — this directly enhances the drug safety screening workflow for every practitioner using the interaction checker.

**Affected areas (likely files):**
- `supabase/migrations/` — additive columns migration (if new fields are absent)
- Drug interaction seeder or admin-upload processing pipeline
- Drug interaction checker UI (if risk bucket labels or display logic need updating for new buckets or new flag types)

---

## Open Questions

- [ ] Do `route_context`, `timing_context`, `onset_shift_flag`, `gi_hydration_risk_flag`, `vitals_masking_flag`, and `maoi_exposure_flag` columns already exist on the drug interaction table? BUILDER must run `/analysis-first` to confirm live schema before writing any migration.
- [ ] Is there an existing admin upload pipeline for interaction records, or does BUILDER need to write a one-time seeder script?
- [ ] Are the 18 QA test cases (QA-001 through QA-018) stored in a separate QA/test table, or inline with interaction records? Clarify before seeding.
- [ ] Does the risk bucket value `absolute_contraindication` already exist as an enum/reference, or must it be added?

---
- **Data from:** `public/internal/admin_uploads/research/Zepbound-Propranolo-Pristiq-research-report.md` (CSV extract — 30 interaction records, 18 QA test cases)
- **Data to:** Drug interaction table (additive migration — new columns: `route_context`, `timing_context`, `onset_shift_flag`, `gi_hydration_risk_flag`, `vitals_masking_flag`, `maoi_exposure_flag`); 30 seeded interaction rows
- **Theme:** Tailwind CSS, PPN design system — drug interaction checker UI (risk bucket label display if needed)
