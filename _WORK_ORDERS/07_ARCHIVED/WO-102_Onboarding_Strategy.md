---
work_order_id: WO-102
title: Onboarding - Search Portal & Guided Tour
type: FEATURE
category: UX / Onboarding
priority: P3 (Strategic)
status: 01_TRIAGE
created: 2026-02-18T07:44:00-08:00
requested_by: USER (Post-Login Strategy)
owner: LEAD
failure_count: 0
triage_status: PENDING
---
triage_status: PENDING
---

## AGENT INSTRUCTIONS
1.  **READ**: Analyze the User Intent.
2.  **EXECUTE**: Develop the Onboarding Strategy (PRODDY).
3.  **HANDOFF**: Follow the instructions at the bottom of this file.

# Work Order: Onboarding Strategy (Search + Tour)

## 📌 USER INTENT
"start point after login for first-time users should be **search portal + guided tour and strong privacy messaging**"

## 🎯 THE GOAL
Redesign the post-login experience for **first-time users**:
1.  **Route:** `Login` -> `SearchPortal` (instead of Dashboard).
2.  **Activation:** Auto-trigger the new Guided Tour (being built in WO-011).
3.  **Trust:** Display a "Strong Privacy Messaging" banner or modal overlay on first load.

---

## 🧠 PRODDY STRATEGY & REQUIREMENTS

### 1. The "First Land" Experience
**Goal:** Minimizing "Time-to-Value". New users are often overwhelmed by empty Dashboards. We want them to *do* something immediately.

**Flow:**
1.  **Login/Anon Entry** -> Check `isFirstLogin` (or `!localStorage.getItem('hasSeenTour')`).
2.  **Redirect:** Bypass `/dashboard`. Go strictly to `/advanced-search`.
3.  **Privacy Primer (Modal):**
    - *Title:* "Your Research Sanctuary"
    - *Body:* "Your queries are encrypted. We do not sell your data. You are safe here."
    - *Action:* "Start Tour" (Primary) vs "Skip" (Secondary).
4.  **The Interactive Tour (Guided):**
    - Triggers immediately after "Start Tour".
    - Uses the engine from **WO-111**.

### 2. Guided Tour Script (Content Strategy)
*Tour ID: `onboarding_flow_v1`*

| Step | Element Target | Copy |
| :--- | :--- | :--- |
| **1. Welcome** | `center-screen` | **Head:** "Welcome to the Command Center."<br>**Body:** "This is where your journey begins. Access 50M+ data points instantly." |
| **2. Search** | `#search-input` | **Head:** "Ask Anything."<br>**Body:** "Type a condition, compound, or symptom. Natural language works best." |
| **3. Filters** | `#filter-panel-toggle` | **Head:** "Precision Control."<br>**Body:** "Filter by Study Type, Phase, or Safety Profile to cut through the noise." |
| **4. History** | `#history-tab` | **Head:** "Your Breadcrumbs."<br>**Body:** "We save your path locally so you can backtrack easily. Clear it anytime." |

### 3. Technical Implementation
- **State:** Use `localStorage` key `ppn_onboarding_complete` (boolean).
- **Routing:** inside `RequireAuth` or similar wrapper:
  ```javascript
  if (user && !hasSeenOnboarding) {
    return <Redirect to="/advanced-search?trigger=onboarding" />
  }
  ```
- **Privacy Modal:** Simple formatted dialog. *Must appear before the tour overlay.*

## 📝 UX VISUALS
- **Privacy Modal:** Dark glass background. Green "Shield" icon. Trust badges (HIPAA compliant, End-to-End Encryption).
- **Tour Tooltips:** High contrast, pulsing beacons.

## 🛠 RELEASE CRITERIA
- [ ] Modify `App.tsx` or `AuthContext` to check `isFirstLogin` flag.
- [ ] If `isFirstLogin`, navigate to `/advanced-search` (Search Portal).
- [ ] Trigger Guided Tour (WO-111) upon landing.
- [ ] Design & implement a dismissal message: "Your data is encrypted. No PHI is stored. [Learn More]"
- [ ] **Implementation of the 4-step Tour Script defined above.**

## 📝 NOTES
- Depends on **WO-111** (Guided Tour Engine).
- Depends on **SearchPortal** page polish.

---

## HANDOFF INSTRUCTIONS
Upon completion of Strategy:
1.  **UPDATE STATUS**: Keep `status` as `01_TRIAGE`.
2.  **UPDATE OWNER**: Change `owner` to `LEAD`.
3.  **MOVE FILE**: Keep file in `_WORK_ORDERS/01_TRIAGE/`.

