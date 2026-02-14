# Command #009: TopHeader Fix - URGENT

**Date Issued:** Feb 13, 2026, 5:50 PM PST  
**Issued By:** LEAD (on behalf of User)  
**Assigned To:** BUILDER  
**Priority:** P0 - URGENT - USER NEEDS THIS ASAP  
**Estimated Time:** 1-2 hours  
**Start After:** Legal Pages complete OR IMMEDIATELY if Legal Pages done

---

## DIRECTIVE

**USER SAYS:** "I need this done ASAP!!!!!"

Fix TopHeader.tsx to display real user profile data from Supabase instead of hardcoded "Dr. Sarah Jenkins".

---

## IMPLEMENTATION PLAN

Full plan: `/Users/trevorcalton/.gemini/antigravity/brain/ec364aaf-2cd2-4f3f-9b70-fcc3645108de/topheader_fix_plan.md`

**Quick Summary:**

### Files to Modify
1. `src/components/TopHeader.tsx` (lines 52, 224)
2. `src/contexts/AuthContext.tsx` (add userProfile state)

### Changes Required

**1. Update AuthContext.tsx:**
```typescript
// Add to AuthContext interface
userProfile: {
  full_name: string;
  credentials: string;
  avatar_url?: string;
} | null;

// Fetch user profile on login
const { data: profile } = await supabase
  .from('user_profiles')
  .select('full_name, credentials, avatar_url')
  .eq('user_id', user.id)
  .single();
```

**2. Update TopHeader.tsx:**
```typescript
// Replace hardcoded values
const { userProfile } = useAuth();

// Line 52 - Desktop name
<span className="font-bold">{userProfile?.full_name || 'User'}</span>

// Line 224 - Mobile name  
<div className="font-bold">{userProfile?.full_name || 'User'}</div>
```

---

## VERIFICATION

1. Login as test user
2. Check TopHeader shows correct name from `user_profiles` table
3. Test on desktop and mobile viewports
4. Verify logout still works

---

## DELIVERABLE

- ✅ TopHeader displays real user data
- ✅ Works for all users (not just hardcoded)
- ✅ Tested on desktop and mobile
- ✅ Screenshot showing real user name

---

## URGENCY

**USER PRIORITY:** ASAP - This is blocking pricing page and user tiers implementation.

**EXECUTE IMMEDIATELY AFTER LEGAL PAGES OR NOW IF LEGAL PAGES COMPLETE**
