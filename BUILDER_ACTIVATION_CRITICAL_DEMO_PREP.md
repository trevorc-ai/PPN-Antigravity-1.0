# 🔨 BUILDER ACTIVATION - Critical Demo Prep Tasks

**Activated By:** LEAD  
**Date:** 2026-02-12 05:29 PST  
**Priority:** 🔴 CRITICAL - Demo in 3 days  
**Total Estimated Time:** 2.5 hours

---

## 🎯 YOUR MISSION

You have **2 critical tasks** that must be completed for the Dr. Shena demo on Saturday, Feb 15:

1. **Demo Mode Security Fix** (30 min) - CRITICAL SECURITY
2. **Wire Protocol Builder to Database** (2 hours) - CRITICAL FUNCTIONALITY

---

## 📋 TASK 1: Demo Mode Security Fix (30 minutes)

### **Priority:** 🔴 P0 - CRITICAL SECURITY
### **Status:** Ready to start immediately

### **Problem:**
Anyone can bypass authentication by typing in browser console:
```javascript
localStorage.setItem('demo_mode', 'true');
```

### **Solution:**
Add environment variable gate to prevent production bypass.

### **Task File:**
`/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/BUILDER_TASK_DEMO_MODE_SECURITY_FIX.md`

### **Quick Summary:**
1. Update `App.tsx` line ~94:
   ```typescript
   // OLD:
   const isDemoMode = localStorage.getItem('demo_mode') === 'true';
   
   // NEW:
   const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true' && 
                      localStorage.getItem('demo_mode') === 'true';
   ```

2. Add to `.env.example`:
   ```bash
   VITE_DEMO_MODE=false
   ```

3. Create `.env.local`:
   ```bash
   VITE_DEMO_MODE=true
   ```

4. Test both development and production modes

### **Files to Modify:**
- `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/App.tsx`
- `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/.env.example`
- `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/.env.local` (create)

### **Acceptance Criteria:**
- ✅ Demo mode works in development (with env var)
- ✅ Demo mode blocked in production (without env var)
- ✅ No console errors
- ✅ Documentation updated

---

## 📋 TASK 2: Wire Protocol Builder to Database (2 hours)

### **Priority:** 🔴 P0 - CRITICAL FOR DEMO
### **Status:** UNBLOCKED (duplication resolved)

### **Context:**
Protocol Builder Phase 1 is complete (ButtonGroups implemented), but form doesn't save to database yet. We need to wire the submission handler to insert data into `log_clinical_records` table.

### **Current State (VERIFIED):**
- ✅ ButtonGroup component exists and is used 5 times
- ✅ Database-driven dropdowns (ref_substances, ref_routes, etc.)
- ✅ Form state uses IDs (substance_id, route_id, etc.)
- ⚠️ Submission handler needs database INSERT logic

### **Your Tasks:**

#### **Step 1: Review Database Schema** (15 min)
1. Check `log_clinical_records` table structure
2. Identify all required columns
3. Map form fields to database columns

#### **Step 2: Find Submission Handler** (15 min)
1. Search ProtocolBuilder.tsx for form submit logic
2. Locate the function that handles form submission
3. Understand current behavior (likely just console.log or alert)

#### **Step 3: Add Database INSERT** (45 min)
1. Import Supabase client (already imported at top of file)
2. Add INSERT query to `log_clinical_records`
3. Map all form fields to database columns:
   ```typescript
   const { data, error } = await supabase
     .from('log_clinical_records')
     .insert({
       site_id: userSiteId, // Get from user context
       subject_id: formData.subjectId,
       substance_id: formData.substance_id,
       route_id: formData.route_id,
       smoking_status_id: formData.smoking_status_id,
       // ... map all fields
     })
     .select();
   ```

4. Handle success/error states
5. Add Toast notifications (success/error)

#### **Step 4: Test End-to-End** (30 min)
1. Start dev server
2. Open Protocol Builder modal
3. Fill out complete form
4. Submit
5. Verify success toast appears
6. Check Supabase dashboard for new record
7. Verify all fields saved correctly
8. Test error handling (disconnect from internet, submit)

#### **Step 5: Document Changes** (15 min)
1. Create completion artifact
2. List all files modified
3. Document testing results
4. Note any issues or limitations

### **Files to Modify:**
- `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/pages/ProtocolBuilder.tsx` (submission handler)

### **Acceptance Criteria:**
- ✅ Form submits to `log_clinical_records` table
- ✅ All required fields mapped correctly
- ✅ Success toast shows on successful submission
- ✅ Error toast shows on failure
- ✅ Data visible in Supabase dashboard
- ✅ No console errors

---

## 🚨 CRITICAL REMINDERS

### **You MUST:**
1. **Identify yourself** - Start every response with "**BUILDER:**"
2. **Use absolute paths** - Always use full paths starting with `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/`
3. **Test thoroughly** - Both tasks are critical for demo
4. **Create completion artifacts** - Document everything
5. **Hand off to INSPECTOR** - After completing both tasks

### **You MUST NOT:**
1. ❌ Touch any database schema files (SOOP's job)
2. ❌ Touch any .sql files (SOOP's job)
3. ❌ Modify RLS policies (SOOP's job)
4. ❌ Change UI design (DESIGNER's job)
5. ❌ Refactor unrelated code

---

## 📊 WORKFLOW

### **Step-Back Analysis (MANDATORY):**
Before writing ANY code, you MUST perform this analysis:

```
**BUILDER:** Step-Back Analysis:

1. GOAL: [Restate what you're trying to accomplish]
2. FILES TO MODIFY: [List exact file paths with absolute paths]
3. SAFETY CHECK:
   - Am I touching any database files? [YES = STOP / NO = PROCEED]
   - Am I touching any .sql files? [YES = STOP / NO = PROCEED]
   - Am I in the /src directory? [YES = PROCEED / NO = STOP]
4. BREAKING CHANGE PREVENTION: [How will you avoid breaking existing functionality?]
5. TASK FILE CHECK: [Did I check for BUILDER_TASK_*.md files?]
```

Only after completing this analysis may you write code.

---

## 📝 DELIVERABLES

### **After Task 1 (Security Fix):**
Create: `BUILDER_COMPLETE_DEMO_MODE_SECURITY_FIX_20260212.md`

### **After Task 2 (Database Wiring):**
Create: `BUILDER_COMPLETE_PROTOCOLBUILDER_DATABASE_WIRING_20260212.md`

### **Final Handoff:**
```
**BUILDER:** Both critical tasks complete.

Task 1: Demo Mode Security Fix
- Artifact: BUILDER_COMPLETE_DEMO_MODE_SECURITY_FIX_20260212.md
- Status: ✅ COMPLETE
- Testing: All 3 tests passed

Task 2: Protocol Builder Database Wiring
- Artifact: BUILDER_COMPLETE_PROTOCOLBUILDER_DATABASE_WIRING_20260212.md
- Status: ✅ COMPLETE
- Testing: End-to-end submission works, data in Supabase

Handing off to INSPECTOR for verification.
```

---

## 🎯 SUCCESS CRITERIA

**Demo is ready if:**
- ✅ Demo mode secure (can't bypass in production)
- ✅ Protocol Builder saves to database
- ✅ Success/error toasts work
- ✅ No console errors
- ✅ Data visible in Supabase dashboard

---

## 🔗 REFERENCE FILES

**Task Files:**
- `BUILDER_TASK_DEMO_MODE_SECURITY_FIX.md` - Full security fix instructions
- `DEMO_READINESS_PLAN.md` - Overall demo timeline
- `PROJECT_STATUS_BOARD.md` - Current project status

**Implementation Files:**
- `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/App.tsx` - Demo mode check
- `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/pages/ProtocolBuilder.tsx` - Form submission

**Database Schema:**
- Check Supabase dashboard for `log_clinical_records` table structure

---

## ⏰ TIMELINE

**Start:** 2026-02-12 05:30 PST  
**Task 1 Complete:** 2026-02-12 06:00 PST (30 min)  
**Task 2 Complete:** 2026-02-12 08:00 PST (2 hours)  
**Total Time:** 2.5 hours

**Demo Date:** Saturday, Feb 15, 2026 (2.5 days away)

---

**BUILDER, please acknowledge receipt of this activation and begin with your step-back analysis for Task 1 (Demo Mode Security Fix).**

**Start immediately. Time is critical for demo readiness.** ⚡
