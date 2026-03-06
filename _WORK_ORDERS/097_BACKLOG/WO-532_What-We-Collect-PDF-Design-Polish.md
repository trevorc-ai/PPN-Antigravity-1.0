---
id: WO-532
title: "What We Collect — PDF Design Polish"
status: 01_TRIAGE
priority: P2
created: 2026-03-05
owner: DESIGNER
source_ticket: WO-531
---

## Problem Statement

The "What We Collect / Sterile Schema" trust document was auto-generated as a static PDF using a zero-dependency Node.js script (raw PDF 1.4 spec). The content is fully correct and approved. However, the typographic quality is limited to Helvetica with no custom layout, spacing, or visual hierarchy. It is not ready to be included in partner packets or distributed to clinic owners.

## Target User + Job-To-Be-Done

Clinic owners and prospective pilot partners reviewing PPN Portal's data security posture. They need a polished, on-brand PDF they can share with legal counsel, insurance providers, and compliance teams — a document that communicates institutional credibility at a glance.

## Success Metrics

- [ ] PDF opens cleanly in Preview, Adobe, and Chrome's built-in PDF viewer with zero rendering artifacts
- [ ] Matches PPN brand: dark navy (`#07101e`) or white background variant, Inter + JetBrains Mono fonts
- [ ] All three parts (Hard Boundaries, Evidence of Care, Why It Protects You) are clearly delineated with visual hierarchy
- [ ] Fits on ≤ 2 pages A4/Letter
- [ ] Delivered as a single file: `ppn-data-policy-light.pdf` (print-ready, white background) placed at `public/assets/trust/`

## Feature Scope

**In scope:**
- Redesign the light/print PDF using a proper design tool (Figma, InDesign, or equivalent)
- Typography: Inter for headings/body, JetBrains Mono for Subject ID code example (`PT-KXMR9W2P`)
- Layout: PPN brand colors, indigo accent (`#6366f1`), clean section dividers, PPN Portal logo/wordmark
- Content: Use the approved copy from `public/admin_uploads/PPN_What We Collect_PDF.md` (Age Range and Weight Range already removed)
- Export: White background (print-safe), vector-clean, no image compression artifacts

**Out of scope:**
- Dark PDF variant (deleted per Trevor's direction — `ppn-data-policy-dark.pdf` removed)
- Programmatic PDF generation (BUILDER's auto-generated version is the placeholder only)

## Source Files

| File | Purpose |
|---|---|
| `public/admin_uploads/PPN_What We Collect_PDF.md` | Approved source copy |
| `public/assets/trust/ppn-data-policy-light.pdf` | Current placeholder (replace this file) |
| `src/pages/DataPolicy.tsx` | Web page version for visual reference |

## Delivery Instructions

Place the final polished PDF at:
```
public/assets/trust/ppn-data-policy-light.pdf
```
The download button on `/#/data-policy` and in Settings → Trust & Compliance already point to this path. No code changes needed — just replace the file.

## Open Questions for LEAD / DESIGNER

1. Should the PDF use the PPN Portal logo SVG as a header element? If so, BUILDER can export it.
2. Single-column or two-column layout for Part 2 (Evidence of Care subsections)?
3. Should there be a footer with Trevor's name / clinic signature line as a "Prepared by" field, or keep it purely institutional?
