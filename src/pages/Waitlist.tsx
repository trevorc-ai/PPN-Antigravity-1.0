import React, { FC, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

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

export const Waitlist: FC = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ firstName: '', email: '', practitionerType: '', challenge: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'duplicate' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.firstName.trim() || !form.email.trim() || !form.practitionerType) return;
        setStatus('loading');
        try {
            const { error } = await supabase.from('academy_waitlist').insert({
                first_name: form.firstName.trim(),
                email: form.email.trim().toLowerCase(),
                practitioner_type: form.practitionerType,
                message: form.challenge.trim() || null,
                source: 'ppn_portal_main',
            });
            if (error) {
                if (error.code === '23505') { setStatus('duplicate'); }
                else { throw error; }
            } else {
                setStatus('success');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <>
            <title>Join the Waitlist — PPN Research Portal</title>

            <div className="min-h-screen" style={{ background: '#0a1628', fontFamily: 'Inter, sans-serif' }}>
                <nav style={{
                    position: 'sticky', top: 0, zIndex: 50,
                    background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(16px)',
                    borderBottom: '1px solid rgba(56,139,253,0.15)',
                    padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => navigate('/')}>
                        <svg viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 22, height: 22 }}>
                            <path d="M14 1L2 6v10c0 7 5.25 13 12 15 6.75-2 12-8 12-15V6L14 1z" fill="rgba(56,139,253,0.15)" stroke="#388bfd" strokeWidth="1.5" />
                            <path d="M9 16l3.5 3.5 6-6" stroke="#39d0d8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#9fb0be', letterSpacing: '-0.01em' }}>
                            PPN <span style={{ color: '#388bfd' }}>Portal</span>
                        </span>
                    </div>
                </nav>

                <section style={{ textAlign: 'center', padding: '72px 24px 20px', maxWidth: 720, margin: '0 auto' }}>
                    <h1 style={{
                        fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 900, lineHeight: 1.15,
                        letterSpacing: '-0.03em', color: '#9fb0be', marginBottom: 20,
                    }}>
                        Join the Waitlist for <br />
                        <span style={{ color: '#388bfd' }}>PPN Research Portal</span>
                    </h1>

                    <p style={{ fontSize: 16, color: '#6b7a8d', lineHeight: 1.65, maxWidth: 560, margin: '0 auto' }}>
                        Clinical infrastructure for psychedelic therapy practitioners. Request early access and join the founding cohort.
                    </p>
                </section>

                <section style={{ maxWidth: 860, margin: '0 auto', padding: '20px 24px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 16 }}>
                        <div style={{
                            background: 'rgba(12,26,50,0.95)', border: '1px solid rgba(56,139,253,0.15)',
                            borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, width: '100%', maxWidth: '320px'
                        }}>
                            <div style={{ fontSize: 24 }}>🚀</div>
                            <div style={{ fontSize: 13, color: '#9fb0be', lineHeight: 1.5, fontWeight: 500 }}>Priority access when the pilot opens (targeted early spring 2026)</div>
                        </div>
                        <div style={{
                            background: 'rgba(12,26,50,0.95)', border: '1px solid rgba(56,139,253,0.15)',
                            borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, width: '100%', maxWidth: '320px'
                        }}>
                            <div style={{ fontSize: 24 }}>💎</div>
                            <div style={{ fontSize: 13, color: '#9fb0be', lineHeight: 1.5, fontWeight: 500 }}>Founding practitioner pricing (locked rate for early adopters)</div>
                        </div>
                        <div style={{
                            background: 'rgba(12,26,50,0.95)', border: '1px solid rgba(56,139,253,0.15)',
                            borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, width: '100%', maxWidth: '320px'
                        }}>
                            <div style={{ fontSize: 24 }}>🛠️</div>
                            <div style={{ fontSize: 13, color: '#9fb0be', lineHeight: 1.5, fontWeight: 500 }}>Direct input on the clinical platform roadmap</div>
                        </div>
                    </div>
                </section>

                <section id="waitlist" style={{ maxWidth: 560, margin: '40px auto 0', padding: '0 24px 100px' }}>
                    <div style={{
                        background: 'rgba(12,26,50,0.95)', border: '1px solid rgba(56,139,253,0.2)',
                        borderRadius: 24, padding: '40px 32px',
                    }}>
                        {status === 'success' ? (
                            <div style={{
                                background: 'rgba(63,185,80,0.08)', border: '1px solid rgba(63,185,80,0.3)',
                                borderRadius: 14, padding: '28px 24px', textAlign: 'center',
                            }}>
                                <div style={{ fontSize: 28, marginBottom: 12 }}>✅</div>
                                <div style={{ fontSize: 18, fontWeight: 800, color: '#3fb950', marginBottom: 16 }}>You're on the list.</div>
                                
                                <div style={{ textAlign: 'left', marginBottom: 24, fontSize: 14, color: '#9fb0be', lineHeight: 1.6 }}>
                                    <p style={{ fontWeight: 700, marginBottom: 8 }}>What happens next:</p>
                                    <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <li>You'll receive an email confirmation shortly.</li>
                                        <li>We'll notify you when the pilot opens (targeted: early spring 2026).</li>
                                        <li>Founding practitioners get priority onboarding + direct access to our team.</li>
                                    </ul>
                                </div>

                                <button
                                    onClick={() => navigate('/partner-demo')}
                                    style={{
                                        display: 'inline-block',
                                        width: '100%', padding: '14px', borderRadius: 10, fontSize: 15, fontWeight: 700,
                                        color: '#fff', border: 'none', cursor: 'pointer',
                                        background: 'linear-gradient(135deg, #388bfd, #2060cc)',
                                        textDecoration: 'none'
                                    }}
                                >
                                    Watch the 2-minute demo while you wait →
                                </button>
                            </div>
                        ) : status === 'duplicate' ? (
                            <div style={{
                                background: 'rgba(57,208,216,0.06)', border: '1px solid rgba(57,208,216,0.25)',
                                borderRadius: 14, padding: '24px', textAlign: 'center',
                            }}>
                                <div style={{ fontSize: 16, fontWeight: 800, color: '#39d0d8', marginBottom: 6 }}>You're already on the list.</div>
                                <p style={{ fontSize: 14, color: '#9fb0be', marginBottom: 20 }}>We'll be in touch. Watch your inbox.</p>
                                <button
                                    onClick={() => navigate('/partner-demo')}
                                    style={{
                                        width: '100%', padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 700,
                                        color: '#39d0d8', border: '1px solid rgba(57,208,216,0.3)', cursor: 'pointer',
                                        background: 'rgba(57,208,216,0.1)',
                                    }}
                                >
                                    Watch the Demo →
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {status === 'error' && (
                                    <div style={{
                                        background: 'rgba(248,81,73,0.08)', border: '1px solid rgba(248,81,73,0.3)',
                                        borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#f85149',
                                    }}>
                                        Something went wrong. Please try again or email us at info@ppnportal.net
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="acad-name" style={{ fontSize: 12, fontWeight: 700, color: '#6b7a8d', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>First Name</label>
                                    <input
                                        id="acad-name"
                                        type="text"
                                        required
                                        placeholder="Your first name"
                                        value={form.firstName}
                                        onChange={(e) => setForm(f => ({ ...f, firstName: e.target.value }))}
                                        style={{
                                            width: '100%', padding: '13px 14px', borderRadius: 10, fontSize: 15,
                                            background: 'rgba(56,139,253,0.06)', border: '1px solid rgba(56,139,253,0.2)',
                                            color: '#9fb0be', outline: 'none', boxSizing: 'border-box',
                                        }}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="acad-email" style={{ fontSize: 12, fontWeight: 700, color: '#6b7a8d', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Email Address</label>
                                    <input
                                        id="acad-email"
                                        type="email"
                                        required
                                        placeholder="you@yourpractice.com"
                                        value={form.email}
                                        onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                                        style={{
                                            width: '100%', padding: '13px 14px', borderRadius: 10, fontSize: 15,
                                            background: 'rgba(56,139,253,0.06)', border: '1px solid rgba(56,139,253,0.2)',
                                            color: '#9fb0be', outline: 'none', boxSizing: 'border-box',
                                        }}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="acad-type" style={{ fontSize: 12, fontWeight: 700, color: '#6b7a8d', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Practitioner Type</label>
                                    <select
                                        id="acad-type"
                                        required
                                        value={form.practitionerType}
                                        onChange={(e) => setForm(f => ({ ...f, practitionerType: e.target.value }))}
                                        style={{
                                            width: '100%', padding: '13px 14px', borderRadius: 10, fontSize: 15,
                                            background: 'rgba(12,26,50,0.95)', border: '1px solid rgba(56,139,253,0.2)',
                                            color: form.practitionerType ? '#9fb0be' : '#6b7a8d', outline: 'none', boxSizing: 'border-box',
                                        }}
                                    >
                                        {PRACTITIONER_TYPES.map((t) => (
                                            <option key={t.value} value={t.value} disabled={t.value === ''} style={{ background: '#0a1628', color: '#9fb0be' }}>
                                                {t.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="acad-challenge" style={{ fontSize: 12, fontWeight: 700, color: '#6b7a8d', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                                        What's your biggest clinical documentation challenge? <span style={{ textTransform: 'none', fontWeight: 400, color: '#56667a' }}>(Optional — helps us prioritize what to build)</span>
                                    </label>
                                    <textarea
                                        id="acad-challenge"
                                        rows={3}
                                        maxLength={280}
                                        value={form.challenge}
                                        onChange={(e) => setForm(f => ({ ...f, challenge: e.target.value }))}
                                        style={{
                                            width: '100%', padding: '13px 14px', borderRadius: 10, fontSize: 15,
                                            background: 'rgba(56,139,253,0.06)', border: '1px solid rgba(56,139,253,0.2)',
                                            color: '#9fb0be', outline: 'none', boxSizing: 'border-box', resize: 'vertical'
                                        }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'loading' || !form.firstName || !form.email || !form.practitionerType}
                                    style={{
                                        width: '100%', padding: '15px', borderRadius: 10, fontSize: 16, fontWeight: 700,
                                        color: '#fff', border: 'none', cursor: 'pointer', marginTop: 8,
                                        background: 'linear-gradient(135deg, #388bfd, #2060cc)',
                                        opacity: (status === 'loading' || !form.firstName || !form.email || !form.practitionerType) ? 0.55 : 1,
                                        boxShadow: '0 6px 24px rgba(56,139,253,0.25)',
                                    }}
                                >
                                    {status === 'loading' ? 'Submitting...' : 'Join the Waitlist →'}
                                </button>

                                <p style={{ fontSize: 12, color: '#6b7a8d', textAlign: 'center', marginTop: 8 }}>
                                    No spam. No payments. Just early access when we're ready.
                                </p>
                            </form>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
};

export default Waitlist;
