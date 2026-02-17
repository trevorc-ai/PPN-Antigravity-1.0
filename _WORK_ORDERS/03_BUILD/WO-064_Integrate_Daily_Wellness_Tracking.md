---
id: WO-064
status: 03_BUILD
priority: P2 (High)
category: Feature
audience: Patient-Facing
implementation_order: 1
owner: BUILDER
failure_count: 0
---

# Integrate Daily Wellness Tracking Component

## User Request

Integrate existing `PulseCheckWidget.tsx` component to track daily wellness metrics (Connection, Sleep, Mood, Anxiety) during integration period.

## Context

**From:** ANALYST Phase 1 Compliance-Focused Visualizations  
**Purpose:** Track daily wellness metrics (NOT relapse prediction)

**Existing Component:**
- ✅ `PulseCheckWidget.tsx` - Daily pulse check tracking
- Location: `/src/components/arc-of-care/PulseCheckWidget.tsx`

**Compliance Value:**
- Integration adherence tracking
- Outcome pattern documentation
- Patient engagement metrics

## Acceptance Criteria

### Phase 1: Integration
- [ ] Integrate `PulseCheckWidget.tsx` into integration workflow
- [ ] Connect to `log_pulse_checks` table
- [ ] Display 4 metrics: Connection (1-5), Sleep (1-5), Mood (1-5), Anxiety (1-5)
- [ ] Support daily entry with date tracking

### Phase 2: Visual Enhancements
- [ ] 7-day trend line chart
- [ ] 30-day calendar heatmap
- [ ] Average score cards (7-day, 30-day)
- [ ] Completion rate indicator

### Phase 3: Compliance Features
- [ ] "Export Pulse Check Data (CSV)" button
- [ ] Include completion rate in export
- [ ] Add trend direction indicators (↑ improving, ↓ declining, → stable)

### Phase 4: Component Showcase Integration
- [ ] After QA approval, add component to ComponentShowcase.tsx
- [ ] Add demo section with mock pulse check data (7-day and 30-day)
- [ ] Include component description and features list
- [ ] Verify component renders correctly in showcase

### Phase 5: Filtering & Comparative Analysis
- [ ] Filter pulse checks by: date range, substance, baseline severity
- [ ] Compare adherence rates across cohorts (e.g., "High ACE: 68% completion vs Low ACE: 82%")
- [ ] Add "Trend Analysis" (improving/stable/declining over 30 days)
- [ ] Export filtered pulse check data (CSV)

## Technical Notes

**Database Schema:**
- Table: `log_pulse_checks`
- Fields: `connection_rating`, `sleep_rating`, `mood_rating`, `anxiety_rating`, `check_date`

**Language Rules (No Medical Advice):**
- ✅ "Mood rating: 3/5 on 2026-02-15"
- ✅ "7-day average: Connection 4.2, Sleep 3.8, Mood 3.5, Anxiety 2.9"
- ❌ "Patient is relapsing" (clinical assessment)

**Label:** "Daily Wellness Data Trends" (NOT "Relapse Monitoring")

## Estimated Effort

**Total:** 1 day
- Integration: 0.25 days
- Visual enhancements: 0.5 days
- Compliance features: 0.25 days

## Dependencies

- Database connection to `log_pulse_checks`
- Existing `PulseCheckWidget.tsx` component functional
- Recharts library for trend visualization

## Success Metrics

- [ ] Daily entry supported with date tracking
- [ ] 7-day and 30-day trends displayed
- [ ] CSV export functional
- [ ] No clinical assessment language (objective data only)
