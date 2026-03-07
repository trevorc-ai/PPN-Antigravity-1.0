import React from 'react';
import { useNavigate } from 'react-router-dom';
import ClinicPerformanceRadar from '../../components/analytics/ClinicPerformanceRadar';
import { PageContainer } from '../../components/layouts/PageContainer';
import { Section } from '../../components/layouts/Section';

const ClinicPerformance: React.FC = () => {
    const navigate = useNavigate();
    return (
        <PageContainer className="py-8">
            <Section>
                {/* Back to Dashboard — this page has no Breadcrumbs (public route) */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-1.5 mb-6 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-200 transition-colors group"
                >
                    <span className="material-symbols-outlined text-[15px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
                    Back to Dashboard
                </button>
                <div className="border-b border-slate-800 pb-6">
                    <h1 className="text-5xl font-black tracking-tighter mb-2">Clinic Performance Radar</h1>
                    <p className="text-slate-300 text-xl sm:text-2xl font-medium max-w-4xl leading-relaxed">
                        This dashboard tracks how well a clinic is improved patient outcomes. It measures key performance indicators like remission rates and patient retention to help optimize care.
                    </p>
                </div>
                <div className="mt-8">
                    <ClinicPerformanceRadar />
                </div>
            </Section>
        </PageContainer>
    );
};

export default ClinicPerformance;
