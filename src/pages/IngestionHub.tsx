import React, { useState } from 'react';

import { PageContainer } from '../components/layouts/PageContainer';
import { Section } from '../components/layouts/Section';

const IngestionHub: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const pendingJobs = [
    { id: 'JOB-9921', source: 'St. Mary\'s PDF', type: 'Legacy OCR', status: 'Processing', time: '2m ago' },
    { id: 'JOB-9922', source: 'Voice_Node_0x4', type: 'Neural Dictation', status: 'Verifying', time: '5m ago' },
    { id: 'JOB-9923', source: 'Legacy_Archive_V4', type: 'Legacy OCR', status: 'Pending', time: '12m ago' },
  ];

  return (
    <PageContainer className="p-6 sm:p-10 space-y-10 animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-24">
      {/* Header Section */}
      <Section spacing="tight" className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3 text-primary">
            <span className="material-symbols-outlined text-4xl">upload_file</span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-slate-300">Registry Upload</h1>
          </div>
          <p className="text-slate-500 text-sm font-black uppercase tracking-[0.3em] ml-1">Institutional Data Contribution // Registry Node 0x7</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center gap-3 shadow-xl backdrop-blur-md">
            <div className="size-2 rounded-full bg-clinical-green animate-pulse"></div>
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">Uplink: Nominal</span>
          </div>
        </div>
      </Section>

      {/* Main Grid: Modules */}
      <Section spacing="default" className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Module 1: Legacy Chart OCR */}
        <section className="bg-black border border-slate-800 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-8xl">document_scanner</span>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-300 tracking-tight">Legacy Chart OCR</h2>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Digital extraction from physical clinical records</p>
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              className={`min-h-[280px] border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all duration-300 gap-4 ${isDragging ? 'border-primary bg-primary/5 scale-[0.99]' : 'border-slate-800 bg-slate-900/20'
                }`}
            >
              <div className="size-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 group-hover:text-primary group-hover:border-primary/50 transition-all">
                <span className="material-symbols-outlined text-4xl">add_a_photo</span>
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-slate-300">Drop PDF or Images here</p>
                <p className="text-sm text-slate-600 font-bold uppercase mt-1">or click to browse local archive</p>
              </div>
              <button className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-sm font-black text-slate-300 rounded-xl uppercase tracking-widest transition-all">
                Select Files
              </button>
            </div>

            <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-xl">info</span>
              <p className="text-sm font-bold text-slate-500 leading-relaxed uppercase tracking-tight">
                Privacy Guard: All uploaded documents are automatically de-identified at the edge before storage. PHI is never cached in cleartext.
              </p>
            </div>
          </div>
        </section>

        {/* Module 2: Neural Dictation */}
        <section className="bg-black border border-slate-800 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-8xl">psychology</span>
          </div>

          <div className="space-y-8 relative z-10 h-full flex flex-col">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-300 tracking-tight">Neural Dictation</h2>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Real-time voice-to-protocol synthesis</p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center space-y-10 py-4">
              <div className="relative">
                {isRecording && (
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse scale-150"></div>
                )}
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`size-32 rounded-full border-4 flex items-center justify-center transition-all duration-500 relative z-10 shadow-2xl ${isRecording
                    ? 'bg-red-500 border-red-400/50 shadow-red-500/30'
                    : 'bg-slate-900 border-slate-800 hover:border-primary/50 text-slate-500 hover:text-primary'
                    }`}
                >
                  <span className={`material-symbols-outlined text-5xl ${isRecording ? 'animate-bounce' : ''}`}>
                    {isRecording ? 'mic_off' : 'mic'}
                  </span>
                </button>
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm font-black text-slate-300 uppercase tracking-widest">
                  {isRecording ? 'Capturing Session Audio...' : 'Initialize Dictation'}
                </p>
                <p className="text-sm text-slate-600 font-bold uppercase tracking-[0.3em]">Institutional HIPAA Buffer Active</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-sm font-black text-slate-300 uppercase tracking-widest transition-all hover:text-slate-300">
                Input Settings
              </button>
              <button className="flex-1 py-4 bg-primary hover:bg-blue-600 text-slate-300 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/10 transition-all active:scale-95">
                Review Lexicon
              </button>
            </div>
          </div>
        </section>

      </Section>

      {/* Upload Queue Section */}
      <Section spacing="default" className="bg-black border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/20">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">analytics</span>
            <h3 className="text-base font-black text-slate-300 tracking-tight">Upload Queue</h3>
          </div>
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Sync_ID: 0x77AF</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800/50">
                <th className="px-8 py-5">Job Reference</th>
                <th className="px-8 py-5">Source Node</th>
                <th className="px-8 py-5">Ingestion Type</th>
                <th className="px-8 py-5">Current Status</th>
                <th className="px-8 py-5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {pendingJobs.map((job) => (
                <tr key={job.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="text-sm font-mono font-black text-slate-300 tracking-tight">{job.id}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-slate-300 group-hover:text-slate-300 transition-colors uppercase">{job.source}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-primary">
                        {job.type.includes('OCR') ? 'document_scanner' : 'mic'}
                      </span>
                      <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{job.type}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`size-1.5 rounded-full ${job.status === 'Processing' ? 'bg-primary animate-pulse' : job.status === 'Verifying' ? 'bg-accent-amber' : 'bg-slate-700'}`}></div>
                      <span className={`text-xs font-black uppercase tracking-tighter ${job.status === 'Processing' ? 'text-primary' : 'text-slate-500'}`}>{job.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="text-xs font-mono text-slate-600">{job.time}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-6 bg-slate-900/10 border-t border-slate-800 flex justify-between items-center">
          <p className="text-sm font-bold text-slate-600 uppercase tracking-widest italic">
            Note: Records remain in pending state for 24h allowing for practitioner manual review before final registry sync.
          </p>
          <button className="text-sm font-black text-primary hover:text-slate-300 uppercase tracking-widest transition-colors flex items-center gap-2">
            View All Jobs
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </Section>
    </PageContainer>
  );
};

export default IngestionHub;