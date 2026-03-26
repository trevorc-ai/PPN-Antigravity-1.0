# PPN Algorithm Specification — CONTRAINDICATION_IBOGAINE_V1

---

## 1. Algorithm Identity

| Field | Value |
|---|---|
| **Algorithm ID** | `CONTRAINDICATION_IBOGAINE_V1` |
| **Class** | Safety Gate — Contraindication Detection |
| **Status** | ACTIVE |
| **Version** | V1.0.0 |
| **Owner** | LEAD / Clinical Safety |
| **Created** | 2026-03-25 |
| **Last Reviewed** | 2026-03-25 |
| **WO Origin** | WO-685 (documents existing engine implemented in WO-673) |

---

## 2. Business and Clinical Purpose

Evaluates a patient's clinical profile against a structured list of absolute and relative contraindications for Ibogaine administration and emits tiered advisory flags. Ibogaine carries documented risk of cardiac arrhythmia (QTc prolongation), hepatotoxicity, and seizure — the contraindication check reduces the risk of harm by surfacing known risk factors before Phase 2 dosing begins.

**Advisory only at V1.** Per Dr. Allen's explicit clinical guidance (600+ sessions), the engine MUST NOT block the practitioner from proceeding. It flags and advises; it does not gate.

---

## 3. Algorithm Type

`rule_engine` — evaluates a patient's structured intake data against a lookup table of contraindication rules and produces a tiered output (ABSOLUTE / RELATIVE / NONE).

---

## 4. Input Contract

| Field | Source Table | Data Type | Required | Notes |
|---|---|---|---|---|
| `medication_ids` | `log_patient_medications.medication_id[]` | UUID[] | YES | FK to `ref_medications` |
| `qtc_baseline_ms` | `log_clinical_records.qtc_baseline_ms` | INTEGER | NO | NULL = baseline not captured; engine flags separately |
| `has_active_seizure_disorder` | `log_safety_checks.has_active_seizure_disorder` | BOOLEAN | YES | |
| `has_cardiac_arrhythmia_history` | `log_safety_checks.has_cardiac_arrhythmia_history` | BOOLEAN | YES | |
| `has_hepatic_impairment` | `log_safety_checks.has_hepatic_impairment` | BOOLEAN | YES | |
| `has_psychiatric_psychosis_history` | `log_safety_checks.has_psychiatric_psychosis_history` | BOOLEAN | YES | |
| `primary_substance_id` | `log_sessions.primary_substance_id` | UUID | YES | Engine only runs if Ibogaine |
| `session_id` | `log_sessions.id` | UUID | YES | RLS-enforced |

---

## 5. Plain-English Logic Summary

1. Engine runs only when `primary_substance = Ibogaine HCL or TPA`. For other substances, engine returns `NOT_APPLICABLE`.
2. Check absolute contraindications (any TRUE = ABSOLUTE flag):
   - QTc baseline ≥ 500ms (cardiac arrest risk zone)
   - Patient is on a QT-prolonging medication in `ref_clinical_interactions` (drug-drug interaction)
   - Active seizure disorder (uncontrolled)
   - Severe hepatic impairment (Child-Pugh Class C)
3. Check relative contraindications (any TRUE = RELATIVE flag, shown alongside ABSOLUTE if both):
   - QTc baseline 450–499ms (elevated, monitor closely)
   - History of cardiac arrhythmia (non-QT varieties)
   - Prior psychotic episode
   - Moderate hepatic impairment (Child-Pugh Class B)
4. If NO contraindications: return `NONE`
5. Display advisory banner in Phase 1 completion check and Phase 2 entry prompt.

---

## 6. Formal Pseudo-Logic

```
FUNCTION contraindication_ibogaine(session_id: UUID) -> ENUM + flagged_items[]

  IF primary_substance NOT IN ('ibogaine_hcl', 'tpa') THEN
    RETURN 'NOT_APPLICABLE'
  END IF

  absolute_flags = []
  relative_flags = []

  // Cardiac — absolute
  IF qtc_baseline_ms >= 500 THEN
    PUSH absolute_flags, 'QTc >= 500ms: Absolute contraindication'
  ELSE IF qtc_baseline_ms IS NULL THEN
    PUSH relative_flags, 'QTc baseline not captured — required before dosing'
  ELSE IF qtc_baseline_ms >= 450 THEN
    PUSH relative_flags, 'QTc 450-499ms: Elevated baseline — monitor closely'
  END IF

  // Drug interactions
  FOR EACH medication_id IN patient_medications:
    interaction = lookup ref_clinical_interactions WHERE substance = 'ibogaine' AND medication_id = medication_id
    IF interaction.severity = 'absolute' THEN PUSH absolute_flags, interaction.label
    IF interaction.severity = 'relative' THEN PUSH relative_flags, interaction.label
  END FOR

  // Other clinical flags
  IF has_active_seizure_disorder = TRUE THEN PUSH absolute_flags, 'Active seizure disorder'
  IF has_hepatic_impairment AND severity = 'severe' THEN PUSH absolute_flags, 'Severe hepatic impairment'
  IF has_cardiac_arrhythmia_history = TRUE THEN PUSH relative_flags, 'Arrhythmia history'
  IF has_psychiatric_psychosis_history = TRUE THEN PUSH relative_flags, 'Prior psychotic episode'
  IF has_hepatic_impairment AND severity = 'moderate' THEN PUSH relative_flags, 'Moderate hepatic impairment'

  IF absolute_flags NOT EMPTY THEN
    RETURN 'ABSOLUTE', absolute_flags, relative_flags
  ELSE IF relative_flags NOT EMPTY THEN
    RETURN 'RELATIVE', relative_flags
  ELSE
    RETURN 'NONE'
  END IF

END FUNCTION
```

---

## 7. Thresholds and Controlled Vocabulary

| Flag Type | Condition | Label in UI |
|---|---|---|
| ABSOLUTE | QTc >= 500ms | QTc significantly elevated — major cardiac risk |
| ABSOLUTE | QT-prolonging drug interaction | Drug interaction: [medication name] prolongs QT |
| ABSOLUTE | Active seizure disorder | Active seizure disorder: Ibogaine lowers seizure threshold |
| ABSOLUTE | Child-Pugh Class C | Severe hepatic impairment: Ibogaine is hepatotoxic |
| RELATIVE | QTc 450–499ms | QTc elevated baseline — close monitoring required |
| RELATIVE | QTc missing | Baseline QTc not documented — required before dosing |
| RELATIVE | Arrhythmia history | Cardiac arrhythmia history noted |
| RELATIVE | Prior psychotic episode | Psychiatric risk factor: prior psychosis |
| RELATIVE | Child-Pugh Class B | Moderate hepatic impairment: dose adjustment consideration |

All interaction lookups sourced from `ref_clinical_interactions`. QTc thresholds per AHA/ACC 2024 guidelines.

---

## 8. Confidence Level

`rule_based` — deterministic rules applied to structured inputs. Confidence is bounded by the completeness and accuracy of Patient intake data; the engine cannot flag what is not documented.

---

## 9. Missing Data Handling

| Scenario | Behavior |
|---|---|
| `qtc_baseline_ms` is NULL | Engine emits RELATIVE flag: "QTc baseline not captured" |
| No medications logged | Engine assumes no drug interactions — no flag emitted |
| `has_active_seizure_disorder` not answered | Defaults to NULL — treated as UNKNOWN; engine notes "Seizure history: not documented" |
| `primary_substance_id` is not Ibogaine | Engine returns `NOT_APPLICABLE` silently |

---

## 10. Override Policy

No practitioner override required — the engine is advisory only. All flags are displayed; none block session creation. If a practitioner proceeds despite ABSOLUTE flags, the flag state at time of session start is preserved in `log_ae_notifications.override_context` for audit purposes.

---

## 11. Report Surfaces

| Surface | Location |
|---|---|
| Phase 1 completion review | Contraindication summary banner |
| Phase 2 entry prompt | Non-blocking modal if ABSOLUTE flags present |
| Session PDF | Safety section — lists all flags with severity tier |
| Practice analytics | Contraindication frequency by substance (future analytics ticket) |

---

## 12. Limitations

- Drug interaction list is only as complete as `ref_clinical_interactions`. BUILDER must keep this table current; the engine cannot flag interactions not in the table.
- Engine does not assess pharmacokinetics or polypharmacy complexity (e.g., multiple relative contraindications combined).
- QTc thresholds are advisory guidelines — Dr. Allen's clinical experience includes patients with QTc values above published thresholds who had no adverse events. The engine documents risk; it does not replace clinical judgment.

---

## 13. Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| V1.0.0 | 2026-03-25 | LEAD (WO-685) | Initial specification authored. Documents logic implemented by WO-673. |
