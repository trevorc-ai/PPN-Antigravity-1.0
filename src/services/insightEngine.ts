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
    body: string;            // 2–3 sentences: what it means + suggested action rationale
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

export async function ruleIntegrationDropout(siteId: number): Promise<InsightCard | null> {
    try {
        // Get non-responders: patients with baseline + follow-up PHQ-9, change < 50%
        const { data: trajectories, error } = await supabase
            .from('log_longitudinal_assessments')
            .select('patient_id, phq9_score, days_post_session')
            .order('days_post_session', { ascending: true });

        if (error || !trajectories) return null;

        // Group by patient to find responders/non-responders
        const byPatient: Record<string, { baseline?: number; endpoint?: number }> = {};
        for (const row of trajectories) {
            if (!byPatient[row.patient_id]) byPatient[row.patient_id] = {};
            if (row.days_post_session <= 3) byPatient[row.patient_id].baseline = row.phq9_score;
            if (row.days_post_session >= 21 && row.days_post_session <= 90) {
                byPatient[row.patient_id].endpoint = row.phq9_score;
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
            .select('patient_id')
            .in('patient_id', nonResponderIds);

        if (!integrationData) return null;

        const sessionsByPatient: Record<string, number> = {};
        for (const row of integrationData) {
            sessionsByPatient[row.patient_id] = (sessionsByPatient[row.patient_id] || 0) + 1;
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
// Single-patient rule: practitioner's own flagged patient — k-anon exempt
// Returns the FIRST flagged patient only (most overdue)
// ─────────────────────────────────────────────────────────────────────────────

export async function ruleFollowUpLoss(siteId: number): Promise<InsightCard | null> {
    try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 30);

        // Get sessions from > 30 days ago
        const { data: sessions, error } = await supabase
            .from('log_clinical_records')
            .select('id, patient_link_code, session_date')
            .eq('site_id', siteId)
            .lt('session_date', cutoffDate.toISOString().split('T')[0])
            .order('session_date', { ascending: false });

        if (error || !sessions || sessions.length === 0) return null;

        // For each session, check if a follow-up assessment exists
        for (const session of sessions) {
            const { data: followUp } = await supabase
                .from('log_longitudinal_assessments')
                .select('id')
                .eq('patient_id', session.patient_link_code)
                .gte('assessment_date', session.session_date)
                .limit(1);

            if (!followUp || followUp.length === 0) {
                const daysSince = Math.round(
                    (Date.now() - new Date(session.session_date).getTime()) / (1000 * 60 * 60 * 24)
                );

                return {
                    id: `follow-up-loss-${session.patient_link_code}`,
                    severity: 'SAFETY',
                    category: 'Patient Follow-Up',
                    headline: `Patient ${session.patient_link_code} has no documented follow-up in ${daysSince} days since their session.`,
                    body: `Clinical Insight: 30-day reassessment for all dosing sessions. Extended time without follow-up assessment creates a gap in safety monitoring and prevents accurate outcome tracking. Schedule a check-in to maintain continuity of care.`,
                    actionLabel: 'Open Patient Journey',
                    actionRoute: `/wellness-journey?patient=${session.patient_link_code}`,
                    sourceNote: `Session date: ${session.session_date} · Single-patient flag — privacy exempt per k-anon policy`,
                    generatedAt: new Date().toISOString(),
                };
            }
        }

        return null;
    } catch {
        return null;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule 3 — Substance-Condition Mismatch Signal
// Population-level: k-anon required (N ≥ 5 per subgroup)
// ─────────────────────────────────────────────────────────────────────────────

export async function ruleSubstanceMismatch(siteId: number): Promise<InsightCard | null> {
    try {
        const { data: sessions, error } = await supabase
            .from('log_clinical_records')
            .select(`
        patient_link_code,
        substance_id,
        primary_indication,
        ref_substances(substance_name)
      `)
            .eq('site_id', siteId);

        if (error || !sessions || sessions.length < 10) return null;

        // Group response rates by substance × condition
        const groups: Record<string, { patients: Set<string>; substanceName: string; condition: string }> = {};

        for (const s of sessions) {
            if (!s.primary_indication || !s.substance_id) continue;
            const key = `${s.substance_id}::${s.primary_indication}`;
            if (!groups[key]) {
                groups[key] = {
                    patients: new Set(),
                    substanceName: (s.ref_substances as { substance_name?: string })?.substance_name ?? `Substance ${s.substance_id}`,
                    condition: s.primary_indication,
                };
            }
            groups[key].patients.add(s.patient_link_code);
        }

        // Find any group pair with same condition, different substance, N ≥ 5 each
        const entries = Object.values(groups).filter(g => g.patients.size >= 5);
        const conditions = [...new Set(entries.map(e => e.condition))];

        for (const condition of conditions) {
            const conditionGroups = entries.filter(e => e.condition === condition);
            if (conditionGroups.length < 2) continue;

            // Sort by patient count as proxy for "success" (full response rate needs follow-up data)
            conditionGroups.sort((a, b) => b.patients.size - a.patients.size);
            const top = conditionGroups[0];
            const bottom = conditionGroups[conditionGroups.length - 1];

            const ratio = top.patients.size / bottom.patients.size;
            if (ratio < 1.5) continue;

            return {
                id: `substance-mismatch-${condition}`,
                severity: 'SIGNAL',
                category: 'Protocol Optimization',
                headline: `Your ${top.substanceName} patients with ${condition} represent ${top.patients.size} cases vs. ${bottom.patients.size} for ${bottom.substanceName} — a ${ratio.toFixed(1)}× difference in case volume.`,
                body: `Significant variation in case volume across substances for the same condition may indicate an emerging clinical pattern. Review outcome data for each group to identify whether one protocol is yielding stronger results for ${condition} in your practice.`,
                actionLabel: 'View Patient Galaxy',
                actionRoute: '/analytics',
                sourceNote: `Based on n=${top.patients.size + bottom.patients.size} patients with complete substance + indication data · k-anon: ≥5 per subgroup enforced`,
                generatedAt: new Date().toISOString(),
            };
        }

        return null;
    } catch {
        return null;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Rule 4 — Documentation Quality Decay
// Population-level: k-anon required
// ─────────────────────────────────────────────────────────────────────────────

export async function ruleDocumentationDecay(siteId: number): Promise<InsightCard | null> {
    try {
        const now = new Date();
        const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
        const eightWeeksAgo = new Date(now.getTime() - 56 * 24 * 60 * 60 * 1000);

        const getCompletenessForWindow = async (from: Date, to: Date) => {
            const { data: sessions } = await supabase
                .from('log_clinical_records')
                .select('id, patient_link_code, session_date')
                .eq('site_id', siteId)
                .gte('session_date', from.toISOString().split('T')[0])
                .lt('session_date', to.toISOString().split('T')[0]);

            if (!sessions || sessions.length === 0) return null;

            const n = new Set(sessions.map(s => s.patient_link_code)).size;

            // k-anon guard
            try { requireKAnonymity(n, 'ruleDocumentationDecay'); } catch { return null; }

            let hasVitals = 0, hasBaseline = 0, hasIntegration = 0, hasFollowUp = 0;

            for (const session of sessions) {
                const [vitals, baseline, integration, followUp] = await Promise.all([
                    supabase.from('log_session_vitals').select('id').eq('session_id', session.id).limit(1),
                    supabase.from('log_baseline_assessments').select('id').eq('patient_id', session.patient_link_code).limit(1),
                    supabase.from('log_integration_sessions').select('id').eq('dosing_session_id', session.id).limit(1),
                    supabase.from('log_longitudinal_assessments').select('id').eq('patient_id', session.patient_link_code).limit(1),
                ]);
                if (vitals.data && vitals.data.length > 0) hasVitals++;
                if (baseline.data && baseline.data.length > 0) hasBaseline++;
                if (integration.data && integration.data.length > 0) hasIntegration++;
                if (followUp.data && followUp.data.length > 0) hasFollowUp++;
            }

            const total = sessions.length;
            const score = Math.round(((hasVitals + hasBaseline + hasIntegration + hasFollowUp) / (total * 4)) * 100);
            return { score, n };
        };

        const [recent, prior] = await Promise.all([
            getCompletenessForWindow(fourWeeksAgo, now),
            getCompletenessForWindow(eightWeeksAgo, fourWeeksAgo),
        ]);

        if (!recent || !prior) return null;
        if (prior.score - recent.score < 15) return null; // Only trigger on >15-point drop

        return {
            id: 'documentation-decay',
            severity: 'REVIEW',
            category: 'Documentation Quality',
            headline: `Documentation completeness dropped from ${prior.score}% to ${recent.score}% over the past 4 weeks.`,
            body: `Incomplete session records prevent accurate outcome tracking and benchmark comparison. Missing elements most commonly include integration session logs and follow-up assessments. Complete documentation is the foundation of accurate clinical intelligence.`,
            actionLabel: 'Review Documentation Quality',
            actionRoute: '/analytics',
            sourceNote: `Based on n=${recent.n} patients in the past 4 weeks · Prior period: n=${prior.n} patients`,
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

export async function ruleBenchmarkOutperformance(siteId: number): Promise<InsightCard | null> {
    try {
        const { data: trajectories, error } = await supabase
            .from('log_longitudinal_assessments')
            .select('patient_id, phq9_score, days_post_session')
            .order('days_post_session', { ascending: true });

        if (error || !trajectories) return null;

        const byPatient: Record<string, { baseline?: number; endpoint?: number }> = {};
        for (const row of trajectories) {
            if (!byPatient[row.patient_id]) byPatient[row.patient_id] = {};
            if (row.days_post_session <= 3) byPatient[row.patient_id].baseline = row.phq9_score;
            if (row.days_post_session >= 21 && row.days_post_session <= 90) {
                byPatient[row.patient_id].endpoint = row.phq9_score;
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

export async function ruleSafetySpike(siteId: number): Promise<InsightCard | null> {
    try {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        const getAECountForWindow = async (from: Date, to: Date) => {
            const { data: sessions } = await supabase
                .from('log_clinical_records')
                .select('id, patient_link_code, session_date')
                .eq('site_id', siteId)
                .gte('session_date', from.toISOString().split('T')[0])
                .lt('session_date', to.toISOString().split('T')[0]);

            if (!sessions) return { count: 0, sessions: 0, patients: 0 };

            const patients = new Set(sessions.map(s => s.patient_link_code)).size;
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

export async function ruleNonResponderCluster(siteId: number): Promise<InsightCard | null> {
    try {
        const { data: sessions, error } = await supabase
            .from('log_clinical_records')
            .select(`
        patient_link_code,
        session_date,
        substance_id,
        ref_substances(substance_name)
      `)
            .eq('site_id', siteId)
            .order('session_date', { ascending: false })
            .limit(20);

        if (error || !sessions || sessions.length < 5) return null;

        const totalN = new Set(sessions.map(s => s.patient_link_code)).size;
        try { requireKAnonymity(totalN, 'ruleNonResponderCluster'); } catch { return null; }

        // Get follow-up data for recent patients
        const recentPatients = sessions.slice(0, 10).map(s => s.patient_link_code);
        const { data: followUps } = await supabase
            .from('log_longitudinal_assessments')
            .select('patient_id, phq9_score, days_post_session')
            .in('patient_id', recentPatients)
            .gte('days_post_session', 14);

        if (!followUps || followUps.length === 0) return null;

        // Find patients with endpoint data who haven't responded
        const endpointByPatient: Record<string, number> = {};
        for (const f of followUps) {
            if (!endpointByPatient[f.patient_id] || f.days_post_session > 14) {
                endpointByPatient[f.patient_id] = f.phq9_score;
            }
        }

        // Check most recent sessions for consecutive non-responders by substance
        const substanceCounts: Record<string, { name: string; nonResponders: number }> = {};
        for (const s of sessions.slice(0, 6)) {
            const endpointScore = endpointByPatient[s.patient_link_code];
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

export async function ruleBaselineSeverityMismatch(siteId: number): Promise<InsightCard | null> {
    try {
        const { data: baselines, error } = await supabase
            .from('log_baseline_assessments')
            .select('patient_id, phq9_score')
            .not('phq9_score', 'is', null);

        if (error || !baselines || baselines.length < 5) return null;

        const n = new Set(baselines.map(b => b.patient_id)).size;
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
// Master runner — evaluates all rules in parallel, returns triggered cards
// ─────────────────────────────────────────────────────────────────────────────

const SEVERITY_ORDER: Record<InsightSeverity, number> = {
    SAFETY: 0,
    SIGNAL: 1,
    OPPORTUNITY: 2,
    REVIEW: 3,
};

export async function runInsightEngine(siteId: number): Promise<InsightCard[]> {
    const results = await Promise.allSettled([
        ruleFollowUpLoss(siteId),           // SAFETY first
        ruleSafetySpike(siteId),            // SAFETY
        ruleIntegrationDropout(siteId),     // OPPORTUNITY
        ruleBenchmarkOutperformance(siteId),// SIGNAL
        ruleNonResponderCluster(siteId),    // SIGNAL
        ruleSubstanceMismatch(siteId),      // SIGNAL
        ruleDocumentationDecay(siteId),     // REVIEW
        ruleBaselineSeverityMismatch(siteId),// SIGNAL
    ]);

    const cards: InsightCard[] = results
        .filter((r): r is PromiseFulfilledResult<InsightCard | null> => r.status === 'fulfilled')
        .map(r => r.value)
        .filter((c): c is InsightCard => c !== null);

    // Sort: SAFETY → SIGNAL → OPPORTUNITY → REVIEW
    cards.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);

    return cards;
}
