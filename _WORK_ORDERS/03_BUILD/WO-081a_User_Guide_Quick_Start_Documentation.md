---
id: WO-081
title: "User Guide & Quick Start Documentation"
status: 03_BUILD
owner: MARKETER
failure_count: 0
created: 2026-02-17T15:53:56-08:00
routed: 2026-02-17T23:10:06-08:00
priority: medium
tags: [documentation, user-experience, help-center, multi-agent]
---

# WO-081: User Guide & Quick Start Documentation

## USER REQUEST (VERBATIM)
"Please assign PRODDY the task of beginning to build a comprehensive user guide and quick start guide for users. We will be ultimately creating a help page with screenshots and infographics, so this will be a team effort. It will go to designer and analyst and marketer eventually."

---

## SCOPE DEFINITION

### Primary Objective
Create comprehensive user documentation consisting of:
1. **User Guide** - Complete reference documentation covering all features and workflows
2. **Quick Start Guide** - Streamlined onboarding documentation for new users

### End Goal
Build a Help Page with:
- Screenshots and visual aids
- Infographics for complex workflows
- Professional copywriting and messaging
- Analytics tracking for documentation effectiveness

### Multi-Agent Workflow
This is a **team effort** that will progress through multiple agents:
1. **PRODDY** (Initial) - Content strategy, information architecture, documentation outline
2. **DESIGNER** - Visual design, screenshots, infographics, layout specifications
3. **ANALYST** - Metrics definition, user behavior tracking, documentation effectiveness KPIs
4. **MARKETER** - Copywriting, messaging, SEO optimization, conversion optimization
5. **BUILDER** - Implementation of Help Page component and integration

---

## REQUIREMENTS

### User Guide Requirements
- Cover all major features of the PPN Research Portal
- Include Arc of Care workflow documentation
- Document all form components and data entry processes
- Explain dashboard and analytics features
- Cover safety features (contraindication checking, risk indicators)
- Include troubleshooting section
- Provide glossary of terms

### Quick Start Guide Requirements
- 5-10 minute time-to-value for new users
- Step-by-step first session walkthrough
- Essential features only
- Visual-first approach
- Clear success criteria for each step

### Help Page Requirements
- Searchable documentation
- Categorized content sections
- Visual hierarchy with screenshots
- Responsive design
- Accessible (WCAG 2.1 AA minimum)
- No color-only meaning (per user accessibility requirements)
- Minimum 12px font size throughout

---

## SUCCESS CRITERIA

### PRODDY Deliverables (Phase 1)
- [ ] Information architecture for Help Center
- [ ] Complete content outline for User Guide
- [ ] Complete content outline for Quick Start Guide
- [ ] Screenshot requirements list
- [ ] Infographic requirements list
- [ ] Content prioritization and phasing strategy

### Final Deliverables (All Agents)
- [ ] Fully written User Guide content
- [ ] Fully written Quick Start Guide content
- [ ] Professional screenshots with annotations
- [ ] Infographics for complex workflows
- [ ] Implemented Help Page component
- [ ] Analytics tracking in place
- [ ] SEO-optimized content

---

## CONTEXT & CONSTRAINTS

### Target Audience
- Psychedelic therapy practitioners
- Clinical researchers
- Grey market practitioners (privacy-conscious)
- Varying technical skill levels

### Key Application Features to Document
- Arc of Care (5 phases: Screening, Preparation, Dosing, Integration, Follow-up)
- 20+ modular form components
- Session vitals tracking
- Safety workflows (contraindication checking)
- Risk indicators and benchmarking
- Dashboard and analytics
- Data export functionality
- Guided tours and progressive disclosure

### Accessibility Requirements
- User has color vision deficiency
- No color-only status indicators
- Minimum 12px fonts
- High contrast ratios
- Text labels for all status states

---

## NOTES
- This ticket will spawn multiple sub-tickets as it progresses through the pipeline
- PRODDY should focus on strategy and content architecture first
- Visual assets (screenshots, infographics) will be created by DESIGNER after content is defined
- MARKETER will refine messaging and optimize for conversion
- ANALYST will define success metrics and tracking requirements

---

## LEAD ARCHITECTURE

**Routed:** 2026-02-17T23:10:06-08:00  
**Owner:** PRODDY  
**Status:** 01_TRIAGE

### Technical Strategy
This is a **multi-phase documentation project**. PRODDY owns Phase 1 (content strategy and information architecture only). Do not write final copy yet — define structure first so downstream agents (DESIGNER, MARKETER, ANALYST, BUILDER) can work in parallel on their respective domains.

### PRODDY Constraints
- Coordinate with WO-082 (Data Viz Audit) — the audit findings should inform which features need the most documentation attention
- Coordinate with WO-083/WO-084 — Enhanced Privacy Tour and Crisis/Cockpit help content must be accounted for in the Help Center IA
- Coordinate with WO-085 — the guided tour system will be a key component of the Quick Start Guide
- Deliver: Information architecture, content outline, screenshot requirements list, and phasing strategy
- Do NOT write full prose — outlines and structure only at this stage

### Handoff After PRODDY
PRODDY → update `owner: LEAD` and leave `status: 01_TRIAGE` for re-routing to DESIGNER, MARKETER, ANALYST in parallel sub-tickets.

---

## 📣 PRODDY PHASE 1 DELIVERABLE — COMPLETE (2026-02-17T23:15 PST)

### INFORMATION ARCHITECTURE: Help Center

```
Help Center
├── 🚀 Quick Start (5-min onboarding)
│   ├── What is PPN Research Portal?
│   ├── Your First Session (step-by-step)
│   └── Key Concepts Glossary
│
├── 🛡️ Phantom Shield (Grey Market Features)
│   ├── Potency Normalizer — How to use
│   ├── Crisis Logger — Documenting adverse events
│   ├── Cockpit Mode — Session monitoring
│   └── Zero-Knowledge Privacy — How your data is protected
│
├── 📋 Arc of Care (5-Phase Workflow)
│   ├── Phase 1: Baseline Screening
│   ├── Phase 2: Preparation
│   ├── Phase 3: Dosing Session
│   ├── Phase 4: Integration
│   └── Phase 5: Follow-Up
│
├── �� Dashboard & Analytics
│   ├── Reading Your Dashboard
│   ├── Session Vitals Charts
│   ├── Benchmarking — What the numbers mean
│   └── Exporting Data
│
├── 🔒 Safety Features
│   ├── Contraindication Checker
│   ├── Risk Indicators
│   └── Emergency Protocols
│
├── ⚙️ Settings & Account
│   ├── Profile Setup
│   ├── Privacy Settings
│   └── Data Contribution (Data Bounty)
│
└── 🆘 Troubleshooting
    ├── Common Issues
    ├── Data Not Saving
    └── Contact Support
```

### CONTENT OUTLINE: Quick Start Guide (5-10 min)

**Step 1: Create Your Profile** (1 min)
- Set your practitioner type (licensed clinic vs. independent)
- Choose your privacy level (Standard vs. Zero-Knowledge)

**Step 2: Log Your First Session** (3 min)
- Select substance + protocol
- Run through the Arc of Care checklist
- Log session vitals

**Step 3: Review Your Dashboard** (1 min)
- See your first data point
- Understand the benchmarking baseline

**Step 4: Enable Your Shield** (1 min)
- Turn on Crisis Logger
- Set up Cockpit Mode defaults

### SCREENSHOT REQUIREMENTS LIST

| # | Screen | Priority | Notes |
|---|--------|----------|-------|
| 1 | Dashboard overview | P0 | Show populated state, not empty |
| 2 | Arc of Care wizard — Phase 1 | P0 | Show form in progress |
| 3 | Session Vitals chart | P0 | Show with sample data |
| 4 | Crisis Logger — active state | P1 | Show during a session |
| 5 | Cockpit Mode UI | P1 | Show full cockpit layout |
| 6 | Potency Normalizer | P1 | Show calculation result |
| 7 | Benchmarking panel | P1 | Show comparison view |
| 8 | Privacy settings | P2 | Show Zero-Knowledge toggle |
| 9 | Data export modal | P2 | Show export options |
| 10 | Mobile responsive view | P2 | Show on phone screen |

### INFOGRAPHIC REQUIREMENTS LIST

| # | Topic | Type | Priority |
|---|-------|------|----------|
| 1 | Arc of Care 5-Phase Flow | Horizontal timeline | P0 |
| 2 | Zero-Knowledge Architecture | "What we see vs. what you see" diagram | P0 |
| 3 | Phantom Shield Feature Map | Icon grid with descriptions | P1 |
| 4 | Data Bounty Explainer | "Contribute → Save 75%" flow | P1 |
| 5 | Benchmarking Explained | "Your data vs. 1,000+ practitioners" | P2 |

### PHASING STRATEGY

- **Phase 1 (PRODDY → DESIGNER):** Screenshots + infographic specs (this document)
- **Phase 2 (DESIGNER):** Visual design of Help Center layout + create screenshots + infographics
- **Phase 3 (MARKETER):** Write final prose for all sections, SEO optimization
- **Phase 4 (ANALYST):** Add search analytics, documentation effectiveness tracking
- **Phase 5 (BUILDER):** Implement Help Page component with search + navigation

### HANDOFF NOTES FOR LEAD

Coordinate with:
- **WO-083/WO-084** (Privacy Tour + Crisis/Cockpit Help) — those features need dedicated help sections
- **WO-085** (Guided Tour) — Quick Start Guide should mirror the in-app guided tour flow

**Next owner:** LEAD → spawn parallel sub-tickets for DESIGNER (screenshots/infographics) and MARKETER (copywriting)
