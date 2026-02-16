---
work_order_id: WO_008
title: Implement User Profile Editing & Partner Tiers
type: FEATURE
category: Feature
priority: MEDIUM
status: ASSIGNED
created: 2026-02-14T21:39:25-08:00
reviewed_by: LEAD
reviewed_at: 2026-02-14T22:41:56-08:00
requested_by: Trevor Calton
assigned_to: BUILDER
estimated_complexity: 5/10
failure_count: 0
---

# Work Order: Implement User Profile Editing & Partner Tiers

## 🎯 THE GOAL

Implement the "Edit Profile" functionality and expose Partner Tiers in the UI.

1. **Create/Update ProfileEdit.tsx** to allow users to modify their display name, specialty, and privacy settings
2. **Implement "Partner Tier" badge logic** in the profile view based on the user's tier (e.g., Free, Pro, Partner)
3. **Ensure "Optional Profile" privacy setting** correctly toggles visibility

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

You are ONLY allowed to modify the following specific files/areas:

- `src/pages/Profile.tsx`
- `src/pages/ProfileEdit.tsx` (New Component - CREATE THIS)
- `src/components/profile/` (Profile-related components)

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Modify the database schema (The `profiles` table already exists)
- Change the authentication flow or login screen
- Alter the navigation menu structure beyond linking to the Profile page
- Touch any other pages or components
- Modify Supabase auth configuration

**MUST:**
- Use existing `user_profiles` table structure
- Preserve existing profile data
- Handle missing profile data gracefully

---

## ✅ Acceptance Criteria

### Profile Editing
- [ ] ProfileEdit.tsx component created
- [ ] Form allows editing: display_name, specialty, privacy settings
- [ ] Form validates input (e.g., max length, required fields)
- [ ] Save button updates `user_profiles` table
- [ ] Success/error feedback displayed to user
- [ ] Cancel button returns to profile view
- [ ] All form inputs have visible labels (1:1 ratio)

### Partner Tier Badges
- [ ] Badge displays user's tier (Free, Pro, Partner)
- [ ] Badge styling matches tier level
- [ ] Badge visible on Profile.tsx
- [ ] Tier data fetched from `user_profiles.role_tier`
- [ ] Fallback for users without tier set

### Privacy Settings
- [ ] "Optional Profile" toggle implemented
- [ ] Toggle updates `user_profiles` table
- [ ] Privacy setting affects profile visibility
- [ ] Clear explanation of what privacy setting does
- [ ] Setting persists across sessions

---

## 🧪 Testing Requirements

- [ ] Test profile editing with valid data
- [ ] Test profile editing with invalid data
- [ ] Verify tier badges display correctly for each tier
- [ ] Test privacy toggle on/off
- [ ] Verify profile updates save to database
- [ ] Test with user who has no profile data
- [ ] Verify all form inputs are keyboard accessible
- [ ] Test screen reader announces labels correctly

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- **Form Inputs Must Have 1:1 Labels:** Every input must have a visible, associated label
- **Keyboard Navigation:** All form controls must be keyboard accessible
- **Error Messages:** Must be announced to screen readers
- **Focus Management:** Focus should move logically through form

### SECURITY
- **NO PHI/PII:** No collection of personally identifiable information beyond what's already in schema
- **User Isolation:** Users can only edit their own profile
- **Input Validation:** Sanitize all user inputs
- **RLS:** Ensure Row Level Security enforced on updates

---

## 🚦 Status

**INBOX** - Ready for BUILDER assignment

---

## 📋 Technical Notes

### Database Schema Reference
```sql
-- user_profiles table (already exists)
- id (uuid)
- user_id (uuid, FK to auth.users)
- display_name (text)
- specialty (text)
- role_tier (text) -- 'free', 'pro', 'partner'
- is_profile_public (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

### ProfileEdit Component Structure
```tsx
interface ProfileEditProps {
  userId: string;
  onSave?: () => void;
  onCancel?: () => void;
}

interface ProfileFormData {
  display_name: string;
  specialty: string;
  is_profile_public: boolean;
}
```

### Partner Tier Badge Logic
```tsx
const getTierBadge = (tier: string) => {
  switch (tier) {
    case 'partner':
      return { label: 'Partner', color: 'purple', icon: '⭐' };
    case 'pro':
      return { label: 'Pro', color: 'blue', icon: '💎' };
    case 'free':
    default:
      return { label: 'Free', color: 'gray', icon: '🆓' };
  }
};
```

### Update Profile Function
```typescript
const updateProfile = async (data: ProfileFormData) => {
  const { error } = await supabase
    .from('user_profiles')
    .update({
      display_name: data.display_name,
      specialty: data.specialty,
      is_profile_public: data.is_profile_public,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', user.id);
  
  if (error) throw error;
};
```

---

## 🎨 Design Specifications

### Partner Tier Badges
- **Partner:** Purple background, gold border, star icon
- **Pro:** Blue background, silver border, diamond icon
- **Free:** Gray background, no border, basic icon

### ProfileEdit Form
- Clean, card-based layout
- Clear section headers
- Inline validation messages
- Primary action button (Save)
- Secondary action button (Cancel)

### Privacy Toggle
- Clear on/off states
- Explanation text below toggle
- Visual feedback on change

---

## 📋 Form Fields

### Display Name
- Type: Text input
- Label: "Display Name"
- Max length: 100 characters
- Required: Yes
- Validation: No special characters

### Specialty
- Type: Text input or Dropdown
- Label: "Specialty"
- Max length: 100 characters
- Required: No
- Examples: "Psychiatrist", "Therapist", "Researcher"

### Profile Visibility
- Type: Toggle/Checkbox
- Label: "Make my profile public"
- Default: false
- Help text: "Allow other practitioners to view your profile"

---

## Dependencies

None - This is a standalone feature work order.

---

## 🔍 INSPECTOR QA APPROVAL

**Reviewed By:** INSPECTOR  
**Review Date:** 2026-02-15T00:53:13-08:00  
**Status:** ✅ **APPROVED**

### Accessibility Compliance

**✅ APPROVED:**
- All form inputs have 1:1 visible labels
- Keyboard navigation for all form controls
- Error messages announced to screen readers
- Logical focus management
- Tier badges use color + text (not color-only)

### Security Compliance

**✅ APPROVED:**
- No PHI/PII collection beyond existing schema
- User isolation (users can only edit own profile)
- Input validation and sanitization required
- RLS enforcement on updates
- No free-text fields that could collect unauthorized data

**VERDICT:** This work order is compliant with all accessibility and PHI rules. Cleared for USER_REVIEW.
