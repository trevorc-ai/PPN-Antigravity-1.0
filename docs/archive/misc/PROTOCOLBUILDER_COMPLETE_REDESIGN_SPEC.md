# 🎯 ProtocolBuilder Complete Redesign Specification
**Date:** 2026-02-09 23:48 PST  
**Priority:** CRITICAL - Foundation for RWE Platform  
**Estimated Time:** 3-4 hours implementation  
**Status:** READY FOR BUILDER EXECUTION

---

## 📋 **EXECUTIVE SUMMARY**

**Mission:** Transform ProtocolBuilder from hardcoded form → FDA-grade data collection engine

**What Changes:**
- ✅ 7 hardcoded dropdowns → Database-driven (ref tables)
- ✅ 4 new fields added (Indication, Session #, Session Date, Protocol Template)
- ✅ Subject ID auto-generation (replace birth date input)
- ✅ Concomitant Meds → Reference table (fix free-text risk)
- ✅ All data stored as IDs (not labels)
- ✅ Foundation for CDISC/SDTM export

**What Stays the Same:**
- ❌ NO visual changes (fonts, colors, spacing, layout)
- ❌ NO accordion behavior changes
- ❌ NO tooltip changes (except new fields)
- ❌ NO tab order changes (unless fixing bugs)

---

## 🎯 **THE 4 STRATEGIC PILLARS**

### **1. Living Standard of Care (Dynamic Protocols)**
**Enabled by:** Primary Indication field
- Filter outcomes by condition (Depression vs PTSD vs Anxiety)
- Show "For patients like yours, network average is..."
- GPS for dosing decisions

### **2. Liability Shield (Automated Pharmacovigilance)**
**Enabled by:** Coded adverse events + drug interactions
- MedDRA-coded safety events
- RxNorm-coded medications
- Insurance-grade risk assessment

### **3. Invisible Clinical Trial (Decentralized Research)**
**Enabled by:** CDISC-compliant data structure
- Aggregate 500 clinics → answer research questions in 3 months
- License "Data Cubes" to Pharma
- FDA-ready from day 1

### **4. Retention Engine (Business ROI)**
**Enabled by:** Session tracking + timeline analytics
- Show where clinics lose patients
- Predict churn
- Optimize revenue

---

## 📊 **COMPLETE FIELD INVENTORY**

### **Total Fields: 27** (was 22)
- **Existing:** 22 fields
- **New:** 4 fields (Indication, Session #, Session Date, Protocol Template)
- **Modified:** 1 field (Concomitant Meds → ref table)

### **Database-Driven Fields: 12** (was 0)
- **Converted:** 7 fields (Substance, Route, Modality, Smoking, Severity, Safety Event, Resolution)
- **New:** 4 fields (Indication, Protocol Template, Session #, Session Date)
- **Fixed:** 1 field (Concomitant Meds)

---

## 🗂️ **SECTION STRUCTURE**

### **Section 1: Patient Demographics** (8 fields)
1. ~~Subject Birth Reference~~ → **Subject ID** (auto-generated) 🆕
2. Age (dropdown, hardcoded)
3. Biological Sex (dropdown, hardcoded)
4. Race/Ethnicity (dropdown, hardcoded SNOMED)
5. Weight Range (dropdown, hardcoded)
6. Smoking Status (dropdown, **database** `ref_smoking_status`) 🔄
7. **Primary Indication** (dropdown, **database** `ref_indications`) 🆕
8. Concomitant Medications (multi-select, **database** `ref_medications`) 🔄

### **Section 2: Protocol Parameters** (6 fields)
1. **Protocol Template** (dropdown, hardcoded MVP) 🆕
2. Substance Compound (dropdown, **database** `ref_substances`) 🔄
3. Standardized Dosage (number + unit dropdown)
4. Administration Route (dropdown, **database** `ref_routes`) 🔄
5. Frequency (dropdown, hardcoded)
6. **Session Number** (dropdown, hardcoded) 🆕

### **Section 3: Therapeutic Context** (5 fields)
1. Setting (dropdown, hardcoded)
2. Prep Hours (number input)
3. Integration Hours (number input)
4. Support Modality (checkboxes, **database** `ref_support_modality`) 🔄
5. *(Concomitant Meds moved to Demographics)*

### **Section 4: Clinical Outcomes & Safety** (7 fields)
1. **Session Date** (date picker) 🆕
2. Psychological Difficulty (slider 1-10)
3. Baseline PHQ-9 Score (dropdown, hardcoded)
4. Resolution Status (dropdown, **database** `ref_resolution_status`) 🔄
5. Adverse Events Toggle (checkbox)
6. Severity Grade (dropdown, **database** `ref_severity_grade`, conditional) 🔄
7. Primary Clinical Observation (dropdown, **database** `ref_safety_events`, conditional) 🔄

### **Section 5: Consent & Compliance** (1 field)
1. Consent Verified (checkbox, required)

---

## 🔧 **IMPLEMENTATION TASKS**

### **TASK 1: Subject ID Auto-Generation** (30 min)

**Current Problem:**
```typescript
// Birth date text input (PHI risk!)
<input 
  type="text" 
  placeholder="YYYY-MM"
  value={formData.patientInput}
  onChange={...}
/>
```

**Solution:**
```typescript
// Auto-generate on modal open
const generateSubjectID = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No confusing chars
  let id = '';
  for (let i = 0; i < 10; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SUBJ-${id}`;
};

// In useEffect when modal opens:
useEffect(() => {
  if (isOpen && !formData.subjectId) {
    setFormData(prev => ({
      ...prev,
      subjectId: generateSubjectID()
    }));
  }
}, [isOpen]);
```

**UI Changes:**
```tsx
{/* Replace birth date input with read-only Subject ID display */}
<div className="space-y-2">
  <label className={fieldLabelClass}>Subject ID (Auto-Generated)</label>
  <div className="flex items-center gap-3">
    <input
      type="text"
      value={formData.subjectId}
      readOnly
      className={`${standardInputClass} bg-slate-900/50 cursor-not-allowed font-mono`}
    />
    <SimpleTooltip text="Unique identifier for this subject. No PHI stored.">
      <HelpCircle size={12} className="text-slate-600 hover:text-primary cursor-help" />
    </SimpleTooltip>
  </div>
  <p className="text-[9px] text-slate-500 font-medium">
    This ID is randomly generated and contains no patient information.
  </p>
</div>
```

**Remove:**
- ❌ "Recent Subjects" dropdown (relied on birth date hash)
- ❌ `patientInput` field
- ❌ `patientHash` field
- ❌ `generatePatientHash()` function

---

### **TASK 2: Convert 7 Hardcoded Dropdowns → Database** (90 min)

#### **Pattern (Apply to All 7):**

**Step 1: Add State**
```typescript
const [substances, setSubstances] = useState<any[]>([]);
const [routes, setRoutes] = useState<any[]>([]);
const [modalities, setModalities] = useState<any[]>([]);
const [smokingStatuses, setSmokingStatuses] = useState<any[]>([]);
const [severityGrades, setSeverityGrades] = useState<any[]>([]);
const [safetyEvents, setSafetyEvents] = useState<any[]>([]);
const [resolutionStatuses, setResolutionStatuses] = useState<any[]>([]);
```

**Step 2: Fetch on Modal Open**
```typescript
useEffect(() => {
  if (!isOpen) return;

  const fetchReferenceData = async () => {
    try {
      // Fetch all ref tables in parallel
      const [
        substancesData,
        routesData,
        modalitiesData,
        smokingData,
        severityData,
        safetyData,
        resolutionData
      ] = await Promise.all([
        supabase.from('ref_substances').select('*').eq('is_active', true).order('substance_name'),
        supabase.from('ref_routes').select('*').eq('is_active', true).order('route_name'),
        supabase.from('ref_support_modality').select('*').eq('is_active', true).order('modality_name'),
        supabase.from('ref_smoking_status').select('*').eq('is_active', true).order('status_name'),
        supabase.from('ref_severity_grade').select('*').eq('is_active', true).order('grade_value'),
        supabase.from('ref_safety_events').select('*').eq('is_active', true).order('event_name'),
        supabase.from('ref_resolution_status').select('*').eq('is_active', true).order('status_name')
      ]);

      setSubstances(substancesData.data || []);
      setRoutes(routesData.data || []);
      setModalities(modalitiesData.data || []);
      setSmokingStatuses(smokingData.data || []);
      setSeverityGrades(severityData.data || []);
      setSafetyEvents(safetyData.data || []);
      setResolutionStatuses(resolutionData.data || []);
    } catch (error) {
      console.error('Error fetching reference data:', error);
    }
  };

  fetchReferenceData();
}, [isOpen]);
```

**Step 3: Update FormData**
```typescript
const [formData, setFormData] = useState({
  // OLD (hardcoded):
  // substance: SUBSTANCE_OPTIONS[0],
  // route: ROUTE_OPTIONS[0],
  // smokingStatus: SMOKING_OPTIONS[0],
  
  // NEW (database IDs):
  substance_id: null,              // bigint
  route_id: null,                  // bigint
  smoking_status_id: null,         // bigint
  severity_grade_id: null,         // bigint
  safety_event_id: null,           // bigint
  resolution_status_id: null,      // bigint
  support_modality_ids: [],        // bigint[] (array for multi-select)
  
  // ... rest of fields
});
```

**Step 4: Update Dropdowns**
```tsx
{/* BEFORE (hardcoded): */}
<select value={formData.substance} onChange={...}>
  {SUBSTANCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
</select>

{/* AFTER (database): */}
<select 
  value={formData.substance_id || ''} 
  onChange={e => setFormData({...formData, substance_id: parseInt(e.target.value)})}
  className={standardInputClass}
>
  <option value="" disabled>Select Substance...</option>
  {substances.map(s => (
    <option key={s.substance_id} value={s.substance_id}>
      {s.substance_name}
    </option>
  ))}
</select>
```

#### **Special Case: Support Modality (Multi-Select)**

**Handler:**
```typescript
const handleModalityChange = (modalityId: number) => {
  setFormData(prev => {
    const ids = prev.support_modality_ids || [];
    const exists = ids.includes(modalityId);
    
    return {
      ...prev,
      support_modality_ids: exists 
        ? ids.filter(id => id !== modalityId)
        : [...ids, modalityId]
    };
  });
};
```

**Checkboxes:**
```tsx
{modalities.map(mod => (
  <label key={mod.modality_id} className={/* existing classes */}>
    <input
      type="checkbox"
      checked={formData.support_modality_ids?.includes(mod.modality_id) || false}
      onChange={() => handleModalityChange(mod.modality_id)}
    />
    <span>{mod.modality_name}</span>
  </label>
))}
```

---

### **TASK 3: Add 4 New Fields** (60 min)

#### **3.1: Primary Indication** (Demographics Section)

**Add State:**
```typescript
const [indications, setIndications] = useState<any[]>([]);
```

**Fetch:**
```typescript
const indicationsData = await supabase
  .from('ref_indications')
  .select('*')
  .eq('is_active', true)
  .order('indication_name');
setIndications(indicationsData.data || []);
```

**FormData:**
```typescript
indication_id: null,  // bigint, required
```

**JSX (insert after Smoking Status):**
```tsx
<div className="space-y-2">
  <div className="flex items-center gap-2">
    <label className={fieldLabelClass}>Primary Indication</label>
    <SimpleTooltip text="What condition is being treated in this protocol?">
      <HelpCircle size={12} className="text-slate-600 hover:text-primary cursor-help" />
    </SimpleTooltip>
  </div>
  <select
    value={formData.indication_id || ''}
    onChange={e => setFormData({...formData, indication_id: parseInt(e.target.value)})}
    className={standardInputClass}
  >
    <option value="" disabled>Select Indication...</option>
    {indications.map(ind => (
      <option key={ind.indication_id} value={ind.indication_id}>
        {ind.indication_name}
      </option>
    ))}
  </select>
</div>
```

#### **3.2: Protocol Template** (Protocol Parameters Section - TOP)

**FormData:**
```typescript
protocol_template_id: null,  // string, optional
```

**Hardcoded Options:**
```typescript
const PROTOCOL_TEMPLATE_OPTIONS = [
  { value: null, label: '-- Create New Protocol --' },
  { value: 'standard-psilocybin', label: 'Standard Psilocybin 25mg (COMPASS)' },
  { value: 'mdma-maps', label: 'MDMA-Assisted Therapy (MAPS)' },
  { value: 'ketamine-iv', label: 'Ketamine IV 0.5mg/kg' },
  { value: 'esketamine-nasal', label: 'Esketamine Nasal 84mg' },
  { value: 'custom', label: 'Custom / Site-Specific' }
];
```

**JSX (insert at TOP of Protocol Parameters section):**
```tsx
<div className="space-y-2">
  <div className="flex items-center gap-2">
    <label className={fieldLabelClass}>Protocol Template (Optional)</label>
    <SimpleTooltip text="Link this session to a reusable protocol template, or create a new one.">
      <HelpCircle size={12} className="text-slate-600 hover:text-primary cursor-help" />
    </SimpleTooltip>
  </div>
  <select
    value={formData.protocol_template_id || ''}
    onChange={e => setFormData({...formData, protocol_template_id: e.target.value || null})}
    className={standardInputClass}
  >
    {PROTOCOL_TEMPLATE_OPTIONS.map(opt => (
      <option key={opt.value || 'new'} value={opt.value || ''}>
        {opt.label}
      </option>
    ))}
  </select>
</div>
```

#### **3.3: Session Number** (Protocol Parameters Section - after Frequency)

**FormData:**
```typescript
session_number: 1,  // integer, required, default 1
```

**Hardcoded Options:**
```typescript
const SESSION_NUMBER_OPTIONS = [
  { value: 1, label: 'Session 1 (Baseline)' },
  { value: 2, label: 'Session 2' },
  { value: 3, label: 'Session 3' },
  { value: 4, label: 'Session 4' },
  { value: 5, label: 'Session 5' },
  { value: 6, label: 'Session 6+' },
  { value: 0, label: 'Follow-up Only (No Dosing)' }
];
```

**JSX (insert after Frequency field):**
```tsx
<div className="space-y-2">
  <div className="flex items-center gap-2">
    <label className={fieldLabelClass}>Session Number</label>
    <SimpleTooltip text="Track which session this is in the patient's treatment journey.">
      <HelpCircle size={12} className="text-slate-600 hover:text-primary cursor-help" />
    </SimpleTooltip>
  </div>
  <select
    value={formData.session_number}
    onChange={e => setFormData({...formData, session_number: parseInt(e.target.value)})}
    className={standardInputClass}
  >
    {SESSION_NUMBER_OPTIONS.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
</div>
```

#### **3.4: Session Date** (Clinical Outcomes Section - TOP)

**FormData:**
```typescript
session_date: new Date().toISOString().split('T')[0],  // YYYY-MM-DD, required, default today
```

**JSX (insert at TOP of Clinical Outcomes section):**
```tsx
<div className="space-y-2 pb-4 border-b border-slate-800/50">
  <div className="flex items-center gap-2">
    <label className={fieldLabelClass}>Session Date</label>
    <SimpleTooltip text="When did this session occur? Used for timeline analytics.">
      <HelpCircle size={12} className="text-slate-600 hover:text-primary cursor-help" />
    </SimpleTooltip>
  </div>
  <input
    type="date"
    value={formData.session_date}
    onChange={e => setFormData({...formData, session_date: e.target.value})}
    className={standardInputClass}
    max={new Date().toISOString().split('T')[0]}
  />
  <p className="text-[9px] text-slate-500 font-medium">
    Date is stored as days-from-baseline for privacy.
  </p>
</div>
```

---

### **TASK 4: Fix Concomitant Medications** (30 min)

**Current (Free-Text Risk):**
```typescript
concomitantMeds: "Sertraline, Bupropion, Lorazepam"  // ❌ String
```

**New (Reference Table):**
```typescript
concomitant_med_ids: [45, 67, 89]  // ✅ Array of IDs
```

**Add State:**
```typescript
const [medications, setMedications] = useState<any[]>([]);
```

**Fetch:**
```typescript
const medsData = await supabase
  .from('ref_medications')
  .select('*')
  .eq('is_active', true)
  .order('medication_name');
setMedications(medsData.data || []);
```

**Handler:**
```typescript
const handleMedicationToggle = (medId: number) => {
  setFormData(prev => {
    const ids = prev.concomitant_med_ids || [];
    const exists = ids.includes(medId);
    
    return {
      ...prev,
      concomitant_med_ids: exists 
        ? ids.filter(id => id !== medId)
        : [...ids, medId]
    };
  });
};
```

**JSX (replace existing med selector):**
```tsx
<div className="space-y-2">
  <div className="flex items-center gap-2">
    <label className={fieldLabelClass}>Concomitant Medications</label>
    <SimpleTooltip text="Select all medications the patient is currently taking.">
      <HelpCircle size={12} className="text-slate-600 hover:text-primary cursor-help" />
    </SimpleTooltip>
  </div>
  
  {/* Search box */}
  <input
    type="text"
    placeholder="Search medications..."
    className={`${standardInputClass} mb-2`}
    onChange={e => {
      const query = e.target.value.toLowerCase();
      setMedications(medications.filter(m => 
        m.medication_name.toLowerCase().includes(query)
      ));
    }}
  />
  
  {/* Checkbox list (scrollable) */}
  <div className="max-h-48 overflow-y-auto border border-slate-800 rounded-xl p-3 space-y-2">
    {medications.map(med => (
      <label key={med.medication_id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-800/30 p-2 rounded-lg transition-colors">
        <input
          type="checkbox"
          checked={formData.concomitant_med_ids?.includes(med.medication_id) || false}
          onChange={() => handleMedicationToggle(med.medication_id)}
          className="size-4"
        />
        <span className="text-sm text-slate-300">{med.medication_name}</span>
      </label>
    ))}
  </div>
  
  {/* Selected count */}
  <p className="text-[9px] text-slate-500 font-medium">
    {formData.concomitant_med_ids?.length || 0} medication(s) selected
  </p>
</div>
```

---

### **TASK 5: Update Validation** (15 min)

**Before:**
```typescript
const isFormValid = useMemo(() => {
  return (
    formData.substance !== '' &&
    formData.route !== '' &&
    formData.dosage.trim() !== '' &&
    formData.consentVerified === true
  );
}, [formData]);
```

**After:**
```typescript
const isFormValid = useMemo(() => {
  // Base required fields
  const baseValid = (
    formData.substance_id !== null &&           // Changed from substance !== ''
    formData.route_id !== null &&               // Changed from route !== ''
    formData.indication_id !== null &&          // NEW - required
    formData.session_number !== null &&         // NEW - required
    formData.session_date !== '' &&             // NEW - required
    formData.dosage.trim() !== '' &&
    formData.sex !== '' &&
    formData.race !== '' &&
    formData.weightRange !== '' &&
    formData.smoking_status_id !== null &&      // Changed from smokingStatus !== ''
    formData.consentVerified === true
  );

  // Conditional validation for adverse events
  if (formData.hasSafetyEvent) {
    return baseValid && 
      formData.severity_grade_id !== null &&    // Changed from severity !== ''
      formData.safety_event_id !== null;        // Changed from safetyEventDescription !== ''
  }

  return baseValid;
}, [formData]);
```

---

### **TASK 6: Update Submit Handler** (15 min)

**Before:**
```typescript
const handleSubmit = async () => {
  const newProtocol = {
    id: `PROTO-${Date.now()}`,
    siteId: 'SITE-001',
    status: 'Active',
    protocol: {
      substance: formData.substance,
      route: formData.route,
      dosage: formData.dosage,
      // ... etc
    }
  };
  
  // Insert to Supabase
  await supabase.from('protocols').insert(newProtocol);
};
```

**After:**
```typescript
const handleSubmit = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get user's site
    const { data: userSite } = await supabase
      .from('user_sites')
      .select('site_id')
      .eq('user_id', user.id)
      .single();

    if (!userSite) throw new Error('No site found for user');

    // Prepare data (ONLY IDs, no labels)
    const protocolData = {
      site_id: userSite.site_id,
      subject_id: formData.subjectId,
      
      // Demographics
      subject_age: parseInt(formData.subjectAge),
      sex: formData.sex,
      race: formData.race,
      weight_range: formData.weightRange,
      smoking_status_id: formData.smoking_status_id,
      indication_id: formData.indication_id,
      concomitant_med_ids: formData.concomitant_med_ids,
      
      // Protocol Parameters
      protocol_template_id: formData.protocol_template_id,
      substance_id: formData.substance_id,
      dosage: parseFloat(formData.dosage),
      dosage_unit: formData.dosageUnit,
      route_id: formData.route_id,
      frequency: formData.frequency,
      session_number: formData.session_number,
      
      // Therapeutic Context
      setting: formData.setting,
      prep_hours: parseFloat(formData.prepHours),
      integration_hours: parseFloat(formData.integrationHours),
      support_modality_ids: formData.support_modality_ids,
      
      // Clinical Outcomes
      session_date: formData.session_date,
      difficulty_score: formData.difficultyScore,
      phq9_score: formData.phq9Score,
      resolution_status_id: formData.resolution_status_id,
      has_safety_event: formData.hasSafetyEvent,
      severity_grade_id: formData.hasSafetyEvent ? formData.severity_grade_id : null,
      safety_event_id: formData.hasSafetyEvent ? formData.safety_event_id : null,
      
      // Consent
      consent_verified: formData.consentVerified,
      
      // Metadata
      created_at: new Date().toISOString(),
      created_by: user.id
    };

    // Insert to log_clinical_records
    const { data, error } = await supabase
      .from('log_clinical_records')
      .insert(protocolData)
      .select()
      .single();

    if (error) throw error;

    // Success!
    alert('Protocol created successfully!');
    onClose();
    window.location.reload(); // Refresh protocol list
    
  } catch (error) {
    console.error('Error creating protocol:', error);
    alert('Failed to create protocol. Please try again.');
  }
};
```

---

## ✅ **TESTING CHECKLIST**

### **Functionality:**
- [ ] Modal opens without errors
- [ ] Subject ID auto-generates on open
- [ ] All 12 dropdowns populate from Supabase
- [ ] Multi-select modalities work (check/uncheck)
- [ ] Multi-select medications work (search + select)
- [ ] Date picker works (max = today)
- [ ] Validation prevents submission without required fields
- [ ] Conditional adverse event fields show/hide correctly
- [ ] Form submits successfully
- [ ] Data stored as IDs (not labels) in database
- [ ] No console errors

### **Visual (No Changes):**
- [ ] Fonts unchanged
- [ ] Colors unchanged
- [ ] Spacing unchanged
- [ ] Layout unchanged
- [ ] Accordion behavior unchanged
- [ ] Tooltips display correctly
- [ ] Tab order works

### **Data Integrity:**
- [ ] Foreign key constraints prevent invalid IDs
- [ ] No free-text stored anywhere
- [ ] All IDs reference valid ref table rows
- [ ] Arrays stored correctly (support_modality_ids, concomitant_med_ids)

---

## 📊 **COMPLETE FORMDATA STATE (After Changes)**

```typescript
const [formData, setFormData] = useState({
  // Identity
  subjectId: '',                       // Auto-generated SUBJ-ABC123XYZ4
  
  // Demographics (8 fields)
  subjectAge: '35',                    // Dropdown 18-90
  sex: '',                             // Dropdown M/F/I/U
  race: '',                            // Dropdown SNOMED codes
  weightRange: WEIGHT_RANGES[6],       // Dropdown kg ranges
  smoking_status_id: null,             // 🔄 Database FK
  indication_id: null,                 // 🆕 Database FK
  concomitant_med_ids: [],             // 🔄 Database FK array
  
  // Protocol Parameters (6 fields)
  protocol_template_id: null,          // 🆕 Hardcoded (MVP)
  substance_id: null,                  // 🔄 Database FK
  dosage: '25',                        // Number input
  dosageUnit: 'mg',                    // Dropdown
  route_id: null,                      // 🔄 Database FK
  frequency: FREQUENCY_OPTIONS[0],     // Dropdown
  session_number: 1,                   // 🆕 Dropdown
  
  // Therapeutic Context (5 fields)
  setting: SETTING_OPTIONS[0],         // Dropdown
  prepHours: '2',                      // Number input
  integrationHours: '4',               // Number input
  support_modality_ids: [],            // 🔄 Database FK array
  
  // Clinical Outcomes & Safety (7 fields)
  session_date: new Date().toISOString().split('T')[0],  // 🆕 Date picker
  difficultyScore: 5,                  // Slider 1-10
  phq9Score: 18,                       // Dropdown 0-27
  resolution_status_id: null,          // 🔄 Database FK
  hasSafetyEvent: false,               // Checkbox
  severity_grade_id: null,             // 🔄 Database FK (conditional)
  safety_event_id: null,               // 🔄 Database FK (conditional)
  
  // Consent (1 field)
  consentVerified: false               // Checkbox (required)
});
```

---

## 🚀 **EXECUTION SEQUENCE**

**Total Time: 3-4 hours**

1. **TASK 1:** Subject ID Auto-Generation (30 min)
2. **TASK 2:** Convert 7 Dropdowns → Database (90 min)
3. **TASK 3:** Add 4 New Fields (60 min)
4. **TASK 4:** Fix Concomitant Medications (30 min)
5. **TASK 5:** Update Validation (15 min)
6. **TASK 6:** Update Submit Handler (15 min)
7. **Testing:** Full QA (30 min)

---

## 📁 **FILES TO MODIFY**

1. **`src/pages/ProtocolBuilder.tsx`** - Main implementation
2. **`src/constants.ts`** - Remove hardcoded arrays (optional cleanup)

---

## 🎯 **SUCCESS CRITERIA**

✅ **All 12 fields pull from Supabase ref tables**  
✅ **All data stored as IDs (not labels)**  
✅ **Subject ID auto-generates (no PHI)**  
✅ **4 new fields integrated seamlessly**  
✅ **Concomitant meds fixed (no free-text)**  
✅ **Validation updated (13 required fields)**  
✅ **Submit handler stores clean data**  
✅ **NO visual changes**  
✅ **NO console errors**  
✅ **Foundation for CDISC export ready**

---

**STATUS:** ✅ READY FOR BUILDER EXECUTION

**Next Document:** Field-by-field mapping with code examples →
