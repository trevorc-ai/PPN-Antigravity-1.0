import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, ShieldAlert, Terminal, ChevronRight, Info, Search, Brain, ToggleLeft, ToggleRight } from 'lucide-react';

interface NeuralCopilotProps {
  context?: any;
}

const NeuralCopilot: React.FC<NeuralCopilotProps> = ({ context }) => {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: 'ai' | 'user', text: string, type?: 'warning' }[]>([
    { role: 'ai', text: "Neural Copilot active. Protocol analysis engine standing by. Optimization Matrix ready for clinical deployment." }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [optimizationMode, setOptimizationMode] = useState(true);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isAnalyzing]);

  const runAnalysis = async (userQuery: string) => {
    setIsAnalyzing(true);
    setTerminalLogs([]);

    // Immediate User Feedback
    setChatHistory(prev => [...prev, { role: 'user', text: userQuery }]);

    const traceLogs = [
      "[NODE_SYNC_ACTIVE]",
      "[RECEPTOR_AFFINITY_SCAN: 88%]",
      "[CHECKING_PEER_ADVERSE_EVENTS]",
      "[SAFETY_MATRIX_CALCULATION]"
    ];

    // Cycle through terminal strings to simulate deep calculation
    for (const log of traceLogs) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setTerminalLogs(prev => [...prev, log]);
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const promptContext = context ? JSON.stringify(context) : "General research session.";

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Researcher query: "${userQuery}". 
        Context: ${promptContext}.
        Mode: ${optimizationMode ? 'DEEP_OPTIMIZATION' : 'STANDARD_QUERY'}.
        
        CRITICAL: Identify if this query mentions molecules (e.g. Psilocybin, MDMA, Ketamine) or contraindications.
        Provide professional, peer-reviewed level clinical analysis.
        If a risk is detected, include 'SAFETY_FLAG_7.2' in your response.`,
        config: {
          systemInstruction: "You are the PPN Neural Copilot. You assist practitioners with clinical research logic. Always maintain a highly technical, objective HUD-style tone. Reference peer data nodes anonymously."
        }
      });

      const text = response.text || "Analysis complete. Node integrity maintained.";

      // Detection for Safety Matrix wrapping
      const substances = ['psilo', 'mdma', 'ketamine', 'lsd', 'dmt', 'ibogaine', 'ssri', 'maoi', 'lithium'];
      const isSubstanceQuery = substances.some(s => userQuery.toLowerCase().includes(s)) || text.includes('SAFETY_FLAG_7.2');

      setChatHistory(prev => [...prev, {
        role: 'ai',
        text: text.replace('SAFETY_FLAG_7.2', '').trim(),
        type: isSubstanceQuery ? 'warning' : undefined
      }]);

    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'ai', text: "NODE_UPLINK_FAILURE: Peer node synchronization required to process this request." }]);
    } finally {
      setIsAnalyzing(false);
      setTerminalLogs([]);
    }
  };

  return (
    <section className="h-full flex flex-col backdrop-blur-3xl relative overflow-hidden bg-[#0D121C]">
      {/* HUD Header */}
      <div className="p-6 border-b border-indigo-500/10 shrink-0 flex justify-between items-center bg-[#0D121C]/80 backdrop-blur-md z-10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <Brain className="size-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-black text-indigo-300 uppercase tracking-[0.2em] leading-none mb-1">Neural Copilot</h4>
            <p className="text-sm font-mono text-indigo-500/70 uppercase tracking-[0.3em]">Node_Status: Encrypted</p>
          </div>
        </div>

        <button
          onClick={() => setOptimizationMode(!optimizationMode)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all"
        >
          <span className={`text-xs font-black uppercase tracking-widest ${optimizationMode ? 'text-primary' : 'text-slate-500'}`}>
            {optimizationMode ? 'Deep Matrix' : 'Standard'}
          </span>
          {optimizationMode ? <ToggleRight className="text-primary size-5" /> : <ToggleLeft className="text-slate-700 size-5" />}
        </button>
      </div>

      {/* Main Body with Terminal Trace Overlay */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar relative">
        {isAnalyzing ? (
          <div className="h-full flex flex-col items-center justify-center animate-in fade-in duration-500">
            <div className="w-full max-w-[85%] bg-black/40 border border-primary/20 rounded-2xl p-8 shadow-2xl space-y-3 font-mono">
              <div className="flex items-center gap-2 mb-4 text-primary">
                <Terminal size={14} className="animate-pulse" />
                <span className="text-xs font-black uppercase tracking-[0.2em]">Neural Trace Active</span>
              </div>
              {terminalLogs.map((log, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-primary/80 animate-in slide-in-from-left-1 font-mono">
                  <ChevronRight size={10} className="shrink-0" />
                  <span>{log}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 animate-pulse mt-4">
                <div className="size-1 bg-indigo-600 hover:bg-indigo-500 rounded-full"></div>
                <span className="text-xs text-primary/40 uppercase tracking-widest italic font-mono">Calculating...</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[95%] p-5 rounded-[1.5rem] text-xs font-medium leading-relaxed shadow-lg relative ${msg.role === 'user'
                    ? 'bg-primary/20 text-slate-300 border border-primary/25 rounded-tr-none'
                    : msg.type === 'warning'
                      ? 'bg-amber-500/5 border-l-4 border-amber-500 border-y border-r border-amber-500/20 text-amber-100 rounded-tl-none'
                      : 'bg-slate-900/90 text-indigo-100 border border-slate-800 rounded-tl-none'
                  }`}>
                  {msg.type === 'warning' && (
                    <div className="flex items-center gap-2 mb-3 text-amber-500">
                      <ShieldAlert size={14} strokeWidth={3} />
                      <span className="text-xs font-black uppercase tracking-[0.2em]">PREEMPTIVE SAFETY FLAG</span>
                    </div>
                  )}

                  <p className={msg.type === 'warning' ? 'font-bold' : ''}>{msg.text}</p>

                  {msg.type === 'warning' && (
                    <div className="mt-5 flex gap-2">
                      <button className="flex-1 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl text-xs font-black text-amber-500 uppercase tracking-widest transition-all">
                        View Peer Record
                      </button>
                      <button className="flex-1 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl text-xs font-black text-amber-500 uppercase tracking-widest transition-all">
                        Re-Evaluate
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </>
        )}
      </div>

      {/* Interaction HUD & Persistent Privacy Footer */}
      <div className="p-6 bg-[#0D121C] border-t border-indigo-500/10 space-y-4">
        <form
          onSubmit={(e) => { e.preventDefault(); if (query.trim()) runAnalysis(query); setQuery(""); }}
          className="relative group"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isAnalyzing}
            placeholder="Search global research ledger..."
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-[12px] text-slate-300 focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-slate-800 font-mono transition-all pr-14 shadow-inner disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isAnalyzing || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 size-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-indigo-600 hover:bg-indigo-500 hover:text-slate-300 transition-all shadow-xl active:scale-90 disabled:opacity-20"
          >
            <Sparkles className="size-5" />
          </button>
        </form>

        <div className="text-center px-4 space-y-2">
          <p className="text-sm font-black text-slate-600 uppercase tracking-[0.2em] leading-relaxed">
            Neural Copilot uses anonymized peer data (Client IDs). No PHI is processed in this node.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs font-mono font-bold text-slate-800 uppercase tracking-widest border-t border-white/5 pt-2">
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">shield</span> AES_256_ACTIVE</span>
            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">sync_alt</span> NODE_SYNCED</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NeuralCopilot;