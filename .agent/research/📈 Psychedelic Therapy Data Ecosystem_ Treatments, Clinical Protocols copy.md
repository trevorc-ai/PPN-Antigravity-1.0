Psychedelic Therapy Data Ecosystem: Treatments, Clinical Protocols, Study Designs, Data Methodology, Safety Signals, Benchmarking, and Molecular Informatics
Concise answer The psychedelic-therapy data landscape is fragmented across three big “data universes”: clinical-trial registries and sponsor submissions (strong on protocols and prespecified outcomes, weak on patient-level access), real-world evidence and safety surveillance (strong on scale and safety signal detection, weak on causal inference and protocol detail), and molecular or receptor informatics (strong on mechanistic mapping, weak on direct clinical translation). The most analysis-ready, large-scale, publicly downloadable sources for treatment and protocol metadata are ClinicalTrials.gov derived datasets (especially the AACT relational database snapshots) and WHO ICTRP exports, while the largest public safety datasets relevant to ketamine and esketamine are FAERS and openFDA downloads. For real-world supervised psilocybin services, Oregon’s state dashboards plus standardized adverse-reaction forms, along with practice-based networks like OHSU’s OPEN and ANU’s AIPPAP registry, are the clearest emerging pipelines for longitudinal patient journey data outside trials. The most consequential “valued data components” are durable clinical outcomes, adverse events including impairment and abuse-potential-relevant events, therapist and setting fidelity, and patient-reported subjective experience measures, because regulators and clinicians have repeatedly highlighted data reliability, unblinding, and durability as limiting factors. On benchmarking, the field leans heavily on systematic reviews and meta-analyses (including Cochrane and BMJ) plus expert consensus and Delphi methods to standardize “set and setting” reporting and care quality measures.
Reasoning and rationale Psychedelic-assisted therapies behave like complex interventions: outcomes depend not only on molecule and dose, but also on psychological support, therapist skill, setting variables, and follow-up integration. That reality pushes the field toward richer, multi-modal data capture (clinical scales plus PROs plus session process measures plus safety monitoring) and toward standards that allow cross-study aggregation. Regulatory documents around MDMA-assisted therapy show, in unusually direct language, that missing or inconsistently defined adverse-event capture and limited durability data can invalidate an otherwise promising evidence package, which is a useful “stress test” for what data matters most. [1]
Relevant data sources for psychedelic therapy analysis
Clinical trial registries are the backbone for protocol-level data: they contain intervention descriptions, arms, masking and allocation, outcomes, timepoints, eligibility criteria, and (sometimes) results. ClinicalTrials.gov can be accessed via its API v2 (intended for programmatic access to study record data) and is widely mirrored into bulk-friendly structures like AACT. [2]
AACT (Aggregate Analysis of ClinicalTrials.gov), maintained by the Clinical Trials Transformation Initiative, is often the most practical “analysis-grade” entry point because it provides a consistent relational schema with row counts across 51+ tables, including outcomes, analyses, and adverse events. AACT explicitly states it includes all protocol and results data publicly available in ClinicalTrials.gov and preserves source content without cleaning, which is important for auditability but creates parsing work. [3]
WHO ICTRP is the most important cross-registry aggregator, providing single-portal access to trial registration data from multiple global registries and supporting exports (CSV or XML) under explicit terms and conditions. In practice, ICTRP accessibility can vary by mechanism, including time-limited downloads and/or request-based access for complete update feeds. [4]
EU Clinical Trials Register (EU CTR) is a major source for EU interventional medicinal-product trials and is often used to triangulate protocols and results reporting, but bulk extraction is less straightforward than AACT-style downloads. Independent analyses of EU CTR have reported that it contains information on over 40,000 trials (with this “how many” figure varying by date and inclusion scope), and data quality and availability are active research topics. [5]
ISRCTN is a smaller but relevant registry that supports export of search results to CSV and provides an XML API, making it useful for targeted protocol mining and cross-validation of trial identifiers. [6]
Academic databases are indispensable for linking protocols to peer-reviewed outcomes, methods, and measurement instruments. PubMed/MEDLINE is the most common starting point for psychedelic therapy evidence synthesis and instrument validation (for example, validated subjective experience scales). [7]
Government and regulator repositories matter because they contain “decision-grade” critiques of data completeness, bias, and safety characterization. For example, FDA advisory materials and complete response letters can reveal precisely which data components were deemed missing or unreliable, and why. In the MDMA-assisted therapy case, FDA documents highlight concerns about functional unblinding, durability, psychotherapy contribution, and adverse event capture reliability. [8]
Comparison table of trial registries and protocol-level sources
Source
Scope for psychedelic therapy
Access level
Bulk formats
Scale indicators (publicly stated)
Key strengths and limitations
AACT (CTTI)
All ClinicalTrials.gov public protocol + results elements
Free, public; direct DB access + snapshots
PostgreSQL dump and flat files; large downloads
Flat files ~2.2 GB; DB dump ~2.21 GB; refreshed daily, snapshots dated in late Jan 2026
Best single source for large-scale protocol mining and results tables; preserves raw text, so NLP and cleaning are required [9]
ClinicalTrials.gov API v2
Study record retrieval via modernized API
Public
JSON via API; legacy XML referenced in migration discussions
API v2 announced by NLM; intended for access to study record data
Official programmatic path; still requires building extraction and normalization pipelines [10]
ClinicalTrials.gov AllPublicXML
Legacy bulk XML record access used in reproducibility studies
Public
XML zip
ClinicalTrials.gov records “available … as XML files” in AllPublicXML.zip used in large-scale metadata reuse studies
Useful for full-record archival ingestion, but XML parsing and deduplication burden is high [11]
WHO ICTRP
Global trial registration aggregation across networked registries
Public portal plus governed bulk options
CSV/XML exports; additional access mechanisms
WHO describes ICTRP portal and terms; historical notes describe full dataset downloads with constraints
Best for global recall across registries; bulk access can be time-limited and terms-governed [4]
EU Clinical Trials Register
EU/EEA interventional medicinal trials
Public search
No simple AACT-like bulk feed described; often scraped
Independent analysis: “over 40,000 trials” as of Sept 2021
Critical for EU regulatory context; bulk extraction and data completeness require careful handling [5]
ISRCTN
International registry (varied geographies)
Public
CSV export of search; XML API
ISRCTN explicitly supports CSV and XML API
Strong for targeted pulls and ID crosswalks; not a complete universe of trials [6]
Valued data components and what stakeholders fight about
The field’s “most valuable data” is not just symptom change after dosing. The highest-stakes components cluster into durability, safety characterization, reproducible protocol description, and patient-centered outcomes. Regulators have made durability and safety data reliability especially explicit: FDA’s Complete Response Letter for MDMA-assisted therapy (midomafetamine) criticized the failure to collect and report events deemed “positive” or “favorable” as adverse events, arguing this undermined characterization of acute effects, impairment duration, and abuse-potential signals. [12]
That critique is more than semantics. It implies a core stakeholder principle: in psychoactive therapies, “pleasant” experiences can still be safety-relevant if they correlate with impairment, risky behavior, or abuse potential. Therefore, valued safety data includes not only “bad outcomes” but also effects relevant to impairment and misuse signals, captured consistently under trial protocol definitions. [12]
Durability is the second pillar. FDA’s CRL argued the effect was not demonstrated to be durable beyond an 18-week assessment window and described design issues in long-term follow-up that could bias durability estimates. The letter recommended future trial designs with blinded follow-up, prespecified recurrence and retreatment criteria, and at least monthly follow-up assessments. [13]
A third “valued component” is bias management, especially expectancy effects and functional unblinding. FDA documentation highlighted the risk that prior MDMA experience and high prescreening failures could amplify selection bias and expectancy, and suggested measures like excluding or minimizing prior psychedelic users, measuring participant expectancy, and assessing both participant and rater or therapist unblinding. [14]
Clinicians and researchers, in parallel, place high value on process and context variables that traditional drug trials often treat as noise: therapist competencies, preparation and integration content, and setting variables. A Delphi consensus effort in psychedelic clinical research produced consensus-based guidance for reporting “setting” variables, reflecting a collective-intelligence approach to standardizing extra-pharmacological factors. [15]
Patient-reported subjective experience measures are also valued because they can function as mediators or predictors of outcomes and help unify cross-study interpretation. The revised Mystical Experience Questionnaire (MEQ30) was validated using pooled data from controlled psilocybin experiments and analyzed with confirmatory factor analysis and structural equation modeling, illustrating how psychometrics becomes a core analytics layer in psychedelic trials. [16]
There is active debate about how much psychotherapy is “part of the drug’s label claim” versus an inseparable component of the intervention. FDA’s advisory materials on midomafetamine explicitly note that there were no data arms testing drug without psychotherapy or psychotherapy-only against no-treatment, creating uncertainty for labeling and for estimating the drug’s independent contribution. [17]
Publicly available large datasets for download
For most classic psychedelic trials, participant-level datasets are rarely publicly downloadable at scale. The largest public datasets are usually (1) registry-derived protocol metadata, (2) safety surveillance systems, and (3) molecular interaction repositories. The practical result is that many rigorous psychedelic-therapy analytics projects start with document-scale NLP and structured extraction, not raw participant-level outcomes.
AACT is currently the most straightforward “big data download” for protocol and results mining because it offers multi-gigabyte database dumps and pipe-delimited flat-file exports with recent export timestamps. [18]
BindingDB is one of the largest open molecular interaction datasets relevant to psychedelic receptor profiling. The BindingDB download portal publicly reports millions of binding measurements, provides multi-hundred-megabyte TSV and multi-gigabyte SDF downloads, and lists counts of measurements, compounds, and targets. [19]
The PDSP Ki Database is smaller but “high signal” for psychedelic receptor affinity work, providing a CSV-downloadable dataset and stating it contains 98,685 Ki values. [20]
OpenNeuro provides openly accessible neuroimaging datasets that are frequently reused for psychedelic brain-mechanism analyses, including LSD and psilocybin datasets with published accession numbers and downloadable imaging files. These datasets are not “therapy protocol” datasets, but they are often used to connect subjective experience, brain networks, and receptor maps, which is a common mechanistic thread in psychedelic therapy programs. [21]
Comparison table of large public downloads most useful for psychedelic therapy analytics
Dataset
What it contains
Download size or record scale
License / terms signal
How it is used in psychedelic therapy work
AACT snapshots (CTTI)
ClinicalTrials.gov protocol + results tables (arms, outcomes, analyses, adverse events, uploaded documents where available)
Flat files ~2.2 GB; DB dump ~2.21 GB (late Jan 2026 exports)
Public access; designed for reuse
Cohort finding for “psilocybin”, “MDMA”, “ketamine”; protocol mining; results aggregation; trend and compliance analyses [9]
ClinicalTrials.gov AllPublicXML
Full public trial records in XML
Very large archive; commonly used for whole-registry ingestion
Public reference in metadata reuse literature
Full-text protocol element extraction; building local search indices; NLP on intervention descriptions [11]
WHO ICTRP full exports
Multi-registry trial records
Full dataset availability described historically, with constraints
Explicit governed terms and conditions
Global trial landscape mapping and deduplication across registries [22]
FDA FAERS (raw)
Spontaneous adverse event reports (drugs including ketamine and esketamine)
AEs released as quarterly files; FAERS public dashboard supports query
Public data; known limitations of spontaneous reporting
Signal detection (ROR, PRR, Bayesian methods), post-market risk profiling, rare event discovery [23]
openFDA downloads
Zipped JSON downloads of selected FDA datasets via openFDA
Bulk files downloadable; JSON link index available
Public data via openFDA
Easier API-based pipelines for pharmacovigilance and labeling analytics [24]
BindingDB ligand-target affinities
Binding measurements, compound structures, target mappings
Portal reports ~3.19M measurements; TSV download hundreds of MB
Public download portal
Receptor and transporter binding profiling for psychedelic-class compounds and analogs [19]
PDSP Ki Database
Ki affinities across CNS targets
98,685 Ki values, downloadable CSV
Public resource supported by NIMH
High-quality affinity lookup and receptor selectivity benchmarking [25]
OpenNeuro psychedelic imaging datasets
Imaging + metadata for LSD and psilocybin studies
Dataset-level downloads (imaging files)
Open neuroscience data-sharing norms
Mechanistic analyses that link brain dynamics, subjective effects, and receptor maps [21]
Real-world evidence and patient journey data
Real-world evidence (RWE) for psychedelic therapy is developing unevenly across substances because only a few are legal for routine or supervised use at scale. Esketamine (Spravato) is FDA-approved and tightly controlled through dosing, monitoring, and a REMS program, which creates a structured, repeat-visit patient journey that is more “trackable” in routine care than most classic psychedelics. The Spravato label specifies an induction phase with twice-weekly dosing in Weeks 1 to 4, then maintenance with weekly dosing in Weeks 5 to 8, then individualized weekly or every-2-week dosing from Week 9 onward. [26]
The patient journey is also constrained by mandatory monitoring. Spravato labeling and REMS materials require observation for at least two hours after administration, and the REMS program overview specifies monitoring for sedation, dissociation, and respiratory depression using pulse oximetry, plus reporting suspected adverse events to the REMS. [27]
For classic psychedelics, the most visible real-world dataset pipeline in the US is Oregon’s regulated psilocybin services. Oregon Health Authority launched a public data dashboard describing safety, licensing, product sales, and demographics, and provides quarterly downloadable files and PDF dashboard archives. [28] The agency also reported early dashboard metrics (for example, clients served and recorded reactions over a defined period), indicating an emerging public health surveillance layer for supervised services. [29]
Oregon’s program also publishes standardized adverse reaction documentation guidance for facilitators, defining adverse reactions that require emergency services or medical attention, which illustrates how real-world “failure data” is operationalized in a regulated service model. [30]
A second emerging RWE model is practice-based research networks and registries designed to capture longitudinal outcomes and safety outside phase 2 and 3 trials. OHSU’s Open Psychedelic Evaluation Nexus (OPEN) describes projects including one-year follow-up surveys of clients and facilitators and a public portal for anonymous adverse event reporting, indicating a hybrid model of longitudinal PROs plus community safety monitoring. [31]
Internationally, Australia’s ANU-hosted AIPPAP Research Registry explicitly states it collects clinician- and patient-perspective data on ketamine and psychedelic-assisted psychotherapy for treatment-resistant depression and PTSD via a secure online database, aiming to enable retrospective safety and outcomes research in routine practice contexts. [32]
A practical RWE data engineering reality is that cross-site aggregation typically requires a common data model. In the broader RWE ecosystem, the OMOP Common Data Model is designed to standardize observational databases into a common structure and vocabulary to support systematic analyses, and it is a common target for EHR and claims-based psychedelic RWE when those data are available through partnerships. [33]
Failure data and safety signals
Safety and “what went wrong” evidence comes from three layers: (1) controlled trials, (2) regulator and sponsor audits or inspections, and (3) post-market and community surveillance. Each layer has distinct bias patterns.
In controlled psilocybin trials, adverse events are common, and specific categories like suicidal ideation and behavior appear in trial reporting. For example, a large randomized trial of single-dose psilocybin for treatment-resistant depression reported adverse events in most participants and explicitly listed suicidal ideation or behavior among monitored outcomes. [34] A more recent safety-focused analysis argues psilocybin could involve temporary worsening of suicidal ideation and prolonged adverse events, calling for qualitative exploration of serious adverse events and participant accounts, which underscores the need to pair quantitative scales with narrative and process data when investigating failures. [35]
For MDMA-assisted therapy, FDA’s Complete Response Letter and advisory materials provide unusually concrete “failure lessons” about data integrity. FDA stated that training materials and safety manuals defined adverse events inconsistently with the trial protocol, leading to systematic non-reporting of “positive or favorable” events and raising concerns about reliability of safety data, including the ability to characterize impairment duration and abuse signals. [12] FDA also highlighted design issues around durability follow-up, selection bias, and functional unblinding, and recommended measures such as expectancy assessment and formal unblinding assessment. [36]
This matters for any psychedelic therapy analytics program because it implies that the “failure dataset” is not limited to patient harms, it includes protocol deviations, inconsistent operational definitions, and measurement architecture that can make safety inference unreliable.
For post-market safety, FAERS is the main US open dataset capturing adverse events and medication errors reported by manufacturers, clinicians, and the public. Methodologically, FAERS is commonly analyzed using disproportionality and Bayesian signal detection methods such as reporting odds ratio, proportional reporting ratio, information component, and empirical Bayes geometric mean. [37] openFDA provides modernized downloads and APIs for some FDA datasets, supporting automated extraction pipelines in zipped JSON formats. [38]
Real-world regulated programs can create their own safety instrumentation. Oregon’s facilitator adverse reaction documentation and OPEN’s adverse event portal are examples of “designed failure data” meant to detect patterns and improve safety in supervised psilocybin services. [39]
Benchmarking, meta-analysis, and collective intelligence in psychedelic therapy
Benchmarking in this field usually happens through three mechanisms: comparative trials and endpoints, systematic reviews and meta-analyses, and consensus-driven standard setting.
On comparative effectiveness, head-to-head randomized trials exist in some areas. A notable example is the randomized trial comparing psilocybin versus escitalopram for depression, published in NEJM. [40] Such trials are valuable for benchmarking because they force explicit alignment on outcome measures, follow-up windows, and analytic plans.
On evidence aggregation, the field has a fast-growing meta-analysis layer. The BMJ published a meta-analysis finding benefit of psilocybin on depression score changes versus placebo, illustrating ongoing attempts to quantify effect sizes across heterogeneous protocols. [41] Cochrane’s review of psychedelic-assisted therapy for anxiety, depression, and existential distress in people with life-threatening diseases provides another benchmark, with explicit attention to tolerability and serious adverse events reporting across included studies. [42] For MDMA-assisted therapy, systematic reviews and meta-analyses similarly attempt to consolidate safety and efficacy across trials. [43]
Collective intelligence appears in two prominent forms: Delphi consensus and consensus workshops. A Nature Medicine Delphi consensus generated guidelines for reporting “setting” variables, indicating that extra-pharmacological context is now considered benchmark-worthy and reportable. [15] In Oregon’s regulated services context, OPEN-related work has used e-Delphi methods to define consensus measures for assessing supervised psilocybin services, reflecting a move toward quality measurement frameworks akin to other healthcare services. [44]
Benchmarking also happens through therapy fidelity measurement. MAPS developed an adherence ratings program using recorded sessions, specifying a data workflow where investigators provide video streams to a sponsor server, assigned raters submit ratings through a database, and reliability is assessed statistically across raters. [45] That infrastructure is rare in mental health trials generally, and it is particularly important in psychedelic therapy where therapist behavior and setting may materially affect outcomes.
Molecular informatics and receptor profiles for psychedelic compounds
Molecular informatics is the most “database-mature” layer of psychedelic therapy analytics because receptor binding and target interaction data has decades of infrastructure. For classic serotonergic psychedelics, receptor binding at targets such as 5-HT2A is central to mechanistic hypotheses, but modern programs increasingly use broader, multi-target profiles and integrate these with brain receptor maps.
The PDSP Ki Database is a public-domain affinity warehouse supported by NIMH PDSP and provides downloadable Ki data across GPCRs, ion channels, transporters, and enzymes; the download interface states it includes 98,685 Ki values. [25]
The IUPHAR/BPS Guide to Pharmacology is an expert-curated ligand-target interaction database with explicit bulk download options (CSV or TSV) and web services, making it suitable for reproducible receptor profile extraction workflows. [46]
ChEMBL provides very large-scale curated bioactivity datasets and documents programmatic access patterns for downloading activity endpoints, explicitly describing datasets exceeding 13 million activities. [47]
BindingDB provides large-scale binding affinity datasets, reporting millions of measurements and offering TSV and database dump downloads with clear file sizes and update timestamps. [19]
A key bridge between molecular data and clinical neurobiology is receptor density atlases. The NRU serotonin atlas provides PET and MR-based maps for multiple serotonin targets across healthy individuals and includes downloadable zip distributions. [48] This type of atlas is explicitly used in modern computational psychiatry work that links LSD and psilocybin effects to receptor-informed control theory and other network models. [49]
Open neuroscience repositories, particularly OpenNeuro and NeuroVault, provide direct access to LSD and psilocybin neuroimaging datasets and derived statistical maps that can be recombined with receptor density maps for cross-modal modeling. [50]
Data collection, analysis, and aggregation workflows that are most defensible
Psychedelic therapy data systems become “bulletproof” when they treat psychotherapy and setting as first-class data domains and when they plan for aggregation from day one.
A defensible end-to-end workflow looks like this:
Protocol design   -> Prespecify outcomes, follow-up windows, durability, and safety definitions   -> Define psychotherapy/support model, setting variables, and fidelity plan  Data capture during treatment   -> eCRF/EDC structured fields (symptoms, vitals, labs, dosing)   -> PROs (symptoms + functioning + quality of life + subjective experience scales)   -> Session process: timestamps, therapist actions, integration attendance   -> Safety: full AE capture including impairment and abuse-potential-relevant events   -> Optional: audio/video recordings for fidelity and audit  Data management   -> Coding: AEs coded in standardized terminologies; audit trails preserved   -> Data QC: query resolution, missingness tracking, protocol deviation logs   -> De-identification and access governance for sensitive session recordings  Primary analysis   -> Longitudinal models (often MMRM) for repeated symptom measures   -> Sensitivity analyses for missing data and intercurrent events   -> Bias checks: expectancy, unblinding assessment, site effects, therapist effects  Aggregation and benchmarking   -> Harmonize to standards for pooling across trials or sites   -> Meta-analysis and living reviews for cross-study effect sizes   -> RWE pipelines mapped into a common data model for observational inference
Several publicly available sources illustrate why each stage matters. AACT’s schema shows how trial registries structure outcomes, analyses, and adverse events at scale, including millions of reported adverse event rows and outcomes tables, enabling registry-level aggregation but also reflecting registry format constraints. [51] CDISC standards such as SDTM and ADaM exist specifically to streamline collection, analysis, and regulatory review, supporting aggregation and reuse across studies. [52]
Modern psychedelic trials often analyze longitudinal symptom scales using mixed models for repeated measures, and FDA advisory materials on MDMA-assisted therapy explicitly reference MMRM and sensitivity analyses like tipping point analysis and estimand framing, showing what regulators expect when unblinding and missingness are plausible. [53]
For psychotherapy fidelity and collective learning, MAPS’ adherence workflow is a concrete example of how to operationalize therapist fidelity at scale, including a “video stream to sponsor server to rater ratings database” workflow and statistical reliability checks. [45]
Finally, for patient-centered measurement, FDA’s PRO guidance emphasizes that PRO instruments are a formal method to capture treatment benefit or risk and are evaluated by FDA when used to support labeling claims, which is directly relevant to psychedelic therapies that rely heavily on subjective states. [54]
What information should I lock in for future use, especially your intended use case (regulatory submission support, investment-grade market intelligence, academic meta-research, or building a production RWE dataset)?

[1] [12] [13] [14] [36] https://maps.org/wp-content/uploads/2025/09/Lykos-CRL.pdf
https://maps.org/wp-content/uploads/2025/09/Lykos-CRL.pdf
[2] [10] ClinicalTrials.gov API Version 2.0 Now Available. 2024 Mar-Apr
https://www.nlm.nih.gov/pubs/techbull/ma24/ma24_clinicaltrials_api.html?utm_source=chatgpt.com
[3] AACT Database | Clinical Trials Transformation Initiative
https://aact.ctti-clinicaltrials.org/
[4] International Clinical Trials Registry Platform (ICTRP)
https://www.who.int/tools/clinical-trials-registry-platform?utm_source=chatgpt.com
[5] https://pmc.ncbi.nlm.nih.gov/articles/PMC9036151/
https://pmc.ncbi.nlm.nih.gov/articles/PMC9036151/
[6] https://www.isrctn.com/page/faqs
https://www.isrctn.com/page/faqs
[7] [16]  Validation of the revised Mystical Experience Questionnaire in experimental sessions with psilocybin - PMC 
https://pmc.ncbi.nlm.nih.gov/articles/PMC5203697/
[8] [17] [53] https://www.fda.gov/media/178984/download
https://www.fda.gov/media/178984/download
[9] [18] AACT Database | Clinical Trials Transformation Initiative
https://aact.ctti-clinicaltrials.org/downloads
[11] Obstacles to the reuse of study metadata in ClinicalTrials.gov
https://pmc.ncbi.nlm.nih.gov/articles/PMC7749162/?utm_source=chatgpt.com
[15] https://www.nature.com/articles/s41591-025-03685-9
https://www.nature.com/articles/s41591-025-03685-9
[19] https://www.bindingdb.org/rwd/bind/chemsearch/marvin/Download.jsp
https://www.bindingdb.org/rwd/bind/chemsearch/marvin/Download.jsp
[20] [25] https://pdspdb.unc.edu/databases/kiDownload/
https://pdspdb.unc.edu/databases/kiDownload/
[21] [50] https://openneuro.org/datasets/ds003059/versions/1.0.0
https://openneuro.org/datasets/ds003059/versions/1.0.0
[22] Downloading records from the ICTRP database
https://www.who.int/tools/clinical-trials-registry-platform/network/who-data-set/downloading-records-from-the-ictrp-database?utm_source=chatgpt.com
[23] https://pmc.ncbi.nlm.nih.gov/articles/PMC12393772/
https://pmc.ncbi.nlm.nih.gov/articles/PMC12393772/
[24] [38] https://open.fda.gov/apis/drug/event/download/
https://open.fda.gov/apis/drug/event/download/
[26] [27] https://www.accessdata.fda.gov/drugsatfda_docs/label/2019/211243lbl.pdf
https://www.accessdata.fda.gov/drugsatfda_docs/label/2019/211243lbl.pdf
[28] https://www.oregon.gov/oha/ph/preventionwellness/pages/psilocybin-data-dashboard.aspx
https://www.oregon.gov/oha/ph/preventionwellness/pages/psilocybin-data-dashboard.aspx
[29] https://www.oregon.gov/oha/erd/pages/oregon-psilocybin-services-publishes-interactive-data-dashboard.aspx
https://www.oregon.gov/oha/erd/pages/oregon-psilocybin-services-publishes-interactive-data-dashboard.aspx
[30] [39] https://www.oregon.gov/oha/PH/PREVENTIONWELLNESS/Documents/Adverse-Reaction-Requiring-Medical-Attention-or-Emergency-Services.pdf
https://www.oregon.gov/oha/PH/PREVENTIONWELLNESS/Documents/Adverse-Reaction-Requiring-Medical-Attention-or-Emergency-Services.pdf
[31] https://openpsychedelicscience.org/projects/
https://openpsychedelicscience.org/projects/
[32] https://medicine-psychology.anu.edu.au/research/research-projects/australian-interventional-pharmacotherapy-psychedelic-assisted-psychotherapy/about-the-registry
https://medicine-psychology.anu.edu.au/research/research-projects/australian-interventional-pharmacotherapy-psychedelic-assisted-psychotherapy/about-the-registry
[33] https://www.ohdsi.org/data-standardization/
https://www.ohdsi.org/data-standardization/
[34] https://www.nejm.org/doi/full/10.1056/NEJMoa2206443
https://www.nejm.org/doi/full/10.1056/NEJMoa2206443
[35] https://pmc.ncbi.nlm.nih.gov/articles/PMC11698204/
https://pmc.ncbi.nlm.nih.gov/articles/PMC11698204/
[37] Data Mining of the Public Version of the FDA Adverse ...
https://pmc.ncbi.nlm.nih.gov/articles/PMC3689877/?utm_source=chatgpt.com
[40] https://www.nejm.org/doi/full/10.1056/NEJMoa2032994
https://www.nejm.org/doi/full/10.1056/NEJMoa2032994
[41] https://www.bmj.com/content/385/bmj-2023-078084
https://www.bmj.com/content/385/bmj-2023-078084
[42] https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD015383.pub2/full
https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD015383.pub2/full
[43] https://onlinelibrary.wiley.com/doi/full/10.1002/npr2.12485
https://onlinelibrary.wiley.com/doi/full/10.1002/npr2.12485
[44] https://pubmed.ncbi.nlm.nih.gov/38888164/
https://pubmed.ncbi.nlm.nih.gov/38888164/
[45] https://maps.org/wp-content/uploads/2021/10/AdherenceRatingsManualVersion6_3AUG2021.pdf
https://maps.org/wp-content/uploads/2021/10/AdherenceRatingsManualVersion6_3AUG2021.pdf
[46] https://www.guidetopharmacology.org/download.jsp
https://www.guidetopharmacology.org/download.jsp
[47] https://chembl.gitbook.io/chembl-interface-documentation/web-services/chembl-data-web-services
https://chembl.gitbook.io/chembl-interface-documentation/web-services/chembl-data-web-services
[48] https://xtra.nru.dk/FS5ht-atlas/
https://xtra.nru.dk/FS5ht-atlas/
[49] https://www.nature.com/articles/s41467-022-33578-1
https://www.nature.com/articles/s41467-022-33578-1
[51] https://aact.ctti-clinicaltrials.org/data_dictionary
https://aact.ctti-clinicaltrials.org/data_dictionary
[52] https://www.cdisc.org/standards/foundational/sdtm
https://www.cdisc.org/standards/foundational/sdtm
[54] https://www.fda.gov/regulatory-information/search-fda-guidance-documents/patient-reported-outcome-measures-use-medical-product-development-support-labeling-claims
https://www.fda.gov/regulatory-information/search-fda-guidance-documents/patient-reported-outcome-measures-use-medical-product-development-support-labeling-claims
