---
work_order_id: WO_024
title: Implement Reagent Color Analysis (CV)
type: FEATURE
category: Feature
priority: LOW
status: INBOX
created: 2026-02-14T23:40:23-08:00
requested_by: Trevor Calton
assigned_to: BUILDER
estimated_complexity: 5/10
failure_count: 0
owner: BUILDER
status: 03_BUILD
---

# Work Order: Implement Reagent Color Analysis (CV)

## 🎯 THE GOAL

Add a Computer Vision tool to the "Substance Calibration" flow to verify reagent test results.

### PRE-FLIGHT CHECK

- Check if `react-webcam` or similar library is installed

### Directives

1. **UI:** Add a "Verify Reagent" button next to the batch input

2. **Feature:**
   - Capture an image via camera
   - Sample the center pixels to get the HEX color code
   - Compare HEX against a `ref_reagent_colors` map (e.g., Ehrlich = Purple #800080)

3. **Output:** "Match Confirmed" (Green) or "Inconclusive/Warning" (Yellow)

4. **Storage:** Store the `verification_status` in `log_doses`

---

## 🎯 THE BLAST RADIUS (Authorized Target Area)

- `src/components/science/ReagentCamera.tsx` (New)
- `src/utils/colorAnalysis.ts` (New Logic)

---

## ⚡ THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

**DO NOT:**
- Upload the photo to the server (Privacy)
- Claim "100% Purity"

**MUST:**
- Process the color locally and only save the *result*
- Use language like "Spectrum Match"

---

## ✅ Acceptance Criteria

### Pre-Flight Verification
- [ ] Check if `react-webcam` is installed

### UI Implementation
- [ ] "Verify Reagent" button added to batch input
- [ ] Camera capture interface

### Color Analysis
- [ ] `ReagentCamera.tsx` component created
- [ ] `colorAnalysis.ts` utility created
- [ ] Capture image via camera
- [ ] Sample center pixels for HEX color
- [ ] Compare against `ref_reagent_colors` map
- [ ] Local processing only (no upload)

### Output & Storage
- [ ] "Match Confirmed" (Green) display
- [ ] "Inconclusive/Warning" (Yellow) display
- [ ] `verification_status` stored in `log_doses`
- [ ] Use "Spectrum Match" language (not "100% Purity")

---

## 📝 MANDATORY COMPLIANCE

### ACCESSIBILITY
- **Provide text feedback** ("Color detected: Purple") for colorblind users
- Color-coded results must have text labels

---

## 🚦 Status

**INBOX** - Awaiting LEAD architectural review

---

## 📋 Technical Specifications

### Color Matching
```typescript
const reagentColors = {
  ehrlich: { hex: '#800080', name: 'Purple', substance: 'Indoles' },
  marquis: { hex: '#4B0082', name: 'Purple/Black', substance: 'MDMA' },
  mecke: { hex: '#006400', name: 'Dark Green', substance: 'Opioids' }
};
```

---

## Dependencies

- `react-webcam` library (or similar)

## LEAD ARCHITECTURE

**Technical Strategy:**
Create Computer Vision tool using camera to verify reagent test results via color matching.

**Files to Touch:**
- `src/components/science/ReagentCamera.tsx` - NEW: Camera component
- `src/utils/colorAnalysis.ts` - NEW: HEX color sampling logic
- `package.json` - Add react-webcam dependency

**Constraints:**
- MUST NOT upload photos to server (Privacy)
- MUST process color locally
- MUST use "Spectrum Match" language (not "100% Purity")
- MUST provide text feedback for colorblind users

**Recommended Approach:**
1. Install react-webcam: `npm install react-webcam`
2. Capture image via camera
3. Sample center pixels for HEX color code
4. Compare against `ref_reagent_colors` map
5. Display "Match Confirmed" (Green) or "Inconclusive" (Yellow)
6. Store `verification_status` in `log_doses`

**Risk Mitigation:**
- Local processing only (no upload)
- Text labels for color-coded results (accessibility)
- Clear messaging about limitations
