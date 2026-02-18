---
id: WO-066
status: 03_BUILD
priority: P1 (High)
category: UX / Onboarding / Accessibility
owner: BUILDER
failure_count: 0
created_date: 2026-02-16T19:32:00-08:00
requested_by: Trevor Calton
estimated_hours: 10-12 hours
phase: BUILD
---

# Wellness Journey Mini Guided Tours

**Date:** 2026-02-16  
**Requested by:** Trevor Calton  
**Priority:** P1 - High (Critical for user onboarding)

---

## 🎯 USER REQUEST

> "For each point on the guided tours, let's put more than just the name of the function; put a one or two sentence description, using simple, understandable, and repeatable language at a ninth grade reading level. And let's put a button or something (like the compass we use for the main guided tour) or something similar next to the heading or even a link that says 'guided tour' that's readily visible, but not intrusive. So people always know it's there."

**Simplified to:** Compass icon only (no text), with reminder in main onboarding modal.

---

## 🚨 THE PROBLEM

The Wellness Journey is highly complex (3 phases, 15+ features per phase). Users need **just-in-time learning** for each phase, not a single overwhelming onboarding modal.

**Current State:**
- Single onboarding modal shows all 3 phases at once
- Users must remember everything before they start
- No contextual help when they actually need it

**Desired State:**
- Mini guided tour for each phase (Phase 1, 2, 3)
- Compass icon next to each phase header
- Tours auto-trigger on first unlock (can be dismissed)
- Tours can be re-launched anytime via compass icon

---

## ✅ SOLUTION OVERVIEW

### **1. Add Compass Icon to Each Phase Header**

**Visual Design:**
```tsx
<div className="flex items-center gap-3 mb-6">
  <h2 className="text-3xl font-black text-white">Phase 1: Preparation</h2>
  
  {/* Compass Icon - Launches Mini Tour */}
  <button
    onClick={() => setShowPhase1Tour(true)}
    className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 rounded-lg transition-all group"
    aria-label="Take guided tour of Phase 1"
  >
    <Compass className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
  </button>
</div>
```

**Color Coding by Phase:**
- **Phase 1:** Emerald (Clinical/Preparation)
- **Phase 2:** Amber (Active Session)
- **Phase 3:** Blue (Data/Analytics)

---

### **2. Update Main Onboarding Modal**

**Add Reminder After "Key Benefits" Section:**

```tsx
{/* Tour Icon Reminder */}
<div className="bg-slate-800/30 rounded-xl p-4 mb-6 border-l-4 border-blue-500">
  <div className="flex items-start gap-3">
    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
      <Compass className="w-5 h-5 text-blue-400" />
    </div>
    <div>
      <h4 className="text-sm font-bold text-slate-200 mb-1">
        Look for the Compass Icon
      </h4>
      <p className="text-xs text-slate-400 leading-relaxed">
        Anytime you see this icon <Compass className="w-3 h-3 inline text-blue-400" />, 
        you can click it to take a guided tour of that section. Each phase has its own 
        mini tour to help you understand what to do.
      </p>
    </div>
  </div>
</div>
```

---

### **3. Create Mini Tours for Each Phase**

**Phase 1: Preparation (5 Steps, ~2 minutes)**

1. **Baseline Metrics Dashboard**
   - "These scores show how your patient is feeling right now, before treatment starts. We use these numbers to predict how much support they'll need after the session."

2. **Algorithm Predictions**
   - "Our computer system looks at the baseline scores and predicts how much help your patient will need. This helps you plan ahead."

3. **Risk Flags & Safety Warnings**
   - "These red warnings tell you if it's unsafe to give this treatment right now. Always check these before the session."

4. **Schedule Integration Sessions**
   - "Use the predictions to schedule follow-up appointments now, before the session happens. This makes sure your patient gets the help they need."

5. **Complete Phase 1**
   - "Click this button when you've reviewed all the baseline scores and scheduled the follow-up sessions. This unlocks Phase 2."

---

**Phase 2: Dosing Session (6 Steps, ~3 minutes)**

1. **Start Session Button**
   - "Click this button when the patient takes the medicine. It starts a timer and begins tracking their heart rate and blood pressure automatically."

2. **Real-Time Vitals Dashboard**
   - "This shows the patient's heart rate, blood pressure, and oxygen levels in real-time. If their Apple Watch is connected, it updates automatically every 30 seconds."

3. **Log Safety Events**
   - "Click this button if something important happens during the session. Examples: patient feels nauseous, starts crying, or has a breakthrough moment."

4. **Rescue Protocol Checklist**
   - "If the patient is having a bad reaction (panic attack, scary visions), use this checklist. It tells you exactly what to do step-by-step to help them feel safe."

5. **Post-Session Assessments**
   - "After the medicine wears off, ask the patient to fill out these three quick tests. They measure how intense the experience was and if they felt connected to something bigger."

6. **End Session**
   - "Click this button when the patient is back to normal and ready to go home. This saves all the data and unlocks Phase 3 (Integration Tracking)."

---

**Phase 3: Integration (5 Steps, ~2 minutes)**

1. **Symptom Decay Curve**
   - "This chart shows if the patient's depression is getting better over time. The line should go down if the treatment is working."

2. **Compliance Tracking**
   - "This shows if the patient is doing their homework (therapy sessions, daily check-ins, lifestyle changes). Green means they're doing great, red means they need a reminder."

3. **Red Alerts & Intervention Triggers**
   - "These are emergency warnings that need your attention right away. Example: patient says they're thinking about hurting themselves. Call them immediately."

4. **Automated Check-In Schedule**
   - "The system automatically sends text messages and emails to the patient asking how they're doing. You can see their responses here and know when to reach out."

5. **Export Report for Insurance**
   - "Click this button to create a PDF report with all the patient's data. You can send this to insurance companies to prove the treatment is working and get reimbursed."

---

## 📋 DETAILED TOUR CONTENT (Tier 3: Guide)

### **Phase 1, Step 1: Baseline Metrics Dashboard**

**Selector:** `[data-tour="baseline-metrics"]`  
**Position:** `bottom`  
**Type:** `clinical`

```tsx
<div className="space-y-4">
  <p className="text-slate-300 leading-relaxed">
    These scores show how your patient is feeling right now, before treatment starts. 
    We use these numbers to predict how much support they'll need after the session.
  </p>
  <div className="space-y-3 border-t border-slate-700/50 pt-4">
    <div>
      <h5 className="text-xs font-black text-emerald-400 uppercase tracking-wider mb-1">
        PHQ-9 (Depression Score)
      </h5>
      <p className="text-xs text-slate-400 leading-relaxed">
        This test measures how depressed someone feels. Scores go from 0 (not depressed) 
        to 27 (very depressed). Higher scores mean they need more help.
      </p>
    </div>
    <div>
      <h5 className="text-xs font-black text-emerald-400 uppercase tracking-wider mb-1">
        GAD-7 (Anxiety Score)
      </h5>
      <p className="text-xs text-slate-400 leading-relaxed">
        This test measures how anxious someone feels. Scores go from 0 (calm) to 21 
        (very anxious). Higher scores mean they worry a lot.
      </p>
    </div>
    <div>
      <h5 className="text-xs font-black text-emerald-400 uppercase tracking-wider mb-1">
        ACE Score (Childhood Trauma)
      </h5>
      <p className="text-xs text-slate-400 leading-relaxed">
        This counts difficult experiences from childhood (like abuse or neglect). 
        Higher scores mean they might need extra support to process their experience.
      </p>
    </div>
  </div>
</div>
```

**[See full tour content specifications in attached document]**

---

## 🎯 TECHNICAL IMPLEMENTATION

### **Files to Modify:**

1. **`src/pages/ArcOfCareGodView.tsx`**
   - Add compass icon to each phase header
   - Add mini tour state management
   - Add auto-trigger logic on phase unlock

2. **`src/pages/ArcOfCareDashboard.tsx`**
   - Same updates as GodView

3. **`src/components/arc-of-care/ArcOfCareOnboarding.tsx`**
   - Add compass icon reminder section

4. **Create `src/components/arc-of-care/Phase1Tour.tsx`** (NEW)
   - 5-step guided tour for Phase 1

5. **Create `src/components/arc-of-care/Phase2Tour.tsx`** (NEW)
   - 6-step guided tour for Phase 2

6. **Create `src/components/arc-of-care/Phase3Tour.tsx`** (NEW)
   - 5-step guided tour for Phase 3

---

### **Auto-Trigger Logic:**

```tsx
// In ArcOfCareGodView.tsx
useEffect(() => {
  // Auto-trigger Phase 1 tour on first visit
  if (!localStorage.getItem('phase1TourSeen')) {
    setShowPhase1Tour(true);
  }
  
  // Auto-trigger Phase 2 tour when unlocked
  if (completedPhases.includes(1) && !localStorage.getItem('phase2TourSeen')) {
    setShowPhase2Tour(true);
  }
  
  // Auto-trigger Phase 3 tour when unlocked
  if (completedPhases.includes(2) && !localStorage.getItem('phase3TourSeen')) {
    setShowPhase3Tour(true);
  }
}, [completedPhases]);
```

---

### **Manual Re-Launch:**

```tsx
// Compass icon button in each phase header
<button
  onClick={() => setShowPhase1Tour(true)}
  className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 rounded-lg transition-all group"
  aria-label="Take guided tour of Phase 1"
>
  <Compass className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
</button>
```

---

## ✅ ACCEPTANCE CRITERIA

### **Visual Design:**
- [ ] Compass icon appears next to each phase header (Phase 1, 2, 3)
- [ ] Compass icon is color-coded by phase (emerald, amber, blue)
- [ ] Compass icon rotates 12° on hover
- [ ] Compass icon has proper aria-label for accessibility

### **Main Onboarding Modal:**
- [ ] "Look for the Compass Icon" reminder section added
- [ ] Reminder appears after "Key Benefits" section
- [ ] Reminder uses blue color scheme (info type)

### **Mini Tours:**
- [ ] Phase 1 tour has 5 steps with 9th grade reading level descriptions
- [ ] Phase 2 tour has 6 steps with 9th grade reading level descriptions
- [ ] Phase 3 tour has 5 steps with 9th grade reading level descriptions
- [ ] Each step has detailed content following Tier 3 (Guide) tooltip format

### **Auto-Trigger:**
- [ ] Phase 1 tour auto-triggers on first visit
- [ ] Phase 2 tour auto-triggers when Phase 1 is completed
- [ ] Phase 3 tour auto-triggers when Phase 2 is completed
- [ ] Tours can be dismissed with "Don't show again" checkbox

### **Manual Re-Launch:**
- [ ] Clicking compass icon launches tour anytime
- [ ] Tour state persists in localStorage
- [ ] Tours can be repeated unlimited times

### **Accessibility:**
- [ ] All compass icons have aria-labels
- [ ] Tours are keyboard accessible (Tab, Enter, Escape)
- [ ] Tour content has sufficient contrast (4.5:1 minimum)
- [ ] No color-only meaning (icons + text)

---

## 📊 SUCCESS METRICS

**Before (Current State):**
- Single onboarding modal (5 minutes, all at once)
- High cognitive load
- Users forget by Phase 3

**After (Target State):**
- Mini tours (2-3 min per phase, just-in-time)
- Low cognitive load
- Higher retention and completion rates

**Target Improvements:**
- **Phase completion rate:** 80% (from 60%)
- **Time to understand each phase:** <3 minutes (from 5+ minutes)
- **User satisfaction:** 90% (from 70%)

---

## 🚀 ESTIMATED TIME

**Total: 10-12 hours**

**Breakdown:**
- Compass icon integration (all 3 phases): 2 hours
- Main onboarding modal update: 1 hour
- Phase 1 tour (5 steps): 2.5 hours
- Phase 2 tour (6 steps): 3 hours
- Phase 3 tour (5 steps): 2.5 hours
- Auto-trigger logic: 1 hour
- Testing (all tours, all scenarios): 2 hours

---

## 📝 NOTES FOR LEAD

**Dependencies:**
- Requires existing `GuidedTour.tsx` component
- Requires existing `AdvancedTooltip.tsx` component
- Requires `Compass` icon from `lucide-react`

**Constraints:**
- MUST follow 9th grade reading level (per user request)
- MUST use Tier 3 (Guide) tooltip format (per TOOLTIP_LIBRARY.md)
- MUST use compass icon only (no text button)
- MUST be keyboard accessible

**Recommended Approach:**
1. Add compass icons to phase headers first
2. Create Phase 1 tour component and test
3. Replicate pattern for Phase 2 and Phase 3
4. Add auto-trigger logic
5. Update main onboarding modal
6. Test all scenarios (first visit, manual launch, dismiss, repeat)

---

**MARKETER SIGN-OFF:** Ready for LEAD architectural review and routing to DESIGNER/BUILDER.

**Priority:** P1 - High (Critical for user onboarding and Wellness Journey adoption)

---

## 🏗️ LEAD ARCHITECTURE

**Date:** 2026-02-16 19:38 PST  
**Reviewer:** LEAD

### Strategic Assessment

**Status:** ✅ **APPROVED** - Complete specs, ready for implementation

**Quality Score:** 9/10
- ✅ Complete technical specifications
- ✅ Code examples provided
- ✅ 9th grade reading level requirement clear
- ✅ Auto-trigger logic defined
- ✅ Accessibility requirements specified

### Key Requirements

1. **Compass Icon Integration:** Add to each phase header (emerald, amber, blue)
2. **Mini Tours:** Create 3 separate tour components (Phase 1, 2, 3)
3. **Auto-Trigger:** Tours launch automatically on phase unlock
4. **Manual Re-Launch:** Compass icon allows unlimited repeats
5. **Main Onboarding Update:** Add compass icon reminder section

### Routing Decision

**Phase: BUILD** ← **CURRENT PHASE**

**BUILDER's Task:**
1. Add compass icons to phase headers in `ArcOfCareGodView.tsx`
2. Create `Phase1Tour.tsx` component (5 steps)
3. Create `Phase2Tour.tsx` component (6 steps)
4. Create `Phase3Tour.tsx` component (5 steps)
5. Add auto-trigger logic (localStorage tracking)
6. Update `ArcOfCareOnboarding.tsx` with compass reminder
7. Test all scenarios (first visit, manual launch, dismiss, repeat)

**Implementation Priority:**
- **AFTER WO_011 is complete** (main guided tour must work first)
- Estimated time: 10-12 hours (2 days)

**When complete:** Move to `04_QA` for INSPECTOR review.

---

**LEAD STATUS:** ✅ Approved. Routed to BUILDER. **Complete WO_011 first, then proceed with this ticket.**
