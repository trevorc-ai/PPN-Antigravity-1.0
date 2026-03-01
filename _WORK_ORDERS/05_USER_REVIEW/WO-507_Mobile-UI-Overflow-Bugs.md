---
id: WO-507
slug: Mobile-UI-Overflow-Bugs
status: 03_BUILD
owner: BUILDER
priority: HIGH
failure_count: 0
created: 2026-02-26
---

# WO-507: Mobile UI Overflow and Rendering Bugs

## Source
Six screenshots captured by user on live site at ppnportal.net via iPhone. All bugs observed in mobile Safari viewport (~390px wide). Screenshots filed in `public/admin_uploads/change_orders/`.

---

## Bug Inventory

### BUG-1: Settings Page — Content Clipped at Top (IMG_3448)
**Screen:** Settings / Customize Your Workspace  
**Symptom:** The top of the page is cut, showing only "...layout." trailing text with no heading or context above it. The page content is starting mid-sentence.  
**Likely Cause:** A section heading or intro paragraph is overflowing or being hidden above the scroll start position, possibly due to a fixed header overlap or missing `pt-` padding on the page container.  
**Fix:** Ensure the Settings page `PageContainer` has sufficient top padding on mobile to clear the fixed `TopHeader`. Check for `pt-4` or `pt-safe` equivalent on the first section. Verify `overflow-hidden` is not clipping anything.

---

### BUG-2: Analytics — Performance Radar Tab Row Overlapping Subtitle (IMG_3449)
**Screen:** Analytics page → Performance Radar card  
**Symptom:** The "Q1 2026 / LAST 12 MO" toggle tabs are overlapping on top of the "Clinic metrics vs Network Average" subtitle text. The two elements are colliding at mobile width.  
**Likely Cause:** The card header uses `flex justify-between` which works on desktop but collapses badly at mobile width — the right-side tab group has nowhere to go.  
**Fix:** On mobile (`< md`), stack the title/subtitle and the tab toggle vertically:
```tsx
// Desktop: flex-row justify-between
// Mobile: flex-col gap-2
<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
  <div>{title + subtitle}</div>
  <div>{tabs}</div>
</div>
```

---

### BUG-3: Patient Galaxy — Duplicate/Overlapping Heading (IMG_3450)
**Screen:** Analytics → Patient Galaxy (Patient Constellation) deep dive  
**Symptom:** "Patient Galaxy" heading appears **twice**, stacked visually with slight offset. One instance is from the card header inside the glass card, one appears to be bleeding through from behind or from an absolute-positioned element.  
**Likely Cause:** A card title `<h2>` is rendering both inside the card AND as an outside label (possibly via a `data-label` or a CSS `::before` pseudo-element), causing visual duplication. Could also be a `z-index` issue where a background element's text is visible through the glassmorphism card.  
**Fix:** Audit `PatientConstellationPage` or the relevant deep-dive card component for any duplicate title renders. Ensure the card header text is rendered exactly once. If the outer label exists for accessibility, use `aria-hidden="true"` on the decorative duplicate and `sr-only` on the accessible one. Remove any `::before` content that displays text.

---

### BUG-4: Interaction Checker — Dropdown Truncation + Double Chevron (IMG_3452)
**Screen:** Interaction Checker → Primary Agent dropdown  
**Symptom 1:** "Select Controlled Subs..." text is truncated mid-word. The dropdown label truncates before reaching the chevron icon.  
**Symptom 2:** The chevron appears as `VV` (double down-arrows) instead of a single `›` or `⌄`. This suggests two separate chevron icons are rendering.  
**Likely Cause:** The custom dropdown component has both a CSS-generated chevron (via `select` element appearance) AND a manually rendered `<ChevronDown>` icon, resulting in two chevrons on mobile. Truncation is caused by insufficient `min-width` on the text span or `overflow: hidden` cutting off too early.  
**Fix:**
- Remove the duplicate chevron — use either the CSS native `select` arrow **or** the `<ChevronDown>` lucide icon, not both. For custom styled selects, use `appearance-none` on the `<select>` and rely solely on the rendered icon.
- Add `truncate` class and sufficient `pr-8` padding on the label span to leave room for the single chevron.
- Audit `VALIDATED PROTOCOL LIST ONLY` label — it wraps to two lines unnecessarily. Either allow full width on mobile or shorten the label to `Validated list only`.

---

### BUG-5: Audit Logs — Tab Bar Overflows Viewport (IMG_3453)
**Screen:** Audit Logs page → filter tabs (All | Security | Clinical)  
**Symptom:** The tab bar is wider than the mobile viewport. "Clinical" tab is cut off on the right edge — user cannot see or tap it.  
**Likely Cause:** The tab group uses `flex` without `overflow-x-auto` or `flex-wrap`, so tabs overflow the container on narrow screens.  
**Fix:** Wrap the tab bar in a horizontally scrollable container:
```tsx
<div className="overflow-x-auto -mx-4 px-4">
  <div className="flex gap-2 min-w-max">
    {tabs}
  </div>
</div>
```
Or switch to `flex-wrap` if the tabs should wrap to a second line. Given there are only 3 tabs (All, Security, Clinical), `flex-wrap` is the cleaner approach — no horizontal scroll needed if tabs can wrap.

---

### BUG-6: Molecular Pharmacology — Substance Tabs Overflow, "PSILOCYBIN" Clips to "OCYBIN" (IMG_3454)
**Screen:** Molecular Pharmacology → Molecular Bridge → substance tabs (PSILOCYBIN | MDMA | LSD | KETAMINE)  
**Symptom:** The substance tab row overflows the card width. "PSILOCYBIN" is clipped by the left card edge to show only "OCYBIN", making it unreadable and untappable.  
**Likely Cause:** Same as BUG-5 — horizontal tab row without overflow handling. The tabs are inside a card with `overflow: hidden` on the card itself, which clips the first tab rather than allowing scroll.  
**Fix:**
```tsx
<div className="overflow-x-auto scrollbar-none -mx-3 px-3">
  <div className="flex gap-2 min-w-max pb-1">
    {substanceTabs}
  </div>
</div>
```
The card's `overflow-hidden` should remain for border-radius — wrap only the **tab row** in the scrollable container. Add `scrollbar-none` (Tailwind plugin) or equivalent to hide the scrollbar aesthetic while maintaining scroll behavior. Add `pb-1` to prevent clipping the bottom of the tab pill.

---

## Acceptance Criteria

- [ ] Settings page: first visible element on mobile is the section heading, no content cut off at top
- [ ] Analytics Performance Radar card: title/subtitle and tabs do not overlap on mobile — stack vertically on `< md`
- [ ] Patient Galaxy heading does not duplicate — exactly one `h2` renders
- [ ] Interaction Checker dropdown: single chevron only, label does not truncate mid-word, "VALIDATED PROTOCOL LIST ONLY" fits on one line or is shortened
- [ ] Audit Logs tab bar: all three tabs (All, Security, Clinical) are fully visible and tappable on 390px width
- [ ] Molecular Pharmacology substance tabs: "PSILOCYBIN" fully visible, all tabs reachable via horizontal scroll, no clipping

## Do Not
- Do not change desktop layouts — all fixes are mobile-only (`< md` breakpoint)
- Do not remove any tabs or truncate tab labels (except the one explicit case in BUG-4)
- Do not change Audit Logs or Molecular Pharmacology tab content, only their overflow container

## Files Likely Affected
- `src/pages/Settings.tsx` (BUG-1)
- `src/pages/Analytics.tsx` or Performance Radar sub-component (BUG-2)
- `src/pages/deep-dives/PatientConstellationPage.tsx` (BUG-3)
- `src/pages/InteractionChecker.tsx` (BUG-4)
- `src/pages/AuditLogs.tsx` (BUG-5)
- `src/pages/deep-dives/MolecularPharmacologyPage.tsx` (BUG-6)
