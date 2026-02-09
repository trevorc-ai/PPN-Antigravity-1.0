import React from 'react';
import ClinicPerformanceRadar from '../../components/analytics/ClinicPerformanceRadar';
import { PageContainer } from '../../components/layouts/PageContainer';
import { Section } from '../../components/layouts/Section';

const ClinicPerformance: React.FC = () => {
    return (
        <PageContainer className="py-8">
            <Section>
                <div className="border-b border-slate-800 pb-6">
                    <h1 className="text-5xl font-black tracking-tighter mb-2">Clinic Performance Radar</h1>
                    <p className="text-slate-400 text-xl sm:text-2xl font-medium max-w-4xl leading-relaxed">
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
