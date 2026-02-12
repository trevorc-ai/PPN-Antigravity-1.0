# 📋 **PROJECT GOVERNANCE - QUICK REFERENCE**

**Full Documentation:** `PROJECT_GOVERNANCE_RULES.md`  
**Last Updated:** 2026-02-10

---

## 🔴 **CRITICAL RULES (NEVER VIOLATE)**

### **Database**
- ❌ NO drops, renames, or type changes
- ❌ NO PHI/PII collection
- ❌ NO free-text answer fields
- ✅ Public schema only
- ✅ RLS on all patient tables
- ✅ Migrations only (no Table Editor)

### **Frontend**
- ❌ NO fonts below 10px
- ❌ NO color-only meaning
- ❌ NO `alert()` calls
- ❌ NO `any` types without justification
- ✅ TypeScript for all components
- ✅ Handle loading/error states

### **Accessibility**
- ❌ NO color alone (user is colorblind)
- ✅ Color + icon/text always
- ✅ Min 10px font size
- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation

---

## 🤝 **AGENT ROLES**

### **🔍 INVESTIGATOR**
- Find breaks, don't fix
- Report findings
- Verify work

### **🎨 DESIGNER**
- Spec, don't code
- Define UX
- Create requirements

### **🔨 BUILDER**
- Wait for report
- Implement specs
- Follow guidelines

---

## 📊 **WORKFLOW**

### **Standard:**
Request → INVESTIGATOR → DESIGNER → BUILDER → Verify

### **Simple:**
Request → BUILDER → Review

### **Database:**
Request → INVESTIGATOR → User Approval → BUILDER → Verify

---

## ✅ **CHECKLIST BEFORE COMMITTING**

### **Code Quality:**
- [ ] TypeScript types defined
- [ ] No `console.log` statements
- [ ] No `alert()` calls
- [ ] Error handling complete
- [ ] Loading states implemented

### **Accessibility:**
- [ ] Min 10px font size
- [ ] Color + icon/text (not color alone)
- [ ] Semantic HTML
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works

### **Testing:**
- [ ] No console errors
- [ ] Responsive at 375px, 768px, 1024px
- [ ] All interactive elements work
- [ ] Loading states display
- [ ] Error states display

### **Database (if applicable):**
- [ ] Migration script created
- [ ] Additive-only changes
- [ ] RLS policies updated
- [ ] Verification queries run
- [ ] User approval obtained

---

## 🚨 **IF YOU VIOLATE A RULE**

1. ⏸️ **STOP WORK IMMEDIATELY**
2. 🚨 **REPORT TO USER**
3. 📋 **DOCUMENT VIOLATION**
4. ⏳ **AWAIT PERMISSION**

---

## 📚 **FULL DOCUMENTATION**

- **Master:** `PROJECT_GOVERNANCE_RULES.md`
- **Database:** `DATABASE_GOVERNANCE_RULES.md`
- **Frontend:** `FRONTEND_RULES.md`
- **Agent Collaboration:** `AGENT_COLLABORATION_RULES.md`
- **Verification:** `migrations/VERIFICATION_QUERIES.sql`

---

**Print this page and keep it visible while working!**
