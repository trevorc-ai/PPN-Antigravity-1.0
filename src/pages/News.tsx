import React, { useState, useMemo } from 'react';
import { NewsArticle } from '../types';
import { NEWS_ARTICLES } from '../constants';
import ConnectFeedButton from '../components/ui/ConnectFeedButton';

import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';
import RegulatoryMosaic from '../components/analytics/RegulatoryMosaic';


const FeatureArticle: React.FC<{ article: NewsArticle }> = ({ article }) => {
  return (
    <div className="relative w-full h-[450px] sm:h-[500px] rounded-[2.5rem] overflow-hidden group mb-8 shadow-2xl border border-white/5">
      <img
        src="https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1600"
        alt="Neural background"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0e1117] via-[#0e1117]/40 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#0e1117_100%)] opacity-60"></div>

      <div className="absolute top-8 left-8 flex gap-2 z-10">
        <span className="px-3 py-1 bg-accent-amber text-black text-xs font-black uppercase tracking-widest rounded shadow-lg shadow-accent-amber/20">Breakthrough</span>
        <span className="px-3 py-1 bg-primary text-slate-300 text-xs font-black uppercase tracking-widest rounded shadow-lg shadow-primary/20">Phase III</span>
      </div>

      <div className="absolute bottom-10 left-10 right-10 z-10 space-y-4 max-w-3xl">
        <p className="text-slate-400 text-xs font-mono uppercase tracking-[0.3em] font-bold">Published May 14, 2024</p>
        <h2 className="text-4xl sm:text-5xl font-black text-slate-200 tracking-tighter leading-[1.1]">
          FDA Approves Landmark Phase III Trial for PPN-04 Compound
        </h2>
        <p className="text-slate-300 text-sm sm:text-lg font-medium leading-relaxed max-w-2xl opacity-80">
          The approval marks a significant pivot in therapeutic regulation, allowing the study of high-affinity receptors in clinical environments.
        </p>
      </div>

      {/* Decorative scanline texture */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%]"></div>
    </div>
  );
};

const NewsCard: React.FC<{ article: NewsArticle }> = ({ article }) => {
  return (
    <div className="group bg-[#1c222d]/30 border border-slate-800 rounded-[2rem] overflow-hidden flex flex-col transition-all duration-500 hover:border-primary/50 hover:bg-[#1c222d]/50">
      <div className="h-60 relative overflow-hidden shrink-0">
        <img
          src={article.imageUrl}
          alt={article.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800'; // Reliable fallback
          }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111418] via-[#111418]/20 to-transparent"></div>
        <div className="absolute bottom-4 left-6 flex items-center gap-3">
          <span className={`px-2 py-1 text-xs font-black uppercase tracking-widest rounded border ${article.category === 'Regulation' ? 'bg-primary/20 text-primary border-primary/30' :
            article.category === 'Clinical Trials' ? 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20' :
              article.category === 'Network' ? 'text-clinical-green bg-clinical-green/10 border-clinical-green/20' : 'text-slate-400 bg-slate-800/20 border-slate-700'
            }`}>
            {article.category}
          </span>
          <span className="text-xs font-mono text-slate-3000 uppercase tracking-widest">{article.timestamp}</span>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-1 gap-4">
        <h3 className="text-xl font-black text-slate-300 group-hover:text-slate-200 leading-tight tracking-tight transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-slate-3000 leading-relaxed font-medium line-clamp-3">
          {article.summary}
        </p>
        <button className="mt-auto flex items-center gap-2 text-xs font-black text-primary hover:text-slate-200 uppercase tracking-[0.2em] transition-all group/btn">
          Read Research
          <span className="material-symbols-outlined text-sm transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

const News: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>(NEWS_ARTICLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [goodNewsOnly, setGoodNewsOnly] = useState(true); // Default to Smart Filter ON
  const [sortBy, setSortBy] = useState<'recent' | 'cited'>('recent');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string | null>(null);

  const categories = ['All', 'Regulation', 'Clinical Trials', 'Industry'];

  const cycleCategory = () => {
    const currentIndex = categories.indexOf(selectedCategory);
    const nextIndex = (currentIndex + 1) % categories.length;
    setSelectedCategory(categories[nextIndex]);
  };

  // Handler for state selection from regulatory grid
  const handleStateSelect = (stateCode: string) => {
    // Map state codes to state names for search
    const stateNames: Record<string, string> = {
      'OR': 'Oregon', 'CO': 'Colorado', 'CA': 'California', 'WA': 'Washington',
      'TX': 'Texas', 'NY': 'New York', 'FL': 'Florida', 'MA': 'Massachusetts',
      'MI': 'Michigan', 'AZ': 'Arizona', 'NV': 'Nevada', 'CT': 'Connecticut'
    };
    setSelectedStateFilter(stateCode);
    setSearchQuery(stateNames[stateCode] || stateCode);
  };

  // Filter logic
  const filteredNews = useMemo(() => {
    let result = articles.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory !== 'All' ? item.category === selectedCategory : true;

      // Smart Sentiment Logic:
      let matchesSentiment = true;
      if (goodNewsOnly) {
        if (item.category === 'Regulation') {
          matchesSentiment = true; // Always show regulation
        } else if (item.isPartner || item.category === 'Network') {
          matchesSentiment = item.sentiment === 'positive';
        } else {
          matchesSentiment = item.sentiment === 'positive'; // Default other categories to positive only
        }
      }

      return matchesSearch && matchesCategory && matchesSentiment;
    });

    // Sorting
    if (sortBy === 'cited') {
      result = [...result].sort((a, b) => (b.impactScore || 0) - (a.impactScore || 0)); // Added fallback for impactScore
    }
    // Default is recent (array order)

    return result;
  }, [articles, searchQuery, selectedCategory, goodNewsOnly, sortBy]);

  return (
    <PageContainer className="animate-in fade-in duration-1000">
      <Section spacing="default" className="flex flex-col lg:flex-row gap-10">

        {/* Main Feed Section */}
        <div className="flex-1 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
            <h1 className="text-5xl font-black tracking-tighter text-slate-200">
              Intelligence Hub
            </h1>
            <ConnectFeedButton />
          </div>

          {/* Regulatory Mosaic - Integrated from standalone page */}
          <div className="mb-14">
            <RegulatoryMosaic
              onStateSelect={handleStateSelect}
              externalSelectedState={selectedStateFilter}
              showDetailPanel={false}
            />
          </div>

          {/* State Filter Indicator */}
          {selectedStateFilter && (
            <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/30 rounded-2xl">
              <span className="material-symbols-outlined text-primary">filter_alt</span>
              <span className="text-sm font-bold text-slate-300">
                Showing news for: {searchQuery}
              </span>
              <button
                onClick={() => {
                  setSelectedStateFilter(null);
                  setSearchQuery('');
                }}
                className="ml-auto text-xs font-black text-slate-400 hover:text-slate-200 uppercase tracking-widest transition-colors"
              >
                Clear Filter
              </button>
            </div>
          )}

          {articles.length > 0 && <FeatureArticle article={articles[0]} />}

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#1c222d]/40 border border-slate-800 p-2 rounded-2xl backdrop-blur-md mt-8">
            <div className="flex gap-1 p-1 bg-black/20 rounded-xl">
              <button
                onClick={() => setSortBy('recent')}
                className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${sortBy === 'recent' ? 'bg-primary text-slate-300 shadow-lg' : 'text-slate-3000 hover:text-slate-200'}`}
              >
                <span className="material-symbols-outlined text-sm">schedule</span>
                Most Recent
              </button>
              <button
                onClick={() => setSortBy('cited')}
                className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${sortBy === 'cited' ? 'bg-primary text-slate-300 shadow-lg' : 'text-slate-3000 hover:text-slate-200'}`}
              >
                <span className="material-symbols-outlined text-sm">star</span>
                Most Cited
              </button>
            </div>

            <button
              onClick={cycleCategory}
              className={`px-4 py-2.5 border rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-4 transition-all group ${selectedCategory !== 'All' ? 'bg-primary/20 border-primary text-primary' : 'bg-black/20 border-slate-800 text-slate-400 hover:text-slate-200'}`}
            >
              {selectedCategory === 'All' ? 'Compound Type' : selectedCategory}
              <span className="material-symbols-outlined text-base">expand_more</span>
            </button>

            <div className="relative flex-1 group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-lg group-focus-within:text-primary transition-colors">search</span>
              <input
                type="text"
                placeholder="Search research..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 bg-black/40 border border-slate-800 rounded-xl pl-12 pr-4 text-sm font-bold text-slate-300 focus:ring-1 focus:ring-primary placeholder:text-slate-700 transition-all"
              />
            </div>
          </div>

          <div className="space-y-6 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-primary rounded-full"></div>
              <h2 className="text-2xl font-black text-slate-200 tracking-tighter">News Feed</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredNews.map(article => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:w-[340px] shrink-0 space-y-10">

          {/* Trending Topics */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="material-symbols-outlined text-lg">trending_up</span>
              <h3 className="text-xs font-black tracking-[0.2em]">Trending Topics</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {['#Psilocybin', '#MDMA-Research', '#Neuroscience', '#PhaseIII', '#ReformBill', '#Ligands'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag.replace('#', ''))}
                  className="px-4 py-2 bg-[#1c222d] border border-slate-800 rounded-full text-xs font-bold text-slate-400 hover:text-slate-200 hover:border-primary/50 transition-all tracking-wide"
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          {/* Weekly Briefing */}
          <section className="bg-[#1c222d]/60 border border-slate-800 rounded-[2.5rem] p-10 space-y-6 relative overflow-hidden group shadow-2xl">
            <div className="space-y-2 relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-xl">mail</span>
                </div>
                <h3 className="text-sm font-black text-slate-200 tracking-[0.2em]">Weekly Briefing</h3>
              </div>
              <p className="text-xs text-slate-3000 leading-relaxed font-medium">
                Get the most critical clinical updates delivered to your inbox every Monday morning.
              </p>
            </div>
            <div className="space-y-4 relative z-10">
              <input
                type="email"
                placeholder="professional@clinic.com"
                className="w-full bg-black/40 border border-slate-800 rounded-xl h-12 px-5 text-sm font-mono text-slate-300 focus:ring-1 focus:ring-primary placeholder:text-slate-800 transition-all"
              />
              <button className="w-full py-4 bg-primary hover:bg-blue-600 text-slate-300 text-sm font-black rounded-xl uppercase tracking-[0.3em] transition-all shadow-xl shadow-primary/20 active:scale-[0.98]">
                Subscribe Now
              </button>
              <p className="text-xs text-slate-600 font-bold uppercase text-center tracking-[0.2em]">Opt-out at any time. Professional use only.</p>
            </div>
          </section>

          {/* Portal Metrics */}
          <section className="bg-[#1c222d]/30 border border-slate-800 rounded-[2.5rem] p-10 space-y-8">
            <div className="space-y-1">
              <h3 className="text-xs font-black text-slate-200 uppercase tracking-[0.2em]">Portal Metrics</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-slate-3000 uppercase tracking-widest">Active Trials</span>
                  <span className="text-[12px] font-mono font-black text-slate-300">124</span>
                </div>
                <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '82%' }}></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-slate-3000 uppercase tracking-widest">Peer Reviews</span>
                  <span className="text-[12px] font-mono font-black text-slate-300">8,402</span>
                </div>
                <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full bg-accent-orange" style={{ width: '45%', backgroundColor: '#f97316' }}></div>
                </div>
              </div>
            </div>
          </section>

          {/* Professional Context Node */}
          <div className="p-6 bg-slate-900/40 border border-slate-800/60 rounded-3xl flex items-center gap-5">
            <div className="size-12 rounded-2xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
              <span className="material-symbols-outlined text-slate-3000">verified</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Source Context</span>
              <span className="text-xs font-mono font-bold text-clinical-green uppercase">Verified Research Node</span>
            </div>
          </div>
        </aside>
      </Section>
    </PageContainer>
  );
};

export default News;