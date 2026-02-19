---
work_order_id: WO-103
title: Anonymous User Onboarding Flow
type: FEATURE
category: Authentication / Privacy
priority: P2 (High)
status: 01_TRIAGE
created: 2026-02-18T07:44:00-08:00
requested_by: USER (Privacy Strategy)
owner: LEAD
failure_count: 0
triage_status: PENDING
---
triage_status: PENDING
---

## AGENT INSTRUCTIONS
1.  **READ**: Analyze the User Intent.
2.  **EXECUTE**: Develop the Anonymous Flow Strategy (PRODDY).
3.  **HANDOFF**: Follow the instructions at the bottom of this file.

# Work Order: Anonymous User Onboarding Flow

## 📌 USER INTENT
"Prompt new users: 'Would you like to set up a profile or 'anonymous user'?'"

## 🎯 THE GOAL
Implement a sophisticated "Fork in the Road" for new users:
1.  **Authenticated Profile:** Standard signup (email/pass) -> Cloud Sync, Multi-device access.
2.  **Anonymous Mode:** No PII -> LocalStorage only (or ephemeral session), "Burner Identity".

## 🧠 PRODDY STRATEGY & REQUIREMENTS

### 1. The "Fork in the Road" Experience
**Concept:** A premium, high-trust "Gateway" screen that appears immediately upon clicking "Get Started". It must clearly differentiate between convenience (Cloud) and absolute privacy (Anonymous).

**UI Layout:**
- **Visual:** Split-screen or large distinct cards (Glassmorphism style).
- **Option A: "Secure Cloud Profile"** (Primary Action)
  - *Icon:* Cloud/Lock with Sync arrows.
  - *Benefit:* "Sync across devices. Never lose your data. Personalized insights."
  - *Data Policy:* "Encrypted at rest. Zero-knowledge PHI."
  - *Action:* "Create Secure Account" -> Redirects to `/signup`.
- **Option B: "Anonymous Burner"** (Secondary/Ghost Action)
  - *Icon:* Mask/Ghost or Incognito eye.
  - *Benefit:* "No email required. No server tracking. Instant access."
  - *Risk:* "Data lives on this device only. Clearing cache wipes history."
  - *Action:* "Continue Anonymously" -> Generates ID -> Routes to Search.

### 2. Functional Logic (The "Burner" Mode)
- **Identity Generation:**
  - Create a local UUID (v4) stored in `localStorage` under `ppn_anon_id`.
  - Set `AuthContext` state: `{ user: null, isAnonymous: true, isAuthenticated: true }`.
- **Data Persistence Strategy (Local-First):**
  - **Constraints:** Anonymous users CANNOT write to the Postgres DB (to ensure zero server footprint).
  - **Storage:** Use `localStorage` or `IndexedDB` (via a wrapper like `idb-keyval`) for:
    - Search History
    - "Saved" items (temporarily)
    - Settings/Preferences
  - **UI Changes for Anons:**
    - Hide "Profile", "Settings", "Billing".
    - Disable "Share" features.
    - Show "Cloud Sync" upsell tooltip on disabled features: *"Create an account to save this permanently."*

### 3. Transition to Account
- Provide a persistent "Save Progress / Create Account" button in the header for Anonymous users.
- If clicked, migrate local data (Search History, etc.) to the new real DB account upon signup.

## 📝 UX MICRO-COPY
- **Headline:** "Choose Your Journey"
- **Anonymous Warning:** "Browsing in Anonymous Mode. Your data is stored locally on this device and is not backed up."

## 🛠 RELEASE CRITERIA
- [ ] Create a "Choose Your Path" onboarding screen (pre-signup).
- [ ] **Option A (Profile):** Redirects to `/signup`.
- [ ] **Option B (Anonymous):**
    - Generates a cryptographically secure random User ID (locally).
    - Sets a `is_anonymous` flag in AuthContext.
    - Routes directly to Onboarding Flow (Search Portal + Tour).
    - Disables "Cloud Sync" features with a tooltip explaining why.

## 📝 NOTES
- Must integrate with **WO-102** (Onboarding Strategy).
- Privacy messaging must be front-and-center for the Anonymous option ("No servers. No tracking. Just you.").

---

## HANDOFF INSTRUCTIONS
Upon completion of Strategy:
1.  **UPDATE STATUS**: Keep `status` as `01_TRIAGE`.
2.  **UPDATE OWNER**: Change `owner` to `LEAD`.
3.  **MOVE FILE**: Keep file in `_WORK_ORDERS/01_TRIAGE/`.

