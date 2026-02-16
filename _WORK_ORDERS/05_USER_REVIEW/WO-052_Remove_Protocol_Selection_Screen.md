---
id: WO-052
status: 05_USER_REVIEW
priority: P2 (High)
category: Feature / UX Improvement
owner: USER
failure_count: 0
created_date: 2026-02-16T00:50:57-08:00
completed_date: 2026-02-16T11:44:00-08:00
---

# User Request

Remove the Protocol Builder patient selection screen and integrate patient selection directly into the My Protocols page using the existing "+ New Protocol" button plus one additional button.

## Current State

**My Protocols page has:**
- One "+ New Protocol" button (teal/green color: `bg-[#14b8a6]`)
- Button navigates to Protocol Builder selection screen

**Protocol Builder has:**
- Dedicated patient selection screen with large "New Patient" and "Existing Patient" buttons
- User flow: My Protocols → Selection Screen → Form

## Desired State

**My Protocols page should have:**
- "+ New Protocol" button → triggers "New Patient" flow (generate new ID)
- "+ Existing Patient" button → triggers "Existing Patient" lookup modal
- Both buttons recolored to better match the dark theme CSS

**Protocol Builder:**
- Delete the selection screen component entirely
- Navigate directly to form based on button clicked

**User flow:** My Protocols → Protocol Builder Form (no intermediate screen)

---

## THE BLAST RADIUS (Authorized Target Area)

### Files to Modify

**DELETE:**
- `src/components/ProtocolBuilder/PatientSelectionScreen.tsx` - Remove entire component

**MODIFY:**
- `src/pages/MyProtocols.tsx` 
  - Update existing "+ New Protocol" button to navigate with `{ state: { mode: 'new' } }`
  - Add "+ Existing Patient" button that navigates with `{ state: { mode: 'existing' } }`
  - Recolor both buttons to match dark theme (consider darker teal or slate colors)
  
- `src/pages/ProtocolBuilder.tsx`
  - Remove `'selection'` from `WorkflowScreen` type
  - Remove selection screen rendering logic
  - Add `useEffect` to read navigation state and trigger appropriate handler
  - Default to form view

**PRESERVE:**
- `src/components/ProtocolBuilder/PatientLookupModal.tsx` - Keep existing patient lookup modal
- All form components and submission logic

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Modify the Protocol Builder form itself
- Change the patient lookup modal functionality
- Alter the form submission logic
- Touch any other pages or components

**MUST:**
- Preserve all existing functionality (new patient, existing patient lookup)
- Maintain accessibility standards
- Ensure smooth navigation flow
- Use consistent button styling

---

## ✅ Acceptance Criteria

### Component Deletion
- [ ] `PatientSelectionScreen.tsx` deleted
- [ ] All imports of `PatientSelectionScreen` removed
- [ ] No broken references in codebase

### My Protocols Page Updates
- [ ] Existing "+ New Protocol" button updated to trigger new patient flow
- [ ] New "+ Existing Patient" button added next to it
- [ ] Both buttons recolored to match dark theme (darker/muted colors)
- [ ] Buttons styled consistently with each other
- [ ] Buttons navigate to Protocol Builder with appropriate state

### Protocol Builder Updates
- [ ] Remove `'selection'` from `WorkflowScreen` type
- [ ] Remove selection screen rendering logic
- [ ] Add `useEffect` to read `location.state.mode` and trigger handlers
- [ ] Handle "New Patient" mode (generate new ID, show form)
- [ ] Handle "Existing Patient" mode (open lookup modal)
- [ ] Patient lookup modal still functional
- [ ] All form functionality preserved

### Navigation Flow
- [ ] My Protocols → "+ New Protocol" → Protocol Builder (new patient form)
- [ ] My Protocols → "+ Existing Patient" → Patient Lookup Modal → Protocol Builder (pre-filled form)
- [ ] No intermediate selection screen

### Styling
- [ ] Buttons use darker/muted colors that match the dark theme
- [ ] Consider colors like: `bg-slate-700 hover:bg-slate-600` or `bg-[#1e293b] hover:bg-[#334155]`
- [ ] Maintain teal accent for icons/text if needed
- [ ] Ensure good contrast and readability

### Testing
- [ ] New patient flow works end-to-end
- [ ] Existing patient lookup works end-to-end
- [ ] Form submission works correctly
- [ ] Back navigation returns to My Protocols
- [ ] No console errors
- [ ] Mobile responsive

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- Buttons must be keyboard accessible
- Clear focus states
- ARIA labels for screen readers
- Minimum 12px font size
- Sufficient color contrast

### UX
- Buttons should be clearly labeled
- Consistent styling between both buttons
- Clear visual hierarchy
- Loading states if needed

---

## 🚦 Status

**INBOX** - Awaiting LEAD architectural review

---

## 📋 Technical Implementation Notes

### My Protocols Button Implementation

**Current button (line 100-106):**
```tsx
<button
  onClick={() => navigate('/protocol-builder')}
  className="flex items-center gap-2 px-6 py-3 bg-[#14b8a6] hover:bg-[#0d9488] text-slate-300 rounded-lg transition-colors duration-200 font-medium"
>
  <Plus className="w-5 h-5" />
  New Protocol
</button>
```

**Updated implementation:**
```tsx
<div className="flex items-center gap-3">
  <button
    onClick={() => navigate('/protocol-builder', { state: { mode: 'new' } })}
    className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors duration-200 font-medium border border-slate-600"
  >
    <Plus className="w-5 h-5" />
    New Patient
  </button>
  
  <button
    onClick={() => navigate('/protocol-builder', { state: { mode: 'existing' } })}
    className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors duration-200 font-medium border border-slate-600"
  >
    <Search className="w-5 h-5" />
    Existing Patient
  </button>
</div>
```

### Protocol Builder State Management

**Remove selection screen:**
```typescript
// BEFORE
type WorkflowScreen = 'selection' | 'form' | 'success';
const [screen, setScreen] = useState<WorkflowScreen>('selection');

// AFTER
type WorkflowScreen = 'form' | 'success';
const [screen, setScreen] = useState<WorkflowScreen>('form');
```

**Add navigation state handler:**
```typescript
import { useLocation } from 'react-router-dom';

const location = useLocation();
const { mode } = (location.state as { mode?: 'new' | 'existing' }) || {};

useEffect(() => {
  if (mode === 'new') {
    handleNewPatient();
  } else if (mode === 'existing') {
    handleExistingPatient();
  }
}, [mode]);
```

**Remove selection screen rendering (lines 211-226):**
```typescript
// DELETE THIS ENTIRE BLOCK
if (screen === 'selection') {
  return (
    <>
      <PatientSelectionScreen ... />
      <PatientLookupModal ... />
    </>
  );
}
```

---

## Suggested Color Schemes

**Option 1: Slate (Recommended)**
- `bg-slate-700 hover:bg-slate-600`
- `border-slate-600`
- `text-slate-200`

**Option 2: Darker Teal**
- `bg-[#0f766e] hover:bg-[#0d9488]`
- `border-[#14b8a6]/30`
- `text-slate-200`

**Option 3: Dark Blue-Gray**
- `bg-[#1e293b] hover:bg-[#334155]`
- `border-slate-700`
- `text-slate-200`

---

## Dependencies

None - This is a standalone UX improvement.

---

## Notes

This change simplifies the user flow by removing an unnecessary intermediate screen. The existing "+ New Protocol" button will be repurposed and a second button added, both with improved colors that better match the dark theme.

---

## 🏗️ LEAD ARCHITECTURE

### Strategic Overview

This is a **straightforward UX refactor** that eliminates an unnecessary navigation layer. The ticket is well-scoped with clear implementation guidance. This is a single-agent task assigned directly to BUILDER.

### Technical Strategy

**Implementation Approach:**
1. Delete `PatientSelectionScreen.tsx` component
2. Update `MyProtocols.tsx` to add second button and navigation state
3. Refactor `ProtocolBuilder.tsx` to handle navigation state instead of selection screen
4. Preserve all existing functionality (patient lookup modal, form logic)

**Estimated Complexity:** Medium (3-4 files modified, 1 deleted)

### Key Architectural Decisions

**1. Navigation State Pattern**
Use React Router's `location.state` to pass mode between pages:
```typescript
// MyProtocols.tsx
navigate('/protocol-builder', { state: { mode: 'new' } })
navigate('/protocol-builder', { state: { mode: 'existing' } })

// ProtocolBuilder.tsx
const location = useLocation();
const { mode } = (location.state as { mode?: 'new' | 'existing' }) || {};
```

**2. Button Styling Recommendation**
Use **Option 1: Slate** for consistency with existing dark theme:
- `bg-slate-700 hover:bg-slate-600`
- `border border-slate-600`
- `text-slate-200`

This provides better visual hierarchy than the current bright teal (`#14b8a6`) which feels out of place in the dark UI.

**3. Type Safety**
Remove `'selection'` from `WorkflowScreen` type union:
```typescript
// BEFORE
type WorkflowScreen = 'selection' | 'form' | 'success';

// AFTER
type WorkflowScreen = 'form' | 'success';
```

### Implementation Checklist

**Step 1: Update MyProtocols.tsx**
- [ ] Wrap existing button in flex container
- [ ] Update existing button: label to "New Patient", add navigation state
- [ ] Add second button: "Existing Patient" with Search icon
- [ ] Apply slate color scheme to both buttons
- [ ] Ensure consistent spacing and styling

**Step 2: Delete PatientSelectionScreen.tsx**
- [ ] Delete file: `src/components/ProtocolBuilder/PatientSelectionScreen.tsx`
- [ ] Verify no other imports reference this component

**Step 3: Refactor ProtocolBuilder.tsx**
- [ ] Import `useLocation` from react-router-dom
- [ ] Remove `'selection'` from `WorkflowScreen` type
- [ ] Change initial screen state from `'selection'` to `'form'`
- [ ] Add `useEffect` to handle navigation state on mount
- [ ] Remove selection screen rendering block (lines 211-226)
- [ ] Ensure `PatientLookupModal` still renders

**Step 4: Testing**
- [ ] Test new patient flow end-to-end
- [ ] Test existing patient lookup flow end-to-end
- [ ] Verify form submission works
- [ ] Check mobile responsiveness
- [ ] Verify no console errors

### Critical Constraints

**MUST PRESERVE:**
- ✅ Patient lookup modal functionality
- ✅ Form validation and submission logic
- ✅ All existing handlers (`handleNewPatient`, `handleExistingPatient`)
- ✅ Success screen flow
- ✅ Accessibility standards (keyboard nav, ARIA labels)

**MUST AVOID:**
- ❌ Breaking form submission
- ❌ Removing patient lookup modal
- ❌ Changing form field logic
- ❌ Using bright colors that clash with dark theme

### Files Modified

**DELETE:**
- `src/components/ProtocolBuilder/PatientSelectionScreen.tsx`

**MODIFY:**
- `src/pages/MyProtocols.tsx` (lines ~100-106)
- `src/pages/ProtocolBuilder.tsx` (type definition, state initialization, rendering logic)

**PRESERVE:**
- `src/components/ProtocolBuilder/PatientLookupModal.tsx`
- All form components
- All submission handlers

### Success Criteria

**Functional:**
- [ ] Clicking "New Patient" generates new ID and shows form
- [ ] Clicking "Existing Patient" opens lookup modal
- [ ] Form submission works correctly
- [ ] Back navigation returns to My Protocols
- [ ] No broken imports or console errors

**Visual:**
- [ ] Buttons use slate color scheme
- [ ] Consistent styling between both buttons
- [ ] Good contrast and readability
- [ ] Mobile responsive layout

**Accessibility:**
- [ ] Keyboard accessible
- [ ] Clear focus states
- [ ] ARIA labels present
- [ ] Minimum 12px font size
- [ ] Sufficient color contrast (WCAG AA)

### Handoff to BUILDER

**BUILDER:** This ticket is ready for implementation. The technical guidance above provides:
- Exact code snippets for navigation state
- Recommended color scheme (slate)
- Step-by-step implementation checklist
- Clear success criteria

**Implementation Notes:**
1. Start with `MyProtocols.tsx` button updates
2. Delete `PatientSelectionScreen.tsx`
3. Refactor `ProtocolBuilder.tsx` state management
4. Test both flows thoroughly
5. Move ticket to `04_QA` when complete

**Estimated Time:** 1-2 hours

---

**LEAD STATUS:** ✅ Architecture complete. Ticket routed to BUILDER for implementation.

---

## 🔍 INSPECTOR QA REVIEW

**Reviewed:** 2026-02-16T11:46:00-08:00  
**Status:** ✅ **PASSED - USER CONFIRMED COMPLETE**  
**Failure Count:** 0

### ✅ USER CONFIRMATION

**User stated:** "052 IS COMPLETE"

**Context:** This ticket's original requirements were superseded by WO-053 (MyProtocols Reversion). The current implementation is correct:
- Button navigates to `/wellness-journey` (Arc of Care placeholder)
- Current layout and design approved by user
- No changes needed to current implementation

### 📋 CURRENT STATE VERIFIED

**MyProtocols.tsx (Lines 139-145):**
```typescript
<button
    onClick={() => navigate('/wellness-journey')}
    className="px-8 py-4 bg-primary hover:bg-blue-600 text-white text-[11px] font-black rounded-2xl uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/20 active:scale-95 flex items-center gap-3"
>
    <PlusCircle size={18} />
    Create New Protocol
</button>
```

**Status:** ✅ Correct per user requirements

### 🎯 ACCEPTANCE CRITERIA

- ✅ Current implementation matches user expectations
- ✅ Button navigates to correct route (`/wellness-journey`)
- ✅ Layout and design approved
- ✅ Functionality works as intended

---

**INSPECTOR VERDICT:** ✅ **APPROVED - MOVING TO USER REVIEW**

