---
name: marketing-qa-checklist
description: Quantitative performance, SEO, and CRO checklists for the INSPECTOR agent to run on published _GROWTH_ORDERS.
---

# Marketing QA & Durability Checklist

This protocol is used by the INSPECTOR agent during Phase `06_QA` in the `_GROWTH_ORDERS` pipeline. It supplements the standard `inspector-qa-script`.

## 1. SEO & AIO Verification
- [ ] **Title Tag:** Exists, unique, < 60 characters.
- [ ] **Meta Description:** Exists, contains the primary keyword, < 155 characters.
- [ ] **JSON-LD Schema:** Valid `Schema.org` JSON-LD block is present in the `<head>` of the built page (crucial for Google AI Overviews).
- [ ] **Header Hierarchy:** The page contains exactly ONE `<h1>` tag. Subsequent headers use strict logical nesting (`<h2>`, `<h3>`).
- [ ] **Internal Linking:** The page links to at least one other relevant internal PPN route (verified against `ASSET_LEDGER.md`).

## 2. CRO (Conversion Rate Optimization) Verification
- [ ] **Primary Action:** There is a single, clear Primary Call to Action (CTA) visible above the fold on standard desktop viewports.
- [ ] **Contrast:** The primary CTA button color meets WCAG AA contrast ratios against its background.
- [ ] **Consistency:** CTAs use recognized PPN design system terminology (e.g., "Join Network", "View Showcase", not "Submit" or "Click Here").

## 3. Performance Thresholds
The integration of the marketing UI into the main React app must not degrade core platform performance.
- [ ] **Lighthouse Performance:** Score must simulate >= 90.
- [ ] **Lighthouse Accessibility:** Score must be 100.
- [ ] **Axe-Core Audit:** 0 Critical or Serious violations allowed.

## 4. Ledger Synchronization (MANDATORY)
- [ ] The `ASSET_LEDGER.md` file in the root directory HAS BEEN UPDATED to include this new route/page. The text matches the newly deployed reality. *If the ledger is stale, the QA fails immediately.*
