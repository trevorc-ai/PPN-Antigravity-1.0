import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface RequestNewOptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: 'baseline' | 'session' | 'integration' | 'safety';
    type: 'observation' | 'cancellation_reason';
}

/**
 * RequestNewOptionModal Component
 * 
 * Allows users to request new clinical observations or cancellation reasons
 * to be added to the reference tables by network admins
 * 
 * Part of WO_042 PHI compliance - controlled vocabulary expansion
 */
export const RequestNewOptionModal: React.FC<RequestNewOptionModalProps> = ({
    isOpen,
    onClose,
    category,
    type
}) => {
    const [requestText, setRequestText] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!requestText.trim()) return;

        try {
            setLoading(true);
            setError(null);

            // Get current user and site
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // Get user's site
            const { data: userSite } = await supabase
                .from('log_user_sites')
                .select('site_id')
                .eq('user_id', user.id)
                .single();

            if (!userSite) throw new Error('No site assigned');

            // Submit feature request
            const { error: insertError } = await supabase
                .from('log_feature_requests')
                .insert([{
                    user_id: user.id,
                    site_id: userSite.site_id,
                    request_type: type,
                    requested_text: requestText.trim(),
                    category: type === 'observation' ? category : null,
                    status: 'pending'
                }]);

            if (insertError) throw insertError;

            setSubmitted(true);
            setTimeout(() => {
                handleClose();
            }, 2000);
        } catch (err: any) {
            console.error('Error submitting request:', err);
            setError(err.message || 'Failed to submit request');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setRequestText('');
        setSubmitted(false);
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card-glass rounded-2xl p-6 max-w-md w-full shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-[#A8B5D1]">
                        Request New Option
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-slate-300 hover:text-slate-300 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {!submitted ? (
                    <>
                        {/* Description */}
                        <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                            Suggest a new {type === 'observation' ? 'clinical observation' : 'cancellation reason'}
                            {type === 'observation' && ` for ${category} assessments`} to be added to the system.
                            Network administrators will review your request.
                        </p>

                        {/* Category Badge (for observations) */}
                        {type === 'observation' && (
                            <div className="mb-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    Category: {category.charAt(0).toUpperCase() + category.slice(1)}
                                </span>
                            </div>
                        )}

                        {/* Input */}
                        <div className="mb-4">
                            <label className="text-[#A8B5D1] text-sm font-medium mb-2 block">
                                Suggested Text
                            </label>
                            <textarea
                                value={requestText}
                                onChange={(e) => setRequestText(e.target.value)}
                                placeholder={
                                    type === 'observation'
                                        ? "e.g., Patient reports improved sleep quality"
                                        : "e.g., Childcare emergency"
                                }
                                className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-[#A8B5D1] placeholder-slate-500 transition-colors"
                                rows={3}
                                maxLength={200}
                            />
                            <p className="text-slate-400 text-sm mt-1">
                                {requestText.length}/200 characters
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-red-300 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleSubmit}
                                disabled={!requestText.trim() || loading}
                                className="flex-1 py-2 px-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-[#A8B5D1] font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        Submit Request
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleClose}
                                disabled={loading}
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-slate-300 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                ) : (
                    /* Success State */
                    <div className="text-center py-8">
                        <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                        <p className="text-emerald-300 font-medium text-lg mb-2">Request Submitted!</p>
                        <p className="text-slate-300 text-sm">
                            Network administrators will review your suggestion and may add it to the system.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestNewOptionModal;
