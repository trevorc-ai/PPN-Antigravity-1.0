---
id: WO-086
status: 03_BUILD
priority: P1 (Critical - Core Feature)
category: Feature Development
audience: Clinical Providers
implementation_order: 13
owner: BUILDER
failure_count: 0
created: 2026-02-17 16:00 PST
lead_reviewed: 2026-02-17 22:19 PST
---

# Implement Minute-by-Minute Session Timeline Tracking

## USER REQUEST (Verbatim)

From Session Tracking Analysis (WO-084):

User requested analysis of session tracking requirements from SESSIONS.md and Doctor_Interview.md. Analysis identified **GAP 1: Minute-by-Minute Timeline Tracking** as a critical missing feature.

---

## PRODDY STRATEGIC ANALYSIS (2026-02-17 16:00 PST)

**Strategic Concern:** This is a **CRITICAL P1 CORE FEATURE** that enables the "art" of psychedelic therapy described in the doctor interview.

### **Business Impact:**
1. **Clinical Decision Support:** Enables real-time pharmacodynamic decision-making
2. **Documentation Quality:** Provides minute-level audit trail for liability protection
3. **Research Value:** Time-stamped data enables correlation analysis (vitals ↔ subjective experience)
4. **Competitive Advantage:** Doctor's "wishlist" feature - no existing solutions offer this

### **Technical Feasibility:**
- **Complexity:** LOW - clone proven SessionVitalsForm pattern
- **Risk:** LOW - repeatable form pattern already validated
- **Effort:** 1-2 weeks (similar to SessionVitalsForm)

### **Market Validation:**
- **Doctor Interview:** "I want a working template to plug information into... down to the minute, down to the second"
- **SESSIONS.md:** Describes predetermined monitoring intervals (every 30 min, hourly)
- **Use Case:** Doctor needs to log "T+1:30 - No breakthrough, decision point" → "T+2:05 - Added 75mg ketamine IM"

**PRODDY RECOMMENDATION:** ✅ **APPROVE IMMEDIATELY** - This is the doctor's #1 wishlist feature.

---

## PROBLEM STATEMENT

**Current State:**  
SessionTimelineForm exists but only tracks "key events" - not continuous minute-by-minute timeline.

**Gap:**  
Providers need to log every clinical action and observation with precise timestamps to:
1. Make **pharmacodynamic decisions** (e.g., "No breakthrough at T+1:30, add ketamine?")
2. Create **legal audit trail** (minute-level documentation for liability protection)
3. Enable **research correlation** (link vital spikes to subjective experiences)

**Doctor Quote:**
> "We're on the fly... we've got a limited period of time... down to the minute, down to the second, down to the hour"

**Example Use Case (from Doctor Interview):**
- **T+0:00** - 125mg MDMA oral administration
- **T+0:20** - 20mg test dose administered
- **T+1:30** - No breakthrough, decision point
- **T+1:35** - 125mg MDMA per rectal (total 250mg)
- **T+2:00** - Still no breakthrough, vital check (HR 122, BP elevated)
- **T+2:05** - Clinical decision: add 75mg ketamine IM
- **T+2:10** - Ketamine administered
- **T+2:45** - Breakthrough achieved

---

## SOLUTION OVERVIEW

Create **SessionTimelineForm** by cloning SessionVitalsForm pattern with these changes:

### **Replace Vital Fields With:**
- `event_type` (dropdown: Dose Admin, Vital Check, Patient Observation, Clinical Decision, Music Change, Touch Consent, Other)
- `event_description` (text area, 500 char max)
- `timestamp` (datetime-local input + "Record Now" button)

### **Keep SessionVitalsForm Pattern:**
- ✅ Repeatable form (add multiple timeline events)
- ✅ Auto-save with 500ms debounce
- ✅ "Record Now" button for instant timestamp
- ✅ Mobile responsive (1→3 col grid)
- ✅ WCAG AAA accessible
- ✅ Color-coded event types (instead of vital status)

---

## DETAILED REQUIREMENTS

### **1. Event Type Dropdown**

**Field Specifications:**
- **Field Name:** `event_type`
- **Type:** Dropdown (required)
- **Options:**
  - 🟦 Dose Administration (blue badge)
  - 🟩 Vital Check (green badge)
  - 🟨 Patient Observation (yellow badge)
  - 🟧 Clinical Decision (orange badge)
  - 🟪 Music Change (purple badge)
  - 🟥 Touch Consent (red badge)
  - ⚪ Other (gray badge)
- **Color Coding:** Each event type gets a distinct color badge (like vital status colors)
- **Tooltip:** "Select the type of event to categorize this timeline entry."

**UI Example:**
```
[Dropdown: Dose Administration ▼]
Badge: 🟦 Dose Administration
```

---

### **2. Event Description**

**Field Specifications:**
- **Field Name:** `event_description`
- **Type:** Text area (multi-line)
- **Max Length:** 500 characters
- **Required:** Yes
- **Placeholder:** "e.g., 125mg MDMA oral administration" or "Patient reports no breakthrough, HR 122, baseline 84"
- **Tooltip:** "Describe what happened at this moment. Be specific for legal documentation."

**UI Example:**
```
┌─────────────────────────────────────────┐
│ 125mg MDMA oral administration          │
│                                         │
│                                         │
└─────────────────────────────────────────┘
Character count: 34 / 500
```

---

### **3. Timestamp Field**

**Field Specifications:**
- **Field Name:** `timestamp`
- **Type:** datetime-local input
- **Required:** Yes
- **Default:** Current time (when "Record Now" clicked)
- **Format:** YYYY-MM-DDTHH:MM (ISO 8601)
- **"Record Now" Button:** Auto-fills current timestamp (same as SessionVitalsForm)

**UI Example:**
```
[2026-02-17T14:30] [Now]
```

---

### **4. Quick-Entry Event Buttons**

**Feature:** Pre-populate event type + description templates

**Buttons:**
- 🟦 **"Dose Given"** → Type: Dose Administration, Description: "[Substance] [Dose] [Route] administered"
- 🟩 **"Vital Check"** → Type: Vital Check, Description: "HR [__], BP [__]/[__], SpO2 [__]%"
- 🟨 **"Patient Spoke"** → Type: Patient Observation, Description: "Patient reported: [__]"
- 🟧 **"Decision Point"** → Type: Clinical Decision, Description: "Clinical decision: [__]"
- 🟪 **"Music Changed"** → Type: Music Change, Description: "Playlist changed to: [__]"

**UI Placement:** Above event type dropdown (like VitalPresetsBar in SessionVitalsForm)

---

## TECHNICAL SPECIFICATIONS

### **Database Schema**

```sql
CREATE TABLE session_timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES dosing_sessions(id) ON DELETE CASCADE,
    event_timestamp TIMESTAMPTZ NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN (
        'dose_admin', 
        'vital_check', 
        'patient_observation', 
        'clinical_decision', 
        'music_change', 
        'touch_consent', 
        'other'
    )),
    event_description TEXT NOT NULL CHECK (LENGTH(event_description) <= 500),
    performed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_timeline_session ON session_timeline_events(session_id, event_timestamp);
CREATE INDEX idx_timeline_type ON session_timeline_events(event_type);
```

### **TypeScript Interface**

```typescript
// SessionTimelineForm.tsx
export interface TimelineEvent {
    id: string;
    session_id?: string;
    event_timestamp: string;           // ISO 8601 datetime
    event_type: 'dose_admin' | 'vital_check' | 'patient_observation' | 'clinical_decision' | 'music_change' | 'touch_consent' | 'other';
    event_description: string;         // max 500 chars
    performed_by?: string;             // user UUID
    created_at?: string;
    updated_at?: string;
}

interface SessionTimelineFormProps {
    onSave?: (data: TimelineEvent[]) => void;
    initialData?: TimelineEvent[];
    sessionId?: string;
}
```

### **Component Structure (Clone SessionVitalsForm)**

```typescript
const SessionTimelineForm: React.FC<SessionTimelineFormProps> = ({
    onSave,
    initialData = [],
    sessionId
}) => {
    const [events, setEvents] = useState<TimelineEvent[]>(
        initialData.length > 0 ? initialData : [createEmptyEvent()]
    );
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Auto-save with debounce (same as SessionVitalsForm)
    useEffect(() => {
        if (onSave && events.some(e => hasData(e))) {
            setIsSaving(true);
            const timer = setTimeout(() => {
                onSave(events.filter(e => hasData(e)));
                setIsSaving(false);
                setLastSaved(new Date());
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [events, onSave]);

    function createEmptyEvent(): TimelineEvent {
        return {
            id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            event_timestamp: '',
            event_type: 'other',
            event_description: ''
        };
    }

    function recordNow(index: number) {
        const now = new Date().toISOString().slice(0, 16);
        updateEvent(index, 'event_timestamp', now);
    }

    // ... rest of component (same pattern as SessionVitalsForm)
};
```

---

## ACCEPTANCE CRITERIA

### **Phase 1 (Week 1):**
- [ ] SessionTimelineForm component created (clone SessionVitalsForm)
- [ ] Event type dropdown with 7 options
- [ ] Event description text area (500 char max)
- [ ] Timestamp field with "Record Now" button
- [ ] Quick-entry event buttons (5 templates)
- [ ] Color-coded event type badges
- [ ] Database migration executed successfully
- [ ] Form auto-saves events (500ms debounce)
- [ ] "Add Another Event" button functional
- [ ] "Remove Event" button functional (if >1 event)
- [ ] Mobile responsive (fields stack on mobile)
- [ ] WCAG AAA compliant (fonts ≥12px, keyboard navigation)
- [ ] Character counter for event description
- [ ] Tooltips added for all fields

### **Testing:**
- [ ] All events save to database correctly
- [ ] Event type badges display correct colors
- [ ] "Record Now" button populates current timestamp
- [ ] Quick-entry buttons pre-populate fields correctly
- [ ] Form works with 200+ events (performance test)
- [ ] No PHI leakage in logs/errors
- [ ] Timeline events display in chronological order

---

## DEPENDENCIES

### **Upstream:**
- None (builds on SessionVitalsForm pattern)

### **Downstream:**
- **SOOP:** Database schema review and migration execution
- **DESIGNER:** (Optional) UI mockups for event type badges
- **BUILDER:** Implementation of SessionTimelineForm
- **INSPECTOR:** QA audit (accessibility, PHI security, performance)

---

## ESTIMATED EFFORT

- **SOOP:** 2 hours (database migration)
- **BUILDER:** 12 hours (clone SessionVitalsForm, adapt fields, quick-entry buttons, testing)
- **INSPECTOR:** 2 hours (QA audit)
- **Total:** 16 hours (2 days)

---

## SUCCESS METRICS

1. **Data Completeness:** 90%+ of sessions have timeline with ≥5 events
2. **Provider Satisfaction:** "Timeline tracking saves me 15+ minutes per session" (survey)
3. **Clinical Value:** Providers use timeline for pharmacodynamic decisions (qualitative feedback)
4. **Performance:** Form loads <500ms with 200+ events
5. **Adoption:** 80%+ of providers use timeline feature within 30 days

---

## RISKS & MITIGATION

### **Risk 1: Data Entry Burden (Medium)**
- **Mitigation:** Quick-entry buttons reduce typing (5 templates)
- **Mitigation:** "Record Now" button eliminates manual timestamp entry
- **Mitigation:** Auto-save prevents data loss

### **Risk 2: Timeline Clutter (Low)**
- **Mitigation:** Color-coded badges make scanning easy
- **Mitigation:** Collapsible sections (future enhancement)
- **Mitigation:** Filter by event type (future enhancement)

### **Risk 3: Provider Resistance (Low)**
- **Mitigation:** Doctor interview validates need ("wishlist" feature)
- **Mitigation:** Optional feature (not required for session completion)

---

## FUTURE ENHANCEMENTS (Post-MVP)

1. **Timeline Visualization:** Graphical timeline view (like Gantt chart)
2. **Event Filtering:** Filter by event type (show only dose admin events)
3. **Correlation Analysis:** Link timeline events to vital sign readings
4. **Voice-to-Text:** Hands-free timeline logging
5. **Event Templates:** Custom quick-entry templates per provider

---

## REFERENCES

1. **Session_Tracking_Analysis_Summary.md** - GAP 1: Minute-by-Minute Timeline Tracking
2. **WO-084_Session_Tracking_Data_Architecture_Analysis.md** - Full analysis with use cases
3. **Doctor_Interview.md** - Doctor's wishlist: "down to the minute" tracking
4. **SESSIONS.md** - Monitoring intervals (every 30 min, hourly)
5. **SessionVitalsForm.tsx** - Reference implementation (pattern to clone)

---

## EXAMPLE USE CASE (From Doctor Interview)

**Session Timeline for MDMA + Ketamine Augmentation:**

| **Timestamp** | **Event Type** | **Description** |
|---------------|----------------|-----------------|
| T+0:00 | 🟦 Dose Admin | 125mg MDMA oral administration |
| T+0:20 | 🟦 Dose Admin | 20mg test dose administered |
| T+1:00 | 🟩 Vital Check | HR 84, BP 120/80, SpO2 98% |
| T+1:30 | 🟨 Patient Observation | Patient reports no breakthrough |
| T+1:30 | 🟧 Clinical Decision | Decision point: no breakthrough at standard dose |
| T+1:35 | 🟦 Dose Admin | 125mg MDMA per rectal (total 250mg) |
| T+2:00 | 🟩 Vital Check | HR 122, BP 135/88, SpO2 97% (elevated HR) |
| T+2:00 | 🟨 Patient Observation | Still no breakthrough, patient frustrated |
| T+2:05 | 🟧 Clinical Decision | Clinical decision: add 75mg ketamine IM to augment MDMA |
| T+2:10 | 🟦 Dose Admin | 75mg ketamine IM administered |
| T+2:30 | 🟩 Vital Check | HR 118, BP 130/85, SpO2 98% |
| T+2:45 | 🟨 Patient Observation | Breakthrough achieved, patient reports profound experience |
| T+3:00 | 🟪 Music Change | Playlist changed to descent phase music |

**This timeline enables:**
- ✅ Pharmacodynamic decision-making (when to add ketamine)
- ✅ Legal documentation (minute-level audit trail)
- ✅ Research correlation (link HR spike to ketamine admin)

---

## LEAD ARCHITECTURE (2026-02-17 22:19 PST)

### Architecture Decisions:

1. **New Table Approved:** `session_timeline_events` is a net-new table — no existing table conflict. SOOP to write `migrations/053_session_timeline_events.sql`.

2. **FK Reference Verification:** The schema spec references `dosing_sessions(id)`. SOOP must verify the live table name — it may be `log_sessions` or `log_dosing_sessions`. Run pre-flight check.

3. **Component Location:** `SessionTimelineForm.tsx` goes in `src/components/wellness-journey/` (following the existing pattern for session-phase components), NOT in `src/components/forms/`.

4. **Integration Point:** After BUILDER completes, integrate into the Wellness Journey Phase 2 tab (Session tab) alongside `SessionVitalsForm`.

5. **Mock Data:** The BUILDER mock data system already has `useSessionTimeline()` hook in `src/lib/mockData/hooks.ts`. BUILDER should use this for development before DB is live.

### Execution Order:
1. **SOOP** → Pre-flight schema check → Write `migrations/053_session_timeline_events.sql` → Move to 04_QA
2. **USER** → Execute migration in Supabase SQL Editor
3. **BUILDER** → Clone `SessionVitalsForm.tsx` pattern → Create `SessionTimelineForm.tsx` using mock data hooks → Move to 04_QA
4. **INSPECTOR** → QA audit

## NEXT STEPS

1. ~~**LEAD:** Review architecture, approve database schema~~ ✅ DONE
2. **SOOP:** Pre-flight schema check → Create `migrations/053_session_timeline_events.sql`
3. **BUILDER:** Clone `SessionVitalsForm` → Create `SessionTimelineForm` using `useSessionTimeline()` mock hook
4. **INSPECTOR:** QA audit - verify accessibility, PHI security, performance
5. **BUILDER:** Integrate `SessionTimelineForm` into Wellness Journey Phase 2 tab

---

**PRODDY SIGN-OFF:** This work order implements the doctor's #1 wishlist feature using a proven pattern (SessionVitalsForm). Low risk, high clinical value. Recommend LEAD approval for immediate execution.

**Routing:** Moving to LEAD for architecture review.
