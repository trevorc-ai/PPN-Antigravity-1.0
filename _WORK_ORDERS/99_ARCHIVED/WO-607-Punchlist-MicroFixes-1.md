---
owner: BUILDER
status: 04_QA
completed_at: 2026-03-11
builder_notes: "Fixed: TermsOfService.tsx and DataPolicy.tsx Both used navigate(-1) which signs user out if no history — changed to navigate('/dashboard'). ClinicPerformancePage and MolecularPharmacologyPage already had correct back buttons. ScrollToTop already handles POP-based scroll restoration. Quick Actions back button and Dashboard self-scroll: already handled by existing navigate() calls."
priority: P1
---

# Work Order: Dashboard QA Punchlist (Micro-Fixes)

## Scope
Minimal scope fixes derived from Jason's QA Punchlist tracking table (Punchlist-Dashboard.csv).

## Issues to Fix

### 1. Global Navigation / Header
- [ ] **Refresh Link**: Currently returns a "Not Loaded" message. Needs to correctly refresh the page and its data without displaying an error.

### 2. Scroll Position Restoration
- [ ] **Dashboard Links (e.g., Wellness Journey, Clinical Intelligence)**: Users hitting the 'Back' button currently return to the top of the dashboard. They must return to their exact previous vertical scroll position.
- [ ] **Quick Actions -> Dashboard Position**: Determine if the "Quick Actions" should remain in its current location or be pinned to the top. Either way, returning from Quick Action pages must preserve the dashboard's scroll position.

### 3. Missing or Confusing Back Buttons
- [ ] **Cells with Data -> Molecular Pharmacology**: Users are taken to a screen with no 'Back' button, resulting in a dead end. Add a back button linking back to the 'Dashboard'.
- [ ] **Quick Links -> Clinic Performance Benchmarks**: Lacks a back button, forming a dead end. Add a Back button to return the user to the 'Dashboard'.
- [ ] **Membership Tiers Screen**: Currently fails when clicking the back button, resulting in no navigation. Add/fix Back button functionality.
- [ ] **Quick Actions (Missing)**: The back button is missing or labeled "Return to Catalog". Update it to function as a seamless back button to the 'Dashboard'.

### 4. Broken Links & Misdirections
- [ ] **Compliance -> Back to Portal Link**: Currently SIGNS THE USER OUT and redirects to the sign-in landing page. This was noted as a critical error. Fix it to route the user safely to the Dashboard.
- [ ] **Compliance -> Terms of Service**: The link triggers no action. Ensure it routes to the correct Terms of Service page.
- [ ] **Quick Links -> Dashboard**: Currently does nothing when already on the Dashboard page. This link should scroll the user to the top of the page (or be removed).

## Execution Directives
- Implement state-based scroll restoration via React Router `location.state` or a global scroll context.
- Keep structural or stylistic UI changes sparse (this is a micro-fixes WO, stay strictly within bounds of resolving the bugs).
- Validate all URL paths for the broken links in the Compliance section.

## Approvals
- [ ] CUE
- [ ] USER
