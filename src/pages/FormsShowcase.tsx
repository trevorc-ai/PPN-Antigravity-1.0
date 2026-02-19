import React, { useState } from 'react';
import { ChevronRight, CheckCircle } from 'lucide-react';

// Import all 20 forms
import {
    // Phase 1
    SetAndSettingForm,
    BaselineObservationsForm,
    ConsentForm,
    // Phase 2
    DosingProtocolForm,
    SessionVitalsForm,
    SessionTimelineForm,
    SessionObservationsForm,
    MEQ30QuestionnaireForm,
    AdverseEventForm,
    SafetyEventObservationsForm,
    RescueProtocolForm,
    // Phase 3 - PHI-Safe Forms Only
    DailyPulseCheckForm,
    LongitudinalAssessmentForm,
    StructuredIntegrationSessionForm,
    BehavioralChangeTrackerForm,
    // Ongoing Safety - PHI-Safe Forms Only
    StructuredSafetyCheckForm
} from '../components/arc-of-care-forms';

/**
 * FormsShowcase - Testing and Review Page for All 20 Arc of Care Forms
 * 
 * Features:
 * - Sidebar navigation by phase
 * - Live form preview
 * - Save callback logging
 */

interface FormDefinition {
    id: string;
    name: string;
    component: React.ComponentType<any>;
    phase: string;
}

const FORMS: FormDefinition[] = [
    // Phase 1: Preparation (4 forms - All Compliant)
    { id: 'meq30', name: 'MEQ-30 Questionnaire', component: MEQ30QuestionnaireForm, phase: 'Phase 1: Preparation' },
    { id: 'set-setting', name: 'Set & Setting', component: SetAndSettingForm, phase: 'Phase 1: Preparation' },
    { id: 'baseline-observations', name: 'Baseline Observations', component: BaselineObservationsForm, phase: 'Phase 1: Preparation' },
    { id: 'consent', name: 'Informed Consent', component: ConsentForm, phase: 'Phase 1: Preparation' },

    // Phase 2: Dosing Session (8 forms - All Compliant)
    { id: 'dosing-protocol', name: 'Dosing Protocol', component: DosingProtocolForm, phase: 'Phase 2: Dosing Session' },
    { id: 'session-vitals', name: 'Session Vitals', component: SessionVitalsForm, phase: 'Phase 2: Dosing Session' },
    { id: 'session-timeline', name: 'Session Timeline', component: SessionTimelineForm, phase: 'Phase 2: Dosing Session' },
    { id: 'session-observations', name: 'Session Observations', component: SessionObservationsForm, phase: 'Phase 2: Dosing Session' },
    { id: 'adverse-event', name: 'Adverse Event Report', component: AdverseEventForm, phase: 'Phase 2: Dosing Session' },
    { id: 'safety-observations', name: 'Safety Event Observations', component: SafetyEventObservationsForm, phase: 'Phase 2: Dosing Session' },
    { id: 'rescue-protocol', name: 'Rescue Protocol', component: RescueProtocolForm, phase: 'Phase 2: Dosing Session' },

    // Phase 3: Integration (4 forms - 100% PHI-Safe)
    { id: 'daily-pulse', name: 'Daily Pulse Check', component: DailyPulseCheckForm, phase: 'Phase 3: Integration' },
    { id: 'longitudinal', name: 'Longitudinal Assessment', component: LongitudinalAssessmentForm, phase: 'Phase 3: Integration' },
    { id: 'structured-integration', name: 'Structured Integration Session', component: StructuredIntegrationSessionForm, phase: 'Phase 3: Integration' },
    { id: 'behavioral-tracker', name: 'Behavioral Change Tracker', component: BehavioralChangeTrackerForm, phase: 'Phase 3: Integration' },

    // Ongoing Safety (1 form - 100% PHI-Safe)
    { id: 'structured-safety', name: 'Structured Safety Check', component: StructuredSafetyCheckForm, phase: 'Ongoing Safety' }
];

const FormsShowcase: React.FC = () => {
    const [selectedFormId, setSelectedFormId] = useState<string>(FORMS[0].id);
    const [savedData, setSavedData] = useState<Record<string, any>>({});

    const selectedForm = FORMS.find(f => f.id === selectedFormId);
    const FormComponent = selectedForm?.component;

    const handleSave = (formId: string) => (data: any) => {
        console.log(`[${formId}] Form saved:`, data);
        setSavedData(prev => ({ ...prev, [formId]: data }));
    };

    // Group forms by phase
    const phases = Array.from(new Set(FORMS.map(f => f.phase)));

    return (
        <div className="min-h-screen bg-[#0a1628]">
            {/* READ-ONLY WARNING BANNER */}
            <div className="bg-amber-500/20 border-b-2 border-amber-500/50 px-6 py-3">
                <p className="text-amber-300 text-sm font-bold text-center">
                    ⚠️ READ-ONLY SHOWCASE - Do not modify without express user permission
                </p>
            </div>

            <div className="flex h-screen">
                {/* Sidebar */}
                <div className="w-80 bg-slate-900/60 backdrop-blur-xl border-r border-slate-700/50 overflow-y-auto custom-scrollbar">
                    <div className="p-6 border-b border-slate-700/50">
                        <h1 className="text-2xl font-black text-slate-300">Arc of Care Forms</h1>
                        <p className="text-slate-300 text-sm mt-1">19 PHI-Safe Components</p>
                        <div className="mt-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">
                            <p className="text-sm font-bold text-emerald-400">✓ 100% COMPLIANT</p>
                            <p className="text-sm text-emerald-300 mt-0.5">Zero free-text inputs</p>
                        </div>
                    </div>

                    <div className="p-4 space-y-6">
                        {phases.map((phase) => {
                            const phaseForms = FORMS.filter(f => f.phase === phase);
                            return (
                                <div key={phase}>
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">
                                        {phase}
                                    </h3>
                                    <div className="space-y-1">
                                        {phaseForms.map((form) => {
                                            const isSelected = selectedFormId === form.id;
                                            const hasSavedData = !!savedData[form.id];

                                            return (
                                                <button
                                                    key={form.id}
                                                    onClick={() => setSelectedFormId(form.id)}
                                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${isSelected
                                                        ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/30 border-l-4 border-white/60'
                                                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                                                        }`}
                                                >
                                                    <span className="text-sm font-medium">{form.name}</span>
                                                    <div className="flex items-center gap-2">
                                                        {hasSavedData && (
                                                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                        )}
                                                        {isSelected && <ChevronRight className="w-4 h-4" />}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-8">
                        {FormComponent && (
                            <FormComponent
                                onSave={handleSave(selectedFormId)}
                                initialData={savedData[selectedFormId]}
                                patientId="DEMO-001"
                                sessionId="SESSION-001"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormsShowcase;
