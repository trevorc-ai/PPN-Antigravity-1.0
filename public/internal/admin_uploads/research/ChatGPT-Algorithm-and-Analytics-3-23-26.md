The sample PPN reports are strong as document artifacts, but they are still much better at documenting and exporting than at revealing the underlying analytical logic. The report pack already proves that PPN can produce credible, clinically legible, audit-oriented outputs. What is still missing is a clearer distinction between:

1. raw captured facts,  
2. rule-based determinations,  
3. calculated metrics,  
4. benchmark comparisons,  
5. confidence or evidence strength behind each conclusion.

On algorithms, PD Answer Key appears to use biomarker-to-symptom correlation logic and target-zone scoring based on observed patterns in Parkinson’s data, while PPN, based on your sample reports, is using a mix of rules engines, threshold logic, timeline logic, score calculation, and aggregate cohort benchmarking. The difference is that PD Answer Key is mainly an interpretation engine for biomarker data, while PPN is broader, it is a clinical workflow, safety, compliance, and outcomes intelligence engine. ([PD Answer Key](https://pd-answer-key.com/))

Assessment of the sample PPN reports

What is working well

The report pack shows five important strengths.

First, the reports are clinically readable. They look like documents a provider, auditor, payer, IRB reviewer, or regulator could actually scan quickly. The hierarchy is clear, the status labels are understandable, and the tables are easy to follow. That is true across the adverse event report, consent record, letter of medical necessity, research export, safety plan, session timeline, and transport plan. Pages 1 through 14 show a consistent system language and structure.

Second, the reports demonstrate that PPN is not just storing forms. It is synthesizing multiple data types into usable artifacts. For example:

* the adverse event report turns timestamps, vitals, intervention actions, and resolution status into a narrative incident summary and regulatory determination,  
* the letter of medical necessity turns diagnosis, baseline scales, treatment history, protocol details, outcomes, and safety summary into a payer-facing justification,  
* the research export turns de-identified cohort data into aggregate outcome metrics, benchmarks, and data provenance.

Third, the safety and compliance orientation is strong. The adverse event report includes CTCAE grade, intervention log, resolution, notification status, sign-off, and audit trail. The consent form emphasizes immutability and 21 CFR Part 11\. The research export includes provenance, schema version, export audit ID, and de-identification language. That is exactly the right direction for a clinical data platform. See pages 1 to 2, 3 to 4, and 7 to 8\.

Fourth, the timeline report is one of the strongest pieces in the pack. It combines a pharmacokinetic framing, vitals progression, and event ledger into a coherent chronological record. That is much more useful than a generic visit note because it shows what happened, when it happened, and how the clinical team responded. Pages 11 to 12 are especially strong.

Fifth, the report pack shows good product discipline around de-identification and export intent. The research export is clearly aggregate and de-identified. It also signals that PPN understands provenance, benchmarking, and auditability, not just note-taking. Page 8 is especially important because it hints at PPN’s eventual defensibility as a research and quality-improvement platform.

What is weak or risky

This is where I would push harder.

The reports sometimes blur fact, interpretation, and decision. That is dangerous. For example, phrases like “No Regulatory Reporting Required,” “Response Achieved,” “Remission Achieved,” “Low Risk,” “Interaction check: clear,” and cohort-vs-network benchmark scores all imply algorithmic judgment, but the reports do not show what rule or formula produced those labels. Pages 2, 6, 8, and 9 are the clearest examples.

That means the outputs look authoritative, but the user cannot tell:

* whether a conclusion came from a hard threshold,  
* whether it came from a statistical model,  
* whether it was manually confirmed,  
* whether it depends on complete data,  
* whether it is site-specific or network-derived.

That is the main analytical weakness in the current report layer. The documents look finished, but the reasoning chain is not yet exposed.

The second weakness is that some benchmark-style scores look synthetic rather than clinically grounded. On page 8, the “Cohort vs Network” comparison shows Safety, Retention, Efficacy, Adherence, Data Quality, and Compliance as scores like 88 vs 82 or 100 vs 94\. Those are visually persuasive, but analytically weak unless the user can inspect the numerator, denominator, weighting, time window, and exclusion logic. Otherwise they are dashboard theater.

The third weakness is possible overreach in payer-facing language. The medical necessity letter states that psychedelic-assisted therapy with psilocybin is indicated under an evidence-based protocol and presents a strong response/remission arc with one AE and zero chemical rescue. That is persuasive, but if this were used in the real world, the evidence standard, regulatory setting, and reimbursement context would matter enormously. Pages 5 to 6 read well, but they are also the most exposed if the underlying logic is not rigorous.

The fourth weakness is the implied precision of pharmacokinetic staging. The timeline and transport plan segment the session into onset, peak, integration, afterglow, descent, and safe transport windows. That is useful operationally, but it could become misleading if users read those bands as biologically exact rather than protocol-guided approximations. Pages 11 and 13 show this clearly.

My overall assessment

The report pack is better than average product work. It already looks like a real platform rather than a mockup. But analytically, it is still in the “credible reporting layer” stage, not yet the “fully auditable clinical intelligence engine” stage. The next maturity step is not prettier reports. It is exposing algorithm provenance and confidence.

How algorithms are used in the two platforms

PD Answer Key

Based on the site content, PD Answer Key uses algorithms to connect biomarker values to Parkinson symptom severity patterns. The site explicitly says:

* “We know how biomarkers correlate with Parkinson symptoms,”  
* blue dots are real people with PD,  
* the red line is the average change in symptom severity as a lab value changes,  
* the gray zone widens where there is little data,  
* users should know whether their results are in the “target zone,”  
* the PRO-PD report tracks symptom severity over time and links laboratory tests to individual symptoms. ([PD Answer Key](https://pd-answer-key.com/))

In plain English, that implies several algorithm layers.

The first is a scoring algorithm. It likely converts symptom inputs into a baseline disease-burden score, probably through a defined symptom instrument or internal scoring framework. ([PD Answer Key](https://pd-answer-key.com/))

The second is a correlation or association layer. It appears to compare biomarker values such as RDW, homocysteine, and HDL against symptom burden across an underlying Parkinson’s dataset. The site does not show the exact model, but the red-line and gray-zone explanation strongly implies some fitted trend or smoothed relationship with uncertainty handling. ([PD Answer Key](https://pd-answer-key.com/))

The third is a target-zone classification layer. The site says people with RDW below 13, homocysteine below 10, and HDL above 60 have fewer symptoms over time. That means the platform is translating continuous lab values into interpretable ranges and likely flagging whether a patient is inside or outside a desired zone. ([PD Answer Key](https://pd-answer-key.com/))

The fourth is a longitudinal reporting layer. The PRO-PD report tracks symptom change over time and ties biomarker patterns to symptoms for provider review. ([PD Answer Key](https://pd-answer-key.com/))

So the PD Answer Key algorithm stack is mostly:

* ingest biomarker and symptom data,  
* score symptom burden,  
* estimate correlations,  
* classify target zones,  
* produce a provider-facing interpretation report. ([PD Answer Key](https://pd-answer-key.com/))

PPN Portal

PPN’s algorithms, based on the sample reports, appear broader and more modular.

1. Rules and threshold algorithms

These are the clearest in the report pack.

Examples:

* Grade 2 hypertension classification in the AE incident report,  
* “No Regulatory Reporting Required” because the event does not meet the Grade 3+ threshold,  
* “Resolved” outcome after BP normalization,  
* transport readiness checklist logic,  
* release timing around earliest safe release,  
* risk flags such as “MONITOR” or “LOW RISK.” Pages 1, 2, 9, 10, 13, and 14 suggest this very strongly.

These are classic deterministic algorithms:  
if X threshold is crossed, then assign Y classification or trigger Z workflow.

2. Timeline and state-transition algorithms

PPN is clearly modeling session phases and events over time.

Examples:

* onset, peak, integration, afterglow on page 11,  
* estimated readiness window on page 13,  
* timestamped event ledger on page 12,  
* linking the safety event to the peak area of the session curve on page 11\.

This means PPN is not just calculating static fields. It is inferring state from time, dose administration, event occurrence, and session progression. That is a workflow algorithm, not just a report formula.

3. Clinical score and responder-status algorithms

The letter of medical necessity shows PHQ-9 dropping from 22 to 6 over time, with “Response Achieved” defined as at least 50 percent reduction and “Remission Achieved” defined as PHQ-9 less than 5\. Page 6 explicitly shows the response criterion, and the chart shows the time series.

That means PPN is already using score-based outcome algorithms:

* baseline to follow-up delta,  
* percent change,  
* threshold-based response status,  
* threshold-based remission status.  
4. Cohort aggregation algorithms

The research export uses cohort size, age distribution, diagnosis distribution, baseline and final means, average change, responder rate, AE counts, and network comparison. Pages 7 and 8 show aggregation across 42 subjects in a psilocybin cohort with measures such as PHQ-9, GAD-7, and CAPS-5.

These require:

* inclusion and exclusion logic,  
* time-window logic,  
* outcome rollup logic,  
* event rollup logic,  
* benchmark comparison logic.  
5. Benchmarking algorithms

The radar chart and “Cohort vs Network” scores imply normalization and comparison to a larger reference set on page 8\.

This is more advanced than PD Answer Key in one sense, because it suggests site or cohort performance is being compared to a network baseline. But it is also riskier, because benchmark algorithms are very easy to misuse if the definitions are vague.

The practical difference between the two platforms

PD Answer Key is using algorithms mainly for biomarker interpretation.

PPN is using algorithms across the full clinical data lifecycle:

* intake and risk screening,  
* contraindication and safety logic,  
* live monitoring,  
* adverse event handling,  
* longitudinal outcomes,  
* release readiness,  
* payer justification,  
* de-identified research export,  
* network benchmarking. ([PD Answer Key](https://pd-answer-key.com/))

So PD Answer Key is narrower but conceptually simpler:  
biomarkers plus symptom scores become interpretation.

PPN is broader and structurally harder:  
clinical events, scales, thresholds, workflows, timing, safety rules, and cohort analytics become operational and research intelligence. ([PD Answer Key](https://pd-answer-key.com/))

What PPN should do better than PD Answer Key

This is the part that matters.

PD Answer Key appears to communicate algorithmic interpretation simply, but it does not show much methodological detail on the public site. It says the gray zone reflects less certainty where there is less data, which is actually a good sign, but the public-facing material still leans on strong claims and simplified “target zones.” ([PD Answer Key](https://pd-answer-key.com/))

PPN should be stricter.

For every important computed result, PPN should know whether it is:

* a direct observation,  
* a threshold-based rule,  
* a derived metric,  
* a benchmark comparison,  
* a probabilistic inference,  
* or a clinician-entered conclusion.

That distinction should not just exist in the backend. It should surface in the report logic.

For example:

* “Grade 2 event” should show the grading source and criteria.  
* “No regulatory reporting required” should show the rule path.  
* “Response achieved” should show the exact formula.  
* “Network benchmark 88 vs 82” should show the scoring model.  
* “Interaction check: clear” should eventually show evidence source, last review date, and confidence level.

That is how you make PPN defensible.

Bottom line

Your sample report pack is strong product work. It already demonstrates real value in safety documentation, session chronology, payer documentation, de-identified research export, and transport readiness.

PD Answer Key appears to use algorithms mainly to map biomarkers to symptom severity, define target zones, and generate provider-facing interpretation over time. ([PD Answer Key](https://pd-answer-key.com/))

PPN appears to use algorithms across rules, thresholds, time states, outcomes scoring, cohort aggregation, and network benchmarking.

The strategic gap is this:  
PD Answer Key is simpler but more explicit about being an interpretation engine.  
PPN is more powerful, but it now needs clearer algorithm provenance so the outputs are not just persuasive, but auditable and bulletproof. ([PD Answer Key](https://pd-answer-key.com/))

What do you want me to do next, audit the implied PPN algorithms report by report, or draft a formal algorithm taxonomy for the platform?

Concise answer

PPN should stop treating reports as static documents and start treating them as governed analytical products.

That means every important statement in a report should be one of six things, clearly labeled under the hood:

1. captured fact  
2. derived metric  
3. threshold-based rule  
4. benchmark comparison  
5. probabilistic inference  
6. clinician attestation

Right now, the sample pack shows strong reporting structure, but too many outputs look authoritative without exposing how they were produced. That is the main gap. The adverse event report, medical necessity letter, research export, safety plan, session timeline, and transport plan all show valuable outputs, but the reasoning path is mostly hidden.

Below is the more specific version of what I recommend.

## **1\. Build an algorithm taxonomy first**

Do not start with charts or UI polish. Start with a controlled taxonomy.

Every computed output in PPN should be assigned to one algorithm class.

| Algorithm class | What it does | Example from sample pack | Risk if undefined |
| ----- | ----- | ----- | ----- |
| Rule engine | Applies deterministic logic | “No Regulatory Reporting Required” after Grade 2 event | Users trust a rule they cannot inspect |
| Scoring engine | Calculates scale results and deltas | PHQ-9 drop from 22 to 6, response/remission flags | Different users may define response differently |
| State engine | Assigns workflow phase or status | onset, peak, integration, afterglow, safe transport | Phase labels start looking more precise than they are |
| Benchmark engine | Compares cohort or site vs network | Safety 88 vs 82, Retention 94 vs 85 | Benchmark math becomes opaque and possibly misleading |
| Data quality engine | Checks completeness, validity, freshness | “Data Quality 96” style output | Score becomes theater if weighting is hidden |
| Evidence engine | Grades confidence and provenance | interaction check, remission, release readiness | Strong claims appear with weak support |
| Attestation layer | Distinguishes machine output from clinician sign-off | provider sign-off, clinician attestation | Human confirmation gets conflated with automation |

### **Instruction**

Create a master registry called `algorithm_definitions`.

Suggested fields:

* `algorithm_id`  
* `algorithm_name`  
* `algorithm_class`  
* `description_plain_english`  
* `input_fields_required`  
* `input_quality_requirements`  
* `calculation_method_summary`  
* `output_fields_produced`  
* `thresholds_or_model_version`  
* `confidence_method`  
* `clinical_owner`  
* `technical_owner`  
* `last_validated_at`  
* `version`  
* `status` such as draft, validated, deprecated  
* `report_surfaces` such as AE report, research export, transport plan

This becomes the source of truth for every computed statement in the product.

## **2\. Separate facts from conclusions in every report**

This is the single most important structural change.

### **Current problem**

The reports mix observed facts with computed conclusions.

Examples:

* AE report shows BP 158/96, HR 112, CTCAE Grade 2, resolved, and “No Regulatory Reporting Required.” Some of that is observed data, some is a classification, some is a workflow rule.  
* Medical necessity letter shows PHQ-9 values over time and then “Response Achieved” and “Remission Achieved.” The graph is data. The green badges are derived conclusions.  
* Research export shows responder rate, benchmark scores, adverse event counts, and compliance scores, but not how those were calculated.

### **Fix**

For each report section, use this structure internally and optionally visibly:

**A. Observed data**  
What was directly entered, measured, or captured.

**B. Derived results**  
What was calculated from those observations.

**C. Governing logic**  
What rule, threshold, or model produced the result.

**D. Confidence / completeness**  
Whether the result is high confidence, partial, provisional, or blocked.

### **Example: adverse event report**

#### **Inputs**

* systolic BP \= 158  
* diastolic BP \= 96  
* HR \= 112  
* onset time \= 12:35  
* resolution time \= 13:05  
* intervention actions \= repositioning, reassurance  
* rescue medication used \= no

#### **Derived outputs**

* duration\_minutes \= 30  
* severity\_classification \= CTCAE Grade 2  
* resolution\_status \= resolved  
* regulatory\_notification\_required \= no

#### **Logic metadata**

* `severity_classification_rule = CTCAE_BP_HYPERTENSION_V1`  
* `regulatory_rule = AE_NOTIFY_GRADE3PLUS_V1`  
* `resolution_rule = BP_NORMALIZED_AND_NO_ESCALATION_V1`

#### **Confidence**

* complete\_data \= yes  
* clinician\_reviewed \= yes  
* algorithm\_confidence \= deterministic  
* missing\_inputs \= none

### **How this should appear in the report**

Instead of only:

No Regulatory Reporting Required

Add a compact machine-readable footer or expandable detail:

Determination basis: CTCAE Grade 2 hypertension. Current site rule sends regulatory notice only for Grade 3+ or site-defined escalations. Rule set: AE\_NOTIFY\_GRADE3PLUS\_V1. Reviewed by clinician CLN-0042.

That one line makes the output much more defensible.

## **3\. Define input contracts for each algorithm**

This is where most systems break. Not in the output, in sloppy inputs.

Every algorithm needs an input contract.

## **Example A: responder status engine**

This supports outputs like “Response Achieved” and “Remission Achieved” in the medical necessity letter.

### **Input contract**

Required:

* patient\_uuid  
* instrument\_code  
* baseline\_score  
* followup\_score  
* baseline\_date  
* followup\_date  
* minimum\_days\_since\_baseline  
* session\_count\_in\_window

Optional:

* diagnosis\_code  
* treatment\_protocol\_id  
* concurrent\_med\_change\_flag

Validation rules:

* baseline score must be first valid score before dose or protocol start  
* follow-up score must fall within accepted follow-up window  
* instrument must be valid for the diagnosis or intended outcome domain  
* missing or duplicate assessments block automated remission output

### **Output structure**

```json
{
  "algorithm_id": "OUTCOME_RESPONSE_PHQ9_V1",
  "patient_uuid": "uuid",
  "instrument_code": "PHQ9",
  "baseline_score": 22,
  "followup_score": 6,
  "absolute_change": -16,
  "percent_change": -72.7,
  "response_flag": true,
  "response_definition": ">=50% reduction from baseline",
  "remission_flag": false,
  "remission_definition": "PHQ9 < 5",
  "followup_window_days": 90,
  "data_completeness": "complete",
  "confidence": "high",
  "requires_clinician_review": false,
  "version": "1.0"
}
```

### **Plain-English output**

* Baseline PHQ-9: 22  
* Latest PHQ-9: 6  
* Change: 16-point reduction, 72.7%  
* Response: achieved  
* Remission: not achieved under current rule, because remission requires PHQ-9 less than 5

Notice something important. In your sample, “Remission Achieved” is shown with PHQ-9 \< 5 while the chart ends at 6\. That is either a mock inconsistency or a logic error. This is exactly why input-output contracts matter.

## **Example B: transport readiness engine**

This supports outputs like expected release time, earliest safe release, and checked criteria in the transport plan.

### **Input contract**

Required:

* dose\_administered\_at  
* substance\_code  
* escort\_confirmed  
* final\_orientation\_status  
* gait\_status  
* last\_vitals\_timestamp  
* last\_vitals\_normal\_flag  
* clinician\_release\_attestation

Optional:

* rescue\_med\_used  
* adverse\_event\_open\_flag  
* patient\_distress\_flag  
* transport\_mode

Validation rules:

* release cannot be auto-cleared if any AE remains unresolved  
* release cannot be auto-cleared without escort confirmation  
* release window cannot be displayed if dose time is missing  
* if rescue med given, minimum observation window changes

### **Output structure**

```json
{
  "algorithm_id": "RELEASE_READY_PSILOCYBIN_V1",
  "session_id": "SES-20260319-B2A4",
  "substance_code": "PSILOCYBIN",
  "dose_administered_at": "2026-03-19T09:48:00",
  "earliest_release_at": "2026-03-19T15:48:00",
  "expected_release_at": "2026-03-19T16:30:00",
  "release_status": "conditional_ready",
  "blocking_conditions": [],
  "required_checks": {
    "orientation_x3": true,
    "gait_unassisted": true,
    "escort_present": true,
    "final_vitals_normal": true,
    "clinician_signoff": false
  },
  "confidence": "protocol_based_not_pharmacokinetic_measurement",
  "version": "1.0"
}
```

### **Plain-English output**

* Earliest protocol-based release window begins about 6 hours after dose  
* Patient currently meets objective checklist criteria  
* Release remains pending final clinician sign-off

That wording is better than implying the timeline is a measured biological certainty.

## **4\. Add provenance to every computed field**

This is non-negotiable if you want PPN to become credible beyond internal workflow support.

Every computed field should be able to answer five questions:

1. What data produced this?  
2. What rule or model produced this?  
3. Which version was used?  
4. Was the output blocked, downgraded, or qualified by missing data?  
5. Did a clinician confirm it?

### **Recommended field pattern**

For every important computed output, store:

* `value`  
* `value_label`  
* `algorithm_id`  
* `algorithm_version`  
* `inputs_hash`  
* `computed_at`  
* `confidence_level`  
* `missing_data_flag`  
* `clinician_override_flag`  
* `override_reason`  
* `reviewed_by`  
* `reviewed_at`

### **Example**

For `regulatory_notification_required`:

```json
{
  "value": false,
  "value_label": "No Regulatory Reporting Required",
  "algorithm_id": "AE_NOTIFY_GRADE3PLUS_V1",
  "algorithm_version": "1.0",
  "confidence_level": "deterministic",
  "missing_data_flag": false,
  "clinician_override_flag": false,
  "reviewed_by": "CLN-0042",
  "reviewed_at": "2026-03-20T09:12:00"
}
```

## **5\. Stop using benchmark scores unless you can explain the denominator**

The network benchmark page is visually strong but analytically fragile. Safety, Retention, Efficacy, Adherence, Data Quality, and Compliance shown as 88 vs 82 or 100 vs 94 will get attention, but without definitions they are soft.

### **What each benchmark score must declare**

For every benchmark metric, define:

* numerator  
* denominator  
* time window  
* inclusion criteria  
* exclusion criteria  
* weighting  
* normalization method  
* minimum sample size  
* suppression rule  
* comparison population  
* update cadence

### **Example: retention score**

Bad output:

* Retention: 94 vs 85

Better output:

* Retention score: 94  
* Definition: percentage of cohort completing protocol-defined primary follow-up within 90 days  
* Cohort numerator/denominator: 39/42  
* Network comparator: 842/991  
* Minimum n met: yes  
* Risk adjustment: none  
* Version: BENCH\_RETENTION\_V1

### **Output contract**

```json
{
  "metric_id": "RETENTION_90D",
  "cohort_value": 92.9,
  "cohort_numerator": 39,
  "cohort_denominator": 42,
  "network_value": 84.9,
  "network_numerator": 842,
  "network_denominator": 991,
  "time_window_days": 90,
  "minimum_n_threshold": 30,
  "suppressed": false,
  "risk_adjusted": false,
  "benchmark_version": "1.0"
}
```

### **Instruction**

Do not show a benchmark spider chart until every spoke has an explicit metric definition and minimum-n rule.

## **6\. Add confidence language to anything that is not deterministic**

Right now, several outputs sound more certain than they should.

Examples from the pack:

* “Interaction check: clear”  
* “Response Achieved”  
* “Remission Achieved”  
* “Earliest safe release”  
* phase labels like onset, peak, integration, afterglow

Some of those can be deterministic. Some cannot.

### **Recommended confidence labels**

Use only a small set:

* Deterministic  
* Rule-based  
* Estimated  
* Provisional  
* Clinician-confirmed  
* Suppressed due to low data  
* Not computable

### **Example rewrites**

Instead of:

* Interaction check: clear

Use:

* No flagged interaction under current screening rule set  
* Evidence basis: medication washout documented, no active contraindicated agents recorded  
* Confidence: provisional, dependent on accurate medication list

Instead of:

* Earliest safe release \~6h post-dose

Use:

* Earliest protocol-based release window begins around 6h post-dose  
* This is a workflow estimate, not a direct pharmacokinetic measurement

Instead of:

* Remission Achieved

Use:

* Remission flag: no under current PHQ-9 rule  
* Current score 6, remission threshold \<5

Again, your sample badge and chart do not currently agree. Fix that before anything public-facing.

## **7\. Treat state transitions as explicit engine outputs**

PPN has a phase problem. You are already modeling onset, peak, integration, afterglow, descent, safe transport, and safety events. That is good. But phase assignment should not be implied by a pretty timeline. It should be formal.

### **Define a session state engine**

Possible states:

* scheduled  
* intake\_complete  
* cleared\_for\_dose  
* dose\_administered  
* onset  
* active\_peak  
* peak\_with\_monitoring  
* integration\_window  
* extended\_monitoring  
* ready\_for\_transport\_check  
* cleared\_for\_release  
* closed  
* followup\_due

### **Inputs**

* scheduled time  
* actual dose time  
* adverse event status  
* vitals thresholds  
* observation events  
* rescue medication flag  
* final checklist completion  
* clinician sign-off

### **Outputs**

* `current_state`  
* `state_started_at`  
* `state_reason`  
* `state_confidence`  
* `next_required_action`

### **Example**

```json
{
  "session_id": "SES-20260319-B2A4",
  "current_state": "extended_monitoring",
  "state_started_at": "2026-03-19T13:05:00",
  "state_reason": "Resolved Grade 2 AE, protocol requires 30 additional minutes of monitoring",
  "state_confidence": "rule-based",
  "next_required_action": "Repeat vitals before transport readiness evaluation"
}
```

That would make the timeline report much more useful operationally than a static event ledger alone.

## **8\. Introduce a report assembly layer**

Do not let reports directly query raw source tables and improvise.

Each report should be assembled from:

1. source facts  
2. algorithm outputs  
3. attestation fields  
4. audit metadata

### **Suggested structure**

#### **Report bundle object**

```json
{
  "report_type": "adverse_event_report",
  "report_id": "AE-20260319-B7F3",
  "subject_scope": "single_session",
  "facts": {...},
  "derived_results": {...},
  "attestations": {...},
  "audit": {...},
  "render_version": "2.2"
}
```

### **Instruction**

For each report type, create a schema:

* AE report schema  
* medical necessity report schema  
* research export schema  
* safety plan schema  
* session timeline schema  
* transport plan schema

That gives you stable rendering and prevents hidden logic from leaking into the presentation layer.

## **9\. Recommended input and output structures by report**

## **A. Adverse Event Report**

### **Inputs**

* session\_id  
* patient\_uuid  
* event\_type  
* onset\_time  
* observed vitals  
* symptoms observed  
* interventions performed  
* resolution\_time  
* rescue medication used  
* notified parties  
* clinician review

### **Outputs**

* CTCAE grade  
* event duration  
* resolved flag  
* notification requirement  
* sign-off status  
* audit trail

### **Best practice**

Show:

* measured values  
* grading rule used  
* notification threshold used  
* whether anything was manually overridden

## **B. Medical Necessity Letter**

### **Inputs**

* diagnosis code  
* baseline severity scores  
* prior failed treatments  
* protocol details  
* follow-up scores  
* documented safety events  
* clinician rationale text

### **Outputs**

* severity category  
* treatment-resistant flag  
* response flag  
* remission flag  
* safety summary  
* clinician attestation

### **Best practice**

Any payer-facing claim should distinguish:

* observed score trajectory  
* computed response status  
* clinician-authored medical judgment

## **C. Research Outcomes Export**

### **Inputs**

* cohort definition  
* date window  
* included diagnoses  
* included substances  
* de-identification rules  
* outcome instruments  
* benchmark population  
* adverse event inclusion rules

### **Outputs**

* cohort n  
* demographic distributions  
* baseline/final means  
* average change  
* responder rate  
* AE counts  
* benchmark comparisons  
* provenance block

### **Best practice**

Every aggregate metric should have:

* numerator  
* denominator  
* minimum n  
* suppression rule  
* version

## **D. Safety Plan**

### **Inputs**

* intake vitals  
* active meds  
* medication washout data  
* prior panic episodes  
* cardiac risk factors  
* rescue protocol  
* emergency contacts

### **Outputs**

* risk flags  
* severity labels  
* monitoring plan  
* rescue criteria  
* pre-session checklist

### **Best practice**

Do not write “interaction check: clear” unless you also store:

* full med reconciliation timestamp  
* interaction engine version  
* evidence confidence  
* missing med data flag

## **E. Session Timeline**

### **Inputs**

* dose time  
* vital timestamps  
* observation notes  
* safety event timestamps  
* clinician actions  
* closure time

### **Outputs**

* plotted phase bands  
* vitals state transitions  
* event ledger  
* escalation markers  
* delay or extension flags

### **Best practice**

Keep phase bands labeled as protocol-guided estimates unless they are directly measured.

## **F. Transport Plan**

### **Inputs**

* escort identity and confirmation  
* final vitals  
* final orientation  
* gait  
* session close status  
* adverse event status  
* emergency plan reviewed  
* no-driving acknowledgement

### **Outputs**

* release window  
* transport authorization  
* readiness checklist  
* sign-off status

### **Best practice**

Do not equate “release window reached” with “safe to discharge.” Those are separate outputs.

## **10\. What to implement first**

This needs to be sequenced properly.

### **Phase 1: Governance**

Create:

* algorithm registry  
* metric definitions registry  
* report schema registry  
* confidence label vocabulary  
* clinician override rules

### **Phase 2: High-risk outputs**

Fix the outputs that carry the most liability first:

* adverse event grading  
* regulatory notification logic  
* interaction-check wording  
* remission/response logic  
* release readiness logic

### **Phase 3: Benchmarking**

Only after the above:

* define network metrics  
* define comparator populations  
* implement minimum-n suppression  
* add benchmark explanation panels

### **Phase 4: UX surfacing**

Then expose:

* “How this was calculated”  
* “Data completeness”  
* “Clinician reviewed”  
* “Algorithm version”

Not everywhere. Only on the outputs that matter.

## **11\. A clean output labeling system for the UI**

Use a small, consistent labeling layer.

### **Display badges**

* Observed  
* Calculated  
* Rule-based  
* Estimated  
* Clinician-confirmed  
* Benchmark  
* Provisional

### **Example**

For the AE page:

* BP 158/96, Observed  
* CTCAE Grade 2, Rule-based  
* Duration 30 min, Calculated  
* No Regulatory Reporting Required, Rule-based  
* Record accurate and complete, Clinician-confirmed

That alone will improve trust and readability.

## **12\. My blunt recommendation**

Do not build more reports until you formalize the analytical layer.

Your sample pack already proves you can render convincing documents. The next step is not more design. It is analytical governance.

The fastest serious upgrade would be:

1. create the algorithm registry  
2. create field-level provenance for computed outputs  
3. fix internal inconsistencies like remission logic  
4. redefine benchmark scores with explicit numerators and denominators  
5. surface confidence and review state on all high-stakes outputs

That gets you closer to a real clinical intelligence platform and farther away from report theater.

Question: do you want me to turn this into a platform-wide algorithm specification template you can reuse for every PPN calculation?

Concise answer

Yes. Below is a platform-wide algorithm specification template for PPN Portal that you can reuse for every calculation, rule, score, benchmark, and status determination in the system.

Use this as the required standard before any algorithm is considered production-ready.

# **PPN Platform-Wide Algorithm Specification Template**

## **1\. Purpose of this template**

This template forces every algorithm in PPN to answer the same questions:

1. What problem does it solve?  
2. What exact inputs does it require?  
3. What exact outputs does it produce?  
4. What logic does it apply?  
5. How should confidence, missing data, and overrides be handled?  
6. Where is it shown in the UI or reports?  
7. Who owns it clinically and technically?  
8. How is it validated and versioned?

That is how you make the system auditable, stable, and safe.

## **2\. When this template must be used**

Use this template for all of the following:

1. Adverse event grading  
2. Regulatory reporting determination  
3. Outcome response and remission flags  
4. Contraindication and interaction screening  
5. Release readiness and transport logic  
6. Session state transitions  
7. Cohort metrics  
8. Benchmark comparisons  
9. Data quality scores  
10. Compliance flags  
11. Risk stratification outputs  
12. Any label that sounds authoritative

If a report contains a conclusion and no matching algorithm spec exists, that output should not be trusted.

# **3\. Master Template**

## **A. Algorithm Identity**

| Field | Required | Description | Example |
| ----- | ----- | ----- | ----- |
| algorithm\_id | Yes | Unique system ID | AE\_NOTIFY\_GRADE3PLUS\_V1 |
| algorithm\_name | Yes | Plain-English name | Regulatory Notification Determination |
| algorithm\_class | Yes | Type of algorithm | rule\_engine |
| status | Yes | draft, validated, deprecated | validated |
| version | Yes | Semantic or internal version | 1.0 |
| clinical\_owner | Yes | Responsible clinical lead | Medical Director |
| technical\_owner | Yes | Responsible technical lead | Data Systems Lead |
| last\_validated\_at | Yes | Date last validated | 2026-03-24 |
| next\_review\_due | Yes | Scheduled review date | 2026-09-24 |

## **B. Business and Clinical Purpose**

| Field | Required | Description |
| ----- | ----- | ----- |
| purpose\_summary | Yes | One-sentence explanation of what the algorithm does |
| business\_need | Yes | Why the platform needs it |
| clinical\_need | Yes | Why the clinical workflow needs it |
| user\_facing\_value | Yes | What benefit the user sees |
| non\_goals | Yes | What it is explicitly not intended to do |

Example:

| Field | Example |
| ----- | ----- |
| purpose\_summary | Determines whether a recorded adverse event requires regulatory notification under the active site rule set |
| business\_need | Standardizes reporting logic and reduces inconsistent escalation |
| clinical\_need | Helps staff identify which events require formal reporting |
| user\_facing\_value | Gives a clear reporting status in the AE report |
| non\_goals | Does not replace legal or regulatory review |

## **C. Algorithm Type and Interpretation Class**

Use one of these controlled values:

| Field | Allowed Values |
| ----- | ----- |
| algorithm\_class | rule\_engine, scoring\_engine, state\_engine, benchmark\_engine, data\_quality\_engine, evidence\_engine, classification\_engine |
| interpretation\_class | observed\_fact, calculated\_metric, rule\_based\_determination, estimated\_state, benchmark\_comparison, clinician\_attested\_result |

This matters because users should not confuse a measured fact with an inferred conclusion.

## **D. Input Contract**

### **Required Input Fields**

| Field Name | Type | Required | Source Table | Allowed Values / Format | Validation Rule |
| ----- | ----- | ----- | ----- | ----- | ----- |
| session\_id | uuid | Yes | log\_clinical\_records | valid uuid | Must exist |
| systolic\_bp | integer | Yes | log\_session\_vitals | 50-300 | Must be latest qualifying reading |
| diastolic\_bp | integer | Yes | log\_session\_vitals | 20-200 | Must be latest qualifying reading |
| event\_type\_code | text | Yes | log\_safety\_events | controlled vocabulary | Must map to event dictionary |

### **Optional Input Fields**

| Field Name | Type | Optional | Source Table | Use Condition |
| ----- | ----- | ----- | ----- | ----- |
| rescue\_medication\_used | boolean | Yes | log\_safety\_events | Used only for certain escalation rules |
| clinician\_override\_reason | text | Yes | audit layer | Populated only if override occurs |

### **Input Preconditions**

List all assumptions that must be true before the algorithm runs.

Example:

1. Session must exist.  
2. At least one qualifying vitals record must exist.  
3. Event timestamp must be after dose time if the rule is session-dependent.  
4. Required coding dictionaries must be loaded.  
5. Inputs must pass range validation.

### **Input Failure Handling**

| Failure Case | System Behavior |
| ----- | ----- |
| Missing required input | Output blocked |
| Duplicate baseline score | Output provisional or blocked |
| Out-of-range value | Validation error |
| Unknown vocabulary code | Output blocked and logged |
| Partial medication list | Mark as provisional |

## **E. Output Contract**

### **Primary Outputs**

| Output Field | Type | Description | Example |
| ----- | ----- | ----- | ----- |
| regulatory\_notification\_required | boolean | Whether the event requires notification | false |
| regulatory\_status\_label | text | Human-readable label | No Regulatory Reporting Required |
| algorithm\_confidence | text | Confidence class | deterministic |
| review\_required | boolean | Whether clinician review is required | false |

### **Secondary Outputs**

| Output Field | Type | Description |
| ----- | ----- | ----- |
| algorithm\_id | text | Source algorithm ID |
| algorithm\_version | text | Source algorithm version |
| inputs\_hash | text | Hash of normalized inputs |
| computed\_at | timestamp | Computation timestamp |
| missing\_data\_flag | boolean | Whether inputs were incomplete |
| clinician\_override\_flag | boolean | Whether output was overridden |

### **Output Interpretation Rules**

Every output must state whether it is:

1. observed  
2. calculated  
3. rule-based  
4. estimated  
5. benchmarked  
6. clinician-confirmed

Do not let the UI hide this distinction.

## **F. Plain-English Logic Summary**

Write the logic in language a non-technical stakeholder can understand.

Example:  
If an adverse event is graded below the reporting threshold and no site-specific escalation trigger is present, the system labels the event as not requiring regulatory notification. If data are incomplete or the site has stricter custom rules, the result is provisional or review-required.

This section prevents the algorithm from becoming an opaque black box.

## **G. Formal Logic Specification**

Use clear pseudo-logic, not vague narrative.

Example:

```
IF ctcae_grade >= 3
THEN regulatory_notification_required = true

ELSE IF site_custom_escalation_flag = true
THEN regulatory_notification_required = true

ELSE IF required_inputs_missing = true
THEN regulatory_notification_required = null
AND review_required = true

ELSE regulatory_notification_required = false
```

## **H. Thresholds, Definitions, and Controlled Vocabulary**

| Term | Definition |
| ----- | ----- |
| Response | At least 50% reduction from baseline score |
| Remission | PHQ-9 score less than 5 |
| Grade 2 | Site-defined or CTCAE-defined moderate event threshold |
| Ready for release | Protocol checklist complete plus clinician sign-off |

This section must be explicit. Never assume everyone means the same thing by words like response, remission, retention, or low risk.

## **I. Confidence and Evidence Rules**

Use a controlled vocabulary only.

| Confidence Value | Meaning |
| ----- | ----- |
| deterministic | Result comes from complete rule-based logic |
| rule\_based | Result comes from a rule set but may depend on workflow assumptions |
| estimated | Result uses timing, approximation, or non-direct signals |
| provisional | Result is partially computable but data are incomplete |
| suppressed | Result intentionally hidden due to low n or weak data |
| clinician\_confirmed | Result was explicitly reviewed and affirmed by a clinician |
| not\_computable | Output cannot be safely produced |

### **Confidence assignment example**

| Condition | Confidence |
| ----- | ----- |
| All required fields present, deterministic rule | deterministic |
| Timing-based phase assignment | estimated |
| Missing medication reconciliation | provisional |
| Small sample benchmark below threshold | suppressed |

## **J. Missing Data and Override Rules**

### **Missing Data Policy**

| Missing Data Scenario | Output Behavior |
| ----- | ----- |
| Missing baseline score | Block response calculation |
| Missing follow-up score | Block remission calculation |
| Missing escort confirmation | Block release readiness |
| Missing AE resolution time | Mark duration as not computable |

### **Override Policy**

| Field | Rule |
| ----- | ----- |
| override\_allowed | yes/no |
| override\_roles | which roles may override |
| override\_reason\_required | yes/no |
| override\_audit\_required | yes/no |
| override\_expires | whether override must be re-reviewed |

Example:  
A clinician may override automated release readiness, but must enter a reason, and the system must log who changed it and when.

## **K. Provenance and Audit Requirements**

Every algorithm should produce or attach:

| Field | Purpose |
| ----- | ----- |
| algorithm\_id | identifies the source logic |
| algorithm\_version | identifies exact logic version |
| computed\_at | timestamp |
| inputs\_hash | proves what input set was used |
| source\_record\_ids | identifies source records |
| reviewed\_by | records clinician review |
| reviewed\_at | timestamp of review |
| override\_flag | marks manual change |
| override\_reason | explains manual change |

If this metadata does not exist, you do not have a reliable analytical product.

## **L. UI and Report Surfaces**

| Surface | Display Requirement |
| ----- | ----- |
| AE Report | Show result label, logic basis, review state |
| Medical Necessity Letter | Show measured trajectory separately from derived status |
| Research Export | Show numerator, denominator, version, and minimum n |
| Session Timeline | Show state labels as estimated or rule-based |
| Transport Plan | Separate release window from final release authorization |

This section forces consistency across screens.

## **M. Example Display Text**

This is important. Reports often fail because the wording is sloppy.

### **Bad**

No Regulatory Reporting Required

### **Better**

No regulatory notification required under current site rule set. Basis: Grade 2 event, no escalation trigger, algorithm AE\_NOTIFY\_GRADE3PLUS\_V1, reviewed by clinician.

### **Bad**

Interaction check: clear

### **Better**

No flagged interaction under current screening rules, based on recorded medication list. Result is provisional if the medication list is incomplete.

### **Bad**

Remission Achieved

### **Better**

Remission flag: no under current PHQ-9 rule. Latest score 6\. Remission threshold is less than 5\.

## **N. Validation and QA Plan**

| Test Type | Required | Example |
| ----- | ----- | ----- |
| unit tests | Yes | Grade 2 vs Grade 3 event scenarios |
| edge case tests | Yes | Missing vitals, duplicate scores |
| regression tests | Yes | Old version vs new version comparison |
| clinical spot review | Yes | 10-chart validation by clinician |
| data integrity checks | Yes | Null and out-of-range handling |
| explainability review | Yes | Plain-English summary matches actual logic |

### **Minimum validation standard**

An algorithm should not move to validated unless it has:

1. test cases covering normal, edge, and failure conditions  
2. clinician approval  
3. stable version control  
4. matching UI/report language  
5. documented override policy

## **O. Risk and Limitation Statement**

Every spec should have a blunt limitations section.

Example:  
This algorithm standardizes reporting thresholds but does not determine legal reporting obligations in all jurisdictions. It depends on accurate event grading and may be invalid if site-specific regulatory requirements are not configured correctly.

That protects the platform from overstating certainty.

## **P. Change Log**

| Version | Date | Change | Approved By |
| ----- | ----- | ----- | ----- |
| 1.0 | 2026-03-24 | Initial validated version | Medical Director |
| 1.1 | 2026-06-01 | Added site-specific escalation trigger | Safety Committee |

# **4\. Required controlled vocabularies for the platform**

PPN should lock these vocabulary sets now.

## **Algorithm Class Vocabulary**

1. rule\_engine  
2. scoring\_engine  
3. state\_engine  
4. classification\_engine  
5. benchmark\_engine  
6. data\_quality\_engine  
7. evidence\_engine

## **Confidence Vocabulary**

1. deterministic  
2. rule\_based  
3. estimated  
4. provisional  
5. suppressed  
6. clinician\_confirmed  
7. not\_computable

## **Interpretation Class Vocabulary**

1. observed\_fact  
2. calculated\_metric  
3. rule\_based\_determination  
4. estimated\_state  
5. benchmark\_comparison  
6. clinician\_attested\_result

## **Status Vocabulary**

1. draft  
2. under\_review  
3. validated  
4. deprecated  
5. retired

# **5\. Example completed specs**

## **Example 1: Outcome Response Algorithm**

### **Algorithm Identity**

| Field | Value |
| ----- | ----- |
| algorithm\_id | OUTCOME\_RESPONSE\_PHQ9\_V1 |
| algorithm\_name | PHQ-9 Response and Remission |
| algorithm\_class | scoring\_engine |
| interpretation\_class | calculated\_metric |
| status | validated |
| version | 1.0 |

### **Purpose**

Calculates change in PHQ-9 score over time and determines response and remission status using the active platform rule.

### **Required Inputs**

* patient\_uuid  
* baseline\_phq9\_score  
* latest\_phq9\_score  
* baseline\_date  
* latest\_date

### **Logic**

```
absolute_change = latest_score - baseline_score
percent_change = (baseline_score - latest_score) / baseline_score

IF percent_change >= 0.50
THEN response_flag = true
ELSE response_flag = false

IF latest_score < 5
THEN remission_flag = true
ELSE remission_flag = false
```

### **Outputs**

* absolute\_change  
* percent\_change  
* response\_flag  
* remission\_flag  
* confidence  
* review\_required

### **Notes**

This must be blocked if baseline is missing or duplicate baseline records exist.

## **Example 2: Release Readiness Algorithm**

### **Algorithm Identity**

| Field | Value |
| ----- | ----- |
| algorithm\_id | RELEASE\_READY\_PSILOCYBIN\_V1 |
| algorithm\_name | Protocol-Based Release Readiness |
| algorithm\_class | rule\_engine |
| interpretation\_class | rule\_based\_determination |
| status | draft |
| version | 1.0 |

### **Purpose**

Determines whether a patient is eligible to enter final release review after dosing.

### **Required Inputs**

* dose\_administered\_at  
* escort\_confirmed  
* final\_orientation\_status  
* gait\_status  
* final\_vitals\_normal\_flag  
* unresolved\_ae\_flag  
* clinician\_signoff

### **Logic**

```
IF unresolved_ae_flag = true
THEN release_ready = false

ELSE IF escort_confirmed = false
THEN release_ready = false

ELSE IF final_orientation_status != "oriented"
THEN release_ready = false

ELSE IF gait_status != "stable"
THEN release_ready = false

ELSE IF final_vitals_normal_flag = false
THEN release_ready = false

ELSE IF clinician_signoff = false
THEN release_ready = conditional

ELSE release_ready = true
```

### **Output language**

Use:  
Protocol criteria met. Final release remains pending clinician sign-off.

Do not use:  
Safe to discharge

That is too absolute.

## **Example 3: Benchmark Retention Algorithm**

### **Algorithm Identity**

| Field | Value |
| ----- | ----- |
| algorithm\_id | BENCH\_RETENTION\_90D\_V1 |
| algorithm\_name | 90-Day Follow-up Retention Benchmark |
| algorithm\_class | benchmark\_engine |
| interpretation\_class | benchmark\_comparison |
| status | draft |
| version | 1.0 |

### **Required Inputs**

* cohort\_subject\_count  
* cohort\_completed\_followup\_count  
* network\_subject\_count  
* network\_completed\_followup\_count  
* time\_window\_days  
* minimum\_n\_threshold

### **Logic**

```
IF cohort_subject_count < minimum_n_threshold
THEN suppress output

ELSE cohort_rate = cohort_completed_followup_count / cohort_subject_count
network_rate = network_completed_followup_count / network_subject_count
difference = cohort_rate - network_rate
```

### **Required Display**

* cohort numerator  
* cohort denominator  
* network numerator  
* network denominator  
* minimum n threshold  
* suppression state  
* version

Without that, the benchmark should not be shown.

# **6\. Implementation instructions for PPN**

## **Step 1: Create three registries**

You need three system registries:

1. Algorithm Registry  
   Contains one row per algorithm.  
2. Metric Definition Registry  
   Contains formal definitions for terms like response, remission, retention, adherence, compliance, data quality.  
3. Report Surface Registry  
   Maps each report field or badge to its source algorithm or source fact.

## **Step 2: Tag every current report output**

Go through each existing report and tag every conclusion as one of these:

1. observed\_fact  
2. calculated\_metric  
3. rule\_based\_determination  
4. estimated\_state  
5. benchmark\_comparison  
6. clinician\_attested\_result

If a label does not fit one of those, it is vague and should be rewritten.

## **Step 3: Prioritize high-risk outputs first**

Fix these first:

1. adverse event grading  
2. regulatory notification  
3. remission and response  
4. interaction check status  
5. release readiness  
6. benchmark scores

Those are the most liability-sensitive.

## **Step 4: Add provenance to output objects**

Every computed output object should carry:

* algorithm\_id  
* algorithm\_version  
* computed\_at  
* confidence  
* missing\_data\_flag  
* clinician\_override\_flag  
* reviewed\_by  
* reviewed\_at

## **Step 5: Align report wording with logic**

This is where many products quietly fail.

Do not allow report text writers or UI designers to invent labels independently. All label language must be approved as part of the algorithm spec.

# **7\. Suggested folder or document structure**

Use this exact structure in your project docs:

## **/algorithm-specs/**

* AE\_NOTIFY\_GRADE3PLUS\_V1.md  
* OUTCOME\_RESPONSE\_PHQ9\_V1.md  
* RELEASE\_READY\_PSILOCYBIN\_V1.md  
* BENCH\_RETENTION\_90D\_V1.md

## **/metric-definitions/**

* response.md  
* remission.md  
* retention.md  
* adherence.md  
* compliance.md  
* data\_quality.md

## **/report-maps/**

* adverse\_event\_report\_map.md  
* medical\_necessity\_report\_map.md  
* research\_export\_map.md  
* session\_timeline\_report\_map.md  
* transport\_plan\_report\_map.md

## **/validation/**

* algorithm\_test\_cases.md  
* clinician\_review\_log.md  
* regression\_log.md

# **8\. Minimum standard before production use**

No algorithm should be considered production-ready unless all of these are true:

1. It has a completed spec.  
2. Inputs and outputs are formally defined.  
3. Logic is expressed in pseudo-rules.  
4. Confidence handling is defined.  
5. Missing data behavior is defined.  
6. Override rules are defined.  
7. Audit metadata is captured.  
8. Report wording is locked.  
9. Validation cases are complete.  
10. Clinical owner has approved it.

# **9\. My blunt recommendation**

PPN is at the point where analytical governance matters more than more features.

You already have enough reporting concepts to look credible. The next real step is to make the engine underneath those reports disciplined, inspectable, and consistent.

If you do this right, PPN becomes a governed clinical intelligence platform.

If you skip this, it risks becoming a polished report generator with hidden logic and soft claims.

Question: do you want the next output to be a fully filled-in spec for the 10 highest-priority PPN algorithms?

*Yes.* 

*One of my original visions for the PPN Portal was that the practitioner could compare outcomes from one patient to another patient, or to their entire clinic, or their entire network, or the entire global data set, with the ability to add or remove certain filters. We've already built in the infrastructure to handle this, so I'm mentioning it in case we want to integrate this line of thinking into this chat.* 

*Am I thinking about this the right way? What else might we be missing?*

Concise answer

Yes, the vision is directionally right, but the comparison model needs to be stricter than “patient vs patient vs clinic vs network vs global.”

The correct frame is:

1. compare like with like,  
2. compare at the right unit of analysis,  
3. expose data quality and confidence,  
4. suppress weak or unsafe comparisons,  
5. separate raw facts from adjusted benchmarks.

Otherwise the system will produce persuasive but unreliable comparisons.

The biggest thing you may be missing is this: in PPN, the comparison engine is not a nice add-on. It is one of the core product engines, and it needs its own governance just like AE grading or release readiness.

## **My direct answer to your vision**

You are thinking about it mostly the right way, but I would tighten it.

Do not think primarily in terms of:

* one patient to another patient  
* one clinic to all clinics  
* one network to global

Think in terms of:

* one episode to comparable episodes  
* one patient trajectory to similar trajectories  
* one site cohort to matched site cohorts  
* one protocol to matched protocols  
* one benchmark group to a governed reference population

That sounds subtle, but it is not.

If you compare “patient A vs patient B,” that is usually too noisy to be trustworthy.  
If you compare “this patient’s 90-day PHQ-9 trajectory after protocol X, against other patients with similar baseline severity, diagnosis group, dose band, and follow-up completeness,” that is analytically defensible.

That is the right mindset.

# **What is missing from the vision**

## **1\. Unit of analysis discipline**

You need to define what exactly is being compared.

Possible units:

1. patient lifetime  
2. treatment episode  
3. session  
4. protocol course  
5. follow-up window  
6. site cohort  
7. network cohort

This matters because the wrong unit creates junk comparisons.

Examples:

* AE rate should usually be compared at session-level or episode-level.  
* remission should usually be compared at episode or follow-up-window level.  
* retention should usually be compared at cohort level.  
* symptom trajectory should usually be compared at patient-episode level, not single session level.

### **Recommendation**

Create a required field for every benchmark or comparison metric:

* `unit_of_analysis`

Allowed values:

* `session`  
* `episode`  
* `patient`  
* `protocol_course`  
* `site_cohort`  
* `network_cohort`

## **2\. Similarity rules before patient-to-patient comparison**

Direct patient-to-patient comparison sounds intuitive, but it is one of the easiest ways to mislead practitioners.

Why it fails:

1. different diagnoses  
2. different baseline severity  
3. different protocol exposure  
4. different follow-up timing  
5. different comorbidities  
6. different medication contexts  
7. different data completeness

### **Recommendation**

Never allow “patient vs patient” unless the system first builds a comparable peer set.

That means a patient comparison engine should require:

* same or similar diagnosis family  
* similar baseline severity band  
* same primary outcome instrument  
* same comparison window  
* same or similar treatment modality  
* minimum data completeness threshold

### **Better output**

Not:

* “Compare Patient A to Patient B”

Instead:

* “Compare this patient to 28 similar episodes in the reference set”

That is much stronger.

## **3\. Baseline normalization**

Raw score changes are not enough.

A PHQ-9 drop from 24 to 12 is not directly comparable to a drop from 10 to 4 unless the system defines how it normalizes outcome change.

### **Recommendation**

For each outcome metric, define:

1. raw change  
2. percent change  
3. standardized change  
4. response threshold  
5. remission threshold  
6. time window used

Possible output fields:

* `baseline_score`  
* `latest_score`  
* `absolute_change`  
* `percent_change`  
* `z_normalized_change`  
* `response_flag`  
* `remission_flag`

Without this, comparisons will favor people who started worse or had longer follow-up.

## **4\. Time-window governance**

This is a major missing piece.

Comparisons are meaningless if one patient is measured at 2 weeks and another at 90 days.

### **Recommendation**

Lock standard windows.

Examples:

* acute session window  
* 24-hour safety window  
* 7-day early follow-up  
* 30-day follow-up  
* 90-day primary outcome  
* 180-day durability follow-up

Every comparison should declare:

* `window_type`  
* `window_start_rule`  
* `window_end_rule`

Example:

* `window_type = outcome_90d`  
* `window_start_rule = first dose in episode`  
* `window_end_rule = nearest valid assessment within day 75 to 105`

That removes silent inconsistency.

## **5\. Filter governance**

Filters are powerful, but they can also become a false-precision machine.

If users can endlessly slice the data, they will create tiny, unstable cohorts and overread noise.

### **Recommendation**

Separate filters into three classes:

### **A. Safe standard filters**

Always allowed, commonly useful.

* diagnosis family  
* protocol type  
* substance  
* baseline severity band  
* time window  
* age band  
* sex at birth if clinically justified  
* follow-up completeness

### **B. Restricted filters**

Allowed only when minimum n is met.

* medication subgroup  
* comorbidity subgroup  
* clinician-defined custom cohort  
* site type  
* prior exposure status

### **C. Admin-only or suppressed filters**

Too risky or too sparse.

* combinations that create tiny cells  
* rare diagnosis plus rare protocol plus rare event  
* intersectional slices that risk re-identification across sites

Every filtered result should carry:

* `filter_set_id`  
* `minimum_n_met`  
* `suppression_applied`  
* `data_quality_score`

## **6\. Minimum n and small-cell suppression**

This is essential for both privacy and analytical stability.

### **Recommendation**

Set minimum thresholds by output type.

Examples:

* patient similarity reference set: minimum n \= 20  
* site benchmark rate: minimum n \= 30  
* rare AE benchmark: minimum n \= 50 sessions  
* cross-site intersectional filter: stricter threshold

If threshold not met:

* suppress the value  
* show “insufficient comparison set”  
* do not fake a precise number

## **7\. Risk adjustment**

This is probably the biggest advanced feature people forget.

If one clinic treats more severe, treatment-resistant, higher-risk patients, simple clinic-vs-clinic comparisons will punish the better clinic.

### **Recommendation**

Distinguish two comparison types:

### **Unadjusted**

Simple descriptive benchmark.

* raw response rate  
* raw AE rate  
* raw retention

### **Adjusted**

Controls for case mix.

* baseline severity  
* diagnosis group  
* age band  
* prior treatment resistance  
* protocol intensity  
* comorbidity burden  
* follow-up completeness

Do not jump into complex modeling too early, but architect for it now.

Required output fields:

* `comparison_type = unadjusted | adjusted`  
* `adjustment_factors_used`  
* `adjustment_model_version`

## **8\. Missing-data handling**

This is huge in longitudinal care.

If one clinic collects follow-ups aggressively and another does not, the second clinic may appear “better” simply because missing bad outcomes are invisible.

### **Recommendation**

Every comparison result should declare:

* denominator eligibility  
* completeness rate  
* loss-to-follow-up rate  
* imputation policy, if any  
* whether missing data were excluded, flagged, or suppressed

Bad:

* “Response rate 68%”

Better:

* “Response rate 68%, based on 51 of 74 eligible episodes with valid 90-day follow-up. Follow-up completeness 68.9%.”

That is honest and useful.

## **9\. Episode construction rules**

This is a hidden but critical issue.

In PAT-style care, what counts as one episode? Where does one treatment episode end and another begin?

You have already surfaced this issue in earlier phase-of-care discussions. It directly affects comparison logic.

### **Recommendation**

Before benchmarking anything, define:

1. episode start  
2. episode end  
3. allowable session gap  
4. when a new protocol course starts  
5. how integration-only follow-ups attach to the episode  
6. whether cross-over protocols create a new episode

Without this, your cohort builder will silently mix different clinical objects.

## **10\. Benchmark hierarchy**

Your original idea mentions clinic, network, and global dataset. That is good, but the hierarchy needs rules.

### **Recommended benchmark ladder**

1. self over time  
2. patient vs similar episodes  
3. practitioner’s own site cohort  
4. practitioner’s site vs matched site cohort  
5. network benchmark  
6. global benchmark, only if governance and standardization are very strong

My blunt view: “global dataset” sounds impressive, but it is the least trustworthy layer unless the instrument definitions, coding, episode rules, and data-quality standards are tightly harmonized.

So architect for it, but do not let the product rely on it early.

# **Ten highest-priority PPN algorithms**

Below are the 10 highest-priority algorithms I would specify first, now including your comparison vision.

## **1\. Session State Engine**

### **Purpose**

Determines the current structured state of a session.

### **Inputs**

* session\_id  
* scheduled\_time  
* dose\_administered\_at  
* unresolved\_ae\_flag  
* final\_checklist\_status  
* clinician\_signoff  
* followup\_due\_dates

### **Outputs**

* current\_state  
* state\_started\_at  
* next\_required\_action  
* state\_confidence

### **Core logic**

Uses workflow timestamps, safety state, and completion rules to assign states such as:

* intake\_complete  
* dose\_administered  
* active\_monitoring  
* integration\_window  
* extended\_monitoring  
* cleared\_for\_release  
* followup\_due

### **Why it matters**

All downstream comparisons depend on correct episode and session state.

---

## **2\. Adverse Event Grading Engine**

### **Purpose**

Assigns severity grade to a safety event.

### **Inputs**

* event\_code  
* symptom details  
* vital signs  
* intervention level  
* resolution status  
* timing relative to session

### **Outputs**

* ae\_grade  
* grading\_basis  
* grading\_confidence  
* review\_required

### **Core logic**

Maps observed event features to controlled grading criteria.

### **Why it matters**

AE rates and safety comparisons collapse if grading is inconsistent.

---

## **3\. Regulatory Notification Engine**

### **Purpose**

Determines whether an AE requires notification under the active rule set.

### **Inputs**

* ae\_grade  
* event\_type  
* site escalation rules  
* seriousness criteria  
* unresolved\_flag

### **Outputs**

* notification\_required  
* notification\_basis  
* review\_required

### **Core logic**

Deterministic threshold logic plus site-level escalation rules.

### **Why it matters**

This is a high-liability output and must be auditable.

---

## **4\. Outcome Response and Remission Engine**

### **Purpose**

Calculates clinical change and threshold outcomes for a single patient episode.

### **Inputs**

* instrument\_code  
* baseline\_score  
* followup\_score  
* baseline\_date  
* followup\_date  
* episode\_id  
* accepted\_window\_rule

### **Outputs**

* absolute\_change  
* percent\_change  
* response\_flag  
* remission\_flag  
* window\_valid\_flag

### **Core logic**

Uses locked definitions per instrument and time window.

### **Why it matters**

This is the foundation for patient, site, and network benchmarking.

---

## **5\. Release Readiness Engine**

### **Purpose**

Determines whether a session is eligible for final discharge review.

### **Inputs**

* dose\_administered\_at  
* escort\_confirmed  
* final\_orientation  
* gait\_status  
* final\_vitals\_normal\_flag  
* unresolved\_ae\_flag  
* clinician\_signoff

### **Outputs**

* protocol\_release\_window  
* release\_criteria\_met  
* release\_status  
* blocking\_conditions

### **Core logic**

Rule-based discharge readiness, with clear separation between workflow readiness and clinician authorization.

### **Why it matters**

Safety-critical, visible, and easy to overstate if not governed.

---

## **6\. Cohort Builder and Filter Engine**

### **Purpose**

Constructs the exact comparison set for patient, site, network, or global analysis.

### **Inputs**

* analysis\_scope  
* unit\_of\_analysis  
* filter\_set  
* date window  
* site permissions  
* minimum\_n\_threshold  
* suppression rules

### **Outputs**

* cohort\_id  
* included\_record\_count  
* excluded\_record\_count  
* filter\_summary  
* minimum\_n\_met  
* suppression\_applied

### **Core logic**

Applies governed inclusion and exclusion criteria, not arbitrary ad hoc slicing.

### **Why it matters**

This is the backbone of the comparison vision.

### **Example output**

* Analysis scope: similar episodes  
* Unit: episode  
* Filters: diagnosis \= MDD, baseline PHQ-9 20 to 27, protocol \= psilocybin-assisted, 90-day follow-up complete  
* Included n \= 28  
* Suppression applied \= no

---

## **7\. Comparator Eligibility Engine**

### **Purpose**

Determines whether two or more groups are analytically comparable.

### **Inputs**

* cohort\_a\_summary  
* cohort\_b\_summary  
* diagnosis distribution  
* baseline severity distribution  
* protocol distribution  
* follow-up completeness  
* minimum\_n  
* overlap thresholds

### **Outputs**

* comparison\_allowed  
* comparability\_score  
* mismatch\_reasons  
* recommended\_adjustment\_needed

### **Core logic**

Prevents invalid side-by-side comparisons.

### **Why it matters**

This is what stops the product from enabling junk comparisons.

### **Example**

Patient episode vs site cohort comparison blocked because:

* diagnosis mismatch  
* baseline severity mismatch  
* only 11 valid comparator episodes

---

## **8\. Benchmark Aggregation and Suppression Engine**

### **Purpose**

Calculates site, network, and global benchmark metrics with minimum-n and privacy rules.

### **Inputs**

* cohort numerator and denominator  
* reference numerator and denominator  
* metric definition  
* minimum\_n threshold  
* suppression rules

### **Outputs**

* cohort\_value  
* reference\_value  
* difference  
* suppression\_flag  
* benchmark\_version

### **Core logic**

Produces only governed aggregates, never loose numbers.

### **Why it matters**

This controls clinic, network, and global benchmark trustworthiness.

---

## **9\. Risk Adjustment Engine**

### **Purpose**

Produces adjusted comparisons when raw cohort differences would be misleading.

### **Inputs**

* outcome metric  
* baseline severity  
* diagnosis family  
* age band  
* comorbidity burden  
* prior treatment status  
* protocol intensity  
* completeness markers

### **Outputs**

* adjusted\_value  
* unadjusted\_value  
* adjustment\_factors\_used  
* model\_version  
* adjustment\_confidence

### **Core logic**

Applies approved case-mix correction logic.

### **Why it matters**

Without this, higher-acuity clinics look worse even when care quality is better.

---

## **10\. Data Quality and Confidence Engine**

### **Purpose**

Scores whether a result is complete enough to trust and display.

### **Inputs**

* completeness of required fields  
* timing validity  
* follow-up completeness  
* duplicate/conflict flags  
* coding validity  
* override state

### **Outputs**

* data\_quality\_score  
* confidence\_label  
* missing\_data\_summary  
* display\_allowed

### **Core logic**

Controls whether results are shown as deterministic, provisional, estimated, or suppressed.

### **Why it matters**

This keeps the platform honest.

# **How to structure comparison inputs and outputs**

## **Input structure for any comparison request**

Every comparison should require this object shape conceptually:

```json
{
  "analysis_scope": "patient_vs_similar_episodes",
  "unit_of_analysis": "episode",
  "index_record_id": "EP-12345",
  "metric_id": "PHQ9_RESPONSE_90D",
  "filter_set": {
    "diagnosis_family": ["MDD"],
    "baseline_severity_band": ["severe"],
    "protocol_type": ["psilocybin_assisted"],
    "followup_window": ["90d_complete"]
  },
  "comparison_level": "network",
  "minimum_n_threshold": 20,
  "adjustment_mode": "unadjusted",
  "suppression_policy": "default"
}
```

## **Output structure for any comparison result**

```json
{
  "comparison_id": "CMP-90210",
  "metric_id": "PHQ9_RESPONSE_90D",
  "analysis_scope": "patient_vs_similar_episodes",
  "unit_of_analysis": "episode",
  "index_record_id": "EP-12345",
  "reference_cohort_id": "COH-77881",
  "index_value": 72.7,
  "reference_value": 58.4,
  "difference": 14.3,
  "difference_type": "percentage_points",
  "included_n": 28,
  "minimum_n_met": true,
  "suppression_flag": false,
  "data_quality_score": 93,
  "confidence_label": "rule_based",
  "adjustment_mode": "unadjusted",
  "algorithm_version": "2.1",
  "explanation_plain_english": "This episode improved more than the matched reference cohort on the selected 90-day outcome metric."
}
```

# **What the UI should allow, and what it should not**

## **Safe comparison UI patterns**

1. Compare this episode to similar episodes  
2. Compare this site to matched site cohorts  
3. Compare this cohort to network benchmark  
4. Toggle raw vs adjusted result  
5. Show included n and completeness

## **Unsafe comparison UI patterns**

1. Show direct patient vs patient ranking  
2. Allow unlimited free-form filter combinations without suppression  
3. Show benchmark numbers without denominators  
4. Mix different follow-up windows in the same chart  
5. Compare sites without case-mix context

# **My blunt recommendation on the feature vision**

Your instinct is strong, but the naive version of the feature would be dangerous.

The right version is not:

* “Let me compare anything to anything.”

The right version is:

* “Let me compare clinically similar, methodologically valid, sufficiently large groups using governed definitions and clear confidence labels.”

That is how this becomes a serious research and practitioner platform instead of a pretty analytics toy.

# **What else you might be missing**

Here are the additional blind spots I would watch closely:

## **1\. Instrument harmonization**

Different sites may use different outcome instruments. You need a clear policy for when outcomes can and cannot be pooled.

## **2\. Protocol harmonization**

Do not assume all “psilocybin-assisted” care is the same. Preparation intensity, session count, dose band, and integration cadence matter.

## **3\. Repeated measures dependence**

One patient may contribute multiple episodes or sessions. That can distort cohort statistics if not handled intentionally.

## **4\. Simpson’s paradox risk**

A clinic can look better overall and worse within specific subgroups, or vice versa. The product should not oversimplify.

## **5\. Practitioner interpretation**

The comparison engine needs explanation text, not just charts. Otherwise users overread small differences.

## **6\. Global-data governance**

Before you call something “global,” define:

* common schema  
* coding standard  
* minimum data quality  
* permission model  
* cross-jurisdiction policy  
* suppression rules

Without that, “global” is a marketing word, not an analytical category.

# **Recommended next sequence**

1. Lock units of analysis  
2. Lock episode construction rules  
3. Lock benchmark hierarchy  
4. Lock minimum-n and suppression policy  
5. Lock standard follow-up windows  
6. Lock outcome metric definitions  
7. Build cohort builder spec  
8. Build comparator eligibility spec  
9. Build benchmark aggregation spec  
10. Then surface the UI

Question: do you want the next step to be a concrete benchmark architecture for PPN, meaning exact comparison levels, filter classes, suppression rules, and UI behavior?

Concise answer

Yes. PPN should have a formal benchmark architecture with four layers:

1. comparison hierarchy  
2. cohort-building rules  
3. suppression and confidence rules  
4. UI guardrails

The core principle is simple:

PPN should let users compare outcomes, but only when the comparison is methodologically valid, privacy-safe, and clinically interpretable.

If you skip that discipline, the feature becomes misleading fast.

## **1\. Recommended benchmark hierarchy**

Do not treat all comparison levels as equal. They have different trust levels and different use cases.

### **Level 0: Self over time**

This is the safest and most important baseline.

Use for:

* one patient across one episode  
* one patient across repeated episodes  
* one site over calendar periods  
* one clinician over calendar periods

Example:

* PHQ-9 at baseline vs 30 days vs 90 days  
* AE rate this quarter vs last quarter

This should always be available if the underlying data exist.

### **Level 1: Index case vs similar cases**

This replaces raw patient-vs-patient comparison.

Use for:

* one patient episode compared against similar episodes  
* one session compared against similar sessions  
* one protocol course compared against similar protocol courses

Example:

* “This depression episode is being compared to 28 similar episodes with severe baseline PHQ-9, same modality, same 90-day window.”

This is the right way to do “patient comparison.”

### **Level 2: Site cohort vs site historical cohort**

Use for:

* your clinic this quarter vs your clinic last quarter  
* protocol A vs protocol B within the same site  
* morning sessions vs afternoon sessions, only if n is large enough

This is often more useful than external benchmarking because it reduces case-mix variation.

### **Level 3: Site cohort vs matched site cohorts**

Use for:

* your clinic vs clinics with similar case mix  
* your severe depression cohort vs other severe depression cohorts  
* your ketamine program vs other ketamine programs with similar follow-up completeness

This is where real benchmarking starts.

### **Level 4: Site cohort vs network benchmark**

Use for:

* broad reference comparison  
* directional benchmarking  
* operational quality review

This is useful, but only if definitions and data quality are tightly standardized.

### **Level 5: Site or network vs global benchmark**

This should be the most restricted layer, not the headline layer.

Use for:

* high-level directional context  
* mature, harmonized, governance-approved metrics only

Do not let “global” become a loose bucket full of inconsistent data.

## **2\. Units of analysis, locked now**

Every metric must declare its unit of analysis.

### **Allowed units**

* session  
* episode  
* patient  
* protocol\_course  
* site\_cohort  
* network\_cohort

### **How to use them**

#### **Session-level**

Use for:

* acute safety events  
* vitals excursions  
* rescue medication use  
* discharge delays

Do not use session-level for remission or long-term efficacy.

#### **Episode-level**

Use for:

* response  
* remission  
* symptom trajectory  
* completion of planned treatment arc

This will likely be your primary benchmarking unit for clinical outcomes.

#### **Patient-level**

Use sparingly.

Use for:

* lifetime engagement patterns  
* repeated episode count  
* long-term durability, if defined carefully

This is not usually the best unit for operational benchmarking because one patient may have multiple episodes.

#### **Protocol-course level**

Use for:

* comparing structured treatment approaches  
* dose band plus integration cadence comparisons  
* outcome by protocol design

#### **Site-cohort level**

Use for:

* clinic benchmarking  
* quality and completeness metrics  
* aggregate outcomes

#### **Network-cohort level**

Use for:

* benchmark references  
* trend monitoring across participating sites

## **3\. Episode construction rules**

This is foundational. If episode logic is loose, every benchmark built on top of it is compromised.

### **Minimum episode fields**

* episode\_id  
* patient\_uuid  
* site\_id  
* primary\_indication\_code  
* protocol\_type  
* episode\_start\_at  
* episode\_end\_at  
* index\_dose\_date  
* primary\_outcome\_window  
* completion\_status

### **You must define**

1. what starts an episode  
2. what ends an episode  
3. how many sessions may belong to one episode  
4. how long a gap is allowed before a new episode begins  
5. when a protocol change forces a new episode  
6. how follow-ups attach to an episode

### **Recommended episode logic**

An episode begins when a treatment plan is initiated for a defined indication under a defined protocol. It ends when one of the following happens:

* planned protocol course completes  
* patient stops and does not resume within the allowed gap  
* protocol materially changes  
* a new indication becomes primary  
* clinician closes the episode  
* maximum episode duration is reached under your governance rules

You need this locked before serious comparison work.

## **4\. Filter architecture**

Not all filters are equally safe.

### **Class A: Standard filters**

These should be available to most users.

* primary indication  
* substance or modality  
* protocol type  
* outcome instrument  
* baseline severity band  
* follow-up window  
* age band  
* biological sex, only if clinically justified and properly governed  
* new vs repeat patient  
* session count band  
* follow-up completeness status

These filters are usually interpretable and useful.

### **Class B: Restricted analytic filters**

Allow only if minimum n is met and permission level allows it.

* concomitant medication subgroup  
* comorbidity subgroup  
* prior hospitalization history  
* prior psychedelic exposure  
* clinician-specific cohort  
* integration intensity subgroup  
* site-type subgroup  
* referral-source subgroup

These can be useful, but they easily create tiny or biased cohorts.

### **Class C: Admin-only or suppressed filters**

These should be restricted or blocked.

* rare diagnosis plus rare protocol  
* unusual age plus medication plus AE subgroup  
* high-granularity multi-filter intersections that create small cells  
* any cross-site slice that increases re-identification risk

### **Filter rules**

Each comparison result should store:

* filter\_set\_id  
* filter\_summary  
* filter\_class  
* included\_n  
* excluded\_n  
* minimum\_n\_met  
* suppression\_flag

## **5\. Standard comparison windows**

Do not let users compare mixed time horizons without explicit labeling.

### **Recommended default windows**

* acute session window  
* 24-hour safety window  
* 7-day early follow-up  
* 30-day follow-up  
* 90-day primary outcome  
* 180-day durability follow-up

### **Every benchmark must declare**

* window\_type  
* window\_anchor  
* valid\_assessment\_range

Example:

* `window_type = outcome_90d`  
* `window_anchor = first dose in episode`  
* `valid_assessment_range = day 75 to day 105`

Without that, comparisons look cleaner than they are.

## **6\. Metric families**

PPN should separate metric families so users do not mix fundamentally different concepts.

### **A. Clinical outcome metrics**

Examples:

* PHQ-9 change  
* GAD-7 change  
* CAPS-5 change  
* response rate  
* remission rate  
* relapse rate  
* durability at 180 days

### **B. Safety metrics**

Examples:

* AE rate per 100 sessions  
* serious AE rate  
* rescue medication rate  
* hypertensive episode rate  
* session extension rate

### **C. Engagement and completion metrics**

Examples:

* completion of planned protocol  
* follow-up completion rate  
* dropout rate  
* integration completion rate

### **D. Operational quality metrics**

Examples:

* documentation completeness  
* median time to sign-off  
* missing vitals rate  
* unresolved safety event closure lag

### **E. Compliance and governance metrics**

Examples:

* consent completion rate  
* protocol deviation rate  
* late adverse-event review rate  
* audit-trail completeness

Do not put all of these on one radar chart unless every spoke is formally defined.

## **7\. Minimum-n and suppression rules**

This is essential.

### **Recommended baseline thresholds**

#### **Similar-case reference set**

* minimum n \= 20

#### **Site cohort benchmark**

* minimum n \= 30

#### **Cross-site matched benchmark**

* minimum n \= 30 per comparison cohort

#### **Rare AE benchmark**

* minimum n \= 50 sessions, possibly higher

#### **Multi-filter subgroup comparison**

* minimum n \= 25 or stricter if cross-site

These are not magic numbers. They are governance defaults. You may adjust them by metric family.

### **Suppression behaviors**

If threshold is not met:

* do not show the exact value  
* do not show precise percentages  
* show “insufficient comparison set”  
* optionally show a broader fallback comparator if permitted

### **Example**

Instead of:

* Response rate: 75%

Show:

* Response rate not shown, comparison set below minimum size threshold  
* Try removing one or more filters

## **8\. Comparator eligibility engine**

This is one of the most important parts of the system.

Before allowing a comparison, PPN should evaluate whether the comparison is fair enough to show.

### **Required eligibility checks**

* same unit of analysis  
* compatible outcome instrument  
* compatible time window  
* acceptable case-mix similarity  
* minimum n met  
* acceptable follow-up completeness  
* no active suppression rule triggered

### **Comparability result**

Each attempted comparison should return:

* comparison\_allowed  
* comparability\_score  
* mismatch\_reasons  
* required\_adjustment\_mode  
* suppression\_flag

### **Example mismatch reasons**

* baseline severity mismatch too large  
* diagnosis mix mismatch  
* insufficient valid follow-up  
* protocol types not comparable  
* one group below minimum n

This is what prevents the UI from encouraging junk conclusions.

## **9\. Raw vs adjusted benchmarks**

You need both, but they must be clearly separated.

### **Raw benchmarks**

Good for:

* transparency  
* quick descriptive views  
* internal trend monitoring

Examples:

* raw response rate  
* raw AE rate  
* raw retention

### **Adjusted benchmarks**

Good for:

* site-to-site comparisons  
* fairer quality comparisons  
* case-mix-aware interpretation

Possible adjustment factors:

* baseline severity  
* diagnosis family  
* age band  
* prior treatment resistance  
* session count  
* protocol intensity  
* comorbidity burden  
* follow-up completeness

### **UI rule**

Never blend raw and adjusted values into one unlabeled number.

Show:

* raw rate  
* adjusted rate  
* adjustment factors used  
* model version  
* adjustment confidence

## **10\. Missing-data policy**

This is where many benchmark systems quietly lie.

### **Every displayed metric should declare**

* eligible denominator  
* observed numerator  
* completeness rate  
* loss-to-follow-up rate  
* missing-data handling policy

### **Example**

Not:

* 68% response rate

Instead:

* 68% response rate among episodes with valid 90-day follow-up  
* Eligible episodes: 74  
* Valid follow-up: 51  
* Follow-up completeness: 68.9%

That is the kind of honesty the platform needs.

## **11\. Recommended benchmark result object**

This is the conceptual structure every comparison output should follow.

```json
{
  "comparison_id": "CMP-001",
  "metric_id": "PHQ9_RESPONSE_90D",
  "metric_family": "clinical_outcomes",
  "unit_of_analysis": "episode",
  "comparison_level": "site_vs_matched_sites",
  "index_cohort_id": "COH-SITE-001",
  "reference_cohort_id": "COH-MATCH-014",
  "window_type": "outcome_90d",
  "filter_set_id": "FS-204",
  "filter_summary": {
    "diagnosis_family": ["MDD"],
    "baseline_severity_band": ["severe"],
    "protocol_type": ["psilocybin_assisted"],
    "followup_complete": true
  },
  "index_value": 64.2,
  "reference_value": 58.7,
  "difference": 5.5,
  "difference_unit": "percentage_points",
  "comparison_type": "adjusted",
  "adjustment_factors_used": [
    "baseline_severity_band",
    "age_band",
    "prior_treatment_resistance"
  ],
  "included_n_index": 53,
  "included_n_reference": 411,
  "minimum_n_met": true,
  "suppression_flag": false,
  "completeness_index": 0.81,
  "completeness_reference": 0.84,
  "confidence_label": "rule_based",
  "comparability_score": 0.88,
  "algorithm_version": "1.0",
  "plain_english_summary": "Your site's adjusted 90-day response rate is modestly above the matched-site reference set."
}
```

## **12\. UI behavior rules**

The UI is where this can become either powerful or dangerous.

### **A. Default workflow**

The user should not start with a blank analytics sandbox.

Start with:

1. choose metric family  
2. choose metric  
3. choose comparison level  
4. choose standard filters  
5. system validates cohort size and comparability  
6. system returns result or asks user to broaden filters

This is better than letting them slice the entire warehouse immediately.

### **B. Comparison cards should always show**

* metric definition  
* unit of analysis  
* time window  
* included n  
* completeness  
* raw vs adjusted label  
* confidence label  
* filter summary

### **C. If comparison is weak**

Do not show a confident chart.

Show:

* why the comparison is weak  
* what caused suppression  
* what the user can change

### **D. If user applies too many filters**

The system should warn before execution:

* “This filter combination may create an unstable comparison set.”  
* “Minimum comparison size may not be met.”  
* “Some results may be suppressed.”

### **E. Patient-level UI**

Do not show a leaderboard feel.

Use:

* “similar episode reference group”  
* “expected range”  
* “matched cohort”  
* “trajectory context”

Do not use:

* “top performer”  
* “better than patient X”  
* rank-order language

## **13\. Recommended UI views**

### **View 1: Patient episode context**

Shows:

* patient trajectory  
* similar-episode reference band  
* selected outcome at 30 and 90 days  
* completeness note  
* case-match summary

### **View 2: Site benchmark dashboard**

Shows:

* outcomes  
* safety  
* completion  
* documentation quality  
* raw and adjusted views  
* quarter-over-quarter trend

### **View 3: Cohort builder**

Shows:

* active filters  
* included n  
* excluded n  
* suppression risk  
* comparability quality

### **View 4: Benchmark detail drawer**

Shows:

* numerator  
* denominator  
* metric definition  
* version  
* adjustment factors  
* missing-data handling  
* explanation text

This drawer is critical. It is where trust comes from.

## **14\. Explanation language the system should use**

The platform should explain results in plain English.

### **Good example**

“This site’s 90-day response rate is higher than the matched-site reference set, but the comparison is based on moderate sample size and incomplete follow-up in both groups.”

### **Bad example**

“Your site is outperforming the network.”

That is too absolute and usually not justified.

### **Good example**

“This patient’s episode improved more than the similar-episode reference group on PHQ-9, based on severe baseline depression and complete 90-day follow-up.”

### **Bad example**

“This patient is doing better than other patients.”

Too vague and too simplistic.

## **15\. What you are still likely missing**

These are the hidden structural issues.

### **Instrument crosswalks**

If sites use different instruments for similar constructs, you need a policy for:

* no pooling  
* partial pooling  
* mapped construct-level comparison

### **Repeated measures dependence**

One patient contributing many sessions or episodes can distort aggregate rates. You need rules for whether comparisons are session-weighted, episode-weighted, or patient-weighted.

### **Site maturity bias**

New sites may look worse simply because their workflows are not stabilized yet. You may need a site-maturity flag before external comparison is enabled.

### **Protocol fidelity**

If one site calls something “psilocybin-assisted therapy” but runs a very different process, the benchmark can be misleading unless protocol definitions are structured.

### **Global benchmark governance**

Before “global” means anything, define:

* schema standardization  
* vocabulary standardization  
* minimum data-quality threshold  
* jurisdiction rules  
* suppression policy  
* contributor eligibility

Without that, global is mostly a label.

## **16\. Recommended implementation order**

Do not build this all at once.

### **Phase 1**

* units of analysis  
* episode rules  
* standard windows  
* metric definitions

### **Phase 2**

* cohort builder  
* filter classes  
* minimum-n rules  
* suppression rules

### **Phase 3**

* comparator eligibility engine  
* raw benchmark engine  
* completeness reporting

### **Phase 4**

* adjusted benchmark engine  
* matched-site comparisons  
* explanation drawer

### **Phase 5**

* restricted advanced filters  
* global benchmark layer  
* cross-instrument policies

## **17\. My blunt recommendation**

Yes, you are thinking about the product the right way at a high level. But the mature version of that vision is not “compare anyone to anything.”

It is this:

PPN should allow governed comparisons between clinically comparable units, using locked definitions, standard windows, minimum-n thresholds, completeness disclosures, and clear explanation text.

That is what makes the feature useful instead of seductive but unreliable.

Do you want me to turn this into a concrete PPN benchmark policy document with exact default thresholds, filter permissions by role, and UI decision rules?

