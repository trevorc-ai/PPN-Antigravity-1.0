# PPN Algorithm Specification — RELEASE_READY_PSILOCYBIN_V1

---

## 1. Algorithm Identity

| Field | Value |
|---|---|
| **Algorithm ID** | `RELEASE_READY_PSILOCYBIN_V1` |
| **Class** | Clinical State — Session Release Readiness |
| **Status** | ACTIVE |
| **Version** | V1.0.0 |
| **Owner** | LEAD / Clinical Safety |
| **Created** | 2026-03-25 |
| **Last Reviewed** | 2026-03-25 |
| **WO Origin** | WO-685 |

---

## 2. Business and Clinical Purpose

Determines whether a patient meets the clinical criteria to be safely released from practitioner observation after a psilocybin dosing session. This engine protects practitioners from prematurely ending observation and protects patients from adverse outcomes in the 4-hour acute recovery window.

**Not a hard block.** The practitioner retains final clinical authority. The engine provides a structured readiness checklist and emits a READY / NOT_READY advisory flag.

---

## 3. Algorithm Type

`state_engine` — evaluates multiple boolean checklist conditions and produces an aggregate readiness state.

---

## 4. Input Contract

| Field | Source Table | Data Type | Required | Validation |
|---|---|---|---|---|
| `hrs_since_dosing` | Computed from `log_dose_events.dose_timestamp` | FLOAT | YES | Must be ≥ 4.0 for READY |
| `ambulates_independently` | `log_release_checks.ambulates_independently` | BOOLEAN | YES | TRUE required for READY |
| `alert_and_oriented` | `log_release_checks.alert_and_oriented` | BOOLEAN | YES | TRUE required for READY |
| `vitals_stable` | `log_release_checks.vitals_stable` | BOOLEAN | YES | TRUE required for READY |
| `no_active_ae_grade3plus` | Computed from `log_adverse_events` — no open Grade 3+ events | BOOLEAN | YES | TRUE required for READY |
| `responsible_party_present` | `log_release_checks.responsible_party_present` | BOOLEAN | YES | TRUE required for READY |
| `practitioner_released_at` | `log_release_checks.practitioner_released_at` | TIMESTAMPTZ | NO | Set on practitioner release confirmation |
| `session_id` | `log_release_checks.session_id` | UUID | YES | FK to `log_sessions` |

---

## 5. Plain-English Logic Summary

1. Compute `hrs_since_dosing` from the most recent dose event timestamp to now.
2. Check all 5 boolean readiness criteria:
   - Patient has been observed for at least 4 hours since last dose
   - Patient can ambulate independently (not requiring support to walk)
   - Patient is alert and oriented (A&O x3 minimum)
   - Vital signs are within acceptable range (no active hemodynamic instability)
   - No open Grade 3+ adverse events logged in this session
   - Responsible party (escort/caregiver) is present
3. If ALL 6 conditions are TRUE: emit `release_ready = READY`
4. If ANY condition is FALSE: emit `release_ready = NOT_READY` with the failing conditions listed
5. Practitioner can confirm release at any time — this records `practitioner_released_at` regardless of the engine state (advisory only)

---

## 6. Formal Pseudo-Logic

```
FUNCTION release_ready_psilocybin(session_id: UUID) -> ENUM
  
  criteria = {
    hrs_sufficient: (NOW() - last_dose_timestamp) >= 4.0 hours,
    ambulates: log_release_checks.ambulates_independently = TRUE,
    alert: log_release_checks.alert_and_oriented = TRUE,
    vitals_ok: log_release_checks.vitals_stable = TRUE,
    no_grade3_ae: COUNT(log_adverse_events WHERE ae_grade >= 3 AND session_id = session_id AND resolved = FALSE) = 0,
    escort_present: log_release_checks.responsible_party_present = TRUE
  }
  
  IF ALL(criteria) = TRUE THEN
    RETURN 'READY'
  ELSE
    RETURN 'NOT_READY' WITH failing_criteria = [list of FALSE conditions]
  END IF

END FUNCTION
```

---

## 7. Thresholds and Controlled Vocabulary

| Criterion | Threshold | Rationale |
|---|---|---|
| Min observation time | 4.0 hours since last dose | Clinical standard for acute psilocybin effect duration |
| Ambulation | Pass/fail (boolean) | Safety — prevents falls during travel |
| Alert & Oriented | Pass/fail (A&O x3 minimum) | Cognitive clarity minimum for independent transport |
| Vitals stable | Pass/fail — practitioner judgment | No specific numeric threshold at V1; practitioner-assessed |
| No open Grade 3+ AE | Zero open events | Grade 3+ requires continued observation |
| Responsible party | Present at facility | Required for all psychedelic sessions per standard of care |

---

## 8. Confidence Level

`rule_based` — boolean checklist with one time-based computation. Output is deterministic given the same inputs. "Vitals stable" is practitioner-assessed (subjective input transforms to boolean), introducing one degree of practitioner judgment.

---

## 9. Missing Data Handling

| Scenario | Behavior |
|---|---|
| No dose event logged (session type = non-dosing prep only) | Engine returns N/A — suppress readiness check for prep-only sessions |
| `responsible_party_present` not checked | Defaults to NOT_READY — criterion treated as unmet until explicitly confirmed |
| `alert_and_oriented` not checked | Defaults to NOT_READY |
| Grade 3+ AE exists but `resolved = TRUE` | Does not block readiness — resolved AEs do not count against release |

---

## 10. Override Policy

Practitioner can record release at any time independent of engine state. `practitioner_released_at` is always writable. The engine state at time of release is logged for audit purposes — if the engine was `NOT_READY` when release was confirmed, the failing criteria are preserved in `log_release_checks.override_context`.

---

## 11. Report Surfaces

| Surface | Location |
|---|---|
| Phase 2 session closeout | Release readiness checklist panel (bottom of Phase 2 timeline) |
| Session PDF | Closeout section — shows checklist state at time of release |
| Practice analytics | Not currently surfaced (V1) |

---

## 12. Limitations

- "Vitals stable" is a practitioner-assessed boolean at V1 — not numerically validated by the engine. Future V2 can derive this from numeric vitals entries.
- 4-hour minimum is a conservative clinical heuristic — individual protocols may use shorter windows (e.g., shorter-duration compounds like DMT). This engine is psilocybin-specific.
- Engine does not account for compound interactions (e.g., psilocybin + lithium) that may extend the required observation window.

---

## 13. Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| V1.0.0 | 2026-03-25 | LEAD (WO-685) | Initial specification authored |
