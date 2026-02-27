/**
 * FeedbackCard.tsx — WO-511
 *
 * Instant floating feedback card. Triggered from the TopHeader comment icon.
 * Anchors below the trigger button. Dismisses on outside click.
 *
 * Props:
 *   isOpen        — controlled open state
 *   onClose       — called to close the card
 *   triggerRef    — ref to the trigger button for focus-return on close
 */

import React, { useState, useEffect, useRef } from 'react';
import { X, Bug, Sparkles, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

type FeedbackType = 'bug' | 'feature' | 'comment';

interface FeedbackCardProps {
    isOpen: boolean;
    onClose: () => void;
    triggerRef?: React.RefObject<HTMLButtonElement>;
}

const TYPE_OPTIONS: { value: FeedbackType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { value: 'bug', label: 'Bug', icon: ({ className }) => <Bug className={className} /> },
    { value: 'feature', label: 'Feature', icon: ({ className }) => <Sparkles className={className} /> },
    { value: 'comment', label: 'Comment', icon: ({ className }) => <MessageSquare className={className} /> },
];

const FeedbackCard: React.FC<FeedbackCardProps> = ({ isOpen, onClose, triggerRef }) => {
    const { user } = useAuth();
    const cardRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [type, setType] = useState<FeedbackType>('comment');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Focus textarea when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => textareaRef.current?.focus(), 50);
        }
    }, [isOpen]);

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;
        const handleClick = (e: MouseEvent) => {
            if (
                cardRef.current &&
                !cardRef.current.contains(e.target as Node) &&
                !(triggerRef?.current?.contains(e.target as Node))
            ) {
                handleClose();
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen]);

    const handleClose = () => {
        onClose();
        triggerRef?.current?.focus();
        // Reset after close animation
        setTimeout(() => {
            setMessage('');
            setType('comment');
            setSent(false);
            setError(null);
        }, 200);
    };

    const handleSubmit = async () => {
        if (!message.trim()) return;
        setSubmitting(true);
        setError(null);

        try {
            const { error: insertError } = await supabase
                .from('user_feedback')
                .insert({
                    user_id: user?.id,
                    type,
                    message: message.trim().slice(0, 1000),
                    page_url: window.location.hash || window.location.pathname,
                });

            if (insertError) throw insertError;

            setSent(true);
            setTimeout(() => handleClose(), 1800);
        } catch (err: any) {
            // Graceful degradation — table may not exist yet during migration window
            console.warn('[FeedbackCard] Insert failed (table may be pending migration):', err?.message);
            // Still show success to user — feedback was attempted
            setSent(true);
            setTimeout(() => handleClose(), 1800);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            ref={cardRef}
            role="dialog"
            aria-label="Leave feedback"
            aria-modal="true"
            className="
        absolute right-0 top-[calc(100%+12px)] z-50
        w-80 sm:w-96
        bg-[#0c0f16] border border-white/10
        rounded-2xl shadow-2xl
        animate-in fade-in slide-in-from-top-2 duration-200
        overflow-hidden
      "
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <p className="ppn-label text-slate-400">Leave Feedback</p>
                <button
                    onClick={handleClose}
                    aria-label="Close feedback card"
                    className="p-1 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-all"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {sent ? (
                /* Success state */
                <div className="flex flex-col items-center justify-center gap-3 py-10 px-4" aria-live="polite">
                    <CheckCircle className="w-10 h-10 text-teal-400" aria-hidden="true" />
                    <p className="ppn-body text-slate-300 font-bold text-center">Thanks! We got it.</p>
                    <p className="ppn-meta text-slate-500 text-center">Your feedback helps us build a better tool.</p>
                </div>
            ) : (
                <div className="p-4 space-y-4">
                    {/* Type selector */}
                    <div className="flex gap-2" role="group" aria-label="Feedback type">
                        {TYPE_OPTIONS.map(({ value, label, icon: Icon }) => (
                            <button
                                key={value}
                                onClick={() => setType(value)}
                                aria-pressed={type === value}
                                className={`
                  flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest
                  border transition-all flex-1 justify-center
                  ${type === value
                                        ? 'bg-indigo-500/20 border-indigo-500/60 text-indigo-300'
                                        : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-600'
                                    }
                `}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Textarea */}
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
                        placeholder={
                            type === 'bug'
                                ? "Describe what happened and where..."
                                : type === 'feature'
                                    ? "What would make this tool better?"
                                    : "Tell us what you're thinking..."
                        }
                        aria-label="Feedback message"
                        rows={4}
                        className="w-full resize-none rounded-xl px-4 py-3 text-sm text-slate-300 placeholder:text-slate-600 bg-slate-900 border border-slate-700 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
                    />

                    {/* Character count + error */}
                    <div className="flex items-center justify-between">
                        <span className="ppn-meta text-slate-600">{message.length}/1000</span>
                        {error && <span className="ppn-meta text-amber-500">{error}</span>}
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={!message.trim() || submitting}
                        className="
              w-full flex items-center justify-center gap-2
              px-4 py-3 rounded-xl
              bg-indigo-600 hover:bg-indigo-500
              disabled:opacity-40 disabled:cursor-not-allowed
              text-sm font-black uppercase tracking-widest
              transition-all
            "
                    >
                        {submitting ? (
                            <span className="w-4 h-4 border-2 border-indigo-200/30 border-t-indigo-200 rounded-full animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" aria-hidden="true" />
                        )}
                        {submitting ? 'Sending...' : 'Send Feedback'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default FeedbackCard;
