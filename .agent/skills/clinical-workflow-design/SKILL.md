---
name: clinical-workflow-design
description: >
  Design standards for clinical documentation workflows — Phase 1 (Preparation),
  Phase 2 (Dosing), and Phase 3 (Integration). Defines field type enforcement,
  structured input requirements, longitudinal assessment standards, and Zero-PHI
  compliance rules. PRODDY reads this before designing any clinical form or wizard.
  INSPECTOR reads this before clearing any clinical WO at Phase 0.
---

# Clinical Workflow Design Skill

## Purpose

Ensure that every clinical form, wizard, and data-capture screen in the PPN Portal collects data in a way that:
1. Supports all five pillars (Safety, Comparative Intelligence, QA/Governance, Benchmarking, Research)
2. Maintains Zero-PHI compliance
3. Produces structured, FK-referenced data that feeds into `v_` and `mv_` analytical views
4. Does not introduce free-text where structured input should exist

---

## 1. Zero-PHI Law (Non-Negotiable)

All clinical data tables use `subject_id` (a practitioner-assigned alphanumeric) as the only patient identifier. The following are BANNED from all `log_*` tables:

| Banned Field Type | Why |
|-------------------|-----|
| Patient full name (text) | PHI — violates Zero-PHI contract |
| Date of birth | PHI |
| Contact information | PHI |
| Social security / government ID | PHI |
| Any free-text "patient notes" field without a FK substitute | Creates unstructured PHI risk |

**Allowed:** `subject_id VARCHAR(10)`, pseudonymous identifiers, session UUIDs, and all structured FK references.

---

## 2. Field Type Standards

### 2a. Always Structured (Never Free-Text for Searchable / Comparable Data)

Fields that will appear in analytics, benchmarks, or cross-site comparisons MUST use a FK integer referencing a `ref_` table:

| Field | Required Type | ref_ Table |
|-------|--------------|------------|
| Substance administered | `substance_id INTEGER` | `ref_substances` |
| Protocol type / modality | `modality_id INTEGER` | `ref_modalities` |
| Clinical indication | `indication_id INTEGER` | `ref_indications` |
| Severity grade | `severity_grade_id INTEGER` | `ref_severity_grades` |
| Assessment instrument | `instrument_id INTEGER` | `ref_instruments` |
| Resolution status | `resolution_status_id INTEGER` | `ref_resolution_statuses` |

**If a `ref_` table does not yet exist for a field that needs one:**

1. **File a separate WO for the `ref_` table first.** Do not bundle the `ref_` table creation into the clinical form WO — if it fails, the whole WO is blocked.
2. **Mark the clinical form WO as blocked:** Add `blocked_by: WO-NNN` in the frontmatter, where NNN is the `ref_` table WO. Move the clinical form WO to `98_HOLD` until the `ref_` WO is in `99_COMPLETED`.
3. **Do not route the clinical form WO to `04_BUILD`** until the `ref_` table is confirmed live in the Supabase schema (verified via live query, not assumed from a migration file).

### 2b. Free-Text is Allowed Only for Non-Comparable Narrative Fields

| Allowed Free-Text Field | Justification |
|------------------------|---------------|
| Session facilitator's qualitative notes | Never compared across sites; narrative only |
| Integration session reflections | Patient narrative, not clinical metric |
| Adverse event description text | Accompanies structured severity_grade_id FK |
| Protocol notes | Companion to structured protocol fields |

### 2c. Scored Assessments (PHQ-9, GAD-7, PCL-5, MEQ-30, etc.)

- Store raw item scores as integers in individual columns (`phq_q1 SMALLINT`, etc.)
- Store computed total as an integer column (`phq_total SMALLINT`)
- Store interpretation category as a FK (`phq_severity_id INTEGER REFERENCES ref_phq_severity`)
- **Never** store the text interpretation only (e.g., `"Moderately Severe"`) without the FK

---

## 3. Phase-Specific Design Rules

### Phase 1 — Preparation

- Baseline assessment (PHQ-9, GAD-7, PCL-5) scores must be stored before Phase 2 is enabled
- Contraindication screening must be FK-structured (no free-text medication/allergy fields that bypass RxNorm lookup)
- Eligibility clearance generates a boolean `eligibility_cleared` field on the episode record

### Phase 2 — Dosing Session

- Session must have a confirmed `substance_id` FK before document save
- Vitals entries: timestamped, FK-linked to session UUID, structured (numeric columns for HR, BP, SpO2)
- Adverse events: `severity_grade_id` FK required; free-text description is additive, not the primary field
- Session termination reasons: FK reference (`ref_termination_reasons`) — not free-text

### Phase 3 — Integration

- Post-session assessments (PHQ-9, GAD-7 repeat) stored with FK linkage to the originating episode UUID
- Follow-up contact log: FK to `log_followup_contacts`, timestamped, structured outcome field
- Outcome improvement delta: computed at view layer (`v_` or `mv_`), not stored as a column

---

## 4. PRODDY Design Checklist (Before Filing a Clinical WO)

- [ ] Every new field that will appear in analytics reviewed against §2a (FK or free-text decision documented)
- [ ] Zero-PHI checklist completed — no banned field types introduced (§1)
- [ ] `ref_` tables needed for new FK fields included in WO scope (or confirmed already live)
- [ ] The `mv_`/`v_` view that will consume this form's data identified (or flagged as future work)
- [ ] Phase-specific rules applied (§3)

## 5. INSPECTOR Pre-Build Gate (Phase 0 — Clinical WOs)

Run this additional check for any WO touching clinical forms, wizards, or `log_*` tables:

```bash
# Flag free-text inputs in clinical components
grep -n "type=\"text\"\|<textarea" <clinical_component_file> | grep -iv "note\|comment\|reflect"
```

Any `<input type="text">` or `<textarea>` in a clinical data component that is NOT a narrative field is a potential data quality violation. Confirm the field's purpose before clearing.

---
*Created 2026-03-25 per INSPECTOR SQL-Layers alignment audit. No analog existed previously.*
