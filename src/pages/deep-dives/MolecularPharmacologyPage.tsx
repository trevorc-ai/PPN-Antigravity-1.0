import React from 'react';
// Import the Engine (Component)
import MolecularPharmacology from '../../components/analytics/MolecularPharmacology';
import { PageContainer } from '../../components/layouts/PageContainer';
import { Section } from '../../components/layouts/Section';

const MolecularPharmacologyPage = () => {
    return (
        <PageContainer className="py-8">
            <Section>
                <div className="border-b border-slate-800 pb-6">
                    <h1 className="text-5xl font-black tracking-tighter mb-2">Molecular Pharmacology</h1>
                    <p className="text-slate-400 text-xl sm:text-2xl font-medium max-w-4xl leading-relaxed">
                        This section details the chemical structure and biological effects of substances. It explains how molecules interact with the brain's receptors to produce therapeutic effects.
                    </p>
                </div>
                <div className="mt-8">
                    <MolecularPharmacology />
                </div>
            </Section>
        </PageContainer>
    );
};

export default MolecularPharmacologyPage;
