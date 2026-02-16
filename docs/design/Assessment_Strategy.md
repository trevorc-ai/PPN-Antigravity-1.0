# MEQ/EDI/CEQ Assessment Strategy
## Aligning with PAT Longitudinal Journey

### Current State (Week 3 - MVP)
✅ **What's Working:**
- Standardized instruments (MEQ-30, EDI, CEQ)
- Progress tracking & auto-save
- Mobile-friendly design
- Real-time score calculation

⚠️ **Critical Gaps:**
1. **Survey Fatigue** - 64 total questions administered post-session
2. **No Visual Feedback Loop** - Patient doesn't see correlation to baseline
3. **No Adaptive Assessment** - Everyone gets full battery regardless of need
4. **No Integration with Arc of Care** - Assessments feel disconnected from journey

---

## Strategic Improvements (Phases)

### **Phase 1: Quick Wins** ✅ COMPLETE
- [x] Bold question text for emphasis
- [x] Softer colors (slate-200 instead of white)
- [x] Reduce pages (3 instead of 6)
- [ ] Add "Why we're asking" tooltips
- [ ] Improve button contrast

### **Phase 2: Reduce Survey Fatigue** 🎯 NEXT
**Problem:** Patients are exhausted post-session. 64 questions is too much.

**Solution: Adaptive Assessment**
```
┌─────────────────────────────────────┐
│ QUICK MODE (Default)                │
│ ─────────────────────────────────   │
│ MEQ-30 Short Form: 5 questions      │
│ EDI Brief: 2 questions              │
│ CEQ Brief: 3 questions              │
│ ─────────────────────────────────   │
│ Total: 10 questions (~2 minutes)    │
└─────────────────────────────────────┘
         ↓ (If anomalies detected)
┌─────────────────────────────────────┐
│ EXPANDED MODE (Triggered)           │
│ ─────────────────────────────────   │
│ Full MEQ-30: 30 questions           │
│ Full EDI: 8 questions               │
│ Full CEQ: 26 questions              │
│ ─────────────────────────────────   │
│ Total: 64 questions (~11 minutes)   │
└─────────────────────────────────────┘
```

**Trigger Logic:**
- If Quick Mode MEQ score < 40 → Expand to full MEQ-30 (investigate low mystical experience)
- If Quick Mode CEQ score > 60 → Expand to full CEQ (investigate challenging experience)
- If baseline PHQ-9 > 20 → Always use Full Mode (research/insurance requirement)

**Implementation:**
1. Create `meq30-short.config.ts` (5 core questions)
2. Create `edi-brief.config.ts` (2 core questions)
3. Create `ceq-brief.config.ts` (3 core questions)
4. Add logic to AssessmentForm to trigger expansion

---

### **Phase 3: Visual Feedback Loop** 🎯 PRIORITY
**Problem:** Patient fills out form → sees score → doesn't understand what it means.

**Solution: Contextual Intelligence**

**Example Flow:**
```
┌─────────────────────────────────────────────────────┐
│ MEQ-30 Complete! Your Score: 75/100                 │
│ ─────────────────────────────────────────────────   │
│ 🎯 What This Means:                                 │
│                                                      │
│ ✨ Complete Mystical Experience                     │
│                                                      │
│ Your score indicates you experienced:                │
│ • Unity with ultimate reality                        │
│ • Transcendence of time and space                   │
│ • Deep sense of sacredness                          │
│                                                      │
│ 📊 Correlation to Your Baseline:                    │
│ • Your PHQ-9 was 21 (Severe Depression)             │
│ • Patients with MEQ ≥60 + PHQ ≥20 have:             │
│   → 87% remission rate at 6 months                  │
│   → Average improvement: -16 points                 │
│                                                      │
│ 🔮 Your Predicted Outcome:                          │
│ Based on 2,847 similar patients:                    │
│ • 6-month PHQ-9: 5 (Minimal symptoms)               │
│ • Likelihood of sustained benefit: 87%              │
│                                                      │
│ 🎯 Next Steps:                                      │
│ • Continue with integration protocol                │
│ • Daily pulse checks (1-tap, 30 seconds)            │
│ • Full PHQ-9 at Days 7, 14, 30, 60, 90, 180        │
└─────────────────────────────────────────────────────┘
```

**Implementation:**
1. Create `AssessmentResults.tsx` component
2. Add correlation logic (MEQ + Baseline → Predicted Outcome)
3. Integrate with God View (show updated Arc of Care)

---

### **Phase 4: Integration with Arc of Care** 🎯 CRITICAL
**Problem:** Assessments feel like "homework" instead of part of the healing journey.

**Solution: Seamless Journey Integration**

**Current Flow (Disconnected):**
```
God View → [separate page] → MEQ-30 → [separate page] → Results → [back to God View]
```

**Better Flow (Integrated):**
```
God View (Phase 2 card shows "Complete Post-Session Assessments")
    ↓ (Click)
Assessment Modal (overlay on God View)
    ↓ (Complete)
God View updates in real-time (Phase 2 card shows MEQ-30: 75/100)
    ↓ (Auto-advance)
Phase 3 card unlocks (Integration begins)
```

**Implementation:**
1. Convert MEQ30Page to modal component
2. Add "Complete Assessments" button to Phase 2 card in God View
3. Update God View state when assessment completes
4. Show visual "unlock" animation for Phase 3

---

### **Phase 5: Pulse Checks (Daily Micro-Checkins)** 🎯 LONG-TERM
**Problem:** Full PHQ-9 every week = survey fatigue → patient drops off.

**Solution: 1-Tap Pulse Checks**

**Daily Pulse (30 seconds):**
```
┌─────────────────────────────────────┐
│ Good morning, John! 🌅              │
│                                      │
│ How connected do you feel today?    │
│                                      │
│ 😔  😐  🙂  😊  🤩                  │
│  1   2   3   4   5                  │
│                                      │
│ [Tap to answer]                     │
└─────────────────────────────────────┘
```

**Trigger Logic:**
- If pulse < 3 for 2 consecutive days → Trigger full PHQ-9
- If pulse = 5 for 7 consecutive days → Celebrate! Show progress chart

**Implementation:**
1. Create `PulseCheck.tsx` component
2. Add SMS/push notification trigger
3. Store pulse data in `log_pulse_checks` table
4. Add pulse trend visualization to God View

---

## Summary: The Vision

**Current State:**
- ✅ Functional assessment forms
- ⚠️ Feels like "homework"
- ⚠️ No connection to patient journey

**Target State:**
- ✅ Adaptive (Quick Mode for 80% of patients)
- ✅ Contextual (Shows correlation to baseline)
- ✅ Integrated (Part of Arc of Care, not separate)
- ✅ Engaging (Visual feedback, gamification)
- ✅ Sustainable (Pulse checks prevent drop-off)

**Key Metrics:**
- **Completion Rate:** 95%+ (vs. industry standard 60%)
- **Time to Complete:** <3 minutes (vs. current 11 minutes)
- **Patient Satisfaction:** "This helped me understand my experience"
- **Clinical Value:** "This data changed my treatment plan"

---

## Next Steps

**Immediate (This Session):**
1. ✅ Fix text styling (bold, softer colors)
2. ✅ Reduce pages (3 instead of 6)
3. 🎯 Add "Why we're asking" tooltips
4. 🎯 Create EDI and CEQ configs

**Short-Term (Next Session):**
1. Create MEQ-30 Short Form (5 questions)
2. Add adaptive logic (Quick → Full)
3. Create AssessmentResults component with contextual intelligence

**Long-Term (Future):**
1. Integrate assessments into God View (modal instead of separate page)
2. Add pulse checks (daily 1-tap)
3. Build predictive analytics (MEQ + Baseline → Outcome)

---

**The Goal:** Move from "filling out forms" to "understanding your healing journey."
