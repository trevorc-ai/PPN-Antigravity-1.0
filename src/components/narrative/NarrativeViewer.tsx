import React, { useState } from 'react';
import { FileText, Copy, Download, CheckCircle, ChevronDown, ChevronUp, Save } from 'lucide-react';
import {
    GeneratedNarrative,
    copyNarrativeToClipboard,
    downloadNarrativeAsText,
} from '../../services/narrativeGenerator';

interface NarrativeViewerProps {
    narrative: GeneratedNarrative;
    className?: string;
    /** Called by "Save & Close" — closes the SlideOut panel and advances to next step */
    onClose?: () => void;
}

export const NarrativeViewer: React.FC<NarrativeViewerProps> = ({ narrative, className = '', onClose }) => {
    const [copied, setCopied] = useState(false);
    const [expanded, setExpanded] = useState(true);
    const [saved, setSaved] = useState(false);

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

    const handleSaveAndClose = () => {
        setSaved(true);
        // Brief flash then close
        setTimeout(() => onClose?.(), 700);
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
                        <h3 className="text-sm font-black text-slate-200 uppercase tracking-widest">Clinical Narrative</h3>
                        <p className="text-sm text-slate-400">Generated {generatedTime}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
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
                    {Object.entries(narrative.sections).map(([title, content]) => (
                        <div key={title} className="space-y-1">
                            <h4 className="text-sm font-black text-slate-300 uppercase tracking-widest">{title}</h4>
                            <p className="text-sm text-slate-200 leading-relaxed bg-slate-800/30 rounded-xl px-4 py-3">
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
            <div className="flex items-center gap-3 px-6 py-4 border-t border-slate-700/50 bg-slate-900/40 flex-wrap">
                {/* Back — scrolls back up (just closes expanded for now; future could go back a step) */}
                {onClose && (
                    <button
                        onClick={() => setExpanded(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white transition-all"
                        aria-label="Expand to review narrative"
                    >
                        ↑ Back
                    </button>
                )}

                {/* Copy */}
                <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${copied
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                            : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
                        }`}
                >
                    {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>

                {/* Download */}
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white transition-all"
                >
                    <Download className="w-3.5 h-3.5" />
                    Download .txt
                </button>

                {/* Save & Close — pre-illuminated emerald */}
                {onClose && (
                    <button
                        onClick={handleSaveAndClose}
                        disabled={saved}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ml-auto ${saved
                                ? 'bg-emerald-500/30 border-emerald-500/50 text-emerald-300 cursor-not-allowed'
                                : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 hover:border-emerald-400 shadow-lg shadow-emerald-900/20'
                            }`}
                    >
                        {saved ? <CheckCircle className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                        {saved ? 'Saved!' : 'Save & Close'}
                    </button>
                )}

                <span className={`text-xs text-slate-500 font-mono ${onClose ? '' : 'ml-auto'}`}>
                    Patient: {narrative.patientId}
                </span>
            </div>
        </div>
    );
};

export default NarrativeViewer;
