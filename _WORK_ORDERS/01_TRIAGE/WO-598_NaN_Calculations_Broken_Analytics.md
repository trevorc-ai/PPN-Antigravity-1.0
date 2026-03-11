# WO-598 — NaN% Calculations + Broken Analytics Metrics

**Status:** 01_TRIAGE
**Priority:** P1 — HIGH
**Author:** INSPECTOR
**Date:** 2026-03-10
**Source:** QA Session 03-10, phase3, dashboard, analytics screenshots

---

## Problem

Multiple calculation failures across the app:

### A — PHQ-9 Progress shows NaN%
Progress Summary and Phase 3 reports show `NaN%` for PHQ-9 change and `0/27` scores. The delta arrow between Baseline and Week 21 is blank.

Root cause: likely a division by zero or missing baseline value — `log_baseline_assessments` shows many NULL `phq9_score` values, so the formula fails.

### B — Dashboard Analytics: Impossible Values
- "Top 101% nationally" (impossible — max is 100%)
- "NaN% below network average"
- Most counters show `0` despite logged activity

### C — Compliance Dashboard: 0% Despite Data Logged
Phase 3 Compliance Dashboard shows 0% for "Daily Pulse" and "Weekly PHQ-9" even after data was recorded in this session. Frontend is not reading back from DB correctly.

## Required Fixes

- [ ] Guard all percentage calculations against null/zero divisors (return "—" or "N/A" instead of NaN)
- [ ] Cap all percentile values at 100% maximum
- [ ] Fix compliance dashboard to read actual `log_pulse_checks` and `log_longitudinal_assessments` row counts
- [ ] Fix delta arrow to show "No baseline recorded" if baseline PHQ-9 is NULL

## Related

- WO-592 session_status — some NaN issues may be from draft sessions being counted in averages
