# PPN Practitioner Network — Full Scope Overview
## What It Is, What It Isn't, How It Runs Itself
*February 23, 2026 | For Trevor Calton and Core Team*

---

## THE GOVERNING PRINCIPLE

The most valuable practitioner network feature is also the simplest to build.
The most expensive and labor-intensive features are the ones that feel exciting
in theory but require ongoing human management to function.

This document designs the network from the opposite direction: start with
what can run itself automatically, deliver real value, and require zero
ongoing staff time. Add complexity only when the simpler version has proven
its worth.

---

## WHAT THE NETWORK IS

**ppnportal.com is a structured, opt-in practitioner directory
and consultation-routing platform.**

It answers one question for any practitioner who encounters it:

> *"Who else in this field has dealt with what I'm dealing with right now —
> and how do I reach them?"*

That's it. Everything the network does flows from that single use case.

---

## WHAT IT DOES — LAYER BY LAYER

### Layer 1: The Opt-In Directory (MVP — Build This First)

Every feature in the network starts here. It is a public profile page
that practitioners create voluntarily.

**What a practitioner's profile contains:**

| Field | Input Method | Moderation Required? |
|---|---|---|
| Full name | Free text | ✅ Yes (once, at signup) |
| License type | Dropdown (MD, DO, NP, LMFT, LCSW, Facilitator, etc.) | None |
| License number | Text field (optional, for verification) | None (automated lookup) |
| State(s) of practice | Multi-select dropdown | None |
| Modalities | Multi-select from controlled list | None |
| Populations served | Multi-select from controlled list | None |
| Experience with specific substances | Multi-select from ref_ table vocabulary | None |
| Experience with specific contraindications | Multi-select from ref_ table vocabulary | None |
| Years of experience | Dropdown range (0–2, 3–7, 8–15, 15+) | None |
| Languages | Multi-select | None |
| Contact preference | Radio button (contact form only / email visible / no contact) | None |
| Short bio | Text area (300 chars max) | ✅ Yes (once, at signup) |

**Everything except name and bio is a dropdown or multi-select.**
That means after the initial profile review at signup (which takes 2 minutes
per profile), **no ongoing moderation is needed.**

**What it does NOT contain:**
- Patient names, session details, or any clinical records
- Pricing or booking functionality (this is not a marketplace yet)
- Certification claims that aren't verifiable
- Any information pulled automatically from ppnportal.net

---

### Layer 2: The Contextual Intelligence Link (MVP — Builds on Layer 1)

This is the feature that connects the clinical tool to the network.
When a safety warning fires in ppnportal.net, a card appears:

> *"4 practitioners in the PPN network have documented experience
> with this contraindication. [View profiles →]"*

The link opens ppnportal.com pre-filtered to show practitioners who
have selected that contraindication from the controlled vocabulary list.

**What this requires technically:**
- A nightly batch job on ppnportal.net that counts practitioners opt-in
  by contraindication tag (integer counts only, no names, no IDs)
- A public read-only API endpoint on ppnportal.net that returns those counts
- URL parameter filtering on ppnportal.com (standard feature in any directory)

**Ongoing maintenance required:** None. The batch job runs automatically.
The API is read-only. The filtering is built into the directory search.

---

### Layer 3: Credential Verification (Automated)

For practitioners who choose to list a license number, the system
can automatically verify it against public databases:

- **NPI (National Provider Identifier):** Free CMS NPI Registry API.
  Any MD, DO, NP, PA, or licensed therapist with an NPI can be verified
  in seconds. This is a public database.
- **State license lookup:** Many states publish online license verification.
  Can be linked (not automated, but the practitioner can self-verify
  by linking to their state board page).

**What verification unlocks:**
- A "Verified" badge on the profile
- Higher placement in search results
- Eligibility for supervision circle facilitation (Layer 4)

**What verification does NOT do:**
- It does not constitute an endorsement of the practitioner's clinical skills
- It does not verify that the practitioner's activities in their jurisdiction
  are legal (PPN Portal takes no position on legality)

**Ongoing maintenance required:** None. The NPI API call is automated
at profile submission. Badges update automatically if a license check fails.

---

### Layer 4: Supervision Circles (Q2 2026 — Build After Layer 1 is Proven)

Small, curated cohorts of 4–8 practitioners for ongoing peer support.

**The simple version (what we build):**
- A practitioner opts in to "supervision circle matching"
- They fill in a matching form (modality, experience level, case complexity
  focus, timezone, preferred meeting cadence) — all dropdowns
- An algorithm groups them into circles of 4–8 based on compatibility scores
- They receive an email with their circle members' names and profiles
- They schedule themselves using Calendly (or equivalent) — PPN Portal
  does not host or manage any meetings
- PPN Portal's role ends at the introduction email

**What PPN Portal never does:**
- Host video calls
- Record or store anything said in a circle
- Moderate circle discussions
- Manage schedules or send reminders beyond the initial introduction

**Revenue model:** PPN Portal charges a small matching fee ($X/year) for
access to the supervision circle program. If a circle facilitator charges
their circle members, that transaction happens completely outside of
PPN Portal — we do not collect or process those payments in Phase 1.
(A 20% transaction fee model can be added in Phase 2 if demand warrants it.)

**Ongoing maintenance required:**
- Monthly: Run the matching algorithm on new opt-ins (this can be automated
  or done manually in 30 minutes on a set date each month)
- Quarterly: Email existing circles asking if they want to continue or
  be rematched. One template email, automated send.
- As needed: Handle requests from practitioners who want to leave a circle
  (automated "leave circle" button in their profile)

---

### Layer 5: Case Consultation Requests (Q3 2026 — Only If Needed)

This is the real-time "I need help right now" feature Jason identified.
It is the most complex to build and moderate correctly, so we deliberately
delay it until Layers 1–3 are functioning.

**The simple version:**
- Practitioner submits an anonymized case summary (structured form — no
  free text except one 200-character "situation description" field)
- System automatically routes the request to practitioners whose profiles
  match the relevant modality, substance, and contraindication tags
- Matched practitioners receive an email: "A colleague is seeking peer
  consultation on [category]. [Click to respond or pass]"
- If they respond, the requesting practitioner receives their profile
  and can choose to initiate contact via the standard contact form

**Self-moderation mechanism:**
- The 200-character limit prevents detailed patient descriptions
- Structured form fields mean there's no room for identifying information
- The system's category tags determine who gets notified — not a broadcast
- Practitioners who repeatedly receive low ratings from consultation partners
  are automatically deprioritized in the routing queue (flagged for review)

**Ongoing maintenance required:**
- Automated routing (no human needed to match requests)
- Flagged accounts reviewed weekly (likely fewer than 1 per week at launch)
- Template email responses for edge cases (one-time setup)

---

## WHAT THE NETWORK DOES NOT DO

This list is as important as what it does:

❌ **Does not host video calls or meetings.** Circles use Calendly + Zoom/Meet,
which the practitioners manage themselves.

❌ **Does not moderate ongoing conversations.** There are no chat rooms, forums,
or message threads. Communication happens via structured forms and email.

❌ **Does not store clinical case details.** Case consultation requests use
structured tags, not narrative. The 200-char limit is enforced.

❌ **Does not verify clinical skills or certifications.** It verifies license
numbers exist. It does not evaluate clinical competence.

❌ **Does not connect to ppnportal.net clinical records.** Practitioners
self-report their experience on ppnportal.com. No data is automatically
pulled from the clinical tool.

❌ **Does not handle payments for consultations.** That happens between
practitioners directly, outside PPN Portal.

❌ **Does not give medical advice and does not allow others to do so
on its platform.** The terms of service prohibit patient-identifiable
case discussions. The structured input model enforces this technically.

❌ **Does not build or manage a community.** There is no feed, no social
graph, no "following." This is a directory and a routing tool, not LinkedIn.

---

## THE SELF-MODERATION DESIGN

The network is self-moderating by design, not by policy. Here is how
each potential problem is handled without human intervention:

### Problem: Spam or fake profiles
**Solution:** Email verification at signup + NPI automated lookup.
Unverified profiles are hidden from search results until verified.
A fake profile can't get the "Verified" badge and won't appear
at the top of search results. Low incentive to create fake profiles.

### Problem: Practitioners giving medical advice in case consultations
**Solution:** Structured form with 200-char limit prevents narrative.
Disclaimer language is displayed at every touchpoint. Terms of service
violation = automated profile suspension (triggered by flagging system).

### Problem: Patient information disclosed in case consultation requests
**Solution:** The form explicitly says "Do not include any information
that could identify a patient." The 200-char limit makes it physically
difficult to include narrative detail. Reviewers who spot a potential
violation can flag it (one-click flag triggers automated temporary hide
pending review).

### Problem: Inactive profiles cluttering search results
**Solution:** Automated annual email: "Is your profile still active?
Click here to confirm." No response in 30 days = profile automatically
set to "inactive" and hidden from search results. Practitioner receives
one reminder before deactivation.

### Problem: A practitioner behaves badly in a supervision circle
**Solution:** Any circle member can submit a "circle issue" form.
Automated: the flagging member is immediately moved to a new circle queue.
The flagged practitioner is notified that they've been removed and can
appeal. No staff mediation required unless the appeal is submitted.

### Problem: A practitioner's license lapses or is revoked
**Solution:** The NPI verification runs on a quarterly automated check
for all Verified profiles. If a license status changes in the NPI database,
the Verified badge is automatically removed and the practitioner is notified.

---

## TECHNICAL REQUIREMENTS

### What Needs to Be Built (ppnportal.com)

**Complexity rating: Medium. Not a large application. A good developer
can build the MVP (Layers 1 + 2) in 3–4 weeks.**

| Component | Complexity | Notes |
|---|---|---|
| Practitioner profile creation/editing | Low | Standard form with Supabase backend |
| NPI API integration | Low | Free public CMS API, well-documented |
| Directory search with filters | Low | Standard search against indexed profile fields |
| URL parameter filtering (for contextual link) | Low | Standard query string handling |
| Contact form (brokered — no direct email) | Low | Form sends email to practitioner; no practitioner email exposed |
| "Verified" badge logic | Low | Boolean field, automated by NPI check |
| Profile activity confirmation (annual) | Low | Automated email via SendGrid/Postmark |
| ppnportal.net → ppnportal.com API endpoint (count only) | Low | Read-only endpoint, returns integers by tag |
| Supervision circle matching algorithm | Medium | Weighted scoring on 5–6 profile fields |
| Case consultation routing | Medium | Email routing based on profile tag matching |
| Reputation/flagging system | Medium | One-click flag, automated queue |

### What Does NOT Need to Be Built

- Real-time messaging (use email)
- Video conferencing (use Calendly + Zoom)
- Payment processing (practitioners handle directly)
- A community feed or social graph
- Content moderation tools (structured input eliminates the need)
- A mobile app (mobile-responsive web is sufficient)

### Infrastructure

- **Hosting:** Vercel (same as ppnportal.net — zero additional hosting cost)
- **Database:** Separate Supabase project (new project, $0 at launch scale)
- **Email:** SendGrid or Postmark ($20–50/month at launch volume)
- **NPI verification:** Free (CMS public API)
- **Authentication:** Supabase Auth (same provider, separate project)

**Estimated monthly infrastructure cost at launch: $50–100/month**

---

## ONGOING MAINTENANCE REQUIREMENTS

This is the section that matters most for deciding what to build.

### Zero-Maintenance (Fully Automated)
- NPI credential verification at signup
- Quarterly NPI re-check on active Verified profiles
- Profile deactivation for non-responsive practitioners (annual check)
- Contextual link count updates (nightly batch job)
- Email notifications for new consultation requests
- Spam filtering (email provider handles this)

### Low-Maintenance (30 Minutes Per Week)
- Review flagged profiles and consultation requests (expect 0–3 per week at launch)
- Approve new profiles that failed automated verification (i.e., practitioners
  without an NPI who are legitimate: ceremonial facilitators, international practitioners)
- Respond to appeal requests from suspended practitioners

### Monthly (2–3 Hours Total)
- Run supervision circle matching for new opt-ins (can be automated eventually;
  manual is fine at low volume)
- Review any edge-case flags from the past month
- Export basic metrics: new signups, active profiles, consultation requests sent

### Never (By Design)
- Moderating conversations (there are none)
- Managing video calls or meetings (practitioners do this themselves)
- Curating content (there is no feed)
- Handling payment disputes (payments don't run through PPN Portal)

---

## WHAT THIS COSTS TO BUILD

### MVP (Layers 1 + 2) — Directory + Contextual Link
- **Development time:** 3–4 weeks (1 developer)
- **Design time:** 1 week (profile page, search page, contextual card)
- **Infrastructure cost:** $0 additional (Vercel free tier, Supabase free tier)
- **Ongoing cost:** $50–100/month (email service)
- **Staff time to maintain:** ~1 hour/week

### Full Feature Set (Layers 1–4) — Directory + Circles + Consultation
- **Development time:** 8–10 weeks additional (after MVP)
- **Design time:** 2–3 weeks
- **Infrastructure cost:** $100–200/month (email volume increases)
- **Ongoing cost:** Scales with usage
- **Staff time to maintain:** ~3 hours/week

### The Honest Assessment

**The MVP is worth building now.** It's small, fast, useful, and directly
supports the Dr. Allen demo and the Contextual Intelligence Link (WO-343).

**The supervision circles are worth building in Q2**, but only after
enough practitioners have joined the directory to make matches possible.
A matching algorithm with no practitioners to match is a feature no one can use.

**Case consultation (Layer 5) should be validated by demand** before building.
If practitioners in Layers 1–3 start asking for it — meaning the directory
alone isn't solving the "I need help right now" problem — then build it.
Don't pre-build for a demand that hasn't shown up yet.

---

## THE LAUNCH SEQUENCE (SIMPLIFIED)

```
Week 1–4:    Build directory + opt-in profile (Layer 1)
             Wire contextual link from ppnportal.net (Layer 2)
             Launch: Invite existing network contacts to create profiles
             Goal: 20–30 profiles at launch

Month 2–3:  Promote directory via blog, LinkedIn, conference QR codes
             Goal: 100+ profiles
             Validate: Are practitioners actually using the contextual link?

Month 4–6:  Launch supervision circle matching (Layer 4)
             Goal: First 5–10 circles formed
             Validate: Are facilitated circles meeting regularly?

Month 6+:   Evaluate Layer 5 (case consultation) based on demand signals
             Goal: Data-driven decision, not assumption
```

---

## SUMMARY TABLE

| Feature | Build When | Maintenance Level | Self-Moderating? |
|---|---|---|---|
| Opt-in directory | Now (MVP) | Minimal | ✅ Yes |
| NPI verification | Now (MVP) | Automated | ✅ Yes |
| Contextual link from ppnportal.net | Now (WO-343) | Automated | ✅ Yes |
| Profile deactivation (annual) | Now (MVP) | Automated | ✅ Yes |
| Contact form (brokered) | Now (MVP) | None | ✅ Yes |
| Supervision circle matching | Q2 2026 | 2 hrs/month | ✅ Mostly |
| Case consultation routing | Q3 2026 (if demand) | 1 hr/week | ✅ Mostly |
| Video calls / live chat | Never (outsource) | N/A | N/A |
| Payment processing | Out of scope (Phase 1) | N/A | N/A |

---

*Prepared by PRODDY — PPN Portal Strategy Team*
*February 23, 2026*

==== PRODDY ====
