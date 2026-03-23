import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';
import { tooltips } from '../../content/tooltips';

// ── Types ──────────────────────────────────────────────────────────────────────
type RiskBucket =
  | 'ABSOLUTE_CONTRAINDICATION'
  | 'STRONG_CAUTION'
  | 'CLINICIAN_REVIEW'
  | 'POSSIBLE_EFFICACY_BLUNTING'
  | 'MONITOR_ONLY'
  | 'INSUFFICIENT_EVIDENCE';

interface InteractionRule {
  interaction_id: number;
  substance_name: string;
  interactor_name: string;
  risk_bucket: RiskBucket;
  clinical_description: string | null;
  mechanism: string | null;
  interaction_type: string | null;
  screening_note: string | null;
  washout_note: string | null;
  evidence_source: string | null;
  source_url: string | null;
}

interface InteractionCheckerProps {
  /** Name of the psychedelic substance (primary agent) */
  substanceName: string | null;
  /** Names of the patient's concomitant medications to check */
  medicationNames: string[];
  /** Called when any interactions are found — passes the full rule array */
  onInteractionFound?: (interactions: InteractionRule[]) => void;
  /**
   * Called when the STRONG_CAUTION acknowledgment state changes.
   * ABSOLUTE_CONTRAINDICATION never triggers this — those are hard blocks.
   */
  onCautionAcknowledged?: (acknowledged: boolean) => void;
}

// ── Risk display config ────────────────────────────────────────────────────────
const RISK_CONFIG: Record<
  RiskBucket,
  { icon: string; iconColor: string; borderClass: string; bgClass: string; labelClass: string; label: string }
> = {
  ABSOLUTE_CONTRAINDICATION: {
    icon: 'dangerous',
    iconColor: 'text-red-400',
    borderClass: 'border-red-500',
    bgClass: 'bg-red-500/10',
    labelClass: 'text-red-400',
    label: 'Absolute Contraindication',
  },
  STRONG_CAUTION: {
    icon: 'warning',
    iconColor: 'text-amber-400',
    borderClass: 'border-amber-500',
    bgClass: 'bg-amber-500/10',
    labelClass: 'text-amber-400',
    label: 'Strong Caution',
  },
  CLINICIAN_REVIEW: {
    icon: 'policy',
    iconColor: 'text-yellow-400',
    borderClass: 'border-yellow-500/60',
    bgClass: 'bg-yellow-500/10',
    labelClass: 'text-yellow-400',
    label: 'Clinician Review Required',
  },
  POSSIBLE_EFFICACY_BLUNTING: {
    icon: 'info',
    iconColor: 'text-indigo-300',
    borderClass: 'border-indigo-500/50',
    bgClass: 'bg-indigo-500/10',
    labelClass: 'text-indigo-300',
    label: 'Possible Efficacy Blunting',
  },
  MONITOR_ONLY: {
    icon: 'monitor_heart',
    iconColor: 'text-slate-300',
    borderClass: 'border-slate-600/50',
    bgClass: 'bg-slate-800/40',
    labelClass: 'text-slate-300',
    label: 'Monitor Only',
  },
  INSUFFICIENT_EVIDENCE: {
    icon: 'help_outline',
    iconColor: 'text-slate-400',
    borderClass: 'border-slate-700/40',
    bgClass: 'bg-slate-800/30',
    labelClass: 'text-slate-400',
    label: 'Insufficient Evidence',
  },
};

// ── Component ──────────────────────────────────────────────────────────────────
export const InteractionChecker: React.FC<InteractionCheckerProps> = ({
  substanceName,
  medicationNames,
  onInteractionFound,
  onCautionAcknowledged,
}) => {
  const [interactions, setInteractions] = useState<InteractionRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [cautionAcknowledged, setCautionAcknowledged] = useState(false);

  useEffect(() => {
    const checkInteractions = async () => {
      if (!substanceName || medicationNames.length === 0) {
        setInteractions([]);
        setCautionAcknowledged(false);
        onCautionAcknowledged?.(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('ref_clinical_interactions')
          .select(`
            interaction_id,
            substance_name,
            interactor_name,
            risk_bucket,
            clinical_description,
            mechanism,
            interaction_type,
            screening_note,
            washout_note,
            evidence_source,
            source_url
          `)
          .eq('substance_name', substanceName)
          .in('interactor_name', medicationNames);

        if (error) throw error;

        const rules: InteractionRule[] = (data || []).map((row) => ({
          ...row,
          risk_bucket: (row.risk_bucket as RiskBucket) ?? 'INSUFFICIENT_EVIDENCE',
        }));

        setInteractions(rules);
        setCautionAcknowledged(false);
        onCautionAcknowledged?.(false);
        onInteractionFound?.(rules);
      } catch (err) {
        console.error('[InteractionChecker] Error checking interactions:', err);
        setInteractions([]);
      } finally {
        setLoading(false);
      }
    };

    checkInteractions();
  }, [substanceName, medicationNames, onInteractionFound, onCautionAcknowledged]);

  const handleCautionAcknowledge = (checked: boolean) => {
    setCautionAcknowledged(checked);
    onCautionAcknowledged?.(checked);
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <div className="flex items-center gap-2 text-slate-300">
          <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          <span className="ppn-body">Checking interaction database...</span>
        </div>
      </div>
    );
  }

  // ── No interactions found ──────────────────────────────────────────────────
  if (interactions.length === 0) {
    return null;
  }

  // ── Sort: most severe first ────────────────────────────────────────────────
  const SEVERITY_ORDER: Record<RiskBucket, number> = {
    ABSOLUTE_CONTRAINDICATION: 0,
    STRONG_CAUTION: 1,
    CLINICIAN_REVIEW: 2,
    POSSIBLE_EFFICACY_BLUNTING: 3,
    MONITOR_ONLY: 4,
    INSUFFICIENT_EVIDENCE: 5,
  };
  const sorted = [...interactions].sort(
    (a, b) => SEVERITY_ORDER[a.risk_bucket] - SEVERITY_ORDER[b.risk_bucket]
  );

  const hasAbsoluteContraindication = sorted.some(
    (i) => i.risk_bucket === 'ABSOLUTE_CONTRAINDICATION'
  );
  const hasStrongCaution = sorted.some((i) => i.risk_bucket === 'STRONG_CAUTION');

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-3" role="alert" aria-live="assertive" aria-label="Drug Interaction Alerts">

      {/* Medical disclaimer */}
      <div className="bg-amber-500/10 border-l-4 border-amber-500 rounded-lg p-4 flex items-start gap-3">
        <span className="material-symbols-outlined text-amber-400 text-xl flex-shrink-0" aria-hidden="true">warning</span>
        <div>
          <p className="text-sm font-black text-amber-400 uppercase tracking-widest mb-1">Medical Disclaimer</p>
          <p className="ppn-body text-slate-300">
            This reference is for clinical information only. Independent verification is required. Consult a qualified clinician before making any prescribing or protocol decisions.
          </p>
        </div>
      </div>

      {/* Interaction cards */}
      {sorted.map((interaction) => {
        const cfg = RISK_CONFIG[interaction.risk_bucket];
        return (
          <div
            key={`${interaction.substance_name}-${interaction.interactor_name}`}
            className={`${cfg.bgClass} border-2 ${cfg.borderClass} rounded-lg p-4`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`material-symbols-outlined ${cfg.iconColor} text-xl flex-shrink-0 mt-0.5`}
                aria-hidden="true"
              >
                {cfg.icon}
              </span>
              <div className="flex-1 space-y-2">
                {/* Header: risk label + combination */}
                <div className="flex items-center gap-2 flex-wrap">
                  <AdvancedTooltip content={tooltips.safetyShield.severityScore} learnMoreUrl="/help/interaction-checker">
                    <span className={`text-xs font-black uppercase tracking-wider ${cfg.labelClass}`}>
                      {cfg.label}
                    </span>
                  </AdvancedTooltip>
                  {interaction.interaction_type && (
                    <span className="text-xs text-slate-400 uppercase tracking-wider">
                      · {interaction.interaction_type.replace(/_/g, ' ')}
                    </span>
                  )}
                  <span className="ppn-body text-slate-300">
                    {interaction.substance_name} + {interaction.interactor_name}
                  </span>
                </div>

                {/* Clinical description */}
                {interaction.clinical_description && (
                  <p className="ppn-body text-slate-300">
                    <strong>Risk:</strong> {interaction.clinical_description}
                  </p>
                )}

                {/* Mechanism */}
                {interaction.mechanism && (
                  <AdvancedTooltip content={tooltips.safetyShield.mechanism} learnMoreUrl="/help/interaction-checker">
                    <p className="ppn-body text-slate-300">
                      <strong>Mechanism:</strong> {interaction.mechanism}
                    </p>
                  </AdvancedTooltip>
                )}

                {/* Screening note */}
                {interaction.screening_note && (
                  <p className={`ppn-body font-medium ${cfg.labelClass}`}>
                    <strong>Guidance:</strong> {interaction.screening_note}
                  </p>
                )}

                {/* Washout note */}
                {interaction.washout_note && (
                  <div className="flex items-start gap-2 mt-1">
                    <span className="material-symbols-outlined text-amber-400 text-base flex-shrink-0 mt-0.5" aria-hidden="true">timer</span>
                    <p className="ppn-body text-amber-200 text-sm">
                      <strong>Washout:</strong> {interaction.washout_note}
                    </p>
                  </div>
                )}

                {/* Evidence source */}
                {interaction.evidence_source && (
                  <a
                    href={interaction.source_url || `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(interaction.evidence_source)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 underline flex items-center gap-1"
                  >
                    {interaction.evidence_source}
                    <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* ABSOLUTE_CONTRAINDICATION hard-stop block (no override possible) */}
      {hasAbsoluteContraindication && (
        <div
          className="bg-red-900/25 border-2 border-red-500 rounded-lg p-4 mt-2"
          role="alert"
          aria-label="Protocol blocked — absolute contraindication"
        >
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-red-400 text-xl flex-shrink-0 mt-0.5" aria-hidden="true">block</span>
            <div>
              <p className="text-sm font-black text-red-400 uppercase tracking-widest mb-1">Protocol Blocked</p>
              <p className="ppn-body text-red-200">
                One or more absolute contraindications are present. Documentation cannot be completed for this protocol while these medications are active.
                The contraindicated medication(s) must be discontinued and the required washout period completed before proceeding.
              </p>
              <p className="ppn-body text-red-300 mt-2 font-semibold">
                This restriction cannot be overridden or dismissed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STRONG_CAUTION acknowledgment (only shown when no ABSOLUTE contraindication present) */}
      {hasStrongCaution && !hasAbsoluteContraindication && (
        <div className="bg-amber-500/10 border-2 border-amber-500 rounded-lg p-4 mt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={cautionAcknowledged}
              onChange={(e) => handleCautionAcknowledge(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-amber-500 text-amber-500 focus:ring-amber-500 focus:ring-offset-0 focus:ring-2 bg-slate-900 cursor-pointer"
              aria-required="true"
              aria-label="Acknowledge strong caution drug interaction risk"
            />
            <span className="ppn-body text-slate-300 leading-relaxed">
              <strong className="text-amber-400">I have reviewed the caution(s) above</strong> and confirm that the clinical risk-benefit analysis has been documented and shared with the patient before proceeding.
            </span>
          </label>
        </div>
      )}
    </div>
  );
};
