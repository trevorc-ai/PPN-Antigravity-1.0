# Phantom Shield
## The PPN Research Portal's Privacy-First Feature Suite for Independent Practitioners

**Prepared by:** PPN Research Portal  
**Version:** February 2026 | Partner Preview  
**Confidentiality:** For partner review only — not for public distribution

---

> **"The no-records strategy is actually a trap. The practitioner who can produce a secure, encrypted, timestamped record that documents their standard of care fundamentally shifts the legal narrative — from drug distribution to unlicensed medical practice. That is a massive, massive difference."**  
> — From PPN's practitioner research synthesis

---

## The Problem We're Solving

Independent practitioners, integration specialists, and entheogenic facilitators face a documentation dilemma:

- **Write nothing down** → look like a drug dealer in court. Maximum exposure.
- **Write everything down in a regular app** → create a plaintext evidence trail stored on servers you don't control.

Neither option is acceptable. **Phantom Shield is the third option.**

It gives independent practitioners the legal protection of documented standard-of-care practice — without ever storing a single piece of identifiable information.

---

## The Phantom Shield Feature Suite

---

### 🛡️ Zero-PHI Architecture
**What it is:** A foundational design principle, not just a policy — enforced at the database level.

The PPN portal **never collects, stores, or transmits:**
- Patient names
- Email addresses
- Phone numbers
- Dates of birth
- Medical record numbers
- Addresses or geographic identifiers more specific than state

**What it uses instead:**
- **Subject IDs** — hashed, anonymous identifiers you create. We never see who they map to.
- **Structured inputs only** — every clinical field uses dropdowns, coded scales, and pre-defined taxonomies. Zero free-text clinical narratives.
- **Year-only dates** — HIPAA Safe Harbor compliant. No month, no day.

**Why this matters for independent practitioners:**  
*"We cannot produce records we do not have."* If your data is ever subpoenaed, the system genuinely has no patient-identifiable information to hand over. This is structural protection, not a promise.

---

### 🔍 Blind Vetting Scanner
**What it is:** Screen potential clients for known bad actors — without ever sharing personal information.

**The problem it solves:** Independent practitioners currently rely on "whisper networks" — asking a friend if a new client is trustworthy. These networks are slow, unreliable, and biased toward whoever has social capital in the community.

**How it works:**
1. You receive a message from a new potential client
2. Enter their phone number into the Blind Vetting Scanner
3. The app instantly **hashes** the number using salted cryptography (the same technology used by Signal and cryptocurrency wallets)
4. The server checks the hash against a network database of reported bad actors — **it never sees the actual phone number**
5. If the hash matches a flagged bad actor, you see a warning: **HIGH RISK — Safety Incident Reported**

**The result:** Community immunity without shared personal information. The network polices itself. The DEA gets nothing even if they seize the database — only an unreadable string of characters.

---

### ⚗️ Potency Normalizer (Dosage Calculator)
**What it is:** A dynamic dose calculation tool that accounts for real-world batch variability.

**The problem it solves:** In a pharmacy, 10mg of a drug is always 10mg. In the independent practice world, "3 grams of mushrooms" is nearly meaningless. Batch potency varies by strain, growing conditions, and harvest timing. A "Penis Envy" batch can be 2–3x stronger than a standard Golden Teacher strain.

**This variance is the #1 cause of accidental high-dose events — which are the #1 cause of 911 calls — which are the #1 cause of practitioner arrests.**

**How it works:**
- Input: strain, batch data, harvest date (optional), intended dose
- Output: adjusted effective dose recommendation based on a growing database of batch reports
- "3 grams of Strain X = effectively 6 grams standard. Recommend reducing to 1.5g."

**In court:** You can show that you used a validated calculation tool to ensure a safe, evidence-based dosage — not guesswork. This proves standard of care.

---

### 🚨 Crisis Logger (Cockpit Mode)
**What it is:** A simplified, one-tap documentation interface designed for use during an active safety emergency.

**The problem it solves:** When a session goes sideways, practitioners experience the physiological stress response — cortisol spike, fine motor degradation, tunnel vision. No one can type a coherent clinical note while managing a client in acute psychological distress.

But if you don't document what you did during that 20 minutes, you are legally defenseless.

**How it works:**
- The Crisis Logger presents **large, high-contrast, single-tap action buttons** — designed for low-light, high-stress environments (like a cockpit in an emergency)
- Buttons include: *Vital Signs Normal / Verbal Support Provided / Offered Water / Rescue Medication Administered / Emergency Services Called*
- Each tap creates a **forensic timestamp** in the background: `10:02 PM — Distress noted / 10:05 PM — Verbal deescalation started / 10:21 PM — Patient calm and responsive`

**In court:** That timestamped log transforms a "what happened in that room?" into a documented, managed clinical event. It is the difference between *"I panicked"* and *"I followed a standard documented safety protocol."*

---

### 📚 Banking Your Hours (Legacy Transcript)
**What it is:** An anonymized career ledger that builds a verifiable professional record — without incriminating the practitioner.

**The problem it solves:** A skilled independent facilitator may have 10 years of experience and 500 sessions under their belt. When legalization comes — as it has in Oregon and Colorado — they're treated like a complete beginner. They have to take basic training courses alongside fresh graduates because they have no verifiable record.

**How it works:**
- Every session documented in PPN contributes to your anonymized career ledger
- The system records: `Practitioner_Hash_8849 has facilitated 500 sessions with 0 hospitalizations, 2 minor adverse events (documented and resolved)`
- When licensing becomes available: present your verified, cryptographically-confirmed transcript to the state board
- The board sees your record. They never see your name — until you choose to claim it.

**The long game:** Practitioners who document now are building a professional credential for the legal market of tomorrow. This is career insurance.

---

### 🤖 NeuralCopilot AI Assistant
**What it is:** A Google Gemini-powered clinical AI assistant integrated into the PPN portal.

**Capabilities:**
- Real-time substance interaction warnings during session documentation
- Safety flag detection as you're completing clinical forms
- Contextual clinical guidance based on the current protocol and session profile
- Terminal-style reasoning trace — shows you *why* it flagged something, not just *that* it flagged it

**Status:** Preview feature — available in the Hidden Components Showcase. Full integration planned for Phase 2.

---

### 🔒 Structured Safety Check (Ongoing Monitoring)
**What it is:** A structured safety monitoring form usable at any point in the arc of care — before, during, or after a session.

- Coded safety status indicators (no free-text)
- Risk indicator tracking
- Follow-up plan documentation
- Feeds directly into the Safety Risk Matrix on the dashboard

---

## Why Phantom Shield Works

| Feature | What It Protects Against | How |
|---------|--------------------------|-----|
| Zero-PHI Architecture | Subpoenas, data breaches, surveillance | Structural — no identifiable data to hand over |
| Blind Vetting Scanner | Bad actors, informants, dangerous clients | Cryptographic hashing — network warns without sharing PII |
| Potency Normalizer | Accidental overdose → 911 call → arrest | Evidence-based dose calculation + documented standard of care |
| Crisis Logger | "What did you do during those 20 minutes?" | Forensic timestamped log created under pressure |
| Zero Free-Text | Self-incriminating clinical narratives | Structured inputs only — nothing you'd regret saying in court |
| Banking Your Hours | Losing your experience when legalization comes | Anonymized, verified career ledger for future licensing |

---

## The Reframe

This is not about hiding. **It is about documentation discipline.**

The practitioners who will survive regulatory scrutiny — and thrive when legalization expands — are the ones building a verifiable record of professional standards right now. Phantom Shield makes that possible without creating a paper trail that can be weaponized against them.

**Audit defense, not evidence creation.**

---

## Access

Phantom Shield features are available across all PPN Research Portal tiers.

**To request partner access:**  
PPN Admin  
info@ppnportal.com  

**Live demo available at:**  
http://localhost:3000 *(beta)*  
*(Public URL provided upon partner agreement)*

---

*PPN Research Portal | Phantom Shield Feature Sheet | February 2026*  
*Confidential — For Partner Review Only*
