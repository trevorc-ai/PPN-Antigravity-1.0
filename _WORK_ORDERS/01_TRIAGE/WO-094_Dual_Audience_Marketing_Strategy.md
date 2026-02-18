---
id: WO-094
title: "Dual-Audience Marketing Strategy: Grey Market vs Licensed Clinics"
status: 01_TRIAGE
priority: P1 (Critical)
category: Strategic Analysis / Marketing
type: MARKET_STUDY (not a build order)
owner: PRODDY
secondary_owner: ANALYST
failure_count: 0
created_date: 2026-02-17T19:21:00-08:00
requested_by: USER
ticket_type: EVALUATION — Strategic Analysis & Recommendations
---

# WO-094: Dual-Audience Marketing Strategy

## 🎯 USER REQUEST (Verbatim)

> "I want PRODDY and ANALYST to analyze, assess and provide recommendations/proposals for a dual-audience marketing strategy: one for clinics and one for religious/'grey' market."
>
> **This is NOT a design build work order. This is a market study and strategic analysis.**

---

## 🚨 SCOPE GUARDRAIL

**PRODDY + ANALYST PRODUCE ANALYSIS AND RECOMMENDATIONS ONLY.**

### ❌ ABSOLUTELY FORBIDDEN:
- **DO NOT write any code**
- **DO NOT edit any source files**
- **DO NOT run any terminal commands**
- **DO NOT modify any existing pages or components**

### ✅ DELIVERABLES ARE:
- Written strategic analysis (appended to this ticket)
- Recommendations and proposals (markdown only)
- Segment-specific messaging frameworks
- Conversion funnel recommendations
- Website structure proposals
- Prioritized action items for future work orders

---

## 📋 CONTEXT & SEED MATERIAL

The USER has provided extensive Gemini research notes as a starting point. PRODDY and ANALYST should use this as a foundation, validate against the research documents in `/public/admin_uploads/tc_notes/`, and produce a refined, actionable strategy.

---

## 💡 GEMINI SEED NOTES (USER-PROVIDED)

### DUAL STRATEGIC POSITIONING

**Core Message:**
> "The Operating System for Safe Psychedelic Practice"
> Not a research tool. Not a social network. An essential safety infrastructure.

---

### SEGMENT A: Grey Market / Religious Practitioners

**Their Pain:**
- "I am terrified of a lawsuit or board complaint"
- "I could go to jail if something goes wrong"
- "I have no way to prove I was being safe"
- "One bad incident could end my organization"

**Proposed Message:** "Don't Let One Bad Trip End Your Practice"

**Brand:** The Phantom Shield — Legal defense tools for practitioners in uncertain regulatory environments.

**Value Props:**
- Audit Defense System — Timestamped proof of safety protocols
- Potency Calculator — Prevent 911 calls (keeps ambulance away = keeps police away)
- Crisis Logger — Legal documentation during adverse events
- Zero-Knowledge Architecture — Even we can't see your client identities

**CTA:** "Protect Your Practice" (not "Join the Network")

---

### SEGMENT B: Licensed Clinics (Ketamine / Regulated Psilocybin)

**Their Pain:**
- "I don't know which protocols actually work"
- "I'm flying blind on unit economics"
- "Insurance won't cover us without outcomes data"
- "I'm terrified of malpractice liability"

**Proposed Message:** "Stop Flying Blind. Start Making Data-Driven Decisions."

**Brand:** Clinic Commander — The only platform that shows you what's working in real-time.

**Value Props:**
- Real-Time Benchmarking — Compare outcomes to 1,000+ practitioners
- Unit Economics Dashboard — Track which protocols are profitable
- Insurance Dossier Generator — Prove value to payers
- Malpractice Shield — Audit-ready documentation

**CTA:** "See Your Benchmarks" (not "Sign Up")

---

### UNIFIED LANDING PAGE STRUCTURE (Proposed)

**Hero:**
```
The Operating System for Safe Psychedelic Practice
Stop improvising. Start proving.
[Protect Your Practice]  [See Benchmarks]
```

**Problem Statement (Fear-Based):**
```
The Industry's Dirty Secret:
❌ 73% of practitioners have no standardized safety protocols
❌ One adverse event can end your career
❌ Insurance companies are denying coverage due to lack of data
❌ You're one lawsuit away from losing everything
```

**Two-Path Solution:**
- Path 1: 🛡️ THE PHANTOM SHIELD (Grey Market)
- Path 2: 📊 CLINIC COMMANDER (Licensed Clinics)

**The "Trojan Horse" Data Bounty:**
> Contribute de-identified outcomes data → save 75% on subscription.
> Psychology: They come for safety/benchmarking, stay for the discount, you get the data.

---

### PROPOSED WEBSITE STRUCTURE

**Public Pages:**
- `/landing` → Dual-path hero
- `/phantom-shield` → Grey market landing page
- `/clinic-commander` → Clinical landing page
- `/about` → "Why We Exist" (industry crisis narrative)
- `/pricing` → Transparent 3-tier with Data Bounty
- `/data-trust` → Zero-Knowledge architecture explanation
- `/safety` → Safety features showcase

**Authenticated Pages:**
- `/dashboard` → Personalized by tier
- `/protocols` → Protocol Builder
- `/benchmarks` → Real-time benchmarking
- `/safety-tools` → Potency Calculator, Crisis Logger, Interaction Checker
- `/insurance` → Dossier generator (Risk Shield tier only)
- `/data-contribution` → Manage data sharing preferences

---

### KEY MESSAGING PRINCIPLES

**1. Fear-Based Motivation**
- ❌ "Join a community of practitioners" → ✅ "Don't let one bad trip end your career"
- ❌ "Track your outcomes" → ✅ "Prove you followed standard of care"
- ❌ "Research portal" → ✅ "Audit defense system"

**2. Segment-Specific Language**

Grey Market: "Legal defense", "Audit trail", "Zero-knowledge privacy", "Phantom Shield", "Prove you were safe"

Licensed Clinics: "Real-time benchmarking", "Unit economics", "Insurance approval", "Clinic Commander", "Data-driven decisions"

**3. Framing (The Trojan Horse)**
- Lead with: "We help you stay safe and profitable"
- Then reveal: "Oh, and if you contribute data, you save 75%"

---

### TAGLINE OPTIONS

1. **"The Operating System for Safe Psychedelic Practice"** ← Recommended main tagline
2. "Safety, Solvency, & Science"
3. **"Don't Fly Blind. Don't Go Broke. Don't Get Sued."** ← Recommended hero subheading
4. "Prove You're Not Reckless"
5. "The Switzerland of Psychedelic Data"

---

### CONVERSION FUNNELS (Proposed)

**Grey Market Path:**
Landing → "Protect Your Practice" CTA → Phantom Shield page → Safety features → Pricing ($49 with data) → Signup + Data Contribution Agreement → Onboarding: Cockpit Mode tutorial

**Clinical Path:**
Landing → "See Benchmarks" CTA → Clinic Commander page → Demo benchmarking dashboard → Pricing (emphasize insurance savings) → Free trial → Onboarding: Upload first protocol

---

## 📋 PRODDY DELIVERABLES

Using the seed notes above + research in `/public/admin_uploads/tc_notes/`, PRODDY must:

1. **Validate or challenge the dual-segment hypothesis**
   - Is the grey market/clinic split the right segmentation?
   - Are there other segments worth targeting?
   - What does the research actually say about ICP?

2. **Refine the messaging framework**
   - Validate fear-based messaging against research
   - Refine value props for each segment
   - Recommend final tagline(s)

3. **Prioritize the feature-to-market fit**
   - Which existing features map to which segment's pain?
   - What's missing for each segment?
   - What should be built first for GTM?

4. **Website structure recommendation**
   - Validate or revise the proposed URL structure
   - Identify which pages are MVP vs future

5. **Pricing strategy alignment**
   - Does the Data Bounty model make sense?
   - What price points work for each segment?

---

## 📋 ANALYST DELIVERABLES

1. **Segment sizing estimate**
   - How large is each market (grey market vs licensed clinics)?
   - What's the TAM/SAM/SOM for each?

2. **Conversion funnel analysis**
   - Validate the proposed funnels
   - Identify likely drop-off points
   - Recommend metrics to track for each segment

3. **Data Bounty economics**
   - Model the 75% discount offer
   - What % of users need to contribute data for this to be viable?
   - What's the LTV impact?

4. **KPI framework**
   - Define success metrics for each segment
   - Activation, engagement, retention targets
   - Leading indicators of segment fit

---

## ✅ ACCEPTANCE CRITERIA

- [ ] Dual-segment hypothesis validated or revised with evidence
- [ ] Refined messaging framework for both segments
- [ ] Final tagline recommendation with rationale
- [ ] Prioritized feature-to-market fit matrix
- [ ] Website structure recommendation (MVP vs future)
- [ ] Conversion funnel with KPIs for each segment
- [ ] Data Bounty model validated with economics
- [ ] Prioritized list of follow-on work orders to create

---

## 🔄 WORKFLOW

1. **PRODDY** completes strategic analysis (append to this ticket)
2. **ANALYST** completes data/metrics analysis (append to this ticket)
3. **LEAD** reviews combined output and creates follow-on work orders
4. **USER** reviews and approves strategy
5. **DESIGNER + MARKETER** execute on approved strategy

---

## 🚦 STATUS

**01_TRIAGE** — Awaiting PRODDY + ANALYST analysis

**Priority:** P1 — This strategy shapes all future marketing and product decisions.
