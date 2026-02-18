---
id: WO-100
title: "GTM Landing Page Architecture & Navigation Strategy"
status: 02_DESIGN
owner: DESIGNER
priority: P1
category: Design / GTM
depends_on: WO-094
---

# WO-100: GTM Landing Page Architecture

## 🎯 OBJECTIVE
Design the high-level navigation and routing architecture to support the **"Separate Funnels"** strategy (WO-094 Pivot).

## 📋 REQUIREMENTS
1. **Main Entry (`/`)**: A "Traffic Controller" page. Distinctly routes traffic to either "Practitioners (Grey)" or "Clinics (White)".
   - Must NOT blend the brands.
   - Clear visual separation.
2. **Sub-Brand Routing**:
   - `/phantom-shield` (or `shield.domain.com`) -> Grey Market Funnel.
   - `/clinic-commander` (or `clinic.domain.com`) -> Licensed Clinic Funnel.
3. **Shared Utility Routing**:
   - `/pricing` -> Needs a toggle or split view? Or distinct pricing pages? (Recommend distinct).
   - `/login` -> Unified login, but landing destination depends on user role.

## 🚚 DELIVERABLES
- [ ] Sitemap Diagram (Mermaid.js)
- [ ] Wireframe for "Traffic Controller" Hero Section
- [ ] Navigation Bar logic (does it change based on section?)
- [ ] URL Structure Specification

## 🔗 LINKS
- Reference WO-094 for strategy.
