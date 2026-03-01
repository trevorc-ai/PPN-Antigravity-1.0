import React, { useState, useCallback } from 'react';
import { Activity, Plus, Trash2, AlertTriangle, Clock } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';

// ─── Device Preset List ──────────────────────────────────────────────────────
// 12 clinical ECG devices known to be used in psychedelic-assisted therapy
// settings. Dr. Allen reply pending (WO-413 — TODO: update defaults on reply).
export const QT_DEVICE_PRESETS = [
    'GE MAC 5500',
    'GE MAC 7',
    'Philips PageWriter TC35',
    'Philips PageWriter TC50',
    'Philips PageWriter TC70',
    'Mortara ELI 380',
    'Mortara ELI 280',
    'Edan SE-1202',
    'AliveCor KardiaMobile 6L',
    'QT Medical PCA 500',
    'Schiller AT-10',
    'Nihon Kohden ECG-2550',
] as const;

// ─── QT Method Presets ───────────────────────────────────────────────────────
// Each EKG device may use a different QTc correction formula.
// Labeling the method per reading enables cross-device correlation research.
const QT_METHODS = [
    'Bazett',
    'Fridericia',
    'Framingham',
    'Hodges',
    'Simpson',
    'Pearson',
    'Device Auto',
    'Other',
] as const;

type QTMethod = (typeof QT_METHODS)[number];

// ─── Types ───────────────────────────────────────────────────────────────────
export interface QTReading {
    id: string;
    recordedAt: string;      // ISO datetime string
    deviceAValue: string;    // ms, kept as string for controlled input
    deviceBValue: string;    // ms, kept as string for controlled input
    methodA: QTMethod | '';
    methodB: QTMethod | '';
}

interface QTIntervalTrackerProps {
    /** Label for the first device. Default: 'Philips IntelliVue'. Confirmed: Dr. Allen 2026-02-25. */
    deviceALabel?: string;
    /** Label for the second device. Default: 'Schiller ETM'. Confirmed: Dr. Allen 2026-02-25. */
    deviceBLabel?: string;
    /**
     * Delta threshold (ms) for flagging [STATUS: DIVERGENCE].
     * Default: 50ms — confirmed by Dr. Allen 2026-02-25.
     */
    divergenceThresholdMs?: number;
    /**
     * Absolute QTc danger threshold (ms). Any single-device reading ≥ this value
     * triggers [STATUS: DANGER — QTc ≥ 500ms]. Default: 500ms — Dr. Allen confirmed.
     */
    dangerThresholdMs?: number;
    /**
     * Absolute QTc caution threshold (ms). Readings in [cautionThresholdMs, dangerThresholdMs)
     * trigger [STATUS: CAUTION — Approaching 500ms]. Default: 475ms.
     * Implements Dr. Allen's "approaching 500ms" directive (2026-02-25).
     */
    cautionThresholdMs?: number;
    /** Called whenever readings change — parent can persist or display summary. */
    onReadingsChange?: (readings: QTReading[]) => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function nowStamp(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function makeEmptyReading(): QTReading {
    return {
        id: `qt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        recordedAt: nowStamp(),
        deviceAValue: '',
        deviceBValue: '',
        methodA: '',
        methodB: '',
    };
}

function calcDelta(a: string, b: string): number | null {
    const aNum = parseInt(a, 10);
    const bNum = parseInt(b, 10);
    if (isNaN(aNum) || isNaN(bNum)) return null;
    return Math.abs(aNum - bNum);
}

// ─── Component ───────────────────────────────────────────────────────────────
export const QTIntervalTracker: React.FC<QTIntervalTrackerProps> = ({
    deviceALabel = 'Philips IntelliVue',
    deviceBLabel = 'Schiller ETM',
    divergenceThresholdMs = 50,   // ✅ Confirmed by Dr. Allen 2026-02-25
    dangerThresholdMs = 500,      // ✅ Confirmed by Dr. Allen 2026-02-25 — hERG channel block risk
    cautionThresholdMs = 475,     // ✅ "Approaching 500ms" — Dr. Allen 2026-02-25
    onReadingsChange,
}) => {
    const [readings, setReadings] = useState<QTReading[]>([makeEmptyReading()]);

    const updateReading = useCallback(
        (id: string, field: keyof QTReading, value: string) => {
            setReadings(prev => {
                const next = prev.map(r => (r.id === id ? { ...r, [field]: value } : r));
                onReadingsChange?.(next);
                return next;
            });
        },
        [onReadingsChange]
    );

    const addReading = () => {
        setReadings(prev => {
            const next = [...prev, makeEmptyReading()];
            onReadingsChange?.(next);
            return next;
        });
    };

    const removeReading = (id: string) => {
        setReadings(prev => {
            if (prev.length <= 1) return prev;
            const next = prev.filter(r => r.id !== id);
            onReadingsChange?.(next);
            return next;
        });
    };

    const setNow = (id: string) => updateReading(id, 'recordedAt', nowStamp());

    // ─── Input shared class ─────────────────────────────────────
    const inputCls =
        'w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700/60 focus:border-amber-500/60 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all placeholder:text-slate-600';
    const selectCls =
        'w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700/60 focus:border-amber-500/60 rounded-xl text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all appearance-none';

    return (
        <div
            className="bg-slate-900/60 backdrop-blur-xl border border-amber-500/20 rounded-2xl overflow-hidden"
            role="region"
            aria-label="QT Interval Tracker"
        >
            {/* ── Header ── */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800/60 bg-amber-950/10">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-4 h-4 text-amber-400" aria-hidden="true" />
                </div>
                <div className="flex-1">
                    <h3 className="ppn-card-title text-amber-100">QT Interval Tracker</h3>
                    <p className="ppn-meta text-slate-400 mt-0.5">
                        Divergence flag at ≥{divergenceThresholdMs}ms &nbsp;·&nbsp; Dual-device correlation
                    </p>
                </div>
                <AdvancedTooltip
                    content={`Tracks QT interval readings from two devices simultaneously. A [STATUS: DIVERGENCE] flag appears when the two readings differ by ≥${divergenceThresholdMs}ms. Ibogaine-specific: mandatory cardiac monitoring. Threshold pending Dr. Allen confirmation.`}
                    tier="detailed"
                    type="info"
                    title="QT Interval Tracker"
                    side="bottom-left"
                >
                    <button
                        type="button"
                        aria-label="QT Tracker information"
                        className="p-1.5 text-slate-500 hover:text-amber-400 transition-colors"
                    >
                        <span className="material-symbols-outlined text-base">info</span>
                    </button>
                </AdvancedTooltip>
            </div>

            {/* ── Column Headers ── */}
            <div className="px-5 pt-4 pb-1">
                <div className="grid grid-cols-[1fr_1fr_1fr_80px_80px_36px] gap-2 items-center">
                    <span className="ppn-label text-slate-500 uppercase tracking-wider">Time</span>
                    <span className="ppn-label text-slate-500 uppercase tracking-wider">{deviceALabel} (ms)</span>
                    <span className="ppn-label text-slate-500 uppercase tracking-wider">{deviceBLabel} (ms)</span>
                    <span className="ppn-label text-slate-500 uppercase tracking-wider text-center">Δ Delta</span>
                    <span className="ppn-label text-slate-500 uppercase tracking-wider text-center">Status</span>
                    <span className="sr-only">Remove</span>
                </div>
            </div>

            {/* ── Reading Rows ── */}
            <div className="px-5 pb-4 space-y-3">
                {readings.map((reading, index) => {
                    const delta = calcDelta(reading.deviceAValue, reading.deviceBValue);
                    const isDivergent = delta !== null && delta >= divergenceThresholdMs;
                    const bothEntered = reading.deviceAValue !== '' && reading.deviceBValue !== '';

                    // Per-device absolute QTc threshold evaluation (Dr. Allen 2026-02-25)
                    const aVal = parseInt(reading.deviceAValue, 10);
                    const bVal = parseInt(reading.deviceBValue, 10);
                    const aIsDanger = !isNaN(aVal) && aVal >= dangerThresholdMs;
                    const bIsDanger = !isNaN(bVal) && bVal >= dangerThresholdMs;
                    const aIsCaution = !isNaN(aVal) && aVal >= cautionThresholdMs && aVal < dangerThresholdMs;
                    const bIsCaution = !isNaN(bVal) && bVal >= cautionThresholdMs && bVal < dangerThresholdMs;
                    const anyDanger = aIsDanger || bIsDanger;
                    const anyCaution = !anyDanger && (aIsCaution || bIsCaution);

                    return (
                        <div
                            key={reading.id}
                            className={`rounded-xl border transition-all duration-200 ${isDivergent
                                ? 'border-red-500/50 bg-red-950/10'
                                : 'border-slate-700/40 bg-slate-800/20'
                                }`}
                            role="row"
                            aria-label={`QT Reading ${index + 1}${isDivergent ? ' — DIVERGENCE' : ''}`}
                        >
                            <div className="grid grid-cols-[1fr_1fr_1fr_80px_80px_36px] gap-2 items-center p-3">

                                {/* Time stamp */}
                                <div className="space-y-1">
                                    <div className="flex gap-1.5">
                                        <input
                                            id={`qt-time-${reading.id}`}
                                            type="datetime-local"
                                            tabIndex={-1}
                                            value={reading.recordedAt}
                                            onChange={e => updateReading(reading.id, 'recordedAt', e.target.value)}
                                            aria-label={`Reading ${index + 1} time`}
                                            className={inputCls + ' text-xs'}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setNow(reading.id)}
                                            aria-label="Set time to now"
                                            className="px-2 py-2 bg-slate-700/50 hover:bg-slate-600/60 border border-slate-600/50 rounded-lg text-slate-400 hover:text-slate-200 transition-all flex-shrink-0"
                                        >
                                            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>

                                {/* Device A */}
                                <div className="space-y-1">
                                    <input
                                        id={`qt-device-a-${reading.id}`}
                                        type="number"
                                        inputMode="numeric"
                                        min={200}
                                        max={800}
                                        step={5}
                                        value={reading.deviceAValue}
                                        onChange={e => updateReading(reading.id, 'deviceAValue', e.target.value)}
                                        placeholder="420"
                                        aria-label={`${deviceALabel} QT reading in milliseconds — 5ms increments`}
                                        className={`${inputCls} ${aIsDanger ? 'border-red-500/70 bg-red-950/20' : aIsCaution ? 'border-amber-500/70 bg-amber-950/20' : ''}`}
                                    />
                                    <select
                                        value={reading.methodA}
                                        onChange={e => updateReading(reading.id, 'methodA', e.target.value)}
                                        aria-label={`${deviceALabel} QT calculation method`}
                                        className={selectCls + ' text-xs py-1.5'}
                                    >
                                        <option value="">Method...</option>
                                        {QT_METHODS.map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Device B */}
                                <div className="space-y-1">
                                    <input
                                        id={`qt-device-b-${reading.id}`}
                                        type="number"
                                        inputMode="numeric"
                                        min={200}
                                        max={800}
                                        step={5}
                                        value={reading.deviceBValue}
                                        onChange={e => updateReading(reading.id, 'deviceBValue', e.target.value)}
                                        placeholder="415"
                                        aria-label={`${deviceBLabel} QT reading in milliseconds — 5ms increments`}
                                        className={`${inputCls} ${bIsDanger ? 'border-red-500/70 bg-red-950/20' : bIsCaution ? 'border-amber-500/70 bg-amber-950/20' : ''}`}
                                    />
                                    <select
                                        value={reading.methodB}
                                        onChange={e => updateReading(reading.id, 'methodB', e.target.value)}
                                        aria-label={`${deviceBLabel} QT calculation method`}
                                        className={selectCls + ' text-xs py-1.5'}
                                    >
                                        <option value="">Method...</option>
                                        {QT_METHODS.map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Delta — auto-calculated */}
                                <div className="flex flex-col items-center justify-center gap-1 min-h-[52px]">
                                    {delta !== null ? (
                                        <span
                                            className={`text-base font-black font-mono ${isDivergent ? 'text-red-400' : 'text-slate-300'}`}
                                            aria-label={`Delta ${delta} milliseconds`}
                                        >
                                            {delta}ms
                                        </span>
                                    ) : (
                                        <span className="ppn-meta text-slate-600">—</span>
                                    )}
                                </div>

                                {/* Status badge */}
                                <div className="flex flex-col items-center justify-center min-h-[52px]">
                                    {!bothEntered ? (
                                        <span className="ppn-meta text-slate-600 text-center leading-tight">—</span>
                                    ) : isDivergent ? (
                                        <AdvancedTooltip
                                            content={`Delta (${delta}ms) ≥ ${divergenceThresholdMs}ms threshold. Two devices are reporting meaningfully different QT values. Verify device leads, patient position, and calculation method before clinical decision-making.`}
                                            tier="detailed"
                                            type="warning"
                                            title="QT Divergence"
                                            side="bottom-left"
                                        >
                                            <div
                                                className="flex flex-col items-center gap-0.5 cursor-help"
                                                role="status"
                                                aria-label="Status: Divergence detected"
                                            >
                                                <AlertTriangle
                                                    className="w-4 h-4 text-red-400"
                                                    aria-hidden="true"
                                                />
                                                <span className="ppn-meta text-red-400 font-black uppercase tracking-wide leading-tight text-center">
                                                    DIVERG.
                                                </span>
                                            </div>
                                        </AdvancedTooltip>
                                    ) : (
                                        <div
                                            className="flex flex-col items-center gap-0.5"
                                            role="status"
                                            aria-label="Status: Within threshold"
                                        >
                                            <span className="material-symbols-outlined text-base text-teal-400" aria-hidden="true">
                                                check_circle
                                            </span>
                                            <span className="ppn-meta text-teal-400 font-semibold leading-tight text-center">
                                                OK
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Remove button */}
                                <div className="flex items-center justify-center">
                                    {readings.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeReading(reading.id)}
                                            aria-label={`Remove reading ${index + 1}`}
                                            className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* ── Absolute QTc DANGER banner (≥ 500ms) — patient safety critical ── */}
                            {anyDanger && (
                                <div
                                    className="flex items-center gap-2 px-4 py-2.5 bg-red-600/20 border-t border-red-500/60 rounded-b-xl"
                                    role="alert"
                                    aria-live="assertive"
                                    aria-atomic="true"
                                >
                                    <AlertTriangle className="w-4 h-4 text-red-300 flex-shrink-0" aria-hidden="true" />
                                    <span className="text-sm font-black text-red-200 uppercase tracking-wide">
                                        [STATUS: DANGER — QTc ≥ {dangerThresholdMs}ms]
                                    </span>
                                    <span className="ppn-meta text-red-300 ml-1">
                                        {aIsDanger && `${deviceALabel}: ${aVal}ms`}{aIsDanger && bIsDanger && ' · '}{bIsDanger && `${deviceBLabel}: ${bVal}ms`}.
                                        Arrhythmia risk elevated. Assess for Torsades de Pointes.
                                    </span>
                                </div>
                            )}

                            {/* ── Absolute QTc CAUTION banner (475–499ms) — approaching danger ── */}
                            {anyCaution && (
                                <div
                                    className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border-t border-amber-500/30 rounded-b-xl"
                                    role="alert"
                                    aria-live="polite"
                                >
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" aria-hidden="true" />
                                    <span className="ppn-meta text-amber-300 font-semibold">
                                        [STATUS: CAUTION — Approaching {dangerThresholdMs}ms]
                                        {aIsCaution && ` ${deviceALabel}: ${aVal}ms`}{aIsCaution && bIsCaution && ' ·'}{bIsCaution && ` ${deviceBLabel}: ${bVal}ms`}.
                                        Monitor closely. Increase reading frequency.
                                    </span>
                                </div>
                            )}

                            {/* ── Divergence banner — inter-device delta ── */}
                            {isDivergent && (
                                <div
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border-t border-red-500/30 rounded-b-xl"
                                    role="alert"
                                    aria-live="assertive"
                                >
                                    <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" aria-hidden="true" />
                                    <span className="ppn-meta text-red-300 font-semibold">
                                        [STATUS: DIVERGENCE] — Δ{delta}ms ≥ {divergenceThresholdMs}ms threshold. Verify leads and methodology before clinical decision.
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ── Footer — Add Reading ── */}
            <div className="flex items-center gap-3 px-5 py-4 border-t border-slate-800/60 bg-slate-900/30">
                <button
                    type="button"
                    onClick={addReading}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/60 hover:bg-amber-900/30 border border-slate-600/50 hover:border-amber-500/40 text-slate-300 hover:text-amber-200 rounded-xl text-sm font-semibold transition-all active:scale-95"
                    aria-label="Add another QT reading row"
                >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    Add Reading
                </button>
                <span className="ppn-meta text-slate-500 ml-1">
                    {readings.length} reading{readings.length !== 1 ? 's' : ''} this session
                    &nbsp;·&nbsp; Display only — DB persist after INSPECTOR migration
                </span>
            </div>
        </div>
    );
};

export default QTIntervalTracker;
