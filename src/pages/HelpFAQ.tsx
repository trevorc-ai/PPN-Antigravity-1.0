
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
      q: "Why can't I enter notes in the Protocol Builder?",
      a: (
        <span>
          To maintain Zero-PHI compliance, we do not allow free-text entry. This prevents accidental sharing of patient identifiers.
          <br /><br />
          Need a specific field? <a href="mailto:features@ppn.portal?subject=Feature%20Request%20-%20PPN%20Portal" className="text-primary hover:underline font-bold">Click here</a> to request a feature.
        </span>
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
    <div className="min-h-screen bg-[#06090F] text-slate-300 font-sans pb-20">
      {/* Hero Section with Radial Gradient */}
      <div className="relative pt-24 pb-20 px-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(43,116,243,0.15),transparent_70%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl font-bold text-slate-200 mb-6 tracking-tight">How can we help you?</h1>
          <p className="text-slate-400 text-lg mb-10">Search for articles, clinical codes, or report system errors directly to our engineering team.</p>

          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help topics..."
              className="w-full bg-[#0D121C] border border-slate-800 rounded-lg py-4 px-14 text-slate-300 focus:outline-none focus:border-primary transition-all shadow-xl"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-3000" size={20} />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-blue-600 text-slate-300 px-4 py-2 sm:px-6 rounded-md font-medium transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      <PageContainer width="default">
        {/* Topic Categories Section */}
        <Section spacing="default" className="mb-20">
          <h2 className="text-xl font-semibold text-slate-200 mb-8 ml-1">Topic Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                onClick={() => handleCategoryClick(cat.title)}
                className={`bg-[#0D121C] border p-8 rounded-xl transition-all cursor-pointer group shadow-sm ${selectedCategory === cat.title
                  ? 'border-primary shadow-[0_0_15px_rgba(43,116,243,0.15)]'
                  : 'border-slate-800/60 hover:border-slate-700'
                  }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-colors ${selectedCategory === cat.title ? 'bg-primary/20' : 'bg-primary/10 group-hover:bg-primary/20'
                  }`}>
                  {cat.icon}
                </div>
                <h3 className="text-slate-200 font-semibold text-lg mb-3">{cat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed font-normal">{cat.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* FAQ and Sidebar Grid */}
        <Section spacing="default" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* FAQ Column (8/12) */}
          <div className="col-span-1 lg:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-slate-200 ml-1">
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
                  <div key={idx} className="border border-slate-800/80 rounded-xl bg-[#0D121C] overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <button
                      onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
                      className="w-full text-left px-8 py-5 flex justify-between items-center hover:bg-slate-800/20 transition-colors"
                    >
                      <span className="text-base font-medium text-slate-200">{faq.q}</span>
                      <ChevronDown className={`text-slate-3000 transition-transform duration-300 ${activeFAQ === idx ? 'rotate-180' : ''}`} size={18} />
                    </button>
                    {activeFAQ === idx && (
                      <div className="px-8 pb-6 text-sm text-slate-400 leading-relaxed border-t border-slate-800/40 pt-4">
                        <div className="mb-3">
                          <span className="text-[11px] font-black text-primary uppercase tracking-widest px-2 py-0.5 bg-primary/10 rounded border border-primary/20">
                            {faq.category}
                          </span>
                        </div>
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-20 text-center bg-[#0D121C] border border-dashed border-slate-800 rounded-xl">
                  <div className="text-slate-600 mb-4 flex justify-center">
                    <Search size={48} opacity={0.2} />
                  </div>
                  <p className="text-slate-3000 font-medium">No matching support articles found</p>
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
            <div className="bg-[#0D121C] border border-slate-800 p-8 rounded-xl shadow-sm">
              <h3 className="text-slate-200 font-semibold text-lg mb-2">Contact Support</h3>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed">Our team is available 24/7 for clinical emergencies and node assistance.</p>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-3 bg-[#1A2233] hover:bg-slate-700 text-slate-300 py-3 rounded-lg text-sm font-medium transition-colors border border-slate-700/50">
                  <MessageSquare size={18} /> Start Live Chat
                </button>
                <button className="w-full flex items-center justify-center gap-3 bg-[#1A2233] hover:bg-slate-700 text-slate-300 py-3 rounded-lg text-sm font-medium transition-colors border border-slate-700/50">
                  <Mail size={18} /> Email Support
                </button>
                <button className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-blue-600 text-slate-300 py-3 mt-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-900/20">
                  <Calendar size={18} /> Schedule Technical Demo
                </button>
              </div>
            </div>

            <div className="bg-[#0D121C] border border-slate-800 p-6 rounded-xl flex items-center gap-5 shadow-sm">
              <div className="relative">
                <div className="w-3 h-3 bg-clinical-green rounded-full shadow-[0_0_8px_rgba(83,210,45,0.6)]"></div>
                <div className="absolute inset-0 w-3 h-3 bg-clinical-green rounded-full animate-ping opacity-25"></div>
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-300">All Systems Operational</div>
                <div className="text-[11px] text-slate-3000 mt-1 uppercase tracking-wider">
                  Latency: <span className="text-slate-400">24ms</span> • Updated: <span className="text-slate-400">2m ago</span>
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
