# 🎯 DEMO READINESS PLAN - Feb 15 Dr. Shena Demo

**Created:** 2026-02-11 21:45 PST  
**Owner:** LEAD  
**Demo Date:** Saturday, Feb 15, 2026  
**Days Remaining:** 4 days

---

## ✅ SCOPE DECISION CONFIRMED

**Age/Weight/Race Button Groups:** ⏸️ **DEFERRED to post-demo**

**Rationale:**
- Protocol Builder Phase 1 is complete (5 ButtonGroups implemented)
- Demo is in 4 days - focus on critical fixes
- Age/Weight/Race are "nice to have," not "must have"
- Can implement as Phase 1.5 after successful demo

**Impact:**
- DESIGNER can focus 100% on Clinical Intelligence Platform
- BUILDER can focus on critical fixes (demo mode, database wiring)
- Timeline stays on track for demo readiness

---

## 🔥 CRITICAL PATH TO DEMO-READY

**Total Estimated Time:** 5.5 hours  
**Target Completion:** Thursday, Feb 13 EOD

### **Step 1: Demo Mode Security Fix** ⏱️ 30 minutes
**Owner:** BUILDER  
**Priority:** 🔴 CRITICAL  
**Blocker:** Yes - security vulnerability

**Tasks:**
1. Add `VITE_DEMO_MODE` to `.env` and `.env.example`
2. Update `Login.tsx` to check env variable instead of localStorage
3. Remove localStorage demo mode backdoor
4. Test demo mode works only when env variable is set
5. Document in `DEMO_LOGIN_CREDENTIALS.md`

**Acceptance Criteria:**
- ✅ Demo mode only works when `VITE_DEMO_MODE=true`
- ✅ No localStorage bypass possible
- ✅ Demo credentials still work when enabled
- ✅ Production mode secure by default

---

### **Step 2: Resolve Protocol Builder Duplication** ⏱️ 30 minutes
**Owner:** LEAD  
**Priority:** 🔴 CRITICAL  
**Blocker:** Yes - blocks database wiring

**Decision Needed:**
- **ProtocolBuilder.tsx** (current, has ButtonGroups, database-driven)
- **ProtocolBuilderRedesign.tsx** (backup, older version)

**Recommended Action:**
1. Verify `ProtocolBuilder.tsx` is the canonical version
2. Move `ProtocolBuilderRedesign.tsx` to `archive/`
3. Update any imports/routes if needed
4. Document decision in `MASTER_CHECKLIST.md`

**Acceptance Criteria:**
- ✅ Only one ProtocolBuilder component active
- ✅ Old version archived with clear naming
- ✅ No broken imports or routes

---

### **Step 3: Wire Protocol Builder to Database** ⏱️ 2 hours
**Owner:** BUILDER  
**Priority:** 🔴 CRITICAL  
**Blocker:** Yes - blocks Analytics

**Tasks:**
1. Review database schema (`log_clinical_records` table)
2. Update form submission handler to insert into Supabase
3. Map all form fields to database columns
4. Handle success/error states with Toast notifications
5. Test full submission flow
6. Verify data appears in Supabase dashboard

**Acceptance Criteria:**
- ✅ Form submits to `log_clinical_records` table
- ✅ All required fields mapped correctly
- ✅ Success toast shows on successful submission
- ✅ Error toast shows on failure
- ✅ Data visible in Supabase dashboard
- ✅ No console errors

---

### **Step 4: Connect Analytics to Database** ⏱️ 1 hour
**Owner:** BUILDER  
**Priority:** 🟡 HIGH  
**Blocker:** No - but needed for impressive demo

**Tasks:**
1. Update Analytics page to query `log_clinical_records`
2. Replace mock data with real aggregations
3. Add loading states
4. Add empty states (if no data)
5. Test with real submitted data

**Acceptance Criteria:**
- ✅ Analytics shows real data from database
- ✅ Charts update when new records submitted
- ✅ Loading states work
- ✅ Empty states work (graceful degradation)
- ✅ No console errors

---

### **Step 5: Toast Notification System** ⏱️ 1.5 hours
**Owner:** BUILDER  
**Priority:** 🟡 MEDIUM  
**Blocker:** No - but improves UX

**Tasks:**
1. Verify `ToastContext.tsx` is set up correctly
2. Replace all `alert()` calls with `toast()` calls
3. Test success, error, warning, and info toasts
4. Verify auto-dismiss works (5 seconds)
5. Verify manual dismiss works (X button)

**Acceptance Criteria:**
- ✅ No `alert()` calls remain in codebase
- ✅ All user feedback uses Toast system
- ✅ Toasts auto-dismiss after 5 seconds
- ✅ Toasts can be manually dismissed
- ✅ Multiple toasts stack properly

---

### **Step 6: Pre-Demo Verification** ⏱️ 1 hour
**Owner:** INSPECTOR  
**Priority:** 🟡 MEDIUM  
**Blocker:** No - final QA

**Tasks:**
1. Test complete user flow (login → create protocol → view analytics)
2. Verify demo credentials work
3. Check all pages for console errors
4. Test mobile responsiveness
5. Verify accessibility (keyboard navigation)
6. Create pre-demo checklist

**Acceptance Criteria:**
- ✅ Demo flow works end-to-end
- ✅ Demo credentials verified
- ✅ No console errors on any page
- ✅ Mobile responsive on key pages
- ✅ Keyboard navigation works
- ✅ Pre-demo checklist complete

---

## 📅 TIMELINE

**Tuesday, Feb 11 (Today):**
- [x] Clarify Age/Weight/Race scope ✅
- [ ] BUILDER: Start demo mode security fix
- [ ] LEAD: Resolve Protocol Builder duplication

**Wednesday, Feb 12:**
- [ ] BUILDER: Complete demo mode security fix
- [ ] BUILDER: Wire Protocol Builder to database (start)

**Thursday, Feb 13:**
- [ ] BUILDER: Wire Protocol Builder to database (complete)
- [ ] BUILDER: Connect Analytics to database
- [ ] BUILDER: Toast notification system

**Friday, Feb 14:**
- [ ] INSPECTOR: Pre-demo verification
- [ ] LEAD: Final review and approval
- [ ] Team: Practice demo flow

**Saturday, Feb 15:**
- [ ] **Dr. Shena Demo** 🎯

---

## 🎬 DEMO SCRIPT (Draft)

**Duration:** 10-15 minutes

**1. Introduction** (2 min)
- What is PPN Research Portal?
- Why no-PHI approach matters
- Target users: practitioners and researchers

**2. Protocol Builder Demo** (5 min)
- Show streamlined UX (ButtonGroups)
- Create a sample protocol
- Highlight safety features (drug interaction warnings)
- Show database-driven dropdowns

**3. Analytics Demo** (3 min)
- Show real-time data from submitted protocols
- Highlight network-level insights
- Demonstrate benchmarking capabilities

**4. Strategic Vision** (3 min)
- Clinical Intelligence Platform roadmap
- Network effects and value proposition
- Next steps and partnership opportunities

**5. Q&A** (2-5 min)

---

## 🚨 RISK REGISTER

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Database connection fails during demo | Low | High | Test thoroughly, have backup mock data |
| Demo credentials don't work | Low | High | Verify Friday, have backup account |
| Console errors visible | Medium | Medium | Pre-demo verification catches these |
| Mobile view broken | Low | Low | Demo on desktop, but test mobile anyway |
| Slow query performance | Medium | Medium | Optimize queries, add loading states |

---

## ✅ SUCCESS CRITERIA

**Demo is successful if:**
- ✅ Dr. Shena can create a protocol end-to-end
- ✅ Analytics show real data from that protocol
- ✅ No console errors or crashes
- ✅ Dr. Shena understands the value proposition
- ✅ Dr. Shena wants to continue partnership discussions

---

## 📞 AGENT ASSIGNMENTS

| Agent | Tasks | Status |
|-------|-------|--------|
| LEAD | Resolve duplication, final review | 🟡 Assigned |
| BUILDER | Security fix, database wiring, Analytics, Toast | 🟡 Assigned |
| INSPECTOR | Pre-demo verification | 🟡 Assigned |
| DESIGNER | Clinical Intelligence (parallel track) | 🔴 In Progress |
| SUBA | Clinical Intelligence schema (parallel track) | 🔴 In Progress |

---

## 🎯 NEXT IMMEDIATE ACTION

**LEAD will now:**
1. Assign BUILDER to demo mode security fix
2. Resolve Protocol Builder duplication
3. Update PROJECT_STATUS_BOARD.md
4. Push changes to Git

**Estimated time:** 30 minutes

---

**Plan Created:** 2026-02-11 21:45 PST  
**Owner:** LEAD  
**Status:** ✅ APPROVED  
**Next Review:** Daily standup at 9:00 AM PST
