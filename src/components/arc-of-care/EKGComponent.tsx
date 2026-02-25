import React, { useState, useEffect, useCallback } from 'react';
import { Activity, AlertTriangle, CheckCircle, ChevronDown } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';

// ─── Types ───────────────────────────────────────────────────────────────────

interface EKGRhythm {
    id: number;
    code: string;
    label: string;
    severity_tier: 'normal' | 'monitor' | 'critical';
}

/** QTc flag levels — maps to Dr. Allen's Ibogaine safety thresholds */
type QTcFlag = 'normal' | 'borderline' | 'prolonged' | 'red-flag';

/** Static waveform findings (Level 1 — no ref table needed) */
const WAVEFORM_FINDINGS = [
    { code: 'ST_ELEVATION', label: 'ST Elevation' },
    { code: 'T_WAVE_INVERSION', label: 'T-Wave Inversion' },
    { code: 'LBBB', label: 'Left Bundle Branch Block (LBBB)' },
    { code: 'RBBB', label: 'Right Bundle Branch Block (RBBB)' },
    { code: 'Q_WAVES', label: 'Q Waves' },
] as const;

type WaveformFindingCode = (typeof WAVEFORM_FINDINGS)[number]['code'];

/** QRS Axis options — standard clinical quadrant labeling */
const QRS_AXIS_OPTIONS = [
    { value: '', label: 'Select...' },
    { value: 'NORMAL', label: 'Normal Axis (0° to +90°)' },
    { value: 'LAD', label: 'Left Axis Deviation (–30° to –90°)' },
    { value: 'RAD', label: 'Right Axis Deviation (+90° to +180°)' },
    { value: 'EXTREME', label: 'Extreme Axis (No-Man\'s Land)' },
] as const;

export interface EKGData {
    rhythmCode: string;
    prIntervalMs: string;
    qrsDurationMs: string;
    qtIntervalMs: string;
    qtcMs: number | null;        // auto-calculated — Bazett formula
    qrsAxis: string;
    waveformFindings: WaveformFindingCode[];
}

export interface EKGComponentProps {
    /**
     * Heart Rate from the current vital-sign reading row (bpm).
     * Used as the denominator for the Bazett QTc auto-calculation.
     * Required for auto-calc; QTc will show manual-entry prompt if absent.
     */
    heartRate?: number;
    /** Fires whenever EKG data changes — parent can surface for display or future persist. */
    onChange?: (data: EKGData) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Bazett formula: QTc = QT / √(RR)
 * RR in seconds = 60 / HR
 * Returns null if either input is invalid or HR ≤ 0.
 */
function calcBazettQTc(qtMs: number, heartRateBpm: number): number | null {
    if (heartRateBpm <= 0 || qtMs <= 0) return null;
    const rrSec = 60 / heartRateBpm;
    const qtc = qtMs / Math.sqrt(rrSec);
    return Math.round(qtc);
}

function getQTcFlag(qtcMs: number | null): QTcFlag | null {
    if (qtcMs === null) return null;
    if (qtcMs > 500) return 'red-flag';
    if (qtcMs > 470) return 'prolonged';
    if (qtcMs >= 440) return 'borderline';
    return 'normal';
}

interface QTcFlagDisplay {
    label: string;
    sublabel: string;
    textCls: string;
    bgCls: string;
    borderCls: string;
    Icon: React.ElementType;
    iconCls: string;
}

function getQTcFlagDisplay(flag: QTcFlag | null): QTcFlagDisplay | null {
    if (!flag) return null;
    switch (flag) {
        case 'normal':
            return {
                label: 'Normal',
                sublabel: '< 440 ms',
                textCls: 'text-teal-300',
                bgCls: 'bg-teal-500/10',
                borderCls: 'border-teal-500/30',
                Icon: CheckCircle,
                iconCls: 'text-teal-400',
            };
        case 'borderline':
            return {
                label: 'Borderline Prolonged',
                sublabel: '440 – 470 ms',
                textCls: 'text-yellow-300',
                bgCls: 'bg-yellow-500/10',
                borderCls: 'border-yellow-500/30',
                Icon: AlertTriangle,
                iconCls: 'text-yellow-400',
            };
        case 'prolonged':
            return {
                label: 'Prolonged',
                sublabel: '> 470 ms',
                textCls: 'text-orange-300',
                bgCls: 'bg-orange-500/10',
                borderCls: 'border-orange-500/30',
                Icon: AlertTriangle,
                iconCls: 'text-orange-400',
            };
        case 'red-flag':
            return {
                label: 'RED FLAG — Torsades Risk',
                sublabel: '> 500 ms',
                textCls: 'text-red-300',
                bgCls: 'bg-red-500/10',
                borderCls: 'border-red-500/50',
                Icon: AlertTriangle,
                iconCls: 'text-red-400',
            };
    }
}

function getRhythmSeverityCls(tier: EKGRhythm['severity_tier'] | ''): string {
    switch (tier) {
        case 'normal': return 'text-teal-400';
        case 'monitor': return 'text-yellow-400';
        case 'critical': return 'text-red-400';
        default: return 'text-slate-400';
    }
}

// ─── Component ───────────────────────────────────────────────────────────────

export const EKGComponent: React.FC<EKGComponentProps> = ({ heartRate, onChange }) => {
    // ── Rhythm reference data ─────────────────────────────────
    const [rhythms, setRhythms] = useState<EKGRhythm[]>([]);
    const [rhythmsLoading, setRhythmsLoading] = useState(true);
    const [rhythmsError, setRhythmsError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const { data, error } = await supabase
                    .from('ref_ekg_rhythms')
                    .select('id, code, label, severity_tier')
                    .eq('is_active', true)
                    .order('id');
                if (cancelled) return;
                if (error) throw error;
                setRhythms(data ?? []);
            } catch (err) {
                if (!cancelled) setRhythmsError('Could not load EKG rhythms. Using static fallback.');
                console.error('[EKGComponent] ref_ekg_rhythms fetch error:', err);
            } finally {
                if (!cancelled) setRhythmsLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    // ── Form state ────────────────────────────────────────────
    const [rhythmCode, setRhythmCode] = useState('');
    const [prIntervalMs, setPrIntervalMs] = useState('');
    const [qrsDurationMs, setQrsDurationMs] = useState('');
    const [qtIntervalMs, setQtIntervalMs] = useState('');
    const [qrsAxis, setQrsAxis] = useState('');
    const [waveformFindings, setWaveformFindings] = useState<Set<WaveformFindingCode>>(new Set());

    // ── QTc auto-calculation ──────────────────────────────────
    const qtcMs: number | null = (() => {
        const qt = parseInt(qtIntervalMs, 10);
        const hr = heartRate;
        if (!isNaN(qt) && qt > 0 && hr && hr > 0) {
            return calcBazettQTc(qt, hr);
        }
        return null;
    })();

    const qtcFlag = getQTcFlag(qtcMs);
    const qtcDisplay = getQTcFlagDisplay(qtcFlag);

    // ── Notify parent on change ───────────────────────────────
    const buildSnapshot = useCallback((): EKGData => ({
        rhythmCode,
        prIntervalMs,
        qrsDurationMs,
        qtIntervalMs,
        qtcMs,
        qrsAxis,
        waveformFindings: Array.from(waveformFindings) as WaveformFindingCode[],
    }), [rhythmCode, prIntervalMs, qrsDurationMs, qtIntervalMs, qtcMs, qrsAxis, waveformFindings]);

    useEffect(() => {
        onChange?.(buildSnapshot());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rhythmCode, prIntervalMs, qrsDurationMs, qtIntervalMs, qtcMs, qrsAxis, waveformFindings]);

    // ── Shared styles ─────────────────────────────────────────
    const inputCls =
        'w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700/60 focus:border-amber-500/60 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all placeholder:text-slate-600';
    const selectCls =
        'w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700/60 focus:border-amber-500/60 rounded-xl text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all appearance-none';

    // ── Derived rhythm severity for border hint hint ──────────
    const selectedRhythm = rhythms.find(r => r.code === rhythmCode);

    function toggleFinding(code: WaveformFindingCode) {
        setWaveformFindings(prev => {
            const next = new Set(prev);
            if (next.has(code)) next.delete(code);
            else next.add(code);
            return next;
        });
    }

    // ─── Render ───────────────────────────────────────────────
    return (
        <div
            className="bg-slate-900/60 backdrop-blur-xl border border-amber-500/20 rounded-2xl overflow-hidden"
            role="region"
            aria-label="EKG Monitoring Panel"
        >
            {/* ── Header ── */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800/60 bg-amber-950/10">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-4 h-4 text-amber-400" aria-hidden="true" />
                </div>
                <div className="flex-1">
                    <h3 className="ppn-card-title text-amber-100">EKG Monitoring</h3>
                    <p className="ppn-meta text-slate-400 mt-0.5">
                        Rhythm · Intervals · QTc auto-calc (Bazett)
                        &nbsp;·&nbsp;
                        {heartRate ? (
                            <span className="text-amber-300/80">HR {heartRate} bpm</span>
                        ) : (
                            <span className="text-slate-500">Enter HR above for QTc auto-calc</span>
                        )}
                    </p>
                </div>
                <AdvancedTooltip
                    content="QTc is auto-calculated using the Bazett formula (QTc = QT / √RR) from the Heart Rate entered in this reading. QTc thresholds: <440ms Normal · 440–470ms Borderline · >470ms Prolonged · >500ms Red Flag (Torsades risk). Critical for ibogaine safety monitoring per Dr. Allen's research."
                    tier="detailed"
                    type="info"
                    title="EKG Monitoring"
                    side="bottom-left"
                >
                    <button
                        type="button"
                        aria-label="EKG monitoring information"
                        className="p-1.5 text-slate-500 hover:text-amber-400 transition-colors"
                    >
                        <span className="material-symbols-outlined text-base">info</span>
                    </button>
                </AdvancedTooltip>
            </div>

            <div className="px-5 py-5 space-y-5">

                {/* ── Row 1: Rhythm + QRS Axis ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Rhythm Dropdown */}
                    <div className="space-y-2">
                        <label
                            className="ppn-label text-slate-400 uppercase tracking-wider"
                            htmlFor="ekg-rhythm"
                        >
                            EKG Rhythm
                        </label>
                        <div className="relative">
                            {rhythmsLoading ? (
                                <div className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700/40 rounded-xl text-slate-500 text-sm animate-pulse">
                                    Loading rhythms…
                                </div>
                            ) : (
                                <>
                                    <select
                                        id="ekg-rhythm"
                                        value={rhythmCode}
                                        onChange={e => setRhythmCode(e.target.value)}
                                        aria-label="EKG rhythm classification"
                                        className={`${selectCls} ${selectedRhythm
                                                ? selectedRhythm.severity_tier === 'critical'
                                                    ? 'border-red-500/50 text-red-300'
                                                    : selectedRhythm.severity_tier === 'monitor'
                                                        ? 'border-yellow-500/40 text-yellow-200'
                                                        : 'border-teal-500/40 text-teal-200'
                                                : ''
                                            }`}
                                    >
                                        <option value="">Select rhythm…</option>
                                        {rhythms.map(r => (
                                            <option key={r.code} value={r.code}>
                                                {r.label}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
                                        aria-hidden="true"
                                    />
                                </>
                            )}
                            {rhythmsError && (
                                <p className="ppn-meta text-yellow-400 mt-1">
                                    ⚠️ {rhythmsError}
                                </p>
                            )}
                            {selectedRhythm && (
                                <p
                                    className={`ppn-meta mt-1 font-semibold uppercase tracking-wide ${getRhythmSeverityCls(selectedRhythm.severity_tier)}`}
                                    role="status"
                                    aria-live="polite"
                                >
                                    {selectedRhythm.severity_tier === 'critical'
                                        ? '⚠️ Critical rhythm — clinical response required'
                                        : selectedRhythm.severity_tier === 'monitor'
                                            ? '👁 Monitor — increased observation'
                                            : '✓ Normal rhythm'}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* QRS Axis */}
                    <div className="space-y-2">
                        <label
                            className="ppn-label text-slate-400 uppercase tracking-wider"
                            htmlFor="ekg-qrs-axis"
                        >
                            QRS Axis
                        </label>
                        <div className="relative">
                            <select
                                id="ekg-qrs-axis"
                                value={qrsAxis}
                                onChange={e => setQrsAxis(e.target.value)}
                                aria-label="QRS electrical axis"
                                className={selectCls}
                            >
                                {QRS_AXIS_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
                                aria-hidden="true"
                            />
                        </div>
                    </div>
                </div>

                {/* ── Row 2: PR, QRS Duration, QT Interval ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* PR Interval */}
                    <div className="space-y-2">
                        <label
                            className="ppn-label text-slate-400 uppercase tracking-wider"
                            htmlFor="ekg-pr-interval"
                        >
                            PR Interval
                            <AdvancedTooltip
                                content="Normal PR interval: 120–200 ms. Prolonged PR (>200 ms) = First-degree AV block. Short PR (<120 ms) may indicate pre-excitation (WPW)."
                                tier="micro"
                            >
                                <span className="ml-1 text-slate-500 cursor-help">ⓘ</span>
                            </AdvancedTooltip>
                        </label>
                        <div className="relative">
                            <input
                                id="ekg-pr-interval"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={prIntervalMs}
                                onChange={e => setPrIntervalMs(e.target.value.replace(/\D/g, ''))}
                                placeholder="160"
                                aria-label="PR interval in milliseconds"
                                className={`${inputCls} pr-12`}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none">
                                ms
                            </span>
                        </div>
                        {prIntervalMs && (
                            <p className={`ppn-meta font-semibold ${parseInt(prIntervalMs) > 200
                                    ? 'text-yellow-400'
                                    : parseInt(prIntervalMs) < 120
                                        ? 'text-yellow-400'
                                        : 'text-teal-400'
                                }`}>
                                {parseInt(prIntervalMs) > 200
                                    ? '⚠️ Prolonged (>200ms) — 1° AV Block'
                                    : parseInt(prIntervalMs) < 120
                                        ? '⚠️ Short (<120ms) — Pre-excitation?'
                                        : '✓ Normal range'}
                            </p>
                        )}
                    </div>

                    {/* QRS Duration */}
                    <div className="space-y-2">
                        <label
                            className="ppn-label text-slate-400 uppercase tracking-wider"
                            htmlFor="ekg-qrs-duration"
                        >
                            QRS Duration
                            <AdvancedTooltip
                                content="Normal QRS duration: 60–100 ms. Wide QRS (>120 ms) = Bundle branch block or ventricular conduction defect."
                                tier="micro"
                            >
                                <span className="ml-1 text-slate-500 cursor-help">ⓘ</span>
                            </AdvancedTooltip>
                        </label>
                        <div className="relative">
                            <input
                                id="ekg-qrs-duration"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={qrsDurationMs}
                                onChange={e => setQrsDurationMs(e.target.value.replace(/\D/g, ''))}
                                placeholder="90"
                                aria-label="QRS duration in milliseconds"
                                className={`${inputCls} pr-12`}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none">
                                ms
                            </span>
                        </div>
                        {qrsDurationMs && (
                            <p className={`ppn-meta font-semibold ${parseInt(qrsDurationMs) > 120
                                    ? 'text-yellow-400'
                                    : parseInt(qrsDurationMs) < 60
                                        ? 'text-yellow-400'
                                        : 'text-teal-400'
                                }`}>
                                {parseInt(qrsDurationMs) > 120
                                    ? '⚠️ Wide QRS — BBB or conduction defect'
                                    : parseInt(qrsDurationMs) < 60
                                        ? '⚠️ Narrow (<60ms)'
                                        : '✓ Normal range'}
                            </p>
                        )}
                    </div>

                    {/* QT Interval */}
                    <div className="space-y-2">
                        <label
                            className="ppn-label text-slate-400 uppercase tracking-wider"
                            htmlFor="ekg-qt-interval"
                        >
                            QT Interval (measured)
                            <AdvancedTooltip
                                content="Enter the raw, uncorrected QT interval measured from the EKG. QTc will be auto-calculated using Bazett formula from the Heart Rate entered above."
                                tier="micro"
                            >
                                <span className="ml-1 text-slate-500 cursor-help">ⓘ</span>
                            </AdvancedTooltip>
                        </label>
                        <div className="relative">
                            <input
                                id="ekg-qt-interval"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={qtIntervalMs}
                                onChange={e => setQtIntervalMs(e.target.value.replace(/\D/g, ''))}
                                placeholder="400"
                                aria-label="Measured QT interval in milliseconds"
                                className={`${inputCls} pr-12`}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none">
                                ms
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── QTc Auto-Calc Result Banner ── */}
                {qtIntervalMs && (
                    <div
                        className={`rounded-xl border px-4 py-3 flex items-start gap-3 transition-all ${qtcDisplay
                                ? `${qtcDisplay.bgCls} ${qtcDisplay.borderCls}`
                                : 'bg-slate-800/40 border-slate-700/50'
                            }`}
                        role="status"
                        aria-live="polite"
                        aria-label={`QTc result: ${qtcMs !== null ? `${qtcMs} ms` : 'Awaiting heart rate'}`}
                    >
                        {qtcDisplay ? (
                            <>
                                <qtcDisplay.Icon
                                    className={`w-5 h-5 mt-0.5 flex-shrink-0 ${qtcDisplay.iconCls}`}
                                    aria-hidden="true"
                                />
                                <div className="flex-1">
                                    <div className="flex items-baseline gap-2 flex-wrap">
                                        <span className={`text-2xl font-black font-mono ${qtcDisplay.textCls}`}>
                                            QTc {qtcMs} ms
                                        </span>
                                        <span className={`ppn-meta font-semibold uppercase tracking-wider ${qtcDisplay.textCls}`}>
                                            [{qtcDisplay.label}]
                                        </span>
                                        <span className="ppn-meta text-slate-500">
                                            {qtcDisplay.sublabel}
                                        </span>
                                    </div>
                                    <p className="ppn-meta text-slate-400 mt-0.5">
                                        Bazett formula · QT {qtIntervalMs}ms · HR {heartRate} bpm
                                        {qtcFlag === 'red-flag' && (
                                            <span className="ml-2 text-red-400 font-semibold">
                                                — Consult physician immediately
                                            </span>
                                        )}
                                        {qtcFlag === 'prolonged' && (
                                            <span className="ml-2 text-orange-400 font-semibold">
                                                — Increased monitoring required
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <p className="ppn-meta text-slate-500">
                                QTc auto-calc requires Heart Rate from this reading.
                                Enter HR in the vital signs above.
                            </p>
                        )}
                    </div>
                )}

                {/* ── Waveform Findings ── */}
                <div className="pt-1">
                    <fieldset>
                        <legend className="ppn-label text-slate-400 uppercase tracking-wider mb-3">
                            Waveform Findings
                            <AdvancedTooltip
                                content="Select all observed waveform abnormalities. Multiple selections allowed. Each finding will be recorded for clinical review."
                                tier="micro"
                            >
                                <span className="ml-1 text-slate-500 cursor-help">ⓘ</span>
                            </AdvancedTooltip>
                        </legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {WAVEFORM_FINDINGS.map(finding => {
                                const isChecked = waveformFindings.has(finding.code);
                                return (
                                    <label
                                        key={finding.code}
                                        htmlFor={`ekg-finding-${finding.code}`}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all select-none ${isChecked
                                                ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                                                : 'bg-slate-800/30 border-slate-700/40 text-slate-400 hover:border-slate-600/60 hover:text-slate-300'
                                            }`}
                                    >
                                        <input
                                            id={`ekg-finding-${finding.code}`}
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => toggleFinding(finding.code)}
                                            aria-label={finding.label}
                                            className="sr-only"
                                        />
                                        <span
                                            className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all ${isChecked
                                                    ? 'bg-amber-500 border-amber-400'
                                                    : 'bg-transparent border-slate-600'
                                                }`}
                                            aria-hidden="true"
                                        >
                                            {isChecked && (
                                                <svg
                                                    className="w-3 h-3 text-slate-900"
                                                    viewBox="0 0 12 12"
                                                    fill="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                </svg>
                                            )}
                                        </span>
                                        <span className="text-sm font-medium">{finding.label}</span>
                                    </label>
                                );
                            })}
                        </div>
                        {waveformFindings.size > 0 && (
                            <p className="ppn-meta text-amber-400/80 mt-2 font-semibold">
                                ⚠️ {waveformFindings.size} finding{waveformFindings.size > 1 ? 's' : ''} flagged — document in safety event log if clinically significant
                            </p>
                        )}
                    </fieldset>
                </div>

                {/* ── Display-only notice ── */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-800/50">
                    <span className="ppn-meta text-slate-600">
                        Display only — DB persist after log_ table migration is defined
                        &nbsp;·&nbsp; Level 2 scope post-Friday pilot
                    </span>
                </div>
            </div>
        </div>
    );
};

export default EKGComponent;
