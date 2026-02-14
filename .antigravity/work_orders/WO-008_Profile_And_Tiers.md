# Work Order: Profile & Partner Tiers Implementation

**WO Number:** WO-008
**Created:** 2026-02-14
**Priority:** P0 (Critical - User Request)
**Assigned To:** BUILDER (Design by DESIGNER)
**Status:** BUILDER_READY

## 1. Objective
Implement the missing "Edit Profile" functionality, enforce "Optional Profile" privacy visibility, and expose Partner Tiers in the UI.

## 2. Scope

### A. Edit Profile Feature
- **New Component:** `src/pages/ProfileEdit.tsx`
- **Fields:**
  - Display Name (Text)
  - Specialty (Text/Select)
  - Organization (Text)
  - Bio/Mission (Text - User explicitly requested "build their profile")
  - Profile Visibility (Toggle - Private/Public)
- **Entry Points:**
  - Add "Edit Profile" button to `Settings.tsx`
  - Add "Edit Profile" button to `TopHeader.tsx` dropdown
  - Add "Complete Profile" card to `Dashboard.tsx` (dismissible)

### B. Partner Tiers UI
- **Registration Flow:**
  - Add Tier Selection step to Sign Up (Free Pilot, Paid Pilot, Partner)
- **Settings/Subscription:**
  - Display current Tier in `Settings.tsx`
  - Allow upgrade/downgrade request (mock flow is fine, just need UI)

### C. Privacy Enforceability
- **Sign Up / Onboarding:**
  - Add explicit "Skip for now" button with checking "I am in a non-legal state" (privacy-first)
- **Profile View:**
  - Display "Private Profile" badge if visibility is off

## 3. Technical Implementation
- Use `supabase.auth.updateUser()` for metadata
- Use `user_profiles` table for application data
- Ensure RLS policies allow the updates

## 4. Success Criteria
- [ ] User can edit their Display Name and Bio
- [ ] User can toggle "Private Profile"
- [ ] "Edit Profile" button is visible in TopHeader
- [ ] Partner Tiers are visible in Settings

---
**LEAD NOTE:** Immediate execution required.
