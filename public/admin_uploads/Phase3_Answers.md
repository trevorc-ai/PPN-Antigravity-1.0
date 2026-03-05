1. Which Phase 3 visualizations should populate immediately after Phase 2 ends?
Answer: Anything derived from Phase 1 (Baseline) and Phase 2 (Dosing). This specifically includes the Session Snapshot Strip, the Session Experience (MEQ vs. CEQ), and the Safety Event History. Do not use "empty states" for these if the dosing session is complete.
2. Should "Patient Journey Timeline" pre-populate with Phase 2 session events?
Answer: Yes. The chart should immediately display the Phase 1 baseline PHQ-9 score as the starting node, with the Phase 2 Dosing Session plotted as the first major event pin. The line extending into the future (Phase 3) will be dotted/projected until the patient submits their first follow-up assessment.
3. Should "Safety Event History" pull from Phase 2 log_safety_events immediately?
Answer: Absolutely Yes. This is a critical liability and clinical care feature. If the patient experienced a Grade 3 adverse event (e.g., severe panic) during dosing, the integration therapist must see that immediately upon opening Phase 3.
4. Is "Compliance" section data from a real table or placeholder?
Answer: It must be derived from a real table (specifically log_patient_flow_events). It should calculate: (Follow-up Assessments Completed) / (Follow-up Assessments Expected). If the patient just finished Phase 2, this bar should honestly read 0% until they log their first daily check-in.
5. Is "Forecasted Integration Plan" auto-generated or always manual?
Answer: Auto-generated, but manually overridable. The system should use an algorithm to propose a plan (e.g., if Phase 1 Baseline PHQ-9 is >20 AND Phase 2 Psychological Difficulty is >8, output = "High Needs: Weekly sessions for 6 weeks"). The practitioner can then click an "Edit/Override" button to adjust it based on clinical judgment.
