# PPN Research Portal - Architecture Overview
**Date:** February 8, 2026  
**Version:** v3.33

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     PPN RESEARCH PORTAL                          │
│                         (Frontend)                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE BACKEND                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Auth       │  │  PostgreSQL  │  │  Storage     │          │
│  │   (JWT)      │  │   Database   │  │  (Files)     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Frontend Stack

```
┌─────────────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER                                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React 19.2.3 + TypeScript 5.8.2                         │   │
│  │  - 27 Pages + 12 Deep Dive Analytics                     │   │
│  │  - React Router 7.13.0 (HashRouter)                      │   │
│  │  - Framer Motion (animations)                            │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│  STATE MANAGEMENT                                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Context API                                             │   │
│  │  - AuthContext (Supabase auth state)                     │   │
│  │  - Local useState (component state)                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│  DATA LAYER                                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Supabase Client (@supabase/supabase-js 2.95.3)          │   │
│  │  - Direct queries in components                          │   │
│  │  - newsService.ts (abstraction)                          │   │
│  │  - Real-time subscriptions                               │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│  STYLING                                                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Tailwind CSS 3.x (CDN)                                  │   │
│  │  - Custom theme (index.html)                             │   │
│  │  - Design system tokens                                  │   │
│  │  - Glassmorphism utilities (index.css)                   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Schema (Current State)

```
┌─────────────────────────────────────────────────────────────────┐
│  IMPLEMENTED TABLES (8)                                          │
│                                                                  │
│  ✅ regulatory_states      - State regulation tracking           │
│  ✅ news                   - Intelligence feed                   │
│  ✅ profiles               - User profiles (auth.users FK)       │
│  ✅ log_clinical_performance - Aggregated clinic metrics         │
│  ✅ ref_pharmacology       - Receptor binding data               │
│  ✅ ref_protocol_financials - Protocol cost/revenue              │
│  ✅ ref_metabolic_rules    - Metabolizer safety rules            │
│  ⚠️  view_patient_clusters  - View (references missing table)    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  MISSING CRITICAL TABLES (10+)                                   │
│                                                                  │
│  ❌ sites                   - Site management                    │
│  ❌ user_sites              - User-to-site role mapping          │
│  ❌ ref_substances          - Drug catalog (RxNorm)              │
│  ❌ ref_routes              - Administration routes              │
│  ❌ ref_assessments         - Outcome instruments                │
│  ❌ ref_support_modality    - Therapy modalities                 │
│  ❌ log_clinical_records    - Patient clinical data              │
│  ❌ log_outcomes            - Outcome measurements               │
│  ❌ log_safety_events       - Adverse events                     │
│  ❌ log_interventions       - Treatment sessions                 │
│  ❌ log_consent             - Consent tracking                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
App.tsx (AuthProvider wrapper)
│
├─ Public Routes
│  ├─ Landing.tsx (30,762 bytes)
│  ├─ Login.tsx
│  └─ SignUp.tsx
│
└─ Protected Routes (ProtectedLayout)
   │
   ├─ Layout Components
   │  ├─ TopHeader.tsx (search, notifications, user menu)
   │  ├─ Sidebar.tsx (accordion navigation)
   │  └─ Footer.tsx
   │
   ├─ Core Pages (27)
   │  ├─ Dashboard.tsx ✅ max-w-7xl
   │  ├─ Analytics.tsx ⚠️ needs max-w-7xl
   │  ├─ ProtocolBuilder.tsx ✅ max-w-[1600px] (65,968 bytes!)
   │  ├─ ProtocolDetail.tsx ⚠️ reduce to max-w-[1600px]
   │  ├─ SearchPortal.tsx ✅ max-w-[1600px]
   │  ├─ IngestionHub.tsx ✅ max-w-[1600px]
   │  ├─ InteractionChecker.tsx ⚠️ increase to max-w-[1600px]
   │  ├─ Notifications.tsx ⚠️ standardize to max-w-7xl
   │  ├─ SubstanceCatalog.tsx ⚠️ add max-w-7xl
   │  ├─ ClinicianDirectory.tsx ✅ max-w-7xl
   │  ├─ News.tsx ✅ max-w-7xl
   │  ├─ HelpFAQ.tsx ✅ max-w-4xl
   │  └─ ... (15 more pages)
   │
   └─ Deep Dive Pages (12)
      ├─ RegulatoryMapPage.tsx
      ├─ ClinicPerformancePage.tsx
      ├─ PatientConstellationPage.tsx
      ├─ MolecularPharmacologyPage.tsx
      ├─ ProtocolEfficiencyPage.tsx
      ├─ PatientJourneyPage.tsx
      ├─ RiskMatrixPage.tsx
      └─ ... (5 more)
```

---

## Data Flow: ProtocolBuilder Submission

```
┌─────────────────────────────────────────────────────────────────┐
│  USER INTERACTION                                                │
│  1. Fills out ProtocolBuilder form                               │
│  2. Clicks "Submit Protocol"                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  CLIENT-SIDE PROCESSING                                          │
│  3. Validates required fields                                    │
│  4. Generates patient hash (SHA-256)                             │
│  5. Stores in localStorage (recentSubjects)                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  SUPABASE INSERT (CURRENT)                                       │
│  6. Attempts insert to 'protocols' table ❌ DOESN'T EXIST        │
│  7. Returns error                                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  SUPABASE INSERT (NEEDED)                                        │
│  6. Insert to 'log_clinical_records' ✅ TO BE CREATED            │
│  7. RLS checks site_id + role                                    │
│  8. FK validation against ref_substances, ref_routes             │
│  9. Returns success + record ID                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  USER FEEDBACK                                                   │
│  10. Success toast + modal close                                 │
│  11. Redirect to ProtocolDetail page                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Security Model (Target State)

```
┌─────────────────────────────────────────────────────────────────┐
│  AUTHENTICATION (Supabase Auth)                                  │
│  - Email/password login                                          │
│  - JWT tokens                                                    │
│  - Session management                                            │
│  - Real-time auth state updates                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  AUTHORIZATION (RLS Policies)                                    │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  SITE ISOLATION                                            │ │
│  │  - User belongs to site via user_sites.site_id             │ │
│  │  - Can only read/write data for their site                 │ │
│  │  - Network admin can see all sites                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  ROLE-BASED ACCESS                                         │ │
│  │  - network_admin: Full access, can delete test data        │ │
│  │  - site_admin: Manage own site                             │ │
│  │  - clinician: Create/edit clinical records                 │ │
│  │  - analyst: Read-only access to site data                  │ │
│  │  - auditor: Read-only access to site data                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  REFERENCE TABLE ACCESS                                    │ │
│  │  - Read: All authenticated users                           │ │
│  │  - Write: network_admin only                               │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## File Size Distribution

```
Large Files (>20KB):
████████████████████████████████████████████████ ProtocolBuilder.tsx (65,968)
███████████████████████████████ SearchPortal.tsx (38,737)
████████████████████████ ProtocolDetail.tsx (35,467)
████████████████████ Landing.tsx (30,762)
██████████████████ SecureGate.tsx (29,086)
███████████████ ClinicianProfile.tsx (26,062)
██████████████ SubstanceMonograph.tsx (26,850)

Medium Files (10-20KB):
████████ InteractionChecker.tsx (17,051)
████████ ClinicianDirectory.tsx (16,301)
████████ Notifications.tsx (15,338)
████████ News.tsx (15,313)
████████ SubstanceCatalog.tsx (15,013)

Small Files (<10KB):
████ Most other components
```

---

## Design System Compliance

```
┌─────────────────────────────────────────────────────────────────┐
│  CONTAINER WIDTH COMPLIANCE                                      │
│                                                                  │
│  ✅ Correct (13 pages)                                           │
│  ├─ Dashboard, Landing, ProtocolBuilder, SearchPortal           │
│  ├─ IngestionHub, ClinicianDirectory, ClinicianProfile          │
│  ├─ News, HelpFAQ, About, and 3 more...                         │
│                                                                  │
│  ⚠️  Needs Fix (7 pages)                                         │
│  ├─ Analytics (add max-w-7xl)                                    │
│  ├─ ProtocolDetail (reduce to 1600px)                           │
│  ├─ Notifications (standardize to 7xl)                           │
│  ├─ InteractionChecker (increase to 1600px)                     │
│  ├─ SubstanceCatalog (add max-w-7xl)                            │
│  └─ 2 more deep-dive pages                                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  COLOR SYSTEM                                                    │
│                                                                  │
│  ⚠️  15+ unique hex values in use (should consolidate to 5)      │
│                                                                  │
│  Target Palette:                                                 │
│  ├─ App Background: #0e1117                                      │
│  ├─ Page Background: #05070a                                     │
│  ├─ Card Background: #0f1218                                     │
│  ├─ Input Background: #0a0c10                                    │
│  └─ Section Background: #0b0e14                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Development Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│  LOCAL DEVELOPMENT                                               │
│                                                                  │
│  1. npm install          (restore dependencies)                  │
│  2. npm run dev          (start Vite dev server on :3000)        │
│  3. Edit code            (HMR auto-reload)                       │
│  4. Test in browser      (http://localhost:3000)                 │
│  5. git commit           (feature-based commits)                 │
│  6. git push             (to new-branch-name)                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  PRODUCTION BUILD                                                │
│                                                                  │
│  1. npm run build        (Vite production build)                 │
│  2. npm run preview      (test production build locally)         │
│  3. Deploy to host       (Vercel/Netlify/custom)                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Testing Strategy (Planned)

```
┌─────────────────────────────────────────────────────────────────┐
│  UNIT TESTS (Vitest)                                             │
│  ├─ Utility functions (generatePatientHash, etc.)                │
│  ├─ Type guards and validators                                   │
│  └─ Pure functions in services                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  COMPONENT TESTS (React Testing Library)                         │
│  ├─ Form validation (ProtocolBuilder)                            │
│  ├─ User interactions (buttons, dropdowns)                       │
│  ├─ Conditional rendering                                        │
│  └─ Accessibility (ARIA labels, keyboard nav)                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  INTEGRATION TESTS                                               │
│  ├─ Supabase queries                                             │
│  ├─ Auth flow (login, logout, session)                           │
│  ├─ RLS policy enforcement                                       │
│  └─ Data submission (ProtocolBuilder → DB)                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  E2E TESTS (Playwright/Cypress)                                  │
│  ├─ Critical user flows                                          │
│  ├─ Protocol submission end-to-end                               │
│  ├─ Search and filter functionality                              │
│  └─ Multi-page navigation                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture (Planned)

```
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND (Static Hosting)                                       │
│  ├─ Vercel / Netlify / Cloudflare Pages                          │
│  ├─ CDN distribution                                             │
│  ├─ Automatic HTTPS                                              │
│  └─ Environment variables (VITE_SUPABASE_*)                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  BACKEND (Supabase Cloud)                                        │
│  ├─ PostgreSQL database (managed)                                │
│  ├─ Auth service (JWT)                                           │
│  ├─ Storage (file uploads)                                       │
│  ├─ Real-time subscriptions                                      │
│  └─ Edge functions (serverless)                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Performance Metrics (Target)

```
┌─────────────────────────────────────────────────────────────────┐
│  LIGHTHOUSE SCORES (Target)                                      │
│                                                                  │
│  Performance:    90+  ████████████████████░                      │
│  Accessibility:  95+  ███████████████████░░                      │
│  Best Practices: 90+  ████████████████████░                      │
│  SEO:            90+  ████████████████████░                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  CORE WEB VITALS (Target)                                        │
│                                                                  │
│  LCP (Largest Contentful Paint):   < 2.5s                        │
│  FID (First Input Delay):          < 100ms                       │
│  CLS (Cumulative Layout Shift):    < 0.1                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Metrics Summary

```
┌─────────────────────────────────────────────────────────────────┐
│  PROJECT HEALTH                                                  │
│                                                                  │
│  Overall Score:           7.2/10  ███████░░░                     │
│  Frontend Readiness:      8.5/10  ████████░░                     │
│  Backend Readiness:       4.0/10  ████░░░░░░                     │
│  Security Compliance:     5.0/10  █████░░░░░                     │
│  Documentation:           9.0/10  █████████░                     │
│                                                                  │
│  Lines of Code:           ~50,000                                │
│  Components:              24                                     │
│  Pages:                   39 (27 + 12 deep-dives)                │
│  Database Tables:         8/18 (44%)                             │
│  Test Coverage:           0%                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

**Document Version:** 1.0  
**Last Updated:** February 8, 2026  
**Maintained By:** Antigravity AI
