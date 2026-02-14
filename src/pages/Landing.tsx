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

const chartData = [
  { name: 'Node Avg', value: 68, color: '#334155' },
  { name: 'Network Avg', value: 74, color: '#475569' },
  { name: 'Your Node', value: 92, color: '#2b74f3' },
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
    <div className="min-h-screen bg-transparent text-slate-100 selection:bg-primary/30 selection:text-white font-sans overflow-x-hidden relative">

      {/* Starry Night Parallax Background - Fixed across entire page */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Base dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#0d1b2a] to-[#05070a]"></div>

        {/* CSS-Generated Starfield */}
        <div className="absolute inset-0" style={{
          transform: `translateY(${scrollY * 0.05}px)`,
          backgroundImage: `
            radial-gradient(2px 2px at 20% 30%, white, transparent),
            radial-gradient(2px 2px at 60% 70%, white, transparent),
            radial-gradient(1px 1px at 50% 50%, white, transparent),
            radial-gradient(1px 1px at 80% 10%, white, transparent),
            radial-gradient(2px 2px at 90% 60%, white, transparent),
            radial-gradient(1px 1px at 33% 80%, white, transparent),
            radial-gradient(1px 1px at 15% 90%, white, transparent)
          `,
          backgroundSize: '200px 200px, 300px 300px, 250px 250px, 400px 400px, 350px 350px, 280px 280px, 320px 320px',
          backgroundPosition: '0 0, 40px 60px, 130px 270px, 70px 100px, 200px 150px, 90px 220px, 160px 50px',
          opacity: 0.4
        }}></div>

        {/* Twinkling stars layer */}
        <div className="absolute inset-0 animate-twinkle" style={{
          transform: `translateY(${scrollY * 0.08}px)`,
          backgroundImage: `
            radial-gradient(1px 1px at 25% 25%, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 75% 45%, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 45% 75%, rgba(255,255,255,0.7), transparent)
          `,
          backgroundSize: '300px 300px, 400px 400px, 350px 350px',
          opacity: 0.3
        }}></div>
      </div>

      {/* SECTION: Hero */}
      <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 px-6 overflow-hidden z-10">
        {/* Public Navigation Bar */}
        <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-6 md:px-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Activity className="text-white w-6 h-6" />
              </div>
              <div className="hidden md:block">
                <p className="text-lg font-black text-white tracking-tight leading-none">PPN Portal</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Research Network</p>
              </div>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              {['Features', 'Network', 'About'].map((item) => (
                <button key={item} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
                  {item}
                </button>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-bold text-white hover:text-indigo-400 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-black rounded-xl uppercase tracking-widest transition-all backdrop-blur-sm"
              >
                Join Network
              </button>
            </div>
          </div>
        </nav>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full max-w-7xl mx-auto px-6 relative z-10">
          {/* Left Column (Text) */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 w-full"
            >
              <div className="inline-flex items-center gap-2 px-5 py-3 bg-primary/10 border-2 border-primary/30 rounded-full text-[12px] sm:text-[13px] font-black uppercase tracking-[0.25em] text-primary shadow-lg shadow-primary/10">
                <span className="material-symbols-outlined text-lg">grid_view</span>
                Operational Intelligence for Modern Clinics
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.9] pb-4 text-slate-100">
                Global Psychedelic <br />
                <span className="text-gradient-primary inline-block pb-1">Practitioner Network</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-400 max-w-2xl lg:mx-0 mx-auto leading-relaxed font-medium">
                The Practice Operating System for Psychedelic Therapy. Unify safety, outcomes, and compliance into a single secure platform.
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
                PPN Research Portal is a measurement and benchmarking tool. It does not provide medical advice, treatment recommendations, or dosing guidance.
              </p>
            </motion.div>

            {/* Call-to-Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 w-full max-w-md lg:mx-0 mx-auto"
            >
              <button
                onClick={() => navigate('/login')}
                className="flex-1 px-8 py-5 bg-primary hover:bg-blue-600 text-white text-[13px] font-black rounded-2xl uppercase tracking-[0.2em] transition-all shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              >
                Access Portal
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/signup')}
                className="flex-1 px-8 py-5 bg-slate-900/80 border-2 border-slate-700 hover:border-primary text-slate-200 hover:text-white text-[13px] font-black rounded-2xl uppercase tracking-[0.2em] transition-all hover:bg-slate-800 active:scale-95"
              >
                Request Access
              </button>
            </motion.div>




            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="grid grid-cols-3 gap-6 w-full max-w-md lg:mx-0 mx-auto pt-8 border-t border-slate-800/50"
            >
              <div className="text-center">
                <p className="text-2xl font-black text-white">12k+</p>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">Records</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-white">840+</p>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">Clinicians</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-clinical-green">98%</p>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">Uptime</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column (Visual) */}
          <div className="flex justify-center lg:justify-end relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: [0, 30, -20, 25, 0],
                y: [0, -40, 10, -30, 0],
                rotate: [0, 5, -5, 3, 0]
              }}
              transition={{
                opacity: { duration: 1.5 },
                scale: { duration: 1.5 },
                x: { duration: 10, repeat: Infinity, ease: "easeInOut" },
                y: { duration: 10, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 10, repeat: Infinity, ease: "easeInOut" }
              }}
              className="w-[300px] lg:w-[450px] pointer-events-none z-0"
            >
              <img src="/molecules/Psilocybin.webp" alt="Psilocybin Molecule" className="w-full h-auto" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* SECTION: Trust Indicators */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm text-slate-500 font-bold uppercase tracking-widest mb-12">
            Trusted by Leading Research Institutions
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center">
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-clinical-green" />
              <p className="text-sm font-bold text-slate-400">HIPAA Compliant</p>
            </motion.div>
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Lock className="w-12 h-12 mx-auto mb-3 text-primary" />
              <p className="text-sm font-bold text-slate-400">End-to-End Encrypted</p>
            </motion.div>
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Database className="w-12 h-12 mx-auto mb-3 text-purple-400" />
              <p className="text-sm font-bold text-slate-400">12,482+ Records</p>
            </motion.div>
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Users className="w-12 h-12 mx-auto mb-3 text-indigo-400" />
              <p className="text-sm font-bold text-slate-400">Multi-Site Network</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION: Unified Clinical Operations - NEW */}
      <section className="py-20 px-6 relative z-10 border-y border-slate-800/50 bg-slate-900/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Is your clinical workflow <span className="text-gradient-primary inline-block pb-1">fragmented?</span>
            </h2>
            <div className="space-y-4 text-slate-400 text-lg leading-relaxed font-medium">
              <p>
                IntakeQ for forms. Spruce for messaging. Spotify for music. Excel for outcomes. A generic EHR for billing.
              </p>
              <p>
                This fragmentation leads to <strong>administrative burnout</strong> and data silos. PPN consolidates your clinical core into one unified flow.
              </p>
            </div>
            <button
              onClick={() => navigate('/deep-dives/workflow-chaos')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-blue-600 text-white text-sm font-black rounded-xl uppercase tracking-widest transition-all shadow-xl shadow-primary/10 group"
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
                <span className="text-slate-400 font-bold text-sm line-through">Unsecure Spreadsheets</span>
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
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <p className="text-[11px] font-black text-primary uppercase tracking-[0.4em]">Simple Process</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-200">How It Works</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Four steps to collaborative clinical intelligence</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              {
                step: 1,
                title: "Join Network",
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
                desc: "Compare against network averages",
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
                <item.icon className="w-8 h-8 mx-auto text-slate-400" />

                {/* Content */}
                <h3 className="text-xl font-black text-slate-300">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: Product Showcase - See What's Inside */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-20">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <p className="text-[11px] font-black text-primary uppercase tracking-[0.4em]">Clinical Intelligence Platform</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight pb-2 text-slate-200">
              Built for <span className="text-gradient-primary inline-block pb-1">Safety</span>.<br />Designed for Growth.
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
              See how PPN helps you practice with confidence.
            </p>
          </div>

          {/* Feature 1: Safety Risk Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
          >
            {/* Component Left */}
            <div className="relative group order-2 lg:order-1">
              <div className="absolute -inset-4 bg-red-500/10 rounded-[4rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative">
                <SafetyRiskMatrixDemo />
              </div>
            </div>

            {/* Text Right */}
            <div className="space-y-8 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-[11px] font-black text-red-400 uppercase tracking-widest">
                <span className="material-symbols-outlined text-sm">security</span>
                Safety Surveillance
              </div>
              <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
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
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center"
          >
            {/* Text Left */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-[11px] font-black text-primary uppercase tracking-widest">
                <span className="material-symbols-outlined text-sm">query_stats</span>
                Network Benchmarking
              </div>
              <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Calibrate your practice against the global standard.
              </h3>
              <p className="text-lg text-slate-300 leading-relaxed font-medium">
                Stop practicing in isolation. Instantly see how your clinic's safety scores, patient retention rates, and efficacy outcomes compare to the anonymized network average, helping you spot blind spots before they become liabilities.
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
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center"
          >
            {/* Component Left */}
            <div className="relative group order-2 lg:order-1">
              <div className="absolute -inset-4 bg-emerald-500/10 rounded-[4rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative">
                <PatientJourneyDemo />
              </div>
            </div>

            {/* Text Right */}
            <div className="space-y-8 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[11px] font-black text-emerald-400 uppercase tracking-widest">
                <span className="material-symbols-outlined text-sm">timeline</span>
                Patient Outcomes
              </div>
              <h3 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
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

      {/* SECTION: Global Network */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900/20 border border-slate-800 rounded-[4rem] p-10 sm:p-20 relative overflow-hidden flex flex-col items-center text-center space-y-10">
            {/* Background effects */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Heading */}
            <div className="space-y-4 max-w-2xl relative z-10">
              <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter leading-tight">
                The Global <span className="text-gradient-purple inline-block pb-1">Psychedelic Practitioner</span> Network.
              </h2>
              <p className="text-slate-400 font-medium text-lg leading-relaxed">
                PPN operates across 14 institutional sites globally, facilitating the world's most comprehensive longitudinal study on psychedelic therapy.
              </p>
            </div>

            {/* City Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl relative z-10">
              {['Baltimore', 'London', 'Zurich', 'Palo Alto'].map(loc => (
                <div key={loc} className="space-y-2">
                  <p className="text-2xl font-black text-white">{loc}</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="size-1.5 rounded-full bg-clinical-green animate-pulse"></span>
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Active Practitioner</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: Mission & Stats */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: Text */}
            <div className="space-y-8">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                A <span className="text-gradient-primary inline-block pb-1">Unified</span> Framework for <br />Clinical Excellence.
              </h2>
              <div className="space-y-6 text-slate-400 text-base leading-relaxed font-medium">
                <p>
                  Founded on the principles of open collaboration and radical data integrity, the Psychedelic Practitioners Network (PPN) bridges the gap between discovery and clinical practice.
                </p>
                <p>
                  We believe that the future of mental health requires a high-fidelity infrastructure capable of tracking long-term outcomes, managing complex substance interactions, and facilitating secure practitioner knowledge exchange.
                </p>
              </div>
            </div>

            {/* Right: Stats Grid */}
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full opacity-50"></div>
              <div className="relative bg-[#111418]/60 border border-slate-800 rounded-[3rem] p-10 sm:p-14 lg:p-16 shadow-2xl backdrop-blur-xl">
                <div className="grid grid-cols-2 gap-8">
                  <div className="p-6 bg-black/40 border border-slate-800 rounded-[2rem] space-y-3">
                    <span className="text-3xl font-black text-white">12k+</span>
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Enrolled Subjects</p>
                  </div>
                  <div className="p-6 bg-black/40 border border-slate-800 rounded-[2rem] space-y-3">
                    <span className="text-3xl font-black text-clinical-green">04</span>
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Global Hubs</p>
                  </div>
                  <div className="p-6 bg-black/40 border border-slate-800 rounded-[2rem] space-y-3">
                    <span className="text-3xl font-black text-primary">85%</span>
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Avg. Outcome Lift</p>
                  </div>
                  <div className="p-6 bg-black/40 border border-slate-800 rounded-[2rem] space-y-3">
                    <span className="text-3xl font-black text-accent-amber">99.9%</span>
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Data Integrity</p>
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
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Clinical <span className="text-gradient-primary inline-block pb-1">Intelligence</span> Infrastructure
            </h2>
            <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.4em]">Designed for Institutional Precision</p>
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
                    <h3 className="text-3xl font-black tracking-tight text-white">Internal Registry</h3>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-md">
                      Secure local tracking of your site's unique outcomes with standardized measures.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 font-mono">Structured Data Capture</span>
                    <div className="h-px flex-1 bg-slate-800"></div>
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 p-10 material-symbols-outlined text-[180px] text-white/5 -mb-20 -mr-10 group-hover:scale-110 transition-transform">inventory_2</span>
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
                    <h3 className="text-2xl font-black tracking-tight">Network Benchmarks</h3>
                    <p className="text-slate-400 font-medium leading-relaxed">
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
                      <span className="text-[11px] font-black uppercase text-indigo-300">Cohort Comparisons</span>
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
                    <p className="text-slate-400 font-medium leading-relaxed">
                      Real-time detection of adverse events and contraindication spikes.
                    </p>
                  </div>
                  <div className="p-4 bg-black/40 rounded-2xl border border-red-500/10">
                    <p className="text-[12px] font-mono text-red-400/80 font-bold uppercase tracking-widest">Global Risk Pulse Active</p>
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
                    <h3 className="text-3xl font-black tracking-tight text-white">Standardized Measures</h3>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-lg">
                      We use structured, coded data (MedDRA, ICAN) to ensure every data point contributes to validated benchmarks.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    {['MedDRA', 'LOINC', 'SNOMED'].map(code => (
                      <span key={code} className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-black text-slate-500 tracking-widest uppercase">{code}</span>
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
          <h2 className="text-3xl sm:text-4xl font-black text-slate-200 tracking-tight">
            About <span className="text-gradient-primary inline-block pb-1">PPN</span>
          </h2>
          <div className="space-y-6">
            <p className="text-lg text-slate-400 leading-relaxed font-medium">
              The <span className="text-white font-bold">Psychedelic Practitioners Network (PPN)</span> is a practitioner-only network focused on one thing: helping clinics learn faster from real-world care. We do that by standardizing the inputs that shape outcomes across preparation, dosing, and integration, then returning aggregated benchmarks and safety learning that clinics can use to improve consistency.
            </p>
            <p className="text-lg text-slate-400 leading-relaxed font-medium">
              We built PPN with privacy by design, structured fields over narrative text, de-identified longitudinal tracking inside a clinic, and network insights shown only in aggregate.
            </p>
          </div>

          {/* Veterans PTSD Statement */}
          <div className="mt-8 p-6 bg-indigo-600/10 border-2 border-indigo-500/20 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-500/20 rounded-xl">
                <span className="material-symbols-outlined text-2xl text-indigo-400">military_tech</span>
              </div>
              <div>
                <h4 className="text-xl font-black text-white mb-2">Supporting Our Veterans</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  We are committed to supporting <span className="text-gradient-primary inline-block font-bold pb-1">veterans with PTSD</span> through
                  evidence-based psychedelic therapy research. A portion of our network's de-identified data contributes to
                  VA-partnered studies on MDMA-assisted therapy and psilocybin for treatment-resistant PTSD.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <a
              href="mailto:info@ppnportal.net"
              className="inline-flex items-center px-8 py-4 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-100 text-sm font-black rounded-2xl uppercase tracking-[0.25em] transition-all hover:bg-slate-800 active:scale-95"
            >
              Contact Us
            </a>
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
                The institutional standard for outcomes tracking and safety surveillance in psychedelic research.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-200">Legal & Privacy</h4>
              <ul className="space-y-2 text-sm text-slate-500 font-medium">
                <li className="hover:text-primary transition-colors cursor-pointer">Terms of Service</li>
                <li className="hover:text-primary transition-colors cursor-pointer">De-identification Policy</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Registry Consensus</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-200">Network Status</h4>
              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-1">
                <p className="text-sm font-black text-clinical-green">Operational</p>
                <p className="text-sm text-slate-600 font-black uppercase tracking-widest">Global Sync Active</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-200">Identity Guard</h4>
              <button onClick={() => navigate('/login')} className="w-full py-4 bg-slate-900 border border-slate-800 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                System Security Login
              </button>
            </div>
          </div>

          {/* FINAL BOUNDARY STATEMENT */}
          <div className="pt-20 border-t border-slate-900 text-center space-y-6">
            <p className="text-sm font-bold text-slate-600 leading-relaxed max-w-3xl mx-auto uppercase tracking-widest">
              PPN Research Portal is a measurement and benchmarking tool. It does not provide medical advice, treatment recommendations, or dosing guidance. We do not support patient-level data sharing across clinics.
            </p>
            <p className="text-sm text-slate-700 font-medium tracking-widest">
              &copy; 2026 PRECISION PSYCHEDELIC NETWORK (PPN). ALL RIGHTS RESERVED. FOR INSTITUTIONAL USE ONLY.
            </p>
          </div>
        </div>
      </footer>
    </div >
  );
};

export default Landing;
