# 📊 **MY PROTOCOLS vs AUDIT LOGS - CLARIFICATION**

**Date:** 2026-02-10 12:45 PM  
**Purpose:** Clearly distinguish between two different tables/pages

---

## 🎯 **KEY DISTINCTION**

### **"My Protocols" Table**
**Location:** Protocol Builder page (`/builder`)  
**Purpose:** Clinical research records - patient protocols  
**Database Table:** `log_clinical_records`  
**User Action:** Create, view, edit clinical protocols  
**Data Type:** Clinical/medical data (de-identified)

### **"Audit Logs" Table**
**Location:** Audit Logs page (`/audit-logs`)  
**Purpose:** System activity tracking - compliance/security  
**Database Table:** `system_events`  
**User Action:** View only (read-only audit trail)  
**Data Type:** System events, user actions, security events

---

## 📋 **DETAILED COMPARISON**

| Aspect | My Protocols | Audit Logs |
|--------|--------------|------------|
| **Page** | Protocol Builder (`/builder`) | Audit Logs (`/audit-logs`) |
| **Database Table** | `log_clinical_records` | `system_events` |
| **Primary Key** | `clinical_record_id` | `event_id` |
| **Purpose** | Store clinical research data | Track system activity |
| **User Interaction** | Create, Read, Update | Read only |
| **Data Shown** | Subject demographics, interventions, outcomes | Who did what, when |
| **Columns** | Subject ID, Age, Sex, Substance, Dosage, Outcome | Timestamp, Actor, Action, Status, Hash |
| **Business Function** | Clinical research | Compliance & security |
| **Regulatory** | HIPAA-compliant de-identified data | Audit trail for FDA/compliance |

---

## 🔍 **MY PROTOCOLS TABLE**

### **What It Shows:**
- List of clinical protocols created by the user
- Each row = one patient's treatment protocol
- Columns: Subject ID, Age/Sex, Substance, Created Date, Outcome Score

### **Example Row:**
```
Subject ID: SUBJ-8821
Age/Sex: 45M
Substance: Psilocybin
Created: 2026-01-28
Outcome: 12 (PHQ-9)
```

### **Database Query:**
```sql
SELECT 
  clinical_record_id,
  subject_id,
  subject_age,
  sex,
  substance_id,
  created_at,
  phq9_score
FROM log_clinical_records
WHERE site_id = current_user_site
ORDER BY created_at DESC;
```

### **User Actions:**
- ✅ Click "Create New Protocol" → Opens modal
- ✅ Fill out form → Saves to `log_clinical_records`
- ✅ Click row → View protocol details
- ✅ Edit protocol → Update record
- ✅ Search/filter protocols

---

## 🔐 **AUDIT LOGS TABLE**

### **What It Shows:**
- List of system events (who did what, when)
- Each row = one system event/action
- Columns: Timestamp, Practitioner, Activity Event, Status, Hash

### **Example Row:**
```
Timestamp: 2026-01-28 14:45:22
Practitioner: Dr. Sarah Jenkins
Activity: PROTOCOL_CREATE
Details: Created protocol SUBJ-8821 (Psilocybin)
Status: AUTHORIZED
Hash: 0x9928...11a
```

### **Database Query:**
```sql
SELECT 
  event_id,
  created_at,
  actor_id,
  event_type,
  event_details,
  event_status,
  ledger_hash
FROM system_events
WHERE site_id = current_user_site
ORDER BY created_at DESC;
```

### **User Actions:**
- ✅ View events (read-only)
- ✅ Filter by category (All, Security, Clinical)
- ✅ Export to CSV
- ✅ Verify integrity
- ❌ Cannot create/edit/delete events (system-generated only)

---

## 🔗 **HOW THEY RELATE**

### **Event Flow:**

1. **User creates a protocol in Protocol Builder**
   - Action: Fill out "Create New Protocol" modal
   - Result: New row in `log_clinical_records`
   - **Triggers:** New row in `system_events`:
     ```
     event_type: "PROTOCOL_CREATE"
     event_details: {"clinical_record_id": 123, "substance": "Psilocybin"}
     ```

2. **User views a protocol**
   - Action: Click protocol row in "My Protocols" table
   - Result: Navigate to protocol detail page
   - **Triggers:** New row in `system_events`:
     ```
     event_type: "PROTOCOL_VIEW"
     event_details: {"clinical_record_id": 123}
     ```

3. **User edits a protocol**
   - Action: Update protocol data
   - Result: Update row in `log_clinical_records`
   - **Triggers:** New row in `system_events`:
     ```
     event_type: "PROTOCOL_UPDATE"
     event_details: {"clinical_record_id": 123, "fields_changed": ["dosage"]}
     ```

4. **Safety event is triggered**
   - Action: System detects drug interaction
   - Result: Update `log_clinical_records` with safety flag
   - **Triggers:** New row in `system_events`:
     ```
     event_type: "SAFETY_CHECK"
     event_status: "ALERT_TRIGGERED"
     event_details: {"interaction": "Psilocybin + Lithium", "risk_level": 10}
     ```

---

## 📊 **VISUAL DISTINCTION**

### **My Protocols Table (Protocol Builder Page)**
```
┌─────────────────────────────────────────────────────────────────┐
│ MY PROTOCOLS                                    [+ New Protocol]│
├─────────────┬──────────┬─────────────┬────────────┬─────────────┤
│ Subject ID  │ Age/Sex  │ Substance   │ Created    │ Outcome     │
├─────────────┼──────────┼─────────────┼────────────┼─────────────┤
│ SUBJ-8821   │ 45M      │ Psilocybin  │ 2026-01-28 │ 12 (PHQ-9)  │
│ SUBJ-8820   │ 32F      │ MDMA        │ 2026-01-27 │ 6 (PHQ-9)   │
│ SUBJ-8819   │ 55M      │ Ketamine    │ 2026-01-26 │ 18 (MADRS)  │
└─────────────┴──────────┴─────────────┴────────────┴─────────────┘
```

### **Audit Logs Table (Audit Logs Page)**
```
┌────────────────────────────────────────────────────────────────────────────┐
│ AUDIT LOGS                              [All] [Security] [Clinical]        │
├──────────────┬────────────────┬─────────────────────┬──────────┬──────────┤
│ Timestamp    │ Practitioner   │ Activity Event      │ Status   │ Hash     │
├──────────────┼────────────────┼─────────────────────┼──────────┼──────────┤
│ 2026-01-28   │ Dr. Sarah      │ SAFETY_CHECK        │ ALERT    │ 0x9928...│
│ 14:45:22     │ Jenkins        │ Psilocybin+Lithium  │          │          │
├──────────────┼────────────────┼─────────────────────┼──────────┼──────────┤
│ 2026-01-28   │ Dr. Sarah      │ PROTOCOL_VIEW       │ AUTH     │ 0x7731...│
│ 14:44:10     │ Jenkins        │ Accessed SUBJ-8820  │          │          │
└──────────────┴────────────────┴─────────────────────┴──────────┴──────────┘
```

---

## 🎯 **BUILDER INSTRUCTIONS UPDATE**

### **For "My Protocols" Table:**
**File:** `src/pages/ProtocolBuilder.tsx`  
**Database:** `log_clinical_records`  
**Status:** ✅ Already implemented (uses database)  
**Action:** No changes needed (already working)

### **For "Audit Logs" Table:**
**File:** `src/pages/AuditLogs.tsx`  
**Database:** `system_events`  
**Status:** 🔴 Needs database integration  
**Action:** Follow `BUILDER_INSTRUCTIONS_CRITICAL.md` Task 1

---

## ✅ **CONFIRMATION**

**My Protocols:**
- ✅ Shows clinical research data
- ✅ User can create/edit
- ✅ Already connected to database (`log_clinical_records`)
- ✅ No changes needed

**Audit Logs:**
- ✅ Shows system activity events
- ✅ User can only view (read-only)
- 🔴 Currently uses hardcoded mock data
- 🔴 Needs database integration (`system_events`)

---

## 📝 **SUMMARY**

**Two completely different tables:**

1. **My Protocols** = Clinical data (what treatments were given)
2. **Audit Logs** = Activity data (who did what in the system)

**My Protocols is already working correctly.**  
**Audit Logs needs database integration (Task 1 in BUILDER_INSTRUCTIONS_CRITICAL.md).**

---

**Clarification Complete:** 2026-02-10 12:45 PM  
**Status:** ✅ **DISTINCTION DOCUMENTED**
