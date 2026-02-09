import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Loader2, AlertCircle } from 'lucide-react';
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

const chartData = [
  { name: 'Node Avg', value: 68, color: '#334155' },
  { name: 'Network Avg', value: 74, color: '#475569' },
  { name: 'Your Node', value: 92, color: '#2b74f3' },
];

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
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

    // Development-only bypass
    if (import.meta.env.DEV && email === 'dev@test.com' && password === 'dev123') {
      console.log('🔓 Development bypass activated');
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

        {/* User's Night Sky Image with Subtle Parallax */}
        <div
          className="absolute inset-0 transition-transform duration-0"
          style={{
            transform: `translateY(${scrollY * 0.08}px)`,
            backgroundImage: 'url("/Night Sky.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.9,
            // Removed negative z-index to prevent stacking issues
          }}
        />
      </div>

      {/* SECTION: Hero */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden z-10">
        {/* Top Right Brand Label */}
        <div className="absolute top-10 right-10 z-20 hidden md:block group cursor-default">
          <div className="flex flex-col items-end">
            <p className="text-[12px] font-black text-white tracking-[0.2em] uppercase transition-colors group-hover:text-primary">
              PPN Research Portal
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black text-slate-600 tracking-widest uppercase">Institutional Gateway</span>
              <div className="size-1 rounded-full bg-clinical-green animate-pulse"></div>
            </div>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full max-w-7xl mx-auto px-6 relative z-10">
          {/* Left Column (Text) */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 w-full"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full text-[11px] sm:text-[12px] font-black uppercase tracking-[0.25em] text-slate-400">
                <span className="size-2 bg-primary rounded-full animate-ping"></span>
                Practitioner-Only Benchmarking Portal
              </div>
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
                Standardized Outcomes. <br />
                <motion.span
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-primary bg-200% auto"
                >
                  Benchmarked Safety.
                </motion.span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-400 max-w-2xl lg:mx-0 mx-auto leading-relaxed font-medium">
                PPN Research Portal is a community-driven practitioner-only outcomes registry for psychedelic care. Track outcome change across sessions and compare results to aggregated network benchmarks, built with privacy by design, with no patient names or narrative notes stored.
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

            {/* Login Form */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="w-full max-w-md lg:mx-0 mx-auto"
            >
              <form onSubmit={handleSearch} className="space-y-4">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-400">{error}</p>
                  </div>
                )}
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-900/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors font-medium"
                    required
                    disabled={loading}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-900/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors font-medium"
                    required
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-4 bg-primary hover:bg-blue-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-[12px] font-black rounded-xl uppercase tracking-[0.2em] transition-all shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    'Enter Portal'
                  )}
                </button>
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/signup')}
                    className="text-[11px] font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest"
                  >
                    Request Network Access →
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Right Column (Visual) */}
          <div className="flex justify-center lg:justify-end relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
                y: [0, -20, 0]
              }}
              transition={{
                opacity: { duration: 1.5 },
                scale: { duration: 1.5 },
                y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }}
              className="w-[400px] lg:w-[600px] pointer-events-none z-0"
            >
              <img src="/molecules/Ketamine.webp" alt="Ketamine Molecule" className="w-full h-auto" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* SECTION: Live Search Demo (Simplified SimpleSearch Integration) */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Real-World Outcome Data</h2>
            <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.3em]">Query Your Node benchmarks in real-time</p>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-indigo-500/20 blur-2xl rounded-[3rem] opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <form onSubmit={handleSearch} className="relative bg-slate-900/90 border border-slate-800 rounded-[2.5rem] p-4 flex items-center shadow-2xl backdrop-blur-xl">
              <input
                type="text"
                placeholder="Search de-identified benchmarks (e.g. 'Ketamine efficacy 2024')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-4 text-white placeholder:text-slate-600 font-bold"
              />
              <button className="size-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-2xl">search</span>
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Indexed Nodes', value: '12,482', color: 'text-white' },
              { label: 'Safety Events', value: '840+', color: 'text-red-400' },
              { label: 'Sync Latency', value: '14.2ms', color: 'text-clinical-green' },
              { label: 'Outcomes', value: '98% recall', color: 'text-primary' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: activeStatIndex === i ? 1.05 : 1,
                  borderColor: activeStatIndex === i ? 'rgba(43, 116, 243, 0.4)' : 'rgba(30, 41, 59, 0.5)'
                }}
                className="p-6 bg-slate-900/20 border border-slate-800/50 rounded-3xl text-center space-y-1 transition-colors"
              >
                <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest leading-tight">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: Problem vs Solution (AIDA Narrative) */}
      <section className="py-32 px-6 bg-slate-950/30 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-[13px] font-black text-primary uppercase tracking-[0.3em]">The Problem</h3>
                <h2 className="text-4xl sm:text-6xl font-black tracking-tighter leading-none">Generic Trials Fail <br /> Specific Patients.</h2>
                <p className="text-lg text-slate-400 font-medium leading-relaxed">
                  Clinical silos create fragmented insights. Without standardized, coded data, clinics struggle to benchmark their performance or identify systemic safety trends beyond their walls.
                </p>
              </div>

              <div className="space-y-4 pt-10 border-t border-slate-800/50">
                <h3 className="text-[13px] font-black text-clinical-green uppercase tracking-[0.3em]">The PPN Solution</h3>
                <h2 className="text-4xl sm:text-6xl font-black tracking-tighter leading-none">Structured Data. <br />Network Comparisons.</h2>
                <p className="text-lg text-slate-200 font-medium leading-relaxed">
                  We standardize psychedelic treatment outcomes so clinics can compare results to network benchmarks. High-fidelity safety surveillance ensures every practitioner contributes to a growing collective intelligence.
                </p>
              </div>
            </div>

            {/* Visual Demo Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-primary/20 rounded-[4rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-slate-900 border border-slate-800 rounded-[3rem] p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 animate-pulse mt-4 font-mono font-bold">
                      <div className="size-1 bg-primary rounded-full"></div>
                      <span className="text-[8px] text-primary/40 uppercase tracking-widest font-bold">Calculating Logical Integrity...</span>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-[11px] font-black text-primary uppercase">Active Node_4.2</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="p-4 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="size-10 rounded-xl bg-slate-800 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-xl">monitoring</span>
                          </div>
                          <div>
                            <p className="text-[13px] font-bold">Outcome Marker {i}</p>
                            <p className="text-[12px] font-mono text-slate-600 font-black tracking-widest uppercase">+2.4% vs Baseline</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="h-[200px] w-full bg-black/20 rounded-2xl p-4 border border-white/5">
                    <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest mb-4">Network Benchmarking</p>
                    <ResponsiveContainer width="100%" height="80%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#475569', fontSize: 10, fontWeight: 800 }}
                        />
                        <Tooltip
                          cursor={{ fill: 'transparent' }}
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px' }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-800/50 flex items-center justify-between">
                  <p className="text-[12px] text-slate-500 font-medium">"Clinics see their own internal registry. Cross-site benchmarks are aggregated and de-identified."</p>
                  <span className="material-symbols-outlined text-primary text-3xl">verified_user</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION: Bento Box Features */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter">Clinical Intelligence Infrastructure</h2>
            <p className="text-[12px] text-slate-500 font-black uppercase tracking-[0.4em]">Designed for Institutional Precision</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[280px]">
            {/* Cell 1: Internal Registry */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-10 hover:bg-slate-900/60 transition-all group overflow-hidden relative"
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

            {/* Cell 2: Network Benchmarks */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-indigo-600/10 border border-indigo-500/20 rounded-[3rem] p-10 group hover:shadow-2xl hover:shadow-indigo-500/5 transition-all"
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

            {/* Cell 3: Safety Surveillance */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-red-600/5 border border-red-500/10 rounded-[3rem] p-10 group hover:border-red-500/30 transition-all"
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

            {/* Cell 4: Structured Data */}
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group"
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
          </div>
        </div>
      </section>

      {/* SECTION: Institutional Proof */}
      <section className="py-20 px-6 bg-slate-950/20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 whitespace-nowrap overflow-hidden flex items-center">
          <span className="text-[12px] font-black text-slate-600 uppercase tracking-[0.4em] mr-12 shrink-0">Institutional Nodes</span>
          <div className="flex items-center gap-16 animate-marquee">
            {['Zurich', 'Boston', 'London', 'Berlin', 'Mexico City', 'New York', 'Sydney'].map((node, i) => (
              <span key={i} className="text-xl font-black text-slate-500 uppercase tracking-tighter opacity-40 hover:opacity-100 transition-opacity cursor-default">{node}</span>
            ))}
          </div>
          {/* Duplicate for seamless loop */}
          <div className="flex items-center gap-16 animate-marquee ml-16">
            {['Zurich', 'Boston', 'London', 'Berlin', 'Mexico City', 'New York', 'Sydney'].map((node, i) => (
              <span key={i} className="text-xl font-black text-slate-500 uppercase tracking-tighter opacity-40 hover:opacity-100 transition-opacity cursor-default">{node}</span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: About PPN */}
      <section className="py-32 px-6 bg-[#07090d] border-b border-slate-900/50 relative z-10">
        <div className="max-w-4xl mx-auto text-left space-y-8">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            About PPN
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed font-medium">
            The Psychedelic Practitioner Network (PPN) is a practitioner-only network focused on one thing: helping clinics learn faster from real-world care. We do that by standardizing the inputs that shape outcomes across preparation, dosing, and integration, then returning aggregated benchmarks and safety learning that clinics can use to improve consistency. We built PPN with privacy by design, structured fields over narrative text, de-identified longitudinal tracking inside a clinic, and network insights shown only in aggregate.
          </p>
          <div className="pt-4">
            <a
              href="mailto:info@ppnportal.net"
              className="inline-flex items-center px-8 py-4 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-100 text-[12px] font-black rounded-2xl uppercase tracking-[0.25em] transition-all hover:bg-slate-800 active:scale-95"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
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
              <h4 className="text-[12px] font-black uppercase tracking-widest text-slate-200">Legal & Privacy</h4>
              <ul className="space-y-2 text-sm text-slate-500 font-medium">
                <li className="hover:text-primary transition-colors cursor-pointer">Terms of Service</li>
                <li className="hover:text-primary transition-colors cursor-pointer">De-identification Policy</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Registry Consensus</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-[12px] font-black uppercase tracking-widest text-slate-200">Network Status</h4>
              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-1">
                <p className="text-[13px] font-black text-clinical-green">Operational</p>
                <p className="text-[11px] text-slate-600 font-black uppercase tracking-widest">Global Sync Active</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[12px] font-black uppercase tracking-widest text-slate-200">Identity Guard</h4>
              <button onClick={() => navigate('/login')} className="w-full py-4 bg-slate-900 border border-slate-800 rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                System Security Login
              </button>
            </div>
          </div>

          {/* FINAL BOUNDARY STATEMENT */}
          <div className="pt-20 border-t border-slate-900 text-center space-y-6">
            <p className="text-[13px] font-bold text-slate-600 leading-relaxed max-w-3xl mx-auto uppercase tracking-widest">
              PPN Research Portal is a measurement and benchmarking tool. It does not provide medical advice, treatment recommendations, or dosing guidance. We do not support patient-level data sharing across clinics.
            </p>
            <p className="text-[11px] text-slate-700 font-medium tracking-widest">
              &copy; 2026 PRECISION PSYCHEDELIC NETWORK (PPN). ALL RIGHTS RESERVED. FOR INSTITUTIONAL USE ONLY.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
