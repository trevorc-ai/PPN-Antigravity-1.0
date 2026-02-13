# 🎨 DESIGNER TASKS - Protocol Builder Phase 1
## Clinical Intelligence Platform - Frontend Development

**Version:** 1.0  
**Date:** February 11, 2026  
**Assignee:** Designer + Frontend Builder  
**Timeline:** 3 months to MVP  

---

## 📋 TASK OVERVIEW

**Total Tasks:** 24  
**Critical Path Tasks:** 6  
**Can Start Immediately:** 8  
**Requires Backend:** 10  

---

## 🎨 WORKSTREAM 4: TAB 1 - PATIENT & PROTOCOL (Data Entry)
**Status:** ⏳ Awaiting Backend (can start UI)  
**Duration:** 2 weeks  
**Priority:** 🔴 CRITICAL  

---

### **TASK 4.1: Patient Demographics Section**
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 6 hours  
**Dependencies:** None (can start immediately)  

**Objective:** Create fast, mobile-optimized demographics entry

**File:** `src/components/ProtocolBuilder/PatientDemographics.tsx`

```typescript
import React from 'react';
import { Copy } from 'lucide-react';

interface PatientDemographicsProps {
  formData: {
    subjectId: string;
    ageRangeId: number | null;
    biologicalSexId: number | null;
    weightRangeId: number | null;
  };
  onChange: (field: string, value: any) => void;
  onCopySubjectId: () => void;
}

const AGE_RANGES = [
  { id: 1, label: '18-25' },
  { id: 2, label: '26-35' },
  { id: 3, label: '36-45' },
  { id: 4, label: '46-55' },
  { id: 5, label: '56-65' },
  { id: 6, label: '66+' }
];

const BIOLOGICAL_SEX = [
  { id: 1, label: '♂ Male' },
  { id: 2, label: '♀ Female' },
  { id: 3, label: '⚥ Intersex' },
  { id: 4, label: 'Unknown' }
];

const WEIGHT_RANGES = [
  { id: 1, label: '40-50' },
  { id: 2, label: '51-60' },
  { id: 3, label: '61-70' },
  { id: 4, label: '71-80' },
  { id: 5, label: '81-90' },
  { id: 6, label: '91-100' },
  { id: 7, label: '101+' }
];

export function PatientDemographics({ formData, onChange, onCopySubjectId }: PatientDemographicsProps) {
  return (
    <div className="space-y-6">
      {/* Subject ID */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          PATIENT ID
        </label>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-800 px-4 py-3 rounded-lg border border-slate-700">
            <span className="text-lg font-mono text-slate-100">{formData.subjectId}</span>
          </div>
          <button
            onClick={onCopySubjectId}
            className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            aria-label="Copy Subject ID"
          >
            <Copy className="w-5 h-5 text-slate-300" />
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-1">Anonymous ID</p>
      </div>

      {/* Age Range */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          AGE
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {AGE_RANGES.map((range) => (
            <button
              key={range.id}
              onClick={() => onChange('ageRangeId', range.id)}
              className={`
                px-4 py-3 rounded-lg font-medium text-sm transition-all
                ${formData.ageRangeId === range.id
                  ? 'bg-indigo-500 text-white ring-2 ring-indigo-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }
              `}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Biological Sex */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          BIOLOGICAL SEX
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {BIOLOGICAL_SEX.map((sex) => (
            <button
              key={sex.id}
              onClick={() => onChange('biologicalSexId', sex.id)}
              className={`
                px-4 py-3 rounded-lg font-medium text-sm transition-all
                ${formData.biologicalSexId === sex.id
                  ? 'bg-indigo-500 text-white ring-2 ring-indigo-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }
              `}
            >
              {sex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Weight Range */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          WEIGHT RANGE (kg)
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {WEIGHT_RANGES.map((range) => (
            <button
              key={range.id}
              onClick={() => onChange('weightRangeId', range.id)}
              className={`
                px-4 py-3 rounded-lg font-medium text-sm transition-all
                ${formData.weightRangeId === range.id
                  ? 'bg-indigo-500 text-white ring-2 ring-indigo-400'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }
              `}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Optional Fields (Collapsed) */}
      <details className="group">
        <summary className="cursor-pointer text-sm text-slate-400 hover:text-slate-300 flex items-center gap-2">
          <span className="group-open:rotate-90 transition-transform">▶</span>
          Optional Details (Race, Prior Experience, Herbs)
        </summary>
        <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <p className="text-sm text-slate-400">Optional fields will be added in Phase 2</p>
        </div>
      </details>
    </div>
  );
}
```

**Acceptance Criteria:**
- ✅ All button groups render correctly
- ✅ Selected state shows with indigo highlight
- ✅ Copy button works (copies to clipboard)
- ✅ Responsive (works on mobile/tablet)
- ✅ Touch-friendly (48px minimum tap targets)
- ✅ Keyboard accessible (tab navigation)

---

### **TASK 4.2: Medications Multi-Select Grid**
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 8 hours  
**Dependencies:** Task 2.3 (medications data)  

**Objective:** Fast multi-select medication entry with real-time interaction alerts

**File:** `src/components/ProtocolBuilder/MedicationsGrid.tsx`

```typescript
import React, { useMemo } from 'react';
import { Search, AlertTriangle } from 'lucide-react';

interface Medication {
  id: number;
  name: string;
  category: string;
}

interface Interaction {
  medicationId: number;
  message: string;
  severity: 'high' | 'medium' | 'low';
}

interface MedicationsGridProps {
  medications: Medication[];
  selectedMedicationIds: number[];
  interactions: Interaction[];
  onToggleMedication: (id: number) => void;
}

export function MedicationsGrid({ 
  medications, 
  selectedMedicationIds, 
  interactions,
  onToggleMedication 
}: MedicationsGridProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Group medications by category
  const medicationsByCategory = useMemo(() => {
    const filtered = medications.filter(med => 
      med.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return filtered.reduce((acc, med) => {
      if (!acc[med.category]) acc[med.category] = [];
      acc[med.category].push(med);
      return acc;
    }, {} as Record<string, Medication[]>);
  }, [medications, searchQuery]);
  
  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search 10,000+ medications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      
      {/* Medication Grid by Category */}
      <div className="space-y-6">
        {Object.entries(medicationsByCategory).map(([category, meds]) => (
          <div key={category}>
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
              {category}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {meds.map((med) => {
                const isSelected = selectedMedicationIds.includes(med.id);
                const hasInteraction = interactions.some(i => i.medicationId === med.id);
                
                return (
                  <button
                    key={med.id}
                    onClick={() => onToggleMedication(med.id)}
                    className={`
                      relative px-3 py-2 rounded-lg text-sm font-medium transition-all
                      ${isSelected
                        ? 'bg-indigo-500 text-white ring-2 ring-indigo-400'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }
                      ${hasInteraction ? 'ring-2 ring-amber-500' : ''}
                    `}
                  >
                    {med.name}
                    {isSelected && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full" />
                    )}
                    {hasInteraction && (
                      <AlertTriangle className="absolute -top-1 -right-1 w-4 h-4 text-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Herbal Supplements */}
      <div>
        <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
          HERBAL SUPPLEMENTS
        </h3>
        <div className="flex flex-wrap gap-3">
          {['St. John\'s Wort', '5-HTP', 'Kava', 'None'].map((herb) => (
            <label key={herb} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-300">{herb}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Interaction Alerts (Non-Blocking) */}
      {interactions.length > 0 && (
        <div className="bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-400 mb-2">
                ⚠️ {interactions.length} interaction{interactions.length > 1 ? 's' : ''} detected
              </p>
              {interactions.map((interaction, index) => (
                <div key={index} className="text-sm text-amber-400 mb-1">
                  • {interaction.message}
                  <button className="ml-2 underline hover:no-underline">
                    [Info]
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

**Acceptance Criteria:**
- ✅ Medications grouped by category
- ✅ Multi-select works (tap to toggle)
- ✅ Search filters medications
- ✅ Selected state shows checkmark
- ✅ Interaction alerts appear (non-blocking)
- ✅ Responsive grid layout
- ✅ Touch-friendly

---

### **TASK 4.3: Protocol Details Section**
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 6 hours  
**Dependencies:** None (can start immediately)  

**Objective:** Protocol entry with quick-pick buttons and real-time validation

**File:** `src/components/ProtocolBuilder/ProtocolDetails.tsx`

```typescript
import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface ProtocolDetailsProps {
  formData: {
    indicationId: number | null;
    substanceId: number | null;
    dosage: number | null;
    routeId: number | null;
  };
  onChange: (field: string, value: any) => void;
  dosageValidation?: {
    isValid: boolean;
    message: string;
    color: 'emerald' | 'amber' | 'red';
  };
}

const QUICK_INDICATIONS = [
  { id: 1, label: 'Depression' },
  { id: 2, label: 'PTSD' },
  { id: 3, label: 'Anxiety' }
];

const QUICK_SUBSTANCES = [
  { id: 1, label: 'Psilocybin' },
  { id: 2, label: 'Ketamine' },
  { id: 3, label: 'MDMA' }
];

const QUICK_ROUTES = [
  { id: 1, label: 'Oral' },
  { id: 2, label: 'IV' },
  { id: 3, label: 'IM' }
];

export function ProtocolDetails({ formData, onChange, dosageValidation }: ProtocolDetailsProps) {
  const adjustDosage = (delta: number) => {
    const current = formData.dosage || 0;
    const newValue = Math.max(0, current + delta);
    onChange('dosage', newValue);
  };
  
  return (
    <div className="space-y-6">
      {/* Primary Indication */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          PRIMARY INDICATION
        </label>
        <select
          value={formData.indicationId || ''}
          onChange={(e) => onChange('indicationId', parseInt(e.target.value))}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select indication...</option>
          <option value="1">Depression - Treatment Resistant</option>
          <option value="2">PTSD</option>
          <option value="3">Anxiety Disorder</option>
          {/* More options... */}
        </select>
        
        {/* Quick Picks */}
        <div className="flex gap-2 mt-2">
          <span className="text-xs text-slate-500">Quick:</span>
          {QUICK_INDICATIONS.map((ind) => (
            <button
              key={ind.id}
              onClick={() => onChange('indicationId', ind.id)}
              className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded"
            >
              {ind.label}
            </button>
          ))}
        </div>
      </div>

      {/* Substance */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          SUBSTANCE
        </label>
        <select
          value={formData.substanceId || ''}
          onChange={(e) => onChange('substanceId', parseInt(e.target.value))}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select substance...</option>
          <option value="1">Psilocybin</option>
          <option value="2">LSD</option>
          <option value="3">MDMA</option>
          {/* More options... */}
        </select>
        
        {/* Quick Picks */}
        <div className="flex gap-2 mt-2">
          <span className="text-xs text-slate-500">Quick:</span>
          {QUICK_SUBSTANCES.map((sub) => (
            <button
              key={sub.id}
              onClick={() => onChange('substanceId', sub.id)}
              className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded"
            >
              {sub.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dosage (Prominent) */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          DOSAGE
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => adjustDosage(-5)}
            className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            aria-label="Decrease dosage"
          >
            <Minus className="w-5 h-5 text-slate-300" />
          </button>
          
          <div className="flex-1">
            <input
              type="number"
              value={formData.dosage || ''}
              onChange={(e) => onChange('dosage', parseFloat(e.target.value))}
              className="w-full px-6 py-4 bg-slate-800 border-2 border-indigo-500 rounded-lg text-4xl font-bold text-center text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="0"
            />
          </div>
          
          <button
            onClick={() => adjustDosage(5)}
            className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            aria-label="Increase dosage"
          >
            <Plus className="w-5 h-5 text-slate-300" />
          </button>
          
          <span className="text-2xl font-medium text-slate-400">mg</span>
        </div>
        
        {/* Validation Message */}
        {dosageValidation && (
          <div className={`mt-2 text-sm text-${dosageValidation.color}-400`}>
            {dosageValidation.message}
          </div>
        )}
      </div>

      {/* Route */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">
          ROUTE
        </label>
        <select
          value={formData.routeId || ''}
          onChange={(e) => onChange('routeId', parseInt(e.target.value))}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select route...</option>
          <option value="1">Oral</option>
          <option value="2">IV</option>
          <option value="3">IM</option>
          {/* More options... */}
        </select>
        
        {/* Quick Picks */}
        <div className="flex gap-2 mt-2">
          <span className="text-xs text-slate-500">Quick:</span>
          {QUICK_ROUTES.map((route) => (
            <button
              key={route.id}
              onClick={() => onChange('routeId', route.id)}
              className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded"
            >
              {route.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Acceptance Criteria:**
- ✅ Dropdowns work correctly
- ✅ Quick-pick buttons populate fields
- ✅ Dosage stepper buttons work (+/- 5mg)
- ✅ Large dosage input (easy to tap)
- ✅ Real-time validation shows
- ✅ Responsive layout

---

### **TASK 4.4: Session Experience Sliders**
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 4 hours  
**Dependencies:** None (can start immediately)  

**Objective:** Touch-optimized sliders for intensity and therapeutic value

**File:** `src/components/ProtocolBuilder/SessionExperience.tsx`

```typescript
import React from 'react';
import { Zap, Heart } from 'lucide-react';

interface SessionExperienceProps {
  intensity: number;
  therapeuticValue: number;
  onChangeIntensity: (value: number) => void;
  onChangeTherapeutic: (value: number) => void;
}

export function SessionExperience({ 
  intensity, 
  therapeuticValue, 
  onChangeIntensity, 
  onChangeTherapeutic 
}: SessionExperienceProps) {
  return (
    <div className="space-y-8">
      {/* Intensity Slider */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400" />
            <label className="text-sm font-medium text-slate-400">
              INTENSITY
            </label>
          </div>
          <span className="text-2xl font-bold text-slate-100">{intensity}</span>
        </div>
        
        <input
          type="range"
          min="1"
          max="10"
          value={intensity}
          onChange={(e) => onChangeIntensity(parseInt(e.target.value))}
          className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-thumb"
          style={{
            background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${(intensity - 1) * 11.11}%, #334155 ${(intensity - 1) * 11.11}%, #334155 100%)`
          }}
        />
        
        <div className="flex justify-between mt-1">
          <span className="text-xs text-slate-500">1</span>
          <span className="text-xs text-slate-500">10</span>
        </div>
      </div>

      {/* Therapeutic Value Slider */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-emerald-400" />
            <label className="text-sm font-medium text-slate-400">
              THERAPEUTIC VALUE
            </label>
          </div>
          <span className="text-2xl font-bold text-slate-100">{therapeuticValue}</span>
        </div>
        
        <input
          type="range"
          min="1"
          max="10"
          value={therapeuticValue}
          onChange={(e) => onChangeTherapeutic(parseInt(e.target.value))}
          className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-thumb"
          style={{
            background: `linear-gradient(to right, #10b981 0%, #10b981 ${(therapeuticValue - 1) * 11.11}%, #334155 ${(therapeuticValue - 1) * 11.11}%, #334155 100%)`
          }}
        />
        
        <div className="flex justify-between mt-1">
          <span className="text-xs text-slate-500">1</span>
          <span className="text-xs text-slate-500">10</span>
        </div>
      </div>
    </div>
  );
}
```

**CSS for Slider Thumb:**
```css
/* Add to global CSS */
.slider-thumb::-webkit-slider-thumb {
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #f1f5f9;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.slider-thumb::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #f1f5f9;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
```

**Acceptance Criteria:**
- ✅ Sliders work smoothly
- ✅ Value displays in real-time
- ✅ Touch-friendly (large thumb)
- ✅ Visual feedback (gradient fill)
- ✅ Icons add visual clarity
- ✅ Accessible (keyboard navigation)

---

### **TASK 4.5: Submit Button & Auto-Save**
**Priority:** 🟡 MEDIUM  
**Estimated Time:** 3 hours  
**Dependencies:** Backend API ready  

**Objective:** Sticky submit button with auto-save indication

**File:** `src/components/ProtocolBuilder/SubmitBar.tsx`

```typescript
import React from 'react';
import { Loader2, CheckCircle } from 'lucide-react';

interface SubmitBarProps {
  onSubmit: () => void;
  isSubmitting: boolean;
  isValid: boolean;
  sessionNumber: number;
}

export function SubmitBar({ onSubmit, isSubmitting, isValid, sessionNumber }: SubmitBarProps) {
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Consent verified</span>
          </div>
          <span className="text-xs text-slate-500">Auto-save to Files</span>
        </div>
        
        <button
          onClick={onSubmit}
          disabled={!isValid || isSubmitting}
          className={`
            w-full py-4 rounded-lg font-semibold text-lg transition-all
            ${isValid && !isSubmitting
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }
          `}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </span>
          ) : (
            `Submit Session ${sessionNumber}`
          )}
        </button>
      </div>
    </div>
  );
}
```

**Acceptance Criteria:**
- ✅ Button sticks to bottom on scroll
- ✅ Disabled state when form invalid
- ✅ Loading state during submission
- ✅ Success feedback after submit
- ✅ Accessible (focus states)

---

## 📊 WORKSTREAM 6: TAB 2 - CLINICAL INSIGHTS (Analytics)
**Status:** ⏳ Awaiting Backend  
**Duration:** 2 weeks  
**Priority:** 🔴 CRITICAL  

---

### **TASK 6.1: Receptor Affinity Visualization**
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 4 hours  
**Dependencies:** Task 2.1 (receptor data), Task 3.1 (BarChart)  

**Objective:** Display receptor affinity as horizontal bar chart

**File:** `src/components/ClinicalInsights/ReceptorAffinity.tsx`

```typescript
import React from 'react';
import { BarChart } from '../charts/BarChart';

interface ReceptorAffinityProps {
  substanceId: number;
  receptorData: {
    receptor_5ht2a_affinity: number;
    receptor_5ht1a_affinity: number;
    receptor_5ht2c_affinity: number;
    receptor_d2_affinity: number;
  };
}

export function ReceptorAffinity({ substanceId, receptorData }: ReceptorAffinityProps) {
  const chartData = [
    { label: '5-HT2A', value: receptorData.receptor_5ht2a_affinity, color: '#6366f1' },
    { label: '5-HT1A', value: receptorData.receptor_5ht1a_affinity, color: '#8b5cf6' },
    { label: '5-HT2C', value: receptorData.receptor_5ht2c_affinity, color: '#a855f7' },
    { label: 'D2', value: receptorData.receptor_d2_affinity, color: '#64748b' }
  ];
  
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
        RECEPTOR IMPACT
      </h3>
      
      <BarChart 
        data={chartData}
        height={200}
        valueFormatter={(v) => `${v}%`}
      />
      
      <p className="text-xs text-slate-500 mt-4">
        Receptor binding affinity based on scientific literature
      </p>
    </div>
  );
}
```

**Acceptance Criteria:**
- ✅ Chart renders correctly
- ✅ Data fetched from backend
- ✅ Loading state shown
- ✅ Error handling
- ✅ Responsive

---

### **TASK 6.2: Expected Outcomes Display**
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 6 hours  
**Dependencies:** Backend materialized views, Task 3.2 (DonutChart)  

**Objective:** Show expected outcomes based on similar patients

**File:** `src/components/ClinicalInsights/ExpectedOutcomes.tsx`

```typescript
import React from 'react';
import { BarChart } from '../charts/BarChart';
import { DonutChart } from '../charts/DonutChart';
import { AlertCircle } from 'lucide-react';

interface OutcomesData {
  sample_size: number;
  avg_improvement: number;
  std_dev: number;
  excellent_rate: number;
  good_rate: number;
  moderate_rate: number;
}

interface ExpectedOutcomesProps {
  outcomesData: OutcomesData | null;
  clinicAvg: number;
  networkAvg: number;
  isLoading: boolean;
}

export function ExpectedOutcomes({ 
  outcomesData, 
  clinicAvg, 
  networkAvg, 
  isLoading 
}: ExpectedOutcomesProps) {
  if (isLoading) {
    return <div className="animate-pulse bg-slate-800 rounded-lg h-96" />;
  }
  
  if (!outcomesData || outcomesData.sample_size < 5) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-start gap-3 text-amber-400">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <div>
            <p className="font-medium">Limited data available</p>
            <p className="text-sm text-slate-400 mt-1">
              Only {outcomesData?.sample_size || 0} similar protocols in network.
              More data needed for reliable predictions.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  const comparisonData = [
    { 
      label: 'Similar patients', 
      value: outcomesData.avg_improvement, 
      color: '#6366f1' 
    },
    { 
      label: 'Your clinic', 
      value: clinicAvg, 
      color: '#64748b' 
    },
    { 
      label: 'Network avg', 
      value: networkAvg, 
      color: '#10b981' 
    }
  ];
  
  const successRateData = [
    { name: 'Excellent', value: outcomesData.excellent_rate * 100, color: '#10b981' },
    { name: 'Good', value: outcomesData.good_rate * 100, color: '#6366f1' },
    { name: 'Moderate', value: outcomesData.moderate_rate * 100, color: '#f59e0b' },
    { name: 'None', value: (1 - outcomesData.excellent_rate - outcomesData.good_rate - outcomesData.moderate_rate) * 100, color: '#64748b' }
  ];
  
  const successRate = Math.round((outcomesData.excellent_rate + outcomesData.good_rate) * 100);
  
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
          EXPECTED OUTCOMES
        </h3>
        <span className="text-xs text-slate-500">
          Based on {outcomesData.sample_size} similar patients
        </span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PHQ-9 Reduction */}
        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-3">PHQ-9 REDUCTION</h4>
          <BarChart 
            data={comparisonData}
            height={150}
            valueFormatter={(v) => `${v.toFixed(1)} points`}
          />
        </div>
        
        {/* Success Rate */}
        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-3">SUCCESS RATE</h4>
          <DonutChart 
            data={successRateData}
            centerLabel="Success Rate"
            centerValue={`${successRate}%`}
            height={200}
          />
        </div>
      </div>
    </div>
  );
}
```

**Acceptance Criteria:**
- ✅ Data fetched from materialized view
- ✅ Sample size displayed prominently
- ✅ Warning shown if sample size < 5
- ✅ Charts render correctly
- ✅ Loading and error states
- ✅ Responsive layout

---

### **TASK 6.3: Dosage Optimization Gauge**
**Priority:** 🟡 MEDIUM  
**Estimated Time:** 4 hours  
**Dependencies:** Backend data, Task 3.3 (GaugeChart)  

**Objective:** Show optimal dosage range with gauge visualization

**File:** `src/components/ClinicalInsights/DosageOptimization.tsx`

```typescript
import React from 'react';
import { GaugeChart } from '../charts/GaugeChart';
import { Lightbulb } from 'lucide-react';

interface DosageOptimizationProps {
  currentDosage: number;
  optimalMin: number;
  optimalMax: number;
  recommendation?: string;
}

export function DosageOptimization({ 
  currentDosage, 
  optimalMin, 
  optimalMax, 
  recommendation 
}: DosageOptimizationProps) {
  const isOptimal = currentDosage >= optimalMin && currentDosage <= optimalMax;
  
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
        DOSAGE OPTIMIZATION
      </h3>
      
      <GaugeChart 
        value={currentDosage}
        min={optimalMin - 10}
        max={optimalMax + 10}
        optimalMin={optimalMin}
        optimalMax={optimalMax}
        label="Current Dosage"
        unit="mg"
      />
      
      <div className="mt-4 space-y-2">
        {isOptimal ? (
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="text-lg">✓</span>
            <span className="text-sm font-medium">Optimal dosage</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-amber-400">
            <span className="text-lg">⚠</span>
            <span className="text-sm font-medium">Outside optimal range</span>
          </div>
        )}
        
        {recommendation && (
          <div className="flex items-start gap-2 text-indigo-400 bg-indigo-900/20 p-3 rounded">
            <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{recommendation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Acceptance Criteria:**
- ✅ Gauge renders correctly
- ✅ Optimal range highlighted
- ✅ Recommendation shown
- ✅ Visual feedback (optimal vs not)
- ✅ Responsive

---

## 🏆 WORKSTREAM 7: TAB 3 - BENCHMARKING
**Status:** ⏳ Awaiting Backend  
**Duration:** 1 week  
**Priority:** 🟡 MEDIUM  

---

### **TASK 7.1: Comparison View Component**
**Priority:** 🟡 MEDIUM  
**Estimated Time:** 6 hours  
**Dependencies:** Backend benchmarks data  

**Objective:** Display patient vs clinic vs network comparisons

**File:** `src/components/Benchmarking/ComparisonView.tsx`

```typescript
import React from 'react';
import { BarChart } from '../charts/BarChart';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface BenchmarkData {
  patientPredicted: number;
  clinicAvg: number;
  networkAvg: number;
  sampleSize: number;
}

interface ComparisonViewProps {
  benchmarks: BenchmarkData;
  metric: string;
  unit: string;
}

export function ComparisonView({ benchmarks, metric, unit }: ComparisonViewProps) {
  const chartData = [
    { label: 'This patient (predicted)', value: benchmarks.patientPredicted, color: '#6366f1' },
    { label: 'Clinic average', value: benchmarks.clinicAvg, color: '#64748b' },
    { label: 'Network average', value: benchmarks.networkAvg, color: '#10b981' }
  ];
  
  const vsClinic = benchmarks.patientPredicted - benchmarks.clinicAvg;
  const vsNetwork = benchmarks.patientPredicted - benchmarks.networkAvg;
  
  const getTrendIcon = (diff: number) => {
    if (diff > 0.5) return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    if (diff < -0.5) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-slate-500" />;
  };
  
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
          {metric}
        </h3>
        <span className="text-xs text-slate-500">
          Network sample: {benchmarks.sampleSize.toLocaleString()}
        </span>
      </div>
      
      <BarChart 
        data={chartData}
        height={150}
        valueFormatter={(v) => `${v.toFixed(1)} ${unit}`}
      />
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          {getTrendIcon(vsClinic)}
          <div>
            <p className="text-xs text-slate-500">vs Clinic</p>
            <p className="text-sm font-medium text-slate-300">
              {vsClinic > 0 ? '+' : ''}{vsClinic.toFixed(1)} {unit}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {getTrendIcon(vsNetwork)}
          <div>
            <p className="text-xs text-slate-500">vs Network</p>
            <p className="text-sm font-medium text-slate-300">
              {vsNetwork > 0 ? '+' : ''}{vsNetwork.toFixed(1)} {unit}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Acceptance Criteria:**
- ✅ Comparison chart renders
- ✅ Trend indicators show
- ✅ Sample size displayed
- ✅ Responsive layout
- ✅ Loading/error states

---

## 📱 WORKSTREAM 8: MOBILE OPTIMIZATION
**Status:** ✅ Can Start Immediately  
**Duration:** Ongoing  
**Priority:** 🟡 MEDIUM  

---

### **TASK 8.1: Responsive Layout Testing**
**Priority:** 🟡 MEDIUM  
**Estimated Time:** 4 hours  
**Dependencies:** None  

**Objective:** Test and optimize for iPad/tablet/mobile

**Testing Checklist:**
```markdown
## Device Testing

### iPad (768px - 1024px) - PRIMARY
- [ ] All button groups fit on screen
- [ ] Medication grid shows 4-6 columns
- [ ] Charts render correctly
- [ ] Sliders are touch-friendly (24px thumb)
- [ ] Submit button always visible (sticky)
- [ ] No horizontal scrolling

### Android Tablet (768px - 1024px)
- [ ] Same as iPad
- [ ] Test on Chrome Mobile
- [ ] Test on Samsung Internet

### iPhone (375px - 428px) - SECONDARY
- [ ] Button groups stack vertically
- [ ] Medication grid shows 2-3 columns
- [ ] Charts scale down
- [ ] Text remains readable (min 14px)
- [ ] Touch targets min 48px

### Desktop (1024px+) - TERTIARY
- [ ] Layout doesn't get too wide (max 1200px)
- [ ] Charts scale appropriately
- [ ] Keyboard navigation works
```

**Acceptance Criteria:**
- ✅ Works on iPad (primary device)
- ✅ Works on Android tablets
- ✅ Usable on iPhone (degraded but functional)
- ✅ Desktop experience good
- ✅ No layout breaks

---

### **TASK 8.2: Touch Optimization**
**Priority:** 🟡 MEDIUM  
**Estimated Time:** 3 hours  
**Dependencies:** None  

**Objective:** Ensure all interactive elements are touch-friendly

**Touch Target Audit:**
```typescript
// Create utility to check touch targets
export function checkTouchTargets() {
  const interactiveElements = document.querySelectorAll('button, a, input, select');
  
  interactiveElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const minSize = 48; // Apple HIG minimum
    
    if (rect.width < minSize || rect.height < minSize) {
      console.warn('Touch target too small:', el, `${rect.width}x${rect.height}`);
    }
  });
}
```

**Fixes:**
- Increase button padding
- Add larger tap areas for small icons
- Increase slider thumb size
- Add spacing between tappable elements

**Acceptance Criteria:**
- ✅ All buttons ≥ 48px height
- ✅ Slider thumbs ≥ 24px
- ✅ Spacing between tap targets ≥ 8px
- ✅ No accidental taps

---

## 📚 WORKSTREAM 9: DOCUMENTATION
**Status:** ✅ Can Start Immediately  
**Duration:** Ongoing  
**Priority:** 🟡 MEDIUM  

---

### **TASK 9.1: Component Documentation (Storybook)**
**Priority:** 🟡 MEDIUM  
**Estimated Time:** 8 hours  
**Dependencies:** Components built  

**Objective:** Document all components in Storybook

**Example Story:**
```typescript
// BarChart.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { BarChart } from './BarChart';

const meta: Meta<typeof BarChart> = {
  title: 'Charts/BarChart',
  component: BarChart,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BarChart>;

export const Default: Story = {
  args: {
    data: [
      { label: 'Similar patients', value: -8.2, color: '#6366f1' },
      { label: 'Your clinic', value: -7.9, color: '#64748b' },
      { label: 'Network avg', value: -8.5, color: '#10b981' }
    ],
    height: 200,
    valueFormatter: (v) => `${v.toFixed(1)} points`
  }
};

export const SmallSample: Story = {
  args: {
    data: [
      { label: 'Limited data', value: -5.0, color: '#f59e0b' }
    ],
    height: 150
  }
};
```

**Acceptance Criteria:**
- ✅ All components documented
- ✅ Props documented
- ✅ Usage examples provided
- ✅ Edge cases shown
- ✅ Accessible via Storybook UI

---

### **TASK 9.2: User Guide (For Shena Demo)**
**Priority:** 🟡 MEDIUM  
**Estimated Time:** 4 hours  
**Dependencies:** None  

**Objective:** Create practitioner-facing user guide

**File:** `docs/USER_GUIDE.md`

```markdown
# Protocol Builder User Guide

## Quick Start (60 seconds)

### New Patient Entry

1. **Tap "+" button** on patient list
2. **Enter demographics** (3 taps: Age, Sex, Weight)
3. **Select medications** (tap, tap, tap, tap)
4. **Enter protocol** (Substance, Dosage, Route)
5. **Rate session** (Intensity, Therapeutic sliders)
6. **Submit** → Auto-saved to Files

### Follow-Up Session (16 seconds)

1. **Tap patient card**
2. **Adjust dosage** (if needed)
3. **Rate session** (sliders)
4. **Submit** → Done!

## Features

### Real-Time Analytics
- See expected outcomes based on similar patients
- View drug interactions
- Get dosage recommendations

### Benchmarking
- Compare to your clinic average
- Compare to network average
- See percentile rankings

### Export Options
- PDF (for records)
- CSV (for analysis)
- Native share (AirDrop, email, etc.)

## Tips

- Use quick-pick buttons for common choices
- Search medications if not in grid
- Check interaction alerts (non-blocking)
- Review analytics before submitting
```

**Acceptance Criteria:**
- ✅ Clear, concise instructions
- ✅ Screenshots/mockups included
- ✅ Tips for power users
- ✅ FAQ section
- ✅ Ready for Shena demo

---

## ✅ TASK SUMMARY

**Total Tasks:** 24  
**Critical Path:** 6 tasks  
**Can Start Immediately:** 8 tasks  
**Estimated Total Time:** 6-8 weeks  

---

## 📊 TASK BREAKDOWN

| Workstream | Tasks | Can Start Now? | Estimated Time |
|------------|-------|----------------|----------------|
| **4. Tab 1 (Entry)** | 5 | ✅ 4 tasks | 2 weeks |
| **6. Tab 2 (Insights)** | 3 | ⏳ Backend needed | 2 weeks |
| **7. Tab 3 (Benchmarks)** | 1 | ⏳ Backend needed | 1 week |
| **8. Mobile Optimization** | 2 | ✅ Yes | 1 week |
| **9. Documentation** | 2 | ✅ Yes | 1 week |
| **TOTAL** | **13** | **8 can start now** | **7 weeks** |

---

## 🚀 WHAT CAN START RIGHT NOW

**These 8 tasks have ZERO dependencies:**

1. ✅ Patient Demographics Section (6 hours)
2. ✅ Protocol Details Section (6 hours)
3. ✅ Session Experience Sliders (4 hours)
4. ✅ Submit Bar Component (3 hours)
5. ✅ Responsive Layout Testing (4 hours)
6. ✅ Touch Optimization (3 hours)
7. ✅ Component Documentation (8 hours)
8. ✅ User Guide (4 hours)

**Total: ~38 hours of work that can start TODAY**

---

## 🎯 NEXT STEPS

1. ✅ Review this task list
2. ✅ Assign to Designer/Frontend Builder
3. ✅ Begin UI development (parallel with backend)
4. ✅ Integrate with backend when ready
5. ✅ Test on real devices (iPad, Android tablet)

---

**Document Created:** February 11, 2026, 3:31 PM PST  
**Status:** ✅ READY FOR DESIGNER/FRONTEND BUILDER  
**Questions?** Contact Designer (Antigravity)
