import React, { useState, useMemo, useEffect, useRef } from 'react';
// Corrected import for named export
import { useNavigate } from 'react-router-dom';
import { CLINICIANS } from '../constants';
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
    <div className="group relative bg-[#1c222d]/40 border border-slate-800 hover:border-slate-600 rounded-2xl p-5 transition-all duration-300 flex flex-col gap-4 hover:shadow-xl hover:-translate-y-1">
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
            <h4 className="text-base font-bold text-white truncate hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/clinician/${practitioner.id}`)}>
              {practitioner.name}
            </h4>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider bg-slate-900 px-1.5 py-0.5 rounded ml-2 whitespace-nowrap">
              {practitioner.verificationLevel || 'L4'}
            </span>
          </div>
          <p className="text-xs text-primary font-medium truncate mt-0.5">{practitioner.role}</p>

          <div className="flex items-center gap-1 mt-2 text-slate-500">
            <span className="material-symbols-outlined text-[14px]">location_on</span>
            <span className="text-[11px] font-medium truncate uppercase tracking-wide">{practitioner.location}</span>
          </div>
        </div>
      </div>

      {/* Footer: Actions */}
      <div className="flex gap-2 mt-auto pt-4 border-t border-slate-800/50">
        <button
          onClick={() => navigate(`/clinician/${practitioner.id}`)}
          className="flex-1 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-white border border-blue-500/20 hover:border-blue-500/50 text-xs font-bold rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2"
        >
          Profile
        </button>
        <button
          onClick={() => onMessage(practitioner)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/50 rounded-lg transition-all flex items-center justify-center shadow-lg shadow-blue-500/20"
          title="Send Message"
        >
          <span className="material-symbols-outlined text-lg">chat_bubble</span>
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
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
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
    <div className={`fixed inset-y-0 right-0 w-full max-w-lg bg-[#0a0c10] border-l border-white/10 shadow-2xl z-[100] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${practitioner ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex flex-col h-full">
        <div className="p-6 sm:p-8 border-b border-white/5 bg-slate-900/50">
          <div className="flex items-center justify-between mb-6">
            <button onClick={onClose} className="p-2.5 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all">
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2.5">
                <span className="size-2 rounded-full bg-clinical-green animate-pulse"></span>
                <span className="text-[11px] font-black text-white uppercase tracking-widest">Secure Link</span>
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
              <h3 className="text-lg sm:text-xl font-black text-white leading-tight">{practitioner.name}</h3>
              <p className="text-[11px] font-bold text-primary uppercase tracking-widest">{practitioner.role}</p>
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar">
          {chatHistory.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'Me' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-3xl text-[13px] shadow-lg ${msg.sender === 'Me'
                ? 'bg-primary/20 border border-primary/30 text-white rounded-tr-none'
                : 'bg-slate-800/50 border border-white/5 text-slate-300 rounded-tl-none'
                }`}>
                <p className="leading-relaxed">{msg.text}</p>
                <div className="flex items-center gap-2 mt-2.5 justify-end opacity-40">
                  <span className="text-[11px] font-mono text-white uppercase">{msg.timestamp}</span>
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
                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:ring-1 focus:ring-primary transition-all resize-none h-24 placeholder:text-slate-700"
              />
              <button
                type="button"
                onClick={handleDraftAi}
                disabled={isAiDrafting}
                className="absolute bottom-3 right-3 p-2 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all disabled:opacity-50"
              >
                <span className={`material-symbols-outlined text-lg ${isAiDrafting ? 'animate-spin' : ''}`}>
                  {isAiDrafting ? 'progress_activity' : 'auto_fix'}
                </span>
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-blue-600 text-white font-black py-4 rounded-2xl text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-primary/10 active:scale-95"
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
  const [searchName, setSearchName] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [activeMessagePractitioner, setActiveMessagePractitioner] = useState<any | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const roles = useMemo(() => {
    const r = new Set(CLINICIANS.map(c => c.role));
    return ['All', ...Array.from(r)];
  }, []);

  const locations = useMemo(() => {
    const l = new Set(CLINICIANS.map(c => c.location));
    return ['All', ...Array.from(l)];
  }, []);

  const filteredPractitioners = CLINICIANS.filter(c => {
    const matchesName = c.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesRole = selectedRole === 'All' || c.role === selectedRole;
    const matchesLocation = selectedLocation === 'All' || c.location === selectedLocation;
    return matchesName && matchesRole && matchesLocation;
  });

  return (
    <PageContainer className="min-h-full bg-background-dark">
      <Section spacing="default" className="flex-1">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-white">Practitioners</h1>
            <p className="text-slate-500 text-[11px] sm:text-sm font-medium uppercase tracking-widest">Global Practitioner Registry</p>
          </div>

          <div className="hidden sm:flex items-center gap-3 bg-slate-900/60 border border-slate-800 p-2.5 rounded-2xl shadow-2xl backdrop-blur-xl">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
              <input
                type="text"
                placeholder="Search identity..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="bg-transparent border-none rounded-xl pl-11 pr-5 h-10 text-xs font-bold text-white focus:ring-1 focus:ring-primary w-48"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-slate-800/50 border-none rounded-xl px-5 h-10 text-[11px] font-black text-slate-400 focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
            >
              <option value="All">All Roles</option>
              {roles.filter(r => r !== 'All').map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-slate-800/50 border-none rounded-xl px-5 h-10 text-[11px] font-black text-slate-400 focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
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
                className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl pl-12 pr-5 h-14 text-sm font-bold text-white focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`size-14 flex items-center justify-center rounded-2xl border transition-all ${showFilters ? 'bg-primary border-primary text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
            >
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>

          {showFilters && (
            <div className="sm:hidden w-full grid grid-cols-2 gap-3 p-4 bg-slate-900/80 border border-slate-800 rounded-[2rem] animate-in slide-in-from-top-2">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-slate-800/50 border-slate-700 rounded-xl px-4 h-12 text-[11px] font-black text-slate-300"
              >
                <option value="All">All Roles</option>
                {roles.filter(r => r !== 'All').map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-slate-800/50 border-slate-700 rounded-xl px-4 h-12 text-[11px] font-black text-slate-300"
              >
                <option value="All">All Nodes</option>
                {locations.filter(l => l !== 'All').map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-12">
          {filteredPractitioners.map((p) => (
            <PractitionerCard
              key={p.id}
              practitioner={p}
              onMessage={(pract) => setActiveMessagePractitioner(pract)}
            />
          ))}

          {filteredPractitioners.length === 0 && (
            <div className="col-span-full py-24 text-center space-y-5 bg-slate-900/20 rounded-[4rem] border-2 border-dashed border-slate-800/50">
              <span className="material-symbols-outlined text-6xl text-slate-700 opacity-20">person_off</span>
              <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[11px]">Zero Registry Hits</p>
            </div>
          )}
        </div>
      </Section>

      <MessageDrawer
        practitioner={activeMessagePractitioner}
        onClose={() => setActiveMessagePractitioner(null)}
      />
    </PageContainer>
  );
};

export default ClinicianDirectory;