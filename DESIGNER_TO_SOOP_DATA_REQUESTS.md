# 📊 DESIGNER → SOOP: Data Requests for Mobile & Analytics Design

**From:** DESIGNER  
**To:** SOOP (Data/Database Subagent)  
**Date:** 2026-02-12 05:31 PST  
**Priority:** HIGH  
**Context:** Mobile UI design + Clinical Intelligence Platform Phase 2

---

## 🎯 **PURPOSE**

I need real data structures, sample datasets, and database schema information to create accurate, production-ready mobile designs and data visualizations for:

1. **Mobile Dashboard** - Clinic performance metrics
2. **Analytics Platform** - Treatment outcomes and trends
3. **Substance Library** - Molecular data and protocol counts
4. **Safety Monitoring** - Adverse event tracking
5. **Protocol Builder** - Form validation and data flow

---

## 📋 **DATA REQUEST #1: Dashboard Metrics**

### **What I Need:**
Real-time clinic performance data structure for mobile dashboard

### **Specific Requests:**

#### **1.1 Protocol Logging Metrics**
```sql
-- Sample query structure needed:
SELECT 
  COUNT(*) as protocols_logged_this_month,
  -- Comparison to last month (percentage change)
  -- Network average for comparison
  -- Trend data (last 6 months)
FROM log_clinical_records
WHERE site_id = ? AND created_at >= ?
```

**Design Questions:**
- What's the actual range of protocol counts per clinic per month?
- What's a realistic network average?
- Should I show daily, weekly, or monthly trends?
- What's the max/min values I should design for?

#### **1.2 Success Rate Calculation**
```sql
-- How is "success rate" calculated?
-- What table/columns define "success"?
-- Is it based on outcome assessments?
```

**Design Questions:**
- What percentile ranges are realistic (10th-90th)?
- What color coding should I use (green=good, red=bad)?
- Is this based on `ref_assessments` data?
- Should I show confidence intervals?

#### **1.3 System Status**
**Design Questions:**
- What determines "SYSTEM ONLINE" vs offline?
- Should I show "Last sync" timestamp?
- Are there different status levels (degraded, maintenance, etc.)?

---

## 📋 **DATA REQUEST #2: Analytics & Visualizations**

### **What I Need:**
Sample datasets for creating realistic data visualizations

#### **2.1 Treatment Efficacy Over Time**
```sql
-- Need sample data for line chart:
SELECT 
  substance_id,
  month,
  AVG(efficacy_score) as avg_efficacy
FROM log_outcomes
GROUP BY substance_id, month
ORDER BY month
```

**Design Questions:**
- What substances should I show in the chart? (Top 3-5?)
- What's the efficacy scale? (0-100? 1-10?)
- How many months of historical data exists?
- What's a realistic trend pattern (improving, stable, declining)?

**Sample Data Needed:**
```json
{
  "psilocybin": [
    {"month": "Jan", "efficacy": 72},
    {"month": "Feb", "efficacy": 75},
    // ... 6 months
  ],
  "mdma": [...],
  "ketamine": [...]
}
```

#### **2.2 Dosage Distribution**
```sql
-- Need histogram data:
SELECT 
  dosage_range,
  COUNT(*) as frequency
FROM log_interventions
WHERE substance_id = ?
GROUP BY dosage_range
```

**Design Questions:**
- What are realistic dosage ranges for each substance?
- Should I show mg, μg, or other units?
- What's the typical distribution shape (normal, skewed)?
- What's the median/mean dosage?

**Sample Data Needed:**
```json
{
  "psilocybin": {
    "unit": "mg",
    "ranges": [
      {"range": "10-20mg", "count": 12},
      {"range": "20-30mg", "count": 45},
      {"range": "30-40mg", "count": 67},
      // ...
    ],
    "median": 25,
    "mean": 26.3
  }
}
```

#### **2.3 Adverse Events Timeline**
```sql
-- Need scatter plot data:
SELECT 
  event_date,
  severity_grade_id,
  safety_event_id
FROM log_safety_events
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTHS)
```

**Design Questions:**
- What are the severity levels? (ref_severity_grade)
- What's a realistic event frequency (per month)?
- Should I show resolved vs ongoing events differently?
- What color coding for severity (green/amber/red)?

**Sample Data Needed:**
```json
{
  "events": [
    {"date": "2024-01-15", "severity": "mild", "type": "nausea"},
    {"date": "2024-01-18", "severity": "moderate", "type": "headache"},
    // ... 50-100 events over 6 months
  ]
}
```

#### **2.4 Correlation Matrix**
**Design Questions:**
- What variables should I correlate? (efficacy, dosage, adverse events?)
- What's the correlation coefficient range (-1 to +1)?
- Which correlations are most clinically relevant?

**Sample Data Needed:**
```json
{
  "matrix": {
    "efficacy_vs_dosage": 0.6,
    "efficacy_vs_adverse_events": -0.5,
    "dosage_vs_adverse_events": 0.3,
    // ...
  }
}
```

---

## 📋 **DATA REQUEST #3: Substance Library**

### **What I Need:**
Molecular data and protocol counts for substance cards

#### **3.1 Substance Metadata**
```sql
-- From ref_substances table:
SELECT 
  substance_id,
  substance_name,
  chemical_formula,
  molecular_weight,
  rxnorm_cui,
  -- Any other metadata?
FROM ref_substances
```

**Design Questions:**
- Do we have SMILES strings for 2D molecule rendering?
- Do we have 3D coordinate data (PDB, MOL files)?
- Should I show CAS numbers, IUPAC names?
- What substances are in the current database?

**Sample Data Needed:**
```json
{
  "substances": [
    {
      "id": 1,
      "name": "Psilocybin",
      "formula": "C12H17N2O4P",
      "molecular_weight": 284.25,
      "smiles": "CN(C)CCc1c[nH]c2ccc(OP(=O)(O)O)cc12",
      "protocol_count": 156,
      "color_accent": "#6366f1"
    },
    // ... all substances
  ]
}
```

#### **3.2 Protocol Counts by Substance**
```sql
-- How many protocols use each substance?
SELECT 
  s.substance_name,
  COUNT(i.intervention_id) as protocol_count
FROM ref_substances s
LEFT JOIN log_interventions i ON s.substance_id = i.substance_id
GROUP BY s.substance_id
```

---

## 📋 **DATA REQUEST #4: Safety Monitoring**

### **What I Need:**
Real adverse event data for safety dashboard

#### **4.1 Severity Distribution**
```sql
-- Donut chart data:
SELECT 
  sg.severity_name,
  COUNT(*) as event_count
FROM log_safety_events lse
JOIN ref_severity_grade sg ON lse.severity_grade_id = sg.severity_grade_id
GROUP BY sg.severity_grade_id
```

**Design Questions:**
- What are the severity levels? (Mild, Moderate, Severe, Life-threatening?)
- What's a realistic distribution (70% mild, 25% moderate, 5% severe)?
- What color coding? (Green, Amber, Red?)

**Sample Data Needed:**
```json
{
  "severity_distribution": {
    "mild": {"count": 33, "percentage": 70, "color": "#10b981"},
    "moderate": {"count": 12, "percentage": 25, "color": "#f59e0b"},
    "severe": {"count": 2, "percentage": 5, "color": "#ef4444"}
  },
  "total": 47
}
```

#### **4.2 Most Common Events**
```sql
-- Bar chart data:
SELECT 
  se.event_name,
  COUNT(*) as frequency
FROM log_safety_events lse
JOIN ref_safety_events se ON lse.safety_event_id = se.safety_event_id
GROUP BY se.safety_event_id
ORDER BY frequency DESC
LIMIT 5
```

**Design Questions:**
- What are the most common adverse events?
- Should I show percentages or raw counts?
- What's a realistic frequency distribution?

**Sample Data Needed:**
```json
{
  "common_events": [
    {"name": "Nausea", "count": 22, "percentage": 47},
    {"name": "Headache", "count": 15, "percentage": 32},
    {"name": "Anxiety", "count": 10, "percentage": 21}
  ]
}
```

#### **4.3 Resolution Status**
```sql
-- Progress bars data:
SELECT 
  rs.status_name,
  COUNT(*) as count
FROM log_safety_events lse
JOIN ref_resolution_status rs ON lse.resolution_status_id = rs.resolution_status_id
GROUP BY rs.resolution_status_id
```

**Design Questions:**
- What are the resolution statuses? (Resolved, Monitoring, Ongoing?)
- What's a realistic distribution?
- Should I show time-to-resolution metrics?

---

## 📋 **DATA REQUEST #5: Protocol Builder Form**

### **What I Need:**
Validation rules and dropdown data for mobile form design

#### **5.1 Form Field Validation**
**Design Questions:**
- What fields are required vs optional?
- What are the validation rules for each field?
- What error messages should I show?
- What's the character limit for text fields?

**Needed:**
```json
{
  "fields": {
    "subject_id": {
      "required": true,
      "pattern": "PT-[0-9]{10}",
      "error_message": "Invalid Subject ID format"
    },
    "age": {
      "required": true,
      "min": 18,
      "max": 100,
      "error_message": "Age must be between 18-100"
    },
    // ... all fields
  }
}
```

#### **5.2 Dropdown Options**
**Design Questions:**
- How many options in each dropdown?
- Should I show all options or paginate?
- Are options sorted alphabetically or by frequency?

**Needed from ref_* tables:**
- `ref_substances` - How many substances? (for dropdown design)
- `ref_routes` - How many administration routes?
- `ref_assessments` - How many assessment types?
- `ref_smoking_status` - Confirmed 4 options?

---

## 📋 **DATA REQUEST #6: Network-Level Insights**

### **What I Need:**
Aggregated network data for benchmarking visualizations

#### **6.1 Network Activity**
```sql
-- Total protocols across all sites
SELECT 
  COUNT(*) as total_protocols,
  COUNT(DISTINCT site_id) as active_sites,
  -- Growth rate vs previous period
FROM log_clinical_records
WHERE created_at >= ?
```

**Design Questions:**
- How many total protocols in the network?
- How many active sites?
- What's a realistic growth rate (+10%, +20%, +50%)?

#### **6.2 Substance Distribution**
```sql
-- Network-wide substance usage
SELECT 
  s.substance_name,
  COUNT(*) as usage_count,
  ROUND(COUNT(*) * 100.0 / total.count, 1) as percentage
FROM log_interventions i
JOIN ref_substances s ON i.substance_id = s.substance_id
CROSS JOIN (SELECT COUNT(*) as count FROM log_interventions) total
GROUP BY s.substance_id
ORDER BY usage_count DESC
```

**Sample Data Needed:**
```json
{
  "substance_distribution": [
    {"name": "Psilocybin", "count": 156, "percentage": 45},
    {"name": "MDMA", "count": 89, "percentage": 30},
    {"name": "Ketamine", "count": 67, "percentage": 25}
  ]
}
```

---

## 🎨 **DESIGN IMPACT**

### **Why I Need This Data:**

1. **Realistic Visualizations**
   - Charts need real data ranges to look authentic
   - Color scales need to match actual data distributions
   - Axis labels need to reflect real units and scales

2. **Proper UI Sizing**
   - Need to know max character lengths for labels
   - Need to know max/min values for scaling
   - Need to know typical data volumes for pagination

3. **Accurate Interactions**
   - Tooltips need to show real data formats
   - Filters need to match actual data categories
   - Search needs to handle real data volumes

4. **Mobile Optimization**
   - Need to know data density for mobile cards
   - Need to prioritize most important metrics
   - Need to handle data overflow gracefully

---

## 📊 **PREFERRED DATA FORMAT**

### **Option 1: JSON Sample Files** (Preferred)
```
/data/samples/
  ├── dashboard_metrics.json
  ├── analytics_efficacy.json
  ├── analytics_dosage.json
  ├── safety_events.json
  ├── substance_library.json
  └── network_insights.json
```

### **Option 2: SQL Queries**
Provide actual SQL queries I can run to generate sample data

### **Option 3: API Endpoints**
If there's a test API, provide endpoints and sample responses

---

## ⏰ **TIMELINE**

### **Immediate Need (Today):**
- Dashboard metrics structure
- Substance library data (for molecule cards)
- Form validation rules

### **High Priority (This Week):**
- Analytics sample datasets
- Safety monitoring data
- Network-level insights

### **Medium Priority (Next Week):**
- Correlation matrix data
- Advanced visualizations
- Historical trend data

---

## 🤝 **COLLABORATION**

### **How to Respond:**

**Option A: Provide Sample Data Files**
- Create JSON files with realistic sample data
- Place in `/data/samples/` directory
- Notify DESIGNER when ready

**Option B: Provide Database Queries**
- Share SQL queries to generate sample data
- Include instructions for running queries
- Provide expected output format

**Option C: Schedule Data Review**
- Set up time to review database schema together
- Walk through data structures
- Clarify any ambiguities

---

## 📝 **QUESTIONS FOR SOOP**

1. **Data Volume:** What's the typical data volume per clinic? (10s, 100s, 1000s of protocols?)

2. **Data Freshness:** How often is data updated? (Real-time, hourly, daily?)

3. **Data Privacy:** Any restrictions on showing aggregated data in designs?

4. **Data Accuracy:** Should I use real production data or synthetic test data?

5. **Data Completeness:** Are there any missing/incomplete data fields I should account for?

6. **Data Relationships:** Can you provide an ERD or schema diagram showing table relationships?

7. **Data Constraints:** What are the min/max values for numeric fields?

8. **Data Formats:** What date/time formats are used? (ISO 8601, Unix timestamps?)

---

## 🎯 **SUCCESS CRITERIA**

### **I'll know this request is complete when:**

- [ ] I have realistic sample data for all visualizations
- [ ] I understand the data ranges and distributions
- [ ] I can create accurate mobile mockups with real data
- [ ] I know validation rules for all form fields
- [ ] I have molecular data for substance library
- [ ] I understand the database schema relationships
- [ ] I can design for edge cases (empty states, max values)

---

## 💬 **NEXT STEPS**

1. **SOOP reviews this request**
2. **SOOP provides sample data or queries**
3. **DESIGNER creates updated mobile designs with real data**
4. **DESIGNER shares designs with LEAD for review**
5. **BUILDER implements designs with actual database integration**

---

**Data Request Submitted:** 2026-02-12 05:31 PST  
**Requested By:** DESIGNER  
**For:** Mobile UI Design + Clinical Intelligence Platform  
**Priority:** HIGH  
**Estimated Impact:** 8-10 mobile mockups, 15+ data visualizations
