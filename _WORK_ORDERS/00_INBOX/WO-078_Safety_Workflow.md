---
id: WO-078
status: 00_INBOX
priority: P1 (Critical)
category: Feature
owner: PENDING_LEAD_ASSIGNMENT
failure_count: 0
---

# Benchmark Enablement: Safety Workflow & Monitoring

## User Request
Build comprehensive safety event capture and monitoring system (1 of 5 benchmark requirements).

## Strategic Context
> "Safety event capture" is a non-negotiable benchmark requirement
> "Liability anxiety is high - practitioners need defensible documentation"

**North Star Metric:** Benchmark-ready episodes per month (requires safety event capture)

## LEAD ARCHITECTURE

### Technical Strategy
Create structured safety check system with C-SSRS screening, high-risk alerts, and safety timeline visualization.

### Files to Touch
- `src/components/safety/StructuredSafetyCheck.tsx` (NEW)
- `src/components/safety/SafetyAlert.tsx` (NEW)
- `src/components/safety/SafetyTimeline.tsx` (NEW)
- `src/hooks/useSafetyMonitoring.ts` (NEW)
- `src/utils/cssrsScoring.ts` (NEW)
- `src/services/alertService.ts` (NEW)
- `src/pages/WellnessJourney.tsx` (MODIFY)

### Constraints
- Must integrate C-SSRS screening (Columbia Suicide Severity Rating Scale)
- Must auto-flag patients with score ≥ 3
- Must support push notifications for high-risk alerts
- Must be exportable for audit

## Proposed Changes

### Component 1: Structured Safety Check Form

**UI:**
```
┌─────────────────────────────────────┐
│ 🚨 Structured Safety Check          │
│                                     │
│ Check-In Date: Feb 17, 2026         │
│                                     │
│ C-SSRS Screening:                   │
│ ○ No suicidal ideation (Score: 0)   │
│ ○ Passive ideation (Score: 1-2)     │
│ ○ Active ideation (Score: 3-4)      │
│ ● Active with plan (Score: 5)       │
│                                     │
│ ⚠️ HIGH RISK DETECTED               │
│                                     │
│ Safety Concerns:                    │
│ ☑ Suicidal ideation                 │
│ ☐ Self-harm behaviors               │
│ ☐ Substance misuse                  │
│ ☐ Psychotic symptoms                │
│                                     │
│ Actions Taken:                      │
│ ☑ Emergency contact notified        │
│ ☑ Safety plan created               │
│ ☑ Follow-up scheduled (24 hours)    │
│                                     │
│ [Submit Safety Check]               │
└─────────────────────────────────────┘
```

**C-SSRS Scoring:**
- **Score 0:** No suicidal ideation
- **Score 1-2:** Passive ideation (no plan)
- **Score 3-4:** Active ideation (with some intent)
- **Score 5:** Active ideation with plan (HIGH RISK)

**Auto-Actions:**
- Score ≥ 3: Auto-flag patient as high-risk
- Score = 5: Trigger immediate alert to practitioner
- All scores: Log to safety timeline

---

### Component 2: High-Risk Alert System

**UI:**
```
🚨 HIGH RISK ALERT

Patient PT-XLMR3WZP flagged for:
- C-SSRS Score: 5 (Active ideation with plan)
- Logged: Feb 17, 2026 at 2:30 PM

Immediate Actions Required:
1. Contact patient within 1 hour
2. Activate safety protocol
3. Document all interventions

[Contact Patient] [View Safety Plan] [Document Intervention]
```

**Alert Triggers:**
- C-SSRS score ≥ 3
- PHQ-9 score ≥ 20 (severe depression)
- PCL-5 score ≥ 33 (significant PTSD)
- Self-harm behaviors reported
- Substance misuse reported

**Alert Delivery:**
- Push notification (mobile/desktop)
- Email notification
- In-app banner (persistent until acknowledged)

---

### Component 3: Safety Timeline Visualization

**UI:**
```
┌─────────────────────────────────────┐
│ 🛡️ Safety Event Timeline            │
│                                     │
│ Feb 17 🔴 C-SSRS: 5 (High Risk)     │
│        ↳ Actions: Emergency contact,│
│          Safety plan, Follow-up     │
│                                     │
│ Feb 10 🟡 C-SSRS: 3 (Moderate Risk) │
│        ↳ Actions: Check-in scheduled│
│                                     │
│ Feb 3  🟢 C-SSRS: 1 (Low Risk)      │
│        ↳ No actions needed          │
│                                     │
│ Jan 27 🟢 C-SSRS: 0 (No Risk)       │
│        ↳ Routine monitoring         │
│                                     │
│ [Export Safety Report]              │
└─────────────────────────────────────┘
```

**Features:**
- Chronological view of all safety checks
- Color-coded by severity (🔴 red = high, 🟡 yellow = moderate, 🟢 green = low)
- Shows actions taken for each event
- Exportable as PDF for audit

---

## Verification Plan

### Automated Tests
```bash
npm run test -- StructuredSafetyCheck.test.tsx
npm run test -- SafetyAlert.test.tsx
npm run test -- cssrsScoring.test.ts
```

### Manual Verification
1. **C-SSRS Scoring:** Verify correct score calculation
2. **High-Risk Alert:** Verify triggers when score ≥ 3
3. **Push Notification:** Verify alert delivered to practitioner
4. **Safety Timeline:** Verify shows all events chronologically
5. **Color Coding:** Verify red/yellow/green severity indicators
6. **Export:** Verify safety report exports as PDF
7. **Benchmark:** Verify safety check counts toward "5/5 benchmark-ready"

### Accessibility
- Keyboard navigation (Tab, Enter)
- Screen reader announces risk level
- Color + text labels (not color-only)
- High contrast mode compatible

---

## Dependencies
- Patient context
- C-SSRS scoring algorithm
- Push notification service
- PDF export service

## Estimated Effort
**12-16 hours** (3-4 days)

## Success Criteria
- ✅ C-SSRS screening integrated
- ✅ Auto-flags patients with score ≥ 3
- ✅ Push notifications for high-risk alerts
- ✅ Safety timeline shows all events chronologically
- ✅ Exportable for audit
- ✅ Counts toward "5/5 benchmark-ready"
- ✅ Color-coded severity indicators

---

**Status:** Ready for LEAD assignment
