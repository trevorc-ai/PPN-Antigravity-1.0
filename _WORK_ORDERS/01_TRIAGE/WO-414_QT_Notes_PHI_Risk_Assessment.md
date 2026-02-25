---
id: WO-414
title: "QT Interval Tracker — Notes Field PHI Risk Assessment"
status: 01_TRIAGE
owner: LEAD
created: 2026-02-25
created_by: PRODDY
failure_count: 0
priority: P2
tags: [phi-risk, qt-tracker, compliance, wellness-journey, notes-field]
depends_on: [WO-413]
---

# WO-414: QT Notes Field — PHI Risk Assessment

## Why This Ticket Exists

During PRD authorship for `WO-413` (QT Interval Tracker), a question arose that could not be resolved by PRODDY:

> The `QTIntervalTracker` component includes an optional free-text "Notes" field per reading row (e.g., "Patient reported chest tightness", "Second device lag noted"). If a facilitator types a symptom description or clinical observation into this field, does it constitute Protected Health Information (PHI) under HIPAA — and if so, how do we store or discard it safely?

This question was deferred from WO-413. The Notes column has been **removed from the component scope entirely** for the current sprint. This ticket exists to make a permanent architectural decision before that field is ever added.

---

## The Decision That Needs to Be Made

| Scenario | Implication |
|---|---|
| Notes are **never persisted** (ephemeral in-session only) | Zero PHI risk — data evaporates on session end. Simple. |
| Notes are **persisted to a `log_` table** as free text | **Direct PHI violation** — our architecture forbids free-text clinical notes per the Global Constitution. Requires redesign. |
| Notes are **persisted as a coded reference** (e.g., "symptom_reported" FK to `ref_qt_observations`) | Compliant — but requires SOOP to define the reference table and limits expressivity. |
| Notes are **exported-only** (printed at session end, never stored) | Compliant if never written to DB, but needs a client-side print/export function. |

---

## What LEAD Needs to Decide

1. **Do we ever persist QT observation notes?** Yes / No / Export-only.
2. **If yes** — reference-coded only (SOOP to build `ref_qt_observations`) or free-text export that is never stored?
3. **Timing** — is this a sprint blocker, or can the Notes field stay excluded through the Dr. Allen pilot and be revisited post-Friday?

---

## PRODDY Recommendation (Non-Binding)

Recommend **export-only**: the Notes field renders in-session, facilitator types, and the content is included in any session PDF/print export but is never written to Supabase. This preserves clinical expressivity, eliminates PHI risk entirely, and requires no SOOP migration.

LEAD and INSPECTOR to confirm before BUILDER implements.

---

## Routing

LEAD → INSPECTOR (PHI compliance ruling) → BUILDER (implementation of chosen approach) → 04_QA
