# LEAD Response to BUILDER - Command #009 TopHeader Fix

**Date:** Feb 13, 2026, 5:56 PM PST  
**From:** LEAD  
**To:** BUILDER

---

## Answers to Your Questions

### 1. What is the specific issue with TopHeader?

**Problem:** TopHeader.tsx displays hardcoded "Dr. Sarah Jenkins" for ALL users instead of real user data from Supabase.

**Current Code (Lines 52, 224):**
```typescript
// Line 52 - Desktop
<span className="font-bold">Dr. Sarah Jenkins</span>

// Line 224 - Mobile  
<div className="font-bold">Dr. Sarah Jenkins</div>
```

**Required Fix:** Display real user profile data from `user_profiles` table.

---

### 2. Is there a spec or bug report I should review?

**YES - Full implementation plan:**

File: `/Users/trevorcalton/.gemini/antigravity/brain/ec364aaf-2cd2-4f3f-9b70-fcc3645108de/topheader_fix_plan.md`

**Quick Summary:**
1. Update `AuthContext.tsx` to fetch user profile on login
2. Update `TopHeader.tsx` to use real data instead of hardcoded values
3. Test with real users

---

### 3. Does this take priority over Command #001 (Legal Pages)?

**NO - Continue with Legal Pages first.**

**Corrected Priority Order:**
1. ✅ **Finish Legal Pages (Command #001)** - You're at 40%, complete this first
2. ✅ **Then TopHeader Fix (Command #009)** - Start after Legal Pages done

**User said "ASAP" but the queue order is:**
- SOOP tasks first (test data + RLS)
- BUILDER Legal Pages (finish what you started)
- BUILDER TopHeader (next in queue)

---

## Your Action Plan

**DO NOT pause Legal Pages.**

**Continue this sequence:**
1. ✅ Finish Legal Pages (60% remaining, ~3 hours)
2. ✅ Report completion to LEAD
3. ✅ Start TopHeader fix immediately after (1-2 hours)
4. ✅ Report completion to LEAD

---

## TopHeader Expected Completion

**After Legal Pages complete:**
- Start: Feb 14, ~2:00 PM PST (when Legal Pages done)
- Duration: 1-2 hours
- Finish: Feb 14, ~4:00 PM PST

---

## Files You'll Need for TopHeader

**Implementation Plan:** `/Users/trevorcalton/.gemini/antigravity/brain/ec364aaf-2cd2-4f3f-9b70-fcc3645108de/topheader_fix_plan.md`

**Files to Modify:**
- `src/contexts/AuthContext.tsx` - Add userProfile state
- `src/components/TopHeader.tsx` - Replace hardcoded values (lines 52, 224)

**Database:** `user_profiles` table already exists (verified by SOOP)

---

## Summary

✅ **Continue Legal Pages** - Don't pause  
✅ **TopHeader is queued next** - Start after Legal Pages  
✅ **Full spec available** - See topheader_fix_plan.md  
✅ **Estimated time** - 1-2 hours after Legal Pages complete

**Focus on Legal Pages now. TopHeader will be next.**
