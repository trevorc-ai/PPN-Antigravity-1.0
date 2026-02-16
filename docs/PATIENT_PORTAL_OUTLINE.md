# Patient Portal vs. Clinician Portal - Feature Separation

**Document:** Patient Portal Feature Outline  
**Date:** February 16, 2026  
**Purpose:** Define which Wellness Journey elements belong in a patient-facing portal

---

## 🎯 Portal Separation Strategy

### Core Principle
**Patients see their own journey. Clinicians see clinical insights, comparisons, and predictive analytics.**

---

## 📊 Feature Matrix

| Feature | Patient Portal | Clinician Portal | Notes |
|---------|---------------|------------------|-------|
| **Personal Journey Timeline** | ✅ Yes | ✅ Yes | Patient sees their own; Clinician sees patient's |
| **Assessment Scores** | ✅ Yes (simplified) | ✅ Yes (detailed) | Patient sees trends; Clinician sees raw scores |
| **Progress Charts** | ✅ Yes | ✅ Yes | Patient sees symptom improvement; Clinician sees all metrics |
| **Comparative Benchmarks** | ❌ No | ✅ Yes | Clinician-only (statistical insights) |
| **AI Predictions** | ❌ No | ✅ Yes | Clinician-only (outcome predictions) |
| **Statistical Insights** | ❌ No | ✅ Yes | Clinician-only (cohort data) |
| **Safety Events** | ⚠️ Limited | ✅ Yes | Patient sees resolved; Clinician sees all details |
| **Medication Details** | ✅ Yes | ✅ Yes | Patient sees their protocol; Clinician sees all options |
| **Integration Goals** | ✅ Yes | ✅ Yes | Patient sets goals; Clinician tracks progress |
| **Session Notes** | ⚠️ Limited | ✅ Yes | Patient sees summaries; Clinician sees full notes |
| **Export to PDF** | ✅ Yes | ✅ Yes | Patient exports their journey; Clinician exports reports |

---

## 🧑‍⚕️ CLINICIAN PORTAL (Current Implementation)

### What Stays Clinician-Only

#### 1. **Statistical Insights Panel** ❌ Patient
```typescript
// CLINICIAN ONLY
<div className="p-3 bg-slate-900/40 rounded-lg">
  <p className="text-emerald-400 text-sm font-bold">
    72% achieved remission (PHQ-9 < 5)
  </p>
  <p className="text-slate-500 text-xs mt-1">
    At 6-month follow-up
  </p>
</div>
```
**Why:** Aggregate data from other patients; not relevant to individual patient.

#### 2. **Comparative Benchmarks** ❌ Patient
```typescript
// CLINICIAN ONLY
<div className="flex items-center gap-2 text-xs">
  <span className="w-16 text-slate-500">Clinic</span>
  <div className="flex-1 h-2 bg-slate-900/60 rounded-full overflow-hidden">
    <div className="h-full bg-slate-400" style={{ width: `${(18 / 27) * 100}%` }} />
  </div>
  <span className="w-8 text-slate-400">18</span>
</div>
```
**Why:** Comparing patient to clinic/global averages could be discouraging or misleading.

#### 3. **AI Outcome Predictions** ❌ Patient
```typescript
// CLINICIAN ONLY
<div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
  <p className="text-blue-300 text-sm font-semibold">Outcome Prediction</p>
  <p className="text-emerald-400 text-sm">87% likelihood of remission</p>
</div>
```
**Why:** Predictions are for clinical decision-making; could create false expectations.

#### 4. **Raw Safety Event Details** ❌ Patient
```typescript
// CLINICIAN ONLY
<div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
  <p className="text-red-300 text-xs font-semibold">Safety Events</p>
  <p className="text-slate-300 text-xs">
    • 10:45 AM - Elevated heart rate (125 bpm)
    • 11:30 AM - Anxiety spike (resolved with grounding)
  </p>
</div>
```
**Why:** Detailed clinical observations; patient sees simplified "2 events (resolved)".

#### 5. **ACE Score Details** ❌ Patient
```typescript
// CLINICIAN ONLY - Show full ACE breakdown
<div className="space-y-2">
  <p className="text-xs text-slate-400">ACE Breakdown:</p>
  <p className="text-xs text-slate-300">• Emotional abuse: Yes</p>
  <p className="text-xs text-slate-300">• Physical neglect: Yes</p>
  <p className="text-xs text-slate-300">• Household dysfunction: Yes</p>
</div>
```
**Why:** Sensitive trauma history; patient already knows their own history.

---

## 👤 PATIENT PORTAL (New Implementation)

### What Patients Should See

#### 1. **Personal Journey Timeline** ✅ Patient
```typescript
// PATIENT VERSION - Simplified, encouraging
<div className="bg-gradient-to-br from-purple-500/10 to-purple-900/10 border-2 border-purple-500/50 rounded-2xl p-5 space-y-2.5">
  <h2 className="text-2xl font-bold text-slate-200">My Wellness Journey</h2>
  <p className="text-slate-400 text-sm">Track your progress through healing</p>
  
  {/* Phase 1: Preparation */}
  <div className="p-4 bg-slate-900/40 rounded-lg">
    <h3 className="text-lg font-bold text-purple-300">Preparation</h3>
    <p className="text-slate-400 text-sm">Oct 1-14, 2025 • 2 weeks</p>
    <div className="mt-3">
      <p className="text-emerald-400 text-sm">✓ Completed baseline assessments</p>
      <p className="text-emerald-400 text-sm">✓ Set intentions</p>
      <p className="text-emerald-400 text-sm">✓ Prepared mindfully</p>
    </div>
  </div>
</div>
```

#### 2. **Symptom Progress Chart** ✅ Patient
```typescript
// PATIENT VERSION - Focus on improvement, not raw scores
<div className="p-4 bg-slate-900/40 rounded-lg">
  <h3 className="text-lg font-bold text-emerald-300">Your Progress</h3>
  <p className="text-slate-400 text-sm mb-3">Depression symptoms over time</p>
  
  {/* Chart showing improvement */}
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-400">Before session:</span>
      <div className="flex-1 h-3 bg-red-500/20 rounded-full">
        <div className="h-full bg-red-400 rounded-full" style={{ width: '78%' }} />
      </div>
      <span className="text-sm text-red-400">High</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-400">Today:</span>
      <div className="flex-1 h-3 bg-emerald-500/20 rounded-full">
        <div className="h-full bg-emerald-400 rounded-full" style={{ width: '19%' }} />
      </div>
      <span className="text-sm text-emerald-400">Mild</span>
    </div>
  </div>
  
  <p className="text-emerald-400 text-sm font-bold mt-3">
    🎉 You've improved by 76%!
  </p>
</div>
```

#### 3. **Integration Goals & Milestones** ✅ Patient
```typescript
// PATIENT VERSION - Empowering, action-oriented
<div className="p-4 bg-slate-900/40 rounded-lg">
  <h3 className="text-lg font-bold text-blue-300">Integration Goals</h3>
  <p className="text-slate-400 text-sm mb-3">Your commitments to lasting change</p>
  
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <CheckCircle className="w-5 h-5 text-emerald-400" />
      <span className="text-slate-200 text-sm">Reconnected with father</span>
      <span className="text-slate-500 text-xs ml-auto">Day 45</span>
    </div>
    <div className="flex items-center gap-2">
      <CheckCircle className="w-5 h-5 text-emerald-400" />
      <span className="text-slate-200 text-sm">Started meditation practice</span>
      <span className="text-slate-500 text-xs ml-auto">Day 12</span>
    </div>
    <div className="flex items-center gap-2">
      <Circle className="w-5 h-5 text-slate-500" />
      <span className="text-slate-400 text-sm">Join support group</span>
      <span className="text-slate-500 text-xs ml-auto">In progress</span>
    </div>
  </div>
</div>
```

#### 4. **Session Experience Summary** ✅ Patient
```typescript
// PATIENT VERSION - Reflective, meaningful
<div className="p-4 bg-slate-900/40 rounded-lg">
  <h3 className="text-lg font-bold text-amber-300">Your Session Experience</h3>
  <p className="text-slate-400 text-sm mb-3">Oct 15, 2025</p>
  
  <div className="space-y-3">
    <div>
      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Mystical Experience</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-slate-900/60 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-400" style={{ width: '75%' }} />
        </div>
        <span className="text-sm text-emerald-400 font-bold">High</span>
      </div>
      <p className="text-xs text-slate-400 mt-1">
        You experienced profound unity and transcendence
      </p>
    </div>
    
    <div>
      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Challenging Moments</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-slate-900/60 rounded-full overflow-hidden">
          <div className="h-full bg-amber-400" style={{ width: '31%' }} />
        </div>
        <span className="text-sm text-amber-400 font-bold">Moderate</span>
      </div>
      <p className="text-xs text-slate-400 mt-1">
        You navigated difficult emotions with courage
      </p>
    </div>
  </div>
  
  <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
    <p className="text-emerald-300 text-sm">
      ✓ Session completed safely with support
    </p>
  </div>
</div>
```

#### 5. **Daily Check-Ins** ✅ Patient
```typescript
// PATIENT VERSION - Simple, encouraging
<div className="p-4 bg-slate-900/40 rounded-lg">
  <h3 className="text-lg font-bold text-blue-300">Daily Check-In</h3>
  <p className="text-slate-400 text-sm mb-3">How are you feeling today?</p>
  
  <div className="space-y-3">
    <div>
      <label className="text-sm text-slate-300 mb-2 block">Mood</label>
      <div className="flex gap-2">
        <button className="flex-1 p-3 bg-slate-800/50 hover:bg-emerald-500/20 border border-slate-700 hover:border-emerald-500/50 rounded-lg transition-all">
          <span className="text-2xl">😊</span>
          <p className="text-xs text-slate-400 mt-1">Good</p>
        </button>
        <button className="flex-1 p-3 bg-slate-800/50 hover:bg-amber-500/20 border border-slate-700 hover:border-amber-500/50 rounded-lg transition-all">
          <span className="text-2xl">😐</span>
          <p className="text-xs text-slate-400 mt-1">Okay</p>
        </button>
        <button className="flex-1 p-3 bg-slate-800/50 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/50 rounded-lg transition-all">
          <span className="text-2xl">😔</span>
          <p className="text-xs text-slate-400 mt-1">Struggling</p>
        </button>
      </div>
    </div>
    
    <div>
      <label className="text-sm text-slate-300 mb-2 block">Sleep Quality</label>
      <input 
        type="range" 
        min="1" 
        max="10" 
        className="w-full"
      />
      <div className="flex justify-between text-xs text-slate-500 mt-1">
        <span>Poor</span>
        <span>Excellent</span>
      </div>
    </div>
  </div>
</div>
```

#### 6. **Resources & Support** ✅ Patient
```typescript
// PATIENT VERSION - Helpful, accessible
<div className="p-4 bg-slate-900/40 rounded-lg">
  <h3 className="text-lg font-bold text-purple-300">Support Resources</h3>
  <p className="text-slate-400 text-sm mb-3">Here when you need us</p>
  
  <div className="space-y-2">
    <button className="w-full p-3 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 rounded-lg flex items-center gap-3 transition-all">
      <MessageCircle className="w-5 h-5 text-blue-400" />
      <div className="text-left">
        <p className="text-sm font-semibold text-blue-300">Message Your Therapist</p>
        <p className="text-xs text-slate-500">Response within 24 hours</p>
      </div>
    </button>
    
    <button className="w-full p-3 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 rounded-lg flex items-center gap-3 transition-all">
      <Book className="w-5 h-5 text-emerald-400" />
      <div className="text-left">
        <p className="text-sm font-semibold text-emerald-300">Integration Exercises</p>
        <p className="text-xs text-slate-500">Guided practices for healing</p>
      </div>
    </button>
    
    <button className="w-full p-3 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-lg flex items-center gap-3 transition-all">
      <AlertCircle className="w-5 h-5 text-red-400" />
      <div className="text-left">
        <p className="text-sm font-semibold text-red-300">Crisis Support</p>
        <p className="text-xs text-slate-500">24/7 immediate help</p>
      </div>
    </button>
  </div>
</div>
```

---

## 🔐 Data Access & Privacy

### Patient Portal Access Rules

| Data Type | Patient Can See | Patient Cannot See |
|-----------|----------------|-------------------|
| **Own Scores** | ✅ Current + trends | ❌ Raw clinical notes |
| **Progress** | ✅ Improvement % | ❌ Comparison to others |
| **Goals** | ✅ Own goals + milestones | ❌ Clinician's treatment plan |
| **Session** | ✅ Experience summary | ❌ Detailed safety events |
| **Medication** | ✅ Their protocol | ❌ Alternative protocols |
| **History** | ✅ Own timeline | ❌ Statistical cohort data |

---

## 🎨 Design Differences

### Clinician Portal (Current)
- **Tone:** Clinical, analytical, data-dense
- **Colors:** Red/amber/emerald for severity
- **Metrics:** Raw scores, percentages, statistical significance
- **Layout:** Dense, multi-column, collapsible sections

### Patient Portal (Proposed)
- **Tone:** Encouraging, empowering, hopeful
- **Colors:** Purple/blue/emerald for growth
- **Metrics:** Improvement %, milestones, qualitative descriptions
- **Layout:** Spacious, single-column, clear hierarchy

---

## 📱 Patient Portal Navigation

```typescript
// Proposed Patient Portal Sidebar
const patientSections = [
  {
    title: 'My Journey',
    items: [
      { label: 'Dashboard', icon: 'home', path: '/patient/dashboard' },
      { label: 'My Progress', icon: 'trending-up', path: '/patient/progress' },
      { label: 'Goals & Milestones', icon: 'target', path: '/patient/goals' },
    ]
  },
  {
    title: 'Daily Practice',
    items: [
      { label: 'Check-In', icon: 'heart', path: '/patient/checkin' },
      { label: 'Integration Exercises', icon: 'book', path: '/patient/exercises' },
      { label: 'Journal', icon: 'edit', path: '/patient/journal' },
    ]
  },
  {
    title: 'Support',
    items: [
      { label: 'Message Therapist', icon: 'message-circle', path: '/patient/messages' },
      { label: 'Resources', icon: 'book-open', path: '/patient/resources' },
      { label: 'Crisis Support', icon: 'alert-circle', path: '/patient/crisis' },
    ]
  },
  {
    title: 'Account',
    items: [
      { label: 'Settings', icon: 'settings', path: '/patient/settings' },
      { label: 'Privacy', icon: 'lock', path: '/patient/privacy' },
    ]
  }
];
```

---

## 🚀 Implementation Roadmap

### Phase 1: Core Patient Portal (2-3 weeks)
- [ ] Create patient dashboard layout
- [ ] Implement progress visualization (simplified)
- [ ] Add goals & milestones tracker
- [ ] Build daily check-in form

### Phase 2: Engagement Features (2-3 weeks)
- [ ] Integration exercises library
- [ ] Journaling system
- [ ] Messaging with therapist
- [ ] Resource library

### Phase 3: Advanced Features (3-4 weeks)
- [ ] Mobile app (React Native)
- [ ] Push notifications for check-ins
- [ ] Offline mode for journaling
- [ ] Export personal journey to PDF

---

## 🎯 Success Metrics

### Patient Engagement
- **Daily Check-In Rate:** Target 70%+
- **Goal Completion:** Target 60%+
- **Resource Usage:** Target 40%+
- **Session Satisfaction:** Target 4.5/5+

### Clinical Outcomes
- **Treatment Adherence:** Target 85%+
- **Integration Quality:** Measured via pulse checks
- **Long-term Remission:** Target 70%+ at 6 months

---

## 📝 Key Takeaways

### ✅ **Patient Portal Should:**
- Empower patients with their own data
- Focus on progress and improvement
- Provide actionable resources
- Encourage daily engagement
- Maintain privacy and security

### ❌ **Patient Portal Should NOT:**
- Show comparative statistics
- Display raw clinical notes
- Include AI predictions
- Reveal sensitive trauma details without context
- Overwhelm with data

---

**Next Steps:** Create patient portal wireframes and user stories.
