
import React, { useState, useMemo } from 'react';
import { Search, Rocket, Microscope, ShieldCheck, LifeBuoy, MessageSquare, Mail, Calendar, ChevronDown } from 'lucide-react';
import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';

interface HelpFAQProps {
  onStartTour?: () => void;
}

const HelpFAQ: React.FC<HelpFAQProps> = ({ onStartTour }) => {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { title: "Getting Started", icon: <Rocket className="text-primary" size={18} />, desc: "Account setup, navigation basics, and portal onboarding." },
    { title: "Clinical Toolsets", icon: <Microscope className="text-primary" size={18} />, desc: "Research tools, patient data entry, and lab integrations." },
    { title: "Regulatory", icon: <ShieldCheck className="text-primary" size={18} />, desc: "HIPAA compliance guidelines, data privacy, and consent forms." },
    { title: "Troubleshooting", icon: <LifeBuoy className="text-primary" size={18} />, desc: "Common system errors, connection issues, and bug reporting." }
  ];

  const faqs = [
    {
      q: "Why can't I enter free-text session notes?",
      a: (
        <div className="space-y-4">
          <p>
            To maintain Zero-PHI (Protected Health Information) compliance, the PPN platform operates completely free of manual text input. We do not collect or store patient names, locations, narratives, or identifiable markers.
          </p>
          <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
            <p className="text-indigo-300 font-bold mb-1">Missing a specific clinical variable?</p>
            <p className="text-slate-400 text-sm leading-relaxed mb-3">
              Our clinical vocabulary is actively curated by a standing <strong>Advisory Board</strong> of leading psychedelic practitioners. If you encounter a substance, symptom, or protocol iteration not currently in our database, you can submit a request directly to the board for inclusion. Once approved, the new variable becomes available network-wide.
            </p>
            <button
              onClick={() => alert("Opening Vocabulary Request Form (WO-119 Integration)")}
              className="text-xs font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors flex items-center gap-1.5"
            >
              Submit Vocabulary Request <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>
        </div>
      ),
      category: "Regulatory"
    },
    {
      q: "How is the Interaction Checker validated?",
      a: "The engine uses a verified 13-point Clinical Truth Matrix sourced from PubMed and institutional trials. It specifically flags high-risk serotonergic, cardiovascular, and metabolic interactions.",
      category: "Clinical Toolsets"
    },
    {
      q: "Can I edit a Clinical Dossier after submission?",
      a: "No. All submissions are hashed and written to the immutable audit ledger. To correct an error, you must submit a new protocol version linked to the original Subject ID.",
      category: "Troubleshooting"
    },
    {
      q: "What data is visible to other nodes?",
      a: "Only de-identified, aggregated metadata (Outcome Velocity, Safety Signals) is shared. Your specific patient demographics and session notes remain encrypted on your local node.",
      category: "Getting Started"
    },
    {
      q: "Is the PDF Dossier HIPAA compliant?",
      a: "Yes. The 'Generate PDF' engine strips all UI elements and renders a clean, white-paper clinical record suitable for external Electronic Health Records (EHR).",
      category: "Clinical Toolsets"
    },
    {
      q: "Do you store patient information?",
      a: "No. We do not store any information that can identify a patient (like names, dates of birth, addresses, or contact info). We only store anonymous data points about the treatment (like 'Male, 30-35, 160lbs, treated with 25mg Psilocybin'). Think of it like a census: we count the statistics, not the people.",
      category: "Regulatory"
    },
    {
      q: "Why can't patients log in to enter their own data?",
      a: (
        <span>
          To keep the data rigorously accurate and legally safe.
          <br /><br />
          <strong>1. Data Quality:</strong> Data entered by trained practitioners is more consistent than self-reported data.
          <br />
          <strong>2. Legal Safety:</strong> By only allowing practitioners to access the system, we create a firewall. We never collect patient IP addresses or metadata.
        </span>
      ),
      category: "Regulatory"
    }
  ];

  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
      const aText = typeof faq.a === 'string' ? faq.a.toLowerCase() : '';
      const qText = faq.q.toLowerCase();

      const matchesSearch = qText.includes(searchQuery.toLowerCase()) || aText.includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  // Append new FAQs here so they render correctly
  // Note: We are modifying the array definition above in the real file, but to keep the edit clean
  // we will insert them into the `faqs` array definition.
  // Converting this to a replace block that targets the array content directly.


  const handleCategoryClick = (categoryTitle: string) => {
    if (categoryTitle === "Getting Started" && onStartTour && selectedCategory === categoryTitle) {
      onStartTour();
    }
    setSelectedCategory(prev => prev === categoryTitle ? "All" : categoryTitle);
    setActiveFAQ(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080c14] via-[#0c1220] to-[#0a0e1a] text-slate-300 font-sans pb-20">
      {/* Hero Section with Radial Gradient */}
      <div className="relative pt-24 pb-20 px-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(43,116,243,0.15),transparent_70%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl font-bold text-slate-300 mb-6 tracking-tight">How can we help you?</h1>
          <p className="text-slate-300 text-lg mb-10">Search for articles, clinical codes, or report system errors directly to our engineering team.</p>

          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help topics..."
              className="w-full bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl py-5 px-14 text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary transition-all shadow-2xl"
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-lg active:scale-95">
              Search
            </button>
          </div>
        </div>
      </div>

      <PageContainer width="default">
        {/* Topic Categories Section */}
        <Section spacing="default" className="mb-20">
          <h2 className="text-xl font-semibold text-slate-300 mb-8 ml-1">Topic Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => handleCategoryClick(cat.title)}
                className={`bg-slate-900/40 backdrop-blur-xl border p-8 rounded-3xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 ${selectedCategory === cat.title
                  ? 'border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.15)] bg-slate-800/60'
                  : 'border-slate-800 hover:border-slate-600 hover:shadow-xl'
                  }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 border ${selectedCategory === cat.title ? 'bg-indigo-500/20 border-indigo-500/30 shadow-inner' : 'bg-slate-800/50 border-slate-700/50 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20'
                  }`}>
                  <div className={selectedCategory === cat.title ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-400 transition-colors'}>
                    {cat.icon}
                  </div>
                </div>
                <h3 className="text-[#A8B5D1] font-black tracking-tight text-lg mb-3">{cat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-medium group-hover:text-slate-300 transition-colors">{cat.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* FAQ and Sidebar Grid */}
        <Section spacing="default" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* FAQ Column (8/12) */}
          <div className="col-span-1 lg:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-slate-300 ml-1">
                {selectedCategory === "All" ? "Top Frequently Asked Questions" : `${selectedCategory} Articles`}
              </h2>
              {selectedCategory !== "All" && (
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="text-sm font-black text-primary uppercase tracking-widest hover:underline"
                >
                  Clear Filter
                </button>
              )}
            </div>

            <div className="space-y-4">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, idx) => (
                  <div key={idx} className="border border-slate-800 rounded-3xl bg-slate-900/40 backdrop-blur-xl overflow-hidden hover:border-slate-600 transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300 shadow-lg">
                    <button
                      onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
                      className="w-full text-left px-8 py-6 flex justify-between items-center hover:bg-slate-800/40 transition-colors group"
                    >
                      <span className="text-base font-bold text-slate-300 group-hover:text-[#A8B5D1] transition-colors">{faq.q}</span>
                      <div className={`p-2 rounded-full transition-all duration-300 ${activeFAQ === idx ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500 group-hover:text-indigo-400 group-hover:bg-indigo-500/10'}`}>
                        <ChevronDown className={`transition-transform duration-300 ${activeFAQ === idx ? 'rotate-180' : ''}`} size={18} />
                      </div>
                    </button>
                    {activeFAQ === idx && (
                      <div className="px-8 pb-8 text-sm text-slate-300 leading-relaxed border-t border-slate-800/50 pt-6">
                        <div className="mb-4">
                          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                            {faq.category}
                          </span>
                        </div>
                        <div className="font-medium text-slate-400">
                          {faq.a}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-20 text-center bg-[#0D121C] border border-dashed border-slate-800 rounded-xl">
                  <div className="text-slate-600 mb-4 flex justify-center">
                    <Search size={48} opacity={0.2} />
                  </div>
                  <p className="text-slate-500 font-medium">No matching support articles found</p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                    className="mt-4 text-primary text-sm font-bold hover:underline"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Support Sidebar (4/12) */}
          <div className="col-span-1 lg:col-span-4 space-y-6">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-lg relative overflow-hidden group hover:border-slate-600 transition-colors">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <h3 className="text-[#A8B5D1] font-black tracking-tighter text-2xl mb-2 relative z-10">Contact Support</h3>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed font-medium relative z-10">Our team is available 24/7 for clinical emergencies and node assistance.</p>

              <div className="space-y-3 relative z-10">
                <button className="w-full flex items-center justify-center gap-3 bg-slate-800/50 hover:bg-slate-700/80 text-slate-300 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border border-slate-700 hover:border-slate-500 shadow-md">
                  <MessageSquare size={16} /> Live Chat
                </button>
                <button className="w-full flex items-center justify-center gap-3 bg-slate-800/50 hover:bg-slate-700/80 text-slate-300 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border border-slate-700 hover:border-slate-500 shadow-md">
                  <Mail size={16} /> Email Support
                </button>
                <button className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white py-4 mt-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-500/20 border border-indigo-500/50 active:scale-95">
                  <Calendar size={16} /> Schedule Tech Demo
                </button>
              </div>
            </div>

            {/* Clinical Vocabulary Request Block */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-indigo-500/30 p-8 rounded-3xl shadow-[0_0_30px_rgba(99,102,241,0.1)] relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
              <div className="flex items-center gap-3 mb-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                  <span className="material-symbols-outlined text-[20px]">library_add</span>
                </div>
                <h3 className="text-[#A8B5D1] font-black tracking-tight text-lg">Curate the Network</h3>
              </div>

              <p className="text-sm text-slate-400 mb-6 leading-relaxed font-medium relative z-10">
                The PPN Data Ledger relies on an Advisory Board-managed vocabulary. Encountering variables not listed in our interface?
              </p>

              <button
                onClick={() => alert("Opening Vocabulary Request Form (WO-119 Integration)")}
                className="w-full flex items-center justify-between gap-3 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 py-3.5 px-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border border-indigo-500/30 hover:border-indigo-500/50"
              >
                <span>Request Addition</span>
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </button>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl flex items-center gap-5 shadow-lg">
              <div className="relative">
                <div className="w-3 h-3 bg-clinical-green rounded-full shadow-[0_0_12px_rgba(83,210,45,0.8)]"></div>
                <div className="absolute inset-0 w-3 h-3 bg-clinical-green rounded-full animate-ping opacity-30"></div>
              </div>
              <div className="flex flex-col">
                <div className="text-sm font-black text-[#A8B5D1] tracking-tight">All Systems Operational</div>
                <div className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest flex items-center gap-2">
                  <span>Latency: <span className="text-slate-400">24ms</span></span>
                  <span className="w-1 h-1 rounded-full bg-slate-700" />
                  <span>Updated: <span className="text-slate-400">Just now</span></span>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </PageContainer>
    </div>
  );
};

export default HelpFAQ;
