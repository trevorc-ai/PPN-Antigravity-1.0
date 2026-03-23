# **ChatGPT says:**

I’m drafting this as a real decision memo, not a loose opinion, and I’m checking the uploaded schema and stabilization docs again so the rules line up with the actual PPN model rather than abstract best practices.

Locked decision: in PPN Portal, the canonical unit is the dose cycle, phase state must be practitioner-gated, assessments must be time-point based rather than phase-defined, and dashboards must report at the cycle level before they report at the patient level. That is the cleanest way to stop session bleed, fix multi-session attribution, and keep the product aligned with how PAT is actually structured in the literature and in your stabilization brief. ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12491819/?utm_source=chatgpt.com))

## **PPN Portal Locked Decision Memo**

### **Status**

Recommended to lock now for product, database, and reporting.

### **Why this is the right model**

Your own stabilization brief already sets the core clinical rule set correctly: preparation is forward-looking to the next dose, dosing begins at actual administration, integration is backward-looking to the most recent completed dose, and phase transitions are never time-based or inferred from data gaps. It also states that `log_clinical_records` is per dosing session, `log_integration_sessions` points back to a dosing session, and `log_patient_flow_events` should become the authoritative transition ledger.

That matches the broader PAT literature. PAT is commonly organized around preparation, dosing, and integration, but the number and timing of sessions vary across protocols, which is exactly why PPN should not use a fixed calendar rule to define phase boundaries. Integration is also described in the literature as an ongoing process rather than a single universally bounded endpoint. ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC9553847/?utm_source=chatgpt.com))

## **1\. Locked model hierarchy**

PPN should use this hierarchy, in this order:

1. Treatment course  
   The full arc of care for one patient under one protocol or care episode.  
2. Dose cycle  
   One preparation to dosing to integration sequence tied to one intended dosing event.  
3. Session or encounter  
   A specific documented interaction, such as prep visit, dosing session, integration visit, safety follow-up, or reassessment.  
4. Measurement time point  
   A structured anchor such as baseline, acute, day 1 to 3, week 1, month 1, month 3, month 6\.  
5. Observation or assessment  
   PHQ-9, GAD-7, MEQ-30, vitals, behavioral changes, safety events, alliance, expectancy, and so on.

Do not collapse these layers into one status field.

## **2\. Canonical unit of analysis**

Lock this:

The canonical analytical unit is the dose cycle.

Not:

1. the patient  
2. the visit  
3. the assessment  
4. the course as one flat record

Reason:  
A patient may have multiple dosing sessions. Each dose has its own preparation work, acute session, integration work, safety profile, and follow-up measurements. Your own brief says the absence of a clear session 1 to integration 1 to session 2 to integration 2 model is the root cause of the current failures.

Operational definition of one dose cycle:

1. preparation opened for intended dose N  
2. actual dosing session N  
3. post-dose integration tied to session N  
4. any follow-up assessments or safety events attributable to session N

## **3\. Locked workflow-state rules**

### **A. Phase state**

Use practitioner-gated clinical phase state for the active cycle only.

Allowed states:

1. preparation\_open  
2. dosing\_active  
3. integration\_open  
4. integration\_closed

Optional deferred future states, not needed for stabilization:

1. cycle\_paused  
2. cycle\_abandoned  
3. clinical\_hold

### **B. Transition rules**

1. Opening preparation creates or activates the next intended cycle.  
2. Dosing starts only at actual medicine administration.  
3. Dosing ends only by explicit practitioner discharge or end-session action.  
4. Integration opens immediately after dosing ends.  
5. Integration closes only by explicit practitioner action or by opening preparation for the next cycle.  
6. No phase transition is inferred from elapsed time, missing forms, or completed assessments.

### **C. Hybrid encounters**

If one encounter includes both prior-dose processing and next-dose readiness planning:

1. Best practice: split into two segments  
2. Minimum acceptable fallback: require one primary purpose and one optional secondary purpose

Do not let one hybrid encounter silently redefine the cycle boundary.

## **4\. Locked database attribution rules**

### **A. `log_clinical_records`**

Lock this role:

1. one row per dosing session  
2. this is the anchor record for the actual dose event  
3. it is not the full treatment course  
4. it is not the sole source of phase truth

That is already how the stabilization brief describes it.

### **B. `log_integration_sessions`**

Lock this role:

1. every integration session must link backward to a specific `dosing_session_id`  
2. integration never floats at the patient level without a specific originating dose

That is already consistent with the brief and should remain non-negotiable.

### **C. `log_patient_flow_events`**

Lock this role:

1. authoritative phase-transition ledger  
2. every phase-opening or phase-closing action must write one explicit event  
3. this table, not a view and not form completion, determines transition history

This is already the intended direction in the brief, but it needs to become an enforced rule rather than a partial pattern.

### **D. Session attribution requirements for phase events**

For each phase-transition event, require:

1. patient\_uuid  
2. site\_id  
3. prior dosing session id, if the event closes or references integration for the previous dose  
4. intended next dosing session id, if the event opens preparation for the next dose  
5. practitioner id  
6. timestamp  
7. event type  
8. attestation or reason code  
9. optional note

This is the one place I do not want fuzzy shortcuts. If an event cannot be attributed to the correct cycle or intended cycle, your analytics will drift.

### **E. Whether a new table is required**

For stabilization, I agree with the brief that you can avoid a new parent cycle table if, and only if, these conditions are true:

1. every new preparation opening creates a new intended session context  
2. every new dosing session gets a new `log_clinical_records` row  
3. every transition event can point to the correct prior or next session  
4. canceled or abandoned next cycles are still explicitly recorded

If any of those fail in practice, then the “no new table needed” position becomes weak. Your brief says no fundamental schema restructuring is needed, but that is conditionally true, not universally true.

## **5\. Locked reporting model**

Separate reporting into three layers.

### **A. Clinical workflow reporting**

This answers: what phase is the patient or cycle in right now?

Examples:

1. active cycles in preparation  
2. active cycles in dosing  
3. open integrations  
4. integrations closed this month

### **B. Protocol execution reporting**

This answers: did the practitioner complete the intended care steps for the cycle?

Examples:

1. prep opened but never dosed  
2. dose completed with no integration session recorded  
3. integration closed without required follow-up  
4. cycle duration from prep-open to integration-close

### **C. Outcome reporting**

This answers: what changed clinically and when?

Examples:

1. PHQ-9 change from baseline to month 1  
2. behavioral change frequency at week 2  
3. adverse event rate per dose  
4. vital sign excursions during dosing sessions

Do not mix these layers in one chart.

## **6\. Locked reporting denominators**

This is where dashboards usually go wrong. Lock these before building charts.

### **Required denominators**

1. per dose cycle  
2. per dosing session  
3. per patient  
4. per protocol  
5. per site  
6. per substance or intervention type  
7. per indication

### **Default rule**

If no denominator is explicitly stated on a dashboard, default to per dose cycle.

### **Examples**

1. Integration completion rate  
   Numerator: cycles with explicit integration close  
   Denominator: cycles with completed dosing  
2. Prep-to-dose conversion  
   Numerator: cycles with dose administered  
   Denominator: cycles with preparation opened  
3. Follow-up completion at month 1  
   Numerator: cycles with required month-1 assessment completed  
   Denominator: cycles for which month-1 follow-up is due  
4. Adverse event rate  
   Numerator: dose cycles with one or more attributable adverse events  
   Denominator: completed dosing sessions

## **7\. Locked time-point model**

Assessments do not define phase. Your brief already says this, and that should remain fixed.

Use time points such as:

1. baseline  
2. pre-dose same day  
3. acute intra-session  
4. immediate post-dose  
5. day 1 to 3  
6. week 1  
7. week 2  
8. month 1  
9. month 3  
10. month 6  
11. final course follow-up

Reason:  
The literature shows that PAT protocols vary, and long-term follow-up often continues beyond immediate integration sessions. A patient can be in preparation for the next cycle while still contributing outcome data linked to the prior dose. ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12491819/?utm_source=chatgpt.com))

## **8\. Locked safety attribution rules**

Safety reporting must answer three separate questions:

1. When was the issue detected?  
2. Which dose or cycle is it most likely attributable to?  
3. Did it alter readiness for the next dose?

So each safety event should have:

1. detection phase  
2. attributed dose session id  
3. severity  
4. causality confidence  
5. action taken  
6. whether it triggered hold, delay, taper, or discontinuation

Do not use current phase alone as the causality field.

## **9\. Locked status separations**

PPN should not use one status to mean everything. Use three independent status families.

### **A. Current clinical phase status**

Examples:

1. preparation\_open  
2. dosing\_active  
3. integration\_open  
4. integration\_closed

### **B. Treatment course status**

Examples:

1. active  
2. paused  
3. completed  
4. discontinued  
5. transferred  
6. lost\_to\_followup

### **C. Assessment schedule status**

Examples:

1. not\_due  
2. due  
3. completed  
4. overdue  
5. waived  
6. not\_applicable

This separation is mandatory if you want analytics that mean what they appear to mean.

## **10\. Locked edge-case handling**

These must be explicitly modeled, not improvised.

1. Prep opened, dose never occurred  
   Status: cycle exists, no completed dose  
2. Dose occurred, integration never formally closed  
   Status: integration remains open until explicitly closed or next prep opens  
3. Integration and next-prep discussed in the same visit  
   Status: split encounter or assign primary and secondary purpose  
4. Patient placed on clinical hold after a safety concern  
   Status: course active but cycle paused, next prep blocked  
5. Patient stops after one dose  
   Status: cycle may close, course may discontinue  
6. Next dose planned, then canceled  
   Status: next cycle may be canceled without mutating the prior cycle  
7. Long-term outcome survey completed after next prep has begun  
   Status: allowed, but assessment still belongs to prior cycle and time point

## **11\. Locked contextual variables to capture later**

These are not Track A or B work, but they matter for real interpretation and future benchmarking.

The recent literature is moving toward better reporting of extra-pharmacological and setting variables because PAT is a complex intervention, not just a molecule plus score change. Reporting quality around setting and protocol context is increasingly treated as essential, not optional. ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12283393/?utm_source=chatgpt.com))

Future structured fields should include:

1. protocol version  
2. therapist configuration  
3. support modality  
4. setting characteristics  
5. material protocol deviations  
6. alliance  
7. expectancy  
8. release arrangements  
9. integration homework assigned and completed

Do not add these now if they violate stabilization mode, but do reserve the conceptual space.

## **12\. Decision on the current 45-day follow-up window**

Lock this explicitly:

The 45-day follow-up logic is a reporting window, not a phase boundary.

That means:

1. it may remain useful for compliance dashboards  
2. it must not be used to auto-close integration  
3. it must not be used to infer treatment discontinuation  
4. it must not redefine readiness for the next cycle

Your own brief already states this principle, and it is correct.

## **13\. What I would add to the stabilization brief**

I would add one short section titled “Canonical Reporting Rules” with these five lines:

1. Canonical analytical unit \= dose cycle  
2. Phase truth source \= practitioner-gated `log_patient_flow_events`  
3. Dosing anchor \= one `log_clinical_records` row per dosing session  
4. Integration attribution \= always to a specific prior `dosing_session_id`  
5. Assessments \= anchored to time points, not used to define phase boundaries

That would prevent future agents from quietly sliding back into patient-level flattening.

## **14\. Bottom-line decision**

Lock these now:

1. Dose cycle is the core unit.  
2. Phase transitions are explicit practitioner actions.  
3. Assessments are anchored to time points, not to vague phase labels.  
4. Safety events are attributed separately from when they were detected.  
5. Reporting windows are never allowed to define clinical state.  
6. Dashboards default to cycle-level denominators unless explicitly stated otherwise.

That set of rules is consistent with your stabilization brief and with the current PAT literature, which supports the common prep-dosing-integration arc while also making clear that protocols vary and integration is process-based rather than universally time-bounded. ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12491819/?utm_source=chatgpt.com))

\===

Yes. The biggest additional UI/UX consideration is this:

PPN Portal should make the current patient, current dose cycle, current phase, and current source of truth impossible to misunderstand on every screen. Right now, your main risk is not ugly UI. It is clinically ambiguous UI that lets a practitioner act on the wrong patient, wrong session, or wrong cycle. That is exactly the failure pattern your stabilization brief is already warning about, given the undefined treatment-cycle boundary, the lack of cross-page patient context, the navigation silos, and the timeline bleed bug.

## **My main UI/UX recommendations**

### **1\. Add a persistent clinical context header**

Every patient-facing workflow page should show, at the top and without scrolling:

1. patient name or de-identified display label  
2. current protocol  
3. current dose cycle number  
4. current phase  
5. current session date  
6. current status such as active, discharged, integration open, or next cycle pending

This is not cosmetic. It is the minimum defense against wrong-context actions. Your current brief already confirms there is no persistent patient context across pages and that pages bootstrap independently. That is a UX failure first, not just a routing problem.

### **2\. Make phase state visually explicit, not implied**

Do not make the practitioner guess whether they are in prep, dosing, or integration based on which form is open.

Use one clear phase indicator:

1. Preparation  
2. Dosing  
3. Integration

And pair it with one plain-language sentence:

1. “Forward-looking. Preparing for next dose.”  
2. “Acute medicine session in progress.”  
3. “Backward-looking. Processing prior dose.”

Your locked definitions are already clear. The UI needs to surface them constantly so the practitioner does not have to remember the rules from training.

### **3\. Treat phase transitions as critical actions**

Because phase changes are practitioner-gated and not inferred, the UI should treat these actions like controlled clinical events, not ordinary button clicks.

That means:

1. transition buttons should be high-clarity, single-purpose actions  
2. each should include a short attestation  
3. each should preview what changes next  
4. each should state what record is being opened or closed

For example:

1. “Start Dosing” should confirm this will end Preparation and begin the acute session.  
2. “End Dosing and Discharge” should confirm this will open Integration.  
3. “Close Integration” should confirm this ends follow-up for this dose.  
4. “Open Next Cycle” should confirm this starts Preparation for a new intended dosing session.

Do not hide this behind generic Save behavior.

### **4\. Prevent wrong-patient and wrong-session actions aggressively**

Given the live-production setup with no isolated staging environment, and given the existing session bleed issue, the UI should be more defensive than a normal app.

I recommend:

1. a visible patient identifier on all action bars  
2. a visible session identifier or date on dosing and integration pages  
3. a short confirmation when creating a new cycle for an existing patient  
4. a warning if the user is about to resume the most recent session instead of explicitly opening a new one  
5. a hard distinction between “resume current session” and “start next cycle”

This is where many systems fail. They let convenience override correctness.

### **5\. Distinguish current cycle actions from historical review**

If a practitioner is looking at prior sessions, that view should feel obviously historical, not live.

Use:

1. read-only styling for prior sessions unless explicitly opened for correction  
2. clear labels such as “Viewing prior dose cycle”  
3. a persistent “Return to current cycle” action  
4. separation between active-work buttons and historical review buttons

Without that, the user can easily think they are acting on the current cycle when they are really reviewing the prior one.

### **6\. Make the navigation reflect the care arc**

Your current navigation is siloed, and the brief already identifies the exact problem. Wellness Journey, Protocol Detail, and Analytics do not share patient context reliably.

The navigation should reflect the practitioner’s real workflow:

1. Protocol Detail  
2. Wellness Journey  
3. Analytics  
4. Back to current patient

That means the top of each relevant page should offer contextual next steps:

1. “Open in Wellness Journey”  
2. “View Patient Analytics”  
3. “View Prior Session Summary”  
4. “Open Next Cycle”

Not generic global navigation alone.

### **7\. Separate workflow UI from reporting UI**

Do not let reporting language bleed into care-state language.

Examples of what to avoid:

1. a dashboard saying “integration incomplete” when what it really means is “month-1 follow-up not yet completed”  
2. a chart label implying a patient is inactive when they are simply between cycles  
3. a follow-up percentage that feels like a clinical judgment

Your schema already separates flow events, follow-up compliance, and outcome observations imperfectly. The UI must not collapse them back together. The existing views show exactly why this matters. `v_flow_stage_counts` and `v_flow_time_to_next_step` are flow constructs, while `v_followup_compliance` is a reporting-window construct, and the network outcome benchmarks are time-point based through observations. Those should not look interchangeable to the user.

### **8\. Show uncertainty and missingness honestly**

In clinical documentation systems, fake precision is dangerous.

The UI should distinguish:

1. not started  
2. in progress  
3. completed  
4. overdue  
5. not yet due  
6. intentionally closed  
7. unresolved safety issue  
8. insufficient data

Do not let null data render as completion, and do not let missing longitudinal data silently flatten charts.

### **9\. Design mixed-purpose encounters carefully**

Real encounters may include both:

1. integration for the last dose  
2. prep for the next dose

The UI should force a primary purpose selection, even if the record can contain a secondary purpose. Otherwise you will never get clean reporting later.

At minimum:

1. ask “What is the primary purpose of this encounter?”  
2. allow optional “Also covered”  
3. store both distinctly if needed

This is one of the most important UX controls for preserving the phase logic you already locked.

### **10\. Use progressive disclosure for clinical detail**

Practitioners need speed first, depth second.

The UI should show:

1. the one action they most likely need now  
2. the few critical context items that change decision-making  
3. expandable sections for deeper detail

For example, on the current-cycle view, they should see immediately:

1. current phase  
2. unresolved safety flags  
3. latest contraindication verdict  
4. next recommended action

Then they can expand into observations, prior summaries, or full reports if needed.

### **11\. Prioritize “continue work safely” over “see everything”**

This app is not a general EHR. It is a structured PAT workflow and network intelligence platform. The best UI is not the one that exposes the most data at once. It is the one that makes the next clinically correct action obvious. That aligns with your own North Star in the brief, which says every change should make documentation and decision-making easier, safer, or more insightful.

### **12\. Make irreversible or high-impact actions feel heavier**

These should not look like ordinary secondary buttons:

1. start dosing  
2. end dosing  
3. close integration  
4. open next cycle  
5. mark do not proceed  
6. resolve safety event  
7. create correction

Each should have:

1. clear label  
2. short consequence text  
3. confirmation only when needed  
4. visible audit acknowledgement

### **13\. Empty states need clinical guidance, not blankness**

When data is absent, the UI should explain why.

Examples:

1. “No integration sessions recorded yet for this dose.”  
2. “No longitudinal outcomes due yet.”  
3. “This patient has no next cycle open.”  
4. “Vitals are recorded for this session but have not yet been loaded.”

Blank charts and empty panels make users assume the app is broken, even when the state is valid.

### **14\. Respect stabilization mode**

Do not turn this into a design project.

The right UI/UX move right now is not:

1. major layout redesign  
2. new navigation framework  
3. new page system  
4. broad component refactor

Your brief already freezes layout risk and restricts scope. So the best UX changes now are surgical:

1. clearer labels  
2. stronger context visibility  
3. safer phase-transition actions  
4. better empty states  
5. cleaner current-cycle versus prior-cycle distinction  
6. contextual navigation that carries patient identity correctly

## **The highest-value UI/UX additions, in order**

If I had to prioritize brutally, I would do them in this order:

1. Persistent patient and cycle context bar  
2. Explicit phase badge plus one-sentence definition  
3. Safer transition actions with consequence text  
4. Clear distinction between resume current session and begin new cycle  
5. Patient-context navigation between Protocol Detail, Wellness Journey, and Analytics  
6. Historical versus active-cycle visual separation  
7. Honest empty, overdue, and not-yet-due states

## **The one thing I would not do**

I would not let Analytics drive the workflow UI.

The workflow UI should be built around clinical correctness and documentation safety. Analytics should reflect that model afterward, not shape it. If you reverse that, you will build a dashboard-friendly interface that is brittle in real care use.

My blunt recommendation is this:

For PPN, the best UX is “state clarity under pressure.” Every screen should answer, in under two seconds, who this is, what cycle this is, what phase this is, what happened last, what is due next, and what action is safe right now.

Yes. I recommend locking a formal UI/UX guardrail memo now.

The core UI rule for PPN is simple: every clinically meaningful screen must make the current patient, current dose cycle, current phase, current source of truth, and next safe action obvious within two seconds. That is the right response to the problems already documented in your stabilization brief, especially the undefined treatment-cycle boundary, navigation silos, lack of persistent patient context, and multi-session bleed risk.

PPN PORTAL UI/UX GUARDRAILS FOR STABILIZATION

Status

Recommended to lock now.

Purpose

These guardrails exist to keep the interface clinically clear, operationally safe, and analytically trustworthy while PPN Portal remains in stabilization mode. They are meant to guide Cursor, Gemini, Antigravity, and any future agent so that UI work supports the locked clinical phase model rather than weakening it. The stabilization brief already makes clear that the app is clinical documentation and network intelligence software, not a general wellness app, and that all changes must improve documentation or decision-making without introducing drift.

North Star

State clarity under pressure.

At any point in the workflow, the practitioner should be able to answer five questions immediately:

1. Which patient am I working on?  
2. Which dose cycle am I in?  
3. Which phase is currently active?  
4. What happened last?  
5. What is the next safe action?

If the interface does not answer those questions clearly, it is not safe enough for this product.

Locked UI/UX principles

1. Context must always be visible

Every patient-specific workflow screen must show a persistent clinical context header above the working content. This header should remain visible without requiring the practitioner to infer context from form fields or route history.

Minimum required context items:

1. patient display name or de-identified label  
2. patient site or protocol context, if relevant  
3. dose cycle number  
4. active phase  
5. current session date or session state  
6. active warnings, such as unresolved safety issue, integration open, or next cycle pending

Reason:  
The brief confirms there is currently no persistent patient context across pages, and each page bootstraps independently. That is a direct UX hazard.

2. Never rely on page location to imply phase

A practitioner must never have to guess the phase based on which page they are on. The active phase must be displayed explicitly as a labeled status element, not implied by page title, chart type, or form content.

Required phase display pattern:  
Preparation  
Forward-looking, readiness for the next dose

Dosing  
Acute medicine session in progress

Integration  
Backward-looking, processing the most recent completed dose

Reason:  
Your phase definitions are already locked. The UI should reinforce them constantly, not assume the user remembers them.

3. Do not use color alone to communicate state

This matters doubly because the product is already complex, and because color-only cues are fragile for accessibility.

Required:

1. every phase indicator must include text  
2. every warning state must include text and iconography or shape difference  
3. action priority must not depend on color alone  
4. disabled, active, complete, overdue, and warning states must remain distinguishable in grayscale

Reason:  
The interface must still work when color perception is limited or the screen is poor. If a phase or warning disappears when color is removed, the design is weak.

4. Transition actions are controlled clinical actions, not ordinary buttons

Phase transitions must feel materially different from routine save actions.

The following actions should be treated as controlled transitions:

1. Open Preparation  
2. Start Dosing  
3. End Dosing / Discharge  
4. Open Integration  
5. Close Integration  
6. Begin Next Treatment Cycle

Each transition control should include:

1. a precise action label  
2. one sentence explaining what will change  
3. the patient and session context  
4. a lightweight attestation if the action changes phase state  
5. a clear success state after completion

Reason:  
The brief already locks phase transitions as practitioner-gated and says they must never be inferred from time, forms, or missing data. The UI has to reflect that seriousness.

5. Current-cycle actions and historical review must feel different

A practitioner should never confuse reviewing a prior session with editing or advancing the active one.

Required:

1. prior cycles default to read-only mode  
2. prior-cycle screens must be visibly labeled as historical  
3. active cycle screens must surface next-step actions prominently  
4. corrections to prior cycles must be deliberate and visibly separate from normal workflow

Reason:  
Your current failures include timeline bleed and wrong-session reuse. The UI must actively prevent accidental continuation of the wrong record.

6. “Resume current cycle” and “start next cycle” must never look interchangeable

This is one of the most important guardrails.

If a practitioner is working with a patient who already has prior sessions, the system must clearly separate:

1. Resume current cycle  
2. View prior cycle  
3. Begin new treatment cycle

These must not be hidden inside one ambiguous “Continue” or “Start session” action.

Required copy pattern:  
Resume active cycle  
Start new treatment cycle  
View prior sessions

Reason:  
The stabilization brief explicitly identifies that the app can resume the most recent clinical record without verifying it is the correct new session. That is not just a logic bug, it is a label and decision-architecture problem.

7. Navigation must carry patient context deliberately

Any route that moves between Protocol Detail, Wellness Journey, and Analytics must preserve the active patient context explicitly. The brief already identifies `?patientUuid=` as the minimum surgical mechanism. That is correct for stabilization, and the UI should be built around this without inventing a broader navigation rewrite.

Required contextual actions:

1. Open in Wellness Journey  
2. View Protocol  
3. View Patient Analytics  
4. Return to Current Cycle

These actions should appear within the page context, not only in the global sidebar.

8. Workflow UI and reporting UI must not use the same language for different truths

The UI must distinguish clearly between:

1. clinical phase state  
2. assessment schedule status  
3. reporting window status  
4. treatment-course status

Examples of forbidden ambiguity:

1. “Integration incomplete” when you really mean “month 1 follow-up overdue”  
2. “Inactive” when you really mean “between cycles”  
3. “Complete” when you only mean “required form submitted”

Reason:  
Your locked phase rules already say assessments do not define phases, and reporting windows are not phase boundaries. The UI must not collapse those concepts back together.

9. Empty states must explain the absence of data

Blank states should not look like broken states.

Required empty-state patterns:

1. No integration sessions recorded yet for this dose.  
2. No follow-up assessments are due yet.  
3. No next cycle has been opened for this patient.  
4. No vitals have been loaded for this session yet.  
5. This chart will populate after a new treatment cycle is created.

Reason:  
Clinical users assume silent blank areas are bugs. In a stabilization context, explanatory empty states reduce error, hesitation, and false bug reports.

10. Missing, unknown, overdue, and complete must be separate statuses

Do not flatten status.

At minimum, UI components should distinguish:

1. not started  
2. in progress  
3. completed  
4. overdue  
5. not yet due  
6. intentionally closed  
7. unresolved  
8. insufficient data

Reason:  
A missing value is not the same as “no issue,” and an overdue follow-up is not the same as an open clinical phase.

11. Mixed-purpose encounters need explicit structure

Some real-world encounters will include both integration work for the last session and preparation work for the next one. The UI must not leave this ambiguous.

Required:

1. ask for primary purpose  
2. allow optional secondary purpose  
3. if possible, let the practitioner split the encounter into two linked segments later  
4. never let the UI silently turn a hybrid encounter into a full phase transition without explicit confirmation

Reason:  
This is one of the main places where analytics drift begins.

12. The interface should recommend the next safe action, not simply show all actions equally

The UI should highlight the most likely correct next step based on current cycle state.

Examples:

1. If Preparation is active, highlight Start Dosing only if readiness requirements are met.  
2. If Dosing is active, highlight End Dosing / Discharge, not unrelated follow-up tasks.  
3. If Integration is open, highlight Close Integration or Begin Next Cycle only when appropriate.  
4. If the patient has no active cycle, highlight Begin New Treatment Cycle.

Reason:  
This product is not meant to be a neutral data browser. It is a structured workflow tool.

13. Warnings and blockers should be surfaced before action, not buried afterward

Before allowing a major transition, the UI should surface unresolved blockers that matter clinically or operationally.

Examples:

1. contraindication review incomplete  
2. consent missing  
3. unresolved safety event  
4. missing discharge action  
5. no patient context loaded  
6. attempting to start next cycle while current integration remains open

This should not become a wall of popups. It should be a clean pre-action summary near the transition control.

14. Audit-sensitive actions should leave visible traces in the interface

If a practitioner closes integration, opens a new cycle, or corrects a prior record, the UI should reflect that event visibly.

Examples:

1. “Integration closed by \[role\] on \[date/time\]”  
2. “Next cycle opened on \[date/time\]”  
3. “This record contains a correction”

Reason:  
Users trust systems more when important actions leave a visible, understandable trail.

15. Do not redesign the app during stabilization

This is a hard guardrail.

The brief already freezes layout risk and makes clear that stabilization work must stay surgical. So the right UI/UX changes now are not a new design system, full page rewrite, or broad component refresh. They are targeted clarity improvements inside the existing structure.

Allowed during stabilization:

1. add persistent context header  
2. improve action labels  
3. add consequence text to phase transitions  
4. add contextual links between pages  
5. improve empty states  
6. separate historical from active views  
7. clarify status labeling

Not allowed without a separate approved plan:

1. major layout refactor  
2. broad Tailwind restyling  
3. spacing or overflow experiments across multiple screens  
4. new navigation framework  
5. large component redesign

The brief is explicit that layout and styling changes are high risk and require their own dedicated plan.

Recommended UI copy standards

Use direct, literal labels. Avoid vague labels.

Preferred:

1. Begin New Treatment Cycle  
2. Resume Active Cycle  
3. View Prior Sessions  
4. Start Dosing  
5. End Dosing and Discharge  
6. Close Integration  
7. View Patient Analytics  
8. Return to Active Cycle

Avoid:

1. Continue  
2. Next  
3. Complete  
4. Done  
5. Submit  
6. Finish session, unless the exact meaning is spelled out

Reason:  
The more clinically consequential the action, the less tolerance there is for vague wording.

Recommended page-level guardrails

Protocol Detail

Must show:

1. patient context  
2. current cycle and phase  
3. entry points to Wellness Journey and Analytics with patient context preserved  
4. prior cycle summary access, if relevant

Must not do:

1. show patient-level protocol information without saying whether it refers to current or prior cycle  
2. link to another patient-specific screen without carrying patient context

Wellness Journey

Must show:

1. persistent patient and cycle context  
2. active phase  
3. last completed action  
4. next recommended action  
5. whether the practitioner is in active or historical mode

Must not do:

1. auto-resume the most recent session without explicit validation  
2. blur active-cycle controls with prior-cycle review

Analytics

Must show:

1. whether analytics are filtered to a patient, session, cycle, protocol, or site  
2. whether the view is current-cycle, historical-cycle, or network benchmark  
3. whether missing data means not yet due, not captured, or not applicable

Must not do:

1. imply that a reporting gap is a clinical failure  
2. label reporting windows as phase status

Sidebar and top navigation

Must do:

1. preserve patient context when moving between patient-specific areas  
2. show when the user is in a patient-specific mode versus general mode  
3. offer a visible route back to current patient workflow

Must not do:

1. drop patient context silently  
2. force unnecessary patient re-selection on every move

Acceptance criteria for any future UI plan

A UI change should not be approved unless the plan can answer yes to all of these:

1. Does the screen make patient identity obvious?  
2. Does it make current cycle obvious?  
3. Does it make current phase obvious?  
4. Does it separate active workflow from historical review?  
5. Does it preserve patient context across navigation?  
6. Does it avoid using color alone for state?  
7. Does it avoid redefining clinical state based on reporting logic?  
8. Does it keep layout risk low and localized?  
9. Does it match the locked phase definitions?  
10. Does it reduce the chance of acting on the wrong record?

Brutal priority order

If you only implement a few UI/UX changes first, do them in this order:

1. persistent patient and cycle context header  
2. explicit phase badge with plain-language definition  
3. clear separation between Resume Active Cycle and Begin New Treatment Cycle  
4. safe transition controls with consequence text  
5. patient-context navigation between Protocol Detail, Wellness Journey, and Analytics  
6. historical versus active-cycle visual distinction  
7. honest empty and missing-data states

Bottom line

The best UI for PPN is not the one that looks the most polished. It is the one that makes the current state, the current record, and the next safe action impossible to misunderstand. That is what your stabilization brief is already demanding, even if it does not yet say it in explicit design language.

Do you want me to turn this into a shorter paste-ready addendum section for STABILIZATION\_BRIEF.md, or keep it as the standalone guardrail memo?

