# PPN Global Asset Ledger

> **CRITICAL RULE FOR ALL AGENTS:** 
> Before proposing any new feature, creating a PRD, or writing React/HTML, you **MUST** review this ledger to understand what currently exists in the platform. This prevents hallucinating duplicate features or breaking existing paths.
> 
> **CRITICAL RULE FOR BUILDERS/QA:**
> If you create a new public-facing page or a major dashboard core component, you **MUST** update this ledger during the `/finalize_feature` process.

---

## 🟢 Public Facing / Marketing Assets
*These assets are handled via the `_GROWTH_ORDERS` pipeline.*

- `trevor-showcase.html`: Public demo page showcasing practitioner capabilities.
- `index.html`: The root marketing/landing page for the PPN Portal.

## 🔵 Core Application / Authenticated Portal
*These assets reside behind Supabase Auth and are handled via the `_WORK_ORDERS/00_INBOX` pipeline.*

- `Dashboard.tsx`: Main hub for authenticated practitioners. Includes Quick Actions and Activity feeds.
- `Patients.tsx`: Patient directory and management portal.
- `WellnessJourney.tsx`: Patient-facing sequence builder and progress tracker. Includes safety checks and protocol configuration.
- `DosingSessionPhase.tsx`: The active "Cockpit Mode" live session interface for practitioners containing patient vitals, timeline, and actionable event buttons (Phase 2).
- `SubstanceMonograph.tsx`: Informational reference pages for specific compounds with detailed interaction data.
- `DownloadCenter.tsx`: Centralized repository for all site-wide exports, print, and save items (WO-556).
- `AdminSharingLibrary.tsx`: Quick-action module for copying direct links to key public assets like the showcase page.

## 🟡 Backend / Database / Utility
- `Supabase` (public schema): Houses patient records, session logs, and the Global Benchmark data. All actions must use Row Level Security (RLS) tracking the practitioner ID.
