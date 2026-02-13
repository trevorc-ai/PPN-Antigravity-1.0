# 🔍 DESIGNER: Treatment Timeline - Filtering & Analysis Opportunities

**Date:** 2026-02-10  
**Purpose:** Identify filtering and analysis opportunities based on SQL schema  
**Status:** DESIGN ANALYSIS - For Review

---

## 📊 Database Schema Analysis

### **Core Table: `log_clinical_records`**

**Key Columns for Timeline:**
```sql
CREATE TABLE log_clinical_records (
    id UUID PRIMARY KEY,
    patient_id TEXT NOT NULL,              -- Subject hash (groups treatments)
    session_number INTEGER DEFAULT 1,       -- Treatment sequence
    session_date DATE DEFAULT CURRENT_DATE, -- Temporal anchor
    
    -- Treatment Details
    substance_id BIGINT → ref_substances,
    route_id BIGINT → ref_routes,
    dosage NUMERIC,
    dosage_unit TEXT,
    
    -- Clinical Context
    indication_id BIGINT → ref_indications,
    modality_id BIGINT → ref_support_modality,
    smoking_status_id BIGINT → ref_smoking_status,
    
    -- Outcomes
    phq9_score INTEGER,                     -- Primary outcome
    difficulty_score INTEGER,               -- Subjective experience
    
    -- Safety
    safety_event_id BIGINT → ref_safety_events,
    severity_grade_id BIGINT → ref_severity_grade,
    resolution_status_id BIGINT → ref_resolution_status,
    concomitant_med_ids BIGINT[],          -- Array of medication IDs
    
    -- Temporal Context
    prep_hours NUMERIC,
    integration_hours NUMERIC,
    setting TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ,
    user_id UUID,
    site_id UUID
);
```

---

## 🎯 Filtering Opportunities

### **1. Temporal Filters**

#### **A. Date Range**
**Use Case:** "Show treatments from last 30 days"

**SQL:**
```sql
WHERE session_date >= CURRENT_DATE - INTERVAL '30 days'
```

**UI Component:**
- Date range picker (From/To)
- Quick filters: "Last 7 days", "Last 30 days", "Last 90 days", "All time"

---

#### **B. Day Interval**
**Use Case:** "Show treatments with < 7 days between sessions"

**SQL:**
```sql
WITH treatment_intervals AS (
  SELECT 
    patient_id,
    session_date,
    LAG(session_date) OVER (PARTITION BY patient_id ORDER BY session_date) as prev_date,
    session_date - LAG(session_date) OVER (PARTITION BY patient_id ORDER BY session_date) as days_between
  FROM log_clinical_records
)
SELECT * FROM treatment_intervals
WHERE days_between < 7;
```

**UI Component:**
- Slider: "Min/Max days between treatments"
- Highlight rapid treatment sequences (< 7 days)

---

#### **C. Treatment Frequency**
**Use Case:** "Show patients with 3+ treatments in 30 days"

**SQL:**
```sql
SELECT 
  patient_id,
  COUNT(*) as treatment_count,
  MIN(session_date) as first_treatment,
  MAX(session_date) as last_treatment
FROM log_clinical_records
WHERE session_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY patient_id
HAVING COUNT(*) >= 3;
```

**UI Component:**
- Filter: "Minimum treatments in period"
- Badge: "High frequency" (3+ in 30 days)

---

### **2. Substance Filters**

#### **A. Single Substance**
**Use Case:** "Show only Psilocybin treatments"

**SQL:**
```sql
SELECT lcr.*, s.substance_name
FROM log_clinical_records lcr
JOIN ref_substances s ON lcr.substance_id = s.substance_id
WHERE s.substance_name = 'Psilocybin';
```

**UI Component:**
- Multi-select dropdown: All substances
- Quick filters: "Psychedelics only", "Dissociatives only"

---

#### **B. Substance Class**
**Use Case:** "Show all psychedelic treatments"

**SQL:**
```sql
SELECT lcr.*, s.substance_name, s.substance_class
FROM log_clinical_records lcr
JOIN ref_substances s ON lcr.substance_id = s.substance_id
WHERE s.substance_class = 'psychedelic';
```

**UI Component:**
- Filter by class: Psychedelic, Empathogen, Dissociative, Other

---

#### **C. Substance Switching**
**Use Case:** "Highlight when patient switches substances"

**SQL:**
```sql
WITH substance_changes AS (
  SELECT 
    patient_id,
    session_date,
    substance_id,
    LAG(substance_id) OVER (PARTITION BY patient_id ORDER BY session_date) as prev_substance_id,
    CASE 
      WHEN substance_id != LAG(substance_id) OVER (PARTITION BY patient_id ORDER BY session_date) 
      THEN TRUE 
      ELSE FALSE 
    END as substance_switched
  FROM log_clinical_records
)
SELECT * FROM substance_changes WHERE substance_switched = TRUE;
```

**UI Component:**
- Badge on timeline: "⚠ Substance Switch"
- Filter: "Show only substance switches"

---

### **3. Dosage Filters**

#### **A. Dose Range**
**Use Case:** "Show treatments with dosage 25-50mg"

**SQL:**
```sql
WHERE dosage BETWEEN 25 AND 50
  AND dosage_unit = 'mg';
```

**UI Component:**
- Dual slider: Min/Max dosage
- Unit selector: mg, g, mcg

---

#### **B. Dose Escalation**
**Use Case:** "Highlight when dosage increases"

**SQL:**
```sql
WITH dose_changes AS (
  SELECT 
    patient_id,
    session_date,
    dosage,
    LAG(dosage) OVER (PARTITION BY patient_id ORDER BY session_date) as prev_dosage,
    dosage - LAG(dosage) OVER (PARTITION BY patient_id ORDER BY session_date) as dose_change
  FROM log_clinical_records
)
SELECT * FROM dose_changes 
WHERE dose_change > 0; -- Escalation
```

**UI Component:**
- Badge: "↑ Dose Escalation" (green)
- Badge: "↓ Dose Reduction" (amber)
- Filter: "Show only dose changes"

---

### **4. Outcome Filters**

#### **A. PHQ-9 Score Range**
**Use Case:** "Show treatments where PHQ-9 < 10 (mild depression)"

**SQL:**
```sql
WHERE phq9_score < 10;
```

**UI Component:**
- Slider: PHQ-9 range (0-27)
- Quick filters: "Remission (<5)", "Mild (5-9)", "Moderate (10-14)", "Severe (15+)"

---

#### **B. Outcome Improvement**
**Use Case:** "Show treatments with >20% improvement"

**SQL:**
```sql
WITH outcome_changes AS (
  SELECT 
    patient_id,
    session_date,
    phq9_score,
    LAG(phq9_score) OVER (PARTITION BY patient_id ORDER BY session_date) as prev_phq9,
    ROUND(
      ((LAG(phq9_score) OVER (PARTITION BY patient_id ORDER BY session_date) - phq9_score) 
      / NULLIF(LAG(phq9_score) OVER (PARTITION BY patient_id ORDER BY session_date), 0)) * 100
    ) as improvement_pct
  FROM log_clinical_records
)
SELECT * FROM outcome_changes 
WHERE improvement_pct > 20;
```

**UI Component:**
- Filter: "Minimum improvement %"
- Badge: "⭐ High Responder" (>30% improvement)

---

#### **C. Difficulty Score**
**Use Case:** "Show treatments with low difficulty (flow state)"

**SQL:**
```sql
WHERE difficulty_score <= 3; -- Flow state (1-3)
```

**UI Component:**
- Slider: Difficulty range (0-10)
- Quick filters: "Flow State (0-3)", "Moderate (4-6)", "High Distress (7-10)"

---

### **5. Safety Filters**

#### **A. Adverse Events**
**Use Case:** "Show treatments with Grade 2+ adverse events"

**SQL:**
```sql
SELECT lcr.*, se.event_name, sg.grade_label
FROM log_clinical_records lcr
JOIN ref_safety_events se ON lcr.safety_event_id = se.safety_event_id
JOIN ref_severity_grade sg ON lcr.severity_grade_id = sg.severity_grade_id
WHERE sg.grade_value >= 2;
```

**UI Component:**
- Filter: "Show only treatments with adverse events"
- Badge: "⚠ Grade 2+" (amber/red)
- Filter by event type: Nausea, Anxiety, Tachycardia, etc.

---

#### **B. Concomitant Medications**
**Use Case:** "Show treatments with SSRI co-administration"

**SQL:**
```sql
SELECT lcr.*, m.medication_name
FROM log_clinical_records lcr
JOIN ref_medications m ON m.medication_id = ANY(lcr.concomitant_med_ids)
WHERE m.medication_name ILIKE '%Sertraline%' 
   OR m.medication_name ILIKE '%Fluoxetine%'
   OR m.medication_name ILIKE '%Escitalopram%';
```

**UI Component:**
- Multi-select: Concomitant medications
- Badge: "💊 SSRI" (highlight drug interactions)

---

### **6. Clinical Context Filters**

#### **A. Indication**
**Use Case:** "Show only PTSD treatments"

**SQL:**
```sql
SELECT lcr.*, i.indication_name
FROM log_clinical_records lcr
JOIN ref_indications i ON lcr.indication_id = i.indication_id
WHERE i.indication_name = 'Post-Traumatic Stress Disorder (PTSD)';
```

**UI Component:**
- Multi-select: Primary indications
- Quick filters: "Mood disorders", "Trauma", "Anxiety"

---

#### **B. Support Modality**
**Use Case:** "Show treatments with CBT integration"

**SQL:**
```sql
SELECT lcr.*, m.modality_name
FROM log_clinical_records lcr
JOIN ref_support_modality m ON lcr.modality_id = m.modality_id
WHERE m.modality_name = 'CBT';
```

**UI Component:**
- Multi-select: Support modalities
- Filter: "With therapy" vs "Sitter only"

---

#### **C. Route of Administration**
**Use Case:** "Show only IV treatments"

**SQL:**
```sql
SELECT lcr.*, r.route_name
FROM log_clinical_records lcr
JOIN ref_routes r ON lcr.route_id = r.route_id
WHERE r.route_name = 'Intravenous';
```

**UI Component:**
- Multi-select: Routes
- Icon badges: 💊 Oral, 💉 IV, 👃 Intranasal

---

### **7. Site/Provider Filters**

#### **A. Site Isolation**
**Use Case:** "Show only my site's treatments"

**SQL:**
```sql
WHERE site_id IN (
  SELECT site_id FROM user_sites WHERE user_id = auth.uid()
);
```

**UI Component:**
- Auto-applied (RLS enforced)
- Network admin: Multi-select sites

---

## 📈 Advanced Analysis Opportunities

### **1. Treatment Pattern Detection**

#### **A. Rapid Responders**
**Definition:** Patients with >30% improvement in first 2 treatments

**SQL:**
```sql
WITH first_two_treatments AS (
  SELECT 
    patient_id,
    phq9_score,
    ROW_NUMBER() OVER (PARTITION BY patient_id ORDER BY session_date) as treatment_num
  FROM log_clinical_records
)
SELECT 
  patient_id,
  MAX(CASE WHEN treatment_num = 1 THEN phq9_score END) as baseline_phq9,
  MAX(CASE WHEN treatment_num = 2 THEN phq9_score END) as second_phq9,
  ROUND(
    ((MAX(CASE WHEN treatment_num = 1 THEN phq9_score END) - 
      MAX(CASE WHEN treatment_num = 2 THEN phq9_score END)) 
    / NULLIF(MAX(CASE WHEN treatment_num = 1 THEN phq9_score END), 0)) * 100
  ) as improvement_pct
FROM first_two_treatments
WHERE treatment_num <= 2
GROUP BY patient_id
HAVING improvement_pct > 30;
```

**UI Badge:** "⚡ Rapid Responder"

---

#### **B. Dose-Response Relationship**
**Definition:** Correlation between dosage and outcome improvement

**SQL:**
```sql
WITH dose_outcomes AS (
  SELECT 
    patient_id,
    dosage,
    phq9_score,
    LAG(phq9_score) OVER (PARTITION BY patient_id ORDER BY session_date) as prev_phq9
  FROM log_clinical_records
)
SELECT 
  CASE 
    WHEN dosage < 25 THEN 'Low (<25mg)'
    WHEN dosage BETWEEN 25 AND 50 THEN 'Medium (25-50mg)'
    ELSE 'High (>50mg)'
  END as dose_category,
  AVG(prev_phq9 - phq9_score) as avg_improvement
FROM dose_outcomes
WHERE prev_phq9 IS NOT NULL
GROUP BY dose_category;
```

**UI Chart:** Bar chart showing avg improvement by dose category

---

#### **C. Treatment Frequency Impact**
**Definition:** Does more frequent treatment = better outcomes?

**SQL:**
```sql
WITH treatment_frequency AS (
  SELECT 
    patient_id,
    session_date,
    LAG(session_date) OVER (PARTITION BY patient_id ORDER BY session_date) as prev_date,
    session_date - LAG(session_date) OVER (PARTITION BY patient_id ORDER BY session_date) as days_between,
    phq9_score,
    LAG(phq9_score) OVER (PARTITION BY patient_id ORDER BY session_date) as prev_phq9
  FROM log_clinical_records
)
SELECT 
  CASE 
    WHEN days_between < 7 THEN 'Weekly (<7 days)'
    WHEN days_between BETWEEN 7 AND 30 THEN 'Monthly (7-30 days)'
    ELSE 'Quarterly (>30 days)'
  END as frequency_category,
  AVG(prev_phq9 - phq9_score) as avg_improvement
FROM treatment_frequency
WHERE days_between IS NOT NULL
GROUP BY frequency_category;
```

**UI Chart:** Line chart showing improvement vs frequency

---

### **2. Cohort Comparisons**

#### **A. Substance Efficacy**
**Definition:** Which substance has best outcomes for PTSD?

**SQL:**
```sql
SELECT 
  s.substance_name,
  i.indication_name,
  COUNT(*) as treatment_count,
  AVG(lcr.phq9_score) as avg_phq9,
  STDDEV(lcr.phq9_score) as phq9_stddev
FROM log_clinical_records lcr
JOIN ref_substances s ON lcr.substance_id = s.substance_id
JOIN ref_indications i ON lcr.indication_id = i.indication_id
WHERE i.indication_name = 'Post-Traumatic Stress Disorder (PTSD)'
GROUP BY s.substance_name, i.indication_name
ORDER BY avg_phq9 ASC;
```

**UI Chart:** Bar chart comparing substances for specific indication

---

#### **B. Route Comparison**
**Definition:** Does IV route have faster onset/better outcomes?

**SQL:**
```sql
SELECT 
  r.route_name,
  AVG(lcr.difficulty_score) as avg_difficulty,
  AVG(lcr.phq9_score) as avg_phq9,
  COUNT(*) as treatment_count
FROM log_clinical_records lcr
JOIN ref_routes r ON lcr.route_id = r.route_id
GROUP BY r.route_name
ORDER BY avg_phq9 ASC;
```

**UI Chart:** Scatter plot (difficulty vs outcome by route)

---

### **3. Safety Analysis**

#### **A. Adverse Event Frequency**
**Definition:** Which substances have highest AE rate?

**SQL:**
```sql
SELECT 
  s.substance_name,
  COUNT(DISTINCT lcr.id) as total_treatments,
  COUNT(DISTINCT CASE WHEN lcr.safety_event_id IS NOT NULL THEN lcr.id END) as treatments_with_ae,
  ROUND(
    COUNT(DISTINCT CASE WHEN lcr.safety_event_id IS NOT NULL THEN lcr.id END)::NUMERIC 
    / COUNT(DISTINCT lcr.id) * 100
  ) as ae_rate_pct
FROM log_clinical_records lcr
JOIN ref_substances s ON lcr.substance_id = s.substance_id
GROUP BY s.substance_name
ORDER BY ae_rate_pct DESC;
```

**UI Chart:** Bar chart showing AE rate by substance

---

#### **B. Drug Interaction Risk**
**Definition:** Treatments with concomitant SSRIs + MDMA (serotonin syndrome risk)

**SQL:**
```sql
SELECT 
  lcr.patient_id,
  lcr.session_date,
  s.substance_name,
  ARRAY_AGG(m.medication_name) as concomitant_meds
FROM log_clinical_records lcr
JOIN ref_substances s ON lcr.substance_id = s.substance_id
JOIN ref_medications m ON m.medication_id = ANY(lcr.concomitant_med_ids)
WHERE s.substance_name IN ('MDMA', 'Psilocybin')
  AND (
    m.medication_name ILIKE '%Sertraline%' OR
    m.medication_name ILIKE '%Fluoxetine%' OR
    m.medication_name ILIKE '%Escitalopram%'
  )
GROUP BY lcr.patient_id, lcr.session_date, s.substance_name;
```

**UI Alert:** "⚠ High-risk interaction detected"

---

### **4. Longitudinal Trends**

#### **A. Remission Rate Over Time**
**Definition:** % of patients achieving PHQ-9 < 5 by treatment number

**SQL:**
```sql
WITH treatment_outcomes AS (
  SELECT 
    patient_id,
    ROW_NUMBER() OVER (PARTITION BY patient_id ORDER BY session_date) as treatment_num,
    phq9_score
  FROM log_clinical_records
)
SELECT 
  treatment_num,
  COUNT(*) as total_patients,
  COUNT(CASE WHEN phq9_score < 5 THEN 1 END) as remission_count,
  ROUND(
    COUNT(CASE WHEN phq9_score < 5 THEN 1 END)::NUMERIC 
    / COUNT(*) * 100
  ) as remission_rate_pct
FROM treatment_outcomes
GROUP BY treatment_num
ORDER BY treatment_num;
```

**UI Chart:** Line chart showing remission rate by treatment number

---

#### **B. Durability of Response**
**Definition:** Do outcomes persist over time?

**SQL:**
```sql
WITH outcome_trajectory AS (
  SELECT 
    patient_id,
    session_date,
    phq9_score,
    FIRST_VALUE(phq9_score) OVER (PARTITION BY patient_id ORDER BY session_date) as baseline_phq9,
    ROW_NUMBER() OVER (PARTITION BY patient_id ORDER BY session_date) as treatment_num
  FROM log_clinical_records
)
SELECT 
  treatment_num,
  AVG(baseline_phq9 - phq9_score) as avg_improvement_from_baseline
FROM outcome_trajectory
GROUP BY treatment_num
ORDER BY treatment_num;
```

**UI Chart:** Line chart showing sustained improvement over treatments

---

## 🎨 UI/UX Design Recommendations

### **Filter Panel Design**

```
┌─────────────────────────────────────────────────────┐
│ TREATMENT TIMELINE FILTERS                          │
├─────────────────────────────────────────────────────┤
│                                                      │
│ 📅 Date Range                                       │
│ ┌─────────────┐  to  ┌─────────────┐               │
│ │ 2024-01-01  │      │ 2024-12-31  │               │
│ └─────────────┘      └─────────────┘               │
│ [Last 7d] [Last 30d] [Last 90d] [All Time]         │
│                                                      │
│ 💊 Substance                                        │
│ ☑ Psilocybin (12)                                   │
│ ☑ MDMA (8)                                          │
│ ☐ Ketamine (5)                                      │
│ ☐ LSD-25 (2)                                        │
│                                                      │
│ 📊 Outcome Range (PHQ-9)                            │
│ ├────●═══════●────┤                                 │
│ 0   5        15   27                                │
│ [Remission Only] [Show Improvement Only]            │
│                                                      │
│ ⚠ Safety                                            │
│ ☐ Show only treatments with adverse events          │
│ ☐ Exclude Grade 3+ events                           │
│                                                      │
│ 🔬 Advanced                                         │
│ ☐ Substance switches only                           │
│ ☐ Dose escalations only                             │
│ ☐ Rapid responders (>30% improvement)               │
│                                                      │
│ [Clear All] [Apply Filters]                         │
└─────────────────────────────────────────────────────┘
```

---

### **Timeline Chart Annotations**

**Visual Indicators:**
- **⚠ Substance Switch:** Amber badge when substance changes
- **↑ Dose Escalation:** Green arrow when dose increases
- **↓ Dose Reduction:** Amber arrow when dose decreases
- **⭐ High Responder:** Gold star for >30% improvement
- **⚠ Adverse Event:** Red dot for Grade 2+ events
- **💊 Concomitant Meds:** Pill icon when meds present

---

### **Quick Insights Panel**

```
┌─────────────────────────────────────────────────────┐
│ KEY INSIGHTS (Filtered Results)                     │
├─────────────────────────────────────────────────────┤
│ ✓ 4 treatments over 45 days (avg 15 days apart)    │
│ ✓ 39% total improvement (PHQ-9: 18 → 11)           │
│ ⭐ Best response: Treatment 2 (-20% improvement)    │
│ ⚠ 1 substance switch (Psilocybin → MDMA)           │
│ ⚠ 1 adverse event (Grade 2 Nausea, resolved)       │
│ 💊 2 concomitant medications (Sertraline, Lorazepam)│
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Implementation Priority

### **Phase 1: Essential Filters (MVP)**
1. ✅ Date range filter
2. ✅ Substance filter
3. ✅ PHQ-9 range filter
4. ✅ Show/hide adverse events

### **Phase 2: Advanced Filters**
5. ✅ Dose range filter
6. ✅ Indication filter
7. ✅ Route filter
8. ✅ Substance switch detection

### **Phase 3: Analysis Features**
9. ✅ Rapid responder detection
10. ✅ Dose-response analysis
11. ✅ Cohort comparisons
12. ✅ Safety analytics

---

## 📊 Data Requirements

### **Minimum Data for Timeline:**
- ✅ `patient_id` (to group treatments)
- ✅ `session_date` (temporal anchor)
- ✅ `substance_id` (what was given)
- ✅ `dosage` (how much)
- ✅ `phq9_score` (outcome)

### **Enhanced Data for Full Analysis:**
- ✅ `session_number` (sequence)
- ✅ `route_id` (how administered)
- ✅ `indication_id` (why given)
- ✅ `difficulty_score` (subjective experience)
- ✅ `safety_event_id` (adverse events)
- ✅ `concomitant_med_ids` (drug interactions)

---

## ✅ DESIGNER RECOMMENDATIONS

### **1. Start with Simple Filters**
- Date range
- Substance multi-select
- PHQ-9 range slider

### **2. Add Visual Indicators**
- Substance switch badges
- Dose change arrows
- Adverse event dots

### **3. Progressive Enhancement**
- Phase 1: Basic timeline + filters
- Phase 2: Advanced filters + badges
- Phase 3: Cohort analysis + insights

### **4. Colorblind-Safe Design**
- Always use icon + text (not color alone)
- High contrast in print mode
- Clear visual hierarchy

---

**DESIGNER ROLE COMPLETE**  
**Next Step:** INVESTIGATOR review of filtering complexity and data availability

**Awaiting User Feedback:**
- Which filters are highest priority?
- Any additional analysis needs?
- Approve phased implementation plan?
