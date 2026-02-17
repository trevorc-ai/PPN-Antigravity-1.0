---
id: WO-061
status: 03_BUILD
priority: P1 (Critical)
category: Feature
audience: Provider-Facing
implementation_order: 2
owner: BUILDER
failure_count: 0
---

# Integrate Session Timeline Visualization Component

## User Request

Integrate existing `SessionTimeline.tsx` component to document session progression (Dose → Onset → Peak → Resolution) for protocol compliance and research documentation.

## Context

**From:** ANALYST Phase 1 Compliance-Focused Visualizations  
**Purpose:** Document session timeline for protocol adherence tracking (NOT real-time clinical monitoring)

**Existing Component:**
- ✅ `SessionTimeline.tsx` - Session phase tracking
- Location: `/src/components/arc-of-care/SessionTimeline.tsx`

**Compliance Value:**
- Proves protocol fidelity for research
- Documents session duration for analysis
- Provides audit trail for regulatory review

## Acceptance Criteria

### Phase 1: Integration
- [ ] Integrate `SessionTimeline.tsx` into dosing session workflow
- [ ] Connect to `log_clinical_records` table
- [ ] Display timestamps for: dose_time, onset_time, peak_time, resolution_time
- [ ] Calculate elapsed time between phases

### Phase 2: Compliance Features
- [ ] Add "Expected vs. Actual Duration" comparison
- [ ] Flag protocol deviations (e.g., session >8 hours)
- [ ] Add "Export Session Timeline (PDF)" button
- [ ] Include practitioner NPI and timestamp

### Phase 3: Visual Enhancements
- [ ] Horizontal timeline with phase markers
- [ ] Color-coded phases (blue → purple → pink → green)
- [ ] Elapsed time annotations
- [ ] Mobile-responsive layout

### Phase 4: Component Showcase Integration
- [ ] After QA approval, add component to ComponentShowcase.tsx
- [ ] Add demo section with mock session data
- [ ] Include component description and features list
- [ ] Verify component renders correctly in showcase

### Phase 5: Filtering & Comparative Analysis
- [ ] Filter sessions by: substance, dosage range, site_id, date range
- [ ] Compare session duration across substances (e.g., "Psilocybin avg: 6.2h vs MDMA avg: 4.8h")
- [ ] Add "Expected vs Actual" deviation analysis
- [ ] Export filtered session timeline data (CSV)

## Technical Notes

**Database Schema:**
- Table: `log_clinical_records`
- Fields: `dose_time`, `onset_time`, `peak_time`, `resolution_time`

**Language Rules (No Medical Advice):**
- ✅ "Session timeline documented per protocol"
- ✅ "Onset occurred at T+00:45 (expected: T+00:30-01:00)"
- ❌ "Session progressing normally" (clinical judgment)

**Label:** "Session Timeline Documentation" (NOT "Session Monitoring")

## Estimated Effort

**Total:** 1 day
- Integration: 0.5 days
- Compliance features: 0.25 days
- Visual polish: 0.25 days

## Dependencies

- Database connection to `log_clinical_records`
- Existing `SessionTimeline.tsx` component functional

## Success Metrics

- [ ] Timeline displays all 4 phases with timestamps
- [ ] Expected vs. actual comparison shown
- [ ] PDF export functional
- [ ] No clinical monitoring language (objective documentation only)
