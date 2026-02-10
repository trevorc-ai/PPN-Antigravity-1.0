# 🚨 LAUNCH-CRITICAL FIXES ONLY
**Date:** February 9, 2026 20:13 PST  
**Deadline:** TONIGHT (ASAP)  
**Strategy:** Fix only what will break the public launch

---

## 🎯 **CRITICAL ISSUES (MUST FIX TONIGHT)**

### **Issue #1: Header Navigation 404 Errors** ⏰ 15 minutes
**Impact:** Users click icons → broken pages → bad first impression  
**Risk:** HIGH - visible to all users  
**Fix:** Quick disable or redirect

#### **Quick Fix:**
**File:** `src/components/TopHeader.tsx`

**Option A: Disable Broken Icons (5 min)** ⭐ RECOMMENDED
```tsx
// Find the icon buttons (around lines 150-180)
// Comment out or hide the broken ones:

{/* TEMPORARILY DISABLED FOR LAUNCH
<button className="..." title="Advanced Search">
  <span className="material-symbols-outlined">search</span>
</button>
*/}

{/* TEMPORARILY DISABLED FOR LAUNCH
<button className="..." title="Notifications">
  <span className="material-symbols-outlined">notifications</span>
  {unreadCount > 0 && <span className="...">...</span>}
</button>
*/}

{/* TEMPORARILY DISABLED FOR LAUNCH
<button className="..." title="Help & Support">
  <span className="material-symbols-outlined">help</span>
</button>
*/}
```

**Option B: Add "Coming Soon" Alerts (10 min)**
```tsx
// Replace onClick handlers with alerts:

<button 
  onClick={() => alert('Coming Soon! This feature is currently in development.')}
  className="..." 
  title="Advanced Search (Coming Soon)"
>
  <span className="material-symbols-outlined">search</span>
</button>

<button 
  onClick={() => alert('Coming Soon! Notifications will be available in the next release.')}
  className="..." 
  title="Notifications (Coming Soon)"
>
  <span className="material-symbols-outlined">notifications</span>
</button>

<button 
  onClick={() => alert('Need help? Contact support@ppn.network')}
  className="..." 
  title="Help & Support"
>
  <span className="material-symbols-oriented">help</span>
</button>
```

**Testing:**
- [ ] Click each header icon
- [ ] Verify no 404 errors
- [ ] Verify appropriate messaging

---

### **Issue #2: Logout Doesn't Invalidate Session** ⏰ 10 minutes
**Impact:** Security vulnerability - users stay logged in after logout  
**Risk:** CRITICAL - security issue  
**Fix:** Add proper Supabase signOut

#### **Quick Fix:**
**File:** `src/components/TopHeader.tsx`

**Step 1: Add Import (line ~1-10)**
```tsx
import { supabase } from '../supabaseClient';
```

**Step 2: Create Logout Handler (add before return statement)**
```tsx
const handleLogout = async () => {
  try {
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Clear all local storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Close menu
    setIsMenuOpen(false);
    
    // Navigate to home
    navigate('/');
  } catch (error) {
    console.error('Logout error:', error);
    // Still navigate even if error
    navigate('/');
  }
};
```

**Step 3: Update Logout Button (find around line 228)**
```tsx
// BEFORE:
onClick={() => { onLogout(); setIsMenuOpen(false); }}

// AFTER:
onClick={handleLogout}
```

**Testing:**
- [ ] Log in to app
- [ ] Click logout
- [ ] Verify redirected to landing page
- [ ] Try to navigate to /dashboard
- [ ] Verify blocked (redirected to login)
- [ ] Verify localStorage is empty

---

### **Issue #3: Landing Page - Broken Sections** ⏰ 35 minutes
**Impact:** First impression page has visible issues  
**Risk:** HIGH - all visitors see this  
**Fix:** Ultimate Landing Page Redesign

#### **Quick Fix:**
**File:** `src/pages/Landing.tsx`

**Follow:** `LANDING_PAGE_ULTIMATE_REDESIGN.md`

**Steps:**
1. Delete Problem/Solution section (lines 503-600) - 2 min
2. Delete Institutional Proof marquee (lines 712-728) - 1 min
3. Add Global Network section - 10 min
4. Add Mission & Stats section - 15 min
5. Simplify Bento Box - 5 min
6. Add purple gradient CSS - 2 min

**Testing:**
- [ ] Landing page loads without errors
- [ ] All sections display correctly
- [ ] No broken layouts
- [ ] Mobile responsive
- [ ] Desktop looks great

---

## 🟢 **NON-CRITICAL (DEFER TO POST-LAUNCH)**

These can wait until after launch:

### **Deferred Issues:**
- ❌ Protocol Builder can't save (users won't use tonight)
- ❌ Hardcoded constants (not visible to users)
- ❌ Mock data in components (works for demo)
- ❌ Missing reference tables (not blocking)
- ❌ Deep Dive page inconsistencies (minor visual)
- ❌ Substance Monograph tooltips (nice-to-have)
- ❌ Search Portal spacing (minor visual)

**Handle these in Week 1 per STABILIZATION_PLAN.md**

---

## ⏰ **TOTAL TIME: 60 MINUTES**

| Task | Time | Priority |
|------|------|----------|
| Fix Header Navigation | 15 min | 🔴 CRITICAL |
| Fix Logout Security | 10 min | 🔴 CRITICAL |
| Landing Page Redesign | 35 min | 🔴 CRITICAL |
| **TOTAL** | **60 min** | **LAUNCH-READY** |

---

## ✅ **LAUNCH CHECKLIST**

**Before going live, verify:**

### **Navigation:**
- [ ] Header icons don't cause 404 errors
- [ ] All visible links work
- [ ] No broken routes

### **Security:**
- [ ] Logout invalidates session
- [ ] Can't access protected pages after logout
- [ ] Login works correctly

### **Landing Page:**
- [ ] No broken sections
- [ ] All content displays
- [ ] Mobile responsive
- [ ] Desktop looks professional

### **General:**
- [ ] No console errors
- [ ] No PHI/PII visible
- [ ] Site loads quickly
- [ ] All images load

---

## 🚀 **LAUNCH SEQUENCE**

### **Step 1: Fix Critical Issues (60 min)**
1. Fix header navigation (15 min)
2. Fix logout security (10 min)
3. Landing page redesign (35 min)

### **Step 2: Test Everything (15 min)**
1. Test all navigation
2. Test logout flow
3. Test landing page on mobile + desktop
4. Check for console errors

### **Step 3: Build for Production (5 min)**
```bash
npm run build
```

### **Step 4: Deploy (10 min)**
- Upload to hosting (Vercel/Netlify)
- Connect domain
- Test live site

### **Step 5: Monitor (ongoing)**
- Watch for errors
- Check analytics
- Respond to issues

---

## 📊 **LAUNCH READINESS**

**Current State:** 60% ready  
**After Critical Fixes:** 95% ready  
**Timeline:** 60 min + 30 min testing/deploy = **90 min to launch**

---

## 🎯 **POST-LAUNCH PRIORITIES**

**Week 1 (after launch):**
1. Create `protocols` table (Builder - 2 hours)
2. Fix Protocol Builder field mapping (Designer - 1 hour)
3. Create missing ref tables (Builder - 3 hours)
4. Sync constants with Supabase (Designer - 4 hours)
5. Replace mock data (Designer - 2 hours)

**See:** `STABILIZATION_PLAN.md` for complete Week 1 plan

---

## 💡 **CRITICAL REMINDERS**

1. **DO NOT** add new features tonight
2. **DO NOT** refactor working code
3. **DO NOT** touch Dashboard (it works)
4. **DO** test after every change
5. **DO** commit after every fix
6. **DO** keep changes minimal

---

**Ready to fix these 3 critical issues and launch?** 🚀

**Estimated time to launch-ready:** 90 minutes total

---

## 🔧 **BUILDER EXECUTION INSTRUCTIONS**

### **BATCH 1: Fix Header Navigation (15 min)**

**Task:** Disable broken header icons to prevent 404 errors

**File:** `src/components/TopHeader.tsx`

**Instructions:**
1. Find the three icon buttons (search, notifications, help) around lines 150-180
2. Replace their `onClick` handlers with "Coming Soon" alerts
3. Update tooltips to indicate "Coming Soon"
4. Remove notification badge (not functional)

**Specific Changes:**
- Search icon: Add `onClick={() => alert('Coming Soon! Advanced search is currently in development.')}`
- Notifications icon: Add `onClick={() => alert('Coming Soon! Notifications will be available in the next release.')}`
- Help icon: Add `onClick={() => alert('Need help? Contact support@ppn.network')}`
- Remove or comment out the notification count badge

**Test:**
- Click each icon
- Verify alert appears (no 404)
- Verify tooltips show "Coming Soon"

---

### **BATCH 2: Fix Logout Security (10 min)**

**Task:** Add proper Supabase signOut to logout handler

**File:** `src/components/TopHeader.tsx`

**Instructions:**
1. Add import at top of file: `import { supabase } from '../supabaseClient';`
2. Create new async function `handleLogout` before the return statement
3. Update logout button to use `handleLogout` instead of `onLogout`

**Specific Changes:**

**Step 1:** Add import (line ~1-10)
```typescript
import { supabase } from '../supabaseClient';
```

**Step 2:** Add handleLogout function (before return statement, around line 100-120)
```typescript
const handleLogout = async () => {
  try {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    setIsMenuOpen(false);
    navigate('/');
  } catch (error) {
    console.error('Logout error:', error);
    navigate('/');
  }
};
```

**Step 3:** Update logout button (find around line 228)
- Change: `onClick={() => { onLogout(); setIsMenuOpen(false); }}`
- To: `onClick={handleLogout}`

**Test:**
- Log in to app
- Click logout
- Verify redirected to landing page
- Try to access /dashboard
- Verify blocked (must log in again)
- Check localStorage is empty

---

### **BATCH 3: Landing Page Redesign (35 min)**

**Task:** Replace broken sections with Global Network and Mission & Stats

**File:** `src/pages/Landing.tsx`

**Instructions:**
1. Delete Problem/Solution section (lines 503-600)
2. Delete Institutional Proof marquee (lines 712-728)
3. Add Global Network section after Product Showcase
4. Add Mission & Stats section after Global Network
5. Simplify Bento Box heading
6. Add purple gradient CSS to index.css

**Specific Changes:**

**Step 1:** Delete lines 503-600 (entire Problem vs Solution section)

**Step 2:** Delete lines 712-728 (Institutional Proof marquee)

**Step 3:** Add Global Network section (insert after Product Showcase, before Bento Box)
- Copy code from `LANDING_PAGE_ULTIMATE_REDESIGN.md` Step 2

**Step 4:** Add Mission & Stats section (insert after Global Network)
- Copy code from `LANDING_PAGE_ULTIMATE_REDESIGN.md` Step 3

**Step 5:** Update Bento Box heading (around line 604)
- Change to: `Clinical <span className="text-gradient-primary inline-block pb-1">Intelligence</span> Infrastructure`

**Step 6:** Add to `src/index.css`:
```css
.text-gradient-purple {
  background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**Test:**
- Landing page loads without errors
- Global Network section displays
- Mission & Stats section displays
- No broken layouts
- Test on mobile (responsive)
- Test on desktop (looks great)

---

## ✅ **BUILDER CHECKLIST**

Execute batches in order:

- [ ] **BATCH 1:** Header Navigation (15 min)
  - [ ] Updated icon onClick handlers
  - [ ] Tested all icons show alerts
  - [ ] No 404 errors
  - [ ] Commit changes

- [ ] **BATCH 2:** Logout Security (10 min)
  - [ ] Added supabase import
  - [ ] Created handleLogout function
  - [ ] Updated logout button
  - [ ] Tested logout flow
  - [ ] Verified session invalidated
  - [ ] Commit changes

- [ ] **BATCH 3:** Landing Page (35 min)
  - [ ] Deleted Problem/Solution section
  - [ ] Deleted Institutional Proof
  - [ ] Added Global Network section
  - [ ] Added Mission & Stats section
  - [ ] Updated Bento heading
  - [ ] Added purple gradient CSS
  - [ ] Tested landing page
  - [ ] Tested mobile responsive
  - [ ] Commit changes

---

## 🚀 **AFTER ALL BATCHES COMPLETE**

**Final Testing (15 min):**
- [ ] Test all navigation (no 404s)
- [ ] Test logout flow (session invalidated)
- [ ] Test landing page (mobile + desktop)
- [ ] Check console for errors
- [ ] Verify no PHI/PII visible

**Build for Production (5 min):**
```bash
npm run build
```

**Deploy (10 min):**
- Upload to hosting
- Connect domain
- Test live site

---

**Total Time:** 60 min (fixes) + 30 min (testing/deploy) = **90 minutes to launch** 🎉
