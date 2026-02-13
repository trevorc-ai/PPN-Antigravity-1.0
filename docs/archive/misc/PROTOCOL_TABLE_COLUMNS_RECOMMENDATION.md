# 📊 Protocol Table Column Recommendations
**Page:** My Protocols (ProtocolBuilder.tsx)  
**Date:** 2026-02-10  
**Objective:** Improve table UI/UX for easier scrolling and finding protocols

---

## Current Table Structure

### **Existing Columns:**
1. **Protocol Reference** - Substance name + ID + Site ID
2. **Current Status** - Active/Completed/Observation
3. **Dosage** - Dosage amount + unit
4. **Action** - "Open Protocol" button

---

## Recommended Additional Columns

### **Priority 1: High Value (Add These)**

#### 1. **Created Date**
**Column Header:** `CREATED`  
**Display Format:** `Feb 8, 2026` or `2 days ago`  
**Data Source:** `created_at` from `log_clinical_records`

**Reasoning:**
- **Chronological Navigation:** Users often search for "recent" or "last week's" protocols
- **Audit Trail:** Helps identify when a protocol was initiated
- **Sorting:** Enables "newest first" or "oldest first" sorting
- **Visual Hierarchy:** Recent protocols are typically more relevant

**Implementation:**
```tsx
<th className="px-8 py-6">Created</th>

// In tbody
<td className="px-8 py-6">
  <div className="flex flex-col">
    <span className="text-sm font-bold text-slate-300">
      {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
    </span>
    <span className="text-[10px] text-slate-600 font-mono">
      {formatRelativeTime(p.created_at)} {/* e.g., "2 days ago" */}
    </span>
  </div>
</td>
```

---

#### 2. **Subject Age/Sex**
**Column Header:** `SUBJECT`  
**Display Format:** `42M` or `35F`  
**Data Source:** Derived from `patient_link_code` or stored demographics

**Reasoning:**
- **Quick Identification:** Clinicians often remember patients by age/sex
- **Pattern Recognition:** Helps identify cohorts (e.g., "all 30-40 year old males")
- **Filtering:** Enables age-based or sex-based filtering
- **Compact:** Takes minimal space (3-4 characters)

**Implementation:**
```tsx
<th className="px-8 py-6">Subject</th>

// In tbody
<td className="px-8 py-6">
  <span className="text-sm font-mono font-black text-slate-400">
    {p.subject_age}{p.subject_sex?.charAt(0) || '?'}
  </span>
</td>
```

---

#### 3. **Outcome Score**
**Column Header:** `OUTCOME`  
**Display Format:** Visual indicator (color-coded) + score  
**Data Source:** `outcome_score` from `log_clinical_records`

**Reasoning:**
- **At-a-Glance Assessment:** Quickly identify successful vs. challenging protocols
- **Prioritization:** Helps clinicians focus on protocols needing follow-up
- **Visual Feedback:** Color coding (green = good, yellow = moderate, red = poor) improves scannability
- **Research Value:** Enables quick comparison across protocols

**Implementation:**
```tsx
<th className="px-8 py-6">Outcome</th>

// In tbody
<td className="px-8 py-6">
  <div className="flex items-center gap-2">
    <div className={`w-2 h-2 rounded-full ${
      p.outcome_score >= 7 ? 'bg-clinical-green' :
      p.outcome_score >= 4 ? 'bg-amber-500' :
      'bg-red-500'
    }`}></div>
    <span className={`text-sm font-bold ${
      p.outcome_score >= 7 ? 'text-clinical-green' :
      p.outcome_score >= 4 ? 'text-amber-400' :
      'text-red-400'
    }`}>
      {p.outcome_score}/10
    </span>
  </div>
</td>
```

---

### **Priority 2: Medium Value (Consider Adding)**

#### 4. **Safety Events**
**Column Header:** `SAFETY`  
**Display Format:** Icon indicator (checkmark or warning)  
**Data Source:** Check if `log_safety_events` has entries for this protocol

**Reasoning:**
- **Risk Management:** Immediately flags protocols with adverse events
- **Compliance:** Helps ensure safety events are reviewed
- **Visual Alert:** Icon-based display is space-efficient
- **Filtering:** Enables "show only protocols with safety events"

**Implementation:**
```tsx
<th className="px-8 py-6 text-center">Safety</th>

// In tbody
<td className="px-8 py-6 text-center">
  {p.has_safety_event ? (
    <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-md">
      <AlertTriangle className="w-3 h-3 text-red-400" />
      <span className="text-[10px] font-black text-red-400 uppercase">Event</span>
    </div>
  ) : (
    <CheckCircle className="w-4 h-4 text-slate-700 mx-auto" />
  )}
</td>
```

---

#### 5. **Last Modified**
**Column Header:** `UPDATED`  
**Display Format:** `1 hour ago` or `Yesterday`  
**Data Source:** `updated_at` from `log_clinical_records`

**Reasoning:**
- **Activity Tracking:** Shows which protocols are actively being worked on
- **Collaboration:** Helps teams know when colleagues last updated a protocol
- **Audit Trail:** Complements "Created" date for full timeline
- **Sorting:** Enables "recently modified" sorting

**Implementation:**
```tsx
<th className="px-8 py-6">Updated</th>

// In tbody
<td className="px-8 py-6">
  <span className="text-[11px] text-slate-500 font-mono">
    {formatRelativeTime(p.updated_at)}
  </span>
</td>
```

---

### **Priority 3: Low Value (Optional)**

#### 6. **Site/Location**
**Column Header:** `SITE`  
**Display Format:** Site abbreviation or icon  
**Data Source:** `site_id` from `log_clinical_records`

**Reasoning:**
- **Multi-Site Networks:** Useful for organizations with multiple locations
- **Filtering:** Enables site-specific views
- **Context:** Helps identify which clinic/location a protocol belongs to

**Note:** Currently displayed in "Protocol Reference" subtext. Consider keeping it there to avoid redundancy.

---

## Recommended Final Table Structure

### **Proposed Column Order:**

| # | Column | Width | Justification |
|---|--------|-------|---------------|
| 1 | **Protocol Reference** | 25% | Primary identifier (substance + ID) |
| 2 | **Subject** | 8% | Quick demographic reference |
| 3 | **Created** | 12% | Chronological context |
| 4 | **Status** | 12% | Current state |
| 5 | **Outcome** | 10% | Success indicator |
| 6 | **Safety** | 8% | Risk flag |
| 7 | **Dosage** | 10% | Treatment details |
| 8 | **Action** | 15% | CTA button |

**Total:** 100% width

---

## Visual Mockup (Text-Based)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ PROTOCOL REFERENCE          SUBJECT  CREATED        STATUS      OUTCOME  SAFETY  DOSAGE      ACTION │
├─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Psilocybin Protocol         42M      Feb 8, 2026    ● ACTIVE    8/10 ●   ✓       25 mg       OPEN → │
│ EX-001 • NODE-01                     2 days ago                  ────                                │
│                                                                                                       │
│ MDMA Protocol               35F      Feb 5, 2026    ● COMPLETED 9/10 ●   ⚠       120 mg      OPEN → │
│ EX-002 • NODE-04                     5 days ago                  ────    EVENT                       │
│                                                                                                       │
│ Ketamine Protocol           28M      Jan 30, 2026   ● ACTIVE    6/10 ●   ✓       0.5 mg/kg   OPEN → │
│ EX-003 • NODE-07                     11 days ago                 ────                                │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Implementation Benefits

### **User Experience:**
- ✅ **Faster Scanning:** Visual indicators (colors, icons) reduce cognitive load
- ✅ **Better Sorting:** Multiple sortable columns (date, outcome, status)
- ✅ **Improved Filtering:** More data points enable advanced filtering
- ✅ **Context at a Glance:** No need to open protocol to see key details

### **Clinical Workflow:**
- ✅ **Prioritization:** Outcome scores help identify protocols needing attention
- ✅ **Safety Compliance:** Safety event flags ensure nothing is missed
- ✅ **Chronological Tracking:** Created/Updated dates provide timeline context
- ✅ **Cohort Identification:** Subject demographics enable pattern recognition

### **Technical:**
- ✅ **Minimal Performance Impact:** All data already available in query
- ✅ **Responsive:** Columns can be hidden on mobile (show only essential)
- ✅ **Sortable:** Easy to implement sort functionality
- ✅ **Filterable:** Enables advanced search/filter features

---

## Mobile Responsiveness Strategy

### **Desktop (≥1024px):** Show all columns
### **Tablet (768px - 1023px):** Hide "Updated" and "Safety"
### **Mobile (<768px):** Show only:
- Protocol Reference
- Status
- Outcome
- Action

**Implementation:**
```tsx
<th className="px-8 py-6 hidden lg:table-cell">Safety</th>
<th className="px-8 py-6 hidden xl:table-cell">Updated</th>
```

---

## Recommended Additions Summary

### **Must Add (Priority 1):**
1. ✅ **Created Date** - Chronological navigation
2. ✅ **Subject (Age/Sex)** - Quick identification
3. ✅ **Outcome Score** - Success indicator

### **Should Add (Priority 2):**
4. ⚠️ **Safety Events** - Risk management
5. ⚠️ **Last Modified** - Activity tracking

### **Optional (Priority 3):**
6. ⏸️ **Site/Location** - Multi-site support (if needed)

---

## Estimated Implementation Time

- **Priority 1 columns:** 45 minutes
- **Priority 2 columns:** 30 minutes
- **Mobile responsiveness:** 20 minutes
- **Testing:** 30 minutes
- **Total:** ~2 hours

---

**Awaiting approval to implement Priority 1 columns (Created, Subject, Outcome).**
