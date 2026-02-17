---
id: WO-079
status: 00_INBOX
priority: P1 (Critical)
category: Feature
owner: PENDING_LEAD_ASSIGNMENT
failure_count: 0
---

# Benchmark Enablement: Risk Indicators & Anomaly Detection

## User Request
Build auto-detection system for high-risk patients based on baseline and ongoing assessments.

## Strategic Context
> "If outcomes are inconsistent, I will be blamed, audited, or sued"
> "Practitioners need early warning systems for patient safety"

**Impact:** Reduces practitioner liability by flagging concerning patterns early

## LEAD ARCHITECTURE

### Technical Strategy
Create intelligent risk detection system that auto-flags patients based on baseline scores, vital sign anomalies, and declining progress trends.

### Files to Touch
- `src/components/risk/RiskIndicators.tsx` (NEW)
- `src/components/risk/BaselineRiskFlags.tsx` (NEW)
- `src/components/risk/SessionRiskFlags.tsx` (NEW)
- `src/components/risk/ProgressRiskFlags.tsx` (NEW)
- `src/hooks/useRiskDetection.ts` (NEW)
- `src/utils/riskCalculator.ts` (NEW)
- `src/pages/WellnessJourney.tsx` (MODIFY)

### Constraints
- Must auto-detect without manual input
- Must provide actionable recommendations
- Must be color-coded with text labels (accessibility)
- Must update in real-time as data changes

## Proposed Changes

### Component 1: Baseline Risk Indicators

**UI:**
```
⚠️ RISK INDICATORS DETECTED

Patient PT-XLMR3WZP:
🔴 Severe Depression (PHQ-9: 21)
🔴 Significant PTSD (PCL-5: 85)
🟡 Moderate Anxiety (GAD-7: 12)
🟡 Childhood Trauma (ACE: 4)

Recommended Actions:
- Trauma-informed approach required
- Close monitoring during session
- Have rescue medication available
- Ensure experienced practitioner present

[View Treatment Recommendations]
```

**Risk Thresholds:**
- **PHQ-9 (Depression):**
  - 🔴 ≥ 20 (Severe)
  - 🟡 15-19 (Moderately severe)
  - 🟢 < 15 (Mild-moderate)

- **GAD-7 (Anxiety):**
  - 🔴 ≥ 15 (Severe)
  - 🟡 10-14 (Moderate)
  - 🟢 < 10 (Mild)

- **PCL-5 (PTSD):**
  - 🔴 ≥ 33 (Significant symptoms)
  - 🟢 < 33 (Below threshold)

- **ACE (Childhood Adversity):**
  - 🔴 ≥ 6 (High adversity)
  - 🟡 4-5 (Moderate adversity)
  - 🟢 < 4 (Low adversity)

---

### Component 2: Session Risk Indicators (Vitals Anomaly Detection)

**UI:**
```
⚠️ VITALS ANOMALY DETECTED

Session Time: 2h 15min
HR: 95 bpm (↑ 33% from baseline: 72 bpm)
BP: 140/90 mmHg (↑ from baseline: 120/80)

Recommended Actions:
- Monitor closely
- Consider reducing stimulation
- Have rescue medication ready
- Document in session notes

[View Vital Signs History]
```

**Anomaly Detection Logic:**
- **Heart Rate:** Flag if >30% change from baseline
- **Blood Pressure:** Flag if systolic >130 or diastolic >85
- **SpO2:** Flag if <95%
- **Temperature:** Flag if >99.5°F or <97.0°F

---

### Component 3: Progress Risk Indicators (Declining Trends)

**UI:**
```
⚠️ DECLINING PROGRESS DETECTED

PHQ-9 Trend:
Week 1: 18 (↓ from 21)
Week 2: 15 (↓ from 18)
Week 3: 17 (↑ from 15) ⚠️
Week 4: 19 (↑ from 17) 🔴

Recommended Actions:
- Schedule additional integration session
- Assess for external stressors
- Consider booster session
- Review treatment plan

[Schedule Integration Session]
```

**Declining Trend Logic:**
- Flag if metric increases for 2+ consecutive weeks
- Flag if metric returns to within 10% of baseline
- Flag if improvement rate slows significantly

---

### Component 4: Risk Dashboard Widget

**UI:**
```
┌─────────────────────────────────────┐
│ 🚨 Risk Summary                     │
│                                     │
│ Current Risk Level: 🟡 MODERATE     │
│                                     │
│ Active Flags:                       │
│ 🔴 Severe Depression (PHQ-9: 21)    │
│ 🔴 Significant PTSD (PCL-5: 85)     │
│ 🟡 Moderate Anxiety (GAD-7: 12)     │
│                                     │
│ Recent Changes:                     │
│ ↑ PHQ-9 increased by 2 points       │
│                                     │
│ [View Full Risk Report]             │
└─────────────────────────────────────┘
```

---

## Verification Plan

### Automated Tests
```bash
npm run test -- RiskIndicators.test.tsx
npm run test -- riskCalculator.test.ts
npm run test -- useRiskDetection.test.ts
```

### Manual Verification
1. **Baseline Flags:** Verify auto-flags PHQ-9 ≥ 20, GAD-7 ≥ 15, PCL-5 ≥ 33
2. **Vitals Anomaly:** Verify flags HR >30% change from baseline
3. **Declining Trend:** Verify flags when metric increases 2+ weeks
4. **Color Coding:** Verify red/yellow/green severity indicators
5. **Recommendations:** Verify actionable recommendations provided
6. **Real-Time Update:** Verify updates immediately after form submission
7. **Risk Dashboard:** Verify shows current risk level and active flags

### Accessibility
- Keyboard navigation (Tab, Enter)
- Screen reader announces risk level
- Color + text labels (not color-only)
- High contrast mode compatible

---

## Dependencies
- Patient baseline data
- Ongoing assessment data
- Vital signs data
- Risk threshold configurations

## Estimated Effort
**8-12 hours** (2-3 days)

## Success Criteria
- ✅ Auto-flags PHQ-9 ≥ 20, GAD-7 ≥ 15, PCL-5 ≥ 33
- ✅ Detects vital sign anomalies (>30% change)
- ✅ Detects declining progress trends
- ✅ Provides actionable recommendations
- ✅ Color-coded severity (red/yellow/green)
- ✅ Updates in real-time
- ✅ Risk dashboard shows current status

---

**Status:** Ready for LEAD assignment
