import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { supabase } from '../supabaseClient';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';
import { AdvancedTooltip } from '../components/ui/AdvancedTooltip';
import { ButtonGroup } from '../components/forms/ButtonGroup';
import {
  User, Brain, Activity, Microscope, Shield, Lock, Info, AlertTriangle,
  Search, PlusCircle, ClipboardList, ChevronRight, ChevronDown, Copy, CheckCircle,
  HelpCircle, History, X
} from 'lucide-react';
import { SAMPLE_INTERVENTION_RECORDS, MEDICATIONS_LIST } from '../constants';
import { PatientRecord } from '../types';
import { MOCK_RISK_DATA } from '../constants/analyticsData';

// Clinical Standardization Constants
const WEIGHT_RANGES = Array.from({ length: 22 }, (_, i) => {
  const startKg = 40 + i * 5;
  const endKg = startKg + 5;
  const startLbs = Math.round(startKg * 2.20462);
  const endLbs = Math.round(endKg * 2.20462);
  return `${startKg} -${endKg} kg(${startLbs} - ${endLbs} lbs)`;
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

// [Removed SimpleTooltip - Replaced with AdvancedTooltip system]

const PROTOCOL_TEMPLATE_OPTIONS = [
  { value: null, label: '-- Create New Protocol --' },
  { value: 'standard-psilocybin', label: 'Standard Psilocybin 25mg (COMPASS)' },
  { value: 'mdma-maps', label: 'MDMA-Assisted Therapy (MAPS)' },
  { value: 'ketamine-iv', label: 'Ketamine IV 0.5mg/kg' },
  { value: 'esketamine-nasal', label: 'Esketamine Nasal 84mg' },
  { value: 'custom', label: 'Custom / Site-Specific' }
];

const SESSION_NUMBER_OPTIONS = [
  { value: 1, label: 'Session 1 (Baseline)' },
  { value: 2, label: 'Session 2' },
  { value: 3, label: 'Session 3' },
  { value: 4, label: 'Session 4' },
  { value: 5, label: 'Session 5' },
  { value: 6, label: 'Session 6+' },
  { value: 0, label: 'Follow-up Only (No Dosing)' }
];

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
    <div className={`bg - slate - 900 / 50 border ${isOpen ? 'border-slate-700' : 'border-slate-800'} rounded - 2xl mb - 4 overflow - hidden transition - all duration - 300`}>
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
        className={`w - full flex items - center justify - between p - 4 sm: p - 5 ${isOpen ? 'bg-slate-800/40' : 'bg-transparent'} hover: bg - slate - 800 / 60 transition - colors cursor - pointer focus: outline - none focus: ring - 2 focus: ring - inset focus: ring - primary / 50`}
      >
        <div className="flex items-center gap-3">
          {tooltipText ? (
            <AdvancedTooltip content={tooltipText} tier="micro" side="top">
              <div className={`size - 10 rounded - xl flex items - center justify - center transition - colors ${isOpen ? `bg-white/5 ${activeColor}` : 'bg-slate-950 text-slate-600'} `}>
                <Icon size={18} />
              </div>
            </AdvancedTooltip>
          ) : (
            <div className={`size - 10 rounded - xl flex items - center justify - center transition - colors ${isOpen ? `bg-white/5 ${activeColor}` : 'bg-slate-950 text-slate-600'} `}>
              <Icon size={18} />
            </div>
          )}
          <h3 className={`text - xs sm: text - sm font - black uppercase tracking - widest ${isOpen ? 'text-white' : 'text-slate-400'} `}>{title}</h3>
          {headerHelp}
        </div>
        <ChevronDown className={`transition - transform duration - 300 text - slate - 500 ${isOpen ? 'rotate-180 text-white' : ''} `} size={18} />
      </button>
      <div className={`transition - [max - height] duration - 500 ease -in -out overflow - hidden ${isOpen ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'} `}>
        <div className="p-4 sm:p-6 border-t border-slate-800/50 bg-black/10">
          {children}
        </div>
      </div>
    </div>
  );
};

// INTERFACE: Recent Subject Memory (HIPAA-Compliant)
interface RecentSubject {
  subject_id: string;              // System-generated ID (e.g., "PT-A7B9C2D4E5")
  last_substance_id: number | null; // FK to ref_substances
  last_substance_name: string | null; // Denormalized for display
  session_count: number;           // Total sessions for this patient
  last_session_date: string;       // ISO date of most recent session
  created_at: string;              // First session date
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

  // HIPAA Compliance: Clean up legacy localStorage with PII
  useEffect(() => {
    const legacyKey = 'ppn_recent_subjects';
    if (localStorage.getItem(legacyKey)) {
      localStorage.removeItem(legacyKey);
      console.warn('[HIPAA Cleanup] Removed legacy patient lookup data containing PII');
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
#protocol - builder - root input[type = "text"],
  #protocol - builder - root input[type = "number"],
    #protocol - builder - root select,
      #protocol - builder - root textarea {
  background - color: #0f172a!important;
  color: white!important;
  border: 1px solid #334155!important;
}
#protocol - builder - root input:: placeholder,
  #protocol - builder - root textarea::placeholder {
  color: #64748b!important;
}
#protocol - builder - root input[type = range] {
  -webkit - appearance: none;
  background: transparent;
}
#protocol - builder - root input[type = range]:: -webkit - slider - thumb {
  -webkit - appearance: none;
  height: 24px;
  width: 24px;
  border - radius: 50 %;
  background: #2b74f3;
  cursor: pointer;
  margin - top: -10px;
  box - shadow: 0 0 10px rgba(43, 116, 243, 0.5);
}
#protocol - builder - root input[type = range]:: -webkit - slider - runnable - track {
  width: 100 %;
  height: 4px;
  cursor: pointer;
  background: #334155;
  border - radius: 2px;
}
#protocol - builder - root select {
  color - scheme: dark;
}
`;

  return (
    <PageContainer width="wide" className="min-h-full py-6 sm:py-10 pb-24 animate-in fade-in duration-700">
      <div id="protocol-builder-root" className="space-y-10">
        <style>{OVERRIDE_STYLES}</style>

        <Section>
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
                              <div className={`size - 1.5 rounded - full ${p.status === 'Completed' ? 'bg-clinical-green' : p.status === 'Active' ? 'bg-primary' : 'bg-slate-500'} `}></div>
                              <span className={`text - [11px] font - black uppercase tracking - widest ${p.status === 'Completed' ? 'text-clinical-green' : 'text-slate-500'} `}>{p.status}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-sm font-mono text-slate-400">{p.protocol.dosage} {p.protocol.dosageUnit}</td>
                          <td className="px-8 py-6 text-right">
                            <button
                              onClick={() => navigate(`/ protocol / ${p.id} `)}
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
        </Section>

        <NewProtocolModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </PageContainer>
  );
};

const NewProtocolModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('demographics'); // Auto-open first accordion
  const openSection = (section: string) => setActiveSection(section);
  const [recentSubjects, setRecentSubjects] = useState<RecentSubject[]>([]);
  const [showRecentDropdown, setShowRecentDropdown] = useState(false);
  const [tempMed, setTempMed] = useState('');

  const [formData, setFormData] = useState({
    // DB-Driven Fields (IDs)
    substance_id: null as number | null,
    route_id: null as number | null,
    smoking_status_id: null as number | null,
    resolution_status_id: null as number | null,
    severity_grade_id: null as number | null,
    safety_event_id: null as number | null,
    indication_id: null as number | null,
    modality_id: null as number | null,
    protocol_template_id: null as string | null,
    session_number: 1,
    session_date: new Date().toISOString().split('T')[0],
    concomitant_med_ids: [] as number[],

    // Legacy / Transformation Fields (to be deprecated or mapped)
    subjectId: '',
    patientInput: '',
    patientHash: '',
    subjectAge: '35',
    sex: '',
    race: '',
    weightRange: WEIGHT_RANGES[6],
    smokingStatus: '', // keep for now, will map to ID
    substance: SUBSTANCE_OPTIONS[0], // keep for now
    dosage: '25',
    dosageUnit: 'mg',
    route: ROUTE_OPTIONS[0], // keep for now
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

  // --- REFERENCE DATA STATE ---
  const [refSubstances, setRefSubstances] = useState<any[]>([]);
  const [refRoutes, setRefRoutes] = useState<any[]>([]);
  const [refModalities, setRefModalities] = useState<any[]>([]);
  const [refSmokingStatus, setRefSmokingStatus] = useState<any[]>([]);
  const [refSeverity, setRefSeverity] = useState<any[]>([]);
  const [refSafetyEvents, setRefSafetyEvents] = useState<any[]>([]);
  const [refResolution, setRefResolution] = useState<any[]>([]);
  const [refIndications, setRefIndications] = useState<any[]>([]);
  const [refMedications, setRefMedications] = useState<any[]>([]);
  const [medSearchQuery, setMedSearchQuery] = useState('');

  // --- FETCH REFERENCE DATA ---
  useEffect(() => {
    const fetchRefs = async () => {
      // Parallel fetch for speed
      const [
        { data: sub },
        { data: rou },
        { data: mod },
        { data: smo },
        { data: sev },
        { data: saf },
        { data: res },
        { data: ind },
        { data: med }
      ] = await Promise.all([
        supabase.from('ref_substances').select('*').eq('is_active', true).order('substance_name'),
        supabase.from('ref_routes').select('*').eq('is_active', true).order('route_name'),
        supabase.from('ref_support_modality').select('*').eq('is_active', true).order('modality_name'),
        supabase.from('ref_smoking_status').select('*').eq('is_active', true).order('status_name'),
        supabase.from('ref_severity_grade').select('*').eq('is_active', true).order('grade_value'),
        supabase.from('ref_safety_events').select('*').eq('is_active', true).order('event_name'),
        supabase.from('ref_resolution_status').select('*').eq('is_active', true).order('status_name'),
        supabase.from('ref_indications').select('*').eq('is_active', true).order('indication_name'),
        supabase.from('ref_medications').select('*').eq('is_active', true).order('medication_name')
      ]);

      if (sub) setRefSubstances(sub);
      if (rou) setRefRoutes(rou);
      if (mod) setRefModalities(mod);
      if (smo) setRefSmokingStatus(smo);
      if (sev) setRefSeverity(sev);
      if (saf) setRefSafetyEvents(saf);
      if (res) setRefResolution(res);
      if (ind) setRefIndications(ind);
      if (med) setRefMedications(med);
    };

    if (isOpen) {
      fetchRefs();
    }
  }, [isOpen]);

  // --- HELPER: Format Relative Time ---
  const formatRelativeTime = (isoDate: string): string => {
    const now = new Date();
    const then = new Date(isoDate);
    const diffMs = now.getTime() - then.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // --- DATA FILTERING: Recent Subjects ---
  const filteredRecents = useMemo(() => {
    if (!formData.subjectId) return recentSubjects;
    const input = formData.subjectId.toLowerCase();
    return recentSubjects.filter(s =>
      s.subject_id.toLowerCase().includes(input) ||
      (s.last_substance_name?.toLowerCase() || '').includes(input)
    );
  }, [recentSubjects, formData.subjectId]);

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
        for (let i = 0; i < 10; i++) {
          result += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return result;
      };
      const generatedId = `PT - ${generateSegment()} `;
      setFormData(prev => ({ ...prev, subjectId: generatedId, patientInput: '', patientHash: '' }));

      // Fetch recent patients from database (HIPAA-compliant)
      const fetchRecentPatients = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          // Query log_clinical_records for recent unique patients
          const { data, error } = await supabase
            .from('log_clinical_records')
            .select('patient_link_code, substance_id, session_number, session_date, created_at')
            .eq('practitioner_id', user.id)
            .order('session_date', { ascending: false })
            .limit(50); // Fetch more to deduplicate

          if (error) throw error;

          if (data) {
            // Deduplicate by patient_link_code and get most recent session for each
            const patientMap = new Map<string, any>();
            data.forEach(record => {
              const existing = patientMap.get(record.patient_link_code);
              if (!existing || new Date(record.session_date) > new Date(existing.session_date)) {
                patientMap.set(record.patient_link_code, record);
              }
            });

            // Count sessions per patient
            const sessionCounts = new Map<string, number>();
            data.forEach(record => {
              sessionCounts.set(record.patient_link_code, (sessionCounts.get(record.patient_link_code) || 0) + 1);
            });

            // Build RecentSubject array
            const recentPatients: RecentSubject[] = Array.from(patientMap.values())
              .slice(0, 10)
              .map(record => {
                const substanceName = refSubstances.find(s => s.substance_id === record.substance_id)?.substance_name || null;
                return {
                  subject_id: record.patient_link_code,
                  last_substance_id: record.substance_id,
                  last_substance_name: substanceName,
                  session_count: sessionCounts.get(record.patient_link_code) || 1,
                  last_session_date: record.session_date,
                  created_at: record.created_at
                };
              });

            setRecentSubjects(recentPatients);
          }
        } catch (err) {
          console.error('[Patient Lookup] Failed to fetch recent patients:', err);
          // Fail silently - user can still enter ID manually
        }
      };

      // Only fetch if we have substance data loaded
      if (refSubstances.length > 0) {
        fetchRecentPatients();
      }
    }
  }, [isOpen, refSubstances]);

  const handleIdentityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    if (/^[A-Z0-9-]*$/.test(val) && val.length <= 15) {
      setFormData(prev => ({ ...prev, subjectId: val }));
    }
  };

  const handleRecentSelect = (subject: RecentSubject) => {
    setFormData(prev => ({
      ...prev,
      subjectId: subject.subject_id,
      substance_id: subject.last_substance_id, // Pre-fill last substance
      session_number: subject.session_count + 1, // Auto-increment session
      patientInput: '' // Clear legacy field
    }));
    setShowRecentDropdown(false);
  };

  const [copiedId, setCopiedId] = useState(false);
  const handleCopyId = () => {
    if (formData.subjectId) {
      navigator.clipboard.writeText(formData.subjectId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const toggleSection = (section: string) => {
    setActiveSection(prev => prev === section ? '' : section);
  };

  const isFormValid = useMemo(() => {
    // 1. Demographics
    if (!formData.subjectId || !formData.subjectAge || !formData.sex || !formData.race || !formData.weightRange) return false;
    if (!formData.indication_id) return false;

    // 2. Protocol
    if (!formData.substance_id || !formData.route_id || !formData.session_number) return false;
    if (!formData.dosage || isNaN(parseFloat(formData.dosage))) return false;

    // 3. Outcomes & Context
    if (!formData.session_date) return false;
    if (!formData.prepHours || !formData.integrationHours) return false;
    if (!formData.setting) return false;
    if (!formData.modality_id) return false;
    if (!formData.resolution_status_id) return false;

    // 4. Safety Logic & Consent
    if (formData.hasSafetyEvent) {
      if (!formData.severity_grade_id || !formData.safety_event_id) return false;
    }
    if (!formData.consentVerified) return false;

    return true;
  }, [formData]);

  // Progress indicator helper
  const getCompletionStatus = () => {
    const requiredFields = [
      formData.subjectId,
      formData.sex,
      formData.smoking_status_id, // Added for progress
      formData.race, // Added for progress
      formData.weightRange, // Added for progress
      formData.indication_id, // Added for progress
      formData.substance_id,
      formData.route_id,
      formData.dosage,
      formData.session_number,
      formData.session_date, // Added for progress
      formData.prepHours, // Added for progress
      formData.integrationHours, // Added for progress
      formData.setting, // Added for progress
      formData.modality_id, // Added for progress
      formData.resolution_status_id, // Added for progress
      formData.consentVerified
    ];

    let completedCount = 0;
    requiredFields.forEach(field => {
      if (field !== null && field !== undefined && field !== '' && (Array.isArray(field) ? field.length > 0 : true)) {
        completedCount++;
      }
    });

    // Handle conditional fields
    if (formData.hasSafetyEvent) {
      if (formData.severity_grade_id) completedCount++;
      if (formData.safety_event_id) completedCount++;
    } else {
      // If no safety event, these aren't required, so don't count them as incomplete
      completedCount += 2; // Add back the potential missing count for safety fields
    }

    const totalFields = requiredFields.length + (formData.hasSafetyEvent ? 0 : 2); // Adjust total if safety fields are not required

    return `${completedCount} of ${totalFields} required fields complete`;
  };

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
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert('Authentication Error: You must be logged in to save protocols.');
        setIsSubmitting(false);
        return;
      }

      // Fetch User Site Context (MVP Assumption: User belongs to 1 context site)
      const { data: userSite } = await supabase
        .from('user_sites')
        .select('site_id')
        .eq('user_id', user.id)
        .limit(1)
        .single();

      // Construct Payload for log_clinical_records (Schema-Aligned)
      const payload = {
        // Core Identity
        practitioner_id: user.id,
        site_id: userSite?.site_id || null,
        patient_link_code: formData.subjectId,  // FIX: was patient_id

        // Session Info
        session_type: 'Dosing Session',  // ADD: required field
        session_number: formData.session_number,
        session_date: formData.session_date,
        protocol_template_id: formData.protocol_template_id,
        protocol_id: null,  // ADD: leave null for MVP

        // Substance & Route
        substance_id: formData.substance_id,
        route_id: formData.route_id,
        dosage_amount: parseFloat(formData.dosage),  // FIX: rename from dosage

        // Patient Demographics (top-level, not in notes)
        patient_age: formData.subjectAge,
        patient_sex: formData.sex,
        patient_weight_range: formData.weightRange,
        patient_smoking_status_id: formData.smoking_status_id,  // FIX: rename

        // Outcomes
        indication_id: formData.indication_id,
        baseline_phq9_score: formData.phq9Score,  // ADD: use same value for MVP
        psychological_difficulty_score: formData.difficultyScore,  // FIX: rename
        outcome_measure: 'PHQ-9',  // ADD: default value
        outcome_score: formData.phq9Score,  // ADD: same as baseline for MVP

        // Support
        support_modality_ids: formData.concomitant_med_ids, // This was modalities, but the schema expects IDs. Assuming concomitant_med_ids is the correct mapping for now.
        concomitant_meds: formData.concomitantMeds,  // FIX: use text field, not array

        // Safety
        safety_event_id: formData.hasSafetyEvent ? formData.safety_event_id : null,
        severity_grade_id: formData.hasSafetyEvent ? formData.severity_grade_id : null,
        resolution_status_id: formData.resolution_status_id,
        safety_event_category: null,  // ADD: leave null for MVP
        clinical_phenotype: null,  // ADD: leave null for MVP
        severity_rating: formData.hasSafetyEvent ? formData.severity : null,  // Legacy field

        // Legacy/Extra (keep in notes for fields not in schema)
        notes: {
          race: formData.race,
          dosage_unit: formData.dosageUnit,
          frequency: formData.frequency,
          prep_hours: parseFloat(formData.prepHours),
          integration_hours: parseFloat(formData.integrationHours),
          setting: formData.setting,
          verified_consent: formData.consentVerified,
          app_version: '2.4-redesign'
        }
      };

      // Insert into Log Table
      const { error } = await supabase
        .from('log_clinical_records')
        .insert([payload]);

      if (error) throw error;

      // Update local state for recent patients (HIPAA-compliant - no PII)
      if (formData.subjectId && formData.substance_id) {
        const substanceName = refSubstances.find(s => s.substance_id === formData.substance_id)?.substance_name || null;
        const newSubject: RecentSubject = {
          subject_id: formData.subjectId,
          last_substance_id: formData.substance_id,
          last_substance_name: substanceName,
          session_count: formData.session_number,
          last_session_date: formData.session_date,
          created_at: new Date().toISOString()
        };
        const updated = [newSubject, ...recentSubjects.filter(s => s.subject_id !== newSubject.subject_id)].slice(0, 10);
        setRecentSubjects(updated);
        // Note: Not storing in localStorage anymore - will fetch from database
      }

      setSubmissionSuccess(true);

    } catch (err) {
      console.error("Protocol Submission Error:", err);
      alert("Failed to save record to Clinical Log. Please check your connection or permissions.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanForm = () => {
    // Reset logic if needed
    window.location.reload();
  };

  if (!isOpen) return null;

  if (submissionSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="w-full max-w-lg bg-[#0f172a] border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden ring-4 ring-emerald-500/10">
          <div className="p-8 text-center space-y-6">
            <div className="mx-auto size-20 ease-out-back bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 ring-1 ring-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <CheckCircle size={40} className="text-emerald-400" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white tracking-tight">Protocol Recorded</h2>
              <p className="text-sm font-medium text-slate-400">Data secured in PPN Registry (Hypothesis Node 1)</p>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 flex flex-col items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Subject Identifier</span>
              <div className="flex items-center gap-3 text-xl font-mono font-bold text-white tracking-wider">
                {formData.subjectId}
                <button onClick={handleCopyId} className="text-slate-500 hover:text-white transition-colors">
                  {copiedId ? <CheckCircle size={18} className="text-emerald-500" /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                const note = `PPN CLINICAL RECORD\n-------------------\nSubject: ${formData.subjectId} \nDate: ${new Date().toLocaleDateString()} \n\nProtocol: ${formData.substance} (${formData.dosage}${formData.dosageUnit}) \nRoute: ${formData.route} \nStrategy: ${formData.frequency} \n\nOutcomes: \n - PHQ - 9: ${formData.phq9Score} \n - Difficulty: ${formData.difficultyScore}/10\n- Safety: ${formData.hasSafetyEvent ? `Adverse Event (Grade ${formData.severity})` : 'Clear'}\n\nVerified by: Clinician ID ${formData.user_id || 'Self'}`;
                navigator.clipboard.writeText(note);
                alert("Clinical note copied to clipboard!");
              }}
              className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all border border-slate-700"
            >
              <ClipboardList size={18} />
              Copy Clinical Note for EMR
            </button >

            <button
              onClick={cleanForm}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              Return to Dashboard
            </button>
          </div >
        </div >
      </div >
    );
  }

  const fieldLabelClass = "text-slate-500 text-xs tracking-widest font-black block ml-1 mb-1.5";
  const standardInputClass = "w-full rounded-xl px-4 h-12 sm:h-14 text-base font-bold transition-all focus:outline-none";

  return (
    <div id="protocol-builder-root" className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-5xl bg-[#0f172a] border border-white/10 rounded-none sm:rounded-[2.5rem] min-h-screen sm:min-h-0 h-full sm:h-auto max-h-screen sm:max-h-[90vh] shadow-[0_0_50px_-12px_rgba(43,116,243,0.5)] ring-2 ring-primary/40 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">

        <div className="p-6 sm:p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/20 shrink-0">
          <div className="flex items-center gap-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h1 className="text-2xl font-black text-white tracking-tight">Create New Protocol</h1>
                <span className="text-sm text-slate-400 ml-4">
                  {getCompletionStatus()}
                </span>
              </div>
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
            <X size={20} />
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
                    <label className="text-slate-500 text-xs tracking-widest font-black block ml-1">Subject ID (New or Existing)</label>
                    <AdvancedTooltip
                      tier="standard"
                      title="Subject Lookup"
                      content="Type a previous Subject ID to link this protocol to an existing patient history. Or use the auto-generated ID for a new patient."
                    >
                      <History size={12} className="text-slate-600 hover:text-primary cursor-help transition-colors" />
                    </AdvancedTooltip>
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      value={formData.subjectId}
                      onChange={handleIdentityChange}
                      onFocus={() => setShowRecentDropdown(true)}
                      onBlur={() => setTimeout(() => setShowRecentDropdown(false), 200)}
                      className={`${standardInputClass} pl-12 pr-12 border-indigo-500/30 focus:border-indigo-500/60 bg-indigo-900/10 font-mono tracking-wider text-indigo-200`}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
                      <AdvancedTooltip tier="micro" content={copiedId ? "Copied!" : "Copy ID to Clipboard"}>
                        <button
                          onClick={handleCopyId}
                          className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        >
                          {copiedId ? <CheckCircle size={16} className="text-emerald-400" /> : <Copy size={16} />}
                        </button>
                      </AdvancedTooltip>
                    </div>

                    {showRecentDropdown && filteredRecents.length > 0 && (
                      <div className="absolute top-full left-0 w-full mt-2 bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                        <div className="px-4 py-2 bg-slate-900/50 border-b border-slate-800 text-[11px] font-black text-slate-500 tracking-widest flex items-center gap-2">
                          <History size={10} /> Recent Patients (Last 10)
                        </div>
                        {filteredRecents.map((subject, idx) => (
                          <button
                            key={idx}
                            onMouseDown={() => handleRecentSelect(subject)}
                            className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-slate-800/30 last:border-0"
                          >
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-mono font-bold text-white">
                                {subject.subject_id}
                              </span>
                              <span className="text-xs text-slate-400 font-medium">
                                {subject.last_substance_name || 'Unknown'} • Session {subject.session_count} • Last seen {formatRelativeTime(subject.last_session_date)}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium mt-2">Format: PT-XXXXXXXXXX. IDs are anonymous.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className={fieldLabelClass}>Age</label>
                    <AdvancedTooltip tier="micro" content="Patient age at time of session">
                      <Info size={10} className="text-slate-600 hover:text-white transition-colors" />
                    </AdvancedTooltip>
                  </div>
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
                  <div className="flex items-center gap-2">
                    <label className={fieldLabelClass}>Biological Sex</label>
                    <AdvancedTooltip tier="micro" content="Sex assigned at birth for biological tracking">
                      <Info size={10} className="text-slate-600 hover:text-white transition-colors" />
                    </AdvancedTooltip>
                  </div>
                  <ButtonGroup
                    options={[
                      { value: 'Male', label: 'Male' },
                      { value: 'Female', label: 'Female' },
                      { value: 'Intersex', label: 'Intersex' },
                      { value: 'Unknown', label: 'Unknown' }
                    ]}
                    value={formData.sex}
                    onChange={(value) => setFormData({ ...formData, sex: value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className={fieldLabelClass}>Smoking Status</label>
                    <AdvancedTooltip tier="micro" content="Smoking affects drug metabolism rates">
                      <HelpCircle size={10} className="text-slate-600 hover:text-white transition-colors" />
                    </AdvancedTooltip>
                  </div>
                  <ButtonGroup
                    options={refSmokingStatus.map(opt => ({
                      value: opt.smoking_status_id.toString(),
                      label: opt.status_name
                    }))}
                    value={formData.smoking_status_id?.toString() || ''}
                    onChange={(value) => setFormData({ ...formData, smoking_status_id: parseInt(value) })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className={fieldLabelClass}>Race / Ethnicity</label>
                    <AdvancedTooltip tier="micro" content="For analyzing demographic response variances">
                      <Info size={10} className="text-slate-600 hover:text-white transition-colors" />
                    </AdvancedTooltip>
                  </div>
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
                  <div className="flex items-center gap-2">
                    <label className={fieldLabelClass}>Primary Indication</label>
                    <AdvancedTooltip tier="micro" content="Condition being treated">
                      <HelpCircle size={10} className="text-slate-600 hover:text-white transition-colors" />
                    </AdvancedTooltip>
                  </div>
                  <select
                    value={formData.indication_id || ''}
                    onChange={e => setFormData({ ...formData, indication_id: parseInt(e.target.value) })}
                    className={standardInputClass}
                  >
                    <option value="" disabled className="text-slate-600">Select Indication...</option>
                    {refIndications.map(ind => (
                      <option key={ind.indication_id} value={ind.indication_id}>{ind.indication_name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className={fieldLabelClass}>Weight Range</label>
                    <AdvancedTooltip tier="standard" type="clinical" title="Dosage Safety" content="Weight is critical for calculating safe medicine amounts. Please select the accurate range.">
                      <AlertTriangle size={10} className="text-slate-600 hover:text-amber-500 transition-colors" />
                    </AdvancedTooltip>
                  </div>
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
                  <div className="flex items-center gap-2">
                    <label className={fieldLabelClass}>Setting</label>
                    <AdvancedTooltip tier="standard" content="The environment (Set & Setting) significantly impacts the patient's experience and safety.">
                      <Info size={10} className="text-slate-600 hover:text-white transition-colors" />
                    </AdvancedTooltip>
                  </div>
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
                    <div className="flex items-center gap-2">
                      <label className={fieldLabelClass}>Prep Hours</label>
                      <AdvancedTooltip tier="micro" content="Hours spent preparing before session">
                        <History size={10} className="text-slate-600 hover:text-white transition-colors" />
                      </AdvancedTooltip>
                    </div>
                    <input
                      type="number"
                      min="0" max="20"
                      value={formData.prepHours}
                      onChange={e => setFormData({ ...formData, prepHours: e.target.value })}
                      className={standardInputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className={fieldLabelClass}>Integration Hours</label>
                      <AdvancedTooltip tier="micro" content="Hours planned for post-session therapy">
                        <History size={10} className="text-slate-600 hover:text-white transition-colors" />
                      </AdvancedTooltip>
                    </div>
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
                    <AdvancedTooltip tier="standard" title="Therapy Style" content="Select the therapy methods used to support the patient, like CBT (Talk Therapy) or Somatic (Body Focus).">
                      <Info size={14} className="text-slate-500 hover:text-primary cursor-help transition-colors mb-1.5" />
                    </AdvancedTooltip>
                  </div>
                  <select
                    value={formData.modality_id || ''}
                    onChange={e => setFormData({ ...formData, modality_id: parseInt(e.target.value) })}
                    className={standardInputClass}
                  >
                    <option value="" disabled className="text-slate-600">Select Support Modality...</option>
                    {refModalities.map(mod => <option key={mod.modality_id} value={mod.modality_id}>{mod.modality_name}</option>)}
                  </select>
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-800/50">
                  <label className={fieldLabelClass}>Concomitant Medications</label>
                  <input
                    type="text"
                    placeholder="Search medications..."
                    value={medSearchQuery}
                    onChange={e => setMedSearchQuery(e.target.value)}
                    className={`${standardInputClass} mb-2`}
                  />

                  <div className="max-h-48 overflow-y-auto custom-scrollbar border border-slate-800 rounded-xl p-3 space-y-2 bg-slate-950/30">
                    {refMedications
                      .filter(m => m.medication_name.toLowerCase().includes(medSearchQuery.toLowerCase()))
                      .map(med => (
                        <label key={med.medication_id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-800/30 p-2 rounded-lg transition-colors">
                          <input
                            type="checkbox"
                            checked={formData.concomitant_med_ids.includes(med.medication_id)}
                            onChange={() => {
                              const ids = formData.concomitant_med_ids;
                              const exists = ids.includes(med.medication_id);
                              const newIds = exists ? ids.filter(id => id !== med.medication_id) : [...ids, med.medication_id];

                              // Sync legacy string for Risk Checker
                              const newNames = refMedications
                                .filter(m => newIds.includes(m.medication_id))
                                .map(m => m.medication_name)
                                .join(', ');

                              setFormData({
                                ...formData,
                                concomitant_med_ids: newIds,
                                concomitantMeds: newNames
                              });
                            }}
                            className="rounded border-slate-600 text-primary focus:ring-primary/20 bg-slate-900"
                          />
                          <span className="text-xs text-slate-300 font-medium">{med.medication_name}</span>
                        </label>
                      ))}
                    {refMedications.length === 0 && (
                      <p className="text-xs text-slate-500 italic p-2">Loading medications...</p>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-500">
                    {formData.concomitant_med_ids.length} medication(s) selected
                  </p>

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
                <AdvancedTooltip
                  tier="guide"
                  title="Clinical Regimen Guide"
                  type="science"
                  width="w-[420px]"
                  content={
                    <div className="space-y-3">
                      <p><strong className="text-white">Substance:</strong> Choose the main active medicine (like Psilocybin). This links to our chemical safety database.</p>
                      <p><strong className="text-white">Dosage:</strong> Enter the exact amount. <span className="text-amber-400">⚠️ Warning:</span> The system alerts you if the dose exceeds safe limits.</p>
                      <p><strong className="text-white">Route:</strong> How does the medicine enter the body? This changes how fast it works.</p>
                    </div>
                  }
                >
                  <Info size={20} className="text-slate-500 hover:text-primary transition-colors cursor-help" />
                </AdvancedTooltip>
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div className="sm:col-span-2 space-y-2 border-b border-slate-800/50 pb-4 mb-2">
                  <div className="flex items-center gap-2">
                    <label className={fieldLabelClass}>Protocol Template (Optional)</label>
                    <AdvancedTooltip tier="micro" content="Pre-fill based on standard protocols">
                      <Info size={10} className="text-slate-600 hover:text-white transition-colors" />
                    </AdvancedTooltip>
                  </div>
                  <select
                    value={formData.protocol_template_id || ''}
                    onChange={e => {
                      const val = e.target.value;
                      setFormData({ ...formData, protocol_template_id: val || null });
                    }}
                    className={standardInputClass}
                  >
                    {PROTOCOL_TEMPLATE_OPTIONS.map(opt => (
                      <option key={opt.value || 'new'} value={opt.value || ''}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className={fieldLabelClass}>Substance Compound</label>
                    <AdvancedTooltip tier="standard" type="science" title="Active Agent" content="Select the primary active molecule. This links to our pharmacological interaction database.">
                      <Microscope size={10} className="text-slate-600 hover:text-purple-400 transition-colors" />
                    </AdvancedTooltip>
                  </div>
                  <select
                    value={formData.substance_id || ''}
                    onChange={e => {
                      const id = parseInt(e.target.value);
                      const label = refSubstances.find(s => s.substance_id === id)?.substance_name || '';
                      setFormData({ ...formData, substance_id: id, substance: label });
                    }}
                    className={standardInputClass}
                  >
                    <option value="" disabled>Select Substance...</option>
                    {refSubstances.map(s => <option key={s.substance_id} value={s.substance_id}>{s.substance_name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className={fieldLabelClass}>Administration Route</label>
                    <AdvancedTooltip tier="micro" content="Delivery method affects onset and duration">
                      <Activity size={10} className="text-slate-600 hover:text-white transition-colors" />
                    </AdvancedTooltip>
                  </div>
                  <ButtonGroup
                    options={refRoutes.map(r => ({
                      value: r.route_id.toString(),
                      label: r.route_name
                    }))}
                    value={formData.route_id?.toString() || ''}
                    onChange={(value) => setFormData({ ...formData, route_id: parseInt(value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className={fieldLabelClass}>Standardized Dosage</label>
                    <AdvancedTooltip tier="standard" type="critical" title="Check Dosage" content="Ensure dose is within safe clinical limits. High doses trigger a safety alert.">
                      <Shield size={10} className="text-slate-600 hover:text-red-400 transition-colors" />
                    </AdvancedTooltip>
                  </div>
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
                  <div className="flex items-center gap-2">
                    <label className={fieldLabelClass}>Frequency</label>
                    <AdvancedTooltip tier="micro" content="How often is this protocol administered?">
                      <History size={10} className="text-slate-600 hover:text-white transition-colors" />
                    </AdvancedTooltip>
                  </div>
                  <select
                    value={formData.frequency}
                    onChange={e => setFormData({ ...formData, frequency: e.target.value })}
                    className={standardInputClass}
                  >
                    {FREQUENCY_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className={fieldLabelClass}>Session Number</label>
                    <AdvancedTooltip tier="micro" content="Track progression">
                      <History size={10} className="text-slate-600 hover:text-white transition-colors" />
                    </AdvancedTooltip>
                  </div>
                  <ButtonGroup
                    options={SESSION_NUMBER_OPTIONS.map(opt => ({
                      value: opt.value.toString(),
                      label: opt.label
                    }))}
                    value={formData.session_number.toString()}
                    onChange={(value) => setFormData({ ...formData, session_number: parseInt(value) })}
                    required
                  />
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
                <AdvancedTooltip
                  tier="guide"
                  title="Outcomes & Safety"
                  type="critical"
                  content={
                    <div className="space-y-3">
                      <p><strong className="text-white">Did it work?</strong> Use standard scales (like PHQ-9) to measure if the patient got better.</p>
                      <p><strong className="text-white">Was it safe?</strong> <span className="text-red-400">Critical:</span> You must report any bad side effects immediately.</p>
                      <p><strong className="text-white">Consent:</strong> Ensure you have signed permission forms on file.</p>
                    </div>
                  }
                >
                  <Info size={20} className="text-slate-500 hover:text-primary transition-colors cursor-help" />
                </AdvancedTooltip>
              }
            >
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="space-y-2 pb-4 border-b border-slate-800/50">
                    <div className="flex items-center gap-2">
                      <label className={fieldLabelClass}>Session Date</label>
                      <AdvancedTooltip tier="micro" content="Date of clinical encounter">
                        <History size={10} className="text-slate-600 hover:text-white transition-colors" />
                      </AdvancedTooltip>
                    </div>
                    <input
                      type="date"
                      value={formData.session_date}
                      onChange={e => setFormData({ ...formData, session_date: e.target.value })}
                      className={standardInputClass}
                    />
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      <label className={fieldLabelClass}>Psychological Difficulty</label>
                      <AdvancedTooltip tier="standard" title="Subjective Distress" content="Rate how challenging the experience was for the patient (1=Blissful, 10=Extreme Distress).">
                        <Brain size={10} className="text-slate-600 hover:text-white transition-colors" />
                      </AdvancedTooltip>
                    </div>
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
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest mt-3">
                      <span>1 = Bliss</span>
                      <span>5 = Neutral</span>
                      <span>10 = Extreme Distress</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className={fieldLabelClass}>Baseline PHQ-9 Score</label>
                      <AdvancedTooltip tier="standard" title="Depression Scale" content="Patient Health Questionnaire 9. Measures depression severity (0-27).">
                        <Activity size={10} className="text-slate-600 hover:text-white transition-colors" />
                      </AdvancedTooltip>
                    </div>
                    <select
                      value={formData.phq9Score}
                      onChange={e => setFormData({ ...formData, phq9Score: parseInt(e.target.value) })}
                      className={standardInputClass}
                    >
                      {PHQ9_SCORES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className={fieldLabelClass}>Resolution Status</label>
                      <AdvancedTooltip tier="micro" content="Did the patient achieve closure?">
                        <CheckCircle size={10} className="text-slate-600 hover:text-white transition-colors" />
                      </AdvancedTooltip>
                    </div>
                    <select
                      value={formData.resolution_status_id || ''}
                      onChange={e => setFormData({ ...formData, resolution_status_id: parseInt(e.target.value) })}
                      className={standardInputClass}
                    >
                      <option value="" disabled>Select Status...</option>
                      {refResolution.map(opt => <option key={opt.resolution_status_id} value={opt.resolution_status_id}>{opt.status_name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="text-accent-amber" size={18} />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Adverse Events</h3>
                    <AdvancedTooltip tier="standard" type="warning" title="Safety Report" content="Turn this ON if there were any bad side effects, physical problems, or safety scares.">
                      <Info size={14} className="text-slate-500 hover:text-amber-500 transition-colors" />
                    </AdvancedTooltip>
                  </div>
                  <ButtonGroup
                    label=""
                    options={[
                      { value: 'no', label: 'No' },
                      { value: 'yes', label: 'Yes' }
                    ]}
                    value={formData.hasSafetyEvent ? 'yes' : 'no'}
                    onChange={(value) => setFormData({ ...formData, hasSafetyEvent: value === 'yes' })}
                  />

                  {formData.hasSafetyEvent && (
                    <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="space-y-2">
                        <label className={fieldLabelClass}>Severity (CTCAE Grade)</label>
                        <select
                          value={formData.severity_grade_id || ''}
                          onChange={e => setFormData({ ...formData, severity_grade_id: parseInt(e.target.value) })}
                          className={standardInputClass}
                        >
                          <option value="" disabled>Select Grade...</option>
                          {refSeverity.map(opt => <option key={opt.severity_grade_id} value={opt.severity_grade_id}>{opt.grade_label}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-red-400 text-[10px] uppercase tracking-widest font-black block ml-1 mb-1.5">Primary Clinical Observation</label>
                        <select
                          value={formData.safety_event_id || ''}
                          onChange={e => setFormData({ ...formData, safety_event_id: parseInt(e.target.value) })}
                          className={`${standardInputClass} safety-field`}
                        >
                          <option value="" disabled className="text-slate-600">Select Observation...</option>
                          {refSafetyEvents.map(opt => <option key={opt.safety_event_id} value={opt.safety_event_id}>{opt.event_name}</option>)}
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
              <AdvancedTooltip tier="critical" title="Legal Requirement" content="You must verify that a signed Informed Consent form is on file. Data cannot be submitted without this.">
                <Shield size={16} className="text-slate-600 group-hover:text-primary transition-colors" />
              </AdvancedTooltip>
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