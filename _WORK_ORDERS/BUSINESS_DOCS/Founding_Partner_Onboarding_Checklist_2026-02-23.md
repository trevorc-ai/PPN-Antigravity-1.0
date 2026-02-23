---
id: WO-407
title: "Post-Signing Onboarding Checklist — Founding Clinical Partner"
status: 01_TRIAGE
owner: PRODDY
created: 2026-02-23
created_by: PRODDY
failure_count: 0
priority: P1
tags: [onboarding, partner, singularism, founding-partner, post-signing]
applies_to: "All Founding Clinical Partner accounts — first use case: Singularism"
---

# WO-407: Founding Clinical Partner — Post-Signing Onboarding Checklist

## PURPOSE

This checklist governs everything that happens from the moment a Design Partner agreement is signed through the end of their first 30 days on the platform. It is designed to be repeatable for all three founding partner slots.

The goal of the first 30 days is not feature adoption. It is **relationship confidence** — making the partner feel that they made the right decision and that the team they chose is exceptional.

---

## PHASE 1: WEEK 1 — SIGNED AND WIRED (Days 0–5)

### Day 0 — Agreement Signed
- [ ] Countersigned agreement returned to partner via email
- [ ] Wire transfer details sent (if not already provided)
- [ ] Internal Slack/notification: "Singularism signed — onboarding begins"
- [ ] Organization created in PPN Portal admin panel
  - Org name: `Singularism`
  - Org type: `Founding Clinical Partner`
  - Tier: `Research Partner (Founding)`
- [ ] Admin user account created for primary contact (Bridger or designated admin)
- [ ] Welcome email sent within 2 hours of wire confirmation (template below)

### Day 1–2 — Credentials + Async Walkthrough
- [ ] Login credentials delivered via secure channel (not plain email — use a password manager share link or similar)
- [ ] Loom walkthrough video recorded and sent: 10–12 minutes, covers:
  - [ ] Logging in for the first time
  - [ ] Creating a new patient (showing Subject ID generation)
  - [ ] Opening an Informed Consent form
  - [ ] Navigating Phase 1 → Phase 2 → Phase 3
  - [ ] Where to reach us if something breaks
- [ ] "What We Collect" schema document sent (PDF) — once WO-406 is complete

### Day 3–5 — Kickoff Call Scheduled
- [ ] 60-minute kickoff call booked (video, camera on both sides)
- [ ] Pre-call prep doc sent to partner (3 questions to think about):
  1. "What's your current process for documenting participant sessions?"
  2. "What's the first patient record you'd want to create — real or test?"
  3. "Is there anything you saw in the demo that you want to understand better before we start?"

---

## PHASE 2: KICKOFF CALL (Day 5–10, 60 min)

### Call Agenda

| Time | Topic |
|---|---|
| 0–10 min | Relationship check-in — how are they feeling about it? Any questions from the week? |
| 10–25 min | Live platform walkthrough — their account, their org, their first look |
| 25–40 min | Their current workflow — how are they documenting sessions TODAY? Paper? Google Docs? Nothing? |
| 40–50 min | Identify first 2–3 active participants to onboard (test or real) |
| 50–60 min | Set 30-day goal: "By the end of Month 1, what would make this feel like a success?" |

### Capture During Call (BUILDER/PRODDY to document)
- [ ] Current documentation method (paper / digital / nothing structured)
- [ ] Number of active participants they're seeing monthly
- [ ] Their biggest friction point in the current process
- [ ] Any features they expected to see that weren't there
- [ ] Their 30-day success definition (write it down verbatim)

### After Call — Same Day
- [ ] Send follow-up email summarizing what was discussed and the 30-day goal
- [ ] Create internal JIRA/work order for any feature gaps surfaced
- [ ] Schedule Month 1 check-in (30 min, at the 4-week mark)

---

## PHASE 3: ACTIVE USE (Days 10–90)

### Weekly Async Pulse (We Send — Every Monday)
Two questions max. Keep it under 60 seconds to answer. Rotate through:

Month 1 questions:
- "Did you log any sessions this week? If yes, anything confusing?"
- "Is there anything you tried to do that you couldn't figure out?"
- "On a scale of 1–5, how confident do you feel using the platform right now?"

Month 2 questions:
- "What's the one thing that would make the platform more useful for your practice?"
- "Have you shown it to anyone else on your team? What did they say?"

Month 3 questions:
- "Is the outcome data starting to feel meaningful to you?"
- "Is there a compliance or documentation situation where the platform helped you feel more protected?"

### Month 1 Structured Feedback Session (30–45 min)
**Focus:** Clinical workflow experience
- [ ] Walk through a real session they documented — what worked, what didn't
- [ ] Consent flow: does it feel natural? Anything missing?
- [ ] Phase 1 forms: are the fields relevant to what they actually track?
- [ ] Anything they wish they could show their participants?
- [ ] Document all gaps → create work orders

### Month 3 Structured Feedback Session (45 min)
**Focus:** Outcome data + strategic value
- [ ] Are they seeing PHQ-9 or outcome data accumulate?
- [ ] If not: what's blocking them from using those features?
- [ ] Benchmark intelligence: is the concept landing for them?
- [ ] "If someone asked you to describe PPN Portal in two sentences, what would you say?"
- [ ] Soft ask: would they be willing to record a short testimonial (60 seconds, informal)?

---

## PHASE 4: END OF TERM (Month 12)

### Transition Conversation (Month 11 — 30 min)
- [ ] Review the year: what changed in their practice?
- [ ] Pricing transition conversation: confirm Research Partner rate
- [ ] Case study conversation:
  - Would they be willing to be featured publicly?
  - What's the right framing given their legal situation?
  - Joint writing process — we draft, they approve
- [ ] Referral ask: "Who else in your network should we be talking to?"

### Formal Close
- [ ] Research Partner subscription activated (auto-renewal at locked rate)
- [ ] "Founding Clinical Partner" badge + approved language delivered for their use
- [ ] Internal: flag account as Reference Account — eligible for prospective partner calls

---

## WELCOME EMAIL TEMPLATE (Day 0 — After Wire Confirms)

---

Subject: Welcome to PPN Portal — You're in.

Hi [Bridger / first name],

The agreement is signed and the platform is ready. Welcome to the founding cohort.

Here's what happens next:

This week, you'll receive your login credentials and a short Loom video walking you through the platform at your own pace. We'll also schedule a 60-minute kickoff call — no agenda beyond making sure you're comfortable and showing us where you'd like to start.

We're genuinely glad you're first.

— [Jason / your name]

P.S. If anything looks wrong or confusing before the kickoff call, reach us directly at [email/phone]. No ticket required.

---

## INTERNAL HEALTH INDICATORS (Track Monthly)

| Metric | Target | Red Flag |
|---|---|---|
| Sessions logged per month | ≥ 2 by Month 2 | 0 after Month 1 = adoption risk |
| Kickoff call completed | Day 5–10 | Not scheduled by Day 7 = escalate |
| Async pulse response rate | ≥ 70% | < 50% = relationship at risk |
| Month 1 feedback call completed | Yes | Missed = reschedule within 5 days |
| NPS equivalent (1–5 scale) | ≥ 4 by Month 3 | < 3 = urgent conversation |

---

## ROUTING
PRODDY → LEAD (for timing alignment with WO-400, WO-402 completion) → 05_USER_REVIEW
