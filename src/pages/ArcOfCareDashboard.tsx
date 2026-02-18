import React, { useState } from 'react';
import { useArcOfCareApi } from '../hooks/useArcOfCareApi';
import SetAndSettingCard from '../components/arc-of-care/SetAndSettingCard';
import SessionMonitoringDashboard from '../components/arc-of-care/SessionMonitoringDashboard';
import RealTimeVitalsPanel from '../components/arc-of-care/RealTimeVitalsPanel';
import SessionTimeline from '../components/arc-of-care/SessionTimeline';
import RescueProtocolChecklist from '../components/arc-of-care/RescueProtocolChecklist';
import PulseCheckWidget from '../components/arc-of-care/PulseCheckWidget';
import SymptomDecayCurveChart from '../components/arc-of-care/SymptomDecayCurveChart';
import RedAlertPanel from '../components/arc-of-care/RedAlertPanel';
import ObservationSelector from '../components/common/ObservationSelector';
import RequestNewOptionModal from '../components/common/RequestNewOptionModal';
import {
    Brain,
    Activity,
    TrendingUp,
    CheckCircle,
    Clock,
    AlertTriangle,
    ChevronRight
} from 'lucide-react';

/**
 * Unified Wellness Journey Dashboard
 * 
 * Complete patient journey across all 3 phases:
 * - Phase 1: Protocol Builder (Pre-Session)
 * - Phase 2: Session Logger (During Session)
 * - Phase 3: Integration Tracker (Post-Session)
 * 
 * Fully responsive: Mobile, Tablet, Desktop
 * PHI-Compliant: No free-text inputs
 */
const ArcOfCareDashboard: React.FC = () => {
    const { submitBaselineAssessment, fetchAugmentedIntelligence, loading, error } = useArcOfCareApi();

    // Active phase
    const [activePhase, setActivePhase] = useState<1 | 2 | 3>(1);

    // Phase 1 state
    const [expectancyScale, setExpectancyScale] = useState(75);
    const [aceScore, setAceScore] = useState(3);
    const [gad7Score, setGad7Score] = useState(8);
    const [phq9Score, setPhq9Score] = useState(12);
    const [selectedObservations, setSelectedObservations] = useState<number[]>([]);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [prediction, setPrediction] = useState<any>(null);

    // Phase 2 state
    const [sessionActive, setSessionActive] = useState(false);
    const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
    const [elapsedMinutes, setElapsedMinutes] = useState(0);
    const [vitals] = useState({
        heartRate: 72,
        hrv: 45,
        bloodPressure: '120/80',
        respiratoryRate: 16,
        oxygenSaturation: 98
    });
    const [events] = useState([
        {
            id: 1,
            timestamp: '10:00 AM',
            type: 'Session Start',
            severity: 'info',
            description: 'Baseline vitals recorded'
        }
    ]);

    // Phase 3 state
    const trajectoryData = [
        { date: '2025-08-16', score: 24, severity: 'severe' },
        { date: '2025-09-01', score: 21, severity: 'severe' },
        { date: '2025-10-01', score: 14, severity: 'moderate' },
        { date: '2025-11-01', score: 8, severity: 'mild' },
        { date: '2025-12-01', score: 4, severity: 'minimal' },
        { date: '2026-01-01', score: 2, severity: 'minimal' },
        { date: '2026-02-16', score: 1, severity: 'minimal' }
    ];

    const [alerts] = useState([
        {
            id: 1,
            type: 'suicidal-ideation',
            severity: 'critical',
            message: 'Patient reported passive suicidal ideation on C-SSRS',
            timestamp: '2026-02-14 10:30 AM',
            acknowledged: false,
            resolved: false
        }
    ]);

    const handlePhaseComplete = (phase: number) => {
        if (phase < 3) {
            setActivePhase((phase + 1) as 1 | 2 | 3);
        }
    };

    const phases = [
        {
            id: 1,
            name: 'Protocol Builder',
            subtitle: 'Pre-Session Assessment',
            icon: Brain,
            color: 'emerald',
            status: prediction ? 'complete' : activePhase === 1 ? 'active' : 'pending'
        },
        {
            id: 2,
            name: 'Session Logger',
            subtitle: 'Real-Time Monitoring',
            icon: Activity,
            color: 'blue',
            status: sessionStartTime ? 'complete' : activePhase === 2 ? 'active' : 'pending'
        },
        {
            id: 3,
            name: 'Integration Tracker',
            subtitle: 'Post-Session Care',
            icon: TrendingUp,
            color: 'purple',
            status: activePhase === 3 ? 'active' : 'pending'
        }
    ];

    return (
        <div className="min-h-screen bg-[#0a1628]">
            {/* Header */}
            <div className="bg-slate-900/40 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-300">
                                Wellness Journey
                            </h1>
                            <p className="text-sm sm:text-base text-slate-300 mt-1">
                                Complete Patient Journey Dashboard
                            </p>
                        </div>

                        {/* Desktop: Phase Pills */}
                        <div className="hidden lg:flex items-center gap-2">
                            {phases.map((phase) => (
                                <button
                                    key={phase.id}
                                    onClick={() => setActivePhase(phase.id as 1 | 2 | 3)}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${activePhase === phase.id
                                            ? `bg-${phase.color}-500 text-slate-300`
                                            : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                                        }`}
                                >
                                    <phase.icon className="w-4 h-4 inline mr-2" />
                                    {phase.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Mobile/Tablet: Timeline */}
                    <div className="lg:hidden mt-4">
                        <div className="flex items-center justify-between">
                            {phases.map((phase, index) => (
                                <React.Fragment key={phase.id}>
                                    <button
                                        onClick={() => setActivePhase(phase.id as 1 | 2 | 3)}
                                        className={`flex flex-col items-center gap-2 flex-1 ${activePhase === phase.id ? 'opacity-100' : 'opacity-50'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${phase.status === 'complete' ? `bg-${phase.color}-500` :
                                                phase.status === 'active' ? `bg-${phase.color}-500/20 border-2 border-${phase.color}-500` :
                                                    'bg-slate-800 border-2 border-slate-700'
                                            }`}>
                                            {phase.status === 'complete' ? (
                                                <CheckCircle className={`w-5 h-5 sm:w-6 sm:h-6 text-slate-300`} />
                                            ) : (
                                                <phase.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${phase.status === 'active' ? `text-${phase.color}-400` : 'text-slate-500'
                                                    }`} />
                                            )}
                                        </div>
                                        <span className={`text-xs sm:text-sm font-medium ${activePhase === phase.id ? 'text-slate-300' : 'text-slate-500'
                                            }`}>
                                            Phase {phase.id}
                                        </span>
                                    </button>
                                    {index < phases.length - 1 && (
                                        <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Phase 1: Protocol Builder */}
                {activePhase === 1 && (
                    <div className="space-y-6">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <Brain className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-emerald-300 font-semibold text-sm sm:text-base">Phase 1: Protocol Builder</h3>
                                    <p className="text-emerald-200 text-sm sm:text-sm mt-1">
                                        Complete baseline assessment to predict integration needs
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Input Panel */}
                            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sm:p-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-300 mb-4 sm:mb-6">Baseline Assessment</h2>

                                {/* Sliders */}
                                <div className="space-y-4 sm:space-y-6">
                                    <div>
                                        <label className="text-slate-300 text-sm font-medium">
                                            Treatment Expectancy: {expectancyScale}
                                        </label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="100"
                                            value={expectancyScale}
                                            onChange={(e) => setExpectancyScale(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-slate-300 text-sm font-medium">
                                            ACE Score: {aceScore}
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="10"
                                            value={aceScore}
                                            onChange={(e) => setAceScore(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500 mt-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-slate-300 text-sm font-medium">
                                            GAD-7 Score: {gad7Score}
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="21"
                                            value={gad7Score}
                                            onChange={(e) => setGad7Score(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500 mt-2"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-slate-300 text-sm font-medium">
                                            PHQ-9 Score: {phq9Score}
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="27"
                                            value={phq9Score}
                                            onChange={(e) => setPhq9Score(Number(e.target.value))}
                                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-2"
                                        />
                                    </div>

                                    <ObservationSelector
                                        category="baseline"
                                        selectedIds={selectedObservations}
                                        onChange={setSelectedObservations}
                                        onRequestNew={() => setShowRequestModal(true)}
                                    />

                                    <button
                                        onClick={() => handlePhaseComplete(1)}
                                        className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-300 font-medium rounded-lg transition-colors"
                                    >
                                        Complete Assessment
                                    </button>
                                </div>
                            </div>

                            {/* Visualization Panel */}
                            <div>
                                <SetAndSettingCard
                                    expectancyScale={expectancyScale}
                                    aceScore={aceScore}
                                    gad7Score={gad7Score}
                                    phq9Score={phq9Score}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Phase 2: Session Logger */}
                {activePhase === 2 && (
                    <div className="space-y-6">
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <Activity className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-blue-300 font-semibold text-sm sm:text-base">Phase 2: Session Logger</h3>
                                    <p className="text-blue-200 text-sm sm:text-sm mt-1">
                                        Real-time monitoring during psychedelic-assisted therapy
                                    </p>
                                </div>
                            </div>
                        </div>

                        <SessionMonitoringDashboard
                            sessionId={1}
                            elapsedMinutes={elapsedMinutes}
                            currentPhase="peak"
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <RealTimeVitalsPanel
                                heartRate={vitals.heartRate}
                                hrv={vitals.hrv}
                                bloodPressure={vitals.bloodPressure}
                                respiratoryRate={vitals.respiratoryRate}
                                oxygenSaturation={vitals.oxygenSaturation}
                                lastUpdated={new Date().toLocaleTimeString()}
                            />
                            <SessionTimeline events={events} />
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 sm:p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
                                <h3 className="text-red-300 text-lg sm:text-xl font-bold">Rescue Protocol</h3>
                            </div>
                            <RescueProtocolChecklist onInterventionUsed={() => { }} />
                        </div>

                        <button
                            onClick={() => handlePhaseComplete(2)}
                            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-slate-300 font-medium rounded-lg transition-colors"
                        >
                            Complete Session
                        </button>
                    </div>
                )}

                {/* Phase 3: Integration Tracker */}
                {activePhase === 3 && (
                    <div className="space-y-6">
                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <TrendingUp className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="text-purple-300 font-semibold text-sm sm:text-base">Phase 3: Integration Tracker</h3>
                                    <p className="text-purple-200 text-sm sm:text-sm mt-1">
                                        Longitudinal care tracking and symptom monitoring
                                    </p>
                                </div>
                            </div>
                        </div>

                        {alerts.some(a => !a.resolved) && (
                            <div className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-4 sm:p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
                                    <h3 className="text-red-300 text-lg sm:text-xl font-bold">Red Alerts</h3>
                                </div>
                                <RedAlertPanel
                                    alerts={alerts}
                                    onAcknowledge={() => { }}
                                    onResolve={() => { }}
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <PulseCheckWidget onSubmit={() => { }} />

                            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sm:p-6">
                                <h3 className="text-slate-300 text-lg font-semibold mb-4">Progress Stats</h3>
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4">
                                        <p className="text-slate-300 text-sm mb-1">Days Post-Session</p>
                                        <p className="text-2xl sm:text-3xl font-bold text-emerald-400">183</p>
                                    </div>
                                    <div className="bg-slate-800/50 rounded-lg p-3 sm:p-4">
                                        <p className="text-slate-300 text-sm mb-1">PHQ-9 Improvement</p>
                                        <p className="text-2xl sm:text-3xl font-bold text-blue-400">96%</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <SymptomDecayCurveChart data={trajectoryData} />
                    </div>
                )}
            </div>

            <RequestNewOptionModal
                isOpen={showRequestModal}
                onClose={() => setShowRequestModal(false)}
                category="baseline"
                type="observation"
            />
        </div>
    );
};

export default ArcOfCareDashboard;
