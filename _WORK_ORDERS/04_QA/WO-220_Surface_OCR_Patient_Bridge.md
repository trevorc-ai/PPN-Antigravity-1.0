---
work_order_id: WO-220
title: "Surface OCR Patient Bridge — Make the Camera Scan Feature Discoverable"
type: FEATURE
category: UX / Onboarding / Mobile
priority: P1 (High — user-identified killer feature)
status: 03_BUILD
created: 2026-02-19T09:00:00-08:00
owner: BUILDER
failure_count: 0
depends_on:
  - public/PPN_Bridge_Camera.html (COMPLETE — WO-093)
blocks: []
---

# WO-220: Surface OCR Patient Bridge in the App

## User Goal

The OCR camera scan tool (`public/PPN_Bridge_Camera.html`) is a "killer feature" that currently
has no entry point inside the application. Clinicians cannot discover or access it from the
patient selection workflow. This ticket makes it discoverable and usable.

## What Already Exists (Do Not Rebuild)

- `public/PPN_Bridge_Camera.html` — fully production-ready OCR tool
  - Camera scan → Tesseract.js OCR → PPN ID generation
  - Manual entry fallback
  - Zero-knowledge guarantee (no server calls)
  - Polished mobile UI (16px+ fonts, 52px touch targets, WCAG compliant)
  - Accessible at: `/PPN_Bridge_Camera.html` (served from Vite's public dir)

## What Needs Building

### Phase 1 — Entry Point in PatientSelectModal (SHIP TODAY)

**File:** `src/components/wellness-journey/PatientSelectModal.tsx`

Add a prominent "📷 Scan Patient Label" button that opens the Bridge in a new tab.
Place it **above** the manual ID entry field as the primary action.

```tsx
// Add near the top of the modal, above the manual entry form:
<a
  href="/PPN_Bridge_Camera.html"
  target="_blank"
  rel="noopener noreferrer"
  className="ocr-bridge-btn"
  aria-label="Open camera scanner to generate patient ID (opens in new tab)"
>
  <CameraIcon />  {/* Use existing icon system or inline SVG */}
  📷 Scan Patient Label
  <span className="ocr-bridge-hint">Opens mobile camera scanner</span>
</a>
```

**UX requirement:** The button should:
- Be the most visually prominent element in the modal
- Include a subtitle: "Point phone camera at wristband or chart label"
- Open in new tab (so the modal stays open for the user to paste the result)
- Show the zero-knowledge badge: "🔒 No data leaves your device"

### Phase 2 — QR Code Entry Point (THIS WEEK)

Add a QR code that clinic staff can scan with their phone to open the Bridge on mobile.

**Options:**
- Use `qrcode.react` (check if already in package.json; if not, use CDN or inline SVG QR)
- Or use a pre-generated QR code image pointing to the app's `/PPN_Bridge_Camera.html` route

Place it in:
1. `PatientSelectModal.tsx` — below the camera button, labeled "Or open on your phone:"
2. `Settings` page (if it exists) — "Patient Onboarding Tools" section

### Phase 3 — Navigation Entry (THIS WEEK)

Add "Patient Bridge" to the app sidebar/navigation so it's always one click away.

Check where the sidebar is defined and add:
```
🔬 Patient Bridge → /PPN_Bridge_Camera.html (external link icon)
```

## Acceptance Criteria

- [ ] `PatientSelectModal.tsx` has a "📷 Scan Patient Label" button as the primary action
- [ ] Button opens `/PPN_Bridge_Camera.html` in a new tab
- [ ] Button includes zero-knowledge badge text
- [ ] QR code renders in the modal pointing to the Bridge URL
- [ ] Minimum 52px touch targets on all new elements
- [ ] Minimum 16px font on button text
- [ ] No color-only meaning (icon + text for all states)
- [ ] BUILDER appends grep evidence before QA handoff

## Files to Modify

- `src/components/wellness-journey/PatientSelectModal.tsx` — Add scan button + QR code
- Sidebar navigation file (BUILDER: identify the correct file) — Add Bridge link

## Files NOT to Modify

- `public/PPN_Bridge_Camera.html` — Do not touch. It is production-ready.
- `src/services/identity.ts` — Not in scope for this ticket.

## Notes for BUILDER

The URL `/PPN_Bridge_Camera.html` works in development and production because
Vite serves everything in `public/` at the root path. No routing changes needed.

If `qrcode.react` is not in `package.json`, use this lightweight approach instead:
```tsx
// Inline QR using a Google Charts API call — zero-dependency
<img
  src={`https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(bridgeUrl)}`}
  alt="QR code to open Patient Bridge on mobile"
  width={160}
  height={160}
/>
```
(Note: This does call Google's API — if zero-external-calls is required, use qrcode.react instead.)
