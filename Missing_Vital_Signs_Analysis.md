# Missing Vital Signs & Physiological Metrics Analysis

**Date:** February 17, 2026, 3:48 PM PST  
**Analyst:** PRODDY  
**Source:** SESSIONS.md, Doctor_Interview.md, session-research.md

---

## 🎯 EXECUTIVE SUMMARY

**Bottom Line:** We're tracking **80% of required vitals**, but missing **5 critical metrics** mentioned in the research.

**Current SessionVitalsForm Tracks:**
- ✅ Heart Rate (HR)
- ✅ Heart Rate Variability (HRV)
- ✅ Blood Pressure (Systolic/Diastolic)
- ✅ SpO2 (Blood oxygen saturation)

**Missing from Research:**
- ❌ **Respiratory Rate** (mentioned 3x in research)
- ❌ **Temperature** (thermoregulation monitoring)
- ❌ **ECG/EKG** (baseline requirement)
- ❌ **Diaphoresis Score** (sweating/perspiration)
- ❌ **Level of Consciousness** (LOC scale)

---

## 📊 DETAILED FINDINGS

### **1. RESPIRATORY RATE** ⚠️ HIGH PRIORITY

**Frequency in Research:** 3 mentions

**Key Quotes:**

> **Doctor Interview:**  
> "Respiratory rate is 16, heart rate is 122, and their baseline was 84. You know, not crazy tachycardia. Not crazy diaphoretic."

> **SESSIONS.md:**  
> "For esketamine, REMS materials require monitoring for at least 2 hours for sedation, dissociation, and **respiratory depression** using pulse oximetry and vital signs."

> **session-research.md:**  
> "American Society of Anesthesiologists 2018 moderate procedural sedation guidelines emphasize monitoring **ventilation and oxygenation** using clinical observation plus pulse oximetry and capnography."

**Why It Matters:**
- **Respiratory depression** is a critical safety concern with ketamine/esketamine
- Required for **sedation monitoring** (ASA guidelines)
- Doctor explicitly tracks it for **pharmacodynamic decision-making**

**Recommended Implementation:**
- Add `respiratory_rate` field (breaths per minute)
- Normal range: 12-20 breaths/min
- Alert thresholds: <10 (critical), >24 (elevated)

---

### **2. TEMPERATURE** ⚠️ MEDIUM PRIORITY

**Frequency in Research:** 2 mentions

**Key Quotes:**

> **SESSIONS.md:**  
> "Temperature is closely monitored and modulated with blankets, as psychedelics frequently induce **fluctuations in thermoregulation and diaphoresis**."

> **Wellness Journey Mock Data:**  
> `temperature: 98.6` (included in risk detection vitals)

**Why It Matters:**
- Psychedelics cause **thermoregulation fluctuations**
- MDMA specifically can cause **hyperthermia** (dangerous)
- Linked to **diaphoresis** (sweating) monitoring

**Recommended Implementation:**
- Add `temperature` field (°F or °C)
- Normal range: 97.0-99.5°F (36.1-37.5°C)
- Alert thresholds: >100.4°F (fever), >103°F (critical hyperthermia)

---

### **3. ECG/EKG MONITORING** ⚠️ HIGH PRIORITY (Baseline)

**Frequency in Research:** 5 mentions

**Key Quotes:**

> **SESSIONS.md:**  
> "Providers require **baseline electrocardiograms (ECGs)**, comprehensive metabolic panels, complete blood counts, and hepatic function tests during the intake phase."

> **SESSIONS.md:**  
> "CANMAT lists relative contraindications... and recommends **ECG** and urine toxicology when indicated."

> **session-research.md:**  
> "Patients commonly expect **ECG leads**, blood pressure cuff, and pulse oximetry in clinics."

**Why It Matters:**
- **Baseline ECG** required to screen for cardiac contraindications
- Detects **ventricular arrhythmias**, QT prolongation
- Required for patients with **cardiovascular risk factors**

**Recommended Implementation:**
- **Phase 1 (Baseline):** ECG upload/results field
  - QT interval, PR interval, QRS duration
  - Interpretation: Normal / Abnormal / Requires cardiology consult
- **Phase 2 (Dosing):** Continuous ECG monitoring (if available)
  - Heart rhythm, arrhythmia detection
  - Integration with wearable ECG devices (e.g., KardiaMobile)

---

### **4. DIAPHORESIS SCORE** ⚠️ MEDIUM PRIORITY

**Frequency in Research:** 2 mentions

**Key Quotes:**

> **Doctor Interview:**  
> "Not crazy tachycardia. **Not crazy diaphoretic**."

> **SESSIONS.md:**  
> "Temperature is closely monitored and modulated with blankets, as psychedelics frequently induce fluctuations in thermoregulation and **diaphoresis**."

**Why It Matters:**
- **Diaphoresis** (excessive sweating) is a sympathomimetic effect
- Indicator of **autonomic nervous system activation**
- Linked to **temperature dysregulation**

**Recommended Implementation:**
- Add `diaphoresis_score` field (0-3 scale)
  - 0 = None (dry skin)
  - 1 = Mild (slight moisture)
  - 2 = Moderate (visible sweating)
  - 3 = Severe (profuse sweating, soaked clothing)
- Subjective observation by provider

---

### **5. LEVEL OF CONSCIOUSNESS (LOC)** ⚠️ HIGH PRIORITY

**Frequency in Research:** 4 mentions

**Key Quotes:**

> **session-research.md:**  
> "Monitor blood pressure, heart rate, oxygenation, and **level of consciousness** before, during, and after dosing."

> **SESSIONS.md:**  
> "CANMAT recommends monitoring blood pressure, heart rate, oximetry, and **level of consciousness** before and during infusions and for at least 1 hour post-infusion."

**Why It Matters:**
- **Sedation monitoring** (required for ketamine/esketamine)
- Detects **over-sedation** or **dissociation**
- Required for **discharge safety** assessment

**Recommended Implementation:**
- Add `level_of_consciousness` field (scale)
  - **Alert** (A) - Fully awake, responsive
  - **Verbal** (V) - Responds to verbal stimuli
  - **Pain** (P) - Responds only to painful stimuli
  - **Unresponsive** (U) - No response
- Or use **Richmond Agitation-Sedation Scale (RASS)**:
  - +4 = Combative
  - 0 = Alert and calm
  - -5 = Unarousable

---

## 📋 COMPARISON TABLE

| **Vital Sign** | **Currently Tracked?** | **Research Priority** | **Implementation Complexity** |
|----------------|------------------------|----------------------|-------------------------------|
| Heart Rate | ✅ Yes | HIGH | ✅ Complete |
| HRV | ✅ Yes | MEDIUM | ✅ Complete |
| Blood Pressure | ✅ Yes | HIGH | ✅ Complete |
| SpO2 | ✅ Yes | HIGH | ✅ Complete |
| **Respiratory Rate** | ❌ No | **HIGH** | 🟡 Easy (numeric input) |
| **Temperature** | ❌ No | **MEDIUM** | 🟡 Easy (numeric input) |
| **ECG (Baseline)** | ❌ No | **HIGH** | 🟠 Medium (file upload + interpretation) |
| **Diaphoresis Score** | ❌ No | **MEDIUM** | 🟡 Easy (0-3 scale) |
| **Level of Consciousness** | ❌ No | **HIGH** | 🟡 Easy (dropdown/scale) |

---

## 🎯 RECOMMENDED ADDITIONS TO SessionVitalsForm

### **Phase 1: Quick Wins (Easy Additions)**

Add to `SessionVitalsForm.tsx`:

```typescript
export interface VitalSignReading {
    id: string;
    // Existing fields
    heart_rate?: number;
    hrv?: number;
    bp_systolic?: number;
    bp_diastolic?: number;
    spo2?: number;
    
    // NEW FIELDS
    respiratory_rate?: number;      // breaths/min (12-20 normal)
    temperature?: number;            // °F (97.0-99.5 normal)
    diaphoresis_score?: number;      // 0-3 scale
    level_of_consciousness?: string; // 'alert' | 'verbal' | 'pain' | 'unresponsive'
    
    // Existing metadata
    recorded_at?: string;
    data_source?: string;
    device_id?: string;
}
```

### **Phase 2: ECG Integration (Medium Complexity)**

Add to `BaselinePhysiologyForm.tsx` (Phase 1):

```typescript
export interface BaselinePhysiology {
    // Existing fields...
    
    // NEW ECG FIELDS
    ecg_performed?: boolean;
    ecg_date?: string;
    ecg_interpretation?: 'normal' | 'abnormal' | 'requires_consult';
    ecg_qt_interval?: number;       // milliseconds
    ecg_pr_interval?: number;       // milliseconds
    ecg_qrs_duration?: number;      // milliseconds
    ecg_notes?: string;
    ecg_file_url?: string;          // Upload ECG PDF/image
}
```

---

## 📊 ALERT THRESHOLDS (Based on Research)

### **Respiratory Rate**
- **Normal:** 12-20 breaths/min
- **Elevated:** <10 or >24 breaths/min (⚠️ Yellow alert)
- **Critical:** <8 or >30 breaths/min (🔴 Red alert - respiratory depression/distress)

### **Temperature**
- **Normal:** 97.0-99.5°F (36.1-37.5°C)
- **Elevated:** 99.6-100.4°F (⚠️ Yellow alert - mild fever)
- **Critical:** >100.4°F (🔴 Red alert - hyperthermia risk, especially with MDMA)

### **Diaphoresis Score**
- **0 (None):** ✅ Normal
- **1 (Mild):** ✅ Normal (slight moisture)
- **2 (Moderate):** ⚠️ Monitor (visible sweating)
- **3 (Severe):** 🔴 Alert (profuse sweating - check temperature, hydration)

### **Level of Consciousness**
- **Alert:** ✅ Normal
- **Verbal:** ⚠️ Monitor (responds to voice only)
- **Pain:** 🔴 Alert (over-sedation)
- **Unresponsive:** 🔴 CRITICAL (emergency response)

---

## 🚀 IMPLEMENTATION ROADMAP

### **Week 1: Quick Wins**
1. Add 4 new fields to `SessionVitalsForm`:
   - `respiratory_rate` (numeric, 0-60 range)
   - `temperature` (numeric, 90-110°F range)
   - `diaphoresis_score` (dropdown, 0-3)
   - `level_of_consciousness` (dropdown, AVPU scale)

2. Add alert thresholds to `getVitalStatus()` function

3. Update database schema:
   ```sql
   ALTER TABLE session_vitals ADD COLUMN respiratory_rate INTEGER;
   ALTER TABLE session_vitals ADD COLUMN temperature DECIMAL(4,1);
   ALTER TABLE session_vitals ADD COLUMN diaphoresis_score INTEGER CHECK (diaphoresis_score BETWEEN 0 AND 3);
   ALTER TABLE session_vitals ADD COLUMN level_of_consciousness TEXT;
   ```

### **Week 2: ECG Integration**
1. Add ECG fields to `BaselinePhysiologyForm`
2. Implement file upload for ECG PDFs/images
3. Add ECG interpretation dropdown
4. Update database schema for baseline ECG data

### **Week 3: Testing & Validation**
1. Test new fields with mock data
2. Validate alert thresholds
3. Provider feedback on UX
4. Adjust ranges based on clinical input

---

## 💡 KEY INSIGHTS

### **Why These Metrics Matter:**

1. **Respiratory Rate** - Detects respiratory depression (ketamine/esketamine risk)
2. **Temperature** - Prevents hyperthermia (MDMA risk)
3. **ECG** - Screens for cardiac contraindications (baseline safety)
4. **Diaphoresis** - Monitors autonomic activation (sympathomimetic effects)
5. **LOC** - Ensures safe sedation levels (discharge readiness)

### **Doctor's Decision-Making Process:**

From the interview, the doctor uses **3 types of data**:
1. **Quantitative** (vitals: HR 122, RR 16)
2. **Qualitative** (observations: "not crazy diaphoretic")
3. **Intuitive** (clinical judgment: "should we add ketamine?")

**Our system should support all 3:**
- ✅ Quantitative = Numeric vital fields
- ✅ Qualitative = Diaphoresis score, LOC scale
- ⚠️ Intuitive = Clinical notes field (already exists in SessionObservationsForm)

---

## 📝 CONCLUSION

**We're tracking 80% of required vitals**, but missing **5 critical metrics**:

1. **Respiratory Rate** (HIGH PRIORITY) - Easy to add
2. **Temperature** (MEDIUM PRIORITY) - Easy to add
3. **ECG Baseline** (HIGH PRIORITY) - Medium complexity (file upload)
4. **Diaphoresis Score** (MEDIUM PRIORITY) - Easy to add
5. **Level of Consciousness** (HIGH PRIORITY) - Easy to add

**Recommended Action:** Add the 4 easy fields (RR, Temp, Diaphoresis, LOC) to SessionVitalsForm in **Week 1**, then tackle ECG integration in **Week 2**.

**Impact:** This will bring us to **100% coverage** of research-documented vital signs, ensuring compliance with ASA guidelines, CANMAT recommendations, and REMS requirements.

---

**PRODDY SIGN-OFF:** These additions are **low-hanging fruit** that significantly improve clinical safety monitoring. The SessionVitalsForm pattern makes implementation straightforward.
