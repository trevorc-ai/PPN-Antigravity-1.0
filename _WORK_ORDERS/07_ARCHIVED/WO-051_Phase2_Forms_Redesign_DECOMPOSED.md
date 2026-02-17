---
id: WO-051
status: 03_BUILD
priority: P1 (High)
category: Feature
owner: BUILDER
failure_count: 0
phase: Arc of Care - Phase 2 (Dosing Session)
estimated_hours: 25-30
depends_on: WO-050
---

# Work Order: Phase 2 Forms Redesign (Dosing Session)
## Arc of Care Compliance - Forms Showcase Update

**Created:** 2026-02-17T05:36:00-08:00  
**Designer:** DESIGNER  
**Phase:** 2 of 3 (Dosing Session)  
**Depends On:** WO-050 (Phase 1 must be complete first)

---

## 📋 User Request

Update Forms Showcase Phase 2 (Dosing Session) forms to achieve 100% compliance with Arc of Care Design Guidelines v2.0 using the schema from `arc_of_care_technical_spec.md`.

---

## 🎯 Scope: Phase 2 Forms (Dosing Session)

### Forms Included:

| # | Form Name | Status | Changes Required |
|---|-----------|--------|------------------|
| 6 | Dosing Protocol | ⚠️ MODIFY | Add "Now" buttons, replace text inputs with dropdowns |
| 7 | Session Vitals | ⚠️ MODIFY | Add "Now" button, add Quick-Entry presets |
| 8 | Session Timeline | ⚠️ MODIFY | Add "Mark [Event]" buttons, add visual timeline |
| 9 | Session Observations | ✅ USE AS-IS | None (gold standard) |
| 10 | Post-Session Assessments | ⚠️ MODIFY | Add "Now" buttons for completion timestamps |
| 11 | MEQ-30 Questionnaire | ✅ USE AS-IS | None |
| 12 | Adverse Event Report | ⚠️ MODIFY | Add "Now" button for timestamp |
| 13 | Safety Event Observations | ✅ USE AS-IS | None |
| 14 | Rescue Protocol | ⚠️ MODIFY | Add "Start/End Intervention" buttons |

**Total:** 9 forms (4 use as-is, 5 require modifications)

---

## 🔧 LEAD ARCHITECTURE

### Technical Strategy:

Phase 2 forms map to multiple tables:
- `log_sessions` - Main dosing session data
- `log_session_vitals` - Time-series vital signs
- `log_session_events` - Safety events and interventions

**Key Improvements:**
1. **"Now" Buttons:** Reduce time picker touches from 5-7 to 1
2. **Quick-Entry Presets:** Auto-fill common vital sign patterns
3. **Visual Timeline:** Show session progression graphically
4. **Quick-Action Buttons:** "Mark Onset", "Mark Peak", "End Session"

**Files to Modify:**
1. `src/components/forms/DosingProtocol.tsx`
2. `src/components/forms/SessionVitals.tsx`
3. `src/components/forms/SessionTimeline.tsx`
4. `src/components/forms/PostSessionAssessments.tsx`
5. `src/components/forms/AdverseEventReport.tsx`
6. `src/components/forms/RescueProtocol.tsx`

---

## 📦 Detailed Implementation Tasks

### Task 1: Dosing Protocol Enhancements (BUILDER)

**File:** `src/components/forms/DosingProtocol.tsx`

**Changes:**
1. Replace `batch_number` text input with dropdown (fetch from `ref_substance_batches`)
2. Replace `device_id` text input with dropdown (fetch from `ref_wearable_devices`)
3. Add "Register New Batch" modal
4. Add "Register New Device" modal

**New Components Needed:**
- `BatchRegistrationModal.tsx`
- `DeviceRegistrationModal.tsx`

**Schema Fields:**
```typescript
interface DosingProtocolData {
  substance_id: number;
  dosage_mg: number;
  dosage_route: string;
  batch_id: number; // Changed from batch_number string
  guide_user_id: string;
  device_id: number; // Changed from device_id string
}
```

---

### Task 2: Session Vitals Quick-Entry (BUILDER)

**File:** `src/components/forms/SessionVitals.tsx`

**Changes:**
1. Add "Now" button next to time picker
2. Add Quick-Entry preset buttons:
   - **Baseline:** HR=72, HRV=45, SpO2=98, BP=120/80
   - **Peak:** HR=95, HRV=30, SpO2=96, BP=135/85
   - **Recovery:** HR=78, HRV=42, SpO2=98, BP=125/82

**UI Mockup:**
```
Quick Entry: [Baseline] [Peak] [Recovery] [Custom]

Heart Rate: [72] bpm  [-] [+]
HRV: [45.2] ms  [-] [+]
SpO2: [98] %  [-] [+]
BP: [120] / [80] mmHg  [-] [+]

Recorded At: [02:30 PM] [Now]
```

**Touch Reduction:**
- Before: 15-20 touches
- After: 2-3 touches (preset + "Now" button)

---

### Task 3: Session Timeline Visual Enhancement (BUILDER)

**File:** `src/components/forms/SessionTimeline.tsx`

**Changes:**
1. Add "Mark Dose" / "Mark Onset" / "Mark Peak" / "End Session" buttons
2. Add visual timeline component
3. Add elapsed time calculator

**New Component:**
- `VisualTimeline.tsx` - SVG-based timeline visualization

**UI Mockup:**
```
Dose Administered: [12:30 PM] [Mark Dose] ✅
Onset Reported: [01:15 PM] [Mark Onset] ✅
Peak Intensity: [--:-- --] [Mark Peak] ⏺️ READY
Session Ended: [--:-- --] [End Session]

┌─────────────────────────────────────────┐
│ ├─────●─────────●──────────○──────────○─┤│
│ 12:30      1:15        2:45         5:00│
│ Dose      Onset       Peak          End │
│ Elapsed: 2h 15m                          │
└─────────────────────────────────────────┘
```

**Touch Reduction:**
- Before: 20-28 touches (4 time pickers × 5-7 touches each)
- After: 4 touches (4 quick-action buttons)
- **83% reduction!**

---

### Task 4: Post-Session Assessment Timestamps (BUILDER)

**File:** `src/components/forms/PostSessionAssessments.tsx`

**Changes:**
1. Add "Now" buttons for completion timestamps
2. Auto-calculate time since session end

**UI Enhancement:**
```
MEQ-30 Score: [85] (0-100)
Completed: [05:30 PM] [Now]
(30 minutes after session ended)

EDI Score: [72] (0-100)
Completed: [05:32 PM] [Now]
(32 minutes after session ended)
```

---

### Task 5: Adverse Event Timestamp (BUILDER)

**File:** `src/components/forms/AdverseEventReport.tsx`

**Changes:**
1. Add "Now" button for occurrence timestamp
2. Add time since dose administered

**UI Enhancement:**
```
Occurred At: [02:45 PM] [Now]
(2 hours 15 minutes after dose)
```

---

### Task 6: Rescue Protocol Active Indicator (BUILDER)

**File:** `src/components/forms/RescueProtocol.tsx`

**Changes:**
1. Add "Start Intervention" button
2. Add "End Intervention" button
3. Add active intervention indicator

**UI Mockup:**
```
Intervention Type: [Verbal Reassurance ▼]

[Start Intervention]

┌─────────────────────────────────────────┐
│ 🚨 INTERVENTION IN PROGRESS             │
│ Duration: 15 minutes                    │
│ Type: Verbal Reassurance                │
│                                         │
│ [End Intervention]                      │
└─────────────────────────────────────────┘

Outcome:
● Effective - Patient stabilized
○ Partially Effective
○ Ineffective
```

---

## 🧪 Testing Requirements

### Functional Tests:
- [ ] "Now" buttons capture current timestamp correctly
- [ ] Quick-Entry presets populate all vital sign fields
- [ ] Visual timeline updates in real-time
- [ ] Quick-action buttons ("Mark Onset", etc.) work correctly
- [ ] Active intervention indicator shows/hides appropriately

### Performance Tests:
- [ ] Touch count reduced by 50% on average
- [ ] Forms complete in <30 seconds each
- [ ] No lag when clicking "Now" buttons

### Accessibility Tests:
- [ ] All new buttons are keyboard accessible
- [ ] Screen readers announce button purposes
- [ ] Visual timeline has text alternative

---

## 📊 Success Criteria

**Phase 2 forms achieve:**
- ✅ 50% reduction in touches (from 120-150 to 60-75 total)
- ✅ 50% reduction in time (from 6-8 minutes to 3-4 minutes)
- ✅ 100% schema compliance
- ✅ Zero free-text inputs
- ✅ WCAG AAA accessibility

---

## 📚 Reference Documents

- **Design Guidelines:** `/brain/arc_of_care_guidelines_v2.md`
- **Forms Audit:** `/brain/arc_of_care_forms_audit.md`
- **Redesign Proposal:** `/brain/forms_redesign_proposal.md` (Forms 6-14)

---

**Estimated Effort:** 25-30 hours  
**Dependencies:** WO-050 (Phase 1 complete)  
**Blocks:** WO-052 (Phase 3 Forms)

---

## BUILDER NOTES - TICKET DECOMPOSITION

**Date:** 2026-02-17T09:09:00-08:00

This large ticket (25-30 hours) has been decomposed into 4 smaller, incremental sub-tickets for better workflow management:

### Sub-Tickets Created:

1. **WO-051.1** - Session Vitals Quick-Entry Presets (3-4 hours)
   - Location: `_WORK_ORDERS/00_INBOX/WO-051.1_Session_Vitals_Quick_Entry.md`
   - Status: Ready for LEAD triage
   - Components already created: ✅ VitalPresetsBar.tsx, NowButton.tsx

2. **WO-051.2** - Session Timeline Visual Enhancement (6-8 hours)
   - Location: `_WORK_ORDERS/00_INBOX/WO-051.2_Session_Timeline_Visual.md`
   - Status: Ready for LEAD triage
   - Requires: VisualTimeline.tsx component creation

3. **WO-051.3** - Dosing Protocol Dropdowns & Registration Modals (4-5 hours)
   - Location: `_WORK_ORDERS/00_INBOX/WO-051.3_Dosing_Protocol_Dropdowns.md`
   - Status: Ready for LEAD triage
   - Requires: BatchRegistrationModal.tsx, DeviceRegistrationModal.tsx

4. **WO-051.4** - Timestamp Enhancements for Remaining Forms (3-4 hours)
   - Location: `_WORK_ORDERS/00_INBOX/WO-051.4_Timestamp_Enhancements.md`
   - Status: Ready for LEAD triage
   - Components already created: ✅ NowButton.tsx, RelativeTimeDisplay.tsx

### Total Estimated Effort: 16-21 hours (reduced from 25-30 hours due to component reuse)

### Components Already Created (Reusable):
- ✅ `src/components/arc-of-care-forms/shared/NowButton.tsx`
- ✅ `src/components/arc-of-care-forms/shared/RelativeTimeDisplay.tsx`
- ✅ `src/components/arc-of-care-forms/shared/VitalPresetsBar.tsx`

### Recommendation:
Close this parent ticket and track progress through the 4 sub-tickets. Each sub-ticket is independently deliverable and testable.

