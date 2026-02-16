# Arc of Care: Legal & Regulatory Compliance Guidelines

**Document Type:** Compliance Framework  
**Created:** 2026-02-16T06:10:52-08:00  
**Status:** MANDATORY - All implementations must follow these guidelines  
**Scope:** Arc of Care system (all 3 phases)

---

## 🚨 CRITICAL PRINCIPLE

**The Arc of Care system is a DECISION SUPPORT TOOL, not a medical decision-making system.**

**What this means:**
- ✅ We present objective data and analytics
- ✅ We show historical patterns and trends
- ✅ We flag threshold breaches and data changes
- ❌ We DO NOT make clinical recommendations
- ❌ We DO NOT suggest specific interventions
- ❌ We DO NOT provide medical advice

**The clinician always makes the final decision.**

---

## 📋 PART 1: Language Compliance Framework

### ✅ COMPLIANT Language Patterns

**Pattern 1: Objective Data Presentation**
- "PHQ-9 score: 18 (previous: 10). Change: +8 points."
- "C-SSRS score: 4. Assessment date: 2026-02-15."
- "Pulse check: Connection level 2 for 2 consecutive days."
- "MEQ-30 score: 85. Historical range for this substance: 60-95."

**Pattern 2: Historical Context (Optional)**
- "Historical data: Patients with ACE scores 6-10 attended an average of 5.2 integration sessions."
- "Trend analysis: PHQ-9 scores increased by an average of 2 points/week over the last 3 weeks."
- "Cohort comparison: 73% of patients with similar baseline profiles showed sustained remission at 6 months."

**Pattern 3: Threshold Flagging**
- "Alert: C-SSRS score exceeds threshold of 3."
- "Alert: PHQ-9 score increased by 8 points (threshold: ≥5 points)."
- "Alert: Patient missed 2 consecutive pulse check submissions."

### ❌ NON-COMPLIANT Language Patterns

**Pattern 1: Clinical Recommendations**
- ❌ "Recommend scheduling emergency session."
- ❌ "Patient should attend 6 integration sessions."
- ❌ "Increase monitoring frequency."
- ❌ "Consider booster dose."

**Pattern 2: Diagnostic Language**
- ❌ "Patient is experiencing depression relapse."
- ❌ "Patient is at high suicide risk."
- ❌ "Patient is disengaged from treatment."
- ❌ "Patient has treatment-resistant depression."

**Pattern 3: Prescriptive Actions**
- ❌ "Immediate intervention required."
- ❌ "Call patient within 24 hours."
- ❌ "Schedule follow-up appointment."
- ❌ "Adjust medication dosage."

---

## 🎯 PART 2: Feature-Specific Compliance

### Phase 1: Baseline Assessment & Preparation

#### Feature: "Predicted Integration Needs"

**❌ NON-COMPLIANT:**
- "Algorithm recommends 6 integration sessions"
- "Risk level: High - patient needs intensive support"
- "Recommended schedule: Weekly sessions for 6 weeks"

**✅ COMPLIANT:**
```
Integration Session Analysis
────────────────────────────
Baseline Assessment Scores:
• ACE Score: 6 (moderate childhood trauma)
• GAD-7: 14 (moderate anxiety)
• PCL-5: 45 (probable PTSD)

Historical Data (Cohort Analysis):
• Patients with ACE 6-10: Attended 4-8 sessions (avg: 5.2)
• Patients with GAD-7 10-14: Attended 3-6 sessions (avg: 4.1)
• Patients with PCL-5 33-80: Attended 5-10 sessions (avg: 6.8)

Clinician Decision: [Schedule Integration Sessions]
```

#### Feature: "Expectancy Scale Gauge"

**❌ NON-COMPLIANT:**
- "Low expectancy - patient unlikely to benefit"
- "High expectancy - excellent prognosis"

**✅ COMPLIANT:**
```
Treatment Expectancy Scale: 45/100

Historical Data:
• Patients with expectancy 1-40: MEQ-30 avg 52 (n=127)
• Patients with expectancy 41-70: MEQ-30 avg 68 (n=243)
• Patients with expectancy 71-100: MEQ-30 avg 81 (n=189)

Note: Expectancy scores are self-reported beliefs about treatment effectiveness.
```

---

### Phase 2: Session Monitoring

#### Feature: "Real-Time Vitals Panel"

**❌ NON-COMPLIANT:**
- "Blood pressure dangerously high - administer rescue medication"
- "Heart rate elevated - intervention required"

**✅ COMPLIANT:**
```
Real-Time Vital Signs
────────────────────────────
11:30 AM (Peak)
• Heart Rate: 105 bpm (baseline: 72 bpm)
• Blood Pressure: 145/92 mmHg (baseline: 120/80 mmHg)
• HRV: 32 ms (baseline: 45 ms)
• SpO2: 98%

Alert: BP exceeds threshold of 140/90 mmHg
Alert: HR exceeds threshold of 100 bpm

[View Session Protocol] [Log Event]
```

#### Feature: "Rescue Protocol Checklist"

**❌ NON-COMPLIANT:**
- "Use benzodiazepine rescue medication"
- "Patient requires chemical intervention"

**✅ COMPLIANT:**
```
Intervention Log
────────────────────────────
Available Intervention Types:
□ Verbal Reassurance
□ Guided Breathing Technique
□ Physical Touch (Hand-holding)
□ Environment Adjustment (Lighting/Music)
□ Chemical Rescue (Benzodiazepine)
□ Chemical Rescue (Propranolol)

[Log Intervention Used]

Note: Intervention selection is at clinician's discretion based on session protocol and patient needs.
```

---

### Phase 3: Integration Tracking

#### Feature: "Red Alert Panel"

**❌ NON-COMPLIANT:**
```
🚨 CRITICAL ALERT
Patient is suicidal - immediate intervention required!
Recommend emergency psychiatric evaluation.
Call patient within 1 hour.
```

**✅ COMPLIANT:**
```
Alert: C-SSRS Threshold Breach
────────────────────────────
Alert Severity: High (based on score threshold >3)
Triggered: 2026-02-15 at 3:42 PM

Assessment Data:
• C-SSRS Score: 4 (previous: 0)
• Score Change: +4 points
• Assessment Date: 2026-02-15
• Days Post-Session: 21

Alert Criteria:
• Threshold: C-SSRS score >3
• Rationale: Score indicates presence of suicidal ideation with intent

Clinician Actions:
□ Reviewed alert
□ Contacted patient
□ Documented response

[Acknowledge Alert] [View Patient Record] [Add Notes]
```

#### Feature: "Symptom Decay Curve"

**❌ NON-COMPLIANT:**
- "Relapse predicted in 14 days - schedule booster session"
- "Patient needs additional treatment"

**✅ COMPLIANT:**
```
PHQ-9 Trajectory Analysis
────────────────────────────
Current Score: 17 (Day 60)
Baseline Score: 18
Lowest Score: 5 (Day 14)

Trend Analysis:
• Days 0-14: Decreasing (-13 points, "afterglow period")
• Days 14-30: Stable (±2 points)
• Days 30-60: Increasing (+12 points, +2 points/week avg)

Historical Comparison:
• Patients with similar trajectories: 67% showed continued increase at 90 days
• Patients with similar trajectories: 23% stabilized without intervention
• Patients with similar trajectories: 10% showed spontaneous improvement

[View Detailed Timeline] [Export Data]
```

#### Feature: "Pulse Check Compliance"

**❌ NON-COMPLIANT:**
- "Patient is disengaged - recommend outreach call"
- "Low compliance indicates poor treatment adherence"

**✅ COMPLIANT:**
```
Pulse Check Submission Summary
────────────────────────────
Week 1 (Days 1-7): 6/7 submissions (86%)
Week 2 (Days 8-14): 4/7 submissions (57%)
Week 3 (Days 15-21): 2/7 submissions (29%)

Missed Submissions:
• Day 7, Day 10, Day 11, Day 15, Day 16, Day 19, Day 20

Last Submission: Day 18 (3 days ago)
• Connection Level: 2/5
• Sleep Quality: 2/5

[View Submission History] [Send Reminder]
```

---

## 🔒 PART 3: UI/UX Compliance Patterns

### Alert Severity Levels

**All alerts must be framed as data thresholds, not clinical urgency:**

**✅ COMPLIANT:**
- "High Severity" = "Score exceeds high threshold"
- "Moderate Severity" = "Score exceeds moderate threshold"
- "Low Severity" = "Score exceeds low threshold"

**❌ NON-COMPLIANT:**
- "Critical - Immediate Action Required"
- "Urgent - Respond Within 24 Hours"
- "Warning - Monitor Closely"

### Button/Action Labels

**✅ COMPLIANT:**
- "Acknowledge Alert"
- "View Patient Data"
- "Add Clinical Notes"
- "Export Report"
- "Schedule Session" (neutral action)

**❌ NON-COMPLIANT:**
- "Intervene Now"
- "Escalate to Emergency"
- "Prescribe Medication"
- "Recommend Treatment Change"

### Color Coding

**Colors can indicate data thresholds, not clinical urgency:**

**✅ COMPLIANT:**
- Red: "Score exceeds high threshold (>X)"
- Yellow: "Score exceeds moderate threshold (>Y)"
- Green: "Score within normal range (<Z)"

**❌ NON-COMPLIANT:**
- Red: "Danger - Act Now"
- Yellow: "Caution - Monitor"
- Green: "Safe - No Action Needed"

---

## 📊 PART 4: Analytics & Reporting Compliance

### Cohort Analysis

**✅ COMPLIANT:**
```
Cohort Outcome Analysis
────────────────────────────
Cohort: Patients with MDD, ACE 4-6, treated Jan-Mar 2026 (n=47)

Baseline PHQ-9: 16.2 (avg)
Day 30 PHQ-9: 7.8 (avg)
Day 90 PHQ-9: 9.1 (avg)

Remission Rate (PHQ-9 <5):
• Day 30: 34% (16/47)
• Day 90: 28% (13/47)

Note: Data presented for clinical review. Outcomes vary by individual patient factors.
```

**❌ NON-COMPLIANT:**
```
Treatment Effectiveness Report
────────────────────────────
Psilocybin is highly effective for MDD patients with moderate childhood trauma.

Recommendation: All patients with ACE 4-6 should receive psilocybin treatment.

Expected Outcome: 70% remission rate at 6 months.
```

### Predictive Analytics

**✅ COMPLIANT:**
```
Trajectory Model (Statistical Analysis)
────────────────────────────
Model Input: Current PHQ-9 trajectory (Days 0-60)
Historical Comparison: Patients with similar trajectories (n=127)

Observed Outcomes at Day 90:
• 67% showed continued PHQ-9 increase (avg +5 points)
• 23% showed PHQ-9 stabilization (±2 points)
• 10% showed PHQ-9 decrease (avg -3 points)

Note: Model based on historical data. Individual outcomes may vary. Clinician assessment required.
```

**❌ NON-COMPLIANT:**
```
Relapse Prediction
────────────────────────────
AI predicts 85% probability of relapse within 30 days.

Recommended Action: Schedule booster session immediately.

Expected Outcome: Booster session will prevent relapse.
```

---

## ✅ PART 5: Compliance Checklist for BUILDER

Before implementing any Arc of Care feature, verify:

### Language Compliance
- [ ] All UI text presents objective data, not recommendations
- [ ] All alerts describe threshold breaches, not clinical urgency
- [ ] All historical data is framed as "cohort analysis" not "predictions"
- [ ] All buttons/actions are neutral (e.g., "View Data" not "Intervene")

### Data Presentation
- [ ] Scores are shown with context (previous score, change, threshold)
- [ ] Trends are shown as data points, not interpretations
- [ ] Historical comparisons include sample size (n=X)
- [ ] All analytics include disclaimer: "Clinician assessment required"

### User Flow
- [ ] System never auto-schedules appointments
- [ ] System never auto-sends patient communications
- [ ] System never auto-escalates to emergency services
- [ ] All actions require explicit clinician approval

### Legal Disclaimers
- [ ] All predictive features include: "Model based on historical data. Individual outcomes may vary."
- [ ] All alerts include: "Alert based on predefined threshold. Clinician assessment required."
- [ ] All reports include: "Data presented for clinical review. Not a substitute for clinical judgment."

---

## 🚨 RED FLAGS (Auto-Reject)

**If you see any of these in UI mockups, code, or documentation, STOP and revise:**

1. "Recommend" or "Recommendation"
2. "Should" or "Must" (in clinical context)
3. "Requires" or "Needs" (in clinical context)
4. "Predict" or "Prediction" (without disclaimer)
5. "Diagnose" or "Diagnosis"
6. "Prescribe" or "Prescription"
7. "Immediate action required"
8. "Urgent intervention needed"
9. Any language that removes clinician decision-making

---

## 📋 PART 6: Legal Review Checklist

Before deploying Arc of Care, legal review must confirm:

- [ ] No language constitutes medical advice
- [ ] No features auto-execute clinical decisions
- [ ] All predictive models include appropriate disclaimers
- [ ] All alerts are framed as data thresholds, not clinical urgency
- [ ] System clearly positions as "decision support" not "decision-making"
- [ ] Terms of Service include liability disclaimers
- [ ] User training emphasizes clinician decision-making authority

---

## 🎯 Summary

**Arc of Care is a powerful analytics and decision support platform.**

**It shows clinicians:**
- ✅ What the data says
- ✅ What historical patterns suggest
- ✅ What thresholds have been breached

**It does NOT tell clinicians:**
- ❌ What to do
- ❌ What will happen
- ❌ What the patient needs

**The clinician always makes the final decision.**

---

**END OF COMPLIANCE GUIDELINES**
