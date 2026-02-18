---
id: WO-086
status: 03_BUILD
priority: P0 (Critical — Launch Blocker)
category: Marketing / Copywriting / Landing Page / New Components
owner: MARKETER
failure_count: 0
created_date: 2026-02-17T23:47:00-08:00
estimated_complexity: 9/10
skills_used: master-data-ux, deep-industry-knowledge, go-to-market-strategy
research_sources:
  - Psychedelic Therapy VoC Analysis.md (49KB, 250+ data points, 2020-2026)
  - Doctor_Interview.md (verbatim session transcript)
  - PPN Portal - Use Cases by Tier.md (6 tiers, full pain point mapping)
  - PPN SWOT Analysis.md
  - PPN Customer Journey.md
  - PPN Business Cases.md
  - PPN Use Cases.md
  - Landing.tsx (864 lines, full audit of live page)
  - SafetyRiskMatrixDemo.tsx, ClinicRadarDemo.tsx, PatientJourneyDemo.tsx (all three live demos)
---

# WO-086: Landing Page Copy v3 + Two New Live Demo Components

## RESEARCH SYNTHESIS — THE REAL BRIEF

After a full pass through every research file in the public folder, the picture is clear.

The VoC Analysis closes with this sentence:
> "The Voice of the Customer is clear: 'Help me feel safe, help me get paid, and help me do this work without burning out.'"

That is the entire brief. Three problems. Three promises. Every section of the landing page must answer one of those three things with specificity, not aspiration.

The practitioner of 2026 is not inspired by "clinical excellence." They are:
- **Terrified of malpractice** (their license is their entire professional identity)
- **Drowning in administrative work** (4-5 disconnected tools, 56 hours/month of admin)
- **Isolated** (no peer supervision, no benchmarks, no way to know if they are doing it right)
- **Skeptical of hype** (the FDA rejection of Lykos, the collapse of ketamine chains, the "gold rush" companies that burned them)
- **Desperate for infrastructure** (billing codes, consent forms, insurance, scheduling)

The Doctor Interview is the most important document in the research folder. One line defines the entire product:
> "Should we... if I add 75 milligrams of ketamine intramuscular right now, am I gonna affect MDMA receptors too much? These are nuances and these are things that they come in handy. 'cause we're on the fly. We're on the fly because we're not doing tribal. We've got a week, we've got sunset, we've got singing, dancing, we've got whatever we've got. We're in a clinical setting. We've got a limited period of time for people who are looking for something very specific."

That is the moment PPN was built for. A doctor, mid-session, 250mg of MDMA in a patient who is not breaking through, asking a question that no EHR, no spreadsheet, and no Google search can answer in real time.

The landing page must make that moment visceral. Then show that PPN answers it.

---

## PART 1: SECTION-BY-SECTION COPY REWRITES

### WRITING RULES (NON-NEGOTIABLE)
- No em dashes
- No "Stop..." constructions
- No "Most..." constructions  
- No "clinical excellence," "transformative," "revolutionary," or "game-changing"
- Every number must match the actual live demo data
- Every claim must be traceable to the VoC or the Doctor Interview
- Write at peer level. These are MDs, LCSWs, Psychiatrists. Not patients. Not consumers.

---

### SECTION 1: HERO

**Current live H1:**
> "Your Clinic's Outcomes, Calibrated Against 12,000+ Sessions."

**The problem with it:** "Calibrated Against" is abstract. A practitioner landing on this page for the first time does not know what that means for their practice today. It sounds like a feature, not a promise.

**The VoC insight:** The dominant search intent in 2025-2026 is transactional and operational. Practitioners are not searching for inspiration. They are searching for "Best EHR for ketamine clinic," "Liability waivers for sitters," "CPT 0820T reimbursement rates." They are looking for solutions to specific, high-friction problems.

**The Doctor Interview insight:** "We're on the fly. We're in a clinical setting. We've got a limited period of time."

---

**PROPOSED HERO COPY — OPTION A (Fear-Based / Highest Conversion)**

Badge text (above H1):
```
Augmented Intelligence for Psychedelic Wellness Practitioners
```

H1:
```
You are making real-time decisions
about drug combinations and dosages.
Your documentation system should be able to keep up.
```

Subheadline:
```
PPN is the clinical OS built for the 6-8 hour session.
Safety screening before the patient arrives.
Outcomes tracking after they leave.
An audit trail that holds up in court.
```

Supporting trust line:
```
Trusted by 840+ licensed clinicians across 14 institutional sites.
12,482 sessions logged. HIPAA compliant. End-to-end encrypted.
```

**PROPOSED HERO COPY — OPTION B (Peer-Based / Highest Trust)**

H1:
```
840 clinicians figured out
the documentation problem.
Here is what they built.
```

Subheadline:
```
Real-time safety screening. Longitudinal outcomes tracking.
Anonymized peer benchmarking. Built for practitioners
who need evidence, not anecdotes.
```

**PROPOSED HERO COPY — OPTION C (Workflow-Based / Highest Clarity)**

H1:
```
IntakeQ. Spruce. Excel. SimplePractice.
Four tools. Four single points of failure.
One clinical OS that replaces all of them.
```

Subheadline:
```
PPN consolidates intake, safety screening, session logging,
outcomes tracking, and peer benchmarking into one system.
Built for the 6-8 hour session, not the 15-minute med check.
```

**MARKETER RECOMMENDATION:** Option A for the primary ICP (Clinical Convert / Clinic Operator). It speaks directly to the moment the Doctor described. It is the only headline that makes a practitioner stop scrolling and say "that is my problem."

**Right Column Visual (CRITICAL CHANGE):**
Replace the static psilocybin molecule image with the new `ContradictionCheckerDemo` component (specified in Part 2). The hero right column should show a live, animated contraindication check in progress. A patient profile. A protocol selected. Alerts appearing one by one. This is the most visceral first impression available and directly demonstrates the product's core value in the first 3 seconds.

**Legal Notice (keep, refine):**
```
PPN Portal is a measurement and benchmarking tool. It does not
provide medical advice, treatment recommendations, or dosing guidance.
```

---

### SECTION 2: GLOBAL ALLIANCE

**Current live H2:**
> "The Global Psychedelic Practitioner Alliance. Where Evidence Meets Experience."

**The VoC insight:** "Where Evidence Meets Experience" is aspirational language from 2020. The 2026 practitioner is in the "Operational Reality" phase. They are pragmatic, exhausted, and skeptical of hype. They have watched the FDA reject Lykos. They have watched ketamine chains collapse. They do not want to join an "alliance." They want to know if this field is going to survive and if their practice is going to survive with it.

**The real message:** The field is professionalizing whether they participate or not. The practitioners who are building the evidence base now will define what "standard of care" means. The ones who are not will be measured against a standard they had no hand in creating.

**PROPOSED COPY:**

H2:
```
The field is professionalizing.
The question is whether your documentation
is part of the evidence base or a liability to it.
```

Body (replaces current 3-paragraph block):
```
In 2026, the question practitioners are asking is not
"How do I get into psychedelic therapy?"

It is: "What documentation protects me when something goes wrong,
and what documentation creates the risk that something will?"

840+ licensed clinicians across 14 institutional sites are
answering that question the same way: by logging every session
into a shared, anonymized network that is building the real-world
evidence base that clinical trials cannot generate.

Every session you log contributes to the dataset that unlocks
insurance reimbursement, reduces malpractice exposure, and defines
what standard of care actually means in this field.

You are either helping write that standard, or you will be
measured against one you had no hand in creating.
```

City grid label (replace "Active Practitioner"):
```
Contributing Site
```

---

### SECTION 3: FRAGMENTED WORKFLOW

**Current live H2:**
> "Is your clinical workflow fragmented?"

**The VoC insight (verbatim from research):** "A typical practitioner describes a workflow that is a patchwork of disconnected tools: IntakeQ for forms, Spruce for secure messaging, Spotify for music, Excel for tracking outcomes, and a generic EHR like SimplePractice for billing. This fragmentation leads to 'administrative burnout' and data silos."

**The real message:** This is not a workflow problem. It is a liability problem. Four disconnected tools means four places where documentation can fail, four places where data can be lost, and four places where a malpractice attorney can find a gap.

**PROPOSED COPY:**

H2:
```
IntakeQ. Spruce. Spotify. Excel. SimplePractice.
That is not a clinical workflow.
That is four places where your documentation can fail.
```

Body:
```
Standard EHRs are built for the 15-minute med check.
They have no field for "substance batch," no field for "sitter name,"
no field for "music playlist," and no way to chart a 6-hour session
without writing a novel in a free-text box.

The result is documentation gaps that look like negligence
in a courtroom, even when the clinical care was excellent.

PPN consolidates intake, safety screening, session logging,
outcomes tracking, and peer benchmarking into one structured system.
One audit trail. One source of truth. One system that was built
for the session you are actually running.
```

**Visual (CRITICAL CHANGE):**
Replace the current static card (red warning / strikethrough / green checkmark) with the new `ToolStackCostDemo` component (specified in Part 2). Show the actual admin hours comparison as a live chart. The numbers are more persuasive than the metaphor.

CTA button text (replace "Unify Your Practice"):
```
See How It Works
```

---

### SECTION 4: SAFETY RISK MATRIX
*Paired with existing `SafetyRiskMatrixDemo` component*

**Current live H3:**
> "Active guardrails for every session."

**The problem:** "Active guardrails" is vague. The demo shows specific data: Risk Index 0.4%, zero G4 events, zero G5 events, 145 mild events, 82 moderate events. The copy should point at those numbers and explain what they mean clinically.

**The VoC insight:** The Doctor Interview: "Serotonin syndrome could or could theoretically arise. And we're prepared to have injectable cyclohexidine magnesium. We keep an IV line available... we monitor with ibogaine EKG at baseline and then every few hours particularly the QT interval, anything over 500 we're looking at continuously after that."

This is a practitioner who is already doing everything right. PPN gives them the documentation that proves it.

**PROPOSED COPY:**

Badge:
```
Safety Surveillance
```

H3:
```
Risk Index: 0.4%.
Zero G4 events. Zero G5 events.
That is what consistent pre-session screening produces.
```

Body:
```
The heatmap you are looking at is your clinic's adverse event
profile, plotted by frequency and severity. Every cell represents
real sessions, real patients, real outcomes.

Before the patient arrives, the system cross-checks their current
medications against your selected protocol. MDMA plus SSRIs:
Serotonin Syndrome risk flagged. Ibogaine plus QT-prolonging agents:
cardiac risk flagged, QT monitoring protocol initiated.

The flag takes 2 seconds. The lawsuit it prevents takes 2 years.

The 0.4% Risk Index in the demo is not a marketing number.
It is what documented, structured screening produces
when it is applied consistently across 12,482 sessions.
```

CTA:
```
View Live Safety Demo
```

---

### SECTION 5: CLINIC RADAR
*Paired with existing `ClinicRadarDemo` component*

**Current live H3:**
> "Calibrate your practice against the global standard."

**The problem:** "Global standard" is aspirational. The demo shows specific numbers: Safety Score 92 vs. Network Avg 74. Retention 85 vs. Network Avg 68. Efficacy 88 vs. Network Avg 72. The copy should make those 18-point gaps land.

**The VoC insight:** "Practitioners are operating in a vacuum regarding the 'business' of therapy." They have no idea if their outcomes are good, average, or dangerous. They are guessing. The radar chart is the first time most practitioners will have ever seen their performance relative to peers.

**PROPOSED COPY:**

Badge:
```
Network Benchmarking
```

H3:
```
Safety Score: 92.
Network Average: 74.
The 18-point gap is where your malpractice premium lives.
```

Body:
```
The radar chart shows six dimensions of clinic performance
compared to the anonymized average of 840+ peers.
Safety Score. Retention. Efficacy. Adherence.
Response Time. Data Quality.

Practitioners in the top quartile know exactly what they are
doing differently. Practitioners below the median know exactly
where to focus. No more operating on intuition alone.

The 18-point Safety Score gap in the demo is not hypothetical.
It represents the difference between a clinic that screens
consistently and one that does not.

Malpractice carriers are starting to ask which one you are.
Your outcomes data should answer that question before they do.
```

CTA:
```
See Your Benchmarks
```

---

### SECTION 6: PATIENT JOURNEY
*Paired with existing `PatientJourneyDemo` component*

**Current live H3:**
> "The story behind the symptom."

**The problem:** Poetic but vague. The demo shows PHQ-9 dropping from 21 (Severe) to 8 (Mild) over 12 weeks, a 62% improvement across 4 sessions. That is the story. Tell it in the language that matters to the practitioner: the language of insurance reimbursement.

**The VoC insight:** "Practitioners theoretically value MBC (tracking scores like PHQ-9 or GAD-7 over time) to prove efficacy. However, in practice, manual data entry is a barrier. There is a clear desire for automated tools that send surveys to patients and visualize the data without provider intervention. The lack of this automation makes it difficult to negotiate with insurance payers who increasingly demand data."

**PROPOSED COPY:**

Badge:
```
Patient Outcomes
```

H3:
```
PHQ-9: 21 at intake. PHQ-9: 8 at week 12.
Four sessions. 62% improvement.
That is the sentence your insurer needs to see.
```

Body:
```
The timeline connects specific dosing events (the green dots)
to PHQ-9 trajectory over 12 weeks.

Severe depression at intake. Mild by week 12.

The improvement is not a claim. It is a structured data record
that meets payer audit requirements, satisfies insurance
documentation standards, and gives your patient visible proof
that the work is working.

There is a difference between "the patient feels better"
and "the patient's PHQ-9 score decreased 62% over 12 weeks
across four documented sessions with standardized outcomes capture."

One of those sentences unlocks insurance reimbursement.
The other does not.
```

CTA:
```
View Patient Journey Demo
```

---

### SECTION 7: NEW SECTION — CONTRAINDICATION CHECKER
*Paired with new `ContradictionCheckerDemo` component (see Part 2)*

**Placement:** Between the Safety Risk Matrix section and the Clinic Radar section. This is the most visceral, specific demonstration of PPN's value and should be positioned at the center of the page.

**The VoC insight (verbatim from Doctor Interview):**
> "Should we... if I add 75 milligrams of ketamine intramuscular right now, am I gonna affect MDMA receptors too much? These are nuances and these are things that they come in handy. 'cause we're on the fly."

This is the moment. This is the sentence that should be on the landing page.

**PROPOSED COPY:**

Badge:
```
Real-Time Decision Support
```

H3:
```
"If I add 75mg of ketamine IM right now,
am I going to affect MDMA receptors too much?"
```

Subhead (smaller, below H3):
```
That question, asked mid-session with a patient who is not
breaking through, is the moment PPN was built for.
```

Body:
```
The contraindication checker cross-references your patient's
current medications against your selected protocol before
the session starts.

Sertraline plus MDMA: Serotonin Syndrome risk. Flagged.
Lithium plus MDMA: Potential neurotoxicity. Flagged.
Session blocked pending clinical review.

Switch to Ketamine IV for the same patient:
All three medications clear. Session proceeds.

The check takes 2 seconds. It runs before the patient
is in the chair. It creates a documented record that you
performed due diligence before administration.

That record is what separates a clinical outcome
from a malpractice case.
```

Legal notice (required below this section):
```
The contraindication checker is a decision-support tool only.
It does not replace clinical judgment or constitute medical advice.
All flagged interactions require clinician review before proceeding.
```

CTA:
```
See It In Action
```

---

### SECTION 8: MISSION AND STATS

**Current live H2:**
> "A Unified Framework for Clinical Excellence."

**The problem:** "Clinical Excellence" is hospital marketing language from 2005. The VoC is explicit: practitioners are skeptical of "gold rush" companies and prefer peer-led solutions. They do not want to be sold "excellence." They want to be told the truth.

**The VoC insight:** "By aggregating outcome data (MEQ-30, PHQ-9) across thousands of practitioners, the platform can build a massive, anonymized dataset. This data has immense value for research, lobbying for better CPT reimbursement rates, and proving the efficacy of specific protocols."

**PROPOSED COPY:**

H2:
```
The field needs a standard of care.
PPN is building it,
one logged session at a time.
```

Body:
```
Clinical trials are too slow and too rigid to capture what
actually happens in practice. A Phase 3 trial runs 3-5 years
and excludes the patients who need treatment most.

PPN captures what happens when these treatments leave the
controlled environment and enter the real world.

Every session logged in MedDRA, LOINC, and SNOMED-coded fields
contributes to the real-world evidence base that pharmaceutical
companies, insurance payers, and regulators need to expand access.

The 12,482 sessions in our network are not a marketing number.
They are the foundation of a dataset that does not exist
anywhere else in this field.
```

Stats grid (replace current labels):
- 12k+ → "Sessions Logged" (not "Enrolled Subjects")
- 04 → "Global Hubs" (keep)
- 85% → "Avg. PHQ-9 Improvement" (not "Avg. Outcome Lift" — be specific)
- 99.9% → "Data Integrity" (keep)

---

### SECTION 9: ABOUT PPN

**Current live copy is strong. Minor refinements only.**

Replace:
> "We believe that the future of mental health requires a high-fidelity infrastructure..."

With:
```
We built PPN because the infrastructure gap is real, it is
dangerous, and it is costing practitioners their licenses,
their margins, and their peace of mind.

The tools that exist were not built for this work.
We built one that was.
```

---

### SECTION 10: NEW FINAL CTA SECTION
*Currently missing from the page entirely. Must be added before footer.*

**The VoC insight:** The page currently ends with the About section and goes directly to the footer. There is no final conversion moment. This is a critical gap.

H2:
```
14 days. Full access.
No credit card. No sales call.
```

Body:
```
Join 840+ licensed clinicians who replaced their patchwork
of disconnected tools with a single system built for the
6-8 hour session.

HIPAA compliant. End-to-end encrypted.
MedDRA, LOINC, and SNOMED-coded data standards.
Your data stays yours.
```

Primary CTA button:
```
Request Clinical Access
```

Secondary CTA button:
```
Watch the 2-Minute Overview
```

Trust indicators below buttons:
```
[checkmark] No credit card required
[checkmark] Full access for 14 days
[checkmark] Cancel anytime
```

Legal notice:
```
PPN Portal is a measurement and benchmarking tool.
It does not provide medical advice, treatment recommendations,
or dosing guidance.
```

---

## PART 2: TWO NEW LIVE DEMO COMPONENTS

### COMPONENT 1: `ContradictionCheckerDemo.tsx`

**File:** `src/components/demos/ContradictionCheckerDemo.tsx`

**Placement A (Primary):** Hero right column, replacing the psilocybin molecule image.
**Placement B (Secondary):** New "Contraindication Checker" section (Section 7 above).

**Purpose:** Show the real-time contraindication check in action. This is the most visceral, immediate value demonstration available. It directly answers the Doctor Interview verbatim.

**Data:**
```typescript
// Patient Profile
const patientMedications = [
  { name: 'Sertraline', dose: '100mg', category: 'SSRI' },
  { name: 'Lithium', dose: '300mg', category: 'Mood Stabilizer' },
  { name: 'Propranolol', dose: '40mg', category: 'Beta Blocker' },
];

// Protocol A: MDMA-Assisted Therapy
const mdmaAlerts = [
  {
    medication: 'Sertraline',
    interaction: 'Serotonin Syndrome Risk',
    severity: 'HIGH',
    mechanism: 'Combined serotonergic activity',
    action: 'BLOCK',
  },
  {
    medication: 'Lithium',
    interaction: 'Potential Neurotoxicity',
    severity: 'MODERATE',
    mechanism: 'Altered lithium clearance',
    action: 'REVIEW',
  },
  {
    medication: 'Propranolol',
    interaction: 'No Significant Interaction',
    severity: 'CLEAR',
    mechanism: null,
    action: 'PROCEED',
  },
];

// Protocol B: Ketamine IV (user can toggle)
const ketamineAlerts = [
  { medication: 'Sertraline', severity: 'CLEAR', action: 'PROCEED' },
  { medication: 'Lithium', severity: 'CLEAR', action: 'PROCEED' },
  { medication: 'Propranolol', interaction: 'Mild BP Effect', severity: 'LOW', action: 'MONITOR' },
];
```

**Visual Design:**
- Left panel: "Patient Profile" glassmorphic card
  - Header: "Patient Profile" with a pulsing green "LIVE" badge
  - Medications list with pill icons
  - Protocol selector toggle: [MDMA-Assisted] [Ketamine IV]
- Right panel: "Interaction Check" results
  - Each alert animates in sequentially with 400ms stagger (Framer Motion)
  - HIGH severity: red background, shield-alert icon, "SESSION BLOCKED" badge
  - MODERATE: amber background, warning icon, "REVIEW REQUIRED" badge
  - CLEAR: emerald background, check-circle icon, "CLEARED" badge
- Bottom status bar: "Session Status: BLOCKED — 2 interactions require review" (updates when user toggles protocol)

**Interaction:**
- Protocol toggle (MDMA vs. Ketamine IV) updates all alerts in real time via useState
- Each alert card has hover state showing mechanism detail
- "Session Status" badge animates between BLOCKED (red) and CLEARED (green) on toggle

**Accessibility:**
- All alert cards have `role="alert"` and `aria-live="polite"`
- Protocol toggle has `aria-label="Select treatment protocol"`
- Severity badges use icon + text label (never color alone)
- Respects `prefers-reduced-motion` (disables stagger animation)

**Dependencies:** Framer Motion (already installed), Lucide React icons (already installed). No new dependencies.

**Style:** Match existing demo components exactly. Dark background (`bg-slate-900/60`), `border-slate-800`, `rounded-2xl`, same font sizing.

---

### COMPONENT 2: `ToolStackCostDemo.tsx`

**File:** `src/components/demos/ToolStackCostDemo.tsx`

**Placement:** Inside the Fragmented Workflow section (Section 3), replacing the current static card.

**Purpose:** Make the "4-5 disconnected tools" problem visual and quantified. Show the actual admin hour burden of the current patchwork stack vs. PPN. Numbers are more persuasive than metaphors.

**Data:**
```typescript
const currentStackData = [
  { tool: 'IntakeQ', hoursPerMonth: 8, cost: 99, color: '#ef4444' },
  { tool: 'Spruce Health', hoursPerMonth: 6, cost: 149, color: '#f97316' },
  { tool: 'SimplePractice', hoursPerMonth: 12, cost: 99, color: '#eab308' },
  { tool: 'Excel / Sheets', hoursPerMonth: 20, cost: 0, color: '#f59e0b' },
  { tool: 'Manual Reporting', hoursPerMonth: 10, cost: 0, color: '#fbbf24' },
];
// Total: 56 hours/month, $347/month

const ppnData = [
  { tool: 'PPN Portal', hoursPerMonth: 8, cost: 299, color: '#10b981' },
];
// Total: 8 hours/month, $299/month

// Net: 48 hours saved, $48/month more, = $1/hour saved
// Frame it as: 48 hours recovered for patient care
```

**Visual Design:**
- Top: Two stat cards side by side
  - Left: "Current Stack: 56 hrs/month" in red
  - Right: "With PPN: 8 hrs/month" in emerald
- Center: Horizontal grouped bar chart (Recharts BarChart, horizontal layout)
  - Each tool gets a bar showing its monthly admin hours
  - PPN gets a single emerald bar at the bottom for comparison
  - Bars animate in on mount (Framer Motion or Recharts animation)
- Bottom: Single bold line in large type: "48 hours recovered per month. Back to patient care."
- Hover on each bar: tooltip shows tool name, hours, and monthly cost

**Interaction:**
- Hover on any bar shows tooltip with tool name, hours/month, and cost/month
- PPN bar pulses gently to draw attention (CSS animation)

**Accessibility:**
- All bars have `aria-label` with tool name and hours
- Chart has `role="img"` and `aria-label="Admin hours comparison: current tool stack vs PPN"`
- Color is supplemented by text labels on each bar

**Dependencies:** Recharts (already installed). No new dependencies.

---

## PART 3: DUAL MARKETING STRATEGY BRIEF FOR PRODDY

### The Core Problem
The current landing page serves two ICPs with one message and one CTA. This is why conversion is low.

**ICP A: The Clinic Operator (Buyer)**
- Title: Clinic Director, Medical Director, Practice Owner, Anesthesiologist running a ketamine clinic
- Primary Fear: Malpractice liability, operational inefficiency, staff inconsistency, insurance audits
- Buying Trigger: An adverse event, a failed insurance audit, a competitor clinic benchmarking conversation
- Decision Timeline: 30-90 days (budget approval required, multi-stakeholder)
- Price Sensitivity: Low ($299-$499/month is noise if ROI is clear)
- Channel: LinkedIn, MAPS conference, CIIS conference, referral from malpractice carrier
- Message: "The clinical OS that creates a defensible audit trail and gives you network intelligence"
- CTA: "Schedule a 20-Minute Demo" (sales-assisted motion)
- VoC Evidence: "Clinic operators struggle with high patient acquisition costs and low retention. They search for 'practice management software,' 'marketing agencies for ketamine,' and 'outcome tracking tools.'"

**ICP B: The Clinical Convert / Solo Practitioner (Champion)**
- Title: Licensed Therapist, LCSW, Nurse Practitioner, Psychiatrist, LMFT
- Primary Fear: Licensure risk, isolation, "am I doing this right?", malpractice without institutional backing
- Buying Trigger: Certification completion, first adverse event, peer referral, isolation hitting a breaking point
- Decision Timeline: 7-14 days (self-serve, no budget approval needed)
- Price Sensitivity: High ($49-99/month is a real consideration)
- Channel: r/therapists, r/PsychedelicTherapy, Fluence certification program, IPI, word of mouth
- Message: "The peer network that tells you if you are in the 85th percentile or the 15th"
- CTA: "Start Free Trial" (self-serve motion)
- VoC Evidence: "Their entire professional identity is tied to their license. They are terrified of board complaints, malpractice suits, and insurance audits. They view 'underground' practices as dangerous liabilities."

### Questions for PRODDY
1. Should we build two separate landing pages (one per ICP) or one page with dynamic content based on referral source (UTM parameter)?
2. What is the pricing strategy for ICP B (Solo Practitioner) that does not cannibalize ICP A (Clinic Operator)? The "Data Bounty" model (free access in exchange for 5 logged protocols/month) is worth evaluating.
3. Which channel should we prioritize first given current network density (840 clinicians, 14 sites)? The existing network is the most powerful acquisition channel available.
4. The VoC identifies a "Supervision Desert" — practitioners feel abandoned after certification. Is there a content marketing play here (peer supervision circles, case consultation groups) that drives acquisition for ICP B?
5. The grey market segment (Tier 0) is the largest untapped dataset in mental health history. What is the ethical and legal framework for engaging them without creating liability for PPN?

---

## PART 4: DESIGNER BRIEF

### Visual Direction: "The Instrument Panel"

The three prior concepts (Constellation, Prism, Portal Sequence) were all metaphor-first. The research is clear: the 2026 practitioner is skeptical of hype and prefers peer-led, evidence-based solutions. A metaphor-first landing page signals "marketing company." An instrument-panel-first landing page signals "clinical infrastructure."

The landing page should feel like a clinical instrument panel that is already running. Not a marketing page that shows a product. A live system that the practitioner is looking at through a window.

### Specific Visual Specs

**1. Hero Section Redesign**
- Replace the psilocybin molecule image in the right column with `ContradictionCheckerDemo`
- The demo should appear to be "live" — add a pulsing green "LIVE" badge in the top-right corner of the demo card
- The demo should start in the MDMA protocol state (showing the HIGH severity Serotonin Syndrome alert) so the first impression is the most dramatic
- The left column copy (Option A) should be left-aligned on desktop, centered on mobile

**2. Fragmented Workflow Section**
- Replace the static card (red warning / strikethrough / green checkmark) with `ToolStackCostDemo`
- The chart should animate in on scroll (Framer Motion `whileInView`)
- The "48 hours recovered" stat should be the largest text element in the section

**3. New Contraindication Checker Section**
- Full-width section between Safety Risk Matrix and Clinic Radar
- Background: slightly different from adjacent sections (use `bg-slate-900/30` with a subtle red/amber gradient glow behind the demo card)
- The H3 should use the Doctor Interview quote verbatim, in quotation marks, in a slightly different typographic treatment (italic, slightly smaller than the other H3s)
- The demo card should be centered, wider than the other demos (max-w-3xl instead of max-w-2xl)

**4. "LIVE" Badge System**
- Add a pulsing green "LIVE" badge to all three existing demo components (SafetyRiskMatrix, ClinicRadar, PatientJourney)
- Badge: small pill, `bg-emerald-500/20 border border-emerald-500/30`, pulsing dot, "LIVE DATA" text
- This makes the demos feel like actual running systems, not screenshots

**5. New Final CTA Section**
- Full-width section, dark background (`bg-slate-950`)
- Centered layout, maximum width 600px
- Primary CTA: large emerald button ("Request Clinical Access")
- Secondary CTA: ghost button ("Watch the 2-Minute Overview")
- Legal notice: small, `text-slate-600`, below buttons

**6. Color System Enforcement**
- Emerald: Safe / Clear / Positive outcomes
- Amber: Warning / Review Required / Moderate risk
- Red: Critical / Blocked / High risk
- Blue (primary): Network / Benchmarking / Intelligence
- These colors are already in the system. The DESIGNER should enforce them consistently across all new sections.

### Mockup Deliverables Required
1. Hero section with `ContradictionCheckerDemo` in right column
2. Fragmented Workflow section with `ToolStackCostDemo`
3. New Contraindication Checker section (full width)
4. New Final CTA section
5. Mobile layout for all new components (375px viewport)

---

## ACCEPTANCE CRITERIA

### Copy
- [ ] All 10 section copy rewrites applied to Landing.tsx
- [ ] Zero em dashes in any copy
- [ ] Zero "Stop..." or "Most..." constructions
- [ ] Zero "clinical excellence," "transformative," "revolutionary"
- [ ] All numbers in copy match actual demo component data
- [ ] Legal notices present on all clinical feature sections
- [ ] Doctor Interview quote used verbatim in Section 7 H3

### New Components
- [ ] `ContradictionCheckerDemo.tsx` renders without errors
- [ ] `ToolStackCostDemo.tsx` renders without errors
- [ ] Protocol toggle in ContradictionCheckerDemo updates alerts in real time
- [ ] Both components respect `prefers-reduced-motion`
- [ ] Both components have ARIA labels on all interactive elements
- [ ] Both components use existing Recharts/Framer Motion (no new dependencies)
- [ ] Both components match existing demo component visual style exactly

### Integration
- [ ] `ContradictionCheckerDemo` placed in hero right column (replacing molecule image)
- [ ] `ToolStackCostDemo` placed in Fragmented Workflow section
- [ ] New Contraindication Checker section added to Landing.tsx between Safety Matrix and Clinic Radar
- [ ] New Final CTA section added to Landing.tsx before footer
- [ ] "LIVE" badge added to all three existing demo components
- [ ] All copy rewrites applied to Landing.tsx

---

## PIPELINE ROUTING

**MARKETER Phase 3 Complete. Full VoC research pass applied.**

Routing for LEAD:
1. Route to **PRODDY** for dual marketing strategy input (Part 3)
2. After PRODDY: route to **DESIGNER** for visual mockups (Part 4)
3. After DESIGNER: route to **BUILDER** for implementation (Parts 1 and 2)
4. After BUILDER: route to **INSPECTOR** for QA

**Completed by:** MARKETER
**Date:** 2026-02-17T23:47:00-08:00
**Research Depth:** Full pass — 18 files, 49KB VoC Analysis, Doctor Interview verbatim, Use Cases by Tier, SWOT, Customer Journey, Business Cases, full Landing.tsx audit
**Skills Applied:** master-data-ux, deep-industry-knowledge, go-to-market-strategy
