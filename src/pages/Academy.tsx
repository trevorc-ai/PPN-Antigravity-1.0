import React, { FC, useState } from 'react';
import { supabase } from '../supabaseClient';

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

const MODULES = [
    { icon: '🛡️', title: 'Why Documentation Is Your Best Defense', desc: 'Turn record-keeping from a liability into your strongest legal protection.' },
    { icon: '🏥', title: 'The Arc of Care Framework', desc: 'The 3-phase clinical framework used by PPN practitioners.' },
    { icon: '📋', title: 'Using the Clinical Forms', desc: 'Live walkthrough of all 15 Arc of Care forms.' },
    { icon: '⚗️', title: 'Drug Interaction Screening', desc: 'Screen for dangerous interactions before every session.' },
    { icon: '🚨', title: 'Safety Events and Crisis Response', desc: 'Real-time incident documentation under pressure.' },
    { icon: '📊', title: 'Exporting Audit-Ready Reports', desc: 'Generate insurance-submission-ready clinical reports.' },
];

const AUDIENCE = [
    { icon: '🩺', title: 'Licensed Clinicians', desc: 'Psychiatrists, Psychologists, LCSWs, and LMFTs navigating liability in an emerging field.' },
    { icon: '🏢', title: 'Clinic Operators', desc: 'Ketamine and psilocybin clinic owners building audit-ready operations from day one.' },
    { icon: '🌿', title: 'Independent Practitioners', desc: 'Facilitators operating in complex legal territory who need defensible documentation.' },
    { icon: '🔗', title: 'Integration Specialists', desc: 'Bodyworkers, coaches, and guides who need a structured documentation framework.' },
];

const FAQS = [
    {
        q: 'When does the course launch?',
        a: "We're building the waitlist first. Once we have enough founding members, we'll set an official launch date and notify you directly.",
    },
    {
        q: 'How much will it cost?',
        a: "Waitlist members will receive founding member pricing — substantially below the regular enrollment fee. We'll share exact pricing before launch.",
    },
    {
        q: 'Will this include CEU credits?',
        a: 'We are pursuing CEU credit approval with relevant state boards. Waitlist members will be updated as approvals are confirmed.',
    },
    {
        q: 'Do I need a PPN Portal account to enroll?',
        a: 'No — the waitlist is open to all practitioners, regardless of whether you use the PPN Research Portal.',
    },
];

export const Academy: FC = () => {
    const [form, setForm] = useState({ firstName: '', email: '', practitionerType: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'duplicate' | 'error'>('idle');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.firstName.trim() || !form.email.trim() || !form.practitionerType) return;
        setStatus('loading');
        try {
            const { error } = await supabase.from('academy_waitlist').insert({
                first_name: form.firstName.trim(),
                email: form.email.trim().toLowerCase(),
                practitioner_type: form.practitionerType,
                source: 'academy_landing_page',
            });
            if (error) {
                if (error.code === '23505') { setStatus('duplicate'); } // unique violation
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
            {/* SEO */}
            <title>PPN Practitioner Academy — Psychedelic Therapy Documentation Training</title>

            <div className="min-h-screen" style={{ background: '#0a1628', fontFamily: 'Inter, sans-serif' }}>

                {/* ── NAV ───────────────────────────────── */}
                <nav style={{
                    position: 'sticky', top: 0, zIndex: 50,
                    background: 'rgba(10,22,40,0.97)', backdropFilter: 'blur(16px)',
                    borderBottom: '1px solid rgba(56,139,253,0.15)',
                    padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <svg viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 22, height: 22 }}>
                            <path d="M14 1L2 6v10c0 7 5.25 13 12 15 6.75-2 12-8 12-15V6L14 1z" fill="rgba(56,139,253,0.15)" stroke="#388bfd" strokeWidth="1.5" />
                            <path d="M9 16l3.5 3.5 6-6" stroke="#39d0d8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#9fb0be', letterSpacing: '-0.01em' }}>
                            PPN <span style={{ color: '#388bfd' }}>Academy</span>
                        </span>
                    </div>
                    <a href="#waitlist" style={{
                        fontSize: 13, fontWeight: 700, color: '#fff',
                        background: '#388bfd', padding: '7px 16px', borderRadius: 8,
                        textDecoration: 'none',
                    }}>Join the Waitlist</a>
                </nav>

                {/* ── HERO ──────────────────────────────── */}
                <section style={{ textAlign: 'center', padding: '72px 24px 60px', maxWidth: 720, margin: '0 auto' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: 'rgba(240,165,0,0.1)', border: '1px solid rgba(240,165,0,0.3)',
                        color: '#f0a500', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
                        textTransform: 'uppercase', padding: '4px 14px', borderRadius: 100, marginBottom: 24,
                    }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f0a500', display: 'inline-block' }} />
                        Coming Soon — Phase 2
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 900, lineHeight: 1.15,
                        letterSpacing: '-0.03em', color: '#9fb0be', marginBottom: 20,
                    }}>
                        Master the Documentation Standard<br />
                        <span style={{ color: '#388bfd' }}>for Psychedelic-Assisted Therapy</span>
                    </h1>

                    <p style={{ fontSize: 17, color: '#6b7a8d', lineHeight: 1.65, maxWidth: 560, margin: '0 auto 36px' }}>
                        The first practitioner training built around real-world evidence, zero-PHI documentation,
                        and audit-ready clinical records. Launching soon — join the waitlist.
                    </p>

                    <a href="#waitlist" style={{
                        display: 'inline-block', fontSize: 16, fontWeight: 700, color: '#fff',
                        background: 'linear-gradient(135deg, #388bfd, #2060cc)',
                        padding: '15px 40px', borderRadius: 12, textDecoration: 'none',
                        boxShadow: '0 8px 32px rgba(56,139,253,0.3)',
                    }}>
                        Join the Waitlist — It's Free
                    </a>
                </section>

                {/* ── TRUST BAR ─────────────────────────── */}
                <div style={{
                    borderTop: '1px solid rgba(56,139,253,0.12)', borderBottom: '1px solid rgba(56,139,253,0.12)',
                    background: 'rgba(56,139,253,0.04)', padding: '16px 24px',
                    display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px 28px',
                }}>
                    {['Built by practitioners, for practitioners', 'Structured around Arc of Care', 'CEU credit hours (pending approval)', 'Zero-PHI documentation standard'].map((t) => (
                        <span key={t} style={{ fontSize: 12, color: '#6b7a8d', letterSpacing: '0.03em' }}>
                            ✓ {t}
                        </span>
                    ))}
                </div>

                {/* ── MODULES ───────────────────────────── */}
                <section style={{ maxWidth: 860, margin: '0 auto', padding: '72px 24px 0' }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#388bfd', marginBottom: 10 }}>The Curriculum</p>
                    <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 900, color: '#9fb0be', letterSpacing: '-0.02em', marginBottom: 40 }}>What You'll Learn</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                        {MODULES.map((m, i) => (
                            <div key={i} style={{
                                background: 'rgba(12,26,50,0.95)', border: '1px solid rgba(56,139,253,0.15)',
                                borderRadius: 16, padding: '22px 20px',
                            }}>
                                <div style={{ fontSize: 24, marginBottom: 10 }}>{m.icon}</div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: '#9fb0be', marginBottom: 6, lineHeight: 1.3 }}>{m.title}</div>
                                <div style={{ fontSize: 13, color: '#6b7a8d', lineHeight: 1.6 }}>{m.desc}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── AUDIENCE ──────────────────────────── */}
                <section style={{ maxWidth: 860, margin: '0 auto', padding: '72px 24px 0' }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#39d0d8', marginBottom: 10 }}>Who It's For</p>
                    <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 900, color: '#9fb0be', letterSpacing: '-0.02em', marginBottom: 40 }}>Built for Every Practitioner in the Field</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                        {AUDIENCE.map((a, i) => (
                            <div key={i} style={{
                                background: 'rgba(12,26,50,0.95)', border: '1px solid rgba(57,208,216,0.15)',
                                borderRadius: 16, padding: '24px 20px',
                            }}>
                                <div style={{ fontSize: 26, marginBottom: 12 }}>{a.icon}</div>
                                <div style={{ fontSize: 15, fontWeight: 800, color: '#9fb0be', marginBottom: 8 }}>{a.title}</div>
                                <div style={{ fontSize: 13, color: '#6b7a8d', lineHeight: 1.65 }}>{a.desc}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── AUTHORITY ─────────────────────────── */}
                <section style={{ maxWidth: 700, margin: '72px auto 0', padding: '0 24px' }}>
                    <div style={{
                        background: 'rgba(12,26,50,0.95)', border: '1px solid rgba(56,139,253,0.15)',
                        borderRadius: 20, padding: '36px 32px', textAlign: 'center',
                    }}>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#388bfd', marginBottom: 12 }}>Built on Real Evidence</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#9fb0be', marginBottom: 16 }}>Built by PPN Research Portal</div>
                        <p style={{ fontSize: 14, color: '#6b7a8d', lineHeight: 1.7, maxWidth: 500, margin: '0 auto' }}>
                            This curriculum is grounded in direct Voice of Customer research with practitioners across
                            Oregon, Colorado, and Hawaii — not theory. Every module addresses a documented pain point
                            from real clinical sessions. The Zero-PHI architecture that protects practitioners in the
                            portal powers the documentation standard taught here.
                        </p>
                    </div>
                </section>

                {/* ── WAITLIST FORM ─────────────────────── */}
                <section id="waitlist" style={{ maxWidth: 560, margin: '72px auto 0', padding: '0 24px' }}>
                    <div style={{
                        background: 'rgba(12,26,50,0.95)', border: '1px solid rgba(56,139,253,0.2)',
                        borderRadius: 24, padding: '40px 32px',
                    }}>
                        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#39d0d8', marginBottom: 10 }}>Early Access</p>
                        <h2 style={{ fontSize: 26, fontWeight: 900, color: '#9fb0be', letterSpacing: '-0.02em', marginBottom: 10 }}>Be Among the First</h2>
                        <p style={{ fontSize: 14, color: '#6b7a8d', lineHeight: 1.65, marginBottom: 28 }}>
                            Waitlist members get early access, founding member pricing, and direct input on the final curriculum.
                        </p>

                        {status === 'success' ? (
                            <div style={{
                                background: 'rgba(63,185,80,0.08)', border: '1px solid rgba(63,185,80,0.3)',
                                borderRadius: 14, padding: '28px 24px', textAlign: 'center',
                            }}>
                                <div style={{ fontSize: 28, marginBottom: 12 }}>✅</div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: '#3fb950', marginBottom: 8 }}>You're on the list.</div>
                                <p style={{ fontSize: 14, color: '#6b7a8d', lineHeight: 1.65 }}>
                                    We'll email you the moment enrollment opens. Expect founding member pricing and early access.
                                </p>
                            </div>
                        ) : status === 'duplicate' ? (
                            <div style={{
                                background: 'rgba(57,208,216,0.06)', border: '1px solid rgba(57,208,216,0.25)',
                                borderRadius: 14, padding: '24px', textAlign: 'center',
                            }}>
                                <div style={{ fontSize: 15, fontWeight: 700, color: '#39d0d8', marginBottom: 6 }}>You're already on the list!</div>
                                <p style={{ fontSize: 13, color: '#6b7a8d' }}>We'll be in touch when enrollment opens. Watch your inbox.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {status === 'error' && (
                                    <div style={{
                                        background: 'rgba(248,81,73,0.08)', border: '1px solid rgba(248,81,73,0.3)',
                                        borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#f85149',
                                    }}>
                                        Something went wrong. Please try again or email us at trevor@ppnportal.com
                                    </div>
                                )}

                                {/* First Name */}
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

                                {/* Email */}
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

                                {/* Practitioner Type */}
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

                                <button
                                    type="submit"
                                    disabled={status === 'loading' || !form.firstName || !form.email || !form.practitionerType}
                                    style={{
                                        width: '100%', padding: '15px', borderRadius: 10, fontSize: 16, fontWeight: 700,
                                        color: '#fff', border: 'none', cursor: 'pointer', marginTop: 4,
                                        background: 'linear-gradient(135deg, #388bfd, #2060cc)',
                                        opacity: (status === 'loading' || !form.firstName || !form.email || !form.practitionerType) ? 0.55 : 1,
                                        boxShadow: '0 6px 24px rgba(56,139,253,0.25)',
                                    }}
                                >
                                    {status === 'loading' ? 'Submitting...' : 'Join the Waitlist →'}
                                </button>

                                <p style={{ fontSize: 12, color: '#6b7a8d', textAlign: 'center', marginTop: 4 }}>
                                    No spam. No payment required. Just early access.
                                </p>
                            </form>
                        )}
                    </div>
                </section>

                {/* ── FAQ ───────────────────────────────── */}
                <section style={{ maxWidth: 600, margin: '72px auto 0', padding: '0 24px' }}>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: '#9fb0be', letterSpacing: '-0.02em', marginBottom: 24 }}>Common Questions</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {FAQS.map((faq, i) => (
                            <div key={i} style={{
                                background: 'rgba(12,26,50,0.95)', border: '1px solid rgba(56,139,253,0.15)',
                                borderRadius: 14, overflow: 'hidden',
                            }}>
                                <button
                                    id={`faq-btn-${i}`}
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    style={{
                                        width: '100%', padding: '16px 18px', display: 'flex', justifyContent: 'space-between',
                                        alignItems: 'center', cursor: 'pointer', background: 'transparent', border: 'none',
                                        color: '#9fb0be', fontSize: 14, fontWeight: 700, textAlign: 'left', gap: 12,
                                    }}
                                    aria-expanded={openFaq === i}
                                    aria-controls={`faq-body-${i}`}
                                >
                                    <span>{faq.q}</span>
                                    <span style={{ fontSize: 12, color: '#6b7a8d', flexShrink: 0, transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(180deg)' : 'none' }}>▾</span>
                                </button>
                                {openFaq === i && (
                                    <div id={`faq-body-${i}`} style={{ padding: '0 18px 16px', fontSize: 14, color: '#6b7a8d', lineHeight: 1.65 }}>
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── FOOTER BAR ────────────────────────── */}
                <footer style={{
                    maxWidth: 860, margin: '72px auto 0', padding: '28px 24px',
                    borderTop: '1px solid rgba(56,139,253,0.12)',
                    display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px 32px',
                    marginBottom: 0, paddingBottom: 48,
                }}>
                    <span style={{ fontSize: 13, color: '#6b7a8d' }}>
                        Already using PPN Research Portal?{' '}
                        <a href="/#/dashboard" style={{ color: '#388bfd', textDecoration: 'none', fontWeight: 600 }}>Go to Dashboard</a>
                    </span>
                    <span style={{ fontSize: 13, color: '#6b7a8d' }}>
                        Not a user yet?{' '}
                        <a href="/#/academy" style={{ color: '#39d0d8', textDecoration: 'none', fontWeight: 600 }}>Join the Waitlist</a>
                    </span>
                </footer>

            </div>
        </>
    );
};

export default Academy;
