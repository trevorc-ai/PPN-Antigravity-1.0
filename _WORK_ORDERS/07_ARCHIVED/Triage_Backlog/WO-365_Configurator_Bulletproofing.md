---
status: 01_TRIAGE
owner: SOOP
failure_count: 0
---

## 1. SOOP & LEAD ADDITIONAL BULLETPROOFING

The user rightly pointed out that we need to avoid introducing *any* fragility into the architecture. Looking at the proposed `ProtocolContext` (frontend state), there are three massive architectural blind spots that must be addressed to make this system truly bulletproof:

### A. The "Browser Refresh" Vulnerability (Data Persistence)
*   **The Flaw:** `ProtocolContext` is just React state. If the clinician closes their laptop, refreshes the browser, or comes back 3 days later for Phase 3 (Integration), the context is wiped. The UI would revert to default, and all hidden buttons would suddenly reappear, confusing the user and breaking the readiness math again.
*   **The Bulletproof Fix:** We must persist the configuration to the database. We need to add `protocol_archetype` (string) and `enabled_features` (jsonb array) columns to the underlying `log_clinical_records` (or equivalent session table) in Supabase. The context must hydrate from the DB on load.

### B. The "Mid-Flight Change" Vulnerability (State Immutability)
*   **The Flaw:** What happens if a guide selects "Ceremonial" (skipping the PHQ-9 baseline), proceeds to Phase 2, and then decides to open the settings and switch to "Clinical"? Suddenly, the Readiness Engine demands a PHQ-9 baseline that was never taken, hard-locking the session and breaking the UI.
*   **The Bulletproof Fix:** The Protocol Configuration must be mathematically **immutable** once Phase 2 (Dosing) begins. We must lock the Configurator Modal and enforce that you cannot add strict clinical requirements retroactively once a session has started.

### C. The "Safe Default" Fallback
*   **The Flaw:** If the database fetch fails, or a legacy session from before this feature was built is loaded, what does the UI do?
*   **The Bulletproof Fix:** The system must degrade gracefully to a "Strict Clinical Default". If `enabled_features` is null or undefined, the system falls back to expecting *everything*. This ensures we never accidentally hide required compliance forms for older sessions.
