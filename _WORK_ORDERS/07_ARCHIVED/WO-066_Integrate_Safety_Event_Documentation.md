---
id: WO-066
status: 03_BUILD
priority: P1 (Critical)
category: Feature
audience: Provider-Facing
implementation_order: 7
owner: BUILDER
failure_count: 0
---

# Integrate Safety Event Documentation

## User Request

Integrate existing arc-of-care components to document adverse events and interventions during dosing sessions for safety surveillance and regulatory compliance.

## Context

**From:** ANALYST Phase 2 (Dosing Session) Visualizations  
**Purpose:** Safety surveillance for research (NOT real-time clinical alerts)

**Existing Components:**
- ✅ `RescueProtocolChecklist.tsx` - Intervention tracking
- ✅ `RedAlertPanel.tsx` - C-SSRS alert system

**Gap:** Adverse event logger

## Acceptance Criteria

### Phase 1: Integration
- [ ] Integrate `RescueProtocolChecklist.tsx` for intervention tracking
- [ ] Integrate `RedAlertPanel.tsx` for C-SSRS alerts (≥3 triggers alert)
- [ ] Connect to `log_interventions` table
- [ ] Connect to `log_safety_alerts` table

### Phase 2: Build Adverse Event Logger
- [ ] Build adverse event logger component
- [ ] Event type selector (from `ref_adverse_events`)
- [ ] Severity selector (mild/moderate/severe)
- [ ] Timestamp and duration fields
- [ ] Connect to `log_adverse_events` table

### Phase 3: Supervisor Acknowledgment
- [ ] Red alert requires supervisor acknowledgment
- [ ] Log supervisor NPI and timestamp
- [ ] Email notification to supervisor (optional)

### Phase 4: Component Showcase Integration
- [ ] After QA approval, add component to ComponentShowcase.tsx
- [ ] Add demo section with mock safety data
- [ ] Include component description and features list
- [ ] Verify component renders correctly in showcase

### Phase 5: Filtering & Comparative Analysis
- [ ] Filter by: substance, severity, site_id, date range
- [ ] Compare adverse event rates across substances
- [ ] Compare intervention types by substance
- [ ] Export safety data (CSV)

## Technical Notes

**Database Schema:**
- Tables: `log_adverse_events`, `log_interventions`, `log_safety_alerts`
- Foreign keys: `session_id`, `substance_id`, `created_by`

**Language Rules (No Medical Advice):**
- ✅ \"Adverse event documented: Nausea (mild) at T+01:15\"
- ✅ \"Intervention: Grounding technique at T+01:20 by Dr. Chen\"
- ❌ \"Patient had a bad trip\" (subjective assessment)

## Estimated Effort

**Total:** 1.5 days
- Phase 1 (Integration): 0.5 days
- Phase 2 (Adverse event logger): 0.5 days
- Phase 3 (Supervisor acknowledgment): 0.25 days
- Phase 4 (Showcase): 0.125 days
- Phase 5 (Filtering): 0.125 days

## Dependencies

- Database connections to safety tables
- Existing RescueProtocolChecklist and RedAlertPanel functional
- ref_adverse_events table populated

## Success Metrics

- [ ] Adverse events logged with severity and timestamp
- [ ] Interventions tracked with practitioner NPI
- [ ] Red alerts require supervisor acknowledgment
- [ ] CSV export functional
- [ ] No clinical alert language (objective documentation only)
