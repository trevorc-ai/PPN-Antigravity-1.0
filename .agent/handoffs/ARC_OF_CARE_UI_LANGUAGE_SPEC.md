# Arc of Care: UI Language Specifications

**Document Type:** Implementation Reference  
**Created:** 2026-02-16T06:11:45-08:00  
**Purpose:** Compliant language for all UI elements  
**Scope:** Tooltips, labels, alerts, buttons, help text

---

## 🎯 Quick Reference: Language Substitutions

### Alert Headers
| ❌ Non-Compliant | ✅ Compliant |
|-----------------|-------------|
| "CRITICAL ALERT" | "Alert: High Severity" |
| "Immediate Action Required" | "Threshold Breach Detected" |
| "Patient at Risk" | "Score Exceeds Threshold" |
| "Intervention Needed" | "Data Change Detected" |

### Button Labels
| ❌ Non-Compliant | ✅ Compliant |
|-----------------|-------------|
| "Recommend Sessions" | "View Historical Data" |
| "Intervene Now" | "Review Patient Data" |
| "Escalate Alert" | "Acknowledge Alert" |
| "Schedule Emergency Session" | "Schedule Session" |

### Descriptive Text
| ❌ Non-Compliant | ✅ Compliant |
|-----------------|-------------|
| "Patient needs 6 sessions" | "Historical avg: 5.2 sessions (n=127)" |
| "Relapse detected" | "PHQ-9 increased by 8 points" |
| "High suicide risk" | "C-SSRS score: 4 (threshold: >3)" |
| "Treatment failing" | "Symptom scores trending upward" |

---

## 📋 COMPONENT-SPECIFIC LANGUAGE

### Phase 1: Baseline Assessment

#### Component: SetAndSettingCard.tsx

**Tooltip: Expectancy Scale Gauge**
```
✅ COMPLIANT:
"Treatment Expectancy Scale measures patient's belief in treatment effectiveness (1-100). 
Historical data shows correlation between expectancy and MEQ-30 scores. 
Score interpretation is for informational purposes only."

❌ NON-COMPLIANT:
"Low expectancy means patient won't benefit from treatment."
```

**Tooltip: ACE Score Bar Chart**
```
✅ COMPLIANT:
"Adverse Childhood Experiences (ACE) score ranges from 0-10. 
Historical data: Patients with ACE 4-6 attended an average of 5.2 integration sessions. 
Clinician determines appropriate integration schedule."

❌ NON-COMPLIANT:
"High ACE score means patient needs more integration sessions."
```

**Tooltip: GAD-7 Severity Zones**
```
✅ COMPLIANT:
"GAD-7 score ranges: 0-4 (minimal), 5-9 (mild), 10-14 (moderate), 15-21 (severe). 
Zones based on validated GAD-7 scoring guidelines. 
Clinical assessment determines treatment approach."

❌ NON-COMPLIANT:
"Severe anxiety - patient requires intensive treatment."
```

#### Component: PredictedIntegrationNeeds.tsx

**Section Header**
```
✅ COMPLIANT:
"Integration Session Analysis"

❌ NON-COMPLIANT:
"Recommended Integration Schedule"
```

**Body Text**
```
✅ COMPLIANT:
"Based on baseline assessment scores (ACE: 6, GAD-7: 14, PCL-5: 45):

Historical Data (Cohort Analysis):
• Patients with similar profiles attended 4-8 sessions (avg: 5.2, n=127)
• Session frequency: Weekly (42%), biweekly (38%), monthly (20%)

Clinician determines appropriate integration schedule based on individual patient needs."

❌ NON-COMPLIANT:
"Algorithm recommends 6 weekly integration sessions based on high trauma and anxiety scores."
```

---

### Phase 2: Session Monitoring

#### Component: SessionMonitoringDashboard.tsx

**Alert: Elevated Vitals**
```
✅ COMPLIANT:
"Alert: Blood Pressure Threshold
Current: 145/92 mmHg (baseline: 120/80 mmHg)
Threshold: 140/90 mmHg
Time: 11:30 AM (Peak)"

❌ NON-COMPLIANT:
"DANGER: Blood pressure critically high - administer rescue medication immediately!"
```

**Tooltip: Elapsed Time Counter**
```
✅ COMPLIANT:
"Session elapsed time since dose administration. 
Typical session duration: 4-6 hours for psilocybin, 2-3 hours for ketamine. 
Guide determines session end based on patient state."

❌ NON-COMPLIANT:
"Session should end after 6 hours."
```

#### Component: RescueProtocolChecklist.tsx

**Section Header**
```
✅ COMPLIANT:
"Intervention Log"

❌ NON-COMPLIANT:
"Rescue Protocol - Select Intervention"
```

**Intervention Options (Labels)**
```
✅ COMPLIANT:
□ Verbal Reassurance
□ Guided Breathing Technique
□ Physical Touch (Hand-holding)
□ Environment Adjustment (Lighting/Music)
□ Chemical Rescue (Benzodiazepine)
□ Chemical Rescue (Propranolol)

Note: Intervention selection at clinician's discretion based on session protocol.

❌ NON-COMPLIANT:
"Select appropriate intervention for patient's distress level."
```

#### Component: RealTimeVitalsPanel.tsx

**Tooltip: Heart Rate**
```
✅ COMPLIANT:
"Heart rate (bpm). Baseline: 72 bpm. 
Typical range during peak: 80-110 bpm. 
Alert threshold: >100 bpm. 
Clinician determines if intervention needed."

❌ NON-COMPLIANT:
"Heart rate too high - patient needs intervention."
```

**Tooltip: HRV (Heart Rate Variability)**
```
✅ COMPLIANT:
"Heart Rate Variability (ms). Higher HRV indicates better stress resilience. 
Baseline: 45 ms. 
HRV typically decreases during peak experience. 
Data for monitoring purposes only."

❌ NON-COMPLIANT:
"Low HRV means patient is stressed - use calming intervention."
```

---

### Phase 3: Integration Tracking

#### Component: PulseCheckWidget.tsx

**Question Labels**
```
✅ COMPLIANT:
"How connected do you feel today?" (1-5 scale)
"How did you sleep last night?" (1-5 scale)

❌ NON-COMPLIANT:
"Rate your treatment progress" (implies judgment)
```

**Submission Confirmation**
```
✅ COMPLIANT:
"Pulse check submitted. Thank you for completing today's check-in."

❌ NON-COMPLIANT:
"Great job! Your scores look good today."
```

#### Component: SymptomDecayCurveChart.tsx

**Chart Title**
```
✅ COMPLIANT:
"PHQ-9 Trajectory Analysis"

❌ NON-COMPLIANT:
"Depression Relapse Prediction"
```

**Tooltip: Afterglow Period Annotation**
```
✅ COMPLIANT:
"Afterglow Period (Days 1-14): Period of acute symptom improvement commonly observed post-session. 
Historical data: 78% of patients show PHQ-9 decrease during this period (n=342). 
Long-term outcomes vary by individual."

❌ NON-COMPLIANT:
"Afterglow period - symptoms will improve for 2 weeks then may relapse."
```

**Tooltip: Trend Line**
```
✅ COMPLIANT:
"Trend Analysis: PHQ-9 scores increasing at +2 points/week average over last 3 weeks. 
Historical comparison: 67% of patients with similar trajectories showed continued increase at Day 90 (n=127). 
Clinician assessment determines if follow-up needed."

❌ NON-COMPLIANT:
"Relapse predicted in 14 days - schedule booster session immediately."
```

#### Component: RedAlertPanel.tsx

**Alert Type: C-SSRS Spike**
```
✅ COMPLIANT:
"Alert: C-SSRS Threshold Breach
────────────────────────────
Severity: High (score >3)
Current Score: 4
Previous Score: 0
Score Change: +4 points
Assessment Date: 2026-02-15
Days Post-Session: 21

Alert Criteria: C-SSRS score >3 indicates presence of suicidal ideation with intent per C-SSRS scoring guidelines.

[Acknowledge Alert] [View Patient Record] [Add Notes]"

❌ NON-COMPLIANT:
"🚨 CRITICAL: Patient is suicidal - immediate psychiatric intervention required! 
Call patient within 1 hour or escalate to emergency services."
```

**Alert Type: PHQ-9 Regression**
```
✅ COMPLIANT:
"Alert: PHQ-9 Score Increase
────────────────────────────
Severity: Moderate (change ≥5 points)
Current Score: 17
Previous Score: 10
Score Change: +7 points
Assessment Date: 2026-02-14
Days Post-Session: 45

Alert Criteria: PHQ-9 increase ≥5 points from previous assessment.

[Acknowledge Alert] [View Trajectory] [Add Notes]"

❌ NON-COMPLIANT:
"⚠️ WARNING: Depression relapse detected! 
Patient needs immediate follow-up session to prevent further deterioration."
```

**Alert Type: Pulse Check Drop**
```
✅ COMPLIANT:
"Alert: Pulse Check Pattern
────────────────────────────
Severity: Low (connection <3 for 2+ days)
Connection Level: 2/5 (Day 14), 2/5 (Day 15)
Previous Levels: 4/5 (Day 12), 4/5 (Day 13)

Alert Criteria: Connection level <3 for 2 consecutive days.

[Acknowledge Alert] [View Pulse Check History] [Add Notes]"

❌ NON-COMPLIANT:
"Patient is disengaged from treatment - recommend outreach call to re-engage."
```

**Alert Acknowledgment Flow**
```
✅ COMPLIANT:
Step 1: Clinician clicks [Acknowledge Alert]
Step 2: Modal appears:
  "Acknowledge Alert
   ────────────────
   Alert ID: RA-00123
   Acknowledged by: Dr. Smith
   Acknowledged at: 2026-02-15 4:15 PM
   
   Clinical Notes (optional):
   [Text area for clinician notes]
   
   [Save] [Cancel]"

❌ NON-COMPLIANT:
Step 1: Clinician clicks [Acknowledge Alert]
Step 2: Modal appears:
  "Select Action:
   ○ Schedule emergency session
   ○ Call patient immediately
   ○ Escalate to crisis team
   ○ Monitor closely"
```

---

## 🎨 Color Coding Language

### Severity Indicators

**✅ COMPLIANT:**
- 🔴 Red: "High Severity (score >X threshold)"
- 🟡 Yellow: "Moderate Severity (score >Y threshold)"
- 🟢 Green: "Within Normal Range (<Z threshold)"

**❌ NON-COMPLIANT:**
- 🔴 Red: "DANGER - Act Now"
- 🟡 Yellow: "CAUTION - Monitor Closely"
- 🟢 Green: "SAFE - No Action Needed"

### Score Zones

**✅ COMPLIANT (PHQ-9 Example):**
```
Score Zones (PHQ-9 Validated Ranges):
🟢 0-4: Minimal depression
🟡 5-9: Mild depression
🟠 10-14: Moderate depression
🔴 15-19: Moderately severe depression
⚫ 20-27: Severe depression
```

**❌ NON-COMPLIANT:**
```
Risk Levels:
🟢 Safe - No treatment needed
🟡 Low Risk - Monitor
🟠 Moderate Risk - Intervention recommended
🔴 High Risk - Immediate action required
⚫ Critical - Emergency intervention
```

---

## 📊 Historical Data Presentation

### Format Template

**✅ COMPLIANT:**
```
"Historical Data (Cohort Analysis):
• Patients with [criteria]: [outcome] (avg: [X], n=[sample size])
• Time period: [date range]
• Note: Individual outcomes may vary. Clinician assessment required."
```

**Example:**
```
"Historical Data (Cohort Analysis):
• Patients with ACE 6-10: Attended 4-8 integration sessions (avg: 5.2, n=127)
• Patients with GAD-7 10-14: Attended 3-6 integration sessions (avg: 4.1, n=89)
• Time period: Jan 2024 - Dec 2025
• Note: Individual outcomes may vary. Clinician assessment required."
```

---

## 🔘 Button Label Standards

### Primary Actions
| Context | ✅ Compliant Label | ❌ Non-Compliant |
|---------|-------------------|------------------|
| View patient data | "View Patient Record" | "Check Patient" |
| Review alert | "Acknowledge Alert" | "Dismiss Alert" / "Resolve Alert" |
| Add notes | "Add Clinical Notes" | "Document Intervention" |
| Schedule session | "Schedule Session" | "Book Follow-Up" / "Arrange Appointment" |
| Export data | "Export Report" | "Generate Report" |

### Secondary Actions
| Context | ✅ Compliant Label | ❌ Non-Compliant |
|---------|-------------------|------------------|
| View historical data | "View Historical Data" | "See Recommendations" |
| View trajectory | "View Trajectory Analysis" | "View Prediction" |
| View cohort data | "View Cohort Comparison" | "Compare to Others" |

---

## 💬 Help Text & Tooltips

### General Pattern

**✅ COMPLIANT:**
```
"[What this is]: [Description]
[Historical context]: [Data with sample size]
[Disclaimer]: Clinician assessment determines [action]."
```

**Example:**
```
"MEQ-30 Score: Measures mystical experience quality (0-100 scale).
Historical data: Scores 60-100 associated with sustained symptom improvement in 73% of patients (n=342).
Disclaimer: Score interpretation requires clinical context. Individual outcomes vary."
```

---

## 🚨 Mandatory Disclaimers

### All Predictive Features
```
"Model based on historical data. Individual outcomes may vary. 
Clinician assessment required for treatment decisions."
```

### All Alerts
```
"Alert based on predefined threshold. Clinician assessment determines appropriate response."
```

### All Reports
```
"Data presented for clinical review. Not a substitute for clinical judgment."
```

### All Historical Comparisons
```
"Historical data from [n=X] patients. Individual outcomes may vary."
```

---

## ✅ Implementation Checklist

Before deploying any UI component:

- [ ] All headers use objective language (no "recommend", "should", "must")
- [ ] All alerts describe data thresholds, not clinical urgency
- [ ] All buttons use neutral action verbs ("View", "Acknowledge", "Add")
- [ ] All tooltips include context + historical data + disclaimer
- [ ] All color coding labeled with data thresholds, not risk levels
- [ ] All historical data includes sample size (n=X)
- [ ] All predictive features include mandatory disclaimer
- [ ] No language removes clinician decision-making authority

---

**END OF UI LANGUAGE SPECIFICATIONS**
