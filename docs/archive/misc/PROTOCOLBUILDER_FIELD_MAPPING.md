# 📊 ProtocolBuilder Field-by-Field Mapping
**Date:** 2026-02-09 23:50 PST  
**Purpose:** Complete reference for every field's data flow  
**For:** Builder implementation

---

## 🗺️ **FIELD MAPPING OVERVIEW**

**Total Fields:** 27  
**Database-Driven:** 12  
**Hardcoded:** 15  
**Required:** 13  
**Conditional:** 2

---

## 1️⃣ **PATIENT DEMOGRAPHICS SECTION** (8 fields)

### **Field 1.1: Subject ID** 🆕

| Property | Value |
|----------|-------|
| **Display Name** | Subject ID (Auto-Generated) |
| **Input Type** | Read-only text |
| **Data Source** | Auto-generated on modal open |
| **Storage Column** | `subject_id` (text) |
| **Standard Code** | N/A (internal identifier) |
| **CDISC Domain** | DM (Demographics) |
| **CDISC Variable** | USUBJID |
| **Required** | Yes (auto-filled) |
| **Default** | `SUBJ-` + 10 random alphanumeric |
| **Validation** | Must match pattern `SUBJ-[A-Z0-9]{10}` |

**Code:**
```typescript
// Generation
const generateSubjectID = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = '';
  for (let i = 0; i < 10; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SUBJ-${id}`;
};

// Auto-fill on modal open
useEffect(() => {
  if (isOpen && !formData.subjectId) {
    setFormData(prev => ({
      ...prev,
      subjectId: generateSubjectID()
    }));
  }
}, [isOpen]);

// FormData
subjectId: '',  // string

// JSX
<input
  type="text"
  value={formData.subjectId}
  readOnly
  className={`${standardInputClass} bg-slate-900/50 cursor-not-allowed font-mono`}
/>
```

---

### **Field 1.2: Age**

| Property | Value |
|----------|-------|
| **Display Name** | Age |
| **Input Type** | Dropdown (single-select) |
| **Data Source** | Hardcoded array (18-90) |
| **Storage Column** | `subject_age` (integer) |
| **Standard Code** | N/A |
| **CDISC Domain** | DM (Demographics) |
| **CDISC Variable** | AGE |
| **Required** | Yes |
| **Default** | 35 |
| **Options** | 18, 19, 20, ..., 90 |

**Code:**
```typescript
// Options
const AGE_OPTIONS = Array.from({ length: 73 }, (_, i) => 18 + i);

// FormData
subjectAge: '35',  // string (will be parsed to int on submit)

// JSX
<select
  value={formData.subjectAge}
  onChange={e => setFormData({...formData, subjectAge: e.target.value})}
  className={standardInputClass}
>
  {AGE_OPTIONS.map(age => (
    <option key={age} value={age}>{age}</option>
  ))}
</select>
```

---

### **Field 1.3: Biological Sex**

| Property | Value |
|----------|-------|
| **Display Name** | Biological Sex |
| **Input Type** | Dropdown (single-select) |
| **Data Source** | Hardcoded array |
| **Storage Column** | `sex` (text) |
| **Standard Code** | CDISC controlled terminology |
| **CDISC Domain** | DM (Demographics) |
| **CDISC Variable** | SEX |
| **Required** | Yes |
| **Default** | None (force selection) |
| **Options** | Male, Female, Intersex, Unknown |

**Code:**
```typescript
// Options
const SEX_OPTIONS = ["Male", "Female", "Intersex", "Unknown"];

// FormData
sex: '',  // string

// JSX
<select
  value={formData.sex}
  onChange={e => setFormData({...formData, sex: e.target.value})}
  className={standardInputClass}
>
  <option value="" disabled>Select Sex...</option>
  {SEX_OPTIONS.map(s => (
    <option key={s} value={s}>{s}</option>
  ))}
</select>
```

---

### **Field 1.4: Race/Ethnicity**

| Property | Value |
|----------|-------|
| **Display Name** | Race/Ethnicity |
| **Input Type** | Dropdown (single-select) |
| **Data Source** | Hardcoded array with SNOMED codes |
| **Storage Column** | `race` (text - SNOMED code) |
| **Standard Code** | SNOMED CT |
| **CDISC Domain** | DM (Demographics) |
| **CDISC Variable** | RACE |
| **Required** | Yes |
| **Default** | None (force selection) |
| **Options** | 5 race categories with SNOMED codes |

**Code:**
```typescript
// Options (with SNOMED codes)
const RACE_OPTIONS = [
  { id: '2106-3', label: "White / Caucasian" },
  { id: '2054-5', label: "Black / African American" },
  { id: '2028-9', label: "Asian" },
  { id: '2076-8', label: "Pacific Islander" },
  { id: '1002-5', label: "Native American" }
];

// FormData
race: '',  // string (stores SNOMED code)

// JSX
<select
  value={formData.race}
  onChange={e => setFormData({...formData, race: e.target.value})}
  className={standardInputClass}
>
  <option value="" disabled>Select Race/Ethnicity...</option>
  {RACE_OPTIONS.map(r => (
    <option key={r.id} value={r.id}>{r.label}</option>
  ))}
</select>
```

---

### **Field 1.5: Weight Range**

| Property | Value |
|----------|-------|
| **Display Name** | Weight Range |
| **Input Type** | Dropdown (single-select) |
| **Data Source** | Hardcoded array (5kg bands) |
| **Storage Column** | `weight_range` (text) |
| **Standard Code** | N/A (privacy-safe range) |
| **CDISC Domain** | DM (Demographics) |
| **CDISC Variable** | Custom (not standard CDISC) |
| **Required** | Yes |
| **Default** | 70-75 kg |
| **Options** | 22 weight ranges (40-150 kg) |

**Code:**
```typescript
// Options (generated)
const WEIGHT_RANGES = Array.from({ length: 22 }, (_, i) => {
  const startKg = 40 + i * 5;
  const endKg = startKg + 5;
  const startLbs = Math.round(startKg * 2.20462);
  const endLbs = Math.round(endKg * 2.20462);
  return `${startKg}-${endKg} kg (${startLbs}-${endLbs} lbs)`;
});

// FormData
weightRange: WEIGHT_RANGES[6],  // string (default 70-75 kg)

// JSX
<select
  value={formData.weightRange}
  onChange={e => setFormData({...formData, weightRange: e.target.value})}
  className={standardInputClass}
>
  {WEIGHT_RANGES.map((range, idx) => (
    <option key={idx} value={range}>{range}</option>
  ))}
</select>
```

---

### **Field 1.6: Smoking Status** 🔄

| Property | Value |
|----------|-------|
| **Display Name** | Smoking Status |
| **Input Type** | Dropdown (single-select) |
| **Data Source** | **Database** (`ref_smoking_status`) |
| **Storage Column** | `smoking_status_id` (bigint FK) |
| **Standard Code** | SNOMED CT (future) |
| **CDISC Domain** | DM (Demographics) |
| **CDISC Variable** | Custom |
| **Required** | Yes |
| **Default** | None (force selection) |
| **Ref Table Schema** | `smoking_status_id`, `status_name`, `is_active` |

**Code:**
```typescript
// State
const [smokingStatuses, setSmokingStatuses] = useState<any[]>([]);

// Fetch
const { data } = await supabase
  .from('ref_smoking_status')
  .select('*')
  .eq('is_active', true)
  .order('status_name');
setSmokingStatuses(data || []);

// FormData
smoking_status_id: null,  // bigint

// JSX
<select
  value={formData.smoking_status_id || ''}
  onChange={e => setFormData({...formData, smoking_status_id: parseInt(e.target.value)})}
  className={standardInputClass}
>
  <option value="" disabled>Select Smoking Status...</option>
  {smokingStatuses.map(s => (
    <option key={s.smoking_status_id} value={s.smoking_status_id}>
      {s.status_name}
    </option>
  ))}
</select>
```

---

### **Field 1.7: Primary Indication** 🆕 🔄

| Property | Value |
|----------|-------|
| **Display Name** | Primary Indication |
| **Input Type** | Dropdown (single-select) |
| **Data Source** | **Database** (`ref_indications`) |
| **Storage Column** | `indication_id` (bigint FK) |
| **Standard Code** | ICD-10 (future) |
| **CDISC Domain** | MH (Medical History) |
| **CDISC Variable** | MHTERM |
| **Required** | **Yes** |
| **Default** | None (force selection) |
| **Ref Table Schema** | `indication_id`, `indication_name`, `icd10_code`, `is_active` |

**Code:**
```typescript
// State
const [indications, setIndications] = useState<any[]>([]);

// Fetch
const { data } = await supabase
  .from('ref_indications')
  .select('*')
  .eq('is_active', true)
  .order('indication_name');
setIndications(data || []);

// FormData
indication_id: null,  // bigint (REQUIRED)

// JSX
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

---

### **Field 1.8: Concomitant Medications** 🔄

| Property | Value |
|----------|-------|
| **Display Name** | Concomitant Medications |
| **Input Type** | Multi-select (checkboxes with search) |
| **Data Source** | **Database** (`ref_medications`) |
| **Storage Column** | `concomitant_med_ids` (bigint[] array) |
| **Standard Code** | RxNorm CUI (future) |
| **CDISC Domain** | CM (Concomitant Medications) |
| **CDISC Variable** | CMTRT |
| **Required** | No |
| **Default** | Empty array |
| **Ref Table Schema** | `medication_id`, `medication_name`, `rxnorm_cui`, `is_active` |

**Code:**
```typescript
// State
const [medications, setMedications] = useState<any[]>([]);
const [medSearchQuery, setMedSearchQuery] = useState('');

// Fetch
const { data } = await supabase
  .from('ref_medications')
  .select('*')
  .eq('is_active', true)
  .order('medication_name');
setMedications(data || []);

// FormData
concomitant_med_ids: [],  // bigint[]

// Handler
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

// Filtered list
const filteredMeds = medications.filter(m => 
  m.medication_name.toLowerCase().includes(medSearchQuery.toLowerCase())
);

// JSX
<div className="space-y-2">
  <label className={fieldLabelClass}>Concomitant Medications</label>
  
  {/* Search */}
  <input
    type="text"
    placeholder="Search medications..."
    value={medSearchQuery}
    onChange={e => setMedSearchQuery(e.target.value)}
    className={`${standardInputClass} mb-2`}
  />
  
  {/* Checkbox list */}
  <div className="max-h-48 overflow-y-auto border border-slate-800 rounded-xl p-3 space-y-2">
    {filteredMeds.map(med => (
      <label key={med.medication_id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-800/30 p-2 rounded-lg">
        <input
          type="checkbox"
          checked={formData.concomitant_med_ids?.includes(med.medication_id) || false}
          onChange={() => handleMedicationToggle(med.medication_id)}
        />
        <span className="text-sm text-slate-300">{med.medication_name}</span>
      </label>
    ))}
  </div>
  
  {/* Count */}
  <p className="text-[9px] text-slate-500">
    {formData.concomitant_med_ids?.length || 0} medication(s) selected
  </p>
</div>
```

---

## 2️⃣ **PROTOCOL PARAMETERS SECTION** (6 fields)

### **Field 2.1: Protocol Template** 🆕

| Property | Value |
|----------|-------|
| **Display Name** | Protocol Template (Optional) |
| **Input Type** | Dropdown (single-select) |
| **Data Source** | Hardcoded (MVP) |
| **Storage Column** | `protocol_template_id` (text, nullable) |
| **Standard Code** | N/A (internal) |
| **CDISC Domain** | TA (Trial Arms) |
| **CDISC Variable** | ARM |
| **Required** | No |
| **Default** | null (Create New) |
| **Options** | 6 template options |

**Code:**
```typescript
// Options
const PROTOCOL_TEMPLATE_OPTIONS = [
  { value: null, label: '-- Create New Protocol --' },
  { value: 'standard-psilocybin', label: 'Standard Psilocybin 25mg (COMPASS)' },
  { value: 'mdma-maps', label: 'MDMA-Assisted Therapy (MAPS)' },
  { value: 'ketamine-iv', label: 'Ketamine IV 0.5mg/kg' },
  { value: 'esketamine-nasal', label: 'Esketamine Nasal 84mg' },
  { value: 'custom', label: 'Custom / Site-Specific' }
];

// FormData
protocol_template_id: null,  // string | null

// JSX
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
```

---

### **Field 2.2: Substance Compound** 🔄

| Property | Value |
|----------|-------|
| **Display Name** | Substance Compound |
| **Input Type** | Dropdown (single-select) |
| **Data Source** | **Database** (`ref_substances`) |
| **Storage Column** | `substance_id` (bigint FK) |
| **Standard Code** | RxNorm CUI |
| **CDISC Domain** | EX (Exposure) |
| **CDISC Variable** | EXTRT |
| **Required** | **Yes** |
| **Default** | None (force selection) |
| **Ref Table Schema** | `substance_id`, `substance_name`, `rxnorm_cui`, `is_active` |

**Code:**
```typescript
// State
const [substances, setSubstances] = useState<any[]>([]);

// Fetch
const { data } = await supabase
  .from('ref_substances')
  .select('*')
  .eq('is_active', true)
  .order('substance_name');
setSubstances(data || []);

// FormData
substance_id: null,  // bigint (REQUIRED)

// JSX
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

---

### **Field 2.3: Standardized Dosage**

| Property | Value |
|----------|-------|
| **Display Name** | Standardized Dosage |
| **Input Type** | Number input + Unit dropdown |
| **Data Source** | User input + hardcoded units |
| **Storage Column** | `dosage` (numeric), `dosage_unit` (text) |
| **Standard Code** | UCUM (units) |
| **CDISC Domain** | EX (Exposure) |
| **CDISC Variable** | EXDOSE, EXDOSU |
| **Required** | **Yes** |
| **Default** | 25 mg |
| **Units** | mg, mcg, ml, Units, Drops |

**Code:**
```typescript
// Unit options
const UNIT_OPTIONS = ["mg", "mcg (µg)", "ml", "Units", "Drops"];

// FormData
dosage: '25',        // string (will be parsed to float)
dosageUnit: 'mg',    // string

// JSX
<div className="grid grid-cols-2 gap-3">
  {/* Amount */}
  <div>
    <label className={fieldLabelClass}>Amount</label>
    <input
      type="number"
      value={formData.dosage}
      onChange={e => setFormData({...formData, dosage: e.target.value})}
      className={standardInputClass}
      min="0"
      step="0.1"
    />
  </div>
  
  {/* Unit */}
  <div>
    <label className={fieldLabelClass}>Unit</label>
    <select
      value={formData.dosageUnit}
      onChange={e => setFormData({...formData, dosageUnit: e.target.value})}
      className={standardInputClass}
    >
      {UNIT_OPTIONS.map(u => (
        <option key={u} value={u}>{u}</option>
      ))}
    </select>
  </div>
</div>
```

---

### **Field 2.4: Administration Route** 🔄

| Property | Value |
|----------|-------|
| **Display Name** | Administration Route |
| **Input Type** | Dropdown (single-select) |
| **Data Source** | **Database** (`ref_routes`) |
| **Storage Column** | `route_id` (bigint FK) |
| **Standard Code** | NCI Thesaurus |
| **CDISC Domain** | EX (Exposure) |
| **CDISC Variable** | EXROUTE |
| **Required** | **Yes** |
| **Default** | None (force selection) |
| **Ref Table Schema** | `route_id`, `route_name`, `ncit_code`, `is_active` |

**Code:**
```typescript
// State
const [routes, setRoutes] = useState<any[]>([]);

// Fetch
const { data } = await supabase
  .from('ref_routes')
  .select('*')
  .eq('is_active', true)
  .order('route_name');
setRoutes(data || []);

// FormData
route_id: null,  // bigint (REQUIRED)

// JSX
<select
  value={formData.route_id || ''}
  onChange={e => setFormData({...formData, route_id: parseInt(e.target.value)})}
  className={standardInputClass}
>
  <option value="" disabled>Select Route...</option>
  {routes.map(r => (
    <option key={r.route_id} value={r.route_id}>
      {r.route_name}
    </option>
  ))}
</select>
```

---

### **Field 2.5: Frequency**

| Property | Value |
|----------|-------|
| **Display Name** | Frequency |
| **Input Type** | Dropdown (single-select) |
| **Data Source** | Hardcoded |
| **Storage Column** | `frequency` (text) |
| **Standard Code** | N/A |
| **CDISC Domain** | EX (Exposure) |
| **CDISC Variable** | EXFREQ |
| **Required** | Yes |
| **Default** | Single Session (Stat) |
| **Options** | 6 frequency options |

**Code:**
```typescript
// Options
const FREQUENCY_OPTIONS = [
  "Single Session (Stat)",
  "q.h. (Hourly)",
  "q.d. (Daily)",
  "b.i.d. (Twice Daily)",
  "q.w. (Weekly)",
  "PRN (As Needed)"
];

// FormData
frequency: FREQUENCY_OPTIONS[0],  // string

// JSX
<select
  value={formData.frequency}
  onChange={e => setFormData({...formData, frequency: e.target.value})}
  className={standardInputClass}
>
  {FREQUENCY_OPTIONS.map(f => (
    <option key={f} value={f}>{f}</option>
  ))}
</select>
```

---

### **Field 2.6: Session Number** 🆕

| Property | Value |
|----------|-------|
| **Display Name** | Session Number |
| **Input Type** | Dropdown (single-select) |
| **Data Source** | Hardcoded |
| **Storage Column** | `session_number` (integer) |
| **Standard Code** | N/A |
| **CDISC Domain** | SV (Subject Visits) |
| **CDISC Variable** | VISITNUM |
| **Required** | **Yes** |
| **Default** | 1 (Session 1 - Baseline) |
| **Options** | 7 session options (0-6+) |

**Code:**
```typescript
// Options
const SESSION_NUMBER_OPTIONS = [
  { value: 1, label: 'Session 1 (Baseline)' },
  { value: 2, label: 'Session 2' },
  { value: 3, label: 'Session 3' },
  { value: 4, label: 'Session 4' },
  { value: 5, label: 'Session 5' },
  { value: 6, label: 'Session 6+' },
  { value: 0, label: 'Follow-up Only (No Dosing)' }
];

// FormData
session_number: 1,  // integer (REQUIRED)

// JSX
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

---

## 3️⃣ **THERAPEUTIC CONTEXT SECTION** (5 fields)

### **Field 3.1: Setting**

| Property | Value |
|----------|-------|
| **Display Name** | Setting |
| **Input Type** | Dropdown (single-select) |
| **Data Source** | Hardcoded |
| **Storage Column** | `setting` (text) |
| **Standard Code** | N/A |
| **CDISC Domain** | Custom |
| **CDISC Variable** | Custom |
| **Required** | Yes |
| **Default** | Clinical (Medical) |
| **Options** | 5 setting types |

**Code:**
```typescript
// Options
const SETTING_OPTIONS = [
  'Clinical (Medical)',
  'Clinical (Soft/Spa)',
  'Home (Supervised)',
  'Retreat Center',
  'Remote/Telehealth'
];

// FormData
setting: SETTING_OPTIONS[0],  // string

// JSX
<select
  value={formData.setting}
  onChange={e => setFormData({...formData, setting: e.target.value})}
  className={standardInputClass}
>
  {SETTING_OPTIONS.map(s => (
    <option key={s} value={s}>{s}</option>
  ))}
</select>
```

---

### **Field 3.2: Prep Hours**

| Property | Value |
|----------|-------|
| **Display Name** | Prep Hours |
| **Input Type** | Number input |
| **Data Source** | User input |
| **Storage Column** | `prep_hours` (numeric) |
| **Standard Code** | N/A |
| **CDISC Domain** | Custom |
| **CDISC Variable** | Custom |
| **Required** | Yes |
| **Default** | 2 |
| **Range** | 0-20 |

**Code:**
```typescript
// FormData
prepHours: '2',  // string (will be parsed to float)

// JSX
<input
  type="number"
  value={formData.prepHours}
  onChange={e => setFormData({...formData, prepHours: e.target.value})}
  className={standardInputClass}
  min="0"
  max="20"
  step="0.5"
/>
```

---

### **Field 3.3: Integration Hours**

| Property | Value |
|----------|-------|
| **Display Name** | Integration Hours |
| **Input Type** | Number input |
| **Data Source** | User input |
| **Storage Column** | `integration_hours` (numeric) |
| **Standard Code** | N/A |
| **CDISC Domain** | Custom |
| **CDISC Variable** | Custom |
| **Required** | Yes |
| **Default** | 4 |
| **Range** | 0-50 |

**Code:**
```typescript
// FormData
integrationHours: '4',  // string (will be parsed to float)

// JSX
<input
  type="number"
  value={formData.integrationHours}
  onChange={e => setFormData({...formData, integrationHours: e.target.value})}
  className={standardInputClass}
  min="0"
  max="50"
  step="0.5"
/>
```

---

### **Field 3.4: Support Modality** 🔄

| Property | Value |
|----------|-------|
| **Display Name** | Support Modality |
| **Input Type** | Multi-select (checkboxes) |
| **Data Source** | **Database** (`ref_support_modality`) |
| **Storage Column** | `support_modality_ids` (bigint[] array) |
| **Standard Code** | N/A |
| **CDISC Domain** | Custom |
| **CDISC Variable** | Custom |
| **Required** | No |
| **Default** | Empty array |
| **Ref Table Schema** | `modality_id`, `modality_name`, `is_active` |

**Code:**
```typescript
// State
const [modalities, setModalities] = useState<any[]>([]);

// Fetch
const { data } = await supabase
  .from('ref_support_modality')
  .select('*')
  .eq('is_active', true)
  .order('modality_name');
setModalities(data || []);

// FormData
support_modality_ids: [],  // bigint[]

// Handler
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

// JSX
<div className="grid grid-cols-2 gap-2">
  {modalities.map(mod => (
    <label key={mod.modality_id} className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={formData.support_modality_ids?.includes(mod.modality_id) || false}
        onChange={() => handleModalityChange(mod.modality_id)}
      />
      <span className="text-sm">{mod.modality_name}</span>
    </label>
  ))}
</div>
```

---

## 4️⃣ **CLINICAL OUTCOMES & SAFETY SECTION** (7 fields)

### **Field 4.1: Session Date** 🆕

| Property | Value |
|----------|-------|
| **Display Name** | Session Date |
| **Input Type** | Date picker |
| **Data Source** | User input |
| **Storage Column** | `session_date` (date) |
| **Standard Code** | ISO 8601 |
| **CDISC Domain** | EX (Exposure) |
| **CDISC Variable** | EXSTDTC |
| **Required** | **Yes** |
| **Default** | Today |
| **Max** | Today (can't be future) |

**Code:**
```typescript
// FormData
session_date: new Date().toISOString().split('T')[0],  // YYYY-MM-DD (REQUIRED)

// JSX
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

### **Field 4.2: Psychological Difficulty**

| Property | Value |
|----------|-------|
| **Display Name** | Psychological Difficulty |
| **Input Type** | Range slider (1-10) |
| **Data Source** | User input |
| **Storage Column** | `difficulty_score` (integer) |
| **Standard Code** | N/A |
| **CDISC Domain** | QS (Questionnaires) |
| **CDISC Variable** | QSORRES |
| **Required** | Yes |
| **Default** | 5 |
| **Range** | 1-10 |

**Code:**
```typescript
// FormData
difficultyScore: 5,  // integer

// JSX
<div className="space-y-2">
  <label className={fieldLabelClass}>
    Psychological Difficulty: {formData.difficultyScore}/10
  </label>
  <input
    type="range"
    min="1"
    max="10"
    value={formData.difficultyScore}
    onChange={e => setFormData({...formData, difficultyScore: parseInt(e.target.value)})}
    className="w-full"
  />
</div>
```

---

### **Field 4.3: Baseline PHQ-9 Score**

| Property | Value |
|----------|-------|
| **Display Name** | Baseline PHQ-9 Score |
| **Input Type** | Dropdown (0-27) |
| **Data Source** | Hardcoded |
| **Storage Column** | `phq9_score` (integer) |
| **Standard Code** | LOINC 44261-6 |
| **CDISC Domain** | QS (Questionnaires) |
| **CDISC Variable** | QSORRES |
| **Required** | Yes |
| **Default** | 18 |
| **Range** | 0-27 |

**Code:**
```typescript
// Options
const PHQ9_SCORES = Array.from({ length: 28 }, (_, i) => i);

// FormData
phq9Score: 18,  // integer

// JSX
<select
  value={formData.phq9Score}
  onChange={e => setFormData({...formData, phq9Score: parseInt(e.target.value)})}
  className={standardInputClass}
>
  {PHQ9_SCORES.map(score => (
    <option key={score} value={score}>{score}</option>
  ))}
</select>
```

---

### **Field 4.4: Resolution Status** 🔄

| Property | Value |
|----------|-------|
| **Display Name** | Resolution Status |
| **Input Type** | Dropdown (single-select) |
| **Data Source** | **Database** (`ref_resolution_status`) |
| **Storage Column** | `resolution_status_id` (bigint FK) |
| **Standard Code** | N/A |
| **CDISC Domain** | AE (Adverse Events) |
| **CDISC Variable** | AEOUT |
| **Required** | Yes |
| **Default** | None (force selection) |
| **Ref Table Schema** | `resolution_status_id`, `status_name`, `is_active` |

**Code:**
```typescript
// State
const [resolutionStatuses, setResolutionStatuses] = useState<any[]>([]);

// Fetch
const { data } = await supabase
  .from('ref_resolution_status')
  .select('*')
  .eq('is_active', true)
  .order('status_name');
setResolutionStatuses(data || []);

// FormData
resolution_status_id: null,  // bigint (REQUIRED)

// JSX
<select
  value={formData.resolution_status_id || ''}
  onChange={e => setFormData({...formData, resolution_status_id: parseInt(e.target.value)})}
  className={standardInputClass}
>
  <option value="" disabled>Select Resolution Status...</option>
  {resolutionStatuses.map(r => (
    <option key={r.resolution_status_id} value={r.resolution_status_id}>
      {r.status_name}
    </option>
  ))}
</select>
```

---

### **Field 4.5: Adverse Events Toggle**

| Property | Value |
|----------|-------|
| **Display Name** | Adverse Events |
| **Input Type** | Checkbox/Toggle |
| **Data Source** | User input |
| **Storage Column** | `has_safety_event` (boolean) |
| **Standard Code** | N/A |
| **CDISC Domain** | AE (Adverse Events) |
| **CDISC Variable** | N/A (triggers conditional fields) |
| **Required** | No |
| **Default** | false |

**Code:**
```typescript
// FormData
hasSafetyEvent: false,  // boolean

// JSX
<label className="flex items-center gap-3 cursor-pointer">
  <input
    type="checkbox"
    checked={formData.hasSafetyEvent}
    onChange={e => setFormData({...formData, hasSafetyEvent: e.target.checked})}
    className="size-5"
  />
  <span className="text-sm font-bold">Adverse Event Occurred</span>
</label>
```

---

### **Field 4.6: Severity Grade** 🔄 (Conditional)

| Property | Value |
|----------|-------|
| **Display Name** | Severity (CTCAE Grade) |
| **Input Type** | Dropdown (single-select) |
| **Data Source** | **Database** (`ref_severity_grade`) |
| **Storage Column** | `severity_grade_id` (bigint FK, nullable) |
| **Standard Code** | CTCAE |
| **CDISC Domain** | AE (Adverse Events) |
| **CDISC Variable** | AESEV |
| **Required** | **Yes (if hasSafetyEvent = true)** |
| **Default** | null |
| **Ref Table Schema** | `severity_grade_id`, `grade_label`, `grade_value`, `is_active` |
| **Conditional** | Only shows if `hasSafetyEvent === true` |

**Code:**
```typescript
// State
const [severityGrades, setSeverityGrades] = useState<any[]>([]);

// Fetch
const { data } = await supabase
  .from('ref_severity_grade')
  .select('*')
  .eq('is_active', true)
  .order('grade_value');  // Order by numeric value
setSeverityGrades(data || []);

// FormData
severity_grade_id: null,  // bigint (REQUIRED if hasSafetyEvent)

// JSX (conditional)
{formData.hasSafetyEvent && (
  <select
    value={formData.severity_grade_id || ''}
    onChange={e => setFormData({...formData, severity_grade_id: parseInt(e.target.value)})}
    className={standardInputClass}
  >
    <option value="" disabled>Select Severity...</option>
    {severityGrades.map(s => (
      <option key={s.severity_grade_id} value={s.severity_grade_id}>
        {s.grade_label}
      </option>
    ))}
  </select>
)}
```

---

### **Field 4.7: Primary Clinical Observation** 🔄 (Conditional)

| Property | Value |
|----------|-------|
| **Display Name** | Primary Clinical Observation |
| **Input Type** | Dropdown (single-select) |
| **Data Source** | **Database** (`ref_safety_events`) |
| **Storage Column** | `safety_event_id` (bigint FK, nullable) |
| **Standard Code** | MedDRA (future) |
| **CDISC Domain** | AE (Adverse Events) |
| **CDISC Variable** | AETERM |
| **Required** | **Yes (if hasSafetyEvent = true)** |
| **Default** | null |
| **Ref Table Schema** | `safety_event_id`, `event_name`, `meddra_code`, `is_active` |
| **Conditional** | Only shows if `hasSafetyEvent === true` |

**Code:**
```typescript
// State
const [safetyEvents, setSafetyEvents] = useState<any[]>([]);

// Fetch
const { data } = await supabase
  .from('ref_safety_events')
  .select('*')
  .eq('is_active', true)
  .order('event_name');
setSafetyEvents(data || []);

// FormData
safety_event_id: null,  // bigint (REQUIRED if hasSafetyEvent)

// JSX (conditional)
{formData.hasSafetyEvent && (
  <select
    value={formData.safety_event_id || ''}
    onChange={e => setFormData({...formData, safety_event_id: parseInt(e.target.value)})}
    className={standardInputClass}
  >
    <option value="" disabled>Select Safety Event...</option>
    {safetyEvents.map(e => (
      <option key={e.safety_event_id} value={e.safety_event_id}>
        {e.event_name}
      </option>
    ))}
  </select>
)}
```

---

## 5️⃣ **CONSENT & COMPLIANCE SECTION** (1 field)

### **Field 5.1: Consent Verified**

| Property | Value |
|----------|-------|
| **Display Name** | Consent Verified |
| **Input Type** | Checkbox |
| **Data Source** | User input |
| **Storage Column** | `consent_verified` (boolean) |
| **Standard Code** | N/A |
| **CDISC Domain** | DM (Demographics) |
| **CDISC Variable** | DTHDOM (indirectly) |
| **Required** | **Yes (blocks submission)** |
| **Default** | false |

**Code:**
```typescript
// FormData
consentVerified: false,  // boolean (REQUIRED)

// JSX
<label className="flex items-center gap-3 cursor-pointer p-4 border-2 border-clinical-green/30 rounded-xl">
  <input
    type="checkbox"
    checked={formData.consentVerified}
    onChange={e => setFormData({...formData, consentVerified: e.target.checked})}
    className="size-5"
  />
  <span className="text-sm font-bold text-clinical-green">
    I verify that informed consent has been obtained
  </span>
</label>
```

---

## ✅ **VALIDATION SUMMARY**

### **Required Fields (13 total):**
1. Subject ID (auto-generated)
2. Age
3. Sex
4. Race
5. Weight Range
6. Smoking Status
7. **Primary Indication** 🆕
8. Substance
9. Dosage
10. Route
11. **Session Number** 🆕
12. **Session Date** 🆕
13. Consent Verified

### **Conditional Required (2 total):**
14. Severity Grade (if hasSafetyEvent)
15. Safety Event (if hasSafetyEvent)

---

## 📊 **DATA FLOW DIAGRAM**

```
USER INTERACTION
    ↓
DROPDOWN (displays labels from ref table)
    ↓
FORMDATA (stores ID only)
    ↓
SUBMIT HANDLER (sends ID to Supabase)
    ↓
LOG_CLINICAL_RECORDS (stores ID as FK)
    ↓
ANALYTICS QUERY (JOINs ref table to get label)
    ↓
DISPLAY (shows label to user)
```

---

**STATUS:** ✅ COMPLETE FIELD MAPPING READY FOR BUILDER

**Next Document:** Visual mockup + UI specifications →
