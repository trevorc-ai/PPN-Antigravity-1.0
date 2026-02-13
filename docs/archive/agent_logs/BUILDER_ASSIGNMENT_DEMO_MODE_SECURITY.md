# 🔨 BUILDER ASSIGNMENT - Demo Mode Security Fix

**Assigned By:** LEAD  
**Assigned To:** BUILDER  
**Date:** 2026-02-11 21:51 PST  
**Priority:** 🔴 CRITICAL  
**Estimated Time:** 30 minutes  
**Deadline:** Today (2026-02-11)

---

## 📋 HANDOFF ACKNOWLEDGMENT

**LEAD:** Handing off `BUILDER_TASK_DEMO_MODE_SECURITY_FIX.md` to BUILDER

**BUILDER:** (Please acknowledge receipt and start time)

---

## 🎯 TASK SUMMARY

**Goal:** Fix critical security vulnerability in demo mode authentication

**Current Problem:**
- Demo mode can be activated via localStorage manipulation
- Bypasses proper authentication
- Security risk for production deployment

**Required Solution:**
- Gate demo mode behind environment variable `VITE_DEMO_MODE`
- Remove localStorage bypass
- Demo mode only works when explicitly enabled in `.env`

---

## 📁 TASK DETAILS

**Full Task Specification:** `BUILDER_TASK_DEMO_MODE_SECURITY_FIX.md`

**Key Files to Modify:**
1. `src/pages/Login.tsx` - Update demo mode check
2. `.env` - Add `VITE_DEMO_MODE=true` for development
3. `.env.example` - Document the variable
4. `DEMO_LOGIN_CREDENTIALS.md` - Update documentation

---

## ✅ ACCEPTANCE CRITERIA

- [ ] Demo mode only works when `VITE_DEMO_MODE=true` in `.env`
- [ ] No localStorage bypass possible
- [ ] Demo credentials still work when enabled
- [ ] Production mode secure by default (no env variable = no demo mode)
- [ ] `.env.example` updated with documentation
- [ ] `DEMO_LOGIN_CREDENTIALS.md` updated
- [ ] No console errors
- [ ] Tested both enabled and disabled states

---

## 🔧 IMPLEMENTATION STEPS

### **Step 1: Update Login.tsx** (15 min)

**Current code (INSECURE):**
```typescript
// Checks localStorage for demo mode
if (localStorage.getItem('demo_mode') === 'true') {
  // Allow demo login
}
```

**Required code (SECURE):**
```typescript
// Check environment variable instead
const isDemoModeEnabled = import.meta.env.VITE_DEMO_MODE === 'true';

if (isDemoModeEnabled && email === 'demo@ppn.org' && password === 'demo123') {
  // Allow demo login
}
```

**Remove any localStorage demo mode checks completely.**

---

### **Step 2: Update .env** (5 min)

Add to `.env`:
```bash
# Demo Mode (Development Only)
# Set to 'true' to enable demo login credentials
# NEVER enable in production
VITE_DEMO_MODE=true
```

---

### **Step 3: Update .env.example** (5 min)

Add to `.env.example`:
```bash
# Demo Mode (Development Only)
# Set to 'true' to enable demo login credentials
# NEVER enable in production
# VITE_DEMO_MODE=true
```

(Note: Commented out by default for security)

---

### **Step 4: Update Documentation** (5 min)

Update `DEMO_LOGIN_CREDENTIALS.md`:
```markdown
## Enabling Demo Mode

Demo mode is gated behind an environment variable for security.

**To enable demo mode:**
1. Add to your `.env` file: `VITE_DEMO_MODE=true`
2. Restart the dev server
3. Use demo credentials: demo@ppn.org / demo123

**Production:** Demo mode is disabled by default. Do NOT set VITE_DEMO_MODE in production.
```

---

## 🧪 TESTING CHECKLIST

### **Test 1: Demo Mode Enabled**
- [ ] Set `VITE_DEMO_MODE=true` in `.env`
- [ ] Restart dev server
- [ ] Login with demo@ppn.org / demo123
- [ ] Should succeed ✅

### **Test 2: Demo Mode Disabled**
- [ ] Remove `VITE_DEMO_MODE` from `.env` (or set to false)
- [ ] Restart dev server
- [ ] Try login with demo@ppn.org / demo123
- [ ] Should fail ✅

### **Test 3: localStorage Bypass Blocked**
- [ ] Open browser console
- [ ] Try: `localStorage.setItem('demo_mode', 'true')`
- [ ] Try login with demo@ppn.org / demo123
- [ ] Should fail (localStorage ignored) ✅

### **Test 4: Regular Login Still Works**
- [ ] Login with real credentials
- [ ] Should work normally ✅

---

## 📊 COMPLETION ARTIFACT

**When complete, create:** `BUILDER_COMPLETE_DEMO_MODE_SECURITY_FIX.md`

**Must include:**
- [ ] List of files modified
- [ ] Code changes summary
- [ ] Test results (all 4 tests passed)
- [ ] Screenshots (optional but helpful)
- [ ] Time taken
- [ ] Any issues encountered

**Then:**
1. Update `MASTER_CHECKLIST.md` - mark task complete
2. Update `PROJECT_STATUS_BOARD.md` - move to completed
3. Announce completion: "**BUILDER:** Demo mode security fix complete"
4. Commit and push to Git

---

## 🚨 CRITICAL NOTES

**Security:**
- This is a CRITICAL security fix
- Do NOT skip testing
- Verify localStorage bypass is completely blocked
- Production must be secure by default

**Environment Variables:**
- Vite uses `import.meta.env.VITE_*` format
- Must restart dev server after changing `.env`
- Variables must start with `VITE_` to be exposed to client

**Git:**
- `.env` is gitignored (correct)
- `.env.example` should be committed (correct)
- Never commit actual `.env` file

---

## ⏭️ NEXT TASK AFTER COMPLETION

**Wire Protocol Builder to Database** (2 hours)
- Connect form submission to `log_clinical_records` table
- Enable real data flow
- Unblock Analytics connection

---

## 📞 SUPPORT

**If blocked:**
- Check that dev server restarted after `.env` change
- Verify `VITE_DEMO_MODE` (not `DEMO_MODE`)
- Check browser console for errors
- Ask LEAD for help if stuck >15 minutes

---

**Assignment Created:** 2026-02-11 21:51 PST  
**Assigned By:** LEAD  
**Status:** 🔴 ASSIGNED  
**Waiting For:** BUILDER acknowledgment and start
