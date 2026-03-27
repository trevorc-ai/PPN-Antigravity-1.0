---
id: WO-710
title: "Connect 'What are you primarily treating?' to ref_indications DB and fix compact UI for more indications"
owner: LEAD
status: 00_INBOX
authored_by: LEAD (fast-track)
priority: P1
created: 2026-03-27
fast_track: true
origin: "User fast-track request"
admin_visibility: no
admin_section: ""
parked_context: ""
pillar_supported: "Safety | QA/Governance"
task_type: "ui-feature | schema"
files:
  - src/components/wellness-journey/ProtocolConfiguratorModal.tsx
---
## Request
Check if the "What are you primarily treating?" field is dummy data or connected to the database; may be missing some treatments from the reference table; do not make the modal any bigger.

## LEAD Architecture

**Current State — Hardcoded dummy data confirmed:**
- `ProtocolConfiguratorModal.tsx` line 25–58 contains a hardcoded `CONDITIONS` array with **8 items** using short UI labels (e.g., "PTSD", "Anxiety / GAD").
- The database table `ref_indications` (migration 003) contains **9 canonical items** with full clinical names.
- Currently stored value (`condition` state) is a raw string label, not a `indication_id` FK.

**Gap Analysis — Items in DB but NOT in UI:**
| DB `indication_name` | UI status |
|---|---|
| Major Depressive Disorder (MDD) | ✅ shown as "Depression" |
| Treatment-Resistant Depression (TRD) | ❌ **MISSING** |
| Post-Traumatic Stress Disorder (PTSD) | ✅ shown as "PTSD" |
| Generalized Anxiety Disorder (GAD) | ✅ shown as "Anxiety / GAD" |
| Social Anxiety Disorder | ❌ **MISSING** |
| Obsessive-Compulsive Disorder (OCD) | ❌ **MISSING** |
| Substance Use Disorder | ✅ shown as "Addiction / SUD" |
| End-of-Life Distress | ✅ shown as "End-of-Life Distress" |
| Other / Investigational | ✅ shown as "Other" |

**Items in UI but NOT in DB:**
| UI label | DB status |
|---|---|
| Spiritual / Ceremonial | ❌ No DB row — not in ref_indications |
| Chronic Pain | ❌ No DB row — not in ref_indications |

**Required Changes:**
1. Replace hardcoded `CONDITIONS` array with a live Supabase query to `ref_indications` (same pattern as `ref_weight_ranges` already used in this file).
2. Store `indication_id` (FK int) in the intake data, not the raw label string — align with `PatientIntakeData` interface.
3. Add missing indications to `ref_indications`: `Spiritual / Ceremonial`, `Chronic Pain` via an additive migration.
4. UI: with 11 indications, the current pill-grid wraps poorly. Replace with a **compact 2-column scrollable list** (no modal height increase) — same `flex-wrap gap-2` container but use `text-xs` pills or a compact radio-button list pattern.

**Pillar:** Safety | QA/Governance — ensures clinical documentation is stored as FK IDs, not free-text strings; fixes missing treatment categories.

## Open Questions
- [ ] Should `Spiritual / Ceremonial` and `Chronic Pain` be added to `ref_indications` to match what the UI already offers? (LEAD recommends yes — they are documented clinical use cases)
- [ ] Should the `indication_id` FK be wired to `log_patient_profiles` immediately or is the intake data only used locally for now?

---
- **Data from:** `ref_indications` (live Supabase query), local hardcoded `CONDITIONS` array (to be replaced)
- **Data to:** `log_patient_profiles` — `indication_id` FK field (pending wiring decision)
- **Theme:** Tailwind CSS, PPN design system (pill-grid, `text-xs`, `flex-wrap gap-2`)
