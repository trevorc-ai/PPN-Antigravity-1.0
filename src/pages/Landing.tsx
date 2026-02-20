import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import {
  Loader2,
  AlertCircle,
  ShieldCheck,
  Lock,
  Database,
  Users,
  CheckCircle,
  Activity,
  ShieldAlert,
  Zap,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import SafetyRiskMatrixDemo from '../components/demos/SafetyRiskMatrixDemo';
import ClinicRadarDemo from '../components/demos/ClinicRadarDemo';
import PatientJourneyDemo from '../components/demos/PatientJourneyDemo';
import { GravityButton } from '../components/GravityButton';
import { BentoGrid, BentoCard } from '../components/layouts/BentoGrid';
import StarField from '../components/StarField';

const chartData = [
  { name: 'Site Avg', value: 68, color: '#334155' },
  { name: 'Alliance Avg', value: 74, color: '#475569' },
  { name: 'Your Site', value: 92, color: '#2b74f3' },
];

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [activeStatIndex, setActiveStatIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStatIndex((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Parallax scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Demo Mode Bypass
    if (import.meta.env.VITE_DEMO_MODE === 'true' && email === 'demo@test.com' && password === 'demo123') {
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-transparent text-slate-300 selection:bg-primary/30 selection:text-slate-300 font-sans overflow-x-hidden relative">

      {/* ── Sticky Nav Bar ─────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0a1628]/80 backdrop-blur-md border-b border-slate-800/60">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black tracking-tight text-slate-200 leading-none">PPN</span>
            <span className="text-lg font-black tracking-tight text-primary leading-none">Portal</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2 bg-slate-800 border border-slate-600 hover:border-indigo-500/60 hover:bg-slate-700 text-slate-200 text-sm font-bold rounded-xl transition-all"
        >
          Sign In
        </button>
      </header>

      <StarField scrollY={scrollY} />

      {/* SECTION: Hero — top padding accounts for sticky nav height */}
      <div className="relative pt-40 pb-20 lg:pt-52 lg:pb-32 px-6 overflow-hidden z-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full max-w-7xl mx-auto px-6 relative z-10">
          {/* Left Column (Text) */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 w-full"
            >
              <div className="inline-flex items-center gap-2 px-5 py-3 bg-primary/15 border-2 border-blue-500/60 rounded-full text-[12px] sm:text-[13px] font-black tracking-wide text-blue-300 shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-lg">grid_view</span>
                Augmented Intelligence for Psychedelic Wellness Practitioners
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.5] pb-4 text-slate-300">
                Clinical <span className="text-gradient-primary inline-block pb-3">intelligence</span><br />
                for psychedelic wellness practitioners.
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl lg:mx-0 mx-auto leading-relaxed font-medium">
                Real-time safety surveillance, outcomes benchmarking, and protocol management. Built for how you actually practice.
              </p>
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl lg:mx-0 mx-auto leading-relaxed font-medium">
                You contribute de-identified outcomes data. You get back benchmarks, safety signals, and peer intelligence. The field gets the evidence base it needs.
              </p>
            </motion.div>

            {/* CRITICAL: Visual Boundary Statement */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="max-w-2xl lg:mx-0 mx-auto p-4 bg-slate-900/40 border border-slate-800 rounded-2xl"
            >
              <p className="text-[12px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                <span className="text-primary mr-2">Notice:</span>
                PPN Portal is a measurement and benchmarking tool. It does not provide medical advice, treatment recommendations, or dosing guidance.
              </p>
            </motion.div>

            {/* Call-to-Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="space-y-4 w-full max-w-md lg:mx-0 mx-auto"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/signup')}
                  className="flex-1 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-base font-black rounded-xl uppercase tracking-wide transition-all shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95"
                >
                  Request Early Access
                </button>

                <button
                  onClick={() => navigate('/partner-demo')}
                  className="flex-1 px-6 py-4 bg-transparent border-2 border-slate-600 hover:border-slate-500 text-slate-300 text-base font-semibold rounded-xl transition-all hover:bg-slate-900/50 active:scale-95"
                >
                  Watch Demo (2 min)
                </button>
              </div>

              {/* Trust Indicators + Sign In link */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Invitation-only · Licensed practitioners</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>HIPAA-compliant infrastructure</span>
                  </div>
                </div>
                <p className="text-sm text-slate-500 text-center lg:text-left">
                  Already have an account?{' '}
                  <button
                    onClick={() => navigate('/login')}
                    className="text-primary hover:text-blue-400 font-bold underline underline-offset-2 transition-colors"
                  >
                    Sign In →
                  </button>
                </p>
              </div>
            </motion.div>




            {/* Early Access Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="flex flex-col gap-3 w-full max-w-md lg:mx-0 mx-auto pt-8 border-t border-slate-800/50"
            >
              <div className="flex items-center gap-3 px-4 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                <span className="material-symbols-outlined text-indigo-400 text-lg">lock</span>
                <div>
                  <p className="text-sm font-black text-slate-300">Invitation-Only Early Access</p>
                  <p className="text-xs text-slate-500 mt-0.5">Founding practitioners are shaping the platform — apply to join.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <span className="material-symbols-outlined text-emerald-400 text-lg">verified</span>
                <div>
                  <p className="text-sm font-black text-slate-300">Purpose-Built Infrastructure</p>
                  <p className="text-xs text-slate-500 mt-0.5">Clinical-grade data architecture. Structured, encrypted, and site-isolated from day one.</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column (Visual) */}
          <div className="flex justify-center lg:justify-end relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: [1, 1.05, 1],
              }}
              transition={{
                opacity: { duration: 1.5 },
                scale: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="w-[400px] lg:w-[600px] pointer-events-none z-0"
            >
              <img src="/molecules/Psilocybin.webp" alt="Psilocybin Molecule" className="w-full h-auto" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* SECTION: Global Alliance */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900/20 border border-slate-800 rounded-[4rem] p-10 sm:p-20 relative overflow-hidden flex flex-col items-center text-center space-y-10">
            {/* Background effects */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Heading */}
            <div className="space-y-6 max-w-3xl relative z-10">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-300 tracking-tighter leading-tight">
                The Global <span className="text-gradient-purple inline-block pb-1">Psychedelic Practitioner</span> Alliance.
              </h2>
              <p className="text-2xl sm:text-3xl font-medium text-slate-300 tracking-tight">
                Where every session makes the field smarter.
              </p>
              <div className="space-y-4 text-lg text-slate-300 leading-relaxed font-medium max-w-2xl mx-auto">
                <p>
                  PPN is not a directory. It's a professional alliance of licensed clinicians who share one goal: prove that psychedelic therapy works safely, consistently, and at scale.
                </p>
                <p>
                  By pooling de-identified outcomes data across a growing alliance of practitioners, we're building the evidence base that supports insurance coverage, reduces malpractice risk, and elevates the entire field.
                </p>
                <p className="text-xl font-semibold text-slate-300">
                  You don't have to build this alone.
                </p>
              </div>
            </div>

            {/* Network Status */}
            <div className="flex flex-col items-center gap-4 w-full max-w-2xl relative z-10">
              <div className="flex items-center gap-3 px-6 py-4 bg-slate-900/60 border border-slate-700 rounded-2xl">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"></span>
                <p className="text-sm font-bold text-slate-300">Early access open to licensed practitioners — <span className="text-primary">apply at ppnportal.net</span></p>
              </div>
              <p className="text-xs text-slate-600 font-medium italic max-w-md">
                As our alliance grows, participating cities will be listed here — updated from the verified registry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Trust Indicators */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm text-slate-500 font-bold uppercase tracking-widest mb-12">
            Built on Clinical-Grade Security Standards
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-clinical-green" />
              <p className="text-sm font-bold text-slate-300">HIPAA Architecture</p>
            </motion.div>
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Lock className="w-12 h-12 mx-auto mb-3 text-primary" />
              <p className="text-sm font-bold text-slate-300">End-to-End Encrypted</p>
            </motion.div>
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Database className="w-12 h-12 mx-auto mb-3 text-purple-400" />
              <p className="text-sm font-bold text-slate-300">Clinical-Grade Infrastructure</p>
            </motion.div>
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Users className="w-12 h-12 mx-auto mb-3 text-indigo-400" />
              <p className="text-sm font-bold text-slate-300">Multi-Site Ready</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION: Unified Clinical Operations - NEW */}
      <section className="py-24 px-6 relative z-10 border-y border-slate-800/50 bg-slate-900/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-300 tracking-tight leading-tight">
              The <span className="text-gradient-primary inline-block pb-1">Frankenstein Stack</span> is real.
            </h2>
            <div className="space-y-4 text-slate-300 text-lg leading-relaxed font-medium">
              <p>
                IntakeQ for intake. Spruce for messaging. Spotify for music. Excel for outcomes. A generic EHR for billing. Five apps, zero integration.
              </p>
              <p>
                That context switching costs practitioners 5 to 10 hours a week. PPN consolidates your clinical core into one place so you can focus on care, not admin.
              </p>
            </div>
            <button
              onClick={() => navigate('/deep-dives/workflow-chaos')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-blue-600 text-slate-300 text-sm font-black rounded-xl uppercase tracking-widest transition-all shadow-xl shadow-primary/10 group"
            >
              Unify Your Practice
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-[2rem] blur-3xl opacity-30"></div>
            <div className="relative bg-slate-950 border border-slate-800 rounded-[2rem] p-8 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl opacity-60">
                <span className="material-symbols-outlined text-red-400">warning</span>
                <span className="text-red-300 font-bold text-sm">Disconnected Tools Risk</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="material-symbols-outlined text-slate-500">description</span>
                <span className="text-slate-300 font-bold text-sm line-through">Unsecure Spreadsheets</span>
              </div>
              <div className="flex items-center gap-4 p-4 bg-clinical-green/20 border border-clinical-green/30 rounded-xl">
                <span className="material-symbols-outlined text-clinical-green">check_circle</span>
                <span className="text-clinical-green font-bold text-sm">Unified PPN Record</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: How It Works */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <p className="text-sm font-black text-primary uppercase tracking-[0.4em]">Simple Process</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-300">How It Works</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">Four steps to collaborative clinical intelligence</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {[
              {
                step: 1,
                title: "Join Alliance",
                desc: "Request access and verify credentials",
                icon: Users
              },
              {
                step: 2,
                title: "Log Protocols",
                desc: "Enter de-identified treatment data",
                icon: Database
              },
              {
                step: 3,
                title: "Track Outcomes",
                desc: "Monitor safety and efficacy metrics",
                icon: Activity
              },
              {
                step: 4,
                title: "Benchmark",
                desc: "Compare against alliance benchmarks",
                icon: BarChart3
              }
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="text-center space-y-4 relative"
              >
                {/* Connector Line */}
                {i < 3 && (
                  <div className="hidden lg:block absolute left-1/2 top-8 h-0.5 w-full bg-gradient-to-r from-primary/50 via-primary/30 to-transparent -z-10" style={{ transform: 'translateX(2rem)' }} />
                )}

                {/* Step Number Circle */}
                <div className="relative inline-block">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mx-auto relative z-10">
                    <span className="text-2xl font-black text-primary">{item.step}</span>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
                </div>

                {/* Icon */}
                <item.icon className="w-8 h-8 mx-auto text-slate-300" />

                {/* Content */}
                <h3 className="text-xl font-black text-slate-300">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: Product Showcase - See What's Inside */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-20">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <p className="text-sm font-black text-primary uppercase tracking-[0.4em]">What's Inside</p>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight pb-2 text-slate-300">
              Three tools.<br /><span className="text-gradient-primary inline-block pb-1">One tab.</span>
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
              See what practitioners use every session.
            </p>
          </div>

          {/* Feature 1: Safety Risk Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Component Left */}
            <div className="relative group order-2 lg:order-1">
              <div className="absolute -inset-4 bg-red-500/10 rounded-[4rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative">
                <SafetyRiskMatrixDemo />
              </div>
            </div>

            {/* Text Right */}
            <div className="space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-xs font-black text-red-400 uppercase tracking-widest">
                <span className="material-symbols-outlined text-sm">security</span>
                Safety Surveillance
              </div>
              <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-300 leading-tight">
                Active guardrails for every session.
              </h3>
              <p className="text-lg text-slate-300 leading-relaxed font-medium">
                Catch risks before they enter the treatment room. The system automatically cross-checks your patient's current medications against your selected protocol, flagging dangerous interactions like Serotonin Syndrome instantly.
              </p>
              <button
                onClick={() => navigate('/deep-dives/safety-surveillance')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-sm font-black rounded-xl uppercase tracking-widest transition-all group"
              >
                View Live Demo
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </motion.div>

          {/* Feature 2: Clinical Radar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Text Left */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-black text-primary uppercase tracking-widest">
                <span className="material-symbols-outlined text-sm">query_stats</span>
                Alliance Benchmarking
              </div>
              <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-300 leading-tight">
                See how your practice compares to the alliance.
              </h3>
              <p className="text-lg text-slate-300 leading-relaxed font-medium">
                Safety scores, retention rates, and outcomes compared to anonymized alliance percentiles. Identify gaps before they become liabilities.
              </p>
              <button
                onClick={() => navigate('/analytics')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary text-sm font-black rounded-xl uppercase tracking-widest transition-all group"
              >
                View Live Demo
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>

            {/* Component Right */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/10 rounded-[4rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative">
                <ClinicRadarDemo />
              </div>
            </div>
          </motion.div>

          {/* Feature 3: Patient Journey */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Component Left */}
            <div className="relative group order-2 lg:order-1">
              <div className="absolute -inset-4 bg-emerald-500/10 rounded-[4rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative">
                <PatientJourneyDemo />
              </div>
            </div>

            {/* Text Right */}
            <div className="space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-black text-emerald-400 uppercase tracking-widest">
                <span className="material-symbols-outlined text-sm">timeline</span>
                Patient Outcomes
              </div>
              <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-300 leading-tight">
                The story behind the symptom.
              </h3>
              <p className="text-lg text-slate-300 leading-relaxed font-medium">
                Show your patients the direct link between their sessions and their progress. This timeline view connects specific dosing events to mood improvements, turning abstract feelings into visible breakthroughs.
              </p>
              <button
                onClick={() => navigate('/deep-dives/patient-journey')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 text-sm font-black rounded-xl uppercase tracking-widest transition-all group"
              >
                View Live Demo
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section >



      {/* SECTION: Mission & Stats */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: Text */}
            <div className="space-y-8">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-300 leading-tight">
                Built by practitioners.<br /><span className="text-gradient-primary inline-block pb-1">For practitioners.</span>
              </h2>
              <div className="space-y-6 text-slate-300 text-base leading-relaxed font-medium">
                <p>
                  PPN was built to solve a specific problem: licensed psychedelic wellness practitioners have no standard infrastructure for tracking outcomes, flagging safety events, or comparing results with peers.
                </p>
                <p>
                  We built structured data capture, de-identified longitudinal tracking, and alliance benchmarking into a single platform. Privacy by design. No free-text clinical notes in shared data. No patient identifiers ever leave your site.
                </p>
              </div>
            </div>

            {/* Right: Stats Grid */}
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full opacity-50"></div>
              <div className="relative bg-[#111418]/60 border border-slate-800 rounded-[3rem] p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 bg-black/40 border border-slate-800 rounded-[2rem] space-y-3">
                    <span className="material-symbols-outlined text-4xl text-primary">inventory_2</span>
                    <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Structured Clinical Records</p>
                    <p className="text-xs text-slate-600">Built for scale from day one</p>
                  </div>
                  <div className="p-6 bg-black/40 border border-slate-800 rounded-[2rem] space-y-3">
                    <span className="material-symbols-outlined text-4xl text-clinical-green">share</span>
                    <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Multi-Site Architecture</p>
                    <p className="text-xs text-slate-600">Network-ready from launch</p>
                  </div>
                  <div className="p-6 bg-black/40 border border-slate-800 rounded-[2rem] space-y-3">
                    <span className="material-symbols-outlined text-4xl text-primary">query_stats</span>
                    <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Longitudinal Outcomes</p>
                    <p className="text-xs text-slate-600">PHQ-9, GAD-7, MEQ-30 tracking</p>
                  </div>
                  <div className="p-6 bg-black/40 border border-slate-800 rounded-[2rem] space-y-3">
                    <span className="material-symbols-outlined text-4xl text-accent-amber">shield</span>
                    <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Zero Compromise Security</p>
                    <p className="text-xs text-slate-600">RLS + encryption by default</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION: Bento Box Features - BENTO GRID */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-300 leading-tight">
              Clinical <span className="text-gradient-primary inline-block pb-1">Intelligence</span> Infrastructure
            </h2>
            <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.4em]">Structured. Secure. Built for Clinical Scale.</p>
          </div>

          <BentoGrid>
            {/* Cell 1: Internal Registry */}
            <BentoCard span={6} glass>
              <motion.div
                whileHover={{ y: -5 }}
                className="h-full overflow-hidden relative group"
              >
                <div className="h-full flex flex-col justify-between relative z-10">
                  <div className="space-y-2">
                    <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 mb-4 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-3xl">database</span>
                    </div>
                    <h3 className="text-3xl font-black tracking-tight text-slate-300">Internal Registry</h3>
                    <p className="text-slate-300 text-lg font-medium leading-relaxed max-w-md">
                      Secure local tracking of your site's unique outcomes with standardized measures.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500 font-mono">Structured Data Capture</span>
                    <div className="h-px flex-1 bg-slate-800"></div>
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 p-10 material-symbols-outlined text-[180px] text-slate-300/5 -mb-20 -mr-10 group-hover:scale-110 transition-transform">inventory_2</span>
              </motion.div>
            </BentoCard>

            {/* Cell 2: Network Benchmarks */}
            <BentoCard span={6}>
              <motion.div
                whileHover={{ y: -5 }}
                className="h-full bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-6 group hover:shadow-2xl hover:shadow-indigo-500/5 transition-all"
              >
                <div className="h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="material-symbols-outlined text-4xl text-indigo-400">query_stats</span>
                    <h3 className="text-2xl font-black tracking-tight">Alliance Benchmarks</h3>
                    <p className="text-slate-300 font-medium leading-relaxed">
                      Compare your results against aggregated, de-identified percentiles.
                    </p>
                  </div>
                  <div className="pt-6">
                    <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full w-fit">
                      <motion.span
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="size-1.5 bg-indigo-400 rounded-full"
                      ></motion.span>
                      <span className="text-xs font-black uppercase text-indigo-300">Cohort Comparisons</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </BentoCard>

            {/* Cell 3: Safety Surveillance */}
            <BentoCard span={6}>
              <motion.div
                whileHover={{ y: -5 }}
                className="h-full bg-red-600/5 border border-red-500/10 rounded-2xl p-6 group hover:border-red-500/30 transition-all"
              >
                <div className="h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="material-symbols-outlined text-4xl text-red-400">security</span>
                    <h3 className="text-2xl font-black tracking-tight">Safety Surveillance</h3>
                    <p className="text-slate-300 font-medium leading-relaxed">
                      Real-time detection of adverse events and contraindication spikes.
                    </p>
                  </div>
                  <div className="p-4 bg-black/40 rounded-2xl border border-red-500/10">
                    <p className="text-[12px] font-mono text-red-400/80 font-bold uppercase tracking-widest">Safety Monitoring Active</p>
                  </div>
                </div>
              </motion.div>
            </BentoCard>

            {/* Cell 4: Structured Data */}
            <BentoCard span={6} glass>
              <motion.div
                whileHover={{ y: -5 }}
                className="h-full relative overflow-hidden group"
              >
                <div className="h-full flex flex-col justify-between relative z-10">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black tracking-tight text-slate-300">Standardized Measures</h3>
                    <p className="text-slate-300 text-lg font-medium leading-relaxed max-w-lg">
                      We use structured, coded data (MedDRA, ICAN) to ensure every data point contributes to validated benchmarks.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    {['MedDRA', 'LOINC', 'SNOMED'].map(code => (
                      <span key={code} className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-black text-slate-500 tracking-widest uppercase">{code}</span>
                    ))}
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-700">
                  <span className="material-symbols-outlined text-[140px]">code</span>
                </div>
              </motion.div>
            </BentoCard>
          </BentoGrid>
        </div>
      </section>

      {/* SECTION: About PPN */}
      <section className="py-32 px-6 border-b border-slate-900/50 relative z-10">
        <div className="max-w-4xl mx-auto text-left space-y-8">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-300 tracking-tight">
            About <span className="text-gradient-primary inline-block pb-1">PPN</span>
          </h2>
          <div className="space-y-6">
            <p className="text-lg text-slate-300 leading-relaxed font-medium">
              The <span className="text-slate-300 font-bold">Psychedelic Practitioners Network (PPN)</span> is a practitioner-only alliance focused on one thing: helping clinics learn faster from real-world care. We standardize the inputs that shape outcomes across preparation, dosing, and integration, then return aggregated benchmarks and safety signals that every site can use to improve consistency.
            </p>
            <p className="text-lg text-slate-300 leading-relaxed font-medium">
              Privacy by design. Structured fields over narrative text. De-identified longitudinal tracking inside each site. Alliance insights shown only in aggregate, never at the patient level.
            </p>
          </div>

          {/* Veterans PTSD Statement */}
          <div className="mt-8 p-8 bg-indigo-600/10 border-2 border-indigo-500/20 rounded-2xl space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-500/20 rounded-xl flex-shrink-0">
                <span className="material-symbols-outlined text-2xl text-indigo-400">military_tech</span>
              </div>
              <div className="space-y-3">
                <h4 className="text-xl font-black text-slate-300">Committed to Veteran Care</h4>
                <p className="text-base text-slate-300 leading-relaxed">
                  MDMA-assisted therapy is showing 67% PTSD remission rates in Phase 3 trials. Veterans deserve practitioners who are supported by real data infrastructure, not spreadsheets.
                </p>
                <p className="text-base text-slate-300 leading-relaxed">
                  PPN supports multi-site outcomes tracking for <span className="text-indigo-300 font-bold">MDMA-assisted therapy and psilocybin research for treatment-resistant PTSD</span>. Every session logged contributes to the evidence base that matters.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/signup')}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black rounded-xl uppercase tracking-widest transition-all"
              >
                Be Part of What Gets Built
              </button>
              <a
                href="mailto:info@ppnportal.net"
                className="px-8 py-4 bg-transparent border border-indigo-500/30 hover:border-indigo-500/60 text-indigo-300 text-sm font-black rounded-xl uppercase tracking-widest transition-all text-center"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section >
      <footer className="py-32 px-6 bg-[#05070a] border-t border-slate-900 relative z-10">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="space-y-6">
              <h1 className="text-2xl font-black tracking-tighter cursor-default">
                PPN <span className="text-primary font-bold">Portal</span>
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Clinical intelligence and safety infrastructure for licensed psychedelic wellness practitioners.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-300">Legal & Privacy</h4>
              <ul className="space-y-2 text-sm text-slate-500 font-medium">
                <li><a href="/#/terms" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="/#/privacy" className="hover:text-primary transition-colors">Privacy &amp; De-identification Policy</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-300">Platform Status</h4>
              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-1">
                <p className="text-sm font-black text-clinical-green">Operational</p>
                <p className="text-sm text-slate-600 font-black uppercase tracking-widest">All Systems Online</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-300">Practitioner Access</h4>
              <button onClick={() => navigate('/login')} className="w-full py-4 bg-slate-900 border border-slate-800 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                Sign In to Portal
              </button>
            </div>
          </div>

          {/* FINAL BOUNDARY STATEMENT */}
          <div className="pt-20 border-t border-slate-900 text-center space-y-6">
            <p className="text-sm font-bold text-slate-600 leading-relaxed max-w-3xl mx-auto uppercase tracking-widest">
              PPN Portal is a measurement and benchmarking tool. It does not provide medical advice, treatment recommendations, or dosing guidance. We do not support patient-level data sharing across clinics.
            </p>
            <p className="text-sm text-slate-700 font-medium tracking-widest">
              &copy; 2026 PRECISION PSYCHEDELIC NETWORK (PPN). ALL RIGHTS RESERVED. FOR LICENSED PRACTITIONERS ONLY.
            </p>
          </div>
        </div>
      </footer>
    </div >
  );
};

export default Landing;
