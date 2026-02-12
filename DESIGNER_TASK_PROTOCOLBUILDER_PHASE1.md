# DESIGNER: Protocol Builder Phase 1 Implementation

**Priority:** P0 - Critical for Adoption  
**Estimated Effort:** 4 hours  
**Goal:** Reduce data entry time by 30%

---

## 📋 Your Task

Implement Phase 1 UX improvements to the Protocol Builder modal. These are "quick wins" that will immediately improve the user experience.

**Context:** The current Protocol Builder has too much friction for clinical adoption. Practitioners need < 2 minute data entry to use this daily. Phase 1 focuses on replacing dropdowns with button groups for small option sets.

---

## 📁 Files You Will Modify

1. **Create New Component:**
   - `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/components/forms/ButtonGroup.tsx` (NEW)

2. **Modify Existing Component:**
   - `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/pages/ProtocolBuilder.tsx`

---

## ✅ Task 1: Create `<ButtonGroup>` Component

### Component Spec

**File:** `src/components/forms/ButtonGroup.tsx`

**Props:**
```typescript
interface ButtonGroupProps {
  label: string;
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}
```

**Visual Design:**
```
Label
┌───────┬─────────┬─────────┐
│ Male  │ Female  │ Other   │  ← Unselected: slate-800 bg, slate-400 text
└───────┴─────────┴─────────┘

┌───────┬─────────┬─────────┐
│ Male  │ Female  │ Other   │  ← Selected: indigo-500 bg, white text, bold
└───────┴─────────┴─────────┘
```

**CSS Classes:**
```css
/* Unselected */
.button-group-item {
  background: #1e293b; /* slate-800 */
  border: 1px solid #334155; /* slate-700 */
  color: #94a3b8; /* slate-400 */
}

/* Hover */
.button-group-item:hover {
  background: #334155; /* slate-700 */
  border-color: #6366f1; /* indigo-500 */
  color: #e2e8f0; /* slate-200 */
}

/* Selected */
.button-group-item.selected {
  background: #6366f1; /* indigo-500 */
  border-color: #6366f1;
  color: white;
  font-weight: 600;
}
```

**Implementation:**
```tsx
import React from 'react';

interface ButtonGroupOption {
  value: string;
  label: string;
}

interface ButtonGroupProps {
  label: string;
  options: ButtonGroupOption[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  label,
  options,
  value,
  onChange,
  required = false,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-slate-200">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              flex-1 px-4 py-2 rounded-lg border transition-all duration-200
              ${value === option.value
                ? 'bg-indigo-500 border-indigo-500 text-white font-semibold'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:border-indigo-500 hover:text-slate-200'
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
```

---

## ✅ Task 2: Replace 5 Dropdowns with Button Groups

**File:** `src/pages/ProtocolBuilder.tsx`

### 2.1 Import ButtonGroup
```tsx
import { ButtonGroup } from '../components/forms/ButtonGroup';
```

### 2.2 Replace Sex Dropdown
**Find this:**
```tsx
<select
  value={formData.sex}
  onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
  className="..."
>
  <option value="">Select...</option>
  <option value="M">Male</option>
  <option value="F">Female</option>
  <option value="O">Other</option>
</select>
```

**Replace with:**
```tsx
<ButtonGroup
  label="Biological Sex"
  options={[
    { value: 'M', label: 'Male' },
    { value: 'F', label: 'Female' },
    { value: 'O', label: 'Other' }
  ]}
  value={formData.sex}
  onChange={(value) => setFormData({ ...formData, sex: value })}
  required
/>
```

### 2.3 Replace Smoking Status Dropdown
**Find this:**
```tsx
<select
  value={formData.smokingStatus}
  onChange={(e) => setFormData({ ...formData, smokingStatus: e.target.value })}
  className="..."
>
  <option value="">Select...</option>
  <option value="never">Never</option>
  <option value="former">Former</option>
  <option value="current">Current</option>
</select>
```

**Replace with:**
```tsx
<ButtonGroup
  label="Smoking Status"
  options={[
    { value: 'never', label: 'Never' },
    { value: 'former', label: 'Former' },
    { value: 'current', label: 'Current' }
  ]}
  value={formData.smokingStatus}
  onChange={(value) => setFormData({ ...formData, smokingStatus: value })}
/>
```

### 2.4 Replace Route Dropdown
**Find this:**
```tsx
<select
  value={formData.route}
  onChange={(e) => setFormData({ ...formData, route: e.target.value })}
  className="..."
>
  <option value="">Select...</option>
  <option value="oral">Oral</option>
  <option value="iv">IV</option>
  <option value="im">IM</option>
  <option value="sublingual">Sublingual</option>
  <option value="nasal">Nasal</option>
</select>
```

**Replace with:**
```tsx
<ButtonGroup
  label="Administration Route"
  options={[
    { value: 'oral', label: 'Oral' },
    { value: 'iv', label: 'IV' },
    { value: 'im', label: 'IM' },
    { value: 'sublingual', label: 'Sublingual' },
    { value: 'nasal', label: 'Nasal' }
  ]}
  value={formData.route}
  onChange={(value) => setFormData({ ...formData, route: value })}
  required
/>
```

### 2.5 Replace Session Number Dropdown
**Find this:**
```tsx
<select
  value={formData.sessionNumber}
  onChange={(e) => setFormData({ ...formData, sessionNumber: e.target.value })}
  className="..."
>
  <option value="">Select...</option>
  <option value="1">Session 1</option>
  <option value="2">Session 2</option>
  <option value="3">Session 3</option>
  <option value="4+">Session 4+</option>
</select>
```

**Replace with:**
```tsx
<ButtonGroup
  label="Session Number"
  options={[
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4+', label: '4+' }
  ]}
  value={formData.sessionNumber}
  onChange={(value) => setFormData({ ...formData, sessionNumber: value })}
  required
/>
```

### 2.6 Replace Safety Event Checkbox with Button Group
**Find this:**
```tsx
<input
  type="checkbox"
  checked={formData.hasSafetyEvent}
  onChange={(e) => setFormData({ ...formData, hasSafetyEvent: e.target.checked })}
/>
```

**Replace with:**
```tsx
<ButtonGroup
  label="Adverse Events?"
  options={[
    { value: 'no', label: 'No' },
    { value: 'yes', label: 'Yes' }
  ]}
  value={formData.hasSafetyEvent ? 'yes' : 'no'}
  onChange={(value) => setFormData({ ...formData, hasSafetyEvent: value === 'yes' })}
/>
```

---

## ✅ Task 3: Auto-Open First Accordion

**File:** `src/pages/ProtocolBuilder.tsx`

**Find the accordion state initialization:**
```tsx
const [openSections, setOpenSections] = useState<string[]>([]);
```

**Replace with:**
```tsx
const [openSections, setOpenSections] = useState<string[]>(['demographics']);
```

**Or if using a different state pattern, ensure the first accordion (Patient Demographics) is open by default when the modal opens.**

---

## ✅ Task 4: Add Progress Indicator

**File:** `src/pages/ProtocolBuilder.tsx`

**Add this helper function:**
```tsx
const getCompletionStatus = () => {
  const requiredFields = [
    formData.subjectId,
    formData.sex,
    formData.substance,
    formData.route,
    formData.dosage,
    formData.sessionNumber,
    formData.consentVerified
  ];
  
  const completedFields = requiredFields.filter(field => field).length;
  return `${completedFields} of ${requiredFields.length} required fields complete`;
};
```

**Add progress indicator to modal header:**
```tsx
<div className="flex items-center justify-between mb-4">
  <h2 className="text-xl font-semibold">New Treatment Entry</h2>
  <span className="text-sm text-slate-400">
    {getCompletionStatus()}
  </span>
</div>
```

---

## 🎯 Acceptance Criteria

### Visual
- [ ] Button groups have correct colors (slate-800 unselected, indigo-500 selected)
- [ ] Hover states work (slate-700 bg, indigo-500 border)
- [ ] Selected button is bold with white text
- [ ] All 5 button groups are visually consistent
- [ ] First accordion (Patient Demographics) opens automatically

### Functional
- [ ] Clicking a button updates the form state
- [ ] Only one button can be selected at a time
- [ ] Progress indicator updates as fields are filled
- [ ] Form submission still works correctly
- [ ] No console errors

### Performance
- [ ] No layout shift when switching between buttons
- [ ] Smooth transitions (200ms)
- [ ] Responsive on mobile (buttons stack or shrink appropriately)

---

## 📊 Expected Impact

**Before:**
- 5 dropdown clicks (open dropdown, scroll, select)
- Hard to scan options
- Slower visual feedback

**After:**
- 1 click per selection
- All options visible at once
- Instant visual feedback
- 30% faster data entry

---

## 🚫 What NOT to Change

- ❌ Do NOT change the form submission logic
- ❌ Do NOT change the database payload structure
- ❌ Do NOT modify other dropdowns (Substance, Indication, PHQ-9) - keep those as searchable dropdowns
- ❌ Do NOT change the modal layout or accordion structure (except auto-opening first one)
- ❌ Do NOT change any backend logic

---

## 📝 Testing Checklist

After implementation:
1. [ ] Open Protocol Builder modal
2. [ ] Verify first accordion is open
3. [ ] Click each button in Sex button group - verify selection works
4. [ ] Click each button in Smoking Status - verify selection works
5. [ ] Click each button in Route - verify selection works
6. [ ] Click each button in Session Number - verify selection works
7. [ ] Click each button in Safety Event - verify selection works
8. [ ] Fill out entire form and submit - verify data saves correctly
9. [ ] Check progress indicator updates as you fill fields
10. [ ] Test on mobile - verify buttons are responsive

---

## 📚 Reference Files

**Full UX Redesign Plan:**
`/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/PROTOCOLBUILDER_COMPLETE_REDESIGN_SPEC.md`

**Current Protocol Builder:**
`/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/pages/ProtocolBuilder.tsx`

---

**DESIGNER: You have everything you need. Start with Task 1 (create ButtonGroup component), then move to Task 2 (replace dropdowns), then Tasks 3 & 4 (auto-open + progress). Test thoroughly before marking complete.**

**Questions? Ask LEAD before proceeding.**
