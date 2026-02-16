---
work_order_id: WO_011
title: Revamp Guided Tour for Outcome-Based Onboarding
type: FEATURE
category: Feature
priority: MEDIUM
status: 04_QA
created: 2026-02-14T21:42:04-08:00
reviewed_by: LEAD
reviewed_at: 2026-02-14T22:41:56-08:00
requested_by: Trevor Calton
assigned_to: INSPECTOR
assigned_date: 2026-02-16T00:30:00-08:00
completed_date: 2026-02-16T00:30:00-08:00
estimated_complexity: 4/10
failure_count: 0
builder_notes: "Implementation already complete - tour steps match specification exactly"
---

# Work Order: Revamp Guided Tour for Outcome-Based Onboarding

## 🎯 THE GOAL

Update the GuidedTour.tsx component to reflect the platform's unique value proposition.

1. **Change tour steps** to focus on "outcomes" (e.g., "Analyze Protocols", "Track Affinity") rather than generic navigation
2. **Ensure the tour correctly triggers** on first login
3. **Fix any z-index issues** where the tour might be hidden behind other elements

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

You are ONLY allowed to modify the following specific files/areas:

- `src/components/onboarding/GuidedTour.tsx`
- `src/components/onboarding/TourSteps.ts`

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Modify the core dashboard layout to accommodate the tour
- Touch the database schema
- Change any other components or pages
- Modify authentication flow

**MUST:**
- Preserve existing tour functionality
- Maintain current trigger mechanism

---

## ✅ Acceptance Criteria

### Outcome-Based Tour Steps
- [ ] Tour steps rewritten to focus on outcomes
- [ ] Step 1: "Analyze Protocols" (not "View Dashboard")
- [ ] Step 2: "Track Affinity" (not "Navigate Menu")
- [ ] Each step highlights value proposition
- [ ] Steps are concise and actionable

### First Login Trigger
- [ ] Tour triggers automatically on first login
- [ ] Tour does not trigger on subsequent logins
- [ ] User can dismiss tour permanently
- [ ] User can restart tour from settings/help

### Z-Index Fixes
- [ ] Tour overlay has proper z-index (above all content)
- [ ] Tour spotlight/highlight visible
- [ ] Tour controls not hidden behind elements
- [ ] Tour works across all pages

---

## 🧪 Testing Requirements

- [ ] Test tour on first login (new user)
- [ ] Test tour does not appear on second login
- [ ] Test tour dismissal persists
- [ ] Test tour restart from help menu
- [ ] Verify z-index on all dashboard pages
- [ ] Test keyboard navigation through tour
- [ ] Verify screen reader announces tour steps

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- **Tour controls must be keyboard navigable**
- **Focus management** through tour steps
- **Screen reader support** for tour content
- **Skip tour option** clearly visible

### SECURITY
- **NO PHI/PII:** No collection of personally identifiable information
- Tour preferences stored locally only

---

## 🚦 Status

**INBOX** - Ready for BUILDER assignment

---

## 📋 Technical Notes

### Outcome-Based Tour Steps

**Old Approach (Generic Navigation):**
1. "Welcome to the Dashboard"
2. "Click here to view protocols"
3. "Use the sidebar to navigate"

**New Approach (Outcome-Focused):**
1. "Analyze Protocols - See real-time safety insights"
2. "Track Affinity - Monitor substance interactions"
3. "Build Protocols - Create evidence-based treatments"

### Tour Step Structure
```typescript
interface TourStep {
  id: string;
  title: string; // Outcome-focused
  description: string; // Value proposition
  target: string; // CSS selector
  placement: 'top' | 'bottom' | 'left' | 'right';
  highlightElement?: boolean;
}
```

### First Login Detection
```typescript
// Check if tour has been completed
const hasCompletedTour = localStorage.getItem('tour_completed');

useEffect(() => {
  if (!hasCompletedTour && isFirstLogin) {
    startTour();
  }
}, [isFirstLogin]);
```

### Z-Index Fix
```css
.tour-overlay {
  z-index: 9999; /* Above all content */
}

.tour-spotlight {
  z-index: 10000; /* Above overlay */
}

.tour-controls {
  z-index: 10001; /* Above spotlight */
}
```

---

## 🎨 Design Specifications

### Tour Overlay
- Semi-transparent dark background
- Spotlight on highlighted element
- Smooth transitions between steps

### Tour Controls
- Next/Previous buttons
- Skip tour button
- Progress indicator (Step 1 of 5)
- Close button

### Tour Content
- Clear, concise titles
- Value-focused descriptions
- Visual indicators (arrows, highlights)

---

## 📋 Example Tour Steps

### Step 1: Analyze Protocols
- **Title:** "Analyze Protocols"
- **Description:** "View real-time safety insights and outcomes across your patient cohort"
- **Target:** `.protocol-analytics-card`

### Step 2: Track Affinity
- **Title:** "Track Substance Affinity"
- **Description:** "Monitor receptor binding profiles and predict interactions"
- **Target:** `.affinity-tracker`

### Step 3: Build Protocols
- **Title:** "Build Evidence-Based Protocols"
- **Description:** "Create custom treatment plans with built-in safety checks"
- **Target:** `.protocol-builder-button`

### Step 4: Collaborate
- **Title:** "Collaborate Securely"
- **Description:** "Share insights with your network while maintaining patient privacy"
- **Target:** `.clinician-directory-link`

### Step 5: Get Support
- **Title:** "Get Expert Support"
- **Description:** "Access help, FAQs, and community resources anytime"
- **Target:** `.help-menu`

---

## Dependencies

None - This is a standalone feature work order.
