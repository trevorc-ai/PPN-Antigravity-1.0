# DESIGNER TASK: ProtocolBuilder Modal Enhancement
**Date:** 2026-02-09  
**Priority:** HIGH  
**Estimated Time:** 2-3 hours  
**Status:** READY TO START

---

## 🎯 MISSION BRIEFING

**Objective:** Enhance the ProtocolBuilder modal to use database-driven dropdowns instead of hardcoded arrays, and add 4 new fields for complete analytics capability.

**Why This Matters:** This is the "killer app" of the site. Getting this right enables substance-specific analytics, indication tracking, session progression, and cross-site benchmarking.

**Critical Constraint:** This is a **BACKEND WIRING ONLY** task. **DO NOT CHANGE ANY VISUALS.** No fonts, no colors, no spacing, no layout changes.

---

## 📋 WHAT YOU'RE CHANGING

### Part 1: Convert 7 Hardcoded Dropdowns → Database-Driven

| Current Hardcoded Array | Target Supabase Table | Store As (Column Type) |
|------------------------|----------------------|----------------------|
| `SUBSTANCE_OPTIONS` | `ref_substances` | `substance_id` (bigint) |
| `ROUTE_OPTIONS` | `ref_routes` | `route_id` (bigint) |
| `MODALITY_OPTIONS` | `ref_support_modality` | `support_modality_ids` (bigint[]) |
| `SMOKING_OPTIONS` | `ref_smoking_status` | `smoking_status_id` (bigint) |
| `SEVERITY_OPTIONS` | `ref_severity_grade` | `severity_grade_id` (bigint) |
| `SAFETY_EVENT_OPTIONS` | `ref_safety_events` | `safety_event_id` (bigint) |
| `RESOLUTION_OPTIONS` | `ref_resolution_status` | `resolution_status_id` (bigint) |

### Part 2: Add 4 New Fields

1. **Primary Indication** (dropdown from `ref_indications`)
2. **Session Number** (dropdown, hardcoded 1-6+)
3. **Session Date** (date picker)
4. **Protocol Template** (dropdown, hardcoded, optional)

---

## 🔧 IMPLEMENTATION GUIDE

### Pattern: Converting Hardcoded Dropdown to Database-Driven

**BEFORE (Hardcoded):**
```typescript
const SUBSTANCE_OPTIONS = [
  "Psilocybin",
  "MDMA",
  "Ketamine",
  // ...
];

const [formData, setFormData] = useState({
  substance: SUBSTANCE_OPTIONS[0],  // Stores "Psilocybin"
  // ...
});

<select 
  value={formData.substance}
  onChange={e => setFormData({...formData, substance: e.target.value})}
>
  {SUBSTANCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
</select>
```

**AFTER (Database-Driven):**
```typescript
// 1. Add state for fetched data
const [substances, setSubstances] = useState<any[]>([]);

// 2. Fetch on component mount
useEffect(() => {
  const fetchSubstances = async () => {
    const { data, error } = await supabase
      .from('ref_substances')
      .select('substance_id, substance_name')
      .eq('is_active', true)
      .order('substance_name');
    
    if (error) {
      console.error('Error fetching substances:', error);
      return;
    }
    setSubstances(data || []);
  };
  
  if (isOpen) {  // Only fetch when modal opens
    fetchSubstances();
  }
}, [isOpen]);

// 3. Update formData to store ID
const [formData, setFormData] = useState({
  substance_id: null,  // Stores bigint ID, not string name
  // ...
});

// 4. Update dropdown to use fetched data
<select 
  value={formData.substance_id || ''}
  onChange={e => setFormData({...formData, substance_id: parseInt(e.target.value)})}
  className={standardInputClass}  // Keep existing styling!
>
  <option value="">Select Substance...</option>
  {substances.map(s => (
    <option key={s.substance_id} value={s.substance_id}>
      {s.substance_name}
    </option>
  ))}
</select>
```

---

## 📍 FIELD-BY-FIELD INSTRUCTIONS

### 1. Substance Compound (Convert Existing)

**Location:** Protocol Parameters section, line ~1163  
**Current:** Hardcoded `SUBSTANCE_OPTIONS` array  
**Change To:** Fetch from `ref_substances`

**Steps:**
1. Add state: `const [substances, setSubstances] = useState<any[]>([]);`
2. Add fetch in useEffect (when `isOpen` changes)
3. Change `formData.substance` → `formData.substance_id`
4. Update dropdown to map over `substances` array
5. Store `substance_id` (bigint), not substance name

**Query:**
```typescript
const { data } = await supabase
  .from('ref_substances')
  .select('substance_id, substance_name')
  .eq('is_active', true)
  .order('substance_name');
```

---

### 2. Administration Route (Convert Existing)

**Location:** Protocol Parameters section, line ~1173  
**Current:** Hardcoded `ROUTE_OPTIONS` array  
**Change To:** Fetch from `ref_routes`

**Steps:**
1. Add state: `const [routes, setRoutes] = useState<any[]>([]);`
2. Add fetch in useEffect
3. Change `formData.route` → `formData.route_id`
4. Update dropdown to map over `routes` array

**Query:**
```typescript
const { data } = await supabase
  .from('ref_routes')
  .select('route_id, route_name')
  .eq('is_active', true)
  .order('route_name');
```

---

### 3. Support Modality (Convert Existing - MULTI-SELECT)

**Location:** Therapeutic Context section, line ~1034  
**Current:** Hardcoded `MODALITY_OPTIONS` array, checkbox group  
**Change To:** Fetch from `ref_support_modality`

**SPECIAL CASE:** This is a multi-select (checkboxes), so store as array of IDs.

**Steps:**
1. Add state: `const [modalities, setModalities] = useState<any[]>([]);`
2. Add fetch in useEffect
3. Change `formData.modalities` (object) → `formData.support_modality_ids` (bigint[])
4. Update checkbox handler to add/remove IDs from array

**Query:**
```typescript
const { data } = await supabase
  .from('ref_support_modality')
  .select('modality_id, modality_name')
  .eq('is_active', true)
  .order('modality_name');
```

**Updated Handler:**
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

**Updated Checkboxes:**
```typescript
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

### 4. Smoking Status (Convert Existing)

**Location:** Patient Demographics section, line ~922  
**Current:** Hardcoded `SMOKING_OPTIONS` array  
**Change To:** Fetch from `ref_smoking_status`

**Steps:**
1. Add state: `const [smokingStatuses, setSmokingStatuses] = useState<any[]>([]);`
2. Add fetch in useEffect
3. Change `formData.smokingStatus` → `formData.smoking_status_id`
4. Update dropdown

**Query:**
```typescript
const { data } = await supabase
  .from('ref_smoking_status')
  .select('smoking_status_id, status_name')
  .eq('is_active', true)
  .order('status_name');
```

---

### 5. Severity Grade (Convert Existing)

**Location:** Clinical Outcomes & Safety section, line ~1342  
**Current:** Hardcoded `SEVERITY_OPTIONS` array  
**Change To:** Fetch from `ref_severity_grade`

**Steps:**
1. Add state: `const [severityGrades, setSeverityGrades] = useState<any[]>([]);`
2. Add fetch in useEffect
3. Change `formData.severity` → `formData.severity_grade_id`
4. Update dropdown

**Query:**
```typescript
const { data } = await supabase
  .from('ref_severity_grade')
  .select('severity_grade_id, grade_label')
  .eq('is_active', true)
  .order('grade_value');  // Order by numeric value, not label
```

---

### 6. Safety Event (Convert Existing)

**Location:** Clinical Outcomes & Safety section, line ~1352  
**Current:** Hardcoded `SAFETY_EVENT_OPTIONS` array  
**Change To:** Fetch from `ref_safety_events`

**Steps:**
1. Add state: `const [safetyEvents, setSafetyEvents] = useState<any[]>([]);`
2. Add fetch in useEffect
3. Change `formData.safetyEventDescription` → `formData.safety_event_id`
4. Update dropdown

**Query:**
```typescript
const { data } = await supabase
  .from('ref_safety_events')
  .select('safety_event_id, event_name')
  .eq('is_active', true)
  .order('event_name');
```

---

### 7. Resolution Status (Convert Existing)

**Location:** Clinical Outcomes & Safety section, line ~1312  
**Current:** Hardcoded `RESOLUTION_OPTIONS` array  
**Change To:** Fetch from `ref_resolution_status`

**Steps:**
1. Add state: `const [resolutionStatuses, setResolutionStatuses] = useState<any[]>([]);`
2. Add fetch in useEffect
3. Change `formData.resolutionStatus` → `formData.resolution_status_id`
4. Update dropdown

**Query:**
```typescript
const { data } = await supabase
  .from('ref_resolution_status')
  .select('resolution_status_id, status_name')
  .eq('is_active', true)
  .order('status_name');
```

---

## 🆕 NEW FIELDS TO ADD

### 8. Primary Indication (NEW)

**Location:** Patient Demographics section (after Smoking Status, before Race/Ethnicity)  
**Type:** Dropdown (single select)  
**Required:** Yes  
**Default:** None (force selection)

**Add to formData:**
```typescript
indication_id: null,  // bigint
```

**Add state:**
```typescript
const [indications, setIndications] = useState<any[]>([]);
```

**Fetch:**
```typescript
const { data } = await supabase
  .from('ref_indications')
  .select('indication_id, indication_name')
  .eq('is_active', true)
  .order('indication_name');
```

**JSX (insert after Smoking Status field):**
```typescript
<div className="space-y-2">
  <label className={fieldLabelClass}>Primary Indication</label>
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

**Add tooltip:**
```typescript
<SimpleTooltip text="What condition is being treated in this protocol?">
  <HelpCircle size={12} className="text-slate-600 hover:text-primary cursor-help transition-colors" />
</SimpleTooltip>
```

---

### 9. Session Number (NEW)

**Location:** Protocol Parameters section (after Frequency field)  
**Type:** Dropdown (single select)  
**Required:** Yes  
**Default:** 1

**Add to formData:**
```typescript
session_number: 1,  // integer
```

**Hardcoded options (no database fetch needed):**
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
```typescript
<div className="space-y-2">
  <label className={fieldLabelClass}>Session Number</label>
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

**Add tooltip:**
```typescript
<SimpleTooltip text="Track which session this is in the patient's treatment journey.">
  <HelpCircle size={12} className="text-slate-600 hover:text-primary cursor-help transition-colors" />
</SimpleTooltip>
```

---

### 10. Session Date (NEW)

**Location:** Clinical Outcomes & Safety section (at the TOP, before Psychological Difficulty)  
**Type:** Date picker  
**Required:** Yes  
**Default:** Today's date

**Add to formData:**
```typescript
session_date: new Date().toISOString().split('T')[0],  // YYYY-MM-DD
```

**JSX (insert at top of Clinical Outcomes section):**
```typescript
<div className="space-y-2 pb-4 border-b border-slate-800/50">
  <div className="flex items-center gap-2">
    <label className={fieldLabelClass}>Session Date</label>
    <SimpleTooltip text="When did this session occur? Used for timeline analytics.">
      <HelpCircle size={12} className="text-slate-600 hover:text-primary cursor-help transition-colors" />
    </SimpleTooltip>
  </div>
  <input
    type="date"
    value={formData.session_date}
    onChange={e => setFormData({...formData, session_date: e.target.value})}
    className={standardInputClass}
  />
  <p className="text-[9px] text-slate-500 font-medium">
    Date is stored as days-from-baseline for privacy.
  </p>
</div>
```

---

### 11. Protocol Template (NEW - Optional)

**Location:** Protocol Parameters section (at the TOP, before Substance Compound)  
**Type:** Dropdown (single select)  
**Required:** No  
**Default:** null

**Add to formData:**
```typescript
protocol_template_id: null,  // uuid, nullable
```

**Hardcoded options (no database fetch for MVP):**
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

**JSX (insert at top of Protocol Parameters section):**
```typescript
<div className="space-y-2">
  <div className="flex items-center gap-2">
    <label className={fieldLabelClass}>Protocol Template (Optional)</label>
    <SimpleTooltip text="Link this session to a reusable protocol template, or create a new one.">
      <HelpCircle size={12} className="text-slate-600 hover:text-primary cursor-help transition-colors" />
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

---

## ✅ VALIDATION UPDATES

Update the `isFormValid` check to require new fields:

**BEFORE:**
```typescript
const isFormValid = useMemo(() => {
  return (
    formData.substance !== '' &&
    formData.route !== '' &&
    formData.dosage.trim() !== '' &&
    formData.consentVerified === true
    // ...
  );
}, [formData]);
```

**AFTER:**
```typescript
const isFormValid = useMemo(() => {
  return (
    formData.substance_id !== null &&           // Changed from substance !== ''
    formData.route_id !== null &&               // Changed from route !== ''
    formData.indication_id !== null &&          // NEW - required
    formData.session_number !== null &&         // NEW - required
    formData.session_date !== '' &&             // NEW - required
    formData.dosage.trim() !== '' &&
    formData.consentVerified === true
    // ... other validations
  );
}, [formData]);
```

---

## 🚫 CRITICAL CONSTRAINTS (DO NOT VIOLATE)

### ❌ DO NOT CHANGE:
1. **Any visual styling** (fonts, colors, sizes, spacing, borders, shadows)
2. **Any tooltips** (except adding new ones for new fields)
3. **Any accordion behavior** (SectionAccordion component)
4. **Any existing field labels** (keep exact wording)
5. **Any existing layout** (grid structure, column counts)
6. **Tab order** (unless explicitly fixing a bug)
7. **Button text or styling**
8. **Modal header or footer**

### ✅ DO CHANGE:
1. **Dropdown data sources** (hardcoded → database)
2. **formData field names** (substance → substance_id)
3. **formData types** (string → bigint)
4. **Add 4 new fields** (as specified above)
5. **Update validation logic**
6. **Add database fetch logic**

---

## 📦 COMPLETE FORMDATA STATE (After All Changes)

```typescript
const [formData, setFormData] = useState({
  // Identity
  subjectId: '',
  patientInput: '',
  patientHash: '',
  
  // Demographics
  subjectAge: '35',
  sex: '',
  race: '',
  weightRange: WEIGHT_RANGES[6],
  smoking_status_id: null,           // CHANGED from smokingStatus
  indication_id: null,               // NEW
  
  // Protocol Parameters
  protocol_template_id: null,        // NEW
  substance_id: null,                // CHANGED from substance
  dosage: '25',
  dosageUnit: 'mg',
  route_id: null,                    // CHANGED from route
  frequency: FREQUENCY_OPTIONS[0],
  session_number: 1,                 // NEW
  
  // Therapeutic Context
  setting: SETTING_OPTIONS[0],
  prepHours: '2',
  integrationHours: '4',
  support_modality_ids: [],          // CHANGED from modalities (object → array)
  concomitantMeds: '',
  
  // Clinical Outcomes & Safety
  session_date: new Date().toISOString().split('T')[0],  // NEW
  difficultyScore: 5,
  phq9Score: 18,
  resolution_status_id: null,        // CHANGED from resolutionStatus
  hasSafetyEvent: false,
  severity_grade_id: null,           // CHANGED from severity
  safety_event_id: null,             // CHANGED from safetyEventDescription
  
  // Consent
  consentVerified: false
});
```

---

## 🧪 TESTING CHECKLIST

After making changes, test:

- [ ] Modal opens without errors
- [ ] All dropdowns populate with data from Supabase
- [ ] New fields appear in correct sections
- [ ] Validation prevents submission without required fields
- [ ] Form submission stores IDs (not labels)
- [ ] No visual changes (compare before/after screenshots)
- [ ] No console errors
- [ ] Tooltips display correctly
- [ ] Multi-select modalities work (can check/uncheck)
- [ ] Date picker works
- [ ] Optional protocol template field works

---

## 📊 WHAT THIS UNLOCKS

Once complete, these changes enable:

1. **Substance-specific analytics** - Filter all charts by substance
2. **Route-based comparisons** - Oral vs IV vs IM effectiveness
3. **Modality effectiveness tracking** - Which therapy types work best
4. **Indication-specific outcomes** - Depression vs PTSD vs Anxiety
5. **Session progression analysis** - Patient journey timelines
6. **Safety surveillance** - Adverse event rates by substance/route/dose
7. **Cross-site benchmarking** - Your site vs network median

---

## 🆘 NEED HELP?

**Reference Documents:**
- `PROTOCOLBUILDER_DATA_MAPPING.md` - Complete field mapping analysis
- `SUPABASE_SETUP_AND_DESIGNER_INSTRUCTIONS.md` - Full context
- `migrations/003_protocolbuilder_reference_tables.sql` - Database schema

**Common Issues:**
- **"Cannot read property of undefined"** → Check if state array is initialized before mapping
- **"Invalid value for select"** → Make sure value is `|| ''` for nullable fields
- **"Dropdown is empty"** → Check Supabase query, verify RLS policies allow read access
- **"Form won't submit"** → Check validation logic, ensure all required IDs are set

---

**STATUS:** READY TO START  
**PRIORITY:** HIGH  
**ESTIMATED TIME:** 2-3 hours  
**COMPLEXITY:** MEDIUM

**Good luck! This is the most important enhancement for the entire platform.** 🚀
