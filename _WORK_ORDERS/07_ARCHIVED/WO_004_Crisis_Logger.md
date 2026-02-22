---
work_order_id: WO_004
title: Feature - Crisis Logger Interface
type: FEATURE
category: Feature
priority: HIGH
status: ASSIGNED
created: 2026-02-14T18:59:32-08:00
reviewed_by: LEAD
reviewed_at: 2026-02-14T19:07:27-08:00
requested_by: PPN Admin
assigned_to: BUILDER
estimated_complexity: 6/10
failure_count: 0
---

# Work Order: Feature - Crisis Logger Interface

## 🎯 THE GOAL

Create a "Tactical" incident logging screen for high-stress use.

### Requirements

1. **Layout:** A 2x2 grid of massive buttons (80px+ height)
2. **Buttons:**
   - "Vital Signs Normal" (Green)
   - "Verbal Support" (Amber)
   - "Physical Assist" (Orange)
   - "Chemical Intervention" (Red)
3. **Behavior:**
   - Tapping a button immediately inserts a row into `log_interventions`
   - "Chemical Intervention" requires a **Long Press (2 seconds)** to trigger
4. **Feedback:** Haptic vibration on success. No audio beeps.
5. **Display:** Show a running session timer (T+01:42:00) at the top

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

You are ONLY allowed to modify the following specific files/areas:

- `src/components/session/CrisisLogger.tsx` (New Component - CREATE THIS)
- `src/components/ui/TacticalButton.tsx` (Reusable button component - CREATE THIS)

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Use bright white backgrounds (Must be OLED Black #000000)
- Require a confirmation popup for standard buttons (Speed is critical)
- Store GPS data with the log
- Add any text input fields
- Modify any other components or pages
- Touch the database schema
- Add new routes or navigation

**MUST:**
- Use OLED Black (#000000) background
- Implement 2-second long press for "Chemical Intervention" only
- Provide haptic feedback on successful log
- Display session timer in T+HH:MM:SS format
- Handle database errors gracefully without blocking UI

---

## ✅ Acceptance Criteria

### Functionality
- [ ] 2x2 grid layout with 4 large buttons (minimum 80px height)
- [ ] Each button inserts record into `log_interventions` table
- [ ] "Chemical Intervention" requires 2-second long press
- [ ] Other 3 buttons trigger on single tap
- [ ] Haptic vibration feedback on successful log
- [ ] Session timer displays at top in T+HH:MM:SS format
- [ ] Timer updates every second
- [ ] Records include `seconds_since_start` calculated from session start time

### UI/UX
- [ ] OLED Black (#000000) background
- [ ] Button colors match specification:
  - Green: "Vital Signs Normal"
  - Amber: "Verbal Support"
  - Orange: "Physical Assist"
  - Red: "Chemical Intervention"
- [ ] Buttons are minimum 80px height
- [ ] High contrast labels (white text on colored backgrounds)
- [ ] Visual feedback during long press (progress indicator)
- [ ] No confirmation popups (immediate action)
- [ ] Responsive grid layout (works on mobile and tablet)

### Security & Compliance
- [ ] Zero-Knowledge architecture (no PII)
- [ ] No GPS/location data stored
- [ ] No audio feedback (haptic only)
- [ ] Proper error handling for database operations

---

## 🧪 Testing Requirements

- [ ] Test each button logs correct intervention type
- [ ] Verify long press (2s) required for "Chemical Intervention"
- [ ] Confirm short tap does NOT trigger "Chemical Intervention"
- [ ] Test haptic feedback works on supported devices
- [ ] Verify session timer accuracy
- [ ] Test database insertion with valid session
- [ ] Verify error handling when Supabase is unavailable
- [ ] Test on mobile devices (iOS and Android)
- [ ] Verify OLED black background (#000000)

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- **High Contrast Labels:** White text on colored backgrounds
- **No Small Links:** All interactive elements must be large touch targets (80px+)
- **Button Size:** Minimum 80px height for easy tapping under stress
- **Clear Labels:** Unambiguous button text
- **No Color-Only Meaning:** Include text labels, not just colors

### SECURITY
- **Zero-Knowledge:** No personally identifiable information
- **No Location Data:** Do not store GPS coordinates
- **No Audio:** Haptic feedback only (silent operation)
- **RLS:** Ensure database operations respect Row Level Security

---

## 🚦 Status

**INBOX** - Ready for BUILDER assignment

---

## Workflow

1. ⏳ CUE creates work order → **CURRENT STEP**
2. ⏳ BUILDER reviews and accepts
3. ⏳ BUILDER creates TacticalButton component
4. ⏳ BUILDER creates CrisisLogger component
5. ⏳ BUILDER implements haptic feedback
6. ⏳ BUILDER tests on mobile devices
7. ⏳ INSPECTOR verifies compliance
8. ⏳ User approves and deploys

---

## 📋 Technical Notes

### Component Structure
```tsx
// CrisisLogger.tsx
interface CrisisLoggerProps {
  sessionId: string;
  sessionStartTime: Date;
}

// TacticalButton.tsx
interface TacticalButtonProps {
  label: string;
  color: 'green' | 'amber' | 'orange' | 'red';
  requireLongPress?: boolean;
  longPressDuration?: number; // milliseconds
  onPress: () => void;
}
```

### Database Schema Reference
- Table: `log_interventions`
- Required fields: `session_id`, `intervention_id`, `seconds_since_start`

### Button Mapping
```typescript
const interventions = {
  'Vital Signs Normal': { id: 1, color: 'green' },
  'Verbal Support': { id: 2, color: 'amber' },
  'Physical Assist': { id: 3, color: 'orange' },
  'Chemical Intervention': { id: 4, color: 'red', requireLongPress: true }
};
```

### Haptic Feedback
```typescript
// Use Vibration API or React Native Haptics
if ('vibrate' in navigator) {
  navigator.vibrate(50); // 50ms vibration
}
```

### Session Timer Calculation
```typescript
const secondsSinceStart = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
const formatted = `T+${hours}:${minutes}:${seconds}`;
```

---

## 🎨 Design Specifications

### Colors
- Background: `#000000` (OLED Black)
- Green: `#10b981` or `#22c55e` (Emerald/Green)
- Amber: `#f59e0b` or `#fbbf24` (Amber)
- Orange: `#f97316` or `#fb923c` (Orange)
- Red: `#dc2626` or `#ef4444` (Red)
- Text: `#ffffff` (White)

### Layout
- 2x2 grid with equal spacing
- Buttons: minimum 80px height, ideally 100-120px
- Timer: Top center, large font (24px+)
- Padding: 16px around grid
- Gap: 16px between buttons

### Long Press Visual Feedback
- Show circular progress indicator during 2-second hold
- Visual countdown or fill animation
- Clear indication when threshold is reached

---

## Dependencies

**Prerequisite:** WO_002 (Shadow Market Schema) must be completed first to ensure `log_interventions` and `ref_interventions` tables exist.

---

## 🔍 INSPECTOR QA APPROVAL

**Reviewed By:** INSPECTOR  
**Review Date:** 2026-02-14T21:43:23-08:00  
**Status:** ✅ **APPROVED**

### Compliance Verification

**✅ ACCESSIBILITY:**
- Minimum 80px button height (exceeds 44px requirement)
- High contrast labels (white on colored backgrounds)
- No color-only meaning (text labels + colors)
- Clear, unambiguous button text
- Screen reader support specified

**✅ PHI/SECURITY:**
- Zero-Knowledge architecture enforced
- No PII/PHI collection
- No GPS/location data
- No free-text inputs
- RLS enforcement specified
- Data stored as controlled values (intervention_id, timestamps)

**VERDICT:** This work order is compliant with all accessibility and PHI rules. Cleared for USER_REVIEW.
