/**
 * insightEngine.ts — WO-302 InsightFeedPanel Rule Engine
 * =========================================================
 * Rule-based clinical intelligence engine for PPN.
 * Converts raw practitioner data into actionable, narrative insight cards.
 *
 * RULES:
 *   - All population-level rules MUST call requireKAnonymity() before returning.
 *   - Single-patient rules (practitioner's own patient) are exempt — documented below.
 *   - Each rule returns InsightCard | null — null means rule did not trigger.
 *   - No PHI — patient references use Subject_ID (patient_link_code) only.
 *
 * k-anon: minimum 5 distinct patients for population aggregates.
 *
 * WO-699 — MV Redirect (2026-03-26):
 *   ruleFollowUpLoss   → reads mv_clinician_work_queue  (capability #1)
 *   ruleDocumentationDecay → reads mv_site_followup_compliance (capability #5)
 *                            + mv_documentation_completeness   (capability #6)
 *   runInsightEngine priority order → mv_clinician_work_queue.priority_score DESC
 */

import { supabase } from '../supabaseClient';
import { requireKAnonymity } from './analytics';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type InsightSeverity = 'SAFETY' | 'SIGNAL' | 'OPPORTUNITY' | 'REVIEW';

export interface InsightCard {
    id: string;              // stable rule identifier — used for localStorage dismiss key
    severity: InsightSeverity;
    category: string;        // e.g. "Integration Protocol", "Safety", "Documentation"
    headline: string;        // specific number + comparison — the one sentence that matters
    body: string;            // 2–3 sentences: what it means + mitigation rationale
    actionLabel: string;     // CTA button text
    actionRoute: string;     // react-router path to navigate to
    sourceNote: string;      // "Based on N=X patients · Y sessions" + any citation
    generatedAt: string;     // ISO timestamp — used to expire dismissed cards
}

// ─────────────────────────────────────────────────────────────────────────────
// Published benchmark constants (seeded values from ANALYST research, WO-231)
// These are sourced from open-access peer-reviewed publications.
// ─────────────────────────────────────────────────────────────────────────────

const BENCHMARKS = {
    /** MAPS MAPP2 Phase 3 — MDMA-PTSD response rate (Nature Medicine, 2023) */
    MDMA_PTSD_RESPONSE_RATE: 67,
    /** COMPASS COMP360 Phase 2b — Psilocybin-TRD response rate (NEJM, 2022) */
    PSILOCYBIN_TRD_RESPONSE_RATE: 37,
    /** Johns Hopkins — Psilocybin-MDD response rate (JAMA Psychiatry, 2021) */
    PSILOCYBIN_MDD_RESPONSE_RATE: 75,
    /** Unlimited Sciences naturalistic — Mixed conditions (Frontiers, 2023) */
    NATURALISTIC_RESPONSE_RATE: 68,
    /** Real-world integration session count associated with ≥71% response */
    INTEGRATION_SESSIONS_TARGET: 4,
    INTEGRATION_TARGET_RESPONSE_RATE: 71,
    /** CMC thresholds (ANALYST skill — minimum clinically meaningful change) */
    PHQ9_CMC_POINTS: 5,
    PHQ9_CMC_PCT: 50,
    CAPS5_CMC_POINTS: 10,
    GAD7_CMC_POINTS: 4,
    /** COMP360 baseline MADRS for TRD population (SD ~5.6) */
    BENCHMARK_MADRS_BASELINE: 32.8,
    BENCHMARK_PHQ9_BASELINE: 14.2, // approximate naturalistic baseline
};

// ─────────────────────────────────────────────────────────────────────────────
// Rule 1 — Integration Dropout Correlation
// Population-level: k-anon required
// ─────────────────────────────────────────────────────────────────────────────

export async function ruleIntegrationDropout(siteId: string): Promise<InsightCard | null> {
    try {
        // Get non-responders: patients with baseline + follow-up PHQ-9, change < 50%
        const { data: trajectories, error } = await supabase
            .from('log_longitudinal_assessments')
            .select('patient_uuid, phq9_score, days_post_session')
            .order('days_post_session', { ascending: true });

        if (error || !trajectories) return null;

        // Group by patient to find responders/non-responders
        const byPatient: Record<string, { baseline?: number; endpoint?: number }> = {};
        for (const row of trajectories) {
            if (!byPatient[row.patient_uuid]) byPatient[row.patient_uuid] = {};
            if (row.days_post_session <= 3) byPatient[row.patient_uuid].baseline = row.phq9_score;
            if (row.days_post_session >= 21 && row.days_post_session <= 90) {
                byPatient[row.patient_uuid].endpoint = row.phq9_score;
            }
        }

        const patients = Object.entries(byPatient).filter(
            ([, v]) => v.baseline != null && v.endpoint != null
        );
        const totalN = patients.length;

        // k-anon guard — suppress if < 5 patients have complete data
        try { requireKAnonymity(totalN, 'ruleIntegrationDropout'); } catch { return null; }

        const nonResponders = patients.filter(([, v]) => {
            const pctChange = ((v.baseline! - v.endpoint!) / v.baseline!) * 100;
            return pctChange < BENCHMARKS.PHQ9_CMC_PCT;
        });

        if (nonResponders.length === 0) return null;

        // Count integration sessions for non-responders
        const nonResponderIds = nonResponders.map(([id]) => id);
        const { data: integrationData } = await supabase
            .from('log_integration_sessions')
            .select('patient_uuid')
            .in('patient_uuid', nonResponderIds);

        if (!integrationData) return null;

        const sessionsByPatient: Record<string, number> = {};
        for (const row of integrationData) {
            sessionsByPatient[row.patient_uuid] = (sessionsByPatient[row.patient_uuid] || 0) + 1;
        }

        const avgIntegrationSessions = nonResponderIds.length > 0
            ? nonResponderIds.reduce((sum, id) => sum + (sessionsByPatient[id] || 0), 0) / nonResponderIds.length
            : 0;

        // Only trigger if avg integration sessions is below target
        if (avgIntegrationSessions >= BENCHMARKS.INTEGRATION_SESSIONS_TARGET) return null;

        const responseRate = Math.round(((totalN - nonResponders.length) / totalN) * 100);
        const benchmarkRate = BENCHMARKS.NATURALISTIC_RESPONSE_RATE;

        return {
            id: 'integration-dropout-correlation',
            severity: 'OPPORTUNITY',
            category: 'Integration Protocol',
            headline: `Response rate is ${responseRate}% — ${nonResponders.length} of ${totalN} patients averaged only ${avgIntegrationSessions.toFixed(1)} integration sessions.`,
            body: `Clinics averaging ≥${BENCHMARKS.INTEGRATION_SESSIONS_TARGET} post-session integration meetings show ${BENCHMARKS.INTEGRATION_TARGET_RESPONSE_RATE}% response rates in published real-world data vs. ${benchmarkRate}% naturalistic benchmark. Reviewing integration protocol completeness for non-responding patients is the highest-leverage improvement available.`,
            actionLabel: 'Review Integration Sessions',
            actionRoute: '/wellness-journey',
            sourceNote: `Based on n=${totalN} patients with complete PHQ-9 data · Comparison: Unlimited Sciences naturalistic study (n=8,000+, Frontiers Psychiatry 2023)`,
            generatedAt: new Date().toISOString(),
        };
    } catch {
        return null;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule 2 — Long-Duration Follow-Up Loss
// WO-699: Redirected to mv_clinician_work_queue (capability #1 — clinician priority queue)
// Single-patient rule: practitioner's own flagged patient — k-anon exempt
// Returns highest-priority overdue patient by priority_score DESC
// ─────────────────────────────────────────────────────────────────────────────

export async function ruleFollowUpLoss(siteId: string): Promise<InsightCard | null> {
    try {
        // Source: mv_clinician_work_queue (capability #1 — clinician priority queue)
        // Filter: is_overdue=true, trajectory_state != 'improving' — most critical patient first
        // Zero-state: no overdue patients → returns null gracefully
        const { data: queue, error } = await supabase
            .from('mv_clinician_work_queue')
            .select('subject_id, days_since_session, trajectory_state, priority_score, unresolved_safety_count')
            .eq('site_id', siteId)
            .eq('is_overdue', true)
            .order('priority_score', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error || !queue) return null;

        const daysSince = queue.days_since_session ?? 0;

        return {
            id: `follow-up-loss-${queue.subject_id}`,
            severity: 'SAFETY',
            category: 'Patient Follow-Up',
            headline: `A patient has no documented follow-up in ${daysSince} days since their session.`,
            body: `Clinical protocol requires 30-day reassessment for all dosing sessions. Extended time without follow-up assessment creates a gap in safety monitoring and prevents accurate outcome tracking. Schedule a check-in to maintain continuity of care.`,
            actionLabel: 'Open Patient Journey',
            actionRoute: `/wellness-journey`,
            sourceNote: `Priority score: ${queue.priority_score} · Source: mv_clinician_work_queue · Single-patient flag — privacy exempt per k-anon policy`,
            generatedAt: new Date().toISOString(),
        };
    } catch {
        return null;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule 3 — Substance-Condition Mismatch Signal
// Population-level: k-anon required (N ≥ 5 per subgroup)
// ─────────────────────────────────────────────────────────────────────────────

export async function ruleSubstanceMismatch(siteId: string): Promise<InsightCard | null> {
    // NOTE: primary_indication was removed from log_clinical_records in the schema rebuild.
    // Indications now live in log_patient_indications (patient-centric, not session-centric).
    // This rule requires a two-step join that is deferred to the P1 insightEngine rewrite.
    // TODO (P1): join log_clinical_records → log_patient_indications via patient_uuid.
    return null;
}


// ─────────────────────────────────────────────────────────────────────────────
// Rule 4 — Documentation Quality Decay
// WO-699: Redirected to mv_documentation_completeness (capability #6) +
//         mv_followup_window_compliance (capability #5)
// Population-level: k-anon via session_count >= 5 guard on MV row
// ─────────────────────────────────────────────────────────────────────────────

export async function ruleDocumentationDecay(siteId: string): Promise<InsightCard | null> {
    try {
        // Source: mv_documentation_completeness (capability #6 — documentation completeness scoring)
        // Source: mv_followup_window_compliance (capability #5 — follow-up compliance as measurable workflow)
        // Zero-state: no MV row for site → returns null gracefully
        const { data: docRow, error: docErr } = await supabase
            .from('mv_documentation_completeness')
            .select('avg_completeness_pct, session_count, missing_field_summary')
            .eq('site_id', siteId)
            .maybeSingle();

        if (docErr || !docRow) return null;

        // k-anon guard: require >= 5 sessions in MV
        const sessionCount = (docRow as any).session_count ?? 0;
        try { requireKAnonymity(sessionCount, 'ruleDocumentationDecay'); } catch { return null; }

        const avgPct = (docRow as any).avg_completeness_pct ?? null;
        if (avgPct === null || avgPct >= 0.7) return null; // Only trigger when avg completeness < 70%

        // Source: mv_followup_window_compliance (capability #5 — follow-up compliance measurable)
        const { data: followupRow } = await supabase
            .from('mv_followup_window_compliance')
            .select('overall_compliance_rate')
            .eq('site_id', siteId)
            .maybeSingle();

        const followupRate = (followupRow as any)?.overall_compliance_rate ?? null;
        const completenessScore = Math.round(avgPct * 100);
        const followupPct = followupRate !== null ? Math.round(followupRate * 100) : null;

        const followupNote = followupPct !== null
            ? ` Follow-up window compliance: ${followupPct}%.`
            : '';

        return {
            id: 'documentation-decay',
            severity: 'REVIEW',
            category: 'Documentation Quality',
            headline: `Average documentation completeness is ${completenessScore}% across ${sessionCount} sessions.`,
            body: `Incomplete session records prevent accurate outcome tracking and benchmark comparison.${followupNote} Complete documentation is the foundation of accurate clinical intelligence — priority queue, trajectory tracking, and outcome benchmarks require fully documented sessions.`,
            actionLabel: 'Review Documentation Quality',
            actionRoute: '/analytics',
            sourceNote: `Based on n=${sessionCount} sessions · Source: mv_documentation_completeness, mv_followup_window_compliance`,
            generatedAt: new Date().toISOString(),
        };
    } catch {
        return null;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule 5 — Benchmark Outperformance
// Population-level: k-anon required
// ─────────────────────────────────────────────────────────────────────────────

export async function ruleBenchmarkOutperformance(siteId: string): Promise<InsightCard | null> {
    try {
        const { data: trajectories, error } = await supabase
            .from('log_longitudinal_assessments')
            .select('patient_uuid, phq9_score, days_post_session')
            .order('days_post_session', { ascending: true });

        if (error || !trajectories) return null;

        const byPatient: Record<string, { baseline?: number; endpoint?: number }> = {};
        for (const row of trajectories) {
            if (!byPatient[row.patient_uuid]) byPatient[row.patient_uuid] = {};
            if (row.days_post_session <= 3) byPatient[row.patient_uuid].baseline = row.phq9_score;
            if (row.days_post_session >= 21 && row.days_post_session <= 90) {
                byPatient[row.patient_uuid].endpoint = row.phq9_score;
            }
        }

        const complete = Object.entries(byPatient).filter(
            ([, v]) => v.baseline != null && v.endpoint != null
        );
        const totalN = complete.length;

        try { requireKAnonymity(totalN, 'ruleBenchmarkOutperformance'); } catch { return null; }

        const responders = complete.filter(([, v]) => {
            const pctChange = ((v.baseline! - v.endpoint!) / v.baseline!) * 100;
            return pctChange >= BENCHMARKS.PHQ9_CMC_PCT;
        });

        const clinicRate = Math.round((responders.length / totalN) * 100);
        const benchmarkRate = BENCHMARKS.NATURALISTIC_RESPONSE_RATE;
        const delta = clinicRate - benchmarkRate;

        // Only trigger if outperforming by ≥10 percentage points
        if (delta < 10) return null;

        return {
            id: 'benchmark-outperformance',
            severity: 'SIGNAL',
            category: 'Outcome Performance',
            headline: `Your response rate (${clinicRate}%) outperforms the real-world naturalistic benchmark (${benchmarkRate}%) by ${delta} percentage points.`,
            body: `This is a [STRONG SIGNAL] result that warrants documentation of your current protocol for continuity. Preserving and formalizing your approach — including integration session structure, dosing protocol, and preparation methodology — protects this advantage as your caseload grows.`,
            actionLabel: 'Export Clinic Summary',
            actionRoute: '/analytics',
            sourceNote: `Based on n=${totalN} patients with complete PHQ-9 data · Comparison: Unlimited Sciences naturalistic n=8,000+ (Frontiers Psychiatry 2023)`,
            generatedAt: new Date().toISOString(),
        };
    } catch {
        return null;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule 6 — Safety Event Spike
// Population-level: k-anon required
// ─────────────────────────────────────────────────────────────────────────────

export async function ruleSafetySpike(siteId: string): Promise<InsightCard | null> {
    try {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        const getAECountForWindow = async (from: Date, to: Date) => {
            const { data: sessions } = await supabase
                .from('log_clinical_records')
                .select('id, patient_uuid, session_date')
                .eq('site_id', siteId)
                .neq('session_status', 'draft')        // WO-592: real sessions only
                .gte('session_date', from.toISOString().split('T')[0])
                .lt('session_date', to.toISOString().split('T')[0]);

            if (!sessions) return { count: 0, sessions: 0, patients: 0 };

            const patients = new Set(sessions.map(s => s.patient_uuid)).size;
            const sessionIds = sessions.map(s => s.id);

            if (sessionIds.length === 0) return { count: 0, sessions: 0, patients };

            const { data: events } = await supabase
                .from('log_safety_events')
                .select('id')
                .in('session_id', sessionIds);

            return { count: events?.length ?? 0, sessions: sessions.length, patients };
        };

        const [recent, prior] = await Promise.all([
            getAECountForWindow(thirtyDaysAgo, now),
            getAECountForWindow(sixtyDaysAgo, thirtyDaysAgo),
        ]);

        // k-anon: need ≥5 patients in recent window
        try { requireKAnonymity(recent.patients, 'ruleSafetySpike'); } catch { return null; }

        if (prior.count === 0 || recent.count < 2) return null;

        const recentRate = recent.sessions > 0 ? recent.count / recent.sessions : 0;
        const priorRate = prior.sessions > 0 ? prior.count / prior.sessions : 0;

        if (recentRate < priorRate * 2) return null; // Only trigger on 2× spike

        return {
            id: 'safety-event-spike',
            severity: 'SAFETY',
            category: 'Safety Monitoring',
            headline: `Adverse event rate doubled in the past 30 days: ${recent.count} events vs. ${prior.count} in the prior period.`,
            body: `A significant increase in adverse event frequency warrants immediate review of safety logs and any recent protocol or personnel changes. Check for new substances, dosing adjustments, or changes in patient intake screening that may correlate with this increase.`,
            actionLabel: 'View Safety Log',
            actionRoute: '/wellness-journey',
            sourceNote: `Based on n=${recent.patients} patients in the past 30 days · ${recent.count} events across ${recent.sessions} sessions`,
            generatedAt: new Date().toISOString(),
        };
    } catch {
        return null;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule 7 — Non-Responder Cluster
// Population-level: k-anon required (N ≥ 5 total)
// ─────────────────────────────────────────────────────────────────────────────

export async function ruleNonResponderCluster(siteId: string): Promise<InsightCard | null> {
    try {
        const { data: sessions, error } = await supabase
            .from('log_clinical_records')
            .select(`
        patient_uuid,
        session_date,
        substance_id,
        ref_substances(substance_name)
      `)
            .eq('site_id', siteId)
            .neq('session_status', 'draft')        // WO-592: real sessions only
            .order('session_date', { ascending: false })
            .limit(20);

        if (error || !sessions || sessions.length < 5) return null;

        const totalN = new Set(sessions.map(s => s.patient_uuid)).size;
        try { requireKAnonymity(totalN, 'ruleNonResponderCluster'); } catch { return null; }

        // Get follow-up data for recent patients
        const recentPatients = sessions.slice(0, 10).map(s => s.patient_uuid);
        const { data: followUps } = await supabase
            .from('log_longitudinal_assessments')
            .select('patient_uuid, phq9_score, days_post_session')
            .in('patient_uuid', recentPatients)
            .gte('days_post_session', 14);

        if (!followUps || followUps.length === 0) return null;

        // Find patients with endpoint data who haven't responded
        const endpointByPatient: Record<string, number> = {};
        for (const f of followUps) {
            if (!endpointByPatient[f.patient_uuid] || f.days_post_session > 14) {
                endpointByPatient[f.patient_uuid] = f.phq9_score;
            }
        }

        // Check most recent sessions for consecutive non-responders by substance
        const substanceCounts: Record<string, { name: string; nonResponders: number }> = {};
        for (const s of sessions.slice(0, 6)) {
            const endpointScore = endpointByPatient[s.patient_uuid];
            if (endpointScore == null) continue;

            const substanceName = (s.ref_substances as { substance_name?: string })?.substance_name ?? `Substance ${s.substance_id}`;
            const key = String(s.substance_id);

            if (!substanceCounts[key]) substanceCounts[key] = { name: substanceName, nonResponders: 0 };

            // If endpoint score is still elevated (above CMC threshold), count as non-responder
            if (endpointScore > 9) substanceCounts[key].nonResponders++;
        }

        const trigger = Object.values(substanceCounts).find(g => g.nonResponders >= 3);
        if (!trigger) return null;

        return {
            id: `non-responder-cluster-${Object.keys(substanceCounts)[0]}`,
            severity: 'SIGNAL',
            category: 'Protocol Review',
            headline: `${trigger.nonResponders} recent ${trigger.name} patients have not yet achieved clinical response on PHQ-9 follow-up.`,
            body: `Clustering of non-responders within a single modality may reflect a protocol variable worth reviewing — including preparation session depth, dosing protocol, integration support quality, or patient selection criteria. Consider protocol review or peer consultation.`,
            actionLabel: 'View Protocol Efficiency',
            actionRoute: '/analytics',
            sourceNote: `Based on ${trigger.nonResponders} most recent ${trigger.name} sessions with available follow-up data · k-anon: n=${totalN} total patients`,
            generatedAt: new Date().toISOString(),
        };
    } catch {
        return null;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule 8 — Baseline Severity Mismatch
// Population-level: k-anon required
// ─────────────────────────────────────────────────────────────────────────────

export async function ruleBaselineSeverityMismatch(siteId: string): Promise<InsightCard | null> {
    try {
        const { data: baselines, error } = await supabase
            .from('log_baseline_assessments')
            .select('patient_uuid, phq9_score')
            .not('phq9_score', 'is', null);

        if (error || !baselines || baselines.length < 5) return null;

        const n = new Set(baselines.map(b => b.patient_uuid)).size;
        try { requireKAnonymity(n, 'ruleBaselineSeverityMismatch'); } catch { return null; }

        const scores = baselines
            .map(b => b.phq9_score)
            .filter((s): s is number => s != null);

        if (scores.length < 5) return null;

        const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
        const sd = Math.sqrt(scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length);

        const benchmarkBaseline = BENCHMARKS.BENCHMARK_PHQ9_BASELINE;
        const diff = mean - benchmarkBaseline;

        // Only trigger if clinic baseline is > 1.5 SD above benchmark baseline
        if (diff / sd < 1.5) return null;

        return {
            id: 'baseline-severity-mismatch',
            severity: 'SIGNAL',
            category: 'Benchmark Context',
            headline: `Your patients' average PHQ-9 baseline (${mean.toFixed(1)}) is significantly higher than the published benchmark population (${benchmarkBaseline}) by ${diff.toFixed(1)} points.`,
            body: `Your clinic is treating a more severely affected population than the benchmarks you're being compared against. This means your response rate comparisons may understate your actual clinical performance — treating more severe patients and achieving similar response rates represents stronger clinical outcomes. Benchmark comparisons should be interpreted in light of this higher baseline severity.`,
            actionLabel: 'View Benchmark Intelligence',
            actionRoute: '/analytics',
            sourceNote: `Based on n=${n} patients with baseline PHQ-9 data (mean=${mean.toFixed(1)}, SD=${sd.toFixed(1)}) · Benchmark: naturalistic studies mean PHQ-9 ≈ ${benchmarkBaseline}`,
            generatedAt: new Date().toISOString(),
        };
    } catch {
        return null;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Worsening Patient Detection — WO-699
// Source: mv_clinician_work_queue (capability #1 — clinician priority queue)
// trajectory_state = 'worsening' + unresolved_safety_count > 0 detected via MV
// ─────────────────────────────────────────────────────────────────────────────

export async function ruleWorseningPatients(siteId: string): Promise<InsightCard | null> {
    try {
        // Source: mv_clinician_work_queue (capability #1 — clinician priority queue)
        // Worsening patient detection: trajectory_state = 'worsening', ORDER BY priority_score DESC
        const { data: worseningRows, error } = await supabase
            .from('mv_clinician_work_queue')
            .select('subject_id, priority_score, unresolved_safety_count, days_since_session')
            .eq('site_id', siteId)
            .eq('trajectory_state', 'worsening')
            .order('priority_score', { ascending: false })
            .limit(20);

        if (error || !worseningRows || worseningRows.length === 0) return null;

        // k-anon: require >= 5 patients
        try { requireKAnonymity(worseningRows.length, 'ruleWorseningPatients'); } catch { return null; }

        const withSafety = worseningRows.filter((r: any) => (r.unresolved_safety_count ?? 0) > 0);

        return {
            id: 'worsening-patient-cluster',
            severity: withSafety.length > 0 ? 'SAFETY' : 'SIGNAL',
            category: 'Trajectory Monitoring',
            headline: `${worseningRows.length} patient${worseningRows.length !== 1 ? 's' : ''} show a worsening trajectory${withSafety.length > 0 ? `, including ${withSafety.length} with unresolved safety events` : ''}.`,
            body: `These patients have been identified by the priority queue as requiring immediate clinical attention. Review their integration session logs and schedule follow-up assessments as soon as possible.`,
            actionLabel: 'Open Patient Journeys',
            actionRoute: '/wellness-journey',
            sourceNote: `n=${worseningRows.length} patients · Source: mv_clinician_work_queue (priority_score DESC)`,
            generatedAt: new Date().toISOString(),
        };
    } catch {
        return null;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Master runner — evaluates all rules in parallel, returns triggered cards
// WO-699: Priority ordering now reflects mv_clinician_work_queue.priority_score
// ─────────────────────────────────────────────────────────────────────────────

const SEVERITY_ORDER: Record<InsightSeverity, number> = {
    SAFETY: 0,
    SIGNAL: 1,
    OPPORTUNITY: 2,
    REVIEW: 3,
};

export async function runInsightEngine(siteId: string): Promise<InsightCard[]> {
    const results = await Promise.allSettled([
        // WO-699: MV-sourced SAFETY rules — mv_clinician_work_queue priority_score DESC
        ruleFollowUpLoss(siteId),           // SAFETY — mv_clinician_work_queue (is_overdue=true)
        ruleWorseningPatients(siteId),      // SAFETY/SIGNAL — mv_clinician_work_queue (trajectory_state=worsening)
        ruleSafetySpike(siteId),            // SAFETY — log_safety_events (window comparison)
        ruleIntegrationDropout(siteId),     // OPPORTUNITY — log_longitudinal_assessments
        ruleBenchmarkOutperformance(siteId),// SIGNAL — log_longitudinal_assessments
        ruleNonResponderCluster(siteId),    // SIGNAL — log_clinical_records + log_longitudinal
        ruleSubstanceMismatch(siteId),      // SIGNAL — deferred (see rule 3 comment)
        // WO-699: MV-sourced REVIEW rule — mv_documentation_completeness + mv_followup_window_compliance
        ruleDocumentationDecay(siteId),     // REVIEW — mv_documentation_completeness, mv_followup_window_compliance
        ruleBaselineSeverityMismatch(siteId),// SIGNAL — log_baseline_assessments
    ]);

    const cards: InsightCard[] = results
        .filter((r): r is PromiseFulfilledResult<InsightCard | null> => r.status === 'fulfilled')
        .map(r => r.value)
        .filter((c): c is InsightCard => c !== null);

    // Sort: SAFETY → SIGNAL → OPPORTUNITY → REVIEW
    cards.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);

    return cards;
}
