---
id: WO-006
status: 03_BUILD
priority: P1 (Critical)
category: Bug / Authentication
owner: BUILDER
assigned_date: 2026-02-15T11:07:00-08:00
failure_count: 0
created_date: 2026-02-15T11:07:00-08:00
---

# User Request

**TASK TITLE:** Fix Non-Functional Logout Button (BLOCKING USER TESTING)

## 1. THE GOAL

The logout button in the user profile dropdown menu is completely non-functional. Clicking "Sign Out of Node" does not trigger any action - no network requests, no console errors, no navigation. The user remains stuck on the dashboard and cannot log out to test different authentication states.

### Critical Impact:
- **User is blocked from testing visual changes** across different authentication states
- Cannot verify login/logout flows
- Cannot test tier-based access controls
- Cannot validate user profile data display

### Technical Analysis:

**Code Location:** `/src/components/TopHeader.tsx` lines 290-296

```tsx
<button
  onClick={handleLogout}
  className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/5 transition-all text-xs font-bold"
>
  <span className="material-symbols-outlined text-lg">logout</span>
  Sign Out of Node
</button>
```

**Handler Function:** Lines 115-118

```tsx
const handleLogout = async () => {
  setIsMenuOpen(false);
  await signOut();
};
```

**Browser Testing Results:**
- ✅ Button renders correctly in DOM
- ✅ Button is clickable (not disabled)
- ❌ onClick event does not fire
- ❌ No network requests to Supabase auth
- ❌ No console errors
- ❌ No navigation occurs
- ❌ User remains logged in

**Hypothesis:**
The `handleLogout` function appears correct but the click event is not being triggered. Possible causes:
1. Event propagation issue with parent dropdown menu
2. Z-index/overlay blocking clicks
3. React event handler not properly attached
4. Async/await issue with `signOut()` from AuthContext

## 2. THE BLAST RADIUS (Authorized Target Area)

- `/frontend/src/components/TopHeader.tsx` (logout button and handler)
- `/frontend/src/contexts/AuthContext.tsx` (signOut function)
- `/frontend/src/App.tsx` (if routing logic needs adjustment)

## 3. THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

- DO NOT modify the visual design of the dropdown menu
- DO NOT change the user profile data fetching logic
- DO NOT alter any other authentication flows (login, signup)
- DO NOT modify Supabase configuration
- DO NOT touch any clinical data or RLS policies

## 4. MANDATORY COMPLIANCE

### Accessibility:
- Maintain existing font sizes and styling
- Ensure logout button remains keyboard accessible
- Preserve hover states and visual feedback

### Security:
- Ensure complete session cleanup on logout
- Clear localStorage and sessionStorage
- Invalidate Supabase session properly
- Redirect to landing page after logout

## 5. ACCEPTANCE CRITERIA

- [ ] Clicking "Sign Out of Node" triggers the logout handler
- [ ] Supabase auth.signOut() is called successfully
- [ ] User is redirected to landing page (/)
- [ ] localStorage and sessionStorage are cleared
- [ ] User cannot access protected routes after logout
- [ ] Browser testing confirms logout works
- [ ] User can log back in after logging out

## 6. TESTING INSTRUCTIONS

### Manual Browser Test:
1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Log in with test credentials
4. Click user profile dropdown (top-right)
5. Click "Sign Out of Node" button
6. **EXPECTED:** User is logged out and redirected to landing page
7. **VERIFY:** Cannot access `/dashboard` without logging in again
8. Log back in to confirm authentication still works

### Browser Console Test:
1. Open DevTools Console
2. Attempt logout
3. **VERIFY:** No errors in console
4. **VERIFY:** Network tab shows Supabase signOut request
5. **VERIFY:** localStorage/sessionStorage are cleared

## 7. VISUAL REFERENCE

Browser testing screenshot showing the logout button that does not respond to clicks:
- User profile dropdown is open
- "Sign Out of Node" button is visible with red styling
- Clicking has no effect - user remains on dashboard

---

## LEAD ARCHITECTURE

### Root Cause Analysis

After browser testing and code review, the issue is **NOT** with the click handler attachment. The `onClick={handleLogout}` is properly bound at line 291 of `TopHeader.tsx`.

**The real problem:** The `handleLogout` function (lines 115-118) calls `signOut()` from `AuthContext`, but this function may be failing silently or the async operation is not completing.

**Evidence:**
1. ✅ Button renders correctly
2. ✅ onClick handler is attached
3. ❌ No network requests fire
4. ❌ No console errors
5. ❌ No navigation occurs

**Hypothesis:** The `signOut()` function from `AuthContext.tsx` (lines 39-46) may have an issue with the async/await flow or the Supabase client instance.

### Technical Strategy

**Phase 1: Add Debugging & Error Handling**
1. Add console.log statements to track execution flow
2. Wrap `signOut()` call in try/catch with explicit error logging
3. Add toast notification for user feedback

**Phase 2: Verify Supabase Client**
4. Ensure `supabase` instance is properly initialized
5. Verify `supabase.auth.signOut()` is being called
6. Check for any middleware or interceptors blocking the request

**Phase 3: Fallback Strategy**
7. If AuthContext `signOut()` fails, implement direct logout in `handleLogout`
8. Ensure localStorage/sessionStorage clearing happens regardless
9. Force navigation to `/` even if Supabase call fails

### Implementation Plan

**File:** `/frontend/src/components/TopHeader.tsx`

**Change 1:** Update `handleLogout` function (lines 115-118)

```tsx
// BEFORE
const handleLogout = async () => {
  setIsMenuOpen(false);
  await signOut();
};

// AFTER
const handleLogout = async () => {
  console.log('[TopHeader] Logout initiated');
  setIsMenuOpen(false);
  
  try {
    console.log('[TopHeader] Calling signOut from AuthContext');
    await signOut();
    console.log('[TopHeader] signOut completed successfully');
    
    // Show success toast
    addToast({
      title: 'Logged Out',
      message: 'You have been signed out successfully.',
      type: 'success'
    });
  } catch (error) {
    console.error('[TopHeader] Logout error:', error);
    
    // Fallback: force logout even if signOut fails
    try {
      await supabase.auth.signOut();
    } catch (supabaseError) {
      console.error('[TopHeader] Supabase signOut also failed:', supabaseError);
    }
    
    // Clear storage manually
    localStorage.clear();
    sessionStorage.clear();
    
    // Show error toast
    addToast({
      title: 'Logged Out',
      message: 'Session ended (with errors)',
      type: 'warning'
    });
    
    // Force navigation
    navigate('/');
  }
};
```

**File:** `/frontend/src/contexts/AuthContext.tsx`

**Change 2:** Add debugging to `signOut` function (lines 39-46)

```tsx
// BEFORE
const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/'; // Force full page reload to clear state
};

// AFTER
const signOut = async () => {
    console.log('[AuthContext] signOut called');
    try {
        console.log('[AuthContext] Calling supabase.auth.signOut()');
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            console.error('[AuthContext] Supabase signOut error:', error);
            throw error;
        }
        
        console.log('[AuthContext] Supabase signOut successful');
        setUser(null);
        setSession(null);
        localStorage.clear();
        sessionStorage.clear();
        
        console.log('[AuthContext] Redirecting to /');
        window.location.href = '/'; // Force full page reload to clear state
    } catch (error) {
        console.error('[AuthContext] signOut failed:', error);
        // Still clear local state even if Supabase call fails
        setUser(null);
        setSession(null);
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/';
        throw error; // Re-throw so caller can handle
    }
};
```

### Verification Plan

**Automated Testing:**
- None available (no existing auth tests found)

**Manual Browser Testing:**
1. Start dev server: `npm run dev`
2. Open browser to `http://localhost:3000`
3. Log in with test credentials
4. Open DevTools Console
5. Click user profile dropdown (top-right)
6. Click "Sign Out of Node" button
7. **VERIFY in Console:**
   - See `[TopHeader] Logout initiated`
   - See `[TopHeader] Calling signOut from AuthContext`
   - See `[AuthContext] signOut called`
   - See `[AuthContext] Calling supabase.auth.signOut()`
   - See either success or error messages
8. **VERIFY in Browser:**
   - User is redirected to landing page `/`
   - Toast notification appears
   - Cannot access `/dashboard` without logging in
9. **VERIFY in DevTools Application tab:**
   - localStorage is empty
   - sessionStorage is empty
10. Log back in to confirm authentication still works

**Expected Console Output (Success):**
```
[TopHeader] Logout initiated
[TopHeader] Calling signOut from AuthContext
[AuthContext] signOut called
[AuthContext] Calling supabase.auth.signOut()
[AuthContext] Supabase signOut successful
[AuthContext] Redirecting to /
```

**Expected Console Output (Failure):**
```
[TopHeader] Logout initiated
[TopHeader] Calling signOut from AuthContext
[AuthContext] signOut called
[AuthContext] Calling supabase.auth.signOut()
[AuthContext] Supabase signOut error: [error details]
[TopHeader] Logout error: [error details]
[TopHeader] Supabase signOut also failed: [error details]
```

### Assignment

**Owner:** BUILDER  
**Status:** 03_BUILD  
**Priority:** P1 (Critical) - BLOCKING USER TESTING

This ticket should be fast-tracked through the pipeline.

