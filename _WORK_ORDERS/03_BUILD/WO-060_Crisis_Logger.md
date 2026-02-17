---
id: WO-060
status: 03_BUILD
priority: P1 (Critical)
category: Feature / Safety / Grey Market / Legal Defense
owner: MARKETER
failure_count: 0
created_date: 2026-02-16T15:00:00-08:00
estimated_complexity: 5/10
estimated_timeline: 2-3 days
strategic_alignment: Grey Market "Phantom Shield" (Model #2)
phase: 1_STRATEGY
---

# User Request

Implement a **Crisis Logger** ("Black Box" flight recorder) to provide legal defense by creating a timestamped forensic trail of interventions during adverse events.

## Strategic Context

**From Research:** "In a courtroom, 'no notes' looks like negligence. If a client has a psychotic break, the practitioner usually panics and stops taking notes. The Crisis Logger creates a timestamped forensic trail that proves **Duty of Care** without requiring typing during high-stress moments."

**Impact:** Legal defense tool that proves the practitioner followed a "Standard of Care" protocol during an adverse event. This is the difference between "reckless endangerment" and "authorized practice."

---

## THE BLAST RADIUS (Authorized Target Area)

### New Files to Create

**Frontend Components:**
- `src/components/session/CrisisLogger.tsx` - Main one-tap logging interface
- `src/components/session/InterventionTimeline.tsx` - Visual timeline of events
- `src/components/session/VitalsMonitor.tsx` - Optional vitals tracking
- `src/types/crisis.ts` - TypeScript types

**Database:**
- `migrations/042_add_session_interventions.sql` - New table for intervention logging
- `migrations/043_add_crisis_functions.sql` - SQL functions for timeline generation

### Files to Modify

**Integration Points:**
- `src/pages/ProtocolBuilder.tsx` - Add Crisis Logger to session tab
- `src/pages/ArcOfCareGodView.tsx` - Display intervention timeline
- `src/components/arc-of-care/SessionCard.tsx` - Show crisis events

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Require typing during crisis (defeats the purpose)
- Store patient identity with intervention data
- Collect PHI/PII
- Make medical recommendations

**MUST:**
- Use large, one-tap buttons (80px minimum height)
- Provide haptic feedback (no audio)
- Work in low-light environments
- Calculate relative time (T+2 hours into session)
- Create immutable audit trail

---

## 📋 TECHNICAL SPECIFICATION

### Database Schema

**New Table: `session_interventions`**

```sql
CREATE TABLE session_interventions (
    intervention_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES log_sessions(session_id) ON DELETE CASCADE,
    practitioner_id UUID REFERENCES auth.users(id),
    
    -- THE "ONE-TAP" EVENTS
    -- Pre-defined enum for rapid logging during crisis
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN (
        'DOSE_ADMINISTERED',
        'VITAL_SIGNS_NORMAL',
        'VITAL_SIGNS_ELEVATED',
        'VERBAL_DEESCALATION',
        'PHYSICAL_COMFORT',
        'MUSIC_ADJUSTMENT',
        'LIGHTING_ADJUSTMENT',
        'TRIP_KILLER_BENZO',
        'TRIP_KILLER_ANTIPSYCHOTIC',
        'HYDRATION_PROVIDED',
        'EMERGENCY_CONTACT_NOTIFIED',
        'EMERGENCY_SERVICES_CALLED',
        'SESSION_TERMINATED_EARLY',
        'CUSTOM_NOTE'
    )),
    
    -- FORENSIC TIMING
    logged_at_utc TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- RELATIVE TIME (Crucial for clinical analysis)
    -- "Event happened 2 hours, 14 minutes into the session"
    seconds_since_ingestion INTEGER,
    
    -- AUTOMATED VITALS (Optional Bluetooth Integration)
    heart_rate_bpm INTEGER,
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    oxygen_saturation_percent INTEGER,
    
    -- OPTIONAL CONTEXT (For custom notes only)
    notes TEXT,
    
    -- METADATA
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_session_interventions_session_id ON session_interventions(session_id);
CREATE INDEX idx_session_interventions_logged_at ON session_interventions(logged_at_utc);

-- RLS Policies
ALTER TABLE session_interventions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own interventions"
    ON session_interventions FOR SELECT
    USING (auth.uid() = practitioner_id);

CREATE POLICY "Users can insert own interventions"
    ON session_interventions FOR INSERT
    WITH CHECK (auth.uid() = practitioner_id);

-- No UPDATE or DELETE - immutable audit trail
```

### SQL Functions

**Function: `get_intervention_timeline()`**

```sql
CREATE OR REPLACE FUNCTION get_intervention_timeline(p_session_id UUID)
RETURNS TABLE (
    intervention_id UUID,
    event_type VARCHAR,
    logged_at_utc TIMESTAMP WITH TIME ZONE,
    seconds_since_ingestion INTEGER,
    time_display VARCHAR,
    heart_rate_bpm INTEGER,
    blood_pressure VARCHAR,
    notes TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        si.intervention_id,
        si.event_type,
        si.logged_at_utc,
        si.seconds_since_ingestion,
        -- Format time display: "T+2h 14m" or "10:45 PM"
        CASE 
            WHEN si.seconds_since_ingestion IS NOT NULL THEN
                'T+' || (si.seconds_since_ingestion / 3600)::TEXT || 'h ' ||
                ((si.seconds_since_ingestion % 3600) / 60)::TEXT || 'm'
            ELSE
                TO_CHAR(si.logged_at_utc, 'HH12:MI AM')
        END AS time_display,
        si.heart_rate_bpm,
        -- Format blood pressure: "120/80"
        CASE 
            WHEN si.blood_pressure_systolic IS NOT NULL AND si.blood_pressure_diastolic IS NOT NULL THEN
                si.blood_pressure_systolic::TEXT || '/' || si.blood_pressure_diastolic::TEXT
            ELSE NULL
        END AS blood_pressure,
        si.notes
    FROM session_interventions si
    WHERE si.session_id = p_session_id
    ORDER BY si.logged_at_utc ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Function: `calculate_seconds_since_ingestion()`**

```sql
CREATE OR REPLACE FUNCTION calculate_seconds_since_ingestion(
    p_session_id UUID,
    p_current_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
RETURNS INTEGER AS $$
DECLARE
    v_dose_time TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Find the "DOSE_ADMINISTERED" event for this session
    SELECT logged_at_utc INTO v_dose_time
    FROM session_interventions
    WHERE session_id = p_session_id
      AND event_type = 'DOSE_ADMINISTERED'
    ORDER BY logged_at_utc ASC
    LIMIT 1;
    
    IF v_dose_time IS NULL THEN
        RETURN NULL;
    END IF;
    
    -- Calculate seconds elapsed
    RETURN EXTRACT(EPOCH FROM (p_current_time - v_dose_time))::INTEGER;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 🎨 COMPONENT DESIGN

### CrisisLogger Component

**File:** `src/components/session/CrisisLogger.tsx`

**Features:**
1. **One-Tap Event Buttons**
   - Large buttons (80px height minimum)
   - Long-press to confirm (prevents accidental taps)
   - Haptic feedback on press
   - No audio alerts

2. **Automatic Timestamp**
   - Logs UTC timestamp automatically
   - Calculates relative time from dose administration
   - No manual time entry required

3. **Optional Vitals Entry**
   - Quick number pad for heart rate, BP, O2 sat
   - Bluetooth integration for automatic vitals (future)
   - Collapsible section (not required)

4. **Visual Timeline**
   - Real-time display of logged events
   - Color-coded by severity
   - Shows relative time (T+2h 14m)

5. **"Panic Mode" UI**
   - Dark background (OLED black)
   - High contrast buttons
   - Minimal distractions
   - Large touch targets

**UI Layout:**

```
┌─────────────────────────────────────────────────┐
│  🚨 CRISIS LOGGER                               │
│  ───────────────────────────────────────────    │
│                                                 │
│  Session: Protocol #1234                        │
│  Time Since Dose: T+2h 14m                      │
│                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                                 │
│  QUICK LOG (Long-press to confirm)              │
│                                                 │
│  ┌─────────────────┐  ┌─────────────────┐     │
│  │ 🟢 VITALS OK    │  │ 🟡 VITALS HIGH  │     │
│  │                 │  │                 │     │
│  └─────────────────┘  └─────────────────┘     │
│                                                 │
│  ┌─────────────────┐  ┌─────────────────┐     │
│  │ 💬 VERBAL       │  │ 🤝 PHYSICAL     │     │
│  │ DE-ESCALATION   │  │ COMFORT         │     │
│  └─────────────────┘  └─────────────────┘     │
│                                                 │
│  ┌─────────────────┐  ┌─────────────────┐     │
│  │ 💊 BENZO        │  │ 💧 HYDRATION    │     │
│  │ ADMINISTERED    │  │ PROVIDED        │     │
│  └─────────────────┘  └─────────────────┘     │
│                                                 │
│  ┌─────────────────────────────────────┐       │
│  │ 🚑 EMERGENCY SERVICES CALLED        │       │
│  │                                     │       │
│  └─────────────────────────────────────┘       │
│                                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│                                                 │
│  TIMELINE (Last 5 events)                       │
│                                                 │
│  🟢 T+2h 14m - Vitals OK (HR: 85)               │
│  💬 T+1h 58m - Verbal De-escalation             │
│  🟡 T+1h 45m - Vitals Elevated (HR: 120)        │
│  💊 T+1h 42m - Benzo Administered               │
│  🟢 T+0h 00m - Dose Administered                │
│                                                 │
│  [View Full Timeline]  [Export Report]          │
└─────────────────────────────────────────────────┘
```

**Button Design (80px height, large touch target):**

```tsx
<button
  className="
    h-20 w-full
    bg-slate-800/50 border-2 border-slate-700
    rounded-2xl
    flex flex-col items-center justify-center
    active:scale-95 active:bg-slate-700/50
    transition-all duration-150
    touch-manipulation
  "
  onTouchStart={handleLongPressStart}
  onTouchEnd={handleLongPressEnd}
  onMouseDown={handleLongPressStart}
  onMouseUp={handleLongPressEnd}
>
  <span className="text-3xl mb-1">🟢</span>
  <span className="text-sm font-bold text-slate-300">VITALS OK</span>
</button>
```

---

## ✅ ACCEPTANCE CRITERIA

### Functionality
- [ ] User can log events with one tap (long-press to confirm)
- [ ] Timestamp automatically recorded (UTC)
- [ ] Relative time calculated from dose administration
- [ ] Optional vitals entry works (HR, BP, O2 sat)
- [ ] Timeline displays events in chronological order
- [ ] Events are immutable (no edit/delete)
- [ ] Export report generates PDF with timeline

### Database
- [ ] `session_interventions` table created
- [ ] RLS policies applied (users see only own interventions)
- [ ] `get_intervention_timeline()` function works
- [ ] `calculate_seconds_since_ingestion()` function works
- [ ] Immutable audit trail (no UPDATE/DELETE policies)

### UI/UX
- [ ] Large buttons (80px minimum height)
- [ ] Long-press confirmation prevents accidental taps
- [ ] Haptic feedback on button press
- [ ] No audio alerts (visual/haptic only)
- [ ] Dark background for low-light use
- [ ] High contrast colors
- [ ] Timeline is easy to read
- [ ] Responsive at all breakpoints

### Accessibility
- [ ] Keyboard navigation works
- [ ] ARIA labels for all buttons
- [ ] Screen reader announces events
- [ ] Minimum 12px fonts
- [ ] Sufficient color contrast
- [ ] Visual indicators beyond color (icons + text)

### Security
- [ ] No patient identity stored with interventions
- [ ] No PHI/PII collected
- [ ] RLS policies prevent cross-user access
- [ ] Audit trail is immutable

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY (WCAG 2.1 AA)
- Minimum 12px fonts
- Keyboard accessible
- Screen reader friendly
- Color contrast compliant
- Visual indicators beyond color (icons + text)

### SECURITY & PRIVACY
- No PHI/PII collection
- Immutable audit trail
- RLS policies enforced
- No patient names in logs

### LEGAL
- Disclaimer: "For documentation purposes only. Not medical advice."
- Positioning as "audit defense tool" not "medical device"
- No treatment recommendations

---

## 🚦 Status

**INBOX** - Awaiting LEAD architectural review and assignment

---

## 📖 NOTES

**Strategic Importance:**
This is the **legal defense tool** for grey market practitioners. Research documents emphasize that "no notes" during a crisis looks like negligence in court. The Crisis Logger solves this by making documentation effortless during high-stress moments.

**Implementation Priority:**
1. Database schema (foundation)
2. One-tap event logging (core functionality)
3. Timeline display (visual feedback)
4. Relative time calculation (clinical value)
5. Vitals tracking (optional enhancement)
6. PDF export (legal documentation)

**Future Enhancements:**
- Bluetooth vitals integration (heart rate monitors, pulse oximeters)
- Voice-to-text for custom notes (hands-free)
- Automatic session summary generation
- Integration with insurance dossier generator

---

## Dependencies

**Prerequisites:**
- `log_sessions` table exists
- Session tracking implemented

**Related Features:**
- Protocol Builder (creates sessions)
- Wellness Journey (displays intervention timeline)
- Data Export (PDF generation)

---

## Estimated Timeline

- **Database schema:** 2-3 hours
- **CrisisLogger component:** 6-8 hours
- **InterventionTimeline component:** 3-4 hours
- **Integration with session tracking:** 2 hours
- **PDF export:** 2-3 hours
- **Testing:** 2-3 hours

**Total:** 17-23 hours (2-3 days)

---

## 🏗️ LEAD ARCHITECTURE

### Strategic Context

This ticket is **2 of 4** in the "Grey Market Phantom Shield" initiative. See master architecture: `.agent/handoffs/GREY_MARKET_PHANTOM_SHIELD_ARCHITECTURE.md`

**Why This Matters:**
From research: "In a courtroom, 'no notes' looks like negligence. The Crisis Logger creates a timestamped forensic trail that proves Duty of Care."

**This is the legal defense tool for grey market practitioners.**

### Routing Decision: MARKETER FIRST

**Phase 1: Strategy & Messaging (MARKETER)** ← **CURRENT PHASE**

**MARKETER must define:**

1. **Value Proposition**
   - Target: Practitioners afraid of legal liability
   - Pain: "No notes during crisis = negligence in court"
   - Solution: One-tap event logging with immutable audit trail
   - Metric: "Proves Standard of Care in 30 seconds"

2. **Messaging Framework**
   - Hero: "Your Legal Black Box"
   - Supporting: "Document interventions without typing during crisis"
   - CTA: "Start Crisis Log"
   - Objections: "I don't have time" → "One tap, auto-timestamp"

3. **Legal Positioning**
   - Disclaimer: "For documentation purposes only. Not medical advice."
   - Framing: "Audit defense tool" not "medical device"
   - Risk: Avoid "prevents lawsuits" (implies legal advice)

### MARKETER Deliverables

Create in this ticket under `## MARKETER DELIVERABLES`:
- [ ] Value Proposition Document
- [ ] Messaging Framework
- [ ] Legal Disclaimers
- [ ] Conversion Strategy

**When complete:** Move to `04_QA` for LEAD review.

**Estimated Time:** 1-2 days

---

**LEAD STATUS:** ✅ Routed to MARKETER for Phase 1. See `.agent/handoffs/GREY_MARKET_PHANTOM_SHIELD_ARCHITECTURE.md`.

**INSPECTOR STATUS:** ✅ Work order created. Awaiting LEAD triage.
