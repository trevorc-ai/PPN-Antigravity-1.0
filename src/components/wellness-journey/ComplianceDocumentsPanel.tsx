import React, { FC } from 'react';
import { FileText, Shield, Car, Download, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { AdvancedTooltip } from '../ui/AdvancedTooltip';
import {
    generateSafetyPlan,
    generateTransportationPlan,
    generateInformedConsent,
    downloadComplianceDocument,
    type SafetyPlanData,
    type TransportationPlanData,
    type ConsentFormData
} from '../../services/complianceDocuments';
import { useToast } from '../../contexts/ToastContext';

interface ComplianceDocumentsPanelProps {
    patientId: string;
    completedForms: string[];
}

export const ComplianceDocumentsPanel: FC<ComplianceDocumentsPanelProps> = ({ patientId, completedForms }) => {
    const { addToast } = useToast();

    const isConsentComplete = completedForms.includes('consent');
    const isBaselineComplete = completedForms.includes('set-and-setting');

    const handleDownloadSafety = () => {
        if (!isBaselineComplete) return;

        // In a real app, you would fetch this from your database
        const mockSafetyData: SafetyPlanData = {
            patientId,
            siteId: 'SITE-001',
            clinicianId: 'Provider-1',
            emergencyContacts: [
                { name: 'John Doe', relationship: 'Spouse', phone: '(555) 123-4567' }
            ],
            copingStrategies: ['Deep Breathing', 'Listening to calm music', 'Taking a walk'],
            warningSigns: ['Isolation', 'Disrupted sleep pattern', 'Anxious thought loops'],
            crisisResources: {
                national: '988',
                local: 'County Gen Hospital ER',
                clinician: '(555) 800-4000 Option 2'
            },
            safetyCommitment: 'I agree to contact my provider if I experience intense anxiety that persists for more than 48 hours post-session.'
        };

        const text = generateSafetyPlan(mockSafetyData);
        downloadComplianceDocument('safety', text, patientId);

        addToast({ title: 'Safety Plan Downloaded', message: 'Client safety and support plan exported successfully.', type: 'success' });
    };

    const handleDownloadTransport = () => {
        if (!isConsentComplete) return;

        const mockTransportData: TransportationPlanData = {
            patientId,
            sessionDate: new Date().toLocaleDateString('en-US'),
            driverName: 'Jane Smith',
            driverPhone: '(555) 987-6543',
            pickupLocation: '123 Health Way, Suite 400',
            dropoffLocation: '456 Home Ave',
            estimatedArrival: 'TBD upon session close',
            clinicianId: 'Provider-1'
        };

        const text = generateTransportationPlan(mockTransportData);
        downloadComplianceDocument('transport', text, patientId);

        addToast({ title: 'Transport Plan Downloaded', message: 'Signed transportation compliance document exported.', type: 'success' });
    };

    const handleDownloadConsent = () => {
        if (!isConsentComplete) return;

        const mockConsentData: ConsentFormData = {
            patientId,
            substanceName: 'Psilocybin Extract',
            doseRange: '25mg - 30mg oral',
            clinicianId: 'Provider-1'
        };

        const text = generateInformedConsent(mockConsentData);
        downloadComplianceDocument('consent', text, patientId);

        addToast({ title: 'Consent Form Downloaded', message: 'Informed consent execution document exported.', type: 'success' });
    };

    const docs = [
        {
            id: 'consent',
            label: 'Informed Consent',
            isReady: isConsentComplete,
            icon: FileText,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
            requiredLabel: 'Requires Consent Form',
            onDownload: handleDownloadConsent
        },
        {
            id: 'safety',
            label: 'Safety & Support Plan',
            isReady: isBaselineComplete,
            icon: Shield,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
            requiredLabel: 'Requires Set & Setting',
            onDownload: handleDownloadSafety
        },
        {
            id: 'transport',
            label: 'Transportation Plan',
            isReady: isConsentComplete,
            icon: Car,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20',
            requiredLabel: 'Requires Consent Form',
            onDownload: handleDownloadTransport
        }
    ];

    return (
        <div className="h-full flex flex-col bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-slate-400" />
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black text-[#A8B5D1]">Compliance Documents</h2>
                        <AdvancedTooltip
                            content="Automatically generated legal and operational documents required for regulatory compliance."
                            tier="standard"
                            side="top"
                        >
                            <Info className="w-4 h-4 text-slate-500 hover:text-white transition-colors cursor-help print:hidden" />
                        </AdvancedTooltip>
                    </div>
                    <p className="text-sm text-slate-400">Export legally required PDFs with digital signatures.</p>
                </div>
            </div>

            <div className="flex flex-col gap-3 mt-auto">
                {docs.map((doc) => {
                    const Icon = doc.icon;
                    return (
                        <div key={doc.id} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border ${doc.bg} ${doc.border} ${doc.color}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h3 className="font-bold text-[#A8B5D1] leading-tight text-sm">{doc.label}</h3>
                                        {doc.isReady ? (
                                            <span className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-wider rounded flex items-center gap-1">
                                                <CheckCircle className="w-2.5 h-2.5" /> Ready
                                            </span>
                                        ) : (
                                            <span className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 text-slate-400 text-[9px] font-bold uppercase tracking-wider rounded flex items-center gap-1">
                                                <AlertTriangle className="w-2.5 h-2.5" /> Pending
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500">{doc.isReady ? 'Available for export' : doc.requiredLabel}</p>
                                </div>
                            </div>

                            <AdvancedTooltip
                                content={doc.isReady ? 'Download compliant PDF export' : `Complete ${doc.requiredLabel} to unlock`}
                                tier="micro"
                            >
                                <button
                                    type="button"
                                    onClick={doc.onDownload}
                                    disabled={!doc.isReady}
                                    className={`w-full sm:w-auto py-2.5 px-5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all flex-shrink-0 ${doc.isReady
                                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40'
                                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                        }`}
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Export Plan
                                </button>
                            </AdvancedTooltip>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
