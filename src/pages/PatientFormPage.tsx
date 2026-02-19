import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Tablet, CheckCircle, Copy, QrCode } from 'lucide-react';
import { MEQ30QuestionnaireForm } from '../components/arc-of-care-forms';

/**
 * PatientFormPage — Standalone patient-facing form mode
 *
 * Reached via: "Send to Patient" on the MEQ-30 prompt in PatientSelectModal
 * URL:  /patient-form/meq30?patient=PT-XXXXXXXXXX
 *
 * Two modes:
 *   1. "Fill Out Here"   — Default. Patient fills the form directly on this screen
 *                         Clean, minimal UI — no clinical chrome, just the form.
 *   2. "Share Form"      — Shows a shareable link + QR code stub the provider
 *                         can hand off or copy to send to the patient remotely.
 *
 * TODO: Wire the share link to a real tokenised URL once auth is live.
 */

export default function PatientFormPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const patientId = searchParams.get('patient') ?? 'Unknown';

    const [mode, setMode] = useState<'fill' | 'share' | 'done'>('fill');
    const [copied, setCopied] = useState(false);

    // Stub share URL — replace with real token URL post-auth
    const shareUrl = `${window.location.origin}/#/patient-form/meq30?patient=${patientId}&token=STUB`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    };

    const handleFormSave = (formName: string) => {
        console.log(`[PatientFormPage] ${formName} saved for ${patientId}`);
        setMode('done');
    };

    return (
        <div className="min-h-screen bg-[#060d1a] flex flex-col">

            {/* ── Minimal Header ─────────────────────────────────────────── */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60 bg-[#0a1628]">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Provider View
                </button>

                <div className="text-center">
                    <p className="text-xs text-slate-500 font-mono">{patientId}</p>
                    <p className="text-sm font-bold text-white">MEQ-30 Questionnaire</p>
                </div>

                {/* Mode Toggle */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setMode('fill')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${mode === 'fill'
                                ? 'bg-indigo-600 text-white border-indigo-500'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                            }`}
                    >
                        <Tablet className="w-3.5 h-3.5" />
                        Fill Out Here
                    </button>
                    <button
                        onClick={() => setMode('share')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${mode === 'share'
                                ? 'bg-indigo-600 text-white border-indigo-500'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                            }`}
                    >
                        <Share2 className="w-3.5 h-3.5" />
                        Share Form
                    </button>
                </div>
            </header>

            {/* ── Content ────────────────────────────────────────────────── */}
            <main className="flex-1 overflow-y-auto">

                {/* Fill Out Here Mode */}
                {mode === 'fill' && (
                    <div className="max-w-2xl mx-auto px-4 py-8">
                        <div className="mb-6 text-center">
                            <h1 className="text-2xl font-black text-white">Mystical Experience Questionnaire</h1>
                            <p className="text-slate-400 text-sm mt-2">
                                Please answer each question honestly based on your most significant experience.
                                There are no right or wrong answers.
                            </p>
                        </div>
                        <MEQ30QuestionnaireForm
                            onSave={() => handleFormSave('MEQ-30')}
                        />
                    </div>
                )}

                {/* Share Mode */}
                {mode === 'share' && (
                    <div className="max-w-lg mx-auto px-4 py-16 flex flex-col items-center gap-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-black text-white mb-2">Share with Patient</h2>
                            <p className="text-slate-400 text-sm">
                                Copy the link below or show the QR code to let the patient complete
                                the MEQ-30 on their own device.
                            </p>
                        </div>

                        {/* Link Copy */}
                        <div className="w-full">
                            <label className="block text-xs text-slate-500 font-medium mb-2">Shareable Link</label>
                            <div className="flex items-center gap-2">
                                <input
                                    readOnly
                                    value={shareUrl}
                                    className="flex-1 px-4 py-3 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-300 text-xs font-mono focus:outline-none truncate"
                                />
                                <button
                                    onClick={handleCopy}
                                    className={`flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${copied
                                            ? 'bg-emerald-600 text-white border-emerald-500'
                                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                                        }`}
                                >
                                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        {/* QR Code Stub */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-48 h-48 bg-white rounded-2xl flex items-center justify-center border-4 border-slate-700">
                                <div className="flex flex-col items-center gap-2 text-slate-400">
                                    <QrCode className="w-16 h-16 text-slate-300" />
                                    <p className="text-xs text-slate-500 text-center px-4">
                                        QR generation pending — token auth required
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-slate-600 text-center">
                                Patient scans to open the form on their device
                            </p>
                        </div>

                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all"
                        >
                            Done — Return to Provider View
                        </button>
                    </div>
                )}

                {/* Completion State */}
                {mode === 'done' && (
                    <div className="max-w-lg mx-auto px-4 py-24 flex flex-col items-center gap-6 text-center">
                        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white">MEQ-30 Complete</h2>
                            <p className="text-slate-400 text-sm mt-2">
                                Responses saved for <span className="text-white font-mono">{patientId}</span>.
                                You can now continue with the remaining Phase 1 forms.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate(-1)}
                            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all"
                        >
                            ← Continue to Phase 1
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
