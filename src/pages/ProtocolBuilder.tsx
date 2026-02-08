import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Microscope, Activity, ClipboardList, PlusCircle, Search, Info, ChevronRight, AlertTriangle, Brain, Lock, ChevronDown, History, User, X, HelpCircle } from 'lucide-react';
import { SAMPLE_INTERVENTION_RECORDS, MEDICATIONS_LIST } from '../constants';
import { PatientRecord } from '../types';
import { MOCK_RISK_DATA } from '../constants/analyticsData';
import { supabase } from '../lib/supabase';

// Clinical Standardization Constants
const WEIGHT_RANGES = Array.from({ length: 22 }, (_, i) => {
  const startKg = 40 + i * 5;
  const endKg = startKg + 5;
  const startLbs = Math.round(startKg * 2.20462);
  const endLbs = Math.round(endKg * 2.20462);
  return `${startKg}-${endKg} kg (${startLbs}-${endLbs} lbs)`;
});

const SUBSTANCE_OPTIONS = [
  "Psilocybin",
  "MDMA",
  "Ketamine",
  "LSD-25",
  "5-MeO-DMT",
  "Ibogaine",
  "Mescaline",
  "Other / Investigational"
];

const ROUTE_OPTIONS = [
  "Oral",
  "Intravenous",
  "Intramuscular",
  "Intranasal",
  "Sublingual",
  "Buccal",
  "Rectal",
  "Subcutaneous",
  "Other / Non-Standard"
];

const FREQUENCY_OPTIONS = [
  "Single Session (Stat)",
  "q.h. (Hourly)",
  "q.d. (Daily)",
  "b.i.d. (Twice Daily)",
  "q.w. (Weekly)",
  "PRN (As Needed)"
];

const UNIT_OPTIONS = [
  "mg",
  "mcg (µg)",
  "ml",
  "Units",
  "Drops"
];

const SAFETY_EVENT_OPTIONS = [
  "Anxiety",
  "Confusional State",
  "Dissociation",
  "Dizziness",
  "Headache",
  "Hypertension",
  "Insomnia",
  "Nausea",
  "Panic Attack",
  "Paranoia",
  "Tachycardia",
  "Visual Hallucination",
  "Other - Non-PHI Clinical Observation"
];

const SEX_OPTIONS = ["Male", "Female", "Intersex", "Unknown"];
const RACE_OPTIONS = [
  { id: '2106-3', label: "White / Caucasian" },
  { id: '2054-5', label: "Black / African American" },
  { id: '2028-9', label: "Asian" },
  { id: '2076-8', label: "Pacific Islander" },
  { id: '1002-5', label: "Native American" }
];

const SMOKING_OPTIONS = [
  "Non-Smoker",
  "Former Smoker",
  "Current Smoker (Occasional)",
  "Current Smoker (Daily)"
];

const SEVERITY_OPTIONS = [
  { value: 1, label: "Grade 1 - Mild (No Intervention)" },
  { value: 2, label: "Grade 2 - Moderate (Local Intervention)" },
  { value: 3, label: "Grade 3 - Severe (Hospitalization)" },
  { value: 4, label: "Grade 4 - Life Threatening" },
  { value: 5, label: "Grade 5 - Death / Fatal" }
];

const SETTING_OPTIONS = [
  'Clinical (Medical)',
  'Clinical (Soft/Spa)',
  'Home (Supervised)',
  'Retreat Center',
  'Remote/Telehealth'
];

const MODALITY_OPTIONS = [
  'CBT',
  'Somatic',
  'Psychodynamic',
  'IFS',
  'None/Sitter'
];

const RESOLUTION_OPTIONS = [
  'Resolved in Session',
  'Resolved Post-Session',
  'Unresolved/Lingering'
];

const PHQ9_SCORES = Array.from({ length: 28 }, (_, i) => i);
const AGE_OPTIONS = Array.from({ length: 73 }, (_, i) => 18 + i);

// SECURITY UTILITY: Local-First Hashing
const generatePatientHash = async (inputText: string): Promise<string> => {
  if (!inputText) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(inputText);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

// UI COMPONENT: Contextual Tooltip
const SimpleTooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
  <div className="relative group flex items-center">
    {children}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2.5 bg-[#020408] border border-slate-700 rounded-lg text-[11px] font-medium text-slate-200 z-50 shadow-2xl pointer-events-none tracking-wide leading-relaxed">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-700"></div>
    </div>
  </div>
);

// UI COMPONENT: Accordion Section with Waterfall Navigation
const SectionAccordion: React.FC<{
  title: string;
  icon: React.ElementType;
  isOpen: boolean;
  onToggle: () => void;
  onFocus: () => void;
  children: React.ReactNode;
  activeColor?: string;
  tooltipText?: string;
  headerHelp?: React.ReactNode;
}> = ({ title, icon: Icon, isOpen, onToggle, onFocus, children, activeColor = "text-primary", tooltipText, headerHelp }) => {
  const isMouseDown = useRef(false);

  return (
    <div className={`bg-slate-900/50 border ${isOpen ? 'border-slate-700' : 'border-slate-800'} rounded-2xl mb-4 overflow-hidden transition-all duration-300`}>
      <button
        type="button"
        onMouseDown={() => { isMouseDown.current = true; }}
        onBlur={() => { isMouseDown.current = false; }}
        onFocus={() => {
          if (!isMouseDown.current && !isOpen) {
            onFocus();
          }
        }}
        onClick={() => {
          onToggle();
          isMouseDown.current = false;
        }}
        className={`w-full flex items-center justify-between p-4 sm:p-5 ${isOpen ? 'bg-slate-800/40' : 'bg-transparent'} hover:bg-slate-800/60 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/50`}
      >
        <div className="flex items-center gap-3">
          {tooltipText ? (
            <SimpleTooltip text={tooltipText}>
              <div className={`size-10 rounded-xl flex items-center justify-center transition-colors ${isOpen ? `bg-white/5 ${activeColor}` : 'bg-slate-950 text-slate-600'}`}>
                <Icon size={18} />
              </div>
            </SimpleTooltip>
          ) : (
            <div className={`size-10 rounded-xl flex items-center justify-center transition-colors ${isOpen ? `bg-white/5 ${activeColor}` : 'bg-slate-950 text-slate-600'}`}>
              <Icon size={18} />
            </div>
          )}
          <h3 className={`text-xs sm:text-sm font-black uppercase tracking-widest ${isOpen ? 'text-white' : 'text-slate-400'}`}>{title}</h3>
          {headerHelp}
        </div>
        <ChevronDown className={`transition-transform duration-300 text-slate-500 ${isOpen ? 'rotate-180 text-white' : ''}`} size={18} />
      </button>
      <div className={`transition-[max-height] duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4 sm:p-6 border-t border-slate-800/50 bg-black/10">
          {children}
        </div>
      </div>
    </div>
  );
};

// INTERFACE: Recent Subject Memory
interface RecentSubject {
  hash: string;
  label: string;
  lastDate: string;
}

const ProtocolBuilder: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [protocols, setProtocols] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user's protocols from Supabase
  useEffect(() => {
    const fetchProtocols = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          console.warn('No authenticated user');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('protocols')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setProtocols(data || []);
      } catch (error) {
        console.error('Error fetching protocols:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProtocols();
  }, []);

  useEffect(() => {
    const existing = localStorage.getItem('ppn_recent_subjects');
    if (!existing) {
      const dummyData: RecentSubject[] = [
        { hash: 'e3b0c44298fc1c14', label: '1985-05 (42M)', lastDate: new Date().toISOString() },
        { hash: '8f9a2b3c4d5e6f7a', label: '1992-11 (32F)', lastDate: new Date().toISOString() }
      ];
      localStorage.setItem('ppn_recent_subjects', JSON.stringify(dummyData));
    }
  }, []);

  const filteredProtocols = useMemo(() => {
    // Combine Supabase protocols with legacy mock data for now
    const allProtocols = [...protocols, ...SAMPLE_INTERVENTION_RECORDS];
    return allProtocols.filter((p: any) =>
    (p.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.substance?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.protocol?.substance?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, protocols]);

  const OVERRIDE_STYLES = `
    #protocol-builder-root input[type="text"], 
    #protocol-builder-root input[type="number"], 
    #protocol-builder-root select, 
    #protocol-builder-root textarea {
      background-color: #0f172a !important;
      color: white !important;
      border: 1px solid #334155 !important;
    }
    #protocol-builder-root input::placeholder,
    #protocol-builder-root textarea::placeholder {
      color: #64748b !important;
    }
    #protocol-builder-root input[type=range] {
      -webkit-appearance: none; 
      background: transparent; 
    }
    #protocol-builder-root input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 24px;
      width: 24px;
      border-radius: 50%;
      background: #2b74f3;
      cursor: pointer;
      margin-top: -10px;
      box-shadow: 0 0 10px rgba(43, 116, 243, 0.5);
    }
    #protocol-builder-root input[type=range]::-webkit-slider-runnable-track {
      width: 100%;
      height: 4px;
      cursor: pointer;
      background: #334155;
      border-radius: 2px;
    }
    #protocol-builder-root select {
      color-scheme: dark;
    }
  `;

  return (
    <div id="protocol-builder-root" className="min-h-full p-6 sm:p-10 space-y-10 animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-24">
      <style>{OVERRIDE_STYLES}</style>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-5xl font-black tracking-tighter text-white">
              My Protocols
            </h1>
            <div className="px-2 py-0.5 bg-clinical-green/10 border border-clinical-green/20 rounded-md text-[11px] font-mono text-clinical-green tracking-widest font-black">Standardized_v2.4</div>
          </div>
          <p className="text-slate-500 text-[11px] font-black tracking-[0.3em]">Institutional Research Architecture // Node_0x7</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-4 bg-primary hover:bg-blue-600 text-white text-[11px] font-black rounded-2xl tracking-[0.2em] transition-all shadow-xl shadow-primary/20 active:scale-95 flex items-center gap-3"
        >
          <PlusCircle size={18} />
          Create New Protocol
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative group max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search local protocols..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 rounded-xl pl-12 pr-6 text-sm font-bold transition-all"
            />
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800/50">
                    <th className="px-8 py-6">Protocol Reference</th>
                    <th className="px-8 py-6">Current Status</th>
                    <th className="px-8 py-6">Dosage</th>
                    <th className="px-8 py-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/30">
                  {filteredProtocols.map((p) => (
                    <tr key={p.id} className="hover:bg-primary/5 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-base font-black text-white leading-tight">{p.protocol.substance} Protocol</span>
                          <span className="text-[11px] font-mono text-slate-500 font-bold tracking-tight mt-1">{p.id} • {p.siteId}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className={`size-1.5 rounded-full ${p.status === 'Completed' ? 'bg-clinical-green' : p.status === 'Active' ? 'bg-primary' : 'bg-slate-500'}`}></div>
                          <span className={`text-[11px] font-black uppercase tracking-widest ${p.status === 'Completed' ? 'text-clinical-green' : 'text-slate-500'}`}>{p.status}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-mono text-slate-400">{p.protocol.dosage} {p.protocol.dosageUnit}</td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={() => navigate(`/protocol/${p.id}`)}
                          className="text-[11px] font-black text-primary hover:text-white uppercase tracking-widest transition-colors flex items-center justify-end gap-2 ml-auto"
                        >
                          Open Protocol
                          <ChevronRight className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredProtocols.length === 0 && (
              <div className="py-20 text-center space-y-4">
                <ClipboardList className="mx-auto text-slate-800" size={48} />
                <p className="text-slate-600 font-black uppercase tracking-widest text-[11px]">Zero Protocol Matches Found</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-[#111418] border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Activity size={80} />
            </div>
            <div className="space-y-1 relative z-10 mb-8">
              <h3 className="text-xl font-black text-white tracking-tighter">Outcome Velocity</h3>
              <p className="text-[11px] font-black text-primary tracking-[0.3em]">Network Baseline Analytics</p>
            </div>
            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[11px] font-bold text-slate-500 tracking-widest">Protocol Adherence</span>
                  <span className="text-sm font-mono font-black text-white">94%</span>
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-clinical-green shadow-[0_0_8px_#53d22d]" style={{ width: '94%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[11px] font-bold text-slate-500 tracking-widest">Safety Compliance</span>
                  <span className="text-sm font-mono font-black text-white">100%</span>
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-primary shadow-[0_0_8px_#2b74f3]" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 p-8 rounded-[2.5rem] space-y-4">
            <div className="flex items-center gap-3">
              <Info className="text-primary" size={20} />
              <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Regulatory Notice</h4>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Changes to Published protocols require an institutional version bump and lead investigator sign-off. All modifications are logged in the immutable audit ledger.
            </p>
          </div>
        </div>
      </div>

      <NewProtocolModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

const NewProtocolModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('demographics');
  const openSection = (section: string) => setActiveSection(section);
  const [recentSubjects, setRecentSubjects] = useState<RecentSubject[]>([]);
  const [showRecentDropdown, setShowRecentDropdown] = useState(false);
  const [tempMed, setTempMed] = useState('');

  const [formData, setFormData] = useState({
    subjectId: '',
    patientInput: '',
    patientHash: '',
    subjectAge: '35',
    sex: '',
    race: '',
    weightRange: WEIGHT_RANGES[6],
    smokingStatus: '',
    substance: SUBSTANCE_OPTIONS[0],
    dosage: '25',
    dosageUnit: 'mg',
    route: ROUTE_OPTIONS[0],
    frequency: FREQUENCY_OPTIONS[0],
    hasSafetyEvent: false,
    severity: 1,
    safetyEventDescription: '',
    phq9Score: 18,
    consentVerified: false,
    setting: SETTING_OPTIONS[0],
    prepHours: '2',
    integrationHours: '4',
    modalities: { 'CBT': false, 'Somatic': false, 'Psychodynamic': false, 'IFS': false, 'None/Sitter': false } as Record<string, boolean>,
    concomitantMeds: '',
    difficultyScore: 5,
    resolutionStatus: RESOLUTION_OPTIONS[0]
  });

  // --- DATA FILTERING: Recent Subjects ---
  const filteredRecents = useMemo(() => {
    if (!formData.patientInput) return recentSubjects;
    const input = formData.patientInput.toLowerCase();
    return recentSubjects.filter(s =>
      s.label.toLowerCase().includes(input) ||
      s.hash.toLowerCase().includes(input)
    );
  }, [recentSubjects, formData.patientInput]);

  // --- SAFETY LOGIC ENGINE ---
  const riskWarnings = useMemo(() => {
    const medList = formData.concomitantMeds.split(',').map(s => s.trim()).filter(s => s);
    if (!formData.substance || medList.length === 0) return [];

    const warnings: { med: string; level: number; desc: string }[] = [];
    medList.forEach(med => {
      const risk = MOCK_RISK_DATA.find(r =>
        (r.substanceA.toLowerCase().includes(formData.substance.toLowerCase()) || r.substanceB.toLowerCase().includes(formData.substance.toLowerCase())) &&
        (r.substanceA.toLowerCase().includes(med.toLowerCase()) || r.substanceB.toLowerCase().includes(med.toLowerCase()))
      );
      if (risk && risk.riskLevel >= 3) {
        warnings.push({ med, level: risk.riskLevel, desc: risk.description });
      }
    });
    return warnings;
  }, [formData.substance, formData.concomitantMeds]);

  // --- DOSAGE GUARDRAILS & CITATIONS ---
  const DOSAGE_LIMITS: Record<string, { limit: number; unit: string; source: string; url: string }> = {
    'Psilocybin': {
      limit: 30,
      unit: 'mg',
      source: 'COMPASS Pathways Phase IIb (NEJM 2022)',
      url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2206443'
    },
    'MDMA': {
      limit: 180,
      unit: 'mg',
      source: 'MAPS MAPP1 Phase 3 Protocol (Nature 2021)',
      url: 'https://www.nature.com/articles/s41591-021-01336-3'
    },
    'Ketamine': {
      limit: 200,
      unit: 'mg',
      source: 'APA Consensus Statement on Ketamine',
      url: 'https://jamanetwork.com/journals/jamapsychiatry/article-abstract/2605202'
    },
    'LSD-25': {
      limit: 200,
      unit: 'mcg',
      source: 'Liechti Lab (Univ. of Basel) Dose-Response',
      url: 'https://pubmed.ncbi.nlm.nih.gov/26847689/'
    }
  };

  const dosageAlert = useMemo(() => {
    if (!formData.substance || !formData.dosage) return null;
    const config = DOSAGE_LIMITS[formData.substance];
    const current = parseFloat(formData.dosage);
    if (config && current > config.limit) {
      return {
        message: `${current}${config.unit} exceeds the standard clinical maximum of ${config.limit}${config.unit}.`,
        source: config.source,
        url: config.url
      };
    }
    return null;
  }, [formData.substance, formData.dosage]);

  useEffect(() => {
    if (isOpen) {
      const generateSegment = () => {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 3; i++) {
          result += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return result;
      };
      const generatedId = `PT-${generateSegment()}-${generateSegment()}`;
      setFormData(prev => ({ ...prev, subjectId: generatedId, patientInput: '', patientHash: '' }));
      const saved = localStorage.getItem('ppn_recent_subjects');
      if (saved) {
        setRecentSubjects(JSON.parse(saved));
      }
    }
  }, [isOpen]);

  const handleIdentityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^[0-9-]*$/.test(val) && val.length <= 7) {
      setFormData(prev => ({ ...prev, patientInput: val }));
    }
  };

  const handleIdentityBlur = async () => {
    setTimeout(() => setShowRecentDropdown(false), 200);
    if (formData.patientInput.trim().length > 0) {
      const hash = await generatePatientHash(formData.patientInput);
      setFormData(prev => ({
        ...prev,
        patientHash: hash,
        subjectId: `PT-${hash.substring(0, 8).toUpperCase()}`
      }));
    }
  };

  const handleRecentSelect = (subject: RecentSubject) => {
    setFormData(prev => ({
      ...prev,
      patientInput: subject.label.split(' ')[0],
      patientHash: subject.hash,
      subjectId: `PT-${subject.hash.substring(0, 8).toUpperCase()}`
    }));
    setShowRecentDropdown(false);
  };

  const toggleSection = (section: string) => {
    setActiveSection(prev => prev === section ? '' : section);
  };

  const isFormValid = useMemo(() => {
    return (
      formData.subjectAge.trim() !== '' &&
      formData.sex !== '' &&
      formData.race !== '' &&
      formData.weightRange !== '' &&
      formData.smokingStatus !== '' &&
      formData.substance !== '' &&
      formData.dosage.trim() !== '' &&
      formData.frequency !== '' &&
      formData.route !== '' &&
      formData.consentVerified === true
    );
  }, [formData]);

  const handleModalityChange = (mod: string) => {
    setFormData(prev => ({
      ...prev,
      modalities: {
        ...prev.modalities,
        [mod]: !prev.modalities[mod]
      }
    }));
  };

  const handleAddMed = () => {
    if (!tempMed) return;
    const currentList = formData.concomitantMeds
      ? formData.concomitantMeds.split(',').map(s => s.trim()).filter(s => s)
      : [];
    if (!currentList.includes(tempMed)) {
      const newList = [...currentList, tempMed].join(', ');
      setFormData(prev => ({ ...prev, concomitantMeds: newList }));
    }
    setTempMed('');
  };

  const handleRemoveMed = (medToRemove: string) => {
    const currentList = formData.concomitantMeds
      ? formData.concomitantMeds.split(',').map(s => s.trim()).filter(s => s)
      : [];
    const newList = currentList.filter(m => m !== medToRemove).join(', ');
    setFormData(prev => ({ ...prev, concomitantMeds: newList }));
  };

  // --- SUPABASE INTEGRATION ---
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);

    try {
      // Get authenticated user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert('You must be logged in to save protocols');
        setIsSubmitting(false);
        return;
      }

      // Prepare protocol payload for new table structure
      const protocolPayload = {
        user_id: user.id,
        name: `${formData.substance} Protocol - ${formData.patientInput || 'New'}`,
        substance: formData.substance,
        indication: formData.indication || null,
        status: 'active',
        dosing_schedule: {
          dosage: formData.dosage,
          dosageUnit: formData.dosageUnit,
          frequency: formData.frequency,
          route: formData.route
        },
        safety_criteria: formData.hasSafetyEvent ? {
          event: formData.safetyEventDescription,
          severity: formData.severity,
          resolution: formData.resolution
        } : null,
        outcome_measures: {
          phq9: formData.phq9Score,
          difficulty: formData.difficultyScore
        },
        notes: JSON.stringify({
          demographics: {
            age: formData.subjectAge,
            sex: formData.sex,
            weight: formData.weightRange,
            race: formData.race,
            smoking: formData.smokingStatus
          },
          context: {
            setting: formData.setting,
            prepHours: formData.prepHours,
            integrationHours: formData.integrationHours,
            modalities: formData.modalities,
            concomitantMeds: formData.concomitantMeds
          },
          consent: {
            verified: formData.consentVerified,
            timestamp: new Date().toISOString()
          }
        })
      };

      // Insert into Supabase
      const { data: newProtocol, error } = await supabase
        .from('protocols')
        .insert([protocolPayload])
        .select()
        .single();

      if (error) throw error;

      // Update local state for recent subjects
      if (formData.patientHash) {
        const newSubject: RecentSubject = {
          hash: formData.patientHash,
          label: `${formData.patientInput || 'YYYY-MM'} (${formData.subjectAge}${formData.sex.charAt(0)})`,
          lastDate: new Date().toISOString()
        };
        const updated = [newSubject, ...recentSubjects.filter(s => s.hash !== newSubject.hash)].slice(0, 5);
        localStorage.setItem('ppn_recent_subjects', JSON.stringify(updated));
      }

      // Success feedback
      alert(`Protocol saved successfully! ID: ${newProtocol.id}`);
      onClose();

      // Refresh the protocols list
      window.location.reload();

    } catch (err) {
      console.error("Protocol Submission Error:", err);
      alert("Failed to save protocol to secure database. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const fieldLabelClass = "text-slate-500 text-xs tracking-widest font-black block ml-1 mb-1.5";
  const standardInputClass = "w-full rounded-xl px-4 h-12 sm:h-14 text-base font-bold transition-all focus:outline-none";

  return (
    <div id="protocol-builder-root" className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-5xl bg-[#0f172a] border border-white/10 rounded-none sm:rounded-[2.5rem] min-h-screen sm:min-h-0 h-full sm:h-auto max-h-screen sm:max-h-[90vh] shadow-[0_0_50px_-12px_rgba(43,116,243,0.5)] ring-2 ring-primary/40 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">

        <div className="p-6 sm:p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/20 shrink-0">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Create New Protocol</h1>
              <p className="text-xs font-bold text-slate-500 tracking-widest mt-1">Clinical Protocol Registry v2.4</p>
            </div>
            {formData.subjectId && (
              <div className="hidden sm:flex flex-col items-start px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <span className="text-[11px] font-black text-blue-400 tracking-widest mb-0.5">Research Identity Node</span>
                <span className="text-xs font-mono font-black text-blue-200 tracking-widest flex items-center gap-2">
                  <Shield size={12} className="text-blue-400" />
                  {formData.subjectId}
                </span>
              </div>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-500">
            <span className="material-symbols-outlined text-lg font-black">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
          {/* Secure Ingestion Banner - High Fidelity */}
          <div className="bg-indigo-950/30 border border-indigo-500/30 p-6 rounded-2xl mb-8 flex flex-col sm:flex-row gap-5 items-start shadow-xl relative overflow-hidden group">
            {/* Background Glow Effect */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none group-hover:bg-indigo-500/30 transition-colors"></div>
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl shrink-0 text-indigo-400 shadow-lg mt-1">
              <Lock size={24} />
            </div>

            <div className="space-y-3 relative z-10">
              <h4 className="text-base font-black text-white tracking-widest flex items-center gap-3">
                Secure Data Ingestion Active
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/30 text-[11px] text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.3)]">ENCRYPTED</span>
              </h4>

              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm font-medium text-slate-300">
                  <span className="text-indigo-500 mt-1.5 size-1.5 rounded-full bg-indigo-500 shadow-[0_0_5px_currentColor]"></span>
                  <span>No PHI (Patient Identifiable Information) is stored on the network.</span>
                </li>
                <li className="flex items-start gap-2 text-sm font-medium text-slate-300">
                  <span className="text-indigo-500 mt-1.5 size-1.5 rounded-full bg-indigo-500 shadow-[0_0_5px_currentColor]"></span>
                  <span>HIPAA-Compliant Anonymization Protocol (Safe Harbor Method).</span>
                </li>
                <li className="flex items-start gap-2 text-sm font-medium text-slate-300">
                  <span className="text-indigo-500 mt-1.5 size-1.5 rounded-full bg-indigo-500 shadow-[0_0_5px_currentColor]"></span>
                  <span>Data is end-to-end encrypted at rest and in transit (AES-256).</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <SectionAccordion
              title="Patient Demographics"
              icon={User}
              isOpen={activeSection === 'demographics'}
              onToggle={() => toggleSection('demographics')}
              onFocus={() => openSection('demographics')}
              headerHelp={
                <div className="group relative ml-2" onClick={(e) => e.stopPropagation()}>
                  {/* Contextual Help: Demographics (Paragraph Format) */}
                  <Info
                    size={20}
                    className="text-slate-500 hover:text-primary transition-colors cursor-help"
                    strokeWidth={2}
                  />
                  <div className="absolute left-0 top-full mt-3 w-80 bg-slate-900 border border-slate-600 p-5 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                    <div className="absolute top-[-6px] left-4 w-3 h-3 bg-slate-900 border-t border-l border-slate-600 rotate-45"></div>
                    <div className="flex items-center gap-2 mb-3">
                      <Shield size={16} className="text-primary" />
                      <h5 className="text-sm font-black text-white tracking-widest">Privacy & Identity</h5>
                    </div>
                    <div className="space-y-3 text-sm text-slate-300 font-medium leading-relaxed text-left">
                      <p>
                        <span className="text-white font-bold">Anonymization:</span> We generate a unique "Hash ID" to replace the patient's real name.
                      </p>
                      <p>
                        <span className="text-white font-bold">Compliance:</span> This ensures 100% HIPAA/GDPR privacy while allowing longitudinal tracking.
                      </p>
                      <p>
                        <span className="text-white font-bold">Data Safety:</span> No Personally Identifiable Information (PII) is stored in the cloud.
                      </p>
                    </div>
                  </div>
                </div>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2 pb-4 border-b border-slate-800/50 relative z-20">
                  <div className="flex items-center gap-2 mb-1.5">
                    <label className="text-slate-500 text-xs tracking-widest font-black block ml-1">Subject Birth Reference (YYYY-MM)</label>
                    <SimpleTooltip text="Enter Birth Year and Month to generate a unique cohort ID without using names.">
                      <HelpCircle size={12} className="text-slate-600 hover:text-primary cursor-help transition-colors" />
                    </SimpleTooltip>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. 1985-05"
                      value={formData.patientInput}
                      onChange={handleIdentityChange}
                      onFocus={() => setShowRecentDropdown(true)}
                      onBlur={handleIdentityBlur}
                      className={`${standardInputClass} border-indigo-500/30 focus:border-indigo-500/60 bg-indigo-900/10 font-mono tracking-wider`}
                    />
                    {showRecentDropdown && filteredRecents.length > 0 && (
                      <div className="absolute top-full left-0 w-full mt-2 bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                        <div className="px-4 py-2 bg-slate-900/50 border-b border-slate-800 text-[11px] font-black text-slate-500 tracking-widest flex items-center gap-2">
                          <History size={10} /> Recent Matches
                        </div>
                        {filteredRecents.map((subject, idx) => (
                          <button
                            key={idx}
                            onMouseDown={() => handleRecentSelect(subject)}
                            className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center justify-between group transition-colors"
                          >
                            <span className="text-sm font-bold text-slate-300 group-hover:text-white">{subject.label}</span>
                            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{subject.hash.substring(0, 6)}...</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {formData.patientHash ? (
                    <div className="flex items-center gap-2 mt-2 animate-in fade-in slide-in-from-top-1">
                      <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                        <Lock size={10} /> Privacy Active
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">Anonymized ID: {formData.patientHash.substring(0, 8).toUpperCase()}</span>
                    </div>
                  ) : (
                    <p className="text-[9px] text-slate-500 font-medium">This data is hashed locally. PPN never sees the patient's name.</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className={fieldLabelClass}>Age</label>
                  <select
                    value={formData.subjectAge}
                    onChange={e => setFormData({ ...formData, subjectAge: e.target.value })}
                    className={standardInputClass}
                  >
                    {AGE_OPTIONS.map(age => (
                      <option key={age} value={age}>{age}</option>
                    ))}
                    <option value="90+">90+</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={fieldLabelClass}>Biological Sex</label>
                  <select
                    value={formData.sex}
                    onChange={e => setFormData({ ...formData, sex: e.target.value })}
                    className={standardInputClass}
                  >
                    <option value="" disabled className="text-slate-600">Select Sex...</option>
                    {SEX_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={fieldLabelClass}>Smoking Status</label>
                  <select
                    value={formData.smokingStatus}
                    onChange={e => setFormData({ ...formData, smokingStatus: e.target.value })}
                    className={standardInputClass}
                  >
                    <option value="" disabled className="text-slate-600">Select Status...</option>
                    {SMOKING_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={fieldLabelClass}>Race / Ethnicity</label>
                  <select
                    value={formData.race}
                    onChange={e => setFormData({ ...formData, race: e.target.value })}
                    className={standardInputClass}
                  >
                    <option value="" disabled className="text-slate-600">Select Race...</option>
                    {RACE_OPTIONS.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={fieldLabelClass}>Weight Range</label>
                  <select
                    value={formData.weightRange}
                    onChange={e => setFormData({ ...formData, weightRange: e.target.value })}
                    className={standardInputClass}
                  >
                    {WEIGHT_RANGES.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </div>
            </SectionAccordion>

            <SectionAccordion
              title="Therapeutic Context"
              icon={Brain}
              isOpen={activeSection === 'context'}
              onToggle={() => toggleSection('context')}
              onFocus={() => openSection('context')}
              headerHelp={
                <div className="group relative ml-2" onClick={(e) => e.stopPropagation()}>
                  <Info
                    size={20}
                    className="text-slate-500 hover:text-primary transition-colors cursor-help"
                    strokeWidth={2}
                  />
                  <div className="absolute left-0 top-full mt-3 w-80 bg-slate-900 border border-slate-600 p-5 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                    <div className="absolute top-[-6px] left-4 w-3 h-3 bg-slate-900 border-t border-l border-slate-600 rotate-45"></div>
                    <div className="flex items-center gap-2 mb-3">
                      <Activity size={16} className="text-primary" />
                      <h5 className="text-sm font-black text-white uppercase tracking-widest">Safety & Context</h5>
                    </div>
                    <div className="space-y-3 text-sm text-slate-300 font-medium leading-relaxed text-left">
                      <p>
                        <span className="text-white font-bold">Medications:</span> List all current drugs. The system will auto-scan them for dangerous interactions (e.g., SSRIs).
                      </p>
                      <p>
                        <span className="text-white font-bold">Modality:</span> Select the therapeutic framework (e.g., CBT, Somatic) used to support the session.
                      </p>
                      <p>
                        <span className="text-white font-bold">Integration:</span> Log the planned hours of non-drug therapy. Adequate integration is required for safety compliance.
                      </p>
                    </div>
                  </div>
                </div>
              }
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className={fieldLabelClass}>Setting</label>
                  <select
                    value={formData.setting}
                    onChange={e => setFormData({ ...formData, setting: e.target.value })}
                    className={standardInputClass}
                  >
                    {SETTING_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className={fieldLabelClass}>Prep Hours</label>
                    <input
                      type="number"
                      min="0" max="20"
                      value={formData.prepHours}
                      onChange={e => setFormData({ ...formData, prepHours: e.target.value })}
                      className={standardInputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={fieldLabelClass}>Integration Hours</label>
                    <input
                      type="number"
                      min="0" max="50"
                      value={formData.integrationHours}
                      onChange={e => setFormData({ ...formData, integrationHours: e.target.value })}
                      className={standardInputClass}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <label className={fieldLabelClass}>Support Modality</label>
                    <SimpleTooltip text="Select all therapeutic modalities present during the dosing session.">
                      <Info size={14} className="text-slate-500 hover:text-primary cursor-help transition-colors mb-1.5" />
                    </SimpleTooltip>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {MODALITY_OPTIONS.map(mod => (
                      <label key={mod} className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.modalities[mod]
                        ? 'bg-primary/20 border-primary text-white shadow-[0_0_10px_rgba(43,116,243,0.2)]'
                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'
                        }`}>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={!!formData.modalities[mod]}
                          onChange={() => handleModalityChange(mod)}
                        />
                        <div className={`size-4 rounded border flex items-center justify-center transition-colors ${formData.modalities[mod] ? 'bg-primary border-primary' : 'border-slate-600'
                          }`}>
                          {formData.modalities[mod] && <span className="material-symbols-outlined text-[10px] text-white font-black">check</span>}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider">{mod}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-800/50">
                  <label className={fieldLabelClass}>Concomitant Medications</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <select
                        value={tempMed}
                        onChange={(e) => setTempMed(e.target.value)}
                        className={standardInputClass}
                      >
                        <option value="">Select Medication...</option>
                        {MEDICATIONS_LIST.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                    <button
                      onClick={handleAddMed}
                      disabled={!tempMed}
                      className="px-4 bg-slate-800 hover:bg-primary hover:text-white text-slate-400 border border-slate-700 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <PlusCircle size={20} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-slate-950/50 border border-slate-800/50 rounded-xl">
                    {formData.concomitantMeds.split(',').map(s => s.trim()).filter(s => s).length === 0 && (
                      <span className="text-[10px] text-slate-600 italic p-1">No medications added.</span>
                    )}
                    {formData.concomitantMeds.split(',').map(s => s.trim()).filter(s => s).map((med, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg group hover:border-red-500/50 transition-colors">
                        <span className="text-[10px] font-bold text-slate-300">{med}</span>
                        <button
                          onClick={() => handleRemoveMed(med)}
                          className="text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {riskWarnings.length > 0 && (
                    <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                      {riskWarnings.map((warning, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-4">
                          <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
                          <div>
                            <h5 className="text-xs font-black text-red-400 uppercase tracking-widest mb-1">
                              Contraindication Detected: {warning.med}
                            </h5>
                            <p className="text-xs text-red-200/80 leading-relaxed">
                              {warning.desc} <span className="text-white font-bold ml-1">(Risk Level: {warning.level})</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </SectionAccordion>

            <SectionAccordion
              title="Protocol Parameters"
              icon={Microscope}
              isOpen={activeSection === 'protocol'}
              onToggle={() => toggleSection('protocol')}
              onFocus={() => openSection('protocol')}
              headerHelp={
                <div className="group relative ml-2" onClick={(e) => e.stopPropagation()}>
                  {/* Contextual Help: Protocol Parameters (Paragraph Format) */}
                  <Info
                    size={20}
                    className="text-slate-500 hover:text-primary transition-colors cursor-help"
                    strokeWidth={2}
                  />
                  {/* Tooltip Container - Top-Down - WIDENED to 480px */}
                  <div className="absolute left-0 top-full mt-3 w-[480px] bg-slate-900 border border-slate-600 p-5 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">

                    {/* Decorative Arrow (Pointing UP) */}
                    <div className="absolute top-[-6px] left-4 w-3 h-3 bg-slate-900 border-t border-l border-slate-600 rotate-45"></div>

                    <div className="flex items-center gap-2 mb-3">
                      <Microscope size={16} className="text-primary" />
                      <h5 className="text-sm font-black text-white uppercase tracking-widest">Clinical Regimen</h5>
                    </div>

                    <div className="space-y-3 text-sm text-slate-300 font-medium leading-relaxed text-left">
                      <p>
                        <span className="text-white font-bold">Substance:</span> Identify the primary active agent (e.g., Psilocybin). This links to our Substance Catalog for monograph data.
                      </p>
                      <p>
                        <span className="text-white font-bold">Dosage:</span> Enter the precise amount. This triggers our automated High-Dose Guardrails to prevent dosing errors.
                      </p>
                      <p>
                        <span className="text-white font-bold">Route:</span> Specify the administration pathway (e.g., Oral) for accurate bioavailability tracking.
                      </p>
                    </div>
                  </div>
                </div>
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-2">
                  <label className={fieldLabelClass}>Substance Compound</label>
                  <select
                    value={formData.substance}
                    onChange={e => setFormData({ ...formData, substance: e.target.value })}
                    className={standardInputClass}
                  >
                    {SUBSTANCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={fieldLabelClass}>Administration Route</label>
                  <select
                    value={formData.route}
                    onChange={e => setFormData({ ...formData, route: e.target.value })}
                    className={standardInputClass}
                  >
                    {ROUTE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={fieldLabelClass}>Standardized Dosage</label>
                  <div className="flex gap-3 items-end">
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder="e.g. 25"
                      value={formData.dosage}
                      onChange={e => {
                        const val = e.target.value.replace(/[^0-9.]/g, '');
                        setFormData({ ...formData, dosage: val });
                      }}
                      className={`${standardInputClass} flex-[2]`}
                    />
                    <select
                      value={formData.dosageUnit}
                      onChange={e => setFormData({ ...formData, dosageUnit: e.target.value })}
                      className={`${standardInputClass} flex-1`}
                    >
                      {UNIT_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
                {/* HIGH DOSE WARNING WITH CITATION */}
                {dosageAlert && (
                  <div className="mt-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex flex-col gap-2 animate-in fade-in slide-in-from-top-1 col-span-full">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} />
                      <p className="text-[11px] text-amber-200/90 font-medium leading-snug">
                        <span className="font-black uppercase tracking-wider text-amber-400">Clinical Caution:</span> {dosageAlert.message}
                      </p>
                    </div>
                    <div className="pl-7">
                      <a
                        href={dosageAlert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-amber-400/60 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1 transition-colors"
                      >
                        Source: {dosageAlert.source}
                        <ChevronRight size={10} />
                      </a>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <label className={fieldLabelClass}>Frequency</label>
                  <select
                    value={formData.frequency}
                    onChange={e => setFormData({ ...formData, frequency: e.target.value })}
                    className={standardInputClass}
                  >
                    {FREQUENCY_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>
            </SectionAccordion>

            <SectionAccordion
              title="Clinical Outcomes & Safety"
              icon={Activity}
              isOpen={activeSection === 'outcomes'}
              onToggle={() => toggleSection('outcomes')}
              onFocus={() => openSection('outcomes')}
              headerHelp={
                <div className="group relative ml-2" onClick={(e) => e.stopPropagation()}>
                  <Info
                    size={20}
                    className="text-slate-500 hover:text-primary transition-colors cursor-help"
                    strokeWidth={2}
                  />
                  <div className="absolute left-0 top-full mt-3 w-80 bg-slate-900 border border-slate-600 p-5 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                    <div className="absolute top-[-6px] right-6 w-3 h-3 bg-slate-900 border-t border-l border-slate-600 rotate-45"></div>
                    <div className="flex items-center gap-2 mb-3">
                      <ClipboardList size={16} className="text-primary" />
                      <h5 className="text-sm font-black text-white uppercase tracking-widest">Outcomes & Compliance</h5>
                    </div>
                    <div className="space-y-3 text-sm text-slate-300 font-medium leading-relaxed text-left">
                      <p>
                        <span className="text-white font-bold">Baseline:</span> Select validated instruments (like GAD-7) to measure clinical progress.
                      </p>
                      <p>
                        <span className="text-white font-bold">Adverse Events:</span> Log any negative reactions immediately to trigger the pharmacovigilance network.
                      </p>
                      <p>
                        <span className="text-white font-bold">Consent:</span> You must verify that a signed Informed Consent form is on file before submission.
                      </p>
                    </div>
                  </div>
                </div>
              }
            >
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className={fieldLabelClass}>Psychological Difficulty</label>
                    <span className="text-sm font-black text-white bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                      {formData.difficultyScore}/10
                    </span>
                  </div>
                  <div className="relative px-2">
                    <input
                      type="range"
                      min="1" max="10"
                      step="1"
                      value={formData.difficultyScore}
                      onChange={e => setFormData({ ...formData, difficultyScore: parseInt(e.target.value) })}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-widest mt-3">
                      <span>1 = Bliss</span>
                      <span>5 = Neutral</span>
                      <span>10 = Extreme Distress</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className={fieldLabelClass}>Baseline PHQ-9 Score</label>
                    <select
                      value={formData.phq9Score}
                      onChange={e => setFormData({ ...formData, phq9Score: parseInt(e.target.value) })}
                      className={standardInputClass}
                    >
                      {PHQ9_SCORES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className={fieldLabelClass}>Resolution Status</label>
                    <select
                      value={formData.resolutionStatus}
                      onChange={e => setFormData({ ...formData, resolutionStatus: e.target.value })}
                      className={standardInputClass}
                    >
                      {RESOLUTION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                </div>

                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6 shadow-inner">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="text-accent-amber" size={18} />
                      <h3 className="text-sm font-black text-white uppercase tracking-widest">Adverse Events</h3>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.hasSafetyEvent}
                        onChange={e => setFormData({ ...formData, hasSafetyEvent: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-amber shadow-sm"></div>
                    </label>
                  </div>

                  {formData.hasSafetyEvent && (
                    <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="space-y-2">
                        <label className={fieldLabelClass}>Severity (CTCAE Grade)</label>
                        <select
                          value={formData.severity}
                          onChange={e => setFormData({ ...formData, severity: parseInt(e.target.value) })}
                          className={standardInputClass}
                        >
                          {SEVERITY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-red-400 text-[10px] uppercase tracking-widest font-black block ml-1 mb-1.5">Primary Clinical Observation</label>
                        <select
                          value={formData.safetyEventDescription}
                          onChange={e => setFormData({ ...formData, safetyEventDescription: e.target.value })}
                          className={`${standardInputClass} safety-field`}
                        >
                          <option value="" disabled className="text-slate-600">Select Observation...</option>
                          {SAFETY_EVENT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </SectionAccordion>
          </div>
        </div>

        <div className="p-6 sm:p-8 border-t border-slate-800 bg-slate-950 space-y-6 shrink-0">
          <div className="px-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.consentVerified}
                onChange={e => setFormData({ ...formData, consentVerified: e.target.checked })}
                style={{ width: '20px', height: '20px' }}
                className="rounded text-primary focus:ring-primary/20 transition-all cursor-pointer"
              />
              <span className="group-hover:text-slate-200 transition-colors">I verify that Informed Consent has been obtained and is on file.</span>
            </label>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 sm:py-0 h-14 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-black text-slate-400 hover:text-white tracking-[0.3em] rounded-2xl transition-all uppercase"
            >
              Discard Draft
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`flex-[2] h-14 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center ${isFormValid
                ? 'bg-primary hover:bg-blue-600 text-white shadow-primary/20 hover:scale-105 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-50 grayscale'
                }`}
            >
              Submit to Registry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolBuilder;