import React from 'react';
import { Shield, Info, ExternalLink } from 'lucide-react';

/**
 * WO-683: RegulatoryWeather — Governed Update
 *
 * Previous implementation rendered hardcoded mockData (OHA License, DORA Compliance, FDA Update)
 * with fake expiry dates and status values — presenting fabricated compliance state as live data.
 *
 * Per WO-683: No synthetic compliance data may be shown. This panel now provides:
 * 1. Honest placeholder explaining compliance monitoring is coming
 * 2. Direct link to official regulatory sources
 * 3. Actionable guidance for practitioners
 *
 * When a compliance_events table is added (future WO), this panel will render real alerts.
 */

export default function RegulatoryWeather() {
    return (
        <div className="bg-[#0f1218] border border-slate-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-indigo-400" />
                <h3 className="ppn-card-title text-slate-300">Regulatory Weather</h3>
            </div>

            {/* Honest zero-state — no synthetic data */}
            <div className="flex flex-col items-center gap-4 py-6">
                <div className="w-10 h-10 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center">
                    <Info className="w-5 h-5 text-slate-500" />
                </div>
                <div className="text-center max-w-xs">
                    <h4 className="ppn-body font-black text-slate-300 mb-1">Compliance monitoring coming soon</h4>
                    <p className="ppn-caption text-slate-500 leading-snug">
                        Live compliance alerts (license renewals, regulatory updates) will appear here once connected to your jurisdiction. No fabricated data is shown.
                    </p>
                </div>

                {/* Actionable links */}
                <div className="w-full space-y-2 mt-2">
                    <a
                        href="https://www.oregon.gov/oha/ph/preventionwellness/bhp/pages/psilocybin.aspx"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors group"
                    >
                        <span className="ppn-meta text-slate-400 group-hover:text-slate-300">OHA Psilocybin Program (Oregon)</span>
                        <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-slate-400 shrink-0" />
                    </a>
                    <a
                        href="https://www.ncsl.org/health/psychedelic-medications"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors group"
                    >
                        <span className="ppn-meta text-slate-400 group-hover:text-slate-300">NCSL Psychedelic Legislation Tracker</span>
                        <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-slate-400 shrink-0" />
                    </a>
                    <a
                        href="https://www.dea.gov/controlled-substances-act"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors group"
                    >
                        <span className="ppn-meta text-slate-400 group-hover:text-slate-300">DEA Controlled Substances Act</span>
                        <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-slate-400 shrink-0" />
                    </a>
                </div>

                {/* Legal disclaimer */}
                <p className="ppn-caption text-slate-600 italic text-center mt-1">
                    Always consult licensed legal counsel before offering or advertising any psychedelic therapy services.
                </p>
            </div>
        </div>
    );
}
