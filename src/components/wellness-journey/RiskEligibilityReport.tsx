import React, { useState } from 'react';
import {
    ShieldOff, AlertTriangle, ShieldCheck, ChevronDown, ChevronUp,
    FileText, ClipboardCheck, Lock, Unlock, Info
} from 'lucide-react';
import type { ContraindicationResult, ContraindicationFlag } from '../../services/contraindicationEngine';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';

// ============================================================================
// PROPS
// ============================================================================

interface RiskEligibilityReportProps {
    result: ContraindicationResult;
    onOverrideConfirmed?: (justification: string) => void; // called when provider checks override
    onExportPDF?: () => void;
    onProceedToPhase2?: () => void;
    onValidityChange?: (canProceed: boolean) => void;
    hideProceedButton?: boolean;
}

// ============================================================================
// BADGE — text-labeled, never color-only (INSPECTOR requirement)
// ============================================================================

const SeverityBadge: React.FC<{ severity: 'ABSOLUTE' | 'RELATIVE'; category: string }> = ({ severity, category }) => {
    const isAbsolute = severity === 'ABSOLUTE';
    return (
        <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${isAbsolute
                ? 'bg-red-500/15 border-red-500/30 text-red-300'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                }`}>
                {isAbsolute ? '[ABSOLUTE]' : '[RELATIVE]'}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider bg-slate-700/60 border border-slate-600/50 text-slate-300">
                {category}
            </span>
        </div>
    );
};

// ============================================================================
// INDIVIDUAL FLAG CARD
// ============================================================================

const FlagCard: React.FC<{ flag: ContraindicationFlag }> = ({ flag }) => {
    const [expanded, setExpanded] = useState(false);
    const isAbsolute = flag.severity === 'ABSOLUTE';

    return (
        <div className={`rounded-xl border p-4 transition-all ${isAbsolute
            ? 'bg-red-950/20 border-red-500/25'
            : 'bg-amber-950/15 border-amber-500/20'
            }`}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <SeverityBadge severity={flag.severity} category={flag.category} />
                    <p className={`mt-2 text-sm font-semibold leading-snug ${isAbsolute ? 'text-red-200' : 'text-amber-200'
                        }`}>
                        {flag.headline}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">Source: {flag.source}</p>
                </div>
                <button
                    onClick={() => setExpanded(e => !e)}
                    aria-expanded={expanded}
                    aria-label={expanded ? 'Collapse flag detail' : 'Expand flag detail'}
                    className="flex-shrink-0 p-1.5 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-[#A8B5D1] transition-colors"
                >
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
            </div>

            {expanded && (
                <div className="mt-3 pt-3 border-t border-slate-700/50 space-y-2 animate-in fade-in duration-200">
                    <p className="text-sm text-slate-300 leading-relaxed">{flag.detail}</p>
                    <p className="text-xs text-slate-500">
                        <span className="font-semibold text-slate-400">Regulatory basis:</span> {flag.regulatoryBasis}
                    </p>
                </div>
            )}
        </div>
    );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const RiskEligibilityReport: React.FC<RiskEligibilityReportProps> = ({
    result,
    onOverrideConfirmed,
    onExportPDF,
    onProceedToPhase2,
    onValidityChange,
    hideProceedButton = false,
}) => {
    const [overrideChecked, setOverrideChecked] = useState(false);
    const [justification, setJustification] = useState('');
    const [justificationError, setJustificationError] = useState('');

    const isBlocked = result.verdict === 'DO_NOT_PROCEED';
    const isCaution = result.verdict === 'PROCEED_WITH_CAUTION';
    const isClear = result.verdict === 'CLEAR';

    const totalFlags = result.absoluteFlags.length + result.relativeFlags.length;

    // ── Verdict banner config ─────────────────────────────────────────────────

    const verdictConfig = {
        DO_NOT_PROCEED: {
            icon: <ShieldOff className="w-6 h-6 text-red-400 flex-shrink-0" />,
            label: '[DO NOT PROCEED]',
            sublabel: `${result.absoluteFlags.length} absolute contraindication${result.absoluteFlags.length !== 1 ? 's' : ''} detected`,
            bannerClass: 'bg-red-950/40 border-red-500/40',
            textClass: 'text-red-300',
            sublabelClass: 'text-red-400/80',
        },
        PROCEED_WITH_CAUTION: {
            icon: <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0" />,
            label: '[PROCEED WITH CAUTION]',
            sublabel: `${result.relativeFlags.length} relative contraindication${result.relativeFlags.length !== 1 ? 's' : ''} — provider documentation required`,
            bannerClass: 'bg-amber-950/30 border-amber-500/30',
            textClass: 'text-amber-300',
            sublabelClass: 'text-amber-400/80',
        },
        CLEAR: {
            icon: <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />,
            label: '[CLEAR — ELIGIBLE TO PROCEED]',
            sublabel: 'No contraindications detected. Phase 2 dosing session may proceed.',
            bannerClass: 'bg-emerald-950/30 border-emerald-500/30',
            textClass: 'text-emerald-300',
            sublabelClass: 'text-emerald-400/80',
        },
    }[result.verdict];

    // ── Override handler ──────────────────────────────────────────────────────

    const handleOverrideConfirm = () => {
        if (!justification.trim() || justification.trim().length < 20) {
            setJustificationError('Clinical justification must be at least 20 characters.');
            return;
        }
        setJustificationError('');
        onOverrideConfirmed?.(justification.trim());
    };

    const canProceed = isClear || (isCaution && overrideChecked && justification.trim().length >= 20);

    React.useEffect(() => {
        onValidityChange?.(canProceed);
    }, [canProceed, onValidityChange]);

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="h-full flex flex-col bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 md:p-8 shadow-xl space-y-5 animate-in fade-in duration-500">

            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-700/50 flex-shrink-0">
                <FileText className="w-6 h-6 text-slate-400" />
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black text-[#A8B5D1]">Risk Eligibility Report</h2>
                        <AdvancedTooltip
                            content="Review of absolute and relative contraindications algorithmically determined from patient history and intended substance."
                            tier="standard"
                            side="top"
                        >
                            <Info className="w-4 h-4 text-slate-500 hover:text-white transition-colors cursor-help print:hidden" />
                        </AdvancedTooltip>
                    </div>
                    <p className="text-sm text-slate-400 mt-0.5">
                        Generated {new Date(result.generatedAt).toLocaleString('en-US')} · Substance: {result.sessionSubstance}
                    </p>
                </div>
            </div>

            {/* Verdict Banner */}
            <div className={`flex items-start gap-3 p-4 rounded-xl border flex-shrink-0 ${verdictConfig.bannerClass}`}>
                {verdictConfig.icon}
                <div>
                    <p className={`text-base font-black tracking-wide ${verdictConfig.textClass}`}>
                        {verdictConfig.label}
                    </p>
                    <p className={`text-sm mt-0.5 ${verdictConfig.sublabelClass}`}>
                        {verdictConfig.sublabel}
                    </p>
                </div>
            </div>

            {/* Absolute Contraindication Flags */}
            {result.absoluteFlags.length > 0 && (
                <div className="space-y-3 flex-shrink-0">
                    <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" aria-hidden="true" />
                        Absolute Contraindications ({result.absoluteFlags.length})
                    </h3>
                    {result.absoluteFlags.map(flag => (
                        <FlagCard key={flag.id} flag={flag} />
                    ))}
                </div>
            )}

            {/* Relative Contraindication Flags */}
            {result.relativeFlags.length > 0 && (
                <div className="space-y-3 flex-shrink-0">
                    <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" aria-hidden="true" />
                        Relative Contraindications ({result.relativeFlags.length})
                    </h3>
                    {result.relativeFlags.map(flag => (
                        <FlagCard key={flag.id} flag={flag} />
                    ))}
                </div>
            )}

            {/* CLEAR state — no flags */}
            {isClear && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <p className="text-sm text-emerald-300">
                        All {Object.keys({}).length === 0 ? 'standard' : ''} screening criteria reviewed. No contraindication flags were raised for this patient and substance combination.
                    </p>
                </div>
            )}

            {/* Provider Override Block (PROCEED_WITH_CAUTION only) */}
            {isCaution && (
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-600/50 space-y-3 flex-shrink-0">
                    <p className="text-sm font-semibold text-[#A8B5D1] flex items-center gap-2">
                        <ClipboardCheck className="w-4 h-4 text-amber-400" />
                        Provider Documentation Required
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Relative contraindications have been identified. To proceed to Phase 2, you must document your clinical justification below and acknowledge the flagged risks.
                    </p>

                    <textarea
                        id="contraindication-justification"
                        value={justification}
                        onChange={e => { setJustification(e.target.value); setJustificationError(''); }}
                        placeholder="Document your clinical rationale for proceeding despite the flagged relative contraindications. Include any mitigating factors, additional assessments, or specialist consultations conducted..."
                        rows={4}
                        className="w-full bg-slate-900/60 border border-slate-600 rounded-xl px-4 py-3 text-sm text-[#A8B5D1] placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 resize-none"
                        aria-label="Clinical justification for proceeding"
                        aria-describedby={justificationError ? 'justification-error' : undefined}
                    />
                    {justificationError && (
                        <p id="justification-error" className="text-xs text-red-400" role="alert">{justificationError}</p>
                    )}

                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            id="contraindication-override-confirm"
                            checked={overrideChecked}
                            onChange={e => setOverrideChecked(e.target.checked)}
                            className="mt-0.5 w-4 h-4 rounded border-slate-500 bg-slate-800 text-amber-500 focus:ring-amber-500/30 flex-shrink-0"
                        />
                        <span className="text-sm text-slate-300 group-hover:text-[#A8B5D1] transition-colors leading-relaxed">
                            I acknowledge the flagged relative contraindications and confirm I have documented my clinical justification to proceed. This decision will be logged to the patient record.
                        </span>
                    </label>
                </div>
            )}

            {/* Actions Footer */}
            <div className="flex flex-wrap items-center gap-3 pt-2 mt-auto border-t border-slate-700/50">

                {/* Export PDF */}
                <button
                    id="rer-export-pdf"
                    onClick={onExportPDF}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700/50 border border-slate-600/50 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-[#A8B5D1] transition-all"
                >
                    <FileText className="w-4 h-4" />
                    Export PDF
                </button>

                {/* Provider Override Save (caution only) */}
                {isCaution && (
                    <button
                        id="rer-save-override"
                        onClick={handleOverrideConfirm}
                        disabled={!overrideChecked}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${overrideChecked
                            ? 'bg-amber-600/20 border-amber-500/40 text-amber-300 hover:bg-amber-600/30'
                            : 'bg-slate-800/40 border-slate-700/50 text-slate-500 cursor-not-allowed'
                            }`}
                    >
                        <ClipboardCheck className="w-4 h-4" />
                        Save Override Documentation
                    </button>
                )}

                {/* Phase 2 Unlock */}
                {!hideProceedButton && (
                    <button
                        id="rer-proceed-phase2"
                        onClick={canProceed ? onProceedToPhase2 : undefined}
                        disabled={!canProceed}
                        title={
                            isBlocked
                                ? 'Phase 2 is locked — absolute contraindications must be resolved'
                                : isCaution && !canProceed
                                    ? 'Complete and save the provider override documentation to unlock Phase 2'
                                    : 'Proceed to Phase 2 Dosing Session'
                        }
                        className={`ml-auto flex items-center gap-2 px-5 py-2 rounded-xl border text-sm font-bold transition-all ${canProceed
                            ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 hover:border-emerald-500/60'
                            : 'bg-slate-800/40 border-slate-700/50 text-slate-500 cursor-not-allowed'
                            }`}
                        aria-disabled={!canProceed}
                    >
                        {canProceed ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        {isBlocked ? '[LOCKED] Phase 2' : canProceed ? 'Proceed to Phase 2' : '[LOCKED] Phase 2'}
                    </button>
                )}
            </div>

            {/* Blocked hard stop notice */}
            {isBlocked && (
                <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/20">
                    <p className="text-xs text-red-400 leading-relaxed">
                        <span className="font-bold">[ACTION REQUIRED]</span> Absolute contraindications cannot be overridden. Phase 2 is locked until these conditions are resolved. Document your clinical response, update the patient record, and re-run screening after conditions change.
                    </p>
                </div>
            )}
        </div>
    );
};

export default RiskEligibilityReport;
