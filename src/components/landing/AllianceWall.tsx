import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const quotes = [
    {
        text: "We don't just need to stay out of jail. We need to stay in business. The old message was fear-based, the new message requires an operating system.",
        role: "Clinical Director",
        org: "Ketamine Clinic Network"
    },
    {
        text: "A revolution requires scale. And scale requires boring things like CPT code optimization and efficient session logging.",
        role: "Operations Lead",
        org: "Psychedelic Hub"
    },
    {
        text: "The click-clack of a keyboard is so bureaucratic, it can pull a patient right out of a deep state. A silent tap captures data without breaking connection.",
        role: "Lead Facilitator",
        org: "MDMA Trial Site"
    },
    {
        text: "Psychedelic therapy is a six to eight hour continuous event. You can't just leave a standard medical chart open for eight hours and type notes from memory.",
        role: "Chief Medical Officer",
        org: "National Care Group"
    },
    {
        text: "If a patient has a panic attack, to a regulator that looks like a bad trip. If you have a timestamped log showing protocol, it becomes a managed adverse event.",
        role: "Legal Counsel",
        org: "Compliance Office"
    },
    {
        text: "You can't consent to ontological shock with a single intake PDF. Consent is a continuous process that must be dynamically tracked.",
        role: "Bioethicist",
        org: "Research Board"
    },
    {
        text: "The molecules are the easy part. The real bottleneck is the delivery system. If you can't bill for it, if you can't insure it... this never scales.",
        role: "Healthcare Economist",
        org: "Policy Think Tank"
    },
    {
        text: "After a dose, the brain is hyperplastic. If you can send integration homework perfectly timed to this window, patient retention skyrockets.",
        role: "Integration Therapist",
        org: "Private Practice"
    },
    {
        text: "You pay $10,000 for a certification, graduate, rent an office, and suddenly you are completely alone. We need a digital safety net for the healer.",
        role: "Clinical Supervisor",
        org: "Training Program"
    },
    {
        text: "The Frankenstein Stack. Intake forms over here, Spotify consumer over there, an Excel sheet for outcomes. You're toggling 5 tabs while holding space for trauma.",
        role: "Frontline Practitioner",
        org: "Independent Clinic"
    },
    {
        text: "Therapists are playing a game of chicken with insurance companies... trying to cram a 6-hour session into old temporary codes.",
        role: "Medical Billing VP",
        org: "Revenue Cycle Firm"
    },
    {
        text: "A revolution isn't just about expanding consciousness. It's about expanding administrative capacity.",
        role: "Founder",
        org: "Psychedelic Retreat"
    }
];

// Split quotes into columns
const col1 = [...quotes.slice(0, 4), ...quotes.slice(0, 4)];
const col2 = [...quotes.slice(4, 8), ...quotes.slice(4, 8)];
const col3 = [...quotes.slice(8, 12), ...quotes.slice(8, 12)];

const QuoteCard: React.FC<{ quote: typeof quotes[0] }> = ({ quote }) => (
    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-6 rounded-2xl flex flex-col gap-4 shadow-xl mb-6 hover:border-slate-700 transition-colors">
        <Quote className="text-primary/40 size-8 shrink-0" />
        <p className="text-slate-300 font-medium leading-relaxed">"{quote.text}"</p>
        <div className="mt-2 pt-4 border-t border-slate-800/80">
            <p className="text-[#A8B5D1] font-bold text-sm tracking-wide">{quote.role}</p>
            <p className="text-slate-500 text-xs uppercase tracking-widest mt-0.5">{quote.org}</p>
        </div>
    </div>
);

export default function AllianceWall() {
    return (
        <section className="py-32 relative overflow-hidden bg-transparent z-10">
            {/* Background Texture & Glows */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)] pointer-events-none" />
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-40" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none opacity-40" />

            <div className="max-w-7xl mx-auto px-6 relative z-10 mb-20 text-center">
                <p className="text-sm font-black text-primary uppercase tracking-[0.4em] mb-4">The Voice of the Alliance</p>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-[#A8B5D1]">
                    Make the miraculous <br />
                    <span className="text-gradient-primary">boring enough to scale.</span>
                </h2>
                <p className="text-lg text-slate-400 mt-6 max-w-2xl mx-auto leading-relaxed">
                    We listened to the practitioners navigating the chaos of the psychedelic renaissance. It's time to replace the Frankenstein Stack with a practice operating system.
                </p>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative h-[600px] sm:h-[800px] overflow-hidden" style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)', maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' }}>
                {/* CSS Mask for vertical fading removed from dom and added to parent style */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full items-start">

                    {/* Column 1 - Scrolling UP */}
                    <motion.div
                        className="flex flex-col gap-0"
                        animate={{ y: [0, -1000] }}
                        transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
                    >
                        {col1.map((quote, idx) => (
                            <QuoteCard key={`col1-${idx}`} quote={quote} />
                        ))}
                    </motion.div>

                    {/* Column 2 - Scrolling DOWN */}
                    <motion.div
                        className="hidden md:flex flex-col gap-0"
                        animate={{ y: [-1000, 0] }}
                        transition={{ repeat: Infinity, duration: 90, ease: "linear" }}
                    >
                        {col2.map((quote, idx) => (
                            <QuoteCard key={`col2-${idx}`} quote={quote} />
                        ))}
                    </motion.div>

                    {/* Column 3 - Same direction (offset speed) */}
                    <motion.div
                        className="hidden lg:flex flex-col gap-0"
                        animate={{ y: [0, -1000] }}
                        transition={{ repeat: Infinity, duration: 85, ease: "linear" }}
                    >
                        {col3.map((quote, idx) => (
                            <QuoteCard key={`col3-${idx}`} quote={quote} />
                        ))}
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
