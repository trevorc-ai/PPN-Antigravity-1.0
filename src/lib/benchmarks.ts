/**
 * benchmarks.ts
 * =============
 * WO-231 | BUILDER | TypeScript API layer for Global Benchmark Intelligence.
 *
 * Provides typed query functions for the three benchmark tables:
 *   - benchmark_trials    (ClinicalTrials.gov registry)
 *   - benchmark_cohorts   (Published paper aggregate outcomes)
 *   - population_baselines (SAMHSA/population context — Phase 2)
 *
 * Usage:
 *   import { getBenchmarkCohorts, getPrimaryBenchmark } from '@/lib/benchmarks';
 *
 *   // Get all psilocybin/PTSD benchmarks measured by CAPS-5
 *   const cohorts = await getBenchmarkCohorts('psilocybin', 'PTSD', 'CAPS-5');
 *
 *   // Get the best single benchmark for the ribbon chart
 *   const primary = await getPrimaryBenchmark('mdma', 'PTSD', 'CAPS-5');
 */

import { supabase } from '@/lib/supabaseClient';

// ─────────────────────────────────────────────────────────────────────────────
// Types — mirror the DB schema exactly
// ─────────────────────────────────────────────────────────────────────────────

export interface BenchmarkTrial {
    id: string;
    nct_id: string;
    title: string;
    phase: string | null;
    status: string | null;
    modality: string;
    conditions: string[] | null;
    country: string | null;
    enrollment_actual: number | null;
    start_date: string | null;
    completion_date: string | null;
    primary_outcome_measure: string | null;
    source: string;
    created_at: string;
}

export interface BenchmarkCohort {
    id: string;
    cohort_name: string;
    source_citation: string;
    modality: string;
    condition: string;
    setting: string | null;
    n_participants: number;
    country: string | null;
    instrument: string;
    baseline_mean: number | null;
    baseline_sd: number | null;
    endpoint_mean: number | null;
    endpoint_sd: number | null;
    followup_weeks: number | null;
    response_rate_pct: number | null;
    remission_rate_pct: number | null;
    effect_size_hedges_g: number | null;
    adverse_event_rate_pct: number | null;
    data_freely_usable: boolean;
    license: string | null;
    notes: string | null;
    created_at: string;
}

export interface PopulationBaseline {
    id: string;
    source: string;
    year: number;
    region: string;
    condition: string | null;
    substance: string | null;
    demographic_group: string | null;
    n_episodes: number | null;
    avg_age: number | null;
    pct_female: number | null;
    avg_prior_treatments: number | null;
    avg_los_days: number | null;
    pct_completed_treatment: number | null;
    created_at: string;
}

/** Summary stats for the platform social-proof block */
export interface BenchmarkSummary {
    trialCount: number;
    cohortCount: number;
    modalityCounts: Record<string, number>;
}

/** Comparison result: clinic vs. global benchmark */
export interface BenchmarkComparison {
    cohort: BenchmarkCohort;
    clinicResponseRate: number | null;
    benchmarkResponseRate: number | null;
    clinicEndpointMean: number | null;
    benchmarkEndpointMean: number | null;
    label: 'above_benchmark' | 'at_benchmark' | 'below_benchmark' | 'insufficient_data';
}

// ─────────────────────────────────────────────────────────────────────────────
// benchmark_cohorts queries
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get all benchmark cohorts for a given modality × condition × instrument.
 * Ordered by n_participants DESC — largest samples first.
 *
 * Powers: the Benchmark Ribbon chart overlay on outcome charts.
 */
export async function getBenchmarkCohorts(
    modality: string,
    condition: string,
    instrument: string
): Promise<BenchmarkCohort[]> {
    const { data, error } = await supabase
        .from('benchmark_cohorts')
        .select('*')
        .eq('modality', modality.toLowerCase())
        .eq('condition', condition)
        .eq('instrument', instrument)
        .order('n_participants', { ascending: false });

    if (error) {
        console.error('[benchmarks] getBenchmarkCohorts error:', error.message);
        return [];
    }
    return data ?? [];
}

/**
 * Get the single best benchmark for a given modality × condition × instrument.
 * "Best" = largest n_participants (most statistical authority).
 *
 * Powers: the primary benchmark line on outcome charts.
 */
export async function getPrimaryBenchmark(
    modality: string,
    condition: string,
    instrument: string
): Promise<BenchmarkCohort | null> {
    const { data, error } = await supabase
        .from('benchmark_cohorts')
        .select('*')
        .eq('modality', modality.toLowerCase())
        .eq('condition', condition)
        .eq('instrument', instrument)
        .order('n_participants', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error('[benchmarks] getPrimaryBenchmark error:', error.message);
        return null;
    }
    return data;
}

/**
 * Get all benchmark cohorts for a given modality (all conditions).
 *
 * Powers: the Global Cohort Heatmap (modality × condition grid).
 */
export async function getBenchmarkCohortsForModality(
    modality: string
): Promise<BenchmarkCohort[]> {
    const { data, error } = await supabase
        .from('benchmark_cohorts')
        .select('*')
        .eq('modality', modality.toLowerCase())
        .order('n_participants', { ascending: false });

    if (error) {
        console.error('[benchmarks] getBenchmarkCohortsForModality error:', error.message);
        return [];
    }
    return data ?? [];
}

/**
 * Get all benchmark cohorts for a given condition (all modalities).
 *
 * Powers: the "Compare modalities for PTSD" view.
 */
export async function getBenchmarkCohortsForCondition(
    condition: string
): Promise<BenchmarkCohort[]> {
    const { data, error } = await supabase
        .from('benchmark_cohorts')
        .select('*')
        .eq('condition', condition)
        .order('n_participants', { ascending: false });

    if (error) {
        console.error('[benchmarks] getBenchmarkCohortsForCondition error:', error.message);
        return [];
    }
    return data ?? [];
}

/**
 * Get all unique modalities that have at least one benchmark cohort.
 *
 * Powers: modality filter dropdowns on the Analytics page.
 */
export async function getBenchmarkModalities(): Promise<string[]> {
    const { data, error } = await supabase
        .from('benchmark_cohorts')
        .select('modality');

    if (error) {
        console.error('[benchmarks] getBenchmarkModalities error:', error.message);
        return [];
    }

    const unique = [...new Set((data ?? []).map(r => r.modality))].sort();
    return unique;
}

/**
 * Get all unique conditions that have at least one benchmark cohort.
 *
 * Powers: condition filter dropdowns on the Analytics page.
 */
export async function getBenchmarkConditions(): Promise<string[]> {
    const { data, error } = await supabase
        .from('benchmark_cohorts')
        .select('condition');

    if (error) {
        console.error('[benchmarks] getBenchmarkConditions error:', error.message);
        return [];
    }

    const unique = [...new Set((data ?? []).map(r => r.condition))].sort();
    return unique;
}

// ─────────────────────────────────────────────────────────────────────────────
// benchmark_trials queries
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get total count of benchmark trials, optionally filtered by modality.
 *
 * Powers: the social-proof counter "Grounded in N global clinical trials".
 */
export async function getBenchmarkTrialCount(modality?: string): Promise<number> {
    let query = supabase
        .from('benchmark_trials')
        .select('id', { count: 'exact', head: true });

    if (modality) {
        query = query.eq('modality', modality.toLowerCase());
    }

    const { count, error } = await query;
    if (error) {
        console.error('[benchmarks] getBenchmarkTrialCount error:', error.message);
        return 0;
    }
    return count ?? 0;
}

/**
 * Get benchmark trials filtered by modality, paginated.
 *
 * Powers: the "Browse Global Trials" explorer (future feature).
 */
export async function getBenchmarkTrials(
    modality?: string,
    limit = 50,
    offset = 0
): Promise<BenchmarkTrial[]> {
    let query = supabase
        .from('benchmark_trials')
        .select('*')
        .order('completion_date', { ascending: false })
        .range(offset, offset + limit - 1);

    if (modality) {
        query = query.eq('modality', modality.toLowerCase());
    }

    const { data, error } = await query;
    if (error) {
        console.error('[benchmarks] getBenchmarkTrials error:', error.message);
        return [];
    }
    return data ?? [];
}

// ─────────────────────────────────────────────────────────────────────────────
// Summary / aggregate
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get platform-level benchmark summary for header cards and social proof.
 *
 * Returns:
 *   trialCount    — total seeded trials across all modalities
 *   cohortCount   — total benchmark cohort records
 *   modalityCounts — breakdown of trials per modality
 *
 * Powers: "Built on 487 global clinical trials across 9 modalities" block.
 */
export async function getBenchmarkSummary(): Promise<BenchmarkSummary> {
    const [trialsResult, cohortsResult] = await Promise.all([
        supabase.from('benchmark_trials').select('modality'),
        supabase.from('benchmark_cohorts').select('id', { count: 'exact', head: true }),
    ]);

    const modalityCounts: Record<string, number> = {};
    for (const row of trialsResult.data ?? []) {
        modalityCounts[row.modality] = (modalityCounts[row.modality] ?? 0) + 1;
    }

    return {
        trialCount: trialsResult.data?.length ?? 0,
        cohortCount: cohortsResult.count ?? 0,
        modalityCounts,
    };
}

/**
 * Build a comparison object between a clinic's outcomes and the primary benchmark.
 * Used by the ANALYST comparison query pattern in Analytics.tsx.
 *
 * Pass in the clinic's computed metrics — this function attaches the benchmark
 * and computes the directional label.
 */
export async function buildBenchmarkComparison(params: {
    modality: string;
    condition: string;
    instrument: string;
    clinicResponseRate: number | null;
    clinicEndpointMean: number | null;
}): Promise<BenchmarkComparison | null> {
    const benchmark = await getPrimaryBenchmark(
        params.modality,
        params.condition,
        params.instrument
    );

    if (!benchmark) return null;

    const clinicRate = params.clinicResponseRate;
    const benchRate = benchmark.response_rate_pct;
    const clinicMean = params.clinicEndpointMean;
    const benchMean = benchmark.endpoint_mean;

    // Determine label — use response rate if available, fall back to mean comparison
    let label: BenchmarkComparison['label'] = 'insufficient_data';

    if (clinicRate != null && benchRate != null) {
        if (clinicRate > benchRate + 5) label = 'above_benchmark';
        else if (clinicRate < benchRate - 5) label = 'below_benchmark';
        else label = 'at_benchmark';
    } else if (clinicMean != null && benchMean != null) {
        // For symptom scales: lower = better. So clinic better if clinicMean < benchMean.
        if (clinicMean < benchMean - 2) label = 'above_benchmark';
        else if (clinicMean > benchMean + 2) label = 'below_benchmark';
        else label = 'at_benchmark';
    }

    return {
        cohort: benchmark,
        clinicResponseRate: clinicRate,
        benchmarkResponseRate: benchRate,
        clinicEndpointMean: clinicMean,
        benchmarkEndpointMean: benchMean,
        label,
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: format benchmark citation for UI display
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format a benchmark cohort's citation for a tooltip or footnote.
 * Truncates long citations and appends the cohort name for context.
 */
export function formatBenchmarkCitation(cohort: BenchmarkCohort): string {
    const maxLength = 120;
    const citation = cohort.source_citation;
    const truncated = citation.length > maxLength
        ? citation.slice(0, maxLength) + '…'
        : citation;
    return `${cohort.cohort_name} — ${truncated}`;
}

/**
 * Get the label text for a benchmark comparison result.
 * Used in the Analytics status chip.
 */
export function getBenchmarkComparisonLabel(
    comparison: BenchmarkComparison | null
): string {
    if (!comparison) return 'No benchmark available';
    switch (comparison.label) {
        case 'above_benchmark': return 'Above global benchmark';
        case 'at_benchmark': return 'At global benchmark';
        case 'below_benchmark': return 'Below global benchmark';
        case 'insufficient_data': return 'Insufficient data to compare';
    }
}
