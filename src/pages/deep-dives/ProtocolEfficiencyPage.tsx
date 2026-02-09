import React from 'react';
import ProtocolEfficiency from '../../components/analytics/ProtocolEfficiency';
import { PageContainer } from '../../components/layouts/PageContainer';
import { Section } from '../../components/layouts/Section';

const ProtocolEfficiencyPage = () => {
    return (
        <PageContainer className="py-8">
            <Section>
                <div className="border-b border-slate-800 pb-6">
                    <h1 className="text-5xl font-black tracking-tighter mb-2">Protocol Efficiency</h1>
                    <p className="text-slate-400 text-xl sm:text-2xl font-medium max-w-4xl leading-relaxed">
                        This analysis compares different treatment protocols to see which are most effective. It looks at dosage, frequency, and duration to identify the best practices for patient care.
                    </p>
                </div>
                <div className="mt-8">
                    <ProtocolEfficiency />
                </div>
            </Section>
        </PageContainer>
    );
};

export default ProtocolEfficiencyPage;
