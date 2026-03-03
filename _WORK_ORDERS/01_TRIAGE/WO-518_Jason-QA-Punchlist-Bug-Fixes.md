---
id: WO-518
title: "Jason QA Punchlist — Bug Fixes & UX Defects (3/2/26)"
status: 00_INBOX
owner: LEAD
created: 2026-03-03
source: public/admin_uploads/PPN_Testing_Punchlist.csv
tester: Jason Allen (jbluths@gmail.com)
---

# WO-518 — Jason QA Punchlist: Bug Fixes & UX Defects

> **Source:** Jason Allen QA session, 3/2/26  
> **Logged by:** CUE (automated from CSV)  
> **Status:** Inbox → Awaiting LEAD triage  

---

## Summary

Jason conducted a full QA pass of the PPN Portal on 3/2/26 covering: Landing Page, Partner Demo Page, Email/Login flows, Dashboard, Quick Actions, Quick Links, Compliance pages, and Molecular Pharmacology. This WO captures all **Fail** and **TBD/unclear** items, triaged by priority tier.

---

## 🔴 P0 — Critical / Auth & Navigation Blockers

### BUG-518-01 | "Back to Portal" Link Signs User Out
- **Page:** Compliance → Privacy page
- **Action:** Click "Back to portal" link
- **Expected:** Return to Dashboard
- **Actual:** Signs user out and redirects to the Landing/Sign-in page
- **Jason's note:** "Signs user out and sends to landing page"
- **Priority:** P0 — Auth regression; destroys active session unexpectedly

### BUG-518-02 | Forgot Password — No Reset Email Delivered
- **Page:** From EMAIL – Login Screen → Forgot Password
- **Action:** Enter email for password recovery
- **Expected:** Recovery email sent to user
- **Actual:** Email accepted in UI but no reset email is received
- **Priority:** P0 — Blocks user recovery flow entirely

### BUG-518-03 | First-Time User Sign-Up — No Password Creation Step
- **Page:** From EMAIL – Login Screen → Click "Sign Up"
- **Action:** User clicks to sign up, enters email
- **Expected:** Prompted to create a password
- **Actual:** No mechanism to create a password exists
- **Priority:** P0 — New user onboarding is broken

### BUG-518-04 | Desktop Activation Email — Confusing / Inconsistent Link
- **Page:** Invitation Email (Desktop view)
- **Expected:** "Activate My Access →" button is prominent and consistent with mobile
- **Actual:** Link is confusing and visually inconsistent vs. the phone version (where it is clear)
- **Priority:** P0 — Demo/beta-launch blocker; practitioners can't activate accounts on desktop

---

## 🟠 P1 — High Value, Ship This Sprint

### BUG-518-05 | Partner Demo Page — No "Return to Landing Page" Link
- **Page:** Partner Demo Page
- **Action:** User wants to navigate back to Landing page
- **Expected:** A visible back/home link
- **Actual:** No link exists; dead end
- **Priority:** P1

### BUG-518-06 | Dashboard — "Click Refresh" Returns "Not Loaded" Error
- **Page:** Dashboard
- **Action:** Click refresh link
- **Expected:** Page and data refresh
- **Actual:** Returns message "Not Loaded"
- **Priority:** P1 — Functional regression on the primary screen

### BUG-518-07 | Quick Actions — All Buttons Navigate Incorrectly or Fail
- **Page:** Dashboard → Quick Actions section
- **Items that fail:**
  - **Log Protocol** → directed to Wellness Journey start (expected: NEW wellness journey page)
  - **Analytics** → directed to clinical intelligence (labeled fail — possibly nav label mismatch?)
  - **Interactions** → directed to interactions page (labeled fail — possible label mismatch?)
  - **Export Data** → directed to export data page (labeled fail)
  - **Benchmarks** → TBD; dead-ends with no back button
- **Jason's note:** "Should 'quick actions' be at the top of the page? AND return to dashboard scroll spot"
- **Priority:** P1 — Quick Actions is a primary workflow entry point

### BUG-518-08 | Dashboard — Back Button Missing (Multiple Sections)
- **Page:** Dashboard → Quick Actions, Molecular Pharmacology deep link, Membership Tiers
- **Issue:** No "back" button exists after navigating from Dashboard into sub-pages. User is stranded.
- **Jason's note:** "It dead ends. Shouldn't it take user back to Dashboard?"
- **Priority:** P1 — Affects all downstream nav flows

### BUG-518-09 | Dashboard → "Dashboard" Quick Link Does Nothing
- **Page:** Dashboard → Quick Links → "Dashboard"
- **Expected:** Return to top of Dashboard
- **Actual:** Nothing happens (already on Dashboard; no scroll-to-top behavior)
- **Jason's note:** "Suggest returning to top or remove 'dashboard' quick link as it does nothing right now."
- **Priority:** P1

### BUG-518-10 | Membership Tiers → No Back Navigation
- **Page:** Quick Links → Membership Tiers
- **Action:** User clicks and is taken to "Choose Your Plan" page
- **Expected:** A way to navigate back to Dashboard
- **Actual:** No navigation back once clicked
- **Priority:** P1

### BUG-518-11 | Compliance → Terms of Service — No Action / Dead Link
- **Page:** Compliance → Terms of Service
- **Action:** Click "Terms of Service"
- **Expected:** Navigate to Terms of Service page
- **Actual:** No action occurs
- **Jason's note:** "Not sure where this is supposed to go?"
- **Priority:** P1

### BUG-518-12 | Login Screen — User Email Not Pre-Populated
- **Page:** Login Screen
- **Expected:** If user has an existing account, their email is pre-filled
- **Actual:** Emails are not saved/pre-populated
- **Priority:** P1 — UX friction on every return visit

---

## 🟡 P2 — Useful, Deferrable

### BUG-518-13 | Dashboard → Back Button Scroll Position Not Preserved
- **Page:** Dashboard → Suggested Next Steps (#1, #2, #3) and Quick Actions
- **Issue:** After navigating to a sub-page and pressing the browser back button, users are returned to the **top** of the Dashboard instead of their original scroll position
- **Jason's note:** "NOTE: When hitting 'back' button, returns user to top of dashboard. Expect it returns to the same scroll position in the page."
- **Priority:** P2

### BUG-518-14 | Dashboard → Click #3 (Suggested Next Steps) Goes to Wrong Page
- **Page:** Dashboard → Suggested Next Steps → Click #3
- **Expected:** Links to Follow-up session
- **Actual:** Goes to Wellness Journey start
- **Priority:** P2 — Navigation mismatch

### BUG-518-15 | Dashboard → Clicking Safety Cell Goes to Molecular Pharmacology
- **Page:** Dashboard → cells with data (safety)
- **Action:** Click "safety" data cell
- **Expected:** (Unclear — confirm with Trevor)
- **Actual:** Takes user to Molecular Pharmacology screen
- **Jason's note:** "Also, there is no 'back' button. It dead ends."
- **Priority:** P2 — Unexpected navigation behavior

---

## ❓ Open Questions for LEAD / Trevor

1. **Landing Page interactive components** — Jason asks: "Do we want the 'active' components to do anything? May confuse users if clicking and nothing happens?" Trevor's note: True working components would make load time very slow. Confirm desired behavior.
2. **Partner Demo Page icon clicks** — Should every icon take the user to the log-in screen, or should there be a single CTA link? Jason asks if we should consolidate to ONE login link.
3. **Partner Demo Page scrolling** — Should we use accordion-style menus to reduce scrolling?
4. **Dashboard → Log Session+ button** — Jason observes it opens Wellness Journey; confirm this is correct with Trevor.
5. **Dashboard → Network Report button** — Jason observes it goes to Clinical Intelligence; confirm this is correct with Trevor.
6. **Waitlist sign-up admin receipt** — Is the admin being notified when a waitlist sign-up is submitted? (TBD in Jason's sheet)
7. **Tablet invitation email** — Not tested; needs to be verified.

---

## PRODDY PRD

> **Work Order:** WO-518 — Jason QA Punchlist Bug Fixes  
> **Authored by:** CUE (from tester CSV)  
> **Date:** 2026-03-03  
> **Status:** Draft → Pending LEAD triage  

---

### 1. Problem Statement

Jason Allen's 3/2/26 QA session of the PPN Portal surfaced 15 discrete bugs across auth, navigation, and UX — including a critical auth regression that signs users out when clicking "Back to Portal," broken password recovery, broken first-time sign-up, and a dashboard Quick Actions pane where every button either dead-ends or navigates inconsistently. Without fixes, the portal is not safe for beta practitioners.

### 2. Target User + Job-To-Be-Done

A beta practitioner needs to navigate the portal reliably — logging sessions, reviewing analytics, managing their account — so that every action has a predictable, recoverable outcome without losing their session or getting stranded on a dead-end page.

### 3. Success Metrics

1. Clicking "Back to Portal" from the Privacy page returns the user to the Dashboard without ending their session — verified in QA retest.
2. A password reset email is received within 60 seconds of requesting it in the Forgot Password flow — verified end-to-end.
3. All 5 Quick Action buttons navigate to the correct destination page with a functioning "Back to Dashboard" escape — verified by Jason in retest.

### 4. Feature Scope

#### ✅ In Scope
- Fix auth session destruction on "Back to Portal" link (BUG-518-01)
- Fix Forgot Password email delivery (BUG-518-02)
- Fix First-Time User sign-up password creation flow (BUG-518-03)
- Fix desktop activation email CTA styling (BUG-518-04)
- Add "Return to Landing Page" link on Partner Demo Page (BUG-518-05)
- Fix Dashboard "Not Loaded" refresh error (BUG-518-06)
- Fix Quick Actions navigation destinations (BUG-518-07)
- Add back-navigation from all dead-end sub-pages (BUG-518-08, BUG-518-10)
- Fix "Dashboard" Quick Link scroll-to-top behavior (BUG-518-09)
- Fix Terms of Service link (BUG-518-11)
- Pre-populate login email if user has an account (BUG-518-12)

#### ❌ Out of Scope
- Scroll position memory / restoration (P2 — BUG-518-13, separate ticket)
- Landing page interactive component behavior redesign (open question, needs Trevor decision)
- Partner Demo Page accordion redesign (open question)
- New analytics or data visualization features

### 5. Priority Tier

**[x] P0** — Demo blocker / safety critical

**Reason:** BUG-518-01 (session destruction), BUG-518-02 (broken password reset), and BUG-518-03 (broken sign-up) are auth-layer failures that prevent practitioners from accessing or recovering their accounts. These block the current beta launch.

### 6. Open Questions for LEAD

1. Should `email` be persisted in `localStorage` after login so the login form can pre-populate on return? Any PHI/security concern?
2. Is the Terms of Service page built but unlinked, or does it not exist yet?
3. For Quick Actions, should "Log Protocol" always start a NEW wellness journey, or should it route to the patient selector first?
4. Confirm desired behavior when a user clicks "Dashboard" in Quick Links while already on the Dashboard (scroll-to-top vs. no-op vs. remove the link).
5. Who owns the Resend/email delivery fix for Forgot Password — is this a Supabase Auth config issue or an application-level issue?

### PRODDY Sign-Off Checklist

- [x] Problem Statement is ≤100 words and contains no solution ideas
- [x] Job-To-Be-Done is a single sentence in the correct format
- [x] All 3 success metrics contain a measurable number or specific observable event
- [x] Out of Scope is populated (not empty)
- [x] Priority tier has a named reason (not just "seems important")
- [x] Open Questions list is ≤5 items
- [x] Total PRD word count is ≤600 words
- [x] No code, SQL, or schema written anywhere in this document
- [x] Frontmatter updated: `owner: LEAD`, `status: 00_INBOX`
- [x] Response wrapped in `==== PRODDY ====`
