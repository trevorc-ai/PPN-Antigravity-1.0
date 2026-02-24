import React, { FC, useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Activity, Rocket, Diamond, Settings2, CheckCircle2, Loader2, AlertCircle, X } from 'lucide-react';

const PRACTITIONER_TYPES = [
    { value: '', label: 'Select your practitioner type...' },
    { value: 'Licensed Clinician (MD, DO, NP, PA)', label: 'Licensed Clinician (MD, DO, NP, PA)' },
    { value: 'Psychologist / Therapist (PhD, PsyD, LCSW, LMFT)', label: 'Psychologist / Therapist (PhD, PsyD, LCSW, LMFT)' },
    { value: 'Ketamine / Psilocybin Clinic Operator', label: 'Ketamine / Psilocybin Clinic Operator' },
    { value: 'Independent Facilitator / Guide', label: 'Independent Facilitator / Guide' },
    { value: 'Integration Specialist / Coach', label: 'Integration Specialist / Coach' },
    { value: 'Researcher / Academic', label: 'Researcher / Academic' },
    { value: 'Other', label: 'Other' },
];

interface WaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const WaitlistModal: FC<WaitlistModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ firstName: '', email: '', practitionerType: '', challenge: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'duplicate' | 'error'>('idle');

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
            // Reset form when closed
            setTimeout(() => {
                setStatus('idle');
                setForm({ firstName: '', email: '', practitionerType: '', challenge: '' });
            }, 300);
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.firstName.trim() || !form.email.trim() || !form.practitionerType) return;
        setStatus('loading');
        try {
            const { error: sbError } = await supabase.from('log_waitlist').insert({
                first_name: form.firstName.trim(),
                email: form.email.trim().toLowerCase(),
                practitioner_type: form.practitionerType,
                message: form.challenge.trim() || null,
                source: 'ppn_portal_main',
            });
            if (sbError) {
                console.error("Supabase Waitlist Error:", sbError);
                if (sbError.code === '23505') { setStatus('duplicate'); }
                else { throw sbError; }
            } else {
                setStatus('success');
            }
        } catch (err) {
            console.error("Catch block:", err);
            setStatus('error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-[#05070a]/80 backdrop-blur-sm pointer-events-auto transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-xl my-8 mx-auto z-10">
                {/* Glow ring */}
                <div className="absolute -inset-0.5 bg-indigo-500/20 blur-xl opacity-80 rounded-[2.5rem]" />

                <div className="relative bg-[#0c1220] border border-slate-700/60 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                    {/* Header */}
                    <div className="flex items-center justify-between p-6 pb-4 border-b border-white/5 bg-white/5 relative z-20 shrink-0">
                        <div className="flex items-center gap-2">
                            <Activity className="text-indigo-500 w-5 h-5" />
                            <span className="text-sm font-black tracking-tight text-slate-300 uppercase">
                                PPN <span className="text-indigo-400">Portal</span>
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Scrollable Body */}
                    <div className="p-6 sm:p-10 overflow-y-auto custom-scrollbar relative z-10 shrink">
                        {status === 'success' ? (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8 text-center animate-in fade-in duration-500">
                                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                                </div>
                                <h2 className="text-2xl font-black text-emerald-400 mb-2">You're on the list.</h2>

                                <div className="text-left bg-[#0c0f14]/80 border border-slate-700/50 rounded-2xl p-5 mb-8 mt-6">
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">What happens next:</p>
                                    <ul className="space-y-3 text-sm font-medium text-slate-300">
                                        <li className="flex gap-2 items-start"><span className="text-indigo-400">•</span> You'll receive an email confirmation shortly.</li>
                                        <li className="flex gap-2 items-start"><span className="text-indigo-400">•</span> We'll notify you when the pilot opens.</li>
                                        <li className="flex gap-2 items-start"><span className="text-indigo-400">•</span> Priority onboarding + direct access to our team.</li>
                                    </ul>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => {
                                            onClose();
                                            navigate('/partner-demo');
                                        }}
                                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black rounded-xl uppercase tracking-widest transition-all shadow-xl shadow-indigo-900/50"
                                    >
                                        Watch the Demo →
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="w-full py-3 bg-transparent hover:bg-white/5 text-slate-400 text-sm font-bold rounded-xl transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        ) : status === 'duplicate' ? (
                            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-3xl p-8 text-center animate-in fade-in duration-500">
                                <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Activity className="w-8 h-8 text-cyan-400" />
                                </div>
                                <h2 className="text-2xl font-black text-cyan-400 mb-2">You're already on the list.</h2>
                                <p className="text-slate-400 font-medium mb-8">We'll be in touch. Watch your inbox.</p>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => {
                                            onClose();
                                            navigate('/partner-demo');
                                        }}
                                        className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-sm font-black rounded-xl uppercase tracking-widest transition-all border border-cyan-500/30"
                                    >
                                        Watch the Demo →
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="w-full py-3 bg-transparent hover:bg-white/5 text-slate-400 text-sm font-bold rounded-xl transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in fade-in duration-300">
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-black text-slate-200 mb-2">Join the Waitlist</h2>
                                    <p className="text-sm text-slate-400 font-medium">Request early access and join the founding cohort.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {status === 'error' && (
                                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm text-red-400">Something went wrong. Please try again or email us.</p>
                                        </div>
                                    )}

                                    <div>
                                        <label htmlFor="modal-first-name" className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">First Name</label>
                                        <input
                                            id="modal-first-name"
                                            type="text"
                                            required
                                            placeholder="Your first name"
                                            value={form.firstName}
                                            onChange={(e) => setForm(f => ({ ...f, firstName: e.target.value }))}
                                            className="w-full px-4 py-3 bg-[#080c14] border border-slate-700/50 rounded-xl text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="modal-email" className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                                        <input
                                            id="modal-email"
                                            type="email"
                                            required
                                            placeholder="you@yourpractice.com"
                                            value={form.email}
                                            onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                                            className="w-full px-4 py-3 bg-[#080c14] border border-slate-700/50 rounded-xl text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="modal-practitioner-type" className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Practitioner Type</label>
                                        <select
                                            id="modal-practitioner-type"
                                            required
                                            value={form.practitionerType}
                                            onChange={(e) => setForm(f => ({ ...f, practitionerType: e.target.value }))}
                                            className="w-full px-4 py-3 bg-[#080c14] border border-slate-700/50 rounded-xl text-slate-300 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium appearance-none"
                                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
                                        >
                                            {PRACTITIONER_TYPES.map((t) => (
                                                <option key={t.value} value={t.value} disabled={t.value === ''} className="bg-[#0c0f14] text-slate-300">
                                                    {t.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="modal-challenge" className="block tracking-widest mb-2">
                                            <span className="text-[11px] font-black text-slate-400 uppercase">Biggest challenge?</span>
                                            <span className="text-[11px] text-slate-500 ml-2 normal-case font-medium tracking-normal">(Optional)</span>
                                        </label>
                                        <textarea
                                            id="modal-challenge"
                                            rows={2}
                                            maxLength={280}
                                            value={form.challenge}
                                            onChange={(e) => setForm(f => ({ ...f, challenge: e.target.value }))}
                                            className="w-full px-4 py-3 bg-[#080c14] border border-slate-700/50 rounded-xl text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all font-medium resize-y"
                                            placeholder="What's currently slowing down your practice..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === 'loading' || !form.firstName.trim() || !form.email.trim() || !form.practitionerType}
                                        className="w-full py-4 mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-sm font-black rounded-xl uppercase tracking-widest transition-all shadow-xl shadow-indigo-900/30 flex items-center justify-center gap-2"
                                    >
                                        {status === 'loading' ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                                        ) : (
                                            'Join the Waitlist'
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
