# PPN PORTAL — DENVER DEMO SCRIPT
## PsyCon 2026 · 5-Minute Clinical Flow · April 9, 2026

> **FORMAT:** Print single-sided. Large enough to read at a glance. Keep on the table, not in hand.
> **SETUP:** iPad/laptop open to `ppnportal.net` logged in as the DEMO account (DEMO-2026-001 pre-loaded).

---

## THE 60-SECOND BOOTH TRIAGE (Run Before Every Demo)

Ask these in order. Stop when you know who you're talking to.

**Q1 — Status Check**
*"Are you currently operating a licensed clinic or still in planning?"*
- Planning/Student → *"Great. We're built for established programs. Scan this QR to get our architecture specs when you launch."* *(Hand card, pivot.)*
- Operating → continue

**Q2 — Scale Check**
*"How many practitioners or treatment rooms are you running?"*
- Solo / 1 room → *"Perfect — we have a Data Guild program for solo practitioners. What's your email?"* *(Capture, trigger Email 1, move on.)*
- 3+ providers / multi-site → **VIP. Slow down. Full demo.**

**Q3 — Pain Agitator** *(for VIPs only)*
*"With a team that size — how are you handling the HIPAA liability of storing Schedule I protocols next to patient names in your EHR?"*
- Watch them react. Then: *"That's exactly why Dr. Allen and I built this."*

---

## THE 5-MINUTE DEMO ARC

### MINUTE 1 — The Problem (Don't touch the laptop yet)

> *"Most EHRs were built for a different era. The second a traditional system stores a patient's name next to a psilocybin or ketamine protocol, your institution assumes significant legal and financial exposure — $10.8 million average breach cost, unlimited subpoena liability. We eliminate that exposure at the architecture level."*

> *"PPN Portal uses a Phantom Shield — cryptographic synthetic Subject IDs. No patient names, no DOBs, no addresses ever enter the system. Your HIPAA breach liability drops to zero. Not as a policy. As a mathematical fact."*

---

### MINUTE 2 — The Pre-Session (Open the platform now)

Navigate to: **Phase 1 → Safety Screen**

> *"Before every session, practitioners run a 60-second interaction check. Select the substance and the patient's medication list."*

Demonstrate an SSRI contraindication flagging.

> *"Every check is cryptographically logged — timestamped, immutable, audit-defensible. If a state board ever asks what your standard of care looked like on a specific date, you can export this ledger in one click."*

---

### MINUTE 3 — The Session (Stay in platform)

Navigate to: **Phase 2 → Session Timeline**

> *"During the session, vitals and dose events stream into a live timeline. The facilitator logs in real time — heart rate, blood pressure, any observable changes. The record is append-only. Nothing can be edited or deleted."*

Point to the timeline events.

> *"This isn't just documentation — it's your liability shield. Every event has a hash. The moment it's written, it's permanent."*

---

### MINUTE 4 — The Network *(practitioner pivot OR researcher pivot)*

**PRACTITIONER PIVOT** — Navigate to: **Dashboard → Clinic Performance Radar**

> *"After 30 sessions, the platform starts benchmarking your outcomes against the anonymized network. Efficacy, safety, retention, compliance — plotted against what everyone else is seeing. You can't get this from any EHR because no other platform can legally share cross-site data. We can, because there's no PHI to protect."*

**RESEARCHER PIVOT** — Navigate to: **Session Export Center**

> *"Every data point maps to controlled vocabularies — RxNorm for substances, MedDRA for adverse events, LOINC for psychometrics. When you're ready to publish or submit to an IRB, you export a research-ready CSV. No data wrangling. No preprocessing. It's just ready."*

---

### MINUTE 5 — The Close (Close the laptop)

> *"We're taking on a very limited number of Founding Partners this spring. For a single founding fee, you get a dedicated clinic instance, white-glove 30-day onboarding — we train your staff, guarantee zero session downtime — network benchmarking access, and a permanent renewal rate lock.*

> *Most importantly, you are done worrying about what happens if your documentation system gets subpoenaed. Because there's nothing to subpoena.*

> *What's the best email to send the Founding Partner packet to right now?"*

Open admin app. Type their email. Trigger Email 1.

---

## QUICK REFERENCE

| Situation | Response |
|---|---|
| "Is this HIPAA compliant?" | *"We don't store PHI, so the statute doesn't apply. Our architecture is under formal counsel review — happy to share the technical memo under NDA."* |
| "What does it cost?" | *"The founding partner rate is structured as a one-time fee — I'll include that in the packet I send right now."* *(Don't say $3,000 on the floor.)* |
| "We already use Osmind / Jane / Epic" | *"Those are great EHRs for scheduling and billing. We don't replace them — we layer on top as your outcomes and safety intelligence layer. And unlike them, we can legally benchmark across sites."* |
| "We're not sure yet" | *"Totally fair. Let me send you the technical spec and our zero-PHI architecture breakdown. What's your email?"* |
| WiFi fails | Platform runs offline via `npm run dev` on the laptop. Switch immediately, no explanation needed. |

---

## PRE-DEMO CHECKLIST (Run Morning of April 9)

- [ ] Demo account loaded: DEMO-2026-001, psilocybin protocol, PHQ-9 baseline 18
- [ ] NetworkIntelligenceCard showing non-zero count
- [ ] Offline `npm run dev` confirmed working (no internet dependency)
- [ ] Login credentials accessible without internet (saved in 1Password or similar)
- [ ] Email 1 tested: type an email in admin app, confirm Resend delivers within 60 seconds
- [ ] QR codes on leave-behind tested on iPhone Safari
- [ ] 25 printed leave-behinds in bag
- [ ] Demo script printed at 14pt minimum type, single page

---

*WO-643 · PRODDY · 2026-03-22 · For PsyCon Denver, April 9, 2026*
