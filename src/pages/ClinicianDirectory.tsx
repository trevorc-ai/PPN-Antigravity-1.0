import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClinicianDirectory } from '../hooks/useClinicianDirectory';
import { supabase } from '../supabaseClient';
import { GoogleGenAI } from "@google/genai";

const PractitionerCard: React.FC<{ practitioner: any, onMessage: (p: any) => void }> = ({ practitioner, onMessage }) => {
  const navigate = useNavigate();

  // Status mapping
  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('active') || s.includes('available')) return 'bg-emerald-500';
    if (s.includes('reviewing') || s.includes('session')) return 'bg-amber-500';
    return 'bg-slate-500';
  };

  return (
    <div className="group relative bg-slate-900/40 backdrop-blur-xl border border-slate-800 hover:border-slate-600 rounded-3xl p-6 transition-all duration-500 flex flex-col gap-4 hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
      {/* Subtle glow on hover */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      {/* Header: Avatar + Info */}
      <div className="flex items-start gap-4">
        <div className="relative cursor-pointer" onClick={() => navigate(`/clinician/${practitioner.id}`)}>
          <div className="size-14 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 overflow-hidden">
            {practitioner.imageUrl ? (
              <img src={practitioner.imageUrl} alt={practitioner.name} className="size-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-3xl text-slate-600">account_circle</span>
            )}
          </div>
          <div className={`absolute -bottom-1 -right-1 size-3.5 border-2 border-[#1c222d] rounded-full ${getStatusColor(practitioner.status)}`} title={practitioner.status}></div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4 className="text-base font-bold truncate hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/clinician/${practitioner.id}`)} style={{ color: '#8B9DC3' }}>
              {practitioner.name}
            </h4>
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider bg-slate-900 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">
              {practitioner.verificationLevel || 'L4'}
            </span>
          </div>
          <p className="text-sm text-primary font-medium truncate mt-0.5">{practitioner.role}</p>

          <div className="flex items-center gap-1 mt-2 text-slate-500">
            <span className="material-symbols-outlined text-[14px]">location_on</span>
            <span className="text-xs font-medium truncate uppercase tracking-wide">{practitioner.location}</span>
          </div>
        </div>
      </div>

      {/* Footer: Actions */}
      <div className="flex gap-3 mt-auto pt-5 border-t border-slate-800/60 relative z-10">
        <button
          onClick={() => navigate(`/clinician/${practitioner.id}`)}
          className="flex-1 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 border border-slate-700 hover:border-slate-500 text-xs font-black rounded-xl uppercase tracking-widest transition-all shadow-lg"
        >
          Profile
        </button>
        <button
          onClick={() => onMessage(practitioner)}
          className="px-5 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 rounded-xl transition-all shadow-lg flex items-center justify-center group/msg"
          title="Send Message"
        >
          <span className="material-symbols-outlined text-lg transition-transform group-hover/msg:scale-110">chat_bubble</span>
        </button>
      </div>
    </div>
  );
};

const MessageDrawer: React.FC<{ practitioner: any | null, onClose: () => void }> = ({ practitioner, onClose }) => {
  const [message, setMessage] = useState('');
  const [isAiDrafting, setIsAiDrafting] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleDraftAi = async () => {
    if (!practitioner) return;
    setIsAiDrafting(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error('No API key configured');
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Write a brief, professional inquiry to practitioner ${practitioner.name}.`,
      });
      setMessage(response.text || '');
    } catch (error) {
      console.error('AI Draft failed', error);
    } finally {
      setIsAiDrafting(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setChatHistory(prev => [...prev, {
      id: Date.now(),
      sender: 'Me',
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      encrypted: true
    }]);
    setMessage('');

    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        id: Date.now() + 1,
        sender: practitioner?.name || 'System',
        text: "Inquiry received. Reviewing clinical protocol documents now.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        encrypted: true
      }]);
    }, 1500);
  };

  if (!practitioner) return null;

  return (
    <div className={`fixed inset-y-0 right-0 w-full max-w-lg bg-gradient-to-br from-[#080c14] via-[#0c1220] to-[#0a0e1a]/95 backdrop-blur-2xl border-l border-slate-800 shadow-2xl z-[100] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${practitioner ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex flex-col h-full relative">
        <div className="p-6 sm:p-8 border-b border-slate-800 bg-slate-900/40">
          <div className="flex items-center justify-between mb-6">
            <button onClick={onClose} className="p-2.5 hover:bg-white/5 rounded-full text-slate-500 hover:text-slate-300 transition-all">
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2.5">
                <span className="size-2 rounded-full bg-clinical-green animate-pulse"></span>
                <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Secure Link</span>
              </div>
            </div>
            <div className="size-10"></div>
          </div>

          <div className="flex items-center gap-5">
            <div className="size-14 rounded-2xl bg-slate-800 flex items-center justify-center border border-white/10 shadow-xl overflow-hidden">
              {practitioner.imageUrl ? (
                <img src={practitioner.imageUrl} alt={practitioner.name} className="size-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-3xl text-slate-600">account_circle</span>
              )}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black leading-tight" style={{ color: '#8B9DC3' }}>{practitioner.name}</h3>
              <p className="text-sm font-bold text-primary uppercase tracking-widest">{practitioner.role}</p>
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar">
          {chatHistory.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'Me' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-3xl text-[13px] shadow-lg ${msg.sender === 'Me'
                ? 'bg-primary/20 border border-primary/30 text-slate-300 rounded-tr-none'
                : 'bg-slate-800/50 border border-white/5 text-slate-300 rounded-tl-none'
                }`}>
                <p className="leading-relaxed">{msg.text}</p>
                <div className="flex items-center gap-2 mt-2.5 justify-end opacity-40">
                  <span className="text-xs font-mono text-slate-300 uppercase">{msg.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 sm:p-8 bg-slate-900/80 border-t border-white/5">
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Secure message..."
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-slate-300 focus:ring-1 focus:ring-primary transition-all resize-none h-24 placeholder:text-slate-600"
              />
              <button
                type="button"
                onClick={handleDraftAi}
                disabled={isAiDrafting}
                className="absolute bottom-3 right-3 p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 transition-all disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-lg ${isAiDrafting ? 'animate-spin' : ''}`}>
                  {isAiDrafting ? 'progress_activity' : 'auto_fix'}
                </span>
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/50 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
            >
              Dispatch
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';

const ClinicianDirectory: React.FC = () => {
  const { practitioners, loading } = useClinicianDirectory();
  const [searchName, setSearchName] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [activeMessagePractitioner, setActiveMessagePractitioner] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);
  const [listingForm, setListingForm] = useState({ displayName: '', role: '', city: '', country: 'United States', licenseType: '', website: '', email: '' });
  const [listingSubmitted, setListingSubmitted] = useState(false);

  const handleListingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('log_feature_requests').insert({
        user_id: user?.id ?? null,
        request_type: 'practitioner_listing',
        requested_text: JSON.stringify(listingForm),
        category: 'directory',
        status: 'pending',
      });
      setListingSubmitted(true);
    } catch (err) {
      console.error('Listing submission failed', err);
    }
  };

  const roles = useMemo(() => {
    const r = new Set(practitioners.map((c: any) => c.role));
    return ['All', ...Array.from(r)];
  }, [practitioners]);

  const locations = useMemo(() => {
    const l = new Set(practitioners.map((c: any) => c.location));
    return ['All', ...Array.from(l)];
  }, [practitioners]);

  const filteredPractitioners = practitioners.filter((c: any) => {
    const matchesName = c.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesRole = selectedRole === 'All' || c.role === selectedRole;
    const matchesLocation = selectedLocation === 'All' || c.location === selectedLocation;
    return matchesName && matchesRole && matchesLocation;
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#080c14] via-[#0c1220] to-[#0a0e1a] overflow-hidden text-slate-300">
      {/* Background Texture & Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)] pointer-events-none z-0" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none opacity-50 z-0" />

      <PageContainer className="relative z-10 min-h-full mt-4 animate-in fade-in duration-700">
        <Section spacing="default" className="flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-slate-200 mt-4">
                Clinical <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Network</span>
              </h1>
              <p className="text-slate-500 text-sm font-black uppercase tracking-widest mt-2">Global Practitioner Registry</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="list-your-practice-btn"
                onClick={() => setShowListingModal(true)}
                className="px-5 py-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 hover:border-indigo-500/50 text-indigo-400 text-xs uppercase tracking-widest font-black transition-all shadow-lg"
              >
                + List Practice
              </button>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
                <input
                  type="text"
                  placeholder="Search identity..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="bg-transparent border-none rounded-xl pl-11 pr-5 h-10 text-xs font-bold text-slate-300 focus:ring-1 focus:ring-primary w-48"
                />
              </div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-slate-800/50 border-none rounded-xl px-5 h-10 text-xs font-black text-slate-300 focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
              >
                <option value="All">All Roles</option>
                {roles.filter(r => r !== 'All').map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-slate-800/50 border-none rounded-xl px-5 h-10 text-xs font-black text-slate-300 focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
              >
                <option value="All">Global Nodes</option>
                {locations.filter(l => l !== 'All').map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div className="flex sm:hidden w-full gap-3">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
                <input
                  type="text"
                  placeholder="Search name..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl pl-12 pr-5 h-14 text-sm font-bold text-slate-300 focus:ring-1 focus:ring-primary"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`size-14 flex items-center justify-center rounded-2xl border transition-all ${showFilters ? 'bg-primary border-primary text-slate-300' : 'bg-slate-900 border-slate-800 text-slate-300'}`}
              >
                <span className="material-symbols-outlined">filter_list</span>
              </button>
            </div>

            {showFilters && (
              <div className="sm:hidden w-full grid grid-cols-2 gap-3 p-4 bg-slate-900/80 border border-slate-800 rounded-[2rem] animate-in slide-in-from-top-2">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 rounded-xl px-4 h-12 text-xs font-black text-slate-300"
                >
                  <option value="All">All Roles</option>
                  {roles.filter(r => r !== 'All').map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 rounded-xl px-4 h-12 text-xs font-black text-slate-300"
                >
                  <option value="All">All Nodes</option>
                  {locations.filter(l => l !== 'All').map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-12">
            {loading ? (
              // Loading skeleton — 8 ghost cards
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 animate-pulse flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <div className="size-14 rounded-xl bg-slate-800" />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-4 bg-slate-800 rounded w-3/4" />
                      <div className="h-3 bg-slate-800 rounded w-1/2" />
                      <div className="h-3 bg-slate-800 rounded w-1/3 mt-2" />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-auto pt-4 border-t border-slate-800/50">
                    <div className="flex-1 h-9 bg-slate-800 rounded-lg" />
                    <div className="size-9 bg-slate-800 rounded-lg" />
                  </div>
                </div>
              ))
            ) : (
              filteredPractitioners.map((p: any) => (
                <PractitionerCard
                  key={p.id}
                  practitioner={p}
                  onMessage={(pract) => setActiveMessagePractitioner(pract)}
                />
              ))
            )}

            {!loading && filteredPractitioners.length === 0 && (
              <div className="col-span-full py-24 text-center space-y-5 bg-slate-900/20 rounded-[4rem] border-2 border-dashed border-slate-800/50">
                <span className="material-symbols-outlined text-6xl text-slate-700 opacity-20">person_off</span>
                <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-sm">Zero Registry Hits</p>
              </div>
            )}
          </div>

          {/* List Your Practice Modal */}
          {showListingModal && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-[#0d1829] border border-slate-700 rounded-2xl p-8 w-full max-w-md shadow-2xl">
                {listingSubmitted ? (
                  <div className="text-center space-y-4 py-6">
                    <span className="material-symbols-outlined text-5xl text-cyan-400">check_circle</span>
                    <h2 className="text-xl font-black text-slate-200">Request Submitted</h2>
                    <p className="text-sm text-slate-400">Your listing request has been submitted. Our team will review and activate within 2–3 business days.</p>
                    <button onClick={() => { setShowListingModal(false); setListingSubmitted(false); }} className="mt-4 px-6 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-sm font-bold">Close</button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-black text-slate-200">List Your Practice</h2>
                      <button onClick={() => setShowListingModal(false)} className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-slate-300 transition-all">
                        <span className="material-symbols-outlined text-lg">close</span>
                      </button>
                    </div>
                    <form onSubmit={handleListingSubmit} className="space-y-4">
                      <input required placeholder="Display Name" value={listingForm.displayName} onChange={e => setListingForm(f => ({ ...f, displayName: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-300 focus:ring-1 focus:ring-cyan-500 outline-none" />
                      <select required value={listingForm.role} onChange={e => setListingForm(f => ({ ...f, role: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-300 focus:ring-1 focus:ring-cyan-500 outline-none">
                        <option value="">Select Role</option>
                        <option>Psychiatrist</option><option>Facilitator</option><option>LCSW</option><option>LPC</option><option>PhD Researcher</option><option>Nurse Practitioner</option><option>Other</option>
                      </select>
                      <input required placeholder="City" value={listingForm.city} onChange={e => setListingForm(f => ({ ...f, city: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-300 focus:ring-1 focus:ring-cyan-500 outline-none" />
                      <select value={listingForm.country} onChange={e => setListingForm(f => ({ ...f, country: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-300 focus:ring-1 focus:ring-cyan-500 outline-none">
                        <option>United States</option><option>Canada</option><option>United Kingdom</option><option>Australia</option><option>Netherlands</option><option>Other</option>
                      </select>
                      <input placeholder="Website URL (optional)" value={listingForm.website} onChange={e => setListingForm(f => ({ ...f, website: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-300 focus:ring-1 focus:ring-cyan-500 outline-none" />
                      <input required type="email" placeholder="Contact Email (admin use only)" value={listingForm.email} onChange={e => setListingForm(f => ({ ...f, email: e.target.value }))} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-300 focus:ring-1 focus:ring-cyan-500 outline-none" />
                      <button type="submit" className="w-full py-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-400 font-bold text-sm transition-all">Submit Listing Request</button>
                    </form>
                  </>
                )}
              </div>
            </div>
          )}
        </Section>

        <MessageDrawer
          practitioner={activeMessagePractitioner}
          onClose={() => setActiveMessagePractitioner(null)}
        />
      </PageContainer>
    </div>
  );
};

export default ClinicianDirectory;