/**
 * PatientProgressSummary — WO-304
 *
 * Printable patient-facing 1-pager showing clinical progress in plain English.
 *
 * Design priorities:
 *  1. No PHI — Subject_ID only. No name, DOB, or contact info.
 *  2. Language guardrails — "tracks" not "diagnoses", "% change in score" not "% better"
 *  3. Print-optimised — white background, black text, @media print safe
 *  4. Growth engine — patient takes it home → word-of-mouth referrals
 *
 * Clinical framing: This is a PROGRESS SUMMARY, not a medical report.
 */

import React, { useRef } from 'react';
import { X, Printer, Download, CheckCircle, Clock, Shield } from 'lucide-react';

// ── CMC thresholds per instrument (clinically meaningful change)
const CMC_THRESHOLDS: Record<string, { threshold: number; label: string; max: number; lowerIsBetter: boolean }> = {
    'PHQ-9': { threshold: 5, label: 'PHQ-9 (Depression)', max: 27, lowerIsBetter: true },
    'GAD-7': { threshold: 5, label: 'GAD-7 (Anxiety)', max: 21, lowerIsBetter: true },
    'CAPS-5': { threshold: 10, label: 'CAPS-5 (PTSD)', max: 80, lowerIsBetter: true },
    'MADRS': { threshold: 12, label: 'MADRS (Depression)', max: 60, lowerIsBetter: true },
    'MEQ-30': { threshold: 60, label: 'MEQ-30 (Mystical)', max: 150, lowerIsBetter: false },
};

export interface ProgressSummaryData {
    subjectId: string;
    clinicianName: string;
    clinicName: string;
    primaryInstrument: string;
    baselineScore: number;
    endpointScore: number;
    followupWeeks: number;
    completedStages: Array<'intake' | 'preparation' | 'dosing' | 'integration' | 'followup'>;
    nextSteps: string[];
    sessionDate?: string;
    substance?: string;
}

interface PatientProgressSummaryProps {
    data: ProgressSummaryData;
    onClose: () => void;
}

// Ordered journey stages for timeline
const STAGE_CONFIG: Array<{
    key: 'intake' | 'preparation' | 'dosing' | 'integration' | 'followup';
    label: string;
    icon: string;
}> = [
        { key: 'intake', label: 'Intake', icon: '📋' },
        { key: 'preparation', label: 'Preparation', icon: '🧘' },
        { key: 'dosing', label: 'Session', icon: '✦' },
        { key: 'integration', label: 'Integration', icon: '🔄' },
        { key: 'followup', label: 'Follow-up', icon: '📊' },
    ];

function generateInterpretation(data: ProgressSummaryData): string {
    const cmc = CMC_THRESHOLDS[data.primaryInstrument];
    if (!cmc) return '';

    const change = data.baselineScore - data.endpointScore;
    const pct = Math.round(Math.abs(change) / data.baselineScore * 100);
    const improved = cmc.lowerIsBetter ? change > 0 : change < 0;
    const meetsResponse = Math.abs(change) >= cmc.threshold;

    const direction = improved ? 'improved' : 'changed';
    const responseStatement = meetsResponse
        ? `Based on published clinical research standards, this level of improvement meets the threshold for a clinically meaningful response on the ${data.primaryInstrument}.`
        : `While progress has been made, continued follow-up and integration support are recommended to further consolidate treatment gains.`;

    return `Your responses to the ${cmc.label} ${direction} by ${pct}% over ${data.followupWeeks} weeks of treatment. ${responseStatement} Continued integration support is associated with maintaining and extending these gains over the long term.`;
}

export const PatientProgressSummary: React.FC<PatientProgressSummaryProps> = ({ data, onClose }) => {
    const printRef = useRef<HTMLDivElement>(null);

    const cmc = CMC_THRESHOLDS[data.primaryInstrument] ?? { threshold: 5, max: 27, lowerIsBetter: true, label: data.primaryInstrument };
    const change = cmc.lowerIsBetter
        ? data.baselineScore - data.endpointScore
        : data.endpointScore - data.baselineScore;
    const pctChange = data.baselineScore > 0 ? Math.round(Math.abs(change) / data.baselineScore * 100) : 0;
    const improved = change > 0;
    const meetsResponse = Math.abs(change) >= cmc.threshold;
    const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const interpretation = generateInterpretation(data);

    const handlePrint = () => {
        window.print();
    };

    // Scale score to percentage of max for bar visual
    const baselinePct = Math.min(100, (data.baselineScore / cmc.max) * 100);
    const endpointPct = Math.min(100, (data.endpointScore / cmc.max) * 100);

    return (
        /* Backdrop */
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 print:hidden-backdrop">
            {/* Summary panel — screen view */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto print:overflow-visible relative">

                {/* Screen-only toolbar */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 print:hidden">
                    <div>
                        <h2 className="text-lg font-black text-gray-900">Progress Summary Preview</h2>
                        <p className="text-sm text-gray-500">Review before printing or saving as PDF</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors"
                        >
                            <Printer className="w-4 h-4" />
                            Print / Save PDF
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            aria-label="Close preview"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* ══ PRINTABLE CONTENT — everything below is in the PDF ══ */}
                <div ref={printRef} className="p-8 space-y-6 print:p-6 print:space-y-5">

                    {/* Header */}
                    <div className="flex items-start justify-between border-b-2 border-gray-200 pb-4">
                        <div>
                            <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">PPN CLINICAL PROGRESS SUMMARY</p>
                            <h1 className="text-2xl font-black text-gray-900">{data.clinicName}</h1>
                            <p className="text-sm text-gray-500 mt-1">Clinician: {data.clinicianName}</p>
                        </div>
                        <div className="text-right">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg">
                                <Shield className="w-3.5 h-3.5 text-indigo-500" />
                                <span className="text-indigo-700 text-xs font-black">{data.subjectId}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Prepared: {generatedDate}</p>
                            {data.sessionDate && <p className="text-xs text-gray-400">Session: {data.sessionDate}</p>}
                        </div>
                    </div>

                    {/* Section 1: Journey Timeline */}
                    <div>
                        <h2 className="text-sm font-black text-gray-700 uppercase tracking-widest mb-4">Your Journey at a Glance</h2>
                        <div className="flex items-center gap-0">
                            {STAGE_CONFIG.map((stage, idx) => {
                                const done = data.completedStages.includes(stage.key);
                                const isLast = idx === STAGE_CONFIG.length - 1;
                                return (
                                    <React.Fragment key={stage.key}>
                                        <div className="flex flex-col items-center gap-1 flex-shrink-0">
                                            <div className={`
                                                w-10 h-10 rounded-full flex items-center justify-center text-base border-2
                                                ${done
                                                    ? 'bg-indigo-600 border-indigo-600 text-white'
                                                    : 'bg-gray-100 border-gray-300 text-gray-400'}
                                            `}>
                                                {done ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-4 h-4" />}
                                            </div>
                                            <span className={`text-[10px] font-bold text-center leading-tight ${done ? 'text-indigo-700' : 'text-gray-400'}`}>
                                                {stage.label}
                                            </span>
                                        </div>
                                        {!isLast && (
                                            <div className={`flex-1 h-0.5 mb-5 ${done && data.completedStages.includes(STAGE_CONFIG[idx + 1].key) ? 'bg-indigo-400' : 'bg-gray-200'}`} />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>

                    {/* Section 2: Score Progress */}
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <h2 className="text-sm font-black text-gray-700 uppercase tracking-widest mb-5">Symptom Score Progress</h2>

                        {/* Big numbers */}
                        <div className="grid grid-cols-3 gap-4 mb-5">
                            <div className="text-center">
                                <p className="text-4xl font-black text-gray-800">{data.baselineScore}<span className="text-lg text-gray-400">/{cmc.max}</span></p>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mt-1">{cmc.label} Baseline</p>
                            </div>
                            <div className="text-center flex flex-col items-center justify-center">
                                <span className="text-2xl font-black text-gray-400">→</span>
                            </div>
                            <div className="text-center">
                                <p className={`text-4xl font-black ${improved ? 'text-indigo-700' : 'text-gray-800'}`}>
                                    {data.endpointScore}<span className="text-lg text-gray-400">/{cmc.max}</span>
                                </p>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mt-1">At Week {data.followupWeeks}</p>
                            </div>
                        </div>

                        {/* Score improvement highlight */}
                        <div className={`text-center p-3 rounded-xl mb-4 ${improved ? 'bg-indigo-50 border border-indigo-200' : 'bg-gray-100 border border-gray-200'}`}>
                            <p className={`text-2xl font-black ${improved ? 'text-indigo-700' : 'text-gray-700'}`}>
                                {improved ? `↓ ${pctChange}% reduction` : `${pctChange}% change`}
                            </p>
                            <p className="text-xs text-gray-500 font-semibold mt-1">Score change over {data.followupWeeks} weeks</p>
                        </div>

                        {/* Before/after bar visual */}
                        <div className="space-y-2">
                            <div>
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Starting score</span>
                                    <span>{data.baselineScore}/{cmc.max}</span>
                                </div>
                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-gray-500 rounded-full" style={{ width: `${baselinePct}%` }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Current score</span>
                                    <span>{data.endpointScore}/{cmc.max}</span>
                                </div>
                                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${improved ? 'bg-indigo-500' : 'bg-gray-400'}`} style={{ width: `${endpointPct}%` }} />
                                </div>
                            </div>
                        </div>

                        {/* Clinical response status */}
                        <div className={`flex items-center gap-2 mt-4 p-2.5 rounded-lg border ${meetsResponse && improved ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                            <CheckCircle className={`w-4 h-4 flex-shrink-0 ${meetsResponse && improved ? 'text-emerald-600' : 'text-amber-500'}`} />
                            <p className={`text-xs font-black ${meetsResponse && improved ? 'text-emerald-700' : 'text-amber-700'}`}>
                                Clinical Response: {meetsResponse && improved ? '[STATUS: ACHIEVED]' : '[STATUS: IN PROGRESS]'}
                            </p>
                        </div>

                        {cmc.lowerIsBetter && (
                            <p className="text-[11px] text-gray-400 mt-2 italic">
                                A reduction of {cmc.threshold}+ points on the {data.primaryInstrument} represents a clinically meaningful change per published research criteria.
                            </p>
                        )}
                    </div>

                    {/* Section 3: Plain-English Interpretation */}
                    <div>
                        <h2 className="text-sm font-black text-gray-700 uppercase tracking-widest mb-3">What This Means</h2>
                        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                            <p className="text-sm text-indigo-900 leading-relaxed">{interpretation}</p>
                        </div>
                    </div>

                    {/* Section 4: Next Steps */}
                    <div>
                        <h2 className="text-sm font-black text-gray-700 uppercase tracking-widest mb-3">Your Next Steps</h2>
                        <ul className="space-y-2">
                            {(data.nextSteps.length > 0
                                ? data.nextSteps
                                : ['30-day reassessment recommended', 'Continue daily integration practices', 'Follow up with your care team if symptoms change']
                            ).map((step, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                    <CheckCircle className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-gray-700">{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Substance note */}
                    {data.substance && (
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                            <p className="text-xs text-slate-600"><span className="font-bold">Treatment modality:</span> {data.substance}-assisted therapy</p>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="border-t-2 border-gray-200 pt-4 flex items-start justify-between">
                        <div>
                            <p className="text-[11px] text-gray-400 font-black uppercase tracking-wide">CONFIDENTIAL — For Patient Use Only</p>
                            <p className="text-[10px] text-gray-300 mt-0.5">
                                This summary tracks self-reported outcomes and is not a medical diagnosis.
                                All clinical decisions remain the responsibility of the licensed healthcare provider.
                            </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <p className="text-[10px] text-gray-400 font-bold">Generated by PPN Portal</p>
                            <p className="text-[10px] text-gray-300">ppn.care · {generatedDate}</p>
                        </div>
                    </div>

                </div>
                {/* ══ END PRINTABLE CONTENT ══ */}

            </div>
        </div>
    );
};

export default PatientProgressSummary;
