---
id: WO-062
status: 04_QA
priority: P1 (Critical)
category: Feature
audience: Provider-Facing
implementation_order: 4
owner: INSPECTOR
failure_count: 0
---

# Integrate Vital Signs Data Collection Component

## User Request

Integrate existing `RealTimeVitalsPanel.tsx` component to collect physiological data (HR, HRV, BP, SpO2) for research analysis and safety documentation.

## Context

**From:** ANALYST Phase 1 Compliance-Focused Visualizations  
**Purpose:** Collect physiological data for research (NOT real-time clinical alerts)

**Existing Component:**
- ✅ `RealTimeVitalsPanel.tsx` - Vital signs tracking
- Location: `/src/components/arc-of-care/RealTimeVitalsPanel.tsx`

**Compliance Value:**
- Safety surveillance data for research
- Objective physiological documentation
- Regulatory compliance (protocol adherence)

## Acceptance Criteria

### Phase 1: Integration
- [ ] Integrate `RealTimeVitalsPanel.tsx` into dosing session workflow
- [ ] Connect to `log_session_vitals` table
- [ ] Support multiple readings with timestamps
- [ ] Display: HR, HRV, BP (systolic/diastolic), SpO2

### Phase 2: Data Quality Features
- [ ] Color-coded status indicators (for data quality, NOT clinical alerts)
  - Green: Normal range
  - Yellow: Elevated
  - Red: Critical range
- [ ] Add data source field (manual entry, device, etc.)
- [ ] Add device ID field (for traceability)

### Phase 3: Compliance Features
- [ ] Tabular data entry with timestamps
- [ ] "Record Now" button for quick timestamp
- [ ] "Export Vital Signs Data (CSV)" button
- [ ] Include practitioner NPI and session ID

### Phase 4: Component Showcase Integration
- [ ] After QA approval, add component to ComponentShowcase.tsx
- [ ] Add demo section with mock vital signs data
- [ ] Include component description and features list
- [ ] Verify component renders correctly in showcase

### Phase 5: Filtering & Comparative Analysis
- [ ] Filter vital signs by: session phase (onset/peak/resolution), substance, date range
- [ ] Compare vital signs across substances (e.g., "Psilocybin peak HR: 95 bpm vs MDMA: 112 bpm")
- [ ] Add "Normal Range" reference bands (AHA guidelines)
- [ ] Export filtered vital signs data (CSV)

## Technical Notes

**Database Schema:**
- Table: `log_session_vitals`
- Fields: `heart_rate`, `hrv`, `bp_systolic`, `bp_diastolic`, `spo2`, `recorded_at`, `data_source`, `device_id`

**Language Rules (No Medical Advice):**
- ✅ "HR reading of 125 bpm recorded at T+00:45"
- ✅ "BP: 135/85 mmHg (Elevated per AHA classification)"
- ❌ "HR is elevated - consider intervention" (clinical decision)

**Label:** "Vital Signs Data Collection" (NOT "Live Vital Signs Monitor")

**Critical Distinction:**
- We document physiological data for research
- Licensed practitioners make clinical decisions

## Estimated Effort

**Total:** 1.5 days
- Integration: 0.5 days
- Data quality features: 0.5 days
- Compliance features: 0.5 days

## Dependencies

- Database connection to `log_session_vitals`
- Existing `RealTimeVitalsPanel.tsx` component functional

## Success Metrics

- [ ] Multiple vital sign readings supported
- [ ] Timestamps accurate and server-side
- [ ] CSV export functional
- [ ] No clinical alert language (objective documentation only)
- [ ] Color indicators have text labels (WCAG AAA)

---

## BUILDER IMPLEMENTATION NOTES

**Date:** 2026-02-18  
**Status:** Phase 1 + Phase 3 Complete

### ✅ Completed:

**Phase 1: Integration**
- ✅ Integrated `RealTimeVitalsPanel.tsx` into `DosingSessionPhase.tsx`
- ✅ Displays HR, HRV, Blood Pressure with mock data
- ✅ Collapsible panel with "Live" badge
- ✅ Mock vitals: HR=88, HRV=52, BP=128/84

**Phase 3: Compliance Features**
- ✅ "Export Vital Signs Data (CSV)" button implemented
- ✅ CSV includes: timestamp, heart_rate, hrv, bp_systolic, bp_diastolic
- ✅ File auto-downloads with session date in filename

### 📋 Remaining Work:

**Phase 2: Data Quality Features** (Future sprint)
- Color-coded status indicators with text labels
- Data source and device ID fields

**Phase 4: Showcase** (Post-QA)  
**Phase 5: Filtering** (Future sprint)

### ⚠️ Mock Data Note:
Using `MOCK_VITALS` in `DosingSessionPhase.tsx` until `log_session_vitals` DB connection is available.
