import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { ChevronDown, Loader2, AlertCircle, X } from 'lucide-react';

interface RefTableRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    refTable: 'observations' | 'medications' | 'practitioners' | 'other';
    category?: string;
}

const RefTableRequestModal: React.FC<RefTableRequestModalProps> = ({
    isOpen,
    onClose,
    refTable,
    category
}) => {
    const [suggestedLabel, setSuggestedLabel] = useState('');
    const [rationale, setRationale] = useState('Missing from current vocabulary');
    const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!suggestedLabel.trim()) return;

        setStatus('loading');
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // Optionally fetch site_id if available, but simplified here
            const { error } = await supabase.from('log_feature_requests').insert({
                user_id: user.id,
                request_type: refTable,
                requested_text: suggestedLabel.trim(),
                category: category || 'general',
                status: 'pending'
            });

            if (error) throw error;

            setStatus('success');
            setTimeout(() => {
                setStatus('idle');
                setSuggestedLabel('');
                onClose();
            }, 3000);
        } catch (err: any) {
            console.error(err);
            setStatus('error');
            setErrorMsg(err.message || 'Failed to submit request.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-[#0f141f] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-xl transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8">
                    <h2 className="text-2xl font-black text-slate-200 mb-2">Request New Option</h2>
                    <p className="text-sm font-medium text-slate-500 mb-8">
                        Suggest an addition to the <span className="text-indigo-400 font-bold capitalize">{refTable}</span> vocabulary.
                    </p>

                    {status === 'success' ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
                            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-emerald-400">check_circle</span>
                            </div>
                            <h3 className="text-lg font-bold text-emerald-400 mb-2">Request Submitted</h3>
                            <p className="text-sm text-slate-300">
                                Network admins will review and seed approved items within 1–2 weeks.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {status === 'error' && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-400 font-medium">{errorMsg}</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                                    Suggested Label
                                </label>
                                <input
                                    type="text"
                                    value={suggestedLabel}
                                    onChange={(e) => setSuggestedLabel(e.target.value)}
                                    maxLength={80}
                                    placeholder="e.g. Patient reports heightened sensory awareness"
                                    className="w-full bg-[#182132] border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                                    required
                                />
                                <div className="text-right mt-1">
                                    <span className="text-xs text-slate-600">{suggestedLabel.length}/80</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                                    Rationale
                                </label>
                                <div className="relative">
                                    <select
                                        value={rationale}
                                        onChange={(e) => setRationale(e.target.value)}
                                        className="w-full bg-[#182132] border border-slate-700/50 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                                    >
                                        <option value="Missing from current vocabulary">Missing from current vocabulary</option>
                                        <option value="Commonly observed in my practice">Commonly observed in my practice</option>
                                        <option value="Required by my site's protocol">Required by my site's protocol</option>
                                        <option value="Clinically validated but not listed">Clinically validated but not listed</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                                    Priority
                                </label>
                                <div className="flex bg-[#182132] border border-slate-700/50 rounded-xl p-1">
                                    {['Low', 'Medium', 'High'].map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setPriority(p as any)}
                                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${priority === p
                                                    ? 'bg-slate-700 text-white shadow'
                                                    : 'text-slate-400 hover:text-slate-300'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-sm font-black rounded-xl uppercase tracking-widest transition-all active:scale-95 flex justify-center items-center gap-2"
                            >
                                {status === 'loading' ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                                ) : (
                                    'Submit Request'
                                )}
                            </button>
                        </form>
                    )}
                </div>

                <div className="border-t border-slate-800/60 p-5 bg-[#0a0d14]">
                    <p className="text-xs text-slate-500 text-center font-medium leading-relaxed max-w-sm mx-auto">
                        NO PHI ALLOWED. Please do not include any patient-identifying information in your proposed label.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RefTableRequestModal;
