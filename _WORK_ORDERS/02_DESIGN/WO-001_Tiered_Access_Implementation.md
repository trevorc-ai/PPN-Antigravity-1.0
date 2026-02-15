---
id: WO-001
status: 02_DESIGN
priority: P1 (Critical)
category: Feature / Architecture
owner: DESIGNER
assigned_date: 2026-02-15T05:44:00-08:00
failure_count: 0
---

# User Request

> [!IMPORTANT]
> **USER PRIORITY:** The user is most concerned about layout and page organization. DESIGNER must create page mockups and layout proposals FIRST before any implementation begins. User needs to review and approve the visual structure and navigation flow.
> 
> **CRITICAL REQUIREMENTS:**
> - Proposal must integrate **ALL existing features and components** into the new tiered structure
> - **New pages may be added** if needed to properly organize features
> - **Sidebar reorganization** may be required to accommodate the new structure
> - **Clinic-level components MUST include filtering** (site selector, date range, cohort filters, etc.)
> - **Individual patient-level components do NOT need filtering** (single patient view only)

**TASK TITLE:** Comprehensive Site Audit and Tiered Access Implementation

## 1. THE GOAL

Perform a full structural audit and implement a tiered access model across the application.

### Core Objectives:

- **Audit & Placement:** Map every existing React component and page. Ensure all navigation links work and components are placed in their logically correct directories (e.g., `/frontend/components/analytics` vs. `/frontend/components/ui`).

- **Tiered Feature Mapping:** Configure the application logic to restrict or grant access based on five distinct user tiers:
  - **Patient/Consumer (Free):** Access to Drug Interaction Graph, Safety Matrix, and Playlist Connections only. No access to aggregate analytics.
  - **Individual Practitioner:** Access to private patient longitudinal tracking and personal baseline analytics.
  - **Single-Site Clinic:** Adds clinic-wide dashboarding and shared protocol libraries.
  - **Multi-Site Clinic:** Adds geospatial location filtering and cross-site telemetry.
  - **Enterprise:** Full access including "Network Hive Mind" predictive analytics and administrative audit logs.

- **Pricing Grid Update:** Synchronize the `/pricing` page grid to visually reflect these exact feature buckets.

- **Auth & Stripe Integration:** Update Supabase Auth metadata hooks and Stripe subscription product IDs to enforce these permission gates. Ensure a "Free" tier user is automatically routed to the Consumer experience upon signup.

## 2. THE BLAST RADIUS (Authorized Target Area)

You and the swarm are ONLY allowed to modify the following specific files/areas:

- `/frontend/src/pages/Pricing.tsx`
- `/frontend/src/pages/Landing.tsx`
- `/frontend/src/components/auth/` (Auth providers and hooks)
- `/frontend/src/routes/` (Route guards and tiered navigation logic)
- `/.antigravity/stripe_config.yaml` or relevant Stripe initialization files

## 3. THE ELECTRIC FENCE (Strict "DO NOT TOUCH" Constraints)

- DO NOT modify any existing clinical data schemas or RLS (Row Level Security) policies unless it is to add a `user_tier` check.
- DO NOT alter the visual design of the "Clinical Sci-Fi" theme (Aurora gradients and Deep Slate backgrounds).
- DO NOT touch the core scientific logic inside the Receptor Affinity or Drug Interaction knowledge graphs.
- Ensure no existing longitudinal tracking functionality is broken for practitioners during the tier migration.
- Ensure that "Free" tier users are never prompted for PHI/PII; the safety features must remain strictly anonymous.

## 4. MANDATORY COMPLIANCE

### Accessibility:
- Maintain minimum 12px fonts (`text-xs`)
- Use icons (🔒) alongside disabled "Pro" features in the UI to indicate tiered restrictions to color-blind users

### Security:
- NO PHI/PII data collection
- User identities for Stripe/Auth must remain separate from clinical de-identified records

## 5. DESIGNER DELIVERABLES (REQUIRED BEFORE BUILD)

The DESIGNER must create and deliver the following mockups for user approval:

### A. Complete Feature Audit & Inventory
- **Scan and document ALL existing React components and pages** in the codebase
- Create a comprehensive inventory showing:
  - Current location of each component/page
  - Proposed new location (if reorganization needed)
  - Which tier(s) can access each feature
  - Whether filtering is required (clinic-level vs. individual patient-level)

### B. Site Map & Navigation Flow
- Complete sitemap showing all pages and their hierarchy
- Navigation structure for each of the 5 user tiers
- Visual indication of which pages are accessible to which tiers
- **Proposed sidebar reorganization** to accommodate all features across tiers
- Indication of where new pages may be added

### C. Page Layout Mockups
Create mockups for each tier showing:
- **Free/Consumer Tier:** Landing page, Drug Interaction Graph, Safety Matrix, Playlist Connections
- **Individual Practitioner:** Above + Patient Longitudinal Tracking, Personal Analytics Dashboard
- **Single-Site Clinic:** Above + Clinic Dashboard, Protocol Library (with filtering UI)
- **Multi-Site Clinic:** Above + Geospatial Filtering, Cross-Site Telemetry (with site selector)
- **Enterprise:** Above + Network Hive Mind, Admin Audit Logs (with full filtering suite)

### D. Filtering Specifications
- **Clinic-level components:** Must show filtering UI (site selector, date range, cohort filters)
- **Individual patient-level components:** No filtering needed (single patient context)
- Visual mockups showing where filters appear in the UI

### E. Pricing Page Redesign
- Updated pricing grid showing all 5 tiers
- Feature comparison table with visual indicators (🔒 for locked features)
- Clear CTA buttons for each tier

### F. Component Organization Map
- Directory structure showing where each component should live
- Logical grouping (e.g., `/components/analytics`, `/components/ui`, `/components/auth`)
- Migration plan for components that need to move

