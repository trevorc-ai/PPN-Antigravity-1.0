# ProtocolBuilder Input Fields - Complete Inventory
**Date:** 2026-02-09  
**Status:** Post-Migration 003  
**Purpose:** Complete categorized list of all ProtocolBuilder modal fields

---

## 📊 FIELD INVENTORY SUMMARY

**Total Fields:** 26  
**Existing Fields:** 22  
**New Fields:** 4 🆕  
**Database-Driven Fields:** 11 (7 converted + 4 new)  
**Hardcoded Fields:** 15

---

## 1️⃣ PATIENT DEMOGRAPHICS (8 fields)

### Existing Fields (7)

| Field Name | Input Type | Data Source | Storage | Required | Notes |
|-----------|-----------|-------------|---------|----------|-------|

| **Age** | Dropdown | Hardcoded (18-90+) | `subjectAge` (string) | Yes | Age at treatment |
| **Biological Sex** | Dropdown | Hardcoded | `sex` (string) | Yes | Male/Female/Intersex/Unknown |
| **Race/Ethnicity** | Dropdown | Hardcoded (SNOMED codes) | `race` (string - SNOMED code) | Yes | 5 options with codes |
| **Weight Range** | Dropdown | Hardcoded (40-150kg ranges) | `weightRange` (string) | Yes | 22 weight ranges |
| **Smoking Status** | Dropdown | 🔄 **Database** (`ref_smoking_status`) | `smoking_status_id` (bigint) | Yes | 4 statuses |
| **Concomitant Medications** | Multi-select + Add | Hardcoded med list | `concomitantMeds` (comma-separated string) | No | Drug interaction checking |

### New Fields (1) 🆕

| Field Name | Input Type | Data Source | Storage | Required | Notes |
|-----------|-----------|-------------|---------|----------|-------|
| **Primary Indication** 🆕 | Dropdown | **Database** (`ref_indications`) | `indication_id` (bigint) | **Yes** | What condition is being treated |

---

## 2️⃣ PROTOCOL PARAMETERS (6 fields)

### Existing Fields (4)

| Field Name | Input Type | Data Source | Storage | Required | Notes |
|-----------|-----------|-------------|---------|----------|-------|
| **Substance Compound** | Dropdown | 🔄 **Database** (`ref_substances`) | `substance_id` (bigint) | Yes | Primary psychedelic agent |
| **Administration Route** | Dropdown | 🔄 **Database** (`ref_routes`) | `route_id` (bigint) | Yes | Oral/IV/IM/etc. |
| **Standardized Dosage** | Number input + Unit dropdown | User input + hardcoded units | `dosage` (string) + `dosageUnit` (string) | Yes | Amount + mg/mcg/ml/etc. |
| **Frequency** | Dropdown | Hardcoded | `frequency` (string) | Yes | Single/Daily/Weekly/PRN |

### New Fields (2) 🆕

| Field Name | Input Type | Data Source | Storage | Required | Notes |
|-----------|-----------|-------------|---------|----------|-------|
| **Protocol Template** 🆕 | Dropdown | Hardcoded (for MVP) | `protocol_template_id` (uuid, nullable) | **No** | Link to reusable protocol |
| **Session Number** 🆕 | Dropdown | Hardcoded | `session_number` (integer) | **Yes** | 1-6+, Follow-up Only |

---

## 3️⃣ THERAPEUTIC CONTEXT (5 fields)

### Existing Fields (5)

| Field Name | Input Type | Data Source | Storage | Required | Notes |
|-----------|-----------|-------------|---------|----------|-------|
| **Setting** | Dropdown | Hardcoded | `setting` (string) | Yes | Clinical/Home/Retreat/Remote |
| **Prep Hours** | Number input | User input | `prepHours` (string) | Yes | 0-20 hours |
| **Integration Hours** | Number input | User input | `integrationHours` (string) | Yes | 0-50 hours |
| **Support Modality** | Multi-select checkboxes | 🔄 **Database** (`ref_support_modality`) | `support_modality_ids` (bigint[]) | No | CBT/Somatic/IFS/etc. |
| **Concomitant Medications** | (Listed in Demographics) | - | - | - | See Demographics section |

### New Fields (0)

*No new fields in this section*

---

## 4️⃣ CLINICAL OUTCOMES & SAFETY (7 fields)

### Existing Fields (6)

| Field Name | Input Type | Data Source | Storage | Required | Notes |
|-----------|-----------|-------------|---------|----------|-------|
| **Psychological Difficulty** | Range slider (1-10) | User input | `difficultyScore` (integer) | Yes | Subjective distress rating |
| **Baseline PHQ-9 Score** | Dropdown | Hardcoded (0-27) | `phq9Score` (integer) | Yes | Depression severity |
| **Resolution Status** | Dropdown | 🔄 **Database** (`ref_resolution_status`) | `resolution_status_id` (bigint) | Yes | Resolved in/post session |
| **Adverse Events Toggle** | Checkbox/Toggle | User input | `hasSafetyEvent` (boolean) | No | Triggers safety fields |
| **Severity (CTCAE Grade)** | Dropdown (conditional) | 🔄 **Database** (`ref_severity_grade`) | `severity_grade_id` (bigint) | Conditional | Only if adverse event |
| **Primary Clinical Observation** | Dropdown (conditional) | 🔄 **Database** (`ref_safety_events`) | `safety_event_id` (bigint) | Conditional | Only if adverse event |

### New Fields (1) 🆕

| Field Name | Input Type | Data Source | Storage | Required | Notes |
|-----------|-----------|-------------|---------|----------|-------|
| **Session Date** 🆕 | Date picker | User input | `session_date` (date YYYY-MM-DD) | **Yes** | When session occurred |

---

## 5️⃣ CONSENT & COMPLIANCE (1 field)

### Existing Fields (1)

| Field Name | Input Type | Data Source | Storage | Required | Notes |
|-----------|-----------|-------------|---------|----------|-------|
| **Consent Verified** | Checkbox | User input | `consentVerified` (boolean) | **Yes** | Blocks submission if false |

### New Fields (0)

*No new fields in this section*

---

## 📋 COMPLETE FIELD LIST (Alphabetical)

### 🔵 Existing Fields (22)

1. Administration Route (dropdown, database) 🔄
2. Adverse Events Toggle (checkbox)
3. Age (dropdown, hardcoded)
4. Baseline PHQ-9 Score (dropdown, hardcoded)
5. Biological Sex (dropdown, hardcoded)
6. Concomitant Medications (multi-select, hardcoded)
7. Consent Verified (checkbox) ⚠️ **REQUIRED**
8. Frequency (dropdown, hardcoded)
9. Integration Hours (number input)
10. Prep Hours (number input)
11. Primary Clinical Observation (dropdown, database, conditional) 🔄
12. Psychological Difficulty (range slider)
13. Race/Ethnicity (dropdown, hardcoded)
14. Resolution Status (dropdown, database) 🔄
15. Setting (dropdown, hardcoded)
16. Severity (CTCAE Grade) (dropdown, database, conditional) 🔄
17. Smoking Status (dropdown, database) 🔄
18. Standardized Dosage (number input + unit dropdown)
19. Subject Birth Reference (text input, hashed)
20. Substance Compound (dropdown, database) 🔄
21. Support Modality (multi-select checkboxes, database) 🔄
22. Weight Range (dropdown, hardcoded)

### 🆕 New Fields (4)

23. **Primary Indication** (dropdown, database) 🔄 ⚠️ **REQUIRED**
24. **Protocol Template** (dropdown, hardcoded, optional)
25. **Session Date** (date picker) ⚠️ **REQUIRED**
26. **Session Number** (dropdown, hardcoded) ⚠️ **REQUIRED**

---

## 🔄 DATABASE-DRIVEN FIELDS (11 total)

### Converted from Hardcoded (7)

1. **Substance Compound** → `ref_substances` (8 substances)
2. **Administration Route** → `ref_routes` (9 routes)
3. **Support Modality** → `ref_support_modality` (5 modalities)
4. **Smoking Status** → `ref_smoking_status` (4 statuses)
5. **Severity (CTCAE Grade)** → `ref_severity_grade` (5 grades)
6. **Primary Clinical Observation** → `ref_safety_events` (13 event types)
7. **Resolution Status** → `ref_resolution_status` (3 statuses)

### New Database Fields (4)

8. **Primary Indication** 🆕 → `ref_indications` (9 conditions)
9. **Protocol Template** 🆕 → Hardcoded for MVP (will be database later)
10. **Session Number** 🆕 → Hardcoded (1-6+, Follow-up)
11. **Session Date** 🆕 → User input (date picker)

---

## ⚠️ REQUIRED FIELDS (13 total)

### Existing Required (10)

1. Age
2. Biological Sex
3. Race/Ethnicity
4. Weight Range
5. Smoking Status
6. Substance Compound
7. Administration Route
8. Standardized Dosage
9. Frequency
10. **Consent Verified** (blocks submission)

### New Required (3) 🆕

11. **Primary Indication** 🆕
12. **Session Number** 🆕
13. **Session Date** 🆕

---

## 🔀 CONDITIONAL FIELDS (2)

These fields only appear if **Adverse Events Toggle** is enabled:

1. **Severity (CTCAE Grade)** - Required if adverse event
2. **Primary Clinical Observation** - Required if adverse event

---

## 📊 FIELD TYPE BREAKDOWN

| Input Type | Count | Examples |
|-----------|-------|----------|
| **Dropdown (single-select)** | 17 | Substance, Route, Indication, Age, Sex, etc. |
| **Multi-select (checkboxes)** | 2 | Support Modality, Concomitant Medications |
| **Number Input** | 3 | Dosage, Prep Hours, Integration Hours |
| **Text Input** | 1 | Subject Birth Reference (YYYY-MM) |
| **Date Picker** | 1 🆕 | Session Date |
| **Range Slider** | 1 | Psychological Difficulty (1-10) |
| **Checkbox/Toggle** | 2 | Adverse Events Toggle, Consent Verified |

---

## 🎯 WHAT CHANGED (Summary)

### Before Migration 003:
- **22 total fields**
- **0 database-driven dropdowns** (all hardcoded)
- **10 required fields**
- **No indication tracking**
- **No session progression tracking**
- **No date tracking**

### After Migration 003:
- **26 total fields** (+4 new)
- **11 database-driven fields** (7 converted + 4 new)
- **13 required fields** (+3 new)
- ✅ **Indication tracking enabled** (Primary Indication field)
- ✅ **Session progression tracking enabled** (Session Number field)
- ✅ **Timeline analytics enabled** (Session Date field)
- ✅ **Protocol templating enabled** (Protocol Template field)

---

## 🚀 ANALYTICS UNLOCKED BY NEW FIELDS

### Primary Indication Field Enables:
- Filter by condition (Depression vs PTSD vs Anxiety)
- Indication-specific outcome analysis
- Condition-specific drop-off rates
- Cross-indication comparisons

### Session Number Field Enables:
- Patient journey timelines
- Session-to-session improvement tracking
- Optimal session count analysis
- First-session vs follow-up comparisons

### Session Date Field Enables:
- Time-series analysis
- Seasonal pattern detection
- Days-from-baseline calculations
- Retention timeline tracking

### Protocol Template Field Enables:
- Protocol standardization
- Template effectiveness comparison
- Best practice identification
- Reusable protocol library

---

## 📁 STORAGE MAPPING

### formData State Structure (After Changes):

```typescript
{
  // Identity
  subjectId: string,
  patientInput: string,
  patientHash: string,
  
  // Demographics (8 fields)
  subjectAge: string,
  sex: string,
  race: string,
  weightRange: string,
  smoking_status_id: bigint | null,        // 🔄 Database
  indication_id: bigint | null,            // 🆕 Database
  concomitantMeds: string,
  
  // Protocol Parameters (6 fields)
  protocol_template_id: uuid | null,       // 🆕 Hardcoded (MVP)
  substance_id: bigint | null,             // 🔄 Database
  dosage: string,
  dosageUnit: string,
  route_id: bigint | null,                 // 🔄 Database
  frequency: string,
  session_number: integer,                 // 🆕 Hardcoded
  
  // Therapeutic Context (5 fields)
  setting: string,
  prepHours: string,
  integrationHours: string,
  support_modality_ids: bigint[],          // 🔄 Database (array)
  
  // Clinical Outcomes & Safety (7 fields)
  session_date: date,                      // 🆕 Date picker
  difficultyScore: integer,
  phq9Score: integer,
  resolution_status_id: bigint | null,     // 🔄 Database
  hasSafetyEvent: boolean,
  severity_grade_id: bigint | null,        // 🔄 Database (conditional)
  safety_event_id: bigint | null,          // 🔄 Database (conditional)
  
  // Consent (1 field)
  consentVerified: boolean                 // ⚠️ Required
}
```

---

## ✅ VALIDATION RULES

### Required Field Validation:
```typescript
isFormValid = (
  substance_id !== null &&
  route_id !== null &&
  indication_id !== null &&           // 🆕 Required
  session_number !== null &&          // 🆕 Required
  session_date !== '' &&              // 🆕 Required
  dosage.trim() !== '' &&
  sex !== '' &&
  race !== '' &&
  weightRange !== '' &&
  smoking_status_id !== null &&
  consentVerified === true
)
```

### Conditional Validation:
```typescript
if (hasSafetyEvent === true) {
  severity_grade_id !== null &&
  safety_event_id !== null
}
```

---

**STATUS:** Complete field inventory ready for DESIGNER implementation ✅
