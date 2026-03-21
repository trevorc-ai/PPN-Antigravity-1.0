# **Gemini says**

*In the PAT arc of care, when a patient is receiving multiple treatment sessions, what defines the distinction between the three phases of Preparation, Dosing, and Integration? Specifically, I presume the distinction between preparation and dosing is obvious, but I'm not certain, and I need to clearly define this so my application can run properly. When does each phase begin and end, (eg. when does 'Integration' end and Preparation for the next treatment begin), and how should the practitioner officially signal this distinction? Also, what, if anything, else should be considered?*

*Look to the research and the industry best practices as the source of truth to guide how we make this distinction in the application. We have done extensive research on the different phases in the longitudinal arc of care; you may need to check our chat history to find it, or do some research.*

*For context, in my PPN Portal, we haven't been clear about setting when Integration ends and a subsequent treatment begins, and we need to define that in order for the app to work correctly.*

# **Gemini says:**

In Psychedelic-Assisted Therapy (PAT), the "arc of care" is widely recognized across clinical trials (such as those by MAPS or COMPASS Pathways) and industry frameworks (like the EMBARK model) as a three-phase cycle: Preparation, Dosing, and Integration.

When a patient is receiving multiple treatments, this arc becomes longitudinal and cyclical. Because software applications require discrete logic and binary states, you must establish clear, programmatic boundaries for when one phase ends and the next begins.

Here is how you can define these boundaries for your PPN Portal, based on clinical best practices:

## **1\. Preparation Phase**

* **What it is:** The phase dedicated to psychoeducation, building the therapeutic alliance, setting intentions, establishing safety boundaries (including consent for therapeutic touch), and mitigating anxiety.  
* **When it Begins:** \* *For the first treatment:* When the patient is officially enrolled in the care plan and cleared for treatment.  
  * *For subsequent treatments:* Immediately after the practitioner officially concludes the *Integration* phase of the previous session (more on this below).  
* **When it Ends:** The moment the patient arrives for their dosing appointment and the practitioner begins the pre-administration protocol (e.g., taking baseline vitals).

## **2\. Dosing Phase**

* **What it is:** The supervised administration of the psychedelic compound, typically lasting anywhere from 2 to 8 hours depending on the medicine (e.g., ketamine vs. psilocybin or MDMA).  
* **When it Begins:** Officially starts when the medicine is administered to the patient.  
* **When it Ends:** When the acute effects of the medicine have subsided, the patient has returned to a baseline state of ordinary consciousness, and the practitioner officially medically clears and discharges the patient from the clinic for the day.

## **3\. Integration Phase**

* **What it is:** The period where the patient processes the psychological material, insights, and emotions that arose during the dosing session and translates them into meaningful, long-term behavioral and cognitive changes.  
* **When it Begins:** Immediately following the dosing discharge. Clinically, the first formal integration session typically occurs 24 to 48 hours after the dosing session.  
* **When it Ends (The Transition to the Next Treatment):** In a multiple-dosing protocol, Integration does not simply fade away; it must be actively closed. Clinically, integration transitions into preparation when the therapeutic focus shifts from *processing the past experience* to *looking forward and setting intentions for the next dose*.  
* **App Definition:** In your portal, Integration should end when a predetermined protocol milestone is met (e.g., the completion of the 3rd integration session) **AND** the practitioner actively checks a box, signs a note, or updates a status dropdown indicating: *"Integration complete; transitioning to Preparation for Dose \[X\]."* \#\#\# How the Practitioner Should Officially Signal This Distinction  
  To make your app function smoothly, do not rely on automated timelines (e.g., "Integration ends 14 days after dosing"). Healing is non-linear. Instead, use a **Practitioner-Gated Milestone** system:  
1. **Phase Gates:** At the end of a Dosing session, require the practitioner to complete a "Discharge/Session Note" which automatically toggles the patient's app state to *Integration*.  
2. **The Pivot Point:** During multiple-session protocols, the final integration session often serves a dual purpose. Require the practitioner to submit a "Phase Transition Form." This form should ask the practitioner to verify that the patient has sufficiently stabilized from the previous dose and reaffirm consent and intentions for the next dose. Submitting this form signals the app to flip the patient's state from *Integration* back to *Preparation*.

## **Additional Considerations for Your App (Industry Best Practices)**

* **Re-evaluating Consent:** Consent is not static in PAT. Your app should prompt the practitioner to re-establish consent for things like therapeutic touch or specific interventions during the *Preparation* phase of *every* subsequent dose, as patient boundaries can change after their first psychedelic experience.  
* **Handling "Step-Backs":** Sometimes a patient arrives for a Dosing session but is emotionally or medically unready (e.g., high blood pressure or extreme anxiety). Your app must have a "Revert" or "Step-Back" function, allowing the practitioner to cancel the Dosing phase and immediately revert the patient's status back to *Preparation* without breaking the longitudinal data tracking.  
* **Longitudinal Symptom Tracking:** Keep in mind that clinical assessments (like PHQ-9 for depression or PCL-5 for PTSD) are usually administered at specific anchor points. A best practice is to trigger these assessments in the app right before the transition from *Integration* to the next *Preparation* phase to measure the isolated efficacy of the previous dose.

  *Good points. What else should we be considering, in the context of the PPN Portal application, as we move forward to defining, analyzing, and reporting on these phases through the longitudinal arc of care?*

It is excellent that you are thinking ahead about the systemic implications of these phase transitions. Moving from defining clinical boundaries to mapping out the underlying software architecture and user experience requires anticipating edge cases, safety protocols, and data structures.

As you build out the longitudinal functionality in the PPN Portal, here are several critical, structural considerations to keep in mind.

## **Data Architecture: Parent Protocols vs. Child Cycles**

For a longitudinal care application to function properly, the database must distinguish between the overall treatment plan and the individual treatment loops. If you treat every phase as a flat list of events, your data tracking will become chaotic.

Consider structuring your database with a hierarchical model:

| Data Level | Description | App Function |
| :---- | :---- | :---- |
| **Parent (The Protocol)** | The overarching care plan (e.g., "6-Week Ketamine Protocol" or "MDMA PTSD Trial"). | Houses global patient data, baseline psychological assessments, initial informed consent, and final program closure notes. |
| **Child (The Cycle)** | The individual loop of Preparation $\\rightarrow$ Dosing $\\rightarrow$ Integration. | Tracks cycle-specific data, such as the specific dosage used, intentions set for *that specific session*, and acute adverse events. |

---

## **Patient Safety and Edge Cases**

* **Medication Tapering as a Hard Blocker:** In many PAT protocols (especially involving psilocybin or MDMA), patients must slowly taper off contraindicated medications like SSRIs during the Preparation phase. Your app should treat a "Tapering Complete" milestone as a hard, non-bypassable gate before the Dosing phase can be unlocked.  
* **The "Clinical Hold" State:** Psychedelic therapy can unearth difficult psychological material. If a patient reports severe distress, suicidal ideation, or signs of conditions like HPPD (Hallucinogen Persisting Perception Disorder) during an Integration check-in, the app must have an automated mechanism to pause the longitudinal progression. This "Hold" state should lock the transition to the next Preparation phase and immediately alert the care team.  
* **Protocol Abandonment:** Not all patients complete a multi-dose arc. You need a workflow for early termination. If a patient decides to stop treatment after Dose 2 of a 3-Dose protocol, the app needs a way to cleanly terminate the Parent Protocol while preserving the data from the completed Child Cycles.

---

## **The Patient User Experience (UX)**

* **Adaptive Interfaces:** The patient-facing side of the portal should functionally adapt based on the phase they are in. During Preparation, the UI should prioritize educational modules, intention-setting worksheets, and logistical instructions (e.g., fasting requirements). During Integration, the UI should shift to prioritize daily mood tracking, journaling prompts, and somatic exercises.  
* **Managing "Long-Tail" Integration:** What happens after the *final* dose of the protocol? The last Integration phase behaves differently than the intermediate ones. Instead of transitioning back into Preparation, it stretches out into a "Maintenance" or "Discharge" phase. The app needs logic to recognize when a patient is in their final cycle and adjust the messaging and timeline accordingly.

---

## **Operational Tie-ins**

* **Billing and CPT Code Triggers:** Different phases often correspond to different billing codes. Preparation and Integration are typically billed as standard psychotherapy or psychiatric evaluation codes, while Dosing involves complex, prolonged service codes. Tying the practitioner's phase-transition clicks to automated billing tags can save significant administrative time.  
* **Automated Scheduling Logic:** The transition from one phase to another should dictate scheduling parameters. For example, if a practitioner clicks "Transition to Dosing," the portal's scheduling widget should only display available time slots that are long enough to accommodate a full medicine session (e.g., 3 to 8 hours), rather than standard 50-minute therapy blocks.

Would you like me to outline the specific clinical assessments and safety checklists that should act as hard gates before allowing a practitioner to transition a patient from the Preparation phase into the Dosing phase?

# **ChatGPT says**

# **ChatGPT says:**

*In the PAT arc of care, when a patient is receiving multiple treatment sessions, what defines the distinction between the three phases of Preparation, Dosing, and Integration? Specifically, I presume the distinction between preparation and dosing is obvious, but I'm not certain, and I need to clearly define this so my application can run properly. When does each phase begin and end, (eg. when does 'Integration' end and Preparation for the next treatment begin), and how should the practitioner officially signal this distinction? Also, what, if anything, else should be considered?*

*Look to the research and the industry best practices as the source of truth to guide how we make this distinction in the application. We have done extensive research on the different phases in the longitudinal arc of care; you may need to check our chat history to find it, or do some research.*

*For context, in my PPN Portal, we haven't been clear about setting when Integration ends and a subsequent treatment begins, and we need to define that in order for the app to work correctly.*

Concise answer

Preparation is the non-drug, forward-looking phase tied to the next intended dosing session. Dosing is the medicine-administration encounter itself, beginning when the first dose is actually administered and ending when the patient is formally released from acute session care. Integration is the post-dose, backward-looking phase tied to the most recent completed dosing session. It does not have a universal fixed calendar endpoint in the literature. For app logic, integration should end only when the practitioner explicitly closes post-dose follow-up for that dose, or explicitly opens preparation for a specific next dose. Once the purpose of an encounter becomes readiness for the next dose, that encounter is preparation, not integration. ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC7908919/))

Your current schema already points in that direction. `log_integration_sessions` is anchored back to a dosing session, while `log_clinical_records.session_status` is still only `draft`, `active`, or `completed`, with `completed = Phase 3 done`. Also, your `v_followup_compliance` view uses a 45-day follow-up window after `session_completed`, which is useful for reporting, but it should not be treated as the clinical definition of when integration ends.

## **1\. What the research supports**

Across the modern PAT literature, the standard arc is preparation, dosing, and integration. The focus changes by phase. Preparation builds alliance, readiness, safety, expectations, intentions, and skills for navigating the session. Dosing is the monitored medicine session itself. Integration is the reflective and meaning-making work after the medicine session, aimed at consolidating insight and translating it into daily life. ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC7908919/))

The important part is this: integration is described in the literature as a process, not a cleanly bounded biological event. One of the clearest reviews says that integration sessions happen after the experience, but the integration process is also grounded in what occurs before, during, and outside those sessions. Another psilocybin therapist-training paper says the integration process generally unfolds over time as the participant begins implementing changes in life. That means the field does not give you a single universal “day X \= integration ends” rule. ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8008322/))

Protocols also vary. In MDMA-assisted therapy research, doses were commonly spaced about a month apart, with three or four non-drug sessions after each dosing session, and sometimes two or three total dosing sessions. Other PAT protocols use different counts and spacing. So the boundary cannot be safely inferred from elapsed time alone. ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6695343/))

## **2\. The clean clinical distinction you should use**

### **Preparation**

Preparation is any encounter or workflow whose primary purpose is to make the patient ready for a specific upcoming dosing session.

That includes things like:

1. renewed eligibility or safety review  
2. medication review or taper planning  
3. informed consent refresh  
4. intention setting  
5. set and setting planning  
6. transportation or support planning  
7. therapist alignment and readiness assessment

This matches both trial logic and regulated service models. Oregon, for example, explicitly treats preparation as the phase before administration, with required preparation before the first administration session. ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC9553847/))

### **Dosing**

Dosing begins when the first dose is administered, not when the patient arrives, and not when pre-dose conversation starts. Pre-dose check-in on dosing day is still preparation. The dosing phase includes the acute medicine period, monitoring, in-session support, optional supplemental dosing if the protocol allows it, and ends when the patient is released from the acute session. ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC9285360/))

### **Integration**

Integration begins after the dosing encounter ends. It includes the immediate debrief, next-day or early follow-up, structured integration sessions, and later post-dose meaning-making or behavior-change work, as long as the primary purpose remains processing and applying the last dose. Oregon’s operational model is narrower than clinical PAT, but it still reflects the same direction of travel: after administration, the facilitator follows up within 72 hours and offers integration. ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8008322/))

## **3\. When each phase begins and ends in the app**

Here is the rule set I would use.

### **Preparation begins**

Preparation begins at the first documented clinician action that is primarily about readiness for a specific upcoming dose.

### **Preparation ends**

Preparation ends at `dose_administered_at`, or at the first `log_dose_events.administered_at` if that is your more precise source of truth. Before that moment, the patient is still in preparation, even if they are already onsite.

### **Dosing begins**

Dosing begins at the first actual medicine administration event.

### **Dosing ends**

Dosing ends when the practitioner formally closes the acute session and records release or handoff from acute care. In your schema, that should map to `session_ended_at`, plus an explicit practitioner end-of-session action in the UI. Oregon’s regulated model also uses an end-of-session release concept, which is exactly the kind of explicit closure signal your app needs. ([Oregon](https://www.oregon.gov/oha/PH/PREVENTIONWELLNESS/Documents/Psilocybin-Product-and-End-of-Session-Form.pdf?utm_source=chatgpt.com))

### **Integration begins**

Integration begins immediately after dosing ends. The first integration contact may happen the same day, the next day, or within a few days, depending on protocol and setting.

### **Integration ends**

Integration ends operationally, not biologically. It should end at the earlier of these two events:

1. The practitioner explicitly closes post-dose follow-up for that dosing session, with no further dose-linked integration planned.  
2. The practitioner explicitly opens preparation for a specific next dosing session.

That second rule is the crucial one. Once the therapeutic purpose shifts from “process the last dose” to “prepare for the next dose,” you are no longer in integration for app-state purposes, even though the prior dose may still be discussed. That is the cleanest way to stop phase overlap from breaking your logic. ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8008322/))

## **4\. The exact answer to your hardest question**

“When does Integration end and Preparation for the next treatment begin?”

Clinically, there can be conceptual overlap. Operationally, there should not be.

Use this rule:

Integration ends, and next-cycle preparation begins, at the first practitioner-documented encounter whose primary purpose is readiness for the next intended dosing session.

That is the defensible boundary.

Not:

1. X days after the last dose  
2. after all feelings are processed  
3. after all homework is done  
4. when a follow-up survey window closes

Those are too vague, too variable, or just analytics choices.

## **5\. How the practitioner should officially signal the distinction**

Do not infer phase changes from time. Require explicit practitioner transition events.

I would add these actions in the app:

1. Open Preparation for Session N  
2. Start Dosing for Session N  
3. End Dosing / Release Patient for Session N  
4. Open Integration for Session N  
5. Close Integration for Session N  
6. Open Preparation for Session N+1

Each transition should record:

1. practitioner ID  
2. timestamp  
3. linked dosing session ID  
4. patient ID  
5. reason / attestation  
6. optional note

The attestation for “Open Preparation for Session N+1” should state something like:

“The primary purpose of care has shifted from post-dose processing of Session N to readiness planning for Session N+1.”

That one checkbox will save you a lot of downstream ambiguity.

## **6\. What to do with hybrid sessions**

This is where apps usually get sloppy.

If one meeting genuinely includes both:

1. processing the prior dose, and  
2. preparing for the next dose

then you have two good options.

### **Best option**

Split the encounter into two documented segments:

1. Integration segment for Session N  
2. Preparation segment for Session N+1

This is better for analytics, auditability, and future decision support.

### **Acceptable fallback**

Allow one encounter record, but force:

1. one primary phase  
2. one secondary phase  
3. two separate linked session references

If you do not force that distinction, your app will blur backward-looking and forward-looking care and your reporting will become unreliable.

## **7\. What else you should consider**

### **A. Integration is tied to a specific prior dose**

Your existing `log_integration_sessions.dosing_session_id` already reflects the correct clinical logic. Integration should always point backward to a specific completed dosing session, not to a vague treatment course.

### **B. Preparation should point forward to a specific intended next dose**

This is the missing half of the model. If you do not have an explicit forward link, the app will keep guessing.

### **C. Longitudinal assessments are not phase boundaries**

A PHQ-9, GAD-7, MEQ30, CEQ, alliance scale, or follow-up form can occur during integration, between cycles, or around new prep. The assessment itself should not determine phase. Your current follow-up view using a 45-day window is a reporting construct, not a clinical phase rule.

### **D. Safety events stay linked to the originating dose**

If an adverse effect shows up during what is now next-cycle preparation, it may still belong clinically to the prior dosing session. Do not let the phase label sever causality.

### **E. “Course of treatment” is separate from “phase”**

A patient can be in Treatment Course 1 while moving through multiple repeated cycles of preparation, dosing, and integration. The phase is the local state around a dose. The course is the larger arc.

### **F. Different PAT models will vary**

Research PAT, Oregon psilocybin services, ketamine clinics, and underground-informed harm-reduction models do not use identical timing or staffing. What is stable across them is the functional distinction:

1. readiness work before dose  
2. the medicine encounter itself  
3. post-dose processing and application afterward ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC9553847/))

## **8\. Recommended PPN Portal rule, in one sentence**

For PPN Portal, define phase by documented encounter purpose and explicit practitioner transition, not by elapsed time:

Preparation \= readiness for the next dose.  
Dosing \= acute medicine administration encounter.  
Integration \= post-dose work linked to the last completed dose.  
Integration ends when the clinician closes post-dose follow-up for that dose, or opens explicit preparation for the next one.

If you want, I’ll turn this into exact PPN database and UI state rules next.

*Good points. What else should we be considering, in the context of the PPN Portal application, as we move forward to defining, analyzing, and reporting on these phases through the longitudinal arc of care?*

Yes. The main thing you should be considering is that “phase” is only one layer of the model. If PPN Portal treats phase as the same thing as encounter type, measurement timing, follow-up status, or treatment-course progress, your logic and reporting will drift. The clean fix is to separate those layers now, before data starts accumulating.

## **The biggest design issue to solve**

You need four separate concepts, not one:

1. **Treatment course**  
   The larger arc for a patient, which may include one or many doses.  
2. **Dose cycle**  
   One prep to dose to integration sequence tied to one intended dosing event.  
3. **Encounter purpose**  
   What this specific clinician interaction was mainly for: preparation, dosing support, integration, safety follow-up, reassessment, or administrative review.  
4. **Measurement time point**  
   When an assessment was captured relative to dose or course, such as baseline, acute, day 1 to 3, week 1, month 1, month 3\.

Your schema already shows signs of these being partially mixed. `log_clinical_records.session_status` currently says `completed = Phase 3 done`, while your flow and follow-up analytics are separately driven by `log_patient_flow_events`, stage ordering, and a 45-day follow-up window. `log_integration_sessions` is also already modeled separately from the core dosing session, and `log_longitudinal_assessments` plus `ref_time_points` indicate a distinct measurement layer. That is good, but it means the app should stop pretending one field can do all jobs.

## **What else to consider as you define and report these phases**

### **1\. Decide the unit of truth for transitions**

Do not let the app infer phase changes from date gaps, survey timing, or whether someone clicked “complete.” Use explicit practitioner transition events.

For PPN, the source of truth should be a transition action, such as:

1. prep opened  
2. dose started  
3. dose ended  
4. integration opened  
5. integration closed  
6. next-cycle prep opened

Your current analytics views already rely on explicit flow events and ordered stages, which is the right pattern. Keep that, and do not let reporting windows redefine the clinical state. The current 45-day follow-up view is useful for compliance tracking, but it is not the clinical definition of integration.

### **2\. Separate “clinical phase” from “research follow-up”**

This is one of the easiest places to get false analytics.

A patient may be:

1. clinically in preparation for dose 2,  
2. still contributing long-term outcome data for dose 1,  
3. still being watched for delayed adverse effects from dose 1\.

Those are not contradictory. They are different layers.

The literature is clear that follow-up often continues well past the immediate integration sessions. Trials commonly include immediate debriefs, week-1 follow-up, then later time points such as 1 to 2 months, 3 months, 6 months, and sometimes 12 months after the final dose. That means your reporting model must distinguish “phase status now” from “scheduled outcome follow-up still active.” ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6695343/))

### **3\. Build for protocol heterogeneity now, not later**

The field does not use one universal cadence. PAT is consistently described as involving preparation, dosing, and integration, but the number and timing of sessions varies by study, indication, substance, and setting. MDMA protocols often use several prep sessions, then three integration sessions after each dosing visit, while psilocybin protocols may use different structures and longer-term follow-up schedules. ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12491819/))

So PPN should not hard-code:

1. a fixed number of prep sessions,  
2. a fixed number of integration sessions,  
3. a universal number of days that defines “integration.”

Instead, define:

1. a default protocol template,  
2. allowed site-level protocol variation,  
3. a way to record when a site deviated from protocol and why.

Otherwise your reporting will quietly punish valid clinical variation.

### **4\. Handle mixed-purpose encounters explicitly**

In real practice, one visit may include:

1. processing the last dose,  
2. checking safety,  
3. deciding whether to proceed with another dose,  
4. beginning readiness work for the next dose.

If you force one whole visit into one bucket, you will lose meaning.

The best solution is to let one encounter contain:

1. a **primary purpose**,  
2. an optional **secondary purpose**,  
3. a backward link to the prior dose if integration occurred,  
4. a forward link to the intended next dose if prep began.

If you want the cleanest reporting, split hybrid encounters into two documented segments. If you do not, at least force a primary-purpose declaration.

### **5\. Define attribution rules for safety events and difficulties**

This matters a lot.

A safety event that appears during integration, or even during preparation for the next cycle, may still be causally related to the prior dose. The same applies to persistent distress, insomnia, suicidality, functional destabilization, or interpersonal fallout.

Your app should therefore distinguish:

1. **phase when detected**,  
2. **session or dose most likely responsible**,  
3. **whether the event changed readiness for the next dose**.

That lets you answer three different questions:

1. When did this show up?  
2. What likely caused it?  
3. Did it alter the treatment plan?

If you collapse those into one field, your safety analytics will be weak.

### **6\. Decide what counts as phase completion versus phase quality**

This is another hidden trap.

A phase can be completed administratively without being clinically adequate.

For example:

1. preparation completed, but contraindication screening was incomplete,  
2. dosing completed, but acute measures were missing,  
3. integration closed, but only one brief contact occurred and no functional application was documented.

So your reporting should not only track:

1. phase started,  
2. phase completed.

It should also track:

1. minimum required elements present,  
2. recommended elements present,  
3. protocol deviations,  
4. quality flags.

Your schema already includes clinically important fields around contraindication review and verdicts, which suggests you are thinking this way. Expand that logic to all three phases.

### **7\. Keep measurement timing independent from phase labels**

This is critical for analysis.

Acute experience measures, alliance measures, symptom scales, vitals, and functional outcomes do not all belong to the same layer. The literature shows substantial variability in the measures used for acute psychedelic effects, and researchers have explicitly called for more standardized outcome sets and better specification of setting variables. ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC10851631/))

For PPN, you should classify measures into at least these buckets:

1. pre-dose readiness measures,  
2. in-session acute measures,  
3. immediate post-dose debrief measures,  
4. short-horizon integration measures,  
5. longer-horizon longitudinal outcomes.

That means a PHQ-9 at 3 months is not “integration” just because it happened after a dose. It is a longitudinal outcome time point.

### **8\. Track the non-drug variables, not just the substance**

This field is moving toward broader recognition that extra-pharmacological variables matter. Recent consensus work produced formal reporting recommendations for setting variables in psychedelic trials, and methodological reviews keep warning that underreported psychosocial intervention details make results harder to interpret and reproduce. ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12283393/))

For PPN, that means phase reporting should eventually include structured metadata for:

1. setting characteristics,  
2. therapist or guide structure,  
3. support modality,  
4. music or sensory environment,  
5. overnight support or release arrangements,  
6. protocol/manual version,  
7. deviations from intended set and setting.

Otherwise, you will attribute too much to the molecule and too little to the actual therapeutic container.

### **9\. Treat alliance and expectancy as first-class variables**

This is not fluff. It affects outcomes.

Therapeutic alliance measured at the final preparation session and one week after psilocybin sessions has been associated with later depression outcomes, and methodological papers keep flagging expectancy and unmasking as major issues in psychedelic studies. ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC10939230/))

In PPN terms:

1. prep is not just logistics,  
2. integration is not just debrief,  
3. alliance and expectancy are possible confounders and effect modifiers.

So if you want research-grade reporting later, you should plan now for structured capture of:

1. alliance,  
2. expectancy,  
3. perceived readiness,  
4. perceived safety,  
5. protocol adherence.

### **10\. Decide the denominator before you build dashboards**

Most dashboard mistakes come from bad denominators, not bad SQL.

For example:

1. “integration completion rate” per dose is different from per patient,  
2. “follow-up completion” among sessions due in the window is different from among all sessions ever created,  
3. “prep to dose conversion” is different from “course to first dose conversion.”

You should predefine at least these reporting denominators:

1. per patient,  
2. per dose cycle,  
3. per dosing session,  
4. per site,  
5. per protocol template,  
6. per substance,  
7. per indication.

If you do not, teams will compare apples to oranges and call it benchmarking.

### **11\. Plan for censoring and “not yet due” logic**

A patient who had a dose three days ago should not count as noncompliant for a one-month outcome form.

Likewise, a patient who has not yet had another dose should not be classified as “ended treatment” just because no future prep is open.

Your reporting layer should distinguish:

1. completed,  
2. overdue,  
3. not yet due,  
4. intentionally discontinued,  
5. medically paused,  
6. lost to follow-up.

Without that, every operational dashboard will overstate failure.

### **12\. Build for corrections and auditability**

Because this is clinical-adjacent data, phase transitions should be auditable.

For every transition or closure, record:

1. who did it,  
2. when,  
3. under what role,  
4. under what protocol version,  
5. whether a correction later changed it,  
6. why it changed.

You already have correction infrastructure and role-scoped access patterns in the schema. Use that to make phase history immutable enough for trust, while still allowing amendment workflows.

## **The practical rule I would lock in for PPN**

Use three separate status systems:

1. **Clinical phase status**  
   Current local state for the active dose cycle.  
2. **Treatment course status**  
   Whether the patient is active, paused, completed, discontinued, or planned for future work.  
3. **Assessment schedule status**  
   Whether a specific follow-up or outcome measurement is due, completed, overdue, waived, or not yet due.

That gives you a model that is much harder to break.

## **The single most important reporting principle**

Never let a reporting window define the clinical phase.

A 45-day follow-up window is an analytics convenience. It is not the definition of integration. A completed symptom survey is a measurement event. It is not proof that integration is over. A new prep visit is a clinical intent signal. That is much closer to the real phase boundary.

## **My recommendation for PPN, in plain terms**

As you move forward, define and report the longitudinal arc using this hierarchy:

1. **Dose cycle is the core unit**  
2. **Phase is determined by explicit practitioner-declared purpose**  
3. **Assessments are attached by time point, not by vague phase label**  
4. **Safety events are attributed separately from when they were detected**  
5. **Reporting windows never redefine clinical state**  
6. **Protocol variation is configurable, not hard-coded**

That gives you something clinically defensible, analytically clean, and realistic for repeated-session care.

Which matters more for your next step: getting the database logic right, the UI workflow right, or the reporting/dashboard logic right?

