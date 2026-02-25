---
id: WO-415
title: "Wearables ECG Integration — Apple Watch & Withings ScanWatch QT Data Feed"
status: 01_TRIAGE
owner: LEAD
created: 2026-02-25
created_by: LEAD
failure_count: 0
priority: P1
tags: [wearables, apple-watch, scanwatch, qt-interval, ecg, phase-2, vitals]
depends_on: [WO-413]
related: [WO-414]
blocked_by: "WO-413 QTIntervalTracker component must ship first — wearable feed is a data source for that component."
---

# WO-415: Wearables ECG Integration

## Why This Exists

During the Dr. Allen demo debrief (2026-02-24), Trevor noted that Apple Watch integration was "already installed." Per CUE analysis of the transcript:

> "We've already installed the integration so we can let all of their vitals be taken throughout the session from their Apple Watch."

This ticket was spun off from `WO-413` (QT Interval Tracker) when the user provided a full clinical ECG device landscape (2026-02-25) that confirmed two wearables are clinically studied for QT measurement:

- **Apple Watch (ECG app)** — Single-lead; reproducible QT measurements; widely studied; FDA-cleared ECG.
- **Withings ScanWatch** — Single-lead; studied for QT monitoring in ambulatory settings.

These devices are a natural complement to the `QTIntervalTracker` component: rather than manual typing, a wearable feed would auto-populate one or both device rows.

---

## The Feature

When a facilitator has paired a wearable device (Apple Watch or Withings ScanWatch) with the PPN Portal, the `QTIntervalTracker` component should offer an **"Import from [Device]"** option that pulls the most recent ECG QT reading from the device API and populates it into the next row — no manual entry required.

---

## Key Technical Questions for LEAD / PRODDY to Resolve Before Build

1. **Apple Watch integration status:** Trevor said it's "already installed." What integration exists? Is there a HealthKit bridge, a Web Bluetooth hook, or was this aspirational? LEAD needs to audit `src/` for any existing wearable code before PRODDY writes a PRD.

2. **Which API pathway?**
   - **Option A:** Apple HealthKit (iOS only) — requires a native iOS app or PWA with HealthKit bridge. Cannot run from a browser tab alone.
   - **Option B:** Apple Health CSV export + upload — lower fidelity, manual step, not real-time.
   - **Option C:** Withings API (OAuth 2.0 REST API) — web-accessible, requires clinic to have a Withings developer account and patient consent token.
   - **Option D:** Manual entry only (WO-413 baseline) — ship this and defer wearable auto-fill.

3. **Scope boundary:** Does "wearables integration" mean real-time streaming during a session, or end-of-session import? Real-time is a completely different architecture than a periodic pull.

4. **PHI implications:** Wearable ECG data attributed to a patient session — does this change the compliance posture? INSPECTOR to weigh in.

---

## Pre-Build Audit Task (LEAD → BUILDER)

Before PRODDY can spec this, BUILDER should run a quick audit:

```
grep -r "HealthKit\|healthkit\|watchOS\|withings\|Withings\|wearable\|bluetooth\|BLE" src/ --include="*.ts" --include="*.tsx" -l
```

Report back what exists. If nothing is found, the "already installed" claim is aspirational — LEAD will re-triage accordingly.

---

## ✅ LEAD Audit Result (2026-02-25)

Grep returned **zero results**. No HealthKit, Withings, Bluetooth, or wearable integration code exists anywhere in `src/`. The "already installed" claim from Trevor's demo transcript was aspirational.

**Implication:** WO-415 is a **greenfield feature**, not a continuation of existing work. PRODDY must write a full PRD before BUILDER touches anything. The technical feasibility question (HealthKit requires native iOS app vs. web PWA) is the critical first decision.

**LEAD decision:** Priority lowered to **P2**. This does not affect the Dr. Allen Friday pilot (WO-413 `QTIntervalTracker` handles manual entry, which is sufficient). Wearable auto-fill is a post-pilot enhancement.

---

## Routing

LEAD (audit complete ✅) → PRODDY (write PRD when P2 slot opens) → LEAD → BUILDER
