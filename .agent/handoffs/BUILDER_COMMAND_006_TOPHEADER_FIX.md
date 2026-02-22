# Command #006: TopHeader Fix - Display Real User Profile

**Date Issued:** Feb 13, 2026, 5:30 PM PST  
**Issued By:** LEAD (on behalf of User)  
**Assigned To:** BUILDER  
**Priority:** P1 - High (Post-Launch, Pre-Pricing)  
**Deadline:** Feb 14, 2026 EOD

---

## Directive

Fix TopHeader.tsx to display real user profile data from Supabase instead of hardcoded "Dr. Sarah Jenkins".

---

## Context

**Current Problem:**
- TopHeader shows "Dr. Sarah Jenkins" for ALL users (hardcoded)
- Blocks user tiers/permissions implementation
- Blocks pricing page (needs role-based display)

**User Decision:**
- Fix TopHeader BEFORE implementing pricing page
- Approved implementation plan: [topheader_fix_plan.md](file:///Users/trevorcalton/.gemini/antigravity/brain/ec364aaf-2cd2-4f3f-9b70-fcc3645108de/topheader_fix_plan.md)

---

## Implementation Plan

**File to Modify:** `/Users/trevorcalton/Desktop/PPN-Antigravity-1.0/src/components/TopHeader.tsx`

**Changes Required:**

1. **Import AuthContext** (replace CLINICIANS import)
2. **Use real user data** from `useAuth()` hook
3. **Display real name** (not "Dr. Sarah Jenkins")
4. **Display real email** (not hardcoded)
5. **Display real role** (from user_profiles.role)
6. **Handle avatar** (use avatar_url or generate from name)

**Detailed Spec:** See [topheader_fix_plan.md](file:///Users/trevorcalton/.gemini/antigravity/brain/ec364aaf-2cd2-4f3f-9b70-fcc3645108de/topheader_fix_plan.md)

---

## Success Criteria

- ✅ TopHeader displays real user name (not hardcoded)
- ✅ TopHeader displays real user email
- ✅ TopHeader displays real user role
- ✅ Profile picture shows (avatar or generated)
- ✅ No console errors
- ✅ Works for all users (not just Admin)

---

## Timeline

**Estimated Time:** 1-2 hours

**Start After:** Legal Pages complete (ETA Feb 14, 2PM)

**Target Completion:** Feb 14, 2026 EOD

---

## Dependencies

**Required:**
- ✅ AuthContext exists
- ✅ user_profiles table exists
- ✅ User is logged in

**Blockers:**
- ⏳ Legal Pages must complete first (Command #001)

---

## Next Steps After Completion

1. Pricing Page Implementation (MARKETER → DESIGNER → BUILDER)
2. User Tiers/Permissions (BUILDER - frontend)
3. Protocol Builder Fixes (DESIGNER audit issues)

---

**BUILDER: Please acknowledge receipt within 2 hours by commenting:**

"✅ ACKNOWLEDGED - Command #006 received. Will start after Legal Pages complete. ETA: Feb 14 EOD"
