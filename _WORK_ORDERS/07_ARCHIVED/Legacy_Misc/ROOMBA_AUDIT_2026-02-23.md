# 🤖 PPN Site Roomba — Audit Report
**Generated:** 2/23/2026, 9:42:21 AM PST
**Router file:** `src/App.tsx`
**Read-only audit — no files were modified.**

---

## Summary
| Finding | Count |
|---------|-------|
| Defined routes (App.tsx) | 61 |
| Orphaned routes (defined, never linked) | 30 |
| Dead nav links (linked, not defined) | 1 |
| Dead navigate() calls | 11 |
| Free-text inputs in patient forms | 10 |
| External links | 1 |

## 1. All Defined Routes (App.tsx)
- `/`
- `/landing`
- `/about`
- `/secure-gate`
- `/privacy`
- `/terms`
- `/pricing`
- `/contribution`
- `/arc-of-care`
- `/arc-of-care-phase2`
- `/arc-of-care-phase3`
- `/arc-of-care-dashboard`
- `/meq30`
- `/patient-form/:formId`
- `/assessment`
- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`
- `/checkout`
- `/academy`
- `/partner-demo`
- `/deep-dives/patient-flow`
- `/deep-dives/clinic-performance`
- `/deep-dives/patient-constellation`
- `/deep-dives/molecular-pharmacology`
- `/deep-dives/protocol-efficiency`
- `/deep-dives/workflow-chaos`
- `/deep-dives/safety-surveillance`
- `/deep-dives/risk-matrix`
- `/dashboard`
- `/analytics`
- `/news`
- `/catalog`
- `/monograph/:id`
- `/interactions`
- `/audit`
- `/wellness-journey`
- `/arc-of-care-god-view`
- `/companion/:sessionId`
- `/protocols`
- `/protocol/:id`
- `/clinician/:id`
- `/help`
- `faq`
- `quickstart`
- `overview`
- `interaction-checker`
- `wellness-journey`
- `reports`
- `scanner`
- `devices`
- `settings`
- `*`
- `/notifications`
- `/settings`
- `/profile/edit`
- `/data-export`
- `/session-export`
- `/clinical-report-pdf`
- `/logout`

## 2. Orphaned Routes — Defined but Never Linked
> These routes exist in App.tsx but have no sidebar link, `<Link>`, or `navigate()` pointing to them.
> They are reachable only by typing the URL directly.

- `/about` — [ACTION REQUIRED] either add a nav entry or remove the route
- `/secure-gate` — [ACTION REQUIRED] either add a nav entry or remove the route
- `/terms` — [ACTION REQUIRED] either add a nav entry or remove the route
- `/pricing` — [ACTION REQUIRED] either add a nav entry or remove the route
- `/arc-of-care` — [ACTION REQUIRED] either add a nav entry or remove the route
- `/arc-of-care-phase2` — [ACTION REQUIRED] either add a nav entry or remove the route
- `/arc-of-care-phase3` — [ACTION REQUIRED] either add a nav entry or remove the route
- `/arc-of-care-dashboard` — [ACTION REQUIRED] either add a nav entry or remove the route
- `/meq30` — [ACTION REQUIRED] either add a nav entry or remove the route
- `/assessment` — [ACTION REQUIRED] either add a nav entry or remove the route
- `/deep-dives/patient-flow` — [ACTION REQUIRED] either add a nav entry or remove the route
- `/deep-dives/patient-constellation` — [ACTION REQUIRED] either add a nav entry or remove the route
- `/deep-dives/molecular-pharmacology` — [ACTION REQUIRED] either add a nav entry or remove the route
- `/deep-dives/protocol-efficiency` — [ACTION REQUIRED] either add a nav entry or remove the route
- `/deep-dives/risk-matrix` — [ACTION REQUIRED] either add a nav entry or remove the route
- `/news` — [ACTION REQUIRED] either add a nav entry or remove the route
- `/arc-of-care-god-view` — [ACTION REQUIRED] either add a nav entry or remove the route
- `faq` — [ACTION REQUIRED] either add a nav entry or remove the route
- `quickstart` — [ACTION REQUIRED] either add a nav entry or remove the route
- `overview` — [ACTION REQUIRED] either add a nav entry or remove the route
- `interaction-checker` — [ACTION REQUIRED] either add a nav entry or remove the route
- `wellness-journey` — [ACTION REQUIRED] either add a nav entry or remove the route
- `reports` — [ACTION REQUIRED] either add a nav entry or remove the route
- `scanner` — [ACTION REQUIRED] either add a nav entry or remove the route
- `devices` — [ACTION REQUIRED] either add a nav entry or remove the route
- `settings` — [ACTION REQUIRED] either add a nav entry or remove the route
- `/notifications` — [ACTION REQUIRED] either add a nav entry or remove the route
- `/session-export` — [ACTION REQUIRED] either add a nav entry or remove the route
- `/clinical-report-pdf` — [ACTION REQUIRED] either add a nav entry or remove the route
- `/logout` — [ACTION REQUIRED] either add a nav entry or remove the route

## 3. Dead Nav Links — Sidebar Points Nowhere
> These links appear in navigation but have no matching route in App.tsx.

- `/advanced-search` — referenced in `src/components/MobileSidebar.tsx`

## 4. Dead navigate() Calls — Programmatic Navigation to Undefined Routes

- `/advanced-search` — `src/components/Breadcrumbs.tsx` line 79
- `/#membership-tiers` — `src/components/Footer.tsx` line 14
- `/advanced-search` — `src/components/MobileSidebar.tsx` line 134
- `/vibe-check` — `src/components/TopHeader.tsx` line 271
- `/advanced-search` — `src/pages/About.tsx` line 49
- `/#secure-access-node` — `src/pages/About.tsx` line 161
- `/clinicians` — `src/pages/ClinicianProfile.tsx` line 159
- `/#secure-access-node` — `src/pages/ContributionModel.tsx` line 76
- `/#secure-access-node` — `src/pages/ContributionModel.tsx` line 178
- `/#membership-tiers` — `src/pages/ContributionModel.tsx` line 184
- `/clinicians` — `src/pages/Notifications.tsx` line 111

## 5. Free-Text Inputs in Patient-Context Forms — PHI Risk Audit
> Any `<textarea>` or `type="text"` in patient-context forms must be UI-only (never persisted).
> Items without a `{/* UI-ONLY */}` comment need manual review.

- **src/components/arc-of-care-forms/phase-2-dosing/SafetyAndAdverseEventForm.tsx** line 492: 🔴 No UI-ONLY comment — needs INSPECTOR review
  ```
  type="text"
  ```
- **src/components/arc-of-care-forms/shared/BatchRegistrationModal.tsx** line 138: 🔴 No UI-ONLY comment — needs INSPECTOR review
  ```
  type="text"
  ```
- **src/components/arc-of-care-forms/shared/BatchRegistrationModal.tsx** line 174: 🔴 No UI-ONLY comment — needs INSPECTOR review
  ```
  type="text"
  ```
- **src/components/arc-of-care-forms/shared/DeviceRegistrationModal.tsx** line 135: 🔴 No UI-ONLY comment — needs INSPECTOR review
  ```
  type="text"
  ```
- **src/components/arc-of-care-forms/shared/DeviceRegistrationModal.tsx** line 148: 🔴 No UI-ONLY comment — needs INSPECTOR review
  ```
  type="text"
  ```
- **src/components/arc-of-care-forms/shared/DeviceRegistrationModal.tsx** line 161: 🔴 No UI-ONLY comment — needs INSPECTOR review
  ```
  type="text"
  ```
- **src/components/arc-of-care-forms/shared/NumberInput.tsx** line 97: 🔴 No UI-ONLY comment — needs INSPECTOR review
  ```
  type="text"
  ```
- **src/components/arc-of-care-forms/shared/UserPicker.tsx** line 87: 🟡 Has UI-ONLY comment (verify persistence)
  ```
  type="text"
  ```
- **src/components/wellness-journey/PatientSelectModal.tsx** line 330: 🟡 Has UI-ONLY comment (verify persistence)
  ```
  type="text"
  ```
- **src/components/wellness-journey/RiskEligibilityReport.tsx** line 242: 🔴 No UI-ONLY comment — needs INSPECTOR review
  ```
  <textarea
  ```

## 6. External Links Inventory
> All outbound `href` links found in source. Verify none point to localhost, staging, or dead domains.

- `https://pubmed.ncbi.nlm.nih.gov/29677511/` — `src/components/wellness-journey/NeuroplasticityWindowBadge.tsx` line 106

---
*Roomba complete. No files were modified. Review findings above and create work orders for any items requiring action.*