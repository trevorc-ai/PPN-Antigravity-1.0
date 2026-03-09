---
id: WO-MOBILE-OPT-BATCH
title: "Mobile Optimization — All Pages: Audit & Surgical Fixes"
owner: BUILDER
status: 03_BUILD
routed_by: LEAD
date_routed: 2026-03-09
priority: P1
---

# WO-MOBILE-OPT CONSOLIDATED SURGICAL PLAN

## How Builder Should Execute This

Work through every page listed below in alphabetical order. For each page:
1. Open the source file.
2. Run the `/audit-mobile` checklist against it (4 dimensions: touch targets, overflow, navigation reachability, font scaling).
3. Apply the `/optimize-mobile` fixes (Thumb Zone, Kinetic Transitions, Fat-Finger Compliance).
4. Mark the page as done in this file.
5. After every 5 pages, run `npm run build` to catch TypeScript errors early.

---

## Universal Standards (apply to EVERY page)

| Standard | Rule |
|---|---|
| Touch targets | All interactive elements: `min-h-[44px] min-w-[44px]` |
| Font sizes | Minimum `text-sm` (14px) everywhere. No `text-xs` on interactive labels |
| No horizontal scroll | Root container must be `overflow-x-hidden` or `w-full max-w-full` on mobile |
| Button feedback | All tappable elements: `active:scale-95 transition-transform` |
| Bottom nav reachability | Primary actions must be reachable by thumb (within bottom 40% of screen height) |
| Heading overflow | `text-3xl` → `text-2xl sm:text-3xl`, `text-4xl` → `text-3xl sm:text-4xl` |
| Grid responsiveness | Minimum single-column at 375px (add `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) |

---

## Execution Checklist

### PRIORITY GROUP 1 — Core Clinical Surfaces
These pages are touched most during active sessions. Fix first.

- [ ] `Dashboard.tsx` — Check `MetricPill` and `InsightCard` grid column collapse; ensure `px-4` on mobile. Fix any `grid-cols-3` → `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- [ ] `WellnessJourney.tsx` — Phase tabs already fixed in WO-570. Check patient bar `<details>` expand area for 44px. Verify `max-w-6xl` wrapper has no inner double-padding after WO-570 fix.
- [ ] `IntegrationCompass.tsx` — Accordion + slider fix covered by WO-546. Verify no regressions after that fix lands.
- [ ] `PatientCompanionPage.tsx` — Verify touch targets on all form buttons; any charts need `overflow-x-auto` wrapper.
- [ ] `PatientReport.tsx` — Check radar/waveform charts for horizontal scroll on 375px; wrap in `overflow-x-auto` if needed.

### PRIORITY GROUP 2 — Auth & Onboarding
These are first-touch mobile screens.

- [ ] `Login.tsx` — Form inputs: `min-h-[44px]` on all `<input>`, submit button `min-h-[52px]`. Check password toggle button touch target.
- [ ] `SignUp.tsx` — Same as Login. Verify radio/checkbox alternatives use visible labels ≥ 44px. Check site-creation card stack collapse at 375px.
- [ ] `ForgotPassword.tsx` — Single input + button. Ensure button is `w-full min-h-[52px]`.
- [ ] `ResetPassword.tsx` — Same as ForgotPassword. Add `active:scale-95` on submit.
- [ ] `Waitlist.tsx` — Hero and form. Verify full-width input on mobile, CTA button `min-h-[52px]`.
- [ ] `SecureGate.tsx` — Token entry or gate screen. Verify input and button sizing.

### PRIORITY GROUP 3 — Landing & Marketing
Public-facing. Performance + readability critical.

- [ ] `Landing.tsx` — Check framer-motion animations are `prefers-reduced-motion` aware. Hero CTA button `min-h-[52px]`. Alliance wall cards: verify no horizontal scroll.
- [ ] `Pricing.tsx` — Plan cards: single column at 375px. CTA buttons `min-h-[52px]`.
- [ ] `About.tsx` — Text blocks: max-width `prose` class. No overflowing text.
- [ ] `News.tsx` — Article card grid: single column on mobile.
- [ ] `Checkout.tsx` — Payment form: all inputs `min-h-[44px]`. Stripe element container: ensure no overflow.

### PRIORITY GROUP 4 — Data & Analytics Surfaces
Charts are the main risk here — fix scroll containers.

- [ ] `Analytics.tsx` — All Recharts/D3 charts: wrap in `<div className="overflow-x-auto">`; set `minWidth` on chart SVG so chart doesn't compress.
- [ ] `ArcOfCareDashboard.tsx` — Same as Analytics.
- [ ] `ArcOfCareDemo.tsx` — Same.
- [ ] `ArcOfCarePhase2Demo.tsx` — Same.
- [ ] `ArcOfCarePhase3Demo.tsx` — Same.
- [ ] `IngestionHub.tsx` — Data table: `overflow-x-auto` scroll container. Row tap height ≥ 44px.
- [ ] `AuditLogs.tsx` — Same table treatment as IngestionHub.
- [ ] `SessionExportCenter.tsx` — Export card list: single column at 375px, min 44px card height.
- [ ] `DownloadCenter.tsx` — Download category cards: verify single column on mobile, 48px tap height.
- [ ] `DataExport.tsx` — Button and form sizing. No overflow.

### PRIORITY GROUP 5 — Content Reading Surfaces
Mostly text. Focus on heading clamp, padding, and link tap targets.

- [ ] `DataPolicy.tsx` — Heading clamp, `px-4` on mobile, anchor links ≥ 44px.
- [ ] `DataPolicyPrint.tsx` — Print-only — skip mobile optimization, add `@media print` guard.
- [ ] `PrivacyPolicy.tsx` — Same as DataPolicy.
- [ ] `TermsOfService.tsx` — Same as DataPolicy.
- [ ] `ContributionModel.tsx` — Verify section cards collapse at 375px.
- [ ] `HelpFAQ.tsx` — Covered in WO-573. Mark done after WO-573 ships.
- [ ] `HelpCenter.tsx` — Covered in WO-573.

### PRIORITY GROUP 6 — Tools & Features
- [ ] `InteractionChecker.tsx` — Input + results panel. Verify results list scroll on mobile, input `min-h-[44px]`.
- [ ] `ProtocolBuilder.tsx` — Builder step control: 44px buttons, single-column step list on mobile.
- [ ] `ProtocolDetail.tsx` — Detail view: heading sizes + overflow check.
- [ ] `MyProtocols.tsx` — Protocol card grid: single-column at 375px, swipe-scroll if needed.
- [ ] `SubstanceCatalog.tsx` — Category cards: same as MyProtocols.
- [ ] `SubstanceMonograph.tsx` — Long-form content. Heading clamp + `px-4`.
- [ ] `MEQ30Page.tsx` — Assessment: radio buttons must have `min-h-[44px]` clickable labels. Progress bar full-width at 375px.
- [ ] `AdaptiveAssessmentPage.tsx` — Same as MEQ30Page.
- [ ] `SearchPortal.tsx` / `SimpleSearch.tsx` — Search input `min-h-[44px]`, result cards single-column.
- [ ] `Notifications.tsx` — Notification rows: `min-h-[44px]`, touch-friendly dismiss/action buttons.
- [ ] `Settings.tsx` — Settings rows: `min-h-[44px]` each row. Section headers: clamped heading size.
- [ ] `ProfileEdit.tsx` — Form inputs: `min-h-[44px]`. Save button: full-width on mobile.
- [ ] `BillingPortal.tsx` — Invoice rows: `min-h-[44px]`. Plan status card: single column.

### PRIORITY GROUP 7 — Clinician Directory & Profile
- [ ] `ClinicianDirectory.tsx` — Card grid: single column at 375px.
- [ ] `ClinicianProfile.tsx` — Profile header: flex-col on mobile. Action buttons: full-width at 375px.
- [ ] `PatientFormPage.tsx` — Form: all inputs `min-h-[44px]`. Submit CTA: full-width `min-h-[52px]`.

### PRIORITY GROUP 8 — Partner & Demo Pages
- [ ] `PartnerDemoHub.tsx` — Demo step cards: single column. CTA button `min-h-[52px]`.
- [ ] `ClinicalReportPDF.tsx` — PDF-only. Skip mobile optimization; add `@media print` guard if missing.
- [ ] `DemoClinicalReportPDF.tsx` — Same.

### PRIORITY GROUP 9 — Admin & Dev-Only
Low priority. Functional mobile compliance only.

- [ ] `AdminSharingLibrary.tsx` — Table: `overflow-x-auto`. Row height ≥ 44px.
- [ ] `ComponentShowcase.tsx` — Dev tool. Verify basic 375px layout.
- [ ] `ComponentShowcaseTest.tsx` — Same.
- [ ] `FormsShowcase.tsx` — Same.
- [ ] `HiddenComponentsShowcase.tsx` — Same.
- [ ] `PhysicsDemo.tsx` — Skip — canvas-based, mobile not meaningful.
- [ ] `IsometricMoleculesDemo.tsx` — Skip — canvas-based.
- [ ] `MolecularVisualizationDemo.tsx` — Skip — canvas-based.
- [ ] `MoleculeTest.tsx` — Skip — canvas-based.
- [ ] `Academy.tsx` — Content grid: single column on mobile.

---

## Post-Build Gate

After completing all pages, BUILDER must:

1. Run `npm run build` — zero TypeScript errors required.
2. Open `/` in Chrome DevTools → Device: iPhone 12 (375px) → scroll each page in browser.
3. Check for horizontal scroll (red flag: `body` has `overflow-x: scroll` in DevTools).
4. Check for sub-44px touch targets using Accessibility Inspector or CSS outline hack:
   ```css
   * { outline: 1px solid rgba(255,0,0,0.2); }
   button, a, input { outline: 2px solid red; }
   ```
5. Flag any pages where touch targets or overflow cannot be fixed with Tailwind alone (escalate to LEAD).

---

## Files NOT to touch in this batch

- `DosingSessionPhase.tsx` — frozen per WO-572 scope
- Any `*Service.ts` or `*Hook.ts` files — no logic changes
- Any SQL migration files
- `agent.yaml` or any global rules files
