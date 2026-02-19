import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CLINICIANS } from '../constants';
import { ShieldCheck, Database, Network, Award } from 'lucide-react';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';
import { TierBadge } from '../components/profile/TierBadge';

interface Credential {
  title: string;
  id: string;
  date: string;
  icon: string;
}

const UpdateCredentialsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  credentials: Credential[];
  onSave: (creds: Credential[]) => void;
}> = ({ isOpen, onClose, credentials, onSave }) => {
  const [localCreds, setLocalCreds] = useState<Credential[]>(credentials);

  if (!isOpen) return null;

  const handleChange = (index: number, field: keyof Credential, value: string) => {
    const next = [...localCreds];
    next[index] = { ...next[index], [field]: value };
    setLocalCreds(next);
  };

  const handleAdd = () => {
    setLocalCreds([...localCreds, { title: 'New Credential', id: 'N/A', date: 'Oct 24, 2025', icon: 'verified' }]);
  };

  const handleRemove = (index: number) => {
    setLocalCreds(localCreds.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div
        className="w-full max-w-2xl bg-[#0a0c10] border border-slate-800 rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 sm:p-10 space-y-8">
          <div className="flex items-center justify-between border-b border-slate-800 pb-6">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-300 tracking-tighter">Credential Registry</h2>
              <p className="text-sm font-black text-primary uppercase tracking-[0.3em]">Update regulatory identifiers</p>
            </div>
            <button
              onClick={onClose}
              className="size-10 sm:size-12 flex items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {localCreds.map((cred, i) => (
              <div key={i} className="p-5 bg-slate-950/50 border border-slate-800 rounded-2xl space-y-4 relative group">
                <button
                  onClick={() => handleRemove(i)}
                  className="absolute top-4 right-4 text-slate-700 hover:text-red-400 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Title</label>
                    <input
                      type="text"
                      value={cred.title}
                      onChange={(e) => handleChange(i, 'title', e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl h-10 px-4 text-xs font-bold text-slate-300 focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">ID / Number</label>
                    <input
                      type="text"
                      value={cred.id}
                      onChange={(e) => handleChange(i, 'id', e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl h-10 px-4 text-xs font-mono text-slate-300 focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Expiration</label>
                    <input
                      type="text"
                      value={cred.date}
                      onChange={(e) => handleChange(i, 'date', e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl h-10 px-4 text-xs font-bold text-slate-300 focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Material Icon</label>
                    <input
                      type="text"
                      value={cred.icon}
                      onChange={(e) => handleChange(i, 'icon', e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl h-10 px-4 text-xs font-mono text-slate-300 focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={handleAdd}
              className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-black rounded-2xl uppercase tracking-widest transition-all border border-slate-800 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              Add Credential
            </button>
            <button
              onClick={() => onSave(localCreds)}
              className="flex-1 py-4 bg-primary hover:bg-blue-600 text-slate-300 text-xs font-black rounded-2xl uppercase tracking-widest transition-all shadow-xl shadow-primary/20"
            >
              Commit Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClinicianProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseClinician = CLINICIANS.find(c => c.id === id);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [credentials, setCredentials] = useState<Credential[]>([
    { title: 'Medical License (CA)', id: 'A149220', date: 'Dec 31, 2024', icon: 'medical_services' },
    { title: 'DEA Registration', id: 'Schedule I - Research', date: 'Nov 15, 2025', icon: 'assignment' },
    { title: 'Board Certification', id: baseClinician?.specialization || 'General', date: 'Active', icon: 'school' }
  ]);

  // Mock Reputation Logic
  const reputation = {
    score: 98,
    tier: 'Sentinel Node',
    contributions: 142,
    impact: 'Top 5%'
  };

  const clinician = useMemo(() => baseClinician, [id, baseClinician]);

  if (!clinician) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-[#0a1628] text-slate-500">
        <span className="material-symbols-outlined text-6xl mb-4 opacity-20">person_off</span>
        <h2 className="text-xl font-black tracking-tight uppercase">Practitioner Not Found</h2>
        <button onClick={() => navigate('/clinicians')} className="mt-6 text-primary font-bold hover:underline">Return to Directory</button>
      </div>
    );
  }

  // Mock research publications for the rich UI
  const publications = [
    { title: `Efficacy of ${clinician.tags[0] || 'Therapy'} in Phase 3 Trials`, source: 'Nature Medicine', year: '2023' },
    { title: `Integrative ${clinician.specialization} Models`, source: 'Journal of Psych', year: '2022' },
    { title: 'Safety Protocols in Clinical Settings', source: 'PPN Internal', year: '2022' },
  ];

  const handleSaveCredentials = (next: Credential[]) => {
    setCredentials(next);
    setIsUpdateModalOpen(false);
  };

  return (
    <PageContainer className="animate-in fade-in duration-700 pb-24">
      <Section spacing="spacious">
        {/* Header HUD */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl font-black text-slate-300 tracking-tighter leading-none">Practitioner Profile</h1>
            <p className="text-slate-500 font-medium text-sm sm:text-lg">Manage professional identity, credentials, and research output.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/profile/edit')}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-blue-600 border border-primary/30 rounded-2xl text-xs font-black text-slate-300 uppercase tracking-widest transition-all shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-lg">edit</span>
              Edit Profile
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-2xl text-xs font-black text-slate-300 uppercase tracking-widest transition-all">
              <span className="material-symbols-outlined text-lg">share</span>
              Share Profile
            </button>
          </div>
        </div>

        <div>
          {/* REPUTATION COMMAND CENTER */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

            {/* Card 1: Network Trust Score */}
            <div className="bg-[#0b101b] border border-emerald-500/20 p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldCheck size={80} className="text-emerald-500" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={18} className="text-emerald-500" />
                  <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest">Network Trust Score</h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-300">{reputation.score}</span>
                  <span className="text-sm font-bold text-slate-500">/ 100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[98%] shadow-[0_0_10px_#10b981]"></div>
                </div>
                <p className="text-sm text-slate-300 mt-3 font-medium">
                  Verified contributor. High fidelity data output.
                </p>
              </div>
            </div>

            {/* Card 2: Contribution Ledger */}
            <div className="bg-[#0b101b] border border-indigo-500/20 p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Database size={80} className="text-indigo-500" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Database size={18} className="text-indigo-500" />
                  <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Data Protocols Shared</h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-300">{reputation.contributions}</span>
                  <span className="text-sm font-bold text-slate-500">Records</span>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-300 uppercase">
                    {reputation.tier}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-300 uppercase">
                    Gold Tier
                  </span>
                </div>
              </div>
            </div>

            {/* Card 3: Peer Impact */}
            <div className="bg-[#0b101b] border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Network size={80} className="text-slate-300" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Network size={18} className="text-slate-300" />
                  <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest">Community Impact</h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-300">{reputation.impact}</span>
                  <span className="text-sm font-bold text-slate-500">Rank</span>
                </div>
                <p className="text-sm text-slate-300 mt-4 leading-relaxed">
                  Protocols authored by this node are frequently cited in global safety reviews.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Profile Identity Column */}
            <div className="lg:col-span-4 bg-[#111827]/40 border border-slate-800 rounded-[3rem] p-8 sm:p-10 flex flex-col items-center text-center space-y-8 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

              <div className="relative">
                <div className="size-40 sm:size-48 rounded-[2.5rem] bg-cover bg-center border-4 border-slate-800 shadow-2xl transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${clinician.imageUrl})` }}></div>
                <div className="absolute -bottom-2 -right-2 size-10 rounded-2xl bg-clinical-green flex items-center justify-center text-slate-300 shadow-lg ring-4 ring-[#111827]">
                  <span className="material-symbols-outlined text-2xl font-black">check</span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-300 tracking-tight leading-none">{clinician.name}</h2>
                <p className="text-sm font-bold text-slate-500 italic">{clinician.education} — {clinician.role}</p>
                <div className="pt-2">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border transition-colors ${clinician.status === 'Available' ? 'bg-clinical-green/10 text-clinical-green border-clinical-green/20' :
                    clinician.status === 'In Session' ? 'bg-accent-amber/10 text-accent-amber border-accent-amber/20' :
                      'bg-slate-800 text-slate-500 border-slate-700'
                    }`}>
                    {clinician.status}
                  </span>
                </div>
                <div className="pt-2">
                  <TierBadge tier="partner" />
                </div>
              </div>

              {/* New Specialties Section */}
              <div className="w-full space-y-4 text-left p-6 bg-slate-900/40 rounded-[2rem] border border-slate-800/60 shadow-inner">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-lg">psychology</span>
                  <label className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">Clinical Specialties</label>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/5">
                    {clinician.specialization}
                  </span>
                  {clinician.tags.map(tag => (
                    <span key={tag} className="px-3 py-1.5 bg-slate-800/80 text-slate-300 border border-slate-700 rounded-lg text-xs font-black uppercase tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="w-full space-y-6 text-left">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                    <span className="material-symbols-outlined text-lg">badge</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-600 uppercase tracking-widest">NPI Number</span>
                    <span className="text-sm font-mono font-black text-slate-300 tracking-tight">1234567890</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                    <span className="material-symbols-outlined text-lg">mail</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Email Address</span>
                    <span className="text-sm font-bold text-slate-300 lowercase">{clinician.name.toLowerCase().replace(' ', '.').replace('dr.', '')}@ppnportal.net</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                    <span className="material-symbols-outlined text-lg">location_on</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Location</span>
                    <span className="text-sm font-bold text-slate-300">{clinician.location}</span>
                  </div>
                </div>
              </div>

              <div className="w-full pt-4 space-y-3">
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                  <span className="text-slate-500">Profile Completeness</span>
                  <span className="text-primary">85%</span>
                </div>
                <div className="w-full h-2 bg-slate-800/60 rounded-full overflow-hidden">
                  <div className="h-full bg-primary shadow-[0_0_8px_#2b74f3]" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>

            {/* Credentials Column */}
            <div className="lg:col-span-4 space-y-8 h-full">
              <div className="bg-[#111827]/40 border border-slate-800 rounded-[3rem] p-10 h-full backdrop-blur-xl shadow-2xl flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl">verified_user</span>
                    <h3 className="text-xl font-black text-slate-300 tracking-tight">Credentials</h3>
                  </div>
                  <span className="px-3 py-1 bg-clinical-green/10 text-clinical-green border border-clinical-green/20 rounded-lg text-xs font-black uppercase tracking-widest">All Active</span>
                </div>

                <div className="space-y-4 flex-1">
                  {credentials.map((cred, i) => (
                    <div key={i} className="group flex items-center justify-between p-5 bg-slate-950/60 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all cursor-pointer">
                      <div className="flex items-center gap-5">
                        <div className="size-12 rounded-xl bg-slate-900 flex items-center justify-center text-primary border border-slate-800 group-hover:bg-primary group-hover:text-slate-300 transition-all">
                          <span className="material-symbols-outlined text-xl">{cred.icon}</span>
                        </div>
                        <div className="flex flex-col">
                          <h4 className="text-sm font-black text-slate-300 leading-tight mb-1">{cred.title}</h4>
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{cred.id}</span>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs font-black text-slate-700 uppercase tracking-tighter">Valid Until</span>
                            <span className="text-xs font-mono font-black text-slate-300 bg-slate-800 px-2 py-0.5 rounded">{cred.date}</span>
                          </div>
                        </div>
                      </div>
                      <button className="material-symbols-outlined text-slate-700 hover:text-slate-300 transition-colors">visibility</button>
                    </div>
                  ))}
                  {credentials.length === 0 && (
                    <div className="py-10 text-center border-2 border-dashed border-slate-800 rounded-2xl">
                      <p className="text-sm font-black text-slate-600 uppercase tracking-widest">No Active Credentials</p>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-10">
                  <button
                    onClick={() => setIsUpdateModalOpen(true)}
                    className="w-full py-5 bg-primary hover:bg-blue-600 text-slate-300 text-xs font-black rounded-[1.5rem] uppercase tracking-[0.25em] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group active:scale-95"
                  >
                    <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">edit_note</span>
                    Update credentials
                  </button>
                </div>
              </div>
            </div>

            {/* Research Column */}
            <div className="lg:col-span-4 space-y-8 h-full">
              <div className="bg-[#111827]/40 border border-slate-800 rounded-[3rem] p-10 h-full backdrop-blur-xl shadow-2xl flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                  <span className="material-symbols-outlined text-primary text-2xl">biotech</span>
                  <h3 className="text-xl font-black text-slate-300 tracking-tight">Research Output</h3>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Focus Areas</label>
                    <div className="flex flex-wrap gap-2">
                      {clinician.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-slate-900 text-slate-300 border border-slate-800 rounded-full text-xs font-black uppercase tracking-widest hover:border-primary/50 cursor-default transition-all">
                          {tag}
                        </span>
                      ))}
                      {['Depression', 'PTSD'].filter(t => !clinician.tags.includes(t)).map(tag => (
                        <span key={tag} className="px-3 py-1 bg-slate-900 text-slate-300 border border-slate-800 rounded-full text-xs font-black uppercase tracking-widest">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="w-full h-px bg-slate-800/40"></div>

                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Recent Publications</label>
                      <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline">View All</button>
                    </div>

                    <div className="space-y-4">
                      {publications.map((pub, i) => (
                        <div key={i} className="flex gap-4 group cursor-pointer">
                          <div className="size-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 group-hover:text-primary transition-colors shrink-0">
                            <span className="material-symbols-outlined text-lg">article</span>
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-[12px] font-black text-slate-300 leading-tight group-hover:text-slate-300 transition-colors line-clamp-2">{pub.title}</h5>
                            <p className="text-sm font-bold text-slate-600 mt-1 uppercase tracking-widest truncate">{pub.source} • {pub.year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <UpdateCredentialsModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          credentials={credentials}
          onSave={handleSaveCredentials}
        />
      </Section>
    </PageContainer>
  );
};

export default ClinicianProfile;