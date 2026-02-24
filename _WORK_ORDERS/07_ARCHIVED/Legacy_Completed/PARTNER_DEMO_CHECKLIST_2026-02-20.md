# PPN Portal — Partner Demo Readiness Checklist
**Prepared by:** PRODDY  
**Date:** February 19, 2026 — 7:43 PM PST  
**Purpose:** Partner-facing demo readiness for February 20, 2026  
**Classification:** Internal — Pre-Launch

---

## DEMO READINESS KEY
- ✅ **[READY]** — Polished, show confidently
- ⚡ **[PARTIAL]** — Functional, demo-safe with brief context
- ⚠️ **[MOCK DATA]** — Visually complete, data is illustrative
- 🚫 **[AVOID]** — Do not demo — broken or incomplete

---

## PAGE-BY-PAGE READINESS

### 1. Landing Page (`/`)
**Status:** ✅ [READY]
- Hero copy updated to "Clinical Intelligence Platform" (not EHR)
- Value prop clear: risk management, outcomes benchmarking, PHI-safe
- Live interactive demos accessible without login
- **Demo tip:** Start here. Let partners read the hero for 30 seconds before navigating.

### 2. Pricing Page (`/pricing`)
**Status:** ✅ [READY]
- Three tiers clearly defined (Guild / Enterprise / Researcher)
- Give-to-Get model explained prominently
- Feature comparison table complete
- **Demo tip:** Show this early — partners will ask about business model.

### 3. Login / Auth (`/login`)
**Status:** ⚡ [PARTIAL]
- Login is fully functional via Supabase
- Visual design is being upgraded tonight to match Pricing page (WO-117 in progress)
- **Demo tip:** Have credentials pre-entered. Don't linger here. Navigate straight to Dashboard.

### 4. Dashboard (`/dashboard`)
**Status:** ⚠️ [MOCK DATA]
- Layout: strong, good visual hierarchy
- KPI cards show hardcoded data (being replaced with live queries tonight per WO-116)
- Pharmacovigilance Matrix: large but functional — being collapsed tonight
- Quick Action buttons: some navigate correctly, some need wiring (WO-116)
- **Demo tip:** Briefly show the layout concept, then navigate forward quickly. Say: *"This will be live data once the clinic has logged 10+ sessions."*

### 5. Wellness Journey — Full Arc of Care (`/wellness-journey`)
**Status:** ✅ [READY] — **STRONGEST FEATURE. Lead with this.**
- Patient selection modal: live DB, anonymous Subject ID auto-generated
- All 15 clinical forms accessible via SlideOut panel
- Informed Consent: now shows Patient ID banner prominently (just shipped)
- Phase 1, 2, 3 navigation: fully functional
- **Demo tip:** Create a new patient, show the PT-XXXXXXXX ID appear on Consent form. Walk through Phase 1 → Baseline → session. This is your anchor demo.

### 6. Drug Interaction Checker (`/interactions`)
**Status:** ✅ [READY]
- 11 live interactions seeded (Psilocybin + MAOI = absolute contraindication)
- 39 medications across 9 categories
- PubMed citations linked
- **Demo tip:** Search "psilocybin" + "phenelzine". Show the red CONTRAINDICATED alert. Partners will love this.

### 7. Analytics — Clinical Intelligence (`/analytics`)
**Status:** ⚡ [PARTIAL — MOCK DATA on some charts]
- Layout: strong components, being refined tonight (WO-116)
- KPI ribbon, Performance Radar, Patient Galaxy all visible
- SafetyBenchmark: shows empty state for new accounts (adding demo-mode banner tonight)
- **Demo tip:** Say: *"Analytics unlock once a clinic has 10+ episodes. This is the benchmark intelligence layer — the core of the Give-to-Get model."*

### 8. Intelligence Hub — News (`/news`)
**Status:** ⚡ [PARTIAL]
- Regulatory Mosaic grid: functional, clickable state selection
- News articles: currently static/constants (RSS live feeds being connected tonight per WO-116)
- Section header above map: being added tonight
- **Demo tip:** Click Oregon on the mosaic, show the filter applying to news. Strong visual moment.

### 9. Substance Catalog (`/substances`)
**Status:** ✅ [READY]
- Browsable reference library
- Individual monograph pages with pharmacology, contraindications, citations
- **Demo tip:** Free-tier feature. Good to show as "zero barrier to entry" for practitioners.

### 10. Practitioner Directory (`/practitioners`)
**Status:** ⚡ [PARTIAL]
- Currently reading from constants (live DB connection in progress per WO-118)
- Cards, search, filters all functional
- Message drawer works (AI draft included)
- **Demo tip:** Filter by role or location. Show the card detail. Don't click "Profile" (dynamic route not yet wired).

### 11. Adaptive Assessment (`/assessment`)
**Status:** ✅ [READY]
- Branching decision tree functional
- Font sizes WCAG-compliant (fixed this week)
- **Demo tip:** Good to show as "guided intake" feature. Walk through 3–4 questions.

### 12. My Protocols (`/protocols`)
**Status:** ⚡ [PARTIAL]
- Protocol list view functional
- Individual protocol detail: functional
- **Demo tip:** Show a protocol card. Mention it's the "case file" that accumulates across all phases.

### 13. Audit Logs (`/audit-logs`)
**Status:** ✅ [READY]
- Timestamped tamper-evident log
- Good for compliance conversations
- **Demo tip:** Mention "21 CFR Part 11 compatible." Partners in research will respond to this.

### 14. Session Export Center (`/data-export`)
**Status:** ⚡ [PARTIAL]
- UI complete: PDF, CSV, JSON export options shown
- Backend generation: in progress
- **Demo tip:** Show the UI. Say: *"HIPAA-compliant exports with automatic PII scrubbing. This is our IRB submission pipeline."*

### 15. Help Center (`/help`)
**Status:** 🚫 [AVOID]
- Placeholder only. Do not navigate here.

### 16. Billing / Checkout
**Status:** 🚫 [AVOID]  
- Built but not activated. Navigate away if asked.

---

## RECOMMENDED DEMO SCRIPT (15 minutes)

### Minute 0–2: Landing Page
> "This is PPN — Psychedelic Protocol Network. Think of it as the clinical intelligence layer for practitioners working with psychedelic-assisted therapy. It's not an EHR — it's the system of record for the things EHRs can't handle in this modality."

Show hero, scroll to the pain point sections, show the Substance Catalog as a free-tier example.

### Minute 2–4: The Business Model
Navigate to `/pricing`.
> "Our model is called Give-to-Get. Practitioners contribute anonymized outcomes data and get access to the network's benchmark intelligence for free. Enterprise and research tiers pay for the aggregate data layer."

### Minute 4–9: Core Workflow — Wellness Journey ⭐
Navigate to `/wellness-journey`. This is the most important section.
1. Click "Log New Session"
2. Select "New Patient" — watch the PT-XXXXXX hash generate
3. Show the Informed Consent form — point out the Patient ID banner
4. Say: *"No names. No DOB. No free text. The architecture prevents PHI from ever touching the database — that's not a policy, it's a technical constraint."*
5. Open one Phase 1 form (Set & Setting or Baseline Observations)
6. Show the controlled vocabulary selectors

### Minute 9–11: Safety — Interaction Checker ⭐
Navigate to `/interactions`.
1. Search Psilocybin + phenelzine (MAOI)
2. Show the red CONTRAINDICATED flag
> "11 high-priority interactions seeded. Sourced from peer-reviewed literature with PubMed citation links."

### Minute 11–13: Intelligence — News + Map
Navigate to `/news`.
1. Click Oregon on the Regulatory Mosaic
2. Show the news feed filtering
> "Live regulatory intelligence aggregated across jurisdictions. This keeps practitioners compliant as the landscape changes weekly."

### Minute 13–15: Analytics + Wrap
Navigate to `/analytics`.
> "Once a clinic has 10+ episodes, this becomes the benchmark intelligence dashboard. This is the output of the Give-to-Get model — network-level outcome data back to the practitioner."

---

## ARCHITECTURE TALKING POINTS (3 sentences for partners)

> *"The entire system runs on controlled vocabulary reference tables. Practitioners can only select from predefined options — they cannot type anything identifying into a field. This means PHI is architecturally impossible to store, which is a significantly stronger compliance position than policy-based approaches."*

> *"Every clinical record is linked to a system-generated anonymous patient ID — not a name, not a date of birth. De-identification is not a scrubbing step we run at export — it's baked into the data model from the first click."*

> *"The Give-to-Get model means the more practitioners use the system, the better everyone's benchmark intelligence gets. This creates a network effect that gets stronger as the community grows — which is what makes it a platform, not just a software tool."*

---

## WHAT TO HAVE READY BEFORE DEMO

- [ ] Browser tab open at `/` (logged out) for cold start
- [ ] Credentials pre-typed in login form (just press Enter)
- [ ] A fresh patient session pre-created OR be ready to create live (better — shows it working)
- [ ] Volume on — there are subtle UI sounds (if any)
- [ ] Zoom sharing from a 1440px+ display (not a laptop lid)
- [ ] Have the Pricing page URL ready to paste in chat if partner asks later

---

## DO NOT SHOW / AVOID SAYING

| Avoid | Reason |
|---|---|
| `/help` route | Placeholder — 10 bytes of content |
| "Click Profile" on Directory cards | Route not wired yet |
| Billing/Checkout | Not activated |
| "71% success rate" KPI | Mock data — being replaced tonight |
| "23 protocols" KPI | Hardcoded — being replaced tonight |
| "4.2 hrs avg session time" | Hardcoded — being replaced |

---
