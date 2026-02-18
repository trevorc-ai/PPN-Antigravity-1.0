# Wellness Journey: New Patient vs Returning Patient Workflow

**Document Created:** 2026-02-16T20:15:00-08:00  
**Purpose:** Define how providers start a new patient journey vs accessing a returning patient's data

---

## 🎯 CURRENT STATE (After Fixes)

### ✅ Fixes Applied

1. **Sidebar Restored** - Wellness Journey link now visible in sidebar under "Clinical Tools"
2. **Route Fixed** - `/arc-of-care-god-view` now wrapped in ProtectedLayout (sidebar + header visible)
3. **Default Phase** - Changed from Phase 3 (Integration) to Phase 1 (Preparation) for new patients
4. **Completed Phases** - Changed from `[1, 2]` to `[]` (empty array) for new patients

---

## 📋 EXISTING PATTERN IN PROTOCOLBUILDER

### **✅ Patient Selection Already Implemented!**

The **ProtocolBuilder** (`src/pages/ProtocolBuilder.tsx`) already has a complete patient selection workflow that we can reuse:

**Components:**
1. **`PatientSelectionScreen`** - Shows "New Patient" vs "Existing Patient" buttons
2. **`PatientLookupModal`** - Modal with search/filter to select existing patients
3. **`handleNewPatient()`** - Generates new Subject ID, sets session #1
4. **`handleExistingPatient()`** - Opens lookup modal
5. **`handleSelectPatient(patient)`** - Fetches last session data and pre-fills form

**Workflow:**
```typescript
// 1. User clicks "New Patient" button
handleNewPatient() {
  setFormData({
    subject_id: generateSubjectID(), // PT-XXXXXX
    session_number: 1,
  });
  setScreen('form');
}

// 2. User clicks "Existing Patient" button
handleExistingPatient() {
  setShowLookupModal(true); // Opens PatientLookupModal
}

// 3. User selects patient from modal
handleSelectPatient(patient) {
  // Fetch last session from database
  const lastSession = await supabase
    .from('log_clinical_records')
    .eq('subject_id', patient.subject_id)
    .order('session_number', { ascending: false })
    .single();
  
  // Pre-fill form with last session data
  setFormData({
    subject_id: lastSession.subject_id,
    session_number: lastSession.session_number + 1, // Auto-increment
    // ... other fields pre-filled
  });
}
```

**This same pattern should be applied to Wellness Journey!**

---

## 📋 RECOMMENDED WELLNESS JOURNEY WORKFLOW

### **Scenario 1: New Patient (First Visit)**

**Current Implementation:**
1. Provider clicks "Wellness Journey" in sidebar
2. Page loads with **Phase 1 (Preparation)** active by default
3. **No phases are marked as complete** (lock icons on Phase 2 & 3)
4. Provider fills out baseline assessment:
   - PHQ-9 (depression screening)
   - GAD-7 (anxiety screening)
   - ACE Score (trauma history)
   - Treatment Expectancy Scale

**Expected Behavior:**
- Phase 1 tab is **active** (red border, red background)
- Phase 2 tab is **locked** (disabled, lock icon visible)
- Phase 3 tab is **locked** (disabled, lock icon visible)
- Baseline metrics form is visible
- "Complete Phase 1" button at bottom

---

### **Scenario 2: Returning Patient (Mid-Journey)**

**Current Gap:** No way to select which patient to view

**Needed Implementation:**
1. Provider needs a **patient selector** before entering Wellness Journey
2. Options:
   - **Option A:** Add patient dropdown to Wellness Journey page header
   - **Option B:** Navigate from "My Protocols" page → Click patient → Opens Wellness Journey for that patient
   - **Option C:** Add "Search Patient" field in sidebar that filters Wellness Journey

**Recommended Approach: Option B**

**Workflow:**
1. Provider goes to "My Protocols" page
2. Sees list of all patients with their current phase status
3. Clicks on a patient row
4. Wellness Journey opens with:
   - **Active phase** = Patient's current phase (e.g., Phase 3 if 6 months post-session)
   - **Completed phases** = Array of completed phases (e.g., `[1, 2]`)
   - **Patient data** loaded from database

---

## 🔧 TECHNICAL IMPLEMENTATION NEEDED

### **1. Patient Selection System**

**Current State:**
- Wellness Journey uses **hardcoded mock data** (Patient PT-KXMR9W2P)
- No way to switch between patients
- No database integration

**Required Changes:**

#### **A. Add Patient ID to Route**
```typescript
// Change route from:
<Route path="/arc-of-care-god-view" element={<ArcOfCareGodView />} />

// To:
<Route path="/arc-of-care-god-view/:patientId" element={<ArcOfCareGodView />} />
```

#### **B. Fetch Patient Data from Database**
```typescript
const ArcOfCareGodView: React.FC = () => {
    const { patientId } = useParams(); // Get from URL
    const [journey, setJourney] = useState<PatientJourney | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatientJourney = async () => {
            if (!patientId) return;
            
            const { data, error } = await supabase
                .from('patient_journeys')
                .select('*')
                .eq('patient_id', patientId)
                .single();
            
            if (data) {
                setJourney(data);
                // Set active phase based on patient's current phase
                setActivePhase(data.current_phase || 1);
                // Set completed phases based on patient's progress
                setCompletedPhases(data.completed_phases || []);
            }
            setLoading(false);
        };
        
        fetchPatientJourney();
    }, [patientId]);
    
    // ...rest of component
};
```

#### **C. Update My Protocols Page**
```typescript
// In MyProtocols.tsx, add click handler to patient rows:
<tr 
    onClick={() => navigate(`/arc-of-care-god-view/${patient.patient_id}`)}
    className="cursor-pointer hover:bg-slate-800/50"
>
    <td>{patient.patient_id}</td>
    <td>{patient.name}</td>
    <td>{patient.current_phase}</td>
    <td>{patient.days_post_session}</td>
</tr>
```

---

### **2. Database Schema Requirements**

**Table: `patient_journeys`**
```sql
CREATE TABLE patient_journeys (
    journey_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id TEXT NOT NULL REFERENCES patients(patient_id),
    current_phase INTEGER DEFAULT 1 CHECK (current_phase IN (1, 2, 3)),
    completed_phases INTEGER[] DEFAULT '{}',
    session_date DATE,
    days_post_session INTEGER,
    
    -- Phase 1: Preparation
    baseline_phq9 INTEGER,
    baseline_gad7 INTEGER,
    baseline_ace_score INTEGER,
    baseline_expectancy INTEGER,
    
    -- Phase 2: Dosing Session
    substance_id INTEGER REFERENCES ref_substances(substance_id),
    dosage TEXT,
    session_number INTEGER,
    meq30_score INTEGER,
    edi_score INTEGER,
    ceq_score INTEGER,
    safety_events INTEGER DEFAULT 0,
    chemical_rescue_used BOOLEAN DEFAULT FALSE,
    
    -- Phase 3: Integration
    current_phq9 INTEGER,
    pulse_check_compliance INTEGER,
    phq9_compliance INTEGER,
    integration_sessions_attended INTEGER,
    integration_sessions_scheduled INTEGER,
    behavioral_changes TEXT[],
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### **3. Phase Progression Logic**

**Rules:**
1. **Phase 1 → Phase 2:** Can only advance after completing baseline assessment
2. **Phase 2 → Phase 3:** Can only advance after dosing session is complete
3. **Cannot skip phases** - Sequential progression enforced

**Implementation:**
```typescript
const completePhase = async (phaseNumber: 1 | 2 | 3) => {
    // Update database
    const { error } = await supabase
        .from('patient_journeys')
        .update({
            completed_phases: [...completedPhases, phaseNumber],
            current_phase: phaseNumber + 1
        })
        .eq('patient_id', patientId);
    
    if (!error) {
        setCompletedPhases([...completedPhases, phaseNumber]);
        setActivePhase((phaseNumber + 1) as 1 | 2 | 3);
    }
};
```

---

## 🎯 USER STORIES

### **Story 1: New Patient Intake**
```
AS A provider
WHEN I click "Wellness Journey" in the sidebar
THEN I should see a "Start New Patient Journey" button
AND clicking it should prompt me to enter patient ID
AND create a new journey record with Phase 1 active
```

### **Story 2: View Existing Patient**
```
AS A provider
WHEN I go to "My Protocols" page
AND I click on a patient row
THEN I should see their Wellness Journey
WITH their current phase active
AND their completed phases marked with checkmarks
AND their historical data displayed
```

### **Story 3: Complete a Phase**
```
AS A provider
WHEN I finish entering data for Phase 1
AND I click "Complete Phase 1"
THEN Phase 1 should be marked as complete (checkmark)
AND Phase 2 should become unlocked
AND the active tab should switch to Phase 2
```

---

## ✅ ACCEPTANCE CRITERIA

### **For New Patient:**
- [ ] Wellness Journey defaults to Phase 1
- [ ] Phase 2 and 3 are locked (disabled)
- [ ] No completed phases (no checkmarks)
- [ ] Baseline assessment form is visible
- [ ] "Complete Phase 1" button is present

### **For Returning Patient:**
- [ ] Wellness Journey loads patient's current phase
- [ ] Completed phases show checkmarks
- [ ] Future phases are locked
- [ ] Historical data is displayed correctly
- [ ] Can navigate between completed phases

### **For Phase Progression:**
- [ ] Cannot skip phases
- [ ] Completing Phase 1 unlocks Phase 2
- [ ] Completing Phase 2 unlocks Phase 3
- [ ] Phase completion is saved to database
- [ ] UI updates immediately after phase completion

---

## 🚨 CURRENT LIMITATIONS

1. **No Patient Selection** - Currently hardcoded to one patient (PT-KXMR9W2P)
2. **No Database Integration** - All data is mock/static
3. **No Phase Completion** - No way to mark a phase as complete
4. **No Phase Progression** - Cannot advance from Phase 1 → 2 → 3
5. **No Patient Creation** - No way to start a new patient journey

---

## 📝 RECOMMENDED NEXT STEPS

### **Priority 1: Patient Selection (WO-067)**
- Add patient ID parameter to route
- Create patient selector component
- Integrate with My Protocols page

### **Priority 2: Database Integration (WO-068)**
- Create `patient_journeys` table
- Fetch patient data from Supabase
- Replace mock data with real data

### **Priority 3: Phase Progression (WO-069)**
- Add "Complete Phase" buttons
- Implement phase locking logic
- Save phase completion to database

### **Priority 4: New Patient Creation (WO-070)**
- Add "Start New Patient Journey" flow
- Create patient intake form
- Initialize journey record in database

---

**Status:** Documentation complete. Ready for LEAD to create work orders.

