CSV BLOCK 1 HEADER

rule\_key,psychedelic\_substance,medication\_class,medication\_ingredient,otc\_rx\_flag,other\_substance\_flag,external\_code\_system,external\_code,mechanism,interaction\_type,effect\_direction,clinical\_concern,worst\_case\_concern,risk\_bucket,risk\_level\_numeric,severity\_grade,confidence,evidence\_level,washout\_relevant,washout\_note,screening\_note,class\_wide\_or\_drug\_specific,established\_vs\_theoretical,review\_status,citation\_basis\_ids,citation\_text\_short,citation\_url\_or\_identifier,source\_section,source\_quote\_short,notes\_for\_manual\_review

"RULE-001","IBOGAINE","Opioids / Methadone","Methadone","RX","N","","","Additive hERG channel blockade, CYP2D6 competition","MIXED","DANGER\_INCREASE","Torsades de Pointes, fatal arrhythmia","Fatal arrhythmia","ABSOLUTE\_CONTRAINDICATION","5","CONTRAINDICATED","HIGH","MIXED","N","","Absolute contraindication; strict ECG clearance required.","DRUG\_SPECIFIC","ESTABLISHED","ACTIVE","7;14","Case report, Mechanistic","","Section 3\. Evidence matrix","Additive hERG channel blockade",""

"RULE-002","AYAHUASCA","SSRIs","Fluoxetine, Sertraline","RX","N","","","MAO-A inhibition combined with serotonin reuptake inhibition","PD\_INTERACTION","DANGER\_INCREASE","Severe serotonin syndrome","Fatal serotonin syndrome","ABSOLUTE\_CONTRAINDICATION","5","CONTRAINDICATED","HIGH","MIXED","Y","Requires 2-5 week washout before ayahuasca administration.","Requires 2-5 week washout before ayahuasca administration.","CLASS\_WIDE","ESTABLISHED","ACTIVE","4;15;17","Case report, Consensus Guideline","","Section 3\. Evidence matrix","MAO-A inhibition combined with serotonin reuptake inhibition","Fluoxetine requires 5 weeks due to half-life"

"RULE-003","PSILOCYBIN","Mood Stabilizer","Lithium","RX","N","","","Unknown; suspected synergistic excitatory neurotoxicity","PD\_INTERACTION","DANGER\_INCREASE","Significant seizure risk (47% in observational data)","Severe seizures","ABSOLUTE\_CONTRAINDICATION","5","CONTRAINDICATED","MODERATE","OBSERVATIONAL","N","","Contraindicate psilocybin if active lithium use. Lamotrigine appears safe.","DRUG\_SPECIFIC","ESTABLISHED","ACTIVE","9","Observational, Case series","","Section 3\. Evidence matrix","suspected synergistic excitatory neurotoxicity",""

"RULE-004","MDMA","SNRIs","Venlafaxine","RX","N","","","Competitive CYP2D6 inhibition, massive 5-HT release","MIXED","DANGER\_INCREASE","Serotonin toxicity; PK toxicity amplification","Serotonin syndrome","STRONG\_CAUTION","4","MAJOR","HIGH","MIXED","Y","","High risk of cardiovascular and serotonergic overload.","CLASS\_WIDE","ESTABLISHED","ACTIVE","3;5","Clinical trial, Case report","","Section 3\. Evidence matrix","Competitive CYP2D6 inhibition, massive 5-HT release",""

"RULE-005","KETAMINE","CNS Depressants","Alprazolam, Oxycodone","RX","N","","","Synergistic CNS depression at GABA and opioid receptors","PD\_INTERACTION","DANGER\_INCREASE","Sedation, coma, respiratory depression","Respiratory arrest","STRONG\_CAUTION","4","MAJOR","HIGH","FDA\_LABEL","N","","Avoid concomitant use or adjust dosing heavily.","MIXED","ESTABLISHED","ACTIVE","11;12","FDA Label, REMS","","Section 3\. Evidence matrix","Synergistic CNS depression at GABA and opioid receptors",""

"RULE-006","LSD","Antipsychotics","Quetiapine, Olanzapine","RX","N","","","5-HT2A and D2 antagonism","EFFICACY\_BLUNTING","EFFICACY\_REDUCTION","Efficacy blunting; premature termination of trip","Premature termination of trip","POSSIBLE\_EFFICACY\_BLUNTING","2","MODERATE","HIGH","MIXED","N","","Used recreationally as trip killers; risk of over-sedation/hypotension.","CLASS\_WIDE","ESTABLISHED","ACTIVE","26;27;28","Clinical trial, Observational","","Section 3\. Evidence matrix","5-HT2A and D2 antagonism",""

"RULE-007","PSILOCYBIN","SSRIs","Escitalopram","RX","N","","","5-HT2A receptor downregulation from chronic SSRI use","EFFICACY\_BLUNTING","EFFICACY\_REDUCTION","Efficacy blunting; attenuated subjective effects","Attenuated subjective effects","POSSIBLE\_EFFICACY\_BLUNTING","2","MODERATE","HIGH","CLINICAL\_TRIAL","Y","Requires clinical decision on tapering vs. blunting.","Does not cause physical danger; requires clinical decision on tapering vs. blunting.","CLASS\_WIDE","ESTABLISHED","ACTIVE","10;29","Clinical trial, Meta-analysis","","Section 3\. Evidence matrix","5-HT2A receptor downregulation from chronic SSRI use",""

"RULE-008","MDMA","OTC Antitussives","Dextromethorphan (DXM)","OTC","N","","","Dual 5-HT reuptake inhibition and releasing agent action","PD\_INTERACTION","DANGER\_INCREASE","Severe serotonin syndrome","Fatal serotonin syndrome","ABSOLUTE\_CONTRAINDICATION","5","CONTRAINDICATED","HIGH","MIXED","Y","","Absolute contraindication. High risk among recreational and self-medicating users.","DRUG\_SPECIFIC","ESTABLISHED","ACTIVE","6;30","Case report, Mechanistic","","Section 3\. Evidence matrix","Dual 5-HT reuptake inhibition and releasing agent action",""

"RULE-009","5-MEO-DMT","MAOIs","Harmaline, Phenelzine","RX","N","","","Inhibition of deamination metabolism of 5-MeO-DMT","PK\_INTERACTION","DANGER\_INCREASE","Serotonin syndrome, prolonged systemic exposure","Fatal serotonin syndrome","ABSOLUTE\_CONTRAINDICATION","5","CONTRAINDICATED","HIGH","MIXED","Y","","Fatalities and severe toxicity reported when combined with harmala alkaloids.","CLASS\_WIDE","ESTABLISHED","ACTIVE","15;31","Case report, PK data","","Section 3\. Evidence matrix","Inhibition of deamination metabolism of 5-MeO-DMT",""

"RULE-010","KETAMINE","Thyroid Meds","Levothyroxine","RX","N","","","Unknown sympathetic synergy","PHYSIOLOGICAL\_SHIFT","DANGER\_INCREASE","Hypertension, tachycardia","Hypertensive crisis","CLINICIAN\_REVIEW","3","MODERATE","LOW","CASE\_REPORT","N","","Monitor BP and HR carefully in hyperthyroid or supplemented patients.","DRUG\_SPECIFIC","PLAUSIBLE\_BUT\_UNCERTAIN","ACTIVE","32","Case report","","Section 3\. Evidence matrix","Unknown sympathetic synergy",""

"RULE-011","KETAMINE","Diabetes Meds","Insulin, Metformin","RX","N","","","Sympathetic α2 activation increasing epinephrine, altering gluconeogenesis","PHYSIOLOGICAL\_SHIFT","BOTH","Glycemic volatility (hyper/hypoglycemia)","Severe hypoglycemia or hyperglycemia","CLINICIAN\_REVIEW","3","MODERATE","LOW","MIXED","N","","Monitor blood glucose before, during, and after infusion.","CLASS\_WIDE","LIKELY","ACTIVE","13","Preclinical, Case report","","Section 3\. Evidence matrix","altering gluconeogenesis",""

"RULE-012","LSD","Anticoagulants","Warfarin, Apixaban","RX","N","","","Peripheral 5-HT2A antagonism on platelets","PD\_INTERACTION","UNCERTAIN","Theoretical bleeding risk or anti-aggregation","Spontaneous hemorrhage","MONITOR\_ONLY","1","MILD","LOW","MECHANISTIC","N","","Largely theoretical; monitor INR but not an absolute contraindication.","CLASS\_WIDE","UNSUPPORTED","ACTIVE","33","Mechanistic theory only","","Section 3\. Evidence matrix","Peripheral 5-HT2A antagonism on platelets",""

"RULE-013","MDMA","Beta Blockers","Propranolol","RX","N","","","Unopposed alpha-receptor activation","PHYSIOLOGICAL\_SHIFT","DANGER\_INCREASE","Fails to prevent hypertension; masks tachycardia","Worsened pressor response","CLINICIAN\_REVIEW","3","MODERATE","MODERATE","CLINICAL\_TRIAL","N","","Does not reduce overall cardiovascular risk of MDMA; may worsen pressor response.","CLASS\_WIDE","LIKELY","ACTIVE","34;35","Clinical trial","","Section 3\. Evidence matrix","Unopposed alpha-receptor activation",""

"RULE-014","KETAMINE","Stimulants","Amphetamine, Methylphenidate","RX","N","","","Additive sympathomimetic effects","TOXICITY\_AMPLIFICATION","DANGER\_INCREASE","Severe hypertension, tachycardia","Hypertensive crisis","STRONG\_CAUTION","4","MAJOR","HIGH","FDA\_LABEL","N","","Monitor blood pressure rigorously; consider holding stimulant doses.","CLASS\_WIDE","ESTABLISHED","ACTIVE","11;24","FDA Label","","Section 3\. Evidence matrix","Additive sympathomimetic effects",""

"RULE-015","AYAHUASCA","Stimulants / Illicit","Cocaine, Amphetamine","BOTH","Y","","","MAO inhibition \+ massive catecholamine release","TOXICITY\_AMPLIFICATION","DANGER\_INCREASE","Hypertensive crisis, stroke, myocardial infarction","Lethal cardiovascular load","ABSOLUTE\_CONTRAINDICATION","5","CONTRAINDICATED","HIGH","MIXED","Y","","Absolute contraindication due to lethal cardiovascular load.","CLASS\_WIDE","ESTABLISHED","ACTIVE","4;36","Mechanistic, Observational","","Section 3\. Evidence matrix","MAO inhibition \+ massive catecholamine release",""

"RULE-016","MESCALINE","Antidepressants","Fluoxetine (SSRI)","RX","N","","","Receptor competition at 5-HT2A","EFFICACY\_BLUNTING","EFFICACY\_REDUCTION","Efficacy blunting","Efficacy blunting","POSSIBLE\_EFFICACY\_BLUNTING","2","MODERATE","MODERATE","OBSERVATIONAL","Y","","Likely blunts subjective effects similar to other classic psychedelics.","DRUG\_SPECIFIC","LIKELY","ACTIVE","37;38","Observational","","Section 3\. Evidence matrix","Receptor competition at 5-HT2A",""

"RULE-017","MDMA","Atypical Antidepressants","Bupropion","RX","N","","","Strong CYP2D6 inhibition","PK\_INTERACTION","DANGER\_INCREASE","Exponential increase in MDMA plasma levels; seizure risk","Seizure risk","STRONG\_CAUTION","4","MAJOR","HIGH","MIXED","Y","","High risk of toxicity amplification. Do not co-administer.","DRUG\_SPECIFIC","ESTABLISHED","ACTIVE","3","Pharmacokinetic data","","Section 3\. Evidence matrix","Strong CYP2D6 inhibition",""

"RULE-018","PSILOCYBIN","Opioids","Oxycodone, Morphine","RX","N","","","No direct pharmacodynamic overlap","UNKNOWN","UNCERTAIN","Minimal to none","Altered subjective setting","MONITOR\_ONLY","1","NEGLIGIBLE","MODERATE","OBSERVATIONAL","N","","No established contraindication, though acute pain may alter subjective setting.","CLASS\_WIDE","LIKELY","ACTIVE","18;39","Observational","","Section 3\. Evidence matrix","No direct pharmacodynamic overlap",""

"RULE-019","LSD","Benzodiazepines","Diazepam, Alprazolam","RX","N","","","GABA-A positive allosteric modulation","EFFICACY\_BLUNTING","EFFICACY\_REDUCTION","Mild efficacy blunting; anxiety reduction","Premature termination of trip","POSSIBLE\_EFFICACY\_BLUNTING","2","MILD","HIGH","MIXED","N","","Frequently used as rescue medication for challenging experiences.","CLASS\_WIDE","ESTABLISHED","ACTIVE","3;26","Observational, Guideline","","Section 3\. Evidence matrix","GABA-A positive allosteric modulation",""

"RULE-020","IBOGAINE","Antipsychotics","Haloperidol, Ziprasidone","RX","N","","","Additive QT prolongation","TOXICITY\_AMPLIFICATION","DANGER\_INCREASE","Torsades de Pointes, fatal arrhythmia","Fatal arrhythmia","ABSOLUTE\_CONTRAINDICATION","5","CONTRAINDICATED","HIGH","CONSENSUS\_GUIDELINE","N","","Absolute contraindication due to compounded cardiac risk.","DRUG\_SPECIFIC","ESTABLISHED","ACTIVE","7;40;41","Clinical Guideline","","Section 3\. Evidence matrix","Additive QT prolongation",""

"RULE-021","AYAHUASCA","Decongestants","Pseudoephedrine","OTC","N","","","MAO inhibition \+ sympathomimetic","TOXICITY\_AMPLIFICATION","DANGER\_INCREASE","Hypertensive crisis","Hypertensive crisis","ABSOLUTE\_CONTRAINDICATION","5","CONTRAINDICATED","HIGH","MIXED","Y","","High risk of OTC medication interaction. Absolute contraindication.","DRUG\_SPECIFIC","ESTABLISHED","ACTIVE","4;42","Mechanistic, Consensus","","Section 3\. Evidence matrix","MAO inhibition \+ sympathomimetic",""

"RULE-022","MDMA","Opioids","Tramadol","RX","N","","","Tramadol SNRI properties \+ MDMA 5-HT release","TOXICITY\_AMPLIFICATION","DANGER\_INCREASE","Severe serotonin syndrome, seizure","Severe serotonin syndrome","ABSOLUTE\_CONTRAINDICATION","5","CONTRAINDICATED","HIGH","MIXED","Y","","Absolute contraindication. Tramadol is uniquely dangerous among opioids here.","DRUG\_SPECIFIC","ESTABLISHED","ACTIVE","16","Case report, Mechanistic","","Section 3\. Evidence matrix","Tramadol SNRI properties \+ MDMA 5-HT release",""

"RULE-023","PSILOCYBIN","NSAIDs","Ibuprofen, Naproxen","OTC","N","","","No pathway overlap","UNKNOWN","UNCERTAIN","None","None","MONITOR\_ONLY","1","NEGLIGIBLE","HIGH","MECHANISTIC","N","","Safe for co-administration.","CLASS\_WIDE","ESTABLISHED","ACTIVE","18","Pharmacokinetic logic","","Section 3\. Evidence matrix","No pathway overlap",""

"RULE-024","5-MEO-DMT","SNRIs","Duloxetine","RX","N","","","Serotonin reuptake inhibition","TOXICITY\_AMPLIFICATION","DANGER\_INCREASE","Serotonin syndrome (lower risk than MAOI), Blunting","Serotonin syndrome","STRONG\_CAUTION","4","MAJOR","LOW","MECHANISTIC","Y","","Sparse evidence, but clinical caution dictates strong contraindication review.","CLASS\_WIDE","PLAUSIBLE\_BUT\_UNCERTAIN","ACTIVE","15;39","Mechanistic theory","","Section 3\. Evidence matrix","Serotonin reuptake inhibition",""

"RULE-025","KETAMINE","GLP-1 Agonists","Semaglutide","RX","N","","","Altered gastric emptying, neuroinflammation modulation","PHYSIOLOGICAL\_SHIFT","BOTH","Glycemic shift, unknown PK interaction","Glycemic shift","CLINICIAN\_REVIEW","3","MODERATE","LOW","MIXED","N","","Monitor glucose; risk of altered absorption of oral medications.","CLASS\_WIDE","PLAUSIBLE\_BUT\_UNCERTAIN","ACTIVE","13;43","Preclinical, Emerging","","Section 3\. Evidence matrix","Altered gastric emptying, neuroinflammation modulation",""

CSV BLOCK 2 HEADER

citation\_basis\_id,citation\_text\_short,citation\_url\_or\_identifier,evidence\_level,notes

"3","Clinical trial","","CLINICAL\_TRIAL",""

"4","Case report","","CASE\_REPORT",""

"5","Case report","","CASE\_REPORT",""

"6","Case report","","CASE\_REPORT",""

"7","Case report","","CASE\_REPORT",""

"9","Observational","","OBSERVATIONAL",""

"10","Clinical trial","","CLINICAL\_TRIAL",""

"11","FDA Label","","FDA\_LABEL",""

"12","FDA Label","","FDA\_LABEL",""

"13","Preclinical","","PRECLINICAL",""

"14","Mechanistic","","MECHANISTIC",""

"15","Case report","","CASE\_REPORT",""

"16","Case report","","CASE\_REPORT",""

"17","Consensus Guideline","","CONSENSUS\_GUIDELINE",""

"18","Observational","","OBSERVATIONAL",""

"24","FDA Label","","FDA\_LABEL",""

"26","Clinical trial","","CLINICAL\_TRIAL",""

"27","Observational","","OBSERVATIONAL",""

"28","Observational","","OBSERVATIONAL",""

"29","Meta-analysis","","MIXED",""

"30","Mechanistic","","MECHANISTIC",""

"31","PK data","","MIXED",""

"32","Case report","","CASE\_REPORT",""

"33","Mechanistic","","MECHANISTIC",""

"34","Clinical trial","","CLINICAL\_TRIAL",""

"35","Clinical trial","","CLINICAL\_TRIAL",""

"36","Observational","","OBSERVATIONAL",""

"37","Observational","","OBSERVATIONAL",""

"38","Observational","","OBSERVATIONAL",""

"39","Observational","","OBSERVATIONAL",""

"40","Clinical Guideline","","CONSENSUS\_GUIDELINE",""

"41","Clinical Guideline","","CONSENSUS\_GUIDELINE",""

"42","Consensus Guideline","","CONSENSUS\_GUIDELINE",""

"43","Emerging","","EMERGING",""