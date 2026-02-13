# Protocol Builder - User Workflow Analysis

**Date:** Feb 13, 2026, 10:43 AM  
**Analyst:** LEAD  
**Goal:** Optimize for speed and minimal steps

---

## Design Principle

> "The number one goal is fast and functional in minimal steps"

**Implications:**
1. **Minimize touches/clicks** - Every interaction should accomplish maximum work
2. **Smart defaults** - Pre-fill when possible, auto-increment session numbers
3. **Single-page layout** - No tab navigation (extra clicks)
4. **Batch inputs** - Group related fields together
5. **Visual feedback** - User knows what's required at a glance

---

## User Workflow (Step-by-Step)

### Scenario 1: New Patient, First Session

**User Goal:** Enter a new patient's first psychedelic session

**Steps:**

1. **Land on My Protocols page** (`/protocols`)
   - See table of all previous protocols
   - Scan for existing patient (if needed)
   - **Action:** Click "New Protocol" button (1 click)

2. **Protocol Builder loads** (`/protocol-builder`)
   - Subject ID auto-generated (PT-XXXXXX)
   - Session number auto-set to 1
   - Form ready for input

3. **Patient Information** (5 clicks)
   - Click age range button (1 click)
   - Click biological sex button (1 click)
   - Click weight range button (1 click)
   - Click smoking status button (1 click)
   - Click prior experience button (1 click)
   - **Total: 5 clicks**

4. **Medications** (variable clicks)
   - Scan checkbox grid (visual, no clicks)
   - Click relevant medication checkboxes (e.g., 2 medications = 2 clicks)
   - Selected medications appear as pills above grid
   - **Total: 0-5 clicks** (most patients have 0-3 medications)

5. **Protocol Details** (4 interactions)
   - Select indication from dropdown (1 click to open, 1 click to select = 2 clicks)
   - Select substance from dropdown (2 clicks)
   - Drag dosage slider to value (1 drag = 1 interaction)
   - Select route from dropdown (2 clicks)
   - Session number auto-set (0 clicks)
   - **Total: 6 clicks + 1 drag**

6. **Consent** (1 click)
   - Check consent verified checkbox
   - **Total: 1 click**

7. **Submit** (1 click)
   - Click "Submit to Registry" button
   - **Total: 1 click**

8. **Success & Return**
   - Success screen displays (2 seconds)
   - Auto-navigate back to My Protocols
   - See new protocol in table

**Total Interactions: 13-18 clicks + 1 drag**
**Time: 2-3 minutes** (for experienced user)

---

### Scenario 2: Existing Patient, Follow-up Session

**User Goal:** Enter a follow-up session for an existing patient

**Steps:**

1. **Land on My Protocols page** (`/protocols`)
   - See table of all previous protocols
   - **Action:** Click on existing patient's row (1 click)

2. **Protocol Detail page loads** (`/protocol/{id}`)
   - See previous session details
   - **Action:** Click "New Session" button (1 click)

3. **Protocol Builder loads** (pre-filled)
   - Subject ID auto-filled (from previous session)
   - Session number auto-incremented (e.g., Session 2 → Session 3)
   - Patient info auto-filled (age, sex, weight, smoking, experience)
   - Medications auto-filled (from previous session)
   - **User only needs to update what changed**

4. **Update Protocol Details** (if needed)
   - Indication: Usually same (0 clicks)
   - Substance: Usually same (0 clicks)
   - Dosage: Adjust slider if different (1 drag)
   - Route: Usually same (0 clicks)
   - **Total: 0-1 drag**

5. **Consent** (1 click)
   - Check consent verified checkbox

6. **Submit** (1 click)
   - Click "Submit to Registry" button

**Total Interactions: 4 clicks + 0-1 drag**
**Time: 30-60 seconds** (for experienced user)

---

## Optimization Strategies

### 1. Sliders vs. Steppers

**Stepper (❌ Slower):**
- Dosage 25mg → 30mg requires 5 clicks (+ button × 5)
- Dosage 25mg → 100mg requires 75 clicks
- **Problem:** Exponentially slower for large changes

**Slider (✅ Faster):**
- Dosage 25mg → 30mg requires 1 drag
- Dosage 25mg → 100mg requires 1 drag
- **Benefit:** Constant time regardless of distance

**Recommendation:** Use sliders for all numeric ranges (dosage)

---

### 2. Auto-Fill & Smart Defaults

**Auto-Generated:**
- Subject ID (PT-XXXXXX)
- Session Date (today's date)
- Session Number (1 for new, auto-increment for existing)

**Pre-Filled (for existing patients):**
- All patient demographics
- Previous medications
- Previous indication (if same)
- Previous substance (if same)
- Previous route (if same)

**Benefit:** Reduces 13-18 clicks to 2-3 clicks for follow-up sessions

---

### 3. Single-Page Layout (No Tabs)

**Tabs (❌ Slower):**
- Patient tab → Next button (1 click)
- Medications tab → Next button (1 click)
- Protocol tab → Submit button (1 click)
- **Extra: 2 navigation clicks**

**Single Page (✅ Faster):**
- All fields visible
- Scroll to navigate (natural, fast)
- Submit button always visible
- **Extra: 0 navigation clicks**

**Recommendation:** Single-page layout with sections

---

### 4. Visual Feedback & Validation

**Real-Time Validation:**
- Required fields highlighted (red border if empty)
- Completed sections show checkmark (✓)
- Progress indicator at top (e.g., "4 of 5 sections complete")

**Dosage Slider Visual Feedback:**
- Color-coded zones:
  - **Green:** Therapeutic range (safe, effective)
  - **Amber:** High dosage (caution, monitor closely)
  - **Red:** Dangerous range (contraindicated)
- Current value displayed above slider (large, readable)
- Tooltip shows weight-based recommendation

**Benefit:** User knows what's required without reading instructions

---

### 5. Tooltips for Guidance (Not Friction)

**Tooltip Strategy:**
- **Always available** (info icon ⓘ next to label)
- **Never required** (user can complete form without reading)
- **Contextual help** (clinical definitions, examples, warnings)

**Example Tooltips:**

**Primary Indication:**
```
ⓘ Major Depressive Disorder (MDD)
  
  Persistent low mood, loss of interest, fatigue.
  Typical presentation: PHQ-9 score ≥15
  
  Example: Patient with 2+ years of treatment-resistant depression
```

**Dosage Slider:**
```
ⓘ Psilocybin Dosage Guidance
  
  Therapeutic range: 20-30mg (moderate experience)
  High dose: 30-40mg (intense experience)
  
  For 70kg patient: Recommended 25mg
  
  ⚠️ Contraindicated with MAOIs
```

**Benefit:** Reduces errors, increases confidence, doesn't slow down experienced users

---

## Workflow Comparison

### Current Implementation (BUILDER's Version)

**Steps:**
1. Patient Selection screen (2 clicks: New Patient or Existing Patient)
2. Tab 1: Patient Info (5 clicks + 1 navigation click)
3. Tab 2: Medications (2-5 clicks + 1 navigation click)
4. Tab 3: Protocol Details (7 clicks + 1 submit click)
5. Success screen

**Total: 18-23 clicks**
**Extra Navigation: 3 clicks** (tab switching)
**Issues:**
- Medication screen has text input (violates zero-text-entry)
- Session date field exists (should be removed)
- Steppers instead of sliders (slower)
- No tooltips (no guidance)

---

### Optimized Design (Recommended)

**Steps:**
1. My Protocols page → Click "New Protocol" (1 click)
2. Single-page form:
   - Patient Info (5 clicks)
   - Medications (2-5 clicks)
   - Protocol Details (6 clicks + 1 drag)
   - Consent (1 click)
   - Submit (1 click)
3. Success screen → Auto-return to My Protocols

**Total: 13-18 clicks + 1 drag**
**Extra Navigation: 0 clicks**
**Improvements:**
- No text input (checkbox grid for medications)
- No session date field (auto-generated)
- Sliders instead of steppers (faster)
- Tooltips on all complex fields (guidance)
- Single-page layout (no tab navigation)

**Time Saved: 30-40%** (from 3 minutes to 2 minutes)

---

## Success Metrics

**Speed:**
- New patient entry: <2 minutes (experienced user)
- Follow-up session: <1 minute (experienced user)

**Accuracy:**
- Zero text entry errors (no free text)
- Dosage within safe range (visual feedback)
- All required fields completed (real-time validation)

**User Satisfaction:**
- Minimal clicks (13-18 vs. 18-23)
- Fast workflow (single page, no tabs)
- Confident decisions (tooltips, visual feedback)

---

## Recommendations for DESIGNER

1. **Use sliders for dosage** (not steppers)
2. **Add tooltips to all complex fields** (using AdvancedTooltip component)
3. **Single-page layout** (no tabs unless absolutely necessary)
4. **Auto-fill for existing patients** (reduce clicks by 80%)
5. **Visual feedback on dosage slider** (color-coded zones)
6. **Real-time validation** (highlight required fields)
7. **Progress indicator** (show completion status)
