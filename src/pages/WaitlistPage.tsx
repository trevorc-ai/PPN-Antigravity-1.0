/**
 * WO-642 — Denver Email Capture: Public /join Route
 *
 * Mobile-first, standalone page (no nav, no footer) accessible without authentication.
 * QR code at PsyCon Denver links to ppnportal.net/#/join.
 *
 * Writes: log_waitlist { email, first_name, interest_category }
 */

import React, { useState } from 'react';
import { Activity, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';

type InterestCategory = 'practitioner_access' | 'research_partnership' | 'general_updates';

interface FormState {
    firstName: string;
    email: string;
    interest: InterestCategory | '';
}

const INTEREST_OPTIONS: { value: InterestCategory; label: string }[] = [
    {
        value: 'practitioner_access',
        label: 'Practitioner Access: I want to document sessions',
    },
    {
        value: 'research_partnership',
        label: 'Research Partner: I represent an institution or research group',
    },
    {
        value: 'general_updates',
        label: 'General Updates: Keep me informed',
    },
];

export const WaitlistPage: React.FC = () => {
    const [form, setForm] = useState<FormState>({ firstName: '', email: '', interest: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'duplicate' | 'error'>('idle');

    const isSubmittable = form.firstName.trim() && form.email.trim() && form.interest;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSubmittable) return;
        setStatus('loading');
        try {
            const { error } = await supabase.from('log_waitlist').insert({
                email: form.email.trim().toLowerCase(),
                first_name: form.firstName.trim(),
                interest_category: form.interest,
            });
            if (error) {
                if (error.code === '23505') {
                    setStatus('duplicate');
                } else {
                    throw error;
                }
            } else {
                setStatus('success');
            }
        } catch {
            setStatus('error');
        }
    };

    const Wordmark = () => (
        <div className="flex items-center justify-center gap-2.5 mb-8">
            <Activity className="w-6 h-6 text-indigo-400" aria-hidden="true" />
            <span className="text-base font-black tracking-wider text-slate-300 uppercase">
                PPN <span className="text-indigo-400">Portal</span>
            </span>
        </div>
    );

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-5 py-12 font-sans text-slate-300 selection:bg-indigo-500/30"
            style={{
                background: 'linear-gradient(160deg, #0a1628 0%, #05070a 100%)',
            }}
        >
            {/* Subtle radial glow */}
            <div
                className="pointer-events-none fixed inset-0 z-0"
                aria-hidden="true"
                style={{
                    background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(99,102,241,0.10) 0%, transparent 70%)',
                }}
            />

            <div className="relative z-10 w-full max-w-sm">
                <Wordmark />

                {/* ── Success state ─────────────────────────────────── */}
                {status === 'success' && (
                    <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="w-16 h-16 bg-teal-500/15 border border-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
                            <CheckCircle2 className="w-8 h-8 text-teal-400" aria-hidden="true" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-100 mb-2">You're on the list.</h1>
                        <p className="ppn-body text-slate-400">
                            We'll be in touch before the network opens.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-2.5">
                            <Activity className="w-4 h-4 text-indigo-500" aria-hidden="true" />
                            <span className="text-sm font-black tracking-wider text-slate-500 uppercase">
                                PPN Portal
                            </span>
                        </div>
                    </div>
                )}

                {/* ── Duplicate state ───────────────────────────────── */}
                {status === 'duplicate' && (
                    <div className="text-center animate-in fade-in duration-500">
                        <div className="w-16 h-16 bg-indigo-500/15 border border-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
                            <CheckCircle2 className="w-8 h-8 text-indigo-400" aria-hidden="true" />
                        </div>
                        <h1 className="text-2xl font-black text-slate-100 mb-2">Already registered.</h1>
                        <p className="ppn-body text-slate-400">Watch your inbox, we'll be in touch.</p>
                    </div>
                )}

                {/* ── Form ──────────────────────────────────────────── */}
                {status !== 'success' && status !== 'duplicate' && (
                    <>
                        <div className="mb-7 text-center">
                            <h1 className="text-3xl font-black text-slate-100 leading-tight mb-2">
                                Join the PPN Network
                            </h1>
                            <p className="ppn-body text-slate-400">
                                Early access for practitioners. No payment required.
                            </p>
                        </div>

                        {/* Error banner */}
                        {status === 'error' && (
                            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-5 animate-in fade-in duration-300">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                                <p className="text-sm font-medium text-red-400">
                                    Something went wrong. Please try again or email{' '}
                                    <a href="mailto:info@ppnportal.net" className="underline hover:text-red-300 transition-colors">
                                        info@ppnportal.net
                                    </a>
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                            {/* First Name */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="join-first-name"
                                    className="block text-sm font-black uppercase tracking-widest text-slate-400"
                                >
                                    First Name <span className="text-indigo-400">*</span>
                                </label>
                                <input
                                    id="join-first-name"
                                    type="text"
                                    required
                                    autoComplete="given-name"
                                    placeholder="Your first name"
                                    value={form.firstName}
                                    onChange={(e) => {
                                        if (status === 'error') setStatus('idle');
                                        setForm(f => ({ ...f, firstName: e.target.value }));
                                    }}
                                    className="w-full px-5 py-4 bg-slate-900/70 border border-slate-700/60 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all text-base font-medium"
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="join-email"
                                    className="block text-sm font-black uppercase tracking-widest text-slate-400"
                                >
                                    Email Address <span className="text-indigo-400">*</span>
                                </label>
                                <input
                                    id="join-email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    inputMode="email"
                                    placeholder="you@yourpractice.com"
                                    value={form.email}
                                    onChange={(e) => {
                                        if (status === 'error') setStatus('idle');
                                        setForm(f => ({ ...f, email: e.target.value }));
                                    }}
                                    className="w-full px-5 py-4 bg-slate-900/70 border border-slate-700/60 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition-all text-base font-medium"
                                />
                            </div>

                            {/* Interest — radio group */}
                            <fieldset className="space-y-2">
                                <legend className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3 block">
                                    I'm interested in… <span className="text-indigo-400">*</span>
                                </legend>
                                <div className="space-y-3">
                                    {INTEREST_OPTIONS.map((opt) => (
                                        <label
                                            key={opt.value}
                                            className={`flex items-start gap-3.5 px-4 py-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                                                form.interest === opt.value
                                                    ? 'bg-indigo-950/40 border-indigo-500/50'
                                                    : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="interest"
                                                value={opt.value}
                                                required
                                                checked={form.interest === opt.value}
                                                onChange={() => {
                                                    if (status === 'error') setStatus('idle');
                                                    setForm(f => ({ ...f, interest: opt.value }));
                                                }}
                                                className="mt-0.5 w-4 h-4 accent-indigo-500 flex-shrink-0"
                                            />
                                            <span className="text-sm font-medium text-slate-300 leading-snug">
                                                {opt.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </fieldset>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={status === 'loading' || !isSubmittable}
                                aria-label={isSubmittable ? 'Submit waitlist registration' : 'Complete all fields to submit'}
                                className="w-full py-4 mt-2 rounded-xl font-black uppercase tracking-widest text-sm transition-all active:scale-95 disabled:cursor-not-allowed border
                                    bg-indigo-700/50 hover:bg-indigo-600/60 border-indigo-500/50 text-indigo-100
                                    disabled:bg-slate-800/50 disabled:border-slate-700/50 disabled:text-slate-500
                                    shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-2"
                            >
                                {status === 'loading' ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Submitting…
                                    </>
                                ) : (
                                    'Join the Network →'
                                )}
                            </button>

                            <p className="text-center text-sm font-medium text-slate-600 pt-1">
                                No spam. No payments. Just early access.
                            </p>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default WaitlistPage;
