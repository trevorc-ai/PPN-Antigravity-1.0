---
work_order_id: WO_007
title: Fix TopHeader Profile & Analytics Chart Rendering
type: BUG
category: Bug
priority: MEDIUM
status: ASSIGNED
created: 2026-02-14T21:38:32-08:00
reviewed_by: LEAD
reviewed_at: 2026-02-14T22:41:56-08:00
requested_by: Trevor Calton
assigned_to: BUILDER
estimated_complexity: 4/10
failure_count: 0
---

# Work Order: Fix TopHeader Profile & Analytics Chart Rendering

## 🎯 THE GOAL

Resolve three specific UI/UX issues identified in the salvage logs:

1. **TopHeader:** Replace the hardcoded "Dr. Sarah Jenkins" string with real user data fetched from Supabase Auth
2. **Analytics Charts:** Eliminate console warnings related to Recharts rendering, fix tooltip positioning, and ensure legends display correctly
3. **Analytics Layout:** Fix the filter dropdowns on the Analytics page to prevent them from breaking the layout or being cut off

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

You are ONLY allowed to modify the following specific files/areas:

- `src/components/layout/TopHeader.tsx`
- `src/pages/Analytics.tsx`
- `src/components/analytics/` (Chart components)

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Modify the Supabase authentication logic itself, only the frontend display consumption
- Change the underlying data fetching logic for the charts, only the rendering/display layer
- Refactor the global layout container
- Touch any other components or pages
- Modify routing or navigation
- Change database queries

**MUST:**
- Only fix the display/rendering issues
- Preserve existing functionality
- Maintain current data flow

---

## ✅ Acceptance Criteria

### Issue 1: TopHeader Profile Data
- [ ] Remove hardcoded "Dr. Sarah Jenkins" string
- [ ] Fetch user profile data from Supabase Auth
- [ ] Display user's actual name from `user_profiles` table
- [ ] Handle loading state gracefully
- [ ] Handle missing profile data with fallback
- [ ] No console errors related to user data

### Issue 2: Analytics Charts Rendering
- [ ] Eliminate all Recharts console warnings
- [ ] Fix tooltip positioning issues
- [ ] Ensure legends display correctly
- [ ] Verify all chart types render without errors
- [ ] Test responsive behavior on mobile/tablet

### Issue 3: Analytics Filter Dropdowns
- [ ] Fix dropdown layout breaking issues
- [ ] Ensure dropdowns don't get cut off
- [ ] Verify proper z-index stacking
- [ ] Test on different screen sizes
- [ ] Ensure dropdowns are fully clickable

---

## 🧪 Testing Requirements

- [ ] Test TopHeader with real user logged in
- [ ] Test TopHeader with new user (no profile)
- [ ] Verify no console warnings from Recharts
- [ ] Test all chart tooltips position correctly
- [ ] Test all chart legends display correctly
- [ ] Test Analytics filter dropdowns on desktop
- [ ] Test Analytics filter dropdowns on mobile
- [ ] Verify no layout breaks at any screen size

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- **Chart Legends:** Ensure sufficient color contrast (WCAG AA minimum)
- **Tooltips:** Must be keyboard accessible
- **Dropdowns:** Must be keyboard navigable
- **Screen Readers:** User name must be announced correctly

### SECURITY
- **NO PHI/PII:** No collection of personally identifiable information
- **Auth Only:** Only display data user is authorized to see
- **No Logging:** Don't log user profile data to console

---

## 🚦 Status

**INBOX** - Ready for BUILDER assignment

---

## 📋 Technical Notes

### Issue 1: TopHeader Fix

**Current Code (Hardcoded):**
```tsx
// TopHeader.tsx - BEFORE
<span>Dr. Sarah Jenkins</span>
```

**Expected Fix:**
```tsx
// TopHeader.tsx - AFTER
const { user } = useAuth();
const [profile, setProfile] = useState(null);

useEffect(() => {
  if (user) {
    fetchUserProfile(user.id);
  }
}, [user]);

<span>{profile?.display_name || user?.email || 'User'}</span>
```

### Issue 2: Recharts Warnings

Common Recharts issues to fix:
- Missing `key` props in chart children
- Incorrect `dataKey` references
- Tooltip overflow outside container
- Legend positioning conflicts

**Example Fix:**
```tsx
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <Tooltip 
      wrapperStyle={{ zIndex: 1000 }}
      position={{ y: 0 }}
    />
    <Legend 
      verticalAlign="bottom" 
      height={36}
    />
  </LineChart>
</ResponsiveContainer>
```

### Issue 3: Dropdown Layout

**Common fixes:**
- Add `position: relative` to parent container
- Set proper `z-index` for dropdown menu
- Use `overflow: visible` on parent
- Add `min-width` to prevent text cutoff

---

## 🎨 Design Specifications

### TopHeader
- User name should match existing text styling
- Loading state: Show skeleton or "Loading..."
- Fallback: Display email or "User" if no profile

### Chart Legends
- Minimum contrast ratio: 4.5:1
- Font size: 12px minimum
- Clear visual separation from chart

### Dropdowns
- z-index: 50 or higher
- Min width: 200px
- Max height with scroll if needed
- Proper shadow for depth

---

## 📋 Known Issues from Salvage Report

Reference the following specific issues mentioned in salvage logs:

1. **TopHeader:** Hardcoded user name instead of dynamic data
2. **Recharts:** Console warnings about missing keys and positioning
3. **Analytics:** Filter dropdowns breaking layout on smaller screens

---

## Dependencies

None - This is a standalone bug fix work order.

---

## 🔍 INSPECTOR QA APPROVAL

**Reviewed By:** INSPECTOR  
**Review Date:** 2026-02-15T00:53:13-08:00  
**Status:** ✅ **APPROVED**

### Accessibility Compliance

**✅ APPROVED:**
- Chart legends require minimum 4.5:1 contrast ratio
- Tooltips must be keyboard accessible
- Dropdowns must be keyboard navigable
- Screen reader support for user name
- Minimum 12px font size for chart legends

### Security Compliance

**✅ APPROVED:**
- No PHI/PII collection
- Auth-only data display
- No console logging of user profile data
- User isolation enforced

**VERDICT:** This work order is compliant with all accessibility and PHI rules. Cleared for USER_REVIEW.
