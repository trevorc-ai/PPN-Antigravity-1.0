# PPN Algorithm Specification — AE_NOTIFY_GRADE3PLUS_V1

---

## 1. Algorithm Identity

| Field | Value |
|---|---|
| **Algorithm ID** | `AE_NOTIFY_GRADE3PLUS_V1` |
| **Class** | Adverse Event Notification |
| **Status** | ACTIVE |
| **Version** | V1.0.0 |
| **Owner** | LEAD / Clinical Safety |
| **Created** | 2026-03-25 |
| **Last Reviewed** | 2026-03-25 |
| **WO Origin** | WO-685 |

---

## 2. Business and Clinical Purpose

Detects when a logged adverse event (AE) meets or exceeds Grade 3 severity on the CTCAE (Common Terminology Criteria for Adverse Events) 5-point grading scale, and generates an actionable notification flag for the practitioner. Grade 3 events represent severe or medically significant events that are not immediately life-threatening but require prompt clinical action. This engine is the primary safety reporting trigger in PPN.

**Regulatory relevance:** Grade 3+ events typically trigger sponsor or IRB notification requirements in clinical trial contexts. BUILDER NOTE: The platform must not prevent the practitioner from proceeding — it flags and documents.

---

## 3. Algorithm Type

`event_classification_engine` — evaluates a single structured input against a threshold rule and emits a boolean flag + notification payload.

---

## 4. Input Contract

| Field | Source Table | Data Type | Required | Validation |
|---|---|---|---|---|
| `ae_grade` | `log_adverse_events.ae_grade` | INTEGER (1–5) | YES | Must be 1–5; NULL rejected |
| `ae_severity_label` | `ref_ae_severity_grades.label` | VARCHAR | YES | FK to `ref_ae_severity_grades` |
| `session_id` | `log_adverse_events.session_id` | UUID | YES | FK to `log_sessions` |
| `ae_timestamp` | `log_adverse_events.ae_timestamp` | TIMESTAMPTZ | YES | Must be within active session window |
| `practitioner_id` | `log_sessions.practitioner_id` | UUID | YES | RLS-enforced |

---

## 5. Plain-English Logic Summary

1. A new row is inserted into `log_adverse_events` with an `ae_grade` value.
2. The engine checks: is `ae_grade >= 3`?
3. If YES: emit notification flag `ae_notify_grade3plus = true`, log notification record in `log_ae_notifications` with timestamp and `ae_grade`.
4. If NO: no notification emitted. Event is logged normally.
5. Notification is advisory only — the practitioner retains full clinical authority. No session block is triggered by this engine.

---

## 6. Formal Pseudo-Logic

```
FUNCTION ae_notify_grade3plus(ae_grade: INTEGER) -> BOOLEAN
  PRECONDITION: ae_grade IN (1, 2, 3, 4, 5)
  IF ae_grade >= 3 THEN
    INSERT INTO log_ae_notifications (session_id, ae_grade, notified_at)
    RETURN TRUE  -- trigger UI notification banner
  ELSE
    RETURN FALSE -- silent, no notification
  END IF
END FUNCTION
```

---

## 7. Thresholds and Controlled Vocabulary

| Grade | Label | Notification Triggered |
|---|---|---|
| 1 | Mild | NO |
| 2 | Moderate | NO |
| 3 | Severe | YES |
| 4 | Life-threatening | YES |
| 5 | Death | YES |

Source: CTCAE v5.0 (NCI). Vocabulary stored in `ref_ae_severity_grades`.

---

## 8. Confidence Level

`deterministic` — binary threshold on a structured integer. No probability, no estimation. Output is fully reproducible given the same input.

---

## 9. Missing Data Handling

| Scenario | Behavior |
|---|---|
| `ae_grade` is NULL | Reject insert. Validation error surfaced in UI. |
| `ae_grade` out of range (< 1 or > 5) | Reject insert. DB CHECK constraint enforced. |
| `session_id` not found | FK constraint violation — row not written. |

---

## 10. Override Policy

Practitioners cannot override the notification trigger. The notification is advisory, but it is always generated when `ae_grade >= 3`. There is no "suppress notification" flag at V1.

---

## 11. Report Surfaces

| Surface | Location |
|---|---|
| Phase 2 Live Session banner | `QTIntervalTracker.tsx` area, adverse event section |
| Session summary PDF | AE section — flagged events appear in bold with grade label |
| Practice analytics | `SafetyRiskMatrix` — open AE grade distribution chart |
| Export (CSV/Excel) | `SessionExportCenter.tsx` — `ae_grade` included in raw export |

---

## 12. Limitations

- V1 engine uses a simple integer threshold only. It does not account for AE trajectory (e.g., Grade 2 → Grade 2 repeated within 30 min may be clinically significant but is not flagged differently).
- Engine does not de-duplicate: if an AE is edited from Grade 2 to Grade 3, a new notification is generated rather than updating the prior notification.
- No automated escalation pathway (e.g., to on-call physician). Notification is practitioner-facing only.

---

## 13. Change Log

| Version | Date | Author | Change |
|---|---|---|---|
| V1.0.0 | 2026-03-25 | LEAD (WO-685) | Initial specification authored |
