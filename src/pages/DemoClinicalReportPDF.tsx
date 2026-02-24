import React, { useEffect } from 'react';
import { PageContainer } from '../components/layouts/PageContainer';

export const DemoClinicalReportPDF = () => {
    // Automatically trigger print dialog on mount if desired, but we can just let the user click
    // useEffect(() => {
    //   window.print();
    // }, []);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-white text-black font-sans print:bg-white print:p-0 p-8">
            {/* Hide controls when printing */}
            <div className="mb-8 print:hidden flex justify-end max-w-[800px] mx-auto">
                <button
                    onClick={handlePrint}
                    className="px-6 py-2 bg-indigo-600 text-white font-bold rounded shadow hover:bg-indigo-700 transition"
                >
                    Print PDF Report
                </button>
            </div>

            {/* A4/Letter size container for print preview */}
            <div className="max-w-[800px] mx-auto bg-white print:shadow-none shadow-2xl p-[1in] border border-gray-200 print:border-none print:m-0">

                {/* Header */}
                <header className="flex justify-between items-end border-b-2 border-black pb-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-widest text-black">
                            Clinical Session Report
                        </h1>
                        <p className="text-sm font-mono text-gray-500 mt-1">
                            Generated: {new Date().toISOString().split('T')[0]} &bull; System: PPN-CORE
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400">Restricted</p>
                        <p className="text-xs font-mono text-gray-600 mt-1">ID: REF_8923A4</p>
                    </div>
                </header>

                {/* Patient & Practitioner Identifiers (Masked) */}
                <section className="mb-10 grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-gray-300 pb-1">Subject Registry ID</h2>
                        <p className="font-mono text-lg font-bold tracking-tight">PT-93A4-B7C1</p>
                        <p className="text-xs font-mono text-gray-600">UUID: a1b2c3d4-****-****-****-************</p>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-gray-300 pb-1">Attending Practitioner</h2>
                        <p className="font-mono text-lg font-bold tracking-tight">PR-77XQ-M9A2</p>
                        <p className="text-xs font-mono text-gray-600">Site ID: LOC_ALPHA_01</p>
                    </div>
                </section>

                {/* Protocol Details */}
                <section className="mb-10">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 border-b-2 border-black pb-2 mb-4">Protocol Parameters</h2>
                    <table className="w-full text-left font-mono text-sm">
                        <tbody className="divide-y divide-gray-200">
                            <tr>
                                <td className="py-3 font-bold text-gray-700 w-1/3">Intervention Code</td>
                                <td className="py-3">SUB_002_PSIL</td>
                            </tr>
                            <tr>
                                <td className="py-3 font-bold text-gray-700">Calculated Dosage</td>
                                <td className="py-3">25.0 mg &bull; ORAL_CAPSULE</td>
                            </tr>
                            <tr>
                                <td className="py-3 font-bold text-gray-700">Indication Mapping</td>
                                <td className="py-3">ICD-10: F32.2</td>
                            </tr>
                            <tr>
                                <td className="py-3 font-bold text-gray-700">Safety Clearances</td>
                                <td className="py-3 text-green-700 font-bold flex items-center gap-2">
                                    <span>&bull;</span> CARD_OK <span>&bull;</span> CONTRA_OK <span>&bull;</span> MAOI_CLEAR
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                {/* Session Vitals Timeline */}
                <section className="mb-10">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 border-b-2 border-black pb-2 mb-4">Vitals Telemetry (Hourly)</h2>
                    <table className="w-full text-left font-mono text-sm border border-gray-300">
                        <thead className="bg-gray-100 border-b border-gray-300">
                            <tr>
                                <th className="py-2 px-4 uppercase tracking-wider text-xs font-bold text-gray-600">T+Offset</th>
                                <th className="py-2 px-4 uppercase tracking-wider text-xs font-bold text-gray-600">HR (bpm)</th>
                                <th className="py-2 px-4 uppercase tracking-wider text-xs font-bold text-gray-600">BP (mmHg)</th>
                                <th className="py-2 px-4 uppercase tracking-wider text-xs font-bold text-gray-600">SpO2 (%)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr>
                                <td className="py-2 px-4">T-0:30</td>
                                <td className="py-2 px-4">72</td>
                                <td className="py-2 px-4">118/76</td>
                                <td className="py-2 px-4">99</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4">T+1:00</td>
                                <td className="py-2 px-4">88</td>
                                <td className="py-2 px-4">124/82</td>
                                <td className="py-2 px-4">98</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4">T+2:00</td>
                                <td className="py-2 px-4">92</td>
                                <td className="py-2 px-4">128/84</td>
                                <td className="py-2 px-4">97</td>
                            </tr>
                            <tr className="bg-gray-50">
                                <td className="py-2 px-4">T+4:00</td>
                                <td className="py-2 px-4">78</td>
                                <td className="py-2 px-4">120/78</td>
                                <td className="py-2 px-4">99</td>
                            </tr>
                        </tbody>
                    </table>
                    <p className="text-xs font-mono text-gray-500 mt-2 italic">Readings authenticated by device sync INT_09_OMRON</p>
                </section>

                {/* Outcome Baseline vs Post */}
                <section className="mb-10">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 border-b-2 border-black pb-2 mb-4">Outcome Delta (T-0 vs T+14d)</h2>
                    <div className="grid grid-cols-2 gap-4 font-mono">
                        <div className="border border-gray-200 p-4 rounded bg-gray-50">
                            <h3 className="text-xs uppercase font-bold text-gray-500 mb-2">Measure: M_PHQ9</h3>
                            <p className="text-2xl font-black">22 <span className="text-sm font-normal text-gray-500">&rarr;</span> 11</p>
                            <p className="text-xs text-green-700 font-bold mt-1">-50.0% &Delta;</p>
                        </div>
                        <div className="border border-gray-200 p-4 rounded bg-gray-50">
                            <h3 className="text-xs uppercase font-bold text-gray-500 mb-2">Measure: M_GAD7</h3>
                            <p className="text-2xl font-black">18 <span className="text-sm font-normal text-gray-500">&rarr;</span> 9</p>
                            <p className="text-xs text-green-700 font-bold mt-1">-50.0% &Delta;</p>
                        </div>
                    </div>
                </section>

                {/* Security Footer */}
                <footer className="mt-16 pt-4 border-t border-gray-300 text-center">
                    <p className="text-xs font-mono text-gray-500">
                        This document contains de-identified clinical data subject to PPN-CORE access policies.
                        <br />
                        Unauthorized reproduction or distribution is strictly prohibited.
                    </p>
                    <div className="mt-4 inline-block px-4 py-1 border-2 border-black font-black uppercase text-sm tracking-widest">
                        End of Report
                    </div>
                </footer>

            </div>
        </div>
    );
};

export default DemoClinicalReportPDF;
