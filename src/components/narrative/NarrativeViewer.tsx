import React, { useState } from 'react';
import { FileText, Copy, Download, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import {
    GeneratedNarrative,
    copyNarrativeToClipboard,
    downloadNarrativeAsText,
} from '../../services/narrativeGenerator';

interface NarrativeViewerProps {
    narrative: GeneratedNarrative;
    className?: string;
}

export const NarrativeViewer: React.FC<NarrativeViewerProps> = ({ narrative, className = '' }) => {
    const [copied, setCopied] = useState(false);
    const [expanded, setExpanded] = useState(true);

    const handleCopy = async () => {
        const success = await copyNarrativeToClipboard(narrative);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const handleDownload = () => {
        downloadNarrativeAsText(narrative);
    };

    const generatedTime = new Date(narrative.generatedAt).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit',
    });

    return (
        <div className={`bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">Clinical Narrative</h3>
                        <p className="text-sm text-slate-500">Generated {generatedTime}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Completeness badge */}
                    <span className={`text-xs font-black px-2.5 py-1 rounded-full border uppercase tracking-widest ${narrative.completeness === 100
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : narrative.completeness >= 60
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                : 'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}>
                        {narrative.completeness}% Complete
                    </span>

                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
                        aria-label={expanded ? 'Collapse narrative' : 'Expand narrative'}
                    >
                        {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                </div>
            </div>

            {/* Body */}
            {expanded && (
                <div className="p-6 space-y-4 animate-in slide-in-from-top duration-200">
                    {/* Section-by-section display */}
                    {Object.entries(narrative.sections).map(([title, content]) => (
                        <div key={title} className="space-y-1">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</h4>
                            <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/30 rounded-xl px-4 py-3">
                                {content}
                            </p>
                        </div>
                    ))}

                    {Object.keys(narrative.sections).length === 0 && (
                        <p className="text-sm text-slate-500 italic text-center py-4">
                            No form data available yet. Complete Phase 1 forms to generate a narrative.
                        </p>
                    )}
                </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-700/50 bg-slate-900/40">
                <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${copied
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                            : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                        }`}
                >
                    {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>

                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800 transition-all"
                >
                    <Download className="w-3.5 h-3.5" />
                    Download .txt
                </button>

                <span className="ml-auto text-xs text-slate-600 font-mono">
                    Patient: {narrative.patientId}
                </span>
            </div>
        </div>
    );
};

export default NarrativeViewer;
