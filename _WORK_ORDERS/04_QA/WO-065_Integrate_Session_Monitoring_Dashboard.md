---
id: WO-065
status: 03_BUILD
priority: P1 (Critical)
category: Feature
audience: Provider-Facing
implementation_order: 6
owner: INSPECTOR
failure_count: 0
---

# Integrate Session Monitoring Dashboard

## User Request

Integrate existing arc-of-care components to create a comprehensive session monitoring dashboard for real-time data collection during dosing sessions.

## Context

**From:** ANALYST Phase 2 (Dosing Session) Visualizations  
**Purpose:** Objective session documentation for research (NOT real-time clinical monitoring)

**Existing Components:**
- ✅ `SessionTimeline.tsx` - Session phase tracking
- ✅ `RealTimeVitalsPanel.tsx` - Vital signs data entry
- ✅ `SessionMonitoringDashboard.tsx` - Comprehensive monitoring

**Gap:** Clinical observations log integration

## Acceptance Criteria

### Phase 1: Integration
- [ ] Integrate `SessionMonitoringDashboard.tsx` into dosing session workflow
- [ ] Connect to `log_clinical_records` table (session metadata)
- [ ] Connect to `log_session_vitals` table (vital signs)
- [ ] Connect to `log_session_observations` table (clinical observations)

### Phase 2: Clinical Observations Log
- [ ] Add clinical observations selector (from `ref_clinical_observations`)
- [ ] Timestamp each observation
- [ ] Link observations to session phase (onset/peak/resolution)
- [ ] Support multiple observations per session

### Phase 3: Session Notes
- [ ] Add practitioner notes field (provider-only, NOT patient-facing)
- [ ] Timestamp and link to practitioner NPI
- [ ] Character limit: 2000 characters
- [ ] Auto-save every 30 seconds

### Phase 4: Component Showcase Integration
- [ ] After QA approval, add component to ComponentShowcase.tsx
- [ ] Add demo section with mock session data
- [ ] Include component description and features list
- [ ] Verify component renders correctly in showcase

### Phase 5: Filtering & Comparative Analysis
- [ ] Filter sessions by: substance, dosage range, site_id, date range
- [ ] Compare session duration across substances
- [ ] Compare vital signs patterns by substance and phase
- [ ] Export filtered session data (CSV)

## Technical Notes

**Database Schema:**
- Tables: `log_clinical_records`, `log_session_vitals`, `log_session_observations`
- Foreign keys: `session_id`, `substance_id`, `site_id`, `created_by`

**Language Rules (No Medical Advice):**
- ✅ \"Session timeline: Dose → Onset (T+00:45) → Peak (T+02:30)\"
- ✅ \"Vital signs recorded at T+01:00: HR 125 bpm\"
- ✅ \"Clinical observation documented: Emotional release at T+01:30\"
- ❌ \"Patient is doing well\" (clinical assessment)

**Label:** \"Session Documentation Dashboard\" (NOT \"Session Monitoring\")

## Estimated Effort

**Total:** 2 days
- Phase 1 (Integration): 0.5 days
- Phase 2 (Clinical observations): 0.5 days
- Phase 3 (Session notes): 0.5 days
- Phase 4 (Showcase): 0.25 days
- Phase 5 (Filtering): 0.25 days

## Dependencies

- Database connections to session tables
- Existing SessionMonitoringDashboard component functional
- ref_clinical_observations table populated

## Success Metrics

- [ ] All session data entry points integrated
- [ ] Clinical observations linked to session phases
- [ ] Session notes auto-save functional
- [ ] CSV export working
- [ ] No clinical monitoring language (objective documentation only)
