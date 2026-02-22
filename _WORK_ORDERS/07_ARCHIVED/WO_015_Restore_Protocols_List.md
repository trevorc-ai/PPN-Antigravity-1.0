---
work_order_id: WO_015
title: Restore My Protocols List View
type: BUG
category: Bug
priority: MEDIUM
status: ASSIGNED
created: 2026-02-14T22:02:22-08:00
reviewed_by: LEAD
reviewed_at: 2026-02-14T22:41:56-08:00
requested_by: PPN Admin
assigned_to: BUILDER
estimated_complexity: 4/10
failure_count: 0
---

# Work Order: Restore My Protocols List View

## 🎯 THE GOAL

Restore the "My Protocols" list view.

### PRE-FLIGHT CHECK

1. Navigate to `/protocols` (or check the route file)
2. If the page loads successfully and shows a list, **ABORT** (Ticket Complete)
3. If it crashes or shows a modal error, proceed with restoration

### Directives

1. Implement a clean table view using a **REUSABLE** `ProtocolTable` component (if not present)
2. Remove broken modal logic
3. Ensure navigation to detail view works

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

- `src/pages/MyProtocols.tsx`
- `src/components/protocols/ProtocolTable.tsx` (New/Update)

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Delete the "New Builder" code if it lives in a separate file/route
- Overwrite working code; only fix the crash
- Modify any other components or pages

**MUST:**
- Preserve existing functionality
- Only fix the broken parts

---

## ✅ Acceptance Criteria

### Pre-Flight Verification
- [ ] Navigate to `/protocols` route
- [ ] Document current state (working/broken)
- [ ] If working, mark ticket as "Cannot Reproduce"

### List View Restoration (if needed)
- [ ] Page loads without crashes
- [ ] Protocols display in table format
- [ ] Table uses reusable `ProtocolTable` component
- [ ] Broken modal logic removed
- [ ] Navigation to detail view works

### RLS Verification
- [ ] User sees only their own protocols
- [ ] No cross-user data leakage
- [ ] Empty state for users with no protocols

---

## 🧪 Testing Requirements

- [ ] Test page loads without errors
- [ ] Test with user who has protocols
- [ ] Test with user who has no protocols
- [ ] Test navigation to protocol detail
- [ ] Verify RLS (user sees only their data)
- [ ] Test table accessibility with screen reader

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- **Table headers must be accessible**
- Semantic table structure
- Screen reader compatible

### SECURITY
- **RLS Check:** User sees only their own data
- No cross-user data access
- Proper authentication checks

---

## 🚦 Status

**INBOX** - Ready for BUILDER assignment

---

## 📋 Technical Notes

### Expected Component Structure
```tsx
interface ProtocolTableProps {
  protocols: Protocol[];
  onProtocolClick?: (id: string) => void;
}
```

### Common Issues
- Modal logic blocking list view
- Navigation broken after modal removal
- RLS policy not filtering by user_id

---

## Dependencies

None - This is a standalone bug fix.

---

## 🔍 INSPECTOR QA APPROVAL

**Reviewed By:** INSPECTOR  
**Review Date:** 2026-02-15T00:53:13-08:00  
**Status:** ✅ **APPROVED**

### Accessibility Compliance

**✅ APPROVED:**
- Table headers must be accessible
- Semantic table structure required
- Screen reader compatibility mandated

### Security Compliance

**✅ APPROVED:**
- RLS check enforced (user sees only their own data)
- No cross-user data access
- Proper authentication checks
- Empty state handling for users with no protocols

**VERDICT:** This work order is compliant with all accessibility and PHI rules. Cleared for USER_REVIEW.
